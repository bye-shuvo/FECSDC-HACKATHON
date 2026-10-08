const crypto = require('node:crypto');

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failuresByIp = new Map();
const configuredUser = process.env.ADMIN_USER;
const configuredPassword = process.env.ADMIN_PASSWORD;
const enabled = Boolean(
  configuredUser && configuredPassword && configuredPassword.length >= 12,
);

if (!enabled) {
  console.warn('Admin routes disabled: configure ADMIN_USER and a 12+ character ADMIN_PASSWORD.');
}

const expectedUserDigest = digest(configuredUser || '');
const expectedPasswordDigest = digest(configuredPassword || '');

function digest(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

function clientIp(req) {
  if (process.env.RENDER === 'true') {
    const forwardedFor = req.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0].trim() || req.ip;
  }
  return req.ip;
}

function sendUnauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Admin", charset="UTF-8"');
  res.status(401).type('text/plain').send('Unauthorized');
}

function adminAuth(req, res, next) {
  if (!enabled) {
    res.status(503).type('text/plain').send('Admin disabled');
    return;
  }

  const ip = clientIp(req);
  const now = Date.now();
  const existing = failuresByIp.get(ip);
  if (existing && now - existing.firstFailureAt >= WINDOW_MS) {
    failuresByIp.delete(ip);
  }

  const active = failuresByIp.get(ip);
  if (active && active.count >= MAX_FAILURES) {
    const retryAfter = Math.max(1, Math.ceil((active.firstFailureAt + WINDOW_MS - now) / 1000));
    res.set('Retry-After', String(retryAfter));
    res.status(429).type('text/plain').send('Too many failed attempts');
    return;
  }

  const authorization = req.get('authorization') || '';
  const match = /^Basic\s+([A-Za-z0-9+/]+={0,2})$/i.exec(authorization);
  let username = '';
  let password = '';
  if (match) {
    try {
      const decoded = Buffer.from(match[1], 'base64').toString('utf8');
      const separator = decoded.indexOf(':');
      if (separator >= 0) {
        username = decoded.slice(0, separator);
        password = decoded.slice(separator + 1);
      }
    } catch {
      // Invalid credentials are handled as an authentication failure.
    }
  }

  const usernameMatches = crypto.timingSafeEqual(digest(username), expectedUserDigest);
  const passwordMatches = crypto.timingSafeEqual(digest(password), expectedPasswordDigest);
  if (match && usernameMatches && passwordMatches) {
    failuresByIp.delete(ip);
    next();
    return;
  }

  if (!active) {
    failuresByIp.set(ip, { count: 1, firstFailureAt: now });
  } else {
    active.count += 1;
  }
  sendUnauthorized(res);
}

module.exports = adminAuth;
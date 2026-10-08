'use strict';

const crypto = require('node:crypto');
const views = require('../views/adminCrudViews');

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const WRITE_WINDOW_MS = 60 * 1000;
const WRITE_LIMIT = 30;
const writesByIp = new Map();

function csrfKey() {
  const username = process.env.ADMIN_USER || '';
  const password = process.env.ADMIN_PASSWORD || '';
  return crypto.createHash('sha256').update(`${username}:${password}`, 'utf8').digest();
}

function makeToken(action, now = Date.now()) {
  const timestamp = String(now);
  const encodedTimestamp = Buffer.from(timestamp, 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', csrfKey()).update(`${timestamp}:${action}`, 'utf8').digest('base64url');
  return `${encodedTimestamp}.${signature}`;
}

function actionFor(resource, operation, id) {
  const path = `/admin/${resource}${id === undefined ? '' : `/${id}`}${operation === 'delete' ? '/delete' : ''}`;
  return `POST:${path}`;
}

function validToken(token, action, now = Date.now()) {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return false;

  let timestamp;
  try {
    timestamp = Buffer.from(parts[0], 'base64url').toString('utf8');
  } catch {
    return false;
  }
  if (!/^\d{13}$/.test(timestamp)) return false;
  const issuedAt = Number(timestamp);
  if (issuedAt > now || now - issuedAt > TOKEN_TTL_MS) return false;

  const expected = crypto.createHmac('sha256', csrfKey()).update(`${timestamp}:${action}`, 'utf8').digest();
  let supplied;
  try {
    supplied = Buffer.from(parts[1], 'base64url');
  } catch {
    return false;
  }
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

function rejectCrossOrigin(req) {
  const site = (req.get('sec-fetch-site') || '').toLowerCase();
  if (site === 'same-origin') return false;
  if (site === 'cross-site' || site === 'same-site') return true;

  // Older browsers without Fetch Metadata: fall back to Origin/Referer
  const expectedHost = (req.get('host') || '').toLowerCase();
  for (const header of ['origin', 'referer']) {
    const value = req.get(header);
    if (!value) continue;
    if (value === 'null') return true;
    try {
      if (new URL(value).host.toLowerCase() !== expectedHost) return true;
    } catch {
      return true;
    }
  }
  return false;
}

function verify(action) {
  return (req, res, next) => {
    try {
      const resolvedAction = typeof action === 'function' ? action(req) : action;
      if (!rejectCrossOrigin(req) && validToken(req.body?._csrf, resolvedAction)) {
        next();
        return;
      }
      res.status(403).type('html').send(views.renderMessage('Request rejected', 'The form could not be verified. Reload the page and try again.'));
    } catch {
      if (!res.headersSent) {
        res.status(403).type('html').send(views.renderMessage('Request rejected', 'The form could not be verified. Reload the page and try again.'));
      }
    }
  };
}

function mutationLimiter(req, res, next) {
  const forwardedFor = process.env.RENDER === 'true' ? req.get('x-forwarded-for') : '';
  const ip = (forwardedFor && forwardedFor.split(',')[0].trim()) || req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  let bucket = writesByIp.get(ip);
  if (!bucket || now - bucket.startedAt >= WRITE_WINDOW_MS) {
    bucket = { startedAt: now, count: 0 };
    writesByIp.set(ip, bucket);
  }
  if (bucket.count >= WRITE_LIMIT) {
    const retryAfter = Math.max(1, Math.ceil((bucket.startedAt + WRITE_WINDOW_MS - now) / 1000));
    res.set('Retry-After', String(retryAfter));
    res.status(429).type('html').send(views.renderMessage('Too many changes', 'Please wait before making another change.'));
    return;
  }
  bucket.count += 1;
  if (writesByIp.size > 10000) {
    for (const [key, current] of writesByIp) {
      if (now - current.startedAt >= WRITE_WINDOW_MS) writesByIp.delete(key);
    }
  }
  next();
}

module.exports = { makeToken, validToken, actionFor, verify, mutationLimiter };

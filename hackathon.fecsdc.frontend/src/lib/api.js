/**
 * API Client & Payload Type Definitions
 * Aligned with database schema: questions, users, submissions.
 */

/**
 * @typedef {Object} UserPayload
 * @property {string} name - VARCHAR(100) NOT NULL
 * @property {number} batch - INT NOT NULL
 * @property {string} email - VARCHAR(255) NOT NULL UNIQUE
 */

/**
 * @typedef {Object} UserResponse
 * @property {number} id - INT PK AUTO_INCREMENT
 * @property {string} name - VARCHAR(100)
 * @property {number} batch - INT
 * @property {string} email - VARCHAR(255)
 * @property {string} [created_at] - TIMESTAMP
 */

/**
 * @typedef {Object} QuestionItem
 * @property {number} id - INT PK
 * @property {string} category - VARCHAR
 * @property {string} question_text - TEXT
 * @property {number} score - INT
 * @property {string} [created_at] - TIMESTAMP
 */

/**
 * @typedef {Object} SubmissionPayload
 * @property {number} question_id - INT NOT NULL FK->questions.id
 * @property {number} user_id - INT NOT NULL FK->users.id
 * @property {string} github_url - VARCHAR(2048) NOT NULL
 * @property {string} readme_url - VARCHAR(2048) NOT NULL
 */

/**
 * @typedef {Object} SubmissionResponse
 * @property {number} id - INT PK
 * @property {number} question_id - INT
 * @property {number|null} user_id - INT|null
 * @property {string} github_url - VARCHAR(2048)
 * @property {string} readme_url - VARCHAR(2048)
 * @property {string} [created_at] - TIMESTAMP
 */

export class ApiClientError extends Error {
  constructor(message, status = 500, fieldErrors = null, data = null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fieldErrors = fieldErrors || {};
    this.data = data;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

// ─── In-memory cache ───────────────────────────────────────────────────────────

/** @type {Map<string, {data: any, ts: number, ttl: number}>} */
const memCache = new Map();

/** @type {Map<string, Promise<any>>} In-flight GET deduplication */
const inFlight = new Map();

const SESSION_CACHE_PREFIX = "fecsdc_cache_";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 min

function makeCacheKey(url) {
  return "GET:" + url;
}

function isFresh(entry) {
  return Date.now() - entry.ts < entry.ttl;
}

function readSessionCache(key) {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    return entry && typeof entry.ts === "number" && "data" in entry ? entry : null;
  } catch {
    return null;
  }
}

function writeSessionCache(key, data, ttl) {
  try {
    sessionStorage.setItem(
      SESSION_CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now(), ttl })
    );
  } catch {
    // quota exceeded or blocked — ignore
  }
}

// ─── Cache store (useSyncExternalStore compatible) ─────────────────────────────

const cacheStoreListeners = new Set();

function notifyCacheStore() {
  cacheStoreListeners.forEach((l) => l());
}

export const cacheStore = {
  subscribe(listener) {
    cacheStoreListeners.add(listener);
    return () => cacheStoreListeners.delete(listener);
  },
  get(url) {
    const key = makeCacheKey(url);
    let entry = memCache.get(key);
    if (!entry) {
      entry = readSessionCache(key);
      if (entry) memCache.set(key, entry);
    }
    return entry ? entry.data : null;
  },
};

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

/**
 * Standard fetch wrapper with 10s timeout via AbortController, typed errors, no console logs.
 * Accepts an optional external signal (e.g. from component AbortController on unmount).
 *
 * @param {string} endpoint
 * @param {RequestInit & {signal?: AbortSignal}} [options]
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), DEFAULT_TIMEOUT_MS);

  const callerSignal = options.signal;

  const abortForCaller = () => timeoutController.abort();
  if (callerSignal?.aborted) timeoutController.abort();
  else callerSignal?.addEventListener("abort", abortForCaller, { once: true });

  const config = {
    ...options,
    signal: timeoutController.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(endpoint, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try { data = await response.json(); } catch { data = null; }
    } else {
      try {
        const text = await response.text();
        data = text ? { message: text } : null;
      } catch { data = null; }
    }

    if (!response.ok) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      let fieldErrors = null;

      if (data && typeof data === "object") {
        if (data.message && typeof data.message === "string") errorMessage = data.message;
        else if (data.error && typeof data.error === "string") errorMessage = data.error;

        if (data.fieldErrors && typeof data.fieldErrors === "object") fieldErrors = data.fieldErrors;
        else if (data.errors && typeof data.errors === "object") fieldErrors = data.errors;
      }

      if (response.status === 409) {
        errorMessage = "This email is already registered.";
        fieldErrors = { email: "This email is already registered." };
      }

      throw new ApiClientError(errorMessage, response.status, fieldErrors, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiClientError) throw err;

    if (err.name === "AbortError") {
      // Distinguish component-unmount abort from timeout abort
      if (callerSignal && callerSignal.aborted) {
        throw new ApiClientError("Request cancelled.", 0);
      }
      throw new ApiClientError("Request timed out. Please check your connection and retry.", 408);
    }

    throw new ApiClientError("Network error. Unable to reach server.", 0);
  } finally {
    clearTimeout(timeoutId);
    callerSignal?.removeEventListener("abort", abortForCaller);
  }
}

// ─── GET retry ────────────────────────────────────────────────────────────────

const RETRY_DELAYS_MS = [300, 900];

async function fetchWithRetry(url, options, retriesLeft) {
  try {
    return await apiFetch(url, options);
  } catch (err) {
    const shouldRetry =
      err instanceof ApiClientError &&
      (err.status === 0 || err.status >= 500) &&
      err.status !== 408 &&
      retriesLeft > 0 &&
      !(options.signal && options.signal.aborted);

    if (shouldRetry) {
      const attemptIndex = 2 - retriesLeft; // 0 for first retry, 1 for second
      const delay = RETRY_DELAYS_MS[attemptIndex] ?? 300;
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retriesLeft - 1);
    }
    throw err;
  }
}

// ─── Cached GET (5-min TTL, sessionStorage persist, dedup, SWR) ───────────────

function _doRevalidate(url, key, ttl, persist, signal) {
  if (inFlight.has(key)) return inFlight.get(key);
  const request = fetchWithRetry(url, { signal }, 2)
    .then((fresh) => {
      const existing = memCache.get(key);
      const changed = !existing || JSON.stringify(existing.data) !== JSON.stringify(fresh);
      memCache.set(key, { data: fresh, ts: Date.now(), ttl });
      if (persist) writeSessionCache(key, fresh, ttl);
      if (changed) notifyCacheStore();
    })
    .catch(() => {
      // Background revalidation failure is silent
    })
    .finally(() => {
      if (inFlight.get(key) === request) inFlight.delete(key);
    });
  inFlight.set(key, request);
  return request;
}

/**
 * GET with: in-memory + sessionStorage cache, in-flight dedup, stale-while-revalidate, retry.
 *
 * @param {string} url
 * @param {{ttl?: number, signal?: AbortSignal, persist?: boolean}} [opts]
 * @returns {Promise<any>}
 */
export async function cachedGet(url, opts) {
  const { ttl = DEFAULT_TTL_MS, signal, persist = false } = opts || {};
  const key = makeCacheKey(url);

  // 1. Fresh memory hit
  const memEntry = memCache.get(key);
  if (memEntry && isFresh(memEntry)) return memEntry.data;

  // 2. sessionStorage hit (read-only GET cache across page reloads)
  if (persist && !memEntry) {
    const sess = readSessionCache(key);
    if (sess) {
      memCache.set(key, { data: sess.data, ts: Date.now(), ttl });
      // Kick off background revalidation, don't await
      _doRevalidate(url, key, ttl, persist, signal);
      return sess.data;
    }
  }

  // 3. Stale-while-revalidate: have stale data → return it instantly, refresh in background
  if (memEntry) {
    _doRevalidate(url, key, ttl, persist, signal);
    return memEntry.data;
  }

  // 4. In-flight dedup: identical concurrent GETs share one promise
  if (inFlight.has(key)) return inFlight.get(key);

  // 5. Fresh network fetch with retry
  const p = (async () => {
    try {
      const data = await fetchWithRetry(url, { signal }, 2);
      memCache.set(key, { data, ts: Date.now(), ttl });
      if (persist) writeSessionCache(key, data, ttl);
      notifyCacheStore();
      return data;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, p);
  return p;
}

/**
 * Fire-and-forget cache warm-up. Never blocks render.
 * @param {string} url
 * @param {{ttl?: number, persist?: boolean}} [opts]
 */
export function prefetch(url, opts) {
  cachedGet(url, opts).catch(() => {});
}

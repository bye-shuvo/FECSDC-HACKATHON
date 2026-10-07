const STORAGE_KEY = "fecsdc_user";
const USER_EVENT = "fecsdc:user-change";

let cachedRaw;
let cachedUser = null;
let hasCachedSnapshot = false;

function isValidUser(value) {
  return value !== null
    && typeof value === "object"
    && Number.isInteger(value.id)
    && value.id > 0
    && typeof value.email === "string"
    && value.email.trim().length > 0;
}

function readSnapshot() {
  if (typeof window === "undefined") return null;

  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (hasCachedSnapshot && raw === cachedRaw) return cachedUser;

  cachedRaw = raw;
  hasCachedSnapshot = true;
  if (raw === null) {
    cachedUser = null;
    return cachedUser;
  }

  try {
    const parsed = JSON.parse(raw);
    if (isValidUser(parsed)) {
      cachedUser = parsed;
      return cachedUser;
    }
  } catch {
    // Invalid stored data is removed below.
  }

  cachedUser = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
  } catch {
    // Keep registration available when storage is restricted.
  }
  return cachedUser;
}

export function readUser() {
  return readSnapshot();
}

export function getUserSnapshot() {
  return readSnapshot();
}

// Client storage is cosmetic; verification and duplicate rules are enforced by the backend.
export function saveUser(user) {
  const savedUser = { ...user, registeredAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedUser));
  } catch {
    // Registration remains successful if storage is restricted.
  }
  window.dispatchEvent(new Event(USER_EVENT));
}

export function clearUser() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Registration remains available if storage is restricted.
  }
  window.dispatchEvent(new Event(USER_EVENT));
}

export function subscribeUser(callback) {
  const handleStorage = (event) => {
    if (event.key === null || event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(USER_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(USER_EVENT, callback);
  };
}

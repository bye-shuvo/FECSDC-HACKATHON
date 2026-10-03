import { useSyncExternalStore } from "react";

// Shared 1-second interval ticker for all countdowns across the application.
// Pauses automatically when the tab is hidden to avoid unnecessary work.
let tickerInterval = null;
const listeners = new Set();
let currentTime = Date.now();

function startTicker() {
  if (tickerInterval) return;
  tickerInterval = setInterval(() => {
    currentTime = Date.now();
    listeners.forEach((l) => l());
  }, 1000);
}

function stopTicker() {
  if (tickerInterval) {
    clearInterval(tickerInterval);
    tickerInterval = null;
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopTicker();
  } else {
    // Re-sync time so the display is accurate immediately on tab refocus
    currentTime = Date.now();
    listeners.forEach((l) => l());
    if (listeners.size > 0) startTicker();
  }
}

// Install the visibility listener exactly once at module level
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function subscribe(listener) {
  listeners.add(listener);
  if (!document.hidden) startTicker();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stopTicker();
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return currentTime;
}

export function useCountdown(targetDateString) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const target = new Date(targetDateString).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      totalSeconds: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSeconds: Math.floor(difference / 1000),
  };
}

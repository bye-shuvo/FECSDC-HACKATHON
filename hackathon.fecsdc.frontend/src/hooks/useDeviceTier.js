/**
 * useDeviceTier — computed once per page load, never re-renders.
 *
 * Tiers:
 *   "low"  — (pointer: coarse) OR deviceMemory ≤ 4 OR saveData OR reduced-motion
 *             → native cursor, no aurora, no blur, no JS animation loops
 *   "mid"  — fine pointer + weak GPU signal (no deviceMemory info means we err
 *             toward mid on mobile-class browsers)
 *             → CSS image cursor, per-card hover glow only, no global spotlight
 *   "high" — fine pointer, no low signals
 *             → full JS cursor, aurora, all effects
 *
 * NOTE: hardwareConcurrency intentionally excluded (unreliable / fingerprinting risk).
 */

function computeTier() {
  if (typeof window === "undefined") return "high";

  const nav = typeof navigator !== "undefined" ? navigator : {};
  const deviceMemory = nav.deviceMemory;
  const connection = nav.connection;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = connection?.saveData === true;
  const lowMemory = Number.isFinite(deviceMemory) && deviceMemory <= 4;

  // low = (pointer: coarse) OR deviceMemory <= 4 OR saveData OR reduced-motion
  if (coarsePointer || lowMemory || saveData || reducedMotion) {
    return "low";
  }

  // mid = fine pointer with weak hardware
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const slowConnection = connection && (
    connection.effectiveType === "2g" ||
    connection.effectiveType === "3g" ||
    connection.effectiveType === "slow-2g"
  );
  const midMemory = Number.isFinite(deviceMemory) && deviceMemory > 4 && deviceMemory <= 8;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent || "");

  if (finePointer && (midMemory || slowConnection || isMobileUA)) {
    return "mid";
  }

  return "high";
}

// Compute once per session
const DEVICE_TIER = computeTier();

if (typeof document !== "undefined") {
  document.documentElement.dataset.tier = DEVICE_TIER;
}

/**
 * @returns {"low" | "mid" | "high"}
 */
export function useDeviceTier() {
  return DEVICE_TIER;
}

/** Convenience predicates */
export const isLowTier = () => DEVICE_TIER === "low";
export const isMidTier = () => DEVICE_TIER === "mid";
export const isHighTier = () => DEVICE_TIER === "high";


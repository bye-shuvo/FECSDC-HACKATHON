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

  const { deviceMemory, connection } = window.navigator;

  const coarsePointer =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(any-pointer: coarse)").matches;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const saveData = connection?.saveData === true;

  const lowMemory =
    Number.isFinite(deviceMemory) && deviceMemory <= 4;

  // Low tier: touch / accessibility / save-data / constrained memory
  if (coarsePointer || reducedMotion || saveData || lowMemory) {
    return "low";
  }

  // Fine pointer but we can't confirm a strong GPU — treat as mid unless
  // we have explicit evidence of high-tier (nothing to go on here without
  // running a GPU benchmark, so high is the default for fine-pointer).
  // If you want to be more conservative, change this to "mid".
  return "high";
}

// Compute once — never changes within a session.
const DEVICE_TIER = computeTier();

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

/**
 * Motion configuration, easing functions, spring presets, and animation helpers.
 */
import { cubicBezier } from "animejs";
import { isLowTier } from "../hooks/useDeviceTier.js";

// Custom cubic-bezier easing: out-expo style (fast start, silky deceleration)
export const MOTION_EASE = [0.22, 1, 0.36, 1];
export const MOTION_EASE_EXPO = [0.16, 1, 0.3, 1];
export const MOTION_EASE_FAST = [0.4, 0, 0.2, 1];

// Shared anime.js v4 cubicBezier easing functions (replaces string eases across codebase)
export const ANIME_EASE_EXPO = cubicBezier(0.16, 1, 0.3, 1);
export const ANIME_EASE_IN_OUT_SINE = cubicBezier(0.37, 0, 0.63, 1);
export const ANIME_EASE_IN_OUT_QUAD = cubicBezier(0.45, 0, 0.55, 1);
export const ANIME_EASE_OUT_QUAD = cubicBezier(0.25, 1, 0.5, 1);

// Consistent spring configuration across interactive elements
export const MOTION_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const MOTION_SPRING_SNAPPY = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

// Initial site loader timings
export const LOADER_TIMINGS = {
  minDisplayMs: 900,
  maxDisplayMs: 2500,
  exitDuration: 0.6, // 600ms
  exitEase: [0.16, 1, 0.3, 1],
  barStaggerMs: 75,
  charStaggerMs: 30,
};

// Route transition overlay timings
export const ROUTE_TRANSITION_TIMINGS = {
  coverDuration: 0.35, // 350ms
  revealDuration: 0.4, // 400ms
  barStagger: 0.06, // 60ms
  ease: [0.16, 1, 0.3, 1],
  totalMaxDurationMs: 900,
};

// Page transition presets (Fade + subtle 8px Y shift, 250ms)
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: MOTION_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: MOTION_EASE,
    },
  },
};

// Scroll reveal variants
export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: MOTION_EASE,
    },
  }),
};

// Container stagger variants
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Utility to check if user prefers reduced motion
export function shouldReduceMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldUseStaticPointerEffects() {
  if (typeof window === "undefined") return true;
  return isLowTier();
}


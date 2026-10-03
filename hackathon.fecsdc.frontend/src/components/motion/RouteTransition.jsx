import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ROUTE_TRANSITION_TIMINGS, shouldReduceMotion } from "../../lib/motion.js";
import { useLoaderDone } from "../../hooks/useLoaderDone.js";

const BARS = [
  { id: 1, color: "var(--primary)" },
  { id: 2, color: "var(--accent-amber)" },
  { id: 3, color: "var(--brand-slate)" },
  { id: 4, color: "var(--primary)" },
];

export function RouteTransition() {
  const location = useLocation();
  const { isLoaderDone } = useLoaderDone();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState("idle"); // "idle" | "cover" | "reveal"
  const prevPathRef = useRef(location.pathname);
  const isFirstMountRef = useRef(true);
  const timerRef = useRef([]);

  const clearAllTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  useEffect(() => {
    // Skip on first mount (handled by SiteLoader)
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevPathRef.current = location.pathname;
      return;
    }

    // Skip if pathname has not changed (e.g. only search params or hash changed)
    if (location.pathname === prevPathRef.current) {
      return;
    }

    prevPathRef.current = location.pathname;

    // Skip heavy pill animation if reduced motion is requested
    if (shouldReduceMotion()) {
      window.scrollTo(0, 0);
      focusMainHeading();
      return;
    }

    clearAllTimers();
    setIsTransitioning(true);
    setPhase("cover");

    // Phase 1: Cover (350ms)
    const coverTimer = setTimeout(() => {
      setPhase("reveal");
      // Scroll to top or anchor
      if (location.hash) {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
      focusMainHeading();

      // Phase 2: Reveal (400ms)
      const revealTimer = setTimeout(() => {
        setPhase("idle");
        setIsTransitioning(false);
      }, ROUTE_TRANSITION_TIMINGS.revealDuration * 1000 + 150);

      timerRef.current.push(revealTimer);
    }, ROUTE_TRANSITION_TIMINGS.coverDuration * 1000 + 100);

    timerRef.current.push(coverTimer);

    return () => {
      clearAllTimers();
    };
  }, [location.pathname]);

  const focusMainHeading = () => {
    setTimeout(() => {
      const heading = document.querySelector("main h1") || document.querySelector("main");
      if (heading) {
        heading.setAttribute("tabIndex", "-1");
        heading.focus({ preventScroll: true });
      }
    }, 50);
  };

  if (!isTransitioning) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] ${
        phase === "cover" ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* 4 Staggered Horizontal Pill Bars Sliding In and Out */}
      <div className="absolute inset-0 flex flex-col w-full h-full">
        {BARS.map((bar, index) => {
          const delay = index * ROUTE_TRANSITION_TIMINGS.barStagger;
          return (
            <motion.div
              key={bar.id}
              initial={{ scaleX: 0, originX: 0 }}
              animate={
                phase === "cover"
                  ? { scaleX: 1, originX: 0 }
                  : { scaleX: 0, originX: 1 }
              }
              transition={{
                duration:
                  phase === "cover"
                    ? ROUTE_TRANSITION_TIMINGS.coverDuration
                    : ROUTE_TRANSITION_TIMINGS.revealDuration,
                delay,
                ease: ROUTE_TRANSITION_TIMINGS.ease,
              }}
              style={{ backgroundColor: bar.color }}
              className="flex-1 w-full will-change-transform"
            />
          );
        })}
      </div>

      {/* Center Wordmark: "hackathon fecsdc" */}
      <AnimatePresence>
        {phase === "cover" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="px-6 py-2.5 rounded-full bg-background/90 border border-border shadow-2xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight lowercase">
                hackathon fecsdc
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

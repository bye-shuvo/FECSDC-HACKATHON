import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { shouldReduceMotion } from "../../lib/motion.js";

/**
 * Creative Signature Pill-Bar Loader
 * Staggered animation using the 3 brand colors (Orange, Amber, Slate).
 */
export function PillLoader({ message = "LOADING ENVIRONMENT..." }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion()) return;
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll(".pill-bar-unit");
    if (!bars || !bars.length) return;

    const animation = animate(bars, {
      scaleY: [0.35, 1.3, 0.35],
      opacity: [0.4, 1, 0.4],
      delay: stagger(140),
      duration: 850,
      loop: true,
      ease: "inOutSine",
    });

    return () => {
      if (animation && animation.revert) {
        animation.revert();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[50vh] flex flex-col items-center justify-center gap-6 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 h-10">
        <span
          className="pill-bar-unit w-2.5 h-8 rounded-full origin-center"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <span
          className="pill-bar-unit w-2.5 h-10 rounded-full origin-center"
          style={{ backgroundColor: "var(--accent-amber)" }}
        />
        <span
          className="pill-bar-unit w-2.5 h-6 rounded-full origin-center"
          style={{ backgroundColor: "var(--brand-slate)" }}
        />
        <span
          className="pill-bar-unit w-2.5 h-9 rounded-full origin-center"
          style={{ backgroundColor: "var(--primary)" }}
        />
      </div>
      <p className="font-label text-muted-foreground text-xs tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );
}

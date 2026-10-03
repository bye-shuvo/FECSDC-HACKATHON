import { motion } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";

/**
 * Reveal Component
 * Smoothly reveals content as it scrolls into viewport (once).
 * Transform & opacity only to prevent layout thrashing.
 */
export function Reveal({
  children,
  delay = 0,
  yOffset = 18,
  duration = 0.45,
  className = "",
  as = "div",
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: MOTION_EASE,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

import { motion } from "motion/react";
import { MOTION_SPRING_SNAPPY } from "../../lib/motion.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

/**
 * SplitText Component
 * Renders characters wrapped in inline-block motion spans for staggered clip reveal & hover lift.
 */
export function SplitText({
  text,
  className = "",
  highlightIndices = [],
  highlightClass = "gradient-text-brand",
  delay = 0,
}) {
  const prefersReduced = useReducedMotion();

  const chars = Array.from(text);

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {chars.map((char, index) => {
        if (char === " ") {
          return <span key={index}>&nbsp;</span>;
        }

        const isHighlighted = highlightIndices.includes(index);

        return (
          <motion.span
            key={index}
            initial={prefersReduced ? {} : { y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.45,
              delay: delay + index * 0.025,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={
              prefersReduced
                ? {}
                : {
                    y: -4,
                    color: "var(--accent-amber)",
                    transition: MOTION_SPRING_SNAPPY,
                  }
            }
            className={`inline-block will-change-transform ${
              isHighlighted ? highlightClass : ""
            }`}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

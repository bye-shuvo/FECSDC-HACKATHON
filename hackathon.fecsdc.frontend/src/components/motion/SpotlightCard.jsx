import { useRef } from "react";
import { motion } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";
import { shouldUseStaticPointerEffects } from "../../lib/motion.js";
import { usePointerBounds } from "../../hooks/usePointerBounds.js";

/**
 * SpotlightCard
 * Card with smooth hover lift (-4px) and subtle radial spotlight tracking the cursor.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(244, 123, 48, 0.08)", // subtle brand orange glow
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const staticEffects = shouldUseStaticPointerEffects();
  const boundsRef = usePointerBounds(cardRef, !staticEffects);

  const handleMouseMove = (e) => {
    const rect = boundsRef.current;
    if (!rect || !spotlightRef.current) return;
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`;
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.display = "block";
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.display = "none";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={staticEffects ? undefined : handleMouseMove}
      onMouseEnter={staticEffects ? undefined : handleMouseEnter}
      onMouseLeave={staticEffects ? undefined : handleMouseLeave}
      whileHover={staticEffects ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: MOTION_EASE }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-primary/60 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {!staticEffects && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            display: "none",
            background: `radial-gradient(400px circle at -200px -200px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

import { useRef } from "react";
import { motion } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";
import { shouldUseStaticPointerEffects } from "../../lib/motion.js";
import { usePointerBounds } from "../../hooks/usePointerBounds.js";

/**
 * SpotlightCard
 * Card with smooth hover lift (-4px), scale .98 press state, and radial gradient border + fill
 * following cursor via CSS vars or direct gradient. Focus-visible ring and data-cursor="card".
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(244, 123, 48, 0.12)",
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
    spotlightRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`;
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
      data-cursor="card"
      onMouseMove={staticEffects ? undefined : handleMouseMove}
      onMouseEnter={staticEffects ? undefined : handleMouseEnter}
      onMouseLeave={staticEffects ? undefined : handleMouseLeave}
      whileHover={staticEffects ? undefined : { y: -4 }}
      whileTap={staticEffects ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: MOTION_EASE }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-sm border border-border bg-card transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-ring ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {!staticEffects && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            display: "none",
            background: `radial-gradient(350px circle at -200px -200px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

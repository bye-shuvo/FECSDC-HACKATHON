import { useRef, useState } from "react";
import { motion } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

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
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -200, y: -200 });
      }}
      whileHover={prefersReduced ? {} : { y: -4 }}
      transition={{ duration: 0.25, ease: MOTION_EASE }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-primary/60 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      {!prefersReduced && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

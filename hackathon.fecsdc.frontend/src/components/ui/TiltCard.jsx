import { useRef, useState } from "react";
import { motion } from "motion/react";
import { MOTION_SPRING } from "../../lib/motion.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

/**
 * TiltCard Component
 * 3D perspective tilt via cursor coordinate offsets (max 8deg, perspective 900px).
 * Internal glare highlight layer following cursor.
 * Disabled on touch & reduced-motion.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div style={{ perspective: "900px" }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={
          prefersReduced
            ? {}
            : {
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }
        }
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        transition={MOTION_SPRING}
        onClick={onClick}
        data-cursor="card"
        className={`relative overflow-hidden rounded-md border border-border bg-card transition-colors duration-200 hover:border-primary/70 focus-visible:outline-2 focus-visible:outline-ring ${className}`}
        style={{ transformStyle: "preserve-3d" }}
        {...props}
      >
        {/* Dynamic Glare Highlight */}
        {glare && isHovered && !prefersReduced && (
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-30 z-20"
            style={{
              background: `radial-gradient(400px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(248, 156, 46, 0.18), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 w-full h-full" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

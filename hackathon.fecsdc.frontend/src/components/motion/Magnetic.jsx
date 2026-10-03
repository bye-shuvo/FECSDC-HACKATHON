import { useRef, useState } from "react";
import { motion } from "motion/react";
import { MOTION_SPRING_SNAPPY } from "../../lib/motion.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

/**
 * Magnetic component
 * Pulls slightly toward cursor within bounded radius, snapping back on leave.
 */
export function Magnetic({ children, strength = 0.25, className = "" }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    setPosition({
      x: distanceX * strength,
      y: distanceY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={MOTION_SPRING_SNAPPY}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MOTION_SPRING_SNAPPY } from "../../lib/motion.js";
import { shouldUseStaticPointerEffects } from "../../lib/motion.js";
import { usePointerBounds } from "../../hooks/usePointerBounds.js";

/**
 * Magnetic component
 * Pulls slightly toward cursor within bounded radius, snapping back on leave.
 */
export function Magnetic({ children, strength = 0.25, className = "" }) {
  const ref = useRef(null);
  const staticEffects = shouldUseStaticPointerEffects();
  const boundsRef = usePointerBounds(ref, !staticEffects);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MOTION_SPRING_SNAPPY);
  const springY = useSpring(y, MOTION_SPRING_SNAPPY);

  if (staticEffects) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e) => {
    if (!boundsRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = boundsRef.current;
    // Bounds are relative to document; clientX is viewport. Adjust with scroll or direct client rect:
    const rectLeft = left - window.scrollX;
    const rectTop = top - window.scrollY;
    const centerX = rectLeft + width / 2;
    const centerY = rectTop + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

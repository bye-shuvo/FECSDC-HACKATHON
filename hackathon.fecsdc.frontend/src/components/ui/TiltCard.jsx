import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
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
  const glareRef = useRef(null);
  const boundsRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, MOTION_SPRING);
  const springRotateY = useSpring(rotateY, MOTION_SPRING);

  const updateBounds = useCallback(() => {
    if (cardRef.current) boundsRef.current = cardRef.current.getBoundingClientRect();
  }, []);

  const stopObservingBounds = useCallback(() => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    window.removeEventListener("resize", updateBounds);
    window.removeEventListener("scroll", updateBounds, true);
  }, [updateBounds]);

  useEffect(() => () => stopObservingBounds(), [stopObservingBounds]);

  const handleMouseMove = (e) => {
    if (prefersReduced || !boundsRef.current) return;
    const rect = boundsRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(((y - centerY) / centerY) * -maxTilt);
    rotateY.set(((x - centerX) / centerX) * maxTilt);
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(400px circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(248, 156, 46, 0.18), transparent 70%)`;
    }
  };

  const handleMouseEnter = () => {
    updateBounds();
    if (typeof ResizeObserver !== "undefined" && cardRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateBounds);
      resizeObserverRef.current.observe(cardRef.current);
    }
    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true, capture: true });
    if (glareRef.current) glareRef.current.style.display = "block";
  };
  const handleMouseLeave = () => {
    stopObservingBounds();
    boundsRef.current = null;
    if (glareRef.current) glareRef.current.style.display = "none";
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: "900px" }} className="w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        transition={MOTION_SPRING}
        onClick={onClick}
        data-cursor="card"
        className={`relative overflow-hidden rounded-md border border-border bg-card transition-colors duration-200 hover:border-primary/70 focus-visible:outline-2 focus-visible:outline-ring ${className}`}
        {...props}
      >
        {/* Dynamic Glare Highlight */}
        {glare && !prefersReduced && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-30 z-20"
            style={{
              display: "none",
              background: "radial-gradient(400px circle at 50% 50%, rgba(248, 156, 46, 0.18), transparent 70%)",
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

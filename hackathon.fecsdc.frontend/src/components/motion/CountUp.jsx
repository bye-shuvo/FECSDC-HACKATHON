import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { shouldReduceMotion } from "../../lib/motion.js";

/**
 * Animated number counter using anime.js
 * Triggered on enter view with IntersectionObserver.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const spanRef = useRef(null);
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !spanRef.current) return;

    if (shouldReduceMotion()) {
      spanRef.current.textContent = `${prefix}${to}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const counterObj = { val: from };

          animate(counterObj, {
            val: to,
            ease: "outExpo",
            duration,
            onUpdate: () => {
              if (spanRef.current) {
                spanRef.current.textContent = `${prefix}${Math.round(counterObj.val)}${suffix}`;
              }
            },
          });

          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [to, from, duration, prefix, suffix]);

  return (
    <span ref={containerRef} className={className}>
      <span ref={spanRef} className="tabular-nums">
        {prefix}{from}{suffix}
      </span>
    </span>
  );
}

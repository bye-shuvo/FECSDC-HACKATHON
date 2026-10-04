import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { shouldReduceMotion, shouldUseStaticPointerEffects } from "../../lib/motion.js";
import { useSharedInView } from "../../hooks/useSharedInView.js";

/**
 * Hero Pill Bar Choreography Background
 * Signature motif: floating rounded pill bars (from logo) with slow drift loop.
 * Pauses when offscreen or when reduced motion is preferred.
 */
export function HeroPillBackground() {
  const [containerRef, isInView] = useSharedInView({ once: false });
  const animRef = useRef(null);
  const isInViewRef = useRef(isInView);
  const staticEffects = shouldUseStaticPointerEffects();

  useEffect(() => {
    if (shouldReduceMotion() || !containerRef.current) return;

    const pills = containerRef.current.querySelectorAll(".hero-drift-pill");
    if (!pills || !pills.length) return;
    const animatedPills = staticEffects
      ? Array.from(pills).slice(0, 3)
      : pills;

    // Anime.js staggered floating drift
    animRef.current = animate(animatedPills, {
      translateY: [-12, 12],
      translateX: [-8, 8],
      opacity: [0.12, 0.26],
      delay: stagger(150),
      duration: 4800,
      alternate: true,
      loop: true,
      autoplay: false,
      ease: "inOutQuad",
    });
    if (isInViewRef.current && !document.hidden) animRef.current.play();

    const onVisibilityChange = () => {
      if (!animRef.current) return;
      if (document.hidden || !isInViewRef.current) animRef.current.pause();
      else animRef.current.play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (animRef.current && animRef.current.pause) {
        animRef.current.pause();
      }
    };
  }, [staticEffects]);

  useEffect(() => {
    isInViewRef.current = isInView;
    if (!animRef.current) return;
    if (isInView && !document.hidden) animRef.current.play();
    else animRef.current.pause();
  }, [isInView]);

  // Preset pill configurations: distinct coordinates, lengths, and colors
  const pills = [
    { top: "10%", left: "8%", width: "120px", height: "14px", color: "var(--primary)", rotate: "-15deg" },
    { top: "18%", left: "75%", width: "160px", height: "18px", color: "var(--accent-amber)", rotate: "25deg" },
    { top: "35%", left: "4%", width: "90px", height: "12px", color: "var(--brand-slate)", rotate: "10deg" },
    { top: "45%", left: "85%", width: "140px", height: "16px", color: "var(--primary)", rotate: "-20deg" },
    { top: "65%", left: "12%", width: "180px", height: "20px", color: "var(--accent-amber)", rotate: "15deg" },
    { top: "72%", left: "78%", width: "110px", height: "14px", color: "var(--brand-slate)", rotate: "-10deg" },
    { top: "82%", left: "32%", width: "150px", height: "16px", color: "var(--primary)", rotate: "5deg" },
    { top: "25%", left: "48%", width: "80px", height: "10px", color: "var(--accent-amber)", rotate: "-30deg" },
  ];

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {pills.map((pill, idx) => (
        <div
          key={idx}
          className="hero-drift-pill absolute rounded-full"
          style={{
            top: pill.top,
            left: pill.left,
            width: pill.width,
            height: pill.height,
            backgroundColor: pill.color,
            transform: `rotate(${pill.rotate})`,
            opacity: 0.16,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Subtle radial center vignette to keep typography razor-sharp */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 20%, var(--background) 95%)",
        }}
      />
    </div>
  );
}

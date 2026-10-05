import { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { animate, stagger } from "animejs";
import { shouldReduceMotion, ANIME_EASE_IN_OUT_SINE } from "../../lib/motion.js";
import { useSharedInView } from "../../hooks/useSharedInView.js";
import { isHighTier, isLowTier } from "../../hooks/useDeviceTier.js";

const pills = [
  { top: "8%", left: "5%", width: "160px", height: "14px", color: "var(--primary)" },
  { top: "16%", left: "70%", width: "200px", height: "18px", color: "var(--accent-amber)" },
  { top: "32%", left: "12%", width: "120px", height: "12px", color: "var(--brand-slate)" },
  { top: "48%", left: "80%", width: "180px", height: "16px", color: "var(--primary)" },
  { top: "62%", left: "18%", width: "140px", height: "14px", color: "var(--accent-amber)" },
  { top: "78%", left: "75%", width: "220px", height: "18px", color: "var(--brand-slate)" },
  { top: "88%", left: "30%", width: "150px", height: "12px", color: "var(--primary)" },
];

/**
 * BackgroundScene Component
 * Layered fixed background system with per-route variants:
 * - High tier: full aurora blur + parallax grid with mask + 7 drifting pills + cursor spotlight
 * - Mid tier: full aurora + grid + pills, no global spotlight (CSS card hover glow only)
 * - Low tier: static radial gradient aurora, static unmasked grid, 3 static pills, 0 full-screen animated layers
 */
export function BackgroundScene({ variant = "content" }) {
  const [containerRef, isInView] = useSharedInView({ once: false });
  const pillFieldRef = useRef(null);
  const animRef = useRef(null);
  const isInViewRef = useRef(isInView);
  const lowTier = isLowTier();
  const highTier = isHighTier();

  const { scrollY } = useScroll();
  // Faint parallax 0.05 on scroll (high/mid tier only)
  const gridY = useTransform(scrollY, [0, 2000], [0, 100]);

  useEffect(() => {
    if (
      shouldReduceMotion() ||
      lowTier ||
      !pillFieldRef.current ||
      variant !== "landing"
    ) return;

    const pillElements = pillFieldRef.current.querySelectorAll(".bg-pill-bar");
    if (!pillElements.length) return;

    animRef.current = animate(pillElements, {
      translateX: [-18, 18],
      translateY: [-10, 10],
      opacity: [0.08, 0.18],
      delay: stagger(180),
      duration: 5200,
      alternate: true,
      loop: true,
      autoplay: false,
      ease: ANIME_EASE_IN_OUT_SINE,
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
      if (animRef.current && animRef.current.pause) animRef.current.pause();
    };
  }, [lowTier, variant]);


  useEffect(() => {
    isInViewRef.current = isInView;
    if (!animRef.current) return;
    if (isInView && !document.hidden) animRef.current.play();
    else animRef.current.pause();
  }, [isInView]);

  const displayPills = lowTier ? pills.slice(0, 3) : pills;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base SVG Noise Grain (High / Mid tier only - omitted on Low tier) */}
      {!lowTier && (
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* 2. Grid (Low tier: static unmasked grid; Mid/High tier: Parallax + Radial Mask) */}
      {lowTier ? (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      ) : (
        <motion.div
          style={{ y: gridY }}
          className="absolute -inset-10 opacity-[0.06]"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%)",
            }}
          />
        </motion.div>
      )}

      {/* 3. Pill-Bar Field (Logo Motif) */}
      <div ref={pillFieldRef} className="absolute inset-0">
        {displayPills.map((pill, idx) => (
          <div
            key={idx}
            className="bg-pill-bar absolute rounded-full"
            style={{
              top: pill.top,
              left: pill.left,
              width: pill.width,
              height: pill.height,
              backgroundColor: pill.color,
              opacity: lowTier ? 0.08 : 0.12,
              filter: lowTier ? "none" : "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* 4. Global cursor spotlight (High tier ONLY - removed on mid and low) */}
      {highTier && (
        <div
          id="background-cursor-spotlight"
          className="pointer-events-none absolute left-0 top-0 h-[1200px] w-[1200px] will-change-transform"
          style={{
            transform: "translate3d(-700px, -700px, 0)",
            background: "radial-gradient(600px circle at 50% 50%, rgba(244, 123, 48, 0.07), transparent 60%)",
          }}
        />
      )}

      {/* 5. Aurora Blobs: High/Mid tier uses blur + drift; Low tier uses static radial-gradient */}
      {variant === "landing" && (
        lowTier ? (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 30% 25%, rgba(244, 123, 48, 0.09) 0%, transparent 55%), radial-gradient(circle at 75% 65%, rgba(248, 156, 46, 0.07) 0%, transparent 50%)",
            }}
          />
        ) : (
          <>
            <div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.14] animate-hero-float"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <div
              className="absolute top-2/3 right-1/4 w-[420px] h-[420px] rounded-full blur-[130px] opacity-[0.12] animate-hero-float"
              style={{ backgroundColor: "var(--accent-amber)", animationDelay: "-3s" }}
            />
          </>
        )
      )}

      {/* Locked Variant: Scanline Overlay */}
      {variant === "locked" && (
        <div className="absolute inset-0 scanline-overlay opacity-40" />
      )}

      {/* Results Variant: Confetti-lite Pill Particles */}
      {variant === "results" && (
        <div className="absolute inset-0 opacity-20">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="absolute w-6 h-2 rounded-full animate-bounce"
              style={{
                top: `${(i * 12) % 90}%`,
                left: `${(i * 14) % 85}%`,
                backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--accent-amber)",
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


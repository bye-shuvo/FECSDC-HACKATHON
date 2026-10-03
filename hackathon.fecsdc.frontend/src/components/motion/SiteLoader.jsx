import { useState, useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { useLoaderDone } from "../../hooks/useLoaderDone.js";
import { LOADER_TIMINGS, shouldReduceMotion } from "../../lib/motion.js";

const TEXT = "hackathon fecsdc";

export function SiteLoader() {
  const { isLoaderDone, markLoaderDone } = useLoaderDone();
  const [shouldRender, setShouldRender] = useState(!isLoaderDone);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    // If already seen in this session, do not render
    if (isLoaderDone) {
      setShouldRender(false);
      return;
    }

    const reducedMotion = shouldReduceMotion();

    // Lock body scroll during load
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fast-path for reduced motion: quick fade out and mark done
    if (reducedMotion) {
      const timer = setTimeout(() => {
        document.body.style.overflow = originalOverflow;
        markLoaderDone();
        setShouldRender(false);
      }, 150);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }

    const startTime = Date.now();
    let isMounted = true;
    let exitTriggered = false;

    // Track real readiness: fonts ready + window load
    const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    const windowPromise = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve, { once: true });
      }
    });

    // 1. Initial Intro Animation Timeline using anime.js
    if (containerRef.current) {
      const bars = containerRef.current.querySelectorAll(".loader-pill-bar");
      const chars = containerRef.current.querySelectorAll(".loader-char");

      const tl = createTimeline();
      timelineRef.current = tl;

      // 3 pill bars sweep in from left staggered 75ms
      tl.add(bars, {
        scaleX: [0, 1],
        opacity: [0, 1],
        duration: 450,
        delay: stagger(LOADER_TIMINGS.barStaggerMs),
        ease: "outExpo",
      })
      // Text letters rise per-char with clip mask, stagger 30ms
      .add(chars, {
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        duration: 500,
        delay: stagger(LOADER_TIMINGS.charStaggerMs),
        ease: "outExpo",
      }, "-=200");
    }

    // 2. Real Progress Tracking + Caps
    const updateProgress = (pct) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(pct)}%`;
      }
    };

    // Smooth progress simulation that checks real promises
    let currentPct = 10;
    updateProgress(currentPct);

    const progressInterval = setInterval(() => {
      if (currentPct < 85) {
        currentPct += Math.random() * 12 + 6;
        if (currentPct > 85) currentPct = 85;
        updateProgress(currentPct);
      }
    }, 120);

    const triggerExit = () => {
      if (exitTriggered || !isMounted) return;
      exitTriggered = true;
      clearInterval(progressInterval);
      updateProgress(100);

      // Whole screen exits upward (translateY -100%, 600ms, cubic-bezier(.16,1,.3,1))
      if (containerRef.current) {
        animate(containerRef.current, {
          translateY: [0, "-100%"],
          duration: 600,
          ease: "cubicBezier(0.16, 1, 0.3, 1)",
          onComplete: () => {
            if (isMounted) {
              document.body.style.overflow = originalOverflow;
              markLoaderDone();
              setShouldRender(false);
            }
          },
        });
      } else {
        document.body.style.overflow = originalOverflow;
        markLoaderDone();
        setShouldRender(false);
      }
    };

    // Wait for real readiness with minDisplay (900ms) and maxDisplay (2500ms) caps
    Promise.all([fontsPromise, windowPromise]).then(() => {
      const elapsed = Date.now() - startTime;
      const remainingMin = Math.max(0, LOADER_TIMINGS.minDisplayMs - elapsed);
      setTimeout(triggerExit, remainingMin);
    });

    // Hard fallback cap at 2500ms
    const hardCapTimer = setTimeout(triggerExit, LOADER_TIMINGS.maxDisplayMs);

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
      clearTimeout(hardCapTimer);
      document.body.style.overflow = originalOverflow;
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, [isLoaderDone, markLoaderDone]);

  if (!shouldRender) return null;

  return (
    <aside
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading FEC SDC Hackathon platform"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background select-none will-change-transform"
    >
      <div className="flex flex-col items-center text-center px-4">
        {/* 3 Staggered Pill Bars (Orange, Amber, Slate) */}
        <div className="flex items-center gap-2 mb-6" aria-hidden="true">
          <span
            className="loader-pill-bar w-2 h-7 rounded-full origin-left opacity-0"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <span
            className="loader-pill-bar w-2 h-9 rounded-full origin-left opacity-0"
            style={{ backgroundColor: "var(--accent-amber)" }}
          />
          <span
            className="loader-pill-bar w-2 h-6 rounded-full origin-left opacity-0"
            style={{ backgroundColor: "var(--brand-slate)" }}
          />
        </div>

        {/* Wordmark "hackathon fecsdc" with per-character clip mask */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground lowercase mb-8 flex items-center justify-center overflow-hidden">
          {Array.from(TEXT).map((char, index) => {
            if (char === " ") {
              return <span key={index} className="w-2.5 sm:w-3" />;
            }
            return (
              <span key={index} className="inline-block overflow-hidden py-1">
                <span className="loader-char inline-block will-change-transform opacity-0">
                  {char}
                </span>
              </span>
            );
          })}
        </h1>

        {/* Thin Progress Pill */}
        <div
          className="w-48 sm:w-64 h-1.5 rounded-full bg-muted/80 overflow-hidden relative border border-border/60"
          aria-hidden="true"
        >
          <div
            ref={progressBarRef}
            className="h-full rounded-full transition-all duration-150 ease-out will-change-transform"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, var(--primary) 0%, var(--accent-amber) 100%)",
            }}
          />
        </div>

        {/* Live progress percentage */}
        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span ref={progressTextRef}>0%</span>
        </div>
      </div>
    </aside>
  );
}

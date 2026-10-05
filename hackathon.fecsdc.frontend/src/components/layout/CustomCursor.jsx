import { useEffect, useRef, memo } from "react";
import { Lock, MoveHorizontal, Eye } from "lucide-react";
import { isHighTier } from "../../hooks/useDeviceTier.js";
import { shouldUseStaticPointerEffects } from "../../lib/motion.js";

/**
 * CustomCursor Component
 * High-tier only dual-layer cursor with zero jitter:
 * - Direct target dot (no lerp)
 * - Frame-rate independent lerp ring with k≈18
 * - Pure ref writes on pointermove with single rAF loop
 * - translate3d with no transition on outer elements, no blend/filter on ring
 * - Idle shutdown (<0.05px for 500ms), stops on visibilitychange / tab hidden
 * - Mid tier uses CSS image cursor; low tier mounts nothing (native cursor)
 */
export const CustomCursor = memo(function CustomCursor() {
  if (!isHighTier()) {
    return null;
  }

  const cursorRootRef = useRef(null);

  const dotWrapperRef = useRef(null);
  const ringWrapperRef = useRef(null);
  const innerRingRef = useRef(null);
  const rippleWrapperRef = useRef(null);
  const spotlightRef = useRef(null);
  const lockIconRef = useRef(null);
  const dragIconRef = useRef(null);
  const viewIconRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const isClickingRef = useRef(false);

  // Position refs for jitter-free tracking
  const target = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const hasFirstMove = useRef(false);
  const pointerInside = useRef(false);
  const rafId = useRef(null);
  const isLoopRunning = useRef(false);
  const lastTimeRef = useRef(0);
  const idleTimeRef = useRef(0);
  const lastResolvedState = useRef("default");

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad) and when reduced motion is not active
    const finePointer =
      window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(any-pointer: fine)").matches;
    if (!finePointer || shouldUseStaticPointerEffects()) {
      document.body.classList.remove("custom-cursor-active");
      return;
    }

    document.body.classList.add("custom-cursor-active");
    spotlightRef.current = document.getElementById("background-cursor-spotlight");
    const setCursorVisible = (visible) => {
      const opacity = visible ? "1" : "0";
      if (cursorRootRef.current && cursorRootRef.current.style.opacity !== opacity) {
        cursorRootRef.current.style.opacity = opacity;
      }
    };
    const applyCursorState = (state, label) => {
      if (!innerRingRef.current) return;
      innerRingRef.current.dataset.cursorState = state;
      innerRingRef.current.className = `border flex items-center justify-center transition-all duration-150 ease-out ${getInnerRingClass(state)} ${isClickingRef.current ? "scale-75" : ""}`;
      if (lockIconRef.current) lockIconRef.current.style.display = state === "locked" ? "block" : "none";
      if (dragIconRef.current) dragIconRef.current.style.display = state === "drag" ? "block" : "none";
      if (viewIconRef.current) viewIconRef.current.style.display = state === "view" ? "block" : "none";
      if (cursorLabelRef.current) {
        cursorLabelRef.current.textContent = label;
        cursorLabelRef.current.style.display = state === "button" && label ? "inline" : "none";
      }
    };

    const renderLoop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const rawDt = (timestamp - lastTimeRef.current) / 1000;
      const dt = Number.isFinite(rawDt) ? Math.min(Math.max(rawDt, 0), 0.05) : 0.016;
      lastTimeRef.current = timestamp;

      if (
        !Number.isFinite(target.current.x) ||
        !Number.isFinite(target.current.y) ||
        !Number.isFinite(ringPos.current.x) ||
        !Number.isFinite(ringPos.current.y)
      ) {
        rafId.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Frame-rate independent lerp: pos += (target - pos) * (1 - Math.exp(-dt * k)), k=18
      const k = 18;
      const factor = 1 - Math.exp(-dt * k);
      const dx = target.current.x - ringPos.current.x;
      const dy = target.current.y - ringPos.current.y;

      ringPos.current.x += dx * factor;
      ringPos.current.y += dy * factor;

      // Snap when delta < 0.1px
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ringPos.current.x = target.current.x;
        ringPos.current.y = target.current.y;
      }

      // Apply JS transform to outer wrapper only
      if (ringWrapperRef.current) {
        ringWrapperRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (dotWrapperRef.current) {
        dotWrapperRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (rippleWrapperRef.current) {
        rippleWrapperRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${target.current.x - 600}px, ${target.current.y - 600}px, 0)`;
      }
      if (hasFirstMove.current && pointerInside.current) setCursorVisible(true);

      // Idle stop condition (<0.05px for 500ms)
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        idleTimeRef.current += dt;
        if (idleTimeRef.current > 0.5) {
          isLoopRunning.current = false;
          rafId.current = null;
          return;
        }
      } else {
        idleTimeRef.current = 0;
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    const startLoop = () => {
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        idleTimeRef.current = 0;
        lastTimeRef.current = performance.now();
        rafId.current = requestAnimationFrame(renderLoop);
      }
    };

    const onPointerMove = (e) => {
      // Disregard non-fine pointer events (touch, pen)
      if (e.pointerType && e.pointerType !== "mouse") return;

      const x = e.clientX;
      const y = e.clientY;

      target.current.x = x;
      target.current.y = y;
      if (!pointerInside.current) pointerInside.current = true;

      // Initial placement: snap ring directly to cursor without fly-in from (0,0)
      if (!hasFirstMove.current) {
        hasFirstMove.current = true;
        ringPos.current.x = x;
        ringPos.current.y = y;
      }

      startLoop();
    };

    const onMouseDown = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      isClickingRef.current = true;
      innerRingRef.current?.classList.add("scale-75");
      if (rippleWrapperRef.current) {
        const ripple = rippleWrapperRef.current.firstElementChild;
        if (ripple) {
          ripple.style.transform = "scale(1.8)";
          ripple.style.opacity = "0.75";
          setTimeout(() => {
            ripple.style.opacity = "0";
            ripple.style.transform = "scale(0.3)";
          }, 180);
        }
      }
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      innerRingRef.current?.classList.remove("scale-75");
    };
    const onPointerLeave = () => {
      pointerInside.current = false;
      setCursorVisible(false);
    };
    const onPointerEnter = () => {
      pointerInside.current = true;
      if (hasFirstMove.current) setCursorVisible(true);
    };

    // Event delegation with cached comparison to avoid unnecessary state re-renders
    const onPointerOver = (e) => {
      const targetEl = e.target.closest("[data-cursor], a, button, input, textarea, select");
      let nextState = "default";
      let nextLabel = "";

      if (targetEl) {
        const explicitState = targetEl.getAttribute("data-cursor");
        const explicitLabel = targetEl.getAttribute("data-cursor-label") || "";

        if (explicitState) {
          nextState = explicitState;
          nextLabel = explicitLabel;
        } else {
          const tag = targetEl.tagName.toLowerCase();
          if (tag === "input" || tag === "textarea") {
            nextState = "text";
          } else if (tag === "button" || targetEl.getAttribute("role") === "button") {
            nextState = "button";
          } else if (tag === "a") {
            nextState = "link";
          }
        }
      }

      if (nextState !== lastResolvedState.current) {
        lastResolvedState.current = nextState;
        applyCursorState(nextState, nextLabel);
      }
    };

    const pauseLoop = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      isLoopRunning.current = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        pointerInside.current = false;
        setCursorVisible(false);
        pauseLoop();
      } else {
        pointerInside.current = document.documentElement.matches(":hover");
        if (hasFirstMove.current && pointerInside.current) setCursorVisible(true);
      }
    };
    const onBlur = () => {
      pointerInside.current = false;
      setCursorVisible(false);
      pauseLoop();
    };
    const onFocus = () => {
      pointerInside.current = document.documentElement.matches(":hover");
      if (hasFirstMove.current && pointerInside.current) {
        setCursorVisible(true);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onMouseDown);
    window.addEventListener("pointerup", onMouseUp);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onMouseDown);
      window.removeEventListener("pointerup", onMouseUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      isLoopRunning.current = false;
    };
  }, []);

  // If touch or reduced motion, render nothing
  if (
    typeof window !== "undefined" &&
    (!window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(any-pointer: fine)").matches ||
      shouldUseStaticPointerEffects())
  ) {
    return null;
  }

  // Inner ring styling based on cursor state.
  const getInnerRingClass = (state) => {
    switch (state) {
      case "link":
        return "w-12 h-12 -ml-[24px] -mt-[24px] rounded-full border-primary/80 bg-primary/15 scale-110";
      case "button":
        return "w-14 h-9 -ml-[28px] -mt-[18px] rounded-full border-accent-amber/90 bg-primary/20 scale-105 shadow-sm";
      case "card":
        return "w-6 h-6 -ml-[12px] -mt-[12px] rounded-full border-primary/40 bg-transparent";
      case "text":
        return "w-1 h-6 -ml-[2px] -mt-[12px] rounded-none border-0 bg-primary/80";
      case "locked":
        return "w-10 h-10 -ml-[20px] -mt-[20px] rounded-full border-accent-amber bg-background/90 text-accent-amber shadow-md";
      case "drag":
        return "w-12 h-12 -ml-[24px] -mt-[24px] rounded-full border-primary bg-primary/10 text-primary";
      case "view":
        return "w-14 h-14 -ml-[28px] -mt-[28px] rounded-full border-primary bg-card/90 text-primary";
      default:
        return "w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border-primary/50 bg-transparent";
    }
  };

  return (
    <div
      ref={cursorRootRef}
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-200 opacity-0"
      aria-hidden="true"
    >
      {/* 1. Instant Dot Outer Wrapper (Fixed position, translate3d in rAF) */}
      <div
        ref={dotWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-20"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <div
          className="w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-primary"
        />
      </div>

      {/* 2. Smoothed Ring Outer Wrapper (Fixed position, lerp translate3d in rAF) */}
      <div
        ref={ringWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-10"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {/* Inner Morphable Shape (CSS classes & transitions handle shape/scale) */}
        <div
          ref={innerRingRef}
          className={`border flex items-center justify-center transition-all duration-150 ease-out ${getInnerRingClass("default")}`}
        >
          <Lock ref={lockIconRef} className="w-3.5 h-3.5" style={{ display: "none" }} />
          <MoveHorizontal ref={dragIconRef} className="w-4 h-4" style={{ display: "none" }} />
          <Eye ref={viewIconRef} className="w-4 h-4" style={{ display: "none" }} />
          <span ref={cursorLabelRef} className="font-mono text-[9px] text-white tracking-widest uppercase font-bold" style={{ display: "none" }} />
        </div>
      </div>

      {/* 3. Ripple Outer Wrapper */}
      <div
        ref={rippleWrapperRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-0"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <div className="w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-primary/70 opacity-0 pointer-events-none transition-all duration-200 ease-out" />
      </div>
    </div>
  );
});

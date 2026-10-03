import { useEffect, useState, useRef } from "react";

// Singleton observer instance to avoid allocating multiple observers across the DOM
let sharedObserver = null;
const observerCallbacks = new Map();

function getSharedObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observerCallbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting, entry);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      }
    );
  }

  return sharedObserver;
}

/**
 * useSharedInView
 * High-performance hook utilizing a single global IntersectionObserver instance
 * with once-only trigger support.
 */
export function useSharedInView({ once = true } = {}) {
  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = getSharedObserver();
    if (!observer) {
      // Fallback for environments without IntersectionObserver
      setIsInView(true);
      return;
    }

    const handleIntersect = (isIntersecting) => {
      if (isIntersecting) {
        setIsInView(true);
        if (once) {
          observer.unobserve(el);
          observerCallbacks.delete(el);
        }
      } else if (!once) {
        setIsInView(false);
      }
    };

    observerCallbacks.set(el, handleIntersect);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      observerCallbacks.delete(el);
    };
  }, [once]);

  return [elementRef, isInView];
}

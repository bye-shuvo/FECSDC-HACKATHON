import { useLayoutEffect, useRef } from "react";

export function usePointerBounds(elementRef, enabled = true) {
  const boundsRef = useRef(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return undefined;

    const updateBounds = () => {
      const rect = element.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    };

    updateBounds();

    if (typeof ResizeObserver === "undefined") {
      return () => {
        boundsRef.current = null;
      };
    }

    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    return () => {
      observer.disconnect();
      boundsRef.current = null;
    };
  }, [elementRef, enabled]);

  return boundsRef;
}
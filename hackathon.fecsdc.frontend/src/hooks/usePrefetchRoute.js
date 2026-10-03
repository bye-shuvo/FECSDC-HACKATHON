import { useEffect, useRef } from "react";
import { prefetch } from "../lib/api.js";
import { siteConfig } from "../data/siteConfig.js";
import { useLoaderDone } from "./useLoaderDone.js";

// Route path to dynamic import module map
const routeLoaders = {
  "/": () => import("../pages/HomePage.jsx"),
  "/hackathon": () => import("../pages/hackathon/OverviewPage.jsx"),
  "/hackathon/register": () => import("../pages/hackathon/RegisterPage.jsx"),
  "/hackathon/rules": () => import("../pages/hackathon/RulesPage.jsx"),
  "/hackathon/schedule": () => import("../pages/hackathon/SchedulePage.jsx"),
  "/hackathon/about": () => import("../pages/hackathon/AboutPage.jsx"),
  "/hackathon/prizes": () => import("../pages/hackathon/PrizesPage.jsx"),
  "/hackathon/faq": () => import("../pages/hackathon/FaqPage.jsx"),
  "/hackathon/submit": () => import("../pages/hackathon/SubmitPage.jsx"),
  "/challenges": () => import("../pages/ChallengesPage.jsx"),
  "/sponsors": () => import("../pages/SponsorsPage.jsx"),
  "/problem-statements": () => import("../pages/ProblemStatementsPage.jsx"),
  "/results": () => import("../pages/ResultsPage.jsx"),
};

const prefetchedRoutes = new Set();

/**
 * Prefetch a specific route bundle
 */
export function prefetchRoute(path) {
  if (!path) return;
  // Normalize path (strip trailing slash)
  const normalized = path.replace(/\/$/, "") || "/";
  if (prefetchedRoutes.has(normalized)) return;
  const loader = routeLoaders[normalized];
  if (loader) {
    prefetchedRoutes.add(normalized);
    loader().catch(() => {
      // silently ignore prefetch errors
      prefetchedRoutes.delete(normalized);
    });
  }
}

/**
 * Prefetch the questions API data into cache (fire-and-forget).
 * Safe to call multiple times — the cache layer deduplicates.
 */
export function prefetchQuestionsData() {
  if (siteConfig.questionsEndpoint) {
    prefetch(siteConfig.questionsEndpoint, { ttl: 5 * 60 * 1000, persist: true });
  }
}

/**
 * Hook to prefetch top priority routes on browser idle
 */
export function useIdlePrefetchTopRoutes() {
  const { isLoaderDone } = useLoaderDone();

  useEffect(() => {
    if (!isLoaderDone) return;
    const topRoutes = [
      "/",
      "/hackathon/register",
      "/hackathon/rules",
      "/hackathon/schedule",
      "/hackathon/submit",
    ];

    const runPrefetch = () => {
      topRoutes.forEach((route) => {
        prefetchRoute(route);
      });
      // Also warm the questions cache on idle
      prefetchQuestionsData();
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(runPrefetch, { timeout: 3000 });
        return () => window.cancelIdleCallback(id);
      } else {
        const timer = setTimeout(runPrefetch, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaderDone]);
}

/**
 * Hook to return event handlers for 150ms intent-delayed prefetching on links
 */
export function usePrefetchIntent(path) {
  const timeoutRef = useRef(null);

  const onIntent = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      prefetchRoute(path);
      if (path === "/hackathon/submit") prefetchQuestionsData();
    }, 150);
  };

  const cancelIntent = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    onMouseEnter: onIntent,
    onMouseLeave: cancelIntent,
    onFocus: onIntent,
    onBlur: cancelIntent,
    onTouchStart: onIntent,
  };
}

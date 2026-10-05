import { Suspense } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Navbar } from "../components/layout/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";
import { CustomCursor } from "../components/layout/CustomCursor.jsx";
import { BackgroundScene } from "../components/layout/BackgroundScene.jsx";
import { PillLoader } from "../components/motion/PillLoader.jsx";
import { PageTransition } from "../components/motion/PageTransition.jsx";
import { SiteLoader } from "../components/motion/SiteLoader.jsx";
import { RouteTransition } from "../components/motion/RouteTransition.jsx";
import { LoaderProvider } from "../hooks/useLoaderDone.js";
import { ErrorBoundaryClass } from "../components/layout/ErrorBoundary.jsx";
import { shouldUseStaticPointerEffects } from "../lib/motion.js";

function LayoutContent() {
  const location = useLocation();
  const staticEffects = shouldUseStaticPointerEffects();

  // Scroll progress bar — on high tier uses smooth spring; on low tier uses pure CSS scroll progress (zero JS scroll ticks)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Determine background layer variant per active route
  const getBackgroundVariant = () => {
    const path = location.pathname;
    if (path === "/") return "landing";
    if (path.startsWith("/problem-statements")) return "locked";
    if (path === "/results") return "results";
    return "content";
  };

  return (
    <div className="relative min-h-[100svh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      {/* 0. Initial Site Load Screen (Shown once per session) */}
      <SiteLoader />

      {/* 1. Staggered Pill-Bar Route Transition Overlay */}
      <RouteTransition />

      {/* 2. Dual-Layer Jitter-Free Custom Cursor */}
      <CustomCursor />

      {/* 3. Layered Background System with Parallax & Noise */}
      <BackgroundScene variant={getBackgroundVariant()} />

      {/* 4. Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-999 px-4 py-2 bg-primary text-white font-mono text-sm rounded shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* 5. 2px Gradient Scroll Progress Bar at the very top (High tier spring, Low tier compositor CSS) */}
      {!staticEffects ? (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2.5px] gradient-bg-brand z-60 origin-left"
          style={{ scaleX }}
        />
      ) : (
        <div
          className="fixed top-0 left-0 right-0 h-[2.5px] gradient-bg-brand z-60 origin-left scroll-progress-bar"
        />
      )}

      {/* 6. Sticky Navigation Bar */}
      <Navbar />

      {/* 7. Main Dynamic Content */}
      <main id="main-content" className="relative z-10 flex-1 pt-20 flex flex-col">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<PillLoader message="ASSEMBLING MODULE..." />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>

      {/* 8. Footer with Logo Part Replay on Scroll */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* 9. Native Scroll Restoration */}
      <ScrollRestoration />
    </div>
  );
}

export function RootLayout() {
  return (
    <ErrorBoundaryClass>
      <LoaderProvider>
        <LayoutContent />
      </LoaderProvider>
    </ErrorBoundaryClass>
  );
}

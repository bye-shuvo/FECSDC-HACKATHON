import { lazy, Suspense } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { siteConfig } from "../data/siteConfig.js";
import { HeroSection } from "../components/sections/HeroSection.jsx";
import { TechMarqueeSection } from "../components/sections/TechMarqueeSection.jsx";
import { CountdownSection } from "../components/sections/CountdownSection.jsx";
import { StatsSection } from "../components/sections/StatsSection.jsx";

// Below-fold sections lazy loaded to keep initial JS bundle under 150kB gzip
const AboutTeaserSection = lazy(() =>
  import("../components/sections/AboutTeaserSection.jsx").then((m) => ({ default: m.AboutTeaserSection }))
);
const TimelineTeaserSection = lazy(() =>
  import("../components/sections/TimelineTeaserSection.jsx").then((m) => ({ default: m.TimelineTeaserSection }))
);
const PrizesTeaserSection = lazy(() =>
  import("../components/sections/PrizesTeaserSection.jsx").then((m) => ({ default: m.PrizesTeaserSection }))
);
const TracksRailSection = lazy(() =>
  import("../components/sections/TracksRailSection.jsx").then((m) => ({ default: m.TracksRailSection }))
);
const FaqTeaserSection = lazy(() =>
  import("../components/sections/FaqTeaserSection.jsx").then((m) => ({ default: m.FaqTeaserSection }))
);
const FinalCtaSection = lazy(() =>
  import("../components/sections/FinalCtaSection.jsx").then((m) => ({ default: m.FinalCtaSection }))
);

export default function HomePage() {
  useDocumentTitle(
    "FECSDC HACKATHON 2026",
    siteConfig.tagline
  );

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section (Staged Intro Timeline, SplitText, Floating 3D Cards) */}
      <HeroSection />

      {/* 2. Marquee Strip (Dual rows opposite directions) */}
      <TechMarqueeSection />

      {/* 3. Live Countdown (Pill-framed unit blocks, tabular-nums) */}
      <CountdownSection />

      {/* 4. Stats Strip (Count-up on enter, 3D tiltable StatCards) */}
      <StatsSection />

      {/* 5. About + Features (Asymmetric Bento Grid with TiltCards) */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[550px] w-full" aria-hidden="true" />}>
          <AboutTeaserSection />
        </Suspense>
      </div>

      {/* 6. Timeline Preview (Scroll-linked SVG progress line) */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[500px] w-full" aria-hidden="true" />}>
          <TimelineTeaserSection />
        </Suspense>
      </div>

      {/* 7. Prizes Preview (3D Tilt Podium Cards) */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[480px] w-full" aria-hidden="true" />}>
          <PrizesTeaserSection />
        </Suspense>
      </div>

      {/* 8. Tracks & Challenges Preview (Drag-to-scroll horizontal rail) */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[420px] w-full" aria-hidden="true" />}>
          <TracksRailSection />
        </Suspense>
      </div>

      {/* 9. FAQ Teaser Accordion */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[400px] w-full" aria-hidden="true" />}>
          <FaqTeaserSection />
        </Suspense>
      </div>

      {/* 10. Final CTA Band (Oversized heading, magnetic button) */}
      <div className="content-visibility-auto">
        <Suspense fallback={<div className="min-h-[350px] w-full" aria-hidden="true" />}>
          <FinalCtaSection />
        </Suspense>
      </div>
    </div>
  );
}


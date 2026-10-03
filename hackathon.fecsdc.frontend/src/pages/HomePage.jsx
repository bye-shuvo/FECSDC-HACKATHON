import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { siteConfig } from "../data/siteConfig.js";
import { HeroSection } from "../components/sections/HeroSection.jsx";
import { TechMarqueeSection } from "../components/sections/TechMarqueeSection.jsx";
import { CountdownSection } from "../components/sections/CountdownSection.jsx";
import { StatsSection } from "../components/sections/StatsSection.jsx";
import { AboutTeaserSection } from "../components/sections/AboutTeaserSection.jsx";
import { TimelineTeaserSection } from "../components/sections/TimelineTeaserSection.jsx";
import { PrizesTeaserSection } from "../components/sections/PrizesTeaserSection.jsx";
import { TracksRailSection } from "../components/sections/TracksRailSection.jsx";
// import { SponsorsMarqueeSection } from "../components/sections/SponsorsMarqueeSection.jsx";
import { FaqTeaserSection } from "../components/sections/FaqTeaserSection.jsx";
import { FinalCtaSection } from "../components/sections/FinalCtaSection.jsx";

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
        <AboutTeaserSection />
      </div>

      {/* 6. Timeline Preview (Scroll-linked SVG progress line) */}
      <div className="content-visibility-auto">
        <TimelineTeaserSection />
      </div>

      {/* 7. Prizes Preview (3D Tilt Podium Cards) */}
      <div className="content-visibility-auto">
        <PrizesTeaserSection />
      </div>

      {/* 8. Tracks & Challenges Preview (Drag-to-scroll horizontal rail) */}
      <div className="content-visibility-auto">
        <TracksRailSection />
      </div>

      {/* 9. Sponsors Marquee (Grayscale -> Color hover)
      <div className="content-visibility-auto">
        <SponsorsMarqueeSection />
      </div> */}

      {/* 10. FAQ Teaser Accordion */}
      <div className="content-visibility-auto">
        <FaqTeaserSection />
      </div>

      {/* 11. Final CTA Band (Oversized heading, magnetic button) */}
      <div className="content-visibility-auto">
        <FinalCtaSection />
      </div>
    </div>
  );
}

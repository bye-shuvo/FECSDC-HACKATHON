import { useRef, useEffect } from "react";
import { ArrowRight, FileText, ChevronDown, Terminal, Trophy, Users } from "lucide-react";
import { animate, createTimeline, stagger } from "animejs";
import { siteConfig } from "../../data/siteConfig.js";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { PillMark } from "../ui/PillDividers.jsx";
import { TiltCard } from "../ui/TiltCard.jsx";
import { Magnetic } from "../motion/Magnetic.jsx";
import { SplitText } from "../ui/SplitText.jsx";
import { shouldReduceMotion } from "../../lib/motion.js";

import { useLoaderDone } from "../../hooks/useLoaderDone.js";

export function HeroSection() {
  const heroRef = useRef(null);
  const pillSweepRef = useRef(null);
  const { isLoaderDone } = useLoaderDone();

  useEffect(() => {
    if (!isLoaderDone || shouldReduceMotion() || !heroRef.current) return;

    // Staged intro timeline with Anime.js v4
    // 1. Pill bars sweep in from left (75ms steps)
    // 2. Wordmark letters rise
    // 3. Tagline fades in
    // 4. CTAs pop
    const sweepBars = heroRef.current.querySelectorAll(".hero-intro-bar");
    let anim = null;
    if (sweepBars.length) {
      anim = animate(sweepBars, {
        scaleX: [0, 1],
        opacity: [0, 1],
        delay: stagger(95),
        duration: 650,
        ease: "outExpo",
      });
    }

    return () => {
      if (anim && anim.revert) anim.revert();
    };
  }, [isLoaderDone]);

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-[92svh] flex flex-col justify-between overflow-hidden py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-center text-center">
        {/* Top Eyebrow with Staggered Pill Bars */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div
            ref={pillSweepRef}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/80 border border-border"
          >
            <span
              className="hero-intro-bar w-1.5 h-4 rounded-full origin-left inline-block"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="hero-intro-bar w-1.5 h-5 rounded-full origin-left inline-block"
              style={{ backgroundColor: "var(--accent-amber)" }}
            />
            <span
              className="hero-intro-bar w-1.5 h-3.5 rounded-full origin-left inline-block"
              style={{ backgroundColor: "var(--brand-slate)" }}
            />
            <span className="font-label text-xs tracking-widest text-primary font-semibold pl-1.5">
              FEC SDC PRESENTS
            </span>
          </div>

          <Badge variant="primary" dot={true} size="md">
            Open for club members only
          </Badge>
        </div>

        {/* Big Hero H1 with Split-Text Clip Mask & Hover Proximity Shift */}
        <div className="mb-6 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-foreground leading-[1.05]">
            <SplitText text="FECSDC" delay={0.05} />
            <br />
            <span className="inline-block">
              <SplitText text="HACKATHON" delay={0.2} />
            </span>{" "}
            <SplitText text="2026" delay={0.35} />
          </h1>
        </div>

        {/* 1-Line Tagline */}
        <p className="text-sm sm:text-base md:text-lg font-sans text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          {siteConfig.tagline}
        </p>

        {/* Magnetic CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
          <Magnetic strength={0.3}>
            <Button
              to="/hackathon/register"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              className="w-full sm:w-auto min-w-50"
              data-cursor="button"
              data-cursor-label="GO"
            >
              Register now
            </Button>
          </Magnetic>

          <Magnetic strength={0.2}>
            <Button
              to="/hackathon/rules"
              variant="outline"
              size="lg"
              icon={FileText}
              className="w-full sm:w-auto min-w-[180px]"
            >
              View rules
            </Button>
          </Magnetic>
        </div>

        {/* 3D-Tilting Hero Stat Card Cluster (Floating with 6s animation) */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-hero-float">
          <TiltCard maxTilt={8} className="p-4 bg-card/85 backdrop-blur-sm border-border text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-base font-bold text-foreground">6 Hours</div>
                <div className="font-label text-[10px] text-muted-foreground">DEEP CODE SPRINT</div>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} className="p-4 bg-card/85 backdrop-blur-sm border-border text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-base font-bold text-foreground">Exciting Prizes</div>
                <div className="font-label text-[10px] text-muted-foreground">Certificates & More</div>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8} className="p-4 bg-card/85 backdrop-blur-sm border-border text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-brand-slate/20 border border-brand-slate/30 flex items-center justify-center text-foreground shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-base font-bold text-foreground">2 Tracks</div>
                <div className="font-label text-[10px] text-muted-foreground">SPECIALIZED DOMAINS</div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Bouncing Scroll Hint Pill */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-6 text-muted-foreground select-none">
        <a
          href="#live-countdown"
          aria-label="Scroll to countdown"
          className="flex flex-col items-center gap-1 group"
        >
          <span className="font-label text-[10px] tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-5 h-9 rounded-full border border-border flex items-start justify-center p-1 group-hover:border-primary transition-colors">
            <div className="w-1.5 h-2.5 rounded-full bg-primary animate-bounce" />
          </div>
        </a>
      </div>
    </div>
  );
}

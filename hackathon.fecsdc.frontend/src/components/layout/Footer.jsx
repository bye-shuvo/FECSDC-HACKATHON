import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { MessageSquare, Mail, MapPin } from "lucide-react";
import { animate, stagger } from "animejs";
import { BrandLogo, PillDivider, PillMark } from "../ui/PillDividers.jsx";
import { siteConfig } from "../../data/siteConfig.js";
import { shouldReduceMotion, ANIME_EASE_EXPO } from "../../lib/motion.js";
import { isLowTier } from "../../hooks/useDeviceTier.js";

// Custom crisp SVG icons for social channels
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const oversizedWordmarkRef = useRef(null);
  const hasReplayed = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion() || isLowTier() || !oversizedWordmarkRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasReplayed.current) {
          hasReplayed.current = true;
          const bars = oversizedWordmarkRef.current.querySelectorAll(".footer-replay-bar");
          if (bars.length) {
            animate(bars, {
              scaleY: [0.1, 1],
              opacity: [0, 1],
              delay: stagger(75),
              duration: 550,
              ease: ANIME_EASE_EXPO,
            });
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(oversizedWordmarkRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full bg-card/60 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {siteConfig.tagline}
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{siteConfig.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-amber shrink-0" />
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-primary transition-colors">
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              {/* <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEC SDC GitHub"
                className="w-9 h-9 rounded-sm border border-border bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <GithubIcon />
              </a> */}
              <a
                href={siteConfig.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEC SDC Discord Server"
                className="w-9 h-9 rounded-sm border border-border bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-accent-amber hover:border-accent-amber transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEC SDC Facebook Page"
                className="w-9 h-9 rounded-sm border border-border bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <FacebookIcon />
              </a>
              {/* <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FEC SDC LinkedIn"
                className="w-9 h-9 rounded-sm border border-border bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-accent-amber hover:border-accent-amber transition-colors"
              >
                <LinkedinIcon />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <span className="font-label text-xs tracking-widest text-primary uppercase font-semibold">
              HACKATHON
            </span>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li>
                <Link to="/hackathon/register" className="hover:text-foreground transition-colors">
                  Registration
                </Link>
              </li>
              <li>
                <Link to="/hackathon/about" className="hover:text-foreground transition-colors">
                  About Event
                </Link>
              </li>
              <li>
                <Link to="/hackathon/schedule" className="hover:text-foreground transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/hackathon/rules" className="hover:text-foreground transition-colors">
                  Rules & Evaluation
                </Link>
              </li>
              <li>
                <Link to="/hackathon/prizes" className="hover:text-foreground transition-colors">
                  Prizes & Awards
                </Link>
              </li>
              <li>
                <Link to="/hackathon/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Challenges & Competitions */}
          <div className="space-y-3">
            <span className="font-label text-xs tracking-widest text-accent-amber uppercase font-semibold">
              COMPETITION
            </span>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li>
                <Link to="/challenges" className="hover:text-foreground transition-colors">
                  Innovation tracks
                </Link>
              </li>
              <li>
                <Link to="/problem-statements" className="hover:text-foreground transition-colors">
                  Problem statements
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-foreground transition-colors">
                  Final results & scores
                </Link>
              </li>
              {/* <li>
                <Link to="/sponsors" className="hover:text-foreground transition-colors">
                  Partners & mentors
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Club Info */}
          <div className="space-y-3">
            <span className="font-label text-xs tracking-widest text-brand-slate uppercase font-semibold">
              COMMUNITY
            </span>
            <ul className="space-y-2 text-sm text-muted-foreground font-sans">
              <li>
                <span className="text-foreground/90 font-medium">FEC SDC</span>
              </li>
              <li className="text-xs leading-relaxed text-muted-foreground/80">
                Faridpur Engineering College Software Development Club is dedicated to cultivating technical leadership and competitive software engineering.
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-1.5 text-xs text-primary font-label">
                  <PillMark size="sm" />
                  <span>MEMBER EXCLUSIVE</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 12. Oversized FEC SDC Wordmark with Staggered 75ms Logo-Part Replay */}
        <div
          ref={oversizedWordmarkRef}
          className="my-12 py-8 border-y border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 select-none overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <span
              className="footer-replay-bar w-2 sm:w-3 h-12 sm:h-16 rounded-full inline-block origin-bottom"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <span
              className="footer-replay-bar w-2 sm:w-3 h-16 sm:h-20 rounded-full inline-block origin-bottom"
              style={{ backgroundColor: "var(--accent-amber)" }}
            />
            <span
              className="footer-replay-bar w-2 sm:w-3 h-10 sm:h-14 rounded-full inline-block origin-bottom"
              style={{ backgroundColor: "var(--brand-slate)" }}
            />
          </div>

          <div className="font-display text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground/15 text-center md:text-right">
            FEC SDC <span className="text-primary/25">HACKATHON</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground/70">
          <p>© {currentYear} FEC SDC. All rights reserved. Built for FEC SDC Hackathon 2026.</p>
          <p className="flex items-center gap-2">
            <span>ENGINEERED BY: TECHNICAL LEAD</span>
            <span>•</span>
            <a className="text-primary hover:text-accent-amber" href="https://byeshuvo.pages.dev" target="_blank" rel="noopener noreferrer">BYE SHUVO</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

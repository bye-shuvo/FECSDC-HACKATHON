import { Lock } from "lucide-react";
import { siteConfig } from "../../data/siteConfig.js";
import { Countdown } from "./Countdown.jsx";
import { PillMark } from "./PillDividers.jsx";

/**
 * LockedState Component
 * Displays countdown to problem drop, lock icon, scanline overlay, and blurred skeleton cards.
 */
export function LockedState({ revealDate = siteConfig.problemRevealDate }) {
  return (
    <div
      data-cursor="locked"
      className="relative w-full max-w-5xl mx-auto py-8 sm:py-12 px-3 sm:px-4 flex flex-col items-center text-center overflow-hidden"
    >
      {/* Scanline overlay */}
      <div className="scanline-overlay pointer-events-none rounded-sm" />

      {/* Central Lock Callout */}
      <div className="relative z-20 flex flex-col items-center gap-5 sm:gap-6 p-5 sm:p-8 md:p-12 rounded-sm border border-primary/40 bg-card/95 shadow-2xl max-w-2xl w-full">
        <div className="p-4 sm:p-5 md:p-7 rounded-sm bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
          <Lock className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <PillMark size="sm" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-widest text-primary font-bold uppercase">
              SEALED CHALLENGE REPOSITORY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            Problems drop on Hackathon Day
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md mx-auto leading-relaxed">
            All challenge statements remain sealed under cryptographic time-lock until the opening countdown expires.
          </p>
        </div>

        <Countdown
          targetDate={revealDate}
          label="TIME REMAINING UNTIL UNLOCK"
          className="w-full"
        />

        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs font-mono text-muted-foreground bg-muted/60 px-3 sm:px-4 py-1.5 rounded-full border border-border">
          <span className="w-2 h-2 rounded-full bg-accent-amber animate-ping" />
          <span>Scheduled drop: {new Date(revealDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Blurred Background Skeleton Cards */}
      <div
        className="absolute w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12 opacity-25 blur-sm pointer-events-none select-none"
        aria-hidden="true"
      >
        {[1, 2, 3, 4].map((skeleton) => (
          <div
            key={skeleton}
            className="p-4 sm:p-6 rounded-sm border border-border bg-card/50 flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-muted-foreground/30 rounded-full" />
              <div className="h-4 w-16 bg-muted-foreground/20 rounded-full" />
            </div>
            <div className="h-6 w-3/4 bg-foreground/20 rounded-sm" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted-foreground/20 rounded" />
              <div className="h-3 w-5/6 bg-muted-foreground/20 rounded" />
              <div className="h-3 w-2/3 bg-muted-foreground/20 rounded" />
            </div>
            <div className="h-9 w-32 bg-primary/20 rounded-sm mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

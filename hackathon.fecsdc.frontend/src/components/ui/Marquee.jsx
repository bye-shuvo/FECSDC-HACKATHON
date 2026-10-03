import { PillMark } from "./PillDividers.jsx";

/**
 * Dual-row Marquee with edge fade masks, pause on hover, and pill separators.
 */
export function Marquee({
  row1 = [],
  row2 = [],
  className = "",
  speed = "38s",
}) {
  // Duplicate for smooth seamless loop
  const r1Items = [...row1, ...row1, ...row1];
  const r2Items = [...row2, ...row2, ...row2];

  return (
    <div className={`relative w-full overflow-hidden py-4 select-none ${className}`}>
      {/* Left/Right Edge Fade Masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Row 1: Forward Direction (38s) */}
      <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused] mb-4">
        {r1Items.map((item, idx) => (
          <div
            key={`r1-${idx}`}
            className="flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/80 text-xs font-mono font-medium text-foreground shrink-0 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{item}</span>
            <PillMark size="sm" className="opacity-40" />
          </div>
        ))}
      </div>

      {/* Row 2: Reverse Direction (38s) */}
      {row2.length > 0 && (
        <div className="flex gap-6 w-max animate-marquee-reverse hover:[animation-play-state:paused]">
          {r2Items.map((item, idx) => (
            <div
              key={`r2-${idx}`}
              className="flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/60 text-xs font-mono text-muted-foreground shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
              <span>{item}</span>
              <PillMark size="sm" className="opacity-30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

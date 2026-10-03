/**
 * Signature Brand Motif: Pill Bars
 * Implements the rounded pill bars (from logo) in orange #F47B30, amber #F89C2E, slate #4F4F6F
 */

/**
 * Triple Pill Mark (Iconic brand mark)
 */
export function PillMark({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 gap-1",
    md: "h-6 gap-1.5",
    lg: "h-8 gap-2",
  };

  const pillWidths = {
    sm: "w-1",
    md: "w-1.5",
    lg: "w-2",
  };

  const w = pillWidths[size] || pillWidths.md;

  return (
    <div
      className={`inline-flex items-center ${sizes[size] || sizes.md} ${className}`}
      aria-hidden="true"
    >
      <span
        className={`${w} h-[85%] rounded-full`}
        style={{ backgroundColor: "var(--primary)" }}
      />
      <span
        className={`${w} h-full rounded-full`}
        style={{ backgroundColor: "var(--accent-amber)" }}
      />
      <span
        className={`${w} h-[65%] rounded-full`}
        style={{ backgroundColor: "var(--brand-slate)" }}
      />
    </div>
  );
}

/**
 * Brand Logo component (Pill Mark + FEC SDC Wordmark)
 */
export function BrandLogo({ size = "md", className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2.5 font-display select-none ${className}`}>
      <PillMark size={size} />
      <div className="flex flex-col leading-none">
        <span className="font-bold tracking-tight text-foreground text-base">
          FEC <span className="text-primary">SDC</span>
        </span>
        <span className="font-label text-[9px] tracking-widest text-muted-foreground">
          HACKATHON '26
        </span>
      </div>
    </div>
  );
}

/**
 * Section Header Pill Marker
 */
export function SectionPillMarker({ label, className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 mb-3 ${className}`}>
      <PillMark size="sm" />
      <span className="font-label text-xs tracking-widest text-primary uppercase font-semibold">
        {label}
      </span>
    </div>
  );
}

/**
 * Horizontal Pill Bar Divider
 */
export function PillDivider({ className = "" }) {
  return (
    <div className={`w-full flex items-center justify-center gap-2 py-8 overflow-hidden opacity-40 ${className}`} aria-hidden="true">
      <div className="h-[1px] flex-1 bg-border" />
      <div className="flex items-center gap-1.5">
        <span className="w-6 h-1 rounded-full bg-primary/80" />
        <span className="w-10 h-1.5 rounded-full bg-accent-amber" />
        <span className="w-4 h-1 rounded-full bg-brand-slate" />
      </div>
      <div className="h-[1px] flex-1 bg-border" />
    </div>
  );
}

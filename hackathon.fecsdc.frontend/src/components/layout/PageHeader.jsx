import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { SectionPillMarker, PillDivider, PillMark } from "../ui/PillDividers.jsx";
import { Reveal } from "../motion/Reveal.jsx";

/**
 * Standardized PageHeader component
 * Includes breadcrumb, eyebrow label, h1, 1-line desc, and signature animated pill divider.
 */
export function PageHeader({
  eyebrow = "FEC SDC HACKATHON 2026",
  title,
  highlightWord,
  description,
  breadcrumbs = [],
  action,
  className = "",
}) {
  return (
    <div className={`pt-6 pb-4 border-b border-border/60 mb-8 ${className}`}>
      {/* Optional Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.to || crumb.label} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <Reveal>
        <SectionPillMarker label={eyebrow} />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              {title}{" "}
              {highlightWord && (
                <span className="gradient-text-brand">{highlightWord}</span>
              )}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </Reveal>
    </div>
  );
}

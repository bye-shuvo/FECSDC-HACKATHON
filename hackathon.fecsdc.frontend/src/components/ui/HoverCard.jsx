import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";

/**
 * HoverCard Component
 * Features subtle zoom on hover, slide-up extra information panel, and 45deg rotating arrow.
 */
export function HoverCard({
  title,
  subtitle,
  extraInfo,
  badge,
  icon: Icon,
  className = "",
  children,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-cursor="card"
      className={`group relative overflow-hidden rounded-md border border-border bg-card p-6 transition-all duration-300 hover:border-primary/60 hover:-translate-y-1 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        {Icon && (
          <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-2">
          {badge && (
            <span className="font-label text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
              {badge}
            </span>
          )}
          <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children}

      {/* Slide-Up Extra Information Panel */}
      <AnimatePresence>
        {isHovered && extraInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: MOTION_EASE }}
            className="pt-4 mt-4 border-t border-border/60 text-xs font-mono text-primary/90"
          >
            {extraInfo}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

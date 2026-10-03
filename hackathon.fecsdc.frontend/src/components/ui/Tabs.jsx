import { motion } from "motion/react";
import { MOTION_SPRING_SNAPPY } from "../../lib/motion.js";

/**
 * Tabs with motion layoutId indicator pill
 */
export function Tabs({ tabs, activeTab, onChange, className = "", layoutId = "active-tab-indicator" }) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1.5 p-1 rounded-lg bg-muted/80 border border-border overflow-x-auto max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-2 text-xs md:text-sm font-label rounded-md transition-colors whitespace-nowrap z-10 select-none ${
              isActive
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={MOTION_SPRING_SNAPPY}
                className="absolute inset-0 rounded-md gradient-bg-brand -z-10 shadow-sm"
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

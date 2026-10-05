import { motion, AnimatePresence } from "motion/react";
import { useCountdown } from "../../hooks/useCountdown.js";
import { MOTION_EASE } from "../../lib/motion.js";
import { PillMark } from "./PillDividers.jsx";
import { isLowTier } from "../../hooks/useDeviceTier.js";

/**
 * Animated individual digit slot with pill frame styling
 */
function DigitSlot({ value }) {
  const formatted = String(value).padStart(2, "0");
  const lowTier = isLowTier();

  return (
    <div className="relative inline-flex items-center justify-center min-w-[3.6rem] sm:min-w-18 md:min-w-[5.2rem] h-14 sm:h-20 md:h-20 bg-card/90 border border-border rounded-full overflow-hidden px-3 shadow-inner">
      {lowTier ? (
        <span className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground tabular-nums select-none">
          {formatted}
        </span>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ y: "80%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-80%", opacity: 0 }}
            transition={{ duration: 0.35, ease: MOTION_EASE }}
            className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground tabular-nums select-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * Full Event Countdown Block with pill-framed unit blocks
 */
export function Countdown({ targetDate, label = "HACKING COMMENCES IN", className = "" }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 rounded-full border border-primary/40 bg-card/80 ${className}`}>
        <span className="font-label text-xs tracking-widest text-primary font-semibold animate-pulse mb-2">
          STATUS: IN SPRINT
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-foreground">
          Hacking is currently underway!
        </h3>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: days },
    { label: "HOURS", value: hours },
    { label: "MINS", value: minutes },
    { label: "SECS", value: seconds },
  ];

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      {label && (
        <div className="flex items-center md:gap-2">
          <PillMark size="sm" />
          <span className="font-label text-xs tracking-widest text-muted-foreground uppercase">
            {label}
          </span>
        </div>
      )}
      <div className="flex items-center sm:gap-4 md:gap-6">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center sm:gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-2">
              <DigitSlot value={unit.value} />
              <span className="font-label text-[10px] md:text-xs text-muted-foreground tracking-widest font-semibold uppercase">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="text-xl sm:text-3xl font-bold text-muted-foreground/40 mb-7 select-none animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

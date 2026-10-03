import { TiltCard } from "./TiltCard.jsx";
import { CountUp } from "../motion/CountUp.jsx";
import { PillMark } from "./PillDividers.jsx";

export function StatCard({
  value,
  prefix = "",
  suffix = "",
  label,
  subtext,
  className = "",
}) {
  return (
    <TiltCard
      maxTilt={6}
      className={`p-6 flex flex-col justify-between h-full bg-card border-border ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <PillMark size="sm" />
        <span className="font-label text-[10px] text-muted-foreground uppercase tracking-widest">
          METRIC
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-tight text-foreground">
          <CountUp to={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className="font-label text-xs tracking-wider text-primary font-semibold uppercase">
          {label}
        </div>
      </div>

      {subtext && (
        <p className="text-xs font-mono text-muted-foreground pt-4 mt-2 border-t border-border/40">
          {subtext}
        </p>
      )}
    </TiltCard>
  );
}

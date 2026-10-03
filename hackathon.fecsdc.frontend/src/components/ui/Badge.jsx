/**
 * Badge Component
 * Mono label with strict typography styling: JetBrains Mono 500 uppercase, tracking-widest, text-xs.
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
  dotColor = "bg-primary",
}) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-xs",
  };

  const variantClasses = {
    default: "bg-muted/70 text-foreground border border-border",
    primary: "bg-primary/10 text-primary border border-primary/30",
    amber: "bg-accent-amber/10 text-accent-amber border border-accent-amber/30",
    slate: "bg-brand-slate/20 text-muted-foreground border border-brand-slate/40",
    success: "bg-success/10 text-success border border-success/30",
    warning: "bg-warning/10 text-warning border border-warning/30",
    danger: "bg-destructive/10 text-destructive border border-destructive/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-label rounded-full font-medium ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

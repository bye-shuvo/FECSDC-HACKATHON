/**
 * Card Surface Component
 */
export function Card({
  children,
  className = "",
  variant = "default",
  as: Component = "div",
  ...props
}) {
  const variantStyles = {
    default: "bg-card border border-border rounded-lg p-6 shadow-sm",
    muted: "bg-muted/50 border border-border/80 rounded-lg p-6",
    interactive:
      "bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:border-primary/60 hover:-translate-y-1 shadow-sm",
    flat: "bg-card/60 border border-border/60 rounded-lg p-5",
  };

  return (
    <Component
      className={`${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

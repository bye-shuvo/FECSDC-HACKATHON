/**
 * Responsive layout container and section wrappers
 */

export function Container({ children, className = "", size = "default" }) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${
        sizeClasses[size] || sizeClasses.default
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  children,
  id,
  className = "",
  spacing = "default", // default = py-section, compact = py-section-sm, none = py-0
}) {
  const spacingClasses = {
    default: "py-16 md:py-24",
    compact: "py-10 md:py-14",
    large: "py-24 md:py-32",
    none: "py-0",
  };

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${
        spacingClasses[spacing] || spacingClasses.default
      } ${className}`}
    >
      {children}
    </section>
  );
}

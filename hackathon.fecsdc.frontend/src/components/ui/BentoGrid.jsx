/**
 * BentoGrid and BentoItem
 * Asymmetric, responsive grid container for rich card ecosystems
 */
export function BentoGrid({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[220px] ${className}`}>
      {children}
    </div>
  );
}

export function BentoItem({
  children,
  colSpan = "md:col-span-1",
  rowSpan = "row-span-1",
  className = "",
}) {
  return (
    <div className={`${colSpan} ${rowSpan} h-full w-full ${className}`}>
      {children}
    </div>
  );
}

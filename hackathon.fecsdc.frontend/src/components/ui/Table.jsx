import { ArrowUpDown } from "lucide-react";

/**
 * Accessible Table and Leaderboard Table components
 */
export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left border-collapse text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-muted/70 border-b border-border text-xs font-label text-muted-foreground uppercase tracking-wider select-none">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border/60">{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return (
    <tr className={`transition-colors hover:bg-muted/40 ${className}`}>{children}</tr>
  );
}

export function TableHead({ children, sortable, onSort, activeSort, className = "" }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3.5 font-medium ${sortable ? "cursor-pointer hover:text-foreground" : ""} ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="inline-flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <ArrowUpDown
            className={`w-3.5 h-3.5 transition-colors ${
              activeSort ? "text-primary" : "text-muted-foreground/50"
            }`}
          />
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-3.5 font-sans align-middle ${className}`}>{children}</td>;
}

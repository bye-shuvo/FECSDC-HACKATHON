import { forwardRef, memo } from "react";

export const Input = memo(forwardRef(function Input(
  { label, error, helperText, id, className = "", required, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-label text-xs text-foreground/90 font-medium flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-primary">*</span>}
          </span>
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full px-3.5 py-2.5 rounded-md bg-muted/70 border border-border text-foreground font-sans text-sm placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-destructive focus:ring-destructive/50" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-destructive font-mono mt-0.5" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground font-mono mt-0.5">{helperText}</p>
      )}
    </div>
  );
}));

export const Select = memo(forwardRef(function Select(
  { label, error, helperText, id, options = [], className = "", required, children, ...props },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="font-label text-xs text-foreground/90 font-medium flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-primary">*</span>}
          </span>
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={`w-full px-3.5 py-2.5 rounded-md bg-muted/70 border border-border text-foreground font-sans text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-destructive focus:ring-destructive/50" : ""
        } ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-card text-foreground">
              {opt.label ?? opt}
            </option>
          ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-destructive font-mono mt-0.5" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground font-mono mt-0.5">{helperText}</p>
      )}
    </div>
  );
}));

export const Checkbox = memo(forwardRef(function Checkbox(
  { label, error, id, checked, onChange, required, className = "", ...props },
  ref
) {
  const checkId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={checkId} className="flex items-start gap-3 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          checked={checked}
          onChange={onChange}
          required={required}
          className={`mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-ring bg-muted transition-colors cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          {label} {required && <span className="text-primary">*</span>}
        </span>
      </label>
      {error && (
        <p className="text-xs text-destructive font-mono pl-7" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}));

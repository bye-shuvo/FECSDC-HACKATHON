import { forwardRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { MOTION_SPRING_SNAPPY } from "../../lib/motion.js";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";

/**
 * Brand Button Component
 * Supports variants: primary (orange→amber gradient), outline, ghost, subtle.
 * Touch target minimum 44px. Smooth micro-interactions.
 */
export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    href,
    to,
    icon: Icon,
    iconPosition = "right",
    className = "",
    disabled = false,
    type = "button",
    onClick,
    ...props
  },
  ref
) {
  const prefersReduced = useReducedMotion();

  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "min-h-[40px] px-3.5 py-1.5 text-xs rounded-sm gap-2",
    md: "min-h-[44px] px-5 py-2.5 text-sm rounded-md gap-2.5",
    lg: "min-h-[50px] px-7 py-3 text-base rounded-md gap-3",
  };

  const variantStyles = {
    primary:
      "gradient-bg-brand text-white font-semibold shadow-lg shadow-primary/20 hover:brightness-105 active:brightness-95 border-0",
    outline:
      "bg-transparent border border-border text-foreground hover:border-primary/80 hover:bg-muted/60 active:bg-muted",
    ghost:
      "bg-transparent border-transparent text-foreground hover:bg-muted text-muted-foreground hover:text-foreground",
    subtle:
      "bg-muted border border-transparent text-foreground hover:bg-muted/80 hover:border-border active:bg-muted/60",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.primary
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
      )}
      <span>{children}</span>
      {Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  const motionProps = prefersReduced
    ? {}
    : {
        whileHover: disabled ? {} : { scale: 1.02 },
        whileTap: disabled ? {} : { scale: 0.98 },
        transition: MOTION_SPRING_SNAPPY,
      };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link ref={ref} to={to} className={`group ${combinedClasses}`} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <a
          ref={ref}
          href={href}
          className={`group ${combinedClasses}`}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group ${combinedClasses}`}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
});

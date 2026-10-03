import { memo } from "react";
import { motion } from "motion/react";
import { pageTransitionVariants } from "../../lib/motion.js";

/**
 * PageTransition wrapper for routes.
 * Memoized to prevent redundant re-renders of the transition wrapper itself.
 */
export const PageTransition = memo(function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-[calc(100vh-14rem)] ${className}`}
    >
      {children}
    </motion.div>
  );
});

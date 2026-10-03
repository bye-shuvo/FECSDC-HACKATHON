import { motion } from "motion/react";
import { MOTION_EASE } from "../../lib/motion.js";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay = 0.06) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.04,
    },
  }),
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: MOTION_EASE,
    },
  },
};

export function Stagger({
  children,
  staggerDelay = 0.06,
  className = "",
  as = "div",
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className = "", as = "div" }) {
  const Component = motion[as] || motion.div;

  return (
    <Component variants={staggerItemVariants} className={className}>
      {children}
    </Component>
  );
}

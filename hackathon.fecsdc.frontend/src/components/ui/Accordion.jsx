import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { MOTION_EASE } from "../../lib/motion.js";

/**
 * Accessible Accordion component with animated height and arrow key navigation
 */
export function AccordionItem({ id, question, answer, isOpen, onToggle, onKeyDown, buttonRef }) {
  const contentId = `accordion-content-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className="border border-border/80 rounded-sm bg-card overflow-hidden transition-colors hover:border-primary/40">
      <button
        ref={buttonRef}
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        className="w-full flex items-center justify-between p-5 text-left font-display font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-ring"
        data-cursor="button"
      >
        <span className="text-sm md:text-base pr-4 leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: MOTION_EASE }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: MOTION_EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-muted-foreground font-mono leading-relaxed border-t border-border/40">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({ items, allowMultiple = false, className = "" }) {
  const [openItems, setOpenItems] = useState(() => (items.length > 0 ? [items[0].id] : []));
  const buttonRefs = useRef([]);

  const toggleItem = (id) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % items.length;
      buttonRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + items.length) % items.length;
      buttonRefs.current[prevIndex]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[items.length - 1]?.focus();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          buttonRef={(el) => (buttonRefs.current[index] = el)}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

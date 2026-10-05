import { NavLink, Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { Container } from "../components/ui/Section.jsx";
import { MOTION_SPRING_SNAPPY } from "../lib/motion.js";

const subnavTabs = [
  { to: "/hackathon", label: "Overview", end: true },
  { to: "/hackathon/register", label: "Register", end: false },
  { to: "/hackathon/questions", label: "Questions", end: false },
  { to: "/hackathon/about", label: "About", end: false },
  { to: "/hackathon/schedule", label: "Schedule", end: false },
  { to: "/hackathon/rules", label: "Rules", end: false },
  { to: "/hackathon/prizes", label: "Prizes", end: false },
  { to: "/hackathon/faq", label: "FAQ", end: false },
];

export function HackathonLayout() {
  const location = useLocation();

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Subnav Navigation Bar */}
      <div className="sticky top-16 md:top-20 z-30 w-full bg-background/95 backdrop-blur-md border-b border-border/70 py-2.5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <PillMark size="sm" />
              <span className="font-label text-xs tracking-widest text-foreground font-semibold">
                HACKATHON HUB
              </span>
            </div>

            {/* Scrollable Nav Tabs */}
            <nav
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1"
              aria-label="Hackathon Sub-navigation"
            >
              {subnavTabs.map((tab) => {
                const isActive = tab.end
                  ? location.pathname === tab.to
                  : location.pathname.startsWith(tab.to);

                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.end}
                    className={`relative px-3.5 py-1.5 text-xs font-label rounded-md transition-colors whitespace-nowrap select-none ${
                      isActive
                        ? "text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="hackathon-subnav-pill"
                        transition={MOTION_SPRING_SNAPPY}
                        className="absolute inset-0 rounded-md gradient-bg-brand -z-10 shadow-sm"
                      />
                    )}
                    <span>{tab.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </Container>
      </div>

      {/* Nested Page Content */}
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
}

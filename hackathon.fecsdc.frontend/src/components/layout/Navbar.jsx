import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { BrandLogo, PillMark } from "../ui/PillDividers.jsx";
import { Button } from "../ui/Button.jsx";
import { MOTION_SPRING_SNAPPY, MOTION_EASE } from "../../lib/motion.js";
import { prefetchRoute } from "../../hooks/usePrefetchRoute.js";

const hackathonSubLinks = [
  { to: "/hackathon/register", label: "Register", desc: "Claim your slot (Club members only)" },
  { to: "/hackathon/about", label: "About", desc: "Format, tracks & participation mission" },
  { to: "/hackathon/schedule", label: "Schedule", desc: "6-hour timeline & checkpoints" },
  { to: "/hackathon/rules", label: "Rules & Conduct", desc: "Eligibility, requirements & judging" },
  { to: "/hackathon/prizes", label: "Prizes & Awards", desc: "Podium pool & special awards" },
  { to: "/hackathon/faq", label: "FAQ", desc: "Answers to common queries" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const prefetchTimerRef = useRef(null);

  const handlePrefetch = useCallback((path) => {
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
    prefetchTimerRef.current = setTimeout(() => prefetchRoute(path), 150);
  }, []);

  const cancelPrefetch = useCallback(() => {
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
  }, []);

  // Stable bound prefetch handlers for each fixed path
  const prefetchHome = useCallback(() => handlePrefetch("/"), [handlePrefetch]);
  const prefetchHackathon = useCallback(() => handlePrefetch("/hackathon"), [handlePrefetch]);
  const prefetchChallenges = useCallback(() => handlePrefetch("/challenges"), [handlePrefetch]);

  // Handle scroll effect — skip setState if value hasn't changed
  const isScrolledRef = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 20;
      if (next !== isScrolledRef.current) {
        isScrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup prefetch timer on unmount
  useEffect(() => () => {
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
  }, []);

  // Close mobile and dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key for mobile drawer and dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHackathonActive = location.pathname.startsWith("/hackathon");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "h-16 bg-background/90 backdrop-blur-md border-b border-border/80 shadow-md shadow-black/20"
        : "h-20 bg-background/50 backdrop-blur-sm border-b border-border/40"
        }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="focus-visible:outline-2 focus-visible:outline-ring rounded-sm py-1"
          aria-label="FEC SDC Hackathon 2026 Home"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {/* Home */}
          <NavLink
            to="/"
            end
            onMouseEnter={prefetchHome}
            onMouseLeave={cancelPrefetch}
            onFocus={prefetchHome}
            onBlur={cancelPrefetch}
            onTouchStart={prefetchHome}
            className={({ isActive }) =>
              `relative px-3.5 py-2 text-xs lg:text-sm font-label transition-colors select-none ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Home</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={MOTION_SPRING_SNAPPY}
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink>

          {/* Hackathon Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen((prev) => !prev)}
              onMouseEnter={prefetchHackathon}
              onMouseLeave={cancelPrefetch}
              onFocus={prefetchHackathon}
              onBlur={cancelPrefetch}
              onTouchStart={prefetchHackathon}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-label transition-colors select-none focus-visible:outline-2 focus-visible:outline-ring rounded-sm ${isHackathonActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <span>Hackathon</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-primary" : ""
                  }`}
              />
              {isHackathonActive && (
                <motion.div
                  layoutId="nav-active-pill"
                  transition={MOTION_SPRING_SNAPPY}
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: MOTION_EASE }}
                  className="absolute top-full left-0 mt-2 w-72 p-2 rounded-xl bg-card border border-border/90 shadow-2xl backdrop-blur-xl z-50 divide-y divide-border/40"
                  role="menu"
                >
                  <div className="px-3 py-2">
                    <Link
                      to="/hackathon"
                      onMouseEnter={prefetchHackathon}
                      onMouseLeave={cancelPrefetch}
                      className="text-xs font-label uppercase tracking-widest text-primary font-semibold hover:underline flex items-center justify-between"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>Hackathon Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="pt-1 space-y-0.5">
                    {hackathonSubLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        role="menuitem"
                        onMouseEnter={() => handlePrefetch(item.to)}
                        onMouseLeave={cancelPrefetch}
                        onFocus={() => handlePrefetch(item.to)}
                        onBlur={cancelPrefetch}
                        onTouchStart={() => handlePrefetch(item.to)}
                        onClick={() => setDropdownOpen(false)}
                        className="group flex flex-col p-2.5 rounded-lg transition-colors hover:bg-muted/80 text-foreground"
                      >
                        <span className="font-display text-sm font-medium group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground line-clamp-1">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Challenges */}
          <NavLink
            to="/challenges"
            onMouseEnter={prefetchChallenges}
            onMouseLeave={cancelPrefetch}
            onFocus={prefetchChallenges}
            onBlur={cancelPrefetch}
            onTouchStart={prefetchChallenges}
            className={({ isActive }) =>
              `relative px-3.5 py-2 text-xs lg:text-sm font-label transition-colors select-none ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Challenges</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={MOTION_SPRING_SNAPPY}
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink>

          {/* Sponsors
          <NavLink
            to="/sponsors"
            onMouseEnter={handlePrefetch("/sponsors")}
            onMouseLeave={cancelPrefetch}
            onFocus={handlePrefetch("/sponsors")}
            onBlur={cancelPrefetch}
            className={({ isActive }) =>
              `relative px-3.5 py-2 text-xs lg:text-sm font-label transition-colors select-none ${
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Sponsors</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={MOTION_SPRING_SNAPPY}
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink> */}

          {/* Results */}
          <NavLink
            to="/results"
            className={({ isActive }) =>
              `relative px-3.5 py-2 text-xs lg:text-sm font-label transition-colors select-none ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Results</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    transition={MOTION_SPRING_SNAPPY}
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* Right CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button
              to="/hackathon/register"
              variant="primary"
              size="sm"
              icon={ArrowRight}
              className="text-xs"
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md border border-border text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: MOTION_EASE }}
            className="fixed inset-0 top-16 bg-background/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-6 overflow-y-auto md:hidden border-t border-border h-[92dvh]"
            role="dialog"
            aria-modal="true"
          >
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 pb-4 border-b border-border/60">
                <PillMark size="sm" />
                <span className="font-label text-xs tracking-widest text-primary font-bold">
                  MENU NAVIGATION
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl font-bold py-2 border-b border-border/40 hover:text-primary transition-colors"
                >
                  Home
                </Link>

                <div className="py-2 border-b border-border/40">
                  <div className="font-display text-xl font-bold mb-3 flex items-center justify-between text-primary">
                    <Link to="/hackathon" onClick={() => setMobileOpen(false)}>
                      Hackathon
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {hackathonSubLinks.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-sans text-muted-foreground hover:text-foreground py-1.5"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/challenges"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl font-bold py-2 border-b border-border/40 hover:text-primary transition-colors"
                >
                  Challenges
                </Link>

                {/* <Link
                  to="/sponsors"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl font-bold py-2 border-b border-border/40 hover:text-primary transition-colors"
                >
                  Sponsors
                </Link> */}

                <Link
                  to="/results"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-xl font-bold py-2 border-b border-border/40 hover:text-primary transition-colors"
                >
                  Results
                </Link>
              </div>
            </div>

            <div className="pt-8 pb-4 space-y-4">
              <Button
                to="/hackathon/register"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={() => setMobileOpen(false)}
                icon={ArrowRight}
              >
                Register Now
              </Button>
              <p className="text-center font-label text-[11px] text-muted-foreground tracking-widest">
                EXCLUSIVE TO FEC SDC MEMBERS
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

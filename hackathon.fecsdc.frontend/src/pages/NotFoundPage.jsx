import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { Reveal } from "../components/motion/Reveal.jsx";
import { animate } from "animejs";

export default function NotFoundPage({ message }) {
  useDocumentTitle("404: Route Not Found", "The requested page does not exist.");

  const pillClusterRef = useRef(null);

  // Glitch-free floating pill bars "lost" in space animation
  useEffect(() => {
    if (!pillClusterRef.current) return;
    const bars = pillClusterRef.current.querySelectorAll(".lost-pill");

    const anim = animate(bars, {
      translateX: () => [animeRandom(-16, 16), animeRandom(-24, 24)],
      translateY: () => [animeRandom(-8, 8), animeRandom(-12, 12)],
      rotate: () => [animeRandom(-15, 15), animeRandom(-25, 25)],
      opacity: [0.4, 0.9, 0.4],
      duration: 3500,
      ease: "easeInOutSine",
      alternate: true,
      loop: true,
      delay: (el, i) => i * 300,
    });

    return () => {
      anim.pause();
    };
  }, []);

  function animeRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  return (
    <Section className="py-20 md:py-32">
      <Container size="narrow" className="text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <PillMark size="md" />
              <span className="font-mono text-xs tracking-widest text-primary font-bold uppercase">
                ERROR 404 • ROUTE UNRESOLVED
              </span>
            </div>

            {/* Glitch-free animated pill bars assembly */}
            <div
              ref={pillClusterRef}
              className="relative w-72 h-36 flex items-center justify-center select-none"
              aria-hidden="true"
            >
              <div className="lost-pill absolute w-32 h-6 rounded-full bg-primary/30 border border-primary/60" />
              <div className="lost-pill absolute w-44 h-7 rounded-full bg-accent-amber/30 border border-accent-amber/60 rotate-12" />
              <div className="lost-pill absolute w-28 h-5 rounded-full bg-brand-slate/40 border border-brand-slate/60 -rotate-6" />
              <div className="lost-pill absolute w-20 h-4 rounded-full bg-primary/40 border border-primary/70" />
              <div className="relative z-10 font-mono text-6xl sm:text-7xl font-bold tracking-tight text-foreground select-none">
                404
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
              Segment Not Located
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md mx-auto leading-relaxed">
              {message ||
                "The requested resource does not resolve in the FEC SDC Hackathon directory index. Check your route parameter or return to the main console."}
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to="/"
                data-cursor="button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Hub
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

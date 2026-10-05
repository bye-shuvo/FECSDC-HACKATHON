import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "../ui/Section.jsx";
import { SectionPillMarker } from "../ui/PillDividers.jsx";
import { podiumPrizes } from "../../data/prizes.js";
import { Stagger, StaggerItem } from "../motion/Stagger.jsx";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { useSharedInView } from "../../hooks/useSharedInView.js";
import { motion } from "motion/react";

export function PrizesTeaserSection() {
  const orderedPrizes = [1, 2, 3]
    .map((rank) => podiumPrizes.find((prize) => prize.rank === rank))
    .filter(Boolean);
  const [championFloatRef, isChampionInView] = useSharedInView({ once: false });
  const prefersReducedMotion = useReducedMotion();
  const desktopOrder = {
    1: "md:order-1",
    2: "md:order-2",
    3: "md:order-3",
  };

  return (
    <section
      id="prizes-teaser"
      aria-labelledby="prizes-teaser-heading"
      className="relative w-full overflow-hidden py-16 md:py-24"
    >
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionPillMarker label="PRIZES & ACCOLADES" />
            <h2
              id="prizes-teaser-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
            >
              Grand Prize <span className="gradient-text-brand">Pool</span>
            </h2>
          </div>
          <Link
            to="/hackathon/prizes"
            className="group inline-flex items-center gap-2 text-sm font-label text-primary hover:text-accent-amber transition-colors"
          >
            <span>See Prize Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Stagger
          as="ul"
          staggerDelay={0.06}
          className="grid list-none grid-cols-1 md:grid-cols-1 gap-gutter items-stretch p-0 m-0"
        >
          {orderedPrizes.map((prize) => {
            const isChampion = prize.rank === 1;
            const isThirdPrize = prize.rank === 3;
            const showLeftArrow = isChampion || isThirdPrize;
            const arrowMotion = prefersReducedMotion
              ? {}
              : { x: showLeftArrow ? [0, 7, 0] : [0, -7, 0] };

            return (
              <StaggerItem
                key={prize.rank}
                as="li"
                className={`min-w-0 ${desktopOrder[prize.rank]}`}
              >
                <motion.div
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  data-cursor="view"
                  className={`group h-full flex flex-col md:justify-center items-center text-center ${prize.rank === 2 ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  <div
                    className={`flex h-52 w-full items-center justify-center`}
                  >
                    <div
                      ref={isChampion ? championFloatRef : undefined}
                      className={
                        isChampion && !prefersReducedMotion
                          ? "animate-hero-float"
                          : ""
                      }
                      style={{
                        animationPlayState: isChampionInView
                          ? "running"
                          : "paused",
                      }}
                    >
                      <img
                        src={prize.teaserImage}
                        alt={`${prize.teaserTitle} prize`}
                        width="160"
                        height="160"
                        loading="lazy"
                        decoding="async"
                        className={`h-48 w-48 object-contain transition-transform duration-150 ease-(--ease-fast) group-hover:-translate-y-1.5 group-hover:rotate-2 ${isChampion ? "scale-[1.5]" : prize.rank == 1 ? "scale-[1.20]" : "scale-[1.25]"}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col h-56 w-full items-center justify-center">
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {showLeftArrow ? (
                        <motion.span
                          animate={arrowMotion}
                          transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                          className="order-1 hidden shrink-0 md:inline-flex text-primary"
                          aria-hidden="true"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </motion.span>
                      ) : (
                        <motion.span
                          animate={arrowMotion}
                          transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                          className="order-3 hidden shrink-0 md:inline-flex text-primary"
                          aria-hidden="true"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.span>
                      )}
                      <span
                        className={`order-2 font-jetbrains-mono text-xs md:text-sm font-medium uppercase tracking-widest transition-colors duration-150 ${isChampion ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                      >
                        {prize.place}
                      </span>
                    </div>
                    <h3 className="mt-2 font-jetbrains-mono text-xl md:text-3xl font-bold leading-tight text-foreground">
                      {prize.teaserTitle}
                    </h3>
                    <p className="mt-2 whitespace-nowrap font-fira-code text-xs text-muted-foreground md:text-sm">
                      {prize.teaserDescription}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

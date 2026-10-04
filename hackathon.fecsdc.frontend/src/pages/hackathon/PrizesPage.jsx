import { Trophy, Award, Sparkles, CheckCircle2, Crown } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { TiltCard } from "../../components/ui/TiltCard.jsx";
import { SpotlightCard } from "../../components/ui/SpotlightCard.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { podiumPrizes, specialAwards } from "../../data/prizes.js";
import { Reveal } from "../../components/motion/Reveal.jsx";
import { useReducedMotion } from "../../hooks/useReducedMotion.js";
import { useSharedInView } from "../../hooks/useSharedInView.js";

export default function PrizesPage() {
  useDocumentTitle(
    "Prizes & Awards",
    "Championship bounties, cloud grants, and special track accolades.",
  );

  // Ordered for podium: 2nd place (left), 1st place (center/tallest), 3rd place (right)
  const [championFloatRef, isChampionInView] = useSharedInView({ once: false });
  const prefersReducedMotion = useReducedMotion();
  const orderedPodium = [
    podiumPrizes.find((p) => p.rank === 2),
    podiumPrizes.find((p) => p.rank === 1),
    podiumPrizes.find((p) => p.rank === 3),
  ].filter(Boolean);

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="RECOGNIZATION & GRANTS"
          title="Prizes & Accolades"
          gradientWord="Accolades"
          description="Recognizing engineering virtuosity with bold ideas, rigorous execution, and standout impact."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Hackathon", href: "/hackathon" },
            { label: "Prizes" },
          ]}
        />

        {/* Podium Top 3 */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <PillMark size="sm" />
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Championship Podium
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {orderedPodium.map((prize, idx) => {
              const isChampion = prize.rank === 1;
              const isRunnerUp = prize.rank === 2;

              // Rank color styling mapped strictly to FEC brand tokens
              const accentColor = isChampion
                ? "text-primary"
                : isRunnerUp
                  ? "text-accent-amber"
                  : "text-brand-slate";
              const borderStyle = isChampion
                ? "border-primary/80 bg-card shadow-2xl shadow-primary/10 md:-translate-y-6"
                : "border-border/80 bg-card/90";

              return (
                <Reveal key={prize.rank} delay={idx * 0.1}>
                  <TiltCard
                    maxTilt={isChampion ? 10 : 6}
                    className={`p-6 sm:p-8 flex flex-col justify-start items-start rounded-sm relative overflow-hidden group border ${borderStyle}`}
                  >
                    {/* Hover shine sweep effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-14 h-14 rounded-sm flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
                            isChampion
                              ? "bg-primary/20 border-primary text-primary"
                              : isRunnerUp
                                ? "bg-accent-amber/20 border-accent-amber text-accent-amber"
                                : "bg-brand-slate/20 border-brand-slate text-foreground"
                          }`}
                        >
                          {isChampion ? (
                            <Crown className="z-50 w-7 h-7" />
                          ) : isRunnerUp ? (
                            <Trophy className="z-50 w-7 h-7" />
                          ) : (
                            <Award className="z-50 w-7 h-7" />
                          )}
                        </div>
                        <div
                          className={`flex h-52 items-start justify-end`}
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
                              className={`-z-10 h-48 w-48 object-contain group-hover:fill-[#ff8e47] transition-transform duration-150 ease-(--ease-fast) group-hover:-translate-y-1.5 group-hover:rotate-2 ${isChampion ? "scale-[2]" : prize.rank == 2 ? "scale-[2]" : "scale-[2]"}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                          {prize.place}
                        </h3>
                        <div
                          className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight mt-2 ${accentColor}`}
                        >
                          {prize.teaserTitle}
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase font-medium">
                          PERKS & INCLUSIONS:
                        </span>
                        <ul className="space-y-2 text-xs text-foreground/90 font-mono">
                          {prize.perks.map((perk, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span className="leading-snug">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground relative z-10">
                      <span>Grand Finale stage</span>
                      <PillMark size="sm" />
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Special Category Awards
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PillMark size="sm" />
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Special Category Awards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {specialAwards.map((award, idx) => (
              <Reveal key={award.id} delay={idx * 0.08}>
                <SpotlightCard className="p-6 h-full flex flex-col justify-between rounded-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-accent-amber font-semibold tracking-wider uppercase">
                        {award.tag}
                      </span>
                      <div className="font-mono text-base font-bold text-primary">
                        {award.amount}
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-bold text-foreground">
                      {award.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed">
                      {award.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Targeted track recognition</span>
                    <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div> */}
      </Container>
    </Section>
  );
}

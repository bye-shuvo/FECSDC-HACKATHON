import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Unlock, Lock } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useProblemLock } from "../hooks/useProblemLock.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { LockedState } from "../components/ui/LockedState.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { problems, problemTracks } from "../data/loadData.js";
import { Reveal } from "../components/motion/Reveal.jsx";

export default function ProblemStatementsPage() {
  useDocumentTitle("Problem Statements", "Official engineering problem statements for FEC SDC Hackathon.");

  const { isLocked, revealDate } = useProblemLock();
  // Optional developer override to test unlocked view without waiting for live date
  const [overrideUnlock, setOverrideUnlock] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("All");

  const showLocked = isLocked && !overrideUnlock;

  const filteredProblems = problems.filter((p) => {
    return selectedTrack === "All" || p.track === selectedTrack;
  });

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="CHALLENGE DIRECTIVE"
          title="Problem Statements"
          gradientWord="Statements"
          description="Official engineering problem specifications across different competition tracks."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Problems" }
          ]}
        />

        {/* Development preview toggle */}
        {isLocked && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => setOverrideUnlock((prev) => !prev)}
              data-cursor="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-card/80 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle preview to test unlocked problem statement rendering"
            >
              {overrideUnlock ? <Lock className="w-3.5 h-3.5 text-primary" /> : <Unlock className="w-3.5 h-3.5 text-accent-amber" />}
              <span>{overrideUnlock ? "View Locked State" : "Preview Unlocked (Testing)"}</span>
            </button>
          </div>
        )}

        {/* If locked, display LockedState with countdown */}
        {showLocked ? (
          <Reveal>
            <LockedState revealDate={revealDate} />
          </Reveal>
        ) : (
          /* Unlocked Problem Statements List */
          <div className="space-y-8">
            {/* Unlocked Banner */}
            <div className="p-4 rounded-sm border border-primary/40 bg-primary/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Unlock className="w-5 h-5 text-primary shrink-0" />
                <span className="font-mono text-xs md:text-sm text-foreground">
                  Problems are <strong className="text-primary font-bold">UNLOCKED</strong>. Select your team&apos;s track and initialize your GitHub repository.
                </span>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-sm bg-primary/20 border border-primary/40">
                {problemTracks?.length - 1 || 0} Active
              </span>
            </div>

            {/* Track Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {problemTracks?.map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => setSelectedTrack(track)}
                  data-cursor="button"
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors select-none ${selectedTrack === track
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border"
                    }`}
                >
                  {track}
                </button>
              ))}
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProblems.map((problem, idx) => (
                <Reveal key={problem.id} delay={idx * 0.08}>
                  <SpotlightCard className="p-6 md:p-8 h-full flex flex-col justify-between rounded-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary font-bold uppercase">
                          {problem.id.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-accent-amber px-2 py-0.5 rounded-sm bg-accent-amber/10 border border-accent-amber/30 uppercase">
                            {problem.difficulty}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 rounded-sm bg-muted/60 border border-border uppercase">
                            {problem.track}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl font-display font-bold text-foreground">
                        {problem.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
                        {problem.summary}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <PillMark size="sm" />
                        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                          OFFICIAL SPEC
                        </span>
                      </div>

                      <Link
                        to={`/problem-statements/${problem.id}`}
                        data-cursor="link"
                        className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-accent-amber transition-colors"
                      >
                        <span>Full Specification</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

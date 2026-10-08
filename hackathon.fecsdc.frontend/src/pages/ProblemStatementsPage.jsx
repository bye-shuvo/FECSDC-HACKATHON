import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Unlock } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useProblemList } from "../hooks/useProblems.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { LockedState } from "../components/ui/LockedState.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { Reveal } from "../components/motion/Reveal.jsx";

export default function ProblemStatementsPage() {
  useDocumentTitle("Problem Statements", "Official engineering problem statements for FEC SDC Hackathon.");

  const {
    problems,
    problemTracks,
    isLoading,
    isLocked,
    revealDate,
    error,
    refetch,
  } = useProblemList();

  const [selectedTrack, setSelectedTrack] = useState("All");

  const list = problems || [];
  const filteredProblems = list.filter((p) => {
    return selectedTrack === "All" || p.track === selectedTrack;
  });

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="CHALLENGE DIRECTIVE"
          title="Problem Statements"
          gradientWord="Statements"
          description="Official engineering problem specifications for the Web Development track."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Problems" }
          ]}
        />

        {/* If locked, display LockedState with countdown */}
        {isLocked ? (
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
                  Problems are <strong className="text-primary font-bold">UNLOCKED</strong>. Select a Web Development problem and initialize your GitHub repository.
                </span>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-sm bg-primary/20 border border-primary/40">
                {list.length} Active
              </span>
            </div>

            {/* Track Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {problemTracks.map((track) => (
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

            {/* Content: Loading Skeletons, Error Retry, Empty, or Problems Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-6 md:p-8 rounded-sm border border-border bg-card/50 flex flex-col justify-between animate-pulse min-h-[260px]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
                          <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
                        </div>
                      </div>
                      <div className="h-6 w-3/4 bg-foreground/20 rounded-sm" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-full bg-muted-foreground/20 rounded" />
                        <div className="h-3.5 w-5/6 bg-muted-foreground/20 rounded" />
                        <div className="h-3.5 w-2/3 bg-muted-foreground/20 rounded" />
                      </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                      <div className="h-3 w-24 bg-muted-foreground/20 rounded" />
                      <div className="h-4 w-28 bg-primary/20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 rounded-sm border border-border bg-card/50 text-center space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {error.message || "Failed to load problem statements."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  data-cursor="button"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-sm bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : filteredProblems.length === 0 ? (
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                No problems published yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProblems.map((problem, idx) => (
                  <Reveal key={problem.id} delay={idx * 0.08}>
                    <SpotlightCard className="p-6 md:p-8 h-full flex flex-col justify-between rounded-sm">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-primary font-bold uppercase">
                            PROB-{String(problem.id).padStart(2, "0")}
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
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}

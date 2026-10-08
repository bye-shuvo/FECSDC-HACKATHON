import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useProblem } from "../hooks/useProblems.js";
import { usePrefetchIntent } from "../hooks/usePrefetchRoute.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { LockedState } from "../components/ui/LockedState.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { Reveal } from "../components/motion/Reveal.jsx";

// --- Tiny safe inline renderer -------------------------------------------
// Splits text on backtick-delimited spans for inline <code>. No dangerouslySetInnerHTML.
function InlineText({ text }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="font-mono text-[0.85em] bg-muted border border-border/60 rounded-sm px-1 py-0.5 text-foreground/90 break-words"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function ProseText({ text }) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-base leading-[1.75] text-foreground max-w-[70ch]">
          <InlineText text={para.trim()} />
        </p>
      ))}
    </div>
  );
}

// --- Section divider + mono label with dynamic index ----------------------
function SectionLabel({ index, title }) {
  const formattedIndex = String(index).padStart(2, "0");
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <PillMark size="sm" />
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground select-none">
        <span className="text-primary font-bold mr-1.5">{formattedIndex}</span>
        {title}
      </span>
      <span className="flex-1 h-px bg-border/40 ml-2" aria-hidden="true" />
    </div>
  );
}

// --- Difficulty token class helper ---------------------------------------
function difficultyClass(difficulty) {
  const d = (difficulty ?? "").toLowerCase();
  if (d === "advanced")     return "text-destructive bg-destructive/10 border-destructive/30";
  if (d === "intermediate") return "text-warning bg-warning/10 border-warning/30";
  return "text-success bg-success/10 border-success/30";
}

// --- Shared submit button -------------------------------------------------
function SubmitButton({ to, prefetch }) {
  return (
    <Link
      to={to}
      {...prefetch}
      data-cursor="button"
      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono font-semibold text-xs uppercase tracking-wider shadow shadow-primary/20 hover:brightness-110 active:brightness-95 transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      <Send className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      Submit solution
    </Link>
  );
}

// --- Page ----------------------------------------------------------------
export default function ProblemDetailPage() {
  const { id } = useParams();
  const {
    problem,
    prevProblem,
    nextProblem,
    isLoading,
    isLocked,
    revealDate,
    isNotFound,
    error,
    refetch,
  } = useProblem(id);

  const submitPrefetch = usePrefetchIntent("/hackathon/submit");
  const [overrideUnlock, setOverrideUnlock] = useState(false);

  useDocumentTitle(
    problem ? `${problem.title} | Problem Statement` : "Problem Statement",
    problem?.summary
  );

  // If bad ID (not a positive integer) or 404 from backend, render NotFound directly
  if (isNotFound) {
    return <NotFoundPage message={`Problem Statement with identifier '${id}' was not found.`} />;
  }

  // Preview button only in DEV, only unmasks data that was already fetched, never triggers a fetch
  const showLocked = isLocked && !(import.meta.env.DEV && overrideUnlock && problem);

  // Graceful fallback: statement field absent => fall back to legacy details
  const statementText = problem?.statement ?? problem?.details ?? null;

  const submitTo = problem ? `/hackathon/submit?problem=${encodeURIComponent(problem.id)}` : "/hackathon/submit";

  // Dynamic section numbering (ensures no gaps if any section is absent)
  let sectionCounter = 1;
  const overviewIndex = problem?.summary ? sectionCounter++ : null;
  const statementIndex = statementText ? sectionCounter++ : null;
  const requirementsIndex = problem?.constraints?.length > 0 ? sectionCounter++ : null;
  const deliverablesIndex = problem?.deliverables?.length > 0 ? sectionCounter++ : null;
  const judgingIndex =
    (Array.isArray(problem?.judging) ? problem.judging.length > 0 : Boolean(problem?.judging))
      ? sectionCounter++
      : null;
  const submissionIndex = sectionCounter++;

  return (
    <Section spacing="compact">
      <Container size="narrow">
        {/* Top bar: back link + preview toggle */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/problem-statements"
            data-cursor="link"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-sm min-h-[44px]"
            aria-label="Back to all problems"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            All problems
          </Link>

          {import.meta.env.DEV && isLocked && problem && (
            <button
              type="button"
              onClick={() => setOverrideUnlock((prev) => !prev)}
              data-cursor="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-border bg-card text-[11px] font-mono text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 min-h-[44px]"
            >
              {overrideUnlock ? (
                <Lock className="w-3 h-3 text-primary" aria-hidden="true" />
              ) : (
                <Unlock className="w-3 h-3 text-accent-amber" aria-hidden="true" />
              )}
              {overrideUnlock ? "Lock" : "Preview"}
            </button>
          )}
        </div>

        {/* Locked state */}
        {showLocked ? (
          <Reveal>
            <LockedState revealDate={revealDate} />
          </Reveal>
        ) : isLoading ? (
          <article
            aria-busy="true"
            aria-label="Loading problem statement"
            className="bg-card border border-border rounded-lg p-6 sm:p-10 shadow-sm animate-pulse space-y-6"
            style={{ maxWidth: "860px", margin: "0 auto" }}
          >
            <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-4">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-primary/20 rounded-full" />
                  <div className="h-5 w-20 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="h-8 w-3/4 bg-foreground/20 rounded-sm" />
              </div>
              <div className="h-16 w-28 bg-primary/10 rounded-sm border border-primary/20 shrink-0" />
            </div>
            <div className="h-12 w-full bg-muted/30 rounded-sm" />
            <div className="space-y-3 pt-6 border-t border-border/50">
              <div className="h-4 w-32 bg-muted-foreground/30 rounded" />
              <div className="h-4 w-full bg-muted-foreground/20 rounded" />
              <div className="h-4 w-5/6 bg-muted-foreground/20 rounded" />
            </div>
            <div className="space-y-3 pt-6 border-t border-border/50">
              <div className="h-4 w-40 bg-muted-foreground/30 rounded" />
              <div className="h-4 w-full bg-muted-foreground/20 rounded" />
              <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
            </div>
          </article>
        ) : error ? (
          <div
            className="bg-card border border-border rounded-lg p-6 sm:p-10 shadow-sm text-center space-y-3"
            style={{ maxWidth: "860px", margin: "0 auto" }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground font-mono">
              {error.message || "Failed to load problem statement."}
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
        ) : problem ? (
          /* Single readable card */
          <Reveal>
            <article
              aria-labelledby="problem-title"
              className="bg-card border border-border rounded-lg p-6 sm:p-10 shadow-sm"
              style={{ maxWidth: "860px", margin: "0 auto" }}
            >
              {/* Card header */}
              <header className="space-y-4">
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-4">
                  {/* Left: badges + title */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                        {problem.track}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${difficultyClass(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {/* Title — the one h1 on this page */}
                    <h1
                      id="problem-title"
                      className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground leading-tight"
                    >
                      {problem.title}
                    </h1>
                  </div>

                  {/* Right: Prominent Score Block (stacks under title on xs) */}
                  {problem.points != null && (
                    <div className="shrink-0 flex flex-col items-center justify-center min-w-[110px] px-4 py-3 rounded-sm border border-primary/30 bg-primary/10 text-center self-start xs:self-auto">
                      <span className="font-mono font-bold text-4xl text-primary leading-none">
                        {problem.points}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
                        POINTS
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick facts strip */}
                <div className="grid grid-cols-1 xs:grid-cols-3 divide-y xs:divide-y-0 xs:divide-x divide-border/60 border border-border/60 rounded-sm bg-muted/20 text-center py-2.5 mt-6">
                  <div className="px-3 py-1.5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Track</div>
                    <div className="font-mono text-xs font-semibold text-foreground mt-0.5 truncate">{problem.track}</div>
                  </div>
                  <div className="px-3 py-1.5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Difficulty</div>
                    <div className="font-mono text-xs font-semibold text-foreground mt-0.5">{problem.difficulty}</div>
                  </div>
                  <div className="px-3 py-1.5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Points</div>
                    <div className="font-mono text-xs font-semibold text-primary mt-0.5">
                      {problem.points != null ? `${problem.points} pts` : "—"}
                    </div>
                  </div>
                </div>
              </header>

              {/* 01 Overview */}
              {overviewIndex != null && (
                <section aria-labelledby="section-overview" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={overviewIndex} title="Overview" />
                  <h2 id="section-overview" className="sr-only">Overview</h2>
                  <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-sans max-w-[70ch]">
                    <InlineText text={problem.summary} />
                  </p>
                </section>
              )}

              {/* 02 Problem statement */}
              {statementIndex != null && (
                <section aria-labelledby="section-statement" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={statementIndex} title="Problem statement" />
                  <h2 id="section-statement" className="sr-only">Problem statement</h2>
                  <ProseText text={statementText} />
                </section>
              )}

              {/* 03 Requirements */}
              {requirementsIndex != null && (
                <section aria-labelledby="section-requirements" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={requirementsIndex} title="Requirements" />
                  <h2 id="section-requirements" className="sr-only">Requirements</h2>
                  <ul className="space-y-2.5 list-none">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-base leading-[1.75] text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-[5px]" aria-hidden="true" />
                        <span><InlineText text={c} /></span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 04 Deliverables */}
              {deliverablesIndex != null && (
                <section aria-labelledby="section-deliverables" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={deliverablesIndex} title="Deliverables" />
                  <h2 id="section-deliverables" className="sr-only">Deliverables</h2>
                  <ul className="space-y-2.5 list-none">
                    {problem.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-base leading-[1.75] text-foreground">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-[5px]" aria-hidden="true" />
                        <span><InlineText text={del} /></span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 05 Judging criteria */}
              {judgingIndex != null && (
                <section aria-labelledby="section-judging" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={judgingIndex} title="Judging criteria" />
                  <h2 id="section-judging" className="sr-only">Judging criteria</h2>
                  {Array.isArray(problem.judging) ? (
                    <div className="space-y-4 max-w-[70ch]">
                      {problem.judging.map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between gap-4 text-sm font-mono">
                            <span className="text-foreground">{item.label}</span>
                            <span className="font-bold text-primary shrink-0">{item.weight}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden" aria-hidden="true">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, item.weight))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base leading-[1.75] text-foreground max-w-[70ch]">
                      <InlineText text={problem.judging} />
                    </p>
                  )}
                </section>
              )}

              {/* 06 Submission */}
              {submissionIndex != null && (
                <section aria-labelledby="section-submission" className="pt-6 mt-6 border-t border-border/50">
                  <SectionLabel index={submissionIndex} title="Submission" />
                  <h2 id="section-submission" className="sr-only">Submission</h2>
                  <div className="space-y-4 max-w-[70ch]">
                    <p className="text-base leading-[1.75] text-foreground">
                      Submit your public GitHub repository link and a README link before the deadline.
                    </p>
                  </div>
                </section>
              )}

              {/* Card footer */}
              <div className="pt-8 mt-6 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Prev / Next */}
                {(prevProblem || nextProblem) ? (
                  <nav aria-label="Adjacent problems" className="flex items-center gap-3">
                    {prevProblem ? (
                      <Link
                        to={`/problem-statements/${prevProblem.id}`}
                        data-cursor="link"
                        className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-sm min-h-[44px]"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        Previous
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground/40 min-h-[44px] cursor-default select-none">
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        Previous
                      </span>
                    )}
                    <span className="text-border/60 select-none" aria-hidden="true">|</span>
                    {nextProblem ? (
                      <Link
                        to={`/problem-statements/${nextProblem.id}`}
                        data-cursor="link"
                        className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-sm min-h-[44px]"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground/40 min-h-[44px] cursor-default select-none">
                        Next
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    )}
                  </nav>
                ) : <div />}

                {/* Bottom submit CTA + repeated points */}
                <div className="flex items-center gap-3">
                  {problem.points != null && (
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {problem.points} pts
                    </span>
                  )}
                  <SubmitButton to={submitTo} prefetch={submitPrefetch} />
                </div>
              </div>
            </article>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

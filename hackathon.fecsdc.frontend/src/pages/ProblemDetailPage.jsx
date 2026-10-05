import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileCheck, Award, Lock, Unlock } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useProblemLock } from "../hooks/useProblemLock.js";
import { usePrefetchIntent } from "../hooks/usePrefetchRoute.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { LockedState } from "../components/ui/LockedState.jsx";
import { problems } from "../data/loadData.js";
import NotFoundPage from "./NotFoundPage.jsx";
import { Reveal } from "../components/motion/Reveal.jsx";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { isLocked, revealDate } = useProblemLock();
  const submitPrefetch = usePrefetchIntent("/hackathon/submit");
  const [overrideUnlock, setOverrideUnlock] = useState(false);

  // Validate :id
  const problem = problems.find((p) => p.id.toLowerCase() === id?.toLowerCase());

  useDocumentTitle(
    problem ? `${problem.title} | Problem Statement` : "Problem Not Found",
    problem?.summary
  );

  // If bad ID, render NotFound directly
  if (!problem) {
    return <NotFoundPage message={`Problem Statement with identifier '${id}' was not found.`} />;
  }

  const showLocked = isLocked && !overrideUnlock;

  return (
    <Section spacing="compact">
      <Container size="narrow">
        {/* Back Link & Testing toggle */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/problem-statements"
            data-cursor="link"
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Problem Statements</span>
          </Link>

          {isLocked && (
            <button
              type="button"
              onClick={() => setOverrideUnlock((prev) => !prev)}
              data-cursor="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-border bg-card text-[11px] font-mono text-muted-foreground hover:text-foreground"
            >
              {overrideUnlock ? <Lock className="w-3 h-3 text-primary" /> : <Unlock className="w-3 h-3 text-accent-amber" />}
              <span>{overrideUnlock ? "Lock" : "Preview"}</span>
            </button>
          )}
        </div>

        {showLocked ? (
          <Reveal>
            <LockedState revealDate={revealDate} />
          </Reveal>
        ) : (
          <Reveal>
            <div className="space-y-8">
              {/* Header */}
              <div className="py-6 border-b border-border/60">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="font-mono text-xs text-primary font-bold uppercase">
                    {problem.id.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-primary px-2 py-0.5 rounded-sm bg-primary/20 border border-primary/40 uppercase">
                    {problem.track}
                  </span>
                  <span className="font-mono text-[10px] text-accent-amber px-2 py-0.5 rounded-sm bg-accent-amber/10 border border-accent-amber/30 uppercase">
                    {problem.difficulty}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground leading-tight">
                  {problem.title}
                </h1>
              </div>

              {/* Summary Callout */}
              <div className="p-5 rounded-sm border border-primary/30 bg-primary/10 text-xs sm:text-sm text-foreground/90 leading-relaxed font-mono">
                {problem.summary}
              </div>

              {/* Detailed Specification */}
              <SpotlightCard className="p-6 md:p-8 space-y-4 rounded-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <PillMark size="sm" />
                  <h2 className="text-lg font-display font-bold text-foreground">Detailed Briefing</h2>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-line">
                  {problem.details}
                </div>
              </SpotlightCard>

              {/* Technical Constraints */}
              <SpotlightCard className="p-6 md:p-8 space-y-4 rounded-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <AlertTriangle className="w-4 h-4 text-accent-amber" />
                  <h2 className="text-lg font-display font-bold text-foreground">Technical Constraints</h2>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 font-mono">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-accent-amber font-bold shrink-0 mt-0.5">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              {/* Expected Deliverables */}
              <SpotlightCard className="p-6 md:p-8 space-y-4 rounded-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <FileCheck className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-display font-bold text-foreground">Expected Deliverables</h2>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 font-mono">
                  {problem.deliverables.map((del, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>

              {/* Judging Breakdown */}
              <SpotlightCard className="p-6 md:p-8 space-y-3 rounded-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <Award className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-display font-bold text-foreground">Scoring & Judging Emphasis</h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
                  {problem.judging}
                </p>
              </SpotlightCard>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/problem-statements"
                  data-cursor="link"
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  ← Back to statements
                </Link>
                <Link
                  to={`/hackathon/submit?problem=${encodeURIComponent(problem.id)}`}
                  {...submitPrefetch}
                  data-cursor="button"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition-all"
                >
                  Submit your project
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

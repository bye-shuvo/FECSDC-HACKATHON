import { memo, useState, useMemo, useEffect, useRef, useDeferredValue } from "react";
import { Trophy, Award, Clock, Crown, ArrowUpDown } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { TiltCard } from "../components/ui/TiltCard.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table.jsx";
import { getSolvedSummary, resultsConfig, leaderboardData } from "../data/results.js";
import { Reveal } from "../components/motion/Reveal.jsx";

const TRACKS = ["Problem Solving", "Web Development"];

const SolvedQuestionChips = function SolvedQuestionChips({ solved, showMax = false }) {
  const visibleQuestions = solved.slice(0, 3);
  const remainingCount = solved.length - visibleQuestions.length;
  const fullListLabel = solved
    .map((question) => `${question.title}: ${question.earned}/${question.score} points`)
    .join(", ");

  return (
    <ul className="flex flex-wrap gap-1 list-none m-0 p-0" aria-label={`Solved questions: ${fullListLabel || "none"}`}>
      {visibleQuestions.map((question) => (
        <li key={question.questionId}>
          <span
            title={`${question.title}: ${question.earned}/${question.score} points`}
            className="inline-block max-w-40 truncate text-[10px] font-mono px-2 py-0.5 rounded-sm bg-muted/60 text-muted-foreground border border-border/40"
          >
            {question.title} · {question.earned}{showMax ? `/${question.score}` : ""} pts
          </span>
        </li>
      ))}
      {remainingCount > 0 && (
        <li>
          <span
            title={fullListLabel}
            aria-label={`${remainingCount} more solved questions. ${fullListLabel}`}
            className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-sm bg-muted/60 text-muted-foreground border border-border/40"
          >
            +{remainingCount} more
          </span>
        </li>
      )}
    </ul>
  );
};

const ParticipantRow = memo(function ParticipantRow({ entry }) {
  const solvedCount = getSolvedSummary(entry).count;

  return (
    <TableRow className="hover:bg-primary/5 transition-colors cursor-default">
      <TableCell>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-sm font-mono text-xs font-bold bg-muted/60 text-muted-foreground border border-border">
          {entry.rank}
        </span>
      </TableCell>
      <TableCell>
        <div>
          <span className="font-display font-bold text-foreground text-sm">
            {entry.name}
          </span>
          <div className="text-xs text-muted-foreground font-mono mt-0.5">
            Batch {entry.batch}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-muted/60 border border-border text-muted-foreground">
          {entry.track} · #{entry.trackRank}
        </span>
      </TableCell>
      <TableCell>
        <SolvedQuestionChips solved={entry.solved} showMax />
      </TableCell>
      <TableCell className="text-center font-mono text-foreground">
        {solvedCount}
      </TableCell>
      <TableCell className="text-right font-mono font-bold text-foreground text-base">
        {entry.totalScore.toFixed(1)}
      </TableCell>
    </TableRow>
  );
});

function SortableHeader({ field, label, sortField, sortDirection, onSort, className = "" }) {
  const ariaSort = sortField === field
    ? sortDirection === "asc" ? "ascending" : "descending"
    : "none";

  return (
    <th scope="col" aria-sort={ariaSort} className={`px-4 py-3.5 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1.5 text-left hover:text-foreground"
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        <ArrowUpDown className={`w-3.5 h-3.5 ${sortField === field ? "text-primary" : "text-muted-foreground/50"}`} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function ResultsPage() {
  useDocumentTitle("Final Results & Leaderboard", "Official standings and scores for FEC SDC Hackathon 2026.");

  const [selectedTrack, setSelectedTrack] = useState("All");
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");

  const deferredTrack = useDeferredValue(selectedTrack);
  const deferredSortField = useDeferredValue(sortField);
  const deferredSortDirection = useDeferredValue(sortDirection);

  const confettiCanvasRef = useRef(null);

  const tracks = useMemo(() => {
    return ["All", ...TRACKS.filter((track) => leaderboardData.some((entry) => entry.track === track))];
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "totalScore" || field === "solvedCount" ? "desc" : "asc");
    }
  };

  const processedData = useMemo(() => {
    let data = [...leaderboardData];

    if (deferredTrack !== "All") {
      data = data.filter((d) => d.track === deferredTrack);
    }

    data.sort((a, b) => {
      let aVal = deferredSortField === "solvedCount"
        ? getSolvedSummary(a).count
        : a[deferredSortField];
      let bVal = deferredSortField === "solvedCount"
        ? getSolvedSummary(b).count
        : b[deferredSortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return deferredSortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return deferredSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [deferredTrack, deferredSortField, deferredSortDirection]);

  const summary = useMemo(() => {
    const counts = Object.fromEntries(TRACKS.map((track) => [track, 0]));
    const questionCount = leaderboardData.reduce((count, entry) => {
      counts[entry.track] = (counts[entry.track] ?? 0) + 1;
      return count + getSolvedSummary(entry).count;
    }, 0);

    return { participantCount: resultsConfig.totalParticipantsJudged, questionCount, counts };
  }, []);

  // Extract top 3 podium
  const top3 = useMemo(() => {
    const champ = leaderboardData.find((d) => d.rank === 1);
    const runner1 = leaderboardData.find((d) => d.rank === 2);
    const runner2 = leaderboardData.find((d) => d.rank === 3);
    return [runner1, champ, runner2].filter(Boolean);
  }, []);

  const isPublished = resultsConfig.published && leaderboardData.length > 0;

  // Once-only pill confetti burst on podium enter
  useEffect(() => {
    if (!isPublished || !confettiCanvasRef.current) return;
    const canvas = confettiCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#F47B30", "#F89C2E", "#4F4F6F", "#ffffff"];
    const particles = Array.from({ length: 45 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.4,
      w: 8 + Math.random() * 8,
      h: 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: -5 - Math.random() * 6,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    let animId;
    let frames = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.rot += p.vRot;
        if (frames > 35) p.opacity -= 0.02;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          // Pill-shaped particle
          ctx.beginPath();
          ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 2);
          ctx.fill();
          ctx.restore();
        }
      });

      frames++;
      if (alive && frames < 90) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPublished]);

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="FINAL STANDINGS"
          title="Participant Leaderboard"
          gradientWord="Leaderboard"
          description="Individual participant scores and solved questions across both competition tracks."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Leaderboard" }
          ]}
        />

        {!isPublished ? (
          /* Empty State when results are pending */
          <Reveal>
            <SpotlightCard className="p-12 md:p-16 text-center max-w-2xl mx-auto rounded-sm flex flex-col items-center">
              <div className="w-16 h-16 rounded-sm bg-muted/80 border border-border flex items-center justify-center text-primary mb-6">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-amber px-3 py-1 rounded-sm bg-accent-amber/10 border border-accent-amber/30 mb-5">
                STATUS: IN EVALUATION
              </span>
              <h2 className="text-2xl font-display font-bold text-foreground mt-3 mb-3">
                Results will be published after judging
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono max-w-md leading-relaxed">
                Jury evaluation is scheduled for later. Standings, official scores, and special track certificates will populate here immediately following the closing awards ceremony.
              </p>
            </SpotlightCard>
          </Reveal>
        ) : (
          /* Published Leaderboard Content */
          <div className="space-y-12 relative">
            {/* Pill Confetti Canvas Overlay */}
            <canvas
              ref={confettiCanvasRef}
              className="absolute inset-x-0 top-0 h-96 w-full pointer-events-none z-20"
            />

            {/* Top 3 Podium Cards */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <PillMark size="sm" />
                <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
                  Top 3 Finalists
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {top3.map((participant, idx) => {
                  const isChamp = participant.rank === 1;
                  const isRunnerUp = participant.rank === 2;

                  const borderStyle = isChamp
                    ? "border-primary/80 bg-card shadow-2xl shadow-primary/10 md:-translate-y-6"
                    : "border-border/80 bg-card/90";

                  return (
                    <Reveal key={participant.id} delay={idx * 0.1}>
                      <TiltCard
                        maxTilt={isChamp ? 10 : 6}
                        className={`p-6 sm:p-8 flex flex-col justify-between rounded-sm relative overflow-hidden group border ${borderStyle}`}
                      >
                        {/* Shine sweep */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                        <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-12 h-12 rounded-sm flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
                                isChamp
                                  ? "bg-primary/20 border-primary text-primary"
                                  : isRunnerUp
                                  ? "bg-accent-amber/20 border-accent-amber text-accent-amber"
                                  : "bg-brand-slate/20 border-brand-slate text-foreground"
                              }`}
                            >
                              {isChamp ? <Crown className="w-6 h-6" /> : isRunnerUp ? <Trophy className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                            </div>
                            <span className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm bg-muted/60 border border-border text-foreground">
                              {participant.status}
                            </span>
                          </div>

                          <div>
                            <div className="font-mono text-xs text-muted-foreground uppercase">
                              Rank #{participant.rank} • {participant.track} #{participant.trackRank}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">
                              {participant.name}
                            </h3>
                            <p className="text-xs text-primary font-mono mt-1 font-semibold">
                              Batch {participant.batch} • {participant.track}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                            <span className="text-xs font-mono text-muted-foreground">Total score:</span>
                            <span className="font-mono text-2xl font-black text-foreground">
                              {participant.totalScore.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-border/40 relative z-10">
                          <SolvedQuestionChips solved={participant.solved} />
                        </div>
                      </TiltCard>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* Filter and Table Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <PillMark size="sm" />
                  <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
                    All Participants
                  </h2>
                </div>

                {/* Track Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {tracks.map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setSelectedTrack(track)}
                      aria-pressed={selectedTrack === track}
                      data-cursor="button"
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors select-none ${
                        selectedTrack === track
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border"
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 border border-border/80 rounded-sm bg-card/80 px-4 py-3 text-xs font-mono text-muted-foreground">
                <span><strong className="text-foreground">{summary.participantCount}</strong> participants judged</span>
                <span><strong className="text-foreground">{summary.questionCount}</strong> questions solved</span>
                {TRACKS.map((track) => (
                  <span key={track}>
                    <strong className="text-foreground">{summary.counts[track]}</strong> {track} participants
                  </span>
                ))}
              </div>

              {/* Leaderboard Table with Sticky Header */}
              <Reveal>
                {processedData.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-4 py-8 text-center border border-border/80 rounded-sm bg-card/80">
                    No participants in this track yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-card border-b border-border">
                      <TableRow>
                        <SortableHeader field="rank" label="Rank" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="w-16 font-mono text-xs" />
                        <SortableHeader field="name" label="Participant" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="font-mono text-xs" />
                        <TableHead className="font-mono text-xs">Track</TableHead>
                        <TableHead className="font-mono text-xs">Solved questions</TableHead>
                        <SortableHeader field="solvedCount" label="Solved count" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="font-mono text-xs text-center" />
                        <SortableHeader field="totalScore" label="Total score" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-right font-mono text-xs" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedData.map((entry) => <ParticipantRow key={entry.id} entry={entry} />)}
                    </TableBody>
                  </Table>
                )}
              </Reveal>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

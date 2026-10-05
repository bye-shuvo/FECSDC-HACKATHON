import { Link } from "react-router";
import { ArrowRight, Cpu, Terminal, Shield, Sparkles } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { TiltCard } from "../components/ui/TiltCard.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { Reveal } from "../components/motion/Reveal.jsx";

const challengeTracks = [
  {
    id: "track-1",
    number: "01",
    title: "Problem Solving & Logic",
    icon: Cpu,
    tag: "Problem Solving",
    summary: "Focus on logical thinking, algorithm design, and building functional solutions to defined problems. Emphasis on clear reasoning and clean implementation.",
    focusAreas: [
      "Clear problem understanding & simple logic",
      "Working solution with basic algorithms",
      "Clean, readable code & edge-case handling",
    ],
    accent: "text-primary",
    badgeColor: "bg-primary/20 text-primary border-primary/40",
  },
  {
    id: "track-2",
    number: "02",
    title: "Web Development & UI/UX",
    icon: Terminal,
    tag: "Web Development",
    summary: "Focus on building practical web solutions that demonstrate frontend skills, responsive design, and functional user interfaces.",
    focusAreas: [
      "Responsive HTML/CSS/JS interface",
      "Simple working feature (form, list, CRUD)",
      "Clean UI, usability & clear README",
    ],
    accent: "text-accent-amber",
    badgeColor: "bg-accent-amber/20 text-accent-amber border-accent-amber/40",
  }
];

export default function ChallengesPage() {
  useDocumentTitle("Challenge Tracks", "4 Core Innovation Tracks for FEC SDC Hackathon 2026.");

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="CHALLENGE TRACKS & DOMAINS"
          title="Hackathon Challenges"
          gradientWord="Challenges"
          description="Choose your engineering battleground. Teams select one of the four specialized tracks upon problem statement drop."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Challenges" }
          ]}
        />

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {challengeTracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <Reveal key={track.id} delay={idx * 0.08}>
                <TiltCard className="p-8 h-full flex flex-col justify-between rounded-sm border border-border/80 bg-card/90">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-sm bg-muted/80 border border-border flex items-center justify-center text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-mono text-2xl font-bold text-muted-foreground/40">
                          {track.number}
                        </span>
                      </div>
                      <span className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm border ${track.badgeColor}`}>
                        {track.tag}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
                        {track.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
                        {track.summary}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-border/40">
                      <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                        KEY ARCHITECTURAL TARGETS:
                      </span>
                      <ul className="space-y-1.5 text-xs font-mono text-foreground/90">
                        {track.focusAreas.map((area, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PillMark size="sm" />
                      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                        SPECIFICATION READY
                      </span>
                    </div>

                    {track.id === "track-1" ? (
                    <a
                      href="https://www.hackerrank.com/fecsdc-202610"
                      data-cursor="link"
                      className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-accent-amber transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Problem Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      to={"/problem-statements"}
                      data-cursor="link"
                      className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary hover:text-accent-amber transition-colors"
                    >
                      <span>Problem Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

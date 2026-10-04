import { Link } from "react-router";
import { Terminal, Users, Cpu, ShieldCheck, ArrowRight, Zap, GitBranch } from "lucide-react";
import { Section, Container } from "../ui/Section.jsx";
import { SectionPillMarker, PillMark } from "../ui/PillDividers.jsx";
import { TiltCard } from "../ui/TiltCard.jsx";
import { BentoGrid, BentoItem } from "../ui/BentoGrid.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Reveal } from "../motion/Reveal.jsx";

export function AboutTeaserSection() {
  return (
    <Section id="about-teaser">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionPillMarker label="ENGINEERING DNA" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Forging the Next Generation of <span className="gradient-text-brand">Builders</span>
            </h2>
          </div>
          <Link
            to="/hackathon/about"
            className="group inline-flex items-center gap-2 text-sm font-label text-primary hover:text-accent-amber transition-colors"
          >
            <span>Learn about our mission</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Bento Grid */}
        <BentoGrid className="auto-rows-[minmax(220px,auto)] md:auto-rows-55">
          {/* Main Large Feature Block (Col Span 2, Row Span 2) */}
          <BentoItem colSpan="md:col-span-2" rowSpan="row-span-2 md:row-span-2">
            <TiltCard className="flex h-full w-full min-w-0 flex-col justify-between bg-card/90 border-border p-7 sm:p-6 md:p-8">
              <div className="w-full min-w-0 space-y-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <Badge variant="primary" size="sm" className="shrink-0">
                    SANCTUARY
                  </Badge>
                </div>

                <h3 className="min-w-0 break-words text-xl sm:text-2xl font-bold text-foreground">
                  6-Hour Deep Engineering Sprint
                </h3>

                <p className="min-w-0 break-words text-sm text-muted-foreground leading-relaxed">
                  A beginner-friendly coding sprint at the FEC Campus where participants learn HTML, CSS, JavaScript, and problem-solving while building web projects, improving confidence, and turning ideas into working solutions.
                </p>

                <div className="w-full min-w-0 max-w-full p-3 sm:p-4 rounded-sm bg-muted/60 border border-border/80 text-[11px] sm:text-xs font-mono text-foreground/80 space-y-1">
                  <div>// FEC SDC Environment Rule</div>
                  <div className="text-primary font-bold break-all">git checkout -b hackathon-main</div>
                  <div className="text-muted-foreground"># Fresh repo creation upon event opening</div>
                </div>
              </div>

              <div className="mt-5 pt-4 sm:pt-6 border-t border-border/40 flex min-w-0 flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-muted-foreground">
                <span className="min-w-0 break-words">Online Event • Time Constraints</span>
                <PillMark size="sm" />
              </div>
            </TiltCard>
          </BentoItem>

          {/* Feature 2: Mentorship Clinics (Col Span 1 or 2) */}
          <BentoItem colSpan="md:col-span-1 lg:col-span-2" rowSpan="row-span-1">
            <TiltCard className="p-6 flex flex-col justify-between h-full bg-card/90 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                     Project Review
                  </h3>
                </div>
                <Badge variant="amber" size="sm">
                  MENTORSHIP
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Direct project and documentation reviews from senior club alumni who inspect overall structure and programming resilience.
              </p>

              <div className="text-[11px] font-mono text-accent-amber flex items-center gap-1.5 pt-2">
                <span>Code review and overall evalution after code submission</span>
              </div>
            </TiltCard>
          </BentoItem>

          {/* Feature 3: Incubation Fast-Track */}
          <BentoItem colSpan="md:col-span-1" rowSpan="row-span-1">
            <TiltCard className="p-6 flex flex-col justify-between h-full bg-card/90 border-border">
              <div className="w-9 h-9 rounded-sm bg-brand-slate/20 border border-brand-slate/30 flex items-center justify-center text-foreground mb-3">
                <Zap className="w-4 h-4 text-primary" />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">
                  Incubation Grants
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Top projects will have a change of featuring to our official channels.
                </p>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/40">
                Post-hackathon guidance
              </div>
            </TiltCard>
          </BentoItem>

          {/* Feature 4: Open Source Git Workflow */}
          <BentoItem colSpan="md:col-span-1" rowSpan="row-span-1">
            <TiltCard className="p-6 flex flex-col justify-between h-full bg-card/90 border-border">
              <div className="w-9 h-9 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <GitBranch className="w-4 h-4" />
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">
                  Public Version Control
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Transparent multi-branch git activity evaluated by jury scanners.
                </p>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground pt-3 border-t border-border/40">
                Verifiable commit telemetry
              </div>
            </TiltCard>
          </BentoItem>
        </BentoGrid>
      </Container>
    </Section>
  );
}

import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Target, Users2, Shield, Layers, Cpu, Terminal } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { TiltCard } from "../../components/ui/TiltCard.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Reveal } from "../../components/motion/Reveal.jsx";

export default function AboutPage() {
  useDocumentTitle("About the Hackathon", "Mission, format, tracks, and participation criteria.");

  const tracks = [
    {
      title: "Problem Solving",
      desc: "Solve real-world problems with your creativity and innovation.",
      tag: "TRACK 01",
    },
    {
      title: "Web Development",
      desc: "Build innovative web applications with your creativity and innovation.",
      tag: "TRACK 02",
    },
    // {
    //   title: "Fintech & Open Commerce",
    //   desc: "Cryptographic offline micro-payment meshes, zero-trust ledgers, and decentralized peer-to-peer barter protocols.",
    //   tag: "TRACK 03",
    // },
    // {
    //   title: "AI & Intelligent Systems",
    //   desc: "Bilingual multimodal clinical triage, agentic workflow orchestration, and edge neural inference engines.",
    //   tag: "TRACK 04",
    // },
  ];

  return (
    <Section spacing="compact">
      <Container>
        {/* PageHeader with breadcrumbs */}
        <PageHeader
          eyebrow="THE INITIATIVE"
          title="About the"
          highlightWord="Hackathon"
          description="6 continuous hours uniting Faridpur Engineering College's top algorithmic minds, systems builders, and interface designers."
          breadcrumbs={[
            { to: "/hackathon", label: "Hackathon" },
            { label: "About" },
          ]}
          action={
            <Button to="/hackathon/register" variant="primary" size="md" icon={ArrowRight}>
              Apply as member
            </Button>
          }
        />

        {/* Large Mission Typography Statement with Word Highlight */}
        <Reveal>
          <div className="p-8 sm:p-12 md:p-16 rounded-md border border-border bg-card/70 my-10 relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <span className="font-label text-xs tracking-widest text-primary font-bold">
                OUR PRIMARY CONVICTION
              </span>
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
                True engineering virtuosity is forged when{" "}
                <span className="gradient-text-brand">theoretical principles</span> collide with{" "}
                <span className="text-foreground border-b-2 border-primary">uncompromising constraints</span>.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-2">
                We dismantle traditional classroom silos, providing engineers with raw development environment, expert mentors, and urgent problem solving directives.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Format Cards */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-2">
            <PillMark size="sm" />
            <h2 className="text-2xl font-bold text-foreground">Competition Format</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Online Competition</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  6 hours online competition with continuous support from mentors and organizers.
                </p>
              </div>
              <div className="pt-4 border-t border-border/40 text-[11px] font-mono text-primary">
                Online infrastructure
              </div>
            </TiltCard>

            <TiltCard className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Discord Arena</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Real-time support, announcements, team voice rooms, and mentor help on discord server.
                </p>
              </div>
              <div className="pt-4 border-t border-border/40 text-[11px] font-mono text-accent-amber">
                Virtual coordination
              </div>
            </TiltCard>

            <TiltCard className="p-6 bg-card border-border flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-brand-slate/20 border border-brand-slate/30 flex items-center justify-center text-foreground">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Final Jury Session</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Meet the judges, listen to the winning pitches, and get inspired by the best projects.
                </p>
              </div>
              <div className="pt-4 border-t border-border/40 text-[11px] font-mono text-muted-foreground">
                Final Evaluation
              </div>
            </TiltCard>
          </div>
        </div>

        {/* 4 Tracks Overview */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PillMark size="sm" />
            <h2 className="text-2xl font-bold text-foreground">The Two Tracks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track, idx) => (
              <Reveal key={track.title} delay={idx * 0.08}>
                <Card className="p-6 h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-label text-xs text-primary font-semibold">
                      {track.tag}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{track.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border/40">
                    <Link
                      to="/challenges"
                      className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:text-accent-amber transition-colors"
                    >
                      <span>Explore challenge track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

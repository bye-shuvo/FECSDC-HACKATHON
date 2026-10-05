import { Link } from "react-router";
import { ArrowRight, Users, Award, ShieldAlert, BookOpen, Clock, Calendar, Zap } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { TiltCard } from "../../components/ui/TiltCard.jsx";
import { BentoGrid, BentoItem } from "../../components/ui/BentoGrid.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Reveal } from "../../components/motion/Reveal.jsx";

const hubCards = [
  {
    to: "/hackathon/register",
    title: "Registration Portal",
    desc: "Register to Compete with your fellow companions to conqure the prizes.",
    icon: Users,
    badge: "ACTION REQUIRED",
    highlight: true,
    colSpan: "md:col-span-2",
  },
  {
    to: "/hackathon/schedule",
    title: "Agenda & Timeline",
    desc: "6-hour long online hackathon for the first-years. ",
    icon: Clock,
    badge: "SCHEDULE",
    colSpan: "md:col-span-1 lg:col-span-2",
  },
  {
    to: "/hackathon/rules",
    title: "Rules & Evaluation",
    desc: "Rules to be followed during the hackathon and evaluation criteria.",
    icon: ShieldAlert,
    badge: "ESSENTIAL",
    colSpan: "md:col-span-1 lg:col-span-2",
  },
  {
    to: "/hackathon/prizes",
    title: "Prizes & Perks",
    desc: "Exciting prizes, certificates and much more.",
    icon: Award,
    badge: "PRIZES",
    colSpan: "md:col-span-1 lg:col-span-2",
  },
  {
    to: "/hackathon/about",
    title: "About",
    desc: "Learn about the hackathon format and expectations.",
    icon: BookOpen,
    badge: "INFO",
    colSpan: "md:col-span-1 lg:col-span-2",
  },
  {
    to: "/hackathon/faq",
    title: "Help & FAQ",
    desc: "Frequently asked questions regarding schedule, prizes, rules and other queries.",
    icon: Calendar,
    badge: "SUPPORT",
    colSpan: "md:col-span-1 lg:col-span-2",
  },
];

export default function OverviewPage() {
  useDocumentTitle("Hackathon Hub", "Overview and navigation hub for FEC SDC Hackathon 2026.");

  return (
    <Section spacing="compact">
      <Container>
        {/* Standardized PageHeader with Breadcrumb */}
        <PageHeader
          eyebrow="HACKATHON OPERATIONS"
          title="Command"
          highlightWord="Hub"
          description="Your centralized operational base for schedule, rules, applications, prizes and other details."
          breadcrumbs={[{ label: "Hackathon" }]}
          action={
            <Button to="/hackathon/register" variant="primary" icon={ArrowRight} size="md">
              Register Now
            </Button>
          }
        />

        {/* Exclusive Notice Banner */}
        <Reveal>
          <div className="p-4 md:p-5 rounded-md border border-primary/40 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <PillMark size="md" />
              <div>
                <span className="font-label text-xs tracking-widest text-primary font-bold">
                  VERIFIED MEMBERSHIP REQUIRED
                </span>
                <p className="text-xs md:text-sm text-foreground/90 font-mono mt-0.5">
                  Registration is strictly restricted to registered members of FEC Software Development Club.
                </p>
              </div>
            </div>
            <Badge variant="primary" dot={true}>
              Registration open
            </Badge>
          </div>
        </Reveal>

        {/* Bento Grid of Hub Section Links as TiltCards */}
        <BentoGrid>
          {hubCards.map((card) => {
            const Icon = card.icon;
            return (
              <BentoItem key={card.to} colSpan={card.colSpan}>
                <Link to={card.to} className="block h-full group focus:outline-none">
                  <TiltCard
                    maxTilt={6}
                    className={`h-full p-6 flex flex-col justify-between ${card.highlight ? "border-primary/60 bg-card/90" : "bg-card/75"
                      }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-sm bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-label text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {card.title}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-1">
                          {card.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-primary group-hover:text-accent-amber transition-colors">
                      <span>Explore section</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </TiltCard>
                </Link>
              </BentoItem>
            );
          })}
        </BentoGrid>
      </Container>
    </Section>
  );
}

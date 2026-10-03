import { memo, useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { Section, Container } from "../ui/Section.jsx";
import { SectionPillMarker, PillMark } from "../ui/PillDividers.jsx";
import { TiltCard } from "../ui/TiltCard.jsx";
import { scheduleData } from "../../data/schedule.js";
import { Reveal } from "../motion/Reveal.jsx";

const TimelineDayCard = memo(function TimelineDayCard({ dayPlan }) {
  const events = dayPlan.events ?? [];

  return (
    <div className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-8 group">
      {/* Node Pill Marker */}
      <div className="absolute -left-[24px] md:-left-[32px] top-2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center z-20 shadow-md group-hover:scale-110 transition-transform">
        <div className="w-2 h-2 rounded-full bg-accent-amber" />
      </div>

      {/* Day Header Badge */}
      <div className="md:w-48 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-card border border-border">
          <PillMark size="sm" />
          <span className="font-label text-xs font-bold text-foreground">
            {dayPlan.day}
          </span>
          <span className="font-label text-xs font-bold text-foreground">
            {dayPlan.phaseLabel}
          </span>
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-1.5">
          {dayPlan.date}
        </p>
      </div>

      {/* Content Card with 3D Tilt */}
      <div className="flex-1">
        <TiltCard maxTilt={5} className="p-6 bg-card border-border shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">
            {dayPlan.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            {dayPlan.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40">
            {events.slice(0, 2).map((ev) => (
              <div
                key={`${ev.time}-${ev.title}`}
                className="flex items-start gap-2.5 text-xs font-mono"
              >
                <Clock className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="text-primary font-semibold">{ev.time}: </span>
                  <span className="text-foreground">{ev.title}</span>
                </div>
              </div>
            ))}
          </div>
        </TiltCard>
      </div>
    </div>
  );
});

export function TimelineTeaserSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
  });

  return (
    <Section id="timeline-teaser" className="bg-muted/15 border-y border-border/60">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionPillMarker label="EVENT SPRINT AGENDA" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Two-Phase <span className="gradient-text-brand">Timeline</span>
            </h2>
          </div>
          <Link
            to="/hackathon/schedule"
            className="group inline-flex items-center gap-2 text-sm font-label text-primary hover:text-accent-amber transition-colors"
          >
            <span>View complete schedule</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Timeline Container with SVG scroll-drawn line */}
        <div ref={containerRef} className="relative pl-6 md:pl-10">
          {/* SVG Animated Scroll Line */}
          <div className="absolute left-[13px] md:left-[21px] top-4 bottom-4 w-1 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Background Track */}
              <line
                x1="2"
                y1="0"
                x2="2"
                y2="100%"
                stroke="var(--border)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Active Scroll Drawn Stroke */}
              <motion.line
                x1="2"
                y1="0"
                x2="2"
                y2="100%"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>
          </div>

          <ol className="space-y-12 list-none m-0 p-0">
            {scheduleData.map((dayPlan, index) => (
              <Reveal
                as="li"
                key={dayPlan.id}
                delay={index * 0.1}
                className="list-none"
              >
                <TimelineDayCard dayPlan={dayPlan} />
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

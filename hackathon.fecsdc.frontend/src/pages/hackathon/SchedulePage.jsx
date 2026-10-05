import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Clock } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { Tabs } from "../../components/ui/Tabs.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { TiltCard } from "../../components/ui/TiltCard.jsx";
import { scheduleData } from "../../data/schedule.js";
import { Reveal } from "../../components/motion/Reveal.jsx";

export default function SchedulePage() {
  useDocumentTitle(
    "Hackathon Schedule",
    "48-Hour agenda, timeline, and milestone checkpoints.",
  );

  const [activeDay, setActiveDay] = useState(scheduleData[0].day);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const tabs = scheduleData.map((d) => ({
    id: d.day,
    label: `${d.day} (${d.date})`,
  }));

  const currentDayData =
    scheduleData.find((d) => d.day === activeDay) || scheduleData[0];
  const timelineRef = useRef(null);
  const { scrollYProgress: pathLength } = useScroll({
    target: timelineRef,
    // Keep the track empty until the first marker reaches viewport center;
    // fill through the timeline as each marker passes that same point.
    offset: ["start 50%", "end 50%"],
  });

  useEffect(() => {
    setActiveEventIndex(0);
  }, [activeDay]);

  useMotionValueEvent(pathLength, "change", (latest) => {
    const eventCount = currentDayData.events.length;
    if (!eventCount) return;

    const nextIndex = Math.min(
      eventCount - 1,
      Math.max(0, Math.round(latest * (eventCount - 1))),
    );

    setActiveEventIndex((prev) => (prev === nextIndex ? prev : nextIndex));
  });

  // Helper to determine status tag
  const getEventStatus = (idx) => {
    if (idx === activeEventIndex) return { label: "LIVE", variant: "primary" };
    if (
      currentDayData.events.length > 1 &&
      idx === (activeEventIndex + 1) % currentDayData.events.length
    ) {
      return { label: "NEXT", variant: "amber" };
    }
    return { label: "SCHEDULED", variant: "default" };
  };

  return (
    <Section spacing="compact">
      <Container size="narrow">
        {/* PageHeader with breadcrumbs */}
        <PageHeader
          eyebrow="EVENT TIMELINE"
          title="Official"
          highlightWord="Schedule"
          description="Detailed chronological agenda from kickoff, architecture clinics, and meals to live jury demos."
          breadcrumbs={[
            { to: "/hackathon", label: "Hackathon" },
            { label: "Schedule" },
          ]}
        />

        {/* Day Tabs with Motion LayoutId */}
        <div className="mb-6 sm:mb-8 overflow-x-auto pb-1">
          <div className="flex min-w-max justify-center">
            <Tabs
              tabs={tabs}
              activeTab={activeDay}
              onChange={setActiveDay}
              layoutId="schedule-day-tab"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Selected Day Banner */}
        <div className="p-4 sm:p-5 rounded-md border border-border bg-card/85 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <PillMark size="sm" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {currentDayData.title}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              {currentDayData.description}
            </p>
          </div>
          <Badge variant="primary" size="md" className="self-start sm:self-auto">
            {currentDayData.events.length} Milestones
          </Badge>
        </div>

        {/* Vertical Timeline with Node Markers */}
        <div ref={timelineRef} className="relative pl-5 sm:pl-6 md:pl-10 space-y-4 sm:space-y-6">
          <div className="absolute left-[5px] sm:left-[13px] md:left-[21px] top-[14px] bottom-[14px] w-1 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line
                x1="2"
                y1="0"
                x2="2"
                y2="100%"
                stroke="var(--border)"
                strokeWidth="3"
                strokeLinecap="round"
              />
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

          {currentDayData.events.map((event, idx) => {
            const status = getEventStatus(idx);

            return (
              <Reveal key={event.time + event.title} delay={idx * 0.05}>
                <div className="relative flex items-start gap-3 sm:gap-4 md:gap-6 group">
                  {/* Node Marker */}
                  <div
                    className={`absolute -left-[20px] sm:-left-[17px] md:-left-[25px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-primary transition-colors z-10 ${
                      idx <= activeEventIndex ? "bg-primary" : "bg-transparent"
                    }`}
                  />

                  {/* Timeline Card */}
                  <div className="w-full min-w-0">
                    <TiltCard maxTilt={4} className="p-4 sm:p-5 bg-card border-border">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-sm font-semibold text-primary">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={status.variant} size="sm">
                            {status.label}
                          </Badge>
                          <Badge variant="slate" size="sm">
                            {event.tag}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1 break-words">
                        {event.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed break-words">
                        {event.description}
                      </p>
                    </TiltCard>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

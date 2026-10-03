import { useState, useMemo } from "react";
import { Clock, Calendar, CheckCircle, Tag, Radio } from "lucide-react";
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
  useDocumentTitle("Hackathon Schedule", "48-Hour agenda, timeline, and milestone checkpoints.");

  const [activeDay, setActiveDay] = useState(scheduleData[0].day);

  const tabs = scheduleData.map((d) => ({
    id: d.day,
    label: `${d.day} (${d.date})`,
  }));

  const currentDayData = scheduleData.find((d) => d.day === activeDay) || scheduleData[0];

  // Helper to determine status tag
  const getEventStatus = (idx) => {
    if (activeDay === "Day 1" && idx === 0) return { label: "UPCOMING", variant: "primary" };
    if (idx === 1) return { label: "NEXT", variant: "amber" };
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
        <div className="flex items-center justify-center mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeDay}
            onChange={setActiveDay}
            layoutId="schedule-day-tab"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Selected Day Banner */}
        <div className="p-5 rounded-md border border-border bg-card/85 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <PillMark size="sm" />
              <h2 className="text-xl font-bold text-foreground">
                {currentDayData.title}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {currentDayData.description}
            </p>
          </div>
          <Badge variant="primary" size="md">
            {currentDayData.events.length} Milestones
          </Badge>
        </div>

        {/* Vertical Timeline with Node Markers */}
        <div className="relative pl-6 md:pl-8 space-y-6">
          <div className="absolute left-[11px] md:left-[15px] top-3 bottom-3 w-[2px] bg-border rounded-full" />

          {currentDayData.events.map((event, idx) => {
            const status = getEventStatus(idx);

            return (
              <Reveal key={event.time + event.title} delay={idx * 0.05}>
                <div className="relative flex items-start gap-4 md:gap-6 group">
                  {/* Node Marker */}
                  <div className="absolute -left-[20px] md:-left-[24px] top-1.5 w-4 h-4 rounded-full bg-card border-2 border-primary group-hover:bg-primary transition-colors z-10" />

                  {/* Timeline Card */}
                  <div className="w-full">
                    <TiltCard maxTilt={4} className="p-5 bg-card border-border">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-primary">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={status.variant} size="sm">
                            {status.label}
                          </Badge>
                          <Badge variant="slate" size="sm">
                            {event.tag}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                        {event.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
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

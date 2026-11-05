import { Trophy, ArrowRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig.js";
import { Countdown } from "../ui/Countdown.jsx";
import { Section, Container } from "../ui/Section.jsx";
import { Reveal } from "../motion/Reveal.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { PillMark } from "../ui/PillDividers.jsx";
import { useCountdown } from "../../hooks/useCountdown.js";

export function CountdownSection({
  eventDate = siteConfig.eventDate,
  submissionDeadline = siteConfig.submissionDeadline,
  eventEndDate = siteConfig.eventEndDate,
} = {}) {
  const startDate = eventDate;
  const timeoutDate = submissionDeadline || eventEndDate || startDate;

  const startTimestamp = Date.parse(startDate);
  const timeoutTimestamp = Date.parse(timeoutDate);

  const startCountdown = useCountdown(startDate);
  const timeoutCountdown = useCountdown(timeoutDate);

  // If start date is valid and event has not commenced yet:
  const isUpcoming = !Number.isNaN(startTimestamp) && !startCountdown.isExpired;

  // If hacking has started, but sprint timeout hasn't elapsed:
  const isLiveSprint =
    !isUpcoming &&
    !Number.isNaN(timeoutTimestamp) &&
    timeoutTimestamp > startTimestamp &&
    !timeoutCountdown.isExpired;

  // If sprint has ended / timed out:
  const isConcluded = !isUpcoming && !isLiveSprint;

  return (
    <Section id="live-countdown" spacing="compact" className="border-y border-border/70 bg-card/40">
      <Container size="narrow">
        <Reveal>
          {isConcluded ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-2xl border border-primary/30 bg-card/80 max-w-2xl mx-auto shadow-xl"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/10">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <PillMark size="sm" />
                <Badge variant="amber" size="md" dot dotColor="bg-accent-amber">
                  STATUS: EVENT CONCLUDED
                </Badge>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground mb-3">
                Hacking Sprint Has Concluded!
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-sans max-w-lg mx-auto leading-relaxed mb-6">
                The countdown timer has expired and project submissions are officially closed. Thank you to all participants for building and submitting innovative solutions!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button to="/results" variant="primary" icon={ArrowRight}>
                  View results & leaderboard
                </Button>
                <Button to="/hackathon/schedule" variant="outline">
                  View schedule
                </Button>
              </div>
            </div>
          ) : isLiveSprint ? (
            <div className="flex flex-col items-center justify-center text-center">
              <Countdown
                targetDate={timeoutDate}
                label="HACKING ENDS IN"
                statusBadge={
                  <Badge variant="primary" size="md" dot dotColor="bg-emerald-400">
                    STATUS: LIVE SPRINT
                  </Badge>
                }
                className="w-full"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <Button to="/hackathon/submit" variant="primary" size="sm" icon={ArrowRight}>
                  Submit project
                </Button>
                <Button to="/hackathon/challenges" variant="outline" size="sm">
                  View challenges
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <Countdown
                targetDate={startDate}
                label="HACKING COMMENCES IN"
                className="w-full"
              />
            </div>
          )}
        </Reveal>
      </Container>
    </Section>
  );
}

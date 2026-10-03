import { siteConfig } from "../../data/siteConfig.js";
import { Countdown } from "../ui/Countdown.jsx";
import { Section, Container } from "../ui/Section.jsx";
import { Reveal } from "../motion/Reveal.jsx";

export function CountdownSection() {
  return (
    <Section id="live-countdown" spacing="compact" className="border-y border-border/70 bg-card/40">
      <Container size="narrow">
        <Reveal>
          <div className="flex flex-col items-center justify-center text-center">
            <Countdown
              targetDate={siteConfig.eventDate}
              label="HACKING COMMENCES IN"
              className="w-full"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

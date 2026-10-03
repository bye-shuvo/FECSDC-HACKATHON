import { ArrowRight } from "lucide-react";
import { siteConfig } from "../../data/siteConfig.js";
import { Section, Container } from "../ui/Section.jsx";
import { Button } from "../ui/Button.jsx";
import { PillMark } from "../ui/PillDividers.jsx";
import { Magnetic } from "../motion/Magnetic.jsx";
import { Reveal } from "../motion/Reveal.jsx";

export function FinalCtaSection() {
  return (
    <Section className="py-24 md:py-36 relative overflow-hidden bg-card/60 border-t border-border">
      <Container size="narrow" className="relative z-10 text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-6">
            {/* Converging Pill Bar Marker */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border">
              <PillMark size="sm" />
              <span className="font-label text-xs tracking-widest text-primary font-bold">
                LIMITED TO 20 COMPETITORS
              </span>
            </div>

            {/* Oversized Heading */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-foreground max-w-2xl mx-auto leading-[1.08]">
              Ready to build the <span className="gradient-text-brand">future</span>?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Step into the 6-hour pressure cooker. Solve urgent engineering challenges, and cement your legacy at FEC SDC.
            </p>

            {/* Magnetic Register Button */}
            <div className="pt-4">
              <Magnetic strength={0.35}>
                <Button
                  to="/hackathon/register"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="min-w-[240px] text-base"
                  data-cursor="button"
                  data-cursor-label="JOIN"
                >
                  Register yourself
                </Button>
              </Magnetic>
            </div>

            <p className="text-xs font-mono text-muted-foreground/70 pt-2">
              Registration deadline: {new Date(siteConfig.registrationDeadline).toLocaleDateString()} • FEC Club Members Only
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

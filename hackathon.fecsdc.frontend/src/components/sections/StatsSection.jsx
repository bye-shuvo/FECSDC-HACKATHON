import { siteConfig } from "../../data/siteConfig.js";
import { Container, Section } from "../ui/Section.jsx";
import { StatCard } from "../ui/StatCard.jsx";
import { Reveal } from "../motion/Reveal.jsx";

export function StatsSection() {
  const subtexts = [
    "Verified FEC SDC applicants",
    "Non-stop building window",
    "Exciting prizes and certificates",
    "Two Specialized Domains",
  ];

  return (
    <Section spacing="compact" className="border-b border-border/60 bg-muted/20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.stats.map((stat, idx) => (
            <Reveal key={stat.label} delay={idx * 0.08}>
              <StatCard
                value={stat.value}
                prefix={stat.prefix || ""}
                suffix={stat.suffix || ""}
                label={stat.label}
                subtext={subtexts[idx] || ""}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

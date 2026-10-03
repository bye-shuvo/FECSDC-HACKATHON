import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Section, Container } from "../ui/Section.jsx";
import { SectionPillMarker, PillMark } from "../ui/PillDividers.jsx";
import { sponsorTiers } from "../../data/sponsors.js";

export function SponsorsMarqueeSection() {
  const allSponsors = sponsorTiers.flatMap((t) => t.sponsors);
  const marqueeItems = [...allSponsors, ...allSponsors, ...allSponsors];

  return (
    <Section id="sponsors-marquee" className="bg-card/40 border-y border-border/60 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <SectionPillMarker label="PARTNERS & SUPPORTERS" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Powered by Industry <span className="gradient-text-brand">Leaders</span>
            </h2>
          </div>
          <Link
            to="/sponsors"
            className="group inline-flex items-center gap-2 text-sm font-label text-primary hover:text-accent-amber transition-colors"
          >
            <span>Partner with us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>

      {/* Infinite Horizontal Marquee with Grayscale -> Color Hover */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">
          {marqueeItems.map((sponsor, index) => (
            <div
              key={`${sponsor.name}-${index}`}
              className="group flex items-center gap-4 px-6 py-4 rounded-md border border-border bg-card/90 shadow-sm transition-all duration-300 hover:border-primary/60 shrink-0 cursor-pointer"
            >
              {/* Grayscale tile turning colored on hover */}
              <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center font-display font-bold text-muted-foreground grayscale group-hover:grayscale-0 group-hover:text-primary transition-all duration-300 shadow-inner">
                {sponsor.placeholderInitial}
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {sponsor.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground/80">
                  {sponsor.tier} Partner
                </span>
              </div>
              <PillMark size="sm" className="opacity-40" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

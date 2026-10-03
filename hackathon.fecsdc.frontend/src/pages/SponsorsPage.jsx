import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { siteConfig } from "../data/siteConfig.js";
import { Container, Section } from "../components/ui/Section.jsx";
import { PageHeader } from "../components/layout/PageHeader.jsx";
import { TiltCard } from "../components/ui/TiltCard.jsx";
import { SpotlightCard } from "../components/ui/SpotlightCard.jsx";
import { PillMark } from "../components/ui/PillDividers.jsx";
import { sponsorTiers, sponsorshipPerks } from "../data/sponsors.js";
import { Reveal } from "../components/motion/Reveal.jsx";

export default function SponsorsPage() {
  useDocumentTitle("Partners & Sponsors", "Support the next generation of engineers at FEC SDC.");

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="ECOSYSTEM PARTNERS"
          title="Partners & Sponsors"
          gradientWord="Sponsors"
          description="Empowering 160+ elite collegiate hackers with infrastructure, compute grants, and high-impact engineering mentorship."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Sponsors" }
          ]}
        />

        {/* Tier Groups */}
        <div className="space-y-12 mb-16">
          {sponsorTiers.map((tierGroup, groupIdx) => (
            <div key={tierGroup.tier} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <PillMark size="sm" />
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {tierGroup.tier}
                  </h2>
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-amber px-2.5 py-1 rounded-sm bg-accent-amber/10 border border-accent-amber/30">
                  {tierGroup.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tierGroup.sponsors.map((sponsor) => (
                  <Reveal key={sponsor.name} delay={groupIdx * 0.08}>
                    <TiltCard className="p-6 h-full flex flex-col justify-between rounded-sm border border-border/80 bg-card/85 group">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          {/* Logo Placeholder Tile with Grayscale to Color Transition */}
                          <div className="w-14 h-14 rounded-sm bg-muted/80 border border-border flex items-center justify-center font-display font-black text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors text-xl">
                            {sponsor.placeholderInitial}
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded-sm bg-muted/60 border border-border">
                            {sponsor.tier}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">
                            {sponsor.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1.5 leading-relaxed">
                            {sponsor.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span>Official Partner</span>
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Why Sponsor FEC SDC Hackathon */}
        <Reveal>
          <SpotlightCard className="p-8 md:p-12 rounded-sm border border-border/80 bg-card/90 mb-12">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs tracking-widest text-primary font-bold uppercase">
                PARTNER VALUE PROPOSITION
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground mt-2">
                Why partner with FEC SDC?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-2 leading-relaxed">
                Engage directly with the most committed developers, algorithmic competitors, and system architects at Faridpur Engineering College.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sponsorshipPerks.map((perk, i) => (
                <div key={i} className="p-5 rounded-sm border border-border/80 bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-display font-bold text-foreground text-sm">{perk.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed pl-6">
                    {perk.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-muted-foreground">
                Inquire about custom sponsor tiers, API prize bounties, and keynote slots.
              </div>
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=Sponsorship%20Brochure%20Request`}
                data-cursor="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground font-mono font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 transition-all shrink-0"
              >
                <Mail className="w-4 h-4" />
                Request Sponsor Deck
              </a>
            </div>
          </SpotlightCard>
        </Reveal>
      </Container>
    </Section>
  );
}

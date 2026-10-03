import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Section, Container } from "../ui/Section.jsx";
import { SectionPillMarker } from "../ui/PillDividers.jsx";
import { Accordion } from "../ui/Accordion.jsx";
import { faqData } from "../../data/faq.js";
import { Reveal } from "../motion/Reveal.jsx";

export function FaqTeaserSection() {
  // Take first 3 FAQs for the teaser
  const teaserFaqs = faqData.slice(0, 3);

  return (
    <Section id="faq-teaser">
      <Container size="narrow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <SectionPillMarker label="COMMON QUESTIONS" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Frequently Asked <span className="gradient-text-brand">Questions</span>
            </h2>
          </div>
          <Link
            to="/hackathon/faq"
            className="group inline-flex items-center gap-2 text-sm font-label text-primary hover:text-accent-amber transition-colors"
          >
            <span>View all questions</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Reveal>
          <Accordion items={teaserFaqs} />
        </Reveal>
      </Container>
    </Section>
  );
}

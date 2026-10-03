import { useState, useMemo, useDeferredValue } from "react";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Accordion } from "../../components/ui/Accordion.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { SpotlightCard } from "../../components/ui/SpotlightCard.jsx";
import { faqData, faqCategories } from "../../data/faq.js";
import { Reveal } from "../../components/motion/Reveal.jsx";

export default function FaqPage() {
  useDocumentTitle("FAQ", "Frequently asked questions about FEC SDC Hackathon 2026.");

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [deferredQuery, selectedCategory]);

  return (
    <Section spacing="compact">
      <Container size="narrow">
        <PageHeader
          eyebrow="KNOWLEDGE & SUPPORT"
          title="Frequently Asked Questions"
          gradientWord="Questions"
          description="Everything you need to know about team formations, rules, hardware facilities, compute access, and submissions."
          breadcrumbLinks={[
            { label: "Home", href: "/" },
            { label: "Hackathon", href: "/hackathon" },
            { label: "FAQ" }
          ]}
        />

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                data-cursor="button"
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors select-none ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                data-cursor="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-sm bg-muted/60 border border-border text-foreground font-mono text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <Reveal>
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground font-mono text-sm border-dashed">
              No answers found matching &ldquo;{searchQuery}&rdquo;. Ask our mentors on Discord!
            </Card>
          ) : (
            <Accordion items={filteredFaqs} allowMultiple={false} />
          )}
        </Reveal>

        {/* Still Have Questions Box */}
        <div className="mt-12">
          <SpotlightCard className="p-6 md:p-8 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="text-base font-display font-bold text-foreground">
                  Still have unanswered questions?
                </h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-mono">
                Our organizers and technical mentors are available round-the-clock on the FEC SDC Discord server.
              </p>
            </div>
            <a
              href="https://discord.gg/fecsdc"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-mono font-bold shadow hover:brightness-110 shrink-0 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Join Discord Helpdesk
            </a>
          </SpotlightCard>
        </div>
      </Container>
    </Section>
  );
}

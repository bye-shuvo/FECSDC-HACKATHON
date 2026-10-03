import { useState, useMemo, useDeferredValue } from "react";
import { Search, ShieldAlert, CheckCircle, Scale, AlertTriangle } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { SpotlightCard } from "../../components/motion/SpotlightCard.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { rulesData, rulesCategories } from "../../data/rules.js";
import { Reveal } from "../../components/motion/Reveal.jsx";

export default function RulesPage() {
  useDocumentTitle("Rules & Conduct", "Official hackathon rules, judging criteria, and code of conduct.");

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRules = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    return rulesData.filter((rule) => {
      const matchesCategory =
        selectedCategory === "all" || rule.category === selectedCategory;
      const matchesSearch =
        !q ||
        rule.title.toLowerCase().includes(q) ||
        rule.summary.toLowerCase().includes(q) ||
        rule.details.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [deferredQuery, selectedCategory]);

  const severityBadgeVariant = (severity) => {
    switch (severity.toLowerCase()) {
      case "strict":
      case "zero tolerance":
        return "danger";
      case "mandatory":
        return "amber";
      case "evaluation":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Section spacing="compact">
      <Container>
        {/* PageHeader with breadcrumbs */}
        <PageHeader
          eyebrow="REGULATIONS & CRITERIA"
          title="Rules &"
          highlightWord="Evaluation"
          description="Guidelines regarding code freshness, public repository activity, judging weights, and ethical conduct."
          breadcrumbs={[
            { to: "/hackathon", label: "Hackathon" },
            { label: "Rules" },
          ]}
        />

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {rulesCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors select-none ${
                  selectedCategory === cat.id
                    ? "gradient-bg-brand text-white font-semibold"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-muted/60 border border-border text-foreground font-sans text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Content Layout with Sticky Side TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Numbered SpotlightCards */}
          <div className="lg:col-span-3 space-y-6">
            {filteredRules.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground font-mono text-sm">
                No rules match your filter criteria.
              </Card>
            ) : (
              filteredRules.map((rule) => (
                <div key={rule.id} id={`rule-${rule.id}`}>
                  <SpotlightCard className="p-6 transition-colors hover:border-primary/60">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-sm bg-muted border border-border flex items-center justify-center font-mono font-bold text-primary text-sm shrink-0">
                          {String(rule.id).padStart(2, "0")}
                        </span>
                        <h2 className="text-lg md:text-xl font-bold text-foreground">
                          {rule.title}
                        </h2>
                      </div>
                      <Badge variant={severityBadgeVariant(rule.severity)} size="sm">
                        {rule.severity}
                      </Badge>
                    </div>

                    <p className="text-sm font-semibold text-foreground/90 mb-2 leading-relaxed">
                      {rule.summary}
                    </p>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                      {rule.details}
                    </p>
                  </SpotlightCard>
                </div>
              ))
            )}
          </div>

          {/* Sticky Side TOC */}
          <aside className="hidden lg:block lg:sticky lg:top-36 p-5 rounded-md border border-border bg-card/70 space-y-4">
            <div className="flex items-center gap-2">
              <PillMark size="sm" />
              <span className="font-label text-xs tracking-widest text-foreground font-bold">
                TABLE OF CONTENTS
              </span>
            </div>

            <nav className="space-y-1 text-xs font-mono" aria-label="Rules Table of Contents">
              {rulesData.map((rule) => (
                <a
                  key={rule.id}
                  href={`#rule-${rule.id}`}
                  className="block py-1 text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {String(rule.id).padStart(2, "0")}. {rule.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground font-mono">
              Judges verify adherence during milestone check-ins.
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

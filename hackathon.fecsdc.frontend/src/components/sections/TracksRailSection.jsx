import { useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Cpu, Terminal, Shield, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Section, Container } from "../ui/Section.jsx";
import { SectionPillMarker, PillMark } from "../ui/PillDividers.jsx";
import { TiltCard } from "../ui/TiltCard.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";

const railTracks = [{
  id: "track-1",
  num: "01",
  title: "Problem Solving",
  icon: Cpu,
  tag: "Problem Solving",
  summary: "Solve real-world problems with your creativity and innovation.",
  target: "Problem Solving",
},
{
  id: "track-2",
  num: "02",
  title: "Web Development",
  icon: Terminal,
  tag: "Web Development",
  summary: "Build innovative web applications with your creativity and innovation.",
  target: "Web Development",
},
  // {
  //   id: "track-3",
  //   num: "03",
  //   title: "Fintech & Open Commerce",
  //   icon: Shield,
  //   tag: "Decentralized & BLE",
  //   summary: "Cryptographic offline micro-payment meshes capable of peer-to-peer barter during natural disasters.",
  //   target: "Double-spend rejection • Asymmetric keys",
  // },
  // {
  //   id: "track-4",
  //   num: "04",
  //   title: "AI & Intelligent Systems",
  //   icon: Sparkles,
  //   tag: "Multimodal & Voice",
  //   summary: "Bilingual voice and vision medical triage assistants parsing patient symptoms in Bengali & English.",
  //   target: "Bilingual STT • Priority scoring",
  // },
];

export function TracksRailSection() {
  const scrollRef = useRef(null);
  const dragRef = useRef({ startX: 0, scrollLeft: 0, isDragging: false });

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.pageX;
    dragRef.current.scrollLeft = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { dragRef.current.isDragging = false; };
  const handleMouseUp = () => { dragRef.current.isDragging = false; };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging || !scrollRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - dragRef.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
  };

  const scrollByAmount = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <Section id="tracks-preview" className="overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <SectionPillMarker label="CHALLENGE TRACKS" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Choose Your <span className="gradient-text-brand">Domain</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Explore our 2 engineering tracks. Detailed problem briefs unlock on hackathon day.
            </p>
          </div>

          {/* <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(-340)}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-sm border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(340)}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-sm border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div> */}
        </div>
      </Container>

      {/* Horizontal Drag-To-Scroll Snap Rail */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        data-cursor="drag"
        className="flex flex-col md:flex-row gap-6 items-center justify-center overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-4 snap-x snap-mandatory cursor-grab active:cursor-grabbing max-w-7xl mx-auto"
      >
        {railTracks.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.id}
              className="snap-start shrink-0 w-75 sm:w-85 md:w-95 h-90"
            >
              <TiltCard maxTilt={6} className="p-6 flex md:flex-col justify-between h-full bg-card border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-2xl font-black text-muted-foreground/30">
                      {track.num}
                    </span>
                  </div>

                  <div>
                    <Badge variant="primary" size="sm" className="mb-2">
                      {track.tag}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">
                      {track.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {track.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40 space-y-3">
                  <div className="text-[11px] font-mono text-primary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                    <span>{track.target}</span>
                  </div>

                  <a
                    href="https://www.hackerrank.com/fecsdc-202610"
                    className="inline-flex items-center gap-1.5 text-xs font-label text-foreground hover:text-primary transition-colors"
                    target="_blank"
                  >
                    <span>View specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </TiltCard>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

import { Marquee } from "../ui/Marquee.jsx";

const row1Keywords = [
  "Smart Campus & IoT",
  "DevOps & AST Tooling",
  "Fintech BLE Mesh",
  "Bilingual Multimodal AI",
  "Edge Telemetry",
  "Zero-WAN Microledgers",
  "Git CI/CD Patching",
  "Distributed Systems",
];

const row2Keywords = [
  "Next.js & Vite",
  "FastAPI & PyTorch",
  "Rust & WebAssembly",
  "Docker Containerization",
  "WebSockets Stream",
  "Tailwind CSS v4",
  "Linux Kernel & BLE",
  "Cryptographic Verification",
];

export function TechMarqueeSection() {
  return (
    <div className="w-full border-y border-border/50 bg-card/30">
      <Marquee row1={row1Keywords} row2={row2Keywords} />
    </div>
  );
}

/**
 * Fallback data for problem statements when the real file is missing or ignored.
 * The locked/empty state is intentionally safe and non-breaking.
 */

export const problemTracks = ["All"];
export const problems = [
    {
    id: "01",
    title: "Autonomous Campus Energy & Resource Optimization Grid",
    track: "Smart Campus & IoT",
    difficulty: "Advanced",
    summary: "Design an intelligent telemetry and demand-response system that minimizes campus power consumption during peak load while ensuring uncompromised lab reliability.",
    details: `Engineering colleges face substantial fluctuating power footprints between academic lecture halls, computational laboratories, and residential hostels. 

Your mission is to architect an edge-aware monitoring and automated load-balancing platform. The solution must ingest sensor telemetry (or simulated multi-zone telemetry), predict usage anomalies with lightweight time-series forecasting, and trigger automated power throttling or battery storage balancing protocols.`,
    constraints: [
      "Must handle real-time streaming data ingestion with latency < 500ms.",
      "Include a resilient offline fallback state if campus WAN connection drops.",
      "Dashboard must visualize live telemetry with sub-second websocket streaming.",
      "Algorithms must avoid abrupt power cycling that damages sensitive laboratory hardware.",
    ],
    deliverables: [
      "Working web/mobile telemetry monitoring dashboard with real-time graphs.",
      "Backend microservice handling sensor ingestion with mock IoT telemetry generator.",
      "Automated rule-engine or ML forecasting model code with test benchmarks.",
      "Comprehensive system architecture diagram in repository README.",
    ],
    judging: "Evaluated on data pipeline resilience (35%), dashboard UX/responsiveness (30%), anomaly forecasting accuracy (20%), and hardware integration practicality (15%).",
  },
  {
    id: "02",
    title: "Agentic Code Review & Security Remediation Bot",
    track: "DevOps & Developer Tooling",
    difficulty: "Intermediate",
    summary: "Construct a developer tool that analyzes GitHub pull requests for subtle race conditions, memory leaks, and credential exposure, synthesizing automated diff patches.",
    details: `Standard linters detect syntax flaws, but fail to comprehend contextual logic bugs, concurrency deadlocks, or improper secrets handling. 

Teams must develop a CLI tool or GitHub App webhook integration that ingests unified diffs, runs static analysis augmented with targeted LLM reasoning, highlights vulnerability vectors with line annotations, and synthesizes ready-to-merge remedial git patch files.`,
    constraints: [
      "Must produce verifiable zero-hallucination diffs that compile cleanly.",
      "CLI or Webhook response time must remain under 12 seconds per PR of < 500 lines.",
      "Must include local offline ruleset for security secrets detection (regex / AST analysis).",
      "Must respect privacy and allow locally hosted or private LLM endpoints.",
    ],
    deliverables: [
      "CLI executable or web portal displaying simulated PR reviews.",
      "Git diff patch generation demonstration tested on intentionally vulnerable sample repos.",
      "Benchmark analysis comparing time and detection rate against static analyzers.",
      "Clear documentation on configuring custom enterprise policy rules.",
    ],
    judging: "Scored on remediation accuracy (35%), developer ergonomics & CLI UI (25%), latency optimization (25%), and security rule depth (15%).",
  }
];

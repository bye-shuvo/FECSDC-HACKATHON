/**
 * Hackathon Rules, Eligibility & Code of Conduct
 */

export const rulesCategories = [
  { id: "all", label: "All Rules" },
  { id: "eligibility", label: "Eligibility" },
  { id: "team", label: "Team Formation" },
  { id: "code", label: "Code & Submissions" },
  { id: "conduct", label: "Code of Conduct" },
  { id: "judging", label: "Judging Criteria" },
];

export const rulesData = [
  {
    id: 1,
    category: "eligibility",
    title: "Club Membership Verification",
    summary: "Participation is exclusively open to verified members of Faridpur Engineering College Software Development Club (FEC SDC).",
    details: "All participants must hold an active student ID and be registered in the club database. Cross-batch and inter-department members are warmly encouraged.",
    severity: "Strict",
  },
  // {
  //   id: 2,
  //   category: "team",
  //   title: "Team Size & Dynamics",
  //   summary: "Teams must consist of exactly 2 to 4 members. Solo hackers may register and join the matching pool.",
  //   details: "No individual may participate in more than one team. Team composition cannot be modified after the hacking commences at 11:00 AM on Day 1.",
  //   severity: "Mandatory",
  // },
    {
    id: 2,
    category: "eligibility",
    title: "Batch Priority for Same Rank",
    summary: "If participants from Batch 12 and Batch 13 achieve the same position, Batch 13 participants will receive priority for prize eligibility.",
    details: "In the event of a tie on final standings, students from Batch 13 will be considered ahead of Batch 12 participants for prize placement and eligibility. This rule applies only when rankings are otherwise equal.",
    severity: "Priority",
  },
  {
    id: 3,
    category: "code",
    title: "Fresh Codebases Only",
    summary: "All project code, models, and design assets must be created during the 6-hour hackathon window.",
    details: "You may use open-source libraries, frameworks, boilerplate starters, and public APIs. However, working on pre-existing private projects or pre-built prototypes is strictly disqualifying.",
    severity: "Strict",
  },
  {
    id: 4,
    category: "code",
    title: "Public Version Control",
    summary: "All projects must be hosted in a public GitHub repository created after the opening ceremony.",
    details: "Your repo must feature meaningful commit history reflecting contributions to the project. A single massive initial commit is subject to jury scrutiny.",
    severity: "Strict",
  },
  {
    id: 5,
    category: "code",
    title: "Complete Deliverable Package",
    summary: "Submissions require a live demo URL and a public repo.",
    details: "README must document: Problem addressed, setup steps.",
    severity: "Strict",
  },
  {
    id: 6,
    category: "conduct",
    title: "Respectful Collaboration",
    summary: "Harassment, offensive behavior, discriminatory remarks, or intellectual dishonesty will lead to immediate ejection.",
    details: "FEC SDC fosters a safe, encouraging, and collaborative learning environment for hackers of all experience levels.",
    severity: "Zero Tolerance",
  },
  {
    id: 7,
    category: "judging",
    title: "Technical Execution & Architecture (30%)",
    summary: "Evaluates the robustness, system design, security, code cleanliness, and scalability of the implementation.",
    details: "Judges review repository structure, error handling, test coverage, and modern best practices.",
    severity: "Evaluation",
  },
  {
    id: 8,
    category: "judging",
    title: "Innovation & Problem Solving (25%)",
    summary: "Originality of the conceptual approach and creative resolution to the chosen problem statement.",
    details: "Does this solution provide an inventive angle, or is it a routine clone of an existing SaaS?",
    severity: "Evaluation",
  },
  {
    id: 9,
    category: "judging",
    title: "UI/UX & Accessibility (25%)",
    summary: "Visual polish, user flow ergonomics, responsive adaptability, and adherence to accessibility standards.",
    details: "Smooth micro-interactions, coherent typography hierarchy, contrast ratios, and intuitive user delight.",
    severity: "Evaluation",
  },
  {
    id: 10,
    category: "judging",
    title: "Documentation & Presentation Quality (20%)",
    summary: "Clarity of the project documentation, and presentation.",
    details: "Well-structured README with clear problem statement, setup steps.",
    severity: "Evaluation",
  },
];

/**
 * Prizes Data — Podium Top 3 + Special Accolades
 */

import mouseImage from "../assets/mouse.svg";
import usbImage from "../assets/usb.svg";
import mousepadImage from "../assets/mousepad.svg";

export const podiumPrizes = [
  {
    rank: 2,
    place: "1st Runner Up",
    teaserTitle: "USB drive",
    teaserDescription: "Portable storage for project files.",
    teaserImage: usbImage,
    // amount: "৳ 15,000",
    // cash: 15000,
    perks: [
      "1st Runner-up Prize",
      "Discord Intermediate Role Unlocked",
      "FECSDC Certificate of Excellence",
    ],
    highlight: false,
    color: "amber",
  },
  {
    rank: 1,
    place: "Grand Champion",
    teaserTitle: "Gaming mouse",
    teaserDescription: "Precise control for fast-paced play.",
    teaserImage: mouseImage,
    perks: [
      "FEC SDC Championship Prize",
      "Immediate role updation to intermadiate on discord",
      "FEC SDC accoladed certificate",
      "Featured Showcase on FEC SDC Portal & Media",
    ],
    highlight: true,
    color: "orange",
  },
  {
    rank: 3,
    place: "2nd Runner Up",
    teaserTitle: "Mousepad",
    teaserDescription: "Smooth surface for consistent aim.",
    teaserImage: mousepadImage,
    perks: [
      "2nd Runner-up Prize",
      "Discord Intermediate Role Unlocked",
      "FECSDC Certificate of Excellence",
    ],
    highlight: false,
    color: "slate",
  },
];

export const specialAwards = [
  {
    id: "ai-track",
    title: "Best AI / Machine Intelligence",
    amount: "৳ 5,000 + API Credits",
    description: "Awarded to the team that demonstrates the most inventive LLM/Agentic architecture, edge inference, or computer vision pipeline.",
    tag: "AI & ML",
  },
  {
    id: "ui-ux",
    title: "Excellence in UI/UX Engineering",
    amount: "৳ 5,000 + Design Kits",
    description: "Honoring the team exhibiting exceptional aesthetic polish, micro-animations, keyboard accessibility, and intuitive ergonomics.",
    tag: "Design",
  },
  {
    id: "systems-iot",
    title: "Most Resilient Systems / IoT",
    amount: "৳ 5,000 + Hardware Kit",
    description: "For the best low-level systems engineering, IoT telemetry, real-time networking, or distributed consensus mechanism.",
    tag: "Systems",
  },
  {
    id: "freshman-spark",
    title: "Rookie Track: Rising Stars",
    amount: "৳ 3,000 + Mentorship",
    description: "Dedicated to the highest-scoring squad comprised exclusively of 1st or 2nd-year undergraduate engineering students.",
    tag: "Junior",
  },
];

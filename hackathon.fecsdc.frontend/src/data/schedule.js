/**
 * Schedule & Timeline Data
 */

const EVALUATION_DATE = "Will be notified on discord";

export const scheduleData = [
  {
    id: "day-1",
    day: "Day 1",
    date: "Oct 10, 2026",
    phase: "hackathon",
    phaseLabel: "Online hackathon",
    title: "6-Hour Hackathon Sprint",
    description: "A single-day, 6-hour online sprint — join the FECSDC Discord Competition-Arena Channel, pick your track, build, and submit.",
    events: [
      {
        time: "05:30 PM",
        title: "Check-in & Discord Announcement Varification",
        description: "Join the FECSDC Discord Competition-Arena Channel, Check Recent Announcement, Start Building.",
        tag: "Logistics",
      },
      {
        time: "06:00 PM",
        title: "Opening Ceremony & Problem Drop",
        description: "Official opening and unveiling of the problem statements across both tracks. Read carefully — hacking starts immediately after.",
        tag: "Keynote",
      },
      {
        time: "06:00 PM - 11:59 PM",
        title: "Hacking Commences!",
        description: "GitHub repository initialized, project branch cut, and your 6-hour build window officially begins. Clock is ticking.",
        tag: "Milestone",
      },
      {
        time: "11:59 PM",
        title: "Final Submission Deadline",
        description: "Submit your GitHub repo URL and README URL on the portal. Late submissions are not accepted. All commits after this are disqualified.",
        tag: "Checkpoint",
      },
    ],
  },
  {
    id: "day-2",
    day: "Day 2",
    date: EVALUATION_DATE,
    phase: "evaluation",
    phaseLabel: "Evaluation day",
    title: "Evaluation Day",
    description: "Judges review submissions, shortlist members, and finalize the results.",
    events: [
      {
        time: "09:00 AM",
        title: "Judging begins",
        description: "Judges review each submission's repository and README against the event criteria.",
        tag: "Judging",
      },
      {
        time: "11:00 AM",
        title: "Shortlist announced",
        description: "The shortlisted Participants are announced through the event channels.",
        tag: "Checkpoint",
      },
      {
        time: "12:00 PM",
        title: "Judges deliberation",
        description: "Judges compare reviews and finalize the results.",
        tag: "Judging",
      },
      {
        time: "04:00 PM",
        title: "Closing ceremony and prize distribution",
        description: "The event closes with the announcement of the winning praticipants and prize distribution.",
        tag: "Awards",
      },
      {
        time: "05:00 PM",
        title: "Results published on /results",
        description: "Final results are published on the results page.",
        tag: "Milestone",
      },
    ],
  },
];

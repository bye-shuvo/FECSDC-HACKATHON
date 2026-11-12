/**
 * Results & Leaderboard Data
 * Official hackathon results and competition standings.
 */

const str = (value, fallback) =>
  typeof value === "string" && value.trim() !== "" ? value : fallback;

const bool = (value, fallback) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

export const TRACKS = {
  PS: "Problem Solving",
  WD: "Web Development",
};

export const hasTrack = (p, t) => Boolean(Array.isArray(p?.tracks) && p.tracks.includes(t));
export const isMultiTrack = (p) => Boolean(Array.isArray(p?.tracks) && p.tracks.length > 1);
export const isParticipant = (p) => Boolean(p && p.judge !== null);

export const PER_QUESTION_MARK_LABEL = "—";
export const NOT_PARTICIPATED_LABEL = "Not participated";

export const QUESTION_CATALOG = {
  Q1: { num: 1, title: "Student Portfolio", projectCategory: "Interactive UI", score: 100 },
  Q2: { num: 2, title: "Event Landing Page", projectCategory: "Interactive UI", score: 100 },
  Q3: { num: 3, title: "Product Detail Page", projectCategory: "E-commerce UI", score: 150 },
  Q4: { num: 4, title: "Theme Switcher", projectCategory: "Interactive UI", score: 150 },
  Q5: { num: 5, title: "Country Explorer", projectCategory: "API Data Apps", score: 200 },
  Q6: { num: 6, title: "Event Ticket Generator", projectCategory: "Forms & Validation", score: 200 },
  Q7: { num: 7, title: "Smart Grade Calculator", projectCategory: "Forms & Validation", score: 200 },
  Q8: { num: 8, title: "Lost & Found Board", projectCategory: "CRUD Apps", score: 250 },
  Q9: { num: 9, title: "Everyday Unit Converter", projectCategory: "Forms & Validation", score: 200 },
  Q10: { num: 10, title: "GitHub Profile Analyzer", projectCategory: "API Data Apps", score: 250 },
  Q11: { num: 11, title: "Invoice Generator", projectCategory: "Forms & Validation", score: 250 },
};

export function createProjectEntries(participantId, questionKeys = []) {
  return questionKeys.map((key) => {
    const q = QUESTION_CATALOG[key];
    if (!q) {
      throw new Error(`Unknown question key: ${key}`);
    }
    return {
      questionId: `${participantId}-q${q.num}`,
      title: q.title,
      category: "Web Development",
      projectCategory: q.projectCategory,
      score: q.score,
      earned: null,
    };
  });
}

export const marksDistribution = Object.values(QUESTION_CATALOG).map((q) => ({
  number: q.num,
  category: q.projectCategory,
  title: q.title,
  fullMark: q.score,
  mark: NOT_PARTICIPATED_LABEL,
  comment: NOT_PARTICIPATED_LABEL,
}));

export const resultsConfig = {
  published: bool(import.meta.env.VITE_RESULTS_PUBLISHED, true),
  announcedAt: str(import.meta.env.VITE_RESULTS_ANNOUNCED_AT, "2026-11-17T16:00:00+06:00"),
  totalParticipantsJudged: 7,
  PER_QUESTION_MARK_LABEL,
  NOT_PARTICIPATED_LABEL,
  TRACKS,
  hasTrack,
  isMultiTrack,
  isParticipant,
  questionCatalog: QUESTION_CATALOG,
  marksDistribution,
};

// TODO: both-track participants need separate project vs problem-solving marks; `judge` can later hold judge.projects and judge.problemSolving (assert they sum to judge.total ±0.01). When those exist, per-track views should rank by the track score.
const participantEntries = [
  // Judged (7)
  {
    id: "2024631598",
    name: "Md. Samiul Islam",
    batch: "12",
    handle: "mdsamiul73086",
    problemsSolved: 3,
    projectsSubmitted: 3,
    tracks: [TRACKS.PS, TRACKS.WD],
    judge: { j1: 265.5, j2: 267, j3: 280, j4: 236.5, total: 1049, avg: 262.25 },
    solved: createProjectEntries("2024631598", ["Q1", "Q3", "Q4"]),
  },
  {
    id: "2024031567",
    name: "MD Sabbir Hossain",
    batch: "12",
    handle: "sabbiiiiir7",
    problemsSolved: 9,
    projectsSubmitted: 2,
    tracks: [TRACKS.PS, TRACKS.WD],
    judge: { j1: 221.5, j2: 203, j3: 264, j4: 253.25, total: 941.75, avg: 235.4375 },
    solved: createProjectEntries("2024031567", ["Q1", "Q4"]),
  },
  {
    id: "2024831596",
    name: "Shahriar Hossen Sajid",
    batch: "12",
    handle: "shahriarhossens1",
    problemsSolved: null,
    projectsSubmitted: 3,
    tracks: [TRACKS.WD],
    judge: { j1: 148.5, j2: 210, j3: 140, j4: 205, total: 703.5, avg: 175.875 },
    solved: createProjectEntries("2024831596", ["Q5", "Q6", "Q7"]),
  },
  {
    id: "2025232202",
    name: "K M Shamsuzzaman Nur",
    batch: "13",
    handle: "kmshamsuzzamann1",
    problemsSolved: 10,
    projectsSubmitted: 0,
    tracks: [TRACKS.PS],
    judge: { j1: 90.25, j2: 99, j3: 228, j4: 88, total: 505.25, avg: 126.3125 },
    solved: [],
  },
  {
    id: "2024431590",
    name: "Nusrat Fariha",
    batch: "12",
    handle: "nusrat_fariha_cs",
    problemsSolved: 5,
    projectsSubmitted: 1,
    tracks: [TRACKS.PS, TRACKS.WD],
    judge: { j1: 106.67, j2: 89, j3: 161, j4: 145.25, total: 501.92, avg: 125.48 },
    solved: createProjectEntries("2024431590", ["Q1"]),
  },
  {
    id: "2025132177",
    name: "Adnan Mahmud Sifat",
    batch: "13",
    handle: "amsifat395",
    problemsSolved: 2,
    projectsSubmitted: 0,
    tracks: [TRACKS.PS],
    judge: { j1: 28, j2: 28, j3: 40, j4: 40, total: 136, avg: 34 },
    solved: [],
  },
  {
    id: "2025932188",
    name: "Shaikh Motasim Billah",
    alias: "Rohan",
    batch: "13",
    handle: "smbr0009",
    problemsSolved: 2,
    projectsSubmitted: 0,
    tracks: [TRACKS.PS],
    judge: { j1: 28, j2: 28, j3: 40, j4: 40, total: 136, avg: 34 },
    solved: [],
  },
  // Registered, did not participate (6)
  {
    id: "2024631589",
    name: "Jarin Tasnuva Radi",
    batch: "12",
    handle: "Jarin-Radi",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
  {
    id: "2025832189",
    name: "Sirajum Munira Genius",
    batch: "12",
    handle: "muniragenius",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
  {
    id: "2024531562",
    name: "akm arefuzzaman",
    batch: "12",
    handle: "Faheem",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
  {
    id: "2025532182",
    name: "Nur Ahmmad Khan",
    batch: "13",
    handle: "nurahmmad842",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
  {
    id: "2023352887",
    name: "Nabil Mahmud",
    batch: "12",
    handle: "nabilnircse",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
  {
    id: "2025832206",
    name: "Sabbir Hossain",
    batch: "13",
    handle: "sabbir",
    problemsSolved: null,
    projectsSubmitted: 0,
    tracks: [],
    judge: null,
    solved: [],
  },
];

export function getSolvedSummary(entry) {
  const solved = entry?.solved ?? [];
  const projectCount = entry?.projectsSubmitted ?? solved.length;
  const problemCount = entry?.problemsSolved ?? 0;
  return {
    count: projectCount + problemCount,
    projectCount,
    problemCount,
    earned: entry?.judge?.total ?? 0,
    max: solved.reduce((summary, question) => summary + (question?.score ?? 0), 0),
  };
}

export function computeCompetitionRanks(entries) {
  const judged = entries.filter((e) => isParticipant(e));
  const unranked = entries.filter((e) => !isParticipant(e));

  // Global stable sort by judge.avg descending (preserves initial order on ties)
  const sortedJudged = [...judged].sort((a, b) => b.judge.avg - a.judge.avg);

  let currentRank = 1;
  const rankedJudged = sortedJudged.map((entry, idx) => {
    if (idx > 0 && entry.judge.avg !== sortedJudged[idx - 1].judge.avg) {
      currentRank = idx + 1;
    }
    return {
      ...entry,
      rank: currentRank,
      totalScore: entry.judge.total,
      status:
        currentRank === 1
          ? "Champion"
          : currentRank === 2
            ? "1st Runner Up"
            : currentRank === 3
              ? "2nd Runner Up"
              : "Finalist",
    };
  });

  const unrankedFormatted = unranked.map((entry) => ({
    ...entry,
    rank: null,
    totalScore: null,
    status: "Registered · did not participate",
  }));

  return [...rankedJudged, ...unrankedFormatted];
}

export const leaderboardData = computeCompetitionRanks(participantEntries);

function runDefensiveChecks() {
  if (participantEntries.length !== 13) {
    throw new Error(`[Results Check] Expected 13 total participants, found ${participantEntries.length}`);
  }

  const ids = new Set();
  let psCount = 0;
  let wdCount = 0;
  let bothCount = 0;
  let noTrackCount = 0;

  for (const p of participantEntries) {
    if (ids.has(p.id)) {
      throw new Error(`[Results Check] Duplicate participant id: ${p.id}`);
    }
    ids.add(p.id);

    // Array.isArray(tracks) for all 13; no duplicates inside tracks; every value ∈ TRACKS
    if (!Array.isArray(p.tracks)) {
      throw new Error(`[Results Check] Participant ${p.name} tracks must be an Array`);
    }
    const trackSet = new Set(p.tracks);
    if (trackSet.size !== p.tracks.length) {
      throw new Error(`[Results Check] Duplicate tracks in participant ${p.name}`);
    }
    for (const t of p.tracks) {
      if (t !== TRACKS.PS && t !== TRACKS.WD) {
        throw new Error(`[Results Check] Invalid track value '${t}' in participant ${p.name}`);
      }
    }

    // Membership rules
    const expectsWD = p.projectsSubmitted > 0;
    const hasWD = hasTrack(p, TRACKS.WD);
    if (expectsWD !== hasWD) {
      throw new Error(`[Results Check] WD membership rule failed for ${p.name}: projects=${p.projectsSubmitted}, hasWD=${hasWD}`);
    }

    const expectsPS = p.problemsSolved !== null;
    const hasPS = hasTrack(p, TRACKS.PS);
    if (expectsPS !== hasPS) {
      throw new Error(`[Results Check] PS membership rule failed for ${p.name}: problemsSolved=${p.problemsSolved}, hasPS=${hasPS}`);
    }

    // Order inside the array is always [Problem Solving, Web Development]
    if (hasPS && hasWD) {
      if (p.tracks[0] !== TRACKS.PS || p.tracks[1] !== TRACKS.WD) {
        throw new Error(`[Results Check] Multi-track order must be [PS, WD] for ${p.name}`);
      }
      bothCount++;
    }
    if (hasPS) psCount++;
    if (hasWD) wdCount++;
    if (p.tracks.length === 0) noTrackCount++;

    // projectsSubmitted equals count of project entries in solved
    if (p.projectsSubmitted !== p.solved.length) {
      throw new Error(`[Results Check] projectsSubmitted mismatch for ${p.name}: ${p.projectsSubmitted} !== ${p.solved.length}`);
    }

    for (const s of p.solved) {
      const qNum = parseInt(s.questionId.split("-q")[1], 10);
      const catEntry = Object.values(QUESTION_CATALOG).find((c) => c.num === qNum);
      if (!catEntry || catEntry.score !== s.score) {
        throw new Error(`[Results Check] Score mismatch for ${p.name} on ${s.questionId}`);
      }
      if (s.earned !== null) {
        throw new Error(`[Results Check] Earned mark must be null for ${p.name} on ${s.questionId}`);
      }
    }

    const jsonStr = JSON.stringify(p);
    if (jsonStr.toLowerCase().includes("@gmail") || jsonStr.includes("@")) {
      throw new Error(`[Results Check] Privacy violation: email string found in participant ${p.name}`);
    }
  }

  // Counts: unique participants 13, judged 7, PS view 6, WD view 4, both 3, no-track 6
  const judged = participantEntries.filter((p) => isParticipant(p));
  if (judged.length !== 7) {
    throw new Error(`[Results Check] Expected 7 judged participants, found ${judged.length}`);
  }
  if (psCount !== 6) {
    throw new Error(`[Results Check] Expected 6 PS participants, found ${psCount}`);
  }
  if (wdCount !== 4) {
    throw new Error(`[Results Check] Expected 4 WD participants, found ${wdCount}`);
  }
  if (bothCount !== 3) {
    throw new Error(`[Results Check] Expected 3 participants in both tracks, found ${bothCount}`);
  }
  if (noTrackCount !== 6) {
    throw new Error(`[Results Check] Expected 6 participants with no track, found ${noTrackCount}`);
  }

  // Judge scores
  for (const p of judged) {
    const { j1, j2, j3, j4, total, avg } = p.judge;
    const sum = j1 + j2 + j3 + j4;
    if (Math.abs(sum - total) > 0.01) {
      throw new Error(`[Results Check] Judge sum mismatch for ${p.name}: sum=${sum}, total=${total}`);
    }
    if (Math.abs(total / 4 - avg) > 0.01) {
      throw new Error(`[Results Check] Judge avg mismatch for ${p.name}: total/4=${total / 4}, avg=${avg}`);
    }
  }

  // Catalog sum
  const catalogSum = Object.values(QUESTION_CATALOG).reduce((acc, q) => acc + q.score, 0);
  if (catalogSum !== 2050) {
    throw new Error(`[Results Check] Catalog sum mismatch: expected 2050, got ${catalogSum}`);
  }

  // Ranks equal 1,2,3,4,5,6,6 in order
  const expectedRanks = [1, 2, 3, 4, 5, 6, 6];
  const actualRanks = leaderboardData.filter((p) => isParticipant(p)).map((p) => p.rank);
  for (let i = 0; i < expectedRanks.length; i++) {
    if (actualRanks[i] !== expectedRanks[i]) {
      throw new Error(`[Results Check] Rank mismatch at index ${i}: expected ${expectedRanks[i]}, got ${actualRanks[i]}`);
    }
  }
}

if (import.meta.env.DEV) {
  runDefensiveChecks();
}

/**
 * Fallback data for results when the real file is missing or ignored.
 * Keeps the UI in a safe, published=false state without breaking the build.
 */

export const resultsConfig = {
  published: false,
  announcedAt: "2026-11-17T16:00:00+06:00",
  totalParticipantsJudged: 0,
};

export const leaderboardData = [];

export function getSolvedSummary(entry) {
  const solved = entry?.solved ?? [];
  return solved.reduce(
    (summary, question) => ({
      count: summary.count + 1,
      earned: summary.earned + (question?.earned ?? 0),
      max: summary.max + (question?.score ?? 0),
    }),
    { count: 0, earned: 0, max: 0 }
  );
}

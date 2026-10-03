import * as fallbackProblems from "./fallback/problems.fallback.js";
import * as fallbackResults from "./fallback/results.fallback.js";

const problemModules = import.meta.glob("./problems.js", { eager: true });
const resultModules = import.meta.glob("./results.js", { eager: true });

const problemsModule = Object.values(problemModules)[0] ?? fallbackProblems;
const resultsModule = Object.values(resultModules)[0] ?? fallbackResults;

if (import.meta.env.DEV && !Object.keys(problemModules).length) {
  console.warn("[data] Using fallback problems data because ./problems.js is unavailable.");
}

if (import.meta.env.DEV && !Object.keys(resultModules).length) {
  console.warn("[data] Using fallback results data because ./results.js is unavailable.");
}

export const problems = problemsModule?.problems ?? fallbackProblems.problems;
export const problemTracks = problemsModule?.problemTracks ?? fallbackProblems.problemTracks;

export const resultsConfig = resultsModule?.resultsConfig ?? fallbackResults.resultsConfig;
export const leaderboardData = resultsModule?.leaderboardData ?? fallbackResults.leaderboardData;
export const getSolvedSummary = resultsModule?.getSolvedSummary ?? fallbackResults.getSolvedSummary;

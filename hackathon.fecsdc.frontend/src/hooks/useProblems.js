import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "./useApiQuery.js";
import { useProblemLock } from "./useProblemLock.js";
import { siteConfig } from "../data/siteConfig.js";

const SKEW_BACKOFF_MS = [5000, 10000, 20000, 20000, 20000];

function parsePositiveInt(val) {
  if (val == null) return null;
  const str = String(val).trim();
  if (!/^\d+$/.test(str)) return null;
  const num = Number(str);
  return Number.isSafeInteger(num) && num > 0 ? num : null;
}

function normalizeQuestions(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.questions)) return data.questions;
  return null;
}

function normalizeQuestion(data) {
  if (!data) return null;
  if (data.question && typeof data.question === "object") return data.question;
  return typeof data === "object" ? data : null;
}

function is403Locked(err) {
  return err?.status === 403 || err?.data?.error === "locked";
}

/**
 * Hook to load problems list with reveal gating, clock-skew backoff retry, and caching.
 */
export function useProblemList() {
  const { isLocked: isLocalLocked, revealDate } = useProblemLock();
  const [isSkewLocked, setIsSkewLocked] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  // url = null while locally locked: nothing fetched or persisted before reveal
  const url = isLocalLocked ? null : (siteConfig.questionsEndpoint || "/api/questions");

  const { data, error, isLoading, refetch } = useQuery(url, {
    ttl: 5 * 60 * 1000,
    persist: true,
  });

  useEffect(() => {
    if (is403Locked(error)) {
      setIsSkewLocked(true);
      if (retryCountRef.current < 5) {
        const delay = SKEW_BACKOFF_MS[retryCountRef.current] ?? 20000;
        retryTimerRef.current = setTimeout(() => {
          retryCountRef.current += 1;
          refetch();
        }, delay);
      }
    } else if (data) {
      setIsSkewLocked(false);
      retryCountRef.current = 0;
    }
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [error, data, refetch]);

  const problems = useMemo(() => normalizeQuestions(data), [data]);

  const problemTracks = useMemo(() => {
    if (!problems || problems.length === 0) return ["All"];
    const unique = Array.from(new Set(problems.map((p) => p.track).filter(Boolean)));
    return ["All", ...unique];
  }, [problems]);

  const isLocked = isLocalLocked || isSkewLocked;
  const exposedError = is403Locked(error) ? null : error;

  return {
    problems,
    problemTracks,
    isLoading: !isLocked && isLoading && !problems && !exposedError,
    isLocked,
    revealDate,
    error: exposedError,
    refetch,
  };
}

/**
 * Hook to load single problem by ID with reveal gating, 404 validation, and Prev/Next neighbors.
 *
 * @param {string|number} id
 */
export function useProblem(id) {
  const { isLocked: isLocalLocked, revealDate } = useProblemLock();
  const [isSkewLocked, setIsSkewLocked] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);

  const cleanId = parsePositiveInt(id);
  const isValidId = cleanId !== null;

  const baseEndpoint = (siteConfig.questionEndpoint || "/api/question").replace(/\/$/, "");
  const url = isLocalLocked || !isValidId ? null : `${baseEndpoint}/${cleanId}`;

  const { data, error, isLoading, refetch } = useQuery(url, {
    ttl: 5 * 60 * 1000,
    persist: true,
  });

  useEffect(() => {
    if (is403Locked(error)) {
      setIsSkewLocked(true);
      if (retryCountRef.current < 5) {
        const delay = SKEW_BACKOFF_MS[retryCountRef.current] ?? 20000;
        retryTimerRef.current = setTimeout(() => {
          retryCountRef.current += 1;
          refetch();
        }, delay);
      }
    } else if (data) {
      setIsSkewLocked(false);
      retryCountRef.current = 0;
    }
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [error, data, refetch]);

  const problem = useMemo(() => normalizeQuestion(data), [data]);

  // Prev/Next computed from cached list query
  const { problems: listProblems } = useProblemList();

  const { prevProblem, nextProblem } = useMemo(() => {
    if (!listProblems || !Array.isArray(listProblems) || listProblems.length === 0 || !cleanId) {
      return { prevProblem: null, nextProblem: null };
    }
    const sorted = [...listProblems].sort((a, b) => Number(a.id) - Number(b.id));
    const idx = sorted.findIndex((p) => Number(p.id) === cleanId);
    if (idx === -1) {
      return { prevProblem: null, nextProblem: null };
    }
    return {
      prevProblem: idx > 0 ? sorted[idx - 1] : null,
      nextProblem: idx < sorted.length - 1 ? sorted[idx + 1] : null,
    };
  }, [listProblems, cleanId]);

  const isLocked = isLocalLocked || isSkewLocked;
  const isNotFound = !isValidId || error?.status === 404;
  const exposedError = is403Locked(error) || isNotFound ? null : error;

  return {
    problem,
    prevProblem,
    nextProblem,
    isLoading: !isLocked && !isNotFound && isLoading && !problem && !exposedError,
    isLocked,
    revealDate,
    isNotFound,
    error: exposedError,
    refetch,
  };
}

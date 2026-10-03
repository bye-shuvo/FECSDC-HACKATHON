/**
 * useQuery – useSyncExternalStore-based data fetching hook over the cache store.
 * Returns cached data instantly on revisit (no loading flash).
 *
 * @template T
 * @param {string | null} url - Endpoint URL; pass null to skip fetch.
 * @param {{ttl?: number, persist?: boolean, signal?: AbortSignal}} [opts]
 * @returns {{data: T|null, error: import("../lib/api.js").ApiClientError|null, isLoading: boolean, isFetching: boolean, refetch: () => void}}
 */

import { useSyncExternalStore, useState, useEffect, useCallback, useRef } from "react";
import { cacheStore, cachedGet, ApiClientError } from "../lib/api.js";

export function useQuery(url, opts) {
  const { ttl, persist = false } = opts || {};

  const getSnapshot = useCallback(
    () => (url ? cacheStore.get(url) : null),
    [url]
  );

  const data = useSyncExternalStore(
    cacheStore.subscribe,
    getSnapshot,
    getSnapshot
  );

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!data && !!url);
  const [isFetching, setIsFetching] = useState(false);
  const fetchCountRef = useRef(0);
  const controllerRef = useRef(null);

  const doFetch = useCallback(() => {
    if (!url) return;
    const thisRun = ++fetchCountRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsFetching(true);
    if (!cacheStore.get(url)) setIsLoading(true);
    setError(null);

    cachedGet(url, { ttl, persist, signal: controller.signal })
      .then(() => {
        if (thisRun !== fetchCountRef.current) return; // stale response guard
        setError(null);
      })
      .catch((err) => {
        if (thisRun !== fetchCountRef.current || controller.signal.aborted) return;
        setError(err instanceof ApiClientError ? err : new ApiClientError(err?.message || "Unknown error"));
      })
      .finally(() => {
        if (thisRun !== fetchCountRef.current) return;
        setIsLoading(false);
        setIsFetching(false);
      });
  }, [url, ttl, persist]);

  useEffect(() => {
    doFetch();
    return () => {
      fetchCountRef.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, [doFetch]);

  return { data, error, isLoading, isFetching, refetch: doFetch };
}

/**
 * useMutation – lightweight mutation hook for POST/PUT/DELETE.
 * isPending state, double-submit prevention via ref lock.
 * Never auto-retries.
 *
 * @template TResult
 * @template TPayload
 * @param {(payload: TPayload, signal: AbortSignal) => Promise<TResult>} mutationFn
 * @returns {{mutate: (payload: TPayload) => Promise<TResult>, isPending: boolean, reset: () => void}}
 */
export function useMutation(mutationFn) {
  const [isPending, setIsPending] = useState(false);
  const inFlightRef = useRef(false);
  const abortControllerRef = useRef(null);

  const mutate = useCallback(
    async (payload) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setIsPending(true);

      // AbortController per call so component can abort on unmount
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await mutationFn(payload, controller.signal);
        return result;
      } finally {
        inFlightRef.current = false;
        abortControllerRef.current = null;
        setIsPending(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    inFlightRef.current = false;
    setIsPending(false);
  }, []);

  // Abort on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { mutate, isPending, reset };
}

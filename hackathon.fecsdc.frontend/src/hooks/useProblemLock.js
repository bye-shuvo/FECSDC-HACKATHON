import { useMemo } from "react";
import { useCountdown } from "./useCountdown.js";
import { siteConfig } from "../data/siteConfig.js";

/**
 * Hook to manage problem statement reveal state.
 * Reuses the shared countdown ticker (no extra setInterval).
 * Returns true if the problems are still locked behind countdown.
 */
export function useProblemLock() {
  const { isExpired } = useCountdown(siteConfig.problemRevealDate);

  return useMemo(
    () => ({
      isLocked: !isExpired,
      revealDate: siteConfig.problemRevealDate,
    }),
    [isExpired]
  );
}

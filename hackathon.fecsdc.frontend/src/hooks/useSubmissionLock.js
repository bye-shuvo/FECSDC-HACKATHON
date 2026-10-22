import { useCountdown } from "./useCountdown.js";
import { siteConfig } from "../data/siteConfig.js";

let warnedInvalidDeadline = false;

export function useSubmissionLock(customDeadline) {
  const deadline = customDeadline ?? siteConfig.submissionDeadline;
  const deadlineTimestamp = Date.parse(deadline);
  const isInvalid = Number.isNaN(deadlineTimestamp);

  if (isInvalid && import.meta.env.DEV && !warnedInvalidDeadline) {
    console.warn("Invalid submission deadline; submissions remain open.");
    warnedInvalidDeadline = true;
  }

  // Subscribe to the shared countdown ticker (no new interval, pauses on hidden tab)
  useCountdown(isInvalid ? undefined : deadline);

  const now = Date.now();
  const isClosed = !isInvalid && now > deadlineTimestamp;
  const msLeft = isInvalid ? 0 : Math.max(0, deadlineTimestamp - now);

  return {
    isClosed,
    deadline,
    msLeft,
  };
}

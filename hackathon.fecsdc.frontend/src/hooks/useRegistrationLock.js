import { useCountdown } from "./useCountdown.js";
import { siteConfig } from "../data/siteConfig.js";

let warnedInvalidDeadline = false;

export function useRegistrationLock() {
  const { registrationOpen, registrationDeadline: deadline } = siteConfig;
  const deadlineTimestamp = Date.parse(deadline);
  const envDeadline = import.meta.env.VITE_REGISTRATION_DEADLINE;
  const invalidEnvDeadline =
    typeof envDeadline === "string" &&
    envDeadline.trim() !== "" &&
    Number.isNaN(Date.parse(envDeadline));
  const invalidDeadline = invalidEnvDeadline || Number.isNaN(deadlineTimestamp);
  const { isExpired } = useCountdown(deadline);

  if (
    !invalidEnvDeadline &&
    invalidDeadline &&
    import.meta.env.DEV &&
    !warnedInvalidDeadline
  ) {
    console.warn("Invalid registration deadline; registration remains open.");
    warnedInvalidDeadline = true;
  }

  const isDisabled = registrationOpen === false;
  const deadlinePassed =
    !invalidDeadline && isExpired && Date.now() > deadlineTimestamp;
  const isClosed = isDisabled || deadlinePassed;

  return {
    status: isClosed ? "closed" : "open",
    isClosed,
    reason: isDisabled ? "disabled" : deadlinePassed ? "deadline" : null,
    deadline,
  };
}
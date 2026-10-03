import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  startTransition,
  memo,
} from "react";
import { CheckCircle2, ArrowRight, AlertCircle, RefreshCw, GitBranch, FileText } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { useProblemLock } from "../../hooks/useProblemLock.js";
import { useQuery, useMutation } from "../../hooks/useApiQuery.js";
import { siteConfig } from "../../data/siteConfig.js";
import { problems } from "../../data/loadData.js";
import { apiFetch, ApiClientError } from "../../lib/api.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Input, Select } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { LockedState } from "../../components/ui/LockedState.jsx";
import { Reveal } from "../../components/motion/Reveal.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { validateGithubUrl, validateId, validateReadmeUrl, validateQuestionId } from "../../lib/validators.js";

// ─── Stable helpers (hoisted to avoid re-creation per render) ────────────────

// Module-level mutation fn — stable reference, never changes between renders.
// useMutation wraps it in useCallback([mutationFn]); a stable ref ensures that
// dep never changes, preventing cascading re-renders of handleSubmit.
async function _submitFn(payload, signal) {
  return apiFetch(`${siteConfig.submissionEndpoint}/${payload.question_id}`, {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

// TODO: Fallback question mapping from local problems.js when questionsEndpoint is unset.
function buildFallbackQuestions(problems) {
  return problems.map((p, idx) => ({
    id: idx + 1,
    category: p.track,
    question_text: p.title,
    score: 100,
  }));
}

function truncate(text, maxLen = 60) {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "\u2026" : text;
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem("fecsdc_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id !== "undefined") return parsed;
    return null;
  } catch {
    return null;
  }
}

// Static confetti pill array hoisted out of component
const CONFETTI_PILLS = [1, 2, 3, 4, 5, 6, 7, 8];

// Static steps array hoisted out of component
const SUBMISSION_STEPS = [
  "Select your challenge question",
  "Public GitHub repository link",
  "README or documentation URL",
];

// ─── Memoized sub-components ─────────────────────────────────────────────────

const QuestionOptions = memo(function QuestionOptions({ questions }) {
  return (
    <>
      <option value="" className="bg-card text-muted-foreground">
        — Select a challenge question —
      </option>
      {questions.map((q) => (
        <option key={q.id} value={String(q.id)} className="bg-card text-foreground">
          {q.category} &mdash; {truncate(q.question_text, 60)} ({q.score} pts)
        </option>
      ))}
    </>
  );
});

// ─── Initial form state factory ───────────────────────────────────────────────

const INITIAL_FORM = { question_id: "", user_id: "", github_url: "", readme_url: "" };

export default function SubmitPage() {
  useDocumentTitle("Submit Project", "Submit your hackathon project for FEC SDC Hackathon 2026.");

  const { isLocked, revealDate } = useProblemLock();

  // ── Stable user ref (read once, never causes re-renders) ─────────────────
  const [storedUser, setStoredUser] = useState(() => {
    const user = readStoredUser();
    return Number.isInteger(user?.id) && user.id > 0 ? user : null;
  });
  const [showRegistrationField, setShowRegistrationField] = useState(() => !storedUser);
  const [focusRegistrationField, setFocusRegistrationField] = useState(false);
  const autoUserId = storedUser?.id ?? null;

  // ── Questions via useQuery (cached, SWR, no re-load on revisit) ──────────
  const questionsUrl = siteConfig.questionsEndpoint || null;
  const {
    data: remoteQuestions,
    error: questionsError,
    isLoading: questionsLoading,
    refetch: refetchQuestions,
  } = useQuery(questionsUrl, { ttl: 5 * 60 * 1000, persist: true });

  // Build question list: remote → fallback
  const [fallbackQuestions, setFallbackQuestions] = useState(null);

  useEffect(() => {
    if (questionsUrl) return;
    startTransition(() => setFallbackQuestions(buildFallbackQuestions(problems)));
  }, [questionsUrl]);

  const questions = useMemo(() => {
    if (remoteQuestions) {
      return Array.isArray(remoteQuestions)
        ? remoteQuestions
        : (remoteQuestions?.questions ?? []);
    }
    if (!questionsUrl && fallbackQuestions) return fallbackQuestions;
    if (fallbackQuestions) return fallbackQuestions;
    return null; // still loading
  }, [fallbackQuestions, remoteQuestions, questionsUrl]);

  // ── Form state ──────────────────────────────────────────────────────────
  const [submittedForm, setSubmittedForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const submitLockRef = useRef(false);
  const formRefs = useRef({});
  const fieldRefCallbacks = useMemo(
    () => Object.fromEntries(
      ["question_id", "user_id", "github_url", "readme_url"].map((name) => [
        name,
        (element) => { formRefs.current[name] = element; },
      ])
    ),
    []
  );

  const readFormData = useCallback(() => ({
    question_id: formRefs.current.question_id?.value || "",
    user_id: formRefs.current.user_id?.value || "",
    github_url: formRefs.current.github_url?.value || "",
    readme_url: formRefs.current.readme_url?.value || "",
  }), []);

  useEffect(() => {
    if (!focusRegistrationField || !showRegistrationField) return;
    formRefs.current.user_id?.focus();
    setFocusRegistrationField(false);
  }, [focusRegistrationField, showRegistrationField]);

  const validate = useCallback(() => {
    const formData = readFormData();
    const newErrors = {};
    const qErr = validateQuestionId(formData.question_id);
    if (qErr) newErrors.question_id = qErr;
    if (showRegistrationField) {
      const idErr = validateId(formData.user_id);
      if (idErr) newErrors.user_id = idErr;
    }
    const ghErr = validateGithubUrl(formData.github_url);
    if (ghErr) newErrors.github_url = ghErr;
    const rmErr = validateReadmeUrl(formData.readme_url);
    if (rmErr) newErrors.readme_url = rmErr;

    setErrors(newErrors);

    const firstInvalid = Object.keys(newErrors)[0];
    if (firstInvalid) {
      formRefs.current[firstInvalid]?.focus();
    }

    return Object.keys(newErrors).length === 0;
  }, [readFormData, showRegistrationField]);

  const handleChange = useCallback((e) => {
    const { name } = e.target;
    setErrors((prev) => {
      if (!prev[name]) return prev;
      return { ...prev, [name]: undefined };
    });
    setServerError("");
  }, []);

  // Validate a single field on blur without doing work on each keystroke.
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setErrors((prev) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      let fieldError = null;
      if (name === "question_id") fieldError = validateQuestionId(value);
      else if (name === "user_id" && showRegistrationField) fieldError = validateId(value);
      else if (name === "github_url") fieldError = validateGithubUrl(value);
      else if (name === "readme_url") fieldError = validateReadmeUrl(value);
      if ((prev[name] || undefined) === (fieldError || undefined)) return prev;
      return { ...prev, [name]: fieldError || undefined };
    });
  }, [showRegistrationField]);

  // ── Submission mutation (stable module-level fn keeps useMutation dep stable) ─
  const submitMutation = useMutation(_submitFn);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      setServerError("");
      if (submitLockRef.current || submitMutation.isPending) return;
      if (!validate()) return;

      const formData = readFormData();
      const usingStoredUser = Boolean(storedUser && !showRegistrationField);
      const userId = usingStoredUser ? autoUserId : Number(formData.user_id.trim());
      if (!Number.isInteger(userId) || userId <= 0) {
        setErrors((prev) => ({ ...prev, user_id: "Enter a valid registration number." }));
        if (!showRegistrationField) setShowRegistrationField(true);
        setFocusRegistrationField(true);
        return;
      }

      submitLockRef.current = true;
      const payload = {
        question_id: Number(formData.question_id),
        user_id: userId,
        github_url: formData.github_url.trim(),
        readme_url: formData.readme_url.trim(),
      };

      try {
        await submitMutation.mutate(payload);
        startTransition(() => {
          setSubmittedForm({
            ...formData,
            user_id: userId,
            accountEmail: usingStoredUser ? storedUser.email : "",
          });
          setSubmitted(true);
        });
      } catch (err) {
        submitMutation.reset();
        if (err instanceof ApiClientError) {
          const fieldErrors = err.fieldErrors ?? {};
          const hasUserFieldError = Object.prototype.hasOwnProperty.call(fieldErrors, "user_id");
          const errorIdentity = [err.code, err.data?.code, err.message, err.data?.message]
            .filter(Boolean)
            .join(" ");
          const userRejected = [404, 409, 422].includes(err.status) &&
            (hasUserFieldError || /user|foreign.?key|\bfk\b/i.test(errorIdentity));

          if (userRejected) {
            try {
              localStorage.removeItem("fecsdc_user");
            } catch {
              // Storage can be unavailable; the current form still falls back to manual entry.
            }
            setStoredUser(null);
            setShowRegistrationField(true);
            setErrors((prev) => ({
              ...prev,
              ...fieldErrors,
              user_id: "No participant found with this registration number. Register first.",
            }));
            setFocusRegistrationField(true);
          } else if (Object.keys(fieldErrors).length > 0) {
            if (hasUserFieldError) {
              setStoredUser(null);
              setShowRegistrationField(true);
              setFocusRegistrationField(true);
            }
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
            const firstField = hasUserFieldError
              ? "user_id"
              : ["question_id", "user_id", "github_url", "readme_url"]
                .find((name) => fieldErrors[name]) || Object.keys(fieldErrors)[0];
            if (firstField === "user_id") setFocusRegistrationField(true);
            else formRefs.current[firstField]?.focus();
          } else if (err.status === 404 || err.status === 422) {
            setErrors((prev) => ({
              ...prev,
              question_id: "The selected question is no longer valid. Please choose another.",
            }));
            formRefs.current.question_id?.focus();
          } else if (!(err.status === 0 && /cancelled/i.test(err.message))) {
            setServerError(err.message || "Submission could not be processed. Please try again.");
          }
        } else if (err?.name !== "AbortError") {
          setServerError("Submission could not be processed. Please try again.");
        }
      } finally {
        submitLockRef.current = false;
      }
    },
    [readFormData, validate, autoUserId, storedUser, showRegistrationField, submitMutation]
  );

  const handleReset = useCallback(() => {
    submitLockRef.current = false;
    setSubmitted(false);
    setSubmittedForm(INITIAL_FORM);
    setErrors({});
    setServerError("");
    setShowRegistrationField(!storedUser);
    submitMutation.reset();
  }, [storedUser, submitMutation]);

  // ── Locked state ─────────────────────────────────────────────────────────
  if (isLocked) {
    return (
      <Section spacing="compact">
        <Container>
          <PageHeader
            eyebrow="PROJECT SUBMISSION"
            title="Submit"
            highlightWord="Solution"
            description="Project submission opens when the challenge problems are revealed."
            breadcrumbs={[
              { to: "/hackathon", label: "Hackathon" },
              { label: "Submit" },
            ]}
          />
          <Reveal>
            <LockedState revealDate={revealDate} />
          </Reveal>
        </Container>
      </Section>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    const selectedQ = questions?.find((q) => String(q.id) === String(submittedForm.question_id));
    return (
      <Section spacing="compact">
        <Container size="narrow">
          <PageHeader
            eyebrow="PROJECT SUBMISSION"
            title="Submit"
            highlightWord="Solution"
            description="Submit your hackathon project for evaluation."
            breadcrumbs={[
              { to: "/hackathon", label: "Hackathon" },
              { label: "Submit" },
            ]}
          />
          <Reveal>
            <div className="relative overflow-hidden p-8 md:p-14 text-center border border-success/40 bg-card rounded-md shadow-2xl max-w-2xl mx-auto flex flex-col items-center">
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
                {CONFETTI_PILLS.map((i) => (
                  <span
                    key={i}
                    className="absolute w-5 h-1.5 rounded-full animate-bounce"
                    style={{
                      top: `${(i * 11) % 90}%`,
                      left: `${(i * 13) % 90}%`,
                      backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--accent-amber)",
                      animationDuration: `${1.5 + (i % 2)}s`,
                    }}
                  />
                ))}
              </div>

              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success mb-6 shadow-lg shadow-success/10 z-10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <Badge variant="success" size="md" className="mb-3 z-10">
                SUBMISSION RECEIVED
              </Badge>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 z-10">
                Project submitted!
              </h2>

              {selectedQ && (
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-4 z-10">
                  Challenge:{" "}
                  <span className="text-foreground font-mono font-semibold">
                    {selectedQ.category} &mdash; {truncate(selectedQ.question_text, 50)}
                  </span>
                </p>
              )}

              {submittedForm.accountEmail ? (
                <p className="text-xs text-muted-foreground font-mono mb-6 z-10">
                  Linked to account: {submittedForm.accountEmail}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground font-mono mb-6 z-10">
                  Registration number: {submittedForm.user_id}
                </p>
              )}

              <div className="p-4 rounded-sm bg-muted/60 border border-border w-full max-w-md text-left text-xs font-mono space-y-2 mb-8 z-10">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">GitHub:</span>
                  <a
                    href={submittedForm.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 truncate"
                  >
                    {submittedForm.github_url}
                  </a>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">README:</span>
                  <a
                    href={submittedForm.readme_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 truncate"
                  >
                    {submittedForm.readme_url}
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 z-10">
                <Button to="/hackathon/schedule" variant="primary" icon={ArrowRight}>
                  View schedule
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Submit another
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  const isQuestionsLoading = questionsLoading && questions === null;
  const questionsErrorMsg = questionsError ? questionsError.message || "Could not load challenge questions. Please try again." : "";

  return (
    <Section spacing="compact">
      <Container size="narrow">
        <PageHeader
          eyebrow="PROJECT SUBMISSION"
          title="Submit"
          highlightWord="Solution"
          description="Submit your repository and documentation for judging. All fields are required."
          breadcrumbs={[
            { to: "/hackathon", label: "Hackathon" },
            { label: "Submit" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left: Info sidebar ─────────────────────────────────────── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
            <div className="p-5 rounded-md border border-primary/40 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary shrink-0" />
                <span className="font-label text-xs tracking-widest text-primary font-bold">
                  REQUIREMENTS
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Repository must be public on GitHub. README must contain your overall idea, how it works, and instructions to run.
              </p>
            </div>

            {/* Account link notice */}
            <div className="p-4 rounded-md border border-border bg-card/50 space-y-2">
              <div className="flex items-center gap-2">
                <PillMark size="sm" />
                <span className="font-mono text-xs text-muted-foreground font-semibold">ACCOUNT LINK</span>
              </div>
              {storedUser ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Submission will be linked to{" "}
                  <span className="text-foreground font-mono font-medium">{storedUser.email}</span>.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your registration number below. Not registered?{" "}
                  <a href="/hackathon/register" className="text-primary underline underline-offset-2">
                    Register first.
                  </a>
                </p>
              )}
            </div>

            {/* Steps checklist */}
            <Card variant="flat" className="space-y-3 text-xs font-mono">
              {SUBMISSION_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-4 h-4 rounded-sm bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </Card>
          </aside>

          {/* ── Right: Form card ───────────────────────────────────────── */}
          <div className="lg:col-span-8">
            <Card variant="default" className="p-0 overflow-hidden">
              {/* Card header strip */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="font-mono text-sm md:text-lg font-semibold text-foreground tracking-wider">
                  PROJECT SUBMISSION FORM
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="p-6 space-y-6"
                aria-label="Project submission form"
              >
                {/* aria-live region for form-level status announcements */}
                <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                  {serverError
                    ? `Submission error: ${serverError}`
                    : submitMutation.isPending
                      ? "Submitting your project, please wait."
                      : ""}
                </div>

                {/* ── Challenge Question ─────────────────────────────────── */}
                {isQuestionsLoading ? (
                  <div className="space-y-2" aria-label="Loading challenge questions" aria-busy="true">
                    <div className="h-3.5 w-36 bg-muted/60 rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted/40 rounded-md animate-pulse" />
                  </div>
                ) : questionsErrorMsg && (!questions || questions.length === 0) ? (
                  <div
                    role="alert"
                    className="p-4 rounded-md border border-destructive/40 bg-destructive/5 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-destructive font-mono">{questionsErrorMsg}</p>
                      <button
                        type="button"
                        onClick={refetchQuestions}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    </div>
                  </div>
                ) : questions && questions.length === 0 ? (
                  <div className="p-4 rounded-md border border-border bg-muted/30 text-center" role="status">
                    <p className="text-xs font-mono text-muted-foreground">
                      Questions are not available yet. Check back closer to hackathon day.
                    </p>
                  </div>
                ) : (
                  <Select
                    label="Challenge Question"
                    name="question_id"
                    id="question_id"
                    required
                    error={errors.question_id}
                    ref={fieldRefCallbacks.question_id}
                    defaultValue={INITIAL_FORM.question_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitMutation.isPending}
                  >
                    {/* Memoized options to prevent re-creation on every keystroke */}
                    <QuestionOptions questions={questions || []} />
                  </Select>
                )}

                {showRegistrationField && (
                  <Input
                    label="Registration number"
                    name="user_id"
                    id="user_id"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="e.g. 1021"
                    required
                    helperText="The number you received when you registered."
                    error={errors.user_id}
                    ref={fieldRefCallbacks.user_id}
                    defaultValue={INITIAL_FORM.user_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={submitMutation.isPending}
                  />
                )}

                {/* ── GitHub Repository URL ──────────────────────────────── */}
                <Input
                  label="GitHub Repository URL"
                  name="github_url"
                  id="github_url"
                  type="url"
                  required
                  placeholder="https://github.com/your-org/your-repo"
                  ref={fieldRefCallbacks.github_url}
                  defaultValue={INITIAL_FORM.github_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.github_url}
                  helperText="Must be a public repository on github.com (https required)."
                  disabled={submitMutation.isPending}
                  autoComplete="off"
                  inputMode="url"
                />

                {/* ── README / Documentation URL ─────────────────────────── */}
                <Input
                  label="README / Documentation URL"
                  name="readme_url"
                  id="readme_url"
                  type="url"
                  required
                  placeholder="https://github.com/your-org/your-repo/blob/main/README.md"
                  ref={fieldRefCallbacks.readme_url}
                  defaultValue={INITIAL_FORM.readme_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.readme_url}
                  helperText="Direct link to your README or hosted docs (https required)."
                  disabled={submitMutation.isPending}
                  autoComplete="off"
                  inputMode="url"
                />

                {/* ── Form-level server error ────────────────────────────── */}
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 p-4 rounded-md border border-destructive/40 bg-destructive/5"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-destructive font-mono leading-relaxed">{serverError}</p>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry submission
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Submit button ──────────────────────────────────────── */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={
                      submitMutation.isPending ||
                      isQuestionsLoading ||
                      (!isQuestionsLoading && questions !== null && questions.length === 0 && !questionsErrorMsg)
                    }
                    icon={submitMutation.isPending ? undefined : ArrowRight}
                    aria-disabled={submitMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {submitMutation.isPending ? "Submitting\u2026" : "Submit project"}
                  </Button>

                  {storedUser?.email && (
                    <p className="text-xs text-muted-foreground font-mono self-center">
                      As{" "}
                      <span className="text-foreground">{storedUser.email}</span>
                    </p>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}

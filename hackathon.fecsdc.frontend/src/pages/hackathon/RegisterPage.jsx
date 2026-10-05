import { useReducer, useRef, useCallback, useMemo, useState, useEffect, startTransition, memo } from "react";
import { Link } from "react-router";
import { ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { useMutation } from "../../hooks/useApiQuery.js";
import { useRegistrationLock } from "../../hooks/useRegistrationLock.js";
import { siteConfig } from "../../data/siteConfig.js";
import { Container, Section } from "../../components/ui/Section.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { PillMark } from "../../components/ui/PillDividers.jsx";
import { Input, Checkbox } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Reveal } from "../../components/motion/Reveal.jsx";
import { validateId, validateName, validateBatch, validateEmail, validateHackerrankUsername } from "../../lib/validators.js";
import { apiFetch, ApiClientError } from "../../lib/api.js";
import { prefetchQuestionsData } from "../../hooks/usePrefetchRoute.js";


// ─── Hoisted statics ─────────────────────────────────────────────────────────

const SHAKE_TRANSITION = { duration: 0.15 };
const CONFETTI_PILLS = [1, 2, 3, 4, 5, 6, 7, 8];

// ─── useReducer for form state (avoids full re-render on each field change) ──

const INITIAL_FORM = { id: "", name: "", hackerrank_username: "", batch: "", email: "", consent: false };

async function _registerFn(payload, signal) {
  return apiFetch(siteConfig.registrationEndpoint, {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
}

// ─── Memoized field wrappers (re-render only when their own value/error changes) ─

const ShakeField = memo(function ShakeField({ hasError, children }) {
  return (
    <motion.div
      animate={hasError ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={SHAKE_TRANSITION}
    >
      {children}
    </motion.div>
  );
});

// ─── Deadline card rendered once (static content) ────────────────────────────

const DeadlineCard = memo(function DeadlineCard() {
  return (
    <div className="p-4 rounded-md border border-border bg-card/60 text-xs font-mono text-muted-foreground space-y-1">
      <div className="text-accent-amber">Deadline: {new Date(siteConfig.registrationDeadline).toLocaleDateString()}</div>
      <div>Venue: {siteConfig.venue}</div>
    </div>
  );
});

export default function RegisterPage() {
  useDocumentTitle("Registration", "Register for FEC SDC Hackathon 2026.");

  const registrationLock = useRegistrationLock();

  const [errors, dispatchErrors] = useReducer(errorsReducer, {});
  const [submittedForm, setSubmittedForm] = useState(INITIAL_FORM);
  const [uiState, dispatchUi] = useReducer(uiReducer, {
    submitted: false,
    serverError: "",
  });
  const fieldRefs = useRef({});
  const fieldRefCallbacks = useMemo(
    () => Object.fromEntries(
      ["id", "name", "hackerrank_username", "batch", "email", "consent"].map((name) => [
        name,
        (element) => { fieldRefs.current[name] = element; },
      ])
    ),
    []
  );
  const { isPending: submitting, mutate: register } = useMutation(_registerFn);
  const registrationLockRef = useRef(registrationLock);
  registrationLockRef.current = registrationLock;

  useEffect(() => {
    if (registrationLock.status !== "open" || !siteConfig.registrationFormUrl) return;
    window.location.href = siteConfig.registrationFormUrl;
  }, [registrationLock.status]);

  // Block double-submit across StrictMode double-invocations
  const submittingRef = useRef(false);

  // Form values stay in the DOM so typing does not render the page shell.
  const handleChange = useCallback((e) => {
    const { name } = e.target;
    dispatchErrors({ type: "CLEAR_FIELD", name });
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value, checked } = e.target;
    let error = null;
    if (name === "id") error = validateId(value);
    else if (name === "name") error = validateName(value);
    else if (name === "hackerrank_username") error = validateHackerrankUsername(value);
    else if (name === "batch") error = validateBatch(value);
    else if (name === "email") error = validateEmail(value);
    else if (name === "consent" && !checked) error = "You must confirm club membership and accept rules.";
    dispatchErrors({ type: "SET_FIELD", name, error: error || undefined });
  }, []);

  const validate = useCallback(() => {
    const formData = {
      id: fieldRefs.current.id?.value || "",
      name: fieldRefs.current.name?.value || "",
      hackerrank_username: fieldRefs.current.hackerrank_username?.value || "",
      batch: fieldRefs.current.batch?.value || "",
      email: fieldRefs.current.email?.value || "",
      consent: Boolean(fieldRefs.current.consent?.checked),
    };
    const newErrors = {};
    const idErr = validateId(formData.id);
    if (idErr) newErrors.id = idErr;
    const nameErr = validateName(formData.name);
    if (nameErr) newErrors.name = nameErr;
    const hackerErr = validateHackerrankUsername(formData.hackerrank_username);
    if (hackerErr) newErrors.hackerrank_username = hackerErr;
    const batchErr = validateBatch(formData.batch);
    if (batchErr) newErrors.batch = batchErr;
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;
    if (!formData.consent) newErrors.consent = "You must confirm club membership and accept rules.";

    dispatchErrors({ type: "SET_ALL", errors: newErrors });

    const firstInvalid = Object.keys(newErrors)[0];
    if (firstInvalid) {
      const el = document.querySelector(`[name="${firstInvalid}"]`);
      if (el) el.focus();
    }
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      dispatchUi({ type: "SET_SERVER_ERROR", error: "" });

      if (registrationLockRef.current.isClosed) {
        dispatchUi({ type: "SET_SERVER_ERROR", error: "Registration has closed." });
        return;
      }

      if (submittingRef.current || submitting) return;
      if (!validate()) return;

      submittingRef.current = true;

      const formData = {
        id: fieldRefs.current.id?.value || "",
        name: fieldRefs.current.name?.value || "",
        hackerrank_username: fieldRefs.current.hackerrank_username?.value || "",
        batch: fieldRefs.current.batch?.value || "",
        email: fieldRefs.current.email?.value || "",
        consent: Boolean(fieldRefs.current.consent?.checked),
      };

      const payload = {
        id: Number(formData.id),
        name: formData.name.trim().replace(/\s+/g, " "),
        hackerrank_username: formData.hackerrank_username.trim(),
        batch: Number(formData.batch),
        email: formData.email.trim().toLowerCase(),
      };

      try {
        await register(payload);

        try {
          localStorage.setItem(
            "fecsdc_user",
            JSON.stringify({
              id: payload.id,
              email: payload.email,
              name: payload.name,
              batch: payload.batch,
            })
          );
        } catch {
          // Safe fallback if storage is restricted
        }

        // Warm the questions cache so SubmitPage renders instantly on next visit
        prefetchQuestionsData();

        startTransition(() => {
          setSubmittedForm(formData);
          dispatchUi({ type: "SET_SUBMITTED" });
        });
      } catch (err) {
        if (err instanceof ApiClientError) {
          if (err.fieldErrors?.id) {
            dispatchErrors({ type: "SET_FIELD", name: "id", error: "This registration number is already registered." });
            const idEl = document.querySelector('[name="id"]');
            if (idEl) idEl.focus();
          } else if (err.status === 409 || err.fieldErrors?.email) {
            dispatchErrors({ type: "SET_FIELD", name: "email", error: "This email is already registered." });
            const emailEl = document.querySelector('[name="email"]');
            if (emailEl) emailEl.focus();
          } else if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
            dispatchErrors({ type: "MERGE", errors: err.fieldErrors });
            const firstKey = Object.keys(err.fieldErrors)[0];
            const el = document.querySelector(`[name="${firstKey}"]`);
            if (el) el.focus();
          } else {
            dispatchUi({ type: "SET_SERVER_ERROR", error: err.message || "Registration could not be processed. Please retry." });
          }
        } else {
          dispatchUi({ type: "SET_SERVER_ERROR", error: "Registration could not be processed. Please retry." });
        }
      } finally {
        submittingRef.current = false;
      }
    },
    [register, submitting, validate]
  );

  const { submitted, serverError } = uiState;

  if (registrationLock.isClosed) {
    const description = registrationLock.reason === "deadline"
      ? `Registration closed on ${new Date(registrationLock.deadline).toLocaleDateString()}.`
      : "Registration is not open right now.";

    return (
      <Section spacing="compact">
        <Container>
          <PageHeader
            eyebrow="APPLICATION PORTAL"
            title="Individual"
            highlightWord="Registration"
            description={description}
            breadcrumbs={[
              { to: "/hackathon", label: "Hackathon" },
              { label: "Register" },
            ]}
          />
          <Reveal>
            <div
              data-cursor="locked"
              className="relative w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="scanline-overlay pointer-events-none rounded-sm" aria-hidden="true" />

              <div
                role="status"
                className="relative z-20 flex flex-col items-center gap-6 p-8 md:p-12 rounded-sm border border-primary/40 bg-card/95 shadow-2xl max-w-2xl w-full"
              >
                <div className="w-16 h-16 rounded-sm bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                  <Lock className="w-8 h-8" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <PillMark size="sm" />
                    <span className="font-mono text-xs tracking-widest text-primary font-bold uppercase">
                      STATUS: CLOSED
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-mono font-bold text-foreground">
                    Registration closed
                  </h2>
                  {registrationLock.reason === "deadline" && (
                    <p className="text-xs md:text-sm text-muted-foreground font-mono">
                      Deadline: {new Date(registrationLock.deadline).toLocaleString()}
                    </p>
                  )}
                </div>

                {siteConfig.clubMembersOnly && (
                  <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
                    Only enrolled FEC students with valid SDC club registrations may compete. Non-member entries will be rejected at student ID validation.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button to="/hackathon/schedule" variant="primary" icon={ArrowRight} data-cursor="button">
                    View schedule
                  </Button>
                  <Button to="/hackathon/rules" variant="outline" data-cursor="button">
                    Read rules
                  </Button>
                </div>

                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  data-cursor="link"
                  className="text-xs font-mono text-primary underline underline-offset-2 hover:text-accent-amber focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded"
                >
                  Contact {siteConfig.contactEmail}
                </a>
              </div>

              <div
                className="w-full max-w-3xl mt-12 opacity-25 blur-sm pointer-events-none select-none space-y-5"
                aria-hidden="true"
              >
                <div className="p-6 rounded-sm border border-border bg-card/50 space-y-5 text-left">
                  <div className="h-4 w-40 bg-muted-foreground/30 rounded-full" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((field) => (
                      <div key={field} className="space-y-2">
                        <div className="h-3 w-24 bg-muted-foreground/30 rounded-full" />
                        <div className="h-11 w-full bg-muted-foreground/20 rounded-sm" />
                      </div>
                    ))}
                  </div>
                  <div className="h-4 w-3/4 bg-muted-foreground/20 rounded-full" />
                  <div className="flex justify-between items-center pt-4 border-t border-border/40">
                    <div className="h-3 w-36 bg-muted-foreground/20 rounded-full" />
                    <div className="h-10 w-44 bg-primary/20 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="compact">
      <Container>
        <PageHeader
          eyebrow="APPLICATION PORTAL"
          title="Individual"
          highlightWord="Registration"
          description="Register yourself for the 6-hour sprint. Membership verification will be done during the event."
          breadcrumbs={[
            { to: "/hackathon", label: "Hackathon" },
            { label: "Register" },
          ]}
        />

        {submitted ? (
          /* Success State with Pill Confetti */
          <Reveal>
            <div className="relative overflow-hidden p-8 md:p-14 text-center border border-success/40 bg-card rounded-md shadow-2xl max-w-2xl mx-auto flex flex-col items-center">
              {/* Pill Confetti Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
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
                APPLICATION SUBMITTED
              </Badge>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 z-10">
                Welcome to the arena!
              </h2>

              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8 z-10">
                Registration confirmed for{" "}
                <span className="text-foreground font-mono font-semibold">{submittedForm.name.trim()}</span>.
                Confirmation details will be sent to your email{" "}
                <span className="text-foreground font-mono font-semibold underline">{submittedForm.email.trim()}</span>{" "}
                soon.
              </p>

              <div className="p-4 rounded-sm bg-muted/60 border border-border w-full max-w-md text-left text-xs font-mono space-y-2 mb-8 z-10">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground">{submittedForm.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch:</span>
                  <span className="text-foreground">{submittedForm.batch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className="text-primary font-bold">Pending Club Check</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 z-10">
                <Button to="/hackathon/schedule" variant="primary" icon={ArrowRight}>
                  Review schedule
                </Button>
                <Button to="/hackathon/rules" variant="outline">
                  Read rules &amp; conduct
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          /* Split Layout: Left Sticky Info + Right Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Sticky Info & Progress Checklist */}
            <aside className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
              {/* Notice */}
              <div className="p-5 rounded-md border border-primary/40 bg-primary/5 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-label text-xs tracking-widest text-primary font-bold">
                    CLUB MEMBERS ONLY
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Only enrolled FEC students with valid SDC club registrations may compete. Non-member entries will be rejected at student ID validation.
                </p>
              </div>

              {/* Progress Steps Checklist */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <PillMark size="sm" />
                  <span className="font-label text-xs tracking-widest text-foreground font-bold">
                    REGISTRATION CHECKLIST
                  </span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-start gap-2.5 text-foreground">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                      1
                    </span>
                    <div>
                      <div className="font-bold">Applicant Details</div>
                      <div className="text-muted-foreground text-[11px]">Name, batch &amp; email</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-foreground">
                    <span className="w-4 h-4 rounded-full bg-accent-amber/20 text-accent-amber flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                      2
                    </span>
                    <div>
                      <div className="font-bold">Rules Compliance</div>
                      <div className="text-muted-foreground text-[11px]">Honor code declaration</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-foreground">
                    <span className="w-4 h-4 rounded-full bg-brand-slate/30 text-foreground flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                      3
                    </span>
                    <div>
                      <div className="font-bold">Submission</div>
                      <div className="text-muted-foreground text-[11px]">Your ID is issued on success</div>
                    </div>
                  </div>
                </div>
              </Card>

              <DeadlineCard />
            </aside>

            {/* Right Column: Form */}
            <div className="lg:col-span-8">
              <Reveal>
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="sr-only"
                >
                  {serverError || (submitted ? "Registration successful." : "")}
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <Card className="p-6 sm:p-10 space-y-8 bg-card border-border shadow-xl">
                    {serverError && (
                      <div
                        className="p-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm font-mono flex items-center gap-2"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    {/* Step 1: Applicant Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <PillMark size="sm" />
                        <span className="font-label text-xs tracking-widest text-primary font-bold">
                          01. APPLICANT DETAILS
                        </span>
                      </div>

                      {/* Row 1: Full name + Registration Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <ShakeField hasError={!!errors.name}>
                          <Input
                            label="Full name"
                            name="name"
                            placeholder="e.g. Zubair Ahmed"
                            ref={fieldRefCallbacks.name}
                            defaultValue={INITIAL_FORM.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.name}
                            required
                          />
                        </ShakeField>

                        <ShakeField hasError={!!errors.id}>
                          <Input
                            label="Registration Number"
                            name="id"
                            placeholder="e.g. 202501045"
                            ref={fieldRefCallbacks.id}
                            defaultValue={INITIAL_FORM.id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.id}
                            helperText="Enter your reg. number (No '-' is allowed)"
                            required
                          />
                        </ShakeField>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <ShakeField hasError={!!errors.hackerrank_username}>
                          <Input
                            label="HackerRank username"
                            name="hackerrank_username"
                            placeholder="e.g. zubair_ahmed"
                            ref={fieldRefCallbacks.hackerrank_username}
                            defaultValue={INITIAL_FORM.hackerrank_username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.hackerrank_username}
                            helperText="Use your public HackerRank username."
                            required
                          />
                        </ShakeField>
                        <ShakeField hasError={!!errors.batch}>
                          <Input
                            label="Batch"
                            name="batch"
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 13"
                            min="12"
                            max="13"
                            step="1"
                            ref={fieldRefCallbacks.batch}
                            defaultValue={INITIAL_FORM.batch}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.batch}
                            helperText="Enter your academic batch number."
                            required
                          />
                        </ShakeField>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          <ShakeField hasError={!!errors.email}>
                            <Input
                              label="Email address"
                              name="email"
                              type="email"
                              placeholder="e.g. hacker@fec.edu.bd"
                              ref={fieldRefCallbacks.email}
                              defaultValue={INITIAL_FORM.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={errors.email}
                              required
                            />
                          </ShakeField>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Compliance & Verification */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                        <PillMark size="sm" />
                        <span className="font-label text-xs tracking-widest text-brand-slate font-bold">
                          02. COMPLIANCE &amp; VERIFICATION
                        </span>
                      </div>

                      <ShakeField hasError={!!errors.consent}>
                        <Checkbox
                          id="consent"
                          name="consent"
                          ref={fieldRefCallbacks.consent}
                          defaultChecked={INITIAL_FORM.consent}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.consent}
                          label="I certify that I am an actively enrolled student of Faridpur Engineering College and registered member of FEC SDC. I agree to adhere to the hackathon rules."
                          required
                        />
                      </ShakeField>
                    </div>

                    {/* Submit Bar */}
                    <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs font-mono text-muted-foreground">
                        * Applications close on {new Date(siteConfig.registrationDeadline).toLocaleDateString()}
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={submitting}
                        icon={ArrowRight}
                        className="w-full sm:w-auto min-w-[210px]"
                        data-cursor="button"
                        data-cursor-label="SUBMIT"
                      >
                        {submitting ? "Submitting application..." : "Submit registration"}
                      </Button>
                    </div>
                  </Card>
                </form>
              </Reveal>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}

// ─── Errors reducer ──────────────────────────────────────────────────────────

function errorsReducer(state, action) {
  switch (action.type) {
    case "SET_ALL":
      return action.errors;
    case "CLEAR_FIELD":
      if (!state[action.name]) return state;
      return { ...state, [action.name]: undefined };
    case "SET_FIELD":
      if (state[action.name] === action.error) return state;
      return { ...state, [action.name]: action.error };
    case "MERGE":
      return { ...state, ...action.errors };
    default:
      return state;
  }
}

// ─── UI reducer ──────────────────────────────────────────────────────────────

function uiReducer(state, action) {
  switch (action.type) {
    case "SET_SUBMITTED":
      return { ...state, submitted: true };
    case "SET_SERVER_ERROR":
      return { ...state, serverError: action.error };
    default:
      return state;
  }
}

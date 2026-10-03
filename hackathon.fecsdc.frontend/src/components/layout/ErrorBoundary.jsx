import { Component } from "react";
import { Link, useRouteError } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { PillMark } from "../ui/PillDividers.jsx";

export class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Suppress console spam in production, or log cleanly
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackView
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Route-level errorElement component for React Router
 */
export function RouteErrorElement() {
  const error = useRouteError();
  return <ErrorFallbackView error={error} />;
}

function ErrorFallbackView({ error, onReset }) {
  const errorMessage =
    error?.message ||
    error?.statusText ||
    "An unexpected error occurred within this operational module.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-sm border border-destructive/40 bg-card/90 shadow-2xl flex flex-col items-center gap-6">
        <div className="w-14 h-14 rounded-sm bg-destructive/15 border border-destructive/40 flex items-center justify-center text-destructive">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <PillMark size="sm" />
            <span className="font-mono text-xs tracking-widest text-destructive uppercase font-bold">
              MODULE FAULT INTERCEPTED
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            System Error
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono leading-relaxed">
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              data-cursor="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-muted text-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Component
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              data-cursor="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-muted text-foreground text-xs font-mono font-bold uppercase tracking-wider hover:bg-muted/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Application
            </button>
          )}

          <Link
            to="/"
            data-cursor="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow"
          >
            <Home className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

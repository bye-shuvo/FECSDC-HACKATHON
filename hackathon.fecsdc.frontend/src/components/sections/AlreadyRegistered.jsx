import { memo } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export const AlreadyRegistered = memo(function AlreadyRegistered({ user, onSwitch }) {
  const parsedDate = Date.parse(user.registeredAt);
  const registeredOn = Number.isFinite(parsedDate)
    ? new Date(parsedDate).toLocaleDateString()
    : "Unknown";

  return (
    <div role="status">
      <Card className="relative overflow-hidden p-8 md:p-14 text-center border border-success/40 bg-card rounded-md shadow-2xl max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success mb-6 shadow-lg shadow-success/10">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>

        <Badge variant="success" size="md" className="mb-3">
          ALREADY REGISTERED
        </Badge>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          You're already registered
        </h2>

        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
          Registered as <span className="text-foreground font-mono font-semibold">{user.name}</span> (
          <span className="text-foreground font-mono font-semibold">{user.email}</span>).
        </p>

        <div className="p-4 rounded-sm bg-muted/60 border border-border w-full max-w-md text-left text-xs font-mono space-y-2 mb-8">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">ID:</span>
            <span className="text-foreground">{user.id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Batch:</span>
            <span className="text-foreground">{user.batch}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Registered on:</span>
            <span className="text-foreground">{registeredOn}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Verification:</span>
            <span className="text-primary font-bold">Pending club check</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button to="/hackathon/submit" variant="primary" icon={ArrowRight}>
            Go to submission
          </Button>
          <Button to="/hackathon/schedule" variant="outline">
            View schedule
          </Button>
        </div>

        <button
          type="button"
          onClick={onSwitch}
          className="mt-6 text-xs font-mono text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded"
        >
          Not you? Register a different account
        </button>
      </Card>
    </div>
  );
});

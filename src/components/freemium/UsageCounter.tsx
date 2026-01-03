import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getRemainingFreeWorkflows, type FreemiumStatus } from "@/lib/freemium";
import { CheckCircle2, XCircle } from "lucide-react";

export function UsageCounter() {
  const [status, setStatus] = useState<FreemiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const freemiumStatus = await getRemainingFreeWorkflows();
        setStatus(freemiumStatus);
      } catch (error) {
        console.error("Error loading freemium status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
    // Refresh status periodically
    const interval = setInterval(loadStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !status) {
    return null;
  }

  // Paid users don't need to see usage counter
  if (status.isPaid) {
    return (
      <Badge variant="secondary" className="bg-primary/10 text-primary">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Pro Member
      </Badge>
    );
  }

  // Free users: show remaining workflows
  if (status.hasCompletedWorkflow) {
    return (
      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
        <XCircle className="mr-1 h-3 w-3" />
        0 free workflows remaining
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
      <CheckCircle2 className="mr-1 h-3 w-3" />
      1 free workflow
    </Badge>
  );
}


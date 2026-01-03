import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";
import { Sparkles, Zap, Infinity } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ open, onOpenChange, onUpgrade }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            You've completed your free workflow. Upgrade to unlock unlimited workflows and advanced features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Infinity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Unlimited Workflows</p>
                <p className="text-sm text-muted-foreground">
                  Access all workflows without limits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-muted-foreground">
                  Get help faster with priority support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Advanced Features</p>
                <p className="text-sm text-muted-foreground">
                  Unlock advanced workflow features
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Cancel anytime. No hidden fees.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Maybe Later
            </Button>
            <CheckoutButton className="flex-1">
              Upgrade to Pro
            </CheckoutButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


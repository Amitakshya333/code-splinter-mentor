import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  plan: "free" | "pro";
  status: "active" | "canceled" | "past_due";
  current_period_end: string | null;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          // User not authenticated - they should authenticate on landing page
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setSubscription(data);
        } else {
          // No subscription record means free plan
          setSubscription({
            id: "",
            plan: "free",
            status: "active",
            current_period_end: null,
          });
        }

        // Check for success/cancel from Stripe
        if (searchParams.get("success") === "true") {
          toast({
            title: "Payment successful!",
            description: "Your subscription is now active.",
          });
          // Reload subscription status
          window.location.reload();
        } else if (searchParams.get("canceled") === "true") {
          toast({
            title: "Payment canceled",
            description: "You can try again anytime.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error loading subscription:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [navigate, searchParams, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your current subscription plan and status
                </CardDescription>
              </div>
              {isPro ? (
                <Badge variant="default" className="bg-primary">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Pro
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="mr-1 h-3 w-3" />
                  Free
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPro ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{subscription?.status}</p>
                </div>
                {subscription?.current_period_end && (
                  <div>
                    <p className="text-sm text-muted-foreground">Renews on</p>
                    <p className="font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage your subscription, update payment methods, and view invoices in the Stripe Customer Portal.
                  </p>
                  <Button variant="outline" disabled>
                    Manage Subscription
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Coming soon)
                    </span>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're currently on the free plan. Upgrade to Pro for unlimited workflows and advanced features.
                  </p>
                  <Button
                    onClick={() => {
                      // This will be handled by UpgradeModal or direct checkout
                      navigate("/");
                    }}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


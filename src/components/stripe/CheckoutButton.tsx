import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/lib/stripe";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  children?: React.ReactNode;
}

export function CheckoutButton({ children, ...props }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const session = await createCheckoutSession();
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || "Upgrade to Pro"
      )}
    </Button>
  );
}


// Stripe client utilities
// Note: For MVP, we'll use Supabase Edge Function to create checkout sessions
// This keeps the secret key secure on the server

import { supabase } from "@/integrations/supabase/client";

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

/**
 * Create a Stripe Checkout session via Supabase Edge Function
 */
export async function createCheckoutSession(): Promise<CheckoutSession> {
  const priceId = import.meta.env.VITE_STRIPE_PRICE_ID;
  
  if (!priceId) {
    throw new Error("VITE_STRIPE_PRICE_ID not configured. Please set up your Stripe price ID in environment variables.");
  }

  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: {
      priceId,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to create checkout session");
  }

  if (!data || !data.url) {
    throw new Error("Invalid response from checkout function");
  }

  return {
    url: data.url,
    sessionId: data.sessionId,
  };
}


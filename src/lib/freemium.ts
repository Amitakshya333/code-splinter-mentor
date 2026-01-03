import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

export interface FreemiumStatus {
  remaining: number;
  limit: number;
  isPaid: boolean;
  hasCompletedWorkflow: boolean;
}

/**
 * Get user's subscription status
 */
async function getUserSubscriptionStatus(userId: string): Promise<{ isPaid: boolean }> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // No subscription record means free user
    return { isPaid: false };
  }

  return {
    isPaid: data.plan === "pro" && data.status === "active",
  };
}

/**
 * Check if user has completed any workflow
 */
async function hasCompletedWorkflow(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("workflow_completions")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return false;
    }
    throw error;
  }

  return !!data;
}

/**
 * Get remaining free workflows for user
 * MVP: 1 free workflow, paywall after completion
 */
export async function getRemainingFreeWorkflows(): Promise<FreemiumStatus> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        remaining: 1,
        limit: 1,
        isPaid: false,
        hasCompletedWorkflow: false,
      };
    }

    const { isPaid } = await getUserSubscriptionStatus(user.id);
    
    // Paid users have unlimited access
    if (isPaid) {
      return {
        remaining: Infinity,
        limit: Infinity,
        isPaid: true,
        hasCompletedWorkflow: false,
      };
    }

    // Free users: check if they've completed a workflow
    const hasCompleted = await hasCompletedWorkflow(user.id);

    return {
      remaining: hasCompleted ? 0 : 1,
      limit: 1,
      isPaid: false,
      hasCompletedWorkflow: hasCompleted,
    };
  } catch (error) {
    console.error("Error checking freemium status:", error);
    // Default to allowing access on error
    return {
      remaining: 1,
      limit: 1,
      isPaid: false,
      hasCompletedWorkflow: false,
    };
  }
}

/**
 * Check if user can start a new workflow
 */
export async function checkWorkflowLimit(): Promise<boolean> {
  const status = await getRemainingFreeWorkflows();
  return status.remaining > 0 || status.isPaid;
}

/**
 * Record workflow completion for freemium tracking
 */
export async function recordWorkflowCompletion(workflowId: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("workflow_completions")
      .upsert(
        {
          user_id: user.id,
          workflow_id: workflowId,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,workflow_id",
        }
      );

    if (error) throw error;
  } catch (error) {
    console.error("Error recording workflow completion:", error);
    throw error;
  }
}


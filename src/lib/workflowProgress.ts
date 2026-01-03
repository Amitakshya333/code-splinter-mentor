import { supabase } from "@/integrations/supabase/client";

export interface WorkflowProgress {
  id?: string;
  user_id: string;
  workflow_id: string;
  current_step: number;
  completed_steps: number[];
  started_at?: string;
  last_activity?: string;
  completed_at?: string | null;
}

/**
 * Save or update user progress for a workflow
 */
export async function saveProgress(
  userId: string,
  workflowId: string,
  currentStep: number,
  completedSteps: number[]
): Promise<WorkflowProgress> {
  const { data, error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        workflow_id: workflowId,
        current_step: currentStep,
        completed_steps: completedSteps,
        last_activity: new Date().toISOString(),
      },
      {
        onConflict: "user_id,workflow_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Load user progress for a workflow
 */
export async function loadProgress(
  userId: string,
  workflowId: string
): Promise<WorkflowProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("workflow_id", workflowId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Mark a step as complete
 */
export async function markStepComplete(
  userId: string,
  workflowId: string,
  stepNumber: number,
  allCompletedSteps: number[]
): Promise<WorkflowProgress> {
  return saveProgress(userId, workflowId, stepNumber + 1, allCompletedSteps);
}

/**
 * Mark workflow as completed
 */
export async function markWorkflowComplete(
  userId: string,
  workflowId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_progress")
    .update({
      completed_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("workflow_id", workflowId);

  if (error) throw error;
}

/**
 * Get all progress for a user
 */
export async function getUserWorkflowProgress(
  userId: string
): Promise<WorkflowProgress[]> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .order("last_activity", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get workflow progress with optimistic update support
 */
export function createOptimisticProgress(
  userId: string,
  workflowId: string,
  currentStep: number,
  completedSteps: number[]
): WorkflowProgress {
  return {
    user_id: userId,
    workflow_id: workflowId,
    current_step: currentStep,
    completed_steps: completedSteps,
    started_at: new Date().toISOString(),
    last_activity: new Date().toISOString(),
  };
}


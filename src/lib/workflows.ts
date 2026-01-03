import { supabase } from "@/integrations/supabase/client";

export interface Workflow {
  id: string;
  name: string;
  platform: string;
  description: string | null;
  estimated_time: number | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  total_steps: number;
  created_at: string;
}

export interface Step {
  id: string;
  workflow_id: string;
  order_number: number;
  title: string;
  description: string;
  action_type: string | null;
  ai_context: string | null;
  created_at: string;
}

/**
 * Map moduleId to workflow name (for MVP, we only have EC2 Management)
 * This will be replaced with a proper lookup table in the future
 */
const MODULE_TO_WORKFLOW_NAME: Record<string, string> = {
  "ec2-management": "EC2 Management",
};

/**
 * Get workflow ID from module ID
 */
export async function getWorkflowIdFromModuleId(
  moduleId: string
): Promise<string | null> {
  const workflowName = MODULE_TO_WORKFLOW_NAME[moduleId];
  if (!workflowName) return null;

  const { data, error } = await supabase
    .from("workflows")
    .select("id")
    .eq("name", workflowName)
    .single();

  if (error || !data) return null;
  return data.id;
}

/**
 * Get all workflows
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get workflow by ID
 */
export async function getWorkflowById(workflowId: string): Promise<Workflow | null> {
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

/**
 * Get all steps for a workflow
 */
export async function getWorkflowSteps(workflowId: string): Promise<Step[]> {
  const { data, error } = await supabase
    .from("steps")
    .select("*")
    .eq("workflow_id", workflowId)
    .order("order_number", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get workflow with steps
 */
export async function getWorkflowWithSteps(workflowId: string): Promise<{
  workflow: Workflow;
  steps: Step[];
} | null> {
  const workflow = await getWorkflowById(workflowId);
  if (!workflow) return null;

  const steps = await getWorkflowSteps(workflowId);
  return { workflow, steps };
}


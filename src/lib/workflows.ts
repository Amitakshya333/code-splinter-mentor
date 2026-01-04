/**
 * Workflow utilities - MVP using local data from navigatorModules
 * Database tables not yet created, using static module data
 */

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
 * Map moduleId to workflow ID (for MVP, we use module ID as workflow ID)
 */
export async function getWorkflowIdFromModuleId(
  moduleId: string
): Promise<string | null> {
  // For MVP, moduleId IS the workflowId
  return moduleId;
}

/**
 * Get all workflows - placeholder for future DB integration
 */
export async function getAllWorkflows(): Promise<Workflow[]> {
  // MVP: Return empty - workflows come from navigatorModules.ts
  return [];
}

/**
 * Get workflow by ID - placeholder for future DB integration
 */
export async function getWorkflowById(workflowId: string): Promise<Workflow | null> {
  // MVP: Return null - workflow data comes from navigatorModules.ts
  return null;
}

/**
 * Get all steps for a workflow - placeholder for future DB integration
 */
export async function getWorkflowSteps(workflowId: string): Promise<Step[]> {
  // MVP: Return empty - steps come from navigatorModules.ts
  return [];
}

/**
 * Get workflow with steps - placeholder for future DB integration
 */
export async function getWorkflowWithSteps(workflowId: string): Promise<{
  workflow: Workflow;
  steps: Step[];
} | null> {
  // MVP: Return null - data comes from navigatorModules.ts
  return null;
}

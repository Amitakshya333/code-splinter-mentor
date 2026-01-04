/**
 * Freemium system - MVP using localStorage
 * Database tables not yet created, using client-side storage
 */

export interface FreemiumStatus {
  remaining: number;
  limit: number;
  isPaid: boolean;
  hasCompletedWorkflow: boolean;
}

const STORAGE_KEY = "codesplinter_freemium";

interface FreemiumStorage {
  completedWorkflows: string[];
  isPaid: boolean;
}

function getStorageData(): FreemiumStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading freemium storage:", error);
  }
  return { completedWorkflows: [], isPaid: false };
}

function saveStorageData(data: FreemiumStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving freemium storage:", error);
  }
}

/**
 * Get remaining free workflows for user
 * MVP: 1 free workflow, paywall after completion
 */
export async function getRemainingFreeWorkflows(): Promise<FreemiumStatus> {
  const data = getStorageData();
  
  // Paid users have unlimited access
  if (data.isPaid) {
    return {
      remaining: Infinity,
      limit: Infinity,
      isPaid: true,
      hasCompletedWorkflow: data.completedWorkflows.length > 0,
    };
  }

  // Free users: check if they've completed a workflow
  const hasCompleted = data.completedWorkflows.length > 0;

  return {
    remaining: hasCompleted ? 0 : 1,
    limit: 1,
    isPaid: false,
    hasCompletedWorkflow: hasCompleted,
  };
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
  const data = getStorageData();
  if (!data.completedWorkflows.includes(workflowId)) {
    data.completedWorkflows.push(workflowId);
    saveStorageData(data);
  }
}

/**
 * Set paid status (for testing/Stripe integration)
 */
export function setPaidStatus(isPaid: boolean): void {
  const data = getStorageData();
  data.isPaid = isPaid;
  saveStorageData(data);
}

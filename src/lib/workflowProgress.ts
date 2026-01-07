/**
 * Workflow progress tracking - MVP using localStorage
 * Database table not yet created, using client-side storage
 */

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

const STORAGE_KEY = "codesplinter_progress";

interface ProgressStorage {
  [userWorkflowKey: string]: WorkflowProgress;
}

// Generate unique key for user + workflow combination
function getProgressKey(userId: string, workflowId: string): string {
  return `${userId}_${workflowId}`;
}

function getStorageData(): ProgressStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading progress storage:", error);
  }
  return {};
}

function saveStorageData(data: ProgressStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving progress storage:", error);
  }
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
  const storage = getStorageData();
  const key = getProgressKey(userId, workflowId);
  
  const progress: WorkflowProgress = {
    id: key,
    user_id: userId,
    workflow_id: workflowId,
    current_step: currentStep,
    completed_steps: completedSteps,
    started_at: storage[key]?.started_at || new Date().toISOString(),
    last_activity: new Date().toISOString(),
    completed_at: storage[key]?.completed_at || null,
  };
  
  storage[key] = progress;
  saveStorageData(storage);
  
  return progress;
}

/**
 * Load user progress for a workflow
 */
export async function loadProgress(
  userId: string,
  workflowId: string
): Promise<WorkflowProgress | null> {
  const storage = getStorageData();
  const key = getProgressKey(userId, workflowId);
  return storage[key] || null;
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
  const storage = getStorageData();
  const key = getProgressKey(userId, workflowId);
  if (storage[key]) {
    storage[key].completed_at = new Date().toISOString();
    storage[key].last_activity = new Date().toISOString();
    saveStorageData(storage);
  }
}

/**
 * Get all progress for a user
 */
export async function getUserWorkflowProgress(
  userId: string
): Promise<WorkflowProgress[]> {
  const storage = getStorageData();
  return Object.values(storage).filter(p => p.user_id === userId);
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

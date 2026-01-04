import { useState, useEffect, useCallback } from 'react';
import { getWorkflowIdFromModuleId } from '@/lib/workflows';
import { loadProgress, saveProgress as saveProgressToDb } from '@/lib/workflowProgress';

interface ProgressData {
  categoryId: string;
  moduleId: string;
  completedSteps: string[];
  currentStepIndex: number;
  lastUpdated: Date;
  quizResults?: Record<string, { passed: boolean; score: number }>;
}

const STORAGE_KEY = "codesplinter_navigator_progress";

// Generate a simple anonymous user ID for localStorage tracking
function getAnonymousUserId(): string {
  let userId = localStorage.getItem("codesplinter_anon_user");
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("codesplinter_anon_user", userId);
  }
  return userId;
}

export const useNavigatorProgress = (categoryId: string, moduleId: string) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    const loadProgressFromStorage = async () => {
      try {
        const userId = getAnonymousUserId();
        const workflowId = await getWorkflowIdFromModuleId(moduleId);
        if (!workflowId) {
          setIsLoading(false);
          return;
        }

        const dbProgress = await loadProgress(userId, workflowId);
        if (dbProgress) {
          // Convert database progress to Navigator format
          setProgress({
            categoryId,
            moduleId,
            completedSteps: dbProgress.completed_steps.map(s => s.toString()),
            currentStepIndex: dbProgress.current_step - 1, // Convert to 0-based index
            lastUpdated: new Date(dbProgress.last_activity || dbProgress.started_at || ''),
            quizResults: {}, // Quiz results not stored yet
          });
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressFromStorage();
  }, [categoryId, moduleId]);

  const getCurrentProgress = useCallback((): ProgressData | null => {
    return progress;
  }, [progress]);

  const saveProgress = useCallback(async (completedSteps: string[], currentStepIndex: number) => {
    try {
      const userId = getAnonymousUserId();
      const workflowId = await getWorkflowIdFromModuleId(moduleId);
      if (!workflowId) {
        console.warn('Cannot save progress: workflow not found');
        return;
      }

      // Convert string step IDs to numbers for storage
      const completedStepsNumbers = completedSteps.map(s => parseInt(s, 10)).filter(n => !isNaN(n));

      // Update local state optimistically
      const newProgress: ProgressData = {
        categoryId,
        moduleId,
        completedSteps,
        currentStepIndex,
        lastUpdated: new Date(),
        quizResults: progress?.quizResults,
      };
      setProgress(newProgress);

      // Save to localStorage
      await saveProgressToDb(
        userId,
        workflowId,
        currentStepIndex + 1, // Convert to 1-based index
        completedStepsNumbers
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [categoryId, moduleId, progress]);

  const saveQuizResult = useCallback((quizId: string, passed: boolean, score: number) => {
    // Quiz results stored locally for now
    setProgress(prev => prev ? {
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [quizId]: { passed, score },
      },
    } : null);
  }, []);

  const resetProgress = useCallback(async () => {
    try {
      const workflowId = await getWorkflowIdFromModuleId(moduleId);
      if (!workflowId) return;

      // Clear from localStorage
      const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      delete storage[workflowId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      
      setProgress(null);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, [moduleId]);

  const getOverallProgress = useCallback(() => {
    // For MVP, return simple stats
    return {
      totalModules: 1,
      completedModules: progress && progress.completedSteps.length > 0 ? 1 : 0,
    };
  }, [progress]);

  return {
    getCurrentProgress,
    saveProgress,
    saveQuizResult,
    resetProgress,
    getOverallProgress,
    isLoading,
  };
};

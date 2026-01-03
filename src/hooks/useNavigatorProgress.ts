import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth';
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

export const useNavigatorProgress = (categoryId: string, moduleId: string) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Supabase on mount
  useEffect(() => {
    const loadProgressFromDb = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const workflowId = await getWorkflowIdFromModuleId(moduleId);
        if (!workflowId) {
          setIsLoading(false);
          return;
        }

        const dbProgress = await loadProgress(user.id, workflowId);
        if (dbProgress) {
          // Convert database progress to Navigator format
          setProgress({
            categoryId,
            moduleId,
            completedSteps: dbProgress.completed_steps.map(s => s.toString()),
            currentStepIndex: dbProgress.current_step - 1, // Convert to 0-based index
            lastUpdated: new Date(dbProgress.last_activity || dbProgress.started_at || ''),
            quizResults: {}, // Quiz results not stored in DB yet
          });
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressFromDb();
  }, [categoryId, moduleId]);

  const getCurrentProgress = useCallback((): ProgressData | null => {
    return progress;
  }, [progress]);

  const saveProgress = useCallback(async (completedSteps: string[], currentStepIndex: number) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.warn('Cannot save progress: user not authenticated');
        return;
      }

      const workflowId = await getWorkflowIdFromModuleId(moduleId);
      if (!workflowId) {
        console.warn('Cannot save progress: workflow not found');
        return;
      }

      // Convert string step IDs to numbers for database
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

      // Save to database
      await saveProgressToDb(
        user.id,
        workflowId,
        currentStepIndex + 1, // Convert to 1-based index
        completedStepsNumbers
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      // Rollback on error - could restore previous progress here
    }
  }, [categoryId, moduleId, progress]);

  const saveQuizResult = useCallback((quizId: string, passed: boolean, score: number) => {
    // Quiz results stored locally for now (not in DB schema yet)
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
      const user = await getCurrentUser();
      if (!user) return;

      const workflowId = await getWorkflowIdFromModuleId(moduleId);
      if (!workflowId) return;

      // Delete progress from database
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('workflow_id', workflowId);

      if (error) throw error;
      setProgress(null);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, [moduleId]);

  const getOverallProgress = useCallback(() => {
    // For MVP, we only track one workflow, so return simple stats
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

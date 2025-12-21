import { useState, useEffect, useCallback } from 'react';

interface ProgressData {
  categoryId: string;
  moduleId: string;
  completedSteps: string[];
  currentStepIndex: number;
  lastUpdated: Date;
  quizResults?: Record<string, { passed: boolean; score: number }>;
}

interface NavigatorProgress {
  [key: string]: ProgressData;
}

const STORAGE_KEY = 'navigator-progress';

export const useNavigatorProgress = (categoryId: string, moduleId: string) => {
  const [progress, setProgress] = useState<NavigatorProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const getProgressKey = useCallback(() => `${categoryId}-${moduleId}`, [categoryId, moduleId]);

  const getCurrentProgress = useCallback((): ProgressData | null => {
    return progress[getProgressKey()] || null;
  }, [progress, getProgressKey]);

  const saveProgress = useCallback((completedSteps: string[], currentStepIndex: number) => {
    const key = getProgressKey();
    const newProgress: NavigatorProgress = {
      ...progress,
      [key]: {
        categoryId,
        moduleId,
        completedSteps,
        currentStepIndex,
        lastUpdated: new Date(),
        quizResults: progress[key]?.quizResults,
      },
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, [categoryId, moduleId, progress, getProgressKey]);

  const saveQuizResult = useCallback((quizId: string, passed: boolean, score: number) => {
    const key = getProgressKey();
    const current = progress[key] || {
      categoryId,
      moduleId,
      completedSteps: [],
      currentStepIndex: 0,
      lastUpdated: new Date(),
    };
    
    const newProgress: NavigatorProgress = {
      ...progress,
      [key]: {
        ...current,
        quizResults: {
          ...current.quizResults,
          [quizId]: { passed, score },
        },
      },
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, [categoryId, moduleId, progress, getProgressKey]);

  const resetProgress = useCallback(() => {
    const key = getProgressKey();
    const newProgress = { ...progress };
    delete newProgress[key];
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, [progress, getProgressKey]);

  const getOverallProgress = useCallback(() => {
    const entries = Object.values(progress);
    const totalModules = entries.length;
    const completedModules = entries.filter(p => p.completedSteps.length > 0).length;
    return { totalModules, completedModules };
  }, [progress]);

  return {
    getCurrentProgress,
    saveProgress,
    saveQuizResult,
    resetProgress,
    getOverallProgress,
  };
};

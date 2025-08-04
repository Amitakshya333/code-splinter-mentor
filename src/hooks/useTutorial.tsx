import { useState, useCallback } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  explanation: string;
  hint?: string;
  expectedOutput?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  steps: TutorialStep[];
  estimatedTime: number;
}

export const useTutorial = () => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [tutorialProgress, setTutorialProgress] = useState<Record<string, number>>({});

  const startTutorial = useCallback((tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
  }, []);

  const nextStep = useCallback(() => {
    if (currentTutorial && currentStepIndex < currentTutorial.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentTutorial, currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const completeStep = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    if (currentTutorial) {
      const progress = Math.round(((completedSteps.size + 1) / currentTutorial.steps.length) * 100);
      setTutorialProgress(prev => ({
        ...prev,
        [currentTutorial.id]: progress
      }));
    }
  }, [completedSteps, currentTutorial]);

  const resetTutorial = useCallback(() => {
    setCurrentTutorial(null);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
  }, []);

  const currentStep = currentTutorial ? currentTutorial.steps[currentStepIndex] : null;
  const isLastStep = currentTutorial ? currentStepIndex === currentTutorial.steps.length - 1 : false;
  const isFirstStep = currentStepIndex === 0;

  return {
    currentTutorial,
    currentStep,
    currentStepIndex,
    completedSteps,
    tutorialProgress,
    isLastStep,
    isFirstStep,
    startTutorial,
    nextStep,
    prevStep,
    completeStep,
    resetTutorial
  };
};
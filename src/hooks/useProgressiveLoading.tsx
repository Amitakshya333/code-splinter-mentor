import { useState, useEffect, useCallback } from 'react';

interface LoadingStep {
  id: string;
  name: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  progress: number;
  startTime?: number;
  endTime?: number;
}

interface ProgressiveLoadingConfig {
  enablePreloading: boolean;
  chunkSize: number;
  maxConcurrent: number;
  priority: 'speed' | 'memory' | 'balanced';
}

const DEFAULT_CONFIG: ProgressiveLoadingConfig = {
  enablePreloading: true,
  chunkSize: 1000,
  maxConcurrent: 3,
  priority: 'balanced',
};

const LOADING_STEPS: Omit<LoadingStep, 'status' | 'progress' | 'startTime' | 'endTime'>[] = [
  { id: 'core', name: 'Loading core components' },
  { id: 'editor', name: 'Initializing code editor' },
  { id: 'syntax', name: 'Loading syntax highlighting' },
  { id: 'themes', name: 'Loading themes' },
  { id: 'extensions', name: 'Loading extensions' },
  { id: 'templates', name: 'Loading code templates' },
  { id: 'cache', name: 'Initializing cache' },
  { id: 'collaboration', name: 'Setting up collaboration' },
];

export const useProgressiveLoading = (config: Partial<ProgressiveLoadingConfig> = {}) => {
  const [steps, setSteps] = useState<LoadingStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState({
    totalTime: 0,
    stepsCompleted: 0,
    averageStepTime: 0,
  });

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    // Initialize loading steps
    const initialSteps: LoadingStep[] = LOADING_STEPS.map(step => ({
      ...step,
      status: 'pending',
      progress: 0,
    }));
    setSteps(initialSteps);
  }, []);

  const updateStepProgress = useCallback((stepId: string, progress: number, status?: LoadingStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            progress: Math.min(100, Math.max(0, progress)),
            status: status || step.status,
            endTime: status === 'completed' ? Date.now() : step.endTime,
          }
        : step
    ));
  }, []);

  const startStep = useCallback((stepId: string) => {
    setCurrentStep(stepId);
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'loading', startTime: Date.now() }
        : step
    ));
  }, []);

  const completeStep = useCallback((stepId: string) => {
    updateStepProgress(stepId, 100, 'completed');
    
    setLoadingMetrics(prev => ({
      ...prev,
      stepsCompleted: prev.stepsCompleted + 1,
    }));
  }, [updateStepProgress]);

  const failStep = useCallback((stepId: string, error?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'error', endTime: Date.now() }
        : step
    ));
  }, []);

  // Simulate progressive loading
  const simulateLoading = useCallback(async () => {
    const startTime = Date.now();
    
    for (const step of LOADING_STEPS) {
      startStep(step.id);
      
      // Simulate loading with different durations based on step
      const stepDuration = getStepDuration(step.id, finalConfig.priority);
      const chunks = 10;
      const chunkDuration = stepDuration / chunks;
      
      for (let i = 0; i <= chunks; i++) {
        await new Promise(resolve => setTimeout(resolve, chunkDuration));
        updateStepProgress(step.id, (i / chunks) * 100);
      }
      
      completeStep(step.id);
    }
    
    const totalTime = Date.now() - startTime;
    setLoadingMetrics(prev => ({
      ...prev,
      totalTime,
      averageStepTime: totalTime / LOADING_STEPS.length,
    }));
    
    setIsLoading(false);
    setCurrentStep('');
  }, [startStep, updateStepProgress, completeStep, finalConfig.priority]);

  // Calculate overall progress
  useEffect(() => {
    const totalProgress = steps.reduce((sum, step) => sum + step.progress, 0);
    const overall = steps.length > 0 ? totalProgress / steps.length : 0;
    setOverallProgress(overall);
  }, [steps]);

  const getStepDuration = (stepId: string, priority: ProgressiveLoadingConfig['priority']): number => {
    const baseDurations: Record<string, number> = {
      core: 200,
      editor: 500,
      syntax: 300,
      themes: 150,
      extensions: 400,
      templates: 250,
      cache: 100,
      collaboration: 300,
    };
    
    const multipliers = {
      speed: 0.5,
      memory: 1.5,
      balanced: 1.0,
    };
    
    return (baseDurations[stepId] || 200) * multipliers[priority];
  };

  const preloadResources = useCallback(async (resources: string[]) => {
    if (!finalConfig.enablePreloading) return;
    
    const chunks = [];
    for (let i = 0; i < resources.length; i += finalConfig.chunkSize) {
      chunks.push(resources.slice(i, i + finalConfig.chunkSize));
    }
    
    const loadChunk = async (chunk: string[]) => {
      return Promise.all(chunk.map(async (resource) => {
        try {
          // Simulate resource loading
          await new Promise(resolve => setTimeout(resolve, 50));
          return { resource, status: 'loaded' };
        } catch (error) {
          return { resource, status: 'error', error };
        }
      }));
    };
    
    // Load chunks with concurrency limit
    const results = [];
    for (let i = 0; i < chunks.length; i += finalConfig.maxConcurrent) {
      const concurrentChunks = chunks.slice(i, i + finalConfig.maxConcurrent);
      const chunkResults = await Promise.all(concurrentChunks.map(loadChunk));
      results.push(...chunkResults.flat());
    }
    
    return results;
  }, [finalConfig]);

  const reset = useCallback(() => {
    setSteps(LOADING_STEPS.map(step => ({
      ...step,
      status: 'pending',
      progress: 0,
      startTime: undefined,
      endTime: undefined,
    })));
    setCurrentStep('');
    setIsLoading(true);
    setOverallProgress(0);
    setLoadingMetrics({
      totalTime: 0,
      stepsCompleted: 0,
      averageStepTime: 0,
    });
  }, []);

  return {
    steps,
    currentStep,
    isLoading,
    overallProgress,
    loadingMetrics,
    simulateLoading,
    preloadResources,
    reset,
    updateStepProgress,
    startStep,
    completeStep,
    failStep,
  };
};
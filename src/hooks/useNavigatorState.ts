import { useState, useCallback } from 'react';
import { 
  navigatorCategories, 
  getCategoryById, 
  getModuleById,
  NavigatorCategory,
  NavigatorModule,
  NavigatorStepData 
} from '@/data/navigatorModules';

export interface NavigatorStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  current: boolean;
  hasError?: boolean;
  warning?: string;
  tip?: string;
}

export interface MentorMessage {
  id: string;
  content: string;
  type: 'hint' | 'success' | 'warning' | 'info';
  timestamp: Date;
}

// Convert module steps to navigator steps
const convertSteps = (moduleSteps: NavigatorStepData[]): NavigatorStep[] => {
  return moduleSteps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.instruction,
    action: step.action,
    completed: false,
    current: index === 0,
    warning: step.warning,
    tip: step.tip,
  }));
};

export const useNavigatorState = () => {
  const [categoryId, setCategoryId] = useState<string>('aws');
  const [moduleId, setModuleId] = useState<string>('ec2-management');
  const [steps, setSteps] = useState<NavigatorStep[]>(() => {
    const module = getModuleById('aws', 'ec2-management');
    return module ? convertSteps(module.steps) : [];
  });
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    { id: '1', content: "Welcome! I'll guide you through deploying your first EC2 instance on AWS. Let's start!", type: 'info', timestamp: new Date() }
  ]);
  const [currentView, setCurrentView] = useState('dashboard');

  // Get current category and module
  const currentCategory = getCategoryById(categoryId);
  const currentModule = getModuleById(categoryId, moduleId);

  // Legacy platform support
  const platform = categoryId as 'aws' | 'docker' | 'github';

  const changeCategory = useCallback((newCategoryId: string) => {
    setCategoryId(newCategoryId);
    const category = getCategoryById(newCategoryId);
    if (category && category.subCategories.length > 0) {
      const firstModule = category.subCategories[0].modules[0];
      if (firstModule) {
        setModuleId(firstModule.id);
        setSteps(convertSteps(firstModule.steps));
        setMentorMessages([{
          id: Date.now().toString(),
          content: `Welcome to ${category.name}! Let's explore ${firstModule.name}. ${firstModule.description}`,
          type: 'info',
          timestamp: new Date()
        }]);
      }
    }
    setCurrentView('dashboard');
  }, []);

  const changeModule = useCallback((newModuleId: string) => {
    setModuleId(newModuleId);
    const module = getModuleById(categoryId, newModuleId);
    if (module) {
      setSteps(convertSteps(module.steps));
      setMentorMessages([{
        id: Date.now().toString(),
        content: `Starting ${module.name}: ${module.description}`,
        type: 'info',
        timestamp: new Date()
      }]);
    }
    setCurrentView('dashboard');
  }, [categoryId]);

  // Legacy platform change (maps to category)
  const changePlatform = useCallback((newPlatform: 'aws' | 'docker' | 'github') => {
    const categoryMap: Record<string, string> = {
      'aws': 'aws',
      'docker': 'containers',
      'github': 'git',
    };
    changeCategory(categoryMap[newPlatform] || newPlatform);
  }, [changeCategory]);

  const completeAction = useCallback((action: string) => {
    const currentStepIndex = steps.findIndex(s => s.current);
    const currentStep = steps[currentStepIndex];
    
    if (currentStep?.action !== action) {
      const warningMsg: MentorMessage = {
        id: Date.now().toString(),
        content: `Hmm, that's not the right action. Try to ${currentStep?.description.toLowerCase()} instead.`,
        type: 'warning',
        timestamp: new Date()
      };
      setMentorMessages(prev => [...prev, warningMsg]);
      return false;
    }

    setSteps(prev => prev.map((step, idx) => {
      if (idx === currentStepIndex) return { ...step, completed: true, current: false };
      if (idx === currentStepIndex + 1) return { ...step, current: true };
      return step;
    }));

    const successMessages = [
      "Perfect! You're doing great.",
      "Excellent work! Moving to the next step.",
      "That's exactly right! Keep going.",
      "Well done! You're making progress.",
    ];
    
    const successMsg: MentorMessage = {
      id: Date.now().toString(),
      content: successMessages[Math.floor(Math.random() * successMessages.length)],
      type: 'success',
      timestamp: new Date()
    };
    setMentorMessages(prev => [...prev, successMsg]);

    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setTimeout(() => {
        let hintContent = `Next up: ${nextStep.description}`;
        if (nextStep.tip) hintContent += ` 💡 Tip: ${nextStep.tip}`;
        if (nextStep.warning) hintContent += ` ⚠️ Warning: ${nextStep.warning}`;
        
        const hintMsg: MentorMessage = {
          id: (Date.now() + 1).toString(),
          content: hintContent,
          type: 'hint',
          timestamp: new Date()
        };
        setMentorMessages(prev => [...prev, hintMsg]);
      }, 1000);
    }

    return true;
  }, [steps]);

  const getCurrentStep = useCallback(() => {
    return steps.find(s => s.current);
  }, [steps]);

  return {
    // New modular system
    categoryId,
    moduleId,
    currentCategory,
    currentModule,
    categories: navigatorCategories,
    changeCategory,
    changeModule,
    // Legacy support
    platform,
    changePlatform,
    // Core functionality
    steps,
    mentorMessages,
    currentView,
    setCurrentView,
    completeAction,
    getCurrentStep,
  };
};

export type Platform = 'aws' | 'docker' | 'github';

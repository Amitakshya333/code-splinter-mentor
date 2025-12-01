import { useState, useCallback } from 'react';

export type Platform = 'aws' | 'docker' | 'github';

export interface NavigatorStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  current: boolean;
  hasError?: boolean;
  warning?: string;
}

export interface MentorMessage {
  id: string;
  content: string;
  type: 'hint' | 'success' | 'warning' | 'info';
  timestamp: Date;
}

const AWS_STEPS: NavigatorStep[] = [
  { id: '1', title: 'Open EC2 Console', description: 'Navigate to the EC2 dashboard', action: 'click-ec2', completed: false, current: true },
  { id: '2', title: 'Launch Instance', description: 'Click the Launch Instance button', action: 'click-launch', completed: false, current: false },
  { id: '3', title: 'Select AMI', description: 'Choose Amazon Linux 2 AMI', action: 'select-ami', completed: false, current: false },
  { id: '4', title: 'Choose Instance Type', description: 'Select t2.micro (free tier)', action: 'select-type', completed: false, current: false },
  { id: '5', title: 'Configure Security', description: 'Set up security group rules', action: 'configure-security', completed: false, current: false },
  { id: '6', title: 'Review & Launch', description: 'Review settings and launch', action: 'review-launch', completed: false, current: false },
];

const DOCKER_STEPS: NavigatorStep[] = [
  { id: '1', title: 'Open Terminal', description: 'Access Docker CLI', action: 'open-terminal', completed: false, current: true },
  { id: '2', title: 'Pull Image', description: 'Pull nginx:latest image', action: 'pull-image', completed: false, current: false },
  { id: '3', title: 'Create Container', description: 'Run container with port mapping', action: 'create-container', completed: false, current: false },
  { id: '4', title: 'Verify Running', description: 'Check container status', action: 'verify-status', completed: false, current: false },
  { id: '5', title: 'View Logs', description: 'Inspect container logs', action: 'view-logs', completed: false, current: false },
];

const GITHUB_STEPS: NavigatorStep[] = [
  { id: '1', title: 'Create Repository', description: 'Initialize a new repo', action: 'create-repo', completed: false, current: true },
  { id: '2', title: 'Add README', description: 'Create README.md file', action: 'add-readme', completed: false, current: false },
  { id: '3', title: 'Create Branch', description: 'Create feature branch', action: 'create-branch', completed: false, current: false },
  { id: '4', title: 'Make Changes', description: 'Edit files in branch', action: 'make-changes', completed: false, current: false },
  { id: '5', title: 'Open Pull Request', description: 'Submit PR for review', action: 'open-pr', completed: false, current: false },
];

export const useNavigatorState = () => {
  const [platform, setPlatform] = useState<Platform>('aws');
  const [steps, setSteps] = useState<NavigatorStep[]>(AWS_STEPS);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    { id: '1', content: "Welcome! I'll guide you through deploying your first app on AWS. Let's start by accessing the EC2 console.", type: 'info', timestamp: new Date() }
  ]);
  const [currentView, setCurrentView] = useState('dashboard');

  const changePlatform = useCallback((newPlatform: Platform) => {
    setPlatform(newPlatform);
    setCurrentView('dashboard');
    
    const platformSteps = {
      aws: AWS_STEPS,
      docker: DOCKER_STEPS,
      github: GITHUB_STEPS,
    };
    
    setSteps(platformSteps[newPlatform].map((s, i) => ({ ...s, completed: false, current: i === 0 })));
    
    const welcomeMessages = {
      aws: "Great choice! AWS is the most popular cloud platform. Let's deploy an EC2 instance together.",
      docker: "Docker is essential for modern DevOps. I'll walk you through containerizing an app.",
      github: "GitHub is where developers collaborate. Let's set up your first repository workflow.",
    };
    
    setMentorMessages([{ id: Date.now().toString(), content: welcomeMessages[newPlatform], type: 'info', timestamp: new Date() }]);
  }, []);

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

    // Add hint for next step
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      setTimeout(() => {
        const hintMsg: MentorMessage = {
          id: (Date.now() + 1).toString(),
          content: `Next up: ${nextStep.description}. Look for the ${nextStep.title.toLowerCase()} option.`,
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
    platform,
    steps,
    mentorMessages,
    currentView,
    setCurrentView,
    changePlatform,
    completeAction,
    getCurrentStep,
  };
};

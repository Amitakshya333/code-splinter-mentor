import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTutorial, Tutorial } from '@/hooks/useTutorial';
import { Play, SkipForward, SkipBack, RotateCcw, BookOpen, Clock, Target } from 'lucide-react';

const mockTutorials: Tutorial[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Learn the fundamentals of Python programming',
    difficulty: 'beginner',
    language: 'python',
    estimatedTime: 30,
    steps: [
      {
        id: 'variables',
        title: 'Variables and Data Types',
        description: 'Learn how to create and use variables in Python',
        code: 'name = "Alice"\nage = 25\nprint(f"Hello, {name}! You are {age} years old.")',
        explanation: 'Variables store data that can be used later. Python automatically determines the data type.',
        hint: 'Use descriptive variable names for better code readability',
        expectedOutput: 'Hello, Alice! You are 25 years old.'
      },
      {
        id: 'functions',
        title: 'Functions',
        description: 'Learn how to create and call functions',
        code: 'def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("World")\nprint(result)',
        explanation: 'Functions are reusable blocks of code that perform specific tasks.',
        hint: 'Functions help organize code and avoid repetition',
        expectedOutput: 'Hello, World!'
      }
    ]
  },
  {
    id: 'js-dom',
    title: 'JavaScript DOM Manipulation',
    description: 'Learn how to interact with web page elements',
    difficulty: 'intermediate',
    language: 'javascript',
    estimatedTime: 45,
    steps: [
      {
        id: 'select-elements',
        title: 'Selecting Elements',
        description: 'Learn different ways to select DOM elements',
        code: 'const element = document.getElementById("myElement");\nconst elements = document.querySelectorAll(".className");',
        explanation: 'DOM selection methods let you find and manipulate HTML elements.',
        hint: 'querySelector is more flexible than getElementById'
      }
    ]
  }
];

interface TutorialModeProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const TutorialMode: React.FC<TutorialModeProps> = ({ onCodeUpdate }) => {
  const {
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
  } = useTutorial();

  const handleRunCode = () => {
    if (currentStep?.code && onCodeUpdate) {
      onCodeUpdate(currentStep.code, currentTutorial?.language || 'python');
    }
  };

  const handleCompleteStep = () => {
    if (currentStep) {
      completeStep(currentStep.id);
      if (!isLastStep) {
        nextStep();
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentTutorial) {
    return (
      <div className="h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Interactive Tutorials</h3>
          <p className="text-sm text-muted-foreground">
            Learn programming step-by-step with guided tutorials
          </p>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="space-y-3">
            {mockTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{tutorial.title}</h4>
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {tutorial.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.estimatedTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {tutorial.steps.length} steps
                    </div>
                  </div>

                  {tutorialProgress[tutorial.id] && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{tutorialProgress[tutorial.id]}%</span>
                      </div>
                      <Progress value={tutorialProgress[tutorial.id]} className="h-1" />
                    </div>
                  )}

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => startTutorial(tutorial)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {tutorialProgress[tutorial.id] ? 'Continue' : 'Start Tutorial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{currentTutorial.title}</h3>
          <Button variant="ghost" size="sm" onClick={resetTutorial}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {currentTutorial.steps.length}
          </span>
          <Badge className={getDifficultyColor(currentTutorial.difficulty)}>
            {currentTutorial.difficulty}
          </Badge>
        </div>
        
        <Progress 
          value={((currentStepIndex + 1) / currentTutorial.steps.length) * 100} 
          className="h-2"
        />
      </div>

      {/* Current Step Content */}
      <ScrollArea className="flex-1 mb-4">
        {currentStep && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{currentStep.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{currentStep.description}</p>
                
                {currentStep.code && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Example Code:</span>
                      <Button size="sm" onClick={handleRunCode}>
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    </div>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                      <code>{currentStep.code}</code>
                    </pre>
                  </div>
                )}

                <Separator />

                <div>
                  <h5 className="text-sm font-medium mb-2">Explanation</h5>
                  <p className="text-sm text-muted-foreground">
                    {currentStep.explanation}
                  </p>
                </div>

                {currentStep.hint && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Tip</span>
                    </div>
                    <p className="text-sm text-blue-800">{currentStep.hint}</p>
                  </div>
                )}

                {currentStep.expectedOutput && (
                  <div>
                    <span className="text-xs font-medium">Expected Output:</span>
                    <pre className="bg-green-50 border border-green-200 p-2 rounded text-xs mt-1">
                      {currentStep.expectedOutput}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={prevStep}
          disabled={isFirstStep}
          className="flex-1"
        >
          <SkipBack className="w-3 h-3 mr-1" />
          Previous
        </Button>
        
        <Button 
          size="sm" 
          onClick={handleCompleteStep}
          className="flex-1"
        >
          {isLastStep ? 'Complete Tutorial' : 'Next Step'}
          {!isLastStep && <SkipForward className="w-3 h-3 ml-1" />}
        </Button>
      </div>
    </div>
  );
};
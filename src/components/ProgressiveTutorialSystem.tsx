import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Code, 
  Target,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'practice' | 'challenge' | 'quiz';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  code?: string;
  explanation: string;
  hints: string[];
  completed: boolean;
  score?: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalSteps: number;
  completedSteps: number;
  estimatedTime: number;
  skills: string[];
  steps: LearningStep[];
}

const mockLearningPaths: LearningPath[] = [
  {
    id: 'js-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript programming',
    category: 'JavaScript',
    difficulty: 'beginner',
    totalSteps: 12,
    completedSteps: 3,
    estimatedTime: 120,
    skills: ['Variables', 'Functions', 'Arrays', 'Objects'],
    steps: [
      {
        id: 'js-1',
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables and basic data types',
        type: 'tutorial',
        difficulty: 'beginner',
        estimatedTime: 15,
        code: 'let name = "John";\nconst age = 25;\nvar isStudent = true;',
        explanation: 'Variables store data values. Use let for changeable values, const for constants.',
        hints: ['Use let for variables that change', 'Use const for constants'],
        completed: true,
        score: 95
      },
      {
        id: 'js-2',
        title: 'Functions',
        description: 'Create and use functions in JavaScript',
        type: 'practice',
        difficulty: 'beginner',
        estimatedTime: 20,
        code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}',
        explanation: 'Functions are reusable blocks of code that perform specific tasks.',
        hints: ['Functions can take parameters', 'Use return to send back values'],
        completed: false
      }
    ]
  },
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    description: 'Master the basics of React development',
    category: 'React',
    difficulty: 'intermediate',
    totalSteps: 15,
    completedSteps: 0,
    estimatedTime: 180,
    skills: ['Components', 'JSX', 'Props', 'State', 'Hooks'],
    steps: []
  }
];

interface ProgressiveTutorialSystemProps {
  onCodeUpdate?: (code: string, language: string) => void;
}

export const ProgressiveTutorialSystem: React.FC<ProgressiveTutorialSystemProps> = ({
  onCodeUpdate
}) => {
  const { learningProgress, currentLearningPath, setCurrentLearningPath, setLearningProgress } = useAppStore();
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(currentLearningPath);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedPath) {
      setCurrentLearningPath(selectedPath);
    }
  }, [selectedPath, setCurrentLearningPath]);

  const handleStartPath = (path: LearningPath) => {
    setSelectedPath(path);
    setCurrentStepIndex(0);
  };

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const progress = Math.round(((completedSteps.size + 1) / (selectedPath?.totalSteps || 1)) * 100);
    setLearningProgress({ 
      ...learningProgress, 
      [selectedPath?.id || '']: progress 
    });
  };

  const handleRunCode = (code: string) => {
    if (onCodeUpdate) {
      onCodeUpdate(code, 'javascript');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <BookOpen className="h-4 w-4" />;
      case 'practice': return <Code className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
      case 'quiz': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (!selectedPath) {
    return (
      <div className="h-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Choose Your Learning Path</h2>
          <p className="text-muted-foreground">
            Select a personalized learning path based on your skill level and goals
          </p>
        </div>

        <div className="grid gap-4">
          {mockLearningPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {path.title}
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </div>
                  <Award className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.estimatedTime} minutes
                    </span>
                    <span>{path.totalSteps} steps</span>
                  </div>
                  
                  <Progress value={(path.completedSteps / path.totalSteps) * 100} />
                  
                  <div className="flex flex-wrap gap-1">
                    {path.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handleStartPath(path)}
                    className="w-full"
                    variant={path.completedSteps > 0 ? "outline" : "default"}
                  >
                    {path.completedSteps > 0 ? 'Continue' : 'Start Learning'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentStep = selectedPath.steps[currentStepIndex];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{selectedPath.title}</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {selectedPath.totalSteps}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedPath(null)}
            size="sm"
          >
            Change Path
          </Button>
        </div>
        <Progress 
          value={((currentStepIndex + 1) / selectedPath.totalSteps) * 100} 
          className="mt-2"
        />
      </div>

      {currentStep && (
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-4">
              {getTypeIcon(currentStep.type)}
              <h3 className="text-xl font-semibold">{currentStep.title}</h3>
              <Badge className={getDifficultyColor(currentStep.difficulty)}>
                {currentStep.difficulty}
              </Badge>
              {currentStep.completed && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>

            <p className="text-muted-foreground mb-6">{currentStep.description}</p>

            <Tabs defaultValue="explanation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>

              <TabsContent value="explanation" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="leading-relaxed">{currentStep.explanation}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{currentStep.code}</code>
                    </pre>
                    <Button 
                      onClick={() => handleRunCode(currentStep.code || '')}
                      className="mt-4"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run This Code
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hints" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {currentStep.hints.map((hint, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <p className="text-sm">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="practice" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="mb-4">Try modifying the code and see what happens!</p>
                    <Button 
                      onClick={() => handleCompleteStep(currentStep.id)}
                      disabled={currentStep.completed}
                      className="w-full"
                    >
                      {currentStep.completed ? 'Completed' : 'Mark as Complete'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6">
              <Button 
                variant="outline"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
              >
                Previous Step
              </Button>
              <Button 
                onClick={() => setCurrentStepIndex(Math.min(selectedPath.steps.length - 1, currentStepIndex + 1))}
                disabled={currentStepIndex === selectedPath.steps.length - 1}
              >
                Next Step
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
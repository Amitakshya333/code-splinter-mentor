import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Target, 
  Lightbulb,
  Code2,
  Database,
  Palette,
  Globe,
  Trophy,
  AlertTriangle,
  BookOpen,
  Calculator,
  ShoppingCart,
  MessageSquare,
  Gamepad2
} from "lucide-react";

interface ProjectGuidanceProps {
  onProjectSelect?: (project: string) => void;
}

const projectTemplates = [
  {
    id: "todo-app",
    name: "To-Do App",
    description: "Build a productivity task manager",
    difficulty: "Beginner",
    icon: CheckCircle,
    skills: ["React", "State Management", "Local Storage"],
    estimatedTime: "2-3 hours"
  },
  {
    id: "calculator",
    name: "Calculator App", 
    description: "Create a functional calculator",
    difficulty: "Beginner",
    icon: Calculator,
    skills: ["JavaScript", "Math Operations", "UI Design"],
    estimatedTime: "1-2 hours"
  },
  {
    id: "blog",
    name: "Personal Blog",
    description: "Build a blog with posts and comments",
    difficulty: "Intermediate",
    icon: BookOpen,
    skills: ["React", "API Integration", "Database"],
    estimatedTime: "4-6 hours"
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    description: "Create an online shopping platform",
    difficulty: "Advanced",
    icon: ShoppingCart,
    skills: ["React", "Payment APIs", "Database", "Authentication"],
    estimatedTime: "8-12 hours"
  }
];

const projectSteps = [
  {
    id: 1,
    title: "Project Setup & Planning",
    description: "Initialize your project structure and plan the architecture",
    status: "current",
    icon: Code2,
    tasks: ["Create project files", "Setup development environment", "Plan component structure"],
    tips: ["Start with a clear folder structure", "Choose the right tech stack", "Plan before coding"],
    commonMistakes: ["Jumping into coding without planning", "Not setting up proper file structure"]
  },
  {
    id: 2,
    title: "Build Core Features",
    description: "Implement the main functionality step by step",
    status: "upcoming",
    icon: Target,
    tasks: ["Create main components", "Implement core logic", "Add state management"],
    tips: ["Start with the simplest feature first", "Test each feature as you build", "Keep functions small and focused"],
    commonMistakes: ["Building everything at once", "Not testing incrementally"]
  },
  {
    id: 3,
    title: "User Interface & Design", 
    description: "Make your app beautiful and user-friendly",
    status: "upcoming",
    icon: Palette,
    tasks: ["Design responsive layouts", "Add interactive elements", "Improve user experience"],
    tips: ["Mobile-first design", "Keep it simple and intuitive", "Use consistent styling"],
    commonMistakes: ["Ignoring mobile responsiveness", "Overcomplicating the UI"]
  },
  {
    id: 4,
    title: "Data & Backend",
    description: "Add data persistence and backend functionality",
    status: "upcoming", 
    icon: Database,
    tasks: ["Setup database", "Create API endpoints", "Handle data validation"],
    tips: ["Start with simple local storage", "Plan your data structure", "Add validation early"],
    commonMistakes: ["Poor data structure design", "No input validation"]
  },
  {
    id: 5,
    title: "Testing & Deployment",
    description: "Test thoroughly and deploy your application",
    status: "upcoming",
    icon: Globe,
    tasks: ["Test all features", "Fix bugs", "Deploy to production"],
    tips: ["Test on different devices", "Use version control", "Have a deployment checklist"],
    commonMistakes: ["Not testing thoroughly", "Deploying without backup"]
  }
];

export const ProjectGuidance = ({ onProjectSelect }: ProjectGuidanceProps) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTemplates, setShowTemplates] = useState(!selectedProject);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-success" />;
      case "current": return <ArrowRight className="w-5 h-5 text-primary" />;
      default: return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 border-success/20";
      case "current": return "bg-primary/10 border-primary/20";
      default: return "bg-muted/30 border-border";
    }
  };

  const handleProjectSelect = (projectId: string, projectName: string) => {
    setSelectedProject(projectId);
    setShowTemplates(false);
    onProjectSelect?.(projectName);
  };

  const handleBackToTemplates = () => {
    setShowTemplates(true);
    setSelectedProject(null);
    onProjectSelect?.(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 p-4 h-full overflow-auto">
      {showTemplates ? (
        <>
          {/* Project Templates */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Choose Your Project
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Start your coding journey with guided project templates
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectTemplates.map((template) => (
                <Card key={template.id} className="border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleProjectSelect(template.id, template.name)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <template.icon className="w-6 h-6 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ⏱️ {template.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Current Project Header */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Active Project</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBackToTemplates}>
                  Change Project
                </Button>
              </div>
              <div className="mt-2">
                <p className="font-medium">{projectTemplates.find(p => p.id === selectedProject)?.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{((currentStep + 1) / projectSteps.length * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(currentStep + 1) / projectSteps.length * 100} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Step-by-Step Guide</CardTitle>
              <p className="text-sm text-muted-foreground">
                Follow these steps like a human mentor would guide you
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectSteps.map((step, index) => (
                <Card key={step.id} className={`transition-all ${
                  index === currentStep 
                    ? "border-primary/50 bg-primary/5" 
                    : index < currentStep 
                      ? "border-green-500/50 bg-green-50/50" 
                      : "border-border bg-muted/30"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {index < currentStep ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : index === currentStep ? (
                          <ArrowRight className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <step.icon className="w-4 h-4" />
                          <h3 className="font-semibold text-sm">{step.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {index + 1}/{projectSteps.length}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        
                        {index === currentStep && (
                          <>
                            <div className="space-y-2 mb-3">
                              <h4 className="text-xs font-medium text-foreground">✅ What to do:</h4>
                              {step.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="flex items-center gap-2 text-xs">
                                  <Circle className="w-2 h-2 text-primary fill-current" />
                                  <span>{task}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <h4 className="text-xs font-medium text-primary flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                💡 Pro Tips:
                              </h4>
                              {step.tips.map((tip, tipIndex) => (
                                <div key={tipIndex} className="text-xs text-muted-foreground pl-4">
                                  • {tip}
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <h4 className="text-xs font-medium text-destructive flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                ❌ Common Mistakes:
                              </h4>
                              {step.commonMistakes.map((mistake, mistakeIndex) => (
                                <div key={mistakeIndex} className="text-xs text-muted-foreground pl-4">
                                  • {mistake}
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                if (currentStep < projectSteps.length - 1) {
                                  setCurrentStep(currentStep + 1);
                                }
                              }}
                            >
                              {currentStep === projectSteps.length - 1 ? "Complete Project! 🎉" : "Mark Complete & Continue"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
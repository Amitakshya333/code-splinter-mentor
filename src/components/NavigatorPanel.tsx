import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  AlertTriangle,
  Compass
} from "lucide-react";

interface NavigatorPanelProps {
  currentProject?: string | null;
}

const projectSteps = [
  {
    id: 1,
    title: "Project Setup & Planning",
    description: "Initialize project and plan architecture",
    icon: Code2,
    tasks: ["Create project files", "Setup environment", "Plan components"],
    tips: ["Start with clear structure", "Choose right tech stack", "Plan before coding"],
    commonMistakes: ["No planning", "Poor file structure"]
  },
  {
    id: 2,
    title: "Build Core Features",
    description: "Implement main functionality step by step",
    icon: Target,
    tasks: ["Create components", "Implement logic", "Add state management"],
    tips: ["Start simple", "Test incrementally", "Keep functions small"],
    commonMistakes: ["Building everything at once", "No testing"]
  },
  {
    id: 3,
    title: "User Interface & Design", 
    description: "Make your app beautiful and user-friendly",
    icon: Palette,
    tasks: ["Design layouts", "Add interactions", "Improve UX"],
    tips: ["Mobile-first", "Keep it simple", "Consistent styling"],
    commonMistakes: ["Ignoring mobile", "Overcomplicating UI"]
  },
  {
    id: 4,
    title: "Data & Backend",
    description: "Add data persistence and backend",
    icon: Database,
    tasks: ["Setup database", "Create APIs", "Validate data"],
    tips: ["Start with local storage", "Plan data structure", "Validate early"],
    commonMistakes: ["Poor data design", "No validation"]
  },
  {
    id: 5,
    title: "Testing & Deployment",
    description: "Test thoroughly and deploy",
    icon: Globe,
    tasks: ["Test features", "Fix bugs", "Deploy"],
    tips: ["Test on devices", "Use version control", "Have checklist"],
    commonMistakes: ["Not testing", "No backup"]
  }
];

export const NavigatorPanel = ({ currentProject }: NavigatorPanelProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / projectSteps.length) * 100;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-navigator-light to-background border-l border-border">
      {/* Navigator Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-navigator-glow/10 to-navigator-glow/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-navigator-primary/10 rounded-lg">
            <Compass className="h-5 w-5 text-navigator-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Step-by-Step Guide</h3>
            <p className="text-xs text-muted-foreground">Your learning path</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-xs font-bold text-navigator-primary">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {projectSteps.length}</span>
            {currentProject && (
              <>
                <span>•</span>
                <span className="font-medium text-foreground">{currentProject}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {projectSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <Card 
                key={step.id} 
                className={`transition-all ${
                  isCurrent 
                    ? "border-navigator-primary bg-navigator-glow/5 shadow-md" 
                    : isCompleted 
                      ? "border-success/30 bg-success/5" 
                      : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : isCurrent ? (
                        <ArrowRight className="h-5 w-5 text-navigator-primary animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {/* Step Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <step.icon className="h-4 w-4 text-foreground" />
                        <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ml-auto ${
                            isCurrent ? "bg-navigator-primary/10 text-navigator-primary border-navigator-primary/30" : ""
                          }`}
                        >
                          {index + 1}/{projectSteps.length}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3">
                        {step.description}
                      </p>
                      
                      {/* Current Step Details */}
                      {isCurrent && (
                        <>
                          {/* Tasks */}
                          <div className="space-y-2 mb-3 bg-background/50 rounded-lg p-3">
                            <h5 className="text-xs font-bold text-foreground flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              What to do now:
                            </h5>
                            {step.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-center gap-2 text-xs">
                                <Circle className="h-2 w-2 text-navigator-primary fill-current shrink-0" />
                                <span className="text-foreground">{task}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Pro Tips */}
                          <div className="space-y-2 mb-3 bg-warning/5 rounded-lg p-3 border border-warning/20">
                            <h5 className="text-xs font-bold text-warning flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" />
                              Pro Tips:
                            </h5>
                            {step.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="text-xs text-muted-foreground pl-4">
                                • {tip}
                              </div>
                            ))}
                          </div>
                          
                          {/* Common Mistakes */}
                          <div className="space-y-2 mb-4 bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                            <h5 className="text-xs font-bold text-destructive flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Avoid These Mistakes:
                            </h5>
                            {step.commonMistakes.map((mistake, mistakeIndex) => (
                              <div key={mistakeIndex} className="text-xs text-muted-foreground pl-4">
                                • {mistake}
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            size="sm" 
                            className="w-full bg-navigator-primary hover:bg-navigator-secondary rounded-xl"
                            onClick={() => {
                              if (currentStep < projectSteps.length - 1) {
                                setCurrentStep(currentStep + 1);
                              }
                            }}
                          >
                            {currentStep === projectSteps.length - 1 
                              ? "Complete Project! 🎉" 
                              : "Mark Complete & Continue →"
                            }
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

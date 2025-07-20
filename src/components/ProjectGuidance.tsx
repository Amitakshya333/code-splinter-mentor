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
  Globe
} from "lucide-react";

const projectSteps = [
  {
    id: 1,
    title: "Project Setup",
    description: "Initialize your project structure and dependencies",
    status: "completed",
    icon: Code2,
    tasks: ["Create main files", "Setup environment", "Choose architecture"]
  },
  {
    id: 2,
    title: "Core Logic",
    description: "Implement the main functionality and algorithms",
    status: "current",
    icon: Target,
    tasks: ["Define data structures", "Write core functions", "Add error handling"]
  },
  {
    id: 3,
    title: "User Interface", 
    description: "Design and build the user experience",
    status: "upcoming",
    icon: Palette,
    tasks: ["Create layouts", "Add interactivity", "Style components"]
  },
  {
    id: 4,
    title: "Data Layer",
    description: "Set up data storage and management",
    status: "upcoming", 
    icon: Database,
    tasks: ["Design schema", "Setup database", "Create API endpoints"]
  },
  {
    id: 5,
    title: "Deployment",
    description: "Deploy your application to production",
    status: "upcoming",
    icon: Globe,
    tasks: ["Configure hosting", "Setup CI/CD", "Monitor performance"]
  }
];

const currentProject = {
  name: "Personal Task Manager",
  description: "A productivity app to help users organize and track their daily tasks",
  progress: 35,
  nextStep: "Implement task creation and editing functionality"
};

export const ProjectGuidance = () => {
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

  return (
    <div className="space-y-6 p-6">
      {/* Current Project Overview */}
      <Card className="bg-gradient-secondary border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Current Project
            </CardTitle>
            <Badge variant="secondary">In Progress</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{currentProject.name}</h3>
            <p className="text-muted-foreground">{currentProject.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Project Progress</span>
              <span>{currentProject.progress}%</span>
            </div>
            <Progress value={currentProject.progress} className="h-2" />
          </div>

          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Next Step</p>
                <p className="text-sm text-muted-foreground">{currentProject.nextStep}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Project Roadmap</CardTitle>
          <p className="text-muted-foreground">
            Follow this step-by-step guide to build your application
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-colors ${getStatusColor(step.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-5 h-5 text-muted-foreground" />
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge 
                        variant={step.status === "completed" ? "default" : "outline"}
                        className="text-xs"
                      >
                        Step {step.id}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {step.description}
                    </p>
                    
                    <div className="space-y-1">
                      {step.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 text-xs">
                          <Circle className="w-3 h-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {step.status === "current" && (
                    <Button 
                      size="sm" 
                      className="shrink-0"
                      onClick={() => {
                        // Mark current step as completed and move to next
                        const nextIndex = projectSteps.findIndex(s => s.id === step.id) + 1;
                        if (nextIndex < projectSteps.length) {
                          step.status = "completed";
                          projectSteps[nextIndex].status = "current";
                        }
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
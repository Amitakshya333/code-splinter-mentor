import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, Sparkles, Play, CheckCircle2, ArrowRight,
  Cloud, Server, Shield, Terminal, FileCode, Container,
  GitBranch, FileText, GitPullRequest, Database, Lock,
  BarChart3, Settings, Layers, Globe, Zap, Clock, AlertTriangle,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigatorWorkspaceProps {
  steps: NavigatorStep[];
  currentStep?: NavigatorStep;
  onAction: (action: string) => void;
  onStepClick: (stepIndex: number) => void;
  currentStepIndex: number;
}

const getIconForAction = (action: string) => {
  const iconMap: Record<string, any> = {
    'console': Cloud, 'dashboard': Server, 'launch': Play, 'instance': Server,
    'ami': FileCode, 'type': Settings, 'security': Shield, 'review': CheckCircle2,
    'terminal': Terminal, 'docker': Container, 'pull': Container, 'run': Play,
    'build': Layers, 'compose': FileCode, 'git': GitBranch, 'repo': FileText,
    'branch': GitBranch, 'commit': CheckCircle2, 'push': Zap, 'pr': GitPullRequest,
    'merge': GitPullRequest, 'vpc': Globe, 'subnet': Layers, 'route': Globe,
    'database': Database, 'rds': Database, 'dynamo': Database, 's3': Cloud,
    'bucket': Cloud, 'iam': Lock, 'policy': Shield, 'role': Lock,
    'cloudwatch': BarChart3, 'monitor': BarChart3, 'log': FileText, 'alert': Zap,
    'pipeline': Layers, 'deploy': Play, 'jenkins': Settings, 'action': Zap,
    'kubernetes': Container, 'helm': Layers, 'grafana': BarChart3, 'prometheus': BarChart3,
  };
  
  const key = Object.keys(iconMap).find(k => action.toLowerCase().includes(k));
  return iconMap[key || ''] || Play;
};

export const NavigatorWorkspace = ({ 
  steps,
  currentStep, 
  onAction,
  onStepClick,
  currentStepIndex
}: NavigatorWorkspaceProps) => {

  const handleStepAction = (step: NavigatorStep) => {
    onAction(step.action);
  };

  const StepCard = ({ 
    step,
    index,
    isActive,
    isCompleted,
    isPrevious
  }: { 
    step: NavigatorStep;
    index: number;
    isActive: boolean;
    isCompleted: boolean;
    isPrevious: boolean;
  }) => {
    const Icon = getIconForAction(step.action);
    const isUpcoming = !isActive && !isCompleted && !isPrevious;
    
    return (
      <div
        className={cn(
          "step-card group p-5 animate-fade-in",
          isActive && "step-card-active",
          isCompleted && "step-card-complete",
          isUpcoming && "step-card-disabled"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            isActive && "bg-primary/15 ring-2 ring-primary/20",
            isCompleted && "bg-success/10",
            isUpcoming && "bg-muted"
          )}>
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <Icon className={cn(
                "w-6 h-6 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground/50"
              )} />
            )}
            
            {/* Step number badge */}
            <div className={cn(
              "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold",
              isActive && "bg-primary text-primary-foreground",
              isCompleted && "bg-success text-success-foreground",
              isUpcoming && "bg-muted-foreground/20 text-muted-foreground/50"
            )}>
              {index + 1}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className={cn(
                "font-semibold text-base transition-colors",
                isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground/60"
              )}>
                {step.title}
              </h3>
              
              {/* Time estimate */}
              {isActive && (
                <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  ~2 min
                </span>
              )}
            </div>
            
            <p className={cn(
              "text-sm leading-relaxed mb-3",
              isActive ? "text-muted-foreground" : "text-muted-foreground/50"
            )}>
              {step.description}
            </p>

            {/* Tips and warnings - only for active step */}
            {isActive && (
              <div className="space-y-2 mb-4">
                {step.tip && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-info-muted border border-info/20">
                    <Lightbulb className="w-4 h-4 text-info shrink-0 mt-0.5" />
                    <p className="text-xs text-info">{step.tip}</p>
                  </div>
                )}
                {step.warning && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-warning-muted border border-warning/20">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-xs text-warning-foreground">{step.warning}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action button - only for active step */}
            {isActive && (
              <Button 
                onClick={() => handleStepAction(step)}
                className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Complete Step
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {/* Completed indicator */}
            {isCompleted && (
              <div className="flex items-center gap-2 text-success text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!steps.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No steps available</h3>
        <p className="text-sm text-muted-foreground">Select a module to begin your journey</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-foreground">Workflow Steps</h2>
        <span className="text-sm text-muted-foreground">
          {steps.filter(s => s.completed).length} of {steps.length} complete
        </span>
      </div>

      {/* Steps list */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <StepCard 
            key={step.id}
            step={step}
            index={index}
            isActive={step.current}
            isCompleted={step.completed}
            isPrevious={index < currentStepIndex}
          />
        ))}
      </div>
    </div>
  );
};

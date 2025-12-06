import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, Sparkles, Play, CheckCircle2,
  Cloud, Server, Shield, Terminal, FileCode, Container,
  GitBranch, FileText, GitPullRequest, Database, Lock,
  BarChart3, Settings, Layers, Globe, Zap
} from "lucide-react";

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

  const handleStepClick = (index: number, step: NavigatorStep) => {
    // Only allow clicking on current step to complete it
    if (index === currentStepIndex) {
      onAction(step.action);
    } else if (index > currentStepIndex) {
      // Can't skip ahead
      return;
    }
    // Clicking on completed steps does nothing
  };

  const ActionCard = ({ 
    step,
    index,
    isActive,
    isCompleted
  }: { 
    step: NavigatorStep;
    index: number;
    isActive: boolean;
    isCompleted: boolean;
  }) => {
    const Icon = getIconForAction(step.action);
    const isClickable = isActive;
    
    return (
      <button
        onClick={() => handleStepClick(index, step)}
        disabled={!isClickable && !isCompleted}
        className={cn(
          "group relative w-full p-5 rounded-2xl text-left transition-all duration-300",
          "bg-card border",
          isActive 
            ? "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/30 cursor-pointer hover:shadow-xl" 
            : isCompleted
              ? "border-green-500/30 bg-green-500/5 cursor-default"
              : "border-border/30 opacity-60 cursor-not-allowed"
        )}
      >
        {isActive && (
          <div className="absolute -top-2.5 -right-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1.5 animate-pulse shadow-lg">
            <Sparkles className="w-3 h-3" />
            Click here
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            isActive ? "bg-primary/15" : isCompleted ? "bg-green-500/10" : "bg-secondary/50"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground/50"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isActive ? "bg-primary/15 text-primary" : isCompleted ? "bg-green-500/10 text-green-600" : "bg-secondary/50 text-muted-foreground/50"
              )}>
                Step {index + 1}
              </span>
            </div>
            <h3 className={cn(
              "font-semibold mb-1 flex items-center gap-2",
              isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground/70"
            )}>
              {step.title}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-primary animate-pulse" />
              )}
            </h3>
            <p className={cn(
              "text-sm line-clamp-2",
              isActive ? "text-muted-foreground" : "text-muted-foreground/60"
            )}>{step.description}</p>
            
            {isActive && step.tip && (
              <p className="text-xs text-primary/80 mt-2 flex items-center gap-1">
                💡 {step.tip}
              </p>
            )}
            {isActive && step.warning && (
              <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                ⚠️ {step.warning}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Select a module to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Click on the highlighted step to progress through the workflow
      </p>
      <div className="grid gap-3">
        {steps.map((step, index) => (
          <ActionCard 
            key={step.id}
            step={step}
            index={index}
            isActive={step.current}
            isCompleted={step.completed}
          />
        ))}
      </div>
    </div>
  );
};

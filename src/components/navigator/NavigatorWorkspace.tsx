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
    
    return (
      <button
        onClick={() => {
          onStepClick(index);
          onAction(step.action);
        }}
        className={cn(
          "group relative w-full p-5 rounded-2xl text-left transition-all duration-300",
          "bg-card border hover:shadow-lg",
          isActive 
            ? "border-primary/30 shadow-lg shadow-primary/10 ring-2 ring-primary/20" 
            : isCompleted
              ? "border-green-500/30 bg-green-500/5"
              : "border-border/50 hover:border-border"
        )}
      >
        {isActive && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Current
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
            isActive ? "bg-primary/10" : isCompleted ? "bg-green-500/10" : "bg-secondary"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-colors",
              isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              )}>
                Step {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              {step.title}
              <ChevronRight className={cn(
                "w-4 h-4 transition-all",
                isActive ? "text-primary translate-x-0" : "text-muted-foreground -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )} />
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{step.description}</p>
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
        Follow these steps to complete the workflow
      </p>
      <div className="grid gap-3">
        {steps.map((step, index) => (
          <ActionCard 
            key={step.id}
            step={step}
            index={index}
            isActive={index === currentStepIndex}
            isCompleted={index < currentStepIndex}
          />
        ))}
      </div>
    </div>
  );
};

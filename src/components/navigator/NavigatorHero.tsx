import { 
  Cloud, Container, GitBranch, CheckCircle2, Shield, 
  BarChart3, Database, Server, Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigatorHeroProps {
  goal: string;
  platform: string;
  progress: number;
  completedCount: number;
  totalSteps: number;
}

export const NavigatorHero = ({ 
  goal, 
  platform, 
  progress, 
  completedCount, 
  totalSteps 
}: NavigatorHeroProps) => {
  const icons: Record<string, any> = {
    aws: Cloud,
    docker: Container,
    github: GitBranch,
    containers: Container,
    git: GitBranch,
    devops: Settings,
    monitoring: BarChart3,
    security: Shield,
    databases: Database,
    iac: Server,
  };

  const colors: Record<string, string> = {
    aws: "text-orange-500",
    docker: "text-blue-500",
    github: "text-foreground",
    containers: "text-blue-500",
    git: "text-orange-500",
    devops: "text-purple-500",
    monitoring: "text-green-500",
    security: "text-red-500",
    databases: "text-cyan-500",
    iac: "text-amber-500",
  };

  const Icon = icons[platform] || Cloud;
  const iconColor = colors[platform] || "text-primary";
  const isComplete = completedCount === totalSteps && totalSteps > 0;

  return (
    <div className="text-center mb-12">
      {/* Icon */}
      <div className={cn(
        "w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-500",
        isComplete 
          ? "bg-gradient-to-br from-green-500/20 to-green-500/10" 
          : "bg-gradient-to-br from-primary/10 to-primary/5"
      )}>
        {isComplete ? (
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        ) : (
          <Icon className={cn("w-8 h-8 transition-colors", iconColor)} />
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-2">
        {isComplete ? "Goal Achieved!" : goal}
      </h1>
      
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        {isComplete 
          ? "Congratulations! You've completed all the steps."
          : "Follow the steps below to complete this workflow."
        }
      </p>

      {/* Progress Indicator */}
      {totalSteps > 0 && (
        <div className="max-w-xs mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{completedCount} / {totalSteps}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isComplete ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

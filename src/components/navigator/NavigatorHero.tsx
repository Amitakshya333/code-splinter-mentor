import { Cloud, Container, Github, CheckCircle2 } from "lucide-react";
import { Platform } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorHeroProps {
  goal: string;
  platform: Platform;
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
  const icons = {
    aws: Cloud,
    docker: Container,
    github: Github,
  };

  const Icon = icons[platform];
  const isComplete = completedCount === totalSteps;

  return (
    <div className="text-center mb-16">
      {/* Icon */}
      <div className={cn(
        "w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-500",
        isComplete 
          ? "bg-gradient-to-br from-success/20 to-success/10" 
          : "bg-gradient-to-br from-primary/10 to-primary/5"
      )}>
        {isComplete ? (
          <CheckCircle2 className="w-10 h-10 text-success" />
        ) : (
          <Icon className={cn(
            "w-10 h-10 transition-colors",
            platform === 'aws' && "text-orange-500",
            platform === 'docker' && "text-blue-500",
            platform === 'github' && "text-foreground"
          )} />
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight mb-3">
        {isComplete ? "Goal Achieved!" : goal}
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        {isComplete 
          ? "Congratulations! You've completed all the steps."
          : "Follow the steps below. Click on highlighted elements to progress."
        }
      </p>

      {/* Progress Indicator */}
      <div className="max-w-xs mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">{completedCount} of {totalSteps}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              isComplete ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

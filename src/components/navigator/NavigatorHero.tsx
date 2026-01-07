import { useMemo } from "react";
import { 
  Cloud, Container, GitBranch, CheckCircle2, Shield, 
  BarChart3, Database, Server, Settings, Clock, Zap, 
  ChevronRight, Sparkles, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavigatorHeroProps {
  goal: string;
  platform: string;
  progress: number;
  completedCount: number;
  totalSteps: number;
  estimatedTime?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  onContinue?: () => void;
}

// Animated Progress Ring Component
const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  isComplete = false 
}: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  isComplete?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full blur-xl transition-opacity duration-500",
          isComplete ? "bg-success/30" : "bg-primary/20",
          progress > 0 ? "opacity-100" : "opacity-0"
        )}
      />
      
      <svg 
        className="progress-ring" 
        width={size} 
        height={size}
      >
        {/* Background circle */}
        <circle
          className="progress-ring-bg"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            "progress-ring-circle",
            isComplete ? "progress-ring-complete" : "progress-ring-fill"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <CheckCircle2 className="w-10 h-10 text-success animate-scale-in" />
        ) : (
          <div className="text-center">
            <span className="text-2xl font-semibold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const NavigatorHero = ({ 
  goal, 
  platform, 
  progress, 
  completedCount, 
  totalSteps,
  estimatedTime = 15,
  difficulty = "beginner",
  onContinue
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

  const platformColors: Record<string, { bg: string; text: string; accent: string }> = {
    aws: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    docker: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    github: { bg: "from-foreground/8 to-foreground/4", text: "text-foreground", accent: "bg-foreground" },
    containers: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    git: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    devops: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    monitoring: { bg: "from-success/8 to-success/4", text: "text-success", accent: "bg-success" },
    security: { bg: "from-destructive/8 to-destructive/4", text: "text-destructive", accent: "bg-destructive" },
    databases: { bg: "from-primary/8 to-primary/4", text: "text-primary", accent: "bg-primary" },
    iac: { bg: "from-warning/8 to-warning/4", text: "text-warning", accent: "bg-warning" },
  };

  const Icon = icons[platform] || Cloud;
  const colors = platformColors[platform] || platformColors.aws;
  const isComplete = completedCount === totalSteps && totalSteps > 0;
  const isStarted = completedCount > 0;

  const difficultyConfig = {
    beginner: { label: "Beginner", color: "text-success bg-success-muted" },
    intermediate: { label: "Intermediate", color: "text-warning bg-warning-muted" },
    advanced: { label: "Advanced", color: "text-destructive bg-destructive/10" },
  };

  return (
    <div className="relative mb-8">
      {/* Main card */}
      <div className="relative bg-card rounded-xl border shadow-sm overflow-hidden">
        {/* Subtle header accent */}
        <div className={cn("h-1 w-full", colors.accent)} />
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Left: Progress Ring */}
            <div className="shrink-0">
              <ProgressRing 
                progress={progress} 
                isComplete={isComplete}
                size={100}
                strokeWidth={8}
              />
            </div>

            {/* Center: Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Platform badge */}
              <div className="inline-flex items-center gap-2 mb-2">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  colors.bg
                )}>
                  <Icon className={cn("w-3.5 h-3.5", colors.text)} />
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  difficultyConfig[difficulty].color
                )}>
                  {difficultyConfig[difficulty].label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-1.5">
                {isComplete ? (
                  <span className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Goal Achieved!
                  </span>
                ) : goal}
              </h1>
              
              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4 max-w-lg">
                {isComplete 
                  ? "Congratulations! You've mastered this workflow. Take a quiz to test your knowledge or explore more modules."
                  : isStarted
                    ? "You're making great progress. Continue where you left off."
                    : "Follow the guided steps below to master this workflow."
                }
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{completedCount} / {totalSteps} steps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>~{estimatedTime} min</span>
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="shrink-0">
              {!isComplete && totalSteps > 0 && (
                <Button 
                  size="lg" 
                  className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  onClick={onContinue}
                >
                  {isStarted ? (
                    <>
                      Continue Journey
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Start Journey
                    </>
                  )}
                </Button>
              )}
              {isComplete && (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Take Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

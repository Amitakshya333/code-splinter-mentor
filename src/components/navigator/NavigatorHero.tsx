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
    aws: { bg: "from-orange-500/10 to-orange-500/5", text: "text-orange-500", accent: "bg-orange-500" },
    docker: { bg: "from-blue-500/10 to-blue-500/5", text: "text-blue-500", accent: "bg-blue-500" },
    github: { bg: "from-foreground/10 to-foreground/5", text: "text-foreground", accent: "bg-foreground" },
    containers: { bg: "from-blue-500/10 to-blue-500/5", text: "text-blue-500", accent: "bg-blue-500" },
    git: { bg: "from-orange-600/10 to-orange-600/5", text: "text-orange-600", accent: "bg-orange-600" },
    devops: { bg: "from-purple-500/10 to-purple-500/5", text: "text-purple-500", accent: "bg-purple-500" },
    monitoring: { bg: "from-green-500/10 to-green-500/5", text: "text-green-500", accent: "bg-green-500" },
    security: { bg: "from-red-500/10 to-red-500/5", text: "text-red-500", accent: "bg-red-500" },
    databases: { bg: "from-cyan-500/10 to-cyan-500/5", text: "text-cyan-500", accent: "bg-cyan-500" },
    iac: { bg: "from-amber-500/10 to-amber-500/5", text: "text-amber-500", accent: "bg-amber-500" },
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
    <div className="relative mb-12">
      {/* Background glow */}
      <div className="hero-glow absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" />
      
      {/* Main card */}
      <div className="relative bg-card rounded-2xl border shadow-card overflow-hidden">
        {/* Gradient header strip */}
        <div className={cn("h-1.5 w-full bg-gradient-to-r", colors.bg.replace("from-", "from-").replace("/10", "").replace("/5", "/80"))} />
        
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Progress Ring */}
            <div className="shrink-0">
              <ProgressRing 
                progress={progress} 
                isComplete={isComplete}
                size={140}
                strokeWidth={10}
              />
            </div>

            {/* Center: Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Platform badge */}
              <div className="inline-flex items-center gap-2 mb-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  colors.bg
                )}>
                  <Icon className={cn("w-4 h-4", colors.text)} />
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  difficultyConfig[difficulty].color
                )}>
                  {difficultyConfig[difficulty].label}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-2">
                {isComplete ? (
                  <span className="flex items-center gap-2 justify-center lg:justify-start">
                    <Sparkles className="w-6 h-6 text-warning animate-pulse" />
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

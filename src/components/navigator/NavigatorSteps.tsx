import { Check, ChevronRight, MapPin } from "lucide-react";
import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorStepsProps {
  steps: NavigatorStep[];
  currentStep?: NavigatorStep;
  onStepClick?: (index: number) => void;
}

export const NavigatorSteps = ({ steps, currentStep, onStepClick }: NavigatorStepsProps) => {
  if (steps.length === 0) return null;
  
  const currentIndex = steps.findIndex(s => s.current);
  const completedCount = steps.filter(s => s.completed).length;
  
  return (
    <div className="mb-8">
      {/* Progress bar header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{steps.length} steps
        </span>
      </div>

      {/* Main progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-route-complete to-route-active rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
        {/* Shimmer effect on progress */}
        {completedCount < steps.length && completedCount > 0 && (
          <div 
            className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{ left: `${(completedCount / steps.length) * 100 - 5}%` }}
          />
        )}
      </div>

      {/* Waypoint indicators */}
      <div className="flex items-center justify-between px-1">
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = step.current;
          const isAccessible = index <= currentIndex || isCompleted;
          
          return (
            <button
              key={step.id}
              onClick={() => isAccessible && onStepClick?.(index)}
              disabled={!isAccessible}
              className={cn(
                "group relative flex flex-col items-center transition-all duration-200",
                isAccessible ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              {/* Waypoint dot */}
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isCompleted && "bg-route-complete scale-100",
                  isCurrent && "bg-waypoint-current scale-125 ring-4 ring-waypoint-current/20",
                  !isCompleted && !isCurrent && isAccessible && "bg-route-upcoming hover:scale-110",
                  !isAccessible && "bg-muted scale-75"
                )}
              />
              
              {/* Current step indicator */}
              {isCurrent && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="mt-2 px-2 py-1 bg-foreground text-background text-2xs font-medium rounded whitespace-nowrap">
                    {step.title}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current step indicator card */}
      {currentStep && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-primary font-medium mb-0.5">Current Step</p>
              <p className="font-medium text-foreground truncate">{currentStep.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};

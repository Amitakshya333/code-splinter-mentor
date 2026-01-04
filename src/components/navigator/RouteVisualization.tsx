import { useMemo } from "react";
import { Check, MapPin, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  completed: boolean;
}

interface RouteVisualizationProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export const RouteVisualization = ({ 
  steps, 
  currentStepIndex, 
  onStepClick 
}: RouteVisualizationProps) => {
  if (steps.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden">
      {/* Scrollable container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Route container */}
        <div className="overflow-x-auto pb-4 px-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <div className="flex items-center min-w-max py-2">
            {steps.map((step, index) => {
              const isCompleted = step.completed;
              const isCurrent = index === currentStepIndex;
              const isAccessible = index <= currentStepIndex || step.completed;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Waypoint */}
                  <button
                    onClick={() => isAccessible && onStepClick(index)}
                    disabled={!isAccessible}
                    className={cn(
                      "relative group flex flex-col items-center transition-all duration-300",
                      isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                    )}
                  >
                    {/* Waypoint marker */}
                    <div className="relative">
                      {/* Pulse ring for current step */}
                      {isCurrent && (
                        <div className="absolute inset-0 -m-2">
                          <div className="w-full h-full rounded-full bg-waypoint-current/30 animate-pulse-ring" />
                        </div>
                      )}
                      
                      {/* Main waypoint circle */}
                      <div
                        className={cn(
                          "relative z-10 flex items-center justify-center rounded-full transition-all duration-300",
                          // Size
                          isCurrent ? "w-10 h-10" : "w-8 h-8",
                          // States
                          isCompleted && "bg-route-complete border-2 border-route-complete shadow-success-glow",
                          isCurrent && !isCompleted && "bg-waypoint-current/15 border-3 border-waypoint-current shadow-warning-glow",
                          !isCompleted && !isCurrent && isAccessible && "bg-background border-2 border-route-upcoming hover:border-primary/50 hover:scale-110",
                          !isAccessible && "bg-muted border-2 border-route-upcoming/50 opacity-50"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-success-foreground" />
                        ) : isCurrent ? (
                          <MapPin className="w-4 h-4 text-waypoint-current" />
                        ) : isAccessible ? (
                          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                            {index + 1}
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-muted-foreground/50" />
                        )}
                      </div>
                    </div>

                    {/* Step label */}
                    <div className={cn(
                      "mt-2 max-w-[100px] text-center transition-all duration-200",
                      isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      <p className={cn(
                        "text-xs font-medium truncate",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                    </div>
                  </button>

                  {/* Connecting line */}
                  {!isLast && (
                    <div className="relative mx-1">
                      {/* Background line */}
                      <div className="w-12 sm:w-16 h-0.5 bg-route-line rounded-full" />
                      
                      {/* Progress overlay */}
                      <div 
                        className={cn(
                          "absolute top-0 left-0 h-0.5 rounded-full transition-all duration-500",
                          isCompleted ? "bg-route-complete w-full" : "w-0"
                        )}
                      />
                      
                      {/* Active segment animation */}
                      {isCurrent && (
                        <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-route-complete via-waypoint-current to-transparent animate-shimmer" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between px-4 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-route-complete" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-waypoint-current" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
};

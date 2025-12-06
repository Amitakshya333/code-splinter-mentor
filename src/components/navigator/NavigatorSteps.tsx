import { Check, ChevronRight } from "lucide-react";
import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorStepsProps {
  steps: NavigatorStep[];
  currentStep?: NavigatorStep;
}

export const NavigatorSteps = ({ steps, currentStep }: NavigatorStepsProps) => {
  if (steps.length === 0) return null;
  
  // Show compact progress on desktop (just dots), detailed on mobile
  return (
    <div className="mb-8">
      {/* Compact dots on larger screens */}
      <div className="hidden sm:flex items-center justify-center gap-1.5 flex-wrap">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                step.completed && "bg-green-500",
                step.current && "bg-primary ring-4 ring-primary/20 scale-125",
                !step.completed && !step.current && "bg-muted-foreground/20"
              )}
              title={`Step ${index + 1}: ${step.title}`}
            />
            {index < steps.length - 1 && (
              <div className={cn(
                "w-4 h-0.5 mx-0.5",
                step.completed ? "bg-green-500/50" : "bg-muted-foreground/10"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Current step highlight on desktop */}
      {currentStep && (
        <div className="hidden sm:block text-center mt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
              {steps.findIndex(s => s.current) + 1}
            </span>
            {currentStep.title}
          </span>
        </div>
      )}

      {/* Vertical list on mobile */}
      <div className="sm:hidden space-y-2">
        {steps.slice(0, 5).map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
              step.completed && "bg-green-500/5",
              step.current && "bg-primary/5 ring-1 ring-primary/20",
              !step.completed && !step.current && "opacity-40"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
              step.completed && "bg-green-500 text-white",
              step.current && "bg-primary text-primary-foreground",
              !step.completed && !step.current && "bg-secondary text-muted-foreground"
            )}>
              {step.completed ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <p className={cn(
              "font-medium text-sm truncate",
              step.current ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.title}
            </p>
          </div>
        ))}
        {steps.length > 5 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            +{steps.length - 5} more steps
          </p>
        )}
      </div>
    </div>
  );
};

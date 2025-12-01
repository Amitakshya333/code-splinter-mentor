import { Check, Circle, ChevronRight } from "lucide-react";
import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorStepsProps {
  steps: NavigatorStep[];
  currentStep?: NavigatorStep;
}

export const NavigatorSteps = ({ steps, currentStep }: NavigatorStepsProps) => {
  return (
    <div className="mb-12">
      {/* Steps as horizontal pills on larger screens */}
      <div className="hidden sm:flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                step.completed && "bg-success/10 text-success",
                step.current && "bg-primary/10 text-primary ring-2 ring-primary/20",
                !step.completed && !step.current && "bg-secondary text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                step.completed && "bg-success text-success-foreground",
                step.current && "bg-primary text-primary-foreground",
                !step.completed && !step.current && "bg-muted-foreground/20 text-muted-foreground"
              )}>
                {step.completed ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-border mx-1 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Vertical list on mobile */}
      <div className="sm:hidden space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
              step.completed && "bg-success/5",
              step.current && "bg-primary/5 ring-1 ring-primary/20",
              !step.completed && !step.current && "opacity-50"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              step.completed && "bg-success text-success-foreground",
              step.current && "bg-primary text-primary-foreground",
              !step.completed && !step.current && "bg-secondary text-muted-foreground"
            )}>
              {step.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div>
              <p className={cn(
                "font-medium text-sm",
                step.current ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </p>
              {step.current && (
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, AlertTriangle, ChevronRight, Target, Flag } from "lucide-react";
import { NavigatorStep } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorGuideProps {
  steps: NavigatorStep[];
  goal: string;
}

export const NavigatorGuide = ({ steps, goal }: NavigatorGuideProps) => {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-fuchsia-400" />
          <h3 className="font-semibold text-white">Navigator Guide</h3>
        </div>
        
        {/* Goal */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30">
          <p className="text-xs text-fuchsia-300 mb-1">Current Goal</p>
          <p className="text-sm font-medium text-white">{goal}</p>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Progress</span>
            <span className="text-xs font-medium text-white">{completedCount}/{steps.length}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300",
                step.current && "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border-violet-500/40 shadow-lg shadow-violet-500/10",
                step.completed && "bg-emerald-500/10 border-emerald-500/20",
                !step.current && !step.completed && "bg-white/5 border-white/10 opacity-60"
              )}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute left-7 top-14 w-0.5 h-6 -mb-2",
                  step.completed ? "bg-emerald-500/50" : "bg-white/10"
                )} />
              )}

              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  step.completed && "bg-emerald-500",
                  step.current && "bg-violet-500 ring-4 ring-violet-500/30",
                  !step.current && !step.completed && "bg-white/20"
                )}>
                  {step.completed ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : step.current ? (
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Circle className="w-3 h-3 text-white/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-medium text-sm",
                      step.current && "text-white",
                      step.completed && "text-emerald-300",
                      !step.current && !step.completed && "text-white/50"
                    )}>
                      {step.title}
                    </h4>
                    {step.current && (
                      <Badge className="bg-violet-500/30 text-violet-200 text-[10px] px-1.5">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    step.current ? "text-white/70" : "text-white/40"
                  )}>
                    {step.description}
                  </p>

                  {/* Warning if any */}
                  {step.warning && (
                    <div className="flex items-center gap-1.5 mt-2 text-orange-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-xs">{step.warning}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completion Card */}
        {completedCount === steps.length && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center">
            <Flag className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white">Goal Achieved!</h4>
            <p className="text-xs text-white/60 mt-1">You've completed all steps successfully.</p>
          </div>
        )}
      </ScrollArea>

      {/* Tooltip Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-white/50">
            💡 <span className="text-white/70">Tip:</span> Click on highlighted elements in the simulation to progress through steps.
          </p>
        </div>
      </div>
    </div>
  );
};

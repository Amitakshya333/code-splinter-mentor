import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigatorBreadcrumbProps {
  category?: string;
  module?: string;
  currentStep?: number;
  totalSteps?: number;
  onCategoryClick?: () => void;
  onModuleClick?: () => void;
}

export const NavigatorBreadcrumb = ({
  category,
  module,
  currentStep,
  totalSteps,
  onCategoryClick,
  onModuleClick,
}: NavigatorBreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-hide">
      <button
        onClick={onCategoryClick}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Navigator</span>
      </button>
      
      {category && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <button
            onClick={onCategoryClick}
            className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[100px] sm:max-w-none"
          >
            {category}
          </button>
        </>
      )}
      
      {module && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <button
            onClick={onModuleClick}
            className="text-foreground font-medium truncate max-w-[120px] sm:max-w-none"
          >
            {module}
          </button>
        </>
      )}
      
      {currentStep !== undefined && totalSteps !== undefined && totalSteps > 0 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full shrink-0">
            Step {currentStep + 1}/{totalSteps}
          </span>
        </>
      )}
    </nav>
  );
};

import { cn } from "@/lib/utils";
import { NavigatorCategory, NavigatorModule } from "@/data/navigatorModules";
import { 
  Cloud, Workflow, Container, Activity, Shield, GitBranch, 
  Database, FileCode, ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface NavigatorCategoryNavProps {
  categories: NavigatorCategory[];
  currentCategory?: NavigatorCategory;
  currentModule?: NavigatorModule;
  onCategoryChange: (categoryId: string) => void;
  onModuleChange: (moduleId: string) => void;
}

const iconMap: Record<string, any> = {
  Cloud, Workflow, Container, Activity, Shield, GitBranch, Database, FileCode
};

export const NavigatorCategoryNav = ({
  categories,
  currentCategory,
  currentModule,
  onCategoryChange,
  onModuleChange,
}: NavigatorCategoryNavProps) => {
  const Icon = currentCategory ? iconMap[currentCategory.icon] || Cloud : Cloud;

  // Get all modules from current category
  const allModules = currentCategory?.subCategories.flatMap(sc => sc.modules) || [];

  return (
    <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6">
        {/* Category Dropdown */}
        <div className="flex items-center gap-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full">
                <Icon className="w-4 h-4" />
                {currentCategory?.name || 'Select Category'}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover">
              {categories.map((cat) => {
                const CatIcon = iconMap[cat.icon] || Cloud;
                return (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={cn(
                      "gap-2 cursor-pointer",
                      currentCategory?.id === cat.id && "bg-accent"
                    )}
                  >
                    <CatIcon className="w-4 h-4" />
                    {cat.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {currentCategory && (
            <span className="text-sm text-muted-foreground">
              {currentCategory.subCategories.length} sections • {allModules.length} modules
            </span>
          )}
        </div>

        {/* Module Ribbon */}
        {allModules.length > 0 && (
          <ScrollArea className="pb-3">
            <div className="flex gap-2">
              {allModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => onModuleChange(mod.id)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all",
                    currentModule?.id === mod.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {mod.name}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

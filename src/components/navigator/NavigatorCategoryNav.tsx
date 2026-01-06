import { cn } from "@/lib/utils";
import { NavigatorCategory, NavigatorModule } from "@/data/navigatorModules";
import { 
  Cloud, Workflow, Container, Activity, Shield, GitBranch, 
  Database, FileCode, ChevronDown, Check, Sparkles, TrendingUp, Zap
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

// Define which modules are "New" or "Popular" (hardcoded for now)
const MODULE_BADGES: Record<string, 'new' | 'popular' | undefined> = {
  'ec2-management': 'popular',
  'lambda-functions': 'popular',
  's3-storage': 'popular',
  'ecs-fargate': 'new',
  'eks-kubernetes': 'new',
  'docker-basics': 'popular',
  'kubernetes-basics': 'popular',
  'terraform-basics': 'new',
  'github-actions': 'new',
  'cloudwatch-monitoring': 'new',
};

export const NavigatorCategoryNav = ({
  categories,
  currentCategory,
  currentModule,
  onCategoryChange,
  onModuleChange,
}: NavigatorCategoryNavProps) => {
  const Icon = currentCategory ? iconMap[currentCategory.icon] || Cloud : Cloud;
  const allModules = currentCategory?.subCategories.flatMap(sc => sc.modules) || [];

  const getModuleBadge = (moduleId: string) => {
    return MODULE_BADGES[moduleId];
  };

  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Category Header */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-xl h-10 px-4 bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{currentCategory?.name || 'Select Category'}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                {categories.map((cat) => {
                  const CatIcon = iconMap[cat.icon] || Cloud;
                  const isSelected = currentCategory?.id === cat.id;
                  return (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={cn(
                        "gap-3 cursor-pointer rounded-lg py-2.5 px-3",
                        isSelected && "bg-primary/10"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-primary/20" : "bg-muted"
                      )}>
                        <CatIcon className={cn(
                          "w-4 h-4",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          isSelected && "text-primary"
                        )}>{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.subCategories.flatMap(sc => sc.modules).length} modules
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {currentCategory && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span>{allModules.length} modules available</span>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-info-muted rounded-full">
              <Sparkles className="w-3 h-3 text-info" />
              <span className="text-xs font-medium text-info">New content weekly</span>
            </div>
          </div>
        </div>

        {/* Module Pills with Badges */}
        {allModules.length > 0 && (
          <div className="pb-3">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-1">
                {allModules.map((mod, index) => {
                  const isSelected = currentModule?.id === mod.id;
                  const badge = getModuleBadge(mod.id);
                  
                  return (
                    <button
                      key={mod.id}
                      onClick={() => onModuleChange(mod.id)}
                      className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200",
                        "border shadow-sm group",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                          : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:shadow-md"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <span className="flex items-center gap-2">
                        {mod.name}
                        {badge === 'new' && (
                          <span className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-semibold rounded-full",
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-success/10 text-success"
                          )}>
                            <Zap className="w-2.5 h-2.5" />
                            New
                          </span>
                        )}
                        {badge === 'popular' && (
                          <span className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-semibold rounded-full",
                            isSelected
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-warning/10 text-warning"
                          )}>
                            <TrendingUp className="w-2.5 h-2.5" />
                            Popular
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full ring-2 ring-background" />
                      )}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

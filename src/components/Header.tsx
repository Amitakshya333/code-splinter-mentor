import { Button } from "@/components/ui/button";
import { Play, Square, Settings, HelpCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 bg-card/60 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* macOS-style traffic lights */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
        </div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight ml-2">
          CodeSplinter
        </h1>
      </div>

      {/* Central controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="gap-2 shadow-subtle hover:shadow-medium transition-all duration-200 bg-primary hover:bg-primary/90"
        >
          <Play className="w-4 h-4" />
          Run Code
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-card/50 hover:bg-card border-border/50 hover:border-border shadow-subtle hover:shadow-medium transition-all duration-200"
        >
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-muted/50 transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-muted/50 transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
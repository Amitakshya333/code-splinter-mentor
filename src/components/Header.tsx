import { Button } from "@/components/ui/button";
import { Play, Square, Settings, HelpCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* macOS-style traffic lights */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-warning"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
        </div>
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent ml-4">
          CodeSplinter
        </h1>
      </div>

      {/* Central controls */}
      <div className="flex items-center gap-3">
        <Button variant="success" size="sm" className="gap-2">
          <Play className="w-4 h-4" />
          Run Code
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, MessageCircle, Code2 } from "lucide-react";
import { Platform } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NavigatorHeaderProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
  onMentorToggle: () => void;
  showMentor: boolean;
}

export const NavigatorHeader = ({ 
  platform, 
  onPlatformChange, 
  onMentorToggle,
  showMentor 
}: NavigatorHeaderProps) => {
  const platforms: { id: Platform; label: string }[] = [
    { id: 'aws', label: 'AWS' },
    { id: 'docker', label: 'Docker' },
    { id: 'github', label: 'GitHub' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground tracking-tight">Navigator</span>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
              Beta
            </span>
          </div>
        </div>

        {/* Platform Switcher */}
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-full">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => onPlatformChange(p.id)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                platform === p.id 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMentorToggle}
            className={cn(
              "gap-2 rounded-full",
              showMentor && "bg-primary/10 text-primary"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 rounded-full"
          >
            <Link to="/ide">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Back to IDE</span>
            </Link>
          </Button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Learning Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};

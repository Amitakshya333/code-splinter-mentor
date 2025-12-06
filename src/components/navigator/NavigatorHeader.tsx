import { Button } from "@/components/ui/button";
import { Compass, Sparkles, MessageCircle, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NavigatorHeaderProps {
  onMentorToggle: () => void;
  showMentor: boolean;
}

export const NavigatorHeader = ({ 
  onMentorToggle,
  showMentor 
}: NavigatorHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Compass className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground tracking-tight">Navigator</span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
              Beta
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMentorToggle}
            className={cn(
              "gap-2 rounded-full h-8",
              showMentor && "bg-primary/10 text-primary"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">AI Mentor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 rounded-full h-8"
          >
            <Link to="/ide">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">IDE</span>
            </Link>
          </Button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 rounded-full">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Learning</span>
          </div>
        </div>
      </div>
    </header>
  );
};

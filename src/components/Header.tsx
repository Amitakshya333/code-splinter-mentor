import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Code, Sparkles, Github, ExternalLink } from "lucide-react";

interface HeaderProps {
  currentProject?: string | null;
}

export function Header({ currentProject }: HeaderProps) {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CodeSplinter</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Code Editor & Mentor</p>
            </div>
          </div>
          
          {currentProject && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {currentProject}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            Share
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
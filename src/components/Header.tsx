import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Code, Sparkles, Github, ExternalLink, MessageSquare, Settings } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  currentProject?: string | null;
  onFeedbackClick?: () => void;
  onSettingsClick?: () => void;
}

export function Header({ currentProject, onFeedbackClick, onSettingsClick }: HeaderProps) {
  const handleGitHubClick = () => {
    console.log('GitHub button clicked:', { currentProject, currentUrl: window.location.href });
    const githubUrl = "https://github.com/new";
    window.open(githubUrl, '_blank');
    toast.success("Opening GitHub to create a new repository");
  };

  const handleShareClick = async () => {
    console.log('Share button clicked');
    const currentUrl = window.location.href;
    const shareData = {
      title: `CodeSplinter - ${currentProject || 'Code Editor'}`,
      text: 'Check out this collaborative code editor project!',
      url: currentUrl
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Shared via Web Share API');
        toast.success("Project shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(currentUrl);
        console.log('URL copied to clipboard (Web Share API not available)');
        toast.success("Project link copied to clipboard!");
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentUrl);
        console.log('URL copied to clipboard (fallback)');
        toast.success("Project link copied to clipboard!");
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        toast.error("Unable to share project");
      }
    }
  };
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('GitHub button clicked');
              handleGitHubClick();
            }}
            title="Create GitHub Repository"
          >
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('Share button clicked');
              handleShareClick();
            }}
            title="Share Project"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('Feedback button clicked');
              onFeedbackClick?.();
            }}
            title="Give Feedback"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Feedback
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              console.log('Settings button clicked');
              onSettingsClick?.();
            }}
            title="Open Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
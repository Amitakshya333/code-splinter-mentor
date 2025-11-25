import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckSquare, 
  Calculator,
  Cloud,
  Gamepad2,
  Lock,
  Compass,
  Clock
} from "lucide-react";

interface NavigatorPanelProps {
  currentProject?: string | null;
}

const projectTemplates = [
  {
    id: 1,
    icon: CheckSquare,
    name: "To-Do App",
    description: "Build a productivity task manager",
    skills: ["React", "State Management", "Local Storage"],
    time: "2-3 hours",
    difficulty: "Beginner"
  },
  {
    id: 2,
    icon: Calculator,
    name: "Calculator App",
    description: "Create a functional calculator",
    skills: ["JavaScript", "Math Operations", "UI Design"],
    time: "1-2 hours",
    difficulty: "Beginner"
  },
  {
    id: 3,
    icon: Cloud,
    name: "Weather Dashboard",
    description: "Display weather data with beautiful UI",
    skills: ["API Integration", "React", "Responsive Design"],
    time: "2-4 hours",
    difficulty: "Beginner"
  },
  {
    id: 4,
    icon: Gamepad2,
    name: "Memory Card Game",
    description: "Interactive memory matching game",
    skills: ["JavaScript", "Game Logic", "Animations"],
    time: "2-3 hours",
    difficulty: "Beginner"
  },
  {
    id: 5,
    icon: Lock,
    name: "Password Generator",
    description: "Secure password generation tool",
    skills: ["JavaScript", "Security", "UI/UX"],
    time: "1-2 hours",
    difficulty: "Beginner"
  }
];

export const NavigatorPanel = ({ currentProject }: NavigatorPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-navigator-light to-background border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-navigator-glow/10 to-navigator-glow/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-navigator-primary/10 rounded-lg">
            <Compass className="h-5 w-5 text-navigator-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">Choose Your Project</h3>
            <p className="text-xs text-muted-foreground">Start your coding journey with guided project templates</p>
          </div>
        </div>
      </div>

      {/* Project Templates List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {projectTemplates.map((project) => (
            <Card 
              key={project.id}
              className="border-border bg-card hover:border-navigator-primary/50 hover:bg-navigator-glow/5 transition-all cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Project Icon */}
                  <div className="p-2 bg-navigator-primary/10 rounded-lg shrink-0 group-hover:bg-navigator-primary/20 transition-colors">
                    <project.icon className="h-5 w-5 text-navigator-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header with Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <Badge 
                        variant="outline" 
                        className="bg-success/10 text-success border-success/30 text-xs shrink-0"
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    
                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-muted text-foreground text-xs rounded-md border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Time Estimate */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{project.time}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
}

export const KeyboardShortcuts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [shortcuts] = useState<Shortcut[]>([
    {
      keys: ["Ctrl", "S"],
      description: "Save current file",
      action: () => toast({ title: "File saved" }),
    },
    {
      keys: ["Ctrl", "Shift", "P"],
      description: "Command palette",
      action: () => toast({ title: "Command palette opened" }),
    },
    {
      keys: ["Ctrl", "B"],
      description: "Toggle sidebar",
      action: () => toast({ title: "Sidebar toggled" }),
    },
    {
      keys: ["Ctrl", "/"],
      description: "Toggle comment",
      action: () => toast({ title: "Comment toggled" }),
    },
    {
      keys: ["Ctrl", "F"],
      description: "Find in file",
      action: () => toast({ title: "Find opened" }),
    },
    {
      keys: ["Ctrl", "H"],
      description: "Replace in file",
      action: () => toast({ title: "Replace opened" }),
    },
    {
      keys: ["Alt", "↑"],
      description: "Move line up",
      action: () => toast({ title: "Line moved up" }),
    },
    {
      keys: ["Alt", "↓"],
      description: "Move line down",
      action: () => toast({ title: "Line moved down" }),
    },
    {
      keys: ["Ctrl", "D"],
      description: "Duplicate line",
      action: () => toast({ title: "Line duplicated" }),
    },
    {
      keys: ["Ctrl", "`"],
      description: "Toggle terminal",
      action: () => toast({ title: "Terminal toggled" }),
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      shortcuts.forEach((shortcut) => {
        const [mod1, mod2, key] = shortcut.keys;
        
        if (shortcut.keys.length === 2) {
          if (
            ((mod1 === "Ctrl" && ctrl) || (mod1 === "Alt" && alt)) &&
            e.key.toLowerCase() === mod2.toLowerCase()
          ) {
            e.preventDefault();
            shortcut.action();
          }
        } else if (shortcut.keys.length === 3) {
          if (
            ctrl &&
            shift &&
            e.key.toLowerCase() === key.toLowerCase()
          ) {
            e.preventDefault();
            shortcut.action();
          }
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  const filteredShortcuts = shortcuts.filter(
    (s) =>
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Keyboard className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredShortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <Badge key={i} variant="secondary" className="font-mono">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

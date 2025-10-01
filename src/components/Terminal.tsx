import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
}

export const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to the integrated terminal. Type 'help' for available commands." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setLines((prev) => [...prev, { type: "input", content: `$ ${trimmedCmd}` }]);
    setHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const args = trimmedCmd.split(" ");
    const command = args[0].toLowerCase();

    let output = "";
    let isError = false;

    switch (command) {
      case "help":
        output = `Available commands:
  help        - Show this help message
  clear       - Clear terminal
  echo        - Echo text back
  date        - Show current date and time
  pwd         - Print working directory
  ls          - List files (simulated)
  node -v     - Show Node.js version (simulated)
  npm -v      - Show npm version (simulated)
  git status  - Show git status (simulated)`;
        break;
      case "clear":
        setLines([]);
        return;
      case "echo":
        output = args.slice(1).join(" ");
        break;
      case "date":
        output = new Date().toString();
        break;
      case "pwd":
        output = "/workspace/project";
        break;
      case "ls":
        output = "src/  public/  package.json  README.md  index.html";
        break;
      case "node":
        if (args[1] === "-v" || args[1] === "--version") {
          output = "v20.11.0";
        } else {
          output = "Node.js interactive mode not supported";
          isError = true;
        }
        break;
      case "npm":
        if (args[1] === "-v" || args[1] === "--version") {
          output = "10.2.4";
        } else if (args[1] === "install" || args[1] === "i") {
          output = "Installing packages... (simulated)";
        } else {
          output = "npm command simulated. Use package manager UI for actual operations.";
        }
        break;
      case "git":
        if (args[1] === "status") {
          output = `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`;
        } else {
          output = "Git command simulated. Use Git panel for actual operations.";
        }
        break;
      default:
        output = `Command not found: ${command}. Type 'help' for available commands.`;
        isError = true;
    }

    setLines((prev) => [
      ...prev,
      { type: isError ? "error" : "output", content: output },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const clearTerminal = () => {
    setLines([{ type: "output", content: "Terminal cleared" }]);
  };

  return (
    <div className="flex flex-col h-full bg-background border-t border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearTerminal}
          className="h-7"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="font-mono text-sm space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={
                line.type === "input"
                  ? "text-primary font-semibold"
                  : line.type === "error"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              <pre className="whitespace-pre-wrap">{line.content}</pre>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t border-border p-2">
        <div className="flex items-center gap-2">
          <span className="text-primary font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

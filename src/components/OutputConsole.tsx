import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Play, 
  Square, 
  Trash2, 
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface ConsoleOutput {
  id: string;
  type: "output" | "error" | "warning" | "system";
  content: string;
  timestamp: Date;
}

const sampleOutput: ConsoleOutput[] = [
  {
    id: "1",
    type: "system",
    content: "CodeSplinter Python Runtime initialized",
    timestamp: new Date(Date.now() - 5000)
  },
  {
    id: "2", 
    type: "output",
    content: "What's your name? ",
    timestamp: new Date(Date.now() - 4000)
  },
  {
    id: "3",
    type: "output", 
    content: "Hello, Alex!",
    timestamp: new Date(Date.now() - 3000)
  },
  {
    id: "4",
    type: "output",
    content: "Circle area: 78.54",
    timestamp: new Date(Date.now() - 2000)
  },
  {
    id: "5",
    type: "warning",
    content: "Warning: Consider adding type hints for better code clarity",
    timestamp: new Date(Date.now() - 1000)
  }
];

export const OutputConsole = () => {
  const [output, setOutput] = useState<ConsoleOutput[]>(sampleOutput);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    
    // Simulate code execution
    const newOutput: ConsoleOutput = {
      id: Date.now().toString(),
      type: "system",
      content: "Executing code...",
      timestamp: new Date()
    };
    
    setOutput(prev => [...prev, newOutput]);
    
    setTimeout(() => {
      setIsRunning(false);
      setOutput(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "output",
        content: "Code executed successfully!",
        timestamp: new Date()
      }]);
    }, 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setOutput(prev => [...prev, {
      id: Date.now().toString(),
      type: "error",
      content: "Execution stopped by user",
      timestamp: new Date()
    }]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const getOutputIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "system": return <Terminal className="w-4 h-4 text-muted-foreground" />;
      default: return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getOutputColor = (type: string) => {
    switch (type) {
      case "error": return "text-destructive";
      case "warning": return "text-warning";
      case "system": return "text-muted-foreground";
      default: return "text-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted">
      {/* Console Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Output Console</h3>
          {isRunning && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              Running
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="success" 
            size="sm" 
            onClick={handleRun}
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStop}
            disabled={!isRunning}
            className="gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
          <Button variant="ghost" size="sm" onClick={clearOutput}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Console Output */}
      <ScrollArea className="flex-1 p-4">
        <div className="font-mono text-sm space-y-2">
          {output.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Console output will appear here</p>
              <p className="text-xs">Click "Run" to execute your code</p>
            </div>
          ) : (
            output.map((item) => (
              <div key={item.id} className="flex items-start gap-2 group">
                <span className="text-xs text-muted-foreground mt-1 min-w-[60px]">
                  {item.timestamp.toLocaleTimeString()}
                </span>
                <div className="flex items-start gap-2 flex-1">
                  {getOutputIcon(item.type)}
                  <span className={`whitespace-pre-wrap ${getOutputColor(item.type)}`}>
                    {item.content}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {isRunning && (
            <div className="flex items-center gap-2 animate-pulse">
              <span className="text-xs text-muted-foreground min-w-[60px]">
                {new Date().toLocaleTimeString()}
              </span>
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-primary">Executing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Console Input */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="text-primary">{'>'}</span>
          <input
            type="text"
            placeholder="Interactive console input..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
};
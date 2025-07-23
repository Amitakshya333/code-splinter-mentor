import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Terminal,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Download
} from "lucide-react";

interface OutputEntry {
  id: string;
  content: string;
  type: "output" | "error" | "info";
  timestamp: Date;
  language: string;
  executionTime?: number;
}

interface EnhancedOutputConsoleProps {
  currentCode?: string;
  currentLanguage?: string;
}

export function EnhancedOutputConsole({ currentCode = "", currentLanguage = "python" }: EnhancedOutputConsoleProps) {
  const [output, setOutput] = useState<OutputEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filter, setFilter] = useState<"all" | "output" | "error" | "info">("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [output, autoScroll]);

  const addOutput = (content: string, type: OutputEntry["type"], executionTime?: number) => {
    const newEntry: OutputEntry = {
      id: Date.now().toString() + Math.random(),
      content,
      type,
      timestamp: new Date(),
      language: currentLanguage,
      executionTime
    };
    
    setOutput(prev => [...prev, newEntry]);
  };

  const runCode = async () => {
    if (!currentCode.trim()) {
      addOutput("No code to execute", "error");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    addOutput(`Executing ${currentLanguage} code...`, "info");

    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { 
          code: currentCode, 
          language: currentLanguage 
        }
      });

      const executionTime = Date.now() - startTime;

      if (error) {
        addOutput(`Execution failed: ${error.message}`, "error", executionTime);
        throw error;
      }

      if (data.error) {
        addOutput(data.error, "error", executionTime);
      } else {
        addOutput(data.output || "Code executed successfully (no output)", "output", executionTime);
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Error executing code:', error);
      addOutput(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error", executionTime);
      
      toast({
        title: "Execution Failed",
        description: "Could not execute the code. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConsole = () => {
    setOutput([]);
    toast({
      title: "Console Cleared",
      description: "All output has been removed",
    });
  };

  const copyOutput = async () => {
    const filteredOutput = getFilteredOutput();
    const textContent = filteredOutput
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.content}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textContent);
      toast({
        title: "Output Copied! 📋",
        description: "Console output has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy output to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadOutput = () => {
    const filteredOutput = getFilteredOutput();
    const textContent = filteredOutput
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] [${entry.type.toUpperCase()}] ${entry.content}`)
      .join('\n');

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-output-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Output Downloaded! 💾",
      description: "Console output saved to file",
    });
  };

  const getFilteredOutput = () => {
    if (filter === "all") return output;
    return output.filter(entry => entry.type === filter);
  };

  const getTypeIcon = (type: OutputEntry["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "output":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "info":
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: OutputEntry["type"]) => {
    switch (type) {
      case "error":
        return "text-destructive";
      case "output":
        return "text-foreground";
      case "info":
        return "text-muted-foreground";
      default:
        return "text-foreground";
    }
  };

  const filteredOutput = getFilteredOutput();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Console Output</CardTitle>
            {output.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filteredOutput.length} entries
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="output">Output</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={runCode} 
              disabled={isLoading}
              size="sm"
              className="bg-success hover:bg-success/90"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "Running..." : "Run"}
            </Button>

            <Button onClick={downloadOutput} size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>

            <Button onClick={copyOutput} size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>

            <Button onClick={clearConsole} size="sm" variant="outline">
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="sm"
              variant="ghost"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="flex-1 p-0">
          <div className="px-4 pb-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Real-time execution</span>
              </div>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Auto-scroll</span>
              </label>
            </div>
          </div>
          
          <Separator />
          
          <ScrollArea className="h-80" ref={scrollAreaRef}>
            <div className="p-4 space-y-2">
              {filteredOutput.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No output yet</p>
                  <p className="text-sm">Run your code to see the results here</p>
                </div>
              ) : (
                filteredOutput.map((entry) => (
                  <div key={entry.id} className="group">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(entry.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge 
                            variant={entry.type === "error" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {entry.language}
                          </Badge>
                          {entry.executionTime && (
                            <span className="text-xs text-muted-foreground">
                              {entry.executionTime}ms
                            </span>
                          )}
                        </div>
                        
                        <pre className={`text-sm font-mono whitespace-pre-wrap break-words ${getTypeColor(entry.type)}`}>
                          {entry.content}
                        </pre>
                      </div>
                    </div>
                    
                    {entry !== filteredOutput[filteredOutput.length - 1] && (
                      <Separator className="my-1 opacity-50" />
                    )}
                  </div>
                ))
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
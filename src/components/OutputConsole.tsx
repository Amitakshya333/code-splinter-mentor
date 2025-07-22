import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Terminal, 
  Play, 
  Square, 
  Trash2, 
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface ConsoleOutput {
  id: string;
  type: "output" | "error" | "warning" | "system";
  content: string;
  timestamp: Date;
}

interface OutputConsoleProps {
  code?: string;
  language?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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

export const OutputConsole = ({ code = "", language = "python", isCollapsed = false, onToggleCollapse }: OutputConsoleProps) => {
  const [output, setOutput] = useState<ConsoleOutput[]>(sampleOutput);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const executeCode = async (codeToRun: string, lang: string) => {
    if (!codeToRun.trim()) {
      addOutput("error", "No code to execute");
      return;
    }

    setIsRunning(true);
    addOutput("system", `Executing ${lang} code...`);

    try {
      // For client-side languages, execute directly
      if (lang === "javascript") {
        await executeJavaScript(codeToRun);
      } else if (lang === "html" || lang === "css") {
        executeMarkup(codeToRun, lang);
      } else {
        // For server-side languages, use Supabase edge function
        await executeServerSide(codeToRun, lang);
      }
    } catch (error) {
      addOutput("error", `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const executeJavaScript = async (jsCode: string) => {
    try {
      // Create a safe execution context
      const originalConsole = console;
      const outputs: string[] = [];
      
      // Override console methods to capture output
      const mockConsole = {
        log: (...args: any[]) => outputs.push(args.map(String).join(' ')),
        error: (...args: any[]) => outputs.push(`ERROR: ${args.map(String).join(' ')}`),
        warn: (...args: any[]) => outputs.push(`WARNING: ${args.map(String).join(' ')}`),
      };
      
      // Replace console temporarily
      (globalThis as any).console = mockConsole;
      
      // Execute the code
      const result = new Function(jsCode)();
      
      // Restore console
      (globalThis as any).console = originalConsole;
      
      // Display outputs
      outputs.forEach(output => {
        if (output.startsWith('ERROR:')) {
          addOutput("error", output.replace('ERROR: ', ''));
        } else if (output.startsWith('WARNING:')) {
          addOutput("warning", output.replace('WARNING: ', ''));
        } else {
          addOutput("output", output);
        }
      });
      
      // If there's a return value, show it
      if (result !== undefined) {
        addOutput("output", `=> ${result}`);
      }
      
      if (outputs.length === 0 && result === undefined) {
        addOutput("system", "Code executed successfully (no output)");
      }
    } catch (error) {
      addOutput("error", error instanceof Error ? error.message : 'JavaScript execution error');
    }
  };

  const executeMarkup = (markupCode: string, lang: string) => {
    if (lang === "html") {
      addOutput("system", "HTML rendered in preview (check preview panel)");
    } else if (lang === "css") {
      addOutput("system", "CSS applied (check preview panel)");
    }
    addOutput("output", `${lang.toUpperCase()} code processed successfully`);
  };

  const executeServerSide = async (serverCode: string, lang: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code: serverCode, language: lang }
      });

      if (error) {
        addOutput("error", `Execution error: ${error.message}`);
        return;
      }

      if (data?.output) {
        addOutput("output", data.output);
      }
      
      if (data?.error) {
        addOutput("error", data.error);
      }

      if (!data?.output && !data?.error) {
        addOutput("system", "Code executed successfully (no output)");
      }
    } catch (error) {
      addOutput("error", `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addOutput = (type: ConsoleOutput["type"], content: string) => {
    const newOutput: ConsoleOutput = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setOutput(prev => [...prev, newOutput]);
  };

  const handleRun = () => {
    executeCode(code, language);
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

  const copyOutput = () => {
    const outputText = output.map(item => 
      `[${item.timestamp.toLocaleTimeString()}] ${item.content}`
    ).join('\n');
    
    navigator.clipboard.writeText(outputText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Console output copied successfully",
      });
    });
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
    <div className={`flex flex-col bg-background border border-border rounded-lg overflow-hidden ${isCollapsed ? 'h-12' : 'h-full'}`}>
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Console Output</h3>
          <Badge variant="outline" className="text-xs">
            {language.toUpperCase()}
          </Badge>
          {isRunning && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Clock className="w-3 h-3" />
              Running
            </Badge>
          )}
        </div>

        <div className="flex gap-1">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="gap-1 h-7 px-2 bg-green-600 hover:bg-green-700 text-xs"
          >
            <Play className="w-3 h-3" />
            Run
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStop}
            disabled={!isRunning}
            className="gap-1 h-7 px-2 text-xs"
          >
            <Square className="w-3 h-3" />
            Stop
          </Button>
          <Button variant="ghost" size="sm" onClick={clearOutput} className="h-7 px-2">
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyOutput} className="h-7 px-2">
            <Copy className="w-3 h-3" />
          </Button>
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-7 px-2">
              {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>

      {/* Console Output */}
      {!isCollapsed && (
        <>
          <ScrollArea className="flex-1 p-3 bg-background">
            <div className="font-mono text-xs space-y-1">
              {output.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  <Terminal className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Console output will appear here</p>
                  <p className="text-xs">Click "Run" to execute your {language} code</p>
                </div>
              ) : (
                output.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 group hover:bg-muted/30 px-1 py-0.5 rounded">
                    <span className="text-xs text-muted-foreground mt-0.5 min-w-[50px] shrink-0">
                      {item.timestamp.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      })}
                    </span>
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      {getOutputIcon(item.type)}
                      <span className={`whitespace-pre-wrap break-words ${getOutputColor(item.type)}`}>
                        {item.content}
                      </span>
                    </div>
                  </div>
                ))
              )}
              
              {isRunning && (
                <div className="flex items-center gap-2 animate-pulse px-1 py-0.5">
                  <span className="text-xs text-muted-foreground min-w-[50px]">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour12: false, 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      second: '2-digit' 
                    })}
                  </span>
                  <Terminal className="w-3 h-3 text-primary" />
                  <span className="text-primary text-xs">Executing {language} code...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Console Input */}
          <div className="border-t border-border bg-card p-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-primary">{'>'}</span>
              <input
                type="text"
                placeholder={`Interactive ${language} console...`}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                disabled={isRunning}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
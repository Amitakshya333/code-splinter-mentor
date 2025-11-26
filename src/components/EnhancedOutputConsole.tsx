import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Download,
  FileDown
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
    console.log('Run Code button clicked:', { 
      hasCode: !!currentCode.trim(), 
      language: currentLanguage,
      codeLength: currentCode.length 
    });

    if (!currentCode.trim()) {
      addOutput("❌ No code to execute", "error");
      toast({
        title: "No Code",
        description: "Please write some code first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    addOutput(`🚀 Executing ${currentLanguage} code...`, "info");

    try {
      console.log('Invoking execute-code function...');
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { 
          code: currentCode, 
          language: currentLanguage 
        }
      });

      const executionTime = Date.now() - startTime;
      console.log('Execution response:', { data, error, executionTime });

      if (error) {
        console.error('Execution error:', error);
        addOutput(`❌ Execution failed: ${error.message}`, "error", executionTime);
        toast({
          title: "Execution Failed",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      if (data?.error) {
        addOutput(`❌ ${data.error}`, "error", executionTime);
        toast({
          title: "Code Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        const output = data?.output || "Code executed successfully (no output)";
        addOutput(`✅ ${output}`, "output", executionTime);
        toast({
          title: "Execution Successful! 🎉",
          description: `${currentLanguage} code completed in ${executionTime}ms`,
        });
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Error executing code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
      addOutput(`❌ Execution error: ${errorMessage}`, "error", executionTime);
      
      toast({
        title: "Execution Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConsole = () => {
    console.log('Clear Console button clicked');
    setOutput([]);
    toast({
      title: "Console Cleared",
      description: "All output has been removed",
    });
  };

  const copyOutput = async () => {
    console.log('Copy Output button clicked');
    const filteredOutput = getFilteredOutput();
    const textContent = filteredOutput
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.content}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textContent);
      console.log('Output copied to clipboard');
      toast({
        title: "Output Copied! 📋",
        description: "Console output has been copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy output:', error);
      toast({
        title: "Copy Failed",
        description: "Could not copy output to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadOutput = (format: 'txt' | 'json' | 'csv' | 'html' = 'txt') => {
    const filteredOutput = getFilteredOutput();
    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    switch (format) {
      case 'json':
        content = JSON.stringify(filteredOutput.map(entry => ({
          timestamp: entry.timestamp.toISOString(),
          type: entry.type,
          language: entry.language,
          content: entry.content,
          executionTime: entry.executionTime
        })), null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      
      case 'csv':
        const headers = 'Timestamp,Type,Language,Execution Time (ms),Content\n';
        const rows = filteredOutput.map(entry => {
          const timestamp = entry.timestamp.toISOString();
          const content = entry.content.replace(/"/g, '""'); // Escape quotes
          const execTime = entry.executionTime || '';
          return `"${timestamp}","${entry.type}","${entry.language}","${execTime}","${content}"`;
        }).join('\n');
        content = headers + rows;
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      
      case 'html':
        content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Console Output - ${new Date().toLocaleString()}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .entry { padding: 12px; margin: 8px 0; border-left: 4px solid #ccc; background: #fafafa; border-radius: 4px; }
    .entry.output { border-left-color: #10b981; }
    .entry.error { border-left-color: #ef4444; background: #fef2f2; }
    .entry.info { border-left-color: #3b82f6; }
    .meta { font-size: 0.85em; color: #666; margin-bottom: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; margin-right: 8px; background: #e5e7eb; }
    .content { white-space: pre-wrap; font-family: 'Courier New', monospace; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Console Output Report</h1>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Entries:</strong> ${filteredOutput.length}</p>
    <hr>
    ${filteredOutput.map(entry => `
    <div class="entry ${entry.type}">
      <div class="meta">
        <span class="badge">${entry.timestamp.toLocaleString()}</span>
        <span class="badge">${entry.type.toUpperCase()}</span>
        <span class="badge">${entry.language}</span>
        ${entry.executionTime ? `<span class="badge">${entry.executionTime}ms</span>` : ''}
      </div>
      <div class="content">${entry.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
    `).join('')}
  </div>
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
        break;
      
      default:
        content = filteredOutput
          .map(entry => `[${entry.timestamp.toLocaleString()}] [${entry.type.toUpperCase()}] ${entry.content}`)
          .join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-output-${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Output Downloaded! 💾",
      description: `Console output saved as ${extension.toUpperCase()} file`,
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
    <Card className="h-full flex flex-col relative z-20">
      <CardHeader className="pb-3 relative z-20">
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
              onClick={() => {
                console.log('Run Code button clicked');
                runCode();
              }}
              disabled={isLoading}
              size="sm"
              className="bg-success hover:bg-success/90"
              title="Execute code"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "Running..." : "Run"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  title="Download output in multiple formats"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => downloadOutput('txt')}>
                  <Download className="h-4 w-4 mr-2" />
                  Text (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadOutput('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  JSON (.json)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadOutput('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV (.csv)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadOutput('html')}>
                  <Download className="h-4 w-4 mr-2" />
                  HTML Report (.html)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={() => {
                console.log('Copy Output button clicked');
                copyOutput();
              }}
              size="sm" 
              variant="outline"
              title="Copy output to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button 
              onClick={() => {
                console.log('Clear Console button clicked');
                clearConsole();
              }}
              size="sm" 
              variant="outline"
              title="Clear console"
            >
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
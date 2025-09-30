import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  StepForward, 
  RotateCcw, 
  Circle, 
  AlertCircle,
  Variable,
  Eye,
  Terminal
} from "lucide-react";

interface Breakpoint {
  id: string;
  line: number;
  enabled: boolean;
}

interface Variable {
  name: string;
  value: any;
  type: string;
}

interface DebugPanelProps {
  code: string;
  language: string;
}

export const DebugPanel = ({ code, language }: DebugPanelProps) => {
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [console, setConsole] = useState<string[]>([]);

  const addBreakpoint = useCallback((line: number) => {
    const newBreakpoint: Breakpoint = {
      id: Date.now().toString(),
      line,
      enabled: true
    };
    setBreakpoints(prev => [...prev, newBreakpoint]);
  }, []);

  const toggleBreakpoint = useCallback((id: string) => {
    setBreakpoints(prev => prev.map(bp =>
      bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
    ));
  }, []);

  const removeBreakpoint = useCallback((id: string) => {
    setBreakpoints(prev => prev.filter(bp => bp.id !== id));
  }, []);

  const startDebugging = useCallback(() => {
    setIsRunning(true);
    setCurrentLine(1);
    setConsole(prev => [...prev, '> Debug session started']);
    
    // Simulate variable inspection
    if (language === 'python' || language === 'javascript') {
      const mockVariables: Variable[] = [
        { name: 'x', value: 10, type: 'number' },
        { name: 'message', value: '"Hello"', type: 'string' },
        { name: 'isValid', value: true, type: 'boolean' }
      ];
      setVariables(mockVariables);
      
      setCallStack([
        'main() - line 1',
        'greet() - line 5',
        'processData() - line 12'
      ]);
    }
  }, [language]);

  const pauseDebugging = useCallback(() => {
    setIsRunning(false);
    setConsole(prev => [...prev, '> Paused']);
  }, []);

  const stepForward = useCallback(() => {
    if (currentLine !== null) {
      setCurrentLine(prev => (prev || 0) + 1);
      setConsole(prev => [...prev, `> Step to line ${(currentLine || 0) + 1}`]);
    }
  }, [currentLine]);

  const resetDebugger = useCallback(() => {
    setIsRunning(false);
    setCurrentLine(null);
    setVariables([]);
    setCallStack([]);
    setConsole([]);
    setConsole(prev => [...prev, '> Debug session reset']);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Debug Controls */}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 text-destructive fill-current animate-pulse" />
          <span className="text-sm font-medium">Debug Panel</span>
          {currentLine && (
            <Badge variant="secondary" className="text-xs">
              Line {currentLine}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isRunning ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={startDebugging}
              className="h-7"
            >
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={pauseDebugging}
              className="h-7"
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={stepForward}
            disabled={!isRunning}
            className="h-7"
          >
            <StepForward className="h-3 w-3 mr-1" />
            Step
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDebugger}
            className="h-7"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Debug Info Tabs */}
      <Tabs defaultValue="variables" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="variables" className="rounded-none data-[state=active]:border-b-2">
            <Variable className="h-3 w-3 mr-1" />
            Variables
          </TabsTrigger>
          <TabsTrigger value="breakpoints" className="rounded-none data-[state=active]:border-b-2">
            <Circle className="h-3 w-3 mr-1" />
            Breakpoints
          </TabsTrigger>
          <TabsTrigger value="callstack" className="rounded-none data-[state=active]:border-b-2">
            <Eye className="h-3 w-3 mr-1" />
            Call Stack
          </TabsTrigger>
          <TabsTrigger value="console" className="rounded-none data-[state=active]:border-b-2">
            <Terminal className="h-3 w-3 mr-1" />
            Debug Console
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="variables" className="h-full m-0 p-3">
            <ScrollArea className="h-full">
              {variables.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No variables to display. Start debugging to see variables.
                </div>
              ) : (
                <div className="space-y-2">
                  {variables.map((variable, idx) => (
                    <Card key={idx} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Variable className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm font-medium">
                            {variable.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </div>
                      <div className="mt-2 font-mono text-sm text-muted-foreground">
                        {String(variable.value)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="breakpoints" className="h-full m-0 p-3">
            <ScrollArea className="h-full">
              {breakpoints.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No breakpoints set. Click on a line number in the editor to add one.
                </div>
              ) : (
                <div className="space-y-2">
                  {breakpoints.map(bp => (
                    <Card key={bp.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Circle 
                            className={`h-3 w-3 ${bp.enabled ? 'text-destructive fill-current' : 'text-muted-foreground'}`}
                          />
                          <span className="text-sm">
                            Line {bp.line}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBreakpoint(bp.id)}
                            className="h-6 px-2"
                          >
                            {bp.enabled ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBreakpoint(bp.id)}
                            className="h-6 px-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="callstack" className="h-full m-0 p-3">
            <ScrollArea className="h-full">
              {callStack.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No call stack available. Start debugging to see the call stack.
                </div>
              ) : (
                <div className="space-y-1">
                  {callStack.map((frame, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded hover:bg-muted cursor-pointer font-mono text-sm"
                    >
                      {frame}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="console" className="h-full m-0 p-3">
            <ScrollArea className="h-full">
              <div className="font-mono text-xs space-y-1">
                {console.map((line, idx) => (
                  <div key={idx} className="text-muted-foreground">
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Activity, Play, AlertTriangle, CheckCircle } from "lucide-react";

interface PerformanceIssue {
  severity: "high" | "medium" | "low";
  message: string;
  suggestion: string;
  file?: string;
}

export const PerformanceProfiler = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [metrics] = useState({
    bundleSize: 245,
    renderTime: 1.2,
    memoryUsage: 45,
    score: 87,
  });

  const analyze = async () => {
    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIssues([
      {
        severity: "high",
        message: "Large bundle detected",
        suggestion: "Consider code-splitting to reduce initial bundle size",
        file: "App.tsx",
      },
      {
        severity: "medium",
        message: "Unnecessary re-renders",
        suggestion: "Use React.memo or useMemo to optimize component renders",
        file: "MultiTabCodeEditor.tsx",
      },
      {
        severity: "low",
        message: "Image optimization needed",
        suggestion: "Convert images to WebP format for better performance",
      },
    ]);
    
    setAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Performance Profiler</h3>
        </div>
        <Button onClick={analyze} disabled={analyzing}>
          <Play className="w-4 h-4 mr-2" />
          {analyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Performance Score</div>
          <div className="text-3xl font-bold text-primary">{metrics.score}</div>
          <Progress value={metrics.score} className="mt-2" />
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Bundle Size</div>
          <div className="text-3xl font-bold">{metrics.bundleSize}KB</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Render Time</div>
          <div className="text-3xl font-bold">{metrics.renderTime}s</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Memory Usage</div>
          <div className="text-3xl font-bold">{metrics.memoryUsage}MB</div>
        </Card>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-muted-foreground">
                No issues found. Click "Analyze" to scan your code.
              </p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      {issue.file && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {issue.file}
                        </span>
                      )}
                    </div>
                    <div className="font-medium mb-1">{issue.message}</div>
                    <p className="text-sm text-muted-foreground">
                      {issue.suggestion}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

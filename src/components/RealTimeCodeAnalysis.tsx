import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  RefreshCw,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  line: number;
  column: number;
  rule: string;
  fix?: string;
  explanation: string;
}

interface CodeMetrics {
  complexity: number;
  maintainability: number;
  performance: number;
  readability: number;
  linesOfCode: number;
  functions: number;
  duplicateCode: number;
}

interface RealTimeCodeAnalysisProps {
  code: string;
  language: string;
  onApplyFix?: (line: number, fix: string) => void;
}

export const RealTimeCodeAnalysis: React.FC<RealTimeCodeAnalysisProps> = ({
  code,
  language,
  onApplyFix
}) => {
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<CodeMetrics>({
    complexity: 0,
    maintainability: 0,
    performance: 0,
    readability: 0,
    linesOfCode: 0,
    functions: 0,
    duplicateCode: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const analyzeCode = useCallback(async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate real-time analysis
    setTimeout(() => {
      const mockIssues: CodeIssue[] = [
        {
          id: '1',
          type: 'warning',
          severity: 'medium',
          message: 'Unused variable "temp"',
          line: 5,
          column: 10,
          rule: 'no-unused-vars',
          fix: 'Remove unused variable',
          explanation: 'This variable is declared but never used, which can cause memory leaks and confusion.'
        },
        {
          id: '2',
          type: 'suggestion',
          severity: 'low',
          message: 'Consider using const instead of let',
          line: 3,
          column: 1,
          rule: 'prefer-const',
          fix: 'Change let to const',
          explanation: 'This variable is never reassigned, so it should be declared as const for better code clarity.'
        },
        {
          id: '3',
          type: 'performance',
          severity: 'high',
          message: 'Inefficient loop detected',
          line: 12,
          column: 5,
          rule: 'no-inefficient-loop',
          fix: 'Use more efficient array method',
          explanation: 'This loop could be optimized using built-in array methods like map, filter, or reduce.'
        }
      ];

      const mockMetrics: CodeMetrics = {
        complexity: Math.floor(Math.random() * 20) + 5,
        maintainability: Math.floor(Math.random() * 30) + 70,
        performance: Math.floor(Math.random() * 25) + 75,
        readability: Math.floor(Math.random() * 20) + 80,
        linesOfCode: code.split('\n').length,
        functions: (code.match(/function|=>/g) || []).length,
        duplicateCode: Math.floor(Math.random() * 10)
      };

      setIssues(mockIssues);
      setMetrics(mockMetrics);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 1500);
  }, [code]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeCode();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [analyzeCode]);

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion': return <Info className="h-4 w-4 text-blue-500" />;
      case 'performance': return <Zap className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getMetricColor = (value: number, type: 'complexity' | 'quality') => {
    if (type === 'complexity') {
      return value < 10 ? 'text-green-600' : value < 20 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return value > 80 ? 'text-green-600' : value > 60 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const handleApplyFix = (issue: CodeIssue) => {
    if (onApplyFix && issue.fix) {
      onApplyFix(issue.line, issue.fix);
      setIssues(prev => prev.filter(i => i.id !== issue.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {isAnalyzing ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : analysisComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
              Code Analysis
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeCode}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
          <CardDescription>
            Real-time analysis of your code quality, performance, and potential issues
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Code Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Code Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Complexity</span>
                <span className={`text-sm font-bold ${getMetricColor(metrics.complexity, 'complexity')}`}>
                  {metrics.complexity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Maintainability</span>
                <span className={`text-sm font-bold ${getMetricColor(metrics.maintainability, 'quality')}`}>
                  {metrics.maintainability}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Performance</span>
                <span className={`text-sm font-bold ${getMetricColor(metrics.performance, 'quality')}`}>
                  {metrics.performance}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Readability</span>
                <span className={`text-sm font-bold ${getMetricColor(metrics.readability, 'quality')}`}>
                  {metrics.readability}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Lines of Code</span>
                <span className="text-sm font-bold">{metrics.linesOfCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Functions</span>
                <span className="text-sm font-bold">{metrics.functions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Duplicate Code</span>
                <span className="text-sm font-bold">{metrics.duplicateCode}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Code Issues ({issues.length})
            </span>
            {issues.length === 0 && analysisComplete && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                No Issues Found
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 && analysisComplete ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>Great job! No issues found in your code.</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {issues.map((issue) => (
                  <Card key={issue.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getIssueIcon(issue.type)}
                          <span className="font-medium">{issue.message}</span>
                          <Badge variant={getSeverityColor(issue.severity) as any}>
                            {issue.severity}
                          </Badge>
                        </div>
                        {issue.fix && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApplyFix(issue)}
                          >
                            Quick Fix
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Line {issue.line}, Column {issue.column} • Rule: {issue.rule}
                      </p>
                      <p className="text-sm">{issue.explanation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
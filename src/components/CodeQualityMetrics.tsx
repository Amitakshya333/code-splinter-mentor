import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Code2, FileText, Shield, Zap } from 'lucide-react';

interface QualityMetric {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  description: string;
  suggestions: string[];
}

interface CodeIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  file: string;
  line: number;
  message: string;
  category: string;
}

export const CodeQualityMetrics = () => {
  const [overallScore] = useState(78);
  const [trend] = useState(5); // positive means improving

  const qualityMetrics: QualityMetric[] = [
    {
      name: 'Code Complexity',
      score: 82,
      status: 'good',
      description: 'Measures how complex your code structure is',
      suggestions: [
        'Break down large functions into smaller ones',
        'Reduce nested conditional statements'
      ]
    },
    {
      name: 'Test Coverage',
      score: 65,
      status: 'needs-improvement',
      description: 'Percentage of code covered by tests',
      suggestions: [
        'Add unit tests for utility functions',
        'Increase integration test coverage',
        'Test edge cases and error handling'
      ]
    },
    {
      name: 'Code Duplication',
      score: 90,
      status: 'excellent',
      description: 'Amount of duplicated code in your project',
      suggestions: [
        'Excellent! Keep maintaining DRY principles'
      ]
    },
    {
      name: 'Documentation',
      score: 58,
      status: 'needs-improvement',
      description: 'Quality and completeness of code documentation',
      suggestions: [
        'Add JSDoc comments to functions',
        'Document complex algorithms',
        'Update README with usage examples'
      ]
    },
    {
      name: 'Security',
      score: 88,
      status: 'good',
      description: 'Security best practices and vulnerability checks',
      suggestions: [
        'Keep dependencies up to date',
        'Review authentication implementation'
      ]
    },
    {
      name: 'Performance',
      score: 75,
      status: 'good',
      description: 'Code efficiency and optimization',
      suggestions: [
        'Optimize large list rendering',
        'Consider code splitting for better load times',
        'Implement lazy loading for images'
      ]
    }
  ];

  const codeIssues: CodeIssue[] = [
    {
      id: '1',
      severity: 'error',
      file: 'src/components/UserList.tsx',
      line: 45,
      message: 'Potential null pointer exception',
      category: 'Bug Risk'
    },
    {
      id: '2',
      severity: 'warning',
      file: 'src/utils/helpers.ts',
      line: 23,
      message: 'Function has too many parameters (7)',
      category: 'Code Smell'
    },
    {
      id: '3',
      severity: 'warning',
      file: 'src/components/Dashboard.tsx',
      line: 112,
      message: 'Consider memoizing this component',
      category: 'Performance'
    },
    {
      id: '4',
      severity: 'info',
      file: 'src/services/api.ts',
      line: 67,
      message: 'Add error handling for network requests',
      category: 'Best Practice'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-500">Excellent</Badge>;
      case 'good':
        return <Badge variant="secondary">Good</Badge>;
      case 'needs-improvement':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Needs Improvement</Badge>;
      case 'poor':
        return <Badge variant="destructive">Poor</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Code Quality Metrics</h2>
        <div className="flex items-center gap-2">
          {trend > 0 ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            {Math.abs(trend)}% from last week
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Code Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold">{overallScore}/100</span>
                {getStatusBadge(overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'needs-improvement')}
              </div>
              <Progress value={overallScore} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Files Analyzed</p>
                  <p className="font-semibold">243</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Lines of Code</p>
                  <p className="font-semibold">12,456</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Quality Metrics</TabsTrigger>
          <TabsTrigger value="issues">Issues & Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="grid gap-4 md:grid-cols-2">
              {qualityMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      {getStatusBadge(metric.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}/100
                        </span>
                      </div>
                      <Progress value={metric.score} />
                    </div>

                    <p className="text-sm text-muted-foreground">{metric.description}</p>

                    <div>
                      <p className="text-sm font-semibold mb-2">Suggestions:</p>
                      <ul className="space-y-1">
                        {metric.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="issues" className="mt-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {codeIssues.map((issue) => (
                <Card key={issue.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{issue.message}</p>
                          {getSeverityBadge(issue.severity)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {issue.file}
                          </span>
                          <span>Line {issue.line}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

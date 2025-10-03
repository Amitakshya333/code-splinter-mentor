import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Bug, Activity, TrendingUp } from 'lucide-react';

interface ErrorLog {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
  count: number;
}

export const MonitoringIntegration = () => {
  const errors: ErrorLog[] = [
    { id: '1', message: 'Uncaught TypeError: Cannot read property', type: 'error', timestamp: '5 min ago', count: 12 },
    { id: '2', message: 'API request timeout', type: 'warning', timestamp: '15 min ago', count: 3 },
    { id: '3', message: 'Slow database query detected', type: 'warning', timestamp: '1 hour ago', count: 5 },
  ];

  const metrics = [
    { label: 'Error Rate', value: '2.3%', trend: 'down' },
    { label: 'Response Time', value: '234ms', trend: 'up' },
    { label: 'Uptime', value: '99.9%', trend: 'stable' },
    { label: 'Memory Usage', value: '67%', trend: 'up' },
  ];

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <Bug className="w-4 h-4 text-warning" />;
      default:
        return <Activity className="w-4 h-4 text-info" />;
    }
  };

  const getErrorBadge = (type: string) => {
    const variants: Record<string, any> = {
      error: 'destructive',
      warning: 'warning',
      info: 'secondary',
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring & Analytics</CardTitle>
        <CardDescription>Error tracking and performance monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="errors">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="errors">
              <Bug className="w-4 h-4 mr-2" />
              Errors
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="errors">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {errors.map((error) => (
                  <div
                    key={error.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {getErrorIcon(error.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{error.message}</p>
                        <p className="text-sm text-muted-foreground mt-1">{error.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{error.count}x</Badge>
                      {getErrorBadge(error.type)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="metrics">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <TrendingUp className={`w-4 h-4 ${
                      metric.trend === 'down' ? 'text-success rotate-180' :
                      metric.trend === 'up' ? 'text-warning' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

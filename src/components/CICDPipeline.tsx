import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle2, XCircle, Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PipelineJob {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: string;
  timestamp: string;
}

export const CICDPipeline = () => {
  const [pipelines] = useState<PipelineJob[]>([
    { id: '1', name: 'Build & Test', status: 'success', duration: '2m 34s', timestamp: '2 hours ago' },
    { id: '2', name: 'Lint & Format', status: 'success', duration: '1m 12s', timestamp: '2 hours ago' },
    { id: '3', name: 'Deploy Staging', status: 'running', duration: '-', timestamp: 'now' },
    { id: '4', name: 'Integration Tests', status: 'pending', duration: '-', timestamp: '-' },
  ]);

  const handleRunPipeline = () => {
    toast.success('Pipeline started successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Clock className="w-4 h-4 text-warning animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      success: 'success',
      failed: 'destructive',
      running: 'warning',
      pending: 'secondary',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CI/CD Pipeline</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button size="sm" onClick={handleRunPipeline}>
              <Play className="w-4 h-4 mr-2" />
              Run Pipeline
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Automated testing and deployment</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jobs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {pipelines.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.name}</p>
                        <p className="text-sm text-muted-foreground">{job.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{job.duration}</span>
                      {getStatusBadge(job.status)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="history">
            <div className="py-8 text-center text-muted-foreground">
              <p>Pipeline execution history will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="config">
            <div className="py-8 text-center text-muted-foreground">
              <p>Pipeline configuration options</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

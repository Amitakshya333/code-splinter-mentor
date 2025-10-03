import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CICDPipeline } from './CICDPipeline';
import { CloudStorageSync } from './CloudStorageSync';
import { GitVisualDiff } from './GitVisualDiff';
import { HostingIntegration } from './HostingIntegration';
import { MonitoringIntegration } from './MonitoringIntegration';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Rocket, Cloud, GitCompare, Server, Activity, BarChart3 } from 'lucide-react';

export const IntegrationDeployment = () => {
  return (
    <Tabs defaultValue="cicd" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="cicd">
          <Rocket className="w-4 h-4 mr-2" />
          CI/CD
        </TabsTrigger>
        <TabsTrigger value="cloud">
          <Cloud className="w-4 h-4 mr-2" />
          Cloud
        </TabsTrigger>
        <TabsTrigger value="git">
          <GitCompare className="w-4 h-4 mr-2" />
          Git
        </TabsTrigger>
        <TabsTrigger value="hosting">
          <Server className="w-4 h-4 mr-2" />
          Hosting
        </TabsTrigger>
        <TabsTrigger value="monitoring">
          <Activity className="w-4 h-4 mr-2" />
          Monitor
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cicd" className="mt-4">
        <CICDPipeline />
      </TabsContent>
      <TabsContent value="cloud" className="mt-4">
        <CloudStorageSync />
      </TabsContent>
      <TabsContent value="git" className="mt-4">
        <GitVisualDiff />
      </TabsContent>
      <TabsContent value="hosting" className="mt-4">
        <HostingIntegration />
      </TabsContent>
      <TabsContent value="monitoring" className="mt-4">
        <MonitoringIntegration />
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

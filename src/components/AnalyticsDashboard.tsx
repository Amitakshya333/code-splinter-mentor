import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Code, Clock } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const stats = [
    { label: 'Total Projects', value: '24', icon: Code, change: '+12%' },
    { label: 'Active Users', value: '1,234', icon: Users, change: '+8%' },
    { label: 'Build Time', value: '2.3s', icon: Clock, change: '-15%' },
    { label: 'Deployments', value: '156', icon: BarChart3, change: '+23%' },
  ];

  const usageData = [
    { feature: 'Code Editor', usage: 89 },
    { feature: 'Terminal', usage: 67 },
    { feature: 'Git Integration', usage: 54 },
    { feature: 'Collaboration', usage: 42 },
    { feature: 'API Testing', usage: 38 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Usage analytics and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-success">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="usage" className="space-y-4">
            <div className="space-y-3">
              {usageData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.feature}</span>
                    <span className="text-muted-foreground">{item.usage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="performance">
            <div className="py-8 text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Performance metrics will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rocket, ExternalLink, Settings, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected';
  lastDeploy?: string;
  url?: string;
}

export const HostingIntegration = () => {
  const [platforms] = useState<Platform[]>([
    { id: '1', name: 'Vercel', icon: '▲', status: 'connected', lastDeploy: '2 hours ago', url: 'https://project.vercel.app' },
    { id: '2', name: 'Netlify', icon: '◆', status: 'connected', lastDeploy: '1 day ago', url: 'https://project.netlify.app' },
    { id: '3', name: 'AWS', icon: '☁', status: 'disconnected' },
    { id: '4', name: 'Railway', icon: '🚂', status: 'disconnected' },
  ]);

  const handleDeploy = (platformName: string) => {
    toast.success(`Deploying to ${platformName}...`);
  };

  const handleConnect = (platformName: string) => {
    toast.success(`Connected to ${platformName}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hosting Integration</CardTitle>
        <CardDescription>One-click deployment to various platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    <span className="text-xl">{platform.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{platform.name}</p>
                      {platform.status === 'connected' && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    {platform.lastDeploy && (
                      <p className="text-sm text-muted-foreground">
                        Last deployed: {platform.lastDeploy}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {platform.status === 'connected' ? (
                    <>
                      {platform.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(platform.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeploy(platform.name)}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => handleConnect(platform.name)}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

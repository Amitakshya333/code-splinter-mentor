  import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const CloudStorageSync = () => {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSync, setLastSync] = useState('2 minutes ago');
  const [progress, setProgress] = useState(100);

  const handleSync = () => {
    setSyncStatus('syncing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncStatus('synced');
          setLastSync('Just now');
          toast.success('Project synced successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-warning animate-spin" />;
      case 'offline':
        return <CloudOff className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Cloud Storage</span>
          <Button size="sm" onClick={handleSync} disabled={syncStatus === 'syncing'}>
            <Cloud className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
        </CardTitle>
        <CardDescription>Sync projects across devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getSyncIcon()}
              <div>
                <p className="font-medium">Sync Status</p>
                <p className="text-sm text-muted-foreground">Last synced: {lastSync}</p>
              </div>
            </div>
            <Badge variant={syncStatus === 'synced' ? 'default' : 'secondary'}>
              {syncStatus}
            </Badge>
          </div>

          {syncStatus === 'syncing' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Syncing your project...</p>
              <Progress value={progress} />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">234 MB / 5 GB</span>
            </div>
            <Progress value={4.68} />
          </div>

          <div className="pt-4 space-y-2 text-sm">
            <p className="font-medium">Connected Devices</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span>MacBook Pro</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span>Windows Desktop</span>
                <Badge variant="secondary">2 days ago</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

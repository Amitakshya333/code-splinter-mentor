import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCodeCache } from '@/hooks/useCodeCache';
import { useProgressiveLoading } from '@/hooks/useProgressiveLoading';
import { 
  Zap, 
  HardDrive, 
  Clock, 
  BarChart3, 
  Trash2, 
  RefreshCw,
  Gauge,
  Database
} from 'lucide-react';

export const PerformancePanel = () => {
  const { getCacheStats, clearCache, cacheSize } = useCodeCache();
  const { loadingMetrics, preloadResources } = useProgressiveLoading();
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0 });
  const [performanceScore, setPerformanceScore] = useState(85);

  useEffect(() => {
    // Simulate memory usage monitoring
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage({
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        });
      } else {
        // Fallback simulation
        setMemoryUsage({
          used: Math.round(Math.random() * 50 + 20),
          total: 100,
        });
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const cacheStats = getCacheStats();
  const memoryPercentage = (memoryUsage.used / memoryUsage.total) * 100;

  const optimizePerformance = async () => {
    // Simulate performance optimization
    await preloadResources(['syntax-highlight', 'themes', 'autocomplete']);
    setPerformanceScore(Math.min(100, performanceScore + 5));
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Performance
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Performance Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Performance Score</span>
            <Badge variant="outline" className={getPerformanceColor(performanceScore)}>
              {performanceScore}/100
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-2" />
        </div>

        <Separator />

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm font-medium">Memory Usage</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{memoryUsage.used} MB used</span>
              <span>{memoryUsage.total} MB total</span>
            </div>
            <Progress value={memoryPercentage} className="h-2" />
          </div>
        </div>

        <Separator />

        {/* Cache Statistics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Cache Status</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="text-muted-foreground">Entries</div>
              <div className="font-medium">{cacheSize}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Size</div>
              <div className="font-medium">{formatBytes(cacheStats.totalSize)}</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {cacheStats.usage}
          </div>
          
          <Button size="sm" variant="outline" onClick={clearCache} className="w-full">
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Cache
          </Button>
        </div>

        <Separator />

        {/* Loading Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Loading Metrics</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="text-muted-foreground">Total Time</div>
              <div className="font-medium">{loadingMetrics.totalTime}ms</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Steps</div>
              <div className="font-medium">{loadingMetrics.stepsCompleted}</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Avg: {Math.round(loadingMetrics.averageStepTime)}ms per step
          </div>
        </div>

        <Separator />

        {/* Optimization Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Optimization</span>
          </div>
          
          <div className="space-y-2">
            <Button size="sm" onClick={optimizePerformance} className="w-full">
              <RefreshCw className="h-3 w-3 mr-1" />
              Optimize Performance
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">
                <BarChart3 className="h-3 w-3 mr-1" />
                Analyze
              </Button>
              <Button size="sm" variant="outline">
                <Database className="h-3 w-3 mr-1" />
                Preload
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Performance Tips</h4>
          <ScrollArea className="max-h-24">
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>• Enable progressive loading for faster startup</div>
              <div>• Use caching for frequently accessed code</div>
              <div>• Clear unused cache entries regularly</div>
              <div>• Monitor memory usage during long sessions</div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitBranch, GitCompare, History } from 'lucide-react';

export const GitVisualDiff = () => {
  const [diffView, setDiffView] = useState<'split' | 'unified'>('split');

  const changes = [
    { file: 'src/components/Header.tsx', additions: 12, deletions: 3 },
    { file: 'src/pages/Index.tsx', additions: 5, deletions: 8 },
    { file: 'src/styles/global.css', additions: 20, deletions: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Visual Diff</span>
          <div className="flex gap-2">
            <Button
              variant={diffView === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDiffView('split')}
            >
              Split
            </Button>
            <Button
              variant={diffView === 'unified' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDiffView('unified')}
            >
              Unified
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Compare changes visually</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="changes">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="changes">
              <GitCompare className="w-4 h-4 mr-2" />
              Changes
            </TabsTrigger>
            <TabsTrigger value="branches">
              <GitBranch className="w-4 h-4 mr-2" />
              Branches
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="changes">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {changes.map((change, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-mono text-sm">{change.file}</p>
                      <div className="flex gap-2">
                        <span className="text-sm text-success">+{change.additions}</span>
                        <span className="text-sm text-destructive">-{change.deletions}</span>
                      </div>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      {diffView === 'split' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-destructive/10 rounded">
                            <div className="text-destructive">- old code</div>
                          </div>
                          <div className="p-2 bg-success/10 rounded">
                            <div className="text-success">+ new code</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="p-1 bg-destructive/10 text-destructive">- old code</div>
                          <div className="p-1 bg-success/10 text-success">+ new code</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="branches">
            <div className="py-8 text-center text-muted-foreground">
              <p>Branch comparison will appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="py-8 text-center text-muted-foreground">
              <p>Commit history comparison will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

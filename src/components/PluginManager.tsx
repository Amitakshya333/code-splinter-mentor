import { useState } from 'react';
import { usePlugins } from '@/hooks/usePlugins';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Puzzle, Download, Trash2, Search, Settings2 } from 'lucide-react';

export const PluginManager = () => {
  const { plugins, togglePlugin, uninstallPlugin } = usePlugins();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <Puzzle className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Plugin Manager</h2>
      </div>

      <Tabs defaultValue="installed" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <TabsContent value="installed" className="flex-1">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {filteredPlugins.map((plugin) => (
                <Card key={plugin.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {plugin.name}
                          <Badge variant={plugin.enabled ? "default" : "secondary"}>
                            {plugin.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {plugin.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>v{plugin.version}</span>
                          <span>•</span>
                          <span>by {plugin.author}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={plugin.enabled}
                          onCheckedChange={() => togglePlugin(plugin.id)}
                        />
                        <span className="text-sm">
                          {plugin.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => uninstallPlugin(plugin.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="marketplace" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Plugin Marketplace</CardTitle>
              <CardDescription>
                Discover and install new plugins to extend functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Download className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Marketplace coming soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

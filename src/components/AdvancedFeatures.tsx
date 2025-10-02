import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PluginManager } from './PluginManager';
import { WorkspaceManager } from './WorkspaceManager';
import { GlobalSearch } from './GlobalSearch';
import { CodeNavigation } from './CodeNavigation';
import { LiveCodingSession } from './LiveCodingSession';

export const AdvancedFeatures = () => {
  return (
    <Tabs defaultValue="plugins" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="plugins">Plugins</TabsTrigger>
        <TabsTrigger value="workspace">Workspace</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="navigation">Navigate</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
      </TabsList>

      <TabsContent value="plugins" className="flex-1">
        <PluginManager />
      </TabsContent>

      <TabsContent value="workspace" className="flex-1">
        <WorkspaceManager />
      </TabsContent>

      <TabsContent value="search" className="flex-1">
        <GlobalSearch />
      </TabsContent>

      <TabsContent value="navigation" className="flex-1">
        <CodeNavigation />
      </TabsContent>

      <TabsContent value="live" className="flex-1">
        <LiveCodingSession />
      </TabsContent>
    </Tabs>
  );
};

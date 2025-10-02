import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench } from "lucide-react";
import { PackageManager } from "./PackageManager";
import { DatabaseBrowser } from "./DatabaseBrowser";
import { APITester } from "./APITester";
import { PerformanceProfiler } from "./PerformanceProfiler";

export const DeveloperTools = () => {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Developer Tools</h3>
      </div>

      <Tabs defaultValue="packages" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="flex-1 mt-4">
          <PackageManager />
        </TabsContent>

        <TabsContent value="database" className="flex-1 mt-4">
          <DatabaseBrowser />
        </TabsContent>

        <TabsContent value="api" className="flex-1 mt-4">
          <APITester />
        </TabsContent>

        <TabsContent value="performance" className="flex-1 mt-4">
          <PerformanceProfiler />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

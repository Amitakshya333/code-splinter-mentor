import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { EnvironmentManager } from "./EnvironmentManager";

export const SettingsPanel = () => {
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Settings</h3>
      </div>

      <Tabs defaultValue="theme" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="flex-1 mt-4">
          <ThemeCustomizer />
        </TabsContent>

        <TabsContent value="shortcuts" className="flex-1 mt-4">
          <KeyboardShortcuts />
        </TabsContent>

        <TabsContent value="environment" className="flex-1 mt-4">
          <EnvironmentManager />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

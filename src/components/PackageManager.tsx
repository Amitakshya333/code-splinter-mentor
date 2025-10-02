import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Download, Trash2, Package, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  dev: boolean;
}

export const PackageManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [installing, setInstalling] = useState(false);
  const [packages] = useState<PackageInfo[]>([
    { name: "react", version: "18.3.1", description: "React library", dev: false },
    { name: "typescript", version: "5.6.3", description: "TypeScript language", dev: true },
    { name: "vite", version: "5.4.8", description: "Build tool", dev: true },
    { name: "tailwindcss", version: "3.4.17", description: "CSS framework", dev: true },
  ]);

  const handleInstall = async (packageName: string) => {
    setInstalling(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Package installed",
      description: `${packageName} has been installed successfully`,
    });
    setInstalling(false);
  };

  const handleUninstall = async (packageName: string) => {
    toast({
      title: "Package removed",
      description: `${packageName} has been removed`,
    });
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Package Manager</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search or install packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => handleInstall(searchQuery)}
          disabled={!searchQuery || installing}
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
        <Button variant="outline" size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.name}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pkg.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pkg.version}
                  </Badge>
                  {pkg.dev && (
                    <Badge variant="outline" className="text-xs">
                      dev
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUninstall(pkg.name)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

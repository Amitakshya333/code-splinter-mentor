import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnvVariable {
  key: string;
  value: string;
  hidden: boolean;
}

export const EnvironmentManager = () => {
  const { toast } = useToast();
  const [envVars, setEnvVars] = useState<EnvVariable[]>([
    { key: "API_URL", value: "https://api.example.com", hidden: false },
    { key: "API_KEY", value: "sk_test_123456789", hidden: true },
  ]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addVariable = () => {
    if (newKey && newValue) {
      setEnvVars([...envVars, { key: newKey, value: newValue, hidden: true }]);
      setNewKey("");
      setNewValue("");
      toast({
        title: "Variable added",
        description: `${newKey} has been added to environment`,
      });
    }
  };

  const removeVariable = (key: string) => {
    setEnvVars(envVars.filter((v) => v.key !== key));
    toast({
      title: "Variable removed",
      description: `${key} has been removed`,
    });
  };

  const toggleVisibility = (key: string) => {
    setEnvVars(
      envVars.map((v) => (v.key === key ? { ...v, hidden: !v.hidden } : v))
    );
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Environment Variables</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Input
          placeholder="Variable name"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            type="password"
          />
          <Button onClick={addVariable}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {envVars.map((envVar) => (
            <div
              key={envVar.key}
              className="flex items-center gap-2 p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{envVar.key}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {envVar.hidden ? "••••••••••••" : envVar.value}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleVisibility(envVar.key)}
              >
                {envVar.hidden ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVariable(envVar.key)}
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

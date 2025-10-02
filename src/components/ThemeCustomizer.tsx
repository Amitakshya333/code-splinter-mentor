import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ThemeCustomizer = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState({
    primaryColor: "#0ea5e9",
    fontSize: "14",
    fontFamily: "Inter",
    borderRadius: "0.5",
  });

  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--font-size-base", `${theme.fontSize}px`);
    root.style.setProperty("--font-family", theme.fontFamily);
    root.style.setProperty("--radius", `${theme.borderRadius}rem`);
    
    toast({
      title: "Theme applied",
      description: "Your custom theme has been applied successfully",
    });
  };

  const resetTheme = () => {
    setTheme({
      primaryColor: "#0ea5e9",
      fontSize: "14",
      fontFamily: "Inter",
      borderRadius: "0.5",
    });
    toast({
      title: "Theme reset",
      description: "Theme has been reset to defaults",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Theme Customization</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="primary-color"
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="w-20 h-10"
            />
            <Input
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="font-size">Font Size</Label>
          <Select
            value={theme.fontSize}
            onValueChange={(value) => setTheme({ ...theme, fontSize: value })}
          >
            <SelectTrigger id="font-size" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">Small (12px)</SelectItem>
              <SelectItem value="14">Medium (14px)</SelectItem>
              <SelectItem value="16">Large (16px)</SelectItem>
              <SelectItem value="18">Extra Large (18px)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="font-family">Font Family</Label>
          <Select
            value={theme.fontFamily}
            onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}
          >
            <SelectTrigger id="font-family" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
              <SelectItem value="Fira Code">Fira Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="border-radius">Border Radius</Label>
          <Select
            value={theme.borderRadius}
            onValueChange={(value) => setTheme({ ...theme, borderRadius: value })}
          >
            <SelectTrigger id="border-radius" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="0.25">Small</SelectItem>
              <SelectItem value="0.5">Medium</SelectItem>
              <SelectItem value="0.75">Large</SelectItem>
              <SelectItem value="1">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={applyTheme} className="flex-1">
            Apply Theme
          </Button>
          <Button onClick={resetTheme} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

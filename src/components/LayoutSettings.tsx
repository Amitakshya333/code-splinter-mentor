import React from 'react';
import { Settings, Monitor, Sun, Moon, Smartphone, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLayoutSettings, Theme } from '@/hooks/useLayoutSettings';

interface LayoutSettingsProps {
  className?: string;
}

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({ className }) => {
  const { settings, updateSetting, resetToDefaults } = useLayoutSettings();

  const handleThemeChange = (theme: Theme) => {
    updateSetting('theme', theme);
  };

  const themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: Sun, description: 'Clean light interface' },
    { value: 'dark' as Theme, label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'amoled' as Theme, label: 'AMOLED', icon: Smartphone, description: 'Pure black theme' }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 hover:bg-accent ${className}`}
          title="Layout Settings"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open layout settings</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[400px] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Settings className="h-5 w-5" />
            Layout Settings
            <Badge variant="outline" className="ml-auto text-xs">
              Real-time
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Layout Controls */}
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Panel Sizes
              </h3>

              {/* Main Content Width */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Code Editor Width</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {settings.mainContentWidth}%
                  </span>
                </div>
                <Slider
                  value={[settings.mainContentWidth]}
                  onValueChange={([value]) => {
                    updateSetting('mainContentWidth', value);
                    // Auto-adjust sidebar width to maintain 100% total
                    if (settings.sidebarVisible) {
                      updateSetting('sidebarWidth', 100 - value);
                    }
                  }}
                  min={50}
                  max={85}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Code Editor Height */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Code Editor Height</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {settings.codeEditorHeight}%
                  </span>
                </div>
                <Slider
                  value={[settings.codeEditorHeight]}
                  onValueChange={([value]) => {
                    updateSetting('codeEditorHeight', value);
                    updateSetting('consoleHeight', 100 - value);
                  }}
                  min={30}
                  max={80}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Sidebar Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.sidebarVisible ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label className="text-sm text-muted-foreground">Show Sidebar</Label>
                </div>
                <Switch
                  checked={settings.sidebarVisible}
                  onCheckedChange={(checked) => updateSetting('sidebarVisible', checked)}
                />
              </div>

              {/* Sidebar Width (only if visible) */}
              {settings.sidebarVisible && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Sidebar Width</Label>
                    <span className="text-xs text-muted-foreground font-mono">
                      {settings.sidebarWidth}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.sidebarWidth]}
                    onValueChange={([value]) => {
                      updateSetting('sidebarWidth', value);
                      // Auto-adjust main content width to maintain 100% total
                      updateSetting('mainContentWidth', 100 - value);
                    }}
                    min={15}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="border-border/50" />

          {/* Theme Selection */}
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Theme</h3>
              
              <div className="grid gap-3">
                {themeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${settings.theme === option.value 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border/50 hover:border-border hover:bg-accent/50'
                      }
                    `}
                    onClick={() => handleThemeChange(option.value)}
                  >
                    <div className={`
                      p-2 rounded-md transition-colors
                      ${settings.theme === option.value 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      <option.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">
                        {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>

                    {settings.theme === option.value && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator className="border-border/50" />

          {/* Reset Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="gap-2 text-muted-foreground hover:text-foreground border-border/50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
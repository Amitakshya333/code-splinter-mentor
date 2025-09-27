import React, { useState, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layout, 
  Monitor, 
  Maximize, 
  Split, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff,
  Settings,
  Grid,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom
} from 'lucide-react';
import { useAppStore, LayoutPreset } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface LayoutPresetCardProps {
  preset: LayoutPreset;
  isActive: boolean;
  onApply: (id: string) => void;
  onDelete: (id: string) => void;
}

const LayoutPresetCard = memo<LayoutPresetCardProps>(({ preset, isActive, onApply, onDelete }) => {
  return (
    <Card className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-primary bg-accent/50' : 'hover:bg-accent/30'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{preset.name}</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onApply(preset.id);
              }}
              className="h-6 w-6 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
            {preset.id !== 'default' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(preset.id);
                }}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mini layout preview */}
        <div className="bg-muted rounded-sm p-2 mb-2">
          <div className="flex gap-1 h-8">
            {preset.showExplorer && (
              <div 
                className="bg-blue-500/20 rounded-sm"
                style={{ width: `${preset.explorerWidth}%` }}
              />
            )}
            <div className="flex-1 flex flex-col gap-1">
              <div 
                className="bg-green-500/20 rounded-sm"
                style={{ height: `${preset.editorHeight}%` }}
              />
              <div 
                className="bg-orange-500/20 rounded-sm"
                style={{ height: `${preset.consoleHeight}%` }}
              />
            </div>
            {preset.showSidebar && (
              <div 
                className="bg-purple-500/20 rounded-sm"
                style={{ width: `${preset.sidebarWidth}%` }}
              />
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            E:{preset.editorWidth}%
          </Badge>
          {preset.showSidebar && (
            <Badge variant="outline" className="text-xs">
              S:{preset.sidebarWidth}%
            </Badge>
          )}
          {preset.showExplorer && (
            <Badge variant="outline" className="text-xs">
              F:{preset.explorerWidth}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

LayoutPresetCard.displayName = 'LayoutPresetCard';

export const LayoutManager = memo(() => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  
  const {
    layoutPresets,
    currentLayoutPreset,
    layoutSettings,
    updateLayoutSettings,
    addLayoutPreset,
    deleteLayoutPreset,
    applyLayoutPreset,
    setCurrentLayoutPreset
  } = useAppStore();

  const { toast } = useToast();

  const handleApplyPreset = useCallback((presetId: string) => {
    applyLayoutPreset(presetId);
    setCurrentLayoutPreset(presetId);
    toast({
      title: "Layout Applied",
      description: "Layout preset has been applied",
    });
  }, [applyLayoutPreset, setCurrentLayoutPreset, toast]);

  const handleDeletePreset = useCallback((presetId: string) => {
    const preset = layoutPresets.find(p => p.id === presetId);
    if (preset && confirm(`Delete layout preset "${preset.name}"?`)) {
      deleteLayoutPreset(presetId);
      if (currentLayoutPreset === presetId) {
        setCurrentLayoutPreset('default');
        applyLayoutPreset('default');
      }
      toast({
        title: "Preset Deleted",
        description: `"${preset.name}" has been deleted`,
      });
    }
  }, [layoutPresets, currentLayoutPreset, deleteLayoutPreset, setCurrentLayoutPreset, applyLayoutPreset, toast]);

  const handleCreatePreset = useCallback(() => {
    if (!newPresetName.trim()) return;

    const newPreset: Omit<LayoutPreset, 'id'> = {
      name: newPresetName.trim(),
      ...layoutSettings
    };

    addLayoutPreset(newPreset);
    setNewPresetName('');
    setShowCreateDialog(false);
    
    toast({
      title: "Preset Created",
      description: `"${newPresetName.trim()}" has been saved`,
    });
  }, [newPresetName, layoutSettings, addLayoutPreset, toast]);

  const handleLayoutSettingChange = useCallback((key: keyof typeof layoutSettings, value: any) => {
    updateLayoutSettings({ [key]: value });
    // Clear current preset since we're customizing
    if (currentLayoutPreset) {
      setCurrentLayoutPreset(null);
    }
  }, [updateLayoutSettings, currentLayoutPreset, setCurrentLayoutPreset]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout Manager
          </CardTitle>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Save className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Layout Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Preset name..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                />
                <div className="text-sm text-muted-foreground">
                  This will save your current layout settings as a new preset.
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePreset}>
                    Save Preset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-hidden">
        {/* Quick Layout Presets */}
        <div>
          <h3 className="text-sm font-medium mb-2">Layout Presets</h3>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-1 gap-2">
              {layoutPresets.map(preset => (
                <LayoutPresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={currentLayoutPreset === preset.id}
                  onApply={handleApplyPreset}
                  onDelete={handleDeletePreset}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Panel Visibility */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Panel Visibility</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-explorer" className="text-sm flex items-center gap-2">
              <PanelLeft className="h-4 w-4" />
              File Explorer
            </Label>
            <Switch
              id="show-explorer"
              checked={layoutSettings.showExplorer}
              onCheckedChange={(checked) => handleLayoutSettingChange('showExplorer', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="show-sidebar" className="text-sm flex items-center gap-2">
              <PanelRight className="h-4 w-4" />
              Right Sidebar
            </Label>
            <Switch
              id="show-sidebar"
              checked={layoutSettings.showSidebar}
              onCheckedChange={(checked) => handleLayoutSettingChange('showSidebar', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Width Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Panel Widths</h3>
          
          {layoutSettings.showExplorer && (
            <div className="space-y-2">
              <Label className="text-sm">Explorer Width: {layoutSettings.explorerWidth}%</Label>
              <Slider
                value={[layoutSettings.explorerWidth]}
                onValueChange={([value]) => handleLayoutSettingChange('explorerWidth', value)}
                min={10}
                max={40}
                step={5}
                className="w-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label className="text-sm">Editor Width: {layoutSettings.editorWidth}%</Label>
            <Slider
              value={[layoutSettings.editorWidth]}
              onValueChange={([value]) => handleLayoutSettingChange('editorWidth', value)}
              min={30}
              max={80}
              step={5}
              className="w-full"
            />
          </div>
          
          {layoutSettings.showSidebar && (
            <div className="space-y-2">
              <Label className="text-sm">Sidebar Width: {layoutSettings.sidebarWidth}%</Label>
              <Slider
                value={[layoutSettings.sidebarWidth]}
                onValueChange={([value]) => handleLayoutSettingChange('sidebarWidth', value)}
                min={15}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Height Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Panel Heights</h3>
          
          <div className="space-y-2">
            <Label className="text-sm">Editor Height: {layoutSettings.editorHeight}%</Label>
            <Slider
              value={[layoutSettings.editorHeight]}
              onValueChange={([value]) => handleLayoutSettingChange('editorHeight', value)}
              min={30}
              max={80}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Console Height: {layoutSettings.consoleHeight}%</Label>
            <Slider
              value={[layoutSettings.consoleHeight]}
              onValueChange={([value]) => handleLayoutSettingChange('consoleHeight', value)}
              min={20}
              max={70}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApplyPreset('default')}
            className="flex-1"
          >
            <Monitor className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleApplyPreset('focus')}
            className="flex-1"
          >
            <Maximize className="h-4 w-4 mr-1" />
            Focus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

LayoutManager.displayName = 'LayoutManager';
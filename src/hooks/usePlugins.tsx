import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  settings?: Record<string, any>;
  onActivate?: () => void;
  onDeactivate?: () => void;
  commands?: PluginCommand[];
}

export interface PluginCommand {
  id: string;
  name: string;
  execute: () => void;
  shortcut?: string;
}

export const usePlugins = () => {
  const { toast } = useToast();
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'prettier-plugin',
      name: 'Prettier Formatter',
      version: '1.0.0',
      description: 'Automatic code formatting with Prettier',
      author: 'CodeSplinter',
      enabled: true,
    },
    {
      id: 'eslint-plugin',
      name: 'ESLint Linter',
      version: '1.0.0',
      description: 'Code linting and error detection',
      author: 'CodeSplinter',
      enabled: true,
    },
    {
      id: 'git-plugin',
      name: 'Git Integration',
      version: '1.0.0',
      description: 'Version control integration',
      author: 'CodeSplinter',
      enabled: false,
    },
  ]);

  const togglePlugin = useCallback((pluginId: string) => {
    setPlugins(prev => prev.map(plugin => {
      if (plugin.id === pluginId) {
        const newEnabled = !plugin.enabled;
        if (newEnabled && plugin.onActivate) {
          plugin.onActivate();
        } else if (!newEnabled && plugin.onDeactivate) {
          plugin.onDeactivate();
        }
        toast({
          title: newEnabled ? 'Plugin Enabled' : 'Plugin Disabled',
          description: `${plugin.name} has been ${newEnabled ? 'enabled' : 'disabled'}`,
        });
        return { ...plugin, enabled: newEnabled };
      }
      return plugin;
    }));
  }, [toast]);

  const installPlugin = useCallback((plugin: Omit<Plugin, 'enabled'>) => {
    setPlugins(prev => [...prev, { ...plugin, enabled: true }]);
    toast({
      title: 'Plugin Installed',
      description: `${plugin.name} has been installed successfully`,
    });
  }, [toast]);

  const uninstallPlugin = useCallback((pluginId: string) => {
    setPlugins(prev => prev.filter(p => p.id !== pluginId));
    toast({
      title: 'Plugin Uninstalled',
      description: 'Plugin has been removed',
    });
  }, [toast]);

  const updatePluginSettings = useCallback((pluginId: string, settings: Record<string, any>) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId ? { ...plugin, settings } : plugin
    ));
  }, []);

  return {
    plugins,
    togglePlugin,
    installPlugin,
    uninstallPlugin,
    updatePluginSettings,
  };
};

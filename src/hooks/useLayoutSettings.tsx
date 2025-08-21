import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'amoled';

export interface LayoutSettings {
  // Panel sizes (percentages)
  mainContentWidth: number;
  sidebarWidth: number;
  codeEditorHeight: number;
  consoleHeight: number;
  
  // Visibility
  sidebarVisible: boolean;
  
  // Theme
  theme: Theme;
}

const defaultSettings: LayoutSettings = {
  mainContentWidth: 75,
  sidebarWidth: 25,
  codeEditorHeight: 65,
  consoleHeight: 35,
  sidebarVisible: true,
  theme: 'dark'
};

export const useLayoutSettings = () => {
  const [settings, setSettings] = useState<LayoutSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codesplinter-layout-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Failed to load layout settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('codesplinter-layout-settings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save layout settings:', error);
      }
    }
  }, [settings, isLoaded]);

  // Apply theme changes to document
  useEffect(() => {
    if (isLoaded) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'amoled');
      
      if (settings.theme === 'amoled') {
        root.classList.add('dark', 'amoled');
      } else {
        root.classList.add(settings.theme);
      }
    }
  }, [settings.theme, isLoaded]);

  const updateSetting = <K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSetting,
    resetToDefaults,
    isLoaded
  };
};
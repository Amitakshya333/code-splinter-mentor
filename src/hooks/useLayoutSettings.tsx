import { useState, useEffect, useCallback, useMemo } from 'react';

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
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const saved = localStorage.getItem('codesplinter-layout-settings');
        if (saved && isMounted) {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.warn('Failed to load layout settings:', error);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save settings to localStorage whenever they change (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('codesplinter-layout-settings', JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save layout settings:', error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [settings, isLoaded]);

  // Apply theme changes to document (memoized)
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'amoled');
    
    if (settings.theme === 'amoled') {
      root.classList.add('dark', 'amoled');
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme, isLoaded]);

  // Memoized update function to prevent unnecessary re-renders
  const updateSetting = useCallback(<K extends keyof LayoutSettings>(
    key: K,
    value: LayoutSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    settings,
    updateSetting,
    resetToDefaults,
    isLoaded
  }), [settings, updateSetting, resetToDefaults, isLoaded]);
};
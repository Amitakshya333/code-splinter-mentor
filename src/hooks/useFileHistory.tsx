import { useState, useCallback, useEffect } from 'react';

export interface FileVersion {
  id: string;
  fileId: string;
  content: string;
  timestamp: number;
  message: string;
}

export const useFileHistory = (fileId: string) => {
  const [history, setHistory] = useState<FileVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<number>(0);

  useEffect(() => {
    // Load history from localStorage
    const key = `file-history-${fileId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        setCurrentVersion(parsed.length - 1);
      } catch (e) {
        console.error('Failed to parse file history', e);
      }
    }
  }, [fileId]);

  const saveVersion = useCallback((content: string, message: string = 'Auto-save') => {
    const version: FileVersion = {
      id: `${Date.now()}-${Math.random()}`,
      fileId,
      content,
      timestamp: Date.now(),
      message,
    };

    setHistory(prev => {
      const updated = [...prev, version];
      // Keep only last 50 versions
      const limited = updated.slice(-50);
      
      // Save to localStorage
      const key = `file-history-${fileId}`;
      localStorage.setItem(key, JSON.stringify(limited));
      
      return limited;
    });

    setCurrentVersion(history.length);
  }, [fileId, history.length]);

  const restoreVersion = useCallback((versionIndex: number): string | null => {
    if (versionIndex >= 0 && versionIndex < history.length) {
      setCurrentVersion(versionIndex);
      return history[versionIndex].content;
    }
    return null;
  }, [history]);

  const clearHistory = useCallback(() => {
    const key = `file-history-${fileId}`;
    localStorage.removeItem(key);
    setHistory([]);
    setCurrentVersion(0);
  }, [fileId]);

  return {
    history,
    currentVersion,
    saveVersion,
    restoreVersion,
    clearHistory,
    canUndo: currentVersion > 0,
    canRedo: currentVersion < history.length - 1,
  };
};

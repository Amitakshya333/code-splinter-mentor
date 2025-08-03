import { useState, useEffect, useCallback } from 'react';

interface CachedCode {
  id: string;
  language: string;
  content: string;
  timestamp: string;
  filename?: string;
}

interface CacheConfig {
  maxEntries: number;
  maxAge: number; // in milliseconds
}

const DEFAULT_CONFIG: CacheConfig = {
  maxEntries: 50,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export const useCodeCache = (config: Partial<CacheConfig> = {}) => {
  const [cache, setCache] = useState<Map<string, CachedCode>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Load cache from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('lovable_code_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        const cacheMap = new Map<string, CachedCode>();
        
        // Filter out expired entries
        const now = Date.now();
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          const age = now - new Date(value.timestamp).getTime();
          if (age < finalConfig.maxAge) {
            cacheMap.set(key, value);
          }
        });
        
        setCache(cacheMap);
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
    }
    setIsLoading(false);
  }, [finalConfig.maxAge]);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    if (cache.size === 0) return;
    
    try {
      const cacheObject = Object.fromEntries(cache);
      localStorage.setItem('lovable_code_cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }, [cache]);

  const saveToCache = useCallback((id: string, language: string, content: string, filename?: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      
      // Remove oldest entries if we're at the limit
      if (newCache.size >= finalConfig.maxEntries) {
        const oldestKey = Array.from(newCache.keys())[0];
        newCache.delete(oldestKey);
      }
      
      newCache.set(id, {
        id,
        language,
        content,
        timestamp: new Date().toISOString(),
        filename,
      });
      
      return newCache;
    });
  }, [finalConfig.maxEntries]);

  const loadFromCache = useCallback((id: string): CachedCode | null => {
    const cached = cache.get(id);
    if (!cached) return null;
    
    // Check if expired
    const age = Date.now() - new Date(cached.timestamp).getTime();
    if (age > finalConfig.maxAge) {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(id);
        return newCache;
      });
      return null;
    }
    
    return cached;
  }, [cache, finalConfig.maxAge]);

  const searchCache = useCallback((query: string): CachedCode[] => {
    const results: CachedCode[] = [];
    const normalizedQuery = query.toLowerCase();
    
    cache.forEach(cached => {
      if (
        cached.content.toLowerCase().includes(normalizedQuery) ||
        cached.filename?.toLowerCase().includes(normalizedQuery) ||
        cached.language.toLowerCase().includes(normalizedQuery)
      ) {
        results.push(cached);
      }
    });
    
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
    localStorage.removeItem('lovable_code_cache');
  }, []);

  const removeFromCache = useCallback((id: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(id);
      return newCache;
    });
  }, []);

  const getCacheStats = useCallback(() => {
    const entries = Array.from(cache.values());
    const totalSize = entries.reduce((acc, entry) => acc + entry.content.length, 0);
    const oldestEntry = entries.reduce((oldest, entry) => 
      new Date(entry.timestamp) < new Date(oldest?.timestamp || Date.now()) ? entry : oldest
    , null as CachedCode | null);
    
    return {
      entryCount: cache.size,
      totalSize,
      oldestEntry: oldestEntry?.timestamp,
      usage: `${cache.size}/${finalConfig.maxEntries} entries`,
    };
  }, [cache, finalConfig.maxEntries]);

  return {
    saveToCache,
    loadFromCache,
    searchCache,
    clearCache,
    removeFromCache,
    getCacheStats,
    isLoading,
    cacheSize: cache.size,
  };
};
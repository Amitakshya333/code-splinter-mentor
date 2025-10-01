import { memo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, FileCode } from 'lucide-react';
import { useAppStore, FileItem } from '@/store/useAppStore';

interface RecentFile {
  file: FileItem;
  lastAccessed: number;
}

export const RecentFiles = memo(() => {
  const { files, currentFile, setCurrentFile, setCurrentCode, setCurrentLanguage } = useAppStore();
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  useEffect(() => {
    // Load recent files from localStorage
    const stored = localStorage.getItem('recentFiles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentFiles(parsed);
      } catch (e) {
        console.error('Failed to parse recent files', e);
      }
    }
  }, []);

  useEffect(() => {
    // Update recent files when current file changes
    if (currentFile) {
      const file = files.find(f => f.id === currentFile);
      if (file) {
        setRecentFiles(prev => {
          const filtered = prev.filter(rf => rf.file.id !== currentFile);
          const updated = [
            { file, lastAccessed: Date.now() },
            ...filtered,
          ].slice(0, 10); // Keep only 10 most recent

          // Save to localStorage
          localStorage.setItem('recentFiles', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [currentFile, files]);

  const handleFileSelect = (file: FileItem) => {
    setCurrentFile(file.id);
    if (file.code) setCurrentCode(file.code);
    if (file.language) setCurrentLanguage(file.language);
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (recentFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent files
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Files
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-1 p-2">
            {recentFiles.map(({ file, lastAccessed }) => (
              <Button
                key={file.id}
                variant={currentFile === file.id ? 'secondary' : 'ghost'}
                className="w-full justify-start h-auto py-2 px-3"
                onClick={() => handleFileSelect(file)}
              >
                <FileCode className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getTimeAgo(lastAccessed)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

RecentFiles.displayName = 'RecentFiles';

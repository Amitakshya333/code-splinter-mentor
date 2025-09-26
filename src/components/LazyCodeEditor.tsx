import React, { lazy, Suspense, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the heavy Monaco Editor component
const EnhancedCodeEditor = lazy(() => 
  import('@/components/EnhancedCodeEditor').then(module => ({
    default: module.EnhancedCodeEditor
  }))
);

interface LazyCodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onRun?: (code: string, language: string) => void;
}

// Loading skeleton for code editor
const CodeEditorSkeleton = memo(() => (
  <Card className="h-full">
    <CardContent className="p-0 h-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-muted-foreground animate-pulse" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      
      {/* Editor skeleton */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading Monaco Editor...</span>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-8 flex-shrink-0" />
              <Skeleton 
                className="h-4 flex-1" 
                style={{ width: `${Math.random() * 60 + 40}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
));

CodeEditorSkeleton.displayName = 'CodeEditorSkeleton';

// Error fallback for code editor
const CodeEditorError = memo(() => (
  <Card className="h-full">
    <CardContent className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="mx-auto p-3 rounded-full bg-destructive/10">
          <Code2 className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold">Failed to load Code Editor</h3>
          <p className="text-sm text-muted-foreground mt-1">
            The code editor could not be loaded. Please refresh the page.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
));

CodeEditorError.displayName = 'CodeEditorError';

// Main lazy code editor component
export const LazyCodeEditor = memo<LazyCodeEditorProps>(({ 
  onCodeChange, 
  onLanguageChange, 
  onRun 
}) => {
  return (
    <ErrorBoundary fallback={<CodeEditorError />}>
      <Suspense fallback={<CodeEditorSkeleton />}>
        <EnhancedCodeEditor
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
          onRun={onRun}
        />
      </Suspense>
    </ErrorBoundary>
  );
});

LazyCodeEditor.displayName = 'LazyCodeEditor';
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Header } from "@/components/Header";
import { LazyCodeEditor } from "@/components/LazyCodeEditor";
import { EnhancedOutputConsole } from "@/components/EnhancedOutputConsole";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { AIChatMentor } from "@/components/AIChatMentor";
import { CollaborationPanel } from "@/components/CollaborationPanel";
import { PerformancePanel } from "@/components/PerformancePanel";
import { GitPanel } from "@/components/GitPanel";
import { EducationalHub } from "@/components/EducationalHub";
import { FeedbackSection } from "@/components/FeedbackSection";
import { LayoutSettings } from "@/components/LayoutSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useCodeCache } from "@/hooks/useCodeCache";
import { useLayoutSettings } from "@/hooks/useLayoutSettings";
import { useResponsive } from "@/hooks/useResponsive";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppStore } from "@/store/useAppStore";

// Memoized loading component
const LoadingScreen = memo(({ progress }: { progress: number }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Loading Code Editor</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Initializing components and features...
          </p>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-center text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </div>
      </CardContent>
    </Card>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

const Index = () => {
  // Use Zustand store for global state
  const {
    currentCode,
    currentLanguage,
    currentProject,
    roomId,
    userId,
    feedbackTabValue,
    setCurrentCode,
    setCurrentLanguage,
    setCurrentProject,
    setRoomId,
    setUserId,
    setFeedbackTabValue,
    updatePerformanceMetrics,
    addError
  } = useAppStore();
  
  const { isLoading, simulateLoading, overallProgress } = useProgressiveLoading();
  const { saveToCache } = useCodeCache();
  const { settings, isLoaded: layoutLoaded } = useLayoutSettings();
  const { isMobile, isDesktop } = useResponsive();

  // Initialize room ID from URL params or generate new one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRoomId = urlParams.get('room');
    if (paramRoomId) {
      setRoomId(paramRoomId);
    } else {
      const newRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(newRoomId);
      window.history.replaceState({}, '', `?room=${newRoomId}`);
    }

    // Initialize userId if not set
    if (!userId) {
      setUserId(Math.random().toString(36).substring(2, 10));
    }

    // Track performance metrics
    const startTime = performance.now();
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          updatePerformanceMetrics({
            renderTime: entry.duration,
            loadTime: performance.now() - startTime
          });
        }
      });
    });
    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, [setRoomId, setUserId, userId, updatePerformanceMetrics]);

  // Start progressive loading
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      simulateLoading().catch((error) => {
        addError('Failed to complete loading sequence', 'progressive-loading');
      });
    }, 100);

    return () => clearTimeout(loadingTimer);
  }, [simulateLoading, addError]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleRunCode = useCallback((code: string, language: string) => {
    try {
      setCurrentCode(code);
      setCurrentLanguage(language);
      
      // Cache the code
      saveToCache(`${Date.now()}`, language, code, `untitled.${getFileExtension(language)}`);
    } catch (error) {
      addError('Failed to run code', 'code-execution');
    }
  }, [setCurrentCode, setCurrentLanguage, saveToCache, addError]);

  const handleShareRoom = useCallback((roomId: string) => {
    try {
      window.history.replaceState({}, '', `?room=${roomId}`);
    } catch (error) {
      addError('Failed to update URL', 'room-sharing');
    }
  }, [addError]);

  const getFileExtension = useCallback((language: string) => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      sql: 'sql',
    };
    return extensions[language] || 'txt';
  }, []);

  const handleFeedbackClick = useCallback(() => {
    setFeedbackTabValue("feedback");
  }, [setFeedbackTabValue]);

  const handleCodeChange = useCallback((code: string) => {
    setCurrentCode(code);
  }, [setCurrentCode]);

  const handleLanguageChange = useCallback((language: string) => {
    setCurrentLanguage(language);
  }, [setCurrentLanguage]);

  const handleProjectSelect = useCallback((project: string) => {
    setCurrentProject(project);
  }, [setCurrentProject]);

  // Memoize layout calculations
  const layoutStyles = useMemo(() => ({
    mainContent: {
      width: settings.sidebarVisible && !isMobile ? `${settings.mainContentWidth}%` : '100%',
      flex: isDesktop ? '0 0 auto' : '1 1 auto'
    },
    codeEditor: {
      height: isDesktop ? `${settings.codeEditorHeight}%` : '50%',
      maxHeight: isDesktop ? `${settings.codeEditorHeight}%` : '50%'
    },
    console: {
      height: isDesktop ? `${settings.consoleHeight}%` : '50%',
      maxHeight: isDesktop ? `${settings.consoleHeight}%` : '50%'
    },
    sidebar: {
      width: isDesktop ? `${settings.sidebarWidth}%` : '100%',
      height: isMobile ? '40vh' : 'auto',
      flex: isDesktop ? '0 0 auto' : '0 0 40vh'
    }
  }), [settings, isMobile, isDesktop]);

  // Show loading screen while initializing
  if (isLoading || !layoutLoaded) {
    return <LoadingScreen progress={overallProgress} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header currentProject={currentProject} onFeedbackClick={handleFeedbackClick} />
      
      {/* Layout Settings Panel - Hidden on mobile, visible on desktop */}
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <LayoutSettings />
      </div>
      
      {/* Mobile Layout Settings - Bottom sheet on mobile */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <LayoutSettings />
      </div>
      
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col md:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div 
          className="flex flex-col p-3 md:p-6 transition-all duration-300 ease-in-out order-1 md:order-none"
          style={layoutStyles.mainContent}
        >
          {/* Code Editor */}
          <div 
            className="transition-all duration-300 ease-in-out pr-0 md:pr-3 min-h-0 mb-3 md:mb-0"
            style={layoutStyles.codeEditor}
          >
            <div className="h-full border border-border rounded-lg overflow-hidden">
              <ErrorBoundary>
                <LazyCodeEditor 
                  onCodeChange={handleCodeChange} 
                  onLanguageChange={handleLanguageChange}
                  onRun={handleRunCode}
                />
              </ErrorBoundary>
            </div>
          </div>
          
          {/* Output Console */}
          <div 
            className="pt-0 md:pt-3 pr-0 md:pr-3 transition-all duration-300 ease-in-out min-h-0"
            style={layoutStyles.console}
          >
            <div className="h-full border border-border rounded-lg overflow-hidden">
              <ErrorBoundary>
                <EnhancedOutputConsole 
                  currentCode={currentCode} 
                  currentLanguage={currentLanguage}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Bottom on mobile, right on desktop */}
        {settings.sidebarVisible && (
          <div 
            className="border-t md:border-t-0 md:border-l bg-card p-3 md:p-6 transition-all duration-300 ease-in-out overflow-hidden order-2 md:order-none"
            style={layoutStyles.sidebar}
          >
            <Tabs value={feedbackTabValue} onValueChange={setFeedbackTabValue} className="h-full w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 text-xs mb-2 md:mb-0">
                <TabsTrigger value="guidance" className="text-[10px] md:text-xs">Guide</TabsTrigger>
                <TabsTrigger value="mentor" className="text-[10px] md:text-xs">AI</TabsTrigger>
                <TabsTrigger value="collab" className="text-[10px] md:text-xs hidden md:inline-flex">Collab</TabsTrigger>
                <TabsTrigger value="perf" className="text-[10px] md:text-xs hidden md:inline-flex">Perf</TabsTrigger>
                <TabsTrigger value="git" className="text-[10px] md:text-xs hidden md:inline-flex">Git</TabsTrigger>
                <TabsTrigger value="learn" className="text-[10px] md:text-xs">Learn</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guidance" className="h-full mt-6">
                <ErrorBoundary>
                  <ProjectGuidance 
                    onProjectSelect={handleProjectSelect}
                  />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="mentor" className="h-full mt-6">
                <ErrorBoundary>
                  <AIChatMentor 
                    currentCode={currentCode}
                    currentProject={currentProject}
                  />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="collab" className="h-full mt-6">
                <ErrorBoundary>
                  <CollaborationPanel 
                    roomId={roomId}
                    userId={userId}
                    onShareRoom={handleShareRoom}
                  />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="perf" className="h-full mt-6">
                <ErrorBoundary>
                  <PerformancePanel />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="git" className="h-full mt-6">
                <ErrorBoundary>
                  <GitPanel />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="learn" className="h-full mt-6">
                <ErrorBoundary>
                  <EducationalHub onCodeUpdate={handleRunCode} />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="feedback" className="h-full mt-6">
                <ErrorBoundary>
                  <FeedbackSection />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

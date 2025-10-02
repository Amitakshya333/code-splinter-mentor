import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Header } from "@/components/Header";
import { MultiTabCodeEditor } from "@/components/MultiTabCodeEditor";
import { EnhancedOutputConsole } from "@/components/EnhancedOutputConsole";
import { FileExplorer } from "@/components/FileExplorer";
import { LayoutManager } from "@/components/LayoutManager";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { AIChatMentor } from "@/components/AIChatMentor";
import { CollaborationPanel } from "@/components/CollaborationPanel";
import { PerformancePanel } from "@/components/PerformancePanel";
import { GitPanel } from "@/components/GitPanel";
import { EducationalHub } from "@/components/EducationalHub";
import { FeedbackSection } from "@/components/FeedbackSection";
import { DeveloperTools } from "@/components/DeveloperTools";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useCodeCache } from "@/hooks/useCodeCache";
import { useResponsive } from "@/hooks/useResponsive";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppStore } from "@/store/useAppStore";
import { Terminal } from "@/components/Terminal";

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
    layoutSettings,
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

  const handleSettingsClick = useCallback(() => {
    setFeedbackTabValue("layout");
  }, [setFeedbackTabValue]);

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen progress={overallProgress} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header 
        currentProject={currentProject} 
        onFeedbackClick={handleFeedbackClick}
        onSettingsClick={handleSettingsClick}
      />
      
      <div className="h-[calc(100vh-4rem)] w-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer Panel */}
          {layoutSettings.showExplorer && (
            <>
              <ResizablePanel 
                defaultSize={layoutSettings.explorerWidth} 
                minSize={10} 
                maxSize={40}
                className="min-w-0"
              >
                <div className="h-full p-2 border-r">
                  <ErrorBoundary>
                    <FileExplorer />
                  </ErrorBoundary>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Main Editor Area */}
          <ResizablePanel 
            defaultSize={layoutSettings.editorWidth} 
            minSize={30}
            className="min-w-0"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Code Editor */}
              <ResizablePanel 
                defaultSize={layoutSettings.editorHeight} 
                minSize={30}
                className="min-h-0"
              >
                <div className="h-full p-2 pb-1">
                  <ErrorBoundary>
                    <MultiTabCodeEditor 
                      onCodeChange={handleCodeChange} 
                      onLanguageChange={handleLanguageChange}
                      onRun={handleRunCode}
                    />
                  </ErrorBoundary>
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              {/* Output Console & Terminal */}
              <ResizablePanel 
                defaultSize={layoutSettings.consoleHeight} 
                minSize={20}
                className="min-h-0"
              >
                <div className="h-full p-2 pt-1">
                  <Tabs defaultValue="output" className="h-full flex flex-col">
                    <TabsList className="w-full justify-start bg-muted/50">
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="terminal">Terminal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="output" className="flex-1 mt-2 overflow-hidden">
                      <ErrorBoundary>
                        <EnhancedOutputConsole 
                          currentCode={currentCode} 
                          currentLanguage={currentLanguage}
                        />
                      </ErrorBoundary>
                    </TabsContent>
                    <TabsContent value="terminal" className="flex-1 mt-0 overflow-hidden">
                      <ErrorBoundary>
                        <Terminal />
                      </ErrorBoundary>
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Right Sidebar */}
          {layoutSettings.showSidebar && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                defaultSize={layoutSettings.sidebarWidth} 
                minSize={15} 
                maxSize={50}
                className="min-w-0"
              >
                <div className="h-full border-l">
                  <Tabs value={feedbackTabValue} onValueChange={setFeedbackTabValue} className="h-full flex flex-col">
                    <div className="p-2 pb-0">
                      <TabsList className="grid w-full grid-cols-5 text-xs">
                        <TabsTrigger value="guidance" className="text-[10px] lg:text-xs">Guide</TabsTrigger>
                        <TabsTrigger value="mentor" className="text-[10px] lg:text-xs">AI</TabsTrigger>
                        <TabsTrigger value="learn" className="text-[10px] lg:text-xs">Learn</TabsTrigger>
                        <TabsTrigger value="devtools" className="text-[10px] lg:text-xs">Tools</TabsTrigger>
                        <TabsTrigger value="settings" className="text-[10px] lg:text-xs">Settings</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="flex-1 p-2 overflow-hidden">
                      <TabsContent value="guidance" className="h-full mt-0">
                        <ErrorBoundary>
                          <ProjectGuidance onProjectSelect={handleProjectSelect} />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="mentor" className="h-full mt-0">
                        <ErrorBoundary>
                          <AIChatMentor 
                            currentCode={currentCode}
                            currentProject={currentProject}
                          />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="layout" className="h-full mt-0">
                        <ErrorBoundary>
                          <LayoutManager />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="collab" className="h-full mt-0">
                        <ErrorBoundary>
                          <CollaborationPanel 
                            roomId={roomId}
                            userId={userId}
                            onShareRoom={handleShareRoom}
                          />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="perf" className="h-full mt-0">
                        <ErrorBoundary>
                          <PerformancePanel />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="git" className="h-full mt-0">
                        <ErrorBoundary>
                          <GitPanel />
                        </ErrorBoundary>
                      </TabsContent>
                      
                       <TabsContent value="learn" className="h-full mt-0">
                         <ErrorBoundary>
                           <EducationalHub 
                             onCodeUpdate={handleRunCode}
                             currentCode={currentCode}
                             currentLanguage={currentLanguage}
                           />
                         </ErrorBoundary>
                       </TabsContent>
                      
                       <TabsContent value="feedback" className="h-full mt-0">
                        <ErrorBoundary>
                          <FeedbackSection />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="devtools" className="h-full mt-0">
                        <ErrorBoundary>
                          <DeveloperTools />
                        </ErrorBoundary>
                      </TabsContent>
                      
                      <TabsContent value="settings" className="h-full mt-0">
                        <ErrorBoundary>
                          <SettingsPanel />
                        </ErrorBoundary>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;

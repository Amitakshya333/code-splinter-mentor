import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { EnhancedCodeEditor } from "@/components/EnhancedCodeEditor";
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useCodeCache } from "@/hooks/useCodeCache";
import { useLayoutSettings } from "@/hooks/useLayoutSettings";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("python");
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [userId] = useState<string>(() => Math.random().toString(36).substring(2, 10));
  const [feedbackTabValue, setFeedbackTabValue] = useState<string>("guidance");
  
  const { isLoading, simulateLoading, overallProgress } = useProgressiveLoading();
  const { saveToCache } = useCodeCache();
  const { settings, isLoaded: layoutLoaded } = useLayoutSettings();

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
  }, []);

  // Start progressive loading
  useEffect(() => {
    simulateLoading();
  }, [simulateLoading]);

  const handleRunCode = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    
    // Cache the code
    saveToCache(`${Date.now()}`, language, code, `untitled.${getFileExtension(language)}`);
  };

  const handleShareRoom = (roomId: string) => {
    window.history.replaceState({}, '', `?room=${roomId}`);
  };

  const getFileExtension = (language: string) => {
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
  };

  const handleFeedbackClick = () => {
    setFeedbackTabValue("feedback");
  };

  // Show loading screen while initializing
  if (isLoading || !layoutLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Loading Code Editor</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Initializing components and features...
              </p>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-center text-xs text-muted-foreground">
              {Math.round(overallProgress)}% complete
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header currentProject={currentProject} onFeedbackClick={handleFeedbackClick} />
      
      {/* Layout Settings Panel */}
      <div className="fixed top-4 right-4 z-50">
        <LayoutSettings />
      </div>
      
      <div className="h-[calc(100vh-4rem)] w-full">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full w-full"
          key={`layout-${settings.mainContentWidth}-${settings.sidebarWidth}-${settings.sidebarVisible}`}
        >
          {/* Main Content Area */}
          <ResizablePanel 
            defaultSize={settings.mainContentWidth} 
            minSize={settings.sidebarVisible ? 50 : 90} 
            maxSize={settings.sidebarVisible ? 90 : 100}
          >
            <div className="h-full w-full p-6">
              <ResizablePanelGroup 
                direction="vertical" 
                className="h-full w-full"
                key={`vertical-${settings.codeEditorHeight}-${settings.consoleHeight}`}
              >
                {/* Code Editor */}
                <ResizablePanel 
                  defaultSize={settings.codeEditorHeight} 
                  minSize={30} 
                  maxSize={80}
                >
                  <div className="h-full pr-3">
                    <EnhancedCodeEditor 
                      onCodeChange={setCurrentCode} 
                      onLanguageChange={setCurrentLanguage}
                      onRun={handleRunCode}
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Output Console */}
                <ResizablePanel 
                  defaultSize={settings.consoleHeight} 
                  minSize={20} 
                  maxSize={70}
                >
                  <div className="h-full pt-3 pr-3">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <EnhancedOutputConsole 
                        currentCode={currentCode} 
                        currentLanguage={currentLanguage}
                      />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          {settings.sidebarVisible && (
            <>
              <ResizableHandle withHandle />

              {/* Right Sidebar */}
              <ResizablePanel 
                defaultSize={settings.sidebarWidth} 
                minSize={15} 
                maxSize={45}
              >
                <div className="h-full w-full border-l bg-card p-6">
                  <Tabs value={feedbackTabValue} onValueChange={setFeedbackTabValue} className="h-full w-full">
                    <TabsList className="grid w-full grid-cols-6 text-xs">
                      <TabsTrigger value="guidance">Guide</TabsTrigger>
                      <TabsTrigger value="mentor">AI</TabsTrigger>
                      <TabsTrigger value="collab">Collab</TabsTrigger>
                      <TabsTrigger value="perf">Perf</TabsTrigger>
                      <TabsTrigger value="git">Git</TabsTrigger>
                      <TabsTrigger value="learn">Learn</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="guidance" className="h-full mt-6">
                      <ProjectGuidance 
                        onProjectSelect={setCurrentProject}
                      />
                    </TabsContent>
                    
                    <TabsContent value="mentor" className="h-full mt-6">
                      <AIChatMentor 
                        currentCode={currentCode}
                        currentProject={currentProject}
                      />
                    </TabsContent>
                    
                    <TabsContent value="collab" className="h-full mt-6">
                      <CollaborationPanel 
                        roomId={roomId}
                        userId={userId}
                        onShareRoom={handleShareRoom}
                      />
                    </TabsContent>
                    
                    <TabsContent value="perf" className="h-full mt-6">
                      <PerformancePanel />
                    </TabsContent>
                    
                    <TabsContent value="git" className="h-full mt-6">
                      <GitPanel />
                    </TabsContent>
                    
                    <TabsContent value="learn" className="h-full mt-6">
                      <EducationalHub onCodeUpdate={handleRunCode} />
                    </TabsContent>
                    
                    <TabsContent value="feedback" className="h-full mt-6">
                      <FeedbackSection />
                    </TabsContent>
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

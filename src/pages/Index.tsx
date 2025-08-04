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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useCodeCache } from "@/hooks/useCodeCache";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("python");
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [userId] = useState<string>(() => Math.random().toString(36).substring(2, 10));
  
  const { isLoading, simulateLoading, overallProgress } = useProgressiveLoading();
  const { saveToCache } = useCodeCache();

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

  // Show loading screen while initializing
  if (isLoading) {
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
      <Header currentProject={currentProject} />
      
      <div className="h-[calc(100vh-4rem)] w-full">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Main Content Area */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full w-full p-6">
              <ResizablePanelGroup direction="vertical" className="h-full w-full">
                {/* Code Editor */}
                <ResizablePanel defaultSize={65} minSize={40}>
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
                <ResizablePanel defaultSize={35} minSize={20}>
                  <div className="h-full pt-3 pr-3">
                    <EnhancedOutputConsole 
                      currentCode={currentCode} 
                      currentLanguage={currentLanguage}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full w-full border-l bg-card p-6">
              <Tabs defaultValue="guidance" className="h-full w-full">
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
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;

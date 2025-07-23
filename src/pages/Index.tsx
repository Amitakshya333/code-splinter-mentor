import { useState } from "react";
import { Header } from "@/components/Header";
import { EnhancedCodeEditor } from "@/components/EnhancedCodeEditor";
import { EnhancedOutputConsole } from "@/components/EnhancedOutputConsole";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { AIChatMentor } from "@/components/AIChatMentor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Index = () => {
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("python");
  const [currentProject, setCurrentProject] = useState<string | null>(null);

  const handleRunCode = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentProject={currentProject} />
      
      <div className="h-[calc(100vh-4rem)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Main Content Area */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full p-6">
              <ResizablePanelGroup direction="vertical" className="h-full">
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
            <div className="h-full border-l bg-card p-6">
              <Tabs defaultValue="guidance" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="guidance">Guidance</TabsTrigger>
                  <TabsTrigger value="mentor">AI Mentor</TabsTrigger>
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
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;

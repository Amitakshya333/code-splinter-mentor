import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { AIChatMentor } from "@/components/AIChatMentor";
import { OutputConsole } from "@/components/OutputConsole";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [currentCode, setCurrentCode] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Code Editor */}
            <div className="border-r border-border">
              <CodeEditor onCodeChange={setCurrentCode} />
            </div>
            
            {/* Output Console */}
            <div>
              <OutputConsole />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-border bg-card">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent h-12">
              <TabsTrigger value="chat" className="rounded-none">AI Mentor</TabsTrigger>
              <TabsTrigger value="guidance" className="rounded-none">Project Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 m-0">
              <AIChatMentor currentCode={currentCode} />
            </TabsContent>
            
            <TabsContent value="guidance" className="flex-1 m-0 overflow-y-auto">
              <ProjectGuidance />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;

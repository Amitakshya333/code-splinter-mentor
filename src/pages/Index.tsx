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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex p-4 gap-4">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Code Editor */}
          <div className="h-1/2 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-medium overflow-hidden">
            <CodeEditor onCodeChange={setCurrentCode} />
          </div>
          
          {/* Output Display Area - More Prominent */}
          <div className="h-1/2 bg-card/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-strong overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-primary/5">
                <h3 className="text-lg font-semibold text-foreground">Output Display</h3>
                <div className="text-sm text-muted-foreground">Live Results</div>
              </div>
              <div className="flex-1">
                <OutputConsole />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-strong">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 m-1.5 rounded-xl h-11 p-1">
              <TabsTrigger value="chat" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-subtle transition-all duration-200">
                AI Mentor
              </TabsTrigger>
              <TabsTrigger value="guidance" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-subtle transition-all duration-200">
                Project Guide
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 m-0 p-1.5 pt-0">
              <div className="h-full bg-card/40 rounded-xl border border-border/30 overflow-hidden">
                <AIChatMentor currentCode={currentCode} />
              </div>
            </TabsContent>
            
            <TabsContent value="guidance" className="flex-1 m-0 p-1.5 pt-0">
              <div className="h-full bg-card/40 rounded-xl border border-border/30 overflow-hidden">
                <ProjectGuidance />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;

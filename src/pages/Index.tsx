import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { AIChatMentor } from "@/components/AIChatMentor";
import { OutputConsole } from "@/components/OutputConsole";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Zap } from "lucide-react";

const Index = () => {
  const [currentCode, setCurrentCode] = useState("");
  const [currentProject, setCurrentProject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                CodeSplinter
              </h1>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              MVP
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Your Personal Coding Mentor</span>
            </div>
            {currentProject && (
              <Badge variant="outline" className="bg-accent/10">
                Building: {currentProject}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex p-4 gap-4">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Code Workspace */}
          <div className="h-1/2 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 shadow-medium overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Code Workspace</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                Step-by-Step Guidance
              </Badge>
            </div>
            <CodeEditor onCodeChange={setCurrentCode} />
          </div>
          
          {/* Live Output & Feedback */}
          <div className="h-1/2 bg-card/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-strong overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-accent/10">
                <h3 className="text-lg font-semibold text-foreground">Live Output & Feedback</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Real-time</span>
                </div>
              </div>
              <div className="flex-1">
                <OutputConsole />
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Sidebar */}
        <div className="w-96 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-strong">
          <Tabs defaultValue="guidance" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 m-1.5 rounded-xl h-12 p-1">
              <TabsTrigger value="guidance" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-subtle transition-all duration-200 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Step Guide
              </TabsTrigger>
              <TabsTrigger value="mentor" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-subtle transition-all duration-200 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Mentor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guidance" className="flex-1 m-0 p-1.5 pt-0">
              <div className="h-full bg-card/40 rounded-xl border border-border/30 overflow-hidden">
                <ProjectGuidance onProjectSelect={setCurrentProject} />
              </div>
            </TabsContent>
            
            <TabsContent value="mentor" className="flex-1 m-0 p-1.5 pt-0">
              <div className="h-full bg-card/40 rounded-xl border border-border/30 overflow-hidden">
                <AIChatMentor currentCode={currentCode} currentProject={currentProject} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;

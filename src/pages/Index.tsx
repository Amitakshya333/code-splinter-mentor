import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Header } from "@/components/Header";
import { MultiTabCodeEditor } from "@/components/MultiTabCodeEditor";
import { EnhancedOutputConsole } from "@/components/EnhancedOutputConsole";
import { ProjectGuidance } from "@/components/ProjectGuidance";
import { AIChatMentor } from "@/components/AIChatMentor";
import { CollaborationPanel } from "@/components/CollaborationPanel";
import { FeedbackSection } from "@/components/FeedbackSection";
import { DeveloperTools } from "@/components/DeveloperTools";
import { LayoutManager } from "@/components/LayoutManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useCodeCache } from "@/hooks/useCodeCache";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppStore } from "@/store/useAppStore";
import { Terminal } from "@/components/Terminal";
import { Github, PlayCircle, Rocket, Compass, ListChecks, Bug, Sparkles, Workflow } from "lucide-react";

// Memoized loading component
const LoadingScreen = memo(({ progress }: { progress: number }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Warming up Sensei Splinter</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Initializing mentor systems and workspace...
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

LoadingScreen.displayName = "LoadingScreen";

type NavigatorTab = "steps" | "guidance" | "collab" | "systems" | "feedback";
type WorkflowStepType = "plan" | "analysis" | "build" | "debug" | "ship";

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  type: WorkflowStepType;
  action: string;
}

const Index = () => {
  const {
    currentCode,
    currentLanguage,
    currentProject,
    roomId,
    userId,
    setCurrentCode,
    setCurrentLanguage,
    setCurrentProject,
    setRoomId,
    setUserId,
    updatePerformanceMetrics,
    addError
  } = useAppStore();

  const { isLoading, simulateLoading, overallProgress } = useProgressiveLoading();
  const { saveToCache } = useCodeCache();
  const [navigatorTab, setNavigatorTab] = useState<NavigatorTab>("steps");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Initialize room ID from URL params or generate new one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRoomId = urlParams.get("room");
    if (paramRoomId) {
      setRoomId(paramRoomId);
    } else {
      const newRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(newRoomId);
      window.history.replaceState({}, "", `?room=${newRoomId}`);
    }

    if (!userId) {
      setUserId(Math.random().toString(36).substring(2, 10));
    }

    const startTime = performance.now();
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "measure") {
          updatePerformanceMetrics({
            renderTime: entry.duration,
            loadTime: performance.now() - startTime
          });
        }
      });
    });
    observer.observe({ entryTypes: ["measure"] });

    return () => observer.disconnect();
  }, [setRoomId, setUserId, userId, updatePerformanceMetrics]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      simulateLoading().catch(() => addError("Failed to complete loading sequence", "progressive-loading"));
    }, 100);

    return () => clearTimeout(loadingTimer);
  }, [simulateLoading, addError]);

  const workflowSteps: WorkflowStep[] = useMemo(() => {
    const projectName = currentProject || "your current focus";
    return [
      {
        id: "context",
        label: "Clarify Objective",
        description: `Review the goal for ${projectName} and confirm constraints.`,
        type: "plan",
        action: "Summarize requirement"
      },
      {
        id: "analysis",
        label: "Inspect Code & Signals",
        description: `Scan current ${currentLanguage} code and note blockers or risks.`,
        type: "analysis",
        action: "Run quick review"
      },
      {
        id: "implement",
        label: "Apply Change",
        description: "Edit the workspace with the mentor's recommendation.",
        type: "build",
        action: "Open workspace"
      },
      {
        id: "verify",
        label: "Verify & Debug",
        description: "Execute tests/output to be sure the change worked.",
        type: "debug",
        action: "Run check"
      },
      {
        id: "handoff",
        label: "Document & Ship",
        description: "Summarize what changed and record next steps.",
        type: "ship",
        action: "Summarize outcome"
      }
    ];
  }, [currentProject, currentLanguage]);

  useEffect(() => {
    setCompletedSteps({});
  }, [currentProject, currentLanguage]);

  const completedCount = useMemo(
    () => workflowSteps.filter((step) => completedSteps[step.id]).length,
    [workflowSteps, completedSteps]
  );

  const navigatorProgress = workflowSteps.length ? (completedCount / workflowSteps.length) * 100 : 0;

  const scrollToNavigator = () => {
    const panel = document.getElementById("navigator-panel");
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToTab = useCallback((tab: NavigatorTab) => {
    setNavigatorTab(tab);
    requestAnimationFrame(scrollToNavigator);
  }, []);

  const handleRunCode = useCallback((code: string, language: string) => {
    try {
      setCurrentCode(code);
      setCurrentLanguage(language);
      saveToCache(`${Date.now()}`, language, code, `untitled.${getFileExtension(language)}`);
    } catch (error) {
      addError("Failed to run code", "code-execution");
    }
  }, [setCurrentCode, setCurrentLanguage, saveToCache, addError]);

  const handleShareRoom = useCallback((newRoomId: string) => {
    try {
      window.history.replaceState({}, "", `?room=${newRoomId}`);
    } catch (error) {
      addError("Failed to update URL", "room-sharing");
    }
  }, [addError]);

  const getFileExtension = useCallback((language: string) => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      sql: "sql",
    };
    return extensions[language] || "txt";
  }, []);

  const handleCodeChange = useCallback((code: string) => {
    setCurrentCode(code);
  }, [setCurrentCode]);

  const handleLanguageChange = useCallback((language: string) => {
    setCurrentLanguage(language);
  }, [setCurrentLanguage]);

  const handleProjectSelect = useCallback((project: string) => {
    setCurrentProject(project);
  }, [setCurrentProject]);

  const handleStepToggle = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) {
    return <LoadingScreen progress={overallProgress} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentProject={currentProject} 
        onFeedbackClick={() => goToTab("feedback")}
        onSettingsClick={() => goToTab("systems")}
      />

      <div className="px-4 py-6 space-y-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Badge variant="outline" className="bg-primary/5 text-primary">Mentor Workspace</Badge>
          <span>Guidance-first • Workflow-aware • AI companion</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          {/* Mentor Column */}
          <div className="space-y-4" id="mentor-panel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sensei Splinter</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Online
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your technical mentor actively watches the workspace and keeps you unblocked.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">{currentLanguage.toUpperCase()} focus</Badge>
                  <Badge variant="outline">{currentProject || "No project linked"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Mentor Confidence</p>
                    <p className="text-lg font-semibold">High</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Last Insight</p>
                    <p className="text-lg font-semibold">moments ago</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => goToTab("steps")}>
                    <Workflow className="h-4 w-4 mr-2" />
                    View Navigator
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => goToTab("guidance")}>
                    <Compass className="h-4 w-4 mr-2" />
                    Guidance
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border bg-card shadow-sm h-[calc(100vh-18rem)] min-h-[500px] overflow-hidden">
              <ErrorBoundary>
                <AIChatMentor 
                  currentCode={currentCode}
                  currentProject={currentProject}
                />
              </ErrorBoundary>
            </div>
          </div>

          {/* Workspace Column */}
          <div className="space-y-4" id="workspace-panel">
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Workspace</CardTitle>
                  <CardDescription>
                    Keep edits focused—Sensei Splinter is monitoring every change.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => goToTab("collab")}>
                    <Github className="mr-2 h-4 w-4" />
                    Share Room
                  </Button>
                  <Button size="sm" onClick={() => handleRunCode(currentCode, currentLanguage)}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Run
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b bg-muted/40 px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground flex items-center justify-between">
                <span>Editor</span>
                <span>Mode • Build</span>
              </div>
              <CardContent className="p-0">
                <div className="h-[480px]">
                  <ErrorBoundary>
                    <MultiTabCodeEditor 
                      onCodeChange={handleCodeChange} 
                      onLanguageChange={handleLanguageChange}
                      onRun={handleRunCode}
                    />
                  </ErrorBoundary>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Output Review</CardTitle>
                  <CardDescription>Sensei watches the console and calls out what matters.</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px]">
                  <ErrorBoundary>
                    <EnhancedOutputConsole 
                      currentCode={currentCode} 
                      currentLanguage={currentLanguage}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Command Console</CardTitle>
                  <CardDescription>Run scripts, tests, and deployment commands.</CardDescription>
                </CardHeader>
                <CardContent className="h-[260px]">
                  <ErrorBoundary>
                    <Terminal />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigator Column */}
          <div className="space-y-4" id="navigator-panel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Navigator
                  <Badge variant="outline">
                    {completedCount}/{workflowSteps.length} steps
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Every workflow stays visible—no surprises, no aimless coding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={navigatorProgress} />
                <div className="text-xs text-muted-foreground">
                  {navigatorProgress === 0
                    ? "Start with the objective so Sensei can keep you aligned."
                    : navigatorProgress === 100
                      ? "Navigator is satisfied. Document the outcome or pick a new task."
                      : "Keep following the steps or ask the mentor for deeper context."}
                </div>
              </CardContent>
            </Card>

            <Card className="h-[calc(100vh-18rem)] min-h-[500px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Workflow Control</CardTitle>
                <CardDescription>Switch between Navigator, guidance, collaboration, and systems.</CardDescription>
              </CardHeader>
              <CardContent className="h-full p-0 flex flex-col">
                <Tabs value={navigatorTab} onValueChange={(value) => setNavigatorTab(value as NavigatorTab)} className="flex flex-col h-full">
                  <div className="px-4">
                    <TabsList className="grid w-full grid-cols-5 text-xs">
                      <TabsTrigger value="steps">Steps</TabsTrigger>
                      <TabsTrigger value="guidance">Guide</TabsTrigger>
                      <TabsTrigger value="collab">Collab</TabsTrigger>
                      <TabsTrigger value="systems">Systems</TabsTrigger>
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="steps" className="h-full mt-0">
                      <ScrollArea className="h-full px-4 pb-4">
                        <div className="space-y-3">
                          {workflowSteps.map((step) => {
                            const Icon = step.type === "plan"
                              ? Compass
                              : step.type === "analysis"
                                ? Sparkles
                                : step.type === "build"
                                  ? ListChecks
                                  : step.type === "debug"
                                    ? Bug
                                    : Rocket;

                            return (
                              <Card key={step.id} className={`border-l-4 ${completedSteps[step.id] ? "border-l-primary" : "border-l-muted"}`}>
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4 text-primary" />
                                      <div>
                                        <p className="text-sm font-semibold">{step.label}</p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant={completedSteps[step.id] ? "secondary" : "outline"} onClick={() => handleStepToggle(step.id)}>
                                      {completedSteps[step.id] ? "Done" : "Mark done"}
                                    </Button>
                                  </div>
                                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => goToTab("guidance")}>
                                    <Workflow className="mr-2 h-3 w-3" />
                                    {step.action}
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="guidance" className="h-full mt-0">
                      <div className="h-full px-4 pb-4">
                        <ErrorBoundary>
                          <ProjectGuidance onProjectSelect={handleProjectSelect} />
                        </ErrorBoundary>
                      </div>
                    </TabsContent>

                    <TabsContent value="collab" className="h-full mt-0">
                      <div className="h-full px-4 pb-4">
                        <ErrorBoundary>
                          <CollaborationPanel 
                            roomId={roomId}
                            userId={userId}
                            onShareRoom={handleShareRoom}
                          />
                        </ErrorBoundary>
                      </div>
                    </TabsContent>

                    <TabsContent value="systems" className="h-full mt-0">
                      <ScrollArea className="h-full px-4 pb-4 space-y-4">
                        <div className="space-y-4">
                          <ErrorBoundary>
                            <LayoutManager />
                          </ErrorBoundary>
                          <ErrorBoundary>
                            <DeveloperTools />
                          </ErrorBoundary>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="feedback" className="h-full mt-0">
                      <ScrollArea className="h-full px-4 pb-4">
                        <ErrorBoundary>
                          <FeedbackSection />
                        </ErrorBoundary>
                      </ScrollArea>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


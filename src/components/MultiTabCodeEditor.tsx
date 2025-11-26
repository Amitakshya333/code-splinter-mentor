import { useState, useCallback, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { EnhancedCodeEditor } from "@/components/EnhancedCodeEditor";
import { CodeSnippetsLibrary } from "@/components/CodeSnippetsLibrary";
import { DebugPanel } from "@/components/DebugPanel";
import { FileTemplates, FileTemplate } from "@/components/FileTemplates";
import { ProjectImportExport } from "@/components/ProjectImportExport";
import { RecentFiles } from "@/components/RecentFiles";
import { useAppStore } from "@/store/useAppStore";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useFileHistory } from "@/hooks/useFileHistory";
import { formatCode } from "@/utils/codeFormatter";
import { X, Plus, SplitSquareHorizontal, Code2, Bug, FileCode, Users, History, FileText, Upload, Download, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EditorTab {
  id: string;
  name: string;
  language: string;
  code: string;
  isDirty: boolean;
}

interface MultiTabCodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onRun?: (code: string, language: string) => void;
}

export const MultiTabCodeEditor = memo<MultiTabCodeEditorProps>(({ 
  onCodeChange, 
  onLanguageChange, 
  onRun 
}) => {
  const { toast } = useToast();
  const { currentCode, currentLanguage, setCurrentCode, setCurrentLanguage, roomId, userId } = useAppStore();
  
  const [tabs, setTabs] = useState<EditorTab[]>([
    {
      id: '1',
      name: 'untitled-1.py',
      language: 'python',
      code: currentCode,
      isDirty: false
    }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [splitView, setSplitView] = useState(false);
  const [secondaryTab, setSecondaryTab] = useState<string | null>(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  
  // Collaboration
  const { collaborators, isConnected } = useCollaboration(roomId || 'default-room', userId || 'user-1');
  
  // File history
  const { history, saveVersion, restoreVersion, currentVersion } = useFileHistory(activeTab);

  const handleAddTab = useCallback(() => {
    const newId = Date.now().toString();
    const newTab: EditorTab = {
      id: newId,
      name: `untitled-${tabs.length + 1}.py`,
      language: 'python',
      code: '',
      isDirty: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newId);
    toast({
      title: "New Tab Created",
      description: newTab.name
    });
  }, [tabs.length, toast]);

  const handleCloseTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      toast({
        title: "Cannot Close",
        description: "Must have at least one tab open",
        variant: "destructive"
      });
      return;
    }

    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const closingTab = tabs[tabIndex];
    
    if (closingTab.isDirty) {
      if (!confirm(`${closingTab.name} has unsaved changes. Close anyway?`)) {
        return;
      }
    }

    setTabs(prev => prev.filter(t => t.id !== tabId));
    
    if (activeTab === tabId) {
      const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
      setActiveTab(tabs[newActiveIndex]?.id || tabs[0]?.id);
    }
    
    if (secondaryTab === tabId) {
      setSecondaryTab(null);
    }
  }, [tabs, activeTab, secondaryTab, toast]);

  const handleCodeChange = useCallback((tabId: string, code: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, code, isDirty: true } : tab
    ));
    
    if (tabId === activeTab) {
      setCurrentCode(code);
      onCodeChange?.(code);
    }
  }, [activeTab, setCurrentCode, onCodeChange]);

  const handleLanguageChange = useCallback((tabId: string, language: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { 
        ...tab, 
        language,
        name: tab.name.replace(/\.[^.]+$/, `.${getExtension(language)}`)
      } : tab
    ));
    
    if (tabId === activeTab) {
      setCurrentLanguage(language);
      onLanguageChange?.(language);
    }
  }, [activeTab, setCurrentLanguage, onLanguageChange]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setCurrentCode(tab.code);
      setCurrentLanguage(tab.language);
    }
  }, [tabs, setCurrentCode, setCurrentLanguage]);

  const toggleSplitView = useCallback(() => {
    if (!splitView && tabs.length > 1) {
      const otherTab = tabs.find(t => t.id !== activeTab);
      setSecondaryTab(otherTab?.id || null);
    }
    setSplitView(!splitView);
  }, [splitView, tabs, activeTab]);

  const handleSnippetInsert = useCallback((code: string, language: string) => {
    const activeTabData = tabs.find(t => t.id === activeTab);
    if (activeTabData) {
      handleCodeChange(activeTab, code);
      handleLanguageChange(activeTab, language);
    }
    setShowSnippets(false);
  }, [activeTab, tabs, handleCodeChange, handleLanguageChange]);

  const handleFormat = useCallback(async () => {
    const activeTabData = tabs.find(t => t.id === activeTab);
    if (!activeTabData) return;

    setIsFormatting(true);
    try {
      const formatted = await formatCode(activeTabData.code, activeTabData.language);
      handleCodeChange(activeTab, formatted);
      toast({
        title: "Code Formatted",
        description: "Your code has been formatted successfully"
      });
    } catch (error) {
      toast({
        title: "Format Failed",
        description: error instanceof Error ? error.message : "Failed to format code",
        variant: "destructive"
      });
    } finally {
      setIsFormatting(false);
    }
  }, [activeTab, tabs, handleCodeChange, toast]);

  const handleTemplateSelect = useCallback((template: FileTemplate) => {
    handleCodeChange(activeTab, template.content);
    handleLanguageChange(activeTab, template.language);
    setShowTemplates(false);
  }, [activeTab, handleCodeChange, handleLanguageChange]);

  const handleSaveVersion = useCallback(() => {
    const activeTabData = tabs.find(t => t.id === activeTab);
    if (activeTabData) {
      saveVersion(activeTabData.code, `Manual save ${new Date().toLocaleTimeString()}`);
      toast({
        title: "Version Saved",
        description: "File version saved to history"
      });
    }
  }, [activeTab, tabs, saveVersion, toast]);

  const handleRestoreVersion = useCallback((versionIndex: number) => {
    const content = restoreVersion(versionIndex);
    if (content) {
      handleCodeChange(activeTab, content);
      toast({
        title: "Version Restored",
        description: `Restored version from ${new Date(history[versionIndex].timestamp).toLocaleString()}`
      });
    }
  }, [activeTab, restoreVersion, handleCodeChange, history, toast]);

  const getExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
    };
    return extensions[language] || 'txt';
  };

  const activeTabData = tabs.find(t => t.id === activeTab);
  const secondaryTabData = secondaryTab ? tabs.find(t => t.id === secondaryTab) : null;

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b bg-card/50 px-2 py-1 shrink-0">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-t text-sm
                transition-colors group
                ${activeTab === tab.id 
                  ? 'bg-background text-foreground border-t border-x' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <FileCode className="h-3 w-3" />
              <span className="max-w-[120px] truncate">
                {tab.name}
                {tab.isDirty && '*'}
              </span>
              <X 
                className="h-3 w-3 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                onClick={(e) => handleCloseTab(tab.id, e)}
              />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTab}
            className="h-7 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={isFormatting}
            className="h-7"
            title="Format Code"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
          <Button
            variant={showSnippets ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowSnippets(!showSnippets)}
            className="h-7"
            title="Code Snippets"
          >
            <Code2 className="h-4 w-4" />
          </Button>
          <Button
            variant={showTemplates ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
            className="h-7"
            title="File Templates"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={showHistory ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="h-7"
            title="Version History"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant={showCollaboration ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowCollaboration(!showCollaboration)}
            className="h-7 relative"
            title="Collaboration"
          >
            <Users className="h-4 w-4" />
            {isConnected && collaborators.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                {collaborators.length}
              </Badge>
            )}
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button
            variant={showDebugPanel ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="h-7"
            title="Debug Panel"
          >
            <Bug className="h-4 w-4" />
          </Button>
          <Button
            variant={splitView ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleSplitView}
            disabled={tabs.length < 2}
            className="h-7"
            title="Split View"
          >
            <SplitSquareHorizontal className="h-4 w-4" />
          </Button>
          <Dialog open={showImportExport} onOpenChange={setShowImportExport}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7"
                title="Import/Export"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Project Import/Export</DialogTitle>
              </DialogHeader>
              <ProjectImportExport />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        {splitView && secondaryTabData ? (
          <ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
            <ResizablePanel defaultSize={50} minSize={30} className="min-h-0 overflow-hidden">
              <div className="h-full min-h-0 flex flex-col overflow-hidden">
                {activeTabData && (
                  <EnhancedCodeEditor
                    key={activeTab}
                    onCodeChange={(code) => handleCodeChange(activeTab, code)}
                    onLanguageChange={(lang) => handleLanguageChange(activeTab, lang)}
                    onRun={(code, lang) => onRun?.(code, lang)}
                  />
                )}
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30} className="min-h-0 overflow-hidden">
              <div className="h-full min-h-0 flex flex-col overflow-hidden">
                {secondaryTabData && (
                  <EnhancedCodeEditor
                    key={secondaryTab}
                    onCodeChange={(code) => handleCodeChange(secondaryTab!, code)}
                    onLanguageChange={(lang) => handleLanguageChange(secondaryTab!, lang)}
                    onRun={(code, lang) => onRun?.(code, lang)}
                  />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full min-h-0 flex flex-col overflow-hidden">
            {activeTabData && (
              <EnhancedCodeEditor
                key={activeTab}
                onCodeChange={(code) => handleCodeChange(activeTab, code)}
                onLanguageChange={(lang) => handleLanguageChange(activeTab, lang)}
                onRun={(code, lang) => onRun?.(code, lang)}
              />
            )}
          </div>
        )}

        {/* Snippets Sidebar */}
        {showSnippets && (
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l bg-background shadow-lg z-10">
            <CodeSnippetsLibrary onInsert={handleSnippetInsert} />
          </div>
        )}

        {/* Templates Sidebar */}
        {showTemplates && (
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l bg-background shadow-lg z-10">
            <FileTemplates 
              onSelectTemplate={handleTemplateSelect}
              onClose={() => setShowTemplates(false)}
            />
          </div>
        )}

        {/* History Sidebar */}
        {showHistory && (
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l bg-background shadow-lg z-10 overflow-auto">
            <Card className="h-full">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Version History
                </h3>
                <Button onClick={handleSaveVersion} size="sm" className="mt-2 w-full">
                  Save Current Version
                </Button>
              </div>
              <div className="p-4 space-y-2">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No versions saved yet
                  </p>
                ) : (
                  history.map((version, index) => (
                    <Button
                      key={version.id}
                      variant={currentVersion === index ? "secondary" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleRestoreVersion(index)}
                    >
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{version.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(version.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Collaboration Sidebar */}
        {showCollaboration && (
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l bg-background shadow-lg z-10">
            <Card className="h-full">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Live Collaboration
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Active Users ({collaborators.length})</h4>
                  {collaborators.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No other users online</p>
                  ) : (
                    <div className="space-y-2">
                      {collaborators.map(collaborator => (
                        <div key={collaborator.user_id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                          <div className="h-2 w-2 rounded-full bg-success" />
                          <span className="text-sm">{collaborator.username}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t">
                  <RecentFiles />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="absolute bottom-0 left-0 right-0 h-64 border-t bg-background z-10">
            <DebugPanel 
              code={activeTabData?.code || ''}
              language={activeTabData?.language || 'python'}
            />
          </div>
        )}
      </div>
    </div>
  );
});

MultiTabCodeEditor.displayName = 'MultiTabCodeEditor';

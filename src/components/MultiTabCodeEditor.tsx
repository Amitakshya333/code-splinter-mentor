import { useState, useCallback, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { EnhancedCodeEditor } from "@/components/EnhancedCodeEditor";
import { CodeSnippetsLibrary } from "@/components/CodeSnippetsLibrary";
import { DebugPanel } from "@/components/DebugPanel";
import { useAppStore } from "@/store/useAppStore";
import { X, Plus, SplitSquareHorizontal, Code2, Bug, FileCode } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  const { currentCode, currentLanguage, setCurrentCode, setCurrentLanguage } = useAppStore();
  
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
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b bg-card/50 px-2 py-1">
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
            variant={showSnippets ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowSnippets(!showSnippets)}
            className="h-7"
          >
            <Code2 className="h-4 w-4" />
          </Button>
          <Button
            variant={showDebugPanel ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="h-7"
          >
            <Bug className="h-4 w-4" />
          </Button>
          <Button
            variant={splitView ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleSplitView}
            disabled={tabs.length < 2}
            className="h-7"
          >
            <SplitSquareHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        {splitView && secondaryTabData ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full">
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
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full">
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
          <div className="h-full">
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
          <div className="absolute right-0 top-0 bottom-0 w-80 border-l bg-background shadow-lg">
            <CodeSnippetsLibrary onInsert={handleSnippetInsert} />
          </div>
        )}

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="absolute bottom-0 left-0 right-0 h-64 border-t bg-background">
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

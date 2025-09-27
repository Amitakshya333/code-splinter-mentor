import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Search, 
  Replace, 
  Settings, 
  Maximize2, 
  Minimize2,
  Save,
  Undo2,
  Redo2,
  Map,
  FoldVertical,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import * as monaco from 'monaco-editor';

interface AdvancedCodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onRun?: (code: string, language: string) => void;
}

export const AdvancedCodeEditor = memo<AdvancedCodeEditorProps>(({ 
  onCodeChange, 
  onLanguageChange, 
  onRun 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [findMatches, setFindMatches] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    currentCode,
    currentLanguage,
    currentFile,
    files,
    editorSettings,
    updateFile,
    updateEditorSettings,
    setCurrentCode,
    setCurrentLanguage
  } = useAppStore();

  const { toast } = useToast();
  const { theme } = useTheme();

  // Auto-save functionality
  useEffect(() => {
    if (editorSettings.autoSave && currentFile && currentCode) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        const file = files.find(f => f.id === currentFile);
        if (file) {
          updateFile(currentFile, { code: currentCode, updatedAt: new Date() });
          setLastSaveTime(new Date());
        }
      }, editorSettings.autoSaveDelay);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [currentCode, currentFile, editorSettings.autoSave, editorSettings.autoSaveDelay, files, updateFile]);

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Configure editor options based on settings
    editor.updateOptions({
      minimap: { enabled: editorSettings.showMinimap },
      folding: editorSettings.enableCodeFolding,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: true,
      trimAutoWhitespace: true,
      cursorStyle: 'line',
      cursorBlinking: 'blink',
      renderWhitespace: 'selection',
      showFoldingControls: 'always',
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowFindReplace(true);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      setShowFindReplace(true);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleManualSave();
    });

    // Add find decorations
    editor.onDidChangeModelContent(() => {
      if (findText) {
        updateFindMatches();
      }
    });
  }, [editorSettings]);

  const updateFindMatches = useCallback(() => {
    if (!editorRef.current || !findText) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    const matches = model.findMatches(
      findText,
      true,
      false,
      true,
      null,
      true
    );
    
    setFindMatches(matches.length);
    setCurrentMatch(matches.length > 0 ? 1 : 0);

    // Highlight matches
    editorRef.current.deltaDecorations([], matches.map(match => ({
      range: match.range,
      options: {
        className: 'findMatch',
        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
      }
    })));
  }, [findText]);

  const handleFind = useCallback((direction: 'next' | 'previous' = 'next') => {
    if (!editorRef.current || !findText) return;

    const action = direction === 'next' ? 'editor.action.nextMatchFindAction' : 'editor.action.previousMatchFindAction';
    editorRef.current.trigger('keyboard', action, null);
    
    setCurrentMatch(prev => {
      if (direction === 'next') {
        return prev >= findMatches ? 1 : prev + 1;
      } else {
        return prev <= 1 ? findMatches : prev - 1;
      }
    });
  }, [findText, findMatches]);

  const handleReplace = useCallback(() => {
    if (!editorRef.current || !findText || !replaceText) return;

    const selection = editorRef.current.getSelection();
    if (selection && !selection.isEmpty()) {
      const selectedText = editorRef.current.getModel()?.getValueInRange(selection);
      if (selectedText === findText) {
        editorRef.current.executeEdits('replace', [{
          range: selection,
          text: replaceText
        }]);
        handleFind('next');
      }
    }
  }, [findText, replaceText, handleFind]);

  const handleReplaceAll = useCallback(() => {
    if (!editorRef.current || !findText || !replaceText) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    const matches = model.findMatches(findText, true, false, true, null, true);
    const edits = matches.map(match => ({
      range: match.range,
      text: replaceText
    }));

    if (edits.length > 0) {
      editorRef.current.executeEdits('replaceAll', edits);
      toast({
        title: "Replace Complete",
        description: `Replaced ${edits.length} occurrences`,
      });
    }
  }, [findText, replaceText, toast]);

  const handleManualSave = useCallback(() => {
    if (currentFile && currentCode) {
      const file = files.find(f => f.id === currentFile);
      if (file) {
        updateFile(currentFile, { code: currentCode, updatedAt: new Date() });
        setLastSaveTime(new Date());
        toast({
          title: "File Saved",
          description: `${file.name} has been saved`,
        });
      }
    }
  }, [currentFile, currentCode, files, updateFile, toast]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const code = value || '';
    setCurrentCode(code);
    onCodeChange?.(code);
  }, [setCurrentCode, onCodeChange]);

  const handleUndo = useCallback(() => {
    editorRef.current?.trigger('keyboard', 'undo', null);
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.trigger('keyboard', 'redo', null);
  }, []);

  const toggleMinimap = useCallback(() => {
    const newShowMinimap = !editorSettings.showMinimap;
    updateEditorSettings({ showMinimap: newShowMinimap });
    editorRef.current?.updateOptions({ minimap: { enabled: newShowMinimap } });
  }, [editorSettings.showMinimap, updateEditorSettings]);

  const toggleCodeFolding = useCallback(() => {
    const newEnableFolding = !editorSettings.enableCodeFolding;
    updateEditorSettings({ enableCodeFolding: newEnableFolding });
    editorRef.current?.updateOptions({ folding: newEnableFolding });
  }, [editorSettings.enableCodeFolding, updateEditorSettings]);

  const handleRun = useCallback(() => {
    if (onRun) {
      onRun(currentCode, currentLanguage);
    }
  }, [currentCode, currentLanguage, onRun]);

  const currentFile_ = files.find(f => f.id === currentFile);

  return (
    <div className={`relative h-full ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRun}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Run
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleManualSave}
                  title="Save (Ctrl+S)"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              
              {currentFile_ && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {currentFile_.name}
                  </Badge>
                  {lastSaveTime && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3" />
                      Saved {lastSaveTime.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFindReplace(!showFindReplace)}
                title="Find & Replace (Ctrl+F)"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimap}
                title="Toggle Minimap"
                className={editorSettings.showMinimap ? 'bg-accent' : ''}
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCodeFolding}
                title="Toggle Code Folding"
                className={editorSettings.enableCodeFolding ? 'bg-accent' : ''}
              >
                <FoldVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullScreen(!isFullScreen)}
                title="Toggle Full Screen"
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Find & Replace Panel */}
          {showFindReplace && (
            <div className="border rounded-lg p-3 space-y-2 bg-muted/50">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Find..."
                  value={findText}
                  onChange={(e) => {
                    setFindText(e.target.value);
                    updateFindMatches();
                  }}
                  className="h-8 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFind('previous')}
                  disabled={!findText || findMatches === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => handleFind('next')}
                  disabled={!findText || findMatches === 0}
                >
                  ↓
                </Button>
                <div className="text-xs text-muted-foreground min-w-fit">
                  {findMatches > 0 ? `${currentMatch}/${findMatches}` : 'No matches'}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFindReplace(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Replace..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="h-8 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplace}
                  disabled={!findText || !replaceText}
                >
                  <Replace className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplaceAll}
                  disabled={!findText || !replaceText}
                >
                  Replace All
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <Editor
            height="100%"
            language={currentLanguage}
            value={currentCode}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' || theme === 'amoled' ? 'vs-dark' : 'vs'}
            options={{
              fontSize: 14,
              fontFamily: 'Fira Code, Consolas, Monaco, monospace',
              padding: { top: 16, bottom: 16 },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: 'on',
              contextmenu: true,
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              colorDecorators: true,
              copyWithSyntaxHighlighting: true,
              emptySelectionClipboard: false,
              find: {
                seedSearchStringFromSelection: 'always',
                autoFindInSelection: 'multiline'
              },
              quickSuggestions: { other: true, comments: true, strings: true },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
                showIssues: true,
                showUsers: true,
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Auto-save indicator */}
      {editorSettings.autoSave && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-1">
          <Info className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Auto-save enabled</span>
        </div>
      )}
    </div>
  );
});

AdvancedCodeEditor.displayName = 'AdvancedCodeEditor';
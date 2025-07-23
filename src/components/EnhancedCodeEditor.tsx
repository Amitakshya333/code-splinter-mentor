import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, 
  Copy, 
  Download, 
  Upload, 
  Save, 
  FolderOpen,
  Trash2, 
  Wand2,
  Settings,
  Code2
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface Language {
  id: string;
  name: string;
  extension: string;
  syntax: string;
  template: string;
}

const languages: Language[] = [
  {
    id: "python",
    name: "Python",
    extension: "py",
    syntax: "python",
    template: `# Python Example
print("Hello, CodeSplinter!")

# Variables and data types
name = "World"
count = 42
pi = 3.14159

# Functions
def greet(name):
    return f"Hello, {name}!"

# Main execution
if __name__ == "__main__":
    message = greet(name)
    print(message)
    print(f"Count: {count}, Pi: {pi}")
`
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    syntax: "javascript",
    template: `// JavaScript Example
console.log("Hello, CodeSplinter!");

// Variables and data types
const name = "World";
let count = 42;
const pi = 3.14159;

// Functions
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Arrow function
const multiply = (a, b) => a * b;

// Main execution
const message = greet(name);
console.log(message);
console.log(\`Count: \${count}, Pi: \${pi}\`);
console.log(\`5 * 3 = \${multiply(5, 3)}\`);
`
  },
  {
    id: "html",
    name: "HTML",
    extension: "html",
    syntax: "html",
    template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeSplinter Demo</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to CodeSplinter!</h1>
        <p>This is a sample HTML page.</p>
        <button onclick="alert('Hello from CodeSplinter!')">Click Me!</button>
    </div>
</body>
</html>`
  },
  {
    id: "css",
    name: "CSS",
    extension: "css",
    syntax: "css",
    template: `/* CSS Example - Modern Card Design */

.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 400px;
    margin: 20px auto;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.card-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 12px;
}

.card-content {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
}

.button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.button:hover {
    background: rgba(255, 255, 255, 0.3);
}`
  },
  {
    id: "c",
    name: "C",
    extension: "c",
    syntax: "c",
    template: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function declarations
void greet(const char* name);
int add(int a, int b);

int main() {
    printf("Hello, CodeSplinter!\\n");
    
    // Variables
    char name[] = "World";
    int count = 42;
    float pi = 3.14159f;
    
    // Function calls
    greet(name);
    
    int result = add(10, 20);
    printf("Count: %d, Pi: %.2f\\n", count, pi);
    printf("10 + 20 = %d\\n", result);
    
    return 0;
}

void greet(const char* name) {
    printf("Hello, %s!\\n", name);
}

int add(int a, int b) {
    return a + b;
}`
  },
  {
    id: "java",
    name: "Java",
    extension: "java",
    syntax: "java",
    template: `public class CodeSplinterDemo {
    public static void main(String[] args) {
        System.out.println("Hello, CodeSplinter!");
        
        // Variables
        String name = "World";
        int count = 42;
        double pi = 3.14159;
        
        // Create instance and call methods
        CodeSplinterDemo demo = new CodeSplinterDemo();
        String message = demo.greet(name);
        
        System.out.println(message);
        System.out.println("Count: " + count + ", Pi: " + pi);
        System.out.println("5 + 3 = " + demo.add(5, 3));
    }
    
    public String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    public int add(int a, int b) {
        return a + b;
    }
}`
  }
];

interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  createdAt: Date;
}

interface EnhancedCodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onRun?: (code: string, language: string) => void;
}

export function EnhancedCodeEditor({ onCodeChange, onLanguageChange, onRun }: EnhancedCodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>("");
  const [isFixing, setIsFixing] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const defaultLanguage = languages.find(lang => lang.id === selectedLanguage);
    if (defaultLanguage && !code) {
      setCode(defaultLanguage.template);
      onCodeChange?.(defaultLanguage.template);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    loadSavedSnippets();
  }, []);

  const loadSavedSnippets = () => {
    const saved = localStorage.getItem('codesplinter-snippets');
    if (saved) {
      const snippets = JSON.parse(saved).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      }));
      setSavedSnippets(snippets);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedLang = languages.find(lang => lang.id === language);
    if (selectedLang) {
      setCode(selectedLang.template);
      onCodeChange?.(selectedLang.template);
      onLanguageChange?.(language);
    }
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const codeValue = newCode || "";
    setCode(codeValue);
    onCodeChange?.(codeValue);
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code, selectedLanguage);
    }
  };

  const handleFixCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Fix",
        description: "Please write some code first before asking for fixes.",
        variant: "destructive",
      });
      return;
    }

    setIsFixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-fix-code', {
        body: { code, language: selectedLanguage }
      });

      if (error) throw error;

      setCode(data.fixedCode);
      onCodeChange?.(data.fixedCode);

      toast({
        title: "Code Enhanced! 🚀",
        description: `Applied ${data.changes?.length || 0} improvements`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error fixing code:', error);
      toast({
        title: "AI Fix Failed",
        description: "Could not enhance the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code Copied! 📋",
        description: "Code has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const selectedLang = languages.find(lang => lang.id === selectedLanguage);
    const extension = selectedLang?.extension || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded! 💾",
      description: `Code saved as code.${extension}`,
    });
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        onCodeChange?.(content);
        
        toast({
          title: "File Loaded! 📁",
          description: `Loaded ${file.name}`,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSaveSnippet = () => {
    const name = prompt("Enter a name for this code snippet:");
    if (name && code.trim()) {
      const newSnippet: CodeSnippet = {
        id: Date.now().toString(),
        name,
        language: selectedLanguage,
        code,
        createdAt: new Date()
      };
      
      const updatedSnippets = [...savedSnippets, newSnippet];
      setSavedSnippets(updatedSnippets);
      localStorage.setItem('codesplinter-snippets', JSON.stringify(updatedSnippets));
      
      toast({
        title: "Snippet Saved! 💾",
        description: `"${name}" has been saved`,
      });
    }
  };

  const handleLoadSnippet = (snippet: CodeSnippet) => {
    setCode(snippet.code);
    setSelectedLanguage(snippet.language);
    onCodeChange?.(snippet.code);
    onLanguageChange?.(snippet.language);
    setShowSnippets(false);
    
    toast({
      title: "Snippet Loaded! 📁",
      description: `Loaded "${snippet.name}"`,
    });
  };

  const handleDeleteSnippet = (snippetId: string) => {
    const updatedSnippets = savedSnippets.filter(s => s.id !== snippetId);
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('codesplinter-snippets', JSON.stringify(updatedSnippets));
    
    toast({
      title: "Snippet Deleted",
      description: "Code snippet has been removed",
    });
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      const selectedLang = languages.find(lang => lang.id === selectedLanguage);
      const defaultCode = selectedLang?.template || "";
      setCode(defaultCode);
      onCodeChange?.(defaultCode);
      
      toast({
        title: "Editor Cleared",
        description: "Code has been reset to template",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-primary" />
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">
            .{languages.find(l => l.id === selectedLanguage)?.extension}
          </Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={handleRun} 
            size="sm" 
            className="bg-success hover:bg-success/90"
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          
          <Button 
            onClick={handleFixCode} 
            disabled={isFixing}
            size="sm"
            variant="outline"
          >
            <Wand2 className="h-4 w-4 mr-1" />
            {isFixing ? "Enhancing..." : "AI Fix"}
          </Button>

          <div className="h-4 w-px bg-border" />

          <Button onClick={handleSaveSnippet} size="sm" variant="outline">
            <Save className="h-4 w-4" />
          </Button>

          <Button 
            onClick={() => setShowSnippets(!showSnippets)} 
            size="sm" 
            variant="outline"
          >
            <FolderOpen className="h-4 w-4" />
          </Button>

          <Button onClick={handleUpload} size="sm" variant="outline">
            <Upload className="h-4 w-4" />
          </Button>

          <Button onClick={handleDownload} size="sm" variant="outline">
            <Download className="h-4 w-4" />
          </Button>

          <Button onClick={handleCopyCode} size="sm" variant="outline">
            <Copy className="h-4 w-4" />
          </Button>

          <Button onClick={handleClear} size="sm" variant="outline">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Saved Snippets Panel */}
      {showSnippets && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Saved Code Snippets</h3>
          {savedSnippets.length === 0 ? (
            <p className="text-muted-foreground text-sm">No saved snippets yet</p>
          ) : (
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {savedSnippets.map((snippet) => (
                <div key={snippet.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{snippet.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {snippet.language}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {snippet.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      onClick={() => handleLoadSnippet(snippet)}
                      size="sm"
                      variant="ghost"
                    >
                      Load
                    </Button>
                    <Button 
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Monaco Editor */}
      <Card className="overflow-hidden">
        <Editor
          height="500px"
          language={languages.find(l => l.id === selectedLanguage)?.syntax || selectedLanguage}
          value={code}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          onChange={handleCodeChange}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            rulers: [80],
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: "selection",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
          }}
        />
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".py,.js,.html,.css,.c,.java,.txt"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  );
}
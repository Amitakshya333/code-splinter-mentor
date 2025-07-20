import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Copy,
  Download,
  Upload,
  Trash2,
  Wand2,
  Loader2,
  Settings
} from "lucide-react";

const languages = [
  { id: "python", name: "Python", ext: ".py", syntax: "python" },
  { id: "javascript", name: "JavaScript", ext: ".js", syntax: "javascript" },
  { id: "html", name: "HTML", ext: ".html", syntax: "html" },
  { id: "css", name: "CSS", ext: ".css", syntax: "css" },
  { id: "c", name: "C", ext: ".c", syntax: "c" },
  { id: "java", name: "Java", ext: ".java", syntax: "java" },
  { id: "typescript", name: "TypeScript", ext: ".ts", syntax: "typescript" },
  { id: "jsx", name: "React JSX", ext: ".jsx", syntax: "jsx" }
];

const sampleCode = {
  python: `# Welcome to CodeSplinter - Your AI Coding Mentor!
def greet(name):
    """A simple greeting function"""
    if not name:
        return "Hello, Anonymous!"
    return f"Hello, {name}!"

# Let's test our function
user_name = input("What's your name? ")
message = greet(user_name)
print(message)

# CodeSplinter detects: Consider adding type hints for better code clarity
def calculate_area(radius: float) -> float:
    import math
    return math.pi * radius ** 2

area = calculate_area(5.0)
print(f"Circle area: {area:.2f}")`,
  
  javascript: `// Welcome to CodeSplinter - Your AI Coding Mentor!
function greet(name) {
    // CodeSplinter suggests: Add input validation
    if (!name || name.trim() === '') {
        return "Hello, Anonymous!";
    }
    return \`Hello, \${name}!\`;
}

// Let's create a simple calculator
class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = a + b;
        this.history.push(\`\${a} + \${b} = \${result}\`);
        return result;
    }
    
    // CodeSplinter suggests: Add error handling for division by zero
    divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero!");
        }
        return a / b;
    }
}

const calc = new Calculator();
console.log(calc.add(5, 3));`
};

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
}

export const CodeEditor = ({ onCodeChange }: CodeEditorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(sampleCode.python);
  const [showEditor, setShowEditor] = useState(true);
  const [errors] = useState([
    { line: 12, type: "warning", message: "Consider adding type hints for better code clarity" },
    { line: 8, type: "info", message: "This function could benefit from docstring documentation" }
  ]);
  const [isFixing, setIsFixing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const newCode = sampleCode[language as keyof typeof sampleCode] || "// Start coding here...";
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(l => l.id === selectedLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleFixCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to fix",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    setIsFixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-fix-code', {
        body: {
          code,
          language: selectedLanguage
        }
      });

      if (error) throw error;

      if (data.fixedCode) {
        setCode(data.fixedCode);
        onCodeChange?.(data.fixedCode);
        
        toast({
          title: "Code Fixed!",
          description: `Applied ${data.changes?.length || 0} improvements.`,
        });
      }
    } catch (error) {
      console.error('Error fixing code:', error);
      toast({
        title: "Error",
        description: "Failed to fix code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-muted-foreground" />
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
            {languages.find(l => l.id === selectedLanguage)?.ext}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleFixCode}
            disabled={isFixing}
            className="gap-2"
          >
            {isFixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            AI Fix
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast({ title: "Code copied to clipboard!" });
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const blob = new Blob([code], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `code${getCurrentLanguage()?.ext || '.txt'}`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.txt,.js,.py,.html,.css,.java,.c,.ts,.jsx';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const content = e.target?.result as string;
                    setCode(content);
                    onCodeChange?.(content);
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setCode(""); onCodeChange?.(""); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e1e]">
        <div className="flex h-full">
          {/* Line Numbers */}
          <div className="bg-[#1e1e1e] border-r border-[#3e3e42] px-2 py-4 text-[#858585] font-mono text-sm select-none min-w-[60px]">
            {code.split('\n').map((_, index) => (
              <div key={index} className="h-6 leading-6 text-right pr-2">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Editor Toggle */}
          <div className="flex-1 relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditor(!showEditor)}
                className="bg-[#2d2d30] hover:bg-[#3e3e42] text-white border-[#3e3e42]"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {showEditor ? (
              /* Editable Textarea */
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full p-4 pl-2 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm resize-none border-none outline-none leading-6"
                style={{ 
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                  caretColor: "#ffffff"
                }}
                spellCheck={false}
                placeholder="Start coding here..."
              />
            ) : (
              /* Syntax Highlighted Display */
              <div className="w-full h-full overflow-auto">
                <SyntaxHighlighter
                  language={getCurrentLanguage()?.syntax || "javascript"}
                  style={vscDarkPlus}
                  showLineNumbers={false}
                  customStyle={{
                    margin: 0,
                    padding: "16px 8px",
                    background: "#1e1e1e",
                    fontSize: "14px",
                    fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                    lineHeight: "1.5"
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace"
                    }
                  }}
                >
                  {code || "// Start coding here..."}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
        
        {/* Error indicators overlay */}
        <div className="absolute right-4 top-4 space-y-1">
          {errors.map((error, index) => (
            <div
              key={index}
              className={`w-2 h-4 rounded-sm ${
                error.type === "warning" ? "bg-[#ffcc02]" : 
                error.type === "error" ? "bg-[#f14c4c]" : "bg-[#0e639c]"
              }`}
              title={`Line ${error.line}: ${error.message}`}
            />
          ))}
        </div>
      </div>

      {/* Error Panel */}
      <div className="border-t border-[#3e3e42] bg-[#252526]">
        <div className="p-3 border-b border-[#3e3e42]">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[#cccccc]">
            <AlertCircle className="w-4 h-4" />
            CodeSplinter Analysis
          </h3>
        </div>
        <div className="max-h-32 overflow-y-auto bg-[#1e1e1e]">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-3 p-3 hover:bg-[#2a2d2e] cursor-pointer border-b border-[#3e3e42]/30">
              <div className="mt-0.5">
                {error.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-[#f14c4c]" />
                ) : error.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-[#ffcc02]" />
                ) : (
                  <Info className="w-4 h-4 text-[#0e639c]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#cccccc]">Line {error.line}</span>
                  <Badge 
                    variant={error.type === "error" ? "destructive" : "secondary"} 
                    className={`text-xs ${
                      error.type === "error" ? "bg-[#f14c4c] text-white" :
                      error.type === "warning" ? "bg-[#ffcc02] text-black" :
                      "bg-[#0e639c] text-white"
                    }`}
                  >
                    {error.type}
                  </Badge>
                </div>
                <p className="text-sm text-[#9cdcfe] mt-1">{error.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
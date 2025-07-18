import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Copy,
  Download,
  Upload
} from "lucide-react";

const languages = [
  { id: "python", name: "Python", ext: ".py" },
  { id: "javascript", name: "JavaScript", ext: ".js" },
  { id: "html", name: "HTML", ext: ".html" },
  { id: "css", name: "CSS", ext: ".css" },
  { id: "c", name: "C", ext: ".c" },
  { id: "java", name: "Java", ext: ".java" }
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

export const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState(sampleCode.python);
  const [errors] = useState([
    { line: 12, type: "warning", message: "Consider adding type hints for better code clarity" },
    { line: 8, type: "info", message: "This function could benefit from docstring documentation" }
  ]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(sampleCode[language as keyof typeof sampleCode] || "// Start coding here...");
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
          <Button variant="ghost" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-muted font-mono text-sm resize-none border-none outline-none"
          style={{ 
            lineHeight: "1.6",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
          }}
          spellCheck={false}
        />
        
        {/* Error indicators overlay */}
        <div className="absolute right-4 top-4 space-y-1">
          {errors.map((error, index) => (
            <div
              key={index}
              className={`w-2 h-4 rounded-sm ${
                error.type === "warning" ? "bg-warning" : 
                error.type === "error" ? "bg-destructive" : "bg-primary"
              }`}
              title={`Line ${error.line}: ${error.message}`}
            />
          ))}
        </div>
      </div>

      {/* Error Panel */}
      <div className="border-t border-border bg-card">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            CodeSplinter Analysis
          </h3>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer">
              <div className="mt-0.5">
                {error.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                ) : error.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-warning" />
                ) : (
                  <Info className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Line {error.line}</span>
                  <Badge variant={error.type === "error" ? "destructive" : "secondary"} className="text-xs">
                    {error.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
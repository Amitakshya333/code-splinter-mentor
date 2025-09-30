import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Code2, Zap, Database, Globe, FileJson, Terminal } from "lucide-react";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  code: string;
  tags: string[];
}

const snippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Hello World',
    description: 'Basic hello world program',
    language: 'python',
    category: 'basics',
    code: `print("Hello, World!")`,
    tags: ['beginner', 'print']
  },
  {
    id: '2',
    title: 'Function Definition',
    description: 'Define a function with parameters',
    language: 'python',
    category: 'functions',
    code: `def greet(name, greeting="Hello"):
    """Greet a person with a custom message"""
    return f"{greeting}, {name}!"

# Usage
message = greet("Alice")
print(message)`,
    tags: ['function', 'parameters']
  },
  {
    id: '3',
    title: 'List Comprehension',
    description: 'Create lists using comprehension',
    language: 'python',
    category: 'data-structures',
    code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]`,
    tags: ['list', 'comprehension', 'intermediate']
  },
  {
    id: '4',
    title: 'Try-Except Block',
    description: 'Error handling with try-except',
    language: 'python',
    category: 'error-handling',
    code: `try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("Cleanup code here")`,
    tags: ['error', 'exception', 'try-catch']
  },
  {
    id: '5',
    title: 'Class Definition',
    description: 'Object-oriented programming basics',
    language: 'python',
    category: 'oop',
    code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old"
    
    def __str__(self):
        return f"Person(name={self.name}, age={self.age})"

# Usage
person = Person("Alice", 30)
print(person.greet())`,
    tags: ['class', 'oop', 'intermediate']
  },
  {
    id: '6',
    title: 'Async Function',
    description: 'Asynchronous programming with async/await',
    language: 'javascript',
    category: 'async',
    code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));`,
    tags: ['async', 'promise', 'fetch']
  },
  {
    id: '7',
    title: 'Arrow Function',
    description: 'ES6 arrow function syntax',
    language: 'javascript',
    category: 'functions',
    code: `// Basic arrow function
const greet = (name) => \`Hello, \${name}!\`;

// Multiple parameters
const add = (a, b) => a + b;

// Function body
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Usage
console.log(greet("World"));
console.log(add(5, 3));`,
    tags: ['arrow-function', 'es6', 'function']
  },
  {
    id: '8',
    title: 'Array Methods',
    description: 'Common array manipulation methods',
    language: 'javascript',
    category: 'data-structures',
    code: `const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const evens = numbers.filter(n => n % 2 === 0);

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Find
const found = numbers.find(n => n > 3);

console.log({ doubled, evens, sum, found });`,
    tags: ['array', 'map', 'filter', 'reduce']
  },
  {
    id: '9',
    title: 'Fetch API',
    description: 'Making HTTP requests',
    language: 'javascript',
    category: 'api',
    code: `// GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// POST request
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    tags: ['fetch', 'api', 'http']
  },
  {
    id: '10',
    title: 'HTML5 Template',
    description: 'Basic HTML5 document structure',
    language: 'html',
    category: 'templates',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Content</h2>
            <p>Your content here</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 My Site</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
    tags: ['html5', 'template', 'structure']
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Code2 },
  { id: 'basics', name: 'Basics', icon: Zap },
  { id: 'functions', name: 'Functions', icon: Terminal },
  { id: 'data-structures', name: 'Data Structures', icon: Database },
  { id: 'oop', name: 'OOP', icon: FileJson },
  { id: 'async', name: 'Async', icon: Globe },
];

interface CodeSnippetsLibraryProps {
  onInsert: (code: string, language: string) => void;
}

export const CodeSnippetsLibrary = ({ onInsert }: CodeSnippetsLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => {
      const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;
      
      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [searchQuery, selectedCategory, selectedLanguage]);

  const languages = useMemo(() => {
    const langs = new Set(snippets.map(s => s.language));
    return ['all', ...Array.from(langs)];
  }, []);

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Code Snippets
        </CardTitle>
        <CardDescription>
          Ready-to-use code examples
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang === 'all' ? 'All Languages' : lang}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                <Icon className="h-3 w-3 mr-1" />
                {cat.name}
              </Button>
            );
          })}
        </div>

        {/* Snippets List */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-4">
            {filteredSnippets.map(snippet => (
              <Card key={snippet.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm">{snippet.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {snippet.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {snippet.language}
                    </Badge>
                    {snippet.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                    <code>{snippet.code.substring(0, 150)}...</code>
                  </pre>
                  <Button
                    size="sm"
                    onClick={() => onInsert(snippet.code, snippet.language)}
                    className="w-full mt-2"
                  >
                    Insert Snippet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {filteredSnippets.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No snippets found
          </div>
        )}
      </CardContent>
    </div>
  );
};

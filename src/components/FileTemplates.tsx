import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, FileText, Code, Database, Globe, Smartphone } from 'lucide-react';

export interface FileTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  icon: any;
  content: string;
  category: string;
}

const templates: FileTemplate[] = [
  {
    id: 'react-component',
    name: 'React Component',
    description: 'Functional React component with TypeScript',
    language: 'typescript',
    icon: Code,
    category: 'React',
    content: `import React from 'react';

interface Props {
  title: string;
}

export const Component: React.FC<Props> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};
`,
  },
  {
    id: 'express-server',
    name: 'Express Server',
    description: 'Basic Express.js server setup',
    language: 'javascript',
    icon: Globe,
    category: 'Backend',
    content: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,
  },
  {
    id: 'python-flask',
    name: 'Flask API',
    description: 'Basic Flask API setup',
    language: 'python',
    icon: Database,
    category: 'Backend',
    content: `from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({'message': 'Hello World'})

@app.route('/api/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data = request.get_json()
        return jsonify({'received': data}), 201
    return jsonify({'data': 'Sample data'})

if __name__ == '__main__':
    app.run(debug=True)
`,
  },
  {
    id: 'html-template',
    name: 'HTML5 Template',
    description: 'Modern HTML5 boilerplate',
    language: 'html',
    icon: FileText,
    category: 'Web',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description">
    <title>Document</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <h1>Welcome</h1>
        <p>Your content here</p>
    </main>
    
    <footer>
        <p>&copy; 2024. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
`,
  },
  {
    id: 'css-reset',
    name: 'CSS Reset',
    description: 'Modern CSS reset and utilities',
    language: 'css',
    icon: FileCode,
    category: 'Web',
    content: `/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}
`,
  },
  {
    id: 'typescript-config',
    name: 'TypeScript Config',
    description: 'TypeScript configuration file',
    language: 'json',
    icon: FileCode,
    category: 'Config',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`,
  },
];

interface FileTemplatesProps {
  onSelectTemplate: (template: FileTemplate) => void;
  onClose?: () => void;
}

export const FileTemplates = memo<FileTemplatesProps>(({ onSelectTemplate, onClose }) => {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>File Templates</CardTitle>
        <CardDescription>Start with a pre-built template</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{category}</h3>
                <div className="grid gap-2">
                  {templates
                    .filter(t => t.category === category)
                    .map(template => {
                      const Icon = template.icon;
                      return (
                        <Button
                          key={template.id}
                          variant="outline"
                          className="h-auto p-4 justify-start text-left"
                          onClick={() => {
                            onSelectTemplate(template);
                            onClose?.();
                          }}
                        >
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {template.description}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

FileTemplates.displayName = 'FileTemplates';

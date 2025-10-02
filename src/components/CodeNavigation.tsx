import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Navigation, 
  FileText, 
  Code2, 
  FunctionSquare, 
  Search,
  ArrowRight 
} from 'lucide-react';

interface Symbol {
  name: string;
  kind: 'function' | 'class' | 'variable' | 'interface';
  file: string;
  line: number;
}

interface Reference {
  file: string;
  line: number;
  column: number;
  preview: string;
}

export const CodeNavigation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [symbols] = useState<Symbol[]>([
    { name: 'useState', kind: 'function', file: 'src/hooks/useCodeExecution.tsx', line: 12 },
    { name: 'CodeEditor', kind: 'class', file: 'src/components/CodeEditor.tsx', line: 45 },
    { name: 'EditorProps', kind: 'interface', file: 'src/types/editor.ts', line: 5 },
    { name: 'activeTab', kind: 'variable', file: 'src/store/useAppStore.ts', line: 23 },
  ]);

  const [references] = useState<Reference[]>([
    {
      file: 'src/components/MultiTabCodeEditor.tsx',
      line: 45,
      column: 12,
      preview: 'const [activeTab, setActiveTab] = useState(0);',
    },
    {
      file: 'src/components/EnhancedCodeEditor.tsx',
      line: 78,
      column: 8,
      preview: 'if (activeTab === index) {',
    },
  ]);

  const filteredSymbols = symbols.filter(symbol =>
    symbol.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSymbolIcon = (kind: Symbol['kind']) => {
    switch (kind) {
      case 'function':
        return <FunctionSquare className="h-4 w-4" />;
      case 'class':
        return <Code2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Code Navigation</h2>
      </div>

      <Tabs defaultValue="symbols" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="symbols">Symbols</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="definition">Go to</TabsTrigger>
        </TabsList>

        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <TabsContent value="symbols" className="flex-1">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-2">
              {filteredSymbols.map((symbol, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        {getSymbolIcon(symbol.kind)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{symbol.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{symbol.file}</span>
                          <span>•</span>
                          <span>Line {symbol.line}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {symbol.kind}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="references" className="flex-1">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-2">
              {references.map((ref, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{ref.file}</span>
                      <Badge variant="outline" className="text-xs">
                        {ref.line}:{ref.column}
                      </Badge>
                    </div>
                    <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                      {ref.preview}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="definition" className="flex-1">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium">Quick Navigation</span>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Definition
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Find All References
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FunctionSquare className="h-4 w-4 mr-2" />
                    Go to Symbol
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

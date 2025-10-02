import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Replace, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  file: string;
  line: number;
  column: number;
  match: string;
  context: string;
}

export const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const mockSearch = () => {
    if (!searchQuery) return;

    const mockResults: SearchResult[] = [
      {
        file: 'src/components/CodeEditor.tsx',
        line: 45,
        column: 12,
        match: searchQuery,
        context: `  const editor = ${searchQuery}.current;`,
      },
      {
        file: 'src/hooks/useCodeExecution.tsx',
        line: 23,
        column: 8,
        match: searchQuery,
        context: `  const ${searchQuery} = useState();`,
      },
    ];

    setResults(mockResults);
  };

  const handleReplace = (index: number) => {
    console.log(`Replacing match at index ${index} with ${replaceQuery}`);
  };

  const handleReplaceAll = () => {
    console.log(`Replacing all ${results.length} matches with ${replaceQuery}`);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Search & Replace</h2>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && mockSearch()}
          />
          <Button onClick={mockSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {showReplace && (
          <div className="flex gap-2">
            <Input
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
            />
            <Button onClick={handleReplaceAll} variant="secondary">
              Replace All
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="regex"
              checked={useRegex}
              onCheckedChange={setUseRegex}
            />
            <Label htmlFor="regex" className="text-sm">Regex</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="case"
              checked={caseSensitive}
              onCheckedChange={setCaseSensitive}
            />
            <Label htmlFor="case" className="text-sm">Case Sensitive</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="replace"
              checked={showReplace}
              onCheckedChange={setShowReplace}
            />
            <Label htmlFor="replace" className="text-sm">Replace</Label>
          </div>
        </div>
      </div>

      <div className="mb-2 text-sm text-muted-foreground">
        {results.length > 0 && `${results.length} results found`}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{result.file}</span>
                    <Badge variant="outline" className="text-xs">
                      {result.line}:{result.column}
                    </Badge>
                  </div>
                  {showReplace && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReplace(index)}
                    >
                      <Replace className="h-3 w-3 mr-1" />
                      Replace
                    </Button>
                  )}
                </div>
                <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                  {result.context}
                </code>
              </CardContent>
            </Card>
          ))}
          {results.length === 0 && searchQuery && (
            <div className="text-center py-12 text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

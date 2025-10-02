import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Play, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TableSchema {
  name: string;
  columns: { name: string; type: string }[];
}

export const DatabaseBrowser = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [results, setResults] = useState<any[]>([]);
  const [tables] = useState<TableSchema[]>([
    {
      name: "users",
      columns: [
        { name: "id", type: "uuid" },
        { name: "email", type: "text" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      name: "feedback",
      columns: [
        { name: "id", type: "uuid" },
        { name: "user_id", type: "uuid" },
        { name: "rating", type: "integer" },
        { name: "title", type: "text" },
      ],
    },
  ]);

  const executeQuery = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResults([
      { id: 1, email: "user1@example.com", created_at: "2024-01-01" },
      { id: 2, email: "user2@example.com", created_at: "2024-01-02" },
    ]);
    toast({
      title: "Query executed",
      description: "Results loaded successfully",
    });
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Database Browser</h3>
      </div>

      <Tabs defaultValue="query" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="flex-1 flex flex-col space-y-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter SQL query..."
            className="font-mono text-sm flex-1 min-h-[100px]"
          />
          <Button onClick={executeQuery} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Execute Query
          </Button>

          {results.length > 0 && (
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left p-2 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-accent/50">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="p-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="schema" className="flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {tables.map((table) => (
                <Card key={table.name} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Table className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{table.name}</h4>
                  </div>
                  <div className="space-y-1">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex justify-between text-sm p-2 bg-accent/30 rounded"
                      >
                        <span className="font-mono">{col.name}</span>
                        <span className="text-muted-foreground">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

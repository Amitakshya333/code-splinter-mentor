import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const APITester = () => {
  const { toast } = useToast();
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://api.example.com/users");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        users: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ],
      },
      headers: {
        "content-type": "application/json",
        "x-response-time": "42ms",
      },
    };

    setResponse(JSON.stringify(mockResponse, null, 2));
    setLoading(false);
    
    toast({
      title: "Request sent",
      description: `${method} ${url} - ${mockResponse.status}`,
    });
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">API Tester</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Enter API URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={sendRequest} disabled={loading}>
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>

      <Tabs defaultValue="body" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="params">Params</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="flex-1">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="font-mono text-sm h-full"
          />
        </TabsContent>

        <TabsContent value="headers" className="flex-1">
          <Textarea
            placeholder="Content-Type: application/json"
            className="font-mono text-sm h-full"
          />
        </TabsContent>

        <TabsContent value="params" className="flex-1">
          <Textarea
            placeholder="page=1&limit=10"
            className="font-mono text-sm h-full"
          />
        </TabsContent>
      </Tabs>

      {response && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Response</h4>
          <ScrollArea className="h-48 border rounded-lg">
            <pre className="p-4 text-xs font-mono">{response}</pre>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  User, 
  Send, 
  Lightbulb, 
  Code, 
  BookOpen,
  Zap,
  Loader2
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "suggestion" | "explanation" | "fix" | "guidance";
}

interface AIChatMentorProps {
  currentCode?: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    type: "assistant",
    content: "🤖 Welcome to CodeSplinter! I'm your Gemini-powered AI coding mentor with advanced reasoning capabilities. I can think through complex problems, analyze your code in depth, and provide detailed explanations. Share your code with me and let's start coding together!",
    timestamp: new Date(),
    category: "guidance"
  }
];

export const AIChatMentor = ({ currentCode = "" }: AIChatMentorProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          code: currentCode
        }
      });

      if (error) throw error;

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        category: "explanation"
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "suggestion": return <Lightbulb className="w-4 h-4 text-warning" />;
      case "fix": return <Zap className="w-4 h-4 text-destructive" />;
      case "explanation": return <BookOpen className="w-4 h-4 text-primary" />;
      case "guidance": return <Code className="w-4 h-4 text-success" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "suggestion": return "Suggestion";
      case "fix": return "Bug Fix";
      case "explanation": return "Explanation";
      case "guidance": return "Guidance";
      default: return "Response";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="bg-gradient-to-r from-blue-500 to-purple-600">
            <AvatarFallback className="bg-transparent text-white font-bold">G</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Gemini AI Mentor</h3>
            <p className="text-sm text-muted-foreground">Advanced reasoning & code analysis</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "assistant" && (
                <Avatar className="bg-gradient-to-r from-blue-500 to-purple-600 shrink-0 mt-1">
                  <AvatarFallback className="bg-transparent text-white font-bold">G</AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                {message.type === "assistant" && message.category && (
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(message.category)}
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(message.category)}
                    </Badge>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.type === "user" && (
                <Avatar className="bg-secondary shrink-0 mt-1">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coding mentor anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex gap-2 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setInput("Explain the current code")}
          >
            Explain code
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setInput("Find bugs in my code")}
          >
            Find bugs
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setInput("How can I optimize this code?")}
          >
            Optimize
          </Button>
        </div>
      </div>
    </div>
  );
};
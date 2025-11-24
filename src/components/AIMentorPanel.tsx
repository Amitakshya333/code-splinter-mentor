import { useState } from "react";
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
  Loader2,
  Sparkles
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "suggestion" | "explanation" | "fix" | "guidance";
}

interface AIMentorPanelProps {
  currentCode?: string;
  currentProject?: string | null;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    type: "assistant",
    content: "👋 Welcome to CodeSplinter! I'm your AI Technical Mentor, here to guide you step-by-step through coding, DevOps, cloud platforms, and more. I'll help you understand WHY things work, catch mistakes early, and build real projects. What would you like to learn today?",
    timestamp: new Date(),
    category: "guidance"
  }
];

export const AIMentorPanel = ({ currentCode = "", currentProject }: AIMentorPanelProps) => {
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
      if (!data || !data.response) throw new Error('No response received from AI');

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
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: "AI Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setInput(currentInput);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Code, label: "Explain this code", action: () => setInput("Explain this code") },
    { icon: Zap, label: "Find errors", action: () => setInput("Check my code for bugs") },
    { icon: Lightbulb, label: "What's next?", action: () => setInput("What should I work on next?") },
    { icon: BookOpen, label: "Show examples", action: () => setInput("Show me an example") }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-mentor-light to-background border-r border-border">
      {/* AI Mentor Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-mentor-glow/10 to-mentor-glow/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Avatar className="h-12 w-12 bg-gradient-to-br from-mentor-primary to-mentor-secondary animate-pulse-glow">
              <AvatarFallback className="bg-transparent">
                <Bot className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">AI Mentor</h3>
            <p className="text-xs text-muted-foreground">Always here to guide you</p>
          </div>
          <Badge variant="secondary" className="bg-mentor-glow/10 text-mentor-primary border-mentor-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        
        {/* Context Awareness */}
        {currentProject && (
          <div className="bg-muted/50 rounded-lg p-2 text-xs">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Context:</span> Working on {currentProject}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border bg-muted/30">
        <p className="text-xs font-medium text-muted-foreground mb-2">Quick Help:</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-auto py-2 px-2 flex flex-col items-center gap-1 hover:bg-mentor-glow/10 hover:text-mentor-primary transition-colors"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs text-center leading-tight">{action.label}</span>
            </Button>
          ))}
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
                <Avatar className="h-8 w-8 bg-gradient-to-br from-mentor-primary to-mentor-secondary shrink-0">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-xl p-3 ${
                  message.type === "user"
                    ? "bg-mentor-primary text-white ml-auto"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {message.type === "user" && (
                <Avatar className="h-8 w-8 bg-secondary shrink-0">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-gradient-to-br from-mentor-primary to-mentor-secondary">
                <AvatarFallback className="bg-transparent">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-xl p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 rounded-xl"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-mentor-primary hover:bg-mentor-secondary"
            size="icon"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

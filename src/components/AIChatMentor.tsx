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
  currentProject?: string | null;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    type: "assistant",
    content: "🧠 Welcome to your CodeSplinter AI Mentor! I'm here to guide you like a human mentor would. I don't just write code - I help you understand WHY things work, catch mistakes before you make them, and guide you step-by-step through building real projects. What would you like to learn today?",
    timestamp: new Date(),
    category: "guidance"
  }
];

export const AIChatMentor = ({ currentCode = "", currentProject }: AIChatMentorProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    console.log('AI Chat Send button clicked:', { 
      hasInput: !!input.trim(), 
      isLoading, 
      messageCount: messages.length,
      hasCode: !!currentCode 
    });

    if (!input.trim() || isLoading) {
      if (!input.trim()) {
        toast({
          title: "Empty Message",
          description: "Please type a message first",
          variant: "destructive",
        });
      }
      return;
    }

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
      console.log('Invoking gemini-chat function...');
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          code: currentCode
        }
      });

      console.log('AI Chat response:', { data, error });

      if (error) {
        console.error('AI Chat error:', error);
        
        // Handle specific error types
        let errorTitle = "AI Chat Failed";
        let errorDescription = error.message || 'Failed to get AI response';
        
        if (error.message?.includes('Rate limit')) {
          errorTitle = "Rate Limit Exceeded";
          errorDescription = "Please wait a moment before sending another message.";
        } else if (error.message?.includes('quota') || error.message?.includes('403')) {
          errorTitle = "API Quota Exceeded";
          errorDescription = "The API usage limit has been reached. Please try again later.";
        } else if (error.message?.includes('API key') || error.message?.includes('401')) {
          errorTitle = "Configuration Error";
          errorDescription = "There's an issue with the API configuration. Please contact support.";
        } else if (error.message?.includes('Network')) {
          errorTitle = "Network Error";
          errorDescription = "Please check your internet connection and try again.";
        }
        
        throw new Error(errorDescription);
      }

      if (!data || !data.response) {
        throw new Error('No response received from AI');
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        category: "explanation"
      };

      setMessages(prev => [...prev, aiResponse]);
      console.log('AI response added to chat');
      
      // Show success feedback
      toast({
        title: "Message Sent",
        description: "AI mentor has responded",
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: "AI Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Add error message to chat for context
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `⚠️ Sorry, I encountered an error: ${errorMessage}\n\nPlease try again in a moment.`,
        timestamp: new Date(),
        category: "guidance"
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      // Restore the input so user can try again
      setInput(currentInput);
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

  const getMentorSuggestions = () => {
    if (currentProject) {
      return [
        "What's the next step for my project?",
        "Check my code for bugs",
        "How can I improve this code?",
        "Explain what I just wrote"
      ];
    }
    return [
      "Help me start a new project",
      "Explain this concept",
      "Find bugs in my code",
      "What should I learn next?"
    ];
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <Avatar className="bg-gradient-to-r from-primary to-primary/60">
            <AvatarFallback className="bg-transparent text-white font-bold">CS</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">CodeSplinter AI Mentor</h3>
            <p className="text-sm text-muted-foreground">Your step-by-step coding guide</p>
          </div>
          {currentProject && (
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              {currentProject}
            </Badge>
          )}
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
        
        {/* Mentor Mode Suggestions */}
        <div className="space-y-2 mt-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Bot className="w-3 h-3" />
            Quick mentor questions:
          </div>
          <div className="grid grid-cols-2 gap-1">
            {getMentorSuggestions().map((suggestion, index) => (
              <Button 
                key={index}
                variant="ghost" 
                size="sm" 
                className="text-xs h-8 justify-start p-2"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          {/* What's Next Feature */}
          {currentProject && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs h-8 border-primary/20 bg-primary/5 hover:bg-primary/10"
              onClick={() => setInput("What should I work on next?")}
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              What's next? (Mentor Mode)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
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
  const [abortController, setAbortController] = useState<AbortController | null>(null);
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

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    // Create placeholder assistant message that will be updated
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      type: "assistant",
      content: "",
      timestamp: new Date(),
      category: "explanation"
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      console.log('Invoking gemini-chat function with streaming...');
      
      // Get the Supabase URL from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const response = await fetch(`${supabaseUrl}/functions/v1/gemini-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          code: currentCode
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Streaming error:', errorData);
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let accumulatedContent = "";

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              accumulatedContent += content;
              
              // Update the assistant message in real-time
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === assistantId 
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          } catch (e) {
            // Incomplete JSON, wait for more data
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      console.log('Streaming completed');
      setIsLoading(false);
      setAbortController(null);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle abort gracefully
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted by user');
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantId 
              ? { 
                  ...msg, 
                  content: msg.content + '\n\n_[Response stopped by user]_',
                  category: "guidance"
                }
              : msg
          )
        );
        setIsLoading(false);
        setAbortController(null);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      toast({
        title: "AI Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Update the assistant message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantId 
            ? { 
                ...msg, 
                content: `⚠️ Sorry, I encountered an error: ${errorMessage}\n\nPlease try again in a moment.`,
                category: "guidance"
              }
            : msg
        )
      );
      
      // Restore the input so user can try again
      setInput(currentInput);
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      toast({
        title: "Stopping generation",
        description: "AI response stopped",
      });
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
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button onClick={handleStopGeneration} variant="destructive">
              Stop
            </Button>
          ) : (
            <Button onClick={handleSendMessage} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          )}
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
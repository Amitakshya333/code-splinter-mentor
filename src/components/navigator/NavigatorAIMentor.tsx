import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2, Sparkles, MessageSquare, Maximize2, Minimize2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NavigatorStep } from "@/hooks/useNavigatorState";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NavigatorAIMentorProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: NavigatorStep;
  stepIndex: number;
  totalSteps: number;
  completedSteps: string[];
  platform: string;
  moduleName: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/navigator-mentor`;

export const NavigatorAIMentor = ({ 
  isOpen, 
  onClose, 
  currentStep,
  stepIndex,
  totalSteps,
  completedSteps,
  platform,
  moduleName,
}: NavigatorAIMentorProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hi! I'm your AI mentor for ${moduleName}. I'll help you complete each step successfully. Feel free to ask me anything about the current step or DevOps best practices!`,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Add context message when step changes
    if (currentStep && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && !lastMsg.content.includes(currentStep.title)) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `📍 Now on **Step ${stepIndex + 1}: ${currentStep.title}**\n\n${currentStep.description}${currentStep.tip ? `\n\n💡 **Tip:** ${currentStep.tip}` : ''}${currentStep.warning ? `\n\n⚠️ **Warning:** ${currentStep.warning}` : ''}`,
          timestamp: new Date(),
        }]);
      }
    }
  }, [currentStep?.id]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const context = {
      platform,
      module: moduleName,
      currentStep: currentStep ? {
        title: currentStep.title,
        description: currentStep.description,
        tip: currentStep.tip,
        warning: currentStep.warning,
      } : null,
      stepIndex,
      totalSteps,
      completedSteps,
    };

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages.slice(-10).map(m => ({ role: m.role, content: m.content })).concat([{ role: 'user', content: input.trim() }]),
          context,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantContent = "";
      let assistantMsgId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMsgId ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const quickPrompts = [
    "What should I watch out for?",
    "Explain this step in detail",
    "What are the costs?",
    "Best practices?",
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/5 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className={cn(
        "fixed z-50 animate-in slide-in-from-bottom-4 duration-300",
        isExpanded 
          ? "inset-4 sm:inset-8" 
          : "bottom-6 right-6 w-full max-w-md"
      )}>
        <div className={cn(
          "bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden flex flex-col",
          isExpanded ? "h-full" : "max-h-[80vh]"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  AI Mentor
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                    Live
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">Step {stepIndex + 1} of {totalSteps}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="rounded-full"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 relative" ref={scrollAreaRef}>
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-primary" : "bg-secondary"
                    )}>
                      {msg.role === 'user' ? (
                        <MessageSquare className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-br-sm" 
                        : "bg-secondary rounded-bl-sm"
                    )}>
                      <p className="whitespace-pre-wrap">{msg.content || (isLoading ? '...' : '')}</p>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                    <div className="bg-secondary p-3 rounded-2xl rounded-bl-sm">
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Scroll buttons */}
            <div className="absolute right-2 top-2 flex flex-col gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 rounded-full shadow-md opacity-80 hover:opacity-100"
                onClick={scrollToTop}
                title="Scroll to top"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 rounded-full shadow-md opacity-80 hover:opacity-100"
                onClick={scrollToBottom}
                title="Scroll to bottom"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this step..."
                className="rounded-full bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                size="icon" 
                className="rounded-full shrink-0 bg-primary hover:bg-primary/90"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

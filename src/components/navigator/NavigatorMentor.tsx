import { useState } from "react";
import { X, Send, Bot, Lightbulb, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MentorMessage } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface NavigatorMentorProps {
  messages: MentorMessage[];
  currentHint?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NavigatorMentor = ({ messages, currentHint, isOpen, onClose }: NavigatorMentorProps) => {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const getIcon = (type: MentorMessage['type']) => {
    switch (type) {
      case 'hint': return <Lightbulb className="w-4 h-4 text-warning" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'info': return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/5 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Floating Panel */}
      <div className="fixed bottom-6 right-6 w-full max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Mentor</h3>
                <p className="text-xs text-muted-foreground">Here to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Hint */}
          {currentHint && (
            <div className="mx-4 mt-4 p-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{currentHint}</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="h-64 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-2xl transition-all",
                    msg.type === 'success' && "bg-success/5",
                    msg.type === 'warning' && "bg-destructive/5",
                    msg.type === 'hint' && "bg-warning/5",
                    msg.type === 'info' && "bg-secondary"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {getIcon(msg.type)}
                    <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 ml-6">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="rounded-full bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button size="icon" className="rounded-full shrink-0 bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

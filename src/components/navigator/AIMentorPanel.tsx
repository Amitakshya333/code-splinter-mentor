import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Lightbulb, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { MentorMessage } from "@/hooks/useNavigatorState";
import { cn } from "@/lib/utils";

interface AIMentorPanelProps {
  messages: MentorMessage[];
  currentStepHint?: string;
}

export const AIMentorPanel = ({ messages, currentStepHint }: AIMentorPanelProps) => {
  const [input, setInput] = useState("");

  const getMessageIcon = (type: MentorMessage['type']) => {
    switch (type) {
      case 'hint': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'info': return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  const getMessageStyle = (type: MentorMessage['type']) => {
    switch (type) {
      case 'hint': return 'bg-amber-500/10 border-amber-500/20';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'warning': return 'bg-orange-500/10 border-orange-500/20';
      case 'info': return 'bg-sky-500/10 border-sky-500/20';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-xl">
      {/* Mentor Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-violet-500/50 ring-offset-2 ring-offset-slate-900">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold">
              <Bot className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">AI Mentor</h3>
            <p className="text-xs text-white/50">Here to guide you</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* Current Hint Card */}
      {currentStepHint && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-violet-300 mt-0.5 shrink-0" />
            <p className="text-sm text-violet-100">{currentStepHint}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "p-3 rounded-xl border transition-all duration-300",
                getMessageStyle(msg.type)
              )}
            >
              <div className="flex items-start gap-2">
                {getMessageIcon(msg.type)}
                <p className="text-sm text-white/90 leading-relaxed">{msg.content}</p>
              </div>
              <p className="text-[10px] text-white/30 mt-2 ml-6">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button variant="outline" size="sm" className="text-xs bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
            💡 Give Hint
          </Button>
          <Button variant="outline" size="sm" className="text-xs bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white">
            🔄 Restart
          </Button>
        </div>
        
        {/* Chat Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm"
          />
          <Button size="icon" className="bg-violet-500 hover:bg-violet-600 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

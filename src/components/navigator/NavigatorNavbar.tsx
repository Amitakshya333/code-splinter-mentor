import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, Cloud, Container, Github, Sparkles } from "lucide-react";
import { Platform } from "@/hooks/useNavigatorState";

interface NavigatorNavbarProps {
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export const NavigatorNavbar = ({ platform, onPlatformChange }: NavigatorNavbarProps) => {
  const platforms = [
    { id: 'aws' as Platform, label: 'AWS', icon: Cloud, color: 'from-orange-500 to-yellow-500' },
    { id: 'docker' as Platform, label: 'Docker', icon: Container, color: 'from-blue-500 to-cyan-500' },
    { id: 'github' as Platform, label: 'GitHub', icon: Github, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <nav className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">CodeSplinter</h1>
          <p className="text-[10px] text-white/50 -mt-0.5">Navigator</p>
        </div>
      </div>

      {/* Navigator Mode Badge */}
      <div className="flex items-center gap-2">
        <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1">
          <Sparkles className="w-3 h-3 mr-1.5" />
          Learning Mode
        </Badge>
      </div>

      {/* Tool Selector */}
      <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-1.5">
        {platforms.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            size="sm"
            onClick={() => onPlatformChange(p.id)}
            className={`
              rounded-xl px-4 py-2 transition-all duration-300
              ${platform === p.id 
                ? `bg-gradient-to-r ${p.color} text-white shadow-lg` 
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <p.icon className="w-4 h-4 mr-2" />
            {p.label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

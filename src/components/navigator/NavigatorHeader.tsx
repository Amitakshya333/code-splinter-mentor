import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Compass, Sparkles, MessageCircle, Code2, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { UsageCounter } from "@/components/freemium/UsageCounter";
import { getCurrentUser, signOut } from "@/lib/auth";

interface NavigatorHeaderProps {
  onMentorToggle: () => void;
  showMentor: boolean;
}

export const NavigatorHeader = ({ 
  onMentorToggle,
  showMentor 
}: NavigatorHeaderProps) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground tracking-tight">Navigator</span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                Beta
              </span>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMentorToggle}
            className={cn(
              "gap-2 rounded-full h-8",
              showMentor && "bg-primary/10 text-primary"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">AI Mentor</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 rounded-full h-8"
          >
            <Link to="/ide">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">IDE</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 rounded-full h-8"
          >
            <Link to="/workflows">
              <span className="hidden sm:inline text-sm">Workflows</span>
            </Link>
          </Button>
          <UsageCounter />
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 rounded-full">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Learning</span>
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {userEmail ? getInitials(userEmail) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  {userEmail && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/account/subscription" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

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
import { Compass, MessageCircle, Code2, Settings, LogOut, Map } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = window.location.origin;
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
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25",
            "group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105"
          )}>
            <Map className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight leading-none">
              CodeSplinter
            </span>
            <span className="text-2xs text-muted-foreground font-medium">
              Navigator
            </span>
          </div>
        </Link>

        {/* Center: Breadcrumb / Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success-muted rounded-full">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Learning Mode</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMentorToggle}
            className={cn(
              "gap-2 rounded-full h-9 px-3 transition-all",
              showMentor 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "hover:bg-primary/10"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Mentor</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 rounded-full h-9 px-3 hover:bg-secondary"
          >
            <Link to="/ide">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">IDE</span>
            </Link>
          </Button>

          <div className="hidden sm:block">
            <UsageCounter />
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-9 w-9 p-0 hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <Avatar className="h-9 w-9 border-2 border-border">
                  <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                    {userEmail ? getInitials(userEmail) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="pb-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">Account</p>
                  {userEmail && (
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link to="/account/subscription">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link to="/workflows">
                  <Compass className="mr-2 h-4 w-4" />
                  <span>My Workflows</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
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

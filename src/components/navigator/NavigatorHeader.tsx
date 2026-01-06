import { useState, useEffect, useRef } from "react";
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
import { NavigatorBreadcrumb } from "./NavigatorBreadcrumb";

interface NavigatorHeaderProps {
  onMentorToggle: () => void;
  showMentor: boolean;
  category?: string;
  module?: string;
  currentStep?: number;
  totalSteps?: number;
  progress?: number;
}

export const NavigatorHeader = ({ 
  onMentorToggle,
  showMentor,
  category,
  module,
  currentStep,
  totalSteps,
  progress = 0,
}: NavigatorHeaderProps) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollY = useRef(0);

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
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      
      // Collapse header when scrolling down, expand when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsCollapsed(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsCollapsed(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
        : "bg-transparent border-b border-transparent",
      isCollapsed ? "h-12" : "h-16"
    )}>
      {/* Progress bar in header */}
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/50">
          <div 
            className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <div className={cn(
        "max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between transition-all duration-300",
        isCollapsed && "py-1"
      )}>
        {/* Logo & Breadcrumb */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link to="/" className={cn(
            "flex items-center gap-2 group shrink-0 transition-all duration-300",
            isCollapsed && "gap-1.5"
          )}>
            <div className={cn(
              "rounded-xl flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25",
              "group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105",
              isCollapsed ? "w-8 h-8" : "w-10 h-10"
            )}>
              <Map className={cn(
                "text-primary-foreground transition-all",
                isCollapsed ? "w-4 h-4" : "w-5 h-5"
              )} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground tracking-tight leading-none">
                  CodeSplinter
                </span>
                <span className="text-2xs text-muted-foreground font-medium">
                  Navigator
                </span>
              </div>
            )}
          </Link>

          {/* Breadcrumb */}
          <div className="hidden md:block min-w-0 flex-1">
            <NavigatorBreadcrumb
              category={category}
              module={module}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>
        </div>

        {/* Center: Progress Ring (shows when collapsed) */}
        {isCollapsed && progress > 0 && (
          <div className="hidden md:flex items-center gap-2">
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${progress * 0.628} 62.8`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMentorToggle}
            className={cn(
              "gap-2 rounded-full transition-all",
              isCollapsed ? "h-8 px-2" : "h-9 px-3",
              showMentor 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "hover:bg-primary/10"
            )}
          >
            <MessageCircle className={cn(isCollapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
            {!isCollapsed && <span className="hidden sm:inline text-sm font-medium">Mentor</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "gap-2 rounded-full hover:bg-secondary",
              isCollapsed ? "h-8 px-2" : "h-9 px-3"
            )}
          >
            <Link to="/ide">
              <Code2 className={cn(isCollapsed ? "w-3.5 h-3.5" : "w-4 h-4")} />
              {!isCollapsed && <span className="hidden sm:inline text-sm font-medium">IDE</span>}
            </Link>
          </Button>

          {!isCollapsed && (
            <div className="hidden sm:block">
              <UsageCounter />
            </div>
          )}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-full p-0 hover:ring-2 hover:ring-primary/20 transition-all",
                  isCollapsed ? "h-7 w-7" : "h-9 w-9"
                )}
              >
                <Avatar className={cn(
                  "border-2 border-border",
                  isCollapsed ? "h-7 w-7" : "h-9 w-9"
                )}>
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

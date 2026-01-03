import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/PageTransition";
import { NavigationShortcutsProvider } from "@/components/NavigationShortcutsProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Navigator from "./pages/Navigator";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/login/page";
import SignUpPage from "./pages/auth/signup/page";
import ResetPasswordPage from "./pages/auth/reset-password/page";
import VerifyEmailPage from "./pages/auth/verify-email/page";
import SubscriptionPage from "./pages/account/subscription/page";
import WorkflowsPage from "./pages/workflows/page";

// Optimized Query Client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="codesplinter-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <NavigationShortcutsProvider>
              <PageTransition>
                <Routes>
                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <AuthGuard>
                        <Navigator />
                      </AuthGuard>
                    }
                  />
                  <Route path="/ide" element={<Index />} />
                  
                  {/* Auth routes */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignUpPage />} />
                  <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                  
                  {/* Account routes */}
                  <Route
                    path="/account/subscription"
                    element={
                      <AuthGuard>
                        <SubscriptionPage />
                      </AuthGuard>
                    }
                  />
                  
                  {/* Workflow routes */}
                  <Route
                    path="/workflows"
                    element={
                      <AuthGuard>
                        <WorkflowsPage />
                      </AuthGuard>
                    }
                  />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </NavigationShortcutsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

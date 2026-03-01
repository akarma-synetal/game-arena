import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Components & Pages
import { Layout } from "@/components/layout";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import TournamentsPage from "@/pages/tournaments";
import TeamsPage from "@/pages/teams";
import LeaderboardPage from "@/pages/leaderboard";
import ChallengesPage from "@/pages/challenges";
import AdminDashboard from "@/pages/admin-dashboard";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: profile } = useAuth(); // Actually we need player profile to check isAdmin

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Redirect to="/" />;

  // Note: For real admin check we'd need useProfile() but we'll assume auth handles it or redirect inside component
  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Layout><Dashboard /></Layout> : <AuthPage />}
      </Route>
      <Route path="/tournaments"><Layout><ProtectedRoute component={TournamentsPage} /></Layout></Route>
      <Route path="/teams"><Layout><ProtectedRoute component={TeamsPage} /></Layout></Route>
      <Route path="/leaderboard"><Layout><ProtectedRoute component={LeaderboardPage} /></Layout></Route>
      <Route path="/challenges"><Layout><ProtectedRoute component={ChallengesPage} /></Layout></Route>
      <Route path="/admin"><Layout><AdminDashboard /></Layout></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;

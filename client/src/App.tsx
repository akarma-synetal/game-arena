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

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-display tracking-widest uppercase text-primary text-glow">Initializing System...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Root Route acts as Auth for logged out, Dashboard for logged in */}
      <Route path="/">
        {isAuthenticated ? (
          <Layout><Dashboard /></Layout>
        ) : (
          <AuthPage />
        )}
      </Route>

      {/* Protected Routes wrapped in Layout */}
      <Route path="/tournaments">
        <Layout><ProtectedRoute component={TournamentsPage} /></Layout>
      </Route>
      <Route path="/teams">
        <Layout><ProtectedRoute component={TeamsPage} /></Layout>
      </Route>
      <Route path="/leaderboard">
        <Layout><ProtectedRoute component={LeaderboardPage} /></Layout>
      </Route>
      <Route path="/challenges">
        <Layout><ProtectedRoute component={ChallengesPage} /></Layout>
      </Route>

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

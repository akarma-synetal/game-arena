import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfiles } from "@/hooks/use-profiles";
import NotFound from "@/pages/not-found";

// Components & Pages
import { Layout } from "@/components/layout";
import AuthPage from "@/pages/auth";
import PlayerAuthPage from "@/pages/player-auth";
import AdminLogin from "@/pages/admin-login";

import Dashboard from "@/pages/dashboard";
import TournamentsPage from "@/pages/tournaments";
import TeamsPage from "@/pages/teams";
import LeaderboardPage from "@/pages/leaderboard";
import ChallengesPage from "@/pages/challenges";
import AdminDashboard from "@/pages/admin-dashboard";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfiles();

  if (isLoading || profileLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Redirect to="/player" />;

  if (adminOnly && !profile?.isAdmin) return <Redirect to="/dashboard" />;

  return <Component />;
}

function AdminRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfiles();

  if (isLoading || profileLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (!profile?.isAdmin) {
    return <AdminLogin message="Admin access required" />;
  }

  return <Layout><AdminDashboard /></Layout>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Layout><Dashboard /></Layout> : <AuthPage />}
      </Route>
      <Route path="/dashboard"><Layout><ProtectedRoute component={Dashboard} /></Layout></Route>
      <Route path="/player"><PlayerAuthPage mode="login" /></Route>
      <Route path="/partner"><PlayerAuthPage mode="partner" /></Route>
      <Route path="/login"><Redirect to="/player" /></Route>
      <Route path="/register"><PlayerAuthPage mode="register" /></Route>
      <Route path="/tournaments"><Layout><ProtectedRoute component={TournamentsPage} /></Layout></Route>
      <Route path="/teams"><Layout><ProtectedRoute component={TeamsPage} /></Layout></Route>
      <Route path="/dashboard/leaderboard"><Layout><ProtectedRoute component={LeaderboardPage} /></Layout></Route>
      <Route path="/challenges"><Layout><ProtectedRoute component={ChallengesPage} /></Layout></Route>
      <Route path="/admin"><AdminRoute /></Route>
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

import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfiles } from "@/hooks/use-profiles";
import { AdminProvider } from "@/context/AdminContext";
import NotFound from "@/pages/not-found";

// Components & Pages
import { Layout } from "@/components/layout";
import AuthPage from "@/pages/auth";
import PlayerAuthPage from "@/pages/player-auth";
import AdminLogin from "@/pages/admin-login";

import Dashboard from "@/pages/dashboard";
import PartnerDashboard from "@/pages/partner-dashboard";
import TournamentsPage from "@/pages/tournaments";
import TeamsPage from "@/pages/teams";
import LeaderboardPage from "@/pages/leaderboard";
import ChallengesPage from "@/pages/challenges";
import AdminDashboard from "@/pages/admin-dashboard";

type UserRole = "player" | "partner" | "admin";

function useRole() {
  return useQuery<{ role: UserRole }>({
    queryKey: ["/api/auth/role"],
    queryFn: async () => {
      const response = await fetch("/api/auth/role", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Role unavailable");
      }
      return response.json();
    },
    retry: false,
  });
}

function ProtectedRoute({ component: Component, adminOnly = false, allowedRoles }: { component: React.ComponentType, adminOnly?: boolean, allowedRoles?: UserRole[] }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyProfiles();
  const { data: roleData, isLoading: roleLoading } = useRole();

  const role = roleData?.role || (profile?.isAdmin ? "admin" : "player");

  if (isLoading || profileLoading || roleLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Redirect to="/player" />;

  if (adminOnly && role !== "admin") return <Redirect to="/dashboard" />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Redirect to={role === "partner" ? "/partner/dashboard" : "/dashboard"} />;
  }

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
        {isAuthenticated ? <Redirect to="/dashboard" /> : <AuthPage />}
      </Route>
      <Route path="/dashboard"><Layout><ProtectedRoute component={Dashboard} allowedRoles={["player", "admin"]} /></Layout></Route>
      <Route path="/partner/dashboard"><Layout><ProtectedRoute component={PartnerDashboard} allowedRoles={["partner", "admin"]} /></Layout></Route>
      <Route path="/player"><PlayerAuthPage mode="login" /></Route>
      <Route path="/partner"><PlayerAuthPage mode="partner" /></Route>
      <Route path="/login"><Redirect to="/player" /></Route>
      <Route path="/register"><PlayerAuthPage mode="register" /></Route>
      <Route path="/tournaments"><Layout><ProtectedRoute component={TournamentsPage} allowedRoles={["player", "partner", "admin"]} /></Layout></Route>
      <Route path="/teams"><Layout><ProtectedRoute component={TeamsPage} allowedRoles={["player", "admin"]} /></Layout></Route>
      <Route path="/dashboard/leaderboard"><Layout><ProtectedRoute component={LeaderboardPage} allowedRoles={["player", "partner", "admin"]} /></Layout></Route>
      <Route path="/challenges"><Layout><ProtectedRoute component={ChallengesPage} allowedRoles={["player", "admin"]} /></Layout></Route>
      <Route path="/admin"><AdminRoute /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <Toaster />
          <Router />
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;

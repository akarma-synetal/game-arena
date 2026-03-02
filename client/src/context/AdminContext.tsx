import { createContext, useContext, useState, ReactNode } from "react";

type AdminTab = "overview" | "settings" | "partners" | "players" | "tournaments" | "teams" | "games" | "leaderboard" | "roles";

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <AdminContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminTab() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminTab must be used within AdminProvider");
  }
  return context;
}

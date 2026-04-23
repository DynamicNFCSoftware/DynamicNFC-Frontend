import { createContext, useContext } from "react";
import useDashboardData from "../../hooks/useDashboardData";

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const data = useDashboardData();
  return <DashboardDataContext.Provider value={data}>{children}</DashboardDataContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboard must be inside DashboardDataProvider");
  return ctx;
}

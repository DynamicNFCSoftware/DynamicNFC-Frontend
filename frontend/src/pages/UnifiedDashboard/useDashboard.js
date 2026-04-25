import { createContext, useContext } from "react";

export const DashboardDataContext = createContext(null);

export function useDashboard() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboard must be inside DashboardDataProvider");
  return ctx;
}

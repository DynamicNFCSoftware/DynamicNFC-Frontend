import useDashboardData from "../../hooks/useDashboardData";
import { DashboardDataContext } from "./useDashboard";

export function DashboardDataProvider({ children }) {
  const data = useDashboardData();
  return <DashboardDataContext.Provider value={data}>{children}</DashboardDataContext.Provider>;
}

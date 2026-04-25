import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n";
import { DashboardDataProvider } from "./DashboardDataProvider";
import { useDashboard as useDashboardData } from "./useDashboard";

const SECTION_ROUTES = [
  { match: "/vip-crm", name: "VIPCrm" },
  { match: "/analytics", name: "Analytics" },
  { match: "/inventory", name: "Inventory" },
  { match: "/cards", name: "Cards" },
  { match: "/pipeline", name: "Pipeline" },
  { match: "/campaigns", name: "Campaigns" },
  { match: "/settings", name: "Settings" },
  { match: "/priority", name: "Overview" },
];

function getActiveSection(pathname = "") {
  const normalizedPath = String(pathname || "").toLowerCase();
  const matched = SECTION_ROUTES.find((route) => normalizedPath.includes(route.match));
  return matched?.name || "Overview";
}

export function DashboardProvider({ children }) {
  return <DashboardDataProvider>{children}</DashboardDataProvider>;
}

export function useDashboard() {
  const data = useDashboardData();
  const { lang } = useLanguage();
  const { pathname } = useLocation();

  return useMemo(
    () => ({
      ...data,
      lang,
      activeSection: getActiveSection(pathname),
    }),
    [data, lang, pathname]
  );
}

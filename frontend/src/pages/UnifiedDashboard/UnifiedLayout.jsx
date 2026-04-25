import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../i18n";
import "../../i18n/eventDisplayMap";
import { SectorProvider, useSector } from "../../hooks/useSector";
import { useRegion } from "../../hooks/useRegion";
import { REGION_LIST, getProjectName, getPersonas } from "../../config/regionConfig";
import logoFallback from "../../../logo_l_check.png";
import AiBadge from "./components/AiBadge";
import { DashboardDataProvider } from "./DashboardDataProvider";
import { useDashboard } from "./useDashboard";
import ExportPDF from "./components/ExportPDF";
import NotificationSystem from "./components/NotificationSystem";
import SectorSwitcher from "./components/SectorSwitcher";
import RegionMorphLoader from "../../components/RegionMorphLoader/RegionMorphLoader";
import AutomotiveMorphLoader from "../../components/AutomotiveMorphLoader/AutomotiveMorphLoader";
import YachtMorphLoader from "../../components/YachtMorphLoader/YachtMorphLoader";
import "./UnifiedLayout.css";

const LAYOUT_TEXT = {
  en: {
    aiBadge: "Powered by DynamicNFC Intelligence",
    userFallback: "admin@dynamicnfc.ca",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    live: "Live",
    demo: "Demo",
    inviteVip: "Invite VIP",
    tenant: "Tenant",
    portalLinks: "Portal links",
    portalVip: "VIP",
    portalRegistered: "Registered",
    portalAnonymous: "Anonymous",
    portalReKhalid: "VIP Investor (Khalid Al-Rashid)",
    portalReAhmed: "Registered Buyer (Ahmed Al-Fahad)",
    portalReMarketplace: "Anonymous Marketplace",
    portalReLogin: "Registered Login Portal",
    portalAutoKhalid: "VIP Showroom (Khalid)",
    portalAutoSultan: "Registered Buyer (Sultan)",
    portalAutoShowroom: "Anonymous Showroom",
    portalYachtVip: "VIP Owner (Private Marina)",
    portalYachtRegistered: "Registered Charter Client",
    portalYachtShowroom: "Anonymous Marina Showcase",
    portalViewAll: "View all links",
    portalShowLess: "Show less",
    setupTitle: "Setting up your demo workspace...",
    setupSub: "Preparing your tenant data for first-time access.",
    toggleTheme: "Toggle theme",
    close: "Close",
    languageLabel: "Language",
    preparingRegionLoadingTenantData: "Preparing your region · Loading tenant data",
    preparingShowroomLoadingTenantData: "Preparing showroom · Loading tenant data",
  },
  ar: {
    aiBadge: "مدعوم بذكاء DynamicNFC",
    userFallback: "admin@dynamicnfc.ca",
    portalLinks: "روابط البوابة",
    portalVip: "VIP",
    portalRegistered: "مسجل",
    portalAnonymous: "مجهول",
    portalReKhalid: "مستثمر VIP (خالد الراشد)",
    portalReAhmed: "مشتري مسجل (أحمد الفهد)",
    portalReMarketplace: "السوق المجهول",
    portalReLogin: "بوابة تسجيل الدخول",
    portalAutoKhalid: "صالة VIP (خالد)",
    portalAutoSultan: "مشتري مسجل (سلطان)",
    portalAutoShowroom: "صالة مجهولة",
    portalYachtVip: "مالك VIP (مارينا خاصة)",
    portalYachtRegistered: "عميل شارتر مسجل",
    portalYachtShowroom: "عرض مارينا مجهول",
    portalViewAll: "عرض كل الروابط",
    portalShowLess: "عرض أقل",
    expandSidebar: "توسيع الشريط الجانبي",
    collapseSidebar: "طي الشريط الجانبي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    live: "مباشر",
    demo: "تجريبي",
    inviteVip: "دعوة VIP",
    tenant: "المؤجر",
    setupTitle: "جاري إعداد مساحة العمل...",
    setupSub: "يتم تجهيز بيانات Tenant الخاصة بك لأول مرة.",
    toggleTheme: "تبديل النمط",
    close: "إغلاق",
    languageLabel: "اللغة",
    preparingRegionLoadingTenantData: "جارٍ تجهيز منطقتك · جارٍ تحميل بيانات المستأجر",
    preparingShowroomLoadingTenantData: "جارٍ تجهيز صالة العرض · جارٍ تحميل بيانات المستأجر",
  },
  es: {
    aiBadge: "Impulsado por DynamicNFC Intelligence",
    userFallback: "admin@dynamicnfc.ca",
    portalLinks: "Enlaces del portal",
    portalVip: "VIP",
    portalRegistered: "Registrado",
    portalAnonymous: "Anonimo",
    portalReKhalid: "Inversor VIP (Khalid Al-Rashid)",
    portalReAhmed: "Comprador registrado (Ahmed Al-Fahad)",
    portalReMarketplace: "Marketplace anonimo",
    portalReLogin: "Portal de login registrado",
    portalAutoKhalid: "Showroom VIP (Khalid)",
    portalAutoSultan: "Comprador registrado (Sultan)",
    portalAutoShowroom: "Showroom anonimo",
    portalYachtVip: "Propietario VIP (Marina Privada)",
    portalYachtRegistered: "Cliente charter registrado",
    portalYachtShowroom: "Vitrina marina anonima",
    portalViewAll: "Ver todos los enlaces",
    portalShowLess: "Ver menos",
    expandSidebar: "Expandir barra lateral",
    collapseSidebar: "Contraer barra lateral",
    openMenu: "Abrir menu",
    closeMenu: "Cerrar menu",
    live: "En vivo",
    demo: "Demo",
    inviteVip: "Invitar VIP",
    tenant: "Tenant",
    setupTitle: "Configurando tu espacio demo...",
    setupSub: "Preparando datos de tu tenant para el primer acceso.",
    toggleTheme: "Cambiar tema",
    close: "Cerrar",
    languageLabel: "Idioma",
    preparingRegionLoadingTenantData: "Preparando tu región · Cargando datos del tenant",
    preparingShowroomLoadingTenantData: "Preparando showroom · Cargando datos del tenant",
  },
  fr: {
    aiBadge: "Propulse par DynamicNFC Intelligence",
    userFallback: "admin@dynamicnfc.ca",
    portalLinks: "Liens du portail",
    portalVip: "VIP",
    portalRegistered: "Enregistre",
    portalAnonymous: "Anonyme",
    portalReKhalid: "Investisseur VIP (Khalid Al-Rashid)",
    portalReAhmed: "Acheteur enregistre (Ahmed Al-Fahad)",
    portalReMarketplace: "Marketplace anonyme",
    portalReLogin: "Portail de connexion enregistre",
    portalAutoKhalid: "Showroom VIP (Khalid)",
    portalAutoSultan: "Acheteur enregistre (Sultan)",
    portalAutoShowroom: "Showroom anonyme",
    portalYachtVip: "Proprietaire VIP (Marina privee)",
    portalYachtRegistered: "Client charter enregistre",
    portalYachtShowroom: "Vitrine marina anonyme",
    portalViewAll: "Voir tous les liens",
    portalShowLess: "Voir moins",
    expandSidebar: "Etendre la barre laterale",
    collapseSidebar: "Reduire la barre laterale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    live: "En direct",
    demo: "Démo",
    inviteVip: "Inviter VIP",
    tenant: "Locataire",
    setupTitle: "Configuration de votre espace demo...",
    setupSub: "Preparation des donnees locataire pour le premier acces.",
    toggleTheme: "Basculer le thème",
    close: "Fermer",
    languageLabel: "Langue",
    preparingRegionLoadingTenantData: "Préparation de votre région · Chargement des données du locataire",
    preparingShowroomLoadingTenantData: "Préparation du showroom · Chargement des données du locataire",
  },
};
const NAVBAR_LOGO_PATH = "/assets/images/logo.png";

const TAB_GROUPS = [
  { id: "intelligence", label: { en: "Intelligence", ar: "الذكاء", es: "Inteligencia", fr: "Intelligence" }, startIdx: 0, endIdx: 3 },
  { id: "operations", label: { en: "Operations", ar: "العمليات", es: "Operaciones", fr: "Operations" }, startIdx: 4, endIdx: 7 },
  { id: "system", label: { en: "System", ar: "النظام", es: "Sistema", fr: "Systeme" }, startIdx: 8, endIdx: 8 },
];

const TABS = [
  {
    path: "",
    label: { en: "Overview", ar: "نظرة عامة", es: "Vista general", fr: "Vue generale" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    path: "vip-crm",
    label: { en: "VIP CRM", ar: "إدارة VIP", es: "CRM VIP", fr: "CRM VIP" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6M23 11h-6" />
      </svg>
    ),
  },
  {
    path: "priority",
    label: { en: "Priority VIP", ar: "أولوية VIP", es: "VIP Prioritario", fr: "VIP prioritaire" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    path: "analytics",
    label: { en: "Analytics", ar: "التحليلات", es: "Analitica", fr: "Analytique" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    path: "pipeline",
    label: { en: "Pipeline", ar: "خط الأنابيب", es: "Pipeline", fr: "Pipeline" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="6" height="18" rx="1" />
        <rect x="9" y="8" width="6" height="13" rx="1" />
        <rect x="17" y="5" width="6" height="16" rx="1" />
      </svg>
    ),
  },
  {
    path: "inventory",
    label: { en: "Units & Plans", ar: "الوحدات", es: "Unidades", fr: "Unites et plans" },
    dynamicLabel: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    path: "cards",
    label: { en: "NFC Cards", ar: "بطاقات NFC", es: "Tarjetas NFC", fr: "Cartes NFC" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M12 12a3 3 0 1 0 0-1M16 12a7 7 0 1 0 0-1" />
      </svg>
    ),
  },
  {
    path: "campaigns",
    label: { en: "Campaigns", ar: "الحملات", es: "Campanas", fr: "Campagnes" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    path: "settings",
    label: { en: "Settings", ar: "الإعدادات", es: "Configuracion", fr: "Parametres" },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function hexToRgba(hex, alpha = 0.14) {
  const raw = (hex || "#457b9d").replace("#", "");
  if (raw.length !== 6) return `rgba(69,123,157,${alpha})`;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function UnifiedLayout() {
  return (
    <SectorProvider>
      <DashboardDataProvider>
        <UnifiedLayoutInner />
      </DashboardDataProvider>
    </SectorProvider>
  );
}
function getPortalLinks(sectorId, tx, regionId, lang) {
  const personaLabel = (persona) => {
    if (!persona) return "";
    const role = persona.role?.[lang] || persona.role?.en || "";
    return role ? `${role} (${persona.name})` : persona.name;
  };

  if (sectorId === "real_estate") {
    const personas = getPersonas("real_estate", regionId);
    return [
      { id: "re-vip", label: personaLabel(personas.find((p) => p.id === "vip1")) || tx.portalReKhalid, kind: tx.portalVip, href: "/enterprise/crmdemo/khalid" },
      { id: "re-reg", label: personaLabel(personas.find((p) => p.id === "fam1")) || tx.portalReAhmed, kind: tx.portalRegistered, href: "/enterprise/crmdemo/ahmed" },
      { id: "re-login", label: tx.portalReLogin, kind: tx.portalRegistered, href: "/enterprise/crmdemo/registered" },
      { id: "re-anon", label: tx.portalReMarketplace, kind: tx.portalAnonymous, href: "/enterprise/crmdemo/marketplace" },
    ];
  }
  if (sectorId === "automotive") {
    const personas = getPersonas("automotive", regionId);
    return [
      { id: "auto-vip", label: personaLabel(personas.find((p) => p.id === "vip1")) || tx.portalAutoKhalid, kind: tx.portalVip, href: "/automotive/demo/khalid" },
      { id: "auto-reg", label: personaLabel(personas.find((p) => p.id === "vip2")) || tx.portalAutoSultan, kind: tx.portalRegistered, href: "/automotive/demo/sultan" },
      { id: "auto-anon", label: tx.portalAutoShowroom, kind: tx.portalAnonymous, href: "/automotive/demo/showroom" },
    ];
  }
  // Yacht portal routes don't exist yet — hide links until yacht portals ship
  return [];
}

function UnifiedLayoutInner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showPortalFlyout, setShowPortalFlyout] = useState(false);
  const [expandedGroupIds, setExpandedGroupIds] = useState(["intelligence", "operations"]);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const portalBtnRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("ud-theme") || "light");

  const togglePortalFlyout = useCallback(() => {
    // Compute position BEFORE toggling state so the flyout renders in the right place
    // on the very first paint. Uses fixed positioning relative to viewport — render
    // via createPortal so no sidebar overflow / stacking context can clip it.
    if (!showPortalFlyout && portalBtnRef.current) {
      const rect = portalBtnRef.current.getBoundingClientRect();
      const isRtl =
        document.documentElement.dir === "rtl" ||
        document.querySelector(".ud-layout")?.getAttribute("dir") === "rtl";
      const flyoutWidth = 268;
      const flyoutHeight = 280;
      const margin = 8;
      const fitsBelow = rect.top + flyoutHeight < window.innerHeight - margin;
      // Prefer anchoring to the inline-end of the button; clamp to viewport so it
      // never overflows (critical when the button is near the top or bottom edge).
      let left = isRtl ? rect.left - flyoutWidth - margin : rect.right + margin;
      left = Math.min(Math.max(margin, left), window.innerWidth - flyoutWidth - margin);
      const top = fitsBelow
        ? Math.max(margin, rect.top)
        : Math.max(margin, window.innerHeight - flyoutHeight - margin);
      setFlyoutPos({ top, left });
    }
    setShowPortalFlyout((prev) => !prev);
  }, [showPortalFlyout]);
  const { regionId, region, switchRegion } = useRegion();
  const { config, st } = useSector();
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const { vips } = useDashboard();
  const tx = LAYOUT_TEXT[lang] || LAYOUT_TEXT.en;
  const projectName = getProjectName(config.id, regionId, lang);
  const portalLinks = getPortalLinks(config.id, tx, regionId, lang);
  const getPortalKindCode = useCallback(
    (kind) => (kind === tx.portalVip ? "VIP" : kind === tx.portalRegistered ? "REG" : "ANON"),
    [tx.portalVip, tx.portalRegistered]
  );
  const activeGroupId = useMemo(() => {
    const path = location.pathname || "";
    if (
      path.includes("/pipeline") ||
      path.includes("/inventory") ||
      path.includes("/cards") ||
      path.includes("/campaigns")
    ) {
      return "operations";
    }
    if (path.includes("/settings")) return "system";
    return "intelligence";
  }, [location.pathname]);
  const layoutStyle = {
    "--ud-accent": region?.sidebarAccent || "#457b9d",
    "--ud-nav-active-color": region?.sidebarAccent || "#457b9d",
    "--ud-accent-bg": hexToRgba(region?.sidebarAccent || "#457b9d"),
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ud-theme", next);
  };


  // Sync theme when changed from SettingsTab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "ud-theme" && e.newValue) setTheme(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (sidebarCollapsed) return;
    setExpandedGroupIds((prev) => {
      if (prev.includes(activeGroupId)) return prev;
      return [...prev, activeGroupId];
    });
  }, [activeGroupId, sidebarCollapsed]);

  const getTabLabel = (tab) => {
    if (tab.dynamicLabel && tab.path === "inventory") {
      return `${st(config.inventory.itemLabelPlural)} & ${
        { en: "Plans", ar: "الخطط", es: "Planos", fr: "Plans" }[lang] || "Plans"
      }`;
    }
    return tab.label?.[lang] || tab.label?.en || "";
  };
  return (
    <div className={`ud-layout ud-variant-b ${sidebarCollapsed ? "ud-collapsed" : ""} ud-theme-${theme}`} dir={region?.rtl?.[lang] ? "rtl" : "ltr"} style={layoutStyle}>
      {!sidebarOpen && (
        <button className="ud-hamburger" onClick={() => setSidebarOpen(true)} aria-label={tx.openMenu} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className={`ud-sidebar-backdrop ${sidebarOpen ? "ud-backdrop-visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label={tx.closeMenu}
      />
      <aside className={`ud-sidebar ${sidebarOpen ? "ud-sidebar-open" : ""} ud-sector-${config.id}`}>
        <div className="ud-sidebar-header">
          <button
            className="ud-collapse-btn"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={
              sidebarCollapsed
                ? tx.expandSidebar
                : tx.collapseSidebar
            }
            aria-expanded={!sidebarCollapsed}
            aria-controls="ud-sidebar-nav"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarCollapsed ? (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              ) : (
                <>
                  <polyline points="14 18 8 12 14 6" />
                  <polyline points="20 18 14 12 20 6" />
                </>
              )}
            </svg>
          </button>
          {sidebarOpen && (
            <button
              className="ud-sidebar-close-mobile"
              onClick={() => setSidebarOpen(false)}
              aria-label={tx.closeMenu}
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <SectorSwitcher />
        <div className="ud-project-name">{projectName}</div>

        <nav className="ud-nav">
          {TAB_GROUPS.map((group) => (
            <div key={group.id} className="ud-nav-section">
              {!sidebarCollapsed ? (
                <button
                  type="button"
                  className={`ud-nav-section-toggle ${expandedGroupIds.includes(group.id) ? "is-open" : ""}`}
                  onClick={() => {
                    setExpandedGroupIds((prev) => (
                      prev.includes(group.id)
                        ? prev.filter((id) => id !== group.id)
                        : [...prev, group.id]
                    ));
                  }}
                >
                  <span className="ud-nav-section-label">{group.label[lang] || group.label.en}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              ) : null}
              {(sidebarCollapsed || expandedGroupIds.includes(group.id)) &&
                TABS.slice(group.startIdx, group.endIdx + 1).map((tab) => (
                  <NavLink
                    key={tab.path || "overview"}
                    to={tab.path || "."}
                    end={tab.path === ""}
                    onClick={() => setSidebarOpen(false)}
                    aria-label={getTabLabel(tab)}
                    title={getTabLabel(tab)}
                    className={({ isActive }) => `ud-nav-item ${isActive ? "ud-nav-active" : ""}`}
                  >
                    <span className="ud-nav-icon">{tab.icon}</span>
                    <span className="ud-nav-label">{getTabLabel(tab)}</span>
                    {tab.path === "vip-crm" && (vips?.length || 0) > 0 ? (
                      <span className="ud-nav-badge">{vips.length}</span>
                    ) : null}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
        <div className="ud-demo-links">
          {sidebarCollapsed ? (
            <div className="ud-portal-collapsed-wrap">
              <button
                ref={portalBtnRef}
                className="ud-portal-icon-btn"
                type="button"
                onClick={togglePortalFlyout}
                aria-label={tx.portalLinks}
                data-tooltip={tx.portalLinks}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button
                ref={portalBtnRef}
                type="button"
                className="ud-portal-header-btn"
                onClick={togglePortalFlyout}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="ud-portal-header-btn__label">{tx.portalLinks}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </>
          )}
        </div>
        {showPortalFlyout && createPortal(
          <>
            <button
              type="button"
              className="ud-portal-flyout-backdrop"
              onClick={() => setShowPortalFlyout(false)}
              aria-label={tx.closeMenu}
            />
            <div className="ud-portal-flyout" style={{ top: flyoutPos.top, left: flyoutPos.left }}>
              <div className="ud-portal-flyout-title">{tx.portalLinks}</div>
              {portalLinks.map((portal) => (
                <a
                  key={portal.id}
                  href={portal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ud-demo-link"
                  title={portal.label}
                  onClick={() => setShowPortalFlyout(false)}
                >
                  <span className="ud-demo-link-label">{portal.label}</span>
                  <span className={`ud-demo-link-kind ud-kind-${portal.kind === tx.portalVip ? "vip" : portal.kind === tx.portalRegistered ? "reg" : "anon"}`}>
                    {getPortalKindCode(portal.kind)}
                  </span>
                </a>
              ))}
            </div>
          </>,
          document.body
        )}

        <div className="ud-sidebar-footer">
          <div className="ud-user-info">
            <div className="ud-user-avatar">{user?.email?.charAt(0)?.toUpperCase() || "U"}</div>
            <span className="ud-user-email">{user?.email || tx.userFallback}</span>
          </div>
        </div>
      </aside>
      <div className="ud-global-powered">
        <AiBadge text={tx.aiBadge} />
      </div>
      <LayoutContent
        title={st(config.identity.dashboardTitle)}
        lang={lang}
        setLang={setLang}
        pathname={location.pathname}
        theme={theme}
        toggleTheme={toggleTheme}
        region={region}
        regionId={regionId}
        switchRegion={switchRegion}
        showRegionMenu={showRegionMenu}
        setShowRegionMenu={setShowRegionMenu}
      />
    </div>
  );
}

function LayoutContent({
  title,
  lang,
  setLang,
  pathname,
  theme,
  toggleTheme,
  region,
  regionId,
  switchRegion,
  showRegionMenu,
  setShowRegionMenu,
}) {
  const { dataMode, events, seedingInProgress } = useDashboard();
  const { sectorId } = useSector();
  const navigate = useNavigate();
  const tx = LAYOUT_TEXT[lang] || LAYOUT_TEXT.en;
  if (seedingInProgress) {
    const sectorLower = (sectorId || "").toLowerCase().replace(/[-_]/g, "");
    const isRealEstate = sectorLower === "realestate";
    const isAutomotive = sectorLower === "automotive";
    const isYacht = sectorLower === "yacht" || sectorLower === "yachts";
    const safeRegion = (regionId || "canada").toLowerCase();

    return (
      <div className="ud-content-area">
        <main className="ud-main">
          {isRealEstate ? (
            <div className="ud-card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
              <RegionMorphLoader
                region={safeRegion}
                statusText={tx.preparingRegionLoadingTenantData}
              />
            </div>
          ) : isAutomotive ? (
            <div className="ud-card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
              <AutomotiveMorphLoader
                region={safeRegion}
                statusText={tx.preparingShowroomLoadingTenantData}
              />
            </div>
          ) : isYacht ? (
            <div className="ud-card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
              <YachtMorphLoader
                region={safeRegion}
              />
            </div>
          ) : (
            <div className="ud-card" style={{ marginTop: 24, textAlign: "center", padding: 32 }}>
              <div className="ud-card-title">{tx.setupTitle}</div>
              <div className="ud-card-subtitle">
                {tx.setupSub}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
  return (
    <div className="ud-content-area">
      <main className="ud-main">
        <div className="ud-topbar">
          <div className="ud-topbar-left">
            <img
              src={NAVBAR_LOGO_PATH}
              alt="DynamicNFC"
              className="ud-topbar-logo-img"
              onError={(e) => { e.target.onerror = null; e.target.src = logoFallback; }}
            />
            <div className="ud-topbar-divider" />
            <h1 className="ud-page-title">{title}</h1>
          </div>
          <div className="ud-topbar-actions">
            <div className="ud-live-indicator">
              <span className="ud-live-dot" />
              {dataMode === "live" ? tx.live : tx.demo}
            </div>
            <div className="ud-region-wrap" style={{ position: "relative" }}>
              <button
                type="button"
                className="ud-region-btn"
                onClick={() => setShowRegionMenu((p) => !p)}
              >
                <span>{region?.flag}</span>
                <span>{region?.label?.[lang] || regionId}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showRegionMenu && (
                <>
                  <button
                    type="button"
                    className="ud-region-backdrop"
                    onClick={() => setShowRegionMenu(false)}
                    aria-label={tx.close}
                  />
                  <div className="ud-region-menu">
                    {REGION_LIST.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        className={`ud-region-option ${r.id === regionId ? "ud-region-option--active" : ""}`}
                        onClick={() => {
                          if (r.languages && !r.languages.includes(lang)) {
                            setLang(r.defaultLang || r.languages[0] || "en");
                          }
                          switchRegion(r.id);
                          setShowRegionMenu(false);
                        }}
                      >
                        <span>{r.flag}</span> <span>{r.label?.[lang] || r.id}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {(region?.languages || ["en"]).length > 1 && (
              <div className="ud-lang-toggle" role="group" aria-label={tx.languageLabel}>
                {(region?.languages || ["en"]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`ud-lang-btn ${l === lang ? "ud-lang-active" : ""}`}
                    onClick={() => setLang(l)}
                    aria-pressed={l === lang}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            <button type="button" className="ud-btn-icon" onClick={toggleTheme} aria-label={tx.toggleTheme}>
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <ExportPDF />
          </div>
        </div>
        <div className="ud-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
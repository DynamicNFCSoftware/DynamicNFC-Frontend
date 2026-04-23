import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "./i18n";
import { RegionProvider } from "./hooks/useRegion";

/* ── Global CSS ── */
import './assets/css/blinq-app.shared.423b915ad.min.css';
import './assets/css/swiper-bundle.min.css';
import './assets/css/ordercard.css?ver=9';
import './index.css';

/* ── Components (always loaded) ── */
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import PageSkeleton from "./components/Skeleton/PageSkeleton";
import PageTransition from "./components/PageTransition/PageTransition";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";
import Onboarding from "./components/Onboarding/Onboarding";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import LiveChat from "./components/LiveChat/LiveChat";
import PushNotification from "./components/PushNotification/PushNotification";
import EmailCapture from "./components/EmailCapture/EmailCapture";
import "./components/Accessibility/Accessibility.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  shouldHideNavbar,
  shouldHideBreadcrumb,
  shouldHideCookieBanner,
  shouldHideWhatsApp,
} from "./navigation/shellVisibility";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/* ── Lazy-loaded Pages ── */
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const NFCCards = lazy(() => import("./pages/NFCCards/NFCCards"));
const Enterprise = lazy(() => import("./pages/Enterprise/Enterprise"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogPost = lazy(() => import("./pages/Blog/BlogPost"));
const Developers = lazy(() => import("./pages/Developers/Developers"));
const RealEstate = lazy(() => import("./pages/RealEstate/RealEstate"));
const ContactSales = lazy(() => import("./pages/ContactSales/ContactSales"));
const OrderCardPage = lazy(() => import("./pages/OrderCardPage"));
const Automotive = lazy(() => import("./pages/Automotive/Automotive"));

const CreateCard = lazy(() => import("./pages/CreateCard/CreateCard"));
const EditCard = lazy(() => import("./pages/EditCard/EditCard"));
const CardDashboard = lazy(() => import("./pages/CardDashboard/CardDashboard"));
const CreatePhysicalCard = lazy(() => import("./pages/CreatePhysicalCard/CreatePhysicalCard"));
const Card = lazy(() => import("./pages/Card/Card"));
const LoginPortal = lazy(() => import("./pages/LoginPortal/LoginPortal"));

const CRMGateway = lazy(() => import("./pages/CRMGateway/CRMGateway"));
const VIPPortal = lazy(() => import("./pages/VIPPortal/VIPPortal_Definitive"));
const AhmedPortal = lazy(() => import("./pages/AhmedPortal/AhmedPortal"));
const MarketplacePortal = lazy(() => import("./pages/MarketplacePortal/MarketplacePortal"));
const CRMDashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const AIDemo = lazy(() => import("./pages/AIDemo/AIDemo"));
const ROICalculator = lazy(() => import("./pages/ROICalculator/ROICalculator"));
const BuyerROICalculator = lazy(() => import("./pages/BuyerROICalculator/BuyerROICalculator"));
const AutoGateway = lazy(() => import("./pages/AutomotiveDemo/AutoGateway"));
const AutomotivePortal = lazy(() => import("./pages/AutomotiveDemo/AutomotivePortal"));
const SultanPortal = lazy(() => import("./pages/AutomotiveDemo/SultanPortal"));
const PublicShowroom = lazy(() => import("./pages/AutomotiveDemo/PublicShowroom"));
const AutoDashboard = lazy(() => import("./pages/AutomotiveDemo/AutoDashboard"));
const AutoAIDemo = lazy(() => import("./pages/AutomotiveDemo/AutoAIDemo"));
const NFCWriteGuide = lazy(() => import("./pages/NFCWriteGuide/NFCWriteGuide"));
const CardRedirect = lazy(() => import("./pages/CardRedirect/CardRedirect"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/tabs/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/Admin/tabs/AdminAnalytics"));
const AdminCards = lazy(() => import("./pages/Admin/tabs/AdminCards"));
const AdminCampaigns = lazy(() => import("./pages/Admin/tabs/AdminCampaigns"));
const AdminSettings = lazy(() => import("./pages/Admin/tabs/AdminSettings"));
const AdminVIPProfile = lazy(() => import("./pages/Admin/tabs/AdminVIPProfile"));
const AdminVIPCRM = lazy(() => import("./pages/Admin/tabs/AdminVIPCRM"));
const AdminPriorityVIP = lazy(() => import("./pages/Admin/tabs/AdminPriorityVIP"));
const AdminTeam = lazy(() => import("./pages/Admin/tabs/AdminTeam"));
const UnifiedLayout = lazy(() => import("./pages/UnifiedDashboard/UnifiedLayout"));
const OverviewTab = lazy(() => import("./pages/UnifiedDashboard/tabs/OverviewTab"));
const VIPCrmTab = lazy(() => import("./pages/UnifiedDashboard/tabs/VIPCrmTab"));
const PriorityTab = lazy(() => import("./pages/UnifiedDashboard/tabs/PriorityTab"));
const AnalyticsTab = lazy(() => import("./pages/UnifiedDashboard/tabs/AnalyticsTab"));
const PipelineTab = lazy(() => import("./pages/UnifiedDashboard/tabs/PipelineTab"));
const InventoryTab = lazy(() => import("./pages/UnifiedDashboard/tabs/InventoryTab"));
const CardsTab = lazy(() => import("./pages/UnifiedDashboard/tabs/CardsTab"));
const CampaignsTab = lazy(() => import("./pages/UnifiedDashboard/tabs/CampaignsTab"));
const SettingsTab = lazy(() => import("./pages/UnifiedDashboard/tabs/SettingsTab"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Terms = lazy(() => import("./pages/Legal/Terms"));
const Privacy = lazy(() => import("./pages/Legal/Privacy"));

const PageLoader = () => <PageSkeleton />;

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function RouteTracker() {
  const location = useLocation();
  React.useEffect(() => {
    if (localStorage.getItem('dnfc_cookie_consent') === 'accepted' && typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);
  return null;
}

function WhatsAppButtonWrapper() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  if (shouldHideWhatsApp(pathname)) return null;
  return <WhatsAppButton lang={lang} />;
}

function CookieConsentWrapper() {
  const { pathname } = useLocation();
  if (shouldHideCookieBanner(pathname)) return null;
  return <CookieConsent />;
}

function NavbarWrapper() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/unified")) return null;
  if (shouldHideNavbar(pathname)) return null;
  return <Navbar />;
}

function BreadcrumbWrapper() {
  const { pathname } = useLocation();
  if (shouldHideBreadcrumb(pathname)) return null;
  return <Breadcrumb />;
}

function P({ children }) {
  return <PageTransition>{children}</PageTransition>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />} key={location.pathname}>
        <Routes location={location}>

          {/* ── Smart URL Redirect (no animation) ── */}
          <Route path="/c/:cardId" element={<CardRedirect />} />

          {/* ── Public Pages ── */}
          <Route path="/" element={<P><Home /></P>} />
          <Route path="/login" element={<P><Login /></P>} />
          <Route path="/nfc-cards" element={<P><NFCCards /></P>} />
          <Route path="/enterprise" element={<P><Enterprise /></P>} />
          <Route path="/pricing" element={<P><Pricing /></P>} />
          <Route path="/blog" element={<P><Blog /></P>} />
          <Route path="/blog/:slug" element={<P><BlogPost /></P>} />
          <Route path="/developers" element={<P><Developers /></P>} />
          <Route path="/real-estate" element={<Navigate to="/developers" replace />} />
          <Route path="/contact-sales" element={<P><ContactSales /></P>} />
          <Route path="/sales/roi-calculator" element={<P><ROICalculator /></P>} />
          <Route path="/order-card" element={<P><OrderCardPage /></P>} />
          <Route path="/nfc-write-guide" element={<P><NFCWriteGuide /></P>} />
          <Route path="/terms" element={<P><Terms /></P>} />
          <Route path="/privacy" element={<P><Privacy /></P>} />
          <Route path="/automotive" element={<P><Automotive /></P>} />
          <Route path="/automotive/demo" element={<P><AutoGateway /></P>} />
          <Route path="/automotive/demo/khalid" element={<P><AutomotivePortal /></P>} />
          <Route path="/automotive/demo/sultan" element={<P><SultanPortal /></P>} />
          <Route path="/automotive/demo/showroom" element={<P><PublicShowroom /></P>} />
          <Route path="/automotive/demo/ai" element={<P><AutoAIDemo /></P>} />
          <Route path="/automotive/dashboard" element={<P><AutoDashboard /></P>} />
          <Route path="/card" element={<P><Card /></P>} />
          <Route path="/enterprise/crmdemo/registered" element={<P><LoginPortal /></P>} />

          {/* ── Authenticated Pages ── */}
          <Route path="/create-card" element={
            <ProtectedRoute><P><CreateCard /></P></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><P><CardDashboard /></P></ProtectedRoute>
          } />
          <Route path="/edit-card" element={
            <ProtectedRoute><P><EditCard /></P></ProtectedRoute>
          } />
          <Route path="/create-physical-card" element={
            <ProtectedRoute><P><CreatePhysicalCard /></P></ProtectedRoute>
          } />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="vip-crm" element={<AdminVIPCRM />} />
            <Route path="priority" element={<AdminPriorityVIP />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="cards" element={<AdminCards />} />
            <Route path="cards/:cardId" element={<AdminVIPProfile />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── CRM Demo System ── */}
          <Route path="/enterprise/crmdemo" element={<P><CRMGateway /></P>} />
          <Route path="/enterprise/crmdemo/khalid" element={<P><VIPPortal /></P>} />
          <Route path="/enterprise/crmdemo/ahmed" element={<P><AhmedPortal /></P>} />
          <Route path="/enterprise/crmdemo/marketplace" element={<P><MarketplacePortal /></P>} />
          <Route path="/enterprise/crmdemo/dashboard" element={<P><CRMDashboard /></P>} />
          <Route path="/enterprise/crmdemo/ai-demo" element={<P><AIDemo /></P>} />
          <Route path="/enterprise/crmdemo/roi-calculator" element={<P><BuyerROICalculator /></P>} />

          {/* ── Unified Dashboard (Phase 2) ── */}
          <Route path="/unified" element={<ProtectedRoute><UnifiedLayout /></ProtectedRoute>}>
            <Route index element={<OverviewTab />} />
            <Route path="vip-crm" element={<VIPCrmTab />} />
            <Route path="priority" element={<PriorityTab />} />
            <Route path="analytics" element={<AnalyticsTab />} />
            <Route path="pipeline" element={<PipelineTab />} />
            <Route path="inventory" element={<InventoryTab />} />
            <Route path="cards" element={<CardsTab />} />
            <Route path="campaigns" element={<CampaignsTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Route>

          {/* ── 404 Catch-all ── */}
          <Route path="*" element={<P><NotFound /></P>} />

        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      theme={isDark ? 'dark' : 'light'}
      position="top-right"
      richColors
      toastOptions={{
        style: {
          fontFamily: "'Outfit', -apple-system, sans-serif",
          borderRadius: '12px',
        },
        duration: 4000,
      }}
    />
  );
}

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
      <RegionProvider>
      <AuthProvider>
        <Router>
          <a href="#main-content" className="a11y-skip">Skip to main content</a>
          <ScrollToTop />
          <RouteTracker />
          <NavbarWrapper />
          <BreadcrumbWrapper />
          <main id="main-content" role="main">
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
          </main>
          <WhatsAppButtonWrapper />
          <CookieConsentWrapper />
          <LiveChat />
          <PushNotification />
          <EmailCapture />
          <Onboarding />
        </Router>
        <ThemedToaster />
      </AuthProvider>
      </RegionProvider>
    </LanguageProvider>
    </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

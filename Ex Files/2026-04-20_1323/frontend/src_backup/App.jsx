import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider, useLanguage } from "./i18n";

/* ── Register all translation modules ── */
import "./i18n/pages/home";
import "./i18n/pages/login";
import "./i18n/pages/enterprise";
import "./i18n/pages/nfcCards";
import "./i18n/pages/contactSales";
import "./i18n/pages/developers";
import "./i18n/pages/realEstate";
import "./i18n/pages/createPhysicalCard";
import "./i18n/pages/orderCard";
import "./i18n/portals/vipPortal";
import "./i18n/portals/ahmedPortal";
import "./i18n/portals/marketplacePortal";
import "./i18n/portals/crmGateway";
import "./i18n/portals/dashboard";

/* ── Global CSS ── */
import './assets/css/blinq-app.shared.423b915ad.min.css';
import './assets/css/swiper-bundle.min.css';
import './assets/css/23401ee67f1164de.css';
import './assets/css/a70ed4de792d1886.css';
import './assets/css/b7f8d2bdc90730a0.css';
import './assets/css/c7df3fa510c5b153.css';
import './assets/css/d63b62cee6aaba1c.css';
import './assets/css/ordercard.css?ver=9';
import './index.css';

/* ── Components (always loaded) ── */
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import CookieConsent from "./components/CookieConsent/CookieConsent";

/* ── Lazy-loaded Pages ── */
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const NFCCards = lazy(() => import("./pages/NFCCards/NFCCards"));
const Enterprise = lazy(() => import("./pages/Enterprise/Enterprise"));
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
const CardRedirect = lazy(() => import("./pages/CardRedirect/CardRedirect"));
const TapAnalytics = lazy(() => import("./pages/TapAnalytics/TapAnalytics"));
const CardAdmin = lazy(() => import("./pages/CardAdmin/CardAdmin"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/tabs/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/Admin/tabs/AdminAnalytics"));
const AdminCards = lazy(() => import("./pages/Admin/tabs/AdminCards"));
const AdminCampaigns = lazy(() => import("./pages/Admin/tabs/AdminCampaigns"));
const AdminSettings = lazy(() => import("./pages/Admin/tabs/AdminSettings"));
const AdminVIPProfile = lazy(() => import("./pages/Admin/tabs/AdminVIPProfile"));
const AdminVIPCRM = lazy(() => import("./pages/Admin/tabs/AdminVIPCRM"));
const AdminPriorityVIP = lazy(() => import("./pages/Admin/tabs/AdminPriorityVIP"));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#0f1118'
  }}>
    <div style={{
      width: 32, height: 32,
      border: '3px solid rgba(255,255,255,0.08)',
      borderTopColor: '#e63946',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

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
  if (pathname === '/login' || pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <WhatsAppButton lang={lang} />;
}

function NavbarWrapper() {
  const { pathname } = useLocation();
  const hideNavbar =
    pathname === '/login' ||
    pathname.startsWith('/c/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/enterprise/crmdemo') ||
    pathname.startsWith('/automotive/demo') ||
    pathname === '/automotive/dashboard' ||
    pathname === '/card';
  if (hideNavbar) return null;
  return <Navbar />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <RouteTracker />
          <NavbarWrapper />
          <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ── Smart URL Redirect ── */}
            <Route path="/c/:cardId" element={<CardRedirect />} />

            {/* ── Public Pages ── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/nfc-cards" element={<NFCCards />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/real-estate" element={<RealEstate />} />
            <Route path="/contact-sales" element={<ContactSales />} />
            <Route path="/sales/roi-calculator" element={<ROICalculator />} />
            <Route path="/order-card" element={<OrderCardPage />} />
            <Route path="/automotive" element={<Automotive />} />
            <Route path="/automotive/demo" element={<AutoGateway />} />
            <Route path="/automotive/demo/khalid" element={<AutomotivePortal />} />
            <Route path="/automotive/demo/sultan" element={<SultanPortal />} />
            <Route path="/automotive/demo/showroom" element={<PublicShowroom />} />
            <Route path="/automotive/demo/ai" element={<AutoAIDemo />} />
            <Route path="/automotive/dashboard" element={<AutoDashboard />} />
            <Route path="/card" element={<Card />} />
            <Route path="/enterprise/crmdemo/registered" element={<LoginPortal />} />

            {/* ── Authenticated Pages ── */}
            <Route path="/create-card" element={
              <ProtectedRoute><CreateCard /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><CardDashboard /></ProtectedRoute>
            } />
            <Route path="/edit-card" element={
              <ProtectedRoute><EditCard /></ProtectedRoute>
            } />
            <Route path="/create-physical-card" element={
              <ProtectedRoute><CreatePhysicalCard /></ProtectedRoute>
            } />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="vip-crm" element={<AdminVIPCRM />} />
              <Route path="priority" element={<AdminPriorityVIP />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="cards" element={<AdminCards />} />
              <Route path="cards/:cardId" element={<AdminVIPProfile />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ── CRM Demo System ── */}
            <Route path="/enterprise/crmdemo" element={<CRMGateway />} />
            <Route path="/enterprise/crmdemo/khalid" element={<VIPPortal />} />
            <Route path="/enterprise/crmdemo/ahmed" element={<AhmedPortal />} />
            <Route path="/enterprise/crmdemo/marketplace" element={<MarketplacePortal />} />
            <Route path="/enterprise/crmdemo/dashboard" element={<CRMDashboard />} />
            <Route path="/enterprise/crmdemo/ai-demo" element={<AIDemo />} />
            <Route path="/enterprise/crmdemo/roi-calculator" element={<BuyerROICalculator />} />

          </Routes>
          </Suspense>
          <WhatsAppButtonWrapper />
          <CookieConsent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

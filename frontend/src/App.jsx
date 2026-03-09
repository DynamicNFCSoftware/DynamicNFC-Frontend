import OrderCardPage from "./pages/OrderCardPage";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CreatePhysicalCardTest from "./pages/CreatePhysicalCardTest/CreatePhysicalCardTest";
import ContactSales from './pages/ContactSales/ContactSales';
import Developers from './pages/Developers/Developers';
import RealEstate from './pages/RealEstate/RealEstate';
import KhalidPortal from "./pages/KhalidPortal/KhalidPortal";
import AhmedPortal from "./pages/AhmedPortal/AhmedPortal";

import CRMDashboard from "./pages/Dashboard/Dashboard";
import CRMGateway from "./pages/CRMGateway/CRMGateway";
import AIDemo from "./pages/AIDemo/AIDemo";
import { getTheme } from "./config/developerThemes";
import VIPPortal from "./pages/VIPPortal/VIPPortal_Definitive";
import LoginPortal from "./pages/LoginPortal/LoginPortal";
import Card from './pages/Card/Card';


// Normal sayfalar
import './assets/css/blinq-app.shared.423b915ad.min.css'
import './assets/css/swiper-bundle.min.css'
import './assets/css/23401ee67f1164de.css'
import './assets/css/a70ed4de792d1886.css'
import './assets/css/b7f8d2bdc90730a0.css'
import './assets/css/c7df3fa510c5b153.css'
import './assets/css/d63b62cee6aaba1c.css'
import './assets/css/ordercard.css?ver=9'
import './index.css'

import Home from "./pages/Home/Home";
import CreateCard from "./pages/CreateCard/CreateCard";
//import MyAccount from "./pages/MyAccount/MyAccount";
import NFCCards from "./pages/NFCCards/NFCCards";
import Enterprise from "./pages/Enterprise/Enterprise";
import Login from "./pages/Login/Login";
import login from "./pages/Login/login";
import OrderCard from "./pages/OrderCard/OrderCard";
import Test from "./pages/test/test";
import CardDashboard from "./pages/CardDashboard/CardDashboard";
import EditCard from "./pages/EditCard/EditCard";
import CardDashboardTest from "./pages/CardDashboard/CardDashboardTest";
import CreatePhysicalCard from "./pages/CreatePhysicalCard/CreatePhysicalCard";
import MarketplacePortal from "./pages/MarketplacePortal/MarketplacePortal";





function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            //   <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          } />
          <Route path="/create-card" element={
            <ProtectedRoute>
              <CreateCard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CardDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboardtest" element={
           
              <CardDashboardTest />
           
          } />
          <Route path="/my-account" element={
            <ProtectedRoute>
              {/* <MyAccount /> */}
            </ProtectedRoute>
          } />
          <Route path="/nfc-cards" element={
            <NFCCards />
          } />
          <Route path="/enterprise" element={
            <Enterprise />
          } />
          <Route path="/edit-card" element={
            <ProtectedRoute>
              <EditCard />
            </ProtectedRoute>
          } />
          <Route path="/card" element={<Card />} />
          <Route path="/order-card" element={<OrderCardPage />} />
          <Route path="/create-physical-card" element={<CreatePhysicalCard />} />
          <Route path="/login" element={<login />} />
<Route path="/create-physical-card-test" element={<CreatePhysicalCardTest />} />
<Route path="/order-card-page" element={<OrderCardPage />} />
<Route path="/contact-sales" element={<ContactSales />} />
<Route path="/developers" element={<Developers />} />
<Route path="/real-estate" element={<RealEstate />} />
<Route path="/enterprise/crmdemo/khalid" element={<VIPPortal />} />
<Route path="/enterprise/crmdemo/ahmed" element={<AhmedPortal />} />
<Route path="/enterprise/crmdemo/marketplace" element={<MarketplacePortal />} />
<Route path="/enterprise/crmdemo/ai-demo" element={<AIDemo />} />
<Route path="/enterprise/crmdemo/dashboard" element={<CRMDashboard />} />
<Route path="/enterprise/crmdemo" element={<CRMGateway />} />
<Route path="/login-portal" element={<LoginPortal />} />
{/* <Route path="/marketplace" element={<MarketplacePortal />} /> */}



{/* ── VIP Portal — Developer-specific routes ── */}
<Route path="/vip-portal" element={<VIPPortal/>} />
{/* Themed routes — will re-enable after portal system is complete
<Route path="/vip-portal/binghatti" element={<VIPPortal />} />
<Route path="/vip-portal/ajdan" element={<VIPPortal />} />
<Route path="/vip-portal/qataridiar" element={<VIPPortal />} />
<Route path="/vip-portal/artar" element={<VIPPortal />} />
*/}
<Route path="/crm-demo" element={<CRMGateway />} />
<Route path="/card" element={<Card />} />




          {/* <Route path="/test" element={<Test />} />  */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
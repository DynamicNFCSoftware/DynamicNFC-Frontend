import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

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
import Card from "./pages/Card/Card";
import Login from "./pages/Login/Login";
import LoginTest from "./pages/Login/LoginTest";
import OrderCard from "./pages/OrderCard/OrderCard";
import Test from "./pages/test/test";
import CardDashboard from "./pages/CardDashboard/CardDashboard";
import CardDashboardTest from "./pages/CardDashboard/CardDashboardTest";
import CreatePhysicalCard from "./pages/CreatePhysicalCard/CreatePhysicalCard";

function App() {
  return (
    <AuthProvider>
      <Router>
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
           
              <CardDashboard />
           
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
          <Route path="/card" element={<Card />} />
          <Route path="/order-card" element={<OrderCard />} />
          <Route path="/create-physical-card" element={<CreatePhysicalCard />} />
          <Route path="/logintest" element={<LoginTest />} />
          {/* <Route path="/test" element={<Test />} />  */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
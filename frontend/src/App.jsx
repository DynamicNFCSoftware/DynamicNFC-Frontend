import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Normal sayfalar
import './assets/css/blinq-app.shared.423b915ad.min.css'
import './assets/css/swiper-bundle.min.css'
import './assets/css/23401ee67f1164de.css'
import './assets/css/a70ed4de792d1886.css'
import './assets/css/b7f8d2bdc90730a0.css'
import './assets/css/c7df3fa510c5b153.css'
import './assets/css/d63b62cee6aaba1c.css'

import Home from "./pages/Home/Home";
import CreateCard from "./pages/CreateCard/CreateCard";
import NFCCards from "./pages/NFCCards/NFCCards";
import Enterprise from "./pages/Enterprise/Enterprise";
import Card from "./pages/Card/Card";
import Test from "./pages/test/test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-card" element={<CreateCard />} /> 
        <Route path="/nfc-cards" element={<NFCCards />} /> 
        <Route path="/enterprise" element={<Enterprise />} /> 
        <Route path="/card" element={<Card />} /> 
        {/* <Route path="/test" element={<Test />} />  */}
      </Routes>
    </Router>
  );
}

export default App;
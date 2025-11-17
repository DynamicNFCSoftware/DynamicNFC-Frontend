import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateMyCard from './pages/CreateMyCard';
import DigitalCards from './pages/DigitalCards';
import NFCCards from './pages/NFCCards';
import OrderCard from './pages/OrderCard';
import NfcBusinessCard from './pages/NfcBusinessCard';
import ViewMyCard from './pages/ViewMyCard';

export default function App() {
	return (
		<div>
			<header className="site-header">
				<div className="container header-inner">
					<Link to="/" className="logo">dynamic.ca</Link>
								<nav>
									<Link to="/digital-cards" className="nav-link">Digital Cards</Link>
									<Link to="/nfc-business-card" className="nav-link">NFC Cards</Link>
									<Link to="/create-my-card" className="nav-link">Create My Card</Link>
								</nav>
				</div>
			</header>

			<main className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create-my-card" element={<CreateMyCard />} />
					<Route path="/create-my-card/:id" element={<CreateMyCard />} />
					<Route path="/view-my-card/:id" element={<ViewMyCard />} />
					<Route path="/nfc-business-card" element={<NfcBusinessCard />} />
					<Route path="/order-card" element={<OrderCard />} />
				</Routes>
			</main>

			<footer className="site-footer">
				<div className="container">Built with DynamicNFC</div>
			</footer>
		</div>
	);
}


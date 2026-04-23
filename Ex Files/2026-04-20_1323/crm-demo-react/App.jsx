// App.jsx
// Al Noor Residences CRM Demo — Main Router
// Routes: /khalid-portal, /ahmed-portal, /marketplace, /dashboard

import { useState, useEffect } from 'react';
import KhalidPortal from './pages/KhalidPortal/KhalidPortal';
import AhmedPortal from './pages/AhmedPortal/AhmedPortal';
import Marketplace from './pages/Marketplace/Marketplace';
import Dashboard from './pages/Dashboard/Dashboard';

// Simple hash-based router (no react-router dependency needed)
function getRoute() {
  const hash = window.location.hash.replace('#', '') || '';
  const path = window.location.pathname || '';
  // Support both hash and path routing
  const route = hash || path;
  if (route.includes('khalid')) return 'khalid';
  if (route.includes('ahmed')) return 'ahmed';
  if (route.includes('dashboard')) return 'dashboard';
  if (route.includes('marketplace')) return 'marketplace';
  return 'gateway'; // default: show gateway/selector
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleNav = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleNav);
    window.addEventListener('popstate', handleNav);
    return () => {
      window.removeEventListener('hashchange', handleNav);
      window.removeEventListener('popstate', handleNav);
    };
  }, []);

  // Intercept internal links and convert to hash navigation
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        window.location.hash = href;
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  switch (route) {
    case 'khalid': return <KhalidPortal />;
    case 'ahmed': return <AhmedPortal />;
    case 'marketplace': return <Marketplace />;
    case 'dashboard': return <Dashboard />;
    default: return <Gateway onNavigate={(r) => { window.location.hash = r; setRoute(getRoute()); }} />;
  }
}

// Gateway page — portal selector (matches CRM demo HTML design)
function Gateway({ onNavigate }) {
  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", background: '#1a1a1f', color: 'white',
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', textAlign: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          width: 80, height: 80, margin: '0 auto 1.5rem', borderRadius: 20,
          background: 'linear-gradient(135deg, #2d2d35, #1a1a1f)',
          border: '1px solid rgba(255,255,255,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
        }}>📡</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50,
          fontSize: '0.85rem', color: '#6ba3c7', marginBottom: '1.5rem'
        }}>
          <span style={{ width: 8, height: 8, background: '#e63946', borderRadius: '50%' }} />
          Dynamic NFC CRM Technology Demo
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 500, lineHeight: 1.15, marginBottom: '1rem',
          background: 'linear-gradient(135deg, white, #faf8f5, #6ba3c7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Personalized Buyer Experiences<br />Powered by NFC
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Experience how Dynamic NFC transforms real estate sales with intelligent, personalized buyer portals.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.25rem', maxWidth: 900, width: '100%'
      }}>
        {[
          { id: 'khalid', label: 'Khalid Al-Rashid', sub: 'VIP Investor Portal', badge: 'VIP Investor', color: '#b8860b', initials: 'KR' },
          { id: 'ahmed', label: 'Ahmed Al-Fahad', sub: 'VIP Family Portal', badge: 'Family Buyer', color: '#457b9d', initials: 'AF' },
          { id: 'marketplace', label: 'Global Marketplace', sub: 'Public browsing + lead capture', badge: 'Public Access', color: '#e63946', initials: '🌐' },
          { id: 'dashboard', label: 'Analytics Dashboard', sub: 'Behavioral intelligence & CRM', badge: 'Analytics', color: '#c1121f', initials: '📊' },
        ].map(p => (
          <button key={p.id} onClick={() => onNavigate(`/${p.id}-portal`)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '1.75rem 1.5rem', cursor: 'pointer', color: 'white',
              textAlign: 'start', transition: '0.3s', position: 'relative'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(69,123,157,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <div style={{
              display: 'inline-block', padding: '0.3rem 0.7rem', background: `${p.color}33`,
              borderRadius: 50, fontSize: '0.7rem', fontWeight: 500, color: p.color,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem'
            }}>{p.badge}</div>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', serif", fontSize: p.initials.length > 2 ? '1.3rem' : '1.1rem',
              fontWeight: 600, marginBottom: '0.75rem'
            }}>{p.initials}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', marginBottom: '0.3rem' }}>{p.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{p.sub}</div>
          </button>
        ))}
      </div>

      <p style={{ marginTop: '3rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
        Demo environment for <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer" style={{ color: '#457b9d', textDecoration: 'none' }}>Dynamic NFC</a> technology showcase
      </p>
    </div>
  );
}

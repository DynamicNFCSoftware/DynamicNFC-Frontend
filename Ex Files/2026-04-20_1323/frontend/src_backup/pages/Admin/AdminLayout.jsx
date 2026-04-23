import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { calculateEngagementScore } from '../../services/firestoreTracking';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isAdmin, adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try { return localStorage.getItem('ap_sidebar') !== 'collapsed'; } catch { return true; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hotCount, setHotCount] = useState(0);
  const [sector, setSector] = useState(() => {
    try { return localStorage.getItem('dnfc_sector') || 'all'; } catch { return 'all'; }
  });

  const handleSectorChange = (value) => {
    setSector(value);
    try { localStorage.setItem('dnfc_sector', value); } catch {};
  };

  const PORTALS = [
    { sector: 'real_estate', label: 'Real Estate', items: [
      { to: '/enterprise/crmdemo/khalid', icon: '\u{1F48E}', label: 'VIP Portal' },
      { to: '/enterprise/crmdemo/ahmed', icon: '\u{1F46A}', label: 'Family Portal' },
      { to: '/enterprise/crmdemo/marketplace', icon: '\u{1F3EC}', label: 'Marketplace' },
    ]},
    { sector: 'automotive', label: 'Automotive', items: [
      { to: '/automotive/demo/sultan', icon: '\u{1F3CE}\uFE0F', label: 'VIP Showroom' },
      { to: '/automotive/demo/showroom', icon: '\u{1F697}', label: 'Public Showroom' },
    ]},
  ];

  // Fetch hot lead count for badge
  useEffect(() => {
    const fetchHotCount = async () => {
      try {
        const [cardsSnap, behavSnap] = await Promise.all([
          getDocs(collection(db, 'smartcards')),
          getDocs(collection(db, 'behaviors')),
        ]);
        const cards = cardsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const behaviors = behavSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let hot = 0;
        cards.forEach(card => {
          const events = behaviors.filter(b => b.cardId === card.id);
          const result = calculateEngagementScore(events);
          if (result.score >= 80) hot++;
        });
        setHotCount(hot);
      } catch { /* silent */ }
    };
    fetchHotCount();
  }, []);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    try { localStorage.setItem('ap_sidebar', next ? 'open' : 'collapsed'); } catch {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarClass = `ap-sidebar${sidebarOpen ? '' : ' ap-collapsed'}${mobileOpen ? ' ap-open' : ''}`;
  const initials = user?.email?.substring(0, 2)?.toUpperCase() || '??';

  if (adminLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#0176d3', borderRadius: '50%', animation: 'ap-spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280' }}>Checking access...</p>
          <style>{`@keyframes ap-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, background: '#fff', padding: '3rem', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{'\u{1F512}'}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Access Denied</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>You don&apos;t have admin privileges. Contact your administrator to request access.</p>
          <a href="/" style={{ color: '#0176d3', textDecoration: 'none', fontWeight: 500 }}>{'\u2190'} Back to Website</a>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-layout">
      {mobileOpen && <div className="ap-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={sidebarClass}>
        <div className="ap-sidebar-header">
          <div className="ap-sidebar-logo">
            <Link to="/" className="ap-logo-link">
              <img src="/assets/images/logo.png" alt="DynamicNFC" className="ap-logo-img" />
            </Link>
          </div>
          <button onClick={toggleSidebar} className="ap-toggle">{sidebarOpen ? '\u25C0' : '\u25B6'}</button>
        </div>
        <nav className="ap-nav">
          {/* INTELLIGENCE group */}
          <div className="ap-nav-group">Intelligence</div>

          <NavLink to="/admin" end className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4CA}'}</span>
            <span className="ap-nav-label">Overview</span>
          </NavLink>

          <NavLink to="/admin/vip-crm" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F451}'}</span>
            <span className="ap-nav-label">VIP CRM</span>
            {hotCount > 0 && <span className="ap-nav-badge">{hotCount}</span>}
          </NavLink>

          <NavLink to="/admin/priority" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F3AF}'}</span>
            <span className="ap-nav-label">Priority VIP</span>
          </NavLink>

          <NavLink to="/admin/analytics" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4CB}'}</span>
            <span className="ap-nav-label">Activity Log</span>
          </NavLink>

          <NavLink to="/admin/cards" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4B3}'}</span>
            <span className="ap-nav-label">Card Management</span>
          </NavLink>

          <NavLink to="/admin/campaigns" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F680}'}</span>
            <span className="ap-nav-label">Campaigns</span>
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u2699\uFE0F'}</span>
            <span className="ap-nav-label">Settings</span>
          </NavLink>

          {/* PORTALS group — sector-aware */}
          <div className="ap-nav-group">
            Portals
            <select
              value={sector}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="ap-sector-select"
            >
              <option value="all">All</option>
              <option value="real_estate">RE</option>
              <option value="automotive">Auto</option>
            </select>
          </div>

          {PORTALS
            .filter(g => sector === 'all' || g.sector === sector)
            .map(g => (
              <div key={g.sector}>
                {sector === 'all' && <div className="ap-portal-subgroup">{g.label}</div>}
                {g.items.map(p => (
                  <a key={p.to} href={p.to} target="_blank" rel="noopener noreferrer" className="ap-portal-link" onClick={() => setMobileOpen(false)}>
                    <span className="ap-nav-icon">{p.icon}</span>
                    <span className="ap-nav-label">{p.label}</span>
                    <span className="ap-external-icon">{'\u2197'}</span>
                  </a>
                ))}
              </div>
            ))}
        </nav>
        <div className="ap-sidebar-footer">
          <Link to="/" className="ap-back-link" onClick={() => setMobileOpen(false)}>
            {'\u2190'} {sidebarOpen ? 'Back to Website' : ''}
          </Link>
        </div>
      </aside>
      <div className="ap-main">
        <header className="ap-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="ap-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>{'\u2630'}</button>
            <h1 className="ap-header-title">Admin Panel</h1>
          </div>
          <div className="ap-user-info">
            <div className="ap-user-avatar">{initials}</div>
            <span className="ap-user-name">{user?.email || ''}</span>
            <button onClick={handleLogout} className="ap-logout-btn">Logout</button>
          </div>
        </header>
        <main className="ap-content">
          <Outlet key={location.pathname} context={{ sector, setSector: handleSectorChange }} />
        </main>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useCollection } from '../../hooks/useFirestoreQuery';
import { calculateEngagementScore } from '../../services/firestoreTracking';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './AdminLayout.css';
import SEO from '../../components/SEO/SEO';
import { useTranslation } from '../../i18n';
import '../../i18n/pages/admin';

export default function AdminLayout() {
  const t = useTranslation('admin');
  const { user, logout } = useAuth();
  const { isAdmin, adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try { return localStorage.getItem('ap_sidebar') !== 'collapsed'; } catch { return true; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalStatus, setPortalStatus] = useState({
    vip: null,
    family: null,
    marketplace: null,
    autoVip: null,
    showroom: null,
  });
  const [sector, setSector] = useState(() => {
    try { return localStorage.getItem('dnfc_sector') || 'all'; } catch { return 'all'; }
  });

  const handleSectorChange = (value) => {
    setSector(value);
    try { localStorage.setItem('dnfc_sector', value); } catch {};
  };

  const PORTALS = [
    { sector: 'real_estate', label: t('navRealEstate'), items: [
      { to: '/enterprise/crmdemo/khalid', icon: '\u{1F48E}', label: t('navVipPortal'), key: 'vip' },
      { to: '/enterprise/crmdemo/ahmed', icon: '\u{1F46A}', label: t('navFamilyPortal'), key: 'family' },
      { to: '/enterprise/crmdemo/marketplace', icon: '\u{1F3EC}', label: t('navMarketplace'), key: 'marketplace' },
    ]},
    { sector: 'automotive', label: t('navAutomotive'), items: [
      { to: '/automotive/demo/sultan', icon: '\u{1F3CE}\uFE0F', label: t('navVipShowroom'), key: 'autoVip' },
      { to: '/automotive/demo/showroom', icon: '\u{1F697}', label: t('navPublicShowroom'), key: 'showroom' },
    ]},
  ];

  // Cached hot lead count
  const { data: cards = [] } = useCollection('smartcards', [], { staleTime: 3 * 60 * 1000 });
  const { data: behaviors = [] } = useCollection('behaviors', [], { staleTime: 3 * 60 * 1000 });
  const hotCount = useMemo(() => {
    let hot = 0;
    cards.forEach(card => {
      const events = behaviors.filter(b => b.cardId === card.id);
      const result = calculateEngagementScore(events);
      if (result.score >= 80) hot++;
    });
    return hot;
  }, [cards, behaviors]);

  useEffect(() => {
    const qRef = query(collection(db, 'behaviors'), orderBy('timestamp', 'desc'), limit(200));
    const unsub = onSnapshot(qRef, (snap) => {
      const rows = snap.docs.map((d) => d.data());
      const normalize = (v) => (v || '').toString().toLowerCase();
      const inferPortalFromCard = (card) => {
        const url = normalize(card?.redirectUrl);
        if (url.includes('/enterprise/crmdemo/khalid')) return 'vip';
        if (url.includes('/enterprise/crmdemo/ahmed')) return 'family';
        if (url.includes('/enterprise/crmdemo/marketplace')) return 'marketplace';
        if (url.includes('/automotive/demo/sultan')) return 'autoVip';
        if (url.includes('/automotive/demo/showroom')) return 'showroom';
        return null;
      };
      const cardPortalMap = new Map(cards.map((c) => [c.id, inferPortalFromCard(c)]));
      const toAgo = (ts) => {
        const date = ts?.toDate?.() || (ts ? new Date(ts) : null);
        if (!date) return t('noActivity');
        const s = Math.floor((Date.now() - date.getTime()) / 1000);
        if (s < 60) return t('justNow');
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
      };
      const label = (e) => {
        const evt = (e.event || '').replace(/_/g, ' ');
        const d = e.details || e.data || {};
        if (d.unitName) return `${evt} - ${d.unitName}`;
        if (d.unitId) return `${evt} - ${d.unitId}`;
        return evt || 'activity';
      };
      const inferPortalFromBehavior = (e) => {
        const byCard = cardPortalMap.get(e.cardId);
        if (byCard) return byCard;
        const portal = normalize(e.portalName);
        if (portal.includes('market')) return 'marketplace';
        if (portal.includes('showroom')) return e.visitorType === 'vip' ? 'autoVip' : 'showroom';
        if (portal.includes('family')) return 'family';
        if (portal.includes('vip') || portal.includes('khalid')) return 'vip';
        if (portal.includes('sultan') || portal.includes('auto')) return 'autoVip';
        if (e.visitorType === 'family') return 'family';
        if (e.visitorType === 'vip') return 'vip';
        if (e.visitorType === 'anonymous' || e.visitorType === 'registered') return 'marketplace';
        return null;
      };
      const latest = (key) => rows.find((e) => inferPortalFromBehavior(e) === key);
      const vip = latest('vip');
      const family = latest('family');
      const marketplace = latest('marketplace');
      const autoVip = latest('autoVip');
      const showroom = latest('showroom');
      setPortalStatus({
        vip: vip ? `${label(vip)} • ${toAgo(vip.timestamp)}` : t('noActivityYet'),
        family: family ? `${label(family)} • ${toAgo(family.timestamp)}` : t('noActivityYet'),
        marketplace: marketplace ? `${label(marketplace)} • ${toAgo(marketplace.timestamp)}` : t('noActivityYet'),
        autoVip: autoVip ? `${label(autoVip)} • ${toAgo(autoVip.timestamp)}` : t('noActivityYet'),
        showroom: showroom ? `${label(showroom)} • ${toAgo(showroom.timestamp)}` : t('noActivityYet'),
      });
    });
    return () => unsub();
  }, [cards, t]);

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
          <p style={{ color: '#6b7280' }}>{t('checkingAccess')}</p>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>{t('accessDenied')}</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>{t('accessDeniedDesc')}</p>
          <a href="/" style={{ color: '#0176d3', textDecoration: 'none', fontWeight: 500 }}>{'\u2190'} {t('backToWebsite')}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-layout">
      <SEO title={t('adminDashboardTitle')} description={t('adminDashboardDesc')} path="/admin" />
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
          <div className="ap-nav-group">{t('navIntelligence')}</div>

          <NavLink to="/admin" end className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4CA}'}</span>
            <span className="ap-nav-label">{t('navOverview')}</span>
          </NavLink>

          <NavLink to="/admin/vip-crm" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F451}'}</span>
            <span className="ap-nav-label">{t('navVipCrm')}</span>
            {hotCount > 0 && <span className="ap-nav-badge">{hotCount}</span>}
          </NavLink>

          <NavLink to="/admin/priority" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F3AF}'}</span>
            <span className="ap-nav-label">{t('navPriorityVip')}</span>
          </NavLink>

          <NavLink to="/admin/analytics" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4CB}'}</span>
            <span className="ap-nav-label">{t('navActivityLog')}</span>
          </NavLink>

          <NavLink to="/admin/cards" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F4B3}'}</span>
            <span className="ap-nav-label">{t('navCardManagement')}</span>
          </NavLink>

          <NavLink to="/admin/campaigns" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F680}'}</span>
            <span className="ap-nav-label">{t('navCampaigns')}</span>
          </NavLink>

          <NavLink to="/admin/team" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u{1F465}'}</span>
            <span className="ap-nav-label">{t('navTeam')}</span>
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) => `ap-nav-item${isActive ? ' ap-active' : ''}`} onClick={() => setMobileOpen(false)}>
            <span className="ap-nav-icon">{'\u2699\uFE0F'}</span>
            <span className="ap-nav-label">{t('navSettings')}</span>
          </NavLink>

          {/* PORTALS group — sector-aware */}
          <div className="ap-nav-group">
            {t('navPortals')}
            <select
              value={sector}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="ap-sector-select"
            >
              <option value="all">{t('navAll')}</option>
              <option value="real_estate">{t('navReShort')}</option>
              <option value="automotive">{t('navAutoShort')}</option>
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
                    <span className="ap-nav-label">
                      {p.label}
                      <span className="ap-portal-sub">{portalStatus[p.key] || t('noActivityYet')}</span>
                    </span>
                    <span className="ap-external-icon">{'\u2197'}</span>
                  </a>
                ))}
              </div>
            ))}
        </nav>
        <div className="ap-sidebar-footer">
          <Link to="/" className="ap-back-link" onClick={() => setMobileOpen(false)}>
            {'\u2190'} {sidebarOpen ? t('backToWebsite') : ''}
          </Link>
        </div>
      </aside>
      <div className="ap-main">
        <header className="ap-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="ap-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>{'\u2630'}</button>
            <h1 className="ap-header-title">{t('adminPanel')}</h1>
          </div>
          <div className="ap-user-info">
            <div className="ap-user-avatar">{initials}</div>
            <span className="ap-user-name">{user?.email || ''}</span>
            <button onClick={handleLogout} className="ap-logout-btn">{t('logout')}</button>
          </div>
        </header>
        <main className="ap-content">
          <Breadcrumb />
          <Outlet key={location.pathname} context={{ sector, setSector: handleSectorChange }} />
        </main>
      </div>
    </div>
  );
}

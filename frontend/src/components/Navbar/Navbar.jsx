import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useLanguage } from '../../i18n';
import { useRegion } from '../../hooks/useRegion';
import { LANG_REGION } from '../../config/regionConfig';
import IndustriesDropdown from '../IndustriesDropdown';
import './Navbar.css';

const TR = {
  en: {
    home: 'Home',
    nfcCards: 'NFC Cards',
    contactSales: 'Contact Sales',
    liveDemo: 'Live Demo',
    aiTap: 'AI Tap',
    login: 'Login',
    logout: 'Logout',
    myCard: 'My Card',
    dashboard: 'Dashboard',
    createCard: 'Create Card',
    language: 'Language',
  },
  ar: {
    home: 'الرئيسية',
    nfcCards: 'بطاقات NFC',
    contactSales: 'تواصل مع المبيعات',
    liveDemo: 'العرض المباشر',
    aiTap: 'AI Tap',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    myCard: 'بطاقتي',
    dashboard: 'لوحة التحكم',
    createCard: 'إنشاء بطاقة',
    language: 'اللغة',
  },
  it: {
    home: 'Home',
    nfcCards: 'Card NFC',
    contactSales: 'Contatta il commerciale',
    liveDemo: 'Demo live',
    aiTap: 'AI Tap',
    login: 'Accedi',
    logout: 'Esci',
    myCard: 'La mia card',
    dashboard: 'Dashboard',
    createCard: 'Crea card',
    language: 'Lingua',
  },
  fr: {
    home: 'Accueil',
    nfcCards: 'Cartes NFC',
    contactSales: 'Contacter les ventes',
    liveDemo: 'Démo en direct',
    aiTap: 'AI Tap',
    login: 'Connexion',
    logout: 'Déconnexion',
    myCard: 'Ma carte',
    dashboard: 'Tableau de bord',
    createCard: 'Créer une carte',
    language: 'Langue',
  },
  es: {
    home: 'Inicio',
    nfcCards: 'Tarjetas NFC',
    contactSales: 'Contactar a ventas',
    liveDemo: 'Demo en vivo',
    aiTap: 'AI Tap',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    myCard: 'Mi tarjeta',
    dashboard: 'Panel',
    createCard: 'Crear tarjeta',
    language: 'Idioma',
  },
};

const LANG_NAMES = { en: 'English', it: 'Italiano', fr: 'Français', es: 'Español' };

export default function Navbar() {
  const { lang, setLang, isAr } = useLanguage();
  const { switchRegion } = useRegion();
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const t = (k) => (TR[lang] || TR.en)[k] || TR.en[k] || k;
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="nav-bar" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <img src="/assets/images/logo.png" alt="DynamicNFC" className="nav-brand-img" />
        </Link>

        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link${isActive('/') ? ' active' : ''}`}
              onClick={closeMenu}
              title={t('home')}
            >
              {t('home')}
            </Link>
            <IndustriesDropdown lang={lang} triggerClassName="nav-link nav-dd-trigger" />
            <Link
              to="/nfc-cards"
              className={`nav-link${isActive('/nfc-cards') ? ' active' : ''}`}
              onClick={closeMenu}
              title={t('nfcCards')}
            >
              {t('nfcCards')}
            </Link>
            <Link
              to="/contact-sales"
              className={`nav-link${isActive('/contact-sales') ? ' active' : ''}`}
              onClick={closeMenu}
              title={t('contactSales')}
            >
              {t('contactSales')}
            </Link>
            <Link
              to="/enterprise/crmdemo"
              className="nav-demo-btn"
              onClick={closeMenu}
              title={t('liveDemo')}
            >
              {t('liveDemo')}
            </Link>
            <Link
              to="/enterprise/crmdemo/ai-demo"
              className="nav-ai-btn"
              onClick={closeMenu}
              title={t('aiTap')}
            >
              ✦ {t('aiTap')}
            </Link>

            {isAuthenticated() && (
              <Link
                to="/unified"
                className="nav-link"
                onClick={closeMenu}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginInlineEnd: '0.4rem', verticalAlign: 'middle' }}>
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                {t('dashboard')}
              </Link>
            )}
          </div>

          <div className="nav-right">
            <select
              className="nav-lang-select"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                if (LANG_REGION[e.target.value]) switchRegion(LANG_REGION[e.target.value]);
              }}
              aria-label={t('language')}
            >
              {Object.entries(LANG_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            {isAuthenticated() ? (
              <>
                <span className="nav-user-email">{user?.email || ''}</span>
                {isAdmin && (
                  <Link to="/admin" className="nav-admin-badge" onClick={closeMenu}>
                    ADMIN
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-auth-btn ghost">
                  {t('logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-auth-btn" onClick={closeMenu}>
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

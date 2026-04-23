import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useLanguage } from '../../i18n';
import IndustriesDropdown from '../IndustriesDropdown';
import './Navbar.css';

const TR = {
  en: {
    home: 'Home',
    nfcCards: 'NFC Cards',
    contactSales: 'Contact Sales',
    login: 'Login',
    logout: 'Logout',
    myCard: 'My Card',
    createCard: 'Create Card',
  },
  ar: {
    home: 'الرئيسية',
    nfcCards: 'بطاقات NFC',
    contactSales: 'تواصل مع المبيعات',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    myCard: 'بطاقتي',
    createCard: 'إنشاء بطاقة',
  },
};

export default function Navbar() {
  const { lang, setLang, isAr } = useLanguage();
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

        {/* Mobile: My Card shortcut (always visible when logged in) */}
        {isAuthenticated() && (
          <Link
            to="/dashboard"
            className="nav-mobile-card-btn"
            onClick={closeMenu}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            {t('myCard')}
          </Link>
        )}

        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link${isActive('/') ? ' active' : ''}`}
              onClick={closeMenu}
            >
              {t('home')}
            </Link>
            <IndustriesDropdown lang={lang} triggerClassName="nav-link nav-dd-trigger" />
            <Link
              to="/nfc-cards"
              className={`nav-link${isActive('/nfc-cards') ? ' active' : ''}`}
              onClick={closeMenu}
            >
              {t('nfcCards')}
            </Link>
            <Link
              to="/contact-sales"
              className={`nav-link${isActive('/contact-sales') ? ' active' : ''}`}
              onClick={closeMenu}
            >
              {t('contactSales')}
            </Link>

            {/* My Card link — inside mobile menu too */}
            {isAuthenticated() && (
              <Link
                to="/dashboard"
                className="nav-link nav-link-card"
                onClick={closeMenu}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                {t('myCard')}
              </Link>
            )}
          </div>

          <div className="nav-right">
            <div className="nav-lang">
              <button
                className={`nav-lang-btn${lang === 'en' ? ' active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`nav-lang-btn${lang === 'ar' ? ' active' : ''}`}
                onClick={() => setLang('ar')}
              >
                ع
              </button>
            </div>
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

import React from 'react';
import { Link } from 'react-router-dom';
import IndustriesDropdown from '../../../components/IndustriesDropdown';

export function NavBar({ lang, setLang, t }) {
  return (
    <nav className="oc-nav">
      <div className="oc-nav-inner">
        <Link to="/" className="oc-logo">
          <img src="/assets/images/logo.png" alt="DynamicNFC" style={{height:'52px',width:'auto'}} />
        </Link>
        <div className="oc-nav-links">
          <Link to="/">{t('home')}</Link>
          <IndustriesDropdown lang={lang} triggerClassName="oc-nav-dd-trigger" />
          <Link to="/nfc-cards">{t('nfcCards')}</Link>
          <Link to="/contact-sales">Contact Sales</Link>
        </div>
        <div className="oc-nav-right">
          <div className="oc-lang">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              className={lang === 'ar' ? 'active' : ''}
              onClick={() => setLang('ar')}
              aria-label="التبديل إلى العربية"
            >
              ع
            </button>
          </div>
          <a href="/login" className="oc-nav-btn">{t('login')}</a>
        </div>
      </div>
    </nav>
  );
}

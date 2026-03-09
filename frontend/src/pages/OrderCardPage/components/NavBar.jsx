import React from 'react';

export function NavBar({ lang, setLang, t }) {
  return (
    <nav className="oc-nav">
      <div className="oc-nav-inner">
        <a href="#" className="oc-logo">
          Dynamic<span>NFC</span>
        </a>
        <div className="oc-nav-links">
          <a href="#">{t('home')}</a>
          <a href="#">{t('enterprise')}</a>
          <a href="#">{t('nfcCards')}</a>
        </div>
        <div className="oc-nav-right">
          <div className="oc-lang">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={lang === 'ar' ? 'active' : ''}
              onClick={() => setLang('ar')}
            >
              ع
            </button>
          </div>
          <a href="#" className="oc-nav-btn">{t('login')}</a>
        </div>
      </div>
    </nav>
  );
}

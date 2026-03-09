import React, { useState, useCallback } from 'react';
import { CardFlip } from './components/CardFlip';
import { FeatureGrid } from './components/FeatureGrid';
import { StatsBar } from './components/StatsBar';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { TR } from './i18n';
import './styles/OrderCardPage.css';

// Import your card images — update paths to match your project
import CARD_FRONT from './assets/card-front.jpg';
import CARD_BACK from './assets/card-back.jpg';

function detectLang() {
  const n = navigator.language || navigator.userLanguage || 'en';
  return n.startsWith('ar') ? 'ar' : 'en';
}

export default function OrderCardPage() {
  const [lang, setLang] = useState(detectLang);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <NavBar lang={lang} setLang={setLang} t={t} />

      <section className="oc-hero">
        <div className="oc-hero-content">
          <div className="oc-hero-text">
            <span className="oc-overline">{t('overline')}</span>
            <h1 className="oc-title">
              {t('heroTitle').split('\n').map((l, i) => (
                <span key={i}>{l}<br /></span>
              ))}
            </h1>
            <p className="oc-subtitle">{t('heroSub')}</p>
            <div className="oc-cta-group">
              <a href="/create-physical-card" className="oc-btn-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                {t('ctaDesign')}
              </a>
              <a href="/create-physical-card" className="oc-btn-ghost">{t('ctaExplore')}</a>
            </div>
          </div>

          <CardFlip
            frontImage={CARD_FRONT}
            backImage={CARD_BACK}
            flipHint={t('flipHint')}
          />
        </div>
      </section>

      <StatsBar t={t} />
      <FeatureGrid t={t} />
      <Footer t={t} />
    </div>
  );
}

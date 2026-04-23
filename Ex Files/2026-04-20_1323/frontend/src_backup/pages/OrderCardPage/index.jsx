import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './components/Footer';
import { TR } from './i18n';
import './styles/OrderCardPage.css';

function detectLang() {
  const n = navigator.language || navigator.userLanguage || 'en';
  return n.startsWith('ar') ? 'ar' : 'en';
}

/* ── Icons ── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="m5 12 5 5L20 7" /></svg>
);
const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" opacity="0.3"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

export default function OrderCardPage() {
  const [lang, setLang] = useState(detectLang);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  const digitalFeats = ['digitalFeat1', 'digitalFeat2', 'digitalFeat3', 'digitalFeat4', 'digitalFeat5'];
  const physicalFeats = ['physicalFeat1', 'physicalFeat2', 'physicalFeat3', 'physicalFeat4', 'physicalFeat5'];

  const materials = [
    { key: 'PVC', icon: '◻', priceKey: 'pvcPrice', descKey: 'pvcDesc', colors: ['#f5f5f5', '#1a1a1f', '#c9a84c', '#b0b0b8', 'rgba(200,200,200,0.3)'] },
    { key: 'Metal', icon: '◆', priceKey: 'metalPrice', descKey: 'metalDesc', colors: ['#c9a84c', '#b0b0b8', '#2a2a2f', '#b76e79', '#d4a843'] },
    { key: 'Eco', icon: '◉', priceKey: 'ecoPrice', descKey: 'ecoDesc', colors: ['#c4a35a', '#6b4226'] },
  ];

  const compRows = [
    { label: 'compPrice', digital: 'compPriceDigital', physical: 'compPricePhysical' },
    { label: 'compNFC', digital: 'viaLink', physical: 'yes', physicalHighlight: true },
    { label: 'compQR', digital: 'viaLink', physical: 'onCard' },
    { label: 'compEditable', digital: 'yes', physical: 'no' },
    { label: 'compAnalytics', digital: 'yes', physical: 'yes' },
    { label: 'compHandout', digital: 'no', physical: 'yes', physicalHighlight: true },
    { label: 'compBranding', digital: 'yes', physical: 'yes' },
    { label: 'compMinOrder', digital: 'compMinDigital', physical: 'compMinPhysical' },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navbar is now global — rendered in App.jsx */}

      {/* ════════ HERO ════════ */}
      <section className="oc-hero">
        <div className="oc-selector-content">
          <span className="oc-overline">{t('overline')}</span>
          <h1 className="oc-title">
            {t('heroTitle').split('\n').map((l, i) => (
              <span key={i}>{l}<br /></span>
            ))}
          </h1>
          <p className="oc-subtitle">{t('heroSub')}</p>

          {/* ── Two Card Selector ── */}
          <div className="oc-type-grid">
            {/* Digital Card */}
            <div className="oc-type-card oc-type-digital">
              <div className="oc-type-icon-wrap digital">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="oc-type-title">{t('digitalTitle')}</h2>
              <div className="oc-type-price">
                <span className="oc-price-amount digital">{t('digitalPrice')}</span>
              </div>
              <p className="oc-type-desc">{t('digitalDesc')}</p>
              <ul className="oc-type-features">
                {digitalFeats.map((k) => (
                  <li key={k}><CheckIcon /><span>{t(k)}</span></li>
                ))}
              </ul>
              <Link to="/login" className="oc-type-cta digital">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                {t('digitalCta')}
              </Link>
              <span className="oc-type-note">{t('digitalNote')}</span>
            </div>

            {/* Physical Card */}
            <div className="oc-type-card oc-type-physical">
              <div className="oc-type-badge">NFC + QR</div>
              <div className="oc-type-icon-wrap physical">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 10h20" />
                  <path d="M6 16h4" />
                </svg>
              </div>
              <h2 className="oc-type-title">{t('physicalTitle')}</h2>
              <div className="oc-type-price">
                <span className="oc-price-amount physical">{t('physicalPrice')}</span>
                <span className="oc-price-unit">{t('physicalPriceUnit')}</span>
              </div>
              <p className="oc-type-desc">{t('physicalDesc')}</p>
              <ul className="oc-type-features">
                {physicalFeats.map((k) => (
                  <li key={k}><CheckIcon /><span>{t(k)}</span></li>
                ))}
              </ul>
              <Link to="/create-physical-card" className="oc-type-cta physical">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                {t('physicalCta')}
              </Link>
              <span className="oc-type-note">{t('physicalNote')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MATERIAL PRICING ════════ */}
      <section className="oc-pricing">
        <div className="oc-pricing-inner">
          <h2 className="oc-pricing-title">{t('pricingTitle')}</h2>
          <p className="oc-pricing-sub">{t('pricingSub')}</p>
          <div className="oc-mat-grid">
            {materials.map((mat) => (
              <div className={`oc-mat-card oc-mat-${mat.key.toLowerCase()}`} key={mat.key}>
                <div className="oc-mat-header">
                  <span className="oc-mat-name">{t(`mat${mat.key}`)}</span>
                  <div className="oc-mat-price-tag">
                    <span className="oc-mat-amount">{t(mat.priceKey)}</span>
                    <span className="oc-mat-unit">{t('perCard')}</span>
                  </div>
                </div>
                <p className="oc-mat-desc">{t(mat.descKey)}</p>
                <div className="oc-mat-swatches">
                  {mat.colors.map((c, i) => (
                    <span key={i} className="oc-mat-swatch" style={{ background: c, border: c === '#f5f5f5' || c.includes('rgba') ? '1px solid rgba(0,0,0,0.1)' : 'none' }} />
                  ))}
                </div>
                <span className="oc-mat-min">{t('minOrder')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ COMPARISON TABLE ════════ */}
      <section className="oc-comparison">
        <div className="oc-comparison-inner">
          <h2 className="oc-comp-title">{t('compTitle')}</h2>
          <div className="oc-comp-table">
            <div className="oc-comp-row oc-comp-header">
              <div className="oc-comp-cell label">{t('compFeature')}</div>
              <div className="oc-comp-cell">{t('compDigital')}</div>
              <div className="oc-comp-cell">{t('compPhysical')}</div>
            </div>
            {compRows.map((row, i) => (
              <div className="oc-comp-row" key={i}>
                <div className="oc-comp-cell label">{t(row.label)}</div>
                <div className="oc-comp-cell">
                  {t(row.digital) === t('yes') ? <span className="oc-comp-yes"><CheckIcon /></span> :
                   t(row.digital) === '—' ? <DashIcon /> :
                   <span>{t(row.digital)}</span>}
                </div>
                <div className={`oc-comp-cell${row.physicalHighlight ? ' highlight' : ''}`}>
                  {t(row.physical) === t('yes') ? <span className="oc-comp-yes"><CheckIcon /></span> :
                   t(row.physical) === '—' ? <DashIcon /> :
                   <span>{t(row.physical)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer t={t} />
    </div>
  );
}

import { useState } from 'react';
import './NFCWriteGuide.css';
import SEO from '../../components/SEO/SEO';
import { useLanguage } from '../../i18n';
import { NWG_TR as TR } from './nfcWriteGuideTranslations';

/* Step and FAQ text lives in nfcWriteGuideTranslations.js (steps[id - 1], faq). */
const STEPS = [
  {
    id: 1,
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z',
  },
  {
    id: 2,
    icon: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
  },
  {
    id: 3,
    icon: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
  },
  {
    id: 4,
    icon: 'M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z',
  },
  {
    id: 5,
    icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  },
];

export default function NFCWriteGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;
  const stepsText = t('steps');

  const step = STEPS.find(s => s.id === activeStep);

  return (
    <div className="nwg-page">
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/nfc-write-guide" />
      <div className="nwg-header">
        <h1 className="nwg-title">{t('title')}</h1>
        <p className="nwg-subtitle">{t('subtitle')}</p>
      </div>

      {/* Progress Bar */}
      <div className="nwg-progress">
        {STEPS.map(s => (
          <button
            key={s.id}
            className={`nwg-step-dot ${s.id === activeStep ? 'active' : ''} ${s.id < activeStep ? 'done' : ''}`}
            onClick={() => setActiveStep(s.id)}
          >
            <span className="nwg-dot-num">{s.id}</span>
            <span className="nwg-dot-label">{stepsText[s.id - 1].title}</span>
          </button>
        ))}
        <div className="nwg-progress-bar">
          <div className="nwg-progress-fill" style={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* Active Step Card */}
      {step && (
        <div className="nwg-card" key={step.id}>
          <div className="nwg-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d={step.icon} /></svg>
          </div>
          <h2 className="nwg-card-title">{t('stepLabel')(step.id, stepsText[step.id - 1].title)}</h2>
          <p className="nwg-card-desc">{stepsText[step.id - 1].desc}</p>
          <div className="nwg-tips">
            <span className="nwg-tips-label">{t('tips')}</span>
            {stepsText[step.id - 1].tips.map((tip, i) => (
              <div key={i} className="nwg-tip">{tip}</div>
            ))}
          </div>
          <div className="nwg-nav">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(p => p - 1)}
              className="nwg-btn nwg-btn-secondary"
            >
              {t('prev')}
            </button>
            <button
              disabled={activeStep === STEPS.length}
              onClick={() => setActiveStep(p => p + 1)}
              className="nwg-btn nwg-btn-primary"
            >
              {activeStep === STEPS.length ? t('done') : t('next')}
            </button>
          </div>
        </div>
      )}

      {/* Compatibility */}
      <div className="nwg-section">
        <h3 className="nwg-section-title">{t('compatTitle')}</h3>
        <div className="nwg-compat-grid">
          {[
            { name: 'NTAG213', bytes: '144' },
            { name: 'NTAG215', bytes: '504', recommended: true },
            { name: 'NTAG216', bytes: '888' },
          ].map((tag, i) => (
            <div key={tag.name} className={`nwg-compat-card ${tag.recommended ? 'recommended' : ''}`}>
              <div className="nwg-compat-name">{tag.name}</div>
              <div className="nwg-compat-bytes">{tag.bytes} {t('bytes')}</div>
              <div className="nwg-compat-note">{t('notes')[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="nwg-section">
        <h3 className="nwg-section-title">{t('faqTitle')}</h3>
        <div className="nwg-faq-list">
          {t('faq').map((f, i) => (
            <div key={i} className={`nwg-faq ${openFaq === i ? 'open' : ''}`}>
              <button className="nwg-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="nwg-faq-arrow">{openFaq === i ? '\u2212' : '+'}</span>
              </button>
              {openFaq === i && <div className="nwg-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';
import { PRICING_TR as TR } from './pricingTranslations';
import './Pricing.css';

/* Plan names and CTA targets live here; plan text lives in pricingTranslations.js. */
const PLANS = [
  { id: 'pro', name: 'Pro', ctaPath: '/contact-sales', highlight: false },
  { id: 'enterprise', name: 'Enterprise', ctaPath: '/contact-sales', highlight: true },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;
  const plansText = t('plans');

  return (
    <div className="pr-page">
      <SEO
        title={t('seoTitle')}
        description={t('seoDesc')}
      />

      <section className="pr-hero">
        <h1 className="pr-title">{t('title')}</h1>
        <p className="pr-subtitle">{t('subtitle')}</p>
      </section>

      <section className="pr-plans">
        {PLANS.map(plan => (
          <div key={plan.id} className={`pr-card${plan.highlight ? ' pr-highlight' : ''}`}>
            {plansText[plan.id].badge && <div className="pr-badge">{plansText[plan.id].badge}</div>}
            <h2 className="pr-plan-name">{plan.name}</h2>
            <div className="pr-price">
              <span className="pr-price-custom">{t('custom')}</span>
            </div>
            <p className="pr-plan-desc">{plansText[plan.id].desc}</p>
            <ul className="pr-features">
              {plansText[plan.id].features.map((f, i) => (
                <li key={i}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <button className={`pr-cta${plan.highlight ? ' pr-cta-primary' : ''}`} onClick={() => navigate(plan.ctaPath)}>
              {plansText[plan.id].cta}
            </button>
          </div>
        ))}
      </section>

      <section className="pr-faq-section">
        <h2>{t('faqTitle')}</h2>
        <div className="pr-faq-grid">
          <div className="pr-faq-item">
            <h3>{t('faq1q')}</h3>
            <p>{t('faq1a')}</p>
          </div>
          <div className="pr-faq-item">
            <h3>{t('faq2q')}</h3>
            <p>{t('faq2a')}</p>
          </div>
          <div className="pr-faq-item">
            <h3>{t('faq3q')}</h3>
            <p>{t('faq3a')}</p>
          </div>
          <div className="pr-faq-item">
            <h3>{t('faq4q')}</h3>
            <p>{t('faq4a')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

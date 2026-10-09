import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';
import { PRICING_TR as TR } from './pricingTranslations';
import './Pricing.css';

/* Plan text (desc, features, cta, badge) lives in pricingTranslations.js under plans[id]. */
const PLANS = [
  { id: 'starter', name: 'Starter', price: { monthly: 0, annual: 0 }, ctaPath: '/login', highlight: false },
  { id: 'pro', name: 'Pro', price: { monthly: 19, annual: 15 }, ctaPath: '/login', highlight: true },
  { id: 'enterprise', name: 'Enterprise', price: { monthly: null, annual: null }, ctaPath: '/contact-sales', highlight: false },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [annual, setAnnual] = useState(true);
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

        <div className="pr-toggle">
          <span className={!annual ? 'active' : ''}>{t('monthly')}</span>
          <button className="pr-toggle-btn" onClick={() => setAnnual(!annual)}>
            <div className={`pr-toggle-dot${annual ? ' right' : ''}`} />
          </button>
          <span className={annual ? 'active' : ''}>{t('annual')} <em>{t('save')}</em></span>
        </div>
      </section>

      <section className="pr-plans">
        {PLANS.map(plan => (
          <div key={plan.id} className={`pr-card${plan.highlight ? ' pr-highlight' : ''}`}>
            {plansText[plan.id].badge && <div className="pr-badge">{plansText[plan.id].badge}</div>}
            <h2 className="pr-plan-name">{plan.name}</h2>
            <div className="pr-price">
              {plan.price.monthly === null ? (
                <span className="pr-price-custom">{t('custom')}</span>
              ) : plan.price.monthly === 0 ? (
                <><span className="pr-price-amount">$0</span><span className="pr-price-period">{t('forever')}</span></>
              ) : (
                <><span className="pr-price-amount">${annual ? plan.price.annual : plan.price.monthly}</span><span className="pr-price-period">{t('perMonth')}</span></>
              )}
            </div>
            <p className="pr-plan-desc">{plansText[plan.id].desc}</p>
            <ul className="pr-features">
              {plansText[plan.id].features.map((f, i) => (
                <li key={i}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
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

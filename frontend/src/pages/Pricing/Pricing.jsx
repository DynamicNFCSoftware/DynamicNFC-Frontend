import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';
import './Pricing.css';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    desc: 'Perfect for individuals getting started with digital business cards.',
    features: [
      '1 Digital Business Card',
      'Basic Contact Sharing',
      'QR Code Download (PNG)',
      'Mobile-Optimized Card Page',
      'Email Support',
    ],
    cta: 'Get Started Free',
    ctaPath: '/login',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 19, annual: 15 },
    desc: 'For professionals who want to stand out and track engagement.',
    features: [
      'Up to 5 Digital Cards',
      'Custom Templates & Themes',
      'QR Code (PNG, SVG, PDF)',
      'Tap Analytics Dashboard',
      'Social Media Links',
      'Live Preview Editor',
      'CSV & PDF Report Export',
      'Priority Support',
    ],
    cta: 'Start Pro Trial',
    ctaPath: '/login',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    desc: 'For teams and organizations needing VIP intelligence & CRM integration.',
    features: [
      'Unlimited Digital Cards',
      'NFC Physical Cards',
      'Team Management & Roles',
      'VIP Portal & CRM Dashboard',
      'Behavioral Intelligence',
      'Scheduled Redirects',
      'A/B Testing (Remote Config)',
      'Custom Branding & White-label',
      'Dedicated Account Manager',
      'SLA & Onboarding Support',
    ],
    cta: 'Contact Sales',
    ctaPath: '/contact-sales',
    highlight: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [annual, setAnnual] = useState(true);

  return (
    <div className="pr-page">
      <SEO
        title="Pricing — DynamicNFC"
        description="Choose the right plan for your digital business card needs. Free, Pro, and Enterprise options available."
      />

      <section className="pr-hero">
        <h1 className="pr-title">Simple, Transparent Pricing</h1>
        <p className="pr-subtitle">Start free. Upgrade when you need more power.</p>

        <div className="pr-toggle">
          <span className={!annual ? 'active' : ''}>Monthly</span>
          <button className="pr-toggle-btn" onClick={() => setAnnual(!annual)}>
            <div className={`pr-toggle-dot${annual ? ' right' : ''}`} />
          </button>
          <span className={annual ? 'active' : ''}>Annual <em>Save 20%</em></span>
        </div>
      </section>

      <section className="pr-plans">
        {PLANS.map(plan => (
          <div key={plan.id} className={`pr-card${plan.highlight ? ' pr-highlight' : ''}`}>
            {plan.badge && <div className="pr-badge">{plan.badge}</div>}
            <h2 className="pr-plan-name">{plan.name}</h2>
            <div className="pr-price">
              {plan.price.monthly === null ? (
                <span className="pr-price-custom">Custom</span>
              ) : plan.price.monthly === 0 ? (
                <><span className="pr-price-amount">$0</span><span className="pr-price-period">/ forever</span></>
              ) : (
                <><span className="pr-price-amount">${annual ? plan.price.annual : plan.price.monthly}</span><span className="pr-price-period">/ month</span></>
              )}
            </div>
            <p className="pr-plan-desc">{plan.desc}</p>
            <ul className="pr-features">
              {plan.features.map((f, i) => (
                <li key={i}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <button className={`pr-cta${plan.highlight ? ' pr-cta-primary' : ''}`} onClick={() => navigate(plan.ctaPath)}>
              {plan.cta}
            </button>
          </div>
        ))}
      </section>

      <section className="pr-faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="pr-faq-grid">
          <div className="pr-faq-item">
            <h3>Can I switch plans later?</h3>
            <p>Yes, you can upgrade or downgrade anytime. Changes take effect on your next billing cycle.</p>
          </div>
          <div className="pr-faq-item">
            <h3>Is there a free trial for Pro?</h3>
            <p>Yes, Pro comes with a 14-day free trial. No credit card required.</p>
          </div>
          <div className="pr-faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, and wire transfer for Enterprise plans.</p>
          </div>
          <div className="pr-faq-item">
            <h3>Do I need NFC cards to use the platform?</h3>
            <p>No, digital cards work with QR codes and shareable links. NFC cards are optional for the physical experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

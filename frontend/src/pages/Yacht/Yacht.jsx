import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';
import { YACHT_TR_EXTRA } from './yachtTranslations';
import './Yacht.css';

/* Arabic is intentionally omitted. It is hidden from the public site. */
const TR = {
  en: {
    seoTitle: 'NFC VIP access keys for yacht brokerages',
    seoDesc: 'Know which client is serious before you arrange the sea trial — one tap tells your brokers who is interested, in which yacht, and when. Built in Vancouver, Canada.',

    heroBadge: 'Yacht Brokerage',
    heroTitle: 'Know who is serious before the sea trial.',
    heroSub: 'A VIP Access Key opens a private buyer experience for the owner or charter client you invited — and tells you which yacht they studied, how long, and when they came back.',
    heroCtaDemo: 'Launch the yacht demo',
    heroCtaWalk: 'Book a walkthrough',

    probLabel: 'The blind spot',
    probTitle: 'Listing portals send you strangers.',
    probBody: 'An enquiry from a listing portal gives you a name, an email, and nothing else. You cannot tell the client who is ready to move from the one collecting brochures — not until someone has spent a day on the water. Every sea trial arranged for the wrong person is a day your broker did not spend on the right one.',

    howLabel: 'How it works',
    howTitle: 'From Private Invitation to booked sea trial.',
    step1t: 'Select the client',
    step1d: 'Your brokers pick the owners and charter clients worth a personal invitation.',
    step2t: 'Send the Private Invitation',
    step2d: 'A Premium Box arrives with a VIP Access Key and a note from the broker who signed it.',
    step3t: 'One tap opens their experience',
    step3d: 'Their private buyer experience: the fleet you chose for them, specifications, cruising range, berth and charter availability.',
    step4t: 'You see the intent',
    step4d: 'Which yacht they opened, which deck plan they returned to, when they asked for pricing. Your broker calls knowing all of it.',

    seeLabel: 'What you see',
    seeTitle: 'What a tap tells you.',
    see1t: 'Named, not anonymous',
    see1d: 'Every tap belongs to a client you invited. No anonymous traffic to guess at.',
    see2t: 'Intent, not clicks',
    see2d: 'Time spent on a specification, repeat visits to one yacht, a brochure opened twice. The signals that separate a buyer from a browser.',
    see3t: 'Real-time, not weekly',
    see3d: 'The broker hears the moment a client re-opens a listing, not in Monday\'s report.',

    demoLabel: 'Live demo',
    demoTitle: 'See it from the client\'s side.',
    demoSub: 'Two doors into the same system.',
    demo1t: 'VIP Owner Portal',
    demo1d: 'What an invited owner sees after the tap.',
    demo2t: 'Fleet Showroom',
    demo2d: 'The browsable fleet, with every interaction recorded.',
    demoCta: 'Open the full demo',

    faqTitle: 'FAQ',
    faq1q: 'Is this replacing our CRM?',
    faq1a: 'No. DynamicNFC sits on top of your existing CRM and enhances it with behavioral intelligence from VIP portals.',
    faq2q: 'How do you handle privacy and consent?',
    faq2a: 'The physical NFC tap is the opt-in: consent is explicit, invitations are intentional, and access is controlled. The product is designed around PIPEDA principles. Demo data is stored in Canada (Montréal); in a live deployment, data will be stored in the region where it is used, under that region\'s laws.',
    faq3q: 'What does a pilot look like?',
    faq3a: '90 days from the first Premium Box. Includes the private buyer experiences, card production, and a full review of what the data showed.',
    faq4q: 'Do clients need an app?',
    faq4a: 'No. A tap or a QR scan opens the experience in the phone\'s browser — no downloads.',

    ctaTitle: 'See it work with your own fleet.',
    ctaSub: 'We\'ll walk your brokers through it using your listings. No pitch deck.',
    ctaPrimary: 'Book a walkthrough',
    ctaSecondary: 'Launch the yacht demo',
  },
};
Object.assign(TR, YACHT_TR_EXTRA);

function Icon({ children }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const STEP_ICONS = [
  <Icon key="client"><circle cx="12" cy="8" r="3" /><path d="M5 19c1.2-3 3.6-4.5 7-4.5s5.8 1.5 7 4.5" /></Icon>,
  <Icon key="invite"><path d="M4 8h16v11H4z" /><path d="M4 8l8 6 8-6" /></Icon>,
  <Icon key="tap"><rect x="8" y="3" width="8" height="14" rx="2" /><path d="M4 10c-1.2 1.2-1.2 2.8 0 4" /><path d="M20 10c1.2 1.2 1.2 2.8 0 4" /></Icon>,
  <Icon key="intent"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></Icon>,
];

function FAQItem({ question, answer, isOpen, onClick }) {
  const contentId = React.useId();
  return (
    <div className={`yc-faq-item${isOpen ? ' open' : ''}`}>
      <button type="button" className="yc-faq-q" onClick={onClick} aria-expanded={isOpen} aria-controls={contentId}>
        <span>{question}</span>
        <svg className="yc-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      <div className="yc-faq-a" id={contentId}>
        <div className="yc-faq-a-inner"><p>{answer}</p></div>
      </div>
    </div>
  );
}

export default function Yacht() {
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;
  const [openFaq, setOpenFaq] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mql) return;
    const apply = () => setPrefersReducedMotion(!!mql.matches);
    apply();
    const onChange = () => apply();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener?.(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener?.(onChange);
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.yc-reveal');
    if (prefersReducedMotion || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const forceRevealId = window.setTimeout(() => {
      els.forEach((el) => el.classList.add('visible'));
    }, 1200);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => {
      window.clearTimeout(forceRevealId);
      obs.disconnect();
    };
  }, [prefersReducedMotion]);

  const faqs = [
    { q: 'faq1q', a: 'faq1a' },
    { q: 'faq2q', a: 'faq2a' },
    { q: 'faq3q', a: 'faq3a' },
    { q: 'faq4q', a: 'faq4a' },
  ];

  const Hero = () => (
    <section className="yc-hero yc-reveal">
      <div className="yc-hero-inner">
        <p className="yc-badge">{t('heroBadge')}</p>
        <h1>{t('heroTitle')}</h1>
        <p className="yc-hero-sub">{t('heroSub')}</p>
        <div className="yc-actions">
          <Link className="yc-btn yc-btn-primary" to="/yacht/demo">{t('heroCtaDemo')}</Link>
          <Link className="yc-btn yc-btn-secondary" to="/contact-sales">{t('heroCtaWalk')}</Link>
        </div>
      </div>
    </section>
  );

  const BlindSpot = () => (
    <section className="yc-section yc-reveal">
      <div className="yc-section-inner">
        <p className="yc-label">{t('probLabel')}</p>
        <h2>{t('probTitle')}</h2>
        <p className="yc-body">{t('probBody')}</p>
      </div>
    </section>
  );

  const HowItWorks = () => (
    <section className="yc-section yc-section-alt yc-reveal">
      <div className="yc-section-inner">
        <p className="yc-label">{t('howLabel')}</p>
        <h2>{t('howTitle')}</h2>
        <div className="yc-steps">
          {[1, 2, 3, 4].map((n) => (
            <article className="yc-step" key={n}>
              <div className="yc-step-top">
                <span className="yc-step-icon">{STEP_ICONS[n - 1]}</span>
                <span className="yc-step-num">{n}</span>
              </div>
              <h3>{t(`step${n}t`)}</h3>
              <p>{t(`step${n}d`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const WhatYouSee = () => (
    <section className="yc-section yc-reveal">
      <div className="yc-section-inner">
        <p className="yc-label">{t('seeLabel')}</p>
        <h2>{t('seeTitle')}</h2>
        <div className="yc-see-grid">
          {[1, 2, 3].map((n) => (
            <article className="yc-card" key={n}>
              <h3>{t(`see${n}t`)}</h3>
              <p>{t(`see${n}d`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const LiveDemo = () => (
    <section className="yc-section yc-section-alt yc-demo yc-reveal">
      <div className="yc-section-inner">
        <p className="yc-label">{t('demoLabel')}</p>
        <h2>{t('demoTitle')}</h2>
        <p className="yc-lead">{t('demoSub')}</p>
        <div className="yc-demo-grid">
          <Link className="yc-card" to="/yacht/demo/vip">
            <h3>{t('demo1t')}</h3>
            <p>{t('demo1d')}</p>
          </Link>
          <Link className="yc-card" to="/yacht/demo/showroom">
            <h3>{t('demo2t')}</h3>
            <p>{t('demo2d')}</p>
          </Link>
        </div>
        <div className="yc-actions">
          <Link className="yc-btn yc-btn-primary" to="/yacht/demo">{t('demoCta')}</Link>
        </div>
      </div>
    </section>
  );

  const Faq = () => (
    <section className="yc-section yc-reveal">
      <div className="yc-section-inner">
        <h2>{t('faqTitle')}</h2>
        <div className="yc-faq">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              question={t(item.q)}
              answer={t(item.a)}
              isOpen={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );

  const Closing = () => (
    <section className="yc-cta yc-reveal">
      <h2>{t('ctaTitle')}</h2>
      <p className="yc-lead">{t('ctaSub')}</p>
      <div className="yc-actions">
        <Link className="yc-btn yc-btn-primary" to="/contact-sales">{t('ctaPrimary')}</Link>
        <Link className="yc-btn yc-btn-secondary" to="/yacht/demo">{t('ctaSecondary')}</Link>
      </div>
    </section>
  );

  return (
    <div className="yc-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/yacht" />
      {Hero()}
      {BlindSpot()}
      {HowItWorks()}
      {WhatYouSee()}
      {LiveDemo()}
      {Faq()}
      {Closing()}
    </div>
  );
}

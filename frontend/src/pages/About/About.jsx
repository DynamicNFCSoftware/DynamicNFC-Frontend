import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';
import AboutMap from './AboutMap';
import { ABOUT_TR_EXTRA } from './aboutTranslations';
import './About.css';

/* About page, modelled on dynamiccrm.ca/about (2026-10-27).
   Arabic is intentionally omitted: it is hidden from the public site. it/fr/es live in aboutTranslations.js. */
const TR = {
  en: {
    seoTitle: 'About DynamicNFC: NFC Software Systems Inc., Toronto, Canada',
    seoDesc: 'DynamicNFC is made by NFC Software Systems Inc., an Ontario company in Toronto, Canada. Meet the founder, the team and the group behind the VIP Access Key.',

    heroBadge: 'Who we are',
    heroTitle: 'Built in Canada for the people who sell luxury.',
    heroSub: 'DynamicNFC turns a physical tap into a named, private buyer experience. Developers, dealerships and yacht brokerages see who is interested, in what, and when, before the first call.',
    fact1v: 'Toronto',
    fact1l: 'NFC Software Systems Inc., Ontario, Canada',
    fact2v: 'Keiretsu Forum',
    fact2l: 'Angel investor in DynamicNFC',
    fact3v: '3 sectors',
    fact3l: 'Real estate, automotive and yacht',
    fact4v: '5 markets',
    fact4l: 'Canada, Italy, USA, Mexico and the Gulf',
    photoAlt: 'Oguzhan Alparslan, founder of DynamicNFC, at an exhibitor table with NFC cards',
    founderTitle: 'Founder',
    founderBody: 'Oguzhan (Ozzy) Alparslan founded DynamicNFC and leads product and customer work. He was named a Leader of the Year finalist at the VIATEC Awards in 2025 and 2026.',

    howTitle: 'How we work',
    how1t: 'Identity before action.',
    how1d: 'Every tap belongs to someone you invited. We know who before we measure what.',
    how2t: 'The tap is the opt-in.',
    how2d: 'Consent is physical and explicit. Trust is in place before any data is recorded.',
    how3t: 'Measured in booked viewings.',
    how3d: 'We judge success by decision speed and booked viewings, not by clicks or impressions.',

    teamTitle: 'Team',
    linkedinLabel: 'LinkedIn profile',
    roleCeo: 'Founder and CEO',
    roleCoo: 'Chief Operating Officer (COO)',
    roleCmo: 'Chief Marketing Officer (CMO)',
    roleCto: 'Chief Technology Officer (CTO)',
    roleSalesManager: 'Sales Manager',
    roleMarketingManager: 'Marketing Manager',
    roleCloudArchitect: 'Cloud Architect',
    roleSeniorEngineer: 'Senior Software Engineer',
    roleSeniorDeveloper: 'Senior Software Developer',
    roleSeniorWeb: 'Senior Web Developer',
    roleDeveloper: 'Software Developer',
    roleSales: 'Sales Specialist',

    groupTitle: 'Our group',
    groupSub: 'DynamicNFC belongs to a group of four software companies in Canada, Italy and Türkiye.',
    mapLabel: 'Map with four marks: Toronto and North Vancouver in Canada, Lomazzo in Italy, and Bursa in Türkiye.',
    placeToronto: 'Toronto, Canada',
    placeVancouver: 'North Vancouver, Canada',
    placeLomazzo: 'Lomazzo, Italy',
    placeBursa: 'Bursa, Türkiye',
    nfcCountry: 'Ontario, Canada',
    nfcAddress: 'Toronto, ON M4R, Canada',
    nfcNote: 'Ontario Corporation Number 1001581685. Makes DynamicNFC. Keiretsu Forum Canada is an angel investor in DynamicNFC.',
    crmCountry: 'British Columbia, Canada',
    crmAddress: 'North Vancouver, BC V7R, Canada',
    crmNote: 'CRM and ERP for small and medium-sized businesses.',
    medCountry: 'Italy',
    medAddress: 'ComoNExT, Lomazzo (CO), Italy',
    medNote: 'Develops DynamicMED, an NFC emergency health identity.',
    asmCountry: 'Türkiye',
    asmAddress: 'Nilüfer, Bursa, Türkiye',
    asmNote: 'At Ulutek Technology Park since 2010.',

    ctaTitle: 'Talk to us',
    ctaBody: 'Book a walkthrough, or open the live demo and see a VIP Access Key from the buyer\'s side.',
    ctaBook: 'Book a walkthrough',
    ctaDemo: 'Open the live demo',
  },
};
Object.assign(TR, ABOUT_TR_EXTRA);

// Ordered by title, executives first (Oguzhan, 2026-10-27; Haytham, Yeşim, Murat K. and Uğur added the same day). Photos: public/images/about/team/<photo>.jpg, black and white, 240 x 240.
const TEAM = [
  { name: 'Oguzhan (Ozzy) Alparslan', role: 'roleCeo', photo: 'oguzhan-alparslan', linkedin: 'https://www.linkedin.com/in/ozzyalparslan/' },
  { name: 'Haytham Al-Khaldi', role: 'roleCoo', photo: 'haytham-al-khaldi', linkedin: 'https://www.linkedin.com/in/haytham-al-khaldi-81a60334/' },
  { name: 'Yeşim Öztekin', role: 'roleCmo', photo: 'yesim-oztekin', linkedin: 'https://www.linkedin.com/in/yesim-oztekin/' },
  { name: 'Murat Kandiharoğlu', role: 'roleCto', photo: 'murat-kandiharoglu', linkedin: 'https://www.linkedin.com/in/murat-kandiharo%C4%9Flu-1a3804103/' }, // LinkedIn address holds "ğ", percent-encoded
  { name: 'Gürcan Güran', role: 'roleMarketingManager', photo: 'gurcan-guran', linkedin: 'https://www.linkedin.com/in/gurcan-guran/' },
  { name: 'Uğur Fırat', role: 'roleSalesManager', photo: 'ugur-firat', linkedin: 'https://www.linkedin.com/in/ugur-firat-79a66238/' },
  { name: 'Alper Belge', role: 'roleCloudArchitect', photo: 'alper-belge', linkedin: 'https://www.linkedin.com/in/alper-belge/' },
  { name: 'Gülseren Fedakar', role: 'roleSeniorEngineer', photo: 'gulseren-fedakar', linkedin: 'https://www.linkedin.com/in/gulseren-fedakar-gonul/' },
  { name: 'Doğa Dara', role: 'roleSeniorDeveloper', photo: 'doga-dara', linkedin: 'https://www.linkedin.com/in/dogadara/' },
  { name: 'Murat Ezdi', role: 'roleSeniorWeb', photo: 'murat-ezdi', linkedin: 'https://www.linkedin.com/in/muratezdi/' },
  { name: 'Mustafa Ercan Şensoy', role: 'roleDeveloper', photo: 'mustafa-ercan-sensoy', linkedin: 'https://www.linkedin.com/in/mustafa-ercan-%C5%9Fensoy-734b15109/' },
  { name: 'Murat Yılmaz', role: 'roleDeveloper', photo: 'murat-yilmaz', linkedin: 'https://www.linkedin.com/in/benmuratyilmaz/' },
  { name: 'Ege Can Alparslan', role: 'roleSales', photo: 'ege-can-alparslan', linkedin: 'https://www.linkedin.com/in/egecanalparslan/' },
];

// DynamicNFC first and featured (Oguzhan, 2026-10-27); the sister companies follow, west to east.
const GROUP = [
  { id: 'nfc', place: 'placeToronto', lat: 43.65, lon: -79.38, name: 'NFC Software Systems Inc.', logo: 'dynamicnfc', w: 477, h: 160, featured: true },
  { id: 'crm', place: 'placeVancouver', lat: 49.32, lon: -123.07, name: 'DynamicCRM Software Inc.', logo: 'dynamiccrm', w: 843, h: 301, web: 'dynamiccrm.ca' },
  { id: 'med', place: 'placeLomazzo', lat: 45.7, lon: 9.03, name: 'Dynamic Software Solutions Srl', logo: 'dynamicmed', w: 342, h: 120, web: 'dynamicmedicals.com' },
  { id: 'asm', place: 'placeBursa', lat: 40.18, lon: 29.07, name: 'DynamicASM Software Ltd.', logo: 'dynamicasm', w: 483, h: 167 },
];

// LinkedIn's own mark in its own colour.
const LinkedInMark = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function About() {
  const { lang } = useLanguage();
  const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;
  const founder = TEAM[0];

  const groupCard = (c) => (
    <article key={c.id} className={c.featured ? 'ab-co is-featured' : 'ab-co'}>
      <img className="ab-co-logo" src={`/images/about/group/${c.logo}.png`} alt={c.name} width={c.w} height={c.h} loading="lazy" decoding="async" />
      <div className="ab-co-text">
        <p className="ab-eyebrow">{t(`${c.id}Country`)}</p>
        <h3>{c.name}</h3>
        <p>{t(`${c.id}Address`)}</p>
        {c.web && <a className="ab-co-web" href={`https://${c.web}`} target="_blank" rel="noopener noreferrer" dir="ltr">{c.web}</a>}
        <p className="ab-co-note">{t(`${c.id}Note`)}</p>
      </div>
    </article>
  );

  return (
    <div className="ab-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/about" />

      <section className="ab-hero ab-wrap">
        <div className="ab-hero-text">
          <span className="ab-badge">{t('heroBadge')}</span>
          <h1>{t('heroTitle')}</h1>
          <p className="ab-lede">{t('heroSub')}</p>
          <ul className="ab-facts">
            {[1, 2, 3, 4].map((n) => (
              <li key={n}>
                <b>{t(`fact${n}v`)}</b>
                <span>{t(`fact${n}l`)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ab-hero-side">
          <img
            className="ab-photo"
            src="/images/about/canada-exhibitor.jpg"
            srcSet="/images/about/canada-exhibitor-640.jpg 640w, /images/about/canada-exhibitor.jpg 1200w"
            sizes="(max-width: 960px) 100vw, 50vw"
            width="1200" height="800" alt={t('photoAlt')}
          />
          <h2 className="ab-founder-title">{t('founderTitle')}</h2>
          <p className="ab-founder-name">{founder.name}</p>
          <p className="ab-muted">{t(founder.role)}</p>
          <p>{t('founderBody')}</p>
        </div>
      </section>

      <section className="ab-section ab-wrap">
        <h2>{t('howTitle')}</h2>
        <ul className="ab-how">
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <h3>{t(`how${n}t`)}</h3>
              <p className="ab-muted">{t(`how${n}d`)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ab-band">
        <div className="ab-section ab-wrap">
          <h2>{t('teamTitle')}</h2>
          <ul className="ab-team">
            {TEAM.map((p, i) => (
              <li key={p.name} className={i === 0 ? 'ab-card is-founder' : 'ab-card'}>
                <img className="ab-face" src={`/images/about/team/${p.photo}.jpg`} alt="" width="240" height="240" loading="lazy" decoding="async" />
                <h3>
                  {p.name}
                  {p.linkedin && (
                    <a className="ab-in" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t('linkedinLabel')}: ${p.name}`}>
                      <LinkedInMark />
                    </a>
                  )}
                </h3>
                <p className="ab-muted">{t(p.role)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ab-section ab-wrap">
        <h2>{t('groupTitle')}</h2>
        <p className="ab-intro">{t('groupSub')}</p>
        <AboutMap label={t('mapLabel')} points={GROUP.map((c) => ({ ...c, place: t(c.place), company: c.name }))} />
        {groupCard(GROUP[0])}
        <div className="ab-sisters">{GROUP.slice(1).map(groupCard)}</div>
      </section>

      <section className="ab-cta">
        <div className="ab-wrap">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaBody')}</p>
          <div className="ab-cta-row">
            <Link className="ab-btn is-primary" to="/contact-sales">{t('ctaBook')}</Link>
            <Link className="ab-btn" to="/enterprise/crmdemo">{t('ctaDemo')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// WhatsAppButton.jsx
// Global floating WhatsApp button — context-aware messaging
// DUAL REGION: Canada + Gulf — auto-detects via timezone + language, user can override
// Drop into App.jsx ONCE, works everywhere

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './WhatsAppButton.css';
import { waT } from './whatsAppTranslations';

// ─── CONFIG ───────────────────────────────────────────
const REGIONS = {
  canada: {
    number: '16722008071',
    office: { en: 'Vancouver Office', it: 'Ufficio di Vancouver', fr: 'Bureau de Vancouver', es: 'Oficina de Vancouver', ar: 'مكتب فانكوفر' },
    flag: '🇨🇦',
    hours: { en: 'Mon–Fri 9AM–6PM PST', it: 'Lun–Ven 9:00–18:00 PST', fr: 'Lun–ven 9 h–18 h PST', es: 'Lun–Vie 9 a.m.–6 p.m. PST', ar: 'الإثنين–الجمعة ٩ص–٦م بتوقيت فانكوفر' },
  },
  gulf: {
    number: '966548888377',
    office: { en: 'Gulf Office', it: 'Ufficio del Golfo', fr: 'Bureau du Golfe', es: 'Oficina del Golfo', ar: 'مكتب الخليج' },
    flag: '🇸🇦',
    hours: { en: 'Sun–Thu 9AM–6PM GST', it: 'Dom–Gio 9:00–18:00 GST', fr: 'Dim–jeu 9 h–18 h GST', es: 'Dom–Jue 9 a.m.–6 p.m. GST', ar: 'الأحد–الخميس ٩ص–٦م بتوقيت الخليج' },
  },
};

const COMPANY_NAME = 'DynamicNFC';

// ─── AUTO-DETECT REGION ───────────────────────────────
function detectRegion(lang) {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const gulfTz = /Asia\/(Dubai|Riyadh|Kuwait|Bahrain|Qatar|Muscat|Aden|Baghdad)/i;
    const menaTz = /Asia\/(Beirut|Damascus|Amman|Jerusalem)|Africa\/(Cairo|Tripoli)/i;
    if (gulfTz.test(tz) || menaTz.test(tz)) return 'gulf';
    if (lang === 'ar') return 'gulf';
    return 'canada';
  } catch {
    return lang === 'ar' ? 'gulf' : 'canada';
  }
}

// ─── CONTEXT MAP ──────────────────────────────────────
function getMessageContext(pathname, lang) {
  const t = waT(lang);
  const ctx = (key, intent) => ({ message: t(`msg_${key}`), badge: t(`badge_${key}`), intent });

  if (pathname.includes('/crmdemo/khalid')) return ctx('khalid', 'vip');
  if (pathname.includes('/crmdemo/ahmed')) return ctx('ahmed', 'vip');
  if (pathname.includes('/crmdemo/marketplace')) return ctx('marketplace', 'lead');
  if (pathname.includes('/crmdemo')) return ctx('crmdemo', 'sales');
  if (pathname.includes('/enterprise')) return ctx('enterprise', 'sales');
  if (pathname.includes('/developers')) return ctx('developers', 'sales');
  if (pathname.includes('/real-estate')) return ctx('realestate', 'sales');
  if (pathname.includes('/nfc-cards') || pathname.includes('/create-physical-card')) return ctx('cards', 'order');
  if (pathname.includes('/contact-sales')) return ctx('contact', 'sales');

  return { message: t('msg_general'), badge: null, intent: 'general' };
}

// ─── COMPONENT ────────────────────────────────────────
export default function WhatsAppButton({ lang = 'en' }) {
  const location = useLocation();

  // Hide WhatsApp on dashboard, edit, card, create pages
  const hidePaths = ['/dashboard', '/edit-card', '/card', '/create-card'];
  const hidden = hidePaths.some(p => location.pathname.startsWith(p));
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [region, setRegion] = useState(() => detectRegion(lang));

  const isAr = lang === 'ar';
  const t = waT(lang);
  const ctx = getMessageContext(location.pathname, lang);
  const office = REGIONS[region];
  const otherRegion = region === 'canada' ? 'gulf' : 'canada';
  const otherOffice = REGIONS[otherRegion];

  // Re-detect when language changes
  useEffect(() => { setRegion(detectRegion(lang)); }, [lang]);

  // Auto-tooltip after 5s
  useEffect(() => {
    if (hasInteracted) return;
    const show = setTimeout(() => setShowTooltip(true), 20000);
    const hide = setTimeout(() => setShowTooltip(false), 28000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [location.pathname, hasInteracted]);

  if (hidden) return null;

  const waUrl = `https://wa.me/${office.number}?text=${encodeURIComponent(ctx.message)}`;

  const handleClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleExpand = () => {
    setHasInteracted(true);
    setIsExpanded(prev => !prev);
    setShowTooltip(false);
  };

  return (
    <div className={`wa-container ${isAr ? 'wa-rtl' : ''}`}>
      {/* Tooltip */}
      {showTooltip && !isExpanded && (
        <div className="wa-tooltip" onClick={handleClick}>
          <span>{office.flag} {t('tooltip')}</span>
          <button className="wa-tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); setHasInteracted(true); }} aria-label={t('close')}>×</button>
        </div>
      )}

      {/* Expanded panel */}
      {isExpanded && (
        <div className="wa-panel">
          <div className="wa-panel-header">
            <div className="wa-panel-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            </div>
            <div className="wa-panel-info">
              <span className="wa-panel-name">{COMPANY_NAME}</span>
              <span className="wa-panel-status">{office.flag} {office.office[lang] ?? office.office.en}</span>
            </div>
            <button className="wa-panel-close" onClick={handleExpand} aria-label={t('close')}>×</button>
          </div>

          <div className="wa-panel-body">
            <div className="wa-panel-bubble">
              <p className="wa-panel-greeting">{t('greeting')}</p>
            </div>
            {ctx.badge && <span className="wa-context-badge">{ctx.badge}</span>}
            <p className="wa-panel-preview">{t('prefilled')}</p>
            <div className="wa-panel-msg-preview">{ctx.message}</div>
          </div>

          {/* ─── REGION SWITCHER ─── */}
          <div className="wa-region-bar">
            <div className="wa-region-active">
              <span className="wa-region-flag">{office.flag}</span>
              <div className="wa-region-details">
                <span className="wa-region-name">{office.office[lang] ?? office.office.en}</span>
                <span className="wa-region-hours">{office.hours[lang] ?? office.hours.en}</span>
              </div>
            </div>
            <button className="wa-region-switch" onClick={() => setRegion(otherRegion)}>
              {otherOffice.flag} {otherOffice.office[lang] ?? otherOffice.office.en}
            </button>
          </div>

          <button className="wa-panel-send" onClick={handleClick}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            {t('open')}
          </button>
        </div>
      )}

      {/* FAB */}
      <button className={`wa-fab ${ctx.intent === 'vip' ? 'wa-fab-vip' : ''}`} onClick={handleExpand} aria-label="WhatsApp">
        {isExpanded ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
        )}
        {!isExpanded && <span className="wa-fab-pulse" />}
      </button>
    </div>
  );
}

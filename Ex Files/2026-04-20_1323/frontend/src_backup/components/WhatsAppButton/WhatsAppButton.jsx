// WhatsAppButton.jsx
// Global floating WhatsApp button — context-aware messaging
// DUAL REGION: Canada + Gulf — auto-detects via timezone + language, user can override
// Drop into App.jsx ONCE, works everywhere

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './WhatsAppButton.css';

// ─── CONFIG ───────────────────────────────────────────
const REGIONS = {
  canada: {
    number: '16722008071',       // ← Replace: Canada WhatsApp number
    office: 'Vancouver Office',
    officeAr: 'مكتب فانكوفر',
    flag: '🇨🇦',
    hours: 'Mon–Fri 9AM–6PM PST',
    hoursAr: 'الإثنين–الجمعة ٩ص–٦م بتوقيت فانكوفر',
  },
  gulf: {
    number: '966548888377',      // ← Replace: Gulf/UAE WhatsApp number
    office: 'Gulf Office',
    officeAr: 'مكتب الخليج',
    flag: '🇦🇪',
    hours: 'Sun–Thu 9AM–6PM GST',
    hoursAr: 'الأحد–الخميس ٩ص–٦م بتوقيت الخليج',
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
  const isAr = lang === 'ar';

  if (pathname.includes('/crmdemo/khalid')) {
    return { message: isAr ? 'مرحباً، أنا أتصفح بوابة خالد الراشد VIP — مهتم بمجموعة البنتهاوس في النور ريزيدنسز. أرغب في حجز معاينة خاصة.' : "Hi, I'm browsing the Khalid Al-Rashid VIP Portal — interested in the Penthouse Collection at Al Noor Residences. I'd like to schedule a private viewing.", badge: isAr ? 'VIP — خالد الراشد' : 'VIP — Khalid Portal', intent: 'vip' };
  }
  if (pathname.includes('/crmdemo/ahmed')) {
    return { message: isAr ? 'مرحباً، أنا أتصفح بوابة أحمد الفهد العائلية — مهتم بشقق 3 غرف نوم في النور ريزيدنسز. هل يمكنني حجز زيارة؟' : "Hi, I'm browsing the Ahmed Al-Fahad Family Portal — interested in 3BR family units at Al Noor Residences. Can I book a viewing?", badge: isAr ? 'عائلي — أحمد الفهد' : 'Family — Ahmed Portal', intent: 'vip' };
  }
  if (pathname.includes('/crmdemo/marketplace')) {
    return { message: isAr ? 'مرحباً، أتصفح سوق النور ريزيدنسز وأرغب في معرفة المزيد عن الوحدات المتاحة.' : "Hi, I'm browsing the Al Noor Residences Marketplace and would like to learn more about available units.", badge: isAr ? 'السوق' : 'Marketplace', intent: 'lead' };
  }
  if (pathname.includes('/crmdemo/dashboard')) {
    return { message: isAr ? 'مرحباً، أنا أراجع لوحة التحكم التحليلية لـ DynamicNFC — أريد مناقشة كيف يمكن لهذا النظام أن يعمل لمشروعي.' : "Hi, I'm reviewing the DynamicNFC Analytics Dashboard — I'd like to discuss how this system could work for my project.", badge: isAr ? 'لوحة التحكم' : 'Dashboard', intent: 'sales' };
  }
  if (pathname.includes('/crmdemo')) {
    return { message: isAr ? 'مرحباً، أنا أتصفح عرض CRM التجريبي لـ DynamicNFC — أريد معرفة المزيد عن منصة تسريع المبيعات.' : "Hi, I'm exploring the DynamicNFC CRM Demo — I'd like to learn more about the Sales Velocity Platform.", badge: isAr ? 'عرض تجريبي' : 'CRM Demo', intent: 'sales' };
  }
  if (pathname.includes('/enterprise')) {
    return { message: isAr ? 'مرحباً، أنا مهتم بمنصة DynamicNFC للمؤسسات — أرغب في مناقشة برنامج تجريبي لمشروعنا العقاري.' : "Hi, I'm interested in the DynamicNFC Enterprise platform — I'd like to discuss a pilot program for our real estate project.", badge: isAr ? 'المؤسسات' : 'Enterprise', intent: 'sales' };
  }
  if (pathname.includes('/developers')) {
    return { message: isAr ? 'مرحباً، أنا مطور عقاري مهتم بحلول DynamicNFC — هل يمكننا ترتيب مكالمة استكشافية؟' : "Hi, I'm a real estate developer interested in DynamicNFC solutions — can we arrange a discovery call?", badge: isAr ? 'المطورين' : 'Developers', intent: 'sales' };
  }
  if (pathname.includes('/real-estate')) {
    return { message: isAr ? 'مرحباً، أنا وكيل عقاري مهتم بحلول DynamicNFC — كيف يمكنني تسريع مبيعاتي؟' : "Hi, I'm a real estate agent interested in DynamicNFC — how can I accelerate my sales?", badge: isAr ? 'الوكلاء' : 'Real Estate', intent: 'sales' };
  }
  if (pathname.includes('/nfc-cards') || pathname.includes('/create-physical-card')) {
    return { message: isAr ? 'مرحباً، أريد الاستفسار عن طلب بطاقات NFC مخصصة لأعمالي.' : "Hi, I'd like to inquire about ordering custom NFC cards for my business.", badge: isAr ? 'بطاقات NFC' : 'NFC Cards', intent: 'order' };
  }
  if (pathname.includes('/contact-sales')) {
    return { message: isAr ? 'مرحباً، أريد التواصل مع فريق المبيعات في DynamicNFC.' : "Hi, I'd like to connect with the DynamicNFC sales team.", badge: isAr ? 'المبيعات' : 'Sales', intent: 'sales' };
  }

  return { message: isAr ? 'مرحباً، أنا مهتم بمنصة DynamicNFC لتسريع المبيعات — أرغب في معرفة المزيد.' : "Hi, I'm interested in the DynamicNFC Sales Velocity Platform — I'd like to learn more.", badge: null, intent: 'general' };
}

// ─── COMPONENT ────────────────────────────────────────
export default function WhatsAppButton({ lang = 'en' }) {
  const location = useLocation();

  // Hide WhatsApp on dashboard, edit, card, create pages
  const hidePaths = ['/dashboard', '/edit-card', '/card', '/create-card'];
  if (hidePaths.some(p => location.pathname.startsWith(p))) return null;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [region, setRegion] = useState(() => detectRegion(lang));

  const isAr = lang === 'ar';
  const ctx = getMessageContext(location.pathname, lang);
  const office = REGIONS[region];
  const otherRegion = region === 'canada' ? 'gulf' : 'canada';
  const otherOffice = REGIONS[otherRegion];

  // Re-detect when language changes
  useEffect(() => { setRegion(detectRegion(lang)); }, [lang]);

  // Auto-tooltip after 5s
  useEffect(() => {
    if (hasInteracted) return;
    const show = setTimeout(() => setShowTooltip(true), 5000);
    const hide = setTimeout(() => setShowTooltip(false), 10000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [location.pathname, hasInteracted]);

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
          <span>{office.flag} {isAr ? 'تحدث معنا عبر واتساب' : 'Chat with us on WhatsApp'}</span>
          <button className="wa-tooltip-close" onClick={(e) => { e.stopPropagation(); setShowTooltip(false); setHasInteracted(true); }} aria-label="Close">×</button>
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
              <span className="wa-panel-status">{office.flag} {isAr ? office.officeAr : office.office}</span>
            </div>
            <button className="wa-panel-close" onClick={handleExpand} aria-label="Close">×</button>
          </div>

          <div className="wa-panel-body">
            <div className="wa-panel-bubble">
              <p className="wa-panel-greeting">{isAr ? 'مرحباً! 👋 كيف يمكننا مساعدتك؟' : 'Hi there! 👋 How can we help you?'}</p>
            </div>
            {ctx.badge && <span className="wa-context-badge">{ctx.badge}</span>}
            <p className="wa-panel-preview">{isAr ? 'رسالتك المعبأة مسبقاً:' : 'Your pre-filled message:'}</p>
            <div className="wa-panel-msg-preview">{ctx.message}</div>
          </div>

          {/* ─── REGION SWITCHER ─── */}
          <div className="wa-region-bar">
            <div className="wa-region-active">
              <span className="wa-region-flag">{office.flag}</span>
              <div className="wa-region-details">
                <span className="wa-region-name">{isAr ? office.officeAr : office.office}</span>
                <span className="wa-region-hours">{isAr ? office.hoursAr : office.hours}</span>
              </div>
            </div>
            <button className="wa-region-switch" onClick={() => setRegion(otherRegion)}>
              {otherOffice.flag} {isAr ? otherOffice.officeAr : otherOffice.office}
            </button>
          </div>

          <button className="wa-panel-send" onClick={handleClick}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.529-1.475A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.245 0-4.327-.734-6.012-1.975l-.42-.31-2.69.877.895-2.647-.34-.437A9.952 9.952 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            {isAr ? 'افتح واتساب' : 'Open WhatsApp'}
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

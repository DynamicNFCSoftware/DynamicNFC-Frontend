import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from '../../i18n';
import './CRMGateway.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/portals/crmGateway';

const T = {
  en: {
    badge: "Live Demo Environment",
    title: "This is what your sales team has been missing.",
    title2: "Choose an industry to explore",
    descDefault: "Experience how Dynamic NFC transforms sales across industries with intelligent, personalized portals. Each tap delivers a unique experience tailored to customer preferences, interests, and stage in the journey.",
    descRe: "Experience how Dynamic NFC transforms luxury real estate sales with intelligent, personalized buyer portals. Each tap delivers a unique experience tailored to buyer preferences, interests, and stage in the journey.",
    descAuto: "Experience how Dynamic NFC transforms automotive sales with intelligent, personalized showroom portals. Each tap delivers a unique experience tailored to customer preferences, vehicle interests, and purchase journey.",

    sectionChoose: "Choose Your Industry",
    indReTitle: "Real Estate Developers & Agents",
    indReSub: "Luxury developments, branded residences, brokerages",
    indRePreview: "2 VIP portals · 1 marketplace · dashboard · AI pipeline",
    indReTags: ["VIP Portals", "Family Buyers", "Marketplace", "Analytics", "AI Pipeline"],
    indAutoTitle: "Automotive",
    indAutoSub: "Dealerships, luxury showrooms, fleet management",
    indAutoPreview: "2 VIP portals · 1 showroom · dashboard · AI pipeline",
    indAutoTags: ["VIP Experience", "Test Drives", "Public Showroom", "Dashboard", "AI Pipeline"],
    backAll: "All Industries",

    sectionPortals: "Demo Portals",
    b1: "VIP Investor", c1t: "Khalid Al-Rashid Portal",
    c1d: "Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics dashboard.",
    c1tags: ["ROI Calculator", "Penthouses", "Investment Tier"],
    b2: "Family Buyer", c2t: "Ahmed Al-Fahad Portal",
    c2d: "Premium family homebuyer experience highlighting family-friendly residences, school districts, and community amenities.",
    c2tags: ["3BR+ Units", "Schools", "Community"],
    b3: "Public Access", c3t: "Global Marketplace",
    c3d: "Anonymous and registered user browsing experience with adaptive content and lead capture based on engagement signals.",
    c3tags: ["Anonymous Browse", "Lead Capture", "Progressive Profile"],
    b4: "Analytics Dashboard", c4t: "CRM Intelligence",
    c4d: "Internal behavioral analytics and CRM dashboard showing real-time engagement metrics, lead scoring, content performance, and conversion funnels.",
    c4tags: ["Real-time Analytics", "Lead Scoring", "Behavior Tracking", "Conversion Funnels", "A/B Testing"],
    b5: "AI Automation", c5t: "AI Sales Pipeline",
    c5d: "Watch AI orchestrate Canva, Gmail, Google Calendar, and DocuSign to automate the entire sales pipeline — from personalized brochures to signed agreements in under 2 minutes.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "MCP"],

    ab1: "VIP Client", ac1t: "Khalid Al-Rashid",
    ac1d: "Elite client experience with luxury SUV preferences, test drive history, and personalized offers.",
    ac1tags: ["Luxury SUVs", "Test Drives", "VIP Tier"],
    ab2: "VIP Client", ac2t: "Sultan Al-Dhaheri",
    ac2d: "Performance enthusiast portal with sports car focus, financing options, and trade-in valuation.",
    ac2tags: ["Sports Cars", "Financing", "Trade-in"],
    ab3: "Public Access", ac3t: "Public Showroom",
    ac3d: "Walk-in and online browsing experience with adaptive content based on engagement.",
    ac3tags: ["Browse Models", "Lead Capture", "Inventory"],
    ab4: "AI Pipeline", ac4t: "AI Sales Pipeline",
    ac4d: "Automated follow-up system generating personalized offers and test drive scheduling.",
    ac4tags: ["AI Follow-up", "Test Drive Booking", "Smart Offers"],
    ab5: "Analytics", ac5t: "Dealership Dashboard",
    ac5d: "Real-time showroom analytics, lead scoring, vehicle interest tracking, and conversion funnels.",
    ac5tags: ["Showroom Analytics", "Lead Scoring", "Inventory Insights"],

    footer: "Demo environment for",
    footerLink: "Dynamic NFC",
    homeBtn: "Home",

    sectionChooseSub: "Each industry has its own portals, dashboards, and AI pipeline.",
    trustNfc: "NFC-powered journeys",
    trustPrivacy: "Privacy-first by design",
    trustRealtime: "Real-time pipeline visibility",
    trustBuilt: "Built in Canada",
    demoCta: "Planning an NFC-powered sales motion for your team?",
    demoCtaBtn: "Contact sales",
  },
  ar: {
    badge: "بيئة العرض المباشر",
    title: "هذا ما كان ينقص فريق مبيعاتك.",
    title2: "اختر مجالك واستكشف",
    descDefault: "اختبر كيف تحول Dynamic NFC المبيعات عبر القطاعات ببوابات ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات العميل واهتماماته ومرحلة رحلته.",
    descRe: "اختبر كيف تحول Dynamic NFC مبيعات العقارات الفاخرة عبر بوابات مشترٍ ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات المشتري واهتماماته ومرحلة رحلته.",
    descAuto: "اختبر كيف تحول Dynamic NFC مبيعات السيارات عبر بوابات صالة عرض ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات العميل واهتماماته بالسيارات ورحلة الشراء.",

    sectionChoose: "اختر مجالك",
    indReTitle: "مطورو ووكلاء العقارات",
    indReSub: "المشاريع الفاخرة، المساكن ذات العلامة التجارية، الوساطة",
    indRePreview: "بوابتان VIP · سوق · لوحة تحكم · مسار AI",
    indReTags: ["بوابات VIP", "مشترون عائليون", "السوق", "تحليلات", "مسار AI"],
    indAutoTitle: "السيارات",
    indAutoSub: "الوكالات، صالات العرض الفاخرة، إدارة الأسطول",
    indAutoPreview: "بوابتان VIP · صالة عرض · لوحة تحكم · مسار AI",
    indAutoTags: ["تجربة VIP", "تجارب القيادة", "صالة العرض", "لوحة التحكم", "مسار AI"],
    backAll: "جميع القطاعات",

    sectionPortals: "بوابات العرض التجريبي",
    b1: "مستثمر كبار الشخصيات", c1t: "بوابة خالد الرشيد",
    c1d: "تجربة المستثمر المتميز مع محتوى يركز على العائد على الاستثمار، عرض بنتهاوس في الطوابق العليا، ولوحة تحليلات الاستثمار.",
    c1tags: ["حاسبة العائد", "بنتهاوس", "مستوى استثماري"],
    b2: "مشتري عائلة", c2t: "بوابة أحمد الفهد",
    c2d: "تجربة المشتري العائلي المميز مع إبراز الوحدات الملائمة للعائلة، المدارس، ومرافق المجتمع.",
    c2tags: ["وحدات ٣+ غرف", "مدارس", "مجتمع"],
    b3: "الوصول العام", c3t: "السوق العالمي",
    c3d: "تجربة تصفح للمستخدمين المجهولين والمسجلين مع محتوى متكيف وجمع بيانات العملاء حسب إشارات التفاعل.",
    c3tags: ["تصفح مجهول", "التقاط العملاء", "ملف تدريجي"],
    b4: "لوحة تحليلات", c4t: "ذكاء إدارة علاقات العملاء",
    c4d: "لوحة تحليلات داخلية وسجل إدارة علاقات العملاء تُظهر مؤشرات التفاعل في الوقت الفعلي، تقييم العملاء، أداء المحتوى، ومسارات التحويل.",
    c4tags: ["تحليلات فورية", "تقييم العملاء", "تتبع السلوك", "قمع التحويل", "اختبار A/B"],
    b5: "أتمتة الذكاء الاصطناعي", c5t: "مسار مبيعات الذكاء الاصطناعي",
    c5d: "شاهد الذكاء الاصطناعي ينظم Canva، Gmail، Google Calendar، و DocuSign لأتمتة كامل مسار المبيعات — من الكتيبات المخصصة إلى الاتفاقيات الموقعة في أقل من دقيقتين.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "MCP"],

    ab1: "عميل VIP", ac1t: "خالد الرشيد",
    ac1d: "تجربة العميل المتميز مع تفضيلات سيارات الدفع الرباعي الفاخرة، وتاريخ تجارب القيادة، والعروض المخصصة.",
    ac1tags: ["سيارات SUV فاخرة", "تجارب القيادة", "مستوى VIP"],
    ab2: "عميل VIP", ac2t: "سلطان الظاهري",
    ac2d: "بوابة عشاق الأداء مع التركيز على السيارات الرياضية، وخيارات التمويل، وتقييم الاستبدال.",
    ac2tags: ["سيارات رياضية", "تمويل", "استبدال"],
    ab3: "الوصول العام", ac3t: "صالة العرض العامة",
    ac3d: "تجربة تصفح للزوار والعملاء عبر الإنترنت مع محتوى متكيف حسب التفاعل.",
    ac3tags: ["تصفح الموديلات", "التقاط العملاء", "المخزون"],
    ab4: "مسار AI", ac4t: "مسار مبيعات الذكاء الاصطناعي",
    ac4d: "نظام متابعة آلي يولّد عروضًا مخصصة وجدولة تجارب القيادة.",
    ac4tags: ["متابعة AI", "حجز تجربة قيادة", "عروض ذكية"],
    ab5: "تحليلات", ac5t: "لوحة تحكم الوكالة",
    ac5d: "تحليلات صالة العرض في الوقت الفعلي، تقييم العملاء، تتبع الاهتمام بالسيارات، ومسارات التحويل.",
    ac5tags: ["تحليلات صالة العرض", "تقييم العملاء", "رؤى المخزون"],

    footer: "بيئة العرض التجريبي لـ",
    footerLink: "Dynamic NFC",
    homeBtn: "الرئيسية",

    sectionChooseSub: "لكل قطاع بواباته ولوحاته ومسار الذكاء الاصطناعي الخاص.",
    trustNfc: "رحلات مدعومة بـ NFC",
    trustPrivacy: "خصوصية أولاً بالتصميم",
    trustRealtime: "رؤية فورية للمسار",
    trustBuilt: "صُمّم في كندا",
    demoCta: "تخطط لفريق مبيعات يعتمد على NFC؟",
    demoCtaBtn: "تواصل مع المبيعات",
  },
};

const TRUST_ROWS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d="M12 2a10 10 0 0 1 10 10M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 0 10-10M12 22a10 10 0 0 1-10-10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    key: "trustNfc",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    key: "trustPrivacy",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    key: "trustRealtime",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    key: "trustBuilt",
  },
];

/* SVG Icons */
const IconBuilding = <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="6" width="32" height="38" rx="3" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="24" y1="14" x2="24" y2="14.01" /><line x1="32" y1="14" x2="32" y2="14.01" /><line x1="16" y1="22" x2="16" y2="22.01" /><line x1="24" y1="22" x2="24" y2="22.01" /><line x1="32" y1="22" x2="32" y2="22.01" /><line x1="16" y1="30" x2="16" y2="30.01" /><line x1="24" y1="30" x2="24" y2="30.01" /><line x1="32" y1="30" x2="32" y2="30.01" /><path d="M20 44V38h8v6" /></svg>;
const IconCar = <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 30h28M6 24l4-10h28l4 10" /><rect x="6" y="24" width="36" height="10" rx="2" /><circle cx="14" cy="34" r="3" /><circle cx="34" cy="34" r="3" /></svg>;

const GwIconChart = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const GwIconGlobe = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const GwIconAi = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const GwIconStorefront = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <path d="M3 9V7l9-4 9 4v2" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const PORTAL_CARD_ICONS = {
  chart: GwIconChart,
  globe: GwIconGlobe,
  ai: GwIconAi,
  store: GwIconStorefront,
};

/** Stroke arrow for circular card affordance (shared industry + portal cards) */
function GwArrowCircleIcon() {
  return (
    <svg className="gw-arrow-circle-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h11" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
      <path d="M13 7.5l5.5 4.5-5.5 4.5" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Compact “continue” mark for preview line */
function GwArrowInlineIcon() {
  return (
    <svg className="gw-arrow-inline-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12h10" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
      <path d="M12 7l5.5 5-5.5 5" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GwChevronBackIcon() {
  return (
    <svg className="gw-back-chevron-svg" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14.5 17.5L9 12l5.5-5.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CRMGateway() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const t = T[lang];
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!particlesRef.current) return;
    particlesRef.current.innerHTML = "";
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "gw-particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 20}s`;
      p.style.animationDuration = `${15 + Math.random() * 10}s`;
      particlesRef.current.appendChild(p);
    }
  }, []);

  const rePortals = [
    { id: "dashboard", path: "/enterprise/crmdemo/dashboard", badge: t.b4, badgeCls: "red", cardIcon: "chart", title: t.c4t, desc: t.c4d, tags: t.c4tags, featured: true },
    { id: "khalid", path: "/enterprise/crmdemo/khalid", badge: t.b1, badgeCls: "red", avatar: "KR", avatarCls: "gold", title: t.c1t, desc: t.c1d, tags: t.c1tags },
    { id: "ahmed", path: "/enterprise/crmdemo/ahmed", badge: t.b2, badgeCls: "blue", avatar: "AF", avatarCls: "blue", title: t.c2t, desc: t.c2d, tags: t.c2tags },
    { id: "marketplace", path: "/enterprise/crmdemo/marketplace", badge: t.b3, badgeCls: "blue", cardIcon: "globe", title: t.c3t, desc: t.c3d, tags: t.c3tags },
    { id: "ai-demo", path: "/enterprise/crmdemo/ai-demo", badge: t.b5, badgeCls: "purple", cardIcon: "ai", title: t.c5t, desc: t.c5d, tags: t.c5tags, featured: true },
  ];

  const autoPortals = [
    { id: "auto-dashboard", path: "/automotive/dashboard", badge: t.ab5, badgeCls: "red", cardIcon: "chart", title: t.ac5t, desc: t.ac5d, tags: t.ac5tags, featured: true },
    { id: "khalid-auto", path: "/automotive/demo/khalid", badge: t.ab1, badgeCls: "red", avatar: "KA", avatarCls: "gold", title: t.ac1t, desc: t.ac1d, tags: t.ac1tags },
    { id: "sultan", path: "/automotive/demo/sultan", badge: t.ab2, badgeCls: "red", avatar: "SA", avatarCls: "blue", title: t.ac2t, desc: t.ac2d, tags: t.ac2tags },
    { id: "showroom", path: "/automotive/demo/showroom", badge: t.ab3, badgeCls: "blue", cardIcon: "store", title: t.ac3t, desc: t.ac3d, tags: t.ac3tags },
    { id: "auto-ai", path: "/automotive/demo/ai", badge: t.ab4, badgeCls: "purple", cardIcon: "ai", title: t.ac4t, desc: t.ac4d, tags: t.ac4tags, featured: true },
  ];

  const portals = industry === 'auto' ? autoPortals : rePortals;
  const heroDesc = industry === 're' ? t.descRe : industry === 'auto' ? t.descAuto : t.descDefault;

  return (
    <div className="gw" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title="CRM Demo" description="Live demo of DynamicNFC CRM intelligence — VIP portals, behavioral dashboard, and AI sales pipeline." path="/enterprise/crmdemo" />
      <div className="gw-ambient" aria-hidden />
      <div className="gw-particles" ref={particlesRef} />

      {/* Header */}
      <header className="gw-hd">
        <div className="gw-hd-inner">
          <Link to="/" className="gw-logo" aria-label={t.homeBtn}>
            <img src="/assets/images/logo.png" alt="" />
          </Link>
          <div className="gw-badge"><span>{t.badge}</span></div>
          <div className="gw-hd-right">
            <Link to="/" className="gw-home">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {t.homeBtn}
            </Link>
          </div>
        </div>
      </header>

      <main className="gw-main">
        {/* Hero */}
        <section className="gw-hero" aria-labelledby="gw-hero-heading">
          <div className="gw-nfc" aria-hidden>
            <div className="gw-nfc-waves"><div className="gw-nfc-wave" /><div className="gw-nfc-wave" /><div className="gw-nfc-wave" /></div>
            <div className="gw-nfc-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="gw-nfc-svg">
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
              </svg>
            </div>
          </div>
          <h1 id="gw-hero-heading" className="gw-hero-title">{t.title}</h1>
          <p className="gw-hero-kicker">{t.title2}</p>
          <p className="gw-hero-desc">{heroDesc}</p>
        </section>

        {/* Trust strip — professional, localized */}
        <ul className="gw-trust" role="list">
          {TRUST_ROWS.map((row) => (
            <li key={row.key} className="gw-trust-item">
              <span className="gw-trust-ico">{row.icon}</span>
              <span>{t[row.key]}</span>
            </li>
          ))}
        </ul>

        {/* Industry Selector or Portal Cards */}
        {industry === null ? (
          <section className="gw-ind-section gw-fade-in" key="industry-select" aria-labelledby="gw-section-industry">
            <div className="gw-sh">
              <div>
                <h2 id="gw-section-industry">{t.sectionChoose}</h2>
                <p className="gw-sh-sub">{t.sectionChooseSub}</p>
              </div>
              <div className="gw-sh-line" aria-hidden />
            </div>
            <div className="gw-ind-grid">
              <button
                type="button"
                className="gw-ind-btn"
                onClick={() => navigate('/enterprise/crmdemo/dashboard')}
                aria-label={`${t.indReTitle}. ${t.indReSub}`}
              >
                <div className="gw-ind-card gw-ind-re">
                  <div className="gw-ind-icon-wrap gw-ind-icon-re">{IconBuilding}</div>
                  <h3>{t.indReTitle}</h3>
                  <p>{t.indReSub}</p>
                  <p className="gw-ind-preview">
                    <span className="gw-ind-preview-icon" aria-hidden><GwArrowInlineIcon /></span>
                    <span className="gw-ind-preview-text">{t.indRePreview}</span>
                  </p>
                  <div className="gw-ind-tags">{t.indReTags.map((tag, i) => <span className="gw-tag" key={i}>{tag}</span>)}</div>
                  <div className="gw-card-arrow" aria-hidden><GwArrowCircleIcon /></div>
                </div>
              </button>
              <button
                type="button"
                className="gw-ind-btn"
                onClick={() => navigate('/automotive/dashboard')}
                aria-label={`${t.indAutoTitle}. ${t.indAutoSub}`}
              >
                <div className="gw-ind-card gw-ind-auto">
                  <div className="gw-ind-icon-wrap gw-ind-icon-auto">{IconCar}</div>
                  <h3>{t.indAutoTitle}</h3>
                  <p>{t.indAutoSub}</p>
                  <p className="gw-ind-preview">
                    <span className="gw-ind-preview-icon" aria-hidden><GwArrowInlineIcon /></span>
                    <span className="gw-ind-preview-text">{t.indAutoPreview}</span>
                  </p>
                  <div className="gw-ind-tags">{t.indAutoTags.map((tag, i) => <span className="gw-tag" key={i}>{tag}</span>)}</div>
                  <div className="gw-card-arrow" aria-hidden><GwArrowCircleIcon /></div>
                </div>
              </button>
            </div>
          </section>
        ) : (
          <section className="gw-portal-section gw-fade-in" key="portal-list" aria-labelledby="gw-section-portals">
            <div className="gw-portal-hd">
              <button type="button" className="gw-back" onClick={() => setIndustry(null)}>
                <span className="gw-back-chevron" aria-hidden><GwChevronBackIcon /></span>
                <span>{t.backAll}</span>
              </button>
              <div className="gw-sh">
                <h2 id="gw-section-portals">{t.sectionPortals}</h2>
                <div className="gw-sh-line" aria-hidden />
              </div>
            </div>
            <div className="gw-grid">
              {portals.map((p) => (
                <Link key={p.id} to={p.path} className={`gw-card ${p.featured ? "featured" : ""}`} onClick={() => { if (typeof gtag === 'function') gtag('event', 'select_content', { content_type: 'demo_portal', content_id: p.id }); }}>
                  <div className={`gw-card-badge ${p.badgeCls}`}>{p.badge}</div>
                  {p.avatar ? (
                    <div className={`gw-card-avatar ${p.avatarCls}`}>{p.avatar}</div>
                  ) : (
                    <div className="gw-card-icon">{PORTAL_CARD_ICONS[p.cardIcon]}</div>
                  )}
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="gw-card-tags">{p.tags.map((tag, i) => {
                    const isRoiTag = tag === "ROI Calculator" || tag === "حاسبة العائد";
                    return isRoiTag ? (
                      <Link to="/enterprise/crmdemo/roi-calculator" className="gw-tag gw-tag-link" key={i} onClick={(e) => e.stopPropagation()}>{tag}</Link>
                    ) : (
                      <span className="gw-tag" key={i}>{tag}</span>
                    );
                  })}</div>
                  <div className="gw-card-arrow" aria-hidden><GwArrowCircleIcon /></div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <section className="gw-cta" aria-label={t.demoCta}>
        <div className="gw-cta-inner">
          <p className="gw-cta-copy">{t.demoCta}</p>
          <Link to="/contact-sales" className="gw-cta-btn" style={{ color: '#ffffff' }}>{t.demoCtaBtn}</Link>
        </div>
      </section>

      <footer className="gw-ft">
        <div className="gw-ft-inner">
          <div className="gw-ft-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="gw-ft-logo" /></Link>
            <p className="gw-ft-note">{lang === 'ar' ? 'المقر الرئيسي في فانكوفر، كندا. ذكاء مبيعات NFC للعقارات والسيارات والمؤسسات.' : 'Headquartered in Vancouver, Canada. NFC-powered sales intelligence for real estate, automotive, and enterprise.'}</p>
          </div>
          <div className="gw-ft-cols">
            <div className="gw-ft-col">
              <h5>{lang === 'ar' ? 'القطاعات' : 'Industries'}</h5>
              <Link to="/developers">{lang === 'ar' ? 'المطورين والوكلاء' : 'Developers & Agents'}</Link>
              <Link to="/automotive">{lang === 'ar' ? 'السيارات' : 'Automotive'}</Link>
              <Link to="/nfc-cards">{lang === 'ar' ? 'بطاقات NFC' : 'NFC Cards'}</Link>
            </div>
            <div className="gw-ft-col">
              <h5>{lang === 'ar' ? 'الموارد' : 'Resources'}</h5>
              <Link to="/enterprise/crmdemo">{lang === 'ar' ? 'عرض مباشر' : 'Live Demo'}</Link>
              <Link to="/contact-sales">{lang === 'ar' ? 'تواصل مع المبيعات' : 'Contact Sales'}</Link>
              <Link to="/login">{lang === 'ar' ? 'تسجيل الدخول' : 'Log in'}</Link>
            </div>
          </div>
        </div>
        <div className="gw-ft-bottom"><p>{lang === 'ar' ? '© ٢٠٢٦ DynamicNFC Card Inc. جميع الحقوق محفوظة.' : '© 2026 DynamicNFC Card Inc. All Rights Reserved.'}</p></div>
      </footer>
    </div>
  );
}

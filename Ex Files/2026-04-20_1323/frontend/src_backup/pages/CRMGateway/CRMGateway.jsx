import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../../i18n';
import './CRMGateway.css';
import SEO from '../../components/SEO/SEO';

// ═══════════════════════════════════════════════════════════════════
// CRM GATEWAY — Demo Entry Point (Definitive Edition)
// ═══════════════════════════════════════════════════════════════════
// Self-contained: no external CSS file needed
// Dark charcoal theme matching original HTML gateway
// NFC wave animation, particle system, bilingual EN/AR
// Links verified: single slash, React Router <Link>
// ═══════════════════════════════════════════════════════════════════

const T = {
  en: {
    badge: "Live Demo Environment",
    tagline: "Dynamic NFC Technology Demo",
    title: "Personalized Experiences",
    title2: "Powered by NFC",
    descDefault: "Experience how Dynamic NFC transforms sales across industries with intelligent, personalized portals. Each tap delivers a unique experience tailored to customer preferences, interests, and stage in the journey.",
    descRe: "Experience how Dynamic NFC transforms luxury real estate sales with intelligent, personalized buyer portals. Each tap delivers a unique experience tailored to buyer preferences, interests, and stage in the journey.",
    descAuto: "Experience how Dynamic NFC transforms automotive sales with intelligent, personalized showroom portals. Each tap delivers a unique experience tailored to customer preferences, vehicle interests, and purchase journey.",
    stat1v: "47%", stat1l: "Higher Engagement",
    stat2v: "3.2×", stat2l: "Conversion Rate",
    stat3v: "Real-time", stat3l: "Analytics",

    /* Industry selector */
    sectionChoose: "Choose Your Industry",
    indReTitle: "Real Estate",
    indReSub: "Luxury developments, branded residences, brokerages",
    indReTags: ["VIP Portals", "Family Buyers", "Marketplace", "Analytics", "AI Pipeline"],
    indAutoTitle: "Automotive",
    indAutoSub: "Dealerships, luxury showrooms, fleet management",
    indAutoTags: ["VIP Experience", "Test Drives", "Public Showroom", "Dashboard", "AI Pipeline"],
    backAll: "← All Industries",

    /* RE portals */
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

    /* Auto portals */
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

    howTitle: "How Dynamic NFC Works",
    howDesc: "Transform every customer touchpoint into personalized engagement",
    s1t: "Tap to Connect", s1d: "Customer taps their phone on an NFC-enabled surface at the sales center, showroom, or marketing material.",
    s2t: "Instant Recognition", s2d: "System identifies returning customers or captures new leads, routing them to their personalized portal.",
    s3t: "Tailored Experience", s3d: "Content dynamically adapts to customer preferences, showing relevant products, pricing, and options.",
    s4t: "Track & Optimize", s4d: "Every interaction feeds the analytics dashboard, enabling sales teams to prioritize and personalize follow-ups.",
    tech1: "NFC Technology", tech2: "QR Code Fallback", tech3: "AI Personalization", tech4: "CRM Integration",
    footer: "Demo environment for",
    footerLink: "Dynamic NFC",
    footerEnd: "technology showcase. No tracking on this gateway page.",
    langBtn: "العربية",
    homeBtn: "Home",
  },
  ar: {
    badge: "بيئة العرض المباشر",
    tagline: "عرض تقنية Dynamic NFC",
    title: "تجارب مخصصة",
    title2: "مدعوم بـ الاتصال قريب المدى",
    descDefault: "اختبر كيف تحول Dynamic NFC المبيعات عبر القطاعات ببوابات ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات العميل واهتماماته ومرحلة رحلته.",
    descRe: "اختبر كيف تحول Dynamic NFC مبيعات العقارات الفاخرة عبر بوابات مشترٍ ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات المشتري واهتماماته ومرحلة رحلته.",
    descAuto: "اختبر كيف تحول Dynamic NFC مبيعات السيارات عبر بوابات صالة عرض ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات العميل واهتماماته بالسيارات ورحلة الشراء.",
    stat1v: "0.47", stat1l: "مستوى التفاعل الأعلى",
    stat2v: "3.2×", stat2l: "معدل التحويل للحجز",
    stat3v: "في الوقت الفعلي", stat3l: "التحليلات",

    sectionChoose: "اختر مجالك",
    indReTitle: "العقارات",
    indReSub: "المشاريع الفاخرة، المساكن ذات العلامة التجارية، الوساطة",
    indReTags: ["بوابات VIP", "مشترون عائليون", "السوق", "تحليلات", "مسار AI"],
    indAutoTitle: "السيارات",
    indAutoSub: "الوكالات، صالات العرض الفاخرة، إدارة الأسطول",
    indAutoTags: ["تجربة VIP", "تجارب القيادة", "صالة العرض", "لوحة التحكم", "مسار AI"],
    backAll: "← جميع القطاعات",

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

    howTitle: "كيف تعمل Dynamic NFC",
    howDesc: "حوّل كل نقطة تواصل للعميل إلى تفاعل مخصص",
    s1t: "انقر للاتصال", s1d: "ينقر العميل على هاتفه على سطح مزود بـ الاتصال قريب المدى في مركز المبيعات، صالة العرض، أو مواد التسويق.",
    s2t: "التعرف الفوري", s2d: "يتعرف النظام على العملاء العائدين أو يجمع العملاء الجدد، ويوجههم إلى بوابتهم الشخصية.",
    s3t: "تجربة مخصصة", s3d: "يتكيف المحتوى ديناميكيًا حسب تفضيلات العميل، مظهرًا المنتجات والأسعار والخيارات المناسبة.",
    s4t: "التتبع والتحسين", s4d: "كل تفاعل يُغذي لوحة التحليلات، مما يمكّن فرق المبيعات من تحديد الأولويات ومتابعة المخصص.",
    tech1: "تقنية الاتصال قريب المدى", tech2: "خيار QR Code", tech3: "تخصيص الذكاء الاصطناعي", tech4: "تكامل إدارة علاقات العملاء",
    footer: "بيئة العرض التجريبي لـ",
    footerLink: "Dynamic NFC",
    footerEnd: "عرض التكنولوجيا. لا يوجد تتبع على هذه الصفحة.",
    langBtn: "العربية",
    homeBtn: "الرئيسية",
},
};

export default function CRMGateway() {
  const { lang } = useLanguage();
  const [industry, setIndustry] = useState(null);
  const t = T[lang];
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!particlesRef.current) return;
    particlesRef.current.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "gw-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.animationDuration = (15 + Math.random() * 10) + "s";
      particlesRef.current.appendChild(p);
    }
  }, []);

  const rePortals = [
    { id: "khalid", path: "/enterprise/crmdemo/khalid", badge: t.b1, badgeCls: "red", avatar: "KR", avatarCls: "gold", title: t.c1t, desc: t.c1d, tags: t.c1tags },
    { id: "ahmed", path: "/enterprise/crmdemo/ahmed", badge: t.b2, badgeCls: "blue", avatar: "AF", avatarCls: "blue", title: t.c2t, desc: t.c2d, tags: t.c2tags },
    { id: "marketplace", path: "/enterprise/crmdemo/marketplace", badge: t.b3, badgeCls: "blue", icon: "🌐", title: t.c3t, desc: t.c3d, tags: t.c3tags },
    { id: "ai-demo", path: "/enterprise/crmdemo/ai-demo", badge: t.b5, badgeCls: "purple", icon: "🤖", title: t.c5t, desc: t.c5d, tags: t.c5tags, featured: true },
    { id: "dashboard", path: "/enterprise/crmdemo/dashboard", badge: t.b4, badgeCls: "red", icon: "📊", title: t.c4t, desc: t.c4d, tags: t.c4tags, featured: true },
  ];

  const autoPortals = [
    { id: "khalid-auto", path: "/automotive/demo/khalid", badge: t.ab1, badgeCls: "red", avatar: "KA", avatarCls: "gold", title: t.ac1t, desc: t.ac1d, tags: t.ac1tags },
    { id: "sultan", path: "/automotive/demo/sultan", badge: t.ab2, badgeCls: "red", avatar: "SA", avatarCls: "blue", title: t.ac2t, desc: t.ac2d, tags: t.ac2tags },
    { id: "showroom", path: "/automotive/demo/showroom", badge: t.ab3, badgeCls: "blue", icon: "🏪", title: t.ac3t, desc: t.ac3d, tags: t.ac3tags },
    { id: "auto-ai", path: "/automotive/demo/ai", badge: t.ab4, badgeCls: "purple", icon: "🤖", title: t.ac4t, desc: t.ac4d, tags: t.ac4tags, featured: true },
    { id: "auto-dashboard", path: "/automotive/dashboard", badge: t.ab5, badgeCls: "red", icon: "📊", title: t.ac5t, desc: t.ac5d, tags: t.ac5tags, featured: true },
  ];

  const portals = industry === 'auto' ? autoPortals : rePortals;
  const heroDesc = industry === 're' ? t.descRe : industry === 'auto' ? t.descAuto : t.descDefault;

  return (
    <div className="gw" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title="CRM Demo" description="Live demo of DynamicNFC CRM intelligence — VIP portals, behavioral dashboard, and AI sales pipeline." path="/enterprise/crmdemo" />
      <div className="gw-bg" />
      <div className="gw-particles" ref={particlesRef} />

      {/* Header */}
      <header className="gw-hd">
        <div className="gw-logo"><img src="/assets/images/logo.png" alt="DynamicNFC" style={{height:'52px',width:'auto'}} /></div>
        <div className="gw-badge"><span>{t.badge}</span></div>
        <div className="gw-hd-right" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Link to="/" className="gw-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t.homeBtn}
          </Link>
        </div>
      </header>

      <main className="gw-main">
        {/* Hero */}
        <section className="gw-hero">
          <div className="gw-nfc">
            <div className="gw-nfc-waves"><div className="gw-nfc-wave" /><div className="gw-nfc-wave" /><div className="gw-nfc-wave" /></div>
            <div className="gw-nfc-card">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--gw-blue)" }}>
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
              </svg>
            </div>
          </div>
          <div className="gw-tagline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            {t.tagline}
          </div>
          <h1>{t.title}<br />{t.title2}</h1>
          <p>{heroDesc}</p>
          <div className="gw-stats">
            <div className="gw-stat"><span className="gw-stat-v">{t.stat1v}</span><span className="gw-stat-l">{t.stat1l}</span></div>
            <div className="gw-stat"><span className="gw-stat-v">{t.stat2v}</span><span className="gw-stat-l">{t.stat2l}</span></div>
            <div className="gw-stat"><span className="gw-stat-v">{t.stat3v}</span><span className="gw-stat-l">{t.stat3l}</span></div>
          </div>
        </section>

        {/* Industry Selector or Portal Cards */}
        {industry === null ? (
          <>
            <div className="gw-sh"><h2>{t.sectionChoose}</h2><div className="gw-sh-line" /></div>
            <div className="gw-ind-grid">
              <div className="gw-ind-card" onClick={() => setIndustry('re')}>
                <span className="gw-ind-icon">🏗️</span>
                <h3>{t.indReTitle}</h3>
                <p>{t.indReSub}</p>
                <div className="gw-ind-tags">{t.indReTags.map((tag, i) => <span className="gw-tag" key={i}>{tag}</span>)}</div>
                <div className="gw-card-arrow">→</div>
              </div>
              <div className="gw-ind-card" onClick={() => setIndustry('auto')}>
                <span className="gw-ind-icon">🚗</span>
                <h3>{t.indAutoTitle}</h3>
                <p>{t.indAutoSub}</p>
                <div className="gw-ind-tags">{t.indAutoTags.map((tag, i) => <span className="gw-tag" key={i}>{tag}</span>)}</div>
                <div className="gw-card-arrow">→</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="gw-back" onClick={() => setIndustry(null)}>{t.backAll}</button>
            <div className="gw-sh"><h2>{t.sectionPortals}</h2><div className="gw-sh-line" /></div>
            <div className="gw-grid">
              {portals.map((p) => (
                <Link key={p.id} to={p.path} target="_blank" rel="noreferrer" className={`gw-card ${p.featured ? "featured" : ""}`} onClick={() => { if (typeof gtag === 'function') gtag('event', 'select_content', { content_type: 'demo_portal', content_id: p.id }); }}>
                  <div className={`gw-card-badge ${p.badgeCls}`}>{p.badge}</div>
                  {p.avatar ? (
                    <div className={`gw-card-avatar ${p.avatarCls}`}>{p.avatar}</div>
                  ) : (
                    <div className="gw-card-icon">{p.icon}</div>
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
                  <div className="gw-card-arrow">→</div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* How It Works */}
        <section className="gw-how">
          <h2>{t.howTitle}</h2>
          <p>{t.howDesc}</p>
          <div className="gw-steps">
            {[{ n: "1", t: t.s1t, d: t.s1d }, { n: "2", t: t.s2t, d: t.s2d }, { n: "3", t: t.s3t, d: t.s3d }, { n: "4", t: t.s4t, d: t.s4d }].map((s, i) => (
              <div className="gw-step" key={i}><div className="gw-step-n">{s.n}</div><h4>{s.t}</h4><p>{s.d}</p></div>
            ))}
          </div>
          <div className="gw-tech">
            {[{ e: "📡", l: t.tech1 }, { e: "📱", l: t.tech2 }, { e: "🤖", l: t.tech3 }, { e: "🔗", l: t.tech4 }].map((item, i) => (
              <div className="gw-tech-item" key={i}><span>{item.e}</span>{item.l}</div>
            ))}
          </div>
        </section>
      </main>

      <footer className="gw-ft">
        <p>{t.footer} <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">{t.footerLink}</a> {t.footerEnd}</p>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useLanguage } from '../../i18n';
import './AutoGateway.css';
import SEO from '../../components/SEO/SEO';


const T = {
  en: {
    badge: "Live Demo Environment",
    tagline: "Dynamic NFC Automotive Technology Demo",
    title: "Personalized Buyer Experiences",
    title2: "Powered by NFC",
    desc: "Experience how Dynamic NFC transforms automotive sales with intelligent, personalized showroom portals. Each tap delivers a unique experience tailored to buyer preferences, interests, and stage in the journey.",
    stat1v: "47%", stat1l: "Higher Engagement",
    stat2v: "3.2×", stat2l: "Conversion Rate",
    stat3v: "Real-time", stat3l: "Analytics",
    sectionPortals: "Demo Portals",
    b1: "VIP Performance", c1t: "Khalid Al-Mansouri Portal",
    c1d: "Elite VIP experience with AMG Performance focus — GT 63 S configuration, finance calculator, and exclusive test drive booking.",
    c1tags: ["AMG Collection", "Vehicle Config", "Finance Calc"],
    b2: "VIP Family", c2t: "Sultan Al-Dhaheri Portal",
    c2d: "Premium family buyer experience highlighting luxury SUVs, safety features, school proximity, and family-friendly test drive scheduling.",
    c2tags: ["SUV Focus", "Safety", "Family Features"],
    b3: "Public Access", c3t: "Public Showroom",
    c3d: "Anonymous and registered user browsing experience with adaptive content based on engagement signals and progressive lead capture.",
    c3tags: ["Anonymous Browse", "Lead Capture", "Progressive Profile"],
    b4: "Analytics Dashboard", c4t: "Prestige Motors — Dealer Intelligence",
    c4d: "Internal behavioral analytics and CRM dashboard showing real-time engagement metrics, lead scoring, model interest heatmaps, and VIP conversion funnels.",
    c4tags: ["Real-time Analytics", "Lead Scoring", "Behavior Tracking", "Model Interest", "VIP Intelligence"],
    b5: "AI Sales Automation", c5t: "AI-Orchestrated Sales Pipeline",
    c5d: "Watch AI coordinate Canva, Gmail, Google Calendar, and DocuSign to deliver a complete VIP test drive experience — from NFC tap to signed agreement in under 60 seconds.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "Live MCP"],
    howTitle: "How Dynamic NFC Works",
    howDesc: "Transform every buyer touchpoint into personalized engagement",
    s1t: "Tap to Connect", s1d: "Buyer taps their phone on an NFC-enabled surface at the showroom, test drive event, or marketing material.",
    s2t: "Instant Recognition", s2d: "System identifies returning VIPs or captures new leads, routing them to their personalized showroom portal.",
    s3t: "Tailored Showroom", s3d: "Content dynamically adapts to buyer preferences, showing relevant models, configurations, and exclusive offers.",
    s4t: "Track & Optimize", s4d: "Every interaction feeds the dealer dashboard, enabling sales teams to prioritize and personalize follow-ups.",
    tech1: "NFC Technology", tech2: "QR Code Fallback", tech3: "AI Personalization", tech4: "CRM Integration",
    footer: "Demo environment for",
    footerLink: "Dynamic NFC",
    footerEnd: "automotive technology showcase. No tracking on this gateway page.",
    langBtn: "العربية",
    homeBtn: "Home",
  },
  ar: {
    badge: "بيئة العرض المباشر",
    tagline: "عرض تقنية السيارات لدى Dynamic NFC",
    title: "تجارب مشترٍ مخصصة",
    title2: "مدعوم بـ الاتصال قريب المدى",
    desc: "اختبر كيف تحول Dynamic NFC مبيعات السيارات عبر بوابات صالة عرض ذكية ومخصصة. كل نقرة تقدّم تجربة فريدة حسب تفضيلات المشتري واهتماماته ومرحلة رحلته.",
    stat1v: "0.47", stat1l: "مستوى التفاعل الأعلى",
    stat2v: "3.2×", stat2l: "معدل التحويل للحجز",
    stat3v: "في الوقت الفعلي", stat3l: "التحليلات",
    sectionPortals: "بوابات العرض التجريبي",
    b1: "VIP أداء", c1t: "بوابة خالد المنصوري",
    c1d: "تجربة VIP المتميزة مع تركيز على أداء AMG — تكوين GT 63 S، حاسبة التمويل، وحجز تجربة قيادة حصرية.",
    c1tags: ["مجموعة AMG", "تكوين السيارة", "حاسبة التمويل"],
    b2: "VIP عائلي", c2t: "بوابة سلطان الظاهري",
    c2d: "تجربة المشتري العائلي المميز مع إبراز سيارات SUV الفاخرة، ميزات الأمان، وجدولة تجارب قيادة عائلية.",
    c2tags: ["تركيز SUV", "الأمان", "ميزات عائلية"],
    b3: "الوصول العام", c3t: "صالة العرض العامة",
    c3d: "تجربة تصفح للمستخدمين المجهولين والمسجلين مع محتوى متكيف وجمع بيانات العملاء حسب إشارات التفاعل.",
    c3tags: ["تصفح مجهول", "التقاط العملاء", "ملف تدريجي"],
    b4: "لوحة تحليلات", c4t: "بريستيج موتورز — ذكاء التاجر",
    c4d: "لوحة تحليلات داخلية وسجل إدارة علاقات العملاء تُظهر مؤشرات التفاعل في الوقت الفعلي، تقييم العملاء، خرائط حرارة اهتمام الموديلات، ومسارات تحويل VIP.",
    c4tags: ["تحليلات فورية", "تقييم العملاء", "تتبع السلوك", "اهتمام الموديلات", "ذكاء VIP"],
    b5: "أتمتة المبيعات بالذكاء الاصطناعي", c5t: "خط أنابيب المبيعات المنسّق بالذكاء الاصطناعي",
    c5d: "شاهد كيف ينسّق الذكاء الاصطناعي بين Canva وGmail وتقويم Google وDocuSign لتقديم تجربة تجربة قيادة VIP كاملة — من نقر NFC إلى الاتفاقية الموقعة في أقل من 60 ثانية.",
    c5tags: ["Canva", "Gmail", "تقويم Google", "DocuSign", "MCP مباشر"],
    howTitle: "كيف تعمل Dynamic NFC",
    howDesc: "حوّل كل نقطة تواصل للمشتري إلى تفاعل مخصص",
    s1t: "انقر للاتصال", s1d: "ينقر المشتري على هاتفه على سطح مزود بـ NFC في صالة العرض، حدث تجربة القيادة، أو مواد التسويق.",
    s2t: "التعرف الفوري", s2d: "يتعرف النظام على عملاء VIP العائدين أو يجمع العملاء الجدد، ويوجههم إلى بوابة صالة العرض الشخصية.",
    s3t: "صالة عرض مخصصة", s3d: "يتكيف المحتوى ديناميكيًا حسب تفضيلات المشتري، مظهرًا الموديلات، التكوينات، والعروض الحصرية المناسبة.",
    s4t: "التتبع والتحسين", s4d: "كل تفاعل يُغذي لوحة تحكم التاجر، مما يمكّن فرق المبيعات من تحديد الأولويات ومتابعة المخصص.",
    tech1: "تقنية NFC", tech2: "خيار QR Code", tech3: "تخصيص الذكاء الاصطناعي", tech4: "تكامل CRM",
    footer: "بيئة العرض التجريبي لـ",
    footerLink: "Dynamic NFC",
    footerEnd: "عرض تكنولوجيا السيارات. لا يوجد تتبع على هذه الصفحة.",
    langBtn: "العربية",
    homeBtn: "الرئيسية",
  },
};


export default function AutoGateway() {
  const { lang } = useLanguage();
  const t = T[lang];
  const particlesRef = useRef(null);


  useEffect(() => {
    if (!particlesRef.current) return;
    particlesRef.current.innerHTML = "";
    for (let i = 0; i < 30; i++) {
      const p = document.createElement("div");
      p.className = "ag-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.animationDuration = (15 + Math.random() * 10) + "s";
      particlesRef.current.appendChild(p);
    }
  }, []);

  const portals = [
    { id: "khalid", path: "/automotive/demo/khalid", badge: t.b1, badgeCls: "red", avatar: "KM", avatarCls: "gold", title: t.c1t, desc: t.c1d, tags: t.c1tags },
    { id: "sultan", path: "/automotive/demo/sultan", badge: t.b2, badgeCls: "blue", avatar: "SD", avatarCls: "blue", title: t.c2t, desc: t.c2d, tags: t.c2tags },
    { id: "showroom", path: "/automotive/demo/showroom", badge: t.b3, badgeCls: "blue", icon: "🏪", title: t.c3t, desc: t.c3d, tags: t.c3tags },
    { id: "dashboard", path: "/automotive/dashboard", badge: t.b4, badgeCls: "red", icon: "\uD83D\uDCCA", title: t.c4t, desc: t.c4d, tags: t.c4tags, featured: true },
    { id: "ai-pipeline", path: "/automotive/demo/ai", badge: t.b5, badgeCls: "purple", icon: "\u26A1", title: t.c5t, desc: t.c5d, tags: t.c5tags, featured: true },
  ];

  return (
    <div className="ag" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title="Automotive Demo Gateway" description="Explore personalized automotive buyer experiences powered by NFC technology." path="/auto-gateway" />
      <div className="ag-bg" />
      <div className="ag-particles" ref={particlesRef} />

      <header className="ag-hd">
        <div className="ag-logo"><img src="/assets/images/logo.png" alt="DynamicNFC" style={{height:'52px',width:'auto'}} /></div>
        <div className="ag-badge"><span>{t.badge}</span></div>
        <div className="ag-hd-right" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <a href="/automotive" className="ag-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t.homeBtn}
          </a>
        </div>
      </header>

      <main className="ag-main">
        <section className="ag-hero">
          <div className="ag-nfc">
            <div className="ag-nfc-waves"><div className="ag-nfc-wave" /><div className="ag-nfc-wave" /><div className="ag-nfc-wave" /></div>
            <div className="ag-nfc-card">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--ag-blue)" }}>
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" /><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
              </svg>
            </div>
          </div>
          <div className="ag-tagline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            {t.tagline}
          </div>
          <h1>{t.title}<br />{t.title2}</h1>
          <p>{t.desc}</p>
          <div className="ag-stats">
            <div className="ag-stat"><span className="ag-stat-v">{t.stat1v}</span><span className="ag-stat-l">{t.stat1l}</span></div>
            <div className="ag-stat"><span className="ag-stat-v">{t.stat2v}</span><span className="ag-stat-l">{t.stat2l}</span></div>
            <div className="ag-stat"><span className="ag-stat-v">{t.stat3v}</span><span className="ag-stat-l">{t.stat3l}</span></div>
          </div>
        </section>

        <div className="ag-sh"><h2>{t.sectionPortals}</h2><div className="ag-sh-line" /></div>
        <div className="ag-grid">
          {portals.map((p) => (
            <a key={p.id} href={p.path} target="_blank" rel="noopener noreferrer" className={`ag-card ${p.featured ? "featured" : ""}`}>
              <div className={`ag-card-badge ${p.badgeCls}`}>{p.badge}</div>
              {p.avatar ? (
                <div className={`ag-card-avatar ${p.avatarCls}`}>{p.avatar}</div>
              ) : (
                <div className="ag-card-icon">{p.icon}</div>
              )}
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="ag-card-tags">{p.tags.map((tag, i) => (
                <span className="ag-tag" key={i}>{tag}</span>
              ))}</div>
              <div className="ag-card-arrow">→</div>
            </a>
          ))}
        </div>

        <section className="ag-how">
          <h2>{t.howTitle}</h2>
          <p>{t.howDesc}</p>
          <div className="ag-steps">
            {[{ n: "1", t: t.s1t, d: t.s1d }, { n: "2", t: t.s2t, d: t.s2d }, { n: "3", t: t.s3t, d: t.s3d }, { n: "4", t: t.s4t, d: t.s4d }].map((s, i) => (
              <div className="ag-step" key={i}><div className="ag-step-n">{s.n}</div><h4>{s.t}</h4><p>{s.d}</p></div>
            ))}
          </div>
          <div className="ag-tech">
            {[{ e: "📡", l: t.tech1 }, { e: "📱", l: t.tech2 }, { e: "🤖", l: t.tech3 }, { e: "🔗", l: t.tech4 }].map((item, i) => (
              <div className="ag-tech-item" key={i}><span>{item.e}</span>{item.l}</div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ag-ft">
        <p>{t.footer} <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">{t.footerLink}</a> {t.footerEnd}</p>
      </footer>
    </div>
  );
}

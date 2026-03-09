import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
    tagline: "Dynamic NFC CRM Technology Demo",
    title: "Personalized Buyer Experiences",
    title2: "Powered by NFC",
    desc: "Experience how Dynamic NFC transforms luxury real estate sales with intelligent, personalized buyer portals. Each tap delivers a unique experience tailored to buyer preferences, interests, and stage in the journey.",
    stat1v: "47%", stat1l: "Higher Engagement",
    stat2v: "3.2×", stat2l: "Conversion Rate",
    stat3v: "Real-time", stat3l: "Analytics",
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
    howTitle: "How Dynamic NFC Works",
    howDesc: "Transform every buyer touchpoint into personalized engagement",
    s1t: "Tap to Connect", s1d: "Buyer taps their phone on an NFC-enabled surface at the sales center, model unit, or marketing material.",
    s2t: "Instant Recognition", s2d: "System identifies returning buyers or captures new leads, routing them to their personalized portal.",
    s3t: "Tailored Experience", s3d: "Content dynamically adapts to buyer preferences, showing relevant units, pricing, and amenities.",
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
    tagline: "عرض تقنية CRM من Dynamic NFC",
    title: "تجارب مشتري مخصصة",
    title2: "مدعومة بتقنية NFC",
    desc: "اكتشف كيف تحوّل Dynamic NFC مبيعات العقارات الفاخرة عبر بوابات مشتري ذكية ومخصصة. كل نقرة تقدم تجربة فريدة مصممة حسب تفضيلات المشتري واهتماماته ومرحلته في الرحلة.",
    stat1v: "٤٧٪", stat1l: "تفاعل أعلى",
    stat2v: "٣.٢×", stat2l: "معدل التحويل",
    stat3v: "فوري", stat3l: "تحليلات",
    sectionPortals: "بوابات العرض",
    b1: "مستثمر VIP", c1t: "بوابة خالد الراشد",
    c1d: "تجربة مستثمر نخبوية مع محتوى مركز على العائد، عرض بنتهاوس الطوابق العليا، ولوحة تحليلات الاستثمار.",
    c1tags: ["حاسبة العائد", "بنتهاوس", "مستوى استثماري"],
    b2: "مشتري عائلي", c2t: "بوابة أحمد الفهد",
    c2d: "تجربة مشتري عائلي مميزة تبرز الوحدات العائلية والمدارس والمرافق المجتمعية.",
    c2tags: ["وحدات ٣+ غرف", "مدارس", "مجتمع"],
    b3: "وصول عام", c3t: "السوق العالمي",
    c3d: "تجربة تصفح مجهولة ومسجلة مع محتوى تكيّفي والتقاط العملاء بناءً على إشارات التفاعل.",
    c3tags: ["تصفح مجهول", "التقاط العملاء", "ملف تدريجي"],
    b4: "لوحة التحليلات", c4t: "ذكاء CRM",
    c4d: "لوحة تحليلات سلوكية داخلية تعرض مقاييس التفاعل الفوري وتقييم العملاء وأداء المحتوى وقمع التحويل.",
    c4tags: ["تحليلات فورية", "تقييم العملاء", "تتبع السلوك", "قمع التحويل", "اختبار A/B"],
    b5: "أتمتة الذكاء الاصطناعي", c5t: "خط مبيعات الذكاء الاصطناعي",
    c5d: "شاهد الذكاء الاصطناعي ينسّق Canva وGmail وGoogle Calendar وDocuSign لأتمتة خط المبيعات بالكامل — من الكتيبات المخصصة إلى الاتفاقيات الموقعة في أقل من دقيقتين.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "MCP"],
    howTitle: "كيف يعمل Dynamic NFC",
    howDesc: "حوّل كل نقطة اتصال مشتري إلى تفاعل مخصص",
    s1t: "انقر للاتصال", s1d: "المشتري ينقر هاتفه على سطح NFC في مركز المبيعات أو الوحدة النموذجية أو المواد التسويقية.",
    s2t: "تعرّف فوري", s2d: "النظام يتعرف على المشترين العائدين أو يلتقط عملاء جدد ويوجههم لبوابتهم المخصصة.",
    s3t: "تجربة مخصصة", s3d: "المحتوى يتكيف ديناميكياً مع تفضيلات المشتري ليعرض الوحدات والأسعار والمرافق المناسبة.",
    s4t: "تتبع وحسّن", s4d: "كل تفاعل يغذي لوحة التحليلات مما يمكّن فرق المبيعات من تحديد الأولويات وتخصيص المتابعة.",
    tech1: "تقنية NFC", tech2: "QR احتياطي", tech3: "تخصيص AI", tech4: "تكامل CRM",
    footer: "بيئة عرض لتقنية",
    footerLink: "Dynamic NFC",
    footerEnd: "عرض تقني. لا تتبع في هذه الصفحة.",
    langBtn: "English",
    homeBtn: "الرئيسية",
  },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

:root { --gw-red:#e63946;--gw-blue:#457b9d;--gw-blue-lt:#6ba3c7;--gw-ch:#1a1a1f;--gw-sl:#2d2d35;--gw-cream:#faf8f5;--gw-gl:rgba(0,0,0,0.03);--gw-glb:rgba(0,0,0,0.08); }
* { margin:0; padding:0; box-sizing:border-box; }
.gw { font-family:'Outfit',sans-serif; background:var(--gw-cream); color:var(--gw-ch); min-height:100vh; overflow-x:hidden; }
.gw a { text-decoration:none; color:inherit; }

/* Header */
.gw-hd { position:fixed; top:0; left:0; right:0; padding:1rem 4rem; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; z-index:100; backdrop-filter:blur(20px); background:rgba(250,248,245,0.92); border-bottom:1px solid var(--gw-glb); box-shadow:0 1px 12px rgba(0,0,0,0.04); }
.gw-logo { display:flex; align-items:center; gap:1rem; }
.gw-logo img { height:45px; }
.gw-badge { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; background:var(--gw-gl); border:1px solid var(--gw-glb); border-radius:50px; font-size:.85rem; color:var(--gw-blue); justify-self:center; font-weight:500; }
.gw-badge::before { content:''; width:8px; height:8px; background:var(--gw-red); border-radius:50%; animation:gw-pulse 2s infinite; }
@keyframes gw-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.2)} }
.gw-hd-right { display:flex; justify-content:flex-end; }
.gw-lang { background:none; border:1px solid var(--gw-glb); color:rgba(26,26,31,.6); padding:.4rem .9rem; border-radius:6px; font-family:'Outfit'; font-size:.8rem; cursor:pointer; transition:.3s; }
.gw-lang:hover { border-color:var(--gw-blue); color:var(--gw-ch); }
.gw-home { display:inline-flex; align-items:center; gap:.4rem; background:none; border:1px solid var(--gw-glb); color:rgba(26,26,31,.6); padding:.4rem .9rem; border-radius:6px; font-family:'Outfit'; font-size:.8rem; cursor:pointer; transition:.3s; text-decoration:none; }
.gw-home:hover { border-color:var(--gw-red); color:var(--gw-ch); }

/* Hero */
.gw-main { padding:7rem 4rem 4rem; max-width:1400px; margin:0 auto; }
.gw-hero { text-align:center; margin-bottom:5rem; animation:gw-fu 1s ease-out; }
@keyframes gw-fu { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

/* NFC Card Animation */
.gw-nfc { position:relative; width:140px; height:140px; margin:0 auto 2rem; }
.gw-nfc-card { position:absolute; inset:0; background:linear-gradient(135deg,#FFFFFF,#F0EDE8); border-radius:20px; border:1px solid var(--gw-glb); display:flex; align-items:center; justify-content:center; animation:gw-cp 3s infinite ease-in-out; box-shadow:0 8px 30px rgba(0,0,0,0.08); }
@keyframes gw-cp { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
.gw-nfc-waves { position:absolute; inset:-20px; }
.gw-nfc-wave { position:absolute; inset:0; border:2px solid var(--gw-blue); border-radius:28px; opacity:0; animation:gw-we 3s infinite ease-out; }
.gw-nfc-wave:nth-child(2) { animation-delay:1s; border-color:var(--gw-red); }
.gw-nfc-wave:nth-child(3) { animation-delay:2s; }
@keyframes gw-we { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(1.3);opacity:0} }

.gw-tagline { display:inline-flex; align-items:center; gap:.75rem; padding:.75rem 1.5rem; background:var(--gw-gl); border:1px solid var(--gw-glb); border-radius:50px; font-size:.9rem; color:var(--gw-blue); margin-bottom:2rem; }
.gw h1 { font-family:'Playfair Display',serif; font-size:clamp(2.5rem,6vw,4.5rem); font-weight:500; line-height:1.1; margin-bottom:1.5rem; color:var(--gw-ch); }
.gw-hero p { font-size:1.15rem; line-height:1.7; color:rgba(26,26,31,.6); max-width:700px; margin:0 auto 2.5rem; }

/* Stats */
.gw-stats { display:flex; justify-content:center; gap:4rem; flex-wrap:wrap; }
.gw-stat { text-align:center; }
.gw-stat-v { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:600; color:var(--gw-red); display:block; }
.gw-stat-l { font-size:.85rem; color:rgba(26,26,31,.45); text-transform:uppercase; letter-spacing:.1em; margin-top:.25rem; }

/* Section Header */
.gw-sh { display:flex; align-items:center; gap:1rem; margin-bottom:2rem; }
.gw-sh h2 { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:500; white-space:nowrap; color:var(--gw-ch); }
.gw-sh-line { flex:1; height:1px; background:linear-gradient(90deg,var(--gw-glb),transparent); }

/* Portal Cards */
.gw-grid { display:grid; gap:1.5rem; grid-template-columns:repeat(2,1fr); margin-bottom:4rem; }
.gw-card { position:relative; background:#FFFFFF; border:1px solid var(--gw-glb); border-radius:24px; padding:2rem; transition:all .4s cubic-bezier(.4,0,.2,1); cursor:pointer; overflow:hidden; display:block; box-shadow:0 2px 12px rgba(0,0,0,0.04); }
.gw-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--gw-red),var(--gw-blue)); opacity:0; transition:.4s; }
.gw-card:hover { transform:translateY(-8px); border-color:rgba(69,123,157,.2); box-shadow:0 20px 40px rgba(0,0,0,.1); }
.gw-card:hover::before { opacity:1; }
.gw-card.featured { grid-column:1/-1; background:linear-gradient(135deg,rgba(69,123,157,.06),#FFFFFF); }
.gw-card-badge { display:inline-flex; align-items:center; gap:.5rem; padding:.4rem .8rem; border-radius:50px; font-size:.75rem; font-weight:500; text-transform:uppercase; letter-spacing:.05em; margin-bottom:1rem; }
.gw-card-badge.red { background:rgba(230,57,70,.2); color:var(--gw-red); }
.gw-card-badge.blue { background:rgba(69,123,157,.2); color:var(--gw-blue-lt); }
.gw-card-badge.purple { background:rgba(124,58,237,.2); color:#7c3aed; }
.gw-card-avatar { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:600; margin-bottom:1.25rem; position:relative; }
.gw-card-avatar.gold { background:linear-gradient(135deg,var(--gw-red),#c1121f); }
.gw-card-avatar.blue { background:linear-gradient(135deg,var(--gw-blue),var(--gw-blue-lt)); }
.gw-card-icon { width:64px; height:64px; border-radius:16px; background:var(--gw-gl); border:1px solid var(--gw-glb); display:flex; align-items:center; justify-content:center; margin-bottom:1.25rem; font-size:1.8rem; }
.gw-card h3 { font-family:'Playfair Display',serif; font-size:1.35rem; font-weight:500; margin-bottom:.5rem; color:var(--gw-ch); }
.gw-card p { color:rgba(26,26,31,.55); font-size:.95rem; line-height:1.6; margin-bottom:1.5rem; }
.gw-card-tags { display:flex; flex-wrap:wrap; gap:.5rem; }
.gw-tag { padding:.35rem .75rem; background:rgba(26,26,31,.03); border:1px solid var(--gw-glb); border-radius:6px; font-size:.8rem; color:rgba(26,26,31,.6); }
.gw-card-arrow { position:absolute; bottom:2rem; inset-inline-end:2rem; width:40px; height:40px; border-radius:50%; background:var(--gw-gl); border:1px solid var(--gw-glb); display:flex; align-items:center; justify-content:center; color:var(--gw-blue); font-size:1.1rem; transition:.3s; }
.gw-card:hover .gw-card-arrow { background:var(--gw-blue); color:#fff; }

/* How It Works */
.gw-how { margin-top:5rem; padding:4rem; background:#FFFFFF; border:1px solid var(--gw-glb); border-radius:32px; box-shadow:0 4px 20px rgba(0,0,0,0.04); }
.gw-how h2 { font-family:'Playfair Display',serif; font-size:2rem; font-weight:500; text-align:center; margin-bottom:.75rem; color:var(--gw-ch); }
.gw-how > p { text-align:center; color:rgba(26,26,31,.55); margin-bottom:3rem; }
.gw-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; }
.gw-step { text-align:center; padding:1.5rem; }
.gw-step-n { width:56px; height:56px; margin:0 auto 1.25rem; background:linear-gradient(135deg,var(--gw-red),var(--gw-blue)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:600; }
.gw-step h4 { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:500; margin-bottom:.5rem; color:var(--gw-ch); }
.gw-step p { font-size:.9rem; color:rgba(26,26,31,.55); line-height:1.6; }

/* Tech Banner */
.gw-tech { margin-top:3rem; padding:2rem; background:linear-gradient(135deg,rgba(230,57,70,.1),rgba(69,123,157,.1)); border:1px solid rgba(69,123,157,.2); border-radius:16px; display:flex; align-items:center; justify-content:center; gap:3rem; flex-wrap:wrap; }
.gw-tech-item { display:flex; align-items:center; gap:.75rem; color:rgba(26,26,31,.6); font-size:.9rem; }
.gw-tech-item span { font-size:1.2rem; }

/* Footer */
.gw-ft { margin-top:5rem; padding:2rem 4rem; text-align:center; border-top:1px solid var(--gw-glb); }
.gw-ft p { font-size:.85rem; color:rgba(26,26,31,.4); }
.gw-ft a { color:var(--gw-blue); text-decoration:none; }

/* Particles */
.gw-particles { position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1; overflow:hidden; pointer-events:none; }
.gw-particle { position:absolute; width:2px; height:2px; border-radius:50%; opacity:.3; animation:gw-float 20s infinite ease-in-out; }
.gw-particle:nth-child(odd) { background:rgba(230,57,70,.3); }
.gw-particle:nth-child(even) { background:rgba(69,123,157,.3); }
@keyframes gw-float { 0%,100%{transform:translateY(0) translateX(0);opacity:.2} 50%{transform:translateY(-100px) translateX(50px);opacity:.4} }

/* Background */
.gw-bg { position:fixed; top:0; left:0; width:100%; height:100%; background:linear-gradient(rgba(250,248,245,.92),rgba(250,248,245,.85)),url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80'); background-size:cover; background-position:center; z-index:-2; }

/* Responsive */
@media(max-width:768px) {
  .gw-grid { grid-template-columns:1fr; }
  .gw-card.featured { grid-column:1/-1; }
  .gw-hd { padding:1rem 1.5rem; }
  .gw-main { padding:6rem 1.5rem 2rem; }
  .gw-how { padding:2rem 1.5rem; }
  .gw-steps { grid-template-columns:1fr 1fr; }
  .gw-stats { gap:2rem; }
  .gw-tech { gap:1.5rem; }
  .gw-ft { padding:2rem 1.5rem; }
}
@media(max-width:480px) {
  .gw-steps { grid-template-columns:1fr; }
}
`;

export default function CRMGateway() {
  const [lang, setLang] = useState("en");
  const t = T[lang];
  const particlesRef = useRef(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

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

  const portals = [
    { id: "khalid", path: "/enterprise/crmdemo/khalid", badge: t.b1, badgeCls: "red", avatar: "KR", avatarCls: "gold", title: t.c1t, desc: t.c1d, tags: t.c1tags },
    { id: "ahmed", path: "/enterprise/crmdemo/ahmed", badge: t.b2, badgeCls: "blue", avatar: "AF", avatarCls: "blue", title: t.c2t, desc: t.c2d, tags: t.c2tags },
    { id: "marketplace", path: "/enterprise/crmdemo/marketplace", badge: t.b3, badgeCls: "blue", icon: "🌐", title: t.c3t, desc: t.c3d, tags: t.c3tags },
    { id: "ai-demo", path: "/enterprise/crmdemo/ai-demo", badge: t.b5, badgeCls: "purple", icon: "🤖", title: t.c5t, desc: t.c5d, tags: t.c5tags, featured: true },
    { id: "dashboard", path: "/enterprise/crmdemo/dashboard", badge: t.b4, badgeCls: "red", icon: "📊", title: t.c4t, desc: t.c4d, tags: t.c4tags, featured: true },
  ];

  return (
    <div className="gw" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="gw-bg" />
      <div className="gw-particles" ref={particlesRef} />

      {/* Header */}
      <header className="gw-hd">
        <div className="gw-logo" />
        <div className="gw-badge"><span>{t.badge}</span></div>
        <div className="gw-hd-right" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Link to="/" className="gw-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t.homeBtn}
          </Link>
          <button className="gw-lang" onClick={() => setLang(lang === "en" ? "ar" : "en")}>{t.langBtn}</button>
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
          <p>{t.desc}</p>
          <div className="gw-stats">
            <div className="gw-stat"><span className="gw-stat-v">{t.stat1v}</span><span className="gw-stat-l">{t.stat1l}</span></div>
            <div className="gw-stat"><span className="gw-stat-v">{t.stat2v}</span><span className="gw-stat-l">{t.stat2l}</span></div>
            <div className="gw-stat"><span className="gw-stat-v">{t.stat3v}</span><span className="gw-stat-l">{t.stat3l}</span></div>
          </div>
        </section>

        {/* Portal Cards */}
        <div className="gw-sh"><h2>{t.sectionPortals}</h2><div className="gw-sh-line" /></div>
        <div className="gw-grid">
          {portals.map((p) => (
            <Link key={p.id} to={p.path} className={`gw-card ${p.featured ? "featured" : ""}`}>
              <div className={`gw-card-badge ${p.badgeCls}`}>{p.badge}</div>
              {p.avatar ? (
                <div className={`gw-card-avatar ${p.avatarCls}`}>{p.avatar}</div>
              ) : (
                <div className="gw-card-icon">{p.icon}</div>
              )}
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="gw-card-tags">{p.tags.map((tag, i) => <span className="gw-tag" key={i}>{tag}</span>)}</div>
              <div className="gw-card-arrow">→</div>
            </Link>
          ))}
        </div>

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

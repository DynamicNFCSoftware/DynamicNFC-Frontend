import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from '../../i18n';
import './PublicShowroom.css';
import { initSession, trackLegacy } from '../../services/firestoreTracking';


// ═══════════════════════════════════════════════════════════════════
// PUBLIC SHOWROOM — AUTOMOTIVE (Anonymous / Lead browsing)
// ═══════════════════════════════════════════════════════════════════
// Theme: Light Cream (#FAFAF8) + Red accent (#e63946) + Charcoal (#1A1A1F)
// Identity: Anonymous → Lead capture gate → Tracked lead
// Mirrors MarketplacePortal pattern with automotive adaptations
// Self-contained — zero external imports beyond react / react-router-dom
// ═══════════════════════════════════════════════════════════════════

import heroImg from "./assets/hero.jpg";
import amgGt63Img from "./assets/amg-gt63.jpg";
import amgC63Img from "./assets/amg-c63.jpg";
import amgSl63Img from "./assets/amg-sl63.jpg";
import g63Img from "./assets/g63.jpg";
import gls600Img from "./assets/gls600.jpg";
import gle53Img from "./assets/gle53.jpg";
import s580Img from "./assets/s580.jpg";
import maybachS680Img from "./assets/maybach-s680.jpg";
import eqs580Img from "./assets/eqs580.jpg";

// ─── SESSION & TRACKING ──────────────────────────────────────────
const _sessionId = (() => {
  let sid = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("dnfc_session") : null;
  if (!sid) { sid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`; try { sessionStorage.setItem("dnfc_session", sid); } catch(e) {} }
  return sid;
})();
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;
let _leadInfo = null;

const trackEvent = (event, data = {}) => {
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    sessionId: _sessionId,
    portal: "automotive",
    portalType: _leadInfo ? "lead" : "anonymous",
    ...(_leadInfo ? { leadName: _leadInfo.name, leadEmail: _leadInfo.email } : {}),
    event, ...data,
  };
  try {
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch(e) {}
  _bc?.postMessage(ev);
};

// ─── BILINGUAL ───────────────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { brand: "Prestige Motors", lang: "العربية", register: "Register / Login", account: "My Account" },
    hero: {
      badge: "Now Showing — 2025 Collection",
      title: "Prestige\nMotors",
      subtitle: "Explore our curated collection of luxury performance vehicles. From AMG track machines to executive sedans and premium SUVs.",
      cta: "Browse Collection",
      ctaSecondary: "Book Test Drive",
    },
    stats: [
      { value: "9", label: "Premium Models" },
      { value: "3", label: "Collections" },
      { value: "24/7", label: "Online Browse" },
      { value: "VIP", label: "Test Drives" },
    ],
    sections: {
      vehicles: "Available Vehicles", vehiclesSub: "Find Your Perfect Machine",
      why: "The Experience", whySub: "Why Choose Prestige Motors",
      cta: "Ready to Find Your Perfect Vehicle?",
      ctaSub: "Register for exclusive pricing, detailed specs, brochures, and VIP test drive appointments.",
    },
    filters: { all: "All", performance: "AMG Performance", suv: "Luxury SUV", sedan: "Executive Sedan" },
    card: { registerPrice: "Register for exact pricing", details: "View Details", getPricing: "Get Pricing" },
    vehicleActions: { brochure: "Brochure", pricing: "Get Pricing", book: "Test Drive", compare: "Compare" },
    compareModal: {
      title: "Compare Vehicles", feature: "Feature", remove: "Remove",
      price: "Price Range", hp: "Horsepower", accel: "0-100 km/h",
      topSpeed: "Top Speed", collection: "Collection", status: "Status",
      empty: "Add vehicles to compare using the compare button on vehicle cards.",
    },
    leadForm: {
      title: "Get Full Access",
      subtitle: "Register to unlock exact pricing, detailed specs, brochures, and VIP test drive appointments.",
      name: "Full Name", email: "Email", phone: "Phone",
      submit: "Register & Continue",
      note: "Your information is protected. No spam, ever.",
    },
    whyCards: [
      { icon: "🏆", title: "Expert Advisors", desc: "Certified Mercedes-AMG specialists with decades of experience." },
      { icon: "✅", title: "Certified Pre-Owned", desc: "Every vehicle undergoes 200+ point inspection and certification." },
      { icon: "💳", title: "Flexible Finance", desc: "Tailored payment plans and competitive financing options." },
      { icon: "⭐", title: "VIP Service", desc: "Dedicated concierge, home delivery, and lifetime support." },
    ],
    toast: {
      brochure: "Brochure downloaded",
      pricing: "Pricing details sent to your email",
      booking: "Test drive request sent — we'll contact you within 24 hours",
      compare: "Added to comparison", compareRemove: "Removed from comparison",
      registered: "You're already registered!",
      leadCaptured: "Thank you! Processing your request...",
    },
    footer: "Public listing. Prices shown are starting ranges. Register for detailed pricing and availability.",
    poweredBy: "Powered by", registerNow: "Register Now", registerDone: "Registered",
    detailCta: "Register for Full Details",
  },
  ar: {
    dir: "rtl",
    nav: { brand: "بريستيج موتورز", lang: "English", register: "تسجيل / دخول", account: "حسابي" },
    hero: {
      badge: "معرض حالي — مجموعة ٢٠٢٥",
      title: "بريستيج\nموتورز",
      subtitle: "استكشف مجموعتنا المنتقاة من سيارات الأداء الفاخرة. من آلات AMG للحلبات إلى سيدان تنفيذية وSUV فاخرة.",
      cta: "تصفح المجموعة",
      ctaSecondary: "احجز تجربة قيادة",
    },
    stats: [
      { value: "٩", label: "طراز فاخر" },
      { value: "٣", label: "مجموعات" },
      { value: "٢٤/٧", label: "تصفح مباشر" },
      { value: "VIP", label: "تجارب قيادة" },
    ],
    sections: {
      vehicles: "السيارات المتاحة", vehiclesSub: "اعثر على سيارتك المثالية",
      why: "التجربة", whySub: "لماذا بريستيج موتورز",
      cta: "مستعد لإيجاد سيارتك المثالية؟",
      ctaSub: "سجّل للحصول على أسعار حصرية ومواصفات تفصيلية وكتيبات ومواعيد تجربة قيادة VIP.",
    },
    filters: { all: "الكل", performance: "AMG أداء", suv: "SUV فاخر", sedan: "سيدان تنفيذية" },
    card: { registerPrice: "سجّل للحصول على السعر", details: "التفاصيل", getPricing: "احصل على السعر" },
    vehicleActions: { brochure: "الكتيب", pricing: "السعر الدقيق", book: "تجربة قيادة", compare: "مقارنة" },
    compareModal: {
      title: "مقارنة السيارات", feature: "الميزة", remove: "إزالة",
      price: "نطاق السعر", hp: "القوة الحصانية", accel: "٠-١٠٠ كم/س",
      topSpeed: "السرعة القصوى", collection: "المجموعة", status: "الحالة",
      empty: "أضف سيارات للمقارنة باستخدام زر المقارنة في بطاقات السيارات.",
    },
    leadForm: {
      title: "احصل على وصول كامل",
      subtitle: "سجّل لفتح الأسعار الدقيقة والمواصفات والكتيبات ومواعيد تجربة القيادة.",
      name: "الاسم الكامل", email: "البريد", phone: "الهاتف",
      submit: "سجّل واستمر",
      note: "معلوماتك محمية. لا رسائل مزعجة.",
    },
    whyCards: [
      { icon: "🏆", title: "مستشارون خبراء", desc: "متخصصون معتمدون في مرسيدس-AMG بعقود من الخبرة." },
      { icon: "✅", title: "معتمدة مسبقاً", desc: "كل سيارة تخضع لفحص ٢٠٠+ نقطة وشهادة اعتماد." },
      { icon: "💳", title: "تمويل مرن", desc: "خطط دفع مخصصة وخيارات تمويل تنافسية." },
      { icon: "⭐", title: "خدمة VIP", desc: "كونسيرج مخصص وتوصيل للمنزل ودعم مدى الحياة." },
    ],
    toast: {
      brochure: "تم تحميل الكتيب",
      pricing: "تفاصيل الأسعار أُرسلت لبريدك",
      booking: "تم إرسال طلب تجربة القيادة — سنتواصل خلال ٢٤ ساعة",
      compare: "تمت الإضافة للمقارنة", compareRemove: "تمت الإزالة من المقارنة",
      registered: "أنت مسجّل بالفعل!",
      leadCaptured: "شكراً! جارٍ معالجة طلبك...",
    },
    footer: "إدراج عام. الأسعار المعروضة هي نطاقات بدء. سجل للحصول على الأسعار التفصيلية والتوافر.",
    poweredBy: "مشغل بواسطة", registerNow: "سجل الآن", registerDone: "مسجل",
    detailCta: "سجّل للحصول على التفاصيل الكاملة",
  },
};

// ─── VEHICLE DATA ────────────────────────────────────────────────
const VEHICLES = [
  { id: "amg-gt63", name: { en: "AMG GT 63 S E Performance", ar: "AMG GT 63 S E بيرفورمانس" }, collection: "performance", image: amgGt63Img, priceRange: { en: "From $240K", ar: "من ٢٤٠ ألف$" }, specs: { hp: "831 HP", accel: "2.9s", topSpeed: "316 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "amg-c63", name: { en: "AMG C 63 S E Performance", ar: "AMG C 63 S E بيرفورمانس" }, collection: "performance", image: amgC63Img, priceRange: { en: "From $120K", ar: "من ١٢٠ ألف$" }, specs: { hp: "671 HP", accel: "3.4s", topSpeed: "280 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "amg-sl63", name: { en: "AMG SL 63 4MATIC+", ar: "AMG SL 63 4MATIC+" }, collection: "performance", image: amgSl63Img, priceRange: { en: "From $195K", ar: "من ١٩٥ ألف$" }, specs: { hp: "577 HP", accel: "3.6s", topSpeed: "315 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "g63", name: { en: "Mercedes-AMG G 63", ar: "مرسيدس-AMG G 63" }, collection: "suv", image: g63Img, priceRange: { en: "From $220K", ar: "من ٢٢٠ ألف$" }, specs: { hp: "577 HP", accel: "4.5s", topSpeed: "220 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "gls600", name: { en: "Mercedes-Maybach GLS 600", ar: "مرسيدس-مايباخ GLS 600" }, collection: "suv", image: gls600Img, priceRange: { en: "From $280K", ar: "من ٢٨٠ ألف$" }, specs: { hp: "550 HP", accel: "4.9s", topSpeed: "250 km/h" }, status: "reserved", statusColor: "#C1121F" },
  { id: "gle53", name: { en: "AMG GLE 53 Coupe", ar: "AMG GLE 53 كوبيه" }, collection: "suv", image: gle53Img, priceRange: { en: "From $130K", ar: "من ١٣٠ ألف$" }, specs: { hp: "429 HP", accel: "5.3s", topSpeed: "250 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "s580", name: { en: "Mercedes-Benz S 580", ar: "مرسيدس-بنز S 580" }, collection: "sedan", image: s580Img, priceRange: { en: "From $170K", ar: "من ١٧٠ ألف$" }, specs: { hp: "496 HP", accel: "4.4s", topSpeed: "250 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "maybach-s680", name: { en: "Mercedes-Maybach S 680", ar: "مرسيدس-مايباخ S 680" }, collection: "sedan", image: maybachS680Img, priceRange: { en: "From $375K", ar: "من ٣٧٥ ألف$" }, specs: { hp: "621 HP", accel: "4.5s", topSpeed: "250 km/h" }, status: "available", statusColor: "#2A9D5C" },
  { id: "eqs580", name: { en: "EQS 580 4MATIC", ar: "EQS 580 4MATIC" }, collection: "sedan", image: eqs580Img, priceRange: { en: "From $160K", ar: "من ١٦٠ ألف$" }, specs: { hp: "516 HP", accel: "4.1s", topSpeed: "210 km/h" }, status: "available", statusColor: "#2A9D5C" },
];

const COLLECTION_LABELS = {
  performance: { en: "AMG Performance", ar: "AMG أداء" },
  suv: { en: "Luxury SUV", ar: "SUV فاخر" },
  sedan: { en: "Executive Sedan", ar: "سيدان تنفيذية" },
};

const STATUS_LABELS = { available: { en: "Available", ar: "متاح" }, reserved: { en: "Reserved", ar: "محجوز" } };


// ─── COMPONENT ───────────────────────────────────────────────────
export default function PublicShowroom() {
  const { lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const [lead, setLead] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [filter, setFilter] = useState("all");

  const vehRef = useRef(null);
  const t = LANG[lang];


  // Scroll listener
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".ps-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, selectedVehicle, showCompare, showLeadForm]);

  // Track visit
  useEffect(() => { trackEvent("showroom_visit"); initSession({ cardId: null, visitorType: 'anonymous', visitorName: null, portalName: 'Auto Showroom' }); }, []);

  const showToastMsg = useCallback((msg) => { setToastHiding(false); setToast(msg); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);

  // Lead gate
  const requireLead = (action) => {
    if (lead) { action(); return; }
    setPendingAction(() => action);
    setShowLeadForm(true);
    trackEvent("lead_form_shown", { trigger: "high_intent_action" }); trackLegacy('lead_form_shown', { trigger: 'high_intent_action' });
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const name = e.target.leadName.value;
    const email = e.target.leadEmail.value;
    const phone = e.target.leadPhone.value;
    const newLead = { name, email, phone };
    setLead(newLead);
    _leadInfo = newLead;
    setShowLeadForm(false);
    trackEvent("lead_captured", { portalType: "lead", leadName: name, leadEmail: email }); trackLegacy('lead_captured', { leadName: name, leadEmail: email });
    showToastMsg(t.toast.leadCaptured);
    if (pendingAction) { setTimeout(pendingAction, 500); setPendingAction(null); }
  };

  // Compare
  const toggleCompare = (vehicleId) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) { showToastMsg(t.toast.compareRemove); return prev.filter((id) => id !== vehicleId); }
      if (prev.length >= 3) return prev;
      trackEvent("comparison_add", { vehicleId }); trackLegacy('compare_add', { vehicleId });
      showToastMsg(t.toast.compare);
      return [...prev, vehicleId];
    });
  };

  // Actions
  const openDetail = (v) => { setSelectedVehicle(v); trackEvent("view_vehicle", { vehicleId: v.id, vehicleName: v.name.en }); trackLegacy('view_vehicle', { vehicleId: v.id, vehicleName: v.name.en }); };
  const reqPricing = (v) => requireLead(() => { trackEvent("request_pricing", { vehicleId: v.id }); trackLegacy('request_pricing', { vehicleId: v.id }); showToastMsg(t.toast.pricing); });
  const openBrochure = (v) => requireLead(() => { trackEvent("download_brochure", { vehicleId: v.id }); trackLegacy('download_brochure', { vehicleId: v.id }); showToastMsg(t.toast.brochure); });
  const handleBooking = (v) => requireLead(() => { trackEvent("book_test_drive", { vehicleId: v?.id || "general" }); trackLegacy('book_test_drive', { vehicleId: v?.id || 'general' }); showToastMsg(t.toast.booking); });
  const openCompareModal = () => requireLead(() => { setShowCompare(true); });
  const closeAll = () => { setSelectedVehicle(null); setShowCompare(false); };

  const filteredVehicles = filter === "all" ? VEHICLES : VEHICLES.filter(v => v.collection === filter);

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="ps" dir={t.dir}>
      {/* HEADER */}
      <header className={`ps-hd ${scrolled ? "sc" : ""}`}>
        <div className="ps-logo">Prestige <b>Motors</b></div>
        <div className="ps-nav">
          {lead && <span className="ps-lead-badge">{lead.name}</span>}
          {compareList.length > 0 && (
            <button className="ps-navbtn" onClick={openCompareModal}>
              {t.vehicleActions.compare}<span className="ps-cmp-count">{compareList.length}</span>
            </button>
          )}
          <button className="ps-navbtn-dark" onClick={() => { if (!lead) setShowLeadForm(true); else showToastMsg(t.toast.registered); }}>
            {lead ? t.nav.account : t.nav.register}
          </button>
        </div>
      </header>

      {/* CROSS-NAV */}
      <div className="ps-crossnav" style={{ top: scrolled ? "52px" : "-40px" }}>
        <a href="/automotive/demo" target="_blank" rel="noopener noreferrer">&#8592; Back to Demo Hub</a>
        <a href="/automotive/demo/khalid" target="_blank" rel="noopener noreferrer">VIP Performance</a>
        <a href="/automotive/demo/sultan" target="_blank" rel="noopener noreferrer">VIP Family</a>
        <span className="active">Public Showroom</span>
        <a href="/automotive/dashboard" target="_blank" rel="noopener noreferrer">Dashboard</a>
        <a href="/automotive/demo/ai" target="_blank" rel="noopener noreferrer">AI Pipeline</a>
      </div>

      {/* HERO */}
      <section className="ps-hero">
        <div className="ps-hero-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="ps-hero-ov" />
        <div className="ps-hero-ct">
          <div className="ps-pvt">{t.hero.badge}</div>
          <h1 className="ps-htitle">{lang === "en" ? (<>Prestige<br />Motors</>) : (<>بريستيج<br />موتورز</>)}</h1>
          <p className="ps-hdesc">{t.hero.subtitle}</p>
          <div className="ps-hacts">
            <button className="ps-btn-accent" onClick={() => { trackEvent("cta_browse"); trackLegacy('cta_browse', {}); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} &#8594;</button>
            <button className="ps-btn-l" onClick={() => handleBooking()}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ps-stats">
        {t.stats.map((s, i) => (
          <div className="ps-stat" key={i}>
            <div className="ps-stat-v">{s.value}</div>
            <div className="ps-stat-l">{s.label}</div>
          </div>
        ))}
      </div>

      {/* VEHICLES */}
      <section className="ps-sec" ref={vehRef} style={{ background: "var(--ps-warm)" }}>
        <div className="ps-sh ps-rv">
          <span className="ps-sl">{t.sections.vehicles}</span>
          <h2 className="ps-st">{t.sections.vehiclesSub}</h2>
          <div className="ps-filters">
            {[
              { key: "all", l: t.filters.all },
              { key: "performance", l: t.filters.performance },
              { key: "suv", l: t.filters.suv },
              { key: "sedan", l: t.filters.sedan },
            ].map(f => (
              <button key={f.key} className={`ps-ftab ${filter === f.key ? "on" : "off"}`} onClick={() => { setFilter(f.key); trackEvent("filter_vehicles", { filter: f.key }); trackLegacy('filter_vehicles', { filter: f.key }); }}>{f.l}</button>
            ))}
          </div>
        </div>
        <div className="ps-units">
          {filteredVehicles.map((v) => (
            <div className="ps-card ps-rv" key={v.id} onClick={() => openDetail(v)}>
              <div className="ps-card-img">
                <img src={v.image} alt={v.name[lang]} loading="lazy" />
                <div className="ps-card-fbadge">{COLLECTION_LABELS[v.collection]?.[lang]}</div>
                <div className="ps-card-status" style={{ background: v.statusColor }}>{STATUS_LABELS[v.status]?.[lang]}</div>
              </div>
              <div className="ps-card-body">
                <h3 className="ps-card-name">{v.name[lang]}</h3>
                <div className="ps-card-specs">
                  <span>{v.specs.hp}</span>
                  <span>0-100: {v.specs.accel}</span>
                  <span>{v.specs.topSpeed}</span>
                </div>
                <div className="ps-card-price">{v.priceRange[lang]}</div>
                <div className="ps-card-hint">{t.card.registerPrice}</div>
              </div>
              <div className="ps-card-acts" onClick={(e) => e.stopPropagation()}>
                <button className="ps-btn-accent ps-btn-sm" onClick={() => reqPricing(v)}>{t.vehicleActions.pricing}</button>
                <button className="ps-btn-l ps-btn-sm" onClick={() => openBrochure(v)}>{t.vehicleActions.brochure}</button>
                <button className="ps-btn-l ps-btn-sm" onClick={() => toggleCompare(v.id)} style={compareList.includes(v.id) ? { borderColor: "var(--ps-ch) !important", fontWeight: 600 } : {}}>
                  {compareList.includes(v.id) ? `✓ ${t.vehicleActions.compare}` : t.vehicleActions.compare}
                </button>
                <button className="ps-btn-l ps-btn-sm" onClick={() => handleBooking(v)}>{t.vehicleActions.book}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ps-div"><div className="ps-div-l" /><div className="ps-div-d">&#9670;</div><div className="ps-div-l" /></div>

      {/* WHY CHOOSE */}
      <section className="ps-sec">
        <div className="ps-sh ps-rv">
          <span className="ps-sl">{t.sections.why}</span>
          <h2 className="ps-st">{t.sections.whySub}</h2>
        </div>
        <div className="ps-why-grid">
          {t.whyCards.map((card, i) => (
            <div className="ps-why ps-rv" key={i}>
              <div className="ps-why-icon">{card.icon}</div>
              <div className="ps-why-title">{card.title}</div>
              <div className="ps-why-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="ps-div"><div className="ps-div-l" /><div className="ps-div-d">&#9670;</div><div className="ps-div-l" /></div>

      {/* CTA BANNER */}
      <section className="ps-cta-banner ps-rv">
        <h2 style={{ fontFamily: "var(--ps-serif)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#FAFAF8", marginBottom: ".8rem" }}>{t.sections.cta}</h2>
        <p style={{ color: "rgba(250,250,248,.6)", fontSize: ".95rem", fontWeight: 400, maxWidth: "500px", margin: "0 auto 2rem" }}>{t.sections.ctaSub}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button style={{ all: "unset", padding: ".9rem 2.5rem", background: "#e63946", color: "#fff", fontSize: ".82rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", boxSizing: "border-box" }} onClick={() => { if (!lead) setShowLeadForm(true); else showToastMsg(t.toast.registered); }}>
            {lead ? `✓ ${t.registerDone}` : `${t.registerNow} →`}
          </button>
          <button style={{ all: "unset", padding: ".9rem 2.5rem", background: "transparent", color: "#FAFAF8", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase", border: "1px solid rgba(250,250,248,.25)", borderRadius: "4px", cursor: "pointer", boxSizing: "border-box" }} onClick={() => handleBooking()}>
            {t.hero.ctaSecondary}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ps-ft">
        <p>{t.footer}</p>
        <p style={{ fontSize: ".72rem", color: "var(--ps-t3)" }}>{t.poweredBy} <span style={{ fontFamily: "var(--ps-serif)", fontWeight: 500 }}>Dynamic NFC</span></p>
      </footer>

      {/* ══════════ MODALS ══════════ */}

      {/* VEHICLE DETAIL */}
      {selectedVehicle && (
        <div className="ps-modal-ov" onClick={closeAll}>
          <div className="ps-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ps-modal-x" onClick={closeAll}>&#10005;</button>
            <div style={{ height: 300, overflow: "hidden" }}>
              <img src={selectedVehicle.image} alt={selectedVehicle.name[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="ps-modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--ps-serif)", fontSize: "2.2rem", fontWeight: 500, color: "var(--ps-t1)" }}>{selectedVehicle.name[lang]}</h2>
                  <p style={{ color: "var(--ps-t3)", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{COLLECTION_LABELS[selectedVehicle.collection]?.[lang]}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div style={{ fontFamily: "var(--ps-serif)", fontSize: "1.8rem", fontWeight: 500, color: "var(--ps-t1)" }}>{selectedVehicle.priceRange[lang]}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--ps-t3)" }}>{t.card.registerPrice}</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { l: lang === "en" ? "Horsepower" : "القوة الحصانية", v: selectedVehicle.specs.hp },
                  { l: lang === "en" ? "0-100 km/h" : "٠-١٠٠ كم/س", v: selectedVehicle.specs.accel },
                  { l: lang === "en" ? "Top Speed" : "السرعة القصوى", v: selectedVehicle.specs.topSpeed },
                  { l: lang === "en" ? "Status" : "الحالة", v: STATUS_LABELS[selectedVehicle.status]?.[lang], isSt: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "1rem", border: "1px solid var(--ps-bdr)", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ps-t3)", marginBottom: ".3rem" }}>{item.l}</div>
                    {item.isSt
                      ? <div style={{ color: "#fff", fontSize: ".9rem", background: selectedVehicle.statusColor, display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontWeight: 600 }}>{item.v}</div>
                      : <div style={{ fontFamily: "var(--ps-serif)", fontSize: "1.2rem", color: "var(--ps-t1)" }}>{item.v}</div>
                    }
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", paddingTop: "1.5rem", borderTop: "1px solid var(--ps-bdr)" }}>
                <button className="ps-btn-accent ps-btn-sm" onClick={() => { closeAll(); reqPricing(selectedVehicle); }}>{t.vehicleActions.pricing}</button>
                <button className="ps-btn-l ps-btn-sm" onClick={() => { closeAll(); openBrochure(selectedVehicle); }}>{t.vehicleActions.brochure}</button>
                <button className="ps-btn-l ps-btn-sm" onClick={() => { closeAll(); handleBooking(selectedVehicle); }}>{t.vehicleActions.book}</button>
                <button className="ps-btn-d ps-btn-sm" onClick={() => { closeAll(); if (!lead) setShowLeadForm(true); }}>{t.detailCta}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARE MODAL */}
      {showCompare && (
        <div className="ps-modal-ov" onClick={closeAll}>
          <div className="ps-modal" style={{ maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
            <button className="ps-modal-x" onClick={closeAll}>&#10005;</button>
            <div className="ps-modal-body">
              <h2 style={{ fontFamily: "var(--ps-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compareModal.title}</h2>
              {compareList.length === 0 ? (
                <div className="ps-cmp-empty">{t.compareModal.empty}</div>
              ) : (() => {
                const vehicles = compareList.map((id) => VEHICLES.find((v) => v.id === id)).filter(Boolean);
                const cols = `180px repeat(${vehicles.length}, 1fr)`;
                const rows = [
                  { label: t.compareModal.price, get: (v) => v.priceRange[lang] },
                  { label: t.compareModal.hp, get: (v) => v.specs.hp },
                  { label: t.compareModal.accel, get: (v) => v.specs.accel },
                  { label: t.compareModal.topSpeed, get: (v) => v.specs.topSpeed },
                  { label: t.compareModal.collection, get: (v) => COLLECTION_LABELS[v.collection]?.[lang] },
                  { label: t.compareModal.status, get: (v) => STATUS_LABELS[v.status]?.[lang] },
                ];
                return (
                  <>
                    {/* Header row */}
                    <div className="ps-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compareModal.feature}</div>
                      {vehicles.map((v) => (
                        <div key={v.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--ps-serif)", fontSize: ".95rem", fontWeight: 500, color: "var(--ps-t1)", marginBottom: ".3rem" }}>{v.name[lang]}</div>
                          <button className="ps-cmp-rm" onClick={() => toggleCompare(v.id)}>{t.compareModal.remove}</button>
                        </div>
                      ))}
                    </div>
                    {/* Image row */}
                    <div className="ps-cmp-row" style={{ gridTemplateColumns: cols }}>
                      <div />
                      {vehicles.map((v) => (
                        <div key={v.id} style={{ textAlign: "center", padding: ".5rem" }}>
                          <img src={v.image} alt={v.name[lang]} style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px" }} />
                        </div>
                      ))}
                    </div>
                    {/* Data rows */}
                    {rows.map((row, i) => (
                      <div className="ps-cmp-row" key={i} style={{ gridTemplateColumns: cols }}>
                        <div className="ps-cmp-label">{row.label}</div>
                        {vehicles.map((v) => <div className="ps-cmp-val" key={v.id}>{row.get(v)}</div>)}
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* LEAD CAPTURE FORM */}
      {showLeadForm && (
        <div className="ps-lead-ov" onClick={() => { setShowLeadForm(false); setPendingAction(null); }}>
          <div className="ps-lead-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "var(--ps-serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>{t.leadForm.title}</h2>
            <p style={{ color: "var(--ps-t2)", fontSize: ".9rem", marginBottom: "2rem", lineHeight: 1.5 }}>{t.leadForm.subtitle}</p>
            <form onSubmit={handleLeadSubmit}>
              <div style={{ marginBottom: "1.2rem" }}>
                <label className="ps-lead-label">{t.leadForm.name}</label>
                <input className="ps-lead-input" name="leadName" required placeholder={lang === "en" ? "e.g. Ahmed Al-Rashid" : "مثال: أحمد الراشد"} />
              </div>
              <div style={{ marginBottom: "1.2rem" }}>
                <label className="ps-lead-label">{t.leadForm.email}</label>
                <input className="ps-lead-input" name="leadEmail" type="email" required placeholder={lang === "en" ? "your@email.com" : "بريدك@مثال.com"} />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <label className="ps-lead-label">{t.leadForm.phone}</label>
                <input className="ps-lead-input" name="leadPhone" type="tel" placeholder={lang === "en" ? "+971 XX XXX XXXX" : "+٩٧١ XX XXX XXXX"} />
              </div>
              <button className="ps-btn-accent" type="submit" style={{ width: "100%", justifyContent: "center" }}>{t.leadForm.submit}</button>
              <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--ps-t3)", marginTop: "1rem" }}>{t.leadForm.note}</p>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className={`ps-toast ${toastHiding ? "hiding" : ""}`}>{toast}</div>}
    </div>
  );
}

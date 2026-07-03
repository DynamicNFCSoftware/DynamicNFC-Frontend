import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import { usePortalVehicles } from "../../hooks/usePortalVehicles";
import { COLLECTION_LABELS, STATUS_LABELS, vName } from "../../data/automotiveVehicleData";
import './PublicShowroom.css';
import SEO from '../../components/SEO/SEO';
// ═══════════════════════════════════════════════════════════════════
// PUBLIC SHOWROOM — AUTOMOTIVE (Anonymous / Lead browsing)
// ═══════════════════════════════════════════════════════════════════
// Theme: Light Cream (#FAFAF8) + Red accent (#e63946) + Charcoal (#1A1A1F)
// Identity: Anonymous → Lead capture gate → Tracked lead
// Region-aware via usePortalRegion + usePortalVehicles (4-region parity)
// ═══════════════════════════════════════════════════════════════════

import heroImg from "./assets/hero.jpg";

// ─── SESSION & TRACKING ──────────────────────────────────────────
const _sessionId = (() => {
  let sid = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("dnfc_session") : null;
  if (!sid) { sid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`; try { sessionStorage.setItem("dnfc_session", sid); } catch(e) {} }
  return sid;
})();
// ─── i18n (inline — en/ar/es/fr) ─────────────────────────────────
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };
const LANG = {
  en: {
    dir: "ltr",
    nav: { brand: "Prestige Motors", lang: "العربية", register: "Register / Login", account: "My Account" },
    crossnav: { hub: "Back to Demo Hub", vipPerf: "VIP Performance", vipFamily: "VIP Family", showroom: "Public Showroom", dashboard: "Dashboard", ai: "AI Pipeline", visitor: "Public Visitor" },
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
    filters: { all: "All", performance: "AMG Performance", suv: "Luxury SUV", sedan: "Executive Sedan", ev: "Electric" },
    card: { registerPrice: "Register for exact pricing", details: "View Details", getPricing: "Get Pricing", from: "From" },
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
      namePh: "e.g. Ahmed Al-Rashid", emailPh: "your@email.com", phonePh: "+971 XX XXX XXXX",
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
    crossnav: { hub: "العودة لمركز العرض", vipPerf: "VIP أداء", vipFamily: "VIP عائلي", showroom: "صالة العرض", dashboard: "لوحة التحكم", ai: "خط أنابيب الذكاء", visitor: "زائر عام" },
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
    filters: { all: "الكل", performance: "AMG أداء", suv: "SUV فاخر", sedan: "سيدان تنفيذية", ev: "كهربائية" },
    card: { registerPrice: "سجّل للحصول على السعر", details: "التفاصيل", getPricing: "احصل على السعر", from: "من" },
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
      namePh: "مثال: أحمد الراشد", emailPh: "بريدك@مثال.com", phonePh: "+٩٧١ XX XXX XXXX",
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
  es: {
    dir: "ltr",
    nav: { brand: "Prestige Motors", lang: "English", register: "Registrarse / Entrar", account: "Mi Cuenta" },
    crossnav: { hub: "Volver al Centro Demo", vipPerf: "VIP Rendimiento", vipFamily: "VIP Familiar", showroom: "Sala Pública", dashboard: "Panel", ai: "Pipeline IA", visitor: "Visitante Público" },
    hero: {
      badge: "En Exhibición — Colección 2025",
      title: "Prestige\nMotors",
      subtitle: "Explore nuestra colección curada de vehículos de alto rendimiento. Desde máquinas AMG hasta sedanes ejecutivos y SUV premium.",
      cta: "Ver Colección",
      ctaSecondary: "Reservar Prueba",
    },
    stats: [
      { value: "9", label: "Modelos Premium" },
      { value: "3", label: "Colecciones" },
      { value: "24/7", label: "Navegación Online" },
      { value: "VIP", label: "Pruebas de Manejo" },
    ],
    sections: {
      vehicles: "Vehículos Disponibles", vehiclesSub: "Encuentre Su Máquina Perfecta",
      why: "La Experiencia", whySub: "Por Qué Elegir Prestige Motors",
      cta: "¿Listo para Encontrar Su Vehículo Perfecto?",
      ctaSub: "Regístrese para precios exclusivos, especificaciones detalladas, folletos y citas VIP de prueba de manejo.",
    },
    filters: { all: "Todos", performance: "AMG Performance", suv: "SUV de Lujo", sedan: "Sedán Ejecutivo", ev: "Eléctrico" },
    card: { registerPrice: "Regístrese para el precio exacto", details: "Ver Detalles", getPricing: "Obtener Precio", from: "Desde" },
    vehicleActions: { brochure: "Folleto", pricing: "Obtener Precio", book: "Prueba", compare: "Comparar" },
    compareModal: {
      title: "Comparar Vehículos", feature: "Característica", remove: "Quitar",
      price: "Precio", hp: "Potencia", accel: "0-100 km/h",
      topSpeed: "Vel. Máxima", collection: "Colección", status: "Estado",
      empty: "Añada vehículos para comparar con el botón comparar en las tarjetas.",
    },
    leadForm: {
      title: "Obtenga Acceso Completo",
      subtitle: "Regístrese para desbloquear precios exactos, especificaciones, folletos y citas VIP de prueba de manejo.",
      name: "Nombre Completo", email: "Email", phone: "Teléfono",
      namePh: "ej. Ahmed Al-Rashid", emailPh: "tu@email.com", phonePh: "+52 XX XXXX XXXX",
      submit: "Registrarse y Continuar",
      note: "Su información está protegida. Sin spam, nunca.",
    },
    whyCards: [
      { icon: "🏆", title: "Asesores Expertos", desc: "Especialistas certificados Mercedes-AMG con décadas de experiencia." },
      { icon: "✅", title: "Certificado Pre-Owned", desc: "Cada vehículo pasa una inspección de más de 200 puntos." },
      { icon: "💳", title: "Financiación Flexible", desc: "Planes de pago a medida y opciones de financiación competitivas." },
      { icon: "⭐", title: "Servicio VIP", desc: "Conserje dedicado, entrega a domicilio y soporte de por vida." },
    ],
    toast: {
      brochure: "Folleto descargado",
      pricing: "Detalles de precio enviados a su email",
      booking: "Solicitud de prueba enviada — le contactaremos en 24 horas",
      compare: "Añadido a comparación", compareRemove: "Eliminado de comparación",
      registered: "¡Ya está registrado!",
      leadCaptured: "¡Gracias! Procesando su solicitud...",
    },
    footer: "Listado público. Los precios mostrados son rangos iniciales. Regístrese para precios detallados y disponibilidad.",
    poweredBy: "Desarrollado por", registerNow: "Registrarse", registerDone: "Registrado",
    detailCta: "Regístrese para Detalles Completos",
  },
  fr: {
    dir: "ltr",
    nav: { brand: "Prestige Motors", lang: "English", register: "S'inscrire / Connexion", account: "Mon Compte" },
    crossnav: { hub: "Retour au Hub Démo", vipPerf: "VIP Performance", vipFamily: "VIP Famille", showroom: "Salle Publique", dashboard: "Tableau de bord", ai: "Pipeline IA", visitor: "Visiteur Public" },
    hero: {
      badge: "À l'Affiche — Collection 2025",
      title: "Prestige\nMotors",
      subtitle: "Découvrez notre collection de véhicules de performance de luxe. Des machines AMG aux berlines exécutives et SUV premium.",
      cta: "Voir la Collection",
      ctaSecondary: "Réserver un Essai",
    },
    stats: [
      { value: "9", label: "Modèles Premium" },
      { value: "3", label: "Collections" },
      { value: "24/7", label: "Navigation En Ligne" },
      { value: "VIP", label: "Essais Routiers" },
    ],
    sections: {
      vehicles: "Véhicules Disponibles", vehiclesSub: "Trouvez Votre Machine Parfaite",
      why: "L'Expérience", whySub: "Pourquoi Choisir Prestige Motors",
      cta: "Prêt à Trouver Votre Véhicule Parfait ?",
      ctaSub: "Inscrivez-vous pour des prix exclusifs, des specs détaillées, des brochures et des rendez-vous d'essai VIP.",
    },
    filters: { all: "Tous", performance: "AMG Performance", suv: "SUV de Luxe", sedan: "Berline Exécutive", ev: "Électrique" },
    card: { registerPrice: "Inscrivez-vous pour le prix exact", details: "Voir Détails", getPricing: "Obtenir le Prix", from: "À partir de" },
    vehicleActions: { brochure: "Brochure", pricing: "Obtenir le Prix", book: "Essai", compare: "Comparer" },
    compareModal: {
      title: "Comparer les Véhicules", feature: "Caractéristique", remove: "Retirer",
      price: "Prix", hp: "Puissance", accel: "0-100 km/h",
      topSpeed: "Vitesse Max", collection: "Collection", status: "Statut",
      empty: "Ajoutez des véhicules à comparer via le bouton comparer sur les cartes.",
    },
    leadForm: {
      title: "Obtenez un Accès Complet",
      subtitle: "Inscrivez-vous pour débloquer les prix exacts, les specs, les brochures et les rendez-vous d'essai VIP.",
      name: "Nom Complet", email: "Email", phone: "Téléphone",
      namePh: "ex. Ahmed Al-Rashid", emailPh: "votre@email.com", phonePh: "+1 XXX XXX XXXX",
      submit: "S'inscrire et Continuer",
      note: "Vos informations sont protégées. Jamais de spam.",
    },
    whyCards: [
      { icon: "🏆", title: "Conseillers Experts", desc: "Spécialistes Mercedes-AMG certifiés avec des décennies d'expérience." },
      { icon: "✅", title: "Certifié Pre-Owned", desc: "Chaque véhicule subit une inspection de plus de 200 points." },
      { icon: "💳", title: "Financement Flexible", desc: "Plans de paiement sur mesure et options de financement compétitives." },
      { icon: "⭐", title: "Service VIP", desc: "Conciergerie dédiée, livraison à domicile et support à vie." },
    ],
    toast: {
      brochure: "Brochure téléchargée",
      pricing: "Détails du prix envoyés à votre email",
      booking: "Demande d'essai envoyée — nous vous contacterons sous 24 heures",
      compare: "Ajouté à la comparaison", compareRemove: "Retiré de la comparaison",
      registered: "Vous êtes déjà inscrit !",
      leadCaptured: "Merci ! Traitement de votre demande...",
    },
    footer: "Annonce publique. Les prix affichés sont des fourchettes de départ. Inscrivez-vous pour les prix détaillés et la disponibilité.",
    poweredBy: "Propulsé par", registerNow: "S'inscrire", registerDone: "Inscrit",
    detailCta: "Inscrivez-vous pour les Détails Complets",
  },
};

// ─── COMPONENT ───────────────────────────────────────────────────
export default function PublicShowroom() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, region } = usePortalRegion("automotive", lang);
  const vehicles = usePortalVehicles("showroom");
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

  const trackEvent = useCallback(
    (event, data = {}) => trackPortalEvent(
      lead ? "lead" : "anonymous",
      null,
      event,
      {
        sessionId: _sessionId,
        portal: "automotive",
        source: "direct",
        ...(lead ? { leadName: lead.name, leadEmail: lead.email } : {}),
        ...data,
      }
    ),
    [lead]
  );

  const vehRef = useRef(null);
  const t = LANG[lang] || LANG.en;

  const nextLang = region.languages.find((l) => l !== lang) || region.languages[0];
  const toggleLang = () => {
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
    trackEvent("language_switch", { to: nextLang });
  };

  // Scroll listener
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  // IntersectionObserver for scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".ps-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, selectedVehicle, showCompare, showLeadForm]);

  // Track visit
  useEffect(() => { trackEvent("auto_portal_entry"); }, []);

  const showToastMsg = useCallback((msg) => { setToastHiding(false); setToast(msg); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);

  // Lead gate
  const requireLead = (action) => {
    if (lead) { action(); return; }
    setPendingAction(() => action);
    setShowLeadForm(true);
    trackEvent("lead_form_shown", { trigger: "high_intent_action" });
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const name = e.target.leadName.value;
    const email = e.target.leadEmail.value;
    const phone = e.target.leadPhone.value;
    const newLead = { name, email, phone };
    setLead(newLead);
    setShowLeadForm(false);
    trackEvent("lead_captured", { portalType: "lead", leadName: name, leadEmail: email });
    showToastMsg(t.toast.leadCaptured);
    if (pendingAction) { setTimeout(pendingAction, 500); setPendingAction(null); }
  };

  // Compare
  const toggleCompare = (vehicleId) => {
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) { showToastMsg(t.toast.compareRemove); return prev.filter((id) => id !== vehicleId); }
      if (prev.length >= 3) return prev;
      trackEvent("compare_add", { vehicleId });
      showToastMsg(t.toast.compare);
      return [...prev, vehicleId];
    });
  };

  // Actions
  const openDetail = (v) => {
    setSelectedVehicle(v);
    trackEvent("vehicle_view", {
      vehicleId: v.id,
      vehicleName: vName(v, lang),
      unitName: vName(v, lang),
      tower: v.collection,
      unitType: v.collection,
    });
  };
  const reqPricing = (v) => requireLead(() => { trackEvent("pricing_request", { vehicleId: v.id, vehicleName: vName(v, lang) }); showToastMsg(t.toast.pricing); });
  const openBrochure = (v) => requireLead(() => { trackEvent("brochure_download", { vehicleId: v.id, vehicleName: vName(v, lang) }); showToastMsg(t.toast.brochure); });
  const handleBooking = (v) => requireLead(() => { trackEvent("test_drive_request", { vehicleId: v?.id || "general", name: v ? vName(v, lang) : "General Test Drive" }); showToastMsg(t.toast.booking); });
  const openCompareModal = () => requireLead(() => { setShowCompare(true); });
  const closeAll = () => { setSelectedVehicle(null); setShowCompare(false); };

  const filteredVehicles = filter === "all" ? vehicles : vehicles.filter(v => v.collection === filter);
  const activeCollections = [...new Set(vehicles.map((v) => v.collection))];
  const filterTabs = [
    { key: "all", label: t.filters.all },
    ...activeCollections.map((key) => ({ key, label: t.filters[key] || COLLECTION_LABELS[key]?.[lang] || key })),
  ];

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="ps" dir={t.dir}>
      <SEO title="Public Showroom" description="Browse luxury automotive inventory with specs and configurations." path="/showroom" />
      {/* HEADER */}
      <header className={`ps-hd ${scrolled ? "sc" : ""}`}>
        <div className="ps-logo">{projectName(lang)}</div>
        <div className="ps-nav">
          {lead && <span className="ps-lead-badge">{lead.name}</span>}
          {compareList.length > 0 && (
            <button className="ps-navbtn" onClick={openCompareModal}>
              {t.vehicleActions.compare}<span className="ps-cmp-count">{compareList.length}</span>
            </button>
          )}
          <button className="ps-navbtn" onClick={toggleLang}>{LANG_LABEL[nextLang]}</button>
          <button className="ps-navbtn-dark" onClick={() => { if (!lead) setShowLeadForm(true); else showToastMsg(t.toast.registered); }}>
            {lead ? t.nav.account : t.nav.register}
          </button>
        </div>
      </header>

      {/* CROSS-NAV */}
      <div className="ps-crossnav" style={{ top: scrolled ? "52px" : "-40px" }}>
        <Link to="/automotive/demo">&#8592; {t.crossnav.hub}</Link>
        <Link to="/automotive/demo/khalid">{t.crossnav.vipPerf}</Link>
        <Link to="/automotive/demo/sultan">{t.crossnav.vipFamily}</Link>
        <span className="active">{t.crossnav.showroom}</span>
        <Link to="/automotive/dashboard">{t.crossnav.dashboard}</Link>
        <Link to="/automotive/demo/ai">{t.crossnav.ai}</Link>
        <span className="crossnav-persona">🌐 {t.crossnav.visitor}</span>
      </div>

      {/* HERO */}
      <section className="ps-hero">
        <div className="ps-hero-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="ps-hero-ov" />
        <div className="ps-hero-ct">
          <div className="ps-pvt">{t.hero.badge}</div>
          <h1 className="ps-htitle">{projectName(lang)}</h1>
          <p className="ps-hdesc">{t.hero.subtitle}</p>
          <div className="ps-hacts">
            <button className="ps-btn-accent" onClick={() => { trackEvent("cta_browse"); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} &#8594;</button>
            <button className="ps-btn-l" onClick={() => handleBooking()}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ps-stats">
        {t.stats.map((s, i) => (
          <div className="ps-stat" key={i}>
            <div className="ps-stat-v">{i === 0 ? String(vehicles.length) : i === 1 ? String(activeCollections.length) : s.value}</div>
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
            {filterTabs.map(f => (
              <button key={f.key} className={`ps-ftab ${filter === f.key ? "on" : "off"}`} onClick={() => { setFilter(f.key); trackEvent("filter_vehicles", { filter: f.key }); }}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="ps-units">
          {filteredVehicles.map((v) => (
            <div className="ps-card ps-rv" key={v.id} onClick={() => openDetail(v)}>
              <div className="ps-card-img">
                <img src={v.image} alt={vName(v, lang)} loading="lazy" />
                <div className="ps-card-fbadge">{COLLECTION_LABELS[v.collection]?.[lang]}</div>
                <div className="ps-card-status" style={{ background: v.statusColor }}>{STATUS_LABELS[v.status]?.[lang]}</div>
              </div>
              <div className="ps-card-body">
                <h3 className="ps-card-name">{vName(v, lang)}</h3>
                <div className="ps-card-specs">
                  <span>{v.specs.hp}</span>
                  <span>0-100: {v.specs.accel}</span>
                  <span>{v.specs.topSpeed}</span>
                </div>
                <div className="ps-card-price">{t.card.from} {fmtCurrency(v.priceLocal)}</div>
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
              <img src={selectedVehicle.image} alt={vName(selectedVehicle, lang)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="ps-modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--ps-serif)", fontSize: "2.2rem", fontWeight: 500, color: "var(--ps-t1)" }}>{vName(selectedVehicle, lang)}</h2>
                  <p style={{ color: "var(--ps-t3)", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{COLLECTION_LABELS[selectedVehicle.collection]?.[lang]}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div style={{ fontFamily: "var(--ps-serif)", fontSize: "1.8rem", fontWeight: 500, color: "var(--ps-t1)" }}>{t.card.from} {fmtCurrency(selectedVehicle.priceLocal)}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--ps-t3)" }}>{t.card.registerPrice}</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                {[
                  { l: t.compareModal.hp, v: selectedVehicle.specs.hp },
                  { l: t.compareModal.accel, v: selectedVehicle.specs.accel },
                  { l: t.compareModal.topSpeed, v: selectedVehicle.specs.topSpeed },
                  { l: t.compareModal.status, v: STATUS_LABELS[selectedVehicle.status]?.[lang], isSt: true },
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
                const cmpVehicles = compareList.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);
                const cols = `180px repeat(${cmpVehicles.length}, 1fr)`;
                const rows = [
                  { label: t.compareModal.price, get: (v) => `${t.card.from} ${fmtCurrency(v.priceLocal)}` },
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
                      {cmpVehicles.map((v) => (
                        <div key={v.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--ps-serif)", fontSize: ".95rem", fontWeight: 500, color: "var(--ps-t1)", marginBottom: ".3rem" }}>{vName(v, lang)}</div>
                          <button className="ps-cmp-rm" onClick={() => toggleCompare(v.id)}>{t.compareModal.remove}</button>
                        </div>
                      ))}
                    </div>
                    {/* Image row */}
                    <div className="ps-cmp-row" style={{ gridTemplateColumns: cols }}>
                      <div />
                      {cmpVehicles.map((v) => (
                        <div key={v.id} style={{ textAlign: "center", padding: ".5rem" }}>
                          <img src={v.image} alt={vName(v, lang)} style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px" }} />
                        </div>
                      ))}
                    </div>
                    {/* Data rows */}
                    {rows.map((row, i) => (
                      <div className="ps-cmp-row" key={i} style={{ gridTemplateColumns: cols }}>
                        <div className="ps-cmp-label">{row.label}</div>
                        {cmpVehicles.map((v) => <div className="ps-cmp-val" key={v.id}>{row.get(v)}</div>)}
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
                <input className="ps-lead-input" name="leadName" required placeholder={t.leadForm.namePh} />
              </div>
              <div style={{ marginBottom: "1.2rem" }}>
                <label className="ps-lead-label">{t.leadForm.email}</label>
                <input className="ps-lead-input" name="leadEmail" type="email" required placeholder={t.leadForm.emailPh} />
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <label className="ps-lead-label">{t.leadForm.phone}</label>
                <input className="ps-lead-input" name="leadPhone" type="tel" placeholder={t.leadForm.phonePh} />
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
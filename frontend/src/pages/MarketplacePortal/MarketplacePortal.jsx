import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import './MarketplacePortal.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/portals/marketplacePortal';
// ═══════════════════════════════════════════════════════════════════
// MARKETPLACE PORTAL — PUBLIC ACCESS (Definitive Edition)
// ═══════════════════════════════════════════════════════════════════
// Theme: Light Cream (#FAFAF8) + Charcoal (#1A1A1F) accents
// Identity: Anonymous → Lead capture gate → Tracked lead
// Mirrors VIP/Ahmed architecture with public-facing differences:
//   - Price RANGES instead of exact prices (until registered)
//   - Lead gate on high-intent actions (pricing, brochure, floor plan, booking)
//   - Comparison, floor plan modals, brochure modals — all behind gate
//   - portalType: "anonymous" → "lead" after form submit
// Self-contained — zero external imports
// ═══════════════════════════════════════════════════════════════════

// ─── SESSION & TRACKING ──────────────────────────────────────────
const _sessionId = (() => {
  let sid = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("dnfc_session") : null;
  if (!sid) { sid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`; try { sessionStorage.setItem("dnfc_session", sid); } catch(e) {} }
  return sid;
})();
// ─── BILINGUAL ───────────────────────────────────────────────────
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };
const LANG = {
  en: {
    dir: "ltr",
    nav: { brand: "Vista Residences", lang: "العربية", register: "Register / Login", account: "My Account" },
    hero: {
      badge: "Now selling — Phase 2",
      title: "Vista\nResidences",
      subtitle: "Premium waterfront living in the heart of the city. Explore our collection of exclusive residences from 2 to 4+ bedrooms.",
      cta: "View collection",
      ctaSecondary: "Book a visit",
    },
    stats: { units: "Premium units", floors: "Floors", beds: "Bedrooms", completion: "Completion" },
    roiBanner: {
      title: "Calculate your investment returns",
      desc: "Use our interactive ROI calculator to project your returns based on property value, rental income, appreciation rates, and financing options.",
      cta: "Open ROI calculator →",
    },
    sections: {
      residences: "Available residences", residencesSub: "Find your perfect residence",
      amenities: "The lifestyle", amenitiesSub: "World-class amenities",
      investment: "Investment snapshot", investmentSub: "Why Vista Residences",
      cta: "Ready to take the next step?",
      ctaSub: "Register for exclusive pricing, floor plans, brochures, and priority viewing appointments.",
    },
    filters: { all: "All", penthouse: "Penthouse", bed3: "3 bedrooms", bed2: "2 bedrooms" },
    card: { registerPrice: "Register for exact pricing", details: "View details", getPricing: "Get pricing", priceFrom: "From " },
    unitActions: { floorPlan: "Floor plan", brochure: "Brochure", pricing: "Get exact pricing", book: "Book a visit", compare: "Compare" },
    floorPlanModal: {
      title: "Floor Plan", bathrooms: "Bathrooms", balcony: "Balcony / Terrace",
      totalArea: "Total Area", download: "Download Floor Plan PDF",
      disclaimer: "Floor plans are indicative and may vary. Actual dimensions confirmed upon handover.",
    },
    brochureModal: {
      title: "Digital Brochure", ready: "Brochure Ready",
      desc: "Your personalized brochure has been prepared with residence details.",
      download: "Download Brochure PDF", email: "Send to Email",
      includes: "Brochure includes:",
      items: ["Detailed floor plans & specifications", "Premium finishes catalog", "Amenity & lifestyle overview", "Investment analysis & payment plans", "Location & connectivity map"],
    },
    paymentModal: {
      title: "Payment Plan", subtitle: "Flexible payment structure",
      totalPrice: "Starting From",
      plan6040: "60/40 Plan", plan6040Desc: "60% during construction · 40% on handover",
      plan7030: "70/30 Plan", plan7030Desc: "70% during construction · 30% post-handover (12 months)",
      milestones: "Payment Milestones",
      m1: "Booking Deposit", m1d: "Upon reservation",
      m2: "First Installment", m2d: "Within 30 days",
      m3: "Construction 30%", m3d: "Upon 30% completion",
      m4: "Construction 60%", m4d: "Upon 60% completion",
      m5: "Handover", m5d: "Upon key handover",
      m6: "Post-Handover", m6d: "12 months after handover",
      requestCall: "Request Payment Consultation",
      disclaimer: "Payment plans subject to approval. Register for personalized terms.",
    },
    compareModal: {
      title: "Compare Residences", feature: "Feature", remove: "Remove",
      price: "Price Range", floor: "Floor", bedrooms: "Bedrooms",
      size: "Size", view: "View", category: "Category",
      empty: "Add residences to compare using Compare on each unit card.",
    },
    leadForm: {
      title: "Get full access",
      subtitle: "Register to unlock exact pricing, floor plans, brochures, and priority viewing appointments.",
      name: "Full Name", email: "Email", phone: "Phone",
      submit: "Register & Continue",
      note: "Your information is protected. No spam, ever.",
    },
    toast: {
      floorPlan: "Floor plan opened", brochure: "Brochure downloaded",
      pricing: "Pricing details sent to your email", booking: "Viewing request sent — we'll contact you within 48 hours",
      compare: "Added to comparison", compareRemove: "Removed from comparison",
      emailSent: "Brochure sent to your email", registered: "You're already registered!",
      leadCaptured: "Thank you! Processing your request...",
    },
    footer: "Public listing. Prices shown are starting ranges. Register for detailed pricing and availability.",
    poweredBy: "Powered by", registerNow: "Register now", registerDone: "Registered",
  },
  ar: {
    dir: "rtl",
    nav: { brand: "فيستا ريزيدنسز", lang: "English", register: "تسجيل / دخول", account: "حسابي" },
    hero: {
      badge: "البيع الآن — المرحلة ٢",
      title: "فيستا\nريزيدنسز",
      subtitle: "سكن فاخر على الواجهة البحرية في قلب المدينة. استكشف مجموعتنا الحصرية من غرفتين إلى ٤+ غرف نوم.",
      cta: "عرض المجموعة",
      ctaSecondary: "احجز زيارة",
    },
    stats: { units: "وحدة فاخرة", floors: "طابقاً", beds: "غرف نوم", completion: "التسليم" },
    roiBanner: {
      title: "احسب عوائد استثمارك",
      desc: "استخدم حاسبة العائد التفاعلية لتقدير أرباحك بناءً على قيمة العقار والإيجار السنوي ومعدلات النمو وخيارات التمويل.",
      cta: "← افتح حاسبة العائد",
    },
    sections: {
      residences: "المساكن المتاحة", residencesSub: "اعثر على مسكنك المثالي",
      amenities: "أسلوب الحياة", amenitiesSub: "مرافق عالمية",
      investment: "لمحة استثمارية", investmentSub: "لماذا فيستا ريزيدنسز",
      cta: "مستعد للخطوة التالية؟",
      ctaSub: "سجّل للحصول على أسعار حصرية ومخططات وأولوية الوصول للوحدات المتاحة.",
    },
    filters: { all: "الكل", penthouse: "بنتهاوس", bed3: "٣ غرف", bed2: "غرفتان" },
    card: { registerPrice: "سجّل للحصول على السعر", details: "التفاصيل", getPricing: "احصل على السعر", priceFrom: "من " },
    unitActions: { floorPlan: "المخطط", brochure: "الكتيب", pricing: "السعر الدقيق", book: "حجز معاينة", compare: "مقارنة" },
    floorPlanModal: {
      title: "المخطط الطابقي", bathrooms: "الحمامات", balcony: "الشرفة / التراس",
      totalArea: "المساحة الإجمالية", download: "تحميل المخطط PDF",
      disclaimer: "المخططات استرشادية وقد تختلف. الأبعاد الفعلية تُؤكد عند التسليم.",
    },
    brochureModal: {
      title: "الكتيب الرقمي", ready: "الكتيب جاهز",
      desc: "تم إعداد كتيبك المخصص مع تفاصيل المسكن.", download: "تحميل الكتيب PDF",
      email: "إرسال للبريد", includes: "يتضمن الكتيب:",
      items: ["مخططات تفصيلية ومواصفات", "كتالوج التشطيبات الفاخرة", "نظرة على المرافق", "تحليل استثماري وخطط الدفع", "خريطة الموقع"],
    },
    paymentModal: {
      title: "خطة الدفع", subtitle: "هيكل دفع مرن", totalPrice: "يبدأ من",
      plan6040: "خطة ٦٠/٤٠", plan6040Desc: "٦٠٪ خلال البناء · ٤٠٪ عند التسليم",
      plan7030: "خطة ٧٠/٣٠", plan7030Desc: "٧٠٪ خلال البناء · ٣٠٪ بعد التسليم",
      milestones: "مراحل الدفع",
      m1: "عربون الحجز", m1d: "عند الحجز", m2: "القسط الأول", m2d: "خلال ٣٠ يوم",
      m3: "البناء ٣٠٪", m3d: "عند إتمام ٣٠٪", m4: "البناء ٦٠٪", m4d: "عند إتمام ٦٠٪",
      m5: "التسليم", m5d: "عند تسليم المفتاح", m6: "بعد التسليم", m6d: "١٢ شهر بعد التسليم",
      requestCall: "طلب استشارة الدفع",
      disclaimer: "خطط الدفع تخضع للموافقة. سجّل للحصول على شروط مخصصة.",
    },
    compareModal: {
      title: "مقارنة المساكن", feature: "الميزة", remove: "إزالة",
      price: "نطاق السعر", floor: "الطابق", bedrooms: "غرف النوم",
      size: "المساحة", view: "الإطلالة", category: "الفئة",
      empty: "أضف مساكن للمقارنة باستخدام زر المقارنة في بطاقات الوحدات.",
    },
    leadForm: {
      title: "احصل على وصول كامل",
      subtitle: "سجّل لفتح الأسعار الدقيقة والمخططات والكتيبات ومواعيد المعاينة.",
      name: "الاسم الكامل", email: "البريد", phone: "الهاتف",
      submit: "سجّل واستمر",
      note: "معلوماتك محمية. لا رسائل مزعجة.",
    },
    toast: {
      floorPlan: "تم فتح المخطط", brochure: "تم تحميل الكتيب",
      pricing: "تفاصيل الأسعار أُرسلت لبريدك", booking: "تم إرسال طلب المعاينة — سنتواصل خلال ٤٨ ساعة",
      compare: "تمت الإضافة للمقارنة", compareRemove: "تمت الإزالة من المقارنة",
      emailSent: "تم إرسال الكتيب لبريدك", registered: "أنت مسجّل بالفعل!",
      leadCaptured: "شكراً! جارٍ معالجة طلبك...",
    },
    footer: "إدراج عام. الأسعار المعروضة هي نطاقات بدء. سجل للحصول على الأسعار التفصيلية والتوافر.",
    poweredBy: "مشغل بواسطة", registerNow: "سجل الآن", registerDone: "مسجل",
  },
  es: {
    dir: "ltr",
    nav: { brand: "Vista Residences", lang: "English", register: "Registrarse / Acceder", account: "Mi cuenta" },
    hero: {
      badge: "En venta — Fase 2",
      title: "Vista\nResidences",
      subtitle: "Vivienda premium frente al mar en el corazón de la ciudad. Explore nuestra colección exclusiva de residencias de 2 a 4+ recámaras.",
      cta: "Ver colección",
      ctaSecondary: "Reservar visita",
    },
    stats: { units: "Residencias premium", floors: "Pisos", beds: "Recámaras", completion: "Entrega" },
    roiBanner: {
      title: "Calcule el rendimiento de su inversión",
      desc: "Use nuestra calculadora interactiva de ROI para proyectar sus rendimientos según el valor de la propiedad, ingresos por renta, tasas de plusvalía y opciones de financiamiento.",
      cta: "Abrir calculadora ROI →",
    },
    sections: {
      residences: "Residencias disponibles", residencesSub: "Encuentre su residencia ideal",
      amenities: "El estilo de vida", amenitiesSub: "Amenidades de clase mundial",
      investment: "Resumen de inversión", investmentSub: "Por qué Vista Residences",
      cta: "¿Listo para dar el siguiente paso?",
      ctaSub: "Regístrese para recibir precios exclusivos, planos, catálogos y citas prioritarias de visita.",
    },
    filters: { all: "Todas", penthouse: "Penthouse", bed3: "3 recámaras", bed2: "2 recámaras" },
    card: { registerPrice: "Registrarse para precio exacto", details: "Ver detalles", getPricing: "Obtener precio", priceFrom: "Desde " },
    unitActions: { floorPlan: "Plano", brochure: "Catálogo", pricing: "Obtener precio exacto", book: "Reservar visita", compare: "Comparar" },
    floorPlanModal: {
      title: "Plano de planta", bathrooms: "Baños", balcony: "Balcón / terraza",
      totalArea: "Superficie total", download: "Descargar plano en PDF",
      disclaimer: "Los planos son indicativos y pueden variar. Las dimensiones finales se confirman a la entrega.",
    },
    brochureModal: {
      title: "Catálogo digital", ready: "Catálogo listo",
      desc: "Su catálogo personalizado ha sido preparado con los detalles de la residencia.",
      download: "Descargar catálogo en PDF", email: "Enviar por correo",
      includes: "El catálogo incluye:",
      items: ["Planos detallados y especificaciones", "Catálogo de acabados premium", "Vista general de amenidades y estilo de vida", "Análisis de inversión y planes de pago", "Mapa de ubicación y conectividad"],
    },
    paymentModal: {
      title: "Plan de pago", subtitle: "Estructura de pago flexible",
      totalPrice: "Desde",
      plan6040: "Plan 60/40", plan6040Desc: "60% durante construcción · 40% a la entrega",
      plan7030: "Plan 70/30", plan7030Desc: "70% durante construcción · 30% post-entrega (12 meses)",
      milestones: "Hitos de pago",
      m1: "Depósito de reserva", m1d: "Al reservar",
      m2: "Primer abono", m2d: "Dentro de 30 días",
      m3: "Construcción 30%", m3d: "Al alcanzar 30%",
      m4: "Construcción 60%", m4d: "Al alcanzar 60%",
      m5: "Entrega", m5d: "Al entregar llaves",
      m6: "Post-entrega", m6d: "12 meses después de la entrega",
      requestCall: "Solicitar consulta de pago",
      disclaimer: "Los planes de pago están sujetos a aprobación. Regístrese para condiciones personalizadas.",
    },
    compareModal: {
      title: "Comparar residencias", feature: "Característica", remove: "Quitar",
      price: "Rango de precio", floor: "Piso", bedrooms: "Recámaras",
      size: "Superficie", view: "Vista", category: "Categoría",
      empty: "Agregue residencias para comparar usando Comparar en cada tarjeta de unidad.",
    },
    leadForm: {
      title: "Acceso completo",
      subtitle: "Regístrese para desbloquear precios exactos, planos, catálogos y citas prioritarias de visita.",
      name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono",
      submit: "Registrarse y continuar",
      note: "Su información está protegida. Sin spam, jamás.",
    },
    toast: {
      floorPlan: "Plano abierto", brochure: "Catálogo descargado",
      pricing: "Detalles de precio enviados a su correo", booking: "Solicitud de visita enviada — le contactaremos en 48 horas",
      compare: "Agregado a la comparación", compareRemove: "Quitado de la comparación",
      emailSent: "Catálogo enviado a su correo", registered: "¡Ya está registrado!",
      leadCaptured: "¡Gracias! Procesando su solicitud...",
    },
    footer: "Listado público. Los precios mostrados son rangos iniciales. Regístrese para precios detallados y disponibilidad.",
    poweredBy: "Tecnología de", registerNow: "Registrarse ahora", registerDone: "Registrado",
  },
  fr: {
    dir: "ltr",
    nav: { brand: "Vista Residences", lang: "English", register: "S'inscrire / Se connecter", account: "Mon compte" },
    hero: {
      badge: "En vente — Phase 2",
      title: "Vista\nResidences",
      subtitle: "Vie haut de gamme au bord de l'eau au cœur de la ville. Explorez notre collection exclusive de résidences de 2 à 4+ chambres.",
      cta: "Voir la collection",
      ctaSecondary: "Réserver une visite",
    },
    stats: { units: "Résidences premium", floors: "Étages", beds: "Chambres", completion: "Livraison" },
    roiBanner: {
      title: "Calculez le rendement de votre investissement",
      desc: "Utilisez notre calculateur de ROI interactif pour projeter vos rendements selon la valeur de la propriété, les revenus locatifs, les taux d'appréciation et les options de financement.",
      cta: "Ouvrir le calculateur ROI →",
    },
    sections: {
      residences: "Résidences disponibles", residencesSub: "Trouvez votre résidence idéale",
      amenities: "L'art de vivre", amenitiesSub: "Commodités de classe mondiale",
      investment: "Aperçu de l'investissement", investmentSub: "Pourquoi Vista Residences",
      cta: "Prêt à passer à l'étape suivante ?",
      ctaSub: "Inscrivez-vous pour des prix exclusifs, plans, brochures et rendez-vous de visite prioritaires.",
    },
    filters: { all: "Toutes", penthouse: "Penthouse", bed3: "3 chambres", bed2: "2 chambres" },
    card: { registerPrice: "S'inscrire pour le prix exact", details: "Voir les détails", getPricing: "Obtenir le prix", priceFrom: "À partir de " },
    unitActions: { floorPlan: "Plan d'étage", brochure: "Brochure", pricing: "Obtenir le prix exact", book: "Réserver une visite", compare: "Comparer" },
    floorPlanModal: {
      title: "Plan d'étage", bathrooms: "Salles de bain", balcony: "Balcon / terrasse",
      totalArea: "Superficie totale", download: "Télécharger le plan en PDF",
      disclaimer: "Les plans sont indicatifs et peuvent varier. Les dimensions finales sont confirmées à la livraison.",
    },
    brochureModal: {
      title: "Brochure numérique", ready: "Brochure prête",
      desc: "Votre brochure personnalisée a été préparée avec les détails de la résidence.",
      download: "Télécharger la brochure en PDF", email: "Envoyer par courriel",
      includes: "La brochure comprend :",
      items: ["Plans détaillés et spécifications", "Catalogue des finitions haut de gamme", "Aperçu des commodités et de l'art de vivre", "Analyse d'investissement et plans de paiement", "Carte d'emplacement et de connectivité"],
    },
    paymentModal: {
      title: "Plan de paiement", subtitle: "Structure de paiement flexible",
      totalPrice: "À partir de",
      plan6040: "Plan 60/40", plan6040Desc: "60 % pendant la construction · 40 % à la livraison",
      plan7030: "Plan 70/30", plan7030Desc: "70 % pendant la construction · 30 % après livraison (12 mois)",
      milestones: "Jalons de paiement",
      m1: "Dépôt de réservation", m1d: "À la réservation",
      m2: "Premier versement", m2d: "Dans les 30 jours",
      m3: "Construction 30 %", m3d: "À 30 % d'achèvement",
      m4: "Construction 60 %", m4d: "À 60 % d'achèvement",
      m5: "Livraison", m5d: "À la remise des clés",
      m6: "Après livraison", m6d: "12 mois après la livraison",
      requestCall: "Demander une consultation de paiement",
      disclaimer: "Les plans de paiement sont sujets à approbation. Inscrivez-vous pour des conditions personnalisées.",
    },
    compareModal: {
      title: "Comparer les résidences", feature: "Caractéristique", remove: "Retirer",
      price: "Fourchette de prix", floor: "Étage", bedrooms: "Chambres",
      size: "Superficie", view: "Vue", category: "Catégorie",
      empty: "Ajoutez des résidences à comparer en utilisant Comparer sur chaque carte d'unité.",
    },
    leadForm: {
      title: "Accès complet",
      subtitle: "Inscrivez-vous pour débloquer les prix exacts, plans, brochures et rendez-vous de visite prioritaires.",
      name: "Nom complet", email: "Courriel", phone: "Téléphone",
      submit: "S'inscrire et continuer",
      note: "Vos informations sont protégées. Aucun spam, jamais.",
    },
    toast: {
      floorPlan: "Plan ouvert", brochure: "Brochure téléchargée",
      pricing: "Détails de prix envoyés à votre courriel", booking: "Demande de visite envoyée — nous vous contacterons sous 48 heures",
      compare: "Ajouté à la comparaison", compareRemove: "Retiré de la comparaison",
      emailSent: "Brochure envoyée à votre courriel", registered: "Vous êtes déjà inscrit !",
      leadCaptured: "Merci ! Traitement de votre demande...",
    },
    footer: "Annonce publique. Les prix affichés sont des fourchettes initiales. Inscrivez-vous pour les prix détaillés et la disponibilité.",
    poweredBy: "Propulsé par", registerNow: "S'inscrire maintenant", registerDone: "Inscrit",
  },
};

const IMAGES = { hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85" };

const ROOM_COLORS = {
  master: "#8B7355", bed2: "#7A9BAE", bed3: "#7EA88E", bed4: "#A89078",
  living: "#B0A58C", kitchen: "#8AADBD", dining: "#A8B0A0", office: "#7A9BAE",
  balcony: "#98BFA8", pool: "#7EC8E3", maid: "#A8A0B0",
};

// ─── CSS (Light Cream Luxury) ────────────────────────────────────

// ─── COMPONENT ───────────────────────────────────────────────────
export default function MarketplacePortal() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, region, luxuryUnits, amenities, investStats, unitMedia } = usePortalRegion("real_estate", lang);

  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalUnit, setModalUnit] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [payPlan, setPayPlan] = useState("60/40");
  const [compareList, setCompareList] = useState([]);
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
        source: "direct",
        ...(lead ? { leadName: lead.name, leadEmail: lead.email } : {}),
        ...data,
      }
    ),
    [lead]
  );

  const resRef = useRef(null);
  const t = LANG[lang];

  const withExtras = (unit) => ({ ...unit, ...unitMedia[unit.id] });
  const units = luxuryUnits.map(withExtras);

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }); document.querySelectorAll(".mp-rv").forEach((el) => obs.observe(el)); return () => obs.disconnect(); }, [lang, modal, selectedUnit, showLeadForm]);
  useEffect(() => { trackEvent("marketplace_visit"); }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => () => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const nextLang = region.languages.find((l) => l !== lang) || region.languages[0];
  const toggleLang = () => {
    const n = region.languages.find((l) => l !== lang) || region.languages[0];
    setLang(n);
  };
  const showToast = useCallback((msg) => { setToastHiding(false); setToast(msg); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);

  // Lead gate — high-intent actions require registration
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
    showToast(t.toast.leadCaptured);
    if (pendingAction) { setTimeout(pendingAction, 500); setPendingAction(null); }
  };

  // Compare
  const toggleCompare = (unitId) => {
    setCompareList((prev) => {
      if (prev.includes(unitId)) { showToast(t.toast.compareRemove); return prev.filter((id) => id !== unitId); }
      if (prev.length >= 3) return prev;
      trackEvent("comparison_view", { unitId });
      showToast(t.toast.compare);
      return [...prev, unitId];
    });
  };

  // Actions (all behind lead gate except view)
  const openDetail = (unit) => { setSelectedUnit(unit); trackEvent("view_unit", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); };
  const openFloor = (unit) => requireLead(() => { setModalUnit(unit); setModal("floorplan"); trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); showToast(t.toast.floorPlan); });
  const openBrochure = (unit) => requireLead(() => { setModalUnit(unit); setModal("brochure"); trackEvent("download_brochure", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); showToast(t.toast.brochure); });
  const openPayment = (unit) => requireLead(() => { setModalUnit(unit); setModal("payment"); setPayPlan("60/40"); trackEvent("explore_payment_plan", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); });
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => requireLead(() => { trackEvent("request_pricing", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); showToast(t.toast.pricing); });
  const handleBooking = (unit) => requireLead(() => { trackEvent("book_viewing", { unitId: unit?.id || "general" }); showToast(t.toast.booking); });
  const closeAll = () => { setModal(null); setModalUnit(null); setSelectedUnit(null); };

  const filteredUnits = filter === "all" ? units : units.filter(u => u.type === filter);

  const getMilestones = (price, plan) => {
    if (plan === "60/40") return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#1A1A1F" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#333" },
      { pct: 15, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#555" },
      { pct: 25, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#777" },
      { pct: 40, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#2A9D5C" },
    ];
    return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#1A1A1F" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#333" },
      { pct: 20, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#555" },
      { pct: 30, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#777" },
      { pct: 10, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#2A9D5C" },
      { pct: 20, label: t.paymentModal.m6, desc: t.paymentModal.m6d, color: "#999" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="mp" dir={t.dir}>
      <SEO
        title="Real Estate Marketplace"
        description="Browse premium residences with floor plans, pricing access, and viewing requests."
        path="/enterprise/crmdemo/marketplace"
      />
      {/* HEADER */}
      <div className="mp-crossnav" style={{ top: scrolled ? "0" : "-40px" }}>
        <Link to="/enterprise/crmdemo">← Demo Hub</Link>
        <Link to="/enterprise/crmdemo/khalid">VIP Portal</Link>
        <Link to="/enterprise/crmdemo/ahmed">Ahmed Portal</Link>
        <span className="active">Marketplace</span>
        <Link to="/unified">Dashboard</Link>
        <Link to="/enterprise/crmdemo/ai-demo">AI Pipeline</Link>
        <span className="crossnav-persona"><i className="ti ti-world" aria-hidden="true" /> {lang === "ar" ? "زائر عام" : "Public visitor"}</span>
      </div>
      <header className={`mp-hd ${scrolled ? "sc" : ""}`}>
        <div className="mp-logo">{projectName(lang)}</div>
        <div className="mp-nav">
          {lead && <span className="mp-lead-badge">{lead.name}</span>}
          {compareList.length > 0 && <button className="mp-navbtn" onClick={openCompare}>{t.unitActions.compare}<span className="mp-cmp-count">{compareList.length}</span></button>}
          <button className="mp-navbtn" onClick={toggleLang}>{LANG_LABEL[nextLang]}</button>
          <button type="button" className="mp-navbtn-dark mp-nav-register" onClick={() => { if (!lead) setShowLeadForm(true); else showToast(t.toast.registered); }}>
            {lead ? t.nav.account : t.nav.register}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="mp-hero">
        <div className="mp-hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="mp-hero-ov" />
        <div className="mp-hero-ct">
          <div className="mp-pvt">{t.hero.badge}</div>
          <h1 className="mp-htitle">{projectName(lang)}</h1>
          <p className="mp-hdesc">{t.hero.subtitle}</p>
          <div className="mp-hacts">
            <button type="button" className="mp-btn-d" onClick={() => { trackEvent("cta_browse"); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button type="button" className="mp-btn-l" onClick={() => handleBooking()}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="mp-stats">
        {[{ v: "248", l: t.stats.units }, { v: "44", l: t.stats.floors }, { v: "2–4", l: t.stats.beds }, { v: "Q4 '27", l: t.stats.completion }].map((s, i) => (
          <div className="mp-stat" key={i}><div className="mp-stat-v">{s.v}</div><div className="mp-stat-l">{s.l}</div></div>
        ))}
      </div>

      {/* RESIDENCES */}
      <section className="mp-sec" ref={resRef} style={{ background: "var(--mp-warm)" }}>
        <div className="mp-sh mp-rv">
          <span className="mp-sl">{t.sections.residences}</span>
          <h2 className="mp-st">{t.sections.residencesSub}</h2>
          <div className="mp-filters">
            {[{ key: "all", l: t.filters.all }, { key: "penthouse", l: t.filters.penthouse }, { key: "3br", l: t.filters.bed3 }, { key: "2br", l: t.filters.bed2 }].map(f => (
              <button type="button" key={f.key} className={`mp-ftab ${filter === f.key ? "on" : "off"}`} onClick={() => { setFilter(f.key); trackEvent("filter_units", { filter: f.key }); }}>{f.l}</button>
            ))}
          </div>
        </div>
        <div className="mp-units">
          {filteredUnits.map((unit) => (
            <div className="mp-card mp-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="mp-card-img">
                <img src={unit.img} alt={unit.name} loading="lazy" />
                <div className="mp-card-fbadge">{unit.type}</div>
                <div className="mp-card-status" style={{ background: unit.statusColor }}>{unit.status}</div>
              </div>
              <div className="mp-card-body">
                <h3 className="mp-card-name">{unit.name}</h3>
                <p className="mp-card-floor">{unit.floor}</p>
                <div className="mp-card-meta">
                  <span className="mp-card-meta-item"><i className="ti ti-bed" aria-hidden="true" /> {unit.beds}</span>
                  <span className="mp-card-meta-item"><i className="ti ti-ruler-measure" aria-hidden="true" /> {unit.size}</span>
                </div>
                <div className="mp-card-price">{t.card.priceFrom}{fmtCurrency(unit.priceBase)}</div>
                <div className="mp-card-hint mp-card-pricing-sub"><i className="ti ti-lock" aria-hidden="true" /><span>{t.card.registerPrice}</span></div>
              </div>
              <div className="mp-card-acts" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => openFloor(unit)}><i className="ti ti-ruler-measure" aria-hidden="true" /> {t.unitActions.floorPlan}</button>
                <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => openBrochure(unit)}><i className="ti ti-file-text" aria-hidden="true" /> {t.unitActions.brochure}</button>
                <button type="button" className="mp-btn-d mp-btn-sm" onClick={() => reqPricing(unit)}><i className="ti ti-currency-dollar" aria-hidden="true" /> {t.card.getPricing}</button>
                <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => toggleCompare(unit.id)} style={compareList.includes(unit.id) ? { borderColor: "var(--mp-ch)", fontWeight: 600 } : {}}>
                  {compareList.includes(unit.id) ? (<><i className="ti ti-check" aria-hidden="true" /> {t.unitActions.compare}</>) : (<><i className="ti ti-scale" aria-hidden="true" /> {t.unitActions.compare}</>)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mp-div"><div className="mp-div-l" /><div className="mp-div-d">◆</div><div className="mp-div-l" /></div>

      {/* AMENITIES */}
      <section className="mp-sec">
        <div className="mp-sh mp-rv"><span className="mp-sl">{t.sections.amenities}</span><h2 className="mp-st">{t.sections.amenitiesSub}</h2></div>
        <div className="mp-am-grid">{amenities.map((a, i) => (<div className="mp-am mp-rv" key={i}><div className="mp-am-icon"><i className={`ti ${a.icon}`} aria-hidden="true" /></div><div className="mp-am-name">{a.title}</div><div className="mp-am-desc">{a.desc}</div></div>))}</div>
      </section>

      <div className="mp-div"><div className="mp-div-l" /><div className="mp-div-d">◆</div><div className="mp-div-l" /></div>

      {/* INVESTMENT */}
      <section className="mp-sec">
        <div className="mp-sh mp-rv"><span className="mp-sl">{t.sections.investment}</span><h2 className="mp-st">{t.sections.investmentSub}</h2></div>
        <div className="mp-inv-grid">{investStats.map((item, i) => (<div className="mp-inv mp-rv" key={i}><div className="mp-inv-v">{item.stat}</div><div className="mp-inv-l">{item.label}</div><div className="mp-inv-n">{item.desc}</div></div>))}</div>

      </section>

      {/* ── ROI CALCULATOR BANNER ── */}
      <Link to="/enterprise/crmdemo/roi-calculator" className="mp-roi-banner" onClick={() => { trackEvent("roi_calculator_click"); }}>
        <div className="mp-roi-icon" aria-hidden="true"><i className="ti ti-calculator" /></div>
        <div className="mp-roi-content">
          <h3 className="mp-roi-title">{t.roiBanner.title}</h3>
          <p className="mp-roi-desc">{t.roiBanner.desc}</p>
        </div>
        <span className="mp-roi-cta">{t.roiBanner.cta}</span>
      </Link>

      {/* CTA BANNER */}
      <section className="mp-cta-banner mp-rv">
        <h2 className="mp-cta-title">{t.sections.cta}</h2>
        <p className="mp-cta-sub">{t.sections.ctaSub}</p>
        <div className="mp-cta-actions">
          <button type="button" className="mp-cta-btn mp-cta-btn-primary" onClick={() => { if (!lead) setShowLeadForm(true); else showToast(t.toast.registered); }}>
            {lead ? (<><i className="ti ti-check" aria-hidden="true" /> {t.registerDone}</>) : (<>{t.registerNow} →</>)}
          </button>
          <button type="button" className="mp-cta-btn mp-cta-btn-secondary" onClick={() => handleBooking()}>
            {t.hero.ctaSecondary}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mp-ft">
        <p>{t.footer}</p>
        <p style={{ fontSize: ".72rem", color: "var(--mp-t3)" }}>{t.poweredBy} <span style={{ fontFamily: "var(--mp-serif)", fontWeight: 500 }}>Dynamic NFC</span></p>
      </footer>

      {/* ══════════ MODALS ══════════ */}

      {/* UNIT DETAIL */}
      {selectedUnit && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-md-gallery">{selectedUnit.gallery.map((src, i) => <img key={i} src={src} alt={`${selectedUnit.name} ${i+1}`} loading="lazy" />)}</div>
          <div className="mp-modal-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <div><h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "2.2rem", fontWeight: 500, color: "var(--mp-t1)" }}>{selectedUnit.name}</h2><p style={{ color: "var(--mp-t3)", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedUnit.floor}</p></div>
              <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                <div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", fontWeight: 500, color: "var(--mp-t1)" }}>{t.card.priceFrom}{fmtCurrency(selectedUnit.priceBase)}</div>
                <div className="mp-card-pricing-sub" style={{ justifyContent: lang === "ar" ? "flex-end" : "flex-start", marginTop: ".35rem" }}>
                  <i className="ti ti-lock" aria-hidden="true" />
                  <span>{t.card.registerPrice}</span>
                </div>
              </div>
            </div>
            <p style={{ color: "var(--mp-t2)", fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 400, marginBottom: "2rem", maxWidth: "700px" }}>{selectedUnit.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              {[{ l: t.compareModal.bedrooms, v: selectedUnit.beds },{ l: t.floorPlanModal.bathrooms, v: selectedUnit.baths },{ l: t.floorPlanModal.totalArea, v: selectedUnit.size },{ l: t.compareModal.category, v: selectedUnit.status, isSt: true }].map((item, i) => (
                <div key={i} style={{ padding: "1rem", border: "1px solid var(--mp-bdr)", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mp-t3)", marginBottom: ".3rem" }}>{item.l}</div>
                  {item.isSt ? <div style={{ color: "#fff", fontSize: ".9rem", background: selectedUnit.statusColor, display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontWeight: 600 }}>{item.v}</div>
                    : <div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.2rem", color: "var(--mp-t1)" }}>{item.v}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2rem" }}>
              {selectedUnit.features.map((f, i) => (<span key={i} style={{ padding: ".4rem .9rem", background: "rgba(26,26,31,.04)", border: "1px solid var(--mp-bdr)", borderRadius: "4px", fontSize: ".78rem", color: "var(--mp-t2)" }}>{f}</span>))}
            </div>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", paddingTop: "1.5rem", borderTop: "1px solid var(--mp-bdr)" }}>
              <button type="button" className="mp-btn-d mp-btn-sm" onClick={() => { closeAll(); reqPricing(selectedUnit); }}><i className="ti ti-currency-dollar" aria-hidden="true" /> {t.unitActions.pricing}</button>
              <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openFloor(selectedUnit); }}><i className="ti ti-ruler-measure" aria-hidden="true" /> {t.unitActions.floorPlan}</button>
              <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openBrochure(selectedUnit); }}><i className="ti ti-file-text" aria-hidden="true" /> {t.unitActions.brochure}</button>
              <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openPayment(selectedUnit); }}><i className="ti ti-calculator" aria-hidden="true" /> {t.paymentModal.title}</button>
              <button type="button" className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); handleBooking(selectedUnit); }}><i className="ti ti-calendar-event" aria-hidden="true" /> {t.unitActions.book}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* FLOOR PLAN */}
      {modal === "floorplan" && modalUnit && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-modal-body">
            <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name}</h2>
            <p style={{ color: "var(--mp-t3)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor}</p>
            <svg className="mp-fp-svg" viewBox="0 0 100 65">
              {modalUnit.floorPlan.rooms.map((room, i) => (<g key={i}><rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#999"} fillOpacity="0.15" stroke={ROOM_COLORS[room.key] || "#999"} strokeWidth="0.3" rx="0.5" />{(room.label[lang] ?? room.label.en).split("\n").map((line, li) => (<text key={li} x={room.x + room.w / 2} y={room.y + room.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fill={ROOM_COLORS[room.key] || "#888"} fontSize="2.2" fontFamily="Outfit, sans-serif" fontWeight={li === 0 ? "500" : "400"}>{line}</text>))}</g>))}
            </svg>
            <div className="mp-fp-specs">
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.bathrooms}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.bathrooms}</div></div>
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.balcony}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.balconySize}</div></div>
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.totalArea}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.totalArea}</div></div>
            </div>
            <button className="mp-btn-d" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(t.toast.floorPlan)}>{t.floorPlanModal.download}</button>
            <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--mp-t3)", marginTop: "1rem" }}>{t.floorPlanModal.disclaimer}</p>
          </div>
        </div></div>
      )}

      {/* BROCHURE */}
      {modal === "brochure" && modalUnit && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "550px" }} onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-modal-body" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: 1 }} aria-hidden="true"><i className="ti ti-file-text" style={{ fontSize: "3rem" }} /></div>
            <div className="mp-br-prog"><div className="mp-br-fill" /></div>
            <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>{t.brochureModal.ready}</h2>
            <p style={{ color: "var(--mp-t2)", fontSize: ".95rem", marginBottom: "1.5rem" }}>{t.brochureModal.desc}</p>
            <p style={{ color: "var(--mp-t1)", fontSize: ".85rem", fontWeight: 500, marginBottom: ".5rem" }}>{t.brochureModal.includes}</p>
            <div className="mp-br-items" style={{ textAlign: "start" }}>{t.brochureModal.items.map((item, i) => (<div className="mp-br-item" key={i}>{item}</div>))}</div>
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
              <button className="mp-btn-d" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.brochure)}>{t.brochureModal.download}</button>
              <button className="mp-btn-l" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.emailSent)}>{t.brochureModal.email}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* PAYMENT */}
      {modal === "payment" && modalUnit && (() => {
        const milestones = getMilestones(modalUnit.payment.base, payPlan);
        return (
          <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <button className="mp-modal-x" onClick={closeAll}>✕</button>
            <div className="mp-modal-body">
              <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.paymentModal.title}</h2>
              <p style={{ color: "var(--mp-t2)", fontSize: ".9rem", marginBottom: ".5rem" }}>{t.paymentModal.subtitle}</p>
              <p style={{ fontFamily: "var(--mp-serif)", fontSize: "2rem", color: "var(--mp-t1)", marginBottom: "2rem" }}>{t.paymentModal.totalPrice}: {fmtCurrency(modalUnit.payment.base)}</p>
              <div className="mp-pm-tabs">
                <button className={`mp-pm-tab ${payPlan === "60/40" ? "active" : ""}`} onClick={() => setPayPlan("60/40")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan6040}</div><div style={{ fontSize: ".72rem", opacity: .6 }}>{t.paymentModal.plan6040Desc}</div></button>
                <button className={`mp-pm-tab ${payPlan === "70/30" ? "active" : ""}`} onClick={() => setPayPlan("70/30")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan7030}</div><div style={{ fontSize: ".72rem", opacity: .6 }}>{t.paymentModal.plan7030Desc}</div></button>
              </div>
              <div style={{ display: "flex", height: "10px", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>{milestones.map((m, i) => (<div key={i} style={{ flex: m.pct, background: m.color, transition: ".3s" }} />))}</div>
              <h4 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.2rem", margin: "1.5rem 0 1rem" }}>{t.paymentModal.milestones}</h4>
              <div className="mp-pm-ms">{milestones.map((m, i) => (
                <div className="mp-pm-m" key={i}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: ".85rem", fontWeight: 500, marginBottom: ".15rem" }}>{m.label}</div><div style={{ fontSize: ".72rem", color: "var(--mp-t3)" }}>{m.desc}</div></div>
                  <div style={{ textAlign: "end" }}><div style={{ fontSize: ".75rem", color: "var(--mp-t3)" }}>{m.pct}%</div><div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.1rem", fontWeight: 500 }}>{fmtCurrency(modalUnit.payment.base * m.pct / 100)}</div></div>
                </div>
              ))}</div>
              <button className="mp-btn-d" style={{ width: "100%", justifyContent: "center", marginTop: "2rem" }} onClick={() => showToast(t.toast.pricing)}>{t.paymentModal.requestCall}</button>
              <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--mp-t3)", marginTop: "1rem" }}>{t.paymentModal.disclaimer}</p>
            </div>
          </div></div>
        );
      })()}

      {/* COMPARE */}
      {modal === "compare" && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-modal-body">
            <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compareModal.title}</h2>
            {compareList.length === 0 ? (<div className="mp-cmp-empty">{t.compareModal.empty}</div>) : (() => {
              const compareUnits = compareList.map((id) => units.find((u) => u.id === id)).filter(Boolean);
              const cols = `180px repeat(${compareUnits.length}, 1fr)`;
              const rows = [
                { label: t.compareModal.price, get: (u) => t.card.priceFrom + fmtCurrency(u.priceBase) },
                { label: t.compareModal.floor, get: (u) => u.floor },
                { label: t.compareModal.bedrooms, get: (u) => u.beds },
                { label: t.compareModal.size, get: (u) => u.size },
                { label: t.compareModal.view, get: (u) => u.feature },
                { label: t.compareModal.category, get: (u) => u.category },
              ];
              return (<div>
                <div className="mp-cmp-row hdr" style={{ gridTemplateColumns: cols }}><div>{t.compareModal.feature}</div>{compareUnits.map((u) => (<div key={u.id} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--mp-serif)", fontSize: "1rem", fontWeight: 500, marginBottom: ".3rem" }}>{u.name}</div><button className="mp-cmp-rm" onClick={() => toggleCompare(u.id)}>{t.compareModal.remove}</button></div>))}</div>
                {rows.map((row, ri) => (<div className="mp-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}><div className="mp-cmp-label">{row.label}</div>{compareUnits.map((u) => (<div className="mp-cmp-val" key={u.id}>{row.get(u)}</div>))}</div>))}
              </div>);
            })()}
          </div>
        </div></div>
      )}

      {/* LEAD CAPTURE FORM */}
      {showLeadForm && (
        <div className="mp-lead-ov" onClick={() => { setShowLeadForm(false); setPendingAction(null); }}>
          <div className="mp-lead-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.6rem", fontWeight: 400, marginBottom: ".4rem" }}>{t.leadForm.title}</h3>
            <p style={{ color: "var(--mp-t2)", fontSize: ".88rem", marginBottom: "2rem", lineHeight: 1.6 }}>{t.leadForm.subtitle}</p>
            <form onSubmit={handleLeadSubmit}>
              <div style={{ marginBottom: "1rem" }}><label className="mp-lead-label">{t.leadForm.name}</label><input name="leadName" type="text" required className="mp-lead-input" /></div>
              <div style={{ marginBottom: "1rem" }}><label className="mp-lead-label">{t.leadForm.email}</label><input name="leadEmail" type="text" inputMode="email" required className="mp-lead-input" /></div>
              <div style={{ marginBottom: "1.5rem" }}><label className="mp-lead-label">{t.leadForm.phone}</label><input name="leadPhone" type="text" inputMode="tel" className="mp-lead-input" /></div>
              <button type="submit" className="mp-btn-d" style={{ width: "100%", justifyContent: "center" }}>{t.leadForm.submit} →</button>
              <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--mp-t3)", marginTop: "1rem" }}>{t.leadForm.note}</p>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className={`mp-toast ${toastHiding ? "hiding" : ""}`}>{toast}</div>}
    </div>
  );
}
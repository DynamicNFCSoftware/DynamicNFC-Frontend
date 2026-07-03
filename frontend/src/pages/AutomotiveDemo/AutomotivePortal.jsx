import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { bridgeEventToFirestore } from "../../services/portalFirestoreBridge";
import { usePortalRegion } from "../../services/portalRegion";
import { usePortalVehicles } from "../../hooks/usePortalVehicles";
import { COLLECTIONS, vName, vColorName } from "../../data/automotiveVehicleData";
import { getAutoPersona, getPersonaName } from "../../data/automotivePersonas";
import './AutomotivePortal.css';
import SEO from '../../components/SEO/SEO';
import heroImg from "./assets/hero.jpg";

// ═══════════════════════════════════════════════════════════════════
// AUTOMOTIVE VIP PORTAL — Luxury Showroom Experience
// ═══════════════════════════════════════════════════════════════════
// Design: Dark luxury (Mercedes / BMW VIP lounge feel)
// Features: Vehicle Detail Modal (3 tabs), Color/Interior Config,
//           Finance Calculator, Comparison, Test Drive Booking, Toasts
// ═══════════════════════════════════════════════════════════════════

// ─── TRACKING ENGINE ──────────────────────────────────────────────
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;
const _source = "nfc";

const trackEvent = (event, data = {}) => {
  const _deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile"
    : /Tablet|iPad/i.test(navigator.userAgent) ? "tablet"
    : "desktop";
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    portalType: "vip",
    vipId: "KM-001",
    vipName: "Khalid Al-Mansouri",
    portal: "automotive",
    source: _source,
    deviceType: _deviceType,
    event,
    ...data,
  };
  try {
    let events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    if (events.length > 200) events = events.slice(-200);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch (e) {}
  _bc?.postMessage(ev);
  bridgeEventToFirestore(ev);
  return ev;
};

// ─── i18n (inline — en/ar/es/fr) ─────────────────────────────────
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP Access", lang: "العربية", compare: "Compare", favorites: "Favorites" },
    crossnav: { hub: "Demo Hub", vipPerf: "VIP Performance", vipFamily: "VIP Family", showroom: "Public Showroom", dashboard: "Dashboard", ai: "AI Pipeline" },
    hero: {
      badge: "Private Showroom",
      greeting: "Welcome,",
      titleLine1: "Your Private", titleEm: "Showroom", titleLine2: "Awaits",
      tagline: "Your Private Showroom Awaits",
      subtitle: "A curated selection of premium vehicles, handpicked for discerning collectors who demand nothing less than extraordinary performance and luxury.",
      cta: "Explore Vehicles",
      ctaSecondary: "Book Test Drive",
    },
    stats: { models: "Models Curated", collections: "Collections", access: "VIP Access", advisor: "Personal Advisor" },
    sections: {
      collections: "Vehicle Collections",
      collectionsSub: "Select a Collection to Explore",
      vehicles: "The Vehicles",
      vehiclesSub: "Curated for Your Preferences",
      vehiclesHint: "Select any vehicle to explore full details",
      contact: "Book a Private Test Drive",
      contactSub: "Your Personal Experience",
      contactHint: "Your dedicated advisor will prepare the vehicle and meet you at the showroom",
    },
    filters: { all: "All Models", performance: "AMG Performance", suv: "Luxury SUV", sedan: "Executive Sedan", ev: "Electric" },
    models: "Models",
    card: {
      from: "From",
      perMonth: "/mo",
      explore: "Explore",
      compare: "Compare",
      favorite: "Favorite",
    },
    detail: {
      overview: "Overview",
      configure: "Configure",
      finance: "Finance Calculator",
      engine: "Engine",
      hp: "Power",
      torque: "Torque",
      accel: "0-100 km/h",
      topSpeed: "Top Speed",
      drivetrain: "Drivetrain",
      features: "Features & Equipment",
      bookTestDrive: "Book Test Drive",
      requestPricing: "Request VIP Pricing",
      downloadBrochure: "Download Brochure",
      callAdvisor: "Call Advisor",
    },
    configure: {
      exterior: "Exterior Color",
      interior: "Interior",
      yourConfig: "Your Configuration",
      exterior_label: "exterior",
      interior_label: "interior",
      saveConfig: "Save Configuration",
      configSaved: "Configuration saved!",
    },
    finance: {
      vehiclePrice: "Vehicle Price",
      downPayment: "Down Payment",
      term: "Term (Months)",
      monthlyPayment: "Est. Monthly Payment",
      lease: "Lease",
      financeBtn: "Finance",
      rate: "Rate",
      requestQuote: "Request Personalized Quote",
    },
    compare: {
      title: "Vehicle Comparison",
      feature: "Feature",
      remove: "Remove",
      price: "Price",
      engine: "Engine",
      hp: "Power",
      torque: "Torque",
      accel: "0-100",
      topSpeed: "Top Speed",
      drivetrain: "Drivetrain",
      lease: "Monthly Lease",
      empty: "Add vehicles to compare by clicking the ⚖️ icon on vehicle cards.",
    },
    booking: {
      name: "Full Name", email: "Email", phone: "Phone",
      vehicle: "Preferred Vehicle", date: "Preferred Date", time: "Preferred Time",
      notes: "Special Requests", submit: "Request Test Drive",
      note: "Your information is protected. We will contact you within 24 hours.",
      morning: "Morning (9AM-12PM)", afternoon: "Afternoon (12PM-4PM)", evening: "Evening (4PM-7PM)",
      success: "Test Drive Request Submitted",
      successDesc: "Your personal advisor will contact you within 24 hours to confirm your private test drive experience.",
      successRef: "Reference",
    },
    toast: {
      brochure: "Brochure downloaded",
      pricing: "VIP pricing request sent",
      booking: "Test drive request submitted",
      compare: "Added to comparison",
      compareRemove: "Removed from comparison",
      favorite: "Added to favorites",
      favoriteRemove: "Removed from favorites",
      configSaved: "Configuration saved",
      quoteRequested: "Personalized quote requested",
      advisorNotified: "Your personal advisor has been notified",
    },
    status: { available: "Available", reserved: "Reserved", sold: "Sold" },
    footer: "This is a private VIP showroom. Content is personalized for your exclusive access.",
    poweredBy: "Powered by",
  },
  ar: {
    dir: "ltr",
    nav: { vip: "وصول VIP", lang: "English", compare: "مقارنة", favorites: "المفضلة" },
    crossnav: { hub: "مركز العرض", vipPerf: "VIP أداء", vipFamily: "VIP عائلي", showroom: "صالة العرض", dashboard: "لوحة التحكم", ai: "خط أنابيب الذكاء" },
    hero: {
      badge: "صالة عرض خاصة",
      greeting: "مرحبًا،",
      titleLine1: "صالة عرضك", titleEm: "الخاصة", titleLine2: "بانتظارك",
      tagline: "صالة عرضك الخاصة بانتظارك",
      subtitle: "مجموعة مختارة من السيارات الفاخرة، مختارة بعناية لهواة التميز الذين لا يقبلون بأقل من الأداء الاستثنائي والفخامة.",
      cta: "استكشف السيارات",
      ctaSecondary: "حجز تجربة قيادة",
    },
    stats: { models: "سيارات مختارة", collections: "مجموعات", access: "وصول VIP", advisor: "مستشار شخصي" },
    sections: {
      collections: "مجموعات السيارات",
      collectionsSub: "اختر مجموعة للاستكشاف",
      vehicles: "السيارات",
      vehiclesSub: "مختارة حسب تفضيلاتك",
      vehiclesHint: "اختر أي سيارة لاستكشاف التفاصيل الكاملة",
      contact: "حجز تجربة قيادة خاصة",
      contactSub: "تجربتك الشخصية",
      contactHint: "سيقوم مستشارك المخصص بإعداد السيارة واستقبالك في صالة العرض",
    },
    filters: { all: "جميع الموديلات", performance: "AMG الأداء", suv: "SUV الفاخرة", sedan: "سيدان التنفيذية", ev: "كهربائية" },
    models: "موديلات",
    card: {
      from: "من",
      perMonth: "/شهريًا",
      explore: "استكشف",
      compare: "مقارنة",
      favorite: "مفضلة",
    },
    detail: {
      overview: "نظرة عامة",
      configure: "التكوين",
      finance: "حاسبة التمويل",
      engine: "المحرك",
      hp: "القوة",
      torque: "عزم الدوران",
      accel: "0-100 كم/س",
      topSpeed: "السرعة القصوى",
      drivetrain: "نظام الدفع",
      features: "الميزات والتجهيزات",
      bookTestDrive: "حجز تجربة قيادة",
      requestPricing: "طلب أسعار VIP",
      downloadBrochure: "تحميل الكتيب",
      callAdvisor: "الاتصال بالمستشار",
    },
    configure: {
      exterior: "اللون الخارجي",
      interior: "الداخلية",
      yourConfig: "تكوينك",
      exterior_label: "خارجي",
      interior_label: "داخلي",
      saveConfig: "حفظ التكوين",
      configSaved: "تم حفظ التكوين!",
    },
    finance: {
      vehiclePrice: "سعر السيارة",
      downPayment: "الدفعة الأولى",
      term: "المدة (أشهر)",
      monthlyPayment: "الدفعة الشهرية المقدرة",
      lease: "تأجير",
      financeBtn: "تمويل",
      rate: "النسبة",
      requestQuote: "طلب عرض سعر مخصص",
    },
    compare: {
      title: "مقارنة السيارات",
      feature: "الميزة",
      remove: "إزالة",
      price: "السعر",
      engine: "المحرك",
      hp: "القوة",
      torque: "عزم الدوران",
      accel: "0-100",
      topSpeed: "السرعة القصوى",
      drivetrain: "نظام الدفع",
      lease: "الإيجار الشهري",
      empty: "أضف سيارات للمقارنة بالنقر على أيقونة ⚖️ على بطاقات السيارات.",
    },
    booking: {
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      vehicle: "السيارة المفضلة", date: "التاريخ المفضل", time: "الوقت المفضل",
      notes: "طلبات خاصة", submit: "طلب تجربة قيادة",
      note: "يتم حماية معلوماتك. سنتواصل معك خلال 24 ساعة.",
      morning: "الصباح (9ص-12م)", afternoon: "بعد الظهر (12م-4م)", evening: "المساء (4م-7م)",
      success: "تم تقديم طلب تجربة القيادة",
      successDesc: "سيتواصل معك مستشارك الشخصي خلال 24 ساعة لتأكيد تجربة القيادة الخاصة بك.",
      successRef: "المرجع",
    },
    toast: {
      brochure: "تم تحميل الكتيب",
      pricing: "تم إرسال طلب أسعار VIP",
      booking: "تم تقديم طلب تجربة القيادة",
      compare: "تمت الإضافة للمقارنة",
      compareRemove: "تمت الإزالة من المقارنة",
      favorite: "تمت الإضافة للمفضلة",
      favoriteRemove: "تمت الإزالة من المفضلة",
      configSaved: "تم حفظ التكوين",
      quoteRequested: "تم طلب عرض سعر مخصص",
      advisorNotified: "تم إخطار مستشارك الشخصي",
    },
    status: { available: "متاح", reserved: "محجوز", sold: "مباع" },
    footer: "هذه صالة عرض VIP خاصة. المحتوى مخصص لوصولك الحصري.",
    poweredBy: "مشغل بواسطة",
  },
  es: {
    dir: "ltr",
    nav: { vip: "Acceso VIP", lang: "English", compare: "Comparar", favorites: "Favoritos" },
    crossnav: { hub: "Centro Demo", vipPerf: "VIP Rendimiento", vipFamily: "VIP Familiar", showroom: "Sala Pública", dashboard: "Panel", ai: "Pipeline IA" },
    hero: { badge: "Sala Privada", greeting: "Bienvenido,", titleLine1: "Su Sala", titleEm: "Privada", titleLine2: "Le Espera", tagline: "Su sala privada le espera", subtitle: "Una selección curada de vehículos premium, elegidos para coleccionistas exigentes.", cta: "Explorar Vehículos", ctaSecondary: "Reservar Prueba" },
    stats: { models: "Modelos Curados", collections: "Colecciones", access: "Acceso VIP", advisor: "Asesor Personal" },
    sections: { collections: "Colecciones", collectionsSub: "Seleccione una Colección", vehicles: "Los Vehículos", vehiclesSub: "Curados para Sus Preferencias", vehiclesHint: "Seleccione cualquier vehículo para ver detalles", contact: "Reservar Prueba Privada", contactSub: "Su Experiencia Personal", contactHint: "Su asesor preparará el vehículo y le recibirá en la sala" },
    filters: { all: "Todos", performance: "AMG Performance", suv: "SUV de Lujo", sedan: "Sedán Ejecutivo", ev: "Eléctrico" },
    models: "Modelos",
    card: { from: "Desde", perMonth: "/mes", explore: "Explorar", compare: "Comparar", favorite: "Favorito" },
    detail: { overview: "Resumen", configure: "Configurar", finance: "Calculadora", engine: "Motor", hp: "Potencia", torque: "Par", accel: "0-100 km/h", topSpeed: "Vel. Máxima", drivetrain: "Tracción", features: "Equipamiento", bookTestDrive: "Reservar Prueba", requestPricing: "Precio VIP", downloadBrochure: "Descargar Folleto", callAdvisor: "Llamar Asesor" },
    configure: { exterior: "Color Exterior", interior: "Interior", yourConfig: "Su Configuración", exterior_label: "exterior", interior_label: "interior", saveConfig: "Guardar", configSaved: "¡Configuración guardada!" },
    finance: { vehiclePrice: "Precio", downPayment: "Anticipo", term: "Plazo (Meses)", monthlyPayment: "Pago Mensual Est.", lease: "Arrendamiento", financeBtn: "Financiar", rate: "Tasa", requestQuote: "Solicitar Cotización" },
    compare: { title: "Comparación", feature: "Característica", remove: "Quitar", price: "Precio", engine: "Motor", hp: "Potencia", torque: "Par", accel: "0-100", topSpeed: "Vel. Máx.", drivetrain: "Tracción", lease: "Arrendamiento Mensual", empty: "Añada vehículos con el icono ⚖️ en las tarjetas." },
    booking: { name: "Nombre", email: "Email", phone: "Teléfono", vehicle: "Vehículo", date: "Fecha", time: "Hora", notes: "Solicitudes", submit: "Solicitar Prueba", note: "Su información está protegida. Contactaremos en 24 horas.", morning: "Mañana (9-12)", afternoon: "Tarde (12-16)", evening: "Noche (16-19)", success: "Solicitud Enviada", successDesc: "Su asesor le contactará en 24 horas.", successRef: "Referencia" },
    toast: { brochure: "Folleto descargado", pricing: "Solicitud de precio enviada", booking: "Prueba solicitada", compare: "Añadido a comparación", compareRemove: "Eliminado de comparación", favorite: "Añadido a favoritos", favoriteRemove: "Eliminado de favoritos", configSaved: "Configuración guardada", quoteRequested: "Cotización solicitada", advisorNotified: "Asesor notificado" },
    status: { available: "Disponible", reserved: "Reservado", sold: "Vendido" },
    footer: "Sala VIP privada. Contenido personalizado para su acceso exclusivo.",
    poweredBy: "Desarrollado por",
  },
  fr: {
    dir: "ltr",
    nav: { vip: "Accès VIP", lang: "English", compare: "Comparer", favorites: "Favoris" },
    crossnav: { hub: "Hub Démo", vipPerf: "VIP Performance", vipFamily: "VIP Famille", showroom: "Salle Publique", dashboard: "Tableau de bord", ai: "Pipeline IA" },
    hero: { badge: "Salle Privée", greeting: "Bienvenue,", titleLine1: "Votre Salle", titleEm: "Privée", titleLine2: "Vous Attend", tagline: "Votre salle privée vous attend", subtitle: "Une sélection de véhicules premium, choisis pour les collectionneurs exigeants.", cta: "Explorer", ctaSecondary: "Réserver un Essai" },
    stats: { models: "Modèles", collections: "Collections", access: "Accès VIP", advisor: "Conseiller" },
    sections: { collections: "Collections", collectionsSub: "Choisissez une Collection", vehicles: "Les Véhicules", vehiclesSub: "Sélectionnés pour Vous", vehiclesHint: "Sélectionnez un véhicule pour les détails", contact: "Réserver un Essai Privé", contactSub: "Votre Expérience", contactHint: "Votre conseiller préparera le véhicule et vous accueillera" },
    filters: { all: "Tous", performance: "AMG Performance", suv: "SUV de Luxe", sedan: "Berline Exécutive", ev: "Électrique" },
    models: "Modèles",
    card: { from: "À partir de", perMonth: "/mois", explore: "Explorer", compare: "Comparer", favorite: "Favori" },
    detail: { overview: "Aperçu", configure: "Configurer", finance: "Calculateur", engine: "Moteur", hp: "Puissance", torque: "Couple", accel: "0-100 km/h", topSpeed: "Vitesse Max", drivetrain: "Transmission", features: "Équipements", bookTestDrive: "Réserver Essai", requestPricing: "Prix VIP", downloadBrochure: "Télécharger Brochure", callAdvisor: "Appeler Conseiller" },
    configure: { exterior: "Couleur Extérieure", interior: "Intérieur", yourConfig: "Votre Configuration", exterior_label: "extérieur", interior_label: "intérieur", saveConfig: "Enregistrer", configSaved: "Configuration enregistrée !" },
    finance: { vehiclePrice: "Prix", downPayment: "Acompte", term: "Durée (Mois)", monthlyPayment: "Mensualité Est.", lease: "Location", financeBtn: "Financer", rate: "Taux", requestQuote: "Demander un Devis" },
    compare: { title: "Comparaison", feature: "Caractéristique", remove: "Retirer", price: "Prix", engine: "Moteur", hp: "Puissance", torque: "Couple", accel: "0-100", topSpeed: "V. Max", drivetrain: "Transmission", lease: "Location Mensuelle", empty: "Ajoutez des véhicules via l'icône ⚖️." },
    booking: { name: "Nom", email: "Email", phone: "Téléphone", vehicle: "Véhicule", date: "Date", time: "Heure", notes: "Demandes", submit: "Demander Essai", note: "Vos informations sont protégées. Contact sous 24 h.", morning: "Matin (9h-12h)", afternoon: "Après-midi (12h-16h)", evening: "Soir (16h-19h)", success: "Demande Envoyée", successDesc: "Votre conseiller vous contactera sous 24 h.", successRef: "Référence" },
    toast: { brochure: "Brochure téléchargée", pricing: "Demande de prix envoyée", booking: "Essai demandé", compare: "Ajouté à la comparaison", compareRemove: "Retiré de la comparaison", favorite: "Ajouté aux favoris", favoriteRemove: "Retiré des favoris", configSaved: "Configuration enregistrée", quoteRequested: "Devis demandé", advisorNotified: "Conseiller notifié" },
    status: { available: "Disponible", reserved: "Réservé", sold: "Vendu" },
    footer: "Salle VIP privée. Contenu personnalisé pour votre accès exclusif.",
    poweredBy: "Propulsé par",
  },
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function AutomotivePortal() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, regionId, region } = usePortalRegion("automotive", lang);
  const vehicles = usePortalVehicles("vip");
  const vipPersona = getAutoPersona(regionId, "vip");
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailTab, setDetailTab] = useState("overview");
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const [bookingOk, setBookingOk] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", date: "", time: "", notes: "" });
  const [formErr, setFormErr] = useState({});
  // Configure state
  const [selColor, setSelColor] = useState(0);
  const [selInterior, setSelInterior] = useState(0);
  // Finance state
  const [finMode, setFinMode] = useState("lease");
  const [downPct, setDownPct] = useState(20);
  const [finTerm, setFinTerm] = useState(48);

  const vehRef = useRef(null);
  const bookRef = useRef(null);
  const t = LANG[lang] || LANG.en;

  const nextLang = region.languages.find((l) => l !== lang) || region.languages[0];
  const toggleLang = () => {
    const n = region.languages.find((l) => l !== lang) || region.languages[0];
    setLang(n);
    document.documentElement.lang = n;
    document.documentElement.dir = n === "ar" ? "rtl" : "ltr";
    trackEvent("language_switch", { to: n });
  };

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".ap-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, modal, selectedVehicle, filter]);

  // Track entry
  useEffect(() => { trackEvent("auto_portal_entry", { language: lang }); }, []);

  const vipName = getPersonaName(vipPersona, lang) || "VIP Guest";

  const showToast = useCallback((msg, icon = "✓") => {
    setToastHiding(false);
    setToast({ msg, icon });
    setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000);
  }, []);

  // Filter vehicles
  const filtered = filter === "all" ? vehicles : vehicles.filter(v => v.collection === filter);
  const activeCollections = [...new Set(vehicles.map((v) => v.collection))];
  const filterTabs = [
    { key: "all", label: t.filters.all },
    ...activeCollections.map((key) => ({ key, label: t.filters[key] || COLLECTIONS[key]?.name?.[lang] || key })),
  ];

  // Compare
  const toggleCompare = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) { showToast(t.toast.compareRemove, "↩"); trackEvent("compare_remove", { vehicleId: id }); return prev.filter(x => x !== id); }
      if (prev.length >= 3) return prev;
      trackEvent("compare_add", { vehicleId: id });
      showToast(t.toast.compare, "⚖️");
      return [...prev, id];
    });
  };

  // Favorites
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) { showToast(t.toast.favoriteRemove, "↩"); trackEvent("favorite_toggle", { vehicleId: id, action: "remove" }); return prev.filter(x => x !== id); }
      trackEvent("favorite_toggle", { vehicleId: id, action: "add" });
      showToast(t.toast.favorite, "♥");
      return [...prev, id];
    });
  };

  // Open detail
  const openDetail = (v) => {
    setSelectedVehicle(v); setDetailTab("overview"); setSelColor(0); setSelInterior(0); setDownPct(20); setFinTerm(48); setFinMode("lease");
    trackEvent("vehicle_view", {
      vehicleId: v.id,
      vehicleName: vName(v, lang),
      unitName: vName(v, lang),
      tower: v.collection,
      unitType: v.collection,
      price: v.priceLocal,
    });
  };
  const closeAll = () => { setSelectedVehicle(null); setModal(null); };

  // Booking
  const validateForm = () => {
    const err = {};
    if (!form.name.trim()) err.name = true;
    if (!form.email.trim() || !form.email.includes("@")) err.email = true;
    if (!form.phone.trim()) err.phone = true;
    setFormErr(err);
    return Object.keys(err).length === 0;
  };

  const submitBooking = async () => {
    if (!validateForm()) return;
    const ref = "TD-" + Date.now().toString(36).toUpperCase().slice(-6);
    trackEvent("test_drive_request", { vehicleId: form.vehicle || "general", name: form.name, date: form.date, time: form.time });
    try {
      await fetch("/contact-form", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: `Auto Demo — Test Drive Request — ${form.name}`, _template: "table", Name: form.name, Email: form.email, Phone: form.phone, Vehicle: form.vehicle, Date: form.date, Time: form.time, Notes: form.notes, Reference: ref }),
      });
    } catch (e) {}
    setBookingRef(ref);
    setBookingOk(true);
    showToast(t.toast.booking, "🏎️");
  };

  // Finance calc
  const calcMonthly = (price, dp, term, mode) => {
    const principal = price * (1 - dp / 100);
    const rate = mode === "lease" ? 0.029 : 0.049;
    const monthlyRate = rate / 12;
    if (monthlyRate === 0) return principal / term;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  };

  const getStatusColor = (s) => s === "available" ? "#2D8F6F" : s === "reserved" ? "#b8860b" : "#C1121F";
  const getStatusLabel = (s) => t.status[s] || s;

  return (
    <div className="ap-page" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title="Automotive" description="NFC-powered VIP showroom experiences for luxury automotive dealers. Test drive bookings, configurations, and real-time analytics." path="/automotive" />
      {/* Cross-Nav */}
      <div className={`ap-crossnav ${scrolled ? "show" : ""}`}>
        <Link to="/automotive/demo" style={{ color: "var(--ap-t3)" }}>← {t.crossnav.hub}</Link>
        <span className="active">{t.crossnav.vipPerf}</span>
        <Link to="/automotive/demo/sultan">{t.crossnav.vipFamily}</Link>
        <Link to="/automotive/demo/showroom">{t.crossnav.showroom}</Link>
        <Link to="/automotive/dashboard">{t.crossnav.dashboard}</Link>
        <Link to="/automotive/demo/ai">{t.crossnav.ai}</Link>
        <span className="crossnav-persona">👤 {vipName}</span>
      </div>
      {/* ── HEADER ── */}
      <header className={`ap-hd ${scrolled ? "sc" : ""}`}>
        <Link to="/automotive" className="ap-logo">{projectName(lang)}</Link>
        <div className="ap-nav">
          <div className="ap-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="ap-navbtn" onClick={() => setModal("compare")}>
              {t.nav.compare}<span className="ap-cmp-count">{compareList.length}</span>
            </button>
          )}
          <button className="ap-navbtn" onClick={toggleLang}>{LANG_LABEL[nextLang]}</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="ap-hero">
        <div className="ap-hero-bg" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-ct">
          <div className="ap-pvt">{t.hero.badge}</div>
          <p className="ap-greet">{t.hero.greeting} <span>{vipName}</span></p>
          <h1 className="ap-htitle">
            {t.hero.titleLine1}<br /><em>{t.hero.titleEm}</em> {t.hero.titleLine2}
          </h1>
          <p className="ap-hdesc">{t.hero.subtitle}</p>
          <div className="ap-hacts">
            <button className="ap-btn-g" onClick={() => { trackEvent("cta_explore"); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="ap-btn-o" onClick={() => { trackEvent("cta_booking"); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ap-stats">
        {[
          { v: String(vehicles.length), l: t.stats.models },
          { v: String(activeCollections.length), l: t.stats.collections },
          { v: "VIP", l: t.stats.access },
          { v: "24/7", l: t.stats.advisor },
        ].map((s, i) => (
          <div className="ap-stat" key={i}>
            <div className="ap-stat-v">{s.v}</div>
            <div className="ap-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── COLLECTIONS ── */}
      <section className="ap-sec">
        <div className="ap-sh ap-rv">
          <span className="ap-sl">◆ {t.sections.collections}</span>
          <h2 className="ap-st">{t.sections.collectionsSub}</h2>
        </div>
        <div className="ap-colls">
          {Object.values(COLLECTIONS).filter((c) => activeCollections.includes(c.id)).map((c) => {
            const count = vehicles.filter(v => v.collection === c.id).length;
            return (
              <div className="ap-coll ap-rv" key={c.id} onClick={() => { setFilter(c.id); trackEvent("collection_view", { collection: c.id }); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className="ap-coll-accent" style={{ background: c.accent }} />
                <img src={c.image} alt={c.name[lang] || c.name.en} loading="lazy" />
                <div className="ap-coll-ov" />
                <div className="ap-coll-ct">
                  <div className="ap-coll-name">{c.name[lang] || c.name.en}</div>
                  <div className="ap-coll-desc">{c.desc[lang] || c.desc.en}</div>
                  <div className="ap-coll-count">{count} {t.models}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      {/* ── VEHICLES ── */}
      <section className="ap-sec" ref={vehRef}>
        <div className="ap-sh ap-rv">
          <span className="ap-sl">◆ {t.sections.vehicles}</span>
          <h2 className="ap-st">{t.sections.vehiclesSub}</h2>
          <p className="ap-ss">{t.sections.vehiclesHint}</p>
        </div>

        {/* Filter Tabs */}
        <div className="ap-filters">
          {filterTabs.map(f => (
            <button key={f.key} className={`ap-filter ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="ap-vehicles">
          {filtered.map((v) => (
            <div className="ap-vcard ap-rv" key={v.id} onClick={() => openDetail(v)}>
              <div className="ap-vcard-img">
                <img src={v.image} alt={vName(v, lang)} loading="lazy" />
                <div className="ap-vcard-collection">{COLLECTIONS[v.collection]?.name[lang] || COLLECTIONS[v.collection]?.name.en}</div>
                <div className="ap-vcard-status" style={{ background: getStatusColor(v.status) }}>{getStatusLabel(v.status)}</div>
              </div>
              <div className="ap-vcard-body">
                <h3 className="ap-vcard-name">{vName(v, lang)}</h3>
                <div className="ap-vcard-specs">
                  <span className="ap-vcard-spec">{v.specs.hp}</span>
                  <span className="ap-vcard-spec">{v.specs.acceleration}</span>
                  <span className="ap-vcard-spec">{v.specs.drivetrain[lang] || v.specs.drivetrain.en}</span>
                </div>
                <div className="ap-vcard-price">{t.card.from} {fmtCurrency(v.priceLocal)}</div>
                <div className="ap-vcard-lease">{fmtCurrency(v.monthlyLease)}{t.card.perMonth}</div>
              </div>
              <div className="ap-vcard-acts" onClick={(e) => e.stopPropagation()}>
                <button className="ap-btn-o ap-btn-sm" onClick={() => openDetail(v)}>🔍 {t.card.explore}</button>
                <button className="ap-btn-o ap-btn-sm" onClick={() => toggleCompare(v.id)} style={compareList.includes(v.id) ? { borderColor: "var(--ap-gold) !important", color: "var(--ap-gold) !important", background: "rgba(197,164,103,0.1) !important" } : {}}>
                  {compareList.includes(v.id) ? `✓` : `⚖️`} {t.card.compare}
                </button>
                <button className="ap-btn-o ap-btn-sm" onClick={() => toggleFavorite(v.id)} style={favorites.includes(v.id) ? { borderColor: "#e63946 !important", color: "#e63946 !important" } : {}}>
                  {favorites.includes(v.id) ? "♥" : "♡"} {t.card.favorite}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      {/* ── BOOKING ── */}
      <section className="ap-sec ap-contact" ref={bookRef}>
        <div className="ap-sh ap-rv">
          <span className="ap-sl">◆ {t.sections.contact}</span>
          <h2 className="ap-st">{t.sections.contactSub}</h2>
          <p className="ap-ss">{t.sections.contactHint}</p>
        </div>

        {bookingOk ? (
          <div className="ap-book-ok ap-rv">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏎️</div>
            <h3>{t.booking.success}</h3>
            <p>{t.booking.successDesc}</p>
            <p style={{ color: "var(--ap-gold)", fontFamily: "var(--ap-serif)", fontSize: "1.2rem" }}>
              {t.booking.successRef}: {bookingRef}
            </p>
          </div>
        ) : (
          <div className="ap-form ap-rv">
            <div className="ap-fg">
              <label className="ap-flabel">{t.booking.name}</label>
              <input className={`ap-finput ${formErr.name ? "ap-err" : ""}`} type="text" defaultValue={vipName} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="ap-fg">
              <label className="ap-flabel">{t.booking.email}</label>
              <input className={`ap-finput ${formErr.email ? "ap-err" : ""}`} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="ap-fg">
              <label className="ap-flabel">{t.booking.phone}</label>
              <input className={`ap-finput ${formErr.phone ? "ap-err" : ""}`} type="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="ap-fg">
              <label className="ap-flabel">{t.booking.vehicle}</label>
              <select className="ap-fsel" onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                <option value="">—</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{vName(v, lang)} — {fmtCurrency(v.priceLocal)}</option>)}
              </select>
            </div>
            <div className="ap-frow">
              <div className="ap-fg">
                <label className="ap-flabel">{t.booking.date}</label>
                <input className="ap-finput" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="ap-fg">
                <label className="ap-flabel">{t.booking.time}</label>
                <select className="ap-fsel" onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  <option value="">—</option>
                  <option value="morning">{t.booking.morning}</option>
                  <option value="afternoon">{t.booking.afternoon}</option>
                  <option value="evening">{t.booking.evening}</option>
                </select>
              </div>
            </div>
            <div className="ap-fg">
              <label className="ap-flabel">{t.booking.notes}</label>
              <input className="ap-finput" type="text" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>
              {t.booking.submit} →
            </button>
            <p className="ap-fnote">{t.booking.note}</p>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="ap-ft">
        <p>{t.footer}</p>
        <p><span className="ap-ft-brand">{t.poweredBy} </span><Link to="/" style={{ color: "var(--ap-gold)", textDecoration: "none", fontFamily: "var(--ap-serif)" }}>DynamicNFC</Link></p>
      </footer>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VEHICLE DETAIL MODAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {selectedVehicle && (
        <div className="ap-modal-ov" onClick={closeAll}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ap-modal-x" onClick={closeAll}>✕</button>
            <img className="ap-md-img" src={selectedVehicle.image} alt={vName(selectedVehicle, lang)} />
            <div className="ap-modal-body">
              <div className="ap-md-top">
                <div>
                  <h2 className="ap-md-title">{vName(selectedVehicle, lang)}</h2>
                  <p className="ap-md-coll">{COLLECTIONS[selectedVehicle.collection]?.name[lang] || COLLECTIONS[selectedVehicle.collection]?.name.en}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div className="ap-md-price">{fmtCurrency(selectedVehicle.priceLocal)}</div>
                  <div className="ap-md-lease">{fmtCurrency(selectedVehicle.monthlyLease)}{t.card.perMonth} {t.finance.lease}</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="ap-tabs">
                {["overview", "configure", "finance"].map(tab => (
                  <button key={tab} className={`ap-tab ${detailTab === tab ? "active" : ""}`} onClick={() => setDetailTab(tab)}>
                    {tab === "overview" ? t.detail.overview : tab === "configure" ? t.detail.configure : t.detail.finance}
                  </button>
                ))}
              </div>

              {/* ── TAB: OVERVIEW ── */}
              {detailTab === "overview" && (
                <>
                  <div className="ap-specs-grid">
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.engine}</div><div className="ap-spec-val">{selectedVehicle.specs.engine[lang] || selectedVehicle.specs.engine.en}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.hp}</div><div className="ap-spec-val">{selectedVehicle.specs.hp}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.torque}</div><div className="ap-spec-val">{selectedVehicle.specs.torque}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.accel}</div><div className="ap-spec-val">{selectedVehicle.specs.acceleration}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.topSpeed}</div><div className="ap-spec-val">{selectedVehicle.specs.topSpeed}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.drivetrain}</div><div className="ap-spec-val">{selectedVehicle.specs.drivetrain[lang] || selectedVehicle.specs.drivetrain.en}</div></div>
                  </div>
                  <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{t.detail.features}</h4>
                  <div className="ap-md-feats">
                    {(selectedVehicle.features[lang] || selectedVehicle.features.en).map((f, i) => <span className="ap-md-feat" key={i}>{f}</span>)}
                  </div>
                  <div className="ap-md-acts">
                    <button className="ap-btn-g ap-btn-sm" onClick={() => { closeAll(); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>🏎️ {t.detail.bookTestDrive}</button>
                    <button className="ap-btn-g ap-btn-sm" onClick={() => { trackEvent("pricing_request", { vehicleId: selectedVehicle.id, vehicleName: vName(selectedVehicle, lang) }); showToast(t.toast.pricing, "💰"); }}>💰 {t.detail.requestPricing}</button>
                    <button className="ap-btn-o ap-btn-sm" onClick={() => { trackEvent("brochure_download", { vehicleId: selectedVehicle.id, vehicleName: vName(selectedVehicle, lang) }); showToast(t.toast.brochure, "📄"); }}>📄 {t.detail.downloadBrochure}</button>
                    <button className="ap-btn-o ap-btn-sm" onClick={() => { trackEvent("contact_advisor"); showToast(t.toast.advisorNotified, "📞"); }}>📞 {t.detail.callAdvisor}</button>
                  </div>
                </>
              )}

              {/* ── TAB: CONFIGURE ── */}
              {detailTab === "configure" && (
                <>
                  <div className="ap-config-section">
                    <div className="ap-config-label">{t.configure.exterior}</div>
                    <div className="ap-swatches">
                      {selectedVehicle.colors.map((c, i) => (
                        <div key={i} className={`ap-swatch ${selColor === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelColor(i); trackEvent("color_select", { vehicleId: selectedVehicle.id, color: vColorName(c, lang) }); }} title={vColorName(c, lang)} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--ap-t2)", marginTop: "1rem" }}>
                      {vColorName(selectedVehicle.colors[selColor], lang)}
                    </p>
                  </div>
                  <div className="ap-config-section">
                    <div className="ap-config-label">{t.configure.interior}</div>
                    <div className="ap-swatches">
                      {selectedVehicle.interiors.map((c, i) => (
                        <div key={i} className={`ap-swatch ${selInterior === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelInterior(i); trackEvent("interior_select", { vehicleId: selectedVehicle.id, interior: vColorName(c, lang) }); }} title={vColorName(c, lang)} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--ap-t2)", marginTop: "1rem" }}>
                      {vColorName(selectedVehicle.interiors[selInterior], lang)}
                    </p>
                  </div>
                  <div className="ap-config-summary">
                    <h4>{t.configure.yourConfig}</h4>
                    <p>
                      {vColorName(selectedVehicle.colors[selColor], lang)} {t.configure.exterior_label} ·{" "}
                      {vColorName(selectedVehicle.interiors[selInterior], lang)} {t.configure.interior_label}
                    </p>
                  </div>
                  <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }} onClick={() => {
                    trackEvent("config_save", { vehicleId: selectedVehicle.id, color: vColorName(selectedVehicle.colors[selColor], lang), interior: vColorName(selectedVehicle.interiors[selInterior], lang) });
                    try { localStorage.setItem(`ap_config_${selectedVehicle.id}`, JSON.stringify({ color: selColor, interior: selInterior })); } catch(e){}
                    showToast(t.toast.configSaved, "✓");
                  }}>
                    {t.configure.saveConfig}
                  </button>
                </>
              )}

              {/* ── TAB: FINANCE ── */}
              {detailTab === "finance" && (() => {
                const monthly = calcMonthly(selectedVehicle.priceLocal, downPct, finTerm, finMode);
                return (
                  <>
                    <div className="ap-fin-toggle">
                      <button className={`ap-fin-tog-btn ${finMode === "lease" ? "active" : ""}`} onClick={() => setFinMode("lease")}>{t.finance.lease}</button>
                      <button className={`ap-fin-tog-btn ${finMode === "finance" ? "active" : ""}`} onClick={() => setFinMode("finance")}>{t.finance.financeBtn}</button>
                    </div>
                    <div className="ap-fin-field">
                      <div className="ap-fin-label"><span>{t.finance.vehiclePrice}</span><span style={{ color: "var(--ap-gold)" }}>{fmtCurrency(selectedVehicle.priceLocal)}</span></div>
                    </div>
                    <div className="ap-fin-field">
                      <div className="ap-fin-label"><span>{t.finance.downPayment}</span><span style={{ color: "var(--ap-gold)" }}>{downPct}% — {fmtCurrency(Math.round(selectedVehicle.priceLocal * downPct / 100))}</span></div>
                      <input type="range" className="ap-fin-slider" min="10" max="50" step="5" value={downPct} onChange={(e) => { setDownPct(Number(e.target.value)); trackEvent("finance_calc", { vehicleId: selectedVehicle.id, downPct: e.target.value }); }} />
                    </div>
                    <div className="ap-fin-field">
                      <div className="ap-fin-label"><span>{t.finance.term}</span></div>
                      <div className="ap-fin-terms">
                        {[24, 36, 48, 60].map(m => (
                          <button key={m} className={`ap-fin-term ${finTerm === m ? "active" : ""}`} onClick={() => setFinTerm(m)}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--ap-t3)", marginBottom: ".5rem", textAlign: "center" }}>
                      {t.finance.rate}: {finMode === "lease" ? "2.9%" : "4.9%"} APR
                    </div>
                    <div className="ap-fin-result">
                      <div className="ap-fin-result-label">{t.finance.monthlyPayment}</div>
                      <div className="ap-fin-result-val">{fmtCurrency(Math.round(monthly))}</div>
                    </div>
                    <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
                      trackEvent("quote_request", { vehicleId: selectedVehicle.id, vehicleName: vName(selectedVehicle, lang), mode: finMode, downPct, term: finTerm, monthly: Math.round(monthly) });
                      showToast(t.toast.quoteRequested, "📋");
                    }}>
                      {t.finance.requestQuote} →
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* COMPARE MODAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {modal === "compare" && (
        <div className="ap-modal-ov" onClick={closeAll}>
          <div className="ap-modal" style={{ maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
            <button className="ap-modal-x" onClick={closeAll}>✕</button>
            <div className="ap-modal-body">
              <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compare.title}</h2>
              {compareList.length === 0 ? (
                <div className="ap-cmp-empty">{t.compare.empty}</div>
              ) : (() => {
                const units = compareList.map(id => vehicles.find(v => v.id === id)).filter(Boolean);
                const cols = `180px repeat(${units.length}, 1fr)`;
                const rows = [
                  { label: t.compare.price, get: (v) => fmtCurrency(v.priceLocal) },
                  { label: t.compare.engine, get: (v) => v.specs.engine[lang] || v.specs.engine.en },
                  { label: t.compare.hp, get: (v) => v.specs.hp },
                  { label: t.compare.torque, get: (v) => v.specs.torque },
                  { label: t.compare.accel, get: (v) => v.specs.acceleration },
                  { label: t.compare.topSpeed, get: (v) => v.specs.topSpeed },
                  { label: t.compare.drivetrain, get: (v) => v.specs.drivetrain[lang] || v.specs.drivetrain.en },
                  { label: t.compare.lease, get: (v) => `${fmtCurrency(v.monthlyLease)}${t.card.perMonth}` },
                ];
                return (
                  <div className="ap-cmp-grid">
                    <div className="ap-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compare.feature}</div>
                      {units.map(v => (
                        <div key={v.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--ap-serif)", fontSize: "1rem", color: "var(--ap-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{vName(v, lang)}</div>
                          <button className="ap-cmp-rm" onClick={() => toggleCompare(v.id)}>{t.compare.remove}</button>
                        </div>
                      ))}
                    </div>
                    {rows.map((row, ri) => (
                      <div className="ap-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}>
                        <div className="ap-cmp-label">{row.label}</div>
                        {units.map(v => <div className="ap-cmp-val" key={v.id}>{row.get(v)}</div>)}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`ap-toast ${toastHiding ? "hiding" : ""}`}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
    </div>
  );
}
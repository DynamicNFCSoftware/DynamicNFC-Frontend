import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../../i18n';
import { bridgeEventToFirestore } from "../../services/portalFirestoreBridge";
import './SultanPortal.css';
import SEO from '../../components/SEO/SEO';

// ─── LOCAL IMAGE IMPORTS ────────────────────────────────────────────
import heroImg from "./assets/hero.jpg";
import collectionSuvImg from "./assets/collection-suv.jpg";
import collectionSedanImg from "./assets/collection-sedan.jpg";
import g63Img from "./assets/g63.jpg";
import gls600Img from "./assets/gls600.jpg";
import gle53Img from "./assets/gle53.jpg";
import s580Img from "./assets/s580.jpg";
import eqs580Img from "./assets/eqs580.jpg";

// ═══════════════════════════════════════════════════════════════════
// SULTAN AL-DHAHERI — Family VIP Portal
// ═══════════════════════════════════════════════════════════════════
// Design: Dark luxury with Blue/Teal accents (family-focused)
// Features: Vehicle Detail Modal (3 tabs), Color/Interior Config,
//           Finance Calculator, Comparison, Test Drive Booking, Toasts
//           Family Features badges, Cross-nav bar
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
    vipId: "SD-002",
    vipName: "Sultan Al-Dhaheri",
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

// ─── BILINGUAL CONTENT ───────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "Family VIP", lang: "العربية", compare: "Compare", favorites: "Favorites" },
    hero: {
      badge: "Private Showroom",
      greeting: "Welcome,",
      tagline: "The Perfect Family Fleet",
      subtitle: "Handpicked luxury vehicles for your family's comfort, safety, and prestige. Every model selected with your family's needs in mind.",
      cta: "Explore Vehicles",
      ctaSecondary: "Book Test Drive",
    },
    stats: { models: "Models Curated", collections: "Collections", access: "VIP Access", advisor: "Personal Advisor" },
    sections: {
      collections: "Vehicle Collections",
      collectionsSub: "Select a Collection to Explore",
      vehicles: "The Vehicles",
      vehiclesSub: "Curated for Your Family",
      vehiclesHint: "Select any vehicle to explore full details",
      contact: "Schedule Family Test Drive",
      contactSub: "Your Family Experience",
      contactHint: "Bring the whole family — we'll prepare child seats and a family-friendly test route",
    },
    filters: { all: "All Models", suv: "Luxury SUV", sedan: "Executive Sedan" },
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
      familyFeatures: "Family Features",
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
    nav: { vip: "عائلة VIP", lang: "English", compare: "مقارنة", favorites: "المفضلة" },
    hero: {
      badge: "صالة عرض خاصة",
      greeting: "مرحبًا،",
      tagline: "أسطول العائلة المثالي",
      subtitle: "سيارات فاخرة مختارة بعناية لراحة عائلتك وأمانها وهيبتها. كل موديل مختار مع مراعاة احتياجات عائلتك.",
      cta: "استكشف السيارات",
      ctaSecondary: "حجز تجربة قيادة",
    },
    stats: { models: "سيارات مختارة", collections: "مجموعات", access: "وصول VIP", advisor: "مستشار شخصي" },
    sections: {
      collections: "مجموعات السيارات",
      collectionsSub: "اختر مجموعة للاستكشاف",
      vehicles: "السيارات",
      vehiclesSub: "مختارة لعائلتك",
      vehiclesHint: "اختر أي سيارة لاستكشاف التفاصيل الكاملة",
      contact: "حجز تجربة قيادة عائلية",
      contactSub: "تجربة عائلتك",
      contactHint: "أحضر العائلة بأكملها — سنجهز مقاعد الأطفال ومسار اختبار مناسب للعائلة",
    },
    filters: { all: "جميع الموديلات", suv: "SUV الفاخرة", sedan: "سيدان التنفيذية" },
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
      familyFeatures: "ميزات العائلة",
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
};

// ─── VEHICLE DATA ─────────────────────────────────────────────────
const COLLECTIONS = {
  suv: {
    id: "suv",
    name: { en: "Luxury SUV", ar: "SUV الفاخرة" },
    desc: { en: "Command every road. Conquer every terrain.", ar: "تحكم بكل طريق. اغزُ كل تضاريس." },
    image: collectionSuvImg,
    accent: "#457b9d",
  },
  sedan: {
    id: "sedan",
    name: { en: "Executive Sedan", ar: "سيدان التنفيذية" },
    desc: { en: "Where luxury meets intelligence.", ar: "حيث يلتقي الفخامة بالذكاء." },
    image: collectionSedanImg,
    accent: "#2ec4b6",
  },
};

const VEHICLES = [
  {
    id: "g63", collection: "suv",
    name: "Mercedes-AMG G 63", nameAr: "مرسيدس-AMG G 63",
    image: g63Img,
    price: 225000,
    specs: { engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو" }, hp: "577 HP", torque: "627 lb-ft", acceleration: "4.5s", topSpeed: "220 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["Three Differential Locks", "MANUFAKTUR Interior", "Burmester 3D", "Night Package", "Off-Road Cockpit", "Transparent Hood"], ar: ["ثلاثة أقفال تفاضلية", "داخلية MANUFAKTUR", "Burmester ثلاثي الأبعاد", "حزمة Night", "قمرة الطرق الوعرة", "غطاء محرك شفاف"] },
    familyFeatures: { en: ["5 Star Safety Rating", "7 Seats Available", "Off-Road Family Adventures", "Child Lock System"], ar: ["تصنيف أمان ٥ نجوم", "٧ مقاعد متاحة", "مغامرات عائلية وعرة", "نظام قفل الأطفال"] },
    colors: [ { name: "MANUFAKTUR Olive", nameAr: "أخضر زيتوني MANUFAKTUR", hex: "#4a5028" }, { name: "Obsidian Black", nameAr: "أسود أوبسيديان", hex: "#0a0a0a" }, { name: "Polar White", nameAr: "أبيض بولار", hex: "#f5f5f0" }, { name: "Sunset Beam", nameAr: "شعاع الغروب", hex: "#e87f3f" } ],
    interiors: [ { name: "Macchiato Beige / Black", nameAr: "بيج ماكياتو / أسود", hex: "#c8b89a" }, { name: "Classic Red / Black", nameAr: "أحمر كلاسيكي / أسود", hex: "#8b1a1a" }, { name: "Neva Grey / Black", nameAr: "نيفا رمادي / أسود", hex: "#4a4a4a" } ],
    status: "available", monthlyLease: 3100,
  },
  {
    id: "gls600", collection: "suv",
    name: "Mercedes-Maybach GLS 600", nameAr: "مرسيدس-مايباخ GLS 600",
    image: gls600Img,
    price: 285000,
    specs: { engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو" }, hp: "550 HP", torque: "538 lb-ft", acceleration: "4.9s", topSpeed: "250 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["Maybach Executive Rear Seats", "Champagne Flutes", "Refrigerator", "Burmester 4D", "AIRMATIC", "Night Vision Assist"], ar: ["مقاعد مايباخ التنفيذية الخلفية", "كؤوس شامبانيا", "ثلاجة", "Burmester رباعي الأبعاد", "AIRMATIC", "مساعد الرؤية الليلية"] },
    familyFeatures: { en: ["Executive Family Cabin", "Rear Entertainment", "Child Seat Anchors", "Privacy Glass"], ar: ["مقصورة عائلية تنفيذية", "ترفيه خلفي", "مراسي مقاعد الأطفال", "زجاج خصوصي"] },
    colors: [ { name: "Two-Tone Obsidian/Mojave", nameAr: "لونين أوبسيديان / موجاف", hex: "#0a0a0a" }, { name: "Nautical Blue", nameAr: "أزرق بحري", hex: "#1a2f4a" }, { name: "Rubellite Red", nameAr: "أحمر روبيللايت", hex: "#6b1a2a" } ],
    interiors: [ { name: "Maybach Macchiato / Yacht Blue", nameAr: "مايباخ ماكياتو / أزرق يخت", hex: "#c8b89a" }, { name: "Maybach Armagnac / Black", nameAr: "مايباخ أرمانياك / أسود", hex: "#6b3a1a" } ],
    status: "reserved", monthlyLease: 4200,
  },
  {
    id: "gle53", collection: "suv",
    name: "AMG GLE 53 4MATIC+ Coupé", nameAr: "AMG GLE 53 4MATIC+ كوبيه",
    image: gle53Img,
    price: 135000,
    specs: { engine: { en: "3.0L I6 Turbo + EQ Boost", ar: "3.0 لتر 6 سلندر توربو + EQ Boost" }, hp: "429 HP", torque: "384 lb-ft", acceleration: "5.3s", topSpeed: "250 km/h", drivetrain: { en: "4MATIC+", ar: "4MATIC+" } },
    features: { en: ["AMG Body Styling", "Active Ride Control", "Burmester Sound", "MBUX", "AMG Night Package", "Panoramic Roof"], ar: ["تصميم هيكل AMG", "التحكم النشط في القيادة", "نظام Burmester", "MBUX", "حزمة AMG Night", "سقف بانورامي"] },
    familyFeatures: { en: ["Panoramic Roof", "Family Cargo Space", "Active Safety Systems", "Easy Entry"], ar: ["سقف بانورامي", "مساحة شحن عائلية", "أنظمة أمان نشطة", "دخول سهل"] },
    colors: [ { name: "Polar White", nameAr: "أبيض بولار", hex: "#f5f5f0" }, { name: "Obsidian Black", nameAr: "أسود أوبسيديان", hex: "#0a0a0a" } ],
    interiors: [ { name: "Black AMG Leather", nameAr: "جلد AMG أسود", hex: "#1a1a1a" } ],
    status: "available", monthlyLease: 1750,
  },
  {
    id: "s580", collection: "sedan",
    name: "Mercedes-Benz S 580 4MATIC", nameAr: "مرسيدس-بنز S 580 4MATIC",
    image: s580Img,
    price: 175000,
    specs: { engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو" }, hp: "496 HP", torque: "516 lb-ft", acceleration: "4.4s", topSpeed: "250 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["MBUX Rear Tablet", "Executive Rear Seats", "Burmester 4D", "E-Active Body Control", "Head-Up Display", "Digital Light"], ar: ["جهاز MBUX اللوحي الخلفي", "مقاعد تنفيذية خلفية", "Burmester رباعي الأبعاد", "E-Active تحكم الهيكل", "شاشة عرض أمامية", "إضاءة رقمية"] },
    familyFeatures: { en: ["Executive Rear Seats", "Chauffeur Package", "Child Mode MBUX", "Rear Sunshade"], ar: ["مقاعد تنفيذية خلفية", "حزمة السائق", "وضع الأطفال MBUX", "مظلة خلفية"] },
    colors: [ { name: "Onyx Black", nameAr: "أسود أونيكس", hex: "#0f0f0f" }, { name: "Emerald Green", nameAr: "أخضر زمردي", hex: "#2a4a3a" }, { name: "Nautic Blue", nameAr: "أزرق بحري", hex: "#1a2a4a" } ],
    interiors: [ { name: "Macchiato Beige / Espresso", nameAr: "بيج ماكياتو / إسبريسو", hex: "#c8b89a" }, { name: "Black Exclusive Nappa", nameAr: "نابا أسود حصري", hex: "#1a1a1a" } ],
    status: "available", monthlyLease: 2400,
  },
  {
    id: "eqs580", collection: "sedan",
    name: "Mercedes-Benz EQS 580 4MATIC", nameAr: "مرسيدس-بنز EQS 580 4MATIC",
    image: eqs580Img,
    price: 165000,
    specs: { engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان" }, hp: "516 HP", torque: "631 lb-ft", acceleration: "4.1s", topSpeed: "210 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["MBUX Hyperscreen", "108.4 kWh Battery", "350 kW Fast Charge", "Burmester 4D", "Rear Axle Steering", "Fragrance System"], ar: ["MBUX هايبرسكرين", "بطارية 108.4 كيلوواط ساعة", "شحن سريع 350 كيلوواط", "Burmester رباعي الأبعاد", "توجيه المحور الخلفي", "نظام العطور"] },
    familyFeatures: { en: ["Zero Emissions Family Drive", "Whisper Quiet Cabin", "Smart Climate Zones", "Child Safety Lock"], ar: ["قيادة عائلية بدون انبعاثات", "مقصورة هادئة", "مناطق مناخ ذكية", "قفل أمان الأطفال"] },
    colors: [ { name: "High-Tech Silver", nameAr: "فضي هاي-تك", hex: "#8a8d8f" }, { name: "Graphite Grey", nameAr: "رمادي غرافيت", hex: "#3a3a3a" }, { name: "Sodalite Blue", nameAr: "أزرق سودالايت", hex: "#1a2a4a" } ],
    interiors: [ { name: "Neva Grey / Biscay Blue", nameAr: "نيفا رمادي / أزرق بيسكاي", hex: "#4a5a6a" }, { name: "Macchiato / Space Grey", nameAr: "ماكياتو / رمادي فضائي", hex: "#c8b89a" } ],
    status: "available", monthlyLease: 2200,
  },
];

const HERO_IMG = heroImg;


// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function SultanPortal() {
  const { lang } = useLanguage();
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
  const [form, setForm] = useState({ name: "Sultan Al-Dhaheri", email: "", phone: "", vehicle: "", date: "", time: "", notes: "" });
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
  const t = LANG[lang];


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
    document.querySelectorAll(".sp-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, modal, selectedVehicle, filter]);

  // Track entry
  useEffect(() => { trackEvent("auto_portal_entry", { language: lang }); }, []);

  const vipName = lang === "en" ? "Sultan Al-Dhaheri" : "سلطان الظاهري";

  const showToast = useCallback((msg, icon = "✓") => {
    setToastHiding(false);
    setToast({ msg, icon });
    setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000);
  }, []);

  const fmtPrice = (n) => `$${n.toLocaleString()}`;

  // Filter vehicles
  const filtered = filter === "all" ? VEHICLES : VEHICLES.filter(v => v.collection === filter);

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
      vehicleName: v.name,
      unitName: v.name,
      tower: v.collection,
      unitType: v.type || v.collection,
      price: v.price,
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
        body: JSON.stringify({ _subject: `Auto Demo — Family Test Drive — ${form.name}`, _template: "table", Name: form.name, Email: form.email, Phone: form.phone, Vehicle: form.vehicle, Date: form.date, Time: form.time, Notes: form.notes, Reference: ref }),
      });
    } catch (e) {}
    setBookingRef(ref);
    setBookingOk(true);
    showToast(t.toast.booking, "🚙");
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
    <div className="sp-page" dir={lang === "ar" ? "rtl" : "ltr"}>
      <SEO title="VIP Automotive Portal" description="Personalized VIP automotive portal for family buyers." path="/sultan-portal" />
      {/* ── HEADER ── */}
      <header className={`sp-hd ${scrolled ? "sc" : ""}`}>
        <Link to="/automotive" className="sp-logo">Dynamic <b>Showroom</b></Link>
        <div className="sp-nav">
          <div className="sp-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="sp-navbtn" onClick={() => setModal("compare")}>
              {t.nav.compare}<span className="sp-cmp-count">{compareList.length}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── CROSS-NAV BAR ── */}
      <div className="sp-crossnav" style={{ position: "fixed", top: scrolled ? "52px" : "-40px", left: 0, right: 0, zIndex: 99 }}>
        <Link to="/automotive/demo">← Back to Demo Hub</Link>
        <Link to="/automotive/demo/khalid">VIP Performance</Link>
        <span style={{ color: "var(--sp-teal)", fontWeight: 500 }}>VIP Family</span>
        <Link to="/automotive/demo/showroom">Public Showroom</Link>
        <Link to="/automotive/dashboard">Dashboard</Link>
        <Link to="/automotive/demo/ai">AI Pipeline</Link>
        <span className="crossnav-persona">👤 {lang === "ar" ? "سلطان الظاهري" : "Sultan Al-Dhaheri"}</span>
      </div>

      {/* ── HERO ── */}
      <section className="sp-hero">
        <div className="sp-hero-bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="sp-hero-ov" />
        <div className="sp-hero-ct">
          <div className="sp-pvt">{t.hero.badge}</div>
          <p className="sp-greet">{t.hero.greeting} <span>{vipName}</span></p>
          <h1 className="sp-htitle">
            {lang === "en" ? (<>The Perfect<br /><em>Family</em> Fleet</>) : (<>أسطول<br /><em>العائلة</em> المثالي</>)}
          </h1>
          <p className="sp-hdesc">{t.hero.subtitle}</p>
          <div className="sp-hacts">
            <button className="sp-btn-g" onClick={() => { trackEvent("cta_explore"); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="sp-btn-o" onClick={() => { trackEvent("cta_booking"); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="sp-stats">
        {[
          { v: "5", l: t.stats.models },
          { v: "2", l: t.stats.collections },
          { v: "VIP", l: t.stats.access },
          { v: "24/7", l: t.stats.advisor },
        ].map((s, i) => (
          <div className="sp-stat" key={i}>
            <div className="sp-stat-v">{s.v}</div>
            <div className="sp-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── COLLECTIONS ── */}
      <section className="sp-sec">
        <div className="sp-sh sp-rv">
          <span className="sp-sl">◆ {t.sections.collections}</span>
          <h2 className="sp-st">{t.sections.collectionsSub}</h2>
        </div>
        <div className="sp-colls">
          {Object.values(COLLECTIONS).map((c) => {
            const count = VEHICLES.filter(v => v.collection === c.id).length;
            return (
              <div className="sp-coll sp-rv" key={c.id} onClick={() => { setFilter(c.id); trackEvent("collection_view", { collection: c.id }); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className="sp-coll-accent" style={{ background: c.accent }} />
                <img src={c.image} alt={c.name[lang]} loading="lazy" />
                <div className="sp-coll-ov" />
                <div className="sp-coll-ct">
                  <div className="sp-coll-name">{c.name[lang]}</div>
                  <div className="sp-coll-desc">{c.desc[lang]}</div>
                  <div className="sp-coll-count">{count} {lang === "en" ? "Models" : "موديلات"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="sp-div"><div className="sp-div-l" /><div className="sp-div-d">◆</div><div className="sp-div-l" /></div>

      {/* ── VEHICLES ── */}
      <section className="sp-sec" ref={vehRef}>
        <div className="sp-sh sp-rv">
          <span className="sp-sl">◆ {t.sections.vehicles}</span>
          <h2 className="sp-st">{t.sections.vehiclesSub}</h2>
          <p className="sp-ss">{t.sections.vehiclesHint}</p>
        </div>

        {/* Filter Tabs */}
        <div className="sp-filters">
          {[
            { key: "all", label: t.filters.all },
            { key: "suv", label: t.filters.suv },
            { key: "sedan", label: t.filters.sedan },
          ].map(f => (
            <button key={f.key} className={`sp-filter ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="sp-vehicles">
          {filtered.map((v) => (
            <div className="sp-vcard sp-rv" key={v.id} onClick={() => openDetail(v)}>
              <div className="sp-vcard-img">
                <img src={v.image} alt={lang === "ar" ? v.nameAr : v.name} loading="lazy" />
                <div className="sp-vcard-collection">{COLLECTIONS[v.collection]?.name[lang]}</div>
                <div className="sp-vcard-status" style={{ background: getStatusColor(v.status) }}>{getStatusLabel(v.status)}</div>
              </div>
              <div className="sp-vcard-body">
                <h3 className="sp-vcard-name">{lang === "ar" ? v.nameAr : v.name}</h3>
                <div className="sp-vcard-specs">
                  <span className="sp-vcard-spec">{v.specs.hp}</span>
                  <span className="sp-vcard-spec">{v.specs.acceleration}</span>
                  <span className="sp-vcard-spec">{v.specs.drivetrain[lang]}</span>
                </div>
                <div className="sp-vcard-price">{t.card.from} {fmtPrice(v.price)}</div>
                <div className="sp-vcard-lease">{fmtPrice(v.monthlyLease)}{t.card.perMonth}</div>
              </div>
              <div className="sp-vcard-acts" onClick={(e) => e.stopPropagation()}>
                <button className="sp-btn-o sp-btn-sm" onClick={() => openDetail(v)}>🔍 {t.card.explore}</button>
                <button className="sp-btn-o sp-btn-sm" onClick={() => toggleCompare(v.id)} style={compareList.includes(v.id) ? { borderColor: "var(--sp-blue)", color: "var(--sp-blue)", background: "rgba(69,123,157,0.1)" } : {}}>
                  {compareList.includes(v.id) ? `✓` : `⚖️`} {t.card.compare}
                </button>
                <button className="sp-btn-o sp-btn-sm" onClick={() => toggleFavorite(v.id)} style={favorites.includes(v.id) ? { borderColor: "#e63946", color: "#e63946" } : {}}>
                  {favorites.includes(v.id) ? "♥" : "♡"} {t.card.favorite}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sp-div"><div className="sp-div-l" /><div className="sp-div-d">◆</div><div className="sp-div-l" /></div>

      {/* ── BOOKING ── */}
      <section className="sp-sec sp-contact" ref={bookRef}>
        <div className="sp-sh sp-rv">
          <span className="sp-sl">◆ {t.sections.contact}</span>
          <h2 className="sp-st">{t.sections.contactSub}</h2>
          <p className="sp-ss">{t.sections.contactHint}</p>
        </div>

        {bookingOk ? (
          <div className="sp-book-ok sp-rv">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚙</div>
            <h3>{t.booking.success}</h3>
            <p>{t.booking.successDesc}</p>
            <p style={{ color: "var(--sp-blue)", fontFamily: "var(--sp-serif)", fontSize: "1.2rem" }}>
              {t.booking.successRef}: {bookingRef}
            </p>
          </div>
        ) : (
          <div className="sp-form sp-rv">
            <div className="sp-fg">
              <label className="sp-flabel">{t.booking.name}</label>
              <input className={`sp-finput ${formErr.name ? "sp-err" : ""}`} type="text" defaultValue={vipName} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sp-fg">
              <label className="sp-flabel">{t.booking.email}</label>
              <input className={`sp-finput ${formErr.email ? "sp-err" : ""}`} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="sp-fg">
              <label className="sp-flabel">{t.booking.phone}</label>
              <input className={`sp-finput ${formErr.phone ? "sp-err" : ""}`} type="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sp-fg">
              <label className="sp-flabel">{t.booking.vehicle}</label>
              <select className="sp-fsel" onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                <option value="">—</option>
                {VEHICLES.map(v => <option key={v.id} value={v.id}>{lang === "ar" ? v.nameAr : v.name} — {fmtPrice(v.price)}</option>)}
              </select>
            </div>
            <div className="sp-frow">
              <div className="sp-fg">
                <label className="sp-flabel">{t.booking.date}</label>
                <input className="sp-finput" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="sp-fg">
                <label className="sp-flabel">{t.booking.time}</label>
                <select className="sp-fsel" onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  <option value="">—</option>
                  <option value="morning">{t.booking.morning}</option>
                  <option value="afternoon">{t.booking.afternoon}</option>
                  <option value="evening">{t.booking.evening}</option>
                </select>
              </div>
            </div>
            <div className="sp-fg">
              <label className="sp-flabel">{t.booking.notes}</label>
              <input className="sp-finput" type="text" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button className="sp-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>
              {t.booking.submit} →
            </button>
            <p className="sp-fnote">{t.booking.note}</p>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="sp-ft">
        <p>{t.footer}</p>
        <p><span className="sp-ft-brand">{t.poweredBy} </span><Link to="/" style={{ color: "var(--sp-blue)", textDecoration: "none", fontFamily: "var(--sp-serif)" }}>DynamicNFC</Link></p>
      </footer>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* VEHICLE DETAIL MODAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      {selectedVehicle && (
        <div className="sp-modal-ov" onClick={closeAll}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sp-modal-x" onClick={closeAll}>✕</button>
            <img className="sp-md-img" src={selectedVehicle.image} alt={lang === "ar" ? selectedVehicle.nameAr : selectedVehicle.name} />
            <div className="sp-modal-body">
              <div className="sp-md-top">
                <div>
                  <h2 className="sp-md-title">{lang === "ar" ? selectedVehicle.nameAr : selectedVehicle.name}</h2>
                  <p className="sp-md-coll">{COLLECTIONS[selectedVehicle.collection]?.name[lang]}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div className="sp-md-price">{fmtPrice(selectedVehicle.price)}</div>
                  <div className="sp-md-lease">{fmtPrice(selectedVehicle.monthlyLease)}{t.card.perMonth} {t.finance.lease}</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="sp-tabs">
                {["overview", "configure", "finance"].map(tab => (
                  <button key={tab} className={`sp-tab ${detailTab === tab ? "active" : ""}`} onClick={() => setDetailTab(tab)}>
                    {tab === "overview" ? t.detail.overview : tab === "configure" ? t.detail.configure : t.detail.finance}
                  </button>
                ))}
              </div>

              {/* ── TAB: OVERVIEW ── */}
              {detailTab === "overview" && (
                <>
                  <div className="sp-specs-grid">
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.engine}</div><div className="sp-spec-val">{selectedVehicle.specs.engine[lang]}</div></div>
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.hp}</div><div className="sp-spec-val">{selectedVehicle.specs.hp}</div></div>
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.torque}</div><div className="sp-spec-val">{selectedVehicle.specs.torque}</div></div>
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.accel}</div><div className="sp-spec-val">{selectedVehicle.specs.acceleration}</div></div>
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.topSpeed}</div><div className="sp-spec-val">{selectedVehicle.specs.topSpeed}</div></div>
                    <div className="sp-spec-item"><div className="sp-spec-label">{t.detail.drivetrain}</div><div className="sp-spec-val">{selectedVehicle.specs.drivetrain[lang]}</div></div>
                  </div>
                  <h4 style={{ fontFamily: "var(--sp-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{t.detail.features}</h4>
                  <div className="sp-md-feats">
                    {selectedVehicle.features[lang].map((f, i) => <span className="sp-md-feat" key={i}>{f}</span>)}
                  </div>
                  {selectedVehicle.familyFeatures && (
                    <>
                      <h4 style={{ fontFamily: "var(--sp-serif)", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--sp-teal)" }}>{t.detail.familyFeatures}</h4>
                      <div className="sp-md-feats">
                        {selectedVehicle.familyFeatures[lang].map((f, i) => <span className="sp-md-fam-feat" key={i}>{f}</span>)}
                      </div>
                    </>
                  )}
                  <div className="sp-md-acts">
                    <button className="sp-btn-g sp-btn-sm" onClick={() => { closeAll(); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>🚙 {t.detail.bookTestDrive}</button>
                    <button className="sp-btn-g sp-btn-sm" onClick={() => { trackEvent("pricing_request", { vehicleId: selectedVehicle.id, vehicleName: selectedVehicle.name }); showToast(t.toast.pricing, "💰"); }}>💰 {t.detail.requestPricing}</button>
                    <button className="sp-btn-o sp-btn-sm" onClick={() => { trackEvent("brochure_download", { vehicleId: selectedVehicle.id, vehicleName: selectedVehicle.name }); showToast(t.toast.brochure, "📄"); }}>📄 {t.detail.downloadBrochure}</button>
                    <button className="sp-btn-o sp-btn-sm" onClick={() => { trackEvent("contact_advisor"); showToast(t.toast.advisorNotified, "📞"); }}>📞 {t.detail.callAdvisor}</button>
                  </div>
                </>
              )}

              {/* ── TAB: CONFIGURE ── */}
              {detailTab === "configure" && (
                <>
                  <div className="sp-config-section">
                    <div className="sp-config-label">{t.configure.exterior}</div>
                    <div className="sp-swatches">
                      {selectedVehicle.colors.map((c, i) => (
                        <div key={i} className={`sp-swatch ${selColor === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelColor(i); trackEvent("color_select", { vehicleId: selectedVehicle.id, color: c.name }); }} title={lang === "ar" ? c.nameAr : c.name} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--sp-t2)", marginTop: "1rem" }}>
                      {lang === "ar" ? selectedVehicle.colors[selColor]?.nameAr : selectedVehicle.colors[selColor]?.name}
                    </p>
                  </div>
                  <div className="sp-config-section">
                    <div className="sp-config-label">{t.configure.interior}</div>
                    <div className="sp-swatches">
                      {selectedVehicle.interiors.map((c, i) => (
                        <div key={i} className={`sp-swatch ${selInterior === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelInterior(i); trackEvent("interior_select", { vehicleId: selectedVehicle.id, interior: c.name }); }} title={lang === "ar" ? c.nameAr : c.name} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--sp-t2)", marginTop: "1rem" }}>
                      {lang === "ar" ? selectedVehicle.interiors[selInterior]?.nameAr : selectedVehicle.interiors[selInterior]?.name}
                    </p>
                  </div>
                  <div className="sp-config-summary">
                    <h4>{t.configure.yourConfig}</h4>
                    <p>
                      {lang === "ar" ? selectedVehicle.colors[selColor]?.nameAr : selectedVehicle.colors[selColor]?.name} {t.configure.exterior_label} ·{" "}
                      {lang === "ar" ? selectedVehicle.interiors[selInterior]?.nameAr : selectedVehicle.interiors[selInterior]?.name} {t.configure.interior_label}
                    </p>
                  </div>
                  <button className="sp-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }} onClick={() => {
                    trackEvent("config_save", { vehicleId: selectedVehicle.id, color: selectedVehicle.colors[selColor]?.name, interior: selectedVehicle.interiors[selInterior]?.name });
                    try { localStorage.setItem(`sp_config_${selectedVehicle.id}`, JSON.stringify({ color: selColor, interior: selInterior })); } catch(e){}
                    showToast(t.toast.configSaved, "✓");
                  }}>
                    {t.configure.saveConfig}
                  </button>
                </>
              )}

              {/* ── TAB: FINANCE ── */}
              {detailTab === "finance" && (() => {
                const monthly = calcMonthly(selectedVehicle.price, downPct, finTerm, finMode);
                return (
                  <>
                    <div className="sp-fin-toggle">
                      <button className={`sp-fin-tog-btn ${finMode === "lease" ? "active" : ""}`} onClick={() => setFinMode("lease")}>{t.finance.lease}</button>
                      <button className={`sp-fin-tog-btn ${finMode === "finance" ? "active" : ""}`} onClick={() => setFinMode("finance")}>{t.finance.financeBtn}</button>
                    </div>
                    <div className="sp-fin-field">
                      <div className="sp-fin-label"><span>{t.finance.vehiclePrice}</span><span style={{ color: "var(--sp-blue)" }}>{fmtPrice(selectedVehicle.price)}</span></div>
                    </div>
                    <div className="sp-fin-field">
                      <div className="sp-fin-label"><span>{t.finance.downPayment}</span><span style={{ color: "var(--sp-blue)" }}>{downPct}% — {fmtPrice(Math.round(selectedVehicle.price * downPct / 100))}</span></div>
                      <input type="range" className="sp-fin-slider" min="10" max="50" step="5" value={downPct} onChange={(e) => { setDownPct(Number(e.target.value)); trackEvent("finance_calc", { vehicleId: selectedVehicle.id, downPct: e.target.value }); }} />
                    </div>
                    <div className="sp-fin-field">
                      <div className="sp-fin-label"><span>{t.finance.term}</span></div>
                      <div className="sp-fin-terms">
                        {[24, 36, 48, 60].map(m => (
                          <button key={m} className={`sp-fin-term ${finTerm === m ? "active" : ""}`} onClick={() => setFinTerm(m)}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: ".78rem", color: "var(--sp-t3)", marginBottom: ".5rem", textAlign: "center" }}>
                      {t.finance.rate}: {finMode === "lease" ? "2.9%" : "4.9%"} APR
                    </div>
                    <div className="sp-fin-result">
                      <div className="sp-fin-result-label">{t.finance.monthlyPayment}</div>
                      <div className="sp-fin-result-val">{fmtPrice(Math.round(monthly))}</div>
                    </div>
                    <button className="sp-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
                      trackEvent("quote_request", { vehicleId: selectedVehicle.id, vehicleName: selectedVehicle.name, mode: finMode, downPct, term: finTerm, monthly: Math.round(monthly) });
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
        <div className="sp-modal-ov" onClick={closeAll}>
          <div className="sp-modal" style={{ maxWidth: "900px" }} onClick={(e) => e.stopPropagation()}>
            <button className="sp-modal-x" onClick={closeAll}>✕</button>
            <div className="sp-modal-body">
              <h2 style={{ fontFamily: "var(--sp-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compare.title}</h2>
              {compareList.length === 0 ? (
                <div className="sp-cmp-empty">{t.compare.empty}</div>
              ) : (() => {
                const units = compareList.map(id => VEHICLES.find(v => v.id === id)).filter(Boolean);
                const cols = `180px repeat(${units.length}, 1fr)`;
                const rows = [
                  { label: t.compare.price, get: (v) => fmtPrice(v.price) },
                  { label: t.compare.engine, get: (v) => v.specs.engine[lang] },
                  { label: t.compare.hp, get: (v) => v.specs.hp },
                  { label: t.compare.torque, get: (v) => v.specs.torque },
                  { label: t.compare.accel, get: (v) => v.specs.acceleration },
                  { label: t.compare.topSpeed, get: (v) => v.specs.topSpeed },
                  { label: t.compare.drivetrain, get: (v) => v.specs.drivetrain[lang] },
                  { label: t.compare.lease, get: (v) => `${fmtPrice(v.monthlyLease)}${t.card.perMonth}` },
                ];
                return (
                  <div className="sp-cmp-grid">
                    <div className="sp-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compare.feature}</div>
                      {units.map(v => (
                        <div key={v.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--sp-serif)", fontSize: "1rem", color: "var(--sp-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{lang === "ar" ? v.nameAr : v.name}</div>
                          <button className="sp-cmp-rm" onClick={() => toggleCompare(v.id)}>{t.compare.remove}</button>
                        </div>
                      ))}
                    </div>
                    {rows.map((row, ri) => (
                      <div className="sp-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}>
                        <div className="sp-cmp-label">{row.label}</div>
                        {units.map(v => <div className="sp-cmp-val" key={v.id}>{row.get(v)}</div>)}
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
        <div className={`sp-toast ${toastHiding ? "hiding" : ""}`}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
    </div>
  );
}

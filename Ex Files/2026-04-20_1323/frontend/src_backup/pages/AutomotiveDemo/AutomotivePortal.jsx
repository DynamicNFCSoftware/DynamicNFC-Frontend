import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../../i18n';
import './AutomotivePortal.css';
import SEO from '../../components/SEO/SEO';
import { initSession, trackLegacy } from '../../services/firestoreTracking';

// ─── LOCAL IMAGE IMPORTS ────────────────────────────────────────────
import heroImg from "./assets/hero.jpg";
import collectionPerformanceImg from "./assets/collection-amg.jpg";
import collectionSuvImg from "./assets/collection-suv.jpg";
import collectionSedanImg from "./assets/collection-sedan.jpg";
import amgGt63Img from "./assets/amg-gt63.jpg";
import amgC63Img from "./assets/amg-c63.jpg";
import amgSl63Img from "./assets/amg-sl63.jpg";
import g63Img from "./assets/g63.jpg";
import gls600Img from "./assets/gls600.jpg";
import gle53Img from "./assets/gle53.jpg";
import s580Img from "./assets/s580.jpg";
import maybachS680Img from "./assets/maybach-s680.jpg";
import eqs580Img from "./assets/eqs580.jpg";

// ═══════════════════════════════════════════════════════════════════
// AUTOMOTIVE VIP PORTAL — Luxury Showroom Experience
// ═══════════════════════════════════════════════════════════════════
// Design: Dark luxury (Mercedes / BMW VIP lounge feel)
// Features: Vehicle Detail Modal (3 tabs), Color/Interior Config,
//           Finance Calculator, Comparison, Test Drive Booking, Toasts
// ═══════════════════════════════════════════════════════════════════

// ─── TRACKING ENGINE ──────────────────────────────────────────────
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;

const trackEvent = (event, data = {}) => {
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    portalType: "vip",
    vipId: "KM-001",
    vipName: "Khalid Al-Mansouri",
    portal: "automotive",
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
  return ev;
};

// ─── BILINGUAL CONTENT ───────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP Access", lang: "العربية", compare: "Compare", favorites: "Favorites" },
    hero: {
      badge: "Private Showroom",
      greeting: "Welcome,",
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
    filters: { all: "All Models", performance: "AMG Performance", suv: "Luxury SUV", sedan: "Executive Sedan" },
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
    hero: {
      badge: "صالة عرض خاصة",
      greeting: "مرحبًا،",
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
    filters: { all: "جميع الموديلات", performance: "AMG الأداء", suv: "SUV الفاخرة", sedan: "سيدان التنفيذية" },
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
};

// ─── VEHICLE DATA ─────────────────────────────────────────────────
const COLLECTIONS = {
  performance: {
    id: "performance",
    name: { en: "AMG Performance", ar: "AMG الأداء" },
    desc: { en: "Handcrafted engines. Pure driving emotion.", ar: "محركات مصنوعة يدويًا. شغف القيادة الخالصة." },
    image: collectionPerformanceImg,
    accent: "#e63946",
  },
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
    accent: "#b8860b",
  },
};

const VEHICLES = [
  {
    id: "amg-gt63", collection: "performance",
    name: "AMG GT 63 S E Performance", nameAr: "AMG GT 63 S E بيرفورمانس",
    image: amgGt63Img,
    price: 245000,
    specs: { engine: { en: "4.0L V8 Biturbo + Electric", ar: "4.0 لتر V8 بايتوربو + كهربائي" }, hp: "831 HP", torque: "1,033 lb-ft", acceleration: "2.9s", topSpeed: "316 km/h", drivetrain: { en: "4MATIC+", ar: "4MATIC+" } },
    features: { en: ["AMG Active Ride Control", "Carbon Fiber Roof", "Burmester 3D Sound", "AMG Performance Seats", "Night Package", "Head-Up Display"], ar: ["التحكم النشط في القيادة AMG", "سقف ألياف الكربون", "نظام صوت Burmester ثلاثي الأبعاد", "مقاعد أداء AMG", "حزمة Night", "شاشة عرض أمامية"] },
    colors: [ { name: "Obsidian Black", nameAr: "أسود أوبسيديان", hex: "#0a0a0a" }, { name: "Selenite Grey", nameAr: "رمادي سيلينايت", hex: "#6b6e70" }, { name: "Jupiter Red", nameAr: "أحمر جوبيتر", hex: "#c41e3a" }, { name: "Alpine Grey", nameAr: "رمادي ألباين", hex: "#8a8d8f" } ],
    interiors: [ { name: "Black Nappa Leather", nameAr: "جلد نابا أسود", hex: "#1a1a1a" }, { name: "Macchiato Beige", nameAr: "بيج ماكياتو", hex: "#c8b89a" }, { name: "Red Pepper / Black", nameAr: "فلفل أحمر / أسود", hex: "#8b1a1a" } ],
    status: "available", monthlyLease: 3200,
  },
  {
    id: "amg-c63", collection: "performance",
    name: "AMG C 63 S E Performance", nameAr: "AMG C 63 S E بيرفورمانس",
    image: amgC63Img,
    price: 125000,
    specs: { engine: { en: "2.0L Turbo + Electric", ar: "2.0 لتر توربو + كهربائي" }, hp: "671 HP", torque: "752 lb-ft", acceleration: "3.4s", topSpeed: "280 km/h", drivetrain: { en: "4MATIC+", ar: "4MATIC+" } },
    features: { en: ["AMG Track Pace", "Carbon Fiber Trim", "Burmester Sound", "AMG Seats", "Night Package", "Active Aero"], ar: ["AMG Track Pace", "تزيين ألياف الكربون", "نظام Burmester", "مقاعد AMG", "حزمة Night", "ديناميكا هوائية نشطة"] },
    colors: [ { name: "Spectral Blue", nameAr: "أزرق سبكترال", hex: "#1a3a5c" }, { name: "Obsidian Black", nameAr: "أسود أوبسيديان", hex: "#0a0a0a" }, { name: "Polar White", nameAr: "أبيض بولار", hex: "#f5f5f0" } ],
    interiors: [ { name: "Black Nappa", nameAr: "نابا أسود", hex: "#1a1a1a" }, { name: "Titanium Grey", nameAr: "تيتانيوم رمادي", hex: "#5a5a5a" } ],
    status: "available", monthlyLease: 1850,
  },
  {
    id: "amg-sl63", collection: "performance",
    name: "AMG SL 63 4MATIC+", nameAr: "AMG SL 63 4MATIC+",
    image: amgSl63Img,
    price: 198000,
    specs: { engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو" }, hp: "577 HP", torque: "590 lb-ft", acceleration: "3.6s", topSpeed: "315 km/h", drivetrain: { en: "4MATIC+", ar: "4MATIC+" } },
    features: { en: ["Soft Top Convertible", "AMG Active Body Control", "MBUX Hyperscreen", "Burmester 3D", "Digital Light", "360 Camera"], ar: ["سقف ناعم قابل للطي", "تحكم نشط في الهيكل AMG", "MBUX هايبرسكرين", "Burmester ثلاثي الأبعاد", "إضاءة رقمية", "كاميرا 360"] },
    colors: [ { name: "Patagonia Red", nameAr: "أحمر باتاغونيا", hex: "#8b2500" }, { name: "Selenite Grey", nameAr: "رمادي سيلينايت", hex: "#6b6e70" }, { name: "MANUFAKTUR Olive", nameAr: "أخضر زيتوني MANUFAKTUR", hex: "#4a5028" } ],
    interiors: [ { name: "Neva Grey / Black", nameAr: "نيفا رمادي / أسود", hex: "#4a4a4a" }, { name: "Sienna Brown", nameAr: "بني سيينا", hex: "#6b4226" } ],
    status: "available", monthlyLease: 2900,
  },
  {
    id: "g63", collection: "suv",
    name: "Mercedes-AMG G 63", nameAr: "مرسيدس-AMG G 63",
    image: g63Img,
    price: 225000,
    specs: { engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو" }, hp: "577 HP", torque: "627 lb-ft", acceleration: "4.5s", topSpeed: "220 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["Three Differential Locks", "MANUFAKTUR Interior", "Burmester 3D", "Night Package", "Off-Road Cockpit", "Transparent Hood"], ar: ["ثلاثة أقفال تفاضلية", "داخلية MANUFAKTUR", "Burmester ثلاثي الأبعاد", "حزمة Night", "قمرة الطرق الوعرة", "غطاء محرك شفاف"] },
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
    colors: [ { name: "Onyx Black", nameAr: "أسود أونيكس", hex: "#0f0f0f" }, { name: "Emerald Green", nameAr: "أخضر زمردي", hex: "#2a4a3a" }, { name: "Nautic Blue", nameAr: "أزرق بحري", hex: "#1a2a4a" } ],
    interiors: [ { name: "Macchiato Beige / Espresso", nameAr: "بيج ماكياتو / إسبريسو", hex: "#c8b89a" }, { name: "Black Exclusive Nappa", nameAr: "نابا أسود حصري", hex: "#1a1a1a" } ],
    status: "available", monthlyLease: 2400,
  },
  {
    id: "maybach-s680", collection: "sedan",
    name: "Mercedes-Maybach S 680", nameAr: "مرسيدس-مايباخ S 680",
    image: maybachS680Img,
    price: 380000,
    specs: { engine: { en: "6.0L V12 Biturbo", ar: "6.0 لتر V12 بايتوربو" }, hp: "621 HP", torque: "738 lb-ft", acceleration: "4.5s", topSpeed: "250 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["Maybach Executive Seats", "Champagne Flutes", "Burmester 4D High-End", "Chauffeur Package", "MANUFAKTUR Programme", "Rear Entertainment"], ar: ["مقاعد مايباخ التنفيذية", "كؤوس شامبانيا", "Burmester 4D هاي-إند", "حزمة السائق الخاص", "برنامج MANUFAKTUR", "ترفيه خلفي"] },
    colors: [ { name: "Two-Tone Obsidian/Kalahari", nameAr: "لونين أوبسيديان / كالاهاري", hex: "#0a0a0a" }, { name: "Rubellite Red / Obsidian", nameAr: "روبيللايت أحمر / أوبسيديان", hex: "#6b1a2a" }, { name: "Nautical Blue / Obsidian", nameAr: "أزرق بحري / أوبسيديان", hex: "#1a2a4a" } ],
    interiors: [ { name: "MANUFAKTUR Crystal White / Silver Grey", nameAr: "MANUFAKTUR أبيض كريستال / رمادي فضي", hex: "#e8e0d8" }, { name: "Maybach Macchiato / Truffle Brown", nameAr: "مايباخ ماكياتو / بني الكمأة", hex: "#5a3a2a" } ],
    status: "available", monthlyLease: 5500,
  },
  {
    id: "eqs580", collection: "sedan",
    name: "Mercedes-Benz EQS 580 4MATIC", nameAr: "مرسيدس-بنز EQS 580 4MATIC",
    image: eqs580Img,
    price: 165000,
    specs: { engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان" }, hp: "516 HP", torque: "631 lb-ft", acceleration: "4.1s", topSpeed: "210 km/h", drivetrain: { en: "4MATIC", ar: "4MATIC" } },
    features: { en: ["MBUX Hyperscreen", "108.4 kWh Battery", "350 kW Fast Charge", "Burmester 4D", "Rear Axle Steering", "Fragrance System"], ar: ["MBUX هايبرسكرين", "بطارية 108.4 كيلوواط ساعة", "شحن سريع 350 كيلوواط", "Burmester رباعي الأبعاد", "توجيه المحور الخلفي", "نظام العطور"] },
    colors: [ { name: "High-Tech Silver", nameAr: "فضي هاي-تك", hex: "#8a8d8f" }, { name: "Graphite Grey", nameAr: "رمادي غرافيت", hex: "#3a3a3a" }, { name: "Sodalite Blue", nameAr: "أزرق سودالايت", hex: "#1a2a4a" } ],
    interiors: [ { name: "Neva Grey / Biscay Blue", nameAr: "نيفا رمادي / أزرق بيسكاي", hex: "#4a5a6a" }, { name: "Macchiato / Space Grey", nameAr: "ماكياتو / رمادي فضائي", hex: "#c8b89a" } ],
    status: "available", monthlyLease: 2200,
  },
];

const HERO_IMG = heroImg;



// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function AutomotivePortal() {
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
  const [form, setForm] = useState({ name: "Khalid Al-Mansouri", email: "", phone: "", vehicle: "", date: "", time: "", notes: "" });
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
    document.querySelectorAll(".ap-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, modal, selectedVehicle, filter]);

  // Track entry
  useEffect(() => { trackEvent("auto_portal_entry", { language: lang }); initSession({ cardId: 'VISTA004', visitorType: 'vip', visitorName: 'Khalid Al-Mansouri', portalName: 'Auto VIP' }); }, []);

  const vipName = lang === "en" ? "Khalid Al-Mansouri" : "خالد المنصوري";

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
      if (prev.includes(id)) { showToast(t.toast.compareRemove, "↩"); trackEvent("compare_remove", { vehicleId: id }); trackLegacy('compare_remove', { vehicleId: id }); return prev.filter(x => x !== id); }
      if (prev.length >= 3) return prev;
      trackEvent("compare_add", { vehicleId: id }); trackLegacy('compare_add', { vehicleId: id });
      showToast(t.toast.compare, "⚖️");
      return [...prev, id];
    });
  };

  // Favorites
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) { showToast(t.toast.favoriteRemove, "↩"); trackEvent("favorite_toggle", { vehicleId: id, action: "remove" }); trackLegacy('favorite_toggle', { vehicleId: id, action: 'remove' }); return prev.filter(x => x !== id); }
      trackEvent("favorite_toggle", { vehicleId: id, action: "add" }); trackLegacy('favorite_toggle', { vehicleId: id, action: 'add' });
      showToast(t.toast.favorite, "♥");
      return [...prev, id];
    });
  };

  // Open detail
  const openDetail = (v) => {
    setSelectedVehicle(v); setDetailTab("overview"); setSelColor(0); setSelInterior(0); setDownPct(20); setFinTerm(48); setFinMode("lease");
    trackEvent("vehicle_view", { vehicleId: v.id, name: v.name, price: v.price }); trackLegacy('vehicle_view', { vehicleId: v.id, name: v.name, price: v.price });
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
    trackEvent("test_drive_request", { vehicleId: form.vehicle || "general", name: form.name, date: form.date, time: form.time }); trackLegacy('test_drive_request', { vehicleId: form.vehicle || 'general', name: form.name });
    try {
      await fetch("https://formsubmit.co/ajax/info@dynamicnfc.help", {
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
        <a href="/automotive/demo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ap-t3)" }}>← {lang === "ar" ? "مركز العرض" : "Demo Hub"}</a>
        <span className="active">{lang === "ar" ? "VIP أداء" : "VIP Performance"}</span>
        <a href="/automotive/demo/sultan" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "VIP عائلي" : "VIP Family"}</a>
        <a href="/automotive/demo/showroom" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "صالة العرض" : "Public Showroom"}</a>
        <a href="/automotive/dashboard" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</a>
        <a href="/automotive/demo/ai" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "خط أنابيب الذكاء" : "AI Pipeline"}</a>
      </div>
      {/* ── HEADER ── */}
      <header className={`ap-hd ${scrolled ? "sc" : ""}`}>
        <Link to="/automotive" className="ap-logo">Dynamic <b>Showroom</b></Link>
        <div className="ap-nav">
          <div className="ap-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="ap-navbtn" onClick={() => setModal("compare")}>
              {t.nav.compare}<span className="ap-cmp-count">{compareList.length}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="ap-hero">
        <div className="ap-hero-bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-ct">
          <div className="ap-pvt">{t.hero.badge}</div>
          <p className="ap-greet">{t.hero.greeting} <span>{vipName}</span></p>
          <h1 className="ap-htitle">
            {lang === "en" ? (<>Your Private<br /><em>Showroom</em> Awaits</>) : (<>صالة عرضك<br /><em>الخاصة</em> بانتظارك</>)}
          </h1>
          <p className="ap-hdesc">{t.hero.subtitle}</p>
          <div className="ap-hacts">
            <button className="ap-btn-g" onClick={() => { trackEvent("cta_explore"); trackLegacy('cta_explore', {}); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="ap-btn-o" onClick={() => { trackEvent("cta_booking"); trackLegacy('cta_booking', {}); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ap-stats">
        {[
          { v: "9", l: t.stats.models },
          { v: "3", l: t.stats.collections },
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
          {Object.values(COLLECTIONS).map((c) => {
            const count = VEHICLES.filter(v => v.collection === c.id).length;
            return (
              <div className="ap-coll ap-rv" key={c.id} onClick={() => { setFilter(c.id); trackEvent("collection_view", { collection: c.id }); trackLegacy('collection_view', { collection: c.id }); vehRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className="ap-coll-accent" style={{ background: c.accent }} />
                <img src={c.image} alt={c.name[lang]} loading="lazy" />
                <div className="ap-coll-ov" />
                <div className="ap-coll-ct">
                  <div className="ap-coll-name">{c.name[lang]}</div>
                  <div className="ap-coll-desc">{c.desc[lang]}</div>
                  <div className="ap-coll-count">{count} {lang === "en" ? "Models" : "موديلات"}</div>
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
          {[
            { key: "all", label: t.filters.all },
            { key: "performance", label: t.filters.performance },
            { key: "suv", label: t.filters.suv },
            { key: "sedan", label: t.filters.sedan },
          ].map(f => (
            <button key={f.key} className={`ap-filter ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="ap-vehicles">
          {filtered.map((v) => (
            <div className="ap-vcard ap-rv" key={v.id} onClick={() => openDetail(v)}>
              <div className="ap-vcard-img">
                <img src={v.image} alt={lang === "ar" ? v.nameAr : v.name} loading="lazy" />
                <div className="ap-vcard-collection">{COLLECTIONS[v.collection]?.name[lang]}</div>
                <div className="ap-vcard-status" style={{ background: getStatusColor(v.status) }}>{getStatusLabel(v.status)}</div>
              </div>
              <div className="ap-vcard-body">
                <h3 className="ap-vcard-name">{lang === "ar" ? v.nameAr : v.name}</h3>
                <div className="ap-vcard-specs">
                  <span className="ap-vcard-spec">{v.specs.hp}</span>
                  <span className="ap-vcard-spec">{v.specs.acceleration}</span>
                  <span className="ap-vcard-spec">{v.specs.drivetrain[lang]}</span>
                </div>
                <div className="ap-vcard-price">{t.card.from} {fmtPrice(v.price)}</div>
                <div className="ap-vcard-lease">{fmtPrice(v.monthlyLease)}{t.card.perMonth}</div>
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
                {VEHICLES.map(v => <option key={v.id} value={v.id}>{lang === "ar" ? v.nameAr : v.name} — {fmtPrice(v.price)}</option>)}
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
            <img className="ap-md-img" src={selectedVehicle.image} alt={lang === "ar" ? selectedVehicle.nameAr : selectedVehicle.name} />
            <div className="ap-modal-body">
              <div className="ap-md-top">
                <div>
                  <h2 className="ap-md-title">{lang === "ar" ? selectedVehicle.nameAr : selectedVehicle.name}</h2>
                  <p className="ap-md-coll">{COLLECTIONS[selectedVehicle.collection]?.name[lang]}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div className="ap-md-price">{fmtPrice(selectedVehicle.price)}</div>
                  <div className="ap-md-lease">{fmtPrice(selectedVehicle.monthlyLease)}{t.card.perMonth} {t.finance.lease}</div>
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
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.engine}</div><div className="ap-spec-val">{selectedVehicle.specs.engine[lang]}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.hp}</div><div className="ap-spec-val">{selectedVehicle.specs.hp}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.torque}</div><div className="ap-spec-val">{selectedVehicle.specs.torque}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.accel}</div><div className="ap-spec-val">{selectedVehicle.specs.acceleration}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.topSpeed}</div><div className="ap-spec-val">{selectedVehicle.specs.topSpeed}</div></div>
                    <div className="ap-spec-item"><div className="ap-spec-label">{t.detail.drivetrain}</div><div className="ap-spec-val">{selectedVehicle.specs.drivetrain[lang]}</div></div>
                  </div>
                  <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{t.detail.features}</h4>
                  <div className="ap-md-feats">
                    {selectedVehicle.features[lang].map((f, i) => <span className="ap-md-feat" key={i}>{f}</span>)}
                  </div>
                  <div className="ap-md-acts">
                    <button className="ap-btn-g ap-btn-sm" onClick={() => { closeAll(); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>🏎️ {t.detail.bookTestDrive}</button>
                    <button className="ap-btn-g ap-btn-sm" onClick={() => { trackEvent("pricing_request", { vehicleId: selectedVehicle.id }); trackLegacy('request_pricing', { vehicleId: selectedVehicle.id }); showToast(t.toast.pricing, "💰"); }}>💰 {t.detail.requestPricing}</button>
                    <button className="ap-btn-o ap-btn-sm" onClick={() => { trackEvent("brochure_download", { vehicleId: selectedVehicle.id }); trackLegacy('download_brochure', { vehicleId: selectedVehicle.id }); showToast(t.toast.brochure, "📄"); }}>📄 {t.detail.downloadBrochure}</button>
                    <button className="ap-btn-o ap-btn-sm" onClick={() => { trackEvent("contact_advisor"); trackLegacy('contact_advisor', {}); showToast(t.toast.advisorNotified, "📞"); }}>📞 {t.detail.callAdvisor}</button>
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
                        <div key={i} className={`ap-swatch ${selColor === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelColor(i); trackEvent("color_select", { vehicleId: selectedVehicle.id, color: c.name }); trackLegacy('color_select', { vehicleId: selectedVehicle.id, color: c.name }); }} title={lang === "ar" ? c.nameAr : c.name} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--ap-t2)", marginTop: "1rem" }}>
                      {lang === "ar" ? selectedVehicle.colors[selColor]?.nameAr : selectedVehicle.colors[selColor]?.name}
                    </p>
                  </div>
                  <div className="ap-config-section">
                    <div className="ap-config-label">{t.configure.interior}</div>
                    <div className="ap-swatches">
                      {selectedVehicle.interiors.map((c, i) => (
                        <div key={i} className={`ap-swatch ${selInterior === i ? "selected" : ""}`} style={{ background: c.hex }} onClick={() => { setSelInterior(i); trackEvent("interior_select", { vehicleId: selectedVehicle.id, interior: c.name }); trackLegacy('interior_select', { vehicleId: selectedVehicle.id, interior: c.name }); }} title={lang === "ar" ? c.nameAr : c.name} />
                      ))}
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--ap-t2)", marginTop: "1rem" }}>
                      {lang === "ar" ? selectedVehicle.interiors[selInterior]?.nameAr : selectedVehicle.interiors[selInterior]?.name}
                    </p>
                  </div>
                  <div className="ap-config-summary">
                    <h4>{t.configure.yourConfig}</h4>
                    <p>
                      {lang === "ar" ? selectedVehicle.colors[selColor]?.nameAr : selectedVehicle.colors[selColor]?.name} {t.configure.exterior_label} ·{" "}
                      {lang === "ar" ? selectedVehicle.interiors[selInterior]?.nameAr : selectedVehicle.interiors[selInterior]?.name} {t.configure.interior_label}
                    </p>
                  </div>
                  <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }} onClick={() => {
                    trackEvent("config_save", { vehicleId: selectedVehicle.id, color: selectedVehicle.colors[selColor]?.name, interior: selectedVehicle.interiors[selInterior]?.name }); trackLegacy('config_save', { vehicleId: selectedVehicle.id });
                    try { localStorage.setItem(`ap_config_${selectedVehicle.id}`, JSON.stringify({ color: selColor, interior: selInterior })); } catch(e){}
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
                    <div className="ap-fin-toggle">
                      <button className={`ap-fin-tog-btn ${finMode === "lease" ? "active" : ""}`} onClick={() => setFinMode("lease")}>{t.finance.lease}</button>
                      <button className={`ap-fin-tog-btn ${finMode === "finance" ? "active" : ""}`} onClick={() => setFinMode("finance")}>{t.finance.financeBtn}</button>
                    </div>
                    <div className="ap-fin-field">
                      <div className="ap-fin-label"><span>{t.finance.vehiclePrice}</span><span style={{ color: "var(--ap-gold)" }}>{fmtPrice(selectedVehicle.price)}</span></div>
                    </div>
                    <div className="ap-fin-field">
                      <div className="ap-fin-label"><span>{t.finance.downPayment}</span><span style={{ color: "var(--ap-gold)" }}>{downPct}% — {fmtPrice(Math.round(selectedVehicle.price * downPct / 100))}</span></div>
                      <input type="range" className="ap-fin-slider" min="10" max="50" step="5" value={downPct} onChange={(e) => { setDownPct(Number(e.target.value)); trackEvent("finance_calc", { vehicleId: selectedVehicle.id, downPct: e.target.value }); trackLegacy('finance_calc', { vehicleId: selectedVehicle.id }); }} />
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
                      <div className="ap-fin-result-val">{fmtPrice(Math.round(monthly))}</div>
                    </div>
                    <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
                      trackEvent("quote_request", { vehicleId: selectedVehicle.id, mode: finMode, downPct, term: finTerm, monthly: Math.round(monthly) }); trackLegacy('quote_request', { vehicleId: selectedVehicle.id });
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
                  <div className="ap-cmp-grid">
                    <div className="ap-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compare.feature}</div>
                      {units.map(v => (
                        <div key={v.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--ap-serif)", fontSize: "1rem", color: "var(--ap-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{lang === "ar" ? v.nameAr : v.name}</div>
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

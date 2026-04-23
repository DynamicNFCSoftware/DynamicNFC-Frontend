import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { bridgeEventToFirestore } from "../../services/portalFirestoreBridge";
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
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;
const _source = "direct";
let _leadInfo = null;

const trackEvent = (event, data = {}) => {
  const _deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile"
    : /Tablet|iPad/i.test(navigator.userAgent) ? "tablet"
    : "desktop";
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    sessionId: _sessionId,
    portalType: _leadInfo ? "lead" : "anonymous",
    source: _source,
    deviceType: _deviceType,
    ...(_leadInfo ? { leadName: _leadInfo.name, leadEmail: _leadInfo.email } : {}),
    event, ...data,
  };
  try {
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch(e) {}
  _bc?.postMessage(ev);
  bridgeEventToFirestore(ev);
};

// ─── BILINGUAL ───────────────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { brand: "Vista Residences", lang: "العربية", register: "Register / Login", account: "My Account" },
    hero: {
      badge: "Now Selling — Phase 2",
      title: "Vista\nResidences",
      subtitle: "Premium waterfront living in the heart of the city. Explore our collection of exclusive residences from 2 to 4+ bedrooms.",
      cta: "View Collection",
      ctaSecondary: "Book a Visit",
    },
    stats: { units: "Premium Units", floors: "Floors", beds: "Bedrooms", completion: "Completion" },
    roiBanner: {
      title: "Calculate Your Investment Returns",
      desc: "Use our interactive ROI calculator to project your returns based on property value, rental income, appreciation rates, and financing options.",
      cta: "Open ROI Calculator →",
    },
    sections: {
      residences: "Available Residences", residencesSub: "Find Your Perfect Residence",
      amenities: "The Lifestyle", amenitiesSub: "World-Class Amenities",
      investment: "Investment Snapshot", investmentSub: "Why Vista Residences",
      cta: "Ready to Take the Next Step?",
      ctaSub: "Register for exclusive pricing, floor plans, brochures, and priority viewing appointments.",
    },
    filters: { all: "All", penthouse: "Penthouse", bed3: "3 Bedrooms", bed2: "2 Bedrooms" },
    card: { registerPrice: "Register for exact pricing", details: "View Details", getPricing: "Get Pricing" },
    unitActions: { floorPlan: "Floor Plan", brochure: "Brochure", pricing: "Get Exact Pricing", book: "Book Viewing", compare: "Compare" },
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
      empty: "Add residences to compare using the ⚖️ button on unit cards.",
    },
    leadForm: {
      title: "Get Full Access",
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
    poweredBy: "Powered by", registerNow: "Register Now", registerDone: "Registered",
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
    card: { registerPrice: "سجّل للحصول على السعر", details: "التفاصيل", getPricing: "احصل على السعر" },
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
      empty: "أضف مساكن للمقارنة بالنقر على ⚖️ في بطاقات الوحدات.",
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
    brochureDesc: "تم إعداد كتيبك الشخصي مع تفاصيل الوحدة السكنية.",
    brochureDownload: "تحميل كتيب PDF",
    brochureEmail: "إرسال إلى البريد الإلكتروني",
    brochureIncludes: "الكتيب يشمل:",
    brochureItem1: "المخططات الطابقية التفصيلية والمواصفات",
    brochureItem2: "كتالوج التشطيبات المميزة",
    brochureItem3: "نظرة عامة على المرافق وأسلوب الحياة",
    brochureItem4: "تحليل الاستثمار وخطط الدفع",
    brochureItem5: "خريطة الموقع والاتصال",
    brochureReady: "الكتيب جاهز",
    brochureTitle: "الكتيب الرقمي",
    cardDetails: "عرض التفاصيل",
    cardGetPricing: "الحصول على الأسعار",
    cardRegisterPrice: "التسجيل للحصول على الأسعار الدقيقة",
    compareBedrooms: "غرف النوم",
    compareCategory: "الفئة",
    compareEmpty: "أضف وحدات للمقارنة باستخدام زر المقارنة في بطاقات الوحدات.",
    compareFeature: "الميزة",
    compareFloor: "الطابق",
    comparePrice: "نطاق السعر",
    compareRemoveBtn: "إزالة",
    compareSize: "الحجم",
    compareTitle: "مقارنة الوحدات السكنية",
    compareView: "عرض",
    filterAll: "الكل",
    filterBed2: "غرفتي نوم",
    filterBed3: "ثلاث غرف نوم",
    filterPenthouse: "بنتهاوس",
    floorPlanBalcony: "شرفة / تراس",
    floorPlanBathrooms: "الحمامات",
    floorPlanDisclaimer: "المخططات الطابقية إرشادية وقد تختلف. الأبعاد الفعلية مؤكدة عند التسليم.",
    floorPlanDownload: "تحميل مخطط الطابق PDF",
    floorPlanTitle: "مخطط الطابق",
    floorPlanTotalArea: "المساحة الإجمالية",
    heroBadge: "البيع الآن — المرحلة 2",
    heroCta: "عرض المجموعة",
    heroCtaSecondary: "حجز زيارة",
    heroSubtitle: "معيشة على الواجهة المائية مميزة في قلب المدينة. استكشف مجموعتنا من الوحدات الحصرية من 2 إلى 4+ غرف نوم.",
    heroTitle: "مساكن فيستا",
    leadFormEmail: "البريد الإلكتروني",
    leadFormName: "الاسم الكامل",
    leadFormNote: "يتم حماية معلوماتك. لا رسائل مزعجة، أبدًا.",
    leadFormPhone: "الهاتف",
    leadFormSubmit: "التسجيل والمتابعة",
    leadFormSubtitle: "سجل لفتح الأسعار الدقيقة، المخططات الطابقية، الكتيبات، ومواعيد الزيارة ذات الأولوية.",
    leadFormTitle: "الحصول على وصول كامل",
    navAccount: "حسابي",
    navBrand: "مساكن فيستا",
    navLang: "العربية",
    navRegister: "التسجيل / تسجيل الدخول",
    paymentDisclaimer: "خطط الدفع خاضعة للموافقة. سجل للحصول على الشروط الشخصية.",
    paymentM1: "دفعة الحجز",
    paymentM1d: "عند الحجز",
    paymentM2: "الدفعة الأولى",
    paymentM2d: "خلال 30 يومًا",
    paymentM3: "البناء 30٪",
    paymentM3d: "عند اكتمال 30٪",
    paymentM4: "البناء 60٪",
    paymentM4d: "عند اكتمال 60٪",
    paymentM5: "التسليم",
    paymentM5d: "عند تسليم المفتاح",
    paymentM6: "ما بعد التسليم",
    paymentM6d: "12 شهرًا بعد التسليم",
    paymentMilestones: "معالم الدفع",
    paymentPlan6040: "خطة 60/40",
    paymentPlan6040Desc: "60٪ أثناء البناء · 40٪ عند التسليم",
    paymentPlan7030: "خطة 70/30",
    paymentPlan7030Desc: "70٪ أثناء البناء · 30٪ بعد التسليم (12 شهرًا)",
    paymentRequestCall: "طلب استشارة الدفع",
    paymentSubtitle: "هيكل دفع مرن",
    paymentTitle: "خطة الدفع",
    paymentTotalPrice: "ابتداءً من",
    sectionAmenities: "أسلوب الحياة",
    sectionAmenitiesSub: "مرافق عالمية المستوى",
    sectionCta: "جاهز لاتخاذ الخطوة التالية؟",
    sectionCtaSub: "سجل للحصول على الأسعار الحصرية، المخططات الطابقية، الكتيبات، ومواعيد الزيارة ذات الأولوية.",
    sectionInvestment: "لمحة استثمارية",
    sectionInvestmentSub: "لماذا مساكن فيستا",
    sectionResidences: "الوحدات المتاحة",
    sectionResidencesSub: "ابحث عن الوحدة المثالية لك",
    statsBeds: "غرف النوم",
    statsCompletion: "الانتهاء",
    statsFloors: "الطوابق",
    statsUnits: "الوحدات المميزة",
    toastBooking: "تم إرسال طلب الزيارة — سنتواصل معك خلال 48 ساعة",
    toastBrochure: "تم تنزيل الكتيب",
    toastCompare: "تمت إضافته للمقارنة",
    toastCompareRemove: "تمت إزالته من المقارنة",
    toastEmailSent: "تم إرسال الكتيب إلى بريدك الإلكتروني",
    toastFloorPlan: "تم فتح المخطط الطابقي",
    toastLeadCaptured: "شكرًا لك! جاري معالجة طلبك...",
    toastPricing: "تم إرسال تفاصيل الأسعار إلى بريدك الإلكتروني",
    toastRegistered: "أنت مسجل بالفعل!",
    unitBook: "حجز زيارة",
    unitBrochure: "الكتيب",
    unitCompare: "المقارنة",
    unitFloorPlan: "مخطط الطابق",
    unitPricing: "الحصول على الأسعار الدقيقة",
},
};

// ─── PROPERTY DATA (public — price ranges, not exact) ────────────
const UNITS = [
  {
    id: "SKY-PH-01",
    tower: "Al Qamar",
    unitType: "penthouse",
    name: { en: "Sky Penthouse", ar: "بنتهاوس السماء" },
    floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤" },
    beds: { en: "4 Bedrooms", ar: "٤ غرف نوم" }, bedNum: 4,
    baths: { en: "5 Bathrooms", ar: "٥ حمامات" },
    size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²" }, sizeNum: 6200,
    priceRange: { en: "From AED 12M", ar: "من ١٢ مليون درهم" }, priceNum: 12500000,
    feature: { en: "360° Panoramic Views", ar: "إطلالة بانورامية ٣٦٠°" },
    type: { en: "Penthouse", ar: "بنتهاوس" }, filterKey: "penthouse",
    status: { en: "Available", ar: "متاح" }, statusColor: "#2A9D5C",
    category: { en: "Penthouse", ar: "بنتهاوس" },
    view: { en: "Sea + City Panoramic", ar: "بانورامية بحر + مدينة" },
    desc: {
      en: "A triple-height masterpiece crowning the tower with private infinity pool, direct elevator access, and wraparound terrace overlooking the Arabian Gulf.",
      ar: "تحفة معمارية بارتفاع ثلاثي تتوّج البرج مع مسبح إنفينيتي خاص ومصعد مباشر وتراس محيطي يطل على الخليج العربي.",
    },
    features: {
      en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
      ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
    },
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master", w: 42, h: 30, x: 5, y: 5, label: { en: "Master Suite\n580 sq ft", ar: "الجناح الرئيسي\n٥٨٠ قدم²" } },
        { key: "bed2", w: 22, h: 20, x: 50, y: 5, label: { en: "Bedroom 2\n320 sq ft", ar: "غرفة ٢\n٣٢٠ قدم²" } },
        { key: "bed3", w: 22, h: 20, x: 75, y: 5, label: { en: "Bedroom 3\n280 sq ft", ar: "غرفة ٣\n٢٨٠ قدم²" } },
        { key: "living", w: 42, h: 30, x: 5, y: 38, label: { en: "Grand Living\n980 sq ft", ar: "صالة كبرى\n٩٨٠ قدم²" } },
        { key: "kitchen", w: 25, h: 20, x: 50, y: 38, label: { en: "Chef's Kitchen\n420 sq ft", ar: "مطبخ الشيف\n٤٢٠ قدم²" } },
        { key: "balcony", w: 92, h: 14, x: 5, y: 72, label: { en: "Wraparound Terrace\n1,200 sq ft", ar: "تراس محيطي\n١,٢٠٠ قدم²" } },
      ],
      specs: { bathrooms: "5+1", balconySize: "1,200 sq ft", totalArea: "6,200 sq ft" },
    },
    payment: { base: 12500000, plans: ["60/40", "70/30"] },
  },
  {
    id: "GR-35-01",
    tower: "Al Safwa",
    unitType: "3br",
    name: { en: "Grand Residence", ar: "الإقامة الكبرى" },
    floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨" },
    beds: { en: "3 Bedrooms", ar: "٣ غرف نوم" }, bedNum: 3,
    baths: { en: "4 Bathrooms", ar: "٤ حمامات" },
    size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²" }, sizeNum: 4100,
    priceRange: { en: "From AED 7.5M", ar: "من ٧.٥ مليون درهم" }, priceNum: 7800000,
    feature: { en: "Marina & Sea View", ar: "إطلالة على المارينا والبحر" },
    type: { en: "3BR Residence", ar: "مسكن ٣ غرف" }, filterKey: "3bed",
    status: { en: "Available", ar: "متاح" }, statusColor: "#2A9D5C",
    category: { en: "Grand Residence", ar: "إقامة كبرى" },
    view: { en: "Marina & Sea", ar: "مارينا وبحر" },
    desc: {
      en: "Expansive living with floor-to-ceiling glazing, Italian marble throughout, a private terrace overlooking the marina, and a chef's kitchen with Miele appliances.",
      ar: "مساحة واسعة مع زجاج من الأرض إلى السقف، رخام إيطالي، تراس خاص يطل على المارينا، ومطبخ الشيف بأجهزة ميلي.",
    },
    features: {
      en: ["Marina View", "Maid's Room", "Walk-in Closet", "Home Office", "Balcony"],
      ar: ["إطلالة المارينا", "غرفة الخادمة", "غرفة ملابس", "مكتب منزلي", "شرفة"],
    },
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 32, x: 5, y: 5, label: { en: "Master Suite\n480 sq ft", ar: "الجناح الرئيسي\n٤٨٠ قدم²" } },
        { key: "bed2", w: 25, h: 25, x: 43, y: 5, label: { en: "Bedroom 2\n320 sq ft", ar: "غرفة ٢\n٣٢٠ قدم²" } },
        { key: "bed3", w: 25, h: 25, x: 72, y: 5, label: { en: "Bedroom 3\n280 sq ft", ar: "غرفة ٣\n٢٨٠ قدم²" } },
        { key: "living", w: 45, h: 28, x: 5, y: 40, label: { en: "Living & Dining\n860 sq ft", ar: "معيشة وطعام\n٨٦٠ قدم²" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 40, label: { en: "Kitchen\n340 sq ft", ar: "مطبخ\n٣٤٠ قدم²" } },
        { key: "balcony", w: 92, h: 16, x: 5, y: 72, label: { en: "Marina Terrace\n680 sq ft", ar: "تراس المارينا\n٦٨٠ قدم²" } },
      ],
      specs: { bathrooms: "3+1", balconySize: "680 sq ft", totalArea: "4,100 sq ft" },
    },
    payment: { base: 7800000, plans: ["60/40", "70/30"] },
  },
  {
    id: "EX-25-01",
    tower: "Al Rawda",
    unitType: "2br",
    name: { en: "Executive Suite", ar: "الجناح التنفيذي" },
    floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠" },
    beds: { en: "2 Bedrooms", ar: "غرفتا نوم" }, bedNum: 2,
    baths: { en: "3 Bathrooms", ar: "٣ حمامات" },
    size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²" }, sizeNum: 2800,
    priceRange: { en: "From AED 4M", ar: "من ٤ مليون درهم" }, priceNum: 4200000,
    feature: { en: "City Skyline View", ar: "إطلالة على أفق المدينة" },
    type: { en: "2BR Suite", ar: "جناح غرفتين" }, filterKey: "2bed",
    status: { en: "Last 3 Units", ar: "آخر ٣ وحدات" }, statusColor: "#C1121F",
    category: { en: "Executive Suite", ar: "جناح تنفيذي" },
    view: { en: "City Skyline", ar: "أفق المدينة" },
    desc: {
      en: "Refined elegance for the modern professional. Featuring a dedicated home office, walk-in wardrobe, chef's kitchen, and floor-to-ceiling windows framing the city skyline.",
      ar: "أناقة راقية للمحترف العصري. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف، ونوافذ من الأرض إلى السقف تؤطر أفق المدينة.",
    },
    features: {
      en: ["City View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
      ar: ["إطلالة المدينة", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
    },
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 35, x: 5, y: 5, label: { en: "Master Suite\n420 sq ft", ar: "الجناح الرئيسي\n٤٢٠ قدم²" } },
        { key: "bed2", w: 28, h: 28, x: 44, y: 5, label: { en: "Bedroom 2\n300 sq ft", ar: "غرفة ٢\n٣٠٠ قدم²" } },
        { key: "office", w: 22, h: 25, x: 76, y: 5, label: { en: "Home Office\n180 sq ft", ar: "مكتب منزلي\n١٨٠ قدم²" } },
        { key: "living", w: 42, h: 28, x: 5, y: 44, label: { en: "Living Room\n620 sq ft", ar: "غرفة المعيشة\n٦٢٠ قدم²" } },
        { key: "kitchen", w: 28, h: 22, x: 50, y: 44, label: { en: "Chef's Kitchen\n280 sq ft", ar: "مطبخ الشيف\n٢٨٠ قدم²" } },
        { key: "balcony", w: 70, h: 14, x: 5, y: 76, label: { en: "Sky Balcony\n380 sq ft", ar: "شرفة سماوية\n٣٨٠ قدم²" } },
      ],
      specs: { bathrooms: "2+1", balconySize: "380 sq ft", totalArea: "2,800 sq ft" },
    },
    payment: { base: 4200000, plans: ["60/40", "70/30"] },
  },
];

const AMENITIES = [
  { icon: "🏊", en: "Infinity Pool", ar: "مسبح إنفينيتي" },
  { icon: "🧖", en: "Spa & Wellness", ar: "سبا وعافية" },
  { icon: "🍽️", en: "Fine Dining", ar: "مطاعم فاخرة" },
  { icon: "🏋️", en: "Fitness Center", ar: "مركز لياقة" },
  { icon: "🛥️", en: "Marina Access", ar: "مرسى خاص" },
  { icon: "🌿", en: "Sky Gardens", ar: "حدائق سماوية" },
  { icon: "🏥", en: "Medical Center", ar: "مركز طبي" },
  { icon: "🛒", en: "Retail & Cafés", ar: "تسوق ومقاهي" },
];

const INVEST = {
  en: [
    { label: "Rental Yield", value: "8.2%", note: "Above market average" },
    { label: "Capital Growth", value: "23%", note: "3-year projection" },
    { label: "Payment Plan", value: "60/40", note: "Flexible terms" },
    { label: "Handover", value: "Q4 2027", note: "On schedule" },
  ],
  ar: [
    { label: "عائد الإيجار", value: "٨.٢٪", note: "أعلى من السوق" },
    { label: "نمو رأس المال", value: "٢٣٪", note: "توقعات ٣ سنوات" },
    { label: "خطة الدفع", value: "٦٠/٤٠", note: "شروط مرنة" },
    { label: "التسليم", value: "Q4 2027", note: "في الموعد" },
  ],
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

  const resRef = useRef(null);
  const t = LANG[lang];

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }); document.querySelectorAll(".mp-rv").forEach((el) => obs.observe(el)); return () => obs.disconnect(); }, [lang, modal, selectedUnit, showLeadForm]);
  useEffect(() => { trackEvent("marketplace_visit"); }, []);

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");
  const showToast = useCallback((msg) => { setToastHiding(false); setToast(msg); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);
  const fmtAED = (n) => lang === "en" ? `AED ${n.toLocaleString()}` : `${n.toLocaleString()} درهم`;

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
    _leadInfo = newLead;
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
  const openDetail = (unit) => { setSelectedUnit(unit); trackEvent("view_unit", { unitId: unit.id, unitName: unit.name.en, tower: unit.tower, unitType: unit.unitType }); };
  const openFloor = (unit) => requireLead(() => { setModalUnit(unit); setModal("floorplan"); trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.name.en, tower: unit.tower, unitType: unit.unitType }); showToast(t.toast.floorPlan); });
  const openBrochure = (unit) => requireLead(() => { setModalUnit(unit); setModal("brochure"); trackEvent("download_brochure", { unitId: unit.id, unitName: unit.name.en, tower: unit.tower, unitType: unit.unitType }); showToast(t.toast.brochure); });
  const openPayment = (unit) => requireLead(() => { setModalUnit(unit); setModal("payment"); setPayPlan("60/40"); trackEvent("explore_payment_plan", { unitId: unit.id, unitName: unit.name.en, tower: unit.tower, unitType: unit.unitType }); });
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => requireLead(() => { trackEvent("request_pricing", { unitId: unit.id, unitName: unit.name.en, tower: unit.tower, unitType: unit.unitType }); showToast(t.toast.pricing); });
  const handleBooking = (unit) => requireLead(() => { trackEvent("book_viewing", { unitId: unit?.id || "general" }); showToast(t.toast.booking); });
  const closeAll = () => { setModal(null); setModalUnit(null); setSelectedUnit(null); };

  const filteredUnits = filter === "all" ? UNITS : UNITS.filter(u => u.filterKey === filter);

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
        <Link to="/enterprise/crmdemo/dashboard">Dashboard</Link>
        <Link to="/enterprise/crmdemo/ai-demo">AI Pipeline</Link>
        <span className="crossnav-persona">🌐 {lang === "ar" ? "زائر عام" : "Public Visitor"}</span>
      </div>
      <header className={`mp-hd ${scrolled ? "sc" : ""}`}>
        <div className="mp-logo">Vista <b>Residences</b></div>
        <div className="mp-nav">
          {lead && <span className="mp-lead-badge">{lead.name}</span>}
          {compareList.length > 0 && <button className="mp-navbtn" onClick={openCompare}>{t.unitActions.compare}<span className="mp-cmp-count">{compareList.length}</span></button>}
          <button className="mp-navbtn" onClick={toggleLang}>{t.nav.lang}</button>
          <button className="mp-navbtn-dark" onClick={() => { if (!lead) setShowLeadForm(true); else showToast(t.toast.registered); }}>
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
          <h1 className="mp-htitle">{lang === "en" ? (<>Vista<br />Residences</>) : (<>فيستا<br />ريزيدنسز</>)}</h1>
          <p className="mp-hdesc">{t.hero.subtitle}</p>
          <div className="mp-hacts">
            <button className="mp-btn-d" onClick={() => { trackEvent("cta_browse"); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="mp-btn-l" onClick={() => handleBooking()}>{t.hero.ctaSecondary}</button>
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
            {[{ key: "all", l: t.filters.all }, { key: "penthouse", l: t.filters.penthouse }, { key: "3bed", l: t.filters.bed3 }, { key: "2bed", l: t.filters.bed2 }].map(f => (
              <button key={f.key} className={`mp-ftab ${filter === f.key ? "on" : "off"}`} onClick={() => { setFilter(f.key); trackEvent("filter_units", { filter: f.key }); }}>{f.l}</button>
            ))}
          </div>
        </div>
        <div className="mp-units">
          {filteredUnits.map((unit) => (
            <div className="mp-card mp-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="mp-card-img">
                <img src={unit.img} alt={unit.name[lang]} loading="lazy" />
                <div className="mp-card-fbadge">{unit.type[lang]}</div>
                <div className="mp-card-status" style={{ background: unit.statusColor }}>{unit.status[lang]}</div>
              </div>
              <div className="mp-card-body">
                <h3 className="mp-card-name">{unit.name[lang]}</h3>
                <p className="mp-card-floor">{unit.floor[lang]}</p>
                <div className="mp-card-meta"><span>🛏 {unit.beds[lang]}</span><span>📐 {unit.size[lang]}</span></div>
                <div className="mp-card-price">{unit.priceRange[lang]}</div>
                <div className="mp-card-hint">{t.card.registerPrice}</div>
              </div>
              <div className="mp-card-acts" onClick={(e) => e.stopPropagation()}>
                <button className="mp-btn-l mp-btn-sm" onClick={() => openFloor(unit)}>📐 {t.unitActions.floorPlan}</button>
                <button className="mp-btn-l mp-btn-sm" onClick={() => openBrochure(unit)}>📄 {t.unitActions.brochure}</button>
                <button className="mp-btn-d mp-btn-sm" onClick={() => reqPricing(unit)}>💰 {t.card.getPricing}</button>
                <button className="mp-btn-l mp-btn-sm" onClick={() => toggleCompare(unit.id)} style={compareList.includes(unit.id) ? { borderColor: "var(--mp-ch)", fontWeight: 600 } : {}}>
                  {compareList.includes(unit.id) ? `✓ ${t.unitActions.compare}` : `⚖️ ${t.unitActions.compare}`}
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
        <div className="mp-am-grid">{AMENITIES.map((a, i) => (<div className="mp-am mp-rv" key={i}><div className="mp-am-icon">{a.icon}</div><div className="mp-am-name">{a[lang]}</div></div>))}</div>
      </section>

      <div className="mp-div"><div className="mp-div-l" /><div className="mp-div-d">◆</div><div className="mp-div-l" /></div>

      {/* INVESTMENT */}
      <section className="mp-sec">
        <div className="mp-sh mp-rv"><span className="mp-sl">{t.sections.investment}</span><h2 className="mp-st">{t.sections.investmentSub}</h2></div>
        <div className="mp-inv-grid">{INVEST[lang].map((item, i) => (<div className="mp-inv mp-rv" key={i}><div className="mp-inv-v">{item.value}</div><div className="mp-inv-l">{item.label}</div><div className="mp-inv-n">{item.note}</div></div>))}</div>

      </section>

      {/* ── ROI CALCULATOR BANNER ── */}
      <Link to="/enterprise/crmdemo/roi-calculator" className="mp-roi-banner" onClick={() => { trackEvent("roi_calculator_click"); }}>
        <div className="mp-roi-icon">📊</div>
        <div className="mp-roi-content">
          <h3 className="mp-roi-title">{t.roiBanner.title}</h3>
          <p className="mp-roi-desc">{t.roiBanner.desc}</p>
        </div>
        <span className="mp-roi-cta">{t.roiBanner.cta}</span>
      </Link>

      {/* CTA BANNER */}
      <section className="mp-cta-banner mp-rv">
        <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: "#FAFAF8", marginBottom: ".8rem" }}>{t.sections.cta}</h2>
        <p style={{ color: "rgba(250,250,248,.6)", fontSize: ".95rem", fontWeight: 400, maxWidth: "500px", margin: "0 auto 2rem" }}>{t.sections.ctaSub}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button style={{ padding: ".9rem 2.5rem", background: "#FAFAF8", color: "var(--mp-ch)", fontSize: ".82rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", border: "none", borderRadius: "4px", cursor: "pointer" }} onClick={() => { if (!lead) setShowLeadForm(true); else showToast(t.toast.registered); }}>
            {lead ? `✅ ${t.registerDone}` : `${t.registerNow} →`}
          </button>
          <button style={{ padding: ".9rem 2.5rem", background: "transparent", color: "#FAFAF8", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase", border: "1px solid rgba(250,250,248,.25)", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleBooking()}>
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
          <div className="mp-md-gallery">{selectedUnit.gallery.map((src, i) => <img key={i} src={src} alt={`${selectedUnit.name[lang]} ${i+1}`} loading="lazy" />)}</div>
          <div className="mp-modal-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <div><h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "2.2rem", fontWeight: 500, color: "var(--mp-t1)" }}>{selectedUnit.name[lang]}</h2><p style={{ color: "var(--mp-t3)", fontSize: ".82rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{selectedUnit.floor[lang]}</p></div>
              <div style={{ textAlign: lang === "ar" ? "start" : "end" }}><div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", fontWeight: 500, color: "var(--mp-t1)" }}>{selectedUnit.priceRange[lang]}</div><div style={{ fontSize: ".78rem", color: "var(--mp-t3)" }}>{t.card.registerPrice}</div></div>
            </div>
            <p style={{ color: "var(--mp-t2)", fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 400, marginBottom: "2rem", maxWidth: "700px" }}>{selectedUnit.desc[lang]}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
              {[{ l: lang === "en" ? "Bedrooms" : "غرف النوم", v: selectedUnit.beds[lang] },{ l: lang === "en" ? "Bathrooms" : "الحمامات", v: selectedUnit.baths[lang] },{ l: lang === "en" ? "Living Area" : "المساحة", v: selectedUnit.size[lang] },{ l: lang === "en" ? "Status" : "الحالة", v: selectedUnit.status[lang], isSt: true }].map((item, i) => (
                <div key={i} style={{ padding: "1rem", border: "1px solid var(--mp-bdr)", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mp-t3)", marginBottom: ".3rem" }}>{item.l}</div>
                  {item.isSt ? <div style={{ color: "#fff", fontSize: ".9rem", background: selectedUnit.statusColor, display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontWeight: 600 }}>{item.v}</div>
                    : <div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.2rem", color: "var(--mp-t1)" }}>{item.v}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2rem" }}>
              {selectedUnit.features[lang].map((f, i) => (<span key={i} style={{ padding: ".4rem .9rem", background: "rgba(26,26,31,.04)", border: "1px solid var(--mp-bdr)", borderRadius: "4px", fontSize: ".78rem", color: "var(--mp-t2)" }}>{f}</span>))}
            </div>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", paddingTop: "1.5rem", borderTop: "1px solid var(--mp-bdr)" }}>
              <button className="mp-btn-d mp-btn-sm" onClick={() => { closeAll(); reqPricing(selectedUnit); }}>💰 {t.unitActions.pricing}</button>
              <button className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openFloor(selectedUnit); }}>📐 {t.unitActions.floorPlan}</button>
              <button className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openBrochure(selectedUnit); }}>📄 {t.unitActions.brochure}</button>
              <button className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); openPayment(selectedUnit); }}>📊 Payment Plan</button>
              <button className="mp-btn-l mp-btn-sm" onClick={() => { closeAll(); handleBooking(selectedUnit); }}>📅 {t.unitActions.book}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* FLOOR PLAN */}
      {modal === "floorplan" && modalUnit && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-modal-body">
            <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name[lang]}</h2>
            <p style={{ color: "var(--mp-t3)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor[lang]}</p>
            <svg className="mp-fp-svg" viewBox="0 0 100 65">
              {modalUnit.floorPlan.rooms.map((room, i) => (<g key={i}><rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#999"} fillOpacity="0.15" stroke={ROOM_COLORS[room.key] || "#999"} strokeWidth="0.3" rx="0.5" />{room.label[lang].split("\n").map((line, li) => (<text key={li} x={room.x + room.w / 2} y={room.y + room.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fill={ROOM_COLORS[room.key] || "#888"} fontSize="2.2" fontFamily="Outfit, sans-serif" fontWeight={li === 0 ? "500" : "400"}>{line}</text>))}</g>))}
            </svg>
            <div className="mp-fp-specs">
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.bathrooms}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.bathrooms}</div></div>
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.balcony}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.balconySize}</div></div>
              <div className="mp-fp-spec"><div className="mp-fp-spec-l">{t.floorPlanModal.totalArea}</div><div className="mp-fp-spec-v">{modalUnit.floorPlan.specs.totalArea}</div></div>
            </div>
            <button className="mp-btn-d" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "Floor plan PDF downloading..." : "جاري تحميل المخطط...")}>{t.floorPlanModal.download}</button>
            <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--mp-t3)", marginTop: "1rem" }}>{t.floorPlanModal.disclaimer}</p>
          </div>
        </div></div>
      )}

      {/* BROCHURE */}
      {modal === "brochure" && modalUnit && (
        <div className="mp-modal-ov" onClick={closeAll}><div className="mp-modal" style={{ maxWidth: "550px" }} onClick={(e) => e.stopPropagation()}>
          <button className="mp-modal-x" onClick={closeAll}>✕</button>
          <div className="mp-modal-body" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
            <div className="mp-br-prog"><div className="mp-br-fill" /></div>
            <h2 style={{ fontFamily: "var(--mp-serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>{t.brochureModal.ready}</h2>
            <p style={{ color: "var(--mp-t2)", fontSize: ".95rem", marginBottom: "1.5rem" }}>{t.brochureModal.desc}</p>
            <p style={{ color: "var(--mp-t1)", fontSize: ".85rem", fontWeight: 500, marginBottom: ".5rem" }}>{t.brochureModal.includes}</p>
            <div className="mp-br-items" style={{ textAlign: "start" }}>{t.brochureModal.items.map((item, i) => (<div className="mp-br-item" key={i}>{item}</div>))}</div>
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
              <button className="mp-btn-d" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "PDF downloading..." : "جاري التحميل...")}>{t.brochureModal.download}</button>
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
              <p style={{ fontFamily: "var(--mp-serif)", fontSize: "2rem", color: "var(--mp-t1)", marginBottom: "2rem" }}>{t.paymentModal.totalPrice}: {fmtAED(modalUnit.payment.base)}</p>
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
                  <div style={{ textAlign: "end" }}><div style={{ fontSize: ".75rem", color: "var(--mp-t3)" }}>{m.pct}%</div><div style={{ fontFamily: "var(--mp-serif)", fontSize: "1.1rem", fontWeight: 500 }}>{fmtAED(modalUnit.payment.base * m.pct / 100)}</div></div>
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
              const units = compareList.map((id) => UNITS.find((u) => u.id === id)).filter(Boolean);
              const cols = `180px repeat(${units.length}, 1fr)`;
              const rows = [
                { label: t.compareModal.price, get: (u) => u.priceRange[lang] },
                { label: t.compareModal.floor, get: (u) => u.floor[lang] },
                { label: t.compareModal.bedrooms, get: (u) => u.beds[lang] },
                { label: t.compareModal.size, get: (u) => u.size[lang] },
                { label: t.compareModal.view, get: (u) => u.feature[lang] },
                { label: t.compareModal.category, get: (u) => u.category[lang] },
              ];
              return (<div>
                <div className="mp-cmp-row hdr" style={{ gridTemplateColumns: cols }}><div>{t.compareModal.feature}</div>{units.map((u) => (<div key={u.id} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--mp-serif)", fontSize: "1rem", fontWeight: 500, marginBottom: ".3rem" }}>{u.name[lang]}</div><button className="mp-cmp-rm" onClick={() => toggleCompare(u.id)}>{t.compareModal.remove}</button></div>))}</div>
                {rows.map((row, ri) => (<div className="mp-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}><div className="mp-cmp-label">{row.label}</div>{units.map((u) => (<div className="mp-cmp-val" key={u.id}>{row.get(u)}</div>))}</div>))}
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
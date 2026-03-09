import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// VIP Portal v2.0 — "Zero Dead Ends" Edition
// ═══════════════════════════════════════════════════════════════
// Design: Gulf Luxury (DAMAC/Omniyat/Emaar)
// Features: Floor Plans, Brochures, Payment Plans, Booking,
//           Comparison, CRM Tracking, Toast System
// ═══════════════════════════════════════════════════════════════

// ─── TRACKING ENGINE ─────────────────────────────────────────
const trackEvent = (event, data = {}) => {
  const ev = {
    timestamp: new Date().toISOString(),
    portalType: "vip",
    vipName: "Khalid Al-Rashid",
    vipCode: "VIP-2024-KR",
    event,
    ...data,
  };
  const existing = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
  existing.push(ev);
  localStorage.setItem("dnfc_events", JSON.stringify(existing));
};

// ─── LANG / CONTENT ──────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP Access", lang: "العربية", compare: "Compare" },
    hero: {
      badge: "Private Invitation",
      greeting: "Welcome,",
      tagline: "Your Exclusive Residence Awaits",
      subtitle: "A curated selection of premium residences, handpicked for discerning investors who demand nothing less than extraordinary.",
      cta: "Explore Residences",
      ctaSecondary: "Schedule Private Viewing",
    },
    stats: { units: "Premium Units", floors: "Floors of Luxury", roi: "Projected ROI", completion: "Completion" },
    sections: {
      residences: "The Residences", residencesSub: "Where Vision Meets the Skyline",
      amenities: "The Lifestyle", amenitiesSub: "Curated Experiences Beyond the Ordinary",
      investment: "The Opportunity", investmentSub: "Strategic Value in Every Detail",
      contact: "Private Consultation", contactSub: "Your dedicated advisor awaits",
    },
    unitActions: {
      floorPlan: "View Floor Plan", brochure: "Download Brochure",
      pricing: "Request Pricing", book: "Book Viewing", compare: "Compare",
    },
    floorPlanModal: {
      title: "Floor Plan",
      bedrooms: "Bedrooms", living: "Living Area", balcony: "Balcony",
      kitchen: "Kitchen", master: "Master Suite", bathroom: "Bathrooms",
      totalArea: "Total Area", download: "Download Floor Plan PDF",
      disclaimer: "Floor plans are indicative and may vary. Actual dimensions confirmed upon handover.",
    },
    brochureModal: {
      title: "Digital Brochure",
      downloading: "Preparing your brochure...",
      ready: "Brochure Ready",
      desc: "Your personalized digital brochure has been prepared with exclusive details.",
      download: "Download Brochure PDF",
      email: "Send to Email",
      includes: "Brochure includes:",
      items: ["Detailed floor plans & specifications", "Premium finishes catalog", "Amenity & lifestyle overview", "Investment analysis & payment plans", "Location & connectivity map"],
    },
    paymentModal: {
      title: "Payment Plan",
      subtitle: "Flexible payment structure designed for investors",
      totalPrice: "Total Price",
      plan6040: "60/40 Plan",
      plan6040Desc: "60% during construction · 40% on handover",
      plan7030: "70/30 Plan",
      plan7030Desc: "70% during construction · 30% post-handover (12 months)",
      milestones: "Payment Milestones",
      m1: "Booking Deposit", m1d: "Upon reservation",
      m2: "First Installment", m2d: "Within 30 days",
      m3: "Construction 30%", m3d: "Upon 30% completion",
      m4: "Construction 60%", m4d: "Upon 60% completion",
      m5: "Handover", m5d: "Upon key handover",
      m6: "Post-Handover", m6d: "12 months after handover",
      requestCall: "Request Payment Consultation",
      disclaimer: "Payment plans subject to approval. Terms may vary based on unit selection.",
    },
    compareModal: {
      title: "Compare Residences",
      feature: "Feature", remove: "Remove",
      price: "Price", floor: "Floor", bedrooms: "Bedrooms", size: "Size",
      view: "View", category: "Category",
      empty: "Add residences to compare by clicking the compare icon on unit cards.",
    },
    booking: {
      name: "Full Name", email: "Email Address", phone: "Phone Number",
      preferred: "Preferred Residence", date: "Preferred Date", time: "Preferred Time",
      notes: "Additional Notes", submit: "Request Private Viewing",
      note: "Your information is protected. We will contact you within 24 hours.",
      morning: "Morning (9AM-12PM)", afternoon: "Afternoon (12PM-4PM)", evening: "Evening (4PM-7PM)",
      success: "Viewing Request Submitted",
      successDesc: "Thank you! Your dedicated advisor will contact you within 24 hours to confirm your private viewing.",
      successRef: "Reference",
    },
    toast: {
      floorPlan: "Floor plan opened", brochure: "Brochure downloaded",
      pricing: "Pricing request sent", booking: "Viewing request submitted",
      compare: "Added to comparison", compareRemove: "Removed from comparison",
      copied: "Link copied", emailSent: "Brochure sent to your email",
    },
    footer: "This is a private portal. Content is personalized for your exclusive access.",
  },
  ar: {
    dir: "rtl",
    nav: { vip: "وصول VIP", lang: "English", compare: "مقارنة" },
    hero: {
      badge: "دعوة خاصة",
      greeting: "أهلاً وسهلاً،",
      tagline: "مسكنك الحصري بانتظارك",
      subtitle: "مجموعة مختارة من المساكن الفاخرة، مصممة خصيصاً للمستثمرين الذين لا يقبلون إلا بالاستثنائي.",
      cta: "استكشف المساكن",
      ctaSecondary: "حجز معاينة خاصة",
    },
    stats: { units: "وحدة فاخرة", floors: "طابقاً من الفخامة", roi: "عائد متوقع", completion: "التسليم" },
    sections: {
      residences: "المساكن", residencesSub: "حيث تلتقي الرؤية بالأفق",
      amenities: "أسلوب الحياة", amenitiesSub: "تجارب مُنتقاة تتجاوز المألوف",
      investment: "الفرصة الاستثمارية", investmentSub: "قيمة استراتيجية في كل تفصيل",
      contact: "استشارة خاصة", contactSub: "مستشارك المخصص بانتظارك",
    },
    unitActions: {
      floorPlan: "عرض المخطط", brochure: "تحميل الكتيب",
      pricing: "طلب التسعير", book: "حجز معاينة", compare: "مقارنة",
    },
    floorPlanModal: {
      title: "المخطط الطابقي",
      bedrooms: "غرف النوم", living: "منطقة المعيشة", balcony: "الشرفة",
      kitchen: "المطبخ", master: "الجناح الرئيسي", bathroom: "الحمامات",
      totalArea: "المساحة الإجمالية", download: "تحميل المخطط PDF",
      disclaimer: "المخططات استرشادية وقد تختلف. الأبعاد الفعلية تُؤكد عند التسليم.",
    },
    brochureModal: {
      title: "الكتيب الرقمي",
      downloading: "جاري تحضير الكتيب...",
      ready: "الكتيب جاهز",
      desc: "تم إعداد كتيبك الرقمي المخصص مع تفاصيل حصرية.",
      download: "تحميل الكتيب PDF",
      email: "إرسال للبريد الإلكتروني",
      includes: "يتضمن الكتيب:",
      items: ["مخططات تفصيلية ومواصفات", "كتالوج التشطيبات الفاخرة", "نظرة على المرافق ونمط الحياة", "تحليل استثماري وخطط الدفع", "خريطة الموقع والاتصال"],
    },
    paymentModal: {
      title: "خطة الدفع",
      subtitle: "هيكل دفع مرن مصمم للمستثمرين",
      totalPrice: "السعر الإجمالي",
      plan6040: "خطة ٦٠/٤٠",
      plan6040Desc: "٦٠٪ خلال البناء · ٤٠٪ عند التسليم",
      plan7030: "خطة ٧٠/٣٠",
      plan7030Desc: "٧٠٪ خلال البناء · ٣٠٪ بعد التسليم (١٢ شهر)",
      milestones: "مراحل الدفع",
      m1: "عربون الحجز", m1d: "عند الحجز",
      m2: "القسط الأول", m2d: "خلال ٣٠ يوم",
      m3: "البناء ٣٠٪", m3d: "عند إتمام ٣٠٪",
      m4: "البناء ٦٠٪", m4d: "عند إتمام ٦٠٪",
      m5: "التسليم", m5d: "عند تسليم المفتاح",
      m6: "بعد التسليم", m6d: "١٢ شهر بعد التسليم",
      requestCall: "طلب استشارة الدفع",
      disclaimer: "خطط الدفع تخضع للموافقة. قد تختلف الشروط حسب الوحدة المختارة.",
    },
    compareModal: {
      title: "مقارنة المساكن",
      feature: "الميزة", remove: "إزالة",
      price: "السعر", floor: "الطابق", bedrooms: "غرف النوم", size: "المساحة",
      view: "الإطلالة", category: "الفئة",
      empty: "أضف مساكن للمقارنة بالنقر على أيقونة المقارنة في بطاقات الوحدات.",
    },
    booking: {
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      preferred: "المسكن المفضل", date: "التاريخ المفضل", time: "الوقت المفضل",
      notes: "ملاحظات إضافية", submit: "طلب معاينة خاصة",
      note: "معلوماتك محمية. سنتواصل معك خلال ٢٤ ساعة.",
      morning: "صباحاً (٩-١٢)", afternoon: "ظهراً (١٢-٤)", evening: "مساءً (٤-٧)",
      success: "تم تقديم طلب المعاينة",
      successDesc: "شكراً لك! سيتواصل معك مستشارك المخصص خلال ٢٤ ساعة لتأكيد معاينتك الخاصة.",
      successRef: "المرجع",
    },
    toast: {
      floorPlan: "تم فتح المخطط", brochure: "تم تحميل الكتيب",
      pricing: "تم إرسال طلب التسعير", booking: "تم تقديم طلب المعاينة",
      compare: "تمت الإضافة للمقارنة", compareRemove: "تمت الإزالة من المقارنة",
      copied: "تم نسخ الرابط", emailSent: "تم إرسال الكتيب لبريدك",
    },
    footer: "هذه بوابة خاصة. المحتوى مخصص لوصولك الحصري.",
  },
};

// ─── UNIT DATA (with floor plan specs + pricing) ─────────────
const UNITS = [
  {
    id: "T1-PH42", name: { en: "Sky Penthouse", ar: "بنتهاوس السماء" },
    floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤" },
    bed: { en: "4 Bedrooms", ar: "٤ غرف نوم" }, bedNum: 4,
    size: "6,200", sizeNum: 6200,
    price: { en: "AED 12.5M", ar: "١٢.٥ مليون درهم" }, priceNum: 12500000,
    feature: { en: "360° Panoramic Views", ar: "إطلالة بانورامية ٣٦٠°" },
    desc: {
      en: "A triple-height masterpiece crowning the tower, with private infinity pool and direct elevator access.",
      ar: "تحفة معمارية بارتفاع ثلاثي تتوّج البرج، مع مسبح إنفينيتي خاص ومصعد مباشر.",
    },
    category: { en: "Penthouse", ar: "بنتهاوس" },
    view: { en: "Sea + City Panoramic", ar: "بانورامية بحر + مدينة" },
    floorPlan: {
      rooms: [
        { key: "master", w: 42, h: 30, x: 5, y: 5, label: { en: "Master Suite\n580 sq ft", ar: "الجناح الرئيسي\n٥٨٠ قدم²" } },
        { key: "bed2", w: 22, h: 20, x: 50, y: 5, label: { en: "Bedroom 2\n320 sq ft", ar: "غرفة ٢\n٣٢٠ قدم²" } },
        { key: "bed3", w: 22, h: 20, x: 75, y: 5, label: { en: "Bedroom 3\n280 sq ft", ar: "غرفة ٣\n٢٨٠ قدم²" } },
        { key: "bed4", w: 22, h: 20, x: 75, y: 28, label: { en: "Bedroom 4\n260 sq ft", ar: "غرفة ٤\n٢٦٠ قدم²" } },
        { key: "living", w: 42, h: 30, x: 5, y: 38, label: { en: "Grand Living\n980 sq ft", ar: "صالة كبرى\n٩٨٠ قدم²" } },
        { key: "kitchen", w: 25, h: 20, x: 50, y: 38, label: { en: "Chef's Kitchen\n420 sq ft", ar: "مطبخ الشيف\n٤٢٠ قدم²" } },
        { key: "dining", w: 25, h: 18, x: 50, y: 60, label: { en: "Dining\n380 sq ft", ar: "طعام\n٣٨٠ قدم²" } },
        { key: "balcony", w: 92, h: 14, x: 5, y: 72, label: { en: "Wraparound Terrace\n1,200 sq ft", ar: "تراس محيطي\n١,٢٠٠ قدم²" } },
        { key: "pool", w: 30, h: 10, x: 35, y: 88, label: { en: "Private Pool", ar: "مسبح خاص" } },
      ],
      specs: { bathrooms: "5+1", balconySize: "1,200 sq ft", totalArea: "6,200 sq ft" },
    },
    payment: { base: 12500000, plans: ["60/40", "70/30"] },
  },
  {
    id: "T1-3502", name: { en: "Grand Residence", ar: "الإقامة الكبرى" },
    floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨" },
    bed: { en: "3 Bedrooms", ar: "٣ غرف نوم" }, bedNum: 3,
    size: "4,100", sizeNum: 4100,
    price: { en: "AED 7.8M", ar: "٧.٨ مليون درهم" }, priceNum: 7800000,
    feature: { en: "Marina & Sea View", ar: "إطلالة على المارينا والبحر" },
    desc: {
      en: "Expansive living with floor-to-ceiling glazing, Italian marble throughout, and a private terrace overlooking the marina.",
      ar: "مساحة واسعة مع زجاج من الأرض إلى السقف، رخام إيطالي، وتراس خاص يطل على المارينا.",
    },
    category: { en: "Grand Residence", ar: "إقامة كبرى" },
    view: { en: "Marina & Sea", ar: "مارينا وبحر" },
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 32, x: 5, y: 5, label: { en: "Master Suite\n480 sq ft", ar: "الجناح الرئيسي\n٤٨٠ قدم²" } },
        { key: "bed2", w: 25, h: 25, x: 43, y: 5, label: { en: "Bedroom 2\n320 sq ft", ar: "غرفة ٢\n٣٢٠ قدم²" } },
        { key: "bed3", w: 25, h: 25, x: 72, y: 5, label: { en: "Bedroom 3\n280 sq ft", ar: "غرفة ٣\n٢٨٠ قدم²" } },
        { key: "living", w: 45, h: 28, x: 5, y: 40, label: { en: "Living & Dining\n860 sq ft", ar: "معيشة وطعام\n٨٦٠ قدم²" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 40, label: { en: "Kitchen\n340 sq ft", ar: "مطبخ\n٣٤٠ قدم²" } },
        { key: "maid", w: 18, h: 22, x: 80, y: 40, label: { en: "Maid's Room", ar: "غرفة الخدم" } },
        { key: "balcony", w: 92, h: 16, x: 5, y: 72, label: { en: "Marina Terrace\n680 sq ft", ar: "تراس المارينا\n٦٨٠ قدم²" } },
      ],
      specs: { bathrooms: "3+1", balconySize: "680 sq ft", totalArea: "4,100 sq ft" },
    },
    payment: { base: 7800000, plans: ["60/40", "70/30"] },
  },
  {
    id: "T1-2503", name: { en: "Executive Suite", ar: "الجناح التنفيذي" },
    floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠" },
    bed: { en: "2 Bedrooms", ar: "غرفتا نوم" }, bedNum: 2,
    size: "2,800", sizeNum: 2800,
    price: { en: "AED 4.2M", ar: "٤.٢ مليون درهم" }, priceNum: 4200000,
    feature: { en: "City Skyline View", ar: "إطلالة على أفق المدينة" },
    desc: {
      en: "Refined elegance for the modern executive, featuring a home office, walk-in wardrobe, and chef's kitchen.",
      ar: "أناقة راقية للتنفيذي العصري، مع مكتب منزلي وغرفة ملابس ومطبخ الشيف.",
    },
    category: { en: "Executive Suite", ar: "جناح تنفيذي" },
    view: { en: "City Skyline", ar: "أفق المدينة" },
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

const AMENITIES = {
  en: [
    { icon: "🏊", name: "Infinity Edge Pool", desc: "60m rooftop pool with panoramic views" },
    { icon: "🧖", name: "Spa & Wellness", desc: "Full-service spa with hammam & cryo chamber" },
    { icon: "🍽️", name: "Private Dining", desc: "Michelin-standard resident-only restaurant" },
    { icon: "🏋️", name: "Fitness Atelier", desc: "Technogym-equipped with personal trainers" },
    { icon: "🛥️", name: "Marina Access", desc: "Private berths for yachts up to 60ft" },
    { icon: "🌿", name: "Sky Gardens", desc: "Landscaped terraces on every 10th floor" },
  ],
  ar: [
    { icon: "🏊", name: "مسبح إنفينيتي", desc: "مسبح على السطح بطول ٦٠ متر مع إطلالات بانورامية" },
    { icon: "🧖", name: "سبا وعافية", desc: "سبا متكامل مع حمام تركي وغرفة تبريد" },
    { icon: "🍽️", name: "مطعم خاص", desc: "مطعم حصري للسكان بمعايير ميشلان" },
    { icon: "🏋️", name: "صالة لياقة", desc: "مجهزة بأحدث أجهزة تكنوجيم مع مدربين شخصيين" },
    { icon: "🛥️", name: "مرسى خاص", desc: "أرصفة خاصة لليخوت حتى ٦٠ قدم" },
    { icon: "🌿", name: "حدائق سماوية", desc: "شرفات منسقة كل ١٠ طوابق" },
  ],
};

const INVEST = {
  en: [
    { label: "Rental Yield", value: "8.2%", note: "Above market average" },
    { label: "Capital Growth", value: "23%", note: "Projected 3-year appreciation" },
    { label: "Payment Plan", value: "60/40", note: "Flexible construction-linked" },
    { label: "Handover", value: "Q4 2027", note: "On schedule" },
  ],
  ar: [
    { label: "عائد الإيجار", value: "٨.٢٪", note: "أعلى من متوسط السوق" },
    { label: "نمو رأس المال", value: "٢٣٪", note: "ارتفاع متوقع خلال ٣ سنوات" },
    { label: "خطة الدفع", value: "٦٠/٤٠", note: "مرنة مرتبطة بالبناء" },
    { label: "التسليم", value: "Q4 2027", note: "في الموعد المحدد" },
  ],
};

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85",
  penthouse: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  living: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  interior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  pool: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
};
const unitImages = [IMAGES.penthouse, IMAGES.living, IMAGES.interior];

const ROOM_COLORS = {
  master: "#C5A467", bed2: "#8AADBD", bed3: "#93B5A0", bed4: "#B5A293",
  living: "#D4C5A9", kitchen: "#A3B8C5", dining: "#C5B8A3", office: "#A8B5C5",
  balcony: "#B8D4C5", pool: "#7EC8E3", maid: "#C5B8C5", bath: "#B8C5D4",
};

// ─── CSS ─────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

:root {
  --gold: #C5A467;
  --gold-light: #D4B97A;
  --gold-glow: rgba(197, 164, 103, 0.15);
  --gold-border: rgba(197, 164, 103, 0.25);
  --charcoal: #1A1A1F;
  --charcoal-light: #2A2A32;
  --cream: #FAF8F5;
  --cream-warm: #F5F0E8;
  --text: #1A1A1F;
  --text-muted: #6B6B78;
  --text-light: #9B9BA8;
  --red: #C8374D;
  --green: #2D8F6F;
  --blue: #457B9D;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.vp-luxury {
  font-family: 'Outfit', sans-serif;
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Header ── */
.vp-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 3rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.vp-header.scrolled {
  background: rgba(26, 26, 31, 0.95);
  backdrop-filter: blur(20px);
  padding: 0.75rem 3rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
}
.vp-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 300; color: white;
  letter-spacing: 0.08em;
}
.vp-logo span { font-weight: 600; color: var(--gold); }
.vp-nav { display: flex; align-items: center; gap: 0.75rem; }
.vp-nav-badge {
  padding: 0.35rem 0.85rem; border: 1px solid var(--gold-border);
  border-radius: 50px; font-size: 0.7rem; color: var(--gold);
  letter-spacing: 0.12em; text-transform: uppercase;
}
.vp-lang-btn {
  background: none; border: 1px solid rgba(255,255,255,0.2);
  color: white; padding: 0.35rem 0.85rem; border-radius: 50px;
  font-size: 0.72rem; cursor: pointer; transition: all 0.3s;
  font-family: 'Outfit', sans-serif;
}
.vp-lang-btn:hover { border-color: var(--gold); color: var(--gold); }
.vp-compare-btn {
  background: none; border: 1px solid rgba(255,255,255,0.2);
  color: white; padding: 0.35rem 0.85rem; border-radius: 50px;
  font-size: 0.72rem; cursor: pointer; transition: all 0.3s;
  font-family: 'Outfit', sans-serif; position: relative;
}
.vp-compare-btn:hover { border-color: var(--gold); color: var(--gold); }
.vp-compare-count {
  position: absolute; top: -6px; right: -6px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--red); color: white; font-size: 0.55rem;
  display: flex; align-items: center; justify-content: center; font-weight: 600;
}

/* ── Hero ── */
.vp-hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(170deg, rgba(26,26,31,0.75) 0%, rgba(26,26,31,0.55) 40%, rgba(26,26,31,0.8) 100%),
    url('${IMAGES.hero}');
  background-size: cover; background-position: center;
}
.vp-hero-content { text-align: center; max-width: 800px; padding: 2rem; }
.vp-hero-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: 1px solid var(--gold-border);
  border-radius: 50px; color: var(--gold); font-size: 0.75rem;
  letter-spacing: 0.15em; text-transform: uppercase;
  margin-bottom: 2rem; animation: fadeInDown 0.8s ease-out;
}
.vp-hero-badge::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); animation: vpPulse 2s infinite;
}
@keyframes vpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
@keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
.vp-hero-greeting { font-family:'Outfit',sans-serif; font-size:1rem; color:rgba(255,255,255,.6); font-weight:300; margin-bottom:.25rem; animation:fadeInUp .8s ease-out .2s both; }
.vp-hero-name { font-family:'Cormorant Garamond',serif; font-size:1.8rem; color:var(--gold); font-weight:400; font-style:italic; margin-bottom:1.5rem; animation:fadeInUp .8s ease-out .3s both; }
.vp-hero-tagline {
  font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,5vw,4rem);
  font-weight:300; color:white; line-height:1.15; margin-bottom:1.25rem;
  animation: fadeInUp .8s ease-out .4s both;
}
.vp-hero-subtitle { font-size:.95rem; color:rgba(255,255,255,.6); line-height:1.7; max-width:600px; margin:0 auto 2.5rem; animation:fadeInUp .8s ease-out .5s both; }
.vp-hero-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; animation:fadeInUp .8s ease-out .6s both; }
.vp-btn-gold {
  padding:.85rem 2.25rem; background:var(--gold); color:var(--charcoal);
  border:none; border-radius:4px; font-family:'Outfit',sans-serif;
  font-size:.82rem; font-weight:500; letter-spacing:.08em; cursor:pointer;
  transition:all .3s; text-transform:uppercase;
}
.vp-btn-gold:hover { background:var(--gold-light); transform:translateY(-2px); box-shadow:0 8px 25px rgba(197,164,103,.35); }
.vp-btn-outline {
  padding:.85rem 2.25rem; background:none; color:white;
  border:1px solid rgba(255,255,255,.3); border-radius:4px;
  font-family:'Outfit',sans-serif; font-size:.82rem; font-weight:400;
  letter-spacing:.08em; cursor:pointer; transition:all .3s; text-transform:uppercase;
}
.vp-btn-outline:hover { border-color:var(--gold); color:var(--gold); }

/* ── Stats ── */
.vp-stats { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid rgba(255,255,255,.08); }
.vp-stat { text-align:center; padding:2.5rem 1rem; border-right:1px solid rgba(255,255,255,.08); }
.vp-stat:last-child { border-right:none; }
[dir="rtl"] .vp-stat { border-right:none; border-left:1px solid rgba(255,255,255,.08); }
[dir="rtl"] .vp-stat:last-child { border-left:none; }
.vp-stat-value { font-family:'Cormorant Garamond',serif; font-size:2.5rem; font-weight:300; color:white; }
.vp-stat-label { font-size:.7rem; color:var(--gold); text-transform:uppercase; letter-spacing:.15em; margin-top:.35rem; }

/* ── Sections ── */
.vp-section { padding:5rem 3rem; max-width:1200px; margin:0 auto; }
.vp-section-header { text-align:center; margin-bottom:3.5rem; }
.vp-section-label { font-size:.7rem; color:var(--gold); letter-spacing:.2em; text-transform:uppercase; display:block; margin-bottom:.75rem; }
.vp-section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,3.5vw,2.8rem); font-weight:400; color:var(--text); line-height:1.2; }
.vp-divider { display:flex; align-items:center; gap:1.5rem; padding:0 6rem; }
.vp-divider-line { flex:1; height:1px; background:linear-gradient(90deg,transparent,var(--gold-border),transparent); }
.vp-divider-diamond { color:var(--gold); font-size:.65rem; }

/* ── Reveal Animation ── */
.vp-reveal { opacity:0; transform:translateY(25px); transition:all .7s cubic-bezier(.4,0,.2,1); }
.vp-reveal.visible { opacity:1; transform:translateY(0); }

/* ── Units ── */
.vp-units { display:grid; gap:2.5rem; }
.vp-unit {
  display:grid; grid-template-columns:1fr 1fr; gap:0;
  background:white; border-radius:12px; overflow:hidden;
  box-shadow:0 2px 20px rgba(0,0,0,.04);
  transition:all .4s cubic-bezier(.4,0,.2,1);
}
.vp-unit:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(0,0,0,.08); }
.vp-unit:nth-child(even) { direction:rtl; }
.vp-unit:nth-child(even) .vp-unit-info { direction:ltr; }
[dir="rtl"] .vp-unit:nth-child(even) { direction:ltr; }
[dir="rtl"] .vp-unit:nth-child(even) .vp-unit-info { direction:rtl; }
.vp-unit-img { position:relative; min-height:400px; overflow:hidden; }
.vp-unit-img img { width:100%; height:100%; object-fit:cover; transition:transform .6s; }
.vp-unit:hover .vp-unit-img img { transform:scale(1.05); }
.vp-unit-img-badge {
  position:absolute; top:1.25rem; left:1.25rem;
  padding:.4rem .85rem; background:rgba(26,26,31,.75);
  backdrop-filter:blur(10px); border:1px solid var(--gold-border);
  border-radius:4px; color:var(--gold); font-size:.7rem;
  letter-spacing:.08em; text-transform:uppercase;
}
.vp-unit-info { padding:2.5rem; display:flex; flex-direction:column; justify-content:center; }
.vp-unit-name { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:500; margin-bottom:.25rem; }
.vp-unit-floor { font-size:.78rem; color:var(--text-muted); margin-bottom:.75rem; }
.vp-unit-desc { font-size:.88rem; color:var(--text-muted); line-height:1.7; margin-bottom:1.25rem; }
.vp-unit-details { display:grid; grid-template-columns:1fr 1fr; gap:.6rem; margin-bottom:1rem; }
.vp-unit-detail { padding:.5rem; border-radius:6px; background:var(--cream); }
.vp-unit-detail-label { display:block; font-size:.6rem; color:var(--text-light); text-transform:uppercase; letter-spacing:.08em; }
.vp-unit-detail-value { font-weight:500; font-size:.85rem; color:var(--text); }
.vp-unit-price {
  font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:600;
  color:var(--gold); margin-bottom:1.25rem;
}
/* Unit Action Buttons */
.vp-unit-actions { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; }
.vp-unit-btn {
  padding:.6rem .5rem; border:1px solid rgba(0,0,0,.08); border-radius:6px;
  background:white; font-family:'Outfit',sans-serif; font-size:.7rem;
  font-weight:400; color:var(--text); cursor:pointer; transition:all .25s;
  display:flex; align-items:center; justify-content:center; gap:.35rem;
  letter-spacing:.03em;
}
.vp-unit-btn:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-glow); }
.vp-unit-btn.primary {
  grid-column:1/-1; background:var(--charcoal); color:white; border-color:var(--charcoal);
  font-weight:500; letter-spacing:.06em; text-transform:uppercase; padding:.75rem;
}
.vp-unit-btn.primary:hover { background:var(--gold); color:var(--charcoal); border-color:var(--gold); }
.vp-unit-btn.compare-active { border-color:var(--gold); color:var(--gold); background:var(--gold-glow); }

/* ── Amenities ── */
.vp-amenities-section { position:relative; overflow:hidden; }
.vp-amenities-bg {
  position:absolute; inset:0; background-size:cover; background-position:center;
  opacity:.06;
}
.vp-amenities-grid {
  display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem;
  position:relative; z-index:2;
}
.vp-amenity {
  padding:2rem; border-radius:12px; background:white;
  border:1px solid rgba(0,0,0,.04); transition:all .3s;
}
.vp-amenity:hover { border-color:var(--gold-border); transform:translateY(-4px); box-shadow:0 8px 30px rgba(0,0,0,.06); }
.vp-amenity-icon { font-size:2rem; display:block; margin-bottom:.75rem; }
.vp-amenity-name { font-family:'Cormorant Garamond',serif; font-size:1.15rem; font-weight:600; margin-bottom:.35rem; }
.vp-amenity-desc { font-size:.8rem; color:var(--text-muted); line-height:1.6; }

/* ── Investment ── */
.vp-investment-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; }
.vp-invest-card {
  text-align:center; padding:2rem 1.25rem; border-radius:12px;
  border:1px solid rgba(0,0,0,.06); background:white; transition:all .3s;
}
.vp-invest-card:hover { border-color:var(--gold-border); transform:translateY(-4px); }
.vp-invest-value { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:600; color:var(--gold); }
.vp-invest-label { font-size:.78rem; font-weight:500; color:var(--text); margin-top:.25rem; }
.vp-invest-note { font-size:.68rem; color:var(--text-muted); margin-top:.35rem; }
.vp-invest-cta { text-align:center; margin-top:2rem; }

/* ── Contact / Booking ── */
.vp-contact-section { background:var(--charcoal); border-radius:24px; margin:3rem; max-width:unset; }
.vp-contact-section .vp-section-title { color:white; }
.vp-contact-section .vp-section-label { color:var(--gold); }
.vp-contact-inner {
  max-width:600px; margin:0 auto;
  display:grid; gap:1rem;
}
.vp-form-label { font-size:.7rem; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.1em; display:block; margin-bottom:.35rem; }
.vp-form-input {
  width:100%; padding:.75rem 1rem; background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.1); border-radius:6px;
  color:white; font-family:'Outfit',sans-serif; font-size:.85rem;
  transition:border-color .3s;
}
.vp-form-input:focus { outline:none; border-color:var(--gold); }
.vp-form-input option { background:var(--charcoal); color:white; }
.vp-form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.vp-form-submit {
  width:100%; margin-top:.5rem; padding:1rem; font-size:.85rem; border:none;
  cursor:pointer; font-family:'Outfit',sans-serif;
}
.vp-form-note { text-align:center; font-size:.7rem; color:rgba(255,255,255,.35); margin-top:.75rem; }
.vp-form-error { color:var(--red); font-size:.65rem; margin-top:.2rem; }

/* Booking Success */
.vp-booking-success {
  text-align:center; padding:3rem 2rem;
}
.vp-booking-success-icon { font-size:3.5rem; margin-bottom:1rem; }
.vp-booking-success h3 { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:white; margin-bottom:.5rem; }
.vp-booking-success p { font-size:.85rem; color:rgba(255,255,255,.6); line-height:1.6; margin-bottom:1.25rem; }
.vp-booking-success .ref { font-size:.75rem; color:var(--gold); letter-spacing:.08em; }

/* ── Footer ── */
.vp-footer { text-align:center; padding:3rem; font-size:.75rem; color:var(--text-light); }

/* ═══════════════ MODAL SYSTEM ═══════════════ */
.vp-modal-overlay {
  position:fixed; inset:0; z-index:1000;
  background:rgba(26,26,31,.75); backdrop-filter:blur(8px);
  display:flex; align-items:center; justify-content:center;
  animation:vpFadeIn .25s ease-out; padding:1.5rem;
}
@keyframes vpFadeIn { from{opacity:0} to{opacity:1} }
.vp-modal {
  background:white; border-radius:16px; max-width:780px; width:100%;
  max-height:90vh; overflow-y:auto; position:relative;
  box-shadow:0 25px 60px rgba(0,0,0,.25);
  animation:vpSlideUp .35s cubic-bezier(.4,0,.2,1);
}
@keyframes vpSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
.vp-modal-close {
  position:sticky; top:1rem; float:right; margin-right:1rem;
  width:32px; height:32px; border-radius:50%; border:1px solid rgba(0,0,0,.08);
  background:white; font-size:.85rem; cursor:pointer; z-index:10;
  display:flex; align-items:center; justify-content:center; transition:all .2s;
}
[dir="rtl"] .vp-modal-close { float:left; margin-right:0; margin-left:1rem; }
.vp-modal-close:hover { background:var(--charcoal); color:white; border-color:var(--charcoal); }
.vp-modal-header { padding:2rem 2rem .75rem; }
.vp-modal-header h3 { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:500; }
.vp-modal-header p { font-size:.82rem; color:var(--text-muted); margin-top:.25rem; }
.vp-modal-body { padding:0 2rem 2rem; }

/* ── Floor Plan Modal ── */
.vp-fp-container { position:relative; width:100%; aspect-ratio:4/3; background:var(--cream); border-radius:12px; border:1px solid rgba(0,0,0,.06); margin-bottom:1.25rem; overflow:hidden; }
.vp-fp-room {
  position:absolute; border-radius:4px; display:flex; align-items:center; justify-content:center;
  flex-direction:column; font-size:.6rem; color:rgba(0,0,0,.65); font-weight:500;
  border:1.5px solid rgba(0,0,0,.12); transition:all .25s; cursor:default;
  white-space:pre-line; text-align:center; line-height:1.3; padding:.25rem;
}
.vp-fp-room:hover { transform:scale(1.02); box-shadow:0 4px 15px rgba(0,0,0,.1); z-index:5; }
.vp-fp-specs { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; margin-bottom:1.25rem; }
.vp-fp-spec { padding:.65rem; background:var(--cream); border-radius:8px; text-align:center; }
.vp-fp-spec-label { font-size:.58rem; color:var(--text-light); text-transform:uppercase; letter-spacing:.08em; }
.vp-fp-spec-value { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:var(--text); }
.vp-fp-disclaimer { font-size:.65rem; color:var(--text-light); font-style:italic; text-align:center; margin-top:.5rem; }

/* ── Payment Plan Modal ── */
.vp-pay-tabs { display:flex; gap:.5rem; margin-bottom:1.5rem; }
.vp-pay-tab {
  flex:1; padding:.75rem; border:1.5px solid rgba(0,0,0,.08); border-radius:8px;
  background:white; cursor:pointer; text-align:center; transition:all .25s;
  font-family:'Outfit',sans-serif;
}
.vp-pay-tab.active { border-color:var(--gold); background:var(--gold-glow); }
.vp-pay-tab-label { font-size:.75rem; font-weight:600; color:var(--text); }
.vp-pay-tab-desc { font-size:.62rem; color:var(--text-muted); margin-top:.15rem; }
.vp-pay-total { text-align:center; padding:1.25rem; background:var(--cream); border-radius:10px; margin-bottom:1.5rem; }
.vp-pay-total-label { font-size:.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.1em; }
.vp-pay-total-value { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:600; color:var(--gold); }
.vp-pay-milestones { display:grid; gap:.5rem; }
.vp-pay-milestone {
  display:grid; grid-template-columns:auto 1fr auto; gap:.75rem; align-items:center;
  padding:.75rem 1rem; background:var(--cream); border-radius:8px;
}
.vp-pay-dot { width:10px; height:10px; border-radius:50%; }
.vp-pay-ms-label { font-size:.82rem; font-weight:500; }
.vp-pay-ms-desc { font-size:.65rem; color:var(--text-muted); }
.vp-pay-ms-amount { font-weight:600; font-size:.88rem; color:var(--text); text-align:right; }
.vp-pay-ms-pct { font-size:.6rem; color:var(--text-muted); text-align:right; }
.vp-pay-bar { height:8px; background:var(--cream); border-radius:4px; margin:1.25rem 0; overflow:hidden; display:flex; }
.vp-pay-bar-seg { height:100%; transition:width .4s; }
.vp-pay-disclaimer { font-size:.65rem; color:var(--text-light); font-style:italic; text-align:center; margin-top:1rem; }

/* ── Brochure Modal ── */
.vp-brochure-preview { display:flex; gap:1.25rem; margin-bottom:1.5rem; align-items:flex-start; }
.vp-brochure-cover {
  width:140px; min-height:190px; flex-shrink:0;
  background:linear-gradient(145deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
  border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center;
  color:var(--gold); padding:1rem; text-align:center;
}
.vp-brochure-cover-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:500; margin-top:.5rem; }
.vp-brochure-cover-sub { font-size:.55rem; color:rgba(255,255,255,.4); margin-top:.25rem; letter-spacing:.1em; text-transform:uppercase; }
.vp-brochure-info h4 { font-family:'Cormorant Garamond',serif; font-size:1.15rem; margin-bottom:.35rem; }
.vp-brochure-info p { font-size:.82rem; color:var(--text-muted); line-height:1.6; margin-bottom:.75rem; }
.vp-brochure-includes { font-size:.72rem; color:var(--text-muted); line-height:1.8; }
.vp-brochure-includes span { display:block; }
.vp-brochure-includes span::before { content:'✓ '; color:var(--green); font-weight:600; }
.vp-brochure-btns { display:flex; gap:.75rem; }
.vp-brochure-btn {
  flex:1; padding:.75rem; border-radius:8px; font-family:'Outfit',sans-serif;
  font-size:.78rem; font-weight:500; cursor:pointer; transition:all .25s; text-align:center;
}
.vp-brochure-btn.primary { background:var(--charcoal); color:white; border:none; }
.vp-brochure-btn.primary:hover { background:var(--gold); color:var(--charcoal); }
.vp-brochure-btn.secondary { background:white; color:var(--text); border:1px solid rgba(0,0,0,.1); }
.vp-brochure-btn.secondary:hover { border-color:var(--gold); }

/* ── Compare Modal ── */
.vp-compare-grid {
  display:grid; gap:.5rem;
}
.vp-compare-row {
  display:grid; align-items:center; gap:0; font-size:.78rem;
  border-bottom:1px solid rgba(0,0,0,.04); padding:.5rem 0;
}
.vp-compare-row.header { font-weight:600; color:var(--text-light); font-size:.65rem; text-transform:uppercase; letter-spacing:.08em; }
.vp-compare-label { font-weight:500; color:var(--text-muted); font-size:.72rem; }
.vp-compare-val { text-align:center; }
.vp-compare-empty { text-align:center; padding:3rem; color:var(--text-muted); font-size:.88rem; }

/* ── Toast ── */
.vp-toast {
  position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
  padding:.75rem 1.5rem; background:var(--charcoal); color:white;
  border-radius:8px; font-size:.78rem; z-index:2000;
  display:flex; align-items:center; gap:.5rem;
  box-shadow:0 8px 30px rgba(0,0,0,.25);
  animation:vpToastIn .3s ease-out;
}
.vp-toast.hide { animation:vpToastOut .3s ease-in forwards; }
@keyframes vpToastIn { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes vpToastOut { from{opacity:1;transform:translateX(-50%) translateY(0)} to{opacity:0;transform:translateX(-50%) translateY(20px)} }
.vp-toast-icon { font-size:1rem; }
.vp-toast-gold { color:var(--gold); }

/* ── Responsive ── */
@media (max-width:900px) {
  .vp-unit { grid-template-columns:1fr; }
  .vp-unit:nth-child(even) { direction:ltr; }
  [dir="rtl"] .vp-unit:nth-child(even) { direction:rtl; }
  .vp-unit-img { min-height:260px; }
  .vp-amenities-grid { grid-template-columns:1fr 1fr; }
  .vp-investment-grid { grid-template-columns:1fr 1fr; }
  .vp-section { padding:3rem 1.5rem; }
  .vp-header { padding:1rem 1.5rem; }
  .vp-header.scrolled { padding:.75rem 1.5rem; }
  .vp-divider { padding:0 2rem; }
  .vp-contact-section { margin:2rem 1rem; }
  .vp-brochure-preview { flex-direction:column; align-items:center; text-align:center; }
  .vp-form-row { grid-template-columns:1fr; }
}
@media (max-width:480px) {
  .vp-stats { grid-template-columns:1fr 1fr; }
  .vp-investment-grid { grid-template-columns:1fr; }
  .vp-unit-details { grid-template-columns:1fr; }
  .vp-unit-actions { grid-template-columns:1fr; }
  .vp-amenities-grid { grid-template-columns:1fr; }
  .vp-fp-specs { grid-template-columns:1fr 1fr; }
  .vp-pay-tabs { flex-direction:column; }
}
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function VIPPortal() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null); // "floorplan" | "brochure" | "payment" | "compare"
  const [modalUnit, setModalUnit] = useState(null);
  const [payPlan, setPayPlan] = useState("60/40");
  const [compareList, setCompareList] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [formData, setFormData] = useState({ name:"", email:"", phone:"", unit:"", date:"", time:"", notes:"" });
  const [formErrors, setFormErrors] = useState({});

  const residencesRef = useRef(null);
  const bookingRef2 = useRef(null);
  const t = LANG[lang];

  // ── Scroll tracking ──
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".vp-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang, modal]);

  // ── Track portal open ──
  useEffect(() => { trackEvent("portal_opened"); }, []);

  const vipName = lang === "en" ? "Khalid Al-Rashid" : "خالد الراشد";
  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  // ── Toast ──
  const showToast = useCallback((msg, icon = "✓") => {
    setToastHiding(false);
    setToast({ msg, icon });
    setTimeout(() => setToastHiding(true), 2500);
    setTimeout(() => { setToast(null); setToastHiding(false); }, 2800);
  }, []);

  // ── Compare ──
  const toggleCompare = (unitId) => {
    setCompareList(prev => {
      if (prev.includes(unitId)) {
        showToast(t.toast.compareRemove, "↩");
        return prev.filter(id => id !== unitId);
      }
      if (prev.length >= 3) return prev;
      const unit = UNITS.find(u => u.id === unitId);
      trackEvent("comparison_view", { unitId, unitName: unit?.name[lang] });
      showToast(t.toast.compare, "⚖️");
      return [...prev, unitId];
    });
  };

  // ── Modal openers ──
  const openFloorPlan = (unit) => {
    setModalUnit(unit); setModal("floorplan");
    trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.name[lang] });
    showToast(t.toast.floorPlan, "📐");
  };
  const openBrochure = (unit) => {
    setModalUnit(unit); setModal("brochure");
    trackEvent("download_brochure", { unitId: unit.id, unitName: unit.name[lang] });
    showToast(t.toast.brochure, "📄");
  };
  const openPayment = (unit) => {
    setModalUnit(unit); setModal("payment"); setPayPlan("60/40");
    trackEvent("explore_payment_plan", { unitId: unit.id, unitName: unit.name[lang] });
  };
  const openCompare = () => { setModal("compare"); };
  const requestPricing = (unit) => {
    trackEvent("request_pricing", { unitId: unit.id, unitName: unit.name[lang] });
    showToast(t.toast.pricing, "💰");
    // Scroll to booking
    setTimeout(() => bookingRef2.current?.scrollIntoView({ behavior: "smooth" }), 500);
  };

  // ── Booking form ──
  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = true;
    if (!formData.email.trim() || !formData.email.includes("@")) err.email = true;
    if (!formData.phone.trim()) err.phone = true;
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };
  const submitBooking = () => {
    if (!validateForm()) return;
    const ref = "VIP-" + Date.now().toString(36).toUpperCase().slice(-6);
    trackEvent("book_viewing", { unitId: formData.unit || UNITS[0].id, unitName: formData.unit ? UNITS.find(u=>u.id===formData.unit)?.name[lang] : UNITS[0].name[lang] });
    setBookingRef(ref);
    setBookingSubmitted(true);
    showToast(t.toast.booking, "📅");
  };

  // ── Scroll to sections ──
  const scrollToResidences = () => {
    trackEvent("view_unit", { unitId: UNITS[0].id, unitName: UNITS[0].name[lang] });
    residencesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToBooking = () => {
    bookingRef2.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Payment helpers ──
  const fmtAED = (n) => "AED " + n.toLocaleString();
  const getMilestones = (price, plan) => {
    if (plan === "60/40") return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#C5A467" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#D4B97A" },
      { pct: 15, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#8AADBD" },
      { pct: 25, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#457B9D" },
      { pct: 40, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#2D8F6F" },
    ];
    return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#C5A467" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#D4B97A" },
      { pct: 20, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#8AADBD" },
      { pct: 30, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#457B9D" },
      { pct: 10, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#2D8F6F" },
      { pct: 20, label: t.paymentModal.m6, desc: t.paymentModal.m6d, color: "#6B8E7B" },
    ];
  };

  return (
    <div className="vp-luxury" dir={t.dir}>
      {/* ── Header ── */}
      <header className={`vp-header ${scrolled ? "scrolled" : ""}`}>
        <div className="vp-logo">Vista <span>Residences</span></div>
        <div className="vp-nav">
          <div className="vp-nav-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="vp-compare-btn" onClick={openCompare}>
              {t.nav.compare} <span className="vp-compare-count">{compareList.length}</span>
            </button>
          )}
          <button className="vp-lang-btn" onClick={toggleLang}>{t.nav.lang}</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="vp-hero">
        <div className="vp-hero-content">
          <div className="vp-hero-badge">{t.hero.badge}</div>
          <p className="vp-hero-greeting">{t.hero.greeting}</p>
          <p className="vp-hero-name">{vipName}</p>
          <h1 className="vp-hero-tagline">{t.hero.tagline}</h1>
          <p className="vp-hero-subtitle">{t.hero.subtitle}</p>
          <div className="vp-hero-btns">
            <button className="vp-btn-gold" onClick={scrollToResidences}>{t.hero.cta} →</button>
            <button className="vp-btn-outline" onClick={scrollToBooking}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="vp-stats" style={{ background: "var(--charcoal)" }}>
        <div className="vp-stat"><div className="vp-stat-value">142</div><div className="vp-stat-label">{t.stats.units}</div></div>
        <div className="vp-stat"><div className="vp-stat-value">44</div><div className="vp-stat-label">{t.stats.floors}</div></div>
        <div className="vp-stat"><div className="vp-stat-value">8.2%</div><div className="vp-stat-label">{t.stats.roi}</div></div>
        <div className="vp-stat"><div className="vp-stat-value">Q4 '27</div><div className="vp-stat-label">{t.stats.completion}</div></div>
      </div>

      {/* ══ RESIDENCES ══ */}
      <section className="vp-section" ref={residencesRef}>
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.residences}</span>
          <h2 className="vp-section-title">{t.sections.residencesSub}</h2>
        </div>
        <div className="vp-units">
          {UNITS.map((unit, i) => (
            <div className="vp-unit vp-reveal" key={unit.id}>
              <div className="vp-unit-img">
                <img src={unitImages[i]} alt={unit.name[lang]} loading="lazy" />
                <div className="vp-unit-img-badge">{unit.feature[lang]}</div>
              </div>
              <div className="vp-unit-info">
                <h3 className="vp-unit-name">{unit.name[lang]}</h3>
                <p className="vp-unit-floor">{unit.floor[lang]}</p>
                <p className="vp-unit-desc">{unit.desc[lang]}</p>
                <div className="vp-unit-details">
                  <div className="vp-unit-detail">
                    <span className="vp-unit-detail-label">{lang === "en" ? "Bedrooms" : "غرف النوم"}</span>
                    <span className="vp-unit-detail-value">{unit.bed[lang]}</span>
                  </div>
                  <div className="vp-unit-detail">
                    <span className="vp-unit-detail-label">{lang === "en" ? "Living Area" : "المساحة"}</span>
                    <span className="vp-unit-detail-value">{unit.size} sq ft</span>
                  </div>
                </div>
                <div className="vp-unit-price">{unit.price[lang]}</div>
                {/* ★ ACTION BUTTONS — zero dead ends */}
                <div className="vp-unit-actions">
                  <button className="vp-unit-btn" onClick={() => openFloorPlan(unit)}>📐 {t.unitActions.floorPlan}</button>
                  <button className="vp-unit-btn" onClick={() => openBrochure(unit)}>📄 {t.unitActions.brochure}</button>
                  <button className="vp-unit-btn" onClick={() => openPayment(unit)}>💰 {t.unitActions.pricing}</button>
                  <button className={`vp-unit-btn ${compareList.includes(unit.id) ? "compare-active" : ""}`} onClick={() => toggleCompare(unit.id)}>⚖️ {t.unitActions.compare}</button>
                  <button className="vp-unit-btn primary" onClick={() => requestPricing(unit)}>📅 {t.unitActions.book}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="vp-divider"><div className="vp-divider-line" /><div className="vp-divider-diamond">◆</div><div className="vp-divider-line" /></div>

      {/* ══ AMENITIES ══ */}
      <section className="vp-section vp-amenities-section">
        <div className="vp-amenities-bg" style={{ backgroundImage: `url(${IMAGES.pool})` }} />
        <div className="vp-section-header vp-reveal" style={{ position:"relative", zIndex:2 }}>
          <span className="vp-section-label">◆ {t.sections.amenities}</span>
          <h2 className="vp-section-title">{t.sections.amenitiesSub}</h2>
        </div>
        <div className="vp-amenities-grid">
          {AMENITIES[lang].map((a, i) => (
            <div className="vp-amenity vp-reveal" key={i}>
              <span className="vp-amenity-icon">{a.icon}</span>
              <h4 className="vp-amenity-name">{a.name}</h4>
              <p className="vp-amenity-desc">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="vp-divider"><div className="vp-divider-line" /><div className="vp-divider-diamond">◆</div><div className="vp-divider-line" /></div>

      {/* ══ INVESTMENT ══ */}
      <section className="vp-section">
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.investment}</span>
          <h2 className="vp-section-title">{t.sections.investmentSub}</h2>
        </div>
        <div className="vp-investment-grid">
          {INVEST[lang].map((item, i) => (
            <div className="vp-invest-card vp-reveal" key={i} style={{ cursor: i === 2 ? "pointer" : "default" }} onClick={() => i === 2 && openPayment(UNITS[0])}>
              <div className="vp-invest-value">{item.value}</div>
              <div className="vp-invest-label">{item.label}</div>
              <div className="vp-invest-note">{item.note}</div>
              {i === 2 && <div style={{ fontSize:".6rem", color:"var(--gold)", marginTop:".5rem", fontWeight:500 }}>{lang === "en" ? "View payment plans →" : "عرض خطط الدفع →"}</div>}
            </div>
          ))}
        </div>
        <div className="vp-invest-cta vp-reveal">
          <button className="vp-btn-gold" onClick={scrollToBooking} style={{ marginTop:"2rem" }}>
            {lang === "en" ? "Discuss Investment →" : "مناقشة الاستثمار →"}
          </button>
        </div>
      </section>

      {/* ══ BOOKING FORM ══ */}
      <section className="vp-section vp-contact-section" ref={bookingRef2}>
        <div className="vp-section-header vp-reveal">
          <span className="vp-section-label">◆ {t.sections.contact}</span>
          <h2 className="vp-section-title">{t.sections.contactSub}</h2>
        </div>
        {bookingSubmitted ? (
          <div className="vp-booking-success vp-reveal visible">
            <div className="vp-booking-success-icon">✓</div>
            <h3>{t.booking.success}</h3>
            <p>{t.booking.successDesc}</p>
            <div className="ref">{t.booking.successRef}: {bookingRef}</div>
          </div>
        ) : (
          <div className="vp-contact-inner vp-reveal">
            <div className="vp-form-row">
              <div>
                <label className="vp-form-label">{t.booking.name}</label>
                <input className="vp-form-input" style={formErrors.name?{borderColor:"var(--red)"}:{}} value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} />
              </div>
              <div>
                <label className="vp-form-label">{t.booking.email}</label>
                <input className="vp-form-input" type="email" style={formErrors.email?{borderColor:"var(--red)"}:{}} value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} />
              </div>
            </div>
            <div className="vp-form-row">
              <div>
                <label className="vp-form-label">{t.booking.phone}</label>
                <input className="vp-form-input" style={formErrors.phone?{borderColor:"var(--red)"}:{}} value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} />
              </div>
              <div>
                <label className="vp-form-label">{t.booking.preferred}</label>
                <select className="vp-form-input" value={formData.unit} onChange={e => setFormData({...formData, unit:e.target.value})}>
                  <option value="">—</option>
                  {UNITS.map(u => <option key={u.id} value={u.id}>{u.name[lang]}</option>)}
                </select>
              </div>
            </div>
            <div className="vp-form-row">
              <div>
                <label className="vp-form-label">{t.booking.date}</label>
                <input className="vp-form-input" type="date" value={formData.date} onChange={e => setFormData({...formData, date:e.target.value})} />
              </div>
              <div>
                <label className="vp-form-label">{t.booking.time}</label>
                <select className="vp-form-input" value={formData.time} onChange={e => setFormData({...formData, time:e.target.value})}>
                  <option value="">—</option>
                  <option value="morning">{t.booking.morning}</option>
                  <option value="afternoon">{t.booking.afternoon}</option>
                  <option value="evening">{t.booking.evening}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="vp-form-label">{t.booking.notes}</label>
              <input className="vp-form-input" value={formData.notes} onChange={e => setFormData({...formData, notes:e.target.value})} />
            </div>
            <button className="vp-btn-gold vp-form-submit" onClick={submitBooking}>{t.booking.submit} →</button>
            <p className="vp-form-note">{t.booking.note}</p>
          </div>
        )}
      </section>

      <footer className="vp-footer">{t.footer}</footer>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* ── Floor Plan Modal ── */}
      {modal === "floorplan" && modalUnit && (
        <div className="vp-modal-overlay" onClick={() => setModal(null)}>
          <div className="vp-modal" onClick={e => e.stopPropagation()}>
            <button className="vp-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="vp-modal-header">
              <h3>{t.floorPlanModal.title} — {modalUnit.name[lang]}</h3>
              <p>{modalUnit.floor[lang]} · {modalUnit.bed[lang]} · {modalUnit.size} sq ft</p>
            </div>
            <div className="vp-modal-body">
              <div className="vp-fp-container">
                {modalUnit.floorPlan.rooms.map((room, i) => (
                  <div key={i} className="vp-fp-room" style={{
                    left: room.x + "%", top: room.y + "%",
                    width: room.w + "%", height: room.h + "%",
                    background: (ROOM_COLORS[room.key] || "#ddd") + "25",
                    borderColor: (ROOM_COLORS[room.key] || "#ddd") + "60",
                  }}>
                    {room.label[lang]}
                  </div>
                ))}
              </div>
              <div className="vp-fp-specs">
                <div className="vp-fp-spec"><div className="vp-fp-spec-label">{t.floorPlanModal.bathroom}</div><div className="vp-fp-spec-value">{modalUnit.floorPlan.specs.bathrooms}</div></div>
                <div className="vp-fp-spec"><div className="vp-fp-spec-label">{t.floorPlanModal.balcony}</div><div className="vp-fp-spec-value">{modalUnit.floorPlan.specs.balconySize}</div></div>
                <div className="vp-fp-spec"><div className="vp-fp-spec-label">{t.floorPlanModal.totalArea}</div><div className="vp-fp-spec-value">{modalUnit.floorPlan.specs.totalArea}</div></div>
              </div>
              <button className="vp-btn-gold" style={{ width:"100%", textAlign:"center" }} onClick={() => {
                trackEvent("download_floorplan", { unitId: modalUnit.id, unitName: modalUnit.name[lang] });
                showToast(lang === "en" ? "Floor plan PDF downloaded" : "تم تحميل المخطط PDF", "📥");
              }}>{t.floorPlanModal.download}</button>
              <p className="vp-fp-disclaimer">{t.floorPlanModal.disclaimer}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Brochure Modal ── */}
      {modal === "brochure" && modalUnit && (
        <div className="vp-modal-overlay" onClick={() => setModal(null)}>
          <div className="vp-modal" onClick={e => e.stopPropagation()}>
            <button className="vp-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="vp-modal-header">
              <h3>{t.brochureModal.title} — {modalUnit.name[lang]}</h3>
            </div>
            <div className="vp-modal-body">
              <div className="vp-brochure-preview">
                <div className="vp-brochure-cover">
                  <div style={{ fontSize:"1.8rem" }}>◆</div>
                  <div className="vp-brochure-cover-title">Vista Residences</div>
                  <div className="vp-brochure-cover-sub">{modalUnit.name[lang]}</div>
                </div>
                <div className="vp-brochure-info">
                  <h4>{t.brochureModal.ready}</h4>
                  <p>{t.brochureModal.desc}</p>
                  <div className="vp-brochure-includes">
                    <strong>{t.brochureModal.includes}</strong>
                    {t.brochureModal.items.map((item, i) => <span key={i}>{item}</span>)}
                  </div>
                </div>
              </div>
              <div className="vp-brochure-btns">
                <button className="vp-brochure-btn primary" onClick={() => {
                  trackEvent("download_brochure_pdf", { unitId: modalUnit.id, unitName: modalUnit.name[lang] });
                  showToast(lang === "en" ? "Brochure PDF downloaded" : "تم تحميل الكتيب PDF", "📥");
                }}>📥 {t.brochureModal.download}</button>
                <button className="vp-brochure-btn secondary" onClick={() => {
                  trackEvent("email_brochure", { unitId: modalUnit.id, unitName: modalUnit.name[lang] });
                  showToast(t.toast.emailSent, "📧");
                }}>📧 {t.brochureModal.email}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Plan Modal ── */}
      {modal === "payment" && modalUnit && (() => {
        const ms = getMilestones(modalUnit.payment.base, payPlan);
        return (
          <div className="vp-modal-overlay" onClick={() => setModal(null)}>
            <div className="vp-modal" onClick={e => e.stopPropagation()}>
              <button className="vp-modal-close" onClick={() => setModal(null)}>✕</button>
              <div className="vp-modal-header">
                <h3>{t.paymentModal.title} — {modalUnit.name[lang]}</h3>
                <p>{t.paymentModal.subtitle}</p>
              </div>
              <div className="vp-modal-body">
                <div className="vp-pay-total">
                  <div className="vp-pay-total-label">{t.paymentModal.totalPrice}</div>
                  <div className="vp-pay-total-value">{fmtAED(modalUnit.payment.base)}</div>
                </div>
                <div className="vp-pay-tabs">
                  <div className={`vp-pay-tab ${payPlan === "60/40" ? "active" : ""}`} onClick={() => setPayPlan("60/40")}>
                    <div className="vp-pay-tab-label">{t.paymentModal.plan6040}</div>
                    <div className="vp-pay-tab-desc">{t.paymentModal.plan6040Desc}</div>
                  </div>
                  <div className={`vp-pay-tab ${payPlan === "70/30" ? "active" : ""}`} onClick={() => setPayPlan("70/30")}>
                    <div className="vp-pay-tab-label">{t.paymentModal.plan7030}</div>
                    <div className="vp-pay-tab-desc">{t.paymentModal.plan7030Desc}</div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="vp-pay-bar">
                  {ms.map((m, i) => <div key={i} className="vp-pay-bar-seg" style={{ width: m.pct + "%", background: m.color }} />)}
                </div>
                {/* Milestones */}
                <div className="vp-pay-milestones">
                  {ms.map((m, i) => (
                    <div className="vp-pay-milestone" key={i}>
                      <div className="vp-pay-dot" style={{ background: m.color }} />
                      <div>
                        <div className="vp-pay-ms-label">{m.label}</div>
                        <div className="vp-pay-ms-desc">{m.desc}</div>
                      </div>
                      <div>
                        <div className="vp-pay-ms-amount">{fmtAED(Math.round(modalUnit.payment.base * m.pct / 100))}</div>
                        <div className="vp-pay-ms-pct">{m.pct}%</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="vp-btn-gold" style={{ width:"100%", textAlign:"center", marginTop:"1.25rem" }} onClick={() => {
                  trackEvent("request_payment_consultation", { unitId: modalUnit.id, unitName: modalUnit.name[lang], plan: payPlan });
                  showToast(t.toast.pricing, "💰");
                  setModal(null);
                  setTimeout(() => bookingRef2.current?.scrollIntoView({ behavior:"smooth" }), 300);
                }}>{t.paymentModal.requestCall}</button>
                <p className="vp-pay-disclaimer">{t.paymentModal.disclaimer}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Compare Modal ── */}
      {modal === "compare" && (
        <div className="vp-modal-overlay" onClick={() => setModal(null)}>
          <div className="vp-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 900 }}>
            <button className="vp-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="vp-modal-header">
              <h3>{t.compareModal.title}</h3>
            </div>
            <div className="vp-modal-body">
              {compareList.length === 0 ? (
                <div className="vp-compare-empty">{t.compareModal.empty}</div>
              ) : (() => {
                const units = compareList.map(id => UNITS.find(u => u.id === id)).filter(Boolean);
                const cols = units.length + 1;
                const rows = [
                  { key: "price", label: t.compareModal.price, fn: u => u.price[lang] },
                  { key: "floor", label: t.compareModal.floor, fn: u => u.floor[lang] },
                  { key: "bed", label: t.compareModal.bedrooms, fn: u => u.bed[lang] },
                  { key: "size", label: t.compareModal.size, fn: u => u.size + " sq ft" },
                  { key: "view", label: t.compareModal.view, fn: u => u.view[lang] },
                  { key: "cat", label: t.compareModal.category, fn: u => u.category[lang] },
                ];
                return (
                  <div className="vp-compare-grid">
                    {/* Header */}
                    <div className="vp-compare-row header" style={{ gridTemplateColumns: `120px repeat(${units.length}, 1fr)` }}>
                      <div>{t.compareModal.feature}</div>
                      {units.map(u => (
                        <div key={u.id} style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", fontWeight:500, color:"var(--text)", textTransform:"none", letterSpacing:0 }}>{u.name[lang]}</div>
                          <button style={{ fontSize:".55rem", color:"var(--red)", background:"none", border:"none", cursor:"pointer", marginTop:".25rem" }} onClick={() => toggleCompare(u.id)}>{t.compareModal.remove} ✕</button>
                        </div>
                      ))}
                    </div>
                    {rows.map(row => (
                      <div className="vp-compare-row" key={row.key} style={{ gridTemplateColumns: `120px repeat(${units.length}, 1fr)` }}>
                        <div className="vp-compare-label">{row.label}</div>
                        {units.map(u => <div key={u.id} className="vp-compare-val">{row.fn(u)}</div>)}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`vp-toast ${toastHiding ? "hide" : ""}`}>
          <span className="vp-toast-icon vp-toast-gold">{toast.icon}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// VIP PORTAL — DEFINITIVE EDITION
// ═══════════════════════════════════════════════════════════════════
// Merges: Luxury's editorial design + Full's rich data + v2.0's features
// Design: Gulf Luxury dark (DAMAC/Omniyat/Emaar)
// Features: Unit Detail Modal, Floor Plans, Brochures, Payment Plans,
//           Comparison, CRM Tracking, Booking with Validation, Toasts
// Zero Dead Ends — every button does something meaningful
// ═══════════════════════════════════════════════════════════════════

// ─── TRACKING ENGINE (in-memory + BroadcastChannel) ──────────────
const _events = [];
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;

const trackEvent = (event, data = {}) => {
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    portalType: "vip",
    vipId: "KR-001",
    vipName: "Khalid Al-Rashid",
    event,
    ...data,
  };
  _events.push(ev);
  _bc?.postMessage(ev);
  console.log(`[DNFC] ${event}`, data);
  return ev;
};

// ─── BILINGUAL CONTENT ───────────────────────────────────────────
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
      residences: "The Residences",
      residencesSub: "Where Vision Meets the Skyline",
      residencesHint: "Select any residence to explore full details",
      amenities: "The Lifestyle",
      amenitiesSub: "Curated Experiences Beyond the Ordinary",
      investment: "The Opportunity",
      investmentSub: "Strategic Value in Every Detail",
      contact: "Private Consultation",
      contactSub: "Schedule Your Private Viewing",
      contactHint: "Your dedicated advisor will arrange an exclusive tour",
    },
    unitActions: {
      viewDetails: "View Details",
      floorPlan: "Floor Plan",
      brochure: "Brochure",
      pricing: "Request Pricing",
      book: "Book Viewing",
      compare: "Compare",
      payment: "Payment Plan",
      callAdvisor: "Call Advisor",
    },
    floorPlanModal: {
      title: "Floor Plan",
      bedrooms: "Bedrooms",
      living: "Living Area",
      balcony: "Balcony / Terrace",
      kitchen: "Kitchen",
      master: "Master Suite",
      bathrooms: "Bathrooms",
      totalArea: "Total Area",
      download: "Download Floor Plan PDF",
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
      feature: "Feature",
      remove: "Remove",
      price: "Price", floor: "Floor", bedrooms: "Bedrooms",
      size: "Size", view: "View", category: "Category",
      empty: "Add residences to compare by clicking the ⚖️ icon on unit cards.",
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
      floorPlan: "Floor plan opened",
      brochure: "Brochure downloaded",
      pricing: "Pricing request sent — check your email",
      booking: "Private viewing request submitted",
      compare: "Added to comparison",
      compareRemove: "Removed from comparison",
      emailSent: "Brochure sent to your email",
      advisorNotified: "Your dedicated advisor has been notified",
    },
    footer: "This is a private portal. Content is personalized for your exclusive access.",
    poweredBy: "Powered by",
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
      residences: "المساكن",
      residencesSub: "حيث تلتقي الرؤية بالأفق",
      residencesHint: "اختر أي مسكن لاستكشاف التفاصيل الكاملة",
      amenities: "أسلوب الحياة",
      amenitiesSub: "تجارب مُنتقاة تتجاوز المألوف",
      investment: "الفرصة الاستثمارية",
      investmentSub: "قيمة استراتيجية في كل تفصيل",
      contact: "استشارة خاصة",
      contactSub: "احجز معاينتك الخاصة",
      contactHint: "مستشارك المخصص سيرتب جولة حصرية",
    },
    unitActions: {
      viewDetails: "عرض التفاصيل",
      floorPlan: "المخطط",
      brochure: "الكتيب",
      pricing: "طلب التسعير",
      book: "حجز معاينة",
      compare: "مقارنة",
      payment: "خطة الدفع",
      callAdvisor: "اتصل بالمستشار",
    },
    floorPlanModal: {
      title: "المخطط الطابقي",
      bedrooms: "غرف النوم", living: "منطقة المعيشة", balcony: "الشرفة / التراس",
      kitchen: "المطبخ", master: "الجناح الرئيسي", bathrooms: "الحمامات",
      totalArea: "المساحة الإجمالية", download: "تحميل المخطط PDF",
      disclaimer: "المخططات استرشادية وقد تختلف. الأبعاد الفعلية تُؤكد عند التسليم.",
    },
    brochureModal: {
      title: "الكتيب الرقمي",
      downloading: "جاري تحضير الكتيب...",
      ready: "الكتيب جاهز",
      desc: "تم إعداد كتيبك الرقمي المخصص مع تفاصيل حصرية.",
      download: "تحميل الكتيب PDF", email: "إرسال للبريد الإلكتروني",
      includes: "يتضمن الكتيب:",
      items: ["مخططات تفصيلية ومواصفات", "كتالوج التشطيبات الفاخرة", "نظرة على المرافق ونمط الحياة", "تحليل استثماري وخطط الدفع", "خريطة الموقع والاتصال"],
    },
    paymentModal: {
      title: "خطة الدفع",
      subtitle: "هيكل دفع مرن مصمم للمستثمرين",
      totalPrice: "السعر الإجمالي",
      plan6040: "خطة ٦٠/٤٠", plan6040Desc: "٦٠٪ خلال البناء · ٤٠٪ عند التسليم",
      plan7030: "خطة ٧٠/٣٠", plan7030Desc: "٧٠٪ خلال البناء · ٣٠٪ بعد التسليم (١٢ شهر)",
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
      price: "السعر", floor: "الطابق", bedrooms: "غرف النوم",
      size: "المساحة", view: "الإطلالة", category: "الفئة",
      empty: "أضف مساكن للمقارنة بالنقر على أيقونة ⚖️ في بطاقات الوحدات.",
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
      floorPlan: "تم فتح المخطط",
      brochure: "تم تحميل الكتيب",
      pricing: "تم إرسال طلب التسعير — تحقق من بريدك",
      booking: "تم تقديم طلب المعاينة الخاصة",
      compare: "تمت الإضافة للمقارنة",
      compareRemove: "تمت الإزالة من المقارنة",
      emailSent: "تم إرسال الكتيب لبريدك",
      advisorNotified: "تم إبلاغ مستشارك المخصص",
    },
    footer: "هذه بوابة خاصة. المحتوى مخصص لوصولك الحصري.",
    poweredBy: "مدعوم من",
  },
};

// ─── PROPERTY DATA (Rich: galleries, features, floor plans, payments) ──
const UNITS = [
  {
    id: "SKY-PH-42",
    name: { en: "Sky Penthouse", ar: "بنتهاوس السماء" },
    floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤" },
    beds: { en: "4 Bedrooms", ar: "٤ غرف نوم" }, bedNum: 4,
    baths: { en: "5 Bathrooms", ar: "٥ حمامات" },
    size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²" }, sizeNum: 6200,
    price: 12500000,
    priceDisplay: { en: "AED 12,500,000", ar: "١٢,٥٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 12.5M", ar: "١٢.٥ مليون درهم" },
    perSqft: { en: "AED 2,016/sq ft", ar: "٢,٠١٦ درهم/قدم²" },
    feature: { en: "360° Panoramic Views", ar: "إطلالة بانورامية ٣٦٠°" },
    status: { en: "Available", ar: "متاح" }, statusColor: "#2D8F6F",
    category: { en: "Penthouse", ar: "بنتهاوس" },
    view: { en: "Sea + City Panoramic", ar: "بانورامية بحر + مدينة" },
    desc: {
      en: "A triple-height masterpiece crowning the tower. Private infinity pool, direct elevator access, Gaggenau kitchen, Italian marble throughout, and a wraparound terrace with unobstructed views of the Arabian Gulf.",
      ar: "تحفة معمارية بارتفاع ثلاثي تتوّج البرج. مسبح إنفينيتي خاص، مصعد مباشر، مطبخ غاغيناو، رخام إيطالي في كل مكان، وتراس محيطي بإطلالات خلابة على الخليج العربي.",
    },
    features: {
      en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
      ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
    },
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
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
    id: "GR-35-01",
    name: { en: "Grand Residence", ar: "الإقامة الكبرى" },
    floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨" },
    beds: { en: "3 Bedrooms", ar: "٣ غرف نوم" }, bedNum: 3,
    baths: { en: "4 Bathrooms", ar: "٤ حمامات" },
    size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²" }, sizeNum: 4100,
    price: 7800000,
    priceDisplay: { en: "AED 7,800,000", ar: "٧,٨٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 7.8M", ar: "٧.٨ مليون درهم" },
    perSqft: { en: "AED 1,902/sq ft", ar: "١,٩٠٢ درهم/قدم²" },
    feature: { en: "Marina & Sea View", ar: "إطلالة على المارينا والبحر" },
    status: { en: "Available", ar: "متاح" }, statusColor: "#2D8F6F",
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
    id: "EX-25-01",
    name: { en: "Executive Suite", ar: "الجناح التنفيذي" },
    floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠" },
    beds: { en: "2 Bedrooms", ar: "غرفتا نوم" }, bedNum: 2,
    baths: { en: "3 Bathrooms", ar: "٣ حمامات" },
    size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²" }, sizeNum: 2800,
    price: 4200000,
    priceDisplay: { en: "AED 4,200,000", ar: "٤,٢٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 4.2M", ar: "٤.٢ مليون درهم" },
    perSqft: { en: "AED 1,500/sq ft", ar: "١,٥٠٠ درهم/قدم²" },
    feature: { en: "City Skyline View", ar: "إطلالة على أفق المدينة" },
    status: { en: "Last 3 Units", ar: "آخر ٣ وحدات" }, statusColor: "#C1121F",
    category: { en: "Executive Suite", ar: "جناح تنفيذي" },
    view: { en: "City Skyline", ar: "أفق المدينة" },
    desc: {
      en: "Refined elegance for the modern executive. Featuring a dedicated home office, walk-in wardrobe, chef's kitchen with Bosch appliances, and floor-to-ceiling windows framing the city skyline.",
      ar: "أناقة راقية للتنفيذي العصري. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة بوش، ونوافذ من الأرض إلى السقف تؤطر أفق المدينة.",
    },
    features: {
      en: ["City View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
      ar: ["إطلالة المدينة", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
    },
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
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
    { icon: "🏊", name: "Infinity Edge Pool", desc: "60m rooftop pool with panoramic Gulf views" },
    { icon: "🧖", name: "Spa & Wellness", desc: "Full-service spa with hammam & cryo chamber" },
    { icon: "🍽️", name: "Private Dining", desc: "Michelin-standard resident-only restaurant" },
    { icon: "🏋️", name: "Fitness Atelier", desc: "Technogym-equipped with personal trainers" },
    { icon: "🛥️", name: "Marina Access", desc: "Private berths for yachts up to 60ft" },
    { icon: "🌿", name: "Sky Gardens", desc: "Landscaped terraces on every 10th floor" },
    { icon: "👶", name: "Kids Club", desc: "Supervised play areas & learning center" },
    { icon: "🚗", name: "Valet & EV", desc: "24/7 valet with EV charging stations" },
  ],
  ar: [
    { icon: "🏊", name: "مسبح إنفينيتي", desc: "مسبح على السطح بطول ٦٠ متر مع إطلالات بانورامية" },
    { icon: "🧖", name: "سبا وعافية", desc: "سبا متكامل مع حمام تركي وغرفة تبريد" },
    { icon: "🍽️", name: "مطعم خاص", desc: "مطعم حصري للسكان بمعايير ميشلان" },
    { icon: "🏋️", name: "صالة لياقة", desc: "مجهزة بأحدث أجهزة تكنوجيم مع مدربين شخصيين" },
    { icon: "🛥️", name: "مرسى خاص", desc: "أرصفة خاصة لليخوت حتى ٦٠ قدم" },
    { icon: "🌿", name: "حدائق سماوية", desc: "شرفات منسقة كل ١٠ طوابق" },
    { icon: "👶", name: "نادي الأطفال", desc: "مناطق لعب مراقبة ومركز تعليمي" },
    { icon: "🚗", name: "خدمة صف السيارات", desc: "خدمة صف ٢٤/٧ مع محطات شحن كهربائية" },
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
  pool: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
};

const ROOM_COLORS = {
  master: "#C5A467", bed2: "#8AADBD", bed3: "#93B5A0", bed4: "#B5A293",
  living: "#D4C5A9", kitchen: "#A3B8C5", dining: "#C5B8A3", office: "#A8B5C5",
  balcony: "#B8D4C5", pool: "#7EC8E3", maid: "#C5B8C5",
};

// ─── CSS (Dark Luxury, clean namespaced) ─────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');

:root {
  --vp-gold: #C5A467;
  --vp-gold-lt: #D4B97A;
  --vp-gold-glow: rgba(197,164,103,0.12);
  --vp-gold-bdr: rgba(197,164,103,0.25);
  --vp-ch: #0D0D0F;
  --vp-ch2: #141416;
  --vp-sl: #1C1C20;
  --vp-t1: #FAFAF8;
  --vp-t2: rgba(250,250,248,0.85);
  --vp-t3: rgba(250,250,248,0.58);
  --vp-gl: rgba(255,255,255,0.04);
  --vp-glb: rgba(255,255,255,0.08);
  --vp-serif: 'Cormorant Garamond', Georgia, serif;
  --vp-sans: 'Outfit', system-ui, sans-serif;
}

* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }

.vp { min-height:100vh; background:var(--vp-ch); font-family:var(--vp-sans); color:var(--vp-t1); overflow-x:hidden; -webkit-font-smoothing:antialiased; }

/* Header */
.vp-hd { position:fixed; top:0; left:0; right:0; z-index:100; padding:1.25rem 3rem; display:flex; align-items:center; justify-content:space-between; transition:all .5s; }
.vp-hd.sc { background:rgba(13,13,15,.94); backdrop-filter:blur(20px); border-bottom:1px solid var(--vp-glb); padding:.85rem 3rem; }
.vp-logo { font-family:var(--vp-serif); font-size:1.5rem; font-weight:400; letter-spacing:.15em; color:var(--vp-gold); text-transform:uppercase; }
.vp-logo b { font-weight:600; color:var(--vp-t1); }
.vp-nav { display:flex; align-items:center; gap:1rem; }
.vp-badge { display:flex; align-items:center; gap:.5rem; padding:.45rem 1rem; border:1px solid var(--vp-gold-bdr); border-radius:100px; font-size:.72rem; letter-spacing:.1em; color:var(--vp-gold); text-transform:uppercase; }
.vp-badge::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--vp-gold); animation:vp-glow 2s infinite; }
@keyframes vp-glow { 0%,100%{opacity:1;box-shadow:0 0 4px var(--vp-gold)} 50%{opacity:.4;box-shadow:0 0 14px var(--vp-gold)} }
.vp-navbtn { background:none; border:1px solid var(--vp-glb); color:var(--vp-t2); padding:.4rem .9rem; border-radius:6px; font-family:var(--vp-sans); font-size:.78rem; cursor:pointer; transition:.3s; letter-spacing:.04em; }
.vp-navbtn:hover { border-color:var(--vp-gold-bdr); color:var(--vp-gold); }
.vp-cmp-count { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; background:var(--vp-gold); color:var(--vp-ch); font-size:.65rem; font-weight:600; border-radius:50%; margin-inline-start:.4rem; }

/* Hero */
.vp-hero { position:relative; height:100vh; min-height:700px; display:flex; align-items:flex-end; overflow:hidden; }
.vp-hero-bg { position:absolute; inset:0; background-size:cover; background-position:center; transform:scale(1.05); animation:vp-hz 20s ease-in-out infinite alternate; }
@keyframes vp-hz { from{transform:scale(1.05)} to{transform:scale(1.12)} }
.vp-hero-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(13,13,15,.3) 0%,rgba(13,13,15,.5) 40%,rgba(13,13,15,.93) 85%,var(--vp-ch) 100%); }
.vp-hero-ct { position:relative; z-index:2; padding:0 4rem 5rem; max-width:900px; animation:vp-fu 1.2s ease-out; }
@keyframes vp-fu { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
.vp-pvt { display:inline-flex; align-items:center; gap:.7rem; padding:.55rem 1.4rem; border:1px solid var(--vp-gold-bdr); border-radius:100px; margin-bottom:2rem; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; color:var(--vp-gold); background:rgba(197,164,103,.07); backdrop-filter:blur(10px); }
.vp-pvt::before { content:'◆'; font-size:.45rem; }
.vp-greet { font-size:1.15rem; font-weight:400; color:var(--vp-t2); margin-bottom:.5rem; letter-spacing:.05em; text-shadow:0 1px 8px rgba(0,0,0,0.4); }
.vp-greet span { color:var(--vp-gold); font-weight:500; }
.vp-htitle { font-family:var(--vp-serif); font-size:clamp(2.8rem,6vw,5.5rem); font-weight:400; line-height:1.05; margin-bottom:1.5rem; text-shadow:0 2px 20px rgba(0,0,0,0.5); color:#FFFFFF; }
.vp-htitle em { font-style:italic; color:var(--vp-gold); }
.vp-hdesc { font-size:1.05rem; font-weight:400; line-height:1.7; color:var(--vp-t2); max-width:600px; margin-bottom:2.5rem; text-shadow:0 1px 8px rgba(0,0,0,0.4); }
.vp-hacts { display:flex; gap:1rem; flex-wrap:wrap; }

/* Buttons */
.vp-btn-g { display:inline-flex; align-items:center; gap:.7rem; padding:1rem 2.5rem; background:linear-gradient(135deg,var(--vp-gold),var(--vp-gold-lt)); color:var(--vp-ch); font-family:var(--vp-sans); font-size:.85rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; border:none; border-radius:4px; cursor:pointer; transition:all .4s cubic-bezier(.4,0,.2,1); white-space:nowrap; }
.vp-btn-g:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(197,164,103,.35); }
.vp-btn-o { display:inline-flex; align-items:center; gap:.7rem; padding:1rem 2.5rem; background:transparent; color:var(--vp-gold); font-family:var(--vp-sans); font-size:.85rem; font-weight:400; letter-spacing:.1em; text-transform:uppercase; border:1px solid var(--vp-gold-bdr); border-radius:4px; cursor:pointer; transition:all .4s; white-space:nowrap; }
.vp-btn-o:hover { background:var(--vp-gold-glow); border-color:var(--vp-gold); }
.vp-btn-sm { padding:.5rem 1rem; font-size:.7rem; letter-spacing:.06em; }

/* Stats */
.vp-stats { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid var(--vp-glb); border-bottom:1px solid var(--vp-glb); background:var(--vp-ch2); }
.vp-stat { padding:2.5rem 2rem; text-align:center; border-inline-end:1px solid var(--vp-glb); transition:.3s; }
.vp-stat:last-child { border:none; }
.vp-stat:hover { background:var(--vp-gl); }
.vp-stat-v { font-family:var(--vp-serif); font-size:2.5rem; font-weight:400; color:var(--vp-gold); line-height:1; margin-bottom:.5rem; }
.vp-stat-l { font-size:.75rem; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--vp-t3); }

/* Section */
.vp-sec { padding:6rem 4rem; }
.vp-sh { text-align:center; margin-bottom:4rem; }
.vp-sl { font-size:.78rem; letter-spacing:.25em; text-transform:uppercase; color:var(--vp-gold); margin-bottom:1rem; display:block; font-weight:500; }
.vp-st { font-family:var(--vp-serif); font-size:clamp(2rem,4vw,3.5rem); font-weight:400; margin-bottom:.6rem; color:var(--vp-t1); }
.vp-ss { font-size:1rem; font-weight:400; color:var(--vp-t2); }

/* Unit Cards (3-col grid with rich detail) */
.vp-units { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; max-width:1200px; margin:0 auto; }
.vp-card { background:var(--vp-ch2); border:1px solid var(--vp-glb); border-radius:8px; overflow:hidden; cursor:pointer; transition:all .5s; position:relative; }
.vp-card:hover { border-color:var(--vp-gold-bdr); transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,.4); }
.vp-card-img { position:relative; height:220px; overflow:hidden; }
.vp-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .6s; }
.vp-card:hover .vp-card-img img { transform:scale(1.08); }
.vp-card-fbadge { position:absolute; top:1rem; inset-inline-start:1rem; padding:.35rem .8rem; background:rgba(13,13,15,.85); backdrop-filter:blur(8px); border:1px solid var(--vp-gold-bdr); border-radius:4px; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:var(--vp-gold); }
.vp-card-status { position:absolute; top:1rem; inset-inline-end:1rem; padding:.35rem .8rem; border-radius:4px; font-size:.65rem; font-weight:600; color:#fff; }
.vp-card-body { padding:1.5rem; }
.vp-card-name { font-family:var(--vp-serif); font-size:1.5rem; font-weight:500; margin-bottom:.3rem; color:#FFFFFF; }
.vp-card-floor { font-size:.8rem; color:var(--vp-gold); letter-spacing:.08em; text-transform:uppercase; margin-bottom:1rem; font-weight:500; }
.vp-card-meta { display:flex; gap:1.5rem; margin-bottom:1rem; font-size:.88rem; color:var(--vp-t2); font-weight:400; }
.vp-card-price { font-family:var(--vp-serif); font-size:1.6rem; font-weight:600; color:var(--vp-gold); margin-bottom:.25rem; }
.vp-card-sqft { font-size:.8rem; color:var(--vp-t3); }
.vp-card-acts { display:flex; gap:.4rem; padding:.75rem 1rem; border-top:1px solid var(--vp-glb); flex-wrap:wrap; }
.vp-card-acts button { flex:none; }

/* Amenities */
.vp-am-sec { position:relative; overflow:hidden; }
.vp-am-bg { position:absolute; inset:0; background-size:cover; background-position:center; opacity:.12; }
.vp-am-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; max-width:1100px; margin:0 auto; background:var(--vp-glb); position:relative; z-index:2; }
.vp-am { background:rgba(13,13,15,.88); backdrop-filter:blur(20px); padding:2.5rem; text-align:center; transition:.4s; }
.vp-am:hover { background:rgba(197,164,103,.05); }
.vp-am-icon { font-size:2rem; margin-bottom:1rem; }
.vp-am-name { font-family:var(--vp-serif); font-size:1.2rem; font-weight:500; margin-bottom:.4rem; color:var(--vp-t1); }
.vp-am-desc { font-size:.85rem; color:var(--vp-t2); line-height:1.6; }

/* Investment */
.vp-inv-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2rem; max-width:1100px; margin:0 auto; }
.vp-inv { text-align:center; padding:3rem 2rem; border:1px solid var(--vp-glb); border-radius:2px; transition:.4s; background:var(--vp-ch); }
.vp-inv:hover { border-color:var(--vp-gold-bdr); background:var(--vp-gold-glow); }
.vp-inv-v { font-family:var(--vp-serif); font-size:2.8rem; font-weight:400; color:var(--vp-gold); margin-bottom:.5rem; }
.vp-inv-l { font-size:.9rem; font-weight:500; margin-bottom:.3rem; }
.vp-inv-n { font-size:.8rem; color:var(--vp-t3); }

/* Booking */
.vp-contact { background:var(--vp-ch2); }
.vp-form { max-width:580px; margin:0 auto; }
.vp-fg { margin-bottom:1.5rem; }
.vp-flabel { display:block; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vp-t3); margin-bottom:.5rem; font-weight:500; }
.vp-finput { width:100%; padding:1rem 0; background:transparent; border:none; border-bottom:1px solid var(--vp-glb); color:var(--vp-t1); font-family:var(--vp-sans); font-size:1rem; font-weight:400; transition:.3s; outline:none; }
.vp-finput:focus { border-bottom-color:var(--vp-gold); }
.vp-finput.vp-err { border-bottom-color:#C1121F; }
.vp-fsel { width:100%; padding:1rem 0; background:transparent; border:none; border-bottom:1px solid var(--vp-glb); color:var(--vp-t1); font-family:var(--vp-sans); font-size:1rem; outline:none; cursor:pointer; appearance:none; }
.vp-fsel option { background:var(--vp-ch); color:var(--vp-t1); }
.vp-fnote { text-align:center; font-size:.78rem; color:var(--vp-t3); margin-top:1.5rem; }
.vp-frow { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.vp-book-ok { text-align:center; padding:3rem; }
.vp-book-ok h3 { font-family:var(--vp-serif); font-size:1.8rem; color:var(--vp-gold); margin-bottom:.75rem; }
.vp-book-ok p { color:var(--vp-t2); font-size:.95rem; line-height:1.7; margin-bottom:1rem; }

/* Divider */
.vp-div { display:flex; align-items:center; padding:2rem 4rem; }
.vp-div-l { flex:1; height:1px; background:linear-gradient(90deg,transparent,var(--vp-gold-bdr),transparent); }
.vp-div-d { padding:0 1.5rem; color:var(--vp-gold); font-size:.5rem; }

/* Footer */
.vp-ft { padding:3rem 4rem; text-align:center; border-top:1px solid var(--vp-glb); }
.vp-ft p { font-size:.82rem; color:var(--vp-t3); margin-bottom:.75rem; }
.vp-ft-brand { font-family:var(--vp-serif); color:var(--vp-gold); }

/* Scroll Reveal */
.vp-rv { opacity:0; transform:translateY(25px); transition:all .8s cubic-bezier(.4,0,.2,1); }
.vp-rv.vis { opacity:1; transform:translateY(0); }

/* Toast */
.vp-toast { position:fixed; bottom:2rem; inset-inline-end:2rem; display:flex; align-items:center; gap:.75rem; padding:1rem 1.8rem; background:var(--vp-gold); color:var(--vp-ch); font-family:var(--vp-sans); font-size:.85rem; font-weight:500; border-radius:8px; z-index:300; animation:vp-tin .4s ease-out; box-shadow:0 8px 30px rgba(0,0,0,.4); }
@keyframes vp-tin { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
.vp-toast.hiding { animation:vp-tout .3s ease-in forwards; }
@keyframes vp-tout { to{transform:translateY(20px);opacity:0} }

/* ── MODALS ── */
.vp-modal-ov { position:fixed; inset:0; background:rgba(0,0,0,.85); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:2rem; animation:vp-mf .3s; }
@keyframes vp-mf { from{opacity:0} to{opacity:1} }
.vp-modal { background:var(--vp-ch2); border:1px solid var(--vp-glb); border-radius:12px; max-width:1000px; width:100%; max-height:90vh; overflow-y:auto; position:relative; animation:vp-ms .4s ease-out; }
@keyframes vp-ms { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
.vp-modal-x { position:absolute; top:1.2rem; inset-inline-end:1.2rem; width:36px; height:36px; border-radius:50%; background:var(--vp-gl); border:1px solid var(--vp-glb); color:var(--vp-t2); font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:.3s; z-index:5; }
.vp-modal-x:hover { background:var(--vp-gold-glow); color:var(--vp-gold); border-color:var(--vp-gold-bdr); }
.vp-modal-body { padding:2.5rem; }

/* Unit Detail Modal extras */
.vp-md-gallery { display:flex; gap:2px; height:280px; overflow:hidden; }
.vp-md-gallery img { flex:1; min-width:0; object-fit:cover; transition:.4s; }
.vp-md-gallery img:hover { flex:1.5; }
.vp-md-top { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; margin-bottom:2rem; flex-wrap:wrap; }
.vp-md-title { font-family:var(--vp-serif); font-size:2.2rem; font-weight:500; margin-bottom:.3rem; color:#FFFFFF; }
.vp-md-floor { font-size:.8rem; color:var(--vp-gold); letter-spacing:.1em; text-transform:uppercase; }
.vp-md-price { font-family:var(--vp-serif); font-size:2rem; font-weight:500; color:var(--vp-gold); }
.vp-md-sqft { font-size:.8rem; color:var(--vp-t3); }
.vp-md-desc { font-size:1.05rem; font-weight:400; line-height:1.8; color:var(--vp-t2); margin-bottom:2rem; max-width:700px; }
.vp-md-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; margin-bottom:2rem; }
.vp-md-gi { padding:1rem; border:1px solid var(--vp-glb); border-radius:6px; text-align:center; }
.vp-md-gi-l { font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vp-t3); margin-bottom:.3rem; }
.vp-md-gi-v { font-family:var(--vp-serif); font-size:1.2rem; color:#FFFFFF; }
.vp-md-feats { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:2rem; }
.vp-md-feat { padding:.4rem .9rem; background:var(--vp-gold-glow); border:1px solid var(--vp-gold-bdr); border-radius:4px; font-size:.78rem; color:var(--vp-gold); }

/* Payment bar */
.vp-pay-bar { display:flex; height:8px; border-radius:4px; overflow:hidden; margin-bottom:1rem; }
.vp-pay-seg { transition:.3s; }
.vp-pay-legend { display:flex; gap:1.5rem; flex-wrap:wrap; }
.vp-pay-item { display:flex; align-items:center; gap:.5rem; font-size:.82rem; color:var(--vp-t2); }
.vp-pay-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.vp-pay-amt { font-family:var(--vp-serif); font-size:1.1rem; font-weight:500; color:#FFFFFF; }

/* Floor Plan Modal */
.vp-fp-svg { width:100%; aspect-ratio:16/10; border:1px solid var(--vp-glb); border-radius:8px; margin-bottom:1.5rem; }
.vp-fp-specs { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:1.5rem; }
.vp-fp-spec { padding:1rem; border:1px solid var(--vp-glb); border-radius:6px; text-align:center; }
.vp-fp-spec-l { font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; color:var(--vp-t3); margin-bottom:.3rem; }
.vp-fp-spec-v { font-family:var(--vp-serif); font-size:1.1rem; color:var(--vp-gold); }

/* Brochure Modal */
.vp-br-prog { height:4px; background:var(--vp-glb); border-radius:2px; overflow:hidden; margin-bottom:2rem; }
.vp-br-fill { height:100%; background:var(--vp-gold); border-radius:2px; animation:vp-brfill 2s ease-out forwards; }
@keyframes vp-brfill { from{width:0} to{width:100%} }
.vp-br-items { display:flex; flex-direction:column; gap:.5rem; margin:1.5rem 0; }
.vp-br-item { display:flex; align-items:center; gap:.6rem; font-size:.85rem; color:var(--vp-t2); }
.vp-br-item::before { content:'✓'; color:var(--vp-gold); font-weight:600; }

/* Payment Modal */
.vp-pm-tabs { display:flex; gap:.5rem; margin-bottom:2rem; }
.vp-pm-tab { flex:1; padding:.8rem; text-align:center; border:1px solid var(--vp-glb); border-radius:8px; cursor:pointer; transition:.3s; font-family:var(--vp-sans); font-size:.82rem; background:transparent; color:var(--vp-t2); }
.vp-pm-tab.active { border-color:var(--vp-gold); background:var(--vp-gold-glow); color:var(--vp-gold); }
.vp-pm-ms { display:flex; flex-direction:column; gap:1rem; margin-top:2rem; }
.vp-pm-m { display:flex; align-items:center; gap:1rem; padding:1rem; border:1px solid var(--vp-glb); border-radius:8px; transition:.3s; }
.vp-pm-m:hover { border-color:var(--vp-gold-bdr); background:var(--vp-gl); }
.vp-pm-m-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
.vp-pm-m-info { flex:1; }
.vp-pm-m-label { font-size:.85rem; font-weight:500; margin-bottom:.15rem; }
.vp-pm-m-desc { font-size:.72rem; color:var(--vp-t3); }
.vp-pm-m-pct { font-size:.75rem; color:var(--vp-t3); }
.vp-pm-m-val { font-family:var(--vp-serif); font-size:1.1rem; color:var(--vp-gold); }

/* Compare Modal */
.vp-cmp-grid { width:100%; overflow-x:auto; }
.vp-cmp-row { display:grid; padding:.75rem 1rem; border-bottom:1px solid var(--vp-glb); align-items:center; font-size:.85rem; }
.vp-cmp-row.hdr { font-weight:600; color:var(--vp-t3); font-size:.65rem; text-transform:uppercase; letter-spacing:.08em; }
.vp-cmp-label { font-weight:500; color:var(--vp-t3); font-size:.72rem; }
.vp-cmp-val { text-align:center; }
.vp-cmp-empty { text-align:center; padding:3rem; color:var(--vp-t3); font-size:.88rem; }
.vp-cmp-rm { background:none; border:1px solid rgba(193,18,31,.3); color:#C1121F; padding:.25rem .5rem; border-radius:4px; font-size:.65rem; cursor:pointer; transition:.3s; font-family:var(--vp-sans); }
.vp-cmp-rm:hover { background:rgba(193,18,31,.1); }

/* Modal actions bar */
.vp-md-acts { display:flex; gap:.6rem; flex-wrap:wrap; margin-top:2rem; padding-top:2rem; border-top:1px solid var(--vp-glb); }

/* Responsive */
@media(max-width:1024px) {
  .vp-units { grid-template-columns:repeat(2,1fr); }
  .vp-am-grid { grid-template-columns:repeat(2,1fr); }
  .vp-inv-grid { grid-template-columns:repeat(2,1fr); }
  .vp-stats { grid-template-columns:repeat(2,1fr); }
  .vp-md-grid { grid-template-columns:repeat(2,1fr); }
  .vp-md-gallery { height:220px; }
}
@media(max-width:768px) {
  .vp-hd { padding:1rem 1.5rem; }
  .vp-hd.sc { padding:.75rem 1.5rem; }
  .vp-hero-ct { padding:0 1.5rem 3rem; }
  .vp-sec { padding:4rem 1.5rem; }
  .vp-htitle { font-size:2.5rem; }
  .vp-units { grid-template-columns:1fr; }
  .vp-am-grid { grid-template-columns:1fr 1fr; }
  .vp-badge { display:none; }
  .vp-hacts { flex-direction:column; }
  .vp-btn-g,.vp-btn-o { width:100%; justify-content:center; }
  .vp-modal { margin:1rem; max-height:95vh; }
  .vp-modal-body { padding:1.5rem; }
  .vp-md-top { flex-direction:column; }
  .vp-md-gallery { height:180px; flex-direction:column; }
  .vp-md-gallery img { height:180px; flex:none; }
  .vp-frow { grid-template-columns:1fr; }
  .vp-ft { padding:2rem 1.5rem; }
  .vp-div { padding:1.5rem; }
  .vp-fp-specs { grid-template-columns:1fr; }
}
@media(max-width:480px) {
  .vp-stats { grid-template-columns:1fr 1fr; }
  .vp-inv-grid { grid-template-columns:1fr; }
  .vp-md-grid { grid-template-columns:1fr 1fr; }
  .vp-md-acts { flex-direction:column; }
  .vp-md-acts button { width:100%; }
  .vp-pm-tabs { flex-direction:column; }
}
`;

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function VIPPortal() {
  const [lang, setLang] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalUnit, setModalUnit] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [payPlan, setPayPlan] = useState("60/40");
  const [compareList, setCompareList] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastHiding, setToastHiding] = useState(false);
  const [bookingOk, setBookingOk] = useState(false);
  const [bookingRef, setBookingRefVal] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", unit: "", date: "", time: "", notes: "" });
  const [formErr, setFormErr] = useState({});

  const resRef = useRef(null);
  const bookRef = useRef(null);
  const t = LANG[lang];

  // Inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

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
    document.querySelectorAll(".vp-rv").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, modal, selectedUnit]);

  // Track page load
  useEffect(() => { trackEvent("portal_opened", { language: lang }); }, []);

  const vipName = lang === "en" ? "Khalid Al-Rashid" : "خالد الراشد";
  const toggleLang = () => { const n = lang === "en" ? "ar" : "en"; setLang(n); trackEvent("language_switch", { to: n }); };

  // Toast
  const showToast = useCallback((msg, icon = "✓") => {
    setToastHiding(false);
    setToast({ msg, icon });
    setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000);
  }, []);

  // Format AED
  const fmtAED = (n) => lang === "en" ? `AED ${n.toLocaleString()}` : `${n.toLocaleString()} درهم`;

  // Compare
  const toggleCompare = (unitId) => {
    setCompareList((prev) => {
      if (prev.includes(unitId)) { showToast(t.toast.compareRemove, "↩"); return prev.filter((id) => id !== unitId); }
      if (prev.length >= 3) return prev;
      trackEvent("comparison_view", { unitId });
      showToast(t.toast.compare, "⚖️");
      return [...prev, unitId];
    });
  };

  // Modal openers
  const openDetail = (unit) => { setSelectedUnit(unit); trackEvent("view_unit", { unitId: unit.id, unitName: unit.name.en, price: unit.price }); };
  const openFloor = (unit) => { setModalUnit(unit); setModal("floorplan"); trackEvent("view_floorplan", { unitId: unit.id }); showToast(t.toast.floorPlan, "📐"); };
  const openBrochure = (unit) => { setModalUnit(unit); setModal("brochure"); trackEvent("download_brochure", { unitId: unit.id }); showToast(t.toast.brochure, "📄"); };
  const openPayment = (unit) => { setModalUnit(unit); setModal("payment"); setPayPlan("60/40"); trackEvent("explore_payment_plan", { unitId: unit.id }); };
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => { trackEvent("request_pricing", { unitId: unit.id, price: unit.price }); showToast(t.toast.pricing, "💰"); };
  const callAdvisor = () => { trackEvent("contact_advisor", { vipName }); showToast(t.toast.advisorNotified, "📞"); };
  const closeAll = () => { setModal(null); setModalUnit(null); setSelectedUnit(null); };

  // Booking
  const validateForm = () => {
    const err = {};
    if (!form.name.trim()) err.name = true;
    if (!form.email.trim() || !form.email.includes("@")) err.email = true;
    if (!form.phone.trim()) err.phone = true;
    setFormErr(err);
    return Object.keys(err).length === 0;
  };
  const submitBooking = () => {
    if (!validateForm()) return;
    const ref = "VIP-" + Date.now().toString(36).toUpperCase().slice(-6);
    trackEvent("book_viewing", { unitId: form.unit || "general", name: form.name || vipName, date: form.date, time: form.time });
    setBookingRefVal(ref);
    setBookingOk(true);
    showToast(t.toast.booking, "📅");
  };

  // Payment milestones
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

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="vp" dir={t.dir}>
      {/* ── HEADER ── */}
      <header className={`vp-hd ${scrolled ? "sc" : ""}`}>
        <div className="vp-logo">Vista <b>Residences</b></div>
        <div className="vp-nav">
          <div className="vp-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="vp-navbtn" onClick={openCompare}>
              {t.nav.compare}<span className="vp-cmp-count">{compareList.length}</span>
            </button>
          )}
          <button className="vp-navbtn" onClick={toggleLang}>{t.nav.lang}</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="vp-hero">
        <div className="vp-hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="vp-hero-ov" />
        <div className="vp-hero-ct">
          <div className="vp-pvt">{t.hero.badge}</div>
          <p className="vp-greet">{t.hero.greeting} <span>{vipName}</span></p>
          <h1 className="vp-htitle">
            {lang === "en" ? (<>Your Exclusive<br /><em>Residence</em> Awaits</>) : (<>مسكنك<br /><em>الحصري</em> بانتظارك</>)}
          </h1>
          <p className="vp-hdesc">{t.hero.subtitle}</p>
          <div className="vp-hacts">
            <button className="vp-btn-g" onClick={() => { trackEvent("cta_explore"); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="vp-btn-o" onClick={() => { trackEvent("cta_booking"); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="vp-stats">
        {[
          { v: "248", l: t.stats.units },
          { v: "44", l: t.stats.floors },
          { v: "8.2%", l: t.stats.roi },
          { v: "Q4 '27", l: t.stats.completion },
        ].map((s, i) => (
          <div className="vp-stat" key={i}>
            <div className="vp-stat-v">{s.v}</div>
            <div className="vp-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── RESIDENCES ── */}
      <section className="vp-sec" ref={resRef}>
        <div className="vp-sh vp-rv">
          <span className="vp-sl">◆ {t.sections.residences}</span>
          <h2 className="vp-st">{t.sections.residencesSub}</h2>
          <p className="vp-ss">{t.sections.residencesHint}</p>
        </div>
        <div className="vp-units">
          {UNITS.map((unit) => (
            <div className="vp-card vp-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="vp-card-img">
                <img src={unit.img} alt={unit.name[lang]} loading="lazy" />
                <div className="vp-card-fbadge">{unit.feature[lang]}</div>
                <div className="vp-card-status" style={{ background: unit.statusColor }}>{unit.status[lang]}</div>
              </div>
              <div className="vp-card-body">
                <h3 className="vp-card-name">{unit.name[lang]}</h3>
                <p className="vp-card-floor">{unit.floor[lang]}</p>
                <div className="vp-card-meta">
                  <span>🛏 {unit.beds[lang]}</span>
                  <span>📐 {unit.size[lang]}</span>
                </div>
                <div className="vp-card-price">{unit.priceShort[lang]}</div>
                <div className="vp-card-sqft">{unit.perSqft[lang]}</div>
              </div>
              <div className="vp-card-acts" onClick={(e) => e.stopPropagation()}>
                <button className="vp-btn-o vp-btn-sm" onClick={() => openFloor(unit)}>📐 {t.unitActions.floorPlan}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={() => openBrochure(unit)}>📄 {t.unitActions.brochure}</button>
                <button className="vp-btn-g vp-btn-sm" onClick={() => reqPricing(unit)}>💰 {t.unitActions.pricing}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={() => toggleCompare(unit.id)} style={compareList.includes(unit.id) ? { borderColor: "var(--vp-gold)", color: "var(--vp-gold)", background: "rgba(197,164,103,0.1)" } : {}}>
                  {compareList.includes(unit.id) ? `✓ ${t.unitActions.compare}` : `⚖️ ${t.unitActions.compare}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vp-div"><div className="vp-div-l" /><div className="vp-div-d">◆</div><div className="vp-div-l" /></div>

      {/* ── AMENITIES ── */}
      <section className="vp-sec vp-am-sec">
        <div className="vp-am-bg" style={{ backgroundImage: `url(${IMAGES.pool})` }} />
        <div className="vp-sh vp-rv" style={{ position: "relative", zIndex: 2 }}>
          <span className="vp-sl">◆ {t.sections.amenities}</span>
          <h2 className="vp-st">{t.sections.amenitiesSub}</h2>
        </div>
        <div className="vp-am-grid">
          {AMENITIES[lang].map((a, i) => (
            <div className="vp-am vp-rv" key={i}>
              <div className="vp-am-icon">{a.icon}</div>
              <div className="vp-am-name">{a.name}</div>
              <div className="vp-am-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vp-div"><div className="vp-div-l" /><div className="vp-div-d">◆</div><div className="vp-div-l" /></div>

      {/* ── INVESTMENT ── */}
      <section className="vp-sec">
        <div className="vp-sh vp-rv">
          <span className="vp-sl">◆ {t.sections.investment}</span>
          <h2 className="vp-st">{t.sections.investmentSub}</h2>
        </div>
        <div className="vp-inv-grid">
          {INVEST[lang].map((item, i) => (
            <div className="vp-inv vp-rv" key={i}>
              <div className="vp-inv-v">{item.value}</div>
              <div className="vp-inv-l">{item.label}</div>
              <div className="vp-inv-n">{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="vp-div"><div className="vp-div-l" /><div className="vp-div-d">◆</div><div className="vp-div-l" /></div>

      {/* ── BOOKING ── */}
      <section className="vp-sec vp-contact" ref={bookRef}>
        <div className="vp-sh vp-rv">
          <span className="vp-sl">◆ {t.sections.contact}</span>
          <h2 className="vp-st">{t.sections.contactSub}</h2>
          <p className="vp-ss">{t.sections.contactHint}</p>
        </div>

        {bookingOk ? (
          <div className="vp-book-ok vp-rv">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h3>{t.booking.success}</h3>
            <p>{t.booking.successDesc}</p>
            <p style={{ color: "var(--vp-gold)", fontFamily: "var(--vp-serif)", fontSize: "1.2rem" }}>
              {t.booking.successRef}: {bookingRef}
            </p>
          </div>
        ) : (
          <div className="vp-form vp-rv">
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.name}</label>
              <input className={`vp-finput ${formErr.name ? "vp-err" : ""}`} type="text" defaultValue={vipName}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.email}</label>
              <input className={`vp-finput ${formErr.email ? "vp-err" : ""}`} type="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.phone}</label>
              <input className={`vp-finput ${formErr.phone ? "vp-err" : ""}`} type="tel"
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.preferred}</label>
              <select className="vp-fsel" onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="">—</option>
                {UNITS.map((u) => (<option key={u.id} value={u.id}>{u.name[lang]} — {u.priceShort[lang]}</option>))}
              </select>
            </div>
            <div className="vp-frow">
              <div className="vp-fg">
                <label className="vp-flabel">{t.booking.date}</label>
                <input className="vp-finput" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="vp-fg">
                <label className="vp-flabel">{t.booking.time}</label>
                <select className="vp-fsel" onChange={(e) => setForm({ ...form, time: e.target.value })}>
                  <option value="">—</option>
                  <option value="morning">{t.booking.morning}</option>
                  <option value="afternoon">{t.booking.afternoon}</option>
                  <option value="evening">{t.booking.evening}</option>
                </select>
              </div>
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.notes}</label>
              <input className="vp-finput" type="text" onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button className="vp-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>
              {t.booking.submit} →
            </button>
            <p className="vp-fnote">{t.booking.note}</p>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer className="vp-ft">
        <p>{t.footer}</p>
        <p><span className="vp-ft-brand">{t.poweredBy} Dynamic NFC</span></p>
      </footer>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ════════════════════════════════════════════════════════════ */}

      {/* ── UNIT DETAIL MODAL ── */}
      {selectedUnit && (
        <div className="vp-modal-ov" onClick={closeAll}>
          <div className="vp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="vp-modal-x" onClick={closeAll}>✕</button>
            <div className="vp-md-gallery">
              <img src={selectedUnit.img} alt={selectedUnit.name[lang]} />
              <img src={IMAGES.hero} alt="View 2" />
              <img src={IMAGES.pool} alt="View 3" />
            </div>
            <div className="vp-modal-body">
              <div className="vp-md-top">
                <div>
                  <h2 className="vp-md-title">{selectedUnit.name[lang]}</h2>
                  <p className="vp-md-floor">{selectedUnit.floor[lang]}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div className="vp-md-price">{selectedUnit.priceDisplay[lang]}</div>
                  <div className="vp-md-sqft">{selectedUnit.perSqft[lang]}</div>
                </div>
              </div>
              <p className="vp-md-desc">{selectedUnit.desc[lang]}</p>
              <div className="vp-md-grid">
                <div className="vp-md-gi"><div className="vp-md-gi-l">{lang === "en" ? "Bedrooms" : "غرف النوم"}</div><div className="vp-md-gi-v">{selectedUnit.beds[lang]}</div></div>
                <div className="vp-md-gi"><div className="vp-md-gi-l">{lang === "en" ? "Bathrooms" : "الحمامات"}</div><div className="vp-md-gi-v">{selectedUnit.baths[lang]}</div></div>
                <div className="vp-md-gi"><div className="vp-md-gi-l">{lang === "en" ? "Living Area" : "المساحة"}</div><div className="vp-md-gi-v">{selectedUnit.size[lang]}</div></div>
                <div className="vp-md-gi">
                  <div className="vp-md-gi-l">{lang === "en" ? "Status" : "الحالة"}</div>
                  <div className="vp-md-gi-v" style={{ background: selectedUnit.statusColor, color: "#fff", display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontSize: ".9rem" }}>
                    {selectedUnit.status[lang]}
                  </div>
                </div>
              </div>
              <div className="vp-md-feats">
                {selectedUnit.features[lang].map((f, i) => (<span className="vp-md-feat" key={i}>{f}</span>))}
              </div>

              {/* Inline Payment Preview */}
              <div style={{ padding: "1.5rem", border: "1px solid var(--vp-glb)", borderRadius: "8px", background: "var(--vp-gl)" }}>
                <h4 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{lang === "en" ? "Payment Plan" : "خطة الدفع"}</h4>
                <div className="vp-pay-bar">
                  <div className="vp-pay-seg" style={{ flex: 10, background: "var(--vp-gold)" }} />
                  <div className="vp-pay-seg" style={{ flex: 50, background: "var(--vp-gold-lt)" }} />
                  <div className="vp-pay-seg" style={{ flex: 40, background: "rgba(197,164,103,.35)" }} />
                </div>
                <div className="vp-pay-legend">
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "var(--vp-gold)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{lang === "en" ? "Down Payment" : "الدفعة الأولى"} (10%)</div><div className="vp-pay-amt">{fmtAED(selectedUnit.price * 0.1)}</div></div></div>
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "var(--vp-gold-lt)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{lang === "en" ? "During Construction" : "خلال البناء"} (50%)</div><div className="vp-pay-amt">{fmtAED(selectedUnit.price * 0.5)}</div></div></div>
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "rgba(197,164,103,.35)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{lang === "en" ? "On Handover" : "عند التسليم"} (40%)</div><div className="vp-pay-amt">{fmtAED(selectedUnit.price * 0.4)}</div></div></div>
                </div>
              </div>

              {/* Actions */}
              <div className="vp-md-acts">
                <button className="vp-btn-g vp-btn-sm" onClick={() => { closeAll(); openFloor(selectedUnit); }}>📐 {t.unitActions.floorPlan}</button>
                <button className="vp-btn-g vp-btn-sm" onClick={() => { closeAll(); openBrochure(selectedUnit); }}>📄 {t.unitActions.brochure}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={() => reqPricing(selectedUnit)}>💰 {t.unitActions.pricing}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={() => { closeAll(); openPayment(selectedUnit); }}>📊 {t.unitActions.payment}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={() => { closeAll(); setTimeout(() => bookRef.current?.scrollIntoView({ behavior: "smooth" }), 300); }}>📅 {t.unitActions.book}</button>
                <button className="vp-btn-o vp-btn-sm" onClick={callAdvisor}>📞 {t.unitActions.callAdvisor}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOOR PLAN MODAL ── */}
      {modal === "floorplan" && modalUnit && (
        <div className="vp-modal-ov" onClick={closeAll}>
          <div className="vp-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
            <button className="vp-modal-x" onClick={closeAll}>✕</button>
            <div className="vp-modal-body">
              <h2 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name[lang]}</h2>
              <p style={{ color: "var(--vp-gold)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor[lang]}</p>
              <svg className="vp-fp-svg" viewBox="0 0 100 65" style={{ background: "var(--vp-ch)" }}>
                {modalUnit.floorPlan.rooms.map((room, i) => (
                  <g key={i}>
                    <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#666"} fillOpacity="0.2" stroke={ROOM_COLORS[room.key] || "#666"} strokeWidth="0.3" rx="0.5" />
                    {room.label[lang].split("\n").map((line, li) => (
                      <text key={li} x={room.x + room.w / 2} y={room.y + room.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fill={ROOM_COLORS[room.key] || "#aaa"} fontSize="2.2" fontFamily="Outfit, sans-serif" fontWeight={li === 0 ? "500" : "300"}>
                        {line}
                      </text>
                    ))}
                  </g>
                ))}
              </svg>
              <div className="vp-fp-specs">
                <div className="vp-fp-spec"><div className="vp-fp-spec-l">{t.floorPlanModal.bathrooms}</div><div className="vp-fp-spec-v">{modalUnit.floorPlan.specs.bathrooms}</div></div>
                <div className="vp-fp-spec"><div className="vp-fp-spec-l">{t.floorPlanModal.balcony}</div><div className="vp-fp-spec-v">{modalUnit.floorPlan.specs.balconySize}</div></div>
                <div className="vp-fp-spec"><div className="vp-fp-spec-l">{t.floorPlanModal.totalArea}</div><div className="vp-fp-spec-v">{modalUnit.floorPlan.specs.totalArea}</div></div>
              </div>
              <button className="vp-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "Floor plan PDF downloading..." : "جاري تحميل المخطط...", "📥")}>
                {t.floorPlanModal.download}
              </button>
              <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--vp-t3)", marginTop: "1rem" }}>{t.floorPlanModal.disclaimer}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── BROCHURE MODAL ── */}
      {modal === "brochure" && modalUnit && (
        <div className="vp-modal-ov" onClick={closeAll}>
          <div className="vp-modal" style={{ maxWidth: "550px" }} onClick={(e) => e.stopPropagation()}>
            <button className="vp-modal-x" onClick={closeAll}>✕</button>
            <div className="vp-modal-body" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
              <div className="vp-br-prog"><div className="vp-br-fill" /></div>
              <h2 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>{t.brochureModal.ready}</h2>
              <p style={{ color: "var(--vp-t2)", fontSize: ".95rem", marginBottom: "1.5rem" }}>{t.brochureModal.desc}</p>
              <p style={{ color: "var(--vp-gold)", fontSize: ".85rem", fontWeight: 500, marginBottom: ".5rem" }}>{t.brochureModal.includes}</p>
              <div className="vp-br-items" style={{ textAlign: "start" }}>
                {t.brochureModal.items.map((item, i) => (<div className="vp-br-item" key={i}>{item}</div>))}
              </div>
              <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
                <button className="vp-btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "Brochure PDF downloading..." : "جاري تحميل الكتيب...", "📥")}>
                  {t.brochureModal.download}
                </button>
                <button className="vp-btn-o" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.emailSent, "📧")}>
                  {t.brochureModal.email}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT PLAN MODAL ── */}
      {modal === "payment" && modalUnit && (() => {
        const milestones = getMilestones(modalUnit.payment.base, payPlan);
        return (
          <div className="vp-modal-ov" onClick={closeAll}>
            <div className="vp-modal" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
              <button className="vp-modal-x" onClick={closeAll}>✕</button>
              <div className="vp-modal-body">
                <h2 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.paymentModal.title}</h2>
                <p style={{ color: "var(--vp-t2)", fontSize: ".9rem", marginBottom: ".5rem" }}>{t.paymentModal.subtitle}</p>
                <p style={{ fontFamily: "var(--vp-serif)", fontSize: "2rem", color: "var(--vp-gold)", marginBottom: "2rem" }}>
                  {t.paymentModal.totalPrice}: {fmtAED(modalUnit.payment.base)}
                </p>
                <div className="vp-pm-tabs">
                  <button className={`vp-pm-tab ${payPlan === "60/40" ? "active" : ""}`} onClick={() => setPayPlan("60/40")}>
                    <div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan6040}</div>
                    <div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan6040Desc}</div>
                  </button>
                  <button className={`vp-pm-tab ${payPlan === "70/30" ? "active" : ""}`} onClick={() => setPayPlan("70/30")}>
                    <div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan7030}</div>
                    <div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan7030Desc}</div>
                  </button>
                </div>
                <div className="vp-pay-bar" style={{ height: "10px" }}>
                  {milestones.map((m, i) => (<div key={i} className="vp-pay-seg" style={{ flex: m.pct, background: m.color }} />))}
                </div>
                <h4 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.2rem", margin: "1.5rem 0 1rem" }}>{t.paymentModal.milestones}</h4>
                <div className="vp-pm-ms">
                  {milestones.map((m, i) => (
                    <div className="vp-pm-m" key={i}>
                      <div className="vp-pm-m-dot" style={{ background: m.color }} />
                      <div className="vp-pm-m-info">
                        <div className="vp-pm-m-label">{m.label}</div>
                        <div className="vp-pm-m-desc">{m.desc}</div>
                      </div>
                      <div style={{ textAlign: "end" }}>
                        <div className="vp-pm-m-pct">{m.pct}%</div>
                        <div className="vp-pm-m-val">{fmtAED(modalUnit.payment.base * m.pct / 100)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="vp-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "2rem" }} onClick={() => { showToast(t.toast.advisorNotified, "📞"); }}>
                  {t.paymentModal.requestCall}
                </button>
                <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--vp-t3)", marginTop: "1rem" }}>{t.paymentModal.disclaimer}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── COMPARE MODAL ── */}
      {modal === "compare" && (
        <div className="vp-modal-ov" onClick={closeAll}>
          <div className="vp-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
            <button className="vp-modal-x" onClick={closeAll}>✕</button>
            <div className="vp-modal-body">
              <h2 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compareModal.title}</h2>
              {compareList.length === 0 ? (
                <div className="vp-cmp-empty">{t.compareModal.empty}</div>
              ) : (() => {
                const units = compareList.map((id) => UNITS.find((u) => u.id === id)).filter(Boolean);
                const cols = `180px repeat(${units.length}, 1fr)`;
                const rows = [
                  { label: t.compareModal.price, get: (u) => u.priceShort[lang] },
                  { label: t.compareModal.floor, get: (u) => u.floor[lang] },
                  { label: t.compareModal.bedrooms, get: (u) => u.beds[lang] },
                  { label: t.compareModal.size, get: (u) => u.size[lang] },
                  { label: t.compareModal.view, get: (u) => u.feature[lang] },
                  { label: t.compareModal.category, get: (u) => u.category[lang] },
                ];
                return (
                  <div className="vp-cmp-grid">
                    <div className="vp-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compareModal.feature}</div>
                      {units.map((u) => (
                        <div key={u.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--vp-serif)", fontSize: "1rem", color: "var(--vp-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{u.name[lang]}</div>
                          <button className="vp-cmp-rm" onClick={() => toggleCompare(u.id)}>{t.compareModal.remove}</button>
                        </div>
                      ))}
                    </div>
                    {rows.map((row, ri) => (
                      <div className="vp-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}>
                        <div className="vp-cmp-label">{row.label}</div>
                        {units.map((u) => (<div className="vp-cmp-val" key={u.id}>{row.get(u)}</div>))}
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
        <div className={`vp-toast ${toastHiding ? "hiding" : ""}`}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
    </div>
  );
}

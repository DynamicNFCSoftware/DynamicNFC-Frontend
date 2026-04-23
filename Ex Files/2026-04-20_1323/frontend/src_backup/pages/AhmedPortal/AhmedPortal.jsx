import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import './AhmedPortal.css';
import { initSession, trackLegacy } from '../../services/firestoreTracking';

// ═══════════════════════════════════════════════════════════════════
// AHMED AL-FAHAD — VIP FAMILY PORTAL (Definitive Edition)
// ═══════════════════════════════════════════════════════════════════
// Mirror of VIPPortal_Definitive architecture
// Theme: Deep navy + Ocean Blue (#457b9d) + Teal (#2ec4b6)
// Focus: Family residences, schools, community, 3BR units
// Features: Floor Plans, Brochures, Payment Plans, Comparison,
//           Booking with Validation, CRM Tracking, Toast System
// Self-contained — zero external shared imports
// ═══════════════════════════════════════════════════════════════════

// ─── TRACKING (localStorage + BroadcastChannel) ─────────────────
const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;
const trackEvent = (event, data = {}) => {
  const ev = { id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, timestamp: new Date().toISOString(), portalType: "vip", vipId: "AF-002", vipName: "Ahmed Al-Fahad", event, ...data };
  try {
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch (e) {}
  _bc?.postMessage(ev);
};

// ─── BILINGUAL ───────────────────────────────────────────────────
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP Family", lang: "العربية", compare: "Compare" },
    hero: {
      badge: "Private Family Invitation",
      greeting: "Welcome,",
      tagline: "Your Family's Dream Residence",
      subtitle: "A curated collection of spacious family residences with premium community features, handpicked for those who value quality living for their loved ones.",
      cta: "Explore Residences",
      ctaSecondary: "Schedule Family Viewing",
    },
    stats: { units: "Family Residences", schools: "Schools Nearby", parks: "Parks & Gardens", completion: "Completion" },
    roiBanner: {
      title: "Calculate Your Investment Returns",
      desc: "Use our interactive ROI calculator to project your returns based on property value, rental income, appreciation rates, and financing options.",
      cta: "Open ROI Calculator →",
    },
    sections: {
      residences: "Family Residences",
      residencesSub: "Spacious Homes for Growing Families",
      residencesHint: "Select any residence to explore details and community features",
      amenities: "Family Lifestyle",
      amenitiesSub: "Everything Your Family Needs, Steps Away",
      investment: "Smart Family Investment",
      investmentSub: "Build Wealth While Building a Home",
      contact: "Family Consultation",
      contactSub: "Schedule Your Family Viewing",
      contactHint: "Your family advisor will arrange a private tour with community walkthrough",
    },
    unitActions: { viewDetails: "View Details", floorPlan: "Floor Plan", brochure: "Brochure", pricing: "Request Pricing", book: "Book Viewing", compare: "Compare", payment: "Payment Plan", callAdvisor: "Call Advisor" },
    floorPlanModal: {
      title: "Floor Plan", bedrooms: "Bedrooms", living: "Living Area", balcony: "Balcony / Garden", kitchen: "Kitchen", master: "Master Suite", bathrooms: "Bathrooms", totalArea: "Total Area", download: "Download Floor Plan PDF",
      disclaimer: "Floor plans are indicative and may vary. Actual dimensions confirmed upon handover.",
    },
    brochureModal: {
      title: "Family Brochure", downloading: "Preparing your brochure...", ready: "Brochure Ready",
      desc: "Your personalized family brochure has been prepared with community details.",
      download: "Download Brochure PDF", email: "Send to Email", includes: "Brochure includes:",
      items: ["Detailed floor plans & specifications", "Community & school directory", "Family amenity overview", "Investment analysis & payment plans", "Location & connectivity map"],
    },
    paymentModal: {
      title: "Payment Plan", subtitle: "Family-friendly payment structure",
      totalPrice: "Total Price",
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
      disclaimer: "Payment plans subject to approval. Terms may vary based on unit selection.",
    },
    compareModal: {
      title: "Compare Residences", feature: "Feature", remove: "Remove",
      price: "Price", floor: "Floor", bedrooms: "Bedrooms", size: "Size", view: "View", category: "Category",
      empty: "Add residences to compare by clicking the ⚖️ icon on unit cards.",
    },
    booking: {
      name: "Full Name", email: "Email Address", phone: "Phone Number",
      preferred: "Preferred Residence", date: "Preferred Date", time: "Preferred Time",
      notes: "Family Requirements", submit: "Request Family Viewing",
      note: "Your information is protected. Your family advisor will contact you within 24 hours.",
      morning: "Morning (9AM-12PM)", afternoon: "Afternoon (12PM-4PM)", evening: "Evening (4PM-7PM)",
      success: "Family Viewing Request Submitted",
      successDesc: "Thank you! Your family advisor will contact you within 24 hours to arrange a private tour including the community facilities.",
      successRef: "Reference",
    },
    toast: {
      floorPlan: "Floor plan opened", brochure: "Brochure downloaded",
      pricing: "Pricing request sent — check your email", booking: "Family viewing request submitted",
      compare: "Added to comparison", compareRemove: "Removed from comparison",
      emailSent: "Brochure sent to your email", advisorNotified: "Your family advisor has been notified",
    },
    footer: "This is a private family portal. Content is personalized for your exclusive access.",
    poweredBy: "Powered by",
  },
  ar: {
    dir: "Ltr",
    nav: { vip: "عائلة كبار الشخصيات", lang: "العربية", compare: "مقارنة" },
    hero: {
      badge: "دعوة عائلية خاصة",
      greeting: "مرحبًا،",
      tagline: "وحدة الأحلام لعائلتك",
      subtitle: "هيكل دفع ملائم للعائلة",
      cta: "استكشاف الوحدات السكنية",
      ctaSecondary: "جدولة زيارة عائلية",
    },
    stats: { units: "الوحدات العائلية", schools: "المدارس القريبة", parks: "الحدائق والمتنزهات", completion: "الاكتمال" },
    roiBanner: {
      title: "خطة الدفع",
      desc: "تم إعداد الكتيب العائلي المخصص لك مع تفاصيل المجتمع.",
      cta: "← افتح حاسبة العائد",
    },
    sections: {
      residences: "الوحدات العائلية", residencesSub: "منازل واسعة للعائلات النامية",
      residencesHint: "اختر أي وحدة لاستكشاف التفاصيل وميزات المجتمع",
      amenities: "أسلوب حياة العائلة", amenitiesSub: "كل ما تحتاجه عائلتك، خطوات قليلة منك",
      investment: "استثمار عائلي ذكي", investmentSub: "ابنِ ثروة أثناء بناء منزل",
      contact: "استشارة عائلية", contactSub: "جدولة زيارة العائلة",
      contactHint: "سيقوم مستشارك العائلي بترتيب جولة خاصة مع استعراض مرافق المجتمع",
    },
    unitActions: { viewDetails: "عرض التفاصيل", floorPlan: "مخطط الطابق", brochure: "الكتيب", pricing: "طلب السعر", book: "حجز زيارة", compare: "مقارنة", payment: "خطة الدفع", callAdvisor: "الاتصال بالمستشار" },
    floorPlanModal: {
      title: "المخطط الطابقي", bedrooms: "غرف النوم", living: "منطقة المعيشة", balcony: "شرفة / حديقة",
      kitchen: "المطبخ", master: "جناح الماستر", bathrooms: "الحمامات", totalArea: "المساحة الإجمالية",
      download: "تحميل مخطط الطابق PDF",
      disclaimer: "خطط الدفع خاضعة للموافقة. قد تختلف الشروط حسب اختيار الوحدة.",
    },
    brochureModal: {
      title: "الكتيب العائلي", downloading: "جارٍ إعداد الكتيب...", ready: "الكتيب جاهز",
      desc: "تم إعداد كتيبك العائلي المخصص مع تفاصيل المجتمع.", download: "تحميل الكتيب PDF",
      email: "إرسال إلى البريد الإلكتروني", includes: "يشمل الكتيب:",
      items: ["مخططات تفصيلية ومواصفات", "دليل المجتمع والمدارس", "نظرة على المرافق العائلية", "تحليل استثماري وخطط الدفع", "خريطة الموقع والاتصال"],
    },
    paymentModal: {
      title: "خطة الدفع", subtitle: "هيكل دفع مناسب للعائلات", totalPrice: "السعر الإجمالي",
      plan6040: "خطة 60/40", plan6040Desc: "60% أثناء البناء · 40% عند التسليم",
      plan7030: "خطة 70/30", plan7030Desc: "70% أثناء البناء · 30% بعد التسليم (12 شهرًا)",
      milestones: "معالم الدفع",
      m1: "دفعة الحجز", m1d: "عند الحجز", m2: "الدفعة الأولى", m2d: "خلال 30 يومًا",
      m3: "إتمام البناء 30%", m3d: "عند إتمام 30%", m4: "إتمام البناء 60%", m4d: "عند إتمام 60%",
      m5: "التسليم", m5d: "عند تسليم المفتاح", m6: "ما بعد التسليم", m6d: "12 شهرًا بعد التسليم",
      requestCall: "طلب استشارة الدفع",
      disclaimer: "خطط الدفع تخضع للموافقة. قد تختلف الشروط حسب الوحدة المختارة.",
    },
    compareModal: {
      title: "مقارنة المساكن", feature: "الميزة", remove: "إزالة",
      price: "السعر", floor: "الطابق", bedrooms: "غرف النوم", size: "المساحة", view: "عرض", category: "الفئة",
      empty: "أضف الوحدات للمقارنة بالنقر على أيقونة المقارنة في بطاقات الوحدات.",
    },
    booking: {
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      preferred: "الإقامة المفضلة", date: "التاريخ المفضل", time: "الوقت المفضل",
      notes: "متطلبات الأسرة", submit: "طلب زيارة عائلية",
      note: "معلوماتك محمية. سيتواصل معك مستشارك العائلي خلال 24 ساعة.",
      morning: "الصباح (9ص–12م)", afternoon: "بعد الظهر (12م–4م)", evening: "المساء (4م–7م)",
      success: "تم إرسال طلب زيارة الأسرة",
      successDesc: "شكرًا لك! سيتواصل مستشارك العائلي خلال 24 ساعة لترتيب جولة خاصة تشمل مرافق المجتمع.",
      successRef: "المرجع",
    },
    toast: {
      floorPlan: "تم فتح المخطط", brochure: "تم تحميل الكتيب",
      pricing: "تم إرسال طلب التسعير — تحقق من بريدك", booking: "تم إرسال طلب زيارة الأسرة",
      compare: "تمت الإضافة للمقارنة", compareRemove: "تمت الإزالة من المقارنة",
      emailSent: "تم إرسال الكتيب إلى بريدك الإلكتروني", advisorNotified: "تم إشعار مستشارك العائلي",
    },
    footer: "هذه بوابة عائلية خاصة. المحتوى مخصص لوصولك الحصري.",
    poweredBy: "مدعوم من",
},
};

// ─── FAMILY PROPERTY DATA ────────────────────────────────────────
const UNITS = [
  {
    id: "FR-3B-18",
    name: { en: "Family Haven", ar: "واحة العائلة" },
    floor: { en: "Floor 18–22", ar: "الطابق ١٨-٢٢" },
    beds: { en: "3 Bedrooms + Maid", ar: "٣ غرف نوم + خادمة" }, bedNum: 3,
    baths: { en: "4 Bathrooms", ar: "٤ حمامات" },
    size: { en: "3,200 sq ft", ar: "٣,٢٠٠ قدم²" }, sizeNum: 3200,
    price: 5200000,
    priceDisplay: { en: "AED 5,200,000", ar: "٥,٢٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 5.2M", ar: "٥.٢ مليون درهم" },
    perSqft: { en: "AED 1,625/sq ft", ar: "١,٦٢٥ درهم/قدم²" },
    feature: { en: "Garden & Pool View", ar: "إطلالة على الحديقة والمسبح" },
    status: { en: "Available", ar: "متاح" }, statusColor: "#2D8F6F",
    category: { en: "Family Residence", ar: "مسكن عائلي" },
    view: { en: "Garden & Community", ar: "حديقة ومجتمع" },
    desc: {
      en: "A spacious family residence with open-plan living, dedicated kids' playroom, chef's kitchen with breakfast bar, and direct access to landscaped community gardens. Perfect for growing families.",
      ar: "مسكن عائلي فسيح بتصميم مفتوح، غرفة ألعاب مخصصة للأطفال، مطبخ الشيف مع بار إفطار، ووصول مباشر إلى الحدائق المجتمعية المنسقة. مثالي للعائلات المتنامية.",
    },
    features: {
      en: ["Kids Playroom", "Maid's Room", "Walk-in Closets", "Storage Room", "Garden Access"],
      ar: ["غرفة ألعاب أطفال", "غرفة خادمة", "خزائن ملابس", "غرفة تخزين", "وصول للحديقة"],
    },
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 30, x: 5, y: 5, label: { en: "Master Suite\n450 sq ft", ar: "الجناح الرئيسي\n٤٥٠ قدم²" } },
        { key: "bed2", w: 22, h: 22, x: 43, y: 5, label: { en: "Bedroom 2\n280 sq ft", ar: "غرفة ٢\n٢٨٠ قدم²" } },
        { key: "bed3", w: 22, h: 22, x: 68, y: 5, label: { en: "Bedroom 3\n260 sq ft", ar: "غرفة ٣\n٢٦٠ قدم²" } },
        { key: "living", w: 45, h: 28, x: 5, y: 38, label: { en: "Family Living\n780 sq ft", ar: "صالة عائلية\n٧٨٠ قدم²" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 38, label: { en: "Chef's Kitchen\n320 sq ft", ar: "مطبخ الشيف\n٣٢٠ قدم²" } },
        { key: "office", w: 18, h: 22, x: 80, y: 38, label: { en: "Kids Room\n180 sq ft", ar: "غرفة أطفال\n١٨٠ قدم²" } },
        { key: "balcony", w: 92, h: 16, x: 5, y: 72, label: { en: "Garden Terrace\n560 sq ft", ar: "تراس الحديقة\n٥٦٠ قدم²" } },
      ],
      specs: { bathrooms: "3+1", balconySize: "560 sq ft", totalArea: "3,200 sq ft" },
    },
    payment: { base: 5200000, plans: ["60/40", "70/30"] },
  },
  {
    id: "FR-4B-28",
    name: { en: "Grand Family Suite", ar: "الجناح العائلي الكبير" },
    floor: { en: "Floor 28–32", ar: "الطابق ٢٨-٣٢" },
    beds: { en: "4 Bedrooms + Maid", ar: "٤ غرف نوم + خادمة" }, bedNum: 4,
    baths: { en: "5 Bathrooms", ar: "٥ حمامات" },
    size: { en: "4,500 sq ft", ar: "٤,٥٠٠ قدم²" }, sizeNum: 4500,
    price: 8500000,
    priceDisplay: { en: "AED 8,500,000", ar: "٨,٥٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 8.5M", ar: "٨.٥ مليون درهم" },
    perSqft: { en: "AED 1,889/sq ft", ar: "١,٨٨٩ درهم/قدم²" },
    feature: { en: "Sea View + Community", ar: "إطلالة بحرية + مجتمع" },
    status: { en: "Available", ar: "متاح" }, statusColor: "#2D8F6F",
    category: { en: "Premium Family", ar: "عائلي فاخر" },
    view: { en: "Sea & Park Panoramic", ar: "بانورامية بحر وحديقة" },
    desc: {
      en: "An expansive 4-bedroom family suite with separate living and dining areas, home office, dedicated kids' wing with two connected bedrooms, and a wraparound terrace overlooking both the sea and community park.",
      ar: "جناح عائلي فسيح من ٤ غرف نوم مع صالة ومنطقة طعام منفصلة، مكتب منزلي، جناح أطفال مخصص بغرفتين متصلتين، وتراس محيطي يطل على البحر والحديقة المجتمعية.",
    },
    features: {
      en: ["Kids Wing", "Home Office", "Double Living", "Maid's Quarter", "Laundry Room"],
      ar: ["جناح الأطفال", "مكتب منزلي", "صالة مزدوجة", "غرفة الخادمة", "غرفة غسيل"],
    },
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 28, x: 5, y: 5, label: { en: "Master Suite\n520 sq ft", ar: "الجناح الرئيسي\n٥٢٠ قدم²" } },
        { key: "bed2", w: 20, h: 20, x: 43, y: 5, label: { en: "Bedroom 2\n300 sq ft", ar: "غرفة ٢\n٣٠٠ قدم²" } },
        { key: "bed3", w: 18, h: 20, x: 65, y: 5, label: { en: "Kids Room 1\n260 sq ft", ar: "غرفة أطفال ١\n٢٦٠ قدم²" } },
        { key: "bed4", w: 15, h: 20, x: 85, y: 5, label: { en: "Kids Room 2\n240 sq ft", ar: "غرفة أطفال ٢\n٢٤٠ قدم²" } },
        { key: "living", w: 40, h: 26, x: 5, y: 36, label: { en: "Family Living\n920 sq ft", ar: "صالة عائلية\n٩٢٠ قدم²" } },
        { key: "kitchen", w: 22, h: 20, x: 48, y: 36, label: { en: "Kitchen\n380 sq ft", ar: "مطبخ\n٣٨٠ قدم²" } },
        { key: "dining", w: 22, h: 18, x: 48, y: 58, label: { en: "Dining\n340 sq ft", ar: "طعام\n٣٤٠ قدم²" } },
        { key: "maid", w: 15, h: 20, x: 73, y: 36, label: { en: "Maid", ar: "خادمة" } },
        { key: "balcony", w: 92, h: 14, x: 5, y: 78, label: { en: "Sea & Park Terrace\n880 sq ft", ar: "تراس البحر والحديقة\n٨٨٠ قدم²" } },
      ],
      specs: { bathrooms: "4+1", balconySize: "880 sq ft", totalArea: "4,500 sq ft" },
    },
    payment: { base: 8500000, plans: ["60/40", "70/30"] },
  },
  {
    id: "FR-2B-10",
    name: { en: "Smart Start Home", ar: "البداية الذكية" },
    floor: { en: "Floor 10–15", ar: "الطابق ١٠-١٥" },
    beds: { en: "2 Bedrooms", ar: "غرفتا نوم" }, bedNum: 2,
    baths: { en: "3 Bathrooms", ar: "٣ حمامات" },
    size: { en: "1,800 sq ft", ar: "١,٨٠٠ قدم²" }, sizeNum: 1800,
    price: 2800000,
    priceDisplay: { en: "AED 2,800,000", ar: "٢,٨٠٠,٠٠٠ درهم" },
    priceShort: { en: "AED 2.8M", ar: "٢.٨ مليون درهم" },
    perSqft: { en: "AED 1,556/sq ft", ar: "١,٥٥٦ درهم/قدم²" },
    feature: { en: "Park & Playground View", ar: "إطلالة على الحديقة والملعب" },
    status: { en: "Last 5 Units", ar: "آخر ٥ وحدات" }, statusColor: "#C1121F",
    category: { en: "Starter Home", ar: "منزل البداية" },
    view: { en: "Park & Playground", ar: "حديقة وملعب" },
    desc: {
      en: "An ideal first family home with smart space design, open kitchen with dining area, generous balcony overlooking the children's playground, and access to all community amenities.",
      ar: "منزل عائلي أول مثالي بتصميم ذكي للمساحات، مطبخ مفتوح مع منطقة طعام، شرفة واسعة تطل على ملعب الأطفال، ووصول لجميع المرافق المجتمعية.",
    },
    features: {
      en: ["Smart Layout", "Open Kitchen", "Playground View", "Storage Unit", "Covered Parking"],
      ar: ["تصميم ذكي", "مطبخ مفتوح", "إطلالة الملعب", "وحدة تخزين", "موقف مغطى"],
    },
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master", w: 35, h: 32, x: 5, y: 5, label: { en: "Master Suite\n350 sq ft", ar: "الجناح الرئيسي\n٣٥٠ قدم²" } },
        { key: "bed2", w: 28, h: 28, x: 44, y: 5, label: { en: "Kids Room\n280 sq ft", ar: "غرفة الأطفال\n٢٨٠ قدم²" } },
        { key: "living", w: 45, h: 28, x: 5, y: 40, label: { en: "Living & Dining\n520 sq ft", ar: "معيشة وطعام\n٥٢٠ قدم²" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 40, label: { en: "Open Kitchen\n220 sq ft", ar: "مطبخ مفتوح\n٢٢٠ قدم²" } },
        { key: "balcony", w: 65, h: 14, x: 5, y: 72, label: { en: "Park Balcony\n280 sq ft", ar: "شرفة الحديقة\n٢٨٠ قدم²" } },
      ],
      specs: { bathrooms: "2+1", balconySize: "280 sq ft", totalArea: "1,800 sq ft" },
    },
    payment: { base: 2800000, plans: ["60/40", "70/30"] },
  },
];

const AMENITIES = {
  en: [
    { icon: "🏫", name: "International Schools", desc: "3 top-rated schools within walking distance" },
    { icon: "🌳", name: "Central Park", desc: "12-acre landscaped park with jogging tracks" },
    { icon: "🏊", name: "Family Pool Complex", desc: "Separate kids pool, adult pool & splash zone" },
    { icon: "👶", name: "Kids Club & Nursery", desc: "Supervised play areas & early learning center" },
    { icon: "🏋️", name: "Sports & Fitness", desc: "Tennis courts, gym & yoga studio" },
    { icon: "🛒", name: "Retail & Dining", desc: "Supermarket, cafés & family restaurants" },
    { icon: "🏥", name: "Medical Center", desc: "24/7 clinic with pediatric care" },
    { icon: "🚌", name: "School Bus Routes", desc: "Dedicated school bus pickup points" },
  ],
  ar: [
    { icon: "🏫", name: "مدارس دولية", desc: "٣ مدارس رائدة على مسافة مشي" },
    { icon: "🌳", name: "الحديقة المركزية", desc: "حديقة منسقة ١٢ فدان مع مسارات جري" },
    { icon: "🏊", name: "مجمع المسابح العائلية", desc: "مسبح أطفال ومسبح كبار ومنطقة رش" },
    { icon: "👶", name: "نادي الأطفال والحضانة", desc: "مناطق لعب مراقبة ومركز تعليم مبكر" },
    { icon: "🏋️", name: "رياضة ولياقة", desc: "ملاعب تنس وصالة رياضة ويوغا" },
    { icon: "🛒", name: "تسوق ومطاعم", desc: "سوبرماركت ومقاهي ومطاعم عائلية" },
    { icon: "🏥", name: "مركز طبي", desc: "عيادة ٢٤/٧ مع رعاية أطفال" },
    { icon: "🚌", name: "خطوط الحافلات المدرسية", desc: "نقاط توصيل حافلات مدرسية مخصصة" },
  ],
};

const INVEST = {
  en: [
    { label: "Rental Yield", value: "7.8%", note: "Family units premium" },
    { label: "Capital Growth", value: "19%", note: "3-year community appreciation" },
    { label: "Payment Plan", value: "60/40", note: "Family-friendly terms" },
    { label: "Handover", value: "Q2 2027", note: "On schedule" },
  ],
  ar: [
    { label: "عائد الإيجار", value: "٧.٨٪", note: "علاوة الوحدات العائلية" },
    { label: "نمو رأس المال", value: "١٩٪", note: "ارتفاع مجتمعي خلال ٣ سنوات" },
    { label: "خطة الدفع", value: "٦٠/٤٠", note: "شروط مناسبة للعائلات" },
    { label: "التسليم", value: "Q2 2027", note: "في الموعد المحدد" },
  ],
};

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85",
  community: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
};

const ROOM_COLORS = {
  master: "#457B9D", bed2: "#2ec4b6", bed3: "#7ECBB1", bed4: "#A8D8C5",
  living: "#6BA3C7", kitchen: "#8AADBD", dining: "#5B9DAF", office: "#2ec4b6",
  balcony: "#B8D4C5", pool: "#7EC8E3", maid: "#A3B8C5",
};

// ─── CSS ─────────────────────────────────────────────────────────

// ─── COMPONENT ───────────────────────────────────────────────────
export default function AhmedPortal() {
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
  const [form, setForm] = useState({ name: lang === "en" ? "Ahmed Al-Fahad" : "أحمد الفهد", email: "", phone: "", unit: "", date: "", time: "", notes: "" });
  const [formErr, setFormErr] = useState({});

  const resRef = useRef(null);
  const bookRef = useRef(null);
  const t = LANG[lang];


  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }); document.querySelectorAll(".ap-rv").forEach((el) => obs.observe(el)); return () => obs.disconnect(); }, [lang, modal, selectedUnit]);
  useEffect(() => { initSession({ cardId: 'VISTA002', visitorType: 'family', visitorName: 'Ahmed Al-Mansouri', portalName: 'Vista Family' }); trackEvent("portal_opened", { portal: "ahmed", language: lang }); }, []);

  const vipName = lang === "en" ? "Ahmed Al-Fahad" : "أحمد الفهد";
  const toggleLang = () => { const n = lang === "en" ? "ar" : "en"; setLang(n); trackEvent("language_switch", { to: n }); trackLegacy('language_switch', { to: n }); };
  const showToast = useCallback((msg, icon = "✓") => { setToastHiding(false); setToast({ msg, icon }); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);
  const fmtAED = (n) => lang === "en" ? `AED ${n.toLocaleString()}` : `${n.toLocaleString()} درهم`;

  const toggleCompare = (unitId) => { setCompareList((prev) => { if (prev.includes(unitId)) { showToast(t.toast.compareRemove, "↩"); return prev.filter((id) => id !== unitId); } if (prev.length >= 3) return prev; trackEvent("comparison_view", { unitId }); trackLegacy('comparison_view', { unitId }); showToast(t.toast.compare, "⚖️"); return [...prev, unitId]; }); };

  const openDetail = (unit) => { setSelectedUnit(unit); trackEvent("view_unit", { unitId: unit.id, unitName: unit.name.en, price: unit.price }); trackLegacy('view_unit', { unitId: unit.id, unitName: unit.name.en, price: unit.price }); };
  const openFloor = (unit) => { setModalUnit(unit); setModal("floorplan"); trackEvent("view_floorplan", { unitId: unit.id }); trackLegacy('view_floorplan', { unitId: unit.id }); showToast(t.toast.floorPlan, "📐"); };
  const openBrochure = (unit) => { setModalUnit(unit); setModal("brochure"); trackEvent("download_brochure", { unitId: unit.id }); trackLegacy('download_brochure', { unitId: unit.id }); showToast(t.toast.brochure, "📄"); };
  const openPayment = (unit) => { setModalUnit(unit); setModal("payment"); setPayPlan("60/40"); trackEvent("explore_payment_plan", { unitId: unit.id }); trackLegacy('explore_payment_plan', { unitId: unit.id }); };
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => { trackEvent("request_pricing", { unitId: unit.id, price: unit.price }); trackLegacy('request_pricing', { unitId: unit.id }); showToast(t.toast.pricing, "💰"); };
  const callAdvisor = () => { trackEvent("contact_advisor", { vipName }); trackLegacy('contact_advisor', {}); showToast(t.toast.advisorNotified, "📞"); };
  const closeAll = () => { setModal(null); setModalUnit(null); setSelectedUnit(null); };

  const validateForm = () => { const err = {}; if (!form.name.trim()) err.name = true; if (!form.email.trim() || !form.email.includes("@")) err.email = true; if (!form.phone.trim()) err.phone = true; setFormErr(err); return Object.keys(err).length === 0; };
  const submitBooking = () => { if (!validateForm()) return; const ref = "FAM-" + Date.now().toString(36).toUpperCase().slice(-6); trackEvent("book_viewing", { unitId: form.unit || "general", name: form.name || vipName }); trackLegacy('book_viewing', { unitId: form.unit || 'general', name: form.name }); setBookingRefVal(ref); setBookingOk(true); showToast(t.toast.booking, "📅"); };

  const getMilestones = (price, plan) => {
    if (plan === "60/40") return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#457B9D" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#6BA3C7" },
      { pct: 15, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#2ec4b6" },
      { pct: 25, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#2D8F6F" },
      { pct: 40, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#1A6B5A" },
    ];
    return [
      { pct: 10, label: t.paymentModal.m1, desc: t.paymentModal.m1d, color: "#457B9D" },
      { pct: 10, label: t.paymentModal.m2, desc: t.paymentModal.m2d, color: "#6BA3C7" },
      { pct: 20, label: t.paymentModal.m3, desc: t.paymentModal.m3d, color: "#2ec4b6" },
      { pct: 30, label: t.paymentModal.m4, desc: t.paymentModal.m4d, color: "#2D8F6F" },
      { pct: 10, label: t.paymentModal.m5, desc: t.paymentModal.m5d, color: "#1A6B5A" },
      { pct: 20, label: t.paymentModal.m6, desc: t.paymentModal.m6d, color: "#457B9D" },
    ];
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="ap" dir={t.dir}>
      <header className={`ap-hd ${scrolled ? "sc" : ""}`}>
        <div className="ap-logo">Vista <b>Family</b></div>
        <div className="ap-nav">
          <div className="ap-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (<button className="ap-navbtn" onClick={openCompare}>{t.nav.compare}<span className="ap-cmp-count">{compareList.length}</span></button>)}
          <button className="ap-navbtn" onClick={toggleLang}>{t.nav.lang}</button>
        </div>
      </header>

      <section className="ap-hero">
        <div className="ap-hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-ct">
          <div className="ap-pvt">{t.hero.badge}</div>
          <p className="ap-greet">{t.hero.greeting} <span>{vipName}</span></p>
          <h1 className="ap-htitle">{lang === "en" ? (<>Your Family's<br /><em>Dream</em> Residence</>) : (<>مسكن عائلتك<br /><em>المثالي</em></>)}</h1>
          <p className="ap-hdesc">{t.hero.subtitle}</p>
          <div className="ap-hacts">
            <button className="ap-btn-g" onClick={() => { trackEvent("cta_explore"); trackLegacy('cta_explore', {}); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta} →</button>
            <button className="ap-btn-o" onClick={() => { trackEvent("cta_booking"); trackLegacy('cta_booking', {}); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      <div className="ap-stats">
        {[{ v: "156", l: t.stats.units }, { v: "12", l: t.stats.schools }, { v: "8", l: t.stats.parks }, { v: "Q2 '27", l: t.stats.completion }].map((s, i) => (
          <div className="ap-stat" key={i}><div className="ap-stat-v">{s.v}</div><div className="ap-stat-l">{s.l}</div></div>
        ))}
      </div>

      <section className="ap-sec" ref={resRef}>
        <div className="ap-sh ap-rv"><span className="ap-sl">◆ {t.sections.residences}</span><h2 className="ap-st">{t.sections.residencesSub}</h2><p className="ap-ss">{t.sections.residencesHint}</p></div>
        <div className="ap-units">
          {UNITS.map((unit) => (
            <div className="ap-card ap-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="ap-card-img"><img src={unit.img} alt={unit.name[lang]} loading="lazy" /><div className="ap-card-fbadge">{unit.feature[lang]}</div><div className="ap-card-status" style={{ background: unit.statusColor }}>{unit.status[lang]}</div></div>
              <div className="ap-card-body"><h3 className="ap-card-name">{unit.name[lang]}</h3><p className="ap-card-floor">{unit.floor[lang]}</p><div className="ap-card-meta"><span>🛏 {unit.beds[lang]}</span><span>📐 {unit.size[lang]}</span></div><div className="ap-card-price">{unit.priceShort[lang]}</div><div className="ap-card-sqft">{unit.perSqft[lang]}</div></div>
              <div className="ap-card-acts" onClick={(e) => e.stopPropagation()}>
                <button className="ap-btn-o ap-btn-sm" onClick={() => openFloor(unit)}>📐 {t.unitActions.floorPlan}</button>
                <button className="ap-btn-o ap-btn-sm" onClick={() => openBrochure(unit)}>📄 {t.unitActions.brochure}</button>
                <button className="ap-btn-g ap-btn-sm" onClick={() => reqPricing(unit)}>💰 {t.unitActions.pricing}</button>
                <button className="ap-btn-o ap-btn-sm" onClick={() => toggleCompare(unit.id)} style={compareList.includes(unit.id) ? { borderColor: "#2ec4b6", color: "#2ec4b6", background: "rgba(46,196,182,0.1)" } : {}}>
                  {compareList.includes(unit.id) ? `✓ ${t.unitActions.compare}` : `⚖️ ${t.unitActions.compare}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      <section className="ap-sec ap-am-sec">
        <div className="ap-am-bg" style={{ backgroundImage: `url(${IMAGES.community})` }} />
        <div className="ap-sh ap-rv" style={{ position: "relative", zIndex: 2 }}><span className="ap-sl">◆ {t.sections.amenities}</span><h2 className="ap-st">{t.sections.amenitiesSub}</h2></div>
        <div className="ap-am-grid">{AMENITIES[lang].map((a, i) => (<div className="ap-am ap-rv" key={i}><div className="ap-am-icon">{a.icon}</div><div className="ap-am-name">{a.name}</div><div className="ap-am-desc">{a.desc}</div></div>))}</div>
      </section>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      <section className="ap-sec">
        <div className="ap-sh ap-rv"><span className="ap-sl">◆ {t.sections.investment}</span><h2 className="ap-st">{t.sections.investmentSub}</h2></div>
        <div className="ap-inv-grid">{INVEST[lang].map((item, i) => (<div className="ap-inv ap-rv" key={i}><div className="ap-inv-v">{item.value}</div><div className="ap-inv-l">{item.label}</div><div className="ap-inv-n">{item.note}</div></div>))}</div>

      </section>

      {/* ── ROI CALCULATOR BANNER ── */}
      <Link to="/enterprise/crmdemo/roi-calculator" className="ap-roi-banner" onClick={() => { trackEvent("roi_calculator_click"); trackLegacy('roi_calculator_click', {}); }}>
        <div className="ap-roi-icon">📊</div>
        <div className="ap-roi-content">
          <h3 className="ap-roi-title">{t.roiBanner.title}</h3>
          <p className="ap-roi-desc">{t.roiBanner.desc}</p>
        </div>
        <span className="ap-roi-cta">{t.roiBanner.cta}</span>
      </Link>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      <section className="ap-sec ap-contact" ref={bookRef}>
        <div className="ap-sh ap-rv"><span className="ap-sl">◆ {t.sections.contact}</span><h2 className="ap-st">{t.sections.contactSub}</h2><p className="ap-ss">{t.sections.contactHint}</p></div>
        {bookingOk ? (
          <div className="ap-book-ok ap-rv"><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div><h3>{t.booking.success}</h3><p>{t.booking.successDesc}</p><p style={{ color: "var(--ap-teal)", fontFamily: "var(--ap-serif)", fontSize: "1.2rem" }}>{t.booking.successRef}: {bookingRef}</p></div>
        ) : (
          <div className="ap-form ap-rv">
            <div className="ap-fg"><label className="ap-flabel">{t.booking.name}</label><input className={`ap-finput ${formErr.name ? "ap-err" : ""}`} type="text" defaultValue={vipName} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="ap-fg"><label className="ap-flabel">{t.booking.email}</label><input className={`ap-finput ${formErr.email ? "ap-err" : ""}`} type="text" inputMode="email" onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="ap-fg"><label className="ap-flabel">{t.booking.phone}</label><input className={`ap-finput ${formErr.phone ? "ap-err" : ""}`} type="text" inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="ap-fg"><label className="ap-flabel">{t.booking.preferred}</label><select className="ap-fsel" onChange={(e) => setForm({ ...form, unit: e.target.value })}><option value="">—</option>{UNITS.map((u) => (<option key={u.id} value={u.id}>{u.name[lang]} — {u.priceShort[lang]}</option>))}</select></div>
            <div className="ap-frow">
              <div className="ap-fg"><label className="ap-flabel">{t.booking.date}</label><input className="ap-finput" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="ap-fg"><label className="ap-flabel">{t.booking.time}</label><select className="ap-fsel" onChange={(e) => setForm({ ...form, time: e.target.value })}><option value="">—</option><option value="morning">{t.booking.morning}</option><option value="afternoon">{t.booking.afternoon}</option><option value="evening">{t.booking.evening}</option></select></div>
            </div>
            <div className="ap-fg"><label className="ap-flabel">{t.booking.notes}</label><input className="ap-finput" type="text" onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>{t.booking.submit} →</button>
            <p className="ap-fnote">{t.booking.note}</p>
          </div>
        )}
      </section>

      <footer className="ap-ft"><p>{t.footer}</p><p><span className="ap-ft-brand">{t.poweredBy} Dynamic NFC</span></p></footer>

      {/* ── UNIT DETAIL MODAL ── */}
      {selectedUnit && (
        <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" onClick={(e) => e.stopPropagation()}>
          <button className="ap-modal-x" onClick={closeAll}>✕</button>
          <div className="ap-md-gallery"><img src={selectedUnit.img} alt={selectedUnit.name[lang]} /><img src={IMAGES.hero} alt="View 2" /><img src={IMAGES.community} alt="View 3" /></div>
          <div className="ap-modal-body">
            <div className="ap-md-top"><div><h2 className="ap-md-title">{selectedUnit.name[lang]}</h2><p className="ap-md-floor">{selectedUnit.floor[lang]}</p></div><div style={{ textAlign: lang === "ar" ? "start" : "end" }}><div className="ap-md-price">{selectedUnit.priceDisplay[lang]}</div><div className="ap-md-sqft">{selectedUnit.perSqft[lang]}</div></div></div>
            <p className="ap-md-desc">{selectedUnit.desc[lang]}</p>
            <div className="ap-md-grid">
              <div className="ap-md-gi"><div className="ap-md-gi-l">{lang === "en" ? "Bedrooms" : "غرف النوم"}</div><div className="ap-md-gi-v">{selectedUnit.beds[lang]}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{lang === "en" ? "Bathrooms" : "الحمامات"}</div><div className="ap-md-gi-v">{selectedUnit.baths[lang]}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{lang === "en" ? "Living Area" : "المساحة"}</div><div className="ap-md-gi-v">{selectedUnit.size[lang]}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{lang === "en" ? "Status" : "الحالة"}</div><div className="ap-md-gi-v" style={{ background: selectedUnit.statusColor, color: "#fff", display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontSize: ".9rem" }}>{selectedUnit.status[lang]}</div></div>
            </div>
            <div className="ap-md-feats">{selectedUnit.features[lang].map((f, i) => (<span className="ap-md-feat" key={i}>{f}</span>))}</div>
            <div style={{ padding: "1.5rem", border: "1px solid var(--ap-glb)", borderRadius: "8px", background: "var(--ap-gl)" }}>
              <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{lang === "en" ? "Payment Plan" : "خطة الدفع"}</h4>
              <div className="ap-pay-bar"><div className="ap-pay-seg" style={{ flex: 10, background: "var(--ap-blue)" }} /><div className="ap-pay-seg" style={{ flex: 50, background: "var(--ap-teal)" }} /><div className="ap-pay-seg" style={{ flex: 40, background: "rgba(46,196,182,.35)" }} /></div>
              <div className="ap-pay-legend">
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "var(--ap-blue)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{lang === "en" ? "Down Payment" : "الدفعة الأولى"} (10%)</div><div className="ap-pay-amt">{fmtAED(selectedUnit.price * 0.1)}</div></div></div>
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "var(--ap-teal)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{lang === "en" ? "During Construction" : "خلال البناء"} (50%)</div><div className="ap-pay-amt">{fmtAED(selectedUnit.price * 0.5)}</div></div></div>
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "rgba(46,196,182,.35)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{lang === "en" ? "On Handover" : "عند التسليم"} (40%)</div><div className="ap-pay-amt">{fmtAED(selectedUnit.price * 0.4)}</div></div></div>
              </div>
            </div>
            <div className="ap-md-acts">
              <button className="ap-btn-g ap-btn-sm" onClick={() => { closeAll(); openFloor(selectedUnit); }}>📐 {t.unitActions.floorPlan}</button>
              <button className="ap-btn-g ap-btn-sm" onClick={() => { closeAll(); openBrochure(selectedUnit); }}>📄 {t.unitActions.brochure}</button>
              <button className="ap-btn-o ap-btn-sm" onClick={() => reqPricing(selectedUnit)}>💰 {t.unitActions.pricing}</button>
              <button className="ap-btn-o ap-btn-sm" onClick={() => { closeAll(); openPayment(selectedUnit); }}>📊 {t.unitActions.payment}</button>
              <button className="ap-btn-o ap-btn-sm" onClick={() => { closeAll(); setTimeout(() => bookRef.current?.scrollIntoView({ behavior: "smooth" }), 300); }}>📅 {t.unitActions.book}</button>
              <button className="ap-btn-o ap-btn-sm" onClick={callAdvisor}>📞 {t.unitActions.callAdvisor}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* ── FLOOR PLAN MODAL ── */}
      {modal === "floorplan" && modalUnit && (
        <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
          <button className="ap-modal-x" onClick={closeAll}>✕</button>
          <div className="ap-modal-body">
            <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name[lang]}</h2>
            <p style={{ color: "var(--ap-teal)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor[lang]}</p>
            <svg className="ap-fp-svg" viewBox="0 0 100 65" style={{ background: "var(--ap-ch)" }}>
              {modalUnit.floorPlan.rooms.map((room, i) => (<g key={i}><rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#666"} fillOpacity="0.2" stroke={ROOM_COLORS[room.key] || "#666"} strokeWidth="0.3" rx="0.5" />{room.label[lang].split("\n").map((line, li) => (<text key={li} x={room.x + room.w / 2} y={room.y + room.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fill={ROOM_COLORS[room.key] || "#aaa"} fontSize="2.2" fontFamily="Outfit, sans-serif" fontWeight={li === 0 ? "500" : "300"}>{line}</text>))}</g>))}
            </svg>
            <div className="ap-fp-specs">
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.bathrooms}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.bathrooms}</div></div>
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.balcony}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.balconySize}</div></div>
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.totalArea}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.totalArea}</div></div>
            </div>
            <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "Floor plan PDF downloading..." : "جاري تحميل المخطط...", "📥")}>{t.floorPlanModal.download}</button>
            <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--ap-t3)", marginTop: "1rem" }}>{t.floorPlanModal.disclaimer}</p>
          </div>
        </div></div>
      )}

      {/* ── BROCHURE MODAL ── */}
      {modal === "brochure" && modalUnit && (
        <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" style={{ maxWidth: "550px" }} onClick={(e) => e.stopPropagation()}>
          <button className="ap-modal-x" onClick={closeAll}>✕</button>
          <div className="ap-modal-body" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
            <div className="ap-br-prog"><div className="ap-br-fill" /></div>
            <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: ".5rem" }}>{t.brochureModal.ready}</h2>
            <p style={{ color: "var(--ap-t2)", fontSize: ".95rem", marginBottom: "1.5rem" }}>{t.brochureModal.desc}</p>
            <p style={{ color: "var(--ap-teal)", fontSize: ".85rem", fontWeight: 500, marginBottom: ".5rem" }}>{t.brochureModal.includes}</p>
            <div className="ap-br-items" style={{ textAlign: "start" }}>{t.brochureModal.items.map((item, i) => (<div className="ap-br-item" key={i}>{item}</div>))}</div>
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
              <button className="ap-btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(lang === "en" ? "Brochure PDF downloading..." : "جاري تحميل الكتيب...", "📥")}>{t.brochureModal.download}</button>
              <button className="ap-btn-o" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.emailSent, "📧")}>{t.brochureModal.email}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {modal === "payment" && modalUnit && (() => {
        const milestones = getMilestones(modalUnit.payment.base, payPlan);
        return (
          <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <button className="ap-modal-x" onClick={closeAll}>✕</button>
            <div className="ap-modal-body">
              <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.paymentModal.title}</h2>
              <p style={{ color: "var(--ap-t2)", fontSize: ".9rem", marginBottom: ".5rem" }}>{t.paymentModal.subtitle}</p>
              <p style={{ fontFamily: "var(--ap-serif)", fontSize: "2rem", color: "var(--ap-teal)", marginBottom: "2rem" }}>{t.paymentModal.totalPrice}: {fmtAED(modalUnit.payment.base)}</p>
              <div className="ap-pm-tabs">
                <button className={`ap-pm-tab ${payPlan === "60/40" ? "active" : ""}`} onClick={() => setPayPlan("60/40")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan6040}</div><div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan6040Desc}</div></button>
                <button className={`ap-pm-tab ${payPlan === "70/30" ? "active" : ""}`} onClick={() => setPayPlan("70/30")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan7030}</div><div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan7030Desc}</div></button>
              </div>
              <div className="ap-pay-bar" style={{ height: "10px" }}>{milestones.map((m, i) => (<div key={i} className="ap-pay-seg" style={{ flex: m.pct, background: m.color }} />))}</div>
              <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", margin: "1.5rem 0 1rem" }}>{t.paymentModal.milestones}</h4>
              <div className="ap-pm-ms">{milestones.map((m, i) => (<div className="ap-pm-m" key={i}><div className="ap-pm-m-dot" style={{ background: m.color }} /><div className="ap-pm-m-info"><div className="ap-pm-m-label">{m.label}</div><div className="ap-pm-m-desc">{m.desc}</div></div><div style={{ textAlign: "end" }}><div className="ap-pm-m-pct">{m.pct}%</div><div className="ap-pm-m-val">{fmtAED(modalUnit.payment.base * m.pct / 100)}</div></div></div>))}</div>
              <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center", marginTop: "2rem" }} onClick={() => showToast(t.toast.advisorNotified, "📞")}>{t.paymentModal.requestCall}</button>
              <p style={{ textAlign: "center", fontSize: ".72rem", color: "var(--ap-t3)", marginTop: "1rem" }}>{t.paymentModal.disclaimer}</p>
            </div>
          </div></div>
        );
      })()}

      {/* ── COMPARE MODAL ── */}
      {modal === "compare" && (
        <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
          <button className="ap-modal-x" onClick={closeAll}>✕</button>
          <div className="ap-modal-body">
            <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: "2rem" }}>{t.compareModal.title}</h2>
            {compareList.length === 0 ? (<div className="ap-cmp-empty">{t.compareModal.empty}</div>) : (() => {
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
              return (<div className="ap-cmp-grid">
                <div className="ap-cmp-row hdr" style={{ gridTemplateColumns: cols }}><div>{t.compareModal.feature}</div>{units.map((u) => (<div key={u.id} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--ap-serif)", fontSize: "1rem", color: "var(--ap-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{u.name[lang]}</div><button className="ap-cmp-rm" onClick={() => toggleCompare(u.id)}>{t.compareModal.remove}</button></div>))}</div>
                {rows.map((row, ri) => (<div className="ap-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}><div className="ap-cmp-label">{row.label}</div>{units.map((u) => (<div className="ap-cmp-val" key={u.id}>{row.get(u)}</div>))}</div>))}
              </div>);
            })()}
          </div>
        </div></div>
      )}

      {toast && (<div className={`ap-toast ${toastHiding ? "hiding" : ""}`}><span>{toast.icon}</span> {toast.msg}</div>)}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import './VIPPortal.css';
import '../../i18n/portals/vipPortal';
import SEO from '../../components/SEO/SEO';
// ═══════════════════════════════════════════════════════════════════
// VIP PORTAL — DEFINITIVE EDITION
// ═══════════════════════════════════════════════════════════════════
// Merges: Luxury's editorial design + Full's rich data + v2.0's features
// Design: Gulf Luxury dark (DAMAC/Omniyat/Emaar)
// Features: Unit Detail Modal, Floor Plans, Brochures, Payment Plans,
//           Comparison, CRM Tracking, Booking with Validation, Toasts
// Zero Dead Ends — every button does something meaningful
// ═══════════════════════════════════════════════════════════════════

// ─── BILINGUAL CONTENT ───────────────────────────────────────────
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP access", lang: "العربية", compare: "Compare" },
    hero: {
      badge: "Private invitation",
      welcomeMale: "Welcome,",
      welcomeFemale: "Welcome,",
      tagline: "Your exclusive residence awaits",
      subtitle: "A curated selection of premium residences, handpicked for discerning investors who demand nothing less than extraordinary.",
      cta: "Explore residences",
      ctaSecondary: "Schedule private viewing",
    },
    stats: { units: "Premium units", floors: "Floors of luxury", roi: "Projected ROI", completion: "Completion" },
    roiBanner: {
      title: "Calculate your investment returns",
      desc: "Use our interactive ROI calculator to project your returns based on property value, rental income, appreciation rates, and financing options.",
      cta: "Open ROI calculator →",
    },
    sections: {
      residences: "The residences",
      residencesSub: "Where vision meets the skyline",
      residencesHint: "Select any residence to explore full details",
      amenities: "The lifestyle",
      amenitiesSub: "Curated experiences beyond the ordinary",
      investment: "The opportunity",
      investmentSub: "Strategic value in every detail",
      contact: "Private consultation",
      contactSub: "Schedule your private viewing",
      contactHint: "Your dedicated advisor will arrange an exclusive tour",
    },
    unitActions: {
      viewDetails: "View details",
      floorPlan: "Floor plan",
      brochure: "Brochure",
      pricing: "Request pricing",
      book: "Book viewing",
      compare: "Compare",
      payment: "Payment plan",
      callAdvisor: "Call advisor",
    },
    floorPlanModal: {
      title: "Floor plan",
      bedrooms: "Bedrooms",
      living: "Living area",
      balcony: "Balcony / terrace",
      kitchen: "Kitchen",
      master: "Master suite",
      bathrooms: "Bathrooms",
      totalArea: "Total area",
      download: "Download floor plan PDF",
      disclaimer: "Floor plans are indicative and may vary. Actual dimensions confirmed upon handover.",
    },
    brochureModal: {
      title: "Digital brochure",
      downloading: "Preparing your brochure...",
      ready: "Brochure ready",
      desc: "Your personalized digital brochure has been prepared with exclusive details.",
      download: "Download brochure PDF",
      email: "Send to email",
      includes: "Brochure includes:",
      items: ["Detailed floor plans & specifications", "Premium finishes catalog", "Amenity & lifestyle overview", "Investment analysis & payment plans", "Location & connectivity map"],
    },
    paymentModal: {
      title: "Payment plan",
      subtitle: "Flexible payment structure designed for investors",
      totalPrice: "Total price",
      plan6040: "60/40 plan",
      plan6040Desc: "60% during construction · 40% on handover",
      plan7030: "70/30 plan",
      plan7030Desc: "70% during construction · 30% post-handover (12 months)",
      milestones: "Payment milestones",
      m1: "Booking deposit", m1d: "Upon reservation",
      m2: "First installment", m2d: "Within 30 days",
      m3: "Construction 30%", m3d: "Upon 30% completion",
      m4: "Construction 60%", m4d: "Upon 60% completion",
      m5: "Handover", m5d: "Upon key handover",
      m6: "Post-handover", m6d: "12 months after handover",
      requestCall: "Request payment consultation",
      disclaimer: "Payment plans subject to approval. Terms may vary based on unit selection.",
    },
    compareModal: {
      title: "Compare residences",
      feature: "Feature",
      remove: "Remove",
      price: "Price", floor: "Floor", bedrooms: "Bedrooms",
      size: "Size", view: "View", category: "Category",
      empty: "Add residences to compare by clicking the ⚖️ icon on unit cards.",
    },
    booking: {
      name: "Full name", email: "Email address", phone: "Phone number",
      preferred: "Preferred residence", date: "Preferred date", time: "Preferred time",
      notes: "Additional notes", submit: "Request private viewing",
      note: "Your information is protected. We will contact you within 24 hours.",
      morning: "Morning (9AM-12PM)", afternoon: "Afternoon (12PM-4PM)", evening: "Evening (4PM-7PM)",
      success: "Viewing request submitted",
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
    nav: { vip: "الوصول كبار الشخصيات", lang: "العربية", compare: "المقارنة" },
    hero: {
      badge: "دعوة خاصة",
      welcomeMale: "مرحبًا،",
      welcomeFemale: "مرحبًا،",
      tagline: "وحدتك الحصرية في انتظارك",
      subtitle: "مجموعة مختارة من الوحدات الفاخرة، بعنايةٍ لمن يبحثون عن ما يفوق العادي.",
      cta: "استكشاف الوحدات",
      ctaSecondary: "جدولة زيارة خاصة",
    },
    stats: { units: "الوحدات المميزة", floors: "طوابق من الفخامة", roi: "العائد المتوقع على الاستثمار", completion: "الانتهاء" },
    roiBanner: {
      title: "احسب عائد استثمارك",
      desc: "استخدم حاسبة العائد التفاعلية لتقدير عائدك بناءً على قيمة العقار ودخل الإيجار ونمو رأس المال وخيارات التمويل.",
      cta: "← افتح حاسبة العائد",
    },
    sections: {
      residences: "الوحدات السكنية",
      residencesSub: "حيث تلتقي الرؤية بأفق المدينة",
      residencesHint: "اختر أي وحدة لاستكشاف التفاصيل الكاملة",
      amenities: "أسلوب الحياة",
      amenitiesSub: "تجارب مختارة تتجاوز المألوف",
      investment: "الفرصة",
      investmentSub: "القيمة الاستراتيجية في كل تفصيلة",
      contact: "استشارة خاصة",
      contactSub: "جدولة زيارتك الخاصة",
      contactHint: "سيقوم مستشارك المخصص بترتيب جولة حصرية",
    },
    unitActions: {
      viewDetails: "عرض التفاصيل",
      floorPlan: "مخطط الطابق",
      brochure: "الكتيب",
      pricing: "طلب الأسعار",
      book: "حجز زيارة",
      compare: "مقارنة",
      payment: "خطة الدفع",
      callAdvisor: "الاتصال بالمستشار",
    },
    floorPlanModal: {
      title: "المخطط الطابقي",
      bedrooms: "غرف النوم", living: "غرفة المعيشة", balcony: "شرفة / تراس",
      kitchen: "المطبخ", master: "الجناح الرئيسي", bathrooms: "الحمامات",
      totalArea: "المساحة الإجمالية", download: "تحميل مخطط الطابق PDF",
      disclaimer: "المخططات إرشادية وقد تختلف. الأبعاد الفعلية تُؤكد عند التسليم.",
    },
    brochureModal: {
      title: "الكتيب الرقمي",
      downloading: "جارٍ إعداد كتيبك…",
      ready: "الكتيب جاهز",
      desc: "تم إعداد كتيبك الرقمي المخصص مع تفاصيل حصرية.",
      download: "تحميل الكتيب PDF", email: "إرسال إلى البريد الإلكتروني",
      includes: "الكتيب يشمل:",
      items: ["مخططات تفصيلية ومواصفات", "كتالوج التشطيبات الفاخرة", "نظرة على المرافق ونمط الحياة", "تحليل استثماري وخطط الدفع", "خريطة الموقع والاتصال"],
    },
    paymentModal: {
      title: "خطة الدفع",
      subtitle: "هيكل دفع مرن مصمم للمستثمرين",
      totalPrice: "السعر الإجمالي",
      plan6040: "خطة 60/40", plan6040Desc: "60٪ أثناء البناء · 40٪ عند التسليم",
      plan7030: "خطة 70/30", plan7030Desc: "70٪ أثناء البناء · 30٪ بعد التسليم (12 شهرًا)",
      milestones: "معالم الدفع",
      m1: "دفعة الحجز", m1d: "عند الحجز",
      m2: "الدفعة الأولى", m2d: "خلال 30 يومًا",
      m3: "البناء 30٪", m3d: "عند اكتمال 30٪",
      m4: "البناء 60٪", m4d: "عند اكتمال 60٪",
      m5: "التسليم", m5d: "عند تسليم المفتاح",
      m6: "ما بعد التسليم", m6d: "12 شهرًا بعد التسليم",
      requestCall: "طلب استشارة الدفع",
      disclaimer: "خطط الدفع تخضع للموافقة. قد تختلف الشروط حسب الوحدة المختارة.",
    },
    compareModal: {
      title: "مقارنة المساكن",
      feature: "الميزة", remove: "إزالة",
      price: "السعر", floor: "الطابق", bedrooms: "غرف النوم",
      size: "الحجم", view: "عرض", category: "الفئة",
      empty: "أضف وحدات للمقارنة بالنقر على أيقونة ⚖️ على بطاقات الوحدات.",
    },
    booking: {
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      preferred: "الإقامة المفضلة", date: "التاريخ المفضل", time: "الوقت المفضل",
      notes: "ملاحظات إضافية", submit: "طلب زيارة خاصة",
      note: "يتم حماية معلوماتك. سنتواصل معك خلال 24 ساعة.",
      morning: "الصباح (9ص-12م)", afternoon: "بعد الظهر(12م - 4م)", evening: "المساء (4م-7م)",
      success: "تم تقديم طلب الزيارة",
      successDesc: "شكرًا لك! سيتواصل معك المستشار المخصص خلال 24 ساعة لتأكيد زيارتك الخاصة.",
      successRef: "المرجع",
    },
    toast: {
      floorPlan: "تم فتح المخطط",
      brochure: "تم تحميل الكتيب",
      pricing: "تم إرسال طلب التسعير — تحقق من بريدك",
      booking: "تم تقديم طلب زيارة خاصة",
      compare: "تمت الإضافة للمقارنة",
      compareRemove: "تمت إزالته من المقارنة",
      emailSent: "تم إرسال الكتيب إلى بريدك الإلكتروني",
      advisorNotified: "تم إخطار مستشارك المخصص",
    },
    footer: "هذه بوابة خاصة. المحتوى مخصص للوصول الحصري لك.",
    poweredBy: "مشغل بواسطة",
  },
  es: {
    dir: "ltr",
    nav: { vip: "Acceso VIP", lang: "English", compare: "Comparar" },
    hero: {
      badge: "Invitación privada",
      welcomeMale: "Bienvenido,",
      welcomeFemale: "Bienvenida,",
      tagline: "Su residencia exclusiva le espera",
      subtitle: "Una selección curada de residencias premium, escogidas a mano para inversionistas exigentes que no aceptan menos que lo extraordinario.",
      cta: "Explorar residencias",
      ctaSecondary: "Agendar visita privada",
    },
    stats: { units: "Residencias premium", floors: "Pisos de lujo", roi: "ROI proyectado", completion: "Entrega" },
    roiBanner: {
      title: "Calcule el rendimiento de su inversión",
      desc: "Use nuestra calculadora interactiva de ROI para proyectar sus rendimientos según el valor de la propiedad, ingresos por renta, tasas de plusvalía y opciones de financiamiento.",
      cta: "Abrir calculadora ROI →",
    },
    sections: {
      residences: "Las residencias",
      residencesSub: "Donde la visión se encuentra con el horizonte",
      residencesHint: "Seleccione cualquier residencia para explorar todos los detalles",
      amenities: "El estilo de vida",
      amenitiesSub: "Experiencias curadas más allá de lo ordinario",
      investment: "La oportunidad",
      investmentSub: "Valor estratégico en cada detalle",
      contact: "Consulta privada",
      contactSub: "Agende su visita privada",
      contactHint: "Su asesor dedicado organizará un recorrido exclusivo",
    },
    unitActions: {
      viewDetails: "Ver detalles",
      floorPlan: "Plano",
      brochure: "Catálogo",
      pricing: "Solicitar precio",
      book: "Reservar visita",
      compare: "Comparar",
      payment: "Plan de pago",
      callAdvisor: "Llamar al asesor",
    },
    floorPlanModal: {
      title: "Plano de planta",
      bedrooms: "Recámaras",
      living: "Sala",
      balcony: "Balcón / terraza",
      kitchen: "Cocina",
      master: "Recámara principal",
      bathrooms: "Baños",
      totalArea: "Superficie total",
      download: "Descargar plano en PDF",
      disclaimer: "Los planos son indicativos y pueden variar. Las dimensiones finales se confirman a la entrega.",
    },
    brochureModal: {
      title: "Catálogo digital",
      downloading: "Preparando su catálogo...",
      ready: "Catálogo listo",
      desc: "Su catálogo digital personalizado ha sido preparado con detalles exclusivos.",
      download: "Descargar catálogo en PDF",
      email: "Enviar por correo",
      includes: "El catálogo incluye:",
      items: ["Planos detallados y especificaciones", "Catálogo de acabados premium", "Vista general de amenidades y estilo de vida", "Análisis de inversión y planes de pago", "Mapa de ubicación y conectividad"],
    },
    paymentModal: {
      title: "Plan de pago",
      subtitle: "Estructura de pago flexible diseñada para inversionistas",
      totalPrice: "Precio total",
      plan6040: "Plan 60/40",
      plan6040Desc: "60% durante construcción · 40% a la entrega",
      plan7030: "Plan 70/30",
      plan7030Desc: "70% durante construcción · 30% post-entrega (12 meses)",
      milestones: "Hitos de pago",
      m1: "Depósito de reserva", m1d: "Al reservar",
      m2: "Primer abono", m2d: "Dentro de 30 días",
      m3: "Construcción 30%", m3d: "Al alcanzar 30%",
      m4: "Construcción 60%", m4d: "Al alcanzar 60%",
      m5: "Entrega", m5d: "Al entregar llaves",
      m6: "Post-entrega", m6d: "12 meses después de la entrega",
      requestCall: "Solicitar consulta de pago",
      disclaimer: "Los planes de pago están sujetos a aprobación. Las condiciones pueden variar según la unidad seleccionada.",
    },
    compareModal: {
      title: "Comparar residencias",
      feature: "Característica",
      remove: "Quitar",
      price: "Precio", floor: "Piso", bedrooms: "Recámaras",
      size: "Superficie", view: "Vista", category: "Categoría",
      empty: "Agregue residencias para comparar haciendo clic en el ícono ⚖️ de las tarjetas.",
    },
    booking: {
      name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono",
      preferred: "Residencia preferida", date: "Fecha preferida", time: "Horario preferido",
      notes: "Notas adicionales", submit: "Solicitar visita privada",
      note: "Su información está protegida. Le contactaremos en un plazo de 24 horas.",
      morning: "Mañana (9-12)", afternoon: "Tarde (12-16)", evening: "Noche (16-19)",
      success: "Solicitud de visita enviada",
      successDesc: "¡Gracias! Su asesor dedicado le contactará en un plazo de 24 horas para confirmar su visita privada.",
      successRef: "Referencia",
    },
    toast: {
      floorPlan: "Plano abierto",
      brochure: "Catálogo descargado",
      pricing: "Solicitud de precio enviada — revise su correo",
      booking: "Solicitud de visita privada enviada",
      compare: "Agregado a la comparación",
      compareRemove: "Quitado de la comparación",
      emailSent: "Catálogo enviado a su correo",
      advisorNotified: "Su asesor dedicado ha sido notificado",
    },
    footer: "Este es un portal privado. El contenido está personalizado para su acceso exclusivo.",
    poweredBy: "Tecnología de",
  },
  fr: {
    dir: "ltr",
    nav: { vip: "Accès VIP", lang: "English", compare: "Comparer" },
    hero: {
      badge: "Invitation privée",
      welcomeMale: "Bienvenue,",
      welcomeFemale: "Bienvenue,",
      tagline: "Votre résidence exclusive vous attend",
      subtitle: "Une sélection raffinée de résidences haut de gamme, choisies avec soin pour les investisseurs avertis qui n'acceptent rien de moins que l'extraordinaire.",
      cta: "Explorer les résidences",
      ctaSecondary: "Planifier une visite privée",
    },
    stats: { units: "Résidences premium", floors: "Étages de luxe", roi: "ROI projeté", completion: "Livraison" },
    roiBanner: {
      title: "Calculez le rendement de votre investissement",
      desc: "Utilisez notre calculateur de ROI interactif pour projeter vos rendements selon la valeur de la propriété, les revenus locatifs, les taux d'appréciation et les options de financement.",
      cta: "Ouvrir le calculateur ROI →",
    },
    sections: {
      residences: "Les résidences",
      residencesSub: "Là où la vision rencontre l'horizon",
      residencesHint: "Sélectionnez une résidence pour explorer tous les détails",
      amenities: "L'art de vivre",
      amenitiesSub: "Des expériences raffinées au-delà de l'ordinaire",
      investment: "L'opportunité",
      investmentSub: "Une valeur stratégique dans chaque détail",
      contact: "Consultation privée",
      contactSub: "Planifiez votre visite privée",
      contactHint: "Votre conseiller dédié organisera une visite exclusive",
    },
    unitActions: {
      viewDetails: "Voir les détails",
      floorPlan: "Plan d'étage",
      brochure: "Brochure",
      pricing: "Demander le prix",
      book: "Réserver une visite",
      compare: "Comparer",
      payment: "Plan de paiement",
      callAdvisor: "Appeler le conseiller",
    },
    floorPlanModal: {
      title: "Plan d'étage",
      bedrooms: "Chambres",
      living: "Salon",
      balcony: "Balcon / terrasse",
      kitchen: "Cuisine",
      master: "Suite principale",
      bathrooms: "Salles de bain",
      totalArea: "Superficie totale",
      download: "Télécharger le plan en PDF",
      disclaimer: "Les plans sont indicatifs et peuvent varier. Les dimensions finales sont confirmées à la livraison.",
    },
    brochureModal: {
      title: "Brochure numérique",
      downloading: "Préparation de votre brochure...",
      ready: "Brochure prête",
      desc: "Votre brochure numérique personnalisée a été préparée avec des détails exclusifs.",
      download: "Télécharger la brochure en PDF",
      email: "Envoyer par courriel",
      includes: "La brochure comprend :",
      items: ["Plans détaillés et spécifications", "Catalogue des finitions haut de gamme", "Aperçu des commodités et de l'art de vivre", "Analyse d'investissement et plans de paiement", "Carte d'emplacement et de connectivité"],
    },
    paymentModal: {
      title: "Plan de paiement",
      subtitle: "Structure de paiement flexible conçue pour les investisseurs",
      totalPrice: "Prix total",
      plan6040: "Plan 60/40",
      plan6040Desc: "60 % pendant la construction · 40 % à la livraison",
      plan7030: "Plan 70/30",
      plan7030Desc: "70 % pendant la construction · 30 % après livraison (12 mois)",
      milestones: "Jalons de paiement",
      m1: "Dépôt de réservation", m1d: "À la réservation",
      m2: "Premier versement", m2d: "Dans les 30 jours",
      m3: "Construction 30 %", m3d: "À 30 % d'achèvement",
      m4: "Construction 60 %", m4d: "À 60 % d'achèvement",
      m5: "Livraison", m5d: "À la remise des clés",
      m6: "Après livraison", m6d: "12 mois après la livraison",
      requestCall: "Demander une consultation de paiement",
      disclaimer: "Les plans de paiement sont sujets à approbation. Les conditions peuvent varier selon l'unité choisie.",
    },
    compareModal: {
      title: "Comparer les résidences",
      feature: "Caractéristique",
      remove: "Retirer",
      price: "Prix", floor: "Étage", bedrooms: "Chambres",
      size: "Superficie", view: "Vue", category: "Catégorie",
      empty: "Ajoutez des résidences à comparer en cliquant sur l'icône ⚖️ des cartes.",
    },
    booking: {
      name: "Nom complet", email: "Adresse courriel", phone: "Téléphone",
      preferred: "Résidence préférée", date: "Date préférée", time: "Heure préférée",
      notes: "Notes supplémentaires", submit: "Demander une visite privée",
      note: "Vos informations sont protégées. Nous vous contacterons dans les 24 heures.",
      morning: "Matin (9 h - 12 h)", afternoon: "Après-midi (12 h - 16 h)", evening: "Soir (16 h - 19 h)",
      success: "Demande de visite envoyée",
      successDesc: "Merci ! Votre conseiller dédié vous contactera dans les 24 heures pour confirmer votre visite privée.",
      successRef: "Référence",
    },
    toast: {
      floorPlan: "Plan ouvert",
      brochure: "Brochure téléchargée",
      pricing: "Demande de prix envoyée — vérifiez votre courriel",
      booking: "Demande de visite privée envoyée",
      compare: "Ajouté à la comparaison",
      compareRemove: "Retiré de la comparaison",
      emailSent: "Brochure envoyée à votre courriel",
      advisorNotified: "Votre conseiller dédié a été notifié",
    },
    footer: "Ceci est un portail privé. Le contenu est personnalisé pour votre accès exclusif.",
    poweredBy: "Propulsé par",
  },
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function VIPPortal() {
  const [lang, setLang] = useState("en");
  const { projectName, fmtCurrency, vipPersona, region, luxuryUnits, amenities, investStats, unitMedia } = usePortalRegion("real_estate", lang);
  const trackEvent = useCallback(
    (event, data) => trackPortalEvent("vip", vipPersona, event, data),
    [vipPersona]
  );
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
  const [form, setForm] = useState({ name: vipPersona?.name || "", email: "", phone: "", unit: "", date: "", time: "", notes: "" });
  const [formErr, setFormErr] = useState({});

  const resRef = useRef(null);
  const bookRef = useRef(null);
  const t = LANG[lang];

  const withExtras = (unit) => ({ ...unit, ...unitMedia[unit.id] });
  const units = luxuryUnits.map(withExtras);

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

  // Track page load + sync document root for global CSS / Tabler
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    trackEvent("portal_opened", { language: "en" });
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, []);

  const vipName = vipPersona?.name || "VIP Guest";
  const nextLang = region.languages.find((l) => l !== lang) || region.languages[0];
  const toggleLang = () => {
    const n = region.languages.find((l) => l !== lang) || region.languages[0];
    setLang(n);
    document.documentElement.lang = n;
    document.documentElement.dir = n === "ar" ? "rtl" : "ltr";
    trackEvent("language_switch", { to: n });
  };

  // Toast
  const showToast = useCallback((msg, icon = "✓") => {
    setToastHiding(false);
    setToast({ msg, icon });
    setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000);
  }, []);

  // Format AED
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
  const openDetail = (unit) => {
    setSelectedUnit(unit);
    trackEvent("view_unit", {
      unitId: unit.id,
      unitName: unit.nameEn,
      price: unit.priceBase,
      tower: unit.tower || "Al Qamar",
      unitType: unit.type || "penthouse",
    });
  };
  const openFloor = (unit) => {
    setModalUnit(unit);
    setModal("floorplan");
    trackEvent("view_floorplan", {
      unitId: unit.id,
      unitName: unit.nameEn,
      tower: unit.tower || "Al Qamar",
      unitType: unit.type || "penthouse",
    });
    showToast(t.toast.floorPlan, "📐");
  };
  const openBrochure = (unit) => {
    setModalUnit(unit);
    setModal("brochure");
    trackEvent("download_brochure", {
      unitId: unit.id,
      unitName: unit.nameEn,
      tower: unit.tower || "Al Qamar",
      unitType: unit.type || "penthouse",
    });
    showToast(t.toast.brochure, "📄");
  };
  const openPayment = (unit) => {
    setModalUnit(unit);
    setModal("payment");
    setPayPlan("60/40");
    trackEvent("explore_payment_plan", {
      unitId: unit.id,
      unitName: unit.nameEn,
      tower: unit.tower || "Al Qamar",
      unitType: unit.type || "penthouse",
    });
  };
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => {
    trackEvent("request_pricing", {
      unitId: unit.id,
      unitName: unit.nameEn,
      price: unit.priceBase,
      tower: unit.tower || "Al Qamar",
      unitType: unit.type || "penthouse",
    });
    showToast(t.toast.pricing, "💰");
  };
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
      <SEO
        title="VIP Real Estate Portal"
        description="Exclusive VIP real estate portal with personalized residences, floor plans, brochures, and booking."
        path="/enterprise/crmdemo/khalid"
      />
      {/* ── HEADER ── */}
      <div className="vp-crossnav" style={{ top: scrolled ? "0" : "-40px" }}>
        <Link to="/enterprise/crmdemo">← Demo Hub</Link>
        <span className="active">VIP Portal</span>
        <Link to="/enterprise/crmdemo/ahmed">Ahmed Portal</Link>
        <Link to="/enterprise/crmdemo/marketplace">Marketplace</Link>
        <Link to="/unified">Dashboard</Link>
        <Link to="/enterprise/crmdemo/ai-demo">AI Pipeline</Link>
        <span className="crossnav-persona">👤 {vipName}</span>
      </div>
      <header className={`vp-hd ${scrolled ? "sc" : ""}`}>
        <div className="vp-logo">{projectName(lang)}</div>
        <div className="vp-nav">
          <div className="vp-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (
            <button className="vp-navbtn" onClick={openCompare}>
              {t.nav.compare}<span className="vp-cmp-count">{compareList.length}</span>
            </button>
          )}
          <button className="vp-navbtn" onClick={toggleLang}>{LANG_LABEL[nextLang]}</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="vp-hero">
        <div className="vp-hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="vp-hero-ov" />
        <div className="vp-hero-ct">
          <div className="vp-pvt">{t.hero.badge}</div>
          <p className="vp-greet">{t.hero[vipPersona?.gender === "female" ? "welcomeFemale" : "welcomeMale"]} <span>{vipName}</span></p>
          <h1 className="vp-htitle">
            {lang === "ar" ? (<>مسكنك<br /><em>الحصري</em> بانتظارك</>) : (<>Your Exclusive<br /><em>Residence</em> Awaits</>)}
          </h1>
          <p className="vp-hdesc">{t.hero.subtitle}</p>
          <div className="vp-hacts">
            <button type="button" className="vp-btn-g vp-hero-cta-arrow" onClick={() => { trackEvent("cta_explore"); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta}</button>
            <button type="button" className="vp-btn-o" onClick={() => { trackEvent("cta_booking"); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="vp-stats">
        {[
          { v: "248", l: t.stats.units },
          { v: "44", l: t.stats.floors },
          { v: "8.2%", l: t.stats.roi, link: "/enterprise/crmdemo/roi-calculator" },
          { v: "Q4 '27", l: t.stats.completion },
        ].map((s, i) => (
          s.link ? (
            <Link to={s.link} className="vp-stat vp-stat-link" key={i} style={{ textDecoration: "none", cursor: "pointer" }}>
              <div className="vp-stat-v">{s.v}</div>
              <div className="vp-stat-l">{s.l}</div>
              <div style={{ fontSize: "0.55rem", color: "rgba(184,134,11,0.7)", marginTop: "0.25rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{lang === "ar" ? "احسب العائد →" : "Calculate ROI →"}</div>
            </Link>
          ) : (
            <div className="vp-stat" key={i}>
              <div className="vp-stat-v">{s.v}</div>
              <div className="vp-stat-l">{s.l}</div>
            </div>
          )
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
          {units.map((unit) => (
            <div className="vp-card vp-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="vp-card-img">
                <img src={unit.img} alt={unit.name} loading="lazy" />
                <div className="vp-card-fbadge">{unit.feature}</div>
                <div className="vp-card-status" style={{ background: unit.statusColor }}>{unit.status}</div>
              </div>
              <div className="vp-card-body">
                <h3 className="vp-card-name">{unit.name}</h3>
                <p className="vp-card-floor">{unit.floor}</p>
                <div className="vp-card-meta">
                  <span>🛏 {unit.beds}</span>
                  <span>📐 {unit.size}</span>
                </div>
                <div className="vp-card-price">{fmtCurrency(unit.priceBase)}</div>
                <div className="vp-card-sqft">{fmtCurrency(Math.round(unit.priceBase / unit.sqftBase))}{lang === "ar" ? "/قدم²" : "/sq ft"}</div>
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
          {amenities.map((a, i) => (
            <div className="vp-am vp-rv" key={i}>
              <div className="vp-am-icon">
                <i className={`ti ${a.icon}`} aria-hidden="true" />
              </div>
              <div className="vp-am-name">{a.title}</div>
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
          {investStats.map((item, i) => (
            <div className="vp-inv vp-rv" key={i}>
              <div className="vp-inv-v">{item.stat}</div>
              <div className="vp-inv-l">{item.label}</div>
              <div className="vp-inv-n">{item.desc}</div>
            </div>
          ))}
        </div>

      </section>

      {/* ── ROI CALCULATOR BANNER ── */}
      <Link to="/enterprise/crmdemo/roi-calculator" className="vp-roi-banner" onClick={() => { trackEvent("roi_calculator_click"); }}>
        <div className="vp-roi-icon">
          <i className="ti ti-calculator" aria-hidden="true" />
        </div>
        <div className="vp-roi-content">
          <h3 className="vp-roi-title">{t.roiBanner.title}</h3>
          <p className="vp-roi-desc">{t.roiBanner.desc}</p>
        </div>
        <span className="vp-roi-cta">{t.roiBanner.cta}</span>
      </Link>

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
              <input className={`vp-finput ${formErr.email ? "vp-err" : ""}`} type="text" inputMode="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.phone}</label>
              <input className={`vp-finput ${formErr.phone ? "vp-err" : ""}`} type="text" inputMode="tel"
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="vp-fg">
              <label className="vp-flabel">{t.booking.preferred}</label>
              <select className="vp-fsel" onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="">—</option>
                {units.map((u) => (<option key={u.id} value={u.id}>{u.name} — {fmtCurrency(u.priceBase)}</option>))}
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
            <button type="button" className="vp-btn-g vp-booking-submit-arrow" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>
              {t.booking.submit}
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
              <img src={selectedUnit.img} alt={selectedUnit.name} />
              <img src={IMAGES.hero} alt="View 2" />
              <img src={IMAGES.pool} alt="View 3" />
            </div>
            <div className="vp-modal-body">
              <div className="vp-md-top">
                <div>
                  <h2 className="vp-md-title">{selectedUnit.name}</h2>
                  <p className="vp-md-floor">{selectedUnit.floor}</p>
                </div>
                <div style={{ textAlign: lang === "ar" ? "start" : "end" }}>
                  <div className="vp-md-price">{fmtCurrency(selectedUnit.priceBase)}</div>
                  <div className="vp-md-sqft">{fmtCurrency(Math.round(selectedUnit.priceBase / selectedUnit.sqftBase))}{lang === "ar" ? "/قدم²" : "/sq ft"}</div>
                </div>
              </div>
              <p className="vp-md-desc">{selectedUnit.desc}</p>
              <div className="vp-md-grid">
                <div className="vp-md-gi"><div className="vp-md-gi-l">{t.floorPlanModal.bedrooms}</div><div className="vp-md-gi-v">{selectedUnit.beds}</div></div>
                <div className="vp-md-gi"><div className="vp-md-gi-l">{t.floorPlanModal.bathrooms}</div><div className="vp-md-gi-v">{selectedUnit.baths}</div></div>
                <div className="vp-md-gi"><div className="vp-md-gi-l">{t.floorPlanModal.living}</div><div className="vp-md-gi-v">{selectedUnit.size}</div></div>
                <div className="vp-md-gi">
                  <div className="vp-md-gi-l">{t.compareModal.category}</div>
                  <div className="vp-md-gi-v" style={{ background: selectedUnit.statusColor, color: "#fff", display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontSize: ".9rem" }}>
                    {selectedUnit.status}
                  </div>
                </div>
              </div>
              <div className="vp-md-feats">
                {selectedUnit.features.map((f, i) => (<span className="vp-md-feat" key={i}>{f}</span>))}
              </div>

              {/* Inline Payment Preview */}
              <div style={{ padding: "1.5rem", border: "1px solid var(--vp-glb)", borderRadius: "8px", background: "var(--vp-gl)" }}>
                <h4 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{t.paymentModal.title}</h4>
                <div className="vp-pay-bar">
                  <div className="vp-pay-seg" style={{ flex: 10, background: "var(--vp-gold)" }} />
                  <div className="vp-pay-seg" style={{ flex: 50, background: "var(--vp-gold-lt)" }} />
                  <div className="vp-pay-seg" style={{ flex: 40, background: "rgba(197,164,103,.35)" }} />
                </div>
                <div className="vp-pay-legend">
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "var(--vp-gold)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{t.paymentModal.m1} (10%)</div><div className="vp-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.1)}</div></div></div>
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "var(--vp-gold-lt)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{t.paymentModal.m3} (50%)</div><div className="vp-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.5)}</div></div></div>
                  <div className="vp-pay-item"><div className="vp-pay-dot" style={{ background: "rgba(197,164,103,.35)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--vp-t3)" }}>{t.paymentModal.m5} (40%)</div><div className="vp-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.4)}</div></div></div>
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
              <h2 style={{ fontFamily: "var(--vp-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name}</h2>
              <p style={{ color: "var(--vp-gold)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor}</p>
              <svg className="vp-fp-svg" viewBox="0 0 100 65" style={{ background: "var(--vp-ch)" }}>
                {modalUnit.floorPlan.rooms.map((room, i) => (
                  <g key={i}>
                    <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#666"} fillOpacity="0.2" stroke={ROOM_COLORS[room.key] || "#666"} strokeWidth="0.3" rx="0.5" />
                    {(room.label[lang] ?? room.label.en).split("\n").map((line, li) => (
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
              <button className="vp-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(t.toast.floorPlan, "📥")}>
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
                <button className="vp-btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.brochure, "📥")}>
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
                  {t.paymentModal.totalPrice}: {fmtCurrency(modalUnit.payment.base)}
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
                        <div className="vp-pm-m-val">{fmtCurrency(modalUnit.payment.base * m.pct / 100)}</div>
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
                const units = compareList.map((id) => units.find((u) => u.id === id)).filter(Boolean);
                const cols = `180px repeat(${units.length}, 1fr)`;
                const rows = [
                  { label: t.compareModal.price, get: (u) => fmtCurrency(u.priceBase) },
                  { label: t.compareModal.floor, get: (u) => u.floor },
                  { label: t.compareModal.bedrooms, get: (u) => u.beds },
                  { label: t.compareModal.size, get: (u) => u.size },
                  { label: t.compareModal.view, get: (u) => u.feature },
                  { label: t.compareModal.category, get: (u) => u.category },
                ];
                return (
                  <div className="vp-cmp-grid">
                    <div className="vp-cmp-row hdr" style={{ gridTemplateColumns: cols }}>
                      <div>{t.compareModal.feature}</div>
                      {units.map((u) => (
                        <div key={u.id} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--vp-serif)", fontSize: "1rem", color: "var(--vp-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{u.name}</div>
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

      <button type="button" className="vp-whatsapp" onClick={callAdvisor} aria-label={t.unitActions.callAdvisor}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`vp-toast ${toastHiding ? "hiding" : ""}`}>
          <span>{toast.icon}</span> {toast.msg}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { trackPortalEvent } from "../../services/portalTrack";
import { usePortalRegion } from "../../services/portalRegion";
import './AhmedPortal.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/portals/ahmedPortal';
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

// ─── BILINGUAL ───────────────────────────────────────────────────
const LANG_LABEL = { en: "English", ar: "العربية", es: "Español", fr: "Français" };
const LANG = {
  en: {
    dir: "ltr",
    nav: { vip: "VIP family", lang: "العربية", compare: "Compare" },
    hero: {
      badge: "Private family invitation",
      welcomeMale: "Welcome,",
      welcomeFemale: "Welcome,",
      tagline: "Your family's dream residence",
      subtitle: "A curated collection of spacious family residences with premium community features, handpicked for those who value quality living for their loved ones.",
      cta: "Explore residences",
      ctaSecondary: "Schedule family viewing",
    },
    stats: { units: "Family residences", schools: "Schools nearby", parks: "Parks & gardens", completion: "Completion" },
    roiBanner: {
      title: "Calculate your investment returns",
      desc: "Use our interactive ROI calculator to project your returns based on property value, rental income, appreciation rates, and financing options.",
      cta: "Open ROI calculator →",
    },
    sections: {
      residences: "Family residences",
      residencesSub: "Spacious homes for growing families",
      residencesHint: "Select any residence to explore details and community features",
      amenities: "Family lifestyle",
      amenitiesSub: "Everything your family needs, steps away",
      investment: "Smart family investment",
      investmentSub: "Build wealth while building a home",
      contact: "Family consultation",
      contactSub: "Schedule your family viewing",
      contactHint: "Your family advisor will arrange a private tour with community walkthrough",
    },
    unitActions: { viewDetails: "View details", floorPlan: "Floor plan", brochure: "Brochure", pricing: "Request pricing", book: "Book viewing", compare: "Compare", payment: "Payment plan", callAdvisor: "Call advisor" },
    floorPlanModal: {
      title: "Floor plan", bedrooms: "Bedrooms", living: "Living area", balcony: "Balcony / garden", kitchen: "Kitchen", master: "Master suite", bathrooms: "Bathrooms", totalArea: "Total area", download: "Download floor plan PDF",
      disclaimer: "Floor plans are indicative and may vary. Actual dimensions confirmed upon handover.",
    },
    brochureModal: {
      title: "Family brochure", downloading: "Preparing your brochure...", ready: "Brochure ready",
      desc: "Your personalized family brochure has been prepared with community details.",
      download: "Download brochure PDF", email: "Send to email", includes: "Brochure includes:",
      items: ["Detailed floor plans & specifications", "Community & school directory", "Family amenity overview", "Investment analysis & payment plans", "Location & connectivity map"],
    },
    paymentModal: {
      title: "Payment plan", subtitle: "Family-friendly payment structure",
      totalPrice: "Total price",
      plan6040: "60/40 plan", plan6040Desc: "60% during construction · 40% on handover",
      plan7030: "70/30 plan", plan7030Desc: "70% during construction · 30% post-handover (12 months)",
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
      title: "Compare residences", feature: "Feature", remove: "Remove",
      price: "Price", floor: "Floor", bedrooms: "Bedrooms", size: "Size", view: "View", category: "Category",
      empty: "Add residences to compare by clicking the ⚖️ icon on unit cards.",
    },
    booking: {
      name: "Full name", email: "Email address", phone: "Phone number",
      preferred: "Preferred residence", date: "Preferred date", time: "Preferred time",
      notes: "Family requirements", submit: "Request family viewing",
      note: "Your information is protected. Your family advisor will contact you within 24 hours.",
      morning: "Morning (9AM-12PM)", afternoon: "Afternoon (12PM-4PM)", evening: "Evening (4PM-7PM)",
      success: "Family viewing request submitted",
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
    dir: "rtl",
    nav: { vip: "عائلة كبار الشخصيات", lang: "العربية", compare: "مقارنة" },
    hero: {
      badge: "دعوة عائلية خاصة",
      welcomeMale: "مرحبًا،",
      welcomeFemale: "مرحبًا،",
      tagline: "وحدة الأحلام لعائلتك",
      subtitle: "مجموعة منتقاة من المساكن العائلية الواسعة مع مرافق مجتمعية متميزة، بعناية لمن يقدّرون جودة الحياة لأحبائهم.",
      cta: "استكشاف الوحدات السكنية",
      ctaSecondary: "جدولة زيارة عائلية",
    },
    stats: { units: "الوحدات العائلية", schools: "المدارس القريبة", parks: "الحدائق والمتنزهات", completion: "الاكتمال" },
    roiBanner: {
      title: "احسب عائد استثمارك",
      desc: "استخدم حاسبة العائد التفاعلية لتقدير عائدك بناءً على قيمة العقار ودخل الإيجار ونمو رأس المال وخيارات التمويل.",
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
      disclaimer: "المخططات إرشادية وقد تختلف. الأبعاد الفعلية تُؤكد عند التسليم.",
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
  es: {
    dir: "ltr",
    nav: { vip: "Familia VIP", lang: "English", compare: "Comparar" },
    hero: {
      badge: "Invitación familiar privada",
      welcomeMale: "Bienvenido,",
      welcomeFemale: "Bienvenida,",
      tagline: "El hogar soñado para su familia",
      subtitle: "Una colección curada de residencias familiares espaciosas con amenidades premium, escogidas a mano para quienes valoran la calidad de vida de sus seres queridos.",
      cta: "Explorar residencias",
      ctaSecondary: "Agendar visita familiar",
    },
    stats: { units: "Residencias familiares", schools: "Escuelas cercanas", parks: "Parques y jardines", completion: "Entrega" },
    roiBanner: {
      title: "Calcule el rendimiento de su inversión",
      desc: "Use nuestra calculadora interactiva de ROI para proyectar sus rendimientos según el valor de la propiedad, ingresos por renta, tasas de plusvalía y opciones de financiamiento.",
      cta: "Abrir calculadora ROI →",
    },
    sections: {
      residences: "Residencias familiares",
      residencesSub: "Hogares espaciosos para familias en crecimiento",
      residencesHint: "Seleccione cualquier residencia para explorar detalles y amenidades comunitarias",
      amenities: "Vida en familia",
      amenitiesSub: "Todo lo que su familia necesita, a pocos pasos",
      investment: "Inversión familiar inteligente",
      investmentSub: "Construya patrimonio mientras construye un hogar",
      contact: "Consulta familiar",
      contactSub: "Agende su visita familiar",
      contactHint: "Su asesor familiar organizará un recorrido privado con vista de la comunidad",
    },
    unitActions: { viewDetails: "Ver detalles", floorPlan: "Plano", brochure: "Catálogo", pricing: "Solicitar precio", book: "Reservar visita", compare: "Comparar", payment: "Plan de pago", callAdvisor: "Llamar al asesor" },
    floorPlanModal: {
      title: "Plano de planta", bedrooms: "Recámaras", living: "Sala", balcony: "Balcón / jardín", kitchen: "Cocina", master: "Recámara principal", bathrooms: "Baños", totalArea: "Superficie total", download: "Descargar plano en PDF",
      disclaimer: "Los planos son indicativos y pueden variar. Las dimensiones finales se confirman a la entrega.",
    },
    brochureModal: {
      title: "Catálogo familiar", downloading: "Preparando su catálogo...", ready: "Catálogo listo",
      desc: "Su catálogo familiar personalizado ha sido preparado con detalles de la comunidad.",
      download: "Descargar catálogo en PDF", email: "Enviar por correo", includes: "El catálogo incluye:",
      items: ["Planos detallados y especificaciones", "Directorio de comunidad y escuelas", "Vista general de amenidades familiares", "Análisis de inversión y planes de pago", "Mapa de ubicación y conectividad"],
    },
    paymentModal: {
      title: "Plan de pago", subtitle: "Estructura de pago pensada para familias",
      totalPrice: "Precio total",
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
      disclaimer: "Los planes de pago están sujetos a aprobación. Las condiciones pueden variar según la unidad seleccionada.",
    },
    compareModal: {
      title: "Comparar residencias", feature: "Característica", remove: "Quitar",
      price: "Precio", floor: "Piso", bedrooms: "Recámaras", size: "Superficie", view: "Vista", category: "Categoría",
      empty: "Agregue residencias para comparar haciendo clic en el ícono ⚖️ de las tarjetas.",
    },
    booking: {
      name: "Nombre completo", email: "Correo electrónico", phone: "Teléfono",
      preferred: "Residencia preferida", date: "Fecha preferida", time: "Horario preferido",
      notes: "Requerimientos familiares", submit: "Solicitar visita familiar",
      note: "Su información está protegida. Su asesor familiar le contactará en un plazo de 24 horas.",
      morning: "Mañana (9-12)", afternoon: "Tarde (12-16)", evening: "Noche (16-19)",
      success: "Solicitud de visita familiar enviada",
      successDesc: "¡Gracias! Su asesor familiar le contactará en un plazo de 24 horas para organizar un recorrido privado que incluye las amenidades de la comunidad.",
      successRef: "Referencia",
    },
    toast: {
      floorPlan: "Plano abierto", brochure: "Catálogo descargado",
      pricing: "Solicitud de precio enviada — revise su correo", booking: "Solicitud de visita familiar enviada",
      compare: "Agregado a la comparación", compareRemove: "Quitado de la comparación",
      emailSent: "Catálogo enviado a su correo", advisorNotified: "Su asesor familiar ha sido notificado",
    },
    footer: "Este es un portal familiar privado. El contenido está personalizado para su acceso exclusivo.",
    poweredBy: "Tecnología de",
  },
  fr: {
    dir: "ltr",
    nav: { vip: "Famille VIP", lang: "English", compare: "Comparer" },
    hero: {
      badge: "Invitation familiale privée",
      welcomeMale: "Bienvenue,",
      welcomeFemale: "Bienvenue,",
      tagline: "La résidence de rêve pour votre famille",
      subtitle: "Une collection raffinée de résidences familiales spacieuses avec des commodités haut de gamme, choisies avec soin pour ceux qui valorisent la qualité de vie de leurs proches.",
      cta: "Explorer les résidences",
      ctaSecondary: "Planifier une visite familiale",
    },
    stats: { units: "Résidences familiales", schools: "Écoles à proximité", parks: "Parcs et jardins", completion: "Livraison" },
    roiBanner: {
      title: "Calculez le rendement de votre investissement",
      desc: "Utilisez notre calculateur de ROI interactif pour projeter vos rendements selon la valeur de la propriété, les revenus locatifs, les taux d'appréciation et les options de financement.",
      cta: "Ouvrir le calculateur ROI →",
    },
    sections: {
      residences: "Résidences familiales",
      residencesSub: "Foyers spacieux pour les familles qui grandissent",
      residencesHint: "Sélectionnez une résidence pour explorer les détails et les commodités de la communauté",
      amenities: "L'art de vivre familial",
      amenitiesSub: "Tout ce dont votre famille a besoin, à quelques pas",
      investment: "Investissement familial intelligent",
      investmentSub: "Bâtissez votre patrimoine en bâtissant un foyer",
      contact: "Consultation familiale",
      contactSub: "Planifiez votre visite familiale",
      contactHint: "Votre conseiller familial organisera une visite privée incluant un tour de la communauté",
    },
    unitActions: { viewDetails: "Voir les détails", floorPlan: "Plan d'étage", brochure: "Brochure", pricing: "Demander le prix", book: "Réserver une visite", compare: "Comparer", payment: "Plan de paiement", callAdvisor: "Appeler le conseiller" },
    floorPlanModal: {
      title: "Plan d'étage", bedrooms: "Chambres", living: "Salon", balcony: "Balcon / jardin", kitchen: "Cuisine", master: "Suite principale", bathrooms: "Salles de bain", totalArea: "Superficie totale", download: "Télécharger le plan en PDF",
      disclaimer: "Les plans sont indicatifs et peuvent varier. Les dimensions finales sont confirmées à la livraison.",
    },
    brochureModal: {
      title: "Brochure familiale", downloading: "Préparation de votre brochure...", ready: "Brochure prête",
      desc: "Votre brochure familiale personnalisée a été préparée avec les détails de la communauté.",
      download: "Télécharger la brochure en PDF", email: "Envoyer par courriel", includes: "La brochure comprend :",
      items: ["Plans détaillés et spécifications", "Répertoire de la communauté et des écoles", "Aperçu des commodités familiales", "Analyse d'investissement et plans de paiement", "Carte d'emplacement et de connectivité"],
    },
    paymentModal: {
      title: "Plan de paiement", subtitle: "Structure de paiement adaptée aux familles",
      totalPrice: "Prix total",
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
      disclaimer: "Les plans de paiement sont sujets à approbation. Les conditions peuvent varier selon l'unité choisie.",
    },
    compareModal: {
      title: "Comparer les résidences", feature: "Caractéristique", remove: "Retirer",
      price: "Prix", floor: "Étage", bedrooms: "Chambres", size: "Superficie", view: "Vue", category: "Catégorie",
      empty: "Ajoutez des résidences à comparer en cliquant sur l'icône ⚖️ des cartes.",
    },
    booking: {
      name: "Nom complet", email: "Adresse courriel", phone: "Téléphone",
      preferred: "Résidence préférée", date: "Date préférée", time: "Heure préférée",
      notes: "Besoins familiaux", submit: "Demander une visite familiale",
      note: "Vos informations sont protégées. Votre conseiller familial vous contactera dans les 24 heures.",
      morning: "Matin (9 h - 12 h)", afternoon: "Après-midi (12 h - 16 h)", evening: "Soir (16 h - 19 h)",
      success: "Demande de visite familiale envoyée",
      successDesc: "Merci ! Votre conseiller familial vous contactera dans les 24 heures pour organiser une visite privée incluant les commodités de la communauté.",
      successRef: "Référence",
    },
    toast: {
      floorPlan: "Plan ouvert", brochure: "Brochure téléchargée",
      pricing: "Demande de prix envoyée — vérifiez votre courriel", booking: "Demande de visite familiale envoyée",
      compare: "Ajouté à la comparaison", compareRemove: "Retiré de la comparaison",
      emailSent: "Brochure envoyée à votre courriel", advisorNotified: "Votre conseiller familial a été notifié",
    },
    footer: "Ceci est un portail familial privé. Le contenu est personnalisé pour votre accès exclusif.",
    poweredBy: "Propulsé par",
  },
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
  const { projectName, fmtCurrency, familyPersona, region, familyUnits, amenities, investStats, unitMedia } = usePortalRegion("real_estate", lang);
  const trackEvent = useCallback(
    (event, data) => trackPortalEvent("vip", familyPersona, event, data),
    [familyPersona]
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
  const [form, setForm] = useState({ name: familyPersona?.name || "", email: "", phone: "", unit: "", date: "", time: "", notes: "" });
  const [formErr, setFormErr] = useState({});

  const resRef = useRef(null);
  const bookRef = useRef(null);
  const t = LANG[lang];

  const withExtras = (unit) => ({ ...unit, ...unitMedia[unit.id] });
  const units = familyUnits.map(withExtras);

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }); document.querySelectorAll(".ap-rv").forEach((el) => obs.observe(el)); return () => obs.disconnect(); }, [lang, modal, selectedUnit]);
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    trackEvent("portal_opened", { portal: "ahmed", language: "en" });
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, []);
  const vipName = familyPersona?.name || "Family Guest";
  const nextLang = region.languages.find((l) => l !== lang) || region.languages[0];
  const toggleLang = () => {
    const n = region.languages.find((l) => l !== lang) || region.languages[0];
    setLang(n);
    document.documentElement.lang = n;
    document.documentElement.dir = n === "ar" ? "rtl" : "ltr";
    trackEvent("language_switch", { to: n });
  };
  const showToast = useCallback((msg, icon = "✓") => { setToastHiding(false); setToast({ msg, icon }); setTimeout(() => { setToastHiding(true); setTimeout(() => setToast(null), 300); }, 3000); }, []);
  const toggleCompare = (unitId) => { setCompareList((prev) => { if (prev.includes(unitId)) { showToast(t.toast.compareRemove, "↩"); return prev.filter((id) => id !== unitId); } if (prev.length >= 3) return prev; trackEvent("comparison_view", { unitId }); showToast(t.toast.compare, "⚖️"); return [...prev, unitId]; }); };

  const openDetail = (unit) => { setSelectedUnit(unit); trackEvent("view_unit", { unitId: unit.id, unitName: unit.nameEn, price: unit.priceBase, tower: unit.tower, unitType: unit.type }); };
  const openFloor = (unit) => { setModalUnit(unit); setModal("floorplan"); trackEvent("view_floorplan", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); showToast(t.toast.floorPlan, "📐"); };
  const openBrochure = (unit) => { setModalUnit(unit); setModal("brochure"); trackEvent("download_brochure", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); showToast(t.toast.brochure, "📄"); };
  const openPayment = (unit) => { setModalUnit(unit); setModal("payment"); setPayPlan("60/40"); trackEvent("explore_payment_plan", { unitId: unit.id, unitName: unit.nameEn, tower: unit.tower, unitType: unit.type }); };
  const openCompare = () => { setModal("compare"); };
  const reqPricing = (unit) => { trackEvent("request_pricing", { unitId: unit.id, unitName: unit.nameEn, price: unit.priceBase, tower: unit.tower, unitType: unit.type }); showToast(t.toast.pricing, "💰"); };
  const callAdvisor = () => { trackEvent("contact_advisor", { vipName }); showToast(t.toast.advisorNotified, "📞"); };
  const closeAll = () => { setModal(null); setModalUnit(null); setSelectedUnit(null); };

  const validateForm = () => { const err = {}; if (!form.name.trim()) err.name = true; if (!form.email.trim() || !form.email.includes("@")) err.email = true; if (!form.phone.trim()) err.phone = true; setFormErr(err); return Object.keys(err).length === 0; };
  const submitBooking = () => { if (!validateForm()) return; const ref = "FAM-" + Date.now().toString(36).toUpperCase().slice(-6); trackEvent("book_viewing", { unitId: form.unit || "general", name: form.name || vipName }); setBookingRefVal(ref); setBookingOk(true); showToast(t.toast.booking, "📅"); };

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
      <SEO
        title="VIP Family Real Estate Portal"
        description="Exclusive VIP family portal with personalized residences, floor plans, brochures, and private viewing booking."
        path="/enterprise/crmdemo/ahmed"
      />
      <div className="ap-crossnav" style={{ top: scrolled ? "0" : "-40px" }}>
        <Link to="/enterprise/crmdemo">← Demo Hub</Link>
        <Link to="/enterprise/crmdemo/khalid">VIP Portal</Link>
        <span className="active">Ahmed Portal</span>
        <Link to="/enterprise/crmdemo/marketplace">Marketplace</Link>
        <Link to="/enterprise/crmdemo/dashboard">Dashboard</Link>
        <Link to="/enterprise/crmdemo/ai-demo">AI Pipeline</Link>
        <span className="crossnav-persona">👤 {vipName}</span>
      </div>
      <header className={`ap-hd ${scrolled ? "sc" : ""}`}>
        <div className="ap-logo">{projectName(lang)}</div>
        <div className="ap-nav">
          <div className="ap-badge">{t.nav.vip}</div>
          {compareList.length > 0 && (<button className="ap-navbtn" onClick={openCompare}>{t.nav.compare}<span className="ap-cmp-count">{compareList.length}</span></button>)}
          <button className="ap-navbtn" onClick={toggleLang}>{LANG_LABEL[nextLang]}</button>
        </div>
      </header>

      <section className="ap-hero">
        <div className="ap-hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-ct">
          <div className="ap-pvt">{t.hero.badge}</div>
          <p className="ap-greet">{t.hero[familyPersona?.gender === "female" ? "welcomeFemale" : "welcomeMale"]} <span>{vipName}</span></p>
          <h1 className="ap-htitle">{lang === "ar" ? (<>مسكن عائلتك<br /><em>المثالي</em></>) : (<>Your Family's<br /><em>Dream</em> Residence</>)}</h1>
          <p className="ap-hdesc">{t.hero.subtitle}</p>
          <div className="ap-hacts">
            <button type="button" className="ap-btn-g ap-hero-cta-arrow" onClick={() => { trackEvent("cta_explore"); resRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.cta}</button>
            <button type="button" className="ap-btn-o" onClick={() => { trackEvent("cta_booking"); bookRef.current?.scrollIntoView({ behavior: "smooth" }); }}>{t.hero.ctaSecondary}</button>
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
          {units.map((unit) => (
            <div className="ap-card ap-rv" key={unit.id} onClick={() => openDetail(unit)}>
              <div className="ap-card-img"><img src={unit.img} alt={unit.name} loading="lazy" /><div className="ap-card-fbadge">{unit.feature}</div><div className="ap-card-status" style={{ background: unit.statusColor }}>{unit.status}</div></div>
              <div className="ap-card-body"><h3 className="ap-card-name">{unit.name}</h3><p className="ap-card-floor">{unit.floor}</p><div className="ap-card-meta"><span>🛏 {unit.beds}</span><span>📐 {unit.size}</span></div><div className="ap-card-price">{fmtCurrency(unit.priceBase)}</div><div className="ap-card-sqft">{fmtCurrency(Math.round(unit.priceBase / unit.sqftBase))}{lang === "ar" ? "/قدم²" : "/sq ft"}</div></div>
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
        <div className="ap-am-grid">{amenities.map((a, i) => (<div className="ap-am ap-rv" key={i}><div className="ap-am-icon"><i className={`ti ${a.icon}`} aria-hidden="true" /></div><div className="ap-am-name">{a.title}</div><div className="ap-am-desc">{a.desc}</div></div>))}</div>
      </section>

      <div className="ap-div"><div className="ap-div-l" /><div className="ap-div-d">◆</div><div className="ap-div-l" /></div>

      <section className="ap-sec">
        <div className="ap-sh ap-rv"><span className="ap-sl">◆ {t.sections.investment}</span><h2 className="ap-st">{t.sections.investmentSub}</h2></div>
        <div className="ap-inv-grid">{investStats.map((item, i) => (<div className="ap-inv ap-rv" key={i}><div className="ap-inv-v">{item.stat}</div><div className="ap-inv-l">{item.label}</div><div className="ap-inv-n">{item.desc}</div></div>))}</div>

      </section>

      {/* ── ROI CALCULATOR BANNER ── */}
      <Link to="/enterprise/crmdemo/roi-calculator" className="ap-roi-banner" onClick={() => { trackEvent("roi_calculator_click"); }}>
        <div className="ap-roi-icon"><i className="ti ti-calculator" aria-hidden="true" /></div>
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
            <div className="ap-fg"><label className="ap-flabel">{t.booking.preferred}</label><select className="ap-fsel" onChange={(e) => setForm({ ...form, unit: e.target.value })}><option value="">—</option>{units.map((u) => (<option key={u.id} value={u.id}>{u.name} — {fmtCurrency(u.priceBase)}</option>))}</select></div>
            <div className="ap-frow">
              <div className="ap-fg"><label className="ap-flabel">{t.booking.date}</label><input className="ap-finput" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="ap-fg"><label className="ap-flabel">{t.booking.time}</label><select className="ap-fsel" onChange={(e) => setForm({ ...form, time: e.target.value })}><option value="">—</option><option value="morning">{t.booking.morning}</option><option value="afternoon">{t.booking.afternoon}</option><option value="evening">{t.booking.evening}</option></select></div>
            </div>
            <div className="ap-fg"><label className="ap-flabel">{t.booking.notes}</label><input className="ap-finput" type="text" onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <button type="button" className="ap-btn-g ap-booking-submit-arrow" style={{ width: "100%", justifyContent: "center", marginTop: ".5rem" }} onClick={submitBooking}>{t.booking.submit}</button>
            <p className="ap-fnote">{t.booking.note}</p>
          </div>
        )}
      </section>

      <footer className="ap-ft"><p>{t.footer}</p><p><span className="ap-ft-brand">{t.poweredBy} Dynamic NFC</span></p></footer>

      {/* ── UNIT DETAIL MODAL ── */}
      {selectedUnit && (
        <div className="ap-modal-ov" onClick={closeAll}><div className="ap-modal" onClick={(e) => e.stopPropagation()}>
          <button className="ap-modal-x" onClick={closeAll}>✕</button>
          <div className="ap-md-gallery"><img src={selectedUnit.img} alt={selectedUnit.name} /><img src={IMAGES.hero} alt="View 2" /><img src={IMAGES.community} alt="View 3" /></div>
          <div className="ap-modal-body">
            <div className="ap-md-top"><div><h2 className="ap-md-title">{selectedUnit.name}</h2><p className="ap-md-floor">{selectedUnit.floor}</p></div><div style={{ textAlign: lang === "ar" ? "start" : "end" }}><div className="ap-md-price">{fmtCurrency(selectedUnit.priceBase)}</div><div className="ap-md-sqft">{fmtCurrency(Math.round(selectedUnit.priceBase / selectedUnit.sqftBase))}{lang === "ar" ? "/قدم²" : "/sq ft"}</div></div></div>
            <p className="ap-md-desc">{selectedUnit.desc}</p>
            <div className="ap-md-grid">
              <div className="ap-md-gi"><div className="ap-md-gi-l">{t.floorPlanModal.bedrooms}</div><div className="ap-md-gi-v">{selectedUnit.beds}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{t.floorPlanModal.bathrooms}</div><div className="ap-md-gi-v">{selectedUnit.baths}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{t.floorPlanModal.living}</div><div className="ap-md-gi-v">{selectedUnit.size}</div></div>
              <div className="ap-md-gi"><div className="ap-md-gi-l">{t.compareModal.category}</div><div className="ap-md-gi-v" style={{ background: selectedUnit.statusColor, color: "#fff", display: "inline-block", padding: ".2rem .6rem", borderRadius: "4px", fontSize: ".9rem" }}>{selectedUnit.status}</div></div>
            </div>
            <div className="ap-md-feats">{selectedUnit.features.map((f, i) => (<span className="ap-md-feat" key={i}>{f}</span>))}</div>
            <div style={{ padding: "1.5rem", border: "1px solid var(--ap-glb)", borderRadius: "8px", background: "var(--ap-gl)" }}>
              <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", marginBottom: "1rem" }}>{t.paymentModal.title}</h4>
              <div className="ap-pay-bar"><div className="ap-pay-seg" style={{ flex: 10, background: "var(--ap-blue)" }} /><div className="ap-pay-seg" style={{ flex: 50, background: "var(--ap-teal)" }} /><div className="ap-pay-seg" style={{ flex: 40, background: "rgba(46,196,182,.35)" }} /></div>
              <div className="ap-pay-legend">
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "var(--ap-blue)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{t.paymentModal.m1} (10%)</div><div className="ap-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.1)}</div></div></div>
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "var(--ap-teal)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{t.paymentModal.m3} (50%)</div><div className="ap-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.5)}</div></div></div>
                <div className="ap-pay-item"><div className="ap-pay-dot" style={{ background: "rgba(46,196,182,.35)" }} /><div><div style={{ fontSize: ".72rem", color: "var(--ap-t3)" }}>{t.paymentModal.m5} (40%)</div><div className="ap-pay-amt">{fmtCurrency(selectedUnit.priceBase * 0.4)}</div></div></div>
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
            <h2 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.8rem", marginBottom: ".3rem" }}>{t.floorPlanModal.title} — {modalUnit.name}</h2>
            <p style={{ color: "var(--ap-teal)", fontSize: ".8rem", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "2rem" }}>{modalUnit.floor}</p>
            <svg className="ap-fp-svg" viewBox="0 0 100 65" style={{ background: "var(--ap-ch)" }}>
              {modalUnit.floorPlan.rooms.map((room, i) => (<g key={i}><rect x={room.x} y={room.y} width={room.w} height={room.h} fill={ROOM_COLORS[room.key] || "#666"} fillOpacity="0.2" stroke={ROOM_COLORS[room.key] || "#666"} strokeWidth="0.3" rx="0.5" />{(room.label[lang] ?? room.label.en).split("\n").map((line, li) => (<text key={li} x={room.x + room.w / 2} y={room.y + room.h / 2 + (li - 0.3) * 3.5} textAnchor="middle" fill={ROOM_COLORS[room.key] || "#aaa"} fontSize="2.2" fontFamily="Outfit, sans-serif" fontWeight={li === 0 ? "500" : "300"}>{line}</text>))}</g>))}
            </svg>
            <div className="ap-fp-specs">
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.bathrooms}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.bathrooms}</div></div>
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.balcony}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.balconySize}</div></div>
              <div className="ap-fp-spec"><div className="ap-fp-spec-l">{t.floorPlanModal.totalArea}</div><div className="ap-fp-spec-v">{modalUnit.floorPlan.specs.totalArea}</div></div>
            </div>
            <button className="ap-btn-g" style={{ width: "100%", justifyContent: "center" }} onClick={() => showToast(t.toast.floorPlan, "📥")}>{t.floorPlanModal.download}</button>
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
              <button className="ap-btn-g" style={{ flex: 1, justifyContent: "center" }} onClick={() => showToast(t.toast.brochure, "📥")}>{t.brochureModal.download}</button>
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
              <p style={{ fontFamily: "var(--ap-serif)", fontSize: "2rem", color: "var(--ap-teal)", marginBottom: "2rem" }}>{t.paymentModal.totalPrice}: {fmtCurrency(modalUnit.payment.base)}</p>
              <div className="ap-pm-tabs">
                <button className={`ap-pm-tab ${payPlan === "60/40" ? "active" : ""}`} onClick={() => setPayPlan("60/40")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan6040}</div><div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan6040Desc}</div></button>
                <button className={`ap-pm-tab ${payPlan === "70/30" ? "active" : ""}`} onClick={() => setPayPlan("70/30")}><div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{t.paymentModal.plan7030}</div><div style={{ fontSize: ".72rem", opacity: .7 }}>{t.paymentModal.plan7030Desc}</div></button>
              </div>
              <div className="ap-pay-bar" style={{ height: "10px" }}>{milestones.map((m, i) => (<div key={i} className="ap-pay-seg" style={{ flex: m.pct, background: m.color }} />))}</div>
              <h4 style={{ fontFamily: "var(--ap-serif)", fontSize: "1.2rem", margin: "1.5rem 0 1rem" }}>{t.paymentModal.milestones}</h4>
              <div className="ap-pm-ms">{milestones.map((m, i) => (<div className="ap-pm-m" key={i}><div className="ap-pm-m-dot" style={{ background: m.color }} /><div className="ap-pm-m-info"><div className="ap-pm-m-label">{m.label}</div><div className="ap-pm-m-desc">{m.desc}</div></div><div style={{ textAlign: "end" }}><div className="ap-pm-m-pct">{m.pct}%</div><div className="ap-pm-m-val">{fmtCurrency(modalUnit.payment.base * m.pct / 100)}</div></div></div>))}</div>
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
              return (<div className="ap-cmp-grid">
                <div className="ap-cmp-row hdr" style={{ gridTemplateColumns: cols }}><div>{t.compareModal.feature}</div>{units.map((u) => (<div key={u.id} style={{ textAlign: "center" }}><div style={{ fontFamily: "var(--ap-serif)", fontSize: "1rem", color: "var(--ap-t1)", fontWeight: 400, marginBottom: ".3rem" }}>{u.name}</div><button className="ap-cmp-rm" onClick={() => toggleCompare(u.id)}>{t.compareModal.remove}</button></div>))}</div>
                {rows.map((row, ri) => (<div className="ap-cmp-row" key={ri} style={{ gridTemplateColumns: cols }}><div className="ap-cmp-label">{row.label}</div>{units.map((u) => (<div className="ap-cmp-val" key={u.id}>{row.get(u)}</div>))}</div>))}
              </div>);
            })()}
          </div>
        </div></div>
      )}

      <button type="button" className="ap-whatsapp" onClick={callAdvisor} aria-label={t.unitActions.callAdvisor}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      {toast && (<div className={`ap-toast ${toastHiding ? "hiding" : ""}`}><span>{toast.icon}</span> {toast.msg}</div>)}
    </div>
  );
}
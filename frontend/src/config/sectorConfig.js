// src/config/sectorConfig.js
// ═══════════════════════════════════════════════════════════════
// SECTOR CONFIGURATION — Single source of truth for all sectors
// Used by: UnifiedDashboard (future), Admin Panel, Demo Portals
// ═══════════════════════════════════════════════════════════════

/**
 * Each sector config contains:
 * - identity: project/brand names, logos, colors
 * - inventory: what's being sold (units vs vehicles)
 * - events: tracking event taxonomy + intent weights
 * - funnel: conversion funnel stages
 * - pipeline: kanban pipeline stages
 * - kpis: dashboard KPI card definitions
 * - scoring: behavioral scoring model
 * - i18n: translation namespace mappings
 */

// ─── REAL ESTATE SECTOR ──────────────────────────────────────

const REAL_ESTATE = {
  id: 'real_estate',

  // --- Identity ---
  identity: {
    sectorLabel: { en: 'Real Estate', ar: 'العقارات', es: 'Bienes Raíces', fr: 'Immobilier' },
    defaultProject: {
      name: { en: 'Al Noor Residences', ar: 'مساكن النور', es: 'Residencias Al Noor', fr: 'Résidences Al Noor' },
      currency: 'SAR',
      currencySymbol: '\uFDFC',
      locale: 'ar-SA',
    },
    alternateProject: {
      name: { en: 'Vista Residences', ar: 'فيستا ريزيدنسز', es: 'Residencias Vista', fr: 'Résidences Vista' },
      currency: 'CAD',
      currencySymbol: '$',
      locale: 'en-CA',
    },
    dashboardTitle: { en: 'CRM Intelligence Center', ar: 'مركز ذكاء إدارة علاقات العملاء', es: 'Centro de Inteligencia CRM', fr: 'Centre d\'Intelligence CRM' },
    theme: 'dark_luxury', // dark bg, gold accents for Gulf
  },

  // --- Inventory ---
  inventory: {
    itemLabel: { en: 'Unit', ar: 'وحدة', es: 'Unidad', fr: 'Unité' },
    itemLabelPlural: { en: 'Units', ar: 'وحدات', es: 'Unidades', fr: 'Unités' },
    categoryLabel: { en: 'Tower', ar: 'برج', es: 'Torre', fr: 'Tour' },
    categoryLabelPlural: { en: 'Towers', ar: 'أبراج', es: 'Torres', fr: 'Tours' },
    categories: [
      { id: 'al_qamar', name: { en: 'Al Qamar', ar: 'القمر', es: 'Al Qamar', fr: 'Al Qamar' }, alias: 'Luna' },
      { id: 'al_safwa', name: { en: 'Al Safwa', ar: 'الصفوة', es: 'Al Safwa', fr: 'Al Safwa' }, alias: 'Astra' },
      { id: 'al_rawda', name: { en: 'Al Rawda', ar: 'الروضة', es: 'Al Rawda', fr: 'Al Rawda' }, alias: 'Nova' },
    ],
    typeFilters: [
      { id: 'all', label: { en: 'All', ar: 'الكل', es: 'Todos', fr: 'Tous' } },
      { id: 'penthouse', label: { en: 'Penthouse', ar: 'بنتهاوس', es: 'Penthouse', fr: 'Penthouse' } },
      { id: '3br', label: { en: '3 Bedroom', ar: '3 غرف نوم', es: '3 Habitaciones', fr: '3 chambres' } },
      { id: '2br', label: { en: '2 Bedroom', ar: 'غرفتين نوم', es: '2 Habitaciones', fr: '2 chambres' } },
      { id: 'studio', label: { en: 'Studio', ar: 'ستوديو', es: 'Estudio', fr: 'Studio' } },
    ],
    statusOptions: [
      { id: 'available', label: { en: 'Available', ar: 'متاح', es: 'Disponible', fr: 'Disponible' }, color: '#22c55e' },
      { id: 'reserved', label: { en: 'Reserved', ar: 'محجوز', es: 'Reservado', fr: 'Réservé' }, color: '#eab308' },
      { id: 'sold', label: { en: 'Sold', ar: 'مُباع', es: 'Vendido', fr: 'Vendu' }, color: '#ef4444' },
    ],
  },
  salesReps: {
    gulf: [{ id: "rep1", name: "Nadia Al-Harbi" }, { id: "rep2", name: "Faisal Omar" }],
    usa: [{ id: "rep1", name: "Jessica Park" }, { id: "rep2", name: "David Kim" }],
    mexico: [{ id: "rep1", name: "Ana Torres" }, { id: "rep2", name: "Luis Mendez" }],
    canada: [{ id: "rep1", name: "Sophie Martin" }, { id: "rep2", name: "Ryan Cooper" }],
  },

  // --- Tracking Events ---
  events: {
    portalEntry: 'portal_opened',
    itemView: 'view_unit',
    itemDetail: 'unit_detail_opened',
    pricingRequest: 'request_pricing',
    brochureDownload: 'download_brochure',
    booking: 'book_viewing',
    calculator: 'roi_calculator',
    paymentPlan: 'payment_plan_viewed',
    contactAgent: 'contact_agent',
    floorPlan: 'view_floor_plan',
    comparison: 'compare_units',
    favorites: 'add_favorite',
  },

  // --- Intent Weights (scoring) ---
  scoring: {
    weights: {
      portal_opened: 5,
      view_unit: 10,
      unit_detail_opened: 8,
      request_pricing: 15,
      download_brochure: 5,
      book_viewing: 25,
      roi_calculator: 10,
      payment_plan_viewed: 15,
      contact_agent: 20,
      view_floor_plan: 8,
      compare_units: 12,
      add_favorite: 6,
    },
    maxScore: 100,
    thresholds: {
      hot: 70,    // >= 70 = hot lead
      warm: 40,   // >= 40 = warm
      cold: 0,    // < 40 = cold
    },
    labels: {
      hot: { en: 'Hot Lead', ar: 'عميل ساخن', es: 'Lead Caliente', fr: 'Lead Chaud' },
      warm: { en: 'Warm Lead', ar: 'عميل دافئ', es: 'Lead Tibio', fr: 'Lead Ti\u00e8de' },
      cold: { en: 'Cold Lead', ar: 'عميل بارد', es: 'Lead Fr\u00edo', fr: 'Lead Froid' },
    },
  },

  // --- Conversion Funnel ---
  funnel: [
    { id: 'visit', label: { en: 'Portal Visit', ar: 'زيارة البوابة', es: 'Visita al Portal', fr: 'Visite du portail' }, color: '#457b9d' },
    { id: 'browse', label: { en: 'Unit Browsed', ar: 'تصفح الوحدة', es: 'Unidad Explorada', fr: 'Unité explorée' }, color: '#6ba3c7' },
    { id: 'engage', label: { en: 'Pricing / Plan', ar: 'التسعير / الخطة', es: 'Precio / Plan', fr: 'Prix / Plan' }, color: '#eab308' },
    { id: 'intent', label: { en: 'Booking Request', ar: 'طلب حجز', es: 'Solicitud de Visita', fr: 'Demande de visite' }, color: '#f97316' },
    { id: 'convert', label: { en: 'Viewing Booked', ar: 'تم حجز المعاينة', es: 'Visita Reservada', fr: 'Visite réservée' }, color: '#22c55e' },
  ],

  // --- Pipeline Kanban ---
  pipeline: {
    stageLabel: { en: 'Sales Pipeline', ar: 'خط أنابيب المبيعات', es: 'Pipeline de Ventas', fr: 'Pipeline commercial' },
    stages: [
      { id: 'new_lead', label: { en: 'New Lead', ar: 'عميل جديد', es: 'Nuevo Prospecto', fr: 'Nouveau prospect' }, color: '#457b9d' },
      { id: 'contacted', label: { en: 'Contacted', ar: 'تم التواصل', es: 'Contactado', fr: 'Contacté' }, color: '#6ba3c7' },
      { id: 'viewing_scheduled', label: { en: 'Viewing Scheduled', ar: 'معاينة مجدولة', es: 'Visita Programada', fr: 'Visite planifiée' }, color: '#eab308' },
      { id: 'viewing_done', label: { en: 'Viewing Done', ar: 'تمت المعاينة', es: 'Visita Realizada', fr: 'Visite effectuée' }, color: '#f97316' },
      { id: 'negotiation', label: { en: 'Negotiation', ar: 'تفاوض', es: 'Negociación', fr: 'Négociation' }, color: '#a855f7' },
      { id: 'offer_sent', label: { en: 'Offer Sent', ar: 'تم إرسال العرض', es: 'Oferta Enviada', fr: 'Offre envoyée' }, color: '#ec4899' },
      { id: 'closed_won', label: { en: 'Closed Won', ar: 'تم الإغلاق - ربح', es: 'Cerrado Ganado', fr: 'Affaire gagnée' }, color: '#22c55e' },
    ],
    // Auto-advance rules: when a VIP's latest events match, suggest or auto-move their deal
    // Each rule: { events: [...event types], targetStage, minCount, windowHours, onlyForward }
    autoAdvanceRules: [
      { events: ['contact_agent'], targetStage: 'contacted', minCount: 1, windowHours: 168, onlyForward: true },
      { events: ['book_viewing'], targetStage: 'viewing_scheduled', minCount: 1, windowHours: 72, onlyForward: true },
      { events: ['request_pricing'], targetStage: 'negotiation', minCount: 3, windowHours: 168, onlyForward: true },
      { events: ['payment_plan_viewed', 'request_pricing'], targetStage: 'negotiation', minCount: 2, windowHours: 72, onlyForward: true },
    ],
  },

  // --- Campaign Templates ---
  campaignTemplates: [
    {
      id: 'vip_launch',
      label: { en: 'VIP Launch', ar: 'إطلاق VIP', es: 'Lanzamiento VIP', fr: 'Lancement VIP' },
      icon: '🚀',
      objective: 'lead_gen',
      audience: 'vip',
      channel: ['nfc', 'whatsapp'],
      description: { en: 'Premium NFC card distribution for high-intent VIP prospects. Goal: book viewings within 14 days.', ar: 'توزيع بطاقات NFC للعملاء VIP. الهدف: حجز معاينات خلال 14 يوماً.', es: 'Distribución de tarjetas NFC para prospectos VIP. Meta: reservar visitas en 14 días.', fr: 'Distribution de cartes NFC pour prospects VIP. Objectif : réserver des visites sous 14 jours.' },
    },
    {
      id: 're_engage',
      label: { en: 'Re-engagement', ar: 'إعادة التفاعل', es: 'Re-engagement', fr: 'Réengagement' },
      icon: '🔄',
      objective: 're_engage',
      audience: 'warm',
      channel: ['email', 'sms'],
      description: { en: 'Win back idle leads with personalized follow-up. Target: contacts inactive 7+ days.', ar: 'استعادة العملاء غير النشطين بمتابعة مخصصة. الهدف: جهات اتصال غير نشطة 7+ أيام.', es: 'Recuperar leads inactivos con seguimiento personalizado. Objetivo: contactos inactivos 7+ días.', fr: 'Récupérer les leads inactifs avec un suivi personnalisé. Cible : contacts inactifs 7+ jours.' },
    },
    {
      id: 'event_invite',
      label: { en: 'Event Invite', ar: 'دعوة حدث', es: 'Invitación Evento', fr: 'Invitation Événement' },
      icon: '🎪',
      objective: 'event',
      audience: 'all',
      channel: ['nfc', 'email', 'whatsapp'],
      description: { en: 'Exclusive event invitation with NFC access cards. Track RSVPs and attendance via portal.', ar: 'دعوة حصرية مع بطاقات NFC. تتبع الحضور عبر البوابة.', es: 'Invitación exclusiva con tarjetas NFC. Seguimiento de asistencia via portal.', fr: 'Invitation exclusive avec cartes NFC. Suivi des présences via le portail.' },
    },
    {
      id: 'cold_outreach',
      label: { en: 'Cold Outreach', ar: 'تواصل بارد', es: 'Contacto en Frío', fr: 'Prospection' },
      icon: '❄️',
      objective: 'awareness',
      audience: 'cold',
      channel: ['email'],
      description: { en: 'First-touch awareness campaign for new market segments. Low-cost email + landing page.', ar: 'حملة تعريفية للأسواق الجديدة. بريد إلكتروني + صفحة هبوط.', es: 'Campaña de conocimiento para nuevos segmentos. Email + landing page.', fr: 'Campagne de sensibilisation pour nouveaux segments. Email + page d\'atterrissage.' },
    },
  ],

  // --- KPI Cards ---
  kpis: [
    {
      id: 'vip_sessions',
      label: { en: 'VIP Sessions', ar: 'جلسات VIP', es: 'Sesiones VIP', fr: 'Sessions VIP' },
      subtitle: { en: 'Person known via NFC', ar: 'شخص معروف عبر NFC', es: 'Persona identificada por NFC', fr: 'Personne identifiée via NFC' },
      icon: 'user-check',
      color: '#e63946',
    },
    {
      id: 'website_visitors',
      label: { en: 'Website Visitors', ar: 'زوار الموقع', es: 'Visitantes Web', fr: 'Visiteurs du site' },
      subtitle: { en: 'Standard traffic', ar: 'حركة مرور عادية', es: 'Tráfico estándar', fr: 'Trafic standard' },
      icon: 'globe',
      color: '#457b9d',
    },
    {
      id: 'bookings',
      label: { en: 'Viewings Booked', ar: 'معاينات محجوزة', es: 'Visitas Reservadas', fr: 'Visites réservées' },
      subtitle: { en: 'This month', ar: 'هذا الشهر', es: 'Este mes', fr: 'Ce mois-ci' },
      icon: 'calendar',
      color: '#22c55e',
    },
    {
      id: 'conversion_lift',
      label: { en: 'VIP Conversion Lift', ar: 'زيادة تحويل VIP', es: 'Aumento Conversión VIP', fr: 'Gain de conversion VIP' },
      subtitle: { en: 'VIP vs standard rate', ar: 'VIP مقابل المعدل العادي', es: 'VIP vs tasa estándar', fr: 'VIP vs taux standard' },
      icon: 'trending-up',
      color: '#f97316',
    },
  ],

  // --- VIP Profile Labels ---
  vipProfile: {
    whyCallNow: { en: 'Why Call Now?', ar: 'لماذا الاتصال الآن؟', es: '¿Por qué llamar ahora?', fr: 'Pourquoi appeler maintenant ?' },
    topItem: { en: 'Top Unit', ar: 'الوحدة المفضلة', es: 'Unidad Principal', fr: 'Unité principale' },
    lastSeen: { en: 'Last Seen', ar: 'آخر ظهور', es: 'Última Visita', fr: 'Dernière activité' },
    nextBestAction: { en: 'Next Best Action', ar: 'أفضل إجراء تالي', es: 'Siguiente Mejor Acción', fr: 'Prochaine meilleure action' },
  },

  // --- i18n namespace ---
  i18nNamespace: 'dashboard',
};


// ─── AUTOMOTIVE SECTOR ───────────────────────────────────────

const AUTOMOTIVE = {
  id: 'automotive',

  // --- Identity ---
  identity: {
    sectorLabel: { en: 'Automotive', ar: 'السيارات', es: 'Automotriz', fr: 'Automobile' },
    defaultProject: {
      name: { en: 'Prestige Motors', ar: 'بريستيج موتورز', es: 'Prestige Motors', fr: 'Prestige Motors' },
      currency: 'SAR',
      currencySymbol: '\uFDFC',
      locale: 'ar-SA',
    },
    alternateProject: {
      name: { en: 'Prestige Motors Vancouver', ar: 'بريستيج موتورز فانكوفر', es: 'Prestige Motors Vancouver', fr: 'Prestige Motors Vancouver' },
      currency: 'CAD',
      currencySymbol: '$',
      locale: 'en-CA',
    },
    dashboardTitle: { en: 'Dealer Intelligence Center', ar: 'مركز ذكاء الوكيل', es: 'Centro de Inteligencia del Concesionario', fr: 'Centre d\'Intelligence Concessionnaire' },
    theme: 'dark_luxury',
  },

  // --- Inventory ---
  inventory: {
    itemLabel: { en: 'Vehicle', ar: 'مركبة', es: 'Vehículo', fr: 'Véhicule' },
    itemLabelPlural: { en: 'Vehicles', ar: 'مركبات', es: 'Vehículos', fr: 'Véhicules' },
    categoryLabel: { en: 'Collection', ar: 'مجموعة', es: 'Colección', fr: 'Collection' },
    categoryLabelPlural: { en: 'Collections', ar: 'مجموعات', es: 'Colecciones', fr: 'Collections' },
    categories: [
      { id: 'luxury_sedan', name: { en: 'Luxury Sedan', ar: 'سيدان فاخرة', es: 'Sedán de Lujo', fr: 'Berline de luxe' } },
      { id: 'performance', name: { en: 'Performance', ar: 'أداء', es: 'Alto Rendimiento', fr: 'Performance' } },
      { id: 'suv', name: { en: 'Luxury SUV', ar: 'SUV فاخرة', es: 'SUV de Lujo', fr: 'SUV de luxe' } },
      { id: 'electric', name: { en: 'Electric', ar: 'كهربائية', es: 'Eléctrico', fr: 'Électrique' } },
    ],
    typeFilters: [
      { id: 'all', label: { en: 'All', ar: 'الكل', es: 'Todos', fr: 'Tous' } },
      { id: 'sedan', label: { en: 'Sedan', ar: 'سيدان', es: 'Sedán', fr: 'Berline' } },
      { id: 'suv', label: { en: 'SUV', ar: 'SUV', es: 'SUV', fr: 'SUV' } },
      { id: 'coupe', label: { en: 'Coupé', ar: 'كوبيه', es: 'Coupé', fr: 'Coupé' } },
      { id: 'electric', label: { en: 'Electric', ar: 'كهربائية', es: 'Eléctrico', fr: 'Électrique' } },
    ],
    statusOptions: [
      { id: 'in_stock', label: { en: 'In Stock', ar: 'متوفر', es: 'En Stock', fr: 'En stock' }, color: '#22c55e' },
      { id: 'reserved', label: { en: 'Reserved', ar: 'محجوز', es: 'Reservado', fr: 'Réservé' }, color: '#eab308' },
      { id: 'sold', label: { en: 'Sold', ar: 'مُباع', es: 'Vendido', fr: 'Vendu' }, color: '#ef4444' },
      { id: 'incoming', label: { en: 'Incoming', ar: 'قادم', es: 'En Camino', fr: 'Arrivage' }, color: '#457b9d' },
    ],
  },
  salesReps: {
    gulf: [{ id: "rep1", name: "Hassan Khaleel" }, { id: "rep2", name: "Sara Mansouri" }],
    usa: [{ id: "rep1", name: "Brian Clark" }, { id: "rep2", name: "Megan Torres" }],
    mexico: [{ id: "rep1", name: "Roberto Sanchez" }, { id: "rep2", name: "Carmen Diaz" }],
    canada: [{ id: "rep1", name: "Marc Tremblay" }, { id: "rep2", name: "Karen Lee" }],
  },

  // --- Tracking Events ---
  events: {
    portalEntry: 'auto_portal_entry',
    itemView: 'vehicle_view',
    itemDetail: 'vehicle_detail_opened',
    pricingRequest: 'request_quote',
    brochureDownload: 'download_brochure',
    booking: 'test_drive_request',
    calculator: 'finance_calculator',
    paymentPlan: 'lease_plan_viewed',
    contactAgent: 'contact_advisor',
    floorPlan: 'view_specs',       // automotive equivalent: spec sheet
    comparison: 'compare_vehicles',
    favorites: 'save_configuration',
  },

  // --- Intent Weights (scoring) ---
  scoring: {
    weights: {
      auto_portal_entry: 5,
      vehicle_view: 8,
      vehicle_detail_opened: 10,
      request_quote: 15,
      download_brochure: 5,
      test_drive_request: 25,
      finance_calculator: 12,
      lease_plan_viewed: 15,
      contact_advisor: 20,
      view_specs: 8,
      compare_vehicles: 10,
      save_configuration: 10,
    },
    maxScore: 100,
    thresholds: {
      hot: 70,
      warm: 40,
      cold: 0,
    },
    labels: {
      hot: { en: 'Hot Lead', ar: 'عميل ساخن', es: 'Lead Caliente', fr: 'Lead Chaud' },
      warm: { en: 'Warm Lead', ar: 'عميل دافئ', es: 'Lead Tibio', fr: 'Lead Ti\u00e8de' },
      cold: { en: 'Cold Lead', ar: 'عميل بارد', es: 'Lead Fr\u00edo', fr: 'Lead Froid' },
    },
  },

  // --- Conversion Funnel ---
  funnel: [
    { id: 'visit', label: { en: 'Showroom Visit', ar: 'زيارة صالة العرض', es: 'Visita al Showroom', fr: 'Visite du showroom' }, color: '#457b9d' },
    { id: 'browse', label: { en: 'Vehicle Explored', ar: 'استكشاف المركبة', es: 'Vehículo Explorado', fr: 'Véhicule exploré' }, color: '#6ba3c7' },
    { id: 'engage', label: { en: 'Quote / Finance', ar: 'عرض سعر / تمويل', es: 'Cotización / Financiamiento', fr: 'Devis / Financement' }, color: '#eab308' },
    { id: 'intent', label: { en: 'Test Drive Request', ar: 'طلب تجربة قيادة', es: 'Solicitud de Prueba', fr: 'Demande d’essai routier' }, color: '#f97316' },
    { id: 'convert', label: { en: 'Purchase / Lease', ar: 'شراء / تأجير', es: 'Compra / Arrendamiento', fr: 'Achat / Location' }, color: '#22c55e' },
  ],

  // --- Pipeline Kanban ---
  pipeline: {
    stageLabel: { en: 'Sales Pipeline', ar: 'خط أنابيب المبيعات', es: 'Pipeline de Ventas', fr: 'Pipeline commercial' },
    stages: [
      { id: 'new_lead', label: { en: 'New Lead', ar: 'عميل جديد', es: 'Nuevo Prospecto', fr: 'Nouveau prospect' }, color: '#457b9d' },
      { id: 'contacted', label: { en: 'Contacted', ar: 'تم التواصل', es: 'Contactado', fr: 'Contacté' }, color: '#6ba3c7' },
      { id: 'test_drive', label: { en: 'Test Drive', ar: 'تجربة قيادة', es: 'Prueba de Manejo', fr: 'Essai routier' }, color: '#eab308' },
      { id: 'quote_sent', label: { en: 'Quote Sent', ar: 'تم إرسال العرض', es: 'Cotización Enviada', fr: 'Devis envoyé' }, color: '#f97316' },
      { id: 'negotiation', label: { en: 'Negotiation', ar: 'تفاوض', es: 'Negociación', fr: 'Négociation' }, color: '#a855f7' },
      { id: 'financing', label: { en: 'Financing', ar: 'تمويل', es: 'Financiamiento', fr: 'Financement' }, color: '#ec4899' },
      { id: 'closed_won', label: { en: 'Closed Won', ar: 'تم الإغلاق - ربح', es: 'Cerrado Ganado', fr: 'Affaire gagnée' }, color: '#22c55e' },
    ],
    autoAdvanceRules: [
      { events: ['contact_advisor'], targetStage: 'contacted', minCount: 1, windowHours: 168, onlyForward: true },
      { events: ['test_drive_request'], targetStage: 'test_drive', minCount: 1, windowHours: 72, onlyForward: true },
      { events: ['request_quote'], targetStage: 'quote_sent', minCount: 1, windowHours: 72, onlyForward: true },
      { events: ['request_quote', 'finance_calculator'], targetStage: 'negotiation', minCount: 3, windowHours: 168, onlyForward: true },
    ],
  },

  // --- Campaign Templates ---
  campaignTemplates: [
    {
      id: 'vip_launch',
      label: { en: 'VIP Launch', ar: 'إطلاق VIP', es: 'Lanzamiento VIP', fr: 'Lancement VIP' },
      icon: '🚀',
      objective: 'lead_gen',
      audience: 'vip',
      channel: ['nfc', 'whatsapp'],
      description: { en: 'Premium NFC card distribution for VIP collectors and clients. Goal: book test drives within 14 days.', ar: 'توزيع بطاقات NFC لعملاء VIP. الهدف: حجز تجارب قيادة خلال 14 يوماً.', es: 'Distribución de tarjetas NFC para clientes VIP. Meta: reservar pruebas en 14 días.', fr: 'Distribution de cartes NFC pour clients VIP. Objectif : réserver des essais sous 14 jours.' },
    },
    {
      id: 're_engage',
      label: { en: 'Re-engagement', ar: 'إعادة التفاعل', es: 'Re-engagement', fr: 'Réengagement' },
      icon: '🔄',
      objective: 're_engage',
      audience: 'warm',
      channel: ['email', 'sms'],
      description: { en: 'Win back idle leads with personalized vehicle offers. Target: contacts inactive 7+ days.', ar: 'استعادة العملاء غير النشطين بعروض مخصصة. الهدف: جهات اتصال غير نشطة 7+ أيام.', es: 'Recuperar leads inactivos con ofertas personalizadas. Objetivo: contactos inactivos 7+ días.', fr: 'Récupérer les leads inactifs avec des offres personnalisées. Cible : contacts inactifs 7+ jours.' },
    },
    {
      id: 'showroom_event',
      label: { en: 'Showroom Event', ar: 'حدث صالة العرض', es: 'Evento Showroom', fr: 'Événement Showroom' },
      icon: '🎪',
      objective: 'event',
      audience: 'all',
      channel: ['nfc', 'email', 'whatsapp'],
      description: { en: 'Exclusive showroom launch event with NFC access. Track RSVPs and test drive bookings.', ar: 'حدث إطلاق حصري مع بطاقات NFC. تتبع الحضور وحجوزات تجربة القيادة.', es: 'Evento exclusivo de showroom con acceso NFC. Seguimiento de asistencia y pruebas.', fr: 'Événement exclusif showroom avec accès NFC. Suivi des présences et essais.' },
    },
    {
      id: 'cold_outreach',
      label: { en: 'Cold Outreach', ar: 'تواصل بارد', es: 'Contacto en Frío', fr: 'Prospection' },
      icon: '❄️',
      objective: 'awareness',
      audience: 'cold',
      channel: ['email'],
      description: { en: 'First-touch awareness campaign for new market segments. Low-cost email + landing page.', ar: 'حملة تعريفية للأسواق الجديدة. بريد إلكتروني + صفحة هبوط.', es: 'Campaña de conocimiento para nuevos segmentos. Email + landing page.', fr: 'Campagne de sensibilisation pour nouveaux segments. Email + page d\'atterrissage.' },
    },
  ],

  // --- KPI Cards ---
  kpis: [
    {
      id: 'vip_sessions',
      label: { en: 'VIP Sessions', ar: 'جلسات VIP', es: 'Sesiones VIP', fr: 'Sessions VIP' },
      subtitle: { en: 'Person known via NFC', ar: 'شخص معروف عبر NFC', es: 'Persona identificada por NFC', fr: 'Personne identifiée via NFC' },
      icon: 'user-check',
      color: '#e63946',
    },
    {
      id: 'website_visitors',
      label: { en: 'Showroom Visitors', ar: 'زوار صالة العرض', es: 'Visitantes del Showroom', fr: 'Visiteurs du showroom' },
      subtitle: { en: 'Standard traffic', ar: 'حركة مرور عادية', es: 'Tráfico estándar', fr: 'Trafic standard' },
      icon: 'globe',
      color: '#457b9d',
    },
    {
      id: 'bookings',
      label: { en: 'Test Drives Booked', ar: 'تجارب قيادة محجوزة', es: 'Pruebas Reservadas', fr: 'Essais routiers réservés' },
      subtitle: { en: 'This month', ar: 'هذا الشهر', es: 'Este mes', fr: 'Ce mois-ci' },
      icon: 'car',
      color: '#22c55e',
    },
    {
      id: 'conversion_lift',
      label: { en: 'VIP Conversion Lift', ar: 'زيادة تحويل VIP', es: 'Aumento Conversión VIP', fr: 'Gain de conversion VIP' },
      subtitle: { en: 'VIP vs standard rate', ar: 'VIP مقابل المعدل العادي', es: 'VIP vs tasa estándar', fr: 'VIP vs taux standard' },
      icon: 'trending-up',
      color: '#f97316',
    },
  ],

  // --- VIP Profile Labels ---
  vipProfile: {
    whyCallNow: { en: 'Why Call Now?', ar: 'لماذا الاتصال الآن؟', es: '¿Por qué llamar ahora?', fr: 'Pourquoi appeler maintenant ?' },
    topItem: { en: 'Top Model', ar: 'الموديل الأعلى', es: 'Modelo Principal', fr: 'Modèle principal' },
    lastSeen: { en: 'Last Seen', ar: 'آخر ظهور', es: 'Última Visita', fr: 'Dernière activité' },
    nextBestAction: { en: 'Next Best Action', ar: 'أفضل إجراء تالي', es: 'Siguiente Mejor Acción', fr: 'Prochaine meilleure action' },
  },

  // --- i18n namespace ---
  i18nNamespace: 'autoDashboard',
};

// ─── YACHT SECTOR ────────────────────────────────────────────
const YACHT = {
  ...AUTOMOTIVE,
  id: "yacht",
  identity: {
    ...AUTOMOTIVE.identity,
    sectorLabel: { en: "Yacht", ar: "اليخوت", es: "Yate", fr: "Yacht" },
    defaultProject: {
      name: { en: "Gulf Marina Yachts", ar: "يخوت مارينا الخليج", es: "Yates Marina del Golfo", fr: "Yachts Marina du Golfe" },
      currency: "SAR",
      currencySymbol: "\uFDFC",
      locale: "ar-SA",
    },
    alternateProject: {
      name: { en: "Pacific Marina Yachts", ar: "يخوت مارينا الباسيفيك", es: "Yates Marina Pacífico", fr: "Yachts Marina Pacifique" },
      currency: "CAD",
      currencySymbol: "$",
      locale: "en-CA",
    },
    dashboardTitle: {
      en: "Yacht Intelligence Center",
      ar: "مركز ذكاء اليخوت",
      es: "Centro de Inteligencia de Yates",
      fr: "Centre d'Intelligence Yacht",
    },
  },
  inventory: {
    ...AUTOMOTIVE.inventory,
    itemLabel: { en: "Yacht", ar: "يخت", es: "Yate", fr: "Yacht" },
    itemLabelPlural: { en: "Yachts", ar: "يخوت", es: "Yates", fr: "Yachts" },
    categoryLabel: { en: "Class", ar: "الفئة", es: "Clase", fr: "Classe" },
    categoryLabelPlural: { en: "Classes", ar: "الفئات", es: "Clases", fr: "Classes" },
  },
  i18nNamespace: "yachtDashboard",
};


// ─── SHARED UTILITIES ────────────────────────────────────────

/**
 * Get sector config by ID
 * @param {'real_estate' | 'automotive' | 'yacht'} sectorId
 * @returns {object} sector config
 */
export function getSectorConfig(sectorId) {
  const configs = {
    real_estate: REAL_ESTATE,
    automotive: AUTOMOTIVE,
    yacht: YACHT,
  };
  return configs[sectorId] || REAL_ESTATE;
}

/**
 * Get all available sectors (for dropdown/selector)
 * @returns {Array<{id: string, label: object}>}
 */
export function getAvailableSectors() {
  return [
    { id: 'real_estate', label: REAL_ESTATE.identity.sectorLabel },
    { id: 'automotive', label: AUTOMOTIVE.identity.sectorLabel },
    { id: 'yacht', label: YACHT.identity.sectorLabel },
  ];
}

/**
 * Bilingual text helper — resolves { en, ar, es, fr } objects to current language.
 * @param {object} bilingualObj - e.g. { en: "Tower", ar: "البرج" }
 * @param {string} lang - Language code
 * @returns {string}
 */
export function t(bilingualObj, lang = "en") {
  if (!bilingualObj) return "";
  if (typeof bilingualObj === "string") return bilingualObj;
  return bilingualObj[lang] || bilingualObj.en || Object.values(bilingualObj)[0] || "";
}

/**
 * Calculate lead score from events array using sector-specific weights
 * @param {Array} events - Array of event objects with { type, timestamp }
 * @param {string} sectorId - Sector to use for weights
 * @returns {number} score (0-100)
 */
export function calculateLeadScore(events, sectorId) {
  const config = getSectorConfig(sectorId);
  const weights = config.scoring.weights;

  let rawScore = 0;
  events.forEach(event => {
    const weight = weights[event.type] || 0;
    rawScore += weight;
  });

  // Cap at maxScore
  return Math.min(rawScore, config.scoring.maxScore);
}

/**
 * Time-decay lead score — recent events matter more.
 * 7-day half-life: event from 7 days ago = 50% weight, 14 days = 25%, etc.
 * Also applies diminishing returns: same event type 3+ times = reduced weight.
 * @param {Array} events - Array of { type, timestamp }
 * @param {string} sectorId
 * @returns {number} score (0-100)
 */
export function calculateDecayedScore(events, sectorId) {
  const config = getSectorConfig(sectorId);
  const weights = config.scoring.weights;
  const HALF_LIFE_MS = 7 * 86400000;
  const now = Date.now();

  const typeCounts = {};
  let rawScore = 0;

  const sorted = [...events].sort((a, b) => {
    const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return tb - ta;
  });

  sorted.forEach((event) => {
    const baseWeight = weights[event.type] || 0;
    if (baseWeight === 0) return;

    const ts = event.timestamp instanceof Date ? event.timestamp.getTime() : new Date(event.timestamp).getTime();
    const age = now - ts;
    const decayFactor = Math.pow(0.5, age / HALF_LIFE_MS);

    typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    const count = typeCounts[event.type];
    const diminish = count <= 2 ? 1 : count === 3 ? 0.5 : 0.25;

    rawScore += baseWeight * decayFactor * diminish;
  });

  return Math.min(Math.round(rawScore), config.scoring.maxScore);
}

/**
 * Calculate engagement velocity metrics for a lead
 * Returns idle days, total sessions, and events-per-day rate
 * @param {Array} events - Sorted events (newest first)
 * @param {string} sectorId
 * @returns {{ idleDays: number, totalSessions: number, eventsPerDay: number }}
 */
export function calculateVelocity(events, sectorId) {
  if (!events || events.length === 0) {
    return { idleDays: Infinity, totalSessions: 0, eventsPerDay: 0 };
  }

  const now = Date.now();

  // Idle days: time since most recent event
  const lastTs = events[0].timestamp instanceof Date
    ? events[0].timestamp.getTime()
    : new Date(events[0].timestamp).getTime();
  const idleDays = Math.max(0, Math.floor((now - lastTs) / 86400000));

  // Total sessions: count distinct calendar days with activity
  const uniqueDays = new Set();
  events.forEach((e) => {
    const ts = e.timestamp instanceof Date ? e.timestamp.getTime() : new Date(e.timestamp).getTime();
    uniqueDays.add(Math.floor(ts / 86400000));
  });
  const totalSessions = uniqueDays.size;

  // Events per day: rate over the observation window
  const firstTs = events[events.length - 1].timestamp instanceof Date
    ? events[events.length - 1].timestamp.getTime()
    : new Date(events[events.length - 1].timestamp).getTime();
  const windowDays = Math.max(1, (now - firstTs) / 86400000);
  const eventsPerDay = Math.round((events.length / windowDays) * 10) / 10;

  return { idleDays, totalSessions, eventsPerDay };
}

/**
 * Detect sales triggers from event history
 * Returns array of trigger objects with type, severity, message
 * @param {Array} events - Sorted events (newest first)
 * @param {string} sectorId
 * @param {string} lang - 'en' or 'ar'
 * @returns {Array<{type: string, severity: 'high'|'medium'|'low', message: object}>}
 */
export function detectSalesTriggers(events, sectorId, lang = "en") {
  const config = getSectorConfig(sectorId);
  const triggers = [];
  const now = Date.now();

  const inWindow = (hrs) =>
    events.filter((e) => {
      const ts = e.timestamp instanceof Date ? e.timestamp.getTime() : new Date(e.timestamp).getTime();
      return now - ts < hrs * 3600000;
    });

  const last24h = inWindow(24);
  const last48h = inWindow(48);
  const last7d = inWindow(168);

  const pricingEvent = config.events.pricingRequest;
  const pricingCount = last24h.filter((e) => e.type === pricingEvent).length;
  if (pricingCount >= 3) {
    triggers.push({
      type: "pricing_3x",
      severity: "high",
      icon: "🔥",
      message: {
        en: `Viewed pricing ${pricingCount} times in 24h — strong buying signal`,
        ar: `شاهد التسعير ${pricingCount} مرات في 24 ساعة — إشارة شراء قوية`,
      },
    });
  }

  const bookingEvent = config.events.booking;
  if (last48h.some((e) => e.type === bookingEvent)) {
    triggers.push({
      type: "booking_request",
      severity: "high",
      icon: "📋",
      message: {
        en: sectorId === "automotive" ? "Requested a test drive — follow up immediately" : "Requested a viewing — follow up immediately",
        ar: sectorId === "automotive" ? "طلب تجربة قيادة — تابع فوراً" : "طلب معاينة — تابع فوراً",
      },
    });
  }

  const lastHour = inWindow(1);
  if (lastHour.length >= 5) {
    triggers.push({
      type: "high_velocity",
      severity: "high",
      icon: "⚡",
      message: {
        en: `${lastHour.length} actions in the last hour — actively browsing NOW`,
        ar: `${lastHour.length} إجراء في الساعة الأخيرة — يتصفح الآن`,
      },
    });
  }

  if (events.length > 0) {
    const lastEventTs = events[0].timestamp instanceof Date ? events[0].timestamp.getTime() : new Date(events[0].timestamp).getTime();
    const idleDays = Math.floor((now - lastEventTs) / 86400000);
    if (idleDays >= 5) {
      triggers.push({
        type: "idle_lead",
        severity: "medium",
        icon: "💤",
        message: {
          en: `No activity for ${idleDays} days — consider a re-engagement campaign`,
          ar: `لا نشاط لمدة ${idleDays} أيام — فكر في حملة إعادة تفاعل`,
        },
      });
    }
  }

  const repeatVisitCount = last7d.length;
  if (repeatVisitCount >= 8) {
    triggers.push({
      type: "repeat_visitor",
      severity: "medium",
      icon: "🔄",
      message: {
        en: `${repeatVisitCount} interactions in 7 days — high engagement`,
        ar: `${repeatVisitCount} تفاعل في 7 أيام — تفاعل عالي`,
      },
    });
  }

  return triggers;
}

/**
 * Get lead temperature label and level from score
 * @param {number} score - 0-100
 * @param {string} sectorId
 * @param {string} lang
 * @param {object} thresholds - optional { hot, warm }
 * @returns {{ level: string, label: string, color: string }}
 */
export function getLeadTemperature(score, sectorId, lang = "en", thresholds = {}) {
  const hot = thresholds?.hot ?? 70;
  const warm = thresholds?.warm ?? 40;

  const labels = {
    hot: { en: "Hot Lead", ar: "عميل ساخن", es: "Lead caliente", fr: "Prospect chaud" },
    warm: { en: "Warm Lead", ar: "عميل دافئ", es: "Lead templado", fr: "Prospect tiède" },
    cold: { en: "Cold Lead", ar: "عميل بارد", es: "Lead frío", fr: "Prospect froid" },
  };
  const colors = { hot: "#e63946", warm: "#e9c46a", cold: "#457b9d" };

  let level = "cold";
  if (score >= hot) level = "hot";
  else if (score >= warm) level = "warm";

  return {
    level,
    label: labels[level]?.[lang] || labels[level]?.en || level,
    color: colors[level],
  };
}

/**
 * Map a generic event name to its sector-specific event type
 * @param {string} genericName - e.g. 'booking', 'pricing'
 * @param {string} sectorId
 * @returns {string}
 */
export function mapEvent(genericName, sectorId) {
  const config = getSectorConfig(sectorId);
  return config?.events?.[genericName] || genericName;
}
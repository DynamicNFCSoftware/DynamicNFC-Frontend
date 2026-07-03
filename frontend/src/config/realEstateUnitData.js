// ═══════════════════════════════════════════════════════════════════════════
// REAL ESTATE UNIT DATA — Canonical + Region Overlay (Phase 2c.RE)
//
// Single source of truth for the 3 RE demo portals (VIPPortal, AhmedPortal,
// MarketplacePortal). Replaces the per-portal local `UNITS / AMENITIES /
// INVEST` arrays that were shaped `{ en, ar }` bilingual.
//
// Pattern:
//   - Canonical: numeric / structural fields (id, type, bedNum, ...).
//   - Region overlay: every localizable string, indexed by [regionId][unitId]
//     with leaves shaped `{ en, ar, es, fr }`.
//   - Helpers: `getLuxuryUnits` / `getFamilyUnits` / `getAmenities` /
//     `getInvestStats` return per-region, per-language flattened arrays
//     ready for direct render. EN fallback when a translation is missing.
//
// Out of scope (still bilingual, handled with `tr()` in portal files):
//   - floorPlan.rooms[].label
//   - payment.plans labels
// These migrate in Phase 2d.
// ═══════════════════════════════════════════════════════════════════════════

// ─── LUXURY tier (VIPPortal + MarketplacePortal shared canonical) ──────────

export const UNITS_LUXURY = [
  {
    id: "lux-ph",
    type: "penthouse",
    bedNum: 4,
    bathNum: 5,
    sqftBase: 6200,
    priceBase: 12500000,
    statusColor: "#2D8F6F",
  },
  {
    id: "lux-grand",
    type: "3br",
    bedNum: 3,
    bathNum: 4,
    sqftBase: 4100,
    priceBase: 7800000,
    statusColor: "#2D8F6F",
  },
  {
    id: "lux-exec",
    type: "2br",
    bedNum: 2,
    bathNum: 3,
    sqftBase: 2800,
    priceBase: 4200000,
    statusColor: "#e63946",
  },
];

export const UNIT_REGION_OVERLAY_LUXURY = {
  // ── GULF — Al Noor Residences (Riyadh)
  gulf: {
    "lux-ph": {
      name: { en: "Sky Penthouse", ar: "بنتهاوس السماء", es: "Penthouse del Cielo", fr: "Penthouse Sky" },
      tower: { en: "Al Qamar Tower", ar: "برج القمر", es: "Torre Al Qamar", fr: "Tour Al Qamar" },
      floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤", es: "Piso 42–44", fr: "Étage 42–44" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "5 Bathrooms", ar: "٥ حمامات", es: "5 Baños", fr: "5 Salles de bain" },
      size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²", es: "6,200 pies²", fr: "6 200 pi²" },
      feature: { en: "360° Arabian Gulf Panoramic", ar: "إطلالة بانورامية ٣٦٠° على الخليج العربي", es: "Vista Panorámica 360° del Golfo Arábigo", fr: "Vue Panoramique 360° sur le Golfe Arabique" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Penthouse", ar: "بنتهاوس", es: "Penthouse", fr: "Penthouse" },
      view: { en: "360° Arabian Gulf Panoramic", ar: "بانورامية ٣٦٠° الخليج العربي", es: "Panorámica 360° Golfo Arábigo", fr: "Panoramique 360° Golfe Arabique" },
      desc: {
        en: "A triple-height masterpiece crowning Al Qamar Tower. Private infinity pool, direct elevator access, Italian marble throughout, and a wraparound terrace with unobstructed 360° views of the Arabian Gulf.",
        ar: "تحفة معمارية بارتفاع ثلاثي تتوّج برج القمر. مسبح إنفينيتي خاص، مصعد مباشر، رخام إيطالي في كل مكان، وتراس محيطي بإطلالة ٣٦٠° خلابة على الخليج العربي.",
        es: "Una obra maestra de triple altura que corona la Torre Al Qamar. Piscina infinita privada, acceso directo en ascensor, mármol italiano en toda la residencia, y una terraza envolvente con vistas panorámicas 360° del Golfo Arábigo.",
        fr: "Un chef-d'œuvre à triple hauteur couronnant la Tour Al Qamar. Piscine à débordement privée, accès direct par ascenseur, marbre italien partout, et une terrasse enveloppante offrant des vues panoramiques 360° sur le Golfe Arabique.",
      },
      features: {
        en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
        ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
        es: ["Piscina Privada", "Casa Inteligente", "Bodega de Vino", "Cuarto del Personal", "Garage Privado"],
        fr: ["Piscine Privée", "Domotique", "Cave à Vin", "Quartiers du Personnel", "Garage Privé"],
      },
    },
    "lux-grand": {
      name: { en: "Grand Residence", ar: "الإقامة الكبرى", es: "Gran Residencia", fr: "Grande Résidence" },
      tower: { en: "Al Safwa Tower", ar: "برج الصفوة", es: "Torre Al Safwa", fr: "Tour Al Safwa" },
      floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨", es: "Piso 35–38", fr: "Étage 35–38" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²", es: "4,100 pies²", fr: "4 100 pi²" },
      feature: { en: "Marina & Sea View", ar: "إطلالة على المارينا والبحر", es: "Vista al Puerto y al Mar", fr: "Vue sur la Marina et la Mer" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Grand Residence", ar: "إقامة كبرى", es: "Gran Residencia", fr: "Grande Résidence" },
      view: { en: "Marina & Sea", ar: "مارينا وبحر", es: "Puerto y Mar", fr: "Marina et Mer" },
      desc: {
        en: "Expansive living at Al Safwa Tower with floor-to-ceiling glazing, Italian marble throughout, a private terrace overlooking the marina, and a chef's kitchen with premium European appliances.",
        ar: "مساحة معيشة واسعة في برج الصفوة مع زجاج من الأرض إلى السقف، رخام إيطالي، تراس خاص يطل على المارينا، ومطبخ الشيف بأجهزة أوروبية فاخرة.",
        es: "Amplios espacios en Torre Al Safwa con cristalería de piso a techo, mármol italiano en toda la residencia, una terraza privada con vista al puerto, y cocina de chef con electrodomésticos europeos de primera línea.",
        fr: "Espaces de vie spacieux à la Tour Al Safwa avec vitrage du sol au plafond, marbre italien partout, une terrasse privée surplombant la marina, et une cuisine de chef équipée d'appareils européens haut de gamme.",
      },
      features: {
        en: ["Marina View", "Maid's Room", "Walk-in Closet", "Home Office", "Balcony"],
        ar: ["إطلالة المارينا", "غرفة الخادمة", "غرفة ملابس", "مكتب منزلي", "شرفة"],
        es: ["Vista al Puerto", "Cuarto de Servicio", "Vestidor", "Oficina en Casa", "Balcón"],
        fr: ["Vue Marina", "Chambre de Bonne", "Dressing", "Bureau à Domicile", "Balcon"],
      },
    },
    "lux-exec": {
      name: { en: "Executive Suite", ar: "الجناح التنفيذي", es: "Suite Ejecutiva", fr: "Suite Exécutive" },
      tower: { en: "Al Rawda Tower", ar: "برج الروضة", es: "Torre Al Rawda", fr: "Tour Al Rawda" },
      floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠", es: "Piso 25–30", fr: "Étage 25–30" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²", es: "2,800 pies²", fr: "2 800 pi²" },
      feature: { en: "City Skyline View", ar: "إطلالة على أفق المدينة", es: "Vista al Skyline de la Ciudad", fr: "Vue sur les Gratte-ciels" },
      status: { en: "Last 3 Units", ar: "آخر ٣ وحدات", es: "Últimas 3 Unidades", fr: "3 Dernières Unités" },
      category: { en: "Executive Suite", ar: "جناح تنفيذي", es: "Suite Ejecutiva", fr: "Suite Exécutive" },
      view: { en: "City Skyline", ar: "أفق المدينة", es: "Skyline Urbano", fr: "Gratte-ciels Urbains" },
      desc: {
        en: "Refined elegance for the modern executive at Al Rawda Tower. Features a dedicated home office, walk-in wardrobe, chef's kitchen with premium appliances, and floor-to-ceiling windows framing the Riyadh skyline.",
        ar: "أناقة راقية للتنفيذي العصري في برج الروضة. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة فاخرة، ونوافذ من الأرض إلى السقف تؤطر أفق الرياض.",
        es: "Elegancia refinada para el ejecutivo moderno en Torre Al Rawda. Cuenta con oficina dedicada, vestidor, cocina de chef con electrodomésticos premium, y ventanales de piso a techo que enmarcan el skyline de Riad.",
        fr: "Élégance raffinée pour le cadre moderne à la Tour Al Rawda. Comprend un bureau dédié, un dressing, une cuisine de chef avec appareils haut de gamme, et des baies vitrées du sol au plafond encadrant les gratte-ciels de Riyad.",
      },
      features: {
        en: ["City View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
        ar: ["إطلالة المدينة", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
        es: ["Vista a la Ciudad", "Oficina en Casa", "Acceso al Gimnasio", "Conserjería", "Cerradura Inteligente"],
        fr: ["Vue sur la Ville", "Bureau à Domicile", "Accès Salle de Sport", "Conciergerie", "Serrure Connectée"],
      },
    },
  },

  // ── USA — Manhattan (Hudson Yards / Park Avenue corridor)
  usa: {
    "lux-ph": {
      name: { en: "Skyline Penthouse", ar: "بنتهاوس الأفق", es: "Penthouse Skyline", fr: "Penthouse Skyline" },
      tower: { en: "Manhattan Tower", ar: "برج مانهاتن", es: "Torre Manhattan", fr: "Tour Manhattan" },
      floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤", es: "Piso 42–44", fr: "Étage 42–44" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "5 Bathrooms", ar: "٥ حمامات", es: "5 Baños", fr: "5 Salles de bain" },
      size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²", es: "6,200 pies²", fr: "6 200 pi²" },
      feature: { en: "Manhattan Skyline Panoramic", ar: "إطلالة بانورامية على أفق مانهاتن", es: "Vista Panorámica del Skyline de Manhattan", fr: "Vue Panoramique sur le Skyline de Manhattan" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Penthouse", ar: "بنتهاوس", es: "Penthouse", fr: "Penthouse" },
      view: { en: "Manhattan Skyline Panoramic", ar: "بانورامية أفق مانهاتن", es: "Panorámica del Skyline de Manhattan", fr: "Panoramique Skyline de Manhattan" },
      desc: {
        en: "A triple-height masterpiece crowning Manhattan Tower. Private rooftop pool, direct elevator access, Italian marble throughout, and a wraparound terrace with unobstructed views of the Manhattan skyline and Hudson River.",
        ar: "تحفة معمارية بارتفاع ثلاثي تتوّج برج مانهاتن. مسبح خاص على السطح، مصعد مباشر، رخام إيطالي، وتراس محيطي بإطلالة خلابة على أفق مانهاتن ونهر هدسون.",
        es: "Una obra maestra de triple altura que corona la Torre Manhattan. Piscina privada en azotea, acceso directo en ascensor, mármol italiano en toda la residencia, y una terraza envolvente con vistas inigualables al skyline de Manhattan y al río Hudson.",
        fr: "Un chef-d'œuvre à triple hauteur couronnant la Tour Manhattan. Piscine privée sur le toit, accès direct par ascenseur, marbre italien partout, et une terrasse enveloppante offrant des vues imprenables sur le skyline de Manhattan et le fleuve Hudson.",
      },
      features: {
        en: ["Rooftop Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
        ar: ["مسبح على السطح", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
        es: ["Piscina en Azotea", "Casa Inteligente", "Bodega de Vino", "Cuarto del Personal", "Garage Privado"],
        fr: ["Piscine sur Toit", "Domotique", "Cave à Vin", "Quartiers du Personnel", "Garage Privé"],
      },
    },
    "lux-grand": {
      name: { en: "Park Avenue Residence", ar: "إقامة بارك أفنيو", es: "Residencia Park Avenue", fr: "Résidence Park Avenue" },
      tower: { en: "Hudson Tower", ar: "برج هدسون", es: "Torre Hudson", fr: "Tour Hudson" },
      floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨", es: "Piso 35–38", fr: "Étage 35–38" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²", es: "4,100 pies²", fr: "4 100 pi²" },
      feature: { en: "Central Park & Hudson View", ar: "إطلالة على سنترال بارك وهدسون", es: "Vista a Central Park y al Hudson", fr: "Vue sur Central Park et l'Hudson" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Grand Residence", ar: "إقامة كبرى", es: "Gran Residencia", fr: "Grande Résidence" },
      view: { en: "Central Park & Hudson", ar: "سنترال بارك وهدسون", es: "Central Park y Hudson", fr: "Central Park et Hudson" },
      desc: {
        en: "Expansive living at Hudson Tower with floor-to-ceiling glazing, Italian marble throughout, a private terrace overlooking Central Park, and a chef's kitchen with Sub-Zero and Wolf appliances.",
        ar: "مساحة معيشة واسعة في برج هدسون مع زجاج من الأرض إلى السقف، رخام إيطالي، تراس خاص يطل على سنترال بارك، ومطبخ الشيف بأجهزة Sub-Zero و Wolf.",
        es: "Amplios espacios en Torre Hudson con cristalería de piso a techo, mármol italiano en toda la residencia, una terraza privada con vista a Central Park, y cocina de chef con electrodomésticos Sub-Zero y Wolf.",
        fr: "Espaces de vie spacieux à la Tour Hudson avec vitrage du sol au plafond, marbre italien partout, une terrasse privée surplombant Central Park, et une cuisine de chef équipée d'appareils Sub-Zero et Wolf.",
      },
      features: {
        en: ["Park View", "Staff Suite", "Walk-in Closet", "Home Office", "Terrace"],
        ar: ["إطلالة الحديقة", "جناح الخدم", "غرفة ملابس", "مكتب منزلي", "تراس"],
        es: ["Vista al Parque", "Suite de Servicio", "Vestidor", "Oficina en Casa", "Terraza"],
        fr: ["Vue sur le Parc", "Suite du Personnel", "Dressing", "Bureau à Domicile", "Terrasse"],
      },
    },
    "lux-exec": {
      name: { en: "Hudson Executive Loft", ar: "لوفت هدسون التنفيذي", es: "Loft Ejecutivo Hudson", fr: "Loft Exécutif Hudson" },
      tower: { en: "Central Tower", ar: "البرج المركزي", es: "Torre Central", fr: "Tour Centrale" },
      floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠", es: "Piso 25–30", fr: "Étage 25–30" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²", es: "2,800 pies²", fr: "2 800 pi²" },
      feature: { en: "Hudson River View", ar: "إطلالة على نهر هدسون", es: "Vista al Río Hudson", fr: "Vue sur le Fleuve Hudson" },
      status: { en: "Last 3 Units", ar: "آخر ٣ وحدات", es: "Últimas 3 Unidades", fr: "3 Dernières Unités" },
      category: { en: "Executive Suite", ar: "جناح تنفيذي", es: "Suite Ejecutiva", fr: "Suite Exécutive" },
      view: { en: "Hudson River", ar: "نهر هدسون", es: "Río Hudson", fr: "Fleuve Hudson" },
      desc: {
        en: "Refined elegance for the modern executive at Central Tower. Features a dedicated home office, walk-in wardrobe, chef's kitchen with premium appliances, and floor-to-ceiling windows framing the Hudson River.",
        ar: "أناقة راقية للتنفيذي العصري في البرج المركزي. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة فاخرة، ونوافذ من الأرض إلى السقف تؤطر نهر هدسون.",
        es: "Elegancia refinada para el ejecutivo moderno en Torre Central. Cuenta con oficina dedicada, vestidor, cocina de chef con electrodomésticos premium, y ventanales de piso a techo que enmarcan el río Hudson.",
        fr: "Élégance raffinée pour le cadre moderne à la Tour Centrale. Comprend un bureau dédié, un dressing, une cuisine de chef avec appareils haut de gamme, et des baies vitrées du sol au plafond encadrant le fleuve Hudson.",
      },
      features: {
        en: ["River View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
        ar: ["إطلالة النهر", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
        es: ["Vista al Río", "Oficina en Casa", "Acceso al Gimnasio", "Conserjería", "Cerradura Inteligente"],
        fr: ["Vue sur le Fleuve", "Bureau à Domicile", "Accès Salle de Sport", "Conciergerie", "Serrure Connectée"],
      },
    },
  },

  // ── MEXICO — Hacienda aesthetic (multi-generational warmth)
  mexico: {
    "lux-ph": {
      name: { en: "Sky Royal Suite", ar: "جناح السماء الملكي", es: "Suite Cielo Real", fr: "Suite Ciel Royal" },
      tower: { en: "Torre Sol", ar: "برج تورّي سول", es: "Torre Sol", fr: "Torre Sol" },
      floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤", es: "Piso 42–44", fr: "Étage 42–44" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "5 Bathrooms", ar: "٥ حمامات", es: "5 Baños", fr: "5 Salles de bain" },
      size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²", es: "6,200 pies²", fr: "6 200 pi²" },
      feature: { en: "Hacienda Sunset Panoramic", ar: "إطلالة بانورامية على غروب الهاسيندا", es: "Vista Panorámica del Atardecer en la Hacienda", fr: "Vue Panoramique du Coucher de Soleil sur l'Hacienda" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Penthouse", ar: "بنتهاوس", es: "Penthouse", fr: "Penthouse" },
      view: { en: "Hacienda Sunset Panoramic", ar: "بانورامية غروب الهاسيندا", es: "Panorámica Atardecer Hacienda", fr: "Panoramique Coucher Hacienda" },
      desc: {
        en: "A triple-height masterpiece crowning Torre Sol. Private rooftop pool, hand-crafted talavera detailing, Italian marble throughout, and a wraparound terrace capturing the warm hacienda sunset over the central courtyard.",
        ar: "تحفة معمارية بارتفاع ثلاثي تتوّج برج تورّي سول. مسبح خاص على السطح، تفاصيل تالافيرا يدوية الصنع، رخام إيطالي، وتراس محيطي يأسر غروب الهاسيندا الدافئ فوق الفناء المركزي.",
        es: "Una obra maestra de triple altura que corona Torre Sol. Alberca privada en azotea, detalles de talavera hechos a mano, mármol italiano en toda la residencia, y terraza envolvente que captura el cálido atardecer de la hacienda sobre el patio central.",
        fr: "Un chef-d'œuvre à triple hauteur couronnant la Torre Sol. Piscine privée sur le toit, détails en talavera faits à la main, marbre italien partout, et une terrasse enveloppante capturant le coucher de soleil chaleureux de l'hacienda sur le patio central.",
      },
      features: {
        en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
        ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
        es: ["Alberca Privada", "Casa Inteligente", "Cava de Vino", "Cuarto de Servicio", "Cochera Privada"],
        fr: ["Piscine Privée", "Domotique", "Cave à Vin", "Quartiers du Personnel", "Garage Privé"],
      },
    },
    "lux-grand": {
      name: { en: "Hacienda Mayor", ar: "هاسيندا مايور", es: "Hacienda Mayor", fr: "Hacienda Mayor" },
      tower: { en: "Torre Luna", ar: "برج تورّي لونا", es: "Torre Luna", fr: "Torre Luna" },
      floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨", es: "Piso 35–38", fr: "Étage 35–38" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²", es: "4,100 pies²", fr: "4 100 pi²" },
      feature: { en: "Garden & Patio View", ar: "إطلالة على الحديقة والفناء", es: "Vista al Jardín y Patio", fr: "Vue sur le Jardin et le Patio" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Grand Residence", ar: "إقامة كبرى", es: "Gran Residencia", fr: "Grande Résidence" },
      view: { en: "Garden & Patio", ar: "حديقة وفناء", es: "Jardín y Patio", fr: "Jardin et Patio" },
      desc: {
        en: "Expansive living at Torre Luna with arched hacienda windows, terracotta accents, Italian marble throughout, and a private terrace overlooking the lush central garden — ideal for multi-generational family gatherings.",
        ar: "مساحة معيشة واسعة في برج تورّي لونا مع نوافذ هاسيندا مقوّسة، لمسات الطين الأحمر، رخام إيطالي، وتراس خاص يطل على الحديقة المركزية الخضراء — مثالي للتجمعات العائلية متعددة الأجيال.",
        es: "Amplios espacios en Torre Luna con ventanas de arco estilo hacienda, acentos en terracota, mármol italiano en toda la residencia, y una terraza privada con vista al exuberante jardín central — ideal para reuniones familiares multigeneracionales.",
        fr: "Espaces de vie spacieux à la Torre Luna avec fenêtres en arc de style hacienda, accents en terre cuite, marbre italien partout, et une terrasse privée surplombant le jardin central luxuriant — idéal pour les rassemblements familiaux multigénérationnels.",
      },
      features: {
        en: ["Garden View", "Staff Suite", "Walk-in Closet", "Family Room", "Patio Terrace"],
        ar: ["إطلالة الحديقة", "جناح الخدم", "غرفة ملابس", "غرفة عائلية", "تراس الفناء"],
        es: ["Vista al Jardín", "Suite de Servicio", "Vestidor", "Sala Familiar", "Terraza con Patio"],
        fr: ["Vue sur Jardin", "Suite du Personnel", "Dressing", "Salle Familiale", "Terrasse Patio"],
      },
    },
    "lux-exec": {
      name: { en: "Royal Patio Suite", ar: "جناح الفناء الملكي", es: "Suite Patio Real", fr: "Suite Patio Royal" },
      tower: { en: "Torre Estrella", ar: "برج تورّي إستريّا", es: "Torre Estrella", fr: "Torre Estrella" },
      floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠", es: "Piso 25–30", fr: "Étage 25–30" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²", es: "2,800 pies²", fr: "2 800 pi²" },
      feature: { en: "Hacienda Courtyard View", ar: "إطلالة على فناء الهاسيندا", es: "Vista al Patio de la Hacienda", fr: "Vue sur la Cour de l'Hacienda" },
      status: { en: "Last 3 Units", ar: "آخر ٣ وحدات", es: "Últimas 3 Unidades", fr: "3 Dernières Unités" },
      category: { en: "Executive Suite", ar: "جناح تنفيذي", es: "Suite Ejecutiva", fr: "Suite Exécutive" },
      view: { en: "Hacienda Courtyard", ar: "فناء الهاسيندا", es: "Patio de Hacienda", fr: "Cour Hacienda" },
      desc: {
        en: "Refined elegance at Torre Estrella blending hacienda warmth with modern luxury. Features a dedicated home office, walk-in wardrobe, chef's kitchen with premium appliances, and arched windows framing the hacienda courtyard.",
        ar: "أناقة راقية في برج تورّي إستريّا تمزج دفء الهاسيندا بالفخامة العصرية. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة فاخرة، ونوافذ مقوّسة تؤطر فناء الهاسيندا.",
        es: "Elegancia refinada en Torre Estrella que combina la calidez de la hacienda con el lujo moderno. Cuenta con oficina dedicada, vestidor, cocina de chef con electrodomésticos premium, y ventanas de arco que enmarcan el patio de la hacienda.",
        fr: "Élégance raffinée à la Torre Estrella mariant la chaleur de l'hacienda au luxe moderne. Comprend un bureau dédié, un dressing, une cuisine de chef avec appareils haut de gamme, et des fenêtres en arc encadrant la cour de l'hacienda.",
      },
      features: {
        en: ["Courtyard View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
        ar: ["إطلالة الفناء", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
        es: ["Vista al Patio", "Oficina en Casa", "Acceso al Gimnasio", "Conserjería", "Cerradura Inteligente"],
        fr: ["Vue sur la Cour", "Bureau à Domicile", "Accès Salle de Sport", "Conciergerie", "Serrure Connectée"],
      },
    },
  },

  // ── CANADA — Vancouver waterfront (Vista Residences)
  canada: {
    "lux-ph": {
      name: { en: "Harbour Penthouse", ar: "بنتهاوس المرفأ", es: "Penthouse del Puerto", fr: "Penthouse du Port" },
      tower: { en: "Vista North Tower", ar: "برج فيستا الشمالي", es: "Torre Vista Norte", fr: "Tour Vista Nord" },
      floor: { en: "Floor 42–44", ar: "الطابق ٤٢-٤٤", es: "Piso 42–44", fr: "Étage 42–44" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "5 Bathrooms", ar: "٥ حمامات", es: "5 Baños", fr: "5 Salles de bain" },
      size: { en: "6,200 sq ft", ar: "٦,٢٠٠ قدم²", es: "6,200 pies²", fr: "6 200 pi²" },
      feature: { en: "Pacific Waterfront Panoramic", ar: "إطلالة بانورامية على ساحل المحيط الهادئ", es: "Vista Panorámica del Pacífico", fr: "Vue Panoramique sur le Pacifique" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Penthouse", ar: "بنتهاوس", es: "Penthouse", fr: "Penthouse" },
      view: { en: "Pacific Waterfront Panoramic", ar: "بانورامية ساحل المحيط الهادئ", es: "Panorámica del Pacífico", fr: "Panoramique Pacifique" },
      desc: {
        en: "A triple-height masterpiece crowning Vista North Tower. Private infinity pool, direct elevator access, Italian marble throughout, and a wraparound terrace with unobstructed views of the Pacific waterfront and Coast Mountains.",
        ar: "تحفة معمارية بارتفاع ثلاثي تتوّج برج فيستا الشمالي. مسبح إنفينيتي خاص، مصعد مباشر، رخام إيطالي، وتراس محيطي بإطلالة خلابة على ساحل المحيط الهادئ وجبال الساحل.",
        es: "Una obra maestra de triple altura que corona la Torre Vista Norte. Piscina infinita privada, acceso directo en ascensor, mármol italiano en toda la residencia, y una terraza envolvente con vistas inigualables al Pacífico y a las montañas Coast Mountains.",
        fr: "Un chef-d'œuvre à triple hauteur couronnant la Tour Vista Nord. Piscine à débordement privée, accès direct par ascenseur, marbre italien partout, et une terrasse enveloppante offrant des vues imprenables sur le front de mer du Pacifique et les montagnes Côtières.",
      },
      features: {
        en: ["Private Pool", "Smart Home", "Wine Cellar", "Staff Quarters", "Private Garage"],
        ar: ["مسبح خاص", "منزل ذكي", "قبو نبيذ", "غرف الخدم", "مرآب خاص"],
        es: ["Piscina Privada", "Casa Inteligente", "Bodega de Vino", "Cuarto del Personal", "Garage Privado"],
        fr: ["Piscine Privée", "Domotique", "Cave à Vin", "Quartiers du Personnel", "Garage Privé"],
      },
    },
    "lux-grand": {
      name: { en: "Waterfront Grand", ar: "الإقامة الكبرى على الواجهة البحرية", es: "Gran Residencia Costera", fr: "Grande Résidence Front de Mer" },
      tower: { en: "Vista South Tower", ar: "برج فيستا الجنوبي", es: "Torre Vista Sur", fr: "Tour Vista Sud" },
      floor: { en: "Floor 35–38", ar: "الطابق ٣٥-٣٨", es: "Piso 35–38", fr: "Étage 35–38" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "4,100 sq ft", ar: "٤,١٠٠ قدم²", es: "4,100 pies²", fr: "4 100 pi²" },
      feature: { en: "Harbour & Mountains View", ar: "إطلالة على المرفأ والجبال", es: "Vista al Puerto y a las Montañas", fr: "Vue sur le Port et les Montagnes" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Grand Residence", ar: "إقامة كبرى", es: "Gran Residencia", fr: "Grande Résidence" },
      view: { en: "Harbour & Mountains", ar: "المرفأ والجبال", es: "Puerto y Montañas", fr: "Port et Montagnes" },
      desc: {
        en: "Expansive living at Vista South Tower with floor-to-ceiling glazing, Italian marble throughout, a private terrace overlooking the harbour, and a chef's kitchen with premium European appliances.",
        ar: "مساحة معيشة واسعة في برج فيستا الجنوبي مع زجاج من الأرض إلى السقف، رخام إيطالي، تراس خاص يطل على المرفأ، ومطبخ الشيف بأجهزة أوروبية فاخرة.",
        es: "Amplios espacios en Torre Vista Sur con cristalería de piso a techo, mármol italiano en toda la residencia, una terraza privada con vista al puerto, y cocina de chef con electrodomésticos europeos de primera línea.",
        fr: "Espaces de vie spacieux à la Tour Vista Sud avec vitrage du sol au plafond, marbre italien partout, une terrasse privée surplombant le port, et une cuisine de chef équipée d'appareils européens haut de gamme.",
      },
      features: {
        en: ["Harbour View", "Staff Suite", "Walk-in Closet", "Home Office", "Terrace"],
        ar: ["إطلالة المرفأ", "جناح الخدم", "غرفة ملابس", "مكتب منزلي", "تراس"],
        es: ["Vista al Puerto", "Suite de Servicio", "Vestidor", "Oficina en Casa", "Terraza"],
        fr: ["Vue sur le Port", "Suite du Personnel", "Dressing", "Bureau à Domicile", "Terrasse"],
      },
    },
    "lux-exec": {
      name: { en: "Pacific Executive Loft", ar: "لوفت المحيط الهادئ التنفيذي", es: "Loft Ejecutivo Pacífico", fr: "Loft Exécutif Pacifique" },
      tower: { en: "Vista Marina", ar: "فيستا مارينا", es: "Vista Marina", fr: "Vista Marina" },
      floor: { en: "Floor 25–30", ar: "الطابق ٢٥-٣٠", es: "Piso 25–30", fr: "Étage 25–30" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,800 sq ft", ar: "٢,٨٠٠ قدم²", es: "2,800 pies²", fr: "2 800 pi²" },
      feature: { en: "Mountain Vista View", ar: "إطلالة على الجبال", es: "Vista a la Montaña", fr: "Vue sur la Montagne" },
      status: { en: "Last 3 Units", ar: "آخر ٣ وحدات", es: "Últimas 3 Unidades", fr: "3 Dernières Unités" },
      category: { en: "Executive Suite", ar: "جناح تنفيذي", es: "Suite Ejecutiva", fr: "Suite Exécutive" },
      view: { en: "Mountain Vista", ar: "إطلالة جبلية", es: "Vista Montaña", fr: "Vue Montagne" },
      desc: {
        en: "Refined elegance for the modern executive at Vista Marina. Features a dedicated home office, walk-in wardrobe, chef's kitchen with premium appliances, and floor-to-ceiling windows framing the Coast Mountains.",
        ar: "أناقة راقية للتنفيذي العصري في فيستا مارينا. يتميز بمكتب منزلي مخصص، غرفة ملابس، مطبخ الشيف بأجهزة فاخرة، ونوافذ من الأرض إلى السقف تؤطر جبال الساحل.",
        es: "Elegancia refinada para el ejecutivo moderno en Vista Marina. Cuenta con oficina dedicada, vestidor, cocina de chef con electrodomésticos premium, y ventanales de piso a techo que enmarcan las Coast Mountains.",
        fr: "Élégance raffinée pour le cadre moderne à Vista Marina. Comprend un bureau dédié, un dressing, une cuisine de chef avec appareils haut de gamme, et des baies vitrées du sol au plafond encadrant les montagnes Côtières.",
      },
      features: {
        en: ["Mountain View", "Home Office", "Gym Access", "Concierge", "Smart Lock"],
        ar: ["إطلالة الجبال", "مكتب منزلي", "صالة رياضة", "كونسيرج", "قفل ذكي"],
        es: ["Vista a la Montaña", "Oficina en Casa", "Acceso al Gimnasio", "Conserjería", "Cerradura Inteligente"],
        fr: ["Vue sur la Montagne", "Bureau à Domicile", "Accès Salle de Sport", "Conciergerie", "Serrure Connectée"],
      },
    },
  },
};

// ─── FAMILY tier (AhmedPortal) ─────────────────────────────────────────────

export const UNITS_FAMILY = [
  { id: "fam-3br", type: "3br", bedNum: 3, bathNum: 3, sqftBase: 2200, priceBase: 4500000, statusColor: "#2D8F6F" },
  { id: "fam-4br", type: "4br", bedNum: 4, bathNum: 4, sqftBase: 3100, priceBase: 6500000, statusColor: "#2D8F6F" },
  { id: "fam-2br", type: "2br", bedNum: 2, bathNum: 2, sqftBase: 1450, priceBase: 2800000, statusColor: "#e63946" },
];

export const UNIT_REGION_OVERLAY_FAMILY = {
  // ── GULF — Al Noor (KSA, schools + mosque + community)
  gulf: {
    "fam-3br": {
      name: { en: "Family Garden Suite", ar: "جناح العائلة بالحديقة", es: "Suite Familiar con Jardín", fr: "Suite Familiale avec Jardin" },
      tower: { en: "Al Safwa Tower", ar: "برج الصفوة", es: "Torre Al Safwa", fr: "Tour Al Safwa" },
      floor: { en: "Floor 8", ar: "الطابق ٨", es: "Piso 8", fr: "Étage 8" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,200 sq ft", ar: "٢,٢٠٠ قدم²", es: "2,200 pies²", fr: "2 200 pi²" },
      feature: { en: "Family Garden & Pool", ar: "حديقة عائلية ومسبح", es: "Jardín Familiar y Piscina", fr: "Jardin Familial et Piscine" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Family Garden & Pool", ar: "حديقة عائلية ومسبح", es: "Jardín Familiar y Piscina", fr: "Jardin Familial et Piscine" },
      desc: {
        en: "A warm 3-bedroom residence designed for growing families. Direct access to the children's pool, landscaped gardens, and walking distance to top-rated international schools and the community mosque.",
        ar: "إقامة دافئة من ثلاث غرف نوم مصممة للعائلات. وصول مباشر إلى مسبح الأطفال والحدائق المنسقة، على مسافة قريبة من أفضل المدارس الدولية والمسجد المجتمعي.",
        es: "Una cálida residencia de 3 recámaras diseñada para familias en crecimiento. Acceso directo a la piscina infantil, jardines paisajísticos y a poca distancia de las mejores escuelas internacionales y la mezquita comunitaria.",
        fr: "Une chaleureuse résidence de 3 chambres conçue pour les familles. Accès direct à la piscine pour enfants, jardins paysagers et à distance de marche des meilleures écoles internationales et de la mosquée communautaire.",
      },
      features: {
        en: ["School Access", "Family Pool", "Children's Garden", "Storage Room", "Family Parking"],
        ar: ["قرب المدارس", "مسبح عائلي", "حديقة أطفال", "غرفة تخزين", "موقف عائلي"],
        es: ["Acceso a Escuelas", "Piscina Familiar", "Jardín Infantil", "Cuarto de Almacenaje", "Estacionamiento Familiar"],
        fr: ["Accès aux Écoles", "Piscine Familiale", "Jardin pour Enfants", "Espace de Rangement", "Stationnement Familial"],
      },
    },
    "fam-4br": {
      name: { en: "Grand Family Residence", ar: "الإقامة العائلية الكبرى", es: "Gran Residencia Familiar", fr: "Grande Résidence Familiale" },
      tower: { en: "Al Rawda Tower", ar: "برج الروضة", es: "Torre Al Rawda", fr: "Tour Al Rawda" },
      floor: { en: "Floor 12", ar: "الطابق ١٢", es: "Piso 12", fr: "Étage 12" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "3,100 sq ft", ar: "٣,١٠٠ قدم²", es: "3,100 pies²", fr: "3 100 pi²" },
      feature: { en: "Community & Garden", ar: "مجتمع وحديقة", es: "Comunidad y Jardín", fr: "Communauté et Jardin" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Community & Garden", ar: "مجتمع وحديقة", es: "Comunidad y Jardín", fr: "Communauté et Jardin" },
      desc: {
        en: "A spacious 4-bedroom residence built for multi-generational living. Private family majlis, expanded kitchen, and direct community access to schools, the mosque, and family-friendly gardens.",
        ar: "إقامة واسعة من أربع غرف نوم مبنية لمعيشة متعددة الأجيال. مجلس عائلي خاص ومطبخ موسع ووصول مباشر إلى المدارس والمسجد والحدائق العائلية.",
        es: "Una espaciosa residencia de 4 recámaras construida para la vida multi-generacional. Majlis familiar privado, cocina ampliada y acceso comunitario directo a escuelas, la mezquita y jardines familiares.",
        fr: "Une vaste résidence de 4 chambres conçue pour la vie multi-générationnelle. Majlis familial privé, cuisine étendue et accès direct aux écoles, à la mosquée et aux jardins familiaux.",
      },
      features: {
        en: ["Premium School District", "Multi-Generational Space", "Private Garden", "Family Lounge", "2 Parking Spots"],
        ar: ["نطاق مدارس مميز", "مساحة متعددة الأجيال", "حديقة خاصة", "صالة عائلية", "موقفان للسيارات"],
        es: ["Distrito Escolar Premium", "Espacio Multi-Generacional", "Jardín Privado", "Sala Familiar", "2 Lugares de Estacionamiento"],
        fr: ["District Scolaire Premium", "Espace Multi-Générationnel", "Jardin Privé", "Salon Familial", "2 Places de Stationnement"],
      },
    },
    "fam-2br": {
      name: { en: "Garden Family Suite", ar: "جناح الحديقة العائلي", es: "Suite Familiar Jardín", fr: "Suite Familiale Jardin" },
      tower: { en: "Al Qamar Tower", ar: "برج القمر", es: "Torre Al Qamar", fr: "Tour Al Qamar" },
      floor: { en: "Floor 5", ar: "الطابق ٥", es: "Piso 5", fr: "Étage 5" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "2 Bathrooms", ar: "حمامان", es: "2 Baños", fr: "2 Salles de bain" },
      size: { en: "1,450 sq ft", ar: "١,٤٥٠ قدم²", es: "1,450 pies²", fr: "1 450 pi²" },
      feature: { en: "Garden Courtyard", ar: "فناء الحديقة", es: "Patio del Jardín", fr: "Cour Jardin" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Starter Family Residence", ar: "إقامة عائلية مبتدئة", es: "Residencia Familiar Inicial", fr: "Résidence Familiale Débutante" },
      view: { en: "Garden Courtyard", ar: "فناء الحديقة", es: "Patio del Jardín", fr: "Cour Jardin" },
      desc: {
        en: "A bright 2-bedroom starter home for young families. Steps from the children's playground, neighborhood mosque, and primary schools — an affordable first step into Al Noor community life.",
        ar: "منزل مبتدئ مضيء من غرفتي نوم للعائلات الشابة. على خطوات من ملعب الأطفال ومسجد الحي والمدارس الابتدائية — خطوة أولى ميسرة في حياة مجتمع النور.",
        es: "Un luminoso hogar inicial de 2 recámaras para familias jóvenes. A pasos del parque infantil, la mezquita del barrio y las escuelas primarias — un primer paso accesible a la vida de la comunidad Al Noor.",
        fr: "Un lumineux foyer débutant de 2 chambres pour les jeunes familles. À quelques pas de l'aire de jeux pour enfants, de la mosquée du quartier et des écoles primaires — un premier pas abordable dans la vie communautaire d'Al Noor.",
      },
      features: {
        en: ["Walking to Schools", "Family Pool", "Playground", "Storage", "Family Parking"],
        ar: ["مشياً للمدارس", "مسبح عائلي", "ملعب أطفال", "تخزين", "موقف عائلي"],
        es: ["Caminando a Escuelas", "Piscina Familiar", "Área de Juegos", "Almacenaje", "Estacionamiento Familiar"],
        fr: ["À Pied vers Écoles", "Piscine Familiale", "Aire de Jeux", "Rangement", "Stationnement Familial"],
      },
    },
  },

  // ── USA — Manhattan suburban park-edge family
  usa: {
    "fam-3br": {
      name: { en: "Park Family Residence", ar: "إقامة عائلية بالحديقة", es: "Residencia Familiar Park", fr: "Résidence Familiale Park" },
      tower: { en: "Hudson Tower", ar: "برج هدسون", es: "Torre Hudson", fr: "Tour Hudson" },
      floor: { en: "Floor 8", ar: "الطابق ٨", es: "Piso 8", fr: "Étage 8" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,200 sq ft", ar: "٢,٢٠٠ قدم²", es: "2,200 pies²", fr: "2 200 pi²" },
      feature: { en: "Park Avenue & Garden", ar: "بارك أفنيو وحديقة", es: "Park Avenue y Jardín", fr: "Park Avenue et Jardin" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Park Avenue & Garden", ar: "بارك أفنيو وحديقة", es: "Park Avenue y Jardín", fr: "Park Avenue et Jardin" },
      desc: {
        en: "A 3-bedroom family residence on Manhattan's park edge. Zoned for a top-rated school district, with direct access to landscaped gardens, the residents' playground, and a covered family parking spot.",
        ar: "إقامة عائلية من ثلاث غرف نوم على حافة حديقة مانهاتن. ضمن نطاق مدرسي متميز، مع وصول مباشر إلى الحدائق المنسقة وملعب السكان وموقف عائلي مغطى.",
        es: "Una residencia familiar de 3 recámaras al borde del parque de Manhattan. En un distrito escolar de alto nivel, con acceso directo a jardines paisajísticos, el área de juegos de residentes y un lugar de estacionamiento familiar cubierto.",
        fr: "Une résidence familiale de 3 chambres en bordure du parc de Manhattan. Située dans un district scolaire de premier rang, avec accès direct aux jardins paysagers, à l'aire de jeux des résidents et à une place de stationnement familial couverte.",
      },
      features: {
        en: ["School Access", "Family Pool", "Children's Garden", "Storage Room", "Family Parking"],
        ar: ["قرب المدارس", "مسبح عائلي", "حديقة أطفال", "غرفة تخزين", "موقف عائلي"],
        es: ["Acceso a Escuelas", "Piscina Familiar", "Jardín Infantil", "Cuarto de Almacenaje", "Estacionamiento Familiar"],
        fr: ["Accès aux Écoles", "Piscine Familiale", "Jardin pour Enfants", "Espace de Rangement", "Stationnement Familial"],
      },
    },
    "fam-4br": {
      name: { en: "Brownstone Family Loft", ar: "لوفت عائلي براونستون", es: "Loft Familiar Brownstone", fr: "Loft Familial Brownstone" },
      tower: { en: "Central Tower", ar: "البرج المركزي", es: "Torre Central", fr: "Tour Central" },
      floor: { en: "Floor 14", ar: "الطابق ١٤", es: "Piso 14", fr: "Étage 14" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "3,100 sq ft", ar: "٣,١٠٠ قدم²", es: "3,100 pies²", fr: "3 100 pi²" },
      feature: { en: "Central Park View", ar: "إطلالة سنترال بارك", es: "Vista Central Park", fr: "Vue Central Park" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Central Park View", ar: "إطلالة سنترال بارك", es: "Vista Central Park", fr: "Vue Central Park" },
      desc: {
        en: "A 4-bedroom brownstone-inspired loft overlooking Central Park. Built for multi-generational families with a dedicated guest suite, premium school district access, and two reserved parking spots.",
        ar: "لوفت من أربع غرف نوم مستوحى من البراونستون يطل على سنترال بارك. مبني للعائلات متعددة الأجيال مع جناح ضيوف مخصص ووصول إلى نطاق مدارس مميز وموقفين محجوزين للسيارات.",
        es: "Un loft de 4 recámaras inspirado en el brownstone con vista a Central Park. Construido para familias multi-generacionales con una suite de huéspedes dedicada, acceso a un distrito escolar premium y dos lugares de estacionamiento reservados.",
        fr: "Un loft de 4 chambres d'inspiration brownstone donnant sur Central Park. Conçu pour les familles multi-générationnelles avec une suite d'invités dédiée, l'accès à un district scolaire premium et deux places de stationnement réservées.",
      },
      features: {
        en: ["Premium School District", "Multi-Generational Space", "Private Garden", "Family Lounge", "2 Parking Spots"],
        ar: ["نطاق مدارس مميز", "مساحة متعددة الأجيال", "حديقة خاصة", "صالة عائلية", "موقفان للسيارات"],
        es: ["Distrito Escolar Premium", "Espacio Multi-Generacional", "Jardín Privado", "Sala Familiar", "2 Lugares de Estacionamiento"],
        fr: ["District Scolaire Premium", "Espace Multi-Générationnel", "Jardin Privé", "Salon Familial", "2 Places de Stationnement"],
      },
    },
    "fam-2br": {
      name: { en: "Family Loft", ar: "لوفت عائلي", es: "Loft Familiar", fr: "Loft Familial" },
      tower: { en: "Hudson Tower", ar: "برج هدسون", es: "Torre Hudson", fr: "Tour Hudson" },
      floor: { en: "Floor 5", ar: "الطابق ٥", es: "Piso 5", fr: "Étage 5" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "2 Bathrooms", ar: "حمامان", es: "2 Baños", fr: "2 Salles de bain" },
      size: { en: "1,450 sq ft", ar: "١,٤٥٠ قدم²", es: "1,450 pies²", fr: "1 450 pi²" },
      feature: { en: "Hudson Family Park", ar: "حديقة هدسون العائلية", es: "Parque Familiar Hudson", fr: "Parc Familial Hudson" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Starter Family Residence", ar: "إقامة عائلية مبتدئة", es: "Residencia Familiar Inicial", fr: "Résidence Familiale Débutante" },
      view: { en: "Hudson Family Park", ar: "حديقة هدسون العائلية", es: "Parque Familiar Hudson", fr: "Parc Familial Hudson" },
      desc: {
        en: "A bright 2-bedroom starter loft for young Manhattan families. Walking distance to the zoned elementary school, Hudson family park, and the residents' playground — a smart first home in the city.",
        ar: "لوفت مبتدئ مضيء من غرفتي نوم للعائلات الشابة في مانهاتن. على مسافة قريبة من المدرسة الابتدائية المخصصة وحديقة هدسون العائلية وملعب السكان — منزل أول ذكي في المدينة.",
        es: "Un luminoso loft inicial de 2 recámaras para jóvenes familias de Manhattan. A poca distancia caminando de la escuela primaria zonificada, el parque familiar Hudson y el área de juegos de residentes — un primer hogar inteligente en la ciudad.",
        fr: "Un lumineux loft débutant de 2 chambres pour les jeunes familles de Manhattan. À distance de marche de l'école primaire de quartier, du parc familial Hudson et de l'aire de jeux des résidents — un premier foyer intelligent en ville.",
      },
      features: {
        en: ["Walking to Schools", "Family Pool", "Playground", "Storage", "Family Parking"],
        ar: ["مشياً للمدارس", "مسبح عائلي", "ملعب أطفال", "تخزين", "موقف عائلي"],
        es: ["Caminando a Escuelas", "Piscina Familiar", "Área de Juegos", "Almacenaje", "Estacionamiento Familiar"],
        fr: ["À Pied vers Écoles", "Piscine Familiale", "Aire de Jeux", "Rangement", "Stationnement Familial"],
      },
    },
  },

  // ── MEXICO — Hacienda Familiar (multi-generational + patio)
  mexico: {
    "fam-3br": {
      name: { en: "Casa Familiar Patio", ar: "كاسا فاميليار باتيو", es: "Casa Familiar Patio", fr: "Casa Familiar Patio" },
      tower: { en: "Torre Luna", ar: "برج لونا", es: "Torre Luna", fr: "Tour Luna" },
      floor: { en: "Floor 8", ar: "الطابق ٨", es: "Piso 8", fr: "Étage 8" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,200 sq ft", ar: "٢,٢٠٠ قدم²", es: "2,200 pies²", fr: "2 200 pi²" },
      feature: { en: "Hacienda Patio & Garden", ar: "فناء وحديقة الهاسيندا", es: "Patio Hacienda y Jardín", fr: "Patio Hacienda et Jardin" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Hacienda Patio & Garden", ar: "فناء وحديقة الهاسيندا", es: "Patio Hacienda y Jardín", fr: "Patio Hacienda et Jardin" },
      desc: {
        en: "A warm 3-bedroom hacienda-style home with a private central patio for su familia. Steps from the neighborhood mercado, top primary schools, and a landscaped community garden built for multi-generational living.",
        ar: "منزل دافئ من ثلاث غرف نوم على طراز الهاسيندا مع فناء مركزي خاص لعائلتك. على خطوات من السوق المحلي وأفضل المدارس الابتدائية وحديقة مجتمعية منسقة للمعيشة متعددة الأجيال.",
        es: "Un cálido hogar de 3 recámaras estilo hacienda con un patio central privado para su familia. A pasos del mercado del barrio, las mejores escuelas primarias y un jardín comunitario paisajístico construido para la vida multi-generacional.",
        fr: "Un chaleureux foyer de 3 chambres de style hacienda avec un patio central privé pour votre famille. À quelques pas du mercado du quartier, des meilleures écoles primaires et d'un jardin communautaire paysager conçu pour la vie multi-générationnelle.",
      },
      features: {
        en: ["School Access", "Family Pool", "Children's Garden", "Storage Room", "Family Parking"],
        ar: ["قرب المدارس", "مسبح عائلي", "حديقة أطفال", "غرفة تخزين", "موقف عائلي"],
        es: ["Acceso a Escuelas", "Piscina Familiar", "Jardín Infantil", "Cuarto de Almacenaje", "Estacionamiento Familiar"],
        fr: ["Accès aux Écoles", "Piscine Familiale", "Jardin pour Enfants", "Espace de Rangement", "Stationnement Familial"],
      },
    },
    "fam-4br": {
      name: { en: "Casa Mayor Familiar", ar: "كاسا مايور فاميليار", es: "Casa Mayor Familiar", fr: "Casa Mayor Familiar" },
      tower: { en: "Torre Sol", ar: "برج سول", es: "Torre Sol", fr: "Tour Sol" },
      floor: { en: "Floor 12", ar: "الطابق ١٢", es: "Piso 12", fr: "Étage 12" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "3,100 sq ft", ar: "٣,١٠٠ قدم²", es: "3,100 pies²", fr: "3 100 pi²" },
      feature: { en: "Family Courtyard", ar: "فناء عائلي", es: "Patio Familiar", fr: "Cour Familiale" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Family Courtyard", ar: "فناء عائلي", es: "Patio Familiar", fr: "Cour Familiale" },
      desc: {
        en: "A grand 4-bedroom hacienda residence with a generous family courtyard for su familia. Designed for abuelos, parents, and children under one roof, with a premium school district and a private rooftop terrace.",
        ar: "إقامة فخمة من أربع غرف نوم على طراز الهاسيندا مع فناء عائلي واسع. مصممة للأجداد والآباء والأطفال تحت سقف واحد، مع نطاق مدارس مميز وتراس خاص على السطح.",
        es: "Una gran residencia hacienda de 4 recámaras con un amplio patio familiar para su familia. Diseñada para abuelos, padres e hijos bajo un mismo techo, con un distrito escolar premium y una terraza privada en la azotea.",
        fr: "Une grande résidence hacienda de 4 chambres avec une vaste cour familiale pour votre famille. Conçue pour les grands-parents, parents et enfants sous un même toit, avec un district scolaire premium et une terrasse privée sur le toit.",
      },
      features: {
        en: ["Premium School District", "Multi-Generational Space", "Private Garden", "Family Lounge", "2 Parking Spots"],
        ar: ["نطاق مدارس مميز", "مساحة متعددة الأجيال", "حديقة خاصة", "صالة عائلية", "موقفان للسيارات"],
        es: ["Distrito Escolar Premium", "Espacio Multi-Generacional", "Jardín Privado", "Sala Familiar", "2 Lugares de Estacionamiento"],
        fr: ["District Scolaire Premium", "Espace Multi-Générationnel", "Jardin Privé", "Salon Familial", "2 Places de Stationnement"],
      },
    },
    "fam-2br": {
      name: { en: "Casa Patio Familiar", ar: "كاسا باتيو فاميليار", es: "Casa Patio Familiar", fr: "Casa Patio Familiar" },
      tower: { en: "Torre Estrella", ar: "برج إستريا", es: "Torre Estrella", fr: "Tour Estrella" },
      floor: { en: "Floor 5", ar: "الطابق ٥", es: "Piso 5", fr: "Étage 5" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "2 Bathrooms", ar: "حمامان", es: "2 Baños", fr: "2 Salles de bain" },
      size: { en: "1,450 sq ft", ar: "١,٤٥٠ قدم²", es: "1,450 pies²", fr: "1 450 pi²" },
      feature: { en: "Patio Familiar", ar: "فناء عائلي", es: "Patio Familiar", fr: "Patio Familial" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Starter Family Residence", ar: "إقامة عائلية مبتدئة", es: "Residencia Familiar Inicial", fr: "Résidence Familiale Débutante" },
      view: { en: "Patio Familiar", ar: "فناء عائلي", es: "Patio Familiar", fr: "Patio Familial" },
      desc: {
        en: "A bright 2-bedroom starter hogar for young families, with its own intimate patio. A short walk to the mercado, the children's playground, and the zoned primary school — the warm first step into Torre Estrella life.",
        ar: "هوغار مبتدئ مضيء من غرفتي نوم للعائلات الشابة، مع فناء حميمي خاص. على مسافة قصيرة سيراً من السوق وملعب الأطفال والمدرسة الابتدائية المخصصة — الخطوة الأولى الدافئة في حياة برج إستريا.",
        es: "Un luminoso hogar inicial de 2 recámaras para familias jóvenes, con su propio patio íntimo. A poca distancia caminando del mercado, el área de juegos infantil y la escuela primaria zonificada — el cálido primer paso en la vida de Torre Estrella.",
        fr: "Un lumineux foyer débutant de 2 chambres pour les jeunes familles, avec son propre patio intime. À courte distance de marche du mercado, de l'aire de jeux pour enfants et de l'école primaire de quartier — le chaleureux premier pas dans la vie de Tour Estrella.",
      },
      features: {
        en: ["Walking to Schools", "Family Pool", "Playground", "Storage", "Family Parking"],
        ar: ["مشياً للمدارس", "مسبح عائلي", "ملعب أطفال", "تخزين", "موقف عائلي"],
        es: ["Caminando a Escuelas", "Piscina Familiar", "Área de Juegos", "Almacenaje", "Estacionamiento Familiar"],
        fr: ["À Pied vers Écoles", "Piscine Familiale", "Aire de Jeux", "Rangement", "Stationnement Familial"],
      },
    },
  },

  // ── CANADA — Vista Residences (Vancouver waterfront family)
  canada: {
    "fam-3br": {
      name: { en: "Family Harbour Residence", ar: "إقامة الميناء العائلية", es: "Residencia Familiar Puerto", fr: "Résidence Familiale du Port" },
      tower: { en: "Vista South Tower", ar: "برج فيستا الجنوبي", es: "Torre Vista Sur", fr: "Tour Vista Sud" },
      floor: { en: "Floor 8", ar: "الطابق ٨", es: "Piso 8", fr: "Étage 8" },
      beds: { en: "3 Bedrooms", ar: "٣ غرف نوم", es: "3 Recámaras", fr: "3 Chambres" },
      baths: { en: "3 Bathrooms", ar: "٣ حمامات", es: "3 Baños", fr: "3 Salles de bain" },
      size: { en: "2,200 sq ft", ar: "٢,٢٠٠ قدم²", es: "2,200 pies²", fr: "2 200 pi²" },
      feature: { en: "Family Harbour & Park", ar: "ميناء عائلي وحديقة", es: "Puerto Familiar y Parque", fr: "Port Familial et Parc" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Family Harbour & Park", ar: "ميناء عائلي وحديقة", es: "Puerto Familiar y Parque", fr: "Port Familial et Parc" },
      desc: {
        en: "A 3-bedroom waterfront family residence overlooking Vancouver harbour. Zoned for a top-rated bilingual school district, with direct access to the waterfront family park and seawall walking paths.",
        ar: "إقامة عائلية من ثلاث غرف نوم على الواجهة البحرية تطل على ميناء فانكوفر. ضمن نطاق مدرسي ثنائي اللغة متميز، مع وصول مباشر إلى حديقة الواجهة البحرية العائلية ومسارات السور البحري.",
        es: "Una residencia familiar de 3 recámaras frente al mar con vista al puerto de Vancouver. En un distrito escolar bilingüe de alto nivel, con acceso directo al parque familiar costero y los senderos del muro marino.",
        fr: "Une résidence familiale de 3 chambres en bord de mer avec vue sur le port de Vancouver. Située dans un district scolaire bilingue de premier rang, avec accès direct au parc familial riverain et aux sentiers du seawall.",
      },
      features: {
        en: ["School Access", "Family Pool", "Children's Garden", "Storage Room", "Family Parking"],
        ar: ["قرب المدارس", "مسبح عائلي", "حديقة أطفال", "غرفة تخزين", "موقف عائلي"],
        es: ["Acceso a Escuelas", "Piscina Familiar", "Jardín Infantil", "Cuarto de Almacenaje", "Estacionamiento Familiar"],
        fr: ["Accès aux Écoles", "Piscine Familiale", "Jardin pour Enfants", "Espace de Rangement", "Stationnement Familial"],
      },
    },
    "fam-4br": {
      name: { en: "Mountain View Family", ar: "العائلة بإطلالة الجبل", es: "Familiar Vista Montaña", fr: "Familiale Vue Montagne" },
      tower: { en: "Vista North Tower", ar: "برج فيستا الشمالي", es: "Torre Vista Norte", fr: "Tour Vista Nord" },
      floor: { en: "Floor 14", ar: "الطابق ١٤", es: "Piso 14", fr: "Étage 14" },
      beds: { en: "4 Bedrooms", ar: "٤ غرف نوم", es: "4 Recámaras", fr: "4 Chambres" },
      baths: { en: "4 Bathrooms", ar: "٤ حمامات", es: "4 Baños", fr: "4 Salles de bain" },
      size: { en: "3,100 sq ft", ar: "٣,١٠٠ قدم²", es: "3,100 pies²", fr: "3 100 pi²" },
      feature: { en: "Mountain Family Vista", ar: "إطلالة الجبل العائلية", es: "Vista Montaña Familiar", fr: "Vue Montagne Familiale" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Family Residence", ar: "إقامة عائلية", es: "Residencia Familiar", fr: "Résidence Familiale" },
      view: { en: "Mountain Family Vista", ar: "إطلالة الجبل العائلية", es: "Vista Montaña Familiar", fr: "Vue Montagne Familiale" },
      desc: {
        en: "A 4-bedroom Vancouver family residence with sweeping North Shore mountain views. Built for multi-generational living, with a guest suite, premium bilingual school district access, and trails to Stanley Park hiking.",
        ar: "إقامة عائلية من أربع غرف نوم في فانكوفر مع إطلالات شاسعة على جبال الساحل الشمالي. مبنية للمعيشة متعددة الأجيال، مع جناح ضيوف ووصول إلى نطاق مدارس ثنائي اللغة مميز ومسارات للمشي في حديقة ستانلي.",
        es: "Una residencia familiar de 4 recámaras en Vancouver con amplias vistas a las montañas de North Shore. Construida para la vida multi-generacional, con suite de huéspedes, acceso a un distrito escolar bilingüe premium y senderos al hiking de Stanley Park.",
        fr: "Une résidence familiale de 4 chambres à Vancouver avec vues panoramiques sur les montagnes de la North Shore. Conçue pour la vie multi-générationnelle, avec une suite d'invités, l'accès à un district scolaire bilingue premium et des sentiers de randonnée vers Stanley Park.",
      },
      features: {
        en: ["Premium School District", "Multi-Generational Space", "Private Garden", "Family Lounge", "2 Parking Spots"],
        ar: ["نطاق مدارس مميز", "مساحة متعددة الأجيال", "حديقة خاصة", "صالة عائلية", "موقفان للسيارات"],
        es: ["Distrito Escolar Premium", "Espacio Multi-Generacional", "Jardín Privado", "Sala Familiar", "2 Lugares de Estacionamiento"],
        fr: ["District Scolaire Premium", "Espace Multi-Générationnel", "Jardin Privé", "Salon Familial", "2 Places de Stationnement"],
      },
    },
    "fam-2br": {
      name: { en: "Harbour Family Suite", ar: "جناح الميناء العائلي", es: "Suite Familiar Puerto", fr: "Suite Familiale du Port" },
      tower: { en: "Vista Marina", ar: "فيستا مارينا", es: "Vista Marina", fr: "Vista Marina" },
      floor: { en: "Floor 5", ar: "الطابق ٥", es: "Piso 5", fr: "Étage 5" },
      beds: { en: "2 Bedrooms", ar: "غرفتا نوم", es: "2 Recámaras", fr: "2 Chambres" },
      baths: { en: "2 Bathrooms", ar: "حمامان", es: "2 Baños", fr: "2 Salles de bain" },
      size: { en: "1,450 sq ft", ar: "١,٤٥٠ قدم²", es: "1,450 pies²", fr: "1 450 pi²" },
      feature: { en: "Waterfront Family", ar: "عائلة على الواجهة البحرية", es: "Familiar Frente al Mar", fr: "Familiale Bord de Mer" },
      status: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
      category: { en: "Starter Family Residence", ar: "إقامة عائلية مبتدئة", es: "Residencia Familiar Inicial", fr: "Résidence Familiale Débutante" },
      view: { en: "Waterfront Family", ar: "عائلة على الواجهة البحرية", es: "Familiar Frente al Mar", fr: "Familiale Bord de Mer" },
      desc: {
        en: "A bright 2-bedroom starter suite for young Vancouver families. Walking distance to the zoned bilingual elementary school, the waterfront family park, and the seawall — a smart first foyer at the marina edge.",
        ar: "جناح مبتدئ مضيء من غرفتي نوم للعائلات الشابة في فانكوفر. على مسافة قريبة من المدرسة الابتدائية ثنائية اللغة المخصصة وحديقة الواجهة البحرية العائلية والسور البحري — منزل أول ذكي على حافة المرسى.",
        es: "Una luminosa suite inicial de 2 recámaras para jóvenes familias de Vancouver. A poca distancia caminando de la escuela primaria bilingüe zonificada, el parque familiar costero y el muro marino — un primer hogar inteligente al borde de la marina.",
        fr: "Une lumineuse suite débutante de 2 chambres pour les jeunes familles de Vancouver. À distance de marche de l'école primaire bilingue de quartier, du parc familial riverain et du seawall — un premier foyer intelligent en bordure de marina.",
      },
      features: {
        en: ["Walking to Schools", "Family Pool", "Playground", "Storage", "Family Parking"],
        ar: ["مشياً للمدارس", "مسبح عائلي", "ملعب أطفال", "تخزين", "موقف عائلي"],
        es: ["Caminando a Escuelas", "Piscina Familiar", "Área de Juegos", "Almacenaje", "Estacionamiento Familiar"],
        fr: ["À Pied vers Écoles", "Piscine Familiale", "Aire de Jeux", "Rangement", "Stationnement Familial"],
      },
    },
  },
};

// ─── UNIT_MEDIA (Phase 2d.RE) ──────────────────────────────────────────────
// Canonical, region-INDEPENDENT unit extras keyed by unit id: image, gallery,
// floor-plan geometry + room labels (4-lang), specs and payment base.
// Consumed by all 3 RE portals via `usePortalRegion().unitMedia`, merged over
// the localized unit through `withExtras`. Floor plans are the superset per
// unit (VIPPortal detail); Marketplace renders the same rooms. Room labels
// carry { en, ar, es, fr }; render picks `label[lang] ?? label.en`.

export const UNIT_MEDIA = {
  "lux-ph": {
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master",  w: 42, h: 30, x:  5, y:  5, label: { en: "Master Suite\n580 sq ft",        ar: "الجناح الرئيسي\n٥٨٠ قدم²",   es: "Suite Principal\n580 sq ft",    fr: "Suite Principale\n580 sq ft" } },
        { key: "bed2",    w: 22, h: 20, x: 50, y:  5, label: { en: "Bedroom 2\n320 sq ft",           ar: "غرفة ٢\n٣٢٠ قدم²",           es: "Recámara 2\n320 sq ft",         fr: "Chambre 2\n320 sq ft" } },
        { key: "bed3",    w: 22, h: 20, x: 75, y:  5, label: { en: "Bedroom 3\n280 sq ft",           ar: "غرفة ٣\n٢٨٠ قدم²",           es: "Recámara 3\n280 sq ft",         fr: "Chambre 3\n280 sq ft" } },
        { key: "bed4",    w: 22, h: 20, x: 75, y: 28, label: { en: "Bedroom 4\n260 sq ft",           ar: "غرفة ٤\n٢٦٠ قدم²",           es: "Recámara 4\n260 sq ft",         fr: "Chambre 4\n260 sq ft" } },
        { key: "living",  w: 42, h: 30, x:  5, y: 38, label: { en: "Grand Living\n980 sq ft",        ar: "صالة كبرى\n٩٨٠ قدم²",        es: "Salón Principal\n980 sq ft",    fr: "Grand Salon\n980 sq ft" } },
        { key: "kitchen", w: 25, h: 20, x: 50, y: 38, label: { en: "Chef's Kitchen\n420 sq ft",      ar: "مطبخ الشيف\n٤٢٠ قدم²",       es: "Cocina de Chef\n420 sq ft",     fr: "Cuisine de Chef\n420 sq ft" } },
        { key: "dining",  w: 25, h: 18, x: 50, y: 60, label: { en: "Dining\n380 sq ft",              ar: "طعام\n٣٨٠ قدم²",             es: "Comedor\n380 sq ft",            fr: "Salle à Manger\n380 sq ft" } },
        { key: "balcony", w: 92, h: 14, x:  5, y: 72, label: { en: "Wraparound Terrace\n1,200 sq ft", ar: "تراس محيطي\n١,٢٠٠ قدم²",     es: "Terraza Envolvente\n1,200 sq ft", fr: "Terrasse Enveloppante\n1,200 sq ft" } },
        { key: "pool",    w: 30, h: 10, x: 35, y: 88, label: { en: "Private Pool",                   ar: "مسبح خاص",                  es: "Piscina Privada",               fr: "Piscine Privée" } },
      ],
      specs: { bathrooms: "5+1", balconySize: "1,200 sq ft", totalArea: "6,200 sq ft" },
    },
    payment: { base: 12500000, plans: ["60/40", "70/30"] },
  },
  "lux-grand": {
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master",  w: 35, h: 32, x:  5, y:  5, label: { en: "Master Suite\n480 sq ft",       ar: "الجناح الرئيسي\n٤٨٠ قدم²",   es: "Suite Principal\n480 sq ft",    fr: "Suite Principale\n480 sq ft" } },
        { key: "bed2",    w: 25, h: 25, x: 43, y:  5, label: { en: "Bedroom 2\n320 sq ft",           ar: "غرفة ٢\n٣٢٠ قدم²",           es: "Recámara 2\n320 sq ft",         fr: "Chambre 2\n320 sq ft" } },
        { key: "bed3",    w: 25, h: 25, x: 72, y:  5, label: { en: "Bedroom 3\n280 sq ft",           ar: "غرفة ٣\n٢٨٠ قدم²",           es: "Recámara 3\n280 sq ft",         fr: "Chambre 3\n280 sq ft" } },
        { key: "living",  w: 45, h: 28, x:  5, y: 40, label: { en: "Living & Dining\n860 sq ft",     ar: "معيشة وطعام\n٨٦٠ قدم²",      es: "Sala y Comedor\n860 sq ft",     fr: "Salon et Salle à Manger\n860 sq ft" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 40, label: { en: "Kitchen\n340 sq ft",             ar: "مطبخ\n٣٤٠ قدم²",             es: "Cocina\n340 sq ft",             fr: "Cuisine\n340 sq ft" } },
        { key: "maid",    w: 18, h: 22, x: 80, y: 40, label: { en: "Maid's Room",                    ar: "غرفة الخدم",                es: "Cuarto de Servicio",            fr: "Chambre de Bonne" } },
        { key: "balcony", w: 92, h: 16, x:  5, y: 72, label: { en: "Marina Terrace\n680 sq ft",      ar: "تراس المارينا\n٦٨٠ قدم²",    es: "Terraza Marina\n680 sq ft",     fr: "Terrasse Marina\n680 sq ft" } },
      ],
      specs: { bathrooms: "3+1", balconySize: "680 sq ft", totalArea: "4,100 sq ft" },
    },
    payment: { base: 7800000, plans: ["60/40", "70/30"] },
  },
  "lux-exec": {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    ],
    floorPlan: {
      rooms: [
        { key: "master",  w: 35, h: 35, x:  5, y:  5, label: { en: "Master Suite\n420 sq ft",       ar: "الجناح الرئيسي\n٤٢٠ قدم²",   es: "Suite Principal\n420 sq ft",    fr: "Suite Principale\n420 sq ft" } },
        { key: "bed2",    w: 28, h: 28, x: 44, y:  5, label: { en: "Bedroom 2\n300 sq ft",           ar: "غرفة ٢\n٣٠٠ قدم²",           es: "Recámara 2\n300 sq ft",         fr: "Chambre 2\n300 sq ft" } },
        { key: "office",  w: 22, h: 25, x: 76, y:  5, label: { en: "Home Office\n180 sq ft",         ar: "مكتب منزلي\n١٨٠ قدم²",       es: "Oficina en Casa\n180 sq ft",    fr: "Bureau à Domicile\n180 sq ft" } },
        { key: "living",  w: 42, h: 28, x:  5, y: 44, label: { en: "Living Room\n620 sq ft",         ar: "غرفة المعيشة\n٦٢٠ قدم²",     es: "Sala de Estar\n620 sq ft",      fr: "Salon\n620 sq ft" } },
        { key: "kitchen", w: 28, h: 22, x: 50, y: 44, label: { en: "Chef's Kitchen\n280 sq ft",      ar: "مطبخ الشيف\n٢٨٠ قدم²",       es: "Cocina de Chef\n280 sq ft",     fr: "Cuisine de Chef\n280 sq ft" } },
        { key: "balcony", w: 70, h: 14, x:  5, y: 76, label: { en: "Sky Balcony\n380 sq ft",         ar: "شرفة سماوية\n٣٨٠ قدم²",      es: "Balcón Panorámico\n380 sq ft",  fr: "Balcon Panoramique\n380 sq ft" } },
      ],
      specs: { bathrooms: "2+1", balconySize: "380 sq ft", totalArea: "2,800 sq ft" },
    },
    payment: { base: 4200000, plans: ["60/40", "70/30"] },
  },
  "fam-3br": {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master",  w: 35, h: 30, x:  5, y:  5, label: { en: "Master Suite\n450 sq ft",       ar: "الجناح الرئيسي\n٤٥٠ قدم²",   es: "Suite Principal\n450 sq ft",    fr: "Suite Principale\n450 sq ft" } },
        { key: "bed2",    w: 22, h: 22, x: 43, y:  5, label: { en: "Bedroom 2\n280 sq ft",           ar: "غرفة ٢\n٢٨٠ قدم²",           es: "Recámara 2\n280 sq ft",         fr: "Chambre 2\n280 sq ft" } },
        { key: "bed3",    w: 22, h: 22, x: 68, y:  5, label: { en: "Bedroom 3\n260 sq ft",           ar: "غرفة ٣\n٢٦٠ قدم²",           es: "Recámara 3\n260 sq ft",         fr: "Chambre 3\n260 sq ft" } },
        { key: "living",  w: 45, h: 28, x:  5, y: 38, label: { en: "Family Living\n780 sq ft",       ar: "صالة عائلية\n٧٨٠ قدم²",      es: "Sala Familiar\n780 sq ft",      fr: "Salon Familial\n780 sq ft" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 38, label: { en: "Chef's Kitchen\n320 sq ft",      ar: "مطبخ الشيف\n٣٢٠ قدم²",       es: "Cocina de Chef\n320 sq ft",     fr: "Cuisine de Chef\n320 sq ft" } },
        { key: "office",  w: 18, h: 22, x: 80, y: 38, label: { en: "Kids Room\n180 sq ft",           ar: "غرفة أطفال\n١٨٠ قدم²",       es: "Cuarto de Niños\n180 sq ft",    fr: "Chambre d'Enfants\n180 sq ft" } },
        { key: "balcony", w: 92, h: 16, x:  5, y: 72, label: { en: "Garden Terrace\n560 sq ft",      ar: "تراس الحديقة\n٥٦٠ قدم²",     es: "Terraza Jardín\n560 sq ft",     fr: "Terrasse Jardin\n560 sq ft" } },
      ],
      specs: { bathrooms: "3+1", balconySize: "560 sq ft", totalArea: "3,200 sq ft" },
    },
    payment: { base: 4500000, plans: ["60/40", "70/30"] },
  },
  "fam-4br": {
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master",  w: 35, h: 28, x:  5, y:  5, label: { en: "Master Suite\n520 sq ft",       ar: "الجناح الرئيسي\n٥٢٠ قدم²",   es: "Suite Principal\n520 sq ft",    fr: "Suite Principale\n520 sq ft" } },
        { key: "bed2",    w: 20, h: 20, x: 43, y:  5, label: { en: "Bedroom 2\n300 sq ft",           ar: "غرفة ٢\n٣٠٠ قدم²",           es: "Recámara 2\n300 sq ft",         fr: "Chambre 2\n300 sq ft" } },
        { key: "bed3",    w: 18, h: 20, x: 65, y:  5, label: { en: "Kids Room 1\n260 sq ft",         ar: "غرفة أطفال ١\n٢٦٠ قدم²",     es: "Cuarto de Niños 1\n260 sq ft",  fr: "Chambre d'Enfants 1\n260 sq ft" } },
        { key: "bed4",    w: 15, h: 20, x: 85, y:  5, label: { en: "Kids Room 2\n240 sq ft",         ar: "غرفة أطفال ٢\n٢٤٠ قدم²",     es: "Cuarto de Niños 2\n240 sq ft",  fr: "Chambre d'Enfants 2\n240 sq ft" } },
        { key: "living",  w: 40, h: 26, x:  5, y: 36, label: { en: "Family Living\n920 sq ft",       ar: "صالة عائلية\n٩٢٠ قدم²",      es: "Sala Familiar\n920 sq ft",      fr: "Salon Familial\n920 sq ft" } },
        { key: "kitchen", w: 22, h: 20, x: 48, y: 36, label: { en: "Kitchen\n380 sq ft",             ar: "مطبخ\n٣٨٠ قدم²",             es: "Cocina\n380 sq ft",             fr: "Cuisine\n380 sq ft" } },
        { key: "dining",  w: 22, h: 18, x: 48, y: 58, label: { en: "Dining\n340 sq ft",              ar: "طعام\n٣٤٠ قدم²",             es: "Comedor\n340 sq ft",            fr: "Salle à Manger\n340 sq ft" } },
        { key: "maid",    w: 15, h: 20, x: 73, y: 36, label: { en: "Maid",                           ar: "خادمة",                     es: "Servicio",                      fr: "Bonne" } },
        { key: "balcony", w: 92, h: 14, x:  5, y: 78, label: { en: "Sea & Park Terrace\n880 sq ft",  ar: "تراس البحر والحديقة\n٨٨٠ قدم²", es: "Terraza Mar y Parque\n880 sq ft", fr: "Terrasse Mer et Parc\n880 sq ft" } },
      ],
      specs: { bathrooms: "4+1", balconySize: "880 sq ft", totalArea: "4,500 sq ft" },
    },
    payment: { base: 6500000, plans: ["60/40", "70/30"] },
  },
  "fam-2br": {
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    floorPlan: {
      rooms: [
        { key: "master",  w: 35, h: 32, x:  5, y:  5, label: { en: "Master Suite\n350 sq ft",       ar: "الجناح الرئيسي\n٣٥٠ قدم²",   es: "Suite Principal\n350 sq ft",    fr: "Suite Principale\n350 sq ft" } },
        { key: "bed2",    w: 28, h: 28, x: 44, y:  5, label: { en: "Kids Room\n280 sq ft",           ar: "غرفة الأطفال\n٢٨٠ قدم²",     es: "Cuarto de Niños\n280 sq ft",    fr: "Chambre d'Enfants\n280 sq ft" } },
        { key: "living",  w: 45, h: 28, x:  5, y: 40, label: { en: "Living & Dining\n520 sq ft",     ar: "معيشة وطعام\n٥٢٠ قدم²",      es: "Sala y Comedor\n520 sq ft",     fr: "Salon et Salle à Manger\n520 sq ft" } },
        { key: "kitchen", w: 25, h: 22, x: 53, y: 40, label: { en: "Open Kitchen\n220 sq ft",        ar: "مطبخ مفتوح\n٢٢٠ قدم²",       es: "Cocina Abierta\n220 sq ft",     fr: "Cuisine Ouverte\n220 sq ft" } },
        { key: "balcony", w: 65, h: 14, x:  5, y: 72, label: { en: "Park Balcony\n280 sq ft",        ar: "شرفة الحديقة\n٢٨٠ قدم²",     es: "Balcón al Parque\n280 sq ft",   fr: "Balcon sur Parc\n280 sq ft" } },
      ],
      specs: { bathrooms: "2+1", balconySize: "280 sq ft", totalArea: "1,800 sq ft" },
    },
    payment: { base: 2800000, plans: ["60/40", "70/30"] },
  },
};

// ─── AMENITIES_REGION_OVERLAY (3 portal shared) ────────────────────────────
// Semantic icon keys (pool, spa, dining, ...) resolve to Tabler classes via
// AMENITY_ICON_MAP at render-time.

export const AMENITIES_REGION_OVERLAY = {
  // ── GULF — Riyadh / KSA
  gulf: [
    {
      icon: "pool",
      title: { en: "Infinity Edge Pool", ar: "مسبح إنفينيتي", es: "Piscina infinita", fr: "Piscine à débordement" },
      desc: {
        en: "60m rooftop pool with panoramic Arabian Gulf views",
        ar: "مسبح على السطح بطول 60 مترًا يطل على الخليج العربي",
        es: "Piscina en azotea de 60 m con vistas panorámicas al Golfo Arábigo",
        fr: "Piscine sur le toit de 60 m offrant une vue panoramique sur le Golfe Arabique",
      },
    },
    {
      icon: "spa",
      title: { en: "Spa & Hammam", ar: "سبا وحمام", es: "Spa y hammam", fr: "Spa et hammam" },
      desc: {
        en: "Full-service spa with traditional hammam and cryo chamber",
        ar: "سبا متكامل مع حمام تقليدي وغرفة تبريد",
        es: "Spa de servicio completo con hammam tradicional y cámara de crioterapia",
        fr: "Spa complet avec hammam traditionnel et chambre de cryothérapie",
      },
    },
    {
      icon: "dining",
      title: { en: "Private Dining", ar: "مطعم خاص", es: "Restaurante privado", fr: "Restaurant privé" },
      desc: {
        en: "Michelin-standard resident-only restaurant with majlis lounge",
        ar: "مطعم بمعايير ميشلان مخصص للسكان مع مجلس فاخر",
        es: "Restaurante exclusivo para residentes con estándar Michelin y salón majlis",
        fr: "Restaurant réservé aux résidents aux normes Michelin avec salon majlis",
      },
    },
    {
      icon: "fitness",
      title: { en: "Fitness Atelier", ar: "صالة لياقة", es: "Estudio de fitness", fr: "Atelier de fitness" },
      desc: {
        en: "Technogym-equipped studio with personal trainers and yoga pavilion",
        ar: "صالة مجهزة بأحدث أجهزة Technogym مع مدربين شخصيين وجناح يوغا",
        es: "Estudio equipado con Technogym, entrenadores personales y pabellón de yoga",
        fr: "Studio équipé Technogym avec entraîneurs personnels et pavillon de yoga",
      },
    },
    {
      icon: "marina",
      title: { en: "Prayer Room & Majlis", ar: "مصلى ومجلس", es: "Sala de oración y majlis", fr: "Salle de prière et majlis" },
      desc: {
        en: "Dedicated prayer rooms for men and women with majlis reception lounge",
        ar: "مصليات منفصلة للرجال والنساء مع مجلس استقبال فاخر",
        es: "Salas de oración independientes para hombres y mujeres con majlis de recepción",
        fr: "Salles de prière séparées pour hommes et femmes avec majlis de réception",
      },
    },
    {
      icon: "garden",
      title: { en: "Sky Gardens", ar: "حدائق سماوية", es: "Jardines en altura", fr: "Jardins suspendus" },
      desc: {
        en: "Landscaped terraces on every 10th floor with date palm groves",
        ar: "تراسات منسقة في كل طابق عاشر مع بساتين النخيل",
        es: "Terrazas paisajísticas cada diez pisos con palmerales de dátiles",
        fr: "Terrasses paysagées tous les dix étages avec palmeraies de dattiers",
      },
    },
    {
      icon: "kids",
      title: { en: "Kids Club", ar: "نادي الأطفال", es: "Club infantil", fr: "Club enfants" },
      desc: {
        en: "Supervised play areas, Arabic learning center and family majlis",
        ar: "مناطق لعب تحت الإشراف ومركز تعلم اللغة العربية ومجلس عائلي",
        es: "Áreas de juego supervisadas, centro de aprendizaje de árabe y majlis familiar",
        fr: "Aires de jeux supervisées, centre d'apprentissage de l'arabe et majlis familial",
      },
    },
    {
      icon: "valet",
      title: { en: "24/7 Valet Service", ar: "خدمة فاليه على مدار الساعة", es: "Servicio de valet 24/7", fr: "Service de voiturier 24/7" },
      desc: {
        en: "Round-the-clock valet with covered parking and chauffeur-on-call",
        ar: "خدمة فاليه على مدار الساعة مع مواقف مغطاة وسائق تحت الطلب",
        es: "Valet las 24 horas con estacionamiento cubierto y chofer a pedido",
        fr: "Voiturier 24h/24 avec stationnement couvert et chauffeur à la demande",
      },
    },
  ],

  // ── USA — Manhattan / NYC
  usa: [
    {
      icon: "pool",
      title: { en: "Skyline Rooftop Pool", ar: "مسبح على السطح بإطلالة المدينة", es: "Piscina con vista al skyline", fr: "Piscine sur le toit avec vue sur Manhattan" },
      desc: {
        en: "60m heated rooftop pool with panoramic Manhattan skyline views",
        ar: "مسبح مدفأ على السطح بطول 60 مترًا يطل على أفق مانهاتن",
        es: "Piscina climatizada de 60 m en azotea con vista panorámica al skyline de Manhattan",
        fr: "Piscine chauffée de 60 m sur le toit avec vue panoramique sur Manhattan",
      },
    },
    {
      icon: "spa",
      title: { en: "Spa & Wellness", ar: "سبا وعافية", es: "Spa y bienestar", fr: "Spa et bien-être" },
      desc: {
        en: "Full-service spa with cryo chamber, salt room and meditation studio",
        ar: "سبا متكامل مع غرفة تبريد وغرفة ملحية واستوديو تأمل",
        es: "Spa de servicio completo con cámara de crioterapia, sala de sal y estudio de meditación",
        fr: "Spa complet avec chambre de cryothérapie, salle de sel et studio de méditation",
      },
    },
    {
      icon: "dining",
      title: { en: "Michelin Private Dining", ar: "مطعم خاص بمعايير ميشلان", es: "Restaurante privado Michelin", fr: "Restaurant privé étoilé Michelin" },
      desc: {
        en: "Michelin-starred chef-led restaurant exclusively for residents",
        ar: "مطعم بقيادة شيف حائز على نجمة ميشلان للسكان حصريًا",
        es: "Restaurante dirigido por chef con estrella Michelin, exclusivo para residentes",
        fr: "Restaurant dirigé par un chef étoilé Michelin, réservé aux résidents",
      },
    },
    {
      icon: "fitness",
      title: { en: "Fitness Atelier", ar: "صالة لياقة", es: "Estudio de fitness", fr: "Atelier de fitness" },
      desc: {
        en: "Technogym studio with Peloton wall, boxing ring and personal trainers",
        ar: "صالة مجهزة بأحدث أجهزة Technogym مع جدار Peloton وحلبة ملاكمة ومدربين شخصيين",
        es: "Estudio Technogym con muro Peloton, ring de boxeo y entrenadores personales",
        fr: "Studio Technogym avec mur Peloton, ring de boxe et entraîneurs personnels",
      },
    },
    {
      icon: "marina",
      title: { en: "Hudson Marina Access", ar: "وصول لمارينا هدسون", es: "Acceso a Hudson Marina", fr: "Accès au port Hudson" },
      desc: {
        en: "Private Hudson River berths for yachts up to 60ft and water taxi pier",
        ar: "أرصفة خاصة على نهر هدسون لليخوت حتى 60 قدمًا ورصيف تاكسي مائي",
        es: "Amarres privados en el río Hudson para yates de hasta 60 pies y muelle de taxi acuático",
        fr: "Postes d'amarrage privés sur l'Hudson pour yachts jusqu'à 60 pieds et quai de taxi nautique",
      },
    },
    {
      icon: "garden",
      title: { en: "Sky Gardens", ar: "حدائق سماوية", es: "Jardines en altura", fr: "Jardins suspendus" },
      desc: {
        en: "Landscaped terraces on every 10th floor with Central Park-inspired design",
        ar: "تراسات منسقة في كل طابق عاشر بتصميم مستوحى من سنترال بارك",
        es: "Terrazas paisajísticas cada diez pisos con diseño inspirado en Central Park",
        fr: "Terrasses paysagées tous les dix étages au design inspiré de Central Park",
      },
    },
    {
      icon: "kids",
      title: { en: "Kids Club", ar: "نادي الأطفال", es: "Club infantil", fr: "Club enfants" },
      desc: {
        en: "Supervised play areas, STEM learning lab and teen lounge",
        ar: "مناطق لعب تحت الإشراف ومختبر تعلم STEM وصالة للمراهقين",
        es: "Áreas de juego supervisadas, laboratorio STEM y salón para adolescentes",
        fr: "Aires de jeux supervisées, laboratoire STEM et salon pour adolescents",
      },
    },
    {
      icon: "valet",
      title: { en: "Valet & EV Charging", ar: "فاليه وشحن السيارات الكهربائية", es: "Valet y carga eléctrica", fr: "Voiturier et recharge VE" },
      desc: {
        en: "24/7 valet with Tesla Superchargers and Lucid/Rivian DC fast charging",
        ar: "خدمة فاليه على مدار الساعة مع شواحن Tesla السريعة وشحن سريع لـ Lucid وRivian",
        es: "Valet 24/7 con Tesla Superchargers y carga rápida DC para Lucid y Rivian",
        fr: "Voiturier 24/7 avec Tesla Superchargers et recharge rapide DC pour Lucid et Rivian",
      },
    },
  ],

  // ── MEXICO — Hacienda + Riviera Maya
  mexico: [
    {
      icon: "pool",
      title: { en: "Hacienda Pool & Patio", ar: "مسبح وفناء هاسيندا", es: "Piscina y patio hacienda", fr: "Piscine et patio hacienda" },
      desc: {
        en: "60m pool surrounded by hacienda gardens and palm-shaded patio",
        ar: "مسبح بطول 60 مترًا محاط بحدائق الهاسيندا وفناء مظلل بأشجار النخيل",
        es: "Piscina de 60 m rodeada de jardines hacienda y patio sombreado por palmeras",
        fr: "Piscine de 60 m entourée de jardins hacienda et patio ombragé par des palmiers",
      },
    },
    {
      icon: "spa",
      title: { en: "Mayan Spa & Temazcal", ar: "سبا المايا وتيمازكال", es: "Spa maya y temazcal", fr: "Spa maya et temazcal" },
      desc: {
        en: "Traditional temazcal steam ritual, cenote-inspired pools and holistic therapies",
        ar: "طقوس البخار التقليدية تيمازكال ومسابح مستوحاة من سينوت وعلاجات شاملة",
        es: "Ritual tradicional de temazcal, piscinas inspiradas en cenotes y terapias holísticas",
        fr: "Rituel traditionnel temazcal, piscines inspirées des cénotes et thérapies holistiques",
      },
    },
    {
      icon: "dining",
      title: { en: "Cocina de Autor", ar: "مطبخ المؤلف", es: "Cocina de autor", fr: "Cuisine d'auteur" },
      desc: {
        en: "Resident-only restaurant celebrating Yucatecan cuisine with mezcal cellar",
        ar: "مطعم مخصص للسكان يحتفي بالمطبخ اليوكاتيكي مع قبو ميزكال",
        es: "Restaurante exclusivo para residentes que celebra la cocina yucateca con cava de mezcal",
        fr: "Restaurant réservé aux résidents célébrant la cuisine yucatèque avec cave à mezcal",
      },
    },
    {
      icon: "fitness",
      title: { en: "Fitness Atelier", ar: "صالة لياقة", es: "Estudio de fitness", fr: "Atelier de fitness" },
      desc: {
        en: "Technogym studio with open-air yoga deck and beachfront crossfit zone",
        ar: "صالة Technogym مع منصة يوغا في الهواء الطلق ومنطقة كروس فيت على الشاطئ",
        es: "Estudio Technogym con cubierta de yoga al aire libre y zona de crossfit frente al mar",
        fr: "Studio Technogym avec terrasse de yoga en plein air et zone crossfit en bord de mer",
      },
    },
    {
      icon: "marina",
      title: { en: "Marina & Beach Club", ar: "مارينا ونادي الشاطئ", es: "Marina y club de playa", fr: "Marina et club de plage" },
      desc: {
        en: "Private Caribbean berths for yachts up to 60ft and exclusive beach club",
        ar: "أرصفة كاريبية خاصة لليخوت حتى 60 قدمًا ونادي شاطئ حصري",
        es: "Amarres privados en el Caribe para yates de hasta 60 pies y club de playa exclusivo",
        fr: "Postes d'amarrage privés dans les Caraïbes pour yachts jusqu'à 60 pieds et club de plage exclusif",
      },
    },
    {
      icon: "garden",
      title: { en: "Patio Gardens", ar: "حدائق الفناء", es: "Jardines patio", fr: "Jardins patio" },
      desc: {
        en: "Landscaped patios on every 10th floor with bougainvillea and tropical flora",
        ar: "أفنية منسقة في كل طابق عاشر بأزهار الجهنمية والنباتات الاستوائية",
        es: "Patios paisajísticos cada diez pisos con buganvilias y flora tropical",
        fr: "Patios paysagés tous les dix étages avec bougainvilliers et flore tropicale",
      },
    },
    {
      icon: "kids",
      title: { en: "Club Infantil", ar: "نادي الأطفال", es: "Club infantil", fr: "Club enfants" },
      desc: {
        en: "Supervised play areas, Spanish-immersion learning and family fiesta hall",
        ar: "مناطق لعب تحت الإشراف وتعلم الإسبانية بالانغماس وقاعة احتفالات عائلية",
        es: "Áreas de juego supervisadas, inmersión en español y salón de fiestas familiares",
        fr: "Aires de jeux supervisées, immersion en espagnol et salle de fête familiale",
      },
    },
    {
      icon: "valet",
      title: { en: "Valet & Concierge", ar: "فاليه وكونسيرج", es: "Valet y concierge", fr: "Voiturier et conciergerie" },
      desc: {
        en: "24/7 valet, EV charging and concierge for mercado tours and excursions",
        ar: "خدمة فاليه على مدار الساعة وشحن كهربائي وكونسيرج لجولات المركادو والرحلات",
        es: "Valet 24/7, carga eléctrica y concierge para tours por mercados y excursiones",
        fr: "Voiturier 24/7, recharge VE et conciergerie pour visites de mercados et excursions",
      },
    },
  ],

  // ── CANADA — Vancouver waterfront
  canada: [
    {
      icon: "pool",
      title: { en: "Waterfront Infinity Pool", ar: "مسبح إنفينيتي على الواجهة المائية", es: "Piscina infinita frente al mar", fr: "Piscine à débordement face à l'océan" },
      desc: {
        en: "60m heated infinity pool with Pacific Ocean and North Shore mountain views",
        ar: "مسبح إنفينيتي مدفأ بطول 60 مترًا يطل على المحيط الهادئ وجبال نورث شور",
        es: "Piscina infinita climatizada de 60 m con vistas al Pacífico y a las montañas North Shore",
        fr: "Piscine à débordement chauffée de 60 m avec vue sur le Pacifique et les montagnes North Shore",
      },
    },
    {
      icon: "spa",
      title: { en: "Nordic Spa & Wellness", ar: "سبا نورديك وعافية", es: "Spa nórdico y bienestar", fr: "Spa nordique et bien-être" },
      desc: {
        en: "Nordic hot-cold circuit, cedar sauna, cryo chamber and salt room",
        ar: "دورة نورديك ساخنة-باردة وساونا الأرز وغرفة تبريد وغرفة ملحية",
        es: "Circuito nórdico frío-caliente, sauna de cedro, cámara de crioterapia y sala de sal",
        fr: "Circuit nordique chaud-froid, sauna en cèdre, chambre de cryothérapie et salle de sel",
      },
    },
    {
      icon: "dining",
      title: { en: "Coastal Private Dining", ar: "مطعم ساحلي خاص", es: "Restaurante privado costero", fr: "Restaurant privé côtier" },
      desc: {
        en: "Resident-only restaurant celebrating Pacific Northwest cuisine and BC wines",
        ar: "مطعم مخصص للسكان يحتفي بمطبخ شمال غرب المحيط الهادئ ونبيذ كولومبيا البريطانية",
        es: "Restaurante exclusivo para residentes que celebra la cocina del Pacífico Noroeste y vinos de BC",
        fr: "Restaurant réservé aux résidents célébrant la cuisine du Nord-Ouest Pacifique et vins de Colombie-Britannique",
      },
    },
    {
      icon: "fitness",
      title: { en: "Fitness Atelier", ar: "صالة لياقة", es: "Estudio de fitness", fr: "Atelier de fitness" },
      desc: {
        en: "Technogym studio with seawall running access and bilingual personal trainers",
        ar: "صالة Technogym مع وصول للجري على Seawall ومدربين شخصيين ثنائيي اللغة",
        es: "Estudio Technogym con acceso al malecón para correr y entrenadores personales bilingües",
        fr: "Studio Technogym avec accès à la digue pour la course et entraîneurs personnels bilingues",
      },
    },
    {
      icon: "marina",
      title: { en: "Marina & Kayak Dock", ar: "مارينا ورصيف الكاياك", es: "Marina y muelle de kayak", fr: "Marina et quai à kayaks" },
      desc: {
        en: "Private Coal Harbour berths for yachts up to 60ft, kayak and paddleboard storage",
        ar: "أرصفة خاصة في كول هاربور لليخوت حتى 60 قدمًا وتخزين الكاياك والباديل بورد",
        es: "Amarres privados en Coal Harbour para yates de hasta 60 pies y guardado de kayak y paddleboard",
        fr: "Postes d'amarrage privés à Coal Harbour pour yachts jusqu'à 60 pieds et rangement kayak et paddleboard",
      },
    },
    {
      icon: "garden",
      title: { en: "Mountain Sky Terraces", ar: "تراسات الجبال السماوية", es: "Terrazas con vista a la montaña", fr: "Terrasses panoramiques sur les montagnes" },
      desc: {
        en: "Landscaped terraces on every 10th floor with West Coast rainforest plantings",
        ar: "تراسات منسقة في كل طابق عاشر بنباتات غابة الساحل الغربي المطيرة",
        es: "Terrazas paisajísticas cada diez pisos con vegetación del bosque pluvial de la Costa Oeste",
        fr: "Terrasses paysagées tous les dix étages avec végétation de la forêt pluviale de la Côte Ouest",
      },
    },
    {
      icon: "kids",
      title: { en: "Kids Club", ar: "نادي الأطفال", es: "Club infantil", fr: "Club enfants" },
      desc: {
        en: "Supervised play areas, bilingual EN/FR learning center and family lounge",
        ar: "مناطق لعب تحت الإشراف ومركز تعلم ثنائي اللغة EN/FR وصالة عائلية",
        es: "Áreas de juego supervisadas, centro de aprendizaje bilingüe EN/FR y salón familiar",
        fr: "Aires de jeux supervisées, centre d'apprentissage bilingue EN/FR et salon familial",
      },
    },
    {
      icon: "valet",
      title: { en: "Valet, EV & Ski Storage", ar: "فاليه وشحن كهربائي وتخزين التزلج", es: "Valet, eléctricos y guardado de esquís", fr: "Voiturier, VE et rangement à skis" },
      desc: {
        en: "24/7 valet with EV charging, heated ski and bike storage with tune-up service",
        ar: "خدمة فاليه على مدار الساعة مع شحن كهربائي وتخزين مدفأ للتزلج والدراجات مع خدمة الصيانة",
        es: "Valet 24/7 con carga eléctrica, guardado climatizado de esquís y bicicletas con servicio de mantenimiento",
        fr: "Voiturier 24/7 avec recharge VE, rangement chauffé pour skis et vélos avec service d'entretien",
      },
    },
  ],
};

// ─── INVEST_REGION_OVERLAY (3 portal shared) ───────────────────────────────

export const INVEST_REGION_OVERLAY = {
  gulf: [
    { stat: "8.2%",   label: { en: "Rental yield",   ar: "العائد الإيجاري", es: "Rendimiento por renta", fr: "Rendement locatif" },   desc: { en: "Above Riyadh market average",          ar: "أعلى من متوسط سوق الرياض",  es: "Por encima del promedio del mercado de Riad",   fr: "Au-dessus de la moyenne du marché de Riyad" } },
    { stat: "23%",    label: { en: "Capital growth", ar: "نمو رأس المال",  es: "Crecimiento de capital", fr: "Croissance du capital" }, desc: { en: "Projected 3-year appreciation",        ar: "التقدير المتوقع على مدى 3 سنوات", es: "Apreciación proyectada a 3 años",            fr: "Appréciation projetée sur 3 ans" } },
    { stat: "60/40",  label: { en: "Payment plan",   ar: "خطة الدفع",       es: "Plan de pago",           fr: "Plan de paiement" },     desc: { en: "Flexible construction-linked, Ijarah compatible", ar: "خطة مرنة مرتبطة بمراحل البناء، متوافقة مع الإجارة", es: "Flexible vinculado a la construcción, compatible con Ijarah", fr: "Flexible lié à la construction, compatible Ijarah" } },
    { stat: "Q4 2027", label: { en: "Handover",      ar: "التسليم",          es: "Entrega",                fr: "Livraison" },            desc: { en: "On schedule",                          ar: "وفقًا للجدول الزمني",         es: "Según lo previsto",                          fr: "Conforme au calendrier" } },
  ],
  usa: [
    { stat: "6.5%",   label: { en: "Rental yield",   ar: "العائد الإيجاري", es: "Rendimiento por renta", fr: "Rendement locatif" },   desc: { en: "Above NYC luxury market average",      ar: "أعلى من متوسط سوق نيويورك الفاخر", es: "Por encima del promedio del mercado de lujo de NYC", fr: "Au-dessus de la moyenne du marché de luxe de New York" } },
    { stat: "18%",    label: { en: "Capital growth", ar: "نمو رأس المال",  es: "Crecimiento de capital", fr: "Croissance du capital" }, desc: { en: "Projected 3-year appreciation",        ar: "التقدير المتوقع على مدى 3 سنوات", es: "Apreciación proyectada a 3 años",            fr: "Appréciation projetée sur 3 ans" } },
    { stat: "70/30",  label: { en: "Payment plan",   ar: "خطة الدفع",       es: "Plan de pago",           fr: "Plan de paiement" },     desc: { en: "Bank-financed structure available",    ar: "هيكل تمويل بنكي متاح",        es: "Estructura con financiación bancaria disponible", fr: "Structure avec financement bancaire disponible" } },
    { stat: "Q2 2027", label: { en: "Handover",      ar: "التسليم",          es: "Entrega",                fr: "Livraison" },            desc: { en: "On schedule",                          ar: "وفقًا للجدول الزمني",         es: "Según lo previsto",                          fr: "Conforme au calendrier" } },
  ],
  mexico: [
    { stat: "9.0%",   label: { en: "Rental yield",   ar: "العائد الإيجاري", es: "Rendimiento por renta", fr: "Rendement locatif" },   desc: { en: "Strong vacation rental market",        ar: "سوق إيجارات سياحية قوي",     es: "Sólido mercado de renta vacacional",        fr: "Marché de location de vacances solide" } },
    { stat: "25%",    label: { en: "Capital growth", ar: "نمو رأس المال",  es: "Crecimiento de capital", fr: "Croissance du capital" }, desc: { en: "Riviera Maya appreciation premium",    ar: "علاوة تقدير ريفييرا مايا",     es: "Prima de apreciación de la Riviera Maya",   fr: "Prime d'appréciation de la Riviera Maya" } },
    { stat: "50/50",  label: { en: "Payment plan",   ar: "خطة الدفع",       es: "Plan de pago",           fr: "Plan de paiement" },     desc: { en: "Pre-construction discount structure",  ar: "هيكل بخصم ما قبل البناء",      es: "Estructura con descuento de preconstrucción", fr: "Structure avec remise pré-construction" } },
    { stat: "Q1 2028", label: { en: "Handover",      ar: "التسليم",          es: "Entrega",                fr: "Livraison" },            desc: { en: "On schedule",                          ar: "وفقًا للجدول الزمني",         es: "Según lo previsto",                          fr: "Conforme au calendrier" } },
  ],
  canada: [
    { stat: "5.0%",   label: { en: "Rental yield",   ar: "العائد الإيجاري", es: "Rendimiento por renta", fr: "Rendement locatif" },   desc: { en: "Stable Vancouver yield",               ar: "عائد فانكوفر المستقر",        es: "Rendimiento estable de Vancouver",          fr: "Rendement stable de Vancouver" } },
    { stat: "15%",    label: { en: "Capital growth", ar: "نمو رأس المال",  es: "Crecimiento de capital", fr: "Croissance du capital" }, desc: { en: "Projected 3-year appreciation",        ar: "التقدير المتوقع على مدى 3 سنوات", es: "Apreciación proyectada a 3 años",            fr: "Appréciation projetée sur 3 ans" } },
    { stat: "65/35",  label: { en: "Payment plan",   ar: "خطة الدفع",       es: "Plan de pago",           fr: "Plan de paiement" },     desc: { en: "Construction-linked structure",        ar: "هيكل مرتبط بمراحل البناء",     es: "Estructura vinculada a la construcción",     fr: "Structure liée à la construction" } },
    { stat: "Q3 2027", label: { en: "Handover",      ar: "التسليم",          es: "Entrega",                fr: "Livraison" },            desc: { en: "On schedule",                          ar: "وفقًا للجدول الزمني",         es: "Según lo previsto",                          fr: "Conforme au calendrier" } },
  ],
};

// ─── INTERNAL ───────────────────────────────────────────────────────────────

// Semantic amenity key → Tabler icon class. Bundle uses semantic names so
// shifting iconography (e.g. ti-pool → ti-swim-up) is a one-line change here.
const AMENITY_ICON_MAP = {
  pool: "ti-pool",
  spa: "ti-flower",
  dining: "ti-tools-kitchen-2",
  fitness: "ti-barbell",
  marina: "ti-sailboat",
  garden: "ti-plant-2",
  kids: "ti-mood-kid",
  valet: "ti-charging-pile",
};

function pickLang(obj, lang) {
  if (!obj) return "";
  return obj[lang] ?? obj.en ?? "";
}

function resolveUnits(canonical, overlay, regionId, lang) {
  const regionOverlay = overlay[regionId] || overlay.gulf;
  return canonical.map((unit) => {
    const o = regionOverlay[unit.id];
    if (!o) return unit;
    return {
      ...unit,
      name: pickLang(o.name, lang),
      nameEn: o.name.en,
      tower: pickLang(o.tower, lang),
      floor: pickLang(o.floor, lang),
      beds: pickLang(o.beds, lang),
      baths: pickLang(o.baths, lang),
      size: pickLang(o.size, lang),
      feature: pickLang(o.feature, lang),
      status: pickLang(o.status, lang),
      category: pickLang(o.category, lang),
      view: pickLang(o.view, lang),
      desc: pickLang(o.desc, lang),
      features: o.features[lang] ?? o.features.en,
    };
  });
}

// ─── PUBLIC HELPERS ─────────────────────────────────────────────────────────

export function getLuxuryUnits(regionId, lang) {
  return resolveUnits(UNITS_LUXURY, UNIT_REGION_OVERLAY_LUXURY, regionId, lang);
}

export function getFamilyUnits(regionId, lang) {
  return resolveUnits(UNITS_FAMILY, UNIT_REGION_OVERLAY_FAMILY, regionId, lang);
}

export function getAmenities(regionId, lang) {
  const list = AMENITIES_REGION_OVERLAY[regionId] || AMENITIES_REGION_OVERLAY.gulf;
  return list.map((a) => ({
    icon: AMENITY_ICON_MAP[a.icon] || a.icon,
    title: pickLang(a.title, lang),
    desc: pickLang(a.desc, lang),
  }));
}

export function getInvestStats(regionId, lang) {
  const list = INVEST_REGION_OVERLAY[regionId] || INVEST_REGION_OVERLAY.gulf;
  return list.map((s) => ({
    stat: s.stat,
    label: pickLang(s.label, lang),
    desc: pickLang(s.desc, lang),
  }));
}

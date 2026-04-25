// ═══════════════════════════════════════════════════════
// REGION CONFIGURATION — Market-specific settings
// Used by: Dashboard, Portals, Seed Data, i18n
// ═══════════════════════════════════════════════════════

const GULF = {
  id: 'gulf',
  label: { en: 'Gulf / KSA', ar: 'الخليج', es: 'Golfo / KSA' },
  flag: '🇸🇦',
  languages: ['ar', 'en'],
  defaultLang: 'ar',
  rtl: { ar: true, en: false },
  currency: 'SAR',
  currencySymbol: '﷼',
  locale: 'ar-SA',
  sidebarAccent: '#b8860b',
  projects: {
    real_estate: { en: 'Al Noor Residences', ar: 'مساكن النور', es: 'Residencias Al Noor' },
    automotive: { en: 'Prestige Motors', ar: 'بريستيج موتورز', es: 'Prestige Motors' },
    yacht: { en: 'Gulf Marina Yachts', ar: 'يخوت مارينا الخليج', es: 'Yates Marina del Golfo' },
  },
  personas: {
    real_estate: [
      { id: 'vip1', name: 'Khalid Al-Rashid', email: 'khalid@alnoor.sa', type: 'vip', role: { en: 'VIP Investor', ar: 'مستثمر VIP', es: 'Inversor VIP' } },
      { id: 'vip2', name: 'Fatima Al-Mansouri', email: 'fatima@alnoor.sa', type: 'vip', role: { en: 'VIP Buyer', ar: 'مشترية VIP', es: 'Compradora VIP' } },
      { id: 'fam1', name: 'Ahmed Al-Fahad', email: 'ahmed@alnoor.sa', type: 'family', role: { en: 'Family Buyer', ar: 'مشتري عائلي', es: 'Comprador Familiar' } },
    ],
    automotive: [
      { id: 'vip1', name: 'Sultan Al-Otaibi', email: 'sultan@prestige.sa', type: 'vip', role: { en: 'VIP Collector', ar: 'جامع VIP', es: 'Coleccionista VIP' } },
      { id: 'vip2', name: 'Omar Al-Dhaheri', email: 'khalid@prestige.sa', type: 'vip', role: { en: 'VIP Client', ar: 'عميل VIP', es: 'Cliente VIP' } },
    ],
    yacht: [
      { id: 'vip1', name: 'Prince Nasser Al-Saud', email: 'nasser@gulfmarina.sa', type: 'vip', role: { en: 'VIP Owner', ar: 'مالك VIP', es: 'Propietario VIP' } },
      { id: 'vip2', name: 'Sheikh Omar Al-Thani', email: 'omar@gulfmarina.sa', type: 'vip', role: { en: 'VIP Charter', ar: 'مستأجر VIP', es: 'VIP Charter' } },
    ],
  },
  dealValueRange: { min: 2000000, max: 25000000 },
};

const USA = {
  id: 'usa',
  label: { en: 'United States', ar: 'الولايات المتحدة', es: 'Estados Unidos' },
  flag: '🇺🇸',
  languages: ['en', 'es'],
  defaultLang: 'en',
  rtl: { en: false, es: false },
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  sidebarAccent: '#1a365d',
  projects: {
    real_estate: { en: 'Skyline Towers', ar: 'أبراج سكايلاين', es: 'Torres Skyline' },
    automotive: { en: 'Premier Auto Group', ar: 'بريمير أوتو', es: 'Premier Auto Group' },
    yacht: { en: 'Pacific Coast Yachts', ar: 'يخوت الساحل', es: 'Yates Costa Pacífico' },
  },
  personas: {
    real_estate: [
      { id: 'vip1', name: 'Daniel Roberts', email: 'james@skyline.com', type: 'vip', role: { en: 'VIP Investor', ar: 'مستثمر VIP', es: 'Inversor VIP' } },
      { id: 'vip2', name: 'Olivia Parker', email: 'sarah@skyline.com', type: 'vip', role: { en: 'VIP Buyer', ar: 'مشترية VIP', es: 'Compradora VIP' } },
      { id: 'fam1', name: 'Robert Williams', email: 'robert@skyline.com', type: 'family', role: { en: 'Family Buyer', ar: 'مشتري عائلي', es: 'Comprador Familiar' } },
    ],
    automotive: [
      { id: 'vip1', name: 'Michael Torres', email: 'michael@premier.com', type: 'vip', role: { en: 'VIP Collector', ar: 'جامع VIP', es: 'Coleccionista VIP' } },
      { id: 'vip2', name: 'Emily Johnson', email: 'emily@premier.com', type: 'vip', role: { en: 'VIP Client', ar: 'عميل VIP', es: 'Cliente VIP' } },
    ],
    yacht: [
      { id: 'vip1', name: 'Richard Blackwell', email: 'richard@pacificyachts.com', type: 'vip', role: { en: 'VIP Owner', ar: 'مالك VIP', es: 'Propietario VIP' } },
      { id: 'vip2', name: 'Victoria Sinclair', email: 'victoria@pacificyachts.com', type: 'vip', role: { en: 'VIP Charter', ar: 'مستأجر VIP', es: 'VIP Charter' } },
    ],
  },
  dealValueRange: { min: 500000, max: 15000000 },
};

const MEXICO = {
  id: 'mexico',
  label: { en: 'Mexico', ar: 'المكسيك', es: 'México' },
  flag: '🇲🇽',
  languages: ['es', 'en'],
  defaultLang: 'es',
  rtl: { es: false, en: false },
  currency: 'MXN',
  currencySymbol: '$',
  locale: 'es-MX',
  sidebarAccent: '#c25e30',
  projects: {
    real_estate: { en: 'Residencias del Sol', ar: 'مساكن الشمس', es: 'Residencias del Sol' },
    automotive: { en: 'Autos Premiere', ar: 'أوتوز بريمير', es: 'Autos Premiere' },
    yacht: { en: 'Marina del Caribe', ar: 'مارينا الكاريبي', es: 'Marina del Caribe' },
  },
  personas: {
    real_estate: [
      { id: 'vip1', name: 'Carlos Rodriguez', email: 'carlos@residencias.mx', type: 'vip', role: { en: 'VIP Investor', ar: 'مستثمر VIP', es: 'Inversor VIP' } },
      { id: 'vip2', name: 'Maria Gonzalez', email: 'maria@residencias.mx', type: 'vip', role: { en: 'VIP Buyer', ar: 'مشترية VIP', es: 'Compradora VIP' } },
      { id: 'fam1', name: 'Diego Fernandez', email: 'diego@residencias.mx', type: 'family', role: { en: 'Family Buyer', ar: 'مشتري عائلي', es: 'Comprador Familiar' } },
    ],
    automotive: [
      { id: 'vip1', name: 'Alejandro Silva', email: 'alejandro@premiere.mx', type: 'vip', role: { en: 'VIP Collector', ar: 'جامع VIP', es: 'Coleccionista VIP' } },
      { id: 'vip2', name: 'Isabella Ramirez', email: 'isabella@premiere.mx', type: 'vip', role: { en: 'VIP Client', ar: 'عميل VIP', es: 'Cliente VIP' } },
    ],
    yacht: [
      { id: 'vip1', name: 'Fernando Castillo', email: 'fernando@marina.mx', type: 'vip', role: { en: 'VIP Owner', ar: 'مالك VIP', es: 'Propietario VIP' } },
      { id: 'vip2', name: 'Valentina Reyes', email: 'valentina@marina.mx', type: 'vip', role: { en: 'VIP Charter', ar: 'مستأجر VIP', es: 'VIP Charter' } },
    ],
  },
  dealValueRange: { min: 5000000, max: 80000000 },
};

const CANADA = {
  id: 'canada',
  label: { en: 'Canada', ar: 'كندا', es: 'Canadá', fr: 'Canada' },
  flag: '🇨🇦',
  languages: ['en', 'fr'],
  defaultLang: 'en',
  rtl: { en: false, fr: false },
  currency: 'CAD',
  currencySymbol: 'C$',
  locale: 'en-CA',
  sidebarAccent: '#d52b1e',
  projects: {
    real_estate: { en: 'Vista Residences', ar: 'فيستا ريزيدنسز', es: 'Residencias Vista', fr: 'Résidences Vista' },
    automotive: { en: 'Prestige Motors Vancouver', ar: 'بريستيج موتورز فانكوفر', es: 'Prestige Motors Vancouver', fr: 'Prestige Motors Vancouver' },
    yacht: { en: 'Pacific Marina Yachts', ar: 'يخوت مارينا الباسيفيك', es: 'Yates Marina Pacífico', fr: 'Yachts Marina Pacifique' },
  },
  personas: {
    real_estate: [
      { id: 'vip1', name: 'James Mitchell', email: 'james@vista.ca', type: 'vip', role: { en: 'VIP Investor', ar: 'مستثمر VIP', es: 'Inversor VIP', fr: 'Investisseur VIP' } },
      { id: 'vip2', name: 'Sarah Chen', email: 'sarah@vista.ca', type: 'vip', role: { en: 'VIP Buyer', ar: 'مشترية VIP', es: 'Compradora VIP', fr: 'Acheteuse VIP' } },
      { id: 'fam1', name: 'Michael Tremblay', email: 'emily@vista.ca', type: 'family', role: { en: 'Family Buyer', ar: 'مشتري عائلي', es: 'Comprador Familiar', fr: 'Acheteur Familial' } },
    ],
    automotive: [
      { id: 'vip1', name: 'David Thompson', email: 'david@prestige.ca', type: 'vip', role: { en: 'VIP Collector', ar: 'جامع VIP', es: 'Coleccionista VIP', fr: 'Collectionneur VIP' } },
      { id: 'vip2', name: 'Jennifer Laurent', email: 'sarah@prestige.ca', type: 'vip', role: { en: 'VIP Client', ar: 'عميل VIP', es: 'Cliente VIP', fr: 'Client VIP' } },
    ],
    yacht: [
      { id: 'vip1', name: 'Robert MacKenzie', email: 'robert@marina.ca', type: 'vip', role: { en: 'VIP Owner', ar: 'مالك VIP', es: 'Propietario VIP', fr: 'Propriétaire VIP' } },
      { id: 'vip2', name: 'Catherine Leblanc', email: 'catherine@marina.ca', type: 'vip', role: { en: 'VIP Charter', ar: 'مستأجر VIP', es: 'VIP Charter', fr: 'Affréteur VIP' } },
    ],
  },
  dealValueRange: { min: 500000, max: 15000000 },
};

export const REGIONS = { gulf: GULF, usa: USA, mexico: MEXICO, canada: CANADA };
export const REGION_LIST = [GULF, USA, MEXICO, CANADA];
export const DEFAULT_REGION = 'gulf';

export function getRegion(regionId) {
  return REGIONS[regionId] || GULF;
}

export function formatCurrency(value, regionId) {
  const region = getRegion(regionId);
  try {
    return new Intl.NumberFormat(region.locale, {
      style: 'currency',
      currency: region.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${region.currencySymbol}${value.toLocaleString()}`;
  }
}

export function getEffectiveLocale(regionId, lang) {
  const map = {
    gulf: { ar: "ar-SA", en: "en-US" },
    usa: { en: "en-US", es: "es-US" },
    mexico: { es: "es-MX", en: "en-US" },
    canada: { en: "en-CA", fr: "fr-CA" },
  };
  return map[regionId]?.[lang] || "en-US";
}

export function getPersonas(sectorId, regionId) {
  const region = getRegion(regionId);
  return region.personas[sectorId] || region.personas.real_estate;
}

export function getProjectName(sectorId, regionId, lang) {
  const region = getRegion(regionId);
  const project = region.projects[sectorId] || region.projects.real_estate;
  return project[lang] || project.en;
}

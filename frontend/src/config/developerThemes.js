/* ═══════════════════════════════════════════════════════════════
   developerThemes.js — Themeable Config for Target Developers
   
   Swap this config to rebrand the entire demo for any developer.
   Section 9 & 17 of the Playbook: 19 target developers.
   ═══════════════════════════════════════════════════════════════ */

const DEVELOPER_THEMES = {
  /* ── Default Demo Theme ── */
  vista: {
    id: 'vista',
    developer: { en: 'Vista Residences', ar: 'فيستا ريزيدنسز' },
    project: { en: 'Vista Tower', ar: 'برج فيستا' },
    tagline: { en: 'Luxury Living, Elevated.', ar: 'حياة فاخرة، بآفاق أعلى.' },
    location: { en: 'Downtown Dubai, UAE', ar: 'وسط دبي، الإمارات' },
    colors: { primary: '#c1121f', accent: '#457b9d' },
    towers: [
      {
        id: 'north',
        name: { en: 'North Tower', ar: 'البرج الشمالي' },
        floors: 42,
        units: [
          { id: 'ph-a', type: 'penthouse', floor: 42, beds: 4, baths: 5, sqm: 385, price: 12500000, status: 'available' },
          { id: 'ph-b', type: 'penthouse', floor: 41, beds: 3, baths: 4, sqm: 310, price: 9800000, status: 'available' },
          { id: 'u-4001', type: 'premium', floor: 40, beds: 3, baths: 3, sqm: 245, price: 6200000, status: 'available' },
          { id: 'u-3501', type: 'premium', floor: 35, beds: 2, baths: 2, sqm: 185, price: 4100000, status: 'reserved' },
          { id: 'u-3001', type: 'standard', floor: 30, beds: 2, baths: 2, sqm: 165, price: 3400000, status: 'available' },
          { id: 'u-2001', type: 'standard', floor: 20, beds: 1, baths: 1, sqm: 95, price: 1800000, status: 'sold' },
        ],
      },
      {
        id: 'south',
        name: { en: 'South Tower', ar: 'البرج الجنوبي' },
        floors: 38,
        units: [
          { id: 'ph-c', type: 'penthouse', floor: 38, beds: 5, baths: 6, sqm: 420, price: 15200000, status: 'available' },
          { id: 'u-3502', type: 'premium', floor: 35, beds: 3, baths: 3, sqm: 260, price: 7100000, status: 'available' },
          { id: 'u-2502', type: 'standard', floor: 25, beds: 2, baths: 2, sqm: 170, price: 3600000, status: 'available' },
          { id: 'u-1501', type: 'standard', floor: 15, beds: 1, baths: 1, sqm: 88, price: 1650000, status: 'available' },
        ],
      },
    ],
    paymentPlan: { downPayment: 20, construction: 50, handover: 30, completionYear: 2027 },
    amenities: ['infinity-pool', 'gym', 'spa', 'concierge', 'valet', 'rooftop-lounge'],
    currency: 'AED',
  },

  /* ── Saudi Developers ── */
  ajdan: {
    id: 'ajdan',
    developer: { en: 'Ajdan Real Estate Development', ar: 'أجدان للتطوير العقاري' },
    project: { en: 'Ajdan Walk', ar: 'أجدان ووك' },
    tagline: { en: 'Where Vision Meets Living.', ar: 'حيث تلتقي الرؤية بالحياة.' },
    location: { en: 'Eastern Province, Saudi Arabia', ar: 'المنطقة الشرقية، المملكة العربية السعودية' },
    colors: { primary: '#1a5632', accent: '#b89a3d' },
    towers: [
      {
        id: 'main', name: { en: 'Ajdan Walk Tower', ar: 'برج أجدان ووك' }, floors: 30,
        units: [
          { id: 'ph-1', type: 'penthouse', floor: 30, beds: 4, baths: 5, sqm: 350, price: 8500000, status: 'available' },
          { id: 'u-2501', type: 'premium', floor: 25, beds: 3, baths: 3, sqm: 220, price: 4800000, status: 'available' },
          { id: 'u-1801', type: 'standard', floor: 18, beds: 2, baths: 2, sqm: 155, price: 2900000, status: 'available' },
        ],
      },
    ],
    paymentPlan: { downPayment: 25, construction: 45, handover: 30, completionYear: 2028 },
    amenities: ['pool', 'gym', 'mosque', 'garden', 'retail'],
    currency: 'SAR',
  },

  binghatti: {
    id: 'binghatti',
    developer: { en: 'Binghatti Developers', ar: 'بن غاطي للتطوير' },
    project: { en: 'Binghatti Aurora', ar: 'بن غاطي أورورا' },
    tagline: { en: 'Architectural Art, Redefined.', ar: 'فن العمارة، بصورة جديدة.' },
    location: { en: 'Business Bay, Dubai, UAE', ar: 'الخليج التجاري، دبي، الإمارات' },
    colors: { primary: '#1a1a1f', accent: '#d4a853' },
    towers: [
      {
        id: 'aurora', name: { en: 'Aurora Tower', ar: 'برج أورورا' }, floors: 50,
        units: [
          { id: 'ph-sky', type: 'penthouse', floor: 50, beds: 5, baths: 6, sqm: 500, price: 22000000, status: 'available' },
          { id: 'u-4501', type: 'premium', floor: 45, beds: 3, baths: 4, sqm: 280, price: 8500000, status: 'available' },
          { id: 'u-3001', type: 'standard', floor: 30, beds: 2, baths: 2, sqm: 150, price: 3200000, status: 'available' },
          { id: 'u-1501', type: 'standard', floor: 15, beds: 1, baths: 1, sqm: 80, price: 1400000, status: 'available' },
        ],
      },
    ],
    paymentPlan: { downPayment: 20, construction: 60, handover: 20, completionYear: 2027 },
    amenities: ['infinity-pool', 'gym', 'spa', 'co-working', 'cinema', 'sky-lounge'],
    currency: 'AED',
  },

  qataridiar: {
    id: 'qataridiar',
    developer: { en: 'Qatari Diar Real Estate', ar: 'الديار القطرية للاستثمار العقاري' },
    project: { en: 'Lusail Waterfront', ar: 'واجهة لوسيل البحرية' },
    tagline: { en: 'Sovereign Standards, Private Living.', ar: 'معايير سيادية، حياة خاصة.' },
    location: { en: 'Lusail City, Qatar', ar: 'مدينة لوسيل، قطر' },
    colors: { primary: '#7b1e3e', accent: '#2c5f7c' },
    towers: [
      {
        id: 'waterfront', name: { en: 'Waterfront Residence', ar: 'إقامة الواجهة البحرية' }, floors: 35,
        units: [
          { id: 'ph-1', type: 'penthouse', floor: 35, beds: 5, baths: 6, sqm: 480, price: 28000000, status: 'available' },
          { id: 'u-3001', type: 'premium', floor: 30, beds: 4, baths: 4, sqm: 320, price: 12000000, status: 'available' },
          { id: 'u-2001', type: 'standard', floor: 20, beds: 3, baths: 3, sqm: 210, price: 6500000, status: 'available' },
        ],
      },
    ],
    paymentPlan: { downPayment: 30, construction: 40, handover: 30, completionYear: 2028 },
    amenities: ['private-beach', 'marina', 'gym', 'spa', 'concierge', 'helipad'],
    currency: 'QAR',
  },

  artar: {
    id: 'artar',
    developer: { en: 'ARTAR Real Estate Development', ar: 'أرتار للتطوير العقاري' },
    project: { en: 'ARTAR Meydan', ar: 'أرتار ميدان' },
    tagline: { en: 'Precision Crafted Residences.', ar: 'مساكن صُنعت بدقة متناهية.' },
    location: { en: 'Mohammed Bin Rashid City, Dubai', ar: 'مدينة محمد بن راشد، دبي' },
    colors: { primary: '#0d2137', accent: '#c8a45c' },
    towers: [
      {
        id: 'meydan', name: { en: 'Meydan Tower', ar: 'برج ميدان' }, floors: 45,
        units: [
          { id: 'ph-1', type: 'penthouse', floor: 45, beds: 4, baths: 5, sqm: 400, price: 18000000, status: 'available' },
          { id: 'u-3501', type: 'premium', floor: 35, beds: 3, baths: 3, sqm: 240, price: 6800000, status: 'available' },
          { id: 'u-2001', type: 'standard', floor: 20, beds: 2, baths: 2, sqm: 140, price: 2800000, status: 'available' },
        ],
      },
    ],
    paymentPlan: { downPayment: 15, construction: 55, handover: 30, completionYear: 2027 },
    amenities: ['pool', 'gym', 'park', 'retail', 'concierge'],
    currency: 'AED',
  },
};

/* ── Helper to get a theme or fall back to Vista ── */
export function getTheme(developerId = 'vista') {
  return DEVELOPER_THEMES[developerId] || DEVELOPER_THEMES.vista;
}

/* ── Format currency for locale ── */
export function formatPrice(amount, currency = 'AED', lang = 'en') {
  const locale = lang === 'ar' ? 'ar-AE' : 'en-AE';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── Get all available themes ── */
export function listThemes() {
  return Object.entries(DEVELOPER_THEMES).map(([key, val]) => ({
    id: key,
    name: val.developer.en,
    market: val.location.en,
  }));
}

export default DEVELOPER_THEMES;

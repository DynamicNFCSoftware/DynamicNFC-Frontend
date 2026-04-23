// src/config/eventTaxonomy.js
// ═══════════════════════════════════════════════════════════════
// EVENT TAXONOMY — Unified event vocabulary across sectors
// ═══════════════════════════════════════════════════════════════

/**
 * Generic event categories that exist in ALL sectors.
 * The unified dashboard uses these generic keys internally.
 * Sector configs map them to specific event names.
 *
 * GENERIC KEY        → RE EVENT             → AUTO EVENT
 * ─────────────────────────────────────────────────────────
 * portalEntry        → portal_opened        → auto_portal_entry
 * itemView           → view_unit            → vehicle_view
 * itemDetail         → unit_detail_opened   → vehicle_detail_opened
 * pricingRequest     → request_pricing      → request_quote
 * brochureDownload   → download_brochure    → download_brochure
 * booking            → book_viewing         → test_drive_request
 * calculator         → roi_calculator       → finance_calculator
 * paymentPlan        → payment_plan_viewed  → lease_plan_viewed
 * contactAgent       → contact_agent        → contact_advisor
 * floorPlan          → view_floor_plan      → view_specs
 * comparison         → compare_units        → compare_vehicles
 * favorites          → add_favorite         → save_configuration
 */

// Activity feed descriptions (bilingual)
export const EVENT_DESCRIPTIONS = {
  portalEntry: {
    en: (name) => `${name} opened the portal`,
    ar: (name) => `${name} فتح البوابة`,
  },
  itemView: {
    en: (name, item) => `${name} viewed ${item}`,
    ar: (name, item) => `${name} شاهد ${item}`,
  },
  itemDetail: {
    en: (name, item) => `${name} opened details for ${item}`,
    ar: (name, item) => `${name} فتح تفاصيل ${item}`,
  },
  pricingRequest: {
    en: (name, item) => `${name} requested pricing for ${item}`,
    ar: (name, item) => `${name} طلب تسعير ${item}`,
  },
  brochureDownload: {
    en: (name) => `${name} downloaded brochure`,
    ar: (name) => `${name} حمّل الكتيب`,
  },
  booking: {
    en: (name, item) => `${name} booked a viewing for ${item}`,
    ar: (name, item) => `${name} حجز معاينة لـ ${item}`,
  },
  calculator: {
    en: (name) => `${name} used the calculator`,
    ar: (name) => `${name} استخدم الحاسبة`,
  },
  paymentPlan: {
    en: (name, item) => `${name} viewed payment plan for ${item}`,
    ar: (name, item) => `${name} شاهد خطة الدفع لـ ${item}`,
  },
  contactAgent: {
    en: (name) => `${name} requested agent contact`,
    ar: (name) => `${name} طلب التواصل مع المستشار`,
  },
  comparison: {
    en: (name) => `${name} compared items`,
    ar: (name) => `${name} قارن بين العناصر`,
  },
};

/**
 * Reverse-map a sector-specific event name to generic key
 * Used when reading raw events from Firestore/localStorage
 *
 * @param {string} eventName - Sector-specific event (e.g., 'vehicle_view')
 * @param {object} sectorConfig - From getSectorConfig()
 * @returns {string|null} generic key (e.g., 'itemView') or null if unknown
 */
export function reverseMapEvent(eventName, sectorConfig) {
  const entries = Object.entries(sectorConfig.events);
  for (const [genericKey, sectorEvent] of entries) {
    if (sectorEvent === eventName) return genericKey;
  }
  return null;
}

/**
 * Describe an event in human language
 *
 * @param {string} genericKey - Generic event key
 * @param {string} lang - 'en' or 'ar'
 * @param {string} personName - VIP name
 * @param {string} itemName - Unit/vehicle name (optional)
 * @returns {string} Human-readable description
 */
export function describeEvent(genericKey, lang, personName, itemName) {
  const desc = EVENT_DESCRIPTIONS[genericKey];
  if (!desc || !desc[lang]) return `${personName}: ${genericKey}`;
  return desc[lang](personName, itemName || '');
}

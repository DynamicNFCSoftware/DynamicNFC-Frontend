import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// ═══════════════════════════════════════════════════
// DynamicNFC — Behavioral Tracking Service v2
// Standardized event schema + session management
// ═══════════════════════════════════════════════════

let _session = null;

/**
 * EVENT CATEGORIES (funnel stages):
 * browse   → Passive viewing (portal entry, tower select, scroll)
 * engage   → Active interest (unit view, tab click, filter use)
 * intent   → Purchase signals (pricing request, ROI calc, brochure download)
 * action   → Commitment (booking, payment plan, contact advisor)
 */

export const EVENT_SCHEMA = {
  // BROWSE category
  portal_open:     { category: 'browse',  label: 'Opened portal',           funnelWeight: 0 },
  portal_exit:     { category: 'browse',  label: 'Left portal',             funnelWeight: 0 },
  tower_view:      { category: 'browse',  label: 'Viewed tower',            funnelWeight: 1 },
  section_view:    { category: 'browse',  label: 'Viewed section',          funnelWeight: 1 },
  scroll:          { category: 'browse',  label: 'Scrolled page',           funnelWeight: 0 },

  // ENGAGE category
  unit_view:       { category: 'engage',  label: 'Viewed unit',             funnelWeight: 3 },
  unit_compare:    { category: 'engage',  label: 'Compared units',          funnelWeight: 4 },
  unit_favorite:   { category: 'engage',  label: 'Favorited unit',          funnelWeight: 4 },
  filter_use:      { category: 'engage',  label: 'Used filter',             funnelWeight: 2 },
  tab_click:       { category: 'engage',  label: 'Clicked tab',             funnelWeight: 1 },
  gallery_view:    { category: 'engage',  label: 'Viewed gallery',          funnelWeight: 2 },
  floorplan_view:  { category: 'engage',  label: 'Viewed floor plan',       funnelWeight: 3 },

  // INTENT category
  pricing_request: { category: 'intent',  label: 'Requested pricing',       funnelWeight: 15 },
  brochure_download:{ category: 'intent', label: 'Downloaded brochure',     funnelWeight: 5 },
  floorplan_download:{ category: 'intent',label: 'Downloaded floor plan',   funnelWeight: 5 },
  roi_calculator:  { category: 'intent',  label: 'Used ROI calculator',     funnelWeight: 10 },
  payment_plan:    { category: 'intent',  label: 'Requested payment plan',  funnelWeight: 15 },

  // ACTION category
  book_viewing:    { category: 'action',  label: 'Booked viewing',          funnelWeight: 25 },
  contact_advisor: { category: 'action',  label: 'Contacted advisor',       funnelWeight: 20 },
  whatsapp_click:  { category: 'action',  label: 'Clicked WhatsApp',        funnelWeight: 15 },
  callback_request:{ category: 'action',  label: 'Requested callback',      funnelWeight: 20 },
};

/**
 * Initialize tracking session
 * Call once when portal loads
 */
export function initSession({ cardId, visitorType, visitorName, portalName }) {
  const sessionId = `ses_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

  _session = {
    id: sessionId,
    cardId: cardId || null,
    visitorType: visitorType || 'anonymous',
    visitorName: visitorName || null,
    portalName: portalName || 'unknown',
    startTime: Date.now(),
    deviceType: /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile'
      : /tablet/i.test(navigator.userAgent) ? 'tablet' : 'desktop',
    eventCount: 0,
    categories: { browse: 0, engage: 0, intent: 0, action: 0 },
  };

  // Track portal open
  track('portal_open', {
    referrer: document.referrer || 'direct',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });

  // Track exit on page leave
  const handleExit = () => {
    if (!_session) return;
    const duration = Math.round((Date.now() - _session.startTime) / 1000);
    track('portal_exit', {
      durationSeconds: duration,
      eventCount: _session.eventCount,
      categories: { ..._session.categories },
    });

    // Update session summary in Firestore
    if (_session.cardId) {
      updateSessionSummary(duration);
    }
    _session = null;
  };

  window.addEventListener('beforeunload', handleExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') handleExit();
  });

  return sessionId;
}

/**
 * Track an event — the ONLY function portals should call
 */
export function track(event, details = {}) {
  if (!_session) {
    console.warn('DynamicNFC tracking: no session. Call initSession() first.');
    return;
  }

  const schema = EVENT_SCHEMA[event];
  if (!schema) {
    console.warn(`DynamicNFC tracking: unknown event "${event}". Check EVENT_SCHEMA.`);
    return;
  }

  // Update session counters
  _session.eventCount++;
  _session.categories[schema.category]++;

  // Build standardized event document
  const eventDoc = {
    // Identity
    sessionId: _session.id,
    cardId: _session.cardId,
    visitorType: _session.visitorType,
    visitorName: _session.visitorName,

    // Event
    event: event,
    category: schema.category,
    label: schema.label,
    funnelWeight: schema.funnelWeight,

    // Details (event-specific)
    details: details,

    // Context
    portalName: _session.portalName,
    deviceType: _session.deviceType,
    url: window.location.pathname,
    timestamp: serverTimestamp(),

    // Session context
    secondsInSession: Math.round((Date.now() - _session.startTime) / 1000),
    eventNumberInSession: _session.eventCount,
  };

  // Write to Firestore (fire-and-forget)
  addDoc(collection(db, 'behaviors'), eventDoc).catch(err => {
    console.warn('Tracking write failed:', err.message);
  });
}

/**
 * Update session summary on smartcard document
 * Called on portal exit
 */
async function updateSessionSummary(durationSeconds) {
  if (!_session?.cardId) return;

  try {
    await updateDoc(doc(db, 'smartcards', _session.cardId), {
      lastActivity: serverTimestamp(),
      lastSessionDuration: durationSeconds,
      lastDeviceType: _session.deviceType,
      lastFunnelStage: _session.categories.action > 0 ? 'action'
        : _session.categories.intent > 0 ? 'intent'
        : _session.categories.engage > 0 ? 'engage'
        : 'browse',
      totalTaps: increment(0),
    });
  } catch (err) {
    // Silent fail
  }
}

/**
 * Mapping from OLD event names to NEW standardized events
 */
export const EVENT_MAP = {
  // Portal entry variants
  'vip_portal_entry':    { event: 'portal_open' },
  'portal_entry':        { event: 'portal_open' },
  'portal_opened':       { event: 'portal_open' },
  'auto_portal_entry':   { event: 'portal_open' },
  'marketplace_visit':   { event: 'portal_open' },
  'showroom_visit':      { event: 'portal_open' },

  // Browse
  'tower_selected':      { event: 'tower_view',      mapDetails: (d) => ({ towerName: d.tower_name || d.towerName }) },
  'collection_view':     { event: 'section_view',     mapDetails: (d) => ({ section: d.collection }) },
  'language_switch':     { event: 'section_view',     mapDetails: (d) => ({ section: 'language_switch', language: d.to }) },
  'cta_explore':         { event: 'section_view',     mapDetails: () => ({ section: 'explore_cta' }) },
  'cta_booking':         { event: 'section_view',     mapDetails: () => ({ section: 'booking_cta' }) },
  'cta_browse':          { event: 'section_view',     mapDetails: () => ({ section: 'browse_cta' }) },

  // Engage — unit interactions
  'unit_view':           { event: 'unit_view',        mapDetails: (d) => ({ unitId: d.unit_id || d.unitId, unitName: d.unit_name || d.unitName }) },
  'view_unit':           { event: 'unit_view',        mapDetails: (d) => ({ unitId: d.unitId, unitName: d.unitName }) },
  'vehicle_view':        { event: 'unit_view',        mapDetails: (d) => ({ unitId: d.vehicleId, unitName: d.name }) },
  'view_vehicle':        { event: 'unit_view',        mapDetails: (d) => ({ unitId: d.vehicleId, unitName: d.vehicleName }) },

  'favorite_add':        { event: 'unit_favorite',    mapDetails: (d) => ({ unitId: d.unit_id || d.unitId || d.vehicleId, action: 'add' }) },
  'favorite_remove':     { event: 'unit_favorite',    mapDetails: (d) => ({ unitId: d.unit_id || d.unitId || d.vehicleId, action: 'remove' }) },
  'favorite_toggle':     { event: 'unit_favorite',    mapDetails: (d) => ({ unitId: d.vehicleId, action: d.action }) },

  'comparison_view':     { event: 'unit_compare',     mapDetails: (d) => ({ units: d.units, unitId: d.unitId }) },
  'comparison_add':      { event: 'unit_compare',     mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'compare_add':         { event: 'unit_compare',     mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'compare_remove':      { event: 'unit_compare',     mapDetails: (d) => ({ unitId: d.vehicleId, action: 'remove' }) },

  'bedroom_filter':      { event: 'filter_use',       mapDetails: (d) => ({ filterType: 'bedroom', value: d.bedrooms }) },
  'category_filter':     { event: 'filter_use',       mapDetails: (d) => ({ filterType: 'category', value: d.category }) },
  'filter_units':        { event: 'filter_use',       mapDetails: (d) => ({ filterType: 'category', value: d.filter }) },
  'filter_vehicles':     { event: 'filter_use',       mapDetails: (d) => ({ filterType: 'category', value: d.filter }) },

  'tab_click':           { event: 'tab_click',        mapDetails: (d) => ({ tabName: d.tab_name || d.tabName }) },
  'view_floorplan':      { event: 'floorplan_view',   mapDetails: (d) => ({ unitId: d.unitId }) },

  // Intent — direct event names from portals
  'request_pricing':     { event: 'pricing_request',  mapDetails: (d) => ({ unitId: d.unitId || d.vehicleId }) },
  'pricing_request_evt': { event: 'pricing_request',  mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'download_brochure':   { event: 'brochure_download', mapDetails: (d) => ({ unitId: d.unitId || d.vehicleId }) },
  'brochure_download_evt':{ event: 'brochure_download', mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'explore_payment_plan':{ event: 'payment_plan',     mapDetails: (d) => ({ unitId: d.unitId }) },
  'roi_calculator_click':{ event: 'roi_calculator' },

  // Action — direct event names
  'book_viewing':        { event: 'book_viewing',     mapDetails: (d) => ({ unitId: d.unitId, name: d.name }) },
  'book_test_drive':     { event: 'book_viewing',     mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'test_drive_request':  { event: 'book_viewing',     mapDetails: (d) => ({ unitId: d.vehicleId, name: d.name }) },
  'contact_advisor':     { event: 'contact_advisor',  mapDetails: (d) => ({ visitorName: d.vipName }) },
  'quote_request':       { event: 'pricing_request',  mapDetails: (d) => ({ unitId: d.vehicleId }) },
  'config_save':         { event: 'section_view',     mapDetails: (d) => ({ section: 'config_save', ...d }) },
  'finance_calc':        { event: 'section_view',     mapDetails: (d) => ({ section: 'finance_calc', ...d }) },
  'color_select':        { event: 'section_view',     mapDetails: (d) => ({ section: 'color_select', ...d }) },
  'interior_select':     { event: 'section_view',     mapDetails: (d) => ({ section: 'interior_select', ...d }) },
  'lead_form_shown':     { event: 'section_view',     mapDetails: (d) => ({ section: 'lead_form', ...d }) },
  'lead_captured':       { event: 'section_view',     mapDetails: (d) => ({ section: 'lead_captured', ...d }) },

  // CTA clicks — map cta_name to specific events
  'cta_click': {
    event: null,
    mapCTA: {
      'request_pricing':      'pricing_request',
      'book_viewing':         'book_viewing',
      'book_family_viewing':  'book_viewing',
      'request_payment':      'payment_plan',
      'request_payment_plan': 'payment_plan',
      'download_brochure':    'brochure_download',
      'download_floorplan':   'floorplan_download',
      'download_plan':        'floorplan_download',
      'contact_advisor':      'contact_advisor',
      'roi_calculator':       'roi_calculator',
      'cta_explore':          'section_view',
      'test_drive':           'book_viewing',
      'view_floorplan':       'floorplan_view',
      'explore_payment_plan': 'payment_plan',
      'book_test_drive':      'book_viewing',
      'config_save':          'section_view',
      'quote_request':        'pricing_request',
    }
  },
};

/**
 * Bridge function — converts old trackEvent format to new track() format
 */
export function trackLegacy(oldEvent, oldData = {}) {
  const mapping = EVENT_MAP[oldEvent];
  if (!mapping) {
    // Unknown event — track as section_view with raw data
    track('section_view', { legacyEvent: oldEvent, ...oldData });
    return;
  }

  if (oldEvent === 'cta_click' && oldData.cta_name) {
    const newEvent = mapping.mapCTA[oldData.cta_name];
    if (newEvent) {
      track(newEvent, {
        unitId: oldData.unit_id || oldData.unitId,
        unitName: oldData.unit_name || oldData.unitName,
        vehicleId: oldData.vehicleId,
      });
    } else {
      track('section_view', { ctaName: oldData.cta_name, ...oldData });
    }
    return;
  }

  const newEvent = mapping.event;
  if (!newEvent) return;
  const details = mapping.mapDetails ? mapping.mapDetails(oldData) : oldData;
  track(newEvent, details);
}

/**
 * SCORING MODEL — calculate engagement score from behaviors
 */
export function calculateEngagementScore(events, config = null, scoreLabels = null) {
  const L = scoreLabels || {};
  if (!events || events.length === 0) {
    return { score: 0, label: L.new || "NEW", color: "#9ca3af", stage: "none" };
  }

  const c = config || {
    visitPoints: 5, minutePoints: 1, unitViewPoints: 3,
    pricingRequestPoints: 15, brochureDownloadPoints: 5, roiCalculatorPoints: 10,
    paymentPlanPoints: 15, bookViewingPoints: 25, contactAdvisorPoints: 20,
    hotThreshold: 80, warmThreshold: 50, interestedThreshold: 20,
  };

  let score = 0;

  // Unique sessions (max 25 points)
  const sessions = new Set(events.map(e => e.sessionId)).size;
  score += Math.min(sessions * (c.visitPoints || 5), 25);

  // Total time in portal (max 15 points)
  const exitEvents = events.filter(e => e.event === 'portal_exit');
  const totalSeconds = exitEvents.reduce((sum, e) => sum + (e.details?.durationSeconds || e.data?.durationSeconds || 0), 0);
  score += Math.min(Math.floor(totalSeconds / 60) * (c.minutePoints || 1), 15);

  // Unique units viewed (max 15 points)
  const unitsViewed = new Set(
    events.filter(e => e.event === 'unit_view').map(e => (e.details?.unitId || e.data?.unitId)).filter(Boolean)
  ).size;
  score += Math.min(unitsViewed * (c.unitViewPoints || 3), 15);

  // Intent signals
  const hasPricing = events.some(e => e.event === 'pricing_request');
  const hasBrochure = events.some(e => e.event === 'brochure_download' || e.event === 'floorplan_download');
  const hasROI = events.some(e => e.event === 'roi_calculator');
  const hasPaymentPlan = events.some(e => e.event === 'payment_plan');

  if (hasPricing) score += (c.pricingRequestPoints || 15);
  if (hasBrochure) score += (c.brochureDownloadPoints || 5);
  if (hasROI) score += (c.roiCalculatorPoints || 10);
  if (hasPaymentPlan) score += (c.paymentPlanPoints || 15);

  // Action signals
  const hasBooking = events.some(e => e.event === 'book_viewing');
  const hasContact = events.some(e => e.event === 'contact_advisor' || e.event === 'whatsapp_click');

  if (hasBooking) score += (c.bookViewingPoints || 25);
  if (hasContact) score += (c.contactAdvisorPoints || 20);

  // Cap at 100
  score = Math.min(score, 100);

  // Determine funnel stage (highest reached)
  const hasAction = events.some(e => e.category === 'action');
  const hasIntent = events.some(e => e.category === 'intent');
  const hasEngage = events.some(e => e.category === 'engage');

  const hotT = c.hotThreshold || 80;
  const warmT = c.warmThreshold || 50;
  const intT = c.interestedThreshold || 20;

  let stage, label, color;
  if (score >= hotT || hasAction) {
    stage = "action"; label = L.hot || "HOT LEAD"; color = "#dc2626";
  } else if (score >= warmT || hasIntent) {
    stage = "intent"; label = L.warm || "WARM"; color = "#f59e0b";
  } else if (score >= intT || hasEngage) {
    stage = "engage"; label = L.interested || "INTERESTED"; color = "#0176d3";
  } else {
    stage = "browse"; label = L.new || "NEW"; color = "#9ca3af";
  }

  return { score, label, color, stage };
}

/** Maps standardized event keys to admin i18n keys (see admin.js). */
export const EVENT_I18N_KEY = {
  portal_open: "evtOpenedPortal",
  portal_exit: "evtLeftPortal",
  tower_view: "evtViewedTower",
  section_view: "evtViewedSection",
  scroll: "evtScrolledPage",
  unit_view: "evtViewedUnit",
  unit_compare: "evtComparedUnits",
  unit_favorite: "evtFavoritedUnit",
  filter_use: "evtUsedFilter",
  tab_click: "evtClickedTab",
  gallery_view: "evtViewedGallery",
  floorplan_view: "evtViewedFloorPlanSchema",
  pricing_request: "evtRequestedPricing",
  brochure_download: "evtDownloadedBrochure",
  floorplan_download: "evtDownloadedFloorPlan",
  roi_calculator: "evtRoiCalculator",
  payment_plan: "evtRequestedPaymentPlan",
  book_viewing: "evtBookedViewing",
  contact_advisor: "evtContactedAdvisor",
  whatsapp_click: "evtWhatsappClick",
  callback_request: "evtCallbackRequest",
};

/**
 * Generate human-readable event description for timeline.
 * @param {object} event — behavior doc
 * @param {function} [t] — optional `useTranslation('admin')` fn for UI language
 */
export function describeEvent(event, t) {
  const schema = EVENT_SCHEMA[event.event];
  const i18nKey = EVENT_I18N_KEY[event.event];
  let desc;
  if (typeof t === "function" && i18nKey) {
    const tr = t(i18nKey);
    desc = tr !== i18nKey ? tr : schema?.label || event.event;
  } else {
    desc = schema?.label || event.event;
  }

  const d = event.details || event.data || {};

  if (d.unitId) desc += ` \u2014 ${d.unitName || d.unitId}`;
  if (d.towerName) desc += ` \u2014 ${d.towerName}`;
  if (d.durationSeconds && typeof t === "function") {
    const tpl = t("evtSessionSeconds");
    desc += ` ${tpl.includes("{s}") ? tpl.replace("{s}", String(d.durationSeconds)) : `(${d.durationSeconds}s)`}`;
  } else if (d.durationSeconds) {
    desc += ` (${d.durationSeconds}s session)`;
  }
  if (d.filterType) desc += ` (${d.filterType}: ${d.value})`;
  if (d.tabName) desc += ` \u2014 ${d.tabName}`;
  if (d.section) desc += ` \u2014 ${d.section}`;

  return desc;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category) {
  const icons = {
    browse: '\u{1F441}\u{FE0F}',
    engage: '\u{1F50D}',
    intent: '\u{1F3AF}',
    action: '\u{1F525}',
  };
  return icons[category] || '\u{1F4CB}';
}

/**
 * Get category color
 */
export function getCategoryColor(category) {
  const colors = {
    browse: '#9ca3af',
    engage: '#0176d3',
    intent: '#f59e0b',
    action: '#dc2626',
  };
  return colors[category] || '#9ca3af';
}

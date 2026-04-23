/* ═══════════════════════════════════════════════════════════════
   useTracking.js — Event Model (Playbook §4.1)
   
   Every interaction fires a structured event.
   In production: POST to /api/tracking/collect
   In demo: stores locally + broadcasts via BroadcastChannel
   so the Dashboard tab picks it up in real time.
   ═══════════════════════════════════════════════════════════════ */

import { useCallback, useRef } from 'react';

/* ── Event weight map (Playbook §4.2) ── */
const SCORE_WEIGHTS = {
  vip_token_present: 30,
  booking_click:     40,
  mortgage_use:      25,
  price_view:        20,
  roi_calculator:    20,
  unit_view:         10,
  payment_plan_view: 10,
  brochure_download: 10,
  page_view:          5,
  amenity_view:       5,
  comparison_open:    5,
};

/* ── BroadcastChannel for cross-tab Dashboard sync ── */
let channel = null;
try {
  channel = new BroadcastChannel('dynamicnfc-tracking');
} catch (_) {
  /* SSR or unsupported browser */
}

/* ── In-memory event log (accessible by Dashboard) ── */
const eventLog = [];
const scoreMap = {};  // identity -> cumulative score

function getScore(identity) {
  return scoreMap[identity] || 0;
}

function addScore(identity, eventType) {
  const weight = SCORE_WEIGHTS[eventType] || 0;
  scoreMap[identity] = (scoreMap[identity] || 0) + weight;
  return scoreMap[identity];
}

export function getEventLog() { return [...eventLog]; }
export function getScoreMap() { return { ...scoreMap }; }
export { SCORE_WEIGHTS };

/* ═══════════════════════════════════════════
   Hook: useTracking(site, identity, ref)
   ═══════════════════════════════════════════ */
export default function useTracking({ site = 'vip', identity = 'vip-jane-doe', ref = 'nfc' } = {}) {
  const sessionStart = useRef(Date.now());

  const track = useCallback((eventType, path = '/', metadata = {}) => {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      site,
      event: eventType,
      path,
      ref,
      identity,
      metadata,
      score: SCORE_WEIGHTS[eventType] || 0,
      cumulativeScore: addScore(identity, eventType),
      sessionDuration: Math.round((Date.now() - sessionStart.current) / 1000),
    };

    /* Store locally */
    eventLog.push(event);

    /* Broadcast to Dashboard tab */
    if (channel) {
      try { channel.postMessage(event); } catch (_) {}
    }

    /* Console in dev */
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`[Track] ${eventType} | Score: ${event.cumulativeScore}`, event);
    }

    /* In production, this would POST to the backend:
    fetch('/api/tracking/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }); */

    return event;
  }, [site, identity, ref]);

  /* ── Convenience methods ── */
  const trackPageView = useCallback((path) => track('page_view', path), [track]);
  const trackUnitView = useCallback((unitId, path) => track('unit_view', path, { unitId }), [track]);
  const trackPriceView = useCallback((unitId, price) => track('price_view', '/pricing', { unitId, price }), [track]);
  const trackMortgageUse = useCallback((unitId, amount) => track('mortgage_use', '/mortgage-calc', { unitId, amount }), [track]);
  const trackROICalculator = useCallback((unitId) => track('roi_calculator', '/roi-calc', { unitId }), [track]);
  const trackBookingClick = useCallback((unitId) => track('booking_click', '/booking', { unitId }), [track]);
  const trackPaymentPlanView = useCallback(() => track('payment_plan_view', '/payment-plan'), [track]);
  const trackBrochureDownload = useCallback(() => track('brochure_download', '/brochure'), [track]);
  const trackAmenityView = useCallback((amenity) => track('amenity_view', '/amenities', { amenity }), [track]);

  return {
    track,
    trackPageView,
    trackUnitView,
    trackPriceView,
    trackMortgageUse,
    trackROICalculator,
    trackBookingClick,
    trackPaymentPlanView,
    trackBrochureDownload,
    trackAmenityView,
    getScore: () => getScore(identity),
  };
}

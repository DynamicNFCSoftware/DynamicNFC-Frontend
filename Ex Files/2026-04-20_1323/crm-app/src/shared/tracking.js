// tracking.js
// Shared event tracking service for Al Noor Residences CRM Demo.
// Portals write events → Dashboard reads them via localStorage polling.

const STORAGE_KEY = 'dnfc_events';

export function getEvents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export function track(evt, data = {}, visitor = {}) {
  try {
    const events = getEvents();
    events.push({
      ts: Date.now(),
      evt,
      d: data,
      v: visitor.name || null,
      tp: visitor.type || 'anonymous',
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) { console.warn('Tracking error:', e); }
}

export function clearEvents() { localStorage.removeItem(STORAGE_KEY); }

export function getLiveCounts() {
  const events = getEvents();
  let vip = 0, registered = 0, anonymous = 0;
  const seen = new Set();
  events.forEach(e => {
    const key = (e.v || 'anon') + '_' + e.tp;
    if (!seen.has(key)) {
      seen.add(key);
      if (e.tp === 'vip') vip++;
      else if (e.tp === 'registered') registered++;
      else anonymous++;
    }
  });
  return { vip, registered, anonymous, total: vip + registered + anonymous };
}

export function getActionCounts() {
  const events = getEvents();
  const actions = {
    book_viewing: { v: 0, s: 0 },
    request_pricing: { v: 0, s: 0 },
    request_payment_plan: { v: 0, s: 0 },
    download_brochure: { v: 0, s: 0 },
  };
  events.forEach(e => {
    if (e.evt === 'cta_click' && e.d?.cta_name) {
      const norm = e.d.cta_name === 'request_payment' ? 'request_payment_plan'
        : ['download_floorplan','download_plan'].includes(e.d.cta_name) ? 'download_brochure'
        : e.d.cta_name === 'book_family_viewing' ? 'book_viewing'
        : e.d.cta_name;
      if (actions[norm]) {
        if (e.tp === 'vip') actions[norm].v++;
        else actions[norm].s++;
      }
    }
  });
  return actions;
}

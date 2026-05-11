// Threshold tunables for the Sales Trigger Panel.
// Hoist to tenant-editable `tenants/{uid}/settings/triggerThresholds` in a future sprint.
export const THRESHOLDS = {
  REPEAT_VIEW_WINDOW_MS: 15 * 60 * 1000,
  REPEAT_VIEW_MIN_EVENTS: 3,
  RE_ENGAGE_IDLE_MIN_MS: 24 * 60 * 60 * 1000,
  RE_ENGAGE_RECENT_MAX_MS: 60 * 60 * 1000,
  HIGH_VALUE_DEAL_VALUE_MIN: 5_000_000,
  HIGH_VALUE_DEAL_IDLE_MS: 48 * 60 * 60 * 1000,
  MULTIPLE_VIPS_WINDOW_MS: 48 * 60 * 60 * 1000,
  MULTIPLE_VIPS_MIN_DISTINCT: 2,
};

const PRICING_KEYS = new Set(["pricing_request", "request_pricing", "request_quote", "quote_request"]);
const BROCHURE_KEYS = new Set(["brochure_download", "download_brochure"]);
const BOOKING_KEYS = new Set(["book_viewing", "test_drive_request", "boarding_request"]);
const CONTACT_KEYS = new Set(["contact_advisor", "contact_agent", "whatsapp_click", "callback_request"]);
const UNIT_VIEW_KEYS = new Set(["unit_view", "view_unit", "vehicle_view", "unit_detail_opened", "yacht_view"]);
const ROI_KEYS = new Set(["roi_calculator", "roi_completed", "roi_calculator_used", "roi_calculator_click"]);

function eventTypeOf(e) {
  return String(e.type || e.event || e.rawEvent || "").toLowerCase();
}

function tsOf(e) {
  const v = e.timestamp || e.createdAt || e.ts;
  if (typeof v === "number") return v;
  if (v && typeof v.toMillis === "function") return v.toMillis();
  const n = new Date(v).getTime();
  return Number.isFinite(n) ? n : 0;
}

function enrich(events, vips) {
  const vipById = new Map((vips || []).map((v) => [v.id, v]));
  const vipByName = new Map(
    (vips || [])
      .filter((v) => v?.name)
      .map((v) => [String(v.name).toLowerCase().trim(), v])
  );
  return (events || [])
    .map((e) => {
      // Match by vipId first; fall back to vipName (seed events carry only vipName).
      const vipFromId = e.vipId ? vipById.get(e.vipId) : null;
      const vipFromName =
        !vipFromId && e.vipName
          ? vipByName.get(String(e.vipName).toLowerCase().trim())
          : null;
      const vip = vipFromId || vipFromName;
      if (!vip) return null;
      return {
        ...e,
        vipId: e.vipId || vip.id, // Ensure downstream rules can group by vip.id consistently
        _ts: tsOf(e),
        _type: eventTypeOf(e),
        _vip: vip,
      };
    })
    .filter(Boolean);
}

function groupByVip(enrichedEvents) {
  const m = new Map();
  enrichedEvents.forEach((e) => {
    const list = m.get(e.vipId) || [];
    list.push(e);
    m.set(e.vipId, list);
  });
  m.forEach((list) => list.sort((a, b) => a._ts - b._ts));
  return m;
}

function detectRepeatView(events) {
  const groups = new Map();
  events.forEach((e) => {
    if (!UNIT_VIEW_KEYS.has(e._type)) return;
    const item = e.item || e.metadata?.unitId || e.metadata?.vehicleId || "_";
    const key = `${e.vipId}|${item}`;
    const list = groups.get(key) || [];
    list.push(e);
    groups.set(key, list);
  });

  const out = [];
  groups.forEach((list, key) => {
    const sorted = list.slice().sort((a, b) => a._ts - b._ts);
    let best = null;
    for (let i = 0; i < sorted.length; i += 1) {
      let count = 1;
      for (let j = i + 1; j < sorted.length; j += 1) {
        if (sorted[j]._ts - sorted[i]._ts <= THRESHOLDS.REPEAT_VIEW_WINDOW_MS) count += 1;
        else break;
      }
      if (count >= THRESHOLDS.REPEAT_VIEW_MIN_EVENTS && (!best || count > best.count)) {
        best = { count, last: sorted[Math.min(i + count - 1, sorted.length - 1)] };
      }
    }
    if (best) {
      const [vipId, item] = key.split("|");
      out.push({
        id: `REPEAT_VIEW:${vipId}:${item}`,
        ruleType: "REPEAT_VIEW",
        urgency: "hot",
        vipId,
        vipName: best.last._vip?.name || vipId,
        score: best.last._vip?.score ?? null,
        signalKey: "stpSignalRepeatView",
        signalArgs: { item: item === "_" ? null : item, count: best.count },
        lastEventAt: best.last._ts,
      });
    }
  });
  return out;
}

function detectHighIntent(events) {
  const byVip = new Map();
  events.forEach((e) => {
    if (ROI_KEYS.has(e._type)) return;
    let signalKey = null;
    if (PRICING_KEYS.has(e._type)) signalKey = "stpSignalPricing";
    else if (BROCHURE_KEYS.has(e._type)) signalKey = "stpSignalBrochure";
    else if (BOOKING_KEYS.has(e._type)) signalKey = "stpSignalBooking";
    if (!signalKey) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, { ...e, signalKey });
  });
  return Array.from(byVip.values()).map((e) => ({
    id: `HIGH_INTENT:${e.vipId}:${e.signalKey}`,
    ruleType: "HIGH_INTENT",
    urgency: "hot",
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: e.signalKey,
    signalArgs: { item: e.item || null },
    lastEventAt: e._ts,
  }));
}

function detectReEngage(events, now) {
  const byVip = new Map();
  events.forEach((e) => {
    const list = byVip.get(e.vipId) || [];
    list.push(e);
    byVip.set(e.vipId, list);
  });

  const out = [];
  byVip.forEach((list, vipId) => {
    const sorted = list.slice().sort((a, b) => a._ts - b._ts);
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    if (!prev) return;
    if (now - last._ts > THRESHOLDS.RE_ENGAGE_RECENT_MAX_MS) return;
    if (last._ts - prev._ts < THRESHOLDS.RE_ENGAGE_IDLE_MIN_MS) return;
    out.push({
      id: `RE_ENGAGE:${vipId}`,
      ruleType: "RE_ENGAGE",
      urgency: "warm",
      vipId,
      vipName: last._vip?.name || vipId,
      score: last._vip?.score ?? null,
      signalKey: "stpSignalReEngage",
      signalArgs: { hours: Math.round((last._ts - prev._ts) / (60 * 60 * 1000)) },
      lastEventAt: last._ts,
    });
  });
  return out;
}

function detectContactAgent(events) {
  const byVip = new Map();
  events.forEach((e) => {
    if (!CONTACT_KEYS.has(e._type)) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, e);
  });
  return Array.from(byVip.values()).map((e) => ({
    id: `CONTACT_AGENT:${e.vipId}`,
    ruleType: "CONTACT_AGENT",
    urgency: "hot",
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: "stpSignalContact",
    signalArgs: {},
    lastEventAt: e._ts,
  }));
}

function detectRoiCompleted(events) {
  const byVip = new Map();
  events.forEach((e) => {
    if (!ROI_KEYS.has(e._type)) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, e);
  });
  return Array.from(byVip.values()).map((e) => ({
    id: `ROI_COMPLETED:${e.vipId}`,
    ruleType: "ROI_COMPLETED",
    urgency: "hot",
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: "stpSignalRoiCompleted",
    signalArgs: {},
    lastEventAt: e._ts,
  }));
}

function detectIdleDeals(deals, eventsByVip, vipById, now) {
  const out = [];
  (deals || []).forEach((deal) => {
    const value = Number(deal.value || 0);
    if (value < THRESHOLDS.HIGH_VALUE_DEAL_VALUE_MIN) return;
    const stage = String(deal.stage || "").toLowerCase();
    if (stage === "closed" || stage === "closed_won" || stage === "closed_lost") return;

    const vipId = deal.vipId || deal.assignedVipId || deal.leadVipId;
    if (!vipId) return;

    const vipEvents = eventsByVip.get(vipId) || [];
    const lastEvent = vipEvents[vipEvents.length - 1];
    const lastTs = lastEvent?._ts || tsOf(deal);
    if (!lastTs) return;
    if (now - lastTs < THRESHOLDS.HIGH_VALUE_DEAL_IDLE_MS) return;

    const vip = vipById.get(vipId);
    out.push({
      id: `HIGH_VALUE_DEAL_IDLE:${vipId}:${deal.id}`,
      ruleType: "HIGH_VALUE_DEAL_IDLE",
      urgency: "warm",
      vipId,
      vipName: vip?.name || deal.leadName || vipId,
      score: vip?.score ?? null,
      signalKey: "stpSignalIdleDeal",
      signalArgs: { value, item: deal.item || deal.name || null },
      lastEventAt: lastTs,
    });
  });
  return out;
}

function detectCompeting(events, now) {
  const byItem = new Map();
  events.forEach((e) => {
    if (!UNIT_VIEW_KEYS.has(e._type)) return;
    if (now - e._ts > THRESHOLDS.MULTIPLE_VIPS_WINDOW_MS) return;
    const item = e.item || e.metadata?.unitId || e.metadata?.vehicleId;
    if (!item) return;
    const vipMap = byItem.get(item) || new Map();
    const existing = vipMap.get(e.vipId);
    if (!existing || existing._ts < e._ts) vipMap.set(e.vipId, e);
    byItem.set(item, vipMap);
  });

  const out = [];
  byItem.forEach((vipMap, item) => {
    if (vipMap.size < THRESHOLDS.MULTIPLE_VIPS_MIN_DISTINCT) return;
    vipMap.forEach((e, vipId) => {
      out.push({
        id: `MULTIPLE_VIPS_SAME_ITEM:${vipId}:${item}`,
        ruleType: "MULTIPLE_VIPS_SAME_ITEM",
        urgency: "warm",
        vipId,
        vipName: e._vip?.name || vipId,
        score: e._vip?.score ?? null,
        signalKey: "stpSignalCompeting",
        signalArgs: { item, competitorCount: vipMap.size - 1 },
        lastEventAt: e._ts,
      });
    });
  });
  return out;
}

export function detectTriggers(events, vips, deals, options = {}) {
  const { now = Date.now() } = options;
  // useDashboard already filters events/vips/deals by active region+sector via
  // filterBySectorAndRegion in useDashboardData. We trust internal code per
  // CLAUDE.md §11 and do NOT re-filter here — those defensive filters falsely
  // rejected all rows because the returned objects don't carry region/sector fields.

  const eventsArr = events || [];
  const vipsArr = vips || [];
  const dealsArr = deals || [];

  const enriched = enrich(eventsArr, vipsArr);
  const eventsByVip = groupByVip(enriched);
  const vipById = new Map(vipsArr.map((v) => [v.id, v]));

  const all = [
    ...detectRepeatView(enriched),
    ...detectHighIntent(enriched),
    ...detectReEngage(enriched, now),
    ...detectContactAgent(enriched),
    ...detectRoiCompleted(enriched),
    ...detectIdleDeals(dealsArr, eventsByVip, vipById, now),
    ...detectCompeting(enriched, now),
  ];

  // Dedupe to ONE row per VIP — pick strongest signal (HOT beats WARM, then most recent).
  const tierRank = (u) => (u === "hot" ? 0 : 1);
  const seen = new Map();
  all.forEach((t) => {
    const existing = seen.get(t.vipId);
    if (!existing) {
      seen.set(t.vipId, t);
      return;
    }
    const newRank = tierRank(t.urgency);
    const oldRank = tierRank(existing.urgency);
    if (newRank < oldRank) {
      seen.set(t.vipId, t);
    } else if (newRank === oldRank && t.lastEventAt > existing.lastEventAt) {
      seen.set(t.vipId, t);
    }
  });

  const buckets = { hot: [], warm: [] };
  Array.from(seen.values()).forEach((t) => buckets[t.urgency]?.push(t));
  buckets.hot.sort((a, b) => b.lastEventAt - a.lastEventAt);
  buckets.warm.sort((a, b) => b.lastEventAt - a.lastEventAt);

  return {
    hot: buckets.hot.slice(0, 5),
    warm: buckets.warm.slice(0, 3),
  };
}

"use strict";

const MIN_SAMPLES = 3;

function toMillis(value) {
  if (!value) return NaN;
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value?.toMillis === "function") return value.toMillis();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : NaN;
}

function eventType(row) {
  return String(row?.event || row?.type || row?.action || "").toLowerCase();
}

function actorId(row) {
  return String(
    row?.vipId ||
      row?.userId ||
      row?.vipName ||
      row?.userName ||
      row?.leadName ||
      row?.sessionId ||
      row?.cardId ||
      row?.id ||
      ""
  )
    .trim()
    .toLowerCase();
}

function average(values) {
  if (!values.length) return NaN;
  return values.reduce((sum, item) => sum + item, 0) / values.length;
}

function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function thresholdLowerBetter(value, greenMax, yellowMax) {
  if (value <= greenMax) return "green";
  if (value <= yellowMax) return "yellow";
  return "red";
}

function thresholdHigherBetter(value, greenMin, yellowMin) {
  if (value >= greenMin) return "green";
  if (value >= yellowMin) return "yellow";
  return "red";
}

function emptyMetric() {
  return { value: null, unit: "\u2014", threshold: "gray" };
}

function metric(value, unit, thresholdFn) {
  if (!Number.isFinite(value)) return emptyMetric();
  return { value: round(value), unit, threshold: thresholdFn(value) };
}

function mapByActor(items) {
  return items.reduce((acc, row) => {
    const key = actorId(row);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

function collectTapToActionSamples(taps, behaviors) {
  const behaviorsByActor = mapByActor(behaviors);
  return taps.reduce((samples, tap) => {
    const key = actorId(tap);
    const tapMs = toMillis(tap.timestamp);
    if (!key || !Number.isFinite(tapMs)) return samples;
    const next = (behaviorsByActor[key] || [])
      .map((row) => toMillis(row.timestamp))
      .filter((ms) => Number.isFinite(ms) && ms >= tapMs)
      .sort((a, b) => a - b)[0];
    if (Number.isFinite(next)) samples.push((next - tapMs) / (60 * 60 * 1000));
    return samples;
  }, []);
}

function collectTapToBookingSamples(taps, events) {
  const bookingTypes = new Set(["book_viewing", "booking_request", "test_drive_request", "book_test_drive"]);
  const eventsByActor = mapByActor(events);
  return taps.reduce((samples, tap) => {
    const key = actorId(tap);
    const tapMs = toMillis(tap.timestamp);
    if (!key || !Number.isFinite(tapMs)) return samples;
    const next = (eventsByActor[key] || [])
      .filter((row) => bookingTypes.has(eventType(row)))
      .map((row) => toMillis(row.timestamp))
      .filter((ms) => Number.isFinite(ms) && ms >= tapMs)
      .sort((a, b) => a - b)[0];
    if (Number.isFinite(next)) samples.push((next - tapMs) / (24 * 60 * 60 * 1000));
    return samples;
  }, []);
}

function collectReengagementSamples(taps) {
  const byActor = mapByActor(taps);
  const samples = [];
  Object.values(byActor).forEach((rows) => {
    const sorted = rows.map((row) => toMillis(row.timestamp)).filter(Number.isFinite).sort((a, b) => a - b);
    for (let idx = 1; idx < sorted.length; idx += 1) {
      samples.push((sorted[idx] - sorted[idx - 1]) / (24 * 60 * 60 * 1000));
    }
  });
  return samples;
}

function secondTapRate(taps) {
  const byActor = mapByActor(taps);
  const actors = Object.keys(byActor);
  if (actors.length < MIN_SAMPLES) return emptyMetric();
  const returning = actors.filter((key) => byActor[key].length >= 2).length;
  const rate = (returning / actors.length) * 100;
  return metric(rate, "%", (value) => thresholdHigherBetter(value, 50, 25));
}

function leadCaptureRate(taps, behaviors, events) {
  const anonymous = [...taps, ...events].filter((row) => {
    const portal = String(row.portalType || "").toLowerCase();
    return portal === "anonymous";
  });
  if (anonymous.length < MIN_SAMPLES) return emptyMetric();
  const identified = behaviors.filter((row) => {
    const name = row.vipName || row.userName || row.leadName;
    return Boolean(name);
  }).length;
  const rate = (identified / anonymous.length) * 100;
  return metric(rate, "%", (value) => thresholdHigherBetter(value, 30, 15));
}

function vipToBookedRate(events) {
  const vipActors = new Set();
  const bookedActors = new Set();
  const bookingTypes = new Set(["book_viewing", "booking_request", "test_drive_request", "book_test_drive"]);
  events.forEach((row) => {
    const key = actorId(row);
    const portal = String(row.portalType || "").toLowerCase();
    if (!key || portal !== "vip") return;
    vipActors.add(key);
    if (bookingTypes.has(eventType(row))) bookedActors.add(key);
  });
  if (vipActors.size < MIN_SAMPLES) return emptyMetric();
  const rate = (bookedActors.size / vipActors.size) * 100;
  return metric(rate, "%", (value) => thresholdHigherBetter(value, 20, 10));
}

function decisionWindow(deals) {
  const samples = deals
    .map((deal) => {
      const created = toMillis(deal.createdAt || deal.created_at || deal.timestamp);
      const updated = toMillis(deal.updatedAt || deal.lastSeen || deal.closedAt || deal.expectedCloseAt);
      if (!Number.isFinite(created) || !Number.isFinite(updated) || updated < created) return NaN;
      return (updated - created) / (24 * 60 * 60 * 1000);
    })
    .filter(Number.isFinite);
  if (samples.length < MIN_SAMPLES) return emptyMetric();
  return metric(average(samples), "d", (value) => thresholdLowerBetter(value, 14, 30));
}

function repResponse(events) {
  const alertTypes = new Set(["hot_alert", "priority_alert", "request_pricing", "request_quote", "book_viewing", "test_drive_request"]);
  const responseTypes = new Set(["rep_contact", "contact_agent", "contact_advisor", "call_scheduled", "follow_up"]);
  const byActor = mapByActor(events);
  const samples = [];
  Object.values(byActor).forEach((rows) => {
    const sorted = rows
      .map((row) => ({ type: eventType(row), ms: toMillis(row.timestamp) }))
      .filter((row) => Number.isFinite(row.ms))
      .sort((a, b) => a.ms - b.ms);
    sorted.forEach((row, idx) => {
      if (!alertTypes.has(row.type)) return;
      const response = sorted.slice(idx + 1).find((next) => responseTypes.has(next.type) && next.ms >= row.ms);
      if (response) samples.push((response.ms - row.ms) / (60 * 1000));
    });
  });
  if (samples.length < MIN_SAMPLES) return emptyMetric();
  return metric(average(samples), "m", (value) => thresholdLowerBetter(value, 60, 240));
}

function computeVelocityMetrics({ taps = [], behaviors = [], deals = [], events = [], windowDays = 30 }) {
  const ttfaSamples = collectTapToActionSamples(taps, behaviors);
  const viewingSamples = collectTapToBookingSamples(taps, events);
  const reengagementSamples = collectReengagementSamples(taps);

  const ttfa =
    ttfaSamples.length < MIN_SAMPLES
      ? emptyMetric()
      : metric(average(ttfaSamples), "h", (value) => thresholdLowerBetter(value, 4, 12));
  const viewingVelocity =
    viewingSamples.length < MIN_SAMPLES
      ? emptyMetric()
      : metric(average(viewingSamples), "d", (value) => thresholdLowerBetter(value, 5, 14));
  const reEngagement =
    reengagementSamples.length < MIN_SAMPLES
      ? emptyMetric()
      : metric(average(reengagementSamples), "d", (value) => thresholdLowerBetter(value, 7, 21));

  return {
    ttfa,
    viewingVelocity,
    reEngagement,
    secondTapRate: secondTapRate(taps),
    leadCapture: leadCaptureRate(taps, behaviors, events),
    vipToBooked: vipToBookedRate(events),
    decisionWindow: decisionWindow(deals),
    repResponse: repResponse(events),
    computedAt: Date.now(),
    windowDays,
  };
}

module.exports = { computeVelocityMetrics };
"use strict";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const MEANINGFUL_ACTIONS = new Set(["view_unit", "unit_view", "vehicle_view", "view_floorplan", "view_floor_plan", "book_viewing", "test_drive_request"]);
const BOOKING_ACTIONS = new Set(["book_viewing", "test_drive_request"]);
const QUALIFIED_STAGES = new Set(["contacted", "qualified", "viewing_scheduled", "test_drive", "quote_sent"]);
const NEGOTIATING_STAGES = new Set(["negotiation", "offer_sent", "financing", "reservation", "contract", "closed_won"]);
const ALERT_ACTIONS = new Set(["request_pricing", "pricing_request", "request_quote", "book_viewing", "test_drive_request"]);
const REP_ACTIONS = new Set(["contact_advisor", "contact_agent", "call_logged", "sms_sent", "email_sent"]);

function toMillis(value) {
  if (!value) return NaN;
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === "function") return value.toMillis();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : NaN;
}

function actorId(row = {}) {
  return row.vipId || row.vipName || row.leadName || row.assignedTo || row.userId || row.sessionId || row.cardId || "anon";
}

function eventType(row = {}) {
  return String(row.type || row.event || row.action || "").toLowerCase();
}

function normalizeThreshold(value, unit, threshold) {
  if (value === null) return { value: null, unit: "—", threshold: "gray" };
  return { value, unit, threshold };
}

function thresholdLowerBetter(value, greenMax, yellowMax) {
  if (value <= greenMax) return "green";
  if (value <= yellowMax) return "yellow";
  return "red";
}

function thresholdHigherBetter(value, greenMin, yellowMin) {
  if (value >= greenMin) return "green";
  if (value >= yellowMin) return "yellow";
  return "red";
}

function average(samples) {
  if (!samples.length) return null;
  return samples.reduce((acc, value) => acc + value, 0) / samples.length;
}

function withMinSamples(samples, formatter) {
  if (samples.length < 3) return null;
  return formatter(samples);
}

function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function collectTapToActionSamples(taps, behaviors) {
  const firstTapByActor = new Map();
  taps.forEach((tap) => {
    const ts = toMillis(tap.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(tap);
    const prev = firstTapByActor.get(id);
    if (!prev || ts < prev) firstTapByActor.set(id, ts);
  });

  const firstActionByActor = new Map();
  behaviors.forEach((behavior) => {
    if (!MEANINGFUL_ACTIONS.has(eventType(behavior))) return;
    const ts = toMillis(behavior.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(behavior);
    const prev = firstActionByActor.get(id);
    if (!prev || ts < prev) firstActionByActor.set(id, ts);
  });

  const samples = [];
  firstTapByActor.forEach((tapTs, id) => {
    const actionTs = firstActionByActor.get(id);
    if (!actionTs || actionTs < tapTs) return;
    samples.push(actionTs - tapTs);
  });
  return samples;
}

function collectTapToBookingSamples(taps, behaviors) {
  const firstTapByActor = new Map();
  taps.forEach((tap) => {
    const ts = toMillis(tap.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(tap);
    const prev = firstTapByActor.get(id);
    if (!prev || ts < prev) firstTapByActor.set(id, ts);
  });

  const firstBookingByActor = new Map();
  behaviors.forEach((behavior) => {
    if (!BOOKING_ACTIONS.has(eventType(behavior))) return;
    const ts = toMillis(behavior.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(behavior);
    const prev = firstBookingByActor.get(id);
    if (!prev || ts < prev) firstBookingByActor.set(id, ts);
  });

  const samples = [];
  firstTapByActor.forEach((tapTs, id) => {
    const bookingTs = firstBookingByActor.get(id);
    if (!bookingTs || bookingTs < tapTs) return;
    samples.push(bookingTs - tapTs);
  });
  return samples;
}

function groupTapsByActor(taps) {
  const map = new Map();
  taps.forEach((tap) => {
    const ts = toMillis(tap.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(tap);
    const rows = map.get(id) || [];
    rows.push(ts);
    map.set(id, rows);
  });
  map.forEach((rows, id) => map.set(id, rows.sort((a, b) => a - b)));
  return map;
}

function computeVelocityMetrics({ taps = [], behaviors = [], deals = [], events = [], windowDays = 30 }) {
  const windowStart = Date.now() - windowDays * DAY_MS;
  const filteredTaps = taps.filter((row) => toMillis(row.timestamp) >= windowStart);
  const filteredBehaviors = behaviors.filter((row) => toMillis(row.timestamp) >= windowStart);
  const filteredEvents = events.filter((row) => toMillis(row.timestamp) >= windowStart);

  const ttfa = withMinSamples(collectTapToActionSamples(filteredTaps, filteredBehaviors), (samples) => {
    const value = round(average(samples) / HOUR_MS, 1);
    return normalizeThreshold(value, "h", thresholdLowerBetter(value, 4, 12));
  }) || normalizeThreshold(null, "—", "gray");

  const viewingVelocity = withMinSamples(collectTapToBookingSamples(filteredTaps, filteredBehaviors), (samples) => {
    const value = round(average(samples) / DAY_MS, 1);
    return normalizeThreshold(value, "d", thresholdLowerBetter(value, 5, 14));
  }) || normalizeThreshold(null, "—", "gray");

  const tapMap = groupTapsByActor(filteredTaps);
  const reEngagementSamples = [];
  tapMap.forEach((rows) => {
    for (let i = 1; i < rows.length; i += 1) reEngagementSamples.push(rows[i] - rows[i - 1]);
  });
  const reEngagement = withMinSamples(reEngagementSamples, (samples) => {
    const value = round(average(samples) / DAY_MS, 1);
    return normalizeThreshold(value, "d", thresholdLowerBetter(value, 7, 21));
  }) || normalizeThreshold(null, "—", "gray");

  const secondTapFlags = [];
  tapMap.forEach((rows) => {
    if (!rows.length) return;
    const first = rows[0];
    secondTapFlags.push(rows.slice(1).some((ts) => ts - first <= 7 * DAY_MS) ? 1 : 0);
  });
  const secondTapRate = withMinSamples(secondTapFlags, (samples) => {
    const pct = Math.round((samples.reduce((sum, x) => sum + x, 0) / samples.length) * 100);
    return normalizeThreshold(pct, "%", thresholdHigherBetter(pct, 50, 25));
  }) || normalizeThreshold(null, "—", "gray");

  const anonymousOpen = filteredEvents.filter((row) => String(row.portalType || "").toLowerCase() === "anonymous");
  const capturedLead = filteredEvents.filter((row) => ["lead_captured", "request_pricing", "book_viewing", "request_quote"].includes(eventType(row)));
  const leadCapture = (anonymousOpen.length >= 3 && capturedLead.length >= 3)
    ? (() => {
      const pct = Math.round((capturedLead.length / Math.max(anonymousOpen.length, 1)) * 100);
      return normalizeThreshold(pct, "%", thresholdHigherBetter(pct, 30, 15));
    })()
    : normalizeThreshold(null, "—", "gray");

  const identifiedActors = new Set(filteredBehaviors.map((row) => actorId(row)).filter((id) => id !== "anon"));
  const bookedActors = new Set(filteredBehaviors.filter((row) => BOOKING_ACTIONS.has(eventType(row))).map((row) => actorId(row)).filter((id) => id !== "anon"));
  const vipToBooked = (identifiedActors.size >= 3 && bookedActors.size >= 3)
    ? (() => {
      const pct = Math.round((bookedActors.size / Math.max(identifiedActors.size, 1)) * 100);
      return normalizeThreshold(pct, "%", thresholdHigherBetter(pct, 20, 10));
    })()
    : normalizeThreshold(null, "—", "gray");

  const decisionSamples = deals
    .map((deal) => {
      const stage = String(deal.stage || "").toLowerCase();
      if (!NEGOTIATING_STAGES.has(stage)) return null;
      const created = toMillis(deal.createdAt || deal.created_at || deal.timestamp);
      const updated = toMillis(deal.updatedAt || deal.updated_at || deal.lastSeen || deal.lastSeenAt);
      if (!Number.isFinite(created) || !Number.isFinite(updated) || updated < created) return null;
      const startStage = String(deal.initialStage || deal.fromStage || "qualified").toLowerCase();
      if (!QUALIFIED_STAGES.has(startStage) && startStage !== "qualified") return null;
      return updated - created;
    })
    .filter((ms) => Number.isFinite(ms));
  const decisionWindow = withMinSamples(decisionSamples, (samples) => {
    const value = round(average(samples) / DAY_MS, 1);
    return normalizeThreshold(value, "d", thresholdLowerBetter(value, 14, 30));
  }) || normalizeThreshold(null, "—", "gray");

  const alertsByActor = new Map();
  filteredEvents.forEach((row) => {
    if (!ALERT_ACTIONS.has(eventType(row))) return;
    const ts = toMillis(row.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(row);
    const prev = alertsByActor.get(id);
    if (!prev || ts < prev) alertsByActor.set(id, ts);
  });

  const repActionByActor = new Map();
  filteredEvents.forEach((row) => {
    if (!REP_ACTIONS.has(eventType(row))) return;
    const ts = toMillis(row.timestamp);
    if (!Number.isFinite(ts)) return;
    const id = actorId(row);
    const prev = repActionByActor.get(id);
    if (!prev || ts < prev) repActionByActor.set(id, ts);
  });

  const responseSamples = [];
  alertsByActor.forEach((alertTs, id) => {
    const repTs = repActionByActor.get(id);
    if (!repTs || repTs < alertTs) return;
    responseSamples.push(repTs - alertTs);
  });
  const repResponse = withMinSamples(responseSamples, (samples) => {
    const value = Math.round(average(samples) / MINUTE_MS);
    return normalizeThreshold(value, "m", thresholdLowerBetter(value, 60, 240));
  }) || normalizeThreshold(null, "—", "gray");

  return {
    ttfa,
    viewingVelocity,
    reEngagement,
    secondTapRate,
    leadCapture,
    vipToBooked,
    decisionWindow,
    repResponse,
    computedAt: Date.now(),
    windowDays,
  };
}

module.exports = { computeVelocityMetrics };

"use strict";

function toMillis(value) {
  if (!value) return NaN;
  if (typeof value === "number") return Number.isFinite(value) ? value : NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value?.toMillis === "function") return value.toMillis();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : NaN;
}

function snapDocs(snap) {
  return (snap?.docs || []).map((doc) => doc.data());
}

function actor(row) {
  return row.vipName || row.userName || row.leadName || row.sessionId || row.cardId || "unknown";
}

function fmtMoney(value = 0) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return `$${Math.round(value)}`;
}

function deriveTopVip(tapsSnap, behaviorsSnap) {
  const taps = snapDocs(tapsSnap);
  const behaviors = snapDocs(behaviorsSnap);
  const now = Date.now();
  const dayCutoff = now - 24 * 60 * 60 * 1000;

  const counts = {};
  taps.forEach((tap) => {
    const key = actor(tap);
    const ts = toMillis(tap.timestamp);
    if (!Number.isFinite(ts) || ts < dayCutoff) return;
    counts[key] = counts[key] || { name: tap.vipName || tap.userName || tap.leadName || "Top VIP", tapCount: 0, lastTap: ts };
    counts[key].tapCount += 1;
    counts[key].lastTap = Math.max(counts[key].lastTap, ts);
  });

  const selected =
    Object.values(counts).sort((a, b) => b.tapCount - a.tapCount || b.lastTap - a.lastTap)[0] ||
    { name: "Top VIP", tapCount: 0, lastTap: now };

  const behavior = behaviors
    .filter((row) => actor(row) === selected.name || row.vipName === selected.name || row.userName === selected.name)
    .sort((a, b) => toMillis(b.timestamp) - toMillis(a.timestamp))[0];

  const score = Number(behavior?.score || behavior?.leadScore || 72);
  const prevScore = Number(behavior?.prevScore || Math.max(0, score - 8));
  const delta = score - prevScore;
  const mode = delta >= 5 ? "rising" : delta <= -5 ? "cooling" : "plateau";

  return {
    name: selected.name,
    tapCount: selected.tapCount,
    hoursAgo: Math.max(1, Math.round((now - selected.lastTap) / (60 * 60 * 1000))),
    firstAction: behavior?.event || behavior?.type || "viewed premium unit details",
    score,
    prevScore,
    silentDays: Math.max(0, Math.round((now - selected.lastTap) / (24 * 60 * 60 * 1000))),
    lastAction: behavior?.event || "none",
    mode,
  };
}

function derivePipelineDelta(dealsSnap, eventsSnap) {
  const deals = snapDocs(dealsSnap);
  const events = snapDocs(eventsSnap);
  const now = Date.now();
  const dayCutoff = now - 24 * 60 * 60 * 1000;

  const deltaValue = deals
    .filter((deal) => {
      const created = toMillis(deal.createdAt || deal.timestamp);
      const updated = toMillis(deal.updatedAt || deal.lastSeen);
      return (Number.isFinite(created) && created >= dayCutoff) || (Number.isFinite(updated) && updated >= dayCutoff);
    })
    .reduce((sum, deal) => sum + Number(deal.value || 0), 0);

  const newVipCount = new Set(
    events
      .filter((event) => {
        const ts = toMillis(event.timestamp);
        return Number.isFinite(ts) && ts >= dayCutoff && String(event.portalType || "").toLowerCase() === "vip";
      })
      .map((event) => event.vipName || event.userName || event.leadName)
      .filter(Boolean)
  ).size;

  return { pipelineDelta: fmtMoney(deltaValue), newVipCount };
}

function deriveMarketplaceTraffic(tapsSnap) {
  const taps = snapDocs(tapsSnap);
  const now = Date.now();
  const dayCutoff = now - 24 * 60 * 60 * 1000;

  const anonymous = taps.filter((tap) => {
    const ts = toMillis(tap.timestamp);
    return Number.isFinite(ts) && ts >= dayCutoff && String(tap.portalType || "").toLowerCase() === "anonymous";
  });
  const prev = taps.filter((tap) => {
    const ts = toMillis(tap.timestamp);
    return Number.isFinite(ts) && ts >= dayCutoff - 24 * 60 * 60 * 1000 && ts < dayCutoff && String(tap.portalType || "").toLowerCase() === "anonymous";
  });

  const currCount = anonymous.length;
  const prevCount = prev.length;
  const trafficDelta = prevCount > 0 ? Math.round(((currCount - prevCount) / prevCount) * 100) : currCount > 0 ? 100 : 0;

  const unitCounts = {};
  anonymous.forEach((tap) => {
    const key = tap.unitName || tap.item || tap.unitId || "Top listing";
    unitCounts[key] = (unitCounts[key] || 0) + 1;
  });
  const topUnit = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Top listing";

  return { trafficDelta, anonVisitors: currCount, topUnit };
}

function deriveAlerts(dealsSnap, eventsSnap) {
  const deals = snapDocs(dealsSnap);
  const events = snapDocs(eventsSnap);
  const now = Date.now();
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  const dayCutoff = now - 24 * 60 * 60 * 1000;

  const atRisk = deals.filter((deal) => {
    const stage = String(deal.stage || "").toLowerCase();
    const updated = toMillis(deal.updatedAt || deal.lastSeen || deal.createdAt);
    return ["negotiation", "viewing_scheduled", "test_drive"].includes(stage) && Number.isFinite(updated) && now - updated > threeDays;
  }).length;

  const hotLeadsNew = deals.filter((deal) => {
    const score = Number(deal.score || deal.leadScore || 0);
    const created = toMillis(deal.createdAt || deal.timestamp);
    return score >= 70 && Number.isFinite(created) && created >= dayCutoff;
  }).length;

  const followUpsOverdue = events.filter((event) => {
    const type = String(event.event || event.type || "").toLowerCase();
    const ts = toMillis(event.timestamp);
    return ["request_pricing", "request_quote", "book_viewing", "test_drive_request"].includes(type) && Number.isFinite(ts) && now - ts > threeDays;
  }).length;

  return { atRisk, hotLeadsNew, followUpsOverdue };
}

module.exports = { deriveTopVip, derivePipelineDelta, deriveMarketplaceTraffic, deriveAlerts };

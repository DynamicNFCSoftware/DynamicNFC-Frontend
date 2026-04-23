// src/services/dashboardQueries.js
// ═══════════════════════════════════════════════════════
// FIRESTORE QUERIES — Real data fetchers for dashboard
// ═══════════════════════════════════════════════════════

import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateDecayedScore, calculateVelocity, detectSalesTriggers, getSectorConfig } from "../config/sectorConfig";

const toMillis = (v) => {
  if (!v) return 0;
  if (typeof v.toMillis === "function") return v.toMillis();
  const parsed = new Date(v).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toDateSafe = (v) => {
  if (!v) return new Date();
  if (typeof v.toDate === "function") return v.toDate();
  const parsed = new Date(v);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const eventName = (row) => row.type || row.event || "";

export async function fetchSmartcards(campaignId = null) {
  try {
    const base = collection(db, "smartcards");
    const q = campaignId
      ? query(base, where("campaignId", "==", campaignId), limit(500))
      : query(base, limit(500));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchSmartcards error:", err);
    return [];
  }
}

export async function fetchCampaigns() {
  try {
    const q = query(collection(db, "campaigns"), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchCampaigns error:", err);
    return [];
  }
}

export async function fetchBehaviors(sectorId, limitCount = 200) {
  try {
    const config = getSectorConfig(sectorId);
    const sectorEvents = Object.values(config.events);
    const q = query(collection(db, "behaviors"), orderBy("timestamp", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return docs.filter((row) => sectorEvents.includes(eventName(row)));
  } catch (err) {
    console.error("fetchBehaviors error:", err);
    return [];
  }
}

export async function fetchTaps(cardId = null, limitCount = 100) {
  try {
    const base = collection(db, "taps");
    const q = cardId
      ? query(base, where("cardId", "==", cardId), orderBy("timestamp", "desc"), limit(limitCount))
      : query(base, orderBy("timestamp", "desc"), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("fetchTaps error:", err);
    return [];
  }
}

export async function fetchPipelineDeals(sectorId) {
  try {
    const q = query(collection(db, "pipeline"), where("sectorId", "==", sectorId), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("fetchPipelineDeals: collection may not exist yet");
    return [];
  }
}

export function buildVipProfiles(behaviors, smartcards, sectorId) {
  const config = getSectorConfig(sectorId);
  const byPerson = {};

  behaviors.forEach((b) => {
    const pid = b.personId || b.cardId;
    if (!pid) return;
    byPerson[pid] = byPerson[pid] || [];
    byPerson[pid].push(b);
  });

  return Object.entries(byPerson)
    .map(([pid, events]) => {
      const card = smartcards.find((c) => c.assignedTo === pid || c.id === pid);
      const sorted = [...events].sort((a, b) => toMillis(b.timestamp) - toMillis(a.timestamp));
      const top = {};
      events.forEach((e) => {
        const item = e.item || e.details?.unitName || e.details?.unitId;
        if (item) top[item] = (top[item] || 0) + 1;
      });
      const topItem = Object.entries(top).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      const normalizedEvents = events.map((e) => ({
        type: eventName(e),
        timestamp: toDateSafe(e.timestamp),
      }));
      const sortedNormalized = [...normalizedEvents].sort((a, b) => b.timestamp - a.timestamp);
      const score = calculateDecayedScore(normalizedEvents, sectorId);
      const triggers = detectSalesTriggers(sortedNormalized, sectorId);
      const velocity = calculateVelocity(sortedNormalized, sectorId);
      return {
        id: pid,
        name: card?.assignedName || sorted[0]?.visitorName || pid,
        email: card?.assignedEmail || "",
        score,
        lastSeen: toDateSafe(sorted[0]?.timestamp),
        topItem,
        cardId: card?.id || null,
        events: sorted.map((e) => ({
          type: eventName(e),
          timestamp: toDateSafe(e.timestamp),
          item: e.item || e.details?.unitName || e.details?.unitId || null,
        })),
        alert: detectAlert(sorted, config),
        triggers,
        velocity,
        atRisk: velocity.idleDays >= 5,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function detectAlert(events, config) {
  const now = Date.now();
  const dayMs = 86400000;
  const recent = events.filter((e) => now - toMillis(e.timestamp) < dayMs);
  const pricingCount = recent.filter((e) => eventName(e) === config.events.pricingRequest).length;
  if (pricingCount >= 3) return "pricing_3x";
  if (pricingCount > 0) return "pricing_request";
  if (recent.some((e) => eventName(e) === config.events.booking)) return "booking_request";
  if (recent.some((e) => eventName(e) === config.events.brochureDownload)) return "brochure";
  return null;
}

export function computeKpis(behaviors, taps, smartcards, sectorId) {
  const config = getSectorConfig(sectorId);
  const monthMs = 30 * 86400000;
  const now = Date.now();
  const tapRows = taps.filter((t) => now - toMillis(t.timestamp) < monthMs);
  const vipSeen = new Set();

  tapRows.forEach((t) => {
    const card = smartcards.find((c) => c.id === t.cardId);
    if (card?.assignedTo) vipSeen.add(card.assignedTo);
  });

  const bookingEvent = config.events.booking;
  const monthBehavior = behaviors.filter((b) => now - toMillis(b.timestamp) < monthMs);
  const bookings = monthBehavior.filter((b) => eventName(b) === bookingEvent).length;
  const vipBookings = monthBehavior.filter((b) => eventName(b) === bookingEvent && !!b.cardId).length;
  const vipCount = Math.max(vipSeen.size, 1);
  const stdCount = Math.max(tapRows.length - vipSeen.size, 1);
  const stdBookings = Math.max(bookings - vipBookings, 0);
  const lift = Number(((vipBookings / vipCount) / (stdBookings / stdCount + 0.01)).toFixed(1));

  return {
    vip_sessions: vipSeen.size,
    website_visitors: tapRows.length,
    bookings,
    conversion_lift: Number.isNaN(lift) ? 0 : lift,
  };
}

export function computeAnalytics(behaviors, taps, sectorId) {
  const config = getSectorConfig(sectorId);
  const deviceRaw = { mobile: 0, desktop: 0, tablet: 0 };
  taps.forEach((t) => {
    if (deviceRaw[t.deviceType] !== undefined) deviceRaw[t.deviceType] += 1;
  });
  const devTotal = Object.values(deviceRaw).reduce((a, b) => a + b, 0) || 1;
  const deviceBreakdown = {
    mobile: Math.round((deviceRaw.mobile / devTotal) * 100),
    desktop: Math.round((deviceRaw.desktop / devTotal) * 100),
    tablet: Math.round((deviceRaw.tablet / devTotal) * 100),
  };

  const categoryInterest = {};
  config.inventory.categories.forEach((c) => {
    categoryInterest[c.id] = 0;
  });
  behaviors.forEach((b) => {
    const key = b.category || b.details?.towerName || b.details?.collection || null;
    if (key && categoryInterest[key] !== undefined) categoryInterest[key] += 1;
  });

  const weeklyTrend = Array(7).fill(0);
  const now = Date.now();
  taps.forEach((t) => {
    const d = Math.floor((now - toMillis(t.timestamp)) / 86400000);
    if (d >= 0 && d < 7) weeklyTrend[6 - d] += 1;
  });

  return { deviceBreakdown, categoryInterest, weeklyTrend };
}

export function subscribeBehaviors(sectorId, callback, limitCount = 50) {
  const config = getSectorConfig(sectorId);
  const sectorEvents = Object.values(config.events);
  const q = query(collection(db, "behaviors"), orderBy("timestamp", "desc"), limit(limitCount));
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs.filter((row) => sectorEvents.includes(eventName(row))));
    },
    (err) => console.error("subscribeBehaviors error:", err)
  );
}

export function subscribeTaps(callback, limitCount = 100) {
  const q = query(collection(db, "taps"), orderBy("timestamp", "desc"), limit(limitCount));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => console.error("subscribeTaps error:", err)
  );
}

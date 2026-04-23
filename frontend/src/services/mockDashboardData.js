// src/services/mockDashboardData.js
// ═══════════════════════════════════════════════════════
// MOCK DATA — Used when demo mode is ON or Firestore is empty
// ═══════════════════════════════════════════════════════

import { calculateDecayedScore, calculateVelocity, detectSalesTriggers } from "../config/sectorConfig";
import { getPersonas } from "../config/regionConfig";

const now = Date.now();
const mins = (n) => new Date(now - n * 60000);
const hrs = (n) => new Date(now - n * 3600000);
const days = (n) => new Date(now - n * 86400000);

function buildRawMockVips(regionId = "gulf") {
  const rePersonas = getPersonas("real_estate", regionId);
  const autoPersonas = getPersonas("automotive", regionId);
  const reName1 = rePersonas[0]?.name || "VIP 1";
  const reName2 = rePersonas[1]?.name || "VIP 2";
  const reName3 = rePersonas[2]?.name || "Family Buyer";
  const reEmail1 = rePersonas[0]?.email || "vip1@example.com";
  const reEmail2 = rePersonas[1]?.email || "vip2@example.com";
  const reEmail3 = rePersonas[2]?.email || "fam1@example.com";
  const autoName1 = autoPersonas[0]?.name || "VIP 1";
  const autoName2 = autoPersonas[1]?.name || "VIP 2";
  const autoEmail1 = autoPersonas[0]?.email || "vip1@example.com";
  const autoEmail2 = autoPersonas[1]?.email || "vip2@example.com";

  return {
    real_estate: [
      {
        id: "vip1-re",
        name: reName1,
        email: reEmail1,
        assignedRep: "rep1",
        score: 82,
        lastSeen: mins(2),
        topItem: "Penthouse A-1201",
        cardId: "VISTA001",
        alert: "pricing_3x",
        events: [
          { type: "portal_opened", timestamp: mins(2), item: null },
          { type: "view_unit", timestamp: mins(5), item: "Penthouse A-1201" },
          { type: "request_pricing", timestamp: mins(8), item: "Penthouse A-1201" },
          { type: "payment_plan_viewed", timestamp: mins(15), item: "Penthouse A-1201" },
        ],
      },
      {
        id: "fam1-re",
        name: reName3,
        email: reEmail3,
        assignedRep: "rep2",
        score: 56,
        lastSeen: hrs(1),
        topItem: "3BR Family Suite C-502",
        cardId: "VISTA002",
        alert: "brochure",
        events: [
          { type: "portal_opened", timestamp: hrs(1), item: null },
          { type: "view_unit", timestamp: hrs(1), item: "3BR Family Suite C-502" },
          { type: "download_brochure", timestamp: hrs(2), item: null },
        ],
      },
      {
        id: "vip2-re",
        name: reName2,
        email: reEmail2,
        assignedRep: "rep1",
        score: 45,
        lastSeen: hrs(6),
        topItem: "2BR A-604",
        cardId: null,
        alert: null,
        events: [
          { type: "portal_opened", timestamp: hrs(6), item: null },
          { type: "view_unit", timestamp: hrs(6), item: "2BR A-604" },
        ],
      },
    ],
    automotive: [
      {
        id: "vip1-auto",
        name: autoName1,
        email: autoEmail1,
        assignedRep: "rep1",
        score: 78,
        lastSeen: mins(5),
        topItem: "AMG GT 63 S",
        cardId: "VISTA004",
        alert: "quote_requested",
        events: [
          { type: "auto_portal_entry", timestamp: mins(5), item: null },
          { type: "vehicle_view", timestamp: mins(8), item: "AMG GT 63 S" },
          { type: "request_quote", timestamp: mins(18), item: "AMG GT 63 S" },
        ],
      },
      {
        id: "vip2-auto",
        name: autoName2,
        email: autoEmail2,
        assignedRep: "rep2",
        score: 62,
        lastSeen: hrs(2),
        topItem: "G-Class G63",
        cardId: null,
        alert: "test_drive",
        events: [
          { type: "auto_portal_entry", timestamp: hrs(2), item: null },
          { type: "vehicle_view", timestamp: hrs(2), item: "G-Class G63" },
          { type: "test_drive_request", timestamp: hrs(3), item: "G-Class G63" },
        ],
      },
    ],
  };
}

const enrichVip = (vip, sectorId) => {
  const normalized = (vip.events || []).map((e) => ({
    type: e.type,
    timestamp: e.timestamp instanceof Date ? e.timestamp : new Date(e.timestamp),
  }));
  const sorted = [...normalized].sort((a, b) => b.timestamp - a.timestamp);
  const velocity = calculateVelocity(sorted, sectorId);
  return {
    ...vip,
    score: calculateDecayedScore(normalized, sectorId),
    triggers: detectSalesTriggers(sorted, sectorId),
    velocity,
    atRisk: velocity.idleDays >= 5,
  };
};

// Legacy static export (gulf default) — kept for backward compat
export const MOCK_VIPS = {
  real_estate: (buildRawMockVips("gulf").real_estate || []).map((vip) => enrichVip(vip, "real_estate")),
  automotive: (buildRawMockVips("gulf").automotive || []).map((vip) => enrichVip(vip, "automotive")),
};

// Region-aware getter (preferred)
export function getMockVips(sectorId, regionId = "gulf") {
  const raw = buildRawMockVips(regionId);
  return (raw[sectorId] || []).map((vip) => enrichVip(vip, sectorId));
}

export function getMockDeals(sectorId, regionId = "gulf") {
  const personas = getPersonas(sectorId, regionId);
  const n1 = personas[0]?.name || "VIP 1";
  const n2 = personas[1]?.name || "VIP 2";
  const n3 = personas[2]?.name || "Lead 3";
  if (sectorId === "automotive") {
    return [
      { id: "d1", name: n1, stage: "negotiation", value: 850000, score: 78, item: "AMG GT 63 S" },
      { id: "d2", name: n2, stage: "test_drive", value: 720000, score: 62, item: "G-Class G63" },
      { id: "d3", name: n3 !== n1 ? n3 : "New Lead", stage: "new_lead", value: 0, score: 35, item: "EQS 580" },
    ];
  }
  return [
    { id: "d1", name: n1, stage: "negotiation", value: 12500000, score: 82, item: "Penthouse A-1201" },
    { id: "d2", name: n3, stage: "viewing_scheduled", value: 4200000, score: 56, item: "3BR C-502" },
    { id: "d3", name: n2, stage: "contacted", value: 3100000, score: 45, item: "2BR A-604" },
    { id: "d4", name: "New Lead", stage: "new_lead", value: 0, score: 28, item: "Studio D-102" },
  ];
}

// Legacy static (backward compat)
export const MOCK_DEALS = {
  real_estate: getMockDeals("real_estate", "gulf"),
  automotive: getMockDeals("automotive", "gulf"),
};

export function getMockEvents(sectorId, regionId = "gulf") {
  const vips = getMockVips(sectorId, regionId);
  const allEvents = [];
  vips.forEach((vip) => {
    (vip.events || []).forEach((evt, index) => {
      const ts = evt.timestamp instanceof Date ? evt.timestamp : new Date(evt.timestamp);
      allEvents.push({
        id: `${vip.id}-${index}-${ts.getTime()}`,
        personName: vip.name,
        personId: vip.id,
        type: evt.type,
        item: evt.item,
        timestamp: ts,
        isVip: !!vip.cardId,
        description: evt.item ? `${vip.name} - ${evt.type.replace(/_/g, " ")} -> ${evt.item}` : `${vip.name} - ${evt.type.replace(/_/g, " ")}`,
      });
    });
  });
  allEvents.sort((a, b) => b.timestamp - a.timestamp);
  return allEvents;
}

export function getMockKpis(sectorId) {
  return {
    vip_sessions: sectorId === "automotive" ? 8 : 12,
    website_visitors: sectorId === "automotive" ? 634 : 847,
    bookings: sectorId === "automotive" ? 5 : 8,
    conversion_lift: 3.2,
  };
}

export function getMockAnalytics() {
  return {
    deviceBreakdown: { mobile: 62, desktop: 28, tablet: 10 },
    trafficSources: { nfc: 35, direct: 40, referral: 25 },
    weeklyTrend: [12, 18, 15, 22, 28, 24, 31],
  };
}

export function getMockCards(sectorId, regionId = "gulf") {
  const personas = getPersonas(sectorId, regionId);
  const n1 = personas[0]?.name || "VIP 1";
  const n2 = personas[1]?.name || "VIP 2";
  const n3 = personas[2]?.name || "Family Buyer";
  return [
    { id: "VISTA001", assignedTo: "vip1", assignedName: n1, status: "active", totalTaps: 47, lastTapAt: mins(2), campaignId: "vista-pilot", cardType: "vip" },
    { id: "VISTA002", assignedTo: "fam1", assignedName: sectorId === "automotive" ? n2 : n3, status: "active", totalTaps: 23, lastTapAt: hrs(1), campaignId: "vista-pilot", cardType: sectorId === "automotive" ? "vip" : "family" },
    { id: "VISTA003", assignedTo: null, assignedName: null, status: "unassigned", totalTaps: 156, lastTapAt: hrs(3), campaignId: "vista-pilot", cardType: "public" },
    { id: "VISTA004", assignedTo: "vip2", assignedName: n2, status: "active", totalTaps: 31, lastTapAt: mins(5), campaignId: "vista-pilot", cardType: "vip" },
  ];
}

// Legacy static (backward compat)
export const MOCK_CARDS = getMockCards("real_estate", "gulf");

export const MOCK_CAMPAIGNS = [
  { id: "vista-pilot", name: "Vista Residences VIP Pilot", client: "Vista Development Corp", totalCards: 4, activeCards: 4, startDate: days(30), status: "active" },
  { id: "al-noor-launch", name: "Al Noor Residences Launch", client: "Al Noor Development", totalCards: 50, activeCards: 12, startDate: days(7), status: "active" },
];

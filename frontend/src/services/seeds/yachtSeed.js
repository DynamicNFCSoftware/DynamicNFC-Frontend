import { getPersonas } from "../../config/regionConfig";

const SECTOR = "yacht";
const DAY_MS = 24 * 60 * 60 * 1000;
const toIso = (ms) => new Date(ms).toISOString();
const toSparkline = (value) => String(value).split(",").map((n) => Number(n.trim()));

const REGION_DATA = {
  gulf: {
    client: "Gulf Marina Yachts",
    location: "Dubai, UAE",
    reps: [
      { id: "rep_gulf_yacht_01", name: "Khalid Al-Maktoum" },
      { id: "rep_gulf_yacht_02", name: "Mohammed Al-Hammadi" },
    ],
    cards: [
      ["YA-GULF-001", "Azimut Grande 35 Metri", "motor", "Dubai Marina", 38000000, "reserved", 168, 44, 4, 30, 3, "10,15,20,26,24,33,40", "12 guests · 6 cabins · 28 knots", 320000, 0],
      ["YA-GULF-002", "Princess X95", "motor", "Jumeirah Bay Marina", 42500000, "available", 148, 38, 3, 26, 3, "8,12,17,22,20,28,36", "10 guests · 5 cabins · 26 knots", 285000, 0],
      ["YA-GULF-003", "Sunseeker 88", "motor", "Mina Rashid", 26000000, "available", 112, 28, 2, 20, 2, "6,10,14,18,16,22,28", "8 guests · 4 cabins · 29 knots", 185000, 1],
      ["YA-GULF-004", "Benetti Oasis 40M", "motor", "Dubai Marina", 48000000, "available", 88, 22, 2, 16, 2, "5,8,12,15,13,18,23", "12 guests · 6 cabins · Wellness Deck", 380000, 0],
      ["YA-GULF-005", "Pershing 9X", "sport", "Mina Rashid", 22500000, "available", 68, 14, 1, 12, 1, "4,6,9,12,10,14,18", "8 guests · 3 cabins · 42 knots", 160000, 1],
      ["YA-GULF-006", "Ferretti 1000", "motor", "Dubai Marina", 32000000, "available", 58, 12, 1, 10, 1, "3,5,8,11,9,13,17", "10 guests · 5 cabins · 26 knots", 225000, 0],
      ["YA-GULF-007", "Sanlorenzo SL90 Asymmetric", "motor", "Mina Rashid", 28500000, "available", 42, 8, 0, 7, 0, "2,4,6,8,6,10,14", "8 guests · 4 cabins · Award-winning", 195000, 1],
      ["YA-GULF-008", "Lurssen 85M Custom", "superyacht", "Dubai Marina", 285000000, "available", 12, 1, 0, 3, 0, "1,0,1,2,1,1,4", "16 guests · 8 cabins · Helipad · Custom", 1800000, 0],
    ],
  },
  usa: {
    client: "Pacific Coast Yachts",
    location: "San Diego, CA",
    reps: [
      { id: "rep_usa_yacht_01", name: "Robert Harrison" },
      { id: "rep_usa_yacht_02", name: "Ashley Chen" },
    ],
    cards: [
      ["YA-USA-001", "Westport 40M", "motor", "San Diego Marina", 18500000, "reserved", 158, 42, 4, 28, 3, "9,14,18,24,22,30,38", "12 guests · 6 cabins · 22 knots", 145000, 0],
      ["YA-USA-002", "Viking 80 Convertible", "sportfish", "Point Loma", 6800000, "available", 142, 36, 3, 24, 3, "8,12,16,22,20,28,34", "6 anglers · 4 cabins · 42 knots", 65000, 0],
      ["YA-USA-003", "Hatteras M98 Panacera", "motor", "Harbor Island", 12200000, "available", 108, 26, 2, 19, 2, "6,10,14,17,15,21,27", "10 guests · 5 cabins · 24 knots", 98000, 1],
      ["YA-USA-004", "Nordhavn 80", "explorer", "San Diego Marina", 9400000, "available", 92, 22, 2, 17, 2, "5,8,12,15,13,18,23", "8 guests · 4 cabins · Ocean-crossing", 72000, 0],
      ["YA-USA-005", "Bertram 61 Convertible", "sportfish", "Point Loma", 3800000, "available", 72, 15, 1, 12, 1, "4,7,10,13,11,15,19", "5 anglers · 3 cabins · 44 knots", 42000, 1],
      ["YA-USA-006", "Ocean Alexander 90R", "motor", "Harbor Island", 8900000, "available", 62, 13, 1, 10, 1, "3,6,8,11,9,13,17", "8 guests · 4 cabins · Raised Pilothouse", 68000, 0],
      ["YA-USA-007", "Grady-White Canyon 456", "sportfish", "Point Loma", 1250000, "available", 45, 9, 0, 8, 0, "2,4,6,8,6,10,14", "6 anglers · Day boat · Quad Yamaha 600s", 0, 1],
      ["YA-USA-008", "Feadship 80M Custom", "superyacht", "San Diego Marina", 195000000, "available", 14, 2, 0, 4, 0, "1,1,1,2,1,2,5", "14 guests · 7 cabins · Dutch flagship", 1400000, 0],
    ],
  },
  mexico: {
    client: "Marina del Caribe",
    location: "Cancun & Cabo",
    reps: [
      { id: "rep_mex_yacht_01", name: "Ricardo Hernandez" },
      { id: "rep_mex_yacht_02", name: "Valentina Cruz" },
    ],
    cards: [
      ["YA-MEX-001", "Ferretti Custom Line 130", "motor", "Cabo Marina", 340000000, "reserved", 148, 38, 4, 26, 3, "9,13,18,23,21,29,36", "12 guests · 6 cabins · 22 knots", 2800000, 0],
      ["YA-MEX-002", "Azimut Magellano 66", "motor", "Puerto Cancun", 65000000, "available", 112, 28, 3, 21, 3, "7,10,14,18,16,22,28", "8 guests · 4 cabins · Long-range", 520000, 1],
      ["YA-MEX-003", "Sunseeker Predator 74", "sport", "Puerto Vallarta", 78000000, "available", 92, 22, 2, 17, 2, "5,8,12,15,13,18,23", "6 guests · 3 cabins · 38 knots", 640000, 0],
      ["YA-MEX-004", "Princess Y85", "motor", "Puerto Cancun", 92000000, "available", 78, 16, 1, 14, 1, "4,7,10,13,11,15,19", "8 guests · 4 cabins · Flybridge", 720000, 1],
      ["YA-MEX-005", "Boston Whaler 420 Outrage", "sportfish", "Cabo Marina", 18500000, "available", 68, 13, 1, 11, 1, "4,6,9,12,10,14,18", "8 anglers · Quad Mercury 450s", 145000, 0],
      ["YA-MEX-006", "Azimut S7", "sport", "Puerto Cancun", 42000000, "available", 58, 12, 1, 9, 1, "3,5,8,11,9,13,16", "6 guests · 3 cabins · 34 knots", 340000, 1],
      ["YA-MEX-007", "Intrepid 477 Panacea", "sport", "Cabo Marina", 14200000, "available", 38, 7, 0, 6, 0, "2,3,5,7,5,9,12", "6 guests · Day boat · 55 knots", 115000, 0],
      ["YA-MEX-008", "Benetti Oasis 34M", "motor", "Cabo Marina", 180000000, "available", 10, 1, 0, 2, 0, "1,0,1,2,1,1,3", "10 guests · 5 cabins · Beach Club", 1200000, 1],
    ],
  },
  canada: {
    client: "Pacific Marina Yachts",
    location: "Vancouver, BC",
    reps: [
      { id: "rep_can_yacht_01", name: "William Sullivan" },
      { id: "rep_can_yacht_02", name: "Rebecca Nakamura" },
    ],
    cards: [
      ["YA-CAN-001", "Nordhavn 86", "explorer", "Coal Harbour Marina", 11500000, "reserved", 162, 42, 4, 29, 3, "10,14,19,24,22,31,38", "8 guests · 5 cabins · Ocean-crossing", 85000, 0],
      ["YA-CAN-002", "Grand Banks 85", "motor", "Royal Vancouver YC", 8500000, "available", 128, 32, 3, 23, 3, "7,11,15,20,18,25,32", "8 guests · 4 cabins · 18 knots", 62000, 0],
      ["YA-CAN-003", "Ocean Alexander 90R", "motor", "Granville Marina", 12800000, "available", 98, 24, 2, 18, 2, "6,9,13,16,14,20,25", "10 guests · 5 cabins · Raised Pilothouse", 92000, 1],
      ["YA-CAN-004", "Nordhavn 68", "explorer", "Coal Harbour Marina", 6200000, "available", 82, 18, 2, 15, 2, "5,8,11,14,12,17,22", "6 guests · 4 cabins · Trans-Pacific", 52000, 0],
      ["YA-CAN-005", "Fleming 65", "explorer", "Royal Vancouver YC", 4800000, "available", 68, 14, 1, 12, 1, "4,6,9,12,10,14,18", "6 guests · 3 cabins · Bluewater", 42000, 1],
      ["YA-CAN-006", "Princess Y80", "motor", "Coal Harbour Marina", 7800000, "available", 58, 12, 1, 10, 1, "3,5,8,11,9,13,17", "8 guests · 4 cabins · 28 knots", 58000, 0],
      ["YA-CAN-007", "Grady-White Canyon 376", "sportfish", "Granville Marina", 680000, "available", 42, 8, 0, 7, 0, "2,4,6,8,6,10,14", "6 anglers · Twin Yamaha 425s", 0, 1],
      ["YA-CAN-008", "Burger 140 Raised Pilothouse", "superyacht", "Coal Harbour Marina", 58000000, "available", 11, 1, 0, 3, 0, "1,0,1,2,1,1,4", "12 guests · 6 cabins · North American flagship", 480000, 0],
    ],
  },
};

function buildCards(baseTimeMs, regionId, config) {
  return config.cards.map((row, index) => {
    const [id, yachtName, yachtType, marina, pricing, status, views, downloads, bookings, totalTaps, interestedVips, sparkline, highlight, charterWeekly, repIndex] = row;
    const rep = config.reps[repIndex] || config.reps[0];
    return {
      id,
      name: yachtName,
      yachtName,
      unitName: yachtName,
      type: yachtType,
      yachtType,
      unitType: yachtType,
      marina,
      tower: marina,
      location: config.location,
      status,
      pricing,
      price: pricing,
      charterWeekly,
      views,
      downloads,
      bookings,
      totalTaps,
      lastTapAt: toIso(baseTimeMs - (index + 1) * 7 * 60 * 60 * 1000),
      interestedVips,
      sparkline: toSparkline(sparkline),
      campaignId: `camp_${regionId}_yacht_${(index % 3) + 1}`,
      linkedCampaignId: `camp_${regionId}_yacht_${(index % 3) + 1}`,
      linkedDealCount: index < 4 ? 1 : 0,
      assignedRepId: rep.id,
      assignedRepName: rep.name,
      highlight,
      paymentPlan: `Brokered terms · ${index % 2 === 0 ? "36" : "48"}mo`,
      createdAt: toIso(baseTimeMs - (32 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (index % 3) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildLeads(baseTimeMs, regionId, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1");
  const vip2 = personas.find((p) => p.id === "vip2");
  return [
    { id: `lead_${regionId}_yacht_vip1`, name: vip1?.name || "VIP Owner", email: vip1?.email || "", phone: "", source: "broker", status: "qualified", assignedRep: config.reps[0].id, score: 92, createdAt: toIso(baseTimeMs - 8.5 * DAY_MS), updatedAt: toIso(baseTimeMs - 1 * DAY_MS), lastContactAt: toIso(baseTimeMs - 1.3 * DAY_MS), notes: "Ownership track with superyacht shortlist.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_yacht_vip2`, name: vip2?.name || "VIP Charter", email: vip2?.email || "", phone: "", source: "event", status: "contacted", assignedRep: config.reps[1].id, score: 78, createdAt: toIso(baseTimeMs - 7.5 * DAY_MS), updatedAt: toIso(baseTimeMs - 2 * DAY_MS), lastContactAt: toIso(baseTimeMs - 1.8 * DAY_MS), notes: "Charter-first, buy-path possible.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_yacht_broker`, name: "Broker Referral", email: "", phone: "", source: "broker", status: "qualified", assignedRep: config.reps[0].id, score: 66, createdAt: toIso(baseTimeMs - 6 * DAY_MS), updatedAt: toIso(baseTimeMs - 2.4 * DAY_MS), lastContactAt: toIso(baseTimeMs - 2.4 * DAY_MS), notes: "Representing private family office.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_yacht_new`, name: "Marina Visitor", email: "", phone: "", source: "marketplace", status: "new", assignedRep: config.reps[1].id, score: 50, createdAt: toIso(baseTimeMs - 2 * DAY_MS), updatedAt: toIso(baseTimeMs - 0.7 * DAY_MS), lastContactAt: toIso(baseTimeMs - 0.7 * DAY_MS), notes: "Lead captured from charter listing.", sector: SECTOR, region: regionId },
  ];
}

function buildDeals(baseTimeMs, regionId, cards, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Owner";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Charter";
  const templates = [
    { stage: "negotiation", score: 90, velocity: 10, probability: 0.82, atRisk: false, leadName: vip1, triggers: ["book_viewing", "request_pricing"] },
    { stage: "viewing_scheduled", score: 79, velocity: 14, probability: 0.67, atRisk: false, leadName: vip2, triggers: ["comparison_view", "download_brochure"] },
    { stage: "comparison", score: 69, velocity: 21, probability: 0.54, atRisk: false, leadName: "Broker Referral", triggers: ["view_floorplan", "explore_payment_plan"] },
    { stage: "inquiry", score: 52, velocity: 30, probability: 0.33, atRisk: true, leadName: "Marina Visitor", triggers: ["lead_captured", "cta_explore"] },
  ];
  return templates.map((tpl, index) => {
    const card = cards[index];
    return {
      id: `deal_${regionId}_yacht_${index + 1}`,
      name: `${tpl.leadName} - ${card.yachtName}`,
      title: `${card.yachtName} - ${tpl.leadName}`,
      leadName: tpl.leadName,
      item: card.yachtName,
      unitName: card.yachtName,
      value: card.pricing,
      stage: tpl.stage,
      score: tpl.score,
      velocity: tpl.velocity,
      probability: tpl.probability,
      triggers: tpl.triggers,
      atRisk: tpl.atRisk,
      vipLinked: index < 2,
      campaignId: `camp_${regionId}_yacht_${(index % 3) + 1}`,
      assignedRep: index % 2 === 0 ? config.reps[0].id : config.reps[1].id,
      createdAt: toIso(baseTimeMs - (8 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (1.7 - index * 0.25) * DAY_MS),
      lastSeen: toIso(baseTimeMs - (1.2 - index * 0.2) * DAY_MS),
      expectedCloseAt: toIso(baseTimeMs + (20 + index * 8) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildCampaigns(baseTimeMs, regionId, config, cards) {
  const set = [
    ["camp_" + regionId + "_yacht_1", `${config.client} Elite Circle`, "active", "email", "viewings_booked", "uhnwi_invite_only", 125000, 76000, 240, 168, 74, 10, 30],
    ["camp_" + regionId + "_yacht_2", `${config.client} Private Viewing Collection`, "active", "event", "charter_bookings", "family_offices", 86000, 39000, 160, 115, 52, 8, 22],
    ["camp_" + regionId + "_yacht_3", `${config.client} Spring Launch Preview`, "draft", "sms", "early_interest", "broker_network", 52000, 0, 0, 0, 0, 0, 4],
  ];
  return set.map((row, index) => {
    const [id, name, status, channel, objective, targetAudience, budget, spent, sent, opened, clicked, converted, daysAgo] = row;
    const cardIds = cards.slice(index * 2, index * 2 + 3).map((c) => c.id);
    return {
      id,
      name,
      description: `${objective.replace(/_/g, " ")} campaign for ${config.client}`,
      status,
      channel,
      type: channel,
      objective,
      targetAudience,
      audience: targetAudience,
      client: config.client,
      totalCards: cardIds.length + 3,
      activeCards: status === "draft" ? 0 : cardIds.length,
      cardIds,
      budget,
      spent,
      sent,
      opened,
      clicked,
      converted,
      source: "nfc",
      startDate: toIso(baseTimeMs - daysAgo * DAY_MS),
      endDate: status === "draft" ? null : toIso(baseTimeMs + (36 - index * 6) * DAY_MS),
      createdAt: toIso(baseTimeMs - (daysAgo + 4) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildEvents(baseTimeMs, regionId, cards, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Owner";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Charter";
  const events = [];
  const push = (id, daysAgo, payload) => {
    events.push({
      id,
      ...payload,
      sector: SECTOR,
      region: regionId,
      timestamp: toIso(baseTimeMs - daysAgo * DAY_MS),
    });
  };
  const seq1 = ["portal_opened", "view_unit", "view_floorplan", "comparison_view", "explore_payment_plan", "download_brochure", "request_pricing", "book_viewing", "contact_advisor"];
  const seq2 = ["portal_opened", "view_unit", "comparison_view", "explore_payment_plan", "download_brochure", "request_pricing", "cta_booking", "roi_calculator_click"];
  seq1.forEach((event, idx) => {
    const yacht = cards[idx % 3];
    push(`ev_${regionId}_yacht_v1_${idx + 1}`, 8.8 - idx * 0.62, { event, portalType: "vip", vipName: vip1, unitName: yacht.yachtName, unitType: yacht.yachtType, tower: yacht.marina, metadata: { marina: yacht.marina } });
  });
  seq2.forEach((event, idx) => {
    const yacht = cards[(idx + 2) % 4];
    push(`ev_${regionId}_yacht_v2_${idx + 1}`, 8.3 - idx * 0.58, { event, portalType: "vip", vipName: vip2, unitName: yacht.yachtName, unitType: yacht.yachtType, tower: yacht.marina, metadata: { marina: yacht.marina } });
  });
  const tail = [
    ["marketplace_visit", "anonymous"],
    ["filter_units", "anonymous"],
    ["lead_form_shown", "lead"],
    ["lead_captured", "lead"],
    ["cta_browse", "registered"],
    ["view_unit", "registered"],
    ["request_pricing", "registered"],
    ["cta_explore", "anonymous"],
    ["language_switch", "anonymous"],
    ["portal_opened", "anonymous"],
  ];
  tail.forEach(([event, portalType], idx) => {
    const yacht = cards[(idx + 3) % cards.length];
    push(`ev_${regionId}_yacht_tail_${idx + 1}`, 4.6 - idx * 0.35, {
      event,
      portalType,
      ...(portalType === "registered" && { userName: "Broker Referral" }),
      ...(portalType === "lead" && { leadName: "Marina Visitor" }),
      ...(portalType === "anonymous" && { sessionId: `${regionId}_yacht_sess_${idx + 1}` }),
      unitName: yacht.yachtName,
      unitType: yacht.yachtType,
      tower: yacht.marina,
      metadata: { source: "marketplace" },
    });
  });
  return events;
}

export function buildYachtSeed(baseTimeMs = Date.now(), regionId = "gulf") {
  const config = REGION_DATA[regionId] || REGION_DATA.gulf;
  const personas = getPersonas("yacht", regionId);
  const cards = buildCards(baseTimeMs, regionId, config);
  const leads = buildLeads(baseTimeMs, regionId, config, personas);
  const deals = buildDeals(baseTimeMs, regionId, cards, config, personas);
  const campaigns = buildCampaigns(baseTimeMs, regionId, config, cards);
  const events = buildEvents(baseTimeMs, regionId, cards, personas);
  return { cards, leads, deals, campaigns, events };
}

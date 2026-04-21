import { getPersonas } from "../../config/regionConfig";

const SECTOR = "realEstate";
const DAY_MS = 24 * 60 * 60 * 1000;

const toIso = (ms) => new Date(ms).toISOString();
const toSparkline = (value) => String(value).split(",").map((n) => Number(n.trim()));

const REGION_DATA = {
  gulf: {
    client: "Al Noor Residences",
    location: "Riyadh",
    reps: [
      { id: "rep_gulf_01", name: "Ahmed Al-Sayed" },
      { id: "rep_gulf_02", name: "Noura Al-Qahtani" },
      { id: "rep_gulf_03", name: "Omar Al-Rashid" },
    ],
    cards: [
      ["RE-GULF-001", "Sky Penthouse A", "Al Qamar Tower", "penthouse", 9500000, "reserved", 142, 38, 4, 27, 3, "8,12,15,22,18,27,35", "4BR · 5BA · 4,800 sqft", 0],
      ["RE-GULF-002", "Sky Penthouse B", "Al Qamar Tower", "penthouse", 11000000, "available", 98, 24, 2, 19, 2, "5,8,12,10,18,22,23", "4BR · 5BA · 5,200 sqft", 0],
      ["RE-GULF-003", "Royal 3BR A", "Al Safwa Tower", "3br", 5200000, "available", 76, 18, 2, 15, 2, "4,6,8,12,10,14,22", "3BR · 3BA · 2,400 sqft", 1],
      ["RE-GULF-004", "Royal 3BR B", "Al Safwa Tower", "3br", 5500000, "available", 54, 12, 1, 10, 1, "3,4,6,8,6,10,17", "3BR · 3BA · 2,500 sqft", 1],
      ["RE-GULF-005", "Garden 3BR", "Al Safwa Tower", "3br", 5800000, "available", 82, 22, 3, 18, 2, "6,10,12,15,14,18,21", "3BR · 3BA · 2,600 sqft", 1],
      ["RE-GULF-006", "Marina 2BR A", "Al Qamar Tower", "2br", 3600000, "available", 45, 8, 0, 7, 1, "2,4,5,8,6,10,10", "2BR · 2BA · 1,600 sqft", 0],
      ["RE-GULF-007", "Studio Bay 1", "Al Safwa Tower", "studio", 1800000, "available", 28, 4, 0, 3, 0, "1,2,3,4,2,8,8", "Studio · 1BA · 650 sqft", 1],
      ["RE-GULF-008", "Garden 4BR", "Al Rawda Tower", "4br", 7200000, "available", 8, 0, 0, 2, 0, "1,0,1,2,1,1,3", "4BR · 4BA · 3,800 sqft", 2],
    ],
    paymentPlan: { penthouse: "20/80 · 5yr", "3br": "30/70 · 4yr", "2br": "40/60 · 3yr", studio: "40/60 · 3yr", "4br": "20/80 · 5yr" },
    campaigns: [
      ["camp_gulf_re_vip_access", "Al Noor VIP Winter Access", "Premium NFC invitation for HNW buyers", "active", "email", "viewings_booked", "high_intent_vips", 280000, 195000, 420, 288, 122, 16, 30],
      ["camp_gulf_re_private_viewing", "Al Noor Private Viewing Circle", "Curated floor tours for penthouse buyers", "active", "event", "qualified_walkthroughs", "vip_penthouse_interest", 165000, 98000, 240, 182, 88, 11, 24],
      ["camp_gulf_re_spring_preview", "Al Noor Spring Launch Preview", "SMS prelaunch teasers for family buyers", "draft", "sms", "early_interest", "family_buyers", 95000, 0, 0, 0, 0, 0, 3],
    ],
  },
  usa: {
    client: "Skyline Towers",
    location: "Manhattan, NY",
    reps: [
      { id: "rep_usa_01", name: "Jessica Parker" },
      { id: "rep_usa_02", name: "Michael Chen" },
    ],
    cards: [
      ["RE-USA-001", "Madison Penthouse 52A", "Madison Tower", "penthouse", 22500000, "reserved", 168, 42, 5, 31, 4, "10,15,18,25,22,32,40", "5BR · 6BA · 6,200 sqft", 0],
      ["RE-USA-002", "Hudson Loft 3B", "Hudson Tower", "3br", 6200000, "available", 112, 28, 3, 22, 3, "6,10,14,18,16,22,28", "3BR · 3BA · 2,800 sqft", 1],
      ["RE-USA-003", "Central Park Suite 28", "Park Tower", "3br", 9800000, "available", 95, 24, 2, 18, 2, "5,8,12,16,14,20,25", "3BR · 3.5BA · 3,100 sqft", 0],
      ["RE-USA-004", "Madison Residence 38B", "Madison Tower", "2br", 5400000, "available", 68, 14, 1, 12, 1, "4,6,8,12,10,16,20", "2BR · 2.5BA · 2,200 sqft", 1],
      ["RE-USA-005", "Hudson Garden Duplex", "Hudson Tower", "4br", 12500000, "available", 58, 12, 1, 10, 1, "3,5,8,10,9,12,18", "4BR · 4BA · 3,900 sqft", 0],
      ["RE-USA-006", "Park View Studio 12", "Park Tower", "studio", 1950000, "available", 42, 8, 0, 6, 0, "2,3,5,7,5,8,12", "Studio · 1BA · 780 sqft", 1],
      ["RE-USA-007", "Madison Loft 22A", "Madison Tower", "2br", 4800000, "sold", 88, 22, 3, 16, 0, "12,15,18,16,14,10,8", "2BR · 2BA · 1,950 sqft", 0],
      ["RE-USA-008", "Hudson Penthouse 48", "Hudson Tower", "penthouse", 18500000, "available", 14, 2, 0, 4, 0, "2,1,2,3,2,2,4", "4BR · 5BA · 5,400 sqft", 0],
    ],
    paymentPlan: { penthouse: "20/80 · 10yr jumbo", "3br": "30/70 · 7yr", "2br": "30/70 · 7yr", studio: "30/70 · 5yr", "4br": "25/75 · 10yr" },
    campaigns: [
      ["camp_usa_re_vip_access", "Skyline VIP Access Circle", "White-glove penthouse intro for private buyers", "active", "email", "viewings_booked", "high_intent_vips", 85000, 52000, 360, 246, 101, 12, 28],
      ["camp_usa_re_private_viewing", "Skyline Private Viewing Week", "In-person tours for signed intent prospects", "active", "event", "qualified_walkthroughs", "active_shortlist", 58000, 33400, 225, 161, 73, 9, 19],
      ["camp_usa_re_spring_preview", "Skyline Spring Launch Preview", "SMS launch invite to waitlist buyers", "draft", "sms", "early_interest", "waitlist", 32000, 0, 0, 0, 0, 0, 4],
    ],
  },
  mexico: {
    client: "Residencias del Sol",
    location: "Polanco, CDMX",
    reps: [
      { id: "rep_mex_01", name: "Alejandro Herrera" },
      { id: "rep_mex_02", name: "Sofia Mendez" },
    ],
    cards: [
      ["RE-MEX-001", "Polanco Penthouse 18A", "Torre del Sol", "penthouse", 85000000, "reserved", 128, 32, 4, 24, 3, "8,12,16,20,18,26,32", "4BR · 5BA · 520 m²", 0],
      ["RE-MEX-002", "Reforma 3BR", "Torre Luna", "3br", 42000000, "available", 88, 20, 2, 16, 2, "5,8,12,15,12,18,22", "3BR · 3BA · 260 m²", 1],
      ["RE-MEX-003", "Chapultepec Suite", "Torre Mirador", "3br", 55000000, "available", 74, 16, 2, 14, 2, "4,6,10,12,10,14,19", "3BR · 3.5BA · 310 m²", 0],
      ["RE-MEX-004", "Reforma 2BR A", "Torre Luna", "2br", 28000000, "available", 52, 10, 1, 9, 1, "3,5,7,10,8,12,15", "2BR · 2BA · 175 m²", 1],
      ["RE-MEX-005", "Polanco Garden 4BR", "Torre del Sol", "4br", 62000000, "available", 45, 10, 1, 8, 1, "2,4,6,8,6,10,13", "4BR · 4BA · 380 m²", 0],
      ["RE-MEX-006", "Reforma Studio 8", "Torre Luna", "studio", 12000000, "available", 32, 5, 0, 4, 0, "1,2,4,5,4,6,8", "Studio · 1BA · 85 m²", 1],
      ["RE-MEX-007", "Chapultepec 2BR B", "Torre Mirador", "2br", 32000000, "available", 38, 8, 1, 6, 1, "2,3,5,7,6,8,11", "2BR · 2BA · 190 m²", 0],
      ["RE-MEX-008", "Polanco Sky 21", "Torre del Sol", "3br", 48500000, "sold", 72, 18, 3, 14, 0, "15,18,16,14,10,8,5", "3BR · 3BA · 280 m²", 0],
    ],
    paymentPlan: { penthouse: "30/70 · 5yr", "3br": "30/70 · 4yr", "2br": "40/60 · 4yr", studio: "40/60 · 3yr", "4br": "25/75 · 5yr" },
    campaigns: [
      ["camp_mex_re_vip_access", "Residencias VIP Access", "NFC-backed private tours for top buyers", "active", "email", "viewings_booked", "high_intent_vips", 2400000, 1460000, 390, 252, 110, 13, 26],
      ["camp_mex_re_private_viewing", "Polanco Private Viewing Week", "Guided tours for high fit buyers", "active", "event", "qualified_walkthroughs", "family_offices", 1320000, 680000, 250, 170, 74, 8, 21],
      ["camp_mex_re_spring_preview", "Residencias Spring Launch Preview", "SMS launch to premium waitlist", "draft", "sms", "early_interest", "waitlist", 680000, 0, 0, 0, 0, 0, 5],
    ],
  },
  canada: {
    client: "Vista Residences",
    location: "Vancouver, BC",
    reps: [
      { id: "rep_can_01", name: "Jennifer MacDonald" },
      { id: "rep_can_02", name: "Marc Patel" },
    ],
    cards: [
      ["RE-CAN-001", "Harbour Penthouse 41A", "Pacific Tower", "penthouse", 12800000, "reserved", 138, 35, 4, 26, 3, "9,14,18,22,20,28,36", "4BR · 5BA · 4,200 sqft", 0],
      ["RE-CAN-002", "Seawall 3BR", "Vista Tower", "3br", 4800000, "available", 92, 22, 3, 17, 2, "6,9,12,16,14,20,24", "3BR · 3BA · 1,950 sqft", 1],
      ["RE-CAN-003", "Coal Harbour Suite", "Pacific Tower", "3br", 5900000, "available", 82, 18, 2, 15, 2, "5,8,12,14,12,18,23", "3BR · 3BA · 2,100 sqft", 0],
      ["RE-CAN-004", "Vista 2BR A", "Vista Tower", "2br", 3200000, "available", 62, 14, 1, 11, 1, "3,5,8,10,9,14,18", "2BR · 2BA · 1,400 sqft", 1],
      ["RE-CAN-005", "Harbour Loft 32", "Pacific Tower", "2br", 3950000, "available", 56, 12, 1, 10, 1, "3,5,7,9,8,12,16", "2BR · 2BA · 1,650 sqft", 0],
      ["RE-CAN-006", "Vista Studio Plus", "Vista Tower", "studio", 1480000, "available", 38, 7, 0, 5, 0, "2,3,4,6,4,8,11", "Studio · 1BA · 720 sqft", 1],
      ["RE-CAN-007", "Seawall Garden 4BR", "Vista Tower", "4br", 6200000, "available", 44, 10, 1, 8, 1, "2,4,6,8,7,10,13", "4BR · 3BA · 2,400 sqft", 1],
      ["RE-CAN-008", "Coal Harbour Penthouse 45", "Pacific Tower", "penthouse", 10500000, "available", 22, 3, 0, 5, 0, "2,1,3,4,2,3,7", "4BR · 4BA · 3,600 sqft", 0],
    ],
    paymentPlan: { penthouse: "25/75 · 5yr", "3br": "30/70 · 5yr", "2br": "35/65 · 5yr", studio: "35/65 · 3yr", "4br": "25/75 · 5yr" },
    campaigns: [
      ["camp_can_re_vip_access", "Vista VIP Access Circle", "Invite-only harbour collection campaign", "active", "email", "viewings_booked", "high_intent_vips", 68000, 42000, 310, 205, 86, 11, 27],
      ["camp_can_re_private_viewing", "Vista Private Viewing Days", "Data-led shortlisting tours", "active", "event", "qualified_walkthroughs", "active_shortlist", 47000, 25500, 205, 142, 62, 8, 20],
      ["camp_can_re_spring_preview", "Vista Spring Launch Preview", "SMS teaser to waitlist subscribers", "draft", "sms", "early_interest", "waitlist", 28000, 0, 0, 0, 0, 0, 5],
    ],
  },
};

function buildCards(baseTimeMs, regionId, config) {
  return config.cards.map((row, index) => {
    const [id, unitName, tower, unitType, pricing, status, views, downloads, bookings, totalTaps, interestedVips, sparkline, highlight, repIndex] = row;
    const rep = config.reps[repIndex] || config.reps[0];
    const campaignId = config.campaigns[index % config.campaigns.length][0];
    return {
      id,
      name: unitName,
      unitName,
      type: unitType,
      unitType,
      tower,
      location: config.location,
      status,
      pricing,
      price: pricing,
      views,
      downloads,
      bookings,
      totalTaps,
      lastTapAt: toIso(baseTimeMs - (index + 1) * 6 * 60 * 60 * 1000),
      interestedVips,
      sparkline: toSparkline(sparkline),
      campaignId,
      linkedCampaignId: campaignId,
      linkedDealCount: index < 4 ? 1 : 0,
      assignedRepId: rep.id,
      assignedRepName: rep.name,
      highlight,
      paymentPlan: config.paymentPlan[unitType] || "30/70 · 4yr",
      createdAt: toIso(baseTimeMs - (35 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (index % 3) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildCampaigns(baseTimeMs, regionId, config) {
  return config.campaigns.map((row, index) => {
    const [id, name, description, status, channel, objective, targetAudience, budget, spent, sent, opened, clicked, converted, daysAgo] = row;
    const cardIds = config.cards.slice(index * 2, index * 2 + 3).map((card) => card[0]);
    const activeCards = status === "draft" ? 0 : cardIds.length;
    return {
      id,
      name,
      description,
      status,
      channel,
      type: channel,
      objective,
      targetAudience,
      audience: targetAudience,
      client: config.client,
      totalCards: cardIds.length + 5,
      activeCards,
      cardIds,
      budget,
      spent,
      sent,
      opened,
      clicked,
      converted,
      source: "nfc",
      startDate: toIso(baseTimeMs - daysAgo * DAY_MS),
      endDate: status === "draft" ? null : toIso(baseTimeMs + (30 - index * 5) * DAY_MS),
      createdAt: toIso(baseTimeMs - (daysAgo + 4) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildLeads(baseTimeMs, regionId, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1");
  const vip2 = personas.find((p) => p.id === "vip2");
  const fam1 = personas.find((p) => p.id === "fam1");
  return [
    {
      id: `lead_${regionId}_vip1`,
      name: vip1?.name || "VIP Investor",
      email: vip1?.email || "vip1@example.com",
      phone: "",
      source: "nfc_card",
      status: "qualified",
      assignedRep: config.reps[0].id,
      score: 92,
      createdAt: toIso(baseTimeMs - 9 * DAY_MS),
      updatedAt: toIso(baseTimeMs - 1 * DAY_MS),
      lastContactAt: toIso(baseTimeMs - 1.2 * DAY_MS),
      notes: "High urgency buyer with strong penthouse intent.",
      sector: SECTOR,
      region: regionId,
    },
    {
      id: `lead_${regionId}_vip2`,
      name: vip2?.name || "VIP Buyer",
      email: vip2?.email || "vip2@example.com",
      phone: "",
      source: "website",
      status: "qualified",
      assignedRep: config.reps[1]?.id || config.reps[0].id,
      score: 80,
      createdAt: toIso(baseTimeMs - 8 * DAY_MS),
      updatedAt: toIso(baseTimeMs - 2 * DAY_MS),
      lastContactAt: toIso(baseTimeMs - 1.6 * DAY_MS),
      notes: "Compares payment plans before booking viewing.",
      sector: SECTOR,
      region: regionId,
    },
    {
      id: `lead_${regionId}_fam1`,
      name: fam1?.name || "Family Buyer",
      email: fam1?.email || "family@example.com",
      phone: "",
      source: "event",
      status: "contacted",
      assignedRep: config.reps[1]?.id || config.reps[0].id,
      score: 67,
      createdAt: toIso(baseTimeMs - 7 * DAY_MS),
      updatedAt: toIso(baseTimeMs - 2.5 * DAY_MS),
      lastContactAt: toIso(baseTimeMs - 2.5 * DAY_MS),
      notes: "Evaluating family-friendly towers.",
      sector: SECTOR,
      region: regionId,
    },
    {
      id: `lead_${regionId}_new`,
      name: `${config.location} Prospect`,
      email: "",
      phone: "",
      source: "marketplace",
      status: "new",
      assignedRep: config.reps[0].id,
      score: 52,
      createdAt: toIso(baseTimeMs - 3 * DAY_MS),
      updatedAt: toIso(baseTimeMs - 0.8 * DAY_MS),
      lastContactAt: toIso(baseTimeMs - 0.8 * DAY_MS),
      notes: "Lead form captured, needs qualification.",
      sector: SECTOR,
      region: regionId,
    },
  ];
}

function buildDeals(baseTimeMs, regionId, cards, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Investor";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Buyer";
  const fam1 = personas.find((p) => p.id === "fam1")?.name || "Family Buyer";
  const campaignIds = config.campaigns.map((c) => c[0]);
  const templates = [
    { stage: "negotiation", score: 91, velocity: 9, probability: 0.84, atRisk: false, leadName: vip1, triggers: ["book_viewing", "request_pricing"] },
    { stage: "viewing_scheduled", score: 80, velocity: 13, probability: 0.68, atRisk: false, leadName: vip2, triggers: ["comparison_view", "explore_payment_plan"] },
    { stage: "comparison", score: 70, velocity: 19, probability: 0.56, atRisk: false, leadName: fam1, triggers: ["view_floorplan", "download_brochure"] },
    { stage: "contacted", score: 54, velocity: 29, probability: 0.36, atRisk: true, leadName: `${config.location} Prospect`, triggers: ["lead_captured", "cta_explore"] },
  ];
  return templates.map((tpl, index) => {
    const itemCard = cards[index];
    return {
      id: `deal_${regionId}_re_${index + 1}`,
      name: `${tpl.leadName} - ${itemCard.unitName}`,
      title: `${itemCard.unitName} - ${tpl.leadName}`,
      leadName: tpl.leadName,
      item: itemCard.unitName,
      unitName: itemCard.unitName,
      value: itemCard.pricing,
      stage: tpl.stage,
      score: tpl.score,
      velocity: tpl.velocity,
      probability: tpl.probability,
      triggers: tpl.triggers,
      atRisk: tpl.atRisk,
      vipLinked: index < 3,
      campaignId: campaignIds[index % campaignIds.length],
      assignedRep: itemCard.assignedRepId,
      createdAt: toIso(baseTimeMs - (8 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (2 - index * 0.3) * DAY_MS),
      lastSeen: toIso(baseTimeMs - (1.5 - index * 0.2) * DAY_MS),
      expectedCloseAt: toIso(baseTimeMs + (18 + index * 7) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildEvents(baseTimeMs, regionId, cards, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Investor";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Buyer";
  const fam1 = personas.find((p) => p.id === "fam1")?.name || "Family Buyer";
  const [top, alt, third] = cards;
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

  const vip1Sequence = ["portal_opened", "view_unit", "view_unit", "view_floorplan", "comparison_view", "explore_payment_plan", "download_brochure", "request_pricing", "book_viewing", "roi_calculator_click"];
  vip1Sequence.forEach((event, idx) => {
    const useCard = idx % 2 === 0 ? top : alt;
    push(`ev_${regionId}_vip1_${idx + 1}`, 9 - idx * 0.7, {
      event,
      portalType: "vip",
      vipName: vip1,
      unitName: useCard.unitName,
      unitType: useCard.unitType,
      tower: useCard.tower,
      metadata: { source: "vip_portal", rank: idx + 1 },
    });
  });

  const vip2Sequence = ["portal_opened", "view_unit", "view_floorplan", "comparison_view", "explore_payment_plan", "download_brochure", "request_pricing", "book_viewing", "contact_advisor"];
  vip2Sequence.forEach((event, idx) => {
    const useCard = idx % 2 === 0 ? alt : third;
    push(`ev_${regionId}_vip2_${idx + 1}`, 8.5 - idx * 0.65, {
      event,
      portalType: "vip",
      vipName: vip2,
      unitName: useCard.unitName,
      unitType: useCard.unitType,
      tower: useCard.tower,
      metadata: { source: "vip_portal", rank: idx + 1 },
    });
  });

  const support = [
    ["portal_opened", 7.8],
    ["view_unit", 7.3],
    ["lead_form_shown", 6.9],
    ["lead_captured", 6.7],
    ["marketplace_visit", 6.4],
    ["filter_units", 6.2],
    ["cta_browse", 5.8],
    ["language_switch", 5.5],
    ["cta_explore", 5.1],
  ];
  support.forEach(([event, daysAgo], idx) => {
    const useCard = cards[(idx + 2) % cards.length];
    push(`ev_${regionId}_mix_${idx + 1}`, daysAgo, {
      event,
      portalType: idx < 4 ? "registered" : "anonymous",
      ...(idx < 4 && { userName: fam1 }),
      ...(idx >= 4 && { sessionId: `${regionId}_sess_${idx + 1}` }),
      unitName: useCard.unitName,
      unitType: useCard.unitType,
      tower: useCard.tower,
      metadata: { source: "marketplace" },
    });
  });

  return events;
}

export function buildRealEstateSeed(baseTimeMs = Date.now(), regionId = "gulf") {
  const config = REGION_DATA[regionId] || REGION_DATA.gulf;
  const personas = getPersonas("real_estate", regionId);
  const cards = buildCards(baseTimeMs, regionId, config);
  const leads = buildLeads(baseTimeMs, regionId, config, personas);
  const deals = buildDeals(baseTimeMs, regionId, cards, config, personas);
  const campaigns = buildCampaigns(baseTimeMs, regionId, config);
  const events = buildEvents(baseTimeMs, regionId, cards, personas);
  return { cards, leads, deals, campaigns, events };
}

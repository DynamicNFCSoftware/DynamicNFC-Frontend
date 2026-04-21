import { getPersonas } from "../../config/regionConfig";

const SECTOR = "automotive";
const DAY_MS = 24 * 60 * 60 * 1000;
const toIso = (ms) => new Date(ms).toISOString();
const toSparkline = (value) => String(value).split(",").map((n) => Number(n.trim()));

const REGION_DATA = {
  gulf: {
    client: "Prestige Motors",
    location: "Riyadh",
    reps: [
      { id: "rep_gulf_auto_01", name: "Omar Al-Shehri" },
      { id: "rep_gulf_auto_02", name: "Faisal Al-Dossary" },
    ],
    cards: [
      ["AU-GULF-001", "Mercedes-AMG GT 63 S", "AMG Performance", "coupe", 895000, "reserved", 156, 42, 3, 28, 3, "10,14,18,24,22,30,38", "630HP · 0-60 in 3.1s · V8 Biturbo", 0, "Ijarah SAR 14,500/mo · 36mo"],
      ["AU-GULF-002", "Mercedes-AMG G 63", "AMG Performance", "suv", 1250000, "available", 189, 48, 4, 34, 4, "12,16,22,28,26,34,45", "585HP · MANUFAKTUR · Most-requested", 0, "Ijarah SAR 19,800/mo · 36mo"],
      ["AU-GULF-003", "Mercedes-Maybach GLS 600", "Maybach Luxury", "suv", 1150000, "available", 124, 30, 2, 22, 2, "7,10,14,18,16,22,28", "550HP · Chauffeur Package · 4 Seats", 1, "Ijarah SAR 18,200/mo · 48mo"],
      ["AU-GULF-004", "Mercedes-Benz S 580 4MATIC", "Executive Sedan", "sedan", 680000, "available", 92, 22, 2, 17, 2, "5,8,12,15,13,18,23", "510HP · Executive Rear · V8", 1, "Ijarah SAR 11,800/mo · 48mo"],
      ["AU-GULF-005", "Mercedes-AMG SL 63", "AMG Performance", "roadster", 950000, "available", 68, 14, 1, 12, 1, "4,6,9,12,10,14,18", "585HP · Convertible · AMG Active Ride", 0, "Ijarah SAR 15,400/mo · 36mo"],
      ["AU-GULF-006", "Mercedes-Maybach S 680", "Maybach Luxury", "sedan", 1450000, "available", 58, 12, 1, 10, 1, "3,5,8,11,9,13,17", "621HP · V12 · First-Class Rear", 1, "Ijarah SAR 23,500/mo · 48mo"],
      ["AU-GULF-007", "Mercedes-AMG C 63 S E-Performance", "AMG Performance", "sedan", 520000, "available", 48, 9, 0, 7, 0, "2,4,6,8,6,10,14", "671HP · Hybrid · Plug-in", 0, "Ijarah SAR 8,900/mo · 48mo"],
      ["AU-GULF-008", "Mercedes-EQS 580 4MATIC", "Electric", "sedan", 720000, "available", 14, 2, 0, 3, 0, "1,2,1,3,2,2,4", "516HP · 450mi Range · Electric", 1, "Ijarah SAR 12,200/mo · 48mo"],
    ],
  },
  usa: {
    client: "Premier Auto Group",
    location: "Beverly Hills",
    reps: [
      { id: "rep_usa_auto_01", name: "Brandon Mitchell" },
      { id: "rep_usa_auto_02", name: "Alexis Rivera" },
    ],
    cards: [
      ["AU-USA-001", "Porsche 911 Turbo S", "Porsche Performance", "coupe", 265000, "reserved", 172, 44, 5, 32, 4, "11,16,20,26,24,34,42", "640HP · 0-60 in 2.6s · AWD", 0, "Lease $3,850/mo · 36mo"],
      ["AU-USA-002", "Lamborghini Urus Performante", "Lamborghini", "suv", 310000, "available", 198, 52, 4, 36, 4, "13,18,24,30,28,38,48", "657HP · 0-60 in 3.1s · V8 Twin-Turbo", 0, "Lease $4,480/mo · 36mo"],
      ["AU-USA-003", "Range Rover SV", "Range Rover", "suv", 220000, "available", 134, 32, 3, 24, 3, "8,12,16,21,19,26,32", "523HP · 5.0L V8 · SV Bespoke", 1, "Lease $2,980/mo · 48mo"],
      ["AU-USA-004", "Porsche Taycan Turbo S", "Porsche Performance", "sedan", 195000, "available", 105, 26, 2, 19, 2, "6,10,14,17,15,21,26", "750HP · 0-60 in 2.4s · Electric", 0, "Lease $2,790/mo · 48mo"],
      ["AU-USA-005", "Lamborghini Huracan Tecnica", "Lamborghini", "coupe", 245000, "available", 82, 16, 1, 14, 1, "5,8,11,14,12,17,22", "631HP · 0-60 in 3.2s · V10", 0, "Lease $3,520/mo · 36mo"],
      ["AU-USA-006", "Porsche Cayenne Turbo GT", "Porsche Performance", "suv", 185000, "available", 72, 14, 1, 12, 1, "4,7,10,13,11,15,19", "650HP · Ring Record Holder", 1, "Lease $2,680/mo · 48mo"],
      ["AU-USA-007", "Range Rover Sport SV", "Range Rover", "suv", 178000, "available", 52, 10, 0, 8, 0, "3,5,7,9,7,11,15", "626HP · Carbon Ceramic Brakes", 1, "Lease $2,540/mo · 48mo"],
      ["AU-USA-008", "Lamborghini Revuelto", "Lamborghini", "coupe", 625000, "available", 18, 3, 0, 4, 0, "2,1,2,3,2,2,6", "1,001HP · V12 Plug-in Hybrid · Halo car", 0, "Lease $8,950/mo · 36mo"],
    ],
  },
  mexico: {
    client: "Autos Premiere",
    location: "Polanco, CDMX",
    reps: [
      { id: "rep_mex_auto_01", name: "Ricardo Vazquez" },
      { id: "rep_mex_auto_02", name: "Isabella Ortiz" },
    ],
    cards: [
      ["AU-MEX-001", "BMW X7 M60i", "BMW M", "suv", 3290000, "reserved", 142, 36, 4, 26, 3, "9,13,17,22,20,28,35", "523HP · 7 Seats · xDrive", 0, "Lease MX$48,500/mo · 48mo"],
      ["AU-MEX-002", "Audi RS Q8", "Audi Sport", "suv", 2850000, "available", 168, 42, 4, 30, 4, "11,15,20,26,24,32,40", "591HP · 0-60 in 3.7s · V8", 1, "Lease MX$42,000/mo · 48mo"],
      ["AU-MEX-003", "BMW M8 Gran Coupe", "BMW M", "coupe", 3550000, "available", 112, 28, 3, 21, 3, "7,11,15,18,16,22,28", "617HP · Twin-Turbo V8 · M xDrive", 0, "Lease MX$52,500/mo · 48mo"],
      ["AU-MEX-004", "Audi e-tron GT RS", "Audi Sport", "sedan", 2650000, "available", 88, 20, 2, 16, 2, "5,8,12,15,13,18,22", "637HP · 0-60 in 3.1s · Electric", 1, "Lease MX$39,000/mo · 48mo"],
      ["AU-MEX-005", "BMW M5 Competition", "BMW M", "sedan", 2480000, "available", 72, 15, 1, 12, 1, "4,7,10,13,11,15,19", "617HP · 0-60 in 3.2s · M xDrive", 0, "Lease MX$36,500/mo · 48mo"],
      ["AU-MEX-006", "Audi RS 7 Sportback", "Audi Sport", "sedan", 2280000, "available", 62, 12, 1, 10, 1, "3,6,8,11,9,13,17", "591HP · Quattro · Sport Differential", 1, "Lease MX$33,800/mo · 48mo"],
      ["AU-MEX-007", "BMW X5 M Competition", "BMW M", "suv", 2380000, "available", 48, 9, 0, 7, 0, "2,4,6,8,6,10,14", "617HP · M Differential · M Sport", 0, "Lease MX$35,500/mo · 48mo"],
      ["AU-MEX-008", "Audi R8 Performance", "Audi Sport", "coupe", 4200000, "available", 12, 1, 0, 3, 0, "1,0,2,3,1,2,3", "610HP · V10 · Last production year", 1, "Lease MX$62,500/mo · 36mo"],
    ],
  },
  canada: {
    client: "Prestige Motors Vancouver",
    location: "Vancouver, BC",
    reps: [
      { id: "rep_can_auto_01", name: "Ethan Chen" },
      { id: "rep_can_auto_02", name: "Chloe Thompson" },
    ],
    cards: [
      ["AU-CAN-001", "Porsche Taycan Turbo S", "Porsche Electric", "sedan", 285000, "reserved", 148, 38, 4, 28, 3, "10,14,19,24,22,30,38", "750HP · 0-60 in 2.4s · 280mi Range", 0, "Lease CA$4,150/mo · 48mo"],
      ["AU-CAN-002", "Audi RS e-tron GT", "Audi e-tron", "sedan", 195000, "available", 168, 42, 4, 31, 4, "11,16,21,27,25,33,41", "637HP · 232mi Range · Quattro", 0, "Lease CA$2,880/mo · 48mo"],
      ["AU-CAN-003", "Porsche Cayenne Turbo GT", "Porsche Performance", "suv", 265000, "available", 108, 26, 3, 20, 3, "7,11,14,18,16,22,28", "650HP · Ring Record · Incl. Lux Tax", 1, "Lease CA$3,880/mo · 48mo"],
      ["AU-CAN-004", "Audi RS Q8", "Audi Sport", "suv", 218000, "available", 92, 22, 2, 18, 2, "6,9,13,16,14,20,25", "591HP · 0-60 in 3.7s · V8", 1, "Lease CA$3,220/mo · 48mo"],
      ["AU-CAN-005", "Porsche 911 GT3", "Porsche Performance", "coupe", 245000, "available", 78, 16, 1, 13, 1, "5,8,11,14,12,17,21", "502HP · Naturally Aspirated · Track", 0, "Lease CA$3,620/mo · 36mo"],
      ["AU-CAN-006", "Audi RS 6 Avant", "Audi Sport", "wagon", 158000, "available", 68, 14, 1, 11, 1, "4,7,9,12,10,14,18", "591HP · Performance Wagon · Quattro", 1, "Lease CA$2,340/mo · 48mo"],
      ["AU-CAN-007", "Porsche Macan GTS", "Porsche Performance", "suv", 102000, "available", 52, 10, 0, 8, 0, "3,5,7,9,7,11,14", "434HP · PDK 7-speed · Sport Chrono", 1, "Lease CA$1,520/mo · 48mo"],
      ["AU-CAN-008", "Audi e-tron Sportback", "Audi e-tron", "suv", 125000, "available", 16, 2, 0, 4, 0, "1,2,1,3,1,2,6", "402HP · 218mi Range · Quattro", 0, "Lease CA$1,850/mo · 48mo"],
    ],
  },
};

function buildCards(baseTimeMs, regionId, config) {
  return config.cards.map((row, index) => {
    const [id, vehicleName, collection, vehicleType, pricing, status, views, downloads, bookings, totalTaps, interestedVips, sparkline, highlight, repIndex, paymentPlan] = row;
    const rep = config.reps[repIndex] || config.reps[0];
    return {
      id,
      name: vehicleName,
      vehicleName,
      unitName: vehicleName,
      vehicleType,
      unitType: vehicleType,
      collection,
      tower: collection,
      type: vehicleType,
      location: config.location,
      status,
      pricing,
      price: pricing,
      views,
      downloads,
      bookings,
      totalTaps,
      lastTapAt: toIso(baseTimeMs - (index + 1) * 5 * 60 * 60 * 1000),
      interestedVips,
      sparkline: toSparkline(sparkline),
      campaignId: `camp_${regionId}_auto_${(index % 3) + 1}`,
      linkedCampaignId: `camp_${regionId}_auto_${(index % 3) + 1}`,
      linkedDealCount: index < 4 ? 1 : 0,
      assignedRepId: rep.id,
      assignedRepName: rep.name,
      highlight,
      paymentPlan,
      createdAt: toIso(baseTimeMs - (30 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (index % 2) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildLeads(baseTimeMs, regionId, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1");
  const vip2 = personas.find((p) => p.id === "vip2");
  return [
    { id: `lead_${regionId}_auto_vip1`, name: vip1?.name || "VIP Collector", email: vip1?.email || "", phone: "", source: "nfc_card", status: "qualified", assignedRep: config.reps[0].id, score: 93, createdAt: toIso(baseTimeMs - 8 * DAY_MS), updatedAt: toIso(baseTimeMs - 1 * DAY_MS), lastContactAt: toIso(baseTimeMs - 1.2 * DAY_MS), notes: "Strong purchase intent, requested private viewing.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_auto_vip2`, name: vip2?.name || "VIP Client", email: vip2?.email || "", phone: "", source: "event", status: "qualified", assignedRep: config.reps[1].id, score: 81, createdAt: toIso(baseTimeMs - 7 * DAY_MS), updatedAt: toIso(baseTimeMs - 2 * DAY_MS), lastContactAt: toIso(baseTimeMs - 1.8 * DAY_MS), notes: "Finance discussion active.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_auto_warm`, name: "Walk-in Prospect", email: "", phone: "", source: "walkin", status: "contacted", assignedRep: config.reps[1].id, score: 68, createdAt: toIso(baseTimeMs - 5 * DAY_MS), updatedAt: toIso(baseTimeMs - 2.5 * DAY_MS), lastContactAt: toIso(baseTimeMs - 2.5 * DAY_MS), notes: "Needs follow-up test drive.", sector: SECTOR, region: regionId },
    { id: `lead_${regionId}_auto_new`, name: "Digital Prospect", email: "", phone: "", source: "marketplace", status: "new", assignedRep: config.reps[0].id, score: 52, createdAt: toIso(baseTimeMs - 2.5 * DAY_MS), updatedAt: toIso(baseTimeMs - 0.7 * DAY_MS), lastContactAt: toIso(baseTimeMs - 0.7 * DAY_MS), notes: "Lead captured from listing CTA.", sector: SECTOR, region: regionId },
  ];
}

function buildDeals(baseTimeMs, regionId, cards, config, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Collector";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Client";
  const templates = [
    { stage: "negotiation", score: 90, velocity: 9, probability: 0.82, atRisk: false, leadName: vip1, triggers: ["test_drive_request", "request_pricing"] },
    { stage: "viewing_scheduled", score: 79, velocity: 13, probability: 0.67, atRisk: false, leadName: vip2, triggers: ["comparison_view", "download_brochure"] },
    { stage: "comparison", score: 69, velocity: 20, probability: 0.54, atRisk: false, leadName: "Walk-in Prospect", triggers: ["view_unit", "explore_payment_plan"] },
    { stage: "contacted", score: 56, velocity: 28, probability: 0.35, atRisk: true, leadName: "Digital Prospect", triggers: ["lead_captured", "cta_explore"] },
  ];
  return templates.map((tpl, index) => {
    const card = cards[index];
    return {
      id: `deal_${regionId}_auto_${index + 1}`,
      name: `${tpl.leadName} - ${card.vehicleName}`,
      title: `${card.vehicleName} - ${tpl.leadName}`,
      leadName: tpl.leadName,
      item: card.vehicleName,
      unitName: card.vehicleName,
      value: card.pricing,
      stage: tpl.stage,
      score: tpl.score,
      velocity: tpl.velocity,
      probability: tpl.probability,
      triggers: tpl.triggers,
      atRisk: tpl.atRisk,
      vipLinked: index < 2,
      campaignId: `camp_${regionId}_auto_${(index % 3) + 1}`,
      assignedRep: index % 2 === 0 ? config.reps[0].id : config.reps[1].id,
      createdAt: toIso(baseTimeMs - (8 - index) * DAY_MS),
      updatedAt: toIso(baseTimeMs - (1.8 - index * 0.3) * DAY_MS),
      lastSeen: toIso(baseTimeMs - (1.2 - index * 0.2) * DAY_MS),
      expectedCloseAt: toIso(baseTimeMs + (12 + index * 6) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildCampaigns(baseTimeMs, regionId, config, cards) {
  const set = [
    ["camp_" + regionId + "_auto_1", `${config.client} Elite Circle`, "active", "email", "test_drive_conversion", "existing_vip_owners", 120000, 62000, 360, 245, 102, 14, 26],
    ["camp_" + regionId + "_auto_2", `${config.client} Private Collection Drive`, "active", "event", "showroom_footfall", "hot_leads", 82000, 35500, 220, 150, 71, 9, 19],
    ["camp_" + regionId + "_auto_3", `${config.client} Spring Launch Preview`, "draft", "sms", "early_interest", "waitlist", 42000, 0, 0, 0, 0, 0, 3],
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
      totalCards: cardIds.length + 4,
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
      endDate: status === "draft" ? null : toIso(baseTimeMs + (30 - index * 4) * DAY_MS),
      createdAt: toIso(baseTimeMs - (daysAgo + 3) * DAY_MS),
      sector: SECTOR,
      region: regionId,
    };
  });
}

function buildEvents(baseTimeMs, regionId, cards, personas) {
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Collector";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Client";
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
  const seq1 = ["portal_opened", "view_unit", "comparison_view", "explore_payment_plan", "download_brochure", "request_pricing", "book_viewing", "roi_calculator_click", "cta_booking", "contact_advisor"];
  const seq2 = ["portal_opened", "view_unit", "view_floorplan", "comparison_view", "download_brochure", "request_pricing", "book_viewing", "cta_explore", "language_switch"];
  seq1.forEach((event, idx) => {
    const car = cards[idx % 3];
    push(`ev_${regionId}_auto_v1_${idx + 1}`, 8.8 - idx * 0.65, { event, portalType: "vip", vipName: vip1, unitName: car.vehicleName, unitType: car.vehicleType, tower: car.collection, metadata: { collection: car.collection } });
  });
  seq2.forEach((event, idx) => {
    const car = cards[(idx + 2) % 4];
    push(`ev_${regionId}_auto_v2_${idx + 1}`, 8.5 - idx * 0.6, { event, portalType: "vip", vipName: vip2, unitName: car.vehicleName, unitType: car.vehicleType, tower: car.collection, metadata: { collection: car.collection } });
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
    ["portal_opened", "anonymous"],
  ];
  tail.forEach(([event, portalType], idx) => {
    const car = cards[(idx + 4) % cards.length];
    push(`ev_${regionId}_auto_tail_${idx + 1}`, 4.6 - idx * 0.38, {
      event,
      portalType,
      ...(portalType === "registered" && { userName: "Walk-in Prospect" }),
      ...(portalType === "lead" && { leadName: "Digital Prospect" }),
      ...(portalType === "anonymous" && { sessionId: `${regionId}_auto_sess_${idx + 1}` }),
      unitName: car.vehicleName,
      unitType: car.vehicleType,
      tower: car.collection,
      metadata: { source: "marketplace" },
    });
  });
  return events;
}

export function buildAutomotiveSeed(baseTimeMs = Date.now(), regionId = "gulf") {
  const config = REGION_DATA[regionId] || REGION_DATA.gulf;
  const personas = getPersonas("automotive", regionId);
  const cards = buildCards(baseTimeMs, regionId, config);
  const leads = buildLeads(baseTimeMs, regionId, config, personas);
  const deals = buildDeals(baseTimeMs, regionId, cards, config, personas);
  const campaigns = buildCampaigns(baseTimeMs, regionId, config, cards);
  const events = buildEvents(baseTimeMs, regionId, cards, personas);
  return { cards, leads, deals, campaigns, events };
}

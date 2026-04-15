import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { getPersonas } from "../config/regionConfig";

const SEED_VERSION = 1;
const SCHEMA_VERSION = 1;
const LAST_ACTIVITY_THROTTLE_MS = 60 * 60 * 1000;
const lastActivityWriteByUid = new Map();

const SUBCOLLECTIONS = ["events", "leads", "deals", "campaigns", "settings"];

const toIso = (date) => new Date(date).toISOString();

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function buildSeedPayload(baseTimeMs, regionId = "gulf", sectorId = "real_estate") {
  const personas = getPersonas(sectorId, regionId);
  const vip1 = personas.find((p) => p.id === "vip1")?.name || "VIP Investor";
  const vip2 = personas.find((p) => p.id === "vip2")?.name || "VIP Buyer";
  const fam1 = personas.find((p) => p.id === "fam1")?.name || "Family Buyer";
  const firstName = (name) => (name || "").split(" ")[0];

  const events = [];
  const pushEvent = (id, daysAgo, payload) => {
    events.push({
      id,
      ...payload,
      timestamp: toIso(baseTimeMs - daysAgo * 24 * 60 * 60 * 1000),
    });
  };

  pushEvent("ev_kh_01", 9, {
    event: "portal_opened",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
    metadata: { duration: 95 },
  });
  pushEvent("ev_kh_02", 8.5, {
    event: "view_unit",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_03", 8, {
    event: "view_unit",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse B",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_04", 7.5, {
    event: "request_pricing",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse B",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_05", 7, {
    event: "comparison_view",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_06", 6.5, {
    event: "explore_payment_plan",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_07", 6, {
    event: "download_brochure",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
  });
  pushEvent("ev_kh_08", 5.5, {
    event: "book_viewing",
    portalType: "vip",
    vipName: vip1,
    unitName: "Sky Penthouse A",
    unitType: "penthouse",
    tower: "Al Qamar",
  });

  pushEvent("ev_fa_01", 9, {
    event: "portal_opened",
    portalType: "vip",
    vipName: vip2,
    unitName: "Royal 3BR A",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_02", 8.5, {
    event: "view_unit",
    portalType: "vip",
    vipName: vip2,
    unitName: "Royal 3BR A",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_03", 8, {
    event: "view_unit",
    portalType: "vip",
    vipName: vip2,
    unitName: "Royal 3BR B",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_04", 7.2, {
    event: "view_unit",
    portalType: "vip",
    vipName: vip2,
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_05", 6.6, {
    event: "request_pricing",
    portalType: "vip",
    vipName: vip2,
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_06", 6, {
    event: "comparison_view",
    portalType: "vip",
    vipName: vip2,
    unitName: "Royal 3BR B",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_07", 5.2, {
    event: "download_brochure",
    portalType: "vip",
    vipName: vip2,
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Safwa",
  });
  pushEvent("ev_fa_08", 4.6, {
    event: "explore_payment_plan",
    portalType: "vip",
    vipName: vip2,
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Safwa",
  });

  pushEvent("ev_ah_01", 8, {
    event: "portal_opened",
    portalType: "registered",
    userName: fam1,
    unitName: "Marina 2BR A",
    unitType: "2br",
    tower: "Al Qamar",
  });
  pushEvent("ev_ah_02", 7.5, {
    event: "view_unit",
    portalType: "registered",
    userName: fam1,
    unitName: "Marina 2BR A",
    unitType: "2br",
    tower: "Al Qamar",
  });
  pushEvent("ev_ah_03", 7, {
    event: "view_unit",
    portalType: "registered",
    userName: fam1,
    unitName: "Marina 2BR B",
    unitType: "2br",
    tower: "Al Qamar",
  });
  pushEvent("ev_ah_04", 6.4, {
    event: "request_pricing",
    portalType: "registered",
    userName: fam1,
    unitName: "Marina 2BR B",
    unitType: "2br",
    tower: "Al Qamar",
  });

  pushEvent("ev_an_01", 8.8, {
    event: "portal_opened",
    portalType: "anonymous",
    sessionId: "anon_sess_001",
    unitName: "Studio Bay 1",
    unitType: "studio",
    tower: "Al Safwa",
  });
  pushEvent("ev_an_02", 8.5, {
    event: "view_unit",
    portalType: "anonymous",
    sessionId: "anon_sess_001",
    unitName: "Studio Bay 1",
    unitType: "studio",
    tower: "Al Safwa",
  });
  pushEvent("ev_an_03", 7.1, {
    event: "portal_opened",
    portalType: "anonymous",
    sessionId: "anon_sess_002",
    unitName: "Marina 2BR A",
    unitType: "2br",
    tower: "Al Qamar",
  });
  pushEvent("ev_an_04", 6.9, {
    event: "view_unit",
    portalType: "anonymous",
    sessionId: "anon_sess_002",
    unitName: "Marina 2BR A",
    unitType: "2br",
    tower: "Al Qamar",
  });
  pushEvent("ev_an_05", 6.3, {
    event: "portal_opened",
    portalType: "anonymous",
    sessionId: "anon_sess_003",
    unitName: "Royal 3BR B",
    unitType: "3br",
    tower: "Al Rawda",
  });
  pushEvent("ev_an_06", 6.1, {
    event: "view_unit",
    portalType: "anonymous",
    sessionId: "anon_sess_003",
    unitName: "Royal 3BR B",
    unitType: "3br",
    tower: "Al Rawda",
  });

  pushEvent("ev_lead_01", 7.2, {
    event: "portal_opened",
    portalType: "lead",
    leadName: firstName(vip2),
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Rawda",
  });
  pushEvent("ev_lead_02", 7, {
    event: "view_unit",
    portalType: "lead",
    leadName: firstName(vip2),
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Rawda",
  });
  pushEvent("ev_lead_03", 6.6, {
    event: "contact_advisor",
    portalType: "lead",
    leadName: firstName(vip2),
    unitName: "Garden 3BR",
    unitType: "3br",
    tower: "Al Rawda",
  });

  const leads = [
    {
      id: "lead_vip2",
      name: vip2,
      email: personas.find((p) => p.id === "vip2")?.email || "vip2@example.com",
      phone: "+971 50 123 4567",
      source: "website",
      status: "qualified",
      assignedRep: "rep1",
      score: 78,
      createdAt: toIso(baseTimeMs - 9 * 24 * 60 * 60 * 1000),
      lastContactAt: toIso(baseTimeMs - 2 * 24 * 60 * 60 * 1000),
      notes: "Interested in 3BR family units.",
    },
    {
      id: "lead_fam1",
      name: fam1,
      email: personas.find((p) => p.id === "fam1")?.email || "family@example.com",
      phone: "+971 52 400 1122",
      source: "event",
      status: "contacted",
      assignedRep: "rep2",
      score: 62,
      createdAt: toIso(baseTimeMs - 8 * 24 * 60 * 60 * 1000),
      lastContactAt: toIso(baseTimeMs - 3 * 24 * 60 * 60 * 1000),
      notes: "Comparing 2BR options in North Tower.",
    },
    {
      id: "lead_new",
      name: "Yousef Karim",
      email: "yousef@example.com",
      phone: "+971 54 009 1122",
      source: "nfc_card",
      status: "new",
      assignedRep: "rep1",
      score: 38,
      createdAt: toIso(baseTimeMs - 2 * 24 * 60 * 60 * 1000),
      lastContactAt: toIso(baseTimeMs - 1 * 24 * 60 * 60 * 1000),
      notes: "First contact pending.",
    },
  ];

  const deals = [
    {
      id: "deal_khalid_penthouse",
      title: `Sky Penthouse A - ${firstName(vip1)}`,
      leadName: vip1,
      unitName: "Sky Penthouse A",
      value: 4500000,
      stage: "negotiation",
      probability: 0.7,
      assignedRep: "rep1",
      createdAt: toIso(baseTimeMs - 8 * 24 * 60 * 60 * 1000),
      expectedCloseAt: toIso(baseTimeMs + 21 * 24 * 60 * 60 * 1000),
    },
    {
      id: "deal_fatima_3br",
      title: `Garden 3BR - ${firstName(vip2)}`,
      leadName: vip2,
      unitName: "Garden 3BR",
      value: 2800000,
      stage: "viewing_scheduled",
      probability: 0.5,
      assignedRep: "rep2",
      createdAt: toIso(baseTimeMs - 5 * 24 * 60 * 60 * 1000),
      expectedCloseAt: toIso(baseTimeMs + 28 * 24 * 60 * 60 * 1000),
    },
    {
      id: "deal_sara_3br",
      title: `Garden 3BR - ${firstName(vip2)}`,
      leadName: vip2,
      unitName: "Garden 3BR",
      value: 1200000,
      stage: "inquiry",
      probability: 0.3,
      assignedRep: "rep2",
      createdAt: toIso(baseTimeMs - 6 * 24 * 60 * 60 * 1000),
      expectedCloseAt: toIso(baseTimeMs + 35 * 24 * 60 * 60 * 1000),
    },
    {
      id: "deal_ahmed_2br",
      title: `Marina 2BR - ${firstName(fam1)}`,
      leadName: fam1,
      unitName: "Marina 2BR A",
      value: 1800000,
      stage: "contacted",
      probability: 0.4,
      assignedRep: "rep1",
      createdAt: toIso(baseTimeMs - 7 * 24 * 60 * 60 * 1000),
      expectedCloseAt: toIso(baseTimeMs + 42 * 24 * 60 * 60 * 1000),
    },
  ];

  const campaigns = [
    {
      id: "camp_vip_winter_access",
      name: "Vista VIP Winter Access",
      type: "email",
      status: "active",
      audience: "high_intent_vips",
      sent: 24,
      opened: 18,
      clicked: 12,
      converted: 3,
      startDate: toIso(baseTimeMs - 30 * 24 * 60 * 60 * 1000),
      endDate: null,
      client: "Vista Residences",
      totalCards: 24,
      activeCards: 18,
    },
    {
      id: "camp_penthouse_concierge",
      name: "Penthouse Concierge",
      type: "event",
      status: "completed",
      audience: "vip_penthouse_interest",
      sent: 12,
      opened: 11,
      clicked: 7,
      converted: 2,
      startDate: toIso(baseTimeMs - 60 * 24 * 60 * 60 * 1000),
      endDate: toIso(baseTimeMs - 25 * 24 * 60 * 60 * 1000),
      client: "Vista Residences",
      totalCards: 12,
      activeCards: 11,
    },
    {
      id: "camp_payment_plan_priority",
      name: "Payment Plan Priority",
      type: "sms",
      status: "draft",
      audience: "family_buyers",
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: toIso(baseTimeMs + 2 * 24 * 60 * 60 * 1000),
      endDate: null,
      client: "Vista Residences",
      totalCards: 18,
      activeCards: 0,
    },
  ];

  const settings = {
    language: "en",
    theme: "light",
    currency: "AED",
    notifications: true,
  };

  return { events, leads, deals, campaigns, settings };
}

async function clearTenantSubcollections(uid) {
  let batch = writeBatch(db);
  let opCount = 0;
  const flush = async () => {
    if (opCount === 0) return;
    await batch.commit();
    batch = writeBatch(db);
    opCount = 0;
  };

  for (const sub of SUBCOLLECTIONS) {
    const snap = await getDocs(collection(db, "tenants", uid, sub));
    for (const d of snap.docs) {
      batch.delete(d.ref);
      opCount += 1;
      if (opCount >= 450) {
        // Keep well below Firestore's 500-op batch cap.
        await flush();
      }
    }
  }
  await flush();
}

export async function checkTenantExists(uid) {
  const tenantSnap = await getDoc(doc(db, "tenants", uid));
  if (!tenantSnap.exists()) {
    console.log("[TENANT CHECK] Checking tenant for uid:", uid, "exists:", false, "seedComplete:", false);
    return { exists: false, seedComplete: false };
  }
  const data = tenantSnap.data() || {};
  const result = { exists: true, seedComplete: !!data.seedComplete };
  console.log("[TENANT CHECK] Checking tenant for uid:", uid, "exists:", result.exists, "seedComplete:", result.seedComplete);
  return result;
}

export async function seedTenantData(uid, userInfo = {}, regionId = "gulf") {
  console.log("[TENANT SEED] Starting seed for uid:", uid, "region:", regionId);
  try {
    const tenantRef = doc(db, "tenants", uid);
    const existingSnap = await getDoc(tenantRef);
    const existingData = existingSnap.exists() ? existingSnap.data() || {} : null;

    if (existingData && existingData.seedComplete === true) {
      return { seeded: false, reason: "already_seeded" };
    }

    if (existingData && existingData.seedComplete === false) {
      await clearTenantSubcollections(uid);
    }

    await setDoc(
      tenantRef,
      {
        email: userInfo.email || "",
        displayName: userInfo.displayName || userInfo.email || "User",
        createdAt: existingData?.createdAt || serverTimestamp(),
        lastActivity: serverTimestamp(),
        seedVersion: SEED_VERSION,
        seedComplete: false,
        schemaVersion: SCHEMA_VERSION,
        cleanupEligible: true,
        pendingDeletionAt: null,
      },
      { merge: true }
    );

    const { events, leads, deals, campaigns, settings } = buildSeedPayload(Date.now(), regionId);
    const batch = writeBatch(db);

    events.forEach((row) => {
      const ref = doc(db, "tenants", uid, "events", row.id || slugify(`${row.portalType}-${row.timestamp}`));
      batch.set(ref, row, { merge: true });
    });
    leads.forEach((row) => {
      const ref = doc(db, "tenants", uid, "leads", row.id || slugify(row.name));
      batch.set(ref, row, { merge: true });
    });
    deals.forEach((row) => {
      const ref = doc(db, "tenants", uid, "deals", row.id || slugify(row.title));
      batch.set(ref, row, { merge: true });
    });
    campaigns.forEach((row) => {
      const ref = doc(db, "tenants", uid, "campaigns", row.id || slugify(row.name));
      batch.set(ref, row, { merge: true });
    });
    batch.set(doc(db, "tenants", uid, "settings", "preferences"), settings, { merge: true });

    await batch.commit();
    await setDoc(
      tenantRef,
      {
        seedComplete: true,
        seedVersion: SEED_VERSION,
        schemaVersion: SCHEMA_VERSION,
        lastActivity: serverTimestamp(),
        pendingDeletionAt: null,
      },
      { merge: true }
    );

    console.log("[TENANT SEED] Seed completed successfully for uid:", uid);
    return { seeded: true };
  } catch (error) {
    console.error("[TENANT SEED] Seed FAILED for uid:", uid, error);
    throw error;
  }
}

export async function updateLastActivity(uid, options = {}) {
  const force = !!options.force;
  const now = Date.now();
  const last = lastActivityWriteByUid.get(uid) || 0;
  if (!force && now - last < LAST_ACTIVITY_THROTTLE_MS) return { skipped: true };
  await setDoc(
    doc(db, "tenants", uid),
    {
      lastActivity: serverTimestamp(),
      pendingDeletionAt: null,
    },
    { merge: true }
  );
  lastActivityWriteByUid.set(uid, now);
  return { skipped: false };
}

export async function resetToDemo(uid, userInfo = {}, regionId = "gulf") {
  await setDoc(doc(db, "tenants", uid), { seedComplete: false }, { merge: true });
  await clearTenantSubcollections(uid);
  return seedTenantData(uid, userInfo, regionId);
}

export async function getTenantSettings(uid) {
  const snap = await getDoc(doc(db, "tenants", uid, "settings", "preferences"));
  if (!snap.exists()) {
    return { language: "en", theme: "light", currency: "AED", notifications: true };
  }
  return { language: "en", theme: "light", currency: "AED", notifications: true, ...snap.data() };
}

export async function updateTenantSettings(uid, updates) {
  await setDoc(doc(db, "tenants", uid, "settings", "preferences"), updates, { merge: true });
  await updateLastActivity(uid);
}

/* Single source of truth: stage → probability mapping */
const PROBABILITY_BY_STAGE = {
  inquiry: 0.2,
  new_lead: 0.2,
  contacted: 0.35,
  viewing_scheduled: 0.5,
  viewing_done: 0.55,
  test_drive: 0.5,
  quote_sent: 0.6,
  negotiation: 0.7,
  offer_sent: 0.8,
  financing: 0.75,
  closed_won: 1,
  closed_lost: 0,
};

export async function createTenantDeal(uid, payload) {
  const leadName = String(payload?.name || "").trim();
  if (!leadName) {
    throw new Error("Lead name is required");
  }

  const unitName = String(payload?.item || "").trim();
  const categoryId = String(payload?.categoryId || "").trim();
  const categoryName = String(payload?.categoryName || "").trim();
  const campaignId = String(payload?.campaignId || "").trim();
  const value = Number(payload?.value || 0);
  const stage = String(payload?.stage || "inquiry");

  const title = unitName ? `${unitName} - ${leadName}` : leadName;
  const docRef = await addDoc(collection(db, "tenants", uid, "deals"), {
    title,
    leadName,
    unitName: unitName || "",
    categoryId: categoryId || "",
    categoryName: categoryName || "",
    campaignId: campaignId || "",
    value: Number.isFinite(value) ? value : 0,
    stage,
    probability: PROBABILITY_BY_STAGE[stage] ?? 0.2,
    assignedRep: "",
    createdAt: serverTimestamp(),
    expectedCloseAt: null,
    source: payload?.source || "manual",
  });
  await updateLastActivity(uid);
  return docRef.id;
}

export async function updateTenantDealStage(uid, dealId, stage, fromStage) {
  if (!dealId || !stage) return;
  await setDoc(
    doc(db, "tenants", uid, "deals", dealId),
    {
      stage,
      probability: PROBABILITY_BY_STAGE[stage] ?? 0.2,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  // Audit trail: log stage transition
  try {
    await addDoc(collection(db, "tenants", uid, "deals", dealId, "transitions"), {
      fromStage: fromStage || null,
      toStage: stage,
      timestamp: serverTimestamp(),
      probability: PROBABILITY_BY_STAGE[stage] ?? 0.2,
    });
  } catch (err) {
    console.warn("[tenantService] Audit trail write failed:", err);
  }
  await updateLastActivity(uid);
}

/* ═══════════════════ Campaign CRUD ═══════════════════ */

const VALID_CAMPAIGN_TRANSITIONS = {
  draft: ["active"],
  active: ["paused", "archived"],
  paused: ["active", "archived"],
  archived: [],
};

/**
 * Create a new tenant campaign with idempotency support.
 */
export async function createTenantCampaign(uid, payload) {
  if (!uid) throw new Error("uid required");
  const campaignsRef = collection(db, "tenants", uid, "campaigns");

  // Idempotency check
  if (payload.idempotencyKey) {
    const existingQ = query(
      campaignsRef,
      where("idempotencyKey", "==", payload.idempotencyKey),
      limit(1)
    );
    const existing = await getDocs(existingQ);
    if (!existing.empty) return existing.docs[0].id;
  }

  const name = String(payload.name || "").trim();
  if (!name || name.length < 3) throw new Error("Campaign name must be at least 3 characters");
  if (name.length > 80) throw new Error("Campaign name must be at most 80 characters");

  const now = serverTimestamp();
  const campaignData = {
    name,
    nameNormalized: name.toLowerCase(),
    status: payload.status || "draft",
    client: payload.client || "",
    source: payload.source || "manual",
    // Strategic context fields
    description: payload.description || "",
    objective: payload.objective || "",          // lead_gen | awareness | re_engage | event
    targetAudience: payload.targetAudience || "", // vip | warm | cold | all
    channel: payload.channel || [],               // ["nfc","email","sms","whatsapp","event","mixed"]
    // Card linkage
    totalCards: Number(payload.totalCards || 0),
    activeCards: Number(payload.activeCards || 0),
    cardIds: payload.cardIds || [],
    // Performance counters
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    // Dates
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    // Budget
    budget: Number(payload.budget || 0) || 0,
    spent: 0,
    // System
    idempotencyKey: payload.idempotencyKey || null,
    createdAt: now,
    updatedAt: now,
    createdBy: uid,
    updatedBy: uid,
  };

  const docRef = await addDoc(campaignsRef, campaignData);

  // Audit trail
  try {
    await addDoc(collection(db, "tenants", uid, "campaigns", docRef.id, "audit"), {
      type: "created",
      timestamp: now,
      actor: uid,
      details: { name, status: campaignData.status, source: campaignData.source },
    });
  } catch (err) {
    console.warn("[tenantService] Campaign audit write failed:", err);
  }

  await updateLastActivity(uid);
  return docRef.id;
}

/**
 * Duplicate an existing campaign as a new draft.
 * Copies: name (+ " Copy"), client, description, objective, audience, channel, budget.
 * Does NOT copy: cards, audit, performance counters, status (always draft).
 */
export async function duplicateTenantCampaign(uid, campaignId) {
  if (!uid || !campaignId) throw new Error("uid and campaignId required");
  const campaignSnap = await getDoc(doc(db, "tenants", uid, "campaigns", campaignId));
  if (!campaignSnap.exists()) throw new Error("Campaign not found");
  const original = campaignSnap.data();
  return createTenantCampaign(uid, {
    name: `${original.name || "Campaign"} Copy`,
    client: original.client || "",
    description: original.description || "",
    objective: original.objective || "",
    targetAudience: original.targetAudience || "",
    channel: original.channel || [],
    budget: original.budget || 0,
    startDate: null,
    endDate: null,
    source: "manual",
    status: "draft",
  });
}

/**
 * Update a tenant campaign (rename, lifecycle status change, or general update).
 */
export async function updateTenantCampaign(uid, campaignId, updates) {
  if (!uid || !campaignId) throw new Error("uid and campaignId required");
  const campaignRef = doc(db, "tenants", uid, "campaigns", campaignId);

  const payload = { ...updates, updatedAt: serverTimestamp(), updatedBy: uid };

  // Normalize name if provided
  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name || name.length < 3) throw new Error("Campaign name must be at least 3 characters");
    if (name.length > 80) throw new Error("Campaign name must be at most 80 characters");
    payload.name = name;
    payload.nameNormalized = name.toLowerCase();
  }

  // Status transition validation
  if (payload.status && payload._fromStatus) {
    const validNext = VALID_CAMPAIGN_TRANSITIONS[payload._fromStatus] || [];
    if (!validNext.includes(payload.status)) {
      throw new Error(`Invalid transition: ${payload._fromStatus} → ${payload.status}`);
    }
  }

  // Archive metadata
  if (payload.status === "archived") {
    payload.archivedAt = serverTimestamp();
    payload.archivedBy = uid;
  }

  const fromStatus = payload._fromStatus;
  delete payload._fromStatus;

  await setDoc(campaignRef, payload, { merge: true });

  // Audit trail
  let auditType = "updated";
  const details = {};
  if (updates.name !== undefined) {
    auditType = "renamed";
    details.newName = payload.name;
  }
  if (updates.status !== undefined) {
    auditType = updates.status === "archived" ? "archived" : "status_changed";
    details.fromStatus = fromStatus || null;
    details.toStatus = updates.status;
  }

  try {
    await addDoc(collection(db, "tenants", uid, "campaigns", campaignId, "audit"), {
      type: auditType,
      timestamp: serverTimestamp(),
      actor: uid,
      details,
    });
  } catch (err) {
    console.warn("[tenantService] Campaign audit write failed:", err);
  }

  await updateLastActivity(uid);
}

/**
 * Fetch audit trail for a campaign (latest N events).
 */
export async function getCampaignAudit(uid, campaignId, limitN = 5) {
  if (!uid || !campaignId) return [];
  const auditQ = query(
    collection(db, "tenants", uid, "campaigns", campaignId, "audit"),
    orderBy("timestamp", "desc"),
    limit(limitN)
  );
  const snap = await getDocs(auditQ);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ═══════════════════ Card Assignment / Status ═══════════════════ */

export async function updateCardAssignment(uid, cardId, assignment) {
  if (!uid || !cardId) throw new Error("uid and cardId required");
  await setDoc(
    doc(db, "tenants", uid, "cards", cardId),
    {
      assignedRepId: assignment.assignedRepId || "",
      assignedRepName: assignment.assignedRepName || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await updateLastActivity(uid);
}

export async function updateCardStatus(uid, cardId, newStatus) {
  if (!uid || !cardId) throw new Error("uid and cardId required");
  await setDoc(
    doc(db, "tenants", uid, "cards", cardId),
    {
      status: newStatus,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await updateLastActivity(uid);
}
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
import { buildRealEstateSeed } from "./seeds/realEstateSeed";
import { buildAutomotiveSeed } from "./seeds/automotiveSeed";
import { buildYachtSeed } from "./seeds/yachtSeed";

export const SEED_VERSION = "2.1-region-enriched";
const SCHEMA_VERSION = 1;
const LAST_ACTIVITY_THROTTLE_MS = 60 * 60 * 1000;
const lastActivityWriteByUid = new Map();

const SUBCOLLECTIONS = ["cards", "leads", "deals", "campaigns", "events"];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const sanitizeFirestoreRow = (row) =>
  Object.fromEntries(Object.entries(row || {}).filter(([, value]) => value !== undefined));

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

export async function checkTenantExists(uid, regionId = "gulf") {
  const tenantSnap = await getDoc(doc(db, "tenants", uid));
  if (!tenantSnap.exists()) {
    console.log("[TENANT CHECK] Checking tenant for uid:", uid, "exists:", false, "seedComplete:", false);
    return { exists: false, seedComplete: false, seedVersion: null, seedRegion: null, needsSeed: true };
  }
  const data = tenantSnap.data() || {};
  const seedComplete = !!data.seedComplete;
  const seedVersion = data.seedVersion ?? null;
  const seedRegion = data.seedRegion ?? null;
  const regionMismatch = seedRegion !== regionId;
  const needsSeed = !seedComplete || seedVersion !== SEED_VERSION || regionMismatch;
  const result = { exists: true, seedComplete, seedVersion, seedRegion, needsSeed };
  console.log(
    "[TENANT CHECK] uid:",
    uid,
    "exists:",
    true,
    "seedComplete:",
    seedComplete,
    "seedVersion:",
    seedVersion,
    "seedRegion:",
    seedRegion,
    "current:",
    SEED_VERSION,
    "targetRegion:",
    regionId,
    "needsSeed:",
    needsSeed
  );
  return result;
}

async function seedSector(uid, payload) {
  const { cards = [], leads = [], deals = [], campaigns = [], events = [] } = payload;
  const batch = writeBatch(db);
  cards.forEach((row) => {
    const ref = doc(db, "tenants", uid, "cards", row.id || slugify(row.unitName || row.model || row.vin || row.hullId));
    batch.set(ref, sanitizeFirestoreRow(row), { merge: true });
  });
  leads.forEach((row) => {
    const ref = doc(db, "tenants", uid, "leads", row.id || slugify(row.name));
    batch.set(ref, sanitizeFirestoreRow(row), { merge: true });
  });
  deals.forEach((row) => {
    const ref = doc(db, "tenants", uid, "deals", row.id || slugify(row.title));
    batch.set(ref, sanitizeFirestoreRow(row), { merge: true });
  });
  campaigns.forEach((row) => {
    const ref = doc(db, "tenants", uid, "campaigns", row.id || slugify(row.name));
    batch.set(ref, sanitizeFirestoreRow(row), { merge: true });
  });
  events.forEach((row) => {
    const ref = doc(db, "tenants", uid, "events", row.id || slugify(`${row.portalType || row.sector}-${row.timestamp}`));
    batch.set(ref, sanitizeFirestoreRow(row), { merge: true });
  });
  await batch.commit();
}

export async function seedTenantData(uid, userInfo = {}, regionId = "gulf") {
  console.log("[TENANT SEED] Starting seed for uid:", uid, "region:", regionId);
  try {
    const tenantRef = doc(db, "tenants", uid);
    const existingSnap = await getDoc(tenantRef);
    const existingData = existingSnap.exists() ? existingSnap.data() || {} : null;

    const regionMatches = existingData?.seedRegion === regionId;
    // Version-aware + region-aware skip
    if (
      existingData &&
      existingData.seedComplete === true &&
      existingData.seedVersion === SEED_VERSION &&
      regionMatches
    ) {
      return { seeded: false, reason: "already_seeded_current_version" };
    }

    if (existingData && (existingData.seedVersion !== SEED_VERSION || !regionMatches)) {
      const reason =
        existingData.seedVersion !== SEED_VERSION
          ? "version mismatch"
          : `region mismatch (${existingData.seedRegion || "unknown"} -> ${regionId})`;
      console.log("[TENANT RESEED] Reseed required:", reason, "- clearing old data before reseed");
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
        seedRegion: regionId,
        seedComplete: false,
        schemaVersion: SCHEMA_VERSION,
        cleanupEligible: true,
        pendingDeletionAt: null,
      },
      { merge: true }
    );

    const baseTimeMs = Date.now();
    await seedSector(uid, buildRealEstateSeed(baseTimeMs, regionId));
    await seedSector(uid, buildAutomotiveSeed(baseTimeMs, regionId));
    await seedSector(uid, buildYachtSeed(baseTimeMs, regionId));

    await setDoc(
      doc(db, "tenants", uid, "settings", "preferences"),
      { language: "en", theme: "light", currency: "AED", notifications: true },
      { merge: true }
    );

    await setDoc(
      tenantRef,
      {
        seedComplete: true,
        seedVersion: SEED_VERSION,
        seedRegion: regionId,
        schemaVersion: SCHEMA_VERSION,
        lastActivity: serverTimestamp(),
        pendingDeletionAt: null,
      },
      { merge: true }
    );

    console.log("[TENANT SEED] Seed completed successfully for uid:", uid);
    return { seeded: true, version: SEED_VERSION };
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
    internalNotes: payload.internalNotes || "",
    tags: payload.tags || [],
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
 * Copies: name (+ " Copy"), client, description, notes, tags, objective, audience, channel, budget.
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
    internalNotes: original.internalNotes || "",
    tags: original.tags || [],
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
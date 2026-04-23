const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// ── Security: Allowed redirect domains ──
const ALLOWED_REDIRECT_DOMAINS = ["dynamicnfc.ca", "www.dynamicnfc.ca", "localhost"];

function isValidRedirectUrl(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED_REDIRECT_DOMAINS.some((d) => parsed.hostname === d || parsed.hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

// DEACTIVATED — Card redirect is handled client-side via
// CardRedirect.jsx + Firestore read in the browser.
// Cloud Function version kept here for reference only.
// To reactivate: add firebase.json rewrite for /c/** → cardRedirect
// exports.cardRedirect = functions.https.onRequest(async (req, res) => {
//   try {
//     const pathParts = req.path.split("/").filter(Boolean);
//     const cardId = pathParts.length > 1 ? pathParts[1] : pathParts[0];
//     if (!cardId) return res.redirect("https://dynamicnfc.ca");
//
//     const cardDoc = await db.collection("smartcards").doc(cardId).get();
//     if (!cardDoc.exists || cardDoc.data().status !== "active") {
//       return res.redirect("https://dynamicnfc.ca");
//     }
//
//     const card = cardDoc.data();
//     const ua = req.headers["user-agent"] || "";
//     const deviceType = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : /tablet/i.test(ua) ? "tablet" : "desktop";
//     const ipRaw = req.headers["x-forwarded-for"] || req.ip || "unknown";
//     const ipHash = crypto.createHash("sha256").update(ipRaw).digest("hex").substring(0, 16);
//
//     Promise.all([
//       db.collection("taps").add({
//         cardId, timestamp: admin.firestore.FieldValue.serverTimestamp(),
//         userAgent: ua.substring(0, 500), deviceType,
//         referrer: (req.headers.referer || "").substring(0, 500),
//         ipHash, campaignId: card.campaignId || null, assignedTo: card.assignedTo || null,
//       }),
//       db.collection("smartcards").doc(cardId).update({
//         totalTaps: admin.firestore.FieldValue.increment(1),
//         lastTapAt: admin.firestore.FieldValue.serverTimestamp(),
//       }),
//     ]).catch((err) => console.error("Tap log error:", err));
//
//     // Validate redirect URL before redirecting (prevent open redirect)
//     if (!isValidRedirectUrl(card.redirectUrl)) {
//       console.error("Invalid redirectUrl for card:", cardId, card.redirectUrl);
//       return res.redirect("https://dynamicnfc.ca");
//     }
//
//     return res.redirect(302, card.redirectUrl);
//   } catch (error) {
//     console.error("cardRedirect error:", error);
//     return res.redirect("https://dynamicnfc.ca");
//   }
// });

// FUNCTION 2: Admin API
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    req.user = await admin.auth().verifyIdToken(auth.split("Bearer ")[1]);
    next();
  } catch (e) { return res.status(401).json({ error: "Invalid token" }); }
};
app.use(authenticate);

const requireAdmin = async (req, res, next) => {
  try {
    const email = (req.user?.email || "").toLowerCase();
    if (!email) return res.status(403).json({ error: "Forbidden" });
    const adminDoc = await db.collection("admins").doc(email).get();
    if (!adminDoc.exists) return res.status(403).json({ error: "Forbidden" });
    next();
  } catch (e) {
    return res.status(500).json({ error: "Admin check failed" });
  }
};

app.get("/api/smartcards", async (req, res) => {
  try {
    let q = db.collection("smartcards").orderBy("createdAt", "desc");
    if (req.query.campaignId) q = q.where("campaignId", "==", req.query.campaignId);
    const snap = await q.limit(500).get();
    res.json({ cards: snap.docs.map((d) => ({ id: d.id, ...d.data() })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/smartcards/:id", async (req, res) => {
  try {
    const doc = await db.collection("smartcards").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/smartcards", async (req, res) => {
  try {
    const { cardId, assignedTo, assignedName, assignedEmail, redirectUrl, campaignId, cardType } = req.body;
    if (!cardId || !redirectUrl) return res.status(400).json({ error: "cardId and redirectUrl required" });
    if (!isValidRedirectUrl(redirectUrl)) return res.status(400).json({ error: "redirectUrl must point to dynamicnfc.ca" });
    const existing = await db.collection("smartcards").doc(cardId).get();
    if (existing.exists) return res.status(409).json({ error: "Card ID exists" });
    const data = {
      status: assignedTo ? "active" : "unassigned",
      assignedTo: assignedTo || null, assignedName: assignedName || null,
      assignedEmail: assignedEmail || null, redirectUrl,
      campaignId: campaignId || null, cardType: cardType || "vip",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      totalTaps: 0, lastTapAt: null,
    };
    await db.collection("smartcards").doc(cardId).set(data);
    res.status(201).json({ id: cardId, ...data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/smartcards/:id", async (req, res) => {
  try {
    const doc = await db.collection("smartcards").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Not found" });
    // Whitelist allowed update fields (prevent arbitrary field injection)
    const ALLOWED_UPDATE_FIELDS = ["assignedTo", "assignedName", "assignedEmail", "redirectUrl", "campaignId", "cardType", "status"];
    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    ALLOWED_UPDATE_FIELDS.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (updates.redirectUrl && !isValidRedirectUrl(updates.redirectUrl)) {
      return res.status(400).json({ error: "redirectUrl must point to dynamicnfc.ca" });
    }
    await db.collection("smartcards").doc(req.params.id).update(updates);
    res.json({ id: req.params.id, ...doc.data(), ...updates });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/smartcards/:id", async (req, res) => {
  try {
    await db.collection("smartcards").doc(req.params.id).update({
      status: "inactive", updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/taps", async (req, res) => {
  try {
    let q = db.collection("taps").orderBy("timestamp", "desc");
    if (req.query.cardId) q = q.where("cardId", "==", req.query.cardId);
    if (req.query.campaignId) q = q.where("campaignId", "==", req.query.campaignId);
    const snap = await q.limit(parseInt(req.query.limit, 10) || 100).get();
    res.json({ taps: snap.docs.map((d) => ({ id: d.id, ...d.data() })), count: snap.size });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/taps/stats", async (req, res) => {
  try {
    let q = db.collection("taps");
    if (req.query.campaignId) q = q.where("campaignId", "==", req.query.campaignId);
    const snap = await q.get();
    const taps = snap.docs.map((d) => d.data());
    const now = Date.now();
    const stats = { totalTaps: taps.length, uniqueCards: new Set(taps.map((t) => t.cardId)).size,
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }, last24h: 0, last7d: 0 };
    taps.forEach((t) => {
      if (t.deviceType) stats.deviceBreakdown[t.deviceType]++;
      const ts = t.timestamp?.toMillis?.() || 0;
      if (now - ts < 86400000) stats.last24h++;
      if (now - ts < 604800000) stats.last7d++;
    });
    res.json(stats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/campaigns", async (req, res) => {
  try {
    const snap = await db.collection("campaigns").orderBy("startDate", "desc").get();
    res.json({ campaigns: snap.docs.map((d) => ({ id: d.id, ...d.data() })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/campaigns", async (req, res) => {
  try {
    const { id, name, client, totalCards, startDate, endDate } = req.body;
    if (!id || !name) return res.status(400).json({ error: "id and name required" });
    const data = { name, client: client || null, totalCards: totalCards || 0, activeCards: 0,
      startDate: startDate ? admin.firestore.Timestamp.fromDate(new Date(startDate)) : admin.firestore.FieldValue.serverTimestamp(),
      endDate: endDate ? admin.firestore.Timestamp.fromDate(new Date(endDate)) : null, status: "active" };
    await db.collection("campaigns").doc(id).set(data);
    res.status(201).json({ id, ...data });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/seed-demo", requireAdmin, async (req, res) => {
  try {
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    batch.set(db.collection("campaigns").doc("vista-pilot"), {
      name: "Vista Residences VIP Pilot", client: "Vista Development Corp",
      totalCards: 4, activeCards: 4, startDate: now, endDate: null, status: "active",
    });
    const demoCards = [
      { id: "VISTA001", assignedTo: "khalid-alrashid", assignedName: "Khalid Al-Rashid", assignedEmail: "khalid@vista.ae", redirectUrl: "https://dynamicnfc.ca/enterprise/crmdemo/khalid", cardType: "vip" },
      { id: "VISTA002", assignedTo: "ahmed-almansouri", assignedName: "Ahmed Al-Mansouri", assignedEmail: "ahmed@vista.ae", redirectUrl: "https://dynamicnfc.ca/enterprise/crmdemo/ahmed", cardType: "family" },
      { id: "VISTA003", assignedTo: null, assignedName: null, assignedEmail: null, redirectUrl: "https://dynamicnfc.ca/enterprise/crmdemo/marketplace", cardType: "public" },
      { id: "VISTA004", assignedTo: "auto-khalid", assignedName: "Khalid Al-Mansouri", assignedEmail: "khalid@prestige.ae", redirectUrl: "https://dynamicnfc.ca/automotive/demo/khalid", cardType: "vip" },
    ];
    demoCards.forEach((c) => {
      batch.set(db.collection("smartcards").doc(c.id), {
        status: c.assignedTo ? "active" : "unassigned", assignedTo: c.assignedTo,
        assignedName: c.assignedName, assignedEmail: c.assignedEmail, redirectUrl: c.redirectUrl,
        campaignId: "vista-pilot", cardType: c.cardType, createdAt: now, updatedAt: now, totalTaps: 0, lastTapAt: null,
      });
    });
    await batch.commit();
    res.json({ success: true, cardsCreated: demoCards.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/demo/seed", requireAdmin, async (req, res) => {
  try {
    const now = Date.now();
    const batch = db.batch();
    const campaignRef = db.collection("campaigns").doc("seed-demo-live");
    batch.set(campaignRef, {
      name: "Seed Demo Live",
      client: "DynamicNFC Demo",
      totalCards: 6,
      activeCards: 6,
      sector: "real_estate",
      status: "active",
      demoSeed: true,
      startDate: admin.firestore.Timestamp.fromDate(new Date(now - 86400000)),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    const profiles = [
      { name: "Khalid Al-Rashid", visitorType: "vip", unitId: "T1-1201", unitName: "Aurora Penthouse 1", owner: "Alex Reed" },
      { name: "Fatima Al-Mansouri", visitorType: "family", unitId: "T2-1101", unitName: "Horizon Family 3B", owner: "Mina Patel" },
      { name: "Maya Hassan", visitorType: "registered", unitId: "T2-0602", unitName: "Horizon Classic 2A", owner: "Alex Reed" },
      { name: "Omar Khalil", visitorType: "anonymous", unitId: "T3-0701", unitName: "Nova Classic 7A", owner: null },
      { name: "Nora Ali", visitorType: "vip", unitId: "T1-0903", unitName: "Aurora Marina 2B", owner: "Mina Patel" },
      { name: "Yousef Karim", visitorType: "registered", unitId: "T3-1102", unitName: "Nova Family 3A", owner: "Alex Reed" },
    ];

    const eventSeries = [
      { event: "portal_open", category: "browse", minutes: 0, weight: 0 },
      { event: "unit_view", category: "engage", minutes: 3, weight: 3 },
      { event: "brochure_download", category: "intent", minutes: 8, weight: 5 },
      { event: "pricing_request", category: "intent", minutes: 12, weight: 15 },
      { event: "book_viewing", category: "action", minutes: 18, weight: 25 },
    ];

    let eventCount = 0;
    profiles.forEach((p, i) => {
      const cardRef = db.collection("smartcards").doc();
      batch.set(cardRef, {
        status: "active",
        assignedTo: p.name.toLowerCase().replace(/\s+/g, "-"),
        assignedName: p.name,
        redirectUrl: "https://dynamicnfc.ca/enterprise/crmdemo/khalid",
        campaignId: "seed-demo-live",
        cardType: p.visitorType === "vip" || p.visitorType === "family" ? "vip" : "public",
        visitorType: p.visitorType,
        salesRep: p.owner,
        totalTaps: 0,
        demoSeed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const baseTs = now - (i + 1) * 43200000;
      eventSeries.forEach((s, idx) => {
        const evRef = db.collection("behaviors").doc();
        const actual = idx === 3 && i % 2 === 1
          ? { event: "payment_plan", category: "intent", minutes: 12, weight: 15 }
          : s;
        const finalEv = idx === 4 && i >= 3
          ? { event: "contact_advisor", category: "action", minutes: 18, weight: 20 }
          : actual;
        batch.set(evRef, {
          cardId: cardRef.id,
          visitorName: p.name,
          visitorType: p.visitorType,
          event: finalEv.event,
          category: finalEv.category,
          details: { unitId: p.unitId, unitName: p.unitName },
          funnelWeight: finalEv.weight,
          sessionId: `seed_live_${i}_${now}`,
          portalName: i % 4 === 0 ? "marketplace" : i % 3 === 0 ? "family" : "vip",
          demoSeed: true,
          timestamp: admin.firestore.Timestamp.fromDate(new Date(baseTs + finalEv.minutes * 60000)),
        });
        eventCount += 1;
      });
    });

    await batch.commit();
    res.json({ success: true, cardsCreated: profiles.length, eventsCreated: eventCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/demo/reset", requireAdmin, async (req, res) => {
  try {
    const [seedCards, seedBehaviors] = await Promise.all([
      db.collection("smartcards").where("demoSeed", "==", true).limit(500).get(),
      db.collection("behaviors").where("demoSeed", "==", true).limit(2000).get(),
    ]);
    const batch = db.batch();
    seedBehaviors.docs.forEach((d) => batch.delete(d.ref));
    seedCards.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(db.collection("campaigns").doc("seed-demo-live"));
    await batch.commit();
    res.json({ success: true, deletedCards: seedCards.size, deletedEvents: seedBehaviors.size });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(app);

// ═══════════════════════════════════════════════════════
// TENANT CLEANUP — Scheduled Inactivity Cleanup
// Daily at 03:00 America/Toronto
// Phase A: soft-delete (pendingDeletionAt) after 15 days inactivity
// Phase B: hard-delete (recursive) after 7 days grace period
// Exempt list: settings/cleanup-exempt (managed via AdminSettings UI)
// DRY-RUN default TRUE — first deploy does nothing
// ═══════════════════════════════════════════════════════
const CLEANUP_DRY_RUN = true;
const CLEANUP_INACTIVITY_DAYS = 15;
const CLEANUP_GRACE_DAYS = 7;
const CLEANUP_MAX_PER_RUN = 50;

exports.cleanupInactiveTenants = functions
  .region("us-central1")
  .pubsub.schedule("0 3 * * *")
  .timeZone("America/Toronto")
  .onRun(async () => {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;
    const inactivityCutoff = new Date(now - CLEANUP_INACTIVITY_DAYS * DAY_MS);
    const graceCutoff = new Date(now - CLEANUP_GRACE_DAYS * DAY_MS);

    const summary = {
      dryRun: CLEANUP_DRY_RUN,
      scanned: 0,
      softDeleted: 0,
      hardDeleted: 0,
      skippedExempt: 0,
      errors: 0,
    };

    // Load exempt list ONCE
    let exemptUids = new Set();
    let exemptEmails = new Set();
    try {
      // Path must match firestore.rules /settings/{settingId} and AdminSettings UI
      const exemptSnap = await db.collection("settings").doc("cleanup-exempt").get();
      if (exemptSnap.exists) {
        const d = exemptSnap.data() || {};
        if (Array.isArray(d.uids)) d.uids.forEach((u) => exemptUids.add(u));
        if (Array.isArray(d.emails)) d.emails.forEach((e) => exemptEmails.add(String(e).toLowerCase()));
      }
    } catch (err) {
      console.warn("[Cleanup] Failed to read exempt list:", err.message);
    }

    const isExempt = (uid, email) =>
      exemptUids.has(uid) || (email && exemptEmails.has(email.toLowerCase()));

    // Scan inactive tenants
    let tenantsSnap;
    try {
      tenantsSnap = await db
        .collection("tenants")
        .where("lastActivity", "<", admin.firestore.Timestamp.fromDate(inactivityCutoff))
        .limit(CLEANUP_MAX_PER_RUN)
        .get();
    } catch (err) {
      console.error("[Cleanup] Query failed:", err.message);
      return null;
    }

    console.log(`[Cleanup] Scan — ${tenantsSnap.size} inactive tenants, dryRun=${CLEANUP_DRY_RUN}`);

    for (const tenantDoc of tenantsSnap.docs) {
      summary.scanned++;
      const uid = tenantDoc.id;
      const data = tenantDoc.data() || {};
      const email = data.email || "";

      try {
        if (isExempt(uid, email)) {
          summary.skippedExempt++;
          console.log(`[Cleanup] SKIP exempt: ${uid} (${email})`);
          continue;
        }

        const pendingAt = data.pendingDeletionAt?.toDate?.() || null;

        // PHASE B: Hard delete — pendingDeletionAt set AND grace period expired
        if (pendingAt && pendingAt < graceCutoff) {
          console.log(`[Cleanup] HARD DELETE: ${uid} (${email}) — pending since ${pendingAt.toISOString()}`);
          if (!CLEANUP_DRY_RUN) {
            await db.recursiveDelete(tenantDoc.ref);
          }
          summary.hardDeleted++;
          continue;
        }

        // PHASE A: Soft delete — inactive but not yet marked
        if (!pendingAt) {
          console.log(`[Cleanup] SOFT DELETE: ${uid} (${email}) — inactive ${Math.floor((now - (data.lastActivity?.toDate?.()?.getTime() || 0)) / DAY_MS)}d`);
          if (!CLEANUP_DRY_RUN) {
            await tenantDoc.ref.set(
              { pendingDeletionAt: admin.firestore.FieldValue.serverTimestamp() },
              { merge: true }
            );
          }
          summary.softDeleted++;
        }
      } catch (err) {
        console.error(`[Cleanup] ERROR ${uid}:`, err.message);
        summary.errors++;
      }
    }

    console.log("[Cleanup] Summary:", JSON.stringify(summary));
    return null;
  });

// ═══════════════════════════════════════════════════════
// CONTACT FORM — Public endpoint (replaces FormSubmit.co)
// ═══════════════════════════════════════════════════════
const contactApp = express();
contactApp.use(cors({ origin: true }));
contactApp.use(express.json());

// Rate limit: max 5 submissions per IP per hour (in-memory, resets on cold start)
const rateLimitMap = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const key = crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
  const entry = rateLimitMap.get(key);
  if (entry && now - entry.first < 3600000 && entry.count >= 5) return false;
  if (!entry || now - entry.first >= 3600000) {
    rateLimitMap.set(key, { first: now, count: 1 });
  } else {
    entry.count++;
  }
  return true;
}

contactApp.post("/", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const { _subject, ...fields } = req.body;
    if (!_subject || Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "Subject and at least one field required" });
    }

    // 1. Save to Firestore
    const docRef = await db.collection("contact_submissions").add({
      subject: _subject,
      fields,
      ip: crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Send email notification
    const smtpUser = process.env.SMTP_USER || functions.config().smtp?.user;
    const smtpPass = process.env.SMTP_PASS || functions.config().smtp?.pass;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      const htmlRows = Object.entries(fields)
        .map(([k, v]) => `<tr><td style="padding:8px 12px;border:1px solid #ddd;font-weight:600">${k}</td><td style="padding:8px 12px;border:1px solid #ddd">${v}</td></tr>`)
        .join("");

      await transporter.sendMail({
        from: `"DynamicNFC" <${smtpUser}>`,
        to: "info@dynamicnfc.help",
        subject: _subject,
        html: `<h2>${_subject}</h2><table style="border-collapse:collapse;width:100%;max-width:600px">${htmlRows}</table><br><small>Ref: ${docRef.id}</small>`,
      });
    }

    res.json({ success: true, id: docRef.id });
  } catch (e) {
    console.error("Contact form error:", e);
    res.status(500).json({ error: "Failed to submit" });
  }
});

exports.contactForm = functions.https.onRequest(contactApp);

// ═══════════════════════════════════════════════════════
// GOOGLE WALLET — Firestore Trigger
// ═══════════════════════════════════════════════════════
const { GoogleAuth } = require("google-auth-library");

const ISSUER_ID = "3388000000023091528";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";

async function getWalletClient() {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });
  return auth.getClient();
}

async function ensureGenericClass(client, classId) {
  const url = `${WALLET_API}/genericClass/${classId}`;
  try {
    const res = await client.request({ url, method: "GET" });
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const classPayload = {
        id: classId,
        issuerName: "DynamicNFC",
        reviewStatus: "UNDER_REVIEW",
        multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
      };
      const res = await client.request({
        url: `${WALLET_API}/genericClass`,
        method: "POST",
        data: classPayload,
      });
      return res.data;
    }
    throw err;
  }
}

exports.onWalletPassRequest = functions.firestore
  .document("walletPassRequests/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const docRef = snap.ref;

    try {
      const { cardId, holderName, holderEmail, cardType, projectName, portalUrl } = data;

      if (!cardId || !holderName) {
        await docRef.update({ status: "error", error: "cardId and holderName required" });
        return;
      }

      const client = await getWalletClient();
      const classId = `${ISSUER_ID}.dynamicnfc_vip_class`;
      await ensureGenericClass(client, classId);

      const objectId = `${ISSUER_ID}.${cardId}_${Date.now()}`;

      const objectPayload = {
        id: objectId,
        classId: classId,
        state: "ACTIVE",
        header: {
          defaultValue: { language: "en-US", value: projectName || "DynamicNFC VIP Access" },
        },
        subheader: {
          defaultValue: { language: "en-US", value: cardType || "VIP Access Key" },
        },
        textModulesData: [
          { id: "holder", header: "VIP Member", body: holderName },
          { id: "cardid", header: "Card ID", body: cardId },
          { id: "status", header: "Status", body: "Active" },
        ],
        linksModuleData: {
          uris: [
            { uri: portalUrl || `https://dynamicnfc.ca/c/${cardId}`, description: "Open VIP Portal", id: "portal_link" },
            { uri: "https://dynamicnfc.ca", description: "DynamicNFC", id: "website" },
          ],
        },
        barcode: {
          type: "QR_CODE",
          value: portalUrl || `https://dynamicnfc.ca/c/${cardId}`,
          alternateText: cardId,
        },
        hexBackgroundColor: "#1a1a2e",
        logo: {
          sourceUri: { uri: "https://dynamicnfc.ca/logo192.png" },
          contentDescription: {
            defaultValue: { language: "en-US", value: "DynamicNFC Logo" },
          },
        },
      };

      await client.request({
        url: `${WALLET_API}/genericObject`,
        method: "POST",
        data: objectPayload,
      });

      const saveUrl = `https://pay.google.com/gp/v/save/${objectId}`;

      // Update the request doc with result
      await docRef.update({
        status: "created",
        saveUrl,
        objectId,
        classId,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Also save to walletPasses collection
      await db.collection("walletPasses").doc(cardId).set({
        objectId, classId, holderName, holderEmail: holderEmail || "",
        cardId, cardType: cardType || "VIP", projectName: projectName || "DynamicNFC",
        saveUrl, createdAt: admin.firestore.FieldValue.serverTimestamp(), status: "created",
      }, { merge: true });

    } catch (error) {
      console.error("Wallet pass error:", error.response?.data || error.message);
      await docRef.update({
        status: "error",
        error: error.response?.data?.error?.message || error.message,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

// ═══════════════════════════════════════════════════════
// SEED DEMO DATA — Callable function for first-time /unified login
// Idempotent: checks tenants/{uid} seedVersion before writing
// Creates: events, deals, campaigns, leads under tenants/{uid}/
// ═══════════════════════════════════════════════════════
const SEED_VERSION = "v1";

exports.seedDemoData = functions.region("us-central1").https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required");
  }

  const uid = context.auth.uid;
  const email = context.auth.token.email || "";
  const sectorId = (data && data.sectorId) || "real_estate";
  const tenantRef = db.collection("tenants").doc(uid);

  // Idempotent check
  const tenantSnap = await tenantRef.get();
  if (tenantSnap.exists) {
    const existing = tenantSnap.data();
    if (existing.seedVersion === SEED_VERSION) {
      console.log(`[Seed] Skip — ${uid} already seeded with ${SEED_VERSION}`);
      return { status: "already_seeded", seedVersion: SEED_VERSION };
    }
  }

  console.log(`[Seed] Seeding ${uid} (${email}) sector=${sectorId}`);
  const now = Date.now();
  const DAY = 86400000;
  const batch = db.batch();

  // Tenant root doc
  batch.set(tenantRef, {
    email,
    displayName: email.split("@")[0] || "User",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastActivity: admin.firestore.FieldValue.serverTimestamp(),
    seedVersion: SEED_VERSION,
    seedComplete: true,
    schemaVersion: 1,
    cleanupEligible: true,
    pendingDeletionAt: null,
  }, { merge: true });

  // Demo events (5)
  const events = sectorId === "automotive" ? [
    { id: "ev_s1", event: "auto_portal_entry", portalType: "vip", vipName: "Khalid Al-Mansouri", unitName: "AMG GT 63 S", tower: "performance", unitType: "coupe", timestamp: new Date(now - 5 * DAY).toISOString() },
    { id: "ev_s2", event: "vehicle_view", portalType: "vip", vipName: "Khalid Al-Mansouri", unitName: "G-Class G63", tower: "suv", unitType: "suv", timestamp: new Date(now - 4 * DAY).toISOString() },
    { id: "ev_s3", event: "request_quote", portalType: "vip", vipName: "Sultan Al-Otaibi", unitName: "AMG GT 63 S", tower: "performance", unitType: "coupe", timestamp: new Date(now - 3 * DAY).toISOString() },
    { id: "ev_s4", event: "test_drive_request", portalType: "vip", vipName: "Khalid Al-Mansouri", unitName: "G-Class G63", tower: "suv", unitType: "suv", timestamp: new Date(now - 2 * DAY).toISOString() },
    { id: "ev_s5", event: "download_brochure", portalType: "anonymous", sessionId: "anon_seed_01", unitName: "EQS 580", tower: "electric", unitType: "sedan", timestamp: new Date(now - 1 * DAY).toISOString() },
  ] : [
    { id: "ev_s1", event: "portal_opened", portalType: "vip", vipName: "Khalid Al-Rashid", unitName: "Sky Penthouse A", tower: "Al Qamar", unitType: "penthouse", timestamp: new Date(now - 7 * DAY).toISOString() },
    { id: "ev_s2", event: "view_unit", portalType: "vip", vipName: "Khalid Al-Rashid", unitName: "Sky Penthouse A", tower: "Al Qamar", unitType: "penthouse", timestamp: new Date(now - 5 * DAY).toISOString() },
    { id: "ev_s3", event: "request_pricing", portalType: "vip", vipName: "Fatima Al-Mansouri", unitName: "Garden 3BR", tower: "Al Rawda", unitType: "3br", timestamp: new Date(now - 4 * DAY).toISOString() },
    { id: "ev_s4", event: "book_viewing", portalType: "vip", vipName: "Khalid Al-Rashid", unitName: "Sky Penthouse A", tower: "Al Qamar", unitType: "penthouse", timestamp: new Date(now - 3 * DAY).toISOString() },
    { id: "ev_s5", event: "download_brochure", portalType: "registered", userName: "Ahmed Al-Fahad", unitName: "Marina 2BR A", tower: "Al Qamar", unitType: "2br", timestamp: new Date(now - 2 * DAY).toISOString() },
  ];

  events.forEach((ev) => {
    batch.set(tenantRef.collection("events").doc(ev.id), ev);
  });

  // Demo deals (3)
  const deals = sectorId === "automotive" ? [
    { title: "AMG GT 63 S - Khalid", leadName: "Khalid Al-Mansouri", unitName: "AMG GT 63 S", value: 850000, stage: "negotiation", probability: 0.7, createdAt: new Date(now - 6 * DAY).toISOString() },
    { title: "G63 - Sultan", leadName: "Sultan Al-Otaibi", unitName: "G-Class G63", value: 720000, stage: "test_drive", probability: 0.5, createdAt: new Date(now - 4 * DAY).toISOString() },
    { title: "EQS 580 - Lead", leadName: "Anonymous", unitName: "EQS 580", value: 580000, stage: "new_lead", probability: 0.2, createdAt: new Date(now - 2 * DAY).toISOString() },
  ] : [
    { title: "Sky Penthouse A - Khalid", leadName: "Khalid Al-Rashid", unitName: "Sky Penthouse A", value: 4500000, stage: "negotiation", probability: 0.7, createdAt: new Date(now - 8 * DAY).toISOString() },
    { title: "Garden 3BR - Fatima", leadName: "Fatima Al-Mansouri", unitName: "Garden 3BR", value: 2800000, stage: "viewing_scheduled", probability: 0.5, createdAt: new Date(now - 5 * DAY).toISOString() },
    { title: "Marina 2BR - Ahmed", leadName: "Ahmed Al-Fahad", unitName: "Marina 2BR A", value: 1800000, stage: "contacted", probability: 0.4, createdAt: new Date(now - 3 * DAY).toISOString() },
  ];

  deals.forEach((deal, i) => {
    batch.set(tenantRef.collection("deals").doc(`deal_s${i + 1}`), {
      ...deal,
      assignedRep: "",
      expectedCloseAt: null,
    });
  });

  // Demo campaign (1)
  batch.set(tenantRef.collection("campaigns").doc("camp_seed_1"), {
    name: sectorId === "automotive" ? "Prestige VIP Launch" : "Vista VIP Winter Access",
    type: "email",
    status: "active",
    audience: "high_intent_vips",
    sent: 24,
    opened: 18,
    clicked: 12,
    converted: 3,
    startDate: new Date(now - 30 * DAY).toISOString(),
    endDate: null,
    client: sectorId === "automotive" ? "Prestige Motors" : "Vista Residences",
    totalCards: 24,
    activeCards: 18,
  });

  // Demo leads (2)
  const leads = sectorId === "automotive" ? [
    { name: "Khalid Al-Mansouri", email: "khalid@prestige.sa", source: "nfc_card", status: "qualified", score: 82 },
    { name: "Sultan Al-Otaibi", email: "sultan@prestige.sa", source: "event", status: "contacted", score: 65 },
  ] : [
    { name: "Khalid Al-Rashid", email: "khalid@alnoor.sa", source: "nfc_card", status: "qualified", score: 78 },
    { name: "Fatima Al-Mansouri", email: "fatima@alnoor.sa", source: "website", status: "contacted", score: 62 },
  ];

  leads.forEach((lead, i) => {
    batch.set(tenantRef.collection("leads").doc(`lead_s${i + 1}`), {
      ...lead,
      phone: "",
      assignedRep: "",
      createdAt: new Date(now - (7 - i) * DAY).toISOString(),
      lastContactAt: new Date(now - (2 + i) * DAY).toISOString(),
      notes: "",
    });
  });

  // Settings
  batch.set(tenantRef.collection("settings").doc("preferences"), {
    language: "en",
    theme: "light",
    currency: "AED",
    notifications: true,
  });

  await batch.commit();
  console.log(`[Seed] Done — ${uid}: ${events.length} events, ${deals.length} deals, ${leads.length} leads, 1 campaign`);
  return { status: "seeded", seedVersion: SEED_VERSION };
});

// ═══════════════════════════════════════════════════════
// TAP AGGREGATION — Firestore trigger on taps/{tapId}
// Increments cachedTapCount on the tenant's campaign doc
// so frontend reads cached value instead of querying all taps
// ═══════════════════════════════════════════════════════
exports.aggregateTaps = functions.firestore
  .document("taps/{tapId}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const campaignId = data.campaignId;
    const uid = data.assignedTo;

    if (!campaignId || !uid) {
      console.log("[AggregateTaps] Skip — missing campaignId or assignedTo");
      return null;
    }

    const dayKey = new Date().toISOString().slice(0, 10);
    const campaignRef = db.collection("tenants").doc(uid).collection("campaigns").doc(campaignId);

    try {
      const campaignSnap = await campaignRef.get();
      if (!campaignSnap.exists) {
        console.log(`[AggregateTaps] Skip — campaign ${campaignId} not found for tenant ${uid}`);
        return null;
      }

      await campaignRef.update({
        cachedTapCount: admin.firestore.FieldValue.increment(1),
        cachedLastTapAt: admin.firestore.FieldValue.serverTimestamp(),
        [`cachedTapsByDay.${dayKey}`]: admin.firestore.FieldValue.increment(1),
      });

      console.log(`[AggregateTaps] +1 tap for campaign ${campaignId} tenant ${uid} day ${dayKey}`);
    } catch (err) {
      console.error(`[AggregateTaps] Error:`, err.message);
    }

    return null;
  });

// ═══════════════════════════════════════════════════════
// CAMPAIGN TAP AGGREGATION — Scheduled every 15 minutes
// Recomputes tapsTotal, taps7d, dealCount, conversionPct
// for every non-archived campaign across all tenants.
// Writes to campaign.aggregates {} (read-only for clients).
// ═══════════════════════════════════════════════════════
const STAGE_WEIGHT = {
  new_lead: 0.1, contacted: 0.2,
  viewing_scheduled: 0.4, viewing_done: 0.6,
  test_drive: 0.4, quote_sent: 0.5,
  negotiation: 0.8, offer_sent: 0.9,
  financing: 0.85, reservation: 0.9, contract: 0.95,
  closed_won: 1.0, closed_lost: 0.0,
};

exports.aggregateCampaignTaps = functions
  .region("us-central1")
  .pubsub.schedule("every 15 minutes")
  .timeZone("UTC")
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const sevenDaysAgo = admin.firestore.Timestamp.fromMillis(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const tenantsSnap = await db.collection("tenants").get();
    let totalProcessed = 0;

    for (const tenantDoc of tenantsSnap.docs) {
      const uid = tenantDoc.id;
      let campaignsSnap;
      try {
        campaignsSnap = await db.collection("tenants").doc(uid).collection("campaigns")
          .where("status", "!=", "archived").get();
      } catch { continue; }
      if (campaignsSnap.empty) continue;

      const batch = db.batch();
      let writes = 0;

      for (const campDoc of campaignsSnap.docs) {
        const campaignId = campDoc.id;
        try {
          const [tapsTotalSnap, taps7dSnap, dealsSnap] = await Promise.all([
            db.collection("taps").where("campaignId", "==", campaignId).count().get(),
            db.collection("taps").where("campaignId", "==", campaignId)
              .where("timestamp", ">=", sevenDaysAgo).count().get(),
            db.collection("tenants").doc(uid).collection("deals")
              .where("campaignId", "==", campaignId).get(),
          ]);
          let totalWeight = 0;
          let dealCount = 0;
          dealsSnap.forEach((d) => {
            totalWeight += STAGE_WEIGHT[d.get("stage")] ?? 0;
            dealCount++;
          });
          const convPct = dealCount === 0 ? 0 : (totalWeight / dealCount) * 100;
          batch.update(campDoc.ref, {
            aggregates: {
              tapsTotal: tapsTotalSnap.data().count,
              taps7d: taps7dSnap.data().count,
              dealCount,
              conversionPct: Number(convPct.toFixed(2)),
              updatedAt: now,
            },
          });
          writes++;
          if (writes >= 400) { await batch.commit(); writes = 0; }
        } catch (err) {
          console.error(`[AggCampaignTaps] Error ${uid}/${campaignId}:`, err.message);
        }
      }
      if (writes > 0) await batch.commit();
      totalProcessed += campaignsSnap.size;
    }
    console.log(`[AggCampaignTaps] Processed ${totalProcessed} campaigns across ${tenantsSnap.size} tenants`);
    return null;
  });

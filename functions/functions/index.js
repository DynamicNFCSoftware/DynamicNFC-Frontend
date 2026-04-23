const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// FUNCTION 1: Card Redirect — dynamicnfc.ca/c/VISTA001
exports.cardRedirect = functions.https.onRequest(async (req, res) => {
  try {
    const pathParts = req.path.split("/").filter(Boolean);
    const cardId = pathParts.length > 1 ? pathParts[1] : pathParts[0];
    if (!cardId) return res.redirect("https://dynamicnfc.ca");

    const cardDoc = await db.collection("smartcards").doc(cardId).get();
    if (!cardDoc.exists || cardDoc.data().status !== "active") {
      return res.redirect("https://dynamicnfc.ca");
    }

    const card = cardDoc.data();
    const ua = req.headers["user-agent"] || "";
    const deviceType = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : /tablet/i.test(ua) ? "tablet" : "desktop";
    const ipRaw = req.headers["x-forwarded-for"] || req.ip || "unknown";
    const ipHash = crypto.createHash("sha256").update(ipRaw).digest("hex").substring(0, 16);

    Promise.all([
      db.collection("taps").add({
        cardId, timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userAgent: ua.substring(0, 500), deviceType,
        referrer: (req.headers.referer || "").substring(0, 500),
        ipHash, campaignId: card.campaignId || null, assignedTo: card.assignedTo || null,
      }),
      db.collection("smartcards").doc(cardId).update({
        totalTaps: admin.firestore.FieldValue.increment(1),
        lastTapAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ]).catch((err) => console.error("Tap log error:", err));

    return res.redirect(302, card.redirectUrl);
  } catch (error) {
    console.error("cardRedirect error:", error);
    return res.redirect("https://dynamicnfc.ca");
  }
});

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
    const updates = { ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    delete updates.createdAt; delete updates.totalTaps;
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
    const snap = await q.limit(parseInt(req.query.limit) || 100).get();
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

app.post("/api/seed-demo", async (req, res) => {
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

exports.api = functions.https.onRequest(app);

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

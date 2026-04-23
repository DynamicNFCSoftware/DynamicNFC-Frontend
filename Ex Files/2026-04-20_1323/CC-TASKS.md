# CLAUDE CODE TASK BRIEF — 2026-04-16
## DynamicNFC — Backend: Cloud Functions Tap Aggregation

> **Context:** Cowork (Opus 4.6) just finished dashboard UI polish (Phases 1 + 2). Cursor is handling frontend polish (Phase 3). You handle backend. Build is green as of 2026-04-16 38.99s.
>
> **Your job:** Implement Cloud Function for tap aggregation so the Campaigns table doesn't hammer Firestore with client-side `where in` queries.

---

## PROBLEM STATEMENT

**Current behavior** (CampaignsTab.jsx):
- For each visible campaign row, the client queries the root `taps` collection filtered by `campaignId`
- Firestore `where in` is chunked at 10 items → for 50 campaigns we fire 5 round trips per page
- Each user pays this cost on every tab open + every filter change
- Conversion % is computed client-side using `DEAL_STAGE_CONVERSION_WEIGHT` (from campaignUtils.js)

**Problems:**
1. **Cost** — taps collection grows forever; aggregating on each read is wasteful
2. **Latency** — campaigns table stalls waiting for 5+ sequential queries
3. **Staleness** — no caching; every interaction re-queries

## SOLUTION

Pre-aggregate tap counts + conversion weights into each campaign document via a scheduled Cloud Function. Table reads 1 document per campaign. Done.

---

## IMPLEMENTATION

### File: `functions/index.js`

Add a new scheduled function alongside existing `api`, `cardRedirect`, `onWalletPassRequest`.

```js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin is already initialized elsewhere in index.js

/**
 * Scheduled function: every 15 minutes, recompute tap aggregates + weighted
 * conversion for every campaign and write back to the campaign document.
 *
 * Reads:  taps (indexed on campaignId+timestamp), deals (indexed on campaignId+stage)
 * Writes: campaigns/{id}.aggregates { taps7d, tapsTotal, conversionPct, updatedAt }
 */
exports.aggregateCampaignTaps = functions
  .region("us-central1")
  .pubsub.schedule("every 15 minutes")
  .timeZone("UTC")
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const sevenDaysAgo = admin.firestore.Timestamp.fromMillis(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    // Stage weights must mirror frontend campaignUtils.js DEAL_STAGE_CONVERSION_WEIGHT
    const STAGE_WEIGHT = {
      new: 0.1,
      contacted: 0.2,
      qualified: 0.4,
      viewing: 0.6,
      negotiation: 0.8,
      closed_won: 1.0,
      closed_lost: 0.0,
    };

    // 1. Fetch all non-archived campaigns
    const campaignsSnap = await db
      .collection("campaigns")
      .where("status", "!=", "archived")
      .get();

    if (campaignsSnap.empty) {
      console.log("[aggregateCampaignTaps] no active campaigns");
      return null;
    }

    const batch = db.batch();
    let writes = 0;

    for (const doc of campaignsSnap.docs) {
      const campaignId = doc.id;

      // 2. Count taps (total + 7-day window)
      const [tapsTotalSnap, taps7dSnap, dealsSnap] = await Promise.all([
        db
          .collection("taps")
          .where("campaignId", "==", campaignId)
          .count()
          .get(),
        db
          .collection("taps")
          .where("campaignId", "==", campaignId)
          .where("timestamp", ">=", sevenDaysAgo)
          .count()
          .get(),
        db
          .collection("deals")
          .where("campaignId", "==", campaignId)
          .get(),
      ]);

      // 3. Weighted conversion from deal stages
      let totalWeight = 0;
      let dealCount = 0;
      dealsSnap.forEach((d) => {
        const stage = d.get("stage");
        const w = STAGE_WEIGHT[stage] ?? 0;
        totalWeight += w;
        dealCount += 1;
      });
      const conversionPct =
        dealCount === 0 ? 0 : (totalWeight / dealCount) * 100;

      // 4. Stage write
      batch.update(doc.ref, {
        aggregates: {
          tapsTotal: tapsTotalSnap.data().count,
          taps7d: taps7dSnap.data().count,
          dealCount,
          conversionPct: Number(conversionPct.toFixed(2)),
          updatedAt: now,
        },
      });
      writes++;

      // Firestore batch limit is 500 — flush if approaching
      if (writes >= 400) {
        await batch.commit();
        writes = 0;
      }
    }

    if (writes > 0) await batch.commit();
    console.log(
      `[aggregateCampaignTaps] processed ${campaignsSnap.size} campaigns`
    );
    return null;
  });
```

### File: `firestore.indexes.json`

Ensure these composite indexes exist (add if missing, don't duplicate):

```json
{
  "collectionGroup": "taps",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "campaignId", "order": "ASCENDING" },
    { "fieldPath": "timestamp", "order": "DESCENDING" }
  ]
},
{
  "collectionGroup": "deals",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "campaignId", "order": "ASCENDING" },
    { "fieldPath": "stage", "order": "ASCENDING" }
  ]
}
```

### File: `firestore.rules`

Campaign `aggregates` field is written by Cloud Function only — ensure rules allow the function's service account AND block client writes:

Inside the `campaigns` match block, add a validation that rejects `aggregates` field updates from clients:

```
match /campaigns/{campaignId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
    && (!('aggregates' in request.resource.data.diff(resource.data).affectedKeys())
        || request.auth.token.admin == true);
}
```

(Cloud Functions using Admin SDK bypass rules — no config needed for the function itself.)

---

## FRONTEND INTEGRATION (optional — mention to Cursor, not your job)

Once this deploys, Cursor can update `tenantService.js` `listCampaigns` to prefer `campaign.aggregates.taps7d` / `.conversionPct` when present, falling back to client-side calc when aggregates missing or stale (>20 min).

---

## DEPLOYMENT STEPS

```bash
cd "/sessions/lucid-funny-babbage/mnt/DynamicNFC"

# 1. Lint functions
cd functions && npm run lint && cd ..

# 2. Deploy indexes first (they take time to build)
firebase deploy --only firestore:indexes

# 3. Wait for indexes to be READY in Firebase console, then:
firebase deploy --only firestore:rules

# 4. Deploy the new function
firebase deploy --only functions:aggregateCampaignTaps

# 5. Verify in console
firebase functions:log --only aggregateCampaignTaps
```

---

## VERIFICATION

- [ ] Function appears in Firebase console → Functions list
- [ ] Schedule shows "every 15 minutes"
- [ ] After first run, pick a campaign doc in Firestore → should have `aggregates` object
- [ ] Tap count matches manual query: `db.collection('taps').where('campaignId','==',<id>).count()`
- [ ] No errors in Cloud Functions logs

---

## IMPORTANT RULES

- **DO NOT modify** `backend/` folder (Java Spring Boot — deprecated, don't touch)
- **DO NOT modify** existing `cardRedirect`, `api`, or `onWalletPassRequest` functions
- **DO NOT modify** existing `smartcards` or `cards` Firestore schemas
- **Node version:** functions use Node 20 — don't introduce ES modules syntax without checking package.json `type: "module"`
- **Cost guard:** `count()` aggregation is cheap (1 read per query regardless of result size) — use it aggressively for counts
- **Region:** `us-central1` for functions (matches existing). Firestore is `northamerica-northeast1` (cross-region read is fine for this use case)

## IF SOMETHING BREAKS

- **Scheduler not firing?** Enable Cloud Scheduler API in GCP console
- **`count()` not found?** Need `firebase-admin` ≥ 11.4 — check `functions/package.json`, upgrade if needed
- **Rules breaking existing writes?** Add `|| resource == null` guard for creates
- **Cost spike?** Check log output — if campaigns have >10K deals, you may need to page the deals query

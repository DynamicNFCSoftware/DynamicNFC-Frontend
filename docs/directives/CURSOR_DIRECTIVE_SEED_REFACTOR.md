# CURSOR DIRECTIVE — Multi-Region Seed Refactor + Tenant Reset Fix

**Priority:** HIGH  
**Estimated effort:** 2-3 hours  
**Branch:** `cursor/multi-region-seed-refactor`

---

## 🎯 MISSION

Replace 3 seed files (`realEstateSeed.js`, `automotiveSeed.js`, `yachtSeed.js`) with fully enriched, region-aware data for all 4 regions (Gulf, USA, Mexico, Canada). Fix `tenantService.js` so the new seed properly replaces old data instead of mixing with it.

**Final result:** When a user logs in and switches between regions, the dashboard shows completely different, market-accurate data (Gulf → Riyadh/Khalid, USA → Manhattan/Daniel, Mexico → Polanco/Carlos, Canada → Vancouver/James).

---

## 🚨 CURRENT BUG BEING FIXED

The `/unified` dashboard currently shows a **mix of old and new data** — for example, in USA region it displays both "Khalid Al-Rashid" (Gulf persona) AND "Daniel Roberts" (USA persona) simultaneously.

**Root cause identified:**
1. `tenantService.js` has `SEED_VERSION = "2.0-multisector"` hardcoded
2. When the seed runs, it only writes new documents — it does NOT delete old documents first
3. So after a partial re-seed, Firestore contains both the old Gulf data AND new region data in the same tenant collections

**The fix:** Version bump + "delete old data before writing new" logic.

---

## 📋 SCOPE — WHAT TO DO

### PART 1 — Fix `tenantService.js` (CRITICAL)

**File:** `src/services/tenantService.js`

**Step 1.1** — Bump the seed version:
```javascript
// Change this line:
export const SEED_VERSION = "2.0-multisector";

// To:
export const SEED_VERSION = "2.1-region-enriched";
```

**Step 1.2** — In `seedTenantData` (or whatever function performs the seed), add a "clean slate" step BEFORE writing new data. The logic should be:

```
if tenant exists AND seedVersion !== SEED_VERSION:
    1. Delete all documents from these subcollections:
       - tenants/{uid}/cards
       - tenants/{uid}/leads  
       - tenants/{uid}/deals
       - tenants/{uid}/campaigns
       - tenants/{uid}/events
    2. Then run the normal seed write logic
    3. Update tenant doc with new seedVersion
```

**Important:** Use Firestore batched writes (max 500 operations per batch). If a collection has more than 500 docs, loop through batches.

**Reference code pattern:**
```javascript
async function clearTenantSubcollection(uid, subcollectionName) {
  const ref = collection(db, `tenants/${uid}/${subcollectionName}`);
  const snap = await getDocs(ref);
  if (snap.empty) return;
  
  // Batch delete (max 500 per batch)
  const batches = [];
  let currentBatch = writeBatch(db);
  let count = 0;
  
  snap.docs.forEach((doc) => {
    currentBatch.delete(doc.ref);
    count++;
    if (count === 500) {
      batches.push(currentBatch.commit());
      currentBatch = writeBatch(db);
      count = 0;
    }
  });
  if (count > 0) batches.push(currentBatch.commit());
  await Promise.all(batches);
  console.log(`[TENANT CLEANUP] Cleared ${snap.size} docs from ${subcollectionName}`);
}
```

**Step 1.3** — Keep the existing `console.log("[TENANT CHECK] ...")` logging and add:
```javascript
console.log("[TENANT RESEED] Version mismatch detected, clearing old data before reseed");
```

### PART 2 — Rewrite 3 Seed Files

**Files to replace:**
- `src/services/seeds/realEstateSeed.js` (a 470-line reference version was written by Claude — use its structure as a baseline)
- `src/services/seeds/automotiveSeed.js`
- `src/services/seeds/yachtSeed.js`

**Function signature (do not change):**
```javascript
export function buildRealEstateSeed(baseTimeMs = Date.now(), regionId = "gulf")
export function buildAutomotiveSeed(baseTimeMs = Date.now(), regionId = "gulf")
export function buildYachtSeed(baseTimeMs = Date.now(), regionId = "gulf")
```

**Return structure (do not change):**
```javascript
return { cards, leads, deals, campaigns, events };
```

**Each region must produce:**
- 8 cards (with sector-specific items — see DATA TABLES below)
- 4 leads
- 4 deals
- 3 campaigns
- ~25-30 events (region personality: Gulf=hot urgent, USA=fast decisions, Mexico=long research, Canada=data-driven)

**Required card fields (ALL must be present):**
```javascript
{
  id, name, unitName, type, unitType, tower, location, status, pricing, price,
  views, downloads, bookings, totalTaps, lastTapAt,
  interestedVips, sparkline,
  campaignId, linkedCampaignId, linkedDealCount,
  assignedRepId, assignedRepName,
  highlight, paymentPlan,
  createdAt, updatedAt,
  sector, region
}
```

For automotive, replace `unitName/unitType/tower` with `vehicleName/vehicleType/collection` — but ALSO include `unitName` (= vehicleName) as an alias for dashboard compatibility.

For yacht, add `charterWeekly` field in addition to `pricing` — yacht sales story needs charter revenue.

**Required deal fields:**
```javascript
{
  id, name, title, leadName, item, unitName, value, stage,
  score, velocity, probability, triggers, atRisk, vipLinked,
  campaignId, assignedRep,
  createdAt, updatedAt, lastSeen, expectedCloseAt,
  sector, region
}
```

**Required campaign fields:**
```javascript
{
  id, name, description, status, type, channel,  // type = channel alias
  objective, targetAudience, audience,  // audience = targetAudience alias
  client, totalCards, activeCards, cardIds,
  budget, spent, sent, opened, clicked, converted,
  source, startDate, endDate, createdAt,
  sector, region
}
```

**Required event fields:**
```javascript
{
  id, event, timestamp, portalType,
  vipName (or userName or leadName or sessionId),
  unitName, unitType, tower,  // when applicable
  metadata,
  sector, region
}
```

**Event types allowed (these match real portal trackEvent actions):**
- `portal_opened`, `marketplace_visit`
- `view_unit`, `view_floorplan`, `download_brochure`
- `explore_payment_plan`, `request_pricing`
- `comparison_view`, `book_viewing`, `contact_advisor`
- `cta_explore`, `cta_booking`, `cta_browse`
- `roi_calculator_click`, `language_switch`
- `filter_units` (marketplace only), `lead_form_shown`, `lead_captured`

---

## 📊 DATA TABLES — Use These Exact Values

### REAL ESTATE — 32 CARDS (4 regions × 8)

#### 🇸🇦 Gulf / Al Noor Residences (Riyadh)
Client: "Al Noor Residences" | Currency: SAR | Reps: Ahmed Al-Sayed (rep_gulf_01), Noura Al-Qahtani (rep_gulf_02), Omar Al-Rashid (rep_gulf_03)

| ID | Unit Name | Tower | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RE-GULF-001 | Sky Penthouse A | Al Qamar Tower | penthouse | 9500000 | reserved | 142 | 38 | 4 | 27 | 3 | 8,12,15,22,18,27,35 | 4BR · 5BA · 4,800 sqft | 0 |
| RE-GULF-002 | Sky Penthouse B | Al Qamar Tower | penthouse | 11000000 | available | 98 | 24 | 2 | 19 | 2 | 5,8,12,10,18,22,23 | 4BR · 5BA · 5,200 sqft | 0 |
| RE-GULF-003 | Royal 3BR A | Al Safwa Tower | 3br | 5200000 | available | 76 | 18 | 2 | 15 | 2 | 4,6,8,12,10,14,22 | 3BR · 3BA · 2,400 sqft | 1 |
| RE-GULF-004 | Royal 3BR B | Al Safwa Tower | 3br | 5500000 | available | 54 | 12 | 1 | 10 | 1 | 3,4,6,8,6,10,17 | 3BR · 3BA · 2,500 sqft | 1 |
| RE-GULF-005 | Garden 3BR | Al Safwa Tower | 3br | 5800000 | available | 82 | 22 | 3 | 18 | 2 | 6,10,12,15,14,18,21 | 3BR · 3BA · 2,600 sqft | 1 |
| RE-GULF-006 | Marina 2BR A | Al Qamar Tower | 2br | 3600000 | available | 45 | 8 | 0 | 7 | 1 | 2,4,5,8,6,10,10 | 2BR · 2BA · 1,600 sqft | 0 |
| RE-GULF-007 | Studio Bay 1 | Al Safwa Tower | studio | 1800000 | available | 28 | 4 | 0 | 3 | 0 | 1,2,3,4,2,8,8 | Studio · 1BA · 650 sqft | 1 |
| RE-GULF-008 | Garden 4BR | Al Rawda Tower | 4br | 7200000 | available | 8 | 0 | 0 | 2 | 0 | 1,0,1,2,1,1,3 | 4BR · 4BA · 3,800 sqft | 2 |

Payment plans: penthouse="20/80 · 5yr", 3br="30/70 · 4yr", 2br="40/60 · 3yr", studio="40/60 · 3yr", 4br="20/80 · 5yr"

#### 🇺🇸 USA / Skyline Towers (Manhattan, NY)
Client: "Skyline Towers" | Currency: USD | Reps: Jessica Parker (rep_usa_01), Michael Chen (rep_usa_02)

| ID | Unit Name | Tower | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RE-USA-001 | Madison Penthouse 52A | Madison Tower | penthouse | 22500000 | reserved | 168 | 42 | 5 | 31 | 4 | 10,15,18,25,22,32,40 | 5BR · 6BA · 6,200 sqft | 0 |
| RE-USA-002 | Hudson Loft 3B | Hudson Tower | 3br | 6200000 | available | 112 | 28 | 3 | 22 | 3 | 6,10,14,18,16,22,28 | 3BR · 3BA · 2,800 sqft | 1 |
| RE-USA-003 | Central Park Suite 28 | Park Tower | 3br | 9800000 | available | 95 | 24 | 2 | 18 | 2 | 5,8,12,16,14,20,25 | 3BR · 3.5BA · 3,100 sqft | 0 |
| RE-USA-004 | Madison Residence 38B | Madison Tower | 2br | 5400000 | available | 68 | 14 | 1 | 12 | 1 | 4,6,8,12,10,16,20 | 2BR · 2.5BA · 2,200 sqft | 1 |
| RE-USA-005 | Hudson Garden Duplex | Hudson Tower | 4br | 12500000 | available | 58 | 12 | 1 | 10 | 1 | 3,5,8,10,9,12,18 | 4BR · 4BA · 3,900 sqft | 0 |
| RE-USA-006 | Park View Studio 12 | Park Tower | studio | 1950000 | available | 42 | 8 | 0 | 6 | 0 | 2,3,5,7,5,8,12 | Studio · 1BA · 780 sqft | 1 |
| RE-USA-007 | Madison Loft 22A | Madison Tower | 2br | 4800000 | sold | 88 | 22 | 3 | 16 | 0 | 12,15,18,16,14,10,8 | 2BR · 2BA · 1,950 sqft | 0 |
| RE-USA-008 | Hudson Penthouse 48 | Hudson Tower | penthouse | 18500000 | available | 14 | 2 | 0 | 4 | 0 | 2,1,2,3,2,2,4 | 4BR · 5BA · 5,400 sqft | 0 |

Payment plans: penthouse="20/80 · 10yr jumbo", 3br="30/70 · 7yr", 2br="30/70 · 7yr", studio="30/70 · 5yr", 4br="25/75 · 10yr"

#### 🇲🇽 Mexico / Residencias del Sol (Polanco, CDMX)
Client: "Residencias del Sol" | Currency: MXN | Reps: Alejandro Herrera (rep_mex_01), Sofia Mendez (rep_mex_02)

| ID | Unit Name | Tower | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RE-MEX-001 | Polanco Penthouse 18A | Torre del Sol | penthouse | 85000000 | reserved | 128 | 32 | 4 | 24 | 3 | 8,12,16,20,18,26,32 | 4BR · 5BA · 520 m² | 0 |
| RE-MEX-002 | Reforma 3BR | Torre Luna | 3br | 42000000 | available | 88 | 20 | 2 | 16 | 2 | 5,8,12,15,12,18,22 | 3BR · 3BA · 260 m² | 1 |
| RE-MEX-003 | Chapultepec Suite | Torre Mirador | 3br | 55000000 | available | 74 | 16 | 2 | 14 | 2 | 4,6,10,12,10,14,19 | 3BR · 3.5BA · 310 m² | 0 |
| RE-MEX-004 | Reforma 2BR A | Torre Luna | 2br | 28000000 | available | 52 | 10 | 1 | 9 | 1 | 3,5,7,10,8,12,15 | 2BR · 2BA · 175 m² | 1 |
| RE-MEX-005 | Polanco Garden 4BR | Torre del Sol | 4br | 62000000 | available | 45 | 10 | 1 | 8 | 1 | 2,4,6,8,6,10,13 | 4BR · 4BA · 380 m² | 0 |
| RE-MEX-006 | Reforma Studio 8 | Torre Luna | studio | 12000000 | available | 32 | 5 | 0 | 4 | 0 | 1,2,4,5,4,6,8 | Studio · 1BA · 85 m² | 1 |
| RE-MEX-007 | Chapultepec 2BR B | Torre Mirador | 2br | 32000000 | available | 38 | 8 | 1 | 6 | 1 | 2,3,5,7,6,8,11 | 2BR · 2BA · 190 m² | 0 |
| RE-MEX-008 | Polanco Sky 21 | Torre del Sol | 3br | 48500000 | sold | 72 | 18 | 3 | 14 | 0 | 15,18,16,14,10,8,5 | 3BR · 3BA · 280 m² | 0 |

Payment plans: penthouse="30/70 · 5yr", 3br="30/70 · 4yr", 2br="40/60 · 4yr", studio="40/60 · 3yr", 4br="25/75 · 5yr"

#### 🇨🇦 Canada / Vista Residences (Vancouver, BC)
Client: "Vista Residences" | Currency: CAD | Reps: Jennifer MacDonald (rep_can_01), Marc Patel (rep_can_02)

| ID | Unit Name | Tower | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RE-CAN-001 | Harbour Penthouse 41A | Pacific Tower | penthouse | 12800000 | reserved | 138 | 35 | 4 | 26 | 3 | 9,14,18,22,20,28,36 | 4BR · 5BA · 4,200 sqft | 0 |
| RE-CAN-002 | Seawall 3BR | Vista Tower | 3br | 4800000 | available | 92 | 22 | 3 | 17 | 2 | 6,9,12,16,14,20,24 | 3BR · 3BA · 1,950 sqft | 1 |
| RE-CAN-003 | Coal Harbour Suite | Pacific Tower | 3br | 5900000 | available | 82 | 18 | 2 | 15 | 2 | 5,8,12,14,12,18,23 | 3BR · 3BA · 2,100 sqft | 0 |
| RE-CAN-004 | Vista 2BR A | Vista Tower | 2br | 3200000 | available | 62 | 14 | 1 | 11 | 1 | 3,5,8,10,9,14,18 | 2BR · 2BA · 1,400 sqft | 1 |
| RE-CAN-005 | Harbour Loft 32 | Pacific Tower | 2br | 3950000 | available | 56 | 12 | 1 | 10 | 1 | 3,5,7,9,8,12,16 | 2BR · 2BA · 1,650 sqft | 0 |
| RE-CAN-006 | Vista Studio Plus | Vista Tower | studio | 1480000 | available | 38 | 7 | 0 | 5 | 0 | 2,3,4,6,4,8,11 | Studio · 1BA · 720 sqft | 1 |
| RE-CAN-007 | Seawall Garden 4BR | Vista Tower | 4br | 6200000 | available | 44 | 10 | 1 | 8 | 1 | 2,4,6,8,7,10,13 | 4BR · 3BA · 2,400 sqft | 1 |
| RE-CAN-008 | Coal Harbour Penthouse 45 | Pacific Tower | penthouse | 10500000 | available | 22 | 3 | 0 | 5 | 0 | 2,1,3,4,2,3,7 | 4BR · 4BA · 3,600 sqft | 0 |

Payment plans: penthouse="25/75 · 5yr", 3br="30/70 · 5yr", 2br="35/65 · 5yr", studio="35/65 · 3yr", 4br="25/75 · 5yr"

---

### AUTOMOTIVE — 32 CARDS (4 regions × 8)

Vehicle-specific field naming: use `vehicleName`, `vehicleType`, `collection` (instead of `unitName`, `unitType`, `tower`). ALSO include `unitName = vehicleName` alias for dashboard compatibility.

#### 🇸🇦 Gulf / Prestige Motors (Riyadh) — Mercedes-Benz
Currency: SAR | Reps: Omar Al-Shehri (rep_gulf_auto_01), Faisal Al-Dossary (rep_gulf_auto_02) | Use "Ijarah" instead of "Lease" in paymentPlan

| ID | Vehicle | Collection | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep | Payment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AU-GULF-001 | Mercedes-AMG GT 63 S | AMG Performance | coupe | 895000 | reserved | 156 | 42 | 3 | 28 | 3 | 10,14,18,24,22,30,38 | 630HP · 0-60 in 3.1s · V8 Biturbo | 0 | Ijarah SAR 14,500/mo · 36mo |
| AU-GULF-002 | Mercedes-AMG G 63 | AMG Performance | suv | 1250000 | available | 189 | 48 | 4 | 34 | 4 | 12,16,22,28,26,34,45 | 585HP · MANUFAKTUR · Most-requested | 0 | Ijarah SAR 19,800/mo · 36mo |
| AU-GULF-003 | Mercedes-Maybach GLS 600 | Maybach Luxury | suv | 1150000 | available | 124 | 30 | 2 | 22 | 2 | 7,10,14,18,16,22,28 | 550HP · Chauffeur Package · 4 Seats | 1 | Ijarah SAR 18,200/mo · 48mo |
| AU-GULF-004 | Mercedes-Benz S 580 4MATIC | Executive Sedan | sedan | 680000 | available | 92 | 22 | 2 | 17 | 2 | 5,8,12,15,13,18,23 | 510HP · Executive Rear · V8 | 1 | Ijarah SAR 11,800/mo · 48mo |
| AU-GULF-005 | Mercedes-AMG SL 63 | AMG Performance | roadster | 950000 | available | 68 | 14 | 1 | 12 | 1 | 4,6,9,12,10,14,18 | 585HP · Convertible · AMG Active Ride | 0 | Ijarah SAR 15,400/mo · 36mo |
| AU-GULF-006 | Mercedes-Maybach S 680 | Maybach Luxury | sedan | 1450000 | available | 58 | 12 | 1 | 10 | 1 | 3,5,8,11,9,13,17 | 621HP · V12 · First-Class Rear | 1 | Ijarah SAR 23,500/mo · 48mo |
| AU-GULF-007 | Mercedes-AMG C 63 S E-Performance | AMG Performance | sedan | 520000 | available | 48 | 9 | 0 | 7 | 0 | 2,4,6,8,6,10,14 | 671HP · Hybrid · Plug-in | 0 | Ijarah SAR 8,900/mo · 48mo |
| AU-GULF-008 | Mercedes-EQS 580 4MATIC | Electric | sedan | 720000 | available | 14 | 2 | 0 | 3 | 0 | 1,2,1,3,2,2,4 | 516HP · 450mi Range · Electric | 1 | Ijarah SAR 12,200/mo · 48mo |

#### 🇺🇸 USA / Premier Auto Group (Beverly Hills) — Multi-brand
Currency: USD | Reps: Brandon Mitchell (rep_usa_auto_01), Alexis Rivera (rep_usa_auto_02)

| ID | Vehicle | Collection | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep | Payment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AU-USA-001 | Porsche 911 Turbo S | Porsche Performance | coupe | 265000 | reserved | 172 | 44 | 5 | 32 | 4 | 11,16,20,26,24,34,42 | 640HP · 0-60 in 2.6s · AWD | 0 | Lease $3,850/mo · 36mo |
| AU-USA-002 | Lamborghini Urus Performante | Lamborghini | suv | 310000 | available | 198 | 52 | 4 | 36 | 4 | 13,18,24,30,28,38,48 | 657HP · 0-60 in 3.1s · V8 Twin-Turbo | 0 | Lease $4,480/mo · 36mo |
| AU-USA-003 | Range Rover SV | Range Rover | suv | 220000 | available | 134 | 32 | 3 | 24 | 3 | 8,12,16,21,19,26,32 | 523HP · 5.0L V8 · SV Bespoke | 1 | Lease $2,980/mo · 48mo |
| AU-USA-004 | Porsche Taycan Turbo S | Porsche Performance | sedan | 195000 | available | 105 | 26 | 2 | 19 | 2 | 6,10,14,17,15,21,26 | 750HP · 0-60 in 2.4s · Electric | 0 | Lease $2,790/mo · 48mo |
| AU-USA-005 | Lamborghini Huracán Tecnica | Lamborghini | coupe | 245000 | available | 82 | 16 | 1 | 14 | 1 | 5,8,11,14,12,17,22 | 631HP · 0-60 in 3.2s · V10 | 0 | Lease $3,520/mo · 36mo |
| AU-USA-006 | Porsche Cayenne Turbo GT | Porsche Performance | suv | 185000 | available | 72 | 14 | 1 | 12 | 1 | 4,7,10,13,11,15,19 | 650HP · Ring Record Holder | 1 | Lease $2,680/mo · 48mo |
| AU-USA-007 | Range Rover Sport SV | Range Rover | suv | 178000 | available | 52 | 10 | 0 | 8 | 0 | 3,5,7,9,7,11,15 | 626HP · Carbon Ceramic Brakes | 1 | Lease $2,540/mo · 48mo |
| AU-USA-008 | Lamborghini Revuelto | Lamborghini | coupe | 625000 | available | 18 | 3 | 0 | 4 | 0 | 2,1,2,3,2,2,6 | 1,001HP · V12 Plug-in Hybrid · Halo car | 0 | Lease $8,950/mo · 36mo |

#### 🇲🇽 Mexico / Autos Premiere (Polanco) — BMW & Audi
Currency: MXN | Reps: Ricardo Vazquez (rep_mex_auto_01), Isabella Ortiz (rep_mex_auto_02)

| ID | Vehicle | Collection | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep | Payment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AU-MEX-001 | BMW X7 M60i | BMW M | suv | 3290000 | reserved | 142 | 36 | 4 | 26 | 3 | 9,13,17,22,20,28,35 | 523HP · 7 Seats · xDrive | 0 | Lease MX$48,500/mo · 48mo |
| AU-MEX-002 | Audi RS Q8 | Audi Sport | suv | 2850000 | available | 168 | 42 | 4 | 30 | 4 | 11,15,20,26,24,32,40 | 591HP · 0-60 in 3.7s · V8 | 1 | Lease MX$42,000/mo · 48mo |
| AU-MEX-003 | BMW M8 Gran Coupe | BMW M | coupe | 3550000 | available | 112 | 28 | 3 | 21 | 3 | 7,11,15,18,16,22,28 | 617HP · Twin-Turbo V8 · M xDrive | 0 | Lease MX$52,500/mo · 48mo |
| AU-MEX-004 | Audi e-tron GT RS | Audi Sport | sedan | 2650000 | available | 88 | 20 | 2 | 16 | 2 | 5,8,12,15,13,18,22 | 637HP · 0-60 in 3.1s · Electric | 1 | Lease MX$39,000/mo · 48mo |
| AU-MEX-005 | BMW M5 Competition | BMW M | sedan | 2480000 | available | 72 | 15 | 1 | 12 | 1 | 4,7,10,13,11,15,19 | 617HP · 0-60 in 3.2s · M xDrive | 0 | Lease MX$36,500/mo · 48mo |
| AU-MEX-006 | Audi RS 7 Sportback | Audi Sport | sedan | 2280000 | available | 62 | 12 | 1 | 10 | 1 | 3,6,8,11,9,13,17 | 591HP · Quattro · Sport Differential | 1 | Lease MX$33,800/mo · 48mo |
| AU-MEX-007 | BMW X5 M Competition | BMW M | suv | 2380000 | available | 48 | 9 | 0 | 7 | 0 | 2,4,6,8,6,10,14 | 617HP · M Differential · M Sport | 0 | Lease MX$35,500/mo · 48mo |
| AU-MEX-008 | Audi R8 Performance | Audi Sport | coupe | 4200000 | available | 12 | 1 | 0 | 3 | 0 | 1,0,2,3,1,2,3 | 610HP · V10 · Last production year | 1 | Lease MX$62,500/mo · 36mo |

#### 🇨🇦 Canada / Prestige Motors Vancouver — Porsche & Audi EV-forward
Currency: CAD | Reps: Ethan Chen (rep_can_auto_01), Chloe Thompson (rep_can_auto_02)

| ID | Vehicle | Collection | Type | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Rep | Payment |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AU-CAN-001 | Porsche Taycan Turbo S | Porsche Electric | sedan | 285000 | reserved | 148 | 38 | 4 | 28 | 3 | 10,14,19,24,22,30,38 | 750HP · 0-60 in 2.4s · 280mi Range | 0 | Lease CA$4,150/mo · 48mo |
| AU-CAN-002 | Audi RS e-tron GT | Audi e-tron | sedan | 195000 | available | 168 | 42 | 4 | 31 | 4 | 11,16,21,27,25,33,41 | 637HP · 232mi Range · Quattro | 0 | Lease CA$2,880/mo · 48mo |
| AU-CAN-003 | Porsche Cayenne Turbo GT | Porsche Performance | suv | 265000 | available | 108 | 26 | 3 | 20 | 3 | 7,11,14,18,16,22,28 | 650HP · Ring Record · Incl. Lux Tax | 1 | Lease CA$3,880/mo · 48mo |
| AU-CAN-004 | Audi RS Q8 | Audi Sport | suv | 218000 | available | 92 | 22 | 2 | 18 | 2 | 6,9,13,16,14,20,25 | 591HP · 0-60 in 3.7s · V8 | 1 | Lease CA$3,220/mo · 48mo |
| AU-CAN-005 | Porsche 911 GT3 | Porsche Performance | coupe | 245000 | available | 78 | 16 | 1 | 13 | 1 | 5,8,11,14,12,17,21 | 502HP · Naturally Aspirated · Track | 0 | Lease CA$3,620/mo · 36mo |
| AU-CAN-006 | Audi RS 6 Avant | Audi Sport | wagon | 158000 | available | 68 | 14 | 1 | 11 | 1 | 4,7,9,12,10,14,18 | 591HP · Performance Wagon · Quattro | 1 | Lease CA$2,340/mo · 48mo |
| AU-CAN-007 | Porsche Macan GTS | Porsche Performance | suv | 102000 | available | 52 | 10 | 0 | 8 | 0 | 3,5,7,9,7,11,14 | 434HP · PDK 7-speed · Sport Chrono | 1 | Lease CA$1,520/mo · 48mo |
| AU-CAN-008 | Audi e-tron Sportback | Audi e-tron | suv | 125000 | available | 16 | 2 | 0 | 4 | 0 | 1,2,1,3,1,2,6 | 402HP · 218mi Range · Quattro | 0 | Lease CA$1,850/mo · 48mo |

---

### YACHT — 32 CARDS (4 regions × 8)

Yacht naming: use `yachtName`, `yachtType`, `marina` — ALSO include `unitName = yachtName` alias. Add `charterWeekly` field.

#### 🇦🇪 Gulf / Gulf Marina Yachts (Dubai, UAE)
Currency: AED | Reps: Khalid Al-Maktoum (rep_gulf_yacht_01), Mohammed Al-Hammadi (rep_gulf_yacht_02)

| ID | Yacht | Builder/Type | Marina | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Charter | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| YA-GULF-001 | Azimut Grande 35 Metri | motor | Dubai Marina | 38000000 | reserved | 168 | 44 | 4 | 30 | 3 | 10,15,20,26,24,33,40 | 12 guests · 6 cabins · 28 knots | 320000 | 0 |
| YA-GULF-002 | Princess X95 | motor | Jumeirah Bay Marina | 42500000 | available | 148 | 38 | 3 | 26 | 3 | 8,12,17,22,20,28,36 | 10 guests · 5 cabins · 26 knots | 285000 | 0 |
| YA-GULF-003 | Sunseeker 88 | motor | Mina Rashid | 26000000 | available | 112 | 28 | 2 | 20 | 2 | 6,10,14,18,16,22,28 | 8 guests · 4 cabins · 29 knots | 185000 | 1 |
| YA-GULF-004 | Benetti Oasis 40M | motor | Dubai Marina | 48000000 | available | 88 | 22 | 2 | 16 | 2 | 5,8,12,15,13,18,23 | 12 guests · 6 cabins · Wellness Deck | 380000 | 0 |
| YA-GULF-005 | Pershing 9X | sport | Mina Rashid | 22500000 | available | 68 | 14 | 1 | 12 | 1 | 4,6,9,12,10,14,18 | 8 guests · 3 cabins · 42 knots | 160000 | 1 |
| YA-GULF-006 | Ferretti 1000 | motor | Dubai Marina | 32000000 | available | 58 | 12 | 1 | 10 | 1 | 3,5,8,11,9,13,17 | 10 guests · 5 cabins · 26 knots | 225000 | 0 |
| YA-GULF-007 | Sanlorenzo SL90 Asymmetric | motor | Mina Rashid | 28500000 | available | 42 | 8 | 0 | 7 | 0 | 2,4,6,8,6,10,14 | 8 guests · 4 cabins · Award-winning | 195000 | 1 |
| YA-GULF-008 | Lürssen 85M Custom | superyacht | Dubai Marina | 285000000 | available | 12 | 1 | 0 | 3 | 0 | 1,0,1,2,1,1,4 | 16 guests · 8 cabins · Helipad · Custom | 1800000 | 0 |

#### 🇺🇸 USA / Pacific Coast Yachts (San Diego, CA)
Currency: USD | Reps: Robert Harrison (rep_usa_yacht_01), Ashley Chen (rep_usa_yacht_02)

| ID | Yacht | Builder/Type | Marina | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Charter | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| YA-USA-001 | Westport 40M | motor | San Diego Marina | 18500000 | reserved | 158 | 42 | 4 | 28 | 3 | 9,14,18,24,22,30,38 | 12 guests · 6 cabins · 22 knots | 145000 | 0 |
| YA-USA-002 | Viking 80 Convertible | sportfish | Point Loma | 6800000 | available | 142 | 36 | 3 | 24 | 3 | 8,12,16,22,20,28,34 | 6 anglers · 4 cabins · 42 knots | 65000 | 0 |
| YA-USA-003 | Hatteras M98 Panacera | motor | Harbor Island | 12200000 | available | 108 | 26 | 2 | 19 | 2 | 6,10,14,17,15,21,27 | 10 guests · 5 cabins · 24 knots | 98000 | 1 |
| YA-USA-004 | Nordhavn 80 | explorer | San Diego Marina | 9400000 | available | 92 | 22 | 2 | 17 | 2 | 5,8,12,15,13,18,23 | 8 guests · 4 cabins · Ocean-crossing | 72000 | 0 |
| YA-USA-005 | Bertram 61 Convertible | sportfish | Point Loma | 3800000 | available | 72 | 15 | 1 | 12 | 1 | 4,7,10,13,11,15,19 | 5 anglers · 3 cabins · 44 knots | 42000 | 1 |
| YA-USA-006 | Ocean Alexander 90R | motor | Harbor Island | 8900000 | available | 62 | 13 | 1 | 10 | 1 | 3,6,8,11,9,13,17 | 8 guests · 4 cabins · Raised Pilothouse | 68000 | 0 |
| YA-USA-007 | Grady-White Canyon 456 | sportfish | Point Loma | 1250000 | available | 45 | 9 | 0 | 8 | 0 | 2,4,6,8,6,10,14 | 6 anglers · Day boat · Quad Yamaha 600s | 0 | 1 |
| YA-USA-008 | Feadship 80M Custom | superyacht | San Diego Marina | 195000000 | available | 14 | 2 | 0 | 4 | 0 | 1,1,1,2,1,2,5 | 14 guests · 7 cabins · Dutch flagship | 1400000 | 0 |

#### 🇲🇽 Mexico / Marina del Caribe (Cancún & Cabo)
Currency: MXN | Reps: Ricardo Hernandez (rep_mex_yacht_01), Valentina Cruz (rep_mex_yacht_02)

| ID | Yacht | Builder/Type | Marina | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Charter | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| YA-MEX-001 | Ferretti Custom Line 130 | motor | Cabo Marina | 340000000 | reserved | 148 | 38 | 4 | 26 | 3 | 9,13,18,23,21,29,36 | 12 guests · 6 cabins · 22 knots | 2800000 | 0 |
| YA-MEX-002 | Azimut Magellano 66 | motor | Puerto Cancún | 65000000 | available | 112 | 28 | 3 | 21 | 3 | 7,10,14,18,16,22,28 | 8 guests · 4 cabins · Long-range | 520000 | 1 |
| YA-MEX-003 | Sunseeker Predator 74 | sport | Puerto Vallarta | 78000000 | available | 92 | 22 | 2 | 17 | 2 | 5,8,12,15,13,18,23 | 6 guests · 3 cabins · 38 knots | 640000 | 0 |
| YA-MEX-004 | Princess Y85 | motor | Puerto Cancún | 92000000 | available | 78 | 16 | 1 | 14 | 1 | 4,7,10,13,11,15,19 | 8 guests · 4 cabins · Flybridge | 720000 | 1 |
| YA-MEX-005 | Boston Whaler 420 Outrage | sportfish | Cabo Marina | 18500000 | available | 68 | 13 | 1 | 11 | 1 | 4,6,9,12,10,14,18 | 8 anglers · Quad Mercury 450s | 145000 | 0 |
| YA-MEX-006 | Azimut S7 | sport | Puerto Cancún | 42000000 | available | 58 | 12 | 1 | 9 | 1 | 3,5,8,11,9,13,16 | 6 guests · 3 cabins · 34 knots | 340000 | 1 |
| YA-MEX-007 | Intrepid 477 Panacea | sport | Cabo Marina | 14200000 | available | 38 | 7 | 0 | 6 | 0 | 2,3,5,7,5,9,12 | 6 guests · Day boat · 55 knots | 115000 | 0 |
| YA-MEX-008 | Benetti Oasis 34M | motor | Cabo Marina | 180000000 | available | 10 | 1 | 0 | 2 | 0 | 1,0,1,2,1,1,3 | 10 guests · 5 cabins · Beach Club | 1200000 | 1 |

#### 🇨🇦 Canada / Pacific Marina Yachts (Vancouver, BC)
Currency: CAD | Reps: William Sullivan (rep_can_yacht_01), Rebecca Nakamura (rep_can_yacht_02)

| ID | Yacht | Builder/Type | Marina | Pricing | Status | Views | DL | Book | Taps | VIPs | Sparkline | Highlight | Charter | Rep |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| YA-CAN-001 | Nordhavn 86 | explorer | Coal Harbour Marina | 11500000 | reserved | 162 | 42 | 4 | 29 | 3 | 10,14,19,24,22,31,38 | 8 guests · 5 cabins · Ocean-crossing | 85000 | 0 |
| YA-CAN-002 | Grand Banks 85 | motor | Royal Vancouver YC | 8500000 | available | 128 | 32 | 3 | 23 | 3 | 7,11,15,20,18,25,32 | 8 guests · 4 cabins · 18 knots | 62000 | 0 |
| YA-CAN-003 | Ocean Alexander 90R | motor | Granville Marina | 12800000 | available | 98 | 24 | 2 | 18 | 2 | 6,9,13,16,14,20,25 | 10 guests · 5 cabins · Raised Pilothouse | 92000 | 1 |
| YA-CAN-004 | Nordhavn 68 | explorer | Coal Harbour Marina | 6200000 | available | 82 | 18 | 2 | 15 | 2 | 5,8,11,14,12,17,22 | 6 guests · 4 cabins · Trans-Pacific | 52000 | 0 |
| YA-CAN-005 | Fleming 65 | explorer | Royal Vancouver YC | 4800000 | available | 68 | 14 | 1 | 12 | 1 | 4,6,9,12,10,14,18 | 6 guests · 3 cabins · Bluewater | 42000 | 1 |
| YA-CAN-006 | Princess Y80 | motor | Coal Harbour Marina | 7800000 | available | 58 | 12 | 1 | 10 | 1 | 3,5,8,11,9,13,17 | 8 guests · 4 cabins · 28 knots | 58000 | 0 |
| YA-CAN-007 | Grady-White Canyon 376 | sportfish | Granville Marina | 680000 | available | 42 | 8 | 0 | 7 | 0 | 2,4,6,8,6,10,14 | 6 anglers · Twin Yamaha 425s | 0 | 1 |
| YA-CAN-008 | Burger 140 Raised Pilothouse | superyacht | Coal Harbour Marina | 58000000 | available | 11 | 1 | 0 | 3 | 0 | 1,0,1,2,1,1,4 | 12 guests · 6 cabins · North American flagship | 480000 | 0 |

---

### CAMPAIGNS (3 per region × 3 sectors = 36 total)

For each region + sector, create 3 campaigns. Pattern:
1. **"VIP Access / Elite Circle" campaign** — status: active, channel: email or event, budget high-spend
2. **"Private Viewing / Collection" campaign** — status: active, channel: event, budget mid-spend
3. **"Spring Launch Preview"** — status: draft, channel: sms, budget=0 spent

Example for Gulf Real Estate:
```javascript
{ id: "camp_gulf_re_vip_winter", name: "Al Noor VIP Winter Access", description: "Premium NFC invitation for HNW buyers targeting penthouse collection", channel: "email", type: "email", objective: "viewings_booked", targetAudience: "high_intent_vips", audience: "high_intent_vips", totalCards: 24, activeCards: 18, budget: 280000, spent: 195000, status: "active", client: "Al Noor Residences", daysAgo: 30 }
```

Use realistic budgets per region:
- Gulf: 95K-280K SAR (RE), 150K-420K SAR (Auto), 320K-850K AED (Yacht)
- USA: 32K-85K USD (RE), 42K-120K USD (Auto), 52K-125K USD (Yacht)
- Mexico: 680K-2.4M MXN (RE), 980K-3.2M MXN (Auto), 1.2M-4.8M MXN (Yacht)
- Canada: 28K-68K CAD (RE), 28K-82K CAD (Auto), 38K-75K CAD (Yacht)

### DEALS (4 per region × 3 sectors = 48 total)

Each region has 4 deals linked to VIP personas from `regionConfig.js`:
- 1 at stage "negotiation" (score 87-93, velocity 7-12, atRisk: false)
- 1 at stage "viewing_scheduled" (score 74-82, velocity 10-15, atRisk: false)  
- 1 at stage "comparison" (score 65-72, velocity 16-22, atRisk: false)
- 1 at stage "contacted" or "inquiry" (score 48-58, velocity 24-32, atRisk: true)

Use top 4 cards from each region for deal items. Use personas from `getPersonas(sector, regionId)`.

### EVENTS (25-30 per region per sector)

Region personality:
- **Gulf**: 9-10 VIP1 events, 8 VIP2 events (urgent, high volume)
- **USA**: 10 VIP1 events (fast decisions), 7 VIP2 events
- **Mexico**: 8 VIP1, 9 VIP2 (long research pattern)
- **Canada**: 9 VIP1, 8 VIP2 (balanced, data-driven)

Event sequence example for VIP1:
```
portal_opened → view_unit (top card) → view_unit (alt card) → view_floorplan → 
comparison_view → explore_payment_plan → download_brochure → request_pricing → 
book_viewing → roi_calculator_click
```

Spread events over 9 days (daysAgo: 9 → 0.5). Use `getPersonas()` names from `regionConfig.js`.

---

## 🔑 CRITICAL REQUIREMENTS

1. **DO NOT break existing function signatures** — `buildRealEstateSeed(baseTimeMs, regionId)` must work with existing callers
2. **DO NOT change return structure** — `{ cards, leads, deals, campaigns, events }`
3. **Use `getPersonas(sector, regionId)`** from `../../config/regionConfig` for all VIP/family names — do NOT hardcode
4. **Include back-compat field aliases** (pricing+price, name+title, channel+type, audience+targetAudience) — dashboard reads both
5. **All objects must have `sector` and `region` fields** — required for filtering
6. **Use realistic sparklines** — hot units trending up, sold units declining, cold units flat
7. **No new npm packages** — use only what's already installed

---

## 🧪 VERIFICATION STEPS (run after implementation)

### Step 1 — Syntax check
```bash
cd frontend
node --check src/services/seeds/realEstateSeed.js
node --check src/services/seeds/automotiveSeed.js
node --check src/services/seeds/yachtSeed.js
node --check src/services/tenantService.js
```

### Step 2 — Build check
```bash
npm run build
```
Must complete without errors.

### Step 3 — Tenant reset + login test

**Oguzhan's tenant UID for manual deletion:** `kOH19wZNghNPD8VnfHMrRG76eN53`

1. Firebase Console → Firestore → `tenants/{uid}` → Delete document (with subcollections)
2. Clear browser cache
3. Open incognito → login at `localhost:3000/login`
4. Navigate to `/unified`
5. Verify console log shows:
   ```
   [TENANT CHECK] ... seedVersion: null, current: 2.1-region-enriched, needsSeed: true
   [TENANT SEED] Seed SUCCESS ... version: 2.1-region-enriched
   ```

### Step 4 — Visual dashboard check per region

Switch to each region via top-right region selector. Verify:

**Gulf (SAR):** VIP1 = Khalid Al-Rashid, project = Al Noor Residences, top unit = Sky Penthouse A (SAR 9,500,000), rep = Ahmed Al-Sayed

**USA (USD):** VIP1 = Daniel Roberts, project = Skyline Towers, top unit = Madison Penthouse 52A ($22,500,000), rep = Jessica Parker

**Mexico (MXN):** VIP1 = Carlos Rodriguez, project = Residencias del Sol, top unit = Polanco Penthouse 18A (MX$85,000,000), rep = Alejandro Herrera

**Canada (CAD):** VIP1 = James Mitchell, project = Vista Residences, top unit = Harbour Penthouse 41A (CA$12,800,000), rep = Jennifer MacDonald

### Step 5 — Dashboard widget checks

Verify these widgets show data (not empty/0):
- **KPI cards:** VIP Sessions, Website Visitors, Viewings Booked, VIP Conversion Lift → all non-zero
- **Who to call today:** Lists VIP1 with trigger reason
- **Units & Plans tab:** 8 units per region with views/downloads/bookings/sparklines
- **Pipeline tab:** 4 deals per region in different stages
- **Campaigns tab:** 3 campaigns per region with budget/spent bars
- **VIP CRM tab:** VIP1, VIP2, Fam1 with session/event counts

---

## ⚠️ IMPORTANT NOTES

- **Do NOT modify `regionConfig.js`** — persona names already correct there (verified)
- **Do NOT modify portal files** (`VIPPortal_Definitive.jsx`, `AhmedPortal.jsx`, `MarketplacePortal.jsx`) — region-awareness for portals is a separate future phase (memory #24)
- **The existing `realEstateSeed.js.backup` should remain untouched** — emergency rollback
- If you encounter any field the dashboard reads that's not in this directive's field list, **stop and ask** rather than guess
- Keep all events to the 17 `trackEvent` actions listed under "Event types allowed" — do not invent new event types

---

## 📦 DELIVERABLES

1. Modified `src/services/tenantService.js` (version bump + clean-slate logic)
2. New `src/services/seeds/realEstateSeed.js` (~32 cards × fully enriched fields + 16 deals + 12 campaigns + ~100 events)
3. New `src/services/seeds/automotiveSeed.js` (same structure, automotive content)
4. New `src/services/seeds/yachtSeed.js` (same structure, yacht content, with charterWeekly field)
5. PR titled: `feat(seeds): multi-region enriched seed + tenant reset fix`
6. PR description should include verification output from Step 3 (console log screenshots from browser)

---

**Start with PART 1 (tenantService.js fix), then PART 2 (seed files). Test incrementally. Good luck.**

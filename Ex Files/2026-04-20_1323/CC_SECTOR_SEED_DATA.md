# CC DIRECTIVE — Sector-Aware Seed Data (Automotive + Yacht)

**Owner:** Claude Code (backend / seed logic)
**Priority:** Pre-deploy blocker (Q6 Sector Switcher data layer)
**Date:** 2026-04-19
**Partner directive:** `CURSOR_SECTOR_DATA_FRONTEND.md` (parallel work — Cursor filters frontend)

---

## GOAL

Extend `seedTenantData()` in `frontend/src/services/tenantService.js` so that every new tenant gets demo data for **all three sectors** (Real Estate, Automotive, Yacht) — each Firestore document tagged with a `sector` field. Frontend filters by active sector; no re-seed on switch.

---

## SUCCESS CRITERIA

- New login seeds ~50–60 docs per sector (total ~150–180)
- Every doc carries `sector: "realEstate" | "automotive" | "yacht"`
- Automotive sector data uses luxury vehicles + dealership context (Mercedes/BMW/Porsche/Range Rover)
- Yacht sector data uses Mediterranean charter context (Sunseeker/Azimut/Ferretti)
- Existing Real Estate seed unchanged in content — only adds `sector: "realEstate"` field
- `seedVersion` bumped from current value → `"2.0-multisector"` so existing tenants re-seed on next login

---

## FILES TO TOUCH

1. `frontend/src/services/tenantService.js` (primary — 877 lines, target ~1100 after edit)
2. `frontend/src/services/seeds/automotiveSeed.js` (NEW FILE — extract for clarity)
3. `frontend/src/services/seeds/yachtSeed.js` (NEW FILE — extract for clarity)
4. `frontend/src/services/seeds/realEstateSeed.js` (NEW FILE — extract existing seed into here)

**Splitting into 3 seed files** keeps `tenantService.js` manageable and matches our "files >500 lines get truncated" pattern.

---

## AUTOMOTIVE SEED (luxury auto dealership)

### Cards (vehicles) — 12 units
```js
export const AUTOMOTIVE_CARDS = [
  { vin: "PM-001", model: "2025 Range Rover Sport SV", dealership: "Premier Downtown", type: "suv", price: 185000, status: "available", sector: "automotive" },
  { vin: "PM-002", model: "2025 Mercedes S-Class AMG S63e", dealership: "Premier Downtown", type: "sedan", price: 220000, status: "available", sector: "automotive" },
  { vin: "PM-003", model: "2025 Porsche 911 Turbo S", dealership: "Premier North", type: "coupe", price: 245000, status: "reserved", sector: "automotive" },
  { vin: "PM-004", model: "2024 Ferrari F8 Tributo", dealership: "Premier North", type: "coupe", price: 385000, status: "available", sector: "automotive" },
  { vin: "PM-005", model: "2025 BMW M760i xDrive", dealership: "Premier Downtown", type: "sedan", price: 175000, status: "available", sector: "automotive" },
  { vin: "PM-006", model: "2025 Bentley Continental GT Speed", dealership: "Premier North", type: "coupe", price: 295000, status: "available", sector: "automotive" },
  { vin: "PM-007", model: "2025 Lamborghini Urus S", dealership: "Premier Downtown", type: "suv", price: 275000, status: "reserved", sector: "automotive" },
  { vin: "PM-008", model: "2025 Aston Martin DBX707", dealership: "Premier North", type: "suv", price: 250000, status: "available", sector: "automotive" },
  { vin: "PM-009", model: "2025 Maserati MC20", dealership: "Premier North", type: "coupe", price: 215000, status: "available", sector: "automotive" },
  { vin: "PM-010", model: "2025 McLaren 750S Spider", dealership: "Premier Downtown", type: "coupe", price: 345000, status: "sold", sector: "automotive" },
  { vin: "PM-011", model: "2025 Rolls-Royce Ghost Black Badge", dealership: "Premier Downtown", type: "sedan", price: 395000, status: "available", sector: "automotive" },
  { vin: "PM-012", model: "2024 Lexus LC 500 Inspiration", dealership: "Premier North", type: "coupe", price: 115000, status: "available", sector: "automotive" },
];
```

### VIPs (leads) — 4
```js
export const AUTOMOTIVE_LEADS = [
  { name: "Khalid Al-Rashid", score: 95, status: "hot", topVehicle: "Ferrari F8 Tributo", triggers: ["test_drive_request", "high_velocity", "repeat_visitor"], sector: "automotive" },
  { name: "Sultan Al-Mahmoud", score: 88, status: "hot", topVehicle: "Rolls-Royce Ghost", triggers: ["brochure_download", "finance_inquiry"], sector: "automotive" },
  { name: "Marcus Chen", score: 42, status: "warm", topVehicle: "Porsche 911 Turbo S", triggers: ["gallery_view"], sector: "automotive" },
  { name: "Elena Petrova", score: 28, status: "cold", topVehicle: "BMW M760i", triggers: ["idle_lead"], sector: "automotive" },
];
```

### Deals — 6 (with automotive-specific stages)
Stages: `new_lead | contacted | test_drive | quote_sent | negotiation | financing | closed_won | closed_lost`

```js
export const AUTOMOTIVE_DEALS = [
  { title: "Ferrari F8 — Khalid Al-Rashid", vehicle: "2024 Ferrari F8 Tributo", lead: "Khalid Al-Rashid", stage: "negotiation", value: 385000, currency: "USD", sector: "automotive" },
  { title: "Rolls-Royce Ghost — Sultan", vehicle: "Rolls-Royce Ghost Black Badge", lead: "Sultan Al-Mahmoud", stage: "test_drive", value: 395000, currency: "USD", sector: "automotive" },
  { title: "911 Turbo S — Marcus Chen", vehicle: "Porsche 911 Turbo S", lead: "Marcus Chen", stage: "quote_sent", value: 245000, currency: "USD", sector: "automotive" },
  { title: "M760i Demo — Elena", vehicle: "BMW M760i xDrive", lead: "Elena Petrova", stage: "new_lead", value: 175000, currency: "USD", sector: "automotive" },
  { title: "Urus — Walk-in Prospect", vehicle: "Lamborghini Urus S", lead: "Walk-in: Anonymous", stage: "contacted", value: 275000, currency: "USD", sector: "automotive" },
  { title: "McLaren 750S — SOLD", vehicle: "McLaren 750S Spider", lead: "Private Collector", stage: "closed_won", value: 345000, currency: "USD", sector: "automotive" },
];
```

### Campaigns — 3
```js
export const AUTOMOTIVE_CAMPAIGNS = [
  { name: "Summer Launch Event 2026", client: "Premier Auto Group", status: "active", objective: "test_drive_conversion", targetAudience: "existing_vip_owners", channel: ["email", "nfc", "whatsapp"], budget: 85000, spent: 34000, startDate: "2026-04-01", endDate: "2026-07-31", sector: "automotive" },
  { name: "VIP Test Drive Weekend", client: "Premier Auto Group", status: "active", objective: "showroom_footfall", targetAudience: "hot_leads", channel: ["nfc", "direct_mail"], budget: 45000, spent: 12000, startDate: "2026-04-15", endDate: "2026-05-15", sector: "automotive" },
  { name: "Q1 Collector Series", client: "Premier Auto Group", status: "completed", objective: "exotic_sales", targetAudience: "private_collectors", channel: ["whatsapp", "direct_mail"], budget: 65000, spent: 63200, startDate: "2026-01-01", endDate: "2026-03-31", sector: "automotive" },
];
```

### Events — 30–40 synthetic tap/view events
Randomize across last 7 days. Types: `test_drive_request`, `brochure_download`, `finance_inquiry`, `gallery_view`, `spec_sheet_view`, `service_history_view`.

---

## YACHT SEED (Mediterranean charter + ownership)

### Cards (yachts) — 10 vessels
```js
export const YACHT_CARDS = [
  { hullId: "MAR-001", model: "Azimut Grande 36M", marina: "Monaco Port Hercule", type: "motor_yacht", length: 36, price: 12500000, status: "available", sector: "yacht" },
  { hullId: "MAR-002", model: "Sunseeker 95 Yacht", marina: "Cannes Vieux Port", type: "motor_yacht", length: 29, price: 8900000, status: "charter_only", sector: "yacht" },
  { hullId: "MAR-003", model: "Ferretti 920 Project", marina: "Monaco Port Hercule", type: "motor_yacht", length: 28, price: 7200000, status: "available", sector: "yacht" },
  { hullId: "MAR-004", model: "Benetti Oasis 40M", marina: "Port Camille Rayet", type: "motor_yacht", length: 40, price: 18500000, status: "reserved", sector: "yacht" },
  { hullId: "MAR-005", model: "Princess Y95", marina: "Cannes Vieux Port", type: "motor_yacht", length: 29, price: 7900000, status: "available", sector: "yacht" },
  { hullId: "MAR-006", model: "Pershing 9X", marina: "Monaco Port Hercule", type: "sport_yacht", length: 28, price: 6800000, status: "charter_only", sector: "yacht" },
  { hullId: "MAR-007", model: "Lürssen 55M Project Athena", marina: "Port Camille Rayet", type: "superyacht", length: 55, price: 42000000, status: "available", sector: "yacht" },
  { hullId: "MAR-008", model: "Riva 110 Dolcevita", marina: "Portofino", type: "motor_yacht", length: 33, price: 11800000, status: "available", sector: "yacht" },
  { hullId: "MAR-009", model: "Wally 107 Saudade", marina: "Saint-Tropez", type: "sailing_yacht", length: 32, price: 6200000, status: "charter_only", sector: "yacht" },
  { hullId: "MAR-010", model: "Sanlorenzo SP110", marina: "Monaco Port Hercule", type: "motor_yacht", length: 33, price: 10500000, status: "available", sector: "yacht" },
];
```

### VIPs — 3
```js
export const YACHT_LEADS = [
  { name: "Alexander Volkov", score: 92, status: "hot", topYacht: "Lürssen 55M", triggers: ["viewing_scheduled", "broker_inquiry", "ownership_interest"], sector: "yacht" },
  { name: "Isabella Rossi", score: 68, status: "warm", topYacht: "Riva 110 Dolcevita", triggers: ["charter_inquiry", "monaco_show_visit"], sector: "yacht" },
  { name: "Rashid Al-Thani", score: 34, status: "warm", topYacht: "Azimut Grande 36M", triggers: ["brochure_request"], sector: "yacht" },
];
```

### Deals — 4
Stages (yacht-specific): `inquiry | viewing_scheduled | sea_trial | offer_made | survey | escrow | closed_won | charter_booked`

```js
export const YACHT_DEALS = [
  { title: "Lürssen 55M — Volkov", yacht: "Lürssen 55M Project Athena", lead: "Alexander Volkov", stage: "offer_made", value: 42000000, currency: "EUR", sector: "yacht" },
  { title: "Riva 110 — Rossi Charter", yacht: "Riva 110 Dolcevita", lead: "Isabella Rossi", stage: "charter_booked", value: 280000, currency: "EUR", note: "2-week Mediterranean charter", sector: "yacht" },
  { title: "Azimut 36M — Al-Thani", yacht: "Azimut Grande 36M", lead: "Rashid Al-Thani", stage: "inquiry", value: 12500000, currency: "EUR", sector: "yacht" },
  { title: "Sanlorenzo SP110 — Private Broker", yacht: "Sanlorenzo SP110", lead: "Broker: Marine Partners Monaco", stage: "sea_trial", value: 10500000, currency: "EUR", sector: "yacht" },
];
```

### Campaigns — 2
```js
export const YACHT_CAMPAIGNS = [
  { name: "Monaco Yacht Show 2026 VIP", client: "Dynamic Marine", status: "active", objective: "superyacht_viewings", targetAudience: "uhnwi_invite_only", channel: ["concierge", "nfc", "whatsapp"], budget: 180000, spent: 72000, startDate: "2026-09-01", endDate: "2026-09-30", sector: "yacht" },
  { name: "Mediterranean Charter Season", client: "Dynamic Marine", status: "active", objective: "charter_bookings", targetAudience: "family_offices", channel: ["email", "nfc"], budget: 95000, spent: 41000, startDate: "2026-04-01", endDate: "2026-10-31", sector: "yacht" },
];
```

### Events — 20–25 synthetic events
Types: `viewing_scheduled`, `sea_trial_request`, `brochure_request`, `charter_inquiry`, `broker_contact`, `monaco_show_visit`, `ownership_interest`.

---

## CODE CHANGES

### 1. Create `frontend/src/services/seeds/realEstateSeed.js`
Extract existing Real Estate seed data from current `tenantService.js :: seedTenantData`. Export as:
```js
export const REAL_ESTATE_CARDS = [ ... ];      // existing unit cards
export const REAL_ESTATE_LEADS = [ ... ];      // Khalid, Fatima, Ahmed
export const REAL_ESTATE_DEALS = [ ... ];
export const REAL_ESTATE_CAMPAIGNS = [ ... ];
export const REAL_ESTATE_EVENTS = [ ... ];
```

**ADD `sector: "realEstate"`** to every object in these arrays.

### 2. Create `frontend/src/services/seeds/automotiveSeed.js`
Paste the arrays from the Automotive section above.

### 3. Create `frontend/src/services/seeds/yachtSeed.js`
Paste the arrays from the Yacht section above.

### 4. Refactor `tenantService.js :: seedTenantData`

```js
import { REAL_ESTATE_CARDS, REAL_ESTATE_LEADS, REAL_ESTATE_DEALS, REAL_ESTATE_CAMPAIGNS, REAL_ESTATE_EVENTS } from "./seeds/realEstateSeed";
import { AUTOMOTIVE_CARDS, AUTOMOTIVE_LEADS, AUTOMOTIVE_DEALS, AUTOMOTIVE_CAMPAIGNS } from "./seeds/automotiveSeed";
import { YACHT_CARDS, YACHT_LEADS, YACHT_DEALS, YACHT_CAMPAIGNS } from "./seeds/yachtSeed";

const SEED_VERSION = "2.0-multisector";

export async function seedTenantData(uid, userInfo = {}, regionId = "gulf") {
  // Check seedVersion — if matches, skip
  const settingsRef = doc(db, "tenants", uid, "settings", "preferences");
  const settingsSnap = await getDoc(settingsRef);
  if (settingsSnap.exists() && settingsSnap.data().seedVersion === SEED_VERSION) {
    return { skipped: true, reason: "already seeded at current version" };
  }

  // Clear old data if re-seeding
  await clearTenantSubcollections(uid);

  // Seed Real Estate
  await seedSector(uid, "realEstate", {
    cards: REAL_ESTATE_CARDS,
    leads: REAL_ESTATE_LEADS,
    deals: REAL_ESTATE_DEALS,
    campaigns: REAL_ESTATE_CAMPAIGNS,
    events: REAL_ESTATE_EVENTS,
  });

  // Seed Automotive
  await seedSector(uid, "automotive", {
    cards: AUTOMOTIVE_CARDS,
    leads: AUTOMOTIVE_LEADS,
    deals: AUTOMOTIVE_DEALS,
    campaigns: AUTOMOTIVE_CAMPAIGNS,
    events: generateAutomotiveEvents(),  // 30-40 synthetic events
  });

  // Seed Yacht
  await seedSector(uid, "yacht", {
    cards: YACHT_CARDS,
    leads: YACHT_LEADS,
    deals: YACHT_DEALS,
    campaigns: YACHT_CAMPAIGNS,
    events: generateYachtEvents(),  // 20-25 synthetic events
  });

  // Write seed version
  await setDoc(settingsRef, {
    seedVersion: SEED_VERSION,
    seededAt: serverTimestamp(),
    regionId,
    userInfo,
  }, { merge: true });

  return { seeded: true, version: SEED_VERSION };
}

async function seedSector(uid, sectorId, data) {
  const batch = writeBatch(db);
  const timestamp = serverTimestamp();

  data.cards.forEach((card) => {
    const ref = doc(collection(db, "tenants", uid, "cards"));
    batch.set(ref, { ...card, sector: sectorId, createdAt: timestamp });
  });
  data.leads.forEach((lead) => {
    const ref = doc(collection(db, "tenants", uid, "leads"));
    batch.set(ref, { ...lead, sector: sectorId, createdAt: timestamp });
  });
  data.deals.forEach((deal) => {
    const ref = doc(collection(db, "tenants", uid, "deals"));
    batch.set(ref, { ...deal, sector: sectorId, createdAt: timestamp });
  });
  data.campaigns.forEach((campaign) => {
    const ref = doc(collection(db, "tenants", uid, "campaigns"));
    batch.set(ref, { ...campaign, sector: sectorId, createdAt: timestamp });
  });
  data.events.forEach((event) => {
    const ref = doc(collection(db, "tenants", uid, "events"));
    batch.set(ref, { ...event, sector: sectorId, timestamp: event.timestamp || timestamp });
  });

  await batch.commit();
}

function generateAutomotiveEvents() {
  // 30-40 synthetic events across last 7 days
  // Types: test_drive_request, brochure_download, finance_inquiry, gallery_view, spec_sheet_view, service_history_view
  // See existing generateRealEstateEvents() as template
}

function generateYachtEvents() {
  // 20-25 synthetic events across last 7 days
  // Types: viewing_scheduled, sea_trial_request, brochure_request, charter_inquiry, broker_contact, ownership_interest
  // See existing generateRealEstateEvents() as template
}
```

### 5. Update `resetTenantData()` (if exists) — use new version

### 6. Firestore Indexes (`firestore.indexes.json`)

Add composite indexes for sector-filtered queries:
```json
{
  "collectionGroup": "cards",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "sector", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

Repeat for `leads`, `deals`, `campaigns`, `events`.

---

## VERIFICATION

After CC completes:

```bash
# Build check
cd frontend && npm run build

# File integrity
wc -l src/services/tenantService.js                # should be ~500-600 (shrunk from 877)
wc -l src/services/seeds/realEstateSeed.js         # ~200-300
wc -l src/services/seeds/automotiveSeed.js         # ~150-200
wc -l src/services/seeds/yachtSeed.js              # ~150-200

# Tail check (no truncation)
tail -5 src/services/tenantService.js              # should end with proper exports/closing
```

### Manual test
1. Delete tenant doc in Firestore console (or sign out + use different account)
2. Log in → seed should run, write `seedVersion: "2.0-multisector"`
3. Open Firestore console → `tenants/{uid}/cards` should have ~32 docs (12 auto + 10 yacht + ~10 real estate)
4. Each card doc should have `sector` field
5. Counts per sector:
   - Real Estate: ~10 cards, 3 leads, 5 deals
   - Automotive: 12 cards, 4 leads, 6 deals
   - Yacht: 10 cards, 3 leads, 4 deals

### Coordination with Cursor
Frontend filtering directive (`CURSOR_SECTOR_DATA_FRONTEND.md`) runs **in parallel**. Cursor will:
- Add `sectorId` to `useDashboardData` filter
- Backwards-compat: treat missing `sector` field as `"realEstate"` during transition

---

## ROLLBACK

If build breaks or Firestore rules reject batch writes:
- Revert `tenantService.js` from git
- Remove `seeds/` folder
- Set `SEED_VERSION` back to previous value so existing tenants don't re-seed

---

## DONE WHEN

- [ ] 3 seed files created under `frontend/src/services/seeds/`
- [ ] `tenantService.js` refactored with `seedSector()` + 3 sector calls
- [ ] `SEED_VERSION` bumped to `"2.0-multisector"`
- [ ] Firestore indexes updated
- [ ] Fresh login seeds all 3 sectors (verified in Firestore console)
- [ ] `npm run build` passes
- [ ] Every seeded doc has `sector` field

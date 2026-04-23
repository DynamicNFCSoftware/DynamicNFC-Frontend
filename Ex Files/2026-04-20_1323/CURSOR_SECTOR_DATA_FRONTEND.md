# CURSOR DIRECTIVE — Sector-Aware Dashboard Data Layer (Frontend)

**Partner directive:** `CC_SECTOR_SEED_DATA.md` (runs in parallel — Claude Code owns the seed side)
**Owner:** Cursor
**Priority:** Q6 Pre-Deploy Blocker
**Est. effort:** ~60-90 min

---

## 1. WHY

Right now the sector switcher in the topbar is cosmetic. When Oguzhan picks **Automotive**, the dashboard still shows Real Estate cards (Sky Penthouse, Family Haven, Garden 3BR). Root cause: `useDashboardData` does not filter by sector, and `developerThemes.js` only swaps UI labels — not the underlying data shape or content dictionary.

Claude Code is seeding three parallel sector datasets (realEstate / automotive / yacht) with a `sector` field on every doc. **Your job is the reader side**: filter by sector in `useDashboardData`, surface the active sector from `useSector`, and extend `developerThemes.js` with content schemas for automotive + yacht so labels, column headers, and placeholder text match the dataset.

---

## 2. SUCCESS CRITERIA

- Topbar sector switcher = **Real Estate** → dashboard shows only docs with `sector: "realEstate"` (or missing sector, backwards-compat). Tables, KPIs, charts all match.
- Topbar sector switcher = **Automotive** → dashboard shows only docs with `sector: "automotive"`. Units & Plans column headers read "VIN", "Model", "Dealership", "Price". Cards shown: Range Rover Sport SV, S-Class AMG, Porsche 911 Turbo S, Ferrari F8, etc.
- Topbar sector switcher = **Yacht** → dashboard shows only docs with `sector: "yacht"`. Units & Plans column headers read "Hull ID", "Model", "Marina", "Length", "Price". Cards shown: Azimut Grande 36M, Sunseeker 95, Ferretti 920, etc.
- KPI counts (active deals, hot leads, total cards) update when sector switches.
- Empty states show sector-appropriate copy ("No vehicles in this dealership yet" vs "No units in this tower yet").
- `npm run build` clean.
- Build size per-chunk does not jump > 30 KB.

---

## 3. FILES YOU WILL TOUCH

| File | Change | Est. lines |
|------|--------|-----------|
| `frontend/src/hooks/useDashboardData.js` | Add `sectorId` filter to cards/leads/deals/campaigns/events queries | +40 |
| `frontend/src/hooks/useSector.js` | Expose `activeSectorId` for consumers | +5 (verify) |
| `frontend/src/config/developerThemes.js` | Add automotive + yacht content schemas | +120 |
| `frontend/src/pages/UnifiedDashboard/tabs/InventoryTab.jsx` | Use sector-aware column config | +20 edits |
| `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx` | Use sector-aware column config | +10 edits |
| `frontend/src/pages/UnifiedDashboard/tabs/PipelineTab.jsx` | Use sector-aware deal stage config | +10 edits |
| `frontend/src/pages/UnifiedDashboard/i18n/*.js` | Add automotive/yacht labels | +30 per lang |

**DO NOT TOUCH:**
- `tenantService.js` → Claude Code owns this file in its directive. Wait for CC to finish.
- Any seed file under `seeds/` → created by CC.
- `firestore.indexes.json` → CC adds sector indexes.

---

## 4. TASK A — `useDashboardData.js` sector filter

### Current shape (verify first)
```js
export function useDashboardData() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  // ... onSnapshot for tenants/{uid}/cards, leads, deals, campaigns, events
}
```

### New shape
```js
import { useSector } from "../hooks/useSector";

export function useDashboardData() {
  const { user } = useAuth();
  const { activeSectorId } = useSector();   // "realEstate" | "automotive" | "yacht"

  // Inside each onSnapshot, filter by sector AFTER reading:
  // (keep query simple — no composite index needed in client; Firestore already has one)
  const filterBySector = (docs) =>
    docs.filter((d) => (d.sector || "realEstate") === activeSectorId);

  // Example for cards:
  useEffect(() => {
    if (!user?.uid) return;
    const ref = collection(db, "tenants", user.uid, "cards");
    const unsub = onSnapshot(ref, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCards(filterBySector(all));
    });
    return unsub;
  }, [user?.uid, activeSectorId]);
  // ^^ IMPORTANT: include activeSectorId in dep array so switching sector re-filters
}
```

### Backwards-compatibility
Every doc without a `sector` field is treated as `"realEstate"`. This covers any legacy tenant data from before the seed v2.0 migration runs.

### Apply to ALL five collections
- `cards`
- `leads`
- `deals`
- `campaigns`
- `events`

### Derived memos (`inventoryMetrics`, `pipelineMetrics`, etc.)
No change needed — they consume `cards` / `deals` / `leads` which are already filtered.

---

## 5. TASK B — `useSector.js` verification

Open the file and confirm it exports:
```js
export function useSector() {
  return {
    activeSectorId,   // "realEstate" | "automotive" | "yacht"
    setActiveSectorId,
    availableSectors, // [{ id, label, icon, enabled }]
  };
}
```

If `activeSectorId` is not exposed, add it. If the hook currently returns only UI metadata, wire it to localStorage key `dynamicnfc.activeSector` so the choice persists across reloads.

---

## 6. TASK C — `developerThemes.js` content schemas

### Current shape (Real Estate only)
```js
export const developerThemes = {
  vista: { towers: [...], unitTypes: [...], columns: [...] },
  alnoor: { towers: [...], unitTypes: [...], columns: [...] },
};
```

### Add sector-level schemas
```js
export const sectorSchemas = {
  realEstate: {
    entityLabel: { en: "Unit", ar: "وحدة", es: "Unidad", fr: "Unité" },
    entityLabelPlural: { en: "Units", ar: "الوحدات", es: "Unidades", fr: "Unités" },
    parentLabel: { en: "Tower", ar: "برج", es: "Torre", fr: "Tour" },
    parentLabelPlural: { en: "Towers", ar: "الأبراج", es: "Torres", fr: "Tours" },
    idLabel: { en: "Unit #", ar: "رقم الوحدة", es: "N.º Unidad", fr: "N° Unité" },
    priceLabel: { en: "Price", ar: "السعر", es: "Precio", fr: "Prix" },
    columns: ["unitNumber", "tower", "type", "beds", "sqm", "price", "status"],
    dealStages: ["inquiry", "viewing", "offer", "negotiation", "contract", "closed_won", "closed_lost"],
    emptyState: {
      en: "No units in this tower yet",
      ar: "لا توجد وحدات في هذا البرج بعد",
      es: "Aún no hay unidades en esta torre",
      fr: "Aucune unité dans cette tour",
    },
  },

  automotive: {
    entityLabel: { en: "Vehicle", ar: "مركبة", es: "Vehículo", fr: "Véhicule" },
    entityLabelPlural: { en: "Vehicles", ar: "المركبات", es: "Vehículos", fr: "Véhicules" },
    parentLabel: { en: "Dealership", ar: "معرض", es: "Concesionario", fr: "Concession" },
    parentLabelPlural: { en: "Dealerships", ar: "المعارض", es: "Concesionarios", fr: "Concessions" },
    idLabel: { en: "VIN", ar: "رقم الشاسيه", es: "VIN", fr: "VIN" },
    priceLabel: { en: "Sticker Price", ar: "السعر", es: "Precio", fr: "Prix" },
    columns: ["vin", "model", "dealership", "type", "year", "price", "status"],
    dealStages: ["inquiry", "test_drive", "financing", "trade_in_eval", "contract", "delivery", "closed_won", "closed_lost"],
    emptyState: {
      en: "No vehicles in this dealership yet",
      ar: "لا توجد مركبات في هذا المعرض بعد",
      es: "Aún no hay vehículos en este concesionario",
      fr: "Aucun véhicule dans cette concession",
    },
  },

  yacht: {
    entityLabel: { en: "Yacht", ar: "يخت", es: "Yate", fr: "Yacht" },
    entityLabelPlural: { en: "Yachts", ar: "اليخوت", es: "Yates", fr: "Yachts" },
    parentLabel: { en: "Marina", ar: "مرسى", es: "Puerto", fr: "Port" },
    parentLabelPlural: { en: "Marinas", ar: "المراسي", es: "Puertos", fr: "Ports" },
    idLabel: { en: "Hull ID", ar: "رقم الهيكل", es: "ID Casco", fr: "N° Coque" },
    priceLabel: { en: "Asking Price", ar: "السعر", es: "Precio", fr: "Prix" },
    columns: ["hullId", "model", "marina", "length", "year", "price", "status"],
    dealStages: ["inquiry", "viewing_scheduled", "sea_trial", "offer_made", "survey", "escrow", "closed_won", "charter_booked", "closed_lost"],
    emptyState: {
      en: "No yachts in this marina yet",
      ar: "لا توجد يخوت في هذا المرسى بعد",
      es: "Aún no hay yates en este puerto",
      fr: "Aucun yacht dans ce port",
    },
  },
};

export function getSectorSchema(sectorId, lang = "en") {
  const s = sectorSchemas[sectorId] || sectorSchemas.realEstate;
  return {
    entityLabel: s.entityLabel[lang] || s.entityLabel.en,
    entityLabelPlural: s.entityLabelPlural[lang] || s.entityLabelPlural.en,
    parentLabel: s.parentLabel[lang] || s.parentLabel.en,
    parentLabelPlural: s.parentLabelPlural[lang] || s.parentLabelPlural.en,
    idLabel: s.idLabel[lang] || s.idLabel.en,
    priceLabel: s.priceLabel[lang] || s.priceLabel.en,
    columns: s.columns,
    dealStages: s.dealStages,
    emptyState: s.emptyState[lang] || s.emptyState.en,
  };
}
```

---

## 7. TASK D — Wire schemas into tabs

### InventoryTab.jsx
Replace hardcoded column headers with schema-driven:
```jsx
import { useSector } from "../../../hooks/useSector";
import { getSectorSchema } from "../../../config/developerThemes";
import { useLanguage } from "../../../i18n/LanguageContext";

const { activeSectorId } = useSector();
const { language } = useLanguage();
const schema = getSectorSchema(activeSectorId, language);

// Column header:
<th>{schema.idLabel}</th>         {/* was "Unit #" */}
<th>{schema.parentLabel}</th>     {/* was "Tower" */}
<th>{schema.priceLabel}</th>      {/* was "Price" */}

// KPI card title:
<h3>{schema.entityLabelPlural}</h3>  {/* was "Units" */}

// Empty state:
<div className="ud-inv-empty">{schema.emptyState}</div>
```

### CardsTab.jsx
Same pattern — "Card" label stays (cards are still NFC cards regardless of sector) but the **linked entity** label swaps.

### PipelineTab.jsx
Swap hardcoded `["inquiry", "viewing", "offer", ...]` stage list with `schema.dealStages`. Kanban columns auto-render from the schema array.

### AddDealModal.jsx
Stage dropdown reads from `schema.dealStages`.

---

## 8. TASK E — Translation keys

Add to i18n files (`en.js`, `ar.js`, `es.js`, `fr.js`):
```js
sector: {
  realEstate: { /* ... already exists */ },
  automotive: {
    dealershipLabel: "Dealership",
    vinLabel: "VIN",
    testDriveScheduled: "Test drive scheduled",
    financingApproved: "Financing approved",
    tradeInValue: "Trade-in value",
    // ~15 keys
  },
  yacht: {
    marinaLabel: "Marina",
    hullIdLabel: "Hull ID",
    seaTrialScheduled: "Sea trial scheduled",
    surveyCompleted: "Survey completed",
    charterConverted: "Converted to charter",
    // ~15 keys
  },
},
```

Parity required: all 4 languages get the same keys.

---

## 9. VERIFICATION

Run after each phase:
```bash
cd frontend
npm run build               # must succeed
wc -l src/hooks/useDashboardData.js   # verify not truncated
wc -l src/config/developerThemes.js
tail -5 src/hooks/useDashboardData.js # must end with proper close
tail -5 src/config/developerThemes.js
```

### Manual test (after CC side is also done and user re-logs in to trigger re-seed)
1. Login → confirm localStorage `dynamicnfc.activeSector` = `"realEstate"`
2. Dashboard shows Vista towers + units
3. Switch topbar → Automotive
4. Dashboard re-renders: cards become vehicles (Range Rover, Ferrari, etc.), column headers swap to VIN/Model/Dealership/Price, KPI cards update counts
5. Switch topbar → Yacht
6. Dashboard re-renders: cards become yachts, column headers swap to Hull ID/Model/Marina/Length/Price
7. Switch back → Real Estate. Data returns to original view.
8. Reload browser — sector persists (localStorage).
9. Change language EN → AR. All sector labels translate.

---

## 10. TRUNCATION GUARDRAILS

`useDashboardData.js` is **>1000 lines** and has been truncated 3x in prior sessions. After every edit:
1. `wc -l frontend/src/hooks/useDashboardData.js`  (baseline ~1217, after your edits ~1260)
2. `tail -5 frontend/src/hooks/useDashboardData.js` must show closing `}` and `export` block intact.
3. `npm run build` — if it errors "Unexpected end of input" or "Unterminated string", the file was truncated. Restore from git and retry.

Same check for `developerThemes.js` after your additions.

---

## 11. ROLLBACK

If something breaks mid-edit:
```bash
cd frontend
git diff src/hooks/useDashboardData.js
git checkout -- src/hooks/useDashboardData.js src/config/developerThemes.js
```

No data-layer rollback needed — your changes are read-only filters. The CC side owns the seed changes and has its own rollback path.

---

## 12. HANDOFF CHOREOGRAPHY

1. **CC runs first** — seeds `sector` field onto docs. After CC commits, Oguzhan should log out → log in → confirm seedVersion bumped to `2.0-multisector` in Firestore console.
2. **Then Cursor** — applies this directive. Filter will activate immediately on next sector switch.
3. **Verify together** — manual test in section 9.
4. **If Cursor finishes before CC** — that is fine. The filter treats missing `sector` as `"realEstate"`, so the dashboard keeps working in its current state until the re-seed lands.

---

## 13. DONE CHECKLIST

- [ ] `useDashboardData` filters cards by sector (respects `activeSectorId` from `useSector`)
- [ ] Same filter applied to leads, deals, campaigns, events
- [ ] Backwards-compat: docs without `sector` field treated as `"realEstate"`
- [ ] `useSector` exposes `activeSectorId` + persists to localStorage
- [ ] `developerThemes.js` exports `sectorSchemas` + `getSectorSchema(sectorId, lang)`
- [ ] InventoryTab uses schema-driven column headers + empty state
- [ ] CardsTab uses schema-driven labels
- [ ] PipelineTab/AddDealModal use `schema.dealStages`
- [ ] i18n parity: EN/AR/ES/FR all have sector.automotive + sector.yacht keys
- [ ] `npm run build` clean
- [ ] File line counts verified (not truncated)
- [ ] Manual test: sector switcher swaps data correctly in Units & Plans, Cards, Pipeline tabs
- [ ] RTL check: switch to Arabic in Automotive sector → layout stays clean, labels translate

---

## 14. NOTES

- Sector filter is **client-side** filtering after Firestore read. For ~150 docs/tenant (50 per sector), this is cheap and avoids composite-index cost. If a tenant ever exceeds 500 docs, migrate to server-side `where("sector", "==", activeSectorId)` queries — CC has already added the indexes.
- Do not couple sector filtering to `developerThemes` (the tower/dealership/marina dictionary). Sector filtering is about **which docs to read**; developer themes are about **what to label them**. Keep these two concepts separate in code.
- Currency localization (Q6.5) is a separate directive and is explicitly the LAST pre-deploy fix. Don't touch currency formatting in this pass.

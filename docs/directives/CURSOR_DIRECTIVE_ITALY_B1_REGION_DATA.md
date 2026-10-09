# CURSOR DIRECTIVE — Italy B1: Italy as the 5th region (data only) + Canada default + repo tidy

**Branch:** `feat/italy-b1-region-data` (from latest `main`)          **Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`, `memory/project_decisions_2026_10.md`

## 1. Goal

Italy becomes a first-class 5th region in the Unified Dashboard and the demo data, built exactly like the
existing regions (same routes, same components, data via `regionConfig.js` / seeds / `getPersonas`).
When this is done: picking **Italy** in the dashboard country selector shows Italian personas, Italian
projects, prices in **EUR**, Italian time zone — in all 3 sectors. The UI text itself may still be English
(Italian UI = directive B2, demo portals = B3). Also: **Canada becomes the default region** and the region
order everywhere becomes **Canada, Italy, USA, Mexico, Gulf** (Oguzhan's decision 2026-10-08:
Canada is home base, Italy is the priority expansion market).

No new routes, no new pages, no per-region route copies (the "16-page anti-pattern").

## 2. Italy data (use exactly; invent nothing beyond this)

| Item | Value |
|---|---|
| id / ID prefix | `italy` / `ITA` (e.g. `RE-ITA-001`, `AU-ITA-001`, `YA-ITA-001`) — follow how `MEX`/`CAN` prefixes are built in each seed |
| label | `{ en: 'Italy', it: 'Italia', fr: 'Italie', es: 'Italia', ar: 'إيطاليا' }` |
| flag / codes | 🇮🇹 · UnifiedLayout `REGION_CODES`: `IT` · gateways `REGION_CODE`: `ITA` |
| languages / default | `['it', 'en']` / `'it'` · rtl `{ it: false, en: false }` |
| currency | `EUR`, symbol `€`, locale `it-IT` · **no** forced prefix (Intl renders `1.250.000 €`) |
| `getEffectiveLocale` | `italy: { it: 'it-IT', en: 'en-GB' }` |
| time zone | `Europe/Rome` · `aiDemoShared` city `Milan`, TZ abbr `CET`, marina abbr `CET`, locale line `Locale: Bilingual IT/EN` |
| sidebarAccent | `#007a3d` (green, ≥4.5:1 contrast with white text) |
| dealValueRange | `{ min: 400000, max: 12000000 }` |

**Projects** (fictional names — do not use real hotel/developer names):
- Real estate: **Residenze del Lario** — Lake Como (Cernobbio) + Milan. Buildings: `Villa Lario`, `Palazzo Brera`, `Corte Navigli`.
- Automotive: **Autosalone Brera Milano** — supercar showroom, Milan. Vehicles (real models, as other regions do): Ferrari Purosangue, Lamborghini Revuelto, Maserati MC20, Ferrari Roma, Lamborghini Urus. Flagship code `PUROSANGUE`.
- Yacht: **Riviera Ligure Yachts** — Portofino base, Porto Cervo (Sardinia) as second marina. Vessels from Italian yards (Azimut, Ferretti, Riva, Sanlorenzo, Benetti) — same field shape and count as the other regions.

**Personas** (`role` gets `en` + `it` + the keys the other regions already carry):
- Real estate: `vip1` Alessandro Conti (VIP Investor / Investitore VIP), `vip2` Giulia Romano (VIP Buyer / Acquirente VIP), `fam1` Marco Bianchi (Family Buyer / Acquirente famiglia), `fam2` Francesca Ricci (Family Buyer / Acquirente famiglia).
- Automotive: `vip1` Matteo Ferraro (VIP Collector / Collezionista VIP), `vip2` Chiara Esposito (VIP Client / Cliente VIP).
- Yacht: `vip1` Federico Marino (VIP Owner / Armatore VIP), `vip2` Sofia Colombo (VIP Charter / Charter VIP).
- Emails: `@residenzelario.it`, `@autosalonebrera.it`, `@rivieraligure.it`.
- Sales reps — real estate: Elena Russo, Davide Moretti · automotive: Paolo Greco, Laura Fontana · yacht: reuse the RE pair unless the yacht seed has its own list (then: Giorgio Bruno, Silvia Gallo).

Prices: realistic EUR (Como/Milan penthouse ~4–12M, 2BR ~0.9–2M; cars at Italian list prices; yachts in EUR).
Units in m² (like Mexico). Payment plans in Italian-market terms (e.g. `"30/70 · mutuo 20 anni"` — mortgage-style, no Ijarah).
Copy the **shape and count** of the Mexico entries in every file (8 cards, 3 campaigns, etc.). Where Mexico has an
`es` field, Italy has `it` (plus `en`). Consumers already fall back to `en`.

## 3. Scope — files to touch

Region core:
- `frontend/src/config/regionConfig.js` — `ITALY` object; `REGIONS`, `REGION_LIST` (order: CANADA, ITALY, USA, MEXICO, GULF); `DEFAULT_REGION = 'canada'`; `getRegion` fallback → `REGIONS[DEFAULT_REGION]` (not `GULF`); `getEffectiveLocale`; add `it` to the other regions' `label` objects.
- `frontend/src/services/tenantService.js` — `REGIONS` list (same order) + `SEED_VERSION` bump to `"2.3-italy"`; default params `"gulf"` → `DEFAULT_REGION`.
- Default params `regionId = "gulf"` → `DEFAULT_REGION` in: `services/seeds/{realEstate,automotive,yacht}Seed.js`, `services/mockDashboardData.js`, `pages/UnifiedDashboard/tabs/VIPCrmTab.jsx:390`.

Data (one `italy` block each, Mexico as the template):
- `services/seeds/realEstateSeed.js`, `automotiveSeed.js`, `yachtSeed.js`
- `config/realEstateUnitData.js` (4 Mexico blocks → 4 Italy blocks), `data/automotiveVehicleData.js`, `data/yachtVesselData.js`, `data/automotivePersonas.js`
- `config/sectorConfig.js` (reps, 2 places), `hooks/useDashboardData.js:1102` (reps) — **large file: Large File Protocol**
- `config/mapRegionConfig.js`, `pages/AIDemo/aiDemoData.js`, `pages/AutomotiveDemo/autoAiDemoData.js` (`FLAGSHIP_CODE`), `services/aiDemoShared.js` (4 maps)
- `components/{Region,Automotive,Yacht}MorphLoader/*.jsx` — Italy entry + Italy mini-map path (simple boot-shaped path, same style as the others) — **check file sizes, Large File Protocol**
- `components/UnifiedDashboard/FiveMinuteProof/TutorialStep.jsx` (`italy: "DEL LARIO · 2026"`, `"ITALY"`)
- `pages/UnifiedDashboard/UnifiedLayout.jsx` (`REGION_CODES`), `pages/AutomotiveDemo/AutoGateway.jsx`, `pages/YachtDemo/YachtGateway.jsx` (`REGION_CODE`), `pages/AutomotiveDemo/autoGatewayTranslations.js` (Italy label in all languages)
- `pages/CRMGateway/CRMGateway.jsx:299` — replace the nested ternary with a small `REGION_CODE` map like AutoGateway (adds `ITA`)
- `utils/portalTracking.js:26` regex — add `italy`
- Tests: `config/__tests__/regionConfig.test.js` and any seed tests — update counts (5 regions × 3 sectors × 8 = **120 cards, 60 deals, 45 campaigns** per tenant) and add Italy cases.

Docs: `CLAUDE.md` §3 + §12 — add an **Italy** row/section mirroring the data above, markets order Canada, Italy, USA, Mexico, Gulf, seed baseline 120/60/45.

Repo tidy (same PR, separate commit `chore: tidy untracked leftovers`):
- Move all files from `frontend/directives/` to `docs/directives/` (`git mv` for tracked files, plain move for untracked), then delete the empty folder.
- Commit `functions/package-lock.json`.
- Add to root `.gitignore`: `/Claude outputs/` and `/Ex Files/**/package-lock.json`.

**Must NOT be touched:** `/admin/*`, `backend/`, `firebase.js`, `App.jsx` routing, `cards` collection structure, `src/translations/*.json`, `.cursorrules`, `.cursor/rules/`, Cloud Functions, Firestore rules. No UI-string translation work (that is B2/B3). No changes to the public marketing pages.

## 4. Steps

1. Branch from latest `main`. The working tree already holds 3 uncommitted files written by Claude (this directive, `CLAUDE_HANDOFF.md`, `memory/project_decisions_2026_10.md`) — commit them first, unchanged: `docs: Italy B1 directive + decisions 2026-10-08`.
2. `regionConfig.js` (Italy + order + default + fallback + locale). Run `npm test` — fix only tests that assert the old 4-region list / Gulf default.
3. Seeds + `tenantService` (`SEED_VERSION`, region list, defaults). **Merge-only rule:** never call `clearTenantSubcollections` from seed or version-bump paths.
4. Unit / vehicle / vessel / persona / rep data.
5. Morph loaders, map config, AI demo maps, gateways, layout codes, tracking regex, TutorialStep.
6. Grep check (step 4 of Verify) → every file that lists `mexico` must also list `italy`.
7. CLAUDE.md §3/§12. Commit: `feat(region): add Italy as 5th region, Canada default`.
8. Repo tidy commit.

## 5. Verify (PowerShell, from repo root) — paste all output

```powershell
cd frontend
npm run lint            # 0 errors
npm run build           # must pass
npm test                # all pass, incl. new Italy cases
npm run e2e             # 12/12
# every region map lists italy:
Select-String -Path src\**\*.js,src\**\*.jsx -Pattern "mexico" -List | ForEach-Object { $f=$_.Path; if (-not (Select-String -Path $f -Pattern "italy" -Quiet)) { "MISSING italy: $f" } }
# no Gulf default left:
Select-String -Path src\**\*.js,src\**\*.jsx -Pattern 'regionId = "gulf"|DEFAULT_REGION = .gulf.'
# Large File Protocol for every edited file > 500 lines:
(Get-Content src\hooks\useDashboardData.js).Length
Get-Content src\hooks\useDashboardData.js -Tail 40
```
The `MISSING italy` loop must print nothing except files where `mexico` is not a region map (list and explain them).

**Manual check (`npm run dev`, logged in, `/unified`):**
1. Fresh browser profile (or clear `ud-region` in localStorage) → dashboard opens on **Canada**.
2. Country selector order: Canada, Italy, USA, Mexico, Gulf.
3. Italy × Real estate / Automotive / Yacht: Italian personas and projects, `€` prices in `it-IT` format, 8 cards each, morph loader shows the Italy mini-map.
4. A deal you create **before** reload survives the `SEED_VERSION` bump (seed protocol test).
5. Switch Italy → Canada → Italy: no re-seed, no duplicate cards.
6. No console errors.

## 6. Do not

No deploy. No push to `main` (commit on the branch; Oguzhan pushes after Claude's audit). No new dependencies.
No refactors beyond the CRMGateway ternary named above. No hardcoded Italy colours in page CSS (only `sidebarAccent` in `regionConfig`).
Keep it minimal: follow the existing Mexico pattern; do not invent new helpers or abstractions.

## 7. Report back (paste to Oguzhan → Claude audits)

- Commit hashes + `git diff --stat main...HEAD`
- Output of lint / build / test / e2e / the two grep checks / line counts
- Manual check 1–6: PASS/FAIL each, with a screenshot of Italy × Real estate overview
- Any place where you had to guess (data shape, missing field) — list it, do not hide it

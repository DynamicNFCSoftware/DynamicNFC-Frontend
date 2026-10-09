# CURSOR DIRECTIVE — Italy B1 audit fixes

**Branch:** `feat/italy-b1-region-data` (same branch, new commit)          **Type:** implementation
**Read first:** `docs/directives/CURSOR_DIRECTIVE_ITALY_B1_REGION_DATA.md`

## 1. Claude's audit of B1 (2026-10-09) — summary

Verified PASS by Claude: scope (no forbidden files touched); seed is merge-only; all 15 seed builds
(5 regions × 3 sectors) have the same shape (8 cards, 4 leads, 4 deals, 3 campaigns), every doc carries
`region` + `sector`, no duplicate IDs; unit data keys Italy = Mexico; every file that lists `mexico` lists
`italy`; no `"gulf"` default left; ESLint on changed files: 0 errors. CLAUDE.md §3/§12 correct.
**Not run by Claude** (Windows `node_modules`): build, full `npm test`, e2e, manual dashboard check — your report covers them.

## 2. Fixes (one commit: `fix(region): Italy B1 audit fixes`)

1. **Mini-map pin is in the wrong place (blocker).** `frontend/src/config/mapRegionConfig.js` italy
   `miniMap: { x: 52, y: 48 }` puts the pin in North America; the Italy shape is drawn around x 100–122.
   Set `{ x: 110, y: 38 }` (Milan). In `components/YachtMorphLoader/YachtMorphLoader.jsx` italy set
   `miniMap: { x: 107, y: 40, ... }` (Portofino). Check visually in all three morph loaders.
2. **Seed text language must match the other regions (English data fields):**
   - `services/seeds/realEstateSeed.js` italy `location: "Lake Como & Milan"`
   - `services/seeds/automotiveSeed.js` italy `location: "Milan"`; financing strings in the same style as
     Canada/Mexico, e.g. `"Lease €6,800/mo · 48mo"` (English, comma thousands) for all 8 cards.
   - `services/seeds/yachtSeed.js` italy `location: "Portofino & Porto Cervo"`
3. **Italian wording:** `config/realEstateUnitData.js` lines with `beds` `it: "3 locali"` / `"2 locali"` →
   `"3 camere"` / `"2 camere"` ("locali" counts all rooms, not bedrooms). Leave unit names alone (native review later).
4. **Handover date is already past:** `config/realEstateUnitData.js` Italy INVEST overlay `stat: "2026"` → `"Q4 2027"`.
5. **Simplicity:** `pages/CRMGateway/CRMGateway.jsx` — every region is in `REGION_CODE`, so drop the
   `|| region.id.slice(0, 3).toUpperCase()` fallback.

Nothing else. No new files besides this directive.

## 3. Verify (PowerShell) — paste output

```powershell
cd frontend
npm run lint; npm run build; npm test; npm run e2e
Select-String -Path src\services\seeds\*.js -Pattern ' e |mesi|/mo · '
```
Manual: `/unified` → Italy → Real estate, Automotive, Yacht: the morph loader pin sits on Italy (screenshot one).

## 4. Do not
No deploy, no push. No other changes.

## 5. Report back
Commit hash, the command output, the screenshot, plus the full B1 report from the first directive if not yet given.

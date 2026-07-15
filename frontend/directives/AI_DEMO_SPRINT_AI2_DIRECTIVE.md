# SPRINT AI-2 — Carry AI-1 Pattern to AutoAIDemo + YachtAIDemo (+2 taxonomy repairs)
**Author:** Claude (Cowork) · 2026-07-14 · Target: Cursor Cloud Agent
**Depends on:** Sprint AI-1 merged (`0ad36669` + `758ac988` portalType fix). Branch from main AFTER that merge.

## Why (2 lines)
AutoAIDemo is where RE's AIDemo was before AI-1: 36 hardcoded Gulf strings, zero tracking. YachtAIDemo (F2) is already region-aware + partially tracked but misses WhatsApp/CRM steps, most tracking fires, send-to-self, and the portal deep-link. Audit also found two event-taxonomy holes that silently drop events from the dashboard.

## Current-state facts (verified 2026-07-14 — do not re-derive)
- `AutoAIDemo.jsx`: `useRegion` only for timezone; NO `trackPortalEvent`; 36 hits for `Khalid|Al-Mansouri|AED|G63|Riyadh`.
- `YachtAIDemo.jsx`: `usePortalRegion("yacht")` + `getPersonas("yacht")` + `YACHTS[regionId]` builders (buildTR/buildStepDescs/buildTerminalLines pattern — KEEP IT, additive edits only). Tracks only `portal_opened` (L359) + `book_viewing` ×2 (L459/469), portalType "vip" ✓. 5 steps.
- `sectorConfig.js`: `YACHT = { ...REAL_ESTATE, ... }` → yacht inherits RE `events` (book_viewing etc. allowed ✓). Automotive has own taxonomy (`auto_portal_entry`, `test_drive_request`, `contact_advisor`, `request_quote`).
- `useDashboardData.js` L18-67: `EVENT_ALIAS` (global) then `SECTOR_EVENT_ALIAS` (per-sector). Order: global first, then sector.

## WP-0 — Taxonomy repairs (small but critical — events currently VANISH)
1. **`lead_captured` is in NO sector's allowed set** → AI-1's DocuSign event drops from `normalizedEvents` (portalType `vip` doesn't bypass the `allowed.has` filter). Fix in `pages/AIDemo/AIDemo.jsx`: docusign fire `'lead_captured'` → `'request_pricing'` with `{ source:'ai_demo', step:'nda' }` (semantics: NDA signed = exclusive pricing unlocked). Use `request_pricing` for docusign in ALL THREE AI demos.
2. **Automotive alias hole:** global alias maps `contact_advisor → contact_agent`, but `SECTOR_EVENT_ALIAS.automotive` has no `contact_agent` entry and auto's allowed set contains `contact_advisor` — net effect: contact events drop in the Automotive dashboard. Add to `SECTOR_EVENT_ALIAS.automotive`:
```js
contact_agent: "contact_advisor",
contact_advisor: "contact_advisor",
lead_captured: "request_quote",   // safety: legacy lead_captured events resolve instead of vanishing
```
Also add to RE path safety via global `EVENT_ALIAS`: `lead_captured: "request_pricing"` (rescues any already-written AI-1 events).

## WP-1 — Shared helpers (Code Simplicity: one core, thin sector files)
Extract from `pages/AIDemo/aiDemoData.js` into **`services/aiDemoShared.js`**: `fill`, `nameParts`, `slugifyEmailLocal`, `projectSlug`, `makeVipId`, `attachmentName`, `CITY`, `TIME_ABBR`, `getWhatsAppInvite`. `aiDemoData.js` imports from shared (its `getAiVip` API unchanged — RE page untouched beyond the WP-0 event fix and imports).

## WP-2 — AutoAIDemo: full AI-1 pattern
1. **`pages/AutomotiveDemo/autoAiDemoData.js`** (NEW): `getAutoAiVip(regionId, lang)` composing `getPersonas("automotive", regionId)` vip1 + the region's flagship vehicle (FIRST vehicle of the region's VIP-portal list in `data/automotiveVehicleData.js` — do not invent vehicles) + `formatCurrency` + shared helpers. Fields mirror `getAiVip` (vehicleName/vehicleCode instead of unitName/unitCode; `salesCenter` → `"<dealership> Showroom, <city>"` — dealership name from existing auto portal branding per region, e.g. Prestige Motors Vancouver).
2. TR dict parametrization exactly like AI-1 WP-2 (`fill()` + placeholders). **Grep proof:** `Khalid|Al-Mansouri|AED|G63|Riyadh` in `AutoAIDemo.jsx` → 0.
3. 7 steps: trigger → canva (spec dossier) → gmail → **whatsapp** → calendar (test drive) → docusign (purchase agreement / NDA) → **crm**. Hero "Seven actions", platforms 6, x/7. WhatsApp + CRM cards same design as AI-1 (wa.me real link; CRM JSON payload — deal stage `test_drive`).
4. Tracking — 6 fires, `portalType 'vip'`, guard ref, CRM not tracked:
| step | event | resolves to (auto) |
|---|---|---|
| trigger | `portal_opened` | auto_portal_entry |
| canva | `download_brochure` | download_brochure |
| gmail | `contact_advisor` `{channel:'email'}` | contact_advisor (after WP-0.2) |
| whatsapp | `contact_advisor` `{channel:'whatsapp'}` | contact_advisor |
| calendar | `book_viewing` | test_drive_request → drives Test Drive stage |
| docusign | `request_pricing` `{step:'nda'}` | request_quote |
5. Send-to-self input (live Google mode) — same as AI-1 WP-5. Confirm `autoGoogleLiveApi` exposes the same draft/event creators; adapt names if different.
6. Deep link: docusign result → `/automotive/demo/khalid?vip_pricing=unlocked`; `AutomotivePortal.jsx` reads `useSearchParams`, gold banner (same pattern/langs as VIPPortal AI-1 banner). Final section: dashboard CTA → `/unified/overview` + 24h-reminder card (copy from AI-1, "showing" → "test drive").

## WP-3 — YachtAIDemo: additive only (do NOT rewrite its builder pattern)
1. Steps 5→7: insert **whatsapp** after gmail, append **crm** after docusign. Terminal lines via its existing `buildTerminalLines` style; WhatsApp text via shared `getWhatsAppInvite` (vessel/marina/sea-trial vocabulary). Hero/stat counts → Seven actions / 6 platforms / x/7 in its TR builder.
2. Tracking — add missing fires (portal_opened + book_viewing exist): canva `download_brochure`, gmail `contact_advisor {channel:'email'}`, whatsapp `contact_advisor {channel:'whatsapp'}`, docusign `request_pricing {step:'nda'}`. Same guard-ref pattern. Existing `trackEvent` wrapper already sets portalType vip + vessel metadata — reuse it.
3. Send-to-self input (it has Google live mode state — wire like AI-1).
4. Deep link: docusign result → `/yacht/demo/vip?vip_pricing=unlocked`; `YachtVIPPortal.jsx` gold banner (en/ar/es/fr if the portal has 4 langs, else en/ar/fr per its current set). Final section: dashboard CTA + 24h reminder card (sea-trial vocabulary).

## WP-4 — Count/copy sweep
Grep across `src/` for stale counts pointing at these demos: `Five actions|Four platforms|Fünf|أربع منصات|خمسة إجراءات` and gateway cards describing the auto/yacht AI demos — align to Seven actions / six platforms. (Home + Enterprise RE references were fixed in AI-1 — don't touch.)

## Out of scope
ES/FR translation waves (Sprint G), `/admin/*`, App.jsx routes, YachtAIDemo builder refactor, any dashboard UI change beyond the two alias entries.

## Verify — "Bitti sayılır" requires ALL
1. `npm run build` PASS **and** `npm test` PASS (new imports in Auto/Yacht AI demo tests need providers — FAZ5 lesson).
2. Greps = 0: `Khalid|Al-Mansouri|AED|G63|Riyadh` in `AutoAIDemo.jsx` · `lead_captured` in all three `*AIDemo*.jsx` · `Five actions` in `src/`.
3. Greps exist: `trackPortalEvent` 6 fires in `AutoAIDemo.jsx` · 6 total fires in `YachtAIDemo.jsx` · `contact_agent: "contact_advisor"` in `useDashboardData.js`.
4. Runtime QA (ACTIVE tab — background tabs freeze the terminal animation): Auto demo in Canada (persona ≠ Khalid, CAD, Tesla/Lexus-class flagship) + Gulf (Khalid Al-Mansouri, SAR); Yacht demo in USA + Gulf; full 7/7 run each; wa.me opens; `?vip_pricing=unlocked` banners on both portals; **Unified feed: switch sector to Automotive → see the run's events (auto events only visible under Automotive sector view); same for Yacht.**
5. Report with commit hash(es). No hash = not done.

## Post-merge (Oguzhan)
`git pull` → build → `firebase deploy --only hosting` → `.web.app` spot-check: 3 sektör AI demo × 2 region + Unified'da sektör değiştirerek feed kontrolü.

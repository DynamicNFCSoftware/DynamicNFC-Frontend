# CURSOR DIRECTIVE — Italy B2.1: dashboard polish found in live QA (2026-10-09)

**Branch:** `fix/italy-b2-1-polish` from latest `main`          **Type:** implementation
**Read first:** `CLAUDE.md`, `docs/directives/CURSOR_DIRECTIVE_ITALY_B2_DASHBOARD_IT.md` §4 (Italian style)

Oguzhan checked `/unified` live in Italy × Yacht. Fix exactly these. Keep diffs minimal.

## 1. Daily brief stays English for Italian (bug, Cloud Function)
`functions/lib/aiBriefGenerator.js` ~line 65–75: inside the 5-minute cooldown it returns
`cached?.byLang?.[lang] || cached` — when there is no Italian slot it returns the **legacy top-level English** brief.
Fix: only reuse `cached.byLang[lang]`; if that slot does not exist, skip the cooldown shortcut and continue to
generation (LLM, falling back to `generateBriefFromTemplate(... lang)`). Same rule in the frontend:
`components/UnifiedDashboard/TodaysBrief.jsx:88` `brief?.byLang?.[lang] || brief?.byLang?.en || brief` is fine to keep.
Also report: the brief on the Overview says "Updated 14 May" — run
`firebase functions:log --only aggregateVelocityMetrics --project dynamicnfc-prod-68b4e -n 50` and paste the output
(do not change the scheduler code unless the log shows the error; describe it instead).

## 2. Date range in the region's format
`pages/UnifiedDashboard/components/DateRangePicker.jsx:146,148` use `toLocaleDateString()` (browser locale → `8/15/2026`).
Use `getEffectiveLocale(regionId, lang)` from `config/regionConfig` (region via `useRegion()`, lang via `useLanguage()`)
with `{ day: "2-digit", month: "2-digit", year: "numeric" }` → Italy shows `15/08/2026`.

## 3. Raw event code in the activity feed
`language_switch` shows as a raw code. Add a label in all five languages wherever the event label maps live
(`i18n/eventDisplayMap.js`, and the activity/timeline maps that already hold `download_brochure`):
en `Language changed`, it `Lingua cambiata`, fr `Langue changée`, es `Idioma cambiado`, ar `تغيير اللغة`.
Grep the seeds for every other event code they emit (`services/seeds/*Seed.js`) and make sure each has a label in all five languages.

## 4. Seed lead "Broker Referral"
`services/seeds/yachtSeed.js:148,159,270` — this is a person/lead name shown in the feed. Make it region-aware:
Add a `brokerName` per region in the yacht seed
`REGION_DATA` (canada "Coal Harbour Brokerage", usa "Harbor Island Brokers", mexico "Cabo Yacht Brokers",
gulf "Dubai Marina Brokers", italy "Broker Portofino") and use it in those three places.

## 5. One style for conversion action labels (Italian)
Labels describe what happened (past participle), not a button command:
`Scarica la brochure` → `Brochure scaricata`, `Contatta il consulente` → `Contatto con il consulente`,
`Richiedi il prezzo` → `Prezzo richiesto`, `Richiedi il piano di pagamento` → `Piano di pagamento richiesto`,
`Prenota una visita` → `Visita prenotata` — in `i18n/eventDisplayMap.js`, `i18n/portals/dashboard.js` (act* keys),
`UnifiedDashboard/components/BehavioralTimeline.jsx`, `tabs/OverviewTab.jsx:468-472`, `tabs/VIPCrmTab.jsx:93`.
Only where the label names a recorded action; real buttons keep the imperative.

## 6. `Leggibile ON`
`pages/UnifiedDashboard/components/ExportPDF.jsx:17` it `on: "ON", off: "OFF"` → `on: "attivo", off: "disattivato"`
(result: `Leggibile attivo`).

## Verify (PowerShell) — paste output
```powershell
cd frontend; npm run lint; npm run build; npm test; npm run e2e
cd ..\functions; node -e "require('./index.js')"
```
Manual (`npm run dev`, logged in, Italy): date range `15/08/2026 → 09/10/2026`; no raw `language_switch`; no "Broker Referral";
conversion chart labels in one style; `Leggibile attivo`. Screenshot Overview.

## Do not
No deploy, no push. Functions deploy is done by Oguzhan after audit:
`$env:FUNCTIONS_DISCOVERY_TIMEOUT=60; firebase deploy --only functions:refreshDailyBriefAi,functions:aggregateVelocityMetrics --project dynamicnfc-prod-68b4e`

## Report back
Commit hashes, command output, the functions log, screenshot.

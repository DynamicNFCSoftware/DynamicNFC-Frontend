# CURSOR DIRECTIVE — Italy B2: Unified Dashboard in Italian

**Branch:** `feat/italy-b2-dashboard-it` — create it from `main` **only after B1 (`feat/italy-b1-region-data`) is merged**.
**Type:** implementation
**Read first:** `CLAUDE.md` (§10 i18n, §11 simplicity), top entry of `CLAUDE_HANDOFF.md`, `docs/directives/CURSOR_DIRECTIVE_ITALY_B1_REGION_DATA.md`

## 1. Goal

When the Italy region is active, the whole `/unified` dashboard reads in **Italian**, and the topbar
language button switches **IT ↔ EN** (the cycle is already region-scoped: `nextLang()` in `UnifiedLayout.jsx`
uses `region.languages`, and B1 set Italy to `['it', 'en']` — do not change the cycle or the topbar layout).
Every string that today exists in `fr` / `es` must exist in `it`. The template daily brief (Cloud Function)
also gets Italian. Nothing else changes for the other regions and languages.

Demo portals (`/enterprise/crmdemo/*`, `/automotive/demo/*`, `/yacht/demo/*`, AI demos) are **B3, not this directive**.

## 2. Scope

Inventory by Claude (counts = objects that carry `fr:` today; each needs `it:` next to it):

| File | `fr:` objects |
|---|---|
| `src/config/sectorConfig.js` (stages, event labels, rules) | 145 |
| `src/pages/UnifiedDashboard/tabs/SettingsTab.jsx` | 27 |
| `src/pages/UnifiedDashboard/components/KanbanBoard.jsx` | 23 |
| `src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | 20 |
| `src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` | 18 |
| `src/pages/UnifiedDashboard/UnifiedLayout.jsx` (`LAYOUT_TEXT` etc.) | 14 |
| `src/pages/UnifiedDashboard/components/CreateVipModal.jsx`, `OutreachModal.jsx` | 10 each |
| `src/pages/UnifiedDashboard/tabs/CardsTab.jsx`, `AnalyticsTab.jsx`, `components/AddDealModal.jsx` | 9 each |
| `src/pages/UnifiedDashboard/tabs/PipelineTab.jsx` | 7 |
| `src/pages/UnifiedDashboard/tabs/InventoryTab.jsx`, `components/BehavioralTimeline.jsx` | 5 each |
| `src/i18n/eventDisplayMap.js` | 4 |
| `src/i18n/portals/dashboard.js` (723 lines), `components/CallQueue.jsx` | 3 each |
| `src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`, `components/ExportPDF.jsx` | 2 each |
| `tabs/campaignsTab.i18n.js` (584 lines), `components/{NotificationSystem,FunnelInsightTable,DateRangePicker,ActivityFeed}.jsx`, `src/components/UnifiedDashboard/TodaysBrief.jsx`, `src/i18n/portals/fiveMinuteProof.js` | 1 each (usually a whole language block) |

Also sweep, even if they have no `fr:` today (they may hold English-only or ternary text):
`components/{SvgFunnel,KpiCard,SectorSwitcher,LeadBadge,AiBadge,AnimatedCounter,CampaignDrawer,AddCampaignModal}.jsx`,
`tabs/CampaignsTab.jsx`, `src/components/UnifiedDashboard/{SalesVelocity.jsx,SalesTriggerPanel/*,FiveMinuteProof/*}`.

Cloud Functions (separate commit, see step 6): `functions/lib/briefTemplates.js`, `functions/lib/aiBriefGenerator.js`, `functions/index.js` (`SUPPORTED_LANGS` only).

**Must NOT be touched:** `/admin/*`, `backend/`, `firebase.js`, `App.jsx`, routing, `LanguageContext.jsx`, `i18n/index.js`,
`src/translations/*.json`, `.cursorrules`, `.cursor/rules/`, demo portal pages (B3), public marketing pages, CSS layout.

## 3. Steps

1. **Add `it` everywhere `fr` exists** in the files above — same keys, same value shapes (functions stay functions,
   arrays stay arrays). Place `it` right after `en` for readability. Do not reorder or rewrite existing languages.
2. **Text ternaries → keys or maps.** Text chosen by `lang === "ar" ? … : lang === "es" ? … : lang === "fr" ? … : …`
   must also cover `it`. Direction/layout ternaries (`dir`, RTL arrows, `row-reverse`) stay as they are.
3. **One "time ago" helper instead of six copies (simplicity mandate).** The same relative-time ternary chain is copied in
   `ActivityFeed.jsx:42-48`, `BehavioralTimeline.jsx:100-105`, `campaignUtils.js:63-67`, `CardsTab.jsx:360-364`,
   `InventoryTab.jsx:203-207`, `CallQueue.jsx:76`, `PriorityTab.jsx:345`. Create
   `src/pages/UnifiedDashboard/lib/timeAgo.js` with **one data map** keyed by language (en, it, fr, es, ar) that reproduces
   **today's exact output** for en/fr/es/ar, plus Italian (`ora`, `5 min fa`, `3 h fa`, `2 g fa`; idle days `g inattivo`).
   Replace the copies with calls to it. Where two copies differ slightly today, keep the most common form and list the
   differences in your report. Add `timeAgo.test.js` covering all five languages.
4. **Locales from the region, not hardcoded.** `AnimatedCounter.jsx:31` (`"ar-AE" : "en-AE"`) and
   `PriorityTab.jsx:252` (date locale chain) → use `getEffectiveLocale(regionId, lang)` from `regionConfig`
   (region via `useRegion()`), so Italy shows `1.250.000` and Italian dates.
5. **Parity test.** Extend `src/i18n/__tests__/translationParity.test.js`: import the dashboard translation modules
   (`i18n/portals/dashboard.js`, `i18n/portals/fiveMinuteProof.js`, `i18n/eventDisplayMap.js`, `tabs/campaignsTab.i18n.js`)
   and assert that for every registered/exported object that has `fr`, `it` exists with exactly the same keys as `fr`.
   For `sectorConfig.js`, assert that every nested object holding `fr` also holds `it` (walk the object).
6. **Daily brief (functions, own commit `feat(functions): Italian daily brief`).**
   - `functions/lib/briefTemplates.js`: add `it` to every language map (HOURS/DAYS/TAPS labels, all template blocks, chips).
   - `functions/lib/aiBriefGenerator.js` `LANG_INSTRUCTIONS.it`: `"Write all output in Italian, professional business tone. Translate inline span content too. Preserve HTML tags exactly."`
   - `functions/index.js`: `SUPPORTED_LANGS = ["en", "it", "fr", "es", "ar"]` and fix the "4 languages" comment. Nothing else in that file.
   - Do **not** deploy functions. Oguzhan deploys after audit: `firebase deploy --only functions:aggregateVelocityMetrics,functions:refreshDailyBriefAi --project dynamicnfc-prod-68b4e`.

7. **Bug: "NaNd" badge on Kanban cards (pre-existing, seen 2026-10-09).** `components/KanbanBoard.jsx:322-327`
   does `new Date(deal.updatedAt || deal.createdAt)`; when that is a Firestore `Timestamp` the result is `NaN`, and
   `NaN < 2` is false, so the card shows `NaNd`. Convert with `ts?.toMillis ? ts.toMillis() : new Date(ts).getTime()`
   (reuse it in the same file's `timeAgo` for `lastSeen`) and return `null` when the value is not a finite number.
   Check every region: no `NaNd` anywhere in Pipeline.
8. **Italy seed campaign descriptions** in `services/seeds/realEstateSeed.js` (and the auto/yacht seeds if any) are Italian;
   make them English like the other regions' seed text.

## 4. Italian style

- Concise product-UI Italian. Buttons and actions in the imperative (`Aggiungi deal`, `Esporta PDF`, `Salva`).
  Address the user with `tu` where a sentence addresses them (same as the public site).
- Keep in English: DynamicNFC, VIP, VIP Access Key, Sales Velocity Engine, NFC, CRM, ROI, lead, deal, pipeline,
  dashboard, follow-up, tap (verb form: `tap` / noun `tap`), check-in. Proper names, project names, model names unchanged.
- Numbers, currency and dates come from `Intl` — never write them into strings by hand.
- Never invent metrics or claims that are not in the English text. Translate what is there.
- Strings must fit: Italian runs ~15–25% longer than English. Check the sidebar, KPI cards, Kanban column headers
  and modal buttons at 375px and 1440px; shorten the Italian (not the layout) if something wraps badly.

## 5. Verify (PowerShell) — paste all output

```powershell
cd frontend
npm run lint; npm run build; npm test; npm run e2e
# every file that has fr: also has it: (should print nothing)
Get-ChildItem src -Recurse -Include *.js,*.jsx | Where-Object { (Select-String $_ -Pattern '\bfr\s*:' -Quiet) -and -not (Select-String $_ -Pattern '\bit\s*:' -Quiet) } | Where-Object { $_.FullName -notmatch 'admin|AutomotiveDemo|YachtDemo|VIPPortal|AhmedPortal|MarketplacePortal|AIDemo|LoginPortal|CRMGateway|Dashboard\\Dashboard|pages\\(Home|Enterprise|Developers|RealEstate|Automotive|NFCCards|ContactSales|Login|Legal|Pricing|Blog)' } | Select-Object FullName
# no ternary chain left without Italian in dashboard scope
Select-String -Path src\pages\UnifiedDashboard\**\*.jsx,src\pages\UnifiedDashboard\**\*.js,src\components\UnifiedDashboard\**\*.jsx -Pattern 'lang === "fr" \?' | Where-Object { $_.Line -notmatch '"it"' }
cd ..\functions; node -e "const t=require('./lib/briefTemplates');console.log(JSON.stringify(t.generateBriefFromTemplate({topVip:{name:'Alessandro Conti',tapCount:3,hoursAgo:2,firstAction:'view_floorplan',score:82,prevScore:70,mode:'rising'},pipelineDelta:{pipelineDelta:1,newVipCount:1},marketplaceTraffic:{trafficDelta:2,anonVisitors:14,topUnit:'Attico Lario'},alerts:{atRisk:0,hotLeadsNew:1,followUpsOverdue:0},lang:'it'})).slice(0,600))"
```
Large File Protocol (line count + last 40 lines) for every edited file over 500 lines.

**Manual check (`npm run dev`, logged in, `/unified`):**
1. Region Italy → language button shows IT; every tab (Overview, Pipeline, VIP CRM, Priority, Cards, Inventory, Campaigns,
   Analytics, Settings) is Italian — no English leftovers, no raw keys. Screenshot Overview + Pipeline.
2. Button → EN: everything English. Back → IT.
3. Open: Add deal, Create VIP, Outreach, Export PDF, notifications, Five-Minute Proof tutorial — all Italian.
4. Numbers `1.250.000 €`, dates Italian.
5. Region Canada → EN/FR cycle unchanged; Gulf → AR is still RTL and unchanged; Mexico → ES unchanged.
6. 375px: sidebar, KPI cards, Kanban headers, modal buttons do not overflow in Italian.
7. No console errors.

## 6. Do not

No deploy (hosting or functions). No push. No new dependencies. No refactors beyond the time-ago helper and the two
locale fixes named above. Do not translate demo portals (B3). Keep diffs minimal.

## 7. Report back

Commit hashes + `git diff --stat main...HEAD`; all command output above; manual checks 1–7 PASS/FAIL with screenshots;
the list of time-ago differences you unified; every string you left in English on purpose and why.

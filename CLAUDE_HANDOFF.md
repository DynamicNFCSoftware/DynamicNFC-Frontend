
## How This File Works

This is the shared live-state document between three AI collaborators working on DynamicNFC:
- **Claude (claude.ai)** — user pastes this at the start of each new chat session
- **Claude Code (CC, terminal)** — reads this automatically via CLAUDE.md Session Startup
- **Cursor Cloud Agent** — reads this automatically via .cursor/rules/00-core.mdc

**Update protocol:**
- After any deploy, append to "Infrastructure Snapshot" with date + source.
- After any finished task, add one line to "Recently Completed".
- Before starting a new task, move it from open items to "In-Flight Work" with owner tag ([Claude] / [CC] / [Cursor]).

Keep entries short. This file is a live ledger, not a report.

---


# CLAUDE_HANDOFF.md

Claude ve Cursor arasında session'lar arası paylaşılan canlı durum.
Her session başında yeni chat'e yapıştır. Her deploy / architecture
change / yarım kalan iş sonrası güncelle.

Last updated: 2026-04-28 EOD by Cursor (session: Sprint 1A.2 hotfix implementation pass, not committed)

---


## Tomorrow's Pickup — READ FIRST

**Where we stopped:** Sprint 1A shipped (`36a434ab` on origin/main). Sprint 1A.1 hotfix in progress with Cursor (3 items: Demo Mode toggle in Settings, Walk-in Promote UX hybrid, sector-aware action labels via eventDisplayMap restructure).

**Why 1A.1 exists:** Sprint 1A successfully mounted NotificationSystem (the toast notification system that was a dead import in UnifiedLayout.jsx for the entire FAZ 5 cycle). However, QA Round 4 found that the demo mode path — which is what makes the mock auto-fire toast (every 25s) and the cross-tab demo realtime toast actually visible to a presenter — has no user-facing toggle. Settings shows `Data Mode: Tenant Data` as static text only. Sprint 1A.1 fixes this plus 2 other pre-existing UX gaps surfaced during testing.

**First action when 1A.1 returns from Cursor:** QA Round 5 (~7 min):
- Settings → Demo Mode toggle visible + persistent (localStorage)
- Switch to Demo → toast every 25s on Overview with sector+region+lang aware persona
- Cross-tab demo: Tab1 /unified Demo + Tab2 /enterprise/crmdemo/khalid → click "Request Pricing" in Tab2 → Tab1 toast within 3s
- Walk-in Promote: confirmation modal → confirm → toast + row hidden (UI state only, no Firestore write)
- Switch sector Auto/Yacht/RealEstate → action labels update everywhere (sparklines, ActivityFeed, BehavioralTimeline, Campaigns)

**On QA pass:** commit `fix(unified): Sprint 1A.1 hotfix — Demo Mode toggle + Walk-in Promote UX + sector-aware labels` → push → Sprint 1B directive (Reissue Portal Link, Help modal, Zero Engagement badge, NFC ROI + Avg Session KPIs).

**On QA fail:** isolate the failing item, hotfix Sprint 1A.2, do not block on the others.

---

## Infrastructure Snapshot

### Cloud Functions (us-central1, Node 22)
- api [HTTPS Express]
- contactForm [HTTPS]
- onWalletPassRequest [Firestore trigger]
- aggregateTaps [Firestore trigger]
- aggregateCampaignTaps [Scheduled 15min]
- cleanupInactiveTenants [Scheduled daily 03:00 Toronto, dry-run]
- seedDemoData [Callable]

Last verified: 2026-04-23 via `firebase functions:list`.
Verify method: run `firebase functions:list`, paste output here on change.

### Firestore
- Location: northamerica-northeast1 (Montreal)
- Delete Protection: DISABLED — enable before first paying client
- Point-in-Time Recovery: DISABLED — enable before first paying client
- Rules: deployed 2026-04-23 (allow delete on tenant subcollections present)

### Hosting
- Last deploy: [fill when next deploy happens]
- Bundle hash: [fill]

### Working tree state (end of 2026-04-24)
- Branch: dirty, not committed
- `git diff --stat`: ~24 files changed, ~972 insertions, ~267 deletions (from cumulative Patch A + B + A2 + hotfix + DashboardDataProvider split)
- Known clean diff boundaries: legacy dashboards untouched, main site pages untouched, demo portals untouched, /admin untouched, LanguageContext.jsx untouched, backend/ untouched

---

## Translation Coverage Reality (production state, 2026-04-24)

**Important:** CLAUDE.md frames 4 regions as equal-primary. Production code does not match that framing. This block is the honest state; CLAUDE.md stays aspirational for long-term direction, handoff reflects what actually ships today.

| Language | Page-level namespaces | /unified namespaces | Status |
|----------|----------------------|---------------------|--------|
| EN | ✅ all 18 files | ✅ all files | Production |
| AR | ✅ all 18 files | ✅ all files | Production (Gulf demo-ready, RTL validated) |
| ES | ❌ zero page-level files | ✅ all /unified tabs + components (Patch A + A2) | Production (/unified) — **QA pending** |
| FR | ❌ zero page-level files | ✅ all /unified tabs + components (Patch A + A2) | Production (/unified) — **QA pending** |

**Implications:**
- Canada/Mexico main-site demos still require FAZ 6 (page-level FR/ES missing).
- `/unified` (tenant-facing dashboard) ES/FR coverage needs visual QA sign-off before claiming production-ready.
- Main site (Home, Enterprise, Developers, RealEstate, NFCCards, etc.) is EN + AR only.
- All demo portals (VIPPortal, AhmedPortal, MarketplacePortal, CRMGateway, all Automotive portals) are EN + AR only.

**Known LanguageContext bugs (to fix in FAZ 6):**
- `toggle` function in `frontend/src/i18n/LanguageContext.jsx` cycles EN → AR → ES → EN and **skips FR.** FR is reachable only via direct `setLang('fr')` call (e.g., Unified Dashboard topbar dropdown).
- `useTranslation` fallback in `frontend/src/i18n/index.js` silently returns EN when a FR/ES key is missing — no console warning. This caused Patch A's translation gap to go undetected until visual QA.

---

## Manual QA Protocol (Oguzhan, tomorrow)

**Setup:**
```powershell
cd frontend
npm run dev
```

**Checklist — 4 scenarios, ~45 min total:**

### Scenario 1 — Gulf + AR (10 min)
Select region = Gulf, sector = Automotive, language = AR. Visit each tab:
- `/unified/overview` — KPIs, weekly chart, live activity, today's workflow all AR?
- `/unified/pipeline` — 6 column headers AR? Lead badges AR (عميل ساخن/دافئ/بارد)?
- `/unified/vip-crm` — Walk-in Prospect artık "عميل محتمل زائر"? Behavioral timeline events AR?
- `/unified/priority` — Event triggers AR?
- `/unified/analytics` — Funnel stages AR? Intent categories AR? AI verdicts AR?
- `/unified/campaigns` — Event codes human-readable (early_interest → "اهتمام مبكر")?
- `/unified/inventory` — Filter chips, stock status AR? (SoS hala EN — bilerek)
- `/unified/cards` — Deal stage labels AR? Bulk action toasts AR?
- `/unified/settings` — CSV export header, FR language button?

### Scenario 2 — Canada + FR (10 min)
Region = Canada, sector = Automotive, language = FR. Same tab sweep:
- Pipeline column headers FR (Nouveau prospect / Contacté / Essai routier / Devis envoyé / Négociation / Financement)
- Lead badges FR (Prospect chaud / tiède / froid)
- VIPCrmTab persona "Walk-in Prospect" → "Prospect spontané"
- Behavioral timeline FR (Demande d'essai routier / Télécharger la brochure / etc.)

### Scenario 3 — Mexico + ES (10 min)
Region = Mexico, sector = Automotive, language = ES. Note: LanguageContext toggle skips FR, so ES is reachable via toggle or dropdown. Same tab sweep.

### Scenario 4 — USA + EN regression (5 min)
Region = USA, language = EN. Regression check — nothing should have broken. Specifically:
- AnalyticsTab date filter still working?
- OverviewTab weekly chart preset change still working?

### Scenario 5 — Mobile (3 min)
Chrome DevTools, 375px width. One language × one tab — confirm no layout break.

### Scenario 6 — Legacy dashboards (3 min)
- `https://localhost:3000/enterprise/crmdemo/dashboard` — still opens? (must, retired in Step 2)
- `https://localhost:3000/automotive/dashboard` — still opens?

### Bug format
For each finding:
```
[TAB] [LANG] [REGION] — "seen text" → expected: "correct translation"
```
Example: `[Pipeline] [AR] [Gulf] — "NEW LEAD" → expected: "عميل محتمل جديد"`

### Notes during QA
- **SoS stays EN** — open question, will be resolved separately
- **Campaign description "early interest campaign for..."** stays EN — tenant data, open question
- **Vehicle/product names** (Audi RS Q8, Porsche 911 GT3) — never translate
- **Persona names** (Sultan Al-Otaibi, David Thompson) — never translate
- **If anything else surfaces (HMR warning, console error, broken link)**: note it separately, do NOT fix. Every new finding = separate work item.

---

## Open Questions (awaiting decision)

1. **SoS abbreviation** (2 occurrences in `InventoryTab.jsx`) — meaning unclear. Cursor flagged in Patch A2 audit Table D. Possible expansions: Share of Search / Share of Stock / Stock on Shelf / Spike of Sessions. **Decision path:** Oguzhan recalls the intent → Claude writes mini-fix directive for full-word + 4-language translation.

2. **Campaign description field** (e.g., "early interest campaign for Prestige Motors Vancouver") — tenant-generated content or hardcoded seed data? If seed data, should stay EN as-is (real customers will write in their own language). Leaning: leave as-is, not a bug.

---

## In-Flight Work

### EOD 2026-04-28 — Sprint 1A.2 hotfix implementation (Cursor), NOT committed
Working tree intentionally dirty (no stash/reset). Scoped unified-dashboard hotfix pass applied; build verified PASS.

Implementation ledger (file path + range + status):
- **Bug 3 (critical) — Cross-tab realtime toast in Demo Mode:** `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` (L8-L145, L184-L257) — **FIXED (code complete, QA pending)**. Added BroadcastChannel `dnfc_tracking` listener in mock mode, payload normalization/alias mapping, and localized sector-aware event labeling via `getEventLabel(eventCode, lang, sector)`.
- **Bug 1 — Walk-in Promote hide + local sidebar count:** `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx` (L240-L324, L374-L449) — **FIXED (code complete, QA pending)**. Candidate row now hides immediately via local state; promoted candidate persists as local UI-only VIP entry for component lifetime (no Firestore write).
- **Bug 5 — Sector-aware mock toast labels/personas/units (RE/Auto/Yacht):** `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` (L8-L182) — **FIXED (code complete, QA pending)**. Mock auto-fire now uses sector event code sets + `getPersonas(sector, region)` + config-driven unit/category labels with localized `getEventLabel(...)`.
- **Bug 2 — Walk-in modal button hierarchy/styling:** `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx` (L639-L655) + `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` (L2575-L2660) — **FIXED (code complete, QA pending)**. Promote button is primary-danger (red), cancel is ghost style, shared reusable button classes added.
- **Bug 4 — Toast position/order:** `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` (L814-L824) — **FIXED (code complete, QA pending)**. Toast stack moved to top-right with newest toast rendered on top.

Validation:
- `frontend` → `npm run build` — **PASS** (Vite production build completed, no compile errors).

### EOD 2026-04-24 — Sprint 1A.1 partial QA, NOT committed
Working tree dirty, 12 files modified + 1 audit doc untracked. NOT pushed.

QA Round 5 results:
- Test 1 Demo toggle: PASS
- Test 2 Mock auto-fire: PASS (cosmetic: toast appears bottom-right, expected top-right; Sprint 1B fix)
- Test 3 Cross-tab realtime: FAIL — no toast in /unified when demo portal fires CTA
- Test 4 Walk-in Promote: FAIL — confirmation modal does not appear despite Cursor audit claim "Item 2 FIXED". Candidate row vanishes silently. Possible Vite HMR cache issue, retry tomorrow with full restart.
- Tests 5-6: deferred to tomorrow

Resume tomorrow:
1. Browser/Vite restart, retry Test 4 (cache hypothesis)
2. Run Test 5 (sector-aware labels Auto/RE/Yacht switch)
3. Run Test 6 (Sprint 1A regression: KPI animation, sparklines, decay chip)
4. Consolidate all failures into Sprint 1A.2 directive
5. Single commit: Sprint 1A.1 + 1A.2 together (1A.1 was never committed — work merges cleanly)
6. Push → Sprint 1B directive

- **FAZ 5 Step 2 prep** — ~~run manual QA checklist above, collect findings, then issue hard-retire directive for legacy dashboards~~ — **CANCELLED 2026-04-24** (decision logged in Recently Completed). [Oguzhan + Claude]

## Recently Completed

- Sprint 1A SHIPPED (2026-04-24): commit `36a434ab` pushed to origin/main. NotificationSystem mounted in UnifiedLayout (dead import for entire FAZ 5 cycle now revived). KPI animations (AnimatedCounter wired to KpiCard). Per-action 7-day sparklines in OverviewTab Conversion Actions. Decay multiplier chip in BehavioralTimeline (×0.xx, hidden when >= 0.98). New helper: frontend/src/utils/scoring.js. Cross-tab realtime verification deferred to Sprint 1A.1 (blocked on missing demo mode toggle). [Cursor + Oguzhan QA]
- Legacy retire decision REVERSED (2026-04-24): /enterprise/crmdemo/dashboard + /automotive/dashboard remain accessible permanently. Hard retire cancelled per Oguzhan ("kesinlikle silinmemeli"). Migration sprints will copy valuable features into /unified without removing the legacy surfaces. CC audit `docs/LEGACY_DASHBOARD_AUDIT.md` remains the source of truth for what to migrate (12 must-migrate items spread across Sprint 1A → 1A.1 → 1B → 2 → 3). [decision]


- FAZ 5 Step 1 SHIPPED (2026-04-24): commits `80a58c6e` + `b31876d9` pushed to `origin/main`. Migration, translation coverage, and hotfix scope from A/B/A2/A2-hotfix are now on main branch. [Claude]
- DashboardDataProvider split (2026-04-24, scope-creep recovered): `useDashboard.js` extracted from `DashboardDataProvider.jsx` to fix Fast Refresh warning. 11 import sites updated. Build PASS, HMR clean. `DashboardContext.jsx` has same issue but only `ExportPDF.jsx` consumes it — deferred to FAZ 6 per `memory/project_faz6_tech_debt.md`. Scope-creep feedback captured in `memory/feedback_scope_creep.md`. [CC]
- FAZ 5 Step 1 Patch A2 hotfix (2026-04-24): `getLeadTemperature()` label parity completed (EN/AR preserved, ES/FR added) to remove LeadBadge fallback-to-EN behavior in /unified. Build PASS. [Cursor]
- FAZ 5 Step 1 Patch A2 (2026-04-23): full /unified translation coverage across Pipeline/VIPCrm/Priority/Analytics/Campaigns/Inventory/Cards/Settings + all modals. Event display mapping layer introduced at `i18n/eventDisplayMap.js` (44 codes × 4 languages). Persona label propagation fixed. SoS flagged in Open Questions. Audit at `docs/TRANSLATION_GAP_AUDIT_2026-04-23_A2.md`. [Cursor]
- FAZ 5 Step 1 Patch B (2026-04-23): /unified Overview weekly trend chart readability + chart-local date filter (last 4w/8w/12w/custom). Empty state placeholder added. DateRangePicker presets prop for reusability. OverviewTab 674→746L. [Cursor]
- Translation debt reality check (2026-04-23): handoff updated with honest FR/ES coverage state. CLAUDE.md aspirational framing preserved. FAZ 6 added to open items. [Claude]
- FAZ 5 Step 1 Patch A (2026-04-23): /unified translation gap closed. 10 AR + 18 ES + 19 FR keys added/fixed across activityFeed/callQueue/createVipModal/notificationSystem/sectorConfig/unifiedLayout/dateRangePicker/exportPdf. Audit at `docs/TRANSLATION_GAP_AUDIT_2026-04-23.md`. [Cursor]
- FAZ 5 Step 1 migration (2026-04-23): DateRangePicker component + AnalyticsTab date filter wiring + OverviewTab weekly trend chart (sector-aware) + Top Configs MIGRATED added to /unified. Legacy dashboards untouched — Step 2 (hard retire) pending local QA. [Cursor]
- FAZ 5 audit (2026-04-23): feature diff between legacy dashboards and /unified documented in `docs/FAZ5_AUDIT_2026-04-23.md`. [Cursor]
- Handoff alignment (2026-04-23): Cursor Agent read `CLAUDE_HANDOFF.md`; future task updates will be logged here per protocol.
- Handoff close (2026-04-23): `docs/CLAUDE.proposed.md` updated with Session Startup + 60-debug-conventions; `CLAUDE.md` intentionally unchanged (awaiting user approval).
- Rule architecture (2026-04-23): `.cursorrules` reduced to entrypoint index, operational rules split under `.cursor/rules/*.mdc`.
- Rules refresh (2026-04-23): all 6 .mdc files + new 60-debug-conventions.
- CLAUDE.md §9 fixed (2026-04-23): matched real deployed function list.
- Stale debug log cleanup: old clearTenantSubcollections diagnostic resolved.

---

## Large File Watch (>500L)

Flagged during Patch A2 — candidates for FAZ 6 split refactor:
- `AnalyticsTab.jsx` — **937L** (over 800 threshold)
- `CardsTab.jsx` — **1038L** (over 800 threshold)
- `CampaignsTab.jsx` — **798L** (at boundary)
- `OverviewTab.jsx` — **746L** (growing — was 674 after Patch A, 746 after Patch B)
- `InventoryTab.jsx` — **660L**
- `VIPCrmTab.jsx` — **513L**

Also historical context:
- `AutoDashboard.jsx` (legacy) — **1571L** — retires in FAZ 5 Step 2, no split needed
- `useDashboardData.js` — ~1260L
- `UnifiedLayout.jsx` — ~750L
- `tenantService.js` — ~500L

---

## Open Strategic Items (priority order)

1. **Sprint 1A.1 hotfix** — in flight with Cursor. Unblocks NotificationSystem manual cross-tab realtime test.
2. **Sprint 1B** — Reissue Portal Link, Help modal, Zero Engagement badge, NFC ROI + Avg Session KPIs (4 SIMPLE items from `docs/LEGACY_DASHBOARD_AUDIT.md`). Directive to be written after 1A.1 QA passes.
3. **Sprint 2 — Brand surfaces** (MEDIUM complexity, ~6h Cursor work). 5-Minute Proof tutorial section, Sales Trigger panel (visual + brand copy "Strike while interest is hot"), Buyer Sites sidebar with last-activity status, Velocity KPIs row (TTFA / Viewing Velocity / Lead Capture Rate), VIP Alert Summary "Top Alerts" list, Outreach guardrail copy ("Don't say you tracked them..."), Owner workload Due Today + Risk columns.
4. **Sprint 3 — Polish** (SIMPLE, ~3h). Score-driven action ladder, Top Saved Configurations table, Quick Actions strip, NBA card, AI Pipeline nav decision (separate route — keep deferred decision: do not add 10th tab).
5. ~~FAZ 5 Step 2 — legacy hard retire~~ — **CANCELLED.** Legacy dashboards remain accessible. Decision logged 2026-04-24.
6. Yacht public page + /yacht/demo portals (region-aware day one).
7. Canada deploy — **blocked by FAZ 6** (FR not production-ready on main site).
8. Mexico deploy — **blocked by FAZ 6** (ES not production-ready on main site).
9. Apple Developer Account enrollment.
10. Tenant Mode hardening — cleanupInactiveTenants dry-run → real delete (UAT pending).
11. Sentry setup.

---

## Known Drift Sources (things that silently go stale)

- Cloud Functions list — if `index.js` changes, update CLAUDE.md §9 AND this file.
- Firestore rules — `firebase firestore:rules:get` is NOT a command; verify via Firebase Console.
- Bundle hash after hosting deploy — paste the new hash here.
- Large file line counts — `wc -l` + `tail` check after every edit on files >500L.
- **Translation coverage** — if a new page/component is added, verify all 4 language dicts are populated. Silent EN fallback means missing keys are invisible without explicit check. Run a namespace parity check (EN key count == AR == ES == FR) before claiming coverage.
- **LanguageContext toggle** — 3-lang cycle shipped while `SUPPORTED_LANGS` has 4. If anyone changes the cycle logic, confirm FR is included.
- **Working tree uncommitted state (2026-04-24)** — 24 files dirty from FAZ 5 Step 1 patches. If more work starts before commit, merge risk grows. Consider committing as `feat(unified): FAZ 5 Step 1 — dashboard migration + 4-language coverage` once QA passes.
- **NotificationSystem dataMode source** — `useDashboard()` and `DashboardDataProvider.jsx` are the source of truth. After Sprint 1A.1 ships, `dataMode` will be settable from SettingsTab and persisted to localStorage. Anyone modifying NotificationSystem behavior must verify both `tenant` and `mock` paths. Mock auto-fire is the demo "wow"; realtime stream is the in-meeting magic. Both must keep working.
- **eventDisplayMap shape change in Sprint 1A.1** — moves from flat `{lang: {code: label}}` to sector-aware `{GENERIC + SECTOR_OVERRIDES}` with a `getEventLabel(code, lang, sector)` helper. Backward-compat flat export retained. If a future patch adds a new event code, register it in BOTH the generic layer (if sector-agnostic) AND the relevant sector overrides (if terminology differs).
- **Walk-in Promote is UI-only demo** — clicking confirms hides the row in component state, no Firestore write, no real VIP creation. Refresh resets. Real promote flow is FAZ 6 / Tenant Mode hardening scope. Anyone implementing real promote must remove the UI-only state guard before wiring backend.

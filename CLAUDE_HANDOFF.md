
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

Last updated: 2026-04-29 EOD by Claude (session: Sprint 1B2 SHIPPED to origin/main, squash commit `4e61ff1f`. Sprint 1B series complete.)

---


## Tomorrow's Pickup — READ FIRST

**Where we stopped:** Sprint 1A.1 + 1A.2 SHIPPED (commit `ef1aeea0` on origin/main, 2026-04-28). NotificationSystem cross-tab realtime, sector-aware mock toasts, Promote modal hierarchy, toast position top-right, and Walk-in Promote (Automotive path) all PASS in QA Round 7. Demo's primary wow-factor (cross-tab realtime + sector-appropriate auto-fire) is now production-ready in /unified.

**QA Round 7 results (2026-04-28):**
- T2 Sector toasts (RE/Auto/Yacht): **PASS** — all 3 sectors fire sector-appropriate event codes via `getEventLabel(code, lang, sector)`.
- T3 Cross-tab realtime: **PASS** — Khalid Al-Mansouri (Auto) + Ahmed Al-Fahad (RE) toasts visible in /unified within 5s of portal CTA click in second tab.
- T4 Toast position: **PASS** — top-right corner, newest on top.
- T1 Walk-in Promote (Auto only): **PASS** — modal opens, Promote button is brand red primary, Cancel ghost, candidate hides post-confirm, "+local" badge appears in VIP list.
- T1 Walk-in Promote (RE): **FAIL** — modal skipped entirely, candidate added directly to VIP list. Sector-conditional code path bug. Deferred to Sprint 1B.
- T5 Regression: **PARTIAL FAIL** — VIP CRM list shows persona/region pool inconsistency (Gulf personas appearing in USA/Mexico/Canada RE; Khalid Al-Mansouri Auto-Gulf persona appearing in RE across all regions). Right panel state leak when sector switches (e.g., "AMG GT 63 S E Performance" stays as TOP UNIT in Mexico RE context). VIP count badge mismatch (Gulf=4, others=5).

**Critical: T5 bugs are NOT regressions.** Verified pre-existing via `git stash` baseline check before 1A.2 commit — same persona pool inconsistency exists in Sprint 1A baseline (`36a434ab`). Sprint 1A.2 is not responsible. Bugs are real and need fixing, just not as 1A.3 hotfix.

**Bugs surfaced — deferred to Sprint 1B (data integrity sub-sprint):**
1. **Persona/region pool inconsistency (HIGH):** RE sector shows Gulf personas regardless of active region. Khalid Al-Mansouri (Auto-Gulf persona per CLAUDE.md §3) appearing in RE listings across all 4 regions. CLAUDE.md persona table needs strict enforcement in `getPersonas(sector, regionId)` selector. **Pre-existing, not 1A.2 introduced.**
2. **VIP CRM right panel state leak (MEDIUM):** When sector changes RE→Auto→Yacht, the right-side VIP detail panel keeps showing stale data (e.g., AMG GT vehicle name in Mexico RE context). Detail panel needs to subscribe to sector/region change and reset selected VIP.
3. **Walk-in Promote modal skipped on RE (HIGH):** In Real Estate sector, clicking "Promote" on Walk-in candidate skips the confirmation modal entirely — direct UI mutation. Modal works correctly in Automotive sector. Likely sector-conditional code path in `VIPCrmTab.jsx` promote handler — generic helper needed (per CLAUDE.md code simplicity mandate).
4. **VIP count badge inconsistency (LOW):** Sidebar VIP CRM count shows "5" in USA/Mexico/Canada RE but "4" in Gulf RE. Count logic appears region-mismatched.
5. **VIP CANDIDATES region-aware persona may need review:** Different "candidate" personas appear per region (Robert Williams in USA, Diego Fernandez in Mexico, Michael Tremblay in Canada, Ahmed Al-Fahad in Gulf — but Ahmed Al-Fahad is supposed to be a Gulf RE VIP, not a candidate per CLAUDE.md §3). Looks intentional but Bug #1 suggests pool selection has issues.

**First action when starting next session:** Read this Tomorrow's Pickup, then write Sprint 1B directive. Scope decision needed: 1B is now ~9 items (5 data integrity bugs above + 4 original simple items: Reissue Portal Link, Help modal, Zero Engagement badge, NFC ROI + Avg Session KPIs). **Recommend splitting into 1B1 (data integrity) and 1B2 (legacy migration)** — 1B1 first because it touches demo accuracy (sales-blocking risk during persona-driven sector demos).

**Open Question for next session:** Confirm Sprint 1B split decision before writing directive.

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

### Working tree state (end of 2026-04-28)
- Branch: **clean** — `ef1aeea0` is HEAD on origin/main, Sprint 1A.1 + 1A.2 + audit docs committed and pushed.
- `git status`: nothing to commit, working tree clean.
- Push history: `185c5ebb` (local commit) → `git pull --rebase origin main` (54 chore-only bot commits absorbed) → `ef1aeea0` (final pushed hash).
- Known clean diff boundaries: legacy dashboards untouched, main site pages untouched, demo portals untouched, /admin untouched, LanguageContext.jsx untouched, backend/ untouched.

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

3. **Sprint 1B split decision** — single 9-item directive or split into 1B1 (data integrity, 5 items) + 1B2 (legacy migration, 4 items)? Recommend split. Decision before next directive write.

---



## In-Flight Work

(none — Sprint 1B series complete. Sprint 2 directive pending strategic kickoff.)

---

## Recently Completed

- Sprint 1B2 SHIPPED (2026-04-29 EOD): squash commit `4e61ff1f` to origin/main. PR #4 merged. 7 sprint items + 4 hotfix commits = 10 commits squashed. Diff: +505 / -78 across 9 files. Items shipped:
  - Item 0a: Family-buyer chip + hint link + family badge in VIP CRM (Option C: filter chip pattern, locked by Oguzhan 2026-04-29)
  - Item 0b: Dead `vipCandidates` analytics block removed (closes Bugbot LOW from PR #3)
  - Item 0c: Promoted candidate filter callback made element-aware (closes Bugbot LOW from PR #3)
  - Item 1: Reissue Portal Link clipboard action with 4-lang toast in VIP detail panel
  - Item 2: "How This Works" Help modal — topbar `?` button, brand-locked content (VIP Traffic / Standard Traffic / Key Rule), 4-lang, ESC/backdrop/X close
  - Item 3: Zero Engagement badge + filter chip in InventoryTab with fallback hot-units list
  - Item 4: NFC ROI + Avg VIP Session KPI tiles in OverviewTab (all 3 sectors)
  Hotfix sequence (pre-merge audit + QA discovery):
  - Hotfix 1: Anonymous events excluded from session metric (PR #3 Bugbot finding)
  - Hotfix 2: Sidebar count SSOT restored, localStorage hack removed (1B1 SSOT contract preserved)
  - Hotfix 4a: Mobile sidebar hamburger regression fixed (CSS media query 1024px → 767px revert)
  - Hotfix 4b: Avg VIP Session bounded by 30-min idle gaps + 4h sanity cap (defensible Google Analytics-style metric)
  QA: Round 9 (T1-T7) + Round 10 (T8-T9) PASSED. 6/7 + 2/2 cells. [Claude+Cursor, Oguzhan QA Round 9+10]
- T2 d minor debt logged 2026-04-29: VIP CRM family chip state resets to OFF when navigating between tabs (mounting/unmounting). Refresh consistency works correctly (Hotfix 2 PASS). Decision: ship now, lift state to UnifiedLayoutInner in Sprint 1B3 or alongside Sprint 2 if a relevant component is touched. Not sales-blocking. [Oguzhan QA, 2026-04-29]
- Mobile topbar overflow noted 2026-04-29: At 375px viewport, topbar elements (logo, page title, Live, Country, Lang, ?, Theme, Readable, Export PDF) compress past readable width. Pre-existing UX issue, not introduced by Sprint 1B2 (Help button is one of nine elements, others were already there). Routed to Sprint 2 as a Mobile UX item — proposed solution: collapse Theme/Readable/Export into a 3-dot overflow menu at mobile breakpoint, keep hamburger + page title + lang + country visible. [Oguzhan QA T8, 2026-04-29]

- Sprint 1B1 SHIPPED (2026-04-29): squash commit `87bbb2a3` to origin/main. PR #3 merged. 5 bugs fixed: persona/region pool consistency (Bug 1), VIP detail panel sector-reset (Bug 2), Walk-in Promote modal RE skip (Bug 3), VIP count badge SSOT (Bug 4), Walk-in candidate anonymized to "Walk-in Prospect" 4-lang label (Bug 5). VIPCrmTab.jsx net -28 lines (code simplicity mandate respected). QA Round 8 PASSED 5/6 (T1-T6). Build PASS, working tree clean. [Claude+Cursor, Oguzhan QA Round 8]
- Cursor Bugbot flagged 2 LOW-severity issues post-merge: redundant vipCandidates computation in useDashboardData.js (dead code shadow), and `.filter()` callback ignoring element parameter in VIPCrmTab.jsx local-promoted dedup. Both deferred to Sprint 1B2 Item 0 cleanup (same files Cursor will touch). [Bugbot, 2026-04-29]
- T2 Bug 1 partial finding: family-type personas (Ahmed Al-Fahad in Gulf RE, Chloe/William/Rebecca in Canada RE) do not surface in VIP CRM tab. Sprint 1B1 fixed VIP-type names; family surfacing is separate. Confirmed by Oguzhan: Ahmed Al-Fahad does NOT appear in any other tab either (Pipeline, Activity Feed, Kanban). Routed to Sprint 1B2 Item 0a as product decision (3 options pending). [Oguzhan QA, 2026-04-29]

- Sprint 1A.1 + 1A.2 SHIPPED (2026-04-28): commit `ef1aeea0` pushed to origin/main (15 files changed, +757 / -139). NotificationSystem cross-tab realtime fixed via `BroadcastChannel("dnfc_tracking")` listener in mock mode + payload normalization + sector-aware label resolution. Sector-aware mock toasts (RE/Auto/Yacht event pools driven by `getPersonas(sector, region)` + `getEventLabel(code, lang, sector)`). Promote modal hierarchy fixed (red primary, ghost cancel, reusable button classes in UnifiedLayout.css). Toast position migrated bottom-right → top-right with newest-on-top stack. Walk-in Promote Automotive path verified working (modal + hide + local VIP entry). QA Round 7: 4/5 critical PASS, T1 RE modal FAIL deferred to 1B (sector-conditional bug), T5 VIP CRM list FAIL pre-existing (verified non-regression via git stash baseline). Audit docs `docs/SPRINT_1A_HOTFIX_AUDIT.md` + `docs/SCHEMA_AUDIT_2026.md` committed alongside. Rebase pulled 54 chore-only bot commits cleanly with no conflicts. [Cursor implementation + Oguzhan QA + Claude audit & directive]
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
- `VIPCrmTab.jsx` — **513L** (likely grew with 1A.2 Walk-in Promote local state — re-measure before next edit)

Also historical context:
- `AutoDashboard.jsx` (legacy) — **1571L** — retires CANCELLED, no split needed (kept accessible)
- `useDashboardData.js` — ~1260L
- `UnifiedLayout.jsx` — ~750L
- `tenantService.js` — ~500L

---

## Open Strategic Items (priority order)

1. **Sprint 1B3 — Optional minor cleanup** (~30 min, OPTIONAL, can be folded into Sprint 2): Lift VIP CRM family chip state from VIPCrmTab into UnifiedLayoutInner so chip ON state persists across tab navigation (T2 d debt). Touches `UnifiedLayout.jsx` + `VIPCrmTab.jsx`. Consider folding into Sprint 2 if a touching task already exists.

2. **Sprint 2 — Brand surfaces** (MEDIUM complexity, ~6h Cursor work). 5-Minute Proof tutorial section, Sales Trigger panel (visual + brand copy "Strike while interest is hot"), Buyer Sites sidebar with last-activity status, Velocity KPIs row (TTFA / Viewing Velocity / Lead Capture Rate), VIP Alert Summary "Top Alerts" list, Outreach guardrail copy ("Don't say you tracked them..."), Owner workload Due Today + Risk columns. **Add: Mobile topbar overflow menu (T8 noted) — collapse Theme/Readable/Export into 3-dot at <768px breakpoint.**

3. **Sprint 3 — Polish** (SIMPLE, ~3h). Score-driven action ladder, Top Saved Configurations table, Quick Actions strip, NBA card, AI Pipeline nav decision (separate route — keep deferred decision: do not add 10th tab).
4. ~~FAZ 5 Step 2 — legacy hard retire~~ — **CANCELLED.** Legacy dashboards remain accessible. Decision logged 2026-04-24.
5. Yacht public page + /yacht/demo portals (region-aware day one).
6. Canada deploy — **blocked by FAZ 6** (FR not production-ready on main site).
7. Mexico deploy — **blocked by FAZ 6** (ES not production-ready on main site).
8. Apple Developer Account enrollment.
9. Tenant Mode hardening — cleanupInactiveTenants dry-run → real delete (UAT pending).
10. Sentry setup.

---

## Known Drift Sources (things that silently go stale)

- Cloud Functions list — if `index.js` changes, update CLAUDE.md §9 AND this file.
- Firestore rules — `firebase firestore:rules:get` is NOT a command; verify via Firebase Console.
- Bundle hash after hosting deploy — paste the new hash here.
- Large file line counts — `wc -l` + `tail` check after every edit on files >500L.
- **Translation coverage** — if a new page/component is added, verify all 4 language dicts are populated. Silent EN fallback means missing keys are invisible without explicit check. Run a namespace parity check (EN key count == AR == ES == FR) before claiming coverage.
- **LanguageContext toggle** — 3-lang cycle shipped while `SUPPORTED_LANGS` has 4. If anyone changes the cycle logic, confirm FR is included.
- **NotificationSystem dataMode source** — `useDashboard()` and `DashboardDataProvider.jsx` are the source of truth. `dataMode` is settable from SettingsTab and persisted to localStorage (Sprint 1A.1). Anyone modifying NotificationSystem behavior must verify both `tenant` and `mock` paths. Mock auto-fire is the demo "wow"; cross-tab realtime stream is the in-meeting magic. Both must keep working.
- **eventDisplayMap shape (Sprint 1A.1)** — flat `{lang: {code: label}}` deprecated. New shape: `{GENERIC + SECTOR_OVERRIDES}` with `getEventLabel(code, lang, sector)` helper. Backward-compat flat export retained. If a future patch adds a new event code, register it in BOTH the generic layer (if sector-agnostic) AND the relevant sector overrides (if terminology differs).
- **Walk-in Promote is UI-only demo** — clicking confirms hides the row in component state, no Firestore write, no real VIP creation. Refresh resets. Real promote flow is FAZ 6 / Tenant Mode hardening scope. Anyone implementing real promote must remove the UI-only state guard before wiring backend. **Currently works only in Automotive sector** — RE path skips modal entirely (Sprint 1B fix scope).
- **Persona/region pool inconsistency** — `getPersonas(sector, regionId)` selector does not strictly enforce CLAUDE.md §12 persona table. Gulf personas leak into other regions in RE sector. **Pre-existing bug, predates Sprint 1A.** Sprint 1B1 fix scope.

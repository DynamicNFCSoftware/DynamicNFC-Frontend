
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

Last updated: 2026-05-02 by Claude (Sprint 2 #4 directive locked: Velocity KPIs + Today's Brief. Stack A2+B3+C1+D2+E2+F1+Functions config. Awaiting Cursor execution.)

---



## Resume Tomorrow (2026-05-03)

**1. Cursor output review — Sprint 2 #4**

Cursor `cursor/sprint-2-4-velocity-kpis` branch'inde directive'i execute etti (veya etmedi). Çıktıyı Claude'a yapıştır → audit. Audit clean ise:

- Anthropic API key set:
```powershell
  firebase functions:config:set anthropic.api_key="sk-ant-..."
```
- Deploy: `firebase deploy --only functions:aggregateVelocityMetrics,functions:refreshDailyBriefAi`
- Wait 15min — verify `tenants/{uid}/aggregates/velocity` + `aggregates/dailyBrief` Firestore'da oluştu
- Frontend deploy + UI QA on /unified/overview

**2. Bot verify (2026-05-02 ve 2026-05-03 dosyaları)**

Botun saatlik koşumlarını tamamen bıraktığını doğrula:

```powershell
ls docs\github-summaries\
git log --grep="chore(summary)" --since="2026-05-02" --pretty="%h %ai %s"
```

Beklenti: `2026-05-02.md` ve `2026-05-03.md` dosyaları var, her biri tek "06:00 update" entry içeriyor (Toronto timezone).
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

### Working tree state (end of 2026-04-30 — session close)
- HEAD: `d62fd598` on origin/main, in sync (off-by-one: this session-close commit will be HEAD+1 after push).
- Working tree: **CLEAN**.
- Day total: 12 commits — 5 fixes (i18n SoS→WoW, family chip persist, fake metric removal, mobile topbar, hosting cache gitignore), 1 chore (Actions bot daily-cap), 6 handoff updates.
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

1. **Campaign description field** (e.g., "early interest campaign for Prestige Motors Vancouver") — tenant-generated content or hardcoded seed data? If seed data, should stay EN as-is (real customers will write in their own language). Leaning: leave as-is, not a bug.

2. **Sprint 1B split decision** — single 9-item directive or split into 1B1 (data integrity, 5 items) + 1B2 (legacy migration, 4 items)? Recommend split. Decision before next directive write.

3. **Suspense key=pathname remount pattern** — `App.jsx:169` uses `<AnimatePresence mode="wait"><Suspense key={location.pathname}>` which unmounts/remounts the entire route subtree on every nav. Provider state inside UnifiedLayout (DashboardDataProvider) loses all useState values on tab switch. localStorage persist used as workaround for `showFamilyBuyers` (Sprint 1B3) but pattern likely affects other states. Needs architectural review — options: route-group keying, provider lift above AnimatedRoutes, or stateful route wrapper. [Tech Debt — Architecture]

4. **Branch protection on `main`** — `github-activity-summary.yml` uses `permissions: contents: write` and pushes directly to `main`. If branch protection is later enabled (required PR review, signed commits, etc.) this workflow will break unless given an exception or scoped to push to a separate branch. Decision deferred until branch protection is actually configured. [Tech Debt — Repo Hygiene]

5. **Handoff HEAD off-by-one** — Every handoff-touching commit makes the recorded HEAD stale by 1. Accepted as "snapshot at last sync" — read accordingly. Not worth fixing with a self-referential pattern. [Tech Debt — Doc Hygiene]

6. **React Router future flag warning** — `v7_relativeSplatPath` console warning on every page load. Non-blocking, cosmetic noise. Resolve at sprint cleanup phase. [Tech Debt — Console Hygiene]

7. **Recharts mobile width(-1) error** — KPI sparkline ResponsiveContainer fails at narrow viewports (mobile). ~5-10 min fix. Surfaced in Sprint 2 mobile QA round. [Tech Debt — Mobile UI]

---



## In-Flight Work

- Sprint 2 #4 in progress (2026-05-02): Velocity KPIs + Today's Brief. Stack locked A2+B3+C1+D2+E2+F1+Functions config. 8 metrics ship: TTFA, Viewing Velocity, Re-engagement Rate, Second-Tap Rate, Lead Capture Rate, VIP→Booked, Decision Window, Sales Rep Response Time. AI brief uses Claude Haiku 4.5 with E2 rate limit + F1 silent fallback to template. Layout: Pipeline overview (4) + Today's Brief block (full-width, replaces standalone NFC ROI) + Sales velocity 4+4 grid. Directive: `SPRINT2_4_VELOCITY_KPIS_DIRECTIVE.md`. Deferred (Sprint 3-4): Behavioral Events/Tap, Region Velocity Index, Pipeline Acceleration Score. [Cursor]
- Sprint 2 remaining: **#1, #2, #3, #5, #6, #7** (after #4 ships). [Cursor]

---

## Recently Completed

**2026-04-30 day total: 12 commits** — repo hygiene reset, Sprint 1B3, Sprint 2 #8, Actions bot daily-cap, fake metric removal. Working tree clean at session close.

- Fake metric removed (2026-04-30): VIP Conversion Lift KPI card ("100×" fake metric) removed from Overview KPI grid (RE + Auto sectorConfig). Bonus exec card subtitle replaced with qualitative copy ("Identity-first conversion intelligence", 4 lang). Data layer untouched. Grid temporarily 4+1 layout — Sprint 2 #4 will refill. Commit `a1ff0128`. [CC + Claude]
- Bot freq fix SHIPPED (2026-04-30): `github-activity-summary.yml` cron reduced hourly → daily 23:00 America/Toronto (04:00 UTC). Skip-if-empty guard + bot-self-filter (`--invert-grep`) added. Default lookback 1h → 24h. Expected: ~13 bot commits/day → max 1/day, 0 on silent days. Commit `6b7495ed`. Closes Repo Hygiene tech debt #1. [CC]
- Sprint 2 #8 (2026-04-30): Mobile topbar 3-dot overflow menu. Region stays visible at ≤768px; Live/Demo, Lang, Help, Theme, Export PDF collapse into menu. RTL-safe. Closes Sprint 1B2 QA carryover. [Cursor]
- Sprint 1B3 (2026-04-30): VIP CRM family chip state persisted to localStorage. Survives tab switches and browser reload. Workaround for broader `<Suspense key=pathname>` remount pattern. [CC + Claude]
- Git hygiene (2026-04-30): .firebase/*.cache moved to .gitignore + git rm --cached. Eliminates CRLF noise + deploy cache churn. Commit 1e039108. [CC]
- Repo state reset (2026-04-30): 15 CRLF-only modified files reverted via git checkout. Working tree returned to genuine clean state for first time since Sprint 1B2. [CC]
- SoS → WoW i18n fix (2026-04-30): InventoryTab.jsx ES + FR wow label corrected from "SoS" (typo) to "WoW" (BI standard). Resolves Open Question #1. [CC]
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

1. **Sprint 2 — Brand surfaces** (MEDIUM complexity, ~6h Cursor work). 5-Minute Proof tutorial section, Sales Trigger panel (visual + brand copy "Strike while interest is hot"), Buyer Sites sidebar with last-activity status, Velocity KPIs row (TTFA / Viewing Velocity / Lead Capture Rate), VIP Alert Summary "Top Alerts" list, Outreach guardrail copy ("Don't say you tracked them..."), Owner workload Due Today + Risk columns. **Status:** item #8 (mobile topbar overflow) completed; remaining #1, #2, #3, #4, #5, #6, #7.

2. **Sprint 3 — Polish** (SIMPLE, ~3h). Score-driven action ladder, Top Saved Configurations table, Quick Actions strip, NBA card, AI Pipeline nav decision (separate route — keep deferred decision: do not add 10th tab).
3. ~~FAZ 5 Step 2 — legacy hard retire~~ — **CANCELLED.** Legacy dashboards remain accessible. Decision logged 2026-04-24.
4. Yacht public page + /yacht/demo portals (region-aware day one).
5. Canada deploy — **blocked by FAZ 6** (FR not production-ready on main site).
6. Mexico deploy — **blocked by FAZ 6** (ES not production-ready on main site).
7. Apple Developer Account enrollment.
8. Tenant Mode hardening — cleanupInactiveTenants dry-run → real delete (UAT pending).
9. Sentry setup.

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

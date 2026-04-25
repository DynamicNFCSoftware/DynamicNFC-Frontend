
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

Last updated: 2026-04-24 EOD by Claude (session: FAZ 5 Step 1 complete, QA pending)

---

## Tomorrow's Pickup — READ FIRST

**Where we stopped:** FAZ 5 Step 1 is **code-complete** across 4 patches (A / B / A2 / A2 hotfix). Build PASS. Working tree dirty with ~24 files changed; nothing committed yet.

**What's pending before FAZ 5 Step 2:** Manual visual QA by Oguzhan across `/unified` tabs in all 4 languages × 4 regions. The QA session was interrupted by a scope-creep detour (DashboardDataProvider split, resolved — see Recently Completed).

**First action tomorrow:**
1. Oguzhan runs local dev, executes the QA checklist in §Manual QA Protocol below.
2. Report findings to Claude in `[TAB] [LANG] [REGION] — "seen" → expected "translation"` format.
3. Claude issues Patch A3 (if gaps found) + SoS decision mini-fix, OR proceeds straight to FAZ 5 Step 2 (hard retire) directive.

**Do NOT start FAZ 5 Step 2 or FAZ 6 before QA is complete.** Four stacked patches without validation is risky — assume bugs exist until demonstrated otherwise.

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

- **Post-Patch-A2 QA** — Oguzhan runs manual QA checklist above before FAZ 5 Step 2 directive is issued. [Oguzhan]

---

## Recently Completed

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

1. **FAZ 5 Step 2** — legacy hard retire: delete `/enterprise/crmdemo/dashboard` + `/automotive/dashboard`, remove all callers, redirect to `/unified`. **Blocked by Post-Patch-A2 QA sign-off.**
2. **SoS mini-fix** — small follow-up to Patch A2 once Oguzhan clarifies meaning.
3. **FAZ 6 — Full FR + ES rollout** — add FR/ES namespaces to all 18 page-level files, fix LanguageContext toggle (EN→AR→ES→FR 4-cycle), add dev-mode console.warn on missing translation keys, visual QA across all 4 languages. **Blocks Canada + Mexico deploys.** Also includes: `DashboardContext.jsx` split (parked tech debt), large file splits (AnalyticsTab, CardsTab).
4. Per-region demo rollout — `useRegion()` across CRM + Auto portals (separate from translation work).
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
- **Working tree uncommitted state (2026-04-24)** — 24 files dirty from FAZ 5 Step 1 patches. If more work starts before commit, merge risk grows. Consider committing as `feat(unified): FAZ 5 Step 1 — dashboard migration + 4-language coverage` once QA passes.

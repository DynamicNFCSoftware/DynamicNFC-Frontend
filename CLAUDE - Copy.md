# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview
DynamicNFC — NFC-powered Sales Velocity Engine for real estate and automotive industries.
React frontend + Firebase (Hosting, Auth, Firestore, Cloud Functions).

## Project Root
- **Windows Path:** `C:\Users\oguzh\DynamicNFC`
- **Frontend:** `frontend/` (Vite + React)
- **Backend:** `backend/` (Java Spring Boot — DO NOT MODIFY)
- **Functions:** `functions/` (Firebase Cloud Functions 1st Gen, Node.js 22)

## Commands
```bash
# Frontend dev
cd frontend && npm run dev

# Build
cd frontend && npm run build

# Deploy everything
firebase deploy

# Deploy only hosting
cd frontend && npm run build && cd .. && firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only firestore rules
firebase deploy --only firestore:rules
```

## Firebase Project
- Project ID: `dynamicnfc-prod-68b4e`
- Hosting: `dynamicnfc.ca` + `www.dynamicnfc.ca`
- Auth: Google + Email/Password
- Plan: Blaze (pay as you go)
- Region: us-central1 (functions), northamerica-northeast1 (Firestore)

## Firestore Collections
- `cards` — Existing NFC profile data (DO NOT MODIFY)
- `smartcards` — Smart URL redirect cards (cardId, redirectUrl, status, assignedTo, totalTaps)
- `taps` — Tap event log (cardId, timestamp, deviceType, campaignId, assignedTo)
- `campaigns` — Campaign grouping (name, client, totalCards, status)
- `admins` — Admin users (document ID = email, role, name)

## Key Architecture Decisions
- Smart URL: `dynamicnfc.ca/c/{cardId}` → React CardRedirect component → Firestore lookup → redirect
- Client-side redirect (not Cloud Functions) due to GCP org policy restrictions on public function access
- Admin panel: `/admin/*` with sidebar layout, ProtectedRoute + useAdmin hook
- Admin access: Firestore `admins` collection — only listed emails can access /admin
- CSS: Each page has unique prefix (ta- analytics, ca- cards, ap- layout, ad- dashboard, acmp- campaigns)
- i18n: EN/AR with inline TR objects in each component
- All pages use React.lazy() for code splitting

## File Structure
```
frontend/
  src/
    firebase.js              # Firebase config — exports: auth, db
    contexts/AuthContext.jsx  # Auth provider — exports: useAuth
    hooks/useAdmin.js         # Admin check hook — exports: useAdmin
    pages/
      Admin/
        AdminLayout.jsx       # Sidebar layout with Outlet
        tabs/
          AdminDashboard.jsx  # Overview stats
          AdminAnalytics.jsx  # Tap analytics (recharts)
          AdminCards.jsx      # Card CRUD
          AdminCampaigns.jsx  # Campaign management
          AdminSettings.jsx   # Settings
      CardRedirect/           # /c/:cardId → Firestore lookup → redirect
      Home/                   # Landing page
      Enterprise/             # Sales page (multi-industry)
      Login/                  # Firebase Auth login
      ...
  public/
    manifest.json             # PWA manifest
    sw.js                     # Service worker
    offline.html              # Offline fallback
    icons/                    # PWA icons (192, 512)
functions/
  index.js                    # Cloud Functions (cardRedirect + API)
firebase.json                 # Hosting + Functions + Firestore config
firestore.rules               # Security rules
firestore.indexes.json        # Composite indexes
```

## Brand
- Colors: Red #e63946, Blue #457b9d, Charcoal #1a1a1f, Cream #faf8f5
- Fonts: Playfair Display (headings), Outfit (body)
- Dark theme for admin/portals, light option for public pages

## Important Rules
- NEVER modify the `backend/` folder (Java Spring Boot)
- NEVER modify the existing `cards` Firestore collection
- Always use CSS prefix per page to avoid conflicts
- Always use named export `db` from firebase.js (not default)
- Always use `useAuth()` for auth state, `useAdmin()` for admin check
- Build must pass before deploy — run `npm run build` first
- Firebase deploy runs from project ROOT (not frontend/)

## Session Memory Snapshot (2026-04)

### Unified Dashboard UI/UX completed
- Sidebar/topbar interaction stabilized.
- Logo, collapse/expand, mobile off-canvas, theme, sector switcher, tooltips — all resolved.

### Topbar Layout — LOCKED (do NOT change)
- **Left**: Small logo image (`/assets/images/logo.png`, fallback `logo_l_check.png`) + divider + page title
- **Right**: ● Live/Demo indicator + 🇺🇸 country selector + single lang button (cycle EN→AR→ES→FR on click) + 🌙 theme toggle + Export PDF
- File: `UnifiedLayout.jsx` lines ~637-710
- **DO NOT** replace logo img with text, **DO NOT** show 4 separate language buttons, **DO NOT** move Live indicator to the left side

### Tab Upgrades completed (2026-04-14)
- **InventoryTab** → Full rewrite (~490 lines). KPI band (4 cards), type filter chips, sort buttons, enriched 10-col table, Hot Unit Spotlight, detail drawer with recharts BarChart + VIP chips + Create Deal CTA. CSS prefix: `ud-inv-`.
- **CardsTab** → Full rewrite (~480 lines) as "Card Intelligence Hub". KPI band, search, health filter (Active/Cooling/Dormant), tower filter, sort buttons, enriched table with health stripe + VIP signal chips + smart actions, detail drawer with funnel chart + suggestion banners. CSS prefix: `ud-ci-`.
- **useDashboardData** → Added `inventoryMetrics` useMemo + enriched `cards` memo (sparkline, interestedVips, linkedDeals, linkedDealCount).
- **Cross-tab deal creation**: InventoryTab + CardsTab both navigate to PipelineTab with location.state pre-fill.
- **File truncation fixes**: PipelineTab.jsx (line 147), tenantService.js (line 641), useDashboardData.js (line 1087) — all restored.
- **Cursor remaining (CardsTab 10%)**: Reassign Rep action, Engagement Mix pie chart, Bulk Actions toolbar.

### Validation status
- Lint checks clean. Frontend builds successful (2026-04-15 latest).

### Tenant Mode — LOCKED (2026-04-13)
- `/unified` auth-gated, `/admin/*` admin-only unchanged.
- Tenant isolation: `tenants/{uid}/...`, demo seed on first login (`seedVersion`).
- Retention: 15d inactivity soft-delete (`pendingDeletionAt`) + 7d grace → hard delete (22d total).
- Heartbeat: 12h + login + meaningful writes. Cost ~$0.11/mo @ 1k users.
- Exempt accounts: `settings/cleanup-exempt` doc, managed via AdminSettings UI.
- Execution: Rules → Data layer → Seed → Access → Cleanup Function → Exempt UI → QA → Go-live.

### Campaign v2 — Sprint 1 COMPLETE (2026-04-15)
- Full PRD: `memory/projects/campaign-v2.md` | Jira backlog: `memory/projects/campaign-v2-backlog.md`
- **CampaignsTab.jsx** (~771 lines): Uses useReducer (18 action types via `useCampaignsReducer.js`). KPI strip, search, status/source filters, sort, pagination, inline rename, lifecycle actions, Campaign Detail Drawer, Add Campaign modal. CSS prefix: `ud-cmp-`.
- **tenantService.js** additions: `createTenantCampaign` (idempotency via idempotencyKey), `updateTenantCampaign` (rename/status/archive with audit), `getCampaignAudit`, `updateCardAssignment`, `updateCardStatus`.
- **firestore.indexes.json**: campaigns status+createdAt, source+createdAt, audit type+timestamp, taps campaignId+timestamp.

### Campaign v2.1 — Strategic Fields COMPLETE (2026-04-15)
- **AddCampaignModal** (205 lines, separate component): name, client, description, objective, targetAudience, channel[], budget, spent (edit-only), startDate, endDate. Supports create + edit modes.
- **CampaignDrawer** (227 lines, separate component): Header with status badge + SVG icons, 10-field grid (budget bar, taps, conversion), strategy section, lifecycle actions, linked cards, 7-day AreaChart performance trend, audit trail.
- **campaignUtils.js** (113 lines): STATUS_ORDER, STATUS_COLORS, STATUS_ICONS (SVG), VALID_NEXT, DEAL_STAGE_CONVERSION_WEIGHT, OBJECTIVES, AUDIENCES, CHANNELS, + 8 helper functions.
- **campaignsTab.i18n.js** (577 lines): EN/AR/ES/FR at parity, 142 keys each.
- **Readiness gate**: Draft→Active blocked if objective is empty.
- **CSS**: ud-cmp-textarea, ud-cmp-select, ud-cmp-checkbox-group, ud-cmp-date-input, ud-cmp-channel-badge, ud-cmp-drawer__strategy + light theme + responsive.
- **tenantService schema**: +description, +objective, +targetAudience, +channel[], +budget(0), +spent(0).

### Campaign Sprint 2 — Cursor COMPLETE (2026-04-15)
- **Deal attribution**: `campaignId` field on deals. AddDealModal.jsx with campaign dropdown. PipelineTab passes non-archived campaigns.
- **Tap/conversion columns**: Root `taps` collection queried by campaignId (chunked where/in/10). Weighted conversion via DEAL_STAGE_CONVERSION_WEIGHT.
- **Drawer performance chart**: 7-day AreaChart (recharts) showing tap trend per campaign.

### Campaign Sprint 3 — PENDING
- **Cursor tasks**: (1) Budget UI field in table, (2) Component extraction already done (CampaignDrawer + AddCampaignModal + campaignUtils are separate files now), (3) URL query param persistence for filters.
- **Claude Code tasks**: Cloud Functions tap aggregation, Server-side cursor pagination.
- **Still deferred**: E2E test stubs.

### Cowork Session — Truncation Fixes (2026-04-15)
- **6 files restored from truncation** in this session:
  - `CampaignsTab.jsx` — cut at line 685, restored dispatch-based calls (771 lines final)
  - `AddCampaignModal.jsx` — cut at line 160 (`type="numb`), restored spent input + dates + buttons (205 lines)
  - `CampaignDrawer.jsx` — cut at line 190 (`stroke`), restored AreaChart + audit trail (227 lines)
  - `campaignUtils.js` — cut at line 69 (`cards_tab_`), restored 8 functions (113 lines)
- **useReducer refactor**: CampaignsTab migrated from 13 useState → 1 useReducer with 18 action types (`useCampaignsReducer.js`, 106 lines)
- **i18n parity**: ES +34 keys, FR +36 keys added to campaignsTab.i18n.js. All 4 langs at 142 keys.
- **Topbar reverted**: Logo image restored, lang selector set to single cycle button, Live indicator moved to right actions bar.

### Pending Tasks (resume here)
- A. **Portal Links visibility bug** — invisible when sidebar collapsed. Needs icon-only rail + tooltip.
- B. **French (fr) translations** — remaining files: UnifiedLayout.jsx, OverviewTab.jsx, NotificationSystem.jsx, ExportPDF.jsx, AddDealModal.jsx, KanbanBoard.jsx.
- C. **Campaign Sprint 3** — Budget UI in table, URL query param persistence (Cursor). Cloud Functions tap aggregation (Claude Code).
- D. **Pre-deploy QA** — 7-step checklist (sidebar, language, KPI, charts, heatmap, kanban, sector switcher).
- E. **Build & Deploy** — after all above pass.
- F. **Yacht sector** — future addition to sidebar sector switcher.

### ⚠️ TRUNCATION WARNING
- Files >500 lines are consistently truncated by Cursor/agent edits. After ANY edit to large files, run `wc -l <file>` and verify the file ends with a proper closing `}`.
- Most-affected files: CampaignsTab.jsx (771 lines), campaignsTab.i18n.js (577 lines), useDashboardData.js (1217+ lines), tenantService.js (845+ lines).
- Integrity check script: `frontend/scripts/check-integrity.sh`
- **Always build after edits**: `cd frontend && npm run build`

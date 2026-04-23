# Campaign v2 — Product Requirements Document

**Status:** Sprint 1 + v2.1 + Sprint 2 COMPLETE | Sprint 3 PENDING
**Date:** 2026-04-15 (last updated)
**Owner:** DynamicNFC team
**Also called:** "Campaign upgrade", "CMP v2"

## Summary

Transform the CampaignsTab from a basic CRUD table into an operational workspace with search, lifecycle management, idempotent bulk create, audit trail, and KPI insights.

## 5 Epics

### Epic A — Campaign List as Actionable Workspace
- Search by name/client/source (case-insensitive)
- Multi-filter: status[], source[], sector, date range
- Sortable columns: createdAt, startDate, status, active/total
- Cursor pagination (50 per page, Load More)
- Filter/sort state persisted in URL query params

### Epic B — Campaign Lifecycle Actions
- Row action menu: Rename / Activate / Pause / Archive
- Status transitions: draft→active→paused→archived (only valid transitions enabled)
- Rename validation: 3-80 chars, trim+normalize, duplicate warning (tenant+sector scope)
- Optimistic UI + toast + rollback on error
- Campaign detail drawer (owner, source, counts, timestamps, linked cards)

### Epic C — Bulk Create Reliability & Idempotency
- `idempotencyKey` (requestId) based dedup — same key returns existing campaign
- Retry/race scenarios result in single record
- Default naming: `NFC Card Campaign YYYY-MM-DD HHmm` with user override
- Validation: no empty/invalid names

### Epic D — Data Contract, Audit, and Governance
- Extended schema: updatedAt, updatedBy, archivedAt, archivedBy, nameNormalized, idempotencyKey
- Audit trail: `campaigns/{id}/audit/*` sub-collection
- Event types: created, renamed, status_changed, archived
- Last 5 events visible in UI
- Backward compatible reads

### Epic E — Campaign KPI Strip & Operational Insights
- KPI cards: Draft count, Active count, Paused count, Archived count, Created(7d)
- KPI cards are clickable (trigger filter)
- Source health indicator: cards_tab_bulk vs manual distribution
- Zero-state behavior defined

## Technical Backlog Tickets

### Frontend
- **FE-001** (5 SP): Search + Multi-Filter Bar
- **FE-002** (3 SP): Sortable Columns
- **FE-003** (5 SP): Cursor Pagination / Load More
- **FE-004** (5 SP): Row Action Menu (Lifecycle)
- **FE-005** (3 SP): Rename Validation Hardening
- **FE-006** (5 SP): Campaign Detail Drawer
- **FE-007** (3 SP): KPI Header Strip

### Backend / Data
- **BE-001** (8 SP): Idempotent Campaign Create (requestId dedup)
- **BE-002** (5 SP): Extended Campaign Schema
- **BE-003** (8 SP): Campaign Audit Trail sub-collection

### QA
- **QA-001** (5 SP): E2E Regression Matrix
- **QA-002** (3 SP): RTL + Locale Matrix (EN/AR/ES/FR)

**Total:** ~58 SP across 3 sprints

## NFRs
- P95 list load < 1.2s
- Duplicate campaign create = 0
- Responsive: 375/768/1024/1440
- EN/AR/ES/FR label parity
- Keyboard + screen reader accessible
- Light/dark theme contrast passes

## Sprint Plan
- **Sprint 1:** EP1 + EP2 (core UX operations)
- **Sprint 2:** EP3 + EP4 (reliability + governance)
- **Sprint 3:** EP5 + hardening + performance tuning

## Release Gate (Go/No-Go)
- P95 load < 1.2s
- Duplicate create = 0 in staging retry tests
- E2E critical path pass
- Locale parity pass
- No blocker lint/type/runtime issues

## PRD Additions (2026-04-15 evening)
1. **Duplicate campaign warning on CREATE** — Same name+sector warning not just on rename (CMP-202) but also on initial create flow
2. **Campaign → Deal attribution** — Add `campaignId` field to deal schema now (v2), full attribution dashboard in v3. Enables tracking which campaign's NFC cards convert VIPs into deals.
3. **Composite index pre-deployment** — `tenants/{uid}/campaigns` needs `status + createdAt` composite index in `firestore.indexes.json` before Sprint 1 queries work.

## Risk Register
- Firestore composite index limits → mitigate with careful index planning + pre-deploy indexes
- Bulk create timeout for large batches → chunked writes with progress
- RTL layout regressions → dedicated RTL test pass per sprint

## Analytics Events
- campaign_filter_applied, campaign_sort_changed
- campaign_renamed, campaign_status_changed
- campaign_detail_opened, campaign_deal_linked
- campaign_bulk_create_started, campaign_bulk_create_completed
- campaign_kpi_clicked

## Key Files
- `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` — ~1500 lines (main component + drawer + modal + i18n)
- `frontend/src/pages/UnifiedDashboard/components/AddDealModal.jsx` — ~200 lines (deal modal with campaign dropdown)
- `frontend/src/services/tenantService.js` — ~845 lines (campaign CRUD + idempotency + audit)
- `frontend/src/hooks/useDashboardData.js` — ~1217 lines (campaigns onSnapshot + deals)
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` — ~4660 lines (ud-cmp-* prefix block)
- `firestore.indexes.json` — 7 composite indexes including taps.campaignId

## Implementation Log

### Sprint 1 (v2.0) — CC — COMPLETE
- EP1-EP5 all implemented. CampaignsTab rewritten from scratch.
- tenantService: createTenantCampaign, updateTenantCampaign, getCampaignAudit.
- Firestore indexes: campaigns status+createdAt, source+createdAt, audit type+timestamp.

### v2.1 Strategic Fields — CC — COMPLETE
- AddCampaignModal: +description (textarea 500ch), +objective (select), +targetAudience (select), +channel (6 checkboxes), +startDate/endDate (date pickers).
- Table: +Objective column, +Channel badge column.
- CampaignDrawer: +Strategy section.
- Readiness gate: objective required for Draft→Active.
- i18n: 29 new keys across EN/AR/ES/FR.
- tenantService schema: +description, +objective, +targetAudience, +channel[], +budget, +spent.

### Sprint 2 — Cursor — COMPLETE (with truncation bugs)
- Deal attribution: campaignId on deals, AddDealModal with campaign dropdown.
- Tap metrics: root taps collection queried by campaignId, weighted conversion.
- Drawer: 7-day AreaChart performance trend.
- 4 truncation bugs found and fixed by CC audit.

### Sprint 3 — PENDING
- Cursor: (1) Status badge icons, (2) Budget field UI, (3) Component extraction, (4) URL query param persistence.
- Deferred: Server-side cursor pagination, E2E tests, Cloud Functions aggregation.

## Audit Report
- Grade: B+ | Features: 14/16 (87.5%) | Build: PASS
- Full report: `Campaign_v2_Audit_Report.md` (project root)

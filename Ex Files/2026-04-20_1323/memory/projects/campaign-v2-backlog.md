# Campaign v2 — Jira-Ready Backlog

**Key prefix:** `DNFC-CMP-`
**Date:** 2026-04-15

---

## EPIC 1 — DNFC-CMP-EP1
**Title:** Campaign List as Actionable Workspace
**Goal:** Kampanya listesini soguk tablodan operasyonel calisma ekranina donusturmek.
**Success Metrics:** Filter/sort action rate +40%, Campaign bulma suresi (median) -35%, P95 list load < 1.2s

### DNFC-CMP-101 (5 SP) — Search + Multi-Filter Bar
- Search: name, client, source (case-insensitive)
- Filters: status[], source[], sector, date range
- "Clear filters" resets all
- Filter state persisted in URL query params
- DoD: Responsive (375/768/1024/1440), EN/AR/ES/FR parity, filter-aware empty state

### DNFC-CMP-102 (3 SP) — Sortable Columns
- Columns: createdAt, startDate, status, active/total
- Default: newest first
- Sort state in query params
- DoD: Keyboard accessible sort headers, stable sort on re-render

### DNFC-CMP-103 (5 SP) — Cursor Pagination / Load More
- Initial: 50 records
- "Load more" for next page
- No duplicate records
- DoD: Firestore orderBy + limit + startAfter, loading skeleton + error retry

---

## EPIC 2 — DNFC-CMP-EP2
**Title:** Campaign Lifecycle Actions
**Goal:** Satir seviyesinde kampanya yonetimi (rename, activate, pause, archive).
**Success Metrics:** Draft->Active +20%, Rename completion >90%

### DNFC-CMP-201 (5 SP) — Row Action Menu (Lifecycle)
- Actions: Rename / Activate / Pause / Archive
- Only valid status transitions enabled
- Optimistic UI + toast + rollback
- DoD: Keyboard + screen reader, transition matrix tested

### DNFC-CMP-202 (3 SP) — Rename Validation
- min 3 / max 80 chars
- trim + normalize + empty block
- Case-insensitive duplicate warning (tenant+sector scope)
- DoD: Enter save / Esc cancel / blur stable, i18n error messages

### DNFC-CMP-203 (5 SP) — Campaign Detail Drawer
- Fields: name, status, client, source, createdAt, updatedAt, active/total
- Linked cards list (first 20 + lazy load)
- Close/open state URL-independent
- DoD: Mobile full-width, focus trap + ESC close

---

## EPIC 3 — DNFC-CMP-EP3
**Title:** Bulk Create Reliability & Idempotency
**Goal:** Duplicate create risk = 0.
**Success Metrics:** Duplicate rate ~0%, Retry success >99%

### DNFC-CMP-301 (8 SP) — Idempotent Campaign Create
- idempotencyKey based dedup
- Same key returns existing campaign ID
- Retry/race = single record
- DoD: idempotencyKey indexed/searchable, unit + integration tests

### DNFC-CMP-302 (3 SP) — Bulk Naming Policy
- Default: `NFC Card Campaign YYYY-MM-DD HHmm`
- User override allowed
- Empty/invalid rejected
- DoD: i18n placeholder/error, cross-tab consistent

---

## EPIC 4 — DNFC-CMP-EP4
**Title:** Data Contract, Audit, and Governance
**Goal:** Campaign operations traceable and auditable.

### DNFC-CMP-401 (5 SP) — Extended Campaign Schema
- New fields: updatedAt, updatedBy, archivedAt, archivedBy, nameNormalized, idempotencyKey
- All create/update flows populate new fields
- Backward compatible reads
- DoD: Migration notes ready, rules impact checked

### DNFC-CMP-402 (8 SP) — Campaign Audit Trail
- Sub-collection: campaigns/{id}/audit/*
- Events: created, renamed, status_changed, archived
- Last 5 events visible in UI
- DoD: Timestamp/order correct, actor info recorded

---

## EPIC 5 — DNFC-CMP-EP5
**Title:** Campaign KPI Strip & Operational Insights
**Goal:** Liste ustunde karar sinyalleri.

### DNFC-CMP-501 (3 SP) — KPI Header Strip
- Cards: Draft, Active, Paused, Archived, Created(7d)
- Clickable (triggers filter)
- Zero-state defined
- DoD: Light/dark contrast, mobile wrap

### DNFC-CMP-502 (2 SP) — Source Health Indicator
- cards_tab_bulk vs manual distribution
- Source badge + tooltip
- Filter integration
- DoD: i18n, no layout shift

---

## QA Epic — DNFC-CMP-EPQ

### DNFC-CMP-Q01 (5 SP) — E2E Regression Matrix
- Bulk create success/fail/retry
- Rename valid/invalid/duplicate
- Status transitions valid/invalid
- Filter/sort/pagination combos
- RTL + locale matrix (EN/AR/ES/FR)

---

## Sub-task Template (per story)
- SUB-UI: component + state management
- SUB-I18N: keys + locale parity
- SUB-DATA: query/service update
- SUB-TEST: unit/integration/e2e
- SUB-DOC: release note + rollout checklist

---

## Sprint Plan
- **Sprint 1:** EP1 + EP2 (core UX ops)
- **Sprint 2:** EP3 + EP4 (reliability + governance)
- **Sprint 3:** EP5 + hardening + perf tuning

## Release Gate
- P95 load < 1.2s
- Duplicate campaign create = 0 in staging retry tests
- E2E critical path pass
- Locale parity pass
- No blocker lint/type/runtime issue on touched scope

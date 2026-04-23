# CLAUDE.md (Proposed Draft)

This draft is for review only.
Do not replace `CLAUDE.md` until approved.

## Project Overview
DynamicNFC is an NFC-powered Sales Velocity Engine for real estate, automotive, and enterprise workflows.

Core product language:
- Use **VIP Access Key** (not "digital business card")
- Use **Private Buyer Experience** for customer-facing portal framing

## Source of Truth for Rules

Primary AI rules are modularized under:
- `.cursor/rules/00-core.mdc`
- `.cursor/rules/10-frontend-react.mdc`
- `.cursor/rules/20-firestore-and-tenant-data.mdc`
- `.cursor/rules/30-functions-runtime.mdc`
- `.cursor/rules/40-brand-and-content.mdc`
- `.cursor/rules/50-workflow-and-qa.mdc`
- `.cursor/rules/60-debug-conventions.mdc`

Entrypoint:
- `.cursorrules` (minimal index + conflict policy)

## Repository Boundaries
- Root: `C:\Users\oguzh\DynamicNFC`
- Frontend: `frontend/` (React + Vite)
- Functions: `functions/` (Firebase Functions, Node 22)
- Backend: `backend/` is deprecated and should not be modified without explicit request

## Operational Constraints
- Do not modify `frontend/src/firebase.js` without explicit request
- Do not modify `frontend/src/App.jsx` routing without explicit request
- Do not change Firestore `cards` collection structure
- Treat `functions/index.js` as primary Functions entry unless user confirms otherwise

## Frontend Guidelines
- JSX-first codebase (`.js/.jsx`)
- Functional components + hooks
- Keep CSS namespaced by page/component prefix
- Prefer RTL-safe logical CSS properties
- Route changes only when explicitly requested

## i18n
- Active language set is EN / AR / ES / FR
- User-facing strings should flow through i18n helpers (`t(...)`)
- If editing language cycle behavior, keep: `EN -> AR -> ES -> FR`

## Firestore and Multi-Tenant
- Tenant model lives under `tenants/{uid}/...`
- Preserve tenant isolation
- Use merge-safe, deterministic seeding patterns where possible
- Use query limits for list-style reads when applicable

## Functions
- Runtime: Node 22, Functions v1
- Keep auth checks and input validation intact
- Production logging is allowed in Functions for observability

## Debug Conventions
- For non-obvious bugs, prefer structured JSON diagnostic logs instead of ad-hoc prints.
- Standard fields: `sessionId`, `runId`, `hypothesisId`, `location`, `message`, `data`, `timestamp`.
- Keep one log line as one JSON object (no pretty-print multiline logs).
- Use short IDs (`H1`, short session id) and include `timestamp: Date.now()` in every debug entry.
- For async phases, log both `beforeX` and `xSuccess`/`xError` boundaries.
- Store persistent diagnostic output under `debug/<sessionId>-<short-name>.log`.
- After fixing the bug, remove diagnostic logs from code and delete the debug log file in the same PR.

## QA and Deploy
- Build before deploy: `cd frontend && npm run build`
- Deploy from project root
- Validate dashboard sector/region switching for dashboard-related changes
- Respect reduced-motion and responsive checks for UI-heavy work

## Large File Safety
After edits to very large files, run integrity checks:

PowerShell:
- `(Get-Content "path").Length`
- `Get-Content "path" -Tail 40`

Bash:
- `wc -l <file>`
- `tail -n 40 <file>`




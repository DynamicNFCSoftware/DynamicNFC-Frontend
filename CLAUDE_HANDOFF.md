
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

Last updated: 2026-04-23 by Claude (session: rules + memory refresh)

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

---

## In-Flight Work

- Nothing in flight. Ready for next directive.

---

## Recently Completed

- Rules refresh (2026-04-23): all 6 .mdc files + new 60-debug-conventions
- CLAUDE.md §9 fixed (2026-04-23): matched real deployed function list
- Stale debug log cleanup: old clearTenantSubcollections diagnostic resolved

---

## Open Strategic Items (priority order)

1. FAZ 5 legacy cleanup — retire /enterprise/crmdemo/dashboard + /automotive/dashboard
2. Per-region demo rollout — useRegion() across CRM + Auto portals
3. Yacht public page + /yacht/demo portals (region-aware day one)
4. Canada deploy + French translation validation
5. Apple Developer Account enrollment
6. Tenant Mode hardening — cleanupInactiveTenants dry-run → real delete (UAT pending)
7. Sentry setup

---

## Known Drift Sources (things that silently go stale)

- Cloud Functions list — if index.js changes, update §9 AND this file
- Firestore rules — `firebase firestore:rules:get` is NOT a command; verify via Firebase Console
- Bundle hash after hosting deploy — paste the new hash here
- Large file line counts — wc -l + tail check after every edit on files >500L
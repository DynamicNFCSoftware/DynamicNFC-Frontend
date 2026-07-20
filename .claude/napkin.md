# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-07-15] AI demo events need sector switch in Unified**
   Do instead: after Auto/Yacht AI pipeline runs, switch Unified sector to Automotive/Yacht to see feed — auto events are invisible under RE view.
2. **[2026-07-13] Cursor verify = build + TEST**
   Do instead: always run `npm test` after build; component context hooks need providers in tests (FAZ5 lesson).
3. **[2026-04-24] Treat missing translations as hidden defects**
   Do instead: run namespace parity checks and verify UI text visually because fallback-to-EN can mask gaps.
4. **[2026-04-24] Keep scope locked during QA windows**
   Do instead: log unrelated refactors as deferred tech debt unless they block the active QA objective.

## Shell & Command Reliability
1. **[2026-04-24] Re-verify function inventory after backend edits**
   Do instead: run `firebase functions:list` and update handoff snapshots when function surface changes.
2. **[2026-04-24] Avoid stale line-count assumptions on large files**
   Do instead: re-check file lengths after edits for files over 500 lines before planning split/refactor work.

## Domain Behavior Guardrails
1. **[2026-07-14] EVENT_ALIAS is global-first then sector**
   Do instead: when adding portal events, check both global EVENT_ALIAS and SECTOR_EVENT_ALIAS.automotive — contact_advisor→contact_agent needs auto reverse map or events vanish.
2. **[2026-07-13] Stale i18n registry ≠ live page copy**
   Do instead: when cleaning unused `registerTranslations` files, rewrite only obvious myth keys; do not gut files or touch `src/shared/translations.js`.
3. **[2026-04-24] FR is missing from language toggle cycle**
   Do instead: use direct language selector for FR testing until FAZ 6 fixes `LanguageContext` toggle order.

## User Directives
1. **[2026-04-24] Preserve existing dirty worktree changes**
   Do instead: implement targeted edits only and never revert unrelated modifications.

# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-04-24] Do visual QA before FAZ 5 Step 2**
   Do instead: complete `/unified` manual QA across EN/AR/ES/FR and regions, then apply fixes, then retire legacy dashboards.
2. **[2026-04-24] Treat missing translations as hidden defects**
   Do instead: run namespace parity checks and verify UI text visually because fallback-to-EN can mask gaps.
3. **[2026-04-24] Keep scope locked during QA windows**
   Do instead: log unrelated refactors as deferred tech debt unless they block the active QA objective.

## Shell & Command Reliability
1. **[2026-04-24] Re-verify function inventory after backend edits**
   Do instead: run `firebase functions:list` and update handoff snapshots when function surface changes.
2. **[2026-04-24] Avoid stale line-count assumptions on large files**
   Do instead: re-check file lengths after edits for files over 500 lines before planning split/refactor work.

## Domain Behavior Guardrails
1. **[2026-04-24] FR is missing from language toggle cycle**
   Do instead: use direct language selector for FR testing until FAZ 6 fixes `LanguageContext` toggle order.
2. **[2026-04-24] SoS label is unresolved terminology**
   Do instead: keep current SoS behavior unchanged until business meaning is confirmed.

## User Directives
1. **[2026-04-24] Preserve existing dirty worktree changes**
   Do instead: implement targeted edits only and never revert unrelated modifications.

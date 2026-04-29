# QA & Cursor Verification Protocol

Lessons captured from Sprint 1A.1 + 1A.2 cycle (2026-04-28). Apply on every Cursor sprint going forward.

## Rule 1 — Cursor "FIXED" claims need manual QA verification

Multiple instances of false-positive reports observed:
- Sprint 1A.1: Cursor audit said "Item 2 FIXED" → Walk-in modal still didn't open in QA Round 5
- Sprint 1A.2: Cursor audit said "Bug 1 FIXED" → RE Promote path still skipped modal in QA Round 7

Build PASS + unit test PASS does NOT prove a feature works. Always run a QA Round (manual reproduction in browser) before committing Cursor's work. Treat "FIXED" as a hypothesis, not a fact.

## Rule 2 — Post-sprint bug? Run `git stash` baseline check before blaming

When QA finds a bug after a Cursor sprint, do not assume it's a regression. Verify:

1. `git stash` (preserves uncommitted Cursor work)
2. Reload dev server, reproduce the bug scenario
3. If bug is still present → pre-existing, NOT a regression introduced by this sprint
4. If bug disappears → genuine regression, scope to immediate hotfix
5. `git stash pop` (restore Cursor work)

Pre-existing bugs go to the NEXT sprint scope (e.g., 1B), not the current hotfix (e.g., 1A.3). This avoids artificially expanding hotfix scope and protects the team from blaming Cursor for inherited problems.

Real example: Sprint 1A.2 QA Round 7 found persona/region pool inconsistency (Gulf personas appearing in Mexico RE). `git stash` baseline check confirmed it existed in `36a434ab` (Sprint 1A baseline) — NOT introduced by 1A.2. Correctly deferred to Sprint 1B1.

## Rule 3 — Demo wow-features need actual-scenario QA

Demo-critical features must be QA'd in their real-world scenario. Build PASS, dev server launching, type checks passing — none of these prove the feature works.

Required scenario QA:
- **Cross-tab realtime:** Open two tabs, click CTA in tab 2, verify toast appears in tab 1 within 5s with correct sender + action label
- **Sector-aware demo content:** Switch sectors, wait for next auto-fire interval (25s+), verify event labels and personas match active sector
- **Modal interactions:** Click trigger, verify modal opens, verify both confirm and cancel paths execute correctly
- **Auto-fire timers:** Wait the actual interval, verify content matches active state (sector + region + language)

Real example: NotificationSystem cross-tab realtime was "shipped" in Sprint 1A because code compiled and was wired up — but no one opened two tabs to verify. Bug went undetected until Sprint 1A.1 QA Round 5. Demo's primary wow-factor was silently broken for ~1 week.

This protocol prevents that pattern.

## Rule 4 — Definition of Done for AI agents (CC, Cursor, Claude.ai)

A task is NOT done until verified-on-origin. Before reporting "done":

1. Run `git status` — must show "nothing to commit, working tree clean" or all intended changes staged
2. Run `git log --oneline -1` — confirm the commit you intended is HEAD
3. Run `git push origin main` (or current branch) — confirm "Writing objects" + remote ref update
4. Run `git status` again — must show "Your branch is up to date with 'origin/main'"

Only then report "done, commit X pushed to origin/main."

Never say "I committed" without push. Never say "I pushed" without `git status` confirmation. The user has been burned by AI agents reporting "done" when work was only local — most recently Sprint 1A.1+1A.2 protocol writeup (CC committed but did not push, caught by manual `git status` check on 2026-04-28).

This rule applies symmetrically with Rule 1: just as Cursor "FIXED" needs human QA, AI "DONE" needs git origin verification.
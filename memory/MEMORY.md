# DynamicNFC — Memory Index

What stays true. `CLAUDE_HANDOFF.md` holds what just happened (snapshot, ≤150 lines); this folder holds decisions and lessons that outlive a session. Closed HANDOFF history lives in `docs/handoff-archive/`.

**Progressive disclosure:** every file below starts with front matter (`name`, `description`, `read-when`). Read the index first; open a file only when its `read-when` matches the task.

**Writing rule:** one fact per line, dated when it was decided. A lesson is filed once it has bitten twice or cost a deploy. Session noise stays in HANDOFF, not here.

## Index

| File | Read when |
|------|-----------|
| `project_decisions_2026_10.md` | writing public copy, legal lines, region/language lists, team or about sections, or answering "why do we say X" |
| `feedback_mutual_audit.md` | writing or reading any audit directive or report, or signing off work |
| `feedback_deploy_rule.md` | anything that deploys or merges to `main` |

## Consolidation ("dreaming")

Monthly, or when HANDOFF `Last 5 changes` carries the same lesson twice: promote the line into the matching `feedback_*.md` or into `CLAUDE.md` if it is a hard rule; then drop it from HANDOFF. Next consolidation candidate: CLAUDE.md §3/§12 region list vs the 2026-10-11 visible-regions decision.

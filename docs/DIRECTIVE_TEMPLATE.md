# Directive template (Claude → Cursor)

File name: `docs/directives/CURSOR_DIRECTIVE_<TOPIC>.md` (work) or `CURSOR_AUDIT_<TOPIC>.md` (read-only audit).

```
# CURSOR DIRECTIVE — <topic>

**Branch:** <name>          **Type:** implementation | audit (read-only)
**Read first:** CLAUDE.md, top entry of CLAUDE_HANDOFF.md

## 1. Goal            one paragraph: what must be true when this is done, and why
## 2. Scope           exact files to touch · files that must NOT be touched
## 3. Steps           numbered, each small enough to verify
## 4. Verify          commands (PowerShell) + what the output must show
## 5. Do not          no deploy · no unrelated refactors · no new dependencies · keep it minimal
## 6. Report back     what to paste to Oguzhan (use docs/AUDIT_REPORT_TEMPLATE.md for audits)
```

Rules:
- Commands must work in PowerShell.
- Cursor never deploys. Hosting deploys are `npm run deploy`, run by Oguzhan.
- Implementation directives end with build + test output. "FIXED" without output is a hypothesis.

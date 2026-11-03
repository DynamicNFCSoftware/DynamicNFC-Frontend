---
name: feedback_mutual_audit
description: Claude and Cursor audit each other; audit scope rules (every language, every breakpoint)
read-when: writing or reading any audit directive or report, or signing off work
---

# Standing rule — Claude and Cursor audit each other (Oguzhan, 2026-10-07)

- Every project has both Claude and Cursor. **Cursor does the bulk implementation** (multi-file edits, boilerplate, mechanical changes). Claude does architecture, directives, content, and audits.
- **Whoever did not write the work audits it.** Cursor's work → Claude audits. Claude's work → Cursor audits, read-only, from a directive.
- An audit is read-only: no fixes, no commits, no deploys. Findings go back to the author.
- Reports use `docs/AUDIT_REPORT_TEMPLATE.md`. A check that was not run is written **NOT RUN**, never PASS. Every FAIL carries a file path plus a line or key.
- Nothing is committed before the audit report is back and its blockers are closed.
- Why: on 2026-10-06 Cursor's audit of Claude's 5-language work found two real blockers (untranslated Home strings, clipped Login language select) that Claude's own checks had missed.
- **Audit scope (2026-10-27):** responsive and overflow checks run in every public language (EN/IT/FR/ES) at 375/768/1024/1100/1440 — Cursor reported PASS on an EN-only check and the About Navbar overflowed 901–1120 px in it/fr/es. An unchecked language is NOT RUN, never PASS.

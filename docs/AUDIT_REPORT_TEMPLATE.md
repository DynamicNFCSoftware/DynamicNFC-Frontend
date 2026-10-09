# Audit report template

Used by whoever audits (Cursor auditing Claude's work, or Claude auditing Cursor's). The audit is read-only.

```
# AUDIT REPORT — <branch> — <date>
## Summary: <n> PASS / <n> FAIL / <n> NOT RUN
## A. Build & static      A1 … : PASS|FAIL — evidence
## B. <domain checks>     B1 … : PASS|FAIL — evidence (file · line or key)
## C. Behaviour           C1 … : PASS|FAIL — route · language · width · what you saw
## D. Rules (CLAUDE.md)   D1 … : PASS|FAIL — evidence
## E. Content red flags   list
## Blockers before commit (must fix)
## Should fix (not blocking)
## Could not verify (and why)
```

Rules:
- Every FAIL needs a file path plus a line number or key. "Looks fine" is not evidence.
- A check that was not run is **NOT RUN** — never PASS.
- Say whether a problem is new in this work or was already there.
- Do not fix, refactor, reformat, commit, push or deploy.

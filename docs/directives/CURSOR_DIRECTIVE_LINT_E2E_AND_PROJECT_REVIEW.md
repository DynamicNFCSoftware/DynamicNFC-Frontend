# CURSOR DIRECTIVE — Finish lint, run browser tests, review three projects, update your own rules

**Branch:** `feat/canada-anchor-5lang` (uncommitted working tree)   **Type:** mixed — each part says whether it is implementation or read-only
**Read first:** `CLAUDE.md`, top entries of `CLAUDE_HANDOFF.md`, `memory/MEMORY.md` and the three files it lists, `docs/AUDIT_REPORT_TEMPLATE.md`
**Author:** Claude (Cowork), 2026-10-07, on Oguzhan's instruction

**Order:** if `docs/directives/CURSOR_DIRECTIVE_LINE_ENDINGS_AND_SETUP_AUDIT.md` has not been executed yet, execute it first and report it. Then do Parts A → E here, in order, and write one combined report at the end.

**Never:** `firebase deploy`, `npm run deploy`, `git push`, `git commit`. Do not touch `backend/`, `Ex Files/`, `/admin/*` pages, `firebase.js`, `App.jsx` routing, `src/translations/*.json`.

Oguzhan's standing rule: Cursor does the bulk implementation; Claude and Cursor audit each other; an unrun check is NOT RUN, never PASS.

---

## Part A — IMPLEMENTATION: make `npm run lint` pass (errors = 0)

Claude already changed `frontend/eslint.config.js` (vendor folders ignored, `gtag` global, Node globals for tests/configs, React-Compiler advisory rules downgraded to warnings) and fixed the hooks-after-return bug in `WhatsAppButton.jsx`. That took lint from 232 errors to **93**. The rest is yours:

| Rule | Count | What to do |
|------|-------|-----------|
| `no-unused-vars` | 69 | Delete the unused import / variable / parameter. If removing a parameter would shift later parameters, prefix it with `_` instead and leave it. Never delete code that has a side effect (an import of a CSS file or a `registerTranslations` module is a side effect — keep it as a bare `import '…'`). |
| `no-empty` | 22 | Empty `catch {}` blocks: add a one-line comment saying why the error is ignored (e.g. `/* storage unavailable — fall back to default */`). Do not add logging. Do not change control flow. |
| `react-hooks/rules-of-hooks` | 2 | `frontend/src/pages/UnifiedDashboard/components/OutreachModal.jsx` lines ~47 and ~63: two `useEffect` calls sit after an early `return`. Move the early return below the hooks (same pattern Claude used in `WhatsAppButton.jsx`). Behaviour must not change. |

Rules for this part:
- Mechanical edits only. No refactors, no renames, no reformatting, no behaviour change. Do **not** fix the warnings.
- Do not add `eslint-disable` comments to make an error go away. If an error cannot be fixed safely, leave it and list it in the report.
- `/admin/*` pages are normally off-limits: there you may only delete unused imports/variables and comment empty catches. Nothing else.
- Preserve each file's line endings.

**Verify (PowerShell, in `frontend/`):**
```powershell
npm run lint      # must end with 0 errors (warnings are fine) — paste the last line
npm run build     # must pass
npm test          # must pass — paste the summary line
```

---

## Part B — IMPLEMENTATION + AUDIT: browser smoke tests

Claude wrote `frontend/playwright.config.js` and `frontend/e2e/smoke.e2e.js` but could **not run them**. Treat them as unverified.

1. Install the runner (this updates `package.json` and `package-lock.json` — that is expected):
   ```powershell
   cd frontend
   npm install -D @playwright/test
   npx playwright install chromium
   npm run build
   npm run e2e
   ```
2. For every failing test decide which it is:
   - **The test is wrong** (bad selector, wrong assumption, regex false positive): fix the test, keep what it is meant to catch, and say what you changed.
   - **The site is wrong** (a real overflow, raw key, English leftover, JS error): do **not** fix the site. Report it with route · language · width.
3. Audit the test file itself: does each assertion actually fail when the bug is present? Prove at least two (for example: temporarily re-add `transform: translateX(100%)` to `.nav-menu` in `Navbar.css` and confirm the overflow assertion fails; then restore the file — `git diff` on it must match what it was before your experiment).
4. Confirm `npm test` (vitest) does **not** pick up the e2e file.
5. Review `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` (read-only): YAML valid, steps in a sensible order, `deploy.yml` cannot run while the two repository variables are unset, no secret is printed. Check the action versions used and say if a newer major exists. Read `docs/CI_DEPLOY_SETUP.md` and flag any command that looks wrong. **Do not run any gcloud command.**

---

## Part C — REVIEW (read-only): scan the three project folders

Folders on this machine: `C:\Users\oguzh\DynamicNFC` (this repo), `C:\Users\oguzh\DynamicMED`, `C:\Users\oguzh\DynamicCRM`. They are **separate projects** (separate companies / Firebase projects). Read only; change nothing in MED or CRM in this part.

For each folder look at: role definition / instructions (`CLAUDE.md`, `PROJECT-INSTRUCTIONS.md`), Cursor rules, memory and handoff files, build / lint / test / deploy setup, CI, `.gitignore` / `.gitattributes` / `.env` handling, anything that makes building or shipping the web site risky.

Produce **two lists for the DynamicNFC folder**, each item with a one-line reason and the evidence (file path):

1. **I recommend adding / changing** — things missing or wrong in DynamicNFC that would make the work safer or faster.
2. **I recommend NOT adding** — things someone might suggest that should stay out, and why.

Then one short paragraph each for DynamicMED and DynamicCRM: what is missing there for Cursor to work the same way (rules, CI, tests). Do not copy sensitive business content (financials, immigration, customer data) from the CRM folder into the report — name the file, not its contents.

Be independent: do this **before** reading Part D.

---

## Part D — AUDIT (read-only): challenge Claude's "do not add" list

Claude gave Oguzhan this list for DynamicNFC on 2026-10-07. Oguzhan has already **overruled items 5, 9 and 11** (those are now Parts A and B and the deploy workflow). For every item say **AGREE / DISAGREE / AGREE WITH CONDITIONS**, with evidence from the repo, and flag anything Claude got factually wrong.

| # | Claude said: do NOT add | Claude's reason |
|---|--------------------------|-----------------|
| 1 | TypeScript | Project rule forbids it; hundreds of `.jsx` files; half-migrated repo is worse than either; Oguzhan reads and approves code himself; Italy launch in a month |
| 2 | Tailwind or a component library | Rule: custom CSS with per-page prefixes; mixing breaks consistency |
| 3 | Upgrade to React 19 / Vite 8 (as DynamicMED uses) | Risk before the Italy launch, no current benefit |
| 4 | Switch linter to `oxlint` (as DynamicMED uses) | Changing tools does not fix the errors |
| 5 | ~~Fix all lint errors now~~ | **Overruled — being done (Part A).** Was: belongs to FAZ 5 cleanup |
| 6 | Merge the three projects into one repo / shared code | Separate companies and Firebase projects; NFC is tied to an immigration (SUV) file; boundaries must stay clear |
| 7 | Bring CRM folder documents into the NFC repo | Sensitive, belongs to another business |
| 8 | Copy DynamicMED's medical rules | Irrelevant to NFC |
| 9 | ~~Auto-deploy from CI~~ | **Overruled — workflow written, off until set up.** Was: after two deploy accidents, publishing should stay manual |
| 10 | Pre-commit hooks (husky) | Friction on Windows; CI does the same job |
| 11 | ~~Full browser test suite~~ | **Overruled — smoke suite written (Part B).** Was: useful but large, after Italy |
| 12 | Clean up Docker / nginx / `backend/` | Unused but on the do-not-touch list; FAZ 5 |

Also audit Claude's own decisions that are now rules (see `memory/project_decisions_2026_10.md`): the React-Compiler lint rules being warnings instead of errors, and the "data stored in Canada" wording. Say if either is wrong.

---

## Part E — IMPLEMENTATION: update your own rules ("skills")

Oguzhan has asked for this explicitly, so for this directive you **may** edit `.cursor/rules/*.mdc` and `.cursorrules` in DynamicNFC.

1. Read all seven rule files and `.cursorrules`. Compare them against the current `CLAUDE.md`, `memory/`, and the code. List every statement that is now stale or contradicts them.
2. Update the rules so they are true today. At minimum they must say:
   - Mutual audit: Cursor implements; Claude audits Cursor; Cursor audits Claude from `docs/directives/CURSOR_AUDIT_*.md`; audits are read-only; report format `docs/AUDIT_REPORT_TEMPLATE.md`; NOT RUN is never PASS; nothing is committed until blockers are closed. (Starting text: `docs/CURSOR_RULE_ADDITIONS.md`.)
   - Deploy: Cursor never deploys. Manual route is `npm run deploy` by Oguzhan; automatic route is `deploy.yml` from `main`.
   - Languages: five on the public site (en, it, fr, es, ar); page `TR` + sibling `*Translations.js`; parity test in `npm test`; brand terms stay English; legal entity is exactly "NFC Software Systems Inc.".
   - Positioning: Canada home base, other markets are expansion; no invented metrics; no "compliant / certified" claims; "data stored in Canada" only.
   - Verification: every implementation ends with `npm run lint`, `npm run build`, `npm test`, and `npm run e2e` when a page or shared component changed.
   - Directives live in `docs/directives/`; decisions live in `memory/`.
3. Keep the rules short. Delete what is no longer true instead of adding a contradiction next to it. Keep the existing file structure (00 … 60).
4. **DynamicMED:** it has no `.cursor/rules/`. Do not create files there in this run. Instead put a proposed rule set for DynamicMED (file names + full text) in the report, based on its own `CLAUDE.md` — Oguzhan will decide.
5. **DynamicCRM:** no code yet. One paragraph in the report on what rules it should start with when code exists.

---

## Report back (one report, paste it to Oguzhan)

```
# CURSOR REPORT — lint, e2e, project review, rules — <date>
## A. Lint            errors before → after · warnings · files changed (count) · anything left unfixed and why · build + test summary lines
## B. Browser tests   install result · pass/fail table (test · result) · test fixes you made · REAL site problems found (route · language · width) · teeth check results · vitest isolation · CI/deploy workflow review
## C. Three-folder review
###   DynamicNFC — recommend adding (item · reason · evidence)
###   DynamicNFC — recommend NOT adding (item · reason)
###   DynamicMED — what is missing
###   DynamicCRM — what is missing
## D. Claude's "do not add" list   # · AGREE / DISAGREE / CONDITIONS · evidence · factual errors by Claude
## E. Rules           stale statements found (file · line · what was wrong) · what you changed · proposed DynamicMED rule set · DynamicCRM note
## Blockers before commit
## Could not verify (and why)
```

Every FAIL or DISAGREE needs a file path plus a line or key. If a check was not run, write NOT RUN.

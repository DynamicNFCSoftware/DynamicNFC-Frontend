# CURSOR DIRECTIVE — Line-ending rule + audit of the project-setup changes

**Branch:** `feat/canada-anchor-5lang` (uncommitted working tree)   **Type:** Part 1 = audit (read-only) · Part 2 = implementation
**Read first:** `CLAUDE.md` (§2 mutual audit, §10 i18n, §16 deploy), top entry of `CLAUDE_HANDOFF.md`, `memory/MEMORY.md`
**Author of the work under audit:** Claude (Cowork), 2026-10-07

Do Part 1 first and write its report. Only then do Part 2. Never deploy. Never run `firebase deploy` or `npm run deploy`.

---

## Part 1 — AUDIT (read-only: do not fix anything in this part)

Claude added project-setup files on 2026-10-07. Check each and report PASS / FAIL with evidence, using `docs/AUDIT_REPORT_TEMPLATE.md`.

| # | File(s) | What to check |
|---|---------|---------------|
| S1 | `scripts/predeploy-check.mjs`, root `package.json` | From the repo root, `node scripts/predeploy-check.mjs` exits 0 after a build. Temporarily rename `frontend/dist` → it must exit 1 with a clear message; rename it back. The `deploy` script runs build → check → `firebase deploy --only hosting --project dynamicnfc-prod-68b4e` in that order. Works in PowerShell. **Do not run `npm run deploy`.** |
| S2 | `frontend/src/i18n/__tests__/translationParity.test.js` | `npm test` passes. Prove the test has teeth: temporarily delete one key from `it` in any `*Translations.js`, confirm the test fails and names the file, then restore the key (`git diff` on that file must be empty afterwards). Report any `*Translations.js` export the test silently skips. |
| S3 | `.gitignore` | No NUL bytes left (`Select-String -Path .gitignore -Pattern "\x00"` returns nothing). `git check-ignore -v design-previews/x debug/x .claude/settings.local.json shareholders/x` matches all four. Report anything that should be ignored but is tracked, and whether `frontend/package-lock.json` is tracked (CI needs it; the root `.gitignore` has a bare `package-lock.json` line). |
| S4 | `.claude/settings.local.json` | Contains no allow-rule for any deploy command. |
| S5 | `frontend/.env.example` | Lists every `import.meta.env.VITE_*` name used under `frontend/src` (grep and compare). Contains no real secret. |
| S6 | `CLAUDE.md` | §2 mutual-audit paragraph, §5 i18n line, §10 "i18n — 5 Languages", §14 item 5, §16 deploy block. Each must match the actual code (`LanguageContext.jsx`, `Navbar.jsx`, `Home.jsx` pattern, root `package.json`). Quote any sentence that is wrong or contradicts another section (for example a remaining "4 languages" or "4 regions … equal" statement elsewhere in the file). |
| S7 | `memory/*.md`, `docs/AUDIT_REPORT_TEMPLATE.md`, `docs/DIRECTIVE_TEMPLATE.md`, `docs/CURSOR_RULE_ADDITIONS.md`, `.claude/napkin.md` | Statements are consistent with each other and with `CLAUDE.md`. Flag any claim about the code that is not true. |
| S8 | `frontend/src/components/Navbar/Navbar.css` (mobile menu) | At 375px on `/`, `/enterprise`, `/pricing`: `document.documentElement.scrollWidth` equals `clientWidth` (was 750 vs 375). Hamburger opens and closes the menu, links are clickable, Arabic (RTL) works, `prefers-reduced-motion` is not violated. Compare with `main` (`git stash` → check → `git stash pop`) and say whether the overflow existed before this branch. |
| S9 | Re-check of the two blockers from the 2026-10-06 audit | `/` in it/fr/es no longer shows "This is what your sales team sees." or "by"; `/login` language select shows the full language name. |

Report Part 1 before starting Part 2.

---

## Part 2 — IMPLEMENTATION: one line-ending rule for the repo

**Goal:** `git status` currently lists hundreds of files as modified only because of CRLF/LF differences, which hides real changes. Add a rule so the repository stores LF and stops reporting those files.

**Scope:** create `.gitattributes` at the repo root. Touch nothing else by hand.

**Steps**

1. Record the baseline:
   ```powershell
   git status --short | Measure-Object -Line
   git diff --ignore-cr-at-eol --stat | Select-Object -Last 1
   ```
2. Create `.gitattributes` (repo root) with exactly:
   ```
   * text=auto eol=lf
   *.png binary
   *.jpg binary
   *.jpeg binary
   *.gif binary
   *.webp binary
   *.ico binary
   *.pdf binary
   *.woff binary
   *.woff2 binary
   *.ttf binary
   *.zip binary
   *.gz binary
   *.jar binary
   ```
3. Do **not** run `git add --renormalize .` and do **not** commit. Only report what changes:
   ```powershell
   git status --short | Measure-Object -Line
   git diff --ignore-cr-at-eol --stat | Select-Object -Last 1
   ```
4. If the number of "modified" files did not drop to roughly the real change set of this branch, stop and report why (for example `core.autocrlf`, files under `Ex Files/` or `backend/`). Do not try other fixes.

**Do not:** renormalize, reformat, commit, push, deploy, or edit `.cursor/rules/`, `backend/`, `Ex Files/`.

**Report back:** before/after counts from steps 1 and 3, the list of files that are still modified for a real (non-line-ending) reason, and a recommendation on whether a one-time `git add --renormalize .` commit is safe.

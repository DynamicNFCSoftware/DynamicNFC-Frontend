# Text for Oguzhan to paste into `.cursor/rules/50-workflow-and-qa.mdc`

(Claude does not edit `.cursor/rules/` — Oguzhan maintains those files.)

```
## Mutual audit (2026-10-07)
- Cursor does the bulk implementation. Claude writes directives and audits Cursor's output.
- When Claude wrote the code, Cursor audits it from a `docs/directives/CURSOR_AUDIT_*.md` file. Audits are READ-ONLY: no fixes, no commits, no deploys.
- Audit reports follow `docs/AUDIT_REPORT_TEMPLATE.md`. An unrun check is NOT RUN, never PASS. Every FAIL needs a file path plus a line or key.
- Nothing is committed until the audit report is back and its blockers are closed.

## Deploy (2026-10-06)
- Cursor never runs any deploy command. Hosting: Oguzhan runs `npm run deploy` from the repo root (or `deploy.yml` deploys from `main` once enabled). Functions / Firestore rules / indexes: Oguzhan runs the `firebase deploy --only … --project dynamicnfc-prod-68b4e` commands in `CLAUDE.md` §16.

## Languages (2026-10-06)
- Public site has five languages: en, it, fr, es, ar. Any new user-facing string needs all five.
- Page text lives in the page's `TR` object plus a sibling `*Translations.js` (it/fr/es). `npm test` checks key parity.
- Legal entity is exactly "NFC Software Systems Inc."; "DynamicNFC" is the product brand.
```

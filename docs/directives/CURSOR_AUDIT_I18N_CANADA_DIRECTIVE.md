# CURSOR DIRECTIVE — Audit of the 5-language + Canada-anchor work

**Branch:** `feat/canada-anchor-5lang` (uncommitted working tree)
**Author of the work under audit:** Claude (Cowork), 2026-10-06
**Your role:** independent auditor. **READ-ONLY. Do not fix, refactor, reformat, commit, push or deploy anything.**
If you find a problem, report it — Oguzhan will paste your report back to Claude for the fixes.

Read `CLAUDE.md` and the top entry of `CLAUDE_HANDOFF.md` ("IN FLIGHT 2026-10-06") first.

---

## 1. What was changed (scope to audit)

1. **Language infrastructure** — `frontend/src/i18n/LanguageContext.jsx` (adds `it`; order `en, it, fr, es, ar`), `frontend/src/i18n/index.js` (per-key English fallback), `frontend/src/i18n/common.js` (it/fr/es added).
2. **Navbar** — two EN/ع buttons replaced by a five-language `<select>` (`Navbar.jsx`, `Navbar.css`).
3. **Home** — `pages/Home/homeTranslations.js` (new), "Made in Canada" section (`CanadaSection`, `.hp-canada-*` in `Home.css`), footer line.
4. **Public pages, popups and gateways** — it/fr/es added via sibling `*Translations.js` files merged with `Object.assign(TR, …_TR_EXTRA)`; hardcoded `lang === 'ar' ? … : …` text ternaries converted to keys. Files: Enterprise, Developers, RealEstate, Automotive, NFCCards, ContactSales, Login, CreatePhysicalCard, OrderCardPage (`i18n.js`, `index.jsx`), Legal (Privacy, Terms), NotFound, Breadcrumb, IndustriesDropdown, BuyerROICalculator, ROICalculator, CRMGateway, AutoGateway, WhatsAppButton, WhatsAppPreview, Onboarding, CookieConsent, PushNotification, EmailCapture, Pricing, NFCWriteGuide, Blog, BlogPost.
5. **Legal / claims text** — Privacy policy gained 7 GDPR sections (8–14) in 5 languages; Terms names the operating entity; cookie banner text + link to `/privacy`; Login trust line and CreatePhysicalCard "Secure & Private" line reworded; "in half" removed from two FAQ answers.
6. **Company name** — "DynamicNFC Card Inc." → "NFC Software Systems Inc." everywhere under `frontend/src`.
7. **Repo root** — new `package.json` with a single `deploy` script; `CLAUDE.md` §1/§3/§12 edits; `CLAUDE_HANDOFF.md` entry.

Get the exact file list with:

```powershell
git status --short -- frontend/src package.json CLAUDE.md CLAUDE_HANDOFF.md
git diff --stat -- frontend/src
```

(Ignore the unrelated line-ending noise under `Ex Files/`, `backend/`, `.cursor/`.)

---

## 2. Checks to run (report PASS / FAIL + evidence for each)

### A. Build and static checks

```powershell
cd frontend
npm run build
npm run lint
npm run test
```

- A1. Build passes. List any NEW warnings (the two `ysh-` CSS truncation warnings existed before this work — report them separately as pre-existing).
- A2. Lint: list only errors/warnings in the files from section 1.
- A3. Tests pass (note any test that referenced the old two-button language toggle or old strings).
- A4. `Select-String -Path frontend\src -Pattern "console\.log" -Recurse -Include *.js,*.jsx` — no new `console.log` in the changed files.
- A5. `Select-String -Path frontend\src -Pattern "DynamicNFC Card Inc" -Recurse` — must return nothing.

### B. Translation integrity (write a throwaway node script outside `src/`, delete it afterwards)

- B1. For every translation object touched (inline `TR` / `T` / `TRANSLATIONS` / `ROUTE_LABELS` / `STEPS` and every `*Translations.js`): `it`, `fr`, `es`, `ar` have exactly the same keys as `en`, same value types, same array lengths. Report any missing / extra key per file per language.
- B2. Every `t('key')` / `t.key` used in the JSX of the changed files exists in `en`. Report raw keys that would render on screen.
- B3. No remaining `lang === 'ar' ? 'text' : 'text'` or `isAr ? 'text' : 'text'` that selects TEXT in the changed files (direction / layout ternaries are fine).
- B4. Existing Arabic strings were not altered except where listed in section 1 item 5 and the company-name replacement. Check with `git diff` on the `ar:` blocks.
- B5. Line endings: no file switched between CRLF and LF, and no file has mixed endings (`git diff --stat` should not show whole-file rewrites for the listed files).

### C. Behaviour (manual, `npm run dev`, two browser widths: 375px and 1440px)

For each of the five languages (use the Navbar dropdown):

- C1. `/` — all sections translated, "Made in Canada" section renders as 3 cards (1 column at 375px), no overflow, Arabic is RTL.
- C2. `/enterprise`, `/developers`, `/real-estate`, `/automotive`, `/nfc-cards`, `/contact-sales`, `/pricing`, `/login`, `/order-card`, `/privacy`, `/terms`, a 404 URL — no English left in it/fr/es except brand terms, no raw key names, no layout break from longer strings (buttons, nav, cards, tables).
- C3. Navbar dropdown: changes language, persists after reload (`localStorage dnfc_lang`), keyboard accessible, readable in the dark variant of the navbar if one exists.
- C4. Login page and Buyer ROI calculator: their language `<select>` works and is visually acceptable (it reuses button classes — report how it looks).
- C5. Structural changes — verify nothing regressed in English: `/pricing` (plans, features, badge, CTA links), NFC Write Guide (steps, FAQ, "recommended" tag on NTAG215), `/sales/roi-calculator` (all KPIs and funnel numbers identical to `main` for the same slider values, both industries), `/order-card` (language now follows the global setting).
- C6. Forms still submit: Contact Sales, Enterprise pilot form, Automotive pilot form, Developers pilot form (dev mode — just confirm the request payload is built and no exception is thrown). Note that select option values are sent in the visitor's language.
- C7. Popups still appear and work: cookie banner (Accept / Decline, link to `/privacy`, analytics consent only granted on Accept), email capture, push notification, WhatsApp button (pre-filled message in the active language), onboarding.
- C8. Demo regression with language set to `it`: open `/enterprise/crmdemo`, `/enterprise/crmdemo/khalid`, `/automotive/demo`, `/yacht/demo`, `/unified` (logged in). These do not have Italian yet — confirm they fall back to a supported language and **do not crash or show raw keys**. Report exactly what each shows.
- C9. Tracking untouched: on one demo portal, confirm `trackEvent` → `bridgeEventToFirestore` still fires (network tab) after a language switch.

### D. Rule compliance (`CLAUDE.md`)

- D1. No edits under `/admin/*` pages, `backend/`, `firebase.js`, `src/translations/*.json`, `.cursorrules`, `.cursor/rules/`.
- D2. `App.jsx` routing unchanged.
- D3. New CSS uses the page prefix and logical properties (`.hp-canada-*`, `.nav-lang-select`) — no `left/right/margin-left`.
- D4. No hardcoded user-facing strings were introduced in the changed files.
- D5. Code Simplicity Mandate: flag anything that is more complex than needed (e.g. duplicated helpers across the new translation files, a fallback that cannot trigger). Suggest, do not change.
- D6. Brand terms kept in English in it/fr/es (VIP Access Key, Sales Velocity Engine, Premium Box); legal entity is exactly `NFC Software Systems Inc.`.

### E. Content red flags (list, do not edit)

- E1. Any statement in the changed files that claims compliance, certification, data location, or a measured result. Quote the English string and its file/key. Known ones to re-confirm: Privacy sections 3, 7–14; Login `trustLine`; CreatePhysicalCard `securePrivateDesc`; Home `ca2d`, `ca3d`; cookie banner `text`; ROI calculator model figures (68 %, 47 %, 3.2×, 52 %, $45).
- E2. Any translation that is clearly wrong, machine-literal, or inconsistent between pages for the same term (give 5–10 worst examples per language at most).
- E3. Pre-existing bugs noticed on the way (known: Enterprise → Yacht tab shows raw keys `prob2Desc_yacht`, `prob3Desc_yacht`; truncated `ysh-` stylesheet).

---

## 3. Report format (paste this back to Oguzhan)

```
# AUDIT REPORT — feat/canada-anchor-5lang — <date>
## Summary: <n> PASS / <n> FAIL / <n> NOT RUN
## A. Build & static      A1 … A5: PASS|FAIL — evidence
## B. Translations        B1 … B5: PASS|FAIL — evidence (file · language · key)
## C. Behaviour           C1 … C9: PASS|FAIL — route · language · width · what you saw
## D. Rules               D1 … D6: PASS|FAIL — evidence
## E. Content red flags   E1 … E3: list
## Blockers before commit (must fix)
## Should fix (not blocking)
## Could not verify (and why)
```

Rules for the report: every FAIL needs a file path and a line or key; "looks fine" is not evidence; if a check was not run, say **NOT RUN** — do not mark it PASS.

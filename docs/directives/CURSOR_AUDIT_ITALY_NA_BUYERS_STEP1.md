# CURSOR DIRECTIVE — Audit: Italy → North American buyers, step 1

**Branch:** `main` (already merged via PR #26, merge `8a348b3a`, 2026-10-12 — audit is post-merge)   **Type:** read-only audit
**Note:** the same PR also carried the Five-Minute Proof video and the Home colour / Italian-touch changes; audit only the 12 files below, but report anything they broke.
**Author of the work under audit:** Claude (Cowork), 2026-10-11
**Your role:** independent auditor. **READ-ONLY. Do not fix, refactor, reformat, commit, push or deploy.**
Report with `docs/AUDIT_REPORT_TEMPLATE.md`. A check you did not run is NOT RUN, never PASS.
Read `CLAUDE.md` and the entries of `CLAUDE_HANDOFF.md` dated 2026-10-12 and 2026-10-11 first.

## Decision behind the work (Oguzhan, 2026-10-11)
Visible regions are now **Canada, Italy, USA**. Mexico and Gulf are **hidden, not deleted** (data, personas, seed and
Arabic translations stay in the code). Main pitch: Italian real-estate developers selling Italian homes to
**North American (US / Canadian) buyers**; DynamicNFC's Canadian company runs the North American side.
US and Canadian realtors keep their domestic story (US buyer / US home, Canadian buyer / Canadian home).

## What changed (12 files)
1. `config/regionConfig.js` — `REGION_LIST` = Canada, Italy, USA; new `LANG_REGION` (it→italy, fr→canada) and
   `detectRegion()` (browser locale: it → italy, en-US / es → usa, else canada); Italy real-estate personas are now
   North American buyers (Andrew Harrington, Catherine Brooks, Daniel Whitaker, Émilie Laurent, `@example.com`).
2. `hooks/useRegion.jsx` — saved region used only if still in `REGION_LIST`, else `detectRegion()`; the active region is
   always written to `ud-region` (tracking reads it directly: `utils/portalTracking.js`, `services/tenantService.js`).
3. `i18n/LanguageContext.jsx` — `ar` removed from `SUPPORTED_LANGS`. `components/Navbar/Navbar.jsx` — Arabic out of the
   menu; choosing a language in `LANG_REGION` also switches region. `pages/Login/Login.jsx` — Arabic option removed.
4. `services/tenantService.js` — `SEED_VERSION` `2.3-italy` → `2.4-na-buyers` (merge seed, names update).
5. `pages/Home/Home.jsx` + `homeTranslations.js` — `{name}` placeholder (filled from the active region's real-estate
   vip1) in `cardCta`, `aiCard2d`, `aiCard4d`; `aiCard1ex` and `trust3` rewritten; `CanadaSection` became
   `MarketSection(prefix)`; new `na*` keys (en/it/fr/es) rendered only when region = italy.
6. Tests: `config/__tests__/regionConfig.test.js` (Italy vip1 name/email), `e2e/smoke.e2e.js` (Arabic run removed).

## Checks
**A. Build & static** — `npm run lint`, `npm run build`, `npm test`, `npm run e2e` (frontend). Report counts.
**B. Code**
- B1 No `ar` option left in any public-site language menu (Navbar, Login, popups). Demo-portal language cycles of
  hidden regions are out of scope.
- B2 Every `REGION_LIST` consumer (CRMGateway, AutoGateway, YachtGateway, UnifiedLayout) shows exactly 3 regions.
- B3 Nothing else assumes `REGION_LIST` has 5 entries or that `ar` is a supported language (grep; list file · line).
- B4 Seed: user-created deal survives the bump (CLAUDE.md §8 protocol) — or NOT RUN with reason.
- B5 Code Simplicity Mandate: anything that could be shorter.
**C. Behaviour** (`npm run preview`, fresh browser profile each time)
- C1 Browser locale en-US → James Mitchell; en-CA → Marc Patel; it-IT → Andrew Harrington + "Acquirenti nordamericani"
  section above "Made in Canada"; the section is absent for Canada and USA.
- C2 localStorage `ud-region=gulf` + `dnfc_lang=ar` → page in English, region not gulf, `ud-region` overwritten.
- C3 Canada visitor picks Italiano → region italy, name Andrew Harrington; the CTA portal shows Andrew Harrington.
- C4 Logged-in `/unified`: region menu has 3 entries; Italy RE shows the four new names after reload (seed bump).
- C5 375 / 768 / 1440 px, en/it/fr/es: no horizontal overflow on `/`.
**D. Rules** — no hardcoded user-facing strings; logical CSS only; no `console.log`; no fake metrics.
**E. Content red flags** — any remaining Gulf/Khalid/Arabic text on `/` (other pages are a known later step).

## Already verified by Claude (re-check, don't trust)
lint 0 errors / 95 warnings · build OK · `npm test` 146 passed · e2e 10/10 · C1, C2, C3 and C5 (375 + 1440, Italian) in Chromium.
NOT verified by Claude: C4 (logged in), B4 (seed survival), 768 px, Safari.

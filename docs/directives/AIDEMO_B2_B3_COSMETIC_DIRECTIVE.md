# Directive: AIDemo Cosmetic Fixes B2+B3 (QA 2026-07-20)

**Scope:** 5 files, all small string/data edits. No routes, no tracking, no i18n keys added/removed, Yacht untouched (already clean).

**B2 — duplicate model name:** Auto demo renders "Tesla Model S Plaid TESLA MODEL S PLAID" / "Mercedes-AMG G 63 G63". Root cause: `autoAiDemoData.js` L42 derives `vehicleCode` from the vehicle id slug (`tesla-model-s-plaid` → `TESLA MODEL S PLAID`), which is the full name for every region except Gulf. RE is NOT affected (`UNIT_CODE` = real codes like `PH-4201`).

**B3 — "Bilingual EN/AR" in all regions:** hardcoded in canvaMeta copy (EN L43 + AR L124) and terminal Locale line (L213) in BOTH `AIDemo.jsx` and `AutoAIDemo.jsx`. Canada must read EN/FR, Mexico ES/EN, USA English.

## WP-1 — `frontend/src/services/aiDemoShared.js`

Add below `MARINA_TIME_ABBR`:

```js
/** Region-aware terminal Locale line (Canva step). */
export const LOCALE_LINE = {
  gulf: "Locale: Bilingual EN/AR — right-to-left layout support enabled",
  usa: "Locale: English (US)",
  mexico: "Locale: Bilingual ES/EN",
  canada: "Locale: Bilingual EN/FR",
};
```

## WP-2 — `frontend/src/pages/AutomotiveDemo/autoAiDemoData.js`

1. Add above `getAutoAiVip` (display stock-codes for terminal realism — flagship = first vehicle of each region list):

```js
/** Short display codes for region flagships (terminal/WA aesthetics). */
const FLAGSHIP_CODE = { gulf: "G63", usa: "ESCALADE-V", mexico: "RR-LWB", canada: "PLAID" };
```

2. L42 — replace the derivation:
   `const vehicleCode = FLAGSHIP_CODE[rid] || String(flagship?.id || "VIP").toUpperCase().replace(/-/g, " ");`

3. Add `regionId: rid,` to the returned object (L56 `return {`).

## WP-3 — `frontend/src/pages/AIDemo/aiDemoData.js`

Add `regionId: rid,` to the returned object (L62 `return {`). Nothing else — `UNIT_CODE` stays.

## WP-4 — `frontend/src/pages/AutomotiveDemo/AutoAIDemo.jsx`

1. **L43 (EN canvaMeta):** drop `{code}` AND the trailing locale sentence →
   `'Personalized spec dossier with {vehicle} details, performance analysis, exclusive VIP pricing ({price}), and premium configuration.'`
2. **L124 (AR canvaMeta):** same two removals →
   `'ملف مواصفات مخصص مع تفاصيل {vehicle}، تحليل الأداء، تسعير VIP حصري ({price})، وتكوين فاخر.'`
3. **L213 (terminal Locale line):** replace the hardcoded string with:
   `{ type: 'data', text: LOCALE_LINE[vip.regionId] || LOCALE_LINE.gulf },`
   (import `LOCALE_LINE` from `../../services/aiDemoShared`; the builder already receives `vip`.)
4. **L472 + L497:** `` `${vip.vehicleName} ${vip.vehicleCode}` `` → `` `${vip.vehicleName}` `` (calendar title + description — name alone, no code).
5. Keep `vehicleCode` in terminal lines L203/L211 as-is (now renders short codes: G63 / PLAID / ESCALADE-V / RR-LWB — intended).

## WP-5 — `frontend/src/pages/AIDemo/AIDemo.jsx`

1. **L43 (EN canvaMeta):** drop ONLY the trailing `' Bilingual EN/AR design.'` sentence. **KEEP `Unit {code}`** — PH codes are real.
2. **L124 (AR canvaMeta):** drop only `' تصميم ثنائي اللغة EN/AR.'`
3. **L213:** same `LOCALE_LINE[vip.regionId] || LOCALE_LINE.gulf` swap + import.

## Considered done ONLY when ALL pass (paste evidence + commit hash)

1. `grep -rn "EN/AR" frontend/src/pages/AIDemo frontend/src/pages/AutomotiveDemo` → **0 results**
2. `grep -n "{vehicle} {code}" frontend/src/pages/AutomotiveDemo/AutoAIDemo.jsx` → **0** ; `grep -c "Unit {code}" frontend/src/pages/AIDemo/AIDemo.jsx` → **unchanged (RE keeps codes)**
3. `grep -rn "LOCALE_LINE" frontend/src` → exactly 3 files (shared export + 2 imports/uses)
4. `grep -n "vehicleName} \${vip.vehicleCode}" frontend/src/pages/AutomotiveDemo/AutoAIDemo.jsx` → **0**
5. `cd frontend && npm run build` → PASS ; `npm test` → all pass
6. Large File Protocol on both AIDemo.jsx + AutoAIDemo.jsx (line count ±5 of pre-edit, tail closes cleanly)
7. **Commit hash in report.**

Commit message: `fix(aidemo): region-aware locale labels + drop duplicated vehicle code (B2+B3)`

## Out of scope (do NOT touch)
- `YachtAIDemo.jsx` (clean), `TIME_ABBR`/`CITY`/`MARINA_TIME_ABBR`, `UNIT_CODE`, vehicle data files, tracking calls, attachment filename slugs (long slugs in PDF names are fine).

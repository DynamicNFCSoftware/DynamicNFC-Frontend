# Directive: YachtAIDemo Marina Timezone Fix (B1 — QA 2026-07-20)

**Scope:** 2 files. Small, surgical. No route changes, no i18n keys, no new components.
**Bug:** `/yacht/demo/ai` shows "10:00 AM GST" in ALL regions. USA (San Diego Marina) must show PT, Canada (Coal Harbour Marina, Vancouver) PT, Mexico (Cabo Marina) MT. Gulf (Dubai Marina) stays GST. Root cause: 5 hardcoded `"GST"` strings in `YachtAIDemo.jsx`. The shared `TIME_ABBR` map in `aiDemoShared.js` is city-anchored (usa: "ET" for New York) and does NOT match yacht marinas — do not reuse it for yacht; add a marina-anchored map.

## WP-1 — `frontend/src/services/aiDemoShared.js`

Below the existing `TIME_ABBR` export, add:

```js
/** Marina clock abbreviations (yacht demo — marina anchors differ from CITY map:
    Dubai Marina / San Diego / Cabo / Coal Harbour Vancouver). */
export const MARINA_TIME_ABBR = {
  gulf: "GST",
  usa: "PT",
  mexico: "MT",
  canada: "PT",
};
```

Do NOT modify `TIME_ABBR` or `CITY` — RE and Auto demos consume them and are correct.

## WP-2 — `frontend/src/pages/YachtDemo/YachtAIDemo.jsx` (703L — Large File Protocol applies)

1. **Import** (line ~11, extend existing import from `../../services/aiDemoShared`):
   `import { getWhatsAppInvite, MARINA_TIME_ABBR } from "../../services/aiDemoShared";`

2. **Component scope** (after `regionId` is available, near line ~359 where `marina` is derived):
   `const timeAbbr = MARINA_TIME_ABBR[regionId] || "GST";`

3. **Thread `timeAbbr` through the two builders** (last param):
   - L234: `function buildRealResults(owner, vessel, marina, toEmail, vesselPriceFmt, timeAbbr)`
   - L268: `function buildTerminalLines(owner, vessel, marina, toEmail, budgetLabel, vesselPriceFmt, timeAbbr)`
   - Call sites L373 + L377: append `timeAbbr` arg AND add `timeAbbr` to both useMemo dep arrays.

4. **Replace all 5 hardcoded GST occurrences** with template literals:
   - L246: `time: \`10:00 AM – 12:00 PM ${timeAbbr}\`` (keep the en-dash)
   - L269: `timeLabel: \`10:00 AM ${timeAbbr}\``
   - L308: `text: \`Optimal slot: 10:00 AM ${timeAbbr} — based on tide and crew prep time\``
   - L381 (`waInvite` useMemo): `timeLabel: \`10:00 AM ${timeAbbr}\`` + add `timeAbbr` to its dep array
   - L507 (`buildYachtEmailHtml` call): `trialTime: \`10:00 AM ${timeAbbr}\``

## Considered done ONLY when ALL of these pass (evidence required in report)

1. `grep -n "AM GST" frontend/src/pages/YachtDemo/YachtAIDemo.jsx` → **0 results** (paste output)
2. `grep -rn "MARINA_TIME_ABBR" frontend/src` → exactly 2 files (shared export + yacht import)
3. `grep -n "AM GST\|AM PT\|AM ET" frontend/src/pages/AIDemo frontend/src/pages/AutomotiveDemo -r` → unchanged vs main (RE/Auto untouched)
4. `cd frontend && npm run build` → PASS
5. `npm test` → all pass (if YachtAIDemo has tests, they must still pass; do NOT skip)
6. Large File Protocol on YachtAIDemo.jsx: line count ~703±10 + tail check
7. **Commit hash in the report** — "fixed" without a hash is not done (QA Verification Protocol)

Commit message: `fix(yacht-aidemo): marina-anchored timezone labels (GST hardcode → MARINA_TIME_ABBR)`

## Out of scope (do NOT touch)
- B2 (duplicate model name in dossier copy) and B3 (Canada "EN/AR" locale label) — separate directive later.
- `TIME_ABBR`, `CITY`, RE/Auto AIDemo files, tracking calls, i18n dictionaries.

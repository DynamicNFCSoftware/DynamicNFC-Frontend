# CURSOR DIRECTIVE — Five-Minute Proof video: audit fixes (2026-10-11)

**Branch:** `feat/fmp-video` (same branch, on top of the integration work)      **Type:** small fixes
Claude audited the integration (code + the 16 screenshots). Structure is approved: clip map, play-once + hold,
RTL mirror of media only, logical-property overlays, reduced-motion poster, SVG fallback. Fix the items below only.

## Fixes
1. **Fonts (visible bug).** Overlays render in the browser's default serif (no `font-family` on `.fmp-ov`).
   Add to `.fmp-ov`: `font-family: "Outfit", sans-serif;` and to `.fmp-ov-name`: `font-family: "Playfair Display", serif;`.
   Arabic: `[dir="rtl"] .fmp-ov { font-family: "Noto Kufi Arabic", sans-serif; }`. Do not add new font imports if they
   already load globally — check first.
2. **Relative times read wrong.** Keys `secondsAgo` / `minutesAgo` show "14 s", "2 min" without "ago".
   Change the values in all 5 languages to real relative phrases:
   en `"{n}s ago"` / `"{n} min ago"` · it `"{n}s fa"` / `"{n} min fa"` · fr `"il y a {n} s"` / `"il y a {n} min"` ·
   es `"hace {n} s"` / `"hace {n} min"` · ar `"قبل {n} ث"` / `"قبل {n} د"`.
   Step 2 order: rows appear 1 → 3, so the LAST row is the newest. Use times `[2 min ago, 14s ago, now]` for rows 1–3.
3. **Step 1 "IDENTIFIED" pip** (was in the directive, missing): add a small line under the place:
   red dot (`#e63946`) + `t("identified")`, kicker style.
4. **Step 3:** remove the plain "Hot · Warm · Cold" line (no colour = no meaning). Keep the ranked list only.
5. **Step 5 order** — lead with what was booked:
   kicker = `t("booked.<stem>")` (e.g. PRIVATE VIEWING), bold line = date/time, small line = `t("yourRep")`.
   Date format: `{ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }`
   with `getEffectiveLocale(regionId, lang)` → e.g. "Mon, Oct 12, 14:00" / "lun 12 ott, 14:00". No ISO dates.
6. **Arabic `pipeline` key:** `"مسار الصفقات"` (currently the English word).
7. **`clips.js` is untracked** — `git add` it in the commit.

## Verify
`npm run lint; npm run build; npm test`. Re-take only these screenshots (final frame):
Canada × Real estate EN steps 1, 2, 5 · Italy × Yacht IT step 5 · Gulf × Automotive AR step 2.
Save to the same `fmp-shots` folder with suffix `-v2`.

## Do not
No other refactors, no deploy, no push to main, no new dependencies, no changes outside the FiveMinuteProof folder and
`i18n/portals/fiveMinuteProof.js`. Do not edit `regionConfig.js` (the Italy real-estate personas are a separate decision).

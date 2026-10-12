# CURSOR DIRECTIVE — Five-Minute Proof: video backgrounds + localized overlays (v2, 2026-10-11)

**Branch:** `feat/fmp-video` from latest `main`          **Type:** implementation
**Read first:** `docs/specs/FIVE_MINUTE_PROOF_ANIMATION_SPEC.md` (story, data per region × sector, in-picture text keys),
`CLAUDE.md`.

## Goal
Each tutorial step shows its Seedance clip (muted, **plays once, holds its last frame**) with an HTML overlay layer on
top that carries every word: persona name, role, city/country, signal rows, scores, "HOT LEAD", alert line, booking
label and date — all from translations (en/it/fr/es/ar) and from region × sector data. Nothing readable is in the video.

## Media — READY, do not re-encode
All 9 clips + 9 posters are final, already compressed (854×480, H.264, no audio, faststart, 8 s each), ~2.1 MB in total.
Folder: `frontend/src/components/UnifiedDashboard/FiveMinuteProof/media/`

| Step | Clip | Used for |
|---|---|---|
| 1 Identity | `step1-identity.mp4/.jpg` | all sectors |
| 2 Track | `step2-track-realestate` / `step2-track-auto` / `step2-track-yacht` | by sector |
| 3 Score | `step3-score.mp4/.jpg` | all sectors |
| 4 Alert | `step4-alert.mp4/.jpg` | all sectors |
| 5 Close | `step5-close-realestate` / `step5-close-auto` / `step5-close-yacht` | by sector |

The `.jpg` is the clip's last frame (= poster and reduced-motion image). Commit the `media/` folder in this branch.
Import through Vite (`import step1Mp4 from "./media/step1-identity.mp4"`). One small map object
`{ step, sector } → { mp4, jpg }` — not 9 separate branches. No new npm dependency.

## Steps
1. **`TutorialStep.jsx`** — receive `sector` (from `useSector()` in OverviewTab → FiveMinuteProof → TutorialStep).
   Pick the clip: steps 2 and 5 by sector (`realEstate → realestate`, `automotive → auto`, `yacht → yacht`), others shared.
   Persona: `getPersonas(sector, regionId)` (vip1), others in that sector for the Step 3 ranking — no "Sarah Chen", "Tom Lee".
   Item name: first seed card of that region × sector (or project name if simpler — say which you chose).
2. **Video element:** `<video src poster muted playsInline autoPlay preload="metadata" aria-hidden="true">` — **no `loop`**.
   `key={stepNumber}` so it restarts when the step is shown again. 16:9 box (the clips are 16:9), `object-fit: cover`.
   Under `prefers-reduced-motion: reduce` render the poster `<img>` only (overlays shown immediately, no animation).
   If the video errors, fall back to the existing SVG illustration for that step (keep the five SVG files).
3. **RTL:** the clips contain no text, so in RTL mirror the media with `transform: scaleX(-1)` on the video/poster only
   (not on the overlay). Then every overlay can use logical properties (`inset-inline-start/end`) and stays on the
   empty side of the picture in both directions. Do not use physical `left/right`.
4. **Overlays** (`fmp-ov-*` classes). Each overlay sits on a small dark glass panel
   (`background: rgb(10 14 24 / 0.55); backdrop-filter: blur(12px)`, white text) so it stays readable on the bright
   frames (5a, 5c). Positions follow the empty area of each clip's final frame:
   - **S1 — top, inline-start:** editorial name plate (persona caps, role, CITY · COUNTRY, "IDENTIFIED" pip in `--fmp-accent`).
   - **S2 — top, inline-end:** three pipeline rows appearing one after another, dot colours matching the beads:
     row 1 blue `#457b9d`, row 2 gold `#c5a467`, row 3 red `#e63946`, timed to the bead landings (~2.5 s, ~5 s, ~7 s).
     Sector signals from the spec, relative times.
   - **S3 — inline-start half** (the three columns stand in the inline-end half): ranked list of 3 personas with score
     pills; the persona's score counts up to 82 and moves to #1 (CSS only).
   - **S4 — inline-end half** (phone is in the inline-start half): alert card — "HOT LEAD", persona, sector alert line,
     item, "2 min ago".
   - **S5 — top centre strip** (keep it inside the top ~22 % of the box; the hand, key and red bead are in the lower
     half and must stay uncovered): booking pill — sector booking label + date/time formatted with
     `getEffectiveLocale(regionId, lang)` (tomorrow, 14:00 local).
   Entrances: S1, S3, S4, S5 fade in at ~5.5 s (when the clip's final frame holds); S2 per bead as above.
   Use `onTimeUpdate` or CSS `animation-delay` — whichever is fewer lines.
5. **Translations:** add the in-picture keys from the spec to `i18n/portals/fiveMinuteProof.js` in en/it/fr/es/ar.
   Remove the hard-coded English strings from the SVG fallbacks too (use the same keys).
6. Fix the Step 1 project label to follow the sector (not always the real-estate project).

## Verify — paste output + screenshots
`npm run lint; npm run build; npm test; npm run e2e`.
Manual screenshots of the **final frame** of steps 1–5 for: Canada × Real estate (EN), Italy × Yacht (IT),
Gulf × Automotive (AR, RTL — check the mirrored video and that no overlay covers the hand/key/bead).
Reduced motion on: posters only. Report the bundle size difference in KB.

## Do not
No deploy, no push to main, no new dependencies, no re-encoding of the media, no changes outside the FiveMinuteProof
folder, its i18n file, and the prop pass-through in OverviewTab. No `console.log`.

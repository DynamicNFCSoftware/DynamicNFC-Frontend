# CURSOR DIRECTIVE — Five-Minute Proof: video backgrounds + localized overlays

**Branch:** `feat/fmp-video` from latest `main`          **Type:** implementation
**Read first:** `docs/specs/FIVE_MINUTE_PROOF_ANIMATION_SPEC.md` (story, data per region × sector, in-picture text keys),
`docs/specs/FIVE_MINUTE_PROOF_SEEDANCE_PROMPTS.md` (clip list), `CLAUDE.md`.
**Start only when** the 9 MP4 + 9 JPG files exist in `frontend/src/components/UnifiedDashboard/FiveMinuteProof/media/`.

## Goal
Each tutorial step shows its Seedance clip (muted, looping) with an HTML overlay layer on top that carries every word:
persona name, role, city/country, signal rows, scores, "HOT LEAD", alert line, booking label and date — all from
translations (5 languages, Arabic RTL mirrors the overlay) and from region × sector data. Nothing readable is in the video.

## Steps
1. **Media.** If any MP4 > 2 MB, compress with ffmpeg to 720p H.264 (`-crf 28 -preset slow -an -movflags +faststart`).
   Import files through Vite (`import step1 from "./media/step1-identity.mp4"`) so they are hashed. No new npm dependency.
2. **`TutorialStep.jsx`** — receive `sector` (from `useSector()` in OverviewTab → FiveMinuteProof → TutorialStep).
   Pick the clip: steps 2 and 5 by sector (`realestate | auto | yacht`), others shared.
   Persona: `getPersonas(sector, regionId)` (vip1), others in that sector for the Step 3 ranking — no "Sarah Chen", "Tom Lee".
   Item name: first seed card of that region × sector (or project name if simpler — say which you chose).
3. **Video element:** `<video src poster muted loop playsInline autoPlay preload="metadata" aria-hidden="true">`
   inside a 2:1 box, `object-fit: cover`. Under `prefers-reduced-motion: reduce` render the poster `<img>` only.
   If the video fails to load, fall back to the existing SVG illustration for that step (keep the five SVG files).
4. **Overlays** (`fmp-ov-*` classes, positioned with logical properties so RTL mirrors):
   - S1 right third: editorial name plate (persona caps, role, CITY · COUNTRY, "IDENTIFIED" pip in `--fmp-accent`).
   - S2 right half: three pipeline rows appearing one after another (sector signals from the spec §5), relative times.
   - S3 centre: ranked list of 3 personas with score pills; persona's score counts up to 82 and moves to #1 (CSS only).
   - S4 right half: alert card — "HOT LEAD", persona, sector alert line, item, "2 min ago".
   - S5 upper centre: booking pill — sector booking label + date/time formatted with `getEffectiveLocale(regionId, lang)`
     (tomorrow, 14:00 local).
   Timings of overlay entrances should match the clip beats in the prompts doc (≈1–3 s).
5. **Translations:** add the in-picture keys from the spec §7 to `i18n/portals/fiveMinuteProof.js` in en/it/fr/es/ar.
   Remove the hard-coded English strings from the SVG fallbacks too (use the same keys).
6. Fix the Step 1 project label to follow the sector (not always the real-estate project).

## Verify — paste output + screenshots
`npm run lint; npm run build; npm test; npm run e2e`.
Manual: Italy × Yacht (IT), Gulf × Automotive (AR, RTL), Canada × Real estate (EN): screenshot steps 1 and 5 each.
Reduced motion on: posters only. Bundle size: report the added KB.

## Do not
No deploy, no push, no new dependencies, no changes outside the FiveMinuteProof folder, its i18n file, and the prop pass-through in OverviewTab.

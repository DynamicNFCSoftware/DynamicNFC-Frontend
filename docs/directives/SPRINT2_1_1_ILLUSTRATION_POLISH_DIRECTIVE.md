# Sprint 2 #1.1 — Five-Minute Proof Illustration Polish

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (claude.ai)
**Branch:** `cursor/sprint-2-1-1-illustration-polish`
**Predecessor:** Sprint 2 #1 (commit `c49906bc` on `main`) — functional tutorial shipping; this directive only redesigns the 5 SVG illustration files.

---

## 1. Goal

Redesign the 5 illustration files in `frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/` so each step delivers a **brand-rich, clarity-first visual** that a luxury real estate developer can interpret in under 3 seconds during a sales meeting.

Functional code (state, navigation, Firestore, i18n, layout) is already correct on `main`. **Do not touch any other file.** This sprint is purely the SVG content of the 5 illustration components.

---

## 2. Why this work exists

The first-pass illustrations shipped at 12–15 lines per file. They render but miss four critical bars:

1. **Brand DNA absent** — No DynamicNFC card identity (red "NFC" wordmark + blue NFC wave marks). The product is invisible in its own tutorial.
2. **Region accent unused** — `--fmp-accent` CSS variable is defined per region (gulf gold, USA navy, Mexico copper, Canada navy) but illustrations render almost entirely in muted gray + brand red. A user switching region inside the tutorial sees almost no visual change.
3. **Persona name invisible** — Body copy mentions "Marc Patel" / "Khalid Al-Rashid" / "Daniel Roberts" / "Carlos Mendez" but illustrations show anonymous silhouettes. Persona must be present in the visual, not only in the prose.
4. **Comparative / contextual content missing** — Score chip "82" alone is meaningless; user needs Hot/Warm/Cold ladder. Notification card has empty stripes; needs real microcopy. Step 5 promised a "Booked" badge that was never drawn.

---

## 3. Read first (mandatory before writing code)

1. Read `mnt/skills/user/dynamicnfc-web-builder/SKILL.md` for build patterns.
2. Read `frontend/src/components/UnifiedDashboard/FiveMinuteProof/FiveMinuteProof.css` end to end. Understand exactly which classes exist on `.fmp-svg__*` (e.g., `__muted`, `__frame`, `__line`, `__dash`, `__pulse`, `__accent`). You must reuse these classes or extend them — never invent new global classes.
3. Read each of the 5 current illustration files (`Step1Identity.jsx` … `Step5Close.jsx`) to confirm current viewBox (`0 0 480 240`), aria attributes, and prop signature `({ className = "" })`. Preserve all of those.
4. Inspect `frontend/src/components/UnifiedDashboard/FiveMinuteProof/FiveMinuteProof.css` for the `--fmp-accent` per-region custom property mapping (defined on `.fmp-card[data-region="..."]`). Confirm `var(--fmp-accent)` and `currentColor` are the only ways to pick up region tinting inside an SVG.

---

## 4. Files to Modify (5 only)

```
frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step1Identity.jsx
frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step2Track.jsx
frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step3Score.jsx
frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step4Alert.jsx
frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step5Close.jsx
```

**Do NOT modify:** any other JSX file, any CSS, any i18n module, any hook, the directive predecessor, `App.jsx`, or any production data path.

You **may extend** `FiveMinuteProof.css` ONLY to add new SVG-utility classes if a current class genuinely cannot express what you need (e.g., a new `__chip-hot`, `__chip-warm`, `__chip-cold` triplet for the Score ladder). Document each new class with a short comment.

---

## 5. Component contract — preserve exactly

Each illustration must remain:

```jsx
export default function StepNXxx({ className = "" }) {
  return (
    <svg
      className={`fmp-svg ${className}`}
      viewBox="0 0 480 240"
      role="img"
      aria-hidden="true"
    >
      {/* content */}
    </svg>
  );
}
```

- Default export, functional, single prop `className`.
- viewBox `0 0 480 240` (2:1).
- `role="img"`, `aria-hidden="true"` (the body copy carries the meaning for AT users).
- No inline event handlers, no JS logic — pure declarative SVG with className references.

---

## 6. New illustration accepts a new optional prop: `personaName`

For Steps 1, 3, 4 — the persona name must be visible inside the illustration (label chip / micro-text on a row / inside a notification card). To get the name into the SVG without coupling to global state, add a single optional prop:

```jsx
export default function Step1Identity({ className = "", personaName = "" }) {
  // ...
  {personaName && (
    <text x="..." y="..." className="fmp-svg__label">{personaName}</text>
  )}
}
```

`TutorialStep.jsx` (existing) already resolves the persona name. Update it (this is the **only** non-illustration edit allowed in this sprint) so the prop flows through:

```jsx
// In TutorialStep.jsx — pass personaName to whichever Step component is rendered.
<IllustrationComponent personaName={personaName} />
```

Steps 2 and 5 receive the prop too but may choose not to render it if visually crowded.

---

## 7. Per-step visual specifications

All measurements use the `0 0 480 240` viewBox. Coordinates below are illustrative — Cursor has discretion to refine pixel positions for visual balance, but each numbered element MUST appear in the final SVG.

### Step 1 — Identity (the tap)

**Required elements:**
1. **Premium Box** — open box silhouette (3-sided rectangle suggesting a lid up), centered around x=120, ~140×170. Use `--fmp-accent` for stroke at 2 px.
2. **DynamicNFC card emerging from the box** — rounded rectangle ~92×56, gradient stroke from `var(--fmp-brand-blue)` at top to `var(--fmp-brand-red)` at bottom (use SVG `<linearGradient>` defined inside `<defs>`).
3. **Card brand mark** — inside the card, render the wordmark in two parts: "Dynamic" in `var(--fmp-text-primary)`, "NFC" in `var(--fmp-brand-red)`, font 12 px monospace. Add 3 thin concentric arcs on the card (NFC wave glyph) in `var(--fmp-brand-blue)`.
4. **NFC wave pulse** — 3 concentric arcs emanating from the right edge of the card toward the persona, animating outward via the existing `.fmp-svg__pulse` class (CSS handles the animation; you only need to apply the class).
5. **Persona silhouette** — head (circle r=20) + shoulders (rounded path), positioned around x=370, y=130. Stroke `var(--fmp-text-muted)`, fill very pale (`rgba(0,0,0,0.04)`).
6. **Persona label chip** — directly below the silhouette, a small pill-shaped rect with rounded corners. Inside: `{personaName.toUpperCase()} · VIP` in 10 px monospace, `var(--fmp-text-primary)`. Background `var(--fmp-accent)` at 12% opacity, border `var(--fmp-accent)` at 1 px.
7. **Tap gesture indicator** — a small finger/hand glyph (built from 2 simple geometric paths) hovering above the card, with a subtle pulsing dot at the contact point.

**Animation:** The 3 NFC waves and the contact dot use `.fmp-svg__pulse`. Persona chip stays static.

### Step 2 — Track (the data stream)

**Required elements:**
1. **Phone outline** on the left — rounded rectangle 70×130 around x=60. Stroke `var(--fmp-text-muted)`, with a small notch at top.
2. **Inside the phone**, three short horizontal label rows showing what was viewed:
   - "FLOOR PLAN" — top row, accent-colored bar
   - "BROCHURE" — middle row, accent at 60%
   - "PAYMENT PLAN" — bottom row, accent at 60%
   Use 8 px monospace for labels; rows are accent-colored thin bars (height 4 px) with the label text just below in `var(--fmp-text-muted)`.
3. **Three flowing arrows** from phone to dashboard — each animated via `.fmp-svg__pulse-flow` (NEW utility class — add to CSS if needed: `stroke-dasharray: 6 4; animation: dashFlow 2s linear infinite; @keyframes dashFlow { to { stroke-dashoffset: -10; } }` gated by `prefers-reduced-motion`). One arrow per label, color: blue for view, accent for download, red for high-intent click.
4. **Dashboard grid** on the right — outer rounded rectangle ~210×150 around x=240, with brand-blue stroke. Three rows inside, each a thin rounded rectangle. Each row has a tiny event description chip:
   - Row 1: a colored dot (blue) + microtext "VIEW · 2s ago"
   - Row 2: a colored dot (accent) + microtext "DOWNLOAD · 14s"
   - Row 3: a colored dot (red) + microtext "CLICK · just now"
5. **DynamicNFC card iconlet** — small (24×16) in the top-right of the dashboard, with the red "NFC" wordmark visible (1 element, but it anchors brand identity in the dashboard).

**Animation:** Arrows flow continuously. Row dots have a brief pulse on cycle.

### Step 3 — Score (the ladder)

**Required elements:**
1. **Lead ladder** — three stacked horizontal rows centered in the canvas, each ~280×34. Use the existing dashboard grid container outline.
2. **Row content (top to bottom — Hot, Warm, Cold):**
   - **Hot row:** filled red dot at left, persona name in 11 px sans-serif, score chip "82" on the right with red background and white text. Add a `.fmp-svg__pulse` class to the chip so it visibly attracts attention. This row uses `personaName` prop.
   - **Warm row:** amber/yellow dot, generic name "Sarah Chen", score chip "54" with yellow/amber background, dark text.
   - **Cold row:** gray dot, generic name "Tom Lee", score chip "38" with neutral gray background.
3. **A vertical thermometer / scale ladder on the left** — minimal: a tall rounded rect with a red top portion (the "hot" zone), amber middle (warm), gray bottom (cold). 16×130, x=70.
4. **Tiny "VELOCITY" label** above the ladder in 9 px monospace, `var(--fmp-text-muted)`, letter-spacing 0.15em.
5. **An upward arrow** between the Warm and Hot rows — small, colored `var(--fmp-accent)`, suggesting trajectory. Animated `.fmp-svg__pulse` so the eye is drawn to the upward motion.

**Animation:** Hot chip pulses. Upward arrow pulses. Other rows static.

### Step 4 — Alert (the notification)

**Required elements:**
1. **Bell glyph** — proper bell shape: rounded dome top + flared body + small clapper at the bottom. Center around x=140, height ~120. Stroke `var(--fmp-accent)`, fill very pale accent.
2. **Notification badge dot** at the upper-right of the bell — solid red circle r=8, with `.fmp-svg__pulse` class and a subtle ring expanding outward (red ring at 30% opacity).
3. **Notification card** sliding in from the right side — rounded rectangle 220×120 around x=240, brand-blue stroke at 1.5 px, white fill, subtle shadow (use a `<filter>` block inside `<defs>` with `feDropShadow`).
4. **Inside the notification card**, four lines stacked:
   - Header bar in accent: "🔔 HOT LEAD" (use SVG-drawn bell-and-text combination — no emoji unicode; replicate with simple paths) in 9 px monospace.
   - Persona line: `{personaName}` in 12 px sans-serif, `var(--fmp-text-primary)`, semibold.
   - Action line: "viewed Penthouse 4B" in 10 px sans-serif, `var(--fmp-text-muted)`.
   - Timestamp line: "2 min ago" in 9 px monospace, `var(--fmp-text-muted)`, right-aligned.
5. **A connecting line** between the bell and the notification card — animated `.fmp-svg__pulse-flow` (the same flow class introduced in Step 2).
6. **DynamicNFC card iconlet** in the bottom-right corner of the notification, 20×12, with red "NFC" — anchors brand identity.

**Animation:** Bell badge dot pulses. Connector line flows. Hot Lead header bar may have a subtle background pulse.

### Step 5 — Close (the booked viewing)

**Required elements:**
1. **Two avatars facing each other** — left avatar = persona (silhouette + small label chip below: `{personaName.toUpperCase()} · VIP`), right avatar = sales rep (different silhouette shape — e.g., slightly different shoulders or a small headset detail to differentiate; label chip below: "YOUR REP").
2. **Connection line between the two avatars** — solid, brand-blue, with a slight curve. NOT animated (this is a "completed" state, not a flowing one).
3. **Calendar tile in the center of the connection** — square ~50×50, rounded corners, white background, brand-red top strip with "MAY" in white 9 px monospace, large number "07" in 22 px sans-serif below in `var(--fmp-text-primary)`. Small clock icon at the bottom (built from 2 lines + a circle) with text "14:00".
4. **Booked badge** — pill-shaped, prominent, positioned below the calendar tile, around x=200, y=210. Background `var(--fmp-accent)` solid, white text "BOOKED · TOMORROW 14:00" in 11 px monospace, weight bold. Add `.fmp-svg__pulse` so it draws the eye as the closing payoff of the entire tutorial.
5. **Confetti or success indicator** — three small geometric shapes (triangle, square, circle) scattered above the calendar in `var(--fmp-accent)` and `var(--fmp-brand-red)`, suggesting celebration. Static, no animation.
6. **DynamicNFC card iconlet** in the bottom-right of the canvas, 24×16, red "NFC" — closes the visual narrative on the brand mark.

**Animation:** Booked badge pulses. Everything else static (this is the resolved state).

---

## 8. Brand identity micro-component — DynamicNFC card iconlet

Three steps (1, 2, 4, 5) reference a small "DynamicNFC card iconlet". To avoid duplication, define an SVG `<symbol>` once at the top of each file (or in a shared inline-SVG defs block within each illustration since they're separate files) and `<use>` it at the appropriate location.

Symbol definition example:

```jsx
<defs>
  <symbol id="fmp-nfc-card-mark" viewBox="0 0 24 16">
    <rect x="0.5" y="0.5" width="23" height="15" rx="2.5"
          fill="white" stroke="var(--fmp-brand-blue)" strokeWidth="1" />
    <text x="3" y="11" fontFamily="monospace" fontSize="6" fill="var(--fmp-text-primary)">Dynamic</text>
    <text x="14" y="11" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="var(--fmp-brand-red)">NFC</text>
    <path d="M 21 3 Q 22 4 22 5 M 21 5 Q 22 6 22 7" stroke="var(--fmp-brand-blue)" fill="none" strokeWidth="0.5" />
  </symbol>
</defs>
<use href="#fmp-nfc-card-mark" x="..." y="..." width="24" height="16" />
```

**Rule:** the `id` must be unique per file (e.g., `fmp-nfc-card-mark-step1`, `fmp-nfc-card-mark-step2`) to avoid DOM ID collisions when multiple steps render in the same SPA session.

---

## 9. Region accent — must show across all 4 regions

Each illustration must contain **at least 3 elements** that derive their color from `var(--fmp-accent)` so a user switching regions (Gulf gold → USA navy → Mexico copper → Canada navy) sees a clearly different visual on every step, not just a body-copy persona swap.

**Suggested accent surfaces per step:**
- Step 1: Premium Box stroke + persona chip background + tap-gesture pulse
- Step 2: Phone label bars + middle arrow + dashboard grid stroke
- Step 3: Score thermometer mid-zone + Hot row chip border + upward arrow
- Step 4: Bell stroke + notification card stroke (subtle) + Hot-Lead header background
- Step 5: Booked badge background + persona chip border + confetti shape

**Test before committing:** open Settings → switch region; the visual difference must be obvious without reading any text.

---

## 10. Animation rules

- All animations gated by `@media (prefers-reduced-motion: no-preference)`. Re-check that any new keyframes added to `FiveMinuteProof.css` are wrapped in this media block.
- Use existing utility classes wherever possible (`fmp-svg__pulse`).
- If you add a new utility class (e.g., `fmp-svg__pulse-flow` for the dashed-arrow flow), document it with a `/* Sprint 2 #1.1: dashed flow for stream visualizations */` comment in CSS.
- No animation may cause layout shift. Use `opacity`, `transform`, `stroke-dashoffset` — never `width` / `height` / position properties.

---

## 11. Verify steps (run all before reporting back)

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend

# 1. Build passes
npm run build

# 2. Line counts on the 5 illustrations — each should be substantially larger now
$files = @(
  "src\components\UnifiedDashboard\FiveMinuteProof\illustrations\Step1Identity.jsx",
  "src\components\UnifiedDashboard\FiveMinuteProof\illustrations\Step2Track.jsx",
  "src\components\UnifiedDashboard\FiveMinuteProof\illustrations\Step3Score.jsx",
  "src\components\UnifiedDashboard\FiveMinuteProof\illustrations\Step4Alert.jsx",
  "src\components\UnifiedDashboard\FiveMinuteProof\illustrations\Step5Close.jsx"
)
foreach ($f in $files) {
  "$f : $((Get-Content $f).Length) lines"
}
# Expect each file to land in the 40–100 lines range (was 12–15). Below 30 = under-spec.

# 3. Each illustration uses var(--fmp-accent) at least 3 times
foreach ($f in $files) {
  $count = (Select-String -Path $f -Pattern "--fmp-accent" -AllMatches).Matches.Count
  "$f : --fmp-accent uses = $count"
}
# Expect: each >= 3.

# 4. Each illustration uses the brand red and brand blue at least once
foreach ($f in $files) {
  $r = (Select-String -Path $f -Pattern "--fmp-brand-red" -AllMatches).Matches.Count
  $b = (Select-String -Path $f -Pattern "--fmp-brand-blue" -AllMatches).Matches.Count
  "$f : red=$r blue=$b"
}
# Expect: each red>=1 and blue>=1.

# 5. personaName prop wired through TutorialStep
Select-String -Path "src\components\UnifiedDashboard\FiveMinuteProof\TutorialStep.jsx" -Pattern "personaName"
# Should show the prop being passed to the illustration component.

# 6. No new global classes introduced outside fmp- namespace
Select-String -Path "src\components\UnifiedDashboard\FiveMinuteProof\FiveMinuteProof.css" -Pattern "^\.[a-z]" |
  Where-Object { $_.Line -notmatch "^\.fmp-" }
# Should return nothing.

# 7. Reduced-motion guard on any new keyframes
Select-String -Path "src\components\UnifiedDashboard\FiveMinuteProof\FiveMinuteProof.css" -Pattern "@keyframes"
# For each match, manually verify a `prefers-reduced-motion: no-preference` block guards its usage.
```

**Manual smoke test on `npm run dev`:**

1. Login, open Overview, expand tutorial. Walk through all 5 steps. Each illustration must:
   - Show the DynamicNFC brand mark (Steps 1, 2, 4, 5)
   - Render persona name as a visible label (Steps 1, 3, 4, 5)
   - Use accent color visibly (all steps)
2. Switch region inside the open tutorial: Gulf → USA → Mexico → Canada. Each region change must produce a clearly visible accent shift on every step.
3. Switch language EN → AR → ES → FR. Body copy translates. Illustrations remain coherent — no text inside SVG should appear visually broken in RTL (test Step 4's notification card layout especially).
4. Mobile viewport (375 px). Illustrations must remain legible — no clipped elements, no text overlapping shapes.

---

## 12. Important Notes

1. **Code Simplicity Mandate.** Each SVG should be readable at a glance. No procedural generation, no JSX loops. Plain declarative SVG primitives. Group related elements with `<g>` for visual organization.
2. **No external assets.** All visuals are hand-built primitives. No `<image href=...>`, no SVG sprite sheet, no `import`s of asset files.
3. **No new dependencies.** No icon libraries. The directive predecessor explicitly chose inline SVG over Lucide; we continue that.
4. **`fmp-` prefix discipline.** Any new CSS class introduced for SVG utilities must be prefixed `fmp-svg__` and added to `FiveMinuteProof.css`, not as a global.
5. **personaName prop is optional.** If empty string passed, the `<text>` element conditionally renders nothing — never crashes.
6. **DOM IDs.** SVG `<symbol id="...">` and `<linearGradient id="...">` IDs must be unique across all 5 files. Suffix with the step name (e.g., `fmp-grad-card-step1`).

---

## 13. Out of Scope (do not build)

- Any change to component logic, state, props beyond `personaName`
- Any change to body copy, banner text, or i18n
- Any change to Firestore schema or hook layer
- Sector-aware persona variants (still real_estate VIP only)
- Any change to `RegionMorphLoader` or sector morph loaders
- Any change to topbar, sidebar, or layout

---

## 14. Definition of Done

- [ ] All 5 illustration files redesigned per §7
- [ ] `personaName` prop threaded through `TutorialStep.jsx` to each illustration
- [ ] Each illustration uses `var(--fmp-accent)` at least 3 times (verify via §11 step 3)
- [ ] Each illustration uses brand-blue and brand-red at least once (verify via §11 step 4)
- [ ] DynamicNFC card brand mark visible in Steps 1, 2, 4, 5
- [ ] Persona name rendered as visible label in Steps 1, 3, 4, 5
- [ ] Step 5 includes the "BOOKED · TOMORROW 14:00" badge
- [ ] All animations gated by `prefers-reduced-motion` guard
- [ ] No new global CSS classes introduced (only `.fmp-*` namespace)
- [ ] `npm run build` passes
- [ ] Manual smoke test §11 items 1–4 all pass on `npm run dev`
- [ ] PR opened: `cursor/sprint-2-1-1-illustration-polish` → `main`, title `feat(overview): polish Five-Minute Proof illustrations (Sprint 2 #1.1)`

---

## 15. Reporting back

In your completion message:

1. Paste output of all 7 verify commands in §11.
2. Paste the last 30 lines of `npm run build`.
3. Confirm: "All 5 illustrations use `var(--fmp-accent)` at least 3 times each, brand-blue and brand-red at least once each."
4. Confirm: "DynamicNFC card brand mark renders in Steps 1, 2, 4, 5. Persona name label renders in Steps 1, 3, 4, 5. Booked badge renders in Step 5."
5. Push branch `cursor/sprint-2-1-1-illustration-polish` but **do NOT merge** — Claude audits and merges.

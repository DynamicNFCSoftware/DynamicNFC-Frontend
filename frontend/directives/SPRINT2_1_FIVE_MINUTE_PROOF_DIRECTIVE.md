# Sprint 2 #1 — Five-Minute Proof Tutorial

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (claude.ai)
**Branch:** `cursor/sprint-2-1-five-minute-proof`
**Target:** `/unified/overview` — collapsed banner above `<TodaysBrief>`, expands to a 5-step click-through tutorial.

---

## 1. Goal

Add a region-aware, collapsible **Five-Minute Proof** tutorial to Overview. Banner-by-default, click-through (not auto-play), 5 steps, persona name pulled from `getPersonas()`, dismiss state stored in `tenants/{uid}/settings/tutorial`.

This is the **value-prop walkthrough** — the artifact Oguzhan opens in a sales meeting to explain the product in five clicks. It must look polished on first render, work for a brand-new tenant with zero data, and never block the page.

---

## 2. Approved Decision Stack

| Code | Decision | Implication |
|------|----------|-------------|
| **G3** | Hybrid trigger | First-login auto-expand · Settings tab "Replay tutorial" button |
| **H1** | Overview inline | Lives on `/unified/overview`, above `<TodaysBrief>` |
| **I2** | 5 steps | Identity → Track → Score → Alert → Close |
| **J2** | Click-through | "Next" button advances; no auto-play |
| **K1** | Inline SVG illustrations | Hand-built, brand-consistent — no screenshots |
| **L2** | Collapsed banner default | 1-line banner with "Start tutorial" CTA |
| **M1** | Per-tenant Firestore flag | `tenants/{uid}/settings/tutorial.dismissed` |
| **N2** | Region-dynamic persona | `getPersonas()` swaps name across all 4 regions |
| **P1** | Gulf stays visible | Region selector behavior unchanged |

---

## 3. Read First (mandatory before writing code)

Before writing any code:

1. Read `mnt/skills/user/dynamicnfc-web-builder/SKILL.md` for build patterns specific to this project.
2. Open `frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx` and locate the existing **`accountPreferences`** section. Identify the JSX pattern used by `language`, `theme`, and `notifications` rows — you will mirror that pattern exactly. Do NOT invent new class names like `ud-setting-row` / `ud-btn-secondary`. Use whatever the existing rows use.
3. Open `frontend/src/config/regionConfig.js` and read the `getPersonas()` function (line 176) and the `personas` shape inside each region constant (line 22 onward). Confirm the function returns an **array** of `{ id, name, email, type, role }` objects, sector keys are **snake_case** (`real_estate`, `automotive`, `yacht`).

---

## 4. Files to Create

```
frontend/src/components/UnifiedDashboard/FiveMinuteProof/
  FiveMinuteProof.jsx          ← container (banner + expanded states)
  TutorialStep.jsx             ← single step (header + body + SVG slot)
  TutorialNav.jsx              ← progress dots + Back/Next/Close buttons
  illustrations/
    Step1Identity.jsx          ← inline SVG component
    Step2Track.jsx             ← inline SVG component
    Step3Score.jsx             ← inline SVG component
    Step4Alert.jsx             ← inline SVG component
    Step5Close.jsx             ← inline SVG component
  FiveMinuteProof.css          ← scoped styles, prefix `fmp-`
  index.js                     ← `export { default } from './FiveMinuteProof';`

frontend/src/i18n/portals/fiveMinuteProof.js   ← own i18n module (do NOT add to dashboard.js)
```

---

## 5. Files to Modify

| File | Change |
|------|--------|
| `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` | Render `<FiveMinuteProof />` above `<TodaysBrief>` |
| `frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx` | Add "Replay tutorial" row inside the existing `accountPreferences` section, mirroring the `theme` / `language` row JSX pattern |
| `frontend/src/hooks/useDashboardData.js` | Add `tutorialState` + `tutorialLoaded` snapshot listener, expose `dismissTutorial()`, `completeTutorial()`, `replayTutorial()` |

**Do not modify:** `App.jsx`, `firebase.js`, region/sector context, any portal route, `cards` collection, `dashboard.js` i18n module.

---

## 6. Firestore Schema

```
tenants/{uid}/settings/tutorial
  dismissed: boolean        # true after user closes / completes
  dismissedAt: Timestamp    # null until first dismiss
  completedAt: Timestamp    # null until user reaches step 5 + clicks Finish
  replayCount: number       # increments on Settings → Replay tutorial
```

**Read path:** snapshot listener inside `useDashboardData.js`, exposed as `tutorialState`. A separate `tutorialLoaded` boolean flag guards against first-paint flicker.

**Write path:** every `setDoc` uses `{ merge: true }`. `replayCount` uses Firestore atomic `increment(1)` — never read-then-write.

**First-time tenant:** if doc doesn't exist, treat as "fresh" → tutorial auto-expands on first Overview render after the listener delivers its first snapshot.

---

## 7. Component Spec

### 7.1 `FiveMinuteProof.jsx` (container)

**Props:**
- `tutorialState` — `{ dismissed, dismissedAt, completedAt, replayCount } | null`
- `tutorialLoaded` — `boolean` (true after first onSnapshot fires)
- `onDismiss` — fires when user clicks ✕ or finishes
- `onComplete` — fires when user clicks "Finish" on step 5
- `regionId` — from `useRegion()`
- `lang` — from `useLanguage()`

**Local state:**
- `expanded: boolean` — controls banner-vs-tutorial render
- `currentStep: number` — 1–5

**Mount logic (flicker-safe):**
```js
useEffect(() => {
  if (!tutorialLoaded) return;       // wait for first snapshot
  const isFirstTime = !tutorialState;
  const isPending = tutorialState && !tutorialState.dismissed && !tutorialState.completedAt;
  if (isFirstTime || isPending) setExpanded(true);
}, [tutorialLoaded, tutorialState]);
```

**Render: collapsed (banner)**
- Single row, ~56px tall
- Eye icon (Lucide `<Eye>`, color `var(--fmp-brand-blue)`)
- Title text via `t('banner.title')`
- "Start tutorial →" button (color `var(--fmp-brand-red)`)
- Click anywhere on banner OR button → `setExpanded(true)`

**Render: expanded (tutorial card)**
- Card background: `var(--fmp-surface)`
- Border: `1px solid var(--fmp-border)`
- Padding: `1.5rem`
- Border-radius: `var(--fmp-radius)`
- ✕ in top-end (use logical positioning) → calls `onDismiss()` → writes `dismissed: true`, collapses
- ✕ does NOT delete progress; if user re-opens, starts at step 1 (no resume state — Code Simplicity Mandate)
- Region accent applied via `data-region={regionId}` on outermost `.fmp-card` div, exposed as `--fmp-accent` custom property (see §11)

### 7.2 `TutorialStep.jsx`

**Props:** `stepNumber`, `totalSteps`, `personaName`, `regionId`

**Renders:**
- Top: persona-aware illustration (one of the 5 SVG components, picked by `stepNumber`)
- Middle: `Step {n} of {total} — {label}` (small, uppercase, muted via `var(--fmp-text-muted)`)
- Below: 2–3-sentence body copy via `t('steps.{stepIndex}.body')`, with `{persona}` token replaced via simple string replacement

**Persona injection — IMPORTANT, get this right:**
```js
import { getPersonas } from '../../../config/regionConfig';

const personas = getPersonas('real_estate', regionId);  // sector ID is snake_case
const vipInvestor = personas.find(p => p.type === 'vip') || personas[0];
const personaName = vipInvestor?.name || 'Khalid Al-Rashid';
```

Use the **VIP investor** (first `type: 'vip'` in the array) for all 5 steps — one consistent character through the journey. Sector is fixed to `'real_estate'` for v1 even if the user is on Automotive or Yacht — sector-aware persona variants are out of scope (§16).

### 7.3 `TutorialNav.jsx`

- Progress dots (5 dots, filled = visited, hollow = upcoming, accent = current)
- "Back" button (disabled on step 1, focusable)
- "Next →" button on steps 1–4
- "Finish" button on step 5 → calls `onComplete()` → writes `completedAt` + `dismissed: true`, collapses

Each dot should have `aria-label` with the step number, the active dot should have `aria-current="step"`.

### 7.4 SVG Illustrations

5 inline SVG components, **one per step**, each a default-export functional component accepting only `className`. Build them from these primitives only:

- DynamicNFC card outline (rounded rectangle, gradient stroke `--fmp-brand-blue` → `--fmp-brand-red`)
- NFC wave arcs (concentric, animated only inside `@media (prefers-reduced-motion: no-preference)`)
- Buyer silhouette (simple geometric, head + shoulders)
- Dashboard grid representation (three rectangles stacked, header bar)
- Bell/alert glyph (Lucide-style, hand-built)
- Connection line / arrow (animated `stroke-dasharray` for "data flowing" feel)

**Composition per step:**

| # | Title (en) | Visual |
|---|------------|--------|
| 1 | Identity | Premium Box with NFC card emerging, persona silhouette receiving it. NFC waves pulse from card. |
| 2 | Track | Card → buyer phone → arrows streaming into a 3-row dashboard grid. Each arrow minimally labeled (view, download, click). |
| 3 | Score | Dashboard grid with one row highlighted in accent color. Small score chip "82" pulsing on it. |
| 4 | Alert | Bell glyph with brand-red dot. Notification card sliding in from the inline-end side. Persona name visible inside. |
| 5 | Close | Two avatars connected by a line, calendar tick mark on the line, "Booked" badge. |

**SVG rules:**
- `viewBox="0 0 480 240"` — 2:1 aspect, scales fluidly via `width="100%"` + `height="auto"`
- All colors via the local CSS variables defined in §11 — never hardcode hex inside SVG markup
- Region accent referenced as `var(--fmp-accent)` or `currentColor` (color of the parent `.fmp-illustration`)
- All animations gated by `@media (prefers-reduced-motion: no-preference)`
- No external image fetches, no `<img src=...>`, no fonts beyond inherited

---

## 8. Step Copy (English source — translate verbatim to AR/ES/FR)

All copy uses `{persona}` placeholder for the dynamic name. Each step has `label`, `body`. Place this entire object inside `i18n/portals/fiveMinuteProof.js`.

```js
en: {
  banner: {
    title: 'Five-Minute Proof — See how a tap becomes a closed deal',
    cta: 'Start tutorial',
  },
  card: {
    title: 'Five-Minute Proof',
    subtitle: 'How DynamicNFC turns a tap into a closed deal',
    closeAria: 'Close tutorial',
  },
  progress: 'Step {current} of {total}',
  back: 'Back',
  next: 'Next',
  finish: 'Finish',
  settings: {
    replayTitle: 'Replay the Five-Minute Proof',
    replayHelp: 'Re-open the tutorial walkthrough on Overview. Useful for sales meetings.',
    replayCta: 'Replay tutorial',
  },
  steps: [
    {
      label: 'Identity',
      body: '{persona} receives a Premium Box. The tap on the VIP Access Key is the ultimate opt-in — identity is established before the buyer ever opens the experience.',
    },
    {
      label: 'Track',
      body: 'Behavioral signals stream in real-time. Floor plan views, brochure downloads, payment plan clicks — every action lands in your Pipeline before the buyer leaves the page.',
    },
    {
      label: 'Score',
      body: 'Each signal updates {persona}’s Velocity score. Hot leads surface automatically. You are no longer guessing who to call first — the data tells you.',
    },
    {
      label: 'Alert',
      body: 'When {persona} crosses a threshold, your sales rep is notified instantly. Not at end of week. Not in tomorrow’s digest. The moment intent peaks.',
    },
    {
      label: 'Close',
      body: 'Your rep contacts {persona} with full context — what they viewed, what they downloaded, what they’re ready for. The booked viewing follows. Decision speed compounds.',
    },
  ],
}
```

**AR / ES / FR:** Translate respecting brand language. RTL flips automatically via `document.dir="rtl"`. Use Modern Standard Arabic, formal Spanish (usted), formal French (vous). All `{persona}` placeholders preserved verbatim. All `{current}` and `{total}` placeholders preserved.

---

## 9. Hook Integration — `useDashboardData.js`

Add a snapshot listener and three callbacks. Mirror the existing pattern used for other tenant subcollection listeners in this file. Use `firebase/firestore` `increment` for atomic counter updates.

```js
import { doc, onSnapshot, setDoc, serverTimestamp, increment } from 'firebase/firestore';

// Inside useDashboardData, alongside existing listeners:
const [tutorialState, setTutorialState] = useState(null);
const [tutorialLoaded, setTutorialLoaded] = useState(false);

useEffect(() => {
  if (!uid) {
    setTutorialState(null);
    setTutorialLoaded(false);
    return;
  }
  const ref = doc(db, 'tenants', uid, 'settings', 'tutorial');
  const unsub = onSnapshot(
    ref,
    (snap) => {
      setTutorialState(snap.exists() ? snap.data() : null);
      setTutorialLoaded(true);
    },
    (err) => {
      console.warn('[useDashboardData] tutorial listener error', err);
      setTutorialLoaded(true);  // unblock UI even on error
    }
  );
  return () => unsub();
}, [uid]);

const dismissTutorial = useCallback(async () => {
  if (!uid) return;
  await setDoc(
    doc(db, 'tenants', uid, 'settings', 'tutorial'),
    { dismissed: true, dismissedAt: serverTimestamp() },
    { merge: true }
  );
}, [uid]);

const completeTutorial = useCallback(async () => {
  if (!uid) return;
  await setDoc(
    doc(db, 'tenants', uid, 'settings', 'tutorial'),
    {
      dismissed: true,
      dismissedAt: serverTimestamp(),
      completedAt: serverTimestamp(),
    },
    { merge: true }
  );
}, [uid]);

const replayTutorial = useCallback(async () => {
  if (!uid) return;
  await setDoc(
    doc(db, 'tenants', uid, 'settings', 'tutorial'),
    {
      dismissed: false,
      dismissedAt: null,
      replayCount: increment(1),
    },
    { merge: true }
  );
}, [uid]);

// Add to the hook's return object:
return {
  // ...existing fields
  tutorialState,
  tutorialLoaded,
  dismissTutorial,
  completeTutorial,
  replayTutorial,
};
```

Because `useDashboardData.js` is over 1,200 lines (CLAUDE.md §11 Large File Protocol), after editing run:
- `(Get-Content "frontend\src\hooks\useDashboardData.js").Length` — confirm new line count is reasonable (expect ~1290–1310)
- `Get-Content "frontend\src\hooks\useDashboardData.js" -Tail 30` — confirm proper closing of file

---

## 10. Overview Integration

In `OverviewTab.jsx`, render order becomes:

```jsx
<PipelineOverviewKpis kpis={kpis} />
<FiveMinuteProof
  tutorialState={tutorialState}
  tutorialLoaded={tutorialLoaded}
  onDismiss={dismissTutorial}
  onComplete={completeTutorial}
  regionId={regionId}
  lang={lang}
/>
<TodaysBrief ... />
<SalesVelocity ... />
```

**Spacing:** rely on the existing tab-level vertical rhythm. If unclear, use `margin-block: 1rem` between blocks. Do not introduce a new spacing scale.

Pull `tutorialState`, `tutorialLoaded`, `dismissTutorial`, `completeTutorial` from the same `useDashboardData()` destructure that already supplies `kpis` etc. in this file.

---

## 11. Settings Integration

In `SettingsTab.jsx`, add a "Replay tutorial" row inside the existing **`accountPreferences`** section.

**Pattern fidelity — mandatory:** open the file first, find the existing `theme` row (or `language` row), and copy that exact JSX structure including class names. Do NOT invent class names like `ud-setting-row` / `ud-btn-secondary` — those do not exist in this codebase. Whatever wrapper / label / control / button classes the existing rows use, your new row uses the same. Match indentation, ordering, and accessibility attributes.

The row should:
- Show the `replayTitle` text as the row label
- Show `replayHelp` text as the help / subtitle
- Have a single button labeled `replayCta`
- The button calls `replayTutorial` from `useDashboardData()`
- The button is disabled when `!tutorialState || !tutorialState.dismissed` (you can only replay something you've already dismissed once)

Pull `replayTutorial` and `tutorialState` from the same `useDashboardData()` destructure already used elsewhere in this file.

i18n strings for this section live in the new `i18n/portals/fiveMinuteProof.js` namespace. Use `useTranslation('fiveMinuteProof')` at the top of the SettingsTab component (alongside any existing `useTranslation` call — the namespaces stack independently, not exclusive).

---

## 12. CSS — `FiveMinuteProof.css`

Use the `fmp-` prefix exclusively. No global selectors. **Local CSS variables defined at the top of the file**, derived from CLAUDE.md §4 brand colors. No reliance on global tokens (this codebase uses hex values directly per CLAUDE.md §10).

```css
/* FiveMinuteProof — Sprint 2 #1
   Local design tokens (project does not use global CSS variables for brand colors). */
.fmp-card,
.fmp-banner {
  --fmp-brand-red:    #e63946;
  --fmp-brand-red-dk: #c1121f;
  --fmp-brand-blue:   #457b9d;
  --fmp-charcoal:     #1a1a1f;
  --fmp-cream:        #faf8f5;
  --fmp-surface:      #ffffff;
  --fmp-border:       rgba(26, 26, 31, 0.12);
  --fmp-text-primary: #1a1a1f;
  --fmp-text-muted:   rgba(26, 26, 31, 0.58);
  --fmp-radius:       12px;
}

/* Region accent — applied via [data-region] on .fmp-card */
.fmp-card[data-region="gulf"]   { --fmp-accent: #b8860b; }
.fmp-card[data-region="usa"]    { --fmp-accent: #1a365d; }
.fmp-card[data-region="mexico"] { --fmp-accent: #b87333; }
.fmp-card[data-region="canada"] { --fmp-accent: #1d3557; }
.fmp-card:not([data-region])    { --fmp-accent: var(--fmp-brand-blue); }
```

Region accent values: gulf gold from CLAUDE.md §4; USA + Canada navy/sidebar accents are taken from `regionConfig.js` `sidebarAccent` field for visual consistency with the dashboard chrome.

Key classes (define rules for each):

- `.fmp-banner` — collapsed state, ~56px tall, flex row, hover lift (subtle `transform: translateY(-1px)` + box-shadow on `:hover`)
- `.fmp-banner__icon`, `.fmp-banner__title`, `.fmp-banner__cta`
- `.fmp-card` — expanded state, supports `data-region="..."` for accent
- `.fmp-card__header` — title + subtitle + close button
- `.fmp-card__close` — ✕ button, `inset-inline-end` for RTL safety
- `.fmp-card__body` — illustration + step content
- `.fmp-illustration` — SVG wrapper, `max-width: 480px`, centered with `margin-inline: auto`
- `.fmp-step__label` — uppercase, `0.75rem`, `letter-spacing: 0.08em`, color `var(--fmp-text-muted)`
- `.fmp-step__body` — `1rem`, `line-height: 1.6`, `max-width: 60ch`, color `var(--fmp-text-primary)`
- `.fmp-nav` — progress dots + buttons row, flex with `justify-content: space-between`
- `.fmp-nav__dots` — flex row of dots
- `.fmp-nav__dot` / `.fmp-nav__dot--active` / `.fmp-nav__dot--current`
- `.fmp-nav__back` / `.fmp-nav__next` / `.fmp-nav__finish`

**Animation:**
- Banner ↔ card transition: `max-height` + `opacity` over `240ms ease-out`
- Step transitions: simple `opacity` 0→1 over `180ms ease` (no slide — keeps RTL trivial)
- All transitions wrapped in `@media (prefers-reduced-motion: no-preference)`

**Responsive (`@media (max-width: 768px)`):**
- Illustration shrinks to full width
- Padding reduces from `1.5rem` to `1rem`
- Nav buttons stack vertically if needed

**RTL:** use logical properties throughout — `margin-inline-start`, `padding-inline`, `inset-inline-end` — never `left`/`right`/`margin-left`. Tested by setting `document.dir="rtl"` (Arabic) — illustration must remain visually correct.

---

## 13. i18n — `frontend/src/i18n/portals/fiveMinuteProof.js`

Create as a new file (do NOT add this namespace into the existing `dashboard.js`). Pattern:

```js
import { registerTranslations } from '..';

registerTranslations('fiveMinuteProof', {
  en: { /* full block from §8 */ },
  ar: { /* full Arabic translation, persona/current/total placeholders preserved */ },
  es: { /* full Spanish translation, formal usted */ },
  fr: { /* full French translation, formal vous */ },
});
```

Use formal register in all four languages. RTL is automatic (CSS logical properties handle it).

**Import path:** make sure this file is imported once at app startup so the namespace registers before render. Look at how the existing `dashboard.js` portal module is imported (typical pattern: an `i18n/index.js` or `i18n/portals/index.js` aggregator imports each portal file). Mirror that pattern.

---

## 14. Verify Steps (Cursor must run all of these before reporting back)

PowerShell from project root:

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend

# 1. Build passes
npm run build

# 2. Line counts on touched large files
(Get-Content "src\hooks\useDashboardData.js").Length
(Get-Content "src\pages\UnifiedDashboard\tabs\OverviewTab.jsx").Length
(Get-Content "src\pages\UnifiedDashboard\tabs\SettingsTab.jsx").Length

# 3. Tail integrity on >500-line files
Get-Content "src\hooks\useDashboardData.js" -Tail 30

# 4. New file inventory
Get-ChildItem "src\components\UnifiedDashboard\FiveMinuteProof" -Recurse -File |
  ForEach-Object { "$($_.Name): $((Get-Content $_.FullName).Length) lines" }

# 5. i18n module exists and registers correct namespace
Select-String -Path "src\i18n\portals\fiveMinuteProof.js" -Pattern "registerTranslations\('fiveMinuteProof'"

# 6. No invented class names sneaked in
Select-String -Path "src\components\UnifiedDashboard\FiveMinuteProof\*.jsx" -Pattern "ud-setting-row|ud-btn-secondary"
# Should return nothing — those classes do not exist in the codebase.

# 7. No invented CSS variables
Select-String -Path "src\components\UnifiedDashboard\FiveMinuteProof\FiveMinuteProof.css" -Pattern "var\(--color-|var\(--radius-lg\)"
# Should return nothing — only fmp- prefixed vars allowed.

# 8. Lint (if a lint script exists; skip if not present)
npm run lint
```

**Manual smoke test on `npm run dev`:**

1. Login as a tenant whose `tenants/{uid}/settings/tutorial` doc does NOT exist (new tenant or delete the doc) → tutorial expands automatically on Overview load AFTER first snapshot (no flicker)
2. Click ✕ → collapses to banner; check Firestore: doc has `dismissed: true`, `dismissedAt` set
3. Refresh page → banner shows collapsed, tutorial does NOT auto-expand
4. Click banner → expands to step 1; click Next 4 times → reach Finish; click Finish → collapses; check Firestore: `completedAt` populated
5. Settings tab → "Replay tutorial" → click → return to Overview → tutorial auto-expanded again; check Firestore: `replayCount` incremented atomically (test by clicking Replay twice quickly — count should increase by 2)
6. Switch region (Gulf → USA → Mexico → Canada) inside open tutorial → persona name updates live in body copy across all 5 steps; accent color shifts on card border / SVG glyphs
7. Switch language (EN → AR → ES → FR) → all step copy translates; RTL flips for AR; illustration must remain visually correct (eye-test arrows still flow logically)
8. Mobile (375px viewport) → banner readable on one line OR wraps cleanly; expanded card padding reduces; nav buttons usable

---

## 15. Important Notes

1. **Code Simplicity Mandate.** No state machines, no XState, no animation libraries. `useState` + CSS transitions only.
2. **Merge-only Firestore writes.** Every `setDoc` uses `{ merge: true }`. `replayCount` uses `increment(1)` — never read-then-write.
3. **No demo-mode fork.** Tutorial works for any tenant. Demo content is irrelevant — persona name comes from `getPersonas('real_estate', regionId)` regardless of seed state.
4. **Persona is realEstate-VIP only for v1.** Even if the active sector is automotive or yacht, the tutorial uses `getPersonas('real_estate', regionId)`. Sector-aware persona variants are out of scope.
5. **Do not animate region switches inside the tutorial.** When `regionId` changes, persona name updates instantly. No fade, no spinner. The morph loader at the layout level already handles transition feel.
6. **Topbar is LOCKED.** Do not add a "Tutorial" button to the topbar. The Settings replay button is the only manual entry point.
7. **No new package dependencies.** Lucide is already in the project — reuse. Everything else is hand-built SVG + CSS.
8. **Listener errors.** If the `tutorialState` listener errors, log via `console.warn` (consistent with existing pattern in `useDashboardData.js`) and set `tutorialLoaded: true` so the UI doesn't hang.

---

## 16. Out of Scope (do not build)

- Sector-aware persona variants (auto/yacht versions of step copy)
- Resume-where-you-left-off on re-open
- Analytics events for "tutorial step viewed" (will be added in a follow-up)
- A/B testing of step counts
- Any change to `RegionMorphLoader` or animation system
- Touching the legacy `/enterprise/crmdemo/dashboard` or `/automotive/dashboard`
- Any change to topbar layout

---

## 17. Definition of Done

- [ ] All 9 new files created (8 component files + 1 i18n module)
- [ ] All 3 modifications applied (OverviewTab, SettingsTab, useDashboardData)
- [ ] Firestore schema doc shape matches §6 exactly
- [ ] All copy goes through `t()` — zero hardcoded user-facing strings
- [ ] CSS uses logical properties — no `left`/`right`/`margin-left`
- [ ] Local CSS variables only — no invented global tokens
- [ ] No invented JSX class names — SettingsTab row mirrors existing `theme`/`language` row exactly
- [ ] `npm run build` passes
- [ ] All 8 manual smoke test items in §14 pass on `npm run dev`
- [ ] Tail integrity confirmed on `useDashboardData.js`
- [ ] PR opened: `cursor/sprint-2-1-five-minute-proof` → `main`, title `feat(overview): Five-Minute Proof tutorial (Sprint 2 #1)`
- [ ] PR description lists: files added, files modified, Firestore schema introduced, smoke test results, line-count deltas on large files

---

## 18. Reporting Back

In the completion message:

1. Paste output of all 8 verify commands in §14
2. Paste the last 30 lines of `npm run build`
3. Confirm: "All Firestore writes use `{ merge: true }`. `replayCount` uses `increment(1)`."
4. Confirm: "SettingsTab row uses the same JSX/class pattern as the existing `theme` row. No new class names introduced."
5. Confirm: "i18n is in its own file `frontend/src/i18n/portals/fiveMinuteProof.js`. `dashboard.js` was not modified."
6. List which Lucide icons (if any) are used and their exact import paths
7. Branch: `cursor/sprint-2-1-five-minute-proof`. Push branch but **do NOT merge to main** — Claude audits and merges.

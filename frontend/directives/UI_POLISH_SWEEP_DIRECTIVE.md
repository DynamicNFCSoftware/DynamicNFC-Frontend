# UI Polish Sweep — PR 1 (Demo-Killers + Sentence Case + Arrows)

**Author:** Claude (Cowork)
**Date created:** 2026-05-13
**Executor:** Claude Code (Cursor on token break, 2-day pause)
**Source:** `docs/UNIFIED_DASHBOARD_CRITIQUE_2026_05_13.md` priority recommendations 1 + 4
**Branch suggestion:** `polish/pr1-demo-killers-sweep`
**Estimated scope:** 4 source files modified, ~120 line delta net
**Risk:** Low — surgical fixes + global replace; no new components, no schema changes

---

## Why this PR exists

The 2026-05-13 design critique of `/unified/overview` and `/unified/pipeline` found three demo-killers that destroy prospect trust in the first four seconds of a sales demo:

1. **Raw HTML fragment** bleeding into Today's Brief copy: `…score-change">Score now 72 (was 64…`
2. **Raw enum `IDLE_LEAD`** rendered on deal cards in the Pipeline kanban
3. **Brutal zero-state copy** when tenant has no data yet: `Pipeline added $0 in qualified value today across 0 new VIPs. Marketplace traffic up 0%`

Plus two sweep-level consistency drifts surfaced in the same session:

4. **ALL-CAPS eyebrows + stage chips + HOT badges** across the dashboard surface (sentence-case rule violation, breaks the editorial-luxury aesthetic)
5. **ASCII `->` arrow** in 24 places in copy where Unicode `→` (U+2192) is correct

This single PR closes all five. Tokens, topbar lang cycle, and loader cleanup are deferred to PRs 2 and 3.

---

## Audit findings (already verified by Claude — do not re-derive)

### Finding 1 — Today's Brief HTML leak

**Path of the bug:**

- `functions/lib/briefTemplates.js` lines 11–41 already produce structured HTML, e.g.
  ```
  <span class="vip-name">{name}</span> tapped {tapCount} times … <span class="score-change">Score now {score}</span> …
  ```
- CSS at `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css:6266-6274` styles `.ud-todays-brief__paragraph .vip-name` and `.ud-todays-brief__paragraph .score-change` — exactly matching what the function emits.
- `frontend/src/components/UnifiedDashboard/TodaysBrief.jsx` lines 82–104 then **re-wraps** the already-wrapped content:
  - `wrapVipName(paragraph, vipName)` runs `paragraph.replace(new RegExp(vipName, "g"), <span class="ud-todays-brief__vip-name">…</span>)`. The VIP name is *already inside* the function-side `<span class="vip-name">`, so this nests a second span with a non-existent CSS class.
  - `wrapScoreChange(paragraph)` runs a regex `/(score[^,;)]*)/i` (fallback branch) — and the first "score" substring in the already-wrapped paragraph is **inside the attribute `class="score-change"`**. The replace produces malformed HTML like `<span class="<span class="score-change">score-change">Score now …</span>"…`.
- `DOMPurify.sanitize` then strips invalid tags but leaves the broken text content visible. Net result: prospect sees `score-change">Score now 72 (was 64…` as literal screen text.

**Fix:** Remove both `wrapVipName` and `wrapScoreChange` from the frontend. The function-side templates already deliver styled HTML; the frontend just needs to sanitize and render. The class name on the function side (`.vip-name`, `.score-change`) is already what the CSS expects.

### Finding 2 — `IDLE_LEAD` raw enum on Pipeline cards

**Path of the bug:**

- `frontend/src/config/sectorConfig.js:680` emits `triggers.push({ type: "idle_lead", … })` (lowercase, underscore).
- `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx:29–43` defines `TriggerChip`, with a `LABELS` map containing only `pricing_3x`, `booking_request`, `quote_requested`, `test_drive`, `idle_warning`, `high_velocity`. **`idle_lead` and `repeat_visitor` are missing.**
- Line 38: `const label = LABELS[trigger.type]?.[lang] || LABELS[trigger.type]?.en || trigger.type;` — falls back to raw `trigger.type` (`"idle_lead"`).
- CSS `UnifiedLayout.css:3329-3335` `.ud-kb-trigger` applies `text-transform: uppercase` → screen renders `IDLE_LEAD`.

**Fix:** Two parts. (a) Add missing keys to `LABELS` (covers all trigger types emitted by `getTriggers()` in `sectorConfig.js`). (b) Add a generic humanize fallback so any future undeclared trigger type renders as `Idle lead` instead of `idle_lead`. (c) Drop `text-transform: uppercase` from `.ud-kb-trigger` per sentence-case sweep.

### Finding 3 — Zero-state copy

**Path of the bug:**

- `functions/lib/briefTemplates.js:67-72` `PIPELINE_DELTA_TEMPLATES` interpolates `{pipelineDelta}`, `{newVipCount}`, `{trafficDelta}`, `{anonVisitors}` unconditionally. Empty tenant → `"Pipeline added $0 in qualified value today across 0 new VIPs. Marketplace traffic up 0% - 0 anonymous visitors spent >3min on top unit."`
- `VIP_SIGNAL_TEMPLATES` rising/cooling/plateau all interpolate `{hoursAgo}` directly with `hours` baked in. `hoursAgo: 1` → `"1 hours"` ungrammatical.

**Fix:** Add a `ZERO_STATE_TEMPLATES` block per language. Detect zero conditions at the top of `generateBriefFromTemplate`. Add a `pluralize(count, singular, plural)` helper and rewrite the templates to use it for `hours`, `days`, and `times`.

### Finding 4 — ALL CAPS sweep

**Path of the bug:**

`frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` contains `text-transform: uppercase` at lines 275, 292, 499, 580, 671, 990, 1221, 3331 (and likely more — grep confirms). Each sweeps the dashboard with screaming caps for section eyebrows, trigger chips, badges, stage names.

**Fix:** Remove `text-transform: uppercase` from those rules. Replace with `letter-spacing` (e.g. `0.02em`) where editorial cadence is needed. Keep `font-weight: 600/700` for emphasis. The i18n strings (`navOverview: "Overview"` etc.) are already sentence-case in `dashboard.js` — they just need the CSS to stop transforming them.

### Finding 5 — ASCII `->` arrows

Grep across `frontend/src` finds ASCII `->` in 9 files (KPI subtitles, tutorial CTAs, briefTemplates copy, NotificationSystem, ActivityFeed, VIPCrmTab, mockDashboardData, admin.js). Replace with Unicode `→` (U+2192).

---

## File-by-file plan

### 1 — `frontend/src/components/UnifiedDashboard/TodaysBrief.jsx`

**Delete:**

- Lines 69–80: `escapeRegExp` and `escapeHtml` helpers (no longer referenced after deletion).
- Lines 82–104: `wrapVipName`, `wrapScoreChange`, `highlightParagraph1` functions.

**Change:**

- The `paragraph1` useMemo (lines 177–180) currently calls `highlightParagraph1(normalized.paragraph1, normalized.topVipName)`. Replace with just `normalized.paragraph1`:
  ```jsx
  const paragraph1 = useMemo(
    () => asText(normalized.paragraph1),
    [normalized.paragraph1]
  );
  ```

- The `SANITIZE_CONFIG` constant (lines 6–9) is fine — keep it. `vip-name` and `score-change` classes are still allowed because the config permits `ALLOWED_ATTR: ["class"]` and `ALLOWED_TAGS: ["span", "strong", "em"]`.

**Verify:** After edit, file should be ~30 lines shorter. `DOMPurify` import still used. `useTranslation`, `useMemo` still used. No `escapeRegExp` / `escapeHtml` references anywhere else in the file.

### 2 — `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx`

**Replace** the `TriggerChip` component (lines 28–43) with:

```jsx
/* ── Trigger chip (why now?) ── */
const TRIGGER_LABELS = {
  pricing_3x:       { en: "Pricing ×3",      ar: "تسعير ×3",          es: "Precio ×3",         fr: "Prix ×3" },
  booking_request:  { en: "Viewing req",     ar: "طلب معاينة",        es: "Solicitud visita",  fr: "Demande visite" },
  quote_requested:  { en: "Quote req",       ar: "طلب عرض",            es: "Cotización",        fr: "Devis demandé" },
  test_drive:       { en: "Test drive",      ar: "تجربة قيادة",        es: "Prueba manejo",     fr: "Essai routier" },
  idle_warning:     { en: "Going cold",      ar: "يبرد",                es: "Enfriándose",       fr: "Refroidissement" },
  idle_lead:        { en: "Idle lead",       ar: "عميل خامل",          es: "Lead inactivo",     fr: "Prospect inactif" },
  high_velocity:    { en: "Fast mover",      ar: "سريع",                es: "Rápido",            fr: "Rapide" },
  repeat_visitor:   { en: "Repeat visitor",  ar: "زائر متكرر",          es: "Visitante recurrente", fr: "Visiteur récurrent" },
};

function humanizeType(type) {
  return String(type || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

const TriggerChip = ({ trigger, lang }) => {
  const label =
    TRIGGER_LABELS[trigger.type]?.[lang] ||
    TRIGGER_LABELS[trigger.type]?.en ||
    humanizeType(trigger.type);
  const severity = trigger.severity || "low";
  return <span className={`ud-kb-trigger ud-kb-trigger--${severity}`}>{label}</span>;
};
```

**Why:** Adds the two missing keys (`idle_lead`, `repeat_visitor`) + a future-proof fallback that turns any new lowercase-underscore enum into sentence-case automatically.

### 3 — `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css`

**Sweep:** Remove `text-transform: uppercase` from these rules (line numbers as of audit on 2026-05-13 — confirm with grep, line numbers may shift):

- Line 275 — section eyebrow style (sidebar group headers like "OVERVIEW" / "INTELLIGENCE")
- Line 292 — accent eyebrow (KPI card eyebrows)
- Line 499 — sidebar muted label
- Line 580 — secondary eyebrow
- Line 671 — meta label
- Line 990 — `.ud-section-label` (page section titles)
- Line 1221 — KPI subtitle eyebrow
- Line 3331 — `.ud-kb-trigger` (kanban trigger chips)

**Replace each with:**

```css
letter-spacing: 0.02em;
/* removed: text-transform: uppercase; */
```

If any rule already has `letter-spacing` set (e.g. line 3332 has `letter-spacing: 0.04em`), keep the existing value and just delete the `text-transform` line.

**Verify with PowerShell after edit:**

```powershell
Select-String -Path "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css" -Pattern "text-transform:\s*uppercase"
```

Expected: zero matches in dashboard-prefix selectors (`.ud-*`, `.ent-*` if any). If any remain, they should be inside non-dashboard scopes (admin, print, etc. — leave those alone for this PR).

### 4 — `functions/lib/briefTemplates.js`

**Add at the top, after `"use strict";`:**

```javascript
function pluralize(count, singular, plural) {
  const n = Number(count);
  return Number.isFinite(n) && n === 1 ? singular : plural;
}

const HOURS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "hour", "hours")}`,
  ar: (n) => `${n} ${pluralize(n, "ساعة", "ساعات")}`,
  es: (n) => `${n} ${pluralize(n, "hora", "horas")}`,
  fr: (n) => `${n} ${pluralize(n, "heure", "heures")}`,
};

const DAYS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "day", "days")}`,
  ar: (n) => `${n} ${pluralize(n, "يوم", "أيام")}`,
  es: (n) => `${n} ${pluralize(n, "día", "días")}`,
  fr: (n) => `${n} ${pluralize(n, "jour", "jours")}`,
};

const TAPS_LABEL = {
  en: (n) => `${n} ${pluralize(n, "tap", "taps")}`,
  ar: (n) => `${n} ${pluralize(n, "نقرة", "نقرات")}`,
  es: (n) => `${n} ${pluralize(n, "toque", "toques")}`,
  fr: (n) => `${n} ${pluralize(n, "interaction", "interactions")}`,
};

const ZERO_STATE_TEMPLATES = {
  en: {
    paragraph1:
      "Your private buyer experiences are warming up. The first VIP signals will appear here as soon as buyers tap their invitations and start exploring.",
    paragraph2:
      "Pipeline movement and marketplace activity refresh every cycle — once today's first interactions land, this brief will narrate them in real time.",
  },
  ar: {
    paragraph1:
      "تجارب المشترين الخاصة بك في طور الإحماء. ستظهر هنا أولى إشارات كبار الشخصيات بمجرد تفاعلهم مع دعواتهم.",
    paragraph2:
      "تتحدّث حركة خط الأنابيب ونشاط السوق في كل دورة — فور وصول أولى التفاعلات اليوم سيسرد هذا الموجز ذلك في الوقت الفعلي.",
  },
  es: {
    paragraph1:
      "Tus experiencias privadas para compradores se están calentando. Las primeras señales VIP aparecerán aquí en cuanto los compradores activen sus invitaciones.",
    paragraph2:
      "El movimiento del pipeline y la actividad del marketplace se refrescan cada ciclo — en cuanto lleguen las primeras interacciones de hoy, este resumen las narrará en tiempo real.",
  },
  fr: {
    paragraph1:
      "Vos expériences acheteurs privées montent en température. Les premiers signaux VIP apparaîtront ici dès que les acheteurs activeront leurs invitations.",
    paragraph2:
      "Le pipeline et l'activité du marketplace se rafraîchissent à chaque cycle — dès les premières interactions du jour, ce résumé les racontera en temps réel.",
  },
};

function isZeroState({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {} }) {
  const tapCount = Number(topVip.tapCount || 0);
  const newVipCount = Number(pipelineDelta.newVipCount || 0);
  const trafficDelta = Number(marketplaceTraffic.trafficDelta || 0);
  const anonVisitors = Number(marketplaceTraffic.anonVisitors || 0);
  const pipelineValue = String(pipelineDelta.pipelineDelta || "").replace(/[^0-9.-]/g, "");
  return (
    tapCount === 0 &&
    newVipCount === 0 &&
    trafficDelta === 0 &&
    anonVisitors === 0 &&
    (pipelineValue === "" || Number(pipelineValue) === 0)
  );
}
```

**Replace** the `VIP_SIGNAL_TEMPLATES` `rising` entries to use the helpers. Example for `en`:

```javascript
rising:
  "<span class=\"vip-name\">{name}</span> tapped {tapsLabel} in the last {hoursLabel} — {firstAction}. <span class=\"score-change\">Score now {score}</span> (was {prevScore} yesterday). {tone}",
```

And for `cooling`:

```javascript
cooling:
  "<span class=\"vip-name\">{name}</span> has gone {daysLabel} without engagement. Last action: {lastAction}. <span class=\"score-change\">Score dropped from {prevScore} to {score}</span>. {tone}",
```

Repeat the pattern for `ar`, `es`, `fr` — drop the bare `{tapCount} times in the last {hoursAgo} hours` / `{silentDays} days` phrasings, replace with `{tapsLabel}` / `{hoursLabel}` / `{daysLabel}`.

**Replace** the ASCII `->` (or ` - ` actually, audit it) with Unicode `→` in `PIPELINE_DELTA_TEMPLATES`. Current line 68 has ` - `:

```javascript
en: "Pipeline added <strong>{pipelineDelta}</strong> in qualified value today across {newVipCount} new VIPs. Marketplace traffic up {trafficDelta}% — {anonVisitors} anonymous visitors spent >3min on {topUnit}.",
```

Replace ` - ` with ` — ` (em-dash with spaces) in all four languages.

**Replace** the body of `generateBriefFromTemplate` to short-circuit on zero-state:

```javascript
function generateBriefFromTemplate({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {}, alerts = {}, lang = "en" }) {
  const language = VIP_SIGNAL_TEMPLATES[lang] ? lang : "en";

  // Zero-state branch — empty tenant, no demo data yet
  if (isZeroState({ topVip, pipelineDelta, marketplaceTraffic })) {
    const zero = ZERO_STATE_TEMPLATES[language] || ZERO_STATE_TEMPLATES.en;
    return {
      paragraph1: zero.paragraph1,
      paragraph2: zero.paragraph2,
      chips: computeChips({ alerts, lang: language }),
      source: "template",
      generatedAt: Date.now(),
      lang: language,
    };
  }

  const mode = topVip.mode || "plateau";
  const vipTemplate = VIP_SIGNAL_TEMPLATES[language][mode] || VIP_SIGNAL_TEMPLATES.en.plateau;
  const pipelineTemplate = PIPELINE_DELTA_TEMPLATES[language] || PIPELINE_DELTA_TEMPLATES.en;

  const tapCount = Number(topVip.tapCount ?? 0);
  const hoursAgo = Number(topVip.hoursAgo ?? 24);
  const silentDays = Number(topVip.silentDays ?? 0);

  const paragraph1 = fill(vipTemplate, {
    name: topVip.name || "Top VIP",
    tapsLabel: TAPS_LABEL[language](tapCount),
    hoursLabel: HOURS_LABEL[language](hoursAgo),
    daysLabel: DAYS_LABEL[language](silentDays),
    firstAction: topVip.firstAction || "reviewed premium listing details",
    score: topVip.score ?? 0,
    prevScore: topVip.prevScore ?? 0,
    lastAction: topVip.lastAction || "none",
    tone: chooseTone(mode, language),
  });

  const paragraph2 = fill(pipelineTemplate, {
    pipelineDelta: pipelineDelta.pipelineDelta || "$0",
    newVipCount: pipelineDelta.newVipCount ?? 0,
    trafficDelta: marketplaceTraffic.trafficDelta ?? 0,
    anonVisitors: marketplaceTraffic.anonVisitors ?? 0,
    topUnit: marketplaceTraffic.topUnit || "top unit",
  });

  return {
    paragraph1,
    paragraph2,
    chips: computeChips({ alerts, lang: language }),
    source: "template",
    generatedAt: Date.now(),
    lang: language,
  };
}
```

**Verify:** `pluralize`, `HOURS_LABEL`, `DAYS_LABEL`, `TAPS_LABEL`, `ZERO_STATE_TEMPLATES`, `isZeroState` all defined before `generateBriefFromTemplate`. `module.exports` unchanged (`{ generateBriefFromTemplate, computeChips }`).

### 5 — Global ASCII `->` → Unicode `→` sweep

**Files in scope (from grep on 2026-05-13):**

- `frontend/src/hooks/useDashboardData.js`
- `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`
- `frontend/src/i18n/portals/dashboard.js`
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` (comments only — leave or fix)
- `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx`
- `frontend/src/services/mockDashboardData.js`
- `frontend/src/i18n/pages/admin.js`
- `frontend/src/pages/UnifiedDashboard/components/__tests__/KpiCard.test.jsx` (test assertions — only if the string is part of an expected output, otherwise skip)

**Replace rules:**

- `' -> '` (space, dash, gt, space) → `' → '` (Unicode 2192 surrounded by spaces). This is the safe pattern — avoid matching code-comment `->` syntax or arrow-function `=>`.
- `'tap -> first action'` → `'tap → first action'` (and similar phrasings inside i18n value strings)
- `'Start tutorial ->'` → `'Start tutorial →'`

**Do NOT touch:**

- TypeScript/Flow type arrows `->` (not present in this codebase — JS only — but just in case)
- JSDoc `@returns` comments
- Test assertions where the literal `->` is intentionally being checked

**Verify with PowerShell:**

```powershell
Select-String -Path "frontend\src\**\*.js","frontend\src\**\*.jsx" -Pattern " -> " | Select-Object -First 50
```

Expected after sweep: only matches in code comments, test descriptions, or contexts where `->` is intentional (none expected in this codebase).

---

## i18n string updates

Sentence-case sweep on the dashboard portal i18n (`frontend/src/i18n/portals/dashboard.js`) — many strings are already sentence-case in the source (`navOverview: "Overview"`). The all-caps was coming from CSS. After §3 CSS fix, no i18n edits should be required for sentence case.

**Exception:** check for any string that's literally capitalized in source like `"OVERVIEW"`, `"HOT"`, `"COLD"`, `"AT RISK"`. Grep:

```powershell
Select-String -Path "frontend\src\i18n\**\*.js" -Pattern '"[A-Z]{4,}"'
```

If any found, convert to sentence case in the source string. The screenshot showed `AT RISK` — locate `atRisk:` value and confirm it's already `"AT RISK"` literally; if so → `"At risk"`.

For `dashboard.js:68` `atRisk: "AT RISK"` → change to `"At risk"`. (Verify with the grep — there may be additional all-caps source strings.)

---

## Verify steps (Windows PowerShell — Oguzhan's primary env)

After all edits, run in order from `C:\Users\oguzh\DynamicNFC`:

```powershell
# 1. Grep verifies — should each return zero or only intentional matches
Select-String -Path "frontend\src\components\UnifiedDashboard\TodaysBrief.jsx" -Pattern "wrapVipName|wrapScoreChange|highlightParagraph1|escapeHtml|escapeRegExp"
Select-String -Path "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css" -Pattern "text-transform:\s*uppercase"
Select-String -Path "frontend\src\**\*.js","frontend\src\**\*.jsx" -Pattern " -> "
Select-String -Path "frontend\src\i18n\**\*.js" -Pattern '"[A-Z]{4,}"'

# 2. Line-count verify on the two large files (>500L per Large File Protocol)
(Get-Content "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css").Length
Get-Content "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css" -Tail 20

# 3. Build verify
cd frontend
npm run build
cd ..

# 4. Test suite — must stay at 120 passing, 0 broken
cd frontend
npm test
cd ..
```

Expected:

- TodaysBrief grep → zero matches (all helpers removed).
- UnifiedLayout.css uppercase grep → no matches in `.ud-*` selectors.
- ASCII `->` grep → no matches in i18n string values (matches in code comments are fine).
- All-caps i18n grep → no matches.
- `npm run build` → PASS in <40s, no warnings about removed imports.
- `npm test` → 120 passing, 0 failures.

---

## QA scenarios (manual — must run before commit per `docs/QA_VERIFICATION_PROTOCOL.md`)

Boot `npm run dev`, log in as `info@dynamicnfc.help`, then for each scenario verify the listed assertion.

### Scenario A — Today's Brief, populated tenant, Canada region

1. Navigate to `/unified/overview`.
2. Confirm region selector reads "Canada".
3. Today's Brief paragraph 1 should render with **clean HTML** — VIP name styled in `--ud-text` weight 500, score-change phrase styled in `#185fa5` brand blue, no visible `<span>` tags, no `class="..."` text, no `score-change">` fragment anywhere on screen.

### Scenario B — Today's Brief, zero-state

1. Open browser DevTools → Application → IndexedDB / Firestore listeners.
2. Switch to a fresh tenant or reset demo: Settings tab → Reset Demo (NOT just region switch — actual reset).
3. After reset completes, Today's Brief should render the **warming-up zero-state copy** (English: "Your private buyer experiences are warming up…").
4. No `$0`, no "0 new VIPs", no "0 times in the last 1 hours" visible anywhere on Overview.

### Scenario C — Pipeline tab, IDLE_LEAD label

1. Navigate to `/unified/pipeline`.
2. Find a deal card with an idle trigger chip (typically a deal in `new_lead` or `contacted` stage with low recent activity — seed data has these in every region).
3. The chip should read **"Idle lead"** (or its translated equivalent: "عميل خامل" / "Lead inactivo" / "Prospect inactif"), styled like other trigger chips, **not** "IDLE_LEAD" or "idle_lead".

### Scenario D — Sentence case sweep

1. On `/unified/overview`, scan section eyebrows (above KPI groups, above Today's Brief, above Sales Triggers).
2. All eyebrows render in **sentence case**: "Overview", "Intelligence", "Operations", "System" — **not** "OVERVIEW" etc.
3. On `/unified/pipeline`, scan column headers ("New lead", "Contacted", "Viewing scheduled", …) — sentence case throughout.
4. Trigger chips on deal cards render in sentence case ("Pricing ×3", "Going cold", "Fast mover").
5. KPI subtitles read in sentence case ("Tap → first action", not "TAP -> FIRST ACTION").

### Scenario E — Language cycle integrity

1. Topbar language button: cycle EN → AR → ES → FR. (Note: topbar single-cycle is PR 2's job — for now AR/ES will need to be set via `localStorage.setItem('lang', 'ar')` + reload, or via whatever current UI exists.)
2. For each language, repeat Scenario A and Scenario B — confirm:
   - VIP name styling preserved
   - Score-change styling preserved
   - Zero-state copy renders in the active language
   - Pluralization works ("1 hour" not "1 hours" in EN; equivalent in AR/ES/FR)

### Scenario F — Existing functionality regression check (CLAUDE.md QA protocol)

1. Sales Trigger Panel on Overview — still renders, click → VIP CRM deeplink still works (Sprint 2 #2 functionality from 2026-05-11).
2. Five-Minute Proof tutorial — Settings → Replay tutorial still works (Sprint 2 #1 functionality).
3. Sidebar portal live signals — still show dot + count + time-ago (Sprint 2 #3 Part A from yesterday).
4. Region switch Canada → Gulf → USA → Mexico — all four still render, no console errors.

---

## Out of scope for this PR (PRs 2 and 3 handle these)

- **Topbar single-cycle language button** (EN→AR→ES→FR) — PR 2
- **SVG country flag replacing emoji `🇨🇦`** — PR 2
- **`:root` design tokens** (`--brand-blue`, `--ud-accent`, etc. exposed as CSS custom properties) — PR 2
- **Yellow/green palette drift** ($26.7M "Total Pipeline Value" green) — PR 2 (after tokens land)
- **Orphan full-viewport overlay at `z-index: 2147483646`** — PR 3
- **Tab-transition fade duration (6–8s → 300ms)** — PR 3
- **Mobile responsive deep-dive** — separate sprint, needs real-device test
- **Sprint 2 #3 Part B portal region-awareness bug** — separate directive

---

## Commit + deploy plan

```powershell
cd C:\Users\oguzh\DynamicNFC
git checkout -b polish/pr1-demo-killers-sweep

# … all edits …

git add frontend/src/components/UnifiedDashboard/TodaysBrief.jsx
git add frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx
git add frontend/src/pages/UnifiedDashboard/UnifiedLayout.css
git add functions/lib/briefTemplates.js
git add frontend/src/i18n/portals/dashboard.js
# (plus any other -> arrow files touched)

git commit -m "polish(dashboard): kill demo-killers + sentence case + unicode arrows

- Remove TodaysBrief wrapVipName/wrapScoreChange (double-wrapping caused HTML leak)
- Add idle_lead + repeat_visitor to KanbanBoard trigger labels + humanize fallback
- Add zero-state branch + pluralization to briefTemplates
- Drop text-transform:uppercase from .ud-* selectors per sentence-case rule
- Replace ASCII '->' with Unicode → across dashboard surface

Closes critique findings 1-4 from docs/UNIFIED_DASHBOARD_CRITIQUE_2026_05_13.md"

cd frontend
npm run build
cd ..
firebase deploy --only hosting
# If functions/lib/briefTemplates.js was touched:
firebase deploy --only functions:refreshDailyBriefAi
```

Production smoke test after deploy: repeat Scenarios A, C, D in the live URL.

---

## Notes for the executor

- This is a **polish-only PR**. No feature work, no schema changes, no new components, no Firestore writes. If you find yourself adding more than one new file, stop and re-read the directive.
- Files >500 lines touched: `UnifiedLayout.css` (~6500L) — follow the Large File Protocol: line count + `Get-Content -Tail 40` + `npm run build` after edit.
- The `briefTemplates.js` is in `functions/` — that's the Cloud Functions tree. Edits there require `firebase deploy --only functions` to take effect. The frontend `TodaysBrief.jsx` already calls the function (or template fallback) via `useDashboardData`'s brief loader — that pipeline does not need changes.
- If the test suite (`npm test`) breaks because a test asserted on the old `wrapVipName` behavior or the old all-caps strings, **update the test** rather than reverting the fix. The new behavior is the spec.
- Update `CLAUDE_HANDOFF.md` after merge with a `▶︎ RESUME HERE` block summarizing the PR and listing PR 2 (topbar + tokens) as the next move.

---

## After this PR ships

Next directive (PR 2): topbar single-cycle language + SVG flags + `:root` design tokens. Critique recommends this second because it unblocks region-aware theming. Draft will be written by Claude after PR 1 audit passes.

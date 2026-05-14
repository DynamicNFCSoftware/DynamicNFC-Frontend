# Cursor Directive — Unified Dashboard Demo-Killer Sweep

**Date:** 2026-05-13
**Author:** Claude (architecture) → Cursor (implementation)
**Scope:** 4 demo-killer bugs surfaced in the 2026-05-13 dashboard critique
**Source critique:** `docs/UNIFIED_DASHBOARD_CRITIQUE_2026_05_13.md`
**Branch suggestion:** `polish/dashboard-demo-killers-2026-05-13`
**Estimated diff:** ~6 files, ~80 lines net change (most are deletions)

---

## Why this matters

Any of these 4 bugs visible during a live demo destroys trust in 4 seconds. Combined fix is < 1 day of work and unblocks the pilot pitch for all 4 regions.

---

## Fix 1 — score-change HTML leak

### Root cause

`briefTemplates.js:9-42` already produces fully-wrapped HTML in 4 languages:

```js
rising: "<span class=\"vip-name\">{name}</span> tapped {tapCount} times … <span class=\"score-change\">Score now {score}</span> (was {prevScore} yesterday). {tone}"
```

`TodaysBrief.jsx:82-104` then re-wraps with regex-based wrap functions:

```js
function wrapScoreChange(paragraph) {
  const explicit = /(score\s*(?:now)?[^.]*\.)/i;  // matches "score" inside "score-change"!
  if (explicit.test(text)) {
    return text.replace(explicit, `<span class="score-change">$1</span>`);
  }
  ...
}
```

The regex `score\s*(?:now)?[^.]*\.` matches the literal characters `score-change">Score now 72 (was 64 yesterday).` (starting from the "score" inside `score-change`). The replace wraps the matched span inside another span — producing nested broken HTML which DOMPurify then partially repairs, leaving the visible artifact `score-change">Score now 72…` as a text node.

Secondary issue: the wrap functions only match English keywords (`score`, `now`). They were already non-functional in AR / ES / FR briefs.

### Fix

`frontend/src/components/UnifiedDashboard/TodaysBrief.jsx`:

1. **Delete** `wrapVipName` (lines 82–88), `wrapScoreChange` (lines 90–99), `highlightParagraph1` (lines 101–104), `escapeRegExp` (lines 69–71), `escapeHtml` (lines 73–80).
2. Replace the `paragraph1` memo (lines 177–180) with:

   ```js
   const paragraph1 = useMemo(() => asText(normalized.paragraph1), [normalized.paragraph1]);
   ```

3. Keep `DOMPurify.sanitize(paragraph1 || "", SANITIZE_CONFIG)` exactly as-is (lines 183–186). The template's HTML flows straight through.
4. `SANITIZE_CONFIG` already allows `<span class>` — no change needed.

### CSS hygiene

`frontend/src/pages/UnifiedDashboard/UnifiedLayout.css`:

- Line 6266 (`.ud-todays-brief__paragraph .vip-name`) — keep, this matches template output.
- Line 6271 (`.ud-todays-brief__paragraph .score-change`) — keep.
- Line 6281–6283 (`.ud-todays-brief__vip-name`) — **delete**, orphan selector (the old wrap function's class, no longer produced).
- Line 6285–6287 (`.ud-todays-brief__score-change`) — **delete**, orphan selector.

### Why this is safe

- AR / ES / FR briefs were already passing through unmodified (regex only matched English). No regression in those locales.
- LLM-generated briefs from `aiBriefGenerator.js` produce the same `<span class>` shape (verify in that file — if not, add the spans there too rather than reintroducing the regex).
- DOMPurify config already permits the necessary tags / attrs.

---

## Fix 2 — IDLE_LEAD raw enum on Pipeline cards

### Root cause

`sectorConfig.js:680, 694` produces trigger objects with `type: "idle_lead"` and `type: "repeat_visitor"`.

`KanbanBoard.jsx:30–37` `LABELS` map only contains:

```js
const LABELS = {
  pricing_3x: { en: "Pricing ×3", ar: "…", es: "…", fr: "…" },
  // … other entries up to high_velocity at line 36
  high_velocity: { en: "Fast mover", ar: "…", es: "…", fr: "…" },
};
const label = LABELS[trigger.type]?.[lang] || LABELS[trigger.type]?.en || trigger.type;
```

`idle_lead` and `repeat_visitor` fall through to the raw `trigger.type` fallback. CSS `.ud-kb-trigger` at line 3331 then applies `text-transform: uppercase` → renders as `IDLE_LEAD`.

### Fix

`frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx` line 30–37 — extend the `LABELS` map:

```js
const LABELS = {
  pricing_3x: { en: "Pricing ×3", ar: "تسعير ×3", es: "Precio ×3", fr: "Prix ×3" },
  // ... existing entries ...
  high_velocity: { en: "Fast mover", ar: "سريع", es: "Rápido", fr: "Rapide" },
  idle_lead: { en: "Idle lead", ar: "عميل خامل", es: "Lead inactivo", fr: "Lead inactif" },
  repeat_visitor: { en: "Repeat visitor", ar: "زائر متكرر", es: "Visitante recurrente", fr: "Visiteur récurrent" },
};
```

### CSS fix on the same chip

`frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` line 3331 — remove `text-transform: uppercase` from `.ud-kb-trigger`:

```css
/* Before */
.ud-kb-trigger { font-size: 9px; font-weight: 700; text-transform: uppercase; … }

/* After */
.ud-kb-trigger { font-size: 11px; font-weight: 500; … }
```

Also bump font-size 9 → 11 (9px violates the readability floor) and weight 700 → 500 (matches the house rule "two weights only: 400 / 500").

### Cross-check

Search for every component that consumes a `trigger.type` field and verify all enum values produced by `sectorConfig.js` have a label entry. Run:

```powershell
# PowerShell
Select-String -Path "frontend\src\config\sectorConfig.js" -Pattern "type:\s*[`"']" | ForEach-Object { $_.Matches.Value }
```

Every value returned must exist as a key in `KanbanBoard.LABELS` AND in any other consumer (`BehavioralTimeline`, `ExportPDF`, `FunnelInsightTable`).

---

## Fix 3 — Zero-state + plural in briefTemplates.js

### Root cause

`functions/lib/briefTemplates.js:118-152` does naive substitution:

- `{tapCount} times in the last {hoursAgo} hours` → produces "0 times in the last 1 hours" when tapCount=0, hoursAgo=1
- `Pipeline added {pipelineDelta}` → produces "$0" with no zero-state branch
- `{anonVisitors} anonymous visitors spent >3min on {topUnit}` → renders even when anonVisitors=0

No conditional and no pluralization rule for any of the 4 languages.

### Fix

Add a zero-state branch at the top of `generateBriefFromTemplate` and a 4-language `ZERO_STATE_TEMPLATES` map.

`functions/lib/briefTemplates.js` — insert after `VIP_SIGNAL_TEMPLATES` (around line 42):

```js
const ZERO_STATE_TEMPLATES = {
  en: {
    paragraph1: "No VIP activity logged in the last 24 hours. Briefing resumes when the first tap arrives.",
    paragraph2: "Pipeline and marketplace tracking are live — signals will appear here as buyer journeys begin.",
  },
  ar: {
    paragraph1: "لا يوجد نشاط VIP مسجل في آخر 24 ساعة. ستستأنف الإحاطة عند وصول أول نقرة.",
    paragraph2: "تتبع خط الأنابيب والسوق نشط — ستظهر الإشارات هنا عند بدء رحلات المشترين.",
  },
  es: {
    paragraph1: "Sin actividad VIP registrada en las últimas 24 horas. La sesión informativa se reanudará cuando llegue el primer toque.",
    paragraph2: "El seguimiento del pipeline y del marketplace está activo — las señales aparecerán aquí cuando comiencen los recorridos de los compradores.",
  },
  fr: {
    paragraph1: "Aucune activité VIP enregistrée durant les 24 dernières heures. Le briefing reprendra dès la première interaction.",
    paragraph2: "Le suivi du pipeline et du marketplace est actif — les signaux apparaîtront ici dès le début des parcours acheteurs.",
  },
};

function isZeroState({ topVip = {}, pipelineDelta = {} }) {
  const taps = Number(topVip.tapCount || 0);
  const newVips = Number(pipelineDelta.newVipCount || 0);
  const delta = String(pipelineDelta.pipelineDelta || "").replace(/[^0-9.-]/g, "");
  return taps === 0 && newVips === 0 && (delta === "" || Number(delta) === 0);
}

function pluralize(n, singular, plural) {
  return Number(n) === 1 ? singular : plural;
}
```

Then in `generateBriefFromTemplate` (line 118), early-return when zero-state:

```js
function generateBriefFromTemplate({ topVip = {}, pipelineDelta = {}, marketplaceTraffic = {}, alerts = {}, lang = "en" }) {
  const language = VIP_SIGNAL_TEMPLATES[lang] ? lang : "en";

  if (isZeroState({ topVip, pipelineDelta })) {
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

  // ... existing fill logic ...
}
```

### Plural rule for hours

In the `paragraph1` fill (line 124), pass a localized `hoursAgoLabel` instead of bare `hoursAgo`:

```js
const hoursAgoLabel = (() => {
  const n = Number(topVip.hoursAgo ?? 24);
  const dict = {
    en: { 1: "1 hour", n: `${n} hours` },
    ar: { 1: "ساعة واحدة", n: `${n} ساعات` },
    es: { 1: "1 hora", n: `${n} horas` },
    fr: { 1: "1 heure", n: `${n} heures` },
  };
  return (dict[language] || dict.en)[n === 1 ? 1 : "n"];
})();
```

Then change the `{hoursAgo}` token in `VIP_SIGNAL_TEMPLATES.rising` (and `paragraph1` fill arg) from `{tapCount} times in the last {hoursAgo} hours` to `{tapCount} taps over {hoursAgoLabel}` — the entire localized phrase comes in pre-rendered.

Apply the same pluralization to `silentDays` in the `cooling` template and `tapCount` in `rising`/`plateau`.

### Why this matters

The current zero-state copy actively damages the demo by reading like a failure narrative. The new copy reframes "no data yet" as "tracking is alive, awaiting first signal" — which is the actual product story per CLAUDE.md "Identity precedes Action."

---

## Fix 4 — Sentence case sweep + Unicode arrow

### Scope

- 15 instances of `text-transform: uppercase` in `UnifiedLayout.css`
- 24 instances of ASCII `->` across the dashboard surface

### Sentence-case rule

CLAUDE.md: "**Sentence case** always. Never Title Case, never ALL CAPS."

### Audit step (Cursor does this first)

```powershell
# PowerShell
Select-String -Path "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css" -Pattern "text-transform:\s*uppercase" -Context 4,1 | Out-File "tmp\uppercase-audit.txt"
```

For each match: read 4 lines of context, identify the selector. Decide:

- **Eyebrow / overline labels** (`.ud-section-eyebrow`, `OVERVIEW` / `INTELLIGENCE` etc.) → remove `text-transform: uppercase`, write the source string in sentence case (`Overview`, `Intelligence`). Letter-spacing can stay if it gives the editorial feel.
- **Kanban column headers** (`NEW LEAD`, `CONTACTED` etc.) → remove `text-transform: uppercase`. Source strings are already capitalized labels — write as `New lead`, `Contacted`, `Viewing scheduled`, `Viewing done`, `Negotiation`, `Offer sent`, `Closed won`.
- **Trigger chips** (`HOT`) → remove `text-transform: uppercase`. Source string → `Hot`.
- **Status / score badges** → same.
- **Acronyms** (`NFC`, `VIP`, `ROI`, `AI`) — keep ALL CAPS in source strings. These are legitimate brand acronyms, not stylistic ALL CAPS.

For Kanban stage labels specifically, check whether the source strings live in:
- `frontend/src/i18n/pages/*` (per-language stage labels) — update each language to sentence case
- A constant inside the component — update inline

Run after each change:

```bash
# bash (WSL)
grep -rn "text-transform:\s*uppercase" frontend/src/pages/UnifiedDashboard/UnifiedLayout.css | wc -l
```

Target: reduce from 15 → ~2-3 (only acronym-only contexts like maybe a brand wordmark, if any).

### Arrow sweep

ASCII `->` is in body copy of KPI subtitles (`tap -> first action`), tutorial CTA (`Start tutorial ->`), and likely the `ud-todays-brief__paragraph` template (in `VIP_SIGNAL_TEMPLATES` — note the `-` in "the last {hoursAgo} hours - {firstAction}"; that's a hyphen, not an arrow, but should become an em-dash `—`).

Do a targeted sweep:

```powershell
# PowerShell — find every ASCII -> in JS/JSX source files
Select-String -Path "frontend\src\**\*.{js,jsx}" -Pattern " -> "
```

For each hit: review context. Replace with Unicode `→` (U+2192) **only when it represents a flow/transition arrow**. Don't replace `--` (dash) or `->` inside comments or JSDoc.

Likely files needing edits:
- `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` (KPI subtitles, tutorial CTA)
- `frontend/src/i18n/pages/*.js` (any localized KPI labels with arrows)
- `functions/lib/briefTemplates.js` — change the ` - ` hyphen to ` — ` em-dash in `rising` / `cooling` / `plateau` templates (4 languages each)

---

## Verification

Run all of the following before opening the PR:

```powershell
# 1. Build passes
cd frontend
npm run build

# 2. No remaining double-wrap risk — these should return zero matches:
cd ..
Select-String -Path "frontend\src\components\UnifiedDashboard\TodaysBrief.jsx" -Pattern "wrapVipName|wrapScoreChange|highlightParagraph1"
# Expected: 0 hits

# 3. KanbanBoard LABELS coverage
Select-String -Path "frontend\src\config\sectorConfig.js" -Pattern "type:\s*[`"'](\w+)" -AllMatches
# Every captured value must exist in KanbanBoard.LABELS

# 4. ALL-CAPS sweep result
(Select-String -Path "frontend\src\pages\UnifiedDashboard\UnifiedLayout.css" -Pattern "text-transform:\s*uppercase").Count
# Expected: ≤ 3 (down from 15)

# 5. ASCII arrow sweep result inside frontend/src (excluding node_modules, test files, comments)
(Select-String -Path "frontend\src\**\*.{js,jsx}" -Pattern " -> " -SimpleMatch).Count
# Expected: 0
```

Then manual QA in a logged-in browser per `docs/QA_VERIFICATION_PROTOCOL.md`:

1. Open `/unified/overview` in each of EN / AR / ES / FR. Confirm Today's brief renders clean (no literal `score-change">` text).
2. Switch region: Gulf → USA → Mexico → Canada. Brief should re-fetch and render in each region's primary language.
3. Open `/unified/pipeline`. Confirm no `IDLE_LEAD` or `REPEAT_VISITOR` raw enums on any deal card. Trigger chips read as `Idle lead`, `Repeat visitor`, etc.
4. Force zero-state: in Firestore console, set `tenants/{your-uid}/aggregates/dailyBrief` to `{}` or delete it. Reload. Brief must show the new "tracking is live, awaiting first signal" copy, not "$0 / 0 hours" garbage.
5. All eyebrow labels (`Overview`, `Intelligence`, `Operations`, `System`, `Vip sessions`, `Website visitors`, `Viewings booked`, `Sales pipeline`, stage names, `Hot`) render sentence case.
6. All KPI subtitle arrows render as `→` (Unicode) not `->` (ASCII).
7. `npm run build` PASS. No new console errors in browser devtools.

---

## Out of scope (separate PRs)

- Topbar `EN | FR` two-button → single-cycle `EN→AR→ES→FR` ([Fix 5 in critique])
- Country selector `🇨🇦` emoji flag → SVG flag ([Fix 5 in critique])
- Palette tokenization at `:root` ([Fix 3 in critique priority list])
- Hidden full-viewport overlay at z-index 2147483646 ([Fix 5 in critique])
- Card single-side border + rounded-corner violation on Sales Triggers cards
- Mobile responsive breakpoint verification

These go into a follow-up directive once Fix 1–4 ship clean.

---

## Rollback plan

All 4 fixes are pure deletions or additive (LABELS extension, ZERO_STATE branch). If anything regresses:

1. Revert `TodaysBrief.jsx` to restore wrap functions (the broken render returns, but no crash).
2. Revert `KanbanBoard.jsx` LABELS extension (raw enums return on idle/repeat — visible bug, no crash).
3. Revert `briefTemplates.js` zero-state branch (template returns the garbage copy — visible bug, no crash).
4. Revert CSS uppercase removal (visual regression only, no functional break).

No data migrations, no Firestore schema changes. Safe to ship behind a single PR with a one-commit revert path.

---

## Estimated effort

| Fix | Files | Lines | Risk |
|---|---|---|---|
| 1. score-change | TodaysBrief.jsx + UnifiedLayout.css | ~40 deletions | Low |
| 2. IDLE_LEAD | KanbanBoard.jsx + UnifiedLayout.css | +10 / -2 | Low |
| 3. zero-state | briefTemplates.js | +50 | Medium (4-lang parity) |
| 4. sentence case + arrows | UnifiedLayout.css + i18n files + briefTemplates.js | ~30 edits | Low (cosmetic) |

Total: ~half a day for a careful pass with manual QA. One PR, one reviewer.

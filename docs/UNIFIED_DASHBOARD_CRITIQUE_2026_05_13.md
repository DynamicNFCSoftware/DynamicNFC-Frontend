# Design Critique — Unified Dashboard

**Date:** 2026-05-13
**Surface:** `/unified/overview` + `/unified/pipeline`
**Region:** Canada
**Sector:** Real Estate
**Theme:** Light mode
**Stage:** Final polish
**Focus:** Usability, Visual hierarchy, Consistency, Accessibility
**Reviewer:** Claude (Cowork session, live DOM inspection via Claude in Chrome)

---

## Overall impression

The shell is genuinely close — sidebar rhythm, KPI card spacing, Playfair display on numerals, the blue/red brand restraint in the topbar all read luxury. But three things are stopping it from being "final polish": a literal HTML fragment is leaking into user-facing copy on Overview, the topbar drifts from the LOCKED spec (2-button language + emoji flag instead of a single-cycle), and design tokens aren't actually exposed at `:root` (so region theming has no surface to swap into). Fix those three and the rest is small.

---

## Usability

| Finding | Severity | Recommendation |
|---|---|---|
| `Today's brief` shows raw HTML: `…score-change">Score now 72 (was 64…` — the closing fragment of an HTML attribute is rendered as visible text | 🔴 Critical | Find the i18n string or template that interpolates a score-delta span. It's almost certainly a `<span class="score-change">…</span>` that lost its opening tag during a string concat. Sanitize at the i18n layer, render through React children instead of `dangerouslySetInnerHTML` |
| `Pipeline added $0 in qualified value today across 0 new VIPs. Marketplace traffic up 0%` — the brief reads as a failure narrative when the tenant simply has no data yet | 🔴 Critical | Detect zero-state across the brief generator and swap to a "warming up" / "no activity yet today" empty state. Right now the empty state actively damages the demo |
| Pipeline column `IDLE_LEAD` shows the raw enum constant in uppercase + underscore on a deal card | 🔴 Critical | Run all stage/status enums through a label map before render. `IDLE_LEAD` → `Idle lead` |
| `Top VIP tapped 0 times in the last 1 hours` — singular/plural ungrammatical | 🟡 Moderate | Pluralize: `1 hour` / `N hours`. Also reconsider showing "0 times" as a brief headline — that's a non-event |
| 24 instances of ASCII arrow `->` in body copy (`tap -> first action`, `silence -> next tap`, `anon -> identified`, `Start tutorial ->`) | 🟡 Moderate | Global replace `->` with `→` (U+2192). The arrow is in 6+ KPI cards and the tutorial CTA |
| Country selector renders flag emoji `🇨🇦` | 🟡 Moderate | CLAUDE.md says no emoji, plus regional emoji flags don't render on Windows by default. Swap to an inline SVG flag or a 2-letter code chip (`CA`) — `CA` is already shown next to "Canada" so the emoji is redundant |
| Pipeline shows 7 columns but the page horizontally scrolls at 1568px wide | 🟡 Moderate | At 1440 (typical desk laptop) you'll only see ~4 columns at a time. Consider collapsing low-value columns (Closed Won) or letting the user pick which stages to show |
| KPI cards with no data render as a thin `—` em-dash with no clue about what's coming | 🟡 Moderate | Empty state should say "Awaiting first tap" or similar — the em-dash + label `tap -> first action` reads like a config screen, not an empty dashboard |
| `Total Pipeline Value $26,700,000` rendered in green | 🟢 Minor | Green isn't in your documented palette (`#e63946 / #c1121f / #457b9d / #6ba3c7 / charcoal`). Use brand red or charcoal for the headline number; reserve color for direction/delta indicators |
| `VIP CRM2` reads as one phrase to screen readers (count badge "2" is in the same text node as the label) | 🟢 Minor | Split: `<span>VIP CRM</span><span aria-label="2 unread">2</span>` or use `aria-describedby` for the count |

---

## Visual hierarchy

- **What draws the eye first:** the three large Playfair numerals (`2 / 6 / 2`) in the KPI strip. That's correct — those are the headline metrics. The red/blue/green color coding is also doing its job in 200ms.
- **Reading flow:** top KPIs → "Five-Minute Proof" CTA → "Today's brief" → Sales Triggers list. That's a clean Z-pattern and matches what a sales rep would scan.
- **Emphasis problems:**
  - The h1 page title `CRM Intelligence Center` is `Playfair 18px / 500 / #555` — at the same size as h3 section headings (17px), so the page title doesn't actually look like a title. Push h1 to 22px and h2/h3 below it.
  - On the Sales Triggers card, the **score** (`55` in a navy chip) is shouting visually but the **HOT** label (the actually-actionable sales signal) is whisper-gray text. The hierarchy is backwards — `HOT` should be the dominant chip, score should be a quiet supporting number.
  - "OVERVIEW" / "INTELLIGENCE" / "OPERATIONS" / "SYSTEM" all-caps eyebrows pull more weight than they should. Sentence case (`Overview`, `Intelligence`) per the house rule will quiet them.

---

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Topbar language buttons | `EN \| FR` — two separate buttons. CLAUDE.md spec says **single button that cycles EN→AR→ES→FR**. AR and ES are completely missing from the surface | This is a LOCKED-pattern violation. Replace with the single-cycle button immediately — Arabic + Spanish are first-class market requirements per the 4-equal-primaries rule |
| Design tokens | `getComputedStyle(:root).getPropertyValue('--brand-blue' / '--ud-accent' / '--ud-bg' / '--ud-text')` all return empty strings. No tokens are exposed | The region-aware token swap pattern described in CLAUDE.md ("pages consume them via `useRegion()`") has nothing to consume. Expose the documented palette as CSS custom properties on `:root` (or `[data-region="canada"]` etc.) so region switching can actually retint the UI |
| KPI numeral colors | Red / blue / green — green isn't in the brand palette | Pick a third accent from the documented set (light blue `#6ba3c7`?) or use neutral charcoal. Don't invent a green |
| Sentence case rule | "OVERVIEW", "INTELLIGENCE", "OPERATIONS", "SYSTEM", "VIP SESSIONS", "WEBSITE VISITORS", "VIEWINGS BOOKED", "SALES PIPELINE", "NEW LEAD", "CONTACTED", "VIEWING SCHEDULED", "VIEWING DONE", "NEGOTIATION", "OFFER SENT", "CLOSED WON", "HOT" all-caps | Per the house rule: "**Sentence case** always. Never Title Case, never ALL CAPS." This is the single biggest consistency drift on the dashboard — sweep all section labels and stage names |
| Card corners + accent borders | Sales Triggers cards have rounded corners with a single-side red `border-left` | CLAUDE.md rule: "No rounded corners on single-sided borders." Either drop the radius on those cards or change the red accent into a full-frame outline / inner badge |
| Arrow glyph | `->` ASCII in 24 places (KPI subtitles, tutorial CTA) | Unicode `→` everywhere |
| Em-dash usage | `36 - Cold Lead`, `55 - Warm Lead` use hyphen-space-hyphen | Use em-dash with hair-spaces: `36 — Cold lead`. Also sentence-case the label |
| `NFC ROI —` chip near "Today's brief" | The trailing em-dash looks like text, but appears to be the remove-filter affordance | Use a clear `×` icon for removal; em-dash reads as continuation |
| Skeleton loading | Tab navigation triggers a multi-second fade-in where every element renders at ~25% opacity for several seconds. On Pipeline it took 6–8s before content was visibly readable | The morph-loader / fade transition is too long. Cap at 300ms or replace with discrete skeleton blocks for the slow-loading regions only |

---

## Accessibility

- **Color contrast** — h1 `#555` on `#faf8f5` cream measures **7.46:1**, technically AAA, but it *looks* low-contrast because the 18px serif at weight 500 has thin strokes. Pushing the h1 to true `--color-text-primary` charcoal (`#1a1a1f`) would solve both contrast perception and hierarchy in one move.
- **Sidebar items** `#475569` on cream — **8.6:1**, pass.
- **Sub-section text** in the Today's brief ("score now 72…") is wrapped in faded gray at ~`#999`-ish weight — getting close to the **4.5:1** AA floor for body text. Verify and bump.
- **Hidden overlay**: a transparent `<div style="z-index: 2147483646; opacity: 0; width: 100vw; height: 100vh">` is sitting on top of the entire viewport after page load. It's pointer-events likely passes through but worth auditing — that's MAX_INT-1 z-index, almost certainly leftover from a modal/loader unmount that didn't fully remove its scrim node.
- **Mobile responsive**: viewport resize to 768px and 375px produced identical desktop-layout renders — no breakpoints visibly fired. Either CSS media queries aren't targeting these widths, or the sidebar+topbar lock at desktop dimensions and overflow horizontally. **Needs manual confirmation on a real device** before pilot.
- **Screen reader**: `VIP CRM2` is read as one phrase (label + count badge concatenated). Split into two elements with proper aria.
- **Touch targets**: the language `EN`/`FR` buttons render at roughly 32px — borderline for 44×44 target guidance. Once they collapse to single-cycle, give the button proper padding.

---

## What works well

- The KPI strip is genuinely well-designed — Playfair numerals, tiny color-matched sparklines, eyebrow + headline + subtext rhythm. This is the strongest single component on the page.
- "Today's brief" framing matches the "Identity precedes Action" mantra — narrative copy beats vanity metrics. Once the broken HTML and zero-state are fixed, this is the sharpest demo asset on the page.
- Sidebar information architecture is clean: sector switcher → tenant project → grouped sections → portal links + account. The hierarchy reads correctly on first scan.
- Brand blue `#457b9d` is present on the "Powered by DynamicNFC Intelligence" badge and the `AI-ranked` chip — proves the palette is alive in code, just not yet tokenized.
- The Pipeline kanban shape (column header + colored underline accent + card count) is restrained and luxury-feeling — much better than the standard CRM kanban-with-shadows look.

---

## Priority recommendations

1. **Kill the three demo-killers before anything else** — (a) the `score-change">…` HTML leak in Today's brief, (b) the `IDLE_LEAD` raw enum in Pipeline, (c) the brutal zero-state copy ("Pipeline added $0…", "0 times in the last 1 hours"). Any prospect watching a demo will lose trust in 4 seconds when they see literal markup or `IDLE_LEAD` on screen. These are a single sprint of polish.

2. **Restore the topbar LOCKED spec** — replace `EN | FR` two-button with the single-cycle EN→AR→ES→FR control specified in CLAUDE.md, and replace the `🇨🇦` flag emoji with an SVG flag. Arabic and Spanish are absent from a market explicitly called "first-class primary" — that's a credibility gap with Gulf and Mexico prospects.

3. **Tokenize the palette at `:root`** — expose `--brand-blue: #457b9d`, `--brand-red: #e63946`, `--ud-bg`, `--ud-text`, `--ud-text-muted`, `--ud-border`, `--ud-accent` as CSS custom properties. Without this, the region-aware token swap (Gulf gold, Canada navy, etc.) has nowhere to write. Right now the design system is documented in markdown but invisible in computed styles.

4. **Sweep sentence case** — every ALL-CAPS label on the dashboard (eyebrows, stage names, "HOT" badges). One PR, low-risk, big aesthetic shift toward the editorial-luxury feel. Pair with the `->` → `→` global replace.

5. **Fix the hidden full-viewport overlay** at `z-index: 2147483646` and shorten the post-navigation fade — content shouldn't take 6+ seconds to come out of a 25%-opacity state. This is the thing that made the page look broken on first load.

---

## Suggested PR grouping

- **PR 1 — Polish sweep** (recommendations 1 + 4 + arrow glyph replace): demo-killers + sentence case + `->` → `→`. Low-risk, high visible-impact.
- **PR 2 — Topbar + tokens** (recommendations 2 + 3): topbar single-cycle language, SVG flag, palette tokenization. Unblocks region theming.
- **PR 3 — Loader cleanup** (recommendation 5): kill the orphan overlay node, cap fade transitions at 300ms.

---

## Out of scope for this critique (next pass)

- VIP CRM tab — not opened in this session
- Campaigns tab — not opened in this session
- Settings tab — not opened in this session
- Dark mode rendering — light mode only
- Other regions (Gulf, USA, Mexico) — only Canada inspected
- Other sectors (Automotive, Yacht) — only Real Estate inspected
- Mobile responsive — automated viewport resize was inconclusive; needs real-device test

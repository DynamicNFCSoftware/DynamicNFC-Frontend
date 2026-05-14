# Marketplace Portal — Audit + Cursor Directive (Combined)

**Date:** 2026-05-13
**Surface:** `/enterprise/crmdemo/marketplace` (component: `frontend/src/pages/MarketplacePortal/MarketplacePortal.jsx`)
**Region tested:** Gulf
**Audience:** Anonymous public traffic (no NFC card, no auth)
**Funnel role:** Top-of-funnel — broadest reach, conversion target
**Companion docs:** `VIP_PORTAL_KHALID_AUDIT_2026_05_13.md`, `AHMED_PORTAL_AUDIT_AND_DIRECTIVE_2026_05_13.md`
**Branch suggestion:** `polish/marketplace-portal-conversion-2026-05-13`
**Estimated effort:** ~1.5 days (similar to Khalid — different architecture, less code reuse from Khalid PR)

---

## 30-second summary

The Marketplace serves a fundamentally different audience than Khalid/Ahmed — anonymous visitors with no NFC card who may never become identified leads. The page architecture reflects this:

- **No persona personalization** — h1 is the project name "Vista Residences", not a "Welcome, [Name]"
- **Lead gate mechanic** — 5 of 13 tracked events are behind `requireLead()` wrapper that pops a name+email form before letting users see brochures, floor plans, pricing, payment plans, or booking
- **Lighter visual register** — cream/light base with charcoal accents (vs Khalid's dark luxury with gold, Ahmed's dark with teal). Appropriate — anonymous catalogue browsing, not VIP curated experience
- **Conversion-focused page structure** — hero → stat strip → unit cards (with "Register for exact pricing" hooks) → amenities → final CTA "Ready to Take the Next Step?"
- **Pricing presentation** — "From AED 12M" (not exact like Khalid's "AED 12.5M") + "Register for exact pricing" sub-text. Smart: shows price range to qualify intent, withholds precision to drive lead capture.

**This is good funnel design.** The architecture is correct; what needs fixing is execution polish. Same 8 fixes from the Khalid sweep apply (fonts, emoji icons, RTL, palette, fade, sentence case, ASCII arrows), plus three Marketplace-specific items: lead gate form quality, conversion CTAs, and funnel-tracking dashboard integration.

---

## The funnel math (why tracking quality matters most here)

The Marketplace is the only surface where the dashboard can compute true **funnel conversion rates** because all 13 events represent funnel stages:

```
marketplace_visit                          (top of funnel — anonymous landings)
    ↓ (visit-to-engagement rate)
view_unit                                  (visitor clicks a property card)
    ↓ (engagement-to-intent rate)
lead_form_shown                            (visitor clicks brochure/pricing/booking — gated)
    ↓ (form-shown-to-captured rate)
lead_captured                              (visitor submits name + email)
    ↓ (lead-to-high-intent rate)
view_floorplan / download_brochure /
explore_payment_plan / request_pricing     (post-lead actions)
    ↓ (high-intent-to-booking rate)
book_viewing                               (lead schedules a viewing — bottom of funnel)
```

Dashboard can derive:
- **Visit → Lead conversion rate** = `count(lead_captured) / count(marketplace_visit)`
- **Lead → Booking conversion rate** = `count(book_viewing) / count(lead_captured)`
- **Drop-off by gate trigger** = which actions trigger `lead_form_shown` most, and which convert to `lead_captured`

These are the metrics that justify NFC card spend to a luxury developer. Protect them.

---

## 🔒 Tracking Preservation Contract — 13 events

Same contract rules as Khalid/Ahmed directives (do not delete, do not refactor away, do not replace handlers). The 13 events:

| # | Event | Source line | Triggered by | Funnel role |
|---|---|---|---|---|
| 1 | `marketplace_visit` | 489 | `useEffect` on mount | Top of funnel |
| 2 | `cta_browse` | 596 | Hero primary "View Collection" | Engagement signal |
| 3 | `filter_units` | 616 | Filter tabs (All / Penthouse / 3bed / 2bed) — **NEW vs VIP portals** | Browsing intent |
| 4 | `view_unit` | 528 | Property card click | Engagement signal |
| 5 | `comparison_view` | 521 | Add to comparison | Engagement signal |
| 6 | `lead_form_shown` | 500 | `requireLead()` triggers form | **Gate hit — intent signal** |
| 7 | `lead_captured` | 511 | Form submit | **Conversion** |
| 8 | `view_floorplan` | 529 | Lead-gated | Post-lead high-intent |
| 9 | `download_brochure` | 530 | Lead-gated | Post-lead high-intent |
| 10 | `explore_payment_plan` | 531 | Lead-gated | Post-lead high-intent |
| 11 | `request_pricing` | 533 | Lead-gated | Post-lead high-intent |
| 12 | `book_viewing` | 534 | Lead-gated | **Bottom of funnel** |
| 13 | `roi_calculator_click` | 666 | ROI banner link | Intent signal |

### Mandatory verify

```powershell
Select-String -Path "frontend\src\pages\MarketplacePortal\MarketplacePortal.jsx" -Pattern 'trackEvent\("' | Measure-Object | Select-Object -Expand Count
# Expected: 13
```

### Manual funnel test (the most important QA on this page)

After fix, complete this full anonymous funnel in one incognito session and confirm each event reaches Firestore:

1. Open `/enterprise/crmdemo/marketplace` in incognito → `marketplace_visit` fires
2. Click "View collection" CTA → `cta_browse` fires
3. Click "Penthouse" filter tab → `filter_units` fires with `{ filter: "penthouse" }`
4. Click any property card → `view_unit` fires
5. Click "Get pricing" on a card → `lead_form_shown` fires with `{ trigger: "high_intent_action" }`
6. Submit the lead form with test name+email → `lead_captured` fires with payload
7. After form closes, the gated action proceeds → `request_pricing` fires
8. Now click another gated action (Brochure) → goes through directly (no second gate) → `download_brochure` fires
9. Click "Book a visit" CTA → `book_viewing` fires
10. Open ROI banner → `roi_calculator_click` fires

If any event in this chain fails, the funnel breaks silently and dashboard conversion rates become wrong without anyone noticing. **Do not merge without this manual pass.**

---

## What works well (preserve)

These Marketplace-specific patterns are strategically correct:

- **Light cream base vs VIP dark luxury.** Anonymous catalogue browsing should feel approachable, not exclusive. Visual register shift is intentional and correct.
- **"From AED 12M" + "Register for exact pricing"** sub-text. Shows enough price to qualify intent, withholds precision to drive lead capture. Smart conversion mechanic.
- **"Get pricing" as the primary action button (filled charcoal)** vs Floor plan / Brochure / Compare as ghost outline. The lead-capture action is visually weighted — eye lands on it first.
- **Stat strip: 248 Premium Units / 44 Floors / 2-4 Bedrooms / Q4 '27 Completion.** Quick credibility ladder — scale (248) + scope (44) + range (2-4) + delivery date (Q4 '27). Each number is a different reason to trust this is real.
- **"Now selling — Phase 2" eyebrow.** Sales urgency without yelling. Implies "Phase 1 sold out" momentum.
- **Lead gate trigger labelled as `"high_intent_action"` in the trackEvent payload.** Future analytics can segment "shown for which action" — better insight than a single boolean.
- **Filter tabs (All / Penthouse / 3bed / 2bed)** — the only one of the 3 portals with filtering. Marketplace handles broader inventory, filtering matters for browse efficiency.
- **End-of-page CTA panel "Ready to Take the Next Step?"** — dark contrast against cream body, repeats the conversion ask after the user has scrolled the whole page. Standard funnel best practice, well executed.
- **"Register / Login" link in top-right.** Anonymous user has a clear path to upgrade to identified VIP. Cross-portal funnel.

---

## What needs fixing (same as Khalid/Ahmed)

All 8 fixes from the Khalid directive apply. Substitution map:

| Token | Khalid value | Marketplace value |
|---|---|---|
| Component file | `VIPPortal/VIPPortal_Definitive.jsx` | `MarketplacePortal/MarketplacePortal.jsx` |
| CSS prefix | `vp-` | `mp-` |
| Primary CTA class | `vp-btn-g` (gold filled) | `mp-btn-d` (dark/charcoal filled) |
| Secondary CTA class | `vp-btn-o` (ghost gold) | `mp-btn-l` (light/ghost) |
| Accent color | gold `#c9a96e` | charcoal/stone neutral (verify exact hex in CSS) |
| Amenity grid | `.vp-am-grid` | `.mp-am-grid` |
| Amenity icon | `.vp-am-icon` | `.mp-am-icon` |
| ROI banner | `.vp-roi-banner` | `.mp-roi-banner` |
| Reveal class | `.vp-rv` | `.mp-rv` |

The 8 fixes:

1. **Fonts** — Same global fix (Cormorant Garamond + Outfit + Noto Kufi Arabic). Ships once, all 3 portals + dashboard benefit. Already covered by Khalid PR — Marketplace inherits.

2. **Amenity emoji → Tabler SVG icons.** Replace `AMENITIES` constant (line in MarketplacePortal — find via grep) with Tabler icon names. Most likely amenities visible: Marina Access, Sky Gardens, Medical Center, Retail & Cafés, and 4 more in the row I didn't capture. Map them:
   - Marina Access → `ti-sailboat`
   - Sky Gardens → `ti-plant-2`
   - Medical Center → `ti-stethoscope`
   - Retail & Cafés → `ti-shopping-cart`
   - (verify the other 4 by reading MarketplacePortal.jsx AMENITIES const and apply the same Tabler mapping pattern as Khalid)

   **CRITICAL color caveat:** Marketplace is on CREAM background, not dark. Use a DARK color for the Tabler icons (charcoal `#1a1a1f` or deep slate) — not gold or teal. Gold on cream washes out; charcoal on cream gives the editorial contrast the page needs.

3. **ROI CTA palette + emoji icon.** ROI banner on Marketplace likely has the same red `OPEN ROI CALCULATOR →` button and 📊 emoji as Khalid. Swap to charcoal-filled button (match the "Get pricing" cards) and Tabler `ti-calculator` icon.

4. **RTL root attributes.** Same fix — extend `toggleLang` and mount `useEffect` to set `document.documentElement.dir/lang`. Preserve all 13 trackEvent calls. Especially watch:
   - Line 489: `marketplace_visit` must still fire on mount
   - Line 501: `lead_form_shown` must still fire on requireLead trigger
   - Line 511: `lead_captured` must still fire on form submit

5. **Sentence case sweep.** Marketplace has the MOST ALL-CAPS labels of any portal:
   - "NOW SELLING — PHASE 2" → "Now selling — Phase 2"
   - "PREMIUM UNITS", "FLOORS", "BEDROOMS", "COMPLETION" (stat strip labels)
   - "PENTHOUSE", "3BR RESIDENCE", "2BR SUITE" (unit-type badges) → "Penthouse", "3BR residence", "2BR suite" (BR stays caps, treat as acronym)
   - "VIEW COLLECTION →", "BOOK A VISIT" (hero CTAs)
   - "GET PRICING", "FLOOR PLAN", "BROCHURE", "COMPARE" (card buttons)
   - "REGISTER NOW →" (final CTA)
   - "Last 3 Units" — already sentence case ✓

   Acronyms preserved: `AED`, `VIP`, `NFC`, `ROI`, `BR` (bedroom), `Q4` (quarter).

6. **Fade-in cap at 400ms.** Same fix. Marketplace has the same multi-second post-load fade.

7. **WhatsApp recolor.** Marketplace's WhatsApp button is the same bright green. Since this is a CREAM page (not dark), a dark-with-gold treatment from Khalid won't match. Use:
   ```css
   .mp-whatsapp, .mp-fab {
     background: #1a1a1f;
     border: 2px solid #1a1a1f;
     color: #faf8f5;
   }
   .mp-whatsapp svg, .mp-fab svg { fill: #faf8f5; }
   .mp-whatsapp:hover, .mp-fab:hover { background: #faf8f5; color: #1a1a1f; }
   ```
   Dark filled circle, cream icon. Different visual treatment than VIP portals — matches the lighter Marketplace palette while still being palette-cohesive. Preserve `contact_advisor` trackEvent call.

8. **Hero CTAs** — do not touch except sentence case. `cta_browse` (line 596) and the `handleBooking` secondary (line 597) trackEvent calls remain.

---

## Marketplace-specific findings

### A. Lead form quality — UNAUDITED, high priority

I did not trigger the lead form in this audit pass because clicking a gated action fires real Firestore events on the tenant. **The lead form is the most important conversion surface on this page.** A clunky form kills the funnel.

**Next pass should:**
1. Click "Get pricing" on any card → trigger the lead form
2. Screenshot the form in EN and AR
3. Audit: field labels, validation copy, button color, dismissibility, mobile responsiveness
4. Measure form length — every additional field drops conversion ~7%
5. Confirm the form passes `trackEvent("lead_form_shown", { trigger: "high_intent_action" })` on render AND `trackEvent("lead_captured", ...)` on submit
6. Test what happens if user dismisses without filling — does it block the action permanently or allow retry?

**Severity: 🔴 Critical for next pass.** This is the conversion bottleneck of the entire anonymous funnel.

### B. "Register / Login" link in top-right has no visual weight

The top-right "Register / Login" link is small charcoal text on cream background, with a thin border. For anonymous visitors who already have a VIP card or account, this is the path to upgrade — should be more visible.

**Recommendation:** Promote to a small pill button with subtle fill (cream-darker or charcoal-outlined). Or move into the hero as a tertiary "Already a VIP? Sign in →" link below the CTA buttons. The visual weight should reflect that this is a cross-funnel handoff to identified portals.

**Severity: 🟢 Minor / 🟡 Moderate.** Conversion edge case but worth thinking about.

### C. Phase 2 / Phase 1 narrative isn't reinforced anywhere else

The eyebrow says "Now selling — Phase 2" implying Phase 1 sold out. Strong sales signal. But then nowhere else on the page is this narrative reinforced — no "Phase 1 sold out in 6 weeks" social proof, no Phase comparison, no "X% of Phase 2 remaining."

**Recommendation:** Add a small social-proof strip below the stat block: "Phase 1 fully sold • 87% of Phase 2 reserved • Now releasing final units." This compounds the urgency that the eyebrow promises.

**Severity: 🟢 Minor.** Conversion enhancement, not a bug.

### D. Property card "Register for exact pricing" sub-text is gold opportunity

This sub-text under "From AED 12M" is doing the lead-capture education job — telling anonymous user WHY pricing is fuzzy. Currently rendered in muted gray Times New Roman.

**Recommendation:** Once fonts are fixed (Fix 1), bump this sub-text to charcoal Outfit medium, maybe with a tiny lock icon `ti-lock-square-rounded-filled` (or outline) inline. Makes the lead gate feel less like withheld information and more like "premium gated access."

```jsx
<div className="mp-card-pricing-sub">
  <i className="ti ti-lock" aria-hidden="true" />
  Register for exact pricing
</div>
```

**Severity: 🟢 Minor.** Polish.

### E. Footer is absent

The Khalid/Ahmed portals have a "This is a private portal. Content is personalized for your exclusive access. Powered by Dynamic NFC." footer. Marketplace's bottom is the "Ready to Take the Next Step?" CTA panel — no equivalent footer.

For trust on an anonymous page (where users might worry "is this site real?"), a small footer reinforcing legitimacy could improve conversion: "Vista Residences is a Phase 2 development of [Developer Name] • Licensed by [Regulator] • Privacy policy • Contact."

**Severity: 🟢 Minor.** Trust enhancement.

### F. "From AED 12M" vs Khalid's "AED 12.5M"

Marketplace prices are rounded down to whole millions, prefixed "From". Khalid shows exact "AED 12.5M". This is a smart funnel mechanism but it could create a small jolt when an anonymous user upgrades to VIP and sees a higher-precision (sometimes higher-magnitude) price.

**Recommendation:** Confirm the rounding direction is always DOWN (Marketplace shows "From AED 12M" for a unit that's actually 12.5M in VIP — anchor effect favors the user). If rounding could go up in some edge cases, fix to always-floor-down.

**Severity: 🟢 Minor / verification only.**

---

## What's NOT a problem (despite looking like one)

- **The cream background looks "less luxury" than Khalid's dark hero.** This is intentional. Anonymous catalogue ≠ VIP portal. Don't darken the page to match Khalid; that would erase the visual hierarchy of the three-tier portal system.
- **The CTA buttons are charcoal instead of gold.** Same reason — Marketplace's accent system is intentionally neutral.
- **"Get pricing" instead of "Request pricing" (different label than VIP portals).** Marketplace uses the action verb that drives the conversion. "Get" is more direct than "Request" for an anonymous user. Preserve.
- **Hero CTA copy "VIEW COLLECTION" (vs Khalid's "EXPLORE RESIDENCES").** Marketplace catalogue framing vs Khalid's curated personal framing. Correct.

---

## Rollback plan

Identical to Khalid/Ahmed — isolated changes, no schema migrations. `git checkout` per file. The most regression-prone fix is #4 (RTL handler) because it touches the same function that fires `language_switch`. Manual QA must include language toggle + funnel sequence test.

---

## Three-portal combined picture

After Khalid + Ahmed + Marketplace PRs ship, you have:

| Surface | Tracking events | Visual register | Conversion mechanic | Audience |
|---|---|---|---|---|
| Khalid VIP | 13 | Dark luxury + gold | Identified VIP — every action tracked | Gulf VIP investor |
| Ahmed Family | 13 | Dark luxury + teal | Identified family buyer — every action tracked | Gulf family buyer |
| Marketplace | 13 | Light cream + charcoal | Lead gate (5/13 events gated) | Anonymous public |

Total: **39 tracking events across 3 portals**, all feeding the Unified Dashboard. With all three polished, the dashboard's "Sales velocity" panel can compute genuine cross-portal funnel math: anonymous → lead → identified VIP → booking.

---

## Out of scope for this audit

- Lead form quality (deferred to next pass — most important conversion surface)
- Unit detail modal (shared with Khalid/Ahmed — audit once, applies to all 3)
- ROI Calculator landing page (linked from all 3 portals)
- Mobile responsive at 375 / 768
- Cross-region test (Marketplace in USA/Mexico/Canada)
- Filter tab interaction depth (when "Penthouse" is selected, are non-penthouse units hidden correctly? Does the filter persist on page reload?)
- "Register / Login" flow (the cross-funnel handoff to VIP portals)
- Phase 2 social proof copy (Section C above — content sprint, not engineering)

---

## Verification Log — 2026-05-13 (post-Cursor implementation)

### Context

After Cursor reported completing the directive, Claude verified the changes against three sources:
1. **Local file state** — grep / Read on `frontend/src/pages/MarketplacePortal/MarketplacePortal.jsx` and `MarketplacePortal.css`
2. **Production deploy state** — live page at `https://www.dynamicnfc.ca/enterprise/crmdemo/marketplace` via Claude-in-Chrome browser MCP
3. **Cursor's report** — the implementation summary the user pasted into chat

### Cursor's report — claim-by-claim audit

| Claim | Local file | Production | Verdict |
|---|---|---|---|
| 13 `trackEvent` calls unchanged | ✅ 13 found by grep | ✅ Confirmed in source | **Accurate** |
| `npm run build` passes | (not re-run by Claude) | n/a | Accept as reported |
| Tabler amenities (`ti-pool`, `ti-bath`, `ti-tools-kitchen-2`, `ti-barbell`, `ti-sailboat`, `ti-plant-2`, `ti-stethoscope`, `ti-shopping-cart`) | ✅ 17 `className="ti ti-` instances in JSX | ❌ Still renders 🏊 🧖 🍽️ 🏋️ at runtime | **Local-only** — deploy stale |
| Charcoal icons on cream via `.mp-am-icon .ti` | ✅ CSS in source | ❌ Not rendering | **Local-only** — deploy stale |
| ROI strip `ti-calculator` instead of 📊 | ✅ In source | ❌ Not verified post-deploy | **Local-only** — deploy stale |
| ROI CTA charcoal-filled with cream text | ✅ CSS in source | ❌ Not verified post-deploy | **Local-only** — deploy stale |
| RTL — `documentElement.lang/dir` set on mount + unmount reset | ✅ Lines 491-497 with cleanup effect | ⚠️ documentElement.dir = "ltr" on Marketplace runtime (bundle may be stale) | **Local-only** — deploy stale |
| `toggleLang` uses functional `setLang` | ✅ Line 499 confirmed | n/a | **Accurate** — but **note:** the rewrite dropped `trackEvent("language_switch", ...)` call. **Marketplace original code didn't have it either** — false alarm during verification. Net zero change. |
| Sentence case sweep on EN `LANG` strings | ✅ Strings are sentence case in source | ⚠️ Strings sentence case in DOM text but CSS `text-transform: uppercase` was claimed removed | **Partial-deploy** — see below |
| Motion ~400ms, hero 0.4s, `prefers-reduced-motion` | (Claude did not deep-audit CSS) | n/a | Accept as reported, verify post-deploy |
| Cards / detail use Tabler (ruler, file, currency, scale, check) | ✅ JSX uses Tabler | ❌ Card buttons render `📐 Floor Plan`, `📄 Brochure`, `💰 Get Pricing`, `⚖️ Compare` | **Local-only** — deploy stale |
| `mp-card-pricing-sub` + `ti-lock` | ✅ Lines 644, 718-719 in source | ❌ `.mp-card-pricing-sub` element NOT in rendered DOM | **Local-only** — deploy stale |
| Bottom CTA `mp-cta-*` classes, `Register now` / `Registered` normal case | ✅ In source | ❌ Not verified post-deploy | **Local-only** — deploy stale |
| Cross-nav 🌐 → `ti-world`, "Public visitor" casing | ✅ In source | ❌ Not verified post-deploy | **Local-only** — deploy stale |
| `.mp-nav-register` pill polish | ✅ In source | ❌ Not verified post-deploy | **Local-only** — deploy stale |
| `.mp-whatsapp` / `.mp-fab` styles, no FAB on page today | ✅ CSS added, no FAB JSX | ✅ No FAB visible | **Accurate** |

### Tracking Preservation Contract — final result

**13 / 13 `trackEvent` calls intact** in local source. Verified by grep:
```
489  marketplace_visit
508  lead_form_shown
519  lead_captured
529  comparison_view
536  view_unit
537  view_floorplan        (lead-gated)
538  download_brochure     (lead-gated)
539  explore_payment_plan  (lead-gated)
541  request_pricing       (lead-gated)
542  book_viewing          (lead-gated)
604  cta_browse
624  filter_units
677  roi_calculator_click
```

**Important correction:** During verification, Claude initially flagged `language_switch` as deleted. **This was wrong.** Marketplace original code never had `language_switch` (unlike Khalid/Ahmed which do). The functional `setLang` rewrite changed nothing about tracking. No event was lost.

### Production deploy diagnosis

The local file has all of Cursor's claimed edits. The production deploy does NOT reflect them — instead it serves an OLDER bundle.

Evidence:
- Fonts (`Cormorant Garamond` + `Outfit`) ARE loading in production — these came from Khalid PR (already shipped earlier per "ships once, all 3 portals benefit" in Fix 1).
- Sentence case JS strings ARE in production DOM (visible text: "Now Selling — Phase 2", "View Collection →", "Premium Units"). This means a *partial* Marketplace deploy went out at some point — strings shipped, asset/CSS edits did not.
- BUT CSS `text-transform: uppercase` still applies to `.mp-pvt`, `.mp-btn-d`, `.mp-btn-l`, `.mp-stat-l`, `.mp-sl`, `.mp-card-fbadge`, `.mp-card-floor` — visually those sentence-case strings render in UPPER CASE. The CSS file was updated locally but not in the deployed bundle.
- AMENITIES `icon` field renders emoji glyphs (🏊🧖🍽️🏋️) in production. The local `AMENITIES` constant has `ti-pool` etc. — the dict edit didn't ship.
- Card action buttons render emoji glyphs (📐📄💰⚖️) in production. Local JSX has Tabler — JSX edit didn't ship.
- `.mp-card-pricing-sub` with `ti-lock` is in local source (lines 644, 718-719) but the element is absent from production DOM.

### Runtime anomaly — "Something went wrong" error boundary

On first navigation to `/enterprise/crmdemo/marketplace`, the production page hit a React error boundary showing "Something went wrong / Try Again" instead of rendering. Hard refresh recovered the page. Khalid loaded cleanly on the same browser/bundle.

Hypotheses (none confirmed):
1. Race condition between `useEffect` setting `documentElement.dir/lang` and the unmount cleanup effect when navigating away from a prior portal
2. Stale-bundle / new-i18n-strings mismatch causing a render-time throw
3. A different pre-existing bug surfacing because the bundle is partially stale

Action: re-test after full deploy. If still happens, capture the actual error stack via devtools.

### Required actions to complete the Marketplace PR

Run from project root in PowerShell:

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run build
# expected: PASS, no errors

cd ..
firebase deploy --only hosting
# expected: hosting deploy ✓ — completes with new bundle URL
```

Then hard-refresh production:
1. Open `/enterprise/crmdemo/marketplace` in incognito
2. `Ctrl+F5` to bypass cache
3. Verify:
   - No emoji in amenities (Tabler outline icons in charcoal instead)
   - No emoji in card action buttons (ruler, file, currency, scale icons)
   - "Now Selling — Phase 2" renders as sentence case (not UPPER)
   - "View Collection" CTA renders sentence case
   - "Premium Units / Floors / Bedrooms / Completion" stat labels sentence case
   - `.mp-card-pricing-sub` lock icon visible under "From AED 12M"
   - First load does NOT hit error boundary

### Then manual funnel QA — DO NOT SKIP

Complete the 13-event chain in one incognito session and confirm each event reaches Firestore (see directive's "Manual funnel test" section above).

If any event in this chain fails, **do not merge.** Roll back to the last green state and isolate which fix broke which event.

### Status summary

| Item | Status |
|---|---|
| Local file edits | ✅ Verified — all claimed changes present in source |
| Tracking preservation | ✅ Verified — 13/13 events intact in local source |
| Production deploy | ⚠️ STALE — old bundle still served |
| Manual funnel QA | ⏳ Pending — must run after fresh deploy |
| Lead form UX audit | ⏳ Pending — separate next-pass item |
| Error boundary on first load | ❓ Unknown — recheck after fresh deploy |
| Branch creation | ⏳ Pending — `polish/marketplace-portal-conversion-2026-05-13` not yet created |

**Net:** Cursor's local work is good. The blocker is build + deploy. Once deployed and manually funnel-QA'd, this PR ships.

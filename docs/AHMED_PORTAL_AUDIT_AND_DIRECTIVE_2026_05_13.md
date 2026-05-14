# Ahmed Family-Buyer Portal — Audit + Cursor Directive (Combined)

**Date:** 2026-05-13
**Surface:** `/enterprise/crmdemo/ahmed` (component: `frontend/src/pages/AhmedPortal/AhmedPortal.jsx`)
**Region tested:** Gulf
**Languages tested:** English + Arabic
**Companion doc:** `docs/VIP_PORTAL_KHALID_AUDIT_2026_05_13.md` + `docs/CURSOR_DIRECTIVE_KHALID_PORTAL_2026_05_13.md`
**Branch suggestion:** `polish/ahmed-portal-albeni-2026-05-13`
**Estimated effort:** ~6–8 hours (significantly less than Khalid because the patterns are identical and Khalid's PR can be largely copy-pasted)

---

## 30-second summary

The Ahmed portal is a near-perfect twin of the Khalid VIP portal. Same code architecture (component file at `AhmedPortal/AhmedPortal.jsx`, CSS prefix `ap-` instead of `vp-`), same 13 tracking events with identical semantics, same emoji-in-amenities problem, same Times New Roman fallback, same partial RTL bug.

**The difference is intentional design:** Ahmed uses a teal/mint accent (instead of Khalid's gold), family-tier pricing (AED 2.8M–8.5M vs Khalid's 4.2M–12.5M), family-coded amenities (Schools, Kids Club, Medical Center, School Bus vs Khalid's Spa, Marina, Valet, Fitness Atelier), and softer copy register ("Dream Residence" vs "Exclusive Residence").

**That persona-aware theming is a strength** — preserve it through any fix.

This doc combines audit + directive because there's so much overlap with Khalid: most fixes are copy-paste with file/prefix swaps.

---

## What Ahmed gets right (different from Khalid — preserve)

| Element | Khalid (VIP) | Ahmed (Family) | Why Ahmed's version works |
|---|---|---|---|
| Accent color | Gold `#c9a96e` | Teal/mint `~#10b89a` | Emotional palette match — gold reads luxury wealth, teal reads trust/calm/family |
| Hero italic word | "Residence" (the asset) | "Dream" (the emotional aspiration) | Family buyers respond to aspiration; VIP investors respond to the asset itself |
| Wordmark | "VISTA RESIDENCES" | "VISTA FAMILY" | Sub-brand differentiation for the same parent project |
| Top-right status pill | "VIP ACCESS" | "VIP FAMILY" | Inclusive — Ahmed is still "VIP" but specifically family-tier |
| Property names | "Sky Penthouse / Grand Residence / Executive Suite" | "Family Haven / Grand Family Suite / Smart Start Home" | Names match family buyer mental model |
| Bedrooms | "4 Bedrooms" | "4 Bedrooms + Maid" | Gulf-specific cultural awareness — maid's quarters expected in family residences |
| Amenities | Spa, Marina, Valet, Private Dining | International Schools, Kids Club, Medical Center, School Bus Routes | Family-coded; schools and bus routes are decision drivers for buyers with kids |
| CTA copy | "Schedule Private Viewing" | "Schedule Family Viewing" | Family-coded |
| Eyebrow | "Private Invitation" | "Private Family Invitation" | Same |
| Body copy register | "discerning investors who demand nothing less than extraordinary" | "those who value quality living for their loved ones" | Aspirational warmth vs status-conscious luxury |
| Price tier | AED 4.2M – 12.5M | AED 2.8M – 8.5M | Realistic family-buyer price ladder |

**Strategic recommendation:** make this persona-aware theming explicit at the architecture level. Pull accent colors, hero italic word, eyebrow copy into a single `personaTheme` config object so the same pattern can scale to future personas (Sultan auto, Marc Patel Canada, USA personas, etc.) without forking entire portal files.

---

## What needs fixing (same patterns as Khalid)

All 8 fixes from the Khalid directive apply verbatim, with only filename and CSS prefix swaps. The 13 tracked events on Ahmed are identical in name and intent to Khalid:

| # | Event | Ahmed line | Same as Khalid? |
|---|---|---|---|
| 1 | `portal_opened` | 398 | ✓ payload adds `portal: "ahmed"` differentiator |
| 2 | `language_switch` | 401 | ✓ identical |
| 3 | `comparison_view` | 405 | ✓ identical |
| 4 | `view_unit` | 407 | ✓ payload richer (unitName, tower, unitType) |
| 5 | `view_floorplan` | 408 | ✓ payload richer |
| 6 | `download_brochure` | 409 | ✓ payload richer |
| 7 | `explore_payment_plan` | 410 | ✓ payload richer |
| 8 | `request_pricing` | 412 | ✓ payload richer |
| 9 | `contact_advisor` | 413 | ✓ identical |
| 10 | `book_viewing` | 417 | ✓ lighter payload (no date/time) |
| 11 | `cta_explore` | 472 | ✓ identical |
| 12 | `cta_booking` | 473 | ✓ identical |
| 13 | `roi_calculator_click` | 521 | ✓ identical |

**Tracking preservation contract applies identically.** Run the same verify-step:
```powershell
Select-String -Path "frontend\src\pages\AhmedPortal\AhmedPortal.jsx" -Pattern 'trackEvent\("' | Measure-Object | Select-Object -Expand Count
# Expected: 13
```

---

## Fix-by-fix delta from Khalid directive

For each fix, the work is the Khalid directive's instructions with the following path/prefix substitutions:

| Token | Khalid value | Ahmed value |
|---|---|---|
| Component file | `VIPPortal/VIPPortal_Definitive.jsx` | `AhmedPortal/AhmedPortal.jsx` |
| CSS prefix | `vp-` | `ap-` |
| Amenity grid container class | `.vp-am-grid` | `.ap-am-grid` |
| Amenity cell class | `.vp-am` | `.ap-am` |
| Amenity icon class | `.vp-am-icon` | `.ap-am-icon` |
| ROI banner class | `.vp-roi-banner` | `.ap-roi-banner` |
| ROI icon class | `.vp-roi-icon` | `.ap-roi-icon` |
| Primary CTA class | `.vp-btn-g` | `.ap-btn-g` |
| Ghost CTA class | `.vp-btn-o` | `.ap-btn-o` |
| Reveal-on-scroll class | `.vp-rv` | `.ap-rv` |
| Section class | `.vp-sec` | `.ap-sec` |
| Accent color variable | `--gulf-gold` (#c9a96e) | `--ahmed-teal` (#10b89a or whatever the actual portal value is) |
| Hero acts container | `.vp-hacts` | `.ap-hacts` |

### Per-fix scope on Ahmed

1. **Fonts** (Fix 1 in Khalid directive) — IDENTICAL. Same `index.html` link + same global CSS rules. This fix ships ONCE and benefits both portals plus the dashboard.

2. **Amenities emoji → SVG** — IDENTICAL pattern, different amenity icons:

   Replace Ahmed's `AMENITIES` (line 325) with:
   ```js
   const AMENITIES = {
     en: [
       { icon: "ti-school", name: "International Schools", desc: "3 top-rated schools within walking distance" },
       { icon: "ti-trees", name: "Central Park", desc: "12-acre landscaped park with jogging tracks" },
       { icon: "ti-pool", name: "Family Pool Complex", desc: "Separate kids pool, adult pool & splash zone" },
       { icon: "ti-mood-kid", name: "Kids Club & Nursery", desc: "Supervised play areas & early learning center" },
       { icon: "ti-ball-tennis", name: "Sports & Fitness", desc: "Tennis courts, gym & yoga studio" },
       { icon: "ti-shopping-cart", name: "Retail & Dining", desc: "Supermarket, cafés & family restaurants" },
       { icon: "ti-stethoscope", name: "Medical Center", desc: "24/7 clinic with pediatric care" },
       { icon: "ti-bus", name: "School Bus Routes", desc: "Dedicated school bus pickup points" },
     ],
     ar: [
       { icon: "ti-school", name: "مدارس دولية", desc: "٣ مدارس عالية التقييم على بُعد مشي" },
       { icon: "ti-trees", name: "حديقة مركزية", desc: "حديقة منسقة بمساحة ١٢ فدان مع مسارات للجري" },
       { icon: "ti-pool", name: "مجمع المسبح العائلي", desc: "مسبح أطفال منفصل ومسبح كبار ومنطقة رذاذ" },
       { icon: "ti-mood-kid", name: "نادي ومرحلة حضانة", desc: "مناطق لعب مراقبة ومركز تعلم مبكر" },
       { icon: "ti-ball-tennis", name: "رياضة ولياقة", desc: "ملاعب تنس وصالة وستوديو يوغا" },
       { icon: "ti-shopping-cart", name: "تجزئة ومطاعم", desc: "سوبرماركت ومقاهي ومطاعم عائلية" },
       { icon: "ti-stethoscope", name: "مركز طبي", desc: "عيادة على مدار الساعة مع رعاية أطفال" },
       { icon: "ti-bus", name: "مسارات حافلات المدارس", desc: "نقاط استقبال مخصصة لحافلات المدارس" },
     ],
   };
   ```

   Update render at line 509 — change `<div className="ap-am-icon">{a.icon}</div>` to:
   ```jsx
   <div className="ap-am-icon"><i className={`ti ${a.icon}`} aria-hidden="true" /></div>
   ```

   Add CSS:
   ```css
   .ap-am-icon i {
     font-size: 32px;
     color: var(--ahmed-teal, #10b89a);
     line-height: 1;
   }
   ```

3. **ROI CTA red → teal (not gold)** — At line 521, the ROI banner is `<Link className="ap-roi-banner" onClick={trackEvent("roi_calculator_click")}>`. Apply Khalid's CSS strategy with `--ahmed-teal` instead of gold so the ROI block matches Ahmed's accent. Swap `<div className="ap-roi-icon">📊</div>` (line 522) to `<div className="ap-roi-icon"><i className="ti ti-calculator" aria-hidden /></div>`.

4. **RTL root attrs** — IDENTICAL fix. Open `toggleLang` (line 401) and the mount `useEffect` (line 398). Extend with `document.documentElement.dir/lang` setters. Both `trackEvent("language_switch", ...)` and `trackEvent("portal_opened", ...)` calls must be preserved.

5. **Sentence case + ASCII arrow sweep** — Same pattern. Open Ahmed's i18n strings (lines ~60–200) and the i18n file at `frontend/src/i18n/portals/ahmedPortal.js`. Sweep ALL-CAPS to sentence case. Acronyms (VIP, AED, NFC, ROI) stay. Replace 24+ ASCII ` -> ` with Unicode ` → `.

6. **Cap fade-in at 400ms** — IDENTICAL. Find `transition: opacity ...s` rules in `AhmedPortal.css` and cap.

7. **WhatsApp button recolor** — IDENTICAL. Same `vp-whatsapp`/`vp-fab` class names likely have an `ap-whatsapp`/`ap-fab` counterpart (verify with grep). The recolor target is teal/mint accent instead of gold:
   ```css
   .ap-whatsapp, .ap-fab {
     background: #1a1a1f;
     border: 2px solid #10b89a;
     color: #10b89a;
   }
   ```
   Preserve the `callAdvisor` → `trackEvent("contact_advisor", ...)` onClick.

8. **Hero CTAs (lines 472–473)** — DO NOT TOUCH except for sentence case in the i18n label values. Both `cta_explore` and `cta_booking` trackEvent calls remain intact.

---

## Ahmed-specific findings beyond Khalid

These are NOT in the Khalid directive — they're unique to Ahmed:

### A. The teal accent color isn't tokenized

Grep for `#10b89a` or whatever the actual teal hex is across the codebase:

```powershell
Select-String -Path "frontend\src\pages\AhmedPortal\**\*.css" -Pattern "#[0-9a-fA-F]{6}|rgb\(" | Select-Object -First 20
```

If the teal accent is hardcoded across multiple CSS rules, this is a fragile design system. Tokenize it:

```css
:root {
  --ahmed-teal: #10b89a;      /* primary accent */
  --ahmed-teal-deep: #0d9684; /* hover / pressed */
  --ahmed-teal-soft: #e6f7f4; /* tint backgrounds */
}
```

Then sweep CSS to reference the variable. Once tokenized, future persona-aware themes become trivial (swap the var values, change the persona feel).

**Severity: 🟡 Moderate.** Compounds with Khalid's gold tokens — both should be done as part of a single "persona theme system" tokenization sprint.

### B. The "Last 5 Units" badge on Smart Start Home is the same red as Khalid's "Last 3 Units"

Per CLAUDE.md: brand red `#e63946` is permitted for urgency / scarcity badges. ✅ This is correct usage of the brand red — it stands out against the teal palette intentionally, drawing the eye to the unit running out. **Preserve.**

### C. Property images are shared with Khalid (same stock photos)

The "Family Haven" exterior is the same exterior tree-and-grass house image as Khalid's "Executive Suite". The "Smart Start Home" interior is similar to Khalid's "Sky Penthouse" interior staging.

**Why this matters:** if a prospect compares the two portals (e.g., a family pulling up Ahmed while their friend has Khalid), the duplicate imagery breaks the illusion of distinct, persona-curated inventories.

**Recommendation:** distinct image sets per portal. Even if the underlying units in code are partially shared, present them through different photography angles or interior staging. Lower priority than the typography/emoji fixes — but worth flagging.

**Severity: 🟢 Minor.** Logged for image-budget allocation.

### D. "Bedrooms + Maid" terminology

Property cards show "3 Bedrooms + Maid" / "4 Bedrooms + Maid". This is correct Gulf-market localization — maid's quarters are an expected feature in family residences.

**Verify:** confirm Arabic version translates this appropriately (`غرف نوم + غرفة خادمة` or similar). If just "+ Maid" remains in English in the Arabic UI, that's a translation gap.

**Severity: 🟢 Minor.** Verification, not a fix.

---

## Combined Khalid + Ahmed PR strategy

Since Khalid and Ahmed are architectural twins, evaluate combining them into a single PR:

**Option A: One combined PR (recommended if Cursor finishes Khalid quickly)**
- All 8 fixes applied to both `VIPPortal_Definitive.jsx` and `AhmedPortal.jsx` in one branch
- Shared CSS rules for fonts, RTL, fade timing applied once
- Persona-specific CSS (gold vs teal accent) handled per-file
- One verification pass (26 tracked events to verify: 13 Khalid + 13 Ahmed)
- Faster shipping, single review cycle
- Risk: larger diff, more places for tracking regressions

**Option B: Sequential PRs (current path)**
- Khalid PR ships first (Cursor is already on it)
- Ahmed PR follows using Khalid as proven pattern
- Each PR independently verified
- Slower but lower risk per merge

**Recommendation:** if the Khalid PR is still open when this is ready, ask Cursor to extend the same PR to Ahmed using this directive as the spec. The diff doubles in size but the review effort is sub-linear because the patterns are identical.

---

## Verification (Ahmed-specific)

In addition to all 13 Ahmed tracking events firing correctly (see Khalid directive for the manual QA pattern):

1. **Persona theme separation visible.** Open `/khalid` then `/ahmed` in two tabs. Confirm:
   - Khalid hero italic word is GOLD; Ahmed hero italic word is TEAL
   - Khalid CTA fill is GOLD; Ahmed CTA fill is TEAL
   - "VIP ACCESS" pill on Khalid; "VIP FAMILY" pill on Ahmed
   - Property images differ (or are intentionally shared per business decision)

2. **Tracking differentiator preserved.** In Firestore, confirm Ahmed's `portal_opened` event payload contains `{ portal: "ahmed", language: "..." }`. Khalid does NOT have this differentiator — investigate whether Khalid should also tag `portal: "khalid"` for dashboard segmentation.

3. **Cross-portal regression check.** After fixing Ahmed, re-open Khalid and confirm no shared CSS rule (e.g., the new fade-cap or the global font-family rule) broke Khalid's appearance. If both portals use the same global CSS file, both must continue rendering correctly.

---

## Rollback plan

Identical to Khalid — all changes isolated, no data migrations. Add to rollback ledger:
- `git checkout HEAD~ -- frontend/src/pages/AhmedPortal/AhmedPortal.jsx`
- `git checkout HEAD~ -- frontend/src/pages/AhmedPortal/AhmedPortal.css` (if exists)

---

## What I'd actually do — combined day-by-day plan for both portals

If both Khalid and Ahmed go in one sprint:

| Day | Work |
|---|---|
| Day 1 morning | Fonts (Fix 1) — ships globally, both portals + dashboard benefit |
| Day 1 afternoon | Amenity emoji → SVG icons (Fix 2) — apply to Khalid first, then Ahmed |
| Day 2 morning | ROI CTA palette + ROI icon (Fix 3) — both portals; teal on Ahmed, gold on Khalid |
| Day 2 afternoon | RTL root attrs + arrow flip (Fix 4) — both portals |
| Day 3 morning | Sentence case + ASCII arrow sweep (Fix 5) — both portals + i18n files |
| Day 3 afternoon | Fade cap + WhatsApp recolor (Fix 6 + 7) — both portals |
| Day 4 | Manual QA: 13 Khalid events × 13 Ahmed events × 4 regions × 2 languages. Dashboard sanity check. PR. |

Total: 4 days for both portals with thorough verification, vs ~1.5 days for Khalid alone. The marginal cost of Ahmed is ~50% of Khalid because of code reuse.

---

## Out of scope

- Anonymous Marketplace portal — separate audit + PR (Marketplace is the third demo surface, distinct architecture)
- Sultan automotive portal — different sector entirely
- USA / Mexico / Canada region cross-checks for Ahmed — separate verification task
- Mobile responsive on Ahmed — separate verification
- Unit detail modal (the modal Khalid + Ahmed open on `view_unit` click) — both portals share this surface; audit separately
- ROI Calculator landing page — both portals link there; audit that as a third surface

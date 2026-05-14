# Cursor Directive — Khalid VIP Portal Visual Appeal Sweep

**Date:** 2026-05-13
**Author:** Claude (architecture) → Cursor (implementation)
**Scope:** 8 visual-appeal fixes for `frontend/src/pages/VIPPortal/VIPPortal_Definitive.jsx`
**Source audit:** `docs/VIP_PORTAL_KHALID_AUDIT_2026_05_13.md`
**Branch suggestion:** `polish/khalid-portal-albeni-2026-05-13`
**Estimated effort:** ~1.5 days for a careful pass with manual QA

---

## 🔒 Tracking Preservation Contract — READ THIS FIRST

### Why this section exists

This portal's interactions feed the Unified Dashboard analytics via Firestore. CLAUDE.md "⚠️ Demo Tracking Rule — CRITICAL" makes this non-negotiable:

> All user actions inside demo pages are recorded to Firestore and power dashboard analytics. Demo content may be simulated, but tracking is real. Never add "demo only" flags that skip tracking. Every portal click, language switch, ROI calc, unit view, brochure download, and form interaction must go through `firestoreTracking.js`.

If any of the 13 tracked events on this page stops firing after this PR, the dashboard goes dark — investor demos and pilot analytics break silently. Treat each `trackEvent(...)` call as **a load-bearing wall**, not a code-smell to refactor away.

### The 13 tracked events on this page

Map locked in as of 2026-05-13. Cursor must verify all 13 still fire after fix:

| # | Event name | Source line | Triggered by |
|---|---|---|---|
| 1 | `portal_opened` | 469 | `useEffect` on mount with `{ language: lang }` payload |
| 2 | `language_switch` | 472 | `toggleLang` — clicking "العربية" / "English" toggle |
| 3 | `comparison_view` | 489 | Adding a unit to comparison (max 3) |
| 4 | `view_unit` | 498 | Opening unit detail modal |
| 5 | `view_floorplan` | 509 | Opening floor plan modal |
| 6 | `download_brochure` | 520 | Opening brochure modal |
| 7 | `explore_payment_plan` | 532 | Toggling 60/40 payment plan |
| 8 | `request_pricing` | 541 | "Request pricing" button on property card |
| 9 | `contact_advisor` | 550 | Call advisor / WhatsApp click |
| 10 | `book_viewing` | 565 | Schedule private viewing form submit |
| 11 | `cta_explore` | 635 | Hero primary CTA "Explore residences" |
| 12 | `cta_booking` | 636 | Hero secondary CTA "Schedule private viewing" |
| 13 | `roi_calculator_click` | 745 | ROI calculator banner click |

### Rules of engagement

1. **Never delete a `trackEvent(...)` call.** Not "while refactoring," not "because it looks ugly inline," not "I'll re-add it later."
2. **Never replace `onClick={() => { trackEvent("X"); ...rest }}` with a refactored handler unless the new handler still calls `trackEvent("X")` with identical arguments.**
3. **When converting JSX (e.g., emoji → SVG icon), edit only the rendered content, not the surrounding `onClick` / `Link onClick`.** Verify in the diff that `trackEvent` count is unchanged.
4. **For Fix 4 (RTL handler):** the change adds `document.documentElement.dir/lang` setting INSIDE the existing `toggleLang` function. The `trackEvent("language_switch", { to: n })` call on line 472 must remain unchanged.

### Mandatory verification step before opening PR

```powershell
# Confirm the 13 trackEvent calls are still present in the file
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern 'trackEvent\("' | Measure-Object | Select-Object -Expand Count
# Expected: 13 (or higher if you legitimately added new ones — but never lower)
```

Then manual QA (see "Post-fix verification" at the end of this doc).

---

## Fix 1 — Load brand fonts via Google Fonts

### Tracking impact: ✅ None

### Root cause

`document.fonts` shows `Super Sans VF`, `Super Serif VF`, `Super Mono VF` declared in stylesheet with status "unloaded" — `@font-face` paths are broken. h1 falls back to Cormorant Garamond (acceptable), body falls back to Times New Roman (brand-killing).

### Steps

1. Open `frontend/index.html`. Inside `<head>`, before any other stylesheet link, add:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@400;500;600&family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

2. In `frontend/src/index.css` (or whatever the global stylesheet is — verify), add at the top:
   ```css
   body {
     font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
     font-weight: 400;
   }

   h1, h2, h3, h4, .vp-h, .vp-st {
     font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
     font-weight: 500;
   }

   :root[lang="ar"] body,
   :root[dir="rtl"] body {
     font-family: "Noto Kufi Arabic", "Outfit", sans-serif;
   }
   ```

3. **Find and remove the broken `@font-face` declarations** for `Super Sans VF`, `Super Serif VF`, `Super Mono VF`. Grep:
   ```powershell
   Select-String -Path "frontend\src\**\*.css" -Pattern "Super (Sans|Serif|Mono) VF" -List
   ```
   Delete those `@font-face` blocks.

### Verify

```powershell
# After deploy
# In browser devtools → Network tab → filter "font" → reload
# Expected: 3 .woff2 files load from fonts.gstatic.com with status 200
# In console:
#   Array.from(document.fonts).filter(f => f.status === "loaded").map(f => f.family)
# Expected output includes: "Cormorant Garamond", "Outfit", "Noto Kufi Arabic"
```

---

## Fix 2 — Amenities emoji → Tabler outline icons

### Tracking impact: ✅ None

**Why it's safe:** `AMENITIES` dictionary at line 380 holds `{ icon, name, desc }` per amenity. Render at line 713–715 is `<div className="vp-am-icon">{a.icon}</div>` — no onClick handler on the cell, no trackEvent fires. Pure display swap.

### Steps

1. Open `frontend/src/pages/VIPPortal/VIPPortal_Definitive.jsx`.

2. Replace the `AMENITIES` constant (lines 380–401) entirely with:
   ```js
   const AMENITIES = {
     en: [
       { icon: "ti-pool", name: "Infinity Edge Pool", desc: "60m rooftop pool with panoramic Gulf views" },
       { icon: "ti-flower", name: "Spa & Wellness", desc: "Full-service spa with hammam & cryo chamber" },
       { icon: "ti-tools-kitchen-2", name: "Private Dining", desc: "Michelin-standard resident-only restaurant" },
       { icon: "ti-barbell", name: "Fitness Atelier", desc: "Technogym-equipped with personal trainers" },
       { icon: "ti-sailboat", name: "Marina Access", desc: "Private berths for yachts up to 60ft" },
       { icon: "ti-plant-2", name: "Sky Gardens", desc: "Landscaped terraces on every 10th floor" },
       { icon: "ti-mood-kid", name: "Kids Club", desc: "Supervised play areas & learning center" },
       { icon: "ti-charging-pile", name: "Valet & EV", desc: "24/7 valet with EV charging stations" },
     ],
     ar: [
       { icon: "ti-pool", name: "مسبح إنفينيتي", desc: "مسبح على السطح بطول ٦٠ متر مع إطلالات بانورامية" },
       { icon: "ti-flower", name: "سبا وعافية", desc: "سبا متكامل مع حمام تركي وغرفة تبريد" },
       { icon: "ti-tools-kitchen-2", name: "مطعم خاص", desc: "مطعم حصري للسكان بمعايير ميشلان" },
       { icon: "ti-barbell", name: "صالة لياقة", desc: "مجهزة بأحدث أجهزة تكنوجيم مع مدربين شخصيين" },
       { icon: "ti-sailboat", name: "مرسى خاص", desc: "أرصفة خاصة لليخوت حتى ٦٠ قدم" },
       { icon: "ti-plant-2", name: "حدائق سماوية", desc: "شرفات منسقة كل ١٠ طوابق" },
       { icon: "ti-mood-kid", name: "نادي الأطفال", desc: "مناطق لعب مراقبة ومركز تعليمي" },
       { icon: "ti-charging-pile", name: "خدمة صف السيارات", desc: "خدمة صف ٢٤/٧ مع محطات شحن كهربائية" },
     ],
   };
   ```

3. Find the render at line 715. Replace:
   ```jsx
   <div className="vp-am-icon">{a.icon}</div>
   ```
   with:
   ```jsx
   <div className="vp-am-icon">
     <i className={`ti ${a.icon}`} aria-hidden="true" />
   </div>
   ```

4. **Verify Tabler Icons is loaded.** Grep:
   ```powershell
   Select-String -Path "frontend\src\**\*.{css,html,js,jsx}" -Pattern "tabler" -List
   ```
   If not present, add to `index.html`:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
   ```

5. Add CSS for the icon container. In `VIPPortal_Definitive.css` (or wherever `.vp-am-icon` is defined):
   ```css
   .vp-am-icon i {
     font-size: 32px;
     color: var(--gulf-gold, #c9a96e);
     line-height: 1;
   }
   ```

### Verify

```
# Manual check after rebuild
# 1. Navigate to /enterprise/crmdemo/khalid
# 2. Scroll to "The Lifestyle" amenities section
# 3. Confirm: 8 thin-line gold outline icons (pool, flower, kitchen, barbell, sailboat, plant, kid, charging pile)
# 4. No emoji visible anywhere in this section
# 5. Switch to Arabic — same 8 icons, same gold color
```

---

## Fix 3 — ROI Calculator CTA red → gold

### Tracking impact: ✅ None if CSS-only

**Critical:** the ROI banner at line 745 is a `<Link>` with `onClick={() => { trackEvent("roi_calculator_click"); }}`. Change ONLY the CSS / styling of the button child. Do NOT modify the Link's onClick or the trackEvent call.

### Steps

1. **Locate the inline emoji 📊** inside the ROI banner. Grep:
   ```powershell
   Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern "vp-roi-icon" -Context 1,3
   ```
   Look for `<div className="vp-roi-icon">📊</div>`. Replace with:
   ```jsx
   <div className="vp-roi-icon"><i className="ti ti-calculator" aria-hidden="true" /></div>
   ```

2. **Find the red button CSS.** In `VIPPortal_Definitive.css`, locate the `vp-roi-banner` rule and any nested button. Update color:
   ```css
   .vp-roi-banner {
     /* keep existing layout / spacing */
     background: linear-gradient(180deg, #1a1a1f 0%, #14141a 100%); /* or whatever the existing dark surface is */
     border: 1px solid rgba(201, 169, 110, 0.25); /* subtle gold hairline */
   }

   .vp-roi-banner .vp-roi-cta,
   .vp-roi-banner button {
     background: linear-gradient(180deg, #d4b375 0%, #c9a96e 100%); /* match hero gold CTA */
     color: #1a1a1f;
     border: none;
   }

   .vp-roi-icon i {
     font-size: 28px;
     color: #c9a96e;
   }
   ```

   Do NOT touch the `<Link to="..." onClick={...}>` JSX wrapping.

### Verify

```
# After rebuild
# 1. Open /enterprise/crmdemo/khalid
# 2. Scroll to ROI calculator banner
# 3. Confirm: dark background, gold hairline border, gold CTA button, calculator outline icon (no 📊 emoji)
# 4. Click the banner once
# 5. In Firebase Console → Firestore → tenants/{your-uid}/events (or wherever portal events stream)
#    confirm a new event with name "roi_calculator_click" was just written
# 6. Verify in URL: clicking still navigates to /enterprise/crmdemo/roi-calculator
```

---

## Fix 4 — RTL root attributes + arrow glyph flip

### Tracking impact: ⚠️ Moderate (requires care)

**Critical:** the `toggleLang` function at line 472 already calls `trackEvent("language_switch", { to: n })`. The new lines we add must NOT replace or wrap that call — they extend it.

### Steps

1. Locate `toggleLang` at line 472:
   ```js
   const toggleLang = () => { const n = lang === "en" ? "ar" : "en"; setLang(n); trackEvent("language_switch", { to: n }); };
   ```

2. **Extend it** to also set root document attributes. Replace the line above with:
   ```js
   const toggleLang = () => {
     const n = lang === "en" ? "ar" : "en";
     setLang(n);
     document.documentElement.lang = n;
     document.documentElement.dir = n === "ar" ? "rtl" : "ltr";
     trackEvent("language_switch", { to: n });
   };
   ```

   Order matters: set lang/dir BEFORE trackEvent so the analytics payload reflects post-switch state. Or pass the new state explicitly (current form is fine).

3. **Also set initial dir/lang on mount.** Locate the `useEffect` at line 469 (the `portal_opened` one). Right before or after the trackEvent call, add:
   ```js
   useEffect(() => {
     document.documentElement.lang = lang;
     document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
     trackEvent("portal_opened", { language: lang });
   }, []);
   ```

   The `trackEvent("portal_opened", ...)` call must remain.

4. **Flip arrow glyphs in RTL.** In `VIPPortal_Definitive.css`, add a global rule:
   ```css
   [dir="rtl"] .vp-cta-arrow::after,
   [dir="rtl"] .vp-btn-g::after,
   [dir="rtl"] .vp-btn-o::after {
     content: " ←";
   }
   [dir="ltr"] .vp-cta-arrow::after,
   [dir="ltr"] .vp-btn-g::after,
   [dir="ltr"] .vp-btn-o::after {
     content: " →";
   }
   ```

   If button arrows are currently hard-coded in JSX text (e.g., `{t.hero.cta} →`), find each and either move the arrow to a pseudo-element OR use a CSS class `vp-cta-arrow` that flips per direction. Grep first:
   ```powershell
   Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern " →"
   ```
   Each match needs a decision: keep hard-coded (and accept it doesn't flip), or replace with class-based pseudo-element.

### Verify

```
# Manual check after rebuild
# 1. Open /enterprise/crmdemo/khalid
# 2. In devtools Elements panel: select <html> root. Confirm:
#    - dir="ltr"
#    - lang="en"
# 3. Click "العربية"
# 4. Confirm root now shows dir="rtl" and lang="ar"
# 5. Hero CTAs: arrows point ← (left) in Arabic, → (right) in English
# 6. In Firebase Console: confirm a "language_switch" event was written with { to: "ar" }
# 7. In Firestore: confirm "portal_opened" event still fires on initial page load (incognito tab test)
```

---

## Fix 5 — Sentence case sweep + ASCII arrow cleanup

### Tracking impact: ⚠️ Low — text content changes only

**Critical:** the hero CTAs at lines 635–636 reference `t.hero.cta` and `t.hero.ctaSecondary`. These are i18n keys defined in the `t` object inside the component. Changing the i18n strings to sentence case does NOT touch the onClick handlers — `trackEvent("cta_explore")` and `trackEvent("cta_booking")` calls remain.

### Steps

1. Locate the i18n dictionary inside the component (around lines 60–200, the `en:` and `ar:` blocks).

2. Sweep every value that's ALL CAPS or Title Case. Specifically these patterns:
   - `"Floor Plan"` → `"Floor plan"`
   - `"Request Pricing"` → `"Request pricing"`
   - `"Brochure"` → `"Brochure"` (single-word noun, keep)
   - `"Compare"` → `"Compare"` (single word, fine)
   - `"Private Invitation"` → `"Private invitation"`
   - `"Schedule Private Viewing"` → `"Schedule private viewing"`
   - `"Explore Residences"` → `"Explore residences"`
   - `"VIP Access"` → `"VIP access"` (VIP stays caps)
   - Property view badges: `"360° Panoramic Views"` → `"360° panoramic views"`, `"Marina & Sea View"` → `"Marina & sea view"`, `"City Skyline View"` → `"City skyline view"`
   - `"Floor 42-44"` → `"Floor 42–44"` (en-dash instead of hyphen for ranges) — optional polish

3. Acronyms that stay ALL CAPS: `VIP`, `AED`, `NFC`, `ROI`, `EV`, `360°`.

4. For Arabic translations, sentence case is N/A (Arabic doesn't have letter case), but verify the Arabic strings don't have any leftover Latin-script ALL-CAPS fragments.

5. **Also sweep ASCII arrows.** Grep:
   ```powershell
   Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern " -> " -SimpleMatch
   ```
   Replace each ` -> ` with ` → ` (Unicode `→`, U+2192). If Fix 4's CSS pseudo-element approach is taken, remove hard-coded arrows from JSX entirely.

### Verify

```powershell
# After edits, count remaining ASCII arrows (should be 0)
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern " -> " -SimpleMatch | Measure-Object | Select-Object -Expand Count

# Count remaining ALL-CAPS in user-facing strings (rough heuristic: 3+ consecutive caps not in [VIP|AED|NFC|ROI|EV])
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern '"[A-Z][A-Z][A-Z ]+"' | Where-Object { $_ -notmatch "VIP|AED|NFC|ROI|EV|API" }
# Expected: ~0 matches in user-facing strings
```

Manual visual check on /enterprise/crmdemo/khalid: confirm "Private invitation" / "Explore residences" / "Schedule private viewing" / property card labels / form labels — all sentence case. Acronyms preserved.

---

## Fix 6 — Cap fade-in at 400ms

### Tracking impact: ✅ None — animation timing only

### Steps

1. Grep all `transition` and `animation-duration` rules in `VIPPortal_Definitive.css` (and any imported CSS):
   ```powershell
   Select-String -Path "frontend\src\pages\VIPPortal\*.css" -Pattern "transition|animation-duration"
   ```

2. For any rule that has a duration > 600ms on `opacity` or compound `all` transitions, cap at 400ms.

3. Specifically check `.vp-rv` (the "reveal" class applied to multiple sections). If it has `transition: opacity 1.5s ease;` or similar, reduce to `400ms`.

4. Verify `prefers-reduced-motion` respect:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .vp-rv, .vp-fade, [class*="reveal"] {
       transition: none !important;
       animation: none !important;
     }
   }
   ```

### Verify

```
# Open /enterprise/crmdemo/khalid in a fresh incognito tab
# Stopwatch: hero should be fully readable within 1.5 seconds of page load
# (currently 6-9 seconds)
# Scroll-triggered reveals: complete within 400ms of entering viewport
```

---

## Fix 7 — WhatsApp button palette cohesion

### Tracking impact: ⚠️ Low — `contact_advisor` event preservation

**Critical:** `callAdvisor` at line 550 calls `trackEvent("contact_advisor", { vipName })`. Verify the WhatsApp floating button's onClick still calls `callAdvisor` (or fires the same event). Grep:
```powershell
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern "callAdvisor|whatsapp|whats-app" -i
```

### Steps

1. Locate the WhatsApp floating button JSX (likely a `<button>` or `<a>` with class like `vp-whatsapp` or `vp-fab`).

2. Update its CSS only. In `VIPPortal_Definitive.css`:
   ```css
   .vp-whatsapp,
   .vp-fab {
     background: #1a1a1f;
     border: 2px solid #c9a96e;
     color: #c9a96e;
     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
   }

   .vp-whatsapp svg,
   .vp-fab svg {
     fill: #c9a96e;
   }

   .vp-whatsapp:hover,
   .vp-fab:hover {
     background: #c9a96e;
     color: #1a1a1f;
   }

   .vp-whatsapp:hover svg,
   .vp-fab:hover svg {
     fill: #1a1a1f;
   }
   ```

3. Do NOT touch the button's onClick handler. Verify it still calls `callAdvisor` (or whatever fires `trackEvent("contact_advisor", ...)`).

### Verify

```
# Manual check after rebuild
# 1. Open /enterprise/crmdemo/khalid
# 2. Floating button bottom-right is now dark with gold ring (not bright green)
# 3. Click the button
# 4. Firebase Console: confirm "contact_advisor" event fires with vipName payload
```

---

## Fix 8 — Hero CTA hierarchy is fine, do not touch

Recording explicitly so Cursor doesn't optimize this:

- Line 635: `cta_explore` filled gold primary
- Line 636: `cta_booking` ghost outline secondary

Both `trackEvent` calls are correctly wired. The visual hierarchy works. Leave alone.

---

## Cross-cutting: post-fix verification

Before opening the PR, run this complete checklist:

### Automated checks

```powershell
cd C:\Users\oguzh\DynamicNFC

# 1. Build passes
cd frontend
npm run build
# Expected: PASS, no syntax errors

# 2. Tracking call count unchanged (or higher — never lower)
cd ..
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern 'trackEvent\("' | Measure-Object | Select-Object -Expand Count
# Expected: 13

# 3. No ASCII arrows left
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern " -> " -SimpleMatch | Measure-Object | Select-Object -Expand Count
# Expected: 0

# 4. No emoji icons in AMENITIES
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern '"icon":\s*"[^t][^i]' -List
# Should return 0 — every icon now starts with "ti-"

# 5. Tabler icon classes used in JSX
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern 'className="ti ti-'
# Expected: at least 2 matches (8 amenity icons + 1 ROI calculator icon, depending on render structure)

# 6. Document.dir/lang setter added
Select-String -Path "frontend\src\pages\VIPPortal\VIPPortal_Definitive.jsx" -Pattern "documentElement\.(dir|lang)"
# Expected: 4+ lines (2 in toggleLang, 2 in mount useEffect)

# 7. No broken @font-face for Super * VF
Select-String -Path "frontend\src\**\*.css" -Pattern "Super (Sans|Serif|Mono) VF" -List
# Expected: 0 matches
```

### Manual tracking QA — DO NOT SKIP

This is the part that catches real regressions. In a fresh browser tab logged in as your test tenant:

1. **`portal_opened`** — Open `/enterprise/crmdemo/khalid`. Watch Firestore Console (tenants/{uid}/events). Confirm event arrives with `{ language: "en" }` payload.
2. **`language_switch`** — Click "العربية". Confirm event arrives with `{ to: "ar" }`.
3. **`view_unit`** — Click any property card. Confirm event with `{ unitId: ... }`.
4. **`view_floorplan`** — Inside unit modal, click "Floor plan". Confirm event.
5. **`download_brochure`** — Click "Brochure". Confirm event.
6. **`explore_payment_plan`** — Click 60/40 plan. Confirm event.
7. **`request_pricing`** — Click "Request pricing" on card. Confirm event.
8. **`comparison_view`** — Click "Compare" on a card. Confirm event.
9. **`contact_advisor`** — Click the WhatsApp / call advisor button. Confirm event.
10. **`cta_explore`** — Click hero primary "Explore residences". Confirm event.
11. **`cta_booking`** — Click hero secondary "Schedule private viewing". Confirm event.
12. **`roi_calculator_click`** — Click the ROI banner. Confirm event.
13. **`book_viewing`** — Fill the form and submit. Confirm event with form payload.

If any event fails to fire, **do not merge.** Roll back to the last green state and isolate which fix broke which event.

### Dashboard sanity check

After all 13 events fired correctly, open `/unified/overview` in a separate tab. Confirm:
- VIP Sessions counter has incremented (you triggered `portal_opened`)
- Website Visitors counter incremented if applicable
- "Today's brief" reflects the new tap activity (may take a few seconds for the aggregate to update)
- Sales Triggers panel shows Khalid Al-Rashid as a recent name with the new behavioral events

If the dashboard is dark or shows zero where you just generated activity, tracking is broken even if individual Firestore writes succeeded — investigate the aggregation pipeline (`aggregateTaps` Cloud Function).

---

## Rollback plan

All 8 fixes are isolated:

| Fix | Rollback cost |
|---|---|
| 1. Fonts | Remove `<link>` from index.html, restore old `@font-face`. 5 min. |
| 2. Amenities icons | `git checkout` the AMENITIES object + render JSX. 5 min. |
| 3. ROI CTA color | Revert CSS file. 2 min. |
| 4. RTL handler | Revert `toggleLang` + `useEffect`. 5 min. Tracking still fires either way because we didn't touch trackEvent calls. |
| 5. Sentence case | Revert i18n dictionary. 10 min. |
| 6. Fade cap | Revert CSS. 2 min. |
| 7. WhatsApp recolor | Revert CSS. 2 min. |
| 8. Hero CTAs | (No change made) |

No data migrations, no Firestore schema changes, no Cloud Function redeploy. Hosting-only rollback via `firebase hosting:clone`.

---

## Out of scope for this PR

- Gulf-specific imagery swap (Fix 5 from audit) — separate sprint with Artistly v6 asset generation
- Click-into unit detail modal audit — separate audit pass
- Ahmed family-buyer portal — separate audit + PR
- Marketplace portal — separate audit + PR
- Cross-region token swap verification (Gulf → USA → Mexico → Canada) — separate verification task
- Mobile responsive at 375/768 — separate verification task

---

## Estimated diff

| File | Lines changed | Risk |
|---|---|---|
| `frontend/index.html` | +3 (font links) | Low |
| `frontend/src/index.css` (or global) | +15 (font-family rules) | Low |
| `frontend/src/pages/VIPPortal/VIPPortal_Definitive.jsx` | ~40 (AMENITIES rewrite, toggleLang extension, mount effect, render line update, sentence case in i18n) | Medium — tracking-adjacent |
| `frontend/src/pages/VIPPortal/VIPPortal_Definitive.css` (if exists) | ~30 (ROI palette, WhatsApp recolor, arrow pseudo-elements, fade cap) | Low |
| Various CSS files | Delete old `@font-face Super * VF` blocks | Low |

Total: ~90 lines net change across 4–5 files. One PR, one reviewer (Oguzhan).

---

## Commit message template

```
polish(khalid-portal): albeni sweep — fonts, icons, RTL, palette

- Load Cormorant Garamond + Outfit + Noto Kufi Arabic via Google Fonts
- Replace 8 amenity emoji with Tabler outline icons (gold accent)
- ROI calculator CTA: red → gold (match hero treatment); 📊 → ti-calculator
- RTL root attrs: set document.documentElement.dir/lang in toggleLang + mount
- WhatsApp FAB recolor: dark with gold ring (palette cohesion)
- Sentence case sweep on user-facing strings (acronyms preserved)
- ASCII -> → Unicode → arrow sweep
- Cap fade-in transitions at 400ms (was 1.5s+)

Tracking preserved: 13/13 trackEvent calls intact and verified firing.
Audit: docs/VIP_PORTAL_KHALID_AUDIT_2026_05_13.md
Directive: docs/CURSOR_DIRECTIVE_KHALID_PORTAL_2026_05_13.md
```

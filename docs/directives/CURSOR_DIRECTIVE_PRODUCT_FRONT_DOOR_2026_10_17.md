# CURSOR DIRECTIVE — Product front door: /unified becomes the authenticated landing

**Branch:** `feat/product-front-door` (cut from `main` **after** `feat/yacht-landing` is merged)
**Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`, `docs/SITEMAP_2026_10_17.md` §6

---

## 1. Goal

Today every authenticated path leads to the free digital business card and none lead to the product.
`Login.jsx` sends all three auth flows to `/dashboard`; `Navbar.jsx` shows two "My Card" links and zero
`/unified` links; `CardDashboard.jsx` has no outbound link to `/unified`. The only doors to the Sales
Velocity Engine are the featured cards on three **public demo gateways** — so a paying client must leave
the app and walk through a sales demo to reach their own dashboard.

When this is done: login lands on `/unified`, the business card lives inside the Unified shell as
`/unified/my-card` styled with `ud-` tokens, `/dashboard` still resolves (printed QR codes and bookmarks
must not break), and the Navbar carries one authenticated link — Dashboard.

**Positioning rule for this work:** the digital business card is an included extra, never the product.
It is the last item in the sidebar and it is never the landing page.

---

## 2. Scope

**Touch:**
- `frontend/src/App.jsx` — route changes only
- `frontend/src/pages/Login/Login.jsx` — 3 redirect targets
- `frontend/src/components/Navbar/Navbar.jsx` — authenticated links
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` — one `TABS` entry + one `TAB_GROUPS` index
- **New:** `frontend/src/pages/UnifiedDashboard/tabs/MyCardTab.jsx`
- **New:** `frontend/src/pages/UnifiedDashboard/tabs/MyCardTab.css`
- **Delete at the end of step 6:** `frontend/src/pages/CardDashboard/` (both files)

**Do NOT touch:** `/admin/*`, `backend/`, `firebase.js`, `cards` Firestore collection structure,
`pages/CreateCard/`, `pages/EditCard/`, `pages/CreatePhysicalCard/`, `pages/Card/`, any pricing file,
`.cursorrules`.

### 2b. Known `/dashboard` references — leave every one of them alone

Verified on `main` at `06679bd9` (after PRs #31–#33). These files still send users to `/dashboard`.
**Do not edit them.** Step 1 keeps `/dashboard` as a `<Navigate>` to `/unified/my-card`, so every one of
these lands on the new tab with no code change. Most are in the do-not-touch list above.

| File | Lines | What it does |
|---|---|---|
| `pages/CreateCard/CreateCard.jsx` | 269, 516, 595 | after save · Cancel · "Return to Dashboard" |
| `pages/EditCard/EditCard.jsx` | 141, 161, 306, 343 | after save (mobile + desktop) · logo click · "Back to Dashboard" |
| `pages/Card/Card.jsx` | 299 | dock button on the public card view |
| `components/Onboarding/Onboarding.jsx` | 31, 60, 89, 118, 147 | onboarding step targets |
| `components/WhatsAppButton/WhatsAppButton.jsx` | 66 | `hidePaths` includes `/dashboard` |

The `WhatsAppButton` entry is the only one that changes behaviour: the floating button was hidden on
`/dashboard`, and `/unified/my-card` is not in `hidePaths`. **Report what you see** (QA line 11) — do not
edit the file.

Verified facts this directive relies on, so you do not have to re-derive them:
- `ProtectedRoute` checks authentication only — no admin check — so every logged-in user can reach `/unified`.
- `TAB_GROUPS` is consumed as `TABS.slice(group.startIdx, group.endIdx + 1)` — `endIdx` is **inclusive**.
  Today: 9 tabs, `settings` at index 8, `system` = `{ startIdx: 8, endIdx: 8 }`.
- `CardDashboard.jsx` has one more hardcoded string than §5 lists: `prompt('Copy:', …)` at line 253.
  The "every string through `UI`" rule covers it.
- **Create no file that is not listed in §2.** No notes, no sitemap, no report file — the report goes in
  your reply.

---

## 3. Steps

### Step 1 — `App.jsx` routes

Replace the `/dashboard` route with a redirect, and add the tab under `/unified`.

```jsx
// ── Authenticated Pages ──
// was: <Route path="/dashboard" element={<ProtectedRoute><P><CardDashboard /></P></ProtectedRoute>} />
<Route path="/dashboard" element={<Navigate to="/unified/my-card" replace />} />
```

Inside the existing `/unified` route block, add **immediately before** the `settings` child:

```jsx
<Route path="my-card" element={<MyCardTab />} />
```

Add the lazy import next to the other tab imports; remove the now-unused `CardDashboard` lazy import.
`Navigate` is already imported (used by `/real-estate`, `/automotive/dashboard`).

### Step 2 — `Login.jsx` redirect targets

Three occurrences, lines ~198, ~207, ~240:

```js
setTimeout(() => navigate('/dashboard'), 800);   // before
setTimeout(() => navigate('/unified'), 800);     // after
```

All three change. Do not add plan-based branching — a free-tier-only user is **not** a target segment
for this product, and `useDashboardData` auto-seeds a new tenant on first `/unified` load
(`hooks/useDashboardData.js:182-189`), so no account ever lands on an empty dashboard.

### Step 3 — `Navbar.jsx`

- **Delete** the mobile "My Card" shortcut block (~line 105, `.nav-mobile-card-btn`).
- **Replace** the in-menu "My Card" link (~line 173) with a Dashboard link to `/unified`, keeping the
  same `nav-link` styling. Use a grid/layout icon, not a card icon.
- Add a `dashboard` key to the `TR` object in all five languages:
  `en: 'Dashboard'` · `it: 'Dashboard'` · `fr: 'Tableau de bord'` · `es: 'Panel'` · `ar: 'لوحة التحكم'`
- Leave the `myCard` TR key in place (unused keys are harmless; removing it risks a parity test miss).
- Everything else in the navbar is unchanged: email, ADMIN badge, Logout, language select.

Delete `.nav-mobile-card-btn` and `.nav-link-card` rules from `Navbar.css` only if nothing else uses them.

### Step 4 — `UnifiedLayout.jsx` sidebar

⚠ **`TAB_GROUPS` indexes into `TABS` by position** (`startIdx` / `endIdx`). Inserting anywhere other
than the end silently regroups the sidebar. Insert **at the end of `TABS`, before `settings`**, then
widen only the `system` group:

```js
// TAB_GROUPS — only the system entry changes:
{ id: "system", ..., startIdx: 8, endIdx: 9 },
```

New `TABS` entry at index 8 (settings shifts to 9):

```js
{
  path: "my-card",
  label: { en: "My Business Card", it: "Il mio biglietto", ar: "بطاقتي", es: "Mi tarjeta", fr: "Ma carte" },
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M14 10h4M14 14h4M5 16c.8-1.5 4.2-1.5 5 0" />
    </svg>
  ),
},
```

Label is **"My Business Card"**, not "My Card" — the sidebar already has an "NFC Cards" tab (product
inventory, tenant-isolated) and the two must not read as the same thing.

`UnifiedLayout.jsx` is 1063 lines → Large File Protocol applies after this edit (see §4).

### Step 5 — `MyCardTab.jsx` (restyle, not port)

Port the logic of `pages/CardDashboard/CardDashboard.jsx` (264L) and restyle it against the Unified
design system. Keep behaviour identical; change presentation and strings.

**Keep as-is:**
- Firestore subscription: `query(collection(db, "cards"), where("userId", "==", uid))` + `onSnapshot`.
  This is the top-level `cards` collection, **not** `tenants/{uid}/cards`. Do not migrate it in this PR.
- `primaryCard` / `otherCards` split, delete, share (Web Share API → clipboard fallback), QR modal.
- Navigation targets `/create-card`, `/edit-card?hashId=`, `/create-physical-card`, `/card/?hashId=`.

**Change:**
- **Drop** `<SEO>` — the tab renders inside an authenticated shell that owns the document head.
- **Drop** the page-level wrapper `<div className="cd">`; the tab renders into `UnifiedLayout`'s outlet.
- **Drop** the sticky mobile action bar (`cd-sticky-*`) — it collides with the Unified bottom nav.
- **Classes:** shared chrome uses `ud-` classes copied from a sibling tab (`CardsTab.jsx` is the closest
  reference — section header, card surface, buttons, empty state). Only genuinely card-specific visuals
  (the card hero, the cover image, the avatar ring, the QR modal) get new classes in `MyCardTab.css`
  with prefix **`udmc-`**. Follow the `CampaignsTab.jsx` + `CampaignsTab.css` precedent.
- **Colours:** no hardcoded hex. Use the existing `ud-` CSS custom properties so light/dark and the
  region accent work. The current file's fixed colours must not survive the port.
- **i18n — this is a defect fix, not a nice-to-have.** `CardDashboard.jsx` hardcodes English:
  `"Delete this card?"`, `"My Cards"`, `"Check out my digital business card"`, `"Copy this link:"`,
  `"Delete failed."`. Every user-facing string goes through a local `UI = { en, it, ar, es, fr }` object
  read with `useLanguage()` / `useTranslation()`, matching the pattern at the top of `CardsTab.jsx`.
- **RTL:** logical properties only (`margin-inline-start`, `padding-inline`, `inset-inline-start`).
  No `left` / `right` / `margin-left`.
- Replace `window.confirm` / `alert` / `prompt` with the Unified confirm + toast pattern already used in
  the dashboard. If no shared toast exists, keep `window.confirm` for delete and say so in the report —
  **do not invent a new modal system in this PR.**

**Empty state:** keep it, restyle it, and make the copy frame the card as an included extra, e.g.
`en: "Your digital business card — included with your plan."` + a single "Create card" action.
No pricing talk, no upsell, no mention of plan tiers.

### Step 6 — delete the old page

After step 5 builds and renders, delete `frontend/src/pages/CardDashboard/CardDashboard.jsx` and
`CardDashboard.css`. Confirm no imports remain:

```powershell
Select-String -Path "frontend\src\**\*.jsx","frontend\src\**\*.js" -Pattern "CardDashboard" -SimpleMatch
```

Must return nothing.

---

## 4. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint          # 0 errors (pre-existing warnings OK, none in touched files)
npm test              # all tests pass, including translationParity
npm run build         # must pass

(Get-Content "src\pages\UnifiedDashboard\UnifiedLayout.jsx").Length
Get-Content "src\pages\UnifiedDashboard\UnifiedLayout.jsx" -Tail 40
```

Manual QA in the browser — paste the result of each line:

1. Log in → lands on `/unified` (Overview), **not** `/dashboard`.
2. Visit `/dashboard` directly → redirects to `/unified/my-card`, no flash of the old page.
3. Sidebar: "My Business Card" is the second-to-last item, under **System**, above Settings.
   Intelligence and Operations groups contain exactly the same tabs as before.
4. `/unified/my-card`: existing card renders, Preview / Edit / Delete / Share / QR all work.
5. Same page with no cards → empty state renders, "Create card" goes to `/create-card`.
6. Language cycle on `/unified/my-card`: every visible string changes. No English left in IT/FR/ES.
7. Dark mode toggle → no unreadable text, no hardcoded light background.
8. Navbar logged in: one Dashboard link to `/unified`, no "My Card" link, mobile menu included.
9. 375 px: no horizontal overflow on `/unified/my-card`.
10. Logged out: navbar unchanged from `main`.
11. `/unified/my-card`: is the floating WhatsApp button visible? Report yes/no only — do not edit
    `WhatsAppButton.jsx`.
12. Create a card from `/unified/my-card` → after save you land back on `/unified/my-card` (via the
    `/dashboard` redirect), not on the old page.

---

## 5. Do not

- No deploy. Hosting deploys are `npm run deploy`, run by Oguzhan.
- No new dependencies.
- No `console.log` left in frontend code.
- No change to Pricing, Home, or any marketing copy — positioning copy is a separate decision.
- No migration of the `cards` collection to tenant-isolated storage.
- No refactor of `UnifiedLayout.jsx` beyond the two additions in step 4.
- No plan-tier gating logic anywhere.
- Keep it minimal: this PR should **remove** more lines than it adds outside `MyCardTab.*`.

---

## 6. Report back

Paste to Oguzhan:
1. `npm run lint` / `npm test` / `npm run build` output (tails are fine).
2. `UnifiedLayout.jsx` line count + last 40 lines.
3. The `Select-String` result from step 6 (must be empty).
4. Answers to the 12 manual QA lines, one line each — an unrun check is **NOT RUN**, never PASS.
5. Anything you had to decide that this directive did not specify.

Per the mutual-audit rule, Claude audits this diff before anything is committed.

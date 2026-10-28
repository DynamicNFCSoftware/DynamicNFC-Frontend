# CURSOR DIRECTIVE — My Business Card becomes a standalone page at `/my-card`

**Amends:** `CURSOR_DIRECTIVE_PRODUCT_FRONT_DOOR_2026_10_17.md`
**Branch:** `feat/product-front-door` — work **on top of the current uncommitted changes**. Do not reset,
stash, or revert anything you were not told to.
**Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`

## 1. Goal

Oguzhan reviewed `/unified/my-card` in the browser. Inside the Unified shell the page carries the sector
switcher, the demo company name, "Dealer Intelligence Center", the region selector, Live/Demo,
Readable, and Export PDF — none of which mean anything for a business card. Decision: the business card
is a **standalone page at `/my-card`**, under the normal site Navbar (which already gives it the logo,
language select, the Dashboard link and Logout).

What stays from the front-door work: login lands on `/unified`; the site Navbar has one Dashboard link;
the Unified sidebar keeps a **"My Business Card"** item under System — it now opens `/my-card`.

## 2. Scope

**Create:**
- `frontend/src/pages/MyCard/MyCard.jsx` — from `tabs/MyCardTab.jsx`
- `frontend/src/pages/MyCard/MyCard.css` — from `tabs/MyCardTab.css`

**Edit:**
- `frontend/src/App.jsx`
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx`
- `frontend/src/components/WhatsAppButton/WhatsAppButton.jsx` — one string

**Delete:** `frontend/src/pages/UnifiedDashboard/tabs/MyCardTab.jsx` and `MyCardTab.css`

**Keep exactly as they are now:** the `.ud-nav { flex: 1 0 auto; }` fix in `UnifiedLayout.css`, `Login.jsx`,
`Navbar.jsx`, `Navbar.css`, the deletion of `pages/CardDashboard/`.

**Do not touch:** `/admin/*`, `backend/`, `firebase.js`, the `cards` collection, `CreateCard`, `EditCard`,
`CreatePhysicalCard`, `Card`, `Onboarding`, `navigation/shellVisibility.js`, `UnifiedLayout.css` (beyond
what is already there), `.cursorrules`.

**Create no file that is not listed above.** The report goes in your reply.

## 3. Verified facts (do not re-derive)

- `navigation/shellVisibility.js` → `shouldHideNavbar` does not match `/my-card`, so the site Navbar and
  breadcrumb render there automatically. Nothing to add.
- Every `--ud-*` variable and every `ud-ci-*` class `MyCardTab` uses is defined **only** in
  `UnifiedLayout.css`, scoped to the Unified layout. Outside the shell they do not exist.
- `TABS` in `UnifiedLayout.jsx` is consumed in exactly one place: the `NavLink` map in the sidebar
  (`to={tab.path || "."}`). An absolute path there is safe.
- `MyCardTab` currently uses these shell classes: `ud-btn-ghost` `ud-btn-primary` `ud-card`
  `ud-ci-bulk-btn` `ud-ci-bulk-btn--ghost` `ud-ci-bulk-btn--primary` `ud-ci-confirm`
  `ud-ci-confirm-backdrop` `ud-ci-empty` `ud-ci-toast` `ud-ci-toast--*`. And these variables:
  `--ud-accent` `--ud-bg` `--ud-card-bg` `--ud-sidebar-border` `--ud-text` `--ud-text-secondary`.

## 4. Steps

### Step 1 — Move the component

Create `pages/MyCard/MyCard.jsx` from `tabs/MyCardTab.jsx`. Rename the component to `MyCard`. Fix the
import paths (`../../contexts/AuthContext`, `../../i18n`, `../../firebase`, `./MyCard.css`). **Logic does
not change**: same Firestore subscription on top-level `cards` (`where("userId", "==", uid)`), same
actions, same navigation targets, same confirm/toast behaviour.

### Step 2 — Make it self-contained

- Root element: `<main className="mc-page">`, with an inner `.mc-container` (`max-width: 960px`,
  centred, `padding-inline: 1.25rem`, `padding-block: 2rem 4rem`).
- Rename every `udmc-` class to `mc-`.
- Replace every `ud-` class listed in §3 with an `mc-` class defined in `MyCard.css`. Copy only the rules
  you actually need from `UnifiedLayout.css` and rewrite them against the page's own tokens.
  **Do not import `UnifiedLayout.css`** or any other page's CSS.
- Define the tokens once, on `.mc-page`, and nowhere else:

  ```css
  .mc-page {
    --mc-bg: #faf8f5;        /* brand cream */
    --mc-card-bg: #ffffff;
    --mc-text: #1a1a1f;      /* brand charcoal */
    --mc-accent: #457b9d;    /* brand blue — primary */
    --mc-danger: #e63946;    /* brand red — delete */
    --mc-text-secondary: color-mix(in srgb, var(--mc-text) 65%, transparent);
    --mc-border: color-mix(in srgb, var(--mc-text) 12%, transparent);
    background: var(--mc-bg);
    min-height: 100vh;
  }
  ```

  Every other rule uses `var(--mc-*)` only. **No hex value outside this block.**
- Light only — no dark mode, no reading `ud-theme`.
- Keep the avatar fix: `.mc-info { position: relative; z-index: 1; }` (the cover is positioned and
  otherwise paints over the avatar).
- Logical properties only (`margin-inline-start`, `padding-inline`, `inset-inline-*`). No `left`/`right`.

### Step 3 — Page header + strings

Above the card, in this order:
1. A `<Link to="/unified" className="mc-back">` with `ui.backToDashboard`.
2. An `<h1 className="mc-title">` with `ui.pageTitle`, in Playfair Display (the site heading font).

Add both keys to the existing `UI` object, all five languages. `pageTitle` matches the sidebar label:

| key | en | it | fr | es | ar |
|---|---|---|---|---|---|
| `pageTitle` | My Business Card | Il mio biglietto | Ma carte | Mi tarjeta | بطاقتي |
| `backToDashboard` | ← Back to Dashboard | ← Torna alla Dashboard | ← Retour au tableau de bord | ← Volver al panel | → العودة إلى لوحة التحكم |

Add `<SEO title={ui.pageTitle} path="/my-card" />` so the browser tab is named correctly.

### Step 4 — `App.jsx`

- Remove the `MyCardTab` lazy import and `<Route path="my-card" element={<MyCardTab />} />` from the
  `/unified` block.
- Add `const MyCard = lazy(() => import("./pages/MyCard/MyCard"));` next to `CreateCard` / `EditCard`.
- Add, next to `/create-card`:
  ```jsx
  <Route path="/my-card" element={
    <ProtectedRoute><P><MyCard /></P></ProtectedRoute>
  } />
  ```
- `/dashboard` now redirects here:
  ```jsx
  <Route path="/dashboard" element={<Navigate to="/my-card" replace />} />
  ```

### Step 5 — `UnifiedLayout.jsx`

- In the `my-card` `TABS` entry, change `path: "my-card"` to `path: "/my-card"` (absolute — the link
  leaves the shell). Label and icon unchanged. `TAB_GROUPS` stays `system: { startIdx: 8, endIdx: 9 }`.
- Revert the `activeGroupId` line to its original form — the `/my-card` branch can no longer be reached
  inside `/unified`:
  ```js
  if (path.includes("/settings")) return "system";
  ```

### Step 6 — `WhatsAppButton.jsx`

Line ~66: add `'/my-card'` to `hidePaths`. The button was hidden on the old `/dashboard` card page.

### Step 7 — Delete the tab

Delete `tabs/MyCardTab.jsx` and `tabs/MyCardTab.css`, then:

```powershell
Select-String -Path "frontend\src\**\*.jsx","frontend\src\**\*.js","frontend\src\**\*.css" -Pattern "MyCardTab","udmc-" -SimpleMatch
```

Must return nothing.

## 5. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint
npm test
npm run build
```

0 lint errors (pre-existing warnings OK, none in touched files), all tests pass, build passes.

You cannot log in, so run only these and report each as PASS / FAIL / NOT RUN:
1. Logged out, `/my-card` → redirects to `/login`.
2. Logged out, `/dashboard` → `/my-card` → `/login`.
3. `Select-String` from step 7 is empty.
4. `MyCard.css` contains no hex value outside the `.mc-page` token block (paste the grep).
5. `MyCard.css` contains no `left:` / `right:` / `margin-left` / `margin-right` (paste the grep).

The logged-in checks are Oguzhan's.

## 6. Do not

- No deploy. No commit.
- No new dependencies. No `console.log`.
- No change to card logic, Firestore queries, or navigation targets.
- No dark mode on this page.
- No new shared component, no new modal system.

## 7. Report back

Lint / test / build tails, checks 1–5, line counts of `MyCard.jsx` and `MyCard.css`, and anything you had
to decide that this directive did not specify. Claude audits before anything is committed.

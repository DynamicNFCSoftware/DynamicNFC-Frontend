# Sprint 2 #2 — FIX #1: Admin-Side Tracking

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (Cowork)
**Target branch:** `cursor/sprint-2-2-sales-trigger-panel` (amend the existing PR #8, do not open a new branch)
**Predecessor:** Commit `45d9cef9` on `cursor/sprint-2-2-sales-trigger-panel`.

---

## Why this fix exists

The initial directive specified `firestoreTracking.js → track("trigger_acted_on", ...)` for the panel's click event. Audit revealed two architectural mismatches:

1. **Session gate** — `track()` early-returns when `_session` is null. `_session` is initialized only by buyer-facing portals (VIPPortal, AhmedPortal, MarketplacePortal) via `initSession()`. On the admin Unified Dashboard, `_session` is never set, so the call silently no-ops with a `console.warn`.
2. **Write path** — Even if the session check passed, `track()` writes to the top-level `behaviors` collection (line ~151 of firestoreTracking.js). The Unified Dashboard reads from tenant-isolated `tenants/{uid}/events/`. Event would be invisible to `useDashboard()` listeners.

Net effect: the §15 audit gate "trigger_acted_on event writes to Firestore on click" **fails silently**. Decision Speed measurement (scope decision #7) does not work.

---

## Goal

Add an admin-side tracking helper that writes to the tenant-scoped events collection, and switch the Sales Trigger Panel to use it.

---

## Files to modify (2 only)

```
frontend/src/services/firestoreTracking.js                              ← +25 lines (new export)
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx    ← 2-line import + call change
```

DO NOT touch: any other file, any other tracking call site (`track()` keeps working for buyer portals), the EVENT_SCHEMA shape, the panel's render logic, the threshold values.

---

## 1. `firestoreTracking.js` — new export `trackDashboardEvent`

Append at the end of the file (after `trackLegacy`). Use the existing imports — do not add new ones unless needed.

```javascript
import { auth } from '../firebase';

/**
 * Admin-side tracking — writes to tenants/{uid}/events/.
 *
 * Use this from Unified Dashboard surfaces (panels, modals, action buttons).
 * Differs from track() in two ways:
 *   1. No session requirement (admin is logged in via Firebase Auth, not a portal session).
 *   2. Writes to tenant-isolated `tenants/{uid}/events/`, not top-level `behaviors`.
 *
 * @param {string} event — must exist in EVENT_SCHEMA
 * @param {object} payload — flat key/value details (vipId, ruleType, etc.)
 * @returns {Promise<void>} fire-and-forget; rejects only on auth missing
 */
export async function trackDashboardEvent(event, payload = {}) {
  const user = auth?.currentUser;
  if (!user?.uid) {
    console.warn('DynamicNFC dashboard tracking: no authenticated user.');
    return;
  }
  const schema = EVENT_SCHEMA[event];
  if (!schema) {
    console.warn(`DynamicNFC dashboard tracking: unknown event "${event}".`);
    return;
  }
  try {
    await addDoc(collection(db, 'tenants', user.uid, 'events'), {
      event,
      category: schema.category,
      label: schema.label,
      funnelWeight: schema.funnelWeight,
      source: 'dashboard',
      timestamp: serverTimestamp(),
      ...payload,
    });
  } catch (err) {
    console.warn('Dashboard tracking write failed:', err?.message || err);
  }
}
```

**Notes for Cursor:**

- Check whether `auth` is already exported from `../firebase` (Firebase Auth instance). If the export name is `firebaseAuth` or similar, use the actual name. Read `frontend/src/firebase.js` to confirm.
- If `addDoc`, `collection`, `serverTimestamp`, and `db` are already imported at the top of the file, do not re-import. Just add `auth` to the existing `from '../firebase'` import line.
- `source: 'dashboard'` distinguishes admin-side events from buyer-side events in the same collection — useful for future filtering.
- Spread `...payload` last so callers cannot accidentally overwrite the canonical fields (`event`, `category`, etc.).

---

## 2. `SalesTriggerPanel/index.jsx` — switch the import and call

### Import change (line 7)

Replace:
```javascript
import { track } from "../../../services/firestoreTracking";
```

With:
```javascript
import { trackDashboardEvent } from "../../../services/firestoreTracking";
```

### Call change (handleOpen, ~line 131-144)

Replace:
```javascript
const handleOpen = (trigger) => {
  try {
    track("trigger_acted_on", {
      vipId: trigger.vipId,
      ruleType: trigger.ruleType,
      urgency: trigger.urgency,
      triggerAgeMs: Date.now() - trigger.lastEventAt,
      signalKey: trigger.signalKey,
    });
  } catch {
    // Ignore tracking failures and continue navigation.
  }
  navigate("/unified/vip-crm", { state: { vipId: trigger.vipId } });
};
```

With:
```javascript
const handleOpen = (trigger) => {
  // Fire-and-forget — does not block navigation. Promise rejection swallowed inside helper.
  trackDashboardEvent("trigger_acted_on", {
    vipId: trigger.vipId,
    ruleType: trigger.ruleType,
    urgency: trigger.urgency,
    triggerAgeMs: Date.now() - trigger.lastEventAt,
    signalKey: trigger.signalKey,
  });
  navigate("/unified/vip-crm", { state: { vipId: trigger.vipId } });
};
```

The `try/catch` wrapper is unnecessary because `trackDashboardEvent` swallows its own errors internally.

---

## 3. Verify steps (must all pass before pushing the amend commit)

1. **`npm run build`** in `frontend/` — PASS, zero errors. Report new build time + module count.
2. **Lint clean** on both modified files.
3. **No references to the old `track` import** in `SalesTriggerPanel/index.jsx`:
   ```powershell
   Select-String -Path "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\index.jsx" -Pattern "\\btrack\\("
   ```
   Must return zero matches (only `trackDashboardEvent` should appear).
4. **`track()` for buyer portals untouched** — confirm with a sample grep:
   ```powershell
   Select-String -Path "frontend\src\pages\*\*Portal*.jsx" -Pattern "import.*track.*firestoreTracking"
   ```
   Should still return the existing `track` imports unchanged.
5. **Manual smoke test (`npm run dev`):**
   - Open `/unified/overview` while logged in (Firebase Auth must be active).
   - Click "Open profile" on any trigger.
   - Open Chrome DevTools → Network panel. Filter to `firestore.googleapis.com`. Confirm a **write** to `tenants/{your-uid}/events/` with `event: "trigger_acted_on"` payload.
   - If no Firestore write fires, check the Console for `"no authenticated user"` or `"unknown event"` warnings — both indicate a mis-import or auth gap.

---

## 4. Out of scope

- Any other modification to `firestoreTracking.js` beyond the new export.
- Firestore security rules — `tenants/{uid}/events/` write permission already exists for the authenticated tenant owner (verify in `firestore.rules` only if the write returns a permission-denied error during smoke test).
- VIPCrmTab inline-style cleanup — separate cleanup pass, do not touch in this fix.
- Refactoring buyer-side `track()` — out of scope, keep buyer-portal behavior exactly as is.

---

## 5. Amend protocol

After verification passes, **amend the existing PR #8** — do not open a new PR:

```powershell
git add frontend/src/services/firestoreTracking.js frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx
git commit -m "fix(stp): dashboard tracking via trackDashboardEvent (Sprint 2 #2 FIX 1)"
git push origin cursor/sprint-2-2-sales-trigger-panel
```

PR #8 will pick up the new commit automatically. Report the new commit SHA back to Claude for re-audit.

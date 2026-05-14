# Faz 1 Test Seed — Wave 2 (40+ tests → reach ~120 total)

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (Cowork)
**Branch:** `cursor/faz1-wave2-tests`
**Predecessor:** Wave 1 (commit on `main`) — 79 passing tests across portalSignals, triggerRules, regionConfig, eventDisplayMap, sectorConfig, googleLiveApi, ProtectedRoute, Login, AIDemo.

---

## 1. Goal

Bring the test suite from **79 passing → 120+ passing**, all green, all under 6 seconds total run time.

Wave 1 covered pure-JS modules. Wave 2 adds:
- **A.** `firestoreTracking.js` — admin + buyer tracking helpers
- **B.** `useDashboard.js` context wrapper
- **C.** Component render tests (KpiCard, MiniSparkline, SalesTriggerPanel)
- **D.** Shared test utility (`testUtils/renderWith.jsx`)

---

## 2. Read first (mandatory)

1. `frontend/src/pages/UnifiedDashboard/lib/portalSignals.test.js` — Wave 1 pure-function pattern (fixed `NOW` timestamp, helper event/vip factories, describe blocks per concern).
2. `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/triggerRules.test.js` — Wave 1 mocking-light pattern with seed-style fixtures.
3. `frontend/src/pages/AIDemo/AIDemo.security.test.jsx` — Wave 1 RTL pattern showing `HelmetProvider` + `MemoryRouter` wrapping.
4. `frontend/src/services/firestoreTracking.js` — full file; pay special attention to `track()` (line ~106), `trackDashboardEvent()` (end of file), `EVENT_SCHEMA`, `calculateEngagementScore()`.
5. `frontend/src/pages/UnifiedDashboard/useDashboard.js` — tiny context wrapper.
6. `frontend/src/pages/UnifiedDashboard/components/KpiCard.jsx` and `MiniSparkline.jsx` — read both end-to-end.
7. `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx` — to understand what mocks the test needs.

---

## 3. Files to create

```
frontend/src/testUtils/renderWith.jsx                                                       (~40L — utility)
frontend/src/services/__tests__/firestoreTracking.test.js                                   (~200L — ~15 tests)
frontend/src/pages/UnifiedDashboard/__tests__/useDashboard.test.jsx                         (~80L — ~4 tests)
frontend/src/pages/UnifiedDashboard/components/__tests__/KpiCard.test.jsx                   (~80L — ~5 tests)
frontend/src/pages/UnifiedDashboard/components/__tests__/MiniSparkline.test.jsx             (~70L — ~4 tests)
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/__tests__/index.test.jsx         (~150L — ~6 tests)
```

**Do NOT modify** any production source file. Tests must work against the current code as-is. If a test reveals a bug, document it in the PR description — do not fix in this PR.

---

## 4. Section A — `firestoreTracking.test.js` (~15 tests)

### A.1 Setup — Firebase mock

At the top of the test file:

```javascript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the firebase wrapper module so tests don't try to talk to a real backend.
vi.mock("../../firebase", () => ({
  db: { __mock: "firestore" },
  auth: { currentUser: null }, // override per-test
}));

// Mock the firestore primitives we call inside the service.
vi.mock("firebase/firestore", () => ({
  collection: vi.fn((...args) => ({ __collectionRef: args.slice(1).join("/") })),
  addDoc: vi.fn(() => Promise.resolve({ id: "fake-doc-id" })),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  increment: vi.fn((n) => ({ __op: "increment", n })),
  serverTimestamp: vi.fn(() => ({ __op: "serverTimestamp" })),
}));

import { auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  EVENT_SCHEMA,
  trackDashboardEvent,
  calculateEngagementScore,
  describeEvent,
  getCategoryIcon,
  getCategoryColor,
} from "../firestoreTracking";

beforeEach(() => {
  vi.clearAllMocks();
  auth.currentUser = null;
});
```

### A.2 EVENT_SCHEMA shape (3 tests)

- `EVENT_SCHEMA` contains expected keys: `portal_open`, `unit_view`, `book_viewing`, `contact_advisor`, `trigger_acted_on`
- Every entry has `category` ∈ `{browse, engage, intent, action}` and a numeric `funnelWeight`
- `trigger_acted_on` is in `action` category with `funnelWeight: 12`

### A.3 `trackDashboardEvent` — admin-side tracking (5 tests)

- No authenticated user → returns without writing, no `addDoc` call (assert `addDoc.mock.calls.length === 0`)
- Unknown event name → returns without writing, no `addDoc` call
- Authenticated + known event → calls `addDoc` exactly once
- Authenticated + known event → write payload contains `event`, `category`, `label`, `funnelWeight`, `source: "dashboard"`, `timestamp`, plus any extra payload keys
- Authenticated + known event → write target is `tenants/{uid}/events` (assert via `collection` mock call args)

Mock pattern for "authenticated":
```javascript
auth.currentUser = { uid: "test-uid-123" };
await trackDashboardEvent("trigger_acted_on", { vipId: "khalid", ruleType: "HIGH_INTENT" });
expect(addDoc).toHaveBeenCalledTimes(1);
const [, payload] = addDoc.mock.calls[0];
expect(payload.event).toBe("trigger_acted_on");
expect(payload.source).toBe("dashboard");
expect(payload.vipId).toBe("khalid");
```

### A.4 `calculateEngagementScore` — pure function (4 tests)

- Empty events array → returns `{ score: 0, label: "NEW", stage: "none" }`
- Events with only `portal_open` × 2 → score reflects session points
- Events with `pricing_request` → score jumps significantly (intent signal)
- Events with `book_viewing` → score reflects action stage; result.stage is "action"

### A.5 `describeEvent` (2 tests)

- Known event with unit context → label includes unit name
- Unknown event code → falls back to event code itself

### A.6 Category helpers (1 test)

- `getCategoryIcon("intent")` returns the 🎯 emoji (or whatever the actual value is — read source first)
- `getCategoryColor("action")` returns a hex string (assert format `/^#[0-9a-f]{6}$/i`)

---

## 5. Section B — `useDashboard.test.jsx` (~4 tests)

The hook is a thin context consumer. Tests verify:

1. **Throws** when called outside a `DashboardDataContext.Provider`
2. **Returns** the context value when inside provider
3. **Returns same reference** on re-render when context value is stable
4. **Returns new reference** when context value changes

Pattern:
```jsx
import { renderHook } from "@testing-library/react";
import { DashboardDataContext } from "../useDashboard";
import { useDashboard } from "../useDashboard";

it("throws when used outside provider", () => {
  expect(() => renderHook(() => useDashboard())).toThrow(/useDashboard must be inside/);
});

it("returns context value inside provider", () => {
  const value = { events: [], vips: [], deals: [] };
  const wrapper = ({ children }) => (
    <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
  );
  const { result } = renderHook(() => useDashboard(), { wrapper });
  expect(result.current).toBe(value);
});
```

---

## 6. Section C — Component render tests (~15 tests)

### C.1 First — create the test utility `frontend/src/testUtils/renderWith.jsx`

```jsx
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

/**
 * Wraps render() with the global providers most Unified Dashboard components
 * need: HelmetProvider (for <SEO>), MemoryRouter (for <Link>, useLocation, etc.).
 *
 * Usage:
 *   renderWith(<MyComponent />);
 *   renderWith(<MyComponent />, { route: "/some/path" });
 */
export function renderWith(ui, { route = "/" } = {}) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}
```

### C.2 `KpiCard.test.jsx` (~5 tests)

Read the `KpiCard.jsx` component first to see exact props. Likely tests:

1. Renders `label` prop as visible text
2. Renders `value` prop as visible text (handle number formatting if any)
3. Renders `subtitle` when provided
4. Does NOT render subtitle when `subtitle` is null/undefined
5. Renders the `sparkline` slot (pass a mock element, assert its presence)

### C.3 `MiniSparkline.test.jsx` (~4 tests)

1. Empty `data` array → renders nothing or empty placeholder (no crash)
2. Single-point data → renders without crash
3. Multi-point data → renders an `<svg>` element with `path` or `polyline` inside
4. Custom `color` prop → SVG element uses that color (`getAttribute('stroke')` or similar)

### C.4 `SalesTriggerPanel/__tests__/index.test.jsx` (~6 tests)

Use `vi.mock` to fake `useDashboard`, `useRegion`, `useSector`, and `firestoreTracking`. Pattern:

```jsx
import { vi } from "vitest";

vi.mock("../../../pages/UnifiedDashboard/useDashboard", () => ({
  useDashboard: () => ({ events: [], vips: [], deals: [] }),
}));
vi.mock("../../../hooks/useRegion", () => ({
  useRegion: () => ({ regionId: "gulf", region: { sidebarAccent: "#b8860b" } }),
}));
vi.mock("../../../hooks/useSector", () => ({
  useSector: () => ({ config: { id: "realEstate" } }),
}));
vi.mock("../../../i18n", () => ({
  useTranslation: () => (key) => key,
  useLanguage: () => ({ lang: "en" }),
}));
vi.mock("../../../services/firestoreTracking", () => ({
  trackDashboardEvent: vi.fn(),
}));
```

Tests:

1. **Empty events** → renders "stpEmpty" empty-state copy, no row elements
2. **One HOT trigger** → renders 1 row with hot urgency class
3. **5 HOT + 3 WARM** → renders divider element between buckets (`.stp-divider`)
4. **Score chip** renders when trigger has score, hidden when null
5. **Click "Open profile"** → calls `trackDashboardEvent` with `trigger_acted_on` + vipId payload
6. **Click "Open profile"** → calls `navigate` with `/unified/vip-crm` and `state.vipId`

For the click test, mock `useNavigate`:
```jsx
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});
```

To get events/vips with predictable trigger output, use the same fixture helpers from `triggerRules.test.js` (copy them into the test file or — better — extract to `testUtils/fixtures.js` in a follow-up PR; not in scope for this one).

---

## 7. Verify steps (must all pass before pushing)

1. **`npm test`** — all tests green, zero failures
2. Total test count: **~120+** (`Tests N passed | 5 todo (M)` where N ≥ 120)
3. Run time stays under 6 seconds (`Duration < 6.0s`)
4. **No `console.error` output** in test runs except known React Router future-flag warnings (those are noise, ignore)
5. Banned patterns sanity:
   ```powershell
   Select-String -Path "frontend\src\**\*.test.*" -Pattern "skip\(|\.only\("
   ```
   Zero results — no accidentally skipped or focused tests.

---

## 8. Out of scope (do NOT do)

- `useDashboardData.js` deep test (~1260L Firestore data hook) — requires Firestore emulator setup, deferred to Wave 3
- `UnifiedLayout.jsx` rendering — too many context dependencies, deferred
- `AdminLayout.jsx` and admin tabs — entire admin panel is `/admin/*` Do Not Touch per CLAUDE.md
- `App.jsx` routing — too complex, deferred to Playwright E2E (Faz 3)
- Modifying any production source code
- Fixing the 5 todo tests in `CampaignsTab.test.jsx` (those are placeholders for a future Cursor sprint)

---

## 9. Tone for the PR description

> Faz 1 Wave 2 — admin-side tracking helper coverage, useDashboard context, component render tests with new `testUtils/renderWith.jsx` helper. Suite: 79 → ~120 passing tests. Run time under 6s. Zero production source changes.

---

## 10. Audit gates Claude will check on the returned PR

- [ ] `npm test` passes locally — exact pass count reported in PR body
- [ ] Test count ≥ 120 (currently 79; we expect +41 minimum)
- [ ] Run duration < 6s
- [ ] No production source files modified (diff stat should be 100% test files + 1 utility)
- [ ] `testUtils/renderWith.jsx` is small (~40 lines), reusable across components
- [ ] `firestoreTracking.test.js` covers `trackDashboardEvent` no-auth, no-schema, success paths
- [ ] `SalesTriggerPanel` component test mocks the four hooks cleanly without overlap
- [ ] No `.only` / `.skip` / commented-out tests
- [ ] No `console.log` in test files (Vitest test output should be clean)

**Cursor:** push to `cursor/faz1-wave2-tests`, DO NOT merge. Oguzhan + Claude audit, then merge.

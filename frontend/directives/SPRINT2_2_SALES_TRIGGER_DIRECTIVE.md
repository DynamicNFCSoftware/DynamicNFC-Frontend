# Sprint 2 #2 — Sales Trigger Panel (REVISED 2026-05-11 PM)

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (Cowork)
**Branch:** `cursor/sprint-2-2-sales-trigger-panel`
**Predecessor:** Sprint 2 #1.2 (commit `d0a3ae98` on `main`) — Five-Minute Proof Step 1 in production.
**Supersedes:** Initial directive committed as `7f66fa78` earlier today. This revision is the **canonical version**; ignore the prior draft.

---

## Revision summary (vs. initial 2026-05-11 morning draft)

Seven scope decisions finalized in alignment session. Net deltas:

1. **Deeplink consumption** — `VIPCrmTab.jsx` now in scope (reads `location.state.vipId`, scrolls + highlights matching VIP card).
2. **Threshold tunability** — All time/count thresholds hoisted into a `THRESHOLDS` constant at the top of `triggerRules.js` for future admin-editable promotion.
3. **Panel position** — Moved from `SalesVelocity ↔ WeeklyTrend` to **`TodaysBrief ↔ SalesVelocity`** (narrative flow: KPIs → AI brief → live signals → velocity → trend).
4. **Trigger types expanded from 4 → 7:**
   - **HOT** (4): `HIGH_INTENT`, `CONTACT_AGENT`, `REPEAT_VIEW`, `ROI_COMPLETED` *(new)*
   - **WARM** (3): `RE_ENGAGE`, `HIGH_VALUE_DEAL_IDLE` *(new)*, `MULTIPLE_VIPS_SAME_ITEM` *(new)*
5. **Tier-balanced render** — Max **5 HOT + 3 WARM**, visually separated with a divider rule. Defensive `region + sector` filter at top of `detectTriggers` (belt + suspenders — `useDashboard` already filters at hook layer).
6. **Sector-aware i18n shape** — All panel and signal strings stored as `{ realEstate, automotive, yacht }` objects. A `resolveSectorString` helper handles lookup with `realEstate` fallback. Even structurally-identical strings keep the 3-key shape for consistency.
7. **`trigger_acted_on` tracking event** — Every "Open profile" click writes to Firestore via `firestoreTracking.js`. New `EVENT_SCHEMA` entry required.

---

## 1. Goal

Add a **real-time VIP behavior signal panel** to `/unified/overview` that surfaces named-buyer intent the moment it arrives. Each row tells the sales rep: *"This named VIP just did this — open their profile and call them."* Panel reads only from what `useDashboard()` already streams (`events`, `vips`, `cards`, `deals`) — **no new Firestore listener**.

This is the first dashboard surface that operationalizes the *"Identity precedes Action"* mantra in real time.

---

## 2. Why this work exists

The Overview tab today shows aggregate KPIs, conversion bars, and trends — all backward-looking. Nothing answers *"Khalid Al-Rashid is looking at Unit A-1204 right now — for the third time in 15 minutes."* The Sales Trigger Panel is the **20/20 Vision** moment the entire product is sold on, surfaced where it belongs: the first scroll of the dashboard.

---

## 3. Read first (mandatory)

1. `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` — entire file. Confirm `useDashboard()` destructure (line ~289) returns `events`, `vips`, `cards`, `deals`. Locate the insertion point: between `<TodaysBrief ... />` (~line 627) and `<SalesVelocity ... />` (~line 635).
2. `frontend/src/components/UnifiedDashboard/SalesVelocity.jsx` — first 80 lines. Mirror its CSS class naming (`ud-sales-velocity__*` → use `stp-*` for the panel).
3. `frontend/src/components/UnifiedDashboard/FiveMinuteProof/FiveMinuteProof.css` — search for `--fmp-accent` and `.fmp-card[data-region="..."]`. Mirror exactly with `--stp-accent` on `.stp-panel[data-region="..."]`.
4. `frontend/src/services/firestoreTracking.js` — first ~80 lines. Confirm:
   - `EVENT_SCHEMA` object shape (you will add one new key).
   - `trackEvent` (or equivalent) export name and signature.
   - Multi-variant event-name set (pricing/brochure/booking/contact/unit-view) already documented in `OverviewTab.conversionBars` (line ~418).
5. `frontend/src/i18n/portals/dashboard.js` — first 60 lines. Confirm `registerTranslations("dashboard", { en, ar, es, fr })` flat-key pattern. New keys append inside each language block.
6. **`frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`** — entire file. Identify:
   - How the VIP list is rendered (cards, table rows, etc.).
   - Whether each VIP DOM node has an identifiable attribute (`id`, `data-vip-id`) — if not, add one as part of this work.
   - Where to call `useLocation()` from `react-router-dom` to read `state.vipId`.
7. `frontend/src/hooks/useRegion.js` and `frontend/src/hooks/useSector.js` — confirm `regionId` (string) and `sector.id` ∈ `{realEstate, automotive, yacht}`.
8. `frontend/src/hooks/useDashboardData.js` — skim lines around the region/sector filter site. The defensive panel-layer filter is belt-and-suspenders against this filter, not a replacement.

---

## 4. Files

### Create (3 files)

```
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx         (~160L)
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/SalesTriggerPanel.css (~120L)
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/triggerRules.js   (~280L)
```

### Modify (4 files)

```
frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx        ← +6 lines (import + position change)
frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx          ← ~25 lines (deeplink consumption)
frontend/src/i18n/portals/dashboard.js                          ← sector-aware key block append
frontend/src/services/firestoreTracking.js                      ← +1 EVENT_SCHEMA entry
```

**Do NOT modify:** any other file, `useDashboardData.js`, `useDashboard.js`, `App.jsx`, any route, `firebase.js`, the existing event-key normalization elsewhere in the codebase.

---

## 5. `triggerRules.js` — 7 detectors + THRESHOLDS

Pure JS module. No React, no Firestore. **Two exports:** `THRESHOLDS` (constant) and `detectTriggers` (function).

### 5.1 Top of file — config + helpers

```javascript
// Threshold tunables for the Sales Trigger Panel.
// Hoist to tenant-editable `tenants/{uid}/settings/triggerThresholds` in a future sprint.
export const THRESHOLDS = {
  REPEAT_VIEW_WINDOW_MS:        15 * 60 * 1000,
  REPEAT_VIEW_MIN_EVENTS:       3,
  RE_ENGAGE_IDLE_MIN_MS:        24 * 60 * 60 * 1000,
  RE_ENGAGE_RECENT_MAX_MS:      60 * 60 * 1000,
  HIGH_VALUE_DEAL_VALUE_MIN:    5_000_000,
  HIGH_VALUE_DEAL_IDLE_MS:      48 * 60 * 60 * 1000,
  MULTIPLE_VIPS_WINDOW_MS:      48 * 60 * 60 * 1000,
  MULTIPLE_VIPS_MIN_DISTINCT:   2,
};

const PRICING_KEYS    = new Set(['pricing_request', 'request_pricing', 'request_quote', 'quote_request']);
const BROCHURE_KEYS   = new Set(['brochure_download', 'download_brochure']);
const BOOKING_KEYS    = new Set(['book_viewing', 'test_drive_request', 'boarding_request']);
const CONTACT_KEYS    = new Set(['contact_advisor', 'contact_agent', 'whatsapp_click', 'callback_request']);
const UNIT_VIEW_KEYS  = new Set(['unit_view', 'view_unit', 'vehicle_view', 'unit_detail_opened', 'yacht_view']);
const ROI_KEYS        = new Set(['roi_calculator', 'roi_completed', 'roi_calculator_used']);

function eventTypeOf(e) {
  return String(e.type || e.event || e.rawEvent || '').toLowerCase();
}
function tsOf(e) {
  const v = e.timestamp || e.createdAt || e.ts;
  if (typeof v === 'number') return v;
  if (v?.toMillis) return v.toMillis();
  const n = new Date(v).getTime();
  return Number.isFinite(n) ? n : 0;
}
function enrich(events, vips) {
  const vipById = new Map((vips || []).map(v => [v.id, v]));
  return (events || []).filter(e => e.vipId && vipById.has(e.vipId)).map(e => ({
    ...e,
    _ts: tsOf(e),
    _type: eventTypeOf(e),
    _vip: vipById.get(e.vipId),
  }));
}
function groupByVip(enrichedEvents) {
  const m = new Map();
  enrichedEvents.forEach(e => {
    const list = m.get(e.vipId) || [];
    list.push(e);
    m.set(e.vipId, list);
  });
  m.forEach(list => list.sort((a, b) => a._ts - b._ts));
  return m;
}
```

### 5.2 Rule 1 — REPEAT_VIEW

Same VIP + same item, sliding window of `REPEAT_VIEW_WINDOW_MS`, ≥ `REPEAT_VIEW_MIN_EVENTS`.

```javascript
function detectRepeatView(events) {
  const groups = new Map(); // `${vipId}|${item}` → events[]
  events.forEach(e => {
    if (!UNIT_VIEW_KEYS.has(e._type)) return;
    const item = e.item || e.metadata?.unitId || e.metadata?.vehicleId || '_';
    const key = `${e.vipId}|${item}`;
    const list = groups.get(key) || [];
    list.push(e);
    groups.set(key, list);
  });

  const out = [];
  groups.forEach((list, key) => {
    const sorted = list.slice().sort((a, b) => a._ts - b._ts);
    let best = null;
    for (let i = 0; i < sorted.length; i++) {
      let count = 1;
      for (let j = i + 1; j < sorted.length; j++) {
        if (sorted[j]._ts - sorted[i]._ts <= THRESHOLDS.REPEAT_VIEW_WINDOW_MS) count++;
        else break;
      }
      if (count >= THRESHOLDS.REPEAT_VIEW_MIN_EVENTS && (!best || count > best.count)) {
        best = { count, last: sorted[Math.min(i + count - 1, sorted.length - 1)] };
      }
    }
    if (best) {
      const [vipId, item] = key.split('|');
      out.push({
        id: `REPEAT_VIEW:${vipId}:${item}`,
        ruleType: 'REPEAT_VIEW',
        urgency: 'hot',
        vipId,
        vipName: best.last._vip?.name || vipId,
        score: best.last._vip?.score ?? null,
        signalKey: 'stpSignalRepeatView',
        signalArgs: { item: item === '_' ? null : item, count: best.count },
        lastEventAt: best.last._ts,
      });
    }
  });
  return out;
}
```

### 5.3 Rule 2 — HIGH_INTENT

Pricing / brochure / booking event from a VIP. **Excludes ROI events** (those go to ROI_COMPLETED).

```javascript
function detectHighIntent(events) {
  const byVip = new Map();
  events.forEach(e => {
    if (ROI_KEYS.has(e._type)) return; // delegated to ROI_COMPLETED
    let signalKey = null;
    if (PRICING_KEYS.has(e._type))       signalKey = 'stpSignalPricing';
    else if (BROCHURE_KEYS.has(e._type)) signalKey = 'stpSignalBrochure';
    else if (BOOKING_KEYS.has(e._type))  signalKey = 'stpSignalBooking';
    if (!signalKey) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, { ...e, signalKey });
  });
  return Array.from(byVip.values()).map(e => ({
    id: `HIGH_INTENT:${e.vipId}:${e.signalKey}`,
    ruleType: 'HIGH_INTENT',
    urgency: 'hot',
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: e.signalKey,
    signalArgs: { item: e.item || null },
    lastEventAt: e._ts,
  }));
}
```

### 5.4 Rule 3 — RE_ENGAGE

```javascript
function detectReEngage(events, now) {
  const byVip = new Map();
  events.forEach(e => {
    const list = byVip.get(e.vipId) || [];
    list.push(e);
    byVip.set(e.vipId, list);
  });
  const out = [];
  byVip.forEach((list, vipId) => {
    const sorted = list.slice().sort((a, b) => a._ts - b._ts);
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    if (!prev) return;
    if (now - last._ts > THRESHOLDS.RE_ENGAGE_RECENT_MAX_MS) return;
    if (last._ts - prev._ts < THRESHOLDS.RE_ENGAGE_IDLE_MIN_MS) return;
    out.push({
      id: `RE_ENGAGE:${vipId}`,
      ruleType: 'RE_ENGAGE',
      urgency: 'warm',
      vipId,
      vipName: last._vip?.name || vipId,
      score: last._vip?.score ?? null,
      signalKey: 'stpSignalReEngage',
      signalArgs: { hours: Math.round((last._ts - prev._ts) / (60 * 60 * 1000)) },
      lastEventAt: last._ts,
    });
  });
  return out;
}
```

### 5.5 Rule 4 — CONTACT_AGENT

```javascript
function detectContactAgent(events) {
  const byVip = new Map();
  events.forEach(e => {
    if (!CONTACT_KEYS.has(e._type)) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, e);
  });
  return Array.from(byVip.values()).map(e => ({
    id: `CONTACT_AGENT:${e.vipId}`,
    ruleType: 'CONTACT_AGENT',
    urgency: 'hot',
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: 'stpSignalContact',
    signalArgs: {},
    lastEventAt: e._ts,
  }));
}
```

### 5.6 Rule 5 — ROI_COMPLETED *(new)*

```javascript
function detectRoiCompleted(events) {
  const byVip = new Map();
  events.forEach(e => {
    if (!ROI_KEYS.has(e._type)) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, e);
  });
  return Array.from(byVip.values()).map(e => ({
    id: `ROI_COMPLETED:${e.vipId}`,
    ruleType: 'ROI_COMPLETED',
    urgency: 'hot',
    vipId: e.vipId,
    vipName: e._vip?.name || e.vipId,
    score: e._vip?.score ?? null,
    signalKey: 'stpSignalRoiCompleted',
    signalArgs: {},
    lastEventAt: e._ts,
  }));
}
```

### 5.7 Rule 6 — HIGH_VALUE_DEAL_IDLE *(new)*

Operates on `deals`, not `events`. Closed deals are excluded.

```javascript
function detectIdleDeals(deals, eventsByVip, vipById, now) {
  const out = [];
  (deals || []).forEach(deal => {
    const value = Number(deal.value || 0);
    if (value < THRESHOLDS.HIGH_VALUE_DEAL_VALUE_MIN) return;
    const stage = String(deal.stage || '').toLowerCase();
    if (stage === 'closed' || stage === 'closed_won' || stage === 'closed_lost') return;

    const vipId = deal.vipId || deal.assignedVipId || deal.leadVipId;
    if (!vipId) return;

    const vipEvents = eventsByVip.get(vipId) || [];
    const lastEvent = vipEvents[vipEvents.length - 1];
    const lastTs = lastEvent?._ts || tsOf(deal);
    if (!lastTs) return;
    if (now - lastTs < THRESHOLDS.HIGH_VALUE_DEAL_IDLE_MS) return;

    const vip = vipById.get(vipId);
    out.push({
      id: `HIGH_VALUE_DEAL_IDLE:${vipId}:${deal.id}`,
      ruleType: 'HIGH_VALUE_DEAL_IDLE',
      urgency: 'warm',
      vipId,
      vipName: vip?.name || deal.leadName || vipId,
      score: vip?.score ?? null,
      signalKey: 'stpSignalIdleDeal',
      signalArgs: { value, item: deal.item || deal.name || null },
      lastEventAt: lastTs,
    });
  });
  return out;
}
```

### 5.8 Rule 7 — MULTIPLE_VIPS_SAME_ITEM *(new)*

Two or more distinct VIPs view the same item within `MULTIPLE_VIPS_WINDOW_MS`. Emit one row **per VIP** so each sees their own competition signal.

```javascript
function detectCompeting(events, now) {
  const byItem = new Map(); // item → Map<vipId, latestEvent>
  events.forEach(e => {
    if (!UNIT_VIEW_KEYS.has(e._type)) return;
    if (now - e._ts > THRESHOLDS.MULTIPLE_VIPS_WINDOW_MS) return;
    const item = e.item || e.metadata?.unitId || e.metadata?.vehicleId;
    if (!item) return;
    const vipMap = byItem.get(item) || new Map();
    const existing = vipMap.get(e.vipId);
    if (!existing || existing._ts < e._ts) vipMap.set(e.vipId, e);
    byItem.set(item, vipMap);
  });

  const out = [];
  byItem.forEach((vipMap, item) => {
    if (vipMap.size < THRESHOLDS.MULTIPLE_VIPS_MIN_DISTINCT) return;
    vipMap.forEach((e, vipId) => {
      out.push({
        id: `MULTIPLE_VIPS_SAME_ITEM:${vipId}:${item}`,
        ruleType: 'MULTIPLE_VIPS_SAME_ITEM',
        urgency: 'warm',
        vipId,
        vipName: e._vip?.name || vipId,
        score: e._vip?.score ?? null,
        signalKey: 'stpSignalCompeting',
        signalArgs: { item, competitorCount: vipMap.size - 1 },
        lastEventAt: e._ts,
      });
    });
  });
  return out;
}
```

### 5.9 Orchestrator (CHANGED RETURN SHAPE)

```javascript
export function detectTriggers(events, vips, deals, options = {}) {
  const { region, sector, now = Date.now() } = options;

  // Defensive region+sector scope — useDashboard already filters at hook layer.
  // This second layer protects against future hook regressions.
  const matchRegion = (x) => !region || x?.region === region;
  const matchSector = (x) => !sector || x?.sector === sector;
  const scopedEvents = (events || []).filter(e => matchRegion(e) && matchSector(e));
  const scopedVips   = (vips   || []).filter(v => matchRegion(v) && matchSector(v));
  const scopedDeals  = (deals  || []).filter(d => matchRegion(d) && matchSector(d));

  const enriched = enrich(scopedEvents, scopedVips);
  const eventsByVip = groupByVip(enriched);
  const vipById = new Map(scopedVips.map(v => [v.id, v]));

  const all = [
    ...detectRepeatView(enriched),
    ...detectHighIntent(enriched),
    ...detectReEngage(enriched, now),
    ...detectContactAgent(enriched),
    ...detectRoiCompleted(enriched),
    ...detectIdleDeals(scopedDeals, eventsByVip, vipById, now),
    ...detectCompeting(enriched, now),
  ];

  // Dedupe by (ruleType, vipId, item-key) — keep latest
  const seen = new Map();
  all.forEach(t => {
    const k = `${t.ruleType}:${t.vipId}:${t.signalArgs?.item || '_'}`;
    if (!seen.has(k) || seen.get(k).lastEventAt < t.lastEventAt) seen.set(k, t);
  });

  // Tier-balanced output
  const buckets = { hot: [], warm: [] };
  Array.from(seen.values()).forEach(t => buckets[t.urgency]?.push(t));
  buckets.hot.sort((a, b) => b.lastEventAt - a.lastEventAt);
  buckets.warm.sort((a, b) => b.lastEventAt - a.lastEventAt);

  return {
    hot:  buckets.hot.slice(0, 5),
    warm: buckets.warm.slice(0, 3),
  };
}
```

---

## 6. `SalesTriggerPanel/index.jsx`

```jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useRegion } from "../../../hooks/useRegion";
import { useSector } from "../../../hooks/useSector";
import { useDashboard } from "../../../pages/UnifiedDashboard/useDashboard";
import { trackEvent } from "../../../services/firestoreTracking";
import { detectTriggers } from "./triggerRules";
import "./SalesTriggerPanel.css";

// Sector-aware string resolver. Falls back to realEstate then EN.
function resolveSectorString(entry, sectorId, lang) {
  if (entry == null) return "";
  if (typeof entry === "string") return entry;
  // entry shape: { realEstate: "...", automotive: "...", yacht: "..." }
  return entry[sectorId] || entry.realEstate || "";
}

// Lookup string from local UI bank keyed by lang then sector.
// UI shape: { en: { stpTitle: { realEstate, automotive, yacht }, ... }, ar: {...}, ... }
function t(UI, lang, sectorId, key) {
  const langBlock = UI[lang] || UI.en;
  const entry = langBlock[key] ?? UI.en[key];
  return resolveSectorString(entry, sectorId, lang);
}

function ageString(ms, UI, lang, sectorId) {
  if (ms < 60_000) return t(UI, lang, sectorId, "stpAgeNow");
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}${t(UI, lang, sectorId, "stpAgeMinute")}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}${t(UI, lang, sectorId, "stpAgeHour")}`;
  return `${Math.floor(hr / 24)}${t(UI, lang, sectorId, "stpAgeDay")}`;
}

function formatSignal(trigger, UI, lang, sectorId) {
  const base = t(UI, lang, sectorId, trigger.signalKey);
  if (!base) return "";
  const args = trigger.signalArgs || {};
  return base
    .replace("{item}",  args.item ?? "")
    .replace("{count}", args.count ?? "")
    .replace("{hours}", args.hours ?? "")
    .replace("{value}", args.value ? args.value.toLocaleString() : "")
    .replace("{competitorCount}", args.competitorCount ?? "");
}

// LOCAL UI BANK — these are mirrors of dashboard.js keys for low-latency render.
// If you change one, change both. (See §8.)
const UI = {
  en: {
    stpTitle: {
      realEstate: "Sales Triggers",
      automotive: "Sales Triggers",
      yacht:      "Sales Triggers",
    },
    stpSub: {
      realEstate: "Named VIPs acting right now — open their profile and reach out.",
      automotive: "Named buyers acting right now — open their profile and reach out.",
      yacht:      "Named clients acting right now — open their profile and reach out.",
    },
    stpEmpty: {
      realEstate: "No active triggers. Triggers appear when an invited VIP shows intent.",
      automotive: "No active triggers. Triggers appear when an invited buyer shows intent.",
      yacht:      "No active triggers. Triggers appear when an invited client shows intent.",
    },
    stpOpenProfile: {
      realEstate: "Open profile",
      automotive: "Open profile",
      yacht:      "Open profile",
    },
    stpUrgencyHot:  { realEstate: "Hot",  automotive: "Hot",  yacht: "Hot"  },
    stpUrgencyWarm: { realEstate: "Warm", automotive: "Warm", yacht: "Warm" },
    stpDividerWarm: {
      realEstate: "Watch list",
      automotive: "Watch list",
      yacht:      "Watch list",
    },
    stpAgeNow:    { realEstate: "just now", automotive: "just now", yacht: "just now" },
    stpAgeMinute: { realEstate: "m ago",    automotive: "m ago",    yacht: "m ago"    },
    stpAgeHour:   { realEstate: "h ago",    automotive: "h ago",    yacht: "h ago"    },
    stpAgeDay:    { realEstate: "d ago",    automotive: "d ago",    yacht: "d ago"    },

    // Signal descriptions
    stpSignalRepeatView: {
      realEstate: "Viewed {item} {count}× in 15 min",
      automotive: "Configured {item} {count}× in 15 min",
      yacht:      "Explored {item} {count}× in 15 min",
    },
    stpSignalRepeatViewGeneric: {
      realEstate: "Viewed the same unit {count}× in 15 min",
      automotive: "Configured the same vehicle {count}× in 15 min",
      yacht:      "Explored the same yacht {count}× in 15 min",
    },
    stpSignalPricing: {
      realEstate: "Requested pricing",
      automotive: "Requested pricing",
      yacht:      "Requested pricing",
    },
    stpSignalBrochure: {
      realEstate: "Downloaded brochure",
      automotive: "Downloaded spec sheet",
      yacht:      "Downloaded yacht profile",
    },
    stpSignalBooking: {
      realEstate: "Requested viewing",
      automotive: "Requested test drive",
      yacht:      "Requested boarding tour",
    },
    stpSignalReEngage: {
      realEstate: "Returned after {hours}h idle",
      automotive: "Returned after {hours}h idle",
      yacht:      "Returned after {hours}h idle",
    },
    stpSignalContact: {
      realEstate: "Contacted advisor",
      automotive: "Contacted advisor",
      yacht:      "Contacted broker",
    },
    stpSignalRoiCompleted: {
      realEstate: "Ran ROI calculator",
      automotive: "Ran TCO calculator",
      yacht:      "Ran ROI calculator",
    },
    stpSignalIdleDeal: {
      realEstate: "High-value deal idle 48h+",
      automotive: "High-value deal idle 48h+",
      yacht:      "High-value deal idle 48h+",
    },
    stpSignalCompeting: {
      realEstate: "Competing — {competitorCount} other VIP(s) viewing {item}",
      automotive: "Competing — {competitorCount} other buyer(s) viewing {item}",
      yacht:      "Competing — {competitorCount} other client(s) viewing {item}",
    },
  },
  // ar, es, fr — Cursor fills these from §8 table below.
  ar: { /* §8 */ },
  es: { /* §8 */ },
  fr: { /* §8 */ },
};

export default function SalesTriggerPanel() {
  const { events, vips, deals } = useDashboard();
  const { regionId } = useRegion();
  const { config: sectorCfg } = useSector();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const sectorId = sectorCfg?.id || "realEstate";

  const buckets = useMemo(
    () => detectTriggers(events || [], vips || [], deals || [], { region: regionId, sector: sectorId }),
    [events, vips, deals, regionId, sectorId]
  );

  const now = Date.now();
  const hasAny = buckets.hot.length + buckets.warm.length > 0;

  const handleOpen = (trigger) => {
    // Fire-and-forget tracking — does not block navigation.
    trackEvent({
      type: "trigger_acted_on",
      vipId: trigger.vipId,
      metadata: {
        ruleType: trigger.ruleType,
        urgency: trigger.urgency,
        triggerAgeMs: Date.now() - trigger.lastEventAt,
        signalKey: trigger.signalKey,
      },
    }).catch(() => { /* offline persistence will retry */ });

    navigate("/unified/vip-crm", { state: { vipId: trigger.vipId } });
  };

  const renderRow = (trigger) => (
    <li key={trigger.id} className="stp-row" data-urgency={trigger.urgency}>
      <span className={`stp-dot stp-dot--${trigger.urgency}`} aria-hidden="true" />
      <div className="stp-row__main">
        <div className="stp-row__name">
          {trigger.vipName}
          {trigger.score != null && <span className="stp-score">{trigger.score}</span>}
          <span className={`stp-chip stp-chip--${trigger.urgency}`}>
            {t(UI, lang, sectorId, trigger.urgency === "hot" ? "stpUrgencyHot" : "stpUrgencyWarm")}
          </span>
        </div>
        <div className="stp-row__signal">{formatSignal(trigger, UI, lang, sectorId)}</div>
      </div>
      <div className="stp-row__age">{ageString(now - trigger.lastEventAt, UI, lang, sectorId)}</div>
      <button
        type="button"
        className="stp-row__cta"
        onClick={() => handleOpen(trigger)}
      >
        {t(UI, lang, sectorId, "stpOpenProfile")}
      </button>
    </li>
  );

  return (
    <section
      className="stp-panel ud-card"
      data-region={regionId}
      aria-label={t(UI, lang, sectorId, "stpTitle")}
    >
      <header className="stp-header">
        <div>
          <div className="ud-card-title">{t(UI, lang, sectorId, "stpTitle")}</div>
          <div className="ud-card-subtitle">{t(UI, lang, sectorId, "stpSub")}</div>
        </div>
      </header>

      {!hasAny ? (
        <div className="stp-empty">{t(UI, lang, sectorId, "stpEmpty")}</div>
      ) : (
        <ul className="stp-list" role="list">
          {buckets.hot.map(renderRow)}
          {buckets.warm.length > 0 && buckets.hot.length > 0 && (
            <li className="stp-divider" aria-hidden="true">
              <span>{t(UI, lang, sectorId, "stpDividerWarm")}</span>
            </li>
          )}
          {buckets.warm.map(renderRow)}
        </ul>
      )}
    </section>
  );
}
```

**Target:** ~160 lines.

---

## 7. `SalesTriggerPanel.css`

```css
/* SalesTriggerPanel — namespace: stp-* */

.stp-panel {
  --stp-accent: var(--ud-accent, #457b9d);
  margin-block: 16px;
}
.stp-panel[data-region="gulf"]    { --stp-accent: #b8860b; }
.stp-panel[data-region="usa"]     { --stp-accent: #c1121f; }
.stp-panel[data-region="mexico"]  { --stp-accent: #b85e2f; }
.stp-panel[data-region="canada"]  { --stp-accent: #1d4f72; }

.stp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-block-end: 12px;
}

.stp-empty {
  text-align: center;
  padding: 32px 12px;
  color: var(--ud-text-muted);
  font-size: 13px;
}

.stp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }

.stp-row {
  display: grid;
  grid-template-columns: 12px 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--ud-border);
  border-radius: 10px;
  background: var(--ud-bg-secondary);
}
.stp-row[data-urgency="hot"]  { border-inline-start: 3px solid #e63946; }
.stp-row[data-urgency="warm"] { border-inline-start: 3px solid #eab308; }

.stp-divider {
  display: flex; align-items: center; gap: 8px;
  padding-block: 6px;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--ud-text-muted);
}
.stp-divider::before, .stp-divider::after {
  content: ""; flex: 1; height: 1px; background: var(--ud-border);
}

.stp-dot { width: 10px; height: 10px; border-radius: 50%; }
.stp-dot--hot  { background: #e63946; box-shadow: 0 0 0 3px rgba(230,57,70,0.18); }
.stp-dot--warm { background: #eab308; box-shadow: 0 0 0 3px rgba(234,179,8,0.18); }

@media (prefers-reduced-motion: no-preference) {
  .stp-dot--hot { animation: stp-pulse 1.6s ease-in-out infinite; }
}
@keyframes stp-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(230,57,70,0.18); }
  50%      { box-shadow: 0 0 0 6px rgba(230,57,70,0.08); }
}

.stp-row__main { min-width: 0; }
.stp-row__name {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 500; color: var(--ud-text);
}
.stp-score {
  font-size: 11px; font-weight: 600;
  padding: 2px 6px; border-radius: 4px;
  background: var(--stp-accent); color: #fff;
}
.stp-chip {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.04em;
  padding: 2px 6px; border-radius: 4px;
}
.stp-chip--hot  { background: rgba(230,57,70,0.12); color: #c1121f; }
.stp-chip--warm { background: rgba(234,179,8,0.14); color: #92590a; }

.stp-row__signal { font-size: 12px; color: var(--ud-text-muted); margin-block-start: 2px; }
.stp-row__age    { font-size: 12px; color: var(--ud-text-muted); white-space: nowrap; }

.stp-row__cta {
  border: 1px solid var(--stp-accent);
  background: transparent;
  color: var(--stp-accent);
  font-size: 12px; font-weight: 500;
  padding: 6px 10px; border-radius: 6px;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}
.stp-row__cta:hover { background: var(--stp-accent); color: #fff; }

@media (max-width: 768px) {
  .stp-row { grid-template-columns: 12px 1fr auto; }
  .stp-row__cta { grid-column: 1 / -1; justify-self: end; }
}
```

**Target:** ~120 lines.

---

## 8. i18n — `frontend/src/i18n/portals/dashboard.js`

Append the same key structure to all 4 languages (`en`, `ar`, `es`, `fr`). Each key is a **3-sector object** (`{realEstate, automotive, yacht}`) even when the 3 strings are identical (consistency for future tuning).

**Translation matrix.** Fill into each `en/ar/es/fr` block of `registerTranslations("dashboard", { ... })`.

### Chrome keys

| Key | EN | AR | ES | FR |
|---|---|---|---|---|
| `stpTitle` (all 3 sectors) | Sales Triggers | محفزات المبيعات | Disparadores de venta | Déclencheurs de vente |
| `stpSub.realEstate` | Named VIPs acting right now — open their profile and reach out. | كبار الشخصيات المعروفون يتفاعلون الآن — افتح ملفهم وتواصل. | VIPs identificados activando ahora — abre su perfil y contacta. | VIP identifiés agissant maintenant — ouvrez leur profil et contactez. |
| `stpSub.automotive` | Named buyers acting right now — open their profile and reach out. | المشترون المعروفون يتفاعلون الآن — افتح ملفهم وتواصل. | Compradores identificados activando ahora — abre su perfil y contacta. | Acheteurs identifiés agissant maintenant — ouvrez leur profil et contactez. |
| `stpSub.yacht` | Named clients acting right now — open their profile and reach out. | العملاء المعروفون يتفاعلون الآن — افتح ملفهم وتواصل. | Clientes identificados activando ahora — abre su perfil y contacta. | Clients identifiés agissant maintenant — ouvrez leur profil et contactez. |
| `stpEmpty.realEstate` | No active triggers. Triggers appear when an invited VIP shows intent. | لا توجد محفزات نشطة. تظهر عند إظهار VIP المدعو نية شراء. | Sin disparadores activos. Aparecen cuando un VIP invitado muestra intención. | Aucun déclencheur actif. Apparaissent quand un VIP invité montre une intention. |
| `stpEmpty.automotive` | No active triggers. Triggers appear when an invited buyer shows intent. | لا توجد محفزات نشطة. تظهر عند إظهار المشتري المدعو نية شراء. | Sin disparadores activos. Aparecen cuando un comprador invitado muestra intención. | Aucun déclencheur actif. Apparaissent quand un acheteur invité montre une intention. |
| `stpEmpty.yacht` | No active triggers. Triggers appear when an invited client shows intent. | لا توجد محفزات نشطة. تظهر عند إظهار العميل المدعو نية شراء. | Sin disparadores activos. Aparecen cuando un cliente invitado muestra intención. | Aucun déclencheur actif. Apparaissent quand un client invité montre une intention. |
| `stpOpenProfile` (all 3) | Open profile | فتح الملف | Abrir perfil | Ouvrir le profil |
| `stpUrgencyHot` (all 3) | Hot | ساخن | Caliente | Chaud |
| `stpUrgencyWarm` (all 3) | Warm | دافئ | Tibio | Tiède |
| `stpDividerWarm` (all 3) | Watch list | قائمة المراقبة | Lista de seguimiento | Liste de suivi |
| `stpAgeNow` (all 3) | just now | الآن | ahora | maintenant |
| `stpAgeMinute` (all 3) | m ago | د | m | m |
| `stpAgeHour` (all 3) | h ago | س | h | h |
| `stpAgeDay` (all 3) | d ago | ي | d | j |

### Signal keys

| Key + sector | EN | AR | ES | FR |
|---|---|---|---|---|
| `stpSignalRepeatView.realEstate` | Viewed {item} {count}× in 15 min | شاهد {item} {count} مرات في 15 دقيقة | Vio {item} {count}× en 15 min | A consulté {item} {count}× en 15 min |
| `stpSignalRepeatView.automotive` | Configured {item} {count}× in 15 min | ضبط {item} {count} مرات في 15 دقيقة | Configuró {item} {count}× en 15 min | A configuré {item} {count}× en 15 min |
| `stpSignalRepeatView.yacht` | Explored {item} {count}× in 15 min | استكشف {item} {count} مرات في 15 دقيقة | Exploró {item} {count}× en 15 min | A exploré {item} {count}× en 15 min |
| `stpSignalRepeatViewGeneric.realEstate` | Viewed the same unit {count}× in 15 min | شاهد نفس الوحدة {count} مرات في 15 دقيقة | Vio la misma unidad {count}× en 15 min | A consulté la même unité {count}× en 15 min |
| `stpSignalRepeatViewGeneric.automotive` | Configured the same vehicle {count}× in 15 min | ضبط نفس المركبة {count} مرات في 15 دقيقة | Configuró el mismo vehículo {count}× en 15 min | A configuré le même véhicule {count}× en 15 min |
| `stpSignalRepeatViewGeneric.yacht` | Explored the same yacht {count}× in 15 min | استكشف نفس اليخت {count} مرات في 15 دقيقة | Exploró el mismo yate {count}× en 15 min | A exploré le même yacht {count}× en 15 min |
| `stpSignalPricing` (all 3) | Requested pricing | طلب السعر | Solicitó precio | A demandé le prix |
| `stpSignalBrochure.realEstate` | Downloaded brochure | حمّل البروشور | Descargó folleto | A téléchargé la brochure |
| `stpSignalBrochure.automotive` | Downloaded spec sheet | حمّل ورقة المواصفات | Descargó ficha técnica | A téléchargé la fiche technique |
| `stpSignalBrochure.yacht` | Downloaded yacht profile | حمّل ملف اليخت | Descargó perfil del yate | A téléchargé le profil du yacht |
| `stpSignalBooking.realEstate` | Requested viewing | طلب معاينة | Solicitó visita | A demandé une visite |
| `stpSignalBooking.automotive` | Requested test drive | طلب تجربة قيادة | Solicitó prueba de manejo | A demandé un essai routier |
| `stpSignalBooking.yacht` | Requested boarding tour | طلب جولة على متن اليخت | Solicitó visita a bordo | A demandé une visite à bord |
| `stpSignalReEngage` (all 3) | Returned after {hours}h idle | عاد بعد {hours} ساعة من الخمول | Regresó tras {hours}h inactivo | Revenu après {hours}h d'inactivité |
| `stpSignalContact.realEstate` | Contacted advisor | تواصل مع المستشار | Contactó al asesor | A contacté le conseiller |
| `stpSignalContact.automotive` | Contacted advisor | تواصل مع المستشار | Contactó al asesor | A contacté le conseiller |
| `stpSignalContact.yacht` | Contacted broker | تواصل مع الوسيط | Contactó al corredor | A contacté le courtier |
| `stpSignalRoiCompleted.realEstate` | Ran ROI calculator | استخدم حاسبة العائد | Usó calculadora ROI | A utilisé le calculateur ROI |
| `stpSignalRoiCompleted.automotive` | Ran TCO calculator | استخدم حاسبة التكلفة | Usó calculadora TCO | A utilisé le calculateur TCO |
| `stpSignalRoiCompleted.yacht` | Ran ROI calculator | استخدم حاسبة العائد | Usó calculadora ROI | A utilisé le calculateur ROI |
| `stpSignalIdleDeal` (all 3) | High-value deal idle 48h+ | صفقة عالية القيمة خاملة 48 ساعة+ | Trato de alto valor inactivo 48h+ | Affaire de grande valeur inactive 48h+ |
| `stpSignalCompeting.realEstate` | Competing — {competitorCount} other VIP(s) viewing {item} | تنافس — {competitorCount} VIP آخر يشاهد {item} | Competencia — {competitorCount} VIP(s) más viendo {item} | Concurrence — {competitorCount} autre(s) VIP regardent {item} |
| `stpSignalCompeting.automotive` | Competing — {competitorCount} other buyer(s) viewing {item} | تنافس — {competitorCount} مشترٍ آخر يشاهد {item} | Competencia — {competitorCount} comprador(es) más viendo {item} | Concurrence — {competitorCount} autre(s) acheteur(s) regardent {item} |
| `stpSignalCompeting.yacht` | Competing — {competitorCount} other client(s) viewing {item} | تنافس — {competitorCount} عميل آخر يشاهد {item} | Competencia — {competitorCount} cliente(s) más viendo {item} | Concurrence — {competitorCount} autre(s) client(s) regardent {item} |

**Both the local `UI` constant in `index.jsx` AND the appended keys in `dashboard.js` must match.** The local bank is for performance / no double registry lookups; the central bank is the source of truth that next sprint's refactor will consolidate.

---

## 9. `OverviewTab.jsx` — integration

Add import near other `components/UnifiedDashboard/*` imports (~line 17):

```jsx
import SalesTriggerPanel from "../../../components/UnifiedDashboard/SalesTriggerPanel";
```

**Position change:** Move from "after SalesVelocity" to "after TodaysBrief, before SalesVelocity". The JSX block change is:

```jsx
      <TodaysBrief
        brief={resolvedBrief}
        nfcRoi={nfcRoiDisplay}
        onRefreshAi={handleRefreshAi}
        isRefreshing={isRefreshingAi}
        lang={lang}
      />

      <SalesTriggerPanel />

      <SalesVelocity
        metrics={velocityMetrics}
        lang={lang}
        sector={config.id}
        region={regionId}
      />
```

No other change to OverviewTab. No destructure edits, no prop additions to SalesVelocity, no memo touches.

---

## 10. `VIPCrmTab.jsx` — deeplink consumption *(new section)*

The panel sends `location.state = { vipId }` when navigating. VIPCrmTab must:

1. Read state on mount and on subsequent updates.
2. Find the matching VIP card / row in the DOM.
3. Scroll it into view smoothly.
4. Apply a `vipcrm-highlight` class for 2 seconds, then remove it.

### Pattern

Near the top of `VIPCrmTab` (after `useState`, before the JSX return):

```jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ... inside component
const location = useLocation();
const navigate = useNavigate();
const listRef = useRef(null);

useEffect(() => {
  const targetVipId = location.state?.vipId;
  if (!targetVipId || !listRef.current) return;
  // Use data-vip-id attribute on each VIP row (add this in render)
  const node = listRef.current.querySelector(`[data-vip-id="${CSS.escape(targetVipId)}"]`);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "center" });
  node.classList.add("vipcrm-highlight");
  const timer = setTimeout(() => {
    node.classList.remove("vipcrm-highlight");
    // Clear state so refresh doesn't re-trigger
    navigate(location.pathname, { replace: true, state: {} });
  }, 2000);
  return () => clearTimeout(timer);
}, [location.state, navigate, location.pathname]);
```

### DOM marker

On each VIP row / card render, add `data-vip-id={vip.id}` and wrap the list in `<div ref={listRef}>`. If a list-container ref already exists, reuse it; if not, add the wrapper minimally.

### Highlight CSS

If `VIPCrmTab.css` exists, append:

```css
.vipcrm-highlight {
  animation: vipcrm-highlight-pulse 2s ease-out;
  position: relative;
  z-index: 1;
}
@keyframes vipcrm-highlight-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.6); background-color: rgba(230, 57, 70, 0.08); }
  100% { box-shadow: 0 0 0 12px rgba(230, 57, 70, 0);   background-color: transparent;          }
}
```

If `VIPCrmTab.css` does not exist, append the same rules to an existing tabs-level stylesheet — do not create a new file.

**Target VIPCrmTab.jsx delta:** ~25 lines (effect + ref + data-vip-id attribute on rows). Do not refactor anything else in that file.

---

## 11. `firestoreTracking.js` — new event schema entry

In `EVENT_SCHEMA` (top of file), add **one row**:

```javascript
trigger_acted_on: { category: 'action', label: 'Acted on sales trigger', funnelWeight: 12 },
```

Place it in the ACTION category block alongside `book_viewing`, `contact_advisor`, etc. **No other change to firestoreTracking.js.**

If the `trackEvent` export name differs from what `index.jsx` imports (i.e., it's actually called `recordEvent` or `logEvent` or similar), use the actual export name — do not invent. Read the file to confirm before writing the panel's import.

---

## 12. Verify steps (must all pass)

1. **`npm run build`** in `frontend/` — must PASS, zero errors. Report build time + module count.
2. **PowerShell line counts:**
   ```powershell
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\index.jsx").Length
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\triggerRules.js").Length
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\SalesTriggerPanel.css").Length
   ```
   Expect: index.jsx ~160, triggerRules.js ~280, .css ~120. Each ±20% acceptable.
3. **VIPCrmTab.jsx diff size:** `git diff --stat frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx` — expect ~25 lines added, 0-2 removed.
4. **i18n key sanity** — confirm sector-aware shape in `dashboard.js`:
   ```powershell
   Select-String -Path "frontend\src\i18n\portals\dashboard.js" -Pattern "stpSignalBrochure"
   ```
   Must return ≥4 lines (one per language).
5. **No banned patterns in new files:**
   ```powershell
   Select-String -Path "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\*" -Pattern "margin-left|margin-right|console\.log"
   ```
   Zero results expected.
6. **Region cycle live-test (`npm run dev`):** open `/unified/overview`, cycle Country selector (Canada → Gulf → USA → Mexico). For each region:
   - Panel renders only that region's VIPs (names match `getPersonas` output for that region).
   - Score chip + CTA border tint matches that region's `--stp-accent`.
7. **Sector cycle live-test:** with one region active, cycle Real Estate → Automotive → Yacht. Confirm:
   - "Requested viewing" → "Requested test drive" → "Requested boarding tour" on the booking signal.
   - "Downloaded brochure" → "Downloaded spec sheet" → "Downloaded yacht profile" on the brochure signal.
8. **Empty state:** clear the tenant or filter to a region+sector combo with no events — empty copy must render in the active sector's variant.
9. **Tier balance:** seed a scenario with 6+ HOT triggers and 4+ WARM triggers (use Settings → Reset Demo or manual Firestore writes). Confirm exactly 5 HOT show above the divider and exactly 3 WARM show below.
10. **Deeplink:** click "Open profile" on any trigger. Confirm:
    - Routes to `/unified/vip-crm`.
    - Target VIP card scrolls into view.
    - Red pulse highlight animation fires for ~2s.
    - Browser URL state clears (no re-trigger on refresh).
11. **Tracking write:** in Chrome DevTools Network panel, click "Open profile" and confirm a Firestore write to `tenants/{uid}/events` with `type: 'trigger_acted_on'`.
12. **`prefers-reduced-motion`:** with reduced motion enabled (DevTools rendering pane), confirm hot dot pulse stops; highlight animation simplifies (or omits — fine either way).
13. **Mobile 375px:** Chrome DevTools, 375px wide. CTA wraps to a second grid row, no overflow.

---

## 13. Out of scope (do NOT do)

- Admin-editable threshold UI — `THRESHOLDS` is hardcoded for now; surfacing in Admin Settings is a separate sprint.
- VIPCrmTab's view-mode redesign — only the deeplink consumption block is in scope; do not refactor the list/grid layout.
- Custom outreach templates per trigger type — Sprint 2 #6.
- Push notifications — separate sprint.
- Dismiss / snooze on triggers — v2.
- Any new Firestore collection.
- Any change to `useDashboardData.js`, `useDashboard.js`, `App.jsx`, `firebase.js`.
- Any change to the existing event-key normalization in `OverviewTab.conversionBars`.

---

## 14. Tone for PR description

> Sprint 2 #2 — Sales Trigger Panel.
> New `/unified/overview` surface between `TodaysBrief` and `SalesVelocity`. Detects 7 named-VIP signals (HIGH_INTENT, CONTACT_AGENT, REPEAT_VIEW, ROI_COMPLETED, RE_ENGAGE, HIGH_VALUE_DEAL_IDLE, MULTIPLE_VIPS_SAME_ITEM) from `useDashboard` data with defensive region+sector scoping.
> Tier-balanced render: 5 HOT + 3 WARM with divider.
> Sector-aware i18n across all 4 languages.
> Deeplink: "Open profile" → VIPCrmTab auto-scrolls and highlights the target VIP.
> `trigger_acted_on` event written to Firestore on every click (panel effectiveness measurement).
> 3 new files (~560L) + 4 modified files (~50L delta). Zero new Firestore listeners, zero schema changes, zero route changes.

---

## 15. Audit gates Claude will check on the returned PR

- [ ] `npm run build` PASS (paste time + module count in PR body)
- [ ] 3 new files within size targets (±20%)
- [ ] Zero `margin-left` / `margin-right` / `console.log` in new files
- [ ] All sector-aware keys present in all 4 languages with `{realEstate, automotive, yacht}` shape
- [ ] OverviewTab integration = exactly 1 import + 1 component placement at the new position
- [ ] VIPCrmTab delta limited to deeplink consumption (no layout refactor)
- [ ] `firestoreTracking.js` delta = exactly 1 schema entry
- [ ] Region cycle changes accent on score chip + CTA border
- [ ] Sector cycle changes booking and brochure copy correctly
- [ ] Tier divider renders only when both HOT and WARM lists are non-empty
- [ ] "Open profile" deeplink works end-to-end (scroll + highlight + state clear)
- [ ] `trigger_acted_on` event writes to Firestore on click
- [ ] No other files modified beyond the 7 listed

**Cursor:** push to `cursor/sprint-2-2-sales-trigger-panel`, DO NOT merge. Oguzhan + Claude audit, then merge.

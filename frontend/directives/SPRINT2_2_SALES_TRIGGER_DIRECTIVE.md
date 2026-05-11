# Sprint 2 #2 — Sales Trigger Panel

**Owner:** Cursor (Sonnet 4.6 High)
**Audit:** Claude (Cowork)
**Branch:** `cursor/sprint-2-2-sales-trigger-panel`
**Predecessor:** Sprint 2 #1.2 (commit `d0a3ae98` on `main`) — Five-Minute Proof + Step 1 Identity shipped to production.

---

## 1. Goal

Add a **real-time VIP behavior signal panel** to `/unified/overview` that surfaces named-buyer intent the moment it arrives, between `SalesVelocity` and the `Weekly Trend` (Last 8 Weeks) card.

The panel reads from data that `useDashboard()` already streams (`events`, `vips`, `cards`, `deals`) — **no new Firestore listener, no new tracking event, no schema change**. Pure derived-state UI.

Each visible row tells a sales rep: *"This named VIP just did this thing — open their profile and call them."*

---

## 2. Why this work exists

The Overview tab today shows aggregate KPIs, conversion bars, and weekly trends — all backward-looking. There is no surface that says *"Khalid Al-Rashid is looking at Unit A-1204 right now — for the third time in the last 10 minutes."* That is the **20/20 Vision** moment the entire product is sold on, and it currently lives nowhere on the dashboard a developer would open during a sales meeting.

Sales Trigger Panel is the first surface that operationalizes the *"Identity precedes Action"* mantra at the dashboard layer.

---

## 3. Read first (mandatory before writing code)

1. `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` — full file. Pay attention to:
   - The `useDashboard()` destructure (line ~289) — confirm `events`, `vips`, `cards`, `deals` are available.
   - Existing `ud-card` / `ud-card-title` / `ud-card-subtitle` class usage.
   - The `accentColor = region?.sidebarAccent || "var(--ud-accent)"` pattern at line ~314.
   - The placement between `<SalesVelocity ... />` and the Weekly Trend `<div className="ud-card">` block — your insertion point.
2. `frontend/src/components/UnifiedDashboard/SalesVelocity.jsx` — first 80 lines for the "ud-sales-velocity__*" CSS class convention and threshold-dot pattern. Mirror the BEM-ish style on `stp-*`.
3. `frontend/src/components/UnifiedDashboard/FiveMinuteProof/FiveMinuteProof.css` — search for `--fmp-accent` and `.fmp-card[data-region="..."]`. **You will mirror this exact pattern** with `--stp-accent` and `.stp-panel[data-region="..."]`.
4. `frontend/src/services/firestoreTracking.js` — first 50 lines for the `EVENT_SCHEMA` keys. Trigger detection must tolerate the multi-variant event names already documented in `OverviewTab.conversionBars` (line ~418):
   - pricing: `pricing_request`, `request_pricing`, `request_quote`, `quote_request`
   - brochure: `brochure_download`, `download_brochure`
   - booking: `book_viewing`, `test_drive_request`
   - contact: `contact_advisor`, `contact_agent`
   - unit view: `view_unit`, `vehicle_view`, `unit_detail_opened`, `vehicle_view`, `unit_view`
5. `frontend/src/i18n/portals/dashboard.js` — confirm the `registerTranslations("dashboard", { en, ar, es, fr })` flat-key pattern and append the new strings under the same `en/ar/es/fr` blocks. Do not introduce nested objects.

---

## 4. Files to create / modify

### Create (3 files)

```
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/SalesTriggerPanel.css
frontend/src/components/UnifiedDashboard/SalesTriggerPanel/triggerRules.js
```

### Modify (2 files)

```
frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx        ← +5 lines integration
frontend/src/i18n/portals/dashboard.js                          ← +12 keys × 4 langs
```

**Do NOT modify:** any other file, no new hook, no `useDashboardData.js` edits, no new Firestore listener, no `firestoreTracking.js` writes, no route changes, no `App.jsx`.

---

## 5. `triggerRules.js` — pure detection (no React)

Plain JS module. **Export one function: `detectTriggers(events, vips, { now = Date.now() } = {})` → `Trigger[]`.** Max 5 results, already sorted.

```javascript
// Trigger shape
// {
//   id: string,              // stable: `${ruleType}:${vipId}:${item || "_"}`
//   ruleType: 'REPEAT_VIEW' | 'HIGH_INTENT' | 'RE_ENGAGE' | 'CONTACT_AGENT',
//   urgency: 'hot' | 'warm',
//   vipId: string,
//   vipName: string,
//   score: number | null,    // from vips[].score
//   signalKey: string,       // i18n key like 'stp.signal.repeatView' (panel resolves)
//   signalArgs: object,      // { item, count, hours }
//   lastEventAt: number,     // ms timestamp (for age display)
// }
```

### Event-key normalization (top of file)

```javascript
const PRICING_KEYS    = new Set(['pricing_request', 'request_pricing', 'request_quote', 'quote_request']);
const BROCHURE_KEYS   = new Set(['brochure_download', 'download_brochure']);
const BOOKING_KEYS    = new Set(['book_viewing', 'test_drive_request']);
const CONTACT_KEYS    = new Set(['contact_advisor', 'contact_agent']);
const UNIT_VIEW_KEYS  = new Set(['unit_view', 'view_unit', 'vehicle_view', 'unit_detail_opened']);

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

function vipBasics(events, vips) {
  const vipById = new Map((vips || []).map(v => [v.id, v]));
  return events.filter(e => e.vipId && vipById.has(e.vipId)).map(e => ({
    ...e,
    _ts: tsOf(e),
    _type: eventTypeOf(e),
    _vip: vipById.get(e.vipId),
  }));
}
```

### Rule 1 — `REPEAT_VIEW`

Same vipId + same item, sliding 15-min window, ≥3 unit-view events.

```javascript
function detectRepeatView(events) {
  const FIFTEEN_MIN = 15 * 60 * 1000;
  const groups = new Map(); // key = `${vipId}|${item}`
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
    // sliding window
    let bestWindow = null;
    for (let i = 0; i < sorted.length; i++) {
      let count = 1;
      for (let j = i + 1; j < sorted.length; j++) {
        if (sorted[j]._ts - sorted[i]._ts <= FIFTEEN_MIN) count++;
        else break;
      }
      if (count >= 3 && (!bestWindow || count > bestWindow.count)) {
        bestWindow = { count, last: sorted[Math.min(i + count - 1, sorted.length - 1)] };
      }
    }
    if (bestWindow) {
      const last = bestWindow.last;
      const [vipId, item] = key.split('|');
      out.push({
        id: `REPEAT_VIEW:${vipId}:${item}`,
        ruleType: 'REPEAT_VIEW',
        urgency: 'hot',
        vipId,
        vipName: last._vip?.name || vipId,
        score: last._vip?.score ?? null,
        signalKey: 'stpSignalRepeatView',
        signalArgs: { item: item === '_' ? null : item, count: bestWindow.count },
        lastEventAt: last._ts,
      });
    }
  });
  return out;
}
```

### Rule 2 — `HIGH_INTENT`

Any `pricing_request | brochure_download | book_viewing` event from a VIP. One row per VIP (latest wins).

```javascript
function detectHighIntent(events) {
  const byVip = new Map();
  events.forEach(e => {
    let signalKey = null;
    if (PRICING_KEYS.has(e._type))    signalKey = 'stpSignalPricing';
    else if (BROCHURE_KEYS.has(e._type)) signalKey = 'stpSignalBrochure';
    else if (BOOKING_KEYS.has(e._type))  signalKey = 'stpSignalBooking';
    if (!signalKey) return;
    const existing = byVip.get(e.vipId);
    if (!existing || e._ts > existing._ts) byVip.set(e.vipId, { ...e, signalKey });
  });

  return Array.from(byVip.values()).map(e => ({
    id: `HIGH_INTENT:${e.vipId}`,
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

### Rule 3 — `RE_ENGAGE`

VIP idle 24h+, then a fresh event in the last 60 min.

```javascript
function detectReEngage(events, now) {
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY  = 24 * ONE_HOUR;
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
    if (now - last._ts > ONE_HOUR) return;               // last event must be recent
    if (last._ts - prev._ts < ONE_DAY) return;           // gap must be 24h+
    out.push({
      id: `RE_ENGAGE:${vipId}`,
      ruleType: 'RE_ENGAGE',
      urgency: 'warm',
      vipId,
      vipName: last._vip?.name || vipId,
      score: last._vip?.score ?? null,
      signalKey: 'stpSignalReEngage',
      signalArgs: { hours: Math.round((last._ts - prev._ts) / ONE_HOUR) },
      lastEventAt: last._ts,
    });
  });
  return out;
}
```

### Rule 4 — `CONTACT_AGENT`

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

### Top-level orchestrator

```javascript
export function detectTriggers(events, vips, { now = Date.now() } = {}) {
  const enriched = vipBasics(events || [], vips || []);
  const all = [
    ...detectRepeatView(enriched),
    ...detectHighIntent(enriched),
    ...detectReEngage(enriched, now),
    ...detectContactAgent(enriched),
  ];

  // Dedupe by (ruleType, vipId) — keep latest
  const seen = new Map();
  all.forEach(t => {
    const k = `${t.ruleType}:${t.vipId}`;
    if (!seen.has(k) || seen.get(k).lastEventAt < t.lastEventAt) seen.set(k, t);
  });

  // Sort: urgency tier (hot > warm), then newest first
  const tier = (u) => (u === 'hot' ? 0 : 1);
  return Array.from(seen.values())
    .sort((a, b) => tier(a.urgency) - tier(b.urgency) || b.lastEventAt - a.lastEventAt)
    .slice(0, 5);
}
```

**Target file size:** ~150 lines. Keep it minimal — pure JS, no React, no Firestore imports.

---

## 6. `SalesTriggerPanel/index.jsx`

```jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useRegion } from "../../../hooks/useRegion";
import { useDashboard } from "../../../pages/UnifiedDashboard/useDashboard";
import { detectTriggers } from "./triggerRules";
import "./SalesTriggerPanel.css";

// Local UI strings — keys match dashboard.js i18n. Lookup via lang param.
const UI = {
  en: {
    title: "Sales Triggers",
    sub: "Named VIPs acting right now — open their profile and reach out.",
    empty: "No active triggers. Triggers appear when an invited VIP shows intent.",
    openProfile: "Open profile",
    hot: "Hot",
    warm: "Warm",
    minute: "m ago",
    hour: "h ago",
    day: "d ago",
    now: "just now",
    stpSignalRepeatView: "Viewed {item} {count}× in 15 min",
    stpSignalRepeatViewGeneric: "Viewed the same item {count}× in 15 min",
    stpSignalPricing: "Requested pricing",
    stpSignalBrochure: "Downloaded brochure",
    stpSignalBooking: "Requested viewing",
    stpSignalReEngage: "Returned after {hours}h idle",
    stpSignalContact: "Contacted advisor",
  },
  ar: { /* ... mirror via dashboard.js — same keys */ },
  es: { /* ... */ },
  fr: { /* ... */ },
};

function ageString(ms, t) {
  if (ms < 60_000) return t.now;
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}${t.minute}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}${t.hour}`;
  return `${Math.floor(hr / 24)}${t.day}`;
}

function formatSignal(trigger, t) {
  const { signalKey, signalArgs } = trigger;
  if (signalKey === 'stpSignalRepeatView') {
    return signalArgs.item
      ? t.stpSignalRepeatView.replace('{item}', signalArgs.item).replace('{count}', signalArgs.count)
      : t.stpSignalRepeatViewGeneric.replace('{count}', signalArgs.count);
  }
  if (signalKey === 'stpSignalReEngage') {
    return t.stpSignalReEngage.replace('{hours}', signalArgs.hours);
  }
  return t[signalKey] || '';
}

export default function SalesTriggerPanel() {
  const { events, vips } = useDashboard();
  const { regionId } = useRegion();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = { ...UI.en, ...(UI[lang] || {}) };

  const triggers = useMemo(
    () => detectTriggers(events || [], vips || []),
    [events, vips]
  );

  const now = Date.now();

  return (
    <section
      className="stp-panel ud-card"
      data-region={regionId}
      aria-label={t.title}
    >
      <header className="stp-header">
        <div>
          <div className="ud-card-title">{t.title}</div>
          <div className="ud-card-subtitle">{t.sub}</div>
        </div>
      </header>

      {triggers.length === 0 ? (
        <div className="stp-empty">{t.empty}</div>
      ) : (
        <ul className="stp-list" role="list">
          {triggers.map((tr) => (
            <li key={tr.id} className="stp-row" data-urgency={tr.urgency}>
              <span className={`stp-dot stp-dot--${tr.urgency}`} aria-hidden="true" />
              <div className="stp-row__main">
                <div className="stp-row__name">
                  {tr.vipName}
                  {tr.score != null && <span className="stp-score">{tr.score}</span>}
                  <span className={`stp-chip stp-chip--${tr.urgency}`}>
                    {tr.urgency === 'hot' ? t.hot : t.warm}
                  </span>
                </div>
                <div className="stp-row__signal">{formatSignal(tr, t)}</div>
              </div>
              <div className="stp-row__age">{ageString(now - tr.lastEventAt, t)}</div>
              <button
                type="button"
                className="stp-row__cta"
                onClick={() => navigate('/unified/vip-crm', { state: { vipId: tr.vipId } })}
              >
                {t.openProfile}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

**Notes:**
- Single default export. No props. Reads everything from `useDashboard`.
- `data-region={regionId}` on root drives `--stp-accent` from CSS.
- "Open profile" navigates to existing route with `location.state.vipId` (deep-link consumption in VIPCrmTab is out of scope — a separate sprint will pick it up).
- Local `UI` constant matches the existing `OverviewTab` translation pattern. The same strings are also added to `dashboard.js` for consistency with the global registry (see §8).

**Target file size:** ~120 lines.

---

## 7. `SalesTriggerPanel.css`

```css
/* SalesTriggerPanel — namespace: stp-* */

.stp-panel {
  --stp-accent: var(--ud-accent, #457b9d);
  margin-top: 16px;
  margin-bottom: 16px;
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

**Target file size:** ~100 lines. Use logical properties (`margin-block-end`, `border-inline-start`) — never `margin-left`.

---

## 8. i18n strings — append to `frontend/src/i18n/portals/dashboard.js`

Inside the existing `registerTranslations("dashboard", { en, ar, es, fr })` call. **Flat keys, no nesting.** Add to each language block:

| Key | EN | AR | ES | FR |
|---|---|---|---|---|
| `stpTitle` | Sales Triggers | محفزات المبيعات | Disparadores de venta | Déclencheurs de vente |
| `stpSub` | Named VIPs acting right now — open their profile and reach out. | كبار الشخصيات المعروفون يتفاعلون الآن — افتح ملفهم وتواصل معهم. | VIPs identificados activando ahora — abre su perfil y contacta. | VIP identifiés agissant maintenant — ouvrez leur profil et contactez-les. |
| `stpEmpty` | No active triggers. Triggers appear when an invited VIP shows intent. | لا توجد محفزات نشطة. تظهر المحفزات عند إظهار VIP المدعو نية شراء. | Sin disparadores activos. Aparecen cuando un VIP invitado muestra intención. | Aucun déclencheur actif. Ils apparaissent quand un VIP invité montre une intention. |
| `stpOpenProfile` | Open profile | فتح الملف | Abrir perfil | Ouvrir le profil |
| `stpUrgencyHot` | Hot | ساخن | Caliente | Chaud |
| `stpUrgencyWarm` | Warm | دافئ | Tibio | Tiède |
| `stpSignalRepeatView` | Viewed {item} {count}× in 15 min | شاهد {item} {count} مرات في 15 دقيقة | Vio {item} {count}× en 15 min | A consulté {item} {count}× en 15 min |
| `stpSignalRepeatViewGeneric` | Viewed the same item {count}× in 15 min | شاهد نفس العنصر {count} مرات في 15 دقيقة | Vio el mismo elemento {count}× en 15 min | A consulté le même article {count}× en 15 min |
| `stpSignalPricing` | Requested pricing | طلب السعر | Solicitó precio | A demandé le prix |
| `stpSignalBrochure` | Downloaded brochure | حمّل البروشور | Descargó folleto | A téléchargé la brochure |
| `stpSignalBooking` | Requested viewing | طلب معاينة | Solicitó visita | A demandé une visite |
| `stpSignalReEngage` | Returned after {hours}h idle | عاد بعد {hours} ساعة من الخمول | Regresó tras {hours}h inactivo | Revenu après {hours}h d'inactivité |
| `stpSignalContact` | Contacted advisor | تواصل مع المستشار | Contactó al asesor | A contacté le conseiller |

Append 13 keys × 4 langs = 52 entries. Keep alphabetic order within each language block where possible, but consistency-with-existing-pattern wins over strict sort. **The component reads via its own local `UI` constant** (see §6) — the dashboard.js entries are the registry source of truth and tomorrow's refactor will pull from there. Both must match.

---

## 9. `OverviewTab.jsx` integration (5 lines)

Add import near the other `components/UnifiedDashboard/*` imports (~line 17):

```jsx
import SalesTriggerPanel from "../../../components/UnifiedDashboard/SalesTriggerPanel";
```

Insert the component **between `<SalesVelocity />` (line ~635) and the Weekly Trend `<div className="ud-card">` (line ~642)**:

```jsx
      <SalesVelocity
        metrics={velocityMetrics}
        lang={lang}
        sector={config.id}
        region={regionId}
      />

      <SalesTriggerPanel />

      <div className="ud-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", ...
```

No other changes to OverviewTab. Do not touch the destructure, the memos, or any other JSX.

---

## 10. Verify steps (must all pass before pushing)

1. **`npm run build`** in `frontend/` — must PASS with zero errors. Report the time and module count.
2. **PowerShell line counts** (Oguzhan is on Windows, primary env):
   ```powershell
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\index.jsx").Length
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\triggerRules.js").Length
   (Get-Content "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\SalesTriggerPanel.css").Length
   ```
   Expect: index.jsx ~120, triggerRules.js ~150, .css ~100. Any file >200L = scope check needed.
3. **i18n key presence** — grep each new key in `dashboard.js`:
   ```powershell
   Select-String -Path "frontend\src\i18n\portals\dashboard.js" -Pattern "stpTitle"
   Select-String -Path "frontend\src\i18n\portals\dashboard.js" -Pattern "stpSignalContact"
   ```
   Both must return ≥4 lines (one per language).
4. **No banned patterns** — confirm zero hits:
   ```powershell
   Select-String -Path "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\*" -Pattern "margin-left|margin-right"
   Select-String -Path "frontend\src\components\UnifiedDashboard\SalesTriggerPanel\*" -Pattern "console\.log"
   ```
   Both must return zero results.
5. **Region tint live-test (manual, `npm run dev`)** — open `/unified/overview`, cycle region selector (Canada → Gulf → USA → Mexico). The score chip + CTA button border on each trigger row must change color per region.
6. **Empty state** — temporarily mute VIP events (or sign in to a fresh tenant) and confirm the empty-state copy renders.
7. **Trigger detection — seed events to verify each rule.** In `npm run dev`, run this in browser DevTools console while on `/unified/overview`:
   ```javascript
   // Quick reasoning sanity — call detectTriggers from window (export it via index if needed only for local test, then revert)
   ```
   *Or* rely on existing demo seed which should produce at least one HIGH_INTENT (pricing_request) trigger. Confirm at least one row shows.
8. **Mobile responsive** — Chrome DevTools 375px width. CTA must drop to a second grid row, no overflow.
9. **`prefers-reduced-motion`** — toggle OS setting or DevTools rendering pane. Hot pulse animation must stop, no other regression.

---

## 11. Out of scope (do NOT do)

- Deep-link consumption of `location.state.vipId` inside VIPCrmTab — separate sprint.
- Admin-editable trigger thresholds — v2.
- Custom action templates per trigger type — Sprint 2 #6 (Outreach guardrail copy).
- Push notifications — service worker work, separate sprint.
- Dismiss / snooze on triggers — v2.
- Any new Firestore collection, listener, or tracking event.
- Any change to `useDashboardData.js` or `useDashboard.js`.
- Any change to existing event-key normalization.
- Any change to OverviewTab beyond the 1 import + 1 component insertion.

---

## 12. Tone for the PR description

> Sprint 2 #2 — Sales Trigger Panel. New surface on `/unified/overview` between SalesVelocity and Weekly Trend. Detects 4 named-VIP signals (REPEAT_VIEW, HIGH_INTENT, RE_ENGAGE, CONTACT_AGENT) from existing `useDashboard` data. Region-aware via `--stp-accent` CSS variable. Zero new Firestore, zero tracking changes, zero route changes. ~370 lines added across 3 new files + 5 lines integration + 52 i18n entries.

---

## 13. Audit gates Claude will check on the returned PR

- [ ] `npm run build` PASS (paste the build time + module count)
- [ ] All 3 new files within size targets (±20%)
- [ ] Zero `margin-left` / `margin-right` / `console.log` in new files
- [ ] All 13 i18n keys present in all 4 languages (52 entries)
- [ ] OverviewTab integration is exactly 1 import + 1 component placement — no other diffs
- [ ] Region cycle visually changes the accent on at least the score chip and the CTA border
- [ ] Empty state renders when no VIP events exist
- [ ] No new Firestore reads/writes anywhere

Cursor: when this PR is ready, push to `cursor/sprint-2-2-sales-trigger-panel`, do NOT merge. Oguzhan + Claude audit, then merge.

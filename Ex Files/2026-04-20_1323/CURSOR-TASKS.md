# CURSOR TASK BRIEF — 2026-04-16
## DynamicNFC UnifiedDashboard — Phase 3 Polish

> **Context:** Cowork (Claude Opus 4.6) just finished Phase 1 + Phase 2. Build is green.
> Your job = the 4 polish tasks below. Work in order. Build after each task. No scope creep.

**Pre-flight:** `cd frontend && npm run build` — must pass BEFORE you start.

---

## TASK 1 — FR Translations (6 files)

**Why:** We're at EN/AR/ES parity on campaigns, but 6 dashboard files still have `fr:` blocks with English fallbacks or missing keys. French-speaking developers in QC/FR need native strings.

**Files to patch (add `fr:` block at same parity as `en:`):**

1. `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` — search for `const LAYOUT_TEXT = {` → ensure `fr:` has every key in `en:`
2. `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` — search for `TEXT = {` or `tx = {` → add `fr:` parity
3. `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` — same pattern
4. `frontend/src/pages/UnifiedDashboard/components/ExportPDF.jsx` — same pattern
5. `frontend/src/pages/UnifiedDashboard/components/AddDealModal.jsx` — same pattern
6. `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx` — same pattern

**Method:**
1. `grep -n "fr: {" <file>` — find the fr block
2. Compare keys vs `en: {` — any missing key = add with French translation
3. Use native luxury real estate vocabulary (not Google Translate literal). Reference tone in `campaignsTab.i18n.js` fr block.

**Translation style:**
- "Dashboard" → "Tableau de bord"
- "Active" → "Actif" / "Actives" (gender match)
- "Campaign" → "Campagne"
- "Tap" (NFC tap) → "Tap" (keep English — industry term)
- "Card Intelligence" → "Intelligence Carte"
- "At Risk" → **"Réactivation Requise"** (NOT "À Risque" — we just renamed this product-wide)

**Done when:**
- [ ] All 6 files have `fr:` block with same keys as `en:`
- [ ] `npm run build` passes
- [ ] Manually test: open `/unified`, switch language to FR in topbar — no `undefined` or English leakage on any tab

---

## TASK 2 — Campaign Budget Column in Table

**Why:** CampaignsTab schema has `budget` and `spent` fields (tenantService.js), AddCampaignModal captures them, CampaignDrawer shows them — but the **table row** doesn't show budget at all. Execs scanning the list can't see at-a-glance which campaigns are over-spend.

**File:** `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`

**What to add:**

1. **New column header** between `Status` and `Taps`:
   ```jsx
   <th className="ud-cmp-th">{tx.budget}</th>
   ```
   i18n keys: add to `campaignsTab.i18n.js` — `budget: "Budget"` / `"الميزانية"` / `"Presupuesto"` / `"Budget"`.

2. **New cell** in each row (after Status cell, before Taps cell):
   ```jsx
   <td className="ud-cmp-td ud-cmp-td--budget">
     {campaign.budget > 0 ? (
       <div className="ud-cmp-budget-cell">
         <div className="ud-cmp-budget-cell__bar">
           <div
             className="ud-cmp-budget-cell__fill"
             style={{
               width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%`,
               background: campaign.spent > campaign.budget ? "#e63946" : "#22c55e"
             }}
           />
         </div>
         <div className="ud-cmp-budget-cell__text">
           ${formatMoney(campaign.spent)} / ${formatMoney(campaign.budget)}
         </div>
       </div>
     ) : (
       <span className="ud-cmp-muted">—</span>
     )}
   </td>
   ```

3. **CSS** in `CampaignsTab.css` (append at end):
   ```css
   .ud-cmp-td--budget { min-width: 140px; }
   .ud-cmp-budget-cell { display: flex; flex-direction: column; gap: 4px; }
   .ud-cmp-budget-cell__bar {
     height: 4px;
     background: rgba(255,255,255,0.05);
     border-radius: 999px;
     overflow: hidden;
   }
   .ud-cmp-budget-cell__fill {
     height: 100%;
     border-radius: 999px;
     transition: width 0.3s ease;
   }
   .ud-cmp-budget-cell__text {
     font-size: 11px;
     color: var(--ud-text-muted, #94a3b8);
     font-variant-numeric: tabular-nums;
   }
   [data-theme="light"] .ud-cmp-budget-cell__bar { background: #eef2f7; }
   ```

4. **Helper:** `formatMoney(n)` — add to top of file or import from utils:
   ```js
   const formatMoney = (n) => {
     if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
     if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
     return n.toFixed(0);
   };
   ```

**Done when:**
- [ ] Budget column visible in table
- [ ] Bar fills green below 100%, red above 100% (over-spend warning)
- [ ] Empty budget shows "—"
- [ ] Build passes
- [ ] Works in dark + light theme

---

## TASK 3 — URL Query Param Persistence (Campaigns filters)

**Why:** If a sales manager filters "Active" + "Emaar client" + sorts by budget and shares the URL with their team — the link should restore that exact view. Today it's ephemeral state only.

**File:** `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`

**Pattern:**

1. Import `useSearchParams`:
   ```js
   import { useSearchParams } from "react-router-dom";
   ```

2. Read params on mount, write on change. Keep the existing `useReducer` — just hydrate initial state from URL + push updates to URL.

3. **Params to persist:**
   - `status` — draft / active / paused / completed / archived (or "all")
   - `source` — manual / csv / api (or "all")
   - `q` — search query
   - `sort` — created / taps / budget / name
   - `dir` — asc / desc
   - `page` — pagination cursor

4. **Implementation sketch:**
   ```jsx
   const [searchParams, setSearchParams] = useSearchParams();

   // On init: hydrate reducer from URL (pass to useReducer initializer)
   const initialState = {
     statusFilter: searchParams.get("status") || "all",
     sourceFilter: searchParams.get("source") || "all",
     searchQuery: searchParams.get("q") || "",
     sortField: searchParams.get("sort") || "created",
     sortDir: searchParams.get("dir") || "desc",
     currentPage: parseInt(searchParams.get("page") || "1", 10),
     // ... keep rest of existing state
   };

   // Sync to URL after reducer updates:
   useEffect(() => {
     const next = new URLSearchParams();
     if (state.statusFilter !== "all") next.set("status", state.statusFilter);
     if (state.sourceFilter !== "all") next.set("source", state.sourceFilter);
     if (state.searchQuery) next.set("q", state.searchQuery);
     if (state.sortField !== "created") next.set("sort", state.sortField);
     if (state.sortDir !== "desc") next.set("dir", state.sortDir);
     if (state.currentPage > 1) next.set("page", String(state.currentPage));
     setSearchParams(next, { replace: true });
   }, [state.statusFilter, state.sourceFilter, state.searchQuery, state.sortField, state.sortDir, state.currentPage, setSearchParams]);
   ```

**Gotchas:**
- Use `{ replace: true }` — don't pollute browser history on every keystroke
- Only set params with non-default values (cleaner URLs)
- Debounce the search query sync (300ms) — otherwise URL updates on every letter typed

**Done when:**
- [ ] Apply filters → URL updates (e.g., `?status=active&source=manual`)
- [ ] Reload page → filters restored exactly
- [ ] Clear filters → URL params removed (clean URL)
- [ ] Build passes

---

## TASK 4 — Source Badges Redesign (Campaigns)

**Why:** Current source badge (Manual / CSV / API) is a plain text label. Hard to scan. Needs icon + colored pill so a manager can grok a campaign's origin in 0.2s.

**File:** `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`

**Design spec:**

| Source | Icon (SVG inline) | Background | Text color |
|--------|-------------------|------------|-----------|
| Manual | Pencil/edit | rgba(69, 123, 157, 0.12) | #457b9d |
| CSV | Document rows | rgba(184, 134, 11, 0.12) | #b8860b |
| API | Code brackets | rgba(42, 157, 143, 0.12) | #2a9d8f |

**Implementation:**

1. Add `<SourceBadge source={s} />` component inside CampaignsTab.jsx (top of file, before the main component):

```jsx
const SourceBadge = ({ source, label }) => {
  const config = {
    manual: {
      color: "#457b9d",
      bg: "rgba(69, 123, 157, 0.12)",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    csv: {
      color: "#b8860b",
      bg: "rgba(184, 134, 11, 0.12)",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
        </svg>
      ),
    },
    api: {
      color: "#2a9d8f",
      bg: "rgba(42, 157, 143, 0.12)",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
  };
  const c = config[source] || config.manual;
  return (
    <span
      className="ud-cmp-source-badge"
      style={{ color: c.color, background: c.bg, borderColor: c.color + "33" }}
    >
      {c.icon}
      <span>{label}</span>
    </span>
  );
};
```

2. Replace existing source text in table row with:
   `<SourceBadge source={campaign.source} label={tx[`source_${campaign.source}`] || campaign.source} />`

3. **CSS** (append to CampaignsTab.css):
```css
.ud-cmp-source-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
```

**Done when:**
- [ ] All 3 source types render with icon + colored pill
- [ ] Hover state not required — static is fine
- [ ] Build passes

---

## FINAL CHECKLIST BEFORE YOU RETURN

- [ ] All 4 tasks done
- [ ] `cd frontend && npm run build` passes (no new warnings)
- [ ] `wc -l` on every file you touched — verify no truncation (files ending with `}` not cut mid-line)
- [ ] Run `bash frontend/scripts/check-integrity.sh` if it exists
- [ ] **Do NOT touch:**
  - `UnifiedLayout.jsx` sidebar/topbar layout (Cowork just refined it — don't regress)
  - `CardsTab.jsx` `ud-ci-*` CSS (20 classes just added — don't duplicate)
  - `firestore.rules`
  - `functions/` (Claude Code's domain)

## IF SOMETHING BREAKS

Report back with: (1) which task, (2) the exact error, (3) which file + line. Don't "fix forward" — stop and ask.

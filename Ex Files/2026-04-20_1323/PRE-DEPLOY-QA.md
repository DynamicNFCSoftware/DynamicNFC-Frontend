# PRE-DEPLOY QA CHECKLIST — 2026-04-16
## DynamicNFC dynamicnfc.ca — Final Gate Before Firebase Deploy

> **When to run:** After Cursor finishes Phase 3 AND Claude Code deploys the tap aggregation function. NOT before.
>
> **Who runs:** Oguzhan (or whoever has the Firebase CLI + browser access). Estimated time: 25-35 min.
>
> **Pass criteria:** Every checkbox ticked. Any ❌ = halt, fix, re-run that section.

---

## 0 · PRE-FLIGHT (terminal)

```bash
cd "C:\Users\oguzh\DynamicNFC\frontend"
npm run build
```

- [ ] Build completes in < 60s with **0 errors**
- [ ] No new warnings vs last known-good build
- [ ] Bundle sizes: `index.js` < 400 KB, `CardsTab.js` < 35 KB, `CampaignsTab.js` < 55 KB

```bash
# Integrity check — verify no truncated files
bash scripts/check-integrity.sh
# OR manually:
wc -l src/pages/UnifiedDashboard/UnifiedLayout.jsx           # expect ~710
wc -l src/pages/UnifiedDashboard/UnifiedLayout.css           # expect ~5140
wc -l src/pages/UnifiedDashboard/tabs/CardsTab.jsx           # expect ~1070
wc -l src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx       # expect ~820 (after budget col)
wc -l src/pages/UnifiedDashboard/tabs/CampaignsTab.css       # expect ~530 (after badges)
```

- [ ] Every file above ends with `}` on the last non-empty line (no mid-statement cuts)

---

## 1 · SIDEBAR & TOPBAR (desktop 1440px)

Route: `/unified` (logged in)

**Sidebar:**
- [ ] Logo image renders top-left (fallback `logo_l_check.png` if primary missing)
- [ ] Section labels ("INTELLIGENCE", "OPERATIONS") visible, small-caps, subtle color
- [ ] Active nav item shows **blue gradient background + 3px inline-start indicator stripe** (Cowork Phase 2B)
- [ ] Inactive items ~62% opacity; hover bumps to ~92%
- [ ] Collapse button → sidebar shrinks to 64px, icons only
- [ ] On collapsed sidebar, **Portal Links icon button** shows a flyout popover when clicked — flyout must NOT be clipped or hidden (Cowork Phase 2A fix)
- [ ] Flyout closes on backdrop click or link click
- [ ] Tooltips appear on collapsed nav items (hover ~500ms)

**Topbar (right side):**
- [ ] ● Live / Demo indicator (colored dot + label)
- [ ] 🇺🇸 country selector opens region menu
- [ ] Single language cycle button: click cycles EN → AR → ES → FR → EN
- [ ] 🌙 theme toggle flips dark ↔ light; persists in localStorage (`ud-theme`)
- [ ] Export PDF button visible + clickable

**Topbar (left side):**
- [ ] Logo image (small) + divider + current page title

---

## 2 · LANGUAGE SWITCH (smoke test all 4)

For each language, tap through these tabs: Overview / Inventory / Cards / Campaigns / Pipeline / VIP CRM.

- [ ] **EN** — no missing keys, no raw `tx.keyName` showing
- [ ] **AR** — RTL direction applied (`<html dir="rtl">`); sidebar mirrors (stripe on right); chart axes mirror; text reads right-to-left; no layout overflow
- [ ] **ES** — strings translated; "Reactivation Needed" renders as "Necesita Reactivación"
- [ ] **FR** — Cursor's Phase 3 Task 1 should have filled gaps; "Reactivation Needed" = "Réactivation Requise"

---

## 3 · KPI CARDS (Overview + Cards tabs)

**Overview tab:**
- [ ] 4 KPI cards render with numbers (not loading spinners) within 2s
- [ ] Sparklines animate on first view
- [ ] Click a KPI → drill-through behavior (if configured) or at minimum no error

**Cards tab (Card Intelligence):**
- [ ] 4 KPI cards: Total Taps (7d) / Active Cards / Most Viewed / **Reactivation Needed (♻️ gold accent — NOT ⚠️ red)**
- [ ] Click "Reactivation Needed" → filter chips activate, only dormant cards shown
- [ ] Click again → filter cleared
- [ ] "Clear filter" ghost button works (Cowork's `ud-ci-clear-kpi`)

---

## 4 · CHARTS (CardsTab drawer + CampaignsTab drawer)

**CardsTab card detail drawer (click any row):**
- [ ] Mini funnel chart renders (Cowork Phase 1 fixed this — `ud-ci-funnel__bar-bg` + `__bar-fill`)
- [ ] Conversion rate percentage shows in blue rate badge
- [ ] Linked deals list renders with stage badges (if any linked)
- [ ] Empty state renders dashed border if no deals
- [ ] Suggestion banner renders with correct color: green (deal) / gold (reactivate) / blue (followup)
- [ ] CTA row (Reassign / Pause / Create Deal) renders as flex buttons — not stacked

**CampaignsTab drawer:**
- [ ] 7-day AreaChart (recharts) renders tap trend — no overflow
- [ ] Audit trail expandable section works
- [ ] Budget progress bar renders correctly (Cursor Phase 3 Task 2)
- [ ] Budget: green < 100%, red > 100%

---

## 5 · CARDS HEATMAP / INVENTORY (desktop + mobile)

**Inventory tab:**
- [ ] Type filter chips (All / Studio / 1BR / 2BR / 3BR / Penthouse) work
- [ ] Hot Unit Spotlight shows a unit with highest tap count
- [ ] Unit detail drawer opens, shows BarChart + VIP chips + Create Deal CTA
- [ ] Create Deal navigates to Pipeline tab with pre-filled unit

---

## 6 · KANBAN (Pipeline tab)

- [ ] 6 columns render: New / Contacted / Qualified / Viewing / Negotiation / Closed
- [ ] Drag-drop between columns updates Firestore and shows toast
- [ ] Add Deal modal opens, campaign dropdown lists non-archived campaigns (Sprint 2)
- [ ] Closed-won deals show green checkmark; closed-lost show muted
- [ ] Column counts update in real-time

---

## 7 · SECTOR SWITCHER (Real Estate ↔ Automotive ↔ future Yacht)

- [ ] Sector selector in sidebar (or wherever configured) toggles theme / data / labels
- [ ] Switch to Automotive → demo data pivots to vehicles, personas become Khalid/Sultan
- [ ] Switch back to Real Estate → data resets to property demo
- [ ] localStorage persists sector selection across page reload

---

## 8 · RESPONSIVE (mobile emulator or real phone)

Test at 375px (iPhone SE):
- [ ] Sidebar collapses to off-canvas (hamburger opens it)
- [ ] Topbar actions reflow correctly (no overflow)
- [ ] KPI cards stack 2×2 (not 1×4)
- [ ] Drawer becomes full-screen modal
- [ ] Kanban horizontal-scrolls

Test at 768px (tablet):
- [ ] Sidebar visible, compact mode
- [ ] Tables show fewer columns (or horizontal scroll)

---

## 9 · FIRESTORE & CLOUD FUNCTIONS

**Rules & Indexes:**
- [ ] `firebase deploy --only firestore:rules` — no rule errors
- [ ] `firebase deploy --only firestore:indexes` — indexes report READY in Firebase console

**Cloud Functions:**
- [ ] `aggregateCampaignTaps` function deployed (`firebase functions:list`)
- [ ] Schedule shows "every 15 minutes" in GCP Cloud Scheduler
- [ ] Logs show first successful run: `firebase functions:log --only aggregateCampaignTaps`
- [ ] Pick one campaign doc → `aggregates` field populated

**Existing functions:**
- [ ] `cardRedirect` still works: visit `dynamicnfc.ca/c/VISTA001` → redirects to `/enterprise/crmdemo/khalid` + logs tap
- [ ] `/api/taps/stats` returns 401 without auth, 200 with admin token

---

## 10 · FINAL DEPLOY

```bash
cd "C:\Users\oguzh\DynamicNFC"

# Full deploy
firebase deploy

# Smoke test production
# Visit https://dynamicnfc.ca — home loads
# Visit https://dynamicnfc.ca/unified — after login, dashboard loads
# Visit https://dynamicnfc.ca/c/VISTA001 — redirects to Khalid portal
```

- [ ] `firebase deploy` completes with **no errors**
- [ ] Hosting URL resolves: `https://dynamicnfc.ca` returns 200
- [ ] Custom domain SSL valid (green padlock)
- [ ] Lighthouse mobile score > 80 (Performance) on home page
- [ ] No console errors on /unified after login

---

## 11 · ROLLBACK PLAN

If production breaks post-deploy:

```bash
# List recent hosting deploys
firebase hosting:channel:list

# Roll back to previous release
firebase hosting:rollback
```

For functions:
```bash
# Re-deploy prior commit's functions
git checkout <prev-sha> -- functions
firebase deploy --only functions
git checkout HEAD -- functions
```

---

## SIGN-OFF

- [ ] All sections ✅ or explicitly marked "known issue, defer"
- [ ] Screenshots saved to `/memory/deploy-2026-04-16/` for future reference
- [ ] Session summary written to memory (`memory/projects/deploys.md` or similar)

**Deployed by:** ___________________
**Date / time:** ___________________
**Git SHA:** ___________________

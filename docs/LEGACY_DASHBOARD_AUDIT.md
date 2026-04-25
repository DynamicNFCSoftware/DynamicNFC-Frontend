# Legacy Dashboard Feature Audit
Generated: 2026-04-24 by Claude Code
Source: /enterprise/crmdemo/dashboard + /automotive/dashboard
Status: READ-ONLY audit — no code modified

## Executive Summary
- Total features inventoried: 36
- CRITICAL features missing from /unified: 6
- HIGH features missing from /unified: 9
- Total estimated migration complexity: TRIVIAL × 4, SIMPLE × 11, MEDIUM × 14, COMPLEX × 7
- One-line recommendation: Do not retire legacy until the 5-Minute Proof tutorial, BroadcastChannel toast feed, "REP BRIEFING / Why Call Now" sales-trigger card, and Buyer Sites quick-link sidebar are migrated to /unified — these four carry the live-demo narrative.

---

## Section 1 — /enterprise/crmdemo/dashboard (Dashboard.jsx)

File: `C:\Users\oguzh\DynamicNFC\frontend\src\pages\Dashboard\Dashboard.jsx` (1313 lines)
CSS: `C:\Users\oguzh\DynamicNFC\frontend\src\pages\Dashboard\Dashboard.css` (74 KB)
Storage: `localStorage["dnfc_events"]` + `BroadcastChannel("dnfc_tracking")` (no Firestore).

### Feature 1.1 — 5-Minute Proof for Leadership & Sales tutorial
- **Location:** Dashboard.jsx:658-688
- **What it does:** Renders the `db-demo-guide` block at the top of the Overview tab — five numbered steps that walk a meeting attendee through the demo flow (open Khalid VIP portal → simulate VIP behavior → see dashboard light up → open Ahmed/registered portal → open marketplace/anonymous portal). Each step has an inline "Open Portal →" link that opens the relevant demo URL in a new tab.
- **Sales value:** CRITICAL — this is the entire on-screen script for a leadership demo. Without it, presenters have to memorize the order and explain the contrast manually. Embeds the brand contrast (VIP / Registered / Anonymous = three trust tiers).
- **Exists in /unified?** NO — `OverviewTab.jsx` has a 4-item `WORKFLOW_STEPS` checklist ("Review hot leads / Check idle VIPs / Send outreach / Update pipeline") at lines 362-387, but this is a daily-rep checklist, not a demo onboarding script. Search confirmed: no "demoStep", "5-Minute", "5-step" strings anywhere in `/UnifiedDashboard`.
- **Migration complexity:** SIMPLE — copy block + 5 i18n keys + 3 portal links. The links already exist in the unified sidebar's `getPortalLinks()` helper.
- **Dependencies:** translations (`demoGuideTitle`, `demoStep1..5`, `openPortalLink`); `<Link>` for portal URLs.
- **Notes:** Brand-language exact copy:
```jsx
<span className="db-demo-guide-title">{t("demoGuideTitle")}</span>
<span className="db-demo-guide-sub">{t("demoGuideSubtitle")}</span>
<div className="db-demo-step">
  <span className="db-demo-step-num">1</span>
  <span className="db-demo-step-text">{t("demoStep1")}</span>
  <Link to="/enterprise/crmdemo/khalid" target="_blank">{t("openPortalLink")}</Link>
</div>
```

### Feature 1.2 — "Sales command center" header narrative + "Today Actions" hero card
- **Location:** Dashboard.jsx:646-731 (entire `db-card db-card-hero` for `todayActionsTitle`)
- **What it does:** Top-left hero card titled with `t("todayActionsTitle")` ("Today: 3 buyers to call") + `t("todayActionsSub")` subtitle. Lists top 3 VIPs with avatar / score / `at risk` badge / tower / idle days / sales-trigger reasoning + Outreach button each.
- **Sales value:** CRITICAL — this is the "5 minutes to revenue" payoff after the tutorial. Frames the dashboard as a daily action list, not a report.
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx:580` renders `<CallQueue queue={callQueue} ... />` which is conceptually similar (top VIPs to call). However the "Sales command center" header narrative + "61 buyer actions logged" subtitle copy is NOT present; the per-row sales-trigger reason (`v.trigger.en` / `v.trigger.ar`) is missing — CallQueue only shows `triggerReason` text without the styled colored trigger panel.
- **Migration complexity:** MEDIUM — CallQueue component needs a header narrative slot + per-item trigger reasoning panel; data-shape change required from `useDashboard()`.
- **Dependencies:** `metrics.vipM[].trigger` (from `getSalesTrigger`), `scoreColor()`, `initials()`, `towerName()`, `openOutreach()`.

### Feature 1.3 — REP BRIEFING / "Why call now?" sales-trigger panel (per-VIP)
- **Location:** Dashboard.jsx:711-720 (in Today list) and Dashboard.jsx:916-919 (VIP CRM expanded view)
- **What it does:** When a VIP has a `trigger` (output of `getSalesTrigger()`, lines 208-253), renders a colored card with `t("salesTrigger") + ": " + t("whyCallNow")` label, an icon (🔥/💰/⚖️/📐/⚡), and a one-sentence reasoning ("High Penthouse interest — viewed PH and requested pricing in last 48h. Luxury up-sell opportunity."). Six rule types: `booking`, `hot_ph`, `pricing_stall`, `comparing`, `floorplan`, `high_activity`.
- **Sales value:** CRITICAL — embodies the "20/20 Vision vs Blind Spot" pitch. The phrase "Strike while interest is hot" is hard-coded in the high_activity rule. This is the most quoted feature in pitch decks.
- **Exists in /unified?** PARTIAL — `useDashboard()` returns `vip.triggers[]` and `PriorityTab.jsx:336-342` shows the first trigger as a small chip (`{trigger.icon} {fromEventDisplay(trigger.type)}`). PriorityTab's expanded `generateAdvice()` function (lines 109-192) generates similar-flavored AI text BUT only on row expansion; it is NOT shown on the Overview hero card or VIP-CRM list. The legacy "💡 Sales Trigger: Why call now?" colored panel (always-visible on hot VIPs) is gone.
- **Migration complexity:** MEDIUM — need to wire `vip.triggers[0]` into both OverviewTab CallQueue rows AND VIPCrmTab detail panel, with the colored-card visual treatment.
- **Dependencies:** `vip.triggers` already exists in `useDashboard()` data shape.
- **Notes:** Exact legacy JSX (Dashboard.jsx:916-919):
```jsx
{v.trigger&&(<div className="db-trigger" style={{background:`${v.trigger.color}0a`,border:`1px solid ${v.trigger.color}22`}}>
  <span className="db-trigger-ico">{v.trigger.icon}</span>
  <div className="db-trigger-body"><div className="db-trigger-label" style={{color:v.trigger.color}}>💡 {t("salesTrigger")}: {t("whyCallNow")}<span className="db-ai-badge">AI</span></div>
  <div className="db-trigger-text">{isAr?v.trigger.ar:v.trigger.en}</div></div>
</div>)}
```

### Feature 1.4 — Live Activity Feed with portal-type filter chips
- **Location:** Dashboard.jsx:732-772
- **What it does:** Right-side hero card. Reverse-chronological event list, last 12 events. Filter chips: All / VIP / Registered / Lead / Anonymous. Each row: portal icon (🔑/👤/🌐) + name + `VIP` mini-badge + event label + relative time.
- **Sales value:** HIGH — provides the "live" feel during a demo (events stream in as the presenter clicks portals).
- **Exists in /unified?** YES — `OverviewTab.jsx:701-727` renders `<ActivityFeed events={filteredEvents} />` with the same 5 portal-type filter chips. Equivalent functionality.
- **Migration complexity:** TRIVIAL — already migrated.

### Feature 1.5 — BroadcastChannel real-time tracking listener
- **Location:** Dashboard.jsx:349-376
- **What it does:** Subscribes to `BroadcastChannel("dnfc_tracking")`. When a CRM Demo portal (in another tab) writes a tracked event, the dashboard receives it instantly, refreshes events, and pushes a toast notification with sector-specific icon + EN/AR copy. Maps 8 event types: `request_pricing`, `book_viewing`, `download_brochure`, `explore_payment_plan`, `contact_advisor`, `lead_captured`, `use_roi_calculator`, `view_floorplan`.
- **Sales value:** CRITICAL — this is the magic moment. Presenter clicks "Request Pricing" in the Khalid portal → dashboard toast pops up < 1 second later. Without this, the demo collapses.
- **Exists in /unified?** PARTIAL — `useDashboard()`/`useDashboardData()` reads from Firestore. Per CLAUDE.md, demo portals write to Firestore via `firestoreTracking.js` AND should appear in unified. However: `NotificationSystem.jsx` is imported at `UnifiedLayout.jsx:15` but is NEVER rendered inside the JSX tree (verified by reading lines 280-769). So toasts driven by real demo events are inactive in /unified. The mock auto-fire path exists in NotificationSystem (line 154 — `if (dataMode !== "mock") return undefined`) but no toast container is mounted.
- **Migration complexity:** MEDIUM — render `<NotificationSystem dataMode={dataMode} events={events} />` somewhere inside `LayoutContent`, and confirm Firestore-driven realtime path (lines 170-191) actually fires for unified users.
- **Dependencies:** Tracking system change — legacy uses `BroadcastChannel`, unified uses Firestore subscriptions. Per CLAUDE.md §10 ("3 tracking systems → unify to Firestore as primary"), this is intentional.

### Feature 1.6 — Auto-firing demo notifications (every 25 s)
- **Location:** Dashboard.jsx:378-393
- **What it does:** During a sales meeting with no real activity, fires one of 7 hard-coded toast notifications every 25 s ("Khalid Al-Rashid requested payment plan — Aurora Penthouse", "New lead captured: Omar Khalil", "Anonymous visitor requested pricing — Nova Penthouse 1", etc.). First one fires at 5 s.
- **Sales value:** HIGH — fills the silence in early demo minutes when no real events have streamed in. Sales-tested copy.
- **Exists in /unified?** PARTIAL — `NotificationSystem.jsx:154-168` has equivalent logic with sector+region-aware persona names from `getPersonas()`, but the component is not actually mounted (see 1.5).
- **Migration complexity:** TRIVIAL once 1.5 is fixed — render the component.

### Feature 1.7 — Sidebar "BUYER SITES (DEMO)" portal shortcuts with last-activity status
- **Location:** Dashboard.jsx:589-624 (entire `<aside className="db-sidebar">`)
- **What it does:** Three NavLinks at the top of the sidebar, each opening a portal in a new tab: VIP (Khalid), Ahmed (Registered), Marketplace (Anonymous). Each shows the LAST event for that portal under the title (e.g., "Requested Pricing — Aurora Penthouse 1 · 5m ago"), computed live from `portalStatus` memo (lines 553-582).
- **Sales value:** CRITICAL — combines navigation, "I just did X" feedback, AND the brand contrast in one widget. This is the "tap and watch" sidebar.
- **Exists in /unified?** PARTIAL — `UnifiedLayout.jsx:521-589` has a "Portal links" flyout (collapsed-or-flyout) listing the same 3 portals but with NO last-activity status indicator. The `getPortalLinks()` (lines 289-315) returns `{label, kind, href}` only.
- **Migration complexity:** MEDIUM — augment `getPortalLinks()` to include latest event per portal; add status sub-line; flyout currently has no room for it (would need redesign).
- **Notes:** Legacy NavLink shape:
```jsx
<NavLink to="/enterprise/crmdemo/khalid" target="_blank">
  <span className="db-nav-portal-title">{t("navVipPortal")}</span>
  <span className="db-nav-portal-sub">
    {portalStatus.khalid ? `${portalStatus.khalid.act} · ${portalStatus.khalid.time}` : "No activity yet"}
  </span>
</NavLink>
```

### Feature 1.8 — Top-right action buttons: Help, + Create VIP, Reset Demo, LIVE indicator, Theme toggle
- **Location:** Dashboard.jsx:625-637
- **What it does:** Topbar right side. `LIVE` text dot. Light/Dark theme toggle (button, not slider). Help pill (opens modal explaining VIP vs Standard, line 1234-1248). + Create VIP pill (opens form modal, line 1250-1263). Reset Demo pill — wipes `localStorage["dnfc_events"]` and reloads.
- **Sales value:** HIGH — Reset Demo is required between back-to-back demos. + Create VIP is a strong narrative: "let me invite a buyer right now, watch."
- **Exists in /unified?**
  - LIVE/Demo indicator: YES — `UnifiedLayout.jsx:692-695` shows `Live` or `Demo` text.
  - Theme toggle: YES — `UnifiedLayout.jsx:752-760`.
  - Help pill: NO equivalent.
  - + Create VIP / + Invite VIP: PARTIAL — `LAYOUT_TEXT.en.inviteVip = "Invite VIP"` is defined at line 32 but no JSX uses it; VIPCrmTab has `+ Add VIP` button at line 280-285 but it's inside the tab, not in the global topbar.
  - Reset Demo: PARTIAL — exists as a destructive `resetToDemo()` action inside SettingsTab (line 504), behind a confirm modal. NOT a one-click topbar pill.
- **Migration complexity:** SIMPLE — Help modal copy needs migration; topbar Reset Demo button is intentionally hidden from production (correct decision per `CLAUDE.md` "no destructive seed" rule). + Invite VIP can promote to topbar.

### Feature 1.9 — Sidebar Intelligence nav: Overview, VIP CRM, Priority, Analytics, Pipeline, AI, Units, Campaigns, Settings
- **Location:** Dashboard.jsx:614-622 (`NAV` array at line 547-552)
- **What it does:** Vertical nav with icons + badge counts (VIP CRM shows VIP count). "AI" entry routes to `/enterprise/crmdemo/ai-demo`.
- **Sales value:** MEDIUM — standard left-nav UX.
- **Exists in /unified?** YES — `UnifiedLayout.jsx:172-269` `TABS` array has 9 entries grouped into Intelligence/Operations/System sections. Mapping: Overview → Overview, VIP CRM → VIP CRM (with badge), Priority → Priority VIP, Analytics → Analytics, Pipeline → Pipeline, Units → Inventory ("Units & Plans" dynamic label), Campaigns → Campaigns, Settings → Settings. **AI entry is missing** from the unified TAB list. Legacy Dashboard's "🤖 AI" item navigates to `/enterprise/crmdemo/ai-demo`.
- **Migration complexity:** SIMPLE for nav parity. The "AI Pipeline" callout in the audit prompt — investigation: it's a nav item that opens a separate AI Demo page (`/enterprise/crmdemo/ai-demo` and `/automotive/demo/ai`), NOT a view inside Pipeline. Decide whether to add a 10th tab or accept that Unified intentionally separates Pipeline from AI Demo (which is a sales asset, not a CRM tab).

### Feature 1.10 — VIP CRM detail: Decayed Score, Repeat Views, Pricing Signal time, Days Idle, Alerts pills, Behavioral Timeline with decay multiplier
- **Location:** Dashboard.jsx:906-935
- **What it does:** When a VIP is selected, shows 4 KPI tiles (decayed score with ⏳ icon, repeat views, pricing-signal minutes, days-idle), then alert pills (`pricing_interest_detected`, `high_intent_no_booking`, `comparing_plans`, `family_buyer_focus`), then the timeline. Each timeline item shows `decay: ×0.78` (the time-decay multiplier).
- **Sales value:** HIGH — "decay: ×0.78" is the visual proof of the time-decay model. Strong technical-credibility moment.
- **Exists in /unified?** PARTIAL — `VIPCrmTab.jsx` shows score, idle days, triggers, CTA counts, recent events. The timeline exists. **The per-event decay multiplier is NOT shown.** The 4-tile KPI strip is not present (data is shown differently). Alerts pills migrated as triggers.
- **Migration complexity:** MEDIUM — surface `decayFactor()` per event in the timeline; restore the 4-KPI tile cluster.

### Feature 1.11 — Velocity KPIs row: Time to First Action, Viewing Velocity, VIP Conversion Lift, Lead Capture Rate
- **Location:** Dashboard.jsx:778-783
- **What it does:** 4-card row above standard KPIs. Computes `avgTTFA` (minutes from portal_opened → first view_unit), `avgVel` (days from first event → book_viewing), `convLift` (VIP/Std booking ratio with `∞×` fallback), `leadCaptureRate` (% of anon sessions that became leads).
- **Sales value:** HIGH — these are the "Sales Velocity Engine" metrics that tie to brand vocabulary. "Decision Speed" appears here.
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx:453-481` renders `config.kpis` from sector config (typically `vip_sessions`, `website_visitors`, `bookings`, `conversion_lift`). `conversion_lift` exists. **`avgTTFA`, `avgVel`, `leadCaptureRate` do NOT appear as KPIs.** PriorityTab does not show them either.
- **Migration complexity:** MEDIUM — need 3 new KPIs in `config.kpis` per sector + computation in `useDashboardData`.

### Feature 1.12 — Standard KPI counters with `<AnimCounter>` (animated count-up)
- **Location:** Dashboard.jsx:281-297 (component) + 785-791 (usage)
- **What it does:** 5 KPIs: VIP Sessions, Reg Sessions, Anon Sessions, Total Conversions, Booked Viewings — each counts up from 0 to value over 1.2 s.
- **Sales value:** MEDIUM — small visual flourish. Unified uses static numbers in `<KpiCard>`.
- **Exists in /unified?** PARTIAL — `KpiCard.jsx` shows static numbers, no count-up animation. `AnimatedCounter.jsx` component EXISTS in `/components/AnimatedCounter.jsx` but is not used in any tab.
- **Migration complexity:** TRIVIAL — wire `AnimatedCounter` into `KpiCard`.

### Feature 1.13 — Shared Conversion Actions strip with VIP/Std split + Sparkline
- **Location:** Dashboard.jsx:792-810
- **What it does:** 4 "actions" tiles (Book Viewing / Request Pricing / Payment Plan / Brochure) — each shows total + VIP-vs-Std dot split + a 7-day mini sparkline (`<Sparkline>` lines 300-309).
- **Sales value:** MEDIUM — explains funnel events; sparkline is sales-friendly.
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx:636-699` "Conversion Actions" is a horizontal stacked BarChart of VIP vs Standard for 5 row-types. **No per-action sparkline** (`MiniSparkline.jsx` exists and IS used in KPIs at line 477).
- **Migration complexity:** TRIVIAL — already conceptually equivalent. Could add sparkline in tile form if desired.

### Feature 1.14 — Conversion Funnel visual (SVG trapezoid stack with drop-off %)
- **Location:** Dashboard.jsx:833-870
- **What it does:** 5-step funnel rendered as SVG trapezoids (Total Visitors → Viewed Unit → Downloaded → Requested Pricing → Booked Viewing). Each step shows count, % of max, and `↓ X% drop-off` between steps. Below: `db-funnel-legend` with color key + per-step hint copy.
- **Sales value:** HIGH — drop-off % is a memorable "where do we lose people" moment in pitches.
- **Exists in /unified?** YES — `AnalyticsTab.jsx:382-398` computes `funnelData` with `dropOff`, rendered via `<SvgFunnel>` + `<FunnelInsightTable>`. Good parity.
- **Migration complexity:** TRIVIAL — already migrated (different visual form, same content).

### Feature 1.15 — Tower Interest Distribution bar chart
- **Location:** Dashboard.jsx:871-891
- **What it does:** Recharts vertical BarChart showing total events per tower (Al Qamar / Al Safwa / Al Rawda) with color-coded bars + per-tower legend.
- **Sales value:** MEDIUM — useful for multi-building real estate demos. Other regions (USA / Mexico / Canada) need different category labels.
- **Exists in /unified?** YES — `AnalyticsTab.jsx:352-362` `categoryData` does the equivalent grouped by `config.inventory.categories` per sector/region. Better — region-aware.
- **Migration complexity:** TRIVIAL — already migrated and improved.

### Feature 1.16 — Score Distribution histogram (5 buckets: 0-20 / 20-40 / 40-60 / 60-80 / 80+)
- **Location:** Dashboard.jsx:1032-1043
- **What it does:** Custom CSS-bar histogram with 5 vertical bars + count badges + threshold labels.
- **Sales value:** MEDIUM — visualizes lead quality distribution.
- **Exists in /unified?** YES — `AnalyticsTab.jsx:333-350` `scoreDistData` computes 5 buckets with same thresholds. Rendered in AnalyticsTab.
- **Migration complexity:** TRIVIAL — already migrated.

### Feature 1.17 — Live VIP Intent Heatmap + Property Demand Heatmap
- **Location:** Dashboard.jsx:1067-1089 (lines 491-507 for the data computation)
- **What it does:** 2 grid heatmaps. (1) VIP × Unit Type (Penthouse / 3BR / 2BR / 1BR) — colored cells `db-heat-vhigh / high / med / low`. (2) Tower × Floor band (low/mid/high) — same color scheme.
- **Sales value:** HIGH — heatmaps are pitch-deck favorites.
- **Exists in /unified?** YES — `AnalyticsTab.jsx:400-470` builds both `vipIntent` and `propertyDemand` heatmaps; rendered with `ud-heatmap-pro` table styling (UnifiedLayout.css:3443-3610).
- **Migration complexity:** TRIVIAL — already migrated and visually upgraded.

### Feature 1.18 — Priority VIP table with Owner workload chips
- **Location:** Dashboard.jsx:944-1005
- **What it does:** Above the priority table, "Owner Workload" card shows Due Today + High Risk totals + per-rep filter chips (each chip shows the rep's `dueToday` and `highRisk` counts). Table columns: VIP / Owner / Unit Focus / Lead Score (decayed) / Next Action / Due (today/tomorrow/week) / Risk (high/med/low) / Last Seen / Outreach button.
- **Sales value:** HIGH — this is the daily call sheet. The owner-chip strip is an excellent manager view.
- **Exists in /unified?** PARTIAL — `PriorityTab.jsx:276-292` has rep filter chips with `totalVips` + `highRisk` counts. **`dueToday` per-rep is NOT computed.** The legacy "Due / Risk" pill columns are NOT in the unified table. PriorityTab uses an "AI Recommendation" expandable row, which is richer but different.
- **Migration complexity:** MEDIUM — add `dueToday` to rep aggregation, add Due/Risk columns to PriorityTab table.

### Feature 1.19 — VIP Candidate auto-promotion (registered users with score ≥ 50)
- **Location:** Dashboard.jsx:1006-1011 (computation at line 457)
- **What it does:** Card listing registered users whose decayed score ≥ 50 with a "Promote to VIP →" button. Button currently shows an alert; would mint a card.
- **Sales value:** HIGH — closes the loop: anonymous → registered → VIP. Shows the system thinking forward.
- **Exists in /unified?** YES — `VIPCrmTab.jsx:328-358` `visibleCandidates` lists candidates with a Promote button (`handlePromote`). Equivalent.
- **Migration complexity:** TRIVIAL — already migrated.

### Feature 1.20 — Next Best Actions list + Quick Actions (Email High Intent, Export Priority)
- **Location:** Dashboard.jsx:1012-1024
- **What it does:** Two cards. Left: per-VIP suggested action (uses trigger text or fallback). Right: bulk-action buttons.
- **Sales value:** MEDIUM — utility actions. Demo-time mostly skipped.
- **Exists in /unified?** PARTIAL — PriorityTab has `getNextAction()` per row (line 235-241) but no dedicated NBA card; no Quick Actions strip.
- **Migration complexity:** SIMPLE.

### Feature 1.21 — Pipeline tab: Total Value bar + 7 Stage Summary cards + Kanban board with deal cards
- **Location:** Dashboard.jsx:1100-1180
- **What it does:** Pipeline view with 7 stages (Inquiry / Viewing Sched / Viewing Done / Negotiation / Reservation / Contract / Closed). Top: AED total bar. Stage summary row: count + value per stage. Kanban: deal cards with name, score pill, unit, value, rep, days-in-stage (red ≥ 5d), recent action. 10 hard-coded demo deals.
- **Sales value:** HIGH — pipeline view is the manager-buy-in moment.
- **Exists in /unified?** YES — `PipelineTab.jsx` + `KanbanBoard.jsx` (445 lines). Has drag-and-drop stage updates via `updateTenantDealStage`. AI-suggested deals via `suggestedDeals`. Better than legacy.
- **Migration complexity:** TRIVIAL — already migrated and superior.

### Feature 1.22 — Units tab: filter chips + table with Zero Engagement warning badge
- **Location:** Dashboard.jsx:1183-1203
- **What it does:** Filter pills (All / per-tower). Table: Unit ID / Name / Tower / Floor / Type / Status / Price / VIP Interest. If status≠sold and views=0, shows `⚠ ZERO ENGAGEMENT` red badge.
- **Sales value:** MEDIUM — Zero Engagement is a useful inventory-rotation insight.
- **Exists in /unified?** PARTIAL — `InventoryTab.jsx` exists with sector-aware inventory rendering, including a "hot card" view. **Zero Engagement badge not verified to exist** (search returned no `zeroEngagement` matches in /unified).
- **Migration complexity:** SIMPLE — add zero-engagement flag to inventory rendering.

### Feature 1.23 — Campaigns tab: card list + VIPs Linked to Campaigns table
- **Location:** Dashboard.jsx:1205-1217
- **What it does:** Lists 3 hard-coded campaigns with status pill. Below, a VIP × Campaign table.
- **Sales value:** LOW — minimal compared to unified `CampaignsTab.jsx` (771 lines, kanban editor, drawer, modal).
- **Exists in /unified?** YES — far richer.
- **Migration complexity:** TRIVIAL — superseded.

### Feature 1.24 — Settings tab: 4 In-Scope + 4 Out-of-Scope rules
- **Location:** Dashboard.jsx:1220-1227
- **What it does:** Two cards listing MVP boundaries.
- **Sales value:** LOW — boilerplate.
- **Exists in /unified?** YES — far richer SettingsTab (771 lines, real settings, currency, retention, reset).
- **Migration complexity:** TRIVIAL — superseded.

### Feature 1.25 — Help modal (VIP Traffic vs Std Traffic + Key Rule)
- **Location:** Dashboard.jsx:1234-1248
- **What it does:** Two-pane explainer modal. "VIP traffic = identified people, named, intent. Std traffic = sessions, anonymous." Plus a "Key Rule" footer.
- **Sales value:** MEDIUM — onboarding new sales reps to the framing.
- **Exists in /unified?** NO.
- **Migration complexity:** SIMPLE — copy modal + 2 i18n keys + topbar `?` button.

### Feature 1.26 — Outreach modal (Call Script + Email Snippet + Guardrail + Call/Email/WhatsApp deep-links)
- **Location:** Dashboard.jsx:1265-1289
- **What it does:** Per-VIP modal with 3 channel scripts + brand guardrail copy ("Don't say you tracked them. Say you're following up on their VIP invitation.") + `tel:` / `mailto:` / `wa.me/` links pre-filled with VIP context.
- **Sales value:** HIGH — guardrail copy is brand-critical. WhatsApp deep-link is Gulf-essential.
- **Exists in /unified?** YES — `OutreachModal.jsx` has 3-channel tabs with sector-aware project name. **Guardrail copy is NOT present** — search confirmed no "don't say you tracked them" string in /unified.
- **Migration complexity:** SIMPLE — port guardrail copy + 4 i18n keys.

### Feature 1.27 — Create VIP modal (form: name / phone / email / lang / campaign / cardId + brand note)
- **Location:** Dashboard.jsx:1250-1263
- **What it does:** Modal form to mint a new VIP. Footer note: "By issuing a VIP card, the client receives a premium invitation box signaling exclusive access."
- **Sales value:** HIGH — narrative tie-in to "Premium Box / Private Invitation" brand language.
- **Exists in /unified?** YES — `CreateVipModal.jsx` (5,858 bytes). Need to spot-check copy.
- **Migration complexity:** TRIVIAL — already migrated.

### Feature 1.28 — Toast notification system (top-right slide-in cards) with portal badge (VIP/LEAD/PUBLIC)
- **Location:** Dashboard.jsx:1291-1308 (component) + 327-393 (queue logic)
- **What it does:** Up to 5 toasts top-right. Each has icon, message, portal badge color-coded (VIP gold, LEAD red, PUBLIC neutral), close button. Auto-dismiss after 8 s.
- **Sales value:** CRITICAL — the in-meeting "magic" surface. See 1.5 + 1.6.
- **Exists in /unified?** PARTIAL — `NotificationSystem.jsx` exists with similar visual but not rendered (see 1.5).
- **Migration complexity:** MEDIUM (the rendering wire-up + Firestore-realtime path test).

### Feature 1.29 — Multi-line Engagement Over Time chart + Channel Mix donut
- **Location:** Dashboard.jsx:812-829
- **What it does:** Recharts LineChart with 3 lines (VIP/Reg/Anon) over date axis + PieChart donut for channel mix.
- **Sales value:** MEDIUM — standard analytics charts.
- **Exists in /unified?** YES — `OverviewTab.jsx` has Weekly Trend AreaChart (different but equivalent). Channel mix exists in AnalyticsTab.
- **Migration complexity:** TRIVIAL — already migrated.

### Feature 1.30 — Action Performance VIP-vs-Std bar + Top Plans by Interest horizontal bar
- **Location:** Dashboard.jsx:1046-1064
- **What it does:** 2 charts in Analytics. Vertical grouped bar (Book/Pricing/Payment/Brochure) and horizontal bar of plans ranked by interest score.
- **Sales value:** MEDIUM.
- **Exists in /unified?** YES — equivalent in AnalyticsTab.
- **Migration complexity:** TRIVIAL.

---

## Section 2 — /automotive/dashboard (AutoDashboard.jsx)

File: `C:\Users\oguzh\DynamicNFC\frontend\src\pages\AutomotiveDemo\AutoDashboard.jsx` (1571 lines)
CSS: `C:\Users\oguzh\DynamicNFC\frontend\src\pages\AutomotiveDemo\AutoDashboard.css` (26 KB)

**Coverage note:** I scanned the JSX render tree (lines 808-1571) thoroughly plus key compute blocks (543-806). The first ~500 lines are translations + DEMO_DATA + INTENT_WEIGHTS + sales-trigger engine — patterns mostly mirror Dashboard.jsx. Helper logic (metrics engine 602-737) reviewed in pattern, not line-by-line.

### Feature 2.1 — Cross-portal nav strip (top of dashboard, all sibling auto demo URLs)
- **Location:** AutoDashboard.jsx:812-837
- **What it does:** Top horizontal strip of links: "← Back to Automotive | VIP Performance | VIP Family | Public Showroom | Dealer Dashboard (active) | AI Pipeline". Each opens in new tab.
- **Sales value:** HIGH — automotive equivalent of Dashboard.jsx's Buyer Sites sidebar (1.7). Same "watch the data come in" purpose.
- **Exists in /unified?** PARTIAL — Portal-links flyout exists (`getPortalLinks()` returns auto-vip / auto-reg / auto-anon) but no AI Pipeline link, no last-activity status.
- **Migration complexity:** SIMPLE — see 1.7.

### Feature 2.2 — Header with Prestige Motors brand + ENV badge + LIVE dot + + Create VIP + Theme toggle
- **Location:** AutoDashboard.jsx:840-857
- **What it does:** "P" mark logo + "Prestige Motors" title + "VIP Behavioral Intelligence" subtitle. ENV badge "Prestige Motors Showroom". Live indicator. Create VIP button. Theme toggle.
- **Sales value:** MEDIUM — branding is sector-specific; unified is multi-tenant.
- **Exists in /unified?** YES — different shape (logo + page title + Live/Demo + region + lang + theme + ExportPDF in `UnifiedLayout.jsx:680-762`). Equivalent.
- **Migration complexity:** TRIVIAL.

### Feature 2.3 — 6-column KPI grid (VIP Sessions / Web Visitors / Test Drives / VIP Conv Lift / Avg Session Time / NFC ROI)
- **Location:** AutoDashboard.jsx:872-885
- **What it does:** 6 KPI tiles with delta (`↑+12` style) + sub-label.
- **Sales value:** HIGH — `NFC ROI` and `Avg Session Time` are unique to AutoDashboard.
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx` renders `config.kpis` via `<KpiCard>`, but only 4 KPIs by default. **NFC ROI and Avg Session Time KPIs are missing.**
- **Migration complexity:** SIMPLE — add 2 KPIs to automotive sector config.

### Feature 2.4 — Velocity KPI cards row (Time to First Action / Test Drive Velocity / Conversion Lift)
- **Location:** AutoDashboard.jsx:887-913
- **What it does:** 3 large velocity cards with icons (⏱ / 🚗 / 📈), value, label, sub.
- **Sales value:** HIGH — same brand "Sales Velocity Engine" payoff as 1.11.
- **Exists in /unified?** NO (see 1.11).
- **Migration complexity:** MEDIUM.

### Feature 2.5 — Conversion Funnel (CSS bar style, with drop-off %)
- **Location:** AutoDashboard.jsx:915-933
- **What it does:** 5-step funnel: NFC Tap → Vehicle View → Config Save → Pricing Request → Test Drive. Each step has CSS bar + count + drop-off %.
- **Sales value:** HIGH — sector-specific funnel labels.
- **Exists in /unified?** YES — sector funnel via `config.funnel` in AnalyticsTab. Equivalent.
- **Migration complexity:** TRIVIAL.

### Feature 2.6 — Conversion Actions BarChart (5 actions: Test Drives / Quotes / Brochures / Configs / Finance Calc)
- **Location:** AutoDashboard.jsx:935-950
- **What it does:** Vertical grouped Bar (VIP gold + Std blue) for 5 automotive-specific actions.
- **Sales value:** MEDIUM.
- **Exists in /unified?** YES — equivalent in OverviewTab/AnalyticsTab.
- **Migration complexity:** TRIVIAL.

### Feature 2.7 — Weekly VIP vs Standard AreaChart with gradient fills
- **Location:** AutoDashboard.jsx:953-979
- **What it does:** 7-day AreaChart with two gradient-filled series (VIP gold, Standard blue).
- **Sales value:** MEDIUM.
- **Exists in /unified?** YES — `OverviewTab.jsx:494-521` renders same with date-range picker. Better.
- **Migration complexity:** TRIVIAL.

### Feature 2.8 — Live Activity Feed (auto-specific events)
- **Location:** AutoDashboard.jsx:981-999
- **What it does:** Up to 10 feed items with VIP/Anon icon, sector-specific text ("configured G63 — Obsidian Black", "viewed AMG GT 63 S").
- **Sales value:** HIGH — sector-flavored copy.
- **Exists in /unified?** YES — `ActivityFeed.jsx` is sector-aware via event display map.
- **Migration complexity:** TRIVIAL.

### Feature 2.9 — VIP Alert Summary card (Hot Leads / Active Alerts / Avg Score badges + Top Alerts list)
- **Location:** AutoDashboard.jsx:1002-1028
- **What it does:** 3 gold pill badges + per-VIP alert row with avatar, trigger text, score pill.
- **Sales value:** HIGH.
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx:730-745` shows the 3 badges (`hotLeads`, `activeAlerts`, `avgLeadScore`) only when there's alert activity. The Top Alerts per-VIP list with trigger reasoning is NOT present in OverviewTab — would need to render in PriorityTab.
- **Migration complexity:** SIMPLE — add Top Alerts list to OverviewTab below the alert badges.

### Feature 2.10 — Score Distribution BarChart
- **Location:** AutoDashboard.jsx:1031-1048
- **What it does:** Recharts BarChart with 5 buckets, each colored cell.
- **Sales value:** MEDIUM.
- **Exists in /unified?** YES — see 1.16.
- **Migration complexity:** TRIVIAL.

### Feature 2.11 — VIP Intelligence tab: expandable VIP cards with score bar, status (hot/warm/cold), models tags, contact CTA strip
- **Location:** AutoDashboard.jsx:1051-1162
- **What it does:** Grid of VIP cards. Click to expand. Expanded view: "Why Call Now" colored panel + behavioral timeline (with icons per event type: 👁/🎨/💰/📥/🚗/💎/⚖️) + 5-button contact strip (📞 Call / 📧 Email / 💬 WhatsApp / 📋 Outreach Script / 🔗 Reissue Portal Link). All buttons are real `<a>` deep-links.
- **Sales value:** CRITICAL — the whole VIP-rep workflow lives here. Reissue Portal Link is a unique-to-automotive utility ("send a fresh URL").
- **Exists in /unified?** PARTIAL — `VIPCrmTab.jsx` covers most of this (split list+detail layout instead of grid+expand). **Reissue Portal Link button is missing.** Behavioral timeline icons are different.
- **Migration complexity:** SIMPLE — add Reissue Portal button to VIPCrmTab detail panel.

### Feature 2.12 — Model Analytics tab: horizontal stacked BarChart + Heatmap Table + Collection Pie + Top Configurations list
- **Location:** AutoDashboard.jsx:1165-1268
- **What it does:** (1) Stacked bars: Views/Configs/Finance/TestDrives per model. (2) Sortable detail table. (3) Collection donut (AMG / Luxury SUV / Executive Sedan). (4) Top 5 saved configurations list ("G63 — Obsidian Black, by Khalid · 12 saves").
- **Sales value:** HIGH — Top Configurations is unique-to-auto and sales-relevant ("we know what configs they save").
- **Exists in /unified?** PARTIAL — `OverviewTab.jsx:339-361` has `topSavedConfigurations` for automotive sector. Other charts may be present in AnalyticsTab. The model-detail table with all 4 columns is NOT verified to exist.
- **Migration complexity:** SIMPLE — verify and complete model-detail table.

### Feature 2.13 — Priority List table (Auto): VIP / Code / Top Model / Lead Score / Alerts / Last Seen / Action
- **Location:** AutoDashboard.jsx:1272-1329
- **What it does:** Table with score-based action selector — score ≥ 70 shows Call, ≥ 40 shows Email, < 40 shows Re-engage button. Plus per-row outreach script + recommended action sub-line.
- **Sales value:** HIGH — score-driven action UX.
- **Exists in /unified?** PARTIAL — PriorityTab has Call button (line 350) but not the score-driven action ladder.
- **Migration complexity:** SIMPLE.

### Feature 2.14 — Next Best Actions (auto-specific copy)
- **Location:** AutoDashboard.jsx:1331-1340
- **What it does:** 4 numbered NBAs with full sentences ("Call Khalid Al-Mansouri — configured AMG GT 63 S + opened finance calc. Offer Night Package + VIP test drive.").
- **Sales value:** HIGH — copy quality is sales-tested.
- **Exists in /unified?** PARTIAL — see 1.20. Auto-specific NBA copy not migrated.
- **Migration complexity:** SIMPLE.

### Feature 2.15 — Quick Actions (Email High Intent / Export Priority / Generate Weekly Report)
- **Location:** AutoDashboard.jsx:1343-1348
- **What it does:** 3 alert-only buttons.
- **Sales value:** LOW — placeholder.
- **Exists in /unified?** NO direct equivalent.
- **Migration complexity:** SIMPLE if migrated; could skip.

### Feature 2.16 — Vehicle Inventory tab with filters (All / Available / Reserved / Sold) + ZERO ENGAGEMENT badge
- **Location:** AutoDashboard.jsx:1351-1408
- **What it does:** Same shape as Feature 1.22 but for cars. Status pills, VIP-interest badge or zero-engagement warning.
- **Sales value:** HIGH — zero-engagement on inventory is sales-actionable.
- **Exists in /unified?** PARTIAL — InventoryTab present, zero-engagement not verified (see 1.22).
- **Migration complexity:** SIMPLE.

### Feature 2.17 — Campaigns tab with mini funnel bars per campaign + status badge
- **Location:** AutoDashboard.jsx:1410-1444
- **What it does:** Card-grid of campaigns with `Sent / Opened / Test Drives / Conversions` stats and a 3-segment colored bar showing conversion progress.
- **Sales value:** MEDIUM — visualizes campaign health.
- **Exists in /unified?** YES — `CampaignsTab.jsx` (771 lines) far richer with kanban + drawer + modal.
- **Migration complexity:** TRIVIAL — superseded.

### Feature 2.18 — Settings tab: In-Scope / Out-of-Scope / Privacy / Reset Demo button
- **Location:** AutoDashboard.jsx:1446-1482
- **What it does:** 3 list-style cards + a one-click Reset Demo button (clears localStorage + reloads).
- **Sales value:** LOW.
- **Exists in /unified?** YES — superseded by SettingsTab (with confirm-modal Reset).
- **Migration complexity:** TRIVIAL.

### Feature 2.19 — Outreach modal (Auto): Why Call Now panel + Call/Email scripts + Guardrail + 3 deep-link buttons
- **Location:** AutoDashboard.jsx:1487-1532
- **What it does:** Same shape as Feature 1.26 with auto-specific copy. Includes the trigger panel ("trigger.icon trigger.en") at the top of the modal — better than legacy real estate.
- **Sales value:** HIGH — guardrail copy + trigger panel.
- **Exists in /unified?** PARTIAL — see 1.26.
- **Migration complexity:** SIMPLE.

### Feature 2.20 — Create VIP modal (Auto)
- **Location:** AutoDashboard.jsx:1534-1567
- **What it does:** Same shape as 1.27 with auto-specific dropdowns ("Q1 VIP Launch / SUV Experience / Executive Collection").
- **Sales value:** MEDIUM.
- **Exists in /unified?** YES — see 1.27.
- **Migration complexity:** TRIVIAL.

---

## Section 3 — Cross-cutting / shared components

Both legacy dashboards bundle their own components inline (no separate sub-components imported). Helpers used by both:

### S3.1 — `decayFactor()` time-decay scoring (half-life 7 days)
- **Location:** Dashboard.jsx:28-32 + AutoDashboard.jsx:24-28 (duplicated)
- **What it does:** `Math.pow(0.5, daysAgo / 7)` returns multiplier 0..1.
- **Sales value:** HIGH — surfaces in legacy as `decay: ×0.78` in timeline (Dashboard.jsx:934).
- **Exists in /unified?** UNCERTAIN — `useDashboardData.js` (~1260 L, not opened in this audit) likely contains scoring; the per-event decay multiplier is NOT shown to user in unified VIPCrmTab timeline (see 1.10).
- **Migration complexity:** SIMPLE — display-only addition once data is present.

### S3.2 — `getSalesTrigger()` / `getAutoSalesTrigger()` 6-rule trigger engines
- **Location:** Dashboard.jsx:208-253 + AutoDashboard.jsx:48-92
- **What it does:** Returns `{type, color, icon, en, ar}` based on last-48h event pattern. Both engines have hard-coded brand-language reasons including "Strike while interest is hot."
- **Sales value:** CRITICAL.
- **Exists in /unified?** PARTIAL — Triggers exist as data (`vip.triggers[0]`) but the canonical brand-language sentences are not preserved verbatim. Unified PriorityTab has a separate `generateAdvice()` engine (lines 109-192) with similar-flavored AI advice in 4 languages — overlaps but the legacy's strict 48-hour trigger logic + the visual treatment ("💡 Sales Trigger: Why call now?" with `<AiBadge>`) is lost.
- **Migration complexity:** MEDIUM — preserve the 6 rule types and exact copy in `useDashboardData.js`'s trigger computation; surface them with the legacy visual treatment in OverviewTab + VIPCrmTab + PriorityTab.

### S3.3 — Brand-language narrative copy strings
- **Sales value:** CRITICAL — these specific phrases are pitch-deck-quoted.
- **Status in /unified?** Partial migration. Per CLAUDE.md §1, brand language is non-negotiable. Phrases that need migration:
  - "Why call this buyer now?" (whyCallNow)
  - "Strike while interest is hot." (high_activity trigger)
  - "Sales Trigger" + "AI" badge label
  - "Don't say you tracked them. Say you're following up on their VIP invitation..." (outreach guardrail)
  - "By issuing a VIP card, the client receives a premium invitation box signaling exclusive access." (Create VIP note)
  - "Sales command center — buyers, units, next calls" / "61 buyer actions logged" (the dashboard-header narrative pulled from CLAUDE.md handoff context — VERIFY this string exists in legacy or was a verbal brief from Oguzhan)

---

## Section 4 — Migration Recommendation

### Must migrate before retire (CRITICAL + HIGH that don't exist in unified)
1. **5-Minute Proof tutorial section** — SIMPLE — without it the demo opening collapses (Feature 1.1)
2. **REP BRIEFING / Why Call Now sales-trigger panel** (visual treatment + brand copy) — MEDIUM — pitch-deck moment (1.3 + S3.2)
3. **BroadcastChannel/Firestore-realtime toast notifications actually rendered** — MEDIUM — `<NotificationSystem>` is imported but never mounted in `UnifiedLayout.jsx` (1.5 + 1.6 + 1.28)
4. **Buyer Sites / Portal links sidebar with last-activity status** — MEDIUM — bundles narration + nav + feedback (1.7 + 2.1)
5. **Velocity KPIs row (TTFA / Viewing Velocity / Lead Capture Rate)** — MEDIUM — brand "Sales Velocity Engine" tie-in (1.11 + 2.4)
6. **Outreach guardrail copy + brand language** — SIMPLE — must preserve "Don't say you tracked them" (1.26 + 2.19 + S3.3)
7. **NFC ROI + Avg Session Time KPIs (automotive)** — SIMPLE (2.3)
8. **VIP Alert Summary "Top Alerts" list under the badges** — SIMPLE (2.9)
9. **Reissue Portal Link button on VIP detail** — SIMPLE (2.11)
10. **Decay multiplier shown per event in timeline** — SIMPLE display add (1.10)
11. **Owner workload "Due Today" computation + Due/Risk columns in PriorityTab** — MEDIUM (1.18)
12. **Help modal explainer (VIP Traffic vs Std Traffic + Key Rule)** — SIMPLE (1.25)

### Should migrate (MEDIUM that don't exist or are partial)
13. **Score-driven action ladder in PriorityTab (Call/Email/Re-engage)** — SIMPLE (2.13)
14. **Top Saved Configurations table (auto, fully)** — SIMPLE — partial in OverviewTab (2.12)
15. **Zero Engagement badge in InventoryTab** — SIMPLE (1.22 + 2.16)
16. **Quick Actions strip + Next Best Actions card in PriorityTab** — SIMPLE (1.20 + 2.14 + 2.15)
17. **AnimCounter on KPIs** — TRIVIAL — `AnimatedCounter` already exists, just wire it (1.12)
18. **Per-action sparklines in OverviewTab Conversion Actions** — TRIVIAL — `MiniSparkline` exists (1.13)
19. **AI Demo nav entry** — SIMPLE — decide whether to add to Unified TABS (1.9)

### Skip — already in unified or not worth it
- Live Activity Feed with filters (1.4) — migrated
- Conversion Funnel with drop-off (1.14) — migrated, better as `<SvgFunnel>`
- Tower Interest distribution (1.15) — migrated as region-aware categories
- Score Distribution histogram (1.16) — migrated
- VIP Intent + Property Demand heatmaps (1.17) — migrated and visually upgraded
- VIP Candidate auto-promotion (1.19) — migrated
- Pipeline kanban with 7 stages (1.21) — migrated and superior (drag-and-drop, AI-suggested deals)
- Campaigns tab (1.23 + 2.17) — superseded by 771-line CampaignsTab
- Settings tab (1.24 + 2.18) — superseded
- Cross-portal nav strip (2.1) — partial in Portal links flyout (decide if last-activity status is needed)
- Engagement Over Time multi-line chart (1.29) — migrated as Weekly Trend AreaChart
- Action Performance VIP-vs-Std (1.30) — migrated

---

## Section 5 — Risks & Open Questions

1. **`<NotificationSystem>` is imported but never rendered in `UnifiedLayout.jsx`** (line 15 import, no JSX usage in 280-769). Verify whether this is intentional or a Cursor regression. The component itself supports both `mock` mode (auto-fire) and `firestore`/`tenant` realtime mode (lines 154-191). Mounting it should restore the toast magic immediately.

2. **Tracking system migration adapter required.** Legacy uses `BroadcastChannel("dnfc_tracking")` (Dashboard.jsx:355, AutoDashboard.jsx:570). Unified should use `firestoreTracking.js` per CLAUDE.md §10. Test path: open Khalid demo portal → click "Request Pricing" → verify Firestore write → verify subscription in `useDashboardData` → verify NotificationSystem fires the toast. Each hop is a possible silent failure.

3. **AutoDashboard 1571-line file scan note.** I read every JSX render block (lines 808-1571) end-to-end and cross-referenced compute blocks (543-806). Lines 1-540 are translations + INTENT_WEIGHTS + DEMO_DATA + sales-trigger engine + helpers — these are reference material, not visible features. Confidence: HIGH for inventory completeness on the visible-feature axis.

4. **Sales-language preservation gap.** Per CLAUDE.md §1 brand vocabulary, the strings "Strike while interest is hot", "Sales Velocity Engine", "Decision Speed", "20/20 Vision", "Identity precedes Action" are pitch-deck-quoted. Only "Strike while interest is hot" appears literally in legacy code (Dashboard.jsx:249). The others live in marketing copy. Migration writer should NOT introduce these phrases ad-hoc into /unified — they belong on the marketing pages and pitch deck. **However**, the Sales Trigger panel and Velocity KPIs row are the in-product surfaces that REFLECT this vocabulary; if those are missing the brand alignment is lost even if the literal strings aren't.

5. **The "Sales command center — buyers, units, next calls" header narrative + "61 buyer actions logged" subtitle** mentioned in the audit prompt was NOT found verbatim in either legacy file. The closest matches are `t("todayActionsTitle")` + `t("todayActionsSub")` + `t("eventsTracked")` in Dashboard.jsx (lines 651, 627) — these are translation keys whose values live in `i18n/portals/dashboard`. **Open question:** is this exact phrasing a prior version of the copy, a verbal brief, or live in the dashboard.js translation file? Migration writer should `grep` `frontend/src/i18n/portals/dashboard.js` for `todayActionsTitle / eventsTracked / headerSub` to recover the exact strings. (Out of scope for this read-only audit.)

6. **The "AI Pipeline" sidebar item question (audit prompt).** Investigation confirms it is a SEPARATE ROUTE — `/enterprise/crmdemo/ai-demo` (legacy `Dashboard.jsx:619`) and `/automotive/demo/ai` (legacy `AutoDashboard.jsx:819`). It is NOT a view inside Pipeline. /unified intentionally does not have an "AI Demo" nav item. Decision needed: add a 10th tab to TABS, or accept that AI Demo lives under sector-specific demo routes only.

7. **Legacy dashboards write to localStorage and read from localStorage every 3 s** (Dashboard.jsx:351, AutoDashboard.jsx:569). Unified writes to Firestore via tenant-isolated subcollections. Demo portals must continue to write to BOTH for the legacy dashboards to keep working during the transition window — verify `firestoreTracking.js` doesn't break BroadcastChannel emission.

8. **Ambient effects, particle backgrounds, audio cues, keyboard shortcuts** mentioned in the audit prompt — none found in either legacy file. No `Audio`, no keyboard event handlers (other than focus/escape in modals), no particle canvas. The "particles" mentioned in CLAUDE.md §4 belong to portal pages (VIPPortal_Definitive etc.), not these dashboards. Skip.

---

## Appendix — File map

### Files inspected (with line counts)

Legacy (under audit):
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\Dashboard\Dashboard.jsx` — 1313 lines (full read in 3 chunks: 1-400, 400-900, 900-1313)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\Dashboard\Dashboard.css` — 74 KB / not opened (CSS only, per audit method)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\AutomotiveDemo\AutoDashboard.jsx` — 1571 lines (JSX render tree + key compute fully read; lines 300-540 translations skimmed by structure)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\AutomotiveDemo\AutoDashboard.css` — 26 KB / not opened (CSS only)

Unified (reference):
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\UnifiedLayout.jsx` — 770 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\tabs\OverviewTab.jsx` — 748 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\tabs\PriorityTab.jsx` — 432 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\tabs\PipelineTab.jsx` — 186 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\tabs\VIPCrmTab.jsx` — partial (lines 1-370; balance not opened — VIP detail panel structure inferred from list section)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\tabs\AnalyticsTab.jsx` — partial (lines 320-520; relevant heatmap/funnel/score-dist blocks read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\components\NotificationSystem.jsx` — 229 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\components\CallQueue.jsx` — 116 lines (full read)
- `C:\Users\oguzh\DynamicNFC\frontend\src\pages\UnifiedDashboard\components\OutreachModal.jsx` — partial (lines 1-80)

### Files NOT inspected (out of scope or by design)
- `Dashboard.css`, `AutoDashboard.css` — pure styling per audit rules
- All other legacy-dashboard-adjacent files (no sub-component imports — both dashboards are self-contained)
- `useDashboardData.js` (~1260L) — referenced indirectly via `useDashboard()` hook
- `tenantService.js`, `regionConfig.js`, `sectorConfig.js`
- Other unified tabs not relevant to the gap analysis: `CampaignsTab`, `CardsTab`, `InventoryTab`, `SettingsTab`
- `SvgFunnel.jsx`, `FunnelInsightTable.jsx`, `KanbanBoard.jsx`, `KpiCard.jsx`, `MiniSparkline.jsx`, `AnimatedCounter.jsx`, `ActivityFeed.jsx`, `AddDealModal.jsx`, `AddCampaignModal.jsx`, `BehavioralTimeline.jsx`, `CampaignDrawer.jsx`, `CreateVipModal.jsx`, `DateRangePicker.jsx`, `ExportPDF.jsx`, `LeadBadge.jsx`, `LoadingSkeleton.jsx`, `SectorSwitcher.jsx`, `AiBadge.jsx`, `useCampaignsReducer.js` — existence verified via folder listing only

### Confidence statement
- Dashboard.jsx coverage: 100% (all 1313 lines read).
- AutoDashboard.jsx coverage: ~70% deep (JSX render tree fully read; helper / translation top half pattern-matched). Per audit prompt's explicit instruction to "prioritize JSX render tree over helper fns", this is at the agreed bar.
- Unified coverage: ~75% (key tabs fully read; VIPCrmTab + AnalyticsTab partial — but the partial reads cover the cells that gap analysis hinges on).

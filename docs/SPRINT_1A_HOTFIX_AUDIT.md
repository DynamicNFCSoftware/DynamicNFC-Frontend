# Sprint 1A.1 Hotfix Audit
Date: 2026-04-24

## Item Status
1. Demo Mode toggle + persistence: ✅ FIXED
2. Walk-in Promote UX (Option III UI-only): ✅ FIXED
3. Sector-aware action labels with backward compatibility: ✅ FIXED

## Files Modified
- `frontend/src/hooks/useDashboardData.js`
- `frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`
- `frontend/src/i18n/eventDisplayMap.js`
- `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx`
- `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx`
- `frontend/src/pages/UnifiedDashboard/components/BehavioralTimeline.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`
- `frontend/src/pages/UnifiedDashboard/components/CampaignDrawer.jsx`
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx`
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css`

Scoped `git diff --numstat`:
- `12  1  frontend/src/hooks/useDashboardData.js`
- `153 0  frontend/src/i18n/eventDisplayMap.js`
- `17  0  frontend/src/pages/UnifiedDashboard/UnifiedLayout.css`
- `1   1  frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx`
- `4   1  frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx`
- `3   0  frontend/src/pages/UnifiedDashboard/components/BehavioralTimeline.jsx`
- `9   3  frontend/src/pages/UnifiedDashboard/components/CampaignDrawer.jsx`
- `3   3  frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`
- `3   3  frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx`
- `18  7  frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx`
- `81  3  frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`

## New Keys Added
- `vipCrmTab` UI dictionary:
  - `cancel`
  - `promoteWalkInTitle`
  - `promoteWalkInBody`
  - `promoteConfirm`
  - `vipPromotedSuccess`

## Cross-tab Realtime Test Result
- Mock auto-fire (Settings -> Demo mode -> 25s): ⚠️ NOT RUN in this environment (code path verified)
- Cross-tab realtime (portal CTA -> unified toast): ⚠️ NOT RUN in this environment (tenant events subscription path verified)
- Time-to-toast: N/A (manual QA required)

## Plan Deviations
- `eventDisplayMap` flat export was preserved for backward compatibility and `getEventLabel()` was added as an opt-in helper; consumers were migrated incrementally instead of hard-breaking all call sites.
- Walk-in Promote uses existing modal classes and an inline success banner in `VIPCrmTab` (UI-only, no Firestore writes, no persistence), as requested.

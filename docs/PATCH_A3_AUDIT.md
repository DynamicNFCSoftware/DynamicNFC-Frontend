# PATCH A3 Audit

Date: 2026-04-24
Scope: `/unified` translation gaps + currency hardcoding + walk-in UX

## Item Status

1. VIPCrmTab Behavioral Timeline + Action Distribution labels: ✅ FIXED  
   - Event labels now resolve through `eventDisplayMap` with lang fallback.
   - Timeline events normalize `type/action/event/label` before rendering.

2. VIPCrmTab "Walk-in Prospect" label: ✅ FIXED  
   - Added `walkInProspect` in VIP CRM UI dictionary for EN/AR/ES/FR.
   - Candidate row now renders translated walk-in label via `tx.walkInProspect`.

3. VIPCrmTab Walk-in click UX: ✅ FIXED (Option A)  
   - Candidate row is visually non-interactive (`cursor: not-allowed`, `opacity: 0.85`).
   - Tooltip added via `promoteFirst` key in EN/AR/ES/FR.
   - Promote CTA remains active.

4. SettingsTab hardcoded English + sidebar language regression: ✅ FIXED  
   - Added `settingsTab` i18n namespace and replaced core static labels with `useTranslation("settingsTab")`.
   - Removed SettingsTab auto-override `setLang(settings.language)` that forced saved language and caused apparent EN/LTR regression when opening tab.
   - `UnifiedLayout` root `dir` already uses active language and was left intact.

5. PipelineTab hardcoded AED: ✅ FIXED  
   - `PipelineTab` now reads currency from `useRegion()` and passes region currency to `KanbanBoard`.
   - `KanbanBoard` formatter now uses `fr-CA` when region is Canada and language is FR.

6. CampaignsTab hardcoded `$` budget display: ✅ FIXED  
   - KPI total budget, table budget cell, and drawer budget field now use `Intl.NumberFormat(locale, { style: "currency", currency })`.
   - Locale/currency sourced from region context.

7. Analytics/Overview x-axis month labels hardcoded English: ✅ FIXED  
   - Analytics bucket labels now use region-aware locale (including `fr-CA` case).
   - Overview weekly labels now use region-aware locale (including `fr-CA` case).

8. Campaigns objective raw code (`test_drive_conversion`): ✅ FIXED  
   - Added missing map entries and objective rendering now resolves through `eventDisplayMap` fallback chain.

9. Campaigns audience raw label (`waitlist` etc.): ✅ FIXED  
   - Drawer audience now resolves via `eventDisplayMap` (with fallback to existing audience keys/raw value).
   - Added audience-like map entries (`waitlist`, `vip_segment`, `cold_outreach`, `walk_in`).

## Files Modified (git diff --numstat)

- `frontend/src/pages/UnifiedDashboard/components/CampaignDrawer.jsx` (+27 / -6)
- `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx` (+2 / -1)
- `frontend/src/pages/UnifiedDashboard/tabs/AnalyticsTab.jsx` (+267 / -57)
- `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` (+33 / -13)
- `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` (+266 / -10)
- `frontend/src/pages/UnifiedDashboard/tabs/PipelineTab.jsx` (+5 / -3)
- `frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx` (+140 / -41)
- `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx` (+41 / -7)

Note: `frontend/src/i18n/eventDisplayMap.js` is already in the working tree as a new/untracked file from prior patches, so it is not included in `git diff --numstat` output but was updated in this patch.

## New i18n Keys Added

- `settingsTab`: 19 keys (EN/AR/ES/FR each)
  - `section`, `profile`, `email`, `sector`, `project`, `dataMode`, `tenantData`, `demoData`, `accountPreferences`, `savedToFirestorePrefs`, `language`, `theme`, `notifications`, `light`, `dark`, `enabled`, `disabled`, `switchSector`, `switchSectorSubtitle`
- `VIPCrmTab` UI dictionary: 2 keys
  - `walkInProspect`, `promoteFirst`

## New eventDisplayMap Entries Added

6 cross-language entries:
- `test_drive_conversion`
- `lead_capture`
- `vip_segment`
- `cold_outreach`
- `walk_in`
- (existing `waitlist` reused for audience rendering path)

## Plan Deviations

- `regionConfig.js` already had `currency`, `currencySymbol`, and `locale` for all 4 regions, so no config changes were needed.
- For chart label localization, locale was applied at data-label generation (`weekLabel`/bucket `label`) instead of adding a new `XAxis tickFormatter`. Outcome is equivalent for current chart shape.

## FAZ 6 Follow-ups (Not in A3 Scope)

- `LanguageContext` toggle FR-skip remains unchanged.
- Any candidate-detail-panel enhancement for Walk-in (Option B) remains deferred.
- Manual visual QA round 2 is still required for all 4 languages x 4 regions after this patch.

## Patch A3.1 Hotfix

### Item Status

1. VIPCrmTab timeline labels still English: ✅ FIXED  
   - Timeline events now carry a translated `label` in `VIPCrmTab`.
   - `BehavioralTimeline` now prioritizes explicit event labels before fallback mapping.

2. Walk-in visual state missing (`not-allowed` + tooltip): ✅ FIXED  
   - Walk-in candidate row now uses `ud-vip-candidate--disabled` with CSS-enforced `cursor: not-allowed !important` and opacity.
   - Tooltip (`promoteFirst`) is applied on the disabled row.

3. Pipeline locale tied to region only: ✅ FIXED  
   - `PipelineTab` now computes locale via `getEffectiveLocale(regionId, lang)` and passes it to `KanbanBoard`.
   - `KanbanBoard` currency formatter now uses effective locale + region currency.

4. Campaigns locale tied to region only: ✅ FIXED  
   - `CampaignsTab` and `CampaignDrawer` now use `getEffectiveLocale(regionId, lang)` for all currency formatting.

5. Analytics/Overview chart labels not reactive to language: ✅ FIXED  
   - Analytics and Overview date axes now use raw date values + `XAxis tickFormatter`.
   - Added `interval="preserveStartEnd"` and rotated date ticks to reduce overlap.

6. VIPCrm timeline + CTA mapping consistency check: ✅ FIXED  
   - Existing map entries for `test_drive_request`, `request_quote`, `download_brochure`, `finance_calculator`, `lease_plan_viewed` are intact and consumed through the updated render path.

7. Walk-in tooltip namespace/lookup validation: ✅ FIXED  
   - `promoteFirst` remains in VIP CRM UI dictionary and is used directly on the Walk-in row.

### Files Modified

- `frontend/src/config/regionConfig.js`
- `frontend/src/pages/UnifiedDashboard/tabs/PipelineTab.jsx`
- `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx`
- `frontend/src/pages/UnifiedDashboard/components/CampaignDrawer.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/AnalyticsTab.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx`
- `frontend/src/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx`
- `frontend/src/pages/UnifiedDashboard/components/BehavioralTimeline.jsx`
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css`

### New Helper Exported

- `getEffectiveLocale(regionId, lang)` exported from `frontend/src/config/regionConfig.js`.

### Deviations

- `getEffectiveLocale` was added to `regionConfig.js` (not a separate `utils/locale.js`) to keep region-language logic in a single source of truth.

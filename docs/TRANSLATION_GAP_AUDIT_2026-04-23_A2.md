## Patch A2 Audit - /unified Translation Gaps

### Table A - Missing keys by namespace

| Namespace | Key path | Present in EN? | Present in AR? | Present in ES? | Present in FR? | Source file + line |
|-----------|----------|----------------|----------------|----------------|----------------|--------------------|
| `activityFeed` | `personLabels.registered` | YES | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| `activityFeed` | `personLabels.anonymous` | YES | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| `activityFeed` | `personLabels.lead` | YES | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| `activityFeed` | `personLabels.vip` | YES | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| `activityFeed` | `status.new` | YES | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| `eventDisplay` | `early_interest` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` |
| `eventDisplay` | `showroom_footfall` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` |
| `eventDisplay` | `waitlist` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` |
| `eventDisplay` | `pricing_3x` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` |
| `eventDisplay` | `booking_request` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` |
| `eventDisplay` | `cards_tab_bulk` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/campaignUtils.js` |
| `eventDisplay` | `inventory_tab` | NO | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/campaignUtils.js` |
| `sectorConfig` | `real_estate.pipeline.stages[*].label.fr` | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| `sectorConfig` | `automotive.pipeline.stages[*].label.fr` | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| `sectorConfig` | `automotive.funnel[*].label.fr` | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| `sectorConfig` | `real_estate.inventory.*.fr` | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| `sectorConfig` | `automotive.inventory.*.fr` | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |

### Table B - Hardcoded English strings (new keys needed)

| String | Source file:line | Proposed namespace | Proposed key |
|--------|------------------|--------------------|--------------|
| `Inventory Lead` | `frontend/src/pages/UnifiedDashboard/tabs/PipelineTab.jsx:42` | `pipelineTab` | `defaults.inventoryLead` |
| `selected` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx:929` | `cardsTab` | `bulk.selected` |
| `cards will be paused.` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx:1029` | `cardsTab` | `bulk.confirmPauseDesc` |
| `cards will be resumed.` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx:1040` | `cardsTab` | `bulk.confirmResumeDesc` |
| `Create a draft campaign from X cards.` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx:1051` | `cardsTab` | `bulk.confirmCampaignDesc` |
| CSV headers (`Name`, `Email`, `Score`, etc.) | `frontend/src/pages/UnifiedDashboard/tabs/SettingsTab.jsx:157` | `settingsTab` | `export.csv.*` |

### Table C - Event/objective display-mapping candidates

| Code | Source file:line | Suggested display form (EN base) |
|------|------------------|----------------------------------|
| `early_interest` | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` | Early Interest |
| `showroom_footfall` | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` | Showroom Footfall |
| `waitlist` | `frontend/src/pages/UnifiedDashboard/tabs/CampaignsTab.jsx` | Waitlist |
| `auto_portal_entry` | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` | Auto Portal Entry |
| `cta_browse` | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` | CTA Browse |
| `cta_explore` | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` | CTA Explore |
| `request_quote` | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` | Request Quote |
| `vehicle_view` | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` | Vehicle View |
| `save_configuration` | `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` | Configuration Saved |
| `config_save` | `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` | Configuration Saved |
| `pricing_3x` | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | Pricing Viewed x3 |
| `booking_request` | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | Booking Request |
| `high_velocity` | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | High Velocity |
| `repeat_visitor` | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | Repeat Visitor |
| `idle_warning` | `frontend/src/pages/UnifiedDashboard/tabs/PriorityTab.jsx` | Idle Warning |
| `new_lead` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx` | New Lead |
| `quote_sent` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx` | Quote Sent |
| `financing` | `frontend/src/pages/UnifiedDashboard/tabs/CardsTab.jsx` | Financing |

### Table D - SoS occurrences and context

| File:line | Surrounding code context (5 lines) | Inferred meaning |
|-----------|------------------------------------|------------------|
| `frontend/src/pages/UnifiedDashboard/tabs/InventoryTab.jsx:112` | ```const UI = { es: { ... wow: "SoS", ... kpiRising: "Mayor Crecimiento", ... trend: "Tendencia" } };``` | Likely a week-over-week trend shorthand carried from EN context; ambiguous whether "Share of Search" or "week-over-week". |
| `frontend/src/pages/UnifiedDashboard/tabs/InventoryTab.jsx:156` | ```const UI = { fr: { ... wow: "SoS", ... kpiRising: "Croissance Rapide", ... trend: "Tendance" } };``` | Same ambiguous shorthand in FR block; probably metric abbreviation, but expansion is unclear. |


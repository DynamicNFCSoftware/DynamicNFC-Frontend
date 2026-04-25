## Table: Missing keys by namespace

| Namespace | Key path | Present in EN? | Present in AR? | Present in ES? | Present in FR? | Source file (where t() is called or where hardcoded string lives) |
|-----------|----------|----------------|----------------|----------------|----------------|-------------------------------------------------------------------|
| activityFeed | eventLabels.auto_portal_entry | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | eventLabels.cta_browse | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | eventLabels.cta_explore | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | eventLabels.request_quote | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | eventLabels.vehicle_view | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | personLabels.walk_in_prospect | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| activityFeed | relativeTime.* (fr case) | YES | YES | YES | NO | `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx` |
| callQueue | emptyState.noCallsNeeded | YES | YES | YES | NO | `frontend/src/pages/UnifiedDashboard/components/CallQueue.jsx` |
| callQueue | idleSuffix.daysIdle | YES | YES | YES | NO | `frontend/src/pages/UnifiedDashboard/components/CallQueue.jsx` |
| callQueue | header.whoToCallToday | YES | YES | YES | NO | `frontend/src/pages/UnifiedDashboard/components/CallQueue.jsx` |
| callQueue | action.reachOut | YES | YES | YES | NO | `frontend/src/pages/UnifiedDashboard/components/CallQueue.jsx` |
| createVipModal | fields.campaign | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| createVipModal | fields.cardId | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| createVipModal | fields.email | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| createVipModal | fields.fullName | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| createVipModal | fields.notes | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| createVipModal | fields.phone | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/CreateVipModal.jsx` |
| notificationSystem | templates.automotive.* | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` |
| notificationSystem | templates.real_estate.* | YES | YES | NO | YES | `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` |
| sectorConfig | real_estate.kpis.*.label | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| sectorConfig | real_estate.kpis.*.subtitle | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| sectorConfig | automotive.kpis.*.label | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| sectorConfig | automotive.kpis.*.subtitle | YES | YES | YES | NO | `frontend/src/config/sectorConfig.js` |
| unifiedLayout | statusText.preparingRegionLoadingTenantData | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` |
| unifiedLayout | statusText.preparingShowroomLoadingTenantData | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` |
| unifiedLayout | topbar.languageLabel | NO (fallback literal "Language") | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` |
| exportPdf | error.exportFailed | NO (NEW - needs creation) | NO | NO | NO | `frontend/src/pages/UnifiedDashboard/components/ExportPDF.jsx` |


#!/bin/bash
# check-integrity.sh — Post-edit file integrity checker for DynamicNFC
# Run after ANY Cursor/CC edit on large files to catch truncations.
# Usage: bash frontend/scripts/check-integrity.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check_file() {
  local file="$1"
  local min_lines="$2"
  local expected_end="$3"
  local label="$4"

  if [ ! -f "$file" ]; then
    echo -e "  ${YELLOW}SKIP${NC} $label — file not found"
    WARN=$((WARN + 1))
    return
  fi

  local lines
  lines=$(wc -l < "$file")
  local last_line
  last_line=$(tail -1 "$file" | tr -d '[:space:]')

  # Check line count
  if [ "$lines" -lt "$min_lines" ]; then
    echo -e "  ${RED}FAIL${NC} $label — $lines lines (expected >= $min_lines) — LIKELY TRUNCATED"
    FAIL=$((FAIL + 1))
    return
  fi

  # Check ending
  if [ "$last_line" != "$expected_end" ]; then
    echo -e "  ${RED}FAIL${NC} $label — ends with '$last_line' (expected '$expected_end') — LIKELY TRUNCATED"
    FAIL=$((FAIL + 1))
    return
  fi

  # Check for null bytes
  if grep -qP '\x00' "$file" 2>/dev/null; then
    echo -e "  ${RED}FAIL${NC} $label — contains null bytes"
    FAIL=$((FAIL + 1))
    return
  fi

  echo -e "  ${GREEN}PASS${NC} $label — $lines lines, ends correctly"
  PASS=$((PASS + 1))
}

echo ""
echo "=== DynamicNFC File Integrity Check ==="
echo ""

BASE="frontend/src"

check_file "$BASE/pages/UnifiedDashboard/tabs/CampaignsTab.jsx"   650 "}"  "CampaignsTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/campaignsTab.i18n.js" 400 "};" "campaignsTab.i18n.js"
check_file "$BASE/pages/UnifiedDashboard/tabs/CardsTab.jsx"      1000 "}"  "CardsTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/PipelineTab.jsx"    170 "}"  "PipelineTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/InventoryTab.jsx"   600 "}"  "InventoryTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/AnalyticsTab.jsx"   700 "}"  "AnalyticsTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/OverviewTab.jsx"    400 "}"  "OverviewTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/PriorityTab.jsx"    400 "}"  "PriorityTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/SettingsTab.jsx"    400 "}"  "SettingsTab.jsx"
check_file "$BASE/pages/UnifiedDashboard/tabs/VIPCrmTab.jsx"      300 "}"  "VIPCrmTab.jsx"
check_file "$BASE/hooks/useDashboardData.js"                     1100 "}"  "useDashboardData.js"
check_file "$BASE/services/tenantService.js"                      800 "}"  "tenantService.js"
check_file "$BASE/config/sectorConfig.js"                         650 "}"  "sectorConfig.js"
check_file "$BASE/pages/UnifiedDashboard/components/AddDealModal.jsx"      180 "}" "AddDealModal.jsx"
check_file "$BASE/pages/UnifiedDashboard/components/AddCampaignModal.jsx"  160 "}" "AddCampaignModal.jsx"
check_file "$BASE/pages/UnifiedDashboard/components/campaignUtils.js"       90 "}" "campaignUtils.js"
check_file "$BASE/pages/UnifiedDashboard/UnifiedLayout.css"      4500 "}"  "UnifiedLayout.css"

echo ""
echo "=== Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}, ${YELLOW}$WARN skipped${NC} ==="

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}⚠️  TRUNCATION DETECTED — DO NOT DEPLOY${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All files intact${NC}"
exit 0

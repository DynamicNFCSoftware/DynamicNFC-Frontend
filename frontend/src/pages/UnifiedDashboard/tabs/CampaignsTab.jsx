import { useReducer, useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useRegion } from "../../../hooks/useRegion";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../useDashboard";
import { getEffectiveLocale } from "../../../config/regionConfig";
import { SkeletonTable } from "../components/LoadingSkeleton";
import { createTenantCampaign, updateTenantCampaign } from "../../../services/tenantService";
import { db } from "../../../firebase";
import { UI } from "./campaignsTab.i18n";
import "./CampaignsTab.css";
import CampaignDrawer from "../components/CampaignDrawer";
import AddCampaignModal from "../components/AddCampaignModal";
import {
  DEAL_STAGE_CONVERSION_WEIGHT,
  STATUS_COLORS,
  STATUS_ICONS,
  STATUS_ORDER,
  VALID_NEXT,
  buildDefaultCampaignName,
  buildSevenDaySeries,
  chunkArray,
  formatDate,
  normalizeConversionWeights,
  objectiveLabel,
  sourceLabel,
} from "../components/campaignUtils";
import { campaignsReducer, initialState } from "./useCampaignsReducer";
import { getEventLabel } from "../../../i18n/eventDisplayMap";

/* ═══ Helpers ═══ */
const normalizeCode = (value) => (
  String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase()
);

const formatCurrencyCompact = (value, locale, currency) => (
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(Number(value || 0))
);

/* ═══ KPI Card ═══ */
function KpiCard({ icon, label, value, accent, onClick, isActive }) {
  return (
    <div
      className={`ud-cmp-kpi${isActive ? " ud-cmp-kpi--active" : ""}`}
      style={isActive ? { borderColor: accent } : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="ud-cmp-kpi__icon" style={{ background: accent }}>{icon}</div>
      <div className="ud-cmp-kpi__body">
        <div className="ud-cmp-kpi__label">{label}</div>
        <div className="ud-cmp-kpi__value">{value}</div>
      </div>
    </div>
  );
}

function SourceBadge({ source, label }) {
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
    cards_tab_bulk: {
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
    inventory_tab: {
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
  const key = source || "manual";
  const c = config[key] || config.manual;
  return (
    <span
      className="ud-cmp-source-badge"
      style={{ color: c.color, background: c.bg, borderColor: `${c.color}33` }}
    >
      {c.icon}
      <span>{label}</span>
    </span>
  );
}

/* ═══ Sort options ═══ */
const SORT_OPTS = [
  { id: "newest", field: "createdAt", dir: -1 },
  { id: "oldest", field: "createdAt", dir: 1 },
  { id: "status", field: "status", dir: 1 },
  { id: "cards", field: "totalCards", dir: -1 },
];

/* ═══════════════════ MAIN ═══════════════════ */
export default function CampaignsTab() {
  const { user } = useAuth();
  const { regionId, currency: regionCurrency } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang } = useLanguage();
  const { config } = useSector();
  const dashboard = useDashboard() || {};
  const {
    campaigns = [],
    deals = [],
    analytics = {},
    loading,
    dataMode,
    campaignsHasMore,
    campaignsLoadingMore,
    loadMoreCampaigns,
  } = dashboard;
  const tx = useMemo(() => ({ ...UI.en, ...(UI[lang] || {}) }), [lang]);
  const locale = useMemo(() => getEffectiveLocale(regionId, lang), [regionId, lang]);
  const currency = regionCurrency || "USD";
  const conversionWeights = useMemo(() => {
    const configured =
      analytics?.settings?.campaignConversionWeights ||
      analytics?.settings?.dealStageConversionWeights ||
      {};
    return {
      ...DEAL_STAGE_CONVERSION_WEIGHT,
      ...normalizeConversionWeights(configured),
    };
  }, [analytics?.settings]);

  // State
  const [state, dispatch] = useReducer(campaignsReducer, initialState);
  const {
    search,
    statusFilter,
    sourceFilter,
    sortKey,
    kpiFilter,
    selectedCampaign,
    showAddModal,
    editingId,
    editingName,
    renameError,
    toast,
    actionBusy,
    tapMetricsByCampaign,
  } = state;
  const handledBulkRef = useRef("");
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchParamsString = searchParams.toString();

  // Toast auto-clear
  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => dispatch({ type: "SET_TOAST", payload: "" }), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Hydrate filters from URL and keep shareable filter links
  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const status = params.get("status") || "all";
    const source = params.get("source") || "all";
    const sort = params.get("sort") || "newest";
    const q = params.get("q") || "";
    const validStatus = ["all", "draft", "active", "paused", "archived"];
    const validSource = ["all", "manual", "cards_tab_bulk", "inventory_tab"];
    const validSort = SORT_OPTS.map((o) => o.id);
    dispatch({
      type: "HYDRATE_FILTERS",
      payload: {
        search: q,
        statusFilter: validStatus.includes(status) ? status : "all",
        sourceFilter: validSource.includes(source) ? source : "all",
        sortKey: validSort.includes(sort) ? sort : "newest",
      },
    });
    setDebouncedSearch(q);
  }, [searchParamsString]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const next = new URLSearchParams();
    if (statusFilter !== "all") next.set("status", statusFilter);
    if (sourceFilter !== "all") next.set("source", sourceFilter);
    if (sortKey !== "newest") next.set("sort", sortKey);
    if (debouncedSearch.trim()) next.set("q", debouncedSearch.trim());
    if (sortKey === "oldest") next.set("dir", "asc");
    else if (sortKey !== "newest") next.set("dir", "desc");
    const currentPage = Number.parseInt(params.get("page") || "1", 10);
    if (Number.isFinite(currentPage) && currentPage > 1) {
      next.set("page", String(currentPage));
    }
    if (next.toString() === searchParamsString) return;
    setSearchParams(next, { replace: true });
  }, [statusFilter, sourceFilter, sortKey, debouncedSearch, searchParamsString, setSearchParams]);

  // Handle bulk create from CardsTab via location.state
  useEffect(() => {
    const pending = location.state?.bulkCampaign;
    if (!pending || !user?.uid) return;
    const rid = String(pending.requestId || "");
    if (!rid || handledBulkRef.current === rid) return;
    handledBulkRef.current = rid;
    (async () => {
      try {
        await createTenantCampaign(user.uid, {
          name: pending.name || buildDefaultCampaignName(),
          status: "draft",
          source: "cards_tab_bulk",
          totalCards: pending.totalCards || 0,
          activeCards: pending.activeCards || 0,
          cardIds: pending.cardIds || [],
          idempotencyKey: rid,
        });
        dispatch({ type: "SET_TOAST", payload: tx.bulkCreated });
      } catch (err) {
        dispatch({ type: "SET_TOAST", payload: tx.bulkCreateFailed });
        console.error("[CampaignsTab] Bulk create failed:", err);
      } finally {
        navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
      }
    })();
  }, [location.state, location.pathname, location.search, navigate, user, tx.bulkCreated, tx.bulkCreateFailed]);

  // Aggregate taps by campaignId from root taps collection
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      dispatch({ type: "SET_TAP_METRICS", payload: {} });
      return;
    }
    const campaignIds = [...new Set(campaigns.map((c) => c.id).filter(Boolean))];
    if (campaignIds.length === 0) {
      dispatch({ type: "SET_TAP_METRICS", payload: {} });
      return;
    }

    let cancelled = false;
    const loadTapMetrics = async () => {
      const rows = {};
      campaignIds.forEach((id) => { rows[id] = { taps: 0, byDay: {} }; });

      // Use cached tap data from Cloud Function (aggregateTaps) when available
      const uncachedIds = [];
      campaigns.forEach((c) => {
        if (c.cachedTapCount > 0 && rows[c.id]) {
          rows[c.id].taps = c.cachedTapCount;
          if (c.cachedTapsByDay && typeof c.cachedTapsByDay === "object") {
            rows[c.id].byDay = { ...c.cachedTapsByDay };
          }
        } else if (rows[c.id]) {
          uncachedIds.push(c.id);
        }
      });

      // Fallback: query root taps for campaigns without cached data
      try {
        if (uncachedIds.length > 0) {
          const chunks = chunkArray(uncachedIds, 10);
          for (const chunk of chunks) {
            const tapsQ = query(
              collection(db, "taps"),
              where("campaignId", "in", chunk)
            );
            const snap = await getDocs(tapsQ);
            snap.forEach((docSnap) => {
              const data = docSnap.data() || {};
              const campaignId = String(data.campaignId || "");
              if (!campaignId || !rows[campaignId]) return;
              rows[campaignId].taps += 1;
              const tsVal = data.timestamp?.toDate?.() || new Date(data.timestamp || 0);
              if (Number.isNaN(tsVal.getTime())) return;
              const dayKey = tsVal.toISOString().slice(0, 10);
              rows[campaignId].byDay[dayKey] = (rows[campaignId].byDay[dayKey] || 0) + 1;
            });
          }
        }
        if (cancelled) return;
        const normalized = {};
        Object.entries(rows).forEach(([campaignId, row]) => {
          normalized[campaignId] = {
            taps: row.taps,
            series: buildSevenDaySeries(row.byDay),
          };
        });
        dispatch({ type: "SET_TAP_METRICS", payload: normalized });
      } catch {
        if (!cancelled) dispatch({ type: "SET_TAP_METRICS", payload: {} });
      }
    };
    loadTapMetrics();
    return () => { cancelled = true; };
  }, [campaigns]);

  const linkedDealsByCampaign = useMemo(() => {
    const map = {};
    (deals || []).forEach((deal) => {
      const key = String(deal.campaignId || "").trim();
      if (!key) return;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [deals]);

  const weightedDealsByCampaign = useMemo(() => {
    const map = {};
    (deals || []).forEach((deal) => {
      const key = String(deal.campaignId || "").trim();
      if (!key) return;
      const stage = String(deal.stage || "").toLowerCase();
      const score = conversionWeights[stage] ?? 0;
      map[key] = (map[key] || 0) + score;
    });
    return map;
  }, [deals, conversionWeights]);

  // KPI counts
  const kpis = useMemo(() => {
    const now = Date.now();
    const WEEK = 7 * 86400000;
    let draftCount = 0;
    let activeCount = 0;
    let pausedCount = 0;
    let archivedCount = 0;
    let created7d = 0;
    let activeBudgetTotal = 0;
    campaigns.forEach((c) => {
      const s = (c.status || "draft").toLowerCase();
      if (s === "draft") draftCount++;
      else if (s === "active") activeCount++;
      else if (s === "paused") pausedCount++;
      else if (s === "archived") archivedCount++;
      if (s === "active") activeBudgetTotal += Number(c.budget || 0);
      const createdMs = c.createdAt?.toMillis?.() || c.createdAt?.seconds * 1000 || new Date(c.createdAt || 0).getTime();
      if (now - createdMs < WEEK) created7d++;
    });
    return { draftCount, activeCount, pausedCount, archivedCount, created7d, activeBudgetTotal };
  }, [campaigns]);

  // Source breakdown
  const sourceBreakdown = useMemo(() => {
    const counts = { manual: 0, cards_tab_bulk: 0, inventory_tab: 0 };
    campaigns.forEach((c) => {
      const src = c.source || "manual";
      counts[src] = (counts[src] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let list = [...campaigns];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.client || "").toLowerCase().includes(q) ||
          (c.source || "").toLowerCase().includes(q)
      );
    }

    // Status filter (from chips or KPI click)
    const activeStatus = kpiFilter || (statusFilter !== "all" ? statusFilter : "");
    if (activeStatus) {
      list = list.filter((c) => (c.status || "draft").toLowerCase() === activeStatus);
    }

    // Source filter
    if (sourceFilter !== "all") {
      list = list.filter((c) => (c.source || "manual") === sourceFilter);
    }

    // Sort
    const opt = SORT_OPTS.find((o) => o.id === sortKey) || SORT_OPTS[0];
    list.sort((a, b) => {
      if (opt.field === "status") {
        return ((STATUS_ORDER[a.status] || 0) - (STATUS_ORDER[b.status] || 0)) * opt.dir;
      }
      if (opt.field === "totalCards") {
        return ((a.totalCards || 0) - (b.totalCards || 0)) * opt.dir;
      }
      // Date sort
      const ta = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || new Date(a.createdAt || 0).getTime();
      const tb = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || new Date(b.createdAt || 0).getTime();
      return (ta - tb) * opt.dir;
    });

    return list;
  }, [campaigns, search, statusFilter, sourceFilter, sortKey, kpiFilter]);

  const visible = filtered;
  const hasMore = campaignsHasMore;
  const hasFilters = search || statusFilter !== "all" || sourceFilter !== "all" || kpiFilter;

  // Duplicate name check (case-insensitive, same tenant)
  const isDuplicateName = useCallback(
    (name, excludeId) => {
      const norm = name.trim().toLowerCase();
      return campaigns.some((c) => c.id !== excludeId && (c.nameNormalized || c.name || "").toLowerCase() === norm);
    },
    [campaigns]
  );

  // Rename handlers
  const startRename = useCallback((c) => {
    dispatch({ type: "START_RENAME", payload: { id: c.id, name: c.name || "" } });
  }, []);

  const cancelRename = useCallback(() => {
    dispatch({ type: "CANCEL_RENAME" });
  }, []);

  const saveRename = useCallback(
    async (campaignId) => {
      const trimmed = editingName.trim();
      if (!trimmed || trimmed.length < 3 || trimmed.length > 80) {
        dispatch({ type: "SET_RENAME_ERROR", payload: tx.nameRequired });
        return;
      }
      if (isDuplicateName(trimmed, campaignId)) {
        dispatch({ type: "SET_RENAME_ERROR", payload: tx.nameDuplicate });
        return;
      }
      try {
        await updateTenantCampaign(user.uid, campaignId, { name: trimmed });
        dispatch({ type: "SET_TOAST", payload: tx.renameSaved });
        cancelRename();
      } catch (err) {
        dispatch({ type: "SET_RENAME_ERROR", payload: err.message || tx.renameFailed });
      }
    },
    [editingName, user, tx, isDuplicateName, cancelRename]
  );

  // Lifecycle actions
  const handleStatusChange = useCallback(
    async (campaign, newStatus) => {
      if (!user?.uid) return;
      // Readiness gate: objective required to launch
      if (newStatus === "active" && !campaign.objective) {
        dispatch({ type: "SET_TOAST", payload: tx.objectiveRequired });
        return;
      }
      dispatch({ type: "SET_ACTION_BUSY", payload: campaign.id });
      try {
        await updateTenantCampaign(user.uid, campaign.id, {
          status: newStatus,
          _fromStatus: campaign.status || "draft",
        });
        dispatch({ type: "SET_TOAST", payload: tx.statusChanged });
        if (selectedCampaign?.id === campaign.id) {
          dispatch({ type: "UPDATE_SELECTED_CAMPAIGN", payload: { status: newStatus } });
        }
      } catch (err) {
        dispatch({ type: "SET_TOAST", payload: tx.statusFailed });
        console.error("[CampaignsTab] Status change failed:", err);
      } finally {
        dispatch({ type: "SET_ACTION_BUSY", payload: "" });
      }
    },
    [user, tx, selectedCampaign?.id]
  );

  // Create
  const handleCreate = useCallback(
    async (payload) => {
      if (!user?.uid) return;
      // Duplicate check on create too
      if (isDuplicateName(payload.name, null)) {
        throw new Error(tx.nameDuplicate);
      }
      await createTenantCampaign(user.uid, payload);
      dispatch({ type: "SET_TOAST", payload: tx.createSuccess });
    },
    [user, tx, isDuplicateName]
  );

  if (loading) return <SkeletonTable />;

  return (
    <div className="ud-cmp-root">
      {/* Toast */}
      {toast && <div className="ud-cmp-toast">{toast}</div>}

      {/* KPI Strip — EP5 */}
      <div className="ud-cmp-kpi-strip">
        <KpiCard
          icon="📝"
          label={tx.kpiDraft}
          value={kpis.draftCount}
          accent={STATUS_COLORS.draft}
          isActive={kpiFilter === "draft"}
          onClick={() => dispatch({ type: "SET_KPI_FILTER", payload: "draft" })}
        />
        <KpiCard
          icon="🟢"
          label={tx.kpiActive}
          value={kpis.activeCount}
          accent={STATUS_COLORS.active}
          isActive={kpiFilter === "active"}
          onClick={() => dispatch({ type: "SET_KPI_FILTER", payload: "active" })}
        />
        <KpiCard
          icon="⏸"
          label={tx.kpiPaused}
          value={kpis.pausedCount}
          accent={STATUS_COLORS.paused}
          isActive={kpiFilter === "paused"}
          onClick={() => dispatch({ type: "SET_KPI_FILTER", payload: "paused" })}
        />
        <KpiCard
          icon="📦"
          label={tx.kpiArchived}
          value={kpis.archivedCount}
          accent={STATUS_COLORS.archived}
          isActive={kpiFilter === "archived"}
          onClick={() => dispatch({ type: "SET_KPI_FILTER", payload: "archived" })}
        />
        <KpiCard
          icon="🆕"
          label={tx.kpiCreated7d}
          value={kpis.created7d}
          accent="#457b9d"
        />
        <KpiCard
          icon="💰"
          label={tx.kpiTotalBudget}
          value={formatCurrencyCompact(kpis.activeBudgetTotal, locale, currency)}
          accent="#2a9d8f"
        />
      </div>

      {/* Source Health — EP5.502 */}
      <div className="ud-cmp-source-strip">
        {Object.entries(sourceBreakdown).map(([src, count]) => (
          count > 0 && (
            <span
              key={src}
              className={`ud-cmp-source-filter-badge${sourceFilter === src ? " ud-cmp-source-filter-badge--active" : ""}`}
              onClick={() => dispatch({ type: "SET_SOURCE_FILTER", payload: sourceFilter === src ? "all" : src })}
              title={`${sourceLabel(src, tx, lang)}: ${count}`}
            >
              {sourceLabel(src, tx, lang)} ({count})
            </span>
          )
        ))}
      </div>

      {/* Toolbar: Search + Filters + Sort + Add */}
      <div className="ud-cmp-toolbar">
        <input
          className="ud-cmp-search"
          placeholder={tx.search}
          value={search}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
        />
        <div className="ud-cmp-filters">
          {["all", "draft", "active", "paused", "archived"].map((s) => (
            <button
              key={s}
              className={`ud-cmp-chip${statusFilter === s ? " ud-cmp-chip--active" : ""}`}
              style={statusFilter === s && s !== "all" ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : undefined}
              onClick={() => { dispatch({ type: "SET_STATUS_FILTER", payload: s }); dispatch({ type: "SET_KPI_FILTER", payload: "" }); }}
            >
              {s === "all" ? tx.allStatuses : tx[s] || s}
            </button>
          ))}
        </div>
        <div className="ud-cmp-sorts">
          <span className="ud-cmp-sort-label">{tx.sortBy}:</span>
          {SORT_OPTS.map((o) => (
            <button
              key={o.id}
              className={`ud-cmp-sort-btn${sortKey === o.id ? " ud-cmp-sort-btn--active" : ""}`}
              onClick={() => dispatch({ type: "SET_SORT_KEY", payload: o.id })}
            >
              {tx[o.id] || o.id}
            </button>
          ))}
        </div>
        <button
          className="ud-cmp-add-btn"
          onClick={() => {
            setEditingCampaign(null);
            dispatch({ type: "SHOW_ADD_MODAL" });
          }}
        >
          {tx.addCampaign}
        </button>
      </div>

      {hasFilters && (
        <button
          className="ud-cmp-clear"
          onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
        >
          {tx.clearFilters}
        </button>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="ud-cmp-empty">
          <div className="ud-cmp-empty__text">{hasFilters ? tx.emptyFiltered : tx.empty}</div>
          {!hasFilters && <div className="ud-cmp-empty__sub">{tx.emptyCta}</div>}
        </div>
      ) : (
        <>
          <div className="ud-cmp-table-wrap">
            <table className="ud-cmp-table">
              <thead>
                <tr>
                  <th>{tx.name}</th>
                  <th>{tx.status}</th>
                  <th>{tx.budget}</th>
                  <th>{tx.client}</th>
                  <th>{tx.objectiveCol}</th>
                  <th>{tx.performanceCol}</th>
                  <th>{tx.windowCol}</th>
                  <th>{tx.source}</th>
                  <th>{tx.updatedLabel}</th>
                  <th>{tx.actions}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => {
                  const st = (c.status || "draft").toLowerCase();
                  const isEditing = editingId === c.id;
                  const nextStatuses = VALID_NEXT[st] || [];
                  const isBusy = actionBusy === c.id;
                  const metrics = tapMetricsByCampaign[c.id] || {};
                  const tapCount = metrics.taps || 0;
                  const wScore = weightedDealsByCampaign[c.id] || 0;
                  const convRate = tapCount > 0 ? ((wScore / tapCount) * 100).toFixed(1) : "0.0";
                  const budget = Number(c.budget || 0);
                  const spent = Number(c.spent || 0);
                  const objectiveCode = normalizeCode(c.objective);
                  const objectiveText = getEventLabel(objectiveCode, lang, config.id) || objectiveLabel(c.objective, tx, lang);
                  const budgetPercentRaw = budget > 0 ? (spent / budget) * 100 : 0;
                  const budgetPercent = Math.max(0, Math.min(100, budgetPercentRaw));
                  const budgetBarColor = spent > budget ? "#e63946" : "#22c55e";
                  return (
                    <tr key={c.id} className="ud-cmp-row" onClick={() => !isEditing && dispatch({ type: "SET_SELECTED_CAMPAIGN", payload: c })}>
                      <td>
                        {isEditing ? (
                          <div className="ud-cmp-rename-cell" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="ud-cmp-rename-input"
                              value={editingName}
                              onChange={(e) => dispatch({ type: "SET_EDITING_NAME", payload: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(c.id);
                                if (e.key === "Escape") cancelRename();
                              }}
                              maxLength={80}
                              autoFocus
                            />
                            <button className="ud-cmp-rename-save" onClick={() => saveRename(c.id)}>{tx.save}</button>
                            <button className="ud-cmp-rename-cancel" onClick={cancelRename}>{tx.cancel}</button>
                            {renameError && <div className="ud-cmp-error" style={{ marginTop: 2 }}>{renameError}</div>}
                          </div>
                        ) : (
                          <span className="ud-cmp-name">{c.name}</span>
                        )}
                      </td>
                      <td>
                        <span className="ud-cmp-status-badge" style={{ background: STATUS_COLORS[st] }}>
                          <span
                            className="ud-cmp-status-badge__icon"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{ __html: STATUS_ICONS[st] || "" }}
                          />
                          <span>{tx[st] || st}</span>
                        </span>
                      </td>
                      <td className="ud-cmp-td ud-cmp-td--budget">
                        {budget > 0 ? (
                          <div className="ud-cmp-budget-cell">
                            <div className="ud-cmp-budget-cell__bar">
                              <div
                                className="ud-cmp-budget-cell__fill"
                                style={{
                                  width: `${budgetPercent}%`,
                                  background: budgetBarColor,
                                }}
                              />
                            </div>
                            <div className="ud-cmp-budget-cell__text">
                              {formatCurrencyCompact(spent, locale, currency)} / {formatCurrencyCompact(budget, locale, currency)}
                            </div>
                          </div>
                        ) : (
                          <span className="ud-cmp-muted">—</span>
                        )}
                      </td>
                      <td>{c.client || "—"}</td>
                      <td className="ud-cmp-obj-cell">{objectiveText}</td>
                      <td>
                        <div className="ud-cmp-performance-cell">
                          <span>{tapCount}</span>
                          <span className="ud-cmp-performance-cell__divider">/</span>
                          <span className="ud-cmp-performance-cell__conv">{convRate}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="ud-cmp-window-cell">
                          <span>{formatDate(c.startDate)}</span>
                          <span className="ud-cmp-window-cell__sep">→</span>
                          <span>{c.endDate ? formatDate(c.endDate) : tx.timelineOngoing}</span>
                        </div>
                      </td>
                      <td>
                        <SourceBadge
                          source={c.source}
                          label={tx[`source_${c.source}`] || sourceLabel(c.source, tx, lang)}
                        />
                      </td>
                      <td>{formatDate(c.updatedAt || c.createdAt)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="ud-cmp-action-group">
                          <button
                            className="ud-cmp-action-btn ud-cmp-action-btn--rename"
                            onClick={() => setEditingCampaign(c)}
                            disabled={isBusy}
                          >
                            {tx.editDetails}
                          </button>
                          {!isEditing && (
                            <button className="ud-cmp-action-btn ud-cmp-action-btn--rename" onClick={() => dispatch({ type: "START_RENAME", payload: c })} disabled={isBusy}>
                              {tx.rename}
                            </button>
                          )}
                          {nextStatuses.map((ns) => (
                            <button
                              key={ns}
                              className={`ud-cmp-action-btn ud-cmp-action-btn--${ns}`}
                              onClick={() => handleStatusChange(c, ns)}
                              disabled={isBusy}
                            >
                              {tx[ns] || ns}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="ud-cmp-loadmore-wrap">
              <button
                type="button"
                className="ud-cmp-loadmore-btn"
                onClick={() => loadMoreCampaigns && loadMoreCampaigns()}
                disabled={campaignsLoadingMore}
              >
                {campaignsLoadingMore ? (tx.loading || "Loading…") : (tx.loadMore || "Load more")}
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Drawer */}
      {selectedCampaign && (
        <CampaignDrawer
          campaign={selectedCampaign}
          tx={tx}
          lang={lang}
          onClose={() => dispatch({ type: "SET_SELECTED_CAMPAIGN", payload: null })}
          onRename={(c) => startRename(c)}
          onEdit={(c) => {
            setEditingCampaign(c);
            dispatch({ type: "SET_SELECTED_CAMPAIGN", payload: null });
          }}
          onStatusChange={handleStatusChange}
          linkedDealsCount={linkedDealsByCampaign?.[selectedCampaign.id] || 0}
          weightedDealsScore={weightedDealsByCampaign?.[selectedCampaign.id] || 0}
          tapMetrics={tapMetricsByCampaign?.[selectedCampaign.id] || null}
        />
      )}

      {/* Add Campaign Modal (create) */}
      {showAddModal && (
        <AddCampaignModal
          tx={tx}
          onClose={() => dispatch({ type: "CLOSE_ADD_MODAL" })}
          onSave={async (payload) => {
            await handleCreate(payload);
            dispatch({ type: "CLOSE_ADD_MODAL" });
          }}
        />
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <AddCampaignModal
          tx={tx}
          mode="edit"
          initialValues={editingCampaign}
          submitLabel={tx.save || "Save"}
          onClose={() => setEditingCampaign(null)}
          onSave={async (payload) => {
            try {
              await updateTenantCampaign(user.uid, editingCampaign.id, payload);
              dispatch({ type: "SET_TOAST", payload: tx.editSaved || tx.renameSaved });
              setEditingCampaign(null);
            } catch (err) {
              dispatch({ type: "SET_TOAST", payload: err?.message || tx.statusFailed });
            }
          }}
        />
      )}
    </div>
  );
}

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useAuth } from "../../../contexts/AuthContext";
import { useDashboard } from "../DashboardDataProvider";
import { SkeletonTable } from "../components/LoadingSkeleton";
import { createTenantCampaign, updateTenantCampaign } from "../../../services/tenantService";
import { db } from "../../../firebase";
import { UI } from "./campaignsTab.i18n";
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

/* ═══ Helpers ═══ */

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
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  useSector();
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortKey, setSortKey] = useState("newest");
  const [kpiFilter, setKpiFilter] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [toast, setToast] = useState("");
  const [actionBusy, setActionBusy] = useState("");
  const [tapMetricsByCampaign, setTapMetricsByCampaign] = useState({});
  const handledBulkRef = useRef("");
  const queryHydratedRef = useRef(false);

  // Toast auto-clear
  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Hydrate filters from URL and keep shareable filter links
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status") || "all";
    const source = params.get("source") || "all";
    const sort = params.get("sort") || "newest";
    const q = params.get("q") || "";
    const validStatus = ["all", "draft", "active", "paused", "archived"];
    const validSource = ["all", "manual", "cards_tab_bulk", "inventory_tab"];
    const validSort = SORT_OPTS.map((o) => o.id);
    setStatusFilter(validStatus.includes(status) ? status : "all");
    setSourceFilter(validSource.includes(source) ? source : "all");
    setSortKey(validSort.includes(sort) ? sort : "newest");
    setSearch(q);
    queryHydratedRef.current = true;
  }, [location.search]);

  useEffect(() => {
    if (!queryHydratedRef.current) return;
    const params = new URLSearchParams({
      status: statusFilter,
      source: sourceFilter,
      sort: sortKey,
      q: search,
    });
    const nextSearch = params.toString();
    const currentSearch = location.search.startsWith("?") ? location.search.slice(1) : location.search;
    if (nextSearch === currentSearch) return;
    navigate({ search: nextSearch }, { replace: true });
  }, [statusFilter, sourceFilter, sortKey, search, navigate, location.search]);

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
        setToast(tx.bulkCreated);
      } catch (err) {
        setToast(tx.bulkCreateFailed);
        console.error("[CampaignsTab] Bulk create failed:", err);
      } finally {
        navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null });
      }
    })();
  }, [location.state, location.pathname, location.search, navigate, user, tx.bulkCreated, tx.bulkCreateFailed]);

  // Aggregate taps by campaignId from root taps collection
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      setTapMetricsByCampaign({});
      return;
    }
    const campaignIds = [...new Set(campaigns.map((c) => c.id).filter(Boolean))];
    if (campaignIds.length === 0) {
      setTapMetricsByCampaign({});
      return;
    }

    let cancelled = false;
    const loadTapMetrics = async () => {
      const rows = {};
      campaignIds.forEach((id) => { rows[id] = { taps: 0, byDay: {} }; });
      try {
        const chunks = chunkArray(campaignIds, 10);
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
        if (cancelled) return;
        const normalized = {};
        Object.entries(rows).forEach(([campaignId, row]) => {
          normalized[campaignId] = {
            taps: row.taps,
            series: buildSevenDaySeries(row.byDay),
          };
        });
        setTapMetricsByCampaign(normalized);
      } catch {
        if (!cancelled) setTapMetricsByCampaign({});
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
    let draftCount = 0, activeCount = 0, pausedCount = 0, archivedCount = 0, created7d = 0;
    campaigns.forEach((c) => {
      const s = (c.status || "draft").toLowerCase();
      if (s === "draft") draftCount++;
      else if (s === "active") activeCount++;
      else if (s === "paused") pausedCount++;
      else if (s === "archived") archivedCount++;
      const createdMs = c.createdAt?.toMillis?.() || c.createdAt?.seconds * 1000 || new Date(c.createdAt || 0).getTime();
      if (now - createdMs < WEEK) created7d++;
    });
    return { draftCount, activeCount, pausedCount, archivedCount, created7d };
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
    setEditingId(c.id);
    setEditingName(c.name || "");
    setRenameError("");
  }, []);

  const cancelRename = useCallback(() => {
    setEditingId("");
    setEditingName("");
    setRenameError("");
  }, []);

  const saveRename = useCallback(
    async (campaignId) => {
      const trimmed = editingName.trim();
      if (!trimmed || trimmed.length < 3 || trimmed.length > 80) {
        setRenameError(tx.nameRequired);
        return;
      }
      if (isDuplicateName(trimmed, campaignId)) {
        setRenameError(tx.nameDuplicate);
        return;
      }
      try {
        await updateTenantCampaign(user.uid, campaignId, { name: trimmed });
        setToast(tx.renameSaved);
        cancelRename();
      } catch (err) {
        setRenameError(err.message || tx.renameFailed);
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
        setToast(tx.objectiveRequired);
        return;
      }
      setActionBusy(campaign.id);
      try {
        await updateTenantCampaign(user.uid, campaign.id, {
          status: newStatus,
          _fromStatus: campaign.status || "draft",
        });
        setToast(tx.statusChanged);
        if (selectedCampaign?.id === campaign.id) {
          setSelectedCampaign((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } catch (err) {
        setToast(tx.statusFailed);
        console.error("[CampaignsTab] Status change failed:", err);
      } finally {
        setActionBusy("");
      }
    },
    [user, tx, selectedCampaign]
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
      setToast(tx.createSuccess);
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
          onClick={() => setKpiFilter((p) => (p === "draft" ? "" : "draft"))}
        />
        <KpiCard
          icon="🟢"
          label={tx.kpiActive}
          value={kpis.activeCount}
          accent={STATUS_COLORS.active}
          isActive={kpiFilter === "active"}
          onClick={() => setKpiFilter((p) => (p === "active" ? "" : "active"))}
        />
        <KpiCard
          icon="⏸"
          label={tx.kpiPaused}
          value={kpis.pausedCount}
          accent={STATUS_COLORS.paused}
          isActive={kpiFilter === "paused"}
          onClick={() => setKpiFilter((p) => (p === "paused" ? "" : "paused"))}
        />
        <KpiCard
          icon="📦"
          label={tx.kpiArchived}
          value={kpis.archivedCount}
          accent={STATUS_COLORS.archived}
          isActive={kpiFilter === "archived"}
          onClick={() => setKpiFilter((p) => (p === "archived" ? "" : "archived"))}
        />
        <KpiCard
          icon="🆕"
          label={tx.kpiCreated7d}
          value={kpis.created7d}
          accent="#457b9d"
        />
      </div>

      {/* Source Health — EP5.502 */}
      <div className="ud-cmp-source-strip">
        {Object.entries(sourceBreakdown).map(([src, count]) => (
          count > 0 && (
            <span
              key={src}
              className={`ud-cmp-source-badge${sourceFilter === src ? " ud-cmp-source-badge--active" : ""}`}
              onClick={() => setSourceFilter((p) => (p === src ? "all" : src))}
              title={`${sourceLabel(src, tx)}: ${count}`}
            >
              {sourceLabel(src, tx)} ({count})
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
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ud-cmp-filters">
          {["all", "draft", "active", "paused", "archived"].map((s) => (
            <button
              key={s}
              className={`ud-cmp-chip${statusFilter === s ? " ud-cmp-chip--active" : ""}`}
              style={statusFilter === s && s !== "all" ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : undefined}
              onClick={() => { setStatusFilter(s); setKpiFilter(""); }}
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
              onClick={() => setSortKey(o.id)}
            >
              {tx[o.id] || o.id}
            </button>
          ))}
        </div>
        <button className="ud-cmp-add-btn" onClick={() => setShowAddModal(true)}>
          {tx.addCampaign}
        </button>
      </div>

      {hasFilters && (
        <button
          className="ud-cmp-clear"
          onClick={() => { setSearch(""); setStatusFilter("all"); setSourceFilter("all"); setKpiFilter(""); }}
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
                  <th>{tx.objectiveCol}</th>
                  <th>{tx.channelCol}</th>
                  <th>{tx.client}</th>
                  <th>{tx.cards}</th>
                  <th>{tx.budgetLabel}</th>
                  <th>{tx.taps}</th>
                  <th>{tx.conversionRate}</th>
                  <th>{tx.source}</th>
                  <th>{tx.created}</th>
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
                  return (
                    <tr key={c.id} className="ud-cmp-row" onClick={() => !isEditing && setSelectedCampaign(c)}>
                      <td>
                        {isEditing ? (
                          <div className="ud-cmp-rename-cell" onClick={(e) => e.stopPropagation()}>
                            <input
                              className="ud-cmp-rename-input"
                              value={editingName}
                              onChange={(e) => { setEditingName(e.target.value); setRenameError(""); }}
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
                          <span className="ud-cmp-status-badge__icon" aria-hidden="true">{STATUS_ICONS[st] || "•"}</span>
                          <span>{tx[st] || st}</span>
                        </span>
                      </td>
                      <td className="ud-cmp-obj-cell">{objectiveLabel(c.objective, tx)}</td>
                      <td className="ud-cmp-channel-cell">
                        {(c.channel || []).length > 0 ? (
                          <div className="ud-cmp-channel-badges">
                            {c.channel.slice(0, 3).map((ch) => (
                              <span key={ch} className="ud-cmp-channel-badge">{tx[`ch_${ch}`] || ch}</span>
                            ))}
                            {c.channel.length > 3 && <span className="ud-cmp-channel-badge ud-cmp-channel-badge--more">+{c.channel.length - 3}</span>}
                          </div>
                        ) : "—"}
                      </td>
                      <td>{c.client || "—"}</td>
                      <td>
                        <span className="ud-cmp-cards-count">{c.activeCards || 0}</span>
                        <span className="ud-cmp-cards-total"> / {c.totalCards || 0}</span>
                      </td>
                      <td>{c.budget || 0}</td>
                      <td>{tapCount}</td>
                      <td>{convRate}%</td>
                      <td>
                        <span className={`ud-cmp-source-tag ud-cmp-source-tag--${c.source || "manual"}`}>
                          {sourceLabel(c.source, tx)}
                        </span>
                      </td>
                      <td>{formatDate(c.createdAt)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="ud-cmp-action-group">
                          {!isEditing && (
                            <button className="ud-cmp-action-btn ud-cmp-action-btn--rename" onClick={() => startRename(c)} disabled={isBusy}>
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

          {/* Pagination info + Load more */}
          <div className="ud-cmp-pagination">
            <span className="ud-cmp-pagination__text">
              {tx.showing} {visible.length} {tx.of} {filtered.length}
            </span>
            {hasMore && (
              <button
                className="ud-cmp-load-more"
                onClick={loadMoreCampaigns}
                disabled={campaignsLoadingMore}
              >
                {campaignsLoadingMore ? `${tx.loadMore}...` : tx.loadMore}
              </button>
            )}
          </div>
        </>
      )}

      {dataMode === "tenant" && <div className="ud-cmp-demo-tag">{tx.demo}</div>}

      {/* Detail Drawer */}
      {selectedCampaign && (
        <CampaignDrawer
          key={selectedCampaign.id}
          campaign={selectedCampaign}
          tx={tx}
          onClose={() => setSelectedCampaign(null)}
          onRename={(c) => { startRename(c); setSelectedCampaign(null); }}
          onStatusChange={(c, ns) => { handleStatusChange(c, ns); }}
          linkedDealsCount={linkedDealsByCampaign[selectedCampaign.id] || 0}
          weightedDealsScore={weightedDealsByCampaign[selectedCampaign.id] || 0}
          tapMetrics={tapMetricsByCampaign[selectedCampaign.id] || null}
        />
      )}

      {/* Add Campaign Modal */}
      {showAddModal && (
        <AddCampaignModal
          tx={tx}
          onClose={() => setShowAddModal(false)}
          onSave={async (payload) => {
            await handleCreate(payload);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../../contexts/AuthContext";
import { getCampaignAudit } from "../../../services/tenantService";
import {
  STATUS_COLORS,
  STATUS_ICONS,
  VALID_NEXT,
  channelBadges,
  formatDate,
  objectiveLabel,
  sourceLabel,
  timeAgo,
} from "./campaignUtils";

export default function CampaignDrawer({
  campaign,
  tx,
  onClose,
  onRename,
  onEdit,
  onStatusChange,
  linkedDealsCount = 0,
  weightedDealsScore = 0,
  tapMetrics = null,
}) {
  const [audit, setAudit] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!campaign?.id || !user?.uid) return;
    let cancelled = false;
    const loadAudit = async () => {
      setAuditLoading(true);
      try {
        const data = await getCampaignAudit(user.uid, campaign.id, 5);
        if (!cancelled) setAudit(data);
      } catch {
        if (!cancelled) setAudit([]);
      } finally {
        if (!cancelled) setAuditLoading(false);
      }
    };
    loadAudit();
    return () => {
      cancelled = true;
    };
  }, [campaign?.id, user?.uid]);

  if (!campaign) return null;
  const st = campaign.status || "draft";
  const nextStatuses = VALID_NEXT[st] || [];
  const totalTaps = Number(tapMetrics?.taps || 0);
  const conversionRate = totalTaps > 0 ? ((weightedDealsScore / totalTaps) * 100).toFixed(1) : "0.0";
  const tapSeries = tapMetrics?.series || [];
  const budget = Number(campaign.budget || 0);
  const spent = Number(campaign.spent || 0);
  const budgetPercentRaw = budget > 0 ? (spent / budget) * 100 : 0;
  const budgetPercent = Math.max(0, Math.min(100, budgetPercentRaw));
  const budgetBarColor = budgetPercentRaw > 80 ? "#e63946" : budgetPercentRaw >= 50 ? "#e9c46a" : "#2a9d8f";

  const auditLabel = (type) => {
    const labels = {
      created: tx.auditCreated,
      renamed: tx.auditRenamed,
      status_changed: tx.auditStatusChanged,
      archived: tx.auditArchived,
    };
    return labels[type] || type;
  };

  return (
    <div className="ud-cmp-drawer-backdrop" onClick={onClose}>
      <div className="ud-cmp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ud-cmp-drawer__header">
          <div>
            <div className="ud-cmp-drawer__title">{campaign.name}</div>
            <span className="ud-cmp-status-badge" style={{ background: STATUS_COLORS[st] }}>
              <span
                className="ud-cmp-status-badge__icon"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: STATUS_ICONS[st] || "" }}
              />
              <span>{tx[st] || st}</span>
            </span>
          </div>
          <button className="ud-cmp-drawer__close" onClick={onClose}>{"✕"}</button>
        </div>

        <div className="ud-cmp-drawer__grid">
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.client}</span><span>{campaign.client || "—"}</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.source}</span><span>{sourceLabel(campaign.source, tx)}</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.cards}</span><span>{campaign.activeCards || 0} / {campaign.totalCards || 0}</span></div>
          <div className="ud-cmp-drawer__field">
            <span className="ud-cmp-drawer__label">{tx.budgetLabel}</span>
            {budget > 0 ? (
              <div className="ud-cmp-budget-track">
                <div className="ud-cmp-budget-track__bar">
                  <span
                    className="ud-cmp-budget-track__fill"
                    style={{ width: `${budgetPercent}%`, background: budgetBarColor }}
                  />
                </div>
                <span className="ud-cmp-budget-track__text">
                  {`${spent.toLocaleString()} / ${budget.toLocaleString()} (%${Math.round(budgetPercentRaw)})`}
                </span>
              </div>
            ) : (
              <span>{tx.noBudgetSet}</span>
            )}
          </div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.taps}</span><span>{totalTaps}</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.conversionRate}</span><span>{conversionRate}%</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.linkedDealsCount}</span><span>{linkedDealsCount}</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.created}</span><span>{formatDate(campaign.createdAt)}</span></div>
          <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.startDate}</span><span>{formatDate(campaign.startDate)}</span></div>
          {campaign.endDate && <div className="ud-cmp-drawer__field"><span className="ud-cmp-drawer__label">{tx.endDateLabel}</span><span>{formatDate(campaign.endDate)}</span></div>}
        </div>

        <div className="ud-cmp-drawer__section">{tx.strategySection}</div>
        <div className="ud-cmp-drawer__strategy">
          <div className="ud-cmp-drawer__field">
            <span className="ud-cmp-drawer__label">{tx.objectiveLabel}</span>
            <span>{objectiveLabel(campaign.objective, tx)}</span>
          </div>
          <div className="ud-cmp-drawer__field">
            <span className="ud-cmp-drawer__label">{tx.audienceLabel}</span>
            <span>{campaign.targetAudience ? (tx[`aud_${campaign.targetAudience}`] || campaign.targetAudience) : "—"}</span>
          </div>
          <div className="ud-cmp-drawer__field">
            <span className="ud-cmp-drawer__label">{tx.channelLabel}</span>
            <span>{channelBadges(campaign.channel, tx)}</span>
          </div>
          {campaign.description && (
            <div className="ud-cmp-drawer__field ud-cmp-drawer__field--full">
              <span className="ud-cmp-drawer__label">{tx.descriptionLabel}</span>
              <p className="ud-cmp-drawer__description">{campaign.description}</p>
            </div>
          )}
        </div>

        {nextStatuses.length > 0 && (
          <div className="ud-cmp-drawer__actions">
            {nextStatuses.map((ns) => (
              <button key={ns} className={`ud-cmp-action-btn ud-cmp-action-btn--${ns}`} onClick={() => onStatusChange(campaign, ns)}>
                {tx[ns] || ns}
              </button>
            ))}
            <button className="ud-cmp-action-btn ud-cmp-action-btn--rename" onClick={() => onRename(campaign)}>
              {tx.rename}
            </button>
            {onEdit && (
              <button className="ud-cmp-action-btn ud-cmp-action-btn--rename" onClick={() => onEdit(campaign)}>
                {tx.editDetails}
              </button>
            )}
          </div>
        )}

        <div className="ud-cmp-drawer__section">{tx.linkedCards}</div>
        {(campaign.cardIds || []).length > 0 ? (
          <div className="ud-cmp-drawer__card-list">
            {campaign.cardIds.slice(0, 20).map((cid, i) => (
              <span key={cid || i} className="ud-cmp-card-chip">{cid}</span>
            ))}
            {campaign.cardIds.length > 20 && <span className="ud-cmp-card-chip ud-cmp-card-chip--more">+{campaign.cardIds.length - 20}</span>}
          </div>
        ) : (
          <div className="ud-cmp-drawer__empty">{tx.noCards}</div>
        )}

        <div className="ud-cmp-drawer__section">{tx.performanceTrend}</div>
        {tapSeries.length > 0 && tapSeries.some((p) => p.taps > 0) ? (
          <div style={{ width: "100%", height: 180, marginBottom: 8 }}>
            <ResponsiveContainer>
              <AreaChart data={tapSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="taps" stroke="#457b9d" fill="rgba(69,123,157,0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="ud-cmp-drawer__empty">{tx.noTapData}</div>
        )}

        {/* ── Audit Trail ──────────────── */}
        <div className="ud-cmp-drawer__section">{tx.auditTrail}</div>
        {auditLoading ? (
          <div className="ud-cmp-drawer__empty">{tx.loading}</div>
        ) : audit.length > 0 ? (
          <ul className="ud-cmp-drawer__audit">
            {audit.map((entry, i) => (
              <li key={i} className="ud-cmp-drawer__audit-item">
                <span className="ud-cmp-drawer__audit-type">{auditLabel(entry.type)}</span>
                {entry.from && entry.to && (
                  <span className="ud-cmp-drawer__audit-detail">
                    {entry.from} → {entry.to}
                  </span>
                )}
                {entry.oldName && entry.newName && (
                  <span className="ud-cmp-drawer__audit-detail">
                    "{entry.oldName}" → "{entry.newName}"
                  </span>
                )}
                <span className="ud-cmp-drawer__audit-time">{timeAgo(entry.timestamp)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ud-cmp-drawer__empty">{tx.noAudit}</div>
        )}

      </div>
    </div>
  );
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSector } from "../../../hooks/useSector";
import { useLanguage } from "../../../i18n";
import { useRegion } from "../../../hooks/useRegion";
import { getEffectiveLocale } from "../../../config/regionConfig";
import AiBadge from "./AiBadge";
import LeadBadge from "./LeadBadge";

/* ── Velocity icon helper ── */
const VELOCITY_TITLES = {
  hot: { en: "Active now", ar: "نشط الآن", es: "Activo ahora", fr: "Actif maintenant" },
  warm: { en: (days) => `Active ${days}d ago`, ar: (days) => `نشط منذ ${days}ي`, es: (days) => `Activo hace ${days}d`, fr: (days) => `Actif il y a ${days}j` },
  cold: { en: (days) => `Idle ${days}d`, ar: (days) => `خامل ${days}ي`, es: (days) => `Inactivo ${days}d`, fr: (days) => `Inactif ${days}j` },
};

const VelocityIcon = ({ velocity, lang }) => {
  if (!velocity) return null;
  const idle = velocity.idleDays || 0;
  if (idle <= 1) return <span className="ud-kb-velocity ud-kb-velocity--hot" title={VELOCITY_TITLES.hot[lang] || VELOCITY_TITLES.hot.en}>&#x1F525;</span>;
  if (idle <= 3) {
    const warmTitle = VELOCITY_TITLES.warm[lang] || VELOCITY_TITLES.warm.en;
    return <span className="ud-kb-velocity ud-kb-velocity--warm" title={warmTitle(idle)}>&#x26A1;</span>;
  }
  const coldTitle = VELOCITY_TITLES.cold[lang] || VELOCITY_TITLES.cold.en;
  return <span className="ud-kb-velocity ud-kb-velocity--cold" title={coldTitle(idle)}>&#x1F4A4;</span>;
};

/* ── Trigger chip (why now?) ── */
const TriggerChip = ({ trigger, lang }) => {
  const LABELS = {
    pricing_3x: { en: "Pricing \u00d73", ar: "\u062a\u0633\u0639\u064a\u0631 \u00d73", es: "Precio \u00d73", fr: "Prix \u00d73" },
    booking_request: { en: "Viewing req", ar: "\u0637\u0644\u0628 \u0645\u0639\u0627\u064a\u0646\u0629", es: "Solicitud visita", fr: "Demande visite" },
    quote_requested: { en: "Quote req", ar: "\u0637\u0644\u0628 \u0639\u0631\u0636", es: "Cotizaci\u00f3n", fr: "Devis demand\u00e9" },
    test_drive: { en: "Test drive", ar: "\u062a\u062c\u0631\u0628\u0629 \u0642\u064a\u0627\u062f\u0629", es: "Prueba manejo", fr: "Essai routier" },
    idle_warning: { en: "Going cold", ar: "\u064a\u0628\u0631\u062f", es: "Enfri\u00e1ndose", fr: "Refroidissement" },
    high_velocity: { en: "Fast mover", ar: "\u0633\u0631\u064a\u0639", es: "R\u00e1pido", fr: "Rapide" },
  };
  const label = LABELS[trigger.type]?.[lang] || LABELS[trigger.type]?.en || trigger.type;
  const severity = trigger.severity || "low";
  return (
    <span className={`ud-kb-trigger ud-kb-trigger--${severity}`}>{label}</span>
  );
};

export default function KanbanBoard({ deals: initialDeals, suggestedDeals, currency, locale: localeProp, dealStages = [], onDealsChange, onStageChange, onAcceptSuggestion, thresholds: runtimeThresholds }) {
  const { region, regionId } = useRegion();
  const resolvedCurrency = currency || region?.currency || "AED";
  const [deals, setDeals] = useState(initialDeals || []);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [toast, setToast] = useState(null);
  const { config, st } = useSector();
  const { lang } = useLanguage();
  const locale = localeProp || getEffectiveLocale(regionId, lang);
  const pipelineStages = useMemo(() => {
    if (!Array.isArray(dealStages) || dealStages.length === 0) return config.pipeline.stages;
    const stageSet = new Set(dealStages);
    const filtered = config.pipeline.stages.filter((stage) => stageSet.has(stage.id));
    return filtered.length > 0 ? filtered : config.pipeline.stages;
  }, [config.pipeline.stages, dealStages]);
  const hotThreshold = runtimeThresholds?.hot ?? config.scoring?.thresholds?.hot ?? 70;
  const warmThreshold = runtimeThresholds?.warm ?? config.scoring?.thresholds?.warm ?? 40;
  const storageKey = `ud-kanban-${config.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setDeals(initialDeals || []);
      return;
    }
    try {
      const map = JSON.parse(saved);
      const merged = (initialDeals || []).map((d) => ({
        ...d,
        stage: map[d.id] || d.stage,
      }));
      setDeals(merged);
    } catch {
      setDeals(initialDeals || []);
    }
  }, [initialDeals, storageKey]);

  useEffect(() => {
    const stageMap = deals.reduce((acc, d) => {
      acc[d.id] = d.stage;
      return acc;
    }, {});
    localStorage.setItem(storageKey, JSON.stringify(stageMap));
    onDealsChange?.(deals);
  }, [deals, onDealsChange, storageKey]);

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const formatValue = (val) => {
    if (!val) return "";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: resolvedCurrency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDragStart = useCallback((e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      e.currentTarget.style.opacity = "0.4";
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedDeal(null);
    setDragOverStage(null);
  }, []);

  const handleDragOver = useCallback((e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverStage(null);
  }, []);

  /* Optimistic update with rollback on failure */
  const applyStageChange = useCallback(async (dealId, oldStageId, newStageId, dealName) => {
    const fromStage = pipelineStages.find((s) => s.id === oldStageId);
    const toStage = pipelineStages.find((s) => s.id === newStageId);
    // Optimistic: update local immediately
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStageId } : d)));
    const fromLabel = fromStage ? st(fromStage.label) : oldStageId;
    const toLabel = toStage ? st(toStage.label) : newStageId;
    setToast({ message: `${dealName}: ${fromLabel} \u2192 ${toLabel}`, type: "stage" });
    // Persist — rollback on failure
    try {
      await onStageChange?.(dealId, newStageId, oldStageId);
    } catch {
      setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: oldStageId } : d)));
      const rollbackText = ({ en: "rollback", ar: "تراجع", es: "reversion", fr: "retour" }[lang] || "rollback");
      setToast({ message: `${dealName}: ${rollbackText} \u2192 ${fromLabel}`, type: "error" });
    }
  }, [pipelineStages, lang, onStageChange, st]);

  const handleDrop = useCallback(
    (e, targetStageId) => {
      e.preventDefault();
      setDragOverStage(null);
      if (!draggedDeal || draggedDeal.stage === targetStageId) return;
      applyStageChange(draggedDeal.id, draggedDeal.stage, targetStageId, draggedDeal.name);
    },
    [draggedDeal, applyStageChange]
  );

  const moveDealToNextStage = useCallback((deal) => {
    const stageIndex = pipelineStages.findIndex((stage) => stage.id === deal.stage);
    if (stageIndex < 0 || stageIndex >= pipelineStages.length - 1) return;
    const nextStage = pipelineStages[stageIndex + 1];
    applyStageChange(deal.id, deal.stage, nextStage.id, deal.name);
  }, [pipelineStages, applyStageChange]);

  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  /* relative time helper */
  const timeAgo = (ts) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div>
      {/* ── AI-Suggested Deals banner ── */}
      {(suggestedDeals || []).length > 0 && (
        <div className="ud-kb-suggestions">
          <div className="ud-kb-suggestions-title">
            <span>&#x1F3AF;</span>
            {({ en: "AI-Suggested Deals", ar: "\u0635\u0641\u0642\u0627\u062a \u0645\u0642\u062a\u0631\u062d\u0629", es: "Tratos sugeridos por IA", fr: "Affaires sugg\u00e9r\u00e9es par l\u2019IA" }[lang] || "AI-Suggested Deals")}
            <AiBadge text={({ en: "Auto-detect", ar: "\u0643\u0634\u0641 \u062a\u0644\u0642\u0627\u0626\u064a", es: "Detecci\u00f3n auto", fr: "D\u00e9tection auto" }[lang] || "Auto-detect")} />
          </div>
          <div className="ud-kb-suggestions-list">
            {suggestedDeals.map((s) => (
              <div key={s.vipId} className="ud-kb-suggestion-card">
                <div className="ud-kb-suggestion-info">
                  <span className="ud-kb-suggestion-name">{s.name}</span>
                  <span className="ud-kb-suggestion-item">{s.topItem}</span>
                  <div className="ud-kb-suggestion-triggers">
                    {(s.triggers || []).slice(0, 2).map((t, i) => (
                      <TriggerChip key={`${t.type}-${i}`} trigger={t} lang={lang} />
                    ))}
                  </div>
                </div>
                <div className="ud-kb-suggestion-actions">
                  <LeadBadge score={s.score} thresholds={runtimeThresholds} />
                  <button
                    type="button"
                    className="ud-kb-suggestion-accept"
                    onClick={() => onAcceptSuggestion?.(s)}
                  >
                    + {({ en: "Add", ar: "\u0625\u0636\u0627\u0641\u0629", es: "Agregar", fr: "Ajouter" }[lang] || "Add")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary bar ── */}
      <div className="ud-kanban-summary">
        <div>
          <span className="ud-kanban-total-label">
            {({ en: "Total Pipeline Value", ar: "\u0625\u062c\u0645\u0627\u0644\u064a \u0642\u064a\u0645\u0629 \u062e\u0637 \u0627\u0644\u0623\u0646\u0627\u0628\u064a\u0628", es: "Valor total del pipeline", fr: "Valeur totale du pipeline" }[lang] || "Total Pipeline Value")}
          </span>
          <span className="ud-kanban-total-value">{formatValue(totalValue)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--ud-text-muted)" }}>
            {deals.length} {({ en: "deals", ar: "\u0635\u0641\u0642\u0629", es: "tratos", fr: "affaires" }[lang] || "deals")}
          </span>
          <AiBadge text={({ en: "AI-ranked", ar: "\u062a\u0631\u062a\u064a\u0628 \u0630\u0643\u064a", es: "Ranking IA", fr: "Classement IA" }[lang] || "AI-ranked")} />
        </div>
      </div>

      {/* ── Kanban columns ── */}
      <div className="ud-kanban-board">
        {pipelineStages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
          const isOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`ud-kanban-column ${isOver ? "ud-kanban-drag-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="ud-kanban-header" style={{ borderBottomColor: stage.color }}>
                <span className="ud-kanban-stage-name" style={{ color: stage.color }}>{st(stage.label)}</span>
                <span className="ud-kanban-stage-count">{stageDeals.length}</span>
              </div>

              <div className="ud-kanban-cards">
                {stageDeals.map((deal) => {
                  const heatClass = deal.score >= hotThreshold ? "ud-kb-heat--hot" : deal.score >= warmThreshold ? "ud-kb-heat--warm" : "ud-kb-heat--cold";
                  const topTriggers = (deal.triggers || []).slice(0, 2);
                  return (
                    <div
                      key={deal.id}
                      className={`ud-kanban-card ${heatClass}`}
                      draggable
                      tabIndex={0}
                      role="button"
                      aria-label={`${deal.name} ${st(stage.label)}`}
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          moveDealToNextStage(deal);
                        }
                      }}
                    >
                      {/* Top row: name + velocity */}
                      <div className="ud-kb-card-top">
                        <div className="ud-kanban-card-name">{deal.name}</div>
                        <VelocityIcon velocity={deal.velocity} lang={lang} />
                      </div>
                      {deal.item && <div className="ud-kanban-card-item">{deal.item}</div>}
                      {/* Why-now trigger chips */}
                      {topTriggers.length > 0 && (
                        <div className="ud-kb-triggers">
                          {topTriggers.map((t, i) => (
                            <TriggerChip key={`${t.type}-${i}`} trigger={t} lang={lang} />
                          ))}
                        </div>
                      )}
                      {/* Value + score */}
                      <div className="ud-kanban-card-footer">
                        <span className="ud-kanban-card-value">{deal.value ? formatValue(deal.value) : ""}</span>
                        {deal.score > 0 && <LeadBadge score={deal.score} thresholds={runtimeThresholds} />}
                      </div>
                      {/* Enrichment: VIP badge + last seen + at-risk + staleness */}
                      <div className="ud-kb-enrichment">
                        {deal.vipLinked && <span className="ud-kb-vip-badge">VIP</span>}
                        {deal.lastSeen && (
                          <span className="ud-kb-last-seen" title={new Date(deal.lastSeen).toLocaleString()}>
                            {timeAgo(deal.lastSeen)} {({ en: "ago", ar: "\u0645\u0636\u0649", es: "atr\u00e1s", fr: "pass\u00e9" }[lang] || "ago")}
                          </span>
                        )}
                        {deal.atRisk && (
                          <span className="ud-kb-risk-flag" title={({ en: "Reactivation Required", ar: "إعادة التفعيل مطلوبة", es: "Reactivacion requerida", fr: "Reactivation requise" }[lang] || "Reactivation Required")}>
                            {"⚠"}
                          </span>
                        )}
                        {(() => {
                          const stageTs = deal.updatedAt || deal.createdAt;
                          if (!stageTs) return null;
                          const daysIn = Math.floor((Date.now() - new Date(stageTs).getTime()) / 86400000);
                          if (daysIn < 2) return null;
                          const staleClass = daysIn >= 7 ? "ud-kb-stale--critical" : daysIn >= 4 ? "ud-kb-stale--warning" : "ud-kb-stale--ok";
                          return <span className={`ud-kb-stale ${staleClass}`}>{daysIn}d</span>;
                        })()}
                      </div>
                      {/* Outreach shortcuts */}
                      <div className="ud-kb-outreach" onClick={(ev) => ev.stopPropagation()}>
                        <button type="button" className="ud-kb-outreach-btn" title={({ en: "Call", ar: "\u0627\u062a\u0635\u0627\u0644", es: "Llamar", fr: "Appeler" }[lang] || "Call")} onClick={() => setToast({ message: `${({ en: "Call", ar: "\u0627\u062a\u0635\u0627\u0644", es: "Llamar", fr: "Appeler" }[lang] || "Call")}: ${deal.leadName || deal.name}`, type: "action" })}>{"📞"}</button>
                        <button type="button" className="ud-kb-outreach-btn" title={({ en: "Email", ar: "\u0628\u0631\u064a\u062f", es: "Correo", fr: "E-mail" }[lang] || "Email")} onClick={() => setToast({ message: `${({ en: "Email", ar: "\u0628\u0631\u064a\u062f", es: "Correo", fr: "E-mail" }[lang] || "Email")}: ${deal.leadName || deal.name}`, type: "action" })}>{"✉️"}</button>
                        <button type="button" className="ud-kb-outreach-btn" title={({ en: "WhatsApp", ar: "\u0648\u0627\u062a\u0633\u0627\u0628", es: "WhatsApp", fr: "WhatsApp" }[lang] || "WhatsApp")} onClick={() => setToast({ message: `${({ en: "WhatsApp", ar: "\u0648\u0627\u062a\u0633\u0627\u0628", es: "WhatsApp", fr: "WhatsApp" }[lang] || "WhatsApp")}: ${deal.leadName || deal.name}`, type: "action" })}>{"💬"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {stageDeals.length > 0 && stageTotal > 0 && (
                <div className="ud-kanban-stage-footer">
                  <span className="ud-kanban-stage-total">{formatValue(stageTotal)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && (
        <div className={`ud-kb-toast ud-kb-toast--${toast.type || "info"}`} role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}

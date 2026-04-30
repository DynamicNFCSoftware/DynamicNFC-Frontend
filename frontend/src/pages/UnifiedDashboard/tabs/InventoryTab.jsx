import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { getSectorSchema } from "../../../config/developerThemes";
import { useDashboard } from "../useDashboard";
import { SkeletonCard } from "../components/LoadingSkeleton";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

/* ─── i18n ─── */
const UI = {
  en: {
    sectionSuffix: "Distribution",
    count: "Count",
    status: "Est. Availability",
    interest: "Interest",
    available: "available",
    share: "Share",
    note: "Availability is estimated from current interaction density.",
    kpiMostViewed: "Most Viewed",
    kpiRising: "Fastest Rising",
    kpiLowStock: "Low Stock Risk",
    kpiVipShare: "VIP Interest",
    wow: "WoW",
    activeDeals: "Active Deals",
    vips: "VIPs",
    pipelineVal: "Pipeline Value",
    trend: "Trend",
    action: "Action",
    viewUnits: "View Units",
    hotUnits: "Hot Units",
    hotUnitsDesc: "Units with the highest interaction volume right now.",
    views: "views",
    pricing: "pricing",
    bookings: "bookings",
    downloads: "downloads",
    interestedVips: "Interested VIPs",
    linkedDeals: "Linked Deals",
    createDeal: "Create Deal",
    noDeals: "No linked deals",
    unitDetail: "Unit Detail",
    close: "Close",
    allTypes: "All",
    sortBy: "Sort by",
    noData: "No inventory data yet. Interactions will populate this view.",
    categories: "categories",
    lowStockAlert: "High demand + low stock",
    healthy: "Healthy supply",
    attention: "Needs attention",
    critical: "Low stock",
    lastActivity: "Last activity",
    topUnit: "Top unit",
    sparkline7d: "7d",
    typeBreakdown: "Interest by Type",
    zeroEngagement: "Zero Engagement",
    zeroEngagementFilter: "Zero Engagement",
  },
  ar: {
    sectionSuffix: "التوزيع",
    count: "العدد",
    status: "التوفر التقديري",
    interest: "الاهتمام",
    available: "متاح",
    share: "الحصة",
    note: "التوفر تقديري ومبني على كثافة التفاعل الحالية.",
    kpiMostViewed: "الأكثر مشاهدة",
    kpiRising: "الأسرع نمواً",
    kpiLowStock: "خطر نفاد المخزون",
    kpiVipShare: "اهتمام VIP",
    wow: "أسبوعي",
    activeDeals: "صفقات نشطة",
    vips: "كبار العملاء",
    pipelineVal: "قيمة خط الأنابيب",
    trend: "الاتجاه",
    action: "إجراء",
    viewUnits: "عرض الوحدات",
    hotUnits: "الوحدات الساخنة",
    hotUnitsDesc: "الوحدات ذات أعلى حجم تفاعل حالياً.",
    views: "مشاهدات",
    pricing: "تسعير",
    bookings: "حجوزات",
    downloads: "تنزيلات",
    interestedVips: "VIP مهتمون",
    linkedDeals: "صفقات مرتبطة",
    createDeal: "إنشاء صفقة",
    noDeals: "لا توجد صفقات مرتبطة",
    unitDetail: "تفاصيل الوحدة",
    close: "إغلاق",
    allTypes: "الكل",
    sortBy: "ترتيب حسب",
    noData: "لا توجد بيانات مخزون بعد.",
    categories: "فئات",
    lowStockAlert: "طلب عالي + مخزون منخفض",
    healthy: "مخزون صحي",
    attention: "يحتاج انتباه",
    critical: "مخزون منخفض",
    lastActivity: "آخر نشاط",
    topUnit: "أعلى وحدة",
    sparkline7d: "7 أيام",
    typeBreakdown: "الاهتمام حسب النوع",
    zeroEngagement: "لا يوجد تفاعل",
    zeroEngagementFilter: "لا يوجد تفاعل",
  },
  es: {
    sectionSuffix: "Distribución",
    count: "Cantidad",
    status: "Disponibilidad estimada",
    interest: "Interés",
    available: "disponible",
    share: "Participación",
    note: "La disponibilidad se estima según la densidad de interacciones.",
    kpiMostViewed: "Más Visto",
    kpiRising: "Mayor Crecimiento",
    kpiLowStock: "Riesgo de Stock",
    kpiVipShare: "Interés VIP",
    wow: "SoS",
    activeDeals: "Tratos Activos",
    vips: "VIPs",
    pipelineVal: "Valor Pipeline",
    trend: "Tendencia",
    action: "Acción",
    viewUnits: "Ver Unidades",
    hotUnits: "Unidades Calientes",
    hotUnitsDesc: "Unidades con el mayor volumen de interacción ahora.",
    views: "vistas",
    pricing: "precios",
    bookings: "reservas",
    downloads: "descargas",
    interestedVips: "VIPs Interesados",
    linkedDeals: "Tratos Vinculados",
    createDeal: "Crear Trato",
    noDeals: "Sin tratos vinculados",
    unitDetail: "Detalle de Unidad",
    close: "Cerrar",
    allTypes: "Todos",
    sortBy: "Ordenar por",
    noData: "Sin datos de inventario aún.",
    categories: "categorías",
    lowStockAlert: "Alta demanda + bajo stock",
    healthy: "Stock saludable",
    attention: "Necesita atención",
    critical: "Stock bajo",
    lastActivity: "Última actividad",
    topUnit: "Unidad principal",
    sparkline7d: "7d",
    typeBreakdown: "Interés por Tipo",
    zeroEngagement: "Sin interacción",
    zeroEngagementFilter: "Sin interacción",
  },
  fr: {
    sectionSuffix: "Répartition",
    count: "Nombre",
    status: "Disponibilité estimée",
    interest: "Intérêt",
    available: "disponible",
    share: "Part",
    note: "La disponibilité est estimée selon la densité d'interactions actuelle.",
    kpiMostViewed: "Plus Consulté",
    kpiRising: "Croissance Rapide",
    kpiLowStock: "Risque de Stock",
    kpiVipShare: "Intérêt VIP",
    wow: "SoS",
    activeDeals: "Affaires Actives",
    vips: "VIPs",
    pipelineVal: "Valeur Pipeline",
    trend: "Tendance",
    action: "Action",
    viewUnits: "Voir Unités",
    hotUnits: "Unités Chaudes",
    hotUnitsDesc: "Unités avec le plus grand volume d'interaction actuellement.",
    views: "vues",
    pricing: "tarifs",
    bookings: "réservations",
    downloads: "téléchargements",
    interestedVips: "VIPs Intéressés",
    linkedDeals: "Affaires Liées",
    createDeal: "Créer Affaire",
    noDeals: "Aucune affaire liée",
    unitDetail: "Détail Unité",
    close: "Fermer",
    allTypes: "Tous",
    sortBy: "Trier par",
    noData: "Aucune donnée d'inventaire pour le moment.",
    categories: "catégories",
    lowStockAlert: "Forte demande + stock faible",
    healthy: "Stock sain",
    attention: "Attention requise",
    critical: "Stock faible",
    lastActivity: "Dernière activité",
    topUnit: "Unité principale",
    sparkline7d: "7j",
    typeBreakdown: "Intérêt par Type",
    zeroEngagement: "Aucun engagement",
    zeroEngagementFilter: "Aucun engagement",
  },
};

/* ─── Helpers ─── */
function timeAgo(ts, lang = "en") {
  if (!ts) return "-";
  const d = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(d / 60000);
  if (mins < 60) return lang === "ar" ? `منذ ${mins} د` : lang === "es" ? `hace ${mins}m` : lang === "fr" ? `il y a ${mins}m` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === "ar" ? `منذ ${hrs} س` : lang === "es" ? `hace ${hrs}h` : lang === "fr" ? `il y a ${hrs}h` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return lang === "ar" ? `منذ ${days} ي` : lang === "es" ? `hace ${days}d` : lang === "fr" ? `il y a ${days}j` : `${days}d`;
}

function TrendArrow({ value, label }) {
  if (value === 0) return <span className="ud-inv-trend ud-inv-trend--flat">{"—"} 0%</span>;
  const up = value > 0;
  return (
    <span className={`ud-inv-trend ${up ? "ud-inv-trend--up" : "ud-inv-trend--down"}`}>
      {up ? "↑" : "↓"} {Math.abs(value)}% {label || ""}
    </span>
  );
}

/* ─── Mini Sparkline (pure SVG) ─── */
function MiniSparkline({ data = [], width = 72, height = 22, color = "#457b9d" }) {
  if (!data || data.length < 2 || data.every((v) => v === 0))
    return <span style={{ color: "var(--ud-text-muted)", fontSize: 11 }}>{"-"}</span>;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (v / max) * (height - 3) - 1.5;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg width={width} height={height} className="ud-inv-sparkline" viewBox={`0 0 ${width} ${height}`}>
      <polygon points={area} fill={color} fillOpacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function StockBadge({ available, total, tx }) {
  const ratio = total > 0 ? available / total : 1;
  let cls = "ud-inv-stock--healthy";
  let label = tx.healthy;
  if (ratio <= 0.15) { cls = "ud-inv-stock--critical"; label = tx.critical; }
  else if (ratio <= 0.4) { cls = "ud-inv-stock--attention"; label = tx.attention; }
  return (
    <span className={`ud-inv-stock ${cls}`}>
      {available}/{total} {tx.available} — {label}
    </span>
  );
}

/* ─── Type Breakdown Bar Chart (in drawer) ─── */
function TypeBreakdownChart({ typeBreakdown = {}, tx }) {
  const chartData = Object.entries(typeBreakdown || {})
    .filter(([, count]) => Number(count) > 0)
    .map(([type, count]) => ({ type, count: Number(count) }))
    .sort((a, b) => b.count - a.count);
  if (chartData.length === 0) return null;
  return (
    <div className="ud-inv-drawer__chart-section">
      <div className="ud-inv-drawer__units-title">{tx.typeBreakdown}</div>
      <div style={{ width: "100%", height: 140, marginTop: 8 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="type" tick={{ fontSize: 10, fill: "var(--ud-text-muted, #888)" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--ud-text-muted, #888)" }} width={28} />
            <Tooltip
              contentStyle={{ background: "var(--ud-card-bg, #23232a)", border: "1px solid var(--ud-border, #333)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "var(--ud-text, #fff)" }}
            />
            <Bar dataKey="count" fill="#457b9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ icon, label, value, sub, accent }) {
  return (
    <div className="ud-inv-kpi">
      <div className="ud-inv-kpi__icon" style={accent ? { background: accent } : undefined}>{icon}</div>
      <div className="ud-inv-kpi__body">
        <div className="ud-inv-kpi__label">{label}</div>
        <div className="ud-inv-kpi__value">{value}</div>
        {sub && <div className="ud-inv-kpi__sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ─── Hot Unit Card ─── */
function HotUnitCard({ unit, tx, isZeroEngagement }) {
  return (
    <div className="ud-inv-hot-card">
      <div className="ud-inv-hot-card__header">
        <span className="ud-inv-hot-card__name">
          {unit.name}
          {isZeroEngagement ? (
            <span className="ud-inv-zero-badge">{tx.zeroEngagement}</span>
          ) : null}
        </span>
        <span className="ud-inv-hot-card__tower">{unit.tower}</span>
      </div>
      <div className="ud-inv-hot-card__metrics">
        <span>{unit.views} {tx.views}</span>
        <span className="ud-inv-hot-card__sep">{"·"}</span>
        <span>{unit.pricing} {tx.pricing}</span>
        <span className="ud-inv-hot-card__sep">{"·"}</span>
        <span>{unit.bookings} {tx.bookings}</span>
      </div>
      {unit.sparkline && (
        <div style={{ marginTop: 6 }}>
          <MiniSparkline data={unit.sparkline} width={100} height={24} />
        </div>
      )}
      {unit.interestedVips && unit.interestedVips.length > 0 && (
        <div className="ud-inv-hot-card__vips">
          <span className="ud-inv-hot-card__vip-label">{tx.interestedVips}:</span>
          {unit.interestedVips.slice(0, 3).map((v) => (
            <span key={v.name || v.id} className="ud-inv-hot-card__vip-chip">
              {v.name} ({v.score})
            </span>
          ))}
        </div>
      )}
      {unit.linkedDealCount > 0 && (
        <div className="ud-inv-hot-card__deals">
          {tx.linkedDeals}: {unit.linkedDealCount}
        </div>
      )}
    </div>
  );
}

/* ─── Unit Detail Drawer ─── */
function UnitDrawer({ cat, tx, st, formatValue, onClose, onCreateDeal }) {
  const { lang } = useLanguage();
  if (!cat) return null;
  return (
    <div className="ud-inv-drawer-backdrop" onClick={onClose}>
      <div className="ud-inv-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ud-inv-drawer__header">
          <span className="ud-inv-drawer__title">{st(cat.name)} — {tx.unitDetail}</span>
          <button className="ud-inv-drawer__close" onClick={onClose}>{"✕"}</button>
        </div>

        {/* Summary stats */}
        <div className="ud-inv-drawer__stats">
          <div className="ud-inv-drawer__stat">
            <span className="ud-inv-drawer__stat-val">{cat.interest}</span>
            <span className="ud-inv-drawer__stat-lbl">{tx.interest}</span>
          </div>
          <div className="ud-inv-drawer__stat">
            <span className="ud-inv-drawer__stat-val">{cat.activeDealCount}</span>
            <span className="ud-inv-drawer__stat-lbl">{tx.activeDeals}</span>
          </div>
          <div className="ud-inv-drawer__stat">
            <span className="ud-inv-drawer__stat-val">{cat.vipCount}</span>
            <span className="ud-inv-drawer__stat-lbl">{tx.vips}</span>
          </div>
          <div className="ud-inv-drawer__stat">
            <span className="ud-inv-drawer__stat-val">
              <TrendArrow value={cat.wowChange} label={tx.wow} />
            </span>
            <span className="ud-inv-drawer__stat-lbl">{tx.trend}</span>
          </div>
        </div>

        {/* Category sparkline */}
        {cat.sparkline && (
          <div className="ud-inv-drawer__sparkline-row">
            <span className="ud-inv-drawer__spark-label">{tx.sparkline7d}</span>
            <MiniSparkline data={cat.sparkline} width={200} height={32} />
          </div>
        )}

        {/* Type breakdown chart */}
        <TypeBreakdownChart typeBreakdown={cat.typeBreakdown} tx={tx} />

        {/* Top Units */}
        {cat.topUnits && cat.topUnits.length > 0 ? (
          <div className="ud-inv-drawer__units">
            <div className="ud-inv-drawer__units-title">{tx.hotUnits}</div>
            {cat.topUnits.map((u) => (
              <div key={u.id} className="ud-inv-drawer__unit-row">
                <div className="ud-inv-drawer__unit-name">
                  {u.name}
                  {u.type && u.type !== "-" && (
                    <span className="ud-inv-drawer__unit-type">{u.type}</span>
                  )}
                </div>
                <div className="ud-inv-drawer__unit-metrics">
                  <span>{u.views} {tx.views}</span>
                  <span>{u.pricing} {tx.pricing}</span>
                  <span>{u.bookings} {tx.bookings}</span>
                  <span>{tx.lastActivity}: {timeAgo(u.lastTapAt, lang)}</span>
                </div>
                {u.sparkline && (
                  <div style={{ marginTop: 4 }}>
                    <MiniSparkline data={u.sparkline} width={80} height={18} />
                  </div>
                )}
                {u.interestedVips && u.interestedVips.length > 0 && (
                  <div className="ud-inv-drawer__unit-vips">
                    {u.interestedVips.map((v) => (
                      <span key={v.name} className="ud-inv-hot-card__vip-chip">{v.name} ({v.score})</span>
                    ))}
                  </div>
                )}
                {u.linkedDealCount > 0 && (
                  <div className="ud-inv-drawer__unit-deals">
                    {tx.linkedDeals}: {u.linkedDealCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="ud-inv-drawer__empty">{tx.noData}</div>
        )}

        {/* VIP names interested */}
        {cat.vipNames && cat.vipNames.length > 0 && (
          <div className="ud-inv-drawer__vip-list">
            <div className="ud-inv-drawer__units-title">{tx.interestedVips}</div>
            <div className="ud-inv-drawer__vip-chips">
              {cat.vipNames.map((n) => (
                <span key={n} className="ud-inv-hot-card__vip-chip">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Create Deal CTA */}
        <button className="ud-inv-drawer__cta" onClick={() => onCreateDeal(cat)}>
          {tx.createDeal}
        </button>
      </div>
    </div>
  );
}

/* ─── SORT options ─── */
const SORT_OPTIONS = [
  { id: "interest", label: { en: "Interest", ar: "الاهتمام", es: "Interés", fr: "Intérêt" } },
  { id: "available", label: { en: "Availability", ar: "التوفر", es: "Disponibilidad", fr: "Disponibilité" } },
  { id: "deals", label: { en: "Deals", ar: "الصفقات", es: "Tratos", fr: "Affaires" } },
  { id: "trend", label: { en: "Trend", ar: "الاتجاه", es: "Tendencia", fr: "Tendance" } },
];

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function InventoryTab() {
  const { config, st, sectorId, activeSectorId } = useSector();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { analytics, loading, inventoryMetrics, formatValue, cards } = useDashboard();
  const tx = { ...UI.en, ...(UI[lang] || {}) };
  const schema = useMemo(() => getSectorSchema(activeSectorId || sectorId, lang), [activeSectorId, sectorId, lang]);

  const [selectedCat, setSelectedCat] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState("interest");
  const [showZeroEngagementOnly, setShowZeroEngagementOnly] = useState(false);
  const isZeroEngagement = useCallback(
    (unit) => (
      Number(unit?.views || 0) === 0 &&
      Number(unit?.totalTaps || 0) === 0 &&
      Number(unit?.interestedVips?.length || 0) === 0
    ),
    []
  );

  const typeFilters = useMemo(() => {
    const tf = config.inventory?.typeFilters || [];
    return tf.length > 0 ? tf : [{ id: "all", label: { en: "All" } }];
  }, [config]);

  // Sort & filter categories
  const sortedCats = useMemo(() => {
    if (!inventoryMetrics?.categories) return [];
    let cats = [...inventoryMetrics.categories];
    if (typeFilter !== "all") {
      cats = cats.filter((c) => (c.typeBreakdown?.[typeFilter] || 0) > 0);
    }
    cats.sort((a, b) => {
      switch (sortKey) {
        case "available": return a.available - b.available;
        case "deals": return b.activeDealCount - a.activeDealCount;
        case "trend": return b.wowChange - a.wowChange;
        default: return b.interest - a.interest;
      }
    });
    return cats;
  }, [inventoryMetrics, typeFilter, sortKey]);

  const totalInterest = useMemo(
    () => sortedCats.reduce((s, c) => s + c.interest, 0) || 1,
    [sortedCats]
  );
  const hotUnits = useMemo(() => {
    if (Array.isArray(inventoryMetrics?.hotUnits) && inventoryMetrics.hotUnits.length > 0) {
      return inventoryMetrics.hotUnits;
    }
    return [...(cards || [])].sort((a, b) => Number(b?.views || 0) - Number(a?.views || 0)).slice(0, 8);
  }, [inventoryMetrics, cards]);
  const filteredHotUnits = useMemo(
    () => (showZeroEngagementOnly ? hotUnits.filter((unit) => isZeroEngagement(unit)) : hotUnits),
    [hotUnits, isZeroEngagement, showZeroEngagementOnly]
  );

  const kpi = inventoryMetrics?.kpis || {};

  const handleRowClick = useCallback((cat) => setSelectedCat(cat), []);

  const handleCreateDeal = useCallback((cat) => {
    if (!cat) return;
    const topUnit = cat.topUnits?.[0]?.name || st(cat.name);
    const seedName = cat.vipNames?.[0] || `${st(cat.name)} Interest`;
    navigate("/unified/pipeline", {
      state: {
        inventoryDeal: {
          requestId: `${cat.id}-${Date.now()}`,
          name: seedName,
          item: topUnit,
          value: 0,
          stage: "new_lead",
          source: "inventory_tab",
          categoryId: cat.id,
          categoryName: st(cat.name),
        },
      },
    });
  }, [navigate, st]);

  if (loading) return <SkeletonCard />;

  return (
    <div className="ud-inv">
      {/* ── Section label ── */}
      <div className="ud-section-label">{schema.entityLabelPlural}</div>

      {/* ── KPI Row ── */}
      <div className="ud-inv-kpis">
        <KpiCard
          icon={"👁"}
          label={tx.kpiMostViewed}
          value={kpi.mostViewed ? st(kpi.mostViewed.name) : "-"}
          sub={kpi.mostViewed ? `${kpi.mostViewed.interest} ${tx.interest.toLowerCase()}` : null}
          accent="rgba(69,123,157,0.15)"
        />
        <KpiCard
          icon={"📈"}
          label={tx.kpiRising}
          value={kpi.fastestRising ? st(kpi.fastestRising.name) : "-"}
          sub={kpi.fastestRising ? <TrendArrow value={kpi.fastestRising.wowChange} label={tx.wow} /> : null}
          accent="rgba(34,197,94,0.15)"
        />
        <KpiCard
          icon={"⚠"}
          label={tx.kpiLowStock}
          value={
            kpi.lowStockRisk && kpi.lowStockRisk.length > 0
              ? `${kpi.lowStockRisk.length} ${tx.categories}`
              : tx.healthy
          }
          sub={kpi.lowStockRisk?.length > 0 ? tx.lowStockAlert : null}
          accent={kpi.lowStockRisk?.length > 0 ? "rgba(239,68,70,0.12)" : "rgba(34,197,94,0.12)"}
        />
        <KpiCard
          icon={"⭐"}
          label={tx.kpiVipShare}
          value={kpi.totalVipInterest ?? 0}
          sub={`${tx.vips} ${tx.interest.toLowerCase()}`}
          accent="rgba(234,179,8,0.15)"
        />
      </div>

      {/* ── Filters Row ── */}
      <div className="ud-inv-filters">
        <div className="ud-inv-type-chips">
          <button
            className={`ud-inv-chip ${showZeroEngagementOnly ? "ud-inv-chip--active" : ""}`}
            onClick={() => setShowZeroEngagementOnly((prev) => !prev)}
          >
            {tx.zeroEngagementFilter}
          </button>
          <button
            className={`ud-inv-chip ${typeFilter === "all" ? "ud-inv-chip--active" : ""}`}
            onClick={() => setTypeFilter("all")}
          >
            {tx.allTypes}
          </button>
          {typeFilters.filter((t) => t.id !== "all").map((t) => (
            <button
              key={t.id}
              className={`ud-inv-chip ${typeFilter === t.id ? "ud-inv-chip--active" : ""}`}
              onClick={() => setTypeFilter(t.id)}
            >
              {st(t.label)}
            </button>
          ))}
        </div>
        <div className="ud-inv-sort">
          <span className="ud-inv-sort__label">{tx.sortBy}:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`ud-inv-sort-btn ${sortKey === opt.id ? "ud-inv-sort-btn--active" : ""}`}
              onClick={() => setSortKey(opt.id)}
            >
              {st(opt.label)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Table Card ── */}
      <div className="ud-card">
        <div className="ud-card-title">
          {schema.parentLabel} {tx.sectionSuffix}
        </div>
        <div className="ud-card-subtitle">{tx.note}</div>

        {sortedCats.length === 0 ? (
          <div className="ud-inv-empty">{schema.emptyState}</div>
        ) : (
          <table className="ud-table ud-inv-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>{schema.parentLabel}</th>
                <th>{tx.count}</th>
                <th>{tx.status}</th>
                <th>{tx.share}</th>
                <th>{tx.trend}</th>
                <th>{tx.sparkline7d}</th>
                <th>{tx.activeDeals}</th>
                <th>{tx.vips}</th>
                <th>{tx.interest}</th>
                <th>{tx.action}</th>
              </tr>
            </thead>
            <tbody>
              {sortedCats.map((cat) => {
                const share = Math.round((cat.interest / totalInterest) * 100);
                return (
                  <tr
                    key={cat.id}
                    className="ud-inv-row"
                    onClick={() => handleRowClick(cat)}
                  >
                    <td style={{ fontWeight: 500, color: "var(--ud-text)" }}>
                      {st(cat.name)}
                      {cat.lowStock && <span className="ud-inv-low-stock-dot" title={tx.lowStockAlert}>{"!"}</span>}
                    </td>
                    <td>{cat.interest}</td>
                    <td>
                      <StockBadge available={cat.available} total={cat.total} tx={tx} />
                    </td>
                    <td>{share}%</td>
                    <td>
                      <TrendArrow value={cat.wowChange} label={tx.wow} />
                    </td>
                    <td>
                      <MiniSparkline data={cat.sparkline} />
                    </td>
                    <td>
                      {cat.activeDealCount > 0 ? (
                        <span className="ud-inv-deal-badge">{cat.activeDealCount}</span>
                      ) : (
                        <span className="ud-inv-deal-badge ud-inv-deal-badge--zero">0</span>
                      )}
                    </td>
                    <td>
                      {cat.vipCount > 0 ? (
                        <span className="ud-inv-vip-count">{cat.vipCount}</span>
                      ) : "-"}
                    </td>
                    <td>
                      <div className="ud-inv-bar-wrap">
                        <div className="ud-inv-bar-bg">
                          <div
                            className="ud-inv-bar-fill"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="ud-inv-bar-label">{share}%</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="ud-inv-action-btn"
                        onClick={(e) => { e.stopPropagation(); handleRowClick(cat); }}
                      >
                        {tx.viewUnits}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Hot Units Spotlight ── */}
      {filteredHotUnits.length > 0 && (
        <div className="ud-card ud-inv-hot-section">
          <div className="ud-card-title">{"🔥"} {tx.hotUnits}</div>
          <div className="ud-card-subtitle">{tx.hotUnitsDesc}</div>
          <div className="ud-inv-hot-grid">
            {filteredHotUnits.map((u) => (
              <HotUnitCard key={u.id || u.name} unit={u} tx={tx} isZeroEngagement={isZeroEngagement(u)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      <UnitDrawer
        cat={selectedCat}
        tx={tx}
        st={st}
        formatValue={formatValue}
        onClose={() => setSelectedCat(null)}
        onCreateDeal={handleCreateDeal}
      />
    </div>
  );
}

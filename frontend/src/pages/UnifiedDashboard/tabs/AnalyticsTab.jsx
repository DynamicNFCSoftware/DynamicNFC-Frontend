import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSector } from "../../../hooks/useSector";
import { useLanguage } from "../../../i18n";
import { useDashboard } from "../DashboardDataProvider";
import AiBadge from "../components/AiBadge";
import { SkeletonCard } from "../components/LoadingSkeleton";
import SvgFunnel from "../components/SvgFunnel";
import FunnelInsightTable from "../components/FunnelInsightTable";

const UI = {
  en: {
    analytics: "Analytics",
    ai: "AI-powered insights",
    weeklyTrend: "Weekly Engagement Trend",
    weeklyTrendMeta: "Last 7 days - event count",
    trafficSources: "Traffic Sources",
    trafficSourcesMeta: "Channel share (%)",
    conversionFunnel: "Conversion Funnel",
    conversionFunnelMeta: "Data window: latest events",
    deviceBreakdown: "Device Breakdown",
    deviceBreakdownMeta: "Device share (%)",
    scoreDistribution: "Score Distribution",
    scoreDistributionMeta: "VIP count",
    interest: "Interest",
    interestMeta: "Interaction count",
    count: "count",
    percent: "%",
    totalEvents: "Total events",
    vipIntentHeatmap: "VIP Intent Heatmap",
    vipIntentMeta: "VIP interest by category",
    propertyDemandHeatmap: "Property Demand Heatmap",
    propertyDemandMeta: "Demand by unit type",
    heatmapLegendLow: "Low",
    heatmapLegendHigh: "High",
    engagementSegment: "Engagement by Segment",
    engagementSegmentMeta: "Activity by customer tier",
    vip: "VIP",
    registered: "Registered",
    anonymous: "Anonymous",
    direct: "Direct",
    referral: "Referral",
    noData: "No data yet",
  },
  ar: {
    analytics: "التحليلات",
    ai: "تحليل ذكي",
    weeklyTrend: "اتجاه المشاركة الأسبوعي",
    weeklyTrendMeta: "آخر 7 أيام - عدد الأحداث",
    trafficSources: "مصادر الزيارات",
    trafficSourcesMeta: "حصة القنوات (%)",
    conversionFunnel: "قمع التحويل",
    conversionFunnelMeta: "نطاق البيانات: آخر الأحداث",
    deviceBreakdown: "توزيع الأجهزة",
    deviceBreakdownMeta: "حصة الأجهزة (%)",
    scoreDistribution: "توزيع الدرجات",
    scoreDistributionMeta: "عدد VIP",
    interest: "الاهتمام",
    interestMeta: "عدد التفاعلات",
    count: "عدد",
    percent: "%",
    totalEvents: "إجمالي الأحداث",
    vipIntentHeatmap: "خريطة نوايا VIP",
    vipIntentMeta: "اهتمام VIP حسب الفئة",
    propertyDemandHeatmap: "خريطة الطلب العقاري",
    propertyDemandMeta: "الطلب حسب نوع الوحدة",
    heatmapLegendLow: "منخفض",
    heatmapLegendHigh: "مرتفع",
    engagementSegment: "التفاعل حسب الشريحة",
    engagementSegmentMeta: "النشاط حسب فئة العميل",
    vip: "VIP",
    registered: "مسجّل",
    anonymous: "مجهول",
    direct: "مباشر",
    referral: "إحالة",
    noData: "لا توجد بيانات بعد",
  },
  es: {
    analytics: "Analitica",
    ai: "Insights con IA",
    weeklyTrend: "Tendencia semanal de interaccion",
    weeklyTrendMeta: "Ultimos 7 dias - conteo de eventos",
    trafficSources: "Fuentes de trafico",
    trafficSourcesMeta: "Participacion por canal (%)",
    conversionFunnel: "Embudo de conversion",
    conversionFunnelMeta: "Ventana de datos: eventos recientes",
    deviceBreakdown: "Distribucion por dispositivo",
    deviceBreakdownMeta: "Participacion de dispositivos (%)",
    scoreDistribution: "Distribucion de score",
    scoreDistributionMeta: "Conteo VIP",
    interest: "Interes",
    interestMeta: "Conteo de interacciones",
    count: "conteo",
    percent: "%",
    totalEvents: "Total eventos",
    vipIntentHeatmap: "Mapa de intencion VIP",
    vipIntentMeta: "Interes VIP por categoria",
    propertyDemandHeatmap: "Mapa de demanda inmobiliaria",
    propertyDemandMeta: "Demanda por tipo de unidad",
    heatmapLegendLow: "Bajo",
    heatmapLegendHigh: "Alto",
    engagementSegment: "Interaccion por segmento",
    engagementSegmentMeta: "Actividad por nivel de cliente",
    vip: "VIP",
    registered: "Registrado",
    anonymous: "Anonimo",
    direct: "Directo",
    referral: "Referido",
    noData: "Sin datos aun",
  },
  fr: {
    analytics: "Analytique",
    ai: "Analyses IA",
    weeklyTrend: "Tendance hebdomadaire d'engagement",
    weeklyTrendMeta: "7 derniers jours - nombre d'evenements",
    trafficSources: "Sources de trafic",
    trafficSourcesMeta: "Part des canaux (%)",
    conversionFunnel: "Entonnoir de conversion",
    conversionFunnelMeta: "Fenetre: evenements recents",
    deviceBreakdown: "Repartition par appareil",
    deviceBreakdownMeta: "Part par appareil (%)",
    scoreDistribution: "Distribution des scores",
    scoreDistributionMeta: "Nombre VIP",
    interest: "Interet",
    interestMeta: "Nombre d'interactions",
    count: "nombre",
    percent: "%",
    totalEvents: "Total evenements",
    vipIntentHeatmap: "Carte d'intention VIP",
    vipIntentMeta: "Interet VIP par categorie",
    propertyDemandHeatmap: "Carte de demande immobiliere",
    propertyDemandMeta: "Demande par type de bien",
    heatmapLegendLow: "Bas",
    heatmapLegendHigh: "Eleve",
    engagementSegment: "Engagement par segment",
    engagementSegmentMeta: "Activite par niveau client",
    vip: "VIP",
    registered: "Enregistre",
    anonymous: "Anonyme",
    direct: "Direct",
    referral: "Referent",
    noData: "Aucune donnee",
  },
};

const CHART_COLORS = {
  red: "#e63946",
  blue: "#457b9d",
  navy: "#1d3557",
  amber: "#eab308",
  gold: "#b8860b",
  teal: "#2a9d8f",
  slate: "#94a3b8",
};

export default function AnalyticsTab() {
  const { config, st } = useSector();
  const { lang } = useLanguage();
  const { analytics, vips, events, loading, funnelData, engagementTimeline, heatmapData } = useDashboard();
  const tx = { ...UI.en, ...(UI[lang] || {}) };
  const categories = config.inventory?.categories || [];
  const unitTypes = (config.inventory?.typeFilters || []).filter((t) => t.id !== "all");
  const vipIntentRows = heatmapData?.vipIntent || [];
  const propertyDemandRows = heatmapData?.propertyDemand || [];
  const colTotals = heatmapData?.colTotals || {};
  const maxVipIntent = Math.max(
    ...vipIntentRows.flatMap((row) => categories.map((cat) => Number(row?.[cat.id] || 0))),
    1
  );
  const maxPropertyDemand = Math.max(
    ...propertyDemandRows.flatMap((row) => unitTypes.map((t) => Number(row?.[t.id] || 0))),
    1
  );
  const vipColTotals = {};
  categories.forEach((cat) => {
    vipColTotals[cat.id] = vipIntentRows.reduce((s, r) => s + (Number(r[cat.id]) || 0), 0);
  });
  const vipGrandTotal = Object.values(vipColTotals).reduce((s, v) => s + v, 0);
  const propGrandTotal = colTotals._total || 0;

  const trendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const arDays = ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];
    const frDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const esDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
    const pickDays = lang === "ar" ? arDays : lang === "fr" ? frDays : lang === "es" ? esDays : days;
    return (analytics.weeklyTrend || [0, 0, 0, 0, 0, 0, 0]).map((val, i) => ({
      name: pickDays[i],
      taps: val,
    }));
  }, [analytics, lang]);
  const isWeeklyEmpty = trendData.every((d) => d.taps === 0);
  const hasEngagement = (engagementTimeline || []).some((d) => d.vip > 0 || d.registered > 0 || d.anonymous > 0);

  const deviceData = useMemo(() => {
    if (!analytics.deviceBreakdown) return null;
    const palette = [CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.amber];
    return Object.entries(analytics.deviceBreakdown).map(([key, val], i) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val,
      color: palette[i % palette.length],
    }));
  }, [analytics.deviceBreakdown]);

  const scoreDistData = useMemo(() => {
    const buckets = [
      { range: "0-20", count: 0, fill: "#94a3b8" },
      { range: "21-40", count: 0, fill: "#64748b" },
      { range: "41-60", count: 0, fill: "#457b9d" },
      { range: "61-80", count: 0, fill: "#2563eb" },
      { range: "81-100", count: 0, fill: "#b8860b" },
    ];
    vips.forEach((v) => {
      const score = Number(v.score || 0);
      if (score <= 20) buckets[0].count += 1;
      else if (score <= 40) buckets[1].count += 1;
      else if (score <= 60) buckets[2].count += 1;
      else if (score <= 80) buckets[3].count += 1;
      else buckets[4].count += 1;
    });
    return buckets;
  }, [vips]);

  const categoryData = useMemo(() => {
    return config.inventory.categories.map((cat, i) => ({
      name: st(cat.name),
      interest: analytics.categoryInterest?.[cat.id] || 0,
      fill: [CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.amber, CHART_COLORS.red, CHART_COLORS.navy][i % 5],
    }));
  }, [config, analytics, st]);
  const isCategoryEmpty = categoryData.every((c) => c.interest === 0);

  const channelData = useMemo(() => {
    if (!analytics.trafficSources) return null;
    const ts = analytics.trafficSources;
    return [
      { name: "NFC", value: ts.nfc, color: CHART_COLORS.red },
      { name: tx.direct, value: ts.direct, color: CHART_COLORS.blue },
      { name: tx.referral, value: ts.referral, color: CHART_COLORS.amber },
    ];
  }, [analytics.trafficSources, tx.direct, tx.referral]);

  const customTooltip = ({ active, payload, label }, valueMode = "count") => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: "var(--ud-tooltip-bg)",
          border: "1px solid var(--ud-border)",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12,
          color: "var(--ud-tooltip-text)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        {label ? <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>{label}</div> : null}
        {payload.map((p, i) => (
          <div key={`${p.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: 6, color: p.color || p.fill }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill, display: "inline-block" }} />
            <span>{p.name}: <strong>{p.value}</strong>{valueMode === "percent" ? tx.percent : ""}</span>
          </div>
        ))}
      </div>
    );
  };

  const totalDevicePct = (deviceData || []).reduce((s, d) => s + (Number(d.value) || 0), 0);
  const totalChannelPct = (channelData || []).reduce((s, d) => s + (Number(d.value) || 0), 0);

  if (loading) {
    return (
      <div className="ud-grid-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="ud-section-label" style={{ margin: 0 }}>
          {tx.analytics}
        </div>
        <AiBadge text={tx.ai} />
      </div>

      <div className="ud-grid-2">
        <div className="ud-card">
          <div className="ud-card-title">{tx.weeklyTrend}</div>
          <div className="ud-card-subtitle">{tx.weeklyTrendMeta}</div>
          <div style={{ width: "100%", height: 240, marginTop: 12 }}>
            {isWeeklyEmpty ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ud-text-muted)", fontSize: 13 }}>
                {tx.noData}
              </div>
            ) : (
              <ResponsiveContainer minWidth={100} minHeight={100}>
                <AreaChart data={trendData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e63946" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ud-border-light)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--ud-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--ud-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={(props) => customTooltip(props, "count")} cursor={{ stroke: "var(--ud-border)", strokeDasharray: "3 3" }} />
                  <Area
                    type="monotone"
                    dataKey="taps"
                    stroke="#e63946"
                    fill="url(#trendGrad)"
                    strokeWidth={2.5}
                    activeDot={{ r: 6, fill: "#e63946", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {channelData ? (
          <div className="ud-card">
            <div className="ud-card-title">{tx.trafficSources}</div>
            <div className="ud-card-subtitle">{tx.trafficSourcesMeta}</div>
            <div style={{ position: "relative", width: "100%", height: 240, marginTop: 12 }}>
              <ResponsiveContainer minWidth={100} minHeight={100}>
                <PieChart>
                  <defs>
                    {channelData.map((d, i) => (
                      <radialGradient key={`ch-grad-${i}`} id={`chGrad-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={d.color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={d.color} stopOpacity={0.75} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="var(--ud-bg-secondary)"
                    strokeWidth={2}
                  >
                    {channelData.map((entry, i) => (
                      <Cell key={`${entry.name}-${i}`} fill={`url(#chGrad-${i})`} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => customTooltip(props, "percent")} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ud-text)", letterSpacing: "-0.5px" }}>
                  {totalChannelPct}%
                </div>
                <div style={{ fontSize: 10, color: "var(--ud-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {tx.totalEvents}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              {channelData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ud-text-secondary)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "inline-block" }} />
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                  <span style={{ color: "var(--ud-text-muted)" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="ud-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
            <div style={{ textAlign: "center", color: "var(--ud-text-muted)", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>🌐</div>
              {tx.noData}
            </div>
          </div>
        )}
      </div>

      {hasEngagement ? (
        <div className="ud-card" style={{ marginTop: 16, marginBottom: 16 }}>
          <div className="ud-card-title">{tx.engagementSegment}</div>
          <div className="ud-card-subtitle">{tx.engagementSegmentMeta}</div>
          <div style={{ width: "100%", height: 240, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={(engagementTimeline || []).map((d) => ({
                  name: lang === "ar" ? d.dayAr : d.day,
                  [tx.vip]: d.vip,
                  [tx.registered]: d.registered,
                  [tx.anonymous]: d.anonymous,
                }))}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ud-border-light)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--ud-text-muted)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--ud-text-muted)" tickLine={false} axisLine={false} />
                <Tooltip content={(props) => customTooltip(props, "count")} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
                <Line type="monotone" dataKey={tx.vip} stroke="#b8860b" strokeWidth={2.5} dot={{ r: 3, fill: "#b8860b" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey={tx.registered} stroke="#457b9d" strokeWidth={2} dot={{ r: 3, fill: "#457b9d" }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey={tx.anonymous} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="ud-card" style={{ textAlign: "center", padding: "32px 16px", color: "var(--ud-text-muted)", fontSize: 13, marginTop: 16, marginBottom: 16 }}>
          {tx.noData}
        </div>
      )}

      <div className="ud-funnel-row">
        <div className="ud-card ud-funnel-visual">
          <div className="ud-card-title">{tx.conversionFunnel}</div>
          <div className="ud-card-subtitle">
            {tx.conversionFunnelMeta} ({Math.min(events.length, 500)} {tx.count})
          </div>
          <div style={{ marginTop: 16 }}>
            <SvgFunnel data={funnelData || []} />
          </div>
        </div>
        <div className="ud-card ud-funnel-analysis">
          <div className="ud-card-title">
            {({ en: "Funnel Analysis", ar: "تحليل القمع", es: "Analisis del embudo", fr: "Analyse de l'entonnoir" }[lang] || "Funnel Analysis")}
          </div>
          <div className="ud-card-subtitle">
            {({ en: "AI-driven stage insights", ar: "تحليل ذكي لكل مرحلة", es: "Insights IA por etapa", fr: "Analyses IA par etape" }[lang] || "AI-driven stage insights")}
          </div>
          <FunnelInsightTable data={funnelData || []} />
        </div>
      </div>

      <div className="ud-grid-2">
        {vipIntentRows.length > 0 ? (
          <div className="ud-card ud-heatmap-card">
            <div className="ud-heatmap-header">
              <div>
                <div className="ud-card-title">{tx.vipIntentHeatmap}</div>
                <div className="ud-card-subtitle">{tx.vipIntentMeta}</div>
              </div>
              <HeatmapLegend labelLow={tx.heatmapLegendLow} labelHigh={tx.heatmapLegendHigh} />
            </div>
            <div className="ud-heatmap-scroll">
              <table className="ud-heatmap-table ud-heatmap-pro">
                <thead>
                  <tr>
                    <th className="ud-heatmap-corner">
                      {({ en: "VIP", ar: "كبار", es: "VIP", fr: "VIP" }[lang] || "VIP")}
                    </th>
                    {categories.map((cat) => (
                      <th key={cat.id} className="ud-heatmap-col-header">{st(cat.name)}</th>
                    ))}
                    <th className="ud-heatmap-col-header ud-heatmap-total-col">
                      {({ en: "Total", ar: "المجموع", es: "Total", fr: "Total" }[lang] || "Total")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vipIntentRows.map((row, ri) => (
                    <tr key={row.id || row.name} className={ri % 2 === 0 ? "ud-heatmap-row-even" : ""}>
                      <td className="ud-heatmap-row-label">
                        <span className="ud-heatmap-rank">{ri + 1}</span>
                        {row.name}
                      </td>
                      {categories.map((cat) => {
                        const val = Number(row?.[cat.id] || 0);
                        const intensity = val / maxVipIntent;
                        const isHigh = intensity > 0.7;
                        const isMid = intensity > 0.4;
                        return (
                          <td key={cat.id} className="ud-heatmap-cell-pro">
                            <span
                              className={`ud-heatmap-pip ${isHigh ? "ud-heatmap-pip-high" : isMid ? "ud-heatmap-pip-mid" : "ud-heatmap-pip-low"}`}
                              style={{ "--hm-intensity": intensity }}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      <td className="ud-heatmap-cell-total">{row._total || 0}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="ud-heatmap-footer-row">
                    <td className="ud-heatmap-footer-label">
                      {({ en: "Column Total", ar: "مجموع العمود", es: "Total columna", fr: "Total colonne" }[lang] || "Column Total")}
                    </td>
                    {categories.map((cat) => (
                      <td key={cat.id} className="ud-heatmap-footer-val">{vipColTotals[cat.id] || 0}</td>
                    ))}
                    <td className="ud-heatmap-footer-grand">{vipGrandTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="ud-card" style={{ textAlign: "center", padding: 32, color: "var(--ud-text-muted)", fontSize: 13 }}>
            {tx.noData}
          </div>
        )}

        {propertyDemandRows.length > 0 ? (
          <div className="ud-card ud-heatmap-card">
            <div className="ud-heatmap-header">
              <div>
                <div className="ud-card-title">{tx.propertyDemandHeatmap}</div>
                <div className="ud-card-subtitle">{tx.propertyDemandMeta}</div>
              </div>
              <HeatmapLegend labelLow={tx.heatmapLegendLow} labelHigh={tx.heatmapLegendHigh} />
            </div>
            <div className="ud-heatmap-scroll">
              <table className="ud-heatmap-table ud-heatmap-pro">
                <thead>
                  <tr>
                    <th className="ud-heatmap-corner">
                      {st(config.inventory?.categoryLabel) || ({ en: "Category", ar: "الفئة", es: "Categoría", fr: "Catégorie" }[lang] || "Category")}
                    </th>
                    {unitTypes.map((t) => (
                      <th key={t.id} className="ud-heatmap-col-header">{st(t.label)}</th>
                    ))}
                    <th className="ud-heatmap-col-header ud-heatmap-total-col">
                      {({ en: "Total", ar: "المجموع", es: "Total", fr: "Total" }[lang] || "Total")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {propertyDemandRows.map((row, ri) => (
                    <tr key={row.id || row.name} className={ri % 2 === 0 ? "ud-heatmap-row-even" : ""}>
                      <td className="ud-heatmap-row-label">
                        <span className="ud-heatmap-rank">{ri + 1}</span>
                        {row.name || st(config.inventory.categoryLabel)}
                      </td>
                      {unitTypes.map((t) => {
                        const val = Number(row?.[t.id] || 0);
                        const intensity = val / maxPropertyDemand;
                        const isHigh = intensity > 0.7;
                        const isMid = intensity > 0.4;
                        return (
                          <td key={t.id} className="ud-heatmap-cell-pro">
                            <span
                              className={`ud-heatmap-pip ud-heatmap-pip-green ${isHigh ? "ud-heatmap-pip-high" : isMid ? "ud-heatmap-pip-mid" : "ud-heatmap-pip-low"}`}
                              style={{ "--hm-intensity": intensity }}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                      <td className="ud-heatmap-cell-total">{row._total || 0}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="ud-heatmap-footer-row">
                    <td className="ud-heatmap-footer-label">
                      {({ en: "Column Total", ar: "مجموع العمود", es: "Total columna", fr: "Total colonne" }[lang] || "Column Total")}
                    </td>
                    {unitTypes.map((t) => (
                      <td key={t.id} className="ud-heatmap-footer-val">{colTotals[t.id] || 0}</td>
                    ))}
                    <td className="ud-heatmap-footer-grand">{propGrandTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div className="ud-card" style={{ textAlign: "center", padding: 32, color: "var(--ud-text-muted)", fontSize: 13 }}>
            {tx.noData}
          </div>
        )}
      </div>

      <div className="ud-grid-3">
        {deviceData ? (
          <div className="ud-card">
            <div className="ud-card-title">{tx.deviceBreakdown}</div>
            <div className="ud-card-subtitle">{tx.deviceBreakdownMeta}</div>
            <div style={{ position: "relative", width: "100%", height: 220, marginTop: 12 }}>
              <ResponsiveContainer minWidth={100} minHeight={100}>
                <PieChart>
                  <defs>
                    {deviceData.map((d, i) => (
                      <radialGradient key={`dv-grad-${i}`} id={`dvGrad-${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={d.color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={d.color} stopOpacity={0.75} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--ud-bg-secondary)"
                    strokeWidth={2}
                  >
                    {deviceData.map((entry, i) => (
                      <Cell key={`${entry.name}-${i}`} fill={`url(#dvGrad-${i})`} />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => customTooltip(props, "percent")} />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ud-text)", letterSpacing: "-0.5px" }}>
                  {totalDevicePct}%
                </div>
                <div style={{ fontSize: 9, color: "var(--ud-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {tx.totalEvents}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              {deviceData.map((d) => (
                <span key={d.name} style={{ fontSize: 11, color: "var(--ud-text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, display: "inline-block" }} />
                  <span style={{ fontWeight: 500 }}>{d.name}</span>
                  <span style={{ color: "var(--ud-text-muted)" }}>{d.value}%</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="ud-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
            <div style={{ textAlign: "center", color: "var(--ud-text-muted)", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>📱</div>
              {tx.noData}
            </div>
          </div>
        )}

        <div className="ud-card">
          <div className="ud-card-title">{tx.scoreDistribution}</div>
          <div className="ud-card-subtitle">{tx.scoreDistributionMeta}</div>
          <div style={{ width: "100%", height: 220, marginTop: 12 }}>
            <ResponsiveContainer minWidth={100} minHeight={100}>
              <BarChart data={scoreDistData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  {scoreDistData.map((d, i) => (
                    <linearGradient key={`sc-grad-${i}`} id={`scGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={d.fill} stopOpacity={1} />
                      <stop offset="100%" stopColor={d.fill} stopOpacity={0.55} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ud-border-light)" vertical={false} />
                <XAxis dataKey="range" stroke="var(--ud-text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--ud-text-muted)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={(props) => customTooltip(props, "count")} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreDistData.map((d, i) => (
                    <Cell key={`cell-sc-${i}`} fill={`url(#scGrad-${i})`} />
                  ))}
                  <LabelList dataKey="count" position="top" fill="var(--ud-text-secondary)" fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-title">
            {st(config.inventory.categoryLabel)} {tx.interest}
          </div>
          <div className="ud-card-subtitle">{tx.interestMeta}</div>
          <div style={{ width: "100%", height: 220, marginTop: 12 }}>
            {isCategoryEmpty ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ud-text-muted)", fontSize: 13 }}>
                {tx.noData}
              </div>
            ) : (
              <ResponsiveContainer minWidth={100} minHeight={100}>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 8, right: 32, left: 4, bottom: 0 }}>
                  <defs>
                    {categoryData.map((d, i) => (
                      <linearGradient key={`cat-grad-${i}`} id={`catGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={d.fill} stopOpacity={0.55} />
                        <stop offset="100%" stopColor={d.fill} stopOpacity={1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ud-border-light)" horizontal={false} />
                  <XAxis type="number" stroke="var(--ud-text-muted)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={90} stroke="var(--ud-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={(props) => customTooltip(props, "count")} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="interest" radius={[0, 6, 6, 0]}>
                    {categoryData.map((d, i) => (
                      <Cell key={`cell-cat-${i}`} fill={`url(#catGrad-${i})`} />
                    ))}
                    <LabelList dataKey="interest" position="right" fill="var(--ud-text-secondary)" fontSize={11} fontWeight={600} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatmapLegend({ labelLow, labelHigh }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--ud-text-muted)" }}>
      <span>{labelLow}</span>
      <span
        style={{
          width: 64,
          height: 8,
          borderRadius: 4,
          background: "linear-gradient(90deg, rgba(69,123,157,0.15), rgba(69,123,157,0.95))",
          display: "inline-block",
        }}
      />
      <span>{labelHigh}</span>
    </div>
  );
}
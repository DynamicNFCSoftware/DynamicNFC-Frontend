import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useDashboard } from "../DashboardDataProvider";
import ActivityFeed from "../components/ActivityFeed";
import AiBadge from "../components/AiBadge";
import CallQueue from "../components/CallQueue";
import KpiCard from "../components/KpiCard";
import MiniSparkline from "../components/MiniSparkline";
import { SkeletonCard, SkeletonKPIs } from "../components/LoadingSkeleton";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const UI = {
  en: {
    section: "Overview",
    execTitle: "Executive Summary",
    execSub: "VIP conversions are significantly higher than standard visitors",
    conversionActions: "Conversion Actions",
    vipVsStandard: "VIP vs Standard visitors",
    liveActivity: "Live Activity",
    recentEvents: "Recent events",
    hotLeads: "Hot Leads",
    activeAlerts: "Active Alerts",
    avgLeadScore: "Avg Lead Score",
    ai: "Powered by DynamicNFC Intelligence",
    now: "just now",
    minute: "m ",
    hour: "h ",
    day: "d ",
    ago: "ago",
    empty: "No recent activity",
    unitCount: "count",
    chartWindow: "Data window",
    last500Events: "latest events",
    conversionLegendVip: "VIP",
    conversionLegendStandard: "Standard",
    conversionHint: "Each row compares VIP vs non-VIP counts for the same action.",
    liveWindow: "New events (10m)",
    noConversionData: "No conversion actions yet",
    todayWorkflow: "Today's workflow",
  },
  ar: {
    section: "نظرة عامة",
    execTitle: "ملخص تنفيذي",
    execSub: "تحويلات VIP أعلى من الزوار العاديين",
    conversionActions: "إجراءات التحويل",
    vipVsStandard: "VIP مقابل الزوار العاديين",
    liveActivity: "النشاط المباشر",
    recentEvents: "آخر الأحداث",
    hotLeads: "عملاء ساخنون",
    activeAlerts: "تنبيهات نشطة",
    avgLeadScore: "متوسط درجة العميل",
    ai: "مدعوم بذكاء DynamicNFC",
    now: "الآن",
    minute: "د ",
    hour: "س ",
    day: "ي ",
    ago: "",
    empty: "لا يوجد نشاط حديث",
    unitCount: "عدد",
    chartWindow: "نطاق البيانات",
    last500Events: "آخر الأحداث",
    conversionLegendVip: "VIP",
    conversionLegendStandard: "عادي",
    conversionHint: "كل صف يقارن عدد أحداث VIP مقابل غير VIP لنفس الإجراء.",
    liveWindow: "أحداث جديدة (10د)",
    noConversionData: "لا توجد إجراءات تحويل بعد",
    todayWorkflow: "مهام اليوم",
  },
  es: {
    section: "Vista general",
    execTitle: "Resumen ejecutivo",
    execSub: "Las conversiones VIP son mayores que las de visitantes estandar",
    conversionActions: "Acciones de conversion",
    vipVsStandard: "VIP vs visitantes estandar",
    liveActivity: "Actividad en vivo",
    recentEvents: "Eventos recientes",
    hotLeads: "Leads calientes",
    activeAlerts: "Alertas activas",
    avgLeadScore: "Promedio de score",
    ai: "Impulsado por DynamicNFC Intelligence",
    now: "ahora",
    minute: "m ",
    hour: "h ",
    day: "d ",
    ago: "hace",
    empty: "Sin actividad reciente",
    unitCount: "conteo",
    chartWindow: "Ventana de datos",
    last500Events: "eventos recientes",
    conversionLegendVip: "VIP",
    conversionLegendStandard: "Estandar",
    conversionHint: "Cada fila compara conteos VIP vs no VIP para la misma accion.",
    liveWindow: "Eventos nuevos (10m)",
    noConversionData: "Aun no hay acciones de conversion",
    todayWorkflow: "Flujo de hoy",
  },
  fr: {
    section: "Vue générale",
    execTitle: "Résumé exécutif",
    execSub: "Les conversions VIP sont plus élevées que les visiteurs standards",
    conversionActions: "Actions de conversion",
    vipVsStandard: "VIP vs visiteurs standards",
    liveActivity: "Activité en direct",
    recentEvents: "Événements récents",
    hotLeads: "Leads chauds",
    activeAlerts: "Alertes actives",
    avgLeadScore: "Score moyen lead",
    ai: "Propulsé par DynamicNFC Intelligence",
    now: "maintenant",
    minute: "m ",
    hour: "h ",
    day: "j ",
    ago: "il y a",
    empty: "Aucune activité récente",
    unitCount: "compte",
    chartWindow: "Fenêtre de données",
    last500Events: "événements récents",
    conversionLegendVip: "VIP",
    conversionLegendStandard: "Standard",
    conversionHint: "Chaque ligne compare les volumes VIP vs non VIP pour la même action.",
    liveWindow: "Nouveaux événements (10m)",
    noConversionData: "Aucune action de conversion pour le moment",
    todayWorkflow: "Flux du jour",
  },
  tr: {
    todayWorkflow: "Bugunun is akisi",
  },
};

export default function OverviewTab() {
  const { config, st } = useSector();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [feedFilter, setFeedFilter] = useState("all");
  const { kpis, events, vips, analytics, loading, sparklines, feedCounts, callQueue, alerts } = useDashboard();
  const tx = { ...UI.en, ...(UI[lang] || {}) };

  const labelCategory = st(config.inventory.categoryLabel).toLowerCase();

  const hasAlertActivity = (alerts?.hotLeads || 0) > 0 || (alerts?.activeAlerts || 0) > 0;
  const conversionWindowText = `${tx.chartWindow}: ${Math.min(events.length, 500)} ${tx.last500Events}`;
  const FEED_FILTERS = [
    { id: "all", label: { en: "All", ar: "الكل", es: "Todos", fr: "Tous" } },
    { id: "vip", label: { en: "VIP", ar: "VIP", es: "VIP", fr: "VIP" } },
    { id: "registered", label: { en: "Registered", ar: "مسجّل", es: "Registrado", fr: "Enregistré" } },
    { id: "lead", label: { en: "Lead", ar: "عميل", es: "Lead", fr: "Lead" } },
    { id: "anonymous", label: { en: "Anonymous", ar: "مجهول", es: "Anonimo", fr: "Anonyme" } },
  ];
  const filteredEvents = useMemo(() => {
    if (feedFilter === "all") return events;
    return events.filter((e) => {
      const pType = e.portalType || (e.isVip ? "vip" : "anonymous");
      return pType === feedFilter;
    });
  }, [events, feedFilter]);
  const conversionBars = useMemo(() => {
    const conv = analytics?.conv || {};
    const rows = [
      { label: { en: "Unit viewed", ar: "عرض الوحدة", es: "Unidad vista", fr: "Unité consultée" }, keys: ["view_unit", "vehicle_view", "unit_detail_opened", "vehicle_detail_opened"] },
      { label: { en: "Pricing / quote", ar: "السعر / العرض", es: "Precio / cotizacion", fr: "Tarif / devis" }, keys: ["request_pricing", "request_quote", "pricing_request", "quote_request"] },
      { label: { en: "Brochure", ar: "البروشور", es: "Folleto", fr: "Brochure" }, keys: ["download_brochure", "brochure_download"] },
      { label: { en: "Booking", ar: "الحجز", es: "Reserva", fr: "Réservation" }, keys: ["book_viewing", "test_drive_request"] },
      { label: { en: "Contact agent", ar: "تواصل مع الوكيل", es: "Contactar asesor", fr: "Contacter conseiller" }, keys: ["contact_agent", "contact_advisor"] },
    ];
    return rows
      .map((row) => {
        const vip = row.keys.reduce((sum, key) => sum + Number(conv[key]?.vip || 0), 0);
        const standard = row.keys.reduce((sum, key) => sum + Number(conv[key]?.std || 0), 0);
        return { name: row.label[lang] || row.label.en, vip, standard, total: vip + standard };
      })
      .filter((row) => row.total > 0);
  }, [analytics, lang]);
  const liveEvents10m = useMemo(() => {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    return events.filter((e) => new Date(e.timestamp).getTime() >= tenMinutesAgo).length;
  }, [events]);
  const WORKFLOW_STEPS = [
    {
      id: "hot",
      label: { en: "Review hot leads", ar: "مراجعة العملاء الساخنين", es: "Revisar leads calientes", fr: "Vérifier les leads chauds" },
      action: () => navigate("/unified/priority"),
      check: () => (callQueue?.length || 0) === 0,
    },
    {
      id: "idle",
      label: { en: "Check idle VIPs", ar: "تحقق من VIP الخاملين", es: "Revisar VIP inactivos", fr: "Vérifier les VIP inactifs" },
      action: () => navigate("/unified/vip-crm"),
      check: () => !(vips || []).some((v) => v.atRisk),
    },
    {
      id: "outreach",
      label: { en: "Send outreach to triggered contacts", ar: "تواصل مع جهات الاتصال المنبهة", es: "Contactar leads activados", fr: "Contacter les leads déclenchés" },
      action: null,
      check: () => false,
    },
    {
      id: "pipeline",
      label: { en: "Update pipeline stages", ar: "تحديث مراحل خط الأنابيب", es: "Actualizar etapas del pipeline", fr: "Mettre à jour les étapes pipeline" },
      action: () => navigate("/unified/pipeline"),
      check: () => false,
    },
  ];
  const getKpiStoryLabel = (kpiId, value) => {
    const stories = {
      vip_sessions: {
        en: value > 0 ? `${value} people identified by NFC` : "No NFC-identified visitors yet",
        ar: value > 0 ? `${value} شخص تم التعرف عليهم عبر NFC` : "لا يوجد زوار معرّفين بعد",
        es: value > 0 ? `${value} personas identificadas por NFC` : "Aun no hay visitantes identificados por NFC",
        fr: value > 0 ? `${value} personnes identifiées par NFC` : "Aucun visiteur identifié NFC pour le moment",
      },
      website_visitors: {
        en: value > 0 ? `${value} total portal interactions` : "Awaiting first portal visit",
        ar: value > 0 ? `${value} تفاعل إجمالي` : "في انتظار أول زيارة",
        es: value > 0 ? `${value} interacciones totales en portales` : "Esperando la primera visita al portal",
        fr: value > 0 ? `${value} interactions totales sur les portails` : "En attente de la première visite portail",
      },
      bookings: {
        en: value > 0
          ? `${value} ${config.id === "automotive" ? "test drives" : "viewings"} booked this period`
          : config.id === "automotive" ? "Awaiting test-drive bookings" : "Awaiting property inquiry data",
        ar: value > 0
          ? `${value} ${config.id === "automotive" ? "تجربة قيادة" : "معاينة"} محجوزة`
          : config.id === "automotive" ? "في انتظار حجوزات تجربة القيادة" : "في انتظار بيانات الاستفسار العقاري",
        es: value > 0
          ? `${value} ${config.id === "automotive" ? "pruebas de manejo" : "visitas"} reservadas`
          : config.id === "automotive" ? "Esperando pruebas de manejo" : "Esperando consultas de propiedades",
        fr: value > 0
          ? `${value} ${config.id === "automotive" ? "essais routiers" : "visites"} réservées`
          : config.id === "automotive" ? "En attente d'essais routiers" : "En attente de demandes immobilières",
      },
      conversion_lift: {
        en: value > 0
          ? `VIP converts ${value}x faster`
          : config.id === "automotive" ? "Awaiting test-drive conversion data" : "Awaiting property conversion data",
        ar: value > 0
          ? `VIP يتحول أسرع بـ ${value}x`
          : config.id === "automotive" ? "في انتظار بيانات تحويل تجربة القيادة" : "في انتظار بيانات التحويل العقاري",
        es: value > 0
          ? `VIP convierte ${value}x mas rapido`
          : config.id === "automotive" ? "Esperando datos de conversion de pruebas" : "Esperando datos de conversion inmobiliaria",
        fr: value > 0
          ? `VIP convertit ${value}x plus vite`
          : config.id === "automotive" ? "En attente de données de conversion essais" : "En attente de données de conversion immobilière",
      },
    };
    const kpiMeta = config.kpis.find((k) => k.id === kpiId);
    return stories[kpiId]?.[lang] || (kpiMeta ? st(kpiMeta.subtitle) : "");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
        <div style={{ width: "100%" }}>
          <SkeletonKPIs />
          <div className="ud-grid-2" style={{ marginTop: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ud-tab-overview">
      <div className="ud-section-label">{tx.section}</div>

      <div className="ud-grid-4">
        {config.kpis.map((kpi) => {
          const value = kpis[kpi.id] || 0;
          if (kpi.id === "conversion_lift" && (!value || Number.isNaN(value))) {
            return (
              <KpiCard
                key={kpi.id}
                label={st(kpi.label)}
                value={0}
                subtitle={getKpiStoryLabel(kpi.id, 0)}
                color={kpi.color}
                displayOverride="—"
                sparkline={<MiniSparkline data={sparklines?.[kpi.id]} color={kpi.color} />}
              />
            );
          }
          return (
            <KpiCard
              key={kpi.id}
              label={st(kpi.label)}
              value={value}
              subtitle={getKpiStoryLabel(kpi.id, value)}
              color={kpi.color}
              suffix={kpi.id === "conversion_lift" ? "×" : ""}
              sparkline={<MiniSparkline data={sparklines?.[kpi.id]} color={kpi.color} />}
            />
          );
        })}
      </div>

      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div className="ud-card-title">{tx.execTitle}</div>
            <div className="ud-card-subtitle">
              {kpis.conversion_lift > 0
                ? ({
                    ar: `تحويلات VIP أعلى بـ ${kpis.conversion_lift}× من الزوار العاديين`,
                    es: `Las conversiones VIP son ${kpis.conversion_lift}× mas altas que las estandar`,
                    en: `VIP conversions are ${kpis.conversion_lift}× higher than standard visitors`,
                    fr: `Les conversions VIP sont ${kpis.conversion_lift}× plus élevées que le standard`,
                  }[lang] || `VIP conversions are ${kpis.conversion_lift}× higher than standard visitors`)
                : ({
                    ar: "في انتظار بيانات كافية لحساب معدل التحويل",
                    es: "Esperando datos suficientes para calcular el lift de conversion",
                    en: "Awaiting sufficient data to calculate conversion lift",
                    fr: "En attente de données suffisantes pour calculer le lift de conversion",
                  }[lang] || "Awaiting sufficient data to calculate conversion lift")}
            </div>
          </div>
          <AiBadge text={tx.ai} />
        </div>
      </div>

      <CallQueue queue={callQueue || []} onOutreach={() => navigate("/unified/vip-crm")} />
      <div className="ud-card ud-workflow" style={{ marginTop: 16 }}>
        <div className="ud-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>📋</span>
          {tx.todayWorkflow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
          {WORKFLOW_STEPS.map((step, i) => {
            const done = step.check();
            return (
              <div
                key={step.id}
                onClick={step.action || undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: step.action ? "pointer" : "default",
                  background: done ? "var(--ud-card-hover)" : "transparent",
                  opacity: done ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `1.5px solid ${done ? "#22c55e" : "var(--ud-border)"}`,
                    background: done ? "#22c55e" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    textDecoration: done ? "line-through" : "none",
                    color: done ? "var(--ud-text-muted)" : "var(--ud-text)",
                  }}
                >
                  {step.label[lang] || step.label.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ud-grid-2">
        <div className="ud-card">
          <div className="ud-card-title">{tx.conversionActions}</div>
          <div className="ud-card-subtitle">{tx.vipVsStandard}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--ud-text-muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "#b8860b" }} />
                {tx.conversionLegendVip}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "#457b9d" }} />
                {tx.conversionLegendStandard}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--ud-text-muted)" }}>
              {tx.liveWindow}: <strong style={{ color: "var(--ud-text)" }}>{liveEvents10m}</strong>
            </div>
          </div>
          <div style={{ width: "100%", height: 180, marginTop: 8 }}>
            {conversionBars.length === 0 ? (
              <div style={{ textAlign: "center", padding: "42px 0", color: "var(--ud-text-muted)", fontSize: 13 }}>{tx.noConversionData}</div>
            ) : (
              <ResponsiveContainer minWidth={100} minHeight={100}>
                <BarChart data={conversionBars} layout="vertical">
                  <XAxis type="number" stroke="var(--ud-text-muted)" fontSize={10} />
                  <YAxis dataKey="name" type="category" width={110} stroke="var(--ud-text-muted)" fontSize={11} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div
                          style={{
                            background: "var(--ud-tooltip-bg)",
                            border: "1px solid var(--ud-border)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            fontSize: 12,
                            color: "var(--ud-tooltip-text)",
                          }}
                        >
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
                          {payload.map((p, i) => (
                            <div key={`${p.name}-${i}`} style={{ color: p.color || p.fill }}>
                              {p.name}: {p.value} {tx.unitCount}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="vip" fill="#b8860b" radius={[0, 4, 4, 0]} barSize={8} name="VIP" />
                  <Bar dataKey="standard" fill="#457b9d" radius={[0, 4, 4, 0]} barSize={8} name="Standard" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="ud-card-subtitle" style={{ marginTop: 6 }}>
            {conversionWindowText}
          </div>
          <div className="ud-card-subtitle" style={{ marginTop: 2 }}>
            {tx.conversionHint}
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-title">{tx.liveActivity}</div>
          <div className="ud-card-subtitle">{tx.recentEvents}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {FEED_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFeedFilter(f.id)}
                type="button"
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: feedFilter === f.id ? 500 : 400,
                  border: `0.5px solid ${feedFilter === f.id ? "var(--ud-accent)" : "var(--ud-border)"}`,
                  borderRadius: 20,
                  background: feedFilter === f.id ? "var(--ud-accent-bg)" : "transparent",
                  color: feedFilter === f.id ? "var(--ud-accent)" : "var(--ud-text-muted)",
                  cursor: "pointer",
                }}
              >
                {f.label[lang] || f.label.en}
                <span style={{ marginInlineStart: 4, opacity: 0.6, fontSize: 10 }}>{feedCounts?.[f.id] || 0}</span>
              </button>
            ))}
          </div>
          <ActivityFeed events={filteredEvents} labels={tx} lang={lang} />
        </div>
      </div>

      {hasAlertActivity ? (
        <div className="ud-grid-3" style={{ marginTop: 16 }}>
          <div className="ud-card" style={{ textAlign: "center" }}>
            <div className="ud-kpi-value" style={{ color: "#e63946" }}>{alerts?.hotLeads || 0}</div>
            <div className="ud-kpi-label">{tx.hotLeads}</div>
          </div>
          <div className="ud-card" style={{ textAlign: "center" }}>
            <div className="ud-kpi-value" style={{ color: "#eab308" }}>{alerts?.activeAlerts || 0}</div>
            <div className="ud-kpi-label">{tx.activeAlerts}</div>
          </div>
          <div className="ud-card" style={{ textAlign: "center" }}>
            <div className="ud-kpi-value" style={{ color: "#457b9d" }}>{alerts?.avgScore || 0}</div>
            <div className="ud-kpi-label">{tx.avgLeadScore}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
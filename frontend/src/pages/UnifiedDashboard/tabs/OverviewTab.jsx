import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, useTranslation } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import { useRegion } from "../../../hooks/useRegion";
import { getEffectiveLocale } from "../../../config/regionConfig";
import { getEventLabel } from "../../../i18n/eventDisplayMap";
import { useDashboard } from "../useDashboard";
import ActivityFeed from "../components/ActivityFeed";
import AiBadge from "../components/AiBadge";
import CallQueue from "../components/CallQueue";
import DateRangePicker from "../components/DateRangePicker";
import KpiCard from "../components/KpiCard";
import MiniSparkline from "../components/MiniSparkline";
import { SkeletonCard, SkeletonKPIs } from "../components/LoadingSkeleton";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const WEEKLY_RANGE_KEY = "ud_overview_weeklyTrend_dateRange";
const WEEK_PRESETS = ["last4w", "last8w", "last12w", "custom"];
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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
    weeklyTrend: {
      title: "Last 8 Weeks",
      realEstate: { vip: "VIP Taps", standard: "Public Taps" },
      automotive: { vip: "VIP Sessions", standard: "Standard Sessions" },
      yacht: { vip: "VIP Inquiries", standard: "Public Inquiries" },
      empty: {
        title: "Not enough data yet",
        desc: "Tap events will appear here as your VIP invitees engage.",
      },
    },
    topConfigs: {
      title: "Top Saved Configurations",
      saves: "saves",
      empty: "No saved configurations yet",
      unknown: "Unknown configuration",
    },
    kpiNfcRoi: "NFC ROI",
    kpiAvgSession: "Avg. VIP Session",
    kpiNfcRoiSub: "Closed value vs card cost",
    kpiAvgSessionSub: "Identified visitor sessions",
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
    weeklyTrend: {
      title: "آخر 8 أسابيع",
      realEstate: { vip: "نقرات VIP", standard: "نقرات عامة" },
      automotive: { vip: "جلسات VIP", standard: "جلسات عادية" },
      yacht: { vip: "استفسارات VIP", standard: "استفسارات عامة" },
      empty: {
        title: "لا توجد بيانات كافية بعد",
        desc: "ستظهر أحداث النقر هنا عند تفاعل المدعوين من كبار الشخصيات.",
      },
    },
    topConfigs: {
      title: "أكثر التكوينات المحفوظة",
      saves: "حفظ",
      empty: "لا توجد تكوينات محفوظة بعد",
      unknown: "تكوين غير معروف",
    },
    kpiNfcRoi: "عائد NFC",
    kpiAvgSession: "متوسط جلسة VIP",
    kpiNfcRoiSub: "القيمة المغلقة مقابل تكلفة البطاقات",
    kpiAvgSessionSub: "جلسات الزوار المعروفين",
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
    weeklyTrend: {
      title: "Últimas 8 semanas",
      realEstate: { vip: "Toques VIP", standard: "Toques públicos" },
      automotive: { vip: "Sesiones VIP", standard: "Sesiones estándar" },
      yacht: { vip: "Consultas VIP", standard: "Consultas públicas" },
      empty: {
        title: "Aún no hay suficientes datos",
        desc: "Los eventos aparecerán aquí a medida que interactúen tus invitados VIP.",
      },
    },
    topConfigs: {
      title: "Configuraciones más guardadas",
      saves: "guardados",
      empty: "Aún no hay configuraciones guardadas",
      unknown: "Configuración desconocida",
    },
    kpiNfcRoi: "ROI NFC",
    kpiAvgSession: "Sesión VIP promedio",
    kpiNfcRoiSub: "Valor cerrado vs costo de tarjetas",
    kpiAvgSessionSub: "Sesiones de visitantes identificados",
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
    weeklyTrend: {
      title: "8 dernières semaines",
      realEstate: { vip: "Interactions VIP", standard: "Interactions publiques" },
      automotive: { vip: "Sessions VIP", standard: "Sessions standard" },
      yacht: { vip: "Demandes VIP", standard: "Demandes publiques" },
      empty: {
        title: "Pas assez de données pour l'instant",
        desc: "Les événements d'interaction apparaîtront ici au fur et à mesure que vos invités VIP s'engagent.",
      },
    },
    topConfigs: {
      title: "Configurations les plus sauvegardées",
      saves: "sauvegardes",
      empty: "Aucune configuration sauvegardée",
      unknown: "Configuration inconnue",
    },
    kpiNfcRoi: "ROI NFC",
    kpiAvgSession: "Session VIP moy.",
    kpiNfcRoiSub: "Valeur clôturée vs coût des cartes",
    kpiAvgSessionSub: "Sessions de visiteurs identifiés",
  },
  tr: {
    todayWorkflow: "Bugunun is akisi",
  },
};

const resolveWeeklyRange = (value) => {
  const now = Date.now();
  const preset = value?.preset || "last8w";
  if (preset !== "custom") {
    const days = preset === "last4w" ? 28 : preset === "last12w" ? 84 : 56;
    const fromDate = new Date(now - (days - 1) * 86400000);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(now);
    toDate.setHours(23, 59, 59, 999);
    return { preset, from: null, to: null, fromTs: fromDate.getTime(), toTs: toDate.getTime() };
  }
  const fromTs = value?.from ? new Date(`${value.from}T00:00:00`).getTime() : null;
  const toTs = value?.to ? new Date(`${value.to}T23:59:59.999`).getTime() : null;
  return { preset: "custom", from: value?.from || null, to: value?.to || null, fromTs, toTs };
};

function WeeklyTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  const displayLabel = formatter ? formatter(label) : label;
  return (
    <div className="ud-weekly-tooltip">
      <div className="ud-weekly-tooltip__label">{displayLabel}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="ud-weekly-tooltip__row">
          <span className="ud-weekly-tooltip__swatch" style={{ backgroundColor: p.color }} />
          <span className="ud-weekly-tooltip__name">{p.name}</span>
          <span className="ud-weekly-tooltip__value">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(totalMs) {
  if (!Number.isFinite(totalMs) || totalMs <= 0) return "—";
  const totalSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function OverviewTab() {
  const { config, st } = useSector();
  const { region, regionId } = useRegion();
  const { lang } = useLanguage();
  const tActivity = useTranslation("activityFeed");
  const navigate = useNavigate();
  const [feedFilter, setFeedFilter] = useState("all");
  const [weeklyTrendRange, setWeeklyTrendRange] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WEEKLY_RANGE_KEY) || "{}");
      return resolveWeeklyRange(saved?.preset ? saved : { preset: "last8w" });
    } catch {
      return resolveWeeklyRange({ preset: "last8w" });
    }
  });
  const { kpis, events, vips, deals, cards, analytics, loading, sparklines, feedCounts, callQueue, alerts } = useDashboard();
  const tx = { ...UI.en, ...(UI[lang] || {}) };
  const locale = getEffectiveLocale(regionId, lang);
  const dateTickFormatter = (value) => new Date(value).toLocaleDateString(locale, { month: "short", day: "numeric" });
  const weeklyTrendLabels = tx.weeklyTrend?.[config.id] || tx.weeklyTrend?.realEstate;
  const accentColor = region?.sidebarAccent || "var(--ud-accent)";

  const labelCategory = st(config.inventory.categoryLabel).toLowerCase();

  const hasAlertActivity = (alerts?.hotLeads || 0) > 0 || (alerts?.activeAlerts || 0) > 0;
  const nfcRoiDisplay = useMemo(() => {
    const totalDealValueClosed = (deals || [])
      .filter((deal) => ["closed", "closed_won"].includes(String(deal?.stage || "").toLowerCase()))
      .reduce((sum, deal) => sum + Number(deal?.value || 0), 0);
    const cardsIssued = Array.isArray(cards) ? cards.length : 0;
    const nfcCardCost = 25;
    if (!cardsIssued || !totalDealValueClosed) return "—";
    const ratio = totalDealValueClosed / (cardsIssued * nfcCardCost);
    return Number.isFinite(ratio) && ratio > 0 ? `${ratio.toFixed(1)}x` : "—";
  }, [cards, deals]);
  const avgSessionDisplay = useMemo(() => {
    const sessions = {};
    events.forEach((event) => {
      const ts = new Date(event.timestamp).getTime();
      if (!Number.isFinite(ts)) return;
      if (String(event.portalType || "").toLowerCase() === "anonymous") return;
      const identity = event.vipName || event.userName || event.leadName || event.sessionId;
      if (!identity) return;
      const sessionKey =
        `${event.portalType || "named"}:${identity}:${new Date(ts).toDateString()}`;
      if (!sessions[sessionKey]) sessions[sessionKey] = { min: ts, max: ts };
      if (ts < sessions[sessionKey].min) sessions[sessionKey].min = ts;
      if (ts > sessions[sessionKey].max) sessions[sessionKey].max = ts;
    });
    const durations = Object.values(sessions)
      .map((session) => Math.max(0, session.max - session.min))
      .filter((duration) => duration > 0);
    if (durations.length === 0) return "—";
    const avgMs = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    return formatDuration(avgMs);
  }, [events]);
  const conversionWindowText = `${tx.chartWindow}: ${Math.min(events.length, 500)} ${tx.last500Events}`;
  const FEED_FILTERS = [
    { id: "all", label: { en: "All", ar: "الكل", es: "Todos", fr: "Tous" } },
    { id: "vip", label: { en: tActivity("personLabels.vip"), ar: tActivity("personLabels.vip"), es: tActivity("personLabels.vip"), fr: tActivity("personLabels.vip") } },
    { id: "registered", label: { en: tActivity("personLabels.registered"), ar: tActivity("personLabels.registered"), es: tActivity("personLabels.registered"), fr: tActivity("personLabels.registered") } },
    { id: "lead", label: { en: tActivity("personLabels.lead"), ar: tActivity("personLabels.lead"), es: tActivity("personLabels.lead"), fr: tActivity("personLabels.lead") } },
    { id: "anonymous", label: { en: tActivity("personLabels.anonymous"), ar: tActivity("personLabels.anonymous"), es: tActivity("personLabels.anonymous"), fr: tActivity("personLabels.anonymous") } },
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
      { id: "view_unit", label: { en: "Unit viewed", ar: "عرض الوحدة", es: "Unidad vista", fr: "Unité consultée" }, keys: ["view_unit", "vehicle_view", "unit_detail_opened", "vehicle_detail_opened"] },
      { id: "request_pricing", label: { en: "Pricing / quote", ar: "السعر / العرض", es: "Precio / cotizacion", fr: "Tarif / devis" }, keys: ["request_pricing", "request_quote", "pricing_request", "quote_request"] },
      { id: "download_brochure", label: { en: "Brochure", ar: "البروشور", es: "Folleto", fr: "Brochure" }, keys: ["download_brochure", "brochure_download"] },
      { id: "book_viewing", label: { en: "Booking", ar: "الحجز", es: "Reserva", fr: "Réservation" }, keys: ["book_viewing", "test_drive_request"] },
      { id: "contact_agent", label: { en: "Contact agent", ar: "تواصل مع الوكيل", es: "Contactar asesor", fr: "Contacter conseiller" }, keys: ["contact_agent", "contact_advisor"] },
    ];
    return rows
      .map((row) => {
        const vip = row.keys.reduce((sum, key) => sum + Number(conv[key]?.vip || 0), 0);
        const standard = row.keys.reduce((sum, key) => sum + Number(conv[key]?.std || 0), 0);
        const mappedLabel = getEventLabel(row.id, lang, config.id);
        return { id: row.id, name: mappedLabel || row.label[lang] || row.label.en, vip, standard, total: vip + standard, keys: row.keys };
      })
      .filter((row) => row.total > 0);
  }, [analytics, lang, config.id]);
  const actionSparklineRows = useMemo(() => {
    const DAYS = 7;
    const now = Date.now();
    return conversionBars.map((row) => {
      const series = new Array(DAYS).fill(0);
      events.forEach((event) => {
        const eventType = String(event.type || event.event || "").toLowerCase();
        if (!row.keys.includes(eventType)) return;
        const ts = new Date(event.timestamp).getTime();
        if (!Number.isFinite(ts)) return;
        const dayAge = Math.floor((now - ts) / 86400000);
        if (dayAge >= 0 && dayAge < DAYS) {
          series[DAYS - 1 - dayAge] += 1;
        }
      });
      return { ...row, series };
    });
  }, [conversionBars, events]);
  const liveEvents10m = useMemo(() => {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    return events.filter((e) => new Date(e.timestamp).getTime() >= tenMinutesAgo).length;
  }, [events]);

  useEffect(() => {
    localStorage.setItem(
      WEEKLY_RANGE_KEY,
      JSON.stringify({ preset: weeklyTrendRange?.preset || "last8w", from: weeklyTrendRange?.from || null, to: weeklyTrendRange?.to || null })
    );
  }, [weeklyTrendRange]);

  const weeklyTrendData = useMemo(() => {
    const fromTs = weeklyTrendRange?.fromTs;
    const toTs = weeklyTrendRange?.toTs;
    if (!fromTs || !toTs || toTs < fromTs) return [];
    const getWeekStart = (timestamp) => {
      const d = new Date(timestamp);
      const day = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };
    const presetBuckets = { last4w: 4, last8w: 8, last12w: 12 };
    const bucketCount = presetBuckets[weeklyTrendRange?.preset] || Math.max(1, Math.ceil((toTs - fromTs + 1) / WEEK_MS));
    const lastWeekStart = getWeekStart(toTs);
    const weekStarts = Array.from({ length: bucketCount }, (_, index) => lastWeekStart - (bucketCount - 1 - index) * WEEK_MS);
    const rows = weekStarts.map((weekStart) => ({
      weekStart,
      weekEnd: weekStart + WEEK_MS - 1,
      vip: 0,
      standard: 0,
    }));

    events.forEach((event) => {
      const ts = new Date(event.timestamp).getTime();
      if (!Number.isFinite(ts) || ts < fromTs || ts > toTs) return;
      const weekIndex = Math.floor((ts - weekStarts[0]) / WEEK_MS);
      if (weekIndex < 0 || weekIndex >= rows.length) return;
      const isVipEvent = Boolean(event.vipId || event.metadata?.vipId || event.vipName);
      if (isVipEvent) rows[weekIndex].vip += 1;
      else rows[weekIndex].standard += 1;
    });

    return rows;
  }, [events, weeklyTrendRange]);
  const weeklyTrendTotal = weeklyTrendData.reduce((sum, row) => sum + row.vip + row.standard, 0);

  const topSavedConfigurations = useMemo(() => {
    if (config.id !== "automotive") return [];
    const saveEvents = events.filter((event) => {
      const raw = String(event.rawEvent || event.event || event.type || "").toLowerCase();
      return raw === "config_save" || raw === "save_config" || raw === "save_configuration" || raw === "savedconfigurations";
    });

    const grouped = {};
    saveEvents.forEach((event) => {
      const key =
        event.item ||
        event.metadata?.configurationName ||
        event.metadata?.vehicleName ||
        event.metadata?.vehicleId ||
        tx.topConfigs.unknown;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, saves]) => ({ name, saves }))
      .sort((a, b) => b.saves - a.saves)
      .slice(0, 5);
  }, [config.id, events, tx.topConfigs.unknown]);
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
        <KpiCard
          key="nfc_roi"
          label={tx.kpiNfcRoi}
          value={0}
          subtitle={tx.kpiNfcRoiSub}
          color="#8b5cf6"
          displayOverride={nfcRoiDisplay}
        />
        <KpiCard
          key="avg_session"
          label={tx.kpiAvgSession}
          value={0}
          subtitle={tx.kpiAvgSessionSub}
          color="#0ea5e9"
          displayOverride={avgSessionDisplay}
        />
      </div>

      <div className="ud-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div>
            <div className="ud-card-title">{tx.weeklyTrend.title}</div>
            <div className="ud-card-subtitle">
              {weeklyTrendLabels.vip} vs {weeklyTrendLabels.standard}
            </div>
          </div>
          <DateRangePicker value={weeklyTrendRange} onChange={setWeeklyTrendRange} presets={WEEK_PRESETS} />
        </div>
        <div style={{ width: "100%", height: 240, marginTop: 12 }}>
          {weeklyTrendTotal < 5 ? (
            <div className="ud-weekly-empty">
              <svg className="ud-weekly-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 3v18h18" />
                <path d="m7 15 4-4 3 3 4-5" />
              </svg>
              <div className="ud-weekly-empty__title">{tx.weeklyTrend.empty.title}</div>
              <div className="ud-weekly-empty__desc">{tx.weeklyTrend.empty.desc}</div>
            </div>
          ) : (
            <ResponsiveContainer minWidth={100} minHeight={100}>
              <AreaChart data={weeklyTrendData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ud-overview-vip-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ud-border-light)" vertical={false} />
                <XAxis
                  dataKey="weekStart"
                  tickFormatter={dateTickFormatter}
                  tick={{ fontSize: 12, fill: "var(--ud-text-muted)" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  angle={-30}
                  textAnchor="end"
                  minTickGap={16}
                />
                <YAxis tickCount={5} allowDecimals={false} tick={{ fontSize: 12, fill: "var(--ud-text-muted)" }} tickLine={false} axisLine={false} />
                <Tooltip content={(props) => <WeeklyTooltip {...props} formatter={dateTickFormatter} />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="vip" name={weeklyTrendLabels.vip} stroke={accentColor} fill="url(#ud-overview-vip-grad)" strokeWidth={2} />
                <Area type="monotone" dataKey="standard" name={weeklyTrendLabels.standard} stroke="var(--ud-text-muted)" fill="var(--ud-text-muted)" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {config.id === "automotive" ? (
        <div className="ud-card" style={{ marginBottom: 16 }}>
          <div className="ud-card-title">{tx.topConfigs.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {topSavedConfigurations.length === 0 ? (
              <div className="ud-card-subtitle">{tx.topConfigs.empty}</div>
            ) : (
              topSavedConfigurations.map((row, index) => (
                <div
                  key={`${row.name}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid var(--ud-border)",
                    borderRadius: 8,
                    padding: "8px 10px",
                    background: "var(--ud-bg-secondary)",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--ud-text)" }}>{row.name}</span>
                  <span style={{ fontSize: 12, color: "var(--ud-text-muted)" }}>
                    {row.saves} {tx.topConfigs.saves}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

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
          {actionSparklineRows.length > 0 ? (
            <div className="ud-overview-action-sparklines">
              {actionSparklineRows.map((row) => (
                <div key={row.id} className="ud-overview-action-tile">
                  <div className="ud-overview-action-tile__label">{row.name}</div>
                  <div className="ud-overview-action-tile__count">{row.total}</div>
                  <MiniSparkline data={row.series} width={84} height={20} color="#457b9d" />
                </div>
              ))}
            </div>
          ) : null}
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
                  <Bar dataKey="vip" fill="#b8860b" radius={[0, 4, 4, 0]} barSize={8} name={tx.conversionLegendVip} />
                  <Bar dataKey="standard" fill="#457b9d" radius={[0, 4, 4, 0]} barSize={8} name={tx.conversionLegendStandard} />
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

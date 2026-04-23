import { useMemo } from "react";
import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";
import AiBadge from "./AiBadge";

const LABELS = {
  en: {
    stage: "Stage",
    users: "Users",
    conversion: "Conversion",
    insight: "AI Insight",
    entryPoint: "Entry point",
    strongInterest: "Strong engagement signal",
    mildDrop: "Slight friction — monitor",
    moderateDrop: "Moderate drop — review UX",
    majorDrop: "Major bottleneck — act now",
    healthyClose: "Healthy closing rate",
    weakClose: "Weak closing — follow up",
    avgClose: "Average — room to improve",
    growth: "Growth detected",
    noData: "No funnel data",
    overallConversion: "Overall conversion",
    biggestDrop: "Biggest drop",
  },
  ar: {
    stage: "المرحلة",
    users: "المستخدمون",
    conversion: "التحويل",
    insight: "تحليل ذكي",
    entryPoint: "نقطة الدخول",
    strongInterest: "إشارة تفاعل قوية",
    mildDrop: "احتكاك طفيف — راقب",
    moderateDrop: "تراجع متوسط — راجع UX",
    majorDrop: "عقبة كبرى — تصرف الآن",
    healthyClose: "معدل إغلاق جيد",
    weakClose: "إغلاق ضعيف — تابع",
    avgClose: "متوسط — يمكن تحسينه",
    growth: "نمو ملحوظ",
    noData: "لا بيانات قمع",
    overallConversion: "التحويل الكلي",
    biggestDrop: "أكبر تراجع",
  },
  es: {
    stage: "Etapa",
    users: "Usuarios",
    conversion: "Conversion",
    insight: "Insight IA",
    entryPoint: "Punto de entrada",
    strongInterest: "Fuerte engagement",
    mildDrop: "Friccion leve — monitorear",
    moderateDrop: "Caida moderada — revisar UX",
    majorDrop: "Cuello de botella — actuar",
    healthyClose: "Cierre saludable",
    weakClose: "Cierre debil — dar seguimiento",
    avgClose: "Promedio — margen de mejora",
    growth: "Crecimiento detectado",
    noData: "Sin datos de embudo",
    overallConversion: "Conversion total",
    biggestDrop: "Mayor caida",
  },
  fr: {
    stage: "Etape",
    users: "Utilisateurs",
    conversion: "Conversion",
    insight: "Analyse IA",
    entryPoint: "Point d'entree",
    strongInterest: "Fort engagement",
    mildDrop: "Friction legere — surveiller",
    moderateDrop: "Baisse moderee — revoir UX",
    majorDrop: "Goulot critique — agir",
    healthyClose: "Taux de cloture sain",
    weakClose: "Cloture faible — relancer",
    avgClose: "Moyen — marge d'amelioration",
    growth: "Croissance detectee",
    noData: "Aucune donnee d'entonnoir",
    overallConversion: "Conversion globale",
    biggestDrop: "Plus grande perte",
  },
};

function getInsight(tx, stage, prevStage, isFirst, isLast, overallPct) {
  if (isFirst) return { text: tx.entryPoint, color: "var(--ud-text-muted)", icon: "🏁" };

  const dropPct = prevStage && prevStage.value > 0
    ? Math.round(((prevStage.value - stage.value) / prevStage.value) * 100)
    : 0;

  // Growth case (more users than previous stage)
  if (dropPct < 0) return { text: tx.strongInterest, color: "#2a9d8f", icon: "📈" };

  // Last stage — judge overall funnel health
  if (isLast) {
    if (overallPct >= 50) return { text: tx.healthyClose, color: "#2a9d8f", icon: "✅" };
    if (overallPct >= 25) return { text: tx.avgClose, color: "#eab308", icon: "⚠️" };
    return { text: tx.weakClose, color: "#e63946", icon: "🚨" };
  }

  // Mid-funnel stages
  if (dropPct > 50) return { text: tx.majorDrop, color: "#e63946", icon: "🚨" };
  if (dropPct > 20) return { text: tx.moderateDrop, color: "#eab308", icon: "⚠️" };
  if (dropPct > 0) return { text: tx.mildDrop, color: "var(--ud-text-muted)", icon: "👀" };

  return { text: tx.strongInterest, color: "#2a9d8f", icon: "📈" };
}

export default function FunnelInsightTable({ data = [] }) {
  const { lang } = useLanguage();
  const { st } = useSector();
  const tx = { ...LABELS.en, ...(LABELS[lang] || {}) };

  const rows = useMemo(() => {
    if (!data || data.length === 0) return [];
    const topVal = data[0]?.value || 1;
    const lastVal = data[data.length - 1]?.value || 0;
    const overallPct = Math.round((lastVal / topVal) * 100);

    return data.map((stage, i) => {
      const prev = i > 0 ? data[i - 1] : null;
      const conversionFromPrev = prev && prev.value > 0
        ? Math.round(((prev.value - stage.value) / prev.value) * 100)
        : null;
      const insight = getInsight(tx, stage, prev, i === 0, i === data.length - 1, overallPct);
      const displayName = typeof stage.name === "object" ? st(stage.name) : stage.name;

      return {
        name: displayName,
        users: stage.value,
        conversionFromPrev,
        insight,
        color: stage.color,
      };
    });
  }, [data, tx, st]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (!data || data.length < 2) return null;
    const topVal = data[0]?.value || 1;
    const lastVal = data[data.length - 1]?.value || 0;
    const overallPct = Math.round((lastVal / topVal) * 100);

    let biggestDropStage = null;
    let biggestDropPct = 0;
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].value || 1;
      const drop = Math.round(((prev - data[i].value) / prev) * 100);
      if (drop > biggestDropPct) {
        biggestDropPct = drop;
        biggestDropStage = typeof data[i].name === "object" ? st(data[i].name) : data[i].name;
      }
    }

    return { overallPct, biggestDropStage, biggestDropPct };
  }, [data, st]);

  if (rows.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ud-text-muted)", fontSize: 13 }}>
        {tx.noData}
      </div>
    );
  }

  return (
    <div className="ud-funnel-insight-wrap">
      {/* Summary pills */}
      {summaryStats && (
        <div className="ud-funnel-summary-row">
          <div className="ud-funnel-summary-pill">
            <span className="ud-funnel-summary-label">{tx.overallConversion}</span>
            <span
              className="ud-funnel-summary-value"
              style={{ color: summaryStats.overallPct >= 30 ? "#2a9d8f" : "#e63946" }}
            >
              {summaryStats.overallPct}%
            </span>
          </div>
          {summaryStats.biggestDropStage && (
            <div className="ud-funnel-summary-pill">
              <span className="ud-funnel-summary-label">{tx.biggestDrop}</span>
              <span className="ud-funnel-summary-value" style={{ color: "#e63946" }}>
                {summaryStats.biggestDropStage} (-{summaryStats.biggestDropPct}%)
              </span>
            </div>
          )}
          <AiBadge />
        </div>
      )}

      {/* Table */}
      <table className="ud-funnel-table">
        <thead>
          <tr>
            <th>{tx.stage}</th>
            <th style={{ textAlign: "center" }}>{tx.users}</th>
            <th style={{ textAlign: "center" }}>{tx.conversion}</th>
            <th>{tx.insight}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <span className="ud-funnel-stage-dot" style={{ background: row.color || "#457b9d" }} />
                {row.name}
              </td>
              <td style={{ textAlign: "center", fontWeight: 600 }}>{row.users.toLocaleString()}</td>
              <td style={{ textAlign: "center" }}>
                {row.conversionFromPrev == null ? (
                  <span style={{ color: "var(--ud-text-muted)" }}>—</span>
                ) : row.conversionFromPrev <= 0 ? (
                  <span style={{ color: "#2a9d8f" }}>+{Math.abs(row.conversionFromPrev)}%</span>
                ) : (
                  <span style={{ color: "#e63946" }}>▼ {row.conversionFromPrev}%</span>
                )}
              </td>
              <td>
                <span className="ud-funnel-insight-badge" style={{ color: row.insight.color }}>
                  {row.insight.icon} {row.insight.text}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

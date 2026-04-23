import { useLanguage } from "../../../i18n";
import { useSector } from "../../../hooks/useSector";

export default function SvgFunnel({ data = [] }) {
  const { lang } = useLanguage();
  const { st } = useSector();

  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ud-text-muted)", fontSize: 13 }}>
        {lang === "ar" ? "لا توجد بيانات قمع بعد" : lang === "fr" ? "Aucune donnee d'entonnoir" : "No funnel data yet"}
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalWidth = 720;
  const stageHeight = 58;
  const gap = 10;
  const sidePadding = 60;
  const innerWidth = totalWidth - sidePadding * 2;
  const totalHeight = data.length * (stageHeight + gap) + 20;

  const pctLabel = lang === "ar" ? "معدل التحويل" : lang === "fr" ? "Conversion" : lang === "es" ? "Conversion" : "Conversion";
  const dropLabel = lang === "ar" ? "تراجع" : lang === "fr" ? "Perte" : lang === "es" ? "Caida" : "Drop-off";

  return (
    <div style={{ overflowX: "auto", padding: "4px 0" }}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        width="100%"
        style={{ maxWidth: totalWidth, minWidth: 320, display: "block", margin: "0 auto" }}
      >
        <defs>
          {data.map((stage, i) => (
            <linearGradient key={`funnel-grad-${i}`} id={`funnelGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={stage.color || "#457b9d"} stopOpacity={0.75} />
              <stop offset="50%" stopColor={stage.color || "#457b9d"} stopOpacity={1} />
              <stop offset="100%" stopColor={stage.color || "#457b9d"} stopOpacity={0.8} />
            </linearGradient>
          ))}
          <filter id="funnelShadow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {data.map((stage, i) => {
          const topRatio = i === 0 ? 1 : data[i - 1].value / maxVal;
          const botRatio = stage.value / maxVal;
          const topWidth = innerWidth * topRatio;
          const bottomWidth = innerWidth * botRatio;
          const y = i * (stageHeight + gap);
          const centerX = totalWidth / 2;
          const topLeft = centerX - topWidth / 2;
          const topRight = centerX + topWidth / 2;
          const botLeft = centerX - bottomWidth / 2;
          const botRight = centerX + bottomWidth / 2;
          const conversionPct = Math.round((stage.value / Math.max(data[0].value, 1)) * 100);
          const displayName = typeof stage.name === "object" ? st(stage.name) : stage.name;

          return (
            <g key={`funnel-stage-${i}`}>
              <polygon
                points={`${topLeft},${y} ${topRight},${y} ${botRight},${y + stageHeight} ${botLeft},${y + stageHeight}`}
                fill={`url(#funnelGrad-${i})`}
                filter="url(#funnelShadow)"
              />
              <text
                x={centerX}
                y={y + stageHeight / 2 - 5}
                textAnchor="middle"
                fill="#fff"
                fontSize="13"
                fontWeight="600"
                style={{ letterSpacing: "0.2px" }}
              >
                {displayName}
              </text>
              <text
                x={centerX}
                y={y + stageHeight / 2 + 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.88)"
                fontSize="12"
                fontWeight="500"
              >
                {stage.value.toLocaleString()} · {conversionPct}%
              </text>

              {i > 0 && stage.dropOff != null && stage.dropOff > 0 ? (
                <g>
                  <rect
                    x={totalWidth - sidePadding + 4}
                    y={y + stageHeight / 2 - 10}
                    width={52}
                    height={20}
                    rx={10}
                    fill="rgba(230, 57, 70, 0.12)"
                    stroke="rgba(230, 57, 70, 0.35)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={totalWidth - sidePadding + 30}
                    y={y + stageHeight / 2 + 4}
                    fill="#e63946"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    -{stage.dropOff}%
                  </text>
                </g>
              ) : null}

              {i === 0 ? (
                <text
                  x={sidePadding - 8}
                  y={y + stageHeight / 2 + 4}
                  fill="var(--ud-text-muted, #888)"
                  fontSize="10"
                  fontWeight="500"
                  textAnchor="end"
                >
                  {pctLabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

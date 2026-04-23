import AnimatedCounter from "./AnimatedCounter";

export default function KpiCard({ label, value, subtitle, color, suffix = "", prefix = "", displayOverride, sparkline }) {
  return (
    <div className="ud-kpi-card">
      <div className="ud-kpi-accent" style={{ background: color }} />
      <div className="ud-kpi-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <span className="ud-kpi-label">{label}</span>
            <span className="ud-kpi-value" style={{ color }}>
              {displayOverride || <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />}
            </span>
          </div>
          {sparkline ? <div style={{ marginTop: 4 }}>{sparkline}</div> : null}
        </div>
        <span className="ud-kpi-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useTranslation } from "../../i18n";

const BUYER_KEYS = ["ttfa", "viewingVelocity", "reEngagement", "secondTapRate"];
const CONVERSION_KEYS = ["leadCapture", "vipToBooked", "decisionWindow", "repResponse"];

const GROUP_THEME = {
  buyer: {
    cardBg: "#E6F1FB",
    labelColor: "#0C447C",
    valueColor: "#042C53",
  },
  conversion: {
    cardBg: "#EEEDFE",
    labelColor: "#3C3489",
    valueColor: "#26215C",
  },
};

const THRESHOLD_LEGEND = [
  { key: "green", className: "ud-sales-velocity__dot ud-sales-velocity__dot--green" },
  { key: "yellow", className: "ud-sales-velocity__dot ud-sales-velocity__dot--yellow" },
  { key: "red", className: "ud-sales-velocity__dot ud-sales-velocity__dot--red" },
  { key: "gray", className: "ud-sales-velocity__dot ud-sales-velocity__dot--gray" },
];

function fallbackMetric() {
  return {
    value: null,
    unit: "\u2014",
    threshold: "gray",
  };
}

function normalizeMetric(metric) {
  if (!metric) return fallbackMetric();
  return {
    value: metric.value ?? null,
    unit: metric.unit || "\u2014",
    threshold: metric.threshold || "gray",
  };
}

function metricValue(metric) {
  if (metric.value === null || metric.value === undefined) return "\u2014";
  if (metric.unit === "%") return `${Math.round(Number(metric.value) || 0)}%`;
  if (metric.unit && metric.unit !== "\u2014") return `${metric.value} ${metric.unit}`;
  return String(metric.value);
}

function dotClass(threshold) {
  if (threshold === "green") return "ud-sales-velocity__dot ud-sales-velocity__dot--green";
  if (threshold === "yellow") return "ud-sales-velocity__dot ud-sales-velocity__dot--yellow";
  if (threshold === "red") return "ud-sales-velocity__dot ud-sales-velocity__dot--red";
  return "ud-sales-velocity__dot ud-sales-velocity__dot--gray";
}

function normalizeThreshold(metric) {
  if (!metric?.threshold) return "gray";
  const value = String(metric.threshold).toLowerCase();
  if (value === "green" || value === "yellow" || value === "red") return value;
  return "gray";
}

function makeLabelKey(metricKey) {
  return `metrics.${metricKey}.label`;
}

function makeSubLabelKey(metricKey) {
  return `metrics.${metricKey}.sublabel`;
}

function buildItems(keys, metrics, t) {
  return keys.map((key) => ({
    key,
    label: t(makeLabelKey(key)),
    sublabel: t(makeSubLabelKey(key)),
    metric: normalizeMetric(metrics?.[key]),
  }));
}

function MetricCard({ item, theme }) {
  return (
    <article className="ud-sales-velocity__card" style={{ background: theme.cardBg }}>
      <span className={dotClass(normalizeThreshold(item.metric))} aria-hidden="true" />

      <div className="ud-sales-velocity__label" style={{ color: theme.labelColor }}>
        {item.label}
      </div>

      <div className="ud-sales-velocity__value" style={{ color: theme.valueColor }}>
        {metricValue(item.metric)}
      </div>

      <div className="ud-sales-velocity__sublabel" style={{ color: theme.labelColor }}>
        {item.sublabel}
      </div>
    </article>
  );
}

function MetricGrid({ items, theme }) {
  return (
    <div className="ud-sales-velocity__group">
      <div className="ud-sales-velocity__grid">
        {items.map((item) => (
          <MetricCard key={item.key} item={item} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function LegendPill({ className, text }) {
  return (
    <span className="ud-sales-velocity__legend-pill">
      <span className={className} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

function buildRows(metrics, t) {
  return {
    buyer: buildItems(BUYER_KEYS, metrics, t),
    conversion: buildItems(CONVERSION_KEYS, metrics, t),
  };
}

function SectionHeader({ title }) {
  return (
    <header className="ud-sales-velocity__header">
      <h3 className="ud-sales-velocity__title">{title}</h3>
    </header>
  );
}

function LegendRow() {
  return (
    <div className="ud-sales-velocity__legend">
      {THRESHOLD_LEGEND.map((legend) => (
        <LegendPill key={legend.key} className={legend.className} text={legend.key} />
      ))}
    </div>
  );
}

function SectionShell({ title, children }) {
  return (
    <div className="ud-sales-velocity__section-shell">
      <h4 className="ud-sales-velocity__row-title">{title}</h4>
      {children}
    </div>
  );
}

export default function SalesVelocity({ metrics, lang, sector, region }) {
  const t = useTranslation("salesVelocity");
  const rows = useMemo(() => buildRows(metrics, t), [metrics, t]);
  const buyerTitle = t("rowBuyerBehavior");
  const conversionTitle = t("rowConversion");

  return (
    <section
      className="ud-sales-velocity"
      data-lang={lang}
      data-sector={sector}
      data-region={region}
      aria-live="polite"
    >
      <SectionHeader title={t("sectionTitle")} />
      <LegendRow />
      <SectionShell title={buyerTitle}>
        <MetricGrid items={rows.buyer} theme={GROUP_THEME.buyer} />
      </SectionShell>
      <SectionShell title={conversionTitle}>
        <MetricGrid items={rows.conversion} theme={GROUP_THEME.conversion} />
      </SectionShell>
    </section>
  );
}

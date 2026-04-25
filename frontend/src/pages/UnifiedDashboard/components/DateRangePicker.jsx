import { registerTranslations, useTranslation } from "../../../i18n";
import "./DateRangePicker.css";
const PRESET_MS = {
  last7d: 7,
  last30d: 30,
  last90d: 90,
  last4w: 28,
  last8w: 56,
  last12w: 84,
};

registerTranslations("dateRangePicker", {
  en: {
    "presets.last7d": "Last 7 days",
    "presets.last30d": "Last 30 days",
    "presets.last90d": "Last 90 days",
    "presets.custom": "Custom range",
    "presets.last4w": "Last 4 weeks",
    "presets.last8w": "Last 8 weeks",
    "presets.last12w": "Last 12 weeks",
    "labels.from": "From",
    "labels.to": "To",
    "labels.group": "Date range",
  },
  ar: {
    "presets.last7d": "آخر 7 أيام",
    "presets.last30d": "آخر 30 يوم",
    "presets.last90d": "آخر 90 يوم",
    "presets.custom": "نطاق مخصص",
    "presets.last4w": "آخر 4 أسابيع",
    "presets.last8w": "آخر 8 أسابيع",
    "presets.last12w": "آخر 12 أسبوع",
    "labels.from": "من",
    "labels.to": "إلى",
    "labels.group": "النطاق الزمني",
  },
  es: {
    "presets.last7d": "Últimos 7 días",
    "presets.last30d": "Últimos 30 días",
    "presets.last90d": "Últimos 90 días",
    "presets.custom": "Rango personalizado",
    "presets.last4w": "Últimas 4 semanas",
    "presets.last8w": "Últimas 8 semanas",
    "presets.last12w": "Últimas 12 semanas",
    "labels.from": "Desde",
    "labels.to": "Hasta",
    "labels.group": "Rango de fechas",
  },
  fr: {
    "presets.last7d": "7 derniers jours",
    "presets.last30d": "30 derniers jours",
    "presets.last90d": "90 derniers jours",
    "presets.custom": "Plage personnalisée",
    "presets.last4w": "4 dernières semaines",
    "presets.last8w": "8 dernières semaines",
    "presets.last12w": "12 dernières semaines",
    "labels.from": "Du",
    "labels.to": "Au",
    "labels.group": "Période",
  },
});

const atDayBoundary = (timestamp, end = false) => {
  const d = new Date(timestamp);
  d.setHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0);
  return d.getTime();
};

const resolveRange = (value) => {
  const now = Date.now();
  const preset = value?.preset || "last30d";
  if (preset !== "custom") {
    const days = PRESET_MS[preset] || 30;
    return { fromTs: atDayBoundary(now - (days - 1) * 86400000), toTs: atDayBoundary(now, true) };
  }
  const fromTs = value?.from ? atDayBoundary(new Date(value.from).getTime()) : null;
  const toTs = value?.to ? atDayBoundary(new Date(value.to).getTime(), true) : null;
  return { fromTs, toTs };
};

const DEFAULT_PRESETS = ["last7d", "last30d", "last90d", "custom"];

export default function DateRangePicker({ value, onChange, presets = DEFAULT_PRESETS }) {
  const t = useTranslation("dateRangePicker");
  const preset = value?.preset || "last30d";
  const { fromTs, toTs } = resolveRange(value);

  const emit = (next) => {
    const merged = { ...value, ...next };
    const resolved = resolveRange(merged);
    onChange?.({ ...merged, ...resolved });
  };

  return (
    <div className="ud-drp" role="group" aria-label={t("labels.group")}>
      <select
        className="ud-drp-select"
        value={preset}
        onChange={(e) => {
          const nextPreset = e.target.value;
          emit(nextPreset === "custom" ? { preset: nextPreset } : { preset: nextPreset, from: null, to: null });
        }}
      >
        {presets.map((presetKey) => (
          <option key={presetKey} value={presetKey}>
            {t(`presets.${presetKey}`)}
          </option>
        ))}
      </select>

      {preset === "custom" ? (
        <div className="ud-drp-custom">
          <label className="ud-drp-label">
            <span>{t("labels.from")}</span>
            <input
              className="ud-drp-input"
              type="date"
              value={value?.from || ""}
              onChange={(e) => emit({ preset: "custom", from: e.target.value || null })}
            />
          </label>
          <label className="ud-drp-label">
            <span>{t("labels.to")}</span>
            <input
              className="ud-drp-input"
              type="date"
              value={value?.to || ""}
              onChange={(e) => emit({ preset: "custom", to: e.target.value || null })}
            />
          </label>
        </div>
      ) : (
        <div className="ud-drp-range">
          <span>{new Date(fromTs).toLocaleDateString()}</span>
          <span>→</span>
          <span>{new Date(toTs).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}


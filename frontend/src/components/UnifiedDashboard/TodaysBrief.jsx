import { useMemo } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "../../i18n";

const SOURCE_PRIORITY = ["llm", "cached", "template"];
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["span", "strong", "em"],
  ALLOWED_ATTR: ["class"],
};

const LANG_LOCALE = {
  en: "en-CA",
  ar: "ar-SA",
  es: "es-MX",
  fr: "fr-CA",
};

const DEFAULT_BRIEF = {
  paragraph1:
    "Top VIP signals will appear here as buyer activity accumulates across your private invitation journeys.",
  paragraph2:
    "Pipeline and marketplace movement updates every cycle so your team can act while intent is still hot.",
  chips: [],
  source: "template",
  generatedAt: Date.now(),
};

function asText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseSource(brief) {
  const requested = asText(brief?.source, "").toLowerCase();
  if (SOURCE_PRIORITY.includes(requested)) return requested;
  return "template";
}

function parseRoiLabel(value) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return `${value.toFixed(1)}x`;
  return "—";
}

function formatUpdatedLabel(timestamp, lang) {
  const ms = safeNumber(timestamp, NaN);
  if (!Number.isFinite(ms)) return "—";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "—";
  const locale = LANG_LOCALE[lang] || LANG_LOCALE.en;
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

function normalizeChips(chips) {
  if (!Array.isArray(chips)) return [];
  return chips
    .map((chip) => ({
      label: asText(chip?.label),
      tone: asText(chip?.tone, "gray"),
    }))
    .filter((chip) => Boolean(chip.label));
}

function computeStatusText(source, t, cooldownMinutes) {
  if (source === "cached") return `${t("cooldownLabel")} ${cooldownMinutes}${t("minutes")}`;
  if (source === "llm") return t("refreshButton");
  return t("generateButton");
}

function normalizeBrief(brief, lang) {
  if (!brief) return DEFAULT_BRIEF;
  // Prefer per-lang slot from byLang dict; fall back to legacy top-level fields for migration safety.
  const slice = brief?.byLang?.[lang] || brief?.byLang?.en || brief;
  return {
    paragraph1: asText(slice.paragraph1, DEFAULT_BRIEF.paragraph1),
    paragraph2: asText(slice.paragraph2, DEFAULT_BRIEF.paragraph2),
    chips: normalizeChips(slice.chips),
    source: parseSource(slice),
    generatedAt: safeNumber(slice.generatedAt, Date.now()),
    cooldownRemaining: safeNumber(brief.cooldownRemaining ?? slice.cooldownRemaining, 0),
    topVipName: asText(slice.topVipName || slice.vipName, ""),
  };
}

function ActionButton({ disabled, isRefreshing, label, onClick }) {
  return (
    <button
      type="button"
      className={`ud-todays-brief__action ${disabled ? "is-disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isRefreshing ? <span className="ud-todays-brief__spinner" aria-hidden="true" /> : null}
      <span>{label}</span>
    </button>
  );
}

function ChipsRow({ chips }) {
  if (!chips.length) return <div className="ud-todays-brief__chips" />;
  return (
    <div className="ud-todays-brief__chips">
      {chips.map((chip, index) => (
        <span key={`${chip.label}-${index}`} className={`ud-todays-brief__chip ud-todays-brief__chip--${chip.tone || "gray"}`}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function SourceBadge({ source }) {
  const normalized = source === "llm" ? "AI" : source === "cached" ? "Cached" : "Template";
  return <span className={`ud-todays-brief__source ud-todays-brief__source--${source}`}>{normalized}</span>;
}

export default function TodaysBrief({ brief, nfcRoi, onRefreshAi, isRefreshing, lang }) {
  const t = useTranslation("todaysBrief");
  const normalized = useMemo(() => normalizeBrief(brief, lang), [brief, lang]);
  const source = normalized.source;
  const cooldownMinutes = Math.max(1, Math.ceil(normalized.cooldownRemaining / (60 * 1000)));
  const disabled = isRefreshing || source === "cached";
  const roiLabel = parseRoiLabel(nfcRoi);
  const updatedLabel = formatUpdatedLabel(normalized.generatedAt, lang);
  const actionLabel = computeStatusText(source, t, cooldownMinutes);

  const paragraph1 = useMemo(
    () => asText(normalized.paragraph1),
    [normalized.paragraph1]
  );

  const paragraph2 = useMemo(() => asText(normalized.paragraph2), [normalized.paragraph2]);
  const sanitizedParagraph1 = useMemo(
    () => DOMPurify.sanitize(paragraph1 || "", SANITIZE_CONFIG),
    [paragraph1]
  );
  const sanitizedParagraph2 = useMemo(
    () => DOMPurify.sanitize(paragraph2 || "", SANITIZE_CONFIG),
    [paragraph2]
  );

  const handleRefresh = async () => {
    if (!onRefreshAi || disabled) return;
    await onRefreshAi();
  };

  return (
    <section className="ud-todays-brief" aria-live="polite">
      <div className="ud-todays-brief__header">
        <div className="ud-todays-brief__heading">
          <h3 className="ud-todays-brief__title">{t("title")}</h3>
          <div className="ud-todays-brief__meta">
            <span className="ud-todays-brief__meta-item">
              {t("updatedLabel")} {updatedLabel}
            </span>
          </div>
        </div>

        <div className="ud-todays-brief__header-right">
          <div className="ud-todays-brief__roi">
            <span className="ud-todays-brief__roi-label">{t("nfcRoiLabel")}</span>
            <span className="ud-todays-brief__roi-value">{roiLabel}</span>
          </div>
          <SourceBadge source={source} />
          <ActionButton disabled={disabled} isRefreshing={isRefreshing} label={actionLabel} onClick={handleRefresh} />
        </div>
      </div>

      <div className="ud-todays-brief__body">
        <p className="ud-todays-brief__paragraph" dangerouslySetInnerHTML={{ __html: sanitizedParagraph1 }} />
        <p className="ud-todays-brief__paragraph" dangerouslySetInnerHTML={{ __html: sanitizedParagraph2 }} />
      </div>

      <ChipsRow chips={normalized.chips} />
      <div className="ud-todays-brief__footer" />
    </section>
  );
}

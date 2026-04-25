import { registerTranslations, useTranslation } from "../../../i18n";

registerTranslations("activityFeed", {
  en: {
    "personLabels.walk_in_prospect": "Walk-in Prospect",
    "personLabels.registered": "Registered",
    "personLabels.lead": "Lead",
    "personLabels.anonymous": "Anonymous",
    "personLabels.vip": "VIP",
    "status.new": "NEW",
  },
  ar: {
    "personLabels.walk_in_prospect": "عميل محتمل زائر",
    "personLabels.registered": "مسجل",
    "personLabels.lead": "عميل محتمل",
    "personLabels.anonymous": "مجهول",
    "personLabels.vip": "VIP",
    "status.new": "جديد",
  },
  es: {
    "personLabels.walk_in_prospect": "Prospecto walk-in",
    "personLabels.registered": "Registrado",
    "personLabels.lead": "Prospecto",
    "personLabels.anonymous": "Anónimo",
    "personLabels.vip": "VIP",
    "status.new": "NUEVO",
  },
  fr: {
    "personLabels.walk_in_prospect": "Prospect spontané",
    "personLabels.registered": "Enregistré",
    "personLabels.lead": "Prospect",
    "personLabels.anonymous": "Anonyme",
    "personLabels.vip": "VIP",
    "status.new": "NOUVEAU",
  },
});

function formatRelativeTime(ts, lang = "en") {
  const diff = Math.floor((Date.now() - (ts?.toDate?.() || new Date(ts)).getTime()) / 1000);
  if (diff < 60) return lang === "ar" ? "منذ أقل من دقيقة" : lang === "es" ? "hace 1m" : lang === "fr" ? "il y a 1m" : "1m ago";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return lang === "ar" ? `منذ ${mins} دقائق` : lang === "es" ? `hace ${mins}m` : lang === "fr" ? `il y a ${mins}m` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === "ar" ? (hrs === 2 ? "منذ ساعتين" : `منذ ${hrs} ساعات`) : lang === "es" ? `hace ${hrs}h` : lang === "fr" ? `il y a ${hrs}h` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return lang === "ar" ? (days === 1 ? "منذ يوم" : `منذ ${days} أيام`) : lang === "es" ? `hace ${days}d` : lang === "fr" ? `il y a ${days}j` : `${days}d ago`;
}

export default function ActivityFeed({ events = [], maxItems = 15, labels, lang = "en" }) {
  const tx = labels || { empty: "" };
  const tActivity = useTranslation("activityFeed");
  const tEventDisplay = useTranslation("eventDisplay");
  const fromEventDisplay = (code) => {
    const key = `eventDisplay.${code}`;
    const translated = tEventDisplay(key);
    return translated === key ? String(code || "").replace(/_/g, " ") : translated;
  };
  const fromActivity = (key, fallback = key) => {
    const translated = tActivity(key);
    return translated === key ? fallback : translated;
  };
  const portalTypeLabel = (portalType) => {
    const t = portalType || "anonymous";
    if (t === "vip") return fromActivity("personLabels.vip", "VIP");
    if (t === "registered" || t === "family") return fromActivity("personLabels.registered", "Registered");
    if (t === "lead") return fromActivity("personLabels.lead", "Lead");
    return fromActivity("personLabels.anonymous", "Anonymous");
  };
  const isFresh = (ts) => Date.now() - (ts?.toDate?.() || new Date(ts)).getTime() <= 5 * 60 * 1000;
  const toEventKey = (event) => String(event?.rawEvent || event?.type || event?.event || "").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  const localizeActor = (event) => {
    const raw = String(event?.personName || event?.vipName || event?.userName || event?.leadName || "").toLowerCase();
    if (raw === "walk-in prospect" || raw === "walk_in_prospect") return fromActivity("personLabels.walk_in_prospect", "Walk-in Prospect");
    return event?.personName || event?.vipName || event?.userName || event?.leadName || "Visitor";
  };
  const localizeDescription = (event) => {
    const key = toEventKey(event);
    const action = fromEventDisplay(key);
    const actor = localizeActor(event);
    const item = event?.item || event?.unitName || "";
    return item ? `${actor} — ${action} -> ${item}` : `${actor} — ${action}`;
  };

  return (
    <div className="ud-activity-feed">
      {events.slice(0, maxItems).map((event, i) => (
        <div key={`${event.timestamp || "t"}-${i}`} className="ud-feed-item">
          <div className="ud-feed-dot" style={{ background: event.isVip ? "#e63946" : "#457b9d" }} />
          <div className="ud-feed-content">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 10, border: "1px solid var(--ud-border)", borderRadius: 10, padding: "1px 6px", color: "var(--ud-text-muted)" }}>
                {portalTypeLabel(event.portalType)}
              </span>
              {isFresh(event.timestamp) ? (
                <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
                  {fromActivity("status.new", "NEW")}
                </span>
              ) : null}
            </div>
            <span className="ud-feed-text">{localizeDescription(event)}</span>
            <span className="ud-feed-time">{formatRelativeTime(event.timestamp, lang)}</span>
          </div>
        </div>
      ))}
      {events.length === 0 && <div className="ud-feed-empty">{tx.empty}</div>}
    </div>
  );
}

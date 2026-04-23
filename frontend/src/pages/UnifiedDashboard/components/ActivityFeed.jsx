export default function ActivityFeed({ events = [], maxItems = 15, labels, lang = "en" }) {
  const tx = labels || {
    now: "now",
    minute: "m",
    hour: "h",
    day: "d",
    ago: "",
    empty: "",
  };

  const timeAgo = (ts) => {
    if (!ts) return "";
    const date = ts?.toDate?.() || new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return lang === "ar" ? `منذ ${diff} ثانية` : lang === "es" ? `hace ${diff}s` : `${diff}s ago`;
    if (diff < 3600) return lang === "ar" ? `منذ ${Math.floor(diff / 60)} دقيقة` : lang === "es" ? `hace ${Math.floor(diff / 60)}m` : `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return lang === "ar" ? `منذ ${Math.floor(diff / 3600)} ساعة` : lang === "es" ? `hace ${Math.floor(diff / 3600)}h` : `${Math.floor(diff / 3600)}h ago`;
    return lang === "ar" ? `منذ ${Math.floor(diff / 86400)} يوم` : lang === "es" ? `hace ${Math.floor(diff / 86400)}d` : `${Math.floor(diff / 86400)}d ago`;
  };

  const typeLabel = (portalType) => {
    const t = portalType || "anonymous";
    if (t === "vip") return "VIP";
    if (t === "registered" || t === "family") return lang === "ar" ? "مسجل" : lang === "es" ? "Registrado" : "Registered";
    if (t === "lead") return lang === "ar" ? "عميل" : lang === "es" ? "Lead" : "Lead";
    return lang === "ar" ? "مجهول" : lang === "es" ? "Anonimo" : "Anonymous";
  };

  const isFresh = (ts) => {
    const date = ts?.toDate?.() || new Date(ts);
    return Date.now() - date.getTime() <= 5 * 60 * 1000;
  };

  return (
    <div className="ud-activity-feed">
      {events.slice(0, maxItems).map((event, i) => (
        <div key={`${event.timestamp || "t"}-${i}`} className="ud-feed-item">
          <div className="ud-feed-dot" style={{ background: event.isVip ? "#e63946" : "#457b9d" }} />
          <div className="ud-feed-content">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 10, border: "1px solid var(--ud-border)", borderRadius: 10, padding: "1px 6px", color: "var(--ud-text-muted)" }}>
                {typeLabel(event.portalType)}
              </span>
              {isFresh(event.timestamp) ? (
                <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>{lang === "ar" ? "جديد" : lang === "es" ? "NUEVO" : "NEW"}</span>
              ) : null}
            </div>
            <span className="ud-feed-text">{event.description}</span>
            <span className="ud-feed-time">{timeAgo(event.timestamp)}</span>
          </div>
        </div>
      ))}
      {events.length === 0 && <div className="ud-feed-empty">{tx.empty}</div>}
    </div>
  );
}

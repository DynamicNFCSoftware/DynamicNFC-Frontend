import { useLanguage } from "../../../i18n";

export default function CallQueue({ queue = [], onOutreach }) {
  const { lang } = useLanguage();

  if (queue.length === 0) {
    return (
      <div className="ud-card" style={{ textAlign: "center", padding: "24px 16px" }}>
        <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>✅</div>
        <div style={{ fontSize: 13, color: "var(--ud-text-muted)" }}>
          {({
            ar: "لا توجد اتصالات مطلوبة اليوم — جميع VIP متفاعلون",
            es: "No se necesitan llamadas hoy — todos los VIP estan comprometidos",
            en: "No calls needed today — all VIPs are engaged",
            fr: "Aucun appel nécessaire aujourd'hui — tous les VIP sont engagés",
          }[lang] || "No calls needed today — all VIPs are engaged")}
        </div>
      </div>
    );
  }

  return (
    <div className="ud-card">
      <div className="ud-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>📞</span>
        {({ ar: "من تتصل به اليوم", es: "A quién llamar hoy", en: "Who to call today", fr: "Qui appeler aujourd'hui" }[lang] || "Who to call today")}
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 12,
            background: "var(--ud-accent-bg)",
            color: "var(--ud-accent)",
            marginInlineStart: "auto",
          }}
        >
          {queue.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {queue.map((vip, i) => (
          <div
            key={vip.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: i === 0 ? "var(--ud-accent-bg)" : "var(--ud-card-hover)",
              borderRadius: 8,
              border: i === 0 ? "0.5px solid var(--ud-accent)" : "0.5px solid var(--ud-border)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: vip.triggerSeverity === "high" ? "rgba(230,57,70,0.1)" : "rgba(69,123,157,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {vip.triggerIcon || "•"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ud-text)" }}>{vip.name}</div>
              <div style={{ fontSize: 11, color: "var(--ud-text-muted)", marginTop: 1 }}>
                {vip.triggerReason}
                {vip.idleDays > 0 ? (
                  <span style={{ marginInlineStart: 8, color: vip.idleDays >= 5 ? "#e63946" : "inherit" }}>
                    {vip.idleDays}
                    {lang === "ar" ? " يوم خمول" : lang === "es" ? "d inactivo" : lang === "fr" ? "j inactif" : "d idle"}
                  </span>
                ) : null}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 6,
                background: "var(--ud-accent-bg)",
                color: "var(--ud-accent)",
              }}
            >
              {vip.score}
            </div>
            <button
              onClick={() => onOutreach?.(vip)}
              style={{
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 500,
                border: "0.5px solid var(--ud-accent)",
                borderRadius: 6,
                background: "transparent",
                color: "var(--ud-accent)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              type="button"
            >
              {({ ar: "تواصل", es: "Contactar", en: "Reach out", fr: "Contacter" }[lang] || "Reach out")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

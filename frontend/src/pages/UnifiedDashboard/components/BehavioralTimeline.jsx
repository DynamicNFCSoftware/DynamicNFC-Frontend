import { useSector } from "../../../hooks/useSector";
import { useLanguage } from "../../../i18n";
import { useMemo, useState } from "react";

const EVENT_ICONS = {
  portalEntry: "🚪",
  itemView: "👁️",
  itemDetail: "🔍",
  pricingRequest: "💰",
  brochureDownload: "📄",
  booking: "📋",
  calculator: "🧮",
  paymentPlan: "💳",
  contactAgent: "📞",
  floorPlan: "📐",
  comparison: "⚖️",
  favorites: "❤️",
};

const EVENT_LABELS = {
  en: {
    portal_entry: "Portal entry",
    item_view: "Item view",
    item_detail: "Item details",
    pricing_request: "Pricing request",
    brochure_download: "Brochure download",
    booking: "Booking",
    calculator: "Calculator",
    payment_plan: "Payment plan",
    contact_agent: "Contact agent",
    floor_plan: "Floor plan",
    comparison: "Comparison",
    favorites: "Favorites",
  },
  ar: {
    portal_entry: "دخول البوابة",
    item_view: "عرض الوحدة",
    item_detail: "تفاصيل الوحدة",
    pricing_request: "طلب التسعير",
    brochure_download: "تحميل البروشور",
    booking: "حجز",
    calculator: "الحاسبة",
    payment_plan: "خطة الدفع",
    contact_agent: "التواصل مع الوكيل",
    floor_plan: "المخطط",
    comparison: "مقارنة",
    favorites: "المفضلة",
  },
  es: {
    portal_entry: "Entrada al portal",
    item_view: "Vista de unidad",
    item_detail: "Detalle de unidad",
    pricing_request: "Solicitud de precio",
    brochure_download: "Descarga de brochure",
    booking: "Reserva",
    calculator: "Calculadora",
    payment_plan: "Plan de pago",
    contact_agent: "Contactar asesor",
    floor_plan: "Plano",
    comparison: "Comparacion",
    favorites: "Favoritos",
  },
  fr: {
    portal_entry: "Entree portail",
    item_view: "Vue unite",
    item_detail: "Detail unite",
    pricing_request: "Demande de prix",
    brochure_download: "Telechargement brochure",
    booking: "Reservation",
    calculator: "Calculateur",
    payment_plan: "Plan de paiement",
    contact_agent: "Contacter conseiller",
    floor_plan: "Plan",
    comparison: "Comparaison",
    favorites: "Favoris",
  },
};

export default function BehavioralTimeline({ events = [], title = "" }) {
  const { config } = useSector();
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [priorityFirst, setPriorityFirst] = useState(false);

  const getIcon = (eventType) => {
    const entries = Object.entries(config.events);
    for (const [key, val] of entries) {
      if (val === eventType) return EVENT_ICONS[key] || "📌";
    }
    return "📌";
  };

  const formatTime = (ts) => {
    const d = ts instanceof Date ? ts : new Date(ts);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return lang === "ar" ? "الآن" : lang === "es" ? "ahora" : lang === "fr" ? "a l'instant" : "just now";
    if (mins < 60) return `${mins}${lang === "ar" ? " د" : lang === "fr" ? " min" : "m"}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}${lang === "ar" ? " س" : "h"}`;
    const days = Math.floor(hrs / 24);
    return `${days}${lang === "ar" ? " ي" : lang === "fr" ? " j" : "d"}`;
  };

  const normalizeEventKey = (value) => (
    String(value || "")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase()
  );

  const getEventLabel = (eventType) => {
    const normalized = normalizeEventKey(eventType);
    const labels = EVENT_LABELS[lang] || EVENT_LABELS.en;
    return labels[normalized] || EVENT_LABELS.en[normalized] || normalized.replace(/_/g, " ");
  };
  const getSeverity = (evt) => {
    const raw = String(evt?.severity || "").toLowerCase();
    if (raw === "high" || raw === "medium" || raw === "low") return raw;
    const type = normalizeEventKey(evt?.type);
    if (type.includes("booking") || type.includes("pricing") || type.includes("contact") || type.includes("payment_plan")) {
      return "high";
    }
    if (type.includes("item_detail") || type.includes("brochure") || type.includes("comparison")) {
      return "medium";
    }
    return "low";
  };
  const severityWeight = (severity) => (
    severity === "high" ? 3 : severity === "medium" ? 2 : 1
  );
  const getTimestampMs = (ts) => {
    if (!ts) return 0;
    if (typeof ts === "number") return ts;
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts?.toDate === "function") return ts.toDate().getTime();
    if (typeof ts?.seconds === "number") return ts.seconds * 1000;
    const parsed = new Date(ts).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const itemJoiner = lang === "ar" ? " \u2190 " : " \u2192 ";
  const initialVisibleCount = 6;
  const timelineEvents = useMemo(() => {
    if (!priorityFirst) return events;
    return [...events].sort((a, b) => {
      const s = severityWeight(getSeverity(b)) - severityWeight(getSeverity(a));
      if (s !== 0) return s;
      return getTimestampMs(b?.timestamp) - getTimestampMs(a?.timestamp);
    });
  }, [events, priorityFirst]);
  const visibleEvents = useMemo(() => (
    expanded ? timelineEvents.slice(0, 24) : timelineEvents.slice(0, initialVisibleCount)
  ), [timelineEvents, expanded]);
  const hasMore = timelineEvents.length > initialVisibleCount;
  const toggleLabel = ({
    en: expanded ? "Show less" : "Show more",
    ar: expanded ? "عرض أقل" : "عرض المزيد",
    es: expanded ? "Ver menos" : "Ver mas",
    fr: expanded ? "Voir moins" : "Voir plus",
  }[lang] || (expanded ? "Show less" : "Show more"));
  const priorityLabel = ({
    en: priorityFirst ? "Priority first: ON" : "Priority first",
    ar: priorityFirst ? "الأولوية أولاً: تشغيل" : "الأولوية أولاً",
    es: priorityFirst ? "Prioridad primero: ON" : "Prioridad primero",
    fr: priorityFirst ? "Priorite d'abord : ON" : "Priorite d'abord",
  }[lang] || (priorityFirst ? "Priority first: ON" : "Priority first"));
  const sortHint = ({
    en: "Sorted by severity",
    ar: "مرتب حسب الاولوية",
    es: "Ordenado por severidad",
    fr: "Trie par severite",
  }[lang] || "Sorted by severity");

  return (
    <div className="ud-timeline">
      <div className="ud-timeline-header">
        {title ? <div className="ud-timeline-title">{title}</div> : <span />}
        <div className="ud-timeline-controls">
          <button
            type="button"
            className={`ud-timeline-toggle ${priorityFirst ? "is-active" : ""}`}
            onClick={() => setPriorityFirst((prev) => !prev)}
            aria-pressed={priorityFirst}
          >
            {priorityLabel}
          </button>
        </div>
      </div>
      {priorityFirst ? <div className="ud-timeline-sort-hint">{sortHint}</div> : null}
      {visibleEvents.map((evt, i) => (
        <div key={`${evt.type}-${i}`} className="ud-timeline-item">
          <div className="ud-timeline-line" />
          <div className="ud-timeline-icon">{getIcon(evt.type)}</div>
          <div className="ud-timeline-content">
            <div className="ud-timeline-event">
              <span className={`ud-timeline-severity-dot ud-timeline-severity-dot--${getSeverity(evt)}`} />
              {getEventLabel(evt.type)}
              {evt.item && <span className="ud-timeline-item-name">{itemJoiner}{evt.item}</span>}
            </div>
            <div className="ud-timeline-time">{formatTime(evt.timestamp)}</div>
          </div>
        </div>
      ))}
      {hasMore ? (
        <button
          type="button"
          className="ud-timeline-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {toggleLabel}
        </button>
      ) : null}
    </div>
  );
}

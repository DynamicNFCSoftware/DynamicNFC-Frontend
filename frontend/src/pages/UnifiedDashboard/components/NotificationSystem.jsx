import { useCallback, useEffect, useRef, useState } from "react";
import { useSector } from "../../../hooks/useSector";
import { useRegion } from "../../../hooks/useRegion";
import { useLanguage } from "../../../i18n";
import { getPersonas } from "../../../config/regionConfig";
import { getEventLabel } from "../../../i18n/eventDisplayMap";

const CROSS_TAB_CHANNEL = "dnfc_tracking";

const ICON_BY_EVENT = {
  request_pricing: "💰",
  request_quote: "💰",
  book_viewing: "📋",
  test_drive_request: "🚗",
  vehicle_view: "👀",
  view_unit: "👀",
  view_floor_plan: "🏗️",
  compare_units: "⚖️",
  compare_vehicles: "⚖️",
  payment_plan_viewed: "💳",
  lease_plan_viewed: "💳",
  roi_calculator: "📈",
  finance_calculator: "📈",
  download_brochure: "📄",
  save_configuration: "⚙️",
  contact_agent: "📞",
  contact_advisor: "📞",
};

const EVENT_ALIAS = {
  pricing_request: "request_pricing",
  request_payment: "payment_plan_viewed",
  request_payment_plan: "payment_plan_viewed",
  request_quote: "request_quote",
  quote_request: "request_quote",
  cta_booking: "book_viewing",
  book_test_drive: "test_drive_request",
  use_roi_calculator: "roi_calculator",
  roi_calculator_click: "roi_calculator",
  floorplan_view: "view_floor_plan",
  floorplan_download: "download_brochure",
  brochure_download: "download_brochure",
  compare_add: "compare_units",
  unit_compare: "compare_units",
  unit_view: "view_unit",
};

const MOCK_EVENT_CODES = {
  real_estate: [
    "request_pricing",
    "book_viewing",
    "payment_plan_viewed",
    "download_brochure",
    "view_floor_plan",
    "roi_calculator",
    "compare_units",
  ],
  automotive: [
    "request_quote",
    "test_drive_request",
    "finance_calculator",
    "download_brochure",
    "vehicle_view",
    "save_configuration",
    "compare_vehicles",
  ],
  yacht: [
    "request_quote",
    "book_viewing",
    "payment_plan_viewed",
    "download_brochure",
    "view_unit",
    "contact_advisor",
    "compare_units",
  ],
};

const UI = {
  en: {
    liveTitle: "New Live Activity",
    liveBody: "A new event was captured",
    notifications: "Notifications",
    dismiss: "Dismiss",
    visitor: "Visitor",
  },
  ar: {
    liveTitle: "نشاط مباشر جديد",
    liveBody: "تم تسجيل حدث جديد",
    notifications: "الإشعارات",
    dismiss: "إغلاق",
    visitor: "زائر",
  },
  es: {
    liveTitle: "Nueva actividad en vivo",
    liveBody: "Se capturo un nuevo evento",
    notifications: "Notificaciones",
    dismiss: "Cerrar",
    visitor: "Visitante",
  },
  fr: {
    liveTitle: "Nouvelle activite en direct",
    liveBody: "Un nouvel evenement a ete capture",
    notifications: "Notifications",
    dismiss: "Fermer",
    visitor: "Visiteur",
  },
};

function normalizeSector(rawSector) {
  const value = String(rawSector || "").toLowerCase().replace(/[\s-]/g, "_");
  if (value === "realestate" || value === "real_estate") return "real_estate";
  if (value === "automotive") return "automotive";
  if (value === "yacht" || value === "yachts") return "yacht";
  return "real_estate";
}

function normalizeEventCode(rawEvent) {
  const normalized = String(rawEvent || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
  return EVENT_ALIAS[normalized] || normalized || "manual";
}

export default function NotificationSystem({
  dataMode,
  events = [],
  sectorId: sectorIdProp,
  regionId: regionIdProp,
  lang: langProp,
}) {
  const [notifications, setNotifications] = useState([]);
  const { sectorId: hookSectorId, config } = useSector();
  const { regionId: hookRegionId } = useRegion();
  const { lang: hookLang } = useLanguage();
  const sectorId = sectorIdProp || hookSectorId;
  const regionId = regionIdProp || hookRegionId;
  const lang = langProp || hookLang;
  const tx = UI[lang] || UI.en;
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const lastRealtimeEventRef = useRef(null);
  const lastCrossTabEventRef = useRef(null);
  const sectorKey = normalizeSector(sectorId);

  const pushLiveNotification = useCallback((payload = {}) => {
    const eventCode = normalizeEventCode(payload.event || payload.type || "manual");
    const actor = payload.vipName || payload.userName || payload.leadName || tx.visitor;
    const item = payload.unitName || payload.item || payload.vehicleName || payload.unitId || payload.vehicleId;
    const eventLabel = getEventLabel(eventCode, lang, sectorKey);
    const body = item ? `${actor} - ${eventLabel} -> ${item}` : `${actor} - ${eventLabel}`;

    const realtimeNotif = {
      id: ++idCounter.current,
      icon: ICON_BY_EVENT[eventCode] || "⚡",
      title: tx.liveTitle,
      body,
      timestamp: new Date(),
      removing: false,
    };

    setNotifications((prev) => [realtimeNotif, ...prev].slice(0, 8));
  }, [lang, sectorKey, tx.liveTitle, tx.visitor]);

  const addNotification = useCallback(() => {
    const personas = getPersonas(sectorId, regionId);
    const names = personas.map((p) => p.name);
    const eventCodes = MOCK_EVENT_CODES[sectorKey] || MOCK_EVENT_CODES.real_estate;
    const eventCode = eventCodes[Math.floor(Math.random() * eventCodes.length)];
    const name = names.length > 0 ? names[Math.floor(Math.random() * names.length)] : tx.visitor;
    const cats = config?.inventory?.categories || [];
    const randomCat = cats.length > 0 ? cats[Math.floor(Math.random() * cats.length)] : null;
    const unitExample = randomCat
      ? (randomCat.name?.[lang] || randomCat.name?.en || randomCat.id)
      : null;
    const eventLabel = getEventLabel(eventCode, lang, sectorKey);
    const bodyText = unitExample ? `${name} - ${eventLabel} -> ${unitExample}` : `${name} - ${eventLabel}`;

    const notif = {
      id: ++idCounter.current,
      icon: ICON_BY_EVENT[eventCode] || "⚡",
      title: eventLabel,
      body: bodyText,
      timestamp: new Date(),
      removing: false,
    };

    setNotifications((prev) => [notif, ...prev].slice(0, 4));

    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, removing: true } : n)));
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      }, 400);
    }, 6000);
  }, [config, lang, regionId, sectorId, sectorKey, tx.visitor]);

  useEffect(() => {
    if (dataMode !== "mock") return undefined;

    const initial = setTimeout(() => {
      addNotification();
      timerRef.current = setInterval(() => {
        addNotification();
      }, 25000);
    }, 8000);

    return () => {
      clearTimeout(initial);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [addNotification, dataMode]);

  useEffect(() => {
    if ((dataMode !== "firestore" && dataMode !== "tenant") || events.length === 0) return;
    const latest = events[0];
    const latestKey = latest.id || `${latest.personId || "visitor"}-${latest.timestamp}`;
    if (!lastRealtimeEventRef.current) {
      lastRealtimeEventRef.current = latestKey;
      return;
    }
    if (lastRealtimeEventRef.current === latestKey) return;
    lastRealtimeEventRef.current = latestKey;

    const realtimeNotif = {
      id: ++idCounter.current,
      icon: "⚡",
      title: tx.liveTitle,
      body: latest.description || tx.liveBody,
      timestamp: new Date(),
      removing: false,
    };

    setNotifications((prev) => [realtimeNotif, ...prev].slice(0, 8));
  }, [events, dataMode, lang]);

  useEffect(() => {
    if (dataMode !== "mock") return undefined;

    let bc;
    try {
      bc = new BroadcastChannel(CROSS_TAB_CHANNEL);
      bc.onmessage = (incoming) => {
        const payload = incoming?.data;
        if (!payload || (!payload.event && !payload.type)) return;
        const key = payload.id || `${payload.vipName || payload.userName || payload.leadName || "visitor"}-${payload.timestamp || Date.now()}`;
        if (lastCrossTabEventRef.current === key) return;
        lastCrossTabEventRef.current = key;
        pushLiveNotification(payload);
      };
    } catch (_) {
      // BroadcastChannel may be unavailable in older/private browser contexts.
    }

    return () => {
      bc?.close?.();
    };
  }, [dataMode, pushLiveNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, removing: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="ud-notif-container" role="log" aria-label={tx.notifications} aria-live="polite">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`ud-notif ${n.removing ? "ud-notif-exit" : "ud-notif-enter"}`}
        >
          <span className="ud-notif-icon" aria-hidden="true">{n.icon}</span>
          <div className="ud-notif-body">
            <div className="ud-notif-title">{n.title}</div>
            <div className="ud-notif-text">{n.body}</div>
          </div>
          <button
            type="button"
            className="ud-notif-close"
            onClick={() => removeNotification(n.id)}
            aria-label={tx.dismiss}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

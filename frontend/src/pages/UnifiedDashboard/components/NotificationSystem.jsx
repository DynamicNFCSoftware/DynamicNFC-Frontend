import { useCallback, useEffect, useRef, useState } from "react";
import { useSector } from "../../../hooks/useSector";
import { useRegion } from "../../../hooks/useRegion";
import { useLanguage } from "../../../i18n";
import { getPersonas } from "../../../config/regionConfig";

const TEMPLATES = {
  real_estate: {
    en: [
      { icon: "🔥", title: "Hot Lead Alert", body: (n) => `${n} viewed pricing 3 times in 24h` },
      { icon: "📋", title: "New Booking Request", body: (n) => `${n} requested a viewing for Penthouse A-1201` },
      { icon: "📊", title: "Score Jump", body: (n) => `${n}'s lead score increased by +15 points` },
      { icon: "📄", title: "Brochure Downloaded", body: (n) => `${n} downloaded the project brochure` },
      { icon: "💰", title: "Payment Plan Viewed", body: (n) => `${n} viewed the 60/40 payment plan` },
      { icon: "🏗️", title: "Floor Plan Opened", body: (n) => `${n} opened floor plan for 3BR B-801` },
      { icon: "⚡", title: "ROI Calculator Used", body: (n) => `${n} ran ROI projections` },
    ],
    ar: [
      { icon: "🔥", title: "تنبيه عميل ساخن", body: (n) => `${n} شاهد التسعير 3 مرات في 24 ساعة` },
      { icon: "📋", title: "طلب حجز جديد", body: (n) => `${n} طلب معاينة بنتهاوس A-1201` },
      { icon: "📊", title: "ارتفاع الدرجة", body: (n) => `درجة ${n} ارتفعت +15 نقطة` },
      { icon: "📄", title: "تحميل الكتيب", body: (n) => `${n} حمّل كتيب المشروع` },
      { icon: "💰", title: "خطة الدفع", body: (n) => `${n} شاهد خطة الدفع 60/40` },
      { icon: "🏗️", title: "مخطط الطابق", body: (n) => `${n} فتح مخطط طابق 3 غرف B-801` },
      { icon: "⚡", title: "حاسبة العائد", body: (n) => `${n} أجرى توقعات العائد` },
    ],
    fr: [
      { icon: "🔥", title: "Alerte prospect chaud", body: (n) => `${n} a consulté les prix 3 fois en 24h` },
      { icon: "📋", title: "Nouvelle demande de visite", body: (n) => `${n} a demandé une visite pour Penthouse A-1201` },
      { icon: "📊", title: "Score en hausse", body: (n) => `Le score de ${n} a augmenté de +15 points` },
      { icon: "📄", title: "Brochure téléchargée", body: (n) => `${n} a téléchargé la brochure du projet` },
      { icon: "💰", title: "Plan de paiement consulté", body: (n) => `${n} a consulté le plan de paiement 60/40` },
      { icon: "🏗️", title: "Plan d'étage ouvert", body: (n) => `${n} a ouvert le plan d'étage 3BR B-801` },
      { icon: "⚡", title: "Calculateur ROI utilisé", body: (n) => `${n} a lancé des projections ROI` },
    ],
  },
  automotive: {
    en: [
      { icon: "🔥", title: "Hot Lead Alert", body: (n) => `${n} requested a quote for AMG GT 63 S` },
      { icon: "🚗", title: "Test Drive Booked", body: (n) => `${n} booked a test drive for G-Class G63` },
      { icon: "📊", title: "Score Jump", body: (n) => `${n}'s lead score increased by +12 points` },
      { icon: "⚙️", title: "Configuration Saved", body: (n) => `${n} saved a custom G63 in Obsidian Black` },
      { icon: "💰", title: "Finance Calculator", body: (n) => `${n} used the finance calculator` },
      { icon: "📄", title: "Brochure Downloaded", body: (n) => `${n} downloaded the vehicle brochure` },
    ],
    ar: [
      { icon: "🔥", title: "تنبيه عميل ساخن", body: (n) => `${n} طلب عرض سعر AMG GT 63 S` },
      { icon: "🚗", title: "تجربة قيادة محجوزة", body: (n) => `${n} حجز تجربة قيادة G-Class G63` },
      { icon: "📊", title: "ارتفاع الدرجة", body: (n) => `درجة ${n} ارتفعت +12 نقطة` },
      { icon: "⚙️", title: "تكوين محفوظ", body: (n) => `${n} حفظ تكوين G63 أسود` },
      { icon: "💰", title: "حاسبة التمويل", body: (n) => `${n} استخدم حاسبة التمويل` },
      { icon: "📄", title: "تحميل الكتيب", body: (n) => `${n} حمّل كتيب المركبة` },
    ],
    fr: [
      { icon: "🔥", title: "Alerte prospect chaud", body: (n) => `${n} a demandé un devis pour AMG GT 63 S` },
      { icon: "🚗", title: "Essai routier réservé", body: (n) => `${n} a réservé un essai routier pour G-Class G63` },
      { icon: "📊", title: "Score en hausse", body: (n) => `Le score de ${n} a augmenté de +12 points` },
      { icon: "⚙️", title: "Configuration sauvegardée", body: (n) => `${n} a sauvegardé un G63 Obsidian Black` },
      { icon: "💰", title: "Calculateur financier", body: (n) => `${n} a utilisé le calculateur financier` },
      { icon: "📄", title: "Brochure téléchargée", body: (n) => `${n} a téléchargé la brochure du véhicule` },
    ],
  },
};

const UI = {
  en: {
    liveTitle: "New Live Activity",
    liveBody: "A new event was captured",
    notifications: "Notifications",
    dismiss: "Dismiss",
  },
  ar: {
    liveTitle: "نشاط مباشر جديد",
    liveBody: "تم تسجيل حدث جديد",
    notifications: "الإشعارات",
    dismiss: "إغلاق",
  },
  es: {
    liveTitle: "Nueva actividad en vivo",
    liveBody: "Se capturo un nuevo evento",
    notifications: "Notificaciones",
    dismiss: "Cerrar",
  },
  fr: {
    liveTitle: "Nouvelle activite en direct",
    liveBody: "Un nouvel evenement a ete capture",
    notifications: "Notifications",
    dismiss: "Fermer",
  },
};

export default function NotificationSystem({ dataMode, events = [] }) {
  const [notifications, setNotifications] = useState([]);
  const { sectorId, config } = useSector();
  const { regionId } = useRegion();
  const { lang } = useLanguage();
  const tx = UI[lang] || UI.en;
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const lastRealtimeEventRef = useRef(null);

  const addNotification = useCallback(() => {
    const templates = TEMPLATES[sectorId]?.[lang] || TEMPLATES.real_estate.en;
    const personas = getPersonas(sectorId, regionId);
    const names = personas.map((p) => p.name);
    const template = templates[Math.floor(Math.random() * templates.length)];
    const name = names.length > 0 ? names[Math.floor(Math.random() * names.length)] : "VIP";
    // Inject config-derived unit names into templates that reference specific units
    const cats = config?.inventory?.categories || [];
    const randomCat = cats.length > 0 ? cats[Math.floor(Math.random() * cats.length)] : null;
    const unitExample = randomCat ? (randomCat.name?.[lang] || randomCat.name?.en || randomCat.id) : null;

    // Replace hardcoded unit refs in body with config-derived names
    const bodyText = unitExample
      ? template.body(name).replace(/Penthouse A-1201|3BR B-801|AMG GT 63 S|G-Class G63/g, unitExample)
      : template.body(name);

    const notif = {
      id: ++idCounter.current,
      icon: template.icon,
      title: template.title,
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
  }, [lang, sectorId, regionId]);

  useEffect(() => {
    if (dataMode !== "mock") return undefined;

    const initial = setTimeout(() => {
      addNotification();
      timerRef.current = setInterval(() => {
        addNotification();
      }, 20000 + Math.random() * 10000);
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
          className={`ud-notif-card${n.removing ? " ud-notif-card--removing" : ""}`}
        >
          <span className="ud-notif-icon" aria-hidden="true">{n.icon}</span>
          <div className="ud-notif-body">
            <div className="ud-notif-title">{n.title}</div>
            <div className="ud-notif-text">{n.body}</div>
          </div>
          <button
            type="button"
            className="ud-notif-dismiss"
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

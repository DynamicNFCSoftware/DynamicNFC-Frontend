/** One relative-time map for the unified dashboard.
 *  en/fr/es/ar follow the form shared by CardsTab and InventoryTab; English keeps "ago", under a minute reads "just now".
 *  Italian uses the product forms: ora, "5 min fa", "3 h fa", "2 g fa".
 */

const FORMS = {
  en: {
    now: () => "just now",
    m: (n) => `${n}m ago`,
    h: (n) => `${n}h ago`,
    d: (n) => `${n}d ago`,
    idle: "d idle",
  },
  it: {
    now: () => "ora",
    m: (n) => `${n} min fa`,
    h: (n) => `${n} h fa`,
    d: (n) => `${n} g fa`,
    idle: "g inattivo",
  },
  fr: {
    now: () => "à l'instant",
    m: (n) => `il y a ${n}m`,
    h: (n) => `il y a ${n}h`,
    d: (n) => `il y a ${n}j`,
    idle: "j inactif",
  },
  es: {
    now: () => "ahora",
    m: (n) => `hace ${n}m`,
    h: (n) => `hace ${n}h`,
    d: (n) => `hace ${n}d`,
    idle: "d inactivo",
  },
  ar: {
    now: () => "الآن",
    m: (n) => `منذ ${n} د`,
    h: (n) => `منذ ${n} س`,
    d: (n) => `منذ ${n} ي`,
    idle: " يوم خمول",
  },
};

export function toMillis(ts) {
  if (ts == null || ts === "") return null;
  if (typeof ts?.toMillis === "function") {
    const n = ts.toMillis();
    return Number.isFinite(n) ? n : null;
  }
  if (typeof ts?.toDate === "function") {
    const n = ts.toDate().getTime();
    return Number.isFinite(n) ? n : null;
  }
  const n = ts instanceof Date ? ts.getTime() : new Date(ts).getTime();
  return Number.isFinite(n) ? n : null;
}

export function timeAgo(ts, lang = "en") {
  const ms = toMillis(ts);
  if (ms == null) return "";
  const form = FORMS[lang] || FORMS.en;
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return form.now();
  if (mins < 60) return form.m(mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return form.h(hrs);
  return form.d(Math.floor(hrs / 24));
}

export function idleSuffix(lang = "en") {
  return (FORMS[lang] || FORMS.en).idle;
}

export const STATUS_ORDER = { draft: 0, active: 1, paused: 2, archived: 3 };
export const STATUS_COLORS = { draft: "#6ba3c7", active: "#2a9d8f", paused: "#e9c46a", archived: "#999" };
export const STATUS_ICONS = {
  draft: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.06 4.94l5 5M5 19h5l10-10-5-5L5 14v5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  active: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 12.3l2.2 2.2 4.8-4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  paused: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6.5" y="5" width="4" height="14" rx="1.2" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" stroke="currentColor" stroke-width="1.8"/></svg>',
  archived: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7.5h16v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-11z" stroke="currentColor" stroke-width="1.8"/><path d="M3 7.5h18V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5zM10 12h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

export const VALID_NEXT = {
  draft: ["active"],
  active: ["paused", "archived"],
  paused: ["active", "archived"],
  archived: [],
};

export const DEAL_STAGE_CONVERSION_WEIGHT = {
  inquiry: 0.0,
  new_lead: 0.0,
  contacted: 0.25,
  viewing_scheduled: 0.5,
  viewing_done: 0.7,
  test_drive: 0.7,
  quote_sent: 0.7,
  negotiation: 0.9,
  offer_sent: 0.9,
  financing: 0.9,
  closed_won: 1.0,
  closed_lost: 0.0,
};

export const OBJECTIVES = ["lead_gen", "awareness", "re_engage", "event"];
export const AUDIENCES = ["vip", "warm", "cold", "all"];
export const CHANNELS = ["nfc", "email", "sms", "whatsapp", "event", "mixed"];

export function normalizeConversionWeights(rawWeights = {}) {
  const out = {};
  if (!rawWeights || typeof rawWeights !== "object") return out;
  Object.entries(rawWeights).forEach(([stage, value]) => {
    const key = String(stage || "").trim().toLowerCase();
    if (!key) return;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    out[key] = Math.max(0, Math.min(1, numeric));
  });
  return out;
}

export function formatDate(d) {
  if (!d) return "—";
  const date = d.toDate ? d.toDate() : new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function timeAgo(d) {
  if (!d) return "—";
  const date = d.toDate ? d.toDate() : new Date(d);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function sourceLabel(source, tx) {
  if (source === "cards_tab_assign") return tx.sourceCardsTab || "Cards Tab";
  if (source === "manual") return tx.sourceManual || "Manual";
  if (source === "api") return tx.sourceApi || "API";
  return source || "—";
}

export function objectiveLabel(obj, tx) {
  if (!obj) return "—";
  return tx[`obj_${obj}`] || obj;
}

export function channelBadges(channels, tx) {
  if (!Array.isArray(channels) || channels.length === 0) return "—";
  return channels.map((ch) => tx[`ch_${ch}`] || ch).join(", ");
}

export function buildDefaultCampaignName() {
  const now = new Date();
  const month = now.toLocaleString("en", { month: "short" });
  return `Campaign ${month} ${now.getDate()}`;
}

export function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function buildSevenDaySeries(taps) {
  const now = new Date();
  const series = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = (taps || []).filter((t) => {
      const ts = t.timestamp?.toDate ? t.timestamp.toDate() : new Date(t.timestamp);
      return ts.toISOString().slice(0, 10) === key;
    }).length;
    series.push({ day: label, taps: count });
  }
  return series;
}
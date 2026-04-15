export const STATUS_ORDER = { draft: 0, active: 1, paused: 2, archived: 3 };
export const STATUS_COLORS = { draft: "#6ba3c7", active: "#2a9d8f", paused: "#e9c46a", archived: "#999" };
export const STATUS_ICONS = { draft: "✏️", active: "🟢", paused: "⏸", archived: "📦" };

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
  if (source === "cards_tab_bulk") return tx.sourceBulk || "Bulk";
  if (source === "inventory_tab") return tx.sourceInventory || "Inventory";
  return tx.sourceManual || "Manual";
}

export function objectiveLabel(obj, tx) {
  return tx[`obj_${obj}`] || obj || "—";
}

export function channelBadges(channels, tx) {
  if (!channels || channels.length === 0) return "—";
  return channels.map((ch) => tx[`ch_${ch}`] || ch).join(", ");
}

export function buildDefaultCampaignName() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10);
  const timePart = now.toTimeString().slice(0, 5).replace(":", "");
  return `NFC Card Campaign ${datePart} ${timePart}`;
}

export function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function buildSevenDaySeries(byDay = {}) {
  const series = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ day: key.slice(5), taps: byDay[key] || 0 });
  }
  return series;
}

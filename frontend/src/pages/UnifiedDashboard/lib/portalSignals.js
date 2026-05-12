// Live-signal derivation for the sidebar Portal Links flyout.
// Pure JS — no React. useDashboard.events already region+sector filtered upstream
// (per CLAUDE.md §11 — trust internal code, no defensive re-filtering here).

export const PORTAL_SIGNAL_THRESHOLDS = {
  ACTIVE_WINDOW_MS: 5 * 60 * 1000,                // event in last 5 min → 🟢 active
  RECENT_WINDOW_MS: 7 * 24 * 60 * 60 * 1000,      // count window for "X this week"
  // Idle is computed from "no events ever for this portal type" — not a time cutoff.
};

function tsOf(e) {
  const v = e?.timestamp || e?.createdAt || e?.ts;
  if (typeof v === "number") return v;
  if (v && typeof v.toMillis === "function") return v.toMillis();
  const n = new Date(v).getTime();
  return Number.isFinite(n) ? n : 0;
}

function portalTypeOf(e) {
  return String(e?.portalType || "").toLowerCase();
}

/**
 * Derive per-portal-type signals from an events array.
 * @param {Array} events - region+sector-filtered events from useDashboard()
 * @param {number} [now=Date.now()] - injectable for tests
 * @returns {{vip: Signal, registered: Signal, anonymous: Signal}}
 *   Signal = { active: boolean, recentCount: number, lastEventAt: number|null, idle: boolean }
 *   - recentCount counts events in last 7d window
 *   - lastEventAt is the most recent timestamp regardless of window
 *   - idle = literally zero events ever recorded for this portal type
 */
export function derivePortalSignals(events, now = Date.now()) {
  const recent = { vip: 0, registered: 0, anonymous: 0 };
  const lastTs = { vip: 0, registered: 0, anonymous: 0 };

  (events || []).forEach((e) => {
    const type = portalTypeOf(e);
    if (!(type in recent)) return;
    const ts = tsOf(e);
    if (!ts) return;
    // Always update lastTs regardless of window — that's how we know "any event ever".
    if (ts > lastTs[type]) lastTs[type] = ts;
    // Only count within the recent window.
    if (now - ts <= PORTAL_SIGNAL_THRESHOLDS.RECENT_WINDOW_MS) {
      recent[type] += 1;
    }
  });

  const result = {};
  Object.keys(recent).forEach((type) => {
    const ts = lastTs[type];
    const ageMs = ts ? now - ts : Infinity;
    result[type] = {
      active: ts > 0 && ageMs <= PORTAL_SIGNAL_THRESHOLDS.ACTIVE_WINDOW_MS,
      recentCount: recent[type],
      lastEventAt: ts || null,
      idle: ts === 0,
    };
  });
  return result;
}

/**
 * Compact age formatter — "just now" / "3m" / "5h" / "2d"
 * Suffix labels come from i18n.
 */
export function formatPortalAge(ageMs, labels) {
  if (!Number.isFinite(ageMs) || ageMs < 0) return "";
  if (ageMs < 60_000) return labels.now;
  const min = Math.floor(ageMs / 60_000);
  if (min < 60) return `${min}${labels.minShort}`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}${labels.hourShort}`;
  return `${Math.floor(hr / 24)}${labels.dayShort}`;
}

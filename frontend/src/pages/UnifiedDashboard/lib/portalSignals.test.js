import { describe, it, expect } from "vitest";
import { derivePortalSignals, formatPortalAge, PORTAL_SIGNAL_THRESHOLDS } from "./portalSignals";

// Fixed timestamp so tests don't drift with the wall clock.
const NOW = new Date("2026-05-11T12:00:00Z").getTime();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// Helper — build a portal event N ms before NOW.
function evt(portalType, agoMs, extra = {}) {
  return { portalType, timestamp: new Date(NOW - agoMs).toISOString(), ...extra };
}

describe("derivePortalSignals", () => {
  it("empty events → all three portal types are idle", () => {
    const result = derivePortalSignals([], NOW);

    expect(result.vip).toEqual({ active: false, recentCount: 0, lastEventAt: null, idle: true });
    expect(result.registered).toEqual({ active: false, recentCount: 0, lastEventAt: null, idle: true });
    expect(result.anonymous).toEqual({ active: false, recentCount: 0, lastEventAt: null, idle: true });
  });

  it("VIP event 2 minutes ago → vip.active=true, recentCount=1, not idle", () => {
    const events = [evt("vip", 2 * MIN)];
    const result = derivePortalSignals(events, NOW);

    expect(result.vip.active).toBe(true);
    expect(result.vip.recentCount).toBe(1);
    expect(result.vip.idle).toBe(false);
    expect(result.vip.lastEventAt).toBe(NOW - 2 * MIN);
  });

  it("VIP event 3 days ago → not active, still counts in 7d window, not idle", () => {
    const events = [evt("vip", 3 * DAY)];
    const result = derivePortalSignals(events, NOW);

    expect(result.vip.active).toBe(false);
    expect(result.vip.recentCount).toBe(1);
    expect(result.vip.idle).toBe(false);
    expect(result.vip.lastEventAt).toBe(NOW - 3 * DAY);
  });

  it("VIP event 10 days ago (outside 7d window) → recentCount=0 but lastEventAt still set, not idle", () => {
    const events = [evt("vip", 10 * DAY)];
    const result = derivePortalSignals(events, NOW);

    expect(result.vip.active).toBe(false);
    expect(result.vip.recentCount).toBe(0); // outside 7d count window
    expect(result.vip.lastEventAt).toBe(NOW - 10 * DAY); // but we still remember it
    expect(result.vip.idle).toBe(false); // idle = no events EVER, not "no events in 7d"
  });

  it("mixed events → each portal type bucketed independently", () => {
    const events = [
      evt("vip", 30 * MIN),       // VIP — within 7d but not active (>5min)
      evt("vip", 4 * MIN),        // VIP — active (within 5min)
      evt("anonymous", 1 * DAY),  // anon — within 7d
      // no "registered" events → should be idle
    ];
    const result = derivePortalSignals(events, NOW);

    expect(result.vip.active).toBe(true);
    expect(result.vip.recentCount).toBe(2);
    expect(result.vip.lastEventAt).toBe(NOW - 4 * MIN);

    expect(result.anonymous.active).toBe(false);
    expect(result.anonymous.recentCount).toBe(1);
    expect(result.anonymous.idle).toBe(false);

    expect(result.registered.idle).toBe(true);
    expect(result.registered.recentCount).toBe(0);
    expect(result.registered.lastEventAt).toBe(null);
  });
});

describe("formatPortalAge", () => {
  const labels = { now: "now", minShort: "m", hourShort: "h", dayShort: "d" };

  it("under 60 seconds → 'now'", () => {
    expect(formatPortalAge(30 * 1000, labels)).toBe("now");
  });

  it("3 minutes → '3m'", () => {
    expect(formatPortalAge(3 * MIN, labels)).toBe("3m");
  });

  it("2 hours → '2h'", () => {
    expect(formatPortalAge(2 * HOUR, labels)).toBe("2h");
  });

  it("5 days → '5d'", () => {
    expect(formatPortalAge(5 * DAY, labels)).toBe("5d");
  });
});

describe("PORTAL_SIGNAL_THRESHOLDS", () => {
  it("active window is 5 minutes", () => {
    expect(PORTAL_SIGNAL_THRESHOLDS.ACTIVE_WINDOW_MS).toBe(5 * MIN);
  });

  it("recent window is 7 days", () => {
    expect(PORTAL_SIGNAL_THRESHOLDS.RECENT_WINDOW_MS).toBe(7 * DAY);
  });
});

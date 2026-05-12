import { describe, it, expect } from "vitest";
import { detectTriggers, THRESHOLDS } from "./triggerRules";

// Fixed timestamp so tests are deterministic.
const NOW = new Date("2026-05-11T12:00:00Z").getTime();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// Helpers — build seed-style events (vipName, no vipId — matches actual seed shape).
function evt(vipName, eventType, agoMs, extra = {}) {
  return {
    vipName,
    event: eventType,
    timestamp: new Date(NOW - agoMs).toISOString(),
    portalType: "vip",
    ...extra,
  };
}
function vip(id, name, score = 70) {
  return { id, name, score };
}

const KHALID = vip("khalid-al-rashid", "Khalid Al-Rashid", 87);
const FATIMA = vip("fatima-al-mansouri", "Fatima Al-Mansouri", 65);

describe("detectTriggers — basic shape", () => {
  it("empty input → {hot:[], warm:[]}", () => {
    expect(detectTriggers([], [], [], { now: NOW })).toEqual({ hot: [], warm: [] });
  });

  it("event from unknown VIP (no match) → no triggers", () => {
    // vipName "Someone Else" not in vips list → enrich filters out
    const events = [evt("Someone Else", "pricing_request", 1 * HOUR)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });
    expect(result.hot).toHaveLength(0);
    expect(result.warm).toHaveLength(0);
  });
});

describe("HIGH_INTENT detection", () => {
  it("VIP pricing_request → 1 HOT trigger", () => {
    const events = [evt("Khalid Al-Rashid", "pricing_request", 1 * HOUR)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });

    expect(result.hot).toHaveLength(1);
    expect(result.hot[0].ruleType).toBe("HIGH_INTENT");
    expect(result.hot[0].vipName).toBe("Khalid Al-Rashid");
    expect(result.hot[0].urgency).toBe("hot");
  });

  it("VIP brochure_download → HOT", () => {
    const events = [evt("Khalid Al-Rashid", "brochure_download", 30 * MIN)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });
    expect(result.hot[0].signalKey).toBe("stpSignalBrochure");
  });

  it("VIP book_viewing → HOT (booking signal)", () => {
    const events = [evt("Khalid Al-Rashid", "book_viewing", 15 * MIN)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });
    expect(result.hot[0].signalKey).toBe("stpSignalBooking");
  });
});

describe("vipName fallback (FIX 2 — events have vipName, not vipId)", () => {
  it("event with vipName-only resolves to correct VIP via name matching", () => {
    // Critical: seed events carry only vipName. The enrich() helper must
    // fall back to name matching, OR all triggers would be filtered out.
    const events = [
      { vipName: "Khalid Al-Rashid", event: "pricing_request", timestamp: new Date(NOW - HOUR).toISOString() },
    ];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });

    expect(result.hot).toHaveLength(1);
    expect(result.hot[0].vipId).toBe("khalid-al-rashid"); // stamped from vip.id
  });

  it("name match is case-insensitive and whitespace-trimmed", () => {
    const events = [
      { vipName: "  KHALID al-rashid  ", event: "pricing_request", timestamp: new Date(NOW - HOUR).toISOString() },
    ];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });
    expect(result.hot).toHaveLength(1);
  });
});

describe("ROI_COMPLETED detection (FIX 2 — roi_calculator_click alias)", () => {
  it("event type 'roi_calculator_click' (seed variant) maps to ROI_COMPLETED", () => {
    // Seed uses roi_calculator_click. ROI_KEYS must include this alias.
    const events = [evt("Khalid Al-Rashid", "roi_calculator_click", 2 * HOUR)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });

    expect(result.hot).toHaveLength(1);
    expect(result.hot[0].ruleType).toBe("ROI_COMPLETED");
  });

  it("does NOT also fire HIGH_INTENT for the same ROI event (delegation)", () => {
    const events = [evt("Khalid Al-Rashid", "roi_calculator_click", 2 * HOUR)];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });

    // Should be exactly 1 trigger, not 2 (HIGH_INTENT excludes ROI keys)
    expect(result.hot).toHaveLength(1);
  });
});

describe("Dedupe per VIP (FIX 4 — one row per VIP, strongest signal wins)", () => {
  it("VIP with HOT + WARM signals → only HOT row appears", () => {
    const events = [
      evt("Khalid Al-Rashid", "pricing_request", 3 * HOUR), // HIGH_INTENT hot
      evt("Khalid Al-Rashid", "view_unit", 30 * HOUR, { item: "A-1204" }),
      evt("Khalid Al-Rashid", "view_unit", 28 * HOUR, { item: "A-1204" }),
      // (no RE_ENGAGE because need 24h gap + recent — this is just noise)
    ];
    const result = detectTriggers(events, [KHALID], [], { now: NOW });

    // Both Khalid events could create separate triggers per (ruleType,vipId,item),
    // but dedupe collapses to ONE row for Khalid (the HOT one).
    const khalidRows = [...result.hot, ...result.warm].filter((t) => t.vipId === "khalid-al-rashid");
    expect(khalidRows).toHaveLength(1);
    expect(khalidRows[0].urgency).toBe("hot");
  });

  it("two different VIPs each get their own row", () => {
    const events = [
      evt("Khalid Al-Rashid", "pricing_request", 1 * HOUR),
      evt("Fatima Al-Mansouri", "contact_advisor", 1 * HOUR),
    ];
    const result = detectTriggers(events, [KHALID, FATIMA], [], { now: NOW });

    expect(result.hot).toHaveLength(2);
    const names = result.hot.map((t) => t.vipName).sort();
    expect(names).toEqual(["Fatima Al-Mansouri", "Khalid Al-Rashid"]);
  });
});

describe("Tier-balanced output (5 HOT + 3 WARM cap)", () => {
  it("returns at most 5 HOT + 3 WARM regardless of input count", () => {
    // Build 7 distinct VIPs each with a HIGH_INTENT event (all HOT)
    const vips = Array.from({ length: 7 }, (_, i) => vip(`v${i}`, `VIP ${i}`, 70));
    const events = vips.map((v, i) => evt(v.name, "pricing_request", (i + 1) * HOUR));
    const result = detectTriggers(events, vips, [], { now: NOW });

    expect(result.hot.length).toBeLessThanOrEqual(5);
    expect(result.warm.length).toBeLessThanOrEqual(3);
  });
});

describe("Defaults sanity (THRESHOLDS surface)", () => {
  it("REPEAT_VIEW window is 15 min", () => {
    expect(THRESHOLDS.REPEAT_VIEW_WINDOW_MS).toBe(15 * MIN);
  });

  it("HIGH_VALUE_DEAL_VALUE_MIN is 5M", () => {
    expect(THRESHOLDS.HIGH_VALUE_DEAL_VALUE_MIN).toBe(5_000_000);
  });
});

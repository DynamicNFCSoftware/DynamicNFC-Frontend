import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../firebase", () => ({
  db: { __mock: "firestore" },
  auth: { currentUser: null },
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((...args) => ({ __collectionRef: args.slice(1).join("/") })),
  addDoc: vi.fn(() => Promise.resolve({ id: "fake-doc-id" })),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  increment: vi.fn((n) => ({ __op: "increment", n })),
  serverTimestamp: vi.fn(() => ({ __op: "serverTimestamp" })),
}));

import { auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  EVENT_SCHEMA,
  trackDashboardEvent,
  calculateEngagementScore,
  describeEvent,
  getCategoryIcon,
  getCategoryColor,
} from "../firestoreTracking";

beforeEach(() => {
  vi.clearAllMocks();
  auth.currentUser = null;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EVENT_SCHEMA", () => {
  it("contains expected tracking keys", () => {
    expect(EVENT_SCHEMA).toHaveProperty("portal_open");
    expect(EVENT_SCHEMA).toHaveProperty("unit_view");
    expect(EVENT_SCHEMA).toHaveProperty("book_viewing");
    expect(EVENT_SCHEMA).toHaveProperty("contact_advisor");
    expect(EVENT_SCHEMA).toHaveProperty("trigger_acted_on");
  });

  it("uses valid category enum and numeric funnelWeight", () => {
    const validCategories = new Set(["browse", "engage", "intent", "action"]);
    Object.values(EVENT_SCHEMA).forEach((entry) => {
      expect(validCategories.has(entry.category)).toBe(true);
      expect(typeof entry.funnelWeight).toBe("number");
    });
  });

  it("sets trigger_acted_on as action with weight 12", () => {
    expect(EVENT_SCHEMA.trigger_acted_on.category).toBe("action");
    expect(EVENT_SCHEMA.trigger_acted_on.funnelWeight).toBe(12);
  });
});

describe("trackDashboardEvent", () => {
  it("returns without write when user is not authenticated", async () => {
    await trackDashboardEvent("trigger_acted_on", { vipId: "khalid" });
    expect(addDoc).toHaveBeenCalledTimes(0);
  });

  it("returns without write for unknown event name", async () => {
    auth.currentUser = { uid: "test-uid-123" };
    await trackDashboardEvent("unknown_event", { vipId: "khalid" });
    expect(addDoc).toHaveBeenCalledTimes(0);
  });

  it("writes exactly once for authenticated known event", async () => {
    auth.currentUser = { uid: "test-uid-123" };
    await trackDashboardEvent("trigger_acted_on", { vipId: "khalid" });
    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  it("writes canonical schema fields plus payload", async () => {
    auth.currentUser = { uid: "test-uid-123" };
    await trackDashboardEvent("trigger_acted_on", { vipId: "khalid", ruleType: "HIGH_INTENT" });

    const [, payload] = addDoc.mock.calls[0];
    expect(payload.event).toBe("trigger_acted_on");
    expect(payload.category).toBe("action");
    expect(payload.label).toBe("Acted on sales trigger");
    expect(payload.funnelWeight).toBe(12);
    expect(payload.source).toBe("dashboard");
    expect(payload.timestamp).toBeDefined();
    expect(payload.vipId).toBe("khalid");
    expect(payload.ruleType).toBe("HIGH_INTENT");
  });

  it("targets tenants/{uid}/events collection path", async () => {
    auth.currentUser = { uid: "test-uid-123" };
    await trackDashboardEvent("trigger_acted_on", { vipId: "khalid" });

    expect(collection).toHaveBeenCalledWith({ __mock: "firestore" }, "tenants", "test-uid-123", "events");
  });
});

describe("calculateEngagementScore", () => {
  it("returns NEW/none with zero score for empty events", () => {
    const out = calculateEngagementScore([]);
    expect(out.score).toBe(0);
    expect(out.label).toBe("NEW");
    expect(out.stage).toBe("none");
  });

  it("scores simple portal_open visits based on session count", () => {
    const out = calculateEngagementScore([
      { event: "portal_open", sessionId: "s1" },
      { event: "portal_open", sessionId: "s2" },
    ]);
    expect(out.score).toBe(10);
    expect(out.stage).toBe("browse");
  });

  it("increases score with pricing_request intent signal", () => {
    const out = calculateEngagementScore([
      { event: "pricing_request", sessionId: "s1", category: "intent" },
    ]);
    expect(out.score).toBeGreaterThanOrEqual(20);
  });

  it("moves to action stage for book_viewing action signal", () => {
    const out = calculateEngagementScore([
      { event: "book_viewing", sessionId: "s1", category: "action" },
    ]);
    expect(out.stage).toBe("action");
    expect(out.score).toBeGreaterThan(0);
  });
});

describe("describeEvent", () => {
  it("includes unit context for known events", () => {
    const text = describeEvent({
      event: "unit_view",
      details: { unitId: "A-1204", unitName: "Unit A-1204" },
    });
    expect(text).toContain("Viewed unit");
    expect(text).toContain("Unit A-1204");
  });

  it("falls back to raw event code when schema is unknown", () => {
    const text = describeEvent({ event: "mystery_event", details: {} });
    expect(text).toContain("mystery_event");
  });
});

describe("category helpers", () => {
  it("returns expected icon and hex color", () => {
    expect(getCategoryIcon("intent")).toBe("🎯");
    expect(getCategoryColor("action")).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("falls back to generic icon for unknown category", () => {
    expect(getCategoryIcon("mystery")).toBe("📋");
  });

  it("falls back to neutral color for unknown category", () => {
    expect(getCategoryColor("mystery")).toBe("#9ca3af");
  });
});


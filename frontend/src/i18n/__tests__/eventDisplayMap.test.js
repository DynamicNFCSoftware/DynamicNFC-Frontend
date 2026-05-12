import { describe, it, expect } from "vitest";
import { getEventLabel } from "../eventDisplayMap";

describe("getEventLabel — basic lookup", () => {
  it("known event 'view_unit' → 'Unit Viewed' in English", () => {
    expect(getEventLabel("view_unit", "en", "real_estate")).toBe("Unit Viewed");
  });

  it("known event 'book_viewing' → 'Booking Request'", () => {
    expect(getEventLabel("book_viewing", "en", "real_estate")).toBe("Booking Request");
  });

  it("known event 'contact_advisor' → 'Contact Advisor'", () => {
    expect(getEventLabel("contact_advisor", "en", "real_estate")).toBe("Contact Advisor");
  });
});

describe("getEventLabel — normalization", () => {
  it("camelCase input 'viewUnit' is normalized to 'view_unit' and resolved", () => {
    expect(getEventLabel("viewUnit", "en", "real_estate")).toBe("Unit Viewed");
  });

  it("uppercase 'VIEW_UNIT' is lowercased and resolved", () => {
    expect(getEventLabel("VIEW_UNIT", "en", "real_estate")).toBe("Unit Viewed");
  });

  it("kebab-case 'view-unit' is converted to underscore and resolved", () => {
    expect(getEventLabel("view-unit", "en", "real_estate")).toBe("Unit Viewed");
  });
});

describe("getEventLabel — fallbacks", () => {
  it("unknown event code falls back to the raw (normalized) code", () => {
    // If lookup misses every map, return the normalized code itself
    expect(getEventLabel("totally_made_up_event", "en", "real_estate"))
      .toBe("totally_made_up_event");
  });

  it("unknown lang falls back to English label", () => {
    // Hypothetical Turkish lang not in map — should still get English
    expect(getEventLabel("view_unit", "tr", "real_estate")).toBe("Unit Viewed");
  });

  it("empty / null event code returns empty string", () => {
    expect(getEventLabel("", "en", "real_estate")).toBe("");
    expect(getEventLabel(null, "en", "real_estate")).toBe("");
  });
});

describe("getEventLabel — sector override", () => {
  it("sector defaults to 'real_estate' when not provided", () => {
    // Same input + no sector arg → real_estate lookup
    expect(getEventLabel("view_unit", "en")).toBe("Unit Viewed");
  });

  it("sector normalization 'yachts' → 'yacht' AND yacht override applies", () => {
    // The normalizeSector helper maps 'yachts' (plural) to 'yacht'.
    // Yacht sector overrides 'view_unit' to "Yacht Viewed" — this single
    // assertion proves both behaviors: normalization + sector-specific lookup.
    expect(getEventLabel("view_unit", "en", "yachts")).toBe("Yacht Viewed");
  });

  it("real_estate sector returns generic label, automotive may differ", () => {
    // Same code, different sectors → different labels (when override exists)
    const re = getEventLabel("view_unit", "en", "real_estate");
    const yacht = getEventLabel("view_unit", "en", "yacht");
    // At minimum: yacht label is different from real_estate label
    expect(yacht).not.toBe(re);
  });
});

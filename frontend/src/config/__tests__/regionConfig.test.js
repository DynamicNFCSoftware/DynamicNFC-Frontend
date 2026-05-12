import { describe, it, expect } from "vitest";
import { getPersonas, getProjectName } from "../regionConfig";

describe("getPersonas — region × sector matrix", () => {
  it("Gulf + real_estate → 3 personas (Khalid VIP, Fatima VIP, Ahmed family)", () => {
    const personas = getPersonas("real_estate", "gulf");
    expect(personas).toHaveLength(3);
    const names = personas.map((p) => p.name);
    expect(names).toContain("Khalid Al-Rashid");
    expect(names).toContain("Fatima Al-Mansouri");
    expect(names).toContain("Ahmed Al-Fahad");
  });

  it("Gulf + automotive → 2 personas (different from real_estate)", () => {
    const personas = getPersonas("automotive", "gulf");
    expect(personas).toHaveLength(2);
    // Automotive Khalid is a different persona than real_estate Khalid
    const khalid = personas.find((p) => p.id === "vip1");
    expect(khalid.name).toBe("Khalid Al-Mansouri");
    expect(khalid.email).toBe("khalid@prestige.sa");
  });

  it("USA + real_estate → US-style names (James Mitchell, not Khalid)", () => {
    const personas = getPersonas("real_estate", "usa");
    expect(personas).toHaveLength(3);
    expect(personas.map((p) => p.name)).toContain("James Mitchell");
    expect(personas.map((p) => p.name)).not.toContain("Khalid Al-Rashid");
  });

  it("region ID is case-insensitive ('GULF' === 'gulf')", () => {
    const a = getPersonas("real_estate", "gulf");
    const b = getPersonas("real_estate", "GULF");
    expect(b).toHaveLength(a.length);
    expect(b[0].name).toBe(a[0].name);
  });

  it("region ID is whitespace-trimmed ('  gulf  ' works)", () => {
    const personas = getPersonas("real_estate", "  gulf  ");
    expect(personas).toHaveLength(3);
  });

  it("all sectors are populated for every region (no empty mappings)", () => {
    const regions = ["gulf", "usa", "mexico", "canada"];
    const sectors = ["real_estate", "automotive", "yacht"];
    regions.forEach((r) => {
      sectors.forEach((s) => {
        const personas = getPersonas(s, r);
        expect(personas.length).toBeGreaterThan(0);
        // Every persona must have an id and a name (downstream code depends on this)
        personas.forEach((p) => {
          expect(p.id).toBeTruthy();
          expect(p.name).toBeTruthy();
        });
      });
    });
  });

  it("VIP persona has id 'vip1' as canonical contract (used by seed + components)", () => {
    // The Sales Trigger Panel and seed scripts both look for personas[0]
    // having id "vip1". This is a load-bearing contract.
    const personas = getPersonas("real_estate", "canada");
    expect(personas.find((p) => p.id === "vip1")).toBeTruthy();
  });
});

describe("getProjectName", () => {
  it("Gulf real_estate → 'Al Noor Residences' in English", () => {
    expect(getProjectName("real_estate", "gulf", "en")).toBe("Al Noor Residences");
  });

  it("Gulf real_estate → Arabic translation when lang=ar", () => {
    expect(getProjectName("real_estate", "gulf", "ar")).toBe("مساكن النور");
  });

  it("USA real_estate → 'Skyline Towers'", () => {
    expect(getProjectName("real_estate", "usa", "en")).toBe("Skyline Towers");
  });

  it("Unknown lang falls back to English", () => {
    // No "fr" mapping for Gulf project name → falls through to en
    expect(getProjectName("real_estate", "gulf", "fr")).toBe("Al Noor Residences");
  });
});

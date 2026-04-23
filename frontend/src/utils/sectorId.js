export const INTERNAL_REAL_ESTATE_SECTOR_ID = "real_estate";
export const PUBLIC_REAL_ESTATE_SECTOR_ID = "realEstate";

export function normalizeSectorId(raw) {
  const value = String(raw || "").trim();
  if (!value) return INTERNAL_REAL_ESTATE_SECTOR_ID;

  const lowered = value.toLowerCase();
  if (
    ["real_estate", "real-estate", "realestate"].includes(lowered) ||
    value === PUBLIC_REAL_ESTATE_SECTOR_ID
  ) {
    return INTERNAL_REAL_ESTATE_SECTOR_ID;
  }
  if (lowered === "automotive") return "automotive";
  if (lowered === "yacht") return "yacht";
  return INTERNAL_REAL_ESTATE_SECTOR_ID;
}

export function toPublicSectorId(internalSectorId) {
  if (internalSectorId === INTERNAL_REAL_ESTATE_SECTOR_ID) {
    return PUBLIC_REAL_ESTATE_SECTOR_ID;
  }
  if (internalSectorId === "automotive") return "automotive";
  if (internalSectorId === "yacht") return "yacht";
  return PUBLIC_REAL_ESTATE_SECTOR_ID;
}

import { normalizeSectorId } from "./sectorId";

const PORTAL_SECTOR = { yacht: "yacht", automotive: "automotive" };

export function inferPortalSectorFromPath(pathname = "") {
  const p = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  if (p.includes("/yacht/demo")) return "yacht";
  if (p.includes("/automotive/demo")) return "automotive";
  return "real_estate";
}

export function resolveEventSector(row = {}) {
  if (row.sector) return normalizeSectorId(row.sector);
  const fromPortal = PORTAL_SECTOR[row.portal];
  if (fromPortal) return fromPortal;
  return inferPortalSectorFromPath();
}

export function toStoredSector(internalSector) {
  if (internalSector === "real_estate") return "realEstate";
  return internalSector;
}

export function inferRegionFromVipId(vipId) {
  if (!vipId) return null;
  const match = String(vipId).match(/^(gulf|usa|mexico|canada)-/i);
  return match ? match[1].toLowerCase() : null;
}

/** Read stored region only — never guess from active UI region (filter-safe). */
export function resolveEventRegionStrict(row = {}) {
  const raw = row.region || row.regionId;
  if (raw) return String(raw).toLowerCase().trim();
  return inferRegionFromVipId(row.vipId);
}

/** Write-time region — falls back to ud-region when portal omits it. */
export function resolveEventRegionForWrite(row = {}) {
  const strict = resolveEventRegionStrict(row);
  if (strict) return strict;
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("ud-region");
    if (stored) return String(stored).toLowerCase().trim();
  }
  return "gulf";
}

/** @deprecated alias — use resolveEventRegionForWrite in write paths */
export function resolveEventRegion(row = {}) {
  return resolveEventRegionForWrite(row);
}

/** Attach sector + region before Firestore / BroadcastChannel writes. */
export function enrichPortalEvent(ev = {}) {
  const sector = resolveEventSector(ev);
  return {
    ...ev,
    sector: toStoredSector(sector),
    region: resolveEventRegionForWrite(ev),
  };
}

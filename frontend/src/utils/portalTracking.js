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

export function resolveEventRegion(row = {}) {
  const raw = row.region || row.regionId;
  if (raw) return String(raw).toLowerCase().trim();
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("ud-region");
    if (stored) return String(stored).toLowerCase().trim();
  }
  return "gulf";
}

/** Attach sector + region before Firestore / BroadcastChannel writes. */
export function enrichPortalEvent(ev = {}) {
  const sector = resolveEventSector(ev);
  return {
    ...ev,
    sector: toStoredSector(sector),
    region: resolveEventRegion(ev),
  };
}

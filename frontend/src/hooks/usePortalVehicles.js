import { useMemo } from "react";
import { useRegion } from "./useRegion";
import { VEHICLES, SULTAN_IDS } from "../data/automotiveVehicleData";

/**
 * Returns region-filtered vehicle list for automotive demo portals.
 * @param {"vip"|"sultan"|"showroom"} portal
 */
export function usePortalVehicles(portal) {
  const { regionId } = useRegion();

  return useMemo(() => {
    const all = VEHICLES[regionId] || VEHICLES.gulf;
    if (portal === "sultan") {
      const ids = SULTAN_IDS[regionId] || [];
      return all.filter((v) => ids.includes(v.id));
    }
    return all;
  }, [portal, regionId]);
}

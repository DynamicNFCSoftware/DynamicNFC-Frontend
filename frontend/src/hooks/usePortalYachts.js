import { useMemo } from "react";
import { useRegion } from "./useRegion";
import { YACHTS, VIP_IDS } from "../data/yachtVesselData";

/**
 * Returns region-filtered yacht list for yacht demo portals.
 * @param {"vip"|"showroom"} portal — "vip" returns the 5 curated flagships, anything else all 8
 */
export function usePortalYachts(portal) {
  const { regionId } = useRegion();

  return useMemo(() => {
    const all = YACHTS[regionId] || YACHTS.gulf;
    if (portal === "vip") {
      const ids = VIP_IDS[regionId] || [];
      return all.filter((y) => ids.includes(y.id));
    }
    return all;
  }, [portal, regionId]);
}

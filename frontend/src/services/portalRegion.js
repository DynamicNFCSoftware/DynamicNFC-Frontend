// ═══════════════════════════════════════════════════════
// PORTAL REGION HELPER
// Single source of truth for region-aware portal content.
// Consumed by demo portal pages (Marketplace, VIP, Ahmed, Auto).
// ═══════════════════════════════════════════════════════

import { useMemo } from "react";
import { useRegion } from "../hooks/useRegion";
import {
  getProjectName,
  getPersonas,
  formatCurrency,
} from "../config/regionConfig";

/**
 * Returns the region-scoped bundle a portal page needs.
 *
 * @param {string} sectorId — regionConfig sector key ("real_estate" | "automotive" | "yacht")
 * @returns {{
 *   regionId: string,
 *   region: object,
 *   currency: string,
 *   currencySymbol: string,
 *   projectName: (lang: string) => string,
 *   personas: Array<{id, name, email, type, role}>,
 *   vipPersona: object | null,
 *   secondaryPersona: object | null,
 *   familyPersona: object | null,
 *   fmtCurrency: (value: number) => string,
 * }}
 */
export function usePortalRegion(sectorId) {
  const { regionId, region, currency, currencySymbol } = useRegion();

  return useMemo(() => {
    const personas = getPersonas(sectorId, regionId);
    return {
      regionId,
      region,
      currency,
      currencySymbol,
      projectName: (lang) => getProjectName(sectorId, regionId, lang),
      personas,
      vipPersona: personas.find((p) => p.id === "vip1") || null,
      secondaryPersona: personas.find((p) => p.id === "vip2") || null,
      familyPersona: personas.find((p) => p.id === "fam1") || null,
      fmtCurrency: (value) => formatCurrency(value, regionId),
    };
  }, [sectorId, regionId, region, currency, currencySymbol]);
}

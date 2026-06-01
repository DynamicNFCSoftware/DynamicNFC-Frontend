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
import {
  getLuxuryUnits,
  getFamilyUnits,
  getAmenities,
  getInvestStats,
} from "../config/realEstateUnitData";

/**
 * Returns the region-scoped bundle a portal page needs.
 *
 * @param {string} sectorId — regionConfig sector key ("real_estate" | "automotive" | "yacht")
 * @param {string} lang — active UI language ("en" | "ar" | "es" | "fr")
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
 *   luxuryUnits: Array<object>,
 *   familyUnits: Array<object>,
 *   amenities: Array<{icon, title, desc}>,
 *   investStats: Array<{stat, label, desc}>,
 * }}
 *
 * `luxuryUnits` / `familyUnits` / `amenities` / `investStats` are RE-specific.
 * Auto / Yacht portals destructure only the fields they need.
 */
export function usePortalRegion(sectorId, lang) {
  const { regionId, region, currency, currencySymbol } = useRegion();

  return useMemo(() => {
    const personas = getPersonas(sectorId, regionId);
    return {
      regionId,
      region,
      currency,
      currencySymbol,
      projectName: (l) => getProjectName(sectorId, regionId, l),
      personas,
      vipPersona: personas.find((p) => p.id === "vip1") || null,
      secondaryPersona: personas.find((p) => p.id === "vip2") || null,
      familyPersona: personas.find((p) => p.id === "fam1") || null,
      fmtCurrency: (value) => formatCurrency(value, regionId, lang),
      luxuryUnits: getLuxuryUnits(regionId, lang),
      familyUnits: getFamilyUnits(regionId, lang),
      amenities: getAmenities(regionId, lang),
      investStats: getInvestStats(regionId, lang),
    };
  }, [sectorId, regionId, region, currency, currencySymbol, lang]);
}

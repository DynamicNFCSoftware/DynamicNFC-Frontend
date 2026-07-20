// ═══════════════════════════════════════════════════════
// AUTO AI DEMO DATA — region-aware VIP / vehicle / price
// Flagship = FIRST vehicle of region's VIP list (VEHICLES[region][0]).
// ═══════════════════════════════════════════════════════

import {
  getRegion,
  getPersonas,
  getProjectName,
  formatCurrency,
} from "../../config/regionConfig";
import { VEHICLES, vName } from "../../data/automotiveVehicleData";
import {
  CITY,
  TIME_ABBR,
  nameParts,
  slugifyEmailLocal,
  projectSlug,
  makeVipId,
  attachmentName,
  fill,
  getWhatsAppInvite,
} from "../../services/aiDemoShared";

/** Short display codes for region flagships (terminal/WA aesthetics). */
const FLAGSHIP_CODE = { gulf: "G63", usa: "ESCALADE-V", mexico: "RR-LWB", canada: "PLAID" };

/**
 * Region-aware VIP payload for the automotive AI sales pipeline demo.
 * @param {string} regionId
 * @param {string} lang
 */
export function getAutoAiVip(regionId, lang = "en") {
  const rid = regionId || "gulf";
  const region = getRegion(rid);
  const personas = getPersonas("automotive", rid);
  const vip1 = personas.find((p) => p.id === "vip1") || personas[0];
  const name = vip1?.name || "VIP Buyer";
  const firstName = nameParts(name)[0] || name;
  const dealership = getProjectName("automotive", rid, lang);
  const dealershipEn = getProjectName("automotive", rid, "en");
  const list = VEHICLES[rid] || VEHICLES.gulf;
  const flagship = list[0];
  const vehicleName = vName(flagship, lang) || flagship?.name?.en || "Flagship";
  const vehicleCode = FLAGSHIP_CODE[rid] || String(flagship?.id || "VIP").toUpperCase().replace(/-/g, " ");
  const priceBase = flagship?.priceLocal ?? 0;
  const priceFmt = formatCurrency(priceBase, rid, lang);
  const currency = region.currency;
  const low = Math.round(priceBase * 0.85);
  const high = Math.round(priceBase * 1.25);
  const rangeFmt = `${formatCurrency(low, rid, lang)}–${formatCurrency(high, rid, lang)}`;
  const city = CITY[rid] || CITY.gulf;
  const timeAbbr = TIME_ABBR[rid] || "GST";
  const timeLabel = `10:00 AM ${timeAbbr}`;
  const email = `${slugifyEmailLocal(name)}@${projectSlug(dealershipEn)}.com`;
  const vipId = makeVipId(name);
  const salesCenter = `${dealership} Showroom, ${city}`;

  return {
    regionId: rid,
    name,
    firstName,
    email,
    vipId,
    tier: "Platinum",
    project: dealership,
    projectEn: dealershipEn,
    dealership,
    dealershipEn,
    vehicleName,
    vehicleCode,
    // Aliases so shared WA + fill patterns work
    unitName: vehicleName,
    unitCode: vehicleCode,
    priceFmt,
    rangeFmt,
    salesCenter,
    timeLabel,
    timeZone: region.timeZone,
    city,
    currency,
    priceBase,
    attachment: attachmentName(dealershipEn, String(flagship?.id || "vehicle").replace(/-/g, "_"), name),
    initials: vipId.replace("-001", ""),
    inviteKind: "Private test drive",
    colorName: flagship?.colors?.[0] ? (flagship.colors[0].name?.[lang] || flagship.colors[0].name?.en) : "Obsidian Black",
  };
}

export { fill, getWhatsAppInvite };

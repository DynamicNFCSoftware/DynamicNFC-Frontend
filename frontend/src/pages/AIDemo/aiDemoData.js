// ═══════════════════════════════════════════════════════
// AI DEMO DATA — region-aware VIP / unit / price for AIDemo
// Composes from regionConfig + realEstateUnitData (no duplicates).
// Shared helpers live in services/aiDemoShared.js.
// ═══════════════════════════════════════════════════════

import {
  getRegion,
  getPersonas,
  getProjectName,
  formatCurrency,
} from "../../config/regionConfig";
import { getLuxuryUnits } from "../../config/realEstateUnitData";
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

const UNIT_CODE = {
  gulf: "PH-4201",
  usa: "PH-5501",
  mexico: "PH-5501",
  canada: "PH-5501",
};

/**
 * Region-aware VIP payload for the AI sales pipeline demo.
 * @param {string} regionId
 * @param {string} lang
 */
export function getAiVip(regionId, lang = "en") {
  const rid = regionId || "gulf";
  const region = getRegion(rid);
  const personas = getPersonas("real_estate", rid);
  const vip1 = personas.find((p) => p.id === "vip1") || personas[0];
  const name = vip1?.name || "VIP Buyer";
  const firstName = nameParts(name)[0] || name;
  const project = getProjectName("real_estate", rid, lang);
  const projectEn = getProjectName("real_estate", rid, "en");
  const units = getLuxuryUnits(rid, lang);
  const lux = units.find((u) => u.id === "lux-ph") || units[0];
  const unitName = lux?.name || "Penthouse";
  const unitCode = UNIT_CODE[rid] || UNIT_CODE.usa;
  const priceBase = lux?.priceBase ?? 12500000;
  const priceFmt = formatCurrency(priceBase, rid, lang);
  const currency = region.currency;
  const rangeFmt = `${currency} 8M–15M`;
  const city = CITY[rid] || CITY.gulf;
  const timeAbbr = TIME_ABBR[rid] || "GST";
  const timeLabel = `2:00 PM ${timeAbbr}`;
  const email = `${slugifyEmailLocal(name)}@${projectSlug(projectEn)}.com`;
  const vipId = makeVipId(name);
  const salesCenter = `${project} Sales Center, ${city}`;

  return {
    name,
    firstName,
    email,
    vipId,
    tier: "Platinum",
    project,
    projectEn,
    unitName,
    unitCode,
    priceFmt,
    rangeFmt,
    salesCenter,
    timeLabel,
    timeZone: region.timeZone,
    city,
    currency,
    priceBase,
    attachment: attachmentName(projectEn, unitCode, name),
    initials: vipId.replace("-001", ""),
    inviteKind: "Private showing",
  };
}

export { fill, getWhatsAppInvite };

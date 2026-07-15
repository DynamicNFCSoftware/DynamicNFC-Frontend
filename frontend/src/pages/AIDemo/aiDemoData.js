// ═══════════════════════════════════════════════════════
// AI DEMO DATA — region-aware VIP / unit / price for AIDemo
// Composes from regionConfig + realEstateUnitData (no duplicates).
// ═══════════════════════════════════════════════════════

import {
  getRegion,
  getPersonas,
  getProjectName,
  formatCurrency,
} from "../../config/regionConfig";
import { getLuxuryUnits } from "../../config/realEstateUnitData";

/** City labels for sales-center copy (regionConfig has no city field). */
const CITY = {
  gulf: "Riyadh",
  usa: "New York",
  mexico: "Mexico City",
  canada: "Vancouver",
};

/** Clock abbreviations matching region.timeZone. */
const TIME_ABBR = {
  gulf: "GST",
  usa: "ET",
  mexico: "CST",
  canada: "PT",
};

const UNIT_CODE = {
  gulf: "PH-4201",
  usa: "PH-5501",
  mexico: "PH-5501",
  canada: "PH-5501",
};

function nameParts(fullName) {
  return String(fullName || "")
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((w) => w && !/^al$/i.test(w));
}

function slugifyEmailLocal(fullName) {
  const parts = nameParts(fullName);
  const first = (parts[0] || "vip").toLowerCase().replace(/[^a-z]/g, "");
  const last = (parts[parts.length - 1] || "buyer").toLowerCase().replace(/[^a-z]/g, "");
  return `${first}.${last}`;
}

function projectSlug(projectEn) {
  return String(projectEn || "residences")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeVipId(fullName) {
  const parts = nameParts(fullName);
  const a = (parts[0] || "V")[0];
  const b = (parts[parts.length - 1] || "I")[0];
  return `${a}${b}`.toUpperCase() + "-001";
}

function attachmentName(projectEn, unitCode, fullName) {
  const slug = projectSlug(projectEn).replace(/-/g, "_");
  const who = String(fullName || "VIP").replace(/[\s-]+/g, "_").replace(/[^A-Za-z0-9_]/g, "");
  return `${slug}_${unitCode}_${who}.pdf`;
}

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
  };
}

/** Fill `{name}` / `{unit}` style placeholders in a string. */
export const fill = (s, v) =>
  String(s ?? "").replace(/\{(\w+)\}/g, (_, k) => (v?.[k] != null ? String(v[k]) : ""));

/** WhatsApp invite + wa.me deep link (no backend). */
export function getWhatsAppInvite(vip) {
  const text = `Private showing invitation: ${vip.unitName} (${vip.unitCode}) at ${vip.project} — ${vip.priceFmt}. ${vip.timeLabel}. Reply to confirm.`;
  return {
    text,
    href: `https://wa.me/?text=${encodeURIComponent(text)}`,
  };
}

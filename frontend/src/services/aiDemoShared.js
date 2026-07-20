// ═══════════════════════════════════════════════════════
// AI DEMO SHARED HELPERS — fill / slug / VIP id / WhatsApp
// Used by RE (aiDemoData), Auto (autoAiDemoData), Yacht AI demos.
// ═══════════════════════════════════════════════════════

/** City labels for sales-center / showroom / marina copy. */
export const CITY = {
  gulf: "Riyadh",
  usa: "New York",
  mexico: "Mexico City",
  canada: "Vancouver",
};

/** Clock abbreviations matching region.timeZone. */
export const TIME_ABBR = {
  gulf: "GST",
  usa: "ET",
  mexico: "CST",
  canada: "PT",
};

/** Marina clock abbreviations (yacht demo — marina anchors differ from CITY map:
    Dubai Marina / San Diego / Cabo / Coal Harbour Vancouver). */
export const MARINA_TIME_ABBR = {
  gulf: "GST",
  usa: "PT",
  mexico: "MT",
  canada: "PT",
};

/** Region-aware terminal Locale line (Canva step). */
export const LOCALE_LINE = {
  gulf: "Locale: Bilingual EN/AR — right-to-left layout support enabled",
  usa: "Locale: English (US)",
  mexico: "Locale: Bilingual ES/EN",
  canada: "Locale: Bilingual EN/FR",
};

export function nameParts(fullName) {
  return String(fullName || "")
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter((w) => w && !/^al$/i.test(w));
}

export function slugifyEmailLocal(fullName) {
  const parts = nameParts(fullName);
  const first = (parts[0] || "vip").toLowerCase().replace(/[^a-z]/g, "");
  const last = (parts[parts.length - 1] || "buyer").toLowerCase().replace(/[^a-z]/g, "");
  return `${first}.${last}`;
}

export function projectSlug(projectEn) {
  return String(projectEn || "residences")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeVipId(fullName) {
  const parts = nameParts(fullName);
  const a = (parts[0] || "V")[0];
  const b = (parts[parts.length - 1] || "I")[0];
  return `${a}${b}`.toUpperCase() + "-001";
}

export function attachmentName(projectEn, unitCode, fullName) {
  const slug = projectSlug(projectEn).replace(/-/g, "_");
  const who = String(fullName || "VIP").replace(/[\s-]+/g, "_").replace(/[^A-Za-z0-9_]/g, "");
  return `${slug}_${unitCode}_${who}.pdf`;
}

/** Fill `{name}` / `{unit}` style placeholders in a string. */
export const fill = (s, v) =>
  String(s ?? "").replace(/\{(\w+)\}/g, (_, k) => (v?.[k] != null ? String(v[k]) : ""));

/**
 * WhatsApp invite + wa.me deep link (no backend).
 * Accepts RE (unit*), Auto (vehicle*), or Yacht (vessel*) field shapes.
 * @param {object} vip
 * @param {string} [vip.inviteKind] — e.g. "Private showing" | "Private test drive" | "Private sea trial"
 */
export function getWhatsAppInvite(vip) {
  const asset = vip.unitName || vip.vehicleName || vip.vesselName || "VIP asset";
  const code = vip.unitCode || vip.vehicleCode || vip.vesselCode || "";
  const place = vip.project || vip.dealership || vip.marina || "";
  const kind = vip.inviteKind || "Private showing";
  const codePart = code ? ` (${code})` : "";
  const text = `${kind} invitation: ${asset}${codePart} at ${place} — ${vip.priceFmt}. ${vip.timeLabel}. Reply to confirm.`;
  return {
    text,
    href: `https://wa.me/?text=${encodeURIComponent(text)}`,
  };
}

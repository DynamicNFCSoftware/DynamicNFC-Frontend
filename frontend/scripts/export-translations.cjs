/**
 * Export all i18n translations to CSV for Arabic translator review.
 *
 * Usage:  node scripts/export-translations.js
 * Output: translations.csv (UTF-8 with BOM for Excel compatibility)
 *
 * Columns: Page | Key | English | Arabic | Notes
 * The translator fills in corrections in the "Arabic" column or adds notes.
 *
 * To re-import after review:  node scripts/import-translations.js
 */

const fs = require("fs");
const path = require("path");

// ── Collect all translation modules ──
const modules = [];

function loadModule(filePath, pageName) {
  const raw = fs.readFileSync(filePath, "utf-8");

  // Extract the object between the first { en: { ... }, ar: { ... } }
  // We'll use a different approach: require the file after stripping ESM syntax
  let code = raw
    .replace(/^import .+$/gm, "")
    .replace(/^export default .+$/gm, "")
    .replace(/^export\s+/gm, "")
    .replace(/registerTranslations\(.+\);?/g, "");

  // Find the variable name and extract the object
  const varMatch = code.match(/const\s+(\w+)\s*=\s*\{/);
  if (!varMatch) {
    console.warn(`  Skipping ${filePath} — no translation object found`);
    return;
  }

  const varName = varMatch[1];

  // Wrap in a function to eval safely
  try {
    const fn = new Function(`${code}\nreturn ${varName};`);
    const obj = fn();
    modules.push({ page: pageName, data: obj });
  } catch (e) {
    console.warn(`  Error parsing ${filePath}: ${e.message}`);
  }
}

// ── Load common ──
const i18nDir = path.join(__dirname, "..", "src", "i18n");
loadModule(path.join(i18nDir, "common.js"), "_common");

// ── Load pages ──
const pagesDir = path.join(i18nDir, "pages");
if (fs.existsSync(pagesDir)) {
  for (const f of fs.readdirSync(pagesDir).filter(f => f.endsWith(".js"))) {
    const name = f.replace(".js", "");
    loadModule(path.join(pagesDir, f), name);
  }
}

// ── Load portals ──
const portalsDir = path.join(i18nDir, "portals");
if (fs.existsSync(portalsDir)) {
  for (const f of fs.readdirSync(portalsDir).filter(f => f.endsWith(".js"))) {
    const name = f.replace(".js", "");
    loadModule(path.join(portalsDir, f), `portal:${name}`);
  }
}

// ── Flatten nested objects ──
function flatten(obj, prefix = "") {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(result, flatten(v, key));
    } else if (Array.isArray(v)) {
      result[key] = v.join(" | ");
    } else {
      result[key] = String(v ?? "");
    }
  }
  return result;
}

// ── Build CSV rows ──
const rows = [];
rows.push(["Page", "Key", "English", "Arabic (Current)", "Arabic (Corrected)", "Notes"]);

for (const { page, data } of modules) {
  const en = flatten(data.en || {});
  const ar = flatten(data.ar || {});

  const allKeys = new Set([...Object.keys(en), ...Object.keys(ar)]);

  for (const key of [...allKeys].sort()) {
    const enVal = en[key] || "";
    const arVal = ar[key] || "";
    rows.push([page, key, enVal, arVal, "", ""]);
  }
}

// ── Write CSV with UTF-8 BOM ──
function escapeCSV(val) {
  if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("|")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

const BOM = "\uFEFF";
const csv = BOM + rows.map(row => row.map(escapeCSV).join(",")).join("\n");

const outPath = path.join(__dirname, "..", "translations.csv");
fs.writeFileSync(outPath, csv, "utf-8");

console.log(`\n✅ Exported ${rows.length - 1} translation keys to:`);
console.log(`   ${outPath}`);
console.log(`\nColumns:`);
console.log(`   Page | Key | English | Arabic (Current) | Arabic (Corrected) | Notes`);
console.log(`\nInstructions for translator:`);
console.log(`   1. Open translations.csv in Excel`);
console.log(`   2. Review "Arabic (Current)" column against "English"`);
console.log(`   3. Write corrections in "Arabic (Corrected)" column`);
console.log(`   4. Add comments in "Notes" column`);
console.log(`   5. Save as CSV (UTF-8) and return the file`);

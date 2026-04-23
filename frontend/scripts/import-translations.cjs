/**
 * Import corrected Arabic translations from CSV back into i18n files.
 *
 * Usage:  node scripts/import-translations.js [path-to-csv]
 * Default: reads translations.csv from project root
 *
 * Only updates keys where "Arabic (Corrected)" column is non-empty.
 */

const fs = require("fs");
const path = require("path");

const csvPath = process.argv[2] || path.join(__dirname, "..", "translations.csv");

if (!fs.existsSync(csvPath)) {
  console.error(`❌ File not found: ${csvPath}`);
  process.exit(1);
}

// ── Parse CSV ──
const raw = fs.readFileSync(csvPath, "utf-8").replace(/^\uFEFF/, ""); // strip BOM

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

const lines = raw.split(/\r?\n/).filter(l => l.trim());
const header = parseCSVLine(lines[0]);
const correctedIdx = header.indexOf("Arabic (Corrected)");
const pageIdx = header.indexOf("Page");
const keyIdx = header.indexOf("Key");

if (correctedIdx === -1 || pageIdx === -1 || keyIdx === -1) {
  console.error("❌ CSV must have columns: Page, Key, Arabic (Corrected)");
  process.exit(1);
}

// ── Collect corrections ──
const corrections = {}; // { page: { key: newValue } }
let count = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const page = (cols[pageIdx] || "").trim();
  const key = (cols[keyIdx] || "").trim();
  const corrected = (cols[correctedIdx] || "").trim();

  if (!corrected || !page || !key) continue;

  if (!corrections[page]) corrections[page] = {};
  corrections[page][key] = corrected;
  count++;
}

if (count === 0) {
  console.log("ℹ️  No corrections found (Arabic (Corrected) column is empty).");
  process.exit(0);
}

console.log(`\n📝 Found ${count} corrections across ${Object.keys(corrections).length} page(s).\n`);

// ── Map page names to file paths ──
const i18nDir = path.join(__dirname, "..", "src", "i18n");
function getFilePath(page) {
  if (page === "_common") return path.join(i18nDir, "common.js");
  if (page.startsWith("portal:")) return path.join(i18nDir, "portals", page.replace("portal:", "") + ".js");
  return path.join(i18nDir, "pages", page + ".js");
}

// ── Apply corrections ──
for (const [page, keys] of Object.entries(corrections)) {
  const filePath = getFilePath(page);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  File not found for page "${page}": ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let applied = 0;

  for (const [dotKey, newValue] of Object.entries(keys)) {
    // Handle both flat keys ("heroTitle") and nested keys ("hero.title")
    const parts = dotKey.split(".");
    const leafKey = parts[parts.length - 1];

    // Escape the new value for JS string
    const escaped = newValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

    // Try to find and replace the Arabic value in the `ar` section
    // Pattern: key: "old value" or key: 'old value'
    const regex = new RegExp(
      `(${leafKey}\\s*:\\s*)(['"])(.*?)\\2`,
      "g"
    );

    // We need to be careful to only replace in the AR section
    // Find the ar: { section
    const arStart = content.indexOf("ar:");
    if (arStart === -1) continue;

    const before = content.slice(0, arStart);
    const after = content.slice(arStart);

    let replaced = false;
    const newAfter = after.replace(regex, (match, prefix, quote, oldVal) => {
      if (replaced) return match; // only replace first occurrence
      replaced = true;
      applied++;
      return `${prefix}"${escaped}"`;
    });

    if (replaced) {
      content = before + newAfter;
    }
  }

  if (applied > 0) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`  ✅ ${page}: ${applied} key(s) updated in ${path.basename(filePath)}`);
  }
}

console.log(`\n✅ Import complete. Run "npm run build" to verify.`);

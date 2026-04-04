import fs from "fs";

const dashPath = "src/pages/Dashboard/Dashboard.jsx";
const portalPath = "src/i18n/portals/dashboard.js";

const dash = fs.readFileSync(dashPath, "utf8");
const start = dash.indexOf("const T = {");
if (start < 0) throw new Error("T not found");
const rest = dash.slice(start + "const T = ".length);

let depth = 0;
let i = 0;
let inStr = null;
let esc = false;
for (; i < rest.length; i++) {
  const ch = rest[i];
  if (inStr) {
    if (esc) {
      esc = false;
      continue;
    }
    if (ch === "\\") {
      esc = true;
      continue;
    }
    if (ch === inStr) inStr = null;
    continue;
  }
  if (ch === '"' || ch === "'" || ch === "`") {
    inStr = ch;
    continue;
  }
  if (ch === "{") depth++;
  if (ch === "}") {
    depth--;
    if (depth === 0) {
      i++;
      break;
    }
  }
}
const tBody = rest.slice(0, i).trim();
if (!tBody.endsWith("}")) throw new Error("parse boundary failed");

const out = `import { registerTranslations } from "../index";

const dashboard = ${tBody};

registerTranslations("dashboard", dashboard);

export default dashboard;
`;

fs.writeFileSync(portalPath, out);
console.log("Wrote", portalPath, "from Dashboard.jsx T object");

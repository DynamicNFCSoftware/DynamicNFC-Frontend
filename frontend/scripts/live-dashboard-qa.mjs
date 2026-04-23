import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3001";
const OUT_DIR = path.resolve("qa-artifacts", `live-dashboard-${Date.now()}`);

const rows = [
  { key: "khalid_re", portal: "Khalid RE", route: "/enterprise/crmdemo/khalid", persona: "Khalid Al-Rashid", sector: "real_estate" },
  { key: "ahmed_re", portal: "Ahmed RE", route: "/enterprise/crmdemo/ahmed", persona: "Ahmed Al-Fahad", sector: "real_estate" },
  { key: "marketplace", portal: "Marketplace", route: "/enterprise/crmdemo/marketplace", persona: "Marketplace QA", sector: "real_estate" },
  { key: "khalid_auto", portal: "Khalid Auto", route: "/automotive/demo/khalid", persona: "Khalid Al-Mansouri", sector: "automotive" },
  { key: "sultan_auto", portal: "Sultan Auto", route: "/automotive/demo/sultan", persona: "Sultan Al-Dhaheri", sector: "automotive" },
  { key: "showroom", portal: "Showroom", route: "/automotive/demo/showroom", persona: "Showroom QA", sector: "automotive" },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dismissOnboarding = async (page) => {
  const skipBtn = page.locator("button:has-text('Skip'), button:has-text('تخطي')");
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
    await delay(500);
  }
};

const initConsoleCapture = async (page) => {
  await page.evaluate(() => {
    const origLog = console.log;
    const origError = console.error;
    console.log = (...args) => {
      if (args.some((a) => typeof a === "string" && (a.includes("event") || a.includes("tenant") || a.includes("snapshot")))) {
        origLog("[TRACKING]", ...args);
      }
      origLog(...args);
    };
    console.error = (...args) => {
      origError(...args);
    };
  });
};

const readFeed = async (unifiedPage) => {
  await unifiedPage.waitForSelector(".ud-feed-text", { timeout: 20000 }).catch(() => {});
  return unifiedPage.locator(".ud-feed-text").allTextContents();
};

const switchSector = async (unifiedPage, targetSector) => {
  const hasSector = await unifiedPage.locator(".ud-sector-btn").first().isVisible().catch(() => false);
  if (!hasSector) {
    const menuBtn = unifiedPage.locator(".ud-hamburger");
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click().catch(() => {});
      await delay(500);
    }
    await unifiedPage.waitForSelector(".ud-sector-btn", { timeout: 90000 });
  }
  if (targetSector === "automotive") {
    await unifiedPage.locator(".ud-sector-btn").nth(1).click();
  } else {
    await unifiedPage.locator(".ud-sector-btn").nth(0).click();
  }
  await delay(1200);
};

const triggerPortalActions = async (portalPage, row) => {
  await portalPage.goto(`${BASE}${row.route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await delay(1800);

  if (row.key === "khalid_re") {
    await portalPage.locator(".vp-card").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Floor Plan')").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Request Pricing')").first().click().catch(() => {});
  } else if (row.key === "ahmed_re") {
    await portalPage.locator(".ap-card").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Floor Plan')").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Request Pricing')").first().click().catch(() => {});
  } else if (row.key === "marketplace") {
    await portalPage.locator(".mp-card").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Get Pricing')").first().click().catch(() => {});
    const leadForm = portalPage.locator(".mp-lead-box");
    if (await leadForm.isVisible().catch(() => false)) {
      await portalPage.locator("input[name='leadName']").fill("Marketplace QA").catch(() => {});
      await portalPage.locator("input[name='leadEmail']").fill(`marketplace.qa.${Date.now()}@example.com`).catch(() => {});
      await portalPage.locator("input[name='leadPhone']").fill("+971500000001").catch(() => {});
      await portalPage.locator("button[type='submit']").click().catch(() => {});
    }
  } else if (row.key === "khalid_auto") {
    await portalPage.locator(".ap-vcard").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Request VIP Pricing')").first().click().catch(() => {});
  } else if (row.key === "sultan_auto") {
    await portalPage.locator(".sp-vcard").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Request VIP Pricing')").first().click().catch(() => {});
  } else if (row.key === "showroom") {
    await portalPage.locator(".ps-card").first().click().catch(() => {});
    await portalPage.locator("button:has-text('Get Pricing')").first().click().catch(() => {});
    const leadForm = portalPage.locator(".ps-lead-box");
    if (await leadForm.isVisible().catch(() => false)) {
      await portalPage.locator("input[name='leadName']").fill("Showroom QA").catch(() => {});
      await portalPage.locator("input[name='leadEmail']").fill(`showroom.qa.${Date.now()}@example.com`).catch(() => {});
      await portalPage.locator("input[name='leadPhone']").fill("+971500000002").catch(() => {});
      await portalPage.locator("button[type='submit']").click().catch(() => {});
    }
  }

  await delay(1400);
};

await fs.mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const unifiedPage = await context.newPage();

const consoleLogs = [];
let consoleErrors = 0;

const bindConsole = (page, tag) => {
  page.on("console", (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${tag}] ${text}`);
    if (msg.type() === "error") consoleErrors += 1;
  });
  page.on("pageerror", (err) => {
    consoleErrors += 1;
    consoleLogs.push(`[${tag}] ${err.message}`);
  });
};

bindConsole(unifiedPage, "UNIFIED");

const email = `live.qa.${Date.now()}@example.com`;
const password = "LiveQa123!";

await unifiedPage.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await unifiedPage.getByRole("button", { name: "Create one" }).click();
await unifiedPage.locator("#auth-email").fill(email);
await unifiedPage.locator("#auth-password").fill(password);
await unifiedPage.locator("#auth-confirm").fill(password);
await unifiedPage.getByRole("button", { name: "Create account" }).click();
await delay(2200);

await unifiedPage.goto(`${BASE}/unified`, { waitUntil: "domcontentloaded", timeout: 60000 });
await dismissOnboarding(unifiedPage);
await initConsoleCapture(unifiedPage);
await delay(1200);

const results = [];

for (const row of rows.filter((r) => r.sector === "real_estate")) {
  await switchSector(unifiedPage, "real_estate");
  const portalPage = await context.newPage();
  bindConsole(portalPage, row.portal);
  const started = Date.now();

  let pageOpened = true;
  try {
    await triggerPortalActions(portalPage, row);
  } catch {
    pageOpened = false;
  }
  await portalPage.close();

  await unifiedPage.bringToFront();
  await delay(2500);
  const feed = await readFeed(unifiedPage);
  const seenPersona = feed.some((line) => line.includes(row.persona));
  const eventTypeOk = feed.some((line) => line.includes(row.persona) && (line.includes("view") || line.includes("request") || line.includes("download")));
  const shot = path.join(OUT_DIR, `${row.key}-unified.png`);
  await unifiedPage.screenshot({ path: shot, fullPage: true });
  results.push({
    portal: row.portal,
    pageOpened,
    firestoreWritten: seenPersona,
    dashboardVisible: seenPersona,
    personaCorrect: seenPersona && eventTypeOk,
    durationSec: Number(((Date.now() - started) / 1000).toFixed(1)),
    feedSample: feed.slice(0, 8),
    screenshot: shot,
  });
}

await switchSector(unifiedPage, "automotive");
await delay(1500);
const autoViewFeed = await readFeed(unifiedPage);
const reLeakInAuto = autoViewFeed.some((line) => line.includes("Khalid Al-Rashid") || line.includes("Ahmed Al-Fahad") || line.includes("Marketplace QA"));

for (const row of rows.filter((r) => r.sector === "automotive")) {
  await switchSector(unifiedPage, "automotive");
  const portalPage = await context.newPage();
  bindConsole(portalPage, row.portal);
  const started = Date.now();

  let pageOpened = true;
  try {
    await triggerPortalActions(portalPage, row);
  } catch {
    pageOpened = false;
  }
  await portalPage.close();

  await unifiedPage.bringToFront();
  await delay(2500);
  const feed = await readFeed(unifiedPage);
  const seenPersona = feed.some((line) => line.includes(row.persona));
  const eventTypeOk = feed.some((line) => line.includes(row.persona) && (line.includes("view") || line.includes("request") || line.includes("download")));
  const shot = path.join(OUT_DIR, `${row.key}-unified.png`);
  await unifiedPage.screenshot({ path: shot, fullPage: true });
  results.push({
    portal: row.portal,
    pageOpened,
    firestoreWritten: seenPersona,
    dashboardVisible: seenPersona,
    personaCorrect: seenPersona && eventTypeOk,
    durationSec: Number(((Date.now() - started) / 1000).toFixed(1)),
    feedSample: feed.slice(0, 8),
    screenshot: shot,
  });
}

await switchSector(unifiedPage, "real_estate");
await delay(1500);
const reViewFeed = await readFeed(unifiedPage);
const autoLeakInRe = reViewFeed.some((line) => line.includes("Khalid Al-Mansouri") || line.includes("Sultan Al-Dhaheri") || line.includes("Showroom QA"));

const report = {
  baseUrl: BASE,
  outDir: OUT_DIR,
  consoleErrors,
  crossSectorIsolation: !(reLeakInAuto || autoLeakInRe),
  leaks: { reLeakInAuto, autoLeakInRe },
  results,
  consoleLogs: consoleLogs.slice(-250),
};

await fs.writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));

await context.close();
await browser.close();

import { chromium } from "playwright";

const BASE = "http://localhost:3000";

const routes = [
  { path: "/unified", file: "C:/Users/oguzh/unified-overview.png" },
  { path: "/unified/analytics", file: "C:/Users/oguzh/unified-analytics.png" },
  { path: "/unified/vip-crm", file: "C:/Users/oguzh/unified-vipcrm.png" },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
const page = await context.newPage();
const email = `smoke.${Date.now()}@example.com`;
const password = "SmokeTest123!";

const dismissOnboarding = async (targetPage) => {
  const skipBtn = targetPage.locator("button:has-text('Skip'), button:has-text('تخطي')");
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
    await targetPage.waitForTimeout(500);
    return;
  }
  await targetPage.waitForTimeout(700);
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
    await targetPage.waitForTimeout(500);
  }
};

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("button", { name: "Create one" }).click();
await page.locator("#auth-email").fill(email);
await page.locator("#auth-password").fill(password);
await page.locator("#auth-confirm").fill(password);
await page.getByRole("button", { name: "Create account" }).click();
await page.waitForTimeout(2200);

for (const route of routes) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await dismissOnboarding(page);
  await page.waitForTimeout(400);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: route.file, fullPage: true });
}

// Mobile capture for overflow check
const mobileContext = await browser.newContext({ viewport: { width: 375, height: 1400 } });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await mobilePage.locator("#auth-email").fill(email);
await mobilePage.locator("#auth-password").fill(password);
await mobilePage.getByRole("button", { name: "Sign In" }).click();
await mobilePage.waitForTimeout(2000);
await mobilePage.goto(`${BASE}/unified`, { waitUntil: "domcontentloaded", timeout: 60000 });
await dismissOnboarding(mobilePage);
await mobilePage.waitForTimeout(1200);
await mobilePage.screenshot({ path: "C:/Users/oguzh/unified-mobile-375.png", fullPage: true });

await mobileContext.close();
await context.close();
await browser.close();

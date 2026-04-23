import { chromium } from "playwright";

const PROJECT_ID = "dynamicnfc-prod-68b4e";
const BASE = "http://localhost:3000";

const email = `bridge.verify.${Date.now()}@example.com`;
const password = "BridgeVerify123!";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.getByRole("button", { name: "Create one" }).click();
await page.locator("#auth-email").fill(email);
await page.locator("#auth-password").fill(password);
await page.locator("#auth-confirm").fill(password);
await page.getByRole("button", { name: "Create account" }).click();
await page.waitForTimeout(3000);

const routes = [
  "/enterprise/crmdemo/khalid",
  "/enterprise/crmdemo/ahmed",
  "/enterprise/crmdemo/marketplace",
];

const routeProbes = [];
for (const route of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2200);
  if (route.includes("/khalid")) {
    await page.getByRole("button", { name: "Explore Residences" }).click().catch(() => {});
  }
  if (route.includes("/ahmed")) {
    await page.getByRole("button", { name: "Explore Residences" }).click().catch(() => {});
  }
  if (route.includes("/marketplace")) {
    await page.getByRole("button", { name: "View Collection" }).click().catch(() => {});
  }
  await page.waitForTimeout(1000);
  const probe = await page.evaluate(async () => {
    const { auth } = await import("/src/firebase.js");
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    const last = events[events.length - 1] || null;
    return {
      uid: auth.currentUser?.uid || null,
      eventsInLocalStorage: events.length,
      lastEvent: last ? { event: last.event, portalType: last.portalType, source: last.source || null } : null,
    };
  });
  routeProbes.push({ route, ...probe });
}

const result = await page.evaluate(async ({ projectId }) => {
  const { auth } = await import("/src/firebase.js");

  const waitForUser = async () => {
    for (let i = 0; i < 20; i += 1) {
      if (auth.currentUser) return auth.currentUser;
      await new Promise((r) => setTimeout(r, 300));
    }
    return null;
  };

  const user = await waitForUser();
  if (!user) return { error: "No authenticated user in browser context" };

  const idToken = await user.getIdToken(true);
  const uid = user.uid;

  const writeProbe = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tenants/${uid}/events?documentId=manual_probe_${Date.now()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          event: { stringValue: "manual_probe_event" },
          source: { stringValue: "manual_probe" },
          portalType: { stringValue: "vip" },
          timestamp: { timestampValue: new Date().toISOString() },
        },
      }),
    }
  );
  const writeProbeBody = await writeProbe.json();

  const queryBySource = async (sourceValue) => {
    const queryRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tenants/${uid}:runQuery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "events" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "source" },
                op: "EQUAL",
                value: { stringValue: sourceValue },
              },
            },
            limit: 30,
          },
        }),
      }
    );
    const rows = await queryRes.json();
    if (!queryRes.ok) {
      return { error: "query_failed", status: queryRes.status, rows };
    }
    return rows.filter((r) => r.document).map((r) => r.document);
  };

  const bridgeDocs = await queryBySource("portal_bridge");
  const manualDocs = await queryBySource("manual_probe");

  return {
    uid,
    writeProbeOk: writeProbe.ok,
    writeProbeBody,
    bridgeEventCount: Array.isArray(bridgeDocs) ? bridgeDocs.length : 0,
    manualProbeCount: Array.isArray(manualDocs) ? manualDocs.length : 0,
    bridgeSample: Array.isArray(bridgeDocs) ? bridgeDocs.slice(0, 8).map((d) => ({
      name: d.name,
      event: d.fields?.event?.stringValue,
      portalType: d.fields?.portalType?.stringValue,
      source: d.fields?.source?.stringValue,
      timestamp: d.fields?.timestamp?.timestampValue || d.fields?.timestamp?.stringValue,
    })) : bridgeDocs,
  };
}, { projectId: PROJECT_ID });

await context.close();
await browser.close();

console.log(JSON.stringify({ email, routeProbes, ...result }, null, 2));

// ═══════════════════════════════════════════════════════
// PORTAL TRACK — single source for demo-portal event tracking.
// Replaces the 6 near-identical inline `trackEvent` blocks.
// Writes localStorage + BroadcastChannel + Firestore bridge.
// Canonical event schema: id, timestamp, portalType, vipId,
// vipName, source, deviceType, event, ...data (callers may
// override any field via `data`, e.g. source/sessionId/portal).
// ═══════════════════════════════════════════════════════

import { bridgeEventToFirestore } from "./portalFirestoreBridge";

const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;

const deviceType = () =>
  /Mobi|Android/i.test(navigator.userAgent) ? "mobile"
  : /Tablet|iPad/i.test(navigator.userAgent) ? "tablet"
  : "desktop";

export function trackPortalEvent(portalType, persona, event, data = {}) {
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    portalType,
    vipId: persona?.id ?? null,
    vipName: persona?.name ?? null,
    source: "nfc",
    deviceType: deviceType(),
    event,
    ...data,
  };
  try {
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch (e) { /* localStorage full/disabled — tracking must not block UI */ }
  _bc?.postMessage(ev);
  bridgeEventToFirestore(ev);
}

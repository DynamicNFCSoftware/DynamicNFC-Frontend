/* ═══════════════════════════════════════════════════════
   autoGoogleLiveApi.js — OAuth + Gmail + Calendar helpers
   (Automotive version — same API logic, automotive email template)
   Token is NEVER persisted — lives in memory only.
   ═══════════════════════════════════════════════════════ */

const CLIENT_ID = "511000068860-bq2ce4rka1n1v7qot2g38rc83v7s5ohh.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email";

let tokenClient = null;
let accessToken = null;

/* ── Load Google Identity Services script ── */
export function loadGIS() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/* ── Request OAuth token via popup ── */
export function requestToken() {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("GIS not loaded"));
      return;
    }
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        accessToken = response.access_token;
        resolve(accessToken);
      },
    });
    tokenClient.requestAccessToken();
  });
}

/* ── Get connected user info ── */
export async function getUserInfo(token) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get user info");
  return res.json(); // { email, name, picture }
}

/* ── Create Gmail Draft ── */
export async function createGmailDraft(token, { to, subject, htmlBody, senderName }) {
  // Build RFC 2822 message
  const boundary = "dnfc_boundary_" + Date.now();
  const rawParts = [
    `From: ${senderName || "DynamicNFC"} <me>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  // Base64url encode
  const encoded = btoa(unescape(encodeURIComponent(rawParts)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: { raw: encoded } }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Gmail API failed");
  }

  const data = await res.json();
  return {
    draftId: data.id,
    messageId: data.message?.id,
    threadId: data.message?.threadId,
  };
}

/* ── Create Calendar Event ── */
export async function createCalendarEvent(token, { summary, location, description, startDateTime, endDateTime, attendeeEmail }) {
  const event = {
    summary,
    location,
    description,
    start: { dateTime: startDateTime, timeZone: "Asia/Dubai" },
    end: { dateTime: endDateTime, timeZone: "Asia/Dubai" },
    reminders: { useDefault: false, overrides: [{ method: "email", minutes: 1440 }, { method: "popup", minutes: 60 }] },
  };
  if (attendeeEmail) {
    event.attendees = [{ email: attendeeEmail }];
  }

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=none", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Calendar API failed");
  }

  const data = await res.json();
  return {
    eventId: data.id,
    htmlLink: data.htmlLink,
    summary: data.summary,
    start: data.start,
    end: data.end,
    status: data.status,
  };
}

/* ── Revoke token (cleanup) ── */
export function revokeToken(token) {
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {});
  }
  accessToken = null;
}

/* ── HTML entity encoding for user inputs ── */
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ── Build the VIP test drive invitation email HTML ── */
export function buildVipEmailHtml({ buyerName, vehicleName, vehiclePrice, testDriveDate, testDriveTime, testDriveLocation }) {
  const _n = esc(buyerName), _v = esc(vehicleName), _p = esc(vehiclePrice);
  const _d = esc(testDriveDate), _t = esc(testDriveTime), _l = esc(testDriveLocation);
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#1a1a2e;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#0a0a0f);padding:2.5rem;text-align:center;border-bottom:2px solid #b8860b;">
    <h1 style="font-family:Georgia,serif;font-size:1.5rem;color:#fff;margin:0 0 .3rem;">Prestige Motors</h1>
    <p style="font-size:.75rem;color:#b8860b;text-transform:uppercase;letter-spacing:2px;margin:0;">VIP Private Test Drive Invitation</p>
  </div>
  <div style="padding:2rem 2.5rem;">
    <p style="color:#e0e0e0;font-size:.95rem;line-height:1.7;">Dear ${_n},</p>
    <p style="color:#a0a0a0;font-size:.9rem;line-height:1.7;">As a valued VIP Access Key holder at Prestige Motors, we are pleased to confirm your <strong style="color:#b8860b;">exclusive private test drive</strong>.</p>
    <div style="background:rgba(184,134,11,0.08);border:1px solid rgba(184,134,11,0.3);border-radius:12px;padding:1.25rem;margin:1.25rem 0;">
      <h3 style="font-family:Georgia,serif;color:#b8860b;margin:0 0 .4rem;font-size:1rem;">${_v} — ${_p}</h3>
      <p style="color:#888;font-size:.85rem;margin:0;line-height:1.5;">Your configuration: Obsidian Black exterior, Red Pepper Nappa interior, Night Package, AMG Performance exhaust.</p>
    </div>
    <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem;margin:1rem 0;">
      <p style="font-size:.7rem;color:#b8860b;text-transform:uppercase;letter-spacing:1px;margin:0 0 .3rem;">Your Private Test Drive</p>
      <p style="color:#fff;font-size:1rem;font-weight:600;margin:0;">${_d} at ${_t}</p>
      <p style="color:#888;font-size:.82rem;margin:.2rem 0 0;">${_l}</p>
      <p style="color:#666;font-size:.78rem;margin:.5rem 0 0;">Route: Marina Corniche \u2192 Jebel Ali \u2192 Downtown (45 min)</p>
    </div>
    <p style="color:#a0a0a0;font-size:.9rem;line-height:1.7;">Your vehicle will be detailed, fueled, and prepared exclusively for you. A personal advisor will meet you at the VIP entrance.</p>
    <p style="color:#a0a0a0;font-size:.85rem;margin-top:1.5rem;">Warm regards,<br><strong style="color:#e0e0e0;">Prestige Motors VIP Team</strong><br><span style="color:#666;">Powered by DynamicNFC</span></p>
  </div>
</div>
</body></html>`;
}

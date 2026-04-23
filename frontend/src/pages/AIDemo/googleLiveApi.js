/* ═══════════════════════════════════════════════════════
   googleLiveApi.js — OAuth + Gmail + Calendar helpers
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

/* ── Build the VIP invitation email HTML ── */
export function buildVipEmailHtml({ buyerName, unitName, unitPrice, showingDate, showingTime, showingLocation }) {
  const _n = esc(buyerName), _u = esc(unitName), _p = esc(unitPrice);
  const _d = esc(showingDate), _t = esc(showingTime), _l = esc(showingLocation);
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f3f0;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#C5A467,#9a7d3d);padding:2.5rem;text-align:center;">
    <h1 style="font-family:Georgia,serif;font-size:1.5rem;color:#fff;margin:0 0 .3rem;">Vista Residences</h1>
    <p style="font-size:.75rem;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:2px;margin:0;">VIP Private Showing Invitation</p>
  </div>
  <div style="padding:2rem 2.5rem;">
    <p style="color:#333;font-size:.95rem;line-height:1.7;">Dear ${_n},</p>
    <p style="color:#555;font-size:.9rem;line-height:1.7;">Thank you for your continued interest in Vista Residences. As a valued VIP Access Key holder, we are pleased to invite you to an <strong style="color:#C5A467;">exclusive private showing</strong>.</p>
    <div style="background:rgba(197,164,103,0.08);border:1px solid rgba(197,164,103,0.2);border-radius:12px;padding:1.25rem;margin:1.25rem 0;">
      <h3 style="font-family:Georgia,serif;color:#C5A467;margin:0 0 .4rem;font-size:1rem;">${_u} — ${_p}</h3>
      <p style="color:#666;font-size:.85rem;margin:0;line-height:1.5;">Premium residence with panoramic views, smart home technology, and exclusive VIP amenities.</p>
    </div>
    <div style="background:#f8f7f5;border-radius:10px;padding:1rem;margin:1rem 0;">
      <p style="font-size:.7rem;color:#C5A467;text-transform:uppercase;letter-spacing:1px;margin:0 0 .3rem;">Your Private Showing</p>
      <p style="color:#1a1a2e;font-size:1rem;font-weight:600;margin:0;">${_d} at ${_t}</p>
      <p style="color:#888;font-size:.82rem;margin:.2rem 0 0;">${_l}</p>
    </div>
    <p style="color:#555;font-size:.9rem;line-height:1.7;">We look forward to welcoming you.</p>
    <p style="color:#555;font-size:.85rem;margin-top:1.5rem;">Warm regards,<br><strong>Vista Residences Sales Team</strong><br><span style="color:#999;">Powered by DynamicNFC</span></p>
  </div>
</div>
</body></html>`;
}

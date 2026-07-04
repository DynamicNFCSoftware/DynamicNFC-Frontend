/* ═══════════════════════════════════════════════════════
   yachtGoogleLiveApi.js — yacht sea-trial email builder.
   Generic OAuth + Gmail + Calendar helpers are reused verbatim from
   autoGoogleLiveApi.js (single source — no API logic duplicated).
   Only the email template is yacht-specific. Calendar timezone stays
   Asia/Dubai in the shared helper (demo default) — noted as debt.
   ═══════════════════════════════════════════════════════ */

export {
  loadGIS,
  requestToken,
  getUserInfo,
  createGmailDraft,
  createCalendarEvent,
  revokeToken,
} from "../AutomotiveDemo/autoGoogleLiveApi";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── Build the VIP sea-trial invitation email HTML ── */
export function buildYachtEmailHtml({ ownerName, vesselName, vesselPrice, trialDate, trialTime, trialLocation }) {
  const _n = esc(ownerName), _v = esc(vesselName), _p = esc(vesselPrice);
  const _d = esc(trialDate), _t = esc(trialTime), _l = esc(trialLocation);
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#05141f;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#0a2233;">
  <div style="background:linear-gradient(135deg,#0a2233,#05141f);padding:2.5rem;text-align:center;border-bottom:2px solid #457b9d;">
    <h1 style="font-family:Georgia,serif;font-size:1.5rem;color:#fff;margin:0 0 .3rem;">Marina Yachts</h1>
    <p style="font-size:.75rem;color:#6ba3c7;text-transform:uppercase;letter-spacing:2px;margin:0;">VIP Private Sea Trial Invitation</p>
  </div>
  <div style="padding:2rem 2.5rem;">
    <p style="color:#e0e0e0;font-size:.95rem;line-height:1.7;">Dear ${_n},</p>
    <p style="color:#a0a0a0;font-size:.9rem;line-height:1.7;">As a valued VIP Access Key holder at Marina Yachts, we are pleased to confirm your <strong style="color:#6ba3c7;">exclusive private sea trial</strong>.</p>
    <div style="background:rgba(69,123,157,0.10);border:1px solid rgba(69,123,157,0.35);border-radius:12px;padding:1.25rem;margin:1.25rem 0;">
      <h3 style="font-family:Georgia,serif;color:#6ba3c7;margin:0 0 .4rem;font-size:1rem;">${_v} — ${_p}</h3>
      <p style="color:#888;font-size:.85rem;margin:0;line-height:1.5;">A full owner's sea trial with the captain and marina advisor aboard — handling, comfort at anchor, and every stateroom.</p>
    </div>
    <div style="background:rgba(255,255,255,0.04);border-radius:10px;padding:1rem;margin:1rem 0;">
      <p style="font-size:.7rem;color:#6ba3c7;text-transform:uppercase;letter-spacing:1px;margin:0 0 .3rem;">Your Private Sea Trial</p>
      <p style="color:#fff;font-size:1rem;font-weight:600;margin:0;">${_d} at ${_t}</p>
      <p style="color:#888;font-size:.82rem;margin:.2rem 0 0;">${_l}</p>
    </div>
    <p style="color:#a0a0a0;font-size:.9rem;line-height:1.7;">Your vessel will be provisioned, fueled, and prepared exclusively for you. Your personal advisor will meet you at the marina gate.</p>
    <p style="color:#a0a0a0;font-size:.85rem;margin-top:1.5rem;">Warm regards,<br><strong style="color:#e0e0e0;">Marina Yachts VIP Team</strong><br><span style="color:#666;">Powered by DynamicNFC</span></p>
  </div>
</div>
</body></html>`;
}

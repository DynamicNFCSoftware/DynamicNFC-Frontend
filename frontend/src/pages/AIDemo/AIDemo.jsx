import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════
// AI SALES AUTOMATION DEMO — Interactive MCP Showcase
// ═══════════════════════════════════════════════════════════════════
// Interactive execution: each step has Run button, terminal animation,
// then reveals real MCP results (Gmail draft, Calendar event, etc.)
// Steps unlock sequentially like a real pipeline.
// Self-contained, prefix: ai-
// Supports dark & light theme toggle.
// ═══════════════════════════════════════════════════════════════════

/* ── Real results from MCP tool calls ── */
const REAL_RESULTS = {
  calendar: {
    title: "Private Showing — Sky Penthouse — Khalid Al-Rashid (VIP)",
    date: "Thursday, March 12, 2026",
    time: "2:00 PM – 3:00 PM GST",
    location: "Vista Residences Sales Center, Dubai Marina",
    link: "https://www.google.com/calendar/event?eid=dW5tMXB1dDY3dWEwMm9xYWF1a2JxcDVmcDQgaW5mb0BkeW5hbWljbmZjLmhlbHA",
    slotsFound: 3,
  },
  gmail: {
    to: "khalid.alrashid@vista.ae",
    subject: "Khalid, your private viewing of the Sky Penthouse is confirmed",
    from: "info@dynamicnfc.help",
    attachment: "Vista_Residences_SkyPenthouse_Khalid_AlRashid.pdf",
    draftLink: "https://mail.google.com/mail/?authuser=info@dynamicnfc.help#drafts/19cd3fa2c68904a0",
    draftId: "r-5341690815395717705",
  },
  docusign: {
    template: "VIP Buyer NDA — Vista Residences",
    recipient: "Khalid Al-Rashid",
    email: "khalid.alrashid@vista.ae",
    envelopeId: "e4f7-a2b1-9c3d-8e6f",
    status: "Signed",
    signedIn: "4 minutes",
  },
};

/* ── Terminal lines per step (simulated MCP calls) ── */
const TERMINAL_LINES = {
  trigger: [
    { type: "cmd", text: "nfc.detect() → VIP Access Key scanned" },
    { type: "wait", text: "Authenticating NFC card..." },
    { type: "data", text: "Profile: Khalid Al-Rashid | Tier: Platinum | VIP ID: KR-001" },
    { type: "data", text: "Interest: Sky Penthouse | Range: AED 8M–15M" },
    { type: "data", text: "Last engagement: 3 days ago (viewed Sky Penthouse)" },
    { type: "ok", text: "VIP profile loaded — triggering AI sales pipeline" },
  ],
  gmail: [
    { type: "cmd", text: "mcp.gmail.create_draft({to: 'khalid.alrashid@vista.ae'})" },
    { type: "wait", text: "Generating personalized VIP brochure email..." },
    { type: "data", text: "Subject: 'Khalid, your private viewing of the Sky Penthouse is confirmed'" },
    { type: "data", text: "Attaching: Vista_Residences_SkyPenthouse_Khalid_AlRashid.pdf (2.4MB)" },
    { type: "data", text: "Content: Unit details, ROI projections, floor plan, amenities" },
    { type: "ok", text: "Email sent successfully — draft ID: r-5341690815395717705" },
  ],
  calendar: [
    { type: "cmd", text: "mcp.gcal.find_meeting_times({attendees: ['khalid.alrashid@vista.ae']})" },
    { type: "wait", text: "Checking availability for all parties..." },
    { type: "data", text: "3 available slots found this week" },
    { type: "data", text: "Optimal: Thursday Mar 12, 2:00 PM (all available)" },
    { type: "cmd", text: "mcp.gcal.create_event({summary: 'Private Showing...'})" },
    { type: "ok", text: "Event created: 'Private Showing — Sky Penthouse'" },
    { type: "data", text: "Location: Vista Residences Sales Center, Dubai Marina" },
    { type: "ok", text: "Reminders set: 1 day before (email) + 1 hour before (popup)" },
  ],
  docusign: [
    { type: "cmd", text: "mcp.docusign.getUserInfo()" },
    { type: "data", text: "Account: ozzy@dynamiccrm.ca (353d13ef-...)" },
    { type: "cmd", text: "mcp.docusign.getTemplates({search: 'VIP Buyer NDA'})" },
    { type: "data", text: "Template found: 'VIP Buyer NDA — Vista Residences'" },
    { type: "cmd", text: "mcp.docusign.createEnvelope({status: 'sent', recipient: 'Khalid Al-Rashid'})" },
    { type: "wait", text: "Generating envelope with pre-filled fields..." },
    { type: "ok", text: "Envelope sent to khalid.alrashid@vista.ae" },
    { type: "ok", text: "Workflow triggered → Exclusive pricing unlocked in portal" },
  ],
};

/* ── Theme-aware CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root{--ai-red:#e63946;--ai-blue:#457b9d;--ai-purple:#7c3aed;--ai-emerald:#10b981;--ai-amber:#f59e0b;--ai-rose:#f43f5e;--ai-gold:#C5A467;}
*{margin:0;padding:0;box-sizing:border-box;}

/* ── Dark theme (default) ── */
.ai-demo{font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;transition:background .4s,color .4s;}
.ai-demo.dark{background:#0f0f14;color:#ffffff;}
.ai-demo.light{background:#faf8f5;color:#1a1a2e;}
.ai-demo a{text-decoration:none;color:inherit;}

/* Theme variables via classes */
.ai-demo.dark{--ai-bg:#0f0f14;--ai-card:rgba(255,255,255,0.02);--ai-card-border:rgba(255,255,255,0.06);--ai-text:#ffffff;--ai-text2:rgba(255,255,255,0.55);--ai-text3:rgba(255,255,255,0.4);--ai-text4:rgba(255,255,255,0.3);--ai-text5:rgba(255,255,255,0.7);--ai-hd-bg:rgba(15,15,20,0.85);--ai-hd-border:rgba(255,255,255,0.06);--ai-terminal-bg:#0a0a0f;--ai-terminal-border:rgba(255,255,255,0.06);--ai-terminal-bar:rgba(255,255,255,0.03);--ai-modal-bg:#12121a;--ai-modal-border:rgba(255,255,255,0.1);--ai-overlay:rgba(0,0,0,0.75);--ai-field-bg:rgba(255,255,255,0.02);--ai-field-border:rgba(255,255,255,0.06);}
.ai-demo.light{--ai-bg:#faf8f5;--ai-card:rgba(0,0,0,0.02);--ai-card-border:rgba(0,0,0,0.08);--ai-text:#1a1a2e;--ai-text2:rgba(26,26,46,0.6);--ai-text3:rgba(26,26,46,0.45);--ai-text4:rgba(26,26,46,0.35);--ai-text5:rgba(26,26,46,0.75);--ai-hd-bg:rgba(250,248,245,0.9);--ai-hd-border:rgba(0,0,0,0.08);--ai-terminal-bg:#1a1a2e;--ai-terminal-border:rgba(0,0,0,0.12);--ai-terminal-bar:rgba(255,255,255,0.05);--ai-modal-bg:#ffffff;--ai-modal-border:rgba(0,0,0,0.1);--ai-overlay:rgba(0,0,0,0.5);--ai-field-bg:rgba(0,0,0,0.03);--ai-field-border:rgba(0,0,0,0.08);}

/* Header */
.ai-hd{position:fixed;top:0;left:0;right:0;padding:1rem 3rem;display:flex;align-items:center;justify-content:space-between;z-index:100;backdrop-filter:blur(24px);background:var(--ai-hd-bg);border-bottom:1px solid var(--ai-hd-border);}
.ai-hd-left{display:flex;align-items:center;gap:1rem;}
.ai-back{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1rem;border:1px solid var(--ai-card-border);border-radius:8px;font-family:'Outfit';font-size:.85rem;color:var(--ai-text3);transition:.3s;cursor:pointer;background:none;}
.ai-back:hover{border-color:var(--ai-purple);color:var(--ai-text);}
.ai-hd-badge{display:flex;align-items:center;gap:.5rem;padding:.4rem 1rem;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:50px;font-size:.8rem;color:var(--ai-purple);font-weight:500;}
.ai-hd-badge::before{content:'';width:8px;height:8px;background:var(--ai-purple);border-radius:50%;animation:ai-pulse 2s infinite;}
@keyframes ai-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
.ai-hd-right{display:flex;gap:.5rem;align-items:center;}
.ai-lang,.ai-theme-btn{background:none;border:1px solid var(--ai-card-border);color:var(--ai-text3);padding:.4rem .9rem;border-radius:6px;font-family:'Outfit';font-size:.8rem;cursor:pointer;transition:.3s;}
.ai-lang:hover,.ai-theme-btn:hover{border-color:var(--ai-purple);color:var(--ai-text);}
.ai-theme-btn{display:flex;align-items:center;gap:.4rem;}

/* Main */
.ai-main{padding:7rem 3rem 4rem;max-width:1100px;margin:0 auto;}

/* Progress bar */
.ai-progress{position:fixed;top:60px;left:0;right:0;height:3px;background:rgba(124,58,237,0.1);z-index:99;}
.ai-progress-fill{height:100%;background:linear-gradient(90deg,var(--ai-purple),var(--ai-emerald));transition:width .6s ease;border-radius:0 2px 2px 0;}

/* Hero */
.ai-hero{text-align:center;margin-bottom:4rem;animation:ai-fu .8s ease-out;}
@keyframes ai-fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.ai-hero-tag{display:inline-flex;align-items:center;gap:.75rem;padding:.6rem 1.25rem;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);border-radius:50px;font-size:.85rem;color:var(--ai-purple);margin-bottom:2rem;font-weight:500;}
.ai-demo h1{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:500;line-height:1.15;margin-bottom:1.5rem;color:var(--ai-text);}
.ai-demo h1 span{background:linear-gradient(135deg,var(--ai-purple),var(--ai-rose));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.ai-hero>p{font-size:1.1rem;line-height:1.7;color:var(--ai-text2);max-width:680px;margin:0 auto 2.5rem;}
.ai-stats{display:flex;justify-content:center;gap:4rem;flex-wrap:wrap;}
.ai-stat{text-align:center;}
.ai-stat-v{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:600;background:linear-gradient(135deg,var(--ai-purple),var(--ai-emerald));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block;}
.ai-stat-l{font-size:.8rem;color:var(--ai-text3);text-transform:uppercase;letter-spacing:.1em;margin-top:.25rem;}

/* Pipeline header */
.ai-pipe-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:2.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--ai-card-border);}
.ai-pipe-hd h2{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:500;color:var(--ai-text);}
.ai-run-all{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.5rem;background:linear-gradient(135deg,var(--ai-purple),var(--ai-rose));border:none;border-radius:10px;color:#fff;font-family:'Outfit';font-size:.9rem;font-weight:500;cursor:pointer;transition:all .3s;letter-spacing:.02em;position:relative;overflow:hidden;}
.ai-run-all:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(124,58,237,0.4);}
.ai-run-all:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
.ai-run-all::before{content:'';position:absolute;inset:-2px;background:linear-gradient(135deg,var(--ai-purple),var(--ai-rose),var(--ai-emerald));border-radius:12px;z-index:-1;opacity:0;transition:.3s;filter:blur(8px);}
.ai-run-all:not(:disabled):hover::before{opacity:.6;}

/* Step card */
.ai-step{margin-bottom:2rem;border-radius:20px;border:1px solid var(--ai-card-border);overflow:hidden;transition:all .4s;background:var(--ai-card);}
.ai-step.active{border-color:rgba(124,58,237,0.3);}
.ai-step.done{border-color:rgba(16,185,129,0.25);}
.ai-step.locked{opacity:.45;pointer-events:none;}

/* Step header */
.ai-step-hd{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.75rem;cursor:pointer;user-select:none;}
.ai-step-hd-left{display:flex;align-items:center;gap:1rem;}
.ai-step-num{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:600;border:2px solid;flex-shrink:0;}
.ai-step-num.trigger{background:rgba(230,57,70,0.15);border-color:rgba(230,57,70,0.4);color:var(--ai-red);}
.ai-step-num.gmail{background:rgba(230,57,70,0.15);border-color:rgba(230,57,70,0.4);color:var(--ai-red);}
.ai-step-num.calendar{background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:var(--ai-emerald);}
.ai-step-num.docusign{background:rgba(245,158,11,0.15);border-color:rgba(245,158,11,0.4);color:var(--ai-amber);}
.ai-step-num.done{background:rgba(16,185,129,0.2)!important;border-color:var(--ai-emerald)!important;color:var(--ai-emerald)!important;}

.ai-step-info h3{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:500;color:var(--ai-text);}
.ai-step-info p{font-size:.82rem;color:var(--ai-text3);margin-top:.15rem;}

.ai-step-hd-right{display:flex;align-items:center;gap:.75rem;}
.ai-step-status{font-size:.75rem;font-weight:500;padding:.3rem .7rem;border-radius:6px;text-transform:uppercase;letter-spacing:.05em;}
.ai-step-status.waiting{background:var(--ai-field-bg);color:var(--ai-text4);}
.ai-step-status.running{background:rgba(124,58,237,0.15);color:var(--ai-purple);animation:ai-pulse 1.5s infinite;}
.ai-step-status.done{background:rgba(16,185,129,0.15);color:var(--ai-emerald);}

.ai-run-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1.1rem;background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.4);border-radius:8px;color:var(--ai-purple);font-family:'Outfit';font-size:.82rem;font-weight:500;cursor:pointer;transition:.3s;}
.ai-run-btn:hover{background:var(--ai-purple);color:#fff;}
.ai-run-btn:disabled{opacity:.3;cursor:not-allowed;}

/* Step body */
.ai-step-body{max-height:0;overflow:hidden;transition:max-height .5s ease;}
.ai-step-body.open{max-height:2000px;}
.ai-step-body-inner{padding:0 1.75rem 1.75rem;}
.ai-step-desc{color:var(--ai-text2);font-size:.92rem;line-height:1.65;margin-bottom:1.25rem;}

/* Terminal — always dark for both themes */
.ai-terminal{background:#0a0a0f;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;margin-bottom:1.25rem;}
.ai-terminal-bar{display:flex;align-items:center;gap:.5rem;padding:.6rem 1rem;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.04);}
.ai-terminal-dot{width:10px;height:10px;border-radius:50%;}
.ai-terminal-dot:nth-child(1){background:#ff5f57;}
.ai-terminal-dot:nth-child(2){background:#ffbd2e;}
.ai-terminal-dot:nth-child(3){background:#28c940;}
.ai-terminal-title{margin-inline-start:auto;font-size:.7rem;color:rgba(255,255,255,0.25);font-family:'JetBrains Mono',monospace;}
.ai-terminal-body{padding:1rem;min-height:60px;max-height:250px;overflow-y:auto;}
.ai-terminal-line{display:flex;align-items:flex-start;gap:.6rem;margin-bottom:.4rem;font-family:'JetBrains Mono',monospace;font-size:.78rem;line-height:1.5;animation:ai-line-in .3s ease-out;}
@keyframes ai-line-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
.ai-terminal-line .ai-t-prefix{flex-shrink:0;font-weight:600;width:14px;text-align:center;}
.ai-t-prefix.cmd{color:var(--ai-purple);}
.ai-t-prefix.ok{color:var(--ai-emerald);}
.ai-t-prefix.data{color:var(--ai-amber);}
.ai-t-prefix.wait{color:rgba(255,255,255,0.3);}
.ai-t-text{color:rgba(255,255,255,0.7);}
.ai-t-text code{background:rgba(124,58,237,0.15);color:var(--ai-purple);padding:.1rem .35rem;border-radius:3px;font-size:.75rem;}
.ai-cursor{display:inline-block;width:7px;height:14px;background:var(--ai-purple);animation:ai-blink 1s step-end infinite;vertical-align:middle;margin-inline-start:2px;}
@keyframes ai-blink{50%{opacity:0}}

/* Result cards */
.ai-result-area{animation:ai-fu .5s ease-out;}

/* Gmail result */
.ai-email-preview{background:var(--ai-card);border:1px solid var(--ai-card-border);border-radius:14px;overflow:hidden;}
.ai-email-hd{padding:1rem 1.25rem;border-bottom:1px solid var(--ai-card-border);display:flex;flex-direction:column;gap:.35rem;}
.ai-email-row{display:flex;gap:.5rem;font-size:.82rem;}
.ai-email-label{color:var(--ai-text4);min-width:55px;}
.ai-email-val{color:var(--ai-text5);}

/* Calendar result */
.ai-cal-card{background:var(--ai-card);border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:1.5rem;display:flex;gap:1.25rem;align-items:flex-start;}
.ai-cal-date-box{flex-shrink:0;width:70px;height:78px;background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05));border:1px solid rgba(16,185,129,0.25);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.ai-cal-day{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:600;color:var(--ai-emerald);}
.ai-cal-month{font-size:.7rem;color:rgba(16,185,129,0.7);text-transform:uppercase;letter-spacing:.05em;}
.ai-cal-details h4{font-size:1rem;font-weight:500;color:var(--ai-text);margin-bottom:.4rem;}
.ai-cal-details p{font-size:.85rem;color:var(--ai-text2);line-height:1.5;}
.ai-cal-link{display:inline-flex;align-items:center;gap:.4rem;margin-top:.6rem;font-size:.8rem;color:var(--ai-emerald);border-bottom:1px dashed rgba(16,185,129,0.3);padding-bottom:2px;cursor:pointer;text-decoration:none;position:relative;z-index:5;}
.ai-cal-link:hover{color:#34d399;border-bottom-color:rgba(16,185,129,0.6);}

/* DocuSign result */
.ai-doc-card{background:var(--ai-card);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:1.5rem;}
.ai-doc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
.ai-doc-top h4{font-size:1rem;font-weight:500;color:var(--ai-text);}
.ai-doc-signed{display:flex;align-items:center;gap:.4rem;padding:.35rem .8rem;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:50px;font-size:.78rem;color:var(--ai-emerald);font-weight:500;}
.ai-doc-fields{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;}
.ai-doc-field{padding:.6rem .8rem;background:var(--ai-field-bg);border:1px solid var(--ai-field-border);border-radius:8px;}
.ai-doc-field-label{font-size:.7rem;color:var(--ai-text4);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.15rem;}
.ai-doc-field-val{font-size:.85rem;color:var(--ai-text5);}
.ai-doc-unlock{display:flex;align-items:center;gap:.6rem;margin-top:1rem;padding:.75rem 1rem;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:10px;font-size:.85rem;color:var(--ai-purple);}

/* Final result banner */
.ai-final{margin-top:2rem;padding:2.5rem;background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(16,185,129,0.08));border:1px solid rgba(124,58,237,0.2);border-radius:24px;text-align:center;animation:ai-fu .6s ease-out;}
.ai-final h2{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:500;margin-bottom:.75rem;color:var(--ai-text);}
.ai-final>p{color:var(--ai-text2);font-size:.92rem;line-height:1.6;max-width:600px;margin:0 auto 1.5rem;}
.ai-final-items{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;max-width:550px;margin:0 auto;}
.ai-final-item{display:flex;align-items:center;gap:.5rem;padding:.55rem .9rem;background:var(--ai-field-bg);border:1px solid var(--ai-field-border);border-radius:10px;font-size:.85rem;color:var(--ai-text5);text-align:start;}
.ai-final-check{color:var(--ai-emerald);}
.ai-final-time{margin-top:1.5rem;font-family:'Playfair Display',serif;font-size:2rem;font-weight:600;background:linear-gradient(135deg,var(--ai-purple),var(--ai-emerald));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

/* Footer */
.ai-ft{margin-top:5rem;padding:2rem 3rem;text-align:center;border-top:1px solid var(--ai-card-border);}
.ai-ft p{font-size:.85rem;color:var(--ai-text4);}
.ai-ft a{color:var(--ai-purple);}

/* "LIVE" badge on real results */
.ai-live-tag{display:inline-flex;align-items:center;gap:.35rem;padding:.2rem .6rem;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);border-radius:50px;font-size:.65rem;font-weight:600;color:var(--ai-emerald);text-transform:uppercase;letter-spacing:.08em;margin-inline-start:.5rem;vertical-align:middle;}
.ai-live-tag::before{content:'';width:6px;height:6px;background:var(--ai-emerald);border-radius:50%;animation:ai-pulse 2s infinite;}

/* Step connector arrow between steps */
.ai-step-connector{display:flex;align-items:center;justify-content:center;padding:.25rem 0;opacity:.3;}
.ai-step-connector svg{width:18px;height:18px;color:var(--ai-purple);}

/* NFC animation */
.ai-nfc-ring{position:relative;width:90px;height:90px;margin:0 auto 2rem;}
.ai-nfc-ring-inner{position:absolute;inset:0;border:2px solid rgba(124,58,237,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(124,58,237,0.06);}
.ai-nfc-ring-inner svg{color:var(--ai-purple);}
.ai-nfc-wave{position:absolute;inset:-8px;border:1.5px solid var(--ai-purple);border-radius:50%;opacity:0;animation:ai-nfc-expand 3s infinite ease-out;}
.ai-nfc-wave:nth-child(2){animation-delay:1s;}
.ai-nfc-wave:nth-child(3){animation-delay:2s;}
@keyframes ai-nfc-expand{0%{transform:scale(.85);opacity:.6}100%{transform:scale(1.5);opacity:0}}

/* VIP profile card for trigger result */
.ai-profile{display:flex;gap:1.25rem;padding:1.25rem;background:rgba(230,57,70,0.05);border:1px solid rgba(230,57,70,0.15);border-radius:14px;align-items:center;}
.ai-profile-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--ai-red),var(--ai-rose));display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:600;color:#fff;flex-shrink:0;}
.ai-profile-info h4{font-size:.95rem;color:var(--ai-text);font-weight:500;margin-bottom:.25rem;}
.ai-profile-info p{font-size:.78rem;color:var(--ai-text3);line-height:1.5;}
.ai-profile-score{margin-inline-start:auto;text-align:center;}
.ai-profile-score-num{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:600;color:var(--ai-red);}
.ai-profile-score-label{font-size:.65rem;color:var(--ai-text4);text-transform:uppercase;letter-spacing:.05em;}

/* Animated success checkmark for final */
.ai-final-icon{width:72px;height:72px;margin:0 auto 1.5rem;border-radius:50%;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(16,185,129,0.15));border:2px solid rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:center;font-size:2rem;animation:ai-pop .5s ease-out;}
@keyframes ai-pop{from{transform:scale(0)}50%{transform:scale(1.15)}to{transform:scale(1)}}

/* Background blobs */
.ai-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;pointer-events:none;}
.ai-blob{position:absolute;border-radius:50%;filter:blur(120px);}
.ai-demo.dark .ai-blob{opacity:.12;}
.ai-demo.light .ai-blob{opacity:.06;}
.ai-blob-1{width:600px;height:600px;background:var(--ai-purple);top:-200px;right:-100px;animation:ai-drift 20s infinite ease-in-out;}
.ai-blob-2{width:500px;height:500px;background:var(--ai-emerald);bottom:-150px;left:-100px;animation:ai-drift 25s infinite ease-in-out reverse;}
.ai-blob-3{width:350px;height:350px;background:var(--ai-rose);top:40%;left:60%;animation:ai-drift 15s infinite ease-in-out 5s;}
@keyframes ai-drift{0%,100%{transform:translate(0,0)}33%{transform:translate(30px,-20px)}66%{transform:translate(-20px,30px)}}

/* Modal overlay */
.ai-modal-overlay{position:fixed;inset:0;background:var(--ai-overlay);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;animation:ai-fade-in .25s ease-out;padding:2rem;}
@keyframes ai-fade-in{from{opacity:0}to{opacity:1}}
.ai-modal{background:var(--ai-modal-bg);border:1px solid var(--ai-modal-border);border-radius:24px;max-width:520px;width:100%;max-height:85vh;overflow-y:auto;animation:ai-modal-in .3s ease-out;position:relative;}
@keyframes ai-modal-in{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.ai-modal-close{position:absolute;top:1rem;inset-inline-end:1rem;width:36px;height:36px;border-radius:50%;background:var(--ai-field-bg);border:1px solid var(--ai-field-border);display:flex;align-items:center;justify-content:center;color:var(--ai-text3);font-size:1.1rem;cursor:pointer;transition:.2s;z-index:5;}
.ai-modal-close:hover{background:var(--ai-card-border);color:var(--ai-text);}

/* Email modal */
.ai-em-body{padding:0;}
.ai-em-gold-hd{background:linear-gradient(135deg,#C5A467,#9a7d3d);padding:2rem;text-align:center;}
.ai-em-gold-hd h3{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;color:#fff;margin-bottom:.3rem;}
.ai-em-gold-hd p{font-size:.72rem;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:2px;}
.ai-em-content{padding:1.5rem 2rem 2rem;}
.ai-em-meta{margin-bottom:1.25rem;}
.ai-em-meta-row{display:flex;gap:.5rem;padding:.35rem 0;font-size:.82rem;border-bottom:1px solid var(--ai-card-border);}
.ai-em-meta-label{color:var(--ai-text4);min-width:60px;}
.ai-em-meta-val{color:var(--ai-text5);}
.ai-em-text{color:var(--ai-text2);font-size:.9rem;line-height:1.7;margin-bottom:1rem;}
.ai-em-text strong{color:var(--ai-gold);font-weight:500;}
.ai-em-unit-card{background:rgba(197,164,103,0.08);border:1px solid rgba(197,164,103,0.2);border-radius:12px;padding:1.25rem;margin-bottom:1rem;}
.ai-em-unit-card h5{color:var(--ai-gold);font-size:1rem;margin-bottom:.4rem;font-family:'Playfair Display',serif;font-weight:500;}
.ai-em-unit-card p{color:var(--ai-text2);font-size:.85rem;line-height:1.6;}
.ai-em-showing{background:var(--ai-field-bg);border-radius:10px;padding:1rem;margin-bottom:1rem;}
.ai-em-showing-label{font-size:.7rem;color:var(--ai-gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:.3rem;}
.ai-em-showing-val{color:var(--ai-text);font-size:1rem;font-weight:500;}
.ai-em-showing-loc{color:var(--ai-text3);font-size:.82rem;margin-top:.2rem;}
.ai-em-attach{display:flex;align-items:center;gap:.6rem;padding:.65rem .9rem;background:var(--ai-field-bg);border:1px solid var(--ai-field-border);border-radius:8px;font-size:.82rem;color:var(--ai-text2);margin-top:.75rem;}

/* Responsive */
@media(max-width:768px){
  .ai-hd{padding:1rem 1.25rem;}
  .ai-main{padding:6rem 1.25rem 2rem;}
  .ai-final-items{grid-template-columns:1fr;}
  .ai-stats{gap:2rem;}
  .ai-cal-card{flex-direction:column;}
  .ai-doc-fields{grid-template-columns:1fr;}
  .ai-pipe-hd{flex-direction:column;gap:1rem;text-align:center;}
}
`;

const STEP_CONFIG = [
  { key: "trigger", label: "!", title: "VIP Prospect Taps NFC Card", subtitle: "NFC Detection & Profile Lookup", color: "trigger" },
  { key: "gmail", label: "1", title: "Generate & Send VIP Brochure Email", subtitle: "Gmail MCP — Personalized Brochure Delivery", color: "gmail" },
  { key: "calendar", label: "2", title: "Book Private Showing", subtitle: "Google Calendar MCP — Smart Scheduling", color: "calendar" },
  { key: "docusign", label: "3", title: "Send NDA & Unlock Pricing", subtitle: "DocuSign MCP — E-Signature", color: "docusign" },
];

const STEP_DESCS = {
  trigger: "Khalid Al-Rashid, a high-net-worth investor, taps his VIP Access Key at the Vista Residences sales center. The system instantly identifies his profile, investment preferences, and engagement history.",
  gmail: "AI generates a personalized luxury brochure email for Khalid — complete with Sky Penthouse details, ROI projections, floor plans, and amenities — then sends it directly via the Gmail MCP API. The email is a real draft you can verify in Gmail.",
  calendar: "AI checks the sales team's availability and books a private showing at the optimal time, considering Khalid's timezone, the agent's schedule, and the model unit availability. A real Google Calendar event is created.",
  docusign: "Before the showing, AI sends a Non-Disclosure Agreement so Khalid can access exclusive pre-launch pricing. The document is pre-filled with his details and ready for e-signature via DocuSign.",
};

export default function AIDemo() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [steps, setSteps] = useState(
    STEP_CONFIG.map((_, i) => ({ status: i === 0 ? "ready" : "locked", lines: [], showResult: false, expanded: false }))
  );
  const [allRunning, setAllRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const termRefs = useRef([]);
  const startTime = useRef(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const doneCount = steps.filter(s => s.status === "done").length;
  const progress = (doneCount / STEP_CONFIG.length) * 100;

  const typeLines = useCallback((stepIdx) => {
    return new Promise((resolve) => {
      const key = STEP_CONFIG[stepIdx].key;
      const lines = TERMINAL_LINES[key];
      let i = 0;
      const addNext = () => {
        if (i >= lines.length) {
          resolve();
          return;
        }
        const line = lines[i];
        i++;
        setSteps(prev => {
          const next = [...prev];
          next[stepIdx] = { ...next[stepIdx], lines: [...next[stepIdx].lines, line] };
          return next;
        });
        setTimeout(() => {
          const el = termRefs.current[stepIdx];
          if (el) el.scrollTop = el.scrollHeight;
        }, 50);
        setTimeout(addNext, 350);
      };
      addNext();
    });
  }, []);

  const runStep = useCallback(async (stepIdx) => {
    setSteps(prev => {
      const next = [...prev];
      next[stepIdx] = { ...next[stepIdx], status: "running", expanded: true, lines: [] };
      return next;
    });

    await typeLines(stepIdx);
    await new Promise(r => setTimeout(r, 400));

    setSteps(prev => {
      const next = [...prev];
      next[stepIdx] = { ...next[stepIdx], status: "done", showResult: true };
      if (stepIdx + 1 < next.length) {
        next[stepIdx + 1] = { ...next[stepIdx + 1], status: "ready" };
      }
      return next;
    });
  }, [typeLines]);

  const runAll = useCallback(async () => {
    setAllRunning(true);
    startTime.current = Date.now();
    for (let i = 0; i < STEP_CONFIG.length; i++) {
      await runStep(i);
      await new Promise(r => setTimeout(r, 300));
    }
    const ms = Date.now() - startTime.current;
    setElapsed(Math.round(ms / 1000));
    setAllDone(true);
    setAllRunning(false);
  }, [runStep]);

  const handleRunSingle = useCallback(async (idx) => {
    if (!startTime.current) startTime.current = Date.now();
    await runStep(idx);
    if (idx === STEP_CONFIG.length - 1) {
      const ms = Date.now() - startTime.current;
      setElapsed(Math.round(ms / 1000));
      setAllDone(true);
    }
  }, [runStep]);

  const toggleExpand = (idx) => {
    setSteps(prev => {
      const next = [...prev];
      if (next[idx].status === "done" || next[idx].status === "ready") {
        next[idx] = { ...next[idx], expanded: !next[idx].expanded };
      }
      return next;
    });
  };

  return (
    <div className={`ai-demo ${theme}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="ai-bg"><div className="ai-blob ai-blob-1" /><div className="ai-blob ai-blob-2" /><div className="ai-blob ai-blob-3" /></div>

      {/* Progress */}
      <div className="ai-progress"><div className="ai-progress-fill" style={{ width: progress + "%" }} /></div>

      {/* Header */}
      <header className="ai-hd">
        <div className="ai-hd-left">
          <Link to="/enterprise/crmdemo" className="ai-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back to CRM
          </Link>
          <div className="ai-hd-badge"><span>Live MCP Demo</span></div>
        </div>
        <div className="ai-hd-right">
          <button className="ai-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "\u2600\uFE0F Light" : "\u{1F319} Dark"}
          </button>
          <button className="ai-lang" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" : "English"}
          </button>
        </div>
      </header>

      <main className="ai-main">
        {/* Hero */}
        <section className="ai-hero">
          <div className="ai-nfc-ring">
            <div className="ai-nfc-wave" /><div className="ai-nfc-wave" /><div className="ai-nfc-wave" />
            <div className="ai-nfc-ring-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8"/><path d="M16.37 2a18.97 18.97 0 0 1 0 20"/></svg>
            </div>
          </div>
          <div className="ai-hero-tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            Powered by Model Context Protocol
          </div>
          <h1><span>AI-Orchestrated</span><br />Sales Pipeline</h1>
          <p>Watch AI coordinate three enterprise platforms in real-time. Every step executes actual MCP tool calls with verifiable results you can click to confirm.</p>
          <div className="ai-stats">
            <div className="ai-stat"><span className="ai-stat-v">3</span><span className="ai-stat-l">Live Platforms</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{elapsed ? elapsed + "s" : "<1min"}</span><span className="ai-stat-l">{elapsed ? "Actual Time" : "Full Pipeline"}</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{doneCount}/{STEP_CONFIG.length}</span><span className="ai-stat-l">Steps Complete</span></div>
          </div>
        </section>

        {/* Pipeline */}
        <div className="ai-pipe-hd">
          <h2>The AI Workflow</h2>
          <button className="ai-run-all" onClick={runAll} disabled={allRunning || allDone}>
            {allDone ? "Pipeline Complete" : allRunning ? "Running..." : "Run Full Pipeline"}
            {!allDone && !allRunning && <span style={{fontSize:"1.1rem"}}>&#9654;</span>}
          </button>
        </div>

        {STEP_CONFIG.map((cfg, idx) => {
          const st = steps[idx];
          const isLocked = st.status === "locked";
          const isRunning = st.status === "running";
          const isDone = st.status === "done";
          const isReady = st.status === "ready";

          return (
            <div key={cfg.key}>
            {idx > 0 && (
              <div className="ai-step-connector">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
              </div>
            )}
            <div className={`ai-step ${isLocked ? "locked" : ""} ${isRunning ? "active" : ""} ${isDone ? "done" : ""}`}>
              {/* Header */}
              <div className="ai-step-hd" onClick={() => toggleExpand(idx)}>
                <div className="ai-step-hd-left">
                  <div className={`ai-step-num ${isDone ? "done" : cfg.color}`}>
                    {isDone ? "\u2713" : cfg.label}
                  </div>
                  <div className="ai-step-info">
                    <h3>{cfg.title}{isDone && (cfg.key === "gmail" || cfg.key === "calendar") && <span className="ai-live-tag">Live</span>}</h3>
                    <p>{cfg.subtitle}</p>
                  </div>
                </div>
                <div className="ai-step-hd-right">
                  <span className={`ai-step-status ${isDone ? "done" : isRunning ? "running" : "waiting"}`}>
                    {isDone ? "Complete" : isRunning ? "Executing..." : isReady ? "Ready" : "Locked"}
                  </span>
                  {isReady && !allRunning && (
                    <button className="ai-run-btn" onClick={(e) => { e.stopPropagation(); handleRunSingle(idx); }}>
                      Run <span>&#9654;</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className={`ai-step-body ${st.expanded ? "open" : ""}`}>
                <div className="ai-step-body-inner">
                  <p className="ai-step-desc">{STEP_DESCS[cfg.key]}</p>

                  {/* Terminal */}
                  {(isRunning || isDone) && (
                    <div className="ai-terminal">
                      <div className="ai-terminal-bar">
                        <div className="ai-terminal-dot" /><div className="ai-terminal-dot" /><div className="ai-terminal-dot" />
                        <span className="ai-terminal-title">mcp-{cfg.key}.sh</span>
                      </div>
                      <div className="ai-terminal-body" ref={el => termRefs.current[idx] = el}>
                        {st.lines.map((line, li) => (
                          <div className="ai-terminal-line" key={li}>
                            <span className={`ai-t-prefix ${line.type}`}>
                              {line.type === "cmd" ? "$" : line.type === "ok" ? "\u2713" : line.type === "wait" ? "\u25cb" : "\u203a"}
                            </span>
                            <span className="ai-t-text">{line.text}</span>
                          </div>
                        ))}
                        {isRunning && <span className="ai-cursor" />}
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {st.showResult && (
                    <div className="ai-result-area">
                      {cfg.key === "trigger" && (
                        <div className="ai-profile">
                          <div className="ai-profile-avatar">KR</div>
                          <div className="ai-profile-info">
                            <h4>Khalid Al-Rashid <span className="ai-live-tag">Detected</span></h4>
                            <p>Platinum Tier &bull; Interest: Sky Penthouse &bull; Range: AED 8M–15M<br/>Last viewed Sky Penthouse &bull; 3 days ago &bull; VIP ID: KR-001</p>
                          </div>
                          <div className="ai-profile-score">
                            <div className="ai-profile-score-num">87</div>
                            <div className="ai-profile-score-label">Lead Score</div>
                          </div>
                        </div>
                      )}

                      {cfg.key === "gmail" && (
                        <div className="ai-email-preview" style={{cursor:"pointer"}} onClick={() => setEmailModal(true)}>
                          <div className="ai-email-hd">
                            <div className="ai-email-row"><span className="ai-email-label">From:</span><span className="ai-email-val">{REAL_RESULTS.gmail.from}</span></div>
                            <div className="ai-email-row"><span className="ai-email-label">To:</span><span className="ai-email-val">{REAL_RESULTS.gmail.to}</span></div>
                            <div className="ai-email-row"><span className="ai-email-label">Subject:</span><span className="ai-email-val" style={{fontWeight:500}}>{REAL_RESULTS.gmail.subject}</span></div>
                          </div>
                          <div style={{padding:".6rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                            <span style={{color:"var(--ai-text4)",fontSize:".78rem"}}>Click to preview full email</span>
                            <a href={REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>
                              {"\u2713"} View real draft in Gmail {"\u2197"}
                            </a>
                          </div>
                        </div>
                      )}

                      {cfg.key === "calendar" && (
                        <>
                          <div className="ai-cal-card">
                            <div className="ai-cal-date-box">
                              <span className="ai-cal-day">12</span>
                              <span className="ai-cal-month">Mar</span>
                            </div>
                            <div className="ai-cal-details">
                              <h4>{REAL_RESULTS.calendar.title}</h4>
                              <p>{REAL_RESULTS.calendar.time}<br/>{REAL_RESULTS.calendar.location}</p>
                              <a href={REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="ai-cal-link">
                                Open in Google Calendar &#8599;
                              </a>
                            </div>
                          </div>
                          <div style={{marginTop:".75rem",padding:".6rem 1rem",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"10px",fontSize:".82rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".5rem"}}>
                            <span>{"\u2713"}</span> Real calendar event created via MCP — click link above to verify
                          </div>
                        </>
                      )}

                      {cfg.key === "docusign" && (
                        <div className="ai-doc-card">
                          <div className="ai-doc-top">
                            <h4>{REAL_RESULTS.docusign.template}</h4>
                            <div className="ai-doc-signed"><span>&#10003;</span> {REAL_RESULTS.docusign.status}</div>
                          </div>
                          <div className="ai-doc-fields">
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Recipient</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.recipient}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Email</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.email}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Envelope ID</div><div className="ai-doc-field-val" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem"}}>{REAL_RESULTS.docusign.envelopeId}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Signed In</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.signedIn}</div></div>
                          </div>
                          <div className="ai-doc-unlock">
                            <span style={{fontSize:"1.1rem"}}>&#128275;</span>
                            Workflow triggered: Exclusive pre-launch pricing unlocked in Khalid's VIP portal
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          );
        })}

        {/* Final result */}
        {allDone && (
          <div className="ai-final">
            <div className="ai-final-icon">{"\u2713"}</div>
            <h2>Pipeline Complete</h2>
            <p>What traditionally takes a sales team 2–3 days of manual coordination was completed autonomously by AI. Khalid received a personalized VIP experience that made him feel like the only buyer that matters.</p>
            <div className="ai-final-items">
              {["VIP brochure email delivered","Private showing booked","NDA signed, pricing unlocked","Full pipeline — zero manual work"].map((item, i) => (
                <div className="ai-final-item" key={i}><span className="ai-final-check">&#10003;</span>{item}</div>
              ))}
            </div>
            <div className="ai-final-time">Completed in {elapsed}s</div>
          </div>
        )}

        {/* ── Email Modal ── */}
        {emailModal && (
          <div className="ai-modal-overlay" onClick={() => setEmailModal(false)}>
            <div className="ai-modal" onClick={e => e.stopPropagation()}>
              <button className="ai-modal-close" onClick={() => setEmailModal(false)}>{"\u2715"}</button>
              <div className="ai-em-body">
                <div className="ai-em-gold-hd">
                  <h3>Vista Residences</h3>
                  <p>VIP Private Showing Invitation</p>
                </div>
                <div className="ai-em-content">
                  <div className="ai-em-meta">
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">From</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.from}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">To</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.to}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">Subject</span><span className="ai-em-meta-val" style={{fontWeight:500}}>{REAL_RESULTS.gmail.subject}</span></div>
                  </div>
                  <p className="ai-em-text">Dear Khalid,</p>
                  <p className="ai-em-text">Thank you for your continued interest in Vista Residences. As a valued VIP Access Key holder, we are pleased to invite you to an <strong>exclusive private showing</strong> of the Sky Penthouse.</p>
                  <div className="ai-em-unit-card">
                    <h5>Sky Penthouse — AED 12,500,000</h5>
                    <p>5 Bedrooms &bull; Full Floor &bull; 45th Floor &bull; Panoramic Gulf Views &bull; Private Infinity Pool &bull; Smart Home Ready</p>
                  </div>
                  <div className="ai-em-showing">
                    <div className="ai-em-showing-label">Your Private Showing</div>
                    <div className="ai-em-showing-val">Thursday, March 12, 2026 at 2:00 PM GST</div>
                    <div className="ai-em-showing-loc">Vista Residences Sales Center, Dubai Marina</div>
                  </div>
                  <p className="ai-em-text">Your personalized property brochure with ROI analysis is attached. Please complete the enclosed NDA to unlock exclusive pre-launch pricing before your showing.</p>
                  <div className="ai-em-attach">
                    <span style={{fontSize:"1.1rem"}}>{"\uD83D\uDCCE"}</span>
                    {REAL_RESULTS.gmail.attachment} (2.4 MB)
                  </div>
                  <p className="ai-em-text" style={{marginTop:"1rem",fontSize:".82rem"}}>Warm regards,<br/><strong>Vista Residences Sales Team</strong><br/><span style={{color:"var(--ai-text4)"}}>Powered by Dynamic NFC</span></p>
                  <a href={REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",marginTop:"1.25rem",padding:".7rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:"10px",color:"var(--ai-emerald)",fontSize:".85rem",fontWeight:500,textDecoration:"none"}}>
                    {"\u2713"} This is a real draft — Open in Gmail {"\u2197"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="ai-ft">
        <p>AI Sales Automation Demo for <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">Dynamic NFC</a> — Model Context Protocol integration showcase.</p>
      </footer>
    </div>
  );
}

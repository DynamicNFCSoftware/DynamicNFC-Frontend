/* AIDemo-patch.cjs — Safe, idempotent patch */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'AIDemo.jsx');
if (!fs.existsSync(file)) { console.error('AIDemo.jsx not found!'); process.exit(1); }

let c = fs.readFileSync(file, 'utf-8');

// Abort if already patched
if (c.includes('googleLiveApi')) {
  console.log('Already patched — skipping.');
  process.exit(0);
}

// Backup
fs.writeFileSync(file + '.bak-original', c);

// 1. Add import
c = c.replace(
  'import { Link } from "react-router-dom";',
  'import { Link } from "react-router-dom";\nimport { loadGIS, requestToken, getUserInfo, createGmailDraft, createCalendarEvent, revokeToken, buildVipEmailHtml } from "./googleLiveApi";'
);

// 2. Add state after emailModal
c = c.replace(
  'const [emailModal, setEmailModal] = useState(false);',
  'const [emailModal, setEmailModal] = useState(false);\n  const [googleToken, setGoogleToken] = useState(null);\n  const [googleUser, setGoogleUser] = useState(null);\n  const [gisReady, setGisReady] = useState(false);\n  const [connecting, setConnecting] = useState(false);\n  const [liveResults, setLiveResults] = useState({ gmail: null, calendar: null });'
);

// 3. Add GIS load useEffect before the CSS useEffect
c = c.replace(
  '  useEffect(() => {\n    const el = document.createElement("style");',
  '  useEffect(() => { loadGIS().then(ok => setGisReady(ok)); return () => { if (googleToken) revokeToken(googleToken); }; }, []);\n\n  useEffect(() => {\n    const el = document.createElement("style");'
);

// 4. Add connect handlers before doneCount
c = c.replace(
  '  const doneCount =',
  `  const handleGoogleConnect = async () => {
    setConnecting(true);
    try { const token = await requestToken(); const user = await getUserInfo(token); setGoogleToken(token); setGoogleUser(user); }
    catch (err) { console.error("Google connect failed:", err); }
    finally { setConnecting(false); }
  };
  const handleGoogleDisconnect = () => { if (googleToken) revokeToken(googleToken); setGoogleToken(null); setGoogleUser(null); setLiveResults({ gmail: null, calendar: null }); };
  const isLiveMode = !!googleToken;

  const doneCount =`
);

// 5. Add live API calls in runStep — inject before docusign block
c = c.replace(
  '    // If this is the DocuSign step, call backend API in parallel with terminal animation\n    const cfg = STEP_CONFIG[stepIdx];\n    let docusignPromise = null;',
  `    const cfg = STEP_CONFIG[stepIdx];
    let liveApiPromise = null;
    if (googleToken && cfg.key === "gmail") {
      const sd = new Date(); sd.setDate(sd.getDate() + 7);
      liveApiPromise = createGmailDraft(googleToken, {
        to: googleUser?.email || "demo@example.com",
        subject: "Your private viewing of the Sky Penthouse is confirmed",
        senderName: "Vista Residences VIP",
        htmlBody: buildVipEmailHtml({ buyerName: googleUser?.name || "Valued Client", unitName: "Sky Penthouse — Unit PH-4201", unitPrice: "AED 12,500,000", showingDate: sd.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" }), showingTime: "2:00 PM GST", showingLocation: "Vista Residences Sales Center, Dubai Marina" }),
      }).then(r => setLiveResults(p => ({ ...p, gmail: r }))).catch(e => console.error("Live Gmail:", e));
    }
    if (googleToken && cfg.key === "calendar") {
      const s = new Date(); s.setDate(s.getDate() + 7); s.setHours(14,0,0,0); const e = new Date(s); e.setHours(15,0,0,0);
      liveApiPromise = createCalendarEvent(googleToken, { summary: "Private Showing — Sky Penthouse — VIP", location: "Vista Residences Sales Center, Dubai Marina", description: "Exclusive private viewing. Powered by DynamicNFC.", startDateTime: s.toISOString(), endDateTime: e.toISOString() })
        .then(r => setLiveResults(p => ({ ...p, calendar: r }))).catch(e => console.error("Live Calendar:", e));
    }
    let docusignPromise = null;`
);

// 6. Wait for liveApiPromise
c = c.replace(
  '    if (docusignPromise) await docusignPromise;',
  '    if (liveApiPromise) await liveApiPromise;\n    if (docusignPromise) await docusignPromise;'
);

// 7. Add CSS
const connectCSS = `
.ai-connect{margin-bottom:2.5rem;padding:1.75rem;background:var(--ai-card);border:1px solid var(--ai-card-border);border-radius:20px;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;}
.ai-connect-left{display:flex;flex-direction:column;gap:.35rem;}
.ai-connect-left h3{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:500;color:var(--ai-text);}
.ai-connect-left p{font-size:.85rem;color:var(--ai-text3);line-height:1.5;}
.ai-connect-left p strong{color:var(--ai-emerald);}
.ai-connect-btn{display:inline-flex;align-items:center;gap:.6rem;padding:.7rem 1.5rem;background:#fff;border:1px solid rgba(0,0,0,.12);border-radius:10px;font-family:'Outfit';font-size:.9rem;font-weight:500;color:#333;cursor:pointer;transition:.3s;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.ai-connect-btn:hover{box-shadow:0 4px 12px rgba(0,0,0,.12);transform:translateY(-1px);}
.ai-connect-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.ai-connect-btn svg{width:20px;height:20px;}
.ai-connected{display:flex;align-items:center;gap:1rem;}
.ai-connected-info{display:flex;align-items:center;gap:.6rem;padding:.5rem 1rem;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:10px;}
.ai-connected-avatar{width:28px;height:28px;border-radius:50%;border:1px solid rgba(16,185,129,0.3);}
.ai-connected-email{font-size:.82rem;color:var(--ai-emerald);font-weight:500;}
.ai-disconnect{padding:.4rem .8rem;background:none;border:1px solid var(--ai-card-border);border-radius:6px;color:var(--ai-text4);font-family:'Outfit';font-size:.75rem;cursor:pointer;transition:.2s;}
.ai-disconnect:hover{border-color:var(--ai-rose);color:var(--ai-rose);}
.ai-mode-tag{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .7rem;border-radius:50px;font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
.ai-mode-demo{background:var(--ai-field-bg);color:var(--ai-text4);border:1px solid var(--ai-field-border);}
.ai-mode-live{background:rgba(16,185,129,0.12);color:var(--ai-emerald);border:1px solid rgba(16,185,129,0.3);}
.ai-mode-live::before{content:'';width:6px;height:6px;background:var(--ai-emerald);border-radius:50%;animation:ai-pulse 2s infinite;}
.ai-privacy-note{display:flex;align-items:center;gap:.4rem;margin-top:.5rem;font-size:.72rem;color:var(--ai-text4);}
.ai-privacy-note svg{flex-shrink:0;color:var(--ai-emerald);width:14px;height:14px;}
@media(max-width:768px){.ai-connect{flex-direction:column;text-align:center;}.ai-connected{flex-direction:column;}}
`;
c = c.replace('/* Background blobs */', connectCSS + '\n/* Background blobs */');

// 8. Add Connect UI section before pipeline header
const connectUI = `
        {/* Google Connect */}
        <div className="ai-connect">
          <div className="ai-connect-left">
            <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".25rem"}}>
              <h3>Connect Your Google Account</h3>
              <span className={isLiveMode ? "ai-mode-tag ai-mode-live" : "ai-mode-tag ai-mode-demo"}>{isLiveMode ? "Live Mode" : "Demo Mode"}</span>
            </div>
            <p>{isLiveMode ? <span>Connected as <strong>{googleUser?.email}</strong> — Gmail drafts and Calendar events will be created in your account.</span> : "Connect to see AI create real Gmail drafts and Calendar events in your own account. No credentials stored."}</p>
            {!isLiveMode && <div className="ai-privacy-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>OAuth2 popup — your password never touches our servers. Token expires when you close this page.</span></div>}
          </div>
          {isLiveMode ? (
            <div className="ai-connected">
              <div className="ai-connected-info">{googleUser?.picture && <img src={googleUser.picture} alt="" className="ai-connected-avatar" referrerPolicy="no-referrer" />}<span className="ai-connected-email">{googleUser?.email}</span></div>
              <button className="ai-disconnect" onClick={handleGoogleDisconnect}>Disconnect</button>
            </div>
          ) : (
            <button className="ai-connect-btn" onClick={handleGoogleConnect} disabled={!gisReady || connecting}>
              <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {connecting ? "Connecting..." : "Connect with Google"}
            </button>
          )}
        </div>

`;
c = c.replace(
  '        {/* Pipeline */}\n        <div className="ai-pipe-hd">',
  connectUI + '        {/* Pipeline */}\n        <div className="ai-pipe-hd">'
);

// 9. Update header badge to show mode
c = c.replace(
  '<div className="ai-hd-badge"><span>Live MCP Demo</span></div>',
  '<div className="ai-hd-badge"><span>{isLiveMode ? "Live — " + googleUser?.email : "Live MCP Demo"}</span></div>'
);

// 10. Update Gmail result links to use live data
c = c.replace(
  '                            <a href={REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>\n                              {"\\u2713"} View real draft in Gmail {"\\u2197"}',
  '                            <a href={liveResults.gmail ? "https://mail.google.com/mail/#drafts/" + liveResults.gmail.messageId : REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>\n                              {"\\u2713"} {liveResults.gmail ? "Open YOUR draft in Gmail" : "View demo draft in Gmail"} {"\\u2197"}'
);

// 11. Update Calendar link to use live data
c = c.replace(
  '<a href={REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="ai-cal-link">\n                                Open in Google Calendar &#8599;',
  '<a href={liveResults.calendar?.htmlLink || REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="ai-cal-link">\n                                {liveResults.calendar ? "Open YOUR event in Calendar" : "Open in Google Calendar"} &#8599;'
);

// 12. Update Calendar verification text
c = c.replace(
  '{"\u2713"}</span> Real calendar event created via MCP',
  '{"\u2713"}</span> {liveResults.calendar ? "Live event created in YOUR Google Calendar" : "Calendar event created via MCP"}'
);

// Done
fs.writeFileSync(file, c);
console.log('');
console.log('=== Patched successfully! ===');
console.log('Original backed up as: AIDemo.jsx.bak-original');
console.log('');

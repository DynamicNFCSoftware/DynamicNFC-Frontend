import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import './AutoAIDemo.css';
import { loadGIS, requestToken, getUserInfo, createGmailDraft, createCalendarEvent, revokeToken, buildVipEmailHtml } from "./autoGoogleLiveApi";
import canvaProposalCover from "../../assets/images/canva-proposal-cover.png";

// ═══════════════════════════════════════════════════════════════════
// AUTOMOTIVE AI SALES AUTOMATION DEMO — Interactive MCP Showcase
// ═══════════════════════════════════════════════════════════════════
// Interactive execution: each step has Run button, terminal animation,
// then reveals real MCP results (Gmail draft, Calendar event, etc.)
// Steps unlock sequentially like a real pipeline.
// Self-contained, prefix: ai-
// Supports dark & light theme toggle.
// ═══════════════════════════════════════════════════════════════════

/* ── Real results from MCP tool calls ── */
const REAL_RESULTS = {
  canva: {
    designId: "DAHDq0h2I3g",
    title: "Private Test Drive Invitation — Khalid Al-Mansouri",
    pages: 5,
    editUrl: "https://www.canva.com/d/jSENLEvDSFflEB2",
    viewUrl: "https://www.canva.com/d/rFvRuRe3S2mY5LO",
    thumbnailUrl: canvaProposalCover,
    exportFormat: "PDF",
    sections: ["Cover", "Your Vehicle", "Performance & Specs", "Your Invitation", "Back Cover"],
  },
  calendar: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    const day = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Dubai" });
    return {
      title: "Private Test Drive — AMG GT 63 S — Khalid Al-Mansouri (VIP)",
      date: day,
      time: "10:00 AM – 11:30 AM GST",
      location: "Prestige Motors VIP Lounge, Dubai Marina",
      link: "https://www.google.com/calendar/event?eid=b3VwazdtbmRldHZtamI5dnMyZHJ1bnZ0cHMgaW5mb0BkeW5hbWljbmZjLmhlbHA",
      slotsFound: 3,
    };
  })(),
  gmail: {
    to: "khalid.almansouri@prestige.ae",
    subject: "Khalid, your private test drive of the AMG GT 63 S is confirmed",
    from: "info@dynamicnfc.help",
    attachment: "Prestige_Motors_AMG_GT63S_Khalid_AlMansouri.pdf",
    draftLink: "https://mail.google.com/mail/?authuser=info@dynamicnfc.help#drafts/19ce466e35411df8",
    draftId: "r7478946889190758659",
  },
  docusign: {
    template: "VIP Test Drive Agreement — Prestige Motors",
    recipient: "Khalid Al-Mansouri",
    email: "khalid.almansouri@prestige.ae",
    envelopeId: null,
    status: "created",
    signedIn: null,
    live: false,
  },
};

/* ── Terminal lines per step (simulated MCP calls) ── */
const TERMINAL_LINES = {
  trigger: [
    { type: "cmd", text: "nfc.detect() \u2192 VIP Access Key scanned" },
    { type: "wait", text: "Authenticating NFC card..." },
    { type: "data", text: "Profile: Khalid Al-Mansouri | Tier: Platinum VIP | ID: KM-001" },
    { type: "data", text: "Interest: AMG GT 63 S E Performance | Budget: AED 800K\u20131.2M" },
    { type: "data", text: "Last engagement: 2 days ago (configured Obsidian Black + Night Package)" },
    { type: "ok", text: "VIP profile loaded \u2014 triggering AI sales pipeline" },
  ],
  canva: [
    { type: "cmd", text: "mcp.canva.generate_design({type: 'vehicle_brochure', style: 'gulf_automotive'})" },
    { type: "wait", text: "AI generating personalized VIP vehicle brochure..." },
    { type: "data", text: "Template: Prestige Motors \u2014 Dark cinematic, carbon fiber textures, gold accents" },
    { type: "data", text: "Personalizing for: Khalid Al-Mansouri \u2014 AMG GT 63 S E Performance" },
    { type: "data", text: "Pages: Cover, Your Vehicle, Performance & Specs, Your Invitation, Back Cover" },
    { type: "data", text: "Config: Obsidian Black exterior, Red Pepper Nappa interior, Night Package" },
    { type: "cmd", text: "mcp.canva.export_design({format: 'pdf', design_id: 'DAHDl2uZnXE'})" },
    { type: "wait", text: "Exporting 5-page VIP brochure as PDF..." },
    { type: "ok", text: "Brochure generated \u2014 Prestige_Motors_AMG_GT63S_Khalid_AlMansouri.pdf (2.8MB)" },
  ],
  gmail: [
    { type: "cmd", text: "mcp.gmail.create_draft({to: 'khalid.almansouri@prestige.ae'})" },
    { type: "wait", text: "Composing VIP test drive invitation..." },
    { type: "data", text: "Subject: Khalid, your private test drive of the AMG GT 63 S is confirmed" },
    { type: "data", text: "Attaching: Prestige_Motors_AMG_GT63S_Khalid_AlMansouri.pdf" },
    { type: "data", text: "Template: VIP Automotive \u2014 dark header, vehicle hero image, gold CTAs" },
    { type: "cmd", text: "mcp.gmail.send_draft({draft_id: 'r7478946889190758659'})" },
    { type: "ok", text: "Email draft created and ready to send" },
  ],
  calendar: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    const short = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Dubai" });
    return [
      { type: "cmd", text: "mcp.gcal.find_free_time({calendar: 'vip-test-drives'})" },
      { type: "wait", text: "Checking VIP test drive availability..." },
      { type: "data", text: "Found 3 available slots this week" },
      { type: "data", text: `Optimal slot: ${short}, 10:00 AM GST \u2014 Based on Khalid's timezone and vehicle prep time` },
      { type: "cmd", text: "mcp.gcal.create_event({type: 'vip_test_drive'})" },
      { type: "data", text: "Vehicle prep: AMG GT 63 S \u2014 Obsidian Black, detailed and fueled" },
      { type: "data", text: "Route: Marina Corniche \u2192 Jebel Ali \u2192 Downtown loop (45 min)" },
      { type: "ok", text: "Private test drive booked \u2014 calendar invite sent" },
    ];
  })(),
  docusign: [
    { type: "cmd", text: "mcp.docusign.create_envelope({template: 'vip_test_drive_waiver'})" },
    { type: "wait", text: "Preparing VIP Test Drive Agreement..." },
    { type: "data", text: "Template: VIP Test Drive Agreement \u2014 Prestige Motors" },
    { type: "data", text: "Pre-filled: Khalid Al-Mansouri | AMG GT 63 S | VIP-KM-001" },
    { type: "data", text: "Includes: Liability waiver, insurance confirmation, vehicle condition report" },
    { type: "cmd", text: "mcp.docusign.send_envelope({recipient: 'khalid.almansouri@prestige.ae'})" },
    { type: "ok", text: "Test drive agreement sent for e-signature" },
  ],
};



const STEP_CONFIG = [
  { key: "trigger", label: "!", title: "VIP Customer Taps NFC Card", subtitle: "NFC Detection & Profile Lookup", color: "trigger" },
  { key: "canva", label: "1", title: "Generate Personalized Vehicle Brochure", subtitle: "Canva MCP \u2014 AI Design Generation & PDF Export", color: "canva" },
  { key: "gmail", label: "2", title: "Send VIP Test Drive Invitation", subtitle: "Gmail MCP \u2014 Brochure Delivery", color: "gmail" },
  { key: "calendar", label: "3", title: "Book Private Test Drive", subtitle: "Google Calendar MCP \u2014 Smart Scheduling", color: "calendar" },
  { key: "docusign", label: "4", title: "Send Test Drive Agreement", subtitle: "DocuSign MCP \u2014 E-Signature", color: "docusign" },
];

const STEP_DESCS = {
  trigger: "Khalid Al-Mansouri, a high-net-worth automotive enthusiast, taps his VIP Access Key at the Prestige Motors showroom. The system instantly identifies his profile, vehicle preferences (AMG GT 63 S in Obsidian Black with Night Package), and engagement history.",
  canva: "AI designs a 5-page luxury vehicle brochure personalized for Khalid \u2014 featuring the AMG GT 63 S specs, his saved configuration (Obsidian Black + Red Pepper interior), performance data, and exclusive VIP pricing. Generated via Canva MCP with dark cinematic aesthetics and gold accents. This is a real Canva design you can view and edit.",
  gmail: "AI composes a personalized VIP test drive invitation email for Khalid with the Canva-generated brochure attached as PDF \u2014 complete with AMG GT 63 S details, his configuration, and private test drive confirmation \u2014 then creates it via the Gmail MCP API. The email is a real draft you can verify in Gmail.",
  calendar: "AI checks the VIP test drive calendar, considers vehicle prep time (detailing, fueling the AMG GT 63 S), Khalid's timezone, and the optimal driving route (Marina Corniche \u2192 Jebel Ali \u2192 Downtown, 45 min). A real Google Calendar event is created with all details.",
  docusign: "Before the test drive, AI sends a VIP Test Drive Agreement covering liability waiver, insurance confirmation, and vehicle condition report. The document is pre-filled with Khalid's details and the AMG GT 63 S information, ready for e-signature via DocuSign.",
};

export default function AutoAIDemo() {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [steps, setSteps] = useState(
    STEP_CONFIG.map((_, i) => ({ status: i === 0 ? "ready" : "locked", lines: [], showResult: false, expanded: false }))
  );
  const [allRunning, setAllRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
  const [googleUser, setGoogleUser] = useState(null);
  const [gisReady, setGisReady] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [liveResults, setLiveResults] = useState({ gmail: null, calendar: null });
  const [docusignLive, setDocusignLive] = useState(null);
  const termRefs = useRef([]);
  const stepRefs = useRef([]);
  const finalRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => { loadGIS().then(ok => setGisReady(ok)); }, []);

  const handleGoogleConnect = async () => {
    setConnecting(true);
    try {
      const token = await requestToken();
      const user = await getUserInfo(token);
      setGoogleToken(token);
      setGoogleUser(user);
    } catch (err) {
      console.error("Google connect failed:", err);
    } finally {
      setConnecting(false);
    }
  };

  const handleGoogleDisconnect = () => {
    revokeToken(googleToken);
    setGoogleToken(null);
    setGoogleUser(null);
    setLiveResults({ gmail: null, calendar: null });
  };

  const isLiveMode = !!googleToken;

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

    // Auto-scroll to the active step
    setTimeout(() => {
      const el = stepRefs.current[stepIdx];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // If this is the DocuSign step, call backend API in parallel with terminal animation
    const cfg = STEP_CONFIG[stepIdx];
    let docusignPromise = null;
    let gmailPromise = null;
    let calendarPromise = null;

    if (cfg.key === "docusign") {
      docusignPromise = fetch("/api/docusign/demo/create-nda", { method: "POST" })
        .then(r => r.json())
        .then(data => {
          if (data.configured && data.envelopeId) {
            setDocusignLive(data);
          }
        })
        .catch(() => {}); // fail silently, show demo data
    }

    if (cfg.key === "gmail" && googleToken) {
      const driveDate = new Date();
      driveDate.setDate(driveDate.getDate() + 5);
      const htmlBody = buildVipEmailHtml({
        buyerName: "Khalid Al-Mansouri",
        vehicleName: "AMG GT 63 S E Performance",
        vehiclePrice: "AED 950,000",
        testDriveDate: driveDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        testDriveTime: "10:00 AM GST",
        testDriveLocation: "Prestige Motors VIP Lounge, Dubai Marina",
      });
      gmailPromise = createGmailDraft(googleToken, {
        to: "khalid.almansouri@prestige.ae",
        subject: "Khalid, your private test drive of the AMG GT 63 S is confirmed",
        htmlBody,
        senderName: "Prestige Motors",
      })
        .then(result => setLiveResults(prev => ({ ...prev, gmail: result })))
        .catch(err => console.error("Live Gmail failed:", err));
    }

    if (cfg.key === "calendar" && googleToken) {
      const startDT = new Date();
      startDT.setDate(startDT.getDate() + 5);
      startDT.setHours(10, 0, 0, 0);
      const endDT = new Date(startDT);
      endDT.setHours(11, 30, 0, 0);
      calendarPromise = createCalendarEvent(googleToken, {
        summary: "Private Test Drive \u2014 AMG GT 63 S \u2014 Khalid Al-Mansouri (VIP)",
        location: "Prestige Motors VIP Lounge, Dubai Marina",
        description: "Exclusive private test drive of AMG GT 63 S E Performance for VIP customer Khalid Al-Mansouri. Vehicle: Obsidian Black, Red Pepper Nappa interior, Night Package. Route: Marina Corniche \u2192 Jebel Ali \u2192 Downtown (45 min).",
        startDateTime: startDT.toISOString(),
        endDateTime: endDT.toISOString(),
        attendeeEmail: null,
      })
        .then(result => setLiveResults(prev => ({ ...prev, calendar: result })))
        .catch(err => console.error("Live Calendar failed:", err));
    }

    await typeLines(stepIdx);
    if (docusignPromise) await docusignPromise;
    if (gmailPromise) await gmailPromise;
    if (calendarPromise) await calendarPromise;
    await new Promise(r => setTimeout(r, 400));

    setSteps(prev => {
      const next = [...prev];
      next[stepIdx] = { ...next[stepIdx], status: "done", showResult: true };
      if (stepIdx + 1 < next.length) {
        next[stepIdx + 1] = { ...next[stepIdx + 1], status: "ready" };
      }
      return next;
    });

    // Scroll down to show the result card
    setTimeout(() => {
      const el = stepRefs.current[stepIdx];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, [typeLines, googleToken]);

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
    setTimeout(() => {
      if (finalRef.current) finalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  }, [runStep]);

  const handleRunSingle = useCallback(async (idx) => {
    if (!startTime.current) startTime.current = Date.now();
    await runStep(idx);
    if (idx === STEP_CONFIG.length - 1) {
      const ms = Date.now() - startTime.current;
      setElapsed(Math.round(ms / 1000));
      setAllDone(true);
      setTimeout(() => {
        if (finalRef.current) finalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
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

      {/* Cross-Nav */}
      <nav className="ai-crossnav">
        <a href="/automotive" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "← العودة إلى السيارات" : "← Back to Automotive"}</a>
        <a href="/automotive/demo/khalid" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "VIP أداء" : "VIP Performance"}</a>
        <a href="/automotive/demo/sultan" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "VIP عائلي" : "VIP Family"}</a>
        <a href="/automotive/demo/showroom" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "صالة العرض" : "Public Showroom"}</a>
        <a href="/automotive/dashboard" target="_blank" rel="noopener noreferrer">{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</a>
        <span className="active">{lang === "ar" ? "خط أنابيب الذكاء" : "AI Pipeline"}</span>
      </nav>

      {/* Header */}
      <header className="ai-hd">
        <div className="ai-hd-left">
          <Link to="/automotive/demo" className="ai-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Demo Hub
          </Link>
          <div className="ai-hd-badge"><span>Prestige Motors \u2014 AI Sales Automation</span></div>
        </div>
        <div className="ai-hd-right">
          <button className="ai-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "\u2600\uFE0F Light" : "\uD83C\uDF19 Dark"}
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
          <p>Watch AI coordinate Canva, Gmail, Google Calendar, and DocuSign to deliver a VIP test drive experience — from NFC tap to signed agreement.</p>
          <div className="ai-stats">
            <div className="ai-stat"><span className="ai-stat-v">4</span><span className="ai-stat-l">Live Platforms</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{elapsed ? elapsed + "s" : "<1min"}</span><span className="ai-stat-l">{elapsed ? "Actual Time" : "Full Pipeline"}</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{doneCount}/{STEP_CONFIG.length}</span><span className="ai-stat-l">Steps Complete</span></div>
          </div>
        </section>

        {/* Google Connect */}
        <div className="ai-google-box">
          <div className="ai-google-box-title">
            Connect Your Google Account
            {isLiveMode && <span className="ai-google-live-badge">Live Mode</span>}
          </div>
          <p className="ai-google-box-desc">
            {isLiveMode
              ? "Gmail drafts and Calendar events will be created in YOUR account."
              : "Connect to create real Gmail drafts and Calendar events in your own account. Otherwise, demo data is shown."}
          </p>
          {!isLiveMode ? (
            <button className="ai-google-connect-btn" onClick={handleGoogleConnect} disabled={!gisReady || connecting}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/></svg>
              {connecting ? "Connecting..." : "Connect with Google"}
            </button>
          ) : (
            <div className="ai-google-user">
              {googleUser?.picture ? (
                <img className="ai-google-avatar" src={googleUser.picture} alt="" referrerPolicy="no-referrer" />
              ) : (
                <div className="ai-google-avatar-fallback">{(googleUser?.name || googleUser?.email || "U").charAt(0).toUpperCase()}</div>
              )}
              <div className="ai-google-info">
                {googleUser?.name && <div className="ai-google-name">{googleUser.name}</div>}
                <div className="ai-google-email">{googleUser?.email}</div>
              </div>
              <button className="ai-google-disconnect" onClick={handleGoogleDisconnect}>Disconnect</button>
            </div>
          )}
          <p className="ai-google-privacy">OAuth2 popup — your password never touches our servers. Token expires when you close this page.</p>
        </div>

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
            <div ref={el => stepRefs.current[idx] = el} className={`ai-step ${isLocked ? "locked" : ""} ${isRunning ? "active" : ""} ${isDone ? "done" : ""}`}>
              {/* Header */}
              <div className="ai-step-hd" onClick={() => toggleExpand(idx)}>
                <div className="ai-step-hd-left">
                  <div className={`ai-step-num ${isDone ? "done" : cfg.color}`}>
                    {isDone ? "\u2713" : cfg.label}
                  </div>
                  <div className="ai-step-info">
                    <h3>{cfg.title}{isDone && (cfg.key === "canva" || cfg.key === "gmail" || cfg.key === "calendar" || (cfg.key === "docusign" && docusignLive?.configured)) && <span className="ai-live-tag">{((cfg.key === "gmail" && liveResults.gmail) || (cfg.key === "calendar" && liveResults.calendar)) ? "Your Account" : "Live"}</span>}</h3>
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
                          <div className="ai-profile-avatar">KM</div>
                          <div className="ai-profile-info">
                            <h4>Khalid Al-Mansouri <span className="ai-live-tag">Detected</span></h4>
                            <p>Platinum VIP &bull; Interest: AMG GT 63 S E Performance &bull; Budget: AED 800K–1.2M<br/>Last config: Obsidian Black + Night Package &bull; 2 days ago &bull; VIP ID: KM-001</p>
                          </div>
                          <div className="ai-profile-score">
                            <div className="ai-profile-score-num">92</div>
                            <div className="ai-profile-score-label">Lead Score</div>
                          </div>
                        </div>
                      )}

                      {cfg.key === "canva" && (
                        <div className="ai-canva-card">
                          <div className="ai-canva-top">
                            <h4>{REAL_RESULTS.canva.title}</h4>
                            <div className="ai-canva-badge"><span>{"\u2713"}</span> {REAL_RESULTS.canva.pages} Pages Generated</div>
                          </div>
                          <div className="ai-canva-preview">
                            <img className="ai-canva-thumb" src={REAL_RESULTS.canva.thumbnailUrl} alt="Brochure cover" onError={e => { e.target.style.display = "none"; }} />
                            <div className="ai-canva-details">
                              <div className="ai-canva-pages">
                                {REAL_RESULTS.canva.sections.map((s, i) => (
                                  <span className="ai-canva-page" key={i}>{i + 1}. {s}</span>
                                ))}
                              </div>
                              <div className="ai-canva-meta">
                                Personalized VIP vehicle brochure featuring AMG GT 63 S E Performance — Obsidian Black exterior, Red Pepper Nappa interior, Night Package. Dark cinematic design with carbon fiber textures and gold accents. Exclusive VIP pricing (AED 950,000).
                              </div>
                            </div>
                          </div>
                          <div className="ai-canva-links">
                            <a href={REAL_RESULTS.canva.viewUrl} target="_blank" rel="noreferrer" className="ai-canva-link primary">
                              {"\uD83C\uDFA8"} View in Canva {"\u2197"}
                            </a>
                            <a href={REAL_RESULTS.canva.editUrl} target="_blank" rel="noreferrer" className="ai-canva-link secondary">
                              Edit Design {"\u2197"}
                            </a>
                          </div>
                          <div className="ai-canva-export">
                            <span>{"\u2713"}</span> Real Canva design generated via MCP — exported as PDF and attached to email in next step
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
                            {liveResults.gmail ? (
                              <a href={`https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>
                                {"\u2713"} Open YOUR draft in Gmail {"\u2197"}
                              </a>
                            ) : (
                              <a href={REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>
                                {"\u2713"} View real draft in Gmail {"\u2197"}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {cfg.key === "calendar" && (
                        <>
                          <div className="ai-cal-card">
                            <div className="ai-cal-date-box">
                              <span className="ai-cal-day">{(() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.getDate(); })()}</span>
                              <span className="ai-cal-month">{(() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toLocaleDateString("en-US", { month: "short" }); })()}</span>
                            </div>
                            <div className="ai-cal-details">
                              <h4>{REAL_RESULTS.calendar.title}</h4>
                              <p>{REAL_RESULTS.calendar.time}<br/>{REAL_RESULTS.calendar.location}</p>
                              {liveResults.calendar ? (
                                <a href={liveResults.calendar.htmlLink} target="_blank" rel="noreferrer" className="ai-cal-link">
                                  Open YOUR event in Calendar &#8599;
                                </a>
                              ) : (
                                <a href={REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="ai-cal-link">
                                  Open in Google Calendar &#8599;
                                </a>
                              )}
                            </div>
                          </div>
                          <div style={{marginTop:".75rem",padding:".6rem 1rem",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"10px",fontSize:".82rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".5rem"}}>
                            <span>{"\u2713"}</span> Real calendar event created via MCP — click link above to verify
                          </div>
                        </>
                      )}

                      {cfg.key === "docusign" && (() => {
                        const isLive = docusignLive && docusignLive.configured;
                        const envId = isLive ? docusignLive.envelopeId : REAL_RESULTS.docusign.envelopeId || "pending";
                        const envStatus = isLive ? docusignLive.status : REAL_RESULTS.docusign.status;
                        return (
                        <div className="ai-doc-card">
                          <div className="ai-doc-top">
                            <h4>{REAL_RESULTS.docusign.template}</h4>
                            <div className="ai-doc-signed">
                              <span>&#10003;</span> {envStatus === "created" ? "Draft Created" : envStatus === "sent" ? "Sent" : envStatus}
                              {isLive && <span className="ai-live-tag">Live</span>}
                            </div>
                          </div>
                          <div className="ai-doc-fields">
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Recipient</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.recipient}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Email</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.email}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Envelope ID</div><div className="ai-doc-field-val" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem"}}>{envId}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">Status</div><div className="ai-doc-field-val">{isLive ? "Real DocuSign envelope via REST API" : "Demo mode — configure DocuSign credentials"}</div></div>
                          </div>
                          {isLive && (
                            <div style={{display:"flex",gap:".5rem",marginTop:"1rem"}}>
                              <a href={`https://app.docusign.com/documents/details/${envId}`} target="_blank" rel="noreferrer" className="ai-canva-link primary" style={{background:"rgba(245,158,11,0.12)",borderColor:"rgba(245,158,11,0.25)",color:"var(--ai-amber)"}}>
                                View in DocuSign &#8599;
                              </a>
                              <a href={`/api/docusign/envelope/${envId}`} target="_blank" rel="noreferrer" className="ai-canva-link secondary">
                                API Response &#8599;
                              </a>
                            </div>
                          )}
                          <div className="ai-doc-unlock">
                            <span style={{fontSize:"1.1rem"}}>&#128275;</span>
                            Workflow triggered: Test drive confirmed and VIP experience prepared for Khalid
                          </div>
                        </div>
                        );
                      })()}
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
          <div ref={finalRef} className="ai-final">
            <div className="ai-final-icon">{"\u2713"}</div>
            <h2>Pipeline Complete</h2>
            <p>What traditionally takes a sales team 2–3 days of manual coordination was completed autonomously by AI. Khalid received a personalized VIP test drive experience — from brochure to signed agreement.</p>
            <div className="ai-final-items">
              {["VIP brochure designed in Canva","Test drive invitation delivered","Private test drive booked","Test drive agreement signed","Full pipeline — zero manual work"].map((item, i) => (
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
                  <h3>Prestige Motors</h3>
                  <p>VIP Private Test Drive Invitation</p>
                </div>
                <div className="ai-em-content">
                  <div className="ai-em-meta">
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">From</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.from}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">To</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.to}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">Subject</span><span className="ai-em-meta-val" style={{fontWeight:500}}>{REAL_RESULTS.gmail.subject}</span></div>
                  </div>
                  <p className="ai-em-text">Dear Khalid,</p>
                  <p className="ai-em-text">As a valued VIP Access Key holder at Prestige Motors, we are pleased to confirm your <strong>exclusive private test drive</strong>.</p>
                  <div className="ai-em-unit-card">
                    <h5>AMG GT 63 S E Performance — AED 950,000</h5>
                    <p>Your configuration: Obsidian Black exterior &bull; Red Pepper Nappa interior &bull; Night Package &bull; AMG Performance exhaust &bull; 843 HP hybrid powertrain</p>
                  </div>
                  <div className="ai-em-showing">
                    <div className="ai-em-showing-label">Your Private Test Drive</div>
                    <div className="ai-em-showing-val">{REAL_RESULTS.calendar.date} at 10:00 AM GST</div>
                    <div className="ai-em-showing-loc">{REAL_RESULTS.calendar.location}</div>
                    <div style={{color:"var(--ai-text4)",fontSize:".78rem",marginTop:".3rem"}}>Route: Marina Corniche → Jebel Ali → Downtown (45 min)</div>
                  </div>
                  <p className="ai-em-text">Your vehicle will be detailed, fueled, and prepared exclusively for you. A personal advisor will meet you at the VIP entrance.</p>
                  <div className="ai-em-attach">
                    <span style={{fontSize:"1.1rem"}}>{"\uD83D\uDCCE"}</span>
                    {REAL_RESULTS.gmail.attachment} (2.8 MB)
                  </div>
                  <p className="ai-em-text" style={{marginTop:"1rem",fontSize:".82rem"}}>Warm regards,<br/><strong>Prestige Motors VIP Team</strong><br/><span style={{color:"var(--ai-text4)"}}>Powered by Dynamic NFC</span></p>
                  <a href={liveResults.gmail ? `https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}` : REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",marginTop:"1.25rem",padding:".7rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:"10px",color:"var(--ai-emerald)",fontSize:".85rem",fontWeight:500,textDecoration:"none"}}>
                    {"\u2713"} {liveResults.gmail ? "Open YOUR draft in Gmail" : "This is a real draft — Open in Gmail"} {"\u2197"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="ai-ft">
        <p>AI Sales Automation Demo for <a href="https://dynamicnfc.ca" target="_blank" rel="noreferrer">Dynamic NFC</a> — Automotive MCP integration showcase.</p>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import './AIDemo.css';
import { loadGIS, requestToken, getUserInfo, createGmailDraft, createCalendarEvent, revokeToken, buildVipEmailHtml } from "./googleLiveApi";
import canvaProposalCover from "../../assets/images/canva-proposal-cover.png";
import SEO from '../../components/SEO/SEO';

/* ═══ TRANSLATIONS ═══ */
const TR = {
  en: {
    home: 'Home', back: 'Back to CRM',
    badge: 'Live MCP Demo',
    light: 'Light', dark: 'Dark',
    heroTag: 'Live MCP Demo — Real API Results',
    heroH1a: 'One tap.', heroH1b: 'Five actions. Zero manual work.',
    heroDesc: 'Khalid taps his NFC card. In under a minute: a proposal is designed, an email is sent, a showing is booked, and an NDA is signed. Every result below is real — click any link to verify.',
    statPlatforms: 'Live Platforms', statTime: 'Full Pipeline', statActual: 'Actual Time', statSteps: 'Steps Complete',
    googleTitle: 'Connect Your Google Account',
    googleLive: 'Live Mode',
    googleDescLive: 'Gmail drafts and Calendar events will be created in YOUR account.',
    googleDescDemo: 'Connect to create real Gmail drafts and Calendar events in your own account. Otherwise, demo data is shown.',
    googleConnect: 'Connect with Google', googleConnecting: 'Connecting...',
    googleDisconnect: 'Disconnect',
    googleError: 'Connection failed. You can continue with demo data.',
    googlePrivacy: 'OAuth2 popup — your password never touches our servers. Token expires when you close this page.',
    pipeTitle: 'The Pipeline',
    pipeRunAll: 'Run Full Pipeline', pipeDone: 'Pipeline Complete', pipeRunning: 'Running...',
    run: 'Run',
    statusDone: 'Complete', statusRunning: 'Executing...', statusReady: 'Ready', statusLocked: 'Locked',
    triggerDesc: 'Khalid walks into the sales center and taps his card. We instantly know who he is, what he looked at before, and that he\'s been eyeing the Sky Penthouse for three days.',
    canvaDesc: 'A 7-page proposal gets built on the spot — his name, his unit, ROI numbers, floor plans. Gulf-luxury design, bilingual layout. This is a real Canva file — click through and check.',
    gmailDesc: 'The proposal gets attached to a personal invite email and lands in Khalid\'s inbox. This is a real Gmail draft — open it yourself.',
    calendarDesc: 'The system checks who\'s free, picks the best time, and books a private showing. A real Google Calendar event you can verify.',
    docusignDesc: 'Before Khalid walks in, we send him an NDA. He signs, exclusive pricing unlocks in his portal. Pre-filled, ready to go.',
    detected: 'Detected', leadScore: 'Lead Score',
    pagesGen: 'Pages Generated',
    canvaMeta: 'Personalized Gulf Region luxury proposal with Unit PH-4201 details, ROI analysis, exclusive VIP pricing (AED 8,500,000), and premium amenities. Bilingual EN/AR with Arabic-inspired design.',
    viewCanva: 'View in Canva', editDesign: 'Edit Design',
    canvaExport: 'Real Canva design generated via MCP — exported as PDF and attached to email in next step',
    clickPreview: 'Click to preview full email',
    openYourDraft: 'Open YOUR draft in Gmail', viewRealDraft: 'View real draft in Gmail',
    openYourEvent: 'Open YOUR event in Calendar', openCalendar: 'Open in Google Calendar',
    calVerify: 'Real calendar event created via MCP — click link above to verify',
    docDraft: 'Draft Created', docSent: 'Sent',
    docRecipient: 'Recipient', docEmail: 'Email', docEnvelope: 'Envelope ID', docStatus: 'Status',
    docStatusLive: 'Real DocuSign envelope via REST API', docStatusDemo: 'Demo mode — configure DocuSign credentials',
    viewDocusign: 'View in DocuSign', apiResponse: 'API Response',
    docUnlock: 'Workflow triggered: Exclusive pre-launch pricing unlocked in Khalid\'s VIP portal',
    finalH2: 'Done.', finalTotal: 's total.',
    finalDesc: 'Khalid has a proposal in his inbox, a showing on his calendar, and an NDA waiting for his signature. Your sales team can focus on closing — not chasing.',
    finalItem1: 'Proposal built and exported', finalItem2: 'Email drafted and sent', finalItem3: 'Showing booked', finalItem4: 'NDA sent, pricing unlocked',
    emailModalTitle: 'Vista Residences', emailModalSub: 'VIP Private Showing Invitation',
    emailDear: 'Dear Khalid,',
    emailBody1: 'Thank you for your continued interest in Vista Residences. As a VIP buyer, we are pleased to invite you to an',
    emailBody1b: 'exclusive private showing',
    emailBody1c: 'of the Sky Penthouse.',
    emailBrochure: 'Your personalized property brochure with ROI analysis is attached. Please complete the enclosed NDA to unlock exclusive pre-launch pricing before your showing.',
    emailRegards: 'Warm regards,', emailTeam: 'Vista Residences Sales Team', emailPowered: 'Powered by Dynamic NFC',
    emailRealDraft: 'This is a real draft — Open in Gmail',
    footer: 'AI Sales Automation Demo for', footerLink: 'Dynamic NFC',
    footNote: 'Headquartered in Vancouver, Canada. NFC-powered sales intelligence for real estate, automotive, and enterprise.',
    footIndustries: 'Industries', footDevAgents: 'Developers & Agents', footAuto: 'Automotive', footNfc: 'NFC Cards',
    footResources: 'Resources', footLiveDemo: 'Live Demo', footContact: 'Contact Sales', footLogin: 'Log in',
    footCopy: '© 2026 DynamicNFC Card Inc. All Rights Reserved.',
  },
  ar: {
    home: 'الرئيسية', back: 'العودة إلى CRM',
    badge: 'عرض MCP مباشر',
    light: 'فاتح', dark: 'داكن',
    heroTag: 'عرض MCP مباشر — نتائج API حقيقية',
    heroH1a: 'نقرة واحدة.', heroH1b: 'خمسة إجراءات. بلا أي عمل يدوي.',
    heroDesc: 'خالد ينقر بطاقة NFC. خلال أقل من دقيقة: يتم تصميم عرض، إرسال بريد إلكتروني، حجز معاينة، وتوقيع اتفاقية سرية. كل نتيجة أدناه حقيقية — انقر على أي رابط للتحقق.',
    statPlatforms: 'منصات مباشرة', statTime: 'كامل المسار', statActual: 'الوقت الفعلي', statSteps: 'الخطوات المكتملة',
    googleTitle: 'اربط حسابك في Google',
    googleLive: 'الوضع المباشر',
    googleDescLive: 'سيتم إنشاء مسودات Gmail وأحداث التقويم في حسابك أنت.',
    googleDescDemo: 'اربط حسابك لإنشاء مسودات Gmail وأحداث تقويم حقيقية. وإلا ستُعرض بيانات تجريبية.',
    googleConnect: 'الربط مع Google', googleConnecting: 'جارٍ الاتصال...',
    googleDisconnect: 'قطع الاتصال',
    googleError: 'فشل الاتصال. يمكنك المتابعة بالبيانات التجريبية.',
    googlePrivacy: 'نافذة OAuth2 — كلمة مرورك لا تمر عبر خوادمنا. تنتهي صلاحية الرمز عند إغلاق الصفحة.',
    pipeTitle: 'المسار',
    pipeRunAll: 'تشغيل المسار الكامل', pipeDone: 'اكتمل المسار', pipeRunning: 'جارٍ التشغيل...',
    run: 'تشغيل',
    statusDone: 'مكتمل', statusRunning: 'قيد التنفيذ...', statusReady: 'جاهز', statusLocked: 'مقفل',
    triggerDesc: 'خالد يدخل مركز المبيعات وينقر بطاقته. نعرف فورًا من هو، ما شاهده سابقًا، وأنه يتابع Sky Penthouse منذ ثلاثة أيام.',
    canvaDesc: 'عرض من 7 صفحات يُصمم فورًا — اسمه، وحدته، أرقام العائد، المخططات. تصميم خليجي فاخر، ثنائي اللغة. هذا ملف Canva حقيقي — انقر وتحقق.',
    gmailDesc: 'العرض يُرفق ببريد دعوة شخصي ويصل إلى بريد خالد. هذه مسودة Gmail حقيقية — افتحها بنفسك.',
    calendarDesc: 'النظام يتحقق من الأوقات المتاحة، يختار الأنسب، ويحجز معاينة خاصة. حدث Google Calendar حقيقي يمكنك التحقق منه.',
    docusignDesc: 'قبل وصول خالد، نرسل له اتفاقية سرية. يوقّع، والأسعار الحصرية تُفتح في بوابته. معبأ مسبقًا، جاهز.',
    detected: 'تم الكشف', leadScore: 'تقييم العميل',
    pagesGen: 'صفحات تم إنشاؤها',
    canvaMeta: 'عرض استثماري مخصص لمنطقة الخليج مع تفاصيل الوحدة PH-4201، تحليل العائد، تسعير VIP حصري (8,500,000 درهم)، ومرافق فاخرة. ثنائي اللغة EN/AR بتصميم عربي.',
    viewCanva: 'عرض في Canva', editDesign: 'تعديل التصميم',
    canvaExport: 'تصميم Canva حقيقي عبر MCP — تم تصديره كـ PDF وإرفاقه بالبريد في الخطوة التالية',
    clickPreview: 'انقر لمعاينة البريد الكامل',
    openYourDraft: 'افتح مسودتك في Gmail', viewRealDraft: 'عرض المسودة الحقيقية في Gmail',
    openYourEvent: 'افتح حدثك في التقويم', openCalendar: 'فتح في Google Calendar',
    calVerify: 'حدث تقويم حقيقي تم إنشاؤه عبر MCP — انقر الرابط أعلاه للتحقق',
    docDraft: 'تم إنشاء المسودة', docSent: 'تم الإرسال',
    docRecipient: 'المستلم', docEmail: 'البريد', docEnvelope: 'معرّف المغلف', docStatus: 'الحالة',
    docStatusLive: 'مغلف DocuSign حقيقي عبر REST API', docStatusDemo: 'وضع تجريبي — قم بإعداد بيانات DocuSign',
    viewDocusign: 'عرض في DocuSign', apiResponse: 'استجابة API',
    docUnlock: 'تم تفعيل سير العمل: تم فتح أسعار ما قبل الإطلاق الحصرية في بوابة خالد VIP',
    finalH2: 'تم.', finalTotal: ' ثانية إجمالي.',
    finalDesc: 'خالد لديه عرض في بريده، معاينة في تقويمه، واتفاقية سرية بانتظار توقيعه. فريق مبيعاتك يمكنه التركيز على الإغلاق — لا الملاحقة.',
    finalItem1: 'تم بناء العرض وتصديره', finalItem2: 'تم صياغة البريد وإرساله', finalItem3: 'تم حجز المعاينة', finalItem4: 'تم إرسال الاتفاقية، والتسعير مفتوح',
    emailModalTitle: 'Vista Residences', emailModalSub: 'دعوة معاينة خاصة لكبار الشخصيات',
    emailDear: 'عزيزي خالد،',
    emailBody1: 'شكرًا لاهتمامك المستمر بـ Vista Residences. بصفتك مشتري VIP، يسعدنا دعوتك إلى',
    emailBody1b: 'معاينة خاصة حصرية',
    emailBody1c: 'لـ Sky Penthouse.',
    emailBrochure: 'كتيب العقار المخصص مع تحليل العائد مرفق. يرجى إكمال اتفاقية السرية المرفقة لفتح أسعار ما قبل الإطلاق الحصرية قبل معاينتك.',
    emailRegards: 'مع أطيب التحيات،', emailTeam: 'فريق مبيعات Vista Residences', emailPowered: 'مدعوم من Dynamic NFC',
    emailRealDraft: 'هذه مسودة حقيقية — افتح في Gmail',
    footer: 'عرض أتمتة مبيعات AI لـ', footerLink: 'Dynamic NFC',
    footNote: 'المقر الرئيسي في فانكوفر، كندا. ذكاء مبيعات NFC للعقارات والسيارات والمؤسسات.',
    footIndustries: 'القطاعات', footDevAgents: 'المطورين والوكلاء', footAuto: 'السيارات', footNfc: 'بطاقات NFC',
    footResources: 'الموارد', footLiveDemo: 'عرض مباشر', footContact: 'تواصل مع المبيعات', footLogin: 'تسجيل الدخول',
    footCopy: '© ٢٠٢٦ DynamicNFC Card Inc. جميع الحقوق محفوظة.',
  },
};

/* ── Real results from MCP tool calls ── */
const REAL_RESULTS = {
  canva: {
    designId: "DAHDq0h2I3g",
    title: "Private Investment Memorandum — Khalid Al-Rashid",
    pages: 7,
    editUrl: "https://www.canva.com/d/jSENLEvDSFflEB2",
    viewUrl: "https://www.canva.com/d/rFvRuRe3S2mY5LO",
    thumbnailUrl: canvaProposalCover,
    exportFormat: "PDF",
    sections: ["Cover", "Personal Letter", "The Residence", "Investment Analysis", "The Lifestyle", "Your Invitation", "Back Cover"],
  },
  calendar: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const day = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Dubai" });
    return {
      title: "Private Showing — Sky Penthouse — Khalid Al-Rashid (VIP)",
      date: day,
      time: "2:00 PM – 3:00 PM GST",
      location: "Vista Residences Sales Center, Dubai Marina",
      link: "https://www.google.com/calendar/event?eid=b3VwazdtbmRldHZtamI5dnMyZHJ1bnZ0cHMgaW5mb0BkeW5hbWljbmZjLmhlbHA",
      slotsFound: 3,
    };
  })(),
  gmail: {
    to: "khalid.alrashid@vista.ae",
    subject: "Khalid, your private viewing of the Sky Penthouse is confirmed",
    from: "info@dynamicnfc.help",
    attachment: "Al_Noor_Residences_PH4201_Khalid_AlRashid.pdf",
    draftLink: "https://mail.google.com/mail/?authuser=info@dynamicnfc.help#drafts/19ce466e35411df8",
    draftId: "r7478946889190758659",
  },
  docusign: {
    template: "VIP Buyer NDA — Al Noor Residences",
    recipient: "Khalid Al-Rashid",
    email: "khalid.alrashid@vista.ae",
    envelopeId: null, // will be filled by live API call
    status: "created",
    signedIn: null,
    live: false,
  },
};

/* ── Terminal lines per step (simulated MCP calls) ── */
const TERMINAL_LINES = {
  trigger: [
    { type: "cmd", text: "nfc.detect() → VIP Access Key scanned" },
    { type: "wait", text: "Authenticating NFC card..." },
    { type: "data", text: "Profile: Khalid Al-Rashid | Tier: Platinum | VIP ID: KR-001" },
    { type: "data", text: "Interest: Unit PH-4201, Al Noor Residences | Range: AED 8M–15M" },
    { type: "data", text: "Last engagement: 3 days ago (viewed Penthouse Collection)" },
    { type: "ok", text: "VIP profile loaded — triggering AI sales pipeline" },
  ],
  canva: [
    { type: "cmd", text: "mcp.canva.generate_design({type: 'proposal', style: 'gulf_luxury'})" },
    { type: "wait", text: "AI generating personalized VIP investment proposal..." },
    { type: "data", text: "Template: Gulf Region — Arabic-inspired geometric patterns, gold & ivory palette" },
    { type: "data", text: "Personalizing for: Khalid Al-Rashid — Unit PH-4201, Al Noor Residences" },
    { type: "data", text: "Pages: Cover, Personal Letter, The Residence, Investment Analysis, The Lifestyle, Your Invitation, Back Cover" },
    { type: "data", text: "Locale: Bilingual EN/AR — right-to-left layout support enabled" },
    { type: "cmd", text: "mcp.canva.export_design({format: 'pdf', design_id: 'DAHDl2uZnXE'})" },
    { type: "wait", text: "Exporting 7-page proposal as PDF..." },
    { type: "ok", text: "Proposal generated — Al_Noor_Residences_PH4201_Khalid_AlRashid.pdf (3.1MB)" },
  ],
  gmail: [
    { type: "cmd", text: "mcp.gmail.create_draft({to: 'khalid.alrashid@vista.ae'})" },
    { type: "wait", text: "Composing personalized VIP invitation email..." },
    { type: "data", text: "Subject: 'Khalid, your private viewing of the Sky Penthouse is confirmed'" },
    { type: "data", text: "Attaching: Al_Noor_Residences_PH4201_Khalid_AlRashid.pdf (3.1MB)" },
    { type: "data", text: "Content: Personal invitation + Canva proposal attached" },
    { type: "ok", text: "Email sent successfully — draft ID: r7478946889190758659" },
  ],
  calendar: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const short = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Dubai" });
    return [
      { type: "cmd", text: "mcp.gcal.find_meeting_times({attendees: ['khalid.alrashid@vista.ae']})" },
      { type: "wait", text: "Checking availability for all parties..." },
      { type: "data", text: "3 available slots found next week" },
      { type: "data", text: `Optimal: ${short}, 2:00 PM GST (all available)` },
      { type: "cmd", text: "mcp.gcal.create_event({summary: 'Private Showing...'})" },
      { type: "ok", text: "Event created: 'Private Showing — Sky Penthouse'" },
      { type: "data", text: "Location: Vista Residences Sales Center, Dubai Marina" },
      { type: "ok", text: "Reminders set: 1 day before (email) + 1 hour before (popup)" },
    ];
  })(),
  docusign: [
    { type: "cmd", text: "POST /api/docusign/demo/create-nda" },
    { type: "wait", text: "Authenticating with DocuSign via JWT Grant..." },
    { type: "data", text: "Account: ozzy@dynamiccrm.ca (353d13ef-...)" },
    { type: "cmd", text: "Creating NDA envelope for Khalid Al-Rashid..." },
    { type: "wait", text: "Generating HTML document with pre-filled VIP terms..." },
    { type: "data", text: "Document: VIP Buyer NDA — Al Noor Residences (4 sections)" },
    { type: "wait", text: "Sending envelope via DocuSign eSignature API..." },
    { type: "ok", text: "Envelope created — awaiting signature" },
    { type: "ok", text: "Workflow triggered → Exclusive pricing unlocked in portal" },
  ],
};


const STEP_CONFIG = [
  { key: "trigger", label: "!", title: "Khalid taps his card", subtitle: "NFC scan — profile loaded instantly", color: "trigger" },
  { key: "canva", label: "1", title: "Build his proposal", subtitle: "Canva designs a 7-page PDF on the spot", color: "canva" },
  { key: "gmail", label: "2", title: "Send the invite", subtitle: "Gmail drafts and delivers the email", color: "gmail" },
  { key: "calendar", label: "3", title: "Book the showing", subtitle: "Google Calendar finds the best slot", color: "calendar" },
  { key: "docusign", label: "4", title: "Get the NDA signed", subtitle: "DocuSign sends it, pricing unlocks", color: "docusign" },
];

const STEP_DESCS = {
  trigger: "Khalid walks into the sales center and taps his card. We instantly know who he is, what he looked at before, and that he's been eyeing the Sky Penthouse for three days.",
  canva: "A 7-page proposal gets built on the spot — his name, his unit, ROI numbers, floor plans. Gulf-luxury design, bilingual layout. This is a real Canva file — click through and check.",
  gmail: "The proposal gets attached to a personal invite email and lands in Khalid's inbox. This is a real Gmail draft — open it yourself.",
  calendar: "The system checks who's free, picks the best time, and books a private showing. A real Google Calendar event you can verify.",
  docusign: "Before Khalid walks in, we send him an NDA. He signs, exclusive pricing unlocks in his portal. Pre-filled, ready to go.",
};

export default function AIDemo() {
  const [lang, setLang] = useState("en");
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);
  const [theme, setTheme] = useState("light");
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
  const [connectError, setConnectError] = useState(false);
  const [liveResults, setLiveResults] = useState({ gmail: null, calendar: null });
  const [docusignLive, setDocusignLive] = useState(null);
  const termRefs = useRef([]);
  const stepRefs = useRef([]);
  const finalRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => { loadGIS().then(ok => setGisReady(ok)); }, []);



  const handleGoogleConnect = async () => {
    setConnecting(true);
    setConnectError(false);
    try {
      const token = await requestToken();
      const user = await getUserInfo(token);
      setGoogleToken(token);
      setGoogleUser(user);
    } catch (err) {
      console.error("Google connect failed:", err);
      setConnectError(true);
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
        .catch(() => { setDocusignLive({ configured: false, fallback: true }); });
    }

    if (cfg.key === "gmail" && googleToken) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + 7);
      const htmlBody = buildVipEmailHtml({
        buyerName: "Khalid Al-Rashid",
        unitName: "Sky Penthouse PH-4201",
        unitPrice: "AED 12,500,000",
        showingDate: showDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        showingTime: "2:00 PM GST",
        showingLocation: "Vista Residences Sales Center, Dubai Marina",
      });
      gmailPromise = createGmailDraft(googleToken, {
        to: "khalid.alrashid@vista.ae",
        subject: "Khalid, your private viewing of the Sky Penthouse is confirmed",
        htmlBody,
        senderName: "Vista Residences",
      })
        .then(result => setLiveResults(prev => ({ ...prev, gmail: result })))
        .catch(err => console.error("Live Gmail failed:", err));
    }

    if (cfg.key === "calendar" && googleToken) {
      const startDT = new Date();
      startDT.setDate(startDT.getDate() + 7);
      startDT.setHours(14, 0, 0, 0);
      const endDT = new Date(startDT);
      endDT.setHours(15, 0, 0, 0);
      calendarPromise = createCalendarEvent(googleToken, {
        summary: "Private Showing — Sky Penthouse — Khalid Al-Rashid (VIP)",
        location: "Vista Residences Sales Center, Dubai Marina",
        description: "Exclusive private showing of Sky Penthouse PH-4201 for VIP buyer Khalid Al-Rashid. Investment proposal attached.",
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
      <SEO title="AI Sales Demo" description="Interactive AI-powered sales pipeline automation demo." path="/ai-demo" />
      <div className="ai-bg"><div className="ai-blob ai-blob-1" /><div className="ai-blob ai-blob-2" /><div className="ai-blob ai-blob-3" /></div>

      {/* Progress */}
      <div className="ai-progress"><div className="ai-progress-fill" style={{ width: progress + "%" }} /></div>

      {/* Header */}
      <header className="ai-hd">
        <Link to="/" className="ai-hd-logo"><img src="/assets/images/logo.png" alt="DynamicNFC" /></Link>
        <div className="ai-hd-badge"><span>{t('heroTag')}</span></div>
        <div className="ai-hd-right">
          <button className="ai-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            {theme === "dark" ? `\u2600\uFE0F ${t('light')}` : `\u{1F319} ${t('dark')}`}
          </button>
          <button className="ai-lang" onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}>
            {lang === "en" ? "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" : "English"}
          </button>
          <Link to="/" className="ai-home-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t('home')}
          </Link>
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
          <h1><span>{t('heroH1a')}</span><br />{t('heroH1b')}</h1>
          <p>{t('heroDesc')}</p>
          <div className="ai-stats">
            <div className="ai-stat"><span className="ai-stat-v">4</span><span className="ai-stat-l">{t('statPlatforms')}</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{elapsed ? elapsed + "s" : "<1min"}</span><span className="ai-stat-l">{elapsed ? t('statActual') : t('statTime')}</span></div>
            <div className="ai-stat"><span className="ai-stat-v">{doneCount}/{STEP_CONFIG.length}</span><span className="ai-stat-l">{t('statSteps')}</span></div>
          </div>
        </section>

        {/* Google Connect */}
        <div className="ai-google-box">
          <div className="ai-google-box-title">
            {t('googleTitle')}
            {isLiveMode && <span className="ai-google-live-badge">{t('googleLive')}</span>}
          </div>
          <p className="ai-google-box-desc">
            {isLiveMode ? t('googleDescLive') : t('googleDescDemo')}
          </p>
          {!isLiveMode ? (
            <>
              <button className="ai-google-connect-btn" onClick={handleGoogleConnect} disabled={!gisReady || connecting} aria-label={t('googleConnect')}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/></svg>
                {connecting ? t('googleConnecting') : t('googleConnect')}
              </button>
              {connectError && <p className="ai-google-error">{t('googleError')}</p>}
            </>
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
              <button className="ai-google-disconnect" onClick={handleGoogleDisconnect}>{t('googleDisconnect')}</button>
            </div>
          )}
          <p className="ai-google-privacy">{t('googlePrivacy')}</p>
        </div>

        {/* Pipeline */}
        <div className="ai-pipe-hd">
          <h2>{t('pipeTitle')}</h2>
          <button className="ai-run-all" onClick={runAll} disabled={allRunning || allDone} aria-label={allDone ? t('pipeDone') : t('pipeRunAll')}>
            {allDone ? t('pipeDone') : allRunning ? t('pipeRunning') : t('pipeRunAll')}
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
              <div className="ai-step-hd" onClick={() => toggleExpand(idx)} role="button" tabIndex={0} aria-expanded={st.expanded} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(idx); } }}>
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
                    {isDone ? t('statusDone') : isRunning ? t('statusRunning') : isReady ? t('statusReady') : t('statusLocked')}
                  </span>
                  {isReady && !allRunning && (
                    <button className="ai-run-btn" aria-label={`Run ${cfg.title}`} onClick={(e) => { e.stopPropagation(); handleRunSingle(idx); }}>
                      {t('run')} <span>&#9654;</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className={`ai-step-body ${st.expanded ? "open" : ""}`}>
                <div className="ai-step-body-inner">
                  <p className="ai-step-desc">{t(cfg.key + 'Desc')}</p>

                  {/* Terminal */}
                  {(isRunning || isDone) && (
                    <div className="ai-terminal">
                      <div className="ai-terminal-bar">
                        <div className="ai-terminal-dot" /><div className="ai-terminal-dot" /><div className="ai-terminal-dot" />
                        <span className="ai-terminal-title">mcp-{cfg.key}.sh</span>
                      </div>
                      <div className="ai-terminal-body" ref={el => termRefs.current[idx] = el} role="log" aria-live="polite">
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
                            <h4>Khalid Al-Rashid <span className="ai-live-tag">{t('detected')}</span></h4>
                            <p>Platinum Tier &bull; Interest: Sky Penthouse &bull; Range: AED 8M–15M<br/>Last viewed Sky Penthouse &bull; 3 days ago &bull; VIP ID: KR-001</p>
                          </div>
                          <div className="ai-profile-score">
                            <div className="ai-profile-score-num">87</div>
                            <div className="ai-profile-score-label">{t('leadScore')}</div>
                          </div>
                        </div>
                      )}

                      {cfg.key === "canva" && (
                        <div className="ai-canva-card">
                          <div className="ai-canva-top">
                            <h4>{REAL_RESULTS.canva.title}</h4>
                            <div className="ai-canva-badge"><span>{"\u2713"}</span> {REAL_RESULTS.canva.pages} {t('pagesGen')}</div>
                          </div>
                          <div className="ai-canva-preview">
                            <img className="ai-canva-thumb" src={REAL_RESULTS.canva.thumbnailUrl} alt="Proposal cover" onError={e => { e.target.style.display = "none"; }} />
                            <div className="ai-canva-details">
                              <div className="ai-canva-pages">
                                {REAL_RESULTS.canva.sections.map((s, i) => (
                                  <span className="ai-canva-page" key={i}>{i + 1}. {s}</span>
                                ))}
                              </div>
                              <div className="ai-canva-meta">
                                {t('canvaMeta')}
                              </div>
                            </div>
                          </div>
                          <div className="ai-canva-links">
                            <a href={REAL_RESULTS.canva.viewUrl} target="_blank" rel="noreferrer" className="ai-canva-link primary">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginInlineEnd:'0.3rem'}}><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2"/><circle cx="6" cy="12" r="3"/><circle cx="12" cy="19" r="2"/><path d="M12 19c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7"/></svg> {t('viewCanva')} {"\u2197"}
                            </a>
                            <a href={REAL_RESULTS.canva.editUrl} target="_blank" rel="noreferrer" className="ai-canva-link secondary">
                              {t('editDesign')} {"\u2197"}
                            </a>
                          </div>
                          <div className="ai-canva-export">
                            <span>{"\u2713"}</span> {t('canvaExport')}
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
                            <span style={{color:"var(--ai-text4)",fontSize:".78rem"}}>{t('clickPreview')}</span>
                            {liveResults.gmail ? (
                              <a href={`https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>
                                {"\u2713"} {t('openYourDraft')} {"\u2197"}
                              </a>
                            ) : (
                              <a href={REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{fontSize:".78rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".3rem",textDecoration:"none",position:"relative",zIndex:5}}>
                                {"\u2713"} {t('viewRealDraft')} {"\u2197"}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {cfg.key === "calendar" && (
                        <>
                          <div className="ai-cal-card">
                            <div className="ai-cal-date-box">
                              <span className="ai-cal-day">{(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.getDate(); })()}</span>
                              <span className="ai-cal-month">{(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toLocaleDateString("en-US", { month: "short" }); })()}</span>
                            </div>
                            <div className="ai-cal-details">
                              <h4>{REAL_RESULTS.calendar.title}</h4>
                              <p>{REAL_RESULTS.calendar.time}<br/>{REAL_RESULTS.calendar.location}</p>
                              {liveResults.calendar ? (
                                <a href={liveResults.calendar.htmlLink} target="_blank" rel="noreferrer" className="ai-cal-link">
                                  {t('openYourEvent')} &#8599;
                                </a>
                              ) : (
                                <a href={REAL_RESULTS.calendar.link} target="_blank" rel="noreferrer" className="ai-cal-link">
                                  {t('openCalendar')} &#8599;
                                </a>
                              )}
                            </div>
                          </div>
                          <div style={{marginTop:".75rem",padding:".6rem 1rem",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:"10px",fontSize:".82rem",color:"var(--ai-emerald)",display:"flex",alignItems:"center",gap:".5rem"}}>
                            <span>{"\u2713"}</span> {t('calVerify')}
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
                              <span>&#10003;</span> {envStatus === "created" ? t('docDraft') : envStatus === "sent" ? t('docSent') : envStatus}
                              {isLive && <span className="ai-live-tag">Live</span>}
                            </div>
                          </div>
                          <div className="ai-doc-fields">
                            <div className="ai-doc-field"><div className="ai-doc-field-label">{t('docRecipient')}</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.recipient}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">{t('docEmail')}</div><div className="ai-doc-field-val">{REAL_RESULTS.docusign.email}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">{t('docEnvelope')}</div><div className="ai-doc-field-val" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".78rem"}}>{envId}</div></div>
                            <div className="ai-doc-field"><div className="ai-doc-field-label">{t('docStatus')}</div><div className="ai-doc-field-val">{isLive ? t('docStatusLive') : t('docStatusDemo')}</div></div>
                          </div>
                          {isLive && (
                            <div style={{display:"flex",gap:".5rem",marginTop:"1rem"}}>
                              <a href={`https://app.docusign.com/documents/details/${envId}`} target="_blank" rel="noreferrer" className="ai-canva-link primary" style={{background:"rgba(245,158,11,0.12)",borderColor:"rgba(245,158,11,0.25)",color:"var(--ai-amber)"}}>
                                {t('viewDocusign')} &#8599;
                              </a>
                              <a href={`/api/docusign/envelope/${envId}`} target="_blank" rel="noreferrer" className="ai-canva-link secondary">
                                {t('apiResponse')} &#8599;
                              </a>
                            </div>
                          )}
                          <div className="ai-doc-unlock">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                            {t('docUnlock')}
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
            <h2>{t('finalH2')} {elapsed}{t('finalTotal')}</h2>
            <p>{t('finalDesc')}</p>
            <div className="ai-final-items">
              {[t('finalItem1'), t('finalItem2'), t('finalItem3'), t('finalItem4')].map((item, i) => (
                <div className="ai-final-item" key={i}><span className="ai-final-check">&#10003;</span>{item}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── Email Modal ── */}
        {emailModal && (
          <div className="ai-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ai-email-modal-title" onClick={() => setEmailModal(false)} onKeyDown={(e) => { if (e.key === 'Escape') setEmailModal(false); }}>
            <div className="ai-modal" onClick={e => e.stopPropagation()}>
              <button className="ai-modal-close" onClick={() => setEmailModal(false)} aria-label="Close">{"\u2715"}</button>
              <div className="ai-em-body">
                <div className="ai-em-gold-hd">
                  <h3 id="ai-email-modal-title">{t('emailModalTitle')}</h3>
                  <p>{t('emailModalSub')}</p>
                </div>
                <div className="ai-em-content">
                  <div className="ai-em-meta">
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">From</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.from}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">To</span><span className="ai-em-meta-val">{REAL_RESULTS.gmail.to}</span></div>
                    <div className="ai-em-meta-row"><span className="ai-em-meta-label">Subject</span><span className="ai-em-meta-val" style={{fontWeight:500}}>{REAL_RESULTS.gmail.subject}</span></div>
                  </div>
                  <p className="ai-em-text">{t('emailDear')}</p>
                  <p className="ai-em-text">{t('emailBody1')} <strong>{t('emailBody1b')}</strong> {t('emailBody1c')}</p>
                  <div className="ai-em-unit-card">
                    <h5>Sky Penthouse — AED 12,500,000</h5>
                    <p>5 Bedrooms &bull; Full Floor &bull; 45th Floor &bull; Panoramic Gulf Views &bull; Private Infinity Pool &bull; Smart Home Ready</p>
                  </div>
                  <div className="ai-em-showing">
                    <div className="ai-em-showing-label">Your Private Showing</div>
                    <div className="ai-em-showing-val">Thursday, March 12, 2026 at 2:00 PM GST</div>
                    <div className="ai-em-showing-loc">Vista Residences Sales Center, Dubai Marina</div>
                  </div>
                  <p className="ai-em-text">{t('emailBrochure')}</p>
                  <div className="ai-em-attach">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{flexShrink:0}}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    {REAL_RESULTS.gmail.attachment} (2.4 MB)
                  </div>
                  <p className="ai-em-text" style={{marginTop:"1rem",fontSize:".82rem"}}>{t('emailRegards')}<br/><strong>{t('emailTeam')}</strong><br/><span style={{color:"var(--ai-text4)"}}>{t('emailPowered')}</span></p>
                  <a href={liveResults.gmail ? `https://mail.google.com/mail/#drafts/${liveResults.gmail.messageId}` : REAL_RESULTS.gmail.draftLink} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem",marginTop:"1.25rem",padding:".7rem",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:"10px",color:"var(--ai-emerald)",fontSize:".85rem",fontWeight:500,textDecoration:"none"}}>
                    {"\u2713"} {liveResults.gmail ? t('openYourDraft') : t('emailRealDraft')} {"\u2197"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="ai-ft">
        <div className="ai-ft-inner">
          <div className="ai-ft-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="ai-ft-logo" /></Link>
            <p className="ai-ft-note">{t('footNote')}</p>
          </div>
          <div className="ai-ft-cols">
            <div className="ai-ft-col">
              <h5>{t('footIndustries')}</h5>
              <Link to="/developers">{t('footDevAgents')}</Link>
              <Link to="/automotive">{t('footAuto')}</Link>
              <Link to="/nfc-cards">{t('footNfc')}</Link>
            </div>
            <div className="ai-ft-col">
              <h5>{t('footResources')}</h5>
              <Link to="/enterprise/crmdemo">{t('footLiveDemo')}</Link>
              <Link to="/contact-sales">{t('footContact')}</Link>
              <Link to="/login">{t('footLogin')}</Link>
            </div>
          </div>
        </div>
        <div className="ai-ft-bottom"><p>{t('footCopy')}</p></div>
      </footer>
    </div>
  );
}

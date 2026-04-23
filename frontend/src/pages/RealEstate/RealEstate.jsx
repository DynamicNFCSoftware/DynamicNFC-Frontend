import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { common } from '../../i18n/common';
import '../Developers/Developers.css';
import './RealEstate.css';
import '../../i18n/pages/realEstate';
import SEO from '../../components/SEO/SEO';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Real Estate Professionals — Sales Velocity Engine
   ═══════════════════════════════════════════ */
function ReSvg({ children, size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

const RE_CHALLENGE_ICONS = [
  <ReSvg key="c1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></ReSvg>,
  <ReSvg key="c2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></ReSvg>,
  <ReSvg key="c3"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></ReSvg>,
];

const RE_HOW_ICONS = [
  <ReSvg key="h1"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></ReSvg>,
  <ReSvg key="h2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></ReSvg>,
  <ReSvg key="h3"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></ReSvg>,
  <ReSvg key="h4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></ReSvg>,
];

const RE_PART_ICONS = [
  <ReSvg key="pa1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></ReSvg>,
  <ReSvg key="pa2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></ReSvg>,
  <ReSvg key="pa3"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="7.5 4.21 12 6.81 16.5 4.21" /><polyline points="7.5 19.79 12 17.19 16.5 19.79" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></ReSvg>,
  <ReSvg key="pa4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></ReSvg>,
];

const RE_UC_ICONS = [
  <ReSvg key="uc1"><path d="M3 21h18" /><path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" /><path d="M9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01" /></ReSvg>,
  <ReSvg key="uc2"><path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></ReSvg>,
  <ReSvg key="uc3"><path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.65-7 11-7 11z" /><path d="M9.5 10.5l5 5" /><path d="M14.5 10.5l-5 5" /></ReSvg>,
  <ReSvg key="uc4"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></ReSvg>,
];

const RE_SECTION_NAV = [
  { id: 'challenge', labelKey: 'navChallenge' },
  { id: 'shift', labelKey: 'navShift' },
  { id: 'how', labelKey: 'navHow' },
  { id: 'diff', labelKey: 'navDiff' },
  { id: 'demo', labelKey: 'navDemo' },
  { id: 'usecases', labelKey: 'navUseCases' },
  { id: 'partnership', labelKey: 'navPartnership' },
  { id: 'roi', labelKey: 'navRoi' },
  { id: 'faq', labelKey: 'navFaq' },
  { id: 'cta', labelKey: 'navPilot' },
];

const TR = {
  en: {
    seoTitle: 'Real Estate — VIP Buyer Experiences',
    seoDesc: 'Named buyer intent, private portals, and real-time sales signals for brokerages and project sales teams. Book more viewings with DynamicNFC.',

    /* Nav */
    navChallenge: 'The Challenge',
    navShift: 'The Shift',
    navHow: 'How It Works',
    navDiff: 'VIP vs Public',
    navDemo: 'Live Demo',
    navUseCases: 'Use Cases',
    navPartnership: 'Partnership',
    navRoi: 'Why It Matters',
    navFaq: 'FAQ',
    navPilot: 'Start a Pilot',

    closeLabel: 'Close dialog',

    /* Hero */
    heroBadge:'VIP Digital Experience for Real Estate',
    heroTitle:'Turn Buyer Intent Into Booked Viewings.',
    heroSub:'DynamicNFC gives real estate sales teams a new weapon: VIP Access Keys that deliver private, personalized buyer experiences — and tell you exactly who is ready to act, what they care about, and when to call.',
    stat1Val:'Named', stat1Label:'Visitors', stat2Val:'Intent', stat2Label:'Scoring', stat3Val:'Real-Time', stat3Label:'Alerts',
    heroCtaPilot:'Start a Pilot →', heroCtaDemo:'See the Live Demo',

    /* Challenge (Pitch Deck p.2) */
    challLabel:'The Blind Spot', challTitle:'Your Sales Team Has Leads. They Don\'t Have Context.',
    challQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when your sales team picks up the phone, they often lack one critical thing: ', challQuoteHighlight:'context', challQuote2:'. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Icon:'👥', chall1Title:'Anonymous Traffic', chall1Desc:'Hundreds of visitors browse your project website. You see page views — but you don\'t know who they are or what caught their attention.', chall1Short:'You see page views, not people.',
    chall2Icon:'🕐', chall2Title:'Delayed Follow-Up', chall2Desc:'By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.', chall2Short:'Interest peaks before your team calls.',
    chall3Icon:'📋', chall3Title:'Generic Outreach', chall3Desc:'Every buyer gets the same email, the same call script, the same brochure. A penthouse investor and a first-time family buyer hear the same pitch.', chall3Short:'Same pitch for every buyer.',

    /* The Shift (Pitch Deck p.3) */
    shiftLabel:'The Shift', shiftTitle:'From Public Website to Private Invitation',
    shiftDesc:'What if you stopped treating your website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite.',
    oldLabel:'The Old Way', oldTitle:'Generic Website', oldDesc:'One website for everyone. Anonymous traffic. No buyer identity.',
    old1:'Same experience for all visitors', old2:'No way to identify high-intent buyers', old3:'Sales team calls blind', old4:'Follow-up based on guesswork',
    newLabel:'The Dynamic Way', newTitle:'Private VIP Experience', newDesc:'Each buyer receives a VIP Access Key that unlocks a portal built for them.',
    new1:'Personalized content per buyer', new2:'Identity known before first click', new3:'Sales team has full context', new4:'Follow-up timed to buyer signals',

    /* How It Works (Pitch Deck p.4-5) */
    howLabel:'How It Works', howTitle:'From Premium Box to Booked Viewing',
    howDesc:'Selected prospects receive a premium box with an NFC card and a personal message. The message is clear: "This card unlocks a private experience created specifically for you."',
    how1Title:'VIP Campaign Selection', how1Desc:'Select high-value prospects from your CRM. Each gets a personalized VIP Access Key.',
    how2Title:'Premium Box Delivery', how2Desc:'A premium box with a personalized invitation — not a flyer. Physical touch builds trust.',
    how3Title:'Tap to Private Portal', how3Desc:'One tap opens a private portal — floor plans, pricing, booking. No app, no login.',
    how4Title:'Behavioral Intelligence', how4Desc:'Every portal action feeds your dashboard in real time. Your team knows who is ready.',

    /* Key Difference (Pitch Deck p.6) */
    diffLabel:'The Key Difference', diffTitle:'Same Website. Same Actions. Different Intelligence.',
    diffDesc:'The actions are identical for everyone — book a viewing, request pricing, explore payment plans. The only difference is identity.',
    diffVipTitle:'VIP Buyer (Known)', diffVipDesc:'Personal follow-ups, tailored incentives, concierge-level sales. Your team calls with full buyer context.',
    diffAnonTitle:'Public Visitor (Anonymous)', diffAnonDesc:'Segment-level insights that optimize marketing. Which floor plans get attention? What price range drives action?',

    /* Live Demo */
    demoLabel:'Live Demo', demoTitle:'See It In Action — Vista Residences',
    demoDesc:'Explore a working demo built for a fictional luxury tower project. See how different buyer profiles receive completely different experiences from the same platform.',
    demoBadge1:'VIP Investor', demoBadge2:'Family Buyer', demoBadge3:'Public Access', demoBadge4:'Analytics Dashboard',
    demoCard1Title:'Khalid Al-Rashid — Investor Portal', demoCard1Desc:'Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics.',
    demoCard2Title:'Ahmed Al-Fahad — Family Portal', demoCard2Desc:'Family buyer experience highlighting 3BR units, school districts, parks, and community amenities.',
    demoCard3Title:'Global Marketplace', demoCard3Desc:'Anonymous browsing experience with progressive lead capture — how public visitors become known buyers.',
    demoCard4Title:'Corporate Dashboard', demoCard4Desc:'Internal CRM dashboard showing real-time engagement, lead scoring, behavior tracking, and conversion funnels.',
    demoCta:'Visit Full Demo Environment →',

    /* Use Cases */
    ucLabel:'Use Cases', ucTitle:'From Tower Launches to Luxury Resale',
    ucDesc:'DynamicNFC adapts to every sales scenario in real estate.',
    uc1Title:'Pre-Construction Sales',
    uc1Desc:'Launch a 500-unit tower with VIP Access Keys for your top 200 prospects. Each card unlocks a portal showing their preferred floor, view orientation, and payment plan — before a single phone call is made. Your sales team sees who opened the portal, what they viewed, and who is ready for a callback.',
    uc1Tag1:'Floor Selection', uc1Tag2:'Pre-Launch Access', uc1Tag3:'Payment Plans', uc1Tag4:'Buyer Scoring',
    uc2Title:'Luxury Resale',
    uc2Desc:'For $5M+ listings, every touchpoint must reflect the calibre of the property. A premium brushed-metal NFC card delivered in a branded box positions the listing as exclusive. The buyer portal showcases private photography, video walkthroughs, and neighborhood data — all personalized to the recipient.',
    uc2Tag1:'White-Glove Experience', uc2Tag2:'Premium Presentation', uc2Tag3:'Private Media', uc2Tag4:'Concierge Sales',
    uc3Title:'Brokerage VIP Campaigns',
    uc3Desc:'Run a campaign across 50 high-value prospects this quarter. Each receives a VIP Access Key linked to your current inventory. Track which prospects engage, which listings they view repeatedly, and trigger sales alerts when engagement spikes. This is targeted outreach with built-in intelligence.',
    uc3Tag1:'Campaign Tracking', uc3Tag2:'Multi-Listing', uc3Tag3:'Engagement Alerts', uc3Tag4:'Pipeline Intelligence',
    uc4Title:'International Buyers',
    uc4Desc:'For overseas investors who can\'t visit the sales center, the VIP Access Key bridges the distance. Multi-language portals with virtual tours, floor plans, and pricing — all tracked. Your sales team in Vancouver knows the moment a buyer in Dubai opens their portal at 2am local time.',
    uc4Tag1:'Multi-Language', uc4Tag2:'Virtual Tours', uc4Tag3:'Time Zone Aware', uc4Tag4:'Cross-Border Sales',

    /* Partnership */
    partLabel:'Partnership Model', partTitle:'Launch in Weeks. Measure in Viewings.',
    partDesc:'We work alongside your sales team to design, deploy, and optimize the VIP buyer experience for your current project.',
    part1Title:'Select Your Prospects', part1Desc:'Choose 50–200 high-value prospects from your CRM or VIP waitlist. We help you segment by buyer profile.', part1Short:'50–200 VIP prospects from your CRM.',
    part2Title:'Design the Experience', part2Desc:'We build a private buyer portal matched to your project branding — floor plans, pricing, amenities, and calls-to-action.', part2Short:'Branded portal matching your project.',
    part3Title:'Deliver VIP Access Keys', part3Desc:'Premium NFC cards ship in branded boxes with personalized messages. Your prospects receive a physical invitation.', part3Short:'Premium boxes with personalized invitations.',
    part4Title:'Track & Close', part4Desc:'Your sales dashboard lights up with buyer signals. Your team follows up with context — and books more viewings.', part4Short:'Real-time signals, more booked viewings.',

    /* ROI (Pitch Deck p.7) */
    roiLabel:'Why This Matters', roiTitle:'Sales Velocity, Not Vanity Metrics.',
    roiDesc:'This is not about clicks or dashboards. It\'s about one thing: cutting the time from "Interested" to "Booked Viewing."',
    roi1Val:'Named', roi1Label:'Every Visitor Identified', roi1Sub:'No anonymous traffic — every tap linked to a real person',
    roi2Val:'Intent', roi2Label:'Behavioral Scoring', roi2Sub:'Know who is ready to buy, not just browsing',
    roi3Val:'Real-Time', roi3Label:'Sales Triggers', roi3Sub:'Your team gets alerts the moment a prospect re-engages',

    /* FAQ */
    faqLabel:'Sales Team FAQ', faqTitle:'Questions Your Team Will Ask',
    faq1Q:'Is this replacing our website or CRM?',
    faq1A:'No. DynamicNFC sits on top of your existing systems and enhances them. Your website remains public. The VIP portal is a private layer for selected prospects — connected to your CRM.',
    faq2Q:'How is consent handled?',
    faq2A:'Consent is explicit. The prospect receives a physical card with a clear message. The tap is the opt-in. There is no hidden tracking — the buyer knowingly enters their private portal.',
    faq3Q:'What does the buyer actually see?',
    faq3A:'A personalized web experience — no app required. They see floor plans, pricing, amenities, and calls-to-action tailored to their profile. Think of it as their own private project website.',
    faq4Q:'How do we measure success?',
    faq4A:'One metric: increase in booked viewings among VIP invitees versus your control group. We also track portal engagement, content interaction, and conversion-to-callback rates.',
    faq5Q:'How long does setup take?',
    faq5A:'2–4 weeks from kickoff to first cards delivered. We design the portal, program the NFC cards, package the boxes, and ship — while your sales team continues working their pipeline.',
    faq6Q:'What CRM systems do you connect with?',
    faq6A:'Salesforce, HubSpot, Follow Up Boss, kvCORE, and custom integrations via webhook. Buyer signals flow directly into your sales team\'s existing workflow.',

    /* CTA */
    ctaLabel:'Ready to Move', ctaTitle:'You\'re Not Handing Out Cards. You\'re Issuing Private Invitations.',
    ctaDesc:'Turn digital intent into real sales momentum. Start with 50 VIP Access Keys for your current project and measure the difference.',
    ctaPilot:'Start a Pilot →', ctaDemo:'See the Live Demo',

    /* Modal */
    modalTitle:'Start a Sales Pilot', modalSub:'Tell us about your current project and we\'ll design a VIP buyer experience pilot — typically 50–200 Access Keys with a personalized portal.',
    modalSec1:'Contact Information', modalSec2:'Your Practice', modalSec3:'Pilot Project', modalSec4:'Sales Challenge',
    modalSubmit:'Submit Pilot Request →', modalSubmitting:'Submitting...',
    modalNote:'We respond within 24 hours. Your information is kept strictly confidential.',
    successTitle:'Pilot Request Submitted', successDesc:'Thank you. Our real estate specialist will reach out within 24 hours with a customized pilot proposal.',
    successClose:'Close',

    fldName:'Full Name', fldEmail:'Email', fldPhone:'Phone', fldCompany:'Company / Brokerage', fldRole:'Role',
    fldSelectRole:'Select role', fldVpSales:'VP of Sales', fldDirSales:'Director of Sales', fldSalesMgr:'Sales Manager',
    fldBroker:'Broker / Managing Broker', fldAgent:'Senior Agent', fldMktDir:'Marketing Director', fldOther:'Other',
    fldTeamSize:'Team Size', fldSelectSize:'Select size', fldTeam15:'1 – 5 agents', fldTeam620:'6 – 20 agents', fldTeam2050:'20 – 50 agents', fldTeam50:'50+ agents',
    fldMarket:'Market', fldMarketHint:'e.g. Vancouver, Toronto, Dubai',
    fldProjectType:'Project or Listing Type', fldSelectType:'Select type',
    fldPreCon:'Pre-Construction Tower', fldLuxResale:'Luxury Resale ($2M+)', fldNewDev:'New Development', fldBrokerage:'Brokerage Campaign', fldMixed:'Mixed Portfolio',
    fldProspects:'VIP Prospects to Target', fldSelectRange:'Select range', fld50:'Under 50', fld50100:'50 – 100', fld100200:'100 – 200', fld200:'200+',
    fldChallenge:'Biggest sales challenge right now?', fldSelectChallenge:'Select challenge',
    fldCh1:'Anonymous website traffic — can\'t identify buyers', fldCh2:'Too slow from interest to first contact',
    fldCh3:'Generic outreach — one pitch for all buyers', fldCh4:'Sales team lacks buyer context on calls',
    fldCh5:'Low conversion from leads to booked viewings', fldCh6:'International buyers — hard to engage remotely',
    fldNotes:'Notes', fldNotesHint:'Tell us about your current project, sales goals, or pilot ideas...',
    fldError:'Something went wrong. Please try again.',

    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Professionals',
  },

  ar: {
    seoTitle: 'العقارات — تجارب مشترٍ VIP',
    seoDesc: 'نية المشترى المعرّفة، بوابات خاصة، وإشارات مبيعات لحظية للوسطاء وفرق مبيعات المشاريع. احجز المزيد من المعاينات مع DynamicNFC.',

    navChallenge: 'التحدي',
    navShift: 'التحول',
    navHow: 'كيف تعمل',
    navDiff: 'كبار الشخصيات والعامة',
    navDemo: 'عرض مباشر',
    navUseCases: 'حالات الاستخدام',
    navPartnership: 'الشراكة',
    navRoi: 'لماذا يهم',
    navFaq: 'الأسئلة الشائعة',
    navPilot: 'ابدأ تجربة',

    closeLabel: 'إغلاق الحوار',

    heroBadge:"تجربة كبار الشخصيات الرقمية للعقارات",
    heroTitle:"حوّل نية المشترين إلى حجوزات.",
    heroSub:"DynamicNFC يمنح فرق المبيعات العقارية أداة جديدة: مفاتيح كبار الشخصيات التي تقدم تجارب مشترٍ خاصة وشخصية — وتخبرك بالضبط من هو مستعد للتصرف، ما يهتم به، ومتى تتصل.",
    stat1Val:"زوار", stat1Label:"معرّفون", stat2Val:"تقييم", stat2Label:"النية", stat3Val:"تنبيهات", stat3Label:"فورية",
    heroCtaPilot:"ابدأ برنامج تجريبي →", heroCtaDemo:"شاهد العرض المباشر",

    challLabel:"النقطة العمياء", challTitle:"فريق المبيعات لديك لديه عملاء محتملون. لكنهم بلا سياق.",
    challQuote:"أعلى المشترين اهتمامًا يقضون أسابيع في استكشاف المخططات والأسعار وخيارات الدفع عبر الإنترنت. ومع ذلك، عندما يتواصل فريق المبيعات، غالبًا ما يفتقرون إلى أمر واحد حاسم: ", challQuoteHighlight:"السياق", challQuote2:". لا يعرفون من هو مستعد، وما يهتم به أكثر، ومتى يتصرف. هذا يؤدي إلى متابعة متأخرة، محادثات عامة، وفقدان الزخم.",
    chall1Icon:"👥", chall1Title:"الزيارات المجهولة", chall1Desc:"مئات الزوار يتصفحون موقع مشروعك. ترى عدد المشاهدات — لكنك لا تعرف من هم أو ما الذي جذب اهتمامهم.", chall1Short:"ترى زيارات، لا أشخاص.",
    chall2Icon:"🕐", chall2Title:"متابعة متأخرة", chall2Desc:"بحلول الوقت الذي يتواصل فيه فريق المبيعات، يكون اهتمام العميل قد تراجع. الفاصل بين ذروة الاهتمام وأول اتصال واسع جدًا.", chall2Short:"الاهتمام يبلغ ذروته قبل اتصال فريقك.",
    chall3Icon:"📋", chall3Title:"تواصل عام", chall3Desc:"كل مشتري يتلقى نفس البريد الإلكتروني، نفس نص المكالمة، ونفس الكتيب. المستثمر في البنتهاوس والعائلة لأول مرة يسمعون نفس العرض.", chall3Short:"نفس العرض لكل مشترٍ.",
    shiftLabel:"التحول", shiftTitle:"من موقع عام إلى دعوة خاصة",
    shiftDesc:"ماذا لو توقفت عن التعامل مع موقعك كبروشور — وبدأت معاملة الموقع كتجربة خاصة لمختارين فقط؟ ليس للجميع — فقط لأولئك الذين تدعوهم عمدًا.",
    oldLabel:"الطريقة القديمة", oldTitle:"موقع عام", oldDesc:"موقع واحد للجميع. زيارات مجهولة. لا توجد هوية للمشتري.",
    old1:"نفس التجربة لكل الزوار", old2:"لا توجد طريقة لتحديد المشترين ذوي النية العالية", old3:"فريق المبيعات يتصل بلا معلومات", old4:"المتابعة على التخمين",
    newLabel:"الطريقة الديناميكية", newTitle:"تجربة كبار الشخصيات خاصة", newDesc:"يحصل كل مشتري على مفتاح وصول كبار الشخصيات يفتح بوابة مصممة خصيصًا له.",
    new1:"محتوى مخصص لكل مشتري", new2:"الهوية معروفة قبل أول نقرة", new3:"فريق المبيعات لديه كامل السياق", new4:"المتابعة توقيت حسب إشارات المشتري",
    howLabel:"كيف تعمل العملية", howTitle:"من الصندوق الفاخر إلى الحجز",
    howDesc:"يتلقى العملاء المختارون صندوقًا فاخرًا يحتوي على بطاقة الاتصال قريب المدى ورسالة شخصية. الرسالة واضحة: \"تفتح هذه البطاقة تجربة خاصة مصممة خصيصًا لك.\"",
    how1Title:"اختيار حملة كبار الشخصيات", how1Desc:"اختر عملاء ذوي قيمة عالية من نظامك. كل منهم يحصل على مفتاح وصول باسمه.",
    how2Title:"تسليم الصندوق الفاخر", how2Desc:"صندوق فاخر مع دعوة شخصية — ليس منشورًا. اللمسة المادية تبني الثقة.",
    how3Title:"انقر للبوابة الخاصة", how3Desc:"نقرة واحدة تفتح بوابة خاصة — مخططات، أسعار، حجز. بلا تطبيق أو تسجيل.",
    how4Title:"الذكاء السلوكي", how4Desc:"كل إجراء يغذي لوحة التحكم لحظيًا. فريقك يعرف من الجاهز.",
    diffLabel:"الفرق الرئيسي", diffTitle:"نفس الموقع. نفس الإجراءات. ذكاء مختلف.",
    diffDesc:"الإجراءات متطابقة للجميع — حجز زيارة، طلب أسعار، استكشاف خطط الدفع. الاختلاف الوحيد هو الهوية.",
    diffVipTitle:"المشتري من كبار الشخصيات (معروف)", diffVipDesc:"متابعات شخصية، حوافز مخصصة، مبيعات بمستوى خدمة خاص. فريقك يتصل ومعه السياق الكامل.",
    diffAnonTitle:"زائر عام (مجهول)", diffAnonDesc:"رؤى على مستوى الفئات تُحسّن التسويق. أي المخططات تجذب الاهتمام؟ أي نطاق سعري يدفع للإجراء؟",
    demoLabel:"عرض مباشر", demoTitle:"شاهد كيف يعمل — مساكن فيستا",
    demoDesc:"استكشف عرضًا تجريبيًا مبنيًا لمشروع برج فاخر خيالي. شاهد كيف يتلقى ملفات تعريف المشترين المختلفة تجارب مختلفة تمامًا من نفس المنصة.",
    demoBadge1:"مستثمر كبار الشخصيات", demoBadge2:"مشتري عائلي", demoBadge3:"الوصول العام", demoBadge4:"لوحة تحليلات",
    demoCard1Title:"بوابة خالد الرشيد — المستثمر", demoCard1Desc:"تجربة المستثمرين المميزة مع محتوى مخصص للعائد على الاستثمار، عرض بنتهاوس في الطوابق العليا، وتحليلات الاستثمار.",
    demoCard2Title:"بوابة أحمد الفهد — العائلة", demoCard2Desc:"تجربة مشتري عائلي تسلط الضوء على وحدات 3 غرف نوم، المناطق المدرسية، الحدائق، والمرافق المجتمعية.",
    demoCard3Title:"السوق العالمي", demoCard3Desc:"تجربة تصفح مجهولة مع التقاط تدريجي للعملاء المحتملين — كيف يتحول الزوار العامون إلى مشترين معروفين.",
    demoCard4Title:"لوحة تحكم الشركة", demoCard4Desc:"لوحة إدارة علاقات العملاء داخلية تعرض التفاعل في الوقت الفعلي، تقييم العملاء، تتبع السلوك، ومسارات التحويل.",
    demoCta:"زيارة بيئة العرض التجريبي الكاملة →",
    ucLabel:"حالات الاستخدام", ucTitle:"من إطلاق الأبراج إلى إعادة البيع الفاخر",
    ucDesc:"تتكيف DynamicNFC مع كل سيناريو مبيعات في العقارات.",
    uc1Title:"مبيعات ما قبل البناء",
    uc1Desc:"أطلق برجًا من 500 وحدة مع مفاتيح كبار الشخصيات لأعلى 200 عميل محتمل. تفتح كل بطاقة بوابة تعرض الطابق المفضل، اتجاه الإطلالة، وخطة الدفع — قبل إجراء أي مكالمة هاتفية. يرى فريقك من فتح البوابة، ما الذي شاهده، ومن جاهز للمتابعة.",
    uc1Tag1:"اختيار الطابق", uc1Tag2:"الوصول قبل الإطلاق", uc1Tag3:"خطط الدفع", uc1Tag4:"تقييم العملاء",
    uc2Title:"إعادة بيع فاخر",
    uc2Desc:"لعروض بقيمة 5 ملايين دولار أو أكثر، يجب أن تعكس كل نقطة تواصل جودة العقار. بطاقة الاتصال قريب المدى معدنية فاخرة في صندوق ذو علامة تجارية تعطي الانطباع بالخصوصية. تعرض بوابة المشتري صورًا خاصة، فيديوهات جولة، وبيانات الحي — جميعها مخصصة للمستلم.",
    uc2Tag1:"تجربة فاخرة", uc2Tag2:"عرض فخم", uc2Tag3:"وسائط خاصة", uc2Tag4:"مبيعات الكونسييرج",
    uc3Title:"حملات كبار الشخصيات للوسطاء",
    uc3Desc:"نفّذ حملة على 50 عميلًا ذا قيمة عالية هذا الربع. كل منهم يتلقى مفتاح كبار الشخصيات مرتبط بمخزونك الحالي. تتبع أي العملاء يتفاعلون، أي العقارات يشاهدونها مرارًا، وفعّل تنبيهات المبيعات عند زيادة التفاعل. هذه متابعة مستهدفة مع ذكاء مدمج.",
    uc3Tag1:"تتبع الحملة", uc3Tag2:"قائمة متعددة", uc3Tag3:"تنبيهات التفاعل", uc3Tag4:"ذكاء خط الأنابيب",
    uc4Title:"المشترون الدوليون",
    uc4Desc:"للمستثمرين الأجانب الذين لا يمكنهم زيارة مركز المبيعات، يجسر مفتاح كبار الشخصيات المسافة. بوابات متعددة اللغات مع جولات افتراضية، مخططات، وأسعار — كل ذلك يتم تتبعه. يعرف فريق المبيعات في فانكوفر متى يفتح مشتري في دبي بوابته الساعة 2 صباحًا بتوقيت محلي.",
    uc4Tag1:"متعدد اللغات", uc4Tag2:"جولات افتراضية", uc4Tag3:"معرفة فرق التوقيت", uc4Tag4:"مبيعات عبر الحدود",
    partLabel:"نموذج الشراكة", partTitle:"إطلاق خلال أسابيع. قياس حسب الحجوزات.",
    partDesc:"نعمل جنبًا إلى جنب مع فريق المبيعات لتصميم ونشر وتحسين تجربة مشتري كبار الشخصيات لمشروعك الحالي.",
    part1Title:"اختر عملاءك المحتملين", part1Desc:"اختر 50–200 عميل ذي قيمة عالية من إدارة علاقات العملاء أو قائمة انتظار كبار الشخصيات. نساعدك على تقسيمهم حسب الملف الشخصي للمشتري.", part1Short:"50–200 عميل VIP من نظامك.",
    part2Title:"صمّم التجربة", part2Desc:"ننشئ بوابة مشتري خاصة متطابقة مع علامتك التجارية للمشروع — المخططات، الأسعار، المرافق، والدعوات للعمل.", part2Short:"بوابة تحمل هوية مشروعك.",
    part3Title:"تسليم مفاتيح كبار الشخصيات", part3Desc:"يتم شحن بطاقات الاتصال قريب المدى الفاخرة في صناديق مخصصة مع رسائل شخصية. يتلقى عملاؤك دعوة مادية.", part3Short:"صناديق فاخرة مع دعوات شخصية.",
    part4Title:"تتبع وإغلاق", part4Desc:"تضيء لوحة المبيعات الخاصة بك بإشارات العملاء. يتابع فريقك مع السياق — ويحجز المزيد من الزيارات.", part4Short:"إشارات فورية، حجوزات أكثر.",
    roiLabel:"لماذا هذا مهم", roiTitle:"سرعة المبيعات، وليس أرقام فارغة.",
    roiDesc:"ليس الأمر متعلقًا بالنقرات أو اللوحات — بل بتقليل الوقت من \"مهتم\" إلى \"حجز زيارة\".",
    roi1Val:"معرّف", roi1Label:"كل زائر معروف", roi1Sub:"لا زوار مجهولون — كل نقرة مرتبطة بشخص حقيقي",
    roi2Val:"نية", roi2Label:"تقييم سلوكي", roi2Sub:"اعرف من مستعد للشراء، ليس فقط التصفح",
    roi3Val:"فوري", roi3Label:"محفزات مبيعات", roi3Sub:"فريقك يتلقى تنبيهات لحظة عودة العميل",
    faqLabel:"الأسئلة الشائعة لفريق المبيعات", faqTitle:"الأسئلة التي سيطرحها فريقك",
    faq1Q:"هل هذا يستبدل موقعنا أو إدارة علاقات العملاء؟", faq1A:"لا. DynamicNFC يعمل على تحسين أنظمتك الحالية. يظل موقعك عامًا. بوابة كبار الشخصيات طبقة خاصة للمستثمرين المختارين — مرتبطة بـ إدارة علاقات العملاء الخاص بك.",
    faq2Q:"كيف تتم إدارة الموافقة؟", faq2A:"الموافقة صريحة. يتلقى العميل بطاقة مادية مع رسالة واضحة. النقر هو الموافقة. لا تتبع مخفي — العميل يدخل بوابته الخاصة بمعرفته.",
    faq3Q:"ماذا يرى العميل فعليًا؟", faq3A:"تجربة ويب مخصصة — لا حاجة لتطبيق. يرون المخططات، الأسعار، المرافق، والدعوات للعمل مصممة خصيصًا لهم. فكر فيها كموقعهم الخاص بالمشروع.",
    faq4Q:"كيف نقيس النجاح؟", faq4A:"مقياس واحد: زيادة الحجوزات بين دعوات كبار الشخصيات مقارنة بمجموعة التحكم. كما نتتبع التفاعل مع البوابة، تفاعل المحتوى، ومعدلات التحويل للاتصال.",
    faq5Q:"كم يستغرق الإعداد؟", faq5A:"2–4 أسابيع من بدء المشروع حتى تسليم البطاقات الأولى. نصمّم البوابة، نبرمج بطاقات NFC، نغلف الصناديق، ونشحن — بينما يواصل فريق المبيعات العمل في خط أنابيبهم.",
    faq6Q:"أي أنظمة إدارة علاقات العملاء نتصل بها؟", faq6A:"Salesforce، HubSpot، Follow Up Boss، kvCORE، والتكاملات المخصصة عبر webhook. إشارات العملاء تتدفق مباشرة إلى سير عمل فريق المبيعات.",
    ctaLabel:"جاهز للتحرك", ctaTitle:"أنت لا توزع بطاقات. أنت تصدر دعوات خاصة.",
    ctaDesc:"حوّل النية الرقمية إلى زخم مبيعات حقيقي. ابدأ بـ 50 مفتاح كبار الشخصيات للمشروع الحالي وقِس الفرق.",
    ctaPilot:"ابدأ برنامج تجريبي →", ctaDemo:"شاهد العرض المباشر",
    modalTitle:"ابدأ برنامج مبيعات تجريبي", modalSub:"أخبرنا عن مشروعك الحالي وسنصمّم تجربة مشترٍ من كبار الشخصيات تجريبية — عادةً من 50–200 مفتاح وصول مع بوابة شخصية.",
    modalSec1:"معلومات الاتصال", modalSec2:"ممارستك", modalSec3:"مشروعك الحالي", modalSec4:"تحدي المبيعات",
    modalSubmit:"إرسال طلب البرنامج التجريبي →", modalSubmitting:"جارٍ الإرسال...",
    modalNote:"نرد خلال 24 ساعة. يتم الاحتفاظ بمعلوماتك بسرية تامة.",
    successTitle:"تم إرسال طلب البرنامج التجريبي", successDesc:"شكرًا لك. سيتواصل معك أخصائي العقارات خلال 24 ساعة مع اقتراح برنامج تجريبي مخصص.",
    successClose:"إغلاق",

    fldName:'الاسم الكامل', fldEmail:'البريد الإلكتروني', fldPhone:'الهاتف', fldCompany:'الشركة / الوساطة', fldRole:'الدور',
    fldSelectRole:'اختر الدور', fldVpSales:'نائب رئيس المبيعات', fldDirSales:'مدير المبيعات', fldSalesMgr:'مدير مبيعات',
    fldBroker:'وسيط / وسيط إداري', fldAgent:'وكيل أول', fldMktDir:'مدير التسويق', fldOther:'أخرى',
    fldTeamSize:'حجم الفريق', fldSelectSize:'اختر الحجم', fldTeam15:'1 – 5 وكلاء', fldTeam620:'6 – 20 وكيل', fldTeam2050:'20 – 50 وكيل', fldTeam50:'50+ وكيل',
    fldMarket:'السوق', fldMarketHint:'مثال: فانكوفر، تورنتو، دبي',
    fldProjectType:'نوع المشروع أو العقار', fldSelectType:'اختر النوع',
    fldPreCon:'برج ما قبل البناء', fldLuxResale:'إعادة بيع فاخر ($2M+)', fldNewDev:'مشروع جديد', fldBrokerage:'حملة وساطة', fldMixed:'محفظة متنوعة',
    fldProspects:'عملاء VIP المستهدفون', fldSelectRange:'اختر النطاق', fld50:'أقل من 50', fld50100:'50 – 100', fld100200:'100 – 200', fld200:'200+',
    fldChallenge:'أكبر تحدٍّ في المبيعات الآن؟', fldSelectChallenge:'اختر التحدي',
    fldCh1:'زيارات مجهولة — لا يمكن تحديد المشترين', fldCh2:'بطء من الاهتمام إلى أول تواصل',
    fldCh3:'تواصل عام — عرض واحد للجميع', fldCh4:'فريق المبيعات يفتقر لسياق المشتري',
    fldCh5:'تحويل منخفض من العملاء إلى حجوزات', fldCh6:'مشترون دوليون — صعوبة التواصل عن بعد',
    fldNotes:'ملاحظات', fldNotesHint:'أخبرنا عن مشروعك الحالي وأهداف المبيعات...',
    fldError:'حدث خطأ. يرجى المحاولة مرة أخرى.',

    footerText:"© 2026 DynamicNFC — محرك سرعة المبيعات للمحترفين العقاريين",
  },
};

export default function RealEstate() {
  const { lang } = useLanguage();
  const [openUc, setOpenUc] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback(
    (k) => TR[lang]?.[k] ?? common[lang]?.[k] ?? TR.en[k] ?? common.en[k] ?? k,
    [lang],
  );

  useEffect(() => {
    const els = document.querySelectorAll('.ent-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openPilot = () => { setPilotOpen(true); setPilotSuccess(false); document.body.style.overflow = 'hidden'; };
  const closePilot = () => { setPilotOpen(false); document.body.style.overflow = ''; };
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') closePilot(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    data.submitted = new Date().toISOString();
    data._subject = `Real Estate Pilot — ${data.name} / ${data.company || 'Individual'}`;
    try {
      await fetch('/contact-form', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'realestate_pilot',
          event_label: data.company || 'unknown',
        });
      }
    } catch { setFormError(true); }
    setSubmitting(false);
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 20}s`, animationDuration: `${15 + Math.random() * 10}s`,
  }));

  const NfcIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold)' }}>
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" /><path d="M16.37 2a18.97 18.97 0 0 1 0 20" />
    </svg>
  );
  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  );

  return (
    <div className="ent-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/real-estate" />
      <div className="ent-bg-mesh" />
      <div className="ent-particles">
        {particles.map((p, i) => <div key={i} className="ent-particle" style={p} />)}
      </div>

      {/* Navbar is now global — rendered in App.jsx */}

      {/* HERO */}
      <section className="ent-hero">
        <div className="ent-nfc-anim">
          <div className="ent-nfc-waves-wrap"><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /></div>
          <div className="ent-nfc-card-icon"><NfcIcon /></div>
        </div>
        <div className="ent-hero-badge">{t('heroBadge')}</div>
        <h1>{t('heroTitle')}</h1>
        <p className="ent-hero-sub">{t('heroSub')}</p>
        <div className="ent-hero-stats">
          <div className="ent-stat"><span className="ent-stat-val">{t('stat1Val')}</span><span className="ent-stat-lbl">{t('stat1Label')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">{t('stat2Val')}</span><span className="ent-stat-lbl">{t('stat2Label')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">{t('stat3Val')}</span><span className="ent-stat-lbl">{t('stat3Label')}</span></div>
        </div>
        <div className="ent-hero-ctas">
          <button className="ent-btn-primary" onClick={openPilot}>{t('heroCtaPilot')}</button>
          <Link to="/enterprise/crmdemo/dashboard" className="ent-btn-secondary" style={{ textDecoration: 'none' }}>{t('heroCtaDemo')}</Link>
        </div>
      </section>

      <nav className="dev-section-nav" aria-label={lang === 'ar' ? 'أقسام الصفحة' : 'Page sections'}>
        <div className="dev-section-nav-inner">
          {RE_SECTION_NAV.map(({ id, labelKey }) => (
            <button type="button" key={id} className="dev-section-nav-btn" onClick={() => scrollTo(id)}>
              {t(labelKey)}
            </button>
          ))}
        </div>
      </nav>

      <div className="ent-divider" />

      {/* THE BLIND SPOT */}
      <section className="ent-section ent-problem ent-reveal dev-scroll-target" id="challenge">
        <div className="ent-section-label red">{t('challLabel')}</div>
        <div className="ent-section-title">{t('challTitle')}</div>
        <p className="ent-section-desc re-chall-quote">
          {t('challQuote')}
          <strong style={{ color: 'var(--red)' }}>{t('challQuoteHighlight')}</strong>
          {t('challQuote2')}
        </p>
        <div className="dev-blind-strip">
          {[1, 2, 3].map(i => (
            <div className="dev-blind-item" key={i}>
              <div className="dev-blind-icon">{RE_CHALLENGE_ICONS[i - 1]}</div>
              <h4>{t(`chall${i}Title`)}</h4>
              <p>{t(`chall${i}Short`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ ROI CALCULATOR CTA — Premium Banner ═══ */}
      <section className="re-roi-banner ent-reveal">
        <div className="re-roi-banner-glow" />
        <div className="re-roi-banner-content">
          <div className="re-roi-banner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M2 12h20" strokeLinecap="round" />
              <path d="M17 7l-5 5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="14" width="4" height="6" rx="1" fill="currentColor" opacity="0.2" />
              <rect x="10" y="10" width="4" height="10" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="17" y="6" width="4" height="14" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <div className="re-roi-banner-text">
            <span className="re-roi-banner-badge">{t('roiBannerBadge')}</span>
            <h3>{t('roiBannerTitleBefore')}<em>{t('roiBannerTitleEm')}</em>{t('roiBannerTitleAfter')}</h3>
            <p>{t('roiBannerSub')}</p>
          </div>
          <Link to="/sales/roi-calculator?industry=real-estate" className="re-roi-banner-btn">
            {t('roiBannerCta')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE SHIFT */}
      <section className="ent-section ent-reveal dev-scroll-target" id="shift">
        <div className="ent-section-label gold">{t('shiftLabel')}</div>
        <div className="ent-section-title">{t('shiftTitle')}</div>
        <p className="ent-section-desc">{t('shiftDesc')}</p>
        <div className="ent-shift-grid">
          <div className="ent-shift-box old">
            <div className="ent-shift-box-label">{t('oldLabel')}</div>
            <h3>{t('oldTitle')}</h3>
            <p className="ent-shift-box-desc">{t('oldDesc')}</p>
            <ul>{['old1','old2','old3','old4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
          <div className="ent-shift-arrow"><ArrowIcon /></div>
          <div className="ent-shift-box new">
            <div className="ent-shift-box-label">{t('newLabel')}</div>
            <h3>{t('newTitle')}</h3>
            <p className="ent-shift-box-desc">{t('newDesc')}</p>
            <ul>{['new1','new2','new3','new4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* HOW IT WORKS */}
      <section className="ent-section ent-reveal dev-scroll-target" id="how">
        <div className="ent-section-label teal">{t('howLabel')}</div>
        <div className="ent-section-title">{t('howTitle')}</div>
        <p className="ent-section-desc">{t('howDesc')}</p>
        <div className="ent-steps-row">
          {[1, 2, 3, 4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num dev-step-num-icon">{RE_HOW_ICONS[i - 1]}</div>
              <h4>{t(`how${i}Title`)}</h4>
              <p>{t(`how${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* VIP vs ANONYMOUS */}
      <section className="ent-section ent-reveal dev-scroll-target" id="diff">
        <div className="ent-section-label blue">{t('diffLabel')}</div>
        <div className="ent-section-title">{t('diffTitle')}</div>
        <p className="ent-section-desc">{t('diffDesc')}</p>
        <div className="re-diff-grid">
          <div className="re-diff-card vip">
            <div className="re-diff-indicator vip">VIP</div>
            <h4>{t('diffVipTitle')}</h4>
            <p>{t('diffVipDesc')}</p>
          </div>
          <div className="re-diff-card anon">
            <div className="re-diff-indicator anon">?</div>
            <h4>{t('diffAnonTitle')}</h4>
            <p>{t('diffAnonDesc')}</p>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* LIVE DEMO */}
      <section className="ent-section ent-demo ent-reveal dev-scroll-target" id="demo">
        <div className="ent-section-label blue">{t('demoLabel')}</div>
        <div className="ent-section-title">{t('demoTitle')}</div>
        <p className="ent-section-desc" style={{ margin: '0 auto' }}>{t('demoDesc')}</p>
        <div className="ent-demo-showcase">
          <div className="ent-demo-portals">
            <a href="/enterprise/crmdemo/khalid" target="_blank" rel="noreferrer" className="ent-demo-portal">
              <div className="ent-portal-badge red">{t('demoBadge1')}</div>
              <div className="ent-portal-avatar red">KR</div>
              <h4>{t('demoCard1Title')}</h4>
              <p>{t('demoCard1Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/ahmed" target="_blank" rel="noreferrer" className="ent-demo-portal">
              <div className="ent-portal-badge blue">{t('demoBadge2')}</div>
              <div className="ent-portal-avatar blue">AF</div>
              <h4>{t('demoCard2Title')}</h4>
              <p>{t('demoCard2Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/marketplace" target="_blank" rel="noreferrer" className="ent-demo-portal">
              <div className="ent-portal-badge teal">{t('demoBadge3')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--teal)' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h4>{t('demoCard3Title')}</h4>
              <p>{t('demoCard3Desc')}</p>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
            <a href="/enterprise/crmdemo/dashboard" target="_blank" rel="noreferrer" className="ent-demo-portal ent-demo-portal-featured">
              <div className="ent-portal-badge gold">{t('demoBadge4')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--gold)' }}>
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <h4>{t('demoCard4Title')}</h4>
                <p>{t('demoCard4Desc')}</p>
              </div>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
          </div>
          <div className="ent-demo-cta-row">
            <Link to="/enterprise/crmdemo/" className="ent-btn-primary">{t('demoCta')}</Link>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* USE CASES */}
      <section className="ent-section ent-reveal dev-scroll-target" id="usecases">
        <div className="ent-section-label gold">{t('ucLabel')}</div>
        <div className="ent-section-title">{t('ucTitle')}</div>
        <p className="ent-section-desc dev-uc-desc">{t('ucDesc')}</p>
        <div className="dev-uc-accordion">
          {[1, 2, 3, 4].map((i) => {
            const expanded = openUc === i;
            const tags = [1, 2, 3, 4].map((j) => t(`uc${i}Tag${j}`));
            const visibleTags = tags.slice(0, 3);
            const extraCount = Math.max(0, tags.length - visibleTags.length);
            return (
              <div className={`dev-uc-item${expanded ? ' open' : ''}`} key={i}>
                <button
                  type="button"
                  id={`re-uc-q-${i}`}
                  className="dev-uc-header"
                  onClick={() => setOpenUc(expanded ? null : i)}
                  aria-expanded={expanded}
                  aria-controls={`re-uc-a-${i}`}
                >
                  <span className="dev-uc-icon" aria-hidden>{RE_UC_ICONS[i - 1]}</span>
                  <span className="dev-uc-main">
                    <h4 className="dev-uc-title">{t(`uc${i}Title`)}</h4>
                    <span className="dev-uc-tags" aria-hidden>
                      {visibleTags.map((label, idx) => (
                        <span className="dev-uc-tag" key={idx}>{label}</span>
                      ))}
                      {extraCount > 0 && <span className="dev-uc-tag dev-uc-tag-more">{`+${extraCount}`}</span>}
                    </span>
                  </span>
                  <span className="dev-uc-action" aria-hidden>
                    <span className="dev-uc-action-icon">{expanded ? '−' : '+'}</span>
                  </span>
                </button>
                <div
                  id={`re-uc-a-${i}`}
                  role="region"
                  aria-labelledby={`re-uc-q-${i}`}
                  className="dev-uc-body"
                  hidden={!expanded}
                >
                  <p>{t(`uc${i}Desc`)}</p>
                  <div className="dev-uc-tags dev-uc-tags-full">
                    {tags.map((label, idx) => (
                      <span className="dev-uc-tag" key={idx}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="ent-divider" />

      {/* PARTNERSHIP */}
      <section className="ent-section ent-reveal dev-scroll-target" id="partnership">
        <div className="ent-section-label teal">{t('partLabel')}</div>
        <div className="ent-section-title">{t('partTitle')}</div>
        <p className="ent-section-desc">{t('partDesc')}</p>
        <div className="dev-part-grid" role="list">
          {[1, 2, 3, 4].map((i) => (
            <div className="dev-part-card" key={i} role="listitem">
              <div className="dev-part-icon" aria-hidden>{RE_PART_ICONS[i - 1]}</div>
              <h4 className="dev-part-title">{t(`part${i}Title`)}</h4>
              <p className="dev-part-sub">{t(`part${i}Short`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ROI */}
      <section className="ent-section ent-reveal dev-scroll-target" id="roi">
        <div className="ent-section-label red">{t('roiLabel')}</div>
        <div className="ent-section-title">{t('roiTitle')}</div>
        <p className="ent-section-desc">{t('roiDesc')}</p>
        <div className="ent-roi-metrics">
          {[1, 2, 3].map(i => {
            const colors = ['red', 'blue', 'gold'];
            return (
              <div className="ent-roi-card" key={i}>
                <div className={`ent-roi-big ${colors[i - 1]}`}>{t(`roi${i}Val`)}</div>
                <div className="ent-roi-label">{t(`roi${i}Label`)}</div>
                <div className="ent-roi-sub">{t(`roi${i}Sub`)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="ent-divider" />

      {/* FAQ */}
      <section className="ent-section ent-reveal dev-scroll-target" id="faq">
        <div className="ent-section-label teal">{t('faqLabel')}</div>
        <div className="ent-section-title">{t('faqTitle')}</div>
        <div className="dev-faq-list" role="list">
          {[1, 2, 3, 4, 5, 6].map(i => {
            const expanded = openFaq === i;
            return (
              <div className="dev-faq-item" key={i} role="listitem">
                <button
                  type="button"
                  id={`re-faq-q-${i}`}
                  className="dev-faq-q-btn"
                  aria-expanded={expanded}
                  aria-controls={`re-faq-a-${i}`}
                  onClick={() => setOpenFaq(expanded ? null : i)}
                >
                  <span className="dev-faq-q-text">{t(`faq${i}Q`)}</span>
                  <span className="dev-faq-chevron" aria-hidden>{expanded ? '−' : '+'}</span>
                </button>
                <div
                  id={`re-faq-a-${i}`}
                  role="region"
                  aria-labelledby={`re-faq-q-${i}`}
                  className="dev-faq-panel"
                  hidden={!expanded}
                >
                  <p>{t(`faq${i}A`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="dev-cta-section ent-reveal dev-scroll-target" id="cta">
        <div className="dev-cta-inner">
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaDesc')}</p>
          <div className="dev-cta-btns">
            <button className="dev-cta-primary" onClick={openPilot}>{t('ctaPilot')}</button>
            <Link to="/enterprise/crmdemo/dashboard" className="dev-cta-ghost" style={{ textDecoration: 'none' }}>
              {t('ctaDemo')}
            </Link>
          </div>
        </div>
      </section>

      {/* PILOT MODAL */}
      <div className={`ent-pilot-backdrop${pilotOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="re-pilot-title" onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="ent-pilot-modal">
          <div className="ent-pilot-header">
            <h3 id="re-pilot-title">{t('modalTitle')}</h3>
            <button type="button" className="ent-pilot-close" onClick={closePilot} aria-label={t('closeLabel')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="ent-pilot-sub">{t('modalSub')}</p>

          {!pilotSuccess ? (
            <form className="ent-pilot-form" ref={formRef} onSubmit={handleSubmit}>
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="form_type" value="real_estate_pilot" />

              <div className="ent-pilot-section-label">{t('modalSec1')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldName')} <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="name" required aria-required="true" />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldEmail')} <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="email" name="email" required aria-required="true" />
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldPhone')}</label>
                  <input className="ent-pilot-input" type="tel" name="phone" />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec2')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldCompany')} <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="company" required aria-required="true" />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldRole')} <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="role" required aria-required="true" defaultValue="">
                    <option value="" disabled>{t('fldSelectRole')}</option>
                    <option value="vp-sales">{t('fldVpSales')}</option>
                    <option value="director-sales">{t('fldDirSales')}</option>
                    <option value="sales-manager">{t('fldSalesMgr')}</option>
                    <option value="broker-owner">{t('fldBroker')}</option>
                    <option value="marketing-director">{t('fldMktDir')}</option>
                    <option value="agent">{t('fldAgent')}</option>
                    <option value="other">{t('fldOther')}</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldTeamSize')}</label>
                  <select className="ent-pilot-select" name="teamSize" defaultValue="">
                    <option value="" disabled>{t('fldSelectSize')}</option>
                    <option value="1-5">{t('fldTeam15')}</option>
                    <option value="6-20">{t('fldTeam620')}</option>
                    <option value="21-50">{t('fldTeam2050')}</option>
                    <option value="50+">{t('fldTeam50')}</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldMarket')}</label>
                  <input className="ent-pilot-input" type="text" name="market" placeholder={t('fldMarketHint')} />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec3')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldProjectType')} <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="projectType" required aria-required="true" defaultValue="">
                    <option value="" disabled>{t('fldSelectType')}</option>
                    <option value="pre-construction">{t('fldPreCon')}</option>
                    <option value="luxury-resale">{t('fldLuxResale')}</option>
                    <option value="new-development">{t('fldNewDev')}</option>
                    <option value="brokerage-campaign">{t('fldBrokerage')}</option>
                    <option value="mixed-use">{t('fldMixed')}</option>
                    <option value="other">{t('fldOther')}</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldProspects')}</label>
                  <select className="ent-pilot-select" name="vipCount" defaultValue="">
                    <option value="" disabled>{t('fldSelectRange')}</option>
                    <option value="25-50">{t('fld50')}</option>
                    <option value="50-100">{t('fld50100')}</option>
                    <option value="100-200">{t('fld100200')}</option>
                    <option value="200+">{t('fld200')}</option>
                  </select>
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec4')}</div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">{t('fldChallenge')}</label>
                <select className="ent-pilot-select" name="challenge" defaultValue="">
                  <option value="" disabled>{t('fldSelectChallenge')}</option>
                  <option value="anonymous-traffic">{t('fldCh1')}</option>
                  <option value="slow-followup">{t('fldCh2')}</option>
                  <option value="generic-outreach">{t('fldCh3')}</option>
                  <option value="no-context">{t('fldCh4')}</option>
                  <option value="low-viewings">{t('fldCh5')}</option>
                  <option value="international-buyers">{t('fldCh6')}</option>
                  <option value="other">{t('fldOther')}</option>
                </select>
              </div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">{t('fldNotes')}</label>
                <textarea className="ent-pilot-textarea" name="notes" placeholder={t('fldNotesHint')} />
              </div>

              {formError && <p className="ent-pilot-error">{t('fldError')}</p>}
              <button type="submit" className="ent-pilot-submit" disabled={submitting}>
                {submitting ? t('modalSubmitting') : t('modalSubmit')}
              </button>
              <p className="ent-pilot-note">{t('modalNote')}</p>
            </form>
          ) : (
            <div className="ent-pilot-success show">
              <div className="ent-pilot-success-icon">✓</div>
              <h4>{t('successTitle')}</h4>
              <p>{t('successDesc')}</p>
              <button className="ent-btn-close-success" onClick={closePilot}>{t('successClose')}</button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="dev-footer">
        <div className="dev-ft-inner">
          <div className="dev-ft-brand">
            <Link to="/"><img src="/assets/images/logo.png" alt="DynamicNFC" className="dev-ft-logo" /></Link>
            <p className="dev-ft-note">{isRTL ? 'المقر الرئيسي في فانكوفر، كندا. ذكاء مبيعات NFC للعقارات والسيارات والمؤسسات.' : 'Headquartered in Vancouver, Canada. NFC-powered sales intelligence for real estate, automotive, and enterprise.'}</p>
          </div>
          <div className="dev-ft-cols">
            <div className="dev-ft-col">
              <h5>{isRTL ? 'القطاعات' : 'Industries'}</h5>
              <Link to="/developers">{isRTL ? 'المطورين' : 'Developers'}</Link>
              <Link to="/real-estate">{isRTL ? 'العقارات' : 'Real Estate'}</Link>
              <Link to="/automotive">{isRTL ? 'السيارات' : 'Automotive'}</Link>
              <Link to="/nfc-cards">{isRTL ? 'بطاقات NFC' : 'NFC Cards'}</Link>
            </div>
            <div className="dev-ft-col">
              <h5>{isRTL ? 'الموارد' : 'Resources'}</h5>
              <Link to="/enterprise/crmdemo/dashboard">{isRTL ? 'عرض مباشر' : 'Live Demo'}</Link>
              <Link to="/contact-sales">{isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}</Link>
              <Link to="/login">{isRTL ? 'تسجيل الدخول' : 'Log in'}</Link>
            </div>
          </div>
        </div>
        <div className="dev-ft-bottom"><p>{isRTL ? '© ٢٠٢٦ DynamicNFC Card Inc. جميع الحقوق محفوظة.' : '© 2026 DynamicNFC Card Inc. All Rights Reserved.'}</p></div>
      </footer>
    </div>
  );
}

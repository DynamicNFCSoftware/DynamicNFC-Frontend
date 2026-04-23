import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import { common } from '../../i18n/common';
import '../Enterprise/Enterprise.css';
import './Developers.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/pages/developers';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Real Estate Developers — Sales Velocity Engine
   Pitch-Deck Aligned: Identity → Intent → Viewings
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* SEO */
    seoTitle:'Real Estate Developers — Sales Velocity Engine',
    seoDesc:'Private VIP buyer portals, named intent, and portfolio-scale analytics for real estate developers. Start a pilot or explore the live demo.',

    /* Nav */
    navChallenge:'The Challenge', navShift:'The Shift', navHow:'How It Works', navDiff:'The Difference', navPortfolio:'Portfolio', navPartnership:'Partnership', navRoi:'Why It Matters', navFaq:'FAQ', navDemo:'Live Demo', navUseCases:'Use Cases', navPilot:'Start a Pilot',

    /* Hero */
    heroBadge:'Sales Velocity Engine for Real Estate Developers & Agents',
    heroTitle:'Identity Precedes Action. Action Drives Sales.',
    heroSub:'DynamicNFC turns your project websites into private, invitation-only buyer experiences. You know WHO is browsing before you know WHAT they do — and that changes everything about how your sales team closes.',
    stat1Val:'Named', stat1Label:'Visitors', stat2Val:'Intent', stat2Label:'Scoring', stat3Val:'Real-Time', stat3Label:'Alerts',
    heroCtaPilot:'Start a Pilot Program →', heroCtaDemo:'See the Live Demo',

    /* The Blind Spot (Pitch Deck p.2) */
    challLabel:'The Blind Spot', challTitle:'Your Buyers Are Ready. Your Sales Team Doesn\'t Know It.',
    challQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options on your project website. Yet when your sales team picks up the phone, they lack one critical thing: ', challQuoteHighlight:'context', challQuote2:'. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Title:'Anonymous Traffic', chall1Desc:'Thousands visit your project website. You see page views — but you don\'t know if that visitor is a $5M investor or a casual browser.', chall1Short:'You see page views, not people.',
    chall2Title:'Delayed Follow-Up', chall2Desc:'By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.', chall2Short:'Interest peaks before your team calls.',
    chall3Title:'Generic Outreach', chall3Desc:'Every buyer gets the same brochure, the same tour, the same call script. A penthouse investor and a first-time family buyer hear the same pitch.', chall3Short:'Same pitch for every buyer.',

    /* The Shift (Pitch Deck p.3) */
    shiftLabel:'The Shift', shiftTitle:'From Public Website to Private Invitation',
    shiftDesc:'What if you stopped treating your project website as a brochure, and instead treated it as a private experience for selected prospects? Not everyone — only those you intentionally invite.',
    oldLabel:'The Old Way', oldTitle:'Generic Project Website', oldDesc:'One website for everyone. Anonymous traffic. No buyer identity. Sales team calls blind.',
    old1:'Same experience for all visitors', old2:'No way to identify high-intent buyers', old3:'Sales team lacks context on calls', old4:'Follow-up based on guesswork',
    newLabel:'The Dynamic Way', newTitle:'Private VIP Experiences', newDesc:'Each prospect receives a VIP Access Key — a physical invitation to their own private portal.',
    new1:'Personalized content per buyer', new2:'Identity known before first click', new3:'Sales team calls with full context', new4:'Follow-up timed to buyer signals',

    /* How It Works (Pitch Deck p.4-5) */
    howLabel:'How It Works', howTitle:'From Premium Box to Booked Viewing',
    howDesc:'Selected prospects receive a premium box with a VIP Access Key and a personal message: "This card unlocks a private experience created specifically for you." When they tap, they enter. When they browse, you know.',
    how1Title:'VIP Campaign Selection', how1Desc:'Select 100–200 high-value prospects per project. Each gets a named VIP Access Key.',
    how2Title:'Premium Box Delivery', how2Desc:'A premium box with a personalized invitation — not a flyer. Physical touch builds trust.',
    how3Title:'Tap to Private Portal', how3Desc:'One tap opens a private portal — floor plans, pricing, booking. No app, no login.',
    how4Title:'Behavioral Intelligence', how4Desc:'Every portal action feeds your dashboard in real time. Your team knows who is ready.',

    /* Key Difference (Pitch Deck p.6) */
    diffLabel:'The Key Difference', diffTitle:'Same Website. Same Actions. Different Intelligence.',
    diffDesc:'Inside the experience, buyers are free to do whatever they want — book a viewing, request pricing, explore payment plans, download brochures. There is no forced funnel. The only difference is identity.',
    diffVipTitle:'VIP Buyer (Known Identity)', diffVipDesc:'Personal follow-ups, tailored incentives, concierge-level sales. Your team calls with full buyer context.',
    diffAnonTitle:'Public Visitor (Anonymous)', diffAnonDesc:'Segment-level insights that optimize marketing. Which floor plans get attention? What price range drives action?',

    /* Portfolio Scale — Developer-specific differentiation */
    portLabel:'Portfolio Scale', portTitle:'One Platform. Every Project. Cross-Portfolio Intelligence.',
    portDesc:'Unlike single-project tools, DynamicNFC deploys across your entire portfolio. Buyer intelligence from Project A carries to Project B. A prospect who viewed penthouses in Tower One gets penthouse-first content when Tower Two launches.',
    port1Title:'Deploy Once, Scale Everywhere', port1Desc:'Configure the platform once. Launch new project portals in days — not months. Same dashboard, new project, shared buyer intelligence.',
    port2Title:'Cross-Project Buyer Signals', port2Desc:'A buyer who engaged with your downtown tower also gets flagged when your waterfront project launches. Portfolio-level insights that single-project tools can\'t provide.',
    port3Title:'Eliminate Repeated Setup', port3Desc:'No more rebuilding sales infrastructure for every new launch. Your templates, buyer segments, and analytics framework carry forward.',

    /* Live Demo */
    demoLabel:'Live Demo', demoTitle:'See It In Action — Vista Residences',
    demoDesc:'Explore a working demo built for a fictional luxury tower project. See how different buyer profiles receive completely different experiences from the same platform.',
    demoBadge1:'VIP Investor', demoBadge2:'Family Buyer', demoBadge3:'Public Access', demoBadge4:'Analytics',
    demoCard1Title:'Khalid Al-Rashid — Investor Portal', demoCard1Desc:'Elite investor experience — ROI-focused content, high-floor penthouse showcases, investment analytics dashboard.',
    demoCard2Title:'Ahmed Al-Fahad — Family Portal', demoCard2Desc:'Family buyer experience — 3BR units, school districts, parks, community amenities, family-friendly payment plans.',
    demoCard3Title:'Global Marketplace', demoCard3Desc:'Anonymous browsing with progressive lead capture — how public visitors become known buyers over time.',
    demoCard4Title:'Corporate Dashboard', demoCard4Desc:'Internal behavioral analytics — real-time engagement, lead scoring, behavior tracking, and conversion funnels.',
    demoCta:'Visit Full Demo Environment →',

    /* Use Cases */
    ucLabel:'Use Cases', ucTitle:'From Tower Launches to Master-Planned Communities',
    ucDesc:'DynamicNFC adapts to every project type in your portfolio — each with its own VIP buyer experience.',
    uc1Title:'Residential Towers',
    uc1Desc:'Launch a 500-unit tower with VIP Access Keys for your top 200 prospects. Each card unlocks a portal showing their preferred floor, view orientation, and payment plan — before a single phone call is made. Your sales team sees who opened the portal, what they viewed, and who is ready for a callback.',
    uc1Tag1:'Floor Selection', uc1Tag2:'View Orientation', uc1Tag3:'Payment Plans', uc1Tag4:'Buyer Scoring',
    uc2Title:'Master-Planned Communities',
    uc2Desc:'Across a 2,000-unit master plan, different buyer segments need different experiences. Investors see ROI projections and rental yields. Families see school proximity and parks. DynamicNFC delivers both from the same project — each identified, each tracked.',
    uc2Tag1:'Segment Targeting', uc2Tag2:'Phased Releases', uc2Tag3:'Community Amenities', uc2Tag4:'Multi-Phase Tracking',
    uc3Title:'Branded Residences',
    uc3Desc:'For ultra-luxury branded residences, the sales experience must match the brand. VIP Access Keys arrive in a premium box that reflects the brand\'s design language. The private portal is exclusive, curated, and personal — matching the white-glove standard your buyers expect.',
    uc3Tag1:'Brand Integration', uc3Tag2:'White-Glove Experience', uc3Tag3:'Concierge Sales', uc3Tag4:'Ultra-High-Net-Worth',
    uc4Title:'Mixed-Use Developments',
    uc4Desc:'Retail investors, commercial tenants, and residential buyers have fundamentally different needs. DynamicNFC creates distinct portals within the same development — each tailored to what matters most for that buyer type, all feeding the same unified dashboard.',
    uc4Tag1:'Multi-Segment', uc4Tag2:'Commercial & Residential', uc4Tag3:'Investor vs. End-User', uc4Tag4:'Unified Analytics',

    /* Partnership */
    partLabel:'Partnership Model', partTitle:'Launch in Weeks. Measure in Viewings. Scale to Your Portfolio.',
    partDesc:'We work alongside your sales team to design, deploy, and optimize the VIP buyer experience — starting with one project, then scaling across every launch.',
    part1Title:'2–4 Week Pilot', part1Desc:'Launch on one project with 100 VIP Access Keys. Measure booked viewings against your control group within 30 days.', part1Short:'100 VIP keys, one project, 30 days.',
    part2Title:'Custom Portal Design', part2Desc:'We design private buyer portals that match your project branding — floor plan galleries, pricing, amenities, calls-to-action.', part2Short:'Branded portals matching your project.',
    part3Title:'CRM Integration', part3Desc:'Behavioral intelligence feeds directly into Salesforce, HubSpot, or your custom CRM. No system replacement — we enhance what you already use.', part3Short:'Feeds into Salesforce, HubSpot, or yours.',
    part4Title:'Portfolio Rollout', part4Desc:'Once proven on one project, deploy across your entire portfolio. Shared buyer intelligence across all launches. New project portals go live in days.', part4Short:'Scale to every project in days.',

    /* ROI (Pitch Deck p.7) */
    roiLabel:'Why This Matters', roiTitle:'Sales Velocity, Not Vanity Metrics.',
    roiDesc:'This is not about clicks or dashboards. It\'s about one thing: an increase in booked viewings and decision speed.',
    roi1Val:'Named', roi1Label:'Every Visitor Identified', roi1Sub:'No anonymous traffic — every tap linked to a real person',
    roi2Val:'Intent', roi2Label:'Behavioral Scoring', roi2Sub:'Know who is ready to buy, not just browsing',
    roi3Val:'Real-Time', roi3Label:'Sales Triggers', roi3Sub:'Your team gets alerts the moment a prospect re-engages',

    /* FAQ */
    faqLabel:'Developer FAQ', faqTitle:'Questions Your Team Will Ask',
    faq1Q:'Is this replacing our website or CRM?',
    faq1A:'No. DynamicNFC sits on top of your existing systems and enhances them. Your project website remains public. The VIP portal is a private layer for selected prospects — connected to your existing CRM.',
    faq2Q:'How is consent and privacy handled?',
    faq2A:'Consent is explicit. The prospect receives a physical card with a clear message. The tap is the opt-in. There is no hidden tracking — the buyer knowingly enters their private portal. This establishes consent, exclusivity, and trust before any tracking happens.',
    faq3Q:'What does the buyer actually receive?',
    faq3A:'A premium box containing a VIP Access Key — a brushed-metal NFC card with a personalized message. Not a marketing flyer. A private invitation. When they tap, they enter a web experience designed specifically for them. No app required.',
    faq4Q:'Can this work across multiple projects?',
    faq4A:'Yes — that\'s the core developer advantage. One platform, one dashboard, with project-level filtering and portfolio-level insights. Buyer intelligence from one project carries to the next.',
    faq5Q:'How do we measure pilot success?',
    faq5A:'One metric: increase in booked viewings among VIP invitees versus your control group. Not clicks. Not pageviews. Real sales activity within 30 days of launch.',
    faq6Q:'What about international buyers?',
    faq6A:'Portals support multiple languages and adapt to buyer location. The same project can serve buyers from Dubai, London, and Vancouver — each in their preferred language, all tracked in the same dashboard.',

    /* CTA (Pitch Deck p.8) */
    ctaLabel:'Ready to Deploy',
    ctaTitle:'You\'re Not Handing Out Cards. You\'re Issuing Private Invitations.',
    ctaDesc:'Turn digital intent into real sales momentum. Start with one project and 100 VIP Access Keys. Measure the difference in booked viewings. Then scale to your portfolio.',
    ctaPilot:'Start a Pilot Program →', ctaDemo:'See the Live Demo',

    /* Modal */
    modalTitle:'Start a Developer Pilot', modalSub:'Tell us about your portfolio and we\'ll design a custom pilot — 100 VIP Access Keys on one project, full analytics, measurable results within 30 days.',
    modalSec1:'Contact Information', modalSec2:'Company & Portfolio', modalSec3:'Pilot Project', modalSec4:'Sales Challenge',
    modalSubmit:'Submit Pilot Request →', modalSubmitting:'Submitting...',
    modalNote:'We respond within 24 hours. Your information is kept strictly confidential.',
    successTitle:'Pilot Request Submitted', successDesc:'Thank you. Our developer partnerships team will review your portfolio details and reach out within 24 hours.',
    successClose:'Close',
    closeLabel:'Close dialog',

    /* Form fields */
    fldName:'Full Name', fldEmail:'Email', fldPhone:'Phone', fldCompany:'Company', fldRole:'Role',
    fldSelectRole:'Select role', fldCeo:'CEO / Chairman', fldCso:'Chief Sales Officer', fldCmo:'Chief Marketing Officer',
    fldVpSales:'VP of Sales', fldVpDev:'VP of Development', fldDirSales:'Director of Sales', fldDirMkt:'Director of Marketing',
    fldGm:'General Manager', fldOther:'Other',
    fldActiveProjects:'Active Projects', fldHowMany:'How many?',
    fldProj13:'1 – 3 projects', fldProj410:'4 – 10 projects', fldProj1025:'10 – 25 projects', fldProj25:'25+ projects',
    fldMarkets:'Markets', fldMarketsHint:'e.g. Vancouver, Dubai, London',
    fldPilotProject:'Pilot Project Name', fldProjectType:'Project Type', fldSelectType:'Select type',
    fldTower:'Residential Tower', fldMasterPlan:'Master-Planned Community', fldBranded:'Branded Residences',
    fldVilla:'Luxury Villas', fldMixedUse:'Mixed-Use Development', fldCommercial:'Commercial',
    fldTotalUnits:'Total Units', fldSelectRange:'Select range',
    fldUnder50:'Under 50', fld50200:'50 – 200', fld200500:'200 – 500', fld5002000:'500 – 2,000', fld2000:'2,000+',
    fldLocation:'Project Location',
    fldChallenge:'Biggest sales challenge across projects?', fldSelectChallenge:'Select challenge',
    fldCh1:'Anonymous website traffic — can\'t identify buyers', fldCh2:'Too slow from interest to first contact',
    fldCh3:'Generic outreach — one pitch for all buyers', fldCh4:'Sales team lacks buyer context on calls',
    fldCh5:'No portfolio-level buyer intelligence', fldCh6:'Low conversion from leads to booked viewings',
    fldCh7:'Repeated setup costs per project launch',
    fldNotes:'Notes', fldNotesHint:'Tell us about your portfolio, current sales challenges, or pilot goals...',
    fldError:'Something went wrong. Please try again.',

    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Developers',
  },

  ar: {
    seoTitle:"مطورو العقارات — محرك تسريع المبيعات",
    seoDesc:"بوابات شراء خاصة لكبار الشخصيات، نية معروفة، وتحليلات على مستوى المحفظة لمطوري العقارات. ابدأ تجربة أو استكشف العرض التجريبي المباشر.",

    navChallenge:"التحدي", navShift:"التحول", navHow:"كيف يعمل", navDiff:"الفرق", navPortfolio:"المحفظة", navPartnership:"الشراكة", navRoi:"لماذا يهم", navFaq:"الأسئلة", navDemo:"عرض تجريبي مباشر", navUseCases:"حالات الاستخدام", navPilot:"ابدأ تجربة",

    heroBadge:"محرك تسريع المبيعات لمطوري ووكلاء العقارات",
    heroTitle:"الهوية تسبق الفعل. والفعل يقود إلى المبيعات.",
    heroSub:"تحوّل DynamicNFC مواقع مشاريعك إلى تجارب شراء خاصة تعتمد على الدعوة فقط. أنت تعرف من يتصفح قبل أن تعرف ماذا يفعل — وهذا يغيّر كل شيء في طريقة إغلاق الصفقات لدى فريق المبيعات.",
    stat1Val:"زوار", stat1Label:"معرّفون", stat2Val:"تقييم", stat2Label:"النية", stat3Val:"تنبيهات", stat3Label:"فورية",
    heroCtaPilot:"ابدأ برنامجًا تجريبيًا →", heroCtaDemo:"شاهد العرض التجريبي المباشر",

    challLabel:"النقطة العمياء", challTitle:"المشترون لديك مستعدون. لكن فريق المبيعات لا يعلم ذلك.",
    challQuote:"يقضي المشترون ذوو النية الأعلى لديك أسابيع في استكشاف مخططات الطوابق والأسعار وخيارات الدفع على موقع مشروعك. ومع ذلك، عندما يلتقط فريق المبيعات الهاتف، يفتقدون شيئًا حاسمًا واحدًا: ", challQuoteHighlight:"السياق", challQuote2:". فهم لا يعرفون من هو الجاهز، وما الذي يهتم به أكثر، أو متى يجب التحرك. وهذا يؤدي إلى متابعات متأخرة، ومحادثات عامة، وفقدان الزخم.",
    chall1Title:"زيارات مجهولة", chall1Desc:"يزور الآلاف موقع مشروعك على الويب. ترى عدد الزيارات — لكنك لا تعرف ما إذا كان هذا الزائر مستثمرًا بقيمة 5 ملايين دولار أم مجرد متصفح عادي.", chall1Short:"ترى زيارات، لا أشخاص.",
    chall2Title:"متابعة متأخرة", chall2Desc:"بحلول الوقت الذي يتواصل فيه فريق المبيعات لديك، يكون اهتمام المشتري قد خفّ. الفاصل الزمني بين ذروة الاهتمام وأول تواصل طويل جدًا.", chall2Short:"الاهتمام يبلغ ذروته قبل اتصال فريقك.",
    chall3Title:"تواصل عام", chall3Desc:"كل مشترٍ يحصل على نفس الكتيب، ونفس الجولة، ونفس نص المكالمة. مستثمر البنتهاوس ومشتري الأسرة لأول مرة يسمعان نفس العرض.", chall3Short:"نفس العرض لكل مشترٍ.",

    shiftLabel:"التحول", shiftTitle:"من موقع عام إلى دعوة خاصة",
    shiftDesc:"ماذا لو توقفت عن التعامل مع موقع مشروعك ككتيب، وبدأت التعامل معه كتجربة خاصة لعملاء مختارين؟ ليس للجميع — بل فقط لمن تدعوهم عمدًا.",
    oldLabel:"الطريقة القديمة", oldTitle:"موقع مشروع عام", oldDesc:"موقع واحد للجميع. زيارات مجهولة. لا توجد هوية للمشتري. فريق المبيعات يتصل دون معلومات.",
    old1:"نفس التجربة لجميع الزوار", old2:"لا توجد طريقة لتحديد المشترين ذوي النية العالية", old3:"يفتقر فريق المبيعات إلى السياق أثناء المكالمات", old4:"المتابعة تعتمد على التخمين",
    newLabel:"الطريقة الحديثة", newTitle:"تجارب خاصة لكبار الشخصيات", newDesc:"يحصل كل عميل محتمل على مفتاح وصول لكبار الشخصيات — دعوة فعلية إلى بوابته الخاصة.",
    new1:"محتوى مخصص لكل مشترٍ", new2:"معرفة الهوية قبل أول نقرة", new3:"يتصل فريق المبيعات ومعه السياق الكامل", new4:"متابعة في التوقيت المناسب وفق إشارات المشتري",

    howLabel:"كيف يعمل", howTitle:"من الصندوق الفاخر إلى زيارة محجوزة",
    howDesc:"يتلقى العملاء المختارون صندوقًا فاخرًا يحتوي على مفتاح وصول لكبار الشخصيات ورسالة شخصية:\"هذه البطاقة تفتح تجربة خاصة صُممت خصيصًا لك.\"عندما ينقرونها يدخلون. وعندما يتصفحون، أنت تعلم.",
    how1Title:"اختيار حملة كبار الشخصيات", how1Desc:"اختر 100–200 عميل عالي القيمة لكل مشروع. كل منهم يحصل على مفتاح وصول باسمه.",
    how2Title:"توصيل الصندوق الفاخر", how2Desc:"صندوق فاخر مع دعوة شخصية — ليس منشورًا. اللمسة المادية تبني الثقة.",
    how3Title:"انقر للبوابة الخاصة", how3Desc:"نقرة واحدة تفتح بوابة خاصة — مخططات، أسعار، حجز. بلا تطبيق أو تسجيل.",
    how4Title:"الذكاء السلوكي", how4Desc:"كل إجراء يغذي لوحة التحكم لحظيًا. فريقك يعرف من الجاهز.",

    diffLabel:"الفرق الرئيسي", diffTitle:"نفس الموقع. نفس الإجراءات. معلومات مختلفة.",
    diffDesc:"داخل التجربة، يكون المشترون أحرارًا في القيام بما يريدون — حجز زيارة، طلب الأسعار، استكشاف خطط الدفع، تنزيل الكتيبات. لا يوجد مسار إلزامي. الفرق الوحيد هو الهوية.",
    diffVipTitle:"مشتري من كبار الشخصيات (هوية معروفة)", diffVipDesc:"متابعات شخصية، حوافز مخصصة، مبيعات بمستوى خدمة خاص. فريقك يتصل ومعه السياق الكامل.",
    diffAnonTitle:"زائر عام (مجهول)", diffAnonDesc:"رؤى على مستوى الفئات تُحسّن التسويق. أي المخططات تجذب الاهتمام؟ أي نطاق سعري يدفع للإجراء؟",

    portLabel:"التوسع على مستوى المحفظة", portTitle:"منصة واحدة. كل مشروع. ذكاء شامل عبر جميع المحافظ.",
    portDesc:"على عكس الأدوات الخاصة بمشروع واحد، يعمل DynamicNFC عبر كامل محفظة مشاريعك. معلومات المشترين من المشروع الأول تنتقل إلى المشروع الثاني. العميل الذي شاهد وحدات البنتهاوس في البرج الأول يحصل على محتوى البنتهاوس أولًا عند إطلاق البرج الثاني.",
    port1Title:"نشر مرة واحدة والتوسع في كل مكان", port1Desc:"قم بإعداد المنصة مرة واحدة. أطلق بوابات مشاريع جديدة خلال أيام — وليس أشهر. نفس لوحة التحكم، مشروع جديد، معلومات مشترين مشتركة.",
    port2Title:"إشارات المشترين عبر المشاريع", port2Desc:"المشتري الذي تفاعل مع برجك في وسط المدينة يتم تمييزه أيضًا عند إطلاق مشروعك على الواجهة البحرية. معلومات على مستوى المحفظة لا يمكن لأدوات المشروع الواحد توفيرها.",
    port3Title:"إلغاء الإعداد المتكرر", port3Desc:"لا حاجة لإعادة بناء بنية المبيعات لكل إطلاق جديد. القوالب وشرائح المشترين وإطار التحليلات لديك تنتقل معك.",

    demoLabel:"عرض تجريبي مباشر", demoTitle:"شاهده أثناء العمل — مساكن فيستا",
    demoDesc:"استكشف عرضًا تجريبيًا عمليًا لمشروع برج فاخر افتراضي. شاهد كيف يتلقى المشترون المختلفون تجارب مختلفة تمامًا من نفس المنصة.",
    demoBadge1:"مستثمر VIP", demoBadge2:"مشتري عائلة", demoBadge3:"وصول عام", demoBadge4:"التحليلات",
    demoCard1Title:"خالد الراشد — بوابة المستثمر", demoCard1Desc:"تجربة مستثمر نخبة — محتوى يركز على العائد على الاستثمار، وعروض بنتهاوس في الطوابق العليا، ولوحة تحليلات استثمارية.",
    demoCard2Title:"أحمد الفهد — بوابة العائلة", demoCard2Desc:"تجربة مشتري العائلة — وحدات ثلاث غرف نوم، مناطق المدارس، الحدائق، مرافق المجتمع، وخطط دفع مناسبة للعائلات.",
    demoCard3Title:"السوق العالمي", demoCard3Desc:"تصفح مجهول مع جمع تدريجي لبيانات العملاء المحتملين — كيف يتحول الزوار العامون إلى مشترين معروفين مع مرور الوقت.",
    demoCard4Title:"لوحة التحكم المؤسسية", demoCard4Desc:"تحليلات سلوكية داخلية — تفاعل في الوقت الفعلي، وتقييم العملاء المحتملين، وتتبع السلوك، ومسارات التحويل.",
    demoCta:"زيارة بيئة العرض التجريبي الكاملة →",

    ucLabel:"حالات الاستخدام", ucTitle:"من إطلاق الأبراج إلى المجتمعات المخططة",
    ucDesc:"يتكيف DynamicNFC مع كل نوع من المشاريع في محفظتك — ولكل منها تجربة خاصة لمشتري كبار الشخصيات.",
    uc1Title:"الأبراج السكنية",
    uc1Desc:"أطلق برجًا مكونًا من 500 وحدة باستخدام مفاتيح وصول لكبار الشخصيات لأفضل 200 عميل محتمل لديك. كل بطاقة تفتح بوابة تعرض الطابق المفضل لديهم واتجاه الإطلالة وخطة الدفع — قبل إجراء أي مكالمة هاتفية. يرى فريق المبيعات من فتح البوابة، وما الذي شاهده، ومن هو الجاهز للتواصل.",
    uc1Tag1:"اختيار الطابق", uc1Tag2:"اتجاه الإطلالة", uc1Tag3:"خطط الدفع", uc1Tag4:"تقييم المشتري",
    uc2Title:"المجتمعات المخططة",
    uc2Desc:"في مشروع مخطط رئيسي يضم 2000 وحدة، تحتاج شرائح المشترين المختلفة إلى تجارب مختلفة. يرى المستثمرون توقعات العائد والإيجارات، بينما ترى العائلات قرب المدارس والحدائق. يوفر DynamicNFC كلا التجربتين من نفس المشروع — مع تحديد الهوية وتتبعها لكل منهما.",
    uc2Tag1:"استهداف الشرائح", uc2Tag2:"إطلاقات مرحلية", uc2Tag3:"مرافق المجتمع", uc2Tag4:"تتبع متعدد المراحل",
    uc3Title:"المساكن ذات العلامة التجارية",
    uc3Desc:"في المساكن الفاخرة ذات العلامة التجارية، يجب أن تتوافق تجربة المبيعات مع العلامة التجارية. تصل مفاتيح الوصول لكبار الشخصيات في صندوق فاخر يعكس هوية العلامة. البوابة الخاصة حصرية ومنسقة وشخصية — بما يتوافق مع مستوى الخدمة الفاخرة التي يتوقعها المشترون.",
    uc3Tag1:"تكامل العلامة التجارية", uc3Tag2:"تجربة خدمة فاخرة", uc3Tag3:"مبيعات بخدمة شخصية", uc3Tag4:"أصحاب الثروات العالية جدًا",
    uc4Title:"مشروعات متعددة الاستخدامات",
    uc4Desc:"لدى مستثمري التجزئة والمستأجرين التجاريين والمشترين السكنيين احتياجات مختلفة تمامًا. ينشئ DynamicNFC بوابات منفصلة داخل المشروع نفسه — كل منها مخصص لما يهم نوع المشتري، وجميعها تغذي لوحة تحكم موحدة.",
    uc4Tag1:"متعدد الشرائح", uc4Tag2:"تجاري وسكني", uc4Tag3:"مستثمر مقابل مستخدم نهائي", uc4Tag4:"تحليلات موحدة",

    partLabel:"نموذج الشراكة", partTitle:"الإطلاق خلال أسابيع. القياس بعدد الزيارات. التوسع إلى محفظة مشاريعك.",
    partDesc:"نعمل إلى جانب فريق المبيعات لديك لتصميم تجربة المشترين من كبار الشخصيات وتنفيذها وتحسينها — بدءًا بمشروع واحد ثم التوسع عبر كل عمليات الإطلاق.",
    part1Title:"تجربة تجريبية لمدة 2–4 أسابيع", part1Desc:"الإطلاق على مشروع واحد مع 100 مفتاح وصول لكبار الشخصيات. قياس الزيارات المحجوزة مقارنة بالمجموعة الضابطة خلال 30 يومًا.", part1Short:"100 مفتاح VIP، مشروع واحد، 30 يوم.",
    part2Title:"تصميم بوابة مخصص", part2Desc:"نصمم بوابات خاصة للمشترين تتوافق مع هوية مشروعك — معارض مخططات الطوابق، الأسعار، المرافق، ودعوات الإجراء.", part2Short:"بوابات تحمل هوية مشروعك.",
    part3Title:"تكامل مع نظام إدارة العملاء", part3Desc:"تغذي المعلومات السلوكية مباشرة أنظمة Salesforce أو HubSpot أو نظام إدارة العملاء الخاص بك. لا يتم استبدال الأنظمة — بل نعزز ما تستخدمه بالفعل.", part3Short:"يتكامل مع Salesforce أو HubSpot أو نظامك.",
    part4Title:"إطلاق على مستوى المحفظة", part4Desc:"بعد إثبات النجاح في مشروع واحد، يتم نشره عبر كامل محفظة مشاريعك. معلومات مشترين مشتركة عبر جميع عمليات الإطلاق. بوابات المشاريع الجديدة تصبح جاهزة خلال أيام.", part4Short:"وسّع لكل مشروع خلال أيام.",

    roiLabel:"لماذا هذا مهم", roiTitle:"سرعة المبيعات، وليس مقاييس المظهر.",
    roiDesc:"هذا لا يتعلق بالنقرات أو لوحات البيانات. بل بشيء واحد: زيادة عدد الزيارات المحجوزة وسرعة اتخاذ القرار.",
    roi1Val:"معرّف", roi1Label:"كل زائر معروف", roi1Sub:"لا زوار مجهولون — كل نقرة مرتبطة بشخص حقيقي",
    roi2Val:"نية", roi2Label:"تقييم سلوكي", roi2Sub:"اعرف من مستعد للشراء، ليس فقط التصفح",
    roi3Val:"فوري", roi3Label:"محفزات مبيعات", roi3Sub:"فريقك يتلقى تنبيهات لحظة عودة العميل",

    faqLabel:"الأسئلة الشائعة للمطورين", faqTitle:"الأسئلة التي سيطرحها فريقك",
    faq1Q:"هل سيستبدل هذا موقعنا الإلكتروني أو نظام إدارة العملاء؟", faq1A:"لا. DynamicNFC يعمل فوق أنظمتك الحالية ويعززها. يبقى موقع مشروعك عامًا. أما بوابة كبار الشخصيات فهي طبقة خاصة لعملاء مختارين — متصلة بنظام إدارة علاقات العملاء لديك.",
    faq2Q:"كيف يتم التعامل مع الموافقة والخصوصية؟", faq2A:"الموافقة صريحة. يتلقى العميل بطاقة فعلية مع رسالة واضحة. اللمس هو الموافقة. لا يوجد تتبع مخفي — يدخل المشتري إلى بوابته الخاصة بإرادته. وهذا يثبت الموافقة والحصرية والثقة قبل حدوث أي تتبع.",
    faq3Q:"ما الذي يتلقاه المشتري فعلياً", faq3A:"صندوق فاخر يحتوي على مفتاح وصول لكبار الشخصيات — بطاقة الاتصال قريب المدى معدنية مصقولة مع رسالة شخصية. ليست منشورًا تسويقيًا. بل دعوة خاصة. عندما يلمس البطاقة، يدخل تجربة ويب مصممة خصيصًا له. لا يتطلب تطبيقًا.",
    faq4Q:"هل يمكن أن يعمل عبر مشاريع متعددة؟", faq4A:"نعم — هذه هي الميزة الأساسية للمطورين. منصة واحدة ولوحة تحكم واحدة، مع تصفية حسب المشروع ورؤى على مستوى المحفظة. معلومات المشترين من مشروع تنتقل إلى المشروع التالي.",
    faq5Q:"كيف نقيس نجاح التجربة؟", faq5A:"مقياس واحد: زيادة عدد الزيارات المحجوزة بين المدعوين من كبار الشخصيات مقارنة بالمجموعة الضابطة. ليس عدد النقرات أو مشاهدات الصفحات. بل نشاط مبيعات حقيقي خلال 30 يومًا من الإطلاق.",
    faq6Q:"ماذا عن المشترين الدوليين؟", faq6A:"تدعم البوابات لغات متعددة وتتكيّف مع موقع المشتري. يمكن للمشروع نفسه خدمة مشترين من دبي ولندن وفانكوفر — كلٌ بلغته المفضلة، وجميعهم يُتابَعون في لوحة التحكم نفسها.",

    ctaLabel:"جاهز للتنفيذ", ctaTitle:"أنت لا توزع بطاقات. أنت تصدر دعوات خاصة.",
    ctaDesc:"حوّل النية الرقمية إلى زخم حقيقي في المبيعات. ابدأ بمشروع واحد و100 مفتاح وصول لكبار الشخصيات. قِس الفرق في الزيارات المحجوزة، ثم وسّع التجربة عبر محفظة مشاريعك.",
    ctaPilot:"ابدأ برنامجًا تجريبيًا →", ctaDemo:"شاهد العرض التجريبي المباشر",

    modalTitle:"ابدأ تجربة للمطورين", modalSub:"أخبرنا عن محفظة مشاريعك وسنصمم تجربة تجريبية مخصصة — 100 مفتاح وصول لكبار الشخصيات في مشروع واحد، تحليلات كاملة، ونتائج قابلة للقياس خلال 30 يومًا.",
    modalSec1:"معلومات الاتصال", modalSec2:"الشركة والمحفظة", modalSec3:"المشروع التجريبي", modalSec4:"تحدي المبيعات",
    modalSubmit:"إرسال طلب التجربة →", modalSubmitting:"جارٍ الإرسال...",
    modalNote:"نرد خلال 24 ساعة. يتم الحفاظ على معلوماتك بسرية تامة.",
    successTitle:"تم إرسال طلب التجربة", successDesc:"شكرًا لك. سيقوم فريق شراكات المطورين لدينا بمراجعة تفاصيل محفظتك والتواصل معك خلال 24 ساعة.",
    successClose:"إغلاق",
    closeLabel:"إغلاق الحوار",

    fldName:'الاسم الكامل', fldEmail:'البريد الإلكتروني', fldPhone:'الهاتف', fldCompany:'الشركة', fldRole:'الدور',
    fldSelectRole:'اختر الدور', fldCeo:'الرئيس التنفيذي / رئيس مجلس الإدارة', fldCso:'رئيس المبيعات', fldCmo:'رئيس التسويق',
    fldVpSales:'نائب رئيس المبيعات', fldVpDev:'نائب رئيس التطوير', fldDirSales:'مدير المبيعات', fldDirMkt:'مدير التسويق',
    fldGm:'المدير العام', fldOther:'أخرى',
    fldActiveProjects:'المشاريع النشطة', fldHowMany:'كم عدد المشاريع؟',
    fldProj13:'1 – 3 مشاريع', fldProj410:'4 – 10 مشاريع', fldProj1025:'10 – 25 مشروع', fldProj25:'25+ مشروع',
    fldMarkets:'الأسواق', fldMarketsHint:'مثال: فانكوفر، دبي، لندن',
    fldPilotProject:'اسم المشروع التجريبي', fldProjectType:'نوع المشروع', fldSelectType:'اختر النوع',
    fldTower:'برج سكني', fldMasterPlan:'مجتمع مخطط', fldBranded:'مساكن ذات علامة تجارية',
    fldVilla:'فلل فاخرة', fldMixedUse:'مشروع متعدد الاستخدامات', fldCommercial:'تجاري',
    fldTotalUnits:'إجمالي الوحدات', fldSelectRange:'اختر النطاق',
    fldUnder50:'أقل من 50', fld50200:'50 – 200', fld200500:'200 – 500', fld5002000:'500 – 2,000', fld2000:'2,000+',
    fldLocation:'موقع المشروع',
    fldChallenge:'أكبر تحدٍّ في المبيعات عبر المشاريع؟', fldSelectChallenge:'اختر التحدي',
    fldCh1:'زيارات مجهولة — لا يمكن تحديد المشترين', fldCh2:'بطء من الاهتمام إلى أول تواصل',
    fldCh3:'تواصل عام — عرض واحد لجميع المشترين', fldCh4:'فريق المبيعات يفتقر لسياق المشتري',
    fldCh5:'لا توجد رؤى على مستوى المحفظة', fldCh6:'تحويل منخفض من العملاء إلى زيارات محجوزة',
    fldCh7:'تكاليف إعداد متكررة لكل إطلاق',
    fldNotes:'ملاحظات', fldNotesHint:'أخبرنا عن محفظتك وتحديات المبيعات الحالية أو أهداف التجربة...',
    fldError:'حدث خطأ. يرجى المحاولة مرة أخرى.',

    footerText:"© 2026 DynamicNFC — محرك تسريع المبيعات لمطوري العقارات",
  },
};

const DEV_SECTION_NAV = [
  { id: 'challenge', labelKey: 'navChallenge' },
  { id: 'shift', labelKey: 'navShift' },
  { id: 'how', labelKey: 'navHow' },
  { id: 'diff', labelKey: 'navDiff' },
  { id: 'portfolio', labelKey: 'navPortfolio' },
  { id: 'usecases', labelKey: 'navUseCases' },
  { id: 'partnership', labelKey: 'navPartnership' },
  { id: 'roi', labelKey: 'navRoi' },
  { id: 'faq', labelKey: 'navFaq' },
  { id: 'live-demo', labelKey: 'navDemo' },
  { id: 'cta', labelKey: 'navPilot' },
];

function DevSvg({ children, size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

const DEV_CHALLENGE_ICONS = [
  <DevSvg key="c1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></DevSvg>,
  <DevSvg key="c2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></DevSvg>,
  <DevSvg key="c3"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></DevSvg>,
];

const DEV_HOW_ICONS = [
  <DevSvg key="h1"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></DevSvg>,
  <DevSvg key="h2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></DevSvg>,
  <DevSvg key="h3"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></DevSvg>,
  <DevSvg key="h4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></DevSvg>,
];

const DEV_PORT_ICONS = [
  <DevSvg key="p1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></DevSvg>,
  <DevSvg key="p2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></DevSvg>,
  <DevSvg key="p3"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></DevSvg>,
];

const DEV_PART_ICONS = [
  <DevSvg key="pa1"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></DevSvg>,
  <DevSvg key="pa2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></DevSvg>,
  <DevSvg key="pa3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></DevSvg>,
  <DevSvg key="pa4"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></DevSvg>,
];

const DEV_UC_ICONS = [
  <DevSvg key="uc1"><path d="M3 21h18" /><path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" /><path d="M9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01M9 15h.01M12 15h.01M15 15h.01" /></DevSvg>,
  <DevSvg key="uc2"><path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></DevSvg>,
  <DevSvg key="uc3"><path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.65-7 11-7 11z" /><path d="M9.5 10.5l5 5" /><path d="M14.5 10.5l-5 5" /></DevSvg>,
  <DevSvg key="uc4"><path d="M7 3h10" /><path d="M12 3v18" /><path d="M7 21h10" /><path d="M3 7h18" /><path d="M3 17h18" /></DevSvg>,
];

export default function Developers() {
  const { lang } = useLanguage();
  const [openUc, setOpenUc] = useState(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
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
    data._subject = `Developer Pilot Request — ${data.company} / ${data.project}`;
    try {
      await fetch('/contact-form', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'developer_pilot',
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
      <SEO title={t('seoTitle')} description={t('seoDesc')} path="/developers" />
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
        <div className="ent-hero-ctas dev-scroll-target" id="live-demo">
          <button className="ent-btn-primary" onClick={openPilot}>{t('heroCtaPilot')}</button>
          <Link to="/enterprise/crmdemo/dashboard" className="ent-btn-secondary" style={{ textDecoration: 'none' }}>{t('heroCtaDemo')}</Link>
        </div>
      </section>

      <nav className="dev-section-nav" aria-label={lang === 'ar' ? 'أقسام الصفحة' : 'Page sections'}>
        <div className="dev-section-nav-inner">
          {DEV_SECTION_NAV.map(({ id, labelKey }) => (
            <button type="button" key={id} className="dev-section-nav-btn" onClick={() => scrollTo(id)}>
              {t(labelKey)}
            </button>
          ))}
        </div>
      </nav>

      <div className="ent-divider" />

      {/* THE BLIND SPOT — Pitch Deck p.2 */}
      <section className="ent-section ent-problem ent-reveal dev-scroll-target" id="challenge">
        <div className="ent-section-label red">{t('challLabel')}</div>
        <div className="ent-section-title">{t('challTitle')}</div>
        <div className="dev-blind-strip">
          {[1, 2, 3].map(i => (
            <div className="dev-blind-item" key={i}>
              <div className="dev-blind-icon">{DEV_CHALLENGE_ICONS[i - 1]}</div>
              <h4>{t(`chall${i}Title`)}</h4>
              <p>{t(`chall${i}Short`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ ROI CALCULATOR CTA ═══ */}
      <section className="re-roi-banner ent-reveal">
        <div className="re-roi-banner-glow" />
        <div className="re-roi-banner-content">
          <div className="re-roi-banner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          <Link to="/sales/roi-calculator" className="re-roi-banner-btn">
            {t('roiBannerCta')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE SHIFT — Pitch Deck p.3 */}
      <section className="ent-section ent-reveal dev-scroll-target" id="shift">
        <div className="ent-section-label gold">{t('shiftLabel')}</div>
        <div className="ent-section-title">{t('shiftTitle')}</div>
        <p className="ent-section-desc">{t('shiftDesc')}</p>
        <div className="ent-shift-grid">
          <div className="ent-shift-box old">
            <div className="ent-shift-box-label">{t('oldLabel')}</div>
            <h3>{t('oldTitle')}</h3>
            <ul>{['old1','old2','old3','old4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
          <div className="ent-shift-arrow"><ArrowIcon /></div>
          <div className="ent-shift-box new">
            <div className="ent-shift-box-label">{t('newLabel')}</div>
            <h3>{t('newTitle')}</h3>
            <ul>{['new1','new2','new3','new4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* HOW IT WORKS — Pitch Deck p.4-5 */}
      <section className="ent-section ent-reveal dev-scroll-target" id="how">
        <div className="ent-section-label teal">{t('howLabel')}</div>
        <div className="ent-section-title">{t('howTitle')}</div>
        <p className="ent-section-desc">{t('howDesc')}</p>
        <div className="ent-steps-row">
          {[1, 2, 3, 4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num dev-step-num-icon">{DEV_HOW_ICONS[i - 1]}</div>
              <h4>{t(`how${i}Title`)}</h4>
              <p>{t(`how${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* VIP vs ANONYMOUS — Pitch Deck p.6 */}
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

      {/* PORTFOLIO SCALE — Developer-specific */}
      <section className="ent-section ent-reveal dev-scroll-target" id="portfolio">
        <div className="dev-port-strip">
          <div className="dev-port-left">
            <div className="ent-section-label gold">{t('portLabel')}</div>
            <h3 className="dev-port-title">{t('portTitle')}</h3>
            <p className="dev-port-desc">{t('portDesc')}</p>
          </div>
          <ul className="dev-port-list">
            {[1, 2, 3].map(i => (
              <li key={i} className="dev-port-item">
                <span className="dev-port-check">✓</span>
                <div>
                  <strong>{t(`port${i}Title`)}</strong>
                  <span className="dev-port-sub">{t(`port${i}Desc`)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="ent-divider" />

      {/* USE CASES */}
      <section className="ent-section ent-reveal dev-scroll-target" id="usecases">
        <div className="ent-section-label teal">{t('ucLabel')}</div>
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
                  id={`dev-uc-q-${i}`}
                  className="dev-uc-header"
                  onClick={() => setOpenUc(expanded ? null : i)}
                  aria-expanded={expanded}
                  aria-controls={`dev-uc-a-${i}`}
                >
                  <span className="dev-uc-icon" aria-hidden>
                    {DEV_UC_ICONS[i - 1]}
                  </span>
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
                  id={`dev-uc-a-${i}`}
                  role="region"
                  aria-labelledby={`dev-uc-q-${i}`}
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
        <div className="ent-section-label gold">{t('partLabel')}</div>
        <div className="ent-section-title">{t('partTitle')}</div>
        <p className="ent-section-desc">{t('partDesc')}</p>
        <div className="dev-part-grid" role="list">
          {[1, 2, 3, 4].map((i) => (
            <div className="dev-part-card" key={i} role="listitem">
              <div className="dev-part-icon" aria-hidden>{DEV_PART_ICONS[i - 1]}</div>
              <h4 className="dev-part-title">{t(`part${i}Title`)}</h4>
              <p className="dev-part-sub">{t(`part${i}Short`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ROI — Pitch Deck p.7 */}
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
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const expanded = openFaq === i;
            return (
              <div className="dev-faq-item" key={i} role="listitem">
                <button
                  type="button"
                  id={`dev-faq-q-${i}`}
                  className="dev-faq-q-btn"
                  aria-expanded={expanded}
                  aria-controls={`dev-faq-a-${i}`}
                  onClick={() => setOpenFaq(expanded ? null : i)}
                >
                  <span className="dev-faq-q-text">{t(`faq${i}Q`)}</span>
                  <span className="dev-faq-chevron" aria-hidden>{expanded ? '−' : '+'}</span>
                </button>
                <div
                  id={`dev-faq-a-${i}`}
                  role="region"
                  aria-labelledby={`dev-faq-q-${i}`}
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

      {/* CTA — Pitch Deck p.8 */}
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
      <div className={`ent-pilot-backdrop${pilotOpen ? ' open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="pilot-modal-title" onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="ent-pilot-modal">
          <div className="ent-pilot-header">
            <h3 id="pilot-modal-title">{t('modalTitle')}</h3>
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
              <input type="hidden" name="form_type" value="developer_pilot" />

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
                    <option value="ceo">{t('fldCeo')}</option>
                    <option value="cso">{t('fldCso')}</option>
                    <option value="cmo">{t('fldCmo')}</option>
                    <option value="vp-sales">{t('fldVpSales')}</option>
                    <option value="vp-dev">{t('fldVpDev')}</option>
                    <option value="director-sales">{t('fldDirSales')}</option>
                    <option value="director-marketing">{t('fldDirMkt')}</option>
                    <option value="gm">{t('fldGm')}</option>
                    <option value="other">{t('fldOther')}</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldActiveProjects')}</label>
                  <select className="ent-pilot-select" name="activeProjects" defaultValue="">
                    <option value="" disabled>{t('fldHowMany')}</option>
                    <option value="1-3">{t('fldProj13')}</option>
                    <option value="4-10">{t('fldProj410')}</option>
                    <option value="10-25">{t('fldProj1025')}</option>
                    <option value="25+">{t('fldProj25')}</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldMarkets')}</label>
                  <input className="ent-pilot-input" type="text" name="markets" placeholder={t('fldMarketsHint')} />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec3')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldPilotProject')} <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="project" required aria-required="true" />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldProjectType')} <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="projectType" required aria-required="true" defaultValue="">
                    <option value="" disabled>{t('fldSelectType')}</option>
                    <option value="tower-highrise">{t('fldTower')}</option>
                    <option value="master-plan">{t('fldMasterPlan')}</option>
                    <option value="branded-residences">{t('fldBranded')}</option>
                    <option value="luxury-villa">{t('fldVilla')}</option>
                    <option value="mixed-use">{t('fldMixedUse')}</option>
                    <option value="commercial">{t('fldCommercial')}</option>
                    <option value="other">{t('fldOther')}</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldTotalUnits')}</label>
                  <select className="ent-pilot-select" name="totalUnits" defaultValue="">
                    <option value="" disabled>{t('fldSelectRange')}</option>
                    <option value="under-50">{t('fldUnder50')}</option>
                    <option value="50-200">{t('fld50200')}</option>
                    <option value="200-500">{t('fld200500')}</option>
                    <option value="500-2000">{t('fld5002000')}</option>
                    <option value="2000+">{t('fld2000')}</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">{t('fldLocation')}</label>
                  <input className="ent-pilot-input" type="text" name="location" />
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
                  <option value="no-portfolio-view">{t('fldCh5')}</option>
                  <option value="low-viewings">{t('fldCh6')}</option>
                  <option value="repeated-setup">{t('fldCh7')}</option>
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
              <Link to="/developers">{isRTL ? 'المطورين والوكلاء' : 'Developers & Agents'}</Link>
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

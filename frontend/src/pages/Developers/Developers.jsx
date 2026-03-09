import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Developers.css';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Real Estate Developers — Sales Velocity Engine
   Pitch-Deck Aligned: Identity → Intent → Viewings
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* Nav */
    navChallenge:'The Challenge', navShift:'The Shift', navHow:'How It Works', navDemo:'Live Demo', navUseCases:'Use Cases', navPilot:'Start a Pilot',

    /* Hero */
    heroBadge:'Sales Velocity Engine for Real Estate Developers',
    heroTitle:'Identity Precedes Action. Action Drives Sales.',
    heroSub:'DynamicNFC turns your project websites into private, invitation-only buyer experiences. You know WHO is browsing before you know WHAT they do — and that changes everything about how your sales team closes.',
    stat1Val:'47%', stat1Label:'Higher Engagement', stat2Val:'3.2×', stat2Label:'Conversion to Viewing', stat3Val:'100%', stat3Label:'Identified Buyers',
    heroCtaPilot:'Start a Pilot Program →', heroCtaDemo:'See the Live Demo',

    /* The Blind Spot (Pitch Deck p.2) */
    challLabel:'The Blind Spot', challTitle:'Your Buyers Are Ready. Your Sales Team Doesn\'t Know It.',
    challQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options on your project website. Yet when your sales team picks up the phone, they lack one critical thing: <strong>context</strong>. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Icon:'👥', chall1Title:'Anonymous Traffic', chall1Desc:'Thousands visit your project website. You see page views — but you don\'t know if that visitor is a $5M investor or a casual browser.',
    chall2Icon:'🕐', chall2Title:'Delayed Follow-Up', chall2Desc:'By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.',
    chall3Icon:'📋', chall3Title:'Generic Outreach', chall3Desc:'Every buyer gets the same brochure, the same tour, the same call script. A penthouse investor and a first-time family buyer hear the same pitch.',

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
    how1Icon:'🎯', how1Title:'VIP Campaign Selection', how1Desc:'Your sales team selects 100–200 high-value prospects per project — investors, repeat buyers, referrals, broker-referred VIPs. Each gets a named VIP Access Key.',
    how2Icon:'📦', how2Title:'Premium Box Delivery', how2Desc:'The Access Key arrives in a premium box with a personalized message. This is not a marketing flyer — it is a private invitation. The physical touch creates exclusivity and trust before any tracking happens.',
    how3Icon:'📱', how3Title:'Tap to Private Portal', how3Desc:'When the buyer taps their card, they access a private experience tailored to their profile — floor plans, pricing, payment options, amenities. No app required. No login. One tap.',
    how4Icon:'📊', how4Title:'Behavioral Intelligence', how4Desc:'Every action inside the portal — floor plans viewed, pricing downloaded, viewings requested — feeds your sales dashboard in real time. Your team knows exactly who is ready and what they want.',

    /* Key Difference (Pitch Deck p.6) */
    diffLabel:'The Key Difference', diffTitle:'Same Website. Same Actions. Different Intelligence.',
    diffDesc:'Inside the experience, buyers are free to do whatever they want — book a viewing, request pricing, explore payment plans, download brochures. There is no forced funnel. The only difference is identity.',
    diffVipTitle:'VIP Buyer (Known Identity)', diffVipDesc:'We know who they are. That enables personal follow-ups, tailored incentives, and concierge-level sales. Your team calls with context: "I see you\'ve been looking at 2BR units on floors 30-40 with city views — we have two left at the pre-launch price."',
    diffAnonTitle:'Public Visitor (Anonymous)', diffAnonDesc:'We learn at a segment level and optimize marketing. Which floor plans get the most attention? What price range drives downloads? Same website, same actions — but different intelligence that drives different decisions.',

    /* Portfolio Scale — Developer-specific differentiation */
    portLabel:'Portfolio Scale', portTitle:'One Platform. Every Project. Cross-Portfolio Intelligence.',
    portDesc:'Unlike single-project tools, DynamicNFC deploys across your entire portfolio. Buyer intelligence from Project A carries to Project B. A prospect who viewed penthouses in Tower One gets penthouse-first content when Tower Two launches.',
    port1Icon:'🏗️', port1Title:'Deploy Once, Scale Everywhere', port1Desc:'Configure the platform once. Launch new project portals in days — not months. Same dashboard, new project, shared buyer intelligence.',
    port2Icon:'📊', port2Title:'Cross-Project Buyer Signals', port2Desc:'A buyer who engaged with your downtown tower also gets flagged when your waterfront project launches. Portfolio-level insights that single-project tools can\'t provide.',
    port3Icon:'🔄', port3Title:'Eliminate Repeated Setup', port3Desc:'No more rebuilding sales infrastructure for every new launch. Your templates, buyer segments, and analytics framework carry forward.',

    /* Live Demo */
    demoLabel:'Live Demo', demoTitle:'See It In Action — Vista Residences',
    demoDesc:'Explore a working demo built for a fictional luxury tower project. See how different buyer profiles receive completely different experiences from the same platform.',
    demoBadge1:'★ VIP Investor', demoBadge2:'🏠 Family Buyer', demoBadge3:'🌐 Public Access', demoBadge4:'📊 Analytics',
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
    part1Icon:'🚀', part1Title:'2–4 Week Pilot', part1Desc:'Launch on one project with 100 VIP Access Keys. Measure booked viewings against your control group within 30 days.',
    part2Icon:'📐', part2Title:'Custom Portal Design', part2Desc:'We design private buyer portals that match your project branding — floor plan galleries, pricing, amenities, calls-to-action.',
    part3Icon:'🔗', part3Title:'CRM Integration', part3Desc:'Behavioral intelligence feeds directly into Salesforce, HubSpot, or your custom CRM. No system replacement — we enhance what you already use.',
    part4Icon:'🏢', part4Title:'Portfolio Rollout', part4Desc:'Once proven on one project, deploy across your entire portfolio. Shared buyer intelligence across all launches. New project portals go live in days.',

    /* ROI (Pitch Deck p.7) */
    roiLabel:'Why This Matters', roiTitle:'Sales Velocity, Not Vanity Metrics.',
    roiDesc:'This is not about clicks or dashboards. It\'s about one thing: an increase in booked viewings and decision speed.',
    roi1Val:'3.2×', roi1Label:'Conversion to Viewing', roi1Sub:'VIP invitees vs. anonymous traffic',
    roi2Val:'47%', roi2Label:'Faster Decision Cycle', roi2Sub:'From first portal access to booked viewing',
    roi3Val:'100%', roi3Label:'Identified Engagement', roi3Sub:'Every interaction linked to a named buyer',

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

    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Developers',
  },

  ar: {
    navChallenge:'التحدي', navShift:'التحوّل', navHow:'كيف يعمل', navDemo:'عرض حي', navUseCases:'حالات الاستخدام', navPilot:'ابدأ تجربة',
    heroBadge:'محرك تسريع المبيعات لمطوري العقارات',
    heroTitle:'الهوية تسبق الفعل. الفعل يقود المبيعات.',
    heroSub:'DynamicNFC تحوّل مواقع مشاريعك إلى تجارب خاصة بدعوة فقط. تعرف من يتصفح قبل أن تعرف ماذا يفعل — وهذا يغير كل شيء عن كيفية إغلاق فريق مبيعاتك للصفقات.',
    stat1Val:'٤٧٪', stat1Label:'تفاعل أعلى', stat2Val:'٣.٢×', stat2Label:'تحويل للمعاينة', stat3Val:'١٠٠٪', stat3Label:'مشترون معرّفون',
    heroCtaPilot:'ابدأ برنامج تجريبي →', heroCtaDemo:'شاهد العرض الحي',

    challLabel:'النقطة العمياء', challTitle:'مشتروك جاهزون. فريق مبيعاتك لا يعلم.',
    challQuote:'أكثر المشترين اهتماماً يقضون أسابيع في استكشاف المخططات والأسعار وخيارات الدفع على موقع مشروعك. لكن عندما يرفع فريق المبيعات الهاتف، ينقصه شيء واحد حاسم: <strong>السياق</strong>. لا يعرفون من مستعد، ما يهمهم أكثر، أو متى يتصرفون.',
    chall1Icon:'👥', chall1Title:'زوار مجهولون', chall1Desc:'آلاف يزورون موقع المشروع. ترى الزيارات — لكن لا تعرف إن كان الزائر مستثمراً بـ 5 ملايين أو متصفحاً عابراً.',
    chall2Icon:'🕐', chall2Title:'متابعة متأخرة', chall2Desc:'بحلول وقت تواصل فريق المبيعات، يكون المشتري قد فقد حماسه. الفجوة واسعة جداً.',
    chall3Icon:'📋', chall3Title:'تواصل عام', chall3Desc:'كل مشترٍ يحصل على نفس الكتيب، نفس الجولة، نفس النص. مستثمر البنتهاوس والعائلة يسمعون نفس العرض.',

    shiftLabel:'التحوّل', shiftTitle:'من موقع عام إلى دعوة خاصة',
    shiftDesc:'ماذا لو توقفت عن معاملة موقع مشروعك كنشرة إعلانية، وبدلاً من ذلك عاملته كتجربة خاصة لعملاء مختارين؟ ليس للجميع — فقط من تدعوهم عمداً.',
    oldLabel:'الطريقة القديمة', oldTitle:'موقع مشروع عام', oldDesc:'موقع واحد للجميع. زوار مجهولون. لا هوية. فريق المبيعات يتصل أعمى.',
    old1:'نفس التجربة لكل الزوار', old2:'لا طريقة لتحديد المشترين المهتمين', old3:'فريق المبيعات يفتقر السياق', old4:'متابعة مبنية على التخمين',
    newLabel:'الطريقة الديناميكية', newTitle:'تجارب VIP خاصة', newDesc:'كل عميل يتلقى مفتاح وصول VIP — دعوة مادية لبوابته الخاصة.',
    new1:'محتوى مخصص لكل مشترٍ', new2:'الهوية معروفة قبل أول نقرة', new3:'فريق المبيعات يتصل بسياق كامل', new4:'متابعة مؤقتة بإشارات المشتري',

    howLabel:'كيف يعمل', howTitle:'من الصندوق الفاخر إلى حجز المعاينة',
    howDesc:'العملاء المختارون يتلقون صندوقاً فاخراً مع مفتاح VIP ورسالة شخصية: "هذه البطاقة تفتح تجربة خاصة صُممت خصيصاً لك." عندما يلمسون، يدخلون. عندما يتصفحون، أنت تعلم.',
    how1Icon:'🎯', how1Title:'اختيار حملة VIP', how1Desc:'فريق مبيعاتك يختار 100-200 عميل ذوي قيمة عالية لكل مشروع. كل واحد يحصل على مفتاح VIP مُسمّى.',
    how2Icon:'📦', how2Title:'توصيل الصندوق الفاخر', how2Desc:'مفتاح الوصول يصل في صندوق فاخر مع رسالة شخصية. ليس منشوراً تسويقياً — دعوة خاصة.',
    how3Icon:'📱', how3Title:'لمس للبوابة الخاصة', how3Desc:'عندما يلمس المشتري بطاقته، يصل إلى تجربة خاصة مصممة لملفه — مخططات وأسعار وخيارات دفع. بدون تطبيق.',
    how4Icon:'📊', how4Title:'ذكاء سلوكي', how4Desc:'كل إجراء داخل البوابة يغذي لوحة المبيعات لحظياً. فريقك يعرف بالضبط من مستعد وماذا يريد.',

    diffLabel:'الفرق الجوهري', diffTitle:'نفس الموقع. نفس الإجراءات. ذكاء مختلف.',
    diffDesc:'داخل التجربة، المشترون أحرار في فعل ما يشاءون — حجز معاينة، طلب أسعار، استكشاف خطط الدفع. لا قمع إجباري. الفرق الوحيد هو الهوية.',
    diffVipTitle:'مشتري VIP (هوية معروفة)', diffVipDesc:'نعرف من هم. هذا يمكّن المتابعة الشخصية والحوافز المخصصة والمبيعات على مستوى الكونسيرج.',
    diffAnonTitle:'زائر عام (مجهول)', diffAnonDesc:'نتعلم على مستوى الشريحة ونحسّن التسويق. نفس الموقع، نفس الإجراءات — لكن ذكاء مختلف يقود قرارات مختلفة.',

    portLabel:'نطاق المحفظة', portTitle:'منصة واحدة. كل مشروع. ذكاء عبر المحفظة.',
    portDesc:'على عكس أدوات المشروع الواحد، DynamicNFC تنتشر عبر محفظتك بالكامل. ذكاء المشتري من المشروع أ ينتقل للمشروع ب.',
    port1Icon:'🏗️', port1Title:'انشر مرة، توسع في كل مكان', port1Desc:'هيئ المنصة مرة واحدة. أطلق بوابات مشاريع جديدة في أيام — ليس أشهر.',
    port2Icon:'📊', port2Title:'إشارات مشتري عبر المشاريع', port2Desc:'مشتري تفاعل مع برجك وسط المدينة يُوسم أيضاً عند إطلاق مشروع الواجهة البحرية.',
    port3Icon:'🔄', port3Title:'تخلص من الإعداد المتكرر', port3Desc:'لا مزيد من إعادة بناء البنية لكل إطلاق. القوالب والشرائح والتحليلات تنتقل معك.',

    demoLabel:'عرض حي', demoTitle:'شاهده عملياً — فيستا ريزيدنسز',
    demoDesc:'استكشف عرضاً حياً لمشروع برج فاخر خيالي. شاهد كيف تحصل ملفات مشترين مختلفة على تجارب مختلفة تماماً.',
    demoBadge1:'★ مستثمر VIP', demoBadge2:'🏠 مشترٍ عائلي', demoBadge3:'🌐 وصول عام', demoBadge4:'📊 التحليلات',
    demoCard1Title:'خالد الراشد — بوابة المستثمر', demoCard1Desc:'تجربة مستثمر نخبوية — محتوى عائد استثماري، بنتهاوس، تحليلات.',
    demoCard2Title:'أحمد الفهد — بوابة العائلة', demoCard2Desc:'تجربة مشتري عائلي — وحدات 3 غرف، مدارس، مرافق، خطط دفع.',
    demoCard3Title:'السوق العالمي', demoCard3Desc:'تصفح مجهول مع التقاط تدريجي — كيف يصبح الزوار مشترين معروفين.',
    demoCard4Title:'لوحة الشركة', demoCard4Desc:'تحليلات سلوكية داخلية — تفاعل لحظي، تسجيل عملاء، تتبع سلوك.',
    demoCta:'زر بيئة العرض الكاملة →',

    ucLabel:'حالات الاستخدام', ucTitle:'من إطلاق الأبراج إلى المجتمعات المخططة',
    ucDesc:'DynamicNFC تتكيف مع كل نوع مشروع في محفظتك — كل واحد بتجربة VIP خاصة.',
    uc1Title:'الأبراج السكنية',
    uc1Desc:'أطلق برجاً من 500 وحدة مع مفاتيح VIP لأفضل 200 عميل. كل بطاقة تفتح بوابة تعرض الطابق المفضل واتجاه الإطلالة وخطة الدفع — قبل أي مكالمة.',
    uc1Tag1:'اختيار الطابق', uc1Tag2:'اتجاه الإطلالة', uc1Tag3:'خطط الدفع', uc1Tag4:'تسجيل المشتري',
    uc2Title:'المجتمعات المخططة',
    uc2Desc:'عبر مخطط من 2000 وحدة، شرائح مختلفة تحتاج تجارب مختلفة. المستثمرون يرون العائد. العائلات ترى المدارس. DynamicNFC تقدم الاثنين — كل مشترٍ معرّف ومتتبع.',
    uc2Tag1:'استهداف الشرائح', uc2Tag2:'إطلاقات مرحلية', uc2Tag3:'مرافق المجتمع', uc2Tag4:'تتبع متعدد المراحل',
    uc3Title:'المساكن ذات العلامات التجارية',
    uc3Desc:'لمساكن الفخامة، تجربة البيع يجب أن تطابق العلامة. مفاتيح VIP تصل في صندوق يعكس لغة تصميم العلامة — حصري ومنسق وشخصي.',
    uc3Tag1:'تكامل العلامة', uc3Tag2:'تجربة فاخرة', uc3Tag3:'مبيعات كونسيرج', uc3Tag4:'أصحاب الثروات العالية',
    uc4Title:'المشاريع متعددة الاستخدامات',
    uc4Desc:'مستثمرو التجزئة والمستأجرون التجاريون والمشترون السكنيون لديهم احتياجات مختلفة جذرياً. DynamicNFC تنشئ بوابات متميزة داخل نفس المشروع.',
    uc4Tag1:'متعدد الشرائح', uc4Tag2:'تجاري وسكني', uc4Tag3:'مستثمر مقابل مستخدم', uc4Tag4:'تحليلات موحدة',

    partLabel:'نموذج الشراكة', partTitle:'أطلق في أسابيع. قِس بالمعاينات. توسع في محفظتك.',
    partDesc:'نعمل مع فريق مبيعاتك لتصميم ونشر وتحسين تجربة VIP — بدءاً من مشروع واحد، ثم التوسع عبر كل إطلاق.',
    part1Icon:'🚀', part1Title:'تجربة 2-4 أسابيع', part1Desc:'أطلق على مشروع واحد مع 100 مفتاح VIP. قِس المعاينات خلال 30 يوماً.',
    part2Icon:'📐', part2Title:'تصميم بوابة مخصص', part2Desc:'نصمم بوابات خاصة تطابق علامة مشروعك — معارض مخططات وأسعار ودعوات.',
    part3Icon:'🔗', part3Title:'تكامل CRM', part3Desc:'الذكاء السلوكي يغذي Salesforce أو HubSpot أو CRM مخصص مباشرة.',
    part4Icon:'🏢', part4Title:'نشر المحفظة', part4Desc:'بمجرد الإثبات، انشر عبر محفظتك. ذكاء مشتري مشترك عبر كل الإطلاقات.',

    roiLabel:'لماذا هذا مهم', roiTitle:'سرعة المبيعات، ليس مقاييس التفاخر.',
    roiDesc:'ليس عن النقرات أو اللوحات. عن شيء واحد: زيادة المعاينات المحجوزة وسرعة القرار.',
    roi1Val:'٣.٢×', roi1Label:'تحويل للمعاينة', roi1Sub:'مدعوّو VIP مقابل حركة مجهولة',
    roi2Val:'٤٧٪', roi2Label:'دورة قرار أسرع', roi2Sub:'من أول وصول للبوابة إلى معاينة',
    roi3Val:'١٠٠٪', roi3Label:'تفاعل معرّف', roi3Sub:'كل تفاعل مرتبط بمشترٍ مُسمّى',

    faqLabel:'أسئلة المطورين', faqTitle:'أسئلة سيطرحها فريقك',
    faq1Q:'هل هذا يستبدل موقعنا أو CRM؟', faq1A:'لا. DynamicNFC تجلس فوق أنظمتكم وتعززها. موقع المشروع يبقى عاماً. بوابة VIP طبقة خاصة.',
    faq2Q:'كيف تُعالج الموافقة والخصوصية؟', faq2A:'الموافقة صريحة. العميل يتلقى بطاقة مادية برسالة واضحة. اللمس هو الموافقة. لا تتبع خفي.',
    faq3Q:'ماذا يتلقى المشتري فعلياً؟', faq3A:'صندوق فاخر مع مفتاح VIP — بطاقة NFC معدنية مع رسالة شخصية. ليس منشوراً تسويقياً. دعوة خاصة.',
    faq4Q:'هل يعمل عبر مشاريع متعددة؟', faq4A:'نعم — هذه الميزة الأساسية للمطورين. منصة واحدة، لوحة واحدة، ذكاء مشتري ينتقل عبر المشاريع.',
    faq5Q:'كيف نقيس نجاح التجربة؟', faq5A:'مقياس واحد: زيادة المعاينات المحجوزة بين مدعوّي VIP مقابل مجموعة التحكم خلال 30 يوماً.',
    faq6Q:'ماذا عن المشترين الدوليين؟', faq6A:'البوابات تدعم لغات متعددة وتتكيف مع موقع المشتري. نفس المشروع يخدم دبي ولندن وفانكوفر.',

    ctaLabel:'جاهز للنشر', ctaTitle:'أنت لا توزع بطاقات. أنت تصدر دعوات خاصة.',
    ctaDesc:'حوّل النية الرقمية إلى زخم مبيعات حقيقي. ابدأ بمشروع واحد و100 مفتاح VIP. قِس الفرق في المعاينات. ثم توسع في محفظتك.',
    ctaPilot:'ابدأ برنامج تجريبي →', ctaDemo:'شاهد العرض الحي',

    modalTitle:'ابدأ تجربة مطور', modalSub:'أخبرنا عن محفظتك وسنصمم تجربة مخصصة — 100 مفتاح VIP على مشروع واحد، تحليلات كاملة، نتائج قابلة للقياس خلال 30 يوماً.',
    modalSec1:'معلومات الاتصال', modalSec2:'الشركة والمحفظة', modalSec3:'مشروع التجربة', modalSec4:'تحدي المبيعات',
    modalSubmit:'إرسال طلب التجربة →', modalSubmitting:'جارٍ الإرسال...',
    modalNote:'نرد خلال 24 ساعة. معلوماتك سرية تماماً.',
    successTitle:'تم إرسال الطلب', successDesc:'شكراً لك. سيتواصل فريق شراكات المطورين خلال 24 ساعة.',
    successClose:'إغلاق',
    footerText:'© 2026 DynamicNFC — محرك تسريع المبيعات لمطوري العقارات',
  },
};

export default function Developers() {
  const [lang, setLang] = useState('en');
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

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
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
    } catch { alert('Error submitting. Please try again.'); }
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
      <div className="ent-bg-mesh" />
      <div className="ent-particles">
        {particles.map((p, i) => <div key={i} className="ent-particle" style={p} />)}
      </div>

      {/* NAV */}
      <nav className="ent-nav">
        <div className="ent-nav-inner">
          <Link to="/" className="ent-nav-brand">
            <div className="ent-nav-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" /><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
                <path d="M12.91 4.1c3.85 4.7 3.85 11.1 0 15.8" />
              </svg>
            </div>
            <span className="ent-nav-brand-text">Dynamic<span>NFC</span></span>
          </Link>
          <div className="ent-nav-links">
            <button className="ent-nav-link" onClick={() => scrollTo('challenge')}>{t('navChallenge')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('shift')}>{t('navShift')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('how')}>{t('navHow')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('demo')}>{t('navDemo')}</button>
            <button className="ent-nav-link" onClick={() => scrollTo('usecases')}>{t('navUseCases')}</button>
            <button className="ent-nav-cta" onClick={openPilot}>{t('navPilot')}</button>
            <div className="ent-lang">
              <button className={`ent-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`ent-lang-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>ع</button>
            </div>
          </div>
        </div>
      </nav>

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
          <button className="ent-btn-secondary" onClick={() => scrollTo('demo')}>{t('heroCtaDemo')}</button>
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE BLIND SPOT — Pitch Deck p.2 */}
      <section className="ent-section ent-problem ent-reveal" id="challenge">
        <div className="ent-section-label red">{t('challLabel')}</div>
        <div className="ent-section-title">{t('challTitle')}</div>
        <p className="ent-problem-quote" dangerouslySetInnerHTML={{ __html: t('challQuote') }} />
        <div className="ent-problem-cards">
          {[1, 2, 3].map(i => (
            <div className="ent-problem-card" key={i}>
              <div className="ent-problem-card-icon">{t(`chall${i}Icon`)}</div>
              <h4>{t(`chall${i}Title`)}</h4>
              <p>{t(`chall${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE SHIFT — Pitch Deck p.3 */}
      <section className="ent-section ent-reveal" id="shift">
        <div className="ent-section-label gold">{t('shiftLabel')}</div>
        <div className="ent-section-title">{t('shiftTitle')}</div>
        <p className="ent-section-desc">{t('shiftDesc')}</p>
        <div className="ent-shift-grid">
          <div className="ent-shift-box old">
            <div className="ent-shift-box-label">{t('oldLabel')}</div>
            <h3>{t('oldTitle')}</h3>
            <p>{t('oldDesc')}</p>
            <ul>{['old1','old2','old3','old4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
          <div className="ent-shift-arrow"><ArrowIcon /></div>
          <div className="ent-shift-box new">
            <div className="ent-shift-box-label">{t('newLabel')}</div>
            <h3>{t('newTitle')}</h3>
            <p>{t('newDesc')}</p>
            <ul>{['new1','new2','new3','new4'].map(k => <li key={k}>{t(k)}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* HOW IT WORKS — Pitch Deck p.4-5 */}
      <section className="ent-section ent-reveal" id="how">
        <div className="ent-section-label teal">{t('howLabel')}</div>
        <div className="ent-section-title">{t('howTitle')}</div>
        <p className="ent-section-desc">{t('howDesc')}</p>
        <div className="ent-steps-row">
          {[1, 2, 3, 4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num">{t(`how${i}Icon`)}</div>
              <h4>{t(`how${i}Title`)}</h4>
              <p>{t(`how${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* VIP vs ANONYMOUS — Pitch Deck p.6 */}
      <section className="ent-section ent-reveal">
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
      <section className="ent-section ent-reveal" id="portfolio">
        <div className="ent-section-label gold">{t('portLabel')}</div>
        <div className="ent-section-title">{t('portTitle')}</div>
        <p className="ent-section-desc">{t('portDesc')}</p>
        <div className="ent-problem-cards">
          {[1, 2, 3].map(i => (
            <div className="ent-problem-card" key={i}>
              <div className="ent-problem-card-icon">{t(`port${i}Icon`)}</div>
              <h4>{t(`port${i}Title`)}</h4>
              <p>{t(`port${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* LIVE DEMO */}
      <section className="ent-section ent-reveal" id="demo">
        <div className="ent-section-label red">{t('demoLabel')}</div>
        <div className="ent-section-title">{t('demoTitle')}</div>
        <p className="ent-section-desc">{t('demoDesc')}</p>
        <div className="dev-demo-grid">
          {[1, 2, 3, 4].map(i => {
            const paths = [
              '/enterprise/crmdemo/khalid',
              '/enterprise/crmdemo/ahmed',
              '/enterprise/crmdemo/marketplace',
              '/enterprise/crmdemo/dashboard',
            ];
            return (
              <Link to={paths[i - 1]} className={`dev-demo-portal${i === 4 ? ' featured' : ''}`} key={i}>
                <div className={`dev-demo-badge${i === 1 || i === 4 ? ' red' : ' blue'}`}>{t(`demoBadge${i}`)}</div>
                <h4>{t(`demoCard${i}Title`)}</h4>
                <p>{t(`demoCard${i}Desc`)}</p>
                <div className="dev-demo-arrow"><ArrowIcon /></div>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/enterprise/crmdemo" className="ent-btn-secondary" style={{ textDecoration: 'none' }}>
            {t('demoCta')}
          </Link>
        </div>
      </section>

      <div className="ent-divider" />

      {/* USE CASES */}
      <section className="ent-section ent-reveal" id="usecases">
        <div className="ent-section-label teal">{t('ucLabel')}</div>
        <div className="ent-section-title">{t('ucTitle')}</div>
        <p className="ent-section-desc">{t('ucDesc')}</p>
        <div className="dev-usecase-grid">
          {[1, 2, 3, 4].map(i => (
            <div className={`dev-usecase-card${i === 1 ? ' featured' : ''}`} key={i}>
              <h4>{t(`uc${i}Title`)}</h4>
              <p>{t(`uc${i}Desc`)}</p>
              <div className="dev-usecase-tags">
                {[1, 2, 3, 4].map(j => (
                  <span className="dev-usecase-tag" key={j}>{t(`uc${i}Tag${j}`)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* PARTNERSHIP */}
      <section className="ent-section ent-reveal" id="partnership">
        <div className="ent-section-label gold">{t('partLabel')}</div>
        <div className="ent-section-title">{t('partTitle')}</div>
        <p className="ent-section-desc">{t('partDesc')}</p>
        <div className="ent-steps-row">
          {[1, 2, 3, 4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num">{t(`part${i}Icon`)}</div>
              <h4>{t(`part${i}Title`)}</h4>
              <p>{t(`part${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ROI — Pitch Deck p.7 */}
      <section className="ent-section ent-reveal">
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
      <section className="ent-section ent-reveal">
        <div className="ent-section-label teal">{t('faqLabel')}</div>
        <div className="ent-section-title">{t('faqTitle')}</div>
        <div className="ent-faq-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div className="ent-faq-card" key={i}>
              <div className="ent-faq-q">{t(`faq${i}Q`)}</div>
              <div className="ent-faq-a">{t(`faq${i}A`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — Pitch Deck p.8 */}
      <section className="ent-cta-section ent-reveal">
        <div className="ent-section-label gold">{t('ctaLabel')}</div>
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaDesc')}</p>
        <div className="ent-cta-buttons">
          <button className="ent-btn-primary" onClick={openPilot}>{t('ctaPilot')}</button>
          <Link to="/enterprise/crmdemo" className="ent-btn-secondary" style={{ textDecoration: 'none' }}>
            {t('ctaDemo')}
          </Link>
        </div>
      </section>

      {/* PILOT MODAL */}
      <div className={`ent-pilot-backdrop${pilotOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="ent-pilot-modal">
          <div className="ent-pilot-header">
            <h3>{t('modalTitle')}</h3>
            <button className="ent-pilot-close" onClick={closePilot}>✕</button>
          </div>
          <p className="ent-pilot-sub">{t('modalSub')}</p>

          {!pilotSuccess ? (
            <form className="ent-pilot-form" ref={formRef} onSubmit={handleSubmit}>
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="form_type" value="developer_pilot" />

              <div className="ent-pilot-section-label">{t('modalSec1')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Full Name <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="name" required />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Email <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="email" name="email" required />
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Phone</label>
                  <input className="ent-pilot-input" type="tel" name="phone" />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec2')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Company <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="company" required />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Role <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="role" required defaultValue="">
                    <option value="" disabled>Select role</option>
                    <option value="ceo">CEO / Chairman</option>
                    <option value="cso">Chief Sales Officer</option>
                    <option value="cmo">Chief Marketing Officer</option>
                    <option value="vp-sales">VP of Sales</option>
                    <option value="vp-dev">VP of Development</option>
                    <option value="director-sales">Director of Sales</option>
                    <option value="director-marketing">Director of Marketing</option>
                    <option value="gm">General Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Active Projects</label>
                  <select className="ent-pilot-select" name="activeProjects" defaultValue="">
                    <option value="" disabled>How many?</option>
                    <option value="1-3">1 – 3 projects</option>
                    <option value="4-10">4 – 10 projects</option>
                    <option value="10-25">10 – 25 projects</option>
                    <option value="25+">25+ projects</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Markets</label>
                  <input className="ent-pilot-input" type="text" name="markets" placeholder="e.g. Vancouver, Dubai, London" />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec3')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Pilot Project Name <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="project" required />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Project Type <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="projectType" required defaultValue="">
                    <option value="" disabled>Select type</option>
                    <option value="tower-highrise">Residential Tower</option>
                    <option value="master-plan">Master-Planned Community</option>
                    <option value="branded-residences">Branded Residences</option>
                    <option value="luxury-villa">Luxury Villas</option>
                    <option value="mixed-use">Mixed-Use Development</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Total Units</label>
                  <select className="ent-pilot-select" name="totalUnits" defaultValue="">
                    <option value="" disabled>Select range</option>
                    <option value="under-50">Under 50</option>
                    <option value="50-200">50 – 200</option>
                    <option value="200-500">200 – 500</option>
                    <option value="500-2000">500 – 2,000</option>
                    <option value="2000+">2,000+</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Project Location</label>
                  <input className="ent-pilot-input" type="text" name="location" />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec4')}</div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">Biggest sales challenge across projects?</label>
                <select className="ent-pilot-select" name="challenge" defaultValue="">
                  <option value="" disabled>Select challenge</option>
                  <option value="anonymous-traffic">Anonymous website traffic — can't identify buyers</option>
                  <option value="slow-followup">Too slow from interest to first contact</option>
                  <option value="generic-outreach">Generic outreach — one pitch for all buyers</option>
                  <option value="no-context">Sales team lacks buyer context on calls</option>
                  <option value="no-portfolio-view">No portfolio-level buyer intelligence</option>
                  <option value="low-viewings">Low conversion from leads to booked viewings</option>
                  <option value="repeated-setup">Repeated setup costs per project launch</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">Notes</label>
                <textarea className="ent-pilot-textarea" name="notes" placeholder="Tell us about your portfolio, current sales challenges, or pilot goals..." />
              </div>

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
      <footer className="ent-footer">
        <p>{t('footerText').includes('DynamicNFC') ? (
          <>© 2026 <a href="https://dynamicnfc.ca">DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات لمطوري العقارات' : 'Sales Velocity Engine for Real Estate Developers'}</>
        ) : t('footerText')}</p>
      </footer>
    </div>
  );
}

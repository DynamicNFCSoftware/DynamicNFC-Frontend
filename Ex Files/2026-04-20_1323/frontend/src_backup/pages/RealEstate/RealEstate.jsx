import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './RealEstate.css';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   Real Estate Professionals — Sales Velocity Engine
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    /* Nav */
    navChallenge:'The Challenge', navHow:'How It Works', navDemo:'Live Demo', navUseCases:'Use Cases', navPilot:'Start a Pilot',

    /* Hero */
    heroBadge:'VIP Digital Experience for Real Estate',
    heroTitle:'Turn Buyer Intent Into Booked Viewings.',
    heroSub:'DynamicNFC gives real estate sales teams a new weapon: VIP Access Keys that deliver private, personalized buyer experiences — and tell you exactly who is ready to act, what they care about, and when to call.',
    stat1Val:'47%', stat1Label:'Higher Engagement', stat2Val:'3.2×', stat2Label:'Faster to Viewing', stat3Val:'Real-time', stat3Label:'Buyer Intelligence',
    heroCtaPilot:'Start a Pilot →', heroCtaDemo:'See the Live Demo',

    /* Challenge (Pitch Deck p.2) */
    challLabel:'The Blind Spot', challTitle:'Your Sales Team Has Leads. They Don\'t Have Context.',
    challQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when your sales team picks up the phone, they often lack one critical thing: <strong>context</strong>. They don\'t know who is ready, what they care about most, or when to act. This leads to delayed follow-ups, generic conversations, and missed momentum.',
    chall1Icon:'👥', chall1Title:'Anonymous Traffic', chall1Desc:'Hundreds of visitors browse your project website. You see page views — but you don\'t know who they are or what caught their attention.',
    chall2Icon:'🕐', chall2Title:'Delayed Follow-Up', chall2Desc:'By the time your sales team reaches out, the buyer has cooled off. The window between peak interest and first contact is too wide.',
    chall3Icon:'📋', chall3Title:'Generic Outreach', chall3Desc:'Every buyer gets the same email, the same call script, the same brochure. A penthouse investor and a first-time family buyer hear the same pitch.',

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
    how1Icon:'📦', how1Title:'VIP Campaign Selection', how1Desc:'Your sales team selects high-value prospects from the CRM — investors, repeat buyers, referrals, VIP waitlist members. Each gets a personalized VIP Access Key.',
    how2Icon:'💳', how2Title:'Premium Box Delivery', how2Desc:'The NFC card arrives in a premium box with a personal message: "This unlocks your private experience." The physical touch creates exclusivity and trust.',
    how3Icon:'📱', how3Title:'Tap to Private Portal', how3Desc:'When the buyer taps their card, they access a private digital experience — tailored to their preferences, interests, and stage in the journey. No app required.',
    how4Icon:'📊', how4Title:'Behavioral Intelligence', how4Desc:'Every action inside the portal — floor plans viewed, pricing downloaded, viewings booked — feeds your sales dashboard in real time. Your team knows exactly when to act.',

    /* Key Difference (Pitch Deck p.6) */
    diffLabel:'The Key Difference', diffTitle:'Same Website. Same Actions. Different Intelligence.',
    diffDesc:'The actions are identical for everyone — book a viewing, request pricing, explore payment plans. The only difference is identity.',
    diffVipTitle:'VIP Buyer (Known)', diffVipDesc:'We know who they are. That enables personal follow-ups, tailored incentives, and concierge-level sales. Your team calls with context: "I see you\'ve been looking at 2BR units on floors 30-40 — we have two left."',
    diffAnonTitle:'Public Visitor (Anonymous)', diffAnonDesc:'We learn at a segment level and optimize marketing. Which floor plans get the most attention? What price range drives downloads? Data-driven campaign decisions.',

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
    part1Icon:'🎯', part1Title:'Select Your Prospects', part1Desc:'Choose 50–200 high-value prospects from your CRM or VIP waitlist. We help you segment by buyer profile.',
    part2Icon:'🎨', part2Title:'Design the Experience', part2Desc:'We build a private buyer portal matched to your project branding — floor plans, pricing, amenities, and calls-to-action.',
    part3Icon:'📦', part3Title:'Deliver VIP Access Keys', part3Desc:'Premium NFC cards ship in branded boxes with personalized messages. Your prospects receive a physical invitation.',
    part4Icon:'📈', part4Title:'Track & Close', part4Desc:'Your sales dashboard lights up with buyer signals. Your team follows up with context — and books more viewings.',

    /* ROI (Pitch Deck p.7) */
    roiLabel:'Why This Matters', roiTitle:'Sales Velocity, Not Vanity Metrics.',
    roiDesc:'This is not about clicks or dashboards. It\'s about one thing: cutting the time from "Interested" to "Booked Viewing."',
    roi1Val:'47%', roi1Label:'Higher Engagement', roi1Sub:'VIP portals vs. standard project websites',
    roi2Val:'3.2×', roi2Label:'Conversion to Viewing', roi2Sub:'Among VIP invitees vs. anonymous leads',
    roi3Val:'< 48hr', roi3Label:'Time to First Follow-Up', roi3Sub:'Triggered by real buyer signals, not cold lists',

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

    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Real Estate Professionals',
  },

  ar: {
    navChallenge:"التحدي", navHow:"كيف تعمل العملية", navDemo:"العرض المباشر", navUseCases:"حالات الاستخدام", navPilot:"ابدأ البرنامج التجريبي",
    heroBadge:"تجربة كبار الشخصيات الرقمية للعقارات",
    heroTitle:"حوّل نية المشترين إلى حجوزات.",
    heroSub:"DynamicNFC يمنح فرق المبيعات العقارية أداة جديدة: مفاتيح كبار الشخصيات التي تقدم تجارب مشترٍ خاصة وشخصية — وتخبرك بالضبط من هو مستعد للتصرف، ما يهتم به، ومتى تتصل.",
    stat1Val:"0.47", stat1Label:"مشاركة أعلى", stat2Val:"3.2×", stat2Label:"أسرع للوصول إلى الحجز", stat3Val:"في الوقت الفعلي", stat3Label:"ذكاء المشتري",
    heroCtaPilot:"ابدأ برنامج تجريبي →", heroCtaDemo:"شاهد العرض المباشر",
    challLabel:"النقطة العمياء", challTitle:"فريق المبيعات لديك لديه عملاء محتملون. لكنهم بلا سياق.",
    challQuote:"أعلى المشترين اهتمامًا يقضون أسابيع في استكشاف المخططات والأسعار وخيارات الدفع عبر الإنترنت. ومع ذلك، عندما يتواصل فريق المبيعات، غالبًا ما يفتقرون إلى أمر واحد حاسم: السياق. لا يعرفون من هو مستعد، وما يهتم به أكثر، ومتى يتصرف. هذا يؤدي إلى متابعة متأخرة، محادثات عامة، وفقدان الزخم.",
    chall1Icon:"👥", chall1Title:"الزيارات المجهولة", chall1Desc:"مئات الزوار يتصفحون موقع مشروعك. ترى عدد المشاهدات — لكنك لا تعرف من هم أو ما الذي جذب اهتمامهم.",
    chall2Icon:"🕐", chall2Title:"متابعة متأخرة", chall2Desc:"بحلول الوقت الذي يتواصل فيه فريق المبيعات، يكون اهتمام العميل قد تراجع. الفاصل بين ذروة الاهتمام وأول اتصال واسع جدًا.",
    chall3Icon:"📋", chall3Title:"تواصل عام", chall3Desc:"كل مشتري يتلقى نفس البريد الإلكتروني، نفس نص المكالمة، ونفس الكتيب. المستثمر في البنتهاوس والعائلة لأول مرة يسمعون نفس العرض.",
    shiftLabel:"التحول", shiftTitle:"من موقع عام إلى دعوة خاصة",
    shiftDesc:"ماذا لو توقفت عن التعامل مع موقعك كبروشور — وبدأت معاملة الموقع كتجربة خاصة لمختارين فقط؟ ليس للجميع — فقط لأولئك الذين تدعوهم عمدًا.",
    oldLabel:"الطريقة القديمة", oldTitle:"موقع عام", oldDesc:"موقع واحد للجميع. زيارات مجهولة. لا توجد هوية للمشتري.",
    old1:"نفس التجربة لكل الزوار", old2:"لا توجد طريقة لتحديد المشترين ذوي النية العالية", old3:"فريق المبيعات يتصل بلا معلومات", old4:"المتابعة على التخمين",
    newLabel:"الطريقة الديناميكية", newTitle:"تجربة كبار الشخصيات خاصة", newDesc:"يحصل كل مشتري على مفتاح وصول كبار الشخصيات يفتح بوابة مصممة خصيصًا له.",
    new1:"محتوى مخصص لكل مشتري", new2:"الهوية معروفة قبل أول نقرة", new3:"فريق المبيعات لديه كامل السياق", new4:"المتابعة توقيت حسب إشارات المشتري",
    howLabel:"كيف تعمل العملية", howTitle:"من الصندوق الفاخر إلى الحجز",
    howDesc:"يتلقى العملاء المختارون صندوقًا فاخرًا يحتوي على بطاقة الاتصال قريب المدى ورسالة شخصية. الرسالة واضحة: \"تفتح هذه البطاقة تجربة خاصة مصممة خصيصًا لك.\"",
    how1Icon:"📦", how1Title:"اختيار حملة كبار الشخصيات", how1Desc:"يختار فريق المبيعات العملاء ذوي القيمة العالية من إدارة علاقات العملاء — المستثمرون، المشترون المتكرّرون، الإحالات، وأعضاء قائمة انتظار كبار الشخصيات. كل منهم يحصل على مفتاح كبار الشخصيات مخصص.",
    how2Icon:"💳", how2Title:"تسليم الصندوق الفاخر", how2Desc:"تصل بطاقة الاتصال قريب المدى في صندوق فاخر مع رسالة شخصية: \"هذا يفتح تجربتك الخاصة.\" اللمسة المادية تخلق الحصرية والثقة.",
    how3Icon:"📱", how3Title:"انقر للوصول إلى البوابة الخاصة", how3Desc:"عندما ينقر المشتري على بطاقته، يصل إلى تجربة رقمية خاصة — مصممة حسب تفضيلاته واهتماماته ومرحلة رحلته الشرائية. لا حاجة لأي تطبيق.",
    how4Icon:"📊", how4Title:"الذكاء السلوكي", how4Desc:"كل إجراء داخل البوابة — عرض المخططات، تحميل الأسعار، حجز الزيارات — ينعكس مباشرة على لوحة مبيعاتك في الوقت الفعلي. يعرف فريقك بالضبط متى يتصرف.",
    diffLabel:"الفرق الرئيسي", diffTitle:"نفس الموقع. نفس الإجراءات. ذكاء مختلف.",
    diffDesc:"الإجراءات متطابقة للجميع — حجز زيارة، طلب أسعار، استكشاف خطط الدفع. الاختلاف الوحيد هو الهوية.",
    diffVipTitle:"المشتري من كبار الشخصيات (معروف)", diffVipDesc:"نعرف من هم. هذا يتيح متابعة شخصية، حوافز مخصصة، ومبيعات بمستوى الكونسييرج. يتصل فريقك بالسياق: \"أرى أنك كنت تنظر إلى وحدات 2BR في الطوابق 30-40 — لدينا وحدتين متبقيتين.\"",
    diffAnonTitle:"زائر عام (مجهول)", diffAnonDesc:"نتعلم على مستوى القطاع ونحسّن التسويق. أي المخططات تحصل على أكبر اهتمام؟ أي نطاق سعري يحفّز التنزيلات؟ قرارات الحملات مبنية على البيانات.",
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
    uc2Tag1:"تجربة فاخره", uc2Tag2:"عرض فخم", uc2Tag3:"وسائط خاصة", uc2Tag4:"مبيعات الكونسييرج",
    uc3Title:"حملات كبار الشخصيات للوسطاء",
    uc3Desc:"نفّذ حملة على 50 عميلًا ذا قيمة عالية هذا الربع. كل منهم يتلقى مفتاح كبار الشخصيات مرتبط بمخزونك الحالي. تتبع أي العملاء يتفاعلون، أي العقارات يشاهدونها مرارًا، وفعّل تنبيهات المبيعات عند زيادة التفاعل. هذه متابعة مستهدفة مع ذكاء مدمج.",
    uc3Tag1:"تتبع الحملة", uc3Tag2:"قائمة متعددة", uc3Tag3:"تنبيهات التفاعل", uc3Tag4:"ذكاء خط الأنابيب",
    uc4Title:"المشترون الدوليون",
    uc4Desc:"للمستثمرين الأجانب الذين لا يمكنهم زيارة مركز المبيعات، يجسر مفتاح كبار الشخصيات المسافة. بوابات متعددة اللغات مع جولات افتراضية، مخططات، وأسعار — كل ذلك يتم تتبعه. يعرف فريق المبيعات في فانكوفر متى يفتح مشتري في دبي بوابته الساعة 2 صباحًا بتوقيت محلي.",
    uc4Tag1:"متعدد اللغات", uc4Tag2:"جولات افتراضية", uc4Tag3:"معرفة فرق التوقيت", uc4Tag4:"مبيعات عبر الحدود",
    partLabel:"نموذج الشراكة", partTitle:"إطلاق خلال أسابيع. قياس حسب الحجوزات.",
    partDesc:"نعمل جنبًا إلى جنب مع فريق المبيعات لتصميم ونشر وتحسين تجربة مشتري كبار الشخصيات لمشروعك الحالي.",
    part1Icon:"🎯", part1Title:"اختر عملاءك المحتملين", part1Desc:"اختر 50–200 عميل ذي قيمة عالية من إدارة علاقات العملاء أو قائمة انتظار كبار الشخصيات. نساعدك على تقسيمهم حسب الملف الشخصي للمشتري.",
    part2Icon:"🎨", part2Title:"صمّم التجربة", part2Desc:"ننشئ بوابة مشتري خاصة متطابقة مع علامتك التجارية للمشروع — المخططات، الأسعار، المرافق، والدعوات للعمل.",
    part3Icon:"📦", part3Title:"تسليم مفاتيح كبار الشخصيات", part3Desc:"يتم شحن بطاقات الاتصال قريب المدى الفاخرة في صناديق مخصصة مع رسائل شخصية. يتلقى عملاؤك دعوة مادية.",
    part4Icon:"📈", part4Title:"تتبع وإغلاق", part4Desc:"تضيء لوحة المبيعات الخاصة بك بإشارات العملاء. يتابع فريقك مع السياق — ويحجز المزيد من الزيارات.",
    roiLabel:"لماذا هذا مهم", roiTitle:"سرعة المبيعات، وليس أرقام فارغة.",
    roiDesc:"ليس الأمر متعلقًا بالنقرات أو اللوحات — بل بتقليل الوقت من \"مهتم\" إلى \"حجز زيارة\".",
    roi1Val:"0.47", roi1Label:"مستوى التفاعل الأعلى", roi1Sub:"بوابات كبار الشخصيات مقابل مواقع المشروع القياسية",
    roi2Val:"3.2×", roi2Label:"معدل التحويل للحجز", roi2Sub:"بين المدعوين كبار الشخصيات مقابل العملاء المجهولين",
    roi3Val:"< 48 ساعة", roi3Label:"الوقت حتى أول متابعة", roi3Sub:"مفعّل بإشارات مشتري حقيقية، وليس قوائم باردة",
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
    footerText:"© 2026 DynamicNFC — محرك سرعة المبيعات للمحترفين العقاريين",
  },
};

export default function RealEstate() {
  const { lang } = useLanguage();
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
    data._subject = `Real Estate Pilot — ${data.name} / ${data.company || 'Individual'}`;
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
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
          <button className="ent-btn-secondary" onClick={() => scrollTo('demo')}>{t('heroCtaDemo')}</button>
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE BLIND SPOT */}
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
            <span className="re-roi-banner-badge">SALES VELOCITY TOOL</span>
            <h3>How much revenue would <em>{100}</em> VIP invitations generate?</h3>
            <p>Plug in your project numbers — see the projected impact on viewings, conversion, and sales pipeline in real time.</p>
          </div>
          <Link to="/sales/roi-calculator" className="re-roi-banner-btn">
            Calculate Your ROI
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <div className="ent-divider" />

      {/* THE SHIFT */}
      <section className="ent-section ent-reveal">
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

      {/* HOW IT WORKS */}
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

      {/* VIP vs ANONYMOUS */}
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

      {/* LIVE DEMO */}
      <section className="ent-section ent-reveal" id="demo">
        <div className="ent-section-label red">{t('demoLabel')}</div>
        <div className="ent-section-title">{t('demoTitle')}</div>
        <p className="ent-section-desc">{t('demoDesc')}</p>
        <div className="dev-demo-grid">
          {[1, 2, 3, 4].map(i => {
            const urls = [
              '/enterprise/crmdemo/khalid',
              '/enterprise/crmdemo/ahmed',
              '/enterprise/crmdemo/marketplace',
              '/enterprise/crmdemo/dashboard',
            ];
            return (
              <Link to={urls[i - 1]} className={`dev-demo-portal${i === 4 ? ' featured' : ''}`} key={i}>
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
        <div className="ent-section-label gold">{t('ucLabel')}</div>
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
        <div className="ent-section-label teal">{t('partLabel')}</div>
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

      {/* ROI */}
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

      {/* CTA */}
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
              <input type="hidden" name="form_type" value="real_estate_pilot" />

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
                  <label className="ent-pilot-label">Company / Brokerage <span className="req">*</span></label>
                  <input className="ent-pilot-input" type="text" name="company" required />
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Role <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="role" required defaultValue="">
                    <option value="" disabled>Select role</option>
                    <option value="vp-sales">VP of Sales</option>
                    <option value="director-sales">Director of Sales</option>
                    <option value="sales-manager">Sales Manager</option>
                    <option value="broker-owner">Broker / Owner</option>
                    <option value="marketing-director">Marketing Director</option>
                    <option value="team-lead">Team Lead</option>
                    <option value="agent">Top-Producing Agent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Team Size</label>
                  <select className="ent-pilot-select" name="teamSize" defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1-5">1 – 5 agents</option>
                    <option value="6-20">6 – 20 agents</option>
                    <option value="21-50">21 – 50 agents</option>
                    <option value="50+">50+ agents</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Market</label>
                  <input className="ent-pilot-input" type="text" name="market" placeholder="e.g. Vancouver, Dubai, Toronto" />
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec3')}</div>
              <div className="ent-pilot-row">
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">Project or Listing Type <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="projectType" required defaultValue="">
                    <option value="" disabled>Select type</option>
                    <option value="pre-construction">Pre-Construction Tower</option>
                    <option value="luxury-resale">Luxury Resale ($2M+)</option>
                    <option value="new-development">New Development</option>
                    <option value="master-planned">Master-Planned Community</option>
                    <option value="brokerage-campaign">Brokerage-Wide VIP Campaign</option>
                    <option value="mixed-use">Mixed-Use Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="ent-pilot-field">
                  <label className="ent-pilot-label">VIP Prospects to Target</label>
                  <select className="ent-pilot-select" name="vipCount" defaultValue="">
                    <option value="" disabled>How many?</option>
                    <option value="25-50">25 – 50</option>
                    <option value="50-100">50 – 100</option>
                    <option value="100-200">100 – 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>

              <div className="ent-pilot-divider" />
              <div className="ent-pilot-section-label">{t('modalSec4')}</div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">Biggest sales challenge right now?</label>
                <select className="ent-pilot-select" name="challenge" defaultValue="">
                  <option value="" disabled>Select challenge</option>
                  <option value="anonymous-traffic">Anonymous website traffic — can't identify buyers</option>
                  <option value="slow-followup">Too slow from interest to first contact</option>
                  <option value="generic-outreach">Generic outreach — one pitch for all buyers</option>
                  <option value="low-viewings">Low conversion from leads to booked viewings</option>
                  <option value="no-context">Sales team lacks buyer context on calls</option>
                  <option value="luxury-positioning">Need premium positioning for luxury listings</option>
                  <option value="international-buyers">Engaging international / remote buyers</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="ent-pilot-field full">
                <label className="ent-pilot-label">Notes</label>
                <textarea className="ent-pilot-textarea" name="notes" placeholder="Tell us about your current project, buyer list, or sales challenge..." />
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
          <>© 2026 <a href="https://dynamicnfc.ca">DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات لمحترفي العقارات' : 'Sales Velocity Engine for Real Estate Professionals'}</>
        ) : t('footerText')}</p>
      </footer>
    </div>
  );
}

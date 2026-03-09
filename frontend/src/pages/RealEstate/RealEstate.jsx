import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    navChallenge:'التحدي', navHow:'كيف يعمل', navDemo:'عرض حي', navUseCases:'حالات الاستخدام', navPilot:'ابدأ تجربة',
    heroBadge:'تجربة رقمية VIP للعقارات',
    heroTitle:'حوّل نية المشتري إلى حجز معاينة.',
    heroSub:'DynamicNFC يمنح فرق المبيعات العقارية سلاحاً جديداً: مفاتيح وصول VIP تقدم تجارب شخصية خاصة للمشترين — وتخبرك بالضبط من مستعد للتحرك، ما يهمه، ومتى تتصل.',
    stat1Val:'٤٧٪', stat1Label:'تفاعل أعلى', stat2Val:'٣.٢×', stat2Label:'أسرع للمعاينة', stat3Val:'لحظي', stat3Label:'ذكاء المشتري',
    heroCtaPilot:'ابدأ تجربة →', heroCtaDemo:'شاهد العرض الحي',
    challLabel:'النقطة العمياء', challTitle:'فريق مبيعاتك لديه عملاء. ليس لديه سياق.',
    challQuote:'أكثر المشترين اهتماماً يقضون أسابيع في استكشاف المخططات والأسعار وخطط الدفع عبر الإنترنت. لكن عندما يتواصل فريق المبيعات، ينقصه شيء واحد حاسم: <strong>السياق</strong>. لا يعرفون من مستعد، ما يهمهم أكثر، أو متى يتصرفون.',
    chall1Icon:'👥', chall1Title:'زوار مجهولون', chall1Desc:'مئات الزوار يتصفحون موقع المشروع. ترى زيارات الصفحات — لكن لا تعرف من هم أو ما لفت انتباههم.',
    chall2Icon:'🕐', chall2Title:'متابعة متأخرة', chall2Desc:'بحلول وقت تواصل فريق المبيعات، يكون المشتري قد فقد حماسه. الفجوة بين ذروة الاهتمام والاتصال الأول واسعة جداً.',
    chall3Icon:'📋', chall3Title:'تواصل عام', chall3Desc:'كل مشترٍ يحصل على نفس البريد، نفس النص، نفس الكتيب. مستثمر البنتهاوس والعائلة المشترية لأول مرة يسمعون نفس العرض.',
    shiftLabel:'التحوّل', shiftTitle:'من موقع عام إلى دعوة خاصة',
    shiftDesc:'ماذا لو توقفت عن معاملة موقعك كنشرة إعلانية، وبدلاً من ذلك عاملته كتجربة خاصة لعملاء مختارين؟ ليس للجميع — فقط من تدعوهم عمداً.',
    oldLabel:'الطريقة القديمة', oldTitle:'موقع عام', oldDesc:'موقع واحد للجميع. زوار مجهولون. لا هوية للمشتري.',
    old1:'نفس التجربة لكل الزوار', old2:'لا طريقة لتحديد المشترين المهتمين', old3:'فريق المبيعات يتصل أعمى', old4:'متابعة مبنية على التخمين',
    newLabel:'الطريقة الديناميكية', newTitle:'تجربة VIP خاصة', newDesc:'كل مشترٍ يحصل على مفتاح VIP يفتح بوابة مصممة له.',
    new1:'محتوى مخصص لكل مشترٍ', new2:'الهوية معروفة قبل أول نقرة', new3:'فريق المبيعات لديه السياق الكامل', new4:'متابعة مؤقتة بإشارات المشتري',
    howLabel:'كيف يعمل', howTitle:'من الصندوق الفاخر إلى حجز المعاينة',
    howDesc:'العملاء المختارون يتلقون صندوقاً فاخراً مع بطاقة NFC ورسالة شخصية: "هذه البطاقة تفتح تجربة خاصة صُممت خصيصاً لك."',
    how1Icon:'📦', how1Title:'اختيار حملة VIP', how1Desc:'فريق مبيعاتك يختار العملاء ذوي القيمة العالية — مستثمرين، مشترين متكررين، إحالات. كل واحد يحصل على مفتاح VIP مخصص.',
    how2Icon:'💳', how2Title:'توصيل الصندوق الفاخر', how2Desc:'بطاقة NFC تصل في صندوق فاخر مع رسالة شخصية. اللمسة المادية تخلق الحصرية والثقة.',
    how3Icon:'📱', how3Title:'لمس للبوابة الخاصة', how3Desc:'عندما يلمس المشتري بطاقته، يصل إلى تجربة رقمية خاصة — مصممة حسب تفضيلاته واهتماماته. بدون تطبيق.',
    how4Icon:'📊', how4Title:'ذكاء سلوكي', how4Desc:'كل إجراء داخل البوابة — مخططات شوهدت، أسعار حُمّلت، معاينات حُجزت — يغذي لوحة المبيعات لحظياً.',
    diffLabel:'الفرق الجوهري', diffTitle:'نفس الموقع. نفس الإجراءات. ذكاء مختلف.',
    diffDesc:'الإجراءات متطابقة للجميع — حجز معاينة، طلب أسعار، استكشاف خطط الدفع. الفرق الوحيد هو الهوية.',
    diffVipTitle:'مشتري VIP (معروف)', diffVipDesc:'نعرف من هم. هذا يمكّن المتابعة الشخصية والحوافز المخصصة والمبيعات على مستوى الكونسيرج.',
    diffAnonTitle:'زائر عام (مجهول)', diffAnonDesc:'نتعلم على مستوى الشريحة ونحسّن التسويق. أي المخططات تحظى بأكبر اهتمام؟ أي نطاق سعري يحفز التحميل؟',
    demoLabel:'عرض حي', demoTitle:'شاهده عملياً — فيستا ريزيدنسز',
    demoDesc:'استكشف عرضاً حياً مبنياً لمشروع برج فاخر خيالي. شاهد كيف تحصل ملفات المشترين المختلفة على تجارب مختلفة تماماً.',
    demoBadge1:'مستثمر VIP', demoBadge2:'مشتري عائلي', demoBadge3:'وصول عام', demoBadge4:'لوحة التحليلات',
    demoCard1Title:'خالد الراشد — بوابة المستثمر', demoCard1Desc:'تجربة مستثمر نخبوية مع محتوى يركز على العائد، عروض البنتهاوس، وتحليلات الاستثمار.',
    demoCard2Title:'أحمد الفهد — بوابة العائلة', demoCard2Desc:'تجربة مشتري عائلي تبرز وحدات 3 غرف، المدارس، الحدائق، والمرافق.',
    demoCard3Title:'السوق العالمي', demoCard3Desc:'تجربة تصفح مجهول مع التقاط تدريجي — كيف يصبح الزوار العامون مشترين معروفين.',
    demoCard4Title:'لوحة الشركة', demoCard4Desc:'لوحة CRM داخلية تعرض التفاعل اللحظي، تسجيل العملاء، تتبع السلوك، وقمع التحويل.',
    demoCta:'زر بيئة العرض الكاملة →',
    ucLabel:'حالات الاستخدام', ucTitle:'من إطلاق الأبراج إلى إعادة بيع الفاخر',
    ucDesc:'DynamicNFC يتكيف مع كل سيناريو مبيعات في العقارات.',
    uc1Title:'مبيعات ما قبل البناء',
    uc1Desc:'أطلق برجاً من 500 وحدة مع مفاتيح VIP لأفضل 200 عميل. كل بطاقة تفتح بوابة تعرض الطابق المفضل واتجاه الإطلالة وخطة الدفع — قبل أي مكالمة هاتفية.',
    uc1Tag1:'اختيار الطابق', uc1Tag2:'وصول ما قبل الإطلاق', uc1Tag3:'خطط الدفع', uc1Tag4:'تسجيل المشتري',
    uc2Title:'إعادة بيع الفاخر',
    uc2Desc:'للعقارات بقيمة 5 ملايين+، كل نقطة اتصال يجب أن تعكس مستوى العقار. بطاقة NFC معدنية في صندوق فاخر تضع العقار كحصري.',
    uc2Tag1:'تجربة فاخرة', uc2Tag2:'عرض متميز', uc2Tag3:'وسائط خاصة', uc2Tag4:'مبيعات كونسيرج',
    uc3Title:'حملات VIP للوساطات',
    uc3Desc:'شن حملة على 50 عميلاً ذا قيمة عالية هذا الربع. كل واحد يتلقى مفتاح VIP مرتبطاً بمخزونك الحالي. تتبع من يتفاعل وأي عقارات يشاهدها مراراً.',
    uc3Tag1:'تتبع الحملة', uc3Tag2:'عقارات متعددة', uc3Tag3:'تنبيهات التفاعل', uc3Tag4:'ذكاء الأنبوب',
    uc4Title:'المشترون الدوليون',
    uc4Desc:'للمستثمرين الخارجيين الذين لا يستطيعون زيارة مركز المبيعات، مفتاح VIP يجسر المسافة. بوابات متعددة اللغات مع جولات افتراضية ومخططات وأسعار.',
    uc4Tag1:'متعدد اللغات', uc4Tag2:'جولات افتراضية', uc4Tag3:'وعي المنطقة الزمنية', uc4Tag4:'مبيعات عابرة للحدود',
    partLabel:'نموذج الشراكة', partTitle:'أطلق في أسابيع. قِس بالمعاينات.',
    partDesc:'نعمل مع فريق مبيعاتك لتصميم ونشر وتحسين تجربة المشتري VIP لمشروعك الحالي.',
    part1Icon:'🎯', part1Title:'اختر عملاءك', part1Desc:'اختر 50-200 عميل ذوي قيمة عالية من CRM أو قائمة VIP. نساعدك في التقسيم حسب ملف المشتري.',
    part2Icon:'🎨', part2Title:'صمم التجربة', part2Desc:'نبني بوابة مشتري خاصة تطابق علامة مشروعك — مخططات وأسعار ومرافق ودعوات للعمل.',
    part3Icon:'📦', part3Title:'وصّل مفاتيح VIP', part3Desc:'بطاقات NFC تُشحن في صناديق فاخرة مع رسائل مخصصة. عملاؤك يتلقون دعوة مادية.',
    part4Icon:'📈', part4Title:'تتبع وأغلق', part4Desc:'لوحة المبيعات تضيء بإشارات المشتري. فريقك يتابع بسياق — ويحجز المزيد من المعاينات.',
    roiLabel:'لماذا هذا مهم', roiTitle:'سرعة المبيعات، ليس مقاييس التفاخر.',
    roiDesc:'ليس عن النقرات أو اللوحات. عن شيء واحد: تقليص الوقت من "مهتم" إلى "معاينة محجوزة".',
    roi1Val:'٤٧٪', roi1Label:'تفاعل أعلى', roi1Sub:'بوابات VIP مقابل مواقع المشاريع القياسية',
    roi2Val:'٣.٢×', roi2Label:'تحويل للمعاينة', roi2Sub:'بين مدعوي VIP مقابل العملاء المجهولين',
    roi3Val:'< ٤٨ ساعة', roi3Label:'وقت أول متابعة', roi3Sub:'مُفعّل بإشارات مشتري حقيقية، ليس قوائم باردة',
    faqLabel:'أسئلة فريق المبيعات', faqTitle:'أسئلة سيطرحها فريقك',
    faq1Q:'هل هذا يستبدل موقعنا أو CRM؟', faq1A:'لا. DynamicNFC يجلس فوق أنظمتكم الحالية ويعززها. موقعكم يبقى عاماً. بوابة VIP طبقة خاصة — متصلة بـ CRM.',
    faq2Q:'كيف تُعالج الموافقة؟', faq2A:'الموافقة صريحة. العميل يتلقى بطاقة مادية برسالة واضحة. اللمس هو الموافقة. لا تتبع خفي.',
    faq3Q:'ماذا يرى المشتري فعلاً؟', faq3A:'تجربة ويب مخصصة — بدون تطبيق. يرى مخططات وأسعار ومرافق ودعوات مصممة لملفه الشخصي.',
    faq4Q:'كيف نقيس النجاح؟', faq4A:'مقياس واحد: زيادة المعاينات المحجوزة بين مدعوي VIP مقابل مجموعة المقارنة.',
    faq5Q:'كم يستغرق الإعداد؟', faq5A:'2-4 أسابيع من البداية إلى تسليم أول البطاقات. نصمم البوابة ونبرمج البطاقات ونحزم ونشحن.',
    faq6Q:'ما أنظمة CRM التي تتصلون بها؟', faq6A:'Salesforce وHubSpot وFollow Up Boss وkvCORE وتكاملات مخصصة عبر webhook.',
    ctaLabel:'جاهز للتحرك', ctaTitle:'أنت لا توزع بطاقات. أنت تصدر دعوات خاصة.',
    ctaDesc:'حوّل النية الرقمية إلى زخم مبيعات حقيقي. ابدأ بـ 50 مفتاح VIP لمشروعك الحالي وقِس الفرق.',
    ctaPilot:'ابدأ تجربة →', ctaDemo:'شاهد العرض الحي',
    modalTitle:'ابدأ تجربة مبيعات', modalSub:'أخبرنا عن مشروعك الحالي وسنصمم تجربة VIP تجريبية — عادة 50-200 مفتاح وصول مع بوابة مخصصة.',
    modalSec1:'معلومات الاتصال', modalSec2:'ممارستك', modalSec3:'مشروع التجربة', modalSec4:'تحدي المبيعات',
    modalSubmit:'إرسال طلب التجربة →', modalSubmitting:'جارٍ الإرسال...',
    modalNote:'نرد خلال 24 ساعة. معلوماتك سرية تماماً.',
    successTitle:'تم إرسال طلب التجربة', successDesc:'شكراً لك. سيتواصل أخصائي العقارات لدينا خلال 24 ساعة مع اقتراح تجربة مخصصة.',
    successClose:'إغلاق',
    footerText:'© 2026 DynamicNFC — محرك تسريع المبيعات لمحترفي العقارات',
  },
};

export default function RealEstate() {
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
    data._subject = `Real Estate Pilot — ${data.name} / ${data.company || 'Individual'}`;
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

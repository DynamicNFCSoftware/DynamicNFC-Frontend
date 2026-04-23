import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n';
import './Enterprise.css';
import SEO from '../../components/SEO/SEO';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR) — Full enterprise copy
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    navChallenge:'The Challenge', navHow:'How It Works', navDemo:'Live Demo', navImpact:'Impact', navPilot:'Request a Pilot',
    heroBadge:'Enterprise Sales Velocity Engine',
    heroTitle:'Turn Anonymous Visitors Into Booked Viewings',
    heroSub:'DynamicNFC transforms premium NFC cards into private buyer experiences — bridging the gap between anonymous traffic and named, high-intent prospects across real estate developments, automotive showrooms, and beyond.',
    heroTitle_re:'Turn Anonymous Visitors Into Booked Viewings',
    heroTitle_auto:'Turn Showroom Browsers Into Test Drive Bookings',
    heroSub_re:'DynamicNFC transforms premium NFC cards into private buyer portals — bridging the gap between anonymous digital traffic and named, high-intent prospects ready to commit across mega-developments and branded residences.',
    heroSub_auto:'DynamicNFC transforms premium NFC cards into private VIP showroom experiences — bridging the gap between anonymous walk-ins and named, high-intent buyers ready to configure, finance, and drive away.',
    statConversion:'Conversion Rate', statDecision:'Faster Decision Cycle', statIdentified:'Identified Visitors',
    heroCtaPilot:'Request a Pilot →', heroCtaDemo:'See the Live Demo',

    probLabel:'The Blind Spot', probTitle:'Your Sales Team Is Operating Without Context',
    probQuote:'Your highest-intent buyers spend weeks exploring floor plans, pricing, and payment options online. Yet when sales teams engage, they lack the one critical thing that closes deals: <strong style="color:var(--red)">context.</strong>',
    prob1Icon:'🏙️', prob1Title:'Anonymous Traffic', prob1Desc:'97% of your website visitors leave without ever identifying themselves — across every project launch',
    prob2Icon:'⏳', prob2Title:'Delayed Follow-ups', prob2Desc:'Sales teams reach out too late, with no insight into which units, payment plans, or amenities prospects explored',
    prob3Icon:'📋', prob3Title:'Generic Conversations', prob3Desc:'Every prospect gets the same pitch — whether they\'re an investor seeking ROI or a family seeking community',

    shiftLabel:'The Shift', shiftTitle:'From Brochure Website to Private Invitation',
    shiftDesc:'What if you stopped treating the website as a public brochure — and started treating it as a private experience for selected prospects?',
    oldLabel:'The Old Way', oldTitle:'Generic Website', oldDesc:'Everyone sees the same thing. Anonymous visitors. Zero context for your sales team.',
    old1:'Anonymous traffic', old2:'One-size-fits-all content', old3:'No behavioral signals', old4:'Cold follow-ups',
    newLabel:'The Dynamic Way', newTitle:'Private VIP Experience', newDesc:'Each VIP Access Key unlocks a personalized portal. Identity precedes action.',
    new1:'Named, identified visitors', new2:'Persona-tailored content', new3:'Real-time behavioral signals', new4:'Contextual, timely outreach',

    howLabel:'The Process', howTitle:'From Premium Box to Booked Viewing',
    howDesc:'Selected prospects receive a premium box containing a VIP Access Key — an NFC-enabled card with a personal message. The experience unfolds from there.',
    step1Title:'VIP Selection', step1Desc:'Your sales team selects high-value prospects and assigns a personalized NFC card linked to their profile.',
    step2Title:'Premium Delivery', step2Desc:'Prospects receive a premium box with a VIP Access Key and personal invitation: "This card unlocks a private experience created for you."',
    step3Title:'Tap & Explore', step3Desc:'One tap opens their private portal — tailored floor plans, pricing, amenities, and booking tools, all linked to their identity.',
    step4Title:'Behavioral Intelligence', step4Desc:'Every interaction — floor plan views, pricing requests, viewing bookings — feeds your dashboard in real time.',

    idLabel:'The Key Difference', idTitle:'Same Website. Same Actions. Different Intelligence.', idTagline:'Identity is the multiplier.',
    idVipLabel:'VIP Access Key Holder', idVipTitle:'Named Prospect — Khalid Al-Rashid',
    idVipDesc:'You know he viewed the Skyline Penthouse three times, downloaded the ROI brochure, and spent 8 minutes on payment plans. Your sales team calls with context, timing, and the right offer.',
    idVip1:'Personal Follow-ups', idVip2:'Tailored Incentives', idVip3:'Concierge Sales', idVip4:'Named Intelligence',
    idAnonLabel:'Anonymous Website Visitor', idAnonTitle:'Unknown — Segment Data Only',
    idAnonDesc:"Someone visited the penthouse page. You don't know who, how many times, or what else they explored. The lead sits in a queue with hundreds of others.",
    idAnon1:'Segment-level Data', idAnon2:'Generic Outreach', idAnon3:'Marketing Optimization', idAnon4:'No Named Signals',

    demoLabel:'Live Demo', demoTitle:'See It In Action — Live Demo Environments',
    demoDesc:'Explore our fully functional demo environment. Four portals show how DynamicNFC transforms the same project into four distinct experiences — from VIP investors to anonymous browsers.',
    demoBadge1:'★ VIP Investor', demoCard1Title:'Khalid Al-Rashid Portal',
    demoCard1Desc:'Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics.',
    demoBadge2:'🏠 Family Buyer', demoCard2Title:'Ahmed Al-Fahad Portal',
    demoCard2Desc:'Premium homebuyer experience highlighting family-friendly 3BR units, school districts, and community amenities.',
    demoBadge3:'🌐 Public Access', demoCard3Title:'Global Marketplace',
    demoCard3Desc:'Anonymous and registered user browsing experience with adaptive content based on engagement signals.',
    demoBadge4:'📊 Analytics', demoCard4Title:'Corporate Dashboard — Behavioral Intelligence',
    demoCard4Desc:'Real-time engagement metrics, lead scoring, conversion funnels, and A/B testing. See how every tap feeds your sales pipeline.',
    demoBadge5:'🤖 AI Engine', demoCard5Title:'AI Sales Pipeline — Live MCP Demo',
    demoCard5Desc:'Watch AI orchestrate Gmail, Google Calendar, and DocuSign in real-time. Every action is verifiable — click to confirm in your own accounts.',
    demoCta:'Explore Full Demo →',

    roiLabel:'Why This Matters', roiTitle:"This Is Not About Clicks. It's About Sales Velocity.",
    roiDesc:'Success is measured by one thing: how fast prospects move from first tap to booked viewing to signed deal.',
    roiFlow1:'100 VIP Invitations', roiFlow2:'Private Digital Access', roiFlow3:'High-Intent Signals',
    roiFlow4:'Sales Prioritization', roiFlow5:'More Booked Viewings', roiFlow6:'Higher Close Rate',
    roiMetric1Label:'Higher Conversion Rate', roiMetric1Sub:'VIP invitees vs. anonymous website traffic',
    roiMetric2Label:'Faster Decision Cycle', roiMetric2Sub:'From first tap to booked viewing',
    roiMetric3Label:'Identified Engagement', roiMetric3Sub:'Every tap is linked to a named prospect',

    trustLabel:'Built for Enterprise', trustTitle:'Privacy-First. CRM-Integrated. Zero Friction.',
    trust1Icon:'🔒', trust1Title:'Consent by Design', trust1Desc:'The physical tap is the ultimate opt-in. Consent is explicit, invitations are intentional, access is controlled.',
    trust2Icon:'📱', trust2Title:'NFC + QR Fallback', trust2Desc:'NFC for instant access. QR codes for universal compatibility. No app downloads required.',
    trust3Icon:'🔗', trust3Title:'CRM Integration', trust3Desc:"Sits on top of your existing systems. Enhances your CRM with behavioral intelligence — doesn't replace it.",
    trust4Icon:'🤖', trust4Title:'AI Personalization', trust4Desc:"Content adapts dynamically to each prospect's interests, stage, and engagement history.",

    faqLabel:'Questions Executives Ask', faqTitle:'Addressed Before You Ask Them',
    faq1Q:'Is this replacing our website or CRM?',
    faq1A:'No. DynamicNFC is a layer that sits on top of your existing systems. Your website keeps working. Your CRM keeps working. We enhance both with identity-linked behavioral intelligence that neither can capture alone.',
    faq2Q:'How do we measure pilot success?',
    faq2A:'One metric: increase in booked viewings among VIP invitees versus your control group. Not clicks, not pageviews — real sales activity.',
    faq3Q:'What about data privacy and compliance?',
    faq3A:"Consent is baked into the physical experience. When a prospect taps a card they intentionally received, that's explicit opt-in. No dark patterns, no hidden tracking. The tap is the consent.",
    faq4Q:'What does the prospect actually receive?',
    faq4A:'A premium box with an NFC-enabled VIP Access Key and a personal message. Not a marketing flyer — a private invitation.',
    faq5Q:'How fast can we deploy?',
    faq5A:'A pilot program can launch within 2–4 weeks. We configure your portals, design the premium box experience, program the NFC cards, and connect the analytics dashboard.',
    faq6Q:"What's the real ROI here?",
    faq6A:'It\'s about cutting the time from "Interested" to "Viewing" in half. When your sales team engages at the right moment with the right context, decisions accelerate.',

    ctaLabel:'Ready to Deploy',
    ctaTitle:"You're Not Handing Out NFC Cards. You're Issuing Private Invitations.",
    ctaDesc:'Turn digital intent into real sales momentum. Start a pilot with 100 VIP invitations and measure the difference in booked viewings within 30 days.',
    ctaPilot:'Request a Pilot Program →', ctaDemo:'Explore the Live Demo',

    modalTitle:'Request a Pilot Program', modalSub:"Tell us about your development and we'll design a custom pilot program — 100 VIP invitations, full analytics dashboard, and measurable results within 30 days.",
    modalSec1:'Contact Information', modalSec2:'Company & Role', modalSec3:'Project Details', modalSec4:'Current Challenges',
    modalSubmit:'Submit Pilot Request →', modalSubmitting:'Submitting...',
    modalNote:'We respond within 24 hours. Your information is kept strictly confidential.',
    successTitle:'Pilot Request Submitted',
    successDesc:'Thank you. Our enterprise team will review your project details and reach out within 24 hours to design your custom pilot program.',
    successClose:'Close',
    footerText:'© 2026 DynamicNFC — Sales Velocity Engine for Real Estate & Automotive',
    indChoose:'Choose Your Industry', indAll:'All Industries', indRE:'Real Estate', indAuto:'Automotive',
    prob1Desc_auto:'85% of showroom visitors browse anonymously — your sales team doesn\'t know who viewed the AMG GT 63 S three times',
    prob2Desc_auto:'Sales teams follow up too late, with no insight into which models, configurations, or financing options prospects explored',
    prob3Desc_auto:'Every prospect gets the same pitch — whether they\'re a luxury collector seeking exclusivity or a family upgrading their SUV',
    step3Desc_auto:'One tap opens their private showroom portal — tailored vehicle collections, configurations, pricing, and test drive booking, all linked to their VIP identity.',
    step4Desc_auto:'Every interaction — model views, configurations saved, financing explored, test drives booked — feeds your dealer dashboard in real time.',
    idVipTitle_auto:'Named Prospect — Khalid Al-Mansouri',
    idVipDesc_auto:'You know he configured an AMG GT 63 S in Obsidian Black, opened the finance calculator, compared it with the G 63, and spent 12 minutes on payment plans. Your sales team calls with the exact spec sheet, test drive availability, and a VIP finance offer.',
    demoTitle_re:'See It In Action — Al Noor Residences',
    demoTitle_auto:'See It In Action — Prestige Motors',
    autoDemo1Title:'Khalid Al-Mansouri Portal', autoDemo1Desc:'VIP automotive experience with AMG performance focus, saved configurations, and finance calculator access.',
    autoDemo2Title:'Sultan Al-Dhaheri Portal', autoDemo2Desc:'Luxury SUV buyer experience highlighting Maybach GLS 600, G 63, and exclusive test drive booking.',
    autoDemo3Title:'Public Showroom', autoDemo3Desc:'Walk-in visitor experience with full inventory browsing, vehicle comparison, and lead capture.',
    autoDemo4Title:'Dealer Intelligence Dashboard', autoDemo4Desc:'Real-time engagement analytics, lead scoring, sales triggers, conversion funnels, and VIP behavioral intelligence.',
    faq2A_auto:'One metric: increase in test drive bookings among VIP cardholders versus your walk-in control group. Not clicks, not pageviews — real showroom activity.',
    roiFlow5_auto:'More Test Drive Bookings',
    modalIndustry:'Industry', modalIndustryPlaceholder:'Select your industry',
  },
  ar: {
    navChallenge:"التحدي", navHow:"كيف تعمل", navDemo:"العرض التجريبي المباشر", navImpact:"التأثير", navPilot:"طلب تجربة تجريبية",
    heroBadge:"محرك تسريع مبيعات الشركات",
    heroTitle:"تحويل الزوار المجهولين إلى زيارات محجوزة",
    heroSub:"يحوّل DynamicNFC بطاقات NFC الفاخرة إلى تجارب خاصة بالمشترين — جسر بين الزوار المجهولين والعملاء ذوي النية العالية عبر المشاريع العقارية وصالات عرض السيارات وما بعدها.",
    heroTitle_re:"تحويل الزوار المجهولين إلى زيارات محجوزة",
    heroTitle_auto:"تحويل زوار صالة العرض إلى حجوزات تجربة قيادة",
    heroSub_re:"يحوّل DynamicNFC بطاقات NFC الفاخرة إلى بوابات خاصة بالمشترين — جسر بين الزوار المجهولين والعملاء ذوي النية العالية عبر المشاريع الضخمة والمساكن ذات العلامات التجارية.",
    heroSub_auto:"يحوّل DynamicNFC بطاقات NFC الفاخرة إلى تجارب صالة عرض VIP خاصة — جسر بين الزوار المجهولين والمشترين ذوي النية العالية الجاهزين للتكوين والتمويل والقيادة.",
    statConversion:"معدل التحويل", statDecision:"دورة اتخاذ القرار أسرع", statIdentified:"زوار محددون",
    heroCtaPilot:"طلب تجربة تجريبية →", heroCtaDemo:"شاهد العرض التجريبي المباشر",
    probLabel:"النقطة العمياء", probTitle:"فريق المبيعات يعمل دون سياق",
    probQuote:"يقضي المشترون الأكثر جدية أسابيع في استكشاف مخططات الطوابق والأسعار وخيارات الدفع عبر الإنترنت. ومع ذلك، عندما تتواصل فرق المبيعات معهم، فإنها تفتقر إلى الشيء الأهم الذي يحسم الصفقات: السياق.",
    prob1Icon:"🏙️", prob1Title:"حركة مرور مجهولة", prob1Desc:"97% من زوار موقعك يغادرون دون الكشف عن هويتهم — عبر كل إطلاق مشروع",
    prob2Icon:"⏳", prob2Title:"متابعات متأخرة", prob2Desc:"يتواصل فرق المبيعات متأخرًا، دون معرفة الوحدات، أو خطط الدفع، أو المرافق التي استكشفها العملاء المحتملون",
    prob3Icon:"📋", prob3Title:"المحادثات العامة", prob3Desc:"كل عميل محتمل يحصل على نفس العرض — سواء كان مستثمرًا يبحث عن العائد أو عائلة تبحث عن المجتمع",
    shiftLabel:"التحول", shiftTitle:"من موقع كتيب عام إلى دعوة خاصة",
    shiftDesc:"ماذا لو توقفت عن اعتبار موقعك الإلكتروني مجرد كتيب عام، وبدأت اعتباره تجربة خاصة للعملاء المختارين؟",
    oldLabel:"الطريقة القديمة", oldTitle:"موقع عام", oldDesc:"الجميع يرى نفس الشيء. زوار مجهولون. صفر سياق لفريق المبيعات.",
    old1:"حركة مرور مجهولة", old2:"محتوى واحد يناسب الجميع", old3:"لا إشارات سلوكية", old4:"متابعات باردة",
    newLabel:"الطريقة الديناميكية", newTitle:"تجربة خاصة لكبار الشخصيات", newDesc:"كل مفتاح وصول كبار الشخصيات يفتح بوابة شخصية. الهوية تسبق الفعل.",
    new1:"الزوار المعروفون والمحددون", new2:"محتوى مخصص وفق شخصية المشتري", new3:"إشارات سلوكية في الوقت الفعلي", new4:"التواصل السياقي وفي الوقت المناسب",
    howLabel:"العملية", howTitle:"من الصندوق الفاخر إلى الحجز",
    howDesc:"يحصل العملاء المختارون على صندوق فاخر يحتوي على مفتاح وصول كبار الشخصيات — بطاقة مزودة بتقنية الاتصال قريب المدى ورسالة شخصية. تتكشف التجربة من هنا.",
    step1Title:"اختيار كبار الشخصيات", step1Desc:"يختار فريق المبيعات العملاء ذوي القيمة العالية ويخصص لكل منهم بطاقة الاتصال قريب المدى شخصية مرتبطة بملفهم.",
    step2Title:"التسليم الفاخر", step2Desc:"يتلقى العملاء صندوقًا فاخرًا مع مفتاح وصول كبار الشخصيات ودعوة شخصية: \"تفتح هذه البطاقة تجربة خاصة تم إنشاؤها لك.\"",
    step3Title:"النقر والاستكشاف", step3Desc:"نقرة واحدة تفتح بوابتهم الخاصة — مخططات طوابق مخصصة، الأسعار، المرافق، وأدوات الحجز، كلها مرتبطة بهويتهم.",
    step4Title:"التحليلات السلوكية", step4Desc:"كل تفاعل — مشاهدة مخططات الطوابق، طلبات الأسعار، حجز الزيارات — يُغذي لوحة التحكم الخاصة بك في الوقت الفعلي.",
    idLabel:"الفرق الرئيسي", idTitle:"نفس الموقع. نفس الإجراءات. ذكاء مختلف.", idTagline:"الهوية هي المضاعف.",
    idVipLabel:"حامل مفتاح وصول كبار الشخصيات", idVipTitle:"عميل معروف بالاسم — خالد الرشيد",
    idVipDesc:"تعرف أنه شاهد بنتهاوس Skyline ثلاث مرات، وحمل كتيب العائد على الاستثمار، وقضى 8 دقائق في خطط الدفع. يتصل فريق المبيعات بالسياق والتوقيت والعرض المناسب.",
    idVip1:"المتابعات الشخصية", idVip2:"الحوافز المخصصة", idVip3:"مبيعات بخدمة شخصية", idVip4:"الذكاء المعروف بالاسم",
    idAnonLabel:"زائر موقع مجهول", idAnonTitle:"مجهول — بيانات الشريحة فقط",
    idAnonDesc:"زار شخص صفحة البنتهاوس. لا تعرف من هو، كم مرة زار، أو ما الذي استكشفه أيضًا. العميل المحتمل في قائمة انتظار مع المئات غيره.",
    idAnon1:"بيانات على مستوى الشريحة", idAnon2:"التواصل العام", idAnon3:"تحسين التسويق", idAnon4:"لا إشارات محددة بالاسم",
    demoLabel:"العرض التجريبي المباشر", demoTitle:"شاهد التطبيق عمليًا — بيئات العرض التجريبي المباشرة",
    demoDesc:"استكشف بيئة العرض التجريبي بالكامل. تُظهر أربع بوابات كيف يحوّل DynamicNFC نفس المشروع إلى أربع تجارب مختلفة — من المستثمرين المتميزين إلى المتصفحين المجهولين.",
    demoBadge1:"مستثمر من كبار الشخصيات", demoCard1Title:"بوابة خالد الرشيد", demoCard1Desc:"تجربة المستثمر المتميز مع محتوى يركز على العائد على الاستثمار، وعروض وحدات بنتهاوس في الطوابق العليا، وتحليلات الاستثمار.",
    demoBadge2:"مشتري عائلة", demoCard2Title:"بوابة أحمد الفهد", demoCard2Desc:"تجربة مشترٍ متميز للمنازل تبرز وحدات عائلية من 3 غرف، والمناطق التعليمية، ومرافق المجتمع.",
    demoBadge3:"وصول عام", demoCard3Title:"السوق العالمي", demoCard3Desc:"تجربة تصفح للمستخدمين المجهولين والمسجلين مع محتوى متكيف بناءً على إشارات التفاعل.",
    demoBadge4:"التحليلات", demoCard4Title:"لوحة تحكم الشركة — التحليلات السلوكية", demoCard4Desc:"مؤشرات التفاعل في الوقت الفعلي، تقييم العملاء المحتملين، مسارات التحويل، واختبارات A/B. شاهد كيف يساهم كل نقرة في تعزيز خط المبيعات الخاص بك.",
    demoBadge5:"محرك الذكاء الاصطناعي", demoCard5Title:"خط مبيعات الذكاء الاصطناعي — عرض MCP مباشر",
    demoCard5Desc:"شاهد الذكاء الاصطناعي يدير Gmail وGoogle Calendar وDocuSign في الوقت الفعلي. كل إجراء يمكن التحقق منه — انقر للتأكيد في حساباتك الخاصة.",
    demoCta:"استكشف العرض التجريبي الكامل →",
    roiLabel:"لماذا هذا مهم", roiTitle:"الأمر لا يتعلق بالنقرات، بل بسرعة المبيعات.",
    roiDesc:"يتم قياس النجاح من خلال شيء واحد: سرعة انتقال العملاء المحتملين من أول نقرة إلى حجز الزيارة إلى توقيع الصفقة.",
    roiFlow1:"100 دعوة لكبار الشخصيات", roiFlow2:"وصول رقمي خاص", roiFlow3:"إشارات نية عالية",
    roiFlow4:"أولوية المبيعات", roiFlow5:"زيارات محجوزة أكثر", roiFlow6:"معدل إغلاق أعلى",
    roiMetric1Label:"معدل تحويل أعلى", roiMetric1Sub:"المدعوون من كبار الشخصيات مقابل حركة المرور المجهولة على الموقع",
    roiMetric2Label:"دورة اتخاذ القرار أسرع", roiMetric2Sub:"من أول نقرة حتى حجز الزيارة",
    roiMetric3Label:"تفاعل محدد بالهوية", roiMetric3Sub:"كل نقرة مرتبطة بعميل محتمل معروف",
    trustLabel:"مصمم للمؤسسات", trustTitle:"خصوصية أولاً، متكامل مع إدارة علاقات العملاء، بدون عوائق",
    trust1Icon:"🔒", trust1Title:"الموافقة حسب التصميم", trust1Desc:"النقرة الفعلية هي الموافقة المطلقة. الموافقة صريحة، الدعوات مقصودة، والوصول مُتحكم فيه.",
    trust2Icon:"📱", trust2Title:"الاتصال قريب المدى + QR احتياطي", trust2Desc:"الاتصال قريب المدى للوصول الفوري. رموز QR للتوافق الشامل. لا حاجة لتنزيل أي تطبيق.",
    trust3Icon:"🔗", trust3Title:"تكامل إدارة علاقات العملاء", trust3Desc:"يعمل فوق أنظمتك الحالية. يعزز إدارة علاقات العملاء الخاص بك بالذكاء السلوكي — لا يحل محله.",
    trust4Icon:"🤖", trust4Title:"التخصيص بالذكاء الاصطناعي", trust4Desc:"المحتوى يتكيف ديناميكيًا مع اهتمامات كل عميل، مرحلته، وتاريخ تفاعله.",
    faqLabel:"الأسئلة التي يطرحها التنفيذيون", faqTitle:"تم الإجابة عليها قبل أن تسألها",
    faq1Q:"هل هذا يحل محل موقعنا الإلكتروني أو نظام إدارة العملاء؟", faq1A:"لا. DynamicNFC هو طبقة تعمل فوق أنظمتك الحالية. موقعك الإلكتروني يظل يعمل، ونظام إدارة العملاء الخاص بك يظل يعمل. نحن نحسّن كلاهما باستخدام تحليلات سلوكية مرتبطة بالهوية لا يمكن لأي منهما جمعها بمفرده.",
    faq2Q:"كيف نقيس نجاح التجربة التجريبية؟", faq2A:"مؤشر واحد: زيادة عدد الزيارات المحجوزة بين المدعوين من كبار الشخصيات مقارنة بالمجموعة الضابطة. ليست النقرات، ولا مشاهدات الصفحة — بل النشاط الفعلي للمبيعات.",
    faq3Q:"ماذا عن خصوصية البيانات والامتثال؟", faq3A:"يتم تضمين الموافقة ضمن التجربة المادية. عندما يقوم العميل المحتمل بالنقر على بطاقة تلقاها عن قصد، فهذا يعني موافقة صريحة. لا أنماط مظلمة، ولا تتبع خفي. النقر هو الموافقة.",
    faq4Q:"ماذا يحصل عليه العميل المحتمل فعليًا؟", faq4A:"صندوق فاخر يحتوي على مفتاح وصول كبار الشخصيات مزود بتقنية الاتصال قريب المدى ورسالة شخصية. ليست نشرة تسويقية — بل دعوة خاصة.",
    faq5Q:"ما مدى سرعة التنفيذ؟", faq5A:"يمكن إطلاق برنامج تجريبي خلال 2–4 أسابيع. نقوم بإعداد بواباتك، وتصميم تجربة الصندوق الفاخر، وبرمجة بطاقات الاتصال قريب المدى، وربط لوحة التحليلات.",
    faq6Q:"ما هو العائد الحقيقي هنا؟", faq6A:"الأمر يتعلق بتقليل الوقت من \"مهتم\" إلى \"زيارة\" للنصف. عندما يتواصل فريق المبيعات في الوقت المناسب ومع السياق الصحيح، تتسارع القرارات.",
    ctaLabel:"جاهز للتنفيذ", ctaTitle:"أنت لا توزع بطاقات الاتصال قريب المدى. أنت تصدر دعوات خاصة.",
    ctaDesc:"حوّل النية الرقمية إلى زخم حقيقي في المبيعات. ابدأ تجربة مع 100 دعوة لكبار الشخصيات وقِس الفرق في الزيارات المحجوزة خلال 30 يومًا.",
    ctaPilot:"طلب برنامج تجريبي →", ctaDemo:"استكشف العرض التجريبي المباشر",
    modalTitle:"طلب برنامج تجريبي", modalSub:"أخبرنا عن مشروعك وسنصمم برنامج تجريبي مخصص — 100 دعوة لكبار الشخصيات، لوحة تحكم تحليلات كاملة، ونتائج قابلة للقياس خلال 30 يومًا.",
    modalSec1:"معلومات الاتصال", modalSec2:"الشركة والدور الوظيفي", modalSec3:"تفاصيل المشروع", modalSec4:"التحديات الحالية",
    modalSubmit:"إرسال طلب تجربة تجريبية →", modalSubmitting:"إرسال...",
    modalNote:"نرد خلال 24 ساعة. معلوماتك محفوظة بسرية تامة.",
    successTitle:"تم تقديم طلب تجربة تجريبية", successDesc:"شكرًا لك. سيقوم فريق الشركات بمراجعة تفاصيل مشروعك والتواصل خلال 24 ساعة لتصميم برنامجك التجريبي المخصص.",
    successClose:"إغلاق",
    footerText:"© 2026 DynamicNFC — محرك تسريع المبيعات للعقارات والسيارات",
    indChoose:"اختر قطاعك", indAll:"جميع القطاعات", indRE:"العقارات", indAuto:"السيارات",
    prob1Desc_auto:"85% من زوار صالة العرض يتصفحون دون الكشف عن هويتهم — فريق المبيعات لا يعرف من شاهد AMG GT 63 S ثلاث مرات",
    prob2Desc_auto:"يتواصل فرق المبيعات متأخرًا، دون معرفة الموديلات أو التكوينات أو خيارات التمويل التي استكشفها العملاء",
    prob3Desc_auto:"كل عميل محتمل يحصل على نفس العرض — سواء كان جامع سيارات فاخرة يبحث عن التميز أو عائلة تبحث عن ترقية SUV",
    step3Desc_auto:"نقرة واحدة تفتح بوابة صالة العرض الخاصة — مجموعات سيارات مخصصة، تكوينات، أسعار، وحجز تجارب القيادة، كلها مرتبطة بهوية VIP.",
    step4Desc_auto:"كل تفاعل — مشاهدة موديلات، حفظ تكوينات، استكشاف التمويل، حجز تجارب القيادة — يُغذي لوحة تحكم التاجر في الوقت الفعلي.",
    idVipTitle_auto:"عميل معروف بالاسم — خالد المنصوري",
    idVipDesc_auto:"تعرف أنه كوّن AMG GT 63 S بلون أسود أوبسيديان، وفتح حاسبة التمويل، وقارنها مع G 63، وقضى 12 دقيقة في خطط الدفع. يتصل فريق المبيعات بالمواصفات الدقيقة، وتوفر تجربة القيادة، وعرض تمويل VIP.",
    demoTitle_re:"شاهد التطبيق عمليًا — نور ريزيدنسز",
    demoTitle_auto:"شاهد التطبيق عمليًا — بريستيج موتورز",
    autoDemo1Title:"بوابة خالد المنصوري", autoDemo1Desc:"تجربة VIP للسيارات مع التركيز على أداء AMG، والتكوينات المحفوظة، والوصول إلى حاسبة التمويل.",
    autoDemo2Title:"بوابة سلطان الظاهري", autoDemo2Desc:"تجربة مشتري SUV الفاخر مع إبراز Maybach GLS 600، G 63، وحجز تجربة قيادة حصرية.",
    autoDemo3Title:"صالة العرض العامة", autoDemo3Desc:"تجربة الزائر العادي مع تصفح المخزون الكامل، ومقارنة السيارات، والتقاط العملاء المحتملين.",
    autoDemo4Title:"لوحة تحكم التاجر", autoDemo4Desc:"تحليلات التفاعل في الوقت الفعلي، تقييم العملاء، محفزات المبيعات، مسارات التحويل، والذكاء السلوكي لكبار الشخصيات.",
    faq2A_auto:"مؤشر واحد: زيادة حجوزات تجارب القيادة بين حاملي بطاقات VIP مقارنة بالمجموعة الضابطة من الزوار العاديين. ليست النقرات، ولا مشاهدات الصفحة — بل النشاط الفعلي لصالة العرض.",
    roiFlow5_auto:"حجوزات تجارب قيادة أكثر",
    modalIndustry:"القطاع", modalIndustryPlaceholder:"اختر قطاعك",
  },
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Enterprise() {
  const { lang } = useLanguage();
  const [industry, setIndustry] = useState(null);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [pilotSuccess, setPilotSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const isRTL = lang === 'ar';
  const ind = industry;
  const isRE = ind === 're';
  const isAuto = ind === 'auto';
  const isOverview = ind === null;
  const t = useCallback((k) => TR[lang]?.[k] || TR.en[k] || k, [lang]);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.ent-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Smooth scroll */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Pilot modal */
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
    data._subject = `Pilot Program Request — ${data.company} / ${data.project}`;
    try {
      await fetch('https://formsubmit.co/ajax/info@dynamicnfc.help', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      setPilotSuccess(true);
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'pilot_request',
          event_label: data.company || 'unknown',
        });
      }
    } catch { alert('Error submitting. Please try again.'); }
    setSubmitting(false);
  };

  /* Particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 20}s`,
    animationDuration: `${15 + Math.random() * 10}s`,
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
      <SEO title="Enterprise" description="Sales Velocity Engine for real estate developers and automotive dealers. Private VIP portals with behavioral intelligence." path="/enterprise" />
      <div className="ent-bg-mesh" />
      <div className="ent-particles">
        {particles.map((p, i) => <div key={i} className="ent-particle" style={p} />)}
      </div>

      {/* Navbar is now global — rendered in App.jsx */}

      {/* ═══ HERO ═══ */}
      <section className="ent-hero">
        <div className="ent-nfc-anim">
          <div className="ent-nfc-waves-wrap"><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /><div className="ent-nfc-wave" /></div>
          <div className="ent-nfc-card-icon"><NfcIcon /></div>
        </div>
        <div className="ent-hero-badge">{t('heroBadge')}</div>
        <h1>{t(isAuto ? 'heroTitle_auto' : isRE ? 'heroTitle_re' : 'heroTitle')}</h1>
        <p className="ent-hero-sub">{t(isAuto ? 'heroSub_auto' : isRE ? 'heroSub_re' : 'heroSub')}</p>
        <div className="ent-hero-stats">
          <div className="ent-stat"><span className="ent-stat-val">3.2×</span><span className="ent-stat-lbl">{t('statConversion')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">47%</span><span className="ent-stat-lbl">{t('statDecision')}</span></div>
          <div className="ent-stat"><span className="ent-stat-val">100%</span><span className="ent-stat-lbl">{t('statIdentified')}</span></div>
        </div>
        <div className="ent-hero-ctas">
          <button className="ent-btn-primary" onClick={openPilot}>{t('heroCtaPilot')}</button>
          <button className="ent-btn-secondary" onClick={() => scrollTo('demo')}>{t('heroCtaDemo')}</button>
        </div>
        {/* Industry Selector */}
        <div className="ent-industry-selector">
          <div className="ent-ind-label">{t('indChoose')}</div>
          <div className="ent-ind-tabs">
            <button className={`ent-ind-tab ${ind === null ? 'active' : ''}`} onClick={() => setIndustry(null)}>{t('indAll')}</button>
            <button className={`ent-ind-tab ${ind === 're' ? 'active' : ''}`} onClick={() => setIndustry('re')}>{t('indRE')}</button>
            <button className={`ent-ind-tab ${ind === 'auto' ? 'active' : ''}`} onClick={() => setIndustry('auto')}>{t('indAuto')}</button>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ PROBLEM ═══ */}
      <section className="ent-section ent-problem ent-reveal" id="problem">
        <div className="ent-section-label red">{t('probLabel')}</div>
        <div className="ent-section-title">{t('probTitle')}</div>
        <p className="ent-problem-quote" dangerouslySetInnerHTML={{ __html: t('probQuote') }} />
        <div className="ent-problem-cards">
          {[1, 2, 3].map(i => (
            <div className="ent-problem-card" key={i}>
              <div className="ent-problem-card-icon">{t(`prob${i}Icon`)}</div>
              <h4>{t(`prob${i}Title`)}</h4>
              <p>{t(isAuto ? `prob${i}Desc_auto` : `prob${i}Desc`)}</p>
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
            <span className="re-roi-banner-badge">SALES VELOCITY TOOL</span>
            <h3>How much revenue would <em>100</em> VIP invitations generate?</h3>
            <p>Plug in your project numbers — see the projected impact on viewings, conversion, and sales pipeline in real time.</p>
          </div>
          <Link to="/sales/roi-calculator" className="re-roi-banner-btn">
            Calculate Your ROI
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ THE SHIFT ═══ */}
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="ent-section ent-reveal" id="how">
        <div className="ent-section-label teal">{t('howLabel')}</div>
        <div className="ent-section-title">{t('howTitle')}</div>
        <p className="ent-section-desc">{t('howDesc')}</p>
        <div className="ent-steps-row">
          {[1,2,3,4].map(i => (
            <div className="ent-step-card" key={i}>
              <div className="ent-step-num">{i}</div>
              <h4>{t(`step${i}Title`)}</h4>
              <p>{t((isAuto && (i === 3 || i === 4)) ? `step${i}Desc_auto` : `step${i}Desc`)}</p>
              {i < 4 && <div className="ent-step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ VIP vs ANONYMOUS ═══ */}
      <section className="ent-section ent-identity ent-reveal">
        <div className="ent-section-label red">{t('idLabel')}</div>
        <div className="ent-section-title">{t('idTitle')}</div>
        <div className="ent-identity-tagline">{t('idTagline')}</div>
        <div className="ent-identity-grid">
          <div className="ent-identity-card vip">
            <div className="ent-card-label">{t('idVipLabel')}</div>
            <h3>{t(isAuto ? 'idVipTitle_auto' : 'idVipTitle')}</h3>
            <p>{t(isAuto ? 'idVipDesc_auto' : 'idVipDesc')}</p>
            <div className="ent-identity-features">
              {['idVip1','idVip2','idVip3','idVip4'].map(k => <span className="ent-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
          <div className="ent-identity-card anon">
            <div className="ent-card-label">{t('idAnonLabel')}</div>
            <h3>{t('idAnonTitle')}</h3>
            <p>{t('idAnonDesc')}</p>
            <div className="ent-identity-features">
              {['idAnon1','idAnon2','idAnon3','idAnon4'].map(k => <span className="ent-identity-feature" key={k}>{t(k)}</span>)}
            </div>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ LIVE DEMO ═══ */}
      <section className="ent-section ent-demo ent-reveal" id="demo">
        <div className="ent-section-label blue">{t('demoLabel')}</div>
        <div className="ent-section-title">{t(isAuto ? 'demoTitle_auto' : isRE ? 'demoTitle_re' : 'demoTitle')}</div>
        <p className="ent-section-desc" style={{ margin: '0 auto' }}>{t('demoDesc')}</p>
        <div className="ent-demo-showcase">
          <div className="ent-demo-portals">
            {/* ── REAL ESTATE DEMO PORTALS ── */}
            {(isOverview || isRE) && (<>
              <a href="/enterprise/crmdemo/khalid" target="_blank" rel="noreferrer" className="ent-demo-portal" >
                <div className="ent-portal-badge red">{t('demoBadge1')}</div>
                <div className="ent-portal-avatar red">KR</div>
                <h4>{t('demoCard1Title')}</h4>
                <p>{t('demoCard1Desc')}</p>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
              <a href="/enterprise/crmdemo/ahmed" target="_blank" rel="noreferrer" className="ent-demo-portal" >
                <div className="ent-portal-badge blue">{t('demoBadge2')}</div>
                <div className="ent-portal-avatar blue">AF</div>
                <h4>{t('demoCard2Title')}</h4>
                <p>{t('demoCard2Desc')}</p>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
              <a href="/enterprise/crmdemo/marketplace" target="_blank" rel="noreferrer" className="ent-demo-portal" >
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
            </>)}

            {/* ── AUTOMOTIVE DEMO PORTALS ── */}
            {(isOverview || isAuto) && (<>
              <a href="/automotive/demo/khalid" className="ent-demo-portal">
                <div className="ent-portal-badge gold">&#9733; VIP Client</div>
                <div className="ent-portal-avatar red">KM</div>
                <h4>{t('autoDemo1Title')}</h4>
                <p>{t('autoDemo1Desc')}</p>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
              <a href="/automotive/demo/sultan" className="ent-demo-portal">
                <div className="ent-portal-badge gold">&#9733; VIP Client</div>
                <div className="ent-portal-avatar blue">SD</div>
                <h4>{t('autoDemo2Title')}</h4>
                <p>{t('autoDemo2Desc')}</p>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
              <a href="/automotive/demo/showroom" className="ent-demo-portal">
                <div className="ent-portal-badge teal">&#127760; Public</div>
                <div className="ent-portal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{color:'var(--teal)'}}>
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <h4>{t('autoDemo3Title')}</h4>
                <p>{t('autoDemo3Desc')}</p>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
            </>)}

            {/* ── DASHBOARDS (always visible) ── */}
            {(isOverview || isRE) && (
              <a href="/enterprise/crmdemo/dashboard" target="_blank" rel="noreferrer" className="ent-demo-portal ent-demo-portal-featured" >
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
            )}
            {(isOverview || isAuto) && (
              <a href="/automotive/dashboard" className="ent-demo-portal ent-demo-portal-featured">
                <div className="ent-portal-badge gold">&#128202; Analytics</div>
                <div className="ent-portal-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{color:'var(--gold)'}}>
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div><h4>{t('autoDemo4Title')}</h4><p>{t('autoDemo4Desc')}</p></div>
                <div className="ent-portal-arrow"><ArrowIcon /></div>
              </a>
            )}

            {/* ── AI DEMO (always visible) ── */}
            <a href="/enterprise/crmdemo/ai-demo" target="_blank" rel="noreferrer" className="ent-demo-portal ent-demo-portal-featured" >
              <div className="ent-portal-badge purple">{t('demoBadge5')}</div>
              <div className="ent-portal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--purple)' }}>
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div>
                <h4>{t('demoCard5Title')}</h4>
                <p>{t('demoCard5Desc')}</p>
              </div>
              <div className="ent-portal-arrow"><ArrowIcon /></div>
            </a>
          </div>
          <div className="ent-demo-cta-row">
            <Link to="/enterprise/crmdemo/" className="ent-btn-primary" >{t('demoCta')}</Link>
          </div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ ROI ═══ */}
      <section className="ent-section ent-roi ent-reveal" id="roi">
        <div className="ent-section-label red">{t('roiLabel')}</div>
        <div className="ent-section-title">{t('roiTitle')}</div>
        <p className="ent-section-desc" style={{ margin: '0 auto 1.5rem' }}>{t('roiDesc')}</p>
        <div className="ent-roi-flow">
          {['roiFlow1','roiFlow2','roiFlow3','roiFlow4','roiFlow5','roiFlow6'].map((k, i, a) => (
            <React.Fragment key={k}>
              <div className={`ent-roi-step${k === 'roiFlow6' ? ' ent-roi-highlight' : ''}`}>{t((isAuto && k === 'roiFlow5') ? 'roiFlow5_auto' : k)}</div>
              {i < a.length - 1 && <span className="ent-roi-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="ent-roi-metrics">
          <div className="ent-roi-card"><div className="ent-roi-big red">3.2×</div><div className="ent-roi-label">{t('roiMetric1Label')}</div><div className="ent-roi-sub">{t('roiMetric1Sub')}</div></div>
          <div className="ent-roi-card"><div className="ent-roi-big blue">47%</div><div className="ent-roi-label">{t('roiMetric2Label')}</div><div className="ent-roi-sub">{t('roiMetric2Sub')}</div></div>
          <div className="ent-roi-card"><div className="ent-roi-big gold">100%</div><div className="ent-roi-label">{t('roiMetric3Label')}</div><div className="ent-roi-sub">{t('roiMetric3Sub')}</div></div>
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ TRUST ═══ */}
      <section className="ent-section ent-reveal">
        <div className="ent-section-label teal">{t('trustLabel')}</div>
        <div className="ent-section-title">{t('trustTitle')}</div>
        <div className="ent-trust-grid">
          {[
            { i: 1, c: 'red' }, { i: 2, c: 'blue' }, { i: 3, c: 'teal' }, { i: 4, c: 'gold' },
          ].map(({ i, c }) => (
            <div className="ent-trust-item" key={i}>
              <div className={`ent-trust-icon ${c}`}>{t(`trust${i}Icon`)}</div>
              <h4>{t(`trust${i}Title`)}</h4>
              <p>{t(`trust${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ent-divider" />

      {/* ═══ FAQ ═══ */}
      <section className="ent-section ent-reveal">
        <div className="ent-section-label blue">{t('faqLabel')}</div>
        <div className="ent-section-title">{t('faqTitle')}</div>
        <div className="ent-faq-grid">
          {[1,2,3,4,5,6].map(i => (
            <div className="ent-faq-card" key={i}>
              <div className="ent-faq-q">{t(`faq${i}Q`)}</div>
              <div className="ent-faq-a">{t((isAuto && i === 2) ? 'faq2A_auto' : `faq${i}A`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="ent-cta-section ent-reveal" id="pilot">
        <div className="ent-section-label red" style={{ marginBottom: '1.5rem' }}>{t('ctaLabel')}</div>
        <h2>{t('ctaTitle')}</h2>
        <p>{t('ctaDesc')}</p>
        <div className="ent-cta-buttons">
          <button className="ent-btn-primary" onClick={openPilot}>{t('ctaPilot')}</button>
          <Link to="/enterprise/crmdemo" className="ent-btn-secondary" >{t('ctaDemo')}</Link>
        </div>
      </section>

      {/* ═══ PILOT MODAL ═══ */}
      <div className={`ent-pilot-backdrop${pilotOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePilot(); }}>
        <div className="ent-pilot-modal" onClick={(e) => e.stopPropagation()}>
          {!pilotSuccess ? (
            <>
              <div className="ent-pilot-header">
                <h3>{t('modalTitle')}</h3>
                <button className="ent-pilot-close" onClick={closePilot}>✕</button>
              </div>
              <p className="ent-pilot-sub">{t('modalSub')}</p>
              <form className="ent-pilot-form" ref={formRef} onSubmit={handleSubmit}>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="ent-pilot-field full">
                  <label className="ent-pilot-label">{t('modalIndustry')} <span className="req">*</span></label>
                  <select className="ent-pilot-select" name="industry" required defaultValue="">
                    <option value="" disabled>{t('modalIndustryPlaceholder')}</option>
                    <option value="real_estate_developer">Real Estate Developer</option>
                    <option value="real_estate_agent">Real Estate Agent / Brokerage</option>
                    <option value="automotive">Automotive Dealership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="ent-pilot-section-label">{t('modalSec1')}</div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">First Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="firstName" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Last Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="lastName" required />
                  </div>
                </div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Business Email <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="email" name="email" required />
                  </div>
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
                      <option value="director-sales">Director of Sales</option>
                      <option value="gm">General Manager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="ent-pilot-divider" />
                <div className="ent-pilot-section-label">{t('modalSec3')}</div>
                <div className="ent-pilot-row">
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Project Name <span className="req">*</span></label>
                    <input className="ent-pilot-input" type="text" name="project" required />
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Project Type <span className="req">*</span></label>
                    <select className="ent-pilot-select" name="projectType" required defaultValue="">
                      <option value="" disabled>Select type</option>
                      <option value="tower-highrise">Residential Tower</option>
                      <option value="branded-residences">Branded Residences</option>
                      <option value="luxury-villa">Luxury Villas</option>
                      <option value="mega-project">Mega-Project</option>
                      <option value="mixed-use">Mixed-Use</option>
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
                      <option value="50-100">50 – 100</option>
                      <option value="100-500">100 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div className="ent-pilot-field">
                    <label className="ent-pilot-label">Location</label>
                    <input className="ent-pilot-input" type="text" name="location" />
                  </div>
                </div>

                <div className="ent-pilot-divider" />
                <div className="ent-pilot-section-label">{t('modalSec4')}</div>
                <div className="ent-pilot-field full">
                  <label className="ent-pilot-label">Biggest sales challenge?</label>
                  <select className="ent-pilot-select" name="challenge" defaultValue="">
                    <option value="" disabled>Select challenge</option>
                    <option value="anonymous-traffic">Anonymous website traffic</option>
                    <option value="slow-followup">Slow follow-up</option>
                    <option value="low-conversion">Low conversion to viewings</option>
                    <option value="generic-outreach">Generic outreach</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="ent-pilot-field full">
                  <label className="ent-pilot-label">Notes</label>
                  <textarea className="ent-pilot-textarea" name="notes" />
                </div>

                <button type="submit" className="ent-pilot-submit" disabled={submitting}>
                  {submitting ? t('modalSubmitting') : t('modalSubmit')}
                </button>
                <p className="ent-pilot-note">{t('modalNote')}</p>
              </form>
            </>
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

      {/* ═══ FOOTER ═══ */}
      <footer className="ent-footer">
        <p>{t('footerText').includes('DynamicNFC') ? (
          <>© 2026 <a href="https://dynamicnfc.ca" >DynamicNFC</a> — {lang === 'ar' ? 'محرك تسريع المبيعات للعقارات والسيارات' : 'Sales Velocity Engine for Real Estate & Automotive'}</>
        ) : t('footerText')}</p>
      </footer>
    </div>
  );
}

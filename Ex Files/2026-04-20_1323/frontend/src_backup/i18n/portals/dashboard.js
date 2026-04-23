import { registerTranslations } from "../index";

const dashboard = {
  en: {
    // Header
    headerTitle: "Al Noor Residences",
    headerSub: "VIP Behavioral Intelligence",
    liveDemo: "Live Demo",
    envBadge: "Al Noor Residences",
    help: "Help",
    createVip: "+ Create VIP",
    resetDemo: "Reset Demo",

    // Nav
    navOverview: "Overview",
    navVipCrm: "VIP CRM",
    navPriority: "Priority VIP",
    navAnalytics: "Analytics",
    navUnits: "Units & Plans",
    navCampaigns: "Campaigns",
    navSettings: "Settings",
    navVipPortal: "VIP Portal",
    navLoginPortal: "Login Portal",
    navMarketplace: "Marketplace",

    // Executive Banner
    execView: "Executive View",
    execDesc:
      "Conversions are identical for VIP and Standard traffic. The only difference is identity. VIP has vip_id enabling 1-to-1 outreach; Standard uses anon_id for segment marketing.",
    kpi1: "Primary KPI: Booked Viewings uplift",
    kpi2: "Time-decay scoring (7d half-life)",
    kpi3: "Shared actions: Book, Pricing, Payment Plan, Brochure",

    // KPIs
    mVipSessions: "VIP Sessions",
    mRegSessions: "Registered",
    mAnonSessions: "Anonymous",
    mTotalConversions: "Conversions",
    mBookedViewings: "Booked Viewings",
    mVipSub: "Person known via NFC",
    mRegSub: "Marketplace sign-ups",
    mAnonSub: "Standard web traffic",
    mConvSub: "All shared actions",

    // Velocity KPIs
    mViewingVelocity: "Viewing Velocity",
    mViewingVelSub: "Avg days to first booking",
    mTimeToAction: "Time to First Action",
    mTimeToActionSub: "Avg mins from tap to first view",
    mVipConvLift: "VIP Conversion Lift",
    mVipConvLiftSub: "VIP vs Standard booking rate",
    mLeadCaptureRate: "Lead Capture Rate",
    mLeadCaptureSub: "Anonymous \u2192 Lead conversion",

    // Shared Conversions
    sharedConversions: "Shared Conversion Actions",
    badgeVipStd: "VIP + Standard \u00b7 Non-linear",
    actBookViewing: "Book a Viewing",
    actRequestPricing: "Request Pricing",
    actRequestPayment: "Request Payment Plan",
    actDownloadBrochure: "Download Brochure",

    // Activity Feed
    liveActivityFeed: "Live Activity Feed",
    realtimeInteractions: "Real-time portal interactions",
    feedAll: "All",
    feedVip: "VIP",
    feedRegistered: "Registered",

    // VIP Summary
    vipActivitySummary: "VIP Activity Summary",
    highPrioritySignals: "High-priority VIP signals",
    hotLeads: "Hot Leads",
    activeAlerts: "Active Alerts",
    avgLeadScore: "Avg Lead Score",

    // Charts
    engagementOverTime: "Engagement Over Time",
    channelMix: "Channel Mix",
    towerInterestDist: "Tower Interest Distribution",
    allTrafficCombined: "All traffic combined",
    chartVip: "VIP",
    chartRegistered: "Registered",
    chartAnonymous: "Anonymous",
    actionPerformance: "Action Performance",
    vipVsStandard: "VIP vs Standard comparison",
    topPlansByInterest: "Top Plans by Interest",
    allTraffic: "All traffic",

    // Score Distribution
    scoreDistribution: "Lead Score Distribution",
    scoreDistSub: "Pipeline health across all contacts",
    scoreBand0: "0-20 Cold",
    scoreBand20: "20-40 Warm",
    scoreBand40: "40-60 Engaged",
    scoreBand60: "60-80 Hot",
    scoreBand80: "80+ Ready",

    // VIP CRM
    vipDirectory: "VIP Directory",
    personKnown: "Person known",
    vipProfiles: "VIP Profiles",
    selectVipPrompt:
      "Select a VIP from the directory to view their behavioral timeline, intent signals, and suggested outreach.",
    outreachBtn: "Outreach",
    reissueLink: "Reissue Link",
    leadScore: "Lead Score",
    repeatViews: "Repeat Views",
    pricingSignal: "Pricing Signal",
    comparisons: "Comparisons",
    alerts: "Alerts",
    salesRep: "Sales Rep",
    card: "Card",
    campaign: "Campaign",
    timeline: "Timeline",
    lastSeen: "Last seen",

    // Sales Trigger
    salesTrigger: "Sales Trigger",
    whyCallNow: "Why call now?",
    daysIdle: "Days Idle",
    atRisk: "AT RISK",
    decayedScore: "Decayed Score",

    // VIP Candidate
    vipCandidate: "VIP Candidate",
    promoteToVip: "Promote to VIP",
    vipCandidateDesc:
      "Registered users scoring above threshold \u2014 issue NFC cards",

    // Priority
    priorityVipList: "Priority VIP List",
    dailySalesCockpit: "Daily sales cockpit",
    prioritySortedDesc:
      "Sorted by time-decayed score. Recency-weighted: recent actions rank higher.",
    thVip: "VIP",
    thVipCode: "VIP Code",
    thTopTower: "Top Tower",
    thLeadScore: "Lead Score",
    thAlerts: "Alerts",
    thLastSeen: "Last Seen",
    thAction: "Action",
    thTrigger: "Trigger",
    thDaysIdle: "Idle",
    nextBestActions: "Next Best Actions",
    autoSuggested: "Auto-suggested based on VIP behavior",
    quickActions: "Quick Actions",
    bulkOps: "Bulk operations",
    emailHighIntent: "Email All High Intent VIPs",
    exportPriorityList: "Export Priority List",
    reminderLabel: "Reminder:",
    reminderText:
      "VIP actions are for 1-to-1 outreach (call, SMS, email). Standard actions are for segment marketing.",

    // Alerts
    alertPricing: "Pricing Interest",
    alertHighIntent: "High Intent",
    alertComparing: "Comparing Plans",
    alertFamily: "Family Buyer",

    // Analytics
    analytics: "Analytics",
    standardVip: "Standard + VIP",
    vipIntentHeatmap: "VIP Intent Heatmap (Live)",
    propertyDemandHeatmap: "Property Demand Heatmap (Live)",
    guidance: "Guidance",
    heatPenthouse: "Penthouse",
    heat3br: "3BR",
    heat2br: "2BR",
    heat1br: "1BR",
    floorLow: "Low (1-4)",
    floorMid: "Mid (5-8)",
    floorHigh: "High (9-12)",
    guideLowClicks: "Low clicks \u2260 low demand",
    guideLowClicksDesc:
      "Improve media, naming, and clarity before changing price.",
    guidePricing: "Pricing signals = follow-up signals",
    guidePricingDesc:
      "For VIP: call with payment plan. For Standard: add pricing CTA.",
    guideMvp: "MVP guardrail",
    guideMvpDesc:
      "Dashboard exists to increase booked viewings, not analytics for analytics.",

    // Units
    unitsFloorPlans: "Units & Floor Plans",
    thUnitId: "Unit ID",
    thName: "Name",
    thTower: "Tower",
    thFloor: "Floor",
    thType: "Type",
    thStatus: "Status",
    thPrice: "Price",
    thVipInterest: "VIP Interest",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    filterAll: "All",
    zeroEngagement: "ZERO ENGAGEMENT",

    // Campaigns
    campaigns: "Campaigns",
    cardIssuance: "VIP card issuance linked to campaigns",
    campaignsDesc:
      "VIP cards are issued as premium invitations linked to a campaign for tracking and reporting.",
    active: "Active",
    paused: "Paused",

    // Settings
    settings: "Settings",
    mvpControls: "MVP controls",
    dataBoundaries: "Data Boundaries",
    keepSimple: "Keep it simple, secure, and compliant",
    mvpLock: "MVP Lock",
    outOfScope: "Out of scope for current phase",
    s1: "VIP tracking requires explicit invitation via physical NFC card.",
    s2: "Standard tracking remains anonymous and cohort-based.",
    s3: "Role-based access: sales reps see only assigned VIPs.",
    s4: "Magic links must expire and support revoke/reissue.",
    s5: "Out of scope: dynamic pricing, automation workflows, WhatsApp, CRM replacement.",
    s6: "Event types: page_view and cta_click only.",
    s7: "CTA names fixed: book_viewing, request_pricing, request_payment_plan, download_brochure.",
    s8: "Success metric: booked viewings uplift.",

    // Modals
    createVipTitle: "Create VIP",
    createVipDesc:
      "Sales rep assigns a card and links a campaign. VIP ID will be generated.",
    lblFullName: "Full name",
    lblPhone: "Phone",
    lblEmail: "Email",
    lblPrefLang: "Preferred language",
    lblCampaign: "Campaign",
    lblCardId: "Card ID",
    createVipNote:
      "By issuing a VIP card, the prospect receives a premium invitation box stating private access. This supports consent and premium positioning.",
    createVipSubmit: "Create VIP",
    howThisWorks: "How This Works",
    vipTraffic: "VIP Traffic",
    vipTrafficDesc:
      "Enters via NFC Magic Link. Identity known via vip_id. Use insights for 1-to-1 outreach. Goal: booked viewings uplift.",
    stdTraffic: "Standard Traffic",
    stdTrafficDesc:
      "Enters via Ads, SEO, Direct. Identity unknown via anon_id. Use segments and content to optimize marketing.",
    keyRule: "Key Rule:",
    keyRuleDesc:
      "The actions are shared and non-linear. The only difference between VIP and Standard is identity and how you activate follow-up.",
    vipOutreach: "VIP Outreach",
    outreachDesc:
      "1-to-1 outreach. Concierge tone. Reference interest signals, not surveillance.",
    callScript: "Call Script",
    emailSnippet: "Email Snippet",
    guardrailLabel: "Guardrail:",
    guardrailDesc:
      "Do not say you tracked them. Say you are following up on their private invitation and can help with pricing, viewing, and payment options.",
    leadPipeline: "Lead Pipeline",
    scoredContacts: "Scored contacts across all channels",
    unitPerformance: "Unit Performance",
    residenceAnalytics: "Residence engagement analytics",
    eventsTracked: "events tracked",
    close: "Close",
    conversionFunnel: "Conversion Funnel",
    totalVisitors: "Total Visitors",
    viewedUnit: "Viewed Unit",
    downloaded: "Downloaded",
    requestedPricing: "Requested Pricing",
    bookedViewing: "Booked Viewing",
    dropOff: "drop-off",
    mAgo: "m ago",
    hAgo: "h ago",
    dAgo: "d ago",
    justNow: "just now",
  },

  ar: {
    // Header
    headerTitle: "نور ريزيدنسز",
    headerSub: "الذكاء السلوكي لكبار العملاء",
    liveDemo: "عرض تجريبي مباشر",
    envBadge: "نور ريزيدنسز",
    help: "المساعدة",
    createVip: "+ إنشاء عميل مميز",
    resetDemo: "إعادة تعيين العرض",

    // Nav
    navOverview: "نظرة عامة",
    navVipCrm: "إدارة العملاء المميزين",
    navPriority: "أولوية العملاء المميزين",
    navAnalytics: "التحليلات",
    navUnits: "الوحدات والمخططات",
    navCampaigns: "الحملات",
    navSettings: "الإعدادات",
    navVipPortal: "بوابة العملاء المميزين",
    navLoginPortal: "بوابة تسجيل الدخول",
    navMarketplace: "السوق العقاري",

    // Executive Banner
    execView: "العرض التنفيذي",
    execDesc:
      "معدلات التحويل متطابقة بين زيارات العملاء المميزين والزيارات العادية. الفارق الوحيد هو الهوية: العميل المميز يحمل معرّفًا فريدًا يتيح التواصل المباشر، بينما الزائر العادي يحمل معرّفًا مجهولًا يُستخدم في التسويق القطاعي.",
    kpi1: "المؤشر الرئيسي: ارتفاع حجوزات المعاينة",
    kpi2: "التقييم بالاضمحلال الزمني (نصف عمر 7 أيام)",
    kpi3: "الإجراءات المشتركة: حجز، تسعير، خطة دفع، كتيّب",

    // KPIs
    mVipSessions: "جلسات العملاء المميزين",
    mRegSessions: "المسجّلون",
    mAnonSessions: "المجهولون",
    mTotalConversions: "التحويلات",
    mBookedViewings: "حجوزات المعاينة",
    mVipSub: "عميل معروف عبر بطاقة NFC",
    mRegSub: "المسجّلون عبر السوق العقاري",
    mAnonSub: "زوّار الموقع العاديون",
    mConvSub: "جميع الإجراءات المشتركة",

    // Velocity KPIs
    mViewingVelocity: "سرعة المعاينة",
    mViewingVelSub: "متوسط الأيام حتى أول حجز",
    mTimeToAction: "الوقت حتى أول إجراء",
    mTimeToActionSub: "متوسط الدقائق من النقر حتى أول مشاهدة",
    mVipConvLift: "ارتفاع تحويل العملاء المميزين",
    mVipConvLiftSub: "مقارنة معدل الحجز: مميز مقابل عادي",
    mLeadCaptureRate: "معدل استقطاب العملاء المحتملين",
    mLeadCaptureSub: "تحويل الزائر المجهول إلى عميل محتمل",

    // Shared Conversions
    sharedConversions: "إجراءات التحويل المشتركة",
    badgeVipStd: "مميز + عادي · غير خطي",
    actBookViewing: "حجز معاينة",
    actRequestPricing: "طلب التسعير",
    actRequestPayment: "طلب خطة الدفع",
    actDownloadBrochure: "تحميل الكتيّب",

    // Activity Feed
    liveActivityFeed: "سجل النشاط المباشر",
    realtimeInteractions: "التفاعلات الفورية على البوابة",
    feedAll: "الكل",
    feedVip: "مميز",
    feedRegistered: "مسجّل",

    // VIP Summary
    vipActivitySummary: "ملخص نشاط العملاء المميزين",
    highPrioritySignals: "إشارات ذات أولوية عالية",
    hotLeads: "عملاء محتملون نشطون",
    activeAlerts: "التنبيهات الفعّالة",
    avgLeadScore: "متوسط تقييم العملاء",

    // Charts
    engagementOverTime: "التفاعل عبر الزمن",
    channelMix: "توزيع القنوات",
    towerInterestDist: "توزيع الاهتمام حسب الأبراج",
    allTrafficCombined: "إجمالي جميع الزيارات",
    chartVip: "مميز",
    chartRegistered: "مسجّل",
    chartAnonymous: "مجهول",
    actionPerformance: "أداء الإجراءات",
    vipVsStandard: "مقارنة العملاء المميزين بالعاديين",
    topPlansByInterest: "أكثر المخططات طلبًا",
    allTraffic: "جميع الزيارات",

    // Score Distribution
    scoreDistribution: "توزيع تقييمات العملاء",
    scoreDistSub: "مؤشر صحة خط المبيعات عبر جميع جهات الاتصال",
    scoreBand0: "0-20 بارد",
    scoreBand20: "20-40 دافئ",
    scoreBand40: "40-60 مهتم",
    scoreBand60: "60-80 نشط",
    scoreBand80: "80+ جاهز للشراء",

    // VIP CRM
    vipDirectory: "دليل العملاء المميزين",
    personKnown: "عميل معروف الهوية",
    vipProfiles: "ملفات العملاء المميزين",
    selectVipPrompt:
      "اختر عميلًا مميزًا من الدليل لعرض الجدول الزمني السلوكي وإشارات النية واقتراحات التواصل.",
    outreachBtn: "تواصل",
    reissueLink: "إعادة إصدار الرابط",
    leadScore: "تقييم العميل",
    repeatViews: "الزيارات المتكررة",
    pricingSignal: "إشارة اهتمام بالتسعير",
    comparisons: "المقارنات",
    alerts: "التنبيهات",
    salesRep: "مندوب المبيعات",
    card: "البطاقة",
    campaign: "الحملة",
    timeline: "الجدول الزمني",
    lastSeen: "آخر ظهور",

    // Sales Trigger
    salesTrigger: "محفّز المبيعات",
    whyCallNow: "لماذا يجب الاتصال الآن؟",
    daysIdle: "أيام الخمول",
    atRisk: "معرّض للخسارة",
    decayedScore: "التقييم المُضمحل",

    // VIP Candidate
    vipCandidate: "مرشّح للعضوية المميزة",
    promoteToVip: "ترقية إلى عميل مميز",
    vipCandidateDesc:
      "مستخدمون مسجّلون تجاوزت تقييماتهم الحد الأدنى — يُنصح بإصدار بطاقات NFC لهم",

    // Priority
    priorityVipList: "قائمة أولويات العملاء المميزين",
    dailySalesCockpit: "لوحة قيادة المبيعات اليومية",
    prioritySortedDesc:
      "مرتبة وفق التقييم المُضمحل زمنيًا. الإجراءات الأحدث تحظى بترجيح أعلى.",
    thVip: "مميز",
    thVipCode: "رمز العميل المميز",
    thTopTower: "البرج الأعلى اهتمامًا",
    thLeadScore: "التقييم",
    thAlerts: "التنبيهات",
    thLastSeen: "آخر ظهور",
    thAction: "الإجراء",
    thTrigger: "المحفّز",
    thDaysIdle: "الخمول",
    nextBestActions: "الإجراءات التالية المُوصى بها",
    autoSuggested: "مقترحة تلقائيًا بناءً على سلوك العميل المميز",
    quickActions: "إجراءات سريعة",
    bulkOps: "عمليات جماعية",
    emailHighIntent: "مراسلة جميع العملاء المميزين ذوي النية العالية",
    exportPriorityList: "تصدير قائمة الأولويات",
    reminderLabel: "تذكير:",
    reminderText:
      "إجراءات العملاء المميزين مخصّصة للتواصل الفردي (اتصال، رسالة نصية، بريد إلكتروني). الإجراءات العادية مخصّصة للتسويق القطاعي.",

    // Alerts
    alertPricing: "اهتمام بالتسعير",
    alertHighIntent: "نية شراء عالية",
    alertComparing: "مقارنة المخططات",
    alertFamily: "مشترٍ عائلي",

    // Analytics
    analytics: "التحليلات",
    standardVip: "عادي + مميز",
    vipIntentHeatmap: "خريطة نوايا العملاء المميزين (مباشرة)",
    propertyDemandHeatmap: "خريطة الطلب العقاري (مباشرة)",
    guidance: "الإرشادات",
    heatPenthouse: "بنتهاوس",
    heat3br: "3 غرف نوم",
    heat2br: "غرفتا نوم",
    heat1br: "غرفة نوم واحدة",
    floorLow: "منخفض (1-4)",
    floorMid: "متوسط (5-8)",
    floorHigh: "مرتفع (9-12)",
    guideLowClicks: "النقرات القليلة لا تعني طلبًا منخفضًا",
    guideLowClicksDesc:
      "حسّن الوسائط والتسميات والوضوح قبل تعديل الأسعار.",
    guidePricing: "إشارات التسعير تعني إشارات متابعة",
    guidePricingDesc:
      "للعميل المميز: اتصل واعرض خطة الدفع. للزائر العادي: أضف زر طلب التسعير.",
    guideMvp: "ضوابط المنتج الأولي",
    guideMvpDesc:
      "لوحة المعلومات موجودة لزيادة حجوزات المعاينة، وليس لإجراء تحليلات بلا هدف.",

    // Units
    unitsFloorPlans: "الوحدات والمخططات الطابقية",
    thUnitId: "رقم الوحدة",
    thName: "الاسم",
    thTower: "البرج",
    thFloor: "الطابق",
    thType: "النوع",
    thStatus: "الحالة",
    thPrice: "السعر",
    thVipInterest: "اهتمام العملاء المميزين",
    available: "متاح",
    reserved: "محجوز",
    sold: "مُباع",
    filterAll: "الكل",
    zeroEngagement: "بدون تفاعل",

    // Campaigns
    campaigns: "الحملات",
    cardIssuance: "إصدار بطاقات العملاء المميزين المرتبطة بالحملات",
    campaignsDesc:
      "تُصدر بطاقات العملاء المميزين كدعوات حصرية مرتبطة بحملة تسويقية لأغراض التتبع وإعداد التقارير.",
    active: "نشطة",
    paused: "متوقفة مؤقتًا",

    // Settings
    settings: "الإعدادات",
    mvpControls: "ضوابط المنتج الأولي",
    dataBoundaries: "حدود البيانات",
    keepSimple: "حافظ على البساطة والأمان والامتثال",
    mvpLock: "قفل المنتج الأولي",
    outOfScope: "خارج نطاق المرحلة الحالية",
    s1: "تتبع العملاء المميزين يتطلب دعوة صريحة عبر بطاقة NFC فعلية.",
    s2: "التتبع العادي يبقى مجهول الهوية وقائمًا على المجموعات.",
    s3: "صلاحيات الوصول قائمة على الأدوار: يرى كل مندوب عملاءه المميزين فقط.",
    s4: "الروابط السحرية يجب أن تنتهي صلاحيتها مع دعم الإلغاء وإعادة الإصدار.",
    s5: "خارج النطاق: التسعير الديناميكي، سير العمل الآلي، واتساب، استبدال نظام إدارة العملاء.",
    s6: "أنواع الأحداث المعتمدة: مشاهدة الصفحة والنقر على الإجراء فقط.",
    s7: "أسماء الإجراءات ثابتة: حجز معاينة، طلب تسعير، طلب خطة دفع، تحميل كتيّب.",
    s8: "مقياس النجاح: ارتفاع حجوزات المعاينة.",

    // Modals
    createVipTitle: "إنشاء عميل مميز",
    createVipDesc:
      "يقوم مندوب المبيعات بتعيين بطاقة وربطها بحملة. سيُنشأ معرّف العميل المميز تلقائيًا.",
    lblFullName: "الاسم الكامل",
    lblPhone: "رقم الهاتف",
    lblEmail: "البريد الإلكتروني",
    lblPrefLang: "اللغة المفضلة",
    lblCampaign: "الحملة",
    lblCardId: "رقم البطاقة",
    createVipNote:
      "عند إصدار بطاقة مميزة، يتلقى العميل المحتمل صندوق دعوة حصريًا يمنحه صلاحية وصول خاصة. يدعم ذلك مبدأ الموافقة ويعزز المكانة المتميزة.",
    createVipSubmit: "إنشاء عميل مميز",
    howThisWorks: "آلية العمل",
    vipTraffic: "زيارات العملاء المميزين",
    vipTrafficDesc:
      "يدخل عبر رابط NFC السحري. الهوية معروفة بمعرّف فريد. استخدم الرؤى للتواصل الفردي. الهدف: زيادة حجوزات المعاينة.",
    stdTraffic: "الزيارات العادية",
    stdTrafficDesc:
      "يدخل عبر الإعلانات أو محركات البحث أو مباشرةً. الهوية مجهولة. استخدم الشرائح والمحتوى لتحسين التسويق.",
    keyRule: "القاعدة الأساسية:",
    keyRuleDesc:
      "الإجراءات مشتركة وغير خطية. الفارق الوحيد بين المميز والعادي هو الهوية وآلية تفعيل المتابعة.",
    vipOutreach: "التواصل مع العملاء المميزين",
    outreachDesc:
      "تواصل فردي بأسلوب الضيافة الراقية. أشِر إلى إشارات الاهتمام، لا إلى المراقبة.",
    callScript: "نص المكالمة",
    emailSnippet: "نموذج البريد الإلكتروني",
    guardrailLabel: "ضابط السلوك:",
    guardrailDesc:
      "لا تذكر أنك تتبّعت نشاطهم. أخبرهم أنك تتابع دعوتهم الخاصة ويمكنك مساعدتهم في التسعير والمعاينة وخيارات الدفع.",
    leadPipeline: "مسار العملاء المحتملين",
    scoredContacts: "جهات اتصال مُقيَّمة عبر جميع القنوات",
    unitPerformance: "أداء الوحدات",
    residenceAnalytics: "تحليلات التفاعل مع الوحدات السكنية",
    eventsTracked: "حدث مُسجَّل",
    close: "إغلاق",
    conversionFunnel: "مسار التحويل",
    totalVisitors: "إجمالي الزوار",
    viewedUnit: "شاهد وحدة",
    downloaded: "حمّل الكتيّب",
    requestedPricing: "طلب التسعير",
    bookedViewing: "حجز معاينة",
    dropOff: "معدل الانسحاب",
    mAgo: "د",
    hAgo: "س",
    dAgo: "ي",
    justNow: "الآن",
  },
};

registerTranslations("dashboard", dashboard);

export default dashboard;

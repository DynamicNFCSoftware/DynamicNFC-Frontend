import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n";
import './Dashboard.css';
import SEO from '../../components/SEO/SEO';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// DYNAMIC NFC — CRM INTELLIGENCE DASHBOARD v3.1
// ═══════════════════════════════════════════════════════════════
// v3.0 → v3.1 Upgrades (BI Analysis + Gemini Comparison):
//   [1] Time-Decay Scoring: DECAY_HALF_LIFE_DAYS = 7
//   [2] Sales Triggers: getSalesTrigger() — "Why should you call?"
//   [3] Lead Score Distribution histogram in Analytics tab
//   [4] Velocity KPIs: Time-to-First-Action, Viewing Velocity, VIP Conversion Lift
//   [5] Funnel Drop-off % between steps
//   [6] Days Idle counter + At Risk auto-flag
//   [7] VIP Candidate auto-promotion for registered users
//   [8] Zero-engagement unit alert badges
//   [9] Live behavioral heatmaps (replacing hardcoded values)
// ═══════════════════════════════════════════════════════════════

// ─── TIME-DECAY SCORING CONSTANT ────────────────────────────
const DECAY_HALF_LIFE_DAYS = 7;
const decayFactor = (eventTimestamp) => {
  const daysAgo = (Date.now() - new Date(eventTimestamp).getTime()) / 86400000;
  return Math.pow(0.5, daysAgo / DECAY_HALF_LIFE_DAYS);
};

// ─── BILINGUAL TRANSLATIONS ─────────────────────────────────
const T = {
  en: {
    // Header
    headerTitle: "Al Noor Residences", headerSub: "VIP Behavioral Intelligence",
    liveDemo: "Live Demo", envBadge: "Al Noor Residences",
    help: "Help", createVip: "+ Create VIP", resetDemo: "Reset Demo",
    // Nav
    navOverview: "Overview", navVipCrm: "VIP CRM", navPriority: "Priority VIP",
    navAnalytics: "Analytics", navUnits: "Units & Plans", navCampaigns: "Campaigns",
    navSettings: "Settings",
    navVipPortal: "VIP Portal", navLoginPortal: "Login Portal", navMarketplace: "Marketplace",
    navLabelIntel: "Intelligence", navLabelPortals: "Portals", decayLabel: "Decay: 7d half-life",
    // Executive Banner
    execView: "Executive View",
    execDesc: "Conversions are identical for VIP and Standard traffic. The only difference is identity. VIP has vip_id enabling 1-to-1 outreach; Standard uses anon_id for segment marketing.",
    kpi1: "Primary KPI: Booked Viewings uplift", kpi2: "Time-decay scoring (7d half-life)",
    kpi3: "Shared actions: Book, Pricing, Payment Plan, Brochure",
    // KPIs
    mVipSessions: "VIP Sessions", mRegSessions: "Registered", mAnonSessions: "Anonymous",
    mTotalConversions: "Conversions", mBookedViewings: "Booked Viewings",
    mVipSub: "Person known via NFC", mRegSub: "Marketplace sign-ups",
    mAnonSub: "Standard web traffic", mConvSub: "All shared actions",
    // NEW Velocity KPIs
    mViewingVelocity: "Viewing Velocity", mViewingVelSub: "Avg days to first booking",
    mTimeToAction: "Time to First Action", mTimeToActionSub: "Avg mins from tap to first view",
    mVipConvLift: "VIP Conversion Lift", mVipConvLiftSub: "VIP vs Standard booking rate",
    mLeadCaptureRate: "Lead Capture Rate", mLeadCaptureSub: "Anonymous → Lead conversion",
    // Shared Conversions
    sharedConversions: "Shared Conversion Actions", badgeVipStd: "VIP + Standard · Non-linear",
    actBookViewing: "Book a Viewing", actRequestPricing: "Request Pricing",
    actRequestPayment: "Request Payment Plan", actDownloadBrochure: "Download Brochure",
    // Activity Feed
    liveActivityFeed: "Live Activity Feed", realtimeInteractions: "Real-time portal interactions",
    feedAll: "All", feedVip: "VIP", feedRegistered: "Registered",
    // VIP Summary
    vipActivitySummary: "VIP Activity Summary", highPrioritySignals: "High-priority VIP signals",
    hotLeads: "Hot Leads", activeAlerts: "Active Alerts", avgLeadScore: "Avg Lead Score",
    // Charts
    engagementOverTime: "Engagement Over Time", channelMix: "Channel Mix",
    towerInterestDist: "Tower Interest Distribution", allTrafficCombined: "All traffic combined",
    chartVip: "VIP", chartRegistered: "Registered", chartAnonymous: "Anonymous",
    actionPerformance: "Action Performance", vipVsStandard: "VIP vs Standard comparison",
    topPlansByInterest: "Top Plans by Interest", allTraffic: "All traffic",
    // NEW Score Distribution
    scoreDistribution: "Lead Score Distribution", scoreDistSub: "Pipeline health across all contacts",
    scoreBand0: "0-20 Cold", scoreBand20: "20-40 Warm", scoreBand40: "40-60 Engaged",
    scoreBand60: "60-80 Hot", scoreBand80: "80+ Ready",
    // VIP CRM
    vipDirectory: "VIP Directory", personKnown: "Person known", vipProfiles: "VIP Profiles",
    selectVipPrompt: "Select a VIP from the directory to view their behavioral timeline, intent signals, and suggested outreach.",
    outreachBtn: "Outreach", reissueLink: "Reissue Link",
    leadScore: "Lead Score", repeatViews: "Repeat Views", pricingSignal: "Pricing Signal",
    comparisons: "Comparisons", alerts: "Alerts", salesRep: "Sales Rep",
    card: "Card", campaign: "Campaign",
    timeline: "Timeline", lastSeen: "Last seen",
    // NEW Sales Trigger
    salesTrigger: "Sales Trigger", whyCallNow: "Why call now?",
    daysIdle: "Days Idle", atRisk: "AT RISK", decayedScore: "Decayed Score",
    // NEW VIP Candidate
    vipCandidate: "VIP Candidate", promoteToVip: "Promote to VIP",
    vipCandidateDesc: "Registered users scoring above threshold — issue NFC cards",
    // Priority
    priorityVipList: "Priority VIP List", dailySalesCockpit: "Daily sales cockpit",
    prioritySortedDesc: "Sorted by time-decayed score. Recency-weighted: recent actions rank higher.",
    thVip: "VIP", thVipCode: "VIP Code", thTopTower: "Top Tower", thLeadScore: "Lead Score",
    thAlerts: "Alerts", thLastSeen: "Last Seen", thAction: "Action",
    thTrigger: "Trigger", thDaysIdle: "Idle",
    nextBestActions: "Next Best Actions", autoSuggested: "Auto-suggested based on VIP behavior",
    quickActions: "Quick Actions", bulkOps: "Bulk operations",
    emailHighIntent: "Email All High Intent VIPs", exportPriorityList: "Export Priority List",
    reminderLabel: "Reminder:", reminderText: "VIP actions are for 1-to-1 outreach (call, SMS, email). Standard actions are for segment marketing.",
    // Alerts
    alertPricing: "Pricing Interest", alertHighIntent: "High Intent",
    alertComparing: "Comparing Plans", alertFamily: "Family Buyer",
    // Analytics
    analytics: "Analytics", standardVip: "Standard + VIP",
    vipIntentHeatmap: "VIP Intent Heatmap (Live)", propertyDemandHeatmap: "Property Demand Heatmap (Live)",
    guidance: "Guidance",
    heatPenthouse: "Penthouse", heat3br: "3BR", heat2br: "2BR", heat1br: "1BR",
    floorLow: "Low (1-4)", floorMid: "Mid (5-8)", floorHigh: "High (9-12)",
    guideLowClicks: "Low clicks ≠ low demand",
    guideLowClicksDesc: "Improve media, naming, and clarity before changing price.",
    guidePricing: "Pricing signals = follow-up signals",
    guidePricingDesc: "For VIP: call with payment plan. For Standard: add pricing CTA.",
    guideMvp: "MVP guardrail",
    guideMvpDesc: "Dashboard exists to increase booked viewings, not analytics for analytics.",
    // Units
    unitsFloorPlans: "Units & Floor Plans",
    thUnitId: "Unit ID", thName: "Name", thTower: "Tower", thFloor: "Floor",
    thType: "Type", thStatus: "Status", thPrice: "Price", thVipInterest: "VIP Interest",
    available: "Available", reserved: "Reserved", sold: "Sold",
    filterAll: "All", zeroEngagement: "ZERO ENGAGEMENT",
    // Campaigns
    campaigns: "Campaigns", cardIssuance: "VIP card issuance linked to campaigns",
    campaignsDesc: "VIP cards are issued as premium invitations linked to a campaign for tracking and reporting.",
    active: "Active", paused: "Paused",
    // Settings
    settings: "Settings", mvpControls: "MVP controls",
    dataBoundaries: "Data Boundaries", keepSimple: "Keep it simple, secure, and compliant",
    mvpLock: "MVP Lock", outOfScope: "Out of scope for current phase",
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
    createVipDesc: "Sales rep assigns a card and links a campaign. VIP ID will be generated.",
    lblFullName: "Full name", lblPhone: "Phone", lblEmail: "Email",
    lblPrefLang: "Preferred language", lblCampaign: "Campaign", lblCardId: "Card ID",
    createVipNote: "By issuing a VIP card, the prospect receives a premium invitation box stating private access. This supports consent and premium positioning.",
    createVipSubmit: "Create VIP",
    howThisWorks: "How This Works", vipTraffic: "VIP Traffic",
    vipTrafficDesc: "Enters via NFC Magic Link. Identity known via vip_id. Use insights for 1-to-1 outreach. Goal: booked viewings uplift.",
    stdTraffic: "Standard Traffic",
    stdTrafficDesc: "Enters via Ads, SEO, Direct. Identity unknown via anon_id. Use segments and content to optimize marketing.",
    keyRule: "Key Rule:",
    keyRuleDesc: "The actions are shared and non-linear. The only difference between VIP and Standard is identity and how you activate follow-up.",
    vipOutreach: "VIP Outreach",
    outreachDesc: "1-to-1 outreach. Concierge tone. Reference interest signals, not surveillance.",
    callScript: "Call Script", emailSnippet: "Email Snippet",
    guardrailLabel: "Guardrail:",
    guardrailDesc: "Do not say you tracked them. Say you are following up on their private invitation and can help with pricing, viewing, and payment options.",
    leadPipeline: "Lead Pipeline", scoredContacts: "Scored contacts across all channels",
    unitPerformance: "Unit Performance", residenceAnalytics: "Residence engagement analytics",
    eventsTracked: "events tracked", close: "Close",
    conversionFunnel: "Conversion Funnel", totalVisitors: "Total Visitors",
    viewedUnit: "Viewed Unit", downloaded: "Downloaded", requestedPricing: "Requested Pricing",
    bookedViewing: "Booked Viewing", dropOff: "drop-off",
    mAgo: "m ago", hAgo: "h ago", dAgo: "d ago", justNow: "just now",
  },
  ar: {
    headerTitle: "مساكن النور", headerSub: "ذكاء سلوك كبار الشخصيات",
    liveDemo: "العرض المباشر", envBadge: "مساكن النور",
    help: "مساعدة", createVip: "الاسم؟", resetDemo: "إعادة ضبط العرض التجريبي",
    navOverview: "نظرة عامة", navVipCrm: "إدارة علاقات العملاء لكبار الشخصيات", navPriority: "كبار الشخصيات ذو أولوية",
    navAnalytics: "التحليلات", navUnits: "الوحدات والخطط", navCampaigns: "الحملات",
    navSettings: "الإعدادات",
    navVipPortal: "بوابة كبار الشخصيات", navLoginPortal: "بوابة الدخول", navMarketplace: "السوق",
    navLabelIntel: "التحليلات", navLabelPortals: "البوابات", decayLabel: "اضمحلال: 7 أيام",
    execView: "عرض تنفيذي",
    execDesc: "التحويلات متطابقة لكل من حركة مرور كبار الشخصيات وحركة مرور Standard. الاختلاف الوحيد هو الهوية. يمتلك كبار الشخصيات بطاقة تعريفية لكبار الشخصيات_id لتمكين التواصل 1-إلى-1؛ يستخدم Standard anon_id للتسويق على مستوى الفئة.",
    kpi1: "المؤشر الرئيسي: زيادة الحجوزات المؤكدة", kpi2: "تقييم التلاشي الزمني (عمر نصفي 7 أيام)",
    kpi3: "الإجراءات المشتركة: الحجز، السعر، خطة الدفع، الكتيب",
    mVipSessions: "جلسات كبار الشخصيات", mRegSessions: "مسجل", mAnonSessions: "مجهول",
    mTotalConversions: "التحويلات", mBookedViewings: "الحجوزات المؤكدة للزيارة",
    mVipSub: "الشخص معروف عبر الاتصال قريب المدى", mRegSub: "تسجيلات السوق",
    mAnonSub: "حركة مرور ويب قياسية", mConvSub: "جميع الإجراءات المشتركة",
    mViewingVelocity: "سرعة الزيارة", mViewingVelSub: "متوسط أيام حتى أول حجز",
    mTimeToAction: "الوقت للخطوة الأولى", mTimeToActionSub: "متوسط دقائق من النقرة إلى العرض الأول",
    mVipConvLift: "زيادة تحويل كبار الشخصيات", mVipConvLiftSub: "معدل الحجز لكبار الشخصيات مقابل الحجز القياسي",
    mLeadCaptureRate: "معدل تحويل العملاء المحتملين", mLeadCaptureSub: "مجهول → تحويل العميل المحتمل",
    sharedConversions: "الإجراءات المشتركة للتحويل", badgeVipStd: "كبار الشخصيات + Standard · غير خطي",
    actBookViewing: "حجز زيارة", actRequestPricing: "طلب السعر",
    actRequestPayment: "طلب خطة الدفع", actDownloadBrochure: "تحميل الكتيب",
    liveActivityFeed: "تغذية النشاط المباشر", realtimeInteractions: "تفاعلات البوابة في الوقت الفعلي",
    feedAll: "الكل", feedVip: "كبار الشخصيات", feedRegistered: "مسجل",
    vipActivitySummary: "ملخص نشاط كبار الشخصيات", highPrioritySignals: "إشارات كبار الشخصيات ذات الأولوية العالية",
    hotLeads: "العملاء الساخنون", activeAlerts: "تنبيهات نشطة", avgLeadScore: "متوسط درجة العميل المحتمل",
    engagementOverTime: "التفاعل بمرور الوقت", channelMix: "مزيج القنوات",
    towerInterestDist: "توزيع الاهتمام بالبرج", allTrafficCombined: "جميع الزيارات مجتمعة",
    chartVip: "كبار الشخصيات", chartRegistered: "مسجل", chartAnonymous: "مجهول",
    actionPerformance: "أداء الإجراءات", vipVsStandard: "مقارنة كبار الشخصيات مقابل القياسي",
    topPlansByInterest: "أعلى الخطط حسب الاهتمام", allTraffic: "جميع الزيارات",
    scoreDistribution: "توزيع درجات العملاء المحتملين", scoreDistSub: "صحة خط الأنابيب عبر جميع جهات الاتصال",
    scoreBand0: "0-20 بارد", scoreBand20: "20-40 دافئ", scoreBand40: "40-60 متفاعل",
    scoreBand60: "60-80 ساخن", scoreBand80: "80+ جاهز",
    vipDirectory: "دليل كبار الشخصيات", personKnown: "الشخص معروف", vipProfiles: "ملفات كبار الشخصيات",
    selectVipPrompt: "اختر كبار الشخصيات من الدليل لمشاهدة الجدول الزمني للسلوك، إشارات النية، والمتابعة المقترحة.",
    outreachBtn: "التواصل", reissueLink: "إعادة إصدار الرابط",
    leadScore: "درجة العميل المحتمل", repeatViews: "مشاهدات متكررة", pricingSignal: "إشارة السعر",
    comparisons: "المقارنات", alerts: "تنبيهات", salesRep: "مندوب المبيعات",
    card: "البطاقة", campaign: "الحملة",
    timeline: "الجدول الزمني", lastSeen: "آخر ظهور",
    salesTrigger: "تنبيه المبيعات", whyCallNow: "لماذا الاتصال الآن؟",
    daysIdle: "أيام الخمول", atRisk: "معرض للخطر", decayedScore: "الدرجة المتدهورة",
    vipCandidate: "مرشح كبار الشخصيات", promoteToVip: "ترقية إلى كبار الشخصيات",
    vipCandidateDesc: "المستخدمون المسجلون الذين يحصلون على درجة أعلى من الحد — إصدار بطاقات الاتصال قريب المدى",
    priorityVipList: "قائمة كبار الشخصيات ذات الأولوية", dailySalesCockpit: "لوحة قيادة المبيعات اليومية",
    prioritySortedDesc: "مرتبة حسب الدرجة الزمنية المتلاشية. مؤرخة: الإجراءات الأخيرة لها ترتيب أعلى.",
    thVip: "كبار الشخصيات", thVipCode: "رمز كبار الشخصيات", thTopTower: "أعلى برج", thLeadScore: "درجة العميل المحتمل",
    thAlerts: "تنبيهات", thLastSeen: "آخر ظهور", thAction: "الإجراء",
    thTrigger: "المحفز", thDaysIdle: "الخمول",
    nextBestActions: "أفضل الإجراءات التالية", autoSuggested: "اقتراح تلقائي بناءً على سلوك كبار الشخصيات",
    quickActions: "الإجراءات السريعة", bulkOps: "عمليات مجمعة",
    emailHighIntent: "إرسال بريد إلكتروني لجميع كبار الشخصيات ذوي النية العالية", exportPriorityList: "تصدير قائمة الأولوية",
    reminderLabel: "تذكير:", reminderText: "إجراءات كبار الشخصيات للتواصل 1-إلى-1 (مكالمة، رسالة، بريد إلكتروني). إجراءات Standard لتسويق الفئات.",
    alertPricing: "اهتمام بالسعر", alertHighIntent: "نية عالية",
    alertComparing: "مقارنة الخطط", alertFamily: "مشتري عائلة",
    analytics: "التحليلات", standardVip: "قياسي + كبار الشخصيات",
    vipIntentHeatmap: "خريطة حرارة نية كبار الشخصيات (مباشر)", propertyDemandHeatmap: "خريطة حرارة طلب العقار (مباشرة)",
    guidance: "إرشادات:",
    heatPenthouse: "بنتهاوس", heat3br: "ثلاث غرف نوم", heat2br: "غرفتي نوم", heat1br: "غرفة نوم واحدة",
    floorLow: "منخفض (1-4)", floorMid: "متوسط (5-8)", floorHigh: "مرتفع (9-12)",
    guideLowClicks: "النقرات المنخفضة ≠ الطلب المنخفض",
    guideLowClicksDesc: "حسن الوسائط، التسمية، والوضوح قبل تغيير السعر.",
    guidePricing: "إشارات السعر = إشارات المتابعة",
    guidePricingDesc: "لـ كبار الشخصيات: اتصل مع خطة الدفع. لـ Standard: أضف CTA السعر.",
    guideMvp: "إرشادات MVP",
    guideMvpDesc: "اللوحة موجودة لزيادة الحجوزات، وليس التحليلات لمجرد التحليل.",
    unitsFloorPlans: "الوحدات والمخططات الطابقية",
    thUnitId: "معرف الوحدة", thName: "الاسم", thTower: "البرج", thFloor: "الطابق",
    thType: "النوع", thStatus: "الحالة", thPrice: "السعر", thVipInterest: "اهتمام كبار الشخصيات",
    available: "متاح", reserved: "محجوز", sold: "تم البيع", filterAll: "الكل", zeroEngagement: "عدم وجود تفاعل",
    campaigns: "الحملات", cardIssuance: "إصدار بطاقة كبار الشخصيات مرتبطة بالحملات",
    campaignsDesc: "بطاقات كبار الشخصيات تصدر كدعوات مميزة مرتبطة بحملة لتتبع الأداء وإعداد التقارير.",
    active: "نشط", paused: "متوقف",
    settings: "الإعدادات", mvpControls: "عناصر تحكم MVP",
    dataBoundaries: "حدود البيانات", keepSimple: "اجعلها بسيطة، آمنة، ومتوافقة",
    mvpLock: "قفل MVP", outOfScope: "خارج نطاق المرحلة الحالية",
    s1: "تتطلب تتبع كبار الشخصيات دعوة صريحة عبر بطاقة الاتصال قريب المدى المادية.",
    s2: "تظل تتبع Standard مجهولة وتعتمد على الفئة.",
    s3: "الوصول قائم على الدور: يرى مندوبي المبيعات فقط كبار الشخصياتs المخصصة لهم.",
    s4: "يجب أن تنتهي صلاحية الروابط السحرية وتدعم الإلغاء / إعادة الإصدار.",
    s5: "خارج النطاق: التسعير الديناميكي، أتمتة سير العمل، واتساب، استبدال إدارة علاقات العملاء.",
    s6: "نوع الحدث: page_view و cta_click فقط.",
    s7: "أسماء CTA ثابتة: book_viewing, request_pricing, request_payment_plan, download_brochure.",
    s8: "مؤشر النجاح: زيادة الحجوزات المؤكدة.",
    createVipTitle: "إنشاء كبار الشخصيات",
    createVipDesc: "يقوم مندوب المبيعات بتعيين بطاقة وربطها بحملة. سيتم إنشاء معرف كبار الشخصيات.",
    lblFullName: "الاسم الكامل", lblPhone: "الهاتف", lblEmail: "البريد الإلكتروني",
    lblPrefLang: "اللغة المفضلة", lblCampaign: "الحملة", lblCardId: "معرف البطاقة",
    createVipNote: "عن طريق إصدار بطاقة كبار الشخصيات، يتلقى العميل صندوق دعوة مميز يشير إلى الوصول الخاص. يدعم هذا الحصول على الموافقة والمكانة المميزة.",
    createVipSubmit: "إنشاء كبار الشخصيات",
    howThisWorks: "كيف يعمل هذا", vipTraffic: "حركة مرور كبار الشخصيات",
    vipTrafficDesc: "يدخل عبر رابط سحري الاتصال قريب المدى. الهوية معروفة عبر كبار الشخصيات_id. استخدم الرؤى للتواصل 1-إلى-1. الهدف: زيادة الحجوزات المؤكدة.",
    stdTraffic: "حركة مرور قياسية",
    stdTrafficDesc: "الدخول عبر الإعلانات، SEO، مباشر. الهوية مجهولة عبر anon_id. استخدم الفئات والمحتوى لتحسين التسويق.",
    keyRule: "القاعدة الرئيسية:",
    keyRuleDesc: "الإجراءات مشتركة وغير خطية. الاختلاف الوحيد بين كبار الشخصيات و Standard هو الهوية وطريقة تفعيل المتابعة.",
    vipOutreach: "تواصل كبار الشخصيات",
    outreachDesc: "تواصل 1-إلى-1. نبرة استشارية. الإشارة للاهتمامات، ليس المراقبة.",
    callScript: "نص المكالمة", emailSnippet: "مقتطف البريد الإلكتروني",
    guardrailLabel: "حاجز أمان:",
    guardrailDesc: "لا تقل أنك تابعتهم. قل إنك تتابع دعوتهم الخاصة ويمكنك المساعدة في السعر، الزيارة، وخيارات الدفع.",
    leadPipeline: "خط أنابيب العملاء المحتملين", scoredContacts: "جهات الاتصال المقيمة عبر جميع القنوات",
    unitPerformance: "أداء الوحدة", residenceAnalytics: "تحليلات تفاعل الوحدات السكنية",
    eventsTracked: "الأحداث المتعقبة", close: "إغلاق",
    conversionFunnel: "قُمع التحويل", totalVisitors: "إجمالي الزوار",
    viewedUnit: "الوحدة المعروضة", downloaded: "تم التحميل", requestedPricing: "طلب السعر",
    bookedViewing: "الحجز المؤكد للزيارة", dropOff: "انخفاض النشاط",
    mAgo: "منذ دقائق", hAgo: "منذ ساعات", dAgo: "منذ أيام", justNow: "الآن",
  }
};
// ─── STATIC DATA: Tower Architecture + 12 Units + Campaigns + Reps ──
const TOWERS = {
  t1: { name: "Al Qamar Tower", nameAr: "برج القمر" },
  t2: { name: "Al Safwa Tower", nameAr: "برج الصفوة" },
  t3: { name: "Al Rawda Tower", nameAr: "برج الروضة" },
};

const UNITS = [
  { id: "T1-0501", name: "Aurora Suite 5A", tower: "t1", floor: 5, type: "1BR", status: "available", price: 589000, size: "650 sqft" },
  { id: "T1-0802", name: "Aurora Grand 8B", tower: "t1", floor: 8, type: "2BR", status: "available", price: 789000, size: "920 sqft" },
  { id: "T1-1201", name: "Aurora Penthouse 1", tower: "t1", floor: 12, type: "PH", status: "available", price: 2450000, size: "2100 sqft" },
  { id: "T1-1001", name: "Aurora Grand 3A", tower: "t1", floor: 10, type: "3BR", status: "reserved", price: 1250000, size: "1380 sqft" },
  { id: "T2-0301", name: "Horizon Suite 3A", tower: "t2", floor: 3, type: "1BR", status: "available", price: 495000, size: "580 sqft" },
  { id: "T2-0602", name: "Horizon Classic 2A", tower: "t2", floor: 6, type: "2BR", status: "available", price: 695000, size: "870 sqft" },
  { id: "T2-0901", name: "Horizon Grand 3B", tower: "t2", floor: 9, type: "3BR", status: "available", price: 1120000, size: "1250 sqft" },
  { id: "T2-1101", name: "Horizon Family 3B", tower: "t2", floor: 11, type: "3BR", status: "available", price: 1350000, size: "1420 sqft" },
  { id: "T3-0401", name: "Nova Studio 4A", tower: "t3", floor: 4, type: "1BR", status: "sold", price: 425000, size: "520 sqft" },
  { id: "T3-0701", name: "Nova Classic 7A", tower: "t3", floor: 7, type: "2BR", status: "available", price: 645000, size: "810 sqft" },
  { id: "T3-0902", name: "Al Rawda Grand 9B", tower: "t3", floor: 9, type: "3BR", status: "available", price: 985000, size: "1180 sqft" },
  { id: "T3-1001", name: "Nova Penthouse 1", tower: "t3", floor: 10, type: "PH", status: "available", price: 1850000, size: "1800 sqft" },
];

const VIP_PROFILES = [
  {
    vipId: "KR-001", vipCode: "VIP-8F3A21", fullName: "Khalid Al-Rashid",
    phone: "+971 50 555 1234", email: "khalid@investment.ae", prefLang: "en",
    salesRepId: "r1", campaignId: "c1", cardId: "card_000128",
    topTower: "t1", topPlans: ["Aurora Penthouse 1", "Aurora Grand 3A"],
    alerts: ["pricing_interest_detected", "high_intent_no_booking", "comparing_plans"],
  },
  {
    vipId: "FM-002", vipCode: "VIP-19BC02", fullName: "Fatima Al-Mansouri",
    phone: "+971 55 555 5678", email: "fatima@family.ae", prefLang: "ar",
    salesRepId: "r2", campaignId: "c1", cardId: "card_000129",
    topTower: "t2", topPlans: ["Horizon Family 3B", "Horizon Classic 2A"],
    alerts: ["family_buyer_focus"],
  },
];

const SALES_REPS = [
  { id: "r1", name: "Alex Reed", email: "alex@alnoor.ae" },
  { id: "r2", name: "Mina Patel", email: "mina@alnoor.ae" },
];

const CAMPAIGNS = [
  { id: "c1", name: "Al Noor VIP Winter Access", status: "active", desc: "Private invitation and early access" },
  { id: "c2", name: "Penthouse Concierge Preview", status: "active", desc: "Premium penthouse tour package" },
  { id: "c3", name: "Payment Plan Priority", status: "paused", desc: "Financing guidance and planning" },
];

// ─── INTENT SCORING ENGINE (from V2) ────────────────────────
const INTENT_WEIGHTS = {
  portal_opened: 5, marketplace_visit: 2, user_login: 8,
  view_unit: 10, download_brochure: 20, request_pricing: 30,
  view_floorplan: 15, explore_payment_plan: 25, book_viewing: 40,
  contact_advisor: 35, contact_sales: 35, lead_captured: 15,
  lead_form_shown: 5, filter_units: 3, language_switch: 2,
  cta_browse: 4, cta_book: 8, cta_explore_residences: 4,
  cta_schedule_viewing: 8, register_click: 6, user_logout: 1,
  tower_selected: 5, unit_view: 10, cta_click: 20, favorite_add: 12,
  comparison_view: 18, bedroom_filter: 4, chat_message: 15,
  vip_portal_entry: 5, category_filter: 3,
  cta_explore: 4, cta_booking: 8,
};

const EVENT_LABELS = {
  en: {
    portal_opened: "Opened VIP Portal", marketplace_visit: "Visited Marketplace",
    user_login: "Logged In", view_unit: "Viewed Unit", download_brochure: "Downloaded Brochure",
    request_pricing: "Requested Pricing", view_floorplan: "Viewed Floor Plan",
    explore_payment_plan: "Explored Payment Plan", book_viewing: "Booked Viewing",
    contact_advisor: "Contacted Advisor", contact_sales: "Contacted Sales",
    lead_captured: "Lead Captured", lead_form_shown: "Lead Form Shown",
    filter_units: "Filtered Units", language_switch: "Switched Language",
    tower_selected: "Selected Tower", favorite_add: "Added Favorite",
    comparison_view: "Compared Units", chat_message: "Sent Message",
    vip_portal_entry: "Entered VIP Portal", category_filter: "Filtered Category",
    cta_click: "Clicked Action", unit_view: "Viewed Unit Details",
    register_click: "Clicked Register", user_logout: "Logged Out",
    cta_explore: "Explored Residences", cta_booking: "Clicked Book Viewing",
    cta_browse: "Browsed Listings", bedroom_filter: "Filtered Bedrooms",
  },
  ar: {
    portal_opened: "فتح بوابة VIP", marketplace_visit: "زار السوق",
    user_login: "سجّل الدخول", view_unit: "شاهد وحدة", download_brochure: "حمّل الكتيب",
    request_pricing: "طلب التسعير", view_floorplan: "شاهد المخطط",
    explore_payment_plan: "استكشف خطة الدفع", book_viewing: "حجز معاينة",
    contact_advisor: "تواصل مع المستشار", contact_sales: "تواصل مع المبيعات",
    lead_captured: "تم التقاط العميل", lead_form_shown: "ظهر نموذج العميل",
    tower_selected: "اختار البرج", favorite_add: "أضاف للمفضلة",
    comparison_view: "قارن الوحدات", chat_message: "أرسل رسالة",
    vip_portal_entry: "دخل بوابة VIP", category_filter: "فلتر الفئة",
    cta_click: "نقر إجراء", unit_view: "شاهد تفاصيل الوحدة",
    cta_explore: "استكشاف المساكن", cta_booking: "نقر حجز معاينة",
    cta_browse: "تصفح القوائم", bedroom_filter: "فلتر غرف النوم",
  }
};

const PORTAL_COLORS = { vip: "#C5A467", registered: "#6BA3C7", anonymous: "#9CA3AF", lead: "#2A9D5C" };
const PORTAL_LABELS = { en: { vip: "VIP (NFC)", registered: "Registered", anonymous: "Anonymous", lead: "Lead" }, ar: { vip: "VIP (NFC)", registered: "مسجّل", anonymous: "مجهول", lead: "عميل محتمل" } };
// ─── SEED DEMO DATA ──────────────────────────────────────────
const seedDemoData = () => {
  const existing = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
  if (existing.some(e => e.id === "d1")) return;
  const now = Date.now(), h = 3600000, d = 86400000;
  const demo = [
    // VIP: Khalid Al-Rashid (high intent investor)
    { id:"d1", timestamp:new Date(now-6*d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"portal_opened" },
    { id:"d2", timestamp:new Date(now-6*d+2*h).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"view_unit", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d3", timestamp:new Date(now-6*d+3*h).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"download_brochure", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d4", timestamp:new Date(now-5*d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"view_unit", unitId:"T1-1001", unitName:"Aurora Grand 3A" },
    { id:"d5", timestamp:new Date(now-5*d+h).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"request_pricing", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d6", timestamp:new Date(now-4*d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"explore_payment_plan", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d7", timestamp:new Date(now-3*d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"view_floorplan", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d7b", timestamp:new Date(now-3*d+2*h).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"comparison_view", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d8", timestamp:new Date(now-2*d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"book_viewing", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d8b", timestamp:new Date(now-d).toISOString(), vipId:"KR-001", vipName:"Khalid Al-Rashid", userName:"Khalid Al-Rashid", portalType:"vip", event:"contact_advisor" },
    // VIP: Fatima Al-Mansouri (family buyer exploring)
    { id:"d30", timestamp:new Date(now-4*d).toISOString(), vipId:"FM-002", vipName:"Fatima Al-Mansouri", userName:"Fatima Al-Mansouri", portalType:"vip", event:"portal_opened" },
    { id:"d31", timestamp:new Date(now-4*d+h).toISOString(), vipId:"FM-002", vipName:"Fatima Al-Mansouri", userName:"Fatima Al-Mansouri", portalType:"vip", event:"view_unit", unitId:"T2-1101", unitName:"Horizon Family 3B" },
    { id:"d32", timestamp:new Date(now-3*d).toISOString(), vipId:"FM-002", vipName:"Fatima Al-Mansouri", userName:"Fatima Al-Mansouri", portalType:"vip", event:"download_brochure", unitId:"T2-1101", unitName:"Horizon Family 3B" },
    { id:"d33", timestamp:new Date(now-2*d).toISOString(), vipId:"FM-002", vipName:"Fatima Al-Mansouri", userName:"Fatima Al-Mansouri", portalType:"vip", event:"view_unit", unitId:"T2-0602", unitName:"Horizon Classic 2A" },
    { id:"d34", timestamp:new Date(now-d).toISOString(), vipId:"FM-002", vipName:"Fatima Al-Mansouri", userName:"Fatima Al-Mansouri", portalType:"vip", event:"request_pricing", unitId:"T2-1101", unitName:"Horizon Family 3B" },
    // Registered: Ahmed Al-Fahad
    { id:"d9", timestamp:new Date(now-5*d).toISOString(), userId:"AF-001", userName:"Ahmed Al-Fahad", portalType:"registered", event:"user_login" },
    { id:"d10", timestamp:new Date(now-5*d+h).toISOString(), userId:"AF-001", userName:"Ahmed Al-Fahad", portalType:"registered", event:"view_unit", unitId:"T1-1001", unitName:"Aurora Grand 3A" },
    { id:"d11", timestamp:new Date(now-5*d+2*h).toISOString(), userId:"AF-001", userName:"Ahmed Al-Fahad", portalType:"registered", event:"view_unit", unitId:"T2-0602", unitName:"Horizon Classic 2A" },
    { id:"d12", timestamp:new Date(now-4*d).toISOString(), userId:"AF-001", userName:"Ahmed Al-Fahad", portalType:"registered", event:"download_brochure", unitId:"T2-0602", unitName:"Horizon Classic 2A" },
    { id:"d13", timestamp:new Date(now-3*d).toISOString(), userId:"AF-001", userName:"Ahmed Al-Fahad", portalType:"registered", event:"request_pricing", unitId:"T2-0602", unitName:"Horizon Classic 2A" },
    // Registered: Sara Hassan
    { id:"d35", timestamp:new Date(now-3*d).toISOString(), userId:"SH-003", userName:"Sara Hassan", portalType:"registered", event:"user_login" },
    { id:"d36", timestamp:new Date(now-3*d+h).toISOString(), userId:"SH-003", userName:"Sara Hassan", portalType:"registered", event:"view_unit", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d37", timestamp:new Date(now-2*d).toISOString(), userId:"SH-003", userName:"Sara Hassan", portalType:"registered", event:"view_unit", unitId:"T1-1001", unitName:"Aurora Grand 3A" },
    // Anonymous/Lead visitors
    { id:"d14", timestamp:new Date(now-6*d).toISOString(), sessionId:"anon_001", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d15", timestamp:new Date(now-6*d+h).toISOString(), sessionId:"anon_001", portalType:"anonymous", event:"view_unit", unitId:"T1-1001", unitName:"Aurora Grand 3A" },
    { id:"d16", timestamp:new Date(now-5*d).toISOString(), sessionId:"anon_002", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d17", timestamp:new Date(now-5*d+2*h).toISOString(), sessionId:"anon_002", portalType:"anonymous", event:"view_unit", unitId:"T1-1201", unitName:"Aurora Penthouse 1" },
    { id:"d18", timestamp:new Date(now-5*d+3*h).toISOString(), sessionId:"anon_002", portalType:"anonymous", event:"lead_form_shown" },
    { id:"d19", timestamp:new Date(now-5*d+3*h).toISOString(), sessionId:"anon_002", portalType:"lead", event:"lead_captured", leadName:"Omar Khalil", leadEmail:"omar@example.com" },
    { id:"d20", timestamp:new Date(now-4*d).toISOString(), sessionId:"anon_002", portalType:"lead", event:"request_pricing", unitId:"T1-1201", unitName:"Aurora Penthouse 1", leadName:"Omar Khalil" },
    { id:"d21", timestamp:new Date(now-4*d).toISOString(), sessionId:"anon_003", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d22", timestamp:new Date(now-3*d).toISOString(), sessionId:"anon_004", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d23", timestamp:new Date(now-3*d+h).toISOString(), sessionId:"anon_004", portalType:"anonymous", event:"view_unit", unitId:"T2-0602", unitName:"Horizon Classic 2A" },
    { id:"d24", timestamp:new Date(now-2*d).toISOString(), sessionId:"anon_005", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d25", timestamp:new Date(now-2*d+h).toISOString(), sessionId:"anon_005", portalType:"lead", event:"lead_captured", leadName:"Nora Saeed", leadEmail:"nora@example.com" },
    { id:"d26", timestamp:new Date(now-d).toISOString(), sessionId:"anon_006", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d27", timestamp:new Date(now-d).toISOString(), sessionId:"anon_007", portalType:"anonymous", event:"marketplace_visit" },
    { id:"d28", timestamp:new Date(now-12*h).toISOString(), sessionId:"anon_007", portalType:"anonymous", event:"view_unit", unitId:"T3-0701", unitName:"Nova Classic 7A" },
    { id:"d29", timestamp:new Date(now-6*h).toISOString(), sessionId:"anon_008", portalType:"anonymous", event:"marketplace_visit" },
  ];
  localStorage.setItem("dnfc_events", JSON.stringify([...existing, ...demo]));
};


// ─── HELPERS ─────────────────────────────────────────────────
const fmtPrice = p => "$" + p.toLocaleString();
const ago = (iso, lang) => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  const tx = T[lang] || T.en;
  if (s < 60) return tx.justNow;
  if (s < 3600) return Math.floor(s/60) + tx.mAgo;
  if (s < 86400) return Math.floor(s/3600) + tx.hAgo;
  return Math.floor(s/86400) + tx.dAgo;
};
const daysAgoNum = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const initials = name => name.split(" ").map(n => n[0]).join("");
const scoreColor = s => s >= 70 ? "#C5A467" : s >= 40 ? "#6BA3C7" : "#9CA3AF";
const alertColor = a => a.includes("pricing") || a.includes("high_intent") ? "red" : a.includes("comparing") ? "blue" : "amber";
const repName = id => SALES_REPS.find(r => r.id === id)?.name || "-";
const campName = id => CAMPAIGNS.find(c => c.id === id)?.name || "-";
const towerName = (id, lang) => lang === "ar" ? (TOWERS[id]?.nameAr || id) : (TOWERS[id]?.name || id);

// ─── SALES TRIGGER ENGINE ────────────────────────────────────
// Analyzes VIP's last 48h events to generate a "Why call now?" reason
const getSalesTrigger = (vipEvents, lang) => {
  const h48 = Date.now() - 48 * 3600000;
  const recent = vipEvents.filter(e => new Date(e.timestamp).getTime() > h48);
  if (recent.length === 0) return null;

  const recentActions = recent.map(e => e.event);
  const recentUnits = recent.filter(e => e.unitName).map(e => e.unitName);
  const uniqueUnits = [...new Set(recentUnits)];
  const hasPH = recent.some(e => e.unitId && UNITS.find(u => u.id === e.unitId)?.type === "PH");
  const hasPricing = recentActions.includes("request_pricing") || recentActions.includes("explore_payment_plan");
  const hasBooking = recentActions.includes("book_viewing");
  const hasComparison = recentActions.includes("comparison_view");
  const hasFloorplan = recentActions.includes("view_floorplan");

  if (hasBooking) {
    return { type: "booking", color: "#2ec4b6", icon: "✅",
      en: `Booked a viewing for ${uniqueUnits[0]||"a unit"}. Confirm and prepare sales materials.`,
      ar: `حجز معاينة لـ ${uniqueUnits[0]||"وحدة"}. أكّد وحضّر مواد المبيعات.` };
  }
  if (hasPH && hasPricing) {
    return { type: "hot_ph", color: "#e63946", icon: "🔥",
      en: `High Penthouse interest — viewed PH and requested pricing in last 48h. Luxury up-sell opportunity.`,
      ar: `اهتمام عالي بالبنتهاوس — شاهد بنتهاوس وطلب تسعير خلال 48 ساعة. فرصة بيع فاخر.` };
  }
  if (hasPricing && !hasBooking) {
    return { type: "pricing_stall", color: "#f4a261", icon: "💰",
      en: `Requested pricing for ${uniqueUnits[0]||"units"} but hasn't booked. Offer payment plan incentive.`,
      ar: `طلب تسعير ${uniqueUnits[0]||"وحدات"} لكن لم يحجز. قدّم حافز خطة دفع.` };
  }
  if (hasComparison) {
    return { type: "comparing", color: "#457b9d", icon: "⚖️",
      en: `Actively comparing ${uniqueUnits.length} units. Help narrow the choice — schedule a guided tour.`,
      ar: `يقارن ${uniqueUnits.length} وحدات بنشاط. ساعد في تضييق الاختيار — جدول جولة موجهة.` };
  }
  if (hasFloorplan) {
    return { type: "floorplan", color: "#457b9d", icon: "📐",
      en: `Studying floor plans for ${uniqueUnits[0]||"units"}. Send 3D walkthrough or schedule visit.`,
      ar: `يدرس المخططات لـ ${uniqueUnits[0]||"وحدات"}. أرسل جولة 3D أو جدول زيارة.` };
  }
  if (recent.length >= 3) {
    return { type: "high_activity", color: "#C5A467", icon: "⚡",
      en: `${recent.length} actions in last 48h — highly engaged. Strike while interest is hot.`,
      ar: `${recent.length} إجراءات في آخر 48 ساعة — تفاعل عالٍ. تصرف بينما الاهتمام ساخن.` };
  }
  return null;
};

// ─── CSS ─────────────────────────────────────────────────────

// ─── ANIMATED COUNTER COMPONENT ──────────────────────────────
const AnimCounter = ({value, duration = 1200}) => {
  const [display, setDisplay] = useState(0);
  const numVal = typeof value === "string" ? parseFloat(value) || 0 : value;
  const isPercent = typeof value === "string" && value.includes("%");
  const suffix = typeof value === "string" ? value.replace(/[\d.]/g, "").trim() : "";
  useEffect(() => {
    if (numVal === 0) { setDisplay(0); return; }
    let start = 0; const step = numVal / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numVal) { setDisplay(numVal); clearInterval(timer); }
      else setDisplay(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [numVal, duration]);
  return <>{isPercent ? display + "%" : display}{suffix && !isPercent ? " " + suffix : ""}</>;
};

// ─── MINI SPARKLINE COMPONENT ────────────────────────────────
const Sparkline = ({data = [], color = "#e63946", height = 24, width = 60}) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (<svg width={width} height={height} style={{display:"inline-block",verticalAlign:"middle"}}>
    <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={width} cy={height - ((data[data.length-1] - min) / range) * height} r="2" fill={color} />
  </svg>);
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { lang } = useLanguage();
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [selectedVip, setSelectedVip] = useState(null);
  const [feedFilter, setFeedFilter] = useState("all");
  const [unitTowerFilter, setUnitTowerFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [outreachVip, setOutreachVip] = useState(null);
  const t = useCallback((k) => (T[lang]||T.en)[k]||k, [lang]);
  const isAr = lang === "ar";
  // Theme-aware chart colors
  const cx = {
    tooltip: { background: theme === "dark" ? "#1A1A22" : "#fff", border: theme === "dark" ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(0,0,0,.08)", borderRadius: 8, fontSize: ".75rem", color: theme === "dark" ? "#E8E8EC" : "#1a1a1f" },
    axis: theme === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
    tick: { fontSize: 10, fill: theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a" },
    tickSm: { fontSize: 9, fill: theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a" },
    tickLabel: { fontSize: 9, fill: theme === "dark" ? "rgba(255,255,255,.55)" : "#555" },
    legend: { fontSize: ".65rem", color: theme === "dark" ? "rgba(255,255,255,.6)" : "#8e8e9a" },
    muted: theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a",
    text: theme === "dark" ? "#E8E8EC" : "#1a1a1f",
    sub: theme === "dark" ? "rgba(255,255,255,.6)" : "#555",
  };

  useEffect(() => { seedDemoData(); }, []);
  useEffect(() => {
    const load = () => setEvents(JSON.parse(localStorage.getItem("dnfc_events")||"[]"));
    load(); const iv = setInterval(load, 3000);
    // Real-time listener from VIP/Ahmed/Marketplace portals
    let bc;
    try { bc = new BroadcastChannel("dnfc_tracking"); bc.onmessage = () => load(); } catch(e) {}
    return () => { clearInterval(iv); bc?.close(); };
  }, []);
  const handleTab = useCallback((tab) => { setActiveTab(tab); setSelectedVip(null); window.scrollTo({top:0,behavior:"smooth"}); }, []);

  // ─── METRICS ENGINE v3.1: Time-Decay + Velocity ────────────
  const metrics = useMemo(() => {
    const vipEv = events.filter(e=>e.portalType==="vip"), regEv = events.filter(e=>e.portalType==="registered");
    const anonEv = events.filter(e=>e.portalType==="anonymous"), leadEv = events.filter(e=>e.portalType==="lead");
    const vipN = [...new Set(vipEv.map(e=>e.vipName).filter(Boolean))];
    const regN = [...new Set(regEv.map(e=>e.userName).filter(Boolean))];
    const anonS = [...new Set(anonEv.map(e=>e.sessionId).filter(Boolean))];
    const leadN = [...new Set(leadEv.map(e=>e.leadName).filter(Boolean))];
    // ── TIME-DECAY SCORING ──
    const sm = {};
    events.forEach(e => {
      const n = e.vipName||e.userName||e.leadName||(e.sessionId?`Anon-${e.sessionId.slice(-3)}`:null);
      if(!n) return;
      if(!sm[n]) sm[n]={name:n,rawScore:0,decayedScore:0,type:e.portalType,events:[],lastSeen:e.timestamp,firstSeen:e.timestamp,topUnit:null,actions:{}};
      const w = INTENT_WEIGHTS[e.event]||2;
      const df = decayFactor(e.timestamp);
      sm[n].rawScore += w;
      sm[n].decayedScore += Math.round(w * df * 10) / 10;
      sm[n].events.push(e);
      if(new Date(e.timestamp)>new Date(sm[n].lastSeen)) sm[n].lastSeen=e.timestamp;
      if(new Date(e.timestamp)<new Date(sm[n].firstSeen)) sm[n].firstSeen=e.timestamp;
      if(e.unitName) sm[n].topUnit=e.unitName;
      if(e.event) sm[n].actions[e.event]=(sm[n].actions[e.event]||0)+1;
      if(e.portalType==="vip") sm[n].type="vip";
      else if(e.portalType==="registered"&&sm[n].type!=="vip") sm[n].type="registered";
      else if(e.portalType==="lead"&&sm[n].type==="anonymous") sm[n].type="lead";
    });
    const people = Object.values(sm).sort((a,b)=>b.decayedScore-a.decayedScore);
    // ── SCORE DISTRIBUTION ──
    const scoreDist = [{band:"0-20",count:0,color:"#6B7280"},{band:"20-40",count:0,color:"#457B9D"},{band:"40-60",count:0,color:"#f4a261"},{band:"60-80",count:0,color:"#C5A467"},{band:"80+",count:0,color:"#e63946"}];
    people.forEach(p=>{const s=Math.round(p.decayedScore);if(s<20)scoreDist[0].count++;else if(s<40)scoreDist[1].count++;else if(s<60)scoreDist[2].count++;else if(s<80)scoreDist[3].count++;else scoreDist[4].count++;});
    // ── VIP METRICS ──
    const vipM = VIP_PROFILES.map(vp => {
      const p = sm[vp.fullName];
      const rawScore = p?p.rawScore:0;
      const score = p?Math.round(p.decayedScore):0;
      const vEv = events.filter(e=>e.vipName===vp.fullName);
      const ls = vEv.length>0?vEv[vEv.length-1].timestamp:new Date().toISOString();
      const fs = vEv.length>0?vEv[0].timestamp:new Date().toISOString();
      const idle = daysAgoNum(ls);
      const portalOpen = vEv.find(e=>e.event==="portal_opened");
      const firstView = vEv.find(e=>["view_unit","unit_view"].includes(e.event));
      const ttfa = (portalOpen&&firstView)?Math.round((new Date(firstView.timestamp)-new Date(portalOpen.timestamp))/60000):null;
      const booking = vEv.find(e=>e.event==="book_viewing");
      const viewVel = (booking&&fs)?Math.round((new Date(booking.timestamp)-new Date(fs))/86400000):null;
      const trigger = getSalesTrigger(vEv, lang);
      return {...vp, rawScore, score, lastSeen:ls, firstSeen:fs, idle, ttfa, viewVel, trigger,
        repeatViews:vEv.filter(e=>["view_unit","unit_view"].includes(e.event)).length,
        pricingTime:vEv.filter(e=>["request_pricing","explore_payment_plan"].includes(e.event)).length*170,
        comparisons:vEv.filter(e=>e.event==="comparison_view").length, events:vEv};
    }).sort((a,b)=>b.score-a.score);
    // ── VIP CANDIDATES ──
    const vipCandidates = people.filter(p=>p.type==="registered"&&p.decayedScore>=50).map(p=>({...p,score:Math.round(p.decayedScore)}));
    // ── VELOCITY KPIs ──
    const ttfaVals = vipM.filter(v=>v.ttfa!==null).map(v=>v.ttfa);
    const avgTTFA = ttfaVals.length>0?Math.round(ttfaVals.reduce((a,b)=>a+b,0)/ttfaVals.length):null;
    const velVals = vipM.filter(v=>v.viewVel!==null).map(v=>v.viewVel);
    const avgVel = velVals.length>0?(velVals.reduce((a,b)=>a+b,0)/velVals.length).toFixed(1):null;
    const vipBookRate = vipN.length>0?vipM.filter(v=>v.events.some(e=>e.event==="book_viewing")).length/vipN.length:0;
    const stdTotal = regN.length+anonS.length+leadN.length;
    const stdBookRate = stdTotal>0?events.filter(e=>e.event==="book_viewing"&&e.portalType!=="vip").length/stdTotal:0;
    const convLift = stdBookRate>0?(vipBookRate/stdBookRate).toFixed(1)+"x":(vipBookRate>0?"∞x":"—");
    const leadCaptureRate = anonS.length>0?Math.round(leadN.length/anonS.length*100):0;
    // ── CONVERSIONS ──
    const ca = ["book_viewing","request_pricing","explore_payment_plan","download_brochure"];
    const conv = {}; ca.forEach(a=>{conv[a]={total:events.filter(e=>e.event===a).length,vip:events.filter(e=>e.event===a&&e.portalType==="vip").length,std:events.filter(e=>e.event===a&&e.portalType!=="vip").length};});
    const um = {}; events.filter(e=>e.unitName).forEach(e=>{
      if(!um[e.unitName]) um[e.unitName]={name:e.unitName,unitId:e.unitId,views:0,downloads:0,pricing:0,bookings:0};
      if(["view_unit","unit_view"].includes(e.event)) um[e.unitName].views++;
      if(e.event==="download_brochure") um[e.unitName].downloads++;
      if(["request_pricing","explore_payment_plan"].includes(e.event)) um[e.unitName].pricing++;
      if(e.event==="book_viewing") um[e.unitName].bookings++;
    }); const unitInt = Object.values(um);
    // Funnel with drop-off
    const fnRaw = [
      {label:t("totalVisitors"),count:vipN.length+regN.length+anonS.length+leadN.length,color:"#6B7280"},
      {label:t("viewedUnit"),count:[...new Set(events.filter(e=>["view_unit","unit_view"].includes(e.event)).map(e=>e.vipName||e.userName||e.sessionId))].length,color:"#457b9d"},
      {label:t("downloaded"),count:[...new Set(events.filter(e=>e.event==="download_brochure").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#6ba3c7"},
      {label:t("requestedPricing"),count:[...new Set(events.filter(e=>e.event==="request_pricing").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#f4a261"},
      {label:t("bookedViewing"),count:[...new Set(events.filter(e=>e.event==="book_viewing").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#2ec4b6"},
    ];
    const fn = fnRaw.map((f,i)=>{const prev=i>0?fnRaw[i-1].count:null;return{...f,dropOff:(prev&&prev>0)?Math.round((1-f.count/prev)*100):null};});
    const ch = [{name:t("chartVip"),value:vipEv.length,color:"#e63946"},{name:t("chartRegistered"),value:regEv.length,color:"#457b9d"},{name:t("chartAnonymous"),value:anonEv.length+leadEv.length,color:cx.muted}];
    const dm = {}; events.forEach(e=>{const d=new Date(e.timestamp);if(isNaN(d.getTime()))return;const dk=d.toISOString().slice(0,10),dl=d.toLocaleDateString("en-US",{month:"short",day:"numeric"});if(!dm[dk])dm[dk]={day:dl,sortKey:dk,vip:0,registered:0,anonymous:0};if(e.portalType==="vip")dm[dk].vip++;else if(e.portalType==="registered")dm[dk].registered++;else dm[dk].anonymous++;});
    const daily = Object.values(dm).sort((a,b)=>a.sortKey.localeCompare(b.sortKey));
    const ti = {}; events.filter(e=>e.unitId).forEach(e=>{const u=UNITS.find(x=>x.id===e.unitId);if(u)ti[u.tower]=(ti[u.tower]||0)+1;});
    // ── LIVE HEATMAPS ──
    const vipHeat = vipM.map(v => {
      const ev = v.events;
      return { name:v.fullName,
        ph:ev.filter(e=>e.unitId&&UNITS.find(u=>u.id===e.unitId)?.type==="PH").length*20,
        br3:ev.filter(e=>e.unitId&&UNITS.find(u=>u.id===e.unitId)?.type==="3BR").length*20,
        br2:ev.filter(e=>e.unitId&&UNITS.find(u=>u.id===e.unitId)?.type==="2BR").length*15,
        br1:ev.filter(e=>e.unitId&&UNITS.find(u=>u.id===e.unitId)?.type==="1BR").length*15,
      };
    });
    const demandHeat = Object.keys(TOWERS).map(tk => {
      const tU = UNITS.filter(u=>u.tower===tk);
      return {tower:tk,
        low:Math.min(events.filter(e=>e.unitId&&tU.find(u=>u.id===e.unitId&&u.floor<=4)).length*10,99),
        mid:Math.min(events.filter(e=>e.unitId&&tU.find(u=>u.id===e.unitId&&u.floor>=5&&u.floor<=8)).length*10,99),
        high:Math.min(events.filter(e=>e.unitId&&tU.find(u=>u.id===e.unitId&&u.floor>=9)).length*10,99)};
    });
    return {totalEvents:events.length,vipN,regN,leadN,anonS,people,vipM,vipCandidates,conv,unitInt,fn,ch,daily,ti,
      bookings:events.filter(e=>e.event==="book_viewing").length,scoreDist,avgTTFA,avgVel,convLift,leadCaptureRate,vipHeat,demandHeat};
  }, [events, t, lang]);

  const maxF = Math.max(...metrics.fn.map(f=>f.count),1);
  const openOutreach = (vid) => { const v=VIP_PROFILES.find(x=>x.vipId===vid); if(v){setOutreachVip(v);setModal("outreach");} };
  const NAV = [
    {key:"overview",ico:"⊞",label:t("navOverview")},{key:"vipcrm",ico:"👤",label:t("navVipCrm"),count:metrics.vipM.length},
    {key:"priority",ico:"⭐",label:t("navPriority")},{key:"analytics",ico:"📊",label:t("navAnalytics")},
    {key:"units",ico:"🏠",label:t("navUnits")},{key:"campaigns",ico:"✉",label:t("navCampaigns")},
    {key:"settings",ico:"⚙",label:t("navSettings")},
  ];
  const idleCls = d => d>=3?"db-idle-danger":d>=2?"db-idle-warn":"db-idle-ok";
  const maxSD = Math.max(...metrics.scoreDist.map(s=>s.count),1);

  return (
    <div className={`db ${theme === "light" ? "light" : ""}`} dir={isAr?"rtl":"ltr"}>
      <SEO title="CRM Intelligence Dashboard" description="Real estate behavioral analytics — lead scoring, VIP outreach, and conversion optimization." path="/enterprise/crmdemo/dashboard" />
      <aside className="db-sidebar">
        <div className="db-brand"><h2>{t("headerTitle")}</h2><p>Dynamic NFC Intelligence</p></div>
        <nav className="db-nav">
          <div className="db-nav-label">{t("navLabelIntel")}</div>
          {NAV.map(n=>(<div key={n.key} className={`db-nav-item ${activeTab===n.key?"act":""}`} onClick={()=>handleTab(n.key)}>
            <span className="nav-ico">{n.ico}</span>{n.label}{n.count?<span className="db-nav-count">{n.count}</span>:null}
          </div>))}
          <div className="db-nav-label" style={{marginTop:".5rem"}}>{t("navLabelPortals")}</div>
          <Link to="/enterprise/crmdemo/khalid" className="db-nav-item"><span className="nav-ico">🔑</span>{t("navVipPortal")}</Link>
          <Link to="/enterprise/crmdemo/registered" className="db-nav-item"><span className="nav-ico">🔐</span>{t("navLoginPortal")}</Link>
          <Link to="/enterprise/crmdemo/marketplace" className="db-nav-item"><span className="nav-ico">🌐</span>{t("navMarketplace")}</Link>
        </nav>
        <div style={{padding:".75rem 1.25rem",borderTop:"1px solid rgba(255,255,255,.06)"}}><img src="/assets/images/dynamicnfc-logo-red.png" alt="Dynamic NFC" style={{height:16,opacity:.4}}/></div>
      </aside>
      <div className="db-main">
        <div className="db-topbar">
          <div><div className="db-tb-title">{t("headerTitle")} — {t("headerSub")}</div><div className="db-tb-sub">{metrics.totalEvents} {t("eventsTracked")} · {t("decayLabel")}</div></div>
          <div className="db-tb-right">
            <div className="db-live">LIVE</div>
            <button className="db-theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}>
              <div className="db-theme-dot" />{theme === "dark" ? "Dark" : "Light"}
            </button>

            <button className="db-pill" onClick={()=>setModal("help")}>{t("help")}</button>
            <button className="db-pill" onClick={()=>setModal("createVip")}>{t("createVip")}</button>
            <button className="db-pill" onClick={()=>{localStorage.removeItem("dnfc_events");seedDemoData();window.location.reload();}} style={{fontSize:".6rem"}}>{t("resetDemo")}</button>
          </div>
        </div>
        <div className="db-content">

{/* ═══════════════ TAB 1: OVERVIEW ═══════════════ */}
{activeTab==="overview"&&(<>
  <div className="db-exec"><div style={{flex:1}}><h3>{t("execView")}</h3><p>{t("execDesc")}</p>
    <div className="db-exec-chips"><span className="db-chip">{t("kpi1")}</span><span className="db-chip">{t("kpi2")}</span><span className="db-chip">{t("kpi3")}</span></div></div></div>
  {/* VELOCITY KPIs */}
  <div className="db-vel-kpis">
    <div className="db-vel-kpi"><div className="db-vel-label">{t("mTimeToAction")}</div><div className="db-vel-value">{metrics.avgTTFA!==null?metrics.avgTTFA+(isAr?" دقيقة":" min"):"—"}</div><div className="db-vel-sub">{t("mTimeToActionSub")}</div></div>
    <div className="db-vel-kpi"><div className="db-vel-label">{t("mViewingVelocity")}</div><div className="db-vel-value">{metrics.avgVel!==null?metrics.avgVel+(isAr?" يوم":" days"):"—"}</div><div className="db-vel-sub">{t("mViewingVelSub")}</div></div>
    <div className="db-vel-kpi"><div className="db-vel-label">{t("mVipConvLift")}</div><div className="db-vel-value" style={{color:metrics.convLift.includes("∞")||parseFloat(metrics.convLift)>1?"#e63946":"#457b9d"}}>{metrics.convLift}</div><div className="db-vel-sub">{t("mVipConvLiftSub")}</div></div>
    <div className="db-vel-kpi"><div className="db-vel-label">{t("mLeadCaptureRate")}</div><div className="db-vel-value">{metrics.leadCaptureRate}%</div><div className="db-vel-sub">{t("mLeadCaptureSub")}</div></div>
  </div>
  {/* Standard KPIs — Animated */}
  <div className="db-kpis">
    <div className="db-kpi"><div className="db-kpi-val red"><AnimCounter value={metrics.vipN.length}/></div><div className="db-kpi-lbl">{t("mVipSessions")}</div><div className="db-kpi-sub">{t("mVipSub")}</div></div>
    <div className="db-kpi"><div className="db-kpi-val blue"><AnimCounter value={metrics.regN.length}/></div><div className="db-kpi-lbl">{t("mRegSessions")}</div><div className="db-kpi-sub">{t("mRegSub")}</div></div>
    <div className="db-kpi"><div className="db-kpi-val green"><AnimCounter value={metrics.anonS.length}/></div><div className="db-kpi-lbl">{t("mAnonSessions")}</div><div className="db-kpi-sub">{t("mAnonSub")}</div></div>
    <div className="db-kpi"><div className="db-kpi-val amber"><AnimCounter value={(metrics.conv.book_viewing?.total||0)+(metrics.conv.request_pricing?.total||0)+(metrics.conv.explore_payment_plan?.total||0)+(metrics.conv.download_brochure?.total||0)}/></div><div className="db-kpi-lbl">{t("mTotalConversions")}</div><div className="db-kpi-sub">{t("mConvSub")}</div></div>
    <div className="db-kpi"><div className="db-kpi-val" style={{color:"#2ec4b6"}}><AnimCounter value={metrics.bookings}/></div><div className="db-kpi-lbl">{t("mBookedViewings")}</div></div>
  </div>
  {/* Shared Actions */}
  <div className="db-sec"><h2>{t("sharedConversions")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("badgeVipStd")}</span></div>
  <div className="db-actions">
    {[{k:"book_viewing",l:t("actBookViewing"),c:"red",sc:"#e63946"},{k:"request_pricing",l:t("actRequestPricing"),c:"blue",sc:"#457b9d"},{k:"explore_payment_plan",l:t("actRequestPayment"),c:"green",sc:"#2ec4b6"},{k:"download_brochure",l:t("actDownloadBrochure"),c:"amber",sc:"#f4a261"}].map(a=>{
      const dailyData = metrics.daily.map(d => {
        const dayEvents = events.filter(e => e.event === a.k && e.timestamp && new Date(e.timestamp).toISOString().slice(0,10) === d.sortKey);
        return dayEvents.length;
      }).slice(-7);
      return (
      <div className="db-abar" key={a.k}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div className={`val ${a.c}`}><AnimCounter value={metrics.conv[a.k]?.total||0}/></div>
          <Sparkline data={dailyData.length >= 2 ? dailyData : [0,0]} color={a.sc} height={20} width={50}/>
        </div>
        <div className="lbl">{a.l}</div>
        <div className="split"><span style={{display:"flex",alignItems:"center",gap:3}}><span className="dot" style={{background:"#e63946"}}/>VIP: <b>{metrics.conv[a.k]?.vip||0}</b></span><span style={{display:"flex",alignItems:"center",gap:3}}><span className="dot" style={{background:"#457b9d"}}/>Std: <b>{metrics.conv[a.k]?.std||0}</b></span></div>
      </div>);})}
  </div>
  {/* Charts: Multi-line + Donut */}
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("engagementOverTime")}</div></div>
      <div className="db-card-body" ><ResponsiveContainer width="100%" height={220}><LineChart data={metrics.daily}>
        <XAxis dataKey="day" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false}/>
        <YAxis stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={cx.tooltip}/>
        <Line type="monotone" dataKey="vip" stroke="#e63946" strokeWidth={2} dot={{r:3,fill:"#e63946"}}/>
        <Line type="monotone" dataKey="registered" stroke="#457b9d" strokeWidth={2} dot={{r:3,fill:"#457b9d"}}/>
        <Line type="monotone" dataKey="anonymous" stroke={theme === "dark" ? "rgba(255,255,255,.4)" : "#8e8e9a"} strokeWidth={2} dot={{r:3,fill:theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a"}}/>
        <Legend wrapperStyle={cx.legend}/>
      </LineChart></ResponsiveContainer></div></div>
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("channelMix")}</div></div>
      <div className="db-card-body" style={{display:"flex",alignItems:"center",justifyContent:"center"}}><ResponsiveContainer width="100%" height={220}><PieChart>
        <Pie data={metrics.ch} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={4} dataKey="value">{metrics.ch.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie>
        <Tooltip contentStyle={cx.tooltip}/>
      </PieChart></ResponsiveContainer></div>
      <div style={{padding:"0 1.25rem .5rem",textAlign:"center"}}><span style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:600}}>{metrics.totalEvents}</span><span style={{fontSize:".55rem",color:cx.muted,marginLeft:4}}>{isAr?"إجمالي":"total"}</span></div>
      <div style={{padding:"0 1.25rem .75rem",display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>{metrics.ch.map((d,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:".62rem",color:cx.muted}}><span style={{width:6,height:6,borderRadius:"50%",background:d.color}}/>{d.name} ({d.value})</span>))}</div></div>
  </div>
  {/* Feed + VIP Summary */}
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("liveActivityFeed")}</div><div className="db-card-sub">{t("realtimeInteractions")}</div></div>
      <div style={{display:"flex",gap:4}}>{["all","vip","registered"].map(f=>(<button key={f} className={`db-pill ${feedFilter===f?"act":""}`} onClick={()=>setFeedFilter(f)}>{f==="all"?t("feedAll"):f==="vip"?t("feedVip"):t("feedRegistered")}</button>))}</div></div>
      <div className="db-card-body" style={{padding:0}}><div className="db-feed" style={{padding:"0 1.25rem"}}>
        {events.slice().reverse().filter(e=>feedFilter==="all"||e.portalType===feedFilter).slice(0,18).map((e,i)=>{
          const el=(EVENT_LABELS[lang]||EVENT_LABELS.en); let act=el[e.event]||e.event; if(e.unitName)act+=` — ${e.unitName}`;
          const cls=e.portalType==="vip"?"vip":e.portalType==="registered"?"reg":"anon";
          return(<div className="db-feed-item" key={i}><div className={`db-feed-ico ${cls}`}>{e.portalType==="vip"?"🔑":e.portalType==="registered"?"👤":"🌐"}</div>
            <div className="db-feed-body"><strong>{e.vipName||e.userName||e.leadName||(isAr?"مجهول":"Anonymous")}</strong>{e.portalType==="vip"&&<span style={{color:"#e63946",fontSize:".55rem",marginLeft:4}}>VIP</span>}<div className="desc">{act}</div></div>
            <span className="db-feed-time">{ago(e.timestamp,lang)}</span></div>);})}
      </div></div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("vipActivitySummary")}</div><div className="db-card-sub">{t("highPrioritySignals")}</div></div></div>
      <div className="db-card-body">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:".5rem",marginBottom:"1rem"}}>
          {[{v:metrics.vipM.filter(x=>x.score>=70).length,l:t("hotLeads"),bg:"rgba(230,57,70,.04)",bc:"rgba(230,57,70,.08)",c:"#e63946"},
            {v:metrics.vipM.reduce((a,x)=>a+x.alerts.length,0),l:t("activeAlerts"),bg:"rgba(244,162,97,.04)",bc:"rgba(244,162,97,.08)",c:"#f4a261"},
            {v:metrics.vipM.length>0?Math.round(metrics.vipM.reduce((a,x)=>a+x.score,0)/metrics.vipM.length):0,l:t("avgLeadScore")+" ⏳",bg:"rgba(69,123,157,.04)",bc:"rgba(69,123,157,.08)",c:"#457b9d"},
          ].map((m,i)=>(<div key={i} style={{padding:".5rem",borderRadius:8,background:m.bg,border:`1px solid ${m.bc}`,textAlign:"center"}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:600,color:m.c}}>{m.v}</div><div style={{fontSize:".55rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".08em"}}>{m.l}</div></div>))}
        </div>
        {metrics.vipM.map(v=>{
          const last7 = Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const dk=d.toISOString().slice(0,10);return v.events.filter(e=>e.timestamp&&e.timestamp.slice(0,10)===dk).length;});
          return(<div key={v.vipId} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".45rem 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
          <div className="db-vip-avatar" style={{background:`linear-gradient(135deg,${scoreColor(v.score)},${v.score>=70?"#c1121f":"#2b6684"})`,width:28,height:28,fontSize:".65rem"}}>{initials(v.fullName)}</div>
          <div style={{flex:1}}><div style={{fontWeight:500,fontSize:".75rem",color:cx.text}}>{v.fullName} {v.idle>=2&&<span className="db-at-risk">{t("atRisk")}</span>}</div><div style={{fontSize:".58rem",color:cx.muted}}>{towerName(v.topTower,lang)} · {v.idle}d idle</div></div>
          <Sparkline data={last7} color={scoreColor(v.score)} height={18} width={40}/>
          <div style={{textAlign:"right"}}><div style={{fontWeight:600,fontSize:".82rem",color:scoreColor(v.score)}}>{v.score}<span style={{fontSize:".48rem",color:cx.muted}}> ⏳</span></div></div>
        </div>);})}{metrics.vipCandidates.length>0&&(<div style={{marginTop:".5rem",padding:".45rem",borderRadius:6,background:"rgba(197,164,103,.04)",border:"1px dashed rgba(197,164,103,.2)"}}><div style={{fontSize:".55rem",color:"#C5A467",fontWeight:600,textTransform:"uppercase"}}>⭐ {t("vipCandidate")}</div>
          {metrics.vipCandidates.map(c=>(<div key={c.name} style={{fontSize:".72rem",color:cx.sub,marginTop:".2rem"}}>{c.name} — score: <strong style={{color:"#C5A467"}}>{c.score}</strong></div>))}</div>)}
        <button className="db-pill" style={{width:"100%",textAlign:"center",marginTop:".65rem"}} onClick={()=>handleTab("priority")}>{isAr?"عرض قائمة الأولوية →":"View Priority List →"}</button>
      </div></div>
  </div>
  {/* Funnel with drop-off + Tower */}
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("conversionFunnel")}</div></div>
      <div className="db-card-body" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
        {metrics.fn.map((f,i)=>{
          const widthPct = Math.max(20, (f.count/maxF)*100);
          const nextWidth = metrics.fn[i+1] ? Math.max(20, (metrics.fn[i+1].count/maxF)*100) : widthPct * 0.6;
          return (<div key={i} style={{width:"100%",maxWidth:500}}>
            {f.dropOff!==null&&f.dropOff>0&&<div style={{textAlign:"center",fontSize:".55rem",color:"#e63946",fontWeight:600,padding:".15rem 0"}}>↓ {f.dropOff}% {t("dropOff")}</div>}
            <div style={{display:"flex",alignItems:"center",gap:".75rem",margin:"2px 0"}}>
              <div style={{width:90,fontSize:".68rem",color:"rgba(255,255,255,.55)",textAlign:"right",flexShrink:0}}>{f.label}</div>
              <div style={{flex:1,position:"relative"}}>
                <svg width="100%" height="34" viewBox="0 0 400 34" preserveAspectRatio="none">
                  <polygon
                    points={`${(400-widthPct*4)/2},0 ${400-(400-widthPct*4)/2},0 ${400-(400-nextWidth*4)/2},34 ${(400-nextWidth*4)/2},34`}
                    fill={f.color} opacity="0.85" rx="4"
                  />
                  <text x="200" y="21" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="Playfair Display,serif">{f.count}</text>
                </svg>
              </div>
              <div style={{width:35,fontSize:".6rem",color:"rgba(255,255,255,.4)"}}>{maxF>0?Math.round(f.count/maxF*100):0}%</div>
            </div>
          </div>);
        })}
      </div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("towerInterestDist")}</div><div className="db-card-sub">{t("allTrafficCombined")}</div></div></div>
      <div className="db-card-body" ><ResponsiveContainer width="100%" height={200}><BarChart data={Object.entries(metrics.ti).map(([k,v])=>({name:towerName(k,lang),value:v}))}>
        <XAxis dataKey="name" stroke={cx.axis} tick={cx.tickSm} axisLine={false} tickLine={false}/>
        <YAxis stroke={cx.axis} tick={cx.tickSm} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={cx.tooltip}/>
        <Bar dataKey="value" radius={[4,4,0,0]}><Cell fill="#e63946"/><Cell fill="#457b9d"/><Cell fill="#2ec4b6"/></Bar>
      </BarChart></ResponsiveContainer></div></div>
  </div>
</>)}

{/* ═══════════════ TAB 2: VIP CRM ═══════════════ */}
{activeTab==="vipcrm"&&(<>
  <div className="db-sec"><h2>{t("vipDirectory")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("personKnown")} · ⏳ {isAr?"اضمحلال زمني":"time-decayed"}</span></div>
  <div className="db-grid db-g12">
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("vipProfiles")}</div><button className="db-pill" onClick={()=>setModal("createVip")}>{t("createVip")}</button></div>
      <div className="db-card-body">{metrics.vipM.map(v=>(<div key={v.vipId} className={`db-vip-row ${selectedVip===v.vipId?"active":""}`} onClick={()=>setSelectedVip(v.vipId)}>
        <div className="db-vip-avatar" style={{background:`linear-gradient(135deg,${scoreColor(v.score)},${v.score>=70?"#c1121f":"#2b6684"})`}}>{initials(v.fullName)}</div>
        <div className="db-vip-info"><div className="name">{v.fullName} {v.idle>=2&&<span className="db-at-risk">{t("atRisk")}</span>}</div><div className="code">{v.vipCode} · {towerName(v.topTower,lang)} · {v.idle}d idle</div></div>
        <div className="db-score-ring" style={{border:`2px solid ${scoreColor(v.score)}`}}><span style={{color:scoreColor(v.score),fontWeight:600,fontSize:".7rem"}}>{v.score}</span></div>
      </div>))}</div></div>
    <div className="db-card">{!selectedVip?(
      <div style={{textAlign:"center",padding:"3rem 1rem",color:cx.muted}}><div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>👤</div><p style={{fontSize:".82rem"}}>{t("selectVipPrompt")}</p></div>
    ):(()=>{const v=metrics.vipM.find(x=>x.vipId===selectedVip); if(!v) return null; return(
      <div className="db-card-body">
        <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1rem",flexWrap:"wrap"}}>
          <div className="db-vip-avatar" style={{width:44,height:44,fontSize:"1rem",background:`linear-gradient(135deg,${scoreColor(v.score)},${v.score>=70?"#c1121f":"#2b6684"})`}}>{initials(v.fullName)}</div>
          <div style={{flex:1,minWidth:150}}><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:500}}>{v.fullName} {v.idle>=2&&<span className="db-at-risk">{t("atRisk")}</span>}</h3><div style={{fontSize:".68rem",color:cx.muted}}>{v.vipCode} · {v.email} · {v.phone}</div></div>
          <button className="db-pill" onClick={()=>openOutreach(v.vipId)}>📞 {t("outreachBtn")}</button><button className="db-pill" style={{color:"#e63946"}}>🔗 {t("reissueLink")}</button>
        </div>
        {/* SALES TRIGGER */}
        {v.trigger&&(<div className="db-trigger" style={{background:`${v.trigger.color}0a`,border:`1px solid ${v.trigger.color}22`}}>
          <span className="db-trigger-ico">{v.trigger.icon}</span>
          <div className="db-trigger-body"><div className="db-trigger-label" style={{color:v.trigger.color}}>💡 {t("salesTrigger")}: {t("whyCallNow")}</div><div className="db-trigger-text" style={{color:cx.sub}}>{isAr?v.trigger.ar:v.trigger.en}</div></div>
        </div>)}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".4rem",marginBottom:"1rem"}}>
          {[{l:t("decayedScore"),v2:v.score+"⏳",c:scoreColor(v.score)},{l:t("repeatViews"),v2:v.repeatViews,c:"#457b9d"},{l:t("pricingSignal"),v2:Math.floor(v.pricingTime/60)+"m",c:"#f4a261"},{l:t("daysIdle"),v2:v.idle+"d",c:v.idle>=2?"#e63946":"#2ec4b6"}].map((m,i)=>(
            <div key={i} style={{padding:".45rem",borderRadius:8,border:"1px solid rgba(255,255,255,.08)",textAlign:"center"}}><div style={{fontSize:".55rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{m.l}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:600,color:m.c}}>{m.v2}</div></div>))}
        </div>
        {v.ttfa!==null&&(<div style={{fontSize:".68rem",color:cx.muted,marginBottom:".5rem"}}>{t("mTimeToAction")}: <strong style={{color:"#C5A467"}}>{v.ttfa} min</strong>{v.viewVel!==null&&<> · {t("mViewingVelocity")}: <strong style={{color:"#C5A467"}}>{v.viewVel} days</strong></>}</div>)}
        <div style={{marginBottom:".75rem"}}><div style={{fontSize:".58rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".25rem"}}>{t("alerts")}</div>
          {v.alerts.map((a,i)=>{const cls=a.includes("pricing")||a.includes("high_intent")?"db-alert-red":a.includes("comparing")?"db-alert-blue":"db-alert-amber"; const label=T[lang]?.[`alert${a.includes("pricing")?"Pricing":a.includes("high_intent")?"HighIntent":a.includes("comparing")?"Comparing":"Family"}`]||a; return <span key={i} className={`db-alert ${cls}`}>{label}</span>;})}</div>
        <div style={{display:"flex",gap:".75rem",marginBottom:".75rem",fontSize:".72rem",color:cx.sub,flexWrap:"wrap"}}>
          <span>{t("salesRep")}: <strong style={{color:cx.text}}>{repName(v.salesRepId)}</strong></span>
          <span>{t("card")}: <strong style={{color:cx.text}}>{v.cardId}</strong></span>
          <span>{t("campaign")}: <strong style={{color:cx.text}}>{campName(v.campaignId)}</strong></span>
        </div>
        <div style={{fontSize:".58rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".4rem"}}>{t("timeline")} · {t("lastSeen")} {ago(v.lastSeen,lang)}</div>
        {v.events.slice().reverse().slice(0,10).map((e,i)=>{const el=(EVENT_LABELS[lang]||EVENT_LABELS.en); const bc=e.event.includes("pricing")||e.event==="book_viewing"?"#e63946":"#457b9d";
          return(<div className="db-tl-item" key={i}><div className="db-tl-dot" style={{borderColor:bc}}/><div><div className="db-tl-event">{el[e.event]||e.event}</div>{e.unitName&&<div className="db-tl-unit">{e.unitName}</div>}<div className="db-tl-meta">{ago(e.timestamp,lang)} · decay: ×{decayFactor(e.timestamp).toFixed(2)}</div></div></div>);})}
      </div>);})()}</div>
  </div>
</>)}

{/* ═══════════════ TAB 3: PRIORITY VIP ═══════════════ */}
{activeTab==="priority"&&(<>
  <div className="db-sec"><h2>{t("priorityVipList")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("dailySalesCockpit")}</span></div>
  <p style={{fontSize:".78rem",color:cx.sub,marginBottom:".75rem"}}>{t("prioritySortedDesc")}</p>
  <div className="db-card" style={{marginBottom:"1.25rem"}}><div className="db-card-body" style={{padding:0}}>
    <table className="db-table"><thead><tr><th>{t("thVip")}</th><th>{t("thLeadScore")} ⏳</th><th>{t("thTrigger")}</th><th>{t("thDaysIdle")}</th><th>{t("thAlerts")}</th><th>{t("thAction")}</th></tr></thead>
      <tbody>{metrics.vipM.map(v=>(<tr key={v.vipId}>
        <td><div style={{fontWeight:500,color:cx.text}}>{v.fullName}</div><div style={{fontSize:".6rem",color:cx.muted}}>{v.vipCode} · {towerName(v.topTower,lang)}</div></td>
        <td><span style={{fontWeight:600,color:scoreColor(v.score)}}>{v.score}</span><span style={{fontSize:".52rem",color:cx.muted,marginLeft:3}}>({isAr?"خام":"raw"}: {v.rawScore})</span></td>
        <td style={{maxWidth:200}}>{v.trigger?(<span style={{fontSize:".68rem",color:v.trigger.color}}>{v.trigger.icon} {(isAr?v.trigger.ar:v.trigger.en).slice(0,60)}...</span>):(<span style={{color:cx.muted}}>—</span>)}</td>
        <td><span className={idleCls(v.idle)}>{v.idle}d</span> {v.idle>=2&&<span className="db-at-risk">{t("atRisk")}</span>}</td>
        <td>{v.alerts.map((a,i)=>{const cls=a.includes("pricing")||a.includes("high_intent")?"db-alert-red":a.includes("comparing")?"db-alert-blue":"db-alert-amber"; return <span key={i} className={`db-alert ${cls}`}>{T[lang]?.[`alert${a.includes("pricing")?"Pricing":a.includes("high_intent")?"HighIntent":a.includes("comparing")?"Comparing":"Family"}`]||a}</span>;})}</td>
        <td><button className="db-pill" onClick={()=>openOutreach(v.vipId)} style={{color:"#e63946"}}>{isAr?"تواصل →":"Outreach →"}</button></td>
      </tr>))}</tbody></table>
  </div></div>
  {metrics.vipCandidates.length>0&&(<div className="db-card" style={{marginBottom:"1.25rem"}}><div className="db-card-hd"><div><div className="db-card-title">⭐ {t("vipCandidate")}</div><div className="db-card-sub">{t("vipCandidateDesc")}</div></div></div>
    <div className="db-card-body">{metrics.vipCandidates.map(c=>(<div className="db-candidate" key={c.name}>
      <div className="db-vip-avatar" style={{background:"linear-gradient(135deg,#C5A467,#a08542)"}}>{initials(c.name)}</div>
      <div style={{flex:1}}><div style={{fontWeight:500,fontSize:".82rem"}}>{c.name}</div><div style={{fontSize:".65rem",color:cx.muted}}>{isAr?"مسجّل":"Registered"} · Score: <strong style={{color:"#C5A467"}}>{c.score}</strong> · Top: {c.topUnit||"—"}</div></div>
      <button className="db-pill" style={{color:"#C5A467",borderColor:"rgba(197,164,103,.3)"}} onClick={()=>alert(`VIP card issued for ${c.name}. Premium box will be sent.`)}>{t("promoteToVip")} →</button>
    </div>))}</div></div>)}
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("nextBestActions")}</div><div className="db-card-sub">{t("autoSuggested")}</div></div></div>
      <div className="db-card-body">{metrics.vipM.map(v=>(<div key={v.vipId} style={{display:"flex",alignItems:"center",gap:".6rem",padding:".45rem 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        <span style={{fontWeight:500,fontSize:".78rem",minWidth:130}}>{v.fullName}</span>
        <span style={{flex:1,fontSize:".72rem",color:cx.sub}}>{v.trigger?(isAr?v.trigger.ar:v.trigger.en):(v.score>=70?(isAr?"جدولة مكالمة فورية":"Schedule immediate call"):(isAr?"إرسال محتوى مخصص":"Send tailored content pack"))}</span>
        <button className="db-pill" onClick={()=>openOutreach(v.vipId)}>{isAr?"تنفيذ →":"Act →"}</button>
      </div>))}</div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("quickActions")}</div><div className="db-card-sub">{t("bulkOps")}</div></div></div>
      <div className="db-card-body">
        <button className="db-pill" style={{width:"100%",textAlign:"center",marginBottom:".4rem"}} onClick={()=>alert(`Email draft created for ${metrics.vipM.filter(v=>v.score>=70).length} high-intent VIPs`)}>📧 {t("emailHighIntent")}</button>
        <button className="db-pill" style={{width:"100%",textAlign:"center"}} onClick={()=>alert("Priority list exported as CSV")}>📋 {t("exportPriorityList")}</button>
        <div style={{marginTop:".65rem",padding:".55rem",borderRadius:6,background:"rgba(244,162,97,.04)",border:"1px solid rgba(244,162,97,.1)",fontSize:".68rem",color:cx.muted}}><strong style={{color:"#f4a261"}}>{t("reminderLabel")}</strong> {t("reminderText")}</div>
      </div></div>
  </div>
</>)}

{/* ═══════════════ TAB 4: ANALYTICS (+ Score Distribution + Live Heatmaps) ═══════════════ */}
{activeTab==="analytics"&&(<>
  <div className="db-sec"><h2>{t("analytics")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("standardVip")} · ⏳</span></div>
  {/* Score Distribution Histogram */}
  <div className="db-card" style={{marginBottom:"1.25rem"}}><div className="db-card-hd"><div><div className="db-card-title">{t("scoreDistribution")}</div><div className="db-card-sub">{t("scoreDistSub")} · {metrics.people.length} {isAr?"جهات اتصال":"contacts"}</div></div></div>
    <div className="db-card-body">
      <div className="db-hist-bar">
        {metrics.scoreDist.map((s,i)=>(<div key={i} className="db-hist-col" style={{height:`${(s.count/maxSD)*100}%`,background:s.color}} title={`${s.band}: ${s.count}`}>
          {s.count>0&&<div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",fontSize:".6rem",fontWeight:600,color:s.color}}>{s.count}</div>}
        </div>))}
      </div>
      <div className="db-hist-labels">
        {[t("scoreBand0"),t("scoreBand20"),t("scoreBand40"),t("scoreBand60"),t("scoreBand80")].map((l,i)=>(<span key={i}>{l}</span>))}
      </div>
    </div>
  </div>
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("actionPerformance")}</div><div className="db-card-sub">{t("vipVsStandard")}</div></div></div>
      <div className="db-card-body" ><ResponsiveContainer width="100%" height={220}><BarChart data={[
        {name:isAr?"حجز":"Book",VIP:metrics.conv.book_viewing?.vip||0,Std:metrics.conv.book_viewing?.std||0},
        {name:isAr?"تسعير":"Pricing",VIP:metrics.conv.request_pricing?.vip||0,Std:metrics.conv.request_pricing?.std||0},
        {name:isAr?"دفع":"Payment",VIP:metrics.conv.explore_payment_plan?.vip||0,Std:metrics.conv.explore_payment_plan?.std||0},
        {name:isAr?"كتيب":"Brochure",VIP:metrics.conv.download_brochure?.vip||0,Std:metrics.conv.download_brochure?.std||0},
      ]}>
        <XAxis dataKey="name" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false}/>
        <YAxis stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={cx.tooltip}/>
        <Bar dataKey="VIP" fill="#e63946" radius={[3,3,0,0]}/><Bar dataKey="Std" fill="#457b9d" radius={[3,3,0,0]}/>
      </BarChart></ResponsiveContainer></div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("topPlansByInterest")}</div><div className="db-card-sub">{t("allTraffic")}</div></div></div>
      <div className="db-card-body" ><ResponsiveContainer width="100%" height={220}><BarChart data={metrics.unitInt.map(u=>({name:u.name,score:u.views+u.downloads*2+u.pricing*3+u.bookings*4})).sort((a,b)=>b.score-a.score)} layout="vertical">
        <XAxis type="number" stroke={cx.axis} tick={cx.tickSm} axisLine={false} tickLine={false}/>
        <YAxis dataKey="name" type="category" width={130} stroke={cx.axis} tick={cx.tickLabel} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={cx.tooltip}/>
        <Bar dataKey="score" fill="#f4a261" radius={[0,4,4,0]}/>
      </BarChart></ResponsiveContainer></div></div>
  </div>
  {/* LIVE Heatmaps */}
  <div className="db-grid db-g2" style={{marginTop:".25rem"}}>
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("vipIntentHeatmap")}</div></div>
      <div className="db-card-body">
        <div className="db-heat" style={{gridTemplateColumns:"130px repeat(4,1fr)"}}>
          <div style={{fontSize:".62rem",color:cx.muted,padding:".35rem"}}></div>
          {[t("heatPenthouse"),t("heat3br"),t("heat2br"),t("heat1br")].map((h,i)=>(<div key={i} style={{fontSize:".62rem",color:cx.muted,textAlign:"center",padding:".35rem"}}>{h}</div>))}
          {metrics.vipHeat.map((r,ri)=>(
            [<div key={`n${ri}`} style={{fontSize:".75rem",fontWeight:500,padding:".35rem"}}>{r.name}</div>,
            ...[r.ph,r.br3,r.br2,r.br1].map((v,ci)=>{const cls=v>=80?"db-heat-vhigh":v>=50?"db-heat-high":v>=25?"db-heat-med":"db-heat-low"; return <div key={`v${ri}${ci}`} className={`db-heat-cell ${cls}`}>{v}</div>;})]
          ))}
        </div>
      </div></div>
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("propertyDemandHeatmap")}</div></div>
      <div className="db-card-body">
        <div className="db-heat" style={{gridTemplateColumns:"130px repeat(3,1fr)"}}>
          <div style={{fontSize:".62rem",color:cx.muted,padding:".35rem"}}></div>
          {[t("floorLow"),t("floorMid"),t("floorHigh")].map((h,i)=>(<div key={i} style={{fontSize:".62rem",color:cx.muted,textAlign:"center",padding:".35rem"}}>{h}</div>))}
          {metrics.demandHeat.map((r,ri)=>(
            [<div key={`n${ri}`} style={{fontSize:".75rem",fontWeight:500,padding:".35rem"}}>{towerName(r.tower,lang)}</div>,
            ...[r.low,r.mid,r.high].map((v,ci)=>{const cls=v>=80?"db-heat-vhigh":v>=50?"db-heat-high":v>=25?"db-heat-med":"db-heat-low"; return <div key={`v${ri}${ci}`} className={`db-heat-cell ${cls}`}>{v}</div>;})]
          ))}
        </div>
      </div></div>
  </div>
  <div className="db-card" style={{marginTop:"1.25rem"}}><div className="db-card-hd"><div className="db-card-title">{t("guidance")}</div></div>
    <div className="db-card-body" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:".75rem"}}>
      {[{t1:t("guideLowClicks"),t2:t("guideLowClicksDesc"),c:"#457b9d"},{t1:t("guidePricing"),t2:t("guidePricingDesc"),c:"#e63946"},{t1:t("guideMvp"),t2:t("guideMvpDesc"),c:"#f4a261"}].map((g,i)=>(
        <div key={i} style={{padding:".75rem",borderRadius:8,border:"1px solid rgba(255,255,255,.08)"}}><div style={{fontWeight:500,fontSize:".82rem",color:g.c,marginBottom:".25rem"}}>{g.t1}</div><div style={{fontSize:".72rem",color:cx.sub,lineHeight:1.5}}>{g.t2}</div></div>
      ))}
    </div></div>
</>)}

{/* ═══════════════ TAB 5: UNITS (+ Zero Engagement Badges) ═══════════════ */}
{activeTab==="units"&&(<>
  <div className="db-sec"><h2>{t("unitsFloorPlans")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{UNITS.length} {isAr?"وحدة":"units"}</span></div>
  <div style={{display:"flex",gap:".4rem",marginBottom:"1rem",flexWrap:"wrap"}}>
    {["all","t1","t2","t3"].map(f=>(<button key={f} className={`db-pill ${unitTowerFilter===f?"act":""}`} onClick={()=>setUnitTowerFilter(f)}>{f==="all"?t("filterAll"):towerName(f,lang)}</button>))}
  </div>
  <div className="db-card"><div className="db-card-body" style={{padding:0}}>
    <table className="db-table"><thead><tr><th>{t("thUnitId")}</th><th>{t("thName")}</th><th>{t("thTower")}</th><th>{t("thFloor")}</th><th>{t("thType")}</th><th>{t("thStatus")}</th><th>{t("thPrice")}</th><th>{t("thVipInterest")}</th></tr></thead>
      <tbody>{UNITS.filter(u=>unitTowerFilter==="all"||u.tower===unitTowerFilter).map(u=>{
        const ui = metrics.unitInt.find(x=>x.unitId===u.id); const views = ui?(ui.views+ui.downloads+ui.pricing+ui.bookings):0;
        const sCls = u.status==="available"?"db-us-available":u.status==="reserved"?"db-us-reserved":"db-us-sold";
        return(<tr key={u.id}>
          <td><code style={{fontSize:".68rem",color:cx.muted}}>{u.id}</code></td>
          <td style={{fontWeight:500,color:cx.text}}>{u.name}</td>
          <td>{towerName(u.tower,lang)}</td><td>{u.floor}</td><td>{u.type}</td>
          <td><span className={`db-unit-status ${sCls}`}>{t(u.status)}</span></td>
          <td style={{fontWeight:500}}>{fmtPrice(u.price)}</td>
          <td>{views>0?(<span>{views} {views>=5?"🔥":""}</span>):(u.status!=="sold"?<span className="db-zero-eng">⚠ {t("zeroEngagement")}</span>:<span style={{color:cx.muted}}>—</span>)}</td>
        </tr>);})}</tbody></table>
  </div></div>
</>)}

{/* ═══════════════ TAB 6: CAMPAIGNS ═══════════════ */}
{activeTab==="campaigns"&&(<>
  <div className="db-sec"><h2>{t("campaigns")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("cardIssuance")}</span></div>
  <p style={{fontSize:".78rem",color:cx.sub,marginBottom:"1rem"}}>{t("campaignsDesc")}</p>
  {CAMPAIGNS.map(c=>(<div className="db-campaign" key={c.id}>
    <div className={`db-campaign-dot ${c.status}`}/><div style={{flex:1}}><div style={{fontWeight:500,fontSize:".82rem",color:cx.text}}>{c.name}</div><div style={{fontSize:".72rem",color:cx.sub}}>{c.desc}</div></div>
    <span className={`db-alert ${c.status==="active"?"db-alert-blue":"db-alert-amber"}`}>{t(c.status)}</span>
  </div>))}
  <div className="db-card" style={{marginTop:"1rem"}}><div className="db-card-hd"><div className="db-card-title">{isAr?"VIP مرتبطون بالحملات":"VIPs Linked to Campaigns"}</div></div>
    <div className="db-card-body" style={{padding:0}}><table className="db-table"><thead><tr><th>VIP</th><th>{t("campaign")}</th><th>{t("card")}</th><th>{t("leadScore")} ⏳</th></tr></thead>
      <tbody>{metrics.vipM.map(v=>(<tr key={v.vipId}><td style={{fontWeight:500}}>{v.fullName}</td><td>{campName(v.campaignId)}</td><td><code style={{fontSize:".65rem"}}>{v.cardId}</code></td><td><span style={{fontWeight:600,color:scoreColor(v.score)}}>{v.score}</span></td></tr>))}</tbody></table></div></div>
</>)}

{/* ═══════════════ TAB 7: SETTINGS ═══════════════ */}
{activeTab==="settings"&&(<>
  <div className="db-sec"><h2>{t("settings")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("mvpControls")}</span></div>
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("dataBoundaries")}</div><div className="db-card-sub">{t("keepSimple")}</div></div></div>
      <div className="db-card-body">{["s1","s2","s3","s4"].map(k=>(<div className="db-setting" key={k}>{t(k)}</div>))}</div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("mvpLock")}</div><div className="db-card-sub">{t("outOfScope")}</div></div></div>
      <div className="db-card-body">{["s5","s6","s7","s8"].map(k=>(<div className="db-setting" key={k}>{t(k)}</div>))}</div></div>
  </div>
</>)}

        </div>{/* end content */}
      </div>{/* end main */}

{/* ═══════════════ MODALS ═══════════════ */}
{modal==="help"&&(<div className="db-modal-overlay" onClick={()=>setModal(null)}><div className="db-modal" onClick={e=>e.stopPropagation()}>
  <button className="db-modal-close" onClick={()=>setModal(null)}>✕</button>
  <h3>{t("howThisWorks")}</h3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem",marginTop:"1rem"}}>
    <div style={{padding:".85rem",borderRadius:8,background:"rgba(230,57,70,.04)",border:"1px solid rgba(230,57,70,.08)"}}>
      <div style={{fontWeight:600,fontSize:".82rem",color:"#e63946",marginBottom:".35rem"}}>{t("vipTraffic")}</div>
      <div style={{fontSize:".72rem",color:cx.sub,lineHeight:1.6}}>{t("vipTrafficDesc")}</div>
    </div>
    <div style={{padding:".85rem",borderRadius:8,background:"rgba(69,123,157,.04)",border:"1px solid rgba(69,123,157,.08)"}}>
      <div style={{fontWeight:600,fontSize:".82rem",color:"#457b9d",marginBottom:".35rem"}}>{t("stdTraffic")}</div>
      <div style={{fontSize:".72rem",color:cx.sub,lineHeight:1.6}}>{t("stdTrafficDesc")}</div>
    </div>
  </div>
  <div style={{marginTop:".75rem",padding:".65rem",borderRadius:6,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)"}}><strong style={{color:cx.text,fontSize:".78rem"}}>{t("keyRule")}</strong><div style={{fontSize:".72rem",color:cx.sub,marginTop:".2rem"}}>{t("keyRuleDesc")}</div></div>
</div></div>)}

{modal==="createVip"&&(<div className="db-modal-overlay" onClick={()=>setModal(null)}><div className="db-modal" onClick={e=>e.stopPropagation()}>
  <button className="db-modal-close" onClick={()=>setModal(null)}>✕</button>
  <h3>{t("createVipTitle")}</h3><p style={{fontSize:".78rem",color:cx.sub,marginBottom:"1rem"}}>{t("createVipDesc")}</p>
  <div className="db-form-group"><label>{t("lblFullName")}</label><input className="db-input" placeholder="Ahmed Al-Rashid"/></div>
  <div className="db-form-group"><label>{t("lblPhone")}</label><input className="db-input" placeholder="+971 50 ..."/></div>
  <div className="db-form-group"><label>{t("lblEmail")}</label><input className="db-input" placeholder="email@domain.com"/></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:".75rem"}}>
    <div className="db-form-group"><label>{t("lblPrefLang")}</label><select className="db-input"><option value="en">English</option><option value="ar">العربية</option></select></div>
    <div className="db-form-group"><label>{t("lblCampaign")}</label><select className="db-input">{CAMPAIGNS.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
  </div>
  <div className="db-form-group"><label>{t("lblCardId")}</label><input className="db-input" placeholder="card_000130"/></div>
  <div style={{marginTop:".5rem",padding:".55rem",borderRadius:6,background:"rgba(69,123,157,.04)",border:"1px solid rgba(69,123,157,.08)",fontSize:".68rem",color:cx.sub}}>{t("createVipNote")}</div>
  <button className="db-pill accent" style={{width:"100%",textAlign:"center",marginTop:".75rem",padding:".55rem"}} onClick={()=>{alert("VIP created. Premium box will be dispatched within 48 hours.");setModal(null);}}>{t("createVipSubmit")}</button>
</div></div>)}

{modal==="outreach"&&outreachVip&&(<div className="db-modal-overlay" onClick={()=>setModal(null)}><div className="db-modal" onClick={e=>e.stopPropagation()}>
  <button className="db-modal-close" onClick={()=>setModal(null)}>✕</button>
  <h3>{t("vipOutreach")} — {outreachVip.fullName}</h3>
  <p style={{fontSize:".78rem",color:cx.sub,marginBottom:"1rem"}}>{t("outreachDesc")}</p>
  <div style={{marginBottom:"1rem"}}>
    <div style={{fontWeight:600,fontSize:".82rem",color:"#e63946",marginBottom:".35rem"}}>📞 {t("callScript")}</div>
    <div style={{padding:".75rem",borderRadius:8,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",fontSize:".78rem",color:cx.sub,lineHeight:1.6}}>
      {isAr?`مرحباً ${outreachVip.fullName}، أنا ${repName(outreachVip.salesRepId)} من نور ريزيدنسز. أتابع دعوتك الخاصة. لاحظنا اهتماماً بـ ${outreachVip.topPlans[0]}. هل يناسبك جدولة معاينة خاصة هذا الأسبوع؟`
      :`Hello ${outreachVip.fullName}, this is ${repName(outreachVip.salesRepId)} from Al Noor Residences. I'm following up on your private invitation. We noticed your interest in ${outreachVip.topPlans[0]}. Would you be available for a private viewing this week?`}
    </div>
  </div>
  <div style={{marginBottom:"1rem"}}>
    <div style={{fontWeight:600,fontSize:".82rem",color:"#457b9d",marginBottom:".35rem"}}>✉ {t("emailSnippet")}</div>
    <div style={{padding:".75rem",borderRadius:8,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",fontSize:".78rem",color:cx.sub,lineHeight:1.6}}>
      {isAr?`عزيزي ${outreachVip.fullName}، شكراً لاهتمامك بـ ${outreachVip.topPlans[0]}. كعضو في برنامج VIP، يسعدنا ترتيب جولة خاصة. تحياتي، ${repName(outreachVip.salesRepId)}`
      :`Dear ${outreachVip.fullName}, Thank you for your interest in ${outreachVip.topPlans[0]}. As a VIP member, we'd love to arrange an exclusive tour at your convenience. Best, ${repName(outreachVip.salesRepId)}`}
    </div>
  </div>
  <div style={{padding:".55rem",borderRadius:6,background:"rgba(244,162,97,.04)",border:"1px solid rgba(244,162,97,.1)",fontSize:".68rem",color:cx.sub}}><strong style={{color:"#f4a261"}}>{t("guardrailLabel")}</strong> {t("guardrailDesc")}</div>
  <div style={{display:"flex",gap:".5rem",marginTop:"1rem"}}>
    <a href={`tel:${outreachVip.phone.replace(/\s/g,"")}`} className="db-pill accent" style={{flex:1,textAlign:"center",padding:".5rem",textDecoration:"none"}}>📞 {isAr?"اتصال":"Call Now"}</a>
    <a href={`mailto:${outreachVip.email}?subject=Private Viewing - Al Noor Residences&body=${encodeURIComponent(`Dear ${outreachVip.fullName},\n\nFollowing up on your private invitation...`)}`} className="db-pill" style={{flex:1,textAlign:"center",padding:".5rem",textDecoration:"none"}}>✉ {isAr?"بريد":"Email"}</a>
    <a href={`https://wa.me/${outreachVip.phone.replace(/\s/g,"")}?text=${encodeURIComponent(`Hi ${outreachVip.fullName}, this is ${repName(outreachVip.salesRepId)} from Al Noor Residences. Following up on your private invitation regarding ${outreachVip.topPlans[0]}...`)}`} target="_blank" rel="noopener noreferrer" className="db-pill" style={{flex:1,textAlign:"center",padding:".5rem",textDecoration:"none"}}>💬 WhatsApp</a>
  </div>
</div></div>)}

    </div>
  );
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage, registerTranslations, useTranslation } from "../../i18n";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import "./AutoDashboard.css";
import SEO from '../../components/SEO/SEO';

// ═══════════════════════════════════════════════════════════════
// PRESTIGE MOTORS — DEALER INTELLIGENCE DASHBOARD v2.0
// ═══════════════════════════════════════════════════════════════
// v1 → v2 Upgrades (DALGA 1):
//   [1] Time-Decay Scoring: DECAY_HALF_LIFE_DAYS = 7
//   [2] Automotive Intent Weights per action type
//   [3] Sales Triggers: getAutoSalesTrigger() — "Why call now?"
//   [4] Demo Event Seeding: 28 realistic automotive events
//   [5] Comprehensive Metrics Engine (replaces old computedKPIs/alertStats)
//   [6] Velocity KPIs: Time-to-First-Action, Test Drive Velocity, VIP Lift
//   [7] Conversion Funnel: NFC Tap → Vehicle View → Config → Pricing → Test Drive
// ═══════════════════════════════════════════════════════════════

// ─── TIME-DECAY SCORING CONSTANT ────────────────────────────
const DECAY_HALF_LIFE_DAYS = 7;
const decayFactor = (eventTimestamp) => {
  const daysAgo = (Date.now() - new Date(eventTimestamp).getTime()) / 86400000;
  return Math.pow(0.5, daysAgo / DECAY_HALF_LIFE_DAYS);
};

// ─── AUTOMOTIVE INTENT WEIGHTS ──────────────────────────────
const INTENT_WEIGHTS = {
  auto_portal_entry: 5,     // NFC tap / portal open
  collection_view: 3,       // browsed a collection
  vehicle_view: 10,         // viewed a specific vehicle
  color_select: 12,         // chose an exterior color
  interior_select: 12,      // chose an interior
  config_save: 25,          // saved a configuration — high intent
  finance_calc: 30,         // opened finance calculator — very high
  test_drive_request: 40,   // booked a test drive — highest
  brochure_download: 15,    // downloaded brochure
  pricing_request: 30,      // requested VIP pricing
  compare_add: 18,          // added to comparison
  favorite_toggle: 8,       // toggled favorite
  language_switch: 2,       // switched language
};

// ─── SALES TRIGGER ENGINE (Automotive) ──────────────────────
const getAutoSalesTrigger = (vipEvents, lang) => {
  const h48 = Date.now() - 48 * 3600000;
  const recent = vipEvents.filter(e => new Date(e.timestamp).getTime() > h48);
  if (recent.length === 0) return null;

  const actions = recent.map(e => e.event);
  const models = [...new Set(recent.filter(e => e.vehicleModel).map(e => e.vehicleModel))];
  const hasTestDrive = actions.includes("test_drive_request");
  const hasFinance = actions.includes("finance_calc");
  const hasPricing = actions.includes("pricing_request");
  const hasConfig = actions.includes("config_save");
  const hasCompare = actions.includes("compare_add");

  if (hasTestDrive) {
    return { type: "test_drive", color: "#2ec4b6", icon: "✅",
      en: `Booked a test drive for ${models[0]||"a vehicle"}. Confirm and prepare delivery experience.`,
      ar: `حجز تجربة قيادة لـ ${models[0]||"سيارة"}. أكّد وحضّر تجربة التسليم.` };
  }
  if (hasFinance && hasConfig) {
    return { type: "hot_config", color: "#e63946", icon: "🔥",
      en: `Configured ${models[0]||"vehicle"} AND opened finance calculator in last 48h. Highest intent — call now with exclusive offer.`,
      ar: `قام بتكوين ${models[0]||"سيارة"} وفتح حاسبة التمويل خلال 48 ساعة. أعلى نية — اتصل الآن بعرض حصري.` };
  }
  if (hasPricing && !hasTestDrive) {
    return { type: "pricing_stall", color: "#f4a261", icon: "💰",
      en: `Requested pricing for ${models[0]||"vehicle"} but hasn't booked test drive. Offer VIP test drive incentive.`,
      ar: `طلب أسعار ${models[0]||"سيارة"} لكن لم يحجز تجربة قيادة. قدّم حافز تجربة VIP.` };
  }
  if (hasCompare) {
    return { type: "comparing", color: "#457b9d", icon: "⚖️",
      en: `Comparing ${models.length} models. Help narrow the choice — schedule a private showroom visit.`,
      ar: `يقارن ${models.length} موديلات. ساعد في تضييق الاختيار — جدول زيارة خاصة.` };
  }
  if (hasConfig) {
    return { type: "configured", color: "#C5A467", icon: "🎨",
      en: `Saved a configuration for ${models[0]||"vehicle"}. Send personalized quote with delivery timeline.`,
      ar: `حفظ تكوين لـ ${models[0]||"سيارة"}. أرسل عرض شخصي مع جدول التسليم.` };
  }
  if (recent.length >= 3) {
    return { type: "high_activity", color: "#C5A467", icon: "⚡",
      en: `${recent.length} actions in last 48h — highly engaged. Strike while interest is hot.`,
      ar: `${recent.length} إجراءات في آخر 48 ساعة — تفاعل عالٍ. تصرف بينما الاهتمام ساخن.` };
  }
  return null;
};

// ─── TRANSLATIONS ──────────────────────────────────────────────
registerTranslations("autoDashboard", {
  en: {
    headerTitle: "Prestige Motors", headerSub: "VIP Behavioral Intelligence",
    envBadge: "Prestige Motors Showroom", live: "Live",
    tabOverview: "Overview", tabVipIntel: "VIP Intelligence",
    tabModels: "Model Analytics", tabPriority: "Priority List",
    crossBack: "← Back to Automotive", crossKhalid: "VIP Performance", crossSultan: "VIP Family",
    crossShowroom: "Public Showroom", crossDash: "Dealer Dashboard", crossAI: "AI Pipeline",
    // KPIs
    mVipSessions: "VIP Sessions", mVipSub: "Person known via NFC",
    mWebVisitors: "Website Visitors", mWebSub: "Standard showroom traffic",
    mTestDrives: "Test Drives Booked", mTestSub: "This month",
    mConvLift: "VIP Conversion Lift", mConvSub: "VIP vs standard booking rate",
    mAvgTime: "Avg Session Time", mAvgTimeSub: "VIP portal engagement",
    mRoi: "NFC ROI", mRoiSub: "Return on NFC investment",
    // Actions
    actTestDrive: "Test Drives", actRequestQuote: "Quote Requests",
    actDownloadBrochure: "Brochure Downloads", actSaveConfig: "Configurations", actFinanceCalc: "Finance Calculator",
    vip: "VIP", std: "STD",
    // Feed
    feedTitle: "Live Activity Feed", noEvents: "No events recorded yet. Open the VIP Showroom Portal to generate data.",
    // Alerts
    alertSummary: "VIP Alert Summary", topAlerts: "Top Alerts",
    hotLeads: "Hot Leads", activeAlerts: "Active Alerts", avgScore: "Avg Lead Score",
    // Weekly
    weeklyTitle: "Weekly VIP vs Standard Traffic",
    wMon: "Mon", wTue: "Tue", wWed: "Wed", wThu: "Thu", wFri: "Fri", wSat: "Sat", wSun: "Sun",
    wVip: "VIP Sessions", wStd: "Standard",
    // VIP Intel
    vipIntelTitle: "VIP Client Intelligence",
    whyCallNow: "Why Call Now?",
    leadScore: "Lead Score", topModel: "Top Model", lastSeen: "Last Seen",
    salesRep: "Sales Rep", campaign: "Campaign",
    call: "Call", email: "Email", whatsapp: "WhatsApp", reissueLink: "Reissue Portal Link",
    timeline: "Behavioral Timeline",
    clickExpand: "Click to expand",
    // Model Analytics
    modelInterest: "Model Interest Heatmap", collectionDist: "Collection Distribution",
    topConfigs: "Top Configurations Saved",
    colModel: "Model", colVipViews: "VIP Views", colConfigs: "Configs",
    colFinance: "Finance", colTestDrives: "Test Drives", colScore: "Score",
    modelDetailTable: "Model Detail Table", saves: "saves",
    amgPer: "AMG Performance", luxSuv: "Luxury SUV", execSedan: "Executive Sedan",
    totalViews: "Total Views",
    // Priority
    priorityTitle: "Priority VIP List", nextBestActions: "Next Best Actions",
    quickActions: "Quick Actions",
    colVip: "VIP", colCode: "Code", colTopModel: "Top Model",
    colLeadScore: "Lead Score", colAlerts: "Alerts", colLastSeen: "Last Seen", colAction: "Action",
    emailAll: "Email All High Intent VIPs", exportList: "Export Priority List", genReport: "Generate Weekly Report",
    btnCall: "Call", btnEmail: "Email", btnReengage: "Re-engage",
    // NBAs
    nba1: "Call Khalid Al-Mansouri — configured AMG GT 63 S + opened finance calc. Offer Night Package + VIP test drive.",
    nba2: "Follow up with Sultan Al-Dhaheri — viewed Maybach GLS 600 three times, requested pricing. Send personalized quote.",
    nba3: "Email Noura Al-Maktoum — comparing S 580 vs EQS. Send comparison PDF with exclusive VIP pricing.",
    nba4: "Re-engage Ahmed Al-Falasi — no activity in 12 days. Send new AMG arrivals notification.",
    // Why Call
    whyKhalid: "Khalid configured an AMG GT 63 S in Obsidian Black and opened the finance calculator 2 hours ago. He's viewed this model 3 times. This is a high-intent signal — call with the Night Package offer.",
    whySultan: "Sultan has viewed the Maybach GLS 600 three times and requested VIP pricing yesterday. He compared it with the G63. Follow up with an exclusive quote and invite for a private test drive.",
    whyNoura: "Noura is comparing the S 580 and EQS 580 — she viewed interior galleries for both. Send a side-by-side comparison with exclusive VIP pricing to help her decide.",
    whyAhmed: "Ahmed has been inactive for 12 days since his initial portal entry. He browsed the AMG Collection but didn't engage further. Send a personalized notification about new AMG arrivals.",
    // Recommended actions
    recKhalid: "Call now — offer Night Package", recSultan: "Send VIP pricing quote",
    recNoura: "Email comparison PDF", recAhmed: "Re-engage with new arrivals",
    // Velocity KPIs
    velTTFA: "Time to First Action", velTTFASub: "Avg minutes from NFC tap to first vehicle view",
    velTestDrive: "Test Drive Velocity", velTestDriveSub: "Avg days from first visit to test drive booking",
    velConvLift: "VIP Conversion Lift", velConvLiftSub: "VIP vs standard test drive booking rate",
    velMinutes: "min", velDays: "days", velNA: "—",
    // Conversion Funnel
    funnelTitle: "VIP Conversion Funnel",
    funnelNfcTap: "NFC Tap", funnelVehicleView: "Vehicle View",
    funnelConfigSave: "Config Save", funnelPricing: "Pricing Request", funnelTestDrive: "Test Drive",
    funnelDropOff: "drop-off",
    // Score Distribution
    scoreDistTitle: "Lead Score Distribution",
    // Trigger labels
    triggerTitle: "Sales Trigger",
    // Outreach modal
    vipOutreach: "VIP Outreach", outreachDesc: "1-to-1 personal outreach. Consultative tone. Reference their interests, not surveillance.",
    callScript: "Call Script", emailSnippet: "Email Snippet",
    guardrailLabel: "Guardrail:", guardrailDesc: "Don't say you tracked them. Say you're following up on their VIP invitation and can help with pricing, test drives, and financing.",
    outreachScript: "Outreach Script",
    // Create VIP modal
    createVipTitle: "Create New VIP", createVipDesc: "Sales rep assigns a card and links it to a campaign. A VIP ID will be generated.",
    lblFullName: "Full Name", lblPhone: "Phone", lblEmail: "Email",
    lblPrefLang: "Preferred Language", lblCampaign: "Campaign", lblCardId: "Card ID",
    createVipNote: "By issuing a VIP card, the client receives a premium invitation box signaling exclusive access.",
    createVipSubmit: "Create VIP",
    // Actions chart
    actionsTitle: "Conversion Actions",
    // Tabs — new
    tabInventory: "Vehicle Inventory", tabCampaigns: "Campaigns", tabSettings: "Settings",
    // Inventory
    invTitle: "Vehicle Inventory", invSub: "Current showroom and incoming stock",
    invId: "Stock ID", invModel: "Model", invCollection: "Collection", invYear: "Year",
    invColor: "Exterior", invInterior: "Interior", invPrice: "Price (AED)",
    invStatus: "Status", invVipInterest: "VIP Interest",
    invAvailable: "Available", invReserved: "Reserved", invSold: "Sold",
    invFilterAll: "All", invFilterAvailable: "Available Only", invZeroEngagement: "ZERO ENGAGEMENT",
    // Campaigns
    campTitle: "Campaigns", campSub: "VIP invitation campaigns and performance",
    campSent: "Cards Sent", campOpened: "Portals Opened", campTestDrives: "Test Drives", campConversions: "Conversions",
    campActive: "Active", campPaused: "Paused", campDraft: "Draft",
    // Settings
    setTitle: "Settings & Data Boundaries", setSub: "Keep it simple, secure, and compliant",
    setScope: "In Scope (MVP)", setOutScope: "Out of Scope (MVP Guardrail)",
    setS1: "NFC-to-portal identity linking for VIP clients",
    setS2: "Behavioral event tracking on portal pages (views, configs, test drives)",
    setS3: "Lead scoring with 7-day time-decay half-life",
    setS4: "Sales triggers based on 48h activity window",
    setS5: "Live Dashboard is read-only — no writes to external CRM",
    setS6: "No automated outreach — all actions require human confirmation",
    setS7: "Out: Dynamic pricing, inventory management, DMS integration",
    setS8: "Out: WhatsApp automation, chatbot, push notifications",
    setS9: "Out: Multi-dealership rollup, cross-location analytics",
    setS10: "Out: Customer self-service portal, online purchasing flow",
    setResetDemo: "Reset Demo Data", setResetDesc: "Clears all tracked events and re-seeds demo data.",
    setPrivacy: "Privacy & Consent",
    setP1: "VIP card tap is explicit consent — physical action = opt-in",
    setP2: "Data retained for campaign duration only — auto-purge after 90 days",
    setP3: "No third-party data sharing — all data stays within Prestige Motors",
  },
  ar: {
    headerTitle: "بريستيج موتورز", headerSub: "ذكاء سلوك VIP",
    envBadge: "صالة عرض بريستيج موتورز", live: "مباشر",
    tabOverview: "نظرة عامة", tabVipIntel: "ذكاء VIP",
    tabModels: "تحليلات الموديلات", tabPriority: "قائمة الأولويات",
    crossBack: "← العودة إلى السيارات", crossKhalid: "VIP أداء", crossSultan: "VIP عائلي",
    crossShowroom: "صالة العرض العامة", crossDash: "لوحة تحكم التاجر", crossAI: "خط أنابيب الذكاء",
    mVipSessions: "جلسات VIP", mVipSub: "شخص معروف عبر NFC",
    mWebVisitors: "زوار الموقع", mWebSub: "حركة مرور صالة العرض القياسية",
    mTestDrives: "تجارب القيادة المحجوزة", mTestSub: "هذا الشهر",
    mConvLift: "زيادة تحويل VIP", mConvSub: "VIP مقابل معدل الحجز القياسي",
    mAvgTime: "متوسط مدة الجلسة", mAvgTimeSub: "تفاعل بوابة VIP",
    mRoi: "عائد NFC", mRoiSub: "العائد على استثمار NFC",
    actTestDrive: "تجارب القيادة", actRequestQuote: "طلبات العروض",
    actDownloadBrochure: "تحميل الكتيبات", actSaveConfig: "التكوينات", actFinanceCalc: "حاسبة التمويل",
    vip: "VIP", std: "عادي",
    feedTitle: "نشاط مباشر", noEvents: "لم يتم تسجيل أي أحداث بعد. افتح بوابة صالة العرض VIP لتوليد البيانات.",
    alertSummary: "ملخص تنبيهات VIP", topAlerts: "أعلى التنبيهات",
    hotLeads: "عملاء ساخنون", activeAlerts: "تنبيهات نشطة", avgScore: "متوسط درجة العميل",
    weeklyTitle: "حركة VIP مقابل العادية الأسبوعية",
    wMon: "إثن", wTue: "ثلا", wWed: "أرب", wThu: "خمي", wFri: "جمع", wSat: "سبت", wSun: "أحد",
    wVip: "جلسات VIP", wStd: "عادية",
    vipIntelTitle: "ذكاء عملاء VIP",
    whyCallNow: "لماذا الاتصال الآن؟",
    leadScore: "درجة العميل", topModel: "الموديل الأعلى", lastSeen: "آخر ظهور",
    salesRep: "مندوب المبيعات", campaign: "الحملة",
    call: "اتصال", email: "بريد", whatsapp: "واتساب", reissueLink: "إعادة إصدار رابط البوابة",
    timeline: "الجدول الزمني السلوكي",
    clickExpand: "انقر للتوسيع",
    modelInterest: "خريطة حرارة اهتمام الموديلات", collectionDist: "توزيع المجموعات",
    topConfigs: "أعلى التكوينات المحفوظة",
    colModel: "الموديل", colVipViews: "مشاهدات VIP", colConfigs: "التكوينات",
    colFinance: "التمويل", colTestDrives: "تجارب القيادة", colScore: "الدرجة",
    modelDetailTable: "تفاصيل الموديلات", saves: "حفظ",
    amgPer: "AMG الأداء", luxSuv: "SUV الفاخرة", execSedan: "سيدان التنفيذية",
    totalViews: "إجمالي المشاهدات",
    priorityTitle: "قائمة VIP ذات الأولوية", nextBestActions: "أفضل الإجراءات التالية",
    quickActions: "إجراءات سريعة",
    colVip: "VIP", colCode: "الرمز", colTopModel: "الموديل الأعلى",
    colLeadScore: "درجة العميل", colAlerts: "التنبيهات", colLastSeen: "آخر ظهور", colAction: "إجراء",
    emailAll: "إرسال بريد لجميع عملاء النية العالية", exportList: "تصدير قائمة الأولويات", genReport: "إنشاء تقرير أسبوعي",
    btnCall: "اتصال", btnEmail: "بريد", btnReengage: "إعادة تفاعل",
    nba1: "اتصل بخالد المنصوري — قام بتكوين AMG GT 63 S + فتح حاسبة التمويل. اعرض حزمة Night + تجربة قيادة VIP.",
    nba2: "تابع مع سلطان الظاهري — شاهد مايباخ GLS 600 ثلاث مرات، طلب الأسعار. أرسل عرض سعر شخصي.",
    nba3: "أرسل بريد لنورة المكتوم — تقارن S 580 مع EQS. أرسل مقارنة PDF مع أسعار VIP الحصرية.",
    nba4: "أعد تفاعل أحمد الفلاسي — لا نشاط منذ 12 يومًا. أرسل إشعار وصول AMG الجديدة.",
    whyKhalid: "قام خالد بتكوين AMG GT 63 S بلون أسود أوبسيديان وفتح حاسبة التمويل منذ ساعتين. شاهد هذا الموديل 3 مرات. هذه إشارة نية عالية — اتصل مع عرض حزمة Night.",
    whySultan: "شاهد سلطان مايباخ GLS 600 ثلاث مرات وطلب أسعار VIP بالأمس. قارنها مع G63. تابع مع عرض حصري ودعوة لتجربة قيادة خاصة.",
    whyNoura: "نورة تقارن بين S 580 و EQS 580 — شاهدت معارض الداخلية لكليهما. أرسل مقارنة جنبًا إلى جنب مع أسعار VIP حصرية لمساعدتها في القرار.",
    whyAhmed: "أحمد غير نشط منذ 12 يومًا بعد دخوله الأولي للبوابة. تصفح مجموعة AMG لكنه لم يتفاعل أكثر. أرسل إشعارًا شخصيًا حول وصول AMG الجديدة.",
    recKhalid: "اتصل الآن — اعرض حزمة Night", recSultan: "أرسل عرض أسعار VIP",
    recNoura: "أرسل بريد مقارنة PDF", recAhmed: "أعد التفاعل مع الوصول الجديد",
    // Velocity KPIs
    velTTFA: "وقت أول إجراء", velTTFASub: "متوسط الدقائق من NFC إلى أول مشاهدة سيارة",
    velTestDrive: "سرعة تجربة القيادة", velTestDriveSub: "متوسط الأيام من أول زيارة إلى حجز تجربة",
    velConvLift: "زيادة تحويل VIP", velConvLiftSub: "VIP مقابل معدل حجز تجارب القيادة القياسي",
    velMinutes: "دقيقة", velDays: "أيام", velNA: "—",
    // Conversion Funnel
    funnelTitle: "قمع تحويل VIP",
    funnelNfcTap: "نقر NFC", funnelVehicleView: "مشاهدة السيارة",
    funnelConfigSave: "حفظ التكوين", funnelPricing: "طلب الأسعار", funnelTestDrive: "تجربة القيادة",
    funnelDropOff: "فقدان",
    // Score Distribution
    scoreDistTitle: "توزيع درجات العملاء",
    // Trigger labels
    triggerTitle: "محفز المبيعات",
    // Outreach modal
    vipOutreach: "تواصل VIP", outreachDesc: "تواصل شخصي 1-إلى-1. نبرة استشارية. أشر إلى اهتماماتهم، ليس المراقبة.",
    callScript: "نص المكالمة", emailSnippet: "مقتطف البريد الإلكتروني",
    guardrailLabel: "حاجز أمان:", guardrailDesc: "لا تقل أنك تابعتهم. قل إنك تتابع دعوتهم VIP ويمكنك المساعدة في الأسعار، تجارب القيادة، والتمويل.",
    outreachScript: "نص التواصل",
    // Create VIP modal
    createVipTitle: "إنشاء VIP جديد", createVipDesc: "يقوم مندوب المبيعات بتعيين بطاقة وربطها بحملة. سيتم إنشاء معرف VIP.",
    lblFullName: "الاسم الكامل", lblPhone: "الهاتف", lblEmail: "البريد الإلكتروني",
    lblPrefLang: "اللغة المفضلة", lblCampaign: "الحملة", lblCardId: "معرف البطاقة",
    createVipNote: "عن طريق إصدار بطاقة VIP، يتلقى العميل صندوق دعوة مميز.",
    createVipSubmit: "إنشاء VIP",
    // Actions chart
    actionsTitle: "إجراءات التحويل",
    // Tabs — new
    tabInventory: "مخزون السيارات", tabCampaigns: "الحملات", tabSettings: "الإعدادات",
    // Inventory
    invTitle: "مخزون السيارات", invSub: "المخزون الحالي في صالة العرض والقادم",
    invId: "رقم المخزون", invModel: "الموديل", invCollection: "المجموعة", invYear: "السنة",
    invColor: "اللون الخارجي", invInterior: "الداخلية", invPrice: "السعر (درهم)",
    invStatus: "الحالة", invVipInterest: "اهتمام VIP",
    invAvailable: "متاح", invReserved: "محجوز", invSold: "مباع",
    invFilterAll: "الكل", invFilterAvailable: "المتاح فقط", invZeroEngagement: "بدون تفاعل",
    // Campaigns
    campTitle: "الحملات", campSub: "حملات دعوة VIP والأداء",
    campSent: "البطاقات المرسلة", campOpened: "البوابات المفتوحة", campTestDrives: "تجارب القيادة", campConversions: "التحويلات",
    campActive: "نشطة", campPaused: "متوقفة", campDraft: "مسودة",
    // Settings
    setTitle: "الإعدادات وحدود البيانات", setSub: "اجعلها بسيطة، آمنة، ومتوافقة",
    setScope: "ضمن النطاق (الحد الأدنى)", setOutScope: "خارج النطاق (حاجز أمان)",
    setS1: "ربط هوية NFC بالبوابة لعملاء VIP",
    setS2: "تتبع الأحداث السلوكية على صفحات البوابة (المشاهدات، التكوينات، تجارب القيادة)",
    setS3: "تسجيل العملاء مع اضمحلال زمني 7 أيام",
    setS4: "محفزات مبيعات بناءً على نافذة نشاط 48 ساعة",
    setS5: "لوحة التحكم للقراءة فقط — لا كتابة إلى CRM خارجي",
    setS6: "لا تواصل آلي — جميع الإجراءات تتطلب تأكيد بشري",
    setS7: "خارج النطاق: التسعير الديناميكي، إدارة المخزون، تكامل DMS",
    setS8: "خارج النطاق: أتمتة واتساب، روبوت المحادثة، إشعارات الدفع",
    setS9: "خارج النطاق: تجميع متعدد الوكالات، تحليلات متقاطعة",
    setS10: "خارج النطاق: بوابة الخدمة الذاتية، تدفق الشراء عبر الإنترنت",
    setResetDemo: "إعادة تعيين البيانات التجريبية", setResetDesc: "يمسح جميع الأحداث المتتبعة ويعيد تحميل البيانات التجريبية.",
    setPrivacy: "الخصوصية والموافقة",
    setP1: "النقر على بطاقة VIP هو موافقة صريحة — إجراء مادي = قبول",
    setP2: "البيانات محفوظة لمدة الحملة فقط — حذف تلقائي بعد 90 يومًا",
    setP3: "لا مشاركة بيانات مع أطراف ثالثة — جميع البيانات تبقى داخل بريستيج موتورز",
  },
});

// ─── DEMO DATA ─────────────────────────────────────────────────
const DEMO_DATA = {
  kpis: [
    { key: "mVipSessions", val: "12", change: "+4", up: true, subKey: "mVipSub" },
    { key: "mWebVisitors", val: "847", change: "+12%", up: true, subKey: "mWebSub" },
    { key: "mTestDrives", val: "8", change: "+3", up: true, subKey: "mTestSub" },
    { key: "mConvLift", val: "3.2×", change: "+0.4", up: true, subKey: "mConvSub" },
    { key: "mAvgTime", val: "4:32", change: "+0:48", up: true, subKey: "mAvgTimeSub" },
    { key: "mRoi", val: "12.4×", change: "+2.1", up: true, subKey: "mRoiSub" },
  ],
  vips: [
    {
      id: "khalid", name: "Khalid Al-Mansouri", nameAr: "خالد المنصوري",
      code: "VIP-AMG-001", leadScore: 87, status: "hot",
      lastSeen: "2 hours ago", lastSeenAr: "منذ ساعتين",
      topModel: "AMG GT 63 S", models: ["AMG GT 63 S", "G 63 AMG"],
      alerts: ["High Intent", "Configured Vehicle", "Finance Interest"],
      alertsAr: ["نية عالية", "تكوين السيارة", "اهتمام بالتمويل"],
      timeline: [
        { event: "Configured AMG GT 63 S — Obsidian Black / Red Interior", eventAr: "تكوين AMG GT 63 S — أسود أوبسيديان / داخلية حمراء", time: "2h ago", timeAr: "منذ ساعتين", icon: "🎨" },
        { event: "Opened Finance Calculator", eventAr: "فتح حاسبة التمويل", time: "2h ago", timeAr: "منذ ساعتين", icon: "💰" },
        { event: "Viewed AMG GT 63 S (3rd time)", eventAr: "شاهد AMG GT 63 S (المرة الثالثة)", time: "2h ago", timeAr: "منذ ساعتين", icon: "👁" },
        { event: "Viewed G63 AMG", eventAr: "شاهد G63 AMG", time: "3h ago", timeAr: "منذ 3 ساعات", icon: "👁" },
        { event: "Downloaded G63 Brochure", eventAr: "حمّل كتيب G63", time: "3h ago", timeAr: "منذ 3 ساعات", icon: "📥" },
        { event: "Portal Entry via NFC", eventAr: "دخول البوابة عبر NFC", time: "4h ago", timeAr: "منذ 4 ساعات", icon: "📱" },
      ],
      salesRep: "Omar Hassan", campaign: "Q1 VIP Launch",
      whyKey: "whyKhalid", recKey: "recKhalid",
    },
    {
      id: "sultan", name: "Sultan Al-Dhaheri", nameAr: "سلطان الظاهري",
      code: "VIP-SUV-002", leadScore: 72, status: "warm",
      lastSeen: "1 day ago", lastSeenAr: "منذ يوم",
      topModel: "Maybach GLS 600", models: ["Maybach GLS 600", "G 63 AMG"],
      alerts: ["Repeat Views", "Pricing Interest"],
      alertsAr: ["مشاهدات متكررة", "اهتمام بالسعر"],
      timeline: [
        { event: "Viewed Maybach GLS 600 (3rd time)", eventAr: "شاهد مايباخ GLS 600 (المرة الثالثة)", time: "1d ago", timeAr: "منذ يوم", icon: "👁" },
        { event: "Requested VIP Pricing", eventAr: "طلب أسعار VIP", time: "1d ago", timeAr: "منذ يوم", icon: "💎" },
        { event: "Compared GLS 600 vs G63", eventAr: "قارن GLS 600 مع G63", time: "2d ago", timeAr: "منذ يومين", icon: "⚖️" },
        { event: "Portal Entry via NFC", eventAr: "دخول البوابة عبر NFC", time: "3d ago", timeAr: "منذ 3 أيام", icon: "📱" },
      ],
      salesRep: "Fatima Al-Ketbi", campaign: "SUV Experience",
      whyKey: "whySultan", recKey: "recSultan",
    },
    {
      id: "noura", name: "Noura Al-Maktoum", nameAr: "نورة المكتوم",
      code: "VIP-EXC-003", leadScore: 58, status: "warm",
      lastSeen: "3 days ago", lastSeenAr: "منذ 3 أيام",
      topModel: "S 580 4MATIC", models: ["S 580 4MATIC", "EQS 580"],
      alerts: ["Comparing Models"],
      alertsAr: ["مقارنة الموديلات"],
      timeline: [
        { event: "Compared S 580 vs EQS 580", eventAr: "قارنت S 580 مع EQS 580", time: "3d ago", timeAr: "منذ 3 أيام", icon: "⚖️" },
        { event: "Viewed S 580 Interior Gallery", eventAr: "شاهدت معرض داخلية S 580", time: "3d ago", timeAr: "منذ 3 أيام", icon: "👁" },
        { event: "Portal Entry via NFC", eventAr: "دخول البوابة عبر NFC", time: "5d ago", timeAr: "منذ 5 أيام", icon: "📱" },
      ],
      salesRep: "Omar Hassan", campaign: "Executive Collection",
      whyKey: "whyNoura", recKey: "recNoura",
    },
    {
      id: "ahmed", name: "Ahmed Al-Falasi", nameAr: "أحمد الفلاسي",
      code: "VIP-PER-004", leadScore: 34, status: "cold",
      lastSeen: "12 days ago", lastSeenAr: "منذ 12 يومًا",
      topModel: "AMG C 63 S", models: ["AMG C 63 S"],
      alerts: ["Zero Engagement"],
      alertsAr: ["عدم وجود تفاعل"],
      timeline: [
        { event: "Portal Entry via NFC", eventAr: "دخول البوابة عبر NFC", time: "12d ago", timeAr: "منذ 12 يومًا", icon: "📱" },
        { event: "Viewed AMG Collection", eventAr: "شاهد مجموعة AMG", time: "12d ago", timeAr: "منذ 12 يومًا", icon: "👁" },
      ],
      salesRep: "Fatima Al-Ketbi", campaign: "Q1 VIP Launch",
      whyKey: "whyAhmed", recKey: "recAhmed",
    },
  ],
  models: [
    { model: "AMG GT 63 S", views: 12, configs: 4, finance: 3, testDrives: 2, score: 95, collection: "performance" },
    { model: "G 63 AMG", views: 18, configs: 2, finance: 1, testDrives: 3, score: 88, collection: "suv" },
    { model: "Maybach GLS 600", views: 8, configs: 1, finance: 2, testDrives: 1, score: 72, collection: "suv" },
    { model: "S 580 4MATIC", views: 6, configs: 3, finance: 1, testDrives: 0, score: 58, collection: "sedan" },
    { model: "EQS 580", views: 5, configs: 2, finance: 1, testDrives: 0, score: 45, collection: "sedan" },
    { model: "AMG C 63 S", views: 4, configs: 0, finance: 0, testDrives: 1, score: 32, collection: "performance" },
    { model: "Maybach S 680", views: 3, configs: 1, finance: 0, testDrives: 0, score: 28, collection: "sedan" },
    { model: "GLE 53 Coupé", views: 3, configs: 1, finance: 0, testDrives: 0, score: 22, collection: "suv" },
    { model: "AMG SL 63", views: 2, configs: 0, finance: 0, testDrives: 0, score: 15, collection: "performance" },
  ],
  topConfigs: [
    { model: "AMG GT 63 S", config: "Obsidian Black / Red Pepper Interior", configAr: "أسود أوبسيديان / داخلية فلفل أحمر", by: "Khalid Al-Mansouri", byAr: "خالد المنصوري", saves: 3 },
    { model: "G 63 AMG", config: "MANUFAKTUR Olive / Macchiato Beige", configAr: "أخضر زيتوني MANUFAKTUR / بيج ماكياتو", by: "Sultan Al-Dhaheri", byAr: "سلطان الظاهري", saves: 2 },
    { model: "S 580", config: "Onyx Black / Macchiato Beige", configAr: "أسود أونيكس / بيج ماكياتو", by: "Noura Al-Maktoum", byAr: "نورة المكتوم", saves: 1 },
  ],
  actions: [
    { key: "actTestDrive", vip: 5, std: 3, total: 8 },
    { key: "actRequestQuote", vip: 4, std: 11, total: 15 },
    { key: "actDownloadBrochure", vip: 8, std: 34, total: 42 },
    { key: "actSaveConfig", vip: 6, std: 13, total: 19 },
    { key: "actFinanceCalc", vip: 3, std: 7, total: 10 },
  ],
  weekly: [
    { dayKey: "wMon", vip: 3, std: 120 },
    { dayKey: "wTue", vip: 5, std: 145 },
    { dayKey: "wWed", vip: 2, std: 98 },
    { dayKey: "wThu", vip: 7, std: 165 },
    { dayKey: "wFri", vip: 4, std: 180 },
    { dayKey: "wSat", vip: 8, std: 210 },
    { dayKey: "wSun", vip: 6, std: 190 },
  ],
};

// ─── HELPERS ───────────────────────────────────────────────────
const scoreStatus = (s) => s >= 80 ? "hot" : s >= 50 ? "warm" : "cold";

function getAutoEvents() {
  try {
    return JSON.parse(localStorage.getItem("dnfc_events") || "[]").filter((e) => e.portal === "automotive");
  } catch { return []; }
}

function formatEventTime(ts) {
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const EVENT_LABELS = {
  auto_portal_entry: "Portal Entry via NFC", collection_view: "Viewed collection",
  vehicle_view: "Viewed vehicle", color_select: "Selected color",
  interior_select: "Selected interior", config_save: "Saved configuration",
  finance_calc: "Opened finance calculator", test_drive_request: "Booked test drive",
  brochure_download: "Downloaded brochure", pricing_request: "Requested VIP pricing",
  compare_add: "Added to comparison", favorite_toggle: "Toggled favorite",
};

const daysAgoNum = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

// ─── SEED AUTOMOTIVE DEMO EVENTS ────────────────────────────
const seedAutoEvents = () => {
  const existing = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
  if (existing.some(e => e.id === "auto_d1")) return;
  const now = Date.now(), h = 3600000, d = 86400000;
  const demo = [
    // VIP: Khalid Al-Mansouri (hot — configured + finance)
    { id:"auto_d1", timestamp:new Date(now-6*d).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d2", timestamp:new Date(now-6*d+h).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"collection_view", vehicleModel:null },
    { id:"auto_d3", timestamp:new Date(now-5*d).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"vehicle_view", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d4", timestamp:new Date(now-4*d).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"vehicle_view", vehicleModel:"G 63 AMG" },
    { id:"auto_d5", timestamp:new Date(now-4*d+h).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"brochure_download", vehicleModel:"G 63 AMG" },
    { id:"auto_d6", timestamp:new Date(now-3*d).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"vehicle_view", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d7", timestamp:new Date(now-2*d).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"color_select", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d8", timestamp:new Date(now-2*d+h).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"interior_select", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d9", timestamp:new Date(now-2*d+2*h).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"config_save", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d10", timestamp:new Date(now-2*h).toISOString(), vipName:"Khalid Al-Mansouri", portal:"automotive", event:"finance_calc", vehicleModel:"AMG GT 63 S" },
    // VIP: Sultan Al-Dhaheri (warm — repeat views + pricing)
    { id:"auto_d11", timestamp:new Date(now-5*d).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d12", timestamp:new Date(now-4*d).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"vehicle_view", vehicleModel:"Maybach GLS 600" },
    { id:"auto_d13", timestamp:new Date(now-3*d).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"vehicle_view", vehicleModel:"Maybach GLS 600" },
    { id:"auto_d14", timestamp:new Date(now-2*d).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"vehicle_view", vehicleModel:"G 63 AMG" },
    { id:"auto_d15", timestamp:new Date(now-2*d+h).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"compare_add", vehicleModel:"Maybach GLS 600" },
    { id:"auto_d16", timestamp:new Date(now-d).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"vehicle_view", vehicleModel:"Maybach GLS 600" },
    { id:"auto_d17", timestamp:new Date(now-d+h).toISOString(), vipName:"Sultan Al-Dhaheri", portal:"automotive", event:"pricing_request", vehicleModel:"Maybach GLS 600" },
    // VIP: Noura Al-Maktoum (warm — comparing)
    { id:"auto_d18", timestamp:new Date(now-5*d).toISOString(), vipName:"Noura Al-Maktoum", portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d19", timestamp:new Date(now-4*d).toISOString(), vipName:"Noura Al-Maktoum", portal:"automotive", event:"vehicle_view", vehicleModel:"S 580 4MATIC" },
    { id:"auto_d20", timestamp:new Date(now-3*d).toISOString(), vipName:"Noura Al-Maktoum", portal:"automotive", event:"vehicle_view", vehicleModel:"EQS 580" },
    { id:"auto_d21", timestamp:new Date(now-3*d+h).toISOString(), vipName:"Noura Al-Maktoum", portal:"automotive", event:"compare_add", vehicleModel:"S 580 4MATIC" },
    { id:"auto_d22", timestamp:new Date(now-3*d+2*h).toISOString(), vipName:"Noura Al-Maktoum", portal:"automotive", event:"brochure_download", vehicleModel:"S 580 4MATIC" },
    // VIP: Ahmed Al-Falasi (cold — one entry then silent)
    { id:"auto_d23", timestamp:new Date(now-12*d).toISOString(), vipName:"Ahmed Al-Falasi", portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d24", timestamp:new Date(now-12*d+h).toISOString(), vipName:"Ahmed Al-Falasi", portal:"automotive", event:"collection_view", vehicleModel:null },
    { id:"auto_d25", timestamp:new Date(now-12*d+2*h).toISOString(), vipName:"Ahmed Al-Falasi", portal:"automotive", event:"vehicle_view", vehicleModel:"AMG C 63 S" },
    // Anonymous / Standard visitors
    { id:"auto_d26", timestamp:new Date(now-6*d).toISOString(), portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d27", timestamp:new Date(now-4*d).toISOString(), portal:"automotive", event:"vehicle_view", vehicleModel:"G 63 AMG" },
    { id:"auto_d28", timestamp:new Date(now-3*d).toISOString(), portal:"automotive", event:"vehicle_view", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d29", timestamp:new Date(now-2*d).toISOString(), portal:"automotive", event:"brochure_download", vehicleModel:"AMG GT 63 S" },
    { id:"auto_d30", timestamp:new Date(now-d).toISOString(), portal:"automotive", event:"auto_portal_entry", vehicleModel:null },
    { id:"auto_d31", timestamp:new Date(now-d+h).toISOString(), portal:"automotive", event:"vehicle_view", vehicleModel:"EQS 580" },
    { id:"auto_d32", timestamp:new Date(now-12*h).toISOString(), portal:"automotive", event:"test_drive_request", vehicleModel:"G 63 AMG" },
  ];
  localStorage.setItem("dnfc_events", JSON.stringify([...existing, ...demo]));
};

// ─── VEHICLE INVENTORY ──────────────────────────────────────
const VEHICLE_INVENTORY = [
  { id: "AMG-GT-001", model: "AMG GT 63 S", collection: "AMG Performance", year: 2025, color: "Obsidian Black", interior: "Red Pepper", price: 485000, status: "available", vipInterest: 3 },
  { id: "AMG-GT-002", model: "AMG GT 63 S", collection: "AMG Performance", year: 2025, color: "Selenite Grey", interior: "Neva Grey", price: 475000, status: "reserved", vipInterest: 1 },
  { id: "G63-001", model: "G 63 AMG", collection: "Luxury SUV", year: 2025, color: "MANUFAKTUR Olive", interior: "Macchiato Beige", price: 380000, status: "available", vipInterest: 2 },
  { id: "G63-002", model: "G 63 AMG", collection: "Luxury SUV", year: 2024, color: "Obsidian Black", interior: "Black", price: 365000, status: "available", vipInterest: 0 },
  { id: "GLS600-001", model: "Maybach GLS 600", collection: "Luxury SUV", year: 2025, color: "Nautical Blue", interior: "Crystal White", price: 425000, status: "available", vipInterest: 2 },
  { id: "S580-001", model: "S 580 4MATIC", collection: "Executive Sedan", year: 2025, color: "Onyx Black", interior: "Macchiato Beige", price: 195000, status: "available", vipInterest: 1 },
  { id: "S580-002", model: "S 580 4MATIC", collection: "Executive Sedan", year: 2024, color: "Cirrus Silver", interior: "Black", price: 178000, status: "sold", vipInterest: 0 },
  { id: "EQS-001", model: "EQS 450+", collection: "Electric", year: 2025, color: "High-Tech Silver", interior: "Biscay Blue", price: 165000, status: "available", vipInterest: 1 },
  { id: "EQS-002", model: "EQS 580", collection: "Electric", year: 2025, color: "Obsidian Black", interior: "Neva Grey", price: 210000, status: "available", vipInterest: 0 },
  { id: "GLE-001", model: "GLE 450", collection: "Family SUV", year: 2025, color: "Polar White", interior: "Black", price: 142000, status: "available", vipInterest: 1 },
  { id: "C63-001", model: "AMG C 63 S", collection: "AMG Performance", year: 2025, color: "Spectral Blue", interior: "Black/Red", price: 165000, status: "available", vipInterest: 0 },
  { id: "SL63-001", model: "AMG SL 63", collection: "AMG Performance", year: 2025, color: "Patagonia Red", interior: "Titanium Grey", price: 295000, status: "reserved", vipInterest: 1 },
];

// ─── CAMPAIGNS ──────────────────────────────────────────────
const AUTO_CAMPAIGNS = [
  { id: "c1", name: "Q1 VIP Launch", nameAr: "إطلاق VIP الربع الأول", status: "active", desc: "Premium NFC cards to high-net-worth clients. Private showroom access.", descAr: "بطاقات NFC مميزة لعملاء القيمة العالية. وصول خاص لصالة العرض.", sent: 50, opened: 38, testDrives: 12, conversions: 3 },
  { id: "c2", name: "SUV Experience", nameAr: "تجربة SUV", status: "active", desc: "Luxury SUV comparison events. G63 vs GLS 600 vs GLE.", descAr: "فعاليات مقارنة SUV الفاخرة. G63 مقابل GLS 600 مقابل GLE.", sent: 30, opened: 22, testDrives: 8, conversions: 2 },
  { id: "c3", name: "Executive Collection", nameAr: "المجموعة التنفيذية", status: "paused", desc: "S-Class and EQS launch for corporate executives.", descAr: "إطلاق S-Class و EQS للمديرين التنفيذيين.", sent: 25, opened: 15, testDrives: 4, conversions: 1 },
  { id: "c4", name: "Electric Future", nameAr: "المستقبل الكهربائي", status: "draft", desc: "EV awareness campaign — EQE, EQS, EQB test drive week.", descAr: "حملة توعية بالسيارات الكهربائية — أسبوع تجربة قيادة EQE، EQS، EQB.", sent: 0, opened: 0, testDrives: 0, conversions: 0 },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AutoDashboard() {
  const { lang, isAr } = useLanguage();
  const t = useTranslation("autoDashboard");

  const [tab, setTab] = useState("overview");
  const [expandedVip, setExpandedVip] = useState(null);
  const [events, setEvents] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [modal, setModal] = useState(null);
  const [outreachVip, setOutreachVip] = useState(null);
  const [invFilter, setInvFilter] = useState("all");

  // Seed demo events on first load
  useEffect(() => { seedAutoEvents(); }, []);

  // Body background sync
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = theme === "dark" ? "#0f0f14" : "#f7f6f3";
    return () => { document.body.style.backgroundColor = prev; };
  }, [theme]);

  // Poll localStorage events
  useEffect(() => {
    const load = () => setEvents(getAutoEvents());
    load();
    const iv = setInterval(load, 3000);
    let bc;
    try { bc = new BroadcastChannel("dnfc_tracking"); bc.onmessage = () => load(); } catch {}
    return () => { clearInterval(iv); try { bc?.close(); } catch {} };
  }, []);

  const handleTab = useCallback((t) => {
    setTab(t);
    setExpandedVip(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Feed items
  const feedItems = useMemo(() => {
    const real = events.slice(-20).reverse().map((e) => ({
      text: `${e.vipName || "Anonymous visitor"} — ${EVENT_LABELS[e.event] || e.event}`,
      time: formatEventTime(e.timestamp),
      isVip: !!e.vipName,
    }));
    if (real.length >= 4) return real;
    const demo = [
      { text: "Khalid Al-Mansouri viewed AMG GT 63 S", time: "2m ago", isVip: true },
      { text: "Khalid Al-Mansouri configured G63 — Obsidian Black", time: "15m ago", isVip: true },
      { text: "Khalid Al-Mansouri opened finance calculator", time: "18m ago", isVip: true },
      { text: "Anonymous visitor browsed Luxury SUV collection", time: "25m ago", isVip: false },
      { text: "Sultan Al-Dhaheri viewed Maybach GLS 600", time: "1d ago", isVip: true },
      { text: "Noura Al-Maktoum compared S 580 vs EQS 580", time: "3d ago", isVip: true },
      { text: "Anonymous visitor downloaded AMG brochure", time: "3d ago", isVip: false },
      { text: "Ahmed Al-Falasi entered portal via NFC", time: "12d ago", isVip: true },
    ];
    return [...real, ...demo].slice(0, 10);
  }, [events]);

  // ─── METRICS ENGINE v2.0: Time-Decay + Velocity + Funnel ────
  const metrics = useMemo(() => {
    const ev = events;
    const hasReal = ev.length > 0;

    // ── TIME-DECAY SCORING per person ──
    const sm = {};
    ev.forEach(e => {
      const n = e.vipName || (e.sessionId ? `Anon-${e.sessionId.slice(-3)}` : null);
      if (!n) return;
      if (!sm[n]) sm[n] = { name: n, rawScore: 0, decayedScore: 0, isVip: !!e.vipName, events: [], lastSeen: e.timestamp, firstSeen: e.timestamp, topModel: null, actions: {} };
      const w = INTENT_WEIGHTS[e.event] || 2;
      const df = decayFactor(e.timestamp);
      sm[n].rawScore += w;
      sm[n].decayedScore += Math.round(w * df * 10) / 10;
      sm[n].events.push(e);
      if (new Date(e.timestamp) > new Date(sm[n].lastSeen)) sm[n].lastSeen = e.timestamp;
      if (new Date(e.timestamp) < new Date(sm[n].firstSeen)) sm[n].firstSeen = e.timestamp;
      if (e.vehicleModel) sm[n].topModel = e.vehicleModel;
      if (e.event) sm[n].actions[e.event] = (sm[n].actions[e.event] || 0) + 1;
      if (e.vipName) sm[n].isVip = true;
    });
    const people = Object.values(sm).sort((a, b) => b.decayedScore - a.decayedScore);

    // ── SCORE DISTRIBUTION ──
    const scoreDist = [
      { band: "0-20", count: 0, color: "#6B7280" }, { band: "20-40", count: 0, color: "#457B9D" },
      { band: "40-60", count: 0, color: "#f4a261" }, { band: "60-80", count: 0, color: "#C5A467" },
      { band: "80+", count: 0, color: "#e63946" },
    ];
    people.forEach(p => {
      const s = Math.round(p.decayedScore);
      if (s < 20) scoreDist[0].count++; else if (s < 40) scoreDist[1].count++;
      else if (s < 60) scoreDist[2].count++; else if (s < 80) scoreDist[3].count++;
      else scoreDist[4].count++;
    });

    // ── VIP METRICS with triggers ──
    const vipNames = [...new Set(ev.filter(e => e.vipName).map(e => e.vipName))];
    const stdEntries = ev.filter(e => !e.vipName && e.event === "auto_portal_entry").length;
    const vipM = DEMO_DATA.vips.map(vp => {
      const p = sm[vp.name];
      const rawScore = p ? p.rawScore : 0;
      const score = p ? Math.round(p.decayedScore) : 0;
      const vEv = ev.filter(e => e.vipName === vp.name);
      const ls = vEv.length > 0 ? vEv[vEv.length - 1].timestamp : null;
      const fs = vEv.length > 0 ? vEv[0].timestamp : null;
      const idle = ls ? daysAgoNum(ls) : 999;
      const portalOpen = vEv.find(e => e.event === "auto_portal_entry");
      const firstView = vEv.find(e => e.event === "vehicle_view");
      const ttfa = (portalOpen && firstView) ? Math.round((new Date(firstView.timestamp) - new Date(portalOpen.timestamp)) / 60000) : null;
      const testDriveEv = vEv.find(e => e.event === "test_drive_request");
      const tdVel = (testDriveEv && fs) ? Math.round((new Date(testDriveEv.timestamp) - new Date(fs).getTime()) / 86400000) : null;
      const trigger = getAutoSalesTrigger(vEv, lang);
      const computedStatus = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";
      return {
        ...vp, rawScore, score, computedStatus,
        lastSeen: ls, firstSeen: fs, idle, ttfa, tdVel, trigger,
        vehicleViews: vEv.filter(e => e.event === "vehicle_view").length,
        configs: vEv.filter(e => e.event === "config_save").length,
        comparisons: vEv.filter(e => e.event === "compare_add").length,
        liveEvents: vEv,
      };
    }).sort((a, b) => b.score - a.score);

    // ── VELOCITY KPIs (must be computed before kpis map) ──
    const ttfaVals = vipM.filter(v => v.ttfa !== null).map(v => v.ttfa);
    const avgTTFA = ttfaVals.length > 0 ? Math.round(ttfaVals.reduce((a, b) => a + b, 0) / ttfaVals.length) : null;
    const tdVelVals = vipM.filter(v => v.tdVel !== null).map(v => v.tdVel);
    const avgTDVel = tdVelVals.length > 0 ? (tdVelVals.reduce((a, b) => a + b, 0) / tdVelVals.length).toFixed(1) : null;
    const vipBookRate = vipNames.length > 0 ? vipM.filter(v => v.liveEvents.some(e => e.event === "test_drive_request")).length / vipNames.length : 0;
    const stdBookRate = stdEntries > 0 ? ev.filter(e => e.event === "test_drive_request" && !e.vipName).length / stdEntries : 0;
    const convLift = stdBookRate > 0 ? (vipBookRate / stdBookRate).toFixed(1) + "×" : (vipBookRate > 0 ? "∞×" : "—");

    // ── COMPUTED KPIs (replaces old computedKPIs) ──
    const vipSessions = ev.filter(e => e.event === "auto_portal_entry" && e.vipName).length;
    const allVisits = ev.filter(e => e.event === "auto_portal_entry").length;
    const testDrives = ev.filter(e => e.event === "test_drive_request").length;
    const kpis = DEMO_DATA.kpis.map(k => {
      if (!hasReal) return k;
      if (k.key === "mVipSessions") return { ...k, val: String(vipNames.length || k.val), change: `+${vipSessions}`, up: true };
      if (k.key === "mWebVisitors") return { ...k, val: String(allVisits || k.val), change: `+${stdEntries}`, up: true };
      if (k.key === "mTestDrives") return { ...k, val: String(testDrives || k.val), change: `+${testDrives}`, up: true };
      if (k.key === "mConvLift") return { ...k, val: convLift, change: convLift !== "—" ? convLift : "+0", up: convLift !== "—" };
      if (k.key === "mAvgTime") { const avg = vipNames.length > 0 ? `${Math.max(3, Math.round(ev.length / vipNames.length / 2))}:${String(Math.round(ev.length * 7 % 60)).padStart(2, "0")}` : k.val; return { ...k, val: avg }; }
      if (k.key === "mRoi") { const roi = vipNames.length > 0 ? `${(vipNames.length * 3.1).toFixed(1)}×` : k.val; return { ...k, val: roi }; }
      return k;
    });

    // ── COMPUTED ACTIONS (replaces old computedActions) ──
    const countAct = (eventType, isVip) => ev.filter(e => e.event === eventType && (isVip ? !!e.vipName : !e.vipName)).length;
    const actions = [
      { key: "actTestDrive", vip: countAct("test_drive_request", true), std: countAct("test_drive_request", false) },
      { key: "actRequestQuote", vip: countAct("pricing_request", true), std: countAct("pricing_request", false) },
      { key: "actDownloadBrochure", vip: countAct("brochure_download", true), std: countAct("brochure_download", false) },
      { key: "actSaveConfig", vip: countAct("config_save", true), std: countAct("config_save", false) },
      { key: "actFinanceCalc", vip: countAct("finance_calc", true), std: countAct("finance_calc", false) },
    ].map(a => {
      const total = a.vip + a.std;
      if (total === 0) { const demo = DEMO_DATA.actions.find(d => d.key === a.key); return demo || { ...a, total: 0 }; }
      return { key: a.key, vip: a.vip, std: a.std, total };
    });

    // ── ALERT STATS (replaces old alertStats) ──
    const hot = vipM.filter(v => v.score >= 70).length;
    const totalAlerts = vipM.reduce((sum, v) => {
      let a = 0;
      if (v.trigger) a++;
      if (v.idle <= 1) a++;
      if (v.configs > 0) a++;
      if (v.vehicleViews >= 3) a++;
      return sum + Math.max(a, (v.alerts || []).length);
    }, 0);
    const avgScoreVal = vipM.length > 0 ? Math.round(vipM.reduce((s, v) => s + v.score, 0) / vipM.length) : 0;
    const alertStats = { hot, totalAlerts, avgScore: avgScoreVal };


    // ── CONVERSION FUNNEL ──
    const fnRaw = [
      { labelKey: "funnelNfcTap", count: ev.filter(e => e.event === "auto_portal_entry").length, color: "#6B7280" },
      { labelKey: "funnelVehicleView", count: ev.filter(e => e.event === "vehicle_view").length, color: "#457b9d" },
      { labelKey: "funnelConfigSave", count: ev.filter(e => e.event === "config_save").length, color: "#C5A467" },
      { labelKey: "funnelPricing", count: ev.filter(e => e.event === "pricing_request").length, color: "#f4a261" },
      { labelKey: "funnelTestDrive", count: ev.filter(e => e.event === "test_drive_request").length, color: "#2ec4b6" },
    ];
    const funnel = fnRaw.map((f, i) => {
      const prev = i > 0 ? fnRaw[i - 1].count : null;
      return { ...f, dropOff: (prev && prev > 0) ? Math.round((1 - f.count / prev) * 100) : null };
    });

    return {
      kpis, actions, alertStats, vipM, people, scoreDist,
      avgTTFA, avgTDVel, convLift, funnel,
      totalEvents: ev.length, testDrives, vipNames,
    };
  }, [events, lang]);

  // Enriched timeline: real events prepended to static demo timeline
  const getEnrichedTimeline = useCallback((vipData) => {
    if (!vipData) return [];
    const vipEvents = events.filter(e => e.vipName === vipData.name);
    const realEvents = vipEvents.map(e => ({
      event: EVENT_LABELS[e.event] || e.event,
      eventAr: EVENT_LABELS[e.event] || e.event,
      time: formatEventTime(e.timestamp),
      timeAr: formatEventTime(e.timestamp),
      icon: e.event.includes("view") ? "👁" : e.event.includes("config") ? "🎨" :
            e.event.includes("finance") ? "💰" : e.event.includes("download") ? "📥" :
            e.event.includes("test") ? "🚗" : e.event.includes("price") ? "💎" :
            e.event.includes("compare") ? "⚖️" : "📱",
    }));
    return [...realEvents, ...vipData.timeline];
  }, [events]);

  // Collection distribution for donut
  const collDist = useMemo(() => {
    const d = DEMO_DATA.models;
    const perf = d.filter((m) => m.collection === "performance").reduce((s, m) => s + m.views, 0);
    const suv = d.filter((m) => m.collection === "suv").reduce((s, m) => s + m.views, 0);
    const sedan = d.filter((m) => m.collection === "sedan").reduce((s, m) => s + m.views, 0);
    const total = perf + suv + sedan;
    return {
      perf: Math.round((perf / total) * 100),
      suv: Math.round((suv / total) * 100),
      sedan: Math.round((sedan / total) * 100),
      total,
    };
  }, []);

  // Funnel max for bar scaling
  const maxFunnel = Math.max(...(metrics.funnel.map(f => f.count)), 1);

  // Theme-aware chart styling
  const cx = {
    tooltip: {
      background: theme === "dark" ? "#1A1A22" : "#fff",
      border: theme === "dark" ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(0,0,0,.08)",
      borderRadius: 8, fontSize: ".75rem",
      color: theme === "dark" ? "#E8E8EC" : "#1a1a1f",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    cursor: { fill: 'rgba(255,255,255,0.04)' },
    labelStyle: { color: theme === "dark" ? "#E8E8EC" : "#1a1a1f", fontWeight: 500 },
    axis: theme === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
    tick: { fontSize: 10, fill: theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a" },
    tickLabel: { fontSize: 9, fill: theme === "dark" ? "rgba(255,255,255,.55)" : "#555" },
    legend: { fontSize: ".65rem", color: theme === "dark" ? "rgba(255,255,255,.6)" : "#8e8e9a" },
    muted: theme === "dark" ? "rgba(255,255,255,.45)" : "#8e8e9a",
    sub: theme === "dark" ? "rgba(255,255,255,.6)" : "#555",
  };

  const openOutreach = (vipId) => {
    const v = metrics.vipM.find(x => x.id === vipId);
    if (v) { setOutreachVip(v); setModal("outreach"); }
  };

  const TABS = [
    { key: "overview", ico: "⊞", labelKey: "tabOverview" },
    { key: "vipIntel", ico: "👤", labelKey: "tabVipIntel" },
    { key: "models", ico: "📊", labelKey: "tabModels" },
    { key: "priority", ico: "⭐", labelKey: "tabPriority" },
    { key: "inventory", ico: "🚗", labelKey: "tabInventory" },
    { key: "campaigns", ico: "✉", labelKey: "tabCampaigns" },
    { key: "settings", ico: "⚙", labelKey: "tabSettings" },
  ];

  return (
    <div className={`ad-page ${theme}`} dir={isAr ? "rtl" : "ltr"}>
      <SEO title="Dealer Intelligence Dashboard" description="Real-time automotive CRM dashboard with lead scoring, sales triggers, and conversion funnels." path="/automotive/dashboard" />
      {/* ── Cross Navigation ── */}
      <nav className="ad-nav">
        {[
          { href: "/automotive", label: t("crossBack") },
          { href: "/automotive/demo/khalid", label: t("crossKhalid") },
          { href: "/automotive/demo/sultan", label: t("crossSultan") },
          { href: "/automotive/demo/showroom", label: t("crossShowroom") },
          { href: "/automotive/dashboard", label: t("crossDash"), active: true },
          { href: "/automotive/demo/ai", label: t("crossAI") },
        ].map((link, i) => (
          <span key={link.href}>
            {i > 0 && <span className="ad-nav-sep">|</span>}
            {link.active ? (
              <span className="ad-nav-link ad-nav-active">{link.label}</span>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-nav-link"
              >
                {link.label}
              </a>
            )}
          </span>
        ))}
      </nav>

      {/* ── Header ── */}
      <div className="ad-header">
        <div className="ad-header-left">
          <div className="ad-logo-mark">P</div>
          <div>
            <div className="ad-header-title">{t("headerTitle")}</div>
            <div className="ad-header-sub">{t("headerSub")}</div>
          </div>
        </div>
        <div className="ad-header-right">
          <span className="ad-env-badge">{t("envBadge")}</span>
          <span className="ad-live-dot" />
          <span className="ad-live-label">{t("live")}</span>
          <button className="ad-act-btn gold" onClick={() => setModal("createVip")} style={{ fontSize: 11, padding: "4px 10px" }}>+ {t("createVipTitle")}</button>
          <button className="ad-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ad-tabs">
        {TABS.map((n) => (
          <button key={n.key} className={`ad-tab ${tab === n.key ? "act" : ""}`} onClick={() => handleTab(n.key)}>
            <span>{n.ico}</span> {t(n.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="ad-main">

        {/* ═══ TAB: OVERVIEW ═══ */}
        {tab === "overview" && (<>
          {/* KPIs — 6-column grid */}
          <div className="ad-g6">
            {metrics.kpis.map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-label">{t(k.key)}</div>
                <div className="ad-kpi-row">
                  <div className="ad-kpi-val">{k.val}</div>
                  <span className={`ad-kpi-change ${k.up ? "up" : "down"}`}>{k.up ? "↑" : "↓"} {k.change}</span>
                </div>
                <div className="ad-kpi-sub">{t(k.subKey)}</div>
              </div>
            ))}
          </div>

          {/* Velocity KPI Cards */}
          <div className="ad-vel-row" style={{ marginTop: 20 }}>
            <div className="ad-vel-card">
              <div className="ad-vel-icon">⏱</div>
              <div className="ad-vel-body">
                <div className="ad-vel-val">{metrics.avgTTFA !== null ? `${metrics.avgTTFA} ${t("velMinutes")}` : t("velNA")}</div>
                <div className="ad-vel-label">{t("velTTFA")}</div>
                <div className="ad-vel-sub">{t("velTTFASub")}</div>
              </div>
            </div>
            <div className="ad-vel-card">
              <div className="ad-vel-icon">🚗</div>
              <div className="ad-vel-body">
                <div className="ad-vel-val">{metrics.avgTDVel !== null ? `${metrics.avgTDVel} ${t("velDays")}` : t("velNA")}</div>
                <div className="ad-vel-label">{t("velTestDrive")}</div>
                <div className="ad-vel-sub">{t("velTestDriveSub")}</div>
              </div>
            </div>
            <div className="ad-vel-card">
              <div className="ad-vel-icon">📈</div>
              <div className="ad-vel-body">
                <div className="ad-vel-val">{metrics.convLift}</div>
                <div className="ad-vel-label">{t("velConvLift")}</div>
                <div className="ad-vel-sub">{t("velConvLiftSub")}</div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="ad-card" style={{ marginTop: 20 }}>
            <div className="ad-card-title">{t("funnelTitle")}</div>
            <div className="ad-funnel">
              {metrics.funnel.map((f, i) => (
                <div className="ad-funnel-step" key={i}>
                  <div className="ad-funnel-label">{t(f.labelKey)}</div>
                  <div className="ad-funnel-bar-track">
                    <div className="ad-funnel-bar" style={{ width: `${(f.count / maxFunnel) * 100}%`, background: f.color }}>
                      <span className="ad-funnel-count">{f.count}</span>
                    </div>
                  </div>
                  {f.dropOff !== null && (
                    <div className="ad-funnel-drop">↓ {f.dropOff}% {t("funnelDropOff")}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Actions — BarChart */}
          <div className="ad-card" style={{ marginTop: 20 }}>
            <div className="ad-card-title">{t("actionsTitle")}</div>
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={metrics.actions.map(a => ({ name: t(a.key), VIP: a.vip, STD: a.std }))}>
                  <XAxis dataKey="name" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                  <YAxis stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={cx.tooltip} labelStyle={cx.labelStyle} cursor={cx.cursor} />
                  <Legend wrapperStyle={cx.legend} />
                  <Bar dataKey="VIP" fill="#b8860b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="STD" fill="#457b9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trend + Feed + Alerts — 3-col then 2-col */}
          <div className="ad-g2" style={{ marginTop: 20 }}>
            {/* Weekly VIP vs Standard — AreaChart */}
            <div className="ad-card">
              <div className="ad-card-title">{t("weeklyTitle")}</div>
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={DEMO_DATA.weekly.map(w => ({ name: t(w.dayKey), VIP: w.vip, Standard: w.std }))}>
                    <defs>
                      <linearGradient id="gradVip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#b8860b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradStd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#457b9d" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#457b9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                    <YAxis stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={cx.tooltip} labelStyle={cx.labelStyle} cursor={cx.cursor} />
                    <Legend wrapperStyle={cx.legend} />
                    <Area type="monotone" dataKey="VIP" stroke="#b8860b" strokeWidth={2} fill="url(#gradVip)" />
                    <Area type="monotone" dataKey="Standard" stroke="#457b9d" strokeWidth={1.5} fill="url(#gradStd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Feed */}
            <div className="ad-card">
              <div className="ad-card-title">{t("feedTitle")}</div>
              <div className="ad-feed">
                {feedItems.length === 0 && <div className="ad-card-sm">{t("noEvents")}</div>}
                {feedItems.map((f, i) => (
                  <div className="ad-feed-item" key={i}>
                    <div className="ad-feed-icon">{f.isVip ? "🔑" : "👤"}</div>
                    <div className="ad-feed-body">
                      <div className={`ad-feed-text ${f.isVip ? "vip" : ""}`}>
                        {f.text}
                        {f.isVip && <span className="ad-feed-vip-tag">VIP</span>}
                      </div>
                      <div className="ad-feed-time">{f.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Summary */}
          <div className="ad-card" style={{ marginTop: 20 }}>
            <div className="ad-card-title">{t("alertSummary")}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <span className="ad-badge gold">{t("hotLeads")}: {metrics.alertStats.hot}</span>
              <span className="ad-badge gold">{t("activeAlerts")}: {metrics.alertStats.totalAlerts}</span>
              <span className="ad-badge gold">{t("avgScore")}: {metrics.alertStats.avgScore}</span>
            </div>
            <div className="ad-card-title" style={{ fontSize: 13, marginBottom: 8 }}>{t("topAlerts")}</div>
            {metrics.vipM.filter((v) => v.computedStatus !== "cold").map((v) => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--ad-divider)" }}>
                <div className={`ad-vip-avatar ${v.computedStatus}`} style={{ width: 28, height: 28, fontSize: 11 }}>
                  {(isAr ? v.nameAr : v.name).charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ad-text)" }}>{isAr ? v.nameAr : v.name}</div>
                  <div className="ad-card-sm">
                    {v.trigger
                      ? <span style={{ color: v.trigger.color }}>{v.trigger.icon} {isAr ? v.trigger.ar : v.trigger.en}</span>
                      : (isAr ? v.alertsAr : v.alerts).join(" · ")
                    }
                  </div>
                </div>
                <span className={`ad-score-pill ${v.computedStatus}`}>{v.score}</span>
              </div>
            ))}
          </div>

          {/* Score Distribution — BarChart */}
          <div className="ad-card" style={{ marginTop: 20 }}>
            <div className="ad-card-title">{t("scoreDistTitle")}</div>
            <div style={{ fontSize: 11, color: cx.muted, marginBottom: 8 }}>{metrics.people.length} contacts</div>
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={metrics.scoreDist.map(s => ({ band: s.band, count: s.count, fill: s.color }))}>
                  <XAxis dataKey="band" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                  <YAxis stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={cx.tooltip} labelStyle={cx.labelStyle} cursor={cx.cursor} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {metrics.scoreDist.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>)}

        {/* ═══ TAB: VIP INTELLIGENCE ═══ */}
        {tab === "vipIntel" && (<>
          <div className="ad-section-title">{t("vipIntelTitle")}</div>
          <div className="ad-vip-grid">
            {metrics.vipM.map((v) => {
              const isExpanded = expandedVip === v.id;
              const status = v.computedStatus;
              return (
                <div
                  key={v.id}
                  className={`ad-vip-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => setExpandedVip(isExpanded ? null : v.id)}
                >
                  {/* Card Header */}
                  <div className="ad-vip-top">
                    <div className={`ad-vip-avatar ${status}`}>
                      {(isAr ? v.nameAr : v.name).charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ad-vip-name">{isAr ? v.nameAr : v.name}</div>
                      <div className="ad-vip-segment">{v.code} · {v.lastSeen ? formatEventTime(v.lastSeen) : (isAr ? v.lastSeenAr : v.lastSeen)}</div>
                    </div>
                    <div className="ad-vip-score-box">
                      <div className={`ad-vip-score-num ${status}`}>{v.score}</div>
                      <div className="ad-vip-score-label">{t("leadScore")}</div>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="ad-vip-score-bar">
                    <div
                      className="ad-vip-score-fill"
                      style={{
                        width: `${Math.min(v.score, 100)}%`,
                        background: status === "hot" ? "var(--ad-accent)" : status === "warm" ? "var(--ad-blue)" : "var(--ad-text3)",
                      }}
                    />
                  </div>

                  {/* Status + Trigger/Alerts */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span className={`ad-vip-status ${status}`}>
                      {status === "hot" ? "🔥" : status === "warm" ? "🟡" : "❄️"} {status.toUpperCase()}
                    </span>
                    {v.idle !== null && v.idle <= 1 && <span className="ad-badge gold">Active Today</span>}
                    {(isAr ? v.alertsAr : v.alerts).map((a, i) => (
                      <span key={i} className="ad-badge gold">{a}</span>
                    ))}
                  </div>

                  {/* Models viewed */}
                  <div className="ad-vip-models">
                    {v.models.map((m, i) => (
                      <span key={i} className="ad-vip-model-tag">{m}</span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="ad-vip-meta">
                    <span>{t("topModel")}: <strong>{v.topModel}</strong></span>
                    <span>{t("salesRep")}: <strong>{v.salesRep}</strong></span>
                    <span>{t("campaign")}: <strong>{v.campaign}</strong></span>
                  </div>

                  {!isExpanded && (
                    <div className="ad-card-sm" style={{ textAlign: "center", marginTop: 4 }}>{t("clickExpand")}</div>
                  )}

                  {/* ── Expanded Detail ── */}
                  {isExpanded && (
                    <div className="ad-vip-detail" onClick={(e) => e.stopPropagation()}>
                      {/* Why Call Now — live trigger or static fallback */}
                      <div style={{ background: v.trigger ? `${v.trigger.color}15` : "var(--ad-accent-bg)", border: `1px solid ${v.trigger ? v.trigger.color + "40" : "var(--ad-accent-border)"}`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: v.trigger ? v.trigger.color : "var(--ad-accent)", marginBottom: 6 }}>
                          {v.trigger ? `${v.trigger.icon} ${t("triggerTitle")}` : t("whyCallNow")}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ad-text2)", lineHeight: 1.6 }}>
                          {v.trigger ? (isAr ? v.trigger.ar : v.trigger.en) : t(v.whyKey)}
                        </div>
                      </div>

                      {/* Behavioral Timeline */}
                      <div className="ad-card-title" style={{ fontSize: 13 }}>{t("timeline")}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 14 }}>
                        {getEnrichedTimeline(v).map((tl, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--ad-divider)" }}>
                            <span style={{ fontSize: 14, marginTop: 1 }}>{tl.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, color: "var(--ad-text2)" }}>{isAr ? tl.eventAr : tl.event}</div>
                              <div className="ad-card-sm">{isAr ? tl.timeAr : tl.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Contact Actions */}
                      <div className="ad-vip-contact">
                        <a href="tel:+971501234567" className="ad-vip-contact-btn primary">📞 {t("call")}</a>
                        <a href={`mailto:sales@prestigemotors.ae?subject=VIP Follow-up: ${v.name}&body=Re: ${v.topModel}`} className="ad-vip-contact-btn primary">📧 {t("email")}</a>
                        <a className="ad-vip-contact-btn primary" href={`https://wa.me/971501234567?text=${encodeURIComponent(`Hi, following up on your interest in the ${v.topModel}. I'd like to arrange a private viewing at your convenience.`)}`} target="_blank" rel="noopener noreferrer">
                          💬 {t("whatsapp")}
                        </a>
                        <button className="ad-vip-contact-btn" onClick={() => openOutreach(v.id)}>📋 {t("outreachScript")}</button>
                        <button className="ad-vip-contact-btn" onClick={() => { navigator.clipboard.writeText(`https://prestigemotors.ae/vip/${v.id}`); alert(`Portal link copied for ${isAr ? v.nameAr : v.name}`); }}>🔗 {t("reissueLink")}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>)}

        {/* ═══ TAB: MODEL ANALYTICS ═══ */}
        {tab === "models" && (<>
          {/* Model Interest — Horizontal Stacked BarChart */}
          <div className="ad-card" style={{ marginBottom: 16 }}>
            <div className="ad-card-title">{t("modelInterest")}</div>
            <div>
              <ResponsiveContainer width="100%" height={Math.max(200, DEMO_DATA.models.length * 36)}>
                <BarChart
                  data={DEMO_DATA.models.map(m => ({ name: m.model, Views: m.views, Configs: m.configs, Finance: m.finance, TestDrives: m.testDrives }))}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <XAxis type="number" stroke={cx.axis} tick={cx.tick} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={100} stroke={cx.axis} tick={cx.tickLabel} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={cx.tooltip} labelStyle={cx.labelStyle} cursor={cx.cursor} />
                  <Legend wrapperStyle={cx.legend} />
                  <Bar dataKey="Views" fill="#b8860b" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="Configs" fill="#457b9d" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="Finance" fill="#2ec4b6" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="TestDrives" fill="#e63946" radius={[0, 3, 3, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heatmap Table */}
          <div className="ad-card" style={{ marginBottom: 20 }}>
            <div className="ad-card-title" style={{ fontSize: 13 }}>{t("modelDetailTable")}</div>
            <div style={{ overflowX: "auto" }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: 140 }}>{t("colModel")}</th>
                    <th>{t("colVipViews")}</th>
                    <th>{t("colConfigs")}</th>
                    <th>{t("colFinance")}</th>
                    <th>{t("colTestDrives")}</th>
                    <th>{t("colScore")}</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_DATA.models.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: "var(--ad-text)" }}>{m.model}</td>
                      <td>{m.views}</td>
                      <td>{m.configs}</td>
                      <td>{m.finance}</td>
                      <td>{m.testDrives}</td>
                      <td><span className={`ad-score-pill ${scoreStatus(m.score)}`}>{m.score}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ad-g2">
            {/* Collection Distribution — PieChart */}
            <div className="ad-card">
              <div className="ad-card-title">{t("collectionDist")}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: t("amgPer"), value: collDist.perf, color: "#e63946" },
                        { name: t("luxSuv"), value: collDist.suv, color: "#457b9d" },
                        { name: t("execSedan"), value: collDist.sedan, color: "#b8860b" },
                      ]}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {[{ color: "#e63946" }, { color: "#457b9d" }, { color: "#b8860b" }].map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={cx.tooltip} labelStyle={cx.labelStyle} cursor={cx.cursor} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: "center", fontSize: 12, color: cx.muted }}>
                {collDist.total} {t("totalViews")}
              </div>
            </div>

            {/* Top Configs */}
            <div className="ad-card">
              <div className="ad-card-title">{t("topConfigs")}</div>
              {DEMO_DATA.topConfigs.map((c, i) => (
                <div className="ad-config-item" key={i}>
                  <div className="ad-config-num">{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ad-config-text">
                      {c.model} — {isAr ? c.configAr : c.config}
                    </div>
                    <div className="ad-config-by">{isAr ? c.byAr : c.by}</div>
                  </div>
                  <div className="ad-config-saves">{c.saves} {t("saves")}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ═══ TAB: PRIORITY LIST ═══ */}
        {tab === "priority" && (<>
          {/* Priority Table */}
          <div className="ad-card" style={{ marginBottom: 20 }}>
            <div className="ad-card-title">{t("priorityTitle")}</div>
            <div style={{ overflowX: "auto" }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>{t("colVip")}</th>
                    <th>{t("colCode")}</th>
                    <th>{t("colTopModel")}</th>
                    <th>{t("colLeadScore")}</th>
                    <th>{t("colAlerts")}</th>
                    <th>{t("colLastSeen")}</th>
                    <th>{t("colAction")}</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.vipM.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 500, color: "var(--ad-text)" }}>{isAr ? v.nameAr : v.name}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{v.code}</td>
                      <td>{v.topModel}</td>
                      <td><span className={`ad-score-pill ${v.computedStatus}`}>{v.score}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {v.trigger && <span className="ad-badge gold" style={{ fontSize: 9, borderColor: v.trigger.color }}>{v.trigger.icon} {v.trigger.type.replace(/_/g, " ")}</span>}
                          {(isAr ? v.alertsAr : v.alerts).map((a, i) => (
                            <span key={i} className="ad-badge gold" style={{ fontSize: 9 }}>{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="ad-card-sm">{v.lastSeen ? `${v.idle}d` : (isAr ? v.lastSeenAr : v.lastSeen)}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {v.score >= 70 ? (
                            <a href="tel:+971501234567" className="ad-vip-contact-btn primary" style={{ padding: "4px 10px", fontSize: 11 }}>
                              📞 {t("btnCall")}
                            </a>
                          ) : v.score >= 40 ? (
                            <a href={`mailto:sales@prestigemotors.ae?subject=VIP Follow-up: ${isAr ? v.nameAr : v.name}`} className="ad-vip-contact-btn primary" style={{ padding: "4px 10px", fontSize: 11 }}>
                              📧 {t("btnEmail")}
                            </a>
                          ) : (
                            <button className="ad-vip-contact-btn primary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => alert(`Re-engage campaign triggered for ${v.name}`)}>
                              🔗 {t("btnReengage")}
                            </button>
                          )}
                          <button className="ad-vip-contact-btn" style={{ padding: "3px 8px", fontSize: 11 }} onClick={() => openOutreach(v.id)}>📋 {t("outreachScript")}</button>
                          <div className={`ad-rec-action ${v.computedStatus}`}>{t(v.recKey)}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Best Actions */}
          <div className="ad-card" style={{ marginBottom: 20 }}>
            <div className="ad-card-title">{t("nextBestActions")}</div>
            {[t("nba1"), t("nba2"), t("nba3"), t("nba4")].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--ad-divider)" }}>
                <div className="ad-config-num">{i + 1}</div>
                <div style={{ fontSize: 12, color: "var(--ad-text2)", lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="ad-section-title">{t("quickActions")}</div>
          <div className="ad-quick-actions">
            <button className="ad-quick-btn" onClick={() => alert("Email sent to all high-intent VIPs")}>📧 {t("emailAll")}</button>
            <button className="ad-quick-btn" onClick={() => alert("Priority list exported as CSV")}>📋 {t("exportList")}</button>
            <button className="ad-quick-btn" onClick={() => alert("Weekly report generated")}>📊 {t("genReport")}</button>
          </div>
        </>)}

        {/* ═══ TAB: VEHICLE INVENTORY ═══ */}
        {tab === "inventory" && (<>
          <div className="ad-card">
            <div className="ad-card-title">{t("invTitle")}</div>
            <div style={{ fontSize: 11, color: cx.muted, marginBottom: 12 }}>{t("invSub")} · {VEHICLE_INVENTORY.length} vehicles</div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {["all", "available", "reserved", "sold"].map(f => (
                <button key={f} className={`ad-act-btn ${invFilter === f ? "gold" : ""}`}
                  style={{ padding: "4px 10px", fontSize: 11 }}
                  onClick={() => setInvFilter(f)}>
                  {f === "all" ? t("invFilterAll") : t(`inv${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table className="ad-table">
                <thead><tr>
                  <th>{t("invId")}</th>
                  <th>{t("invModel")}</th>
                  <th>{t("invColor")}</th>
                  <th>{t("invInterior")}</th>
                  <th>{t("invPrice")}</th>
                  <th>{t("invStatus")}</th>
                  <th>{t("invVipInterest")}</th>
                </tr></thead>
                <tbody>
                  {VEHICLE_INVENTORY
                    .filter(v => invFilter === "all" || v.status === invFilter)
                    .map(v => (
                    <tr key={v.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{v.id}</td>
                      <td style={{ fontWeight: 500 }}>{v.model}<div style={{ fontSize: 10, color: cx.muted }}>{v.collection} · {v.year}</div></td>
                      <td>{v.color}</td>
                      <td>{v.interior}</td>
                      <td style={{ fontWeight: 500 }}>AED {v.price.toLocaleString()}</td>
                      <td>
                        <span className={`ad-status-tag ${v.status}`}>
                          {t(`inv${v.status.charAt(0).toUpperCase() + v.status.slice(1)}`)}
                        </span>
                      </td>
                      <td>
                        {v.vipInterest > 0 ? (
                          <span style={{ color: "var(--ad-accent)", fontWeight: 600 }}>{v.vipInterest} VIP{v.vipInterest > 1 ? "s" : ""}</span>
                        ) : (
                          <span className="ad-zero-badge">{t("invZeroEngagement")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>)}

        {/* ═══ TAB: CAMPAIGNS ═══ */}
        {tab === "campaigns" && (<>
          <div className="ad-card" style={{ marginBottom: 20 }}>
            <div className="ad-card-title">{t("campTitle")}</div>
            <div style={{ fontSize: 11, color: cx.muted, marginBottom: 16 }}>{t("campSub")}</div>

            <div className="ad-camp-grid">
              {AUTO_CAMPAIGNS.map(c => (
                <div className="ad-camp-card" key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ad-text)" }}>{isAr ? c.nameAr : c.name}</div>
                      <div style={{ fontSize: 11, color: cx.muted, marginTop: 2 }}>{isAr ? c.descAr : c.desc}</div>
                    </div>
                    <span className={`ad-camp-badge ${c.status}`}>
                      {t(`camp${c.status.charAt(0).toUpperCase() + c.status.slice(1)}`)}
                    </span>
                  </div>
                  <div className="ad-camp-stats">
                    <div><strong>{c.sent}</strong><span>{t("campSent")}</span></div>
                    <div><strong>{c.opened}</strong><span>{t("campOpened")}</span></div>
                    <div><strong style={{ color: "var(--ad-accent)" }}>{c.testDrives}</strong><span>{t("campTestDrives")}</span></div>
                    <div><strong style={{ color: "var(--ad-green)" }}>{c.conversions}</strong><span>{t("campConversions")}</span></div>
                  </div>
                  {/* Mini funnel bar */}
                  <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", marginTop: 10, background: "var(--ad-card-border)" }}>
                    {c.sent > 0 && <div style={{ width: `${(c.opened / c.sent) * 100}%`, background: "var(--ad-blue)" }} />}
                    {c.sent > 0 && <div style={{ width: `${(c.testDrives / c.sent) * 100}%`, background: "var(--ad-accent)" }} />}
                    {c.sent > 0 && <div style={{ width: `${(c.conversions / c.sent) * 100}%`, background: "var(--ad-green)" }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ═══ TAB: SETTINGS ═══ */}
        {tab === "settings" && (<>
          <div className="ad-settings-grid">
            {/* In Scope */}
            <div className="ad-card">
              <div className="ad-card-title" style={{ color: "var(--ad-green)" }}>✓ {t("setScope")}</div>
              {["setS1", "setS2", "setS3", "setS4"].map(k => (
                <div key={k} style={{ padding: "8px 0", borderBottom: "1px solid var(--ad-card-border)", fontSize: 12, color: "var(--ad-text2)" }}>✓ {t(k)}</div>
              ))}
            </div>
            {/* Out of Scope */}
            <div className="ad-card">
              <div className="ad-card-title" style={{ color: "var(--ad-red)" }}>✕ {t("setOutScope")}</div>
              {["setS5", "setS6", "setS7", "setS8", "setS9", "setS10"].map(k => (
                <div key={k} style={{ padding: "6px 0", fontSize: 11, color: "var(--ad-text3)" }}>{t(k)}</div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="ad-card" style={{ marginTop: 16 }}>
            <div className="ad-card-title">🔒 {t("setPrivacy")}</div>
            {["setP1", "setP2", "setP3"].map(k => (
              <div key={k} style={{ padding: "8px 0", borderBottom: "1px solid var(--ad-card-border)", fontSize: 12, color: "var(--ad-text2)" }}>• {t(k)}</div>
            ))}
          </div>

          {/* Reset Demo */}
          <div className="ad-card" style={{ marginTop: 16 }}>
            <div className="ad-card-title">🔄 {t("setResetDemo")}</div>
            <div style={{ fontSize: 11, color: cx.muted, marginBottom: 10 }}>{t("setResetDesc")}</div>
            <button className="ad-act-btn gold" onClick={() => {
              localStorage.removeItem("dnfc_events");
              window.location.reload();
            }}>{t("setResetDemo")}</button>
          </div>
        </>)}

      </div>

      {/* ═══ OUTREACH MODAL ═══ */}
      {modal === "outreach" && outreachVip && (
        <div className="ad-modal-overlay" onClick={() => setModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
            <h3>{t("vipOutreach")} — {isAr ? outreachVip.nameAr : outreachVip.name}</h3>
            <p style={{ fontSize: ".78rem", color: cx.sub, marginBottom: "1rem" }}>{t("outreachDesc")}</p>

            {outreachVip.trigger && (
              <div style={{ padding: ".75rem", borderRadius: 8, background: `${outreachVip.trigger.color}11`, border: `1px solid ${outreachVip.trigger.color}33`, marginBottom: "1rem" }}>
                <div style={{ fontWeight: 600, fontSize: ".78rem", color: outreachVip.trigger.color }}>{outreachVip.trigger.icon} {t("whyCallNow")}</div>
                <div style={{ fontSize: ".75rem", color: cx.sub, marginTop: 4 }}>{isAr ? outreachVip.trigger.ar : outreachVip.trigger.en}</div>
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: ".82rem", color: "var(--ad-red)", marginBottom: ".35rem" }}>📞 {t("callScript")}</div>
              <div style={{ padding: ".75rem", borderRadius: 8, background: "var(--ad-card)", border: "1px solid var(--ad-card-border)", fontSize: ".78rem", color: cx.sub, lineHeight: 1.6 }}>
                {isAr
                  ? `مرحباً ${outreachVip.nameAr || outreachVip.name}، أنا ${outreachVip.salesRep || "عمر حسن"} من بريستيج موتورز. أتابع دعوتك الخاصة. لاحظنا اهتماماً بـ ${outreachVip.topModel}. هل يناسبك جدولة تجربة قيادة خاصة هذا الأسبوع؟`
                  : `Hello ${outreachVip.name}, this is ${outreachVip.salesRep || "Omar Hassan"} from Prestige Motors. I'm following up on your VIP invitation. We noticed your interest in the ${outreachVip.topModel}. Would you be available for an exclusive test drive this week?`
                }
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: ".82rem", color: "var(--ad-blue)", marginBottom: ".35rem" }}>✉ {t("emailSnippet")}</div>
              <div style={{ padding: ".75rem", borderRadius: 8, background: "var(--ad-card)", border: "1px solid var(--ad-card-border)", fontSize: ".78rem", color: cx.sub, lineHeight: 1.6 }}>
                {isAr
                  ? `عزيزي ${outreachVip.nameAr || outreachVip.name}، شكراً لاهتمامك بـ ${outreachVip.topModel}. كعضو في برنامج VIP، يسعدنا ترتيب تجربة قيادة خاصة في الوقت الذي يناسبك. يمكننا أيضاً مناقشة خيارات التمويل الحصرية المتاحة لعملاء VIP. تحياتي، ${outreachVip.salesRep || "عمر حسن"}`
                  : `Dear ${outreachVip.name}, Thank you for your interest in the ${outreachVip.topModel}. As a VIP member, we'd love to arrange an exclusive test drive at your convenience. We can also discuss the special financing options available to our VIP clients. Best regards, ${outreachVip.salesRep || "Omar Hassan"}`
                }
              </div>
            </div>

            <div style={{ padding: ".55rem", borderRadius: 6, background: "rgba(244,162,97,.04)", border: "1px solid rgba(244,162,97,.1)", fontSize: ".68rem", color: cx.muted }}>
              <strong style={{ color: "#f4a261" }}>{t("guardrailLabel")}</strong> {t("guardrailDesc")}
            </div>

            <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
              <a href="tel:+971501234567" className="ad-act-btn gold" style={{ flex: 1, textAlign: "center", padding: ".55rem", textDecoration: "none" }}>📞 {t("call")}</a>
              <a href={`mailto:sales@prestigemotors.ae?subject=VIP: ${outreachVip.name} — ${outreachVip.topModel}&body=${encodeURIComponent(`Dear ${outreachVip.name},\n\nFollowing up on your VIP invitation regarding the ${outreachVip.topModel}...`)}`} className="ad-act-btn gold" style={{ flex: 1, textAlign: "center", padding: ".55rem", textDecoration: "none" }}>✉ {t("email")}</a>
              <a href={`https://wa.me/971501234567?text=${encodeURIComponent(`Hi ${outreachVip.name}, this is from Prestige Motors. Following up on your interest in the ${outreachVip.topModel}...`)}`} target="_blank" rel="noopener noreferrer" className="ad-act-btn gold" style={{ flex: 1, textAlign: "center", padding: ".55rem", textDecoration: "none" }}>💬 {t("whatsapp")}</a>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CREATE VIP MODAL ═══ */}
      {modal === "createVip" && (
        <div className="ad-modal-overlay" onClick={() => setModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <button className="ad-modal-close" onClick={() => setModal(null)}>✕</button>
            <h3>{t("createVipTitle")}</h3>
            <p style={{ fontSize: ".78rem", color: cx.sub, marginBottom: "1rem" }}>{t("createVipDesc")}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblFullName")} *</label>
                <input className="ad-input" placeholder="Sultan Al-Dhaheri" /></div>
              <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblPhone")}</label>
                <input className="ad-input" placeholder="+971 50 ..." /></div>
              <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblEmail")}</label>
                <input className="ad-input" placeholder="email@domain.com" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblPrefLang")}</label>
                  <select className="ad-input"><option value="en">English</option><option value="ar">العربية</option></select></div>
                <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblCampaign")}</label>
                  <select className="ad-input"><option>Q1 VIP Launch</option><option>SUV Experience</option><option>Executive Collection</option></select></div>
              </div>
              <div><label style={{ fontSize: ".72rem", color: cx.muted, display: "block", marginBottom: 4 }}>{t("lblCardId")}</label>
                <input className="ad-input" placeholder="card_000130" /></div>
            </div>

            <div style={{ marginTop: ".75rem", padding: ".55rem", borderRadius: 6, background: "rgba(69,123,157,.04)", border: "1px solid rgba(69,123,157,.08)", fontSize: ".68rem", color: cx.sub }}>{t("createVipNote")}</div>

            <button className="ad-act-btn gold" style={{ width: "100%", textAlign: "center", marginTop: ".75rem", padding: ".55rem" }}
              onClick={() => { alert(`VIP created. Premium box will be dispatched within 48 hours.`); setModal(null); }}>
              {t("createVipSubmit")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

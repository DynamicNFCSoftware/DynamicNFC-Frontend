import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLanguage, useTranslation, translate } from "../../i18n";
import './Dashboard.css';
import SEO from '../../components/SEO/SEO';
import '../../i18n/portals/dashboard';
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
  if (s < 60) return translate("dashboard", lang, "justNow");
  if (s < 3600) return Math.floor(s / 60) + translate("dashboard", lang, "mAgo");
  if (s < 86400) return Math.floor(s / 3600) + translate("dashboard", lang, "hAgo");
  return Math.floor(s / 86400) + translate("dashboard", lang, "dAgo");
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

const getPriorityNextAction = (v, lang) => {
  if (v.trigger?.type === "booking") return lang === "ar" ? "تأكيد الموعد وتجهيز عرض الوحدة" : "Confirm booked visit and prep unit pitch";
  if (v.trigger?.type === "hot_ph") return lang === "ar" ? "اتصال مباشر اليوم + عرض ترقية البنتهاوس" : "Call today and position penthouse upgrade";
  if (v.trigger?.type === "pricing_stall") return lang === "ar" ? "إرسال خطة دفع ثم مكالمة متابعة" : "Send payment plan and follow up by call";
  if (v.trigger?.type === "comparing") return lang === "ar" ? "اقتراح وحدتين وحجز جولة موجهة" : "Narrow to 2 units and push guided tour";
  if (v.trigger?.type === "floorplan") return lang === "ar" ? "إرسال مخطط/3D وتثبيت زيارة" : "Send floor plan/3D and lock a visit slot";
  if (v.score >= 70) return lang === "ar" ? "اتصال فوري خلال ساعتين" : "Immediate call within 2 hours";
  if (v.idle >= 2) return lang === "ar" ? "إعادة تنشيط برسالة قصيرة ثم اتصال" : "Reactivation SMS then call";
  return lang === "ar" ? "رعاية العميل بمحتوى الوحدة المناسبة" : "Nurture with unit-specific content";
};

const getPriorityDue = (v) => {
  if (v.score >= 70 || v.trigger?.type === "booking" || v.trigger?.type === "hot_ph") return "today";
  if (v.trigger?.type === "pricing_stall" || v.idle >= 2) return "tomorrow";
  return "week";
};

const getPriorityRisk = (v) => {
  if (v.idle >= 3) return "high";
  if (v.idle >= 2 || (v.score >= 40 && !v.trigger)) return "medium";
  return "low";
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
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = useTranslation("dashboard");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [selectedVip, setSelectedVip] = useState(null);
  const [feedFilter, setFeedFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [unitTowerFilter, setUnitTowerFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [outreachVip, setOutreachVip] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const notifIdRef = useRef(0);
  const pushNotif = useCallback((notif) => {
    const id = ++notifIdRef.current;
    setNotifications(prev => [{ ...notif, id, ts: Date.now() }, ...prev].slice(0, 5));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 8000);
  }, []);
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
    try {
      bc = new BroadcastChannel("dnfc_tracking");
      bc.onmessage = (e) => {
        load();
        const d = e.data;
        if (d && d.event) {
          const NM = {
            request_pricing:{icon:"\uD83D\uDCB0",type:"intent",tpl:d=>({en:`${d.vipName||"A visitor"} requested pricing for ${d.unitId||"a unit"}`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u0637\u0644\u0628 \u062A\u0633\u0639\u064A\u0631 ${d.unitId||"\u0648\u062D\u062F\u0629"}`})},
            book_viewing:{icon:"\uD83D\uDCC5",type:"action",tpl:d=>({en:`${d.vipName||d.name||"A visitor"} booked a private viewing`,ar:`${d.vipName||d.name||"\u0632\u0627\u0626\u0631"} \u062D\u062C\u0632 \u0645\u0639\u0627\u064A\u0646\u0629 \u062E\u0627\u0635\u0629`})},
            download_brochure:{icon:"\uD83D\uDCC4",type:"intent",tpl:d=>({en:`${d.vipName||"A visitor"} downloaded brochure`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u062D\u0645\u0651\u0644 \u0643\u062A\u064A\u0628`})},
            explore_payment_plan:{icon:"\uD83D\uDCB3",type:"intent",tpl:d=>({en:`${d.vipName||"A visitor"} explored payment plans`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u0627\u0633\u062A\u0639\u0631\u0636 \u062E\u0637\u0637 \u0627\u0644\u062F\u0641\u0639`})},
            contact_advisor:{icon:"\uD83D\uDCDE",type:"action",tpl:d=>({en:`${d.vipName||"A visitor"} wants to speak with an advisor`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u064A\u0631\u064A\u062F \u0627\u0644\u062A\u062D\u062F\u062B \u0645\u0639 \u0645\u0633\u062A\u0634\u0627\u0631`})},
            lead_captured:{icon:"\uD83C\uDFAF",type:"action",tpl:d=>({en:`New lead captured: ${d.leadName||"Unknown"}`,ar:`\u062A\u0645 \u0627\u0644\u062A\u0642\u0627\u0637 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F: ${d.leadName||"\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641"}`})},
            use_roi_calculator:{icon:"\uD83D\uDCCA",type:"engage",tpl:d=>({en:`${d.vipName||"A visitor"} opened ROI calculator`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u0641\u062A\u062D \u062D\u0627\u0633\u0628\u0629 \u0627\u0644\u0639\u0627\u0626\u062F`})},
            view_floorplan:{icon:"\uD83D\uDCD0",type:"engage",tpl:d=>({en:`${d.vipName||"A visitor"} viewed floor plan`,ar:`${d.vipName||"\u0632\u0627\u0626\u0631"} \u0634\u0627\u0647\u062F \u0645\u062E\u0637\u0637`})},
          };
          const map = NM[d.event];
          if (map) { const ms = map.tpl(d); pushNotif({ icon:map.icon, type:map.type, portal:d.portalType||"vip", msg:ms[lang]||ms.en }); }
        }
      };
    } catch(e) {}
    return () => { clearInterval(iv); bc?.close(); };
  }, [lang, pushNotif]);

  // Demo notifications — auto-fire every 25s
  useEffect(() => {
    const DN = [
      {icon:"\uD83D\uDD25",type:"action",msg:lang==="ar"?"\u062E\u0627\u0644\u062F \u0627\u0644\u0631\u0627\u0634\u062F \u0637\u0644\u0628 \u062E\u0637\u0629 \u062F\u0641\u0639 \u2014 Aurora Penthouse":"Khalid Al-Rashid requested payment plan \u2014 Aurora Penthouse",portal:"vip"},
      {icon:"\uD83D\uDCC5",type:"action",msg:lang==="ar"?"\u0641\u0627\u0637\u0645\u0629 \u0627\u0644\u0645\u0646\u0635\u0648\u0631\u064A \u062D\u062C\u0632\u062A \u0645\u0639\u0627\u064A\u0646\u0629 \u062E\u0627\u0635\u0629":"Fatima Al-Mansouri booked private viewing \u2014 Horizon Family 3B",portal:"vip"},
      {icon:"\uD83D\uDCB0",type:"intent",msg:lang==="ar"?"\u0632\u0627\u0626\u0631 \u0645\u062C\u0647\u0648\u0644 \u0637\u0644\u0628 \u062A\u0633\u0639\u064A\u0631 \u2014 Nova Penthouse":"Anonymous visitor requested pricing \u2014 Nova Penthouse 1",portal:"anonymous"},
      {icon:"\uD83D\uDCCA",type:"intent",msg:lang==="ar"?"\u062E\u0627\u0644\u062F \u0627\u0644\u0631\u0627\u0634\u062F \u0641\u062A\u062D \u062D\u0627\u0633\u0628\u0629 \u0627\u0644\u0639\u0627\u0626\u062F":"Khalid Al-Rashid opened ROI calculator",portal:"vip"},
      {icon:"\uD83C\uDFAF",type:"action",msg:lang==="ar"?"\u062A\u0645 \u0627\u0644\u062A\u0642\u0627\u0637 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F: \u0639\u0645\u0631 \u062E\u0644\u064A\u0644":"New lead captured: Omar Khalil",portal:"lead"},
      {icon:"\uD83D\uDCD0",type:"engage",msg:lang==="ar"?"\u0641\u0627\u0637\u0645\u0629 \u0627\u0644\u0645\u0646\u0635\u0648\u0631\u064A \u0634\u0627\u0647\u062F\u062A \u0645\u062E\u0637\u0637 3 \u0645\u0631\u0627\u062A":"Fatima Al-Mansouri viewed floor plan 3 times",portal:"vip"},
      {icon:"\uD83D\uDCDE",type:"action",msg:lang==="ar"?"\u062E\u0627\u0644\u062F \u0627\u0644\u0631\u0627\u0634\u062F \u064A\u0631\u064A\u062F \u0627\u0644\u062A\u062D\u062F\u062B \u0645\u0639 \u0645\u0633\u062A\u0634\u0627\u0631 \u2014 \u0627\u062A\u0635\u0644 \u0627\u0644\u0622\u0646":"Khalid Al-Rashid wants advisor \u2014 call now!",portal:"vip"},
    ];
    let idx = 0;
    const timer = setInterval(() => { pushNotif(DN[idx % DN.length]); idx++; }, 25000);
    const first = setTimeout(() => pushNotif(DN[0]), 5000);
    return () => { clearInterval(timer); clearTimeout(first); };
  }, [lang, pushNotif]);

  const handleExport = useCallback(() => {
    document.querySelector(".db")?.classList.add("db-printing");
    setTimeout(() => {
      window.print();
      setTimeout(() => document.querySelector(".db")?.classList.remove("db-printing"), 500);
    }, 100);
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
      {label:t("totalVisitors"),count:vipN.length+regN.length+anonS.length+leadN.length,color:"#6B7280",hint:t("funnelHintVisitors")},
      {label:t("viewedUnit"),count:[...new Set(events.filter(e=>["view_unit","unit_view"].includes(e.event)).map(e=>e.vipName||e.userName||e.sessionId))].length,color:"#457b9d",hint:t("funnelHintViewed")},
      {label:t("downloaded"),count:[...new Set(events.filter(e=>e.event==="download_brochure").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#6ba3c7",hint:t("funnelHintDownloaded")},
      {label:t("requestedPricing"),count:[...new Set(events.filter(e=>e.event==="request_pricing").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#f4a261",hint:t("funnelHintPricing")},
      {label:t("bookedViewing"),count:[...new Set(events.filter(e=>e.event==="book_viewing").map(e=>e.vipName||e.userName||e.leadName))].length,color:"#2ec4b6",hint:t("funnelHintBooked")},
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
  const towerBarRows = useMemo(() => {
    const towerColors = ["#e63946", "#457b9d", "#2ec4b6"];
    return Object.entries(metrics.ti).map(([k, v], i) => ({
      name: towerName(k, lang),
      value: v,
      fill: towerColors[i % towerColors.length],
    }));
  }, [metrics.ti, lang]);
  const ownerWorkload = useMemo(() => {
    const byOwner = {};
    metrics.vipM.forEach((v) => {
      const owner = repName(v.salesRepId) || t("noOwner");
      if (!byOwner[owner]) byOwner[owner] = { owner, total: 0, dueToday: 0, highRisk: 0 };
      byOwner[owner].total += 1;
      if (getPriorityDue(v) === "today") byOwner[owner].dueToday += 1;
      if (getPriorityRisk(v) === "high") byOwner[owner].highRisk += 1;
    });
    const rows = Object.values(byOwner).sort((a, b) => {
      if (b.dueToday !== a.dueToday) return b.dueToday - a.dueToday;
      if (b.highRisk !== a.highRisk) return b.highRisk - a.highRisk;
      return b.total - a.total;
    });
    return {
      rows,
      dueToday: rows.reduce((sum, r) => sum + r.dueToday, 0),
      highRisk: rows.reduce((sum, r) => sum + r.highRisk, 0),
    };
  }, [metrics.vipM, t]);
  const filteredPriorityVips = useMemo(() => (
    ownerFilter === "all"
      ? metrics.vipM
      : metrics.vipM.filter((v) => repName(v.salesRepId) === ownerFilter)
  ), [metrics.vipM, ownerFilter]);
  const openOutreach = (vid) => { const v=VIP_PROFILES.find(x=>x.vipId===vid); if(v){setOutreachVip(v);setModal("outreach");} };
  const NAV = [
    {key:"overview",ico:"⊞",label:t("navOverview")},{key:"vipcrm",ico:"👤",label:t("navVipCrm"),count:metrics.vipM.length},
    {key:"priority",ico:"⭐",label:t("navPriority")},{key:"analytics",ico:"📊",label:t("navAnalytics")},
    {key:"pipeline",ico:"📋",label:t("navPipeline")},{key:"ai",ico:"🤖",label:t("navAI")},{key:"units",ico:"🏠",label:t("navUnits")},{key:"campaigns",ico:"✉",label:t("navCampaigns")},
    {key:"settings",ico:"⚙",label:t("navSettings")},
  ];
  const portalStatus = useMemo(() => {
    const labelMap = EVENT_LABELS[lang] || EVENT_LABELS.en;
    const lastOf = (portalType) => {
      const last = events
        .filter((e) => e.portalType === portalType)
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (!last) return null;
      let act = labelMap[last.event] || last.event;
      if (last.unitName) act += ` — ${last.unitName}`;
      return { act, time: ago(last.timestamp, lang) };
    };
    const lastVipByName = (vipName) => {
      const last = events
        .filter((e) => e.portalType === "vip" && e.vipName === vipName)
        .slice()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      if (!last) return null;
      let act = labelMap[last.event] || last.event;
      if (last.unitName) act += ` — ${last.unitName}`;
      return { act, time: ago(last.timestamp, lang) };
    };
    return {
      khalid: lastVipByName("Khalid Al-Rashid"),
      ahmed: lastVipByName("Ahmed Al-Fahad"),
      registered: lastOf("registered"),
      lead: lastOf("lead"),
      anonymous: lastOf("anonymous"),
    };
  }, [events, lang]);
  const idleCls = d => d>=3?"db-idle-danger":d>=2?"db-idle-warn":"db-idle-ok";
  const maxSD = Math.max(...metrics.scoreDist.map(s=>s.count),1);

  return (
    <div className={`db ${theme === "light" ? "light" : ""}`} dir={isAr?"rtl":"ltr"}>
      <SEO title="CRM Intelligence Dashboard" description="Real estate behavioral analytics — lead scoring, VIP outreach, and conversion optimization." path="/enterprise/crmdemo/dashboard" />
      <aside className="db-sidebar">
        <div className="db-brand"><h2>{t("headerTitle")}</h2><p style={{color:'rgba(255,255,255,.5)',fontSize:'.7rem',letterSpacing:'.08em',fontWeight:500}}>DYNAMIC NFC INTELLIGENCE</p></div>
        <nav className="db-nav">
          <div className="db-nav-label db-nav-label-portals">{t("navLabelPortals")}</div>
          <NavLink to="/enterprise/crmdemo/khalid" target="_blank" rel="noreferrer" className={({ isActive }) => `db-nav-item db-nav-portal${isActive ? " act" : ""}`}>
            <span className="nav-ico">🔑</span>
            <span className="db-nav-portal-main">
              <span className="db-nav-portal-title">{t("navVipPortal")}</span>
              <span className="db-nav-portal-sub">{portalStatus.khalid ? `${portalStatus.khalid.act} · ${portalStatus.khalid.time}` : (isAr ? "لا توجد بيانات بعد" : "No activity yet")}</span>
            </span>
          </NavLink>
          <NavLink to="/enterprise/crmdemo/ahmed" target="_blank" rel="noreferrer" className={({ isActive }) => `db-nav-item db-nav-portal${isActive ? " act" : ""}`}>
            <span className="nav-ico">🏠</span>
            <span className="db-nav-portal-main">
              <span className="db-nav-portal-title">{t("navAhmedPortal")}</span>
              <span className="db-nav-portal-sub">{portalStatus.ahmed ? `${portalStatus.ahmed.act} · ${portalStatus.ahmed.time}` : (isAr ? "لا توجد بيانات بعد" : "No activity yet")}</span>
            </span>
          </NavLink>
          <NavLink to="/enterprise/crmdemo/marketplace" target="_blank" rel="noreferrer" className={({ isActive }) => `db-nav-item db-nav-portal${isActive ? " act" : ""}`}>
            <span className="nav-ico">🌐</span>
            <span className="db-nav-portal-main">
              <span className="db-nav-portal-title">{t("navMarketplace")}</span>
              <span className="db-nav-portal-sub">{portalStatus.lead || portalStatus.anonymous ? `${(portalStatus.lead || portalStatus.anonymous).act} · ${(portalStatus.lead || portalStatus.anonymous).time}` : (isAr ? "لا توجد بيانات بعد" : "No activity yet")}</span>
            </span>
          </NavLink>
          <div className="db-nav-label" style={{ marginTop: ".75rem" }}>{t("navLabelIntel")}</div>
          {NAV.map(n=>(<div key={n.key} className={`db-nav-item ${activeTab===n.key?"act":""}`} onClick={()=>n.key==="ai"?navigate("/enterprise/crmdemo/ai-demo"):handleTab(n.key)}>
            <span className="nav-ico">{n.ico}</span>{n.label}{n.count?<span className="db-nav-count">{n.count}</span>:null}
          </div>))}
          <div className="db-nav-label" style={{marginTop:".5rem"}}>{t("navLabelDemo")}</div>
          <NavLink to="/enterprise/crmdemo/ai-demo" className={({ isActive }) => `db-nav-item${isActive ? " act" : ""}`}><span className="nav-ico">🤖</span>{t("navAiDemo")}</NavLink>
          <NavLink to="/enterprise/crmdemo/roi-calculator" className={({ isActive }) => `db-nav-item${isActive ? " act" : ""}`}><span className="nav-ico">📊</span>{t("navRoiCalc")}</NavLink>
          <Link to="/enterprise/crmdemo" className="db-nav-item" style={{opacity:.6,fontSize:".75rem"}}><span className="nav-ico">←</span>{t("navDemoGateway")}</Link>
        </nav>
        <div style={{padding:".75rem 1.25rem",borderTop:"1px solid rgba(255,255,255,.06)"}}><img src="/assets/images/dynamicnfc-logo-red.png" alt="Dynamic NFC" style={{height:16,opacity:.4}}/></div>
      </aside>
      <div className="db-main">
        <div className="db-topbar">
          <div><div className="db-tb-title">{t("headerTitle")} — {t("headerSub")}</div><div className="db-tb-sub">{metrics.totalEvents} {t("eventsTracked")} · {t("decayLabel")}</div><div style={{fontSize:".65rem",color:"var(--db-muted,#999)",fontStyle:"italic",marginTop:"2px"}}>{t("poweredBy")}</div></div>
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
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>

  {/* ── ACTION-FIRST HERO (Today → Proof) ─────────────────────── */}
  <div className="db-hero-grid">
    <div className="db-card db-card-hero">
      <div className="db-card-hd">
        <div>
          <div className="db-card-title">{t("todayActionsTitle")}</div>
          <div className="db-card-sub">{t("todayActionsSub")}</div>
        </div>
        <button className="db-pill" onClick={() => handleTab("priority")} style={{ color: "#e63946" }}>
          {t("priorityListBtn")}
        </button>
      </div>
      <div className="db-card-body">
        <div className="db-demo-guide" role="region" aria-label={t("demoGuideTitle")}>
          <div className="db-demo-guide-hd">
            <span className="db-demo-guide-title">{t("demoGuideTitle")}</span>
            <span className="db-demo-guide-sub">{t("demoGuideSubtitle")}</span>
          </div>
        <div className="db-demo-steps">
          <div className="db-demo-step">
            <span className="db-demo-step-num">1</span>
            <span className="db-demo-step-text">{t("demoStep1")}</span>
            <Link className="db-demo-step-cta" to="/enterprise/crmdemo/khalid" target="_blank" rel="noreferrer">{t("openPortalLink")}</Link>
          </div>
          <div className="db-demo-step">
            <span className="db-demo-step-num">2</span>
            <span className="db-demo-step-text">{t("demoStep2")}</span>
          </div>
          <div className="db-demo-step">
            <span className="db-demo-step-num">3</span>
            <span className="db-demo-step-text">{t("demoStep3")}</span>
          </div>
          <div className="db-demo-step">
            <span className="db-demo-step-num">4</span>
            <span className="db-demo-step-text">{t("demoStep4")}</span>
            <Link className="db-demo-step-cta" to="/enterprise/crmdemo/ahmed" target="_blank" rel="noreferrer">{t("openPortalLink")}</Link>
          </div>
          <div className="db-demo-step">
            <span className="db-demo-step-num">5</span>
            <span className="db-demo-step-text">{t("demoStep5")}</span>
            <Link className="db-demo-step-cta" to="/enterprise/crmdemo/marketplace" target="_blank" rel="noreferrer">{t("openPortalLink")}</Link>
          </div>
        </div>
        </div>
        <div className="db-today-list">
          {metrics.vipM.slice(0, 3).map((v) => (
            <div key={v.vipId} className="db-today-item">
              <div className="db-vip-avatar" style={{ background: `linear-gradient(135deg,${scoreColor(v.score)},${v.score >= 70 ? "#c1121f" : "#2b6684"})`, width: 36, height: 36, fontSize: ".8rem" }}>
                {initials(v.fullName)}
              </div>
              <div className="db-today-main">
                <div className="db-today-top">
                  <div className="db-today-name">
                    {v.fullName} {v.idle >= 2 && <span className="db-at-risk">{t("atRisk")}</span>}
                  </div>
                  <div className="db-today-score" style={{ color: scoreColor(v.score) }}>{v.score}</div>
                </div>
                <div className="db-today-sub">
                  <span>{towerName(v.topTower, lang)}</span>
                  <span className="db-dot-sep">•</span>
                  <span>{isAr ? `${v.idle} يوم بلا نشاط` : `${v.idle}d idle`}</span>
                  {v.topUnit && (<>
                    <span className="db-dot-sep">•</span>
                    <span className="db-today-unit">{v.topUnit}</span>
                  </>)}
                </div>
                {v.trigger && (
                  <div className="db-today-trigger" style={{ borderColor: `${v.trigger.color}33`, background: `${v.trigger.color}0a` }}>
                    <span className="db-today-trigger-label" style={{ color: v.trigger.color }}>
                      {t("salesTrigger")}: {t("whyCallNow")}
                    </span>
                    <div className="db-today-trigger-text" style={{ color: cx.sub }}>
                      {isAr ? v.trigger.ar : v.trigger.en}
                    </div>
                  </div>
                )}
              </div>
              <button className="db-pill db-today-cta" onClick={() => openOutreach(v.vipId)}>
                📞 {t("outreachBtn")} →
              </button>
            </div>
          ))}
        </div>
        <p className="db-today-footnote">{t("todayListFootnote")}</p>
      </div>
    </div>

    <div className="db-card db-card-hero">
      <div className="db-card-hd">
        <div>
          <div className="db-card-title">{t("liveActivityFeed")}</div>
          <div className="db-card-sub">{t("realtimeInteractions")}</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "vip", "registered", "lead", "anonymous"].map((f) => (
            <button key={f} className={`db-pill ${feedFilter === f ? "act" : ""}`} onClick={() => setFeedFilter(f)}>
              {f === "all" ? t("feedAll") : f === "vip" ? t("feedVip") : f === "registered" ? t("feedRegistered") : f === "lead" ? t("feedLead") : t("feedAnonymous")}
            </button>
          ))}
        </div>
      </div>
      <div className="db-card-body" style={{ padding: 0 }}>
        <div className="db-feed" style={{ padding: "0 1.25rem" }}>
          {events
            .slice()
            .reverse()
            .filter((e) => feedFilter === "all" || e.portalType === feedFilter)
            .slice(0, 12)
            .map((e, i) => {
              const el = EVENT_LABELS[lang] || EVENT_LABELS.en;
              let act = el[e.event] || e.event;
              if (e.unitName) act += ` — ${e.unitName}`;
              const cls = e.portalType === "vip" ? "vip" : e.portalType === "registered" ? "reg" : "anon";
              return (
                <div className="db-feed-item" key={i}>
                  <div className={`db-feed-ico ${cls}`}>{e.portalType === "vip" ? "🔑" : e.portalType === "registered" ? "👤" : "🌐"}</div>
                  <div className="db-feed-body">
                    <strong>{e.vipName || e.userName || e.leadName || (isAr ? "مجهول" : "Anonymous")}</strong>
                    {e.portalType === "vip" && <span className="db-mini-vip">VIP</span>}
                    <div className="desc">{act}</div>
                  </div>
                  <span className="db-feed-time">{ago(e.timestamp, lang)}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  </div>

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
  <p className="db-conv-dots-legend">{t("convDotsLegend")}</p>
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

  {/* Funnel with drop-off + Tower */}
  <div className="db-grid db-g2">
    <div className="db-card"><div className="db-card-hd"><div className="db-card-title">{t("conversionFunnel")}<span className="db-ai-badge">AI</span></div></div>
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
        <div className="db-funnel-legend">
          <div className="db-funnel-legend-title">{t("funnelColorKey")}</div>
          <ul className="db-funnel-legend-items">
            {metrics.fn.map((f) => (
              <li key={f.label} className="db-funnel-legend-item">
                <span className="db-funnel-legend-swatch" style={{ background: f.color }} aria-hidden />
                <div className="db-funnel-legend-text">
                  <span className="db-funnel-legend-label">{f.label}</span>
                  <span className="db-funnel-legend-hint">{f.hint}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div></div>
    <div className="db-card"><div className="db-card-hd"><div><div className="db-card-title">{t("towerInterestDist")}</div><div className="db-card-sub">{t("allTrafficCombined")}</div></div></div>
      <div className="db-card-body" >
      <ResponsiveContainer width="100%" height={200}><BarChart data={towerBarRows}>
        <XAxis dataKey="name" stroke={cx.axis} tick={cx.tickSm} axisLine={false} tickLine={false}/>
        <YAxis stroke={cx.axis} tick={cx.tickSm} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={cx.tooltip}/>
        <Bar dataKey="value" radius={[4,4,0,0]}>{towerBarRows.map((entry, i) => <Cell key={`${entry.name}-${i}`} fill={entry.fill} />)}</Bar>
      </BarChart></ResponsiveContainer>
      <div className="db-tower-legend">
        <div className="db-tower-legend-title">{t("towerColorKey")}</div>
        <p className="db-tower-legend-sub">{t("towerColorKeySub")}</p>
        <div className="db-tower-legend-row">
          {towerBarRows.map((d, i) => (
            <span key={`${d.name}-${i}`} className="db-tower-legend-chip">
              <span className="db-tower-legend-swatch" style={{ background: d.fill }} aria-hidden />
              {d.name}
            </span>
          ))}
        </div>
      </div>
      </div></div>
  </div>
</>)}

{/* ═══════════════ TAB 2: VIP CRM ═══════════════ */}
{activeTab==="vipcrm"&&(<>
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>
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
          <div className="db-trigger-body"><div className="db-trigger-label" style={{color:v.trigger.color}}>💡 {t("salesTrigger")}: {t("whyCallNow")}<span className="db-ai-badge">AI</span></div><div className="db-trigger-text" style={{color:cx.sub}}>{isAr?v.trigger.ar:v.trigger.en}</div></div>
        </div>)}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:".4rem",marginBottom:"1rem"}}>
          {[{l:t("decayedScore"),v2:v.score+"⏳",c:scoreColor(v.score)},{l:t("repeatViews"),v2:v.repeatViews,c:"#457b9d"},{l:t("pricingSignal"),v2:Math.floor(v.pricingTime/60)+"m",c:"#f4a261"},{l:t("daysIdle"),v2:v.idle+"d",c:v.idle>=2?"#e63946":"#2ec4b6"}].map((m,i)=>(
            <div key={i} style={{padding:".45rem",borderRadius:8,border:"1px solid rgba(255,255,255,.08)",textAlign:"center"}}><div style={{fontSize:".55rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{m.l}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:600,color:m.c}}>{m.v2}</div></div>))}
        </div>
        {v.ttfa!==null&&(<div style={{fontSize:".68rem",color:cx.muted,marginBottom:".5rem"}}>{t("mTimeToAction")}: <strong style={{color:"#C5A467"}}>{v.ttfa} min</strong>{v.viewVel!==null&&<> · {t("mViewingVelocity")}: <strong style={{color:"#C5A467"}}>{v.viewVel} days</strong></>}</div>)}
        <div style={{marginBottom:".75rem"}}><div style={{fontSize:".58rem",color:cx.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:".25rem"}}>{t("alerts")}</div>
          {v.alerts.map((a,i)=>{const cls=a.includes("pricing")||a.includes("high_intent")?"db-alert-red":a.includes("comparing")?"db-alert-blue":"db-alert-amber"; const ak=a.includes("pricing")?"alertPricing":a.includes("high_intent")?"alertHighIntent":a.includes("comparing")?"alertComparing":"alertFamily"; const label=t(ak)||a; return <span key={i} className={`db-alert ${cls}`}>{label}</span>;})}</div>
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
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>
  <div className="db-sec"><h2>{t("priorityVipList")}</h2><div className="db-sec-line"/><span className="db-sec-badge">{t("dailySalesCockpit")}</span></div>
  <p style={{fontSize:".78rem",color:cx.sub,marginBottom:".75rem"}}>{t("prioritySortedDesc")}</p>
  <div className="db-card" style={{marginBottom:"1rem"}}>
    <div className="db-card-hd">
      <div>
        <div className="db-card-title">{t("ownerWorkloadTitle")}</div>
        <div className="db-card-sub">{t("ownerWorkloadSub")}</div>
      </div>
      <div className="db-pri-kpis">
        <span className="db-pri-kpi"><b>{ownerWorkload.dueToday}</b> {t("totalDueToday")}</span>
        <span className="db-pri-kpi"><b>{ownerWorkload.highRisk}</b> {t("highRiskNow")}</span>
      </div>
    </div>
    <div className="db-card-body db-pri-owner-row">
      <button
        type="button"
        className={`db-pri-owner-chip db-pri-owner-toggle ${ownerFilter === "all" ? "active" : ""}`}
        onClick={() => setOwnerFilter("all")}
        aria-label={t("allOwners")}
      >
        <div className="db-pri-owner-name">{t("allOwners")}</div>
        <div className="db-pri-owner-metrics">
          <span className="db-pri-chip db-pri-due-week">{metrics.vipM.length}</span>
        </div>
      </button>
      {ownerWorkload.rows.map((r) => (
        <button
          type="button"
          key={r.owner}
          className={`db-pri-owner-chip db-pri-owner-toggle ${ownerFilter === r.owner ? "active" : ""}`}
          onClick={() => setOwnerFilter(r.owner)}
          aria-label={`${t("ownerFilterLabel")}: ${r.owner}`}
        >
          <div className="db-pri-owner-name">{r.owner}</div>
          <div className="db-pri-owner-metrics">
            <span className="db-pri-chip db-pri-due-today">{r.dueToday} {t("dueToday")}</span>
            <span className={`db-pri-chip ${r.highRisk > 0 ? "db-pri-risk-high" : "db-pri-risk-low"}`}>{r.highRisk} {t("riskHigh")}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
  <div className="db-card" style={{marginBottom:"1.25rem"}}><div className="db-card-body" style={{padding:0}}>
    <table className="db-table"><thead><tr><th>{t("thVip")}</th><th>{t("thOwner")}</th><th>{t("thUnitFocus")}</th><th>{t("thLeadScore")} ⏳<span className="db-ai-badge">AI</span></th><th>{t("thNextAction")}</th><th>{t("thDue")}</th><th>{t("thRisk")}</th><th>{t("thLastSeen")}</th><th>{t("thAction")}</th></tr></thead>
      <tbody>{filteredPriorityVips.map(v=>{
        const due = getPriorityDue(v);
        const risk = getPriorityRisk(v);
        const dueLabel = due === "today" ? t("dueToday") : due === "tomorrow" ? t("dueTomorrow") : t("dueThisWeek");
        const riskLabel = risk === "high" ? t("riskHigh") : risk === "medium" ? t("riskMedium") : t("riskLow");
        const riskCls = risk === "high" ? "db-pri-risk-high" : risk === "medium" ? "db-pri-risk-medium" : "db-pri-risk-low";
        const dueCls = due === "today" ? "db-pri-due-today" : due === "tomorrow" ? "db-pri-due-tomorrow" : "db-pri-due-week";
        return (<tr key={v.vipId}>
          <td><div style={{fontWeight:500,color:cx.text}}>{v.fullName}</div><div style={{fontSize:".6rem",color:cx.muted}}>{v.vipCode}</div></td>
          <td><div style={{fontSize:".72rem",fontWeight:600,color:cx.text}}>{repName(v.salesRepId)}</div><div style={{fontSize:".6rem",color:cx.muted}}>{campName(v.campaignId)}</div></td>
          <td><div style={{fontSize:".72rem",color:cx.text}}>{v.topUnit || v.topPlans?.[0] || "—"}</div><div style={{fontSize:".6rem",color:cx.muted}}>{towerName(v.topTower,lang)}</div></td>
          <td><span style={{fontWeight:600,color:scoreColor(v.score)}}>{v.score}</span><span style={{fontSize:".52rem",color:cx.muted,marginLeft:3}}>({isAr?"خام":"raw"}: {v.rawScore})</span></td>
          <td style={{maxWidth:235}}><span style={{fontSize:".68rem",color:cx.sub}}>{getPriorityNextAction(v, lang)}</span></td>
          <td><span className={`db-pri-chip ${dueCls}`}>{dueLabel}</span></td>
          <td><span className={`db-pri-chip ${riskCls}`}>{riskLabel}</span></td>
          <td><span style={{fontSize:".68rem",color:cx.sub}}>{ago(v.lastSeen,lang)}</span><div style={{fontSize:".58rem",color:cx.muted}}>{v.idle}{isAr?" يوم":"d"} {isAr?"بدون نشاط":"idle"}</div></td>
          <td><button className="db-pill" onClick={()=>openOutreach(v.vipId)} style={{color:"#e63946"}}>{isAr?"تواصل →":"Outreach →"}</button></td>
        </tr>);
      })}</tbody></table>
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
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>
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
{activeTab==="pipeline"&&(()=>{
  const PL_STAGES=[
    {key:"inquiry",label:t("plInquiry"),color:"#9ca3af",emoji:"📨"},
    {key:"viewingSched",label:t("plViewingSched"),color:"#3b82f6",emoji:"📅"},
    {key:"viewingDone",label:t("plViewingDone"),color:"#6366f1",emoji:"✅"},
    {key:"negotiation",label:t("plNegotiation"),color:"#f59e0b",emoji:"🤝"},
    {key:"reservation",label:t("plReservation"),color:"#f97316",emoji:"🔒"},
    {key:"contract",label:t("plContract"),color:"#8b5cf6",emoji:"📝"},
    {key:"closed",label:t("plClosed"),color:"#10b981",emoji:"🎉"},
  ];
  const PL_DEALS=[
    {id:"D001",name:"Khalid Al-Rashid",unit:"Aurora Penthouse 1",value:2450000,stage:"negotiation",days:3,rep:"Alex Reed",score:87,act:"Requested payment plan"},
    {id:"D002",name:"Fatima Al-Mansouri",unit:"Horizon Family 3B",value:1350000,stage:"viewingSched",days:1,rep:"Mina Patel",score:62,act:"Booked private viewing"},
    {id:"D003",name:"Omar Al-Suwaidi",unit:"Aurora Grand 3A",value:1250000,stage:"inquiry",days:5,rep:"Alex Reed",score:34,act:"Downloaded brochure"},
    {id:"D004",name:"Layla Hassan",unit:"Nova Penthouse 1",value:1850000,stage:"viewingDone",days:2,rep:"Alex Reed",score:71,act:"Viewed floor plan 3x"},
    {id:"D005",name:"Sultan Al-Dhaheri",unit:"Horizon Grand 3B",value:1120000,stage:"reservation",days:1,rep:"Mina Patel",score:91,act:"Signed reservation form"},
    {id:"D006",name:"Nora Saeed",unit:"Nova Classic 7A",value:645000,stage:"inquiry",days:8,rep:"Mina Patel",score:28,act:"Browsed 3 units"},
    {id:"D007",name:"Ahmad Khalil",unit:"Horizon Classic 2A",value:695000,stage:"contract",days:0,rep:"Alex Reed",score:95,act:"Contract sent for review"},
    {id:"D008",name:"Mariam Al-Fahad",unit:"Aurora Grand 8B",value:789000,stage:"closed",days:0,rep:"Mina Patel",score:100,act:"Payment received"},
    {id:"D009",name:"Rashid Al-Maktoum",unit:"Al Rawda Grand 9B",value:985000,stage:"negotiation",days:4,rep:"Alex Reed",score:78,act:"Pricing counter-offer"},
    {id:"D010",name:"Amira Bakri",unit:"Horizon Suite 3A",value:495000,stage:"viewingSched",days:2,rep:"Mina Patel",score:45,act:"Scheduled for Saturday"},
  ];
  const fmtP=v=>isAr?`${v.toLocaleString()} درهم`:`AED ${v.toLocaleString()}`;
  const fmtM=v=>isAr?`${(v/1e6).toFixed(2)} م`:`$${(v/1e6).toFixed(2)}M`;
  const scC=s=>s>=80?{bg:"rgba(220,38,38,.12)",c:"#dc2626"}:s>=50?{bg:"rgba(245,158,11,.12)",c:"#f59e0b"}:s>=30?{bg:"rgba(69,123,157,.12)",c:"#457b9d"}:{bg:"rgba(156,163,175,.1)",c:"#9ca3af"};
  const totalVal=PL_DEALS.reduce((s,d)=>s+d.value,0);
  return (<>
    <div className="db-card" style={{marginBottom:"1.25rem"}}><div className="db-card-hd"><div><div className="db-card-title">{t("pipelineTitle")}<span className="db-ai-badge">AI SCORED</span></div><div className="db-card-sub">{t("pipelineSub")}</div></div><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div></div>

    {/* Total Pipeline Value Bar */}
    <div className="db-pipeline-value-bar">
      <div className="db-pipeline-value-label"><span style={{fontSize:"1.1rem"}}>💰</span><span>{t("plTotalValue")}</span></div>
      <div className="db-pipeline-value-amount">{fmtP(totalVal)}</div>
      <div className="db-pipeline-value-deals">{PL_DEALS.length} {t("plDeals")}</div>
    </div>

    {/* Stage Summary Cards */}
    <div className="db-pipeline-stages">
      {PL_STAGES.map(s=>{const sd=PL_DEALS.filter(d=>d.stage===s.key);const sv=sd.reduce((a,d)=>a+d.value,0);return(
        <div key={s.key} className="db-pipeline-stage-card" style={{"--_stage-color":s.color}}>
          <div className="db-pipeline-stage-emoji">{s.emoji}</div>
          <div className="db-pipeline-stage-label">{s.label}</div>
          <div className="db-pipeline-stage-count">{sd.length}</div>
          <div className="db-pipeline-stage-val">{sv>0?fmtM(sv):"—"}</div>
        </div>);})}
    </div>

    {/* Kanban Board */}
    <div className="db-pipeline-board">
      <div className="db-pipeline-columns">
        {PL_STAGES.map(s=>{const sd=PL_DEALS.filter(d=>d.stage===s.key);return(
          <div key={s.key} className="db-pipeline-col" style={{"--_stage-color":s.color}}>
            <div className="db-pipeline-col-hd" style={{"--_stage-color":s.color}}>
              <div className="db-pipeline-col-hd-left">
                <span className="db-pipeline-col-hd-emoji">{s.emoji}</span>
                <span className="db-pipeline-col-hd-label">{s.label}</span>
              </div>
              <span className="db-pipeline-col-count" style={{background:s.color}}>{sd.length}</span>
            </div>
            <div className="db-pipeline-col-body">
              {sd.length===0&&<div className="db-pipeline-empty"><span>—</span></div>}
              {sd.map(deal=>{const sc=scC(deal.score);return(
                <div key={deal.id} className="db-pipeline-card">
                  <div className="db-pipeline-card-hd">
                    <span className="db-pipeline-card-name">{deal.name}</span>
                    <span className="db-pipeline-card-score" style={{background:sc.bg,color:sc.c}}>{deal.score}</span>
                  </div>
                  <div className="db-pipeline-card-unit">{deal.unit}</div>
                  <div className="db-pipeline-card-val">{fmtP(deal.value)}</div>
                  <div className="db-pipeline-card-meta">
                    <span>👤 {deal.rep}</span>
                    {deal.days>0&&<span className="db-pipeline-card-days" style={{color:deal.days>=5?"#dc2626":deal.days>=3?"#f59e0b":"var(--db-muted)"}}>{deal.days} {t("plDays")}</span>}
                  </div>
                  <div className="db-pipeline-card-act">{deal.act}</div>
                </div>);})}
            </div>
          </div>);})}
      </div>
    </div>
    <div className="db-pipeline-drag-note">{t("plDragNote")}</div>
  </>);
})()}

{activeTab==="units"&&(<>
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>
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
  <div className="db-export-bar"><button className="db-export-btn" onClick={handleExport}>📥 {t("exportPdf")}</button></div>
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

{/* ── Notification Toasts ── */}
<div className="db-notif-container">
  {notifications.map((n, i) => (
    <div key={n.id} className={`db-notif db-notif-${n.type}`} style={{animationDelay:`${i*50}ms`}}>
      <div className="db-notif-icon">{n.icon}</div>
      <div className="db-notif-body">
        <div className="db-notif-msg">{n.msg}</div>
        <div className="db-notif-meta">
          {n.portal==="vip"&&<span className="db-notif-badge vip">VIP</span>}
          {n.portal==="lead"&&<span className="db-notif-badge lead">LEAD</span>}
          {n.portal==="anonymous"&&<span className="db-notif-badge anon">PUBLIC</span>}
          <span className="db-notif-time">{isAr?"\u0627\u0644\u0622\u0646":"just now"}</span>
        </div>
      </div>
      <button className="db-notif-close" onClick={()=>setNotifications(prev=>prev.filter(x=>x.id!==n.id))}>✕</button>
    </div>
  ))}
</div>

    </div>
  );
}


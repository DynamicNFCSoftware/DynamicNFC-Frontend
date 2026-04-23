import { registerTranslations } from "../index";

const crmGateway = {
  en: {
    badge: "Live Demo Environment",
    tagline: "Dynamic NFC CRM Technology Demo",
    title: "Personalized Buyer Experiences",
    title2: "Powered by NFC",
    desc: "Experience how Dynamic NFC transforms luxury real estate sales with intelligent, personalized buyer portals. Each tap delivers a unique experience tailored to buyer preferences, interests, and stage in the journey.",

    stat1v: "47%", stat1l: "Higher Engagement",
    stat2v: "3.2×", stat2l: "Conversion Rate",
    stat3v: "Real-time", stat3l: "Analytics",

    sectionPortals: "Demo Portals",

    b1: "VIP Investor", c1t: "Khalid Al-Rashid Portal",
    c1d: "Elite investor experience with ROI-focused content, high-floor penthouse showcases, and investment analytics dashboard.",
    c1tags: ["ROI Calculator", "Penthouses", "Investment Tier"],

    b2: "Family Buyer", c2t: "Ahmed Al-Fahad Portal",
    c2d: "Premium family homebuyer experience highlighting family-friendly residences, school districts, and community amenities.",
    c2tags: ["3BR+ Units", "Schools", "Community"],

    b3: "Public Access", c3t: "Global Marketplace",
    c3d: "Anonymous and registered user browsing experience with adaptive content and lead capture based on engagement signals.",
    c3tags: ["Anonymous Browse", "Lead Capture", "Progressive Profile"],

    b4: "Analytics Dashboard", c4t: "CRM Intelligence",
    c4d: "Internal behavioral analytics and CRM dashboard showing real-time engagement metrics, lead scoring, content performance, and conversion funnels.",
    c4tags: ["Real-time Analytics", "Lead Scoring", "Behavior Tracking", "Conversion Funnels", "A/B Testing"],

    b5: "AI Automation", c5t: "AI Sales Pipeline",
    c5d: "Watch AI orchestrate Canva, Gmail, Google Calendar, and DocuSign to automate the entire sales pipeline — from personalized brochures to signed agreements in under 2 minutes.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "MCP"],

    howTitle: "How Dynamic NFC Works",
    howDesc: "Transform every buyer touchpoint into personalized engagement",
    s1t: "Tap to Connect", s1d: "Buyer taps their phone on an NFC-enabled surface at the sales center, model unit, or marketing material.",
    s2t: "Instant Recognition", s2d: "System identifies returning buyers or captures new leads, routing them to their personalized portal.",
    s3t: "Tailored Experience", s3d: "Content dynamically adapts to buyer preferences, showing relevant units, pricing, and amenities.",
    s4t: "Track & Optimize", s4d: "Every interaction feeds the analytics dashboard, enabling sales teams to prioritize and personalize follow-ups.",

    tech1: "NFC Technology", tech2: "QR Code Fallback", tech3: "AI Personalization", tech4: "CRM Integration",

    footer: "Demo environment for",
    footerLink: "Dynamic NFC",
    footerEnd: "technology showcase. No tracking on this gateway page.",
    langBtn: "العربية",
    homeBtn: "Home",
  },

  ar: {
    badge: "بيئة العرض التجريبي",
    tagline: "عرض تقنية إدارة علاقات العملاء من Dynamic NFC",
    title: "تجارب شراء مُخصَّصة",
    title2: "مدعومة بتقنية NFC",
    desc: "اكتشف كيف تُحوِّل Dynamic NFC مبيعات العقارات الفاخرة من خلال بوابات مشترين ذكية ومُخصَّصة. كل نقرة تُقدِّم تجربة فريدة مُصمَّمة وفقاً لتفضيلات المشتري واهتماماته ومرحلته في رحلة الشراء.",

    stat1v: "٤٧٪", stat1l: "تفاعل أعلى",
    stat2v: "٣.٢×", stat2l: "معدل التحويل",
    stat3v: "لحظي", stat3l: "تحليلات",

    sectionPortals: "البوابات التجريبية",

    b1: "مستثمر VIP", c1t: "بوابة خالد الراشد",
    c1d: "تجربة استثمارية نخبوية تتضمَّن محتوى مُركَّزاً على العائد الاستثماري، وعروض شقق البنتهاوس في الطوابق العليا، ولوحة تحليلات الاستثمار.",
    c1tags: ["حاسبة العائد", "بنتهاوس", "الفئة الاستثمارية"],

    b2: "مشترٍ عائلي", c2t: "بوابة أحمد الفهد",
    c2d: "تجربة شراء عائلية متميزة تُبرز الوحدات السكنية المناسبة للعائلات، والمناطق التعليمية، والمرافق المجتمعية.",
    c2tags: ["وحدات ٣ غرف فأكثر", "مدارس", "مرافق مجتمعية"],

    b3: "وصول عام", c3t: "السوق العالمي",
    c3d: "تجربة تصفُّح للزوار المجهولين والمسجَّلين مع محتوى تكيُّفي والتقاط بيانات العملاء المحتملين بناءً على مؤشرات التفاعل.",
    c3tags: ["تصفُّح مجهول", "التقاط العملاء المحتملين", "ملف تعريف تدريجي"],

    b4: "لوحة التحليلات", c4t: "الذكاء التحليلي لإدارة العملاء",
    c4d: "لوحة تحليلات سلوكية داخلية تعرض مقاييس التفاعل اللحظية، وتصنيف العملاء المحتملين، وأداء المحتوى، ومسارات التحويل.",
    c4tags: ["تحليلات لحظية", "تصنيف العملاء المحتملين", "تتبُّع السلوك", "مسارات التحويل", "اختبار A/B"],

    b5: "أتمتة بالذكاء الاصطناعي", c5t: "مسار المبيعات الذكي",
    c5d: "شاهد كيف يُنسِّق الذكاء الاصطناعي أدوات Canva وGmail وGoogle Calendar وDocuSign لأتمتة مسار المبيعات بالكامل — من الكتيبات المُخصَّصة إلى الاتفاقيات المُوقَّعة في أقل من دقيقتين.",
    c5tags: ["Canva", "Gmail", "Google Calendar", "DocuSign", "MCP"],

    howTitle: "آلية عمل Dynamic NFC",
    howDesc: "حوِّل كل نقطة تواصل مع المشتري إلى تفاعل مُخصَّص",
    s1t: "انقر للاتصال", s1d: "ينقر المشتري بهاتفه على سطح مُزوَّد بتقنية NFC في مركز المبيعات، أو الوحدة النموذجية، أو المواد التسويقية.",
    s2t: "تعرُّف فوري", s2d: "يتعرَّف النظام على المشترين العائدين أو يلتقط بيانات العملاء الجدد، ويُوجِّههم إلى بوابتهم المُخصَّصة.",
    s3t: "تجربة مُصمَّمة خصيصاً", s3d: "يتكيَّف المحتوى ديناميكياً مع تفضيلات المشتري لعرض الوحدات والأسعار والمرافق الأنسب.",
    s4t: "تتبَّع وحسِّن", s4d: "كل تفاعل يُغذّي لوحة التحليلات، مما يُمكِّن فِرَق المبيعات من تحديد الأولويات وتخصيص المتابعات.",

    tech1: "تقنية NFC", tech2: "رمز QR احتياطي", tech3: "تخصيص بالذكاء الاصطناعي", tech4: "تكامل مع نظام إدارة العملاء",

    footer: "بيئة عرض تجريبي لتقنية",
    footerLink: "Dynamic NFC",
    footerEnd: "— عرض تقني توضيحي. لا يتم تتبُّع أي بيانات في هذه الصفحة.",
    langBtn: "English",
    homeBtn: "الرئيسية",
  },
};

registerTranslations("crmGateway", crmGateway);
export default crmGateway;

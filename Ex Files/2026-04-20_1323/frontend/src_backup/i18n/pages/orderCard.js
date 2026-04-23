import { registerTranslations } from "../index";

const orderCard = {
  en: {
    /* ── Hero ── */
    overline: "PREMIUM NFC BUSINESS CARDS",
    heroTitle: "Smart Identity.\nPremium Presence.",
    heroSub:
      "Handcrafted from brushed metal, 24K gold, bamboo, and premium PVC. Each card carries NFC + QR — your entire professional identity in one tap.",
    ctaDesign: "Design Your Card",
    ctaExplore: "Explore All Cards",

    /* ── Card Preview ── */
    flipHint: "Hover to flip · Tap on mobile",

    /* ── Features ── */
    feat1: "NFC + QR",
    feat1d: "Instant contactless sharing with built-in QR fallback",
    feat2: "Premium Materials",
    feat2d: "Brushed metal, 24K gold, bamboo, wood, and PVC",
    feat3: "Made in Canada",
    feat3d: "Designed, engineered, and shipped from Canada",
    feat4: "No App Required",
    feat4d: "Works with any modern smartphone — zero setup",

    /* ── Stats ── */
    statsCards: "Card Types",
    statsCountries: "Countries",
    statsTap: "Tap to Share",
  },

  ar: {
    /* ── Hero ── */
    overline: "بطاقات الأعمال الفاخرة بتقنية NFC",
    heroTitle: "هُوية ذكية.\nحضور استثنائي.",
    heroSub:
      "مصنوعة يدويًّا من المعدن المصقول، والذهب عيار ٢٤ قيراطًا، والخيزران، والـ PVC الفاخر. تحمل كل بطاقة تقنيتَي NFC وQR — هويتك المهنية بالكامل بلمسة واحدة.",
    ctaDesign: "صمِّم بطاقتك",
    ctaExplore: "استعرض جميع البطاقات",

    /* ── Card Preview ── */
    flipHint: "مرِّر المؤشر للقلب · انقر على الهاتف",

    /* ── Features ── */
    feat1: "NFC + QR",
    feat1d: "مشاركة فورية لا تلامسية مع رمز QR احتياطي مدمج",
    feat2: "خامات فاخرة",
    feat2d: "معدن مصقول، وذهب عيار ٢٤ قيراطًا، وخيزران، وخشب، وPVC",
    feat3: "صُنع في كندا",
    feat3d: "تصميم وتطوير وشحن من كندا",
    feat4: "لا يتطلب تطبيقًا",
    feat4d: "يعمل مع أي هاتف ذكي حديث — دون أي إعداد مسبق",

    /* ── Stats ── */
    statsCards: "أنواع البطاقات",
    statsCountries: "دولة",
    statsTap: "انقر للمشاركة",
  },
};

registerTranslations("orderCard", orderCard);
export default orderCard;

// translations.js
// Shared bilingual translation system for all Al Noor Residences portals.
// Each portal adds its own keys on top of these shared ones.

export const sharedTranslations = {
  en: {
    // Common UI
    available: "Available", reserved: "Reserved", sold: "Sold",
    sf: "SF", br: "BR", ph: "PH",
    save: "Save", compare: "Compare", clear: "Clear",
    allProperties: "All Properties", penthouses: "Penthouses",
    bed2: "2 Bedroom", bed3: "3 Bedroom", bed4: "4 Bedroom",
    backToTower: "Back to Tower Selection",
    // Specs
    indoorSF: "Indoor", outdoorSF: "Outdoor", totalSF: "Total",
    // Modal tabs
    plans: "Plans", views: "Views", blueprints: "Blueprints",
    features: "Features", amenitiesTab: "Amenities",
    planDetails: "Plan Details",
    // Rooms
    kitchen: "Kitchen", bathroom: "Bathroom", living: "Living",
    bedrooms: "Bedrooms", penthouse: "Penthouse",
    // Compare
    compareProperties: "Compare Properties", selected: "selected",
    compareNow: "Compare Now", type: "Type",
    indoorSFLabel: "Indoor SF", outdoorSFLabel: "Outdoor SF",
    status: "Status", viewFullSize: "View Full Size",
    maxProperties: "Max 3 properties",
    selectAtLeast: "Select at least 2 properties",
    // Tower names
    towerQamar: "Al Qamar Tower", towerSafwa: "Al Safwa Tower", towerRawda: "Al Rawda Tower",
    // Amenities
    amPrivateElevator: "Private Elevator", amPool: "Pool", amPoolSpa: "Pool & Spa",
    amIndoorPool: "Indoor Pool", amConcierge247: "Concierge 24/7", amConcierge: "Concierge",
    amWineVault: "Wine Vault", amWineCellar: "Wine Cellar", amFitness: "Fitness",
    amFitnessCenter: "Fitness Center", amDaycare: "Daycare", amOnsiteDaycare: "On-site Daycare",
    amBBQ: "BBQ", amBBQDeck: "BBQ Deck", amBBQTerrace: "BBQ Terrace",
    amCoWorking: "Co-working", amBikeRoom: "Bike Room", amBusiness: "Business",
    amBusinessCenter: "Business Center",
    amParking1: "1 Parking", amParking2: "2 Parking", amParking3: "3 Parking", amParking4: "4 Parking",
    amPlayground: "Playground", amKidsClub: "Kids Club", amKidsLounge: "Kids Lounge",
    amKids: "Kids", amFamilyLounge: "Family Lounge", amLounge: "Lounge",
    amStudyRoom: "Study Room", amGarden: "Garden", amDogRun: "Dog Run",
    amStorageLocker: "Storage Locker", amHelipad: "Helipad Access",
    // Demo bar
    dbarKhalid: "Khalid VIP", dbarAhmed: "Ahmed Family",
    dbarMarket: "Marketplace", dbarDash: "Dashboard",
    // Toasts
    addedFavorites: "Added to favorites",
    pricingRequestSent: "Pricing request sent for",
    paymentPlanSent: "Payment plan request sent",
    floorPlanDownload: "Floor plan downloading...",
    viewingRequestSent: "Private viewing request sent!",
    // Footnotes
    artistRenderings: "*Artist renderings. Actual views may vary based on floor level and unit position.",
    archBlueprints: "*Architectural blueprints for reference. Final construction may have minor variations.",
  },
  ar: {
    available: "متاح", reserved: "محجوز", sold: "مباع",
    sf: "قدم²", br: "غ.ن", ph: "بنتهاوس",
    save: "حفظ", compare: "مقارنة", clear: "مسح",
    allProperties: "جميع العقارات", penthouses: "بنتهاوس",
    bed2: "غرفتين نوم", bed3: "٣ غرف نوم", bed4: "٤ غرف نوم",
    backToTower: "العودة إلى اختيار البرج",
    indoorSF: "داخلي", outdoorSF: "خارجي", totalSF: "إجمالي",
    plans: "المخططات", views: "المناظر", blueprints: "الرسومات",
    features: "المميزات", amenitiesTab: "المرافق",
    planDetails: "تفاصيل المخطط",
    kitchen: "المطبخ", bathroom: "الحمام", living: "المعيشة",
    bedrooms: "غرف النوم", penthouse: "بنتهاوس",
    compareProperties: "مقارنة العقارات", selected: "محدد",
    compareNow: "قارن الآن", type: "النوع",
    indoorSFLabel: "داخلي قدم²", outdoorSFLabel: "خارجي قدم²",
    status: "الحالة", viewFullSize: "عرض بالحجم الكامل",
    maxProperties: "الحد الأقصى ٣ عقارات",
    selectAtLeast: "حدد عقارين على الأقل",
    towerQamar: "برج القمر", towerSafwa: "برج الصفوة", towerRawda: "برج الروضة",
    amPrivateElevator: "مصعد خاص", amPool: "مسبح", amPoolSpa: "مسبح وسبا",
    amIndoorPool: "مسبح داخلي", amConcierge247: "كونسيرج 24/7", amConcierge: "كونسيرج",
    amWineVault: "قبو نبيذ", amWineCellar: "قبو نبيذ", amFitness: "لياقة",
    amFitnessCenter: "مركز لياقة", amDaycare: "حضانة", amOnsiteDaycare: "حضانة بالموقع",
    amBBQ: "شواء", amBBQDeck: "منطقة شواء", amBBQTerrace: "تراس شواء",
    amCoWorking: "عمل مشترك", amBikeRoom: "غرفة دراجات", amBusiness: "أعمال",
    amBusinessCenter: "مركز أعمال",
    amParking1: "1 موقف", amParking2: "2 موقف", amParking3: "3 موقف", amParking4: "4 موقف",
    amPlayground: "ملعب أطفال", amKidsClub: "نادي الأطفال", amKidsLounge: "صالة أطفال",
    amKids: "أطفال", amFamilyLounge: "صالة عائلية", amLounge: "صالة",
    amStudyRoom: "غرفة دراسة", amGarden: "حديقة", amDogRun: "منطقة الكلاب",
    amStorageLocker: "خزانة تخزين", amHelipad: "مهبط طائرات",
    dbarKhalid: "خالد VIP", dbarAhmed: "أحمد العائلي",
    dbarMarket: "السوق", dbarDash: "لوحة القيادة",
    addedFavorites: "تمت الإضافة للمفضلة",
    pricingRequestSent: "تم إرسال طلب التسعير لـ",
    paymentPlanSent: "تم إرسال طلب خطة الدفع",
    floorPlanDownload: "جاري تحميل المخطط...",
    viewingRequestSent: "تم إرسال طلب المعاينة الخاصة!",
    artistRenderings: "*رسومات فنية. قد تختلف المناظر الفعلية حسب مستوى الطابق وموقع الوحدة.",
    archBlueprints: "*رسومات معمارية للاستدلال. قد يكون هناك اختلافات طفيفة في البناء النهائي.",
  }
};

// Feature translations (kitchen, bathroom, living items)
export const featuresAr = {
  // Kitchen
  "Bulthaup kitchen":"مطبخ بولتهوب","Gaggenau appliances":"أجهزة غاغيناو","Wine cellar":"قبو نبيذ",
  "Private chef station":"محطة شيف خاصة","Outdoor kitchen":"مطبخ خارجي","Italian marble island":"جزيرة رخام إيطالي",
  "Sub-Zero refrigeration":"ثلاجة سب-زيرو","Wolf range":"موقد وولف","Butler pantry":"مخزن الخدمة",
  "Designer kitchen":"مطبخ مصمم","Premium appliances":"أجهزة فاخرة","Wine cooler":"مبرد نبيذ",
  "Breakfast bar":"بار إفطار","Executive kitchen":"مطبخ تنفيذي","Wolf appliances":"أجهزة وولف",
  "Wine fridge":"ثلاجة نبيذ","Compact kitchen":"مطبخ مدمج","Efficient kitchen":"مطبخ فعّال",
  "Quartz counters":"أسطح كوارتز","Gas range":"موقد غاز","Pantry":"مخزن",
  "Island":"جزيرة مطبخ","Island seating":"جزيرة بمقاعد","Double island":"جزيرتان",
  "Chef island":"جزيرة الشيف","Chef kitchen":"مطبخ الشيف","Luxury kitchen":"مطبخ فخم",
  "Family kitchen":"مطبخ عائلي","Full kitchen":"مطبخ كامل","Boutique kitchen":"مطبخ بوتيك",
  "Modern kitchen":"مطبخ عصري","Gourmet kitchen":"مطبخ ذواقة","Full appliances":"أجهزة كاملة",
  "Quartz island":"جزيرة كوارتز","Premium range":"موقد فاخر","Miele appliances":"أجهزة ميلي",
  "Gaggenau suite":"مجموعة غاغيناو","Wine room":"غرفة نبيذ","Breakfast nook":"ركن إفطار",
  // Bathroom
  "Spa sanctuary":"ملاذ سبا","Steam room":"غرفة بخار","Jacuzzi tub":"حوض جاكوزي",
  "Heated marble":"رخام مدفأ","Smart mirrors":"مرايا ذكية","Ensuite spa":"سبا داخلي",
  "Rain shower":"دش مطري","Freestanding tub":"حوض قائم","Spa bath":"حمام سبا",
  "Walk-in shower":"دش كبير","Double vanity":"حوضان مزدوجان","Master spa":"سبا رئيسي",
  "Guest bath":"حمام الضيوف","Powder room":"غرفة مسحوق","Heated floors":"أرضيات مدفأة",
  "Family bath":"حمام عائلي","Two baths":"حمامان","Soaker tub":"حوض نقع",
  "Glass shower":"دش زجاجي","Radiant floors":"أرضيات إشعاعية","Steam shower":"دش بخاري",
  "Dual sinks":"حوضان","Frameless shower":"دش بدون إطار","Jacuzzi":"جاكوزي",
  "En-suite":"حمام داخلي","Full bath":"حمام كامل","Ensuite":"حمام داخلي",
  "Ensuite bath":"حمام داخلي","Two full baths":"حمامان كاملان",
  // Living
  "Private pool":"مسبح خاص","Home theatre":"مسرح منزلي","Smart automation":"أتمتة ذكية",
  "Triple-height ceilings":"أسقف ثلاثية الارتفاع","Wraparound terrace":"تراس محيطي",
  "Media room":"غرفة ميديا","Climate zones":"مناطق مناخية","Open concept":"تصميم مفتوح",
  "Den":"غرفة مكتب","Smart home":"منزل ذكي","Open plan":"تصميم مفتوح","Balcony":"شرفة",
  "Storage":"تخزين","Smart layout":"تصميم ذكي","City views":"إطلالات المدينة",
  "Walk-in closet":"خزانة ملابس كبيرة","Art gallery walls":"جدران معرض فني",
  "Executive den":"مكتب تنفيذي","Flex space":"مساحة مرنة","Smart controls":"تحكم ذكي",
  "Home office":"مكتب منزلي","Juliet balcony":"شرفة جولييت","Terrace":"تراس",
  "Play area":"منطقة لعب","Library":"مكتبة","Panoramic views":"إطلالات بانورامية",
  "Rooftop terrace":"تراس سطح","Home cinema":"سينما منزلية","Walk-ins":"خزائن كبيرة",
  "Private terrace":"تراس خاص","Entertainment area":"منطقة ترفيه",
  "Good storage":"تخزين جيد","Designer finishes":"تشطيبات مصممة",
  "Climate control":"تحكم مناخي","Art display":"عرض فني","Art walls":"جدران فنية",
  "Home office/den":"مكتب منزلي","Den/office":"مكتب/غرفة","Walk-in closets":"خزائن كبيرة",
  "Open living":"معيشة مفتوحة","Smart home package":"حزمة منزل ذكي",
};

/**
 * Create a translation function for a specific portal
 * @param {string} lang - 'en' or 'ar'
 * @param {object} portalTranslations - Portal-specific translations {en:{...}, ar:{...}}
 */
export function createT(lang, portalTranslations = {}) {
  const shared = sharedTranslations[lang] || sharedTranslations.en;
  const portal = portalTranslations[lang] || portalTranslations.en || {};
  const merged = { ...shared, ...portal };
  return (key) => merged[key] || sharedTranslations.en[key] || portalTranslations.en?.[key] || key;
}

/**
 * Translate a feature name (kitchen/bathroom/living item)
 */
export function tFeature(name, lang) {
  if (lang === 'ar' && featuresAr[name]) return featuresAr[name];
  return name;
}

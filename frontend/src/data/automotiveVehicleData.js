// Phase 2b.Auto — region-keyed vehicle inventory (4 regions × 9 vehicles)

import collectionPerformanceImg from "../pages/AutomotiveDemo/assets/collection-amg.jpg";
import collectionSuvImg from "../pages/AutomotiveDemo/assets/collection-suv.jpg";
import collectionSedanImg from "../pages/AutomotiveDemo/assets/collection-sedan.jpg";

import amgGt63Img from "../pages/AutomotiveDemo/assets/amg-gt63.jpg";
import amgSl63Img from "../pages/AutomotiveDemo/assets/amg-sl63.jpg";
import g63Img from "../pages/AutomotiveDemo/assets/g63.jpg";
import gls600Img from "../pages/AutomotiveDemo/assets/gls600.jpg";
import s580Img from "../pages/AutomotiveDemo/assets/s580.jpg";
import maybachS680Img from "../pages/AutomotiveDemo/assets/maybach-s680.jpg";
import eqs580Img from "../pages/AutomotiveDemo/assets/eqs580.jpg";
import rangeRoverAutobiographyImg from "../pages/AutomotiveDemo/assets/range-rover-autobiography.jpg";
import lexusLx600Img from "../pages/AutomotiveDemo/assets/lexus-lx600.jpg";
import escaladeVImg from "../pages/AutomotiveDemo/assets/cadillac-escalade-v.jpg";
import rangeRoverSvImg from "../pages/AutomotiveDemo/assets/range-rover-sv.jpg";
import porscheTaycanTurboSImg from "../pages/AutomotiveDemo/assets/porsche-taycan-turbo-s.jpg";
import teslaModelSPlaidImg from "../pages/AutomotiveDemo/assets/tesla-model-s-plaid.jpg";
import bmw760iImg from "../pages/AutomotiveDemo/assets/bmw-760i.jpg";
import rollsRoyceGhostImg from "../pages/AutomotiveDemo/assets/rolls-royce-ghost.jpg";
import lucidAirSapphireImg from "../pages/AutomotiveDemo/assets/lucid-air-sapphire.jpg";
import porscheCayenneTurboGtImg from "../pages/AutomotiveDemo/assets/porsche-cayenne-turbo-gt.jpg";
import bmwX7M60iImg from "../pages/AutomotiveDemo/assets/bmw-x7-m60i.jpg";
import audiQ8EtronImg from "../pages/AutomotiveDemo/assets/audi-q8-etron.jpg";
import porscheCayenneTurboEhybridImg from "../pages/AutomotiveDemo/assets/porsche-cayenne-turbo-ehybrid.jpg";
import bentleyBentaygaEwbImg from "../pages/AutomotiveDemo/assets/bentley-bentayga-ewb.jpg";
import porscheTaycanTurboGtImg from "../pages/AutomotiveDemo/assets/porsche-taycan-turbo-gt.jpg";
import audiRsEtronGtImg from "../pages/AutomotiveDemo/assets/audi-rs-etron-gt.jpg";
import bmwI7M70Img from "../pages/AutomotiveDemo/assets/bmw-i7-m70.jpg";
import lucidAirGrandTouringImg from "../pages/AutomotiveDemo/assets/lucid-air-grand-touring.jpg";
import genesisG90Img from "../pages/AutomotiveDemo/assets/genesis-g90.jpg";

const IMG = {
  "g63": g63Img,
  "gls600-maybach": gls600Img,
  "range-rover-autobiography": rangeRoverAutobiographyImg,
  "lexus-lx600": lexusLx600Img,
  "maybach-s680": maybachS680Img,
  "s580": s580Img,
  "amg-gt63": amgGt63Img,
  "amg-sl63": amgSl63Img,
  "eqs580": eqs580Img,
  "escalade-v": escaladeVImg,
  "range-rover-sv": rangeRoverSvImg,
  "porsche-taycan-turbo-s": porscheTaycanTurboSImg,
  "tesla-model-s-plaid": teslaModelSPlaidImg,
  "bmw-760i": bmw760iImg,
  "rolls-royce-ghost": rollsRoyceGhostImg,
  "lucid-air-sapphire": lucidAirSapphireImg,
  "porsche-cayenne-turbo-gt": porscheCayenneTurboGtImg,
  "bmw-x7-m60i": bmwX7M60iImg,
  "audi-q8-etron": audiQ8EtronImg,
  "porsche-cayenne-turbo-ehybrid": porscheCayenneTurboEhybridImg,
  "bentley-bentayga-ewb": bentleyBentaygaEwbImg,
  "porsche-taycan-turbo-gt": porscheTaycanTurboGtImg,
  "audi-rs-etron-gt": audiRsEtronGtImg,
  "bmw-i7-m70": bmwI7M70Img,
  "lucid-air-grand-touring": lucidAirGrandTouringImg,
  "genesis-g90": genesisG90Img,
};

const COLORS_STD = [
  { name: { en: "Obsidian Black", ar: "أسود أوبسيديان", es: "Negro Obsidiana", fr: "Noir Obsidienne" }, hex: "#0a0a0a" },
  { name: { en: "Polar White", ar: "أبيض بولار", es: "Blanco Polar", fr: "Blanc Polaire" }, hex: "#f5f5f0" },
  { name: { en: "Selenite Grey", ar: "رمادي سيلينايت", es: "Gris Selenita", fr: "Gris Sélénite" }, hex: "#6b6e70" },
];

const INTERIORS_STD = [
  { name: { en: "Black Nappa Leather", ar: "جلد نابا أسود", es: "Cuero Nappa Negro", fr: "Cuir Nappa Noir" }, hex: "#1a1a1a" },
  { name: { en: "Macchiato Beige", ar: "بيج ماكياتو", es: "Beige Macchiato", fr: "Beige Macchiato" }, hex: "#c8b89a" },
];

function leaseFrom(price) {
  return Math.round(price * 0.0034);
}

function v(id, name, collection, priceLocal, currency, specs, opts = {}) {
  return {
    id,
    name,
    priceLocal,
    currency,
    collection,
    image: IMG[id] || g63Img,
    specs: {
      hp: specs.hp,
      accel: specs.accel,
      topSpeed: specs.topSpeed,
      engine: specs.engine || { en: "—", ar: "—", es: "—", fr: "—" },
      torque: specs.torque || "—",
      acceleration: specs.accel,
      drivetrain: specs.drivetrain || { en: "AWD", ar: "AWD", es: "AWD", fr: "AWD" },
    },
    features: opts.features || {
      en: ["Premium Sound System", "Adaptive Cruise Control", "Panoramic Roof", "Night Package"],
      ar: ["نظام صوت فاخر", "مثبت سرعة تكيفي", "سقف بانورامي", "حزمة Night"],
      es: ["Sistema de sonido premium", "Control de crucero adaptativo", "Techo panorámico", "Paquete Night"],
      fr: ["Système audio premium", "Régulateur adaptatif", "Toit panoramique", "Pack Night"],
    },
    familyFeatures: opts.familyFeatures || null,
    colors: opts.colors || COLORS_STD,
    interiors: opts.interiors || INTERIORS_STD,
    status: opts.status || "available",
    monthlyLease: leaseFrom(priceLocal),
    statusColor: opts.status === "reserved" ? "#b8860b" : "#2D8F6F",
  };
}

// ─── GULF — SAR ───────────────────────────────────────────────────
const GULF = [
  v("g63", { en: "Mercedes-AMG G 63", ar: "مرسيدس-AMG G 63", es: "Mercedes-AMG G 63", fr: "Mercedes-AMG G 63" }, "suv", 920000, "SAR",
    { hp: "577 HP", accel: "4.5s", topSpeed: "220 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "627 lb-ft", drivetrain: { en: "4MATIC", ar: "4MATIC", es: "4MATIC", fr: "4MATIC" } },
    { familyFeatures: { en: ["7 Seats Available", "Off-Road Family Adventures"], ar: ["٧ مقاعد متاحة", "مغامرات عائلية وعرة"], es: ["7 plazas disponibles", "Aventuras familiares off-road"], fr: ["7 places disponibles", "Aventures familiales tout-terrain"] } }),
  v("gls600-maybach", { en: "Mercedes-Maybach GLS 600", ar: "مرسيدس-مايباخ GLS 600", es: "Mercedes-Maybach GLS 600", fr: "Mercedes-Maybach GLS 600" }, "suv", 1070000, "SAR",
    { hp: "550 HP", accel: "4.9s", topSpeed: "250 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "538 lb-ft" },
    { status: "reserved", familyFeatures: { en: ["Executive Family Cabin", "Rear Entertainment"], ar: ["مقصورة عائلية تنفيذية", "ترفيه خلفي"], es: ["Cabina ejecutiva familiar", "Entretenimiento trasero"], fr: ["Cabine exécutive familiale", "Divertissement arrière"] } }),
  v("range-rover-autobiography", { en: "Range Rover Autobiography LWB", ar: "رينج روفر أوتوبيوغرافي LWB", es: "Range Rover Autobiography LWB", fr: "Range Rover Autobiography LWB" }, "suv", 950000, "SAR",
    { hp: "523 HP", accel: "5.1s", topSpeed: "250 km/h", engine: { en: "4.4L V8 Twin Turbo", ar: "4.4 لتر V8 توين توربو", es: "4.4L V8 Twin Turbo", fr: "4.4L V8 Twin Turbo" }, torque: "553 lb-ft" }),
  v("lexus-lx600", { en: "Lexus LX 600 VIP", ar: "لكزس LX 600 VIP", es: "Lexus LX 600 VIP", fr: "Lexus LX 600 VIP" }, "suv", 780000, "SAR",
    { hp: "409 HP", accel: "6.9s", topSpeed: "210 km/h", engine: { en: "3.5L V6 Twin Turbo", ar: "3.5 لتر V6 توين توربو", es: "3.5L V6 Twin Turbo", fr: "3.5L V6 Twin Turbo" }, torque: "479 lb-ft" }),
  v("maybach-s680", { en: "Mercedes-Maybach S 680", ar: "مرسيدس-مايباخ S 680", es: "Mercedes-Maybach S 680", fr: "Mercedes-Maybach S 680" }, "sedan", 1430000, "SAR",
    { hp: "621 HP", accel: "4.5s", topSpeed: "250 km/h", engine: { en: "6.0L V12 Biturbo", ar: "6.0 لتر V12 بايتوربو", es: "6.0L V12 Biturbo", fr: "6.0L V12 Biturbo" }, torque: "738 lb-ft" }),
  v("s580", { en: "Mercedes-Benz S 580 4MATIC", ar: "مرسيدس-بنز S 580 4MATIC", es: "Mercedes-Benz S 580 4MATIC", fr: "Mercedes-Benz S 580 4MATIC" }, "sedan", 660000, "SAR",
    { hp: "496 HP", accel: "4.4s", topSpeed: "250 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "516 lb-ft" }),
  v("amg-gt63", { en: "AMG GT 63 S E Performance", ar: "AMG GT 63 S E بيرفورمانس", es: "AMG GT 63 S E Performance", fr: "AMG GT 63 S E Performance" }, "performance", 920000, "SAR",
    { hp: "831 HP", accel: "2.9s", topSpeed: "316 km/h", engine: { en: "4.0L V8 Biturbo + Electric", ar: "4.0 لتر V8 بايتوربو + كهربائي", es: "4.0L V8 Biturbo + Eléctrico", fr: "4.0L V8 Biturbo + Électrique" }, torque: "1,033 lb-ft" }),
  v("amg-sl63", { en: "AMG SL 63 4MATIC+", ar: "AMG SL 63 4MATIC+", es: "AMG SL 63 4MATIC+", fr: "AMG SL 63 4MATIC+" }, "performance", 745000, "SAR",
    { hp: "577 HP", accel: "3.6s", topSpeed: "315 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "590 lb-ft" }),
  v("eqs580", { en: "Mercedes EQS 580 4MATIC", ar: "مرسيدس EQS 580 4MATIC", es: "Mercedes EQS 580 4MATIC", fr: "Mercedes EQS 580 4MATIC" }, "ev", 620000, "SAR",
    { hp: "516 HP", accel: "4.1s", topSpeed: "210 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "631 lb-ft" }),
];

// ─── USA — USD ──────────────────────────────────────────────────────
const USA = [
  v("escalade-v", { en: "Cadillac Escalade-V Series", ar: "كاديلاك إسكاليد-V", es: "Cadillac Escalade-V Series", fr: "Cadillac Escalade-V Series" }, "suv", 165000, "USD",
    { hp: "682 HP", accel: "4.4s", topSpeed: "200 km/h", engine: { en: "6.2L V8 Supercharged", ar: "6.2 لتر V8 سوبرتشارج", es: "6.2L V8 Supercharged", fr: "6.2L V8 Supercharged" }, torque: "653 lb-ft" }),
  v("range-rover-sv", { en: "Range Rover SV LWB", ar: "رينج روفر SV LWB", es: "Range Rover SV LWB", fr: "Range Rover SV LWB" }, "suv", 245000, "USD",
    { hp: "626 HP", accel: "4.4s", topSpeed: "250 km/h", engine: { en: "4.4L V8 Twin Turbo", ar: "4.4 لتر V8 توين توربو", es: "4.4L V8 Twin Turbo", fr: "4.4L V8 Twin Turbo" }, torque: "590 lb-ft" }),
  v("maybach-s680", { en: "Mercedes-Maybach S 680", ar: "مرسيدس-مايباخ S 680", es: "Mercedes-Maybach S 680", fr: "Mercedes-Maybach S 680" }, "sedan", 380000, "USD",
    { hp: "621 HP", accel: "4.5s", topSpeed: "250 km/h", engine: { en: "6.0L V12 Biturbo", ar: "6.0 لتر V12 بايتوربو", es: "6.0L V12 Biturbo", fr: "6.0L V12 Biturbo" }, torque: "738 lb-ft" }),
  v("porsche-taycan-turbo-s", { en: "Porsche Taycan Turbo S", ar: "بورش تايكان توربو S", es: "Porsche Taycan Turbo S", fr: "Porsche Taycan Turbo S" }, "ev", 225000, "USD",
    { hp: "750 HP", accel: "2.8s", topSpeed: "260 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "774 lb-ft" }),
  v("tesla-model-s-plaid", { en: "Tesla Model S Plaid", ar: "تسلا موديل S بليد", es: "Tesla Model S Plaid", fr: "Tesla Model S Plaid" }, "ev", 110000, "USD",
    { hp: "1,020 HP", accel: "2.1s", topSpeed: "322 km/h", engine: { en: "Tri-Motor Electric", ar: "ثلاثة محركات كهربائية", es: "Tracción tri-motor eléctrica", fr: "Trois moteurs électriques" }, torque: "1,050 lb-ft" }),
  v("bmw-760i", { en: "BMW 7-Series 760i xDrive", ar: "BMW الفئة السابعة 760i", es: "BMW Serie 7 760i xDrive", fr: "BMW Série 7 760i xDrive" }, "sedan", 140000, "USD",
    { hp: "536 HP", accel: "4.1s", topSpeed: "250 km/h", engine: { en: "4.4L V8 TwinPower Turbo", ar: "4.4 لتر V8 توين باور توربو", es: "4.4L V8 TwinPower Turbo", fr: "4.4L V8 TwinPower Turbo" }, torque: "553 lb-ft" }),
  v("rolls-royce-ghost", { en: "Rolls-Royce Ghost", ar: "رولز رويس غوست", es: "Rolls-Royce Ghost", fr: "Rolls-Royce Ghost" }, "sedan", 385000, "USD",
    { hp: "563 HP", accel: "4.6s", topSpeed: "250 km/h", engine: { en: "6.75L V12 Twin Turbo", ar: "6.75 لتر V12 توين توربو", es: "6.75L V12 Twin Turbo", fr: "6.75L V12 Twin Turbo" }, torque: "627 lb-ft" }),
  v("lucid-air-sapphire", { en: "Lucid Air Sapphire", ar: "لوسيد إير سافاير", es: "Lucid Air Sapphire", fr: "Lucid Air Sapphire" }, "ev", 250000, "USD",
    { hp: "1,234 HP", accel: "1.89s", topSpeed: "330 km/h", engine: { en: "Tri-Motor Electric", ar: "ثلاثة محركات كهربائية", es: "Tracción tri-motor eléctrica", fr: "Trois moteurs électriques" }, torque: "1,430 lb-ft" }),
  v("porsche-cayenne-turbo-gt", { en: "Porsche Cayenne Turbo GT", ar: "بورش كايين توربو GT", es: "Porsche Cayenne Turbo GT", fr: "Porsche Cayenne Turbo GT" }, "suv", 200000, "USD",
    { hp: "631 HP", accel: "3.3s", topSpeed: "300 km/h", engine: { en: "4.0L V8 Twin Turbo", ar: "4.0 لتر V8 توين توربو", es: "4.0L V8 Twin Turbo", fr: "4.0L V8 Twin Turbo" }, torque: "626 lb-ft" }),
];

// ─── MEXICO — MXN ─────────────────────────────────────────────────
const MEXICO = [
  v("range-rover-autobiography", { en: "Range Rover Autobiography LWB", ar: "رينج روفر أوتوبيوغرافي LWB", es: "Range Rover Autobiography LWB", fr: "Range Rover Autobiography LWB" }, "suv", 4800000, "MXN",
    { hp: "523 HP", accel: "5.1s", topSpeed: "250 km/h", engine: { en: "4.4L V8 Twin Turbo", ar: "4.4 لتر V8 توين توربو", es: "4.4L V8 Twin Turbo", fr: "4.4L V8 Twin Turbo" }, torque: "553 lb-ft" }),
  v("g63", { en: "Mercedes-AMG G 63", ar: "مرسيدس-AMG G 63", es: "Mercedes-AMG G 63", fr: "Mercedes-AMG G 63" }, "suv", 4600000, "MXN",
    { hp: "577 HP", accel: "4.5s", topSpeed: "220 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "627 lb-ft" }),
  v("bmw-x7-m60i", { en: "BMW X7 M60i", ar: "BMW X7 M60i", es: "BMW X7 M60i", fr: "BMW X7 M60i" }, "suv", 3200000, "MXN",
    { hp: "523 HP", accel: "4.5s", topSpeed: "250 km/h", engine: { en: "4.4L V8 TwinPower Turbo", ar: "4.4 لتر V8 توين باور توربو", es: "4.4L V8 TwinPower Turbo", fr: "4.4L V8 TwinPower Turbo" }, torque: "553 lb-ft" }),
  v("audi-q8-etron", { en: "Audi Q8 e-tron", ar: "أودي Q8 e-tron", es: "Audi Q8 e-tron", fr: "Audi Q8 e-tron" }, "ev", 2900000, "MXN",
    { hp: "402 HP", accel: "5.6s", topSpeed: "210 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "490 lb-ft" }),
  v("porsche-cayenne-turbo-ehybrid", { en: "Porsche Cayenne Turbo E-Hybrid", ar: "بورش كايين توربو E-Hybrid", es: "Porsche Cayenne Turbo E-Hybrid", fr: "Porsche Cayenne Turbo E-Hybrid" }, "suv", 3400000, "MXN",
    { hp: "729 HP", accel: "3.5s", topSpeed: "295 km/h", engine: { en: "4.0L V8 + Electric", ar: "4.0 لتر V8 + كهربائي", es: "4.0L V8 + Eléctrico", fr: "4.0L V8 + Électrique" }, torque: "700 lb-ft" }),
  v("maybach-s680", { en: "Mercedes-Maybach S 680", ar: "مرسيدس-مايباخ S 680", es: "Mercedes-Maybach S 680", fr: "Mercedes-Maybach S 680" }, "sedan", 7600000, "MXN",
    { hp: "621 HP", accel: "4.5s", topSpeed: "250 km/h", engine: { en: "6.0L V12 Biturbo", ar: "6.0 لتر V12 بايتوربو", es: "6.0L V12 Biturbo", fr: "6.0L V12 Biturbo" }, torque: "738 lb-ft" }),
  v("lexus-lx600", { en: "Lexus LX 600", ar: "لكزس LX 600", es: "Lexus LX 600", fr: "Lexus LX 600" }, "suv", 3000000, "MXN",
    { hp: "409 HP", accel: "6.9s", topSpeed: "210 km/h", engine: { en: "3.5L V6 Twin Turbo", ar: "3.5 لتر V6 توين توربو", es: "3.5L V6 Twin Turbo", fr: "3.5L V6 Twin Turbo" }, torque: "479 lb-ft" }),
  v("gls600-maybach", { en: "Mercedes-Maybach GLS 600", ar: "مرسيدس-مايباخ GLS 600", es: "Mercedes-Maybach GLS 600", fr: "Mercedes-Maybach GLS 600" }, "suv", 5700000, "MXN",
    { hp: "550 HP", accel: "4.9s", topSpeed: "250 km/h", engine: { en: "4.0L V8 Biturbo", ar: "4.0 لتر V8 بايتوربو", es: "4.0L V8 Biturbo", fr: "4.0L V8 Biturbo" }, torque: "538 lb-ft" }),
  v("bentley-bentayga-ewb", { en: "Bentley Bentayga EWB", ar: "بنتلي بنتايغا EWB", es: "Bentley Bentayga EWB", fr: "Bentley Bentayga EWB" }, "suv", 8200000, "MXN",
    { hp: "542 HP", accel: "4.6s", topSpeed: "290 km/h", engine: { en: "4.0L V8 Twin Turbo", ar: "4.0 لتر V8 توين توربو", es: "4.0L V8 Twin Turbo", fr: "4.4L V8 Twin Turbo" }, torque: "568 lb-ft" }),
];

// ─── CANADA — CAD ─────────────────────────────────────────────────
const CANADA = [
  v("tesla-model-s-plaid", { en: "Tesla Model S Plaid", ar: "تسلا موديل S بليد", es: "Tesla Model S Plaid", fr: "Tesla Model S Plaid" }, "ev", 165000, "CAD",
    { hp: "1,020 HP", accel: "2.1s", topSpeed: "322 km/h", engine: { en: "Tri-Motor Electric", ar: "ثلاثة محركات كهربائية", es: "Tracción tri-motor eléctrica", fr: "Trois moteurs électriques" }, torque: "1,050 lb-ft" }),
  v("porsche-taycan-turbo-gt", { en: "Porsche Taycan Turbo GT", ar: "بورش تايكان توربو GT", es: "Porsche Taycan Turbo GT", fr: "Porsche Taycan Turbo GT" }, "ev", 290000, "CAD",
    { hp: "1,019 HP", accel: "2.2s", topSpeed: "305 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "988 lb-ft" }),
  v("range-rover-autobiography", { en: "Range Rover Autobiography", ar: "رينج روفر أوتوبيوغرافي", es: "Range Rover Autobiography", fr: "Range Rover Autobiography" }, "suv", 245000, "CAD",
    { hp: "523 HP", accel: "5.1s", topSpeed: "250 km/h", engine: { en: "4.4L V8 Twin Turbo", ar: "4.4 لتر V8 توين توربو", es: "4.4L V8 Twin Turbo", fr: "4.4L V8 Twin Turbo" }, torque: "553 lb-ft" }),
  v("eqs580", { en: "Mercedes EQS 580 4MATIC", ar: "مرسيدس EQS 580 4MATIC", es: "Mercedes EQS 580 4MATIC", fr: "Mercedes EQS 580 4MATIC" }, "ev", 185000, "CAD",
    { hp: "516 HP", accel: "4.1s", topSpeed: "210 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "631 lb-ft" }),
  v("audi-rs-etron-gt", { en: "Audi RS e-tron GT", ar: "أودي RS e-tron GT", es: "Audi RS e-tron GT", fr: "Audi RS e-tron GT" }, "ev", 195000, "CAD",
    { hp: "637 HP", accel: "3.1s", topSpeed: "250 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "612 lb-ft" }),
  v("porsche-cayenne-turbo-ehybrid", { en: "Porsche Cayenne Turbo E-Hybrid", ar: "بورش كايين توربو E-Hybrid", es: "Porsche Cayenne Turbo E-Hybrid", fr: "Porsche Cayenne Turbo E-Hybrid" }, "suv", 215000, "CAD",
    { hp: "729 HP", accel: "3.5s", topSpeed: "295 km/h", engine: { en: "4.0L V8 + Electric", ar: "4.0 لتر V8 + كهربائي", es: "4.0L V8 + Eléctrico", fr: "4.0L V8 + Électrique" }, torque: "700 lb-ft" }),
  v("bmw-i7-m70", { en: "BMW i7 M70 xDrive", ar: "BMW i7 M70 xDrive", es: "BMW i7 M70 xDrive", fr: "BMW i7 M70 xDrive" }, "sedan", 235000, "CAD",
    { hp: "650 HP", accel: "3.5s", topSpeed: "250 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "749 lb-ft" }),
  v("lucid-air-grand-touring", { en: "Lucid Air Grand Touring", ar: "لوسيد إير غراند تورينغ", es: "Lucid Air Grand Touring", fr: "Lucid Air Grand Touring" }, "ev", 175000, "CAD",
    { hp: "819 HP", accel: "3.0s", topSpeed: "270 km/h", engine: { en: "Dual Electric Motors", ar: "محركان كهربائيان", es: "Motores eléctricos duales", fr: "Moteurs électriques doubles" }, torque: "885 lb-ft" }),
  v("genesis-g90", { en: "Genesis G90 Long Wheelbase", ar: "جينيسيس G90 قاعدة عجلات طويلة", es: "Genesis G90 Long Wheelbase", fr: "Genesis G90 Empattement Long" }, "sedan", 135000, "CAD",
    { hp: "409 HP", accel: "5.1s", topSpeed: "240 km/h", engine: { en: "3.5L V6 Twin Turbo", ar: "3.5 لتر V6 توين توربو", es: "3.5L V6 Twin Turbo", fr: "3.5L V6 Twin Turbo" }, torque: "405 lb-ft" }),
];

export const VEHICLES = { gulf: GULF, usa: USA, mexico: MEXICO, canada: CANADA };

export const SULTAN_IDS = {
  gulf: ["g63", "gls600-maybach", "range-rover-autobiography", "maybach-s680", "s580"],
  usa: ["escalade-v", "range-rover-sv", "maybach-s680", "bmw-760i", "rolls-royce-ghost"],
  mexico: ["range-rover-autobiography", "g63", "bmw-x7-m60i", "maybach-s680", "gls600-maybach"],
  canada: ["range-rover-autobiography", "eqs580", "bmw-i7-m70", "porsche-cayenne-turbo-ehybrid", "genesis-g90"],
};

export const COLLECTIONS = {
  performance: {
    id: "performance",
    name: { en: "AMG Performance", ar: "AMG الأداء", es: "AMG Performance", fr: "AMG Performance" },
    desc: { en: "Handcrafted engines. Pure driving emotion.", ar: "محركات مصنوعة يدويًا. شغف القيادة الخالصة.", es: "Motores artesanales. Emoción pura al volante.", fr: "Moteurs artisanaux. Émotion de conduite pure." },
    image: collectionPerformanceImg,
    accent: "#e63946",
  },
  suv: {
    id: "suv",
    name: { en: "Luxury SUV", ar: "SUV الفاخرة", es: "SUV de Lujo", fr: "SUV de Luxe" },
    desc: { en: "Command every road. Conquer every terrain.", ar: "تحكم بكل طريق. اغزُ كل تضاريس.", es: "Domina cada camino. Conquista todo terreno.", fr: "Maîtrisez chaque route. Conquérez tout terrain." },
    image: collectionSuvImg,
    accent: "#457b9d",
  },
  sedan: {
    id: "sedan",
    name: { en: "Executive Sedan", ar: "سيدان التنفيذية", es: "Sedán Ejecutivo", fr: "Berline Exécutive" },
    desc: { en: "Where luxury meets intelligence.", ar: "حيث يلتقي الفخامة بالذكاء.", es: "Donde el lujo encuentra la inteligencia.", fr: "Où le luxe rencontre l'intelligence." },
    image: collectionSedanImg,
    accent: "#b8860b",
  },
  ev: {
    id: "ev",
    name: { en: "Electric", ar: "كهربائية", es: "Eléctrico", fr: "Électrique" },
    desc: { en: "Silent power. Zero compromise.", ar: "قوة صامتة. بلا تنازلات.", es: "Potencia silenciosa. Sin compromisos.", fr: "Puissance silencieuse. Zéro compromis." },
    image: collectionSedanImg,
    accent: "#2ec4b6",
  },
};

export const COLLECTION_LABELS = {
  performance: COLLECTIONS.performance.name,
  suv: COLLECTIONS.suv.name,
  sedan: COLLECTIONS.sedan.name,
  ev: COLLECTIONS.ev.name,
};

export const STATUS_LABELS = {
  available: { en: "Available", ar: "متاح", es: "Disponible", fr: "Disponible" },
  reserved: { en: "Reserved", ar: "محجوز", es: "Reservado", fr: "Réservé" },
};

/** Localized field accessor — Phase 2b.RE crash-safe pattern */
export function vName(vehicle, lang) {
  return vehicle?.name?.[lang] ?? vehicle?.name?.en ?? "";
}

export function vColorName(color, lang) {
  return color?.name?.[lang] ?? color?.name?.en ?? "";
}

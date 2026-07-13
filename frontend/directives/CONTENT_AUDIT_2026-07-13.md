# CONTENT AUDIT — Site Geneli İçerik Denetimi (2026-07-13)

**Yöntem:** 3 paralel Claude ajanı, kaynak üzerinden (component + i18n), 4 mercek: marka dili · gerçeklik/güncellik · 4-dil paritesi · link/SEO sağlığı.
**Kapsam:** 10 core sayfa + 3 gateway + 9 demo portalı + config/veri dosyaları + SEO kapsaması.
**Sonuç:** 2 sayfa referans kalitede (YachtGateway, yacht veri katmanı), core sayfalarda ise KRİTİK sınıfında 5 sorun kümesi var.

---

## YÖNETİCİ ÖZETİ — 5 KRİTİK KÜME

### K1 — Yacht sektörü sitenin yarısında YOK (10+ konum)
Yacht canlı (`/yacht/demo`) ama şuralarda hiç geçmiyor:
| Konum | Dosya:satır |
|---|---|
| Home → Industries kartları (3 kart, yacht yok) | Home.jsx:781-822 |
| Home → Live Demo şeridi | Home.jsx:749-779 |
| Home → footNote ("real estate, automotive, and enterprise") | Home.jsx:151, :249(ar) |
| Enterprise → industry selector (All/RE/Auto) | Enterprise.jsx:334-341 |
| Enterprise → pilot form sektör dropdown | Enterprise.jsx:660-665 |
| Enterprise → heroSub + footer ("RE & Automotive") | Enterprise.jsx:17, :107 |
| Enterprise → SEO description | Enterprise.jsx:307 |
| Navbar → IndustriesDropdown menüsü | IndustriesDropdown.jsx:61-68 |
| ContactSales → sektör listesi (+role/project/units alanları) | ContactSales.jsx:338-343 |
| index.html → title + keywords + twitter:description | index.html:12,14,45 |
| CRMGateway → endüstri seçici (Oguzhan'ın tespiti ✓) | CRMGateway.jsx:339-376 |
| SEO.jsx → default description | SEO.jsx:5 |

### K2 — Fake metrikler hâlâ 4 yerde yaşıyor
| Konum | Metrik | Dosya:satır |
|---|---|---|
| Automotive landing (hero + ROI, ×2) | 4.1× / 52% / 100% | Automotive.jsx:66-68, 164-166, 350-352 |
| ROICalculator motor sabitleri + **"aggregated pilot data" iddiası** (pilot verisi yok — overpromise) | 0.47 / 3.2 / 0.52 / 0.68 | ROICalculator.jsx:122, 228 |
| Enterprise problem statları | 97% / 85% (+ Arapça ٩٧٪) | Enterprise.jsx:27, 109, 139, 200 |
| Home → uydurma vaka/testimonial ("14 high-intent buyers, two penthouses sold, 3 weeks" — Khalid Al-Rashid imzalı) | | Home.jsx:87, :202(ar) |

### K3 — CRMGateway: crash riski + en zayıf gateway
- `const t = T[lang]` **fallback'siz** → global dil es/fr iken runtime crash (CRMGateway.jsx:244). Auto/Yacht `|| T.en` guard'lı.
- Sadece en+ar; region switcher YOK, dil butonu YOK (Auto/Yacht'ta var).
- ~30 satır ölü auto-portal çevirisi; RE butonu inline, Auto butonu navigate (asimetri).
- Yacht girişi için hazır gereksinim listesi ajan raporunda (4 dilli etiketler + 4 portal kartı).

### K4 — Diller arası İÇERİK ÇELİŞKİLERİ (güven kırıcı)
| Konum | Çelişki | Dosya:satır |
|---|---|---|
| ContactSales bütçe skalası | EN: "Under $100,000 → $500,000+" / AR: "5.000$ → 50.000$+" (~20× fark!) | ContactSales.jsx:105 vs :198 |
| OrderCard AR hero | AR bloğu bambaşka bir sayfadan kopyalanmış, EN ile alakasız | OrderCardPage/i18n.js:92-94 |
| AIDemo proje adı | "Al Noor" vs "Vista" aynı senaryoda | AIDemo.jsx:163+ vs :62+ |
| AIDemo fiyat | AED 8.5M vs AED 12.5M aynı penthouse | AIDemo.jsx:47 vs :372 |
| AutoGateway AR dashboard etiketi | AR'de stale "Prestige Motors", EN bölge-nötr | AutoGateway.jsx:69 |

### K5 — SEO canonical hataları
| Sayfa | Yanlış canonical | Doğrusu |
|---|---|---|
| AutomotivePortal.jsx:440 | `/automotive` (**Automotive.jsx ile ÇAKIŞIYOR**) | `/automotive/demo/khalid` |
| SultanPortal.jsx:481 | `/sultan-portal` | `/automotive/demo/sultan` |
| PublicShowroom.jsx:379 | `/showroom` | `/automotive/demo/showroom` |
| AutoAIDemo.jsx:462 | `/auto-ai-demo` | `/automotive/demo/ai` |
| AIDemo.jsx:468 | `/ai-demo` | `/enterprise/crmdemo/ai-demo` |
| BuyerROICalculator.jsx:317 | `/roi-calculator` | `/enterprise/crmdemo/roi-calculator` |
| SEO'suz public sayfalar | ROICalculator, NFCWriteGuide | SEO ekle |

---

## SİSTEMİK BULGU — 4 dil aslında sadece portallarda var
Core site (Home/Enterprise/Developers/RealEstate/NFCCards/ContactSales/Navbar/Login/Automotive landing) **yalnızca en+ar**. es/fr yalnızca demo portallarında + YachtGateway'de. Navbar dil seçici de EN/ع. ROICalculator ise TEK dilli (sadece EN).
→ Bu bir sprint kararı gerektirir: es/fr core'a eklemek ~binlerce string'lik ayrı bir iş (Sprint G önerisi), K1-K5 ise ondan bağımsız hemen yapılabilir.

## OGUZHAN KARARLARI GEREKEN
1. **Tüzel unvan:** "DynamicNFC Software Inc." (common.js) vs "DynamicNFC Card Inc." (Home/NFCCards/CRMGateway footer) vs "DynamicNFC Technologies Pty Ltd." (OrderCard i18n!) — hangisi resmi?
2. **ContactSales bütçe skalası:** EN ($100K–$500K+) mi AR ($5K–$50K+) mi doğru?
3. **WhatsApp numaraları:** `16722008071` (CA) ve `966548888377` (Gulf — ama bayrak 🇦🇪, numara 🇸🇦) gerçek/doğrulanmış mı? Preview'da hâlâ `971XXXXXXXXX` placeholder var.
4. **es/fr core rollout:** şimdi mi, ayrı sprint mi (öneri: ayrı — Sprint G)?

---

## ORTA ÖNEM (fix sprint 2. dalga)
- "brochure/flyer" kelime ihlalleri: Enterprise.jsx:31,32,47,89 · Developers.jsx:36,40,50 · RealEstate.jsx:93,97,107
- Enterprise: metrik-ima eden inline etiketler ("Faster Decision Cycle") + yoğun emoji tonu (lüks B2B'ye aykırı)
- Home/Enterprise'da uydurma davranış sayıları ("viewed 3 times, 8 minutes") → niteliksele
- ContactSales footer "© 2025" (canlıda!) — ContactSales.jsx:431
- OrderCard "Free worldwide shipping" (UI-only akışta overpromise) + ölü StatsBar'da "40+ Countries"
- YachtAIDemo: sadece en/ar, sabit persona ("Prince Nasser"), sabit "SAR 38,000,000" (fmtCurrency bypass) — 9 portalın en zayıfı
- AIDemo: dahili hesap sızıntısı "ozzy@dynamiccrm.ca (353d13ef...)" ekranda; sabit tarih "March 12, 2026"
- PublicShowroom: es/fr bloklarında Gulf ismi "Ahmed Al-Rashid" placeholder sızıntısı; EN'de "+971 XX XXX XXXX"
- Ölü/stale i18n çiftleri: home.js (eski hero + "$4,800" fiyat!), nfcCards.js ("The Last Business Card" + "12+/40+"), enterprise.js (©2025), contactSales.js, orderCard.js, login.js, crmGateway.js — hepsi import ediliyor ama kullanılmıyor; yanlışlıkla bağlanırsa bayat fiyat/metin canlıya döner
- Ölü OrderCard bileşenleri: StatsBar/FeatureGrid/CardFlip/NavBar (index yalnızca Footer kullanıyor)

## DÜŞÜK ÖNEM (fırsat buldukça)
- Arapça gramer: VIPPortal:231 (هذا→هذه), :152 (يلتقي→تلتقي)
- Marketplace ziyaretçi rozeti 2 dilli ternary (:476)
- regionConfig Canada auto vip2: "Jennifer Laurent" ↔ `sarah@prestige.ca` uyumsuz (:138)
- AutoGateway avatar baş harfleri sabit "KM"/"SD" (:120)
- Emoji ikonlar (IndustriesDropdown 🏗🚗🏢) → çizgi ikon
- "Dynamic NFC" (boşluklu) yazımı demo dosyalarında; core "DynamicNFC" ✓
- RealEstate.jsx SEO'su render olmuyor (rota /developers'a redirect)
- CRMGateway kartları in-app Link, Auto/Yacht _blank (standartlaştır)

## TEMİZ ÇIKANLAR ✓
Retired rotalara link 0 · portal crossnav'ları /unified ✓ · RTL fiziksel CSS 0 · Arapça mojibake 0 · yacht veri katmanı 4 dilde native kalite · fmtCurrency disiplini (YachtAIDemo hariç) ✓ · Developers/RealEstate/NFCCards neredeyse yayına hazır · YachtGateway = referans standart.

---

## ÖNERİLEN PLAN
- **Sprint F1 (KRİTİK, ~1 gün Cursor):** K1 yacht everywhere + K2 fake metrik temizliği + K3 CRMGateway (guard+parite+yacht+switcher) + K4 çelişkiler (kararlar geldikten sonra) + K5 canonical'lar + ContactSales ©2025.
- **Sprint F2 (ORTA):** kelime hijyeni, ölü i18n/bileşen temizliği, YachtAIDemo bölgeselleştirme, AIDemo tutarlılık.
- **Sprint G (ayrı):** es/fr core rollout programı.

Directive'ler Oguzhan kararları (yukarıdaki 4 soru) netleşince yazılacak.

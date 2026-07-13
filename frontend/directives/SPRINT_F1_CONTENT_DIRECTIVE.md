# SPRINT F1 — Kritik İçerik Düzeltmeleri (Content Audit K1–K5)

**Author:** Claude (Cowork) · 2026-07-13 · Kaynak: `CONTENT_AUDIT_2026-07-13.md`
**Executor:** Cursor · Branch: `cursor/sprint-f1-content-critical`
**Onaylı kararlar:** Tüzel unvan = **"DynamicNFC Card Inc."** her yerde · ContactSales bütçe = **AR skalası doğru** (EN düzeltilecek) · WhatsApp numaraları **gerçek** (yorumlar temizlenir) · es/fr core rollout **Sprint G'ye** (bu sprintte core'a es/fr EKLENMEZ; yalnızca crash guard).

---

## F1.1 — Yacht everywhere (K1)

Aşağıdaki hazır kopyayı kullan (kendin yazma). Core sayfalar en+ar (mevcut yapıya uygun):

**Yacht endüstri metinleri:**
- en: title "Yacht Brokerage" · sub "Marinas, brokerages & charter fleets" · desc "Private marina experiences for owners and charter clients — every sea trial begins with a name."
- ar: title "وساطة اليخوت" · sub "المراسي والوساطة وأساطيل التأجير" · desc "تجارب مارينا خاصة للملّاك وعملاء التأجير — كل تجربة إبحار تبدأ باسم."

| Konum | Değişiklik |
|---|---|
| Home.jsx:781-822 | 4. Industries kartı: yacht (yukarıdaki kopya), link `/yacht/demo` (public `/yacht` landing yok — gateway'e) |
| Home.jsx:749-779 | Live Demo şeridine 3. kart: "Yacht Brokerage Demo" → `/yacht/demo` |
| Home.jsx:151, :249 | footNote: "...real estate, automotive, and yacht sales" / ar karşılığı "...العقارات والسيارات واليخوت" |
| Enterprise.jsx:334-341 | Industry selector'a `yacht` sekmesi; içerik varyantları RE/Auto pattern'iyle (idVipDesc_yacht vb. — kısa yacht varyantları yaz: sea trial / charter vocabulary, SAYISIZ) |
| Enterprise.jsx:660-665 | Pilot form dropdown'a `yacht_brokerage` seçeneği |
| Enterprise.jsx:17, :107 | heroSub + footer: üç sektör say |
| Enterprise.jsx:307 | SEO description'a yacht ekle |
| IndustriesDropdown.jsx:61-68 | Yacht öğesi → `/yacht/demo`, "NEW" rozetini Automotive'den Yacht'a taşı; çapa SVG ikonu (emoji YOK) |
| ContactSales.jsx:338-343 + role/project/units/challenge opsiyonları | `yacht_brokerage` sektörü + yacht koşullu alanları (project type: "Charter fleet / Brokerage / Marina") |
| index.html:12 | title: "DynamicNFC — Sales Velocity Engine for Real Estate, Automotive & Yacht" |
| index.html:14 | keywords'e: ", yacht CRM, yacht brokerage" |
| index.html:45 | twitter:description: "...for real estate, automotive & yacht." |
| SEO.jsx:5 | default description'a yacht ekle |

## F1.2 — Fake metrik finali (K2)

| Konum | Değişiklik |
|---|---|
| Automotive.jsx:66-68, 164-166, 350-352 | 4.1×/52%/100% → qualitative üçlü: Named / Every Buyer · Real-Time / Intent Signals · Zero / Guesswork (en+ar, AutoGateway pattern'i) |
| Enterprise.jsx:27 (+139 ar) | "97% of your website visitors..." → "Nearly all of your website visitors leave without ever identifying themselves." / ar: "يغادر معظم زوّار موقعك دون أن يعرّفوا عن أنفسهم أبداً." |
| Enterprise.jsx:109 (+200 ar) | "85% of showroom visitors..." → "Most showroom visitors browse anonymously." / ar uyarla |
| Home.jsx:87 (+202 ar) | Uydurma testimonial TAMAMEN değişir → hipotetik senaryo, isimsiz, sayısız: "Imagine your sales director opening the dashboard on a Monday morning — and seeing exactly which VIPs spent the weekend inside the floor plans, and which penthouse they kept returning to." / ar karşılığını aynı anlamda yaz. İmza satırı ("Khalid Al-Rashid, VP of Sales, Prestige Developments") SİLİNİR. |
| ROICalculator.jsx:122 | Sabitler kalır AMA UI'da görünür "Model assumptions (illustrative)" paneli olur: her çarpan etiketiyle listelenir |
| ROICalculator.jsx:228 | "aggregated pilot data" → "an illustrative model — not measured results. Your pilot will define your numbers." |
| ROICalculator.jsx:136,185 | Sonuç başlıklarına "Estimated" öneki + aralık dili |

Enterprise.jsx:47,115 davranış sayıları ("three times / 8 minutes / 12 minutes") → "again and again / long, focused minutes" tarzı niteliksel (en+ar).

## F1.3 — CRMGateway rehabilitasyonu (K3)

1. **Crash guard:** `const t = T[lang] || T.en;` (CRMGateway.jsx:244)
2. **Header parity:** YachtGateway'den region switcher (KSA/USA/MEX/CAN text kod pill'leri) + dil cycle butonu portla (`gw-` prefix'li CSS eşdeğerleri)
3. **Yacht endüstrisi:** 3. `gw-ind-btn` (çapa SVG) → `onClick={() => navigate('/yacht/demo')}` · etiketler en+ar (F1.1 kopyası)
4. **Simetri:** Auto butonu navigate kalır; ölü `autoPortals` dizisi + `ac1–ac5`/`ab1–ab5`/`descAuto` anahtarları SİLİNİR (~30 satır)
5. Kart açılışı: üç gateway de `target="_blank"` (CRMGateway Link→_blank'e çekilir)

## F1.4 — Çelişki düzeltmeleri (K4, kararlar işlenmiş)

| Konum | Değişiklik |
|---|---|
| ContactSales.jsx:105 | EN bütçe → AR skalasına eşitle: "Under $5,000 / $5,000–$15,000 / $15,000–$50,000 / $50,000+" |
| ContactSales.jsx:431 (+TR:125,210) | "© 2025" → "© 2026" |
| OrderCardPage/i18n.js:92-94 | AR hero EN ile eşitlenir: overline "اختر نوع بطاقتك" · heroTitle "رقمية أو مادية. القرار لك." · heroSub EN'in çevirisi |
| OrderCardPage/i18n.js:84,162 | "DynamicNFC Technologies Pty Ltd." → "DynamicNFC Card Inc." |
| i18n/common.js:56,149 | "DynamicNFC Software Inc." → "DynamicNFC Card Inc." (footer'larda tek unvan) |
| AIDemo.jsx | Proje adı TEK: "Al Noor Residences" (Vista geçen 8+ satır: 62/68/155/218/374/785/794/800) · Fiyat TEK: "AED 12,500,000" (47/103'teki 8.5M dahil) · :226 dahili hesap satırı ("ozzy@dynamiccrm.ca (353d13ef...)") maskelenir → "Account: connected ✓" · :799 sabit tarih dinamik now+7'ye bağlanır |
| AutoGateway.jsx:69 | AR c4t → "اللوحة الموحدة — ذكاء التاجر" (bölge-nötr) |
| WhatsAppButton.jsx:13,21 | "← Replace" yorumları silinir (numaralar onaylı-gerçek) · :20-27 bayrak 🇦🇪 → 🇸🇦 |
| WhatsAppPreview.jsx:113 | `971XXXXXXXXX` → `966548888377` (gerçek Gulf numarası) |

## F1.5 — SEO canonical + kapsama (K5)

| Dosya:satır | canonical → |
|---|---|
| AutomotivePortal.jsx:440 | `/automotive/demo/khalid` |
| SultanPortal.jsx:481 | `/automotive/demo/sultan` |
| PublicShowroom.jsx:379 | `/automotive/demo/showroom` |
| AutoAIDemo.jsx:462 | `/automotive/demo/ai` |
| AIDemo.jsx:468 | `/enterprise/crmdemo/ai-demo` |
| BuyerROICalculator.jsx:317 | `/enterprise/crmdemo/roi-calculator` |

+ `<SEO>` ekle: ROICalculator (`/sales/roi-calculator`), NFCWriteGuide (`/nfc-write-guide`) — üç-sektörlü, metriksis açıklamalar.

## Kapsam DIŞI (bu sprintte DOKUNMA)
es/fr core çevirileri (Sprint G) · "brochure/flyer" kelime hijyeni + emoji tonu + ölü i18n/bileşen temizliği + YachtAIDemo bölgeselleştirme (Sprint F2) · Admin/unified · seed/veri dosyaları.

## Verify (hepsi zorunlu)
1. `npm run build` PASS **ve** `npm test` PASS (ikisi de — log kanıtı).
2. Grep proofs:
   - `grep -rn "4\.1×\|52%\|97%\|85%\|14 high-intent\|penthouses sold" frontend/src` → 0
   - `grep -rn "aggregated pilot" frontend/src` → 0
   - `grep -rn "Software Inc\.\|Pty Ltd" frontend/src` → 0
   - `grep -rn "Vista Residences" frontend/src/pages/AIDemo` → 0
   - `grep -rn "XXXXXXXXX" frontend/src` → 0
   - `grep -c "yacht\|Yacht" frontend/index.html` ≥ 2
   - Canonical'lar: 6 dosyada yeni path grep'le doğrulanır
3. Runtime QA (dev): Home'da 4 endüstri + 3 canlı demo kartı · Enterprise selector 3 sekme · IndustriesDropdown'da Yacht · CRMGateway'de region pill + dil butonu + 3 endüstri, es dilinde CRASH YOK · ContactSales EN bütçe yeni skala + ©2026 · AIDemo tek isim/tek fiyat · 375px spot check.
4. İki atomik commit + PR + **commit hash'leri raporla** (hash'siz rapor = yapılmamış sayılır).

## Post-merge (Oguzhan)
PR'ı listede GÖR + merge → `git pull` → `npm run build` → `firebase deploy --only hosting` → bana haber: prod fetch doğrulaması benden.

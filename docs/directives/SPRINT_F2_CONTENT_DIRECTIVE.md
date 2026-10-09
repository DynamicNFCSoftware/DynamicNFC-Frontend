# SPRINT F2 — İçerik Orta-Önem Dalgası (Content Audit ORTA + ucuz DÜŞÜK)

**Author:** Claude (Cowork) · 2026-07-13 · Kaynak: `CONTENT_AUDIT_2026-07-13.md`
**Executor:** Cursor · Branch: `cursor/sprint-f2-content-medium`
**Kapsam DIŞI:** es/fr core rollout (Sprint G) · yeni özellik · seed/veri şemaları · `/admin`.

---

## F2.1 — Kelime hijyeni: "brochure / flyer" (marka sözlüğü)

Kural inceliği: **bizim ürünümüzü** tarif eden yerlerde yasak ("digital brochure" → "Private Buyer Experience"); **alıcı davranışını** tarif eden sinyal etiketleri ("Brochure Downloads" metriği) ve `download_brochure` EVENT ADI dokunulmaz.

| Konum | Değişiklik |
|---|---|
| Enterprise.jsx:31,32,47,89 | Ürün-tarifi geçişleri: "brochure" → "Private Buyer Experience" ekseninde yeniden yaz (en+ar çifti) |
| Developers.jsx:36,40,50 | Aynı kural |
| RealEstate.jsx:93,97,107 | Aynı kural |
| Grep sonrası kalan her ürün-tarifi kullanım | Aynı kural — sinyal etiketleri hariç |

## F2.2 — Enterprise ton düzeltmesi

1. Metrik-ima eden inline etiketler ("Faster Decision Cycle" vb. sayı çağrıştıran başlıklar) → düz yetenek dili (Named / Real-Time / Zero Guesswork ailesi), en+ar.
2. Emoji yoğunluğu: gövde metinlerindeki emojiler kaldırılır; ikon gereken yerde mevcut inline SVG seti kullanılır (lüks B2B tonu — CLAUDE.md "no emoji in product surfaces" ruhu).
3. Home'da kalan uydurma davranış sayıları varsa ("viewed X times / N minutes" kalıntısı — grep `"[0-9]+ (times|minutes)"`) → niteliksel.

## F2.3 — OrderCard dürüstlüğü + ölü bileşen temizliği

| Konum | Değişiklik |
|---|---|
| OrderCard copy: "Free worldwide shipping" | → "Shipping calculated at checkout" (en+ar) — sipariş akışı UI-only iken taahhüt verme |
| Ölü bileşenler: `OrderCardPage/{StatsBar,FeatureGrid,CardFlip,NavBar}.jsx` (+CSS) | SİL (index yalnızca Footer kullanıyor — silmeden önce import grep'iyle kanıtla; kullanılan çıkarsa SİLME, raporla) |
| StatsBar içindeki "40+ Countries / 12+ Industries" uydurmaları | Bileşen silinince kendiliğinden gider — başka yerde grep'le doğrula → 0 |

## F2.4 — YachtAIDemo bölgeselleştirme (9 portalın en zayıfı)

1. `TR` + `STEP_DESCS` es/fr blokları eklenir (yacht portalları zaten 4 dilli — parite tamamlanır; mevcut en/ar tonunda, Cursor çevirisi kabul, MT-kokusu olmasın).
2. Sabitler bölge-duyarlı olur: `OWNER` → `getPersonas("yacht", regionId)` vip1 · `VESSEL_PRICE`/terminal bütçe → sayısal + `fmtCurrency` · `MARINA` → aktif region'ın YACHTS[regionId][0].marina'sı · `TO_EMAIL` → persona.email.
3. `Lead Score: 94` sabiti → persona/seed'den türet ya da "Illustrative" rozetiyle işaretle.
4. Pattern referansı: AutomotivePortal'ın `usePortalRegion`/`getPersonaName` kullanımı.

## F2.5 — Ölü/bayat i18n temizliği (DİKKATLİ)

`src/i18n/pages/{home,nfcCards,enterprise,contactSales,orderCard,login,crmGateway}.js` içinde sayfaların artık tüketmediği bayat bloklar var (örn. home.js eski hero + **"$4,800" fiyat**, nfcCards.js "12+/40+", enterprise.js ©2025).

Prosedür (her dosya için ayrı ayrı):
1. `useTranslation('<ns>')` tüketicilerini grep'le bul; hangi key'ler gerçekten `t('...')` ile çağrılıyor listele.
2. Çağrılmayan key'leri sil; çağrılan HİÇBİR key'e dokunma.
3. Dosya başına diff raporu (silinen key sayısı). Şüphede → silme, raporla.
Ayrıca `src/shared/translations.js` ve `src/translations/*.json` bu sprintte DOKUNULMAZ (ayrı legacy kalem).

## F2.6 — Ucuz DÜŞÜK paketi

| Konum | Değişiklik |
|---|---|
| VIPPortal_Definitive.jsx:231, :152 | Arapça gramer: `هذا بوابة` → `هذه بوابة` · `يلتقي الرؤية` → `تلتقي الرؤية` |
| MarketplacePortal.jsx:476 | Ziyaretçi rozeti 2-dilli ternary → 4 dilli t-key (PublicShowroom pattern'i) |
| regionConfig.js:138 | Canada auto vip2 e-posta `sarah@prestige.ca` → `jennifer@prestige.ca` |
| AutoGateway.jsx:120 | Sabit "KM"/"SD" avatar harfleri → persona adından türet (`name.split(' ').map(w=>w[0])`) |
| IndustriesDropdown.jsx | Kalan 🏗🚗🏢 emojileri → inline SVG ikonlar (yacht çapasıyla aynı stil) |
| PublicShowroom.jsx:64,180,238 | es/fr placeholder'lardaki Gulf ismi "Ahmed Al-Rashid" → bölge-nötr "e.g. Alex Martin" tarzı; en `phonePh` "+971..." → bölge-nötr |
| YachtVIPPortal.jsx nav | Diğer portallarla tutarlılık: `/unified` crossnav linki ekle (4 dilli etiket, VIPPortal:667 pattern'i) |
| Demo dosyalarında "Dynamic NFC" (boşluklu) | → "DynamicNFC" (yalnızca marka adı geçişleri; cümle içi "Dynamic NFC technology" tarifleri kalabilir — grep + insan-göz listesi raporla) |

## Verify (hepsi zorunlu)
1. `npm run build` PASS **ve** `npm test` PASS — log kanıtı.
2. Grep proofs: ürün-tarifi "brochure/flyer" → 0 (sinyal etiketi/event adı istisnaları raporda listelenir) · "$4,800" → 0 · "40+ Countries" → 0 · "Free worldwide shipping" → 0 · YachtAIDemo'da "SAR 38,000,000"/"Prince Nasser" sabiti → 0 · OrderCard ölü bileşen import'u → 0.
3. Runtime QA: `/yacht/demo/ai` 4 region × dil cycle (persona/fiyat/marina değişiyor) · Enterprise emoji'siz ve okunur · OrderCard akışı kırılmadı · Marketplace rozeti es/fr'de yerelleşmiş · 375px spot.
4. İki atomik commit + PR + **hash raporu**. PR linki gerçek olacak (listede görünecek).

## Post-merge ritüeli (Oguzhan)
"**Merged rozetini gördüm**" → `git pull` → `npm run build` → `firebase deploy --only hosting` → Claude prod fetch doğrulaması.

# CLAUDE_HANDOFF.md

**Last updated:** 2026-07-15 — **Sprint AI-2 EXECUTED (Cursor, branch `sprint/ai-2-auto-yacht-aidemo`).** Taxonomy: `lead_captured`→`request_pricing` (all 3 AI demos + global alias); auto `contact_agent`/`contact_advisor`/`lead_captured` sector aliases. Shared `services/aiDemoShared.js`; Auto full AI-1 pattern (`autoAiDemoData.js` + 7-step AutoAIDemo + portal banner); Yacht additive (whatsapp+crm, 6 fires, send-to-self, banner). Build PASS + `npm test` 121 pass. Greps: Khalid/AED/G63/Riyadh=0 in AutoAIDemo; lead_captured=0 in *AIDemo*; Five actions=0; trackPortalEvent×6 Auto; trackEvent×6 Yacht. **Sıradaki adım:** Claude audit → merge AI-1+AI-2 → Oguzhan build+hosting deploy → runtime QA (Auto Canada+Gulf, Yacht USA+Gulf, Unified sector switch).

**Önceki güncelleme (5.):** 2026-07-14 — **Sprint AI-1 Claude AUDIT: PASS + 1 kritik düzeltme.** Cursor teslimi (`0ad36669`) kod düzeyinde temiz; SAR adaptasyonu doğru karar (eski AED brand-config'e aykırı driftmiş). **Yakalanan hata: `trackPortalEvent('ai_demo', …)` — dashboard KPI'ları ve Sales Trigger'lar `portalType==='vip'` sayar; 'ai_demo' ile VIP Sessions/trigger yanmazdı. Claude working tree'de 6 çağrıyı 'vip'e çevirdi — provenance `source:'ai_demo'` metadata'sında duruyor. BU TEK SATIRLIK FİX COMMIT BEKLİYOR (branch'e squash'lenmeli).** Runtime QA (Claude, localhost USA region): James Mitchell/Seven actions/0-7 ✓, AED-Khalid sıfır ✓, tracking event → Firestore → **Unified Overview feed'de James Mitchell canlı göründü, KPI'lar doldu — tap→trigger zinciri uçtan uca ÇALIŞIYOR.** Kalan manuel QA (aktif sekmede — arka plan sekmesinde Chrome timer throttle animasyonu dondurur): full pipeline görsel, wa.me tıklaması, AR/dark/375px, `?vip_pricing=unlocked` banner, 4-region turu.

**Önceki güncelleme (4.):** 2026-07-14 — **SPRINT AI-1 EXECUTED (Cursor, branch `sprint/ai-1-aidemo-region-tracking`).** AIDemo region-aware (`aiDemoData.js` compose), tracking bridge (6 `trackPortalEvent` fires; CRM not tracked), WhatsApp+CRM steps (7/7), send-to-self, NDA→`?vip_pricing=unlocked` VIPPortal banner, footer yacht + DocuSign sandbox copy + dashboard CTA. Build PASS + `npm test` 121 pass. Pre-flight note: `regionConfig` has no city field — cities composed in `aiDemoData.js` (Riyadh/NY/Mexico City/Vancouver); Gulf currency via `formatCurrency` = **SAR** (not AED). **Sıradaki adım:** Claude audit → merge → Oguzhan `npm run build` + hosting deploy → runtime QA (4 regions × EN/AR + Unified feed).

**Önceki güncelleme (3.):** 2026-07-14 — **Audit fix'leri LIVE (Oguzhan doğruladı: "çok iyi çalışıyor", 4 deploy adımı tamam). Yeni sprint hazır: `frontend/directives/AI_DEMO_SPRINT_AI1_DIRECTIVE.md`** — AIDemo canlı inceleme (pipeline 7/7 koşuldu, kod okundu) sonucu: tracking YOK (Demo Tracking Rule ihlali — tek istisna sayfa), Gulf-hardcoded (Khalid/AED tüm region'larda), lokal footer'da yacht eksik, DocuSign dev-speak. Directive kapsamı: WP-1 `aiDemoData.js` (compose from regionConfig+realEstateUnitData, duplicate YOK), WP-2 TR dict parametrizasyonu (`fill()` helper), WP-3 mevcut event taksonomisine map'li tracking (book_viewing → Viewings Booked KPI = iki-ekran demo anı; CRM adımı bilinçli TRACK EDİLMEZ), WP-4 iki yeni adım (WhatsApp wa.me gerçek link + CRM payload kartı; hero "Seven actions"), WP-5 send-to-self, WP-6 NDA→portal `?vip_pricing=unlocked` banner + follow-up guard kartı, WP-7 footer yacht + DocuSign copy + dashboard CTA. Out-of-scope: es/fr (Sprint G), Auto/Yacht AIDemo parity (sonraki). **Sıradaki adım:** Oguzhan directive'i Cursor'a verir → rapor Claude audit'ine döner.

**Önceki güncelleme (2.):** 2026-07-14 — **AUDIT FIX SPRINT'İ LOKALDE TAMAM (Claude/Cowork, Cursor'suz).** C1 kök nedeni CANLIDA teşhis edildi: **prod'daki Firestore rules ≠ repo rules — tenant subcollection CREATE reddediliyor** (kanıt: owner hesabıyla "+ Add Deal" → permission-denied; dailyBrief READ çalışıyor; repo rules aynı yazmaya izin veriyor). Seed her yüklemede patlıyor → tenant boş → dashboard 0. **Ana fix tek komut: `firebase deploy --only firestore:rules`** (Oguzhan, host). Kod düzeltmeleri (lokal, uncommitted): A1 çift navbar (`CreatePhysicalCard` lokal nav söküldü + global `useLanguage()` + 1537 NUL byte temizliği), A2 `useAdmin` permission-denied sessiz + rules'ta kendi admin kaydını `get` izni, C1-yan `createTenantDeal` sector/region stamping + PipelineTab explicit geçiş + AddDealModal currency prop, B1 9 dosyada footer → "DynamicNFC Card Inc.", B4 yacht demo kartı kopya metni (EN+AR yeniden yazıldı). B3 (Canva "C") bug değil — bilinçli SVG; B7 (SEO title) repo'da zaten var, deploy sonrası doğrulanacak. Detay: `docs/SITE_AUDIT_2026-07-14.md` C1 bölümü. **Sıradaki adım:** Oguzhan lokal `npm run build` + dev QA → rules deploy → dashboard'a giriş (seed otomatik koşar) → hosting deploy. Önceki güncelleme aşağıda.

**Önceki güncelleme (1.):** 2026-07-14 — **Canlı site audit'i yapıldı → `docs/SITE_AUDIT_2026-07-14.md`.** 15+ sayfa/portal Chrome ile gezildi. 3 gerçek bug (çift navbar `/create-physical-card`, `useAdmin` Firestore permission konsol hatası, `/yacht` landing 404), 9 içerik/tutarlılık bulgusu (unvan `/enterprise+/contact-sales` footer'larında eski, `info@dynamicnfc.help` domain uyuşmazlığı, Canva logo fallback, AR nav/dilbilgisi, kalan emoji+SEO title'lar) + **1 kritik doğrulanmış bug: Unified Overview metrikleri 0 — demo tracking dashboard'u BESLEMİYOR (Oguzhan onayladı, bilerek değil; 07-04 enrichPortalEvent fix'ine regresyon şüphesi).** Karar: fix'ler önce LOKAL, Oguzhan inceler, sonra live. Geri dönüş noktası: `pre-audit-fixes-2026-07-14` tag (host'ta atılacak — sandbox git CRLF hayaleti gösterdi, audit dosyası §E'de komutlar) + Cowork outputs'ta kod zip'i. Pozitif: legacy redirect'ler, region/RTL/persona sistemi, link sağlığı temiz. Önceki güncelleme (2026-07-13, Sprint F1/F2) aşağıda korunuyor.

**Önceki güncelleme:** 2026-07-13 (2. güncelleme) — **SPRINT F1 CANLIDA: site içeriği üç-sektörlü ve dürüst.** Tam içerik audit'i (3 paralel ajan, 40+ bulgu → `CONTENT_AUDIT_2026-07-13.md`) → Sprint F1 (PR #16: `948992c4`+`43791d31`): yacht 12 konuma eklendi (Home/Enterprise/Navbar/ContactSales/CRMGateway/index.html/SEO), son fake metrikler temizlendi (Automotive 4.1×/52%, Enterprise 97%/85%, Home uydurma testimonial, ROICalculator "aggregated pilot data" iddiası), CRMGateway crash guard + region/lang switcher + yacht, tüzel unvan tekleşti (**DynamicNFC Card Inc.** — Oguzhan kararı), ContactSales EN/AR bütçe skalası eşitlendi ($5K–$50K+, AR doğruydu), WhatsApp numaraları onaylandı-gerçek, 6 SEO canonical düzeltildi. Prod fetch doğrulaması: title/keywords/twitter üç sektör ✓. **Sprint F2 de aynı gün CANLIDA** (PR #17: `a5dab6ce`+`849df789` — brochure hijyeni, Enterprise ton, OrderCard dürüstlüğü + 4 ölü bileşen, YachtAIDemo tam bölgeselleştirme, bayat i18n temizliği, DÜŞÜK paketi; Claude audit PASS, prod Chrome doğrulaması: "Shipping calculated at checkout" + "© 2026 DynamicNFC Card Inc." canlı metinde görüldü). İçerik audit'inin KRİTİK+ORTA katmanları tamamen kapandı — kalan: Sprint G (es/fr core) + DÜŞÜK kırıntılar. Önceki güncelleme (FAZ 5 + yat fotoğrafları) aşağıda korunuyor. PR #15 (`171518b`, Sprint E: legacy Dashboard+AutoDashboard silindi → `/unified` redirect, -4591L, ordercard.css route-split ile ana CSS 134→45KB, region-aware AI timezone, Home/Enterprise fake-metrik temizliği) + PR #13 (`281700a`, index.html meta + AutoGateway qualitative + header parity) merge + build'li deploy. 32 AI-üretimi yat fotoğrafı (Claude: optimize 43→7MB + IMG map + koşullu render; Cursor screenshot QA: 0 broken/0 silhouette). Prod meta doğrulandı: "Named, Real-Time, Zero Guesswork".
**Session:** Cowork (Claude) + Cursor, 2026-07-09/13 — Sprint E directive → Cursor execute → CI kırmızı krizi (Claude teşhis: FAZ5'in AIDemo `useRegion`'ı test'te provider'sız → 8 FAIL; fix Claude'da doğrulandı, Cursor push) → PR kuyruğu çözümü (#14 hayalet PR'dı → #15 açıldı; #13 rebase) → deploy + prod fetch doğrulaması.
**Author of this update:** Claude (Cowork)

---

## ▶︎ RESUME HERE — FAZ 5 kapandı, teknik yol haritası bitti (2026-07-13)

**Ürün durumu:** 3 sektör × 4 region, tek analytics yüzeyi (`/unified`), çalışan canlı tracking, fotoğraflı yacht demo, sıfır fake metrik, -4591 satır legacy. Teknik borç listesindeki büyük kalemler (legacy dashboards, ordercard.css, tracking birleştirme, blinq efsanesi) kapandı.

### Next session first move — artık SATIŞ
1. **Pilot outreach** — teknik VE içerik bahanesi kalmadı. Canada RE one-pager v1 hazır; Claude Design v2 + design system süreci devam ediyor (`CANADA_ONEPAGER_DESIGN_BRIEF.md`). Hedef liste + outreach e-postası + demo akışı paketi: Claude scope. Not: unvan artık **DynamicNFC Card Inc.** — one-pager v1'deki "Software Inc." footer'ı v2'de düzeltilecek.
2. **Sprint F2 (ORTA içerik)** — `CONTENT_AUDIT_2026-07-13.md` ORTA bölümü: brochure/flyer kelime hijyeni, Enterprise emoji tonu, ölü i18n/bileşen temizliği (bayat "$4,800" fiyatlı home.js blokları dahil), YachtAIDemo bölgeselleştirme, AIDemo hesap sızıntısı maskesi. Directive Claude'dan.
3. **Sprint G (BÜYÜK)** — es/fr core rollout (~binlerce string; core sayfalar bugün en+ar). Onaylı karar: ayrı sprint.
4. **CLAUDE.md tazeleme** — §6 route tabloları, §9 yacht CANLI, §10 Asia/Dubai kapandı, §14 tech-debt işaretleri + tüzel unvan (Card Inc.).
5. **Hijyen:** Nisan draft PR #1/#2 kapat · `shareholders/` kararı · Unified topbar bayrak emoji (Windows) kontrolü · eski directive'lerin historical-trail commit'i.

### Lesson (2026-07-13, 2. güncelleme)
- **"done" ≠ merge — ÜÇÜNCÜ kez.** PR #16 da merge'süz deploy edildi; fark prod fetch doğrulamasında yakalandı. İşleyen protokol netleşti: Oguzhan "Merged rozetini gördüm" yazana kadar deploy sayılmaz; Claude her deploy sonrası `.web.app` kanalından fetch'le somut string doğrular. Bu iki adım artık kalıcı ritüel.
- **İçerik de altyapı gibi audit ister.** Kod yol haritası bitmişken sitede 40+ içerik bulgusu vardı (yacht 12 yerde eksik, 4 fake metrik yuvası, EN/AR 20× bütçe çelişkisi, 3 farklı tüzel unvan). Yeni kural: her sektör/özellik lansmanından sonra sayfa-sayfa içerik taraması sprint kapanış maddesidir.

### Lessons added (2026-07-09/13)
- **"PR açıldı" da doğrulanacak claim'dir.** Cursor'un verdiği PR #14 linki hiç var olmamıştı; branch push'luydu ama PR açılmamıştı. Kural: rapor linkine tıkla, PR listesinde gör, sonra "var" say.
- **Cursor verify = build + TEST.** Sprint E branch'inde CI 3 gün kırmızıydı; "build PASS" raporu doğruydu ama `npm test` hiç koşulmamıştı (AIDemo `useRegion` provider'sız → 8 FAIL). Directive'lerin "Bitti sayılır" bölümüne test kanıtı zorunlu.
- **Deploy zinciri checklist'i:** açık PR var mı? → merge → pull → BUILD → deploy → prod'u ayrı kanaldan fetch'le doğrula (`.web.app` URL'i custom-domain CDN cache'ini bypass eder — bugün dynamicnfc.ca eski gösterirken .web.app yeniyi gösterdi).
- **Component'e context hook eklersen o component'in TESTLERİNE provider ekle** — FAZ5 dersinin genel hali.

---

## ✅ CLOSED — Sprint D + tracking pipeline kapandı (2026-07-04)

**Yacht sektörü canlıda, 3 sektör × 4 region parity + canlı demo tracking artık gerçekten çalışıyor.** Bugünün ikinci dalgası kritik bir ürün bug'ını kapattı: portal event'leri `sector`/`region` alanı olmadan yazılıyordu → Unified analytics HİÇBİR canlı portal aksiyonunu göstermiyordu (tüm sektörlerde; Sprint C QA'i yakalamamıştı çünkü toast'lar BroadcastChannel'dan gelir). Fix zinciri: write-time tagging (`enrichPortalEvent`), read-time strict filter (`resolveEventRegionStrict` — explicit region veya vipId'den kurtarma; etiketsizler düşer, aktif region'a SIZMAZ), yacht funnel/heatmap taksonomisi (AUTOMOTIVE mirasını override), VIP CRM persona allowlist.

### Next session first move
1. **Prod doğrulama (5 dk):** Gulf VIP CRM'de sadece Prince Nasser + Sheikh Omar; Robert MacKenzie sadece Canada'da; Gulf'ta yeni tıklama Canada'ya sızmıyor; yacht Analytics'te "Marina Visit → Sea Trial Request" funnel'ı. Metada "3.2×" yok.
2. **Yat görselleri** — `frontend/directives/YACHT_IMAGE_BRIEF.md`: 32 vessel, dosya adı + Artistly prompt hazır. Görseller `pages/YachtDemo/assets/`e düştükçe IMG map bağlama 15 dk'lık Cursor işi (silhouette fallback boşlukları örter, batch OK).
3. **Sprint E — FAZ 5** — legacy dashboard retire + AutoDashboard `nameAr` + AutoAIDemo/`autoGoogleLiveApi` `Asia/Dubai` timezone kalıntısı + **kalan fake metrikler** (`Enterprise.jsx`, `home.js`/`crmGateway.js` i18n — AutoDashboard'unkiler retire ile kendiliğinden gider).
4. **Pilot outreach** — Canada RE one-pager v1 hazır (`DynamicNFC_Canada_RE_OnePager.pdf`); Claude Design'da premium v2 için brief (`CANADA_ONEPAGER_DESIGN_BRIEF.md`) + design system kurulumu başladı.
5. **Docs commit (main'de):** eski Phase2c / SPRINT2_3 / SPRINT_B directive'leri + `scripts/phase2c_refactor_portals.py` hâlâ untracked — tek `docs(directives): historical trail` commit'i. `shareholders/` klasörü hâlâ tanımsız, Oguzhan'a sor. Unified topbar ülke seçicisinde bayrak emoji kontrolü (Windows).

### Lessons added (2026-07-03/04)
- **Cursor "yapıldı/fixed" ≠ commit'lendi — İKİ KEZ yakalandı.** Tracking fix'i ve taxonomy fix'i working tree'de bırakılıp "deploy et" denildi. Yeni kural: Cursor raporu commit hash içermiyorsa, audit ilk adımı `git status` — QA Verification Protocol'e ekle.
- **Build'siz `firebase deploy` = eski dist çıkar.** Bugün yaşandı (login sonrası direkt deploy). Deploy protokolündeki "önce build" adımı atlanamaz; şüphede bundle hash diff.
- **Read-time fallback ≠ write-time fallback.** `ud-region` fallback'i yazarken doğru, filtrede felaket: etiketsiz event'ler aktif region'ı takip edip her görünümde belirdi (Robert MacKenzie her region'da). Filter'lar yalnızca kayıtlı alana (veya deterministik türetmeye — vipId prefix) güvenmeli.
- **Yeni route sprint'lerinde `navigation/shellVisibility.js` zorunlu checklist maddesi.** Sprint D directive'i atladı → yacht portalları site menüsüyle render oldu. Route ekleyen her directive cross-cutting registry'leri explicit saymalı.
- **Windows Chrome bayrak emojisi çizemez** — 🇸🇦 soluk "SA"ya düşer. Region seçicilerde text kodu (KSA/USA/MEX/CAN).
- **Sandbox mount stale okuma → hayalet build hatası + hayalet git state.** App.jsx sandbox'ta 294 satır/kesik göründü, host'ta 321 tam; HEAD hayalet `curso` branch'i gösterdi. Kural: sandbox bozulma gösterirse destructive git ops YASAK — host Read / kullanıcı terminaliyle doğrula.
- **Sektör config'lerinde spread-miras tuzağı.** `YACHT = { ...AUTOMOTIVE }` funnel/kategori override edilmeyince araba etiketleri yacht dashboard'una sızdı. Yeni sektör = her surface alanının (funnel, heatmap, intent kategorileri) explicit override kontrolü.

---

## ✅ CLOSED — Sprint C kapandı (2026-07-03)

**Sprint C — Phase 2d.RE + portalTrack SHIPPED + MERGED.** PR #11 `bc35d56b`. `portalTrack.js` helper (6 portal), region-aware tracking persona fix (USA VIP → "James Mitchell"), `UNIT_MEDIA` canonical (3 RE portal), `tr()` emekli. -128L net. Grep 5/5 + runtime QA 9/9 + CI PASS. Deploy Sprint D ile birlikte 2026-07-03 EOD'de yapıldı.

---

## ✅ CLOSED — Sprint A + B (2026-07-03, aynı gün)

1. **Yapı Raporu** — `docs/YAPI_RAPORU_2026-07-03.md`: full codebase audit (3 paralel keşif ajanı), sağlık 7.5/10, yol haritası A→E. Bulgular: blinq CSS efsanesi ölü (4KB), gerçek ağırlık `ordercard.css` 388KB global import; Sentry zaten init'li; 9 function (7 değil); legacy CRM dashboard region-aware DEĞİL (hep Al Noor render eder — FAZ 5 gerekçesi).
2. **Sprint B — Hardening** — PR #10 `05a5fd07`: `functions/functions/` duplicate + ölü dosyalar silindi (-812L), `.github/workflows/ci.yml` kuruldu (ilk gün `NFCCards/Assets→assets` case bug'ı yakaladı), vite proxy `dynamicnfc.ca`. Oguzhan manuel: **Firestore Delete Protection + PITR AÇIK.** Audit PASS.
3. **Sprint A — Pitch deck** — `DynamicNFC_Pitch_2026_USA.pptx` (11 slayt EN, çok sektörlü). Görseller canlı siteden playwright/headless-chromium ile (sandbox pipeline: `ud-region` + consent localStorage inject). **Karar: USA-first — Gulf jeopolitik nedenle arka planda** (S4 James Mitchell/Skyline Towers, S6 Premier Auto + Vancouver, bölge sırası USA·Canada·Mexico·Gulf). Bu öncelik gelecek satış malzemelerinde de geçerli.

---

## ✅ CLOSED — Phase 2b.Auto kapandı (2026-07-03)

**Audit sonucu (Claude, repo-level doğrulama, 2026-07-03):**
- `data/automotiveVehicleData.js` (259L) — `v()` factory + `COLORS_STD`/`INTERIORS_STD` ortak palet + `IMG` map fallback'li. **36 araç (4×9) doğrulandı**, 4 dil. Code Simplicity Mandate'e örnek dosya.
- `data/automotivePersonas.js` (56L) + `hooks/usePortalVehicles.js` (20L), `SULTAN_IDS` 4×5.
- Grep proof: inline `VEHICLES` 0 sonuç, `priceRange` 0 sonuç. Hook 3 portal'da (AutomotivePortal L316 / Sultan L357 / Showroom L294). ES+FR inline LANG 3/3.

**Bilinen kalıntılar (kabul edildi):**
1. `nameAr` 19 kullanım — HEPSİ `AutoDashboard.jsx` (legacy, FAZ 5'te retire, sprint scope dışı). Dosya emekli olunca kendiliğinden gider.
2. ⚠️ **Local working tree:** `AutomotivePortal.jsx` dosya sonu NUL byte'larla bozuk (sync/editor artifact). **Git blob + deploy TEMİZ** — sadece local kopya. Fix: `git checkout -- frontend/src/pages/AutomotiveDemo/AutomotivePortal.jsx`

### Next session first move
1. Local restore (yukarıdaki checkout komutu) + `cursor/phase-2b-auto-4region-parity` branch sil (PR sayfası "Delete branch")
2. Canlı spot QA (hard refresh Ctrl+Shift+R): `/automotive/demo/khalid` Gulf→G63 / Canada→Tesla Plaid; `/automotive/demo/sultan` 5 araç + persona swap; showroom fiyatları MX$/CA$; Mexico ES + Canada FR dil cycle
3. **Phase 2d.RE cleanup** (küçük scope): `floorPlan.rooms[].label` + `payment.plans` canonical migrate, `UNIT_EXTRAS` kaldır, `tr()` helper emekli
4. Sonrası: **Yacht demo portalları** (region-aware day-one) → **FAZ 5** legacy dashboard retire (AutoDashboard nameAr kalıntısı burada gider) → **pitch deck refresh** (artık 2 sektör × 4 region parity anlatılabilir — sales-critical)

### Lessons added (2026-07-02/03)
- **1 ay eski directive = stale varsayım riski.** Phase 2b.Auto directive'inde 4 gerçek hata vardı (var olmayan `contexts/RegionContext` import'u, var olmayan `i18n/portals/*.i18n.js` dosyaları, gereksiz yeni `formatPrice` helper, eksik dil-cycle scope'u). Execute öncesi güncel koda karşı 10 dk re-audit, yarım günlük Cursor debug'ı önledi. Kural: directive yazımı ile execute arasında sprint/zaman geçtiyse, execute öncesi re-audit mandatory.
- **Mount/sync stale okumaları:** Sandbox mount bazen dosyanın eski/kısmi halini gösterir. Bozulma şüphesinde önce `git show HEAD:<file>` ile blob'u doğrula — working tree ≠ commit gerçeği.

---

## ✅ CLOSED — 2026-06-01 (Phase 2b.Auto başlat — superseded by ship 2026-07-03)

**Status:** Phase 2b.RE + Phase 2c.RE production'a deploy edildi (`https://dynamicnfc.ca`). 3 RE portal (VIPPortal + AhmedPortal + MarketplacePortal) 4 region × 4 dil full parity. Mexico ES'de "Suite Cielo Real / Hacienda Mayor / Suite Patio Real", USA EN'de "Skyline Penthouse / Park Avenue Residence / Hudson Executive Loft", Canada FR'de "Penthouse Harbour / Vista Nord Tour", Gulf AR'de "بنتهاوس السماء / إقامة كبرى". AMENITIES region-spesifik (Gulf hammam, Mexico hacienda pool, Canada Pacific waterfront, USA Manhattan skyline). INVEST stats region-spesifik (Gulf 8.2%, USA 6.5%, Mexico 9.0%, Canada 5.0%). **Sıra Auto sektöre — VEHICLES region-prefixed + ES/FR.**

### Tomorrow's first move

1. **Auto portal scope audit** — AutomotivePortal + SultanPortal + PublicShowroom mevcut yapı:
   - VEHICLES bilingual `{en, ar}` array (per portal: 9/5/9 vehicles)
   - `nameAr` field separate (schema inconsistency — RE pattern'inden farklı)
   - 4 region: Gulf Mercedes-anchored, USA Cadillac, Mexico likely BMW/Audi, Canada Lexus/Tesla
   - Phase 2b'de "hibrit" pattern kararı: Auto **region-prefixed full duplicate** (NOT canonical+overlay)
     - Sebep: Realism — Manhattan VIP'ye Cadillac Escalade, Vancouver VIP'ye Tesla, Riyadh VIP'ye Mercedes G63 gösterilmeli. Aynı isim listesi 4 region'a kötü demo.

2. **Per-region vehicle inventory** branding kararı:
   - **Gulf:** Mercedes G63 / GLS 600 / GLE 53 (current, korunur); S 580 / Maybach S680 / EQS 580; AMG GT63 / C63 / SL63 (luxury performance)
   - **USA (Manhattan):** Cadillac Escalade / CT5-V Blackwing / Lyriq; Tesla Model S Plaid / Model X / Cybertruck; Lincoln Navigator / Aviator
   - **Mexico (CDMX/Riviera):** BMW X7 / 7 Series / i7; Audi Q8 e-tron / RS6 / R8; Mercedes Maybach S680 (luxury sedan)
   - **Canada (Vancouver):** Tesla Model X / Plaid / Cybertruck; Lexus LX 600 / LS 500 / RZ; Range Rover Sport / Defender 130

3. **Directive yazımı** (Claude scope):
   - `frontend/src/config/automotiveVehicleData.js` (yeni)
   - Pattern: `VEHICLES_GULF = [...9 vehicles...]`, `VEHICLES_USA = [...]`, `VEHICLES_MEXICO = [...]`, `VEHICLES_CANADA = [...]`
   - `usePortalRegion('automotive')` helper genişletme: `vehicles: VEHICLES_BY_REGION[regionId]`
   - 3 portal data layer swap

4. **3 paralel sub-agent** vehicle data üretimi (her sub-agent 1 portal: AutomotivePortal/SultanPortal/PublicShowroom — toplam ~36 vehicle entries × ~10 field × 4 dil ≈ 1440 string)

5. **Cursor execute** → build PASS + 4 region QA + commit + deploy.

6. **Phase 2b.Auto sonrası:** Phase 2d.RE (floorPlan.rooms[].label + payment.plans + UNIT_EXTRAS canonical migrate) → Yacht demo portals → FAZ 5 legacy dashboard retire.

### What shipped today (chronological)

| Order | Sprint | Item | State |
|---|---|---|---|
| 1 | Phase 2b.RE | `regionConfig.personas[].gender` + 3 portal welcomeMale/welcomeFemale + ES + FR LANG blokları (~820 string) + AR floorPlan disclaimer bug fix + nav.lang region-aware cycle + Marketplace flat AR keys cleanup | ✅ Live |
| 2 | Phase 2b.RE Hotfix | `tr(obj) = obj?.[lang] ?? obj.en` helper 3 portal'a, ~75 mekanik unit.X[lang] swap + Cursor proaktif AMENITIES/INVEST/hero ternary fix | ✅ Live |
| 3 | Phase 2c.RE | `realEstateUnitData.js` (~1115 satır, 1632 string) — canonical UNITS_LUXURY + UNITS_FAMILY + UNIT_REGION_OVERLAY_* + AMENITIES_REGION_OVERLAY + INVEST_REGION_OVERLAY + 4 helper. portalRegion helper genişletme (luxuryUnits/familyUnits/amenities/investStats accessors). 3 portal data layer swap (local UNITS/AMENITIES/INVEST silindi → helper'dan tüketim). UNIT_EXTRAS pattern (img/gallery/floorPlan local kalır, Phase 2d'ye bırakıldı). | ✅ Live |

### Per-region unit naming final list (Phase 2c'de onaylanmış)

**LUXURY tier (VIP + Marketplace shared):**

| Unit ID | Gulf | USA | Mexico | Canada |
|---|---|---|---|---|
| `lux-ph` | Sky Penthouse / Al Qamar Tower | Skyline Penthouse / Manhattan Tower | Suite Cielo Real / Torre Sol | Harbour Penthouse / Vista North Tower |
| `lux-grand` | Grand Residence / Al Safwa Tower | Park Avenue Residence / Hudson Tower | Hacienda Mayor / Torre Luna | Waterfront Grand / Vista South Tower |
| `lux-exec` | Executive Suite / Al Rawda Tower | Hudson Executive Loft / Central Tower | Suite Patio Real / Torre Estrella | Pacific Executive Loft / Vista Marina |

**FAMILY tier (Ahmed):**

| Unit ID | Gulf | USA | Mexico | Canada |
|---|---|---|---|---|
| `fam-3br` | Family Garden Suite / Al Safwa | Park Family Residence / Hudson | Casa Familiar Patio / Torre Luna | Family Harbour Residence / Vista South |
| `fam-4br` | Grand Family Residence / Al Rawda | Brownstone Family Loft / Central | Casa Mayor Familiar / Torre Sol | Mountain View Family / Vista North |
| `fam-2br` | Garden Family Suite / Al Qamar | Family Loft / Hudson | Casa Patio Familiar / Torre Estrella | Harbour Family Suite / Vista Marina |

**INVEST stats per region (Phase 2c data):**

| Region | Yield | Growth | Plan | Handover |
|---|---|---|---|---|
| Gulf | 8.2% | 23% | 60/40 | Q4 2027 |
| USA | 6.5% | 18% | 70/30 | Q2 2027 |
| Mexico | 9.0% | 25% | 50/50 | Q1 2028 |
| Canada | 5.0% | 15% | 65/35 | Q3 2027 |

### Files modified today

| File | Phase | Change |
|---|---|---|
| `config/regionConfig.js` | 2b | `gender: 'male'\|'female'` 30 persona (11 female, 19 male) |
| `config/realEstateUnitData.js` | 2c | **YENİ** ~1115 satır — canonical + overlay + helpers (1632 localized string) |
| `services/portalRegion.js` | 2c | `luxuryUnits` / `familyUnits` / `amenities` / `investStats` accessors |
| `pages/VIPPortal/VIPPortal_Definitive.jsx` | 2b + 2c | 4 dil LANG, `welcomeMale/Female`, AR disclaimer fix, `tr()` helper (hotfix), `LANG_LABEL+nextLang`, local UNITS/AMENITIES/INVEST silindi, IMAGES (UNIT_EXTRAS) kalır |
| `pages/AhmedPortal/AhmedPortal.jsx` | 2b + 2c | Aynı pattern (familyUnits accessor) |
| `pages/MarketplacePortal/MarketplacePortal.jsx` | 2b + 2c | 4 dil LANG, flat AR keys cleanup, hero `projectName(lang)`, `documentElement.lang` ES/FR respect, compare modal `units` shadowing → `compareUnits`, AMENITIES desc parity |

### Open threads

1. **Phase 2b.Auto** (next session — Claude scope, ana iş):
   - Pattern: region-prefixed full duplicate (`VEHICLES_GULF/USA/MEXICO/CANADA`)
   - Per-region vehicle naming kararı (yukarıdaki branding önerisi onayı)
   - 3 paralel sub-agent veri üretimi
   - Plus `nameAr` field → `name{en/ar}` schema unification

2. **Phase 2d.RE cleanup** (Auto sonrası, küçük scope):
   - `floorPlan.rooms[].label` bilingual → canonical migrate
   - `payment.plans` milestone localization
   - `UNIT_EXTRAS` pattern kaldırma (img/gallery/floorPlan canonical'a entegre)
   - `tr()` helper tamamen kalkar

3. **Marketplace `hero.title` dead key cleanup** — `"Vista\nResidences"` artık render edilmiyor (`projectName(lang)` çağrılıyor). Ayrı chore PR.

4. **Pitch deck refresh** — 4 region parity + Phase 2b/2c sonuçları + Mexico ES + Canada FR screenshot'lar + AMENITIES region-spesifik narrative + INVEST market data parity. Mevcut PDF outdated.

5. **Carry-over:** Phase 2d sonrası → Phase 3 Yacht demo portals → FAZ 5 legacy dashboard retire → Apple Dev / Sentry.

### Lessons added today (high-value, candidate for CLAUDE.md)

- **Canonical + region overlay pattern RE için doğru tercih.** Tek `realEstateUnitData.js` dosyası 1632 localized string içerir ama her biri tek yerde — bilingual flat array'lere göre 4× veri yoğunluğu, ama 0 duplication, 0 schema drift, 0 inconsistency riski. Region başına farklı unit isimleri olabilir (Sky Penthouse Gulf'ta, Skyline Penthouse USA'da, Suite Cielo Real Mexico'da, Harbour Penthouse Canada'da) — overlay pattern bunu doğal olarak destekler.
- **Helper API tek (`usePortalRegion`) — Code Simplicity Mandate.** Tier-spesifik hook (`useLuxuryUnits`/`useFamilyUnits`) açma riskti, tek helper destructure çok daha temiz oldu (4 accessor: luxuryUnits, familyUnits, amenities, investStats).
- **UNIT_EXTRAS geçici pattern OK ama scope creep'i izle.** Phase 2c'de img/gallery/floorPlan canonical'a taşımak scope'u 2× büyütürdü. UNIT_EXTRAS local dict pattern'i geçici, Phase 2d'de kapsanır. Lesson: refactor sprint scope'u tek bir temaya bağla (Phase 2c = "data localization" — extras layout kontamine etmesin).
- **3 paralel sub-agent veri üretimi etkili oldu.** Toplam 1632 string ~10 dakikada üretildi (3 sub-agent paralel). Tek bir batch context limit'i aşardı. Lesson: büyük translation/data üretimi gerektiğinde domain-bazlı paralel sub-agent split — Claude'un her sub-agent'inde dedicated context, daha kaliteli + hızlı.
- **Cursor proaktif IMAGES regression yakalama + Python script fix.** Cursor bu sprintte (a) UNITS sil komutu kazasıyla IMAGES const'ı sildi, (b) 3 portal'da geri ekledi, (c) script'i de düzeltti. Phase 2b'deki "AMENITIES/INVEST/hero ternary" proaktif yakalama trendine devamı. Trust building — gelecek directive'lerde mekanik kapsama Cursor'a daha esnek bırakılabilir, ama proaktif kazanımları post-mortem audit etmek hala mandatory.
- **Per-region branding kararı demo'da göze çarpan ilk şey.** Phase 2c'nin kendisi "per-region unit naming" kararıyla başladı — Suite Cielo Real (Mexico hacienda) vs Skyline Penthouse (USA Manhattan) vs Harbour Penthouse (Canada waterfront). Generic isimler (Penthouse, 3BR) demoda inandırıcılığı düşürür. Lesson: region-aware product içerik sadece çeviri değil, branding kalibrasyonu da gerekiyor — bunu data architecture sprint'inin başına koy.
- **AMENITIES desc parity decision (Marketplace 2A).** Marketplace anonymous public portal olsa da, AMENITIES desc'i region-spesifik narrative taşıyor (Mexico "Hacienda Pool & Patio — 60m pool surrounded by hacienda gardens"). Title tek başına generic kalır. Demo'da "premium lifestyle" mesajı için desc mandatory. Lesson: UX yoğunluk endişesi vs branding mesajı dengesi — public portal'da desc'i tutmak yoksa "ucuz" hisseder.

### Working-tree state (when this handoff was written)

```
On branch main
Your branch is up to date with 'origin/main' (Phase 2b.RE + Phase 2c.RE merged + deployed).

Pending uncommitted:
        modified:   CLAUDE_HANDOFF.md ← bu update
Untracked (Cowork session outputs — referans için):
        outputs/PHASE_2B_RE_TRANSLATION_DIRECTIVE.md
        outputs/PHASE_2B_RE_HOTFIX_UNITS_LANG_FALLBACK.md
        outputs/PHASE_2C_RE_DATA_ARCHITECTURE_DIRECTIVE.md
        outputs/Phase2b_RE_translations_{VIPPortal,AhmedPortal,MarketplacePortal}.md
        outputs/Phase2c_{LUXURY,FAMILY,AMENITIES_INVEST}_data.md

Committed to repo (Cursor için reference):
        frontend/directives/PHASE_2C_RE_DATA_ARCHITECTURE_DIRECTIVE.md
        frontend/directives/Phase2c_{LUXURY,FAMILY,AMENITIES_INVEST}_data.md
```

### Tone for resume

Marathon gün — 2 büyük sprint aynı oturumda shipped. RE sektörü 4 region × 4 dil full parity, demo'da Mexico ES Marketplace "Suite Cielo Real / Desde MX$12,500,000" gibi region-spesifik branding gözüküyor. Phase 2b'deki crash lesson Phase 2c'de internalize edildi — bu sefer build PASS sonrası 4 region screenshot QA, crash yok, deploy temiz. Cursor proaktif kalibrasyonu (AMENITIES, IMAGES regression) trust katmanını sağlamlaştırdı. Yarın Auto sektörüne girişte momentum güçlü. Open next session with: *"Auto vehicle inventory per region onayı → Phase 2b.Auto directive → 3 paralel sub-agent → Cursor execute."*

---

## ✅ CLOSED — 2026-05-31 EOD #1 (Phase 2c.RE Data Architecture başlat — superseded by ship aynı session)

**Status:** Phase 2b.RE production'a deploy edildi (`https://dynamicnfc.ca`). ES/FR sahnelerinde UI copy + buton + form + modal'lar 100% lokalize; UNITS data layer (unit name/floor/beds/desc/features) + AMENITIES (8 amenity × 2 field) + INVEST (4 stat × 2 field) hala `{en, ar}` bilingual shape'inde — `tr()` helper EN fallback yapıyor. Demo'da Mexico ES + Canada FR'de "Sky Penthouse / FLOOR 42-44 / 4 Bedrooms / Infinity Edge Pool / Rental yield" gibi field'lar İngilizce kalıyor. **Phase 2c.RE Data Architecture sprint'i bu boşluğu kalıcı yapıyla kapatıyor — canonical+overlay pattern, per-region unit names.**

### Tomorrow's first move

1. **Karar al — per-region unit naming.** Phase 2c canonical+overlay pattern Mexico'da "Suite Cielo / Torre Sol", USA'da "Skyline Penthouse / Manhattan Tower", Canada'da "Harbour Penthouse / Vista North Tower" gibi region-spesifik isimler kullanır. Bu branding kararı — demo'da göze çarpan ilk şey. Claude (next session) 3 portal × 4 region × 3 unit = 36 unit ismini önerir, Oguzhan onaylar.

2. **Phase 2c.RE directive yazımı — Claude scope:**
   - **Yeni dosya:** `frontend/src/config/realEstateUnitData.js`
   - **Export:** `UNITS` (canonical numeric — id, beds, baths, sqftBase, priceBase, type), `UNIT_REGION_OVERLAY[regionId][unitId] = { name: { en, ar, es, fr }, tower: {…}, view: {…}, desc: {…}, features: [{…}] }`, `PRICE_MULTIPLIER`, `getUnits(regionId, lang)` helper.
   - **Aynı pattern:** `AMENITIES_REGION_OVERLAY` (Gulf minaret/dome ambient; Canada waterfront ambient), `INVEST_REGION_OVERLAY` (yields per region — Gulf 8.2%, USA 6.5%, Mexico 9%, Canada 5%).
   - **portalRegion.js helper genişletme:** `usePortalRegion` return'una `units` array eklenir (regionId+lang ile pre-resolved).
   - **3 portal render-site swap:** Mevcut local `const UNITS = [...]` siliniyor, `units` helper'dan tüketiliyor. `tr()` helper ihtiyacı kalkıyor.
   - **Companion bundles:** `Phase2c_VIP_data.md`, `Phase2c_Ahmed_data.md`, `Phase2c_Marketplace_data.md` — sub-agent'la paralel üretim.

3. **3 paralel sub-agent** — her portal için bir, 4 region × 3 unit × 4 dil tam veri üretsin. Per-region unit names + descriptions + features arrays + amenity localizations.

4. **Cursor execute** → verify (build PASS + grep checkpointleri) → 8 senaryo QA (4 region × 2 dil her sahne crash-free + unit isimleri region-spesifik) → atomic commit + push + deploy.

5. **Phase 2c.RE deploy sonrası:** Phase 2b.Auto başlar (VEHICLES_GULF/USA/MEXICO/CANADA region-prefixed arrays + ES/FR + `nameAr` → `name{en/ar}` schema fix).

### What shipped today

| Order | Item | State |
|---|---|---|
| 1 | Phase 2b.RE ana paket — `regionConfig.personas[].gender` field, 3 portal'a `welcomeMale`/`welcomeFemale`, ES + FR LANG blokları (~820 string), AR `floorPlanModal.disclaimer` bug fix (VIP + Ahmed), `nav.lang` region-aware cycle (`LANG_LABEL[nextLang]`), Marketplace flat AR duplicate keys cleanup (~100 satır), `document.documentElement.lang` ES/FR respect | Cursor execute, verify PASS, ES/FR'de ErrorBoundary crash |
| 2 | Hotfix — `tr(obj) = obj?.[lang] ?? obj.en` helper 3 portal'a, ~75 mekanik `unit.X[lang]` → `tr(unit.X)` swap. Plus Cursor proaktif yakalama: `AMENITIES[lang]`/`INVEST[lang]`/`a[lang]`/hero h1 hardcoded ternary | Cursor execute, verify PASS |
| 3 | Atomic squash commit + push + production deploy | ✅ Live `dynamicnfc.ca` |

### Files modified today

| File | Change |
|---|---|
| `config/regionConfig.js` | `gender: 'male'\|'female'` 30 persona'ya eklendi (11 female, 19 male) |
| `pages/VIPPortal/VIPPortal_Definitive.jsx` | ES+FR LANG blokları (~132+132=264 string), `welcomeMale`/`welcomeFemale` (EN+AR+ES+FR), `greeting` kaldırıldı, AR floorPlanModal.disclaimer fix, `tr()` helper, ~25 mekanik `[lang]` swap, `LANG_LABEL`+`nextLang` region-aware cycle button |
| `pages/AhmedPortal/AhmedPortal.jsx` | Aynı pattern VIP (~260 ES+FR string), `familyPersona.gender` aware welcome, AR disclaimer fix, `tr()` helper, ~20 swap |
| `pages/MarketplacePortal/MarketplacePortal.jsx` | ES+FR LANG (~296 string), flat AR duplicate keys silindi, `LANG_LABEL[nextLang]`, hero zaten `projectName(lang)` kullanıyordu, `document.documentElement.lang` ES/FR respect, `tr()` helper, ~30 swap, hardcoded `lang === "en" ? X : Y` ternary'leri `t.X` i18n key'lerine çevrildi |

### Open threads

1. **Phase 2c.RE Data Architecture** (next session — Claude scope).
   - **Pattern:** Hibrit — RE canonical+overlay, Auto region-prefixed (Phase 2b'de karar verildi).
   - **Per-region unit naming** branding kararı önce — Claude öneri sunar, Oguzhan onaylar.
   - **3 paralel sub-agent** veri üretimi, sonra Cursor execute.
   - Tek karar bekliyor: per-region unit names + tower names final list.

2. **Phase 2b.Auto** (Phase 2c.RE sonrası):
   - VEHICLES_GULF/USA/MEXICO/CANADA region-prefixed arrays (gerçek region inventory: Mercedes Riyadh, Cadillac Manhattan, Lexus Vancouver)
   - ES + FR translations (~780 string)
   - `nameAr` field → `name{en/ar}` schema unification

3. **Phase 2b.RE Marketplace LANG dead code:** `hero.title: "Vista\nResidences"` artık render edilmiyor (`projectName(lang)` çağrılıyor). Cleanup ayrı PR (`chore(i18n): marketplace hero.title dead key removal`).

4. **Carry-over:** Phase 2c sonrası → Phase 2b.Auto → FAZ 5 legacy dashboard retire → Apple Dev / Sentry / pitch deck refresh.

### Lessons added today (high-value, candidate for CLAUDE.md §15)

- **Build PASS ≠ runtime safe — i18n sprintleri için mandatory dev mode crash check.** Cursor'un `npm run build` PASS verify'ı sözdizimi kontrol; UNITS bilingual data crash sadece runtime'da yakalanır. CLAUDE.md §15 QA Verification Protocol'e ekle: **i18n sprint sonrası `npm run dev` ile her yeni dil için en az 1 portal screenshot — ErrorBoundary trigger ediyor mu?** Bu yakalanmazsa pilot demoda canlı patlar.
- **Bilingual data layer i18n sprintinden ayrı, paralel sorun.** Phase 2b LANG'ı 4 dile çıkardı; UNITS/AMENITIES/INVEST `{en, ar}` bilingual data layer ayrı scope ama directive bunu kapsamadı. **Yeni directive checklist'i:** "i18n adding language X — does any data array shaped `{ en, ar }` exist? Audit + fallback + Phase XX data refactor plan."
- **`undefined[key]` React'te silent — sonra başka bir DOM operation'da patlar.** ErrorBoundary "Something went wrong" mesajı root cause'u gizler. Console filter aktifse hata mesajları görünmez. **Gelecek debug:** console filter sıfırla → tam stack trace → root cause. Filter kapatmadan tahmin yapmak boşa enerji.
- **Cursor "FIXED" raporu hypothesis, fact değil — özellikle build PASS verify'ı runtime crash'i kanıtlamaz.** Phase 2b verify steps "build PASS" + "grep checkpoints" idi; her ikisi de geçti ama production crash etti. CLAUDE.md §15 QA Verification Protocol'e ek: **"Cursor verify suite tek başına sufficient değil — Oguzhan production-mode browser screenshot zorunlu."**
- **Cursor proaktif refactor reflexi gelişiyor.** Bu sprintte directive `unit.X[lang]` swap'ı için yazılmıştı; Cursor `AMENITIES[lang]`, `INVEST[lang]`, `a[lang]`, hero h1 hardcoded ternary, `document.documentElement.lang` ES/FR extension'larını **kendisi** yakaladı. Trust building — gelecek directive'lerde Cursor'a daha yüksek autonomi vermek (mekanik kapsama daha esnek).
- **Code Simplicity Mandate win:** Hotfix tek 1-liner helper `tr(obj) = obj?.[lang] ?? obj.en`, ~75 mekanik replace. Defensive wrapper class veya sub-component yazılmadı.
- **In-place vs canonical refactor karar prensibi:** Phase 2b sonrası "ES/FR data'da EN gözüküyor" durumunda iki yol: (A) bilingual `{en, ar}` field'lara `es`+`fr` ekle (~900 string), (B) Phase 2c canonical+overlay refactor'unu erken başlat. **B doğru çünkü** Phase 2c'de unit isimleri zaten per-region olacak (Sky Penthouse Vancouver'da "Harbour Penthouse"), aynı veri 2 kez yazılır. **Lesson:** Bir refactor planlanmışsa ve geçici fix o refactor'u ezecekse, refactor'u öne çek.

### Working-tree state (when this handoff was written)

```
On branch main
Your branch is up to date with 'origin/main' (Phase 2b.RE merged + deployed).

Pending uncommitted:
        modified:   CLAUDE_HANDOFF.md ← bu update
Untracked (Cowork session outputs — referans için):
        outputs/PHASE_2B_RE_TRANSLATION_DIRECTIVE.md
        outputs/PHASE_2B_RE_HOTFIX_UNITS_LANG_FALLBACK.md
        outputs/Phase2b_RE_translations_VIPPortal.md
        outputs/Phase2b_RE_translations_AhmedPortal.md
        outputs/Phase2b_RE_translations_MarketplacePortal.md
```

### Tone for resume

Bugün clean execution + 1 ders. Phase 2b directive'i i18n sprint'inde bilingual data audit'i kapsamamıştı — runtime crash. Hotfix hızlı uygulandı, Cursor proaktif scope'u genişletti. Phase 2c'yi hemen başlatma kararı disiplinli — in-place 4-dil eklemek Phase 2c canonical refactor'ünde silinecekti. Open next session with: *"Per-region unit naming önerileri → onay → directive yaz → 3 paralel sub-agent paralel üretim → Cursor execute."*

---

## ✅ CLOSED — 2026-05-26 EOD (Currency Formatter — Lang-Aware + Forced Prefix)

**Status:** All currency rendering across 6 demo portals now respects (region, lang) tuple. Mexico + Canada forced "MX$" / "CA$" prefix to disambiguate from USD (Intl native renders bare "$" in both). Atomic commit `de16aa3d` pushed to origin/main. **Production deploy pending tomorrow + manual 8-scenario QA + docs commit.**

### Tomorrow's first move

1. **Restart Vite dev + hard refresh** (yesterday's Canada screenshot showed cached bundle):
   ```powershell
   cd C:\Users\oguzh\DynamicNFC\frontend
   npm run dev
   ```
   Then `Ctrl+Shift+R` in browser.

2. **8-scenario QA — REQUIRED before deploy** (yesterday's lesson: "Build PASS + spot check 2 region ≠ all 4 verified"):

   | Region × Lang | Expected output |
   |---|---|
   | Gulf EN | `SAR 12,500,000` (Latin digits + SAR prefix) |
   | Gulf AR | `١٢٬٥٠٠٬٠٠٠ ر.س.` (Arabic digits + symbol) |
   | USA EN | `$12,500,000` |
   | USA ES | `$12,500,000` (es-US locale + USD) |
   | Mexico ES | `MX$12,500,000` (forced prefix) |
   | Mexico EN | `MX$12,500,000` |
   | Canada EN | `CA$12,500,000` (forced prefix) |
   | Canada FR | `CA$12 500 000` (French digit grouping preserved) |

   Test across: VIPPortal (Khalid), AhmedPortal, MarketplacePortal, AutomotivePortal, SultanPortal. At least one portal per region.

3. **Production deploy:**
   ```powershell
   cd C:\Users\oguzh\DynamicNFC
   firebase deploy --only hosting
   ```

4. **Docs + directives commit** (post-deploy, second atomic commit):
   - `CLAUDE.md` modified (today's §10 tracking architecture correction + §15 region-QA lesson)
   - `CLAUDE_HANDOFF.md` modified (this file)
   - 4 directive `.md` untracked (PORTAL_BRIDGE_DUAL_WRITE, SPRINT2_3_PART_B_PHASE1_MARKETPLACE, SPRINT2_3_PART_B_PHASE2A_HOTFIX_RE_CURRENCY, SPRINT2_3_PART_B_PHASE2A_PORTALS)
   - Add `.claude/settings.local.json` to `.gitignore` (handoff backlog item)
   - Commit: `docs(handoff+directives): Phase 2a currency sprint trail`

### What shipped today (chronological)

| Order | Item | Commit |
|---|---|---|
| 1 | Marketplace 3 priceRange render sites → fmtCurrency + `priceFrom` i18n key (en+ar) | `8b0989f8` (squashed into atomic) |
| 2 | `formatCurrency(value, regionId, lang)` — locale follows lang via `getEffectiveLocale`; Mexico forced "MX$" prefix | `8b0989f8` |
| 3 | `usePortalRegion(sectorId, lang)` — lang threaded through fmtCurrency closure + useMemo dep | `8b0989f8` |
| 4 | 6 portal callsites: `usePortalRegion("sector", lang)` — Marketplace `lang` declaration reordered before helper call | `8b0989f8` |
| 5 | Canada added to `FORCED_CURRENCY_PREFIX = { mexico: 'MX$', canada: 'CA$' }` — `en-CA + CAD` Intl returns bare "$" same as `es-MX + MXN` | `8b0989f8` |
| 6 | Atomic commit + push (post worktree cleanup) | `515fb832..de16aa3d main -> main` |

### Files modified today (single commit `8b0989f8` → push `de16aa3d`)

| File | Change |
|---|---|
| `config/regionConfig.js` | `formatCurrency(value, regionId, lang)` signature; `FORCED_CURRENCY_PREFIX` dict (mexico:'MX$', canada:'CA$'); locale resolved via `getEffectiveLocale(regionId, lang)` when lang provided; Intl bypass for forced-prefix regions |
| `services/portalRegion.js` | `usePortalRegion(sectorId, lang)` param added; fmtCurrency closure binds lang; useMemo deps include lang; inner `projectName: (l)` renamed to avoid shadow |
| `pages/MarketplacePortal/MarketplacePortal.jsx` | L645/L719/L830 `unit.priceRange[lang]` → `{t.card.priceFrom}{fmtCurrency(unit.priceNum)}`; `card.priceFrom` i18n key added (en: "From ", ar: "من "); `lang` declaration moved before usePortalRegion call |
| `pages/VIPPortal/VIPPortal_Definitive.jsx` | `, lang` arg to usePortalRegion |
| `pages/AhmedPortal/AhmedPortal.jsx` | `, lang` arg |
| `pages/AutomotiveDemo/AutomotivePortal.jsx` | `, lang` arg |
| `pages/AutomotiveDemo/SultanPortal.jsx` | `, lang` arg |
| `pages/AutomotiveDemo/PublicShowroom.jsx` | `, lang` arg (projectName-only consumer, threaded for consistency) |

### Root cause walkthrough (for future debug session)

**Stage 1 — Marketplace 3 sites still hardcoded:** Phase 1 commit swapped only payment modal `fmtCurrency(payment.base)`. Cards (L645), detail modal (L719), compare modal (L830) kept reading legacy `unit.priceRange[lang]` = `"From AED 12M"` hardcoded. User perception was Gulf+Canada "OK" because (a) Gulf user sees "AED" as Arab-adjacent and didn't notice SAR mismatch, (b) Canada test was likely VIP/Ahmed (already fmtCurrency) and missed Marketplace. USA+Mexico immediately flagged "AED" as wrong.

**Stage 2 — `formatCurrency` ignored active lang:** `Intl.NumberFormat(region.locale, ...)` always used `region.locale` (Gulf = `ar-SA`). User switching to EN in Gulf still saw Arabic digits + Arabic SAR symbol. Fix: `formatCurrency(value, regionId, lang)` — when lang provided, resolve locale via `getEffectiveLocale(regionId, lang)` which maps `gulf.en → "en-US"`.

**Stage 3 — Mexico bare "$" (USD ambiguous):** `Intl.NumberFormat('es-MX', { currency: 'MXN' })` returns `"$12,500,000"` because MXN's native symbol in Mexican locale IS `$`. Indistinguishable from USD. Fix: `FORCED_CURRENCY_PREFIX = { mexico: 'MX$' }` — bypass Intl, use `${prefix}${value.toLocaleString(locale)}`.

**Stage 4 — Canada same trap:** `Intl.NumberFormat('en-CA', { currency: 'CAD' })` also returns bare `"$"`. Fix: extend forced-prefix dict to `{ mexico: 'MX$', canada: 'CA$' }`. Data-driven (one block, two regions) instead of two branch arms — Code Simplicity Mandate.

### Open threads

1. **8-scenario QA + production deploy** — tomorrow first thing (see above).
2. **Zombi UNITS data fields** — `priceDisplay` / `priceShort` / `perSqft` (VIP+Ahmed), `priceRange` (Marketplace) all still in UNITS arrays as hardcoded en/ar pairs. **No longer rendered** but bloat data and risk confusing future devs. Phase 2b data refactor: replace these with single numeric `price` (already exists) + everything else rendered via `fmtCurrency`. Clean removal task — Cursor-scope.
3. **Phase 2b decisions blocked on user:**
   - Translation provider (manual / LLM / DeepL) for ES + FR + AR portal copy
   - Per-region unit data scope — 4 regions × 3 units = 12 unit blocks per RE portal (or one canonical unit array with region-keyed display variants)
   - Per-region vehicle data — 4 × 9 = 36 entries for Auto portals
   - LANG.es + LANG.fr translation tables on 5 portals (~10 large translation blocks)
   - AR persona transliteration field (`regionConfig.personas[].nameAr`)
4. **Yacht demo portals still planned, not built** — `/yacht`, `/yacht/demo`, `/yacht/demo/vip`, `/yacht/demo/showroom`, `/yacht/demo/ai`. Region-aware from day one.
5. **Carry-over from yesterday:** FAZ 5 legacy cleanup (retire `/enterprise/crmdemo/dashboard` + `/automotive/dashboard`); Apple Developer enrollment; Sentry setup; pitch deck refresh.

### Lessons added today (high-value, candidate for CLAUDE.md)

- **`Intl.NumberFormat` is browser- and locale-dependent for ambiguous currencies.** `es-MX + MXN` and `en-CA + CAD` both render bare `"$"` in Chrome — indistinguishable from USD. Demo-critical currency display for these regions **must bypass Intl** with a forced prefix dict. Predictable output > native locale purism for sales demos. Pattern: `FORCED_CURRENCY_PREFIX = { mexico: 'MX$', canada: 'CA$' }` keyed by `region.id`.
- **Currency formatters must explicitly accept active `lang`, not derive from `region.locale`.** Bilingual regions (Gulf EN/AR, Canada EN/FR, Mexico ES/EN) break the "locale follows region" assumption — when user is in Gulf EN, they expect Latin digits + currency code, not Arabic digits. Signature: `formatCurrency(value, regionId, lang)`. Pass `lang` from the same state that drives portal copy.
- **"All render sites swapped" requires mechanical grep proof.** Phase 1 Marketplace commit was directive-faithful but missed 3 of 5 render sites because the directive said "swap 2 currency renders" instead of "list all priceRange usages and swap each one to fmtCurrency". **New pattern for region/currency swap directives:** include a verify step `grep "fieldName\[lang\]" → must be zero results post-edit`. Mechanical check catches what visual QA misses.
- **Cursor Cloud Agent worktree orphans are silent `git status` traps.** Cursor creates worktrees under `.claude/worktrees/<name>/` (and under `Ex Files/2026-04-20_1323/.claude/worktrees/<name>/` when its job dir is preserved). When the parent `.git/worktrees/<name>/` directory is later cleaned up, the orphan `.git` **file** in the working tree still points to the deleted target — every `git status` then dies with `fatal: not a git repository: <deleted-path>`. **`git worktree list` ignores them** (since they're invalid), **`git worktree prune` doesn't reach them** (because the registry has already lost them). **Only fix:** manual `Get-ChildItem -Recurse -Force -Filter ".git"` on working tree, then `Remove-Item -Recurse -Force` on each orphan pointer directory. Add to onboarding runbook.
- **`git pull --rebase --autostash` is the answer when working tree is dirty post-build.** Build artifacts + CRLF normalization on Windows leave the tree "modified" after a clean commit. Manual `git stash` invokes `git status` (which also crashes on worktree orphans); `--autostash` is the cleaner path when supported. Worth memorizing.
- **Code Simplicity Mandate win:** Mexico + Canada both needed forced prefix. First instinct was two if-branches. Refactored to single dictionary `FORCED_CURRENCY_PREFIX = { mexico: 'MX$', canada: 'CA$' }` with one branch check. Two-line lookup beats six-line branching. Future regions with same Intl ambiguity (any future ISO-4217 currency whose native symbol is `$`) extend the dict, not the code.

### Working-tree state (when this handoff was written)

```
On branch main
Your branch is up to date with 'origin/main'.
Changes not staged for commit:
        modified:   CLAUDE.md
        modified:   CLAUDE_HANDOFF.md
Untracked files:
        .claude/settings.local.json   ← add to .gitignore
        frontend/directives/PORTAL_BRIDGE_DUAL_WRITE_DIRECTIVE.md
        frontend/directives/SPRINT2_3_PART_B_PHASE1_MARKETPLACE_DIRECTIVE.md
        frontend/directives/SPRINT2_3_PART_B_PHASE2A_HOTFIX_RE_CURRENCY.md
        frontend/directives/SPRINT2_3_PART_B_PHASE2A_PORTALS_DIRECTIVE.md
        shareholders/                  ← purpose unknown, ask user before commit/ignore
```

Cosmetic cleanup remaining: dead branch metadata in `.git/config` (`[branch "claude/flamboyant-dhawan"]`, `[branch "claude/naughty-haibt"]`, plus older Cursor sprint branches). Non-blocking. Remove via `git config --remove-section "branch.<name>"` when convenient.

### Tone for resume

Today was a "thought we shipped, then realized it shipped wrong" day, then a clean root-cause cascade. Each fix uncovered the next layer: Marketplace legacy field → Gulf EN locale → Mexico bare $ → Canada bare $ → atomic. Git workflow had genuine friction (orphan worktree pointers across `Ex Files/`) but the diagnostic path was clean once we stopped guessing and ran `Get-ChildItem -Filter ".git"`. Open next session with: *"npm run dev → 8 senaryo screenshot → her şey OK ise deploy + docs commit."*

---

## ✅ CLOSED — 2026-05-25 EOD (Phase 2a Currency Bug — USA + Mexico)

**Status:** Bridge dual-write + Marketplace Phase 1 + Portals Phase 2a + RE Currency Hotfix → tüm Cursor execute oldu, build PASS, **Gulf + Canada QA ✅**, **USA + Mexico hâlâ yanlış sembol gösteriyor** (user beklenen "$" / "MX$" yerine "AED" benzeri çıktı görüyor). Root cause kazılmamış.

### Tomorrow's first move

1. **USA + Mexico debug** — `frontend/src/config/regionConfig.js` L152-162:
   ```js
   export function formatCurrency(value, regionId) {
     // Intl.NumberFormat path + fallback `${region.currencySymbol}${value.toLocaleString()}`
   }
   ```
   Console'da test:
   ```js
   formatCurrency(12500000, 'usa')      // beklenen "$12,500,000"
   formatCurrency(12500000, 'mexico')   // beklenen "MX$12,500,000" veya "$12,500,000"
   ```

2. **Hipotez listesi (sıralı):**
   - **H1 (en olası):** `useRegion()` localStorage'dan eski 'gulf' değerini hydrate ediyor; USA/Mexico seçimi unified topbar'da yapılıyor ama portal yeni tabda açıldığında `ud-region` localStorage key reload'da regress ediyor. **Debug:** Portal mount'unda `console.log(localStorage.getItem('ud-region'), regionId)` karşılaştır.
   - **H2:** `getRegion('usa')` veya `getRegion('mexico')` fallback'le 'gulf' dönüyor (typo veya key mismatch). **Debug:** `regionConfig.REGIONS` object key'lerini bir grep et — 'usa' / 'mexico' tam string mi yoksa 'USA' / 'Mexico' mi?
   - **H3:** `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` browser'da çalışıyor ama Mexico region için currency 'MXN' set ama symbol 'MX$' fallback'e düşmeyip Intl native '$' dönüyor ve user bunu "AED" zannediyor. **Debug:** User screenshot iste — gerçekten "AED" mi yoksa "$" mı?

3. **Debug yöntemi (structured log per Debug Conventions):**
   ```js
   console.log(JSON.stringify({
     sessionId: "dbg-0525-curr", runId: 1, hypothesisId: "H1",
     location: "VIPPortal:mount",
     message: "regionContext",
     data: { regionId, currency, symbol: currencySymbol, lsRegion: localStorage.getItem('ud-region'), formatted: fmtCurrency(12500000) },
     timestamp: Date.now()
   }));
   ```
   Senaryo: USA seç → VIPPortal yeni tab → console oku → hangi alan beklenenden farklı?

4. Fix landıktan sonra **Phase 2b directive** yazılır (translation provider + per-region unit data scope soruları).

### What shipped today (chronological)

| Order | Item | Status |
|---|---|---|
| 1 | Bridge dual-write (`portalFirestoreBridge.js`) | Pushed `85686583`, deployed, QA ✅ (behaviors + tenants/{uid}/events both write) |
| 2 | Marketplace Phase 1 — `usePortalRegion` helper + 5-point edit | Local build PASS, committed/pushed by user (Phase 1 land confirmation alındı), deployed |
| 3 | Portals Phase 2a — 5 portala helper apply + `secondaryPersona` ekleme | Local build PASS, pending commit (Cursor done, user QA Gulf+Canada ✅) |
| 4 | RE Currency Hotfix — VIP + Ahmed 8 render site swap | Local build PASS, pending commit, **Gulf+Canada OK / USA+Mexico BUG** |

### Files modified today

| File | Change |
|---|---|
| `services/portalFirestoreBridge.js` | 26L → 34L. `if (!user) return;` silindi. Dual-write: `behaviors` always + `tenants/{uid}/events` if `auth.currentUser`. |
| `services/portalRegion.js` | **NEW** (50L). Helper: `regionId, region, currency, currencySymbol, projectName(lang), personas, vipPersona, secondaryPersona, familyPersona, fmtCurrency`. |
| `pages/MarketplacePortal/MarketplacePortal.jsx` | 864L → 866L. Region brand/currency + 2 currency render. |
| `pages/VIPPortal/VIPPortal_Definitive.jsx` | +Helper apply, `vipName` from `vipPersona`, form name, logo `projectName(lang)`, 6 unit render → `fmtCurrency(unit.price)`. |
| `pages/AhmedPortal/AhmedPortal.jsx` | +Helper apply, `familyPersona`, logo, 4 unit render swap. |
| `pages/AutomotiveDemo/AutomotivePortal.jsx` | +Helper apply, `vipPersona`, fmtCurrency replace-all, logo, crossnav-persona. |
| `pages/AutomotiveDemo/SultanPortal.jsx` | +Helper apply, `secondaryPersona` chain, fmtCurrency replace-all, logo, crossnav-persona. |
| `pages/AutomotiveDemo/PublicShowroom.jsx` | +Helper apply, logo + hero title `projectName(lang)`. |

### Directives landed today

- `frontend/directives/PORTAL_BRIDGE_DUAL_WRITE_DIRECTIVE.md` ✅
- `frontend/directives/SPRINT2_3_PART_B_PHASE1_MARKETPLACE_DIRECTIVE.md` ✅
- `frontend/directives/SPRINT2_3_PART_B_PHASE2A_PORTALS_DIRECTIVE.md` ✅
- `frontend/directives/SPRINT2_3_PART_B_PHASE2A_HOTFIX_RE_CURRENCY.md` ✅ (Gulf+Canada visual OK; USA+Mexico debug pending)

### Pending commits (user'ın local'inde, henüz push olmadı)

```bash
git add frontend/src/services/portalRegion.js \
        frontend/src/pages/MarketplacePortal/MarketplacePortal.jsx \
        frontend/src/pages/VIPPortal/VIPPortal_Definitive.jsx \
        frontend/src/pages/AhmedPortal/AhmedPortal.jsx \
        frontend/src/pages/AutomotiveDemo/AutomotivePortal.jsx \
        frontend/src/pages/AutomotiveDemo/SultanPortal.jsx \
        frontend/src/pages/AutomotiveDemo/PublicShowroom.jsx
# Tek commit (Phase 2a + hotfix beraber, atomic):
git commit -m "feat(portals): region-aware brand/currency/persona on 5 demo portals + RE currency render hotfix (Part B Phase 2a)"
git push
```

**Decision pending:** Bu commit'i USA/Mexico fix öncesi mi atalım, yoksa fix tek commit'te mi gitsin? **Önerim:** İkincisi (atomic). USA/Mexico debug ~30 dk iş, aynı PR'de gitsin.

### Open threads

1. **USA + Mexico currency render — DEBUG TOMORROW** (root cause unknown, 3 hipotez yukarıda).
2. **Phase 2b directive** — blocked on (a) USA/Mexico fix + (b) user content strategy decision:
   - Translation provider seçimi (manual / LLM / DeepL)
   - Per-region unit data scope (4 region × 3 units = 12 unit data sets)
   - Per-region vehicle data scope (4 region × 9 vehicles = 36 vehicle entries)
   - LANG.es + LANG.fr tabloları (5 portal × 2 lang ≈ 10 büyük translation block)
3. **AR persona transliteration** — Phase 2b backlog: `regionConfig.personas[].nameAr` field.
4. **Zombi UNITS field cleanup** — Phase 2a hotfix sonrası `priceDisplay`/`priceShort`/`perSqft` dead code; Phase 2b'de data refactor'la silinir.

### Lessons added today

- **"Build PASS + spot check 2 region" ≠ "all 4 regions visible swap works."** Phase 2a hotfix Gulf+Canada gözle teyit edildi ama USA+Mexico kontrol atlandı. CLAUDE.md §15 QA checklist'e ekle: "Region-aware changes: **4/4 region screenshot zorunlu**, 2/4 yetmez."
- **Static i18n strings within data arrays are a currency sinkhole.** `UNITS[].priceDisplay: { en: "AED 12.5M" }` pattern her unit için 3 field × 2 lang = 6 hardcoded currency string. **Lesson:** Data-driven displays için NEVER pre-format currency in source data. Always store numeric, format at render via region-aware helper. Phase 2b data refactor'a not.
- **`Intl.NumberFormat` locale-currency combos are browser-dependent.** Aynı kod Chrome'da "$12,500,000" döner, Safari'de "USD 12,500,000" döner. Demo-critical currency display için **fallback path'i sade tut** (`${symbol}${value.toLocaleString()}`) ve Intl'i bypass et — predictable output garanti.
- **User'ın gözü authoritative, Cursor'un QA tablosu hypothesis.** Cursor "USA: $12,500,000 (Intl native)" yazdı; gerçekte user "AED" gördü. CLAUDE.md §15 QA Verification Protocol'e güçlendirme: AI'nın "FIXED" claim'i = unverified hypothesis until user screenshot says otherwise.

---

## ✅ CLOSED — 2026-05-25 morning (Cowork session — bridge audit)

**Root cause of Marketplace tracking silence (today's finding):**

`portalFirestoreBridge.js` line 13: `if (!user) return;`. Anonymous Marketplace visitor → `auth.currentUser === null` → bridge silent no-op → neither `behaviors` nor `tenants/{uid}/events` receives the event. Bridge was designed for the cross-tab demo scenario (admin logged in same browser), not for real public/anonymous traffic. Public ziyaretçi pilot ölçümleri imkânsız oluyordu.

Firestore rules already permit public create on `behaviors` (`allow create: if true`), so the fix is code-only — no rules change.

**Architectural reality (CLAUDE.md §10 corrected today):**

- **1 service file:** `services/firestoreTracking.js` (496L) — `track()` writes to top-level `behaviors`; `trackDashboardEvent()` writes to `tenants/{uid}/events`; plus EVENT_SCHEMA + scoring.
- **1 bridge file:** `services/portalFirestoreBridge.js` (26L → ~30L after fix).
- **6 portals each with own inline `trackEvent`:** VIPPortal_Definitive, AhmedPortal, MarketplacePortal, AutomotivePortal, SultanPortal, PublicShowroom. Each writes to localStorage + BroadcastChannel + calls `bridgeEventToFirestore(ev)`. Event counts: 13/13/13/18/18/10.
- **Cross-tab listeners:** Dashboard.jsx, AutoDashboard.jsx, NotificationSystem.jsx — listen to `dnfc_tracking` BroadcastChannel for live UI updates.
- **`shared/tracking.js` and `hooks/useTracking.js`: do not exist.** They were removed in earlier sprints; CLAUDE.md's "3 systems" claim was 49+ days of stale documentation.

**Directive delivered today:**

`frontend/directives/PORTAL_BRIDGE_DUAL_WRITE_DIRECTIVE.md` — Cursor 1-file fix. Bridge becomes dual-write: **always** to `behaviors` (anonymous traffic + legacy admin reads), **additionally** to `tenants/{uid}/events` when `auth.currentUser` is set (cross-tab demo + Unified Dashboard live). JSDoc rewritten. No new imports, no test changes (existing manual QA scenarios in directive §4).

**Definition of done (per directive):**
- `npm run build` PASS.
- `npm test` PASS (120/120).
- Marketplace incognito → 5 clicks → `behaviors` collection 5 new docs.
- Same scenario admin-logged-in → behaviors + tenant events both get docs.
- VIP / Ahmed / Auto Khalid regression → each produces ≥1 behaviors write.
- Commit: `fix(tracking): bridge dual-write to behaviors (always) + tenant events (admin)`

**CLAUDE.md edits made today:**
- §10 Tracking section: replaced "3 systems" table with real architecture (1 service + 1 bridge + 6 inline portals + cross-tab listeners). Documented bridge contract.
- §14 Technical Debt #1: marked CLOSED. New follow-up flagged (consolidate 6 portals' inline `trackEvent` into shared helper — defer until pilot data validates pipeline).

**Memory updated:** `project_marketplace_tracking_silent.md` — root cause + fix + directive reference. MEMORY.md index line refreshed.

**Open thread for tomorrow (after dual-write merge):**

**Sprint 2 #3 Part B — Portal `useRegion()` data binding** — still unaddressed. Canary symptom unchanged: "Vista Residences + AED" appears on Marketplace because portal route handlers don't consume `useRegion()`. Audit demo portals for: `useRegion`/`useSector` imports? `getPersonas(sector, regionId)` calls? Region-aware project labels? Hardcoded data arrays (towers, currency)? Then write `SPRINT2_3_PART_B_PORTAL_REGION_DIRECTIVE.md` → Cursor implements → 4×3 region×sector QA → merge.

**Working tree state (when this handoff was written):**

```
On branch main
Local 1 commit behind origin/main (6d4711c2 chore: activity log).
Working tree clean (apart from directive files Claude created in frontend/directives/).
3 stale worktree refs (cosmetic): das, flamboyant-dhawan, naughty-haibt. Run `git worktree prune -v`.
```

### Lessons added today

- **A 10-day-old memory that names a file path is a claim, not a fact.** Memory rule "before recommending: verify file exists" — today saved us from launching a "3 tracking systems unify" sprint against `shared/tracking.js` and `hooks/useTracking.js` that don't exist. Always `Glob`/`ls` the cited path before scoping work around it.
- **Silent failures that fall back to a parallel system are the worst kind of bug.** BroadcastChannel + localStorage kept the demo "looking like it works" while Firestore writes were dead for 49+ days. Symptom: investor demos green, analytics empty. Lesson: when a write path has multiple destinations, **at least one must throw or warn loudly when the others silently skip.** The bridge's `try { ... } catch (_) {}` swallowed everything including the early-return diagnostic value.
- **`allow create: if true` on a Firestore collection is a deliberate design choice — use it.** `behaviors` rules already permit anonymous create. The bridge was over-engineered with a `if (!user) return` guard that didn't match the rules. Lesson: when in doubt about whether public traffic should write, **check the rules first** — they're the source of truth.
- **Auto-gen activity log commits make `git log` look busy when nothing happened.** Today: 11 days between sessions, single commit `6d4711c2 chore(summary): update day/hour github activity log`. Don't mistake bot commits for real work. Always check commit author/content before assuming progress.

---

## ✅ CLOSED — 2026-05-14 EOD (Cowork session)

**Status:** Polish trilogy (PR 1 + 1.5 + 2 + portal D) fully landed on `main` last night. Today closed the **Arabic LLM body bug** and the **post-merge cleanup**. Two open production threads carry into tomorrow: Marketplace Firestore tracking (silent) and Sprint 2 #3 Part B (portal `useRegion()` data binding).

### What shipped to production today

| Commit (main) | Item | Verify state |
|---|---|---|
| `a3d234e2` | SW reg moved from `index.html` → `main.jsx` (Vite `import.meta.env.DEV` flag) + `"localhost"` removed from `ALLOWED_REDIRECT_DOMAINS` in `functions/index.js` (security tighten) | Pushed to origin/main ✅ |
| `4951e99d` | `aiBriefGenerator.js` — `LANG_INSTRUCTIONS` map injected into Anthropic `system` prompt; `EXISTING_SYSTEM_PROMPT` extracted; new `buildBriefUserContent()` helper; `messages.create` now passes `system` + user-only `messages` | Functions deployed via `firebase deploy --only functions:refreshDailyBriefAi --force` ✅ |
| `[deploy only]` | `refreshDailyBriefAi` Cloud Function source updated (hash `5aa5512c...`) | Production confirmed via two real invocations (4052 ms + 820 ms) + Firestore `byLang.ar.paragraph1` now Arabic ✅ |

**Live verification on `localhost:3000/unified` (AR, Gulf region):**
- Today's Brief body renders fully Arabic — paragraph1 + paragraph2 + inline `<span class="score-change">ارتفعت من 64 إلى 72</span>` ✅
- Chip `24 تنبيهات معرضة للخطر` (template path) ✅
- `byLang.en.paragraph1` still English (regression-clean for default behavior) ✅
- Span/strong tags preserved (no LLM-broken HTML) ✅

### Earlier today — pre-Cowork landings (already merged last night)

Polish branch `polish/pr1-demo-killers-sweep` squashed into main via merge `74276b3f` (5 logical commits + docs):

```
863e66a6  polish(dashboard): kill demo-killers + sentence case + unicode arrows  ← Commit A
e2630cf4  feat(brief): per-language storage in dailyBrief.byLang dict           ← Commit B
356812ef  polish(topbar): region-scoped 2-lang toggle + 2-letter region chip   ← Commit C
14fa105b  polish(portals): Khalid + Ahmed + Marketplace trilogy                 ← Commit D
fe636d70  docs: 2026-05-13 EOD — design critique, portal audits, handoff       ← Commit E
74276b3f  Merge PR 1 polish sweep
7be2b777  Merge branch 'main' (origin sync)
```

QA passes (PR 1+1.5+2+D) during today's session:
- Topbar single-button lang toggle in Gulf (EN↔AR) ✅ — other 3 regions un-tested but logic identical
- 2-letter region chip (`SA` shown, no emoji) ✅
- Sentence case sweep (`Idle lead` chip, `At risk` chip) ✅
- HTML leak fix (`score-change">` text fragment gone) ✅
- Cache badge + `5د sonra refresh` indicator ✅
- TENANT CHECK on region switch — `needsSeed: false`, merge-only rule honored ✅
- Other 3 regions skipped — covered by Gulf evidence + identical code paths

### Open production issues for tomorrow

#### 1. Marketplace Firestore tracking writes silent — NEW FINDING

**Tied memory:** `memory/project_marketplace_tracking_silent.md` (in Cowork user memory)

Symptom evidence (2026-05-14 QA):
- `behaviors` (top-level legacy) last write **2026-03-26** — 49 days stale. Schema is session-end aggregation (`event: "portal_exit"`, `details.categories.{action,browse,engage,intent}` counts), not per-action detail.
- `tenants/lUBC4ciS9HSSGsmTd6xZkkOkr472/events` — last doc 2026-05-13, **all `_tail_` seed docs** (e.g., `ev_usa_yacht_tail_10`). No real user-fired events from today's QA session reached this collection.
- F12 Console with `track` filter on Marketplace — **zero log lines** when triggering Brochure modal (which should fire `download_brochure`). Either `trackEvent` not called or `firestoreTracking.js` silent without debug log.

Why this is bad: dashboard demo still flows visually (BroadcastChannel + localStorage paths intact) so investor demos still "work". But Firestore analytics — the metric path that powers per-region dashboards, conversion funnels, and pilot measurement — is dead.

Why it's not a P0 today: PR 1+1.5+2+D landed and ship unaffected. Visual layer is independent of tracking pipeline.

**Tomorrow:** write directive for tracking unification sprint (CLAUDE.md tech debt #1). Likely consolidates 3 systems (`shared/tracking.js` + `hooks/useTracking.js` + `services/firestoreTracking.js`) into single Firestore-as-primary path with BroadcastChannel as demo-only fallback. Cursor-scope, ~1 day execution.

#### 2. Sprint 2 #3 Part B — Portal `useRegion()` data binding — STILL OPEN

Re-confirmed during today's QA: Marketplace page rendered `Vista Residences` title (Canada project) alongside `AED` currency (Gulf / UAE notation) — classic region-data-mismatch symptom. Polish trilogy from last night fixed the **visual** layer (Tabler icons, cream/charcoal contrast, RTL, sentence case) but did NOT fix the **data-binding** layer.

**Tomorrow:** read each demo portal end-to-end (VIPPortal_Definitive, AhmedPortal, MarketplacePortal + auto equivalents), audit for:
1. `useRegion` + `useSector` imports present?
2. `getPersonas(sector, regionId)` called for persona block?
3. Region-aware project labels (Al Noor vs Vista vs Hacienda) flowing?
4. Hardcoded data arrays (towers, currency, language-locked copy) — to be replaced?

Then write `frontend/directives/SPRINT2_3_PART_B_PORTAL_REGION_DIRECTIVE.md` → Cursor implements → 4×3 region×sector QA → merge.

### Working-tree state — clean

```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

(`.claude/settings.local.json` should be added to `.gitignore` whenever convenient — Claude Code local settings, not project-relevant.)

### Resume sequence for tomorrow

1. `git pull` (in case Cursor or other surface lands overnight)
2. Decide order: **Marketplace tracking directive first** (the production bug is older + revenue-relevant for pilot demos) or **Part B audit first** (visible inconsistency in screenshots, easier QA gate)
3. Recommended sequence: **Tracking unification directive** in the morning (writing) + Cursor execute through the afternoon; **Part B audit** as parallel read while Cursor executes
4. Both can merge in the same evening if scoped tight

### Lessons added today

- **Firestore Console doesn't show collection doc count by default.** Sort UI requires field name input that's hidden in nested dialog. For real-time QA, F12 Network → filter `firestore` shows commits, but Firestore JS SDK uses WebChannel multiplexing — all writes hide inside `channel?` requests, not visible as discrete POSTs. Cleanest realtime debug path: `console.log` inside the tracking function itself, plus periodic Firestore Console refresh. Don't trust Firestore Console sort/filter for fast iteration.
- **LLM prompt language injection requires explicit instruction, not just a `lang` field in the data.** Earlier `aiBriefGenerator.js` had `lang` in the data payload but the system prompt was language-agnostic. LLM defaults to English when no explicit "Write in X" instruction is present. Fix pattern: separate `LANG_INSTRUCTIONS` map keyed by lang code, appended to system prompt. **Translate inline span content too** must be explicit (e.g., `'Top VIP' → 'كبار العملاء'`) otherwise the model preserves the original phrase inside translated paragraphs.
- **Polish branch was merged mid-day without explicit handoff signal.** Today's session started assuming dirty tree on `polish/pr1-demo-killers-sweep` per yesterday's handoff. Reality: branch had been merged + main pulled, only 5 small post-merge files were dirty. `git log --oneline -15` first thing in next session is the right move when handoff and `git status` disagree.
- **"Vista Residences + AED" is the Part B canary.** Whenever you see Vista (Canada project) with AED (Gulf currency) on a demo portal, it confirms portal route handler is reading region context incorrectly. Fast visual smoke test for Part B fix verification when it lands.

### Tone for resume

Today was clean execution despite the handoff drift. Arabic body fix landed cleanly. Marketplace tracking gap was found and documented without panic. Both open threads (tracking + Part B) are well-scoped for tomorrow — neither is revenue-blocking, both are pilot-prep work. Open next session with: *"Tracking unification mı, Part B audit mı? İkisi de Cursor-scope, sırayla geçeriz."*

---

## ✅ CLOSED — 2026-05-13 late EOD (everything from this block landed via merge `74276b3f` on 2026-05-14)

**Status:** Three new PR slices implemented and frontend deployed; one function redeploy + manual QA + commit split outstanding. Portal polish trilogy from earlier today (Cursor local work) is **still uncommitted alongside** these changes on the same branch.

### What shipped to production tonight

| Surface | Item | State |
|---|---|---|
| Hosting (`https://dynamicnfc.ca`) | New bundle with PR 1 + PR 1.5 (frontend half) + PR 2 + portal trilogy frontend | ✅ Deployed (227 files) |
| `aggregateCampaignTaps` scheduled fn | Writes `byLang.{en,ar,es,fr}` dict to `tenants/{uid}/aggregates/dailyBrief` every 15 min + legacy top-level fields | ✅ Deployed |
| `refreshDailyBriefAi` callable | LLM call now writes to `byLang.{lang}` slot + legacy top-level on click | ⚠️ Source change was in `lib/aiBriefGenerator.js`; Firebase intelligent diff missed transitive dep on first deploy. User attempted `firebase deploy --only functions:refreshDailyBriefAi --force` — verify with `firebase functions:log --only refreshDailyBriefAi -n 30` or Cloud Console; redo with `--force` if still stale |

### What is locally implemented but NOT YET committed

All on branch `polish/pr1-demo-killers-sweep` (only `f1970a1b docs(handoff)` is committed; everything else is dirty working tree). Suggested logical split into separate commits before merge:

**Commit A — PR 1 demo-killer sweep + sentence case + Unicode arrows (Cowork)**
- `frontend/src/components/UnifiedDashboard/TodaysBrief.jsx` (−37L) — `wrapVipName` + `wrapScoreChange` + helpers removed (function-side templates already deliver styled HTML; double-wrap caused `score-change">` text bleed)
- `frontend/src/pages/UnifiedDashboard/components/KanbanBoard.jsx` (+15L) — `idle_lead` + `repeat_visitor` added to `TRIGGER_LABELS` + `humanizeTriggerType()` fallback so future enum types render as sentence case
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` (−30L) — `text-transform: uppercase` swept from 39 `.ud-*` selectors (sentence case house rule)
- `frontend/src/i18n/portals/dashboard.js` — `"AT RISK"` → `"At risk"`, `"ZERO ENGAGEMENT"` → `"Zero engagement"` + 31 string ASCII `' -> '` → Unicode `' → '`
- `frontend/src/services/firestoreTracking.js` — `"HOT LEAD" / "WARM" / "INTERESTED" / "NEW"` fallback labels → sentence case
- `frontend/src/hooks/useDashboardData.js`, `frontend/src/i18n/pages/admin.js`, `frontend/src/services/mockDashboardData.js`, `frontend/src/pages/UnifiedDashboard/components/ActivityFeed.jsx`, `frontend/src/pages/UnifiedDashboard/components/NotificationSystem.jsx` — ASCII `' -> '` → Unicode `' → '` (7 arrows total across these)
- `functions/lib/briefTemplates.js` (+75L) — `pluralize()` + `HOURS_LABEL / DAYS_LABEL / TAPS_LABEL` per language; `ZERO_STATE_TEMPLATES` per language; `isZeroState()` helper; `generateBriefFromTemplate` short-circuits on zero-state; `1 hour` vs `5 hours` plural fixed; em-dash sweep in `PIPELINE_DELTA_TEMPLATES` for all 4 langs

**Commit B — PR 1.5 brief 4-language storage (Cowork)**
- `functions/index.js` — `aggregateCampaignTaps` scheduled fn now loops `SUPPORTED_LANGS = ["en", "ar", "es", "fr"]` and writes `byLang.{lang}` dict, preserving any LLM-fresh per-lang slot (5-min window). Legacy top-level fields (`paragraph1`, `paragraph2`, ...) preserved for migration safety.
- `functions/lib/aiBriefGenerator.js` — LLM-mode write goes into `byLang.{lang}` slot + legacy top-level. Cached return reads `cached.byLang?.[lang] || cached` (per-lang slice with legacy fallback).
- `frontend/src/components/UnifiedDashboard/TodaysBrief.jsx` — `normalizeBrief(brief, lang)` selects `byLang[lang] || byLang.en || brief` (legacy fallback). `useMemo` dep list now includes `lang`.

**Commit C — PR 2 topbar single-button lang + 2-letter region chip (Cowork)**
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.jsx` — `LANG_CYCLE` constant removed in favor of `nextLang(current, regionLanguages)` helper that toggles within the **active region's 2-lang pair** (Gulf EN↔AR, USA EN↔ES, Canada EN↔FR, Mexico ES↔EN). Single button replaces the prior multi-button cluster. Same logic in desktop topbar + overflow menu. **Important:** First pass cycled all 4 langs globally; user rejected ("her region in 2 dil ailesi var") and current implementation correctly scopes to per-region pair.
- `REGION_CODES = { gulf: "SA", usa: "US", mexico: "MX", canada: "CA" }` constant; flag emoji `{region?.flag}` (🇸🇦/🇺🇸/🇲🇽/🇨🇦) replaced with 2-letter chip in both region button and region menu. No-emoji house rule + Windows render parity (regional emoji flags don't render natively on Windows).
- `frontend/src/pages/UnifiedDashboard/UnifiedLayout.css` — new `.ud-region-code` chip rule (monospace, brand-accent fill + color, small letter-spacing).

**Commit D — Portal polish trilogy (Cursor local, untouched today)**
- Khalid + Ahmed + Marketplace polish per `docs/MARKETPLACE_PORTAL_AUDIT_AND_DIRECTIVE_2026_05_13.md` and companion audits. Implementation details in the existing "earlier today" block below.

**Commit E — Docs**
- `frontend/directives/UI_POLISH_SWEEP_DIRECTIVE.md` (Cowork — the original directive for PR 1 before role-split changed)
- `docs/UNIFIED_DASHBOARD_CRITIQUE_2026_05_13.md` (Cowork — the design critique that drove PR 1+2)
- `docs/MARKETPLACE_PORTAL_AUDIT_AND_DIRECTIVE_2026_05_13.md` + companion VIP / Ahmed portal audits (already untracked, per Cursor's handoff)
- This `CLAUDE_HANDOFF.md` update

### Manual QA outstanding (must run BEFORE merging the dashboard slices)

1. **Topbar lang toggle (PR 2)** — open `/unified/overview` in each region, confirm single button cycles the right pair:
   - Canada: EN ↔ FR
   - Gulf: EN ↔ AR (default AR)
   - USA: EN ↔ ES
   - Mexico: ES ↔ EN (default ES)
2. **Region chip (PR 2)** — region selector shows `CA / SA / US / MX` chip, NOT emoji flag, in both the topbar button and dropdown.
3. **Sentence case sweep (PR 1)** — no all-caps in `.ud-*` surfaces. `Idle lead` chip on Pipeline (not `IDLE_LEAD`). `At risk` not `AT RISK`. All eyebrows in sentence case.
4. **Today's Brief HTML leak (PR 1)** — no `score-change">` text fragment visible. VIP name + score-change phrase styled but rendered as React DOM, not bleed-through text.
5. **Today's Brief Arabic body (PR 1.5)** — switch to AR in any region with EN ↔ AR pair (Gulf). Body text + chip labels should be Arabic, not English. **Currently still English** in the screenshot user shared at the last test — most likely because:
   - Scheduled `aggregateCampaignTaps` hasn't fired post-deploy yet (every 15 min), so `dailyBrief.byLang` is not yet populated and frontend falls back to legacy top-level (English from pre-deploy template).
   - **Resolution paths (any one works):** wait 15 min for next scheduled run; manually trigger via `gcloud scheduler jobs run firebase-schedule-aggregateCampaignTaps --location=us-central1`; or click "Generate AI summary" while in AR (after confirming `refreshDailyBriefAi` was actually `--force` redeployed).
6. **Zero-state (PR 1)** — `Settings → Reset demo` (boots fresh tenant with no data). Brief should show "warming up" copy, not `$0 / 0 new VIPs / 0 times in the last 1 hours`. Plural `1 hour` (not `1 hours`).
7. **Marketplace funnel (Cursor local, see audit doc)** — anonymous incognito session, walk the 13-event chain, confirm each event reaches Firestore. **Do not merge Marketplace commit without this pass.**
8. **Existing functionality regression** — Sales Trigger Panel still navigates VIP CRM deeplink (Sprint 2 #2); Five-Minute Proof tutorial replay works (Sprint 2 #1); sidebar portal live signals (Sprint 2 #3 Part A) still render dot + count + age.

### Known sandbox quirk (not user-blocking)

The Cowork sandbox bash mount lagged behind the Windows file system during this session — `wc -l` saw multiple files as truncated mid-JSX while the Read tool (Windows live FS) saw them complete. `npx vite build` in the sandbox reported a parse error in `VIPPortal_Definitive.jsx` for this reason. **User-side `npm run build` on Windows ran clean** — this is purely a sandbox stale-mount issue, no real code corruption.

### Open production issue (still — Sprint 2 #3 Part B)

Sprint 2 #3 Part B (portal `useRegion()` content audit) is **not addressed by tonight's work**. Polish trilogy fixed the visual layer; Part B is the data-binding layer — buyer portals must consume `useRegion()` so persona/project/imagery follow the active region. Sidebar labels already swap correctly; portal route handlers may still be Gulf-hardcoded internally. Audit + directive next session.

### Resume sequence for tomorrow

1. `git status` from `polish/pr1-demo-killers-sweep` — confirm everything from this handoff is present in dirty tree.
2. Decide commit split (recommend A → B → C → D → E logical sequence above).
3. Run manual QA list (8 items above) — split into pre-deploy and post-deploy slices.
4. Force redeploy `refreshDailyBriefAi` if not already verified (`firebase deploy --only functions:refreshDailyBriefAi --force` + check log for invocation).
5. Marketplace funnel QA — incognito + 13-event Firestore confirmation.
6. Then merge to `main` (squash or staged depending on commit split chosen).
7. Sprint 2 #3 Part B audit (separate session — directive first, then Cursor implements).

### Tone for resume

A LOT shipped tonight across two role-split tracks (Cursor portal polish + Cowork dashboard polish). Both are local; production has the first deploy slice (hosting + scheduled fn). The frustrating "Arabic body still English" symptom is **architectural by design** — fix is in flight, just needs the scheduler to fire or a manual LLM call. Don't re-deploy out of impatience; verify with the log first.

---

## ▶︎ Earlier 2026-05-13 EOD — Portal polish trilogy (Cursor local)

**Status — portal makyaj (in progress, not merged):**
- **Khalid** (`VIPPortal_Definitive.jsx` + `VIPPortal.css`): global fonts/Tabler in `index.html` + `index.css`, amenities ROI RTL, WhatsApp FAB, 13 `trackEvent` preserved.
- **Ahmed** (`AhmedPortal.jsx` + `AhmedPortal.css`, `ahmedPortal.js`): teal accent, `portal_opened` includes `{ portal: "ahmed", language }`, same 13 events.
- **Marketplace** (`MarketplacePortal.jsx` + `MarketplacePortal.css`, `marketplacePortal.js`): cream/charcoal polish — Tabler amenities (dark icons), charcoal ROI CTA + `ti-calculator`, RTL on `documentElement`, sentence case, ~400ms reveals + `prefers-reduced-motion`, card pricing sub + `ti-lock`, register pill, bottom CTA classes. **All 13 events unchanged** (`npm run build` PASS last run).

**Suggested integration branch (user naming):** `polish/marketplace-portal-conversion-2026-05-13` or fold into existing **`polish/pr1-demo-killers-sweep`** (current dirty branch — see below).

**Before merge:** Manual **anonymous funnel QA** on `/enterprise/crmdemo/marketplace` (full chain to Firestore per audit doc). Lead form deep pass still deferred.

**Still next — production logic:** **Sprint 2 #3 Part B — portal `useRegion()` consumption** (routes stay shared; content must follow active region). Polish does not replace Part B.

### Git state — workspace (2026-05-13)

**Active branch:** `polish/pr1-demo-killers-sweep` (ahead of recent work; **uncommitted / unstaged** mix)

**Last known `main` anchor from prior handoff:**

```
454bb1a5  Merge Faz 1 Wave 2: 41 new tests (79 → 120 passing)
```

**Dirty paths (non-exhaustive — run `git status`):** `MarketplacePortal/*`, `VIPPortal/*`, `AhmedPortal/*`, `marketplacePortal.js`, `ahmedPortal.js`, `index.html`, `index.css`, plus Unified Dashboard / functions / docs (demo-killers sweep). **Untracked docs:** `docs/*2026_05_13*.md`, `frontend/directives/*`.

**Verify before ship:** `cd frontend && npm run build` · `npm test` (120) · grep `trackEvent("` count = 13 per portal file.

### Earlier shipped milestones (unchanged facts)

**Sprint 2 #3 Part A — Portal sidebar live signals**
- Three files: `lib/portalSignals.js` (new helper, ~60L), `UnifiedLayout.jsx` (+50L for sidebar render), `UnifiedLayout.css` (+50L for new classes)
- Logic: derive per-portal-type signals from `useDashboard().events` (already region+sector filtered)
- Display: 🟢 active dot (5 min window) + "N this wk" count (7d window) + "Xm/h/d ago" timestamp
- Idle state: only when literally zero events ever for that portal type (NOT a time cutoff)
- i18n: 6 new keys × 4 languages in `UnifiedLayout.jsx` LAYOUT_TEXT constant

**Faz 1 test infrastructure (88 new tests in one day):**

Wave 1 (Claude direct):
- `portalSignals.test.js` (11 tests) — pure function coverage
- `triggerRules.test.js` (14 tests) — Sprint 2 #2 detector coverage, FIX 2/4 lessons codified
- `regionConfig.test.js` (11 tests) — getPersonas 4×3 matrix + case/trim
- `eventDisplayMap.test.js` (11 tests) — normalization + sector overrides
- AIDemo HelmetProvider fix + stale assertion update

Wave 2 (Cursor):
- `testUtils/renderWith.jsx` (shared 19L utility — HelmetProvider + MemoryRouter)
- `firestoreTracking.test.js` (17 tests) — `trackDashboardEvent` no-auth/no-schema/success + collection path
- `useDashboard.test.jsx` (6 tests) — context exports, throws-outside, referential stability
- `KpiCard.test.jsx` (~5 tests)
- `MiniSparkline.test.jsx` (~4 tests)
- `SalesTriggerPanel/__tests__/index.test.jsx` (6 tests) — full render path including click → trackDashboardEvent + navigate

**Test suite delta:** 26 → 120 passing (+361%), 8 broken → 0 broken, 2.74s full run.

### Next session — merge + Part B

**Sprint 2 #3 Part B — portal region-awareness (still the production bug)**

User-reported symptom: "Portal linklerini incele hangi region da olursan olsun, ayni gulf region sitelerine gidiyor."

Partial diagnosis (still valid):
- Sidebar labels correctly swap per region via `personaLabel(personas.find(p => p.id === "vip1"))` in `UnifiedLayout.getPortalLinks()`
- Sidebar hrefs are static (`/enterprise/crmdemo/khalid`, `/enterprise/crmdemo/ahmed`, etc.) — same route for all regions
- Portal components (VIPPortal_Definitive, AhmedPortal, MarketplacePortal + auto equivalents) must be audited for **`useRegion()` / `getPersonas`** so content (project name, currency, personas) follows active region — **visual polish did not complete this.**

**Directive plan (unchanged intent):**

1. **Audit each demo portal:** `useRegion` + `useSector` + `getPersonas(sector, regionId)` + no Gulf-only hardcoding in data arrays.
2. **Write directive** at `frontend/directives/SPRINT2_3_PART_B_PORTAL_REGION_DIRECTIVE.md` (or equivalent).
3. **Cursor implements** → QA 4×3 region×sector → merge.

**Portal makyaj — 2026-05-13:** Khalid + Ahmed + Marketplace polish **implemented locally** (see RESUME HERE). Remaining before treat-as-done: **commit/PR**, **Marketplace funnel Firestore QA**, optional **lead form** audit.

**Faz 2 test groundwork (parallel track, low priority):**
- Firebase emulator setup for L2 hook testing (~30 min)
- Tests that need real Firestore semantics: `useDashboardData.js` tenant subcollection reads, seed protocol edge cases, retention/cleanup lifecycle
- Defer until Sprint 2 #3 Part B ships — keep test coverage growing organically

### Resume sequence

1. `git status` on `polish/pr1-demo-killers-sweep` (or user’s integration branch) — split PRs if needed (portals vs dashboard vs functions)
2. `cd frontend && npm run build` · `npm test` (120)
3. **Marketplace:** full anonymous funnel manual pass (13 events → Firestore)
4. **Part B:** region audit + directive → implementation
5. Deploy hosting only after bundle hash confirmation vs prod

### Tone for resume

Portal polish trilogy is **local/ready for review** — user can prioritize **merge + funnel QA** vs **Part B** based on revenue pressure; both tracks are documented.

### Open items unchanged

- Sprint 2 #5 — VIP Alert Summary
- Sprint 2 #6 — Outreach guardrail copy
- Sprint 2 #7 — Owner workload columns
- Steps 2-5 of Five-Minute Proof (first-pass Cursor SVGs; "makyaj sonra")
- Apple Developer Account enrollment
- Sentry production error monitoring
- Pitch deck update reflecting Unified Dashboard, Yacht sector, AI Demo, Google Wallet, 4-region parity

### Lessons added today

- **CRM demo portals — tracking contract:** Khalid, Ahmed, and Marketplace each expose **exactly 13** `trackEvent("` call sites for dashboard funnel math. Treat as merge gate: verify count + manual funnel QA (especially Marketplace lead gate chain) before shipping.
- **Light marketplace vs dark VIP:** On cream backgrounds, amenity/CTA icons use **charcoal** (`--mp-t1` / `#1a1a1f`), not gold/teal — avoids washed-out contrast.
- **`vi.hoisted()` is the right pattern for shared mock state** in Vitest component tests. Cursor used it in `SalesTriggerPanel/__tests__/index.test.jsx` — cleaner than `vi.mock` + module-level `let`. Adopt as standard for component tests with mutable mock state.
- **`testUtils/renderWith.jsx` (19L)** is the canonical pattern for component tests needing `HelmetProvider` + `MemoryRouter`. Reuse, don't duplicate the wrapper.
- **When seed data is older than your "today" cutoff, signal logic shows idle for everything.** Live portal signals originally used a 24h "today" window; with seed events spanning 2-9 days old, every portal showed "idle". Fix: separate **count window** (7d) from **idle definition** (no events ever, not "no events in 24h"). Lesson: when designing time-window UX, distinguish between "what shows in the count" and "what determines empty state" — these are different decisions.
- **Cursor's quality jumps after one fix-cycle round.** Wave 1 needed 7 audit fixes (Sprint 2 #2). Wave 2 needed zero — Cursor internalized the patterns from the previous review. The role split (Claude writes directives + audit, Cursor implements) compounds with repetition.
- **AIDemo `<SEO>` requires `HelmetProvider` in tests.** Any component using `react-helmet-async` will crash with `Cannot read 'add' of undefined` if the test render wrapper is missing `HelmetProvider`. This is the same root as a likely future bug in any other page test that hits a `<SEO>` boundary — preemptively use `renderWith()` helper.

---

## ✅ CLOSED — 2026-05-11 EOD (Sprint 2 #2 Sales Trigger Panel SHIPPED + 7 audit fixes)

### Today's git state on `main`

```
3a89f4ea  Merge Sprint 2 #2: Sales Trigger Panel               (no-ff merge of cursor/sprint-2-2-sales-trigger-panel)
00a9e205  chore(stp): remove debug logs (FIX 7)
8fdc5b08  fix(stp): select VIP before DOM check + re-fire on vips load (FIX 6 — includes 4 + 5 squashed)
6fc7c690  fix(stp): trust useDashboard filtering, remove defensive region/sector filter + debug logs (FIX 3)
ba1fdcf3  fix(stp): vipName-based enrich fallback + roi_calculator_click alias (FIX 2)
45201f7f  fix(stp): dashboard tracking via trackDashboardEvent (FIX 1)
45d9cef9  feat(overview): add sales trigger panel with VIP deeplink tracking  (Cursor PR #8 initial)
a8c98c83  docs(directive): Sprint 2 #2 FIX 1 — dashboard tracking helper
61256af4  docs(directive): Sprint 2 #2 revised — 7 triggers, deeplink, tracking, sector-aware i18n
7f66fa78  docs: handoff sync + Sprint 2 #2 Sales Trigger directive
```

Production deploy: `firebase deploy --only hosting` — 227 files uploaded successfully. New hashed bundles (e.g., `VIPCrmTab-CRwy67bV.js`, `OverviewTab-Dy47aRP-.js`) confirmed live.

### Tomorrow's first move — Sprint 2 #3 directive

User has confirmed continue with Sprint 2 #3 ("Sprint 2 #3 ile devam ederiz") and added a critical scope expansion. The directive should cover **both items in one PR**:

**A. Buyer Sites sidebar — Option A (canlı sinyaller)** *(from earlier scope brief)*
- Each existing "Portal Links" sidebar row gets a real-time signal:
  - 🟢 active dot = visitor in last 5 min
  - "X today" count badge
  - "last tap: 3m ago" timestamp
- Data source: existing `useDashboard().events` — no new Firestore listener
- Region+sector scoped via active context — when user switches Canada→Gulf, signal counts swap
- Estimated ~150 lines new code in `UnifiedLayout.jsx` + small CSS additions

**B. Portal region-awareness bug fix** *(discovered EOD 2026-05-11)*
- **Symptom (user-reported):** "hangi region da olursan ol, ayni gulf region sitelerine gidiyor"
- **Root cause partial diagnosis (Claude, ~30s grep):**
  - Sidebar **labels** ARE region-aware (line ~336-347 of `UnifiedLayout.jsx`): `personaLabel(personas.find(p => p.id === "vip1"))` swaps Marc Patel ↔ Khalid ↔ etc. correctly per region.
  - Sidebar **hrefs are static** (e.g., `/enterprise/crmdemo/khalid`, `/enterprise/crmdemo/ahmed`, `/automotive/demo/khalid`, etc.) — same route regardless of active region.
  - The portal route handlers themselves (`VIPPortal_Definitive`, `AhmedPortal`, `MarketplacePortal` and automotive equivalents) must internally read `useRegion()` and swap persona/project/imagery accordingly. **This may be incomplete or hardcoded to Gulf defaults** — needs verification before writing the fix.
- **Step 1 of directive:** Read each demo portal component end-to-end and audit:
  1. Does it import `useRegion` and `useSector`?
  2. Does it call `getPersonas(sector, regionId)` to pick the right persona block?
  3. Does it use region-aware project labels (Al Noor Residences vs Vista Residences vs Hacienda etc.)?
  4. Are any data arrays hardcoded for Gulf (e.g., a hardcoded `towers` array, hardcoded SAR currency, hardcoded Arabic-specific copy outside i18n)?
- **Step 2:** Write a single directive covering both A and B — Cursor implements, you audit, merge.

**Scope decision pending from user before writing directive:**
- Combine A + B in one PR (recommended — both touch the sidebar + buyer-facing portal layer, naturally cohesive), OR
- Two separate PRs (B first as a production bug fix, A second as a feature)

### Resume sequence for tomorrow

1. Confirm with user: "A + B tek PR mı, yoksa B önce production bug fix sonra A?"
2. Read demo portal components (VIPPortal_Definitive, AhmedPortal, MarketplacePortal + automotive/yacht equivalents) to ground the B-section of the directive.
3. Write directive at `frontend/directives/SPRINT2_3_BUYER_SITES_PORTAL_REGION_DIRECTIVE.md`.
4. Hand off to Cursor Cloud Agent.
5. Audit returned PR with same 7-fix-cycle discipline applied today.

### Tone for resume

User ended the day with momentum — both Sprint 2 #2 ship and Step 1 re-verification clean. EOD energy was "yavaş yavaş sona geliyoruz" — winding down but satisfied. Open the next session with the A vs B-first question, then proceed.

---

## ✅ CLOSED — 2026-05-11 EOD (Sprint 2 #2 Sales Trigger Panel SHIPPED + 7 audit fixes)

### What shipped

**Sales Trigger Panel** — new surface on `/unified/overview` between `TodaysBrief` and `SalesVelocity`. Detects 7 named-VIP behavior signals from `useDashboard()` data with zero new Firestore listeners. Tier-balanced render: max 5 HOT + 3 WARM. Sector-aware i18n across all 4 languages. Region-aware accent via `--stp-accent` CSS variable. Deeplink: "Open profile" navigates to VIP CRM, auto-selects target VIP, scrolls + highlights, opens the detail pane. `trigger_acted_on` Firestore event written on every click for Decision Speed measurement.

**7 trigger detection rules:**
- HOT (4): `HIGH_INTENT` (pricing/brochure/booking from VIP), `CONTACT_AGENT`, `REPEAT_VIEW` (same item 3+ in 15 min), `ROI_COMPLETED`
- WARM (3): `RE_ENGAGE` (24h idle + recent return), `HIGH_VALUE_DEAL_IDLE` (5M+ deal, 48h+ idle), `MULTIPLE_VIPS_SAME_ITEM` (competition signal)

**Files:**
- New: `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/{index.jsx, SalesTriggerPanel.css, triggerRules.js}` (~640L total)
- Modified: `OverviewTab.jsx` (+3L integration), `VIPCrmTab.jsx` (+38L deeplink consumption + reset-order fix), `dashboard.js` i18n (+264L sector-aware), `firestoreTracking.js` (+38L `trackDashboardEvent` helper + EVENT_SCHEMA entry)

### Why 7 audit fixes were needed — Lessons

The Cursor first-pass PR (commit `45d9cef9`) shipped with directive-faithful code that compiled cleanly, but several subtle architectural mismatches surfaced during smoke testing. Each fix is a transferable lesson:

1. **FIX 1 — `track()` is buyer-portal only.** `firestoreTracking.js`'s `track()` early-returns when `_session` is null, and writes to top-level `behaviors` collection. The Unified Dashboard has no session and reads from tenant-scoped `tenants/{uid}/events/`. Directive said "use `track`" without auditing the gating logic. Fix: new export `trackDashboardEvent(event, payload)` that takes uid from Firebase Auth and writes to `tenants/{uid}/events/`. **Lesson: when crossing buyer-side ↔ admin-side, verify auth context + collection path explicitly. `track`'s name suggested it was generic; it wasn't.**

2. **FIX 2 — Seed events have `vipName` but no `vipId`.** `enrich()` filtered events on `e.vipId && vipById.has(e.vipId)` — and all seed events have only `vipName`. Net: every event rejected, panel empty. Fix: enrich falls back to `vipName` matching when `vipId` is missing, and stamps the resolved `vip.id` onto the enriched event so downstream rules group consistently. Also added `roi_calculator_click` to `ROI_KEYS` (seed uses this variant, directive only listed normalized form). **Lesson: when writing detect logic against seeded data, dump a sample event shape FIRST. The seed schema is the source of truth, not the directive's mental model.**

3. **FIX 3 — Defensive region/sector filter was the actual bug.** The panel layer re-filtered events/vips/deals by `region` and `sector` fields. But `useDashboard` already filters via `filterBySectorAndRegion` AND drops those fields from returned objects. Net: `e.region === "gulf"` → `undefined === "gulf"` → false → every row rejected. **Lesson: CLAUDE.md §11 "no defensive fallbacks for impossible internal states (trust internal code)" is real engineering advice, not aspirational. The belt-and-suspenders instinct here cost an entire diagnostic round-trip.**

4. **FIX 4 — Dedupe per `ruleType:vipId:item` was too granular.** User saw "Khalid Al-Rashid" twice (once for ROI, once for booking) and "Fatima Al-Mansouri" twice. Sales rep mental model wants ONE row per VIP showing the strongest signal. Fix: dedupe key changed to `vipId` only, prefer HOT over WARM, then most recent. **Lesson: dedupe granularity is a product/UX decision, not a code-elegance decision. "Which row tells the rep what to do next?" → at most one per buyer.**

5. **FIX 5 — useEffect declaration order matters when multiple effects setState on the same value.** VIPCrmTab had a "reset on config/region change" effect that calls `setSelectedVipId(null)`. The deeplink effect (added in this sprint) also calls `setSelectedVipId(targetVipId)`. Both ran on mount; whichever declared LAST wins because React's last state setter in a render cycle takes precedence. Swapping declaration order put deeplink last — almost fixed it. **Lesson: when two effects touch the same state, declaration order is load-bearing. Document it inline.**

6. **FIX 6 — `listRef.current` is null on first mount; guards must let state-setting happen before DOM logic.** The deeplink effect did `if (!targetVipId || !listRef.current) return;` BEFORE calling `setSelectedVipId`. On first mount, the VIP list hadn't rendered yet → `listRef.current` was null → effect bailed out → selection never happened. Fix: move `setSelectedVipId(targetVipId)` BEFORE the listRef guard, and add `effectiveVips?.length` to deps so the effect re-fires when the list mounts. **Lesson: separate "state operations (no DOM needed)" from "DOM operations" with their own early returns. Conflating them creates this mount-race trap.**

7. **FIX 7 — Debug logs must come out in the same PR that proves the fix.** Per CLAUDE.md "Cleanup rule — non-negotiable", any structured diagnostic logs added during a fix session are removed in the commit that ships the fix. Done.

### Diagnostic approach that worked

Step that broke the empty-panel mystery: a single structured `console.log("[STP-DEBUG]", { eventsIn, vipsIn, scopedEvents, scopedVips, enriched, sampleEvent, sampleVip, uniqueVipNames, vipNames })` log dump. First run showed `eventsIn: 28, scopedEvents: 0` — that one line eliminated 5 wrong hypotheses and pointed straight at the defensive filter. **Lesson: when stuck on "why is X empty?", log everything the function received, scoped, transformed — in one object — and let the data narrow the search.**

### Step 1 production re-verification (also done today)

User confirmed Step 1 (Five-Minute Proof Identity SVG) renders cleanly on all 4 regions in production same session ("ok, temiz"). No watermark drift, no persona overflow, no animation glitch across Canada → Gulf → USA → Mexico cycle. The 2026-05-08 morning "to-do" item is now closed.

### Portal region-awareness bug discovered (NEW, deferred to Sprint 2 #3)

EOD user-reported: "Portal linklerini incele hangi region da olursan olsun, ayni gulf region sitelerine gidiyor." Initial 30-second grep audit revealed sidebar labels swap personas correctly per region, but hrefs are static routes. The route handlers (demo portal components) may be missing `useRegion()` injection or have hardcoded Gulf defaults. Full audit of each portal component is the first step of tomorrow's Sprint 2 #3 directive.

### Open items unchanged

- Sprint 2 #5 — VIP Alert Summary
- Sprint 2 #6 — Outreach guardrail copy
- Sprint 2 #7 — Owner workload columns
- Steps 2-5 of Five-Minute Proof (still using first-pass Cursor SVGs; "makyaj sonra" — visual redesign deferred)
- Apple Developer Account enrollment
- Sentry production error monitoring
- Pitch deck update reflecting Unified Dashboard, Yacht sector, AI Demo, Google Wallet, 4-region parity

---

## ✅ CLOSED — 2026-05-08 → 2026-05-10 (Step 1 commit chain + git remote sync)

**Status:** Step 1 originally shipped 2026-05-07 evening with local-only commits + direct local-build deploy. Resume on 2026-05-08 cleaned up the git push state. Step 1 has been live and stable since 2026-05-08 morning.

(Full detail in the now-superseded RESUME blocks below.)

---

## ▶︎ (Superseded) RESUME HERE — 2026-05-08 morning

**Status:** Step 1 is LIVE in production at https://dynamicnfc.ca/unified/overview — user visually verified during today's session ("tamamdir calisiyor"). Sprint 2 #4.8 (`/unified/overview` 404 fix) finally committed after sitting uncommitted since 2026-05-06. Next functional priority: **Sprint 2 #2 — Sales Trigger Panel**, scope drafted but Cursor directive not yet written.

### ⚠️ Two things to clean up FIRST thing tomorrow morning

**1. Git push was rejected — origin/main is 4 commits behind local.** Production has the new code (deployed local build directly), but the git remote does not. Fix:

```powershell
cd C:\Users\oguzh\DynamicNFC
git status                      # Should show "ahead of 'origin/main' by 4 commits"
git pull --rebase origin main   # Bring any origin work below ours
git push                        # Sync
```

The 4 local-only commits (oldest → newest):
```
9acc9ccf  fix(routing): explicit /unified/overview route (Sprint 2 #4.8)
d0a3ae98  feat(overview): Step 1 Identity full SVG redesign (Sprint 2 #1.2)
335de91c  docs(handoff): Sprint 2 #1.2 closed + gitignore design previews
0903c458  chore: gitignore design preview artifacts
```

If rebase has conflicts (unlikely), capture diff and paste to Claude.

**2. Visual sanity-check Step 1 in production.** ~2 minutes. Open https://dynamicnfc.ca/unified/overview (login `info@dynamicnfc.help`), Settings → Replay tutorial, switch region across all 4 (Canada → Gulf → USA → Mexico). Already verified locally, but production CDN cache / SW interactions can surprise.

### Then start Sprint 2 #2 — Sales Trigger Panel

User reframed direction during today's session: *"yazılım tam adam olsun, sonra makyaj yaparız"* — Steps 2-5 visual redesign is **deferred**, functional Sprint 2 items take priority. Sales Trigger is first up.

**Scope already drafted and shared with user (awaiting `OK` to proceed with directive):**

> Real-time VIP behavior signal panel on Overview. Sits between `SalesVelocity` and `Weekly Trend` cards, full-width. Detects 4 trigger types from existing `events + vips + cards + deals` data (no new Firestore listener — `useDashboard` already streams). Each trigger row: urgency dot + VIP name + score + signal description + age + "Open profile" action button (routes to `/unified/vip-crm/{vipId}`). Max 5 shown, sorted urgency × age. Empty state copy.
>
> **Trigger rules (MVP, 4 types):**
> - `REPEAT_VIEW` — Same VIP + same item, 15min window, 3+ events → hot
> - `HIGH_INTENT` — `request_pricing` / `download_brochure` / `book_viewing` event → hot
> - `RE_ENGAGE` — VIP 24h+ idle, new event arrived → warm
> - `CONTACT_AGENT` — `contact_agent` event triggered → hot
>
> **File plan (~600 lines, 4-5 files, Cursor scope per role split):**
> - `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/index.jsx` (~150L · UI)
> - `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/SalesTriggerPanel.css` (~100L · region-aware via `--fmp-accent` pattern)
> - `frontend/src/components/UnifiedDashboard/SalesTriggerPanel/triggerRules.js` (~120L · pure detect functions)
> - `frontend/src/i18n/portals/dashboard.js` (+12 strings × 4 lang = ~48 entries)
> - `frontend/src/pages/UnifiedDashboard/tabs/OverviewTab.jsx` (+5L integration)
>
> **Deferred to v2:** admin-editable thresholds, custom action templates per trigger, outreach draft writing (Sprint 2 #6's job), push notifications, dismiss/snooze.

**Resume sequence for tomorrow:**

1. Show user the scope summary. Ask for `OK` or adjustments (trigger rules, position, scope additions/removals).
2. Once aligned, **write the Cursor directive** to `frontend/directives/SPRINT2_2_SALES_TRIGGER_DIRECTIVE.md` with: file-by-file plan, exact prop signatures, trigger detection logic (pseudocode → JS), trigger row anatomy (JSX structure + CSS class names), i18n key list with English source strings, verify steps (npm run build PASS, manual test scenarios for each trigger type with seeded events).
3. User pastes directive into Cursor Cloud Agent.
4. Cursor executes → audit → merge.

### Tone for resume

User ended the day with momentum but fatigued. Step 1 ship felt good. They explicitly want a **fresh-chat tomorrow** ("yeni baslangic yapalim") — paste this whole file at the top, start clean. Open with: *"Step 1 production'da, gözle doğrulanmış. İki temizlik var: git push senkronu + production gözle kontrol. Sonra Sprint 2 #2 scope'una `OK` ver, directive yazıyorum."* Don't recap iteration history — user lived it. Get to the OK/adjust gate fast.

### Open items deferred (unchanged from today's plan)

- **Region symbol watermark behind Step 1 nameplate** — multiple iterations confirmed it doesn't fit at small scale. Revisit only if Steps 2-5 establish a consistent watermark zone (likely full-canvas backdrop, not behind-nameplate).
- **Steps 2-5 visual redesign** — user said *"makyaj sonra"*. Functional Sprint 2 items first, visual polish later.
- **Sprint 2 #3-7** (Buyer Sites sidebar, VIP Alert Summary, Outreach guardrail copy, Owner workload columns) — queue unchanged.
- **Error Boundaries** — flagged today as critical (CookieConsent white-screen scare confirmed: one bad component kills whole route). Tactical fix for a future sprint, not blocking #2.

### Lessons added today

- **Sprint 2 #4.8 was claimed "closed" yesterday but never actually committed.** The App.jsx route addition was sitting uncommitted in the working tree all day. Found today during the Step 1 commit pass and finally committed as `9acc9ccf`. Lesson: when a fix is described as "closed + production verified," double-check the commit actually went in. The handoff line `[App.jsx commit]  fix(routing): add explicit /unified/overview route` had no SHA — that should have been the red flag.
- **`echo "x" >> .gitignore` in PowerShell can silently no-op** (no error, no append). Use `Add-Content -Path .gitignore -Value "`nx"` instead. Found today when `design-previews/` kept showing as untracked even after the chore commit.
- **Ad blockers (uBlock / AdBlock) silently block `localhost:3000/src/components/CookieConsent/CookieConsent.jsx` in Vite dev mode** — the path-string match on "CookieConsent" trips their cookie-banner filter. App.jsx import fails → React mount fails → white screen with no terminal-side error. Production build is unaffected (hashed bundle filenames don't pattern-match). When debugging "blank dev mode" symptoms, check F12 → Console for `net::ERR_BLOCKED_BY_CLIENT` before assuming code regression.

---

## ✅ CLOSED — 2026-05-07 evening (Sprint 2 #4.8 + Sprint 2 #1.2 shipped to production)

**Sprint 2 #4.8 finally landed** — `9acc9ccf fix(routing): explicit /unified/overview route`. Yesterday's handoff claimed this was done, but the App.jsx edit was sitting uncommitted. Recovered during today's commit pass.

**Sprint 2 #1.2 shipped** — Step 1 Identity SVG redesign + supporting CSS + props pipeline:
- `d0a3ae98 feat(overview): Step 1 Identity full SVG redesign (Sprint 2 #1.2)` — 3 files touched (Step1Identity.jsx full rewrite ~260L, TutorialStep.jsx +30L label pass-through, FiveMinuteProof.css +170L animation block)
- `335de91c docs(handoff): Sprint 2 #1.2 closed + gitignore design previews` — handoff update + .gitignore
- `0903c458 chore: gitignore design preview artifacts` — small followup

**Build + deploy verified:**
- `vite build` 18.81s, 1915 modules transformed, zero errors
- `firebase deploy --only hosting` — 227 files uploaded, "Deploy complete!"
- Production URL: https://dynamicnfc-prod-68b4e.web.app (primary domain: dynamicnfc.ca)

**Visual verified locally** by user on `npm run dev`. Initial white-screen scare turned out to be ad-blocker / CookieConsent dev-mode quirk (now documented in Lessons).

**Sprint 2 #2 scope brief drafted and shared with user** at end of session. User said "simdilik duralim, yoruldum, yarin buradan baslariz" — directive write deferred to tomorrow's session.

**⚠️ State drift to fix tomorrow:** `git push` was rejected (origin/main had work we didn't have locally). User went straight to build+deploy without doing `git pull --rebase + git push`. Production is live with new code, but the git remote is 4 commits behind. First-thing-morning fix documented in RESUME HERE above.

---

(Original RESUME HERE for 2026-05-08 morning — now superseded by the new RESUME above)

Sprint 2 #1.2 closed. **Step 1 of the Five-Minute Proof tutorial is fully redesigned** and integrated: editorial premium-box reveal scene with brushed black-metal NFC card (credit-card aspect, no chip, Comfortaa wordmark, QR with center mark, FIRST EDITION serial, crimson edge accent, hologram strip), midnight-navy presentation box (3-tone gold rim, silk lining peek, foil-stamp ribbon, DynamicNFC + PREMIUM INVITATION mark), concentric NFC pulse rings (replaces previous "mountain" wave-arcs), tap dot + 2 ripple rings, dashed connection line, editorial nameplate (persona + role + location + ACTIVE pip + TAP REGISTERED timestamp), 01·IDENTITY eyebrow top-left.

All 4 regions covered via existing `--fmp-accent` CSS variable on `.fmp-card[data-region]` + region-specific `personaName` / `projectLabel` / `locationLabel` props passed from TutorialStep.jsx via `regionConfig` (persona, project) + `mapRegionConfig` (city). Long persona names (KHALID AL-RASHID, CARLOS RODRIGUEZ) auto-shrink: font-size 13.5 → 11, letter-spacing 1.3 → 0.6 when `name.length > 14`. Nameplate widened from 100 to 120 units and shifted left to `translate(348, 92)` for breathing room.

**No region symbol watermark in this round.** User explicitly deferred ("c simdilik kalsin"). Three watermark approaches were prototyped during the iteration (broken maple leaf path, Vancouver mountain ridge outline, RegionMorphLoader blueprint port) — each had compositional issues at the 100-wide nameplate scale. Decision: ship Step 1 clean, revisit watermark idea as a separate polish pass (would likely need a larger backdrop zone, not a watermark behind the name).

### Working state when user closed

- **Files touched today:**
  - `frontend/src/components/UnifiedDashboard/FiveMinuteProof/illustrations/Step1Identity.jsx` — full rewrite (was 61L wireframe, now ~260L editorial scene)
  - `frontend/src/components/UnifiedDashboard/FiveMinuteProof/TutorialStep.jsx` — added `PROJECT_SHORT_LABEL` + `COUNTRY_SHORT_LABEL` maps, computed `projectLabel` + `locationLabel` via `getRealEstateMapRegionData`, passed to Illustration
  - `frontend/src/components/UnifiedDashboard/FiveMinuteProof/FiveMinuteProof.css` — appended Step 1 animation block (~170 lines): `fmp-s1-*` classes + 9 keyframes (rise, fade, fade-up, card-rise, pulse-out, tap-pulse, tap-ring, draw, draw-long, pip) wrapped in `prefers-reduced-motion: no-preference` guard
  - `design-previews/step1-identity-*.html` — 7 iteration HTML files (concepts A/B/C, v3, v4, A-refined, A-v3, A-v4, 4-regions v5, 4-regions v6-blueprints) — design artifacts, not deployed, gitignore candidate
- **Build verified** via sandbox `vite build --outDir /tmp/dnfc-dist`: **1917 modules transformed in 37.85s, zero errors**. Cross-mount EPERM on real `dist/` prevented in-place build but that's a sandbox issue, not a code issue.
- **Visual verified on `npm run dev`** at end of session — Step 1 renders, animation cycle plays, user confirmed "tamamdir calisiyor". Initial white-screen scare turned out to be an ad-blocker / `CookieConsent.jsx` dev-mode quirk (see Lessons), unrelated to Step 1 changes.
- **`main` HEAD** ahead by these uncommitted edits. Tree status pending — run `git status` first thing.

### First moves tomorrow (in this order)

1. **`git status`** — confirm uncommitted state. Three files (Step1Identity.jsx, TutorialStep.jsx, FiveMinuteProof.css) should appear modified.
2. **Visual walkthrough on `npm run dev`** — open `/unified/overview`, replay the tutorial (Settings → Replay tutorial), switch region across all 4 (Canada → Gulf → USA → Mexico). Confirm:
   - Card metal sheen + brush texture renders cleanly
   - Persona names don't clip on any region (Gulf + Mexico are the long-name risks)
   - Concentric pulse rings + red tap dot + 2 ripple rings fire during cycle
   - Dashed connection line draws from card → nameplate top
   - Region accent flows correctly to role + connection + ACTIVE pip + bottom-line gradient
   - `prefers-reduced-motion` users see final static state, no animation
3. **Decide Step 2 disposition** — current `Step2Track.jsx` is still the original Cursor first-pass wireframe. Same redesign treatment needed for parity. If demo time pressure → ship Step 1 standalone now, batch Steps 2-5 next week.
4. **Commit + deploy** when visual passes:
   ```
   git add frontend/src/components/UnifiedDashboard/FiveMinuteProof/
   git commit -m "feat(overview): Step 1 Identity full SVG redesign (Sprint 2 #1.2)"
   cd frontend && npm run build && cd .. && firebase deploy --only hosting
   ```

### Open items / deferred

- **Region symbol watermark behind nameplate** — deferred. Could come back as: (a) larger full-canvas backdrop with low opacity using RegionMorphLoader blueprints (the user's original suggestion, but compressed compositionally), (b) single iconic element per region (one building, not a scene), or (c) skipped entirely if Steps 2-5 don't need it either.
- **Steps 2-5 redesign** — `Step2Track.jsx`, `Step3Score.jsx`, `Step4Alert.jsx`, `Step5Close.jsx` are all original first-pass Cursor SVGs. Step 1 sets the visual bar; the others need to match.
- **Sprint 2 #2-7** (Sales Trigger panel, Buyer Sites sidebar, VIP Alert Summary, Outreach guardrail copy, Owner workload columns) — queue unchanged from yesterday.

### Reference branches & commits

```
main HEAD (before today's session):
  a08dcc81  docs(handoff) + fix(settings): EOD 2026-05-06
  71346720  feat(overview): polish Five-Minute Proof illustrations (Sprint 2 #1.1)
  a80c72a7  docs: Sprint 2 #1 closed, Sprint 2 #1.1 illustration polish directive

main HEAD after today's commit (when user commits):
  [new]     feat(overview): Step 1 Identity full SVG redesign (Sprint 2 #1.2)
  a08dcc81  (previous)
```

### Lessons worth keeping

- **SVG region-symbol watermarks (flag iconography, skyline silhouettes, terrain) don't compress well behind a 100-wide nameplate.** Either need a much larger watermark zone (full-canvas backdrop) or a fundamentally different decoration approach (single iconic element). Multiple iterations confirmed this.
- **Long persona names overflow fixed-width nameplates.** Conditional `font-size` + `letter-spacing` based on `name.length > 14` is the clean pattern. Future tutorial steps and any other rendered persona text should adopt it.
- **Cross-platform mount build failures from the sandbox** — npm install on the sandbox doesn't pick up Linux-specific optional dependencies that the Windows host skipped. Fix: `npm install @rollup/rollup-linux-x64-gnu --no-save` then `vite build --outDir /tmp/...` to avoid the cross-mount `dist/` EPERM.
- **Comfortaa is the closest Google Font match to the actual DynamicNFC wordmark** (rounded geometric sans). For any in-illustration brand-mark rendering, use `font-family: 'Comfortaa', 'Quicksand', sans-serif`.
- **Ad blockers (uBlock / AdBlock) silently block `localhost:3000/src/components/CookieConsent/CookieConsent.jsx` in Vite dev mode** — the path-string match on "CookieConsent" trips their cookie-banner filter. App.jsx import fails → React mount fails → white screen with no terminal-side error. Production build is unaffected (file becomes part of a hashed bundle, no string match). When debugging "blank /unified/overview" or "blank Home" in dev, check F12 → Console for `net::ERR_BLOCKED_BY_CLIENT` before assuming code regression. Fix: whitelist localhost in the ad blocker, or use Incognito with extensions off.
- **The previous Step 1 wireframe was the "before" baseline.** v4 sets the new bar: brushed metal card + presentation box + editorial nameplate. The visual leap was significant — Steps 2-5 will feel like a different product if not brought up to the same level.

### Tone for resume

User went home with Step 1 in a state they'd consider shippable. They asked for honest senior-designer iteration across multiple rounds (A/B/C concepts, then v3/v4 polish, then watermark experiments, then "c simdilik kalsin" decisive cut). Open the next session with a focused: "Step 1 build PASS. Want to walk through it visually first, or queue Step 2 design directly?" Don't re-litigate the watermark deferral.

---

## ✅ CLOSED — 2026-05-07 (Sprint 2 #1.2 — Step 1 Identity full SVG redesign)

User flagged Step 1 visually as "cok amator gorunuyor" early in the session. Multi-round senior-designer iteration produced the new editorial scene; integrated into JSX with build verified.

**Iteration trail:**

1. **3 concepts presented (A/B/C)** in `design-previews/step1-identity-concepts.html`:
   - A — "The Reveal" (premium box opens, NFC card emerges)
   - B — "Editorial Triptych" (anonymous → tap → known, 3-column narrative)
   - C — "Identity Stamped" (diplomatic dossier + VIP stamp)
2. User asked to see **A and C animated** with replay buttons → `step1-identity-A-and-C-animated.html`.
3. User picked **A** but with refinements ("kart ve kutuyu adam etmek lazim" + uploaded real DynamicNFC card photos).
4. **v3** refined the card depth (vignette + brush texture + bottom highlight), QR clarity (3 markers + center NFC mark), NFC waves (3→4 arcs + aura), tap ripple (single → solid dot + 2 staggered rings), card→nameplate dashed connection, editorial polish (01·IDENTITY eyebrow + timestamp + ACTIVE pip).
5. User: "hala biraz daha ilgiye ihtiyaci var" → v4 introduced gerçek brushed metal (no fake credit-card baseline), Comfortaa wordmark, QR replacing chip, real-card layout fidelity, premium box with silk lining + ribbon + foil-stamp wave mark.
6. User: "her bolgenin bir simgesi olmasi gerekir, arka tarafta ismin arkasinda" → v4 added region symbol watermark (maple leaf path). Path was broken (rendered as 18-point ninja star).
7. User: "kanada bayragi yapragi ile ugrasma yapamiyorsun, Vancouver ozlesmis dag" → replaced with mountain ridge outline (The Lions + Grouse + Seymour + snow cap). User approved Canada.
8. User: "ok devam et hepsi icin yap" → built v5 4-region rollout with mountain ridge / Riyadh skyline / Manhattan skyline / Mexico volcanoes silhouettes.
9. User: "yok bu sekilde olmadi, bolge ve sektor gecislerinde kullandigimiz animasyonlari arkasinda gosterelim" → v6 ported `RegionMorphLoader` BLUEPRINTS data as watermark behind nameplate.
10. User: "olmamis, tekrer teker incele" → Claude critiqued each region honestly. Issue diagnosed: blueprints are wide horizontal scenes that compress poorly into the 100-wide nameplate zone, plus long-name clipping (KHALID/CARLOS).
11. User: "c simdilik kalsin" — chose Option C (drop watermark, fix long names, ship clean).
12. **Integration:** Step1Identity.jsx rewritten with v4 SVG (no watermark) + long-name conditional font-size. TutorialStep.jsx now computes `projectLabel` + `locationLabel` from `regionConfig` + `mapRegionConfig` and passes to Illustration. FiveMinuteProof.css gained 170 lines of `fmp-s1-*` animation block.

**Build verification.** `npx vite build --outDir /tmp/dnfc-dist` on sandbox: 1917 modules transformed in 37.85s, zero errors. Cross-mount EPERM on actual `dist/` is a sandbox limitation, not a code issue — user's `npm run build` on Windows will write to `frontend/dist` normally.

**What did not ship:**
- Region symbol watermark behind nameplate (3 iterations attempted, all visually broke at small scale)
- Steps 2-5 redesign (Step 1 only this round)
- Any change to existing `getPersonas` / `getRegion` / `getProjectName` APIs (untouched)
- Any change to `RegionMorphLoader` / sector morph loaders (untouched)

---

## (Original RESUME HERE from yesterday — historical context)

Oguzhan stopped at end of day with #1.1 illustration polish work delivered by Cursor on `cursor/sprint-2-1-1-illustration-polish` (commit `f30f55ee`). Audit PASSED — Claude reviewed line counts, accent usage matrix, brand-mark presence, persona-name labeling, animation guards. Audit blob is in §"Sprint 2 #1.1 closed" section below.

User's last statement: *"Simdilik calisiyor, ama sorunlar var, uzerinde gidecegiz."* — current state functions but visual issues exist that were not captured in detail before the session ended.

### Working state when user closed

- **`main` HEAD** still does NOT include #1.1 (no merge yet).
- Branch `cursor/sprint-2-1-1-illustration-polish` pushed, audit-approved, awaiting merge.
- **Possibly uncommitted in local working tree:** the SettingsTab replay button fix (auto-navigate after `replayTutorial()`, removed `disabled` prop, dropped unused `tutorialState` from destructure). Recommended to bundle with #1.1 merge if not yet committed. Verify with `git status` first thing in the morning.

### First moves tomorrow (in this order)

1. **`git status`** — confirm what is and isn't committed locally. The SettingsTab replay fix may need a commit if user did not bundle it into the morning's `git push`.
2. **Capture the polish-pass issues.** User said "sorunlar var" but did not enumerate. Ask Oguzhan to walk through Steps 1–5 on `npm run dev` (or the deployed state if he merged + deployed) and list specific visual problems. Examples worth probing for:
   - Persona name chip readability at default region accent (gold/navy contrast on white background — possible WCAG fail)
   - Step 4 notification card spacing — RTL flip behavior
   - Step 5 BOOKED badge size / collision with confetti shapes
   - DynamicNFC card iconlet legibility at 20×12 px (may be too small to read "Dynamic NFC" wordmark)
   - Region accent visibility on Canada (navy is dim against neutral grays — may need stronger fill)
   - Step 3 thermometer proportions / Sarah Chen / Tom Lee row alignment with the chip on the right
   - Animation timing — pulse rate too aggressive vs ambient
3. **Decide #1.1 disposition:**
   - If issues are minor polish → merge `cursor/sprint-2-1-1-illustration-polish`, deploy, then address polish in a #1.2 follow-up
   - If issues are blocking → write a focused fix directive on top of `f30f55ee`, send back to Cursor before merge
4. **Update handoff** once disposition is clear.

### Reference branches & commits

```
main HEAD (yesterday end):
  [latest]  fix(routing): add explicit /unified/overview route (Sprint 2 #4.8)
  8caf3f45  feat(animations): convert Auto/Yacht morph loaders to regular CSS (Sprint 2 #4.7)
  56731144  docs: github-summaries/2026-05-05.md
  ... (Sprint 2 #4 chain)

Pending merge:
  origin/cursor/sprint-2-1-five-minute-proof    c49906bc  Sprint 2 #1 (already merged earlier today)
  origin/cursor/sprint-2-1-1-illustration-polish f30f55ee  Sprint 2 #1.1 — AWAITING USER DECISION
```

### Active queue after #1.1 merges

- **Sprint 2 #1.2** (potential, conditional on tomorrow's review) — illustration polish round 2
- **Sprint 2 #2** — Sales Trigger panel
- **Sprint 2 #3** — Buyer Sites sidebar
- **Sprint 2 #5** — VIP Alert Summary
- **Sprint 2 #6** — Outreach guardrail copy
- **Sprint 2 #7** — Owner workload columns

Region focus order unchanged: **Canada > USA > Mexico > Gulf (paused)**.

### Tone for resume

User went home with the tutorial functioning but not visually finished. They are not frustrated — the product works, the demo would survive — but they have an eye on polish quality. Open the next session with: "Sprint 2 #1.1 is on the branch and approved. Walk me through what you saw — what specifically isn't sitting right?" Capture the list, then decide between merge+iterate or fix-before-merge.

---

## ✅ CLOSED — 2026-05-06 (Sprint 2 #4.4 + #4.7 + #4.8 — Sprint 2 #4 done)

User-confirmed production verification matrix all PASS:
- `/unified/overview` direct URL renders the dashboard (was 404)
- Region/sector switch animations clean — Region, Automotive, Yacht all draw outlined shapes (no black blobs)
- "Generate AI summary" returns live LLM content, source pill flips Template → AI
- 5-minute Firestore-persisted cooldown behavior intact

**Production commit chain on `origin/main` after this session:**
```
[deploy of HEAD]    firebase deploy --only hosting
[App.jsx commit]    fix(routing): add explicit /unified/overview route (Sprint 2 #4.8)
8caf3f45            feat(animations): convert Auto/Yacht morph loaders to regular CSS (Sprint 2 #4.7)
56731144            docs: github-summaries/2026-05-05.md
fd8a6d66            (previous prod state)
```

### Sprint 2 #4.4 closed — `refreshDailyBriefAi` CORS preflight blocked

**Root cause.** Function had only `allAuthenticatedUsers/cloudfunctions.invoker` granted. CORS preflight (OPTIONS) is anonymous by spec — it carries no auth header — so `allAuthenticatedUsers` does not apply to preflight requests. Google Frontend rejected at IAM layer with HTTP 403 before the Firebase callable runtime could respond. Function never logged a single invocation despite being deployed, healthy, and frontend code calling it correctly.

**Fix.** Single IAM binding addition (~30s, no code change):
```powershell
gcloud functions add-iam-policy-binding refreshDailyBriefAi `
  --region us-central1 `
  --member="allUsers" `
  --role="roles/cloudfunctions.invoker"
```

**Why this is safe.** The function body checks `if (!context.auth) throw httpsError("unauthenticated", ...)`. The auth gate is in code; the IAM gate is the HTTP-level access permission. Granting `allUsers` invoker on a callable function is the documented Firebase pattern for callables invoked from a web app.

**Verification.** OPTIONS preflight returns `204 No Content` with `access-control-allow-origin: https://dynamicnfc.ca`, `function-execution-id` populated. Production POST 200, real Anthropic Haiku 4.5 paragraphs rendering on `/unified/overview` Today's Brief block.

**Pattern audit completed.** Scanned all 9 deployed functions:
- `refreshDailyBriefAi` — fixed.
- `seedDemoData` — callable, but NOT called from frontend. Only `Dashboard.jsx` references the name and that is a local function, not the Cloud Function. No frontend gap.
- `api`, `contactForm` — `onRequest` with Express + their own CORS middleware. Out of scope of this class of bug.
- 5 internal triggers (Firestore/Scheduled/Storage) — never reached from browser, IAM irrelevant.

### Sprint 2 #4.7 closed — Auto/Yacht morph loader CSS Module fragility (preventive)

**Root cause (preventive).** `AutomotiveMorphLoader.module.css` and `YachtMorphLoader.module.css` carried the same CSS Module hashed-class fragility that hit `RegionMorphLoader` on 2026-05-04. Both rendered correctly today only by accident of Vite's current build determinism. Any future build pipeline drift could re-introduce the black-blob regression on those two surfaces.

**Fix.** Mechanical refactor mirroring the RegionMorphLoader Sprint 2 #4.3 pattern. Cursor executed on branch `cursor/sprint-2-4-7-morph-css-modules`, squash-merged as `8caf3f45`:
- `AutomotiveMorphLoader.module.css` → `AutomotiveMorphLoader.css` (`auto-` prefix, 28 classes + `auto-pulseDot` keyframe)
- `YachtMorphLoader.module.css` → `YachtMorphLoader.css` (`yc-` prefix, 37 classes + `yc-bob` + `yc-pulseDot` keyframes)
- All `styles.X` JSX references replaced with literal `"auto-X"` / `"yc-X"` strings
- All `classList.add/remove(styles.X)` and template-literal `querySelectorAll` sites converted
- Inline `el.style.fill = "none"` + `stroke` + `strokeWidth` set on every dynamically-created SVG element across both components (defense-in-depth — CSS class stays for transitions; inline style is the visual source of truth)

**Verification.** `npm run build` PASS in 37.46s. `Select-String "styles\."` returns empty in both jsx files. No `.module.css` files remain in either component directory. Production sector-switch matrix (Real Estate / Automotive / Yacht) all render outlined shapes — no black-blob regression.

### Sprint 2 #4.8 closed (new) — `/unified/overview` 404

**Root cause.** `App.jsx` had `<Route index element={<OverviewTab />} />` inside the `/unified` parent route. React Router's index route only matches the parent path exactly, so a direct URL `/unified/overview` fell through to the `*` catch-all and rendered the 404 page. CLAUDE.md §6 routing table listed `/unified/overview` as a valid route — code/doc mismatch. Sidebar nav clicks happened to work because they use relative `to=""` going to the parent, but bookmarks, shared links, and any future direct URL access broke.

**Fix.** Added explicit `<Route path="overview" element={<OverviewTab />} />` alongside the index route. Both `/unified` and `/unified/overview` now render OverviewTab. 3-line edit, no other surfaces touched.

### Sprint 2 #1 closed — Five-Minute Proof tutorial (functional ship)

**Scope.** Region-aware, collapsible 5-step tutorial on `/unified/overview`, banner-by-default + Settings replay button. Per-tenant Firestore flag at `tenants/{uid}/settings/tutorial`.

**Implementation path.**
1. Directive authored by Claude after audit of codebase (CSS variables, `getPersonas` shape, SettingsTab class system, i18n location all verified before committing the directive).
2. Saved as `frontend/directives/SPRINT2_1_FIVE_MINUTE_PROOF_DIRECTIVE.md`.
3. Cursor executed on branch `cursor/sprint-2-1-five-minute-proof`, commit `c49906bc`. Build PASS in 15.44s, no invented class names, no invented CSS variables, persona injection via correct `getPersonas('real_estate', regionId)` snake_case + array `.find(p => p.type === 'vip')` shape, i18n in own `fiveMinuteProof.js` module, Lucide replaced with inline SVG icons (acceptable substitution).
4. Squash-merged to main, deployed.
5. **Post-deploy bug:** "Replay tutorial" button on Settings tab had no visible effect because user remained on Settings while the tutorial only renders on Overview, and `disabled={!tutorialState || !tutorialState.dismissed}` made the button look identical in disabled vs enabled states. Fixed in-session: removed disabled prop entirely (button always clickable), added `useNavigate("/unified/overview")` after `replayTutorial()` so the user is auto-routed to the surface where the tutorial actually appears. Removed unused `tutorialState` from destructure to prevent lint warning.

**Files added (new).** `frontend/src/components/UnifiedDashboard/FiveMinuteProof/{FiveMinuteProof.jsx,TutorialStep.jsx,TutorialNav.jsx,FiveMinuteProof.css,index.js,illustrations/Step1Identity.jsx..Step5Close.jsx}` + `frontend/src/i18n/portals/fiveMinuteProof.js`.

**Files modified.** `useDashboardData.js` (+178 lines: snapshot listener, `tutorialLoaded` flag, three callbacks, atomic `increment(1)` for replayCount), `OverviewTab.jsx` (component mount above `<TodaysBrief>`), `SettingsTab.jsx` (replay row mirroring existing theme-row JSX pattern + post-fix navigate).

**Firestore schema added.** `tenants/{uid}/settings/tutorial { dismissed, dismissedAt, completedAt, replayCount }`. All writes are merge-only. `replayCount` uses Firestore `increment(1)` — race-condition-safe.

**Verification on production.** Five user-confirmed screenshots showing all 5 steps rendering with correct persona name (Marc Patel for Canada region), correct progress dots, Back/Next/Finish navigation, dismiss + replay flow working, auto-navigate from Settings → Overview functioning.

### Sprint 2 #1.1 — illustration polish (Cursor delivered, awaiting user decision on merge)

**Why opened.** Functional tutorial ships clean, but Cursor's first-pass SVG illustrations came in too minimalist (12-15 lines each). Spec brand-consistency requirements partially missed: no DynamicNFC card identity (red NFC + blue waves), region accent unused (gray dominates regardless of region), no persona name in illustrations (Marc Patel mentioned in body copy but not visible in any visual), no "Booked" badge on step 5, bell glyph half-circle instead of full silhouette, dashboard grid empty, score "82" lacks Hot/Warm/Cold comparison context.

**Directive.** `frontend/directives/SPRINT2_1_1_ILLUSTRATION_POLISH_DIRECTIVE.md` — locked scope to the 5 SVG files + `personaName` prop pass-through in `TutorialStep.jsx`, hard-required brand-mark and accent usage with verification commands.

**Cursor delivery.** Branch `cursor/sprint-2-1-1-illustration-polish`, commit `f30f55ee`. Build PASS in 16.30s. Pushed to remote, NOT merged.

**Audit verdict (Claude).** APPROVED for merge. Numbers:
- Line counts: 61/46/41/40/52 (all above the 30-line under-spec floor; Steps 3 and 4 are tight at the floor but content review confirmed all spec elements present)
- `--fmp-accent` usage: 9/8/6/8/5 (all comfortably above the ≥3 minimum)
- Brand red/blue: red≥3 in every step, blue≥1 in every step (Step 4 has blue=1 because the DynamicNFC iconlet `<symbol>` is defined once and used via `<use>` — symbol body contains brand-blue, render-time appearance is correct)
- `personaName` threaded through `TutorialStep.jsx` to each illustration component
- DynamicNFC card brand mark renders in Steps 1, 2, 4, 5 (confirmed in spot-read)
- Persona name label chip renders in Steps 1, 3, 4, 5 (Step 3 uses prop with "Marc Patel" fallback, Step 4 uses prop with "Khalid Al-Rashid" fallback)
- Step 5 BOOKED badge present
- New `fmp-svg__pulse-flow` utility class added to CSS, scoped inside `@media (prefers-reduced-motion: no-preference)` block. New `fmp-dash-flow` keyframe added at top level (correct pattern — keyframes global, usage classes guarded)
- No global classes outside `fmp-` namespace
- Working tree from previous session preserved (CLAUDE_HANDOFF.md and App.jsx untouched by Cursor)

**Status.** Branch ready, awaiting user's "merge yes/no" decision after polish-issue review tomorrow morning.

### Lessons worth keeping in memory

- **Firebase callable functions need TWO IAM grants for browser invocation:** `allAuthenticatedUsers/cloudfunctions.invoker` (the authenticated POST with auth header) AND `allUsers/cloudfunctions.invoker` (the anonymous OPTIONS preflight). Granting only the first results in silent 403 — function is never reached, no logs to debug from. Add this to deploy choreography for any new callable.
- **When refactoring fragile CSS Module patterns out of a component, audit the entire component family.** Sprint 2 #4.3 fixed Region. Today's #4.7 caught Auto and Yacht before they regressed in production. The next CSS-pipeline-drift could have been triggered by anything (Vite update, dependency change). Eliminate fragility classwide, not per-incident.
- **`<Route index>` is not an alias for an explicit child path.** If a route table documents `/parent/child` as a target, the route definition needs an explicit `<Route path="child">`. Index routes match the parent path only — bookmarks and share links break silently.
- **A button with side-effect on a different surface needs to take the user there.** The Replay tutorial button wrote to Firestore correctly but the user stayed on Settings — felt broken. Lesson: any control that triggers state visible only on another surface should auto-navigate, OR the surface where the state lives should provide an inline confirmation. Anonymous Firestore writes are not user feedback.
- **Audit Cursor SVG output by line count.** A 12-line SVG cannot deliver a 6-element brand-rich illustration. Set a minimum complexity bar in the directive (e.g., "each illustration must contain at least N visible primitives") so initial output meets the visual-clarity bar without a follow-up polish pass.

### Still open from Sprint 2 (queue after #1 / #4 closures)

- **Sprint 2 #1.1** — Five-Minute Proof illustration polish (in flight via Cursor)
- **Sprint 2 #2** — Sales Trigger panel
- **Sprint 2 #3** — Buyer Sites sidebar
- **Sprint 2 #5** — VIP Alert Summary
- **Sprint 2 #6** — Outreach guardrail copy
- **Sprint 2 #7** — Owner workload columns

Region focus order unchanged: **Canada > USA > Mexico > Gulf (paused)**.

---

## ✅ CLOSED — 2026-05-04 ~10:00 (after morning re-test)

All three Sprint 2 #4 cleanup items are now closed and verified on production. User confirmed visually with screenshots: blueprint outlines draw correctly, mini-map countries show in default blue + active region in gold, no black blobs anywhere. Demo to luxury developer was done from `localhost` earlier in the morning before prod was fully fixed (data was correct on prod, only animation visual was broken — local was clean) and went well.

**Final commit chain on `origin/main`:**
```
[latest]  fix(animations): inline style on mini-map country paths      (Sprint 2 #4.3 v3)
a2a6df82  fix(animations): inline style for SVG fill/stroke            (Sprint 2 #4.3 v2)
6bc0a602  fix(sw): bump CACHE_NAME v2->v3, bypass navigations + assets (Sprint 2 #4.6)
a02f20ba  fix(tenant): seed all 4 regions x 3 sectors                  (Sprint 2 #4.5)
fb4bc950  fix(layout): widen morph animation gate 1100->3200ms         (Sprint 2 #4.3 timing)
fa0f543d  fix(animations): fill=none as attribute (superseded by v2)   (Sprint 2 #4.3 v1)
1f94c81c  feat(layout): restore region+sector switch morph animations  (#7)
```

### What turned out to be the actual root cause

Three independent layers, all hitting the same symptom (black-blob animation):

1. **CSS Module rule fragility on SVG fill.** SVG presentation attributes (`fill="none"`) have lower priority than CSS rules. The morph loaders relied on `.bpEl { fill: none }` etc. via CSS Module hashed class names. Some CSS pipeline drift (suspected Vite postcss minor-version interaction, not yet pinpointed) caused the rule to drop to fallback default `fill="black"`. Inline `el.style.fill = "none"` (dynamic) and React `style={{ fill: ... }}` prop (static JSX) bypass this entirely — inline style beats every CSS rule. Now mini-map country paths and dynamic blueprint paths both render correctly regardless of CSS pipeline state.

2. **Single-region seed orchestration.** `seedTenantData` only ran the three sector seeds for the active `regionId`. Sprint 2 #4.1 closed the region-switch reseed loop (correct fix), which unmasked this gap — 9 of 12 region/sector combinations had zero data. Now loops all four regions; all 96 cards / 48 deals / 36 campaigns shipped per tenant on first load.

3. **Service worker stale-cache feedback loop.** `sw.js` had a static `CACHE_NAME = 'dynamicnfc-v2'` that never changed between deploys. Browser only updates SW when the file's bytes change. Old SW kept serving cached `index.html` pointing at old hashed JS bundle filenames. Vite's 1-year immutable cache header on `/assets/*` made it sticky. Bumped CACHE_NAME to v3 and made the fetch handler bypass navigations + `/assets/*` entirely — those are now always fresh from network. This bug was making it impossible to verify our other fixes worked in production. Future deploys will not have this problem.

### Lesson for future sessions / memory

When a bug looks like "deploy didn't reach users," check **three** things in order: (a) is the bundle on disk actually fresh (grep dist/), (b) is Firebase Hosting serving fresh index.html (network tab → response), (c) is a service worker intercepting the fetch (Application tab → SW status). The third one is the easiest to miss because dev tools' "hard refresh" doesn't always bypass SW.

When working with SVG fill/stroke that must always render: **never rely solely on a CSS class rule**. Use inline `style.X` (JS) or React `style` prop (JSX). CSS class can stay for transitions or secondary effects, but the visual rendering source of truth must be inline. Half a day of debugging would have been saved by knowing this upfront.

### Still open

- **Sprint 2 #4.4** (`refreshDailyBriefAi` CORS) — Today's Brief renders fine via template fallback; AI button blocked. Next session.
- **Sprint 2 #4.7 (NEW)** — Apply the same `RegionMorphLoader.module.css → regular CSS with rml- prefix` refactor to `AutomotiveMorphLoader.module.css` (use `auto-` prefix) and `YachtMorphLoader.module.css` (use `yc-` prefix). Currently both still use CSS Modules. They render correctly today because their classes happen to be applied during current build, but they have the same fragility that hit Region. ~20 min work, mechanical refactor — pattern is now well-established. Inline JS style on dynamic elements should also be kept as defense in depth.
- **Recharts width/height(-1) warning** — appears in console during transitions. Cosmetic. Recharts container momentarily measures 0 during morph animation. Not a blocker.

---

## (Original RESUME HERE — kept as historical context) — 2026-05-04 ~04:30

User going to sleep, will re-test in ~3 hours (around 07:30 Vancouver). Two real bugs were diagnosed and fixed last night, plus one cosmetic timing tweak. Three commits pushed to `origin/main`:

```
a02f20ba fix(tenant): seed all 4 regions x 3 sectors (Sprint 2 #4.5)  ← HEAD
fb4bc950 fix(layout): widen morph animation gate 1100->3200ms (Sprint 2 #4.3)
fa0f543d fix(animations): set fill=none inline on dynamic SVG elements (Sprint 2 #4.3)
1f94c81c (previous HEAD) feat(layout): restore region+sector switch morph animations (#7)
```

Two `firebase deploy --only hosting` ran tonight — bundle on prod is `UnifiedLayout-CjzwGb9S.js` + `tenantService-qZF5l5xs.js`. Production hosting URL: `https://dynamicnfc-prod-68b4e.web.app`, primary `dynamicnfc.ca`.

### State at session close

| Surface | Local (`localhost:3000`) | Production (`dynamicnfc.ca`) |
|---------|--------------------------|------------------------------|
| Multi-region tenant data (Sprint 2 #4.5) | ✅ Working | ✅ Working — auto re-seed ran on first prod load, all 4 regions × 3 sectors populated |
| Morph animation visual (Sprint 2 #4.3) | ✅ Outline draws correctly, no black blobs | 🔴 Still rendering as black blobs — bundle has fix (verified via grep), but user's browser keeps serving cached old bundle |
| Today's Brief CORS (Sprint 2 #4.4) | 🟡 Same as before | 🟡 Same — template fallback works |

### What user should test on resume

1. Open **fresh Incognito window** → `dynamicnfc.ca/unified` → login → switch region/sector. Most likely the cache-bust from a clean session resolves the prod animation issue automatically (bundle hash differs, fresh download).
2. If Incognito still shows black blobs: F12 → Network tab → click on a `UnifiedLayout-*.js` row → confirm hash is `CjzwGb9S` (or newer). If older hash is loading, something is serving stale `index.html` (Firebase Hosting CDN cache, very rare).
3. If hash is correct but animation still black: F12 → Elements → right-click on a black polygon → Inspect. Confirm the polygon has `fill="none"` attribute. If yes → some other CSS is overriding (write `!important` rule). If no → bundle didn't carry the fix despite grep result, redo `Remove-Item -Recurse -Force node_modules\.vite, dist; npm run build; firebase deploy --only hosting`.

### Sprint 2 #4.3 closed — Morph animation black-blob regression

**Root cause:** `RegionMorphLoader.jsx` / `AutomotiveMorphLoader.jsx` / `YachtMorphLoader.jsx` create SVG elements via `document.createElementNS` and set only `class` (CSS Module hash) + `stroke`. They never set `fill`. The CSS Module rule `.bpEl { fill: none; stroke-width: 1.2; ... }` was the only thing keeping shapes hollow. When that rule failed to apply (build/CSS pipeline drift between deploys), SVG default `fill="black"` took over → solid black blob shapes.

**Fix:** Set `fill="none"`, `stroke-width`, and `stroke-linejoin/linecap` as inline SVG attributes on every dynamically-created path/rect/circle. CSS Module class still applied for opacity transitions etc., but inline attribute beats class — robust to any future CSS Module hash mismatch, global SVG selector leak, or build pipeline change. Six write sites changed (parts + details for each of three components). Local Vite HMR confirmed fix works. Prod bundle `UnifiedLayout-CjzwGb9S.js` contains the fix (grep confirmed `"fill","none"` pattern). Open visual issue is cache, not code.

**Also rolled in this commit chain:** gate timer widened `1100ms → 3200ms` so animations actually finish drawing (slowest region USA ~2150ms) plus ~1s "savor" pause before dashboard takes over. Premium pacing per user request.

### Sprint 2 #4.5 closed — Multi-region seed orchestration

**Root cause:** `seedTenantData()` in `frontend/src/services/tenantService.js` was only running `buildRealEstateSeed/Automotive/Yacht` for the **active** `regionId`. With Sprint 2 #4.1 closing the reseed-on-region-switch loop (correct fix), region switch never re-triggered the seed. Result: 9 of 12 region×sector combinations had zero data. Symptom looked like "data wiped" but was actually "data never written for inactive regions."

This bug was **masked** before Sprint 2 #4.1 because the reseed loop kept retriggering single-region seed on every region switch — visually, regions appeared to populate as the user clicked through them. Closing the loop unmasked the orchestration gap.

**Fix:** Loop `["gulf","usa","canada","mexico"]` through all 3 sector seeds inside `seedTenantData`. IDs are region-prefixed (`RE-GULF-001`, `AU-USA-005`, `YA-CAN-007` etc.) so 12 batches don't collide. SEED_VERSION bumped `2.1-region-enriched` → `2.2-all-regions` to auto-trigger merge re-seed for existing tenants on next page load. CLAUDE.md §8 merge-only contract preserved — user-created data not touched.

**Verified live:** Tenant `1UBC4ciS9HSSGsmTd6xZkkOkr472` re-seeded successfully on first prod load, console showed `[TENANT SEED] Version mismatch - running merge seed update` → `[TENANT SEED] Seed completed successfully`. After re-seed, all 4 regions populate on switch (Gulf Auto: 2 VIPs, USA RE: 3 VIPs incl. Daniel Roberts/Olivia Parker, Canada Vista Residences, Mexico hacienda).

### Sprint 2 #4.4 still open — `refreshDailyBriefAi` CORS

Unchanged from previous session. Today's Brief renders fine via template fallback. Lower priority than animation/seed issues. Address after demo.

### Demo backup plan if user resumes and animation still broken

If 07:30 retest still shows black blobs and the cache angle doesn't pan out, fastest unblock for the morning meeting is to **disable the switching gate entirely** by setting `setIsSwitching(false)` immediately or wrapping the whole `if (seedingInProgress || isSwitching)` block to drop `isSwitching`. Demo loses the morph animation but data swap remains instant. Region/sector switch still works via client-side filter. ~3 line revert in `UnifiedLayout.jsx` lines ~684–707. Better to ship without animation than ship black blobs in front of a luxury developer.

### Lesson worth keeping in memory

Sprint 2 #4.1 (region switch reseed loop) was a correct fix, but it unmasked Sprint 2 #4.5 (single-region seed orchestration). When you fix one bug, scan for what that bug was masking. Always test region/sector switch coverage matrix (4×3 = 12 cells) after any seed-related change.

Also: **CSS Module rules are not safe defaults for critical SVG attributes.** Inline attribute on every dynamic element is the durable contract. The 6 write sites that needed inline `fill="none"` were a single batch missed during initial component authorship.

---

## Previous unresolved (kept for context — both addressed above)

1. **🔴 RegionMorphLoader animation regression (priority).** ✅ **Closed by `fa0f543d` + `fb4bc950`** — root cause was missing inline `fill="none"` on dynamic SVG elements + 1100ms gate cutting animation mid-draw. Local verified, prod bundle contains fix, only blocker is browser cache.

2. **🟡 AI refresh button CORS error (lower priority).** Still open. Template fallback continues to work — demo can run on it.

---

## What shipped tonight

### Sprint 2 #4 — Velocity KPIs + Today's Brief AI summary
**PR #5** squash-merged as `4e61a702 feat(overview): velocity KPIs + AI daily brief (Sprint 2 #4) (#5)`

**Frontend additions (all under `/unified/overview`):**
- `TodaysBrief.jsx` (228L) — full-width AI brief block with mor (purple) left rail, NFC ROI badge, Template/AI source pill, "Generate AI summary" button, atRisk + hotLeadsNew + followUpsOverdue chips
- `SalesVelocity.jsx` (181L) — 4+4 metric grid: top row (blue, buyer-behavior) = TTFA, Viewing Velocity, Re-engagement, Second-Tap; bottom row (purple, conversion) = Lead Capture, VIP→Booked, Decision Window, Rep Response. Each metric carries threshold-based status dot (green/yellow/red/gray)
- DOMPurify (`isomorphic-dompurify` ^3.12.0) sanitizing LLM `paragraph1` / `paragraph2` rendering; `SANITIZE_CONFIG = { ALLOWED_TAGS: ['span','strong','em'], ALLOWED_ATTR: ['class'] }`. `vipName` interpolation goes through manual `escapeHtml()` first
- 8 metrics ship; 3 deferred to Sprint 3-4 (Behavioral Events/Tap, Region Velocity Index, Pipeline Acceleration Score)

**Backend additions (`functions/lib/`):**
- `velocityMetrics.js` (252L) — pure functions computing the 8 metrics from event/lead/deal arrays
- `briefTemplates.js` (154L) — EN/AR/ES/FR template fallback strings, mode selection (rising/cooling/plateau)
- `aiBriefGenerator.js` (96L) — Claude Haiku 4.5 call (`claude-haiku-4-5-20251001`) with 5min Firestore-persisted cooldown, silent fallback to template on failure
- `dataDerivers.js` (151L) — single source of truth for `deriveTopVip`/`derivePipelineDelta`/`deriveMarketplaceTraffic`/`deriveAlerts`. **Critical:** field names `topVip.mode` (not `.status`), `alerts.hotLeadsNew` / `alerts.followUpsOverdue` (not `.hotLeads` / `.overdue`)
- 2 new Cloud Functions: `aggregateVelocityMetrics` (scheduled every 15min, 512MB) + `refreshDailyBriefAi` (callable, 256MB, secret-bound to `ANTHROPIC_API_KEY`)

**Deploy choreography:**
- Anthropic API key in Secret Manager via `firebase functions:secrets:set ANTHROPIC_API_KEY` → `projects/511000068860/secrets/ANTHROPIC_API_KEY/versions/1`
- `defineSecret('ANTHROPIC_API_KEY')` from `firebase-functions/params`, `runWith({ secrets: [anthropicApiKey] })`
- IAM: `allAuthenticatedUsers` granted `roles/cloudfunctions.invoker` on `refreshDailyBriefAi` (this required disabling org policy `iam.allowedPolicyMemberDomains` — see "GCP gotchas" below)

**Deploy verification:**
- `aggregateVelocityMetrics` ACTIVE, scheduled, secret-bound
- `refreshDailyBriefAi` ACTIVE, ingress `ALLOW_ALL`, IAM grant `allAuthenticatedUsers/cloudfunctions.invoker` verified
- Production smoke: Today's Brief renders with template content (`Score 72`, `Pipeline added $159.3M`, decision window `6.2d` with green threshold dot, alerts chips populated). Sales velocity grid renders. Recharts last-8-weeks chart renders. Live Activity shows Marc Patel + Ethan Chen Vancouver personas (Canada region correct)

### Sprint 2 #4.1 — Region switch reseed loop fix
**PR #6** squash-merged as `1cb71a2f fix(tenant): stop server-side reseed on region switch (#6)`

**Problem:** Console log on every region switch showed `[TENANT RESEED] Reseed required: region mismatch (canada -> usa) - reseeding with merge strategy` followed by `[TENANT SEED] Seed completed successfully`. ~180-doc Firestore writes per switch, animation interrupts, performance kill. Direct violation of CLAUDE.md §8 Clean-Swap Pattern ("region switch = client-side filter via filterBySectorAndRegion, never server-side reseed").

**Fix:**
- `frontend/src/services/tenantService.js`: removed `regionMismatch` from `needsSeed` calculation in `checkTenantExists`; removed region-mismatch reseed branch in `seedTenantData`; preserved `seedRegion` as historical first-seed metadata via `existingData?.seedRegion ?? regionId`
- `frontend/src/hooks/useDashboardData.js`: removed `regionId` from tenant-init effect deps `[refreshKey, user, regionId]` → `[refreshKey, user]`. **This was the root cause** — React was re-running tenant-init on every region change

**Verified live:** Console after switch shows `[TENANT CHECK] needsSeed: false`, no `[TENANT SEED]` or `[TENANT RESEED]` entries. Region switch is now zero-Firestore-write.

### Sprint 2 #4.2 — Region/sector switch morph animation trigger
**PR #7** squash-merged as `1f94c81c feat(layout): restore region+sector switch morph animations (#7)`

**Problem:** With reseed loop closed (#4.1), the animation never fired because its render gate was `if (seedingInProgress)` and `seedingInProgress` no longer turns true on region switch. The animation was a side-effect of the reseed loop, not an intentional trigger.

**Fix:** `UnifiedLayout.jsx` — added local `isSwitching` state with refs to detect actual region/sector change (skip first mount), 1100ms timer, render gate widened to `seedingInProgress || isSwitching`. Pure UI state, zero Firestore writes. Sprint 2 #4.1 contract preserved.

**Verified live:** Animation now triggers on region/sector change. **BUT** the animation itself renders as black polygons (see "Unresolved issue 1" above).

---

## Production state (as of 2026-05-04 03:00)

| Surface | State |
|---------|-------|
| `/unified/overview` Today's Brief | ✅ Rendering with template content |
| `/unified/overview` Sales Velocity (8 metrics) | ✅ Rendering, threshold dots correct |
| Region switch reseed loop | ✅ Closed (zero writes) |
| Region switch UI animation trigger | ✅ Fires (1100ms `isSwitching`) |
| Region switch animation visual rendering | 🔴 Black polygons over white grid (regression, root cause TBD) |
| AI brief refresh button (`Generate AI summary`) | 🔴 CORS preflight blocked, function never reached |
| Region switch performance (data swap) | ✅ Instant client-side filter |
| Frontend bundle | `1f94c81c` deployed `5/4/26 2:43 AM` (`71799b`) |
| Cloud Functions deployed | 9 total: api, contactForm, onWalletPassRequest, aggregateTaps, aggregateCampaignTaps, cleanupInactiveTenants, seedDemoData, **aggregateVelocityMetrics (new)**, **refreshDailyBriefAi (new)** |

---

## GCP gotchas hit tonight (notes for future sessions)

1. **Secret Manager IAM auto-grant works.** `firebase functions:secrets:set ANTHROPIC_API_KEY` + `defineSecret` + redeploy automatically grants `roles/secretmanager.secretAccessor` to `dynamicnfc-prod-68b4e@appspot.gserviceaccount.com`. No manual IAM step needed.
2. **Domain Restricted Sharing org policy blocks `allUsers`/`allAuthenticatedUsers` IAM grants.** GCP Console exposes two related policies under filter `allowedPolicyMember`:
   - `iam.allowedPolicyMembers` (Managed) — newer, was Inactive
   - `iam.allowedPolicyMemberDomains` (Managed Legacy, "Domain restricted sharing") — older, was **Active and inheriting from parent**
   The older one was the actual blocker. Fix: navigate to that policy → **Override parent's policy** → **Replace** (not Merge — Merge keeps parent's deny rules) → **Allow all** rule → **Set policy**. Propagation 30sec–2min.
3. **Firebase legacy `functions:config:set` deprecated March 2027.** Migrate to `defineSecret` params API now. Secret access in code via `process.env.SECRET_NAME` after `runWith({ secrets: [...] })`.
4. **Firebase deploy `--only` flag with multiple functions:** `--only "functions:aggregateVelocityMetrics,refreshDailyBriefAi"` (single quoted string). Without quotes the parser swallows the second function name silently.
5. **Cursor Cloud Agent sandbox push can silently fail.** Round 1 of Sprint 2 #4 reported "completed" but `git ls-remote` showed only handoff commits. Mandatory `git ls-remote origin "<branch>"` proof in directives now standard.
6. **Cursor can produce duplicate `module.exports` in same file.** Bugbot caught this in Sprint 2 #4 audit-3 — `briefTemplates.js`, `aiBriefGenerator.js`, `velocityMetrics.js` each had two concatenated implementations with mismatched field names (Node uses last, first dead code). Always grep for duplicates after Cursor's larger generations.

---

## Region focus order (added 2026-05-02, kept)

Production prioritization changed from "4 equal primary" framing in CLAUDE.md to actual outreach ordering:
- **Canada > USA > Mexico > Gulf (paused)** due to regional conflict
- CLAUDE.md unchanged (stable rules — Gulf code/personas/Arabic translations remain production-grade peer to other regions)
- This file (CLAUDE_HANDOFF.md) is authoritative for the **current** focus
- Demo UI keeps Gulf selector visible (P1 sales optionality)

---

## Carried-over note: regression user reported

> "dün bu animasyon adam gibi çalışıyordu, bugünkü değişikliklerden sonra patladı"
> — User, ~2026-05-04 03:00 local

Diff analysis between `30909c11` (4/29 deploy state, last green animation per user) and `HEAD` (1f94c81c) shows:
- **Animation components themselves: 0 changes.** No diff in `RegionMorphLoader/`, `AutomotiveMorphLoader/`, `YachtMorphLoader/` between those commits
- `UnifiedLayout.css` +452 lines (Sprint 2 #4 styles for `.ud-todays-brief__*`, `.ud-sales-velocity__*`). CSS scan for `^svg|^path|^polygon|^circle|svg \{|path \{|polygon \{|circle \{|fill|stroke|\* {` returned only one match: `.ud-overflow-item--export > *` — animation-irrelevant
- `UnifiedLayout.jsx` +136 lines: i18n `moreActions` strings, Sprint 2 #4.2 `isSwitching` state, topbar overflow menu (mobile UX). Animation render block (`isRealEstate` / `isAutomotive` / `isYacht` ternary, lines 743-784 of HEAD) is **byte-identical** to 30909c11 version

**Two open hypotheses:**
- **H1:** Animation was always black-polygon-ed and reseed loop's continuous re-trigger somehow masked the bug visually. Rejected by user's clear memory.
- **H2:** Something subtle in build pipeline / CSS Module hash / bundle ordering broke animation between deploys. Not yet investigated. Best next step: hard-refresh + private window + DOM inspect on a black polygon → check computed `fill` CSS in DevTools → trace which rule is winning.

**Action for next session:** Treat user's recall as authoritative. Re-investigate without dismissing.

If H2 is real, possible culprits to check:
- Vite manual chunk reordering with new dependencies (DOMPurify added to bundle)
- CSS Module class hash collision between new `.ud-todays-brief__*` rules and animation's `.bpEl` / `.bpDetail` / `.bpLabel` (unlikely but checkable)
- `frontend/src/components/RegionMorphLoader/RegionMorphLoader.jsx` line ~190 sets `el.setAttribute("class", styles.bpEl)` and `el.setAttribute("stroke", d.accent)` but never sets `fill`. CSS rule `.bpEl { fill: rgba(69, 123, 157, 0.15) }` is supposed to do it. If CSS Module is producing a different hashed class name in the new build than the JS reference, animation paths fall back to browser default `fill="black"`. **This is the strongest H2 candidate.** Check by: open DevTools → Elements → click a black polygon → see whether `class="_bpEl_xxxxx"` matches the CSS Module's compiled class

---

## Branches and HEAD

- `main` HEAD: `1f94c81c feat(layout): restore region+sector switch morph animations (#7)`
- All `cursor/sprint-2-4-*` branches deleted from remote
- Local working tree clean

Recent commits:
```
1f94c81c feat(layout): restore region+sector switch morph animations (#7)
1cb71a2f fix(tenant): stop server-side reseed on region switch (#6)
4e61a702 feat(overview): velocity KPIs + AI daily brief (Sprint 2 #4) (#5)
1500e55a chore(summary): update day/hour github activity log
88f06171 docs(handoff): Sprint 2 #4 reset - Cursor sandbox lost, awaiting fresh execution
```

---

## Sprint 2 remaining (after #4)

Order TBD with user, but the queue from CLAUDE.md §14:

- **Sprint 2 #1** — 5-Minute Proof tutorial. Stack approved: G3+H1+I2+J2+K1+L2+M1+N2+P1. 5-step copy + visual concepts approved. Directive (`SPRINT2_1_FIVE_MINUTE_PROOF_DIRECTIVE.md`) not yet written
- **Sprint 2 #2** — Sales Trigger panel
- **Sprint 2 #3** — Buyer Sites sidebar
- **Sprint 2 #4.3 (new)** — RegionMorphLoader animation visual fix (this session's regression)
- **Sprint 2 #4.4 (new)** — `refreshDailyBriefAi` CORS fix
- **Sprint 2 #5** — VIP Alert Summary
- **Sprint 2 #6** — Outreach guardrail copy
- **Sprint 2 #7** — Owner workload columns

User has 8AM-ish meeting tomorrow (toplantı saati explicit söylenmedi but session ended at ~03:10 with user going to sleep, presumably for an early meeting). Demo strategy for tomorrow: lead with Today's Brief + Sales Velocity (Sprint 2 #4 main value), region switch via before/after data narrative (Canada Pipeline $0M → USA Pipeline $159.3M, persona Marc Patel → James Mitchell), skip the broken morph animation, frame as "Sprint 2 #5 polish in flight".

If user wants the morph animation working before the meeting, Sprint 2 #4.3 must be the first thing next session, and the H2 CSS Module hash hypothesis above is where to start.

---

## Tone for next session opener

User went to sleep at 03:10 frustrated about the animation regression — reasonably so, the animation was supposed to be intact through this work. Open the next session by:
1. Acknowledging the animation issue without re-litigating whether it worked yesterday (user's memory is the authority)
2. Going straight to DevTools Inspect on a black polygon as the first diagnostic step
3. Having the H2 CSS Module hash diagnostic ready to run
4. Holding the rollback option in pocket: cherry-pick Today's Brief + Sales Velocity off the Sprint 2 #4 commits onto a new branch from `30909c11`, leaving animation code paths untouched. ~1hr work if needed.

User does not need a postmortem, user needs the animation working. Lead with action.

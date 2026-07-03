# DynamicNFC — Kapsamlı Yapı Raporu
**Tarih:** 2026-07-03 · **Hazırlayan:** Claude (Fable 5) · **Kapsam:** frontend + functions + infra + repo hijyeni

---

## 1. Yönetici Özeti

Kod tabanı, bir yıl önceki "tek sektör, tek bölge, iki dil" demosundan bugün **2 sektör × 4 bölge × 4 dil tam parity** sunan, tenant-izolasyonlu, gerçek zamanlı tracking'li bir ürüne evrildi. Mimari kararların büyük çoğunluğu doğru: region-keyed veri katmanı, canonical+overlay pattern, tek `usePortalRegion` helper API'si, dual-write tracking köprüsü. Genel sağlık notum: **7.5/10**.

Zayıf nokta kod değil, **çevresi**: deploy güvenliği (CI yok), repo şişkinliği (Ex Files ~500MB), dokümantasyon drift'i (CLAUDE.md'de en az 4 bayat iddia) ve 20 adet 500 satır üstü bileşen. Bunların hiçbiri satışı bloke etmiyor — ama ilk ödeme yapan müşteri öncesi kapatılması gereken 3 sertleştirme maddesi var (§4 Kritik).

**En kritik tespit:** Ürün, anlatısından ileride. Kod 2 sektör × 4 bölge parity'de; pitch deck hâlâ eski sürümü anlatıyor. Şu an en yüksek getirili iş yazılım değil, satış malzemesi.

---

## 2. Mimari Envanter (doğrulanmış rakamlar)

| Katman | Boyut | Durum |
|---|---|---|
| Sayfalar | 33 klasör, 92 .jsx | 20 dosya >500L (kural ihlali) |
| Paylaşılan bileşenler | 33 .jsx | ErrorBoundary global, App.jsx'te çift sarmalı ✅ |
| i18n (aktif) | 6.017L — pages 4.637L + portals 1.709L | Legacy `translations/*.json` tamamen emekli ✅ |
| Veri katmanı | `realEstateUnitData.js` 1.115L + `automotiveVehicleData.js` 259L | 2 sektör 4 bölge dolu ✅; Yacht yok |
| Servisler | 2.478L — tracking 496L, bridge 34L (dual-write ✅), tenantService 490L | Mimari temiz |
| Hooks | `useDashboardData.js` **1.437L** (büyümüş; eski not ~1.260L) | Bölünme adayı #1 |
| Cloud Functions | **9 adet** (CLAUDE.md "7" diyor — bayat), Node 22 | `aggregateVelocityMetrics` + `refreshDailyBriefAi` dokümante değil |
| Firestore | 13 composite index; tenant izolasyonu kurallı | `taps`/`behaviors` public-create (bilinçli tasarım) |
| Testler | 8 test dosyası (Vitest) | Config/util ağırlıklı; portal/function entegrasyon testi yok |
| CI/CD | Sadece activity-log workflow | **Build/deploy CI YOK** — herşey manuel |

**En büyük 5 dosya:** AutoDashboard 1.571L · useDashboardData 1.437L · Dashboard 1.313L · VIPPortal_Definitive 1.219L · realEstateUnitData 1.115L (bu sonuncu veri dosyası — sorun değil).

---

## 3. Güçlü Yönler (korunacaklar)

- **Region/data mimarisi.** RE'de canonical+overlay, Auto'da region-keyed `v()` factory — iki farklı problem için iki doğru pattern. `automotiveVehicleData.js` Code Simplicity Mandate'in ders kitabı örneği: 36 araç × 4 dil, 259 satır.
- **Tracking hattı.** 34 satırlık bridge dual-write yapıyor: anonim trafik `behaviors`'a, admin oturumu ek olarak `tenants/{uid}/events`'e. Silent-failure bug'ı (Mayıs) kapandıktan sonra mimari sade ve doğru.
- **i18n hijyeni.** Legacy JSON katmanı tamamen silinmiş, tek sistem kalmış. 4 dil cycle çalışıyor.
- **Güvenlik temeli.** DOMPurify, consent-gated GA4, Sentry **kurulmuş ve init edilmiş** (CLAUDE.md'de hâlâ "açık iş" görünüyor — bayat), SW sadece prod'da, admin chain-check.
- **Bağımlılık temizliği.** Frontend'de jQuery/Paper.js YOK (sadece deprecated `backend/package.json`'da kalıntı).

---

## 4. Sorun Alanları — Önceliklendirilmiş

### 🔴 Kritik (ilk müşteri/pilot öncesi)

1. **Deploy güvenliği yok.** CI pipeline yok; build+deploy tamamen manuel, "stale bundle" geçmişte 1 numaralı incident kaynağıydı. Tek bir GitHub Actions workflow (PR'de `npm run build` + test) yarım günlük iş, her sprint'te geri öder.
2. **Firestore sertleştirme kapalı.** Delete Protection ve Point-in-Time Recovery ikisi de DISABLED. İlk gerçek müşteri verisi öncesi açılmalı (2 gcloud komutu).
3. **`functions/functions/` duplicate klasörü.** İçinde emekli `cardRedirect`'li eski index.js (246L) duruyor. Yanlış deploy'da orphan function riski. Silinmeli.

### 🟠 Orta (planlı cleanup — çoğu zaten Phase 2d/FAZ 5 kapsamında)

4. **20 bileşen >500L.** Öncelik sırası: `useDashboardData` (1.437L — state slice'lara bölünmeli), AutoDashboard + Dashboard (FAZ 5'te zaten emekli olacak — bölme, SİL), VIPPortal (1.219L).
5. **`ordercard.css` 388KB, App.jsx'te global import** (`?ver=9` cache-bust hack'iyle). Her sayfa — demo portalları dahil — bu CSS'i yüklüyor. PurgeCSS build'de kısmen kurtarıyor ama doğrusu route-level import. Not: meşhur "35K satır blinq CSS" artık **4KB** — biri çoktan temizlemiş, CLAUDE.md efsanesi güncel değil. Gerçek ağırlık ordercard.css.
6. **9 portal dosyasında kopya inline `trackEvent` + BroadcastChannel.** Bilinen borç; pilot trafiği pipeline'ı doğrulayana kadar ertelenmişti. Hâlâ geçerli karar, ama Yacht portalları yazılmadan önce `services/portalTrack.js`'e çekilmeli — yoksa kopya sayısı 12'ye çıkar.
7. **`tr()` helper + `UNIT_EXTRAS` ×3 kopya** — Phase 2d.RE hedefi, planlandığı gibi.
8. **SEO bileşeni 92 sayfanın 38'inde.** Ana eksikler: ROICalculator, NFCWriteGuide. Demo portalları bilinçli kapsam dışı tutulabilir (private experience'ler indekslenmemeli — hatta `noindex` düşünülmeli).
9. **`Ex Files/` ~500MB + `shareholders/` + `CLAUDE - Copy.md` + `realEstateSeed.js.backup`** — repo hijyeni. Ex Files git geçmişini ve her clone'u şişiriyor; arşivlenip repo'dan çıkmalı.
10. **Vite dev proxy ölü AWS IP'ye işaret ediyor** (`3.128.244.219`, "canlı backend" yorumuyla). Dev'de `/api` çağrıları sessizce timeout'lanır. 3 satırlık fix.

### 🟡 Düşük

11. 48 `console.log` (27 dosya, çoğu UnifiedDashboard) — kural ihlali, mekanik temizlik.
12. `backend/` Spring klasörü + 3 adet nginx.conf + SimpleMailTest.java — deprecated; bir gün `git rm` + arşiv.
13. Test kapsamı dar — 8 dosya; kritik akışlar (seed, region switch, tracking bridge) kısmen kapsanıyor.

---

## 5. Dokümantasyon Drift'i (CLAUDE.md düzeltilecekler)

| CLAUDE.md iddiası | Gerçek |
|---|---|
| "7 Cloud Function" | **9** — `aggregateVelocityMetrics` + `refreshDailyBriefAi` eksik |
| "Sentry setup — open item" | Sentry `main.jsx`'te init edilmiş, **DONE** |
| "blinq CSS 35K satır audit bekliyor" | Dosya **4KB** — audit fiilen yapılmış, madde kapatılmalı |
| "Root package.json'da jQuery/Paper.js" | Root'ta package.json yok; kalıntı `backend/package.json`'da |
| Composite index listesi "taps×2 + behaviors×2" | Gerçekte **13 index** deploy'lu (campaigns, deals, leads, events, audit dahil) |

Bu tablo bir sonraki CLAUDE.md güncellemesinde işlenmeli — yanlış envanter, gelecek directive'lerde yine stale-varsayım hatası üretir (Phase 2b.Auto'da 4 kez yaşandı).

---

## 6. Satış Perspektifi — Ürün Nerede?

**Hazır olan:** 2 sektör (RE + Auto) × 4 bölge × 4 dil, kişiselleştirilmiş VIP deneyimleri, gerçek zamanlı davranış istihbaratı, Unified Dashboard, Google Wallet, AI demo. Bir emlak geliştiricisine veya bayiye **bugün** uçtan uca demo yapılabilir.

**Eksik olan:**
- **Pitch deck** hâlâ tek-bölge dönemini anlatıyor — kodun 6 ay gerisinde. İlk temasta gösterilen şey bu; en pahalı boşluk burası.
- **Yacht** — sitede vertical yok; "3 sektör" iddiası henüz 2.
- **Pilot outreach** başlamadı — ürün pilotu taşıyabilir durumda.

---

## 7. Önerilen Yol Haritası

Karar çerçevesine göre (revenue → bug → sales enablement → debt → feature):

**Sprint A — Pitch Deck Refresh (sales-critical, en yüksek getiri).** Kod hazır, anlatı eski. 4 bölge ekran görüntüleriyle (Mexico ES Suite Cielo Real, Canada FR, Gulf AR, USA EN + Auto: Gulf G63 / Canada Tesla) yeni deck. Fable 5 + Cowork bunu uçtan uca üretebilir — kod gerektirmez, Cursor gerekmez.

**Sprint B — Hardening Paketi (yarım gün, müşteri öncesi şart).** Firestore Delete Protection + PITR aç · `functions/functions/` sil · CI workflow (build+test on PR) · vite proxy fix · `realEstateSeed.js.backup` + `CLAUDE - Copy.md` sil · CLAUDE.md drift tablosunu işle. Tamamı tek Cursor directive'i.

**Sprint C — Phase 2d.RE + tracking konsolidasyonu (Yacht'tan ÖNCE).** Planlı cleanup (`tr()`, `UNIT_EXTRAS`, floorPlan/payment canonical) + inline `trackEvent`'leri `portalTrack.js`'e çek. Gerekçe: Yacht portalları temiz pattern'le doğsun, kopya sayısı artmasın.

**Sprint D — Yacht portalları.** 3. sektör parity → "3 sektör × 4 bölge" iddiası gerçek olur. Auto pattern'i birebir şablon.

**Sprint E — FAZ 5.** Legacy dashboard'lar emekli (AutoDashboard 1.571L + Dashboard 1.313L silinir — en büyük 2 dosya ve `nameAr` kalıntısı bedavaya gider), `/unified`'a redirect.

**Sıralama önerim: A → B paralel (A'yı Claude, B'yi Cursor) → C → D → E.**

---

## 8. Fable 5'i Nerede Kullanmalısın?

Bugüne kadar Fable 5'i çoğunlukla "directive yazıcı" olarak kullandın — doğru ama eksik. Bu model farkını şuralarda gösterir:

1. **Bu rapor gibi çok-katmanlı denetimler** — paralel keşif ajanlarıyla 150 dosyalık tarama + sentez, tek oturumda. Her büyük sprint öncesi 15 dakikalık "gerçeklik kontrolü" olarak kullan (bugün Phase 2b.Auto'daki 4 stale hatayı bu yakaladı).
2. **Satış malzemesi üretimi** — pitch deck, one-pager, bölge-spesifik demo senaryoları. Marka dili (VIP Access Key, Private Invitation, 20/20 Vision) ve tasarım DNA zaten bağlamda; Sprint A Cursor'suz, uçtan uca üretilebilir.
3. **Karmaşık refactor TASARIMI** — useDashboardData'nın slice mimarisini Claude tasarlar, mekanik bölmeyi Cursor yapar. Tasarımsız refactor = Nisan'daki yarım kalmış seed refactor'ü.
4. **Paralel veri üretimi** — Phase 2c'de 1.632 string 3 sub-agent'la ~10 dakikada üretildi; Yacht için aynı yöntem (fleet data × 4 bölge × 4 dil).
5. **Cursor çıktısı audit'i** — "Cursor FIXED = hipotez" kuralının uygulayıcısı: grep proof + git blob + repo-level doğrulama.

Kısacası: **mekanik iş Cursor'a, muhakeme + sentez + satış işi Fable'a.** Rol ayrımı zaten doğruydu; eksik olan Fable'ın satış-enablement ve denetim kapasitesinin kullanılmamasıydı.

---

*Doğrulama notu: Tüm rakamlar 2026-07-03'te repo üzerinde `wc -l` / `grep` / `du` ile ölçüldü; üç bağımsız keşif ajanının çıktıları çapraz kontrol edildi. Çelişen 4 bulgu (blinq CSS boyutu, CI varlığı, Sentry durumu, function sayısı) manuel yeniden doğrulandı.*

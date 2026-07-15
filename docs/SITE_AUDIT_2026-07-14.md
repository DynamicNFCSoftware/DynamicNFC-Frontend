# SITE AUDIT — 2026-07-14 (Canlı site, Claude Cowork)

**Kapsam:** dynamicnfc.ca canlı prod — 15+ sayfa/portal, tüm linkler, konsol, i18n/RTL, region sistemi, içerik.
**Yöntem:** Chrome (render edilmiş SPA), link taraması, konsol logları, localStorage/region state, AR toggle testi.
**Durum:** Bulgular ÖNCE LOKALDE düzeltilecek, Oguzhan inceleyecek, sonra live. Bu dosya fix-sprint'in referansı.
**Geri dönüş noktası:** `pre-audit-fixes-2026-07-14` git tag + `DynamicNFC_pre-audit_2026-07-14.zip` (ikisi de host'ta — §E'deki komutlar; sandbox mount I/O arşiv için çok yavaştı) + Firebase Hosting release history.

---

## A. Gerçek buglar

| # | Bulgu | Yer | Detay |
|---|-------|-----|-------|
| A1 | **Çift navbar** | `/create-physical-card` | Global navbar + sayfanın kendi navbar'ı üst üste (iki logo, iki menü, iki dil toggle). Ekranda net görünüyor. |
| A2 | **Konsol hatası her oturumda** | tüm sayfalar (login'li) | `Admin check failed: FirebaseError: Missing or insufficient permissions.` — `useAdmin()` admin olmayan kullanıcı için `admins` koleksiyonunu okuyamıyor. Firestore rules ya okumaya izin vermeli ya da hook izin hatasını sessiz ele almalı. |
| A3 | **/yacht landing yok (404)** | `/yacht` | `/developers` ve `/automotive` landing'i var; yacht'ın yalnızca demo'su var. Footer "Yacht Brokerage" demo'ya gidiyor. Sektör paritesi için `/yacht` landing gerekli (roadmap'te zaten var). |

## B. İçerik / tutarlılık

| # | Bulgu | Yer | Detay |
|---|-------|-----|-------|
| B1 | **Tüzel unvan tutarsız** | `/enterprise` footer | Ana sayfa doğru: "© 2026 DynamicNFC Card Inc." (13 Tem kararı). `/enterprise` footer'ı hâlâ "© 2026 DynamicNFC — Sales Velocity Engine…", `/contact-sales` "© 2026 DynamicNFC — Sales Velocity Engine". Tek unvana çekilmeli. |
| B2 | **E-posta domain uyuşmazlığı** | `/contact-sales` | `info@dynamicnfc.help` vs site `dynamicnfc.ca`. Lüks B2B alıcısı için güven detayı — `.ca` adresine geçiş veya en azından alias değerlendirilmeli. |
| B3 | **"C Canva" fallback harfi** | Ana sayfa "What fires after the tap" | Canva logosu yerine fallback "C" harfi metin olarak iki kez görünüyor. Logo asset/render kontrolü. |
| B4 | **Yacht açıklaması birebir kopya** | Ana sayfa | "Private marina experiences for owners and charter clients — every sea trial begins with a name." cümlesi LIVE DEMOS ve INDUSTRIES bölümlerinde aynen tekrar. Birinde varyasyon yazılmalı. |
| B5 | **AR modda İngilizce kalan nav** | CRM demo portalları | Portal üst nav (Demo Hub, VIP Portal, Ahmed Portal, Marketplace, Dashboard, AI Pipeline) Arapçada İngilizce kalıyor. |
| B6 | **AR dilbilgisi** | VIP portal (Gulf) | "الوصول كبار الشخصيات" hatalı görünüyor (çift belirtme). Gulf pilotu öncesi native Arapça review. |
| B7 | **Title/SEO jenerik** | `/enterprise`, `/developers`, `/order-card` | Bazı sayfalarda `<title>` sayfa-spesifik oluyor (Home, CRM Demo, Yacht Gateway, VIP Portal ✓), bunlarda jenerik kalıyor. Bilinen 26-sayfa SEO borcunun kalanı. |
| B8 | **Emoji ikonlar** | `/enterprise` demo kartları, AI demo | 🌐 📊 ⚓ 👤 🌙 — design DNA "inline SVG/Lucide" diyor. Sprint F2 emoji tonu kısmen kapatmış; kalanlar bunlar. |
| B9 | **Navbar'da tam e-posta** | tüm sayfalar (login'li) | `oguzhan.alparslan@gmail.com` tam görünüyor — kısaltma/avatar tercih edilebilir (kozmetik). |

## C. Doğrulanan bug (Oguzhan onayı: bilerek değil)

| # | Bulgu | Detay |
|---|-------|-------|
| C1 | **Unified Overview metrikleri 0** | Demo portal gezintisi sonrası VIP Sessions / Website Visitors / Viewings Booked = 0. Oguzhan doğruladı: bilerek böyle DEĞİL. |

### C1 — KÖK NEDEN (2026-07-14 canlı teşhis, Claude)

Kanıt zinciri (canlıda, login'li owner hesabıyla):
1. Pipeline "+ Add Deal" → **"Could not create deal." + konsol: `FirebaseError: Missing or insufficient permissions`** — owner kendi tenant'ına deal YAZAMIYOR.
2. Okumalar çalışıyor: `tenants/{uid}/aggregates/dailyBrief` render oluyor (Today's brief güncel timestamp'li) — yani subcollection READ izinli.
3. Root doc yazması çalışıyor: `updateLastActivity` init'te await ediliyor ve akış devam ediyor.
4. Repo'daki `firestore.rules` bu create'e İZİN VERİYOR (owner + aggregates guard'ı geçiyor).

**Sonuç: Prod'a deploy edilmiş Firestore rules ≠ repo rules.** Deploy'lu sürüm tenant subcollection CREATE'i reddediyor. Bu tek nokta her şeyi açıklıyor: seed batch'i her yüklemede patlıyor (seedComplete=false kalıyor, tenant boş), portal bridge'in `tenants/{uid}/events` yazması sessizce (`.catch(()=>{})`) yutulup düşüyor, dashboard 0.

**Fix: `firebase deploy --only firestore:rules` (host'ta, repo root'tan).** Deploy sonrası dashboard'a ilk girişte seed otomatik koşacak (checkTenantExists → needsSeed).

### Bu oturumda yapılan kod düzeltmeleri (lokal, commit bekliyor)

| Dosya | Değişiklik |
|-------|-----------|
| `firestore.rules` | A2: kullanıcı KENDİ `admins/{email}` kaydını `get` edebilir (exists=false döner, permission hatası yerine). `list` hâlâ admin-only. |
| `hooks/useAdmin.js` | A2: `permission-denied` = "admin değil", console.error atılmıyor (diğer hatalar loglanmaya devam). |
| `services/tenantService.js` | C1-yan: `createTenantDeal` artık `sector`+`region` stamp'liyor (CLAUDE.md §7) — yoksa manuel deal strict filter'dan düşüp görünmez oluyordu. Fallback: `ud-sector`/`ud-region` localStorage. |
| `tabs/PipelineTab.jsx` | İki createTenantDeal çağrısına explicit `sector`/`region`; AddDealModal'a `currency={currency}` (Canada'da "Value (AED)" görünüyordu). |
| `pages/CreatePhysicalCard/CreatePhysicalCard.jsx` | A1: sayfanın lokal navbar'ı kaldırıldı (global navbar zaten var — çift navbar buydu); lokal `lang` state'i global `useLanguage()`'a bağlandı; ölü importlar temizlendi; **dosya sonundaki 1537 NUL byte** (bilinen sync artefaktı) temizlendi. |
| `pages/Home/Home.jsx` | B4: `demoYachtd` (EN+AR) Industries kartındaki metnin kopyasıydı — demo kartına özgü deneyimsel metin yazıldı. |
| Footer unvanları (9 dosya) | B1: `© 2026 DynamicNFC — …` → `© 2026 DynamicNFC Card Inc. — …` (Enterprise, ContactSales, Developers, RealEstate, Automotive sayfa+i18n dosyaları; ContactSales'taki bayat "© 2025" de düzeltildi). |

### Düzeltme İSTEMEYEN audit maddeleri (yeniden sınıflandırma)

- **B3 (Canva "C")**: Bug değil — trademark kaçınması için bilinçli çizilmiş SVG rozet. Dokunulmadı. İstenirse tasarım tazelenir.
- **B7 (SEO title)**: Enterprise/Developers repo'da `<SEO>` içeriyor; canlıda jenerik kalması muhtemelen bundle/deploy meselesi. Sonraki deploy'da doğrula; hâlâ jenerikse Helmet'e bakılır.
- **AddDealModal "e.g. Al Qamar" placeholder**: sectorConfig'ten geliyor, region-aware değil — kozmetik, sonraki içerik sprintine.

## D. Sağlam çalışanlar (regresyon kontrolü için pozitif liste)

- Legacy dashboard'lar → `/unified` redirect ✓ (`/enterprise/crmdemo/dashboard`, `/automotive/dashboard`)
- `/real-estate` → `/developers` redirect ✓
- Region sistemi: KSA → Khalid Al-Rashid/Al Noor/العربية; CAN → Marc Patel/Vista Residences/Français; `ud-region` localStorage persist ✓
- AR toggle → `dir=rtl` flip + proje adı çevirisi (مساكن النور) ✓
- Kırık link yok, kırık görsel yok, `href="#"` yok
- Automotive VIP (CAN: Liam Beaumont/Prestige Motors Vancouver) ✓, Yacht VIP (Robert MacKenzie/Pacific Marina) ✓

## E. Geri dönüş noktası — host'ta atılacak komutlar (PowerShell)

Sandbox mount'ta git state CRLF hayaleti gösterdiği için tag HOST'ta atılmalı:

```powershell
cd C:\Users\oguzh\DynamicNFC
git status          # önce gerçek durumu gör (branch main mi? working tree temiz mi? sandbox HEAD'i cursor/sprint-f2-content-medium gösterdi — doğrula)
git tag -a pre-audit-fixes-2026-07-14 -m "Rollback point before site audit fixes (SITE_AUDIT_2026-07-14)"
git push origin pre-audit-fixes-2026-07-14

# Kod zip'i (commit'li hali, saniyeler sürer):
git archive --format=zip -o ..\DynamicNFC_pre-audit_2026-07-14.zip HEAD
```

Geri dönüş gerekirse: `git checkout pre-audit-fixes-2026-07-14` (veya hosting için `firebase hosting:clone` release history).

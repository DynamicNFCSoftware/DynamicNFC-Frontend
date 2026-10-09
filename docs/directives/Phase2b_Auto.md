# Phase 2b.Auto — Automotive Demo 4-Region Parity

**Date:** 2026-06-01
**Owner:** Cursor Cloud Agent (Sonnet 4.6 High)
**Auditor:** Claude (claude.ai)
**Companion:** Phase 2b.RE pattern, adapted for Auto sector

---

## HEDEF
3 automotive portal'ı (AutomotivePortal, SultanPortal, PublicShowroom) tüm 4 bölgede (Gulf / USA / Mexico / Canada) ve 4 dilde (EN / AR / ES / FR) tam parity'e getir. Bölgeye özel araç envanteri, persona ve fiyatlar `useRegion()` üzerinden.

**Sonuç:** Aynı 3 route, `regionId` değiştiğinde araç listesi + persona + fiyat + dil tamamen yeni geliyor.

---

## KISITLAR

1. **Yeni route YOK.** RE'deki "16-page anti-pattern" hatasını tekrarlama. Tek route + `useRegion()` bölge enjekte eder.
2. **Veri yapısı: region-keyed object.** Tek dosya, 4 region key:
   ```js
   export const VEHICLES = {
     gulf: [ {...}, ... ],   // 9 araç
     usa: [ {...}, ... ],    // 9 araç
     mexico: [ {...}, ... ], // 9 araç
     canada: [ {...}, ... ], // 9 araç
   };
   ```
3. **Şema:** Her araç şu formatta — MEVCUT karışık şema (`name: "..."` + `nameAr: "..."`) hizalanacak:
   ```js
   {
     id: "g63",
     name: { en, ar, es, fr },
     priceLocal: 920000,            // bölge para birimi cinsinden ham sayı
     currency: "SAR",                // "SAR" | "USD" | "MXN" | "CAD"
     collection: "performance"|"suv"|"sedan"|"ev",
     image: g63Img,
     specs: { hp, accel, topSpeed },
     status: "available"|"reserved",
     colors: [{ name:{en,ar,es,fr}, hex }],
     interiors: [{ name:{en,ar,es,fr}, hex }],
   }
   ```
4. **Sultan portalı (5 araç) her bölgede VIP listesinin alt-kümesi** — `VEHICLES[regionId].filter(v => SULTAN_IDS[regionId].includes(v.id))`. Ayrı liste tutma.
5. **Hardcoded string YOK** — her user-facing string LANG üzerinden. **DİKKAT: i18n/portals/ altında automotive dosyası YOK** — 3 portal'da i18n **inline `const LANG = { en, ar }`** bloklarıdır (AutomotivePortal L63, SultanPortal L60, PublicShowroom L63). `es` + `fr` blokları bu inline LANG objelerine eklenir (Phase 2b.RE pattern'i ile aynı). Ayrıca portal gövdelerindeki tüm `lang === "ar" ? X : Y` hardcoded ternary'leri (crossnav linkleri, hero başlıkları, "Models" sayacı vb.) LANG key'lerine çevrilir — RE Phase 2b'de aynı dönüşüm yapıldı.
6. **CSS prefix değişmez** — `ap-`, `sp-`, `psr-`. Sadece içerik değişiyor.
7. **Tracking dokunulmaz** — `bridgeEventToFirestore` çağrıları aynı kalır. Yeni bölge eklemek tracking şemasını değiştirmez.
8. **Code Simplicity Mandate** — 3 portal'da `vehicles` selection helper'ı (`usePortalVehicles(portal)`) **tek hook** olarak `hooks/usePortalVehicles.js`'e gider, 3 yerde tekrar etmez.

---

## DOSYALAR

### Yeni
- `frontend/src/data/automotiveVehicleData.js` — region-keyed VEHICLES + SULTAN_IDS + COLLECTIONS
- `frontend/src/data/automotivePersonas.js` — `getAutoPersona(regionId, role)` → `{ vip, secondary }` per region
- `frontend/src/hooks/usePortalVehicles.js` — `usePortalVehicles('vip'|'sultan'|'showroom')` → returns filtered+localized vehicles for active region
- `frontend/src/pages/AutomotiveDemo/assets/` — 19 yeni `.jpg` (Oguzhan ekleyecek, FILENAME LİSTESİ §ASSET PLAN'da)

### Değişen
- `frontend/src/pages/AutomotiveDemo/AutomotivePortal.jsx` — inline `vehicles` array silinir, `usePortalVehicles('vip')` çağrısı eklenir; persona `getAutoPersona(regionId, 'vip')` ile gelir
- `frontend/src/pages/AutomotiveDemo/SultanPortal.jsx` — aynı pattern, `usePortalVehicles('sultan')`
- `frontend/src/pages/AutomotiveDemo/PublicShowroom.jsx` — aynı pattern, `usePortalVehicles('showroom')`
- 3 portal JSX'indeki **inline `const LANG`** blokları — `en` + `ar` korunur, `es` + `fr` eklenir (ayrı i18n dosyası YOK, oluşturma)
- 3 portal'a **region-aware dil cycle butonu** — RE referansı: `VIPPortal_Definitive.jsx` L48 `LANG_LABEL = { en, ar, es, fr }` + L609 `nextLang = region.languages.find(l => l !== lang) || region.languages[0]` + navbtn. Auto portallarında şu an dil butonu YOK — aynı pattern eklenir.

### Dokunulmaz
- `App.jsx` routing
- `RegionContext` (zaten 4-region)
- `firestoreTracking.js`, `portalFirestoreBridge.js`
- Mevcut RE pattern (`realEstateUnitData.js`) — Auto kendi mantığında, RE değişmez

---

## ENVANTER — ONAYLANDI (2026-06-01, Oguzhan)

### GULF — SAR
| id | model | collection | priceLocal |
|----|-------|------------|----:|
| g63 | Mercedes-AMG G 63 | suv | 920000 |
| gls600-maybach | Mercedes-Maybach GLS 600 | suv | 1070000 |
| range-rover-autobiography | Range Rover Autobiography LWB | suv | 950000 |
| lexus-lx600 | Lexus LX 600 VIP | suv | 780000 |
| maybach-s680 | Mercedes-Maybach S 680 | sedan | 1430000 |
| s580 | Mercedes-Benz S 580 4MATIC | sedan | 660000 |
| amg-gt63 | AMG GT 63 S E Performance | performance | 920000 |
| amg-sl63 | AMG SL 63 4MATIC+ | performance | 745000 |
| eqs580 | Mercedes EQS 580 4MATIC | ev | 620000 |

**Sultan (5):** `g63, gls600-maybach, range-rover-autobiography, maybach-s680, s580`

### USA — USD
| id | model | collection | priceLocal |
|----|-------|------------|----:|
| escalade-v | Cadillac Escalade-V Series | suv | 165000 |
| range-rover-sv | Range Rover SV LWB | suv | 245000 |
| maybach-s680 | Mercedes-Maybach S 680 | sedan | 380000 |
| porsche-taycan-turbo-s | Porsche Taycan Turbo S | ev | 225000 |
| tesla-model-s-plaid | Tesla Model S Plaid | ev | 110000 |
| bmw-760i | BMW 7-Series 760i xDrive | sedan | 140000 |
| rolls-royce-ghost | Rolls-Royce Ghost | sedan | 385000 |
| lucid-air-sapphire | Lucid Air Sapphire | ev | 250000 |
| porsche-cayenne-turbo-gt | Porsche Cayenne Turbo GT | suv | 200000 |

**Sultan (5):** `escalade-v, range-rover-sv, maybach-s680, bmw-760i, rolls-royce-ghost`

### MEXICO — MXN
| id | model | collection | priceLocal |
|----|-------|------------|----:|
| range-rover-autobiography | Range Rover Autobiography LWB | suv | 4800000 |
| g63 | Mercedes-AMG G 63 | suv | 4600000 |
| bmw-x7-m60i | BMW X7 M60i | suv | 3200000 |
| audi-q8-etron | Audi Q8 e-tron | ev | 2900000 |
| porsche-cayenne-turbo-ehybrid | Porsche Cayenne Turbo E-Hybrid | suv | 3400000 |
| maybach-s680 | Mercedes-Maybach S 680 | sedan | 7600000 |
| lexus-lx600 | Lexus LX 600 | suv | 3000000 |
| gls600-maybach | Mercedes-Maybach GLS 600 | suv | 5700000 |
| bentley-bentayga-ewb | Bentley Bentayga EWB | suv | 8200000 |

**Sultan (5):** `range-rover-autobiography, g63, bmw-x7-m60i, maybach-s680, gls600-maybach`

### CANADA — CAD
| id | model | collection | priceLocal |
|----|-------|------------|----:|
| tesla-model-s-plaid | Tesla Model S Plaid | ev | 165000 |
| porsche-taycan-turbo-gt | Porsche Taycan Turbo GT | ev | 290000 |
| range-rover-autobiography | Range Rover Autobiography | suv | 245000 |
| eqs580 | Mercedes EQS 580 4MATIC | ev | 185000 |
| audi-rs-etron-gt | Audi RS e-tron GT | ev | 195000 |
| porsche-cayenne-turbo-ehybrid | Porsche Cayenne Turbo E-Hybrid | suv | 215000 |
| bmw-i7-m70 | BMW i7 M70 xDrive | sedan | 235000 |
| lucid-air-grand-touring | Lucid Air Grand Touring | ev | 175000 |
| genesis-g90 | Genesis G90 Long Wheelbase | sedan | 135000 |

**Sultan (5):** `range-rover-autobiography, eqs580, bmw-i7-m70, porsche-cayenne-turbo-ehybrid, genesis-g90`

---

## PERSONALAR — ONAYLANDI

`data/automotivePersonas.js`:

```js
export const AUTO_PERSONAS = {
  gulf: {
    vip:       { name:{en:"Khalid Al-Mansouri", ar:"خالد المنصوري", es:"Khalid Al-Mansouri", fr:"Khalid Al-Mansouri"}, title:{en:"Royal Family Advisor", ar:"...", es:"...", fr:"..."} },
    secondary: { name:{en:"Sultan Al-Otaibi",   ar:"سلطان العتيبي", es:"Sultan Al-Otaibi",   fr:"Sultan Al-Otaibi"}, title:{en:"Private Collector",   ...} },
  },
  usa: {
    vip:       { name:{en:"Marcus Sterling", ar:"ماركوس ستيرلينغ", es:"Marcus Sterling", fr:"Marcus Sterling"}, title:{en:"Manhattan Capital Partners", ...} },
    secondary: { name:{en:"James Carlisle",  ar:"جيمس كارلايل",  es:"James Carlisle",  fr:"James Carlisle"},  title:{en:"Hamptons Family Office",     ...} },
  },
  mexico: {
    vip:       { name:{en:"Don Eduardo Vargas", ar:"دون إدواردو فارغاس", es:"Don Eduardo Vargas", fr:"Don Eduardo Vargas"}, title:{en:"Polanco Holdings", es:"Patrimonio Polanco", ...} },
    secondary: { name:{en:"Diego Hernández",    ar:"دييغو هيرنانديز",   es:"Diego Hernández",    fr:"Diego Hernández"},   title:{en:"Monterrey Investments", es:"Inversiones Monterrey", ...} },
  },
  canada: {
    vip:       { name:{en:"Liam Beaumont", ar:"ليام بومونت", es:"Liam Beaumont", fr:"Liam Beaumont"}, title:{en:"Vancouver Tech Capital", fr:"Capital Tech Vancouver", ...} },
    secondary: { name:{en:"Olivia Chen",   ar:"أوليفيا تشين", es:"Olivia Chen",   fr:"Olivia Chen"},   title:{en:"Yaletown Wealth",        fr:"Patrimoine Yaletown",  ...} },
  },
};

export const getAutoPersona = (regionId, role) =>
  AUTO_PERSONAS[regionId]?.[role] || AUTO_PERSONAS.gulf[role];
```

---

## ADIMLAR (Cursor execute order)

### 1. Data layer (foundation)
- `data/automotiveVehicleData.js` — Yukarıdaki 4 envanter tablosu doğrudan kod halinde
- `data/automotivePersonas.js` — Yukarıdaki obje
- `hooks/usePortalVehicles.js` — **DİKKAT: `contexts/RegionContext` diye bir dosya YOK**; `useRegion` `hooks/useRegion.jsx`'te:
  ```js
  import { useRegion } from "./useRegion";
  import { VEHICLES, SULTAN_IDS } from "../data/automotiveVehicleData";
  export function usePortalVehicles(portal) {
    const { regionId } = useRegion();
    const all = VEHICLES[regionId] || VEHICLES.gulf;
    if (portal === "sultan") {
      const ids = SULTAN_IDS[regionId] || [];
      return all.filter(v => ids.includes(v.id));
    }
    return all; // vip + showroom = full 9
  }
  ```

### 2. Portal refactor (3 paralel sub-agent)
Üç portal birbirinden bağımsız, paralel verilebilir:

**Ortak (3 portal):** Render'da lokalize field erişimi `v.name?.[lang] ?? v.name.en` fallback'li olmalı (Phase 2b.RE crash dersi — `tr()` pattern'i). Mevcut `usePortalRegion("automotive", lang)` çağrıları korunur; `regionId` zaten bu helper'dan destructure edilebilir.

**SUB-AGENT A — AutomotivePortal.jsx (945L)**
- L301'den başlayan inline `const VEHICLES = [...]` array sil
- `import { usePortalVehicles } from "../../hooks/usePortalVehicles"` ekle
- `const vehicles = usePortalVehicles("vip")` ekle (component üstüne)
- `vipPersona`'yı `getAutoPersona(regionId, "vip")` ile değiştir
- Color/interior `name`/`nameAr` flat fieldları `{ en, ar, es, fr }` objeye taşı (yeni data dosyasında)
- Render site'lardaki `lang === "ar" ? v.nameAr : v.name` → `v.name?.[lang] ?? v.name.en`

**SUB-AGENT B — SultanPortal.jsx (909L)**
- L293'ten başlayan kendi inline `const VEHICLES` array'i sil (Sultan'ın AYRI listesi var — silinip `usePortalVehicles("sultan")` filter'ına geçilir)
- `secondaryPersona = getAutoPersona(regionId, "secondary")`

**SUB-AGENT C — PublicShowroom.jsx (565L)**
- L179'dan başlayan inline `const VEHICLES` sil, `usePortalVehicles("showroom")`
- 9 araç (VIP listesinin tamamı), `priceRange` field'ı kaldır (12 kullanım, hardcoded "From $240K" stringleri) → `fmtCurrency(v.priceLocal)` ile göster
- **YENİ HELPER YAZMA** — `fmtCurrency` zaten `usePortalRegion("automotive", lang)`'dan geliyor (L202'de helper çağrısı var, sadece `fmtCurrency` destructure'a eklenir). `utils/formatPrice.js` OLUŞTURMA.

### 3. i18n — ES + FR ekleme
3 portal'ın **inline `const LANG`** bloğunda `en` + `ar` zaten var. `es` + `fr` blokları aynı objeye eklenecek. Çeviri kaynağı: mevcut `en` blokları → ES/FR'ye natif çevrilir (formal/luxury tone). Toplam ~1440 string. Plus: gövdedeki `lang === "ar" ? X : Y` ternary'leri LANG key'lerine taşınır (yoksa ES/FR'de Arapça/İngilizce karışık render olur).

**Strateji:** Tek sub-agent (Cursor) tüm i18n'i tek pass'te halleder. Otomatik çeviri yapma — model translation'ı düşük kaliteli, manual yazılması daha iyi.

### 4. Build + 4-region QA
```powershell
cd frontend
npm run build          # Vite build PASS olmalı
```
Manuel test:
- `/automotive/demo/khalid` → 4 region cycle, her bölgede 9 farklı araç + bölgeye özel persona
- `/automotive/demo/sultan` → 4 region cycle, her bölgede 5 araç
- `/automotive/demo/showroom` → 4 region cycle, fiyatlar local currency'de doğru format
- 4 dil cycle (EN→AR→ES→FR) her portal'da
- Form gönderimi (`test_drive_request` tracking event) Firestore'a yazılıyor mu — F12 → `behaviors` koleksiyonuna yeni doc

### 5. Deploy
```powershell
cd ..
firebase deploy --only hosting
```

---

## BİTTİ SAYILIR (Acceptance Criteria)

- [ ] `automotiveVehicleData.js` mevcut, 4 region × 9 araç = 36 araç
- [ ] `automotivePersonas.js` mevcut, 4 region × 2 persona = 8 persona, hepsi 4 dil
- [ ] `usePortalVehicles` hook mevcut, 3 portal'da kullanılıyor
- [ ] 3 portal'da inline `vehicles` array YOK
- [ ] 3 portal'ın inline `LANG` bloğunda `en, ar, es, fr` keyleri var
- [ ] Color/interior schema `{ en, ar, es, fr }` objesi (flat `name`/`nameAr` YOK)
- [ ] **Grep proof:** `grep -rn "nameAr" frontend/src/pages/AutomotiveDemo/` → 0 sonuç; `grep -rn "priceRange" frontend/src/pages/AutomotiveDemo/` → 0 sonuç
- [ ] 3 portal'da region-aware dil cycle butonu (LANG_LABEL + nextLang, VIPPortal pattern)
- [ ] Asset folder'da 19 yeni `.jpg` mevcut — YOKSA mevcut jpg'lerden placeholder import + `// TODO(asset)` comment, build KIRILMAZ
- [ ] `npm run build` PASS, console.warn YOK
- [ ] **Runtime QA (build PASS yetmez — Phase 2b.RE crash dersi):** `npm run dev` ile her yeni dil (ES + FR) × en az 1 portal screenshot — ErrorBoundary tetiklenmiyor
- [ ] 4 region × 3 portal × 4 dil = 48 kombinasyonun her birinde portal açılıyor, form gönderilebiliyor, tracking Firestore'a yazıyor
- [ ] `dynamicnfc.ca/automotive/demo/khalid` Canada'ya geçince Tesla Model S Plaid görüyor, Gulf'a geçince G 63 görüyor
- [ ] `CLAUDE_HANDOFF.md` "Phase 2b.Auto deploy edildi" satırı eklenmiş

---

## ASSET PLAN — 19 yeni jpg (Oguzhan ekleyecek)

Folder: `frontend/src/pages/AutomotiveDemo/assets/`
Format: `.jpg`, ≥1200px width, 16:9 veya 3:2 oranı, beyaz/açık zemin tercih edilir

| # | filename | Marka kaynak sayfası |
|---|----------|---------------------|
| 1 | range-rover-autobiography.jpg | landrover.com/vehicles/range-rover/autobiography |
| 2 | lexus-lx600.jpg | lexus.com/models/LX |
| 3 | cadillac-escalade-v.jpg | cadillac.com/sedans-suvs/escalade-v |
| 4 | range-rover-sv.jpg | landrover.com/vehicles/range-rover/sv |
| 5 | porsche-taycan-turbo-s.jpg | porsche.com/usa/models/taycan/taycan-models/taycan-turbo-s |
| 6 | tesla-model-s-plaid.jpg | tesla.com/models (Plaid trim) |
| 7 | bmw-760i.jpg | bmwusa.com/vehicles/bmw/7-series/sedan |
| 8 | rolls-royce-ghost.jpg | rolls-roycemotorcars.com/ghost |
| 9 | lucid-air-sapphire.jpg | lucidmotors.com/air/sapphire |
| 10 | porsche-cayenne-turbo-gt.jpg | porsche.com/usa/models/cayenne/cayenne-turbo-gt |
| 11 | bmw-x7-m60i.jpg | bmwusa.com/vehicles/bmw/x7 |
| 12 | audi-q8-etron.jpg | audiusa.com/us/web/en/models/q8-e-tron |
| 13 | porsche-cayenne-turbo-ehybrid.jpg | porsche.com/usa/models/cayenne/cayenne-e-hybrid-models |
| 14 | bentley-bentayga-ewb.jpg | bentleymotors.com/en/models/bentayga/bentayga-ewb |
| 15 | porsche-taycan-turbo-gt.jpg | porsche.com/usa/models/taycan (Turbo GT trim) |
| 16 | audi-rs-etron-gt.jpg | audiusa.com/us/web/en/models/e-tron-gt/rs-e-tron-gt |
| 17 | bmw-i7-m70.jpg | bmwusa.com/vehicles/bmw/i7 |
| 18 | lucid-air-grand-touring.jpg | lucidmotors.com/air/grand-touring |
| 19 | genesis-g90.jpg | genesis.com/us/en/g90 |

**Hızlı yöntem:** Her marka sayfasında ana hero foto right-click → "Save image as" → `frontend/src/pages/AutomotiveDemo/assets/<filename>` olarak kaydet. Üreticiler genelde 2000px+ servis ediyor; gerek yoksa resize etme (Vite zaten optimize ediyor).

**Alternatif kaynaklar (lisans-temiz):**
- Wikimedia Commons (CC-licensed araç fotoğrafları)
- netcarshow.com (basın fotoğrafları, kısmen ücretsiz)
- Auto manufacturer press kit'leri (genelde editorial use için ücretsiz)

19 asset bekleniyor — eksikse Cursor placeholder olarak `g63.jpg`'i (mevcut) referans verebilir, build crash etmesin diye.

---

## RISKLER

1. **i18n çeviri kalitesi** — ES/FR luxury automotive vocabulary'si önemli. Cursor'ın çevirisi yetersizse Oguzhan tek tek revize eder.
2. **Image sourcing gecikmesi** — 19 araç manual download. Cursor build'i yapamayabilir asset eksikse → placeholder import + TODO comment.
3. **Color hex tutarlılığı** — Yeni 27 araç için renk paletleri uydurmak yerine, ortak palet (Obsidian/Polar White/Selenite Grey) reuse edilebilir. Cursor uydursun, Oguzhan revize eder.
4. **Currency formatting** — ÇÖZÜLDÜ SAYILIR: `regionConfig.formatCurrency` + `FORCED_CURRENCY_PREFIX = { mexico: 'MX$', canada: 'CA$' }` zaten canlıda (Phase 2a). Portallar SADECE `usePortalRegion`'dan gelen `fmtCurrency(v.priceLocal)` kullanır. Yeni Intl kodu YAZMA, hardcoded "$" YOK.

---

## ÇIKTI ŞABLON (Cursor → Claude raporu)

```
Phase 2b.Auto — Done
- Data file lines: <X>
- Portal LoC change: AutomotivePortal -<A>, SultanPortal -<B>, PublicShowroom -<C>
- i18n strings added: <ES+FR count>
- Build: PASS / FAIL (errors: ...)
- Open items: [<asset eksikleri>, <çeviri TODO'ları>]
```

Bu rapor Claude'a iletilir → audit → sign-off → handoff güncelle → deploy.

---

**Hazırlayan:** Claude (claude.ai)
**Onaylayan:** Oguzhan
**Cursor execute:** 2026-06-01+

# Sprint C — Phase 2d.RE Cleanup + portalTrack Konsolidasyonu

**Date:** 2026-07-03
**Owner:** Cursor Cloud Agent
**Auditor:** Claude (Cowork)
**Ön koşul:** Sprint B merged (`05a5fd07`). Bu sprint Yacht portallarından ÖNCE gelir — Yacht temiz pattern'le doğsun.

---

## HEDEF
İki bağımsız temizlik tek sprint'te:
**(A)** 6 demo portalındaki kopya inline `trackEvent` bloklarını tek `services/portalTrack.js` helper'ına çek — ve tracking'e giden persona'yı region-aware yap (şu an USA region'da bile "Khalid Al-Rashid" raporlanıyor — yanlış veri).
**(B)** Phase 2d.RE — 3 RE portalındaki `UNIT_EXTRAS` local dict'lerini `config/realEstateUnitData.js` canonical'ına taşı, floorPlan oda etiketlerine ES+FR ekle, `tr()` helper'ı emekli et.

---

## KISITLAR

1. **BroadcastChannel listener'larına DOKUNMA** — `Dashboard.jsx`, `AutoDashboard.jsx`, `NotificationSystem.jsx` sadece dinleyici; oldukları gibi kalır. Event ŞEMASI değişmez (id, timestamp, portalType, vipId, vipName, source, deviceType, event, ...data) — dashboards kırılmasın.
2. **`portalFirestoreBridge.js` DEĞİŞMEZ** — dual-write davranışı aynen korunur, helper onu çağırır.
3. **Event action isimleri değişmez** — `portal_opened`, `view_unit`, `book_viewing` vb. aynı stringler.
4. **Auto portalları (A kapsamında) veri katmanına dokunulmaz** — `automotiveVehicleData.js` zaten temiz.
5. Code Simplicity Mandate: helper TEK dosya ~35 satır; portal başına inline blok (~30 satır) silinir, yerine 1-2 satır gelir.

---

## PART A — portalTrack konsolidasyonu

### A1. Yeni dosya: `frontend/src/services/portalTrack.js`
```js
import { bridgeEventToFirestore } from "./portalFirestoreBridge";

const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("dnfc_tracking") : null;

const deviceType = () =>
  /Mobi|Android/i.test(navigator.userAgent) ? "mobile"
  : /Tablet|iPad/i.test(navigator.userAgent) ? "tablet"
  : "desktop";

export function trackPortalEvent(portalType, persona, event, data = {}) {
  const ev = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    portalType,
    vipId: persona?.id ?? null,
    vipName: persona?.name ?? null,
    source: "nfc",
    deviceType: deviceType(),
    event,
    ...data,
  };
  try {
    const events = JSON.parse(localStorage.getItem("dnfc_events") || "[]");
    events.push(ev);
    localStorage.setItem("dnfc_events", JSON.stringify(events));
  } catch (e) { /* localStorage dolu/kapalı — takip UI'ı bloklamasın */ }
  _bc?.postMessage(ev);
  bridgeEventToFirestore(ev);
}
```

### A2. 6 portal swap
Her portalda (VIPPortal_Definitive, AhmedPortal, MarketplacePortal, AutomotivePortal, SultanPortal, PublicShowroom):
- Module-level `_bc`, `_source`, inline `const trackEvent = ...` bloğu SİL.
- Component içinde, `usePortalRegion` çağrısından SONRA:
  ```js
  const trackEvent = useCallback(
    (event, data) => trackPortalEvent("vip", vipPersona, event, data),
    [vipPersona]
  );
  ```
  - portalType per portal: `"vip"` / `"family"` / `"marketplace"` / `"auto-vip"` / `"auto-sultan"` / `"showroom"` — MEVCUT değerleri koru (her portalın inline bloğundaki mevcut `portalType` stringini birebir kullan, uydurma).
  - persona per portal: VIP→`vipPersona`, Ahmed→`familyPersona`, Sultan→`secondaryPersona`, Marketplace/Showroom→`null` (anonim).
- Module-level scope'ta `trackEvent` çağıran kod varsa (component dışı) component içine taşı ya da doğrudan `trackPortalEvent` çağır.
- **DİKKAT:** Mevcut inline bloklarda hardcoded `vipId: "KR-001", vipName: "Khalid Al-Rashid"` gibi değerler var — bunlar SİLİNİYOR, persona objesi region'dan geliyor. `persona.id` alan adı `regionConfig` personas şemasıyla eşleşiyor (id/name alanları mevcut — doğrula).

---

## PART B — Phase 2d.RE (UNIT_EXTRAS canonical migrate)

### B1. Mevcut durum (2026-07-03 doğrulanmış)
- 3 RE portalında local `const UNIT_EXTRAS = { "lux-ph": { img, floorPlan: { rooms: [{ key, w, h, x, y, label: { en, ar } }] } }, ... }` dict'leri var (VIP L490 civarı).
- `label` sadece `{en, ar}` — ES/FR'de `tr()` fallback EN gösteriyor.
- `tr()` kullanımı artık az (VIP 3, Ahmed 2, Marketplace 3 çağrı) — hepsi UNIT_EXTRAS kaynaklı.

### B2. Taşıma
- `config/realEstateUnitData.js`'e `UNIT_MEDIA` export'u ekle:
  ```js
  export const UNIT_MEDIA = {
    "lux-ph": { img: "...", floorPlan: { rooms: [ { key, w, h, x, y, label: { en, ar, es, fr } }, ... ] } },
    // tüm unit id'leri: lux-ph, lux-grand, lux-exec, fam-3br, fam-4br, fam-2br
  };
  ```
  - Mevcut en+ar etiketler 3 portaldan birleştirilir (aynı unit id'nin extras'ı portallar arasında aynıysa TEK kopya; farklıysa farkı koru ve raporda belirt).
  - **ES+FR çeviriler:** Oda etiketleri mekanik ("Master Suite", "Bedroom 2", "Kitchen", "580 sq ft" vb.) — Cursor doğrudan çevirir. Format korunur: `"Suite Principal\n54 m²"` gibi `\n` içeren stringlerde `\n` pozisyonu aynı kalır. sq ft → ES/FR'de de sq ft kalır (sayı çevrilmez).
- `services/portalRegion.js` → `usePortalRegion` return'una `unitMedia` accessor ekle (mevcut luxuryUnits/familyUnits pattern'iyle aynı).
- 3 portal: local `UNIT_EXTRAS` SİL, `unitMedia` helper'dan tüket. Render'da `label[lang] ?? label.en`.
- `tr()` helper tanımlarını 3 portaldan SİL (kalan çağrı olmadığını grep'le kanıtla).
- `payment.plans` / paymentModal içerikleri zaten LANG bloklarında 4 dilde — SADECE `{en, ar}`-only kalan veri objesi bulursan aynı pattern'le 4 dile tamamla, bulamazsan dokunma (scope creep yapma).

---

## VERIFY

```
npm run build   → PASS
npm test        → PASS
```
Grep proofs (frontend/src altında):
- `grep -rn "new BroadcastChannel" pages/` → SADECE Dashboard.jsx, AutoDashboard.jsx, NotificationSystem.jsx (3 listener; 6 portal 0)
- `grep -rn "UNIT_EXTRAS" pages/` → 0
- `grep -rn "const tr = \|const tr=" pages/VIPPortal pages/AhmedPortal pages/MarketplacePortal` → 0
- `grep -rn "Khalid Al-Rashid" pages/VIPPortal/VIPPortal_Definitive.jsx` → 0 (tracking'te hardcoded isim kalmadı; LANG içi metinler regionConfig'ten geldiği için zaten yok — varsa raporla)
- `grep -c "trackPortalEvent" services/portalTrack.js` → ≥1; 6 portal her biri import ediyor

Runtime QA (build PASS yetmez):
- `npm run dev` → USA region + VIP portal → console'da/Firestore'da event `vipName: "James Mitchell"` (Khalid DEĞİL)
- Marketplace incognito → 3 tık → `behaviors` koleksiyonuna 3 doc (anonim yol kırılmadı)
- İki sekme testi: portal + `/enterprise/crmdemo/dashboard` → canlı aktivite düşüyor (BC hattı sağlam)
- ES + FR'de VIP floor plan modal → oda etiketleri çevrili, EN fallback değil

---

## BİTTİ SAYILIR
- [ ] `portalTrack.js` tek helper, 6 portal tüketiyor, inline bloklar silindi (~180 satır net eksi beklenir)
- [ ] Tracking persona'sı region-aware (USA→James Mitchell doğrulandı)
- [ ] `UNIT_MEDIA` canonical'da 4 dilde, 3 portal helper'dan tüketiyor, `tr()` yok
- [ ] Grep proofs 5/5 + Runtime QA 4/4
- [ ] 2 atomik commit: `refactor(tracking): consolidate portal trackEvent into portalTrack service (region-aware persona)` + `refactor(re-data): migrate UNIT_EXTRAS to canonical UNIT_MEDIA with 4-lang labels (Phase 2d.RE)`
- [ ] Push + CI yeşil

## ÇIKTI ŞABLON
```
Sprint C — Done
- portalTrack: 6/6 portal swapped, net LoC: -<X>
- UNIT_MEDIA: <N> unit × <M> room, ES/FR eklendi
- Persona QA: USA VIP event vipName = <?>
- Build/Test/CI: PASS/FAIL
- Open items: [...]
```

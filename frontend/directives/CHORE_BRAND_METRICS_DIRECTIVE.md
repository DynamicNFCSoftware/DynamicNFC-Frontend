# CHORE — Fake-Metric Purge + AutoGateway Parity

**Hedef:** Canlıdaki fake metrikleri temizle (marka kuralı: istatistik uydurma YASAK) + AutoGateway'i YachtGateway header pattern'ine getir.

**Kısıtlar:** Copy dili korunur; sayı yerine qualitative (Named / Real-Time / Zero Guesswork — 4 dilde). Yeni bağımlılık yok. Route değişikliği yok.

**Dosyalar:**
1. `frontend/index.html` — meta `description`, `og:description`, `twitter:description` içindeki "3.2× higher conversion rate" ve türevleri → qualitative rewrite (ör. "Turn anonymous traffic into named, high-intent prospects — real-time buyer intelligence, zero guesswork."). Başka meta'ya dokunma.
2. `frontend/src/pages/AutomotiveDemo/AutoGateway.jsx` — T objesindeki `stat1v: "47%"`, `stat2v: "3.2×"` blokları (4 dil): YachtGateway'deki gibi `Named / Every Buyer`, `Real-Time / Intent Signals`, `Zero / Guesswork` karşılıklarına çevir. Ayrıca YachtGateway.jsx'ten header pattern'ini port et: `REGION_CODE` pill'leri (KSA/USA/MEX/CAN, `switchRegion`), dil cycle butonu (`LANG_LABEL[nextL]`, region.languages üzerinden), tipografik logo (beyaz Dynamic + kırmızı NFC + mavi dalga SVG). CSS'e `ag-` prefix'li eşdeğer stiller (YachtGateway.css'teki `ygw-region*`, `ygw-lang`, `ygw-logo*` bloklarını kopyala-uyarlа).
3. Grep proof: `grep -rn "47%\|3\.2×\|3\.2x" frontend/index.html frontend/src/pages/AutomotiveDemo/` → 0 sonuç (CSS rem değerleri hariç).

**Bitti sayılır:** build PASS + grep 0 + AutoGateway'de 4 region pill + dil butonu çalışıyor (dev screenshot) + tek commit `chore(brand): purge fake metrics from index.html + AutoGateway, port gateway header parity`.

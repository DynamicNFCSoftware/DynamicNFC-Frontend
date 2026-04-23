# ExportPDF.jsx — LETTERHEAD Version

**Hedef:** PDF export'u `Letter head sample DynamicNFC ver 2.pdf`'teki antetli kâğıt tasarımıyla birebir eşleşsin.

**Asset hazır:**
- ✅ `/frontend/public/assets/images/letterhead-bg.png` (1240×1754, A4 portrait, ~76KB)
- Letterhead PDF page 1'den render edildi: logo + adres + kırmızı tagline + maple leaf hepsi içinde
- Beyaz arka plan, content için orta beyaz alan mevcut

---

## Strateji

jsPDF ile her sayfanın **background**'ına letterhead-bg.png konur (full page fill), sonra captured dashboard content **safe area**'ya yerleştirilir:

```
┌─────────────────────────────────────────┐
│  [LOGO]              NFC Software...    │  ← Header zone (top 55mm, protected)
│                      1079 Canyon Blvd.  │
│                      V7R 2K5 NVan/BC    │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│     [DASHBOARD CONTENT AREA]            │  ← Safe area (55mm → 255mm)
│     (capture'dan gelen görsel)           │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│   Turn Every Tap Into a  🍁             │  ← Footer zone (bottom 42mm, protected)
│      Qualified Lead                     │
└─────────────────────────────────────────┘
```

Content yüksekliği her sayfada **200mm** (297 - 55 - 42), taşarsa otomatik sayfa 2/3.

---

## Tam Dosya — REPLACE `frontend/src/pages/UnifiedDashboard/components/ExportPDF.jsx`

```jsx
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDashboard } from "../DashboardContext";

const LABELS = {
  en: { export: "Export PDF", exporting: "Generating...", section: "Section" },
  ar: { export: "تصدير PDF", exporting: "جارٍ الإنشاء...", section: "القسم" },
  fr: { export: "Exporter PDF", exporting: "Génération...", section: "Section" },
  es: { export: "Exportar PDF", exporting: "Generando...", section: "Sección" },
  tr: { export: "PDF İndir", exporting: "Oluşturuluyor...", section: "Bölüm" },
};

// Safe print area (mm) — letterhead header/footer protected zones
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const TOP_SAFE_MM = 55;    // header protected zone
const BOTTOM_SAFE_MM = 42; // footer protected zone (red script + maple leaf)
const SIDE_MARGIN_MM = 14;
const CONTENT_W_MM = PAGE_W_MM - SIDE_MARGIN_MM * 2;
const CONTENT_H_MM = PAGE_H_MM - TOP_SAFE_MM - BOTTOM_SAFE_MM;

const LETTERHEAD_PATH = "/assets/images/letterhead-bg.png";

/**
 * Fetch letterhead template and convert to base64 for jsPDF.
 */
async function loadLetterheadBase64() {
  const res = await fetch(LETTERHEAD_PATH);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Capture the main dashboard content as a canvas.
 * Hides any [data-pdf-hide] elements during capture (export button, skip-link).
 */
async function captureMain() {
  const main = document.querySelector(".ud-main-content") || document.querySelector(".ud-main");
  if (!main) throw new Error("Main content not found");

  const hidden = document.querySelectorAll("[data-pdf-hide], .ud-skip-link");
  hidden.forEach((el) => (el.style.visibility = "hidden"));

  try {
    const canvas = await html2canvas(main, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    return canvas;
  } finally {
    hidden.forEach((el) => (el.style.visibility = ""));
  }
}

/**
 * Slice captured canvas across multiple A4 pages, each overlayed on letterhead.
 */
async function buildPdf(canvas, letterheadB64, sectionTitle) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // How much canvas (px) fits in content area per page
  const canvasPxPerMm = canvas.width / CONTENT_W_MM;
  const pageSlicePx = Math.floor(CONTENT_H_MM * canvasPxPerMm);

  const totalPages = Math.max(1, Math.ceil(canvas.height / pageSlicePx));

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // 1. Draw letterhead background (full page)
    pdf.addImage(letterheadB64, "PNG", 0, 0, PAGE_W_MM, PAGE_H_MM, undefined, "FAST");

    // 2. Slice canvas for this page
    const sliceY = page * pageSlicePx;
    const sliceH = Math.min(pageSlicePx, canvas.height - sliceY);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceH;
    const ctx = sliceCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

    // 3. Place content in safe area
    const sliceHeightMm = sliceH / canvasPxPerMm;
    pdf.addImage(
      sliceCanvas.toDataURL("image/png"),
      "PNG",
      SIDE_MARGIN_MM,
      TOP_SAFE_MM,
      CONTENT_W_MM,
      sliceHeightMm,
      undefined,
      "FAST"
    );

    // 4. Optional: page number in footer zone (small, subtle)
    if (totalPages > 1) {
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `${page + 1} / ${totalPages}`,
        PAGE_W_MM - SIDE_MARGIN_MM,
        PAGE_H_MM - 8,
        { align: "right" }
      );
    }
  }

  return pdf;
}

export default function ExportPDF() {
  const { lang, activeSection } = useDashboard();
  const [busy, setBusy] = useState(false);
  const L = LABELS[lang] || LABELS.en;

  const handleExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const letterheadB64 = await loadLetterheadBase64();
      const canvas = await captureMain();
      const sectionTitle = activeSection || L.section;
      const pdf = await buildPdf(canvas, letterheadB64, sectionTitle);
      const dateStr = new Date().toISOString().slice(0, 10);
      const safeSection = sectionTitle.replace(/[^\w-]+/g, "_");
      pdf.save(`DynamicNFC_${safeSection}_${dateStr}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("PDF export failed. Check console.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="ud-btn ud-btn-primary ud-export-pdf-btn"
      onClick={handleExport}
      disabled={busy}
      data-pdf-hide
      aria-label={L.export}
    >
      {busy ? (
        <>
          <span className="ud-spinner" aria-hidden="true" /> {L.exporting}
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {L.export}
        </>
      )}
    </button>
  );
}
```

---

## CSS (varsa `UnifiedDashboard.css` sonuna ekle)

```css
.ud-export-pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  background: #e63946;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ud-export-pdf-btn:hover:not(:disabled) { background: #c1121f; }
.ud-export-pdf-btn:disabled { opacity: 0.6; cursor: wait; }

.ud-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ud-spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes ud-spin {
  to { transform: rotate(360deg); }
}

/* Accessibility skip link must be hidden during PDF capture */
.ud-skip-link[data-pdf-hide],
[data-pdf-hide] {
  /* default visible; captureMain() will toggle via JS */
}
```

---

## Doğrulama Adımları

1. **Asset check:**
   ```bash
   ls -la frontend/public/assets/images/letterhead-bg.png
   ```
   Beklenen: ~76KB, 1240×1754 px.

2. **Dependency check:**
   ```bash
   cd frontend && npm list jspdf html2canvas
   ```
   `jspdf ^4.2.1` ve `html2canvas` görünmeli.

3. **Build:**
   ```bash
   cd frontend && npm run build
   ```
   Temiz geçmeli.

4. **Preview & test:**
   ```bash
   npm run preview
   ```
   `http://localhost:4173/unified` → Export PDF butonuna bas → PDF indir.

5. **PDF içerik kontrol:**
   - ✅ Top-left: Dynamic+NFC logo
   - ✅ Top-right: "NFC Software Systems Inc." + 2 adres satırı
   - ✅ Bottom-center: kırmızı script "Turn Every Tap Into a Qualified Lead" + maple leaf
   - ✅ Ortada: dashboard screenshot'u temiz şekilde
   - ❌ "Skip to main content" **yok**
   - ❌ localhost URL **yok**
   - ❌ Browser date header **yok**

---

## ⚠️ Notlar

- **`useDashboard()` context'inden `activeSection` geliyor olmalı.** Yoksa `DashboardContext.jsx`'te `activeSection` state'i export et (sidebar'dan hangi tab aktifse). Yoksa fallback `L.section` kullanılıyor.
- **Multi-page:** Uzun dashboard'lar otomatik sayfalanır, her sayfada letterhead background.
- **CORS:** `letterhead-bg.png` same-origin olduğu için sorun yok. Dashboard içinde external image varsa `useCORS: true` zaten set.
- **Font:** Letterhead PNG'nin içinde gömülü olduğu için custom font yüklemeye gerek yok — handwritten "Turn Every Tap" zaten PNG içinde.

---

## Deploy

Bu değişiklikten sonra:

```bash
cd frontend && npm run build
cd .. && firebase deploy --only hosting
```

Letterhead asset `dist/` içine otomatik kopyalanır (Vite public/ klasörünü böyle handle eder).

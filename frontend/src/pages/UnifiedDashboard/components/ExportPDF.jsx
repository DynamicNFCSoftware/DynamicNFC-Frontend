import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDashboard } from "../DashboardContext";

const LABELS = {
  en: { export: "Export PDF", exporting: "Generating...", section: "Section", exportFailed: "PDF export failed. Check console." },
  ar: { export: "تصدير PDF", exporting: "جارٍ الإنشاء...", section: "القسم", exportFailed: "فشل تصدير PDF. يرجى مراجعة وحدة التحكم." },
  fr: { export: "Exporter PDF", exporting: "Génération...", section: "Section", exportFailed: "Échec de l'export PDF. Vérifiez la console." },
  es: { export: "Exportar PDF", exporting: "Generando...", section: "Sección", exportFailed: "Falló la exportación de PDF. Revisa la consola." },
  tr: { export: "PDF İndir", exporting: "Oluşturuluyor...", section: "Bölüm", exportFailed: "PDF dışa aktarma başarısız. Konsolu kontrol edin." },
};

const MODE_LABELS = {
  en: { standard: "Standard", readable: "Readable", mode: "Mode", on: "ON", off: "OFF" },
  ar: { standard: "قياسي", readable: "مقروء", mode: "الوضع", on: "تشغيل", off: "إيقاف" },
  fr: { standard: "Standard", readable: "Lisible", mode: "Mode", on: "ON", off: "OFF" },
  es: { standard: "Estandar", readable: "Legible", mode: "Modo", on: "ON", off: "OFF" },
  tr: { standard: "Standart", readable: "Okunur", mode: "Mod", on: "ON", off: "OFF" },
};

const PDF_MODE_KEY = "ud-pdf-export-mode";

// Safe print area (mm) — letterhead header/footer protected zones
const PAGE_W_MM = 210;
const PAGE_H_MM = 297;
const TOP_SAFE_MM = 55; // header protected zone
const BOTTOM_SAFE_MM = 42; // footer protected zone (red script + maple leaf)
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
async function captureMain(options = {}) {
  const { scale = 2, readable = false } = options;
  const main = document.querySelector(".ud-main-content") || document.querySelector(".ud-main");
  if (!main) throw new Error("Main content not found");
  const target =
    readable && main.firstElementChild instanceof HTMLElement
      ? main.firstElementChild
      : main;

  const hidden = document.querySelectorAll("[data-pdf-hide], .ud-skip-link");
  hidden.forEach((el) => (el.style.visibility = "hidden"));

  try {
    const canvas = await html2canvas(target, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: Math.max(target.scrollWidth, target.clientWidth || 0),
      windowHeight: Math.max(target.scrollHeight, target.clientHeight || 0),
    });
    return canvas;
  } finally {
    hidden.forEach((el) => (el.style.visibility = ""));
  }
}

/**
 * Trim surrounding whitespace from a canvas so dashboard content
 * occupies more of the PDF safe area and remains readable.
 */
function trimCanvasWhitespace(canvas, options = {}) {
  const { backgroundThreshold = 246, cropPadding = 18 } = options;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;

  let top = height;
  let left = width;
  let right = 0;
  let bottom = 0;
  let found = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Treat near-white pixels as background.
      if (a > 8 && (r < backgroundThreshold || g < backgroundThreshold || b < backgroundThreshold)) {
        found = true;
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (!found) return canvas;

  const pad = cropPadding;
  const cropLeft = Math.max(0, left - pad);
  const cropTop = Math.max(0, top - pad);
  const cropRight = Math.min(width - 1, right + pad);
  const cropBottom = Math.min(height - 1, bottom + pad);

  const cropW = cropRight - cropLeft + 1;
  const cropH = cropBottom - cropTop + 1;
  if (cropW <= 0 || cropH <= 0) return canvas;

  const trimmed = document.createElement("canvas");
  trimmed.width = cropW;
  trimmed.height = cropH;
  const trimmedCtx = trimmed.getContext("2d");
  trimmedCtx.fillStyle = "#ffffff";
  trimmedCtx.fillRect(0, 0, cropW, cropH);
  trimmedCtx.drawImage(canvas, cropLeft, cropTop, cropW, cropH, 0, 0, cropW, cropH);
  return trimmed;
}

/**
 * Readable mode: crop a slightly narrower source region so it fills
 * the same PDF width and appears larger (true visual zoom).
 */
function applyReadableZoom(canvas, zoomFactor = 1) {
  if (!zoomFactor || zoomFactor <= 1) return canvas;

  const srcW = Math.max(1, Math.floor(canvas.width / zoomFactor));
  const srcH = Math.max(1, Math.floor(canvas.height / zoomFactor));
  const srcX = Math.max(0, Math.floor((canvas.width - srcW) / 2));
  // Keep top area prioritized for dashboard readability.
  const srcY = 0;

  const zoomed = document.createElement("canvas");
  zoomed.width = srcW;
  zoomed.height = srcH;
  const ctx = zoomed.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, srcW, srcH);
  ctx.drawImage(canvas, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
  return zoomed;
}

/**
 * Slice captured canvas across multiple A4 pages, each overlayed on letterhead.
 */
async function buildPdf(canvas, letterheadB64, sectionTitle, layoutOptions = {}) {
  const sideMarginMm = layoutOptions.sideMarginMm ?? 8;
  const contentWidthMm = PAGE_W_MM - sideMarginMm * 2;
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // How much canvas (px) fits in content area per page
  const canvasPxPerMm = canvas.width / contentWidthMm;
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
      sideMarginMm,
      TOP_SAFE_MM,
      contentWidthMm,
      sliceHeightMm,
      undefined,
      "FAST"
    );

    // 4. Optional: page number in footer zone (small, subtle)
    if (totalPages > 1) {
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`${page + 1} / ${totalPages}`, PAGE_W_MM - sideMarginMm, PAGE_H_MM - 8, {
        align: "right",
      });
    }
  }

  return pdf;
}

export default function ExportPDF() {
  const { lang, activeSection } = useDashboard();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(PDF_MODE_KEY);
    return saved === "standard" ? "standard" : "readable";
  });
  const L = LABELS[lang] || LABELS.en;
  const M = MODE_LABELS[lang] || MODE_LABELS.en;
  const readableOn = mode === "readable";

  const modeOptions =
    mode === "standard"
      ? {
          sideMarginMm: 14,
          captureScale: 2,
          backgroundThreshold: 246,
          cropPadding: 10,
          readableCapture: false,
          zoomFactor: 1,
        }
      : {
          sideMarginMm: 4,
          captureScale: 2.5,
          backgroundThreshold: 252,
          cropPadding: 6,
          readableCapture: true,
          zoomFactor: 1.18,
        };

  const handleExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const letterheadB64 = await loadLetterheadBase64();
      const capturedCanvas = await captureMain({
        scale: modeOptions.captureScale,
        readable: modeOptions.readableCapture,
      });
      const trimmedCanvas = trimCanvasWhitespace(capturedCanvas, modeOptions);
      const canvas = applyReadableZoom(trimmedCanvas, modeOptions.zoomFactor);
      const sectionTitle = activeSection || L.section;
      const pdf = await buildPdf(canvas, letterheadB64, sectionTitle, modeOptions);
      const dateStr = new Date().toISOString().slice(0, 10);
      const safeSection = sectionTitle.replace(/[^\w-]+/g, "_");
      pdf.save(`DynamicNFC_${safeSection}_${mode}_${dateStr}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert(L.exportFailed);
    } finally {
      setBusy(false);
    }
  };

  const toggleMode = () => {
    const next = mode === "readable" ? "standard" : "readable";
    setMode(next);
    localStorage.setItem(PDF_MODE_KEY, next);
  };

  return (
    <>
      <button
        type="button"
        className="ud-btn-export"
        onClick={toggleMode}
        disabled={busy}
        data-pdf-hide
        title={`${M.mode}: ${M.readable} ${readableOn ? M.on : M.off}`}
        aria-label={`${M.mode}: ${M.readable} ${readableOn ? M.on : M.off}`}
      >
        <span className="ud-btn-export-label">
          {M.readable} {readableOn ? M.on : M.off}
        </span>
      </button>
      <button
        type="button"
        className="ud-btn-export"
        onClick={handleExport}
        disabled={busy}
        data-pdf-hide
        title={L.export}
        aria-label={L.export}
      >
        {busy ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="0.8s"
                repeatCount="indefinite"
              />
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="ud-btn-export-label">{L.exporting}</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="ud-btn-export-label">{L.export}</span>
          </>
        )}
      </button>
    </>
  );
}

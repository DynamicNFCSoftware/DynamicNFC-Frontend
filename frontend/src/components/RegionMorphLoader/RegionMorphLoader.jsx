import React, { useEffect, useRef, useState } from "react";
import styles from "./RegionMorphLoader.module.css";

const REGION_DATA = {
  canada: {
    proj: "Vista Residences",
    reg: "Canada · Vancouver",
    city: "Vancouver",
    code: "CAN",
    accent: "#457b9d",
    gold: "#b8860b",
    coords: { lat: "49.28° N", lng: "123.12° W", short: "49.3N / 123.1W" },
    miniMap: { x: 38, y: 30, countryId: "mm-canada" },
  },
  gulf: {
    proj: "Al Noor Residences",
    reg: "Gulf · Riyadh",
    city: "Riyadh",
    code: "SAU",
    accent: "#b8860b",
    gold: "#b8860b",
    coords: { lat: "24.71° N", lng: "46.67° E", short: "24.7N / 46.7E" },
    miniMap: { x: 130, y: 54, countryId: "mm-gulf" },
  },
  usa: {
    proj: "Skyline Towers",
    reg: "USA · New York",
    city: "New York",
    code: "USA",
    accent: "#1e3a8a",
    gold: "#c7302f",
    coords: { lat: "40.71° N", lng: "74.00° W", short: "40.7N / 74.0W" },
    miniMap: { x: 56, y: 48, countryId: "mm-usa" },
  },
  mexico: {
    proj: "Residencias del Sol",
    reg: "Mexico · CDMX",
    city: "CDMX",
    code: "MEX",
    accent: "#006341",
    gold: "#c7302f",
    coords: { lat: "19.43° N", lng: "99.13° W", short: "19.4N / 99.1W" },
    miniMap: { x: 44, y: 75, countryId: "mm-mexico" },
  },
};

const BLUEPRINTS = {
  canada: {
    parts: [
      { type: "rect", x: 250, y: 80, w: 80, h: 150, dash: 460 },
      { type: "path", d: "M 250,80 L 290,52 L 330,80", dash: 110 },
      { type: "rect", x: 155, y: 125, w: 60, h: 105, dash: 330 },
      { type: "rect", x: 360, y: 150, w: 50, h: 80, dash: 260 },
      { type: "path", d: "M 30,240 Q 130,232 230,238 T 420,238 T 570,236", dash: 560 },
      { type: "path", d: "M 465,225 L 500,225 L 495,238 L 470,238 Z", dash: 90 },
    ],
    details: [
      ...Array.from({ length: 7 }, (_, i) => ({ type: "line", x1: 258, y1: 95 + i * 18, x2: 322, y2: 95 + i * 18 })),
      ...Array.from({ length: 5 }, (_, i) => ({ type: "line", x1: 163, y1: 140 + i * 18, x2: 207, y2: 140 + i * 18 })),
      ...Array.from({ length: 4 }, (_, i) => ({ type: "line", x1: 368, y1: 165 + i * 18, x2: 402, y2: 165 + i * 18 })),
      { type: "line", x1: 482, y1: 225, x2: 482, y2: 205 },
    ],
    labels: [
      { x: 290, y: 72, text: "42 FL" },
      { x: 500, y: 252, text: "HARBOUR" },
    ],
  },
  gulf: {
    parts: [
      { type: "path", d: "M 260,230 L 260,85 L 280,55 L 300,55 L 320,85 L 320,230 Z", dash: 520 },
      { type: "path", d: "M 275,55 L 290,25 L 305,55", dash: 110 },
      { type: "rect", x: 155, y: 110, w: 32, h: 120, dash: 300 },
      { type: "path", d: "M 155,110 Q 171,88 187,110", dash: 70 },
      { type: "line", x1: 171, y1: 88, x2: 171, y2: 70, dash: 20 },
      { type: "rect", x: 390, y: 160, w: 110, h: 70, dash: 360 },
      { type: "path", d: "M 390,160 Q 445,118 500,160", dash: 170 },
    ],
    details: [
      ...Array.from({ length: 6 }, (_, i) => ({
        type: "path",
        d: `M 268,${100 + i * 20} Q 290,${92 + i * 20} 312,${100 + i * 20}`,
      })),
      ...Array.from({ length: 4 }, (_, i) => ({ type: "line", x1: 165, y1: 130 + i * 20, x2: 177, y2: 130 + i * 20 })),
      ...Array.from({ length: 4 }, (_, i) => ({
        type: "path",
        d: `M ${400 + i * 26},180 Q ${413 + i * 26},170 ${426 + i * 26},180 L ${426 + i * 26},225 L ${400 + i * 26},225 Z`,
      })),
    ],
    labels: [
      { x: 290, y: 20, text: "66 FL" },
      { x: 171, y: 65, text: "↑" },
      { x: 445, y: 148, text: "DOME" },
    ],
  },
  usa: {
    parts: [
      { type: "rect", x: 55, y: 140, w: 55, h: 90, dash: 290 },
      {
        type: "path",
        d: "M 135,230 L 135,120 L 152,120 L 152,85 L 164,85 L 164,50 L 180,50 L 180,85 L 192,85 L 192,120 L 210,120 L 210,230 Z",
        dash: 580,
      },
      { type: "line", x1: 172, y1: 50, x2: 172, y2: 28, dash: 24 },
      { type: "rect", x: 240, y: 100, w: 52, h: 130, dash: 370 },
      { type: "rect", x: 320, y: 115, w: 60, h: 115, dash: 360 },
      { type: "path", d: "M 320,115 L 350,70 L 380,115", dash: 100 },
      { type: "line", x1: 350, y1: 70, x2: 350, y2: 45, dash: 28 },
      { type: "rect", x: 410, y: 145, w: 60, h: 85, dash: 290 },
      { type: "rect", x: 495, y: 108, w: 65, h: 122, dash: 380 },
    ],
    details: [
      ...Array.from({ length: 5 }, (_, i) => ({ type: "line", x1: 62, y1: 155 + i * 16, x2: 103, y2: 155 + i * 16 })),
      ...Array.from({ length: 8 }, (_, i) => ({ type: "line", x1: 138, y1: 135 + i * 12, x2: 207, y2: 135 + i * 12 })),
      ...Array.from({ length: 6 }, (_, i) => ({ type: "line", x1: 246, y1: 115 + i * 18, x2: 286, y2: 115 + i * 18 })),
      ...Array.from({ length: 5 }, (_, i) => ({ type: "line", x1: 326, y1: 130 + i * 20, x2: 374, y2: 130 + i * 20 })),
      ...Array.from({ length: 4 }, (_, i) => ({ type: "line", x1: 416, y1: 160 + i * 18, x2: 464, y2: 160 + i * 18 })),
      ...Array.from({ length: 6 }, (_, i) => ({ type: "line", x1: 501, y1: 125 + i * 18, x2: 554, y2: 125 + i * 18 })),
    ],
    labels: [
      { x: 172, y: 22, text: "102 FL" },
      { x: 350, y: 40, text: "77 FL" },
    ],
  },
  mexico: {
    parts: [
      { type: "rect", x: 90, y: 140, w: 420, h: 90, dash: 1020 },
      { type: "path", d: "M 80,140 L 115,105 L 485,105 L 520,140", dash: 480 },
      { type: "path", d: "M 275,230 L 275,170 Q 300,138 325,170 L 325,230", dash: 200 },
      { type: "rect", x: 150, y: 175, w: 30, h: 55, dash: 170 },
      { type: "rect", x: 420, y: 175, w: 30, h: 55, dash: 170 },
      { type: "circle", cx: 300, cy: 242, r: 12, dash: 78 },
      { type: "line", x1: 50, y1: 140, x2: 90, y2: 140, dash: 45 },
      { type: "line", x1: 510, y1: 140, x2: 550, y2: 140, dash: 45 },
    ],
    details: [
      { type: "rect", x: 210, y: 160, w: 22, h: 28 },
      { type: "rect", x: 240, y: 160, w: 22, h: 28 },
      { type: "rect", x: 340, y: 160, w: 22, h: 28 },
      { type: "rect", x: 370, y: 160, w: 22, h: 28 },
      { type: "circle", cx: 300, cy: 242, r: 6 },
      { type: "circle", cx: 300, cy: 242, r: 3 },
      ...Array.from({ length: 9 }, (_, i) => ({ type: "line", x1: 125 + i * 40, y1: 115, x2: 125 + i * 40, y2: 140 })),
    ],
    labels: [
      { x: 300, y: 98, text: "HACIENDA" },
      { x: 300, y: 266, text: "◯ PATIO" },
    ],
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";

function createSvgElement(spec) {
  const el = document.createElementNS(SVG_NS, spec.type);
  if (spec.type === "rect") {
    el.setAttribute("x", spec.x);
    el.setAttribute("y", spec.y);
    el.setAttribute("width", spec.w);
    el.setAttribute("height", spec.h);
  } else if (spec.type === "path") {
    el.setAttribute("d", spec.d);
  } else if (spec.type === "line") {
    el.setAttribute("x1", spec.x1);
    el.setAttribute("y1", spec.y1);
    el.setAttribute("x2", spec.x2);
    el.setAttribute("y2", spec.y2);
  } else if (spec.type === "circle") {
    el.setAttribute("cx", spec.cx);
    el.setAttribute("cy", spec.cy);
    el.setAttribute("r", spec.r);
  }
  return el;
}

function RegionMorphLoader({ region = "canada", statusText = "Setting up region data..." }) {
  const buildingsRef = useRef(null);
  const detailsRef = useRef(null);
  const labelsRef = useRef(null);
  const mmRingRef = useRef(null);
  const mmRing2Ref = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const d = REGION_DATA[region] || REGION_DATA.canada;
    const bp = BLUEPRINTS[region] || BLUEPRINTS.canada;
    const timeouts = [];

    if (!reducedMotion && mmRingRef.current && mmRing2Ref.current) {
      mmRingRef.current.animate(
        [{ r: 2.5, opacity: 0.9 }, { r: 14, opacity: 0 }],
        { duration: 1100, iterations: 1, easing: "ease-out" }
      );
      const pulseTimeout = setTimeout(() => {
        if (mmRing2Ref.current) {
          mmRing2Ref.current.animate(
            [{ r: 2.5, opacity: 0.6 }, { r: 18, opacity: 0 }],
            { duration: 1200, iterations: 1, easing: "ease-out" }
          );
        }
      }, 220);
      timeouts.push(pulseTimeout);
    }

    const buildings = buildingsRef.current;
    const details = detailsRef.current;
    const labels = labelsRef.current;
    if (!buildings || !details || !labels) {
      return () => {
        timeouts.forEach((t) => clearTimeout(t));
      };
    }

    buildings.innerHTML = "";
    details.innerHTML = "";
    labels.innerHTML = "";

    bp.parts.forEach((p, i) => {
      const el = createSvgElement(p);
      const dash = p.dash || 400;
      el.setAttribute("class", styles.bpEl);
      el.setAttribute("stroke", d.accent);
      el.style.strokeDasharray = dash;
      el.style.strokeDashoffset = reducedMotion ? 0 : dash;
      buildings.appendChild(el);

      if (!reducedMotion) {
        const drawTimeout = setTimeout(() => {
          el.style.transition = "stroke-dashoffset 0.9s ease-out";
          el.style.strokeDashoffset = 0;
        }, 60 + i * 120);
        timeouts.push(drawTimeout);
      }
    });

    const detailsDelay = reducedMotion ? 0 : 60 + bp.parts.length * 120 + 250;

    (bp.details || []).forEach((dt) => {
      const el = createSvgElement(dt);
      el.setAttribute("class", styles.bpDetail);
      el.setAttribute("stroke", d.accent);
      details.appendChild(el);
    });

    const detailFadeTimeout = setTimeout(() => {
      if (!detailsRef.current) return;
      detailsRef.current.querySelectorAll(`.${styles.bpDetail}`).forEach((el) => {
        el.style.opacity = 0.7;
      });
    }, detailsDelay);
    timeouts.push(detailFadeTimeout);

    (bp.labels || []).forEach((lb) => {
      const el = document.createElementNS(SVG_NS, "text");
      el.setAttribute("x", lb.x);
      el.setAttribute("y", lb.y);
      el.setAttribute("text-anchor", "middle");
      el.setAttribute("class", styles.bpLabel);
      el.setAttribute("fill", d.gold);
      el.textContent = lb.text;
      labels.appendChild(el);
    });

    const labelFadeTimeout = setTimeout(() => {
      if (!labelsRef.current) return;
      labelsRef.current.querySelectorAll(`.${styles.bpLabel}`).forEach((el) => {
        el.style.opacity = 1;
      });
    }, detailsDelay + 150);
    timeouts.push(labelFadeTimeout);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [region, reducedMotion]);

  const d = REGION_DATA[region] || REGION_DATA.canada;

  return (
    <div className={styles.stage} role="status" aria-live="polite" aria-label={`Loading ${d.reg}`}>
      <div className={styles.metaBar}>
        <div className={styles.metaLeft}>
          <div className={styles.headerLabel}>DynamicNFC · Intelligence</div>
          <div className={styles.headerTitle}>LAT {d.coords.lat} · LNG {d.coords.lng}</div>
        </div>

        <div className={styles.miniMap}>
          <div className={styles.miniMapLabel}>
            <span>REGION</span>
            <span className={styles.miniMapCoords} style={{ color: d.gold }}>
              {d.coords.short}
            </span>
          </div>

          <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" className={styles.miniMapSvg}>
            <g stroke="rgba(0,0,0,0.04)" strokeWidth="0.3" fill="none">
              <line x1="0" y1="25" x2="200" y2="25" />
              <line x1="0" y1="50" x2="200" y2="50" />
              <line x1="0" y1="75" x2="200" y2="75" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="100" y1="0" x2="100" y2="100" />
              <line x1="150" y1="0" x2="150" y2="100" />
            </g>

            <path className={`${styles.mmCountry} ${d.miniMap.countryId === "mm-canada" ? styles.mmActive : ""}`} d="M 20,20 L 60,15 L 68,24 L 64,36 L 52,40 L 44,46 L 35,47 L 24,43 L 19,35 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === "mm-usa" ? styles.mmActive : ""}`} d="M 24,43 L 35,47 L 44,46 L 52,40 L 58,44 L 62,54 L 55,61 L 45,65 L 35,65 L 27,60 L 24,52 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === "mm-mexico" ? styles.mmActive : ""}`} d="M 35,65 L 45,65 L 50,72 L 54,81 L 49,85 L 41,83 L 36,76 Z" />
            <path className={styles.mmCountry} d="M 54,81 L 60,86 L 64,97 L 56,98 L 50,91 Z" />
            <path className={styles.mmCountry} d="M 93,32 L 110,28 L 119,32 L 119,43 L 108,47 L 96,44 L 90,40 Z" />
            <path className={styles.mmCountry} d="M 95,47 L 114,47 L 123,56 L 124,68 L 119,81 L 111,86 L 104,84 L 99,75 L 95,65 L 95,47 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === "mm-gulf" ? styles.mmActive : ""}`} d="M 120,43 L 135,44 L 141,54 L 139,64 L 130,66 L 124,62 L 121,54 Z" />
            <path className={styles.mmCountry} d="M 135,28 L 170,26 L 180,36 L 178,49 L 165,54 L 150,51 L 141,47 L 135,44 Z" />
            <path className={styles.mmCountry} d="M 165,54 L 180,58 L 184,67 L 178,72 L 168,71 L 163,63 Z" />
            <path className={styles.mmCountry} d="M 170,81 L 186,81 L 190,89 L 184,94 L 172,94 L 168,87 Z" />

            <circle ref={mmRing2Ref} cx={d.miniMap.x} cy={d.miniMap.y} r="3" fill="none" stroke={d.gold} strokeWidth="0.8" opacity="0" className={styles.mmPinAnim} />
            <circle ref={mmRingRef} cx={d.miniMap.x} cy={d.miniMap.y} r="2.5" fill="none" stroke={d.gold} strokeWidth="1" opacity="0.9" className={styles.mmPinAnim} />

            <circle cx={d.miniMap.x} cy={d.miniMap.y} r="2.8" fill={d.gold} className={styles.mmPinAnim} />
            <circle cx={d.miniMap.x} cy={d.miniMap.y} r="1.2" fill="#ffffff" className={styles.mmPinAnim} />
          </svg>

          <div className={styles.miniMapInfo}>
            <span className={styles.miniCity}>{d.city}</span>
            <span className={styles.miniCode} style={{ color: d.gold }}>
              {d.code}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.blueprintArea}>
        <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet" className={styles.bpSvg}>
          <line x1="30" y1="230" x2="570" y2="230" stroke={d.accent} className={`${styles.bpEl} ${styles.bpGround}`} />
          <g>
            <line x1="30" y1="248" x2="130" y2="248" stroke="#1a1a1f" strokeWidth="0.5" opacity="0.45" />
            <line x1="30" y1="245" x2="30" y2="251" stroke="#1a1a1f" strokeWidth="0.5" opacity="0.45" />
            <line x1="130" y1="245" x2="130" y2="251" stroke="#1a1a1f" strokeWidth="0.5" opacity="0.45" />
            <text x="80" y="258" textAnchor="middle" fontFamily="Courier New" fontSize="9" fill="#1a1a1f" opacity="0.45">
              100m
            </text>
          </g>
          <g ref={buildingsRef} />
          <g ref={detailsRef} />
          <g ref={labelsRef} />
        </svg>
      </div>

      <div className={styles.projectInfo}>
        <div className={styles.proj}>{d.proj}</div>
        <div className={styles.reg} style={{ color: d.accent }}>
          {d.reg}
        </div>
        <div className={styles.status}>
          <span className={styles.statusDot} style={{ background: d.accent }} />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

export default RegionMorphLoader;

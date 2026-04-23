import React, { useEffect, useRef, useState } from 'react';
import styles from './AutomotiveMorphLoader.module.css';
import { getAutomotiveMapRegionData } from '../../config/mapRegionConfig';

// ============ REGION DATA ============
const REGION_DATA = getAutomotiveMapRegionData();

// ============ VEHICLE + BACKDROP ASSETS ============
// All vehicle assets below are copied VERBATIM from the approved prototype
// file: /outputs/automotive-morph-v3-british.html
// DO NOT MODIFY PATHS — these are hand-tuned side profiles of each luxury model.

const ASSETS = {
  canada: {
    backdrop: [
      { type: 'path', d: 'M 30,225 L 75,120 L 115,155 L 155,85 L 205,140 L 245,100 L 285,145 L 325,110 L 370,150 L 410,115 L 455,148 L 500,105 L 545,145 L 570,125 L 570,225 Z', fill: true, opacity: 0.12 },
      { type: 'path', d: 'M 30,225 L 75,120 L 115,155 L 155,85 L 205,140 L 245,100 L 285,145 L 325,110 L 370,150 L 410,115 L 455,148 L 500,105 L 545,145 L 570,125' },
      { type: 'path', d: 'M 30,225 L 80,185 L 130,170 L 190,195 L 250,175 L 310,200 L 370,180 L 430,198 L 500,178 L 570,200', opacity: 0.5 },
      { type: 'path', d: 'M 55,225 L 55,205 L 50,215 L 55,205 L 60,215 L 55,205 L 48,218 L 55,205 L 62,218' },
      { type: 'path', d: 'M 555,225 L 555,200 L 548,212 L 555,200 L 562,212 L 555,200 L 545,218 L 555,200 L 565,218' },
      { type: 'path', d: 'M 148,95 L 155,85 L 162,95 M 318,120 L 325,110 L 332,120 M 493,115 L 500,105 L 507,115', opacity: 0.5 },
    ],
    vehicle: [
      { type: 'path', d: 'M 160,210 L 160,175 L 170,170 L 190,165 L 225,158 L 295,155 L 360,155 L 400,160 L 425,170 L 438,182 L 438,210 Z' },
      { type: 'path', d: 'M 170,170 Q 215,162 295,158 Q 360,158 400,163' },
      { type: 'path', d: 'M 195,165 L 215,140 L 370,140 L 395,165' },
      { type: 'line', x1: 195, y1: 165, x2: 395, y2: 165 },
      { type: 'circle', cx: 205, cy: 205, r: 17 },
      { type: 'circle', cx: 395, cy: 205, r: 17 },
    ],
    details: [
      { type: 'rect', x: 160, y: 178, w: 10, h: 18 },
      { type: 'line', x1: 160, y1: 183, x2: 170, y2: 183 },
      { type: 'line', x1: 160, y1: 188, x2: 170, y2: 188 },
      { type: 'line', x1: 162, y1: 178, x2: 162, y2: 196 },
      { type: 'line', x1: 165, y1: 178, x2: 165, y2: 196 },
      { type: 'line', x1: 168, y1: 178, x2: 168, y2: 196 },
      { type: 'circle', cx: 175, cy: 175, r: 3 },
      { type: 'circle', cx: 183, cy: 175, r: 3 },
      { type: 'path', d: 'M 220,144 L 260,144 L 260,162 L 220,162 Z' },
      { type: 'path', d: 'M 265,144 L 310,144 L 310,162 L 265,162 Z' },
      { type: 'path', d: 'M 315,144 L 365,144 L 365,162 L 315,162 Z' },
      { type: 'line', x1: 165, y1: 180, x2: 432, y2: 180 },
      { type: 'line', x1: 170, y1: 195, x2: 430, y2: 195 },
      { type: 'line', x1: 260, y1: 185, x2: 285, y2: 185 },
      { type: 'circle', cx: 295, cy: 173, r: 2 },
      { type: 'circle', cx: 205, cy: 205, r: 9 },
      { type: 'circle', cx: 395, cy: 205, r: 9 },
      { type: 'line', x1: 205, y1: 196, x2: 205, y2: 214 },
      { type: 'line', x1: 196, y1: 205, x2: 214, y2: 205 },
      { type: 'line', x1: 198, y1: 198, x2: 212, y2: 212 },
      { type: 'line', x1: 198, y1: 212, x2: 212, y2: 198 },
      { type: 'line', x1: 395, y1: 196, x2: 395, y2: 214 },
      { type: 'line', x1: 386, y1: 205, x2: 404, y2: 205 },
      { type: 'line', x1: 388, y1: 198, x2: 402, y2: 212 },
      { type: 'line', x1: 388, y1: 212, x2: 402, y2: 198 },
    ],
    labels: [
      { x: 300, y: 130, text: 'BENTAYGA SPEED · W12' },
      { x: 155, y: 78, text: '△ ROCKIES · 3954m' },
    ],
  },
  gulf: {
    backdrop: [
      { type: 'path', d: 'M 30,225 Q 110,180 180,195 Q 240,210 310,188 Q 380,168 450,192 Q 510,210 570,195 L 570,225 Z', fill: true, opacity: 0.14 },
      { type: 'path', d: 'M 30,225 Q 110,180 180,195 Q 240,210 310,188 Q 380,168 450,192 Q 510,210 570,195' },
      { type: 'path', d: 'M 30,225 Q 100,205 170,215 Q 250,225 330,210 Q 400,200 470,215 Q 530,225 570,218', opacity: 0.5 },
      { type: 'path', d: 'M 75,225 L 75,135' },
      { type: 'path', d: 'M 75,135 Q 50,120 40,135 M 75,135 Q 100,120 110,135' },
      { type: 'path', d: 'M 75,135 Q 55,110 45,105 M 75,135 Q 95,110 105,105' },
      { type: 'path', d: 'M 75,135 Q 75,115 75,105' },
      { type: 'path', d: 'M 520,225 L 520,125' },
      { type: 'path', d: 'M 520,125 Q 495,110 483,125 M 520,125 Q 545,110 555,125' },
      { type: 'path', d: 'M 520,125 Q 498,100 488,92 M 520,125 Q 542,100 552,92' },
      { type: 'path', d: 'M 520,125 Q 520,105 520,93' },
      { type: 'circle', cx: 300, cy: 75, r: 25, opacity: 0.4 },
    ],
    vehicle: [
      { type: 'path', d: 'M 140,208 L 142,185 L 155,175 L 180,170 L 225,165 L 265,162 L 350,162 L 395,168 L 425,175 L 445,185 L 450,208 Z' },
      { type: 'path', d: 'M 225,165 L 250,148 L 370,148 L 395,168' },
      { type: 'line', x1: 145, y1: 185, x2: 445, y2: 185 },
      { type: 'circle', cx: 195, cy: 205, r: 15 },
      { type: 'circle', cx: 400, cy: 205, r: 15 },
      { type: 'path', d: 'M 142,185 L 138,178 L 138,170 L 142,175' },
    ],
    details: [
      { type: 'path', d: 'M 232,150 L 253,150 L 253,162 L 232,162 Z' },
      { type: 'path', d: 'M 258,150 L 310,150 L 310,162 L 258,162 Z' },
      { type: 'path', d: 'M 315,150 L 367,150 L 367,162 L 315,162 Z' },
      { type: 'path', d: 'M 370,148 L 395,148 L 395,168 L 370,168 Z' },
      { type: 'line', x1: 315, y1: 177, x2: 345, y2: 177 },
      { type: 'line', x1: 270, y1: 177, x2: 300, y2: 177 },
      { type: 'line', x1: 145, y1: 200, x2: 445, y2: 200 },
      { type: 'rect', x: 150, y: 178, w: 14, h: 5 },
      { type: 'line', x1: 150, y1: 186, x2: 164, y2: 186 },
      { type: 'circle', cx: 143, cy: 168, r: 1.5 },
      { type: 'circle', cx: 195, cy: 205, r: 8 },
      { type: 'circle', cx: 400, cy: 205, r: 8 },
      { type: 'line', x1: 195, y1: 197, x2: 195, y2: 213 },
      { type: 'line', x1: 187, y1: 205, x2: 203, y2: 205 },
      { type: 'line', x1: 189, y1: 199, x2: 201, y2: 211 },
      { type: 'line', x1: 189, y1: 211, x2: 201, y2: 199 },
      { type: 'line', x1: 400, y1: 197, x2: 400, y2: 213 },
      { type: 'line', x1: 392, y1: 205, x2: 408, y2: 205 },
      { type: 'line', x1: 394, y1: 199, x2: 406, y2: 211 },
      { type: 'line', x1: 394, y1: 211, x2: 406, y2: 199 },
    ],
    labels: [
      { x: 300, y: 134, text: 'PHANTOM VIII · V12 · 6.75L' },
      { x: 75, y: 95, text: '☀ ARABIAN DESERT' },
    ],
  },
  usa: {
    backdrop: [
      { type: 'path', d: 'M 30,225 L 30,145 L 75,145 L 75,120 L 110,120 L 110,150 L 140,150 L 140,130 L 175,130 L 175,155 L 210,155 L 210,125 L 250,125 L 250,150 L 290,150 L 290,135 L 330,135 L 330,155 L 365,155 L 365,115 L 405,115 L 405,150 L 445,150 L 445,130 L 490,130 L 490,155 L 530,155 L 530,140 L 570,140 L 570,225 Z', fill: true, opacity: 0.12 },
      { type: 'path', d: 'M 30,145 L 75,145 L 75,120 L 110,120 L 110,150 L 140,150 L 140,130 L 175,130 L 175,155 L 210,155 L 210,125 L 250,125 L 250,150 L 290,150 L 290,135 L 330,135 L 330,155 L 365,155 L 365,115 L 405,115 L 405,150 L 445,150 L 445,130 L 490,130 L 490,155 L 530,155 L 530,140 L 570,140' },
      { type: 'path', d: 'M 30,180 Q 75,175 120,180 Q 170,185 220,180 Q 270,175 320,180 Q 380,185 440,180 Q 500,175 570,180', opacity: 0.5 },
      { type: 'path', d: 'M 30,195 Q 80,190 130,195 Q 190,200 250,195 Q 310,190 370,195 Q 430,200 490,195 Q 540,190 570,193', opacity: 0.4 },
      { type: 'path', d: 'M 45,225 L 45,108' },
      { type: 'path', d: 'M 45,108 Q 28,98 22,112 M 45,108 Q 62,98 68,112 M 45,108 Q 35,88 28,80 M 45,108 Q 55,88 62,80' },
      { type: 'path', d: 'M 560,225 L 560,115' },
      { type: 'path', d: 'M 560,115 Q 543,105 537,119 M 560,115 Q 577,105 583,119 M 560,115 Q 552,95 545,87 M 560,115 Q 568,95 575,87' },
      { type: 'circle', cx: 490, cy: 85, r: 20, opacity: 0.5 },
    ],
    vehicle: [
      { type: 'path', d: 'M 150,208 L 152,180 L 165,172 L 195,167 L 240,160 L 290,155 L 340,155 L 380,160 L 415,167 L 440,178 L 450,192 L 452,208 Z' },
      { type: 'path', d: 'M 240,160 Q 265,138 320,136 Q 360,138 380,160' },
      { type: 'path', d: 'M 160,180 Q 240,170 380,172 Q 420,175 440,180' },
      { type: 'path', d: 'M 400,165 Q 430,170 440,195' },
      { type: 'circle', cx: 195, cy: 205, r: 16 },
      { type: 'circle', cx: 400, cy: 205, r: 17 },
      { type: 'path', d: 'M 152,180 L 148,175 L 148,165 Q 155,160 160,165 L 160,170' },
    ],
    details: [
      { type: 'path', d: 'M 150,175 L 165,170 L 165,190 L 150,195 Z' },
      { type: 'line', x1: 152, y1: 180, x2: 164, y2: 177 },
      { type: 'line', x1: 152, y1: 185, x2: 164, y2: 183 },
      { type: 'path', d: 'M 165,170 L 180,170 L 185,175 L 170,177 Z' },
      { type: 'path', d: 'M 245,142 L 285,142 L 285,158 L 245,158 Z' },
      { type: 'path', d: 'M 290,142 L 340,142 L 345,158 L 290,158 Z' },
      { type: 'path', d: 'M 350,142 L 380,142 L 385,162 L 350,162 Z' },
      { type: 'line', x1: 195, y1: 175, x2: 225, y2: 175 },
      { type: 'line', x1: 200, y1: 178, x2: 220, y2: 178 },
      { type: 'path', d: 'M 255,180 L 275,180 L 275,188 L 255,188 Z' },
      { type: 'line', x1: 258, y1: 184, x2: 272, y2: 184 },
      { type: 'line', x1: 315, y1: 178, x2: 345, y2: 178 },
      { type: 'circle', cx: 448, cy: 200, r: 2 },
      { type: 'circle', cx: 443, cy: 200, r: 2 },
      { type: 'circle', cx: 195, cy: 205, r: 9 },
      { type: 'circle', cx: 400, cy: 205, r: 10 },
      { type: 'line', x1: 195, y1: 196, x2: 195, y2: 214 },
      { type: 'line', x1: 186, y1: 205, x2: 204, y2: 205 },
      { type: 'line', x1: 189, y1: 199, x2: 201, y2: 211 },
      { type: 'line', x1: 189, y1: 211, x2: 201, y2: 199 },
      { type: 'line', x1: 400, y1: 195, x2: 400, y2: 215 },
      { type: 'line', x1: 390, y1: 205, x2: 410, y2: 205 },
      { type: 'line', x1: 393, y1: 198, x2: 407, y2: 212 },
      { type: 'line', x1: 393, y1: 212, x2: 407, y2: 198 },
    ],
    labels: [
      { x: 300, y: 128, text: 'DB12 · TWIN-TURBO V8 · 680HP' },
      { x: 360, y: 108, text: '✦ MIAMI ART DECO' },
    ],
  },
  mexico: {
    backdrop: [
      { type: 'path', d: 'M 40,225 L 40,95 L 100,95 L 100,225', fill: true, opacity: 0.08 },
      { type: 'path', d: 'M 40,225 L 40,95 L 100,95 L 100,225' },
      { type: 'path', d: 'M 40,95 L 40,55 L 100,55 L 100,95' },
      { type: 'path', d: 'M 40,55 Q 70,25 100,55' },
      { type: 'line', x1: 70, y1: 38, x2: 70, y2: 20 },
      { type: 'line', x1: 65, y1: 27, x2: 75, y2: 27 },
      { type: 'path', d: 'M 100,225 L 100,110 L 470,110 L 470,225', fill: true, opacity: 0.08 },
      { type: 'path', d: 'M 100,110 L 470,110' },
      { type: 'path', d: 'M 95,110 L 125,85 L 450,85 L 475,110' },
      { type: 'path', d: 'M 130,225 L 130,160 Q 150,135 170,160 L 170,225' },
      { type: 'path', d: 'M 190,225 L 190,160 Q 210,135 230,160 L 230,225' },
      { type: 'path', d: 'M 390,225 L 390,160 Q 410,135 430,160 L 430,225' },
      { type: 'path', d: 'M 470,110 L 470,60 L 520,60 L 520,110' },
      { type: 'path', d: 'M 470,60 Q 495,30 520,60' },
      { type: 'line', x1: 495, y1: 35, x2: 495, y2: 15 },
      { type: 'line', x1: 488, y1: 25, x2: 502, y2: 25 },
      { type: 'line', x1: 30, y1: 235, x2: 570, y2: 235, opacity: 0.4 },
    ],
    vehicle: [
      { type: 'path', d: 'M 140,210 L 142,192 L 148,182 L 165,176 L 210,170 L 260,168 L 295,165 L 325,165 L 360,170 L 395,178 L 425,188 L 445,200 L 448,210 Z' },
      { type: 'path', d: 'M 260,168 Q 290,142 340,145 L 360,170' },
      { type: 'path', d: 'M 145,188 Q 210,180 260,178' },
      { type: 'circle', cx: 195, cy: 205, r: 13 },
      { type: 'circle', cx: 400, cy: 205, r: 13 },
      { type: 'path', d: 'M 142,192 Q 135,187 135,183 Q 135,179 142,182' },
    ],
    details: [
      { type: 'line', x1: 137, y1: 185, x2: 142, y2: 185 },
      { type: 'line', x1: 137, y1: 188, x2: 142, y2: 188 },
      { type: 'circle', cx: 172, cy: 175, r: 4 },
      { type: 'circle', cx: 172, cy: 175, r: 2 },
      { type: 'path', d: 'M 268,152 Q 290,140 335,145 L 335,166 L 268,166 Z' },
      { type: 'path', d: 'M 210,188 L 230,188 L 230,194 L 210,194 Z' },
      { type: 'line', x1: 215, y1: 191, x2: 225, y2: 191 },
      { type: 'line', x1: 140, y1: 205, x2: 170, y2: 205 },
      { type: 'line', x1: 430, y1: 205, x2: 448, y2: 205 },
      { type: 'line', x1: 160, y1: 195, x2: 440, y2: 195 },
      { type: 'line', x1: 295, y1: 170, x2: 295, y2: 200 },
      { type: 'line', x1: 270, y1: 185, x2: 285, y2: 185 },
      { type: 'circle', cx: 450, cy: 200, r: 2 },
      { type: 'circle', cx: 446, cy: 202, r: 1.5 },
      { type: 'circle', cx: 195, cy: 205, r: 8 },
      { type: 'circle', cx: 400, cy: 205, r: 8 },
      { type: 'circle', cx: 195, cy: 205, r: 3 },
      { type: 'circle', cx: 400, cy: 205, r: 3 },
      { type: 'line', x1: 195, y1: 197, x2: 195, y2: 213 },
      { type: 'line', x1: 187, y1: 205, x2: 203, y2: 205 },
      { type: 'line', x1: 190, y1: 200, x2: 200, y2: 210 },
      { type: 'line', x1: 200, y1: 200, x2: 190, y2: 210 },
      { type: 'line', x1: 192, y1: 197, x2: 198, y2: 213 },
      { type: 'line', x1: 198, y1: 197, x2: 192, y2: 213 },
      { type: 'line', x1: 400, y1: 197, x2: 400, y2: 213 },
      { type: 'line', x1: 392, y1: 205, x2: 408, y2: 205 },
      { type: 'line', x1: 395, y1: 200, x2: 405, y2: 210 },
      { type: 'line', x1: 405, y1: 200, x2: 395, y2: 210 },
      { type: 'line', x1: 397, y1: 197, x2: 403, y2: 213 },
      { type: 'line', x1: 403, y1: 197, x2: 397, y2: 213 },
    ],
    labels: [
      { x: 300, y: 130, text: 'E-TYPE · 4.2L INLINE-6 · 1968' },
      { x: 280, y: 75, text: '⌂ PARROQUIA · 1880' },
    ],
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(spec) {
  const el = document.createElementNS(SVG_NS, spec.type);
  if (spec.type === 'rect') {
    el.setAttribute('x', spec.x);
    el.setAttribute('y', spec.y);
    el.setAttribute('width', spec.w);
    el.setAttribute('height', spec.h);
  } else if (spec.type === 'path') {
    el.setAttribute('d', spec.d);
  } else if (spec.type === 'line') {
    el.setAttribute('x1', spec.x1);
    el.setAttribute('y1', spec.y1);
    el.setAttribute('x2', spec.x2);
    el.setAttribute('y2', spec.y2);
  } else if (spec.type === 'circle') {
    el.setAttribute('cx', spec.cx);
    el.setAttribute('cy', spec.cy);
    el.setAttribute('r', spec.r);
  }
  return el;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildBackdropSequentially(backdropEl, styles, { startDelay = 0, stagger = 90 } = {}) {
  if (!backdropEl) return 0;
  const nodes = Array.from(backdropEl.querySelectorAll('*'));
  let lastStart = startDelay;

  nodes.forEach((el, i) => {
    const target = parseFloat(el.dataset.targetOpacity || (el.classList.contains(styles.backdropFill) ? '0.12' : '0.75'));
    const delay = startDelay + i * stagger;
    lastStart = delay;

    if (el.classList.contains(styles.backdropLine) && typeof el.getTotalLength === 'function') {
      let length = 240;
      try {
        const measured = el.getTotalLength();
        if (Number.isFinite(measured) && measured > 0) {
          length = measured;
        }
      } catch {
        length = 240;
      }

      el.style.opacity = target;
      el.style.strokeDasharray = String(length);
      el.style.strokeDashoffset = String(length);
      el.style.transition = 'none';
      // Force reflow before enabling transition.
      // eslint-disable-next-line no-unused-expressions
      el.getBoundingClientRect();

      setTimeout(() => {
        el.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
        el.style.strokeDashoffset = '0';
      }, delay);
      return;
    }

    // Fills and non-length primitives: soft layered fade.
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease';
      el.style.opacity = target;
    }, delay);
  });

  // Approximate completion time for sequencing the next phase.
  return lastStart + 850;
}

// ============ COMPONENT ============
function AutomotiveMorphLoader({ region = 'canada', statusText = 'Showroom data · Region active' }) {
  const vehicleGroupRef = useRef(null);
  const vehicleRef = useRef(null);
  const detailsRef = useRef(null);
  const backdropRef = useRef(null);
  const labelsRef = useRef(null);
  const mmRingRef = useRef(null);
  const mmRing2Ref = useRef(null);
  const prevRegionRef = useRef(region);
  const animatingRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Initial render on mount
  useEffect(() => {
    const shouldReduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldReduce) {
      renderStatic(region);
      if (vehicleGroupRef.current) {
        vehicleGroupRef.current.style.opacity = '1';
        vehicleGroupRef.current.style.transform = 'translateX(0)';
      }
    } else {
      // Build the stage hidden first; intro animation reveals it.
      renderStatic(region, { hideBackdrop: true, hideLabels: true });
      introDriveIn();
    }
    prevRegionRef.current = region;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animated morph when region prop changes
  useEffect(() => {
    if (region === prevRegionRef.current) return;

    let cancelled = false;

    const run = async () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      if (reducedMotion) {
        renderStatic(region);
        prevRegionRef.current = region;
        animatingRef.current = false;
        return;
      }

      await driveThroughMorph(region);
      if (!cancelled) {
        prevRegionRef.current = region;
      }
      animatingRef.current = false;
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  function renderStatic(reg, options = {}) {
    const { hideBackdrop = false, hideLabels = false } = options;
    const d = REGION_DATA[reg] || REGION_DATA.canada;
    const a = ASSETS[reg] || ASSETS.canada;
    const vehicle = vehicleRef.current;
    const details = detailsRef.current;
    const backdrop = backdropRef.current;
    const labels = labelsRef.current;
    if (!vehicle || !details || !backdrop || !labels) return;

    vehicle.innerHTML = '';
    details.innerHTML = '';
    backdrop.innerHTML = '';
    labels.innerHTML = '';

    // Backdrop
    a.backdrop.forEach((p) => {
      const el = createSvgElement(p);
      const targetOpacity = p.opacity ?? (p.fill ? 0.12 : 0.75);
      if (p.fill) {
        el.setAttribute('fill', d.accent);
        el.setAttribute('stroke', 'none');
        el.setAttribute('class', styles.backdropFill);
      } else {
        el.setAttribute('class', styles.backdropLine);
        el.setAttribute('stroke', d.accent);
      }
      el.dataset.targetOpacity = String(targetOpacity);
      el.style.opacity = hideBackdrop ? 0 : targetOpacity;
      backdrop.appendChild(el);
    });

    // Vehicle
    a.vehicle.forEach((p) => {
      const el = createSvgElement(p);
      el.setAttribute('class', styles.autoEl);
      el.setAttribute('stroke', d.accent);
      vehicle.appendChild(el);
    });

    // Details
    a.details.forEach((dt) => {
      const el = createSvgElement(dt);
      el.setAttribute('class', styles.autoDetail);
      el.setAttribute('stroke', d.accent);
      el.style.opacity = 0.75;
      details.appendChild(el);
    });

    // Labels
    a.labels.forEach((lb) => {
      const el = document.createElementNS(SVG_NS, 'text');
      el.setAttribute('x', lb.x);
      el.setAttribute('y', lb.y);
      el.setAttribute('text-anchor', 'middle');
      el.setAttribute('class', styles.autoLabel);
      el.setAttribute('fill', d.gold);
      el.textContent = lb.text;
      el.style.opacity = hideLabels ? 0 : 1;
      labels.appendChild(el);
    });
  }

  async function driveThroughMorph(newRegion) {
    const d = REGION_DATA[newRegion] || REGION_DATA.canada;
    const a = ASSETS[newRegion] || ASSETS.canada;

    const vehicleGroup = vehicleGroupRef.current;
    const vehicle = vehicleRef.current;
    const details = detailsRef.current;
    const backdrop = backdropRef.current;
    const labels = labelsRef.current;
    const mmRing = mmRingRef.current;
    const mmRing2 = mmRing2Ref.current;

    if (!vehicleGroup || !vehicle || !details || !backdrop || !labels) return;

    // PHASE 1: current vehicle exits right
    vehicleGroup.style.transition = 'transform 1.1s cubic-bezier(0.55, 0, 0.45, 1)';
    vehicleGroup.style.transform = 'translateX(100%)';

    // Fade out old backdrop and labels
    backdrop.querySelectorAll('*').forEach((el) => {
      el.style.opacity = 0;
    });
    labels.querySelectorAll('*').forEach((el) => {
      el.style.opacity = 0;
    });

    // Mini map update mid-exit
    setTimeout(() => {
      if (mmRing) {
        mmRing.animate(
          [{ r: 2.5, opacity: 0.9 }, { r: 14, opacity: 0 }],
          { duration: 1100, iterations: 1, easing: 'ease-out' }
        );
      }
      setTimeout(() => {
        if (mmRing2) {
          mmRing2.animate(
            [{ r: 2.5, opacity: 0.6 }, { r: 18, opacity: 0 }],
            { duration: 1200, iterations: 1, easing: 'ease-out' }
          );
        }
      }, 220);
    }, 500);

    await wait(1100);

    // PHASE 2: rebuild stage (invisible offscreen left)
    vehicle.innerHTML = '';
    details.innerHTML = '';
    backdrop.innerHTML = '';
    labels.innerHTML = '';

    a.backdrop.forEach((p) => {
      const el = createSvgElement(p);
      if (p.fill) {
        el.setAttribute('fill', d.accent);
        el.setAttribute('stroke', 'none');
        el.setAttribute('class', styles.backdropFill);
        el.style.opacity = 0;
        el.dataset.targetOpacity = p.opacity ?? 0.12;
      } else {
        el.setAttribute('class', styles.backdropLine);
        el.setAttribute('stroke', d.accent);
        el.style.opacity = 0;
        el.dataset.targetOpacity = p.opacity ?? 0.75;
      }
      backdrop.appendChild(el);
    });

    a.vehicle.forEach((p) => {
      const el = createSvgElement(p);
      el.setAttribute('class', styles.autoEl);
      el.setAttribute('stroke', d.accent);
      vehicle.appendChild(el);
    });
    a.details.forEach((dt) => {
      const el = createSvgElement(dt);
      el.setAttribute('class', styles.autoDetail);
      el.setAttribute('stroke', d.accent);
      el.style.opacity = 0.75;
      details.appendChild(el);
    });

    // Position offscreen left — FIXED: use viewport-relative -100% not pixels
    vehicleGroup.style.transition = 'none';
    vehicleGroup.style.transform = 'translateX(-100%)';
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    vehicleGroup.getBoundingClientRect();

    // PHASE 3: backdrop builds sequentially (line-draw + layered fade)
    const buildDuration = buildBackdropSequentially(backdrop, styles, { startDelay: 0, stagger: 90 });
    await wait(Math.min(buildDuration, 950));

    // PHASE 4: new vehicle drives in — FIXED: smoother easing + longer wait
    vehicleGroup.style.transition = 'transform 1.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    vehicleGroup.style.transform = 'translateX(0)';

    // FIXED: wait 1400ms (not 1300ms) so full transition completes before labels
    await wait(1400);

    // PHASE 5: labels appear
    a.labels.forEach((lb) => {
      const el = document.createElementNS(SVG_NS, 'text');
      el.setAttribute('x', lb.x);
      el.setAttribute('y', lb.y);
      el.setAttribute('text-anchor', 'middle');
      el.setAttribute('class', styles.autoLabel);
      el.setAttribute('fill', d.gold);
      el.textContent = lb.text;
      labels.appendChild(el);
    });
    setTimeout(() => {
      labels.querySelectorAll('.' + styles.autoLabel).forEach((el) => {
        el.style.opacity = 1;
      });
    }, 100);
  }

  async function introDriveIn() {
    const d = REGION_DATA[region] || REGION_DATA.canada;
    const vehicleGroup = vehicleGroupRef.current;
    const backdrop = backdropRef.current;
    const labels = labelsRef.current;
    const mmRing = mmRingRef.current;
    const mmRing2 = mmRing2Ref.current;

    if (!vehicleGroup || !backdrop || !labels) return;

    // Keep vehicle fully hidden while the scene is being built.
    vehicleGroup.style.opacity = '0';
    // Backdrop + labels are already hidden from initial render.
    labels.querySelectorAll('*').forEach((el) => {
      el.style.opacity = 0;
    });

    // Move car fully offscreen left before first entrance.
    vehicleGroup.style.transition = 'none';
    vehicleGroup.style.transform = 'translateX(-100%)';
    // eslint-disable-next-line no-unused-expressions
    vehicleGroup.getBoundingClientRect();

    // Subtle map pulse on first draw.
    if (mmRing) {
      mmRing.animate(
        [{ r: 2.5, opacity: 0.9 }, { r: 14, opacity: 0 }],
        { duration: 1000, iterations: 1, easing: 'ease-out' }
      );
    }
    if (mmRing2) {
      setTimeout(() => {
        mmRing2.animate(
          [{ r: 2.5, opacity: 0.6 }, { r: 18, opacity: 0 }],
          { duration: 1100, iterations: 1, easing: 'ease-out' }
        );
      }, 180);
    }

    // Fade/draw backdrop first in sequence.
    const buildDuration = buildBackdropSequentially(backdrop, styles, { startDelay: 0, stagger: 90 });
    await wait(Math.min(buildDuration, 950));

    // Drive in using the same corrected easing.
    vehicleGroup.style.opacity = '1';
    vehicleGroup.style.transition = 'none';
    vehicleGroup.style.transform = 'translateX(-100%)';
    // eslint-disable-next-line no-unused-expressions
    vehicleGroup.getBoundingClientRect();
    vehicleGroup.style.transition = 'transform 1.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    vehicleGroup.style.transform = 'translateX(0)';

    // Keep labels delayed until motion fully settles.
    await wait(1400);
    labels.querySelectorAll('.' + styles.autoLabel).forEach((el) => {
      el.setAttribute('fill', d.gold);
      el.style.opacity = 1;
    });
  }

  const d = REGION_DATA[region] || REGION_DATA.canada;

  return (
    <div className={styles.stage} role="status" aria-live="polite" aria-label={`Loading ${d.reg}`}>
      {/* ===== TOP META BAR ===== */}
      <div className={styles.metaBar}>
        <div className={styles.metaLeft}>
          <div className={styles.headerLabel}>DynamicNFC · Automotive</div>
          <div className={styles.headerTitle}>LAT {d.coords.lat} · LNG {d.coords.lng}</div>
        </div>

        <div className={styles.miniMap}>
          <div className={styles.miniMapLabel}>
            <span>REGION</span>
            <span className={styles.miniMapCoords} style={{ color: d.gold }}>{d.coords.short}</span>
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

            <path className={`${styles.mmCountry} ${d.miniMap.countryId === 'mm-canada' ? styles.mmActive : ''}`} d="M 20,20 L 60,15 L 68,24 L 64,36 L 52,40 L 44,46 L 35,47 L 24,43 L 19,35 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === 'mm-usa' ? styles.mmActive : ''}`} d="M 24,43 L 35,47 L 44,46 L 52,40 L 58,44 L 62,54 L 55,61 L 45,65 L 35,65 L 27,60 L 24,52 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === 'mm-mexico' ? styles.mmActive : ''}`} d="M 35,65 L 45,65 L 50,72 L 54,81 L 49,85 L 41,83 L 36,76 Z" />
            <path className={styles.mmCountry} d="M 54,81 L 60,86 L 64,97 L 56,98 L 50,91 Z" />
            <path className={styles.mmCountry} d="M 93,32 L 110,28 L 119,32 L 119,43 L 108,47 L 96,44 L 90,40 Z" />
            <path className={styles.mmCountry} d="M 95,47 L 114,47 L 123,56 L 124,68 L 119,81 L 111,86 L 104,84 L 99,75 L 95,65 L 95,47 Z" />
            <path className={`${styles.mmCountry} ${d.miniMap.countryId === 'mm-gulf' ? styles.mmActive : ''}`} d="M 120,43 L 135,44 L 141,54 L 139,64 L 130,66 L 124,62 L 121,54 Z" />
            <path className={styles.mmCountry} d="M 135,28 L 170,26 L 180,36 L 178,49 L 165,54 L 150,51 L 141,47 L 135,44 Z" />
            <path className={styles.mmCountry} d="M 165,54 L 180,58 L 184,67 L 178,72 L 168,71 L 163,63 Z" />
            <path className={styles.mmCountry} d="M 170,81 L 186,81 L 190,89 L 184,94 L 172,94 L 168,87 Z" />

            <circle ref={mmRing2Ref} cx={d.miniMap.x} cy={d.miniMap.y} r="3" fill="none" stroke={d.gold} strokeWidth="0.8" opacity="0" className={styles.mmPinAnim} />
            <circle ref={mmRingRef} cx={d.miniMap.x} cy={d.miniMap.y} r="2.5" fill="none" stroke={d.gold} strokeWidth="1" opacity="0.9" className={styles.mmPinAnim} />

            <circle cx={d.miniMap.x} cy={d.miniMap.y} r="2.8" fill={d.gold} className={styles.mmPinAnim} />
            <circle cx={d.miniMap.x} cy={d.miniMap.y} r="1.2" fill="#fff" className={styles.mmPinAnim} />
          </svg>

          <div className={styles.miniMapInfo}>
            <span className={styles.miniCity}>{d.city}</span>
            <span className={styles.miniCode} style={{ color: d.gold }}>{d.code}</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN AUTO STAGE ===== */}
      <div className={styles.autoArea}>
        <svg viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet" className={styles.autoSvg}>
          <line x1="30" y1="225" x2="570" y2="225" stroke={d.accent} strokeWidth="0.8" strokeLinecap="round" />
          <g>
            <line x1="30" y1="258" x2="130" y2="258" stroke="#8e8776" strokeWidth="0.5" />
            <line x1="30" y1="255" x2="30" y2="261" stroke="#8e8776" strokeWidth="0.5" />
            <line x1="130" y1="255" x2="130" y2="261" stroke="#8e8776" strokeWidth="0.5" />
            <text x="80" y="268" textAnchor="middle" fontFamily="Courier New" fontSize="9" fill="#8e8776">5m</text>
          </g>
          <g ref={backdropRef} />
          <g ref={vehicleGroupRef}>
            <g ref={vehicleRef} />
            <g ref={detailsRef} />
          </g>
          <g ref={labelsRef} />
        </svg>
      </div>

      {/* ===== PROJECT INFO ===== */}
      <div className={styles.projectInfo}>
        <div className={styles.proj}>{d.proj}</div>
        <div className={styles.model}>{d.model}</div>
        <div className={styles.reg} style={{ color: d.accent }}>{d.reg}</div>
        <div className={styles.status}>
          <span className={styles.statusDot} style={{ background: d.accent }} />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

export default AutomotiveMorphLoader;

import { useEffect, useRef } from 'react';
import styles from './YachtMorphLoader.module.css';

const REGION_DATA = {
  canada: {
    proj: 'Pacific Coast Yachts',
    model: 'SAILING YACHT · 60FT CLASSIC',
    reg: 'Canada · Vancouver',
    city: 'Vancouver',
    code: 'CAN',
    tagline: 'COAL HARBOUR · 49.28° N',
    depthLabel: 'COAL HARBOUR · 45FT DEPTH',
    accent: '#22577a',
    gold: '#b8860b',
    anchorColor: '#e63946',
    anchorColorName: 'MAPLE RED',
    seaDepth: '#c8d4db',
    anchorStartX: 240,
    anchorStartY: 215,
    coords: { lat: '49.28° N', lng: '123.12° W', short: '49.3N / 123.1W' },
    miniMap: { x: 38, y: 30, countryId: 'mm-canada' },
  },
  gulf: {
    proj: 'Al Noor Marina',
    model: 'MEGA YACHT · 120M FLAGSHIP',
    reg: 'Gulf · Riyadh',
    city: 'Riyadh',
    code: 'SAU',
    tagline: 'RIYADH · 24.71° N',
    depthLabel: 'PALM MARINA · 80FT DEPTH',
    accent: '#b8860b',
    gold: '#7a5a05',
    anchorColor: '#0a2540',
    anchorColorName: 'DEEP NAVY',
    seaDepth: '#e8dcc0',
    anchorStartX: 130,
    anchorStartY: 210,
    coords: { lat: '24.71° N', lng: '46.67° E', short: '24.7N / 46.7E' },
    miniMap: { x: 130, y: 54, countryId: 'mm-gulf' },
  },
  usa: {
    proj: 'Liberty Yachts',
    model: 'SPORT YACHT · 85FT PERFORMANCE',
    reg: 'USA · Miami Beach',
    city: 'Miami',
    code: 'USA',
    tagline: 'SOUTH BEACH · 25.79° N',
    depthLabel: 'SOUTH BEACH · 30FT DEPTH',
    accent: '#1e3a8a',
    gold: '#c7302f',
    anchorColor: '#ffd60a',
    anchorColorName: 'SOLAR YELLOW',
    seaDepth: '#d0dae8',
    anchorStartX: 165,
    anchorStartY: 220,
    coords: { lat: '25.79° N', lng: '80.13° W', short: '25.8N / 80.1W' },
    miniMap: { x: 53, y: 56, countryId: 'mm-usa' },
  },
  mexico: {
    proj: 'Cabo Luxury Marina',
    model: 'CATAMARAN · 50FT COASTAL',
    reg: 'Mexico · San Miguel',
    city: 'San Miguel',
    code: 'MEX',
    tagline: 'SAN MIGUEL · 20.91° N',
    depthLabel: 'SEA OF CORTEZ · 55FT DEPTH',
    accent: '#006341',
    gold: '#c7302f',
    anchorColor: '#f4a261',
    anchorColorName: 'AMBER SUNSET',
    seaDepth: '#d0e0d5',
    anchorStartX: 175,
    anchorStartY: 220,
    coords: { lat: '20.91° N', lng: '100.74° W', short: '20.9N / 100.7W' },
    miniMap: { x: 42, y: 72, countryId: 'mm-mexico' },
  },
};

// SVG path data — DO NOT MODIFY anything in ASSETS
const ASSETS = {
  canada: {
    far: {
      fill: [{ d: 'M -100,210 L -40,140 L 20,170 L 90,105 L 150,150 L 220,110 L 290,160 L 360,120 L 430,165 L 500,115 L 570,150 L 640,125 L 700,175 L 700,250 L -100,250 Z', opacity: 0.13 }],
      stroke: [
        { d: 'M -100,210 L -40,140 L 20,170 L 90,105 L 150,150 L 220,110 L 290,160 L 360,120 L 430,165 L 500,115 L 570,150 L 640,125 L 700,175', opacity: 0.5 },
        { d: 'M 82,112 L 90,105 L 98,112 M 352,127 L 360,120 L 368,127 M 492,122 L 500,115 L 508,122', opacity: 0.55 },
      ],
    },
    mid: {
      fill: [{ d: 'M -100,235 L -30,200 L 60,190 L 130,215 L 210,185 L 290,210 L 370,195 L 450,220 L 540,200 L 620,215 L 700,205 L 700,250 L -100,250 Z', opacity: 0.17 }],
      stroke: [
        { d: 'M -100,235 L -30,200 L 60,190 L 130,215 L 210,185 L 290,210 L 370,195 L 450,220 L 540,200 L 620,215 L 700,205', opacity: 0.5 },
        { d: 'M 40,235 L 40,222 L 36,228 L 40,222 L 44,228 L 40,222 L 34,232 L 40,222 L 46,232' },
        { d: 'M 240,235 L 240,220 L 236,226 L 240,220 L 244,226 L 240,220 L 234,230 L 240,220 L 246,230' },
        { d: 'M 510,235 L 510,220 L 506,226 L 510,220 L 514,226 L 510,220 L 504,232 L 510,220 L 516,232' },
      ],
    },
    near: { stroke: [{ d: 'M -100,320 Q -30,317 50,320 Q 130,323 210,320 Q 290,317 370,320 Q 450,323 530,320 Q 610,317 700,320', opacity: 0.3 }] },
    yacht: [
      { type: 'path', d: 'M 220,230 L 225,220 L 260,214 L 340,212 L 380,216 L 400,224 L 395,230 Z' },
      { type: 'line', x1: 230, y1: 222, x2: 390, y2: 222 },
      { type: 'line', x1: 300, y1: 214, x2: 300, y2: 130 },
      { type: 'line', x1: 300, y1: 218, x2: 360, y2: 216 },
      { type: 'path', d: 'M 300,130 L 300,216 L 360,216 Z' },
      { type: 'path', d: 'M 300,145 L 300,212 L 245,212 Z' },
    ],
    details: [
      { type: 'line', x1: 308, y1: 170, x2: 352, y2: 210 },
      { type: 'line', x1: 308, y1: 195, x2: 345, y2: 213 },
      { type: 'rect', x: 320, y: 215, w: 25, h: 5 },
      { type: 'circle', cx: 270, cy: 223, r: 1.8 },
      { type: 'circle', cx: 285, cy: 223, r: 1.8 },
      { type: 'circle', cx: 360, cy: 223, r: 1.8 },
      { type: 'line', x1: 300, y1: 130, x2: 222, y2: 223 },
      { type: 'line', x1: 300, y1: 130, x2: 398, y2: 223 },
      { type: 'path', d: 'M 300,130 L 310,133 L 300,136 Z' },
    ],
    labels: [{ x: 300, y: 118, text: 'CLASSIC · 60FT · 2023' }],
  },
  gulf: {
    far: {
      fill: [{ d: 'M -100,210 L -100,250 L 700,250 L 700,210 Z', opacity: 0.1 }],
      stroke: [
        { d: 'M -100,210 L 700,210', opacity: 0.5 },
        { d: 'M 280,210 L 280,135 L 275,125 L 280,135 L 285,125 L 280,135', opacity: 0.7 },
        { d: 'M 40,210 L 40,190 L 55,190 L 55,210 M 70,210 L 70,182 L 85,182 L 85,210 M 100,210 L 100,175 L 118,175 L 118,210 M 135,210 L 135,185 L 148,185 L 148,210 M 170,210 L 170,170 L 185,170 L 185,210 M 200,210 L 200,180 L 215,180 L 215,210 M 230,210 L 230,165 L 248,165 L 248,210 M 310,210 L 310,180 L 328,180 L 328,210 M 345,210 L 345,165 L 362,165 L 362,210 M 380,210 L 380,178 L 395,178 L 395,210 M 410,210 L 410,172 L 428,172 L 428,210 M 445,210 L 445,185 L 460,185 L 460,210 M 478,210 L 478,170 L 495,170 L 495,210 M 515,210 L 515,180 L 530,180 L 530,210 M 550,210 L 550,175 L 568,175 L 568,210 M 600,210 L 600,185 L 618,185 L 618,210 M 640,210 L 640,170 L 658,170 L 658,210', opacity: 0.55 },
      ],
    },
    mid: {
      fill: [{ d: 'M -100,232 L -30,222 L 40,228 L 120,220 L 210,230 L 300,218 L 390,228 L 470,222 L 560,230 L 640,225 L 700,230 L 700,250 L -100,250 Z', opacity: 0.14 }],
      stroke: [
        { d: 'M -100,232 L -30,222 L 40,228 L 120,220 L 210,230 L 300,218 L 390,228 L 470,222 L 560,230 L 640,225 L 700,230', opacity: 0.4 },
        { d: 'M 30,230 L 30,205 M 30,205 Q 15,195 5,205 M 30,205 Q 45,195 55,205 M 30,205 Q 20,188 12,182 M 30,205 Q 40,188 48,182' },
        { d: 'M 580,230 L 580,205 M 580,205 Q 565,195 555,205 M 580,205 Q 595,195 605,205 M 580,205 Q 570,188 562,182 M 580,205 Q 590,188 598,182' },
      ],
    },
    near: { stroke: [{ d: 'M -100,320 Q -30,317 50,320 Q 130,323 210,320 Q 290,317 370,320 Q 450,323 530,320 Q 610,317 700,320', opacity: 0.3 }] },
    yacht: [
      { type: 'path', d: 'M 100,230 L 115,212 L 200,202 L 440,200 L 500,208 L 525,228 L 520,232 Z' },
      { type: 'path', d: 'M 145,200 L 150,180 L 475,178 L 490,198' },
      { type: 'path', d: 'M 180,178 L 185,158 L 440,156 L 455,178' },
      { type: 'path', d: 'M 215,156 L 220,138 L 400,136 L 415,156' },
      { type: 'line', x1: 310, y1: 136, x2: 310, y2: 110 },
      { type: 'circle', cx: 310, cy: 107, r: 4 },
      { type: 'circle', cx: 430, cy: 188, r: 12 },
    ],
    details: [
      ...Array.from({ length: 28 }, (_, i) => ({ type: 'rect', x: 160 + i * 10, y: 182, w: 7, h: 8 })),
      ...Array.from({ length: 22 }, (_, i) => ({ type: 'rect', x: 195 + i * 10, y: 160, w: 7, h: 8 })),
      ...Array.from({ length: 15 }, (_, i) => ({ type: 'rect', x: 230 + i * 10, y: 140, w: 7, h: 8 })),
      ...Array.from({ length: 10 }, (_, i) => ({ type: 'circle', cx: 135 + i * 32, cy: 218, r: 2 })),
      { type: 'line', x1: 425, y1: 184, x2: 425, y2: 192 },
      { type: 'line', x1: 435, y1: 184, x2: 435, y2: 192 },
      { type: 'line', x1: 425, y1: 188, x2: 435, y2: 188 },
      { type: 'path', d: 'M 310,110 L 322,114 L 310,118 Z' },
      { type: 'line', x1: 108, y1: 226, x2: 522, y2: 226 },
    ],
    labels: [{ x: 310, y: 102, text: 'FLAGSHIP · 120M · V12 DIESEL' }],
  },
  usa: {
    far: {
      fill: [{ d: 'M -100,210 L -100,250 L 700,250 L 700,210 Z', opacity: 0.09 }],
      stroke: [
        { d: 'M -100,210 L 700,210', opacity: 0.5 },
        { d: 'M 40,210 L 40,185 L 55,185 L 55,190 L 68,190 L 68,185 L 82,185 L 82,210 M 100,210 L 100,178 L 115,178 L 115,182 L 130,182 L 130,178 L 145,178 L 145,210 M 165,210 L 165,195 L 180,195 L 180,210 M 200,210 L 200,180 L 220,180 L 220,185 L 240,185 L 240,180 L 260,180 L 260,210 M 280,210 L 280,190 L 295,190 L 295,210 M 315,210 L 315,170 L 335,170 L 335,175 L 350,175 L 350,170 L 370,170 L 370,210 M 390,210 L 390,185 L 405,185 L 405,210 M 425,210 L 425,175 L 448,175 L 448,180 L 468,180 L 468,175 L 488,175 L 488,210 M 510,210 L 510,182 L 525,182 L 525,210 M 545,210 L 545,175 L 565,175 L 565,210 M 595,210 L 595,188 L 612,188 L 612,210 M 635,210 L 635,180 L 652,180 L 652,210', opacity: 0.55 },
      ],
    },
    mid: {
      fill: [{ d: 'M -100,228 L 700,228 L 700,250 L -100,250 Z', opacity: 0.18 }],
      stroke: [
        { d: 'M -100,228 L 700,228', opacity: 0.45 },
        { d: 'M 50,228 L 50,185 M 50,185 Q 35,175 25,185 M 50,185 Q 65,175 75,185 M 50,185 Q 42,165 35,160 M 50,185 Q 58,165 65,160' },
        { d: 'M 550,228 L 550,180 M 550,180 Q 535,170 525,180 M 550,180 Q 565,170 575,180 M 550,180 Q 542,160 535,155 M 550,180 Q 558,160 565,155' },
      ],
    },
    near: { stroke: [{ d: 'M -100,320 Q -30,317 50,320 Q 130,323 210,320 Q 290,317 370,320 Q 450,323 530,320 Q 610,317 700,320', opacity: 0.3 }] },
    yacht: [
      { type: 'path', d: 'M 140,232 L 155,218 L 220,208 L 420,206 L 475,212 L 500,228 L 495,234 L 145,236 Z' },
      { type: 'path', d: 'M 180,208 L 205,185 L 415,183 L 445,208' },
      { type: 'path', d: 'M 245,183 L 255,163 L 380,161 L 395,183' },
      { type: 'path', d: 'M 300,161 L 300,140 L 340,140 L 340,161' },
      { type: 'line', x1: 320, y1: 140, x2: 320, y2: 118 },
    ],
    details: [
      { type: 'path', d: 'M 215,188 L 395,188 L 395,203 L 225,203 Z' },
      { type: 'line', x1: 225, y1: 191, x2: 385, y2: 191 },
      { type: 'line', x1: 225, y1: 199, x2: 385, y2: 199 },
      { type: 'path', d: 'M 265,168 L 370,168 L 370,178 L 265,178 Z' },
      { type: 'line', x1: 150, y1: 227, x2: 495, y2: 227 },
      { type: 'path', d: 'M 495,232 L 525,234 L 525,240 L 495,238 Z' },
      { type: 'circle', cx: 500, cy: 225, r: 2 },
      { type: 'circle', cx: 505, cy: 225, r: 2 },
    ],
    labels: [{ x: 320, y: 112, text: 'PERFORMANCE · 85FT · 2000HP' }],
  },
  mexico: {
    far: {
      fill: [{ d: 'M -100,220 L -40,205 L 40,210 L 120,190 L 200,205 L 280,185 L 360,200 L 440,180 L 520,205 L 600,190 L 700,210 L 700,250 L -100,250 Z', opacity: 0.17 }],
      stroke: [
        { d: 'M -100,220 L -40,205 L 40,210 L 120,190 L 200,205 L 280,185 L 360,200 L 440,180 L 520,205 L 600,190 L 700,210', opacity: 0.5 },
        { d: 'M 260,205 L 265,190 Q 275,170 285,190 L 290,205 M 272,205 Q 275,195 278,205' },
      ],
    },
    mid: {
      fill: [{ d: 'M -100,235 L -30,228 L 50,232 L 130,226 L 210,234 L 290,228 L 370,235 L 450,228 L 530,234 L 620,230 L 700,234 L 700,250 L -100,250 Z', opacity: 0.2 }],
      stroke: [
        { d: 'M -100,235 L -30,228 L 50,232 L 130,226 L 210,234 L 290,228 L 370,235 L 450,228 L 530,234 L 620,230 L 700,234', opacity: 0.4 },
        { d: 'M 110,232 L 110,220 Q 110,215 115,215 Q 120,215 120,220 L 120,228 M 110,228 Q 104,225 104,218' },
        { d: 'M 490,232 L 490,220 Q 490,215 495,215 Q 500,215 500,220 L 500,228 M 490,228 Q 484,225 484,218' },
      ],
    },
    near: { stroke: [{ d: 'M -100,320 Q -30,317 50,320 Q 130,323 210,320 Q 290,317 370,320 Q 450,323 530,320 Q 610,317 700,320', opacity: 0.3 }] },
    yacht: [
      { type: 'path', d: 'M 145,232 L 160,222 L 210,216 L 395,216 L 445,222 L 465,232 Z' },
      { type: 'path', d: 'M 145,225 L 160,217 L 210,212 L 395,212 L 445,217 L 465,225', opacity: 0.65 },
      { type: 'rect', x: 165, y: 198, w: 290, h: 14 },
      { type: 'path', d: 'M 210,198 L 218,180 L 395,180 L 405,198' },
      { type: 'line', x1: 300, y1: 180, x2: 300, y2: 105 },
      { type: 'line', x1: 300, y1: 185, x2: 370, y2: 183 },
      { type: 'path', d: 'M 300,105 L 300,183 L 370,183 Z' },
      { type: 'path', d: 'M 300,125 L 300,180 L 225,180 Z' },
    ],
    details: [
      { type: 'rect', x: 222, y: 183, w: 175, h: 13 },
      { type: 'line', x1: 265, y1: 183, x2: 265, y2: 196 },
      { type: 'line', x1: 305, y1: 183, x2: 305, y2: 196 },
      { type: 'line', x1: 348, y1: 183, x2: 348, y2: 196 },
      { type: 'circle', cx: 185, cy: 225, r: 2 },
      { type: 'circle', cx: 220, cy: 225, r: 2 },
      { type: 'circle', cx: 380, cy: 225, r: 2 },
      { type: 'circle', cx: 415, cy: 225, r: 2 },
      { type: 'line', x1: 165, y1: 203, x2: 210, y2: 200 },
      { type: 'line', x1: 165, y1: 207, x2: 210, y2: 204 },
      { type: 'line', x1: 165, y1: 211, x2: 210, y2: 208 },
      { type: 'line', x1: 308, y1: 140, x2: 365, y2: 180 },
      { type: 'line', x1: 308, y1: 162, x2: 355, y2: 182 },
      { type: 'path', d: 'M 300,105 L 310,108 L 300,111 Z' },
    ],
    labels: [{ x: 300, y: 98, text: 'COASTAL · 50FT · CATAMARAN' }],
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createEl(spec) {
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

function buildLayer(layerEl, data, accent, strokeClass, fillClass) {
  (data.fill || []).forEach((s) => {
    const el = document.createElementNS(SVG_NS, 'path');
    el.setAttribute('d', s.d);
    el.setAttribute('fill', accent);
    el.setAttribute('stroke', 'none');
    el.setAttribute('class', fillClass);
    el.setAttribute('opacity', s.opacity || 0.15);
    layerEl.appendChild(el);
  });
  (data.stroke || []).forEach((s) => {
    const el = document.createElementNS(SVG_NS, 'path');
    el.setAttribute('d', s.d);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', accent);
    el.setAttribute('class', strokeClass);
    el.setAttribute('opacity', s.opacity || 0.5);
    layerEl.appendChild(el);
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function YachtMorphLoader({ region = 'canada', onAnimationEnd, statusText = 'Anchoring marina scene · Loading tenant data' }) {
  const ANCHOR_SCALE = 1.14;
  const animatingRef = useRef(false);
  const svgRef = useRef(null);
  const stageRef = useRef(null);
  const filmTopRef = useRef(null);
  const filmBottomRef = useRef(null);
  const sceneTitleRef = useRef(null);
  const sceneRegionRef = useRef(null);
  const sceneTaglineRef = useRef(null);
  const phaseBadgeRef = useRef(null);
  const mmRingRef = useRef(null);
  const mmRing2Ref = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setPhaseBadge(text, color) {
      if (!phaseBadgeRef.current) return;
      phaseBadgeRef.current.textContent = text;
      if (color) phaseBadgeRef.current.style.color = color;
      phaseBadgeRef.current.style.opacity = 1;
    }

    async function animate() {
      if (!mountedRef.current || animatingRef.current) return;
      animatingRef.current = true;

      const d = REGION_DATA[region] || REGION_DATA.canada;
      const a = ASSETS[region] || ASSETS.canada;

      const root = svgRef.current;
      if (!root) return;

      const layerFar = root.querySelector('[data-layer="far"]');
      const layerMid = root.querySelector('[data-layer="mid"]');
      const layerNear = root.querySelector('[data-layer="near"]');
      const yachtGroup = root.querySelector('[data-el="yachtGroup"]');
      const yacht = root.querySelector('[data-el="yacht"]');
      const details = root.querySelector('[data-el="details"]');
      const labels = root.querySelector('[data-el="labels"]');
      const splashRipples = root.querySelector('[data-el="splashRipples"]');
      const anchorChain = root.querySelector('[data-el="anchorChain"]');
      const anchorSymbol = root.querySelector('[data-el="anchorSymbol"]');
      const stage = stageRef.current;
      const filmTop = filmTopRef.current;
      const filmBottom = filmBottomRef.current;
      const sceneTitle = sceneTitleRef.current;
      const sceneRegion = sceneRegionRef.current;
      const sceneTagline = sceneTaglineRef.current;
      const mmRing = mmRingRef.current;
      const mmRing2 = mmRing2Ref.current;

      if (prefersReduced) {
        // Static final frame only
        yacht.innerHTML = ''; details.innerHTML = ''; labels.innerHTML = '';
        layerFar.innerHTML = ''; layerMid.innerHTML = ''; layerNear.innerHTML = '';
        if (stage) stage.style.background = `linear-gradient(180deg, #f4f1e8 0%, ${d.seaDepth} 55%, ${d.seaDepth} 100%)`;
        buildLayer(layerFar, a.far, d.accent, styles.parallaxStroke, styles.parallaxFill);
        buildLayer(layerMid, a.mid, d.accent, styles.parallaxStroke, styles.parallaxFill);
        buildLayer(layerNear, a.near, d.accent, styles.parallaxStroke, styles.parallaxFill);
        a.yacht.forEach((p) => {
          const el = createEl(p);
          el.setAttribute('class', styles.yachtEl);
          el.setAttribute('stroke', d.accent);
          if (p.opacity !== undefined) el.style.opacity = p.opacity;
          yacht.appendChild(el);
        });
        a.details.forEach((dt) => {
          const el = createEl(dt);
          el.setAttribute('class', styles.yachtDetail);
          el.setAttribute('stroke', d.accent);
          el.style.opacity = 0.75;
          details.appendChild(el);
        });
        layerFar.style.opacity = 1; layerMid.style.opacity = 1; layerNear.style.opacity = 1;
        yachtGroup.style.opacity = 1; yachtGroup.style.transform = 'translateX(0)';
        anchorChain.setAttribute('x1', d.anchorStartX);
        anchorChain.setAttribute('y1', d.anchorStartY);
        anchorChain.setAttribute('x2', d.anchorStartX);
        anchorChain.setAttribute('y2', 325);
        anchorChain.style.opacity = 0.9;
        anchorChain.setAttribute('stroke', d.gold);
        anchorSymbol.querySelectorAll('line, path, circle').forEach((el) => el.setAttribute('stroke', d.gold));
        anchorSymbol.setAttribute('transform', `translate(${d.anchorStartX}, 325) scale(${ANCHOR_SCALE})`);
        anchorSymbol.style.opacity = 1;
        a.labels.forEach((lb) => {
          const el = document.createElementNS(SVG_NS, 'text');
          el.setAttribute('x', lb.x);
          el.setAttribute('y', lb.y);
          el.setAttribute('text-anchor', 'middle');
          el.setAttribute('class', styles.yachtLabel);
          el.setAttribute('fill', d.gold);
          el.textContent = lb.text;
          el.style.opacity = 1;
          labels.appendChild(el);
        });
        const depthLabelEl = document.createElementNS(SVG_NS, 'text');
        depthLabelEl.setAttribute('x', 300);
        depthLabelEl.setAttribute('y', 335);
        depthLabelEl.setAttribute('text-anchor', 'middle');
        depthLabelEl.setAttribute('class', styles.yachtLabel);
        depthLabelEl.setAttribute('fill', d.gold);
        depthLabelEl.textContent = d.depthLabel;
        depthLabelEl.style.opacity = 1;
        labels.appendChild(depthLabelEl);
        if (sceneRegion) sceneRegion.textContent = d.city;
        if (sceneTagline) sceneTagline.textContent = d.tagline;
        if (sceneTitle) sceneTitle.classList.add(styles.visible);
        if (phaseBadgeRef.current) phaseBadgeRef.current.style.opacity = 0;
        if (filmTop) filmTop.classList.remove(styles.active);
        if (filmBottom) filmBottom.classList.remove(styles.active);
        animatingRef.current = false;
        if (onAnimationEnd) onAnimationEnd();
        return;
      }

      // PHASE 1: exit
      setPhaseBadge('DEPARTING', d.accent);
      if (filmTop) filmTop.classList.add(styles.active);
      if (filmBottom) filmBottom.classList.add(styles.active);
      if (sceneTitle) sceneTitle.classList.remove(styles.visible);
      yachtGroup.classList.remove(styles.yachtBob);
      yachtGroup.style.transition = 'opacity 0.7s ease, transform 0.9s ease';
      yachtGroup.style.opacity = 0;
      yachtGroup.style.transform = 'translateX(80%)';
      [layerFar, layerMid, layerNear].forEach((l) => {
        l.style.transition = 'opacity 0.7s ease';
        l.style.opacity = 0;
      });
      anchorChain.style.transition = 'opacity 0.4s ease';
      anchorChain.style.opacity = 0;
      anchorSymbol.style.transition = 'opacity 0.4s ease';
      anchorSymbol.style.opacity = 0;
      labels.querySelectorAll('*').forEach((el) => (el.style.opacity = 0));
      splashRipples.innerHTML = '';
      await wait(800);
      if (!mountedRef.current) return;

      // PHASE 2: rebuild
      layerFar.innerHTML = ''; layerMid.innerHTML = ''; layerNear.innerHTML = '';
      yacht.innerHTML = ''; details.innerHTML = ''; labels.innerHTML = '';

      if (stage) stage.style.background = `linear-gradient(180deg, #f4f1e8 0%, ${d.seaDepth} 55%, ${d.seaDepth} 100%)`;
      root.querySelectorAll('[data-water-ripple]').forEach((el) => el.setAttribute('stroke', d.accent));
      if (mmRing && mmRing2) {
        mmRing.animate(
          [{ r: 2.5, opacity: 0.9 }, { r: 14, opacity: 0 }],
          { duration: 1100, iterations: 1, easing: 'ease-out' }
        );
        setTimeout(() => {
          if (!mountedRef.current || !mmRing2) return;
          mmRing2.animate(
            [{ r: 2.5, opacity: 0.6 }, { r: 18, opacity: 0 }],
            { duration: 1200, iterations: 1, easing: 'ease-out' }
          );
        }, 220);
      }

      buildLayer(layerFar, a.far, d.accent, styles.parallaxStroke, styles.parallaxFill);
      buildLayer(layerMid, a.mid, d.accent, styles.parallaxStroke, styles.parallaxFill);
      buildLayer(layerNear, a.near, d.accent, styles.parallaxStroke, styles.parallaxFill);

      a.yacht.forEach((p) => {
        const el = createEl(p);
        el.setAttribute('class', styles.yachtEl);
        el.setAttribute('stroke', d.accent);
        if (p.opacity !== undefined) el.style.opacity = p.opacity;
        yacht.appendChild(el);
      });
      a.details.forEach((dt) => {
        const el = createEl(dt);
        el.setAttribute('class', styles.yachtDetail);
        el.setAttribute('stroke', d.accent);
        details.appendChild(el);
      });

      layerFar.style.transition = 'none';
      layerFar.style.transform = 'translateX(80px)';
      layerFar.style.opacity = 0;
      layerMid.style.transition = 'none';
      layerMid.style.transform = 'translateX(140px)';
      layerMid.style.opacity = 0;
      layerNear.style.transition = 'none';
      layerNear.style.transform = 'translateX(220px)';
      layerNear.style.opacity = 0;
      yachtGroup.style.transition = 'none';
      yachtGroup.style.transform = 'translateX(-100%)';
      yachtGroup.style.opacity = 1;
      layerFar.getBoundingClientRect();

      // PHASE 3: parallax pan + yacht sails in
      setPhaseBadge(`APPROACHING ${d.city.toUpperCase()}`, d.accent);
      requestAnimationFrame(() => {
        layerFar.style.transition = 'transform 2.0s cubic-bezier(0.3, 0.6, 0.3, 1), opacity 0.9s ease';
        layerFar.style.transform = 'translateX(0)';
        layerFar.style.opacity = 1;
        layerMid.style.transition = 'transform 1.7s cubic-bezier(0.3, 0.6, 0.3, 1), opacity 0.9s ease 0.1s';
        layerMid.style.transform = 'translateX(0)';
        layerMid.style.opacity = 1;
        layerNear.style.transition = 'transform 1.3s cubic-bezier(0.3, 0.6, 0.3, 1), opacity 0.8s ease 0.2s';
        layerNear.style.transform = 'translateX(0)';
        layerNear.style.opacity = 1;
        yachtGroup.style.transition = 'transform 2.0s cubic-bezier(0.25, 0.8, 0.35, 1)';
        yachtGroup.style.transform = 'translateX(0)';
      });
      setTimeout(() => {
        if (!mountedRef.current) return;
        if (sceneRegion) sceneRegion.textContent = d.city;
        if (sceneTagline) sceneTagline.textContent = d.tagline;
        if (sceneTitle) sceneTitle.classList.add(styles.visible);
      }, 900);
      await wait(2100);
      if (!mountedRef.current) return;

      // PHASE 4: bob
      setPhaseBadge('ARRIVED · PREPARING', d.accent);
      yachtGroup.classList.add(styles.yachtBob);
      details.querySelectorAll('*').forEach((el) => (el.style.opacity = 0.75));
      await wait(700);
      if (!mountedRef.current) return;

      // PHASE 5: DROP ANCHOR
      setPhaseBadge('DROP ANCHOR', d.gold);
      const startX = d.anchorStartX;
      const startY = d.anchorStartY;
      const waterY = 275;
      const seabedY = 325;

      anchorSymbol.querySelectorAll('line, path, circle').forEach((el) => el.setAttribute('stroke', d.gold));
      anchorChain.setAttribute('stroke', d.gold);
      anchorSymbol.setAttribute('transform', `translate(${startX}, ${startY}) scale(${ANCHOR_SCALE})`);
      anchorSymbol.style.transition = 'none';
      anchorSymbol.style.opacity = 1;
      anchorChain.setAttribute('x1', startX);
      anchorChain.setAttribute('y1', startY);
      anchorChain.setAttribute('x2', startX);
      anchorChain.setAttribute('y2', startY);
      anchorChain.style.opacity = 0.9;
      await wait(400);
      if (!mountedRef.current) return;

      anchorSymbol.style.transition = 'transform 1.4s cubic-bezier(0.4, 0, 0.9, 0.6)';
      anchorSymbol.setAttribute('transform', `translate(${startX}, ${seabedY}) scale(${ANCHOR_SCALE})`);

      const chainStart = performance.now();
      function updateChain() {
        if (!mountedRef.current) return;
        const elapsed = performance.now() - chainStart;
        const progress = Math.min(elapsed / 1400, 1);
        const eased = progress * progress * (1 - 0.3 * progress);
        const y = startY + (seabedY - startY) * eased;
        anchorChain.setAttribute('y2', y);
        if (progress < 1) requestAnimationFrame(updateChain);
      }
      requestAnimationFrame(updateChain);

      const timeToWater = 1.4 * Math.sqrt((waterY - startY) / (seabedY - startY)) * 1000;
      await wait(timeToWater);
      if (!mountedRef.current) return;

      // PHASE 6: splash
      for (let i = 0; i < 3; i++) {
        const ripple = document.createElementNS(SVG_NS, 'circle');
        ripple.setAttribute('cx', startX);
        ripple.setAttribute('cy', waterY);
        ripple.setAttribute('r', 3);
        ripple.setAttribute('fill', 'none');
        ripple.setAttribute('stroke', d.gold);
        ripple.setAttribute('stroke-width', '1.2');
        ripple.setAttribute('opacity', '0.9');
        splashRipples.appendChild(ripple);
        ripple.animate(
          [{ r: 3, opacity: 0.9 }, { r: 40 + i * 10, opacity: 0 }],
          { duration: 1800, delay: i * 200, iterations: 1, easing: 'ease-out' }
        );
      }
      for (let i = 0; i < 6; i++) {
        const droplet = document.createElementNS(SVG_NS, 'line');
        const offsetX = (Math.random() - 0.5) * 32;
        const offsetY = 10 + Math.random() * 18;
        droplet.setAttribute('x1', startX);
        droplet.setAttribute('y1', waterY);
        droplet.setAttribute('x2', startX + offsetX);
        droplet.setAttribute('y2', waterY - offsetY);
        droplet.setAttribute('stroke', d.gold);
        droplet.setAttribute('stroke-width', '1.3');
        droplet.setAttribute('opacity', '0');
        droplet.setAttribute('stroke-linecap', 'round');
        splashRipples.appendChild(droplet);
        droplet.animate(
          [
            { opacity: 0.9, transform: 'translate(0, 0)' },
            { opacity: 0, transform: `translate(${offsetX * 0.3}px, -8px)` },
          ],
          { duration: 800, iterations: 1, easing: 'ease-out' }
        );
      }

      await wait(1400 - timeToWater + 300);
      if (!mountedRef.current) return;

      // PHASE 7: labels fade in
      setPhaseBadge(`ANCHORED · ${d.city.toUpperCase()}`, d.gold);
      a.labels.forEach((lb) => {
        const el = document.createElementNS(SVG_NS, 'text');
        el.setAttribute('x', lb.x);
        el.setAttribute('y', lb.y);
        el.setAttribute('text-anchor', 'middle');
        el.setAttribute('class', styles.yachtLabel);
        el.setAttribute('fill', d.gold);
        el.textContent = lb.text;
        labels.appendChild(el);
      });
      const depthLabelEl = document.createElementNS(SVG_NS, 'text');
      depthLabelEl.setAttribute('x', 300);
      depthLabelEl.setAttribute('y', 335);
      depthLabelEl.setAttribute('text-anchor', 'middle');
      depthLabelEl.setAttribute('class', styles.yachtLabel);
      depthLabelEl.setAttribute('fill', d.gold);
      depthLabelEl.textContent = d.depthLabel;
      labels.appendChild(depthLabelEl);
      setTimeout(() => {
        if (!mountedRef.current) return;
        labels.querySelectorAll(`.${styles.yachtLabel}`).forEach((el) => (el.style.opacity = 1));
      }, 100);

      await wait(1000);
      if (phaseBadgeRef.current) phaseBadgeRef.current.style.opacity = 0;
      if (filmTop) filmTop.classList.remove(styles.active);
      if (filmBottom) filmBottom.classList.remove(styles.active);
      animatingRef.current = false;
      if (onAnimationEnd && mountedRef.current) onAnimationEnd();
    }

    animate();

    return () => {
      mountedRef.current = false;
    };
  }, [region, onAnimationEnd]);

  const d = REGION_DATA[region] || REGION_DATA.canada;

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.metaBar}>
        <div className={styles.metaLeft}>
          <div className={styles.headerLabel}>DynamicNFC · Yachts</div>
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

      <div className={styles.yachtArea}>
        <div ref={filmTopRef} className={styles.filmBarTop} />
        <div ref={filmBottomRef} className={styles.filmBarBottom} />
        <div ref={sceneTitleRef} className={styles.sceneTitle}>
          <div ref={sceneRegionRef} className={styles.regionName}>{d.city}</div>
          <span ref={sceneTaglineRef} className={styles.tagline}>{d.tagline}</span>
        </div>
        <div ref={phaseBadgeRef} className={styles.phaseBadge}>APPROACHING</div>
        <svg
          ref={svgRef}
          className={styles.yachtSvg}
          viewBox="0 0 600 340"
          preserveAspectRatio="xMidYMid slice"
        >
          <g data-layer="far"></g>
          <g data-layer="mid"></g>
          <g data-el="waterLayer">
            <path data-water-ripple className={styles.waterRipple} d="M 0,265 Q 60,262 120,265 T 240,268 T 360,265 T 480,268 T 600,265" stroke={d.accent} opacity="0.45" />
            <path data-water-ripple className={styles.waterRipple} d="M 0,280 Q 60,277 120,280 T 240,283 T 360,280 T 480,283 T 600,280" stroke={d.accent} opacity="0.38" />
            <path data-water-ripple className={styles.waterRipple} d="M 0,295 Q 60,292 120,295 T 240,298 T 360,295 T 480,298 T 600,295" stroke={d.accent} opacity="0.32" />
            <path data-water-ripple className={styles.waterRipple} d="M 0,310 Q 60,307 120,310 T 240,313 T 360,310 T 480,313 T 600,310" stroke={d.accent} opacity="0.25" />
          </g>
          <g data-layer="near"></g>
          <g data-el="yachtGroup">
            <g data-el="yacht"></g>
            <g data-el="details"></g>
          </g>
          <g data-el="anchorWrapper">
            <line
              data-el="anchorChain"
              x1="300" y1="230" x2="300" y2="230"
              stroke={d.anchorColor}
              strokeWidth="2.6"
              strokeDasharray="5 3"
              opacity="0"
              strokeLinecap="round"
            />
            <g data-el="anchorSymbol" transform="translate(300, 230)" opacity="0">
              <line x1="0" y1="-18" x2="0" y2="16" stroke={d.anchorColor} strokeWidth="2.8" strokeLinecap="round" />
              <line x1="-9" y1="-10" x2="9" y2="-10" stroke={d.anchorColor} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M -12,10 Q 0,22 12,10" stroke={d.anchorColor} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M -12,10 L -17,5 M 12,10 L 17,5" stroke={d.anchorColor} strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <circle cx="0" cy="-20" r="3" fill="none" stroke={d.anchorColor} strokeWidth="2.2" />
            </g>
          </g>
          <g data-el="splashRipples"></g>
          <g data-el="labels"></g>
        </svg>
      </div>
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

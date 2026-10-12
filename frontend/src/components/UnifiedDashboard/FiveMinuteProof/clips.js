import s1mp4 from "./media/step1-identity.mp4";
import s1jpg from "./media/step1-identity.jpg";
import s2reMp4 from "./media/step2-track-realestate.mp4";
import s2reJpg from "./media/step2-track-realestate.jpg";
import s2auMp4 from "./media/step2-track-auto.mp4";
import s2auJpg from "./media/step2-track-auto.jpg";
import s2yaMp4 from "./media/step2-track-yacht.mp4";
import s2yaJpg from "./media/step2-track-yacht.jpg";
import s3mp4 from "./media/step3-score.mp4";
import s3jpg from "./media/step3-score.jpg";
import s4mp4 from "./media/step4-alert.mp4";
import s4jpg from "./media/step4-alert.jpg";
import s5reMp4 from "./media/step5-close-realestate.mp4";
import s5reJpg from "./media/step5-close-realestate.jpg";
import s5auMp4 from "./media/step5-close-auto.mp4";
import s5auJpg from "./media/step5-close-auto.jpg";
import s5yaMp4 from "./media/step5-close-yacht.mp4";
import s5yaJpg from "./media/step5-close-yacht.jpg";

const one = { mp4: s1mp4, jpg: s1jpg };
const three = { mp4: s3mp4, jpg: s3jpg };
const four = { mp4: s4mp4, jpg: s4jpg };
const track = {
  realestate: { mp4: s2reMp4, jpg: s2reJpg },
  auto: { mp4: s2auMp4, jpg: s2auJpg },
  yacht: { mp4: s2yaMp4, jpg: s2yaJpg },
};
const close = {
  realestate: { mp4: s5reMp4, jpg: s5reJpg },
  auto: { mp4: s5auMp4, jpg: s5auJpg },
  yacht: { mp4: s5yaMp4, jpg: s5yaJpg },
};

const CLIPS = {
  1: { realestate: one, auto: one, yacht: one },
  2: track,
  3: { realestate: three, auto: three, yacht: three },
  4: { realestate: four, auto: four, yacht: four },
  5: close,
};

// First inventory card name per region × sector (seed arrays are not exported).
const FIRST_ITEM = {
  canada: { real_estate: "Harbour Penthouse 41A", automotive: "Porsche Taycan Turbo S", yacht: "Nordhavn 86" },
  italy: { real_estate: "Attico Lario 12A", automotive: "Ferrari Purosangue", yacht: "Azimut Grande 35 Metri" },
  usa: { real_estate: "Madison Penthouse 52A", automotive: "Porsche 911 Turbo S", yacht: "Westport 40M" },
  mexico: { real_estate: "Polanco Penthouse 18A", automotive: "BMW X7 M60i", yacht: "Ferretti Custom Line 130" },
  gulf: { real_estate: "Sky Penthouse A", automotive: "Mercedes-AMG GT 63 S", yacht: "Azimut Grande 35 Metri" },
};

export function sectorIds(sector) {
  const value = String(sector || "").toLowerCase();
  if (value === "automotive" || value === "auto") return { clip: "auto", persona: "automotive" };
  if (value === "yacht") return { clip: "yacht", persona: "yacht" };
  return { clip: "realestate", persona: "real_estate" };
}

export function clipFor(step, sector) {
  const { clip } = sectorIds(sector);
  return (CLIPS[step] || CLIPS[1])[clip];
}

export function firstItem(regionId, sector) {
  const { persona } = sectorIds(sector);
  return FIRST_ITEM[regionId]?.[persona] || "";
}

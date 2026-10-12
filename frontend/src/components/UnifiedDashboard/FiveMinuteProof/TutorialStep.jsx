import { useEffect, useMemo, useState } from "react";
import { translate, useLanguage } from "../../../i18n";
import "../../../i18n/portals/fiveMinuteProof";
import { getEffectiveLocale, getPersonas, getProjectName, getRegion } from "../../../config/regionConfig";
import { getRealEstateMapRegionData } from "../../../config/mapRegionConfig";
import { clipFor, firstItem, sectorIds } from "./clips";
import Step1Identity from "./illustrations/Step1Identity";
import Step2Track from "./illustrations/Step2Track";
import Step3Score from "./illustrations/Step3Score";
import Step4Alert from "./illustrations/Step4Alert";
import Step5Close from "./illustrations/Step5Close";

const STEP_ILLUSTRATIONS = {
  1: Step1Identity,
  2: Step2Track,
  3: Step3Score,
  4: Step4Alert,
  5: Step5Close,
};

const SCORES = [82, 54, 38];
const OVERLAY = {
  1: "fmp-ov fmp-ov-s1",
  2: "fmp-ov fmp-ov-s2",
  3: "fmp-ov fmp-ov-s3",
  4: "fmp-ov fmp-ov-s4",
  5: "fmp-ov fmp-ov-s5",
};

function fill(template, values) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (_, key) => values?.[key] ?? "");
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduce;
}

function holdLastFrame(event) {
  const video = event.currentTarget;
  if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - 0.04);
}

export default function TutorialStep({ stepNumber, totalSteps, regionId, sector = "real_estate", lang }) {
  const { lang: contextLang } = useLanguage();
  const activeLang = lang || contextLang;
  const t = (key) => translate("fiveMinuteProof", activeLang, key);
  const reduce = useReducedMotion();
  const ids = sectorIds(sector);
  const clip = clipFor(stepNumber, sector);
  const clipId = `${stepNumber}-${ids.clip}`;
  const [failedId, setFailedId] = useState("");
  const broken = failedId === clipId;

  const personaName = useMemo(() => {
    const people = getPersonas(ids.persona, regionId);
    return (people.find((person) => person.id === "vip1") || people[0])?.name || "";
  }, [ids.persona, regionId]);

  const ranked = useMemo(() => {
    const people = getPersonas(ids.persona, regionId);
    const vip = people.find((person) => person.id === "vip1") || people[0];
    const others = people.filter((person) => person !== vip).slice(0, 2);
    return [vip, ...others].filter(Boolean).map((person, index) => ({
      name: person.name,
      score: SCORES[index],
    }));
  }, [ids.persona, regionId]);

  const place = useMemo(() => {
    const city = getRealEstateMapRegionData()[regionId]?.city || "";
    const country = getRegion(regionId).label?.[activeLang] || getRegion(regionId).label?.en || "";
    return [city, country].filter(Boolean).join(" · ");
  }, [regionId, activeLang]);

  const when = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(14, 0, 0, 0);
    const locale = getEffectiveLocale(regionId, activeLang);
    return {
      dateTime: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(date),
      month: new Intl.DateTimeFormat(locale, { month: "short" }).format(date),
      day: new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(date),
      time: new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date),
    };
  }, [regionId, activeLang]);

  const roleKey = ids.persona === "automotive" ? "roleVipCollector" : ids.persona === "yacht" ? "roleVipOwner" : "roleVipInvestor";
  const stem = ids.persona === "automotive" ? "automotive" : ids.persona === "yacht" ? "yacht" : "realEstate";
  const signals = [1, 2, 3].map((n) => t(`signal.${stem}.${n}`));
  const times = [fill(t("minutesAgo"), { n: 2 }), fill(t("secondsAgo"), { n: 14 }), t("now")];
  const role = t(roleKey);
  const item = firstItem(regionId, sector);
  const projectLabel = getProjectName(ids.persona, regionId, activeLang);
  const steps = t("steps");
  const step = Array.isArray(steps) ? steps[stepNumber - 1] : null;
  const Illustration = STEP_ILLUSTRATIONS[stepNumber] || Step1Identity;
  const illustrationProps = {
    personaName,
    projectLabel,
    locationLabel: place,
    roleLabel: role,
    identified: t("identified"),
    firstEdition: t("firstEdition"),
    cornerLabel: step?.label || "",
    proofLabel: t("card.title"),
    signals,
    times,
    velocity: t("velocity"),
    hot: t("hot"),
    warm: t("warm"),
    cold: t("cold"),
    ranked,
    hotLead: t("hotLead"),
    alert: t(`alert.${stem}`),
    item,
    yourRep: t("yourRep"),
    month: when.month,
    day: when.day,
    time: when.time,
    booked: `${t(`booked.${stem}`)} · ${when.dateTime}`,
  };

  return (
    <div className="fmp-step fmp-step-enter">
      <div className="fmp-illustration">
        <div className="fmp-stage" dir={activeLang === "ar" ? "rtl" : "ltr"}>
          {broken ? (
            <Illustration {...illustrationProps} />
          ) : reduce ? (
            <img className="fmp-media" src={clip.jpg} alt="" />
          ) : (
            <video
              key={`${stepNumber}-${ids.clip}`}
              className="fmp-media"
              src={clip.mp4}
              poster={clip.jpg}
              muted
              playsInline
              autoPlay
              preload="metadata"
              aria-hidden="true"
              onError={() => setFailedId(clipId)}
              onEnded={holdLastFrame}
            />
          )}
          {!broken && (
            <div className={OVERLAY[stepNumber] || OVERLAY[1]} aria-hidden="true">
              {stepNumber === 1 && (
                <div className="fmp-ov-in">
                  <strong className="fmp-ov-name">{personaName}</strong>
                  <span>{role}</span>
                  <span>{place}</span>
                  <span className="fmp-ov-kicker fmp-ov-id"><span className="fmp-id-dot" />{t("identified")}</span>
                </div>
              )}
              {stepNumber === 2 && (
                <>
                  <span className="fmp-ov-kicker">{t("pipeline")}</span>
                  <div className="fmp-ov-row">
                    <span className="fmp-bead fmp-bead-a" />
                    <span>{signals[0]}</span>
                    <span>{times[0]}</span>
                  </div>
                  <div className="fmp-ov-row">
                    <span className="fmp-bead fmp-bead-b" />
                    <span>{signals[1]}</span>
                    <span>{times[1]}</span>
                  </div>
                  <div className="fmp-ov-row">
                    <span className="fmp-bead fmp-bead-c" />
                    <span>{signals[2]}</span>
                    <span>{times[2]}</span>
                  </div>
                </>
              )}
              {stepNumber === 3 && (
                <div className="fmp-ov-in">
                  <span className="fmp-ov-kicker">{t("velocity")}</span>
                  <div className="fmp-rank">
                    {ranked.map((row, index) => (
                      <div key={row.name} className={index === 0 ? "fmp-rank-row fmp-rank-vip" : "fmp-rank-row"}>
                        <span>{row.name}</span>
                        {index === 0 ? <span className="fmp-score-num" /> : <span>{row.score}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {stepNumber === 4 && (
                <div className="fmp-ov-in">
                  <span className="fmp-ov-kicker">{t("hotLead")}</span>
                  <strong className="fmp-ov-name">{personaName}</strong>
                  <span>{t(`alert.${stem}`)}</span>
                  <span>{item}</span>
                  <span>{times[0]}</span>
                </div>
              )}
              {stepNumber === 5 && (
                <div className="fmp-ov-in">
                  <span className="fmp-ov-kicker">{t(`booked.${stem}`)}</span>
                  <strong className="fmp-ov-name">{when.dateTime}</strong>
                  <span>{t("yourRep")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="fmp-step__label">{fill(t("progress"), { current: stepNumber, total: totalSteps })} - {step?.label || ""}</div>
      <p className="fmp-step__body">{fill(step?.body, { persona: personaName })}</p>
    </div>
  );
}

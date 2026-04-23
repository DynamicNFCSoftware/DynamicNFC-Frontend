import { useEffect, useState } from "react";
import { useLanguage } from "../../../i18n";

export default function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const { lang } = useLanguage();

  useEffect(() => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return;

    const target = Number(value);
    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if ((step >= 0 && start >= target) || (step < 0 && start <= target)) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <>
      {prefix}
      {Number(display).toLocaleString(lang === "ar" ? "ar-AE" : "en-AE")}
      {suffix}
    </>
  );
}

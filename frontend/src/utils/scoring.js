export function decayFactor(eventTimestamp, halfLifeDays = 7) {
  const ts = typeof eventTimestamp === "number"
    ? eventTimestamp
    : new Date(eventTimestamp).getTime();
  if (!Number.isFinite(ts)) return 1;
  const daysAgo = (Date.now() - ts) / 86400000;
  return Math.pow(0.5, daysAgo / halfLifeDays);
}

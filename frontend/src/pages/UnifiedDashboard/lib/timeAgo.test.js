import { describe, it, expect } from "vitest";
import { timeAgo, idleSuffix, toMillis } from "./timeAgo";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("timeAgo", () => {
  it("reproduces the shared en/fr/es/ar form and the Italian forms", () => {
    const now = Date.now();
    const cases = [
      [now - 10 * 1000, { en: "just now", it: "ora", fr: "à l'instant", es: "ahora", ar: "الآن" }],
      [now - 5 * MIN, { en: "5m ago", it: "5 min fa", fr: "il y a 5m", es: "hace 5m", ar: "منذ 5 د" }],
      [now - 3 * HOUR, { en: "3h ago", it: "3 h fa", fr: "il y a 3h", es: "hace 3h", ar: "منذ 3 س" }],
      [now - 2 * DAY, { en: "2d ago", it: "2 g fa", fr: "il y a 2j", es: "hace 2d", ar: "منذ 2 ي" }],
    ];
    for (const [ts, expected] of cases) {
      for (const lang of Object.keys(expected)) {
        expect(timeAgo(ts, lang), lang).toBe(expected[lang]);
      }
    }
  });

  it("idle suffix keeps the fuller call-queue form, with Italian g inattivo", () => {
    expect(idleSuffix("en")).toBe("d idle");
    expect(idleSuffix("it")).toBe("g inattivo");
    expect(idleSuffix("fr")).toBe("j inactif");
    expect(idleSuffix("es")).toBe("d inactivo");
    expect(idleSuffix("ar")).toBe(" يوم خمول");
  });

  it("reads a Firestore Timestamp and rejects values that are not a time", () => {
    const ms = Date.now() - 5 * MIN;
    expect(timeAgo({ toMillis: () => ms }, "it")).toBe("5 min fa");
    expect(toMillis({ toMillis: () => Number.NaN })).toBeNull();
    expect(timeAgo("not-a-date", "en")).toBe("");
    expect(timeAgo(null, "en")).toBe("");
  });
});

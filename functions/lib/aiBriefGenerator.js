"use strict";

// Source of truth field names (from dataDerivers.js):
// topVip:             { name, tapCount, hoursAgo, firstAction, score, prevScore, mode }
// pipelineDelta:      { pipelineDelta, newVipCount }
// marketplaceTraffic: { trafficDelta, anonVisitors, topUnit }
// alerts:             { atRisk, hotLeadsNew, followUpsOverdue }

const Anthropic = require("@anthropic-ai/sdk");
const { computeChips, generateBriefFromTemplate } = require("./briefTemplates");

const COOLDOWN_MS = 5 * 60 * 1000;

function buildBriefPrompt({ topVip, pipelineDelta, marketplaceTraffic, alerts, lang }) {
  const langName = { en: "English", ar: "Arabic", es: "Spanish", fr: "French" }[lang] || "English";
  return `You are a sales intelligence assistant for DynamicNFC, a luxury real estate sales velocity platform.

Generate exactly 2 short paragraphs in ${langName} for an executive dashboard daily brief. Tone: confident, concise, brand-aligned (mantra: "Identity precedes Action").

Brand language rules:
- Never use fake metrics or made-up percentages
- Use buyer names directly (identity-first)
- Frame interest as buying signals, not "engagement"
- Avoid generic AI words: leverage, robust, pivotal, synergy

HTML formatting rules (mandatory):
- Wrap the VIP buyer's name in <span class="vip-name">Name</span>
- Wrap any score change phrase (e.g., "Score now 89", "from 67 to 89") in <span class="score-change">...</span>
- Use <strong> sparingly for monetary values like pipeline deltas
- No other HTML tags. No links. No images. No inline styles. No data attributes.

Data:
${JSON.stringify({ topVip, pipelineDelta, marketplaceTraffic, alerts }, null, 2)}

Output exactly this format (no preamble):
PARAGRAPH1: <first paragraph about top VIP>
PARAGRAPH2: <second paragraph about pipeline + marketplace>`;
}

function parseBriefResponse(text = "") {
  const p1Match = text.match(/PARAGRAPH1:\s*(.+?)(?=PARAGRAPH2:|$)/s);
  const p2Match = text.match(/PARAGRAPH2:\s*(.+)$/s);
  return {
    paragraph1: p1Match ? p1Match[1].trim() : "",
    paragraph2: p2Match ? p2Match[1].trim() : "",
  };
}

async function generateBriefFromLLM({ tenantId, topVip, pipelineDelta, marketplaceTraffic, alerts, lang = "en", db }) {
  const rateLimitRef = db.collection("tenants").doc(tenantId).collection("aggregates").doc("llmRateLimit");
  const briefRef = db.collection("tenants").doc(tenantId).collection("aggregates").doc("dailyBrief");
  const rateLimitDoc = await rateLimitRef.get();
  const lastCallMs = rateLimitDoc.exists ? Number(rateLimitDoc.data().lastCallMs || 0) : 0;
  const elapsed = Date.now() - lastCallMs;

  if (elapsed < COOLDOWN_MS) {
    const cachedBriefDoc = await briefRef.get();
    const cached = cachedBriefDoc.exists ? cachedBriefDoc.data() : {};
    return {
      ...cached,
      source: "cached",
      cooldownRemaining: Math.max(0, COOLDOWN_MS - elapsed),
    };
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not present in environment");
    const client = new Anthropic({ apiKey });
    const prompt = buildBriefPrompt({ topVip, pipelineDelta, marketplaceTraffic, alerts, lang });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = parseBriefResponse(response?.content?.[0]?.text || "");
    const briefDoc = {
      paragraph1: parsed.paragraph1,
      paragraph2: parsed.paragraph2,
      chips: computeChips({ alerts, lang }),
      source: "llm",
      generatedAt: Date.now(),
      lang,
    };

    await briefRef.set(briefDoc, { merge: true });
    await rateLimitRef.set({ lastCallMs: Date.now() }, { merge: true });
    return briefDoc;
  } catch (err) {
    console.error("[aiBriefGenerator] LLM call failed:", err.message);
    return generateBriefFromTemplate({ topVip, pipelineDelta, marketplaceTraffic, alerts, lang });
  }
}

module.exports = { generateBriefFromLLM };

# SPRINT AI-1 — AIDemo: Region-Aware Pipeline + Tracking Bridge + 3 New Steps
**Author:** Claude (Cowork) · 2026-07-14 · Target: Cursor Cloud Agent
**Scope:** `frontend/src/pages/AIDemo/` only (+1 small VIPPortal banner, +1 handoff line). No routing changes, no App.jsx edits.

## Why (1 line)
The AI demo is the strongest sales asset but it (a) writes ZERO tracking (violates Demo Tracking Rule), (b) is hardcoded Gulf (Khalid/AED breaks USA/CAN/MEX pitches), (c) misses yacht in its local footer, and (d) shows dev-speak to prospects.

## Pre-flight (do FIRST — stale-assumption guard)
Confirm these exports exist with these names before editing (re-audit lesson 2026-07-02):
1. `services/portalTrack.js` → `trackPortalEvent(portalType, persona, event, data)`
2. `config/regionConfig.js` → `getRegion`, `getPersonas`, `formatCurrency(value, regionId, lang)`
3. `config/realEstateUnitData.js` → luxury unit accessor used by portals (via `services/portalRegion.js` → `usePortalRegion`); confirm how `lux-ph` name/tower resolve per region
4. `react-router-dom` v6 `useSearchParams` available in VIPPortal_Definitive
If any name differs, adapt to the real one and note it in the report.

---

## WP-1 — `pages/AIDemo/aiDemoData.js` (NEW, single source for persona/unit/price)
Export `getAiVip(regionId, lang)` returning:
```js
{ name, firstName, email, vipId, tier: "Platinum",
  project,            // region project name (Al Noor Residences / Vista Residences / etc. from regionConfig)
  unitName, unitCode, // luxury penthouse of the region (lux-ph from realEstateUnitData overlay) + code
  priceFmt,           // formatCurrency(unitPrice, regionId, lang)
  rangeFmt,           // e.g. "AED 8M–15M" — build from region currency prefix, keep qualitative
  salesCenter,        // "<project> Sales Center, <city>"
  timeLabel,          // "2:00 PM GST" / "2:00 PM PT" / "2:00 PM ET" / "2:00 PM CST"
  timeZone }          // region.timeZone
```
**Compose, don't duplicate:** names come from `getPersonas("real_estate", regionId)` vip1 + `realEstateUnitData` region overlay + `regionConfig` (city/currency/timeZone). The ONLY new literals allowed in this file: `email` (slugified `first.last@<project-slug>.com`, keep Gulf's existing `khalid.alrashid@vista.ae`... actually regenerate as `khalid.alrashid@alnoor-residences.com` for brand consistency), `vipId` (`KR-001` style: initials + `-001`), unit codes (Gulf `PH-4201` stays; others `PH-5501`).
**Never use:** Jane Doe / John Smith. Vancouver persona = whatever `getPersonas` returns (Marc Patel et al).

## WP-2 — Parametrize TR dict (the grunt work)
In `AIDemo.jsx` TR (en+ar): every literal `Khalid`, `Sky Penthouse`, `PH-4201`, `Al Noor Residences`, `AED 12,500,000`, `AED 8M–15M`, `Riyadh` becomes a `{name}`/`{unit}`/`{code}`/`{project}`/`{price}`/`{range}`/`{city}` placeholder. Add a 3-line helper:
```js
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
```
Call sites: `fill(t('canvaMeta'), vip)` etc. Same for `STEP_DESCS`, `TERMINAL_LINES` (make TERMINAL_LINES a function of `vip` — data-driven, not 4 copies), email modal, `buildVipEmailHtml` args, calendar event args, DocuSign recipient. **Grep proof after:** `grep -n "Khalid\|Al Noor\|AED\|PH-4201\|Riyadh" AIDemo.jsx` → 0 hits (all live in aiDemoData.js Gulf branch or come from config).
Wire `const vip = useMemo(() => getAiVip(regionId, lang), [regionId, lang])` — get `regionId` from `useRegion()` (already imported; currently only `region` destructured).

## WP-3 — Tracking bridge (Demo Tracking Rule compliance)
Import `trackPortalEvent` from `services/portalTrack`. Persona arg: `{ id: vip.vipId, name: vip.name }`. Map steps to EXISTING event taxonomy so Unified KPIs/feed light up without schema changes:

| Step | event | data |
|---|---|---|
| trigger | `portal_opened` | `{ source:'ai_demo', portal:'ai_pipeline' }` |
| canva | `download_brochure` | `{ source:'ai_demo', step:'proposal', unitName: vip.unitName }` |
| gmail | `contact_advisor` | `{ source:'ai_demo', channel:'email' }` |
| whatsapp (new) | `contact_advisor` | `{ source:'ai_demo', channel:'whatsapp' }` |
| calendar | `book_viewing` | `{ source:'ai_demo', unitName: vip.unitName }` |
| docusign | `lead_captured` | `{ source:'ai_demo', step:'nda' }` |
| crm (new) | — NOT tracked | internal sync, not a buyer action — do not pollute buyer analytics |

Fire at step completion (status→done), once per run (guard with a ref set). `book_viewing` intentionally drives the "Viewings Booked" KPI — that's the two-screen demo moment.

## WP-4 — Two new steps (STEP_CONFIG 4→6, renumber labels 1–6)
Order: trigger → canva → gmail → **whatsapp** → calendar → docusign → **crm**.
- **whatsapp** (color `whatsapp`, #25D366 accent): terminal lines (proposal link pushed via WhatsApp Business, delivery ✓✓). Result card: WhatsApp-style bubble with the invite text + a real `https://wa.me/?text=<urlencoded short invite>` link labeled "Open in WhatsApp ↗" (zero backend, genuinely real).
- **crm** (color `crm`, brand blue): terminal lines (lead upsert, activity timeline, deal stage → Viewing Scheduled). Result card: pretty-printed JSON payload `{ lead, score: 87, events: 6, deal: { stage: 'viewing_scheduled', value: vip.priceFmt } }` + caption "Salesforce · HubSpot · Zoho — any CRM with an API".
Counts: hero → `heroH1b: 'Seven actions. Zero manual work.'` (ar: `'سبعة إجراءات. بلا أي عمل يدوي.'`), stats `LIVE PLATFORMS` 4→6, steps complete x/7 (trigger dahil — mevcut sayım mantığı korunur). Home page + Enterprise page copy that says "Four platforms" / "Five actions" for this demo: update the 2 i18n strings (`aiTitle` in Home, enterprise demo card if present) — grep `"Five actions"\|"Four platforms"\|أربع منصات` across `src/`.

## WP-5 — Send-to-self (live mode upgrade)
In the Google connect card, when connected add one optional input: "Send results to (your email)" → state `recipientEmail`. If set: Gmail draft `to: recipientEmail`, calendar `attendeeEmail: recipientEmail`. Terminal line reflects actual recipient. If empty → current behavior. Basic email regex guard, no other validation.
New i18n keys (en): `recipientLabel: 'Send results to (optional — try your own inbox)'` (ar: `'أرسل النتائج إلى (اختياري — جرّب بريدك)'`).

## WP-6 — NDA → portal deep link + follow-up guard
- After docusign completes, add result-card button: `Open {firstName}'s portal — pricing unlocked →` linking `/enterprise/crmdemo/khalid?vip_pricing=unlocked`.
- `VIPPortal_Definitive.jsx`: read `useSearchParams`; if `vip_pricing === 'unlocked'`, render a slim gold banner under the hero: EN `'Exclusive pre-launch pricing unlocked — NDA signed'` / AR `'تم فتح أسعار ما قبل الإطلاق الحصرية — بعد توقيع اتفاقية السرية'`. Banner only — do NOT touch pricing logic. All 4 langs if the portal has es/fr blocks.
- Final section: static "scheduled action" card: EN `'Scheduled — if the NDA is unsigned within 24h, a reminder goes out automatically.'` AR `'مجدول — إذا لم تُوقَّع الاتفاقية خلال 24 ساعة، يُرسل تذكير تلقائيًا.'` (visual only, no timer code).

## WP-7 — Copy & footer fixes (this page's local TR dict)
1. `footNote`: `'…for real estate, automotive, and enterprise.'` → `'…for real estate, automotive, and yacht sales.'` (ar equivalent: `'…للعقارات والسيارات واليخوت.'`). Add `footYacht: 'Yacht Brokerage'` (ar `'وساطة اليخوت'`) linked to `/yacht/demo` in the Industries column.
2. `docStatusDemo`: `'Demo mode — configure DocuSign credentials'` → EN `'Sandbox envelope — your live DocuSign account connects during pilot setup'` / AR `'مغلف تجريبي — يُربط حساب DocuSign الفعلي أثناء إعداد البرنامج التجريبي'`.
3. Final section: add CTA button `'See it land in your dashboard →'` (ar `'شاهدها تصل إلى لوحتك ←'`) → `/unified/overview`.

## Out of scope (do NOT do)
ES/FR for AIDemo (Sprint G), AutoAIDemo/YachtAIDemo parity (separate sprint after this pattern settles), any `/admin/*`, `firebase.js`, App.jsx routes.

## Verify — "Bitti sayılır" requires ALL
1. `npm run build` PASS **and** `npm test` PASS (AIDemo tests import new module — update `AIDemo.security.test.jsx` mocks/providers; new `useSearchParams` in VIPPortal may need router wrapper in its tests if any).
2. Greps (all must be 0 hits): `Khalid|Al Noor|PH-4201|AED|Riyadh` in `AIDemo.jsx` · `configure DocuSign credentials` in `src/` · `Five actions` in `src/`.
3. Grep (must exist): `trackPortalEvent` ×6 in `AIDemo.jsx`.
4. Runtime QA (dev server, screenshot each): 4 regions × EN+AR — persona/project/price swap correctly (USA≠AED!), full pipeline 7/7, dark mode, 375px, wa.me link opens WhatsApp with prefilled text, `?vip_pricing=unlocked` banner on Khalid portal, and **Unified Overview feed shows the run's events** (rules artık deploy'lu — event'ler gerçekten düşecek).
5. Report must include commit hash(es). "FIXED" without hash = not done (QA Verification Protocol).

## Post-merge (Oguzhan)
`git pull` → `cd frontend && npm run build` → root'tan `firebase deploy --only hosting` → `.web.app` üzerinden "Seven actions" + region swap spot-check.

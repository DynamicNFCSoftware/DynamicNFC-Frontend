# SPRINT D — Yacht Demo Portals (Region-Aware Day One)

**Author:** Claude (Cowork) · 2026-07-03
**Executor:** Cursor
**Scope decision (Oguzhan-approved):** 4 demo routes only. Fleet data = 1:1 from `yachtSeed.js` (dashboard ↔ portal consistency). No `/yacht` public landing (separate sprint). No separate charter portal (charter lives inside VIP portal as a pricing toggle).
**Freshness:** All file references audited against `main` @ `8868571b` on 2026-07-03. If sprints landed since, re-audit before execute (April 20 lesson).

---

## 0. Goal

Ship `/yacht/demo`, `/yacht/demo/vip`, `/yacht/demo/showroom`, `/yacht/demo/ai` — all 4 regions × 4 languages, no auth, full Firestore tracking — mirroring the proven Automotive demo architecture. Unhide yacht portal links in Unified Dashboard sidebar.

**Reference implementations (copy the architecture, not blindly the code):**

| New file | Mirror of | Notes |
|---|---|---|
| `src/data/yachtVesselData.js` | `src/data/automotiveVehicleData.js` (259L) | factory + IMG map pattern |
| `src/hooks/usePortalYachts.js` | `src/hooks/usePortalVehicles.js` (20L) | near-identical |
| `src/pages/YachtDemo/YachtGateway.jsx/.css` | `pages/AutomotiveDemo/AutoGateway.jsx` | ⚠️ see §4 fake-metrics ban |
| `src/pages/YachtDemo/YachtVIPPortal.jsx/.css` | `pages/AutomotiveDemo/AutomotivePortal.jsx` (935L) | |
| `src/pages/YachtDemo/YachtShowroom.jsx/.css` | `pages/AutomotiveDemo/PublicShowroom.jsx` (548L) | |
| `src/pages/YachtDemo/YachtAIDemo.jsx/.css` | `pages/AutomotiveDemo/AutoAIDemo.jsx` (713L) | see §7 |

CSS prefixes (mandatory, per-page): `ygw-` Gateway · `yvp-` VIPPortal · `ysh-` Showroom · `yai-` AIDemo.

---

## 1. Data layer — `src/data/yachtVesselData.js`

Source of truth: the 32 yacht rows (4 regions × 8) in `src/services/seeds/yachtSeed.js` (`YA-GULF-001` … `YA-CAN-008`). Same IDs, names, types, marinas, prices, charterWeekly, highlight strings. **Do not invent a new fleet.** Dashboard and portals must show the same vessels.

Shape (mirror `automotiveVehicleData.js` factory style):

```javascript
// y(id, name, type, marina, price, charterWeekly, specs, imgKey)
export const YACHTS = {
  gulf:   [ y("YA-GULF-001", "Azimut Grande 35 Metri", "motor", "Dubai Marina", 38000000, 320000, {...}, "motor-flagship"), ... 8 ],
  usa:    [ ... 8 ],
  mexico: [ ... 8 ],
  canada: [ ... 8 ],
};
export const VIP_IDS = { gulf: [...5], usa: [...5], mexico: [...5], canada: [...5] };
```

- `specs`: parse the seed `highlight` string into `{ guests, cabins, feature }` (e.g. `"12 guests · 6 cabins · 28 knots"` → `{ guests: 12, cabins: 6, feature: { en: "28 knots", ar: "٢٨ عقدة", es: "28 nudos", fr: "28 nœuds" } }`). Day-boat rows (Grady-White, Intrepid) have no cabins — `cabins: 0`, portals render guests + feature only.
- `desc` `{en, ar, es, fr}` + `features` array (3 per yacht, each `{en, ar, es, fr}`): content comes from companion bundle `SPRINT_D_YACHT_DATA.md` (Claude-generated, same flow as Phase2c companions). **Do not write this content yourself** — consume the bundle.
- `VIP_IDS`: the 5 highest-priced vessels per region (flagship-heavy VIP curation); showroom shows all 8.
- Prices are already in regional currency in the seed (MXN values are large — correct). Always render via `fmtCurrency` from `usePortalRegion`. Never pre-format currency into data.

**Images:** no yacht assets exist in the repo. Do NOT import .jpg files. `IMG` map returns `null` for every key; card/detail components render a placeholder: CSS gradient + inline SVG hull silhouette chosen by `type` (`motor` / `sport` / `explorer` / `sportfish` / `superyacht` — 5 small inline SVGs, one shared component `YachtSilhouette({ type })` inside YachtDemo folder). When real assets arrive, only the IMG map changes.

`usePortalYachts(portal)`: copy `usePortalVehicles` — `"vip"` filters by `VIP_IDS[regionId]`, anything else returns all 8.

---

## 2. Personas & region context

Already exist — consume, don't create:

- `getPersonas("yacht", regionId)` → `vip1` (Owner: Prince Nasser Al-Saud / Richard Blackwell / Fernando Castillo / Robert MacKenzie), `vip2` (Charter: Sheikh Omar Al-Thani / Victoria Sinclair / Valentina Reyes / Catherine Leblanc).
- `usePortalRegion("yacht", lang)` → `projectName(lang)` (Gulf Marina Yachts / Pacific Coast Yachts / Marina del Caribe / Pacific Marina Yachts), `fmtCurrency`, `regionId`, `region`.
- VIP portal hero: `welcomeMale` / `welcomeFemale` keys driven by `persona.gender` (Phase 2b pattern — all yacht vip1 personas are currently male, but the key pair must still exist).
- Language cycle button: `LANG_LABEL` + `nextLang = region.languages.find(l => l !== lang) || region.languages[0]` — exactly AutomotivePortal L21/L321. Never 4 separate buttons.

---

## 3. Tracking (CRITICAL — Demo Tracking Rule)

Every interaction goes through `trackPortalEvent` from `services/portalTrack.js`. Wrapper per portal, exactly the AutomotivePortal L287-295 pattern:

```javascript
const trackEvent = useCallback(
  (event, data) => trackPortalEvent(
    "vip", // or "showroom"
    { id: `${regionId}-yacht-vip`, name: getPersonaName(vipPersona, lang) },
    event,
    { portal: "yacht", ...data }
  ),
  [regionId, vipPersona, lang]
);
```

Event actions — reuse canonical names (no new vocabulary): `portal_opened`, `marketplace_visit` (showroom mount), `view_unit` (yacht card open), `download_brochure`, `request_pricing`, `book_viewing` (sea-trial booking), `contact_advisor`, `language_switch`, `filter_units`, `comparison_view`, `lead_form_shown`, `lead_captured`, `cta_explore` / `cta_booking` / `cta_browse`. Pass `unitName: yacht.name`, `unitType: yacht.type`, `tower: yacht.marina` (matches yachtSeed event shape → dashboard renders without mapping changes).

No "demo only" skip flags. Anonymous showroom traffic must write (bridge handles `behaviors` dual-write).

---

## 4. YachtGateway — `/yacht/demo`

Mirror AutoGateway layout (badge / title / portal cards / how-it-works / footer), `ygw-` prefix, dark editorial luxury base with region tokens.

**⚠️ BRAND RULE — do not copy AutoGateway's stat block.** AutoGateway currently shows `47%`, `3.2×` — these violate the no-fake-metrics rule and must NOT propagate. Yacht gateway stats are qualitative: `Named` / `Real-Time` / `Zero Guesswork` (localized). (Separately flagged: AutoGateway itself needs the same fix — out of scope here, noted in §9.)

Portal cards (4):
1. **VIP Owner portal** — persona name from `getPersonas("yacht", regionId)` vip1, → `/yacht/demo/vip`
2. **Marina Showcase** (anonymous) — → `/yacht/demo/showroom`
3. **AI Concierge demo** — → `/yacht/demo/ai`
4. **Analytics** — → `/unified` (NOT a legacy-style yacht dashboard; yacht ships pointing at Unified from day one)

Full 4-language local LANG object, `useLanguage()` for lang state, SEO component included.

---

## 5. YachtVIPPortal — `/yacht/demo/vip`

`yvp-` prefix. Sections (mirror AutomotivePortal composition):

1. **Nav** — projectName(lang) logo text, lang cycle button, back-to-gateway link.
2. **Hero** — persona welcome (welcomeMale/Female), region-token accent, NFC-wave/particle ambient (respect `prefers-reduced-motion`).
3. **Fleet grid** — `usePortalYachts("vip")` (5 vessels), cards: silhouette placeholder, name, type badge, marina, `fmtCurrency(price)`, specs row (guests · cabins · feature). Card click → `view_unit` + detail modal.
4. **Detail modal** — tabs: Overview (desc + features) / Specifications (specs + marina) / **Ownership vs Charter** toggle: purchase price vs `fmtCurrency(charterWeekly)` + localized "/week" label. Toggle fires `explore_payment_plan`.
5. **CTAs** — "Book Private Sea Trial" (`book_viewing`), "Request Pricing" (`request_pricing`), "Download Specification" (`download_brochure`), "Contact Advisor" (`contact_advisor`).
6. **Compare** — reuse AutomotivePortal compare pattern if lift is small; if it inflates the file past ~1000L, drop compare (Code Simplicity — note the cut in PR description).

All copy through 4-language LANG object. Target ≤ ~900L (AutomotivePortal scale ceiling).

---

## 6. YachtShowroom — `/yacht/demo/showroom`

`ysh-` prefix. Mirror PublicShowroom: anonymous, all 8 vessels, type filter chips (All / Motor / Sport / Explorer / Sportfish / Superyacht — only render types present in the active region's fleet), `filter_units` on change, `marketplace_visit` on mount, progressive lead capture form (`lead_form_shown` / `lead_captured`), charter price visible on cards where `charterWeekly > 0`.

---

## 7. YachtAIDemo — `/yacht/demo/ai`

`yai-` prefix. Clone AutoAIDemo, re-skin scenario: NFC tap → AI concierge orchestrates a VIP **sea-trial** booking (email + calendar + agreement flow).

**Flexible-scope item:** inspect `pages/AutomotiveDemo/autoGoogleLiveApi.js` first. If the system prompt / scenario strings are embedded, parameterize minimally (export a factory or accept a config arg) rather than duplicating the module — Code Simplicity Mandate. If parameterization is invasive (>~30L churn), duplicate as `yachtGoogleLiveApi.js` and log it as debt in PR description. Your call — report which path you took.

---

## 8. Routing & sidebar

**`src/App.jsx`** (explicit approval given for this sprint) — after the automotive block (L196):

```jsx
const YachtGateway   = lazy(() => import("./pages/YachtDemo/YachtGateway"));
const YachtVIPPortal = lazy(() => import("./pages/YachtDemo/YachtVIPPortal"));
const YachtShowroom  = lazy(() => import("./pages/YachtDemo/YachtShowroom"));
const YachtAIDemo    = lazy(() => import("./pages/YachtDemo/YachtAIDemo"));
// routes:
<Route path="/yacht/demo" element={<P><YachtGateway /></P>} />
<Route path="/yacht/demo/vip" element={<P><YachtVIPPortal /></P>} />
<Route path="/yacht/demo/showroom" element={<P><YachtShowroom /></P>} />
<Route path="/yacht/demo/ai" element={<P><YachtAIDemo /></P>} />
```

**`pages/UnifiedDashboard/UnifiedLayout.jsx`** — `getPortalLinks`, replace the yacht `return []` (~L392) with:

```javascript
if (sectorId === "yacht") {
  const personas = getPersonas("yacht", regionId);
  return [
    { id: "yacht-vip",  label: personaLabel(personas.find((p) => p.id === "vip1")) || tx.portalYachtVip, kind: tx.portalVip, href: "/yacht/demo/vip" },
    { id: "yacht-anon", label: tx.portalYachtShowroom, kind: tx.portalAnonymous, href: "/yacht/demo/showroom" },
  ];
}
```

(i18n keys `portalYachtVip` / `portalYachtShowroom` already exist in all 4 tx blocks — do not add new keys.)

---

## 9. Out of scope (do not touch)

- `/yacht` public landing page (separate sprint)
- Charter persona portal (`vip2` stays dashboard/seed-only)
- Legacy dashboards, `/admin/*`, `App.jsx` beyond §8, `firebase.js`, seed files
- AutoGateway fake-metrics fix (`47%` / `3.2×`) — **separate 5-min chore PR**, flag it after this sprint

---

## 10. Verify steps (all mandatory before "done")

**Build & mechanical:**
1. `npm run build` PASS.
2. `grep -rn "47%\|3\.2" frontend/src/pages/YachtDemo/` → **0 results** (no fake metrics).
3. `grep -rn "margin-left\|margin-right\|padding-left\|padding-right" frontend/src/pages/YachtDemo/*.css` → **0 results** (logical properties only).
4. `grep -rln "trackPortalEvent" frontend/src/pages/YachtDemo/` → Gateway optional, VIP + Showroom + AIDemo **must** appear.
5. `grep -rn "\.jpg\|\.png\|\.webp" frontend/src/data/yachtVesselData.js` → **0 results** (no phantom asset imports).
6. Prefix audit: every class in each new .css starts with its page prefix.
7. No `console.log` in new frontend files.

**Runtime QA (npm run dev — Build PASS ≠ runtime safe):**

8. 4 regions × default lang, 3 pages each (gateway / vip / showroom) — screenshot, no ErrorBoundary.
9. Currency: Gulf `SAR …`, USA `$…`, Mexico `MX$…`, Canada `CA$…` on VIP cards AND charter "/week" line.
10. Lang cycle per region: Gulf EN↔AR (RTL flips correctly), USA EN↔ES, Mexico ES↔EN, Canada EN↔FR.
11. Fleet correctness: Gulf VIP shows Lürssen 85M + Benetti Oasis (flagship set), Canada shows Nordhavn explorers, region switch swaps fleet with no reload artifacts.
12. Two-tab tracking test: logged-in `/unified` (yacht sector) in tab 1, `/yacht/demo/vip` in tab 2 → click a yacht + book sea trial → events appear live in tab 1 AND land in Firestore (`behaviors` + `tenants/{uid}/events`).
13. Sidebar: Unified yacht sector now shows 2 portal links; RE/Auto links unchanged.
14. Responsive spot-check 375px: gateway + VIP fleet grid.

**Per QA_VERIFICATION_PROTOCOL:** Cursor "done" = hypothesis. Oguzhan runs scenario QA (steps 8-12 minimum) before merge.

---

## 11. Commit plan

Two atomic commits on branch `cursor/sprint-d-yacht-portals`:
1. `feat(yacht): vessel data layer + portal hooks (seed-derived, 4 regions × 8)` — data + hook + companion consumed
2. `feat(yacht): demo portals — gateway, VIP, showroom, AI (region-aware, 4 langs) + unified sidebar links + routes`

PR → Oguzhan review + QA → squash merge.

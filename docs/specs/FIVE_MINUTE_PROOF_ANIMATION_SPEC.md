# Five-Minute Proof — animation brief (for redesign)

**Owner:** NFC Software Systems Inc. (product brand: DynamicNFC) · **Written:** 2026-10-09
**Use:** give this whole file to the design / animation tool. Everything it needs is here.

---

## 1. What this is

A 5-step animated walkthrough shown at the top of the **Unified Dashboard → Overview** page of DynamicNFC, a B2B
"Sales Velocity Engine" for luxury real-estate developers, car dealerships and yacht brokerages.
Title: **"Five-Minute Proof — How DynamicNFC turns a tap into a closed deal."**
A sales rep or the founder plays it in a sales meeting. In five short scenes it must prove one idea:

> **Identity precedes Action.** A selected buyer receives a physical Premium Box with an NFC card (the **VIP Access Key**).
> The tap is the ultimate opt-in. From that moment the seller knows **who** the buyer is, sees **what** they look at,
> gets a **score**, gets an **alert** at the moment of peak intent, and **books the viewing** with full context.

Tone: quiet luxury, editorial, confident. Not playful, not "startup cartoon". Think private-bank invitation + Bloomberg terminal precision.

## 2. The five steps (story)

| # | Label | What the viewer must understand | On-screen text under the animation (EN) |
|---|---|---|---|
| 1 | Identity | Buyer receives the Premium Box, lifts the VIP Access Key, taps it on the phone. A name plate lights up: we now know who it is. | "{persona} receives a Premium Box. The tap on the VIP Access Key is the ultimate opt-in — identity is established before the buyer ever opens the experience." |
| 2 | Track | The buyer browses their private experience (e.g. floor plan, brochure, payment plan). Each action flows live into the seller's pipeline. | "Behavioral signals stream in real time. Floor plan views, brochure downloads, payment plan clicks — every action lands in your Pipeline before the buyer leaves the page." |
| 3 | Score | Each signal raises the buyer's Velocity score. The list re-orders: this buyer rises to the top as HOT, others stay WARM / COLD. | "Each signal updates {persona}'s Velocity score. Hot leads surface automatically. You are no longer guessing who to call first — the data tells you." |
| 4 | Alert | Score crosses a threshold → the sales rep's phone / dashboard gets an instant HOT LEAD alert with what the buyer just did. | "When {persona} crosses a threshold, your sales rep is notified instantly. Not at end of week. Not in tomorrow's digest. The moment intent peaks." |
| 5 | Close | The rep contacts the buyer with full context; a viewing / test drive / sea trial is booked. | "Your rep contacts {persona} with full context — what they viewed, what they downloaded, what they are ready for. The booked viewing follows. Decision speed compounds." |

`{persona}` = the VIP buyer name for the active region and sector (table in §5).

## 3. What exists today and what is wrong with it

Today: 5 static-ish SVG scenes, 480 × 240 viewBox, inside a white card with Back / Next / Finish buttons and 5 progress dots.
Only Step 1 is properly animated (7 s loop: box glow, card rises out of the box, NFC pulse rings, tap ripple, dashed line to a
name plate, "ACTIVE" pip). Steps 2–5 are simple diagrams with a generic pulse.

Problems to solve:
1. **Steps 2–5 are flat** compared with Step 1 — no story motion, they read as clip-art.
2. **Always real estate.** In the Automotive and Yacht dashboards it still shows a property buyer, "Penthouse 4B", floor plans.
   It must adapt to the **sector** (real estate / automotive / yacht).
3. **Hard-coded English and fake extras inside the drawings:** "VIEW · 2s ago", "HOT LEAD", "YOUR REP",
   "BOOKED · TOMORROW 14:00", calendar "MAY 07", other buyers "Sarah Chen", "Tom Lee", "viewed Penthouse 4B".
   All in-picture text must come from translations (5 languages) and the data in §5.
4. Step 1's name plate shows the project label "DEL LARIO · 2026" even in Yacht / Automotive.
5. Visual language differs between steps (Step 1 is rich dark-metal + gold; others are thin-line icons).

## 4. Visual system (must follow)

**Brand colours (do not change):**
Primary red `#e63946` · dark red `#c1121f` · brand blue `#457b9d` (primary) · light blue `#6ba3c7` ·
charcoal `#1a1a1f` · slate `#2d2d35` · cream `#faf8f5` · white `#ffffff`.
Premium Box: deep navy `#16243a → #0a1322` with linen texture and a champagne silk lining `#f5e8c8 → #c8ad7c`.
VIP Access Key card: brushed black metal `#2c2c33 → #08080c`, thin gold holographic strip, "DynamicNFC" wordmark in white, NFC wave glyph.

**Region accent** (one CSS variable `--fmp-accent`, already set on the card): Canada `#d52b1e`, Italy `#007a3d`,
USA `#1a365d`, Mexico `#c25e30`, Gulf `#b8860b`. Use it for highlights (score pill, lines, active states) — never hard-code it.

**Type:** headings Playfair Display; UI text Outfit; small technical labels a mono font (JetBrains Mono / GeistMono),
ALL-CAPS with letter-spacing for "editorial" labels. No font weight below 400.

**Card container:** light card (white / cream), 1px border, 3px left border in region accent, padding 24px,
illustration area 480 × 240 (scales to container width, keep 2:1). Dark-mode variant: charcoal `#1a1a1f` card, slate panels.

**Style:** quiet luxury. Thin precise lines, soft glows, small gold particles, generous negative space.
No emoji, no stock icons, no cartoon people. People are implied (hands, a phone, a name plate, an avatar circle with initials).

## 5. Data per region × sector

Persona = buyer shown in the story. Rep = seller. Item = what the buyer looks at. Action = what gets booked.

| Region (lang) | Real estate: project · persona · item | Automotive: dealer · persona · item | Yacht: brokerage · persona · item |
|---|---|---|---|
| Canada (EN/FR, CAD) | Vista Residences · Marc Patel · Harbour Penthouse 41A | Prestige Motors Vancouver · David Thompson · Porsche Taycan Turbo S | Pacific Marina Yachts · Robert MacKenzie · Nordhavn 86 |
| Italy (IT/EN, EUR) | Residenze del Lario · Alessandro Conti · Attico Lario 12A | Autosalone Brera Milano · Matteo Ferraro · Ferrari Purosangue | Riviera Ligure Yachts · Federico Marino · Azimut Grande 35 Metri |
| USA (EN/ES, USD) | Skyline Towers · James Mitchell · Madison Penthouse 52A | Premier Auto Group · Michael Torres · Porsche 911 Turbo S | Pacific Coast Yachts · Richard Blackwell · Westport 40M |
| Mexico (ES/EN, MXN) | Residencias del Sol · Carlos Rodriguez · Polanco Penthouse 18A | Autos Premiere · Alejandro Silva · BMW X7 M60i | Marina del Caribe · Fernando Castillo · Ferretti Custom Line 130 |
| Gulf (AR/EN, SAR, RTL) | Al Noor Residences · Khalid Al-Rashid · Sky Penthouse A | Prestige Motors · Khalid Al-Mansouri · Mercedes-AMG GT 63 S | Gulf Marina Yachts · Prince Nasser Al-Saud · Azimut Grande 35 Metri |

Sector vocabulary for the scenes:

| | Real estate | Automotive | Yacht |
|---|---|---|---|
| Step 2 signals | Floor plan · Brochure · Payment plan | Configuration · Brochure · Finance / lease plan | Specs & layout · Brochure · Charter / price |
| Step 4 alert line | "{persona} opened the payment plan" | "{persona} saved a configuration" | "{persona} requested a price" |
| Step 5 booking | Private viewing | Test drive | Sea trial |

The other two names in Step 3's ranking (warm / cold) must be the region's other personas from the same sector, not invented names.
All amounts/dates in the region's currency and locale (Intl), e.g. Italy `15/10/2026, 14:00`.

## 6. Scene-by-scene direction (target)

Each step is its own scene, **6–8 s loop**, eases `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `ease-out` for pulses.
Scenes cross-fade 200–300 ms when the user presses Next/Back. Keep Step 1 roughly as it is (it is the strongest) but apply §3.4.

1. **Identity (keep, refine).** Box on a soft floor shadow, lid open, warm glow. Card rises (0–1.8 s), tilts −4°.
   Phone or fingertip enters, tap at ~2 s → red tap dot + two ripples. A dashed line draws to an editorial name plate:
   PERSONA NAME (caps), role ("VIP INVESTOR" / "VIP COLLECTOR" / "VIP OWNER"), "CITY · COUNTRY", timestamp, a small "IDENTIFIED" pip blinking in region accent.
   Name plate label = sector project name, not always the real-estate one.
2. **Track.** Left: a phone showing the buyer's private page (sector item image as a simple vector silhouette — building /
   car / yacht). Three signal chips appear one by one (0.6 s apart) as the buyer "touches" them (Step 2 signals row in §5).
   Each chip flies along a curved line to the right into a **pipeline panel** and lands as a timeline row with a relative time
   ("now", "14 s", "2 min" — translated). Rows stack; the newest glows in region accent.
3. **Score.** A ranked list of three buyers with score pills. Each incoming signal (small dot entering from the left) bumps the
   persona's score (count-up animation, e.g. 54 → 68 → 82) and the row slides up to rank #1, pill turns region accent and
   the label changes WARM → HOT. A thin velocity gauge on the left fills to the HOT zone.
4. **Alert.** Threshold line flashes; a notification card slides in on the rep's phone / desktop: header "HOT LEAD" (translated),
   persona name, the alert line from §5, item name, "2 min ago" (translated). Subtle bell pulse. No sound.
5. **Close.** Rep (avatar with initials) and buyer (avatar with initials) connected by a line carrying three context chips
   (what they viewed / downloaded / requested). A calendar card flips to the booking date and time in the region's format,
   then a confirmation pill: "VIEWING BOOKED" / "TEST DRIVE BOOKED" / "SEA TRIAL BOOKED" (translated). One quiet gold
   confetti burst (max 8 particles), then hold.

## 7. Text that appears inside the drawings (must be translatable)

Provide every in-picture string as a key, never baked into the SVG. Minimum key set:
`roleVipInvestor, roleVipCollector, roleVipOwner, identified, signal.realEstate[3], signal.automotive[3], signal.yacht[3],
now, secondsAgo, minutesAgo, pipeline, velocity, hot, warm, cold, hotLead, alert.realEstate, alert.automotive, alert.yacht,
yourRep, booked.realEstate, booked.automotive, booked.yacht`.
Languages: English, Italian, French, Spanish, Arabic. Arabic is **right-to-left**: the whole scene mirrors
(flow goes right → left), text uses Noto Kufi Arabic. Brand terms stay English in all languages:
DynamicNFC, VIP Access Key, Premium Box, NFC, VIP, CRM, pipeline, lead.

## 8. Technical constraints (so the result can drop into the codebase)

- React 18 + plain JavaScript (JSX). **No TypeScript.** No new npm dependencies (no Lottie, no GSAP, no Framer Motion).
- Each step = one React component returning an inline `<svg viewBox="0 0 480 240">`; animation in **CSS keyframes** only.
- CSS class prefix `fmp-` (e.g. `fmp-s3-row`); colours through CSS variables (`--fmp-accent`, `--fmp-brand-red`,
  `--fmp-brand-blue`, `--fmp-text-primary`, `--fmp-text-muted`, `--fmp-surface`, `--fmp-border`).
- Props each step receives: `{ personaName, roleLabel, projectLabel, locationLabel, itemName, otherPersonas, sector, t }`
  where `t(key)` returns the translated string.
- All animations inside `@media (prefers-reduced-motion: no-preference)`; with reduced motion show the final frame, static.
- Must look right from 320 px to 1440 px wide (SVG scales; text never below ~9 px rendered). Use CSS logical properties.
- Gradient / pattern / filter ids unique per step (prefix `fmp-s{n}-`) so five SVGs can coexist.
- Accessibility: SVG `aria-hidden="true"`; the meaning is in the step text below the picture.
- No invented statistics or claims. Scores and times are illustrative UI values only.

## 9. Deliverables

1. Five step components (`Step1Identity.jsx` … `Step5Close.jsx`) + the CSS block for them.
2. The translation keys of §7 in all five languages (JS object `{ en, it, fr, es, ar }`).
3. A short note listing any prop or data the components need that is not in this brief.
4. Optional: one storyboard image per step (frame at the key moment) for review before code.

## 10. Acceptance check

- Italy × Yacht shows Federico Marino, Riviera Ligure Yachts, a yacht silhouette, "PROVA IN MARE PRENOTATA"-style booking, no English in the picture.
- Gulf × Automotive in Arabic is mirrored right-to-left and readable.
- Nothing hard-coded: no "Sarah Chen", "Tom Lee", "Penthouse 4B", "MAY 07", "YOUR REP".
- Reduced-motion users see clean static frames.
- Same visual richness in all five steps.

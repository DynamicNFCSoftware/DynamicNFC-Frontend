# CURSOR DIRECTIVE — Pricing goes sales-led: no Starter, no public prices, linked from the Home footer

**Branch:** `feat/pricing-sales-led`, cut from `main`. Independent of `feat/product-front-door` — no shared files.
**Type:** implementation
**Read first:** `CLAUDE.md` §1 (language rules) and §10 (Home i18n merge pattern), top entry of `CLAUDE_HANDOFF.md`
**Revised:** 2026-10-19 — Oguzhan's two decisions folded in (§1). Supersedes the 2026-10-17 version.

---

## 1. Goal

`/pricing` currently sells a product DynamicNFC does not sell. Its `seoDesc` reads *"Choose the right
plan for your digital business card needs"*, the first card is a $0 Starter whose only feature is
*"1 Digital Business Card"*, and Enterprise's feature list **opens** with *"Unlimited Digital Cards"* —
so the free giveaway leads the paid plan. The page is also an orphan: nothing in the app links to it.

**Oguzhan's decisions:**
- 2026-10-17 — free-card seekers are not a customer segment. Starter goes. Two plans remain, Pro and
  Enterprise. The digital business card is an *included* line item, never the headline. Sales-led.
- 2026-10-19 — **no public price on either plan.** Pro's $19 would anchor a luxury developer's
  expectations before a pilot conversation measured in thousands of euros a month. Both plans show
  "Custom" and "Talk to Sales". The monthly/annual toggle goes with the last number.
- 2026-10-19 — **link `/pricing` from the Home footer.** B2B buyers look for a pricing page before they
  make contact; without one the site reads as either hiding something or not serious. With no numbers on
  it, the page is a scope page — what each plan includes — and anchors nothing.

When this is done: two plans, no `$` anywhere on the page, no toggle, both CTAs to `/contact-sales`,
Enterprise highlighted, the card as the last *included* line of each list, copy that describes a Sales
Velocity Engine, and a Pricing link in the Home footer's Resources column.

**Copy + data + one footer link. No layout rebuild, no new components.**

---

## 2. Scope

**Touch:**
- `frontend/src/pages/Pricing/Pricing.jsx` (92L)
- `frontend/src/pages/Pricing/pricingTranslations.js` (178L — en, it, fr, es, ar)
- `frontend/src/pages/Pricing/Pricing.css` — deletions of dead rules + one colour rule, nothing else
- `frontend/src/pages/Home/Home.jsx` (977L — **Large File Protocol applies**) — one `<Link>`, two keys
- `frontend/src/pages/Home/homeTranslations.js` — one key in each of it / fr / es

**Do NOT touch:** `Login.jsx` (see §5), `Enterprise.jsx`, `ContactSales.jsx`, `Navbar.jsx`, any route,
`App.jsx`, any other page's copy.

---

## 3. Steps

### Step 1 — `Pricing.jsx`: the `PLANS` array

```js
// before
const PLANS = [
  { id: 'starter', name: 'Starter', price: { monthly: 0, annual: 0 }, ctaPath: '/login', highlight: false },
  { id: 'pro', name: 'Pro', price: { monthly: 19, annual: 15 }, ctaPath: '/login', highlight: true },
  { id: 'enterprise', name: 'Enterprise', price: { monthly: null, annual: null }, ctaPath: '/contact-sales', highlight: false },
];

// after
const PLANS = [
  { id: 'pro', name: 'Pro', ctaPath: '/contact-sales', highlight: false },
  { id: 'enterprise', name: 'Enterprise', ctaPath: '/contact-sales', highlight: true },
];
```

Four changes, each deliberate:
- Starter is gone.
- **`price` is gone from both.** Neither plan has a public number, so the field has nothing to hold.
- **Pro's `ctaPath` moves from `/login` to `/contact-sales`** — no plan on this page routes to self-serve.
- **`highlight` moves from Pro to Enterprise.** Enterprise is the product.

Also update the comment above `PLANS` — it currently says "Plan names (Starter, Pro, Enterprise) and
prices live in Pricing.jsx". It becomes: plan names and CTA targets live here; plan text lives in
`pricingTranslations.js`.

### Step 2 — `Pricing.jsx`: remove the toggle and the price branches

With no numeric price, the monthly/annual toggle has nothing to switch.

- Delete the whole `<div className="pr-toggle">…</div>` block from the hero.
- Delete `const [annual, setAnnual] = useState(true);`. If `useState` is then unused, drop it from the
  React import.
- The price block becomes one line, no ternary:

```jsx
<div className="pr-price">
  <span className="pr-price-custom">{t('custom')}</span>
</div>
```

### Step 3 — `Pricing.jsx` + `Pricing.css`: the checkmark colour

The feature-list `<svg>` hardcodes `stroke="#4ecdc4"`. That teal is not in the brand palette
(`CLAUDE.md` §4). Set the SVG to `stroke="currentColor"` and add one rule in `Pricing.css`:

```css
.pr-features li svg { color: #457b9d; }
```

If `Pricing.css` already defines a brand-blue custom property, use it instead of the literal.

### Step 4 — `Pricing.css`: delete what step 2 made dead

Delete these rules entirely. Nothing renders them after step 2.

- `.pr-toggle`, `.pr-toggle span`, `.pr-toggle span.active`, `.pr-toggle span em` (this one carries the
  second `#4ecdc4`), `.pr-toggle-btn`, `.pr-toggle-dot`, `.pr-toggle-dot.right` — currently lines 9–15
- `.pr-price-amount`, `.pr-price-period` — currently lines 25 and 27

Keep `.pr-price` and `.pr-price-custom`.

**Layout:** `.pr-plans` is already `display:flex; justify-content:center; flex-wrap:wrap`, so two cards
centre on their own. **Do not change it.** Verify at the four widths in §4; change it only if two cards
visibly misalign, and report the exact diff if you do.

### Step 5 — `pricingTranslations.js`: English copy (canonical)

Replace the English block's affected keys with exactly this. **EN is the source of truth for
positioning; do not reword it.**

```js
seoTitle: 'Pricing — DynamicNFC',
seoDesc: 'Sales intelligence for luxury real estate, automotive and yacht teams. Identity-first buyer data from the first tap.',
title: 'Pricing',
subtitle: 'Built for teams selling high-value assets. Every plan starts with a conversation.',
custom: 'Custom',
```

**Delete** `monthly`, `annual`, `save`, `perMonth`, `forever` — all five are dead after steps 1–2.

```js
plans: {
  pro: {
    desc: 'For individual agents and small teams who need to know who is actually interested.',
    features: [
      'VIP Access Keys for your buyer list',
      'Named buyer tracking — who, what, when',
      'Behavioral signals: floor plans, pricing, brochures',
      'Tap analytics and engagement timeline',
      'Up to 5 users',
      'Email support',
      'Digital business cards — included',
    ],
    cta: 'Talk to Sales',
  },
  enterprise: {
    desc: 'For developers, dealerships and brokerages running VIP campaigns at scale.',
    features: [
      'Everything in Pro',
      'Unified Dashboard — pipeline, priority VIPs, campaigns',
      'Premium Box campaigns with Private Invitations',
      'Private Buyer Experiences per prospect',
      'Multi-region and multi-language deployment',
      'Team management, roles and assignment',
      'CRM integration — sits on top of your existing system',
      'Custom branding and white-label',
      'Dedicated account manager, SLA and onboarding',
      'Digital business cards — included, unlimited',
    ],
    cta: 'Talk to Sales',
    badge: 'Most Popular',
  },
},
```

Rules this follows (`CLAUDE.md` §1): "VIP Access Key", "Premium Box", "Private Invitation", "Private
Buyer Experience" stay in English in every language. No invented metrics. The business card is the
**last** line of both lists, marked *included*.

FAQ — `faq2` and `faq4` describe a self-serve card product and are replaced; `faq1` and `faq3` are
reworded for an account-managed relationship:

```js
faq1q: 'Can we change plans later?',
faq1a: 'Yes. Your account manager adjusts the plan and it takes effect on the next billing cycle.',
faq2q: 'Can we run a pilot first?',
faq2a: 'Yes. Pilots run on one project or one showroom and are measured on booked viewings among VIP invitees versus a control group.',
faq3q: 'What payment methods do you accept?',
faq3a: 'All major credit cards, and wire transfer for Enterprise.',
faq4q: 'Do we need the physical NFC cards?',
faq4a: 'The physical tap is what makes the data trustworthy — it is the buyer opting in. QR codes and links work too, and digital business cards are included in every plan at no extra cost.',
```

### Step 6 — `pricingTranslations.js`: the other four languages

Translate the step-5 strings into `it`, `fr`, `es`, `ar`, keeping key sets identical across all five
(`npm test` runs `translationParity.test.js` and fails on drift between it / fr / es).

- Delete `plans.starter` and the five dead keys from every language.
- Brand terms stay English in every language.
- Arabic: Modern Standard Arabic, professional register.
- Italian: the existing Italian here reads as a literal translation. Do your best, then list the new
  Italian strings in the report — they join the pending native-Italian-review list, not final copy.

### Step 7 — Home footer: Pricing link

`Home.jsx` footer, **Resources** column. Insert between Live Demo and Contact Sales — browse the scope,
then make contact:

```jsx
<div className="hp-footer-col">
  <h5>{t('footResources')}</h5>
  <Link to="/enterprise/crmdemo">{t('footLiveDemo')}</Link>
  <Link to="/pricing">{t('footPricing')}</Link>
  <Link to="/contact-sales">{t('footContact')}</Link>
  <Link to="/login">{t('footLogin')}</Link>
</div>
```

Add `footPricing` next to `footContact` in each of the five places it already lives:

| File | Block | Value |
|---|---|---|
| `Home.jsx` | `en` (~line 155) | `'Pricing'` |
| `Home.jsx` | `ar` (~line 260) | `'الأسعار'` |
| `homeTranslations.js` | `it` (~line 151) | `'Prezzi'` |
| `homeTranslations.js` | `fr` (~line 283) | `'Tarifs'` |
| `homeTranslations.js` | `es` (~line 415) | `'Precios'` |

Arabic is hidden from the public site, but `Home.jsx`'s `ar` block carries every other `foot*` key, so
one more keeps that block internally consistent. Do not touch the merge loop
(`for (const l in HOME_TR_EXTRA) …`) — per `CLAUDE.md` §10, Home merges per language, never with
`Object.assign`.

---

## 4. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint          # 0 errors
npm test              # all pass, translationParity included
npm run build         # must pass

Get-ChildItem src\pages\Pricing -Recurse | Select-String -Pattern 'starter|forever|perMonth|annual|4ecdc4|pr-toggle|pr-price-amount|pr-price-period'

(Get-Content "src\pages\Home\Home.jsx").Length
Get-Content "src\pages\Home\Home.jsx" -Tail 40
```

The `Select-String` must return nothing. It is case-insensitive, so `annual` also catches Italian
`Annuale` etc. — every one of those keys is deleted, so any hit is a leftover. Do not add a `$` pattern:
`Pricing.jsx` has legitimate template literals (`` `pr-card${…}` ``). The price spans are caught by
`pr-price-amount`, and a stray `$` on screen is QA item 4. (`Get-ChildItem -Recurse` because PowerShell
does not expand `**` inside `-Path`.) `Home.jsx` should be 978 lines (+1 for the link; the two keys go on existing lines).

Manual QA, one line per item:

1. `/pricing`: two cards, centred, no empty third slot.
2. Enterprise carries the "Most Popular" badge and the primary button; Pro does not.
3. Both CTAs navigate to `/contact-sales`.
4. No `$` sign, no number in either price slot, no "Get Started Free", no "free trial", no toggle — in any language.
5. "Digital business cards" appears only as the last feature of each list, marked *included*.
6. Language switch EN → IT → FR → ES on `/pricing`: every string changes, no English left behind.
7. Checkmarks render in brand blue, not teal.
8. 375 / 768 / 1024 / 1440 px on `/pricing` — no overflow, cards readable.
9. Home footer, Resources column: Live Demo · **Pricing** · Contact Sales · Log in, in that order.
10. Home footer Pricing link in EN / IT / FR / ES: label changes, link goes to `/pricing`.

---

## 5. Do not

- No deploy.
- **No change to `Login.jsx`.** Decision 2026-10-19: self-serve registration **stays open** until the
  first paying client. A stranger who signs up sees only seeded demo data in an isolated tenant, the
  22-day retention cleans up abandoned ones, and the open door lets a prospect try the product during a
  demo. When it does close, note that deleting the email/password form is not enough —
  `signInWithPopup(GoogleAuthProvider)` creates a Firebase account on first sign-in. The real gate is a
  post-auth allowlist check. Not this PR.
- No billing or payment integration.
- No new dependencies, components, or layout rebuild.
- No `console.log`.
- No invented metrics or percentages in any copy (`CLAUDE.md` §1).
- No Pricing link anywhere except the Home footer — not the Navbar, not other pages' footers.

---

## 6. Report back

1. `npm run lint` / `npm test` / `npm run build` output.
2. The `Select-String` result (must be empty).
3. `Home.jsx` line count + last 40 lines.
4. Whether `.pr-plans` needed any change (expected: no).
5. The 10 manual QA lines — an unrun check is **NOT RUN**, never PASS.
6. The new Italian strings, listed, for the pending native review.

Per the mutual-audit rule, Claude audits this diff before anything is committed.

# CURSOR DIRECTIVE — Pricing goes sales-led: drop Starter, card becomes an included line item

**Branch:** `feat/pricing-sales-led` (independent of `feat/product-front-door` — no shared files)
**Type:** implementation
**Read first:** `CLAUDE.md` §1 (language rules), top entry of `CLAUDE_HANDOFF.md`

---

## 1. Goal

`/pricing` currently sells a product DynamicNFC does not sell. Its `seoDesc` reads *"Choose the right
plan for your digital business card needs"*, the first card is a $0 Starter whose only feature is
*"1 Digital Business Card"*, and Enterprise's feature list **opens** with *"Unlimited Digital Cards"* —
so the free giveaway leads the paid plan. Oguzhan's decision (2026-10-17): free-card seekers are not a
customer segment. The card is an included extra, never the headline.

When this is done: two plans (Pro, Enterprise), no $0 tier, no self-serve CTA on the page, the digital
business card appears as an *included* line item low in each feature list, and all page copy describes a
Sales Velocity Engine rather than a card service.

**This is a copy + data change. No layout rebuild, no new components.**

---

## 2. Scope

**Touch:**
- `frontend/src/pages/Pricing/Pricing.jsx` (92L)
- `frontend/src/pages/Pricing/pricingTranslations.js` (178L, 5 languages: en, it, fr, es, ar)
- `frontend/src/pages/Pricing/Pricing.css` — only the grid rule, only if 2 cards misalign (see step 4)

**Do NOT touch:** `Login.jsx` (the self-serve registration form stays for now — separate decision),
`Home.jsx`, `Enterprise.jsx`, `ContactSales.jsx`, any route, any other page's copy.

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
  { id: 'pro', name: 'Pro', price: { monthly: 19, annual: 15 }, ctaPath: '/contact-sales', highlight: false },
  { id: 'enterprise', name: 'Enterprise', price: { monthly: null, annual: null }, ctaPath: '/contact-sales', highlight: true },
];
```

Three changes, each deliberate:
- Starter is gone.
- **Pro's `ctaPath` moves from `/login` to `/contact-sales`** — sales-led means no plan on this page
  routes to self-serve signup.
- **`highlight` moves from Pro to Enterprise.** Enterprise is the product; it gets the "Most Popular"
  treatment and the primary button.

### Step 2 — `Pricing.jsx`: remove the dead $0 branch

With no zero-priced plan, this branch is unreachable:

```jsx
) : plan.price.monthly === 0 ? (
  <><span className="pr-price-amount">$0</span><span className="pr-price-period">{t('forever')}</span></>
```

Delete it. The ternary becomes `price.monthly === null ? custom : amount`. Also delete the now-unused
`forever` key from all five languages in `pricingTranslations.js`.

### Step 3 — `Pricing.jsx`: the checkmark colour

The feature-list `<svg>` hardcodes `stroke="#4ecdc4"`. That teal is not in the brand palette
(`CLAUDE.md` §4) and CSS variables must not be bypassed. Replace with `stroke="currentColor"` and set
the colour on `.pr-features li svg` in `Pricing.css` using the existing brand blue variable. One line
each; do not restyle anything else on the page.

### Step 4 — `Pricing.css`: two-card grid

Check `.pr-plans`. If it is `grid-template-columns: repeat(3, 1fr)` or similar, two cards will stretch
or sit off-centre. Fix with the minimum change — `repeat(auto-fit, minmax(280px, 1fr))` plus a
`max-width` + `margin-inline: auto` on the section, or whatever matches the file's existing approach.
**If the layout already centres correctly with two cards, change nothing and say so in the report.**
Verify at 375 / 768 / 1024 / 1440 px.

### Step 5 — `pricingTranslations.js`: English copy (canonical)

Replace the English block's affected keys with exactly this. **EN is the source of truth for
positioning; do not reword it.**

```js
seoTitle: 'Pricing — DynamicNFC',
seoDesc: 'Sales intelligence for luxury real estate, automotive and yacht teams. Identity-first buyer data from the first tap.',
title: 'Pricing',
subtitle: 'Built for teams selling high-value assets. Every plan starts with a conversation.',
```

Delete `forever`. Keep `monthly`, `annual`, `save`, `custom`, `perMonth`.

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

Note the rules this follows (`CLAUDE.md` §1): "VIP Access Key", "Premium Box", "Private Invitation",
"Private Buyer Experience" stay in English in all five languages. No invented metrics. The business
card is the **last** line of both lists, marked *included*.

FAQ — `faq2` and `faq4` currently describe a self-serve card product and must be replaced:

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

### Step 6 — the other four languages

Translate the step-5 strings into `it`, `fr`, `es`, `ar` in the same file, keeping the key sets
identical (`npm test` runs `translationParity.test.js` and will fail on drift).

- Brand terms stay English in every language, per `CLAUDE.md` §1.
- Arabic is Modern Standard Arabic, professional register.
- **Italian:** the existing Italian on this page is a literal translation. Do your best, then add one
  line to the report listing the new Italian strings — they go on the pending native-Italian-review
  list, they do not ship as final.
- `plans.starter` is deleted from all five languages.

---

## 4. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint          # 0 errors
npm test              # all pass, translationParity included
npm run build         # must pass

Select-String -Path "src\pages\Pricing\*" -Pattern "starter|forever|4ecdc4" 
```

The `Select-String` must return nothing.

Manual QA on `/pricing`, one line per item:

1. Two cards render, centred, no stretched or empty third column.
2. Enterprise carries the "Most Popular" badge and the primary button; Pro does not.
3. Both CTAs navigate to `/contact-sales`.
4. No `$0`, no "Get Started Free", no "free trial" anywhere on the page, in any language.
5. "Digital business card" appears only as the last feature of each list, marked *included*.
6. Monthly/annual toggle still changes Pro's price ($19 / $15); Enterprise still shows "Custom".
7. Language switch EN → IT → FR → ES: every string changes, no English left behind.
8. 375 / 768 / 1024 / 1440 px — no overflow, cards readable.
9. Checkmarks render in brand blue, not teal, in light and dark.

---

## 5. Do not

- No deploy.
- **No change to `Login.jsx`.** Whether self-serve registration stays is a separate decision; this PR
  only stops `/pricing` from routing to it.
- No billing or payment integration.
- No new dependencies, no new components, no layout rebuild.
- No `console.log`.
- No invented metrics or percentages in any copy (`CLAUDE.md` §1).
- Do not add a `/pricing` link to any navigation — see the open question in §6.

---

## 6. Report back

1. `npm run lint` / `npm test` / `npm run build` output.
2. The `Select-String` result (must be empty).
3. Whether step 4 required a CSS change, and if so the exact diff.
4. The 9 manual QA lines — an unrun check is **NOT RUN**, never PASS.
5. The new Italian strings, listed, for the pending native review.

**Flag for Oguzhan, do not act on it:** nothing in the app links to `/pricing`. A repo-wide search finds
only the route in `App.jsx` and an exclusion in `EmailCapture.jsx` — not the Navbar, not the Home footer,
not Enterprise. The page is reachable only by typing the URL. Whether a sales-led model wants it linked
(Home footer) or left unlinked is Oguzhan's call.

Per the mutual-audit rule, Claude audits this diff before anything is committed.

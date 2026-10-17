# CURSOR DIRECTIVE — Home page defect pass (2026-10-16)

**Branch:** `fix/home-audit-2026-10-16`
**Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`

## 1. Goal

The public Home page (`frontend/src/pages/Home/`) has six defects that do not need a copywriting
decision: one dead link, one duplicated link, a factually wrong platform count sitting in the
translation files, a gendered sentence that breaks for female personas, an unverified legal claim,
and an English-only page title + meta description served to Italian, French and Spanish visitors.

When this is done: no card on the page has a link that goes nowhere or repeats itself, no string in
`Home.jsx` / `homeTranslations.js` claims "six platforms" when four are shown, the VIP button reads
correctly whatever the active persona's gender, the privacy FAQ describes the mechanism instead of
asserting legal compliance, and `it` / `fr` / `es` visitors get a localized `<title>` and
`<meta name="description">`.

**Out of scope on purpose:** all copy rewriting (Italian anglicisms, hero sub-sentence, section
naming) and all decisions about unrendered copy. Those wait for Oguzhan's page brief — see §7.

## 2. Scope

Touch only:
- `frontend/src/pages/Home/Home.jsx`
- `frontend/src/pages/Home/homeTranslations.js`

Must NOT be touched:
- `frontend/src/pages/Home/Home.css` — no styling change in this PR
- `frontend/src/i18n/pages/home.js` — stale side-effect module, leave it exactly as it is
- `frontend/src/App.jsx` — no routing change
- `frontend/src/config/regionConfig.js`
- `CLAUDE.md`, `CLAUDE_HANDOFF.md`
- `.cursorrules`, `.cursor/rules/*.mdc`

## 3. Steps

### Step 1 — Industries cards: one CTA per card, no dead link

`Home.jsx`, `IndustriesSection`. Today the `ind2` entry (Enterprise NFC Cards) has no `demo`
property, so it renders `<Link to={undefined}>` and the "Try demo →" link resolves to the current
URL. The `ind4` entry (Yacht) has `nav` and `demo` both set to `/yacht/demo`, so the card body and
the demo link lead to the same place.

1a. In the `IndustriesSection` array, remove `demo: '/yacht/demo'` from the `ind4` entry. Keep
`nav: '/yacht/demo'` (there is no `/yacht` landing page yet).

The array must end up as:

```jsx
{ k: 'ind1', icon: ICONS.building, c: 'blue', nav: '/developers', demo: '/enterprise/crmdemo' },
{ k: 'ind3', icon: ICONS.car, c: 'red', nav: '/automotive', demo: '/automotive/demo' },
{ k: 'ind4', icon: ICONS.anchor, c: 'teal', nav: '/yacht/demo' },
{ k: 'ind2', icon: ICONS.card, c: 'gold', nav: '/nfc-cards', wide: true },
```

1b. Render the demo link only when the card has one. Replace the existing `<Link ... hp-ind-demo-link>`
block with:

```jsx
{ind.demo && (
  <Link to={ind.demo} className="hp-ind-demo-link" onClick={(e) => e.stopPropagation()}>
    {t('indDemoLink')}
  </Link>
)}
```

Do not add a fallback URL, and do not introduce a per-card variant of the link. One conditional
covers both cards.

### Step 2 — "Six platforms" → "Four platforms" (5 languages)

The pipeline renders exactly four cards: Canva, Gmail, Calendar, DocuSign. `aiTitle` and `aiSub`
claim six. **These two keys are currently not rendered anywhere**, so this step changes no pixels —
it stops a false claim from shipping the day someone renders that heading. Change the strings only;
do not add, delete or render any key.

`Home.jsx` → `TR.en`:
```javascript
aiTitle: 'Four platforms. Zero manual work.',
aiSub: 'A VIP taps their NFC card. In under a minute, these four things happen without anyone lifting a finger.',
```

`Home.jsx` → `TR.ar`:
```javascript
aiTitle: 'أربع منصات. بلا أي عمل يدوي.',
aiSub: 'عميل VIP ينقر بطاقة NFC. خلال أقل من دقيقة، هذه الأشياء الأربعة تحدث بدون أن يرفع أحد إصبعه.',
```

`homeTranslations.js` → `it`:
```javascript
aiTitle: 'Quattro piattaforme. Zero lavoro manuale.',
aiSub: 'Un VIP avvicina la sua card NFC. In meno di un minuto accadono queste quattro cose, senza che nessuno muova un dito.',
```

`homeTranslations.js` → `fr`:
```javascript
aiTitle: 'Quatre plateformes. Zéro travail manuel.',
aiSub: 'Un VIP approche sa carte NFC. En moins d\'une minute, ces quatre choses se produisent sans que personne ne lève le petit doigt.',
```

`homeTranslations.js` → `es`:
```javascript
aiTitle: 'Cuatro plataformas. Cero trabajo manual.',
aiSub: 'Un VIP acerca su tarjeta NFC. En menos de un minuto ocurren estas cuatro cosas sin que nadie mueva un dedo.',
```

### Step 3 — `cardCta` must not assume the persona is male

`vipName` comes from `getPersonas('real_estate', regionId)[0].name`. Personas carry a `gender` field
and several are female, so "when **he** taps" / "lorsqu'**il** approche" is wrong by construction.
Fix by removing the pronoun — do **not** add a gender branch or a second translation key.

- `Home.jsx` → `TR.en`: `cardCta: 'See what {name} sees after the tap →',`
- `Home.jsx` → `TR.ar`: `cardCta: 'شاهد ما يراه {name} بعد النقر →',`
  (the Arabic string currently hardcodes خالد; the `{name}` placeholder is what `t()` substitutes)
- `homeTranslations.js` → `fr`: `cardCta: 'Voyez ce que {name} voit après le tap →',`
- `it` and `es` are already pronoun-free — **leave them unchanged**.

### Step 4 — Privacy FAQ: describe the mechanism, drop the compliance assertion

"Yes. / Sì. / Oui. / Sí." to "Is this compliant with privacy laws?" is a legal claim that has not
been reviewed by a lawyer. Replace question and answer with wording that states only what the
product does, reusing the PIPEDA phrasing already live in the `ca2d` card.

`Home.jsx` → `TR.en`:
```javascript
faq2q: 'How do you handle privacy and consent?',
faq2a: 'The physical NFC tap is the opt-in: consent is explicit, invitations are intentional, and access is controlled. The product is designed around PIPEDA principles and customer data is stored in Canada (Montréal).',
```

`Home.jsx` → `TR.ar`:
```javascript
faq2q: 'كيف تتعاملون مع الخصوصية والموافقة؟',
faq2a: 'النقر الفعلي على بطاقة NFC هو الموافقة: موافقة صريحة، دعوات مقصودة، ووصول مضبوط. المنتج مصمَّم وفق مبادئ PIPEDA وتُخزَّن بيانات العملاء في كندا (مونتريال).',
```

`homeTranslations.js` → `it`:
```javascript
faq2q: 'Come gestite privacy e consenso?',
faq2a: 'Il tap fisico della card NFC è l\'opt-in: il consenso è esplicito, gli inviti sono intenzionali e l\'accesso è controllato. Il prodotto è progettato secondo i principi PIPEDA e i dati dei clienti sono conservati in Canada (Montréal).',
```

`homeTranslations.js` → `fr`:
```javascript
faq2q: 'Comment gérez-vous la confidentialité et le consentement ?',
faq2a: 'Le tap physique de la carte NFC est l\'opt-in : le consentement est explicite, les invitations sont intentionnelles et l\'accès est contrôlé. Le produit est conçu selon les principes de la LPRPDE (PIPEDA) et les données clients sont stockées au Canada (Montréal).',
```

`homeTranslations.js` → `es`:
```javascript
faq2q: '¿Cómo gestionan la privacidad y el consentimiento?',
faq2a: 'El tap físico de la tarjeta NFC es el opt-in: el consentimiento es explícito, las invitaciones son intencionales y el acceso está controlado. El producto está diseñado según los principios de PIPEDA y los datos de los clientes se almacenan en Canadá (Montreal).',
```

### Step 5 — Localized `<title>` and `<meta name="description">`

`Home.jsx` currently renders `<SEO title="Home" description="DynamicNFC — Turn anonymous traffic
into named buyers with NFC-powered private portals." path="/" />` — hardcoded English for every
language. `SEO.jsx` renders `title` as `` `${title} | DynamicNFC` ``, so the new key holds the page
title **without** the brand suffix.

5a. Add two keys per language in `homeTranslations.js`. The parity test compares `it` / `fr` / `es`,
so all three must get both keys. Arabic is hidden from the public site and intentionally gets none
(it falls back to `en` through `t()`).

`en`:
```javascript
seoTitle: 'NFC cards that name your buyers',
seoDesc: 'One tap turns an anonymous visitor into a named buyer — and tells your sales team who is interested, in what, and when. Built in Vancouver, Canada.',
```

`it`:
```javascript
seoTitle: 'Card NFC che danno un nome ai tuoi acquirenti',
seoDesc: 'Un tap trasforma un visitatore anonimo in un acquirente con un nome e dice al tuo team chi è interessato, a cosa e quando. Sviluppato a Vancouver, Canada.',
```

`fr`:
```javascript
seoTitle: 'Des cartes NFC qui nomment vos acheteurs',
seoDesc: 'Un tap transforme un visiteur anonyme en acheteur identifié et indique à votre équipe qui s\'intéresse à quoi, et quand. Conçu à Vancouver, Canada.',
```

`es`:
```javascript
seoTitle: 'Tarjetas NFC que ponen nombre a tus compradores',
seoDesc: 'Un tap convierte a un visitante anónimo en un comprador con nombre y le dice a tu equipo quién se interesa, en qué y cuándo. Hecho en Vancouver, Canadá.',
```

5b. In `Home.jsx`, use them:
```jsx
<SEO title={t('seoTitle')} description={t('seoDesc')} path="/" />
```

Do not change `SEO.jsx`. Do not add `hreflang` tags in this PR.

## 4. Verify

PowerShell, from the repo:

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint
npm test
npm run build
```

- `npm run lint` → 0 errors.
- `npm test` → all suites pass. `src/i18n/__tests__/translationParity.test.js` must pass: it fails if
  `seoTitle` / `seoDesc` are missing from any of `it` / `fr` / `es`.
- `npm run build` → completes, no syntax error.

Large File Protocol — `Home.jsx` is over 500 lines:

```powershell
(Get-Content "C:\Users\oguzh\DynamicNFC\frontend\src\pages\Home\Home.jsx").Length
Get-Content "C:\Users\oguzh\DynamicNFC\frontend\src\pages\Home\Home.jsx" -Tail 40
```

Expect ~975–980 lines and a clean closing (`</div>` → `);` → `}`).

Manual check with `npm run dev`, on `/`:

1. **Industries section** — the Enterprise NFC Cards card shows no "Try demo →" link; the Yacht card
   shows no "Try demo →" link; Real Estate and Automotive cards still show theirs and open
   `/enterprise/crmdemo` and `/automotive/demo`. Clicking a card body still navigates.
2. **Hero button** — reads "See what Marc Patel sees after the tap →" on Canada, and the Italian
   name on Italy; no "he".
3. **FAQ** — second question in the left column is the new privacy question in all four languages.
4. **Page title** — switch EN → IT → FR → ES in the Navbar dropdown; the browser tab title and
   `document.querySelector('meta[name="description"]').content` change each time.
5. **375 px** — Industries grid and FAQ still lay out correctly; no horizontal scroll.

## 5. Do not

- No deploy. Hosting deploys are `npm run deploy`, run by Oguzhan only.
- No unrelated refactors — in particular do **not** delete the unrendered keys listed in §7, do not
  split `Home.jsx`, and do not clean up `i18n/pages/home.js`.
- No new dependencies.
- No `console.log` left behind. No `href="#"`.
- No new translation keys beyond `seoTitle` and `seoDesc`.
- Keep every edit a string or expression swap. If a step looks like it needs a new component, stop
  and report instead.

## 6. Report back

Paste to Oguzhan:

1. The diff summary (files + line counts).
2. Full output of `npm run lint`, `npm test`, `npm run build`.
3. The `Home.jsx` line count and tail output.
4. Results of manual checks 1–5 above, one line each: PASS / FAIL / NOT RUN. An unrun check is
   **NOT RUN**, never PASS.
5. Anything in §3 you could not do exactly as written, and why.

Nothing is committed until Claude has audited this report (mutual audit rule, 2026-10-07).

## 7. Deliberately left for Oguzhan's page brief — do not touch

Found in the audit, **not** in this directive because each needs a copy or product decision:

- **Unrendered copy still in the files:** `stat1v`–`stat4ctx` (the "Named / Intent / Real-Time /
  Zero" strip, 12 keys), `testimonialLabel` + `testimonialQuote` ("Imagine this Monday"), `demoCta`,
  `footEnterprise`, `footRe`, `heroLine3`, and `aiTitle` + `aiSub` after step 2. Decision: render or
  delete. Until then they stay.
- **Italian anglicisms:** `badge` ('Sales Velocity Engine'), `trust1` ('Made in Canada'), `footRe`
  ('Real Estate'), plus `Premium Box`, `Sales Intelligence`, `Automotive`, `Test Drive`, `Yacht
  Brokerage`, `Charter`, `Lead Capture`, `Analytics`, `Powered by`, `Privacy by design`, and "card"
  used for "tessera/carta". French and Spanish keep `tap`, `pipeline`, `dashboard`, `showroom`,
  `penthouse`, `Premium Box`, `Charter`, `NDA`.
- **Hero sub-sentence** reads as a literal translation in `it` ("per nome, per interesse, per
  intenzione") and `fr` ("par nom, par intérêt, par intention").
- **Yacht card** opens the demo because `/yacht` does not exist, while its CTA says "Yacht
  Solutions →". Relabel, or build the `/yacht` landing page.
- **`demoYacht`** is the only sector card whose title carries the word "Demo".
- **Privacy wording (step 4)** still needs lawyer sign-off, as does "run by our Canadian company" in
  the Italy section.
- **Arabic is unreachable** — `SUPPORTED_LANGS` in `i18n/LanguageContext.jsx` is `['en','it','fr','es']`
  and a stored `ar` value is rejected, so no visitor can reach Arabic. Its stale strings (`trust3`
  still "Gulf pilots", `aiCard1ex` still "Gulf luxury design", missing `na*` + `itPill` keys) are
  dormant, not live bugs. The Arabic edits in steps 2–4 are included only to keep the files honest.
- **`CLAUDE.md` drift** spotted while auditing: §6 lists the Yacht demo routes as PLANNED, but
  `/yacht/demo`, `/yacht/demo/vip`, `/yacht/demo/showroom` and `/yacht/demo/ai` are live in
  `App.jsx`; §10 still describes Arabic in the public Navbar dropdown.

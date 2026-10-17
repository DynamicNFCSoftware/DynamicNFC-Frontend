# CURSOR DIRECTIVE — /yacht landing page (2026-10-17)

**Branch:** `feat/yacht-landing` — branch off `main` **after** `fix/privacy-wording-2026-10-17` has merged,
so the privacy answer below matches the one already live on Home.
**Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`, and `frontend/src/pages/Automotive/Automotive.jsx`
+ `Automotive.css` as the structural model.

## 1. Goal

Yacht is the only sector without a landing page. The Home "Industries" card promises "Yacht
Solutions →" and drops the visitor straight into the demo. Build `/yacht` as a real sector page,
then point the Home card and footer at it.

This page is deliberately leaner than `/automotive` (six sections, not twelve) — it closes the gap
while yacht is not yet the active pitch. Copy is approved and final; translate nothing, invent
nothing, add no section that is not listed here.

## 2. Scope

Create:
- `frontend/src/pages/Yacht/Yacht.jsx`
- `frontend/src/pages/Yacht/yachtTranslations.js`
- `frontend/src/pages/Yacht/Yacht.css`

Edit:
- `frontend/src/App.jsx` — lazy import + one route
- `frontend/src/pages/Home/Home.jsx` — `ind4` destination + footer link

Must NOT be touched: `Automotive.*` (model only, never imported), `frontend/src/pages/YachtDemo/*`,
`Home.css`, `index.html`, `CLAUDE.md`, `.cursorrules`.

## 3. Architecture rules for this page

- **CSS scope `.yc-page`, prefix `yc-`.** New namespace; it is not in the `CLAUDE.md` §10 list yet.
  Self-contained file — do not import `Automotive.css` or any other page's CSS.
- **Design mode: editorial light**, same family as `/automotive` and `/developers`. Brand tokens
  only (`#457b9d` brand blue, `#e63946` red, cream `#faf8f5`). Never hardcode a region's palette.
- **No region or sector hooks.** This page carries no persona names and no currency, so it needs
  neither `useRegion()` nor `useSector()`. Do not add them, and do not hardcode a persona name —
  `Automotive.jsx` has a hardcoded Gulf name (`Omar Al-Khalili`); do not copy that pattern.
- **Translations follow the live public pattern:** `TR = { en: {...} }` inside `Yacht.jsx`, then
  `Object.assign(TR, YACHT_TR_EXTRA)` where `YACHT_TR_EXTRA` holds full `it` / `fr` / `es` sets in
  `yachtTranslations.js`. `const t = (k) => TR[lang]?.[k] ?? TR.en[k] ?? k;`
- **Arabic is intentionally omitted.** It is hidden from the public site (`SUPPORTED_LANGS` in
  `i18n/LanguageContext.jsx` is `['en','it','fr','es']`), so an Arabic set would be dead weight.
  Put a one-line comment in `Yacht.jsx` saying so. The parity test only compares it/fr/es, so this
  passes.
- **Brand terms stay in English in every language** — `VIP Access Key`, `Private Buyer Experience`,
  `Premium Box`. That is the `CLAUDE.md` §1 language rule, not an oversight.
- Section components defined as `{SectionName()}` in render, not `<SectionName />`.
- Reveal animation: `.yc-reveal` + `IntersectionObserver`, wrapped in
  `@media (prefers-reduced-motion: no-preference)`, with the instant-reveal fallback
  `Home.jsx` uses.
- No `console.log`. No `href="#"`. All text through `t()`.

## 4. Page structure — six sections, in this order

1. `<SEO title={t('seoTitle')} description={t('seoDesc')} path="/yacht" />`
2. **Hero** — badge, h1, sub paragraph, two buttons: primary → `/yacht/demo`, secondary → `/contact-sales`
3. **Blind spot** — label, h2, one paragraph
4. **How it works** — label, h2, four numbered steps (icon + title + description)
5. **What you see** — label, h2, three cards (title + description)
6. **Live demo** — label, h2, sub, two cards linking to `/yacht/demo/vip` and `/yacht/demo/showroom`,
   plus one button → `/yacht/demo`
7. **FAQ** — four items, accordion, same behaviour as the Home FAQ (`aria-expanded`, `aria-controls`)
8. **Closing CTA** — h2, sub, two buttons: primary → `/contact-sales`, secondary → `/yacht/demo`

(Numbering above counts SEO as a non-visual item; the page has six visible sections plus FAQ and CTA.)

## 5. Copy — final, do not edit

### EN — in `Yacht.jsx`, `TR.en`

```javascript
seoTitle: 'NFC VIP access keys for yacht brokerages',
seoDesc: 'Know which client is serious before you arrange the sea trial — one tap tells your brokers who is interested, in which yacht, and when. Built in Vancouver, Canada.',

heroBadge: 'Yacht Brokerage',
heroTitle: 'Know who is serious before the sea trial.',
heroSub: 'A VIP Access Key opens a private buyer experience for the owner or charter client you invited — and tells you which yacht they studied, how long, and when they came back.',
heroCtaDemo: 'Launch the yacht demo',
heroCtaWalk: 'Book a walkthrough',

probLabel: 'The blind spot',
probTitle: 'Listing portals send you strangers.',
probBody: 'An enquiry from a listing portal gives you a name, an email, and nothing else. You cannot tell the client who is ready to move from the one collecting brochures — not until someone has spent a day on the water. Every sea trial arranged for the wrong person is a day your broker did not spend on the right one.',

howLabel: 'How it works',
howTitle: 'From Private Invitation to booked sea trial.',
step1t: 'Select the client',
step1d: 'Your brokers pick the owners and charter clients worth a personal invitation.',
step2t: 'Send the Private Invitation',
step2d: 'A Premium Box arrives with a VIP Access Key and a note from the broker who signed it.',
step3t: 'One tap opens their experience',
step3d: 'Their private buyer experience: the fleet you chose for them, specifications, cruising range, berth and charter availability.',
step4t: 'You see the intent',
step4d: 'Which yacht they opened, which deck plan they returned to, when they asked for pricing. Your broker calls knowing all of it.',

seeLabel: 'What you see',
seeTitle: 'What a tap tells you.',
see1t: 'Named, not anonymous',
see1d: 'Every tap belongs to a client you invited. No anonymous traffic to guess at.',
see2t: 'Intent, not clicks',
see2d: 'Time spent on a specification, repeat visits to one yacht, a brochure opened twice. The signals that separate a buyer from a browser.',
see3t: 'Real-time, not weekly',
see3d: 'The broker hears the moment a client re-opens a listing, not in Monday\'s report.',

demoLabel: 'Live demo',
demoTitle: 'See it from the client\'s side.',
demoSub: 'Two doors into the same system.',
demo1t: 'VIP Owner Portal',
demo1d: 'What an invited owner sees after the tap.',
demo2t: 'Fleet Showroom',
demo2d: 'The browsable fleet, with every interaction recorded.',
demoCta: 'Open the full demo',

faqTitle: 'FAQ',
faq1q: 'Is this replacing our CRM?',
faq1a: 'No. DynamicNFC sits on top of your existing CRM and enhances it with behavioral intelligence from VIP portals.',
faq2q: 'How do you handle privacy and consent?',
faq2a: 'The physical NFC tap is the opt-in: consent is explicit, invitations are intentional, and access is controlled. The product is designed around PIPEDA principles. Demo data is stored in Canada (Montréal); in a live deployment, data will be stored in the region where it is used, under that region\'s laws.',
faq3q: 'What does a pilot look like?',
faq3a: '90 days from the first Premium Box. Includes the private buyer experiences, card production, and a full review of what the data showed.',
faq4q: 'Do clients need an app?',
faq4a: 'No. A tap or a QR scan opens the experience in the phone\'s browser — no downloads.',

ctaTitle: 'See it work with your own fleet.',
ctaSub: 'We\'ll walk your brokers through it using your listings. No pitch deck.',
ctaPrimary: 'Book a walkthrough',
ctaSecondary: 'Launch the yacht demo',
```

### IT — in `yachtTranslations.js`, `it`

```javascript
seoTitle: 'VIP Access Key NFC per i broker di yacht',
seoDesc: 'Scopri chi fa sul serio prima di organizzare la prova in mare: un tap dice ai tuoi broker chi è interessato, a quale yacht e quando. Sviluppato a Vancouver, Canada.',

heroBadge: 'Brokeraggio di yacht',
heroTitle: 'Sai chi fa sul serio prima della prova in mare.',
heroSub: 'Una VIP Access Key apre una Private Buyer Experience per l\'armatore o il cliente charter che hai invitato — e ti dice quale yacht ha studiato, per quanto tempo e quando è tornato.',
heroCtaDemo: 'Avvia la demo yacht',
heroCtaWalk: 'Prenota una presentazione',

probLabel: 'Il punto cieco',
probTitle: 'I portali di annunci ti mandano sconosciuti.',
probBody: 'Una richiesta da un portale di annunci ti dà un nome, un\'email e nulla più. Non puoi distinguere il cliente pronto a comprare da quello che colleziona brochure — non prima di aver passato una giornata in mare con lui. Ogni prova in mare organizzata per la persona sbagliata è una giornata che il tuo broker non ha dedicato a quella giusta.',

howLabel: 'Come funziona',
howTitle: 'Dall\'invito privato alla prova in mare prenotata.',
step1t: 'Scegli il cliente',
step1d: 'I tuoi broker scelgono gli armatori e i clienti charter che meritano un invito personale.',
step2t: 'Invia l\'invito privato',
step2d: 'Arriva una Premium Box con una VIP Access Key e un biglietto firmato dal broker.',
step3t: 'Un tap apre la sua esperienza',
step3d: 'La sua Private Buyer Experience: la flotta che hai scelto per lui, specifiche, autonomia, disponibilità di ormeggio e charter.',
step4t: 'Tu vedi l\'intenzione',
step4d: 'Quale yacht ha aperto, su quale piano di coperta è tornato, quando ha chiesto il prezzo. Il tuo broker chiama sapendo tutto questo.',

seeLabel: 'Cosa vedi',
seeTitle: 'Cosa ti dice un tap.',
see1t: 'Con un nome, non anonimo',
see1d: 'Ogni tap appartiene a un cliente che hai invitato. Nessun traffico anonimo da indovinare.',
see2t: 'Intenzione, non clic',
see2d: 'Il tempo passato su una scheda tecnica, le visite ripetute allo stesso yacht, una brochure aperta due volte. I segnali che distinguono un acquirente da un curioso.',
see3t: 'In tempo reale, non settimanale',
see3d: 'Il broker lo sa nel momento in cui il cliente riapre un annuncio, non nel report del lunedì.',

demoLabel: 'Demo live',
demoTitle: 'Guardala dal lato del cliente.',
demoSub: 'Due porte sullo stesso sistema.',
demo1t: 'Portale VIP armatore',
demo1d: 'Quello che vede un armatore invitato dopo il tap.',
demo2t: 'Flotta da esplorare',
demo2d: 'La flotta navigabile, con ogni interazione registrata.',
demoCta: 'Apri la demo completa',

faqTitle: 'FAQ',
faq1q: 'Sostituisce il nostro CRM?',
faq1a: 'No. DynamicNFC si affianca al tuo CRM esistente e lo arricchisce con l\'intelligence comportamentale dei portali VIP.',
faq2q: 'Come gestite privacy e consenso?',
faq2a: 'Il tap fisico della card NFC è l\'opt-in: il consenso è esplicito, gli inviti sono intenzionali e l\'accesso è controllato. Il prodotto è progettato secondo i principi PIPEDA. I dati delle demo sono conservati in Canada (Montréal); in un\'installazione live, i dati saranno conservati nel paese in cui vengono utilizzati, secondo le leggi locali.',
faq3q: 'Come funziona un pilota?',
faq3a: '90 giorni dalla prima Premium Box. Include le Private Buyer Experience, la produzione delle card e un\'analisi completa di ciò che i dati hanno mostrato.',
faq4q: 'I clienti devono scaricare un\'app?',
faq4a: 'No. Un tap o la scansione di un QR apre l\'esperienza nel browser del telefono — nessun download.',

ctaTitle: 'Guardala funzionare con la tua flotta.',
ctaSub: 'Accompagniamo i tuoi broker usando i tuoi annunci. Nessuna presentazione.',
ctaPrimary: 'Prenota una presentazione',
ctaSecondary: 'Avvia la demo yacht',
```

### FR — in `yachtTranslations.js`, `fr`

```javascript
seoTitle: 'Clés d\'accès VIP NFC pour les courtiers en yachts',
seoDesc: 'Sachez qui est sérieux avant d\'organiser l\'essai en mer : un tap indique à vos courtiers qui s\'intéresse à quel yacht, et quand. Conçu à Vancouver, Canada.',

heroBadge: 'Courtage de yachts',
heroTitle: 'Sachez qui est sérieux avant l\'essai en mer.',
heroSub: 'Une VIP Access Key ouvre une Private Buyer Experience pour le propriétaire ou le client charter que vous avez invité — et vous dit quel yacht il a étudié, combien de temps, et quand il est revenu.',
heroCtaDemo: 'Lancer la démo yacht',
heroCtaWalk: 'Réserver une présentation',

probLabel: 'Le point aveugle',
probTitle: 'Les portails d\'annonces vous envoient des inconnus.',
probBody: 'Une demande venue d\'un portail d\'annonces vous donne un nom, une adresse e-mail, et rien d\'autre. Vous ne pouvez pas distinguer le client prêt à acheter de celui qui collectionne les brochures — pas avant d\'avoir passé une journée en mer avec lui. Chaque essai en mer organisé pour la mauvaise personne est une journée que votre courtier n\'a pas consacrée à la bonne.',

howLabel: 'Comment ça marche',
howTitle: 'De l\'invitation privée à l\'essai en mer réservé.',
step1t: 'Choisissez le client',
step1d: 'Vos courtiers choisissent les propriétaires et les clients charter qui méritent une invitation personnelle.',
step2t: 'Envoyez l\'invitation privée',
step2d: 'Une Premium Box arrive avec une VIP Access Key et un mot signé par le courtier.',
step3t: 'Un tap ouvre son expérience',
step3d: 'Sa Private Buyer Experience : la flotte que vous avez choisie pour lui, les spécifications, l\'autonomie, la disponibilité des places de port et des charters.',
step4t: 'Vous voyez l\'intention',
step4d: 'Quel yacht il a ouvert, sur quel plan de pont il est revenu, quand il a demandé le prix. Votre courtier appelle en sachant tout cela.',

seeLabel: 'Ce que vous voyez',
seeTitle: 'Ce qu\'un tap vous apprend.',
see1t: 'Nommé, pas anonyme',
see1d: 'Chaque tap appartient à un client que vous avez invité. Aucun trafic anonyme à deviner.',
see2t: 'L\'intention, pas les clics',
see2d: 'Le temps passé sur une fiche technique, les visites répétées au même yacht, une brochure ouverte deux fois. Les signaux qui distinguent un acheteur d\'un curieux.',
see3t: 'En temps réel, pas chaque semaine',
see3d: 'Le courtier l\'apprend au moment où le client rouvre une annonce, pas dans le rapport du lundi.',

demoLabel: 'Démo en direct',
demoTitle: 'Voyez-la du côté du client.',
demoSub: 'Deux portes vers le même système.',
demo1t: 'Portail VIP propriétaire',
demo1d: 'Ce que voit un propriétaire invité après le tap.',
demo2t: 'Flotte à explorer',
demo2d: 'La flotte parcourable, chaque interaction enregistrée.',
demoCta: 'Ouvrir la démo complète',

faqTitle: 'FAQ',
faq1q: 'Est-ce que cela remplace notre CRM ?',
faq1a: 'Non. DynamicNFC se superpose à votre CRM existant et l\'enrichit avec l\'intelligence comportementale des portails VIP.',
faq2q: 'Comment gérez-vous la confidentialité et le consentement ?',
faq2a: 'Le tap physique de la carte NFC est l\'opt-in : le consentement est explicite, les invitations sont intentionnelles et l\'accès est contrôlé. Le produit est conçu selon les principes de la LPRPDE (PIPEDA). Les données de démonstration sont stockées au Canada (Montréal) ; en déploiement réel, les données seront stockées là où elles sont utilisées, conformément aux lois locales.',
faq3q: 'À quoi ressemble un pilote ?',
faq3a: '90 jours à partir de la première Premium Box. Comprend les Private Buyer Experiences, la production des cartes et une analyse complète de ce que les données ont montré.',
faq4q: 'Les clients ont-ils besoin d\'une application ?',
faq4a: 'Non. Un tap ou un scan de QR ouvre l\'expérience dans le navigateur du téléphone — aucun téléchargement.',

ctaTitle: 'Voyez-la fonctionner avec votre propre flotte.',
ctaSub: 'Nous accompagnons vos courtiers avec vos propres annonces. Pas de présentation commerciale.',
ctaPrimary: 'Réserver une présentation',
ctaSecondary: 'Lancer la démo yacht',
```

### ES — in `yachtTranslations.js`, `es`

```javascript
seoTitle: 'Llaves de acceso VIP NFC para brókeres de yates',
seoDesc: 'Sabes quién va en serio antes de organizar la prueba de mar: un tap le dice a tus brókeres quién se interesa, en qué yate y cuándo. Hecho en Vancouver, Canadá.',

heroBadge: 'Correduría de yates',
heroTitle: 'Sabes quién va en serio antes de la prueba de mar.',
heroSub: 'Una VIP Access Key abre una Private Buyer Experience para el propietario o el cliente de chárter que invitaste — y te dice qué yate estudió, cuánto tiempo y cuándo volvió.',
heroCtaDemo: 'Abrir la demo de yates',
heroCtaWalk: 'Reservar una presentación',

probLabel: 'El punto ciego',
probTitle: 'Los portales de anuncios te mandan desconocidos.',
probBody: 'Una consulta desde un portal de anuncios te da un nombre, un correo y nada más. No puedes distinguir al cliente listo para comprar del que colecciona folletos — no hasta pasar un día en el mar con él. Cada prueba de mar organizada para la persona equivocada es un día que tu bróker no dedicó a la correcta.',

howLabel: 'Cómo funciona',
howTitle: 'De la invitación privada a la prueba de mar reservada.',
step1t: 'Elige al cliente',
step1d: 'Tus brókeres eligen a los propietarios y clientes de chárter que merecen una invitación personal.',
step2t: 'Envía la invitación privada',
step2d: 'Llega una Premium Box con una VIP Access Key y una nota firmada por el bróker.',
step3t: 'Un tap abre su experiencia',
step3d: 'Su Private Buyer Experience: la flota que elegiste para él, especificaciones, autonomía, disponibilidad de amarre y chárter.',
step4t: 'Tú ves la intención',
step4d: 'Qué yate abrió, a qué plano de cubierta volvió, cuándo pidió el precio. Tu bróker llama sabiéndolo todo.',

seeLabel: 'Lo que ves',
seeTitle: 'Lo que te dice un tap.',
see1t: 'Con nombre, no anónimo',
see1d: 'Cada tap pertenece a un cliente que invitaste. Nada de tráfico anónimo que adivinar.',
see2t: 'Intención, no clics',
see2d: 'El tiempo en una ficha técnica, las visitas repetidas al mismo yate, un folleto abierto dos veces. Las señales que separan a un comprador de un curioso.',
see3t: 'En tiempo real, no semanal',
see3d: 'El bróker se entera en el momento en que el cliente reabre un anuncio, no en el informe del lunes.',

demoLabel: 'Demo en vivo',
demoTitle: 'Míralo desde el lado del cliente.',
demoSub: 'Dos puertas al mismo sistema.',
demo1t: 'Portal VIP del propietario',
demo1d: 'Lo que ve un propietario invitado después del tap.',
demo2t: 'Flota para explorar',
demo2d: 'La flota navegable, con cada interacción registrada.',
demoCta: 'Abrir la demo completa',

faqTitle: 'Preguntas frecuentes',
faq1q: '¿Esto reemplaza nuestro CRM?',
faq1a: 'No. DynamicNFC se integra sobre tu CRM actual y lo enriquece con la inteligencia de comportamiento de los portales VIP.',
faq2q: '¿Cómo gestionan la privacidad y el consentimiento?',
faq2a: 'El tap físico de la tarjeta NFC es el opt-in: el consentimiento es explícito, las invitaciones son intencionales y el acceso está controlado. El producto está diseñado según los principios de PIPEDA. Los datos de demostración se almacenan en Canadá (Montreal); en una implementación real, los datos se almacenarán donde se utilicen, conforme a las leyes locales.',
faq3q: '¿Cómo es un piloto?',
faq3a: '90 días desde la primera Premium Box. Incluye las Private Buyer Experiences, la producción de las tarjetas y un análisis completo de lo que mostraron los datos.',
faq4q: '¿Los clientes necesitan una app?',
faq4a: 'No. Un tap o un escaneo de QR abre la experiencia en el navegador del teléfono — sin descargas.',

ctaTitle: 'Míralo funcionar con tu propia flota.',
ctaSub: 'Acompañamos a tus brókeres usando tus propios anuncios. Sin presentación comercial.',
ctaPrimary: 'Reservar una presentación',
ctaSecondary: 'Abrir la demo de yates',
```

## 6. Wiring

### `App.jsx`
Add the lazy import next to the other page imports, and one route next to `/automotive`:
```jsx
const Yacht = lazy(() => import("./pages/Yacht/Yacht"));
```
```jsx
<Route path="/yacht" element={<P><Yacht /></P>} />
```
Place it immediately before `<Route path="/yacht/demo" ...>`. Change nothing else in `App.jsx`.

### `Home.jsx`
In `IndustriesSection`, the `ind4` entry points at the demo and has no demo link (PR #29 removed it).
Now that `/yacht` exists, restore both:
```jsx
{ k: 'ind4', icon: ICONS.anchor, c: 'teal', nav: '/yacht', demo: '/yacht/demo' },
```
In the footer's Industries column, `<Link to="/yacht/demo">{t('ind4t')}</Link>` becomes
`<Link to="/yacht">{t('ind4t')}</Link>`.

Nothing else in `Home.jsx` changes. The `{ind.demo && ...}` conditional stays as it is.

## 7. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint
npm test
npm run build
```
0 lint errors, all tests pass (`translationParity.test.js` will now also check `yachtTranslations.js`
— it/fr/es must carry identical key sets), build completes.

```powershell
(Get-Content "C:\Users\oguzh\DynamicNFC\frontend\src\pages\Yacht\Yacht.jsx").Length
Get-Content "C:\Users\oguzh\DynamicNFC\frontend\src\pages\Yacht\Yacht.jsx" -Tail 40
```

Manual, `npm run dev`:
1. `/yacht` renders all six sections plus FAQ and closing CTA, no missing-key text (`seoTitle`
   rendering literally means the merge failed).
2. Switch EN → IT → FR → ES: every visible string changes, including the tab title.
3. Every link works: hero → `/yacht/demo` and `/contact-sales`; demo cards → `/yacht/demo/vip` and
   `/yacht/demo/showroom`; demo button → `/yacht/demo`; closing CTA → `/contact-sales` and `/yacht/demo`.
4. Home `/`: the Yacht Industries card body now goes to `/yacht`, and its "Try demo →" link is back
   and goes to `/yacht/demo`. Footer "Yacht Brokerage" goes to `/yacht`.
5. 375 / 768 / 1024 / 1440 px — no horizontal scroll, FAQ answers do not clip.
6. FAQ accordion opens and closes by keyboard (Enter and Space).
7. `prefers-reduced-motion: reduce` — content is visible immediately, no animation.

## 8. Do not

- No deploy.
- Do not import or edit `Automotive.css` / `Automotive.jsx`. Model only.
- Do not touch `pages/YachtDemo/*`.
- Do not add an Arabic set, `useRegion`, `useSector`, a persona name, a currency, a pricing figure,
  or any statistic. This page carries no numbers except "90 days".
- Do not add sections, testimonials, logos or a pilot form that are not in §4.
- No new dependencies.

## 9. Report back

1. Diff summary and the new files' line counts.
2. Full `npm run lint`, `npm test`, `npm run build` output.
3. `Yacht.jsx` line count and tail.
4. Manual checks 1–7, one line each: PASS / FAIL / NOT RUN.
5. Anything in §5 you could not place exactly as written.

Nothing is committed until Claude has audited the report.

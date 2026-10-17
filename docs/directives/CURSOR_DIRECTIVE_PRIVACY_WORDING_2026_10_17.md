# CURSOR DIRECTIVE — privacy FAQ, lawyer-approved wording (2026-10-17)

**Branch:** `fix/privacy-wording-2026-10-17` (branch off current `main`)
**Type:** implementation
**Read first:** `CLAUDE.md`, top entry of `CLAUDE_HANDOFF.md`

## 1. Goal

The Home privacy FAQ answer shipped in PR #29 said customer data is stored in Canada (Montréal),
full stop. The lawyer has now approved the wording with one addition: that statement describes demo
data, and live deployments store data in the region where it is used, under local law. Add that
distinction in all five languages. Question text (`faq2q`) stays exactly as it is.

## 2. Scope

Touch only:
- `frontend/src/pages/Home/Home.jsx` — the `faq2a` string in `TR.en` and in `TR.ar`
- `frontend/src/pages/Home/homeTranslations.js` — the `faq2a` string in `it`, `fr`, `es`

Must NOT be touched: `faq2q` in any language, any other FAQ entry, `Home.css`, `index.html`,
`App.jsx`, `CLAUDE.md`.

## 3. Steps

Replace the `faq2a` value in each language. These strings are lawyer-approved — copy them
character for character, do not re-wrap, re-punctuate or "improve" them.

`Home.jsx` → `TR.en`:
```javascript
faq2a: 'The physical NFC tap is the opt-in: consent is explicit, invitations are intentional, and access is controlled. The product is designed around PIPEDA principles. Demo data is stored in Canada (Montréal); in a live deployment, data will be stored in the region where it is used, under that region\'s laws.',
```

`Home.jsx` → `TR.ar`:
```javascript
faq2a: 'النقر الفعلي على بطاقة NFC هو الموافقة: موافقة صريحة، دعوات مقصودة، ووصول مضبوط. المنتج مصمَّم وفق مبادئ PIPEDA. تُخزَّن بيانات العروض التجريبية في كندا (مونتريال)؛ وفي التشغيل الفعلي ستُخزَّن البيانات حيث تُستخدم، وفق القوانين المحلية.',
```

`homeTranslations.js` → `it`:
```javascript
faq2a: 'Il tap fisico della card NFC è l\'opt-in: il consenso è esplicito, gli inviti sono intenzionali e l\'accesso è controllato. Il prodotto è progettato secondo i principi PIPEDA. I dati delle demo sono conservati in Canada (Montréal); in un\'installazione live, i dati saranno conservati nel paese in cui vengono utilizzati, secondo le leggi locali.',
```

`homeTranslations.js` → `fr`:
```javascript
faq2a: 'Le tap physique de la carte NFC est l\'opt-in : le consentement est explicite, les invitations sont intentionnelles et l\'accès est contrôlé. Le produit est conçu selon les principes de la LPRPDE (PIPEDA). Les données de démonstration sont stockées au Canada (Montréal) ; en déploiement réel, les données seront stockées là où elles sont utilisées, conformément aux lois locales.',
```

`homeTranslations.js` → `es`:
```javascript
faq2a: 'El tap físico de la tarjeta NFC es el opt-in: el consentimiento es explícito, las invitaciones son intencionales y el acceso está controlado. El producto está diseñado según los principios de PIPEDA. Los datos de demostración se almacenan en Canadá (Montreal); en una implementación real, los datos se almacenarán donde se utilicen, conforme a las leyes locales.',
```

## 4. Verify

```powershell
cd C:\Users\oguzh\DynamicNFC\frontend
npm run lint
npm test
npm run build
```

0 lint errors, all tests pass, build completes. No new keys are added, so translation parity is
unaffected — but the test must still pass.

Manual, `npm run dev`, on `/`: open the second FAQ question in the left column in EN, IT, FR and ES.
Each must show the new two-part answer (demo → Canada; live → region of use). Check that the answer
panel does not clip at 375 px — these strings are longer than the ones they replace.

## 5. Do not

- No deploy.
- Do not change `faq2q`, or any other string.
- Do not reword, shorten or reformat the approved text.
- No new dependencies, no refactors.

## 6. Report back

Diff summary, lint / test / build output, and the four FAQ screenshots-or-text checks with
PASS / FAIL / NOT RUN. Nothing is committed until Claude has audited the report.

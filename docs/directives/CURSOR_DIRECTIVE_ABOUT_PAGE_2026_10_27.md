# CURSOR DIRECTIVE — About page (/about)

**Branch:** `feat/about-page`, cut from `main`          **Type:** implementation
**Read first:** CLAUDE.md, top entry of CLAUDE_HANDOFF.md

## 1. Goal

dynamicnfc.ca gets a public **About** page at `/about`, modelled on dynamiccrm.ca/about. Claude has already written the page, its styles and the English text. Your job is the wiring around it: the route, the links, the three translations, the sitemap and the checks. When you are done, `/about` opens from the Navbar and the footer in EN, IT, FR and ES, and lint, test and build pass.

## 2. Scope

**Already written by Claude. Do not change the layout or the English copy:**
- `frontend/src/pages/About/About.jsx` — page, `TR.en`, team list, group list
- `frontend/src/pages/About/About.css` — prefix `ab-`
- `frontend/src/pages/About/AboutMap.jsx` — group map (public-domain Natural Earth outline)
- `frontend/src/pages/About/aboutTranslations.js` — currently `export const ABOUT_TR_EXTRA = {};`
- `frontend/public/images/about/` — founder photo, 9 team photos (`team/`), 5 logos (`group/`)

**You touch:**
- `frontend/src/pages/About/aboutTranslations.js` — fill `it`, `fr`, `es`
- `frontend/src/App.jsx` — one lazy import and one route (explicitly approved by Oguzhan, 2026-10-27)
- Navbar component(s) — one "About" link, desktop and mobile menu
- The site footer — one "About" link next to the other company/legal links
- `frontend/src/i18n/common.js` — a `navAbout` key in every language block that exists there (en, it, fr, es, ar)
- `frontend/public/sitemap.xml` — one `/about` entry

**Do NOT touch:** `/admin/*`, `backend/`, `firebase.js`, `firebase.json`, `scripts/guard-project.cjs`, any demo portal, `.cursor/rules`.

## 3. Steps

1. `git switch main; git pull; git switch -c feat/about-page`. The About files are untracked and come along with the switch. Check with `git status`.
2. **Translations.** In `aboutTranslations.js`, add `it`, `fr` and `es`, each a full set with exactly the keys of `TR.en` in `About.jsx`. Do not translate these values: names of people and companies, `Toronto`, `Keiretsu Forum`, `NFC Software Systems Inc.`, the addresses `Toronto, ON M4R, Canada` and `North Vancouver, BC V7R, Canada`, `ComoNExT`, `Ulutek`, `VIATEC`, `VIP Access Key`. Translate the country words (`Italy` → `Italia`, `Türkiye` → `Turchia` / `Turquie` / `Turquía`). Use "VIP Access Key" in every language, never "digital business card". Professional tone. No new facts or numbers.
3. **Route.** In `App.jsx`, add `const About = lazy(() => import("./pages/About/About"));` next to the other public pages. Add `<Route path="/about" element={<P><About /></P>} />` next to `/yacht`, using the same wrapper that `/yacht` uses.
4. **Links.** Add `navAbout` to `common.js` (en "About", it "Chi siamo", fr "À propos", es "Quiénes somos", ar "من نحن"). Put one `<Link to="/about">` in the Navbar, desktop and mobile, as the last plain link before the CTA buttons. Put one in the footer. Use the existing link classes; no new CSS in the Navbar or footer.
5. **Sitemap.** Add `https://dynamicnfc.ca/about` to `public/sitemap.xml`, in the same format as the `/yacht` entry.
6. **Parity test.** `translationParity.test.js` picks up `*Translations.js` on its own. If it fails, fix the missing keys. Do not change the test.

## 4. Verify (PowerShell, from `frontend/`)

```powershell
npm run lint      # 0 errors
npm test          # all pass, including translationParity
npm run build     # passes
npm run preview   # then open http://localhost:4173/about
```

Check by hand, and report each item as PASS, FAIL or NOT RUN:
- `/about` at 1440, 1024, 768 and 375 px: no horizontal scroll; the team grid shows 5, 3, 2 and 2 columns.
- Language switch EN → IT → FR → ES: every heading and paragraph changes, and no raw key such as `fact1v` appears.
- The DynamicNFC card is first and has the red border. The other three cards sit in one row on desktop.
- The red dot on the map is Toronto.
- The Navbar link and the footer link both open `/about`.
- The browser console shows no errors on `/about`.
- `Select-String -Path src\pages\About\*.jsx -Pattern "console.log"` returns nothing.

## 5. Do not

- No deploy, no merge to `main`. Oguzhan reviews the branch with `npm run preview` and merges it himself.
- Do not change About.jsx layout, About.css or the English copy. If something looks wrong, report it; Claude fixes it.
- No new dependencies. No refactors outside the scope list.

## 6. Report back

Paste to Oguzhan, who passes it to Claude for audit:
- the commit hash on `feat/about-page`, pushed
- lint / test / build output (last lines)
- the PASS / FAIL / NOT RUN list from section 4
- anything you were unsure about in the translations

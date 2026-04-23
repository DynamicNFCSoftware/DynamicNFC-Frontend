# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is
React (Vite) frontend for **dynamicnfc.ca** — a Sales Velocity Engine for Real Estate Developers & Agents, Automotive Dealerships, and Enterprise. Physical NFC cards in premium boxes go to VIP prospects, who tap to access private buyer portals. Every interaction feeds a behavioral analytics dashboard.

**Never** call the product a "digital business card." It is a **VIP Access Key** and the portals are **Private Buyer Experiences**.

## Commands
```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build to dist/
npm run lint      # ESLint (no-unused-vars ignores ^[A-Z_] pattern)
npm run preview   # Preview production build
```

## Tech Stack
- React 18 + Vite 7, plain JSX (no TypeScript)
- React Router v6 — all routes in `src/App.jsx`
- Custom CSS only — no UI framework, no Tailwind
- Fonts: Playfair Display (headings), Outfit (body), Cormorant Garamond (luxury portals), Noto Kufi Arabic (RTL)
- API proxy: `/api` routes proxy to backend (`https://3.128.244.219`), configurable in `vite.config.js`

## Architecture

### Routing
All routes defined in `src/App.jsx`. Auth via `src/contexts/AuthContext.jsx` wrapping the app in `<AuthProvider>`.

### Page Pattern
Each page lives in `src/pages/PageName/`. Two patterns exist:
1. **External CSS** — page has a companion `.css` file (Home, Enterprise, etc.)
2. **Self-contained** — CSS injected via `<style>` tag from a `const CSS` or `const css` variable in the JSX file. These are: `CRMGateway`, `VIPPortal_Definitive`, `AhmedPortal`, `MarketplacePortal`, `Dashboard`

### CRM Demo Flow
Entry point: `/enterprise/crmdemo` (CRMGateway) — industry selector (Real Estate / Automotive).
- Industry cards navigate directly to dashboards: RE → `/enterprise/crmdemo/dashboard`, Auto → `/automotive/dashboard`
- "← All Industries" returns to selector; portal list shown after industry selection
- `/enterprise/crmdemo/khalid` — VIP Portal (Khalid Al-Rashid, dark + gold #C5A467)
- `/enterprise/crmdemo/ahmed` — Ahmed Portal (Ahmed Al-Fahad, dark + teal #2ec4b6)
- `/enterprise/crmdemo/marketplace` — Marketplace Portal (anonymous, light cream)
- `/enterprise/crmdemo/dashboard` — CRM Dashboard (dark #0D0D12, light toggle)

### Page Consolidation
- `/real-estate` → redirects to `/developers` (Navigate replace)
- `/developers` serves both Real Estate Developers & Agents
- "Real Estate Agents" is NOT a separate page — merged into Developers

### CRM Tracking System
Portals track events to `localStorage` key `"dnfc_events"` (JSON array). Dashboard polls every 3s + listens via `BroadcastChannel("dnfc_tracking")`.
Event shape: `{ id, timestamp, sessionId, portalType, event, vipName?, unitId?, unitName? }`

### Bilingual (EN/AR)
Every page supports English and Arabic with RTL:
- Translations in `const TR = { en: {...}, ar: {...} }` at top of each file
- `dir={lang === 'ar' ? 'rtl' : 'ltr'}` on root element
- Use CSS logical properties (`inset-inline-start`, not `left`)
- Arabic must be Modern Standard Arabic with professional real estate tone

## CSS Namespacing
Each component uses a unique prefix to prevent style bleed:
`hp-` (Home), `ent-` (Enterprise), `dev-` (Developers, extends ent-), `re-` (RealEstate, extends ent-), `gw-` (CRMGateway), `vp-` (VIPPortal), `ap-` (AhmedPortal), `mp-` (MarketplacePortal), `db-` (Dashboard)

## Brand Colors
```
#e63946 red (primary CTA)    #c1121f red-dark (hover)
#365f8a identity blue (primary brand / tool CTAs — prefer over black where specified)
#457b9d blue (secondary)     #6ba3c7 blue-light
#C5A467 gold (VIP accent)    #2ec4b6 teal (Ahmed accent)
#1a1a1f charcoal (dark bg)   #faf8f5 cream (light bg)
```
Home: `--identity` (`#365f8a`) in `pages/Home/Home.css`; ROI tool CTA hovers to brand red gradient.

## Coding Rules
- Never use "Jane Doe" or "John Smith" — deprecated persona names
- `font-weight` minimum: 400 (never 300)
- Text opacity minimum: 0.58 muted, 0.85 secondary
- Always use explicit `color: #FFFFFF` for white text on dark backgrounds
- Portal files are self-contained — unit data, translations, and CSS all in same file

## Design Patterns (2026-03-30)
- **No fake metrics** — never use unsourced percentages (47%, 3.2×, 100%). Use qualitative labels: Named, Intent, Real-Time, Zero Guesswork
- **Section compactness** — prefer accordion over card grids for Use Cases, FAQ. Prefer strips over 3-card grids for "Blind Spot" style sections
- **CTA gradient** — Final CTA sections use `linear-gradient(135deg, #4A7FB3, #365f8a)` blue gradient container
- **Footer** — all customer-facing pages use branded footer (logo + Industries + Resources + copyright)
- **Form i18n** — all form labels and select options must be in TR object (EN+AR), never hardcoded
- **Modal a11y** — role="dialog", aria-modal="true", close button aria-label, aria-required on required fields
- **Demo links** — from industry pages go directly to dashboard (/enterprise/crmdemo/dashboard), not individual portals
- **Label consistency** — "Real Estate Developers & Agents" everywhere (never "Real Estate" alone for the industry page)

## Known Issues
- OrderCard page needs React conversion (HTML version exists)
- Brand naming inconsistency: "Vista Residences" vs "Al Noor Residences"
- OAuth backend (Passport.js) not yet implemented

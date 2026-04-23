# Al Noor Residences — CRM Demo (React)

> Dynamic NFC CRM Technology Demo converted from 4 HTML files (~5,000 lines) to modular React architecture with bilingual EN/AR support.

## Project Structure

```
crm-demo-react/
├── App.jsx                          # Main router (hash-based, no react-router needed)
├── README.md
├── shared/
│   ├── tracking.js                  # Event tracking → localStorage (Dashboard polls this)
│   ├── translations.js              # Bilingual system (EN/AR) with createT() helper
│   └── unitsData.js                 # 39 property units across 3 towers
└── pages/
    ├── KhalidPortal/
    │   ├── KhalidPortal.jsx         # VIP Investor (gold accent, ROI-focused)
    │   └── KhalidPortal.css
    ├── AhmedPortal/
    │   ├── AhmedPortal.jsx          # VIP Family (blue/teal, community-focused)
    │   └── AhmedPortal.css
    ├── Marketplace/
    │   ├── Marketplace.jsx          # Public portal (login gate, chatbot, lead capture)
    │   └── Marketplace.css
    └── Dashboard/
        ├── Dashboard.jsx            # Analytics (7 tabs, VIP CRM, real-time feed)
        └── Dashboard.css
```

## Quick Start

### Option A: Add to existing React project (Vite/CRA)
1. Copy `shared/` and `pages/` folders into your `src/` directory
2. Import `App.jsx` as your root component
3. Add Google Fonts to your `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
   ```

### Option B: New Vite project
```bash
npm create vite@latest crm-demo -- --template react
cd crm-demo
# Copy all files into src/
npm install
npm run dev
```

## Architecture

### Shared Infrastructure
- **tracking.js** — All portals emit events via `track(event, data, visitor)`. Events are stored in localStorage under `dnfc_events`. The Dashboard polls this every 3 seconds.
- **translations.js** — `createT(lang, portalTranslations)` returns a lookup function. Shared translations (UI labels, specs, statuses) merge with portal-specific translations.
- **unitsData.js** — 39 units with full data: images, features, amenities, ROI, tower assignments. Each portal filters this same dataset.

### Portal Patterns
All 4 portals follow the same React pattern:
1. Import shared modules
2. Define portal-specific translations (EN/AR)
3. Define visitor object (`{ name, type: 'vip'|'registered'|'anonymous' }`)
4. `useState` for UI state, `useMemo` for computed values
5. Demo bar with cross-portal navigation + language toggle
6. All CTAs route through `handleCTA()` which fires tracking events

### Data Flow
```
Portal CTA click → track() → localStorage → Dashboard polls → Live Feed + Metrics
```

### CSS Namespace Convention
Each portal uses a unique prefix to prevent conflicts:
- **k-** → KhalidPortal (gold theme)
- **a-** → AhmedPortal (blue theme)
- **m-** → Marketplace (red theme)
- **d-** → Dashboard

### Bilingual / RTL
- Language persists in `localStorage('dnfc_lang')`
- RTL toggled via `.rtl` class on portal root + `document.dir`
- All CSS uses `inset-inline-start/end` instead of `left/right`

## Key Features by Portal

### Khalid (VIP Investor)
- Gold accent (#b8860b), investment stats bar
- Compare system (up to 3 units side by side)
- 5-tab property modal (Plans, Views, Blueprints, Features, Amenities)
- CTAs: Request VIP Pricing, Payment Plan, Floor Plan, Private Viewing

### Ahmed (VIP Family)
- Blue/teal accent (#457b9d / #2ec4b6)
- Community stats bar (Schools, Parks, Walk Score)
- Family-focused CTAs and descriptions
- Same compare and modal systems as Khalid

### Marketplace (Public)
- Category filtering (All, Penthouses, Luxury, Family, Investment)
- Login gate on pricing/viewing CTAs (brochure download is free)
- Chatbot with canned responses and tracking
- Registration captures name + email

### Dashboard (Analytics)
- 7 tabs: Overview, VIP CRM, Priority VIP, Analytics, Units, Campaigns, Settings
- Real-time localStorage polling (3s interval)
- VIP behavioral timeline with lead scoring
- Executive banner with MVP philosophy
- Heatmap and bar chart visualizations

## Image Dependencies
Unit images reference placeholder URLs from the original HTML. For production, replace `u.img.card`, `u.img.fp`, `u.img.views`, and `u.img.bp` in `unitsData.js` with your actual image paths.

## MVP Boundaries (from Pitch Deck)
- Event types: `page_view` and `cta_click` only
- CTA names: `book_viewing`, `request_pricing`, `request_payment_plan`, `download_brochure`
- Success metric: **Booked viewings uplift** among VIP invitees vs control group
- No forced funnel — observe, don't control

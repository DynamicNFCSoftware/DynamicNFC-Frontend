# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

DynamicNFC is an NFC-powered Sales Velocity Engine. The only service needed for local development is the **React frontend** (Vite dev server on port 3000). Firebase Auth/Firestore are cloud services accessed via hardcoded config in `frontend/src/firebase.js` — no local emulators required.

### Running the frontend

```bash
cd frontend && npm install && npm run dev   # Dev server at http://localhost:3000
```

See `.cursorrules` and `claude/general-architecture.md` for full command reference.

### Key gotchas (Linux / case-sensitive filesystems)

- The codebase was developed on macOS/Windows (case-insensitive). Several imports have casing mismatches that break on Linux:
  - `App.jsx` had a duplicate lowercase `import login from "./pages/Login/login"` — removed (the correctly-cased `Login` import on the prior line is used).
  - `NFCCards.jsx` imports from `./assets/` but the directory is `Assets/` — a symlink `assets -> Assets` was created.
- The `firebase` and `recharts` npm packages are used in source but were missing from `package.json`. They have been added.
- The `src/i18n/` directory (translation system) and `src/components/SEO/SEO.jsx` were referenced but never committed. Minimal stubs have been created so the app loads.
- `firebase.js` was missing `initRemoteConfig` and `getConfigValue` exports used by `Home.jsx`. Stub exports were added.

### Lint and build

- `npm run lint` — ESLint runs but has ~140 pre-existing errors (mostly in minified vendor JS files under `public/assets/js/`). These are not regressions.
- `npm run build` — Production build works after the above fixes.

### Demo vs Production mode

Demo pages (`/enterprise/crmdemo/*`, `/automotive/demo/*`) work without authentication or Firestore. Production pages (`/admin/*`, `/dashboard`, `/create-card`) require Firebase Auth. No test credentials exist in this environment; demo pages are the primary way to verify UI changes.

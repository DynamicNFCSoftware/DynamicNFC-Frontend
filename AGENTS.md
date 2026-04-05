# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

DynamicNFC is an NFC-powered Sales Velocity Engine. The active stack is a React 18 + Vite 7 frontend (`frontend/`) with Firebase backend (Auth, Firestore, Cloud Functions). The Spring Boot `backend/` directory is fully deprecated — never modify it.

### Services

| Service | Directory | Command | Port | Notes |
|---------|-----------|---------|------|-------|
| Frontend dev server | `frontend/` | `npm run dev` | 3000 | Main development target |
| Firebase Cloud Functions | `functions/` | Deployed remotely | — | No local emulator config; functions talk to production Firebase project |

### Commands (run from `frontend/`)

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Preview | `npm run preview` |

Deploy commands (run from project root): see `.cursorrules` COMMANDS section.

### Known issues

- **Build fails** due to pre-existing code bugs: `src/App.jsx` imports `./pages/Login/login` (lowercase) but the file is `Login.jsx` (uppercase). The dev server tolerates this on some OS but `vite build` fails on case-sensitive filesystems (Linux).
- **Home page (`/`)** has unresolved imports (`../../i18n`, `initRemoteConfig` from firebase.js) — it will error at runtime. The CRM demo pages (`/enterprise/crmdemo/*`) work without issues.
- **ESLint reports ~147 pre-existing errors** (unused vars, hooks rules violations, etc.). The lint tooling itself works correctly.

### Demo pages (no auth required)

The CRM demo pages work fully without Firebase Auth or any backend:
- `/enterprise/crmdemo` — CRM Gateway (industry selector)
- `/enterprise/crmdemo/khalid` — VIP Portal (Khalid Al-Rashid)
- `/enterprise/crmdemo/ahmed` — Ahmed Portal
- `/enterprise/crmdemo/marketplace` — Marketplace Portal
- `/enterprise/crmdemo/dashboard` — CRM Analytics Dashboard

### Dependencies note

The `firebase` and `recharts` packages are required by the source code but were missing from the original `package.json`. They have been added. Running `npm install` in `frontend/` installs everything needed.

# ChorePal — Claude Context

## What this app does
ChorePal is a family chore management app. Parents create chore assignments for their children, track weekly completion, and view a progress dashboard. The "Wanted Poster" feature highlights the child with the lowest completion rate.

## Dev commands
```bash
# Frontend (from /frontend)
npm run dev          # Vite dev server → http://localhost:5173
npm run type-check   # tsc --noEmit — verify TypeScript with no build output

# Backend (from /backend)
npm run dev          # nodemon + ts-node server.ts → http://localhost:3000
npm run build        # tsc — compile TypeScript to dist/
npm start            # node dist/server.js (run build first)
```

## Tech stack
| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript (strict), Redux Toolkit, React Router DOM 7, Tailwind CSS 4, Vite, Framer Motion, canvas-confetti, vite-plugin-pwa |
| Backend | Node.js, Express 5, TypeScript (strict), MongoDB Atlas (raw driver — not Mongoose), JWT, bcrypt, Multer, ts-node |
| Storage | AWS S3 (bucket: ptangatuestorage, region: us-east-2) |
| Testing | Jest (frontend + backend) |

## Key file paths
```
/frontend/src/
  App.tsx                    — routes (/ login, /dashboard) + skip link
  main.tsx                   — Redux Provider + BrowserRouter
  index.css                  — global styles, Tailwind v4 @theme, dark variant
  types/index.ts             — shared domain types: Chore, ChoreStatus, ChoreDay, API responses
  hooks/useDarkMode.ts       — dark mode toggle, localStorage persistence
  pages/Login.tsx            — auth (login + signup toggle), h1 heading
  pages/Dashboard.tsx        — main view (loads chores, renders WeekView + ProgressWeekly + Navbar)
  components/Navbar.tsx      — h1 ChorePal, wanted poster, dark mode toggle
  components/WeekView.tsx    — 7-day grid of DayCards
  components/DayCard.tsx     — h2 day name, chore list, confetti + Framer Motion animations
  components/AddChore.tsx    — h3 inline add form, Escape key support
  utils/ProgressBar.tsx      — single-child progress bar with ARIA
  utils/ProgressWeekly.tsx   — all-children progress summary
  redux/choreSlice.ts        — async thunks: fetchChores, addChore, completeChore, deleteChore
  redux/store.ts             — Redux store + RootState/AppDispatch types

/frontend/
  vite.config.js             — Vite config + VitePWA plugin (manifest + Workbox service worker)

/backend/
  server.ts                  — Express app entry point, middleware, route mounting
  connect.ts                 — MongoDB Atlas connection module (connectToServer, getDb)
  config.env                 — ATLAS_URI + SECRETKEY (gitignored — must contain real credentials)
  userRoutes.ts              — GET/POST/PUT/DELETE /users, POST /users/login (JWT)
  choreRoutes.ts             — GET/POST/PUT/DELETE /chores
  childRoutes.ts             — GET/POST/PUT/DELETE /children
  awsRoutes.ts               — GET /images/:filename (S3 → base64)
  src/types/domain.ts        — shared backend types: DbUser, DbChore, DbChild, JWTPayload
```

## Color scheme (CSS custom properties in index.css)
| Variable | Hex | Usage |
|---|---|---|
| `--color-primaryDark` | `#1a2b4c` | Navy — backgrounds |
| `--color-accentOrange` | `#ff6600` | Orange — decorative only (fails AA for text) |
| `--color-accentOrangeDark` | `#cc5200` | Dark orange — text/interactive (4.77:1 on white ✓) |
| `--color-surface` | `#2e3a59` | Lighter navy — card surfaces |
| `--color-lightGray` | `#f7f9fa` | Page background |

## Accessibility (WCAG 2.1 AA)
See `/docs/accessibility.md` for full decision log.

**Heading hierarchy:**
- Login page: `h1` "Welcome to ChorePal" (Navbar does not render on login)
- Dashboard: `h1` "ChorePal" (Navbar) → `h2` day name (DayCard) → `h3` "Add New Chore" (AddChore)

**Key decisions:**
- `role="progressbar"` + `aria-valuenow/min/max` on ProgressBar
- `role="alert"` + `aria-live="assertive"` on error messages
- `role="status"` + `aria-live="polite"` on loading/success messages
- Skip link `<a href="#main-content">` at top of App
- Global `*:focus-visible` outline using `--color-accentOrangeDark`
- All `<select>` elements have `aria-label`
- `<nav aria-label="Main navigation">` wraps Navbar
- `bg-red-700` / `bg-green-700` in ProgressBar (meet 4.5:1 AA ratio)
- DOM-based error messages replace `alert()` in AddChore
- Email input uses `type="email"` (WCAG 1.3.5 Identify Input Purpose)

## Redux state shape
```js
{
  chores: {
    chores: [],        // chore objects: { choreName, isWeekly, isCompleted, rating, childName, image, day }
    loading: Boolean,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null | String
  }
}
```

## Auth
- JWT stored in `localStorage` as `token`
- 1-hour expiry
- bcrypt password hashing (6 salt rounds)
- No protected route guard currently in frontend

## Git workflow
- Primary repo: `jamilagibson/ChorePal` (origin) — all PRs target this
- `upstream` remote (PinkFairyArmadilloo/ChorePal) — inactive, leave as-is
- After merging a PR: `git pull origin main` to update local main

## Backend startup
The server requires a real MongoDB Atlas URI in `/backend/config.env`:
```
ATLAS_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chorePal
SECRETKEY=<your_jwt_secret>
```
If the file has placeholder values the server will crash on `connectToServer()` with exit code 1.

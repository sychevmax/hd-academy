# HD Academy – Insurance Educational Portal (Frontend)

Modern React UI for the Insurance Glossary feature of the HD Academy portal. The app provides:
- Collapsible left sidebar with space for future features
- Glossary list with client-side paging (Load more)
- Debounced full‑text search
- Category filter
- Clean card layout with UK date formatting

Backend API (served by your Spring Boot app) follows this OpenAPI spec (summary):
- `GET /api/v1/glossary` – list all terms
- `GET /api/v1/glossary/{id}` – get a term by id
- `GET /api/v1/glossary/search?q=...` – full‑text search
- `GET /api/v1/glossary/category/{category}` – terms by category
- `GET /api/v1/glossary/categories` – list categories

The frontend calls these endpoints relative to the same origin (no hardcoded host), so local dev uses a small Node reverse proxy to keep everything under `http://localhost:8080`.

---

## Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven Wrapper for the backend project (Spring Boot)
- macOS/Windows/Linux supported. On macOS Big Sur you do NOT need Docker/Caddy; we use a Node proxy.

> Backend path (expected by defaults): `../../backend/hda-back` relative to this folder. You can override via `.env`.

---

## Quick start (Dev / HMR on http://localhost:8080)
This flow runs three processes: React (3000), Spring (8081), and a Node reverse proxy (8080).

Option A — One command (Makefile)
```
cd frontend/hda-front
make dev
```
- Proxy: http://localhost:8080 (single origin used by the browser)
- UI (CRA HMR): http://localhost:3000
- API (Spring Boot): http://localhost:8081

Option B — Manual (three terminals)
1. UI (HMR)
```
cd frontend/hda-front
npm install   # first time only
npm start     # runs on :3000
```
2. Backend (Spring)
```
cd ../../backend/hda-back
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```
3. Reverse proxy (keeps browser on :8080)
```
cd frontend/hda-front
npm run proxy   # starts dev-proxy.js on :8080
```
Open http://localhost:8080

Environment variables (optional)
- `PORT_PROXY` (default `8080`)
- `PORT_SPRING` (default `8081`)
- `PORT_UI` (default `3000`)
- `API_TARGET` (default `http://localhost:8081`)
- `UI_TARGET` (default `http://localhost:3000`)

Create a `.env` by copying `.env.example` to override ports/paths for your machine.

---

## Scripts
- `npm start` – CRA dev server on port 3000 (HMR)
- `npm run proxy` – Node reverse proxy on port 8080 (routes `/api/*` to Spring 8081, everything else to CRA 3000; supports WebSockets for HMR)
- `npm run build` – Production build to `build/`
- `npm test` – Jest tests (CRA default)
- `make dev` – Convenience target that starts proxy, UI, and Spring together

---

## Configuration
- API base path is hardcoded in the UI as `'/api/v1/glossary'` inside `src/api/glossaryApi.js`.
- The dev proxy ensures same‑origin requests: the browser stays on `http://localhost:8080`, while the proxy forwards:
  - `/api/*` → `http://localhost:8081`
  - everything else → `http://localhost:3000`
- Edit `dev-proxy.js` if you need different targets.

### .env variables
See `.env.example` for these keys (all optional):
```
FRONTEND_DIR=.
BACKEND_DIR=../../backend/hda-back
PORT_PROXY=8080
PORT_SPRING=8081
PORT_UI=3000
```

---

## Production-like run (optional)
You can serve the built React app from Spring Boot on port 8080. This requires your backend to be configured to serve static files and route non‑`/api/**` paths to `index.html`.

Typical steps:
1) Build UI in this folder:
```
npm run build
```
2) Copy `build/` into your Spring Boot `src/main/resources/static/` and configure an SPA fallback (WebMvcConfigurer).
3) Start Spring on 8080 and open http://localhost:8080

Note: The provided `Makefile` includes a `serve-ui` target, but it assumes your backend is already configured to serve static assets from `resources/static`. Adjust as needed in your backend project.

---

## App structure (high‑level)
- `src/components/Layout.jsx` – app shell with collapsible sidebar
- `src/components/SidebarMenu.jsx` – features list and category filter (fetches `/api/v1/glossary/categories`)
- `src/features/glossary/GlossaryPage.jsx` – loads terms (all/category), debounced search, paging via "Load more"
- `src/features/glossary/TermCard.jsx` – card UI per term (UK date formatting)
- `src/api/glossaryApi.js` – thin wrapper around backend endpoints
- `dev-proxy.js` – Node reverse proxy for local dev (single origin)

---

## Troubleshooting
- Port already in use
  - Change `PORT_PROXY`, `PORT_SPRING`, or `PORT_UI` in `.env` (and restart).
- Proxy works but `/api/...` returns 404/ECONNREFUSED
  - Ensure Spring is running on the correct port and that your controllers are under `/api/**`.
- HMR not updating
  - Make sure `npm start` is running on 3000. The proxy has `ws` enabled for WebSocket upgrades.
- Big Sur (macOS 11)
  - This setup uses only Node/Java; no Docker/Caddy required.

---

## License
Apache-2.0 (see backend license if different).

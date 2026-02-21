# DevCompass

Production-grade legal developer article aggregation and discovery platform.

## What it does
- Aggregates **metadata-only** developer articles from public APIs and RSS feeds.
- Prioritizes Dev.to API and supports a broad source registry across frontend, backend, AI, security, and language ecosystems.
- Enforces legal/ethical boundaries: robots.txt checks, no paywall bypass, no full copyrighted content storage.
- Exposes discovery APIs with category filtering and random article exploration.
- Provides a mobile-first React UI for browsing and discovery.

## Legal and Compliance Guardrails
- robots.txt is checked before each source fetch (`server/src/modules/sources/robots-checker.js`).
- Only source metadata is stored:
  - `title`
  - `description` (short preview)
  - `author`
  - `tags`
  - `coverImage`
  - `publishedAt`
  - `source`
  - `url`
  - `category`
  - `isRedirectOnly`
- Source URLs are validated and normalized; unsafe/internal URLs are blocked.
- UI always links to original source (`Read Original`) with `rel="noopener noreferrer"`.
- If full content is unavailable, preview text is shown and user is redirected to original source.

## Monorepo Structure
```text
.
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── lib
│   │   └── pages
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── config
│   │   ├── middlewares
│   │   ├── modules
│   │   │   ├── articles
│   │   │   ├── ingestion
│   │   │   └── sources
│   │   ├── routes
│   │   ├── scheduler
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs
│   └── architecture.md
├── .env.example
└── package.json
```

## Architecture (Clean Architecture Style)
- **Modules** encapsulate domain behavior (`articles`, `ingestion`, `sources`).
- **Controller → Service → Repository** flow in article module.
- **Ingestion orchestrator** handles source pulling, normalization, deduplication, and persistence.
- **Config layer** centralizes environment, logging, DB, cache.
- **Scheduler layer** triggers periodic refresh every 6 hours.

More details: `docs/architecture.md`
API reference: `docs/api.md`

## Backend API
Base URL: `http://localhost:4000/api`

### `GET /api/articles?category=ai&page=1&limit=20`
Returns paginated metadata-only articles.

### `GET /api/articles/random`
Returns one random article.
- Prefers unseen article IDs.
- Avoids repeating last source where possible.

### `GET /api/articles/hot?category=ai&limit=6`
Returns hottest/trending articles based on:
- recency boost
- source popularity boost
- topic buzz keywords (AI agents, MCP, WebGPU, Bun, etc.)
- tutorial/deep-dive signals

### `GET /api/categories`
Returns supported categories with counts.

### `GET /api/sources`
Returns source registry status including active/inactive state and last error.

### `POST /api/admin/refresh`
Triggers ingestion manually.
- Protected by header: `x-api-key: <ADMIN_API_KEY>`

## Categories
- AI
- Frontend
- Backend
- DevOps
- Mobile
- Security
- Programming Languages
- Architecture
- Career
- WebAssembly & Systems
- Edge & Serverless
- Developer Tooling
- Testing & QA
- Performance Engineering
- Browser Internals
- Data Engineering
- Accessibility
- Open Source Governance

Classification is automatic using title + tags + description keyword scoring.

## Caching Strategy
- Redis (optional) via `REDIS_URL`; falls back to in-memory cache.
- Cached artifacts:
  - article lists (5 min)
  - categories (10 min)
  - source statuses (10 min)
  - random endpoint state (24h)
- Cache invalidated after refresh jobs.

## Scheduler
- Cron: every 6 hours (`0 */6 * * *`)
- Source failures are isolated per source.
- Failed sources are marked inactive with a cooldown and retried later.
- Scheduler never crashes the process on source failure.

## Security Controls
Backend:
- Helmet headers
- CORS allowlist (`CLIENT_ORIGIN`)
- Rate limiting
- Zod validation for env/query/ingestion payloads
- API key-protected admin refresh route
- SSRF safeguards with strict URL and host checks
- robots.txt compliance gate before fetch

Frontend:
- No `dangerouslySetInnerHTML`
- External links use `noopener noreferrer`
- Metadata rendering only

## Local Setup
### Prerequisites
- Node.js 20+
- MongoDB 6+
- Optional Redis 7+

### 1. Install dependencies
```bash
npm install
npm run install:all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update at minimum:
- `server/.env`:
  - `MONGO_URI`
  - `ADMIN_API_KEY`
  - `CLIENT_ORIGIN`
- `client/.env`:
  - `VITE_API_BASE_URL`

### 3. Run development mode
```bash
npm run dev
```
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

### 4. Trigger ingestion manually (optional)
```bash
curl -X POST http://localhost:4000/api/admin/refresh \
  -H "x-api-key: replace-with-strong-api-key"
```

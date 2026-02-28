# DevCompass

Production-grade legal developer article aggregation and discovery platform.

## What it does
- Aggregates **metadata-only** developer articles from public APIs and RSS feeds.
- Prioritizes Dev.to API and supports a broad source registry across frontend, backend, AI, security, and language ecosystems.
- Enforces legal/ethical boundaries: robots.txt checks, no paywall bypass, no full copyrighted content storage.
- Exposes discovery APIs with category filtering and random article exploration.
- Provides a mobile-first React UI for browsing and discovery.
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
- UI always links to original source (`Read`) with `rel="noopener noreferrer"`.
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



# DevCompass API

Base URL: `http://localhost:4000/api`

## Auth
- Admin endpoint requires `x-api-key` header.

## Endpoints

### GET `/articles`
Query params:
- `category` (optional, case-insensitive: `ai`, `frontend`, etc.)
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 50)

Response:
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "limit": 20,
    "pages": 0
  }
}
```

### GET `/articles/random`
Returns one random article and uses cache-backed history to reduce repeats.

### GET `/articles/hot`
Query params:
- `category` (optional)
- `limit` (optional, default: 12, max: 40)

Returns ranked hot-topic articles with an additional `hotScore` field.

### GET `/categories`
Returns category list with counts.

### GET `/sources`
Returns configured source statuses:
- `key`
- `name`
- `endpoint`
- `hasArticles`
- `active`
- `blockedUntil`
- `lastError`

### POST `/admin/refresh`
Headers:
- `x-api-key: <ADMIN_API_KEY>`

Behavior:
- Triggers ingestion pipeline.
- Invalidates article/category/source caches.
- Returns ingestion report.

## Error Shape
```json
{
  "success": false,
  "message": "Validation failed"
}
```

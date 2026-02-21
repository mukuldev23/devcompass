# DevCompass Architecture

## Request Flow
1. Client sends request to API.
2. Controller validates and delegates to service.
3. Service checks cache first.
4. Repository fetches from MongoDB if cache miss.
5. Response is cached and returned.

## Ingestion Pipeline
1. Scheduler/admin trigger starts ingestion.
2. Orchestrator iterates source registry.
3. For each source:
   - checks source cooldown state
   - checks robots.txt allow rules
   - fetches public API or RSS metadata only
   - normalizes and validates with Zod
   - classifies categories
4. Deduplicate by URL.
5. Bulk upsert to MongoDB.
6. Mark source success/failure state.
7. Invalidate cache keys.

## Source Failure Strategy
- Source-level failure does not fail entire ingestion job.
- Source is marked inactive with `blockedUntil`.
- Scheduler retries after cooldown window.
- Errors are logged with pino.

## Data Model
### Article
- title
- description
- url (unique)
- source
- author
- tags[]
- category
- coverImage
- publishedAt
- isRedirectOnly
- createdAt / updatedAt

### SourceState
- sourceKey (unique)
- active
- failureCount
- lastError
- blockedUntil
- lastCheckedAt

## Compliance Enforcement
- robots.txt parsing + allow check
- no login/paywall bypass logic
- metadata-only storage model
- strict external URL validation
- direct source attribution in UI

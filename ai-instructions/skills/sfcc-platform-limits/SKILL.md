---
name: sfcc-platform-limits
description: Cheat-sheet and design patterns for surviving SFCC quotas and limits (script timeouts, HTTPClient call caps, session size, custom object quotas, file I/O restrictions, and headless rate limits). Use this when debugging enforced quota violations or designing scalable SFCC architectures.
---

# SFCC Platform Limits (Quota Survival Skill)

SFCC limits are not “edge cases”; they shape correct architecture. This skill is a pragmatic guide to:
- Recognizing limit symptoms
- Picking the correct workaround pattern
- Avoiding designs that will fail under load

## Quick Checklist

```text
[ ] Identify your execution context (storefront controller vs hook vs job)
[ ] Assume strict timeouts in hook/script contexts (design for the smallest budget)
[ ] Keep external calls bounded; cache aggressively; avoid chatty integrations
[ ] Never store large objects in session (store IDs; refetch/cache)
[ ] Never write files from storefront requests (offload to jobs)
[ ] Put retention policies on temporary custom objects from day one
```

## Common Limits → Symptoms → Fix Patterns

| Symptom | Likely limit | Fix pattern |
|---|---|---|
| “ScriptingTimeoutError” / request abort | Storefront script timeout | Move heavy work to jobs; reduce synchronous work; fail fast on services |
| Generic 500 from OCAPI hook | Hook execution timeout | Keep hooks lightweight; move heavy logic to async processing or custom endpoint |
| “Too many HTTPClient calls” / enforced quota | Outbound call cap per request | Aggregate calls (BFF), cache, pre-load via feeds/jobs |
| Session data truncation / instability | Session size cap | Store identifiers only; use cache or refetch |
| Errors creating custom objects | CO quotas / create-per-request cap | Consolidate data; implement purge jobs; avoid COs for transactional logging |
| “Page size limit exceeded” | Rendered HTML size cap | Pagination, remote includes, lazy loading, move logic out of templates |
| Storefront fails when writing files | Storefront file I/O = 0 | Use job + WebDAV download pattern |
| SCAPI returns 429 | Rate limiting / load shedding | Honor `Retry-After`; exponential backoff; client-side caching |

## Context Matters: Timeouts Differ

Design for the *most restrictive* context a script might run in.
- Storefront controllers can have relatively generous execution budgets.
- Hook/script contexts (OCAPI hooks, Page Designer scripts, etc.) can be much tighter.

Rule of thumb: if code could run in a hook, keep it hook-safe.

## Integration Limits: External Calls Must Be Budgeted

Common failure mode: a page that makes many independent external calls.

Preferred architecture:
- **Aggregation layer** (BFF/gateway): 1 call from SFCC, many calls downstream outside SFCC quotas
- **Aggressive caching** for anything not truly real-time
- **Data feeds via jobs** for data that can be slightly stale

## Session: Treat It Like a Tiny Backpack

- Store small primitives (IDs, flags), not full objects
- Prefer `session.privacy` for user-specific temporary values that should clear on logout

## Custom Objects: Treat Quotas as a Data Hygiene Contract

Anti-pattern: using custom objects as a high-volume event log.

Better:
- Put integration/event logs in an external system of record
- If you must store temporary records, define:
  - retention period
  - purge job
  - monitoring alerts

## Storefront File I/O: The Asynchronous File Pattern

When you need a file (export/report) initiated by a shopper:
1. Storefront creates a “token” record (status = pending)
2. Job generates file into WebDAV (`/impex/src/...`)
3. UI polls a lightweight endpoint for status
4. UI offers download link once complete
5. Purge token + old files

## Headless / Composable Notes

- Expect **HTTP 429**; design the client to retry responsibly
- Token churn can trigger SLAS limits; token caching + refresh flow correctness is mandatory
- Managed runtime proxies can enforce hard request timeouts; long-running work must be async + poll

## References
- Rhino Inquisitor: The SFCC Quota Gauntlet (platform limits)
  - https://www.rhino-inquisitor.com/a-survival-guide-to-sfcc-platform-limits/
- Salesforce Commerce API docs (timeouts troubleshooting)
  - https://developer.salesforce.com/docs/commerce/commerce-api/guide/timeout-troubleshoot.html

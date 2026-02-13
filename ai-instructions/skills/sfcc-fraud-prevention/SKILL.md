---
name: sfcc-fraud-prevention
description: Layered fraud prevention playbook for Salesforce B2C Commerce developers. Use this when adding fraud signals, designing a risk scoring approach, integrating third-party tools, or hardening checkout/login against bot-driven abuse.
---

# SFCC Fraud Prevention (Developer Playbook)

Fraud prevention in SFCC is a *system*, not a single feature. This skill focuses on practical developer responsibilities:
- Detectable signals you can implement
- Where to enforce checks
- How to store state safely
- How to avoid performance and quota pitfalls

## Quick Checklist

```text
[ ] Start at the edge: eCDN rules (block obvious bad traffic)
[ ] Enforce payment checks (AVS/CVV/3DS where available)
[ ] Add server-side validation (never trust the client)
[ ] Add velocity + behavior checks using minimal state
[ ] Ensure retention + purge jobs for any temporary state objects
[ ] Log decisions carefully (no PII leakage)
```

## Threat Taxonomy (Why It Matters to Code)

Common families you’ll see in data:
- Card-not-present fraud
- Account takeover (credential stuffing)
- “Friendly fraud” / chargebacks
- Bot-driven attacks (card testing, inventory hoarding)

Your job is to translate these into **signals** you can observe and validate.

## Actionable Signals (Implementation-Friendly)

| Signal type | Examples |
|---|---|
| Data mismatches | IP geolocation vs billing/shipping country; name/address anomalies |
| Velocity patterns | many attempts from same IP/email/device; repeated failures then success |
| Order characteristics | unusually large order; high-risk SKUs; rush shipping |
| Identity indicators | disposable email; gibberish names; repeated address reuse |

## Layered Defense Architecture

### 1) Edge controls (before app servers)
- Use **eCDN custom rules** to block/limit known abusive traffic patterns.
- Rate-limit endpoints that are common bot targets (login, add-to-cart, checkout).

### 2) Platform + processor basics
- Enable/enforce payment gateway features like **AVS** and **CVV** checks.
- Prefer adding friction only when risk is elevated.

### 3) Server-side rules and scoring
Where to implement depends on architecture:
- **SFRA**: controller middleware + fraud detection script points
- **Headless**: keep hook logic minimal; consider custom endpoints for heavier checks

A practical approach:
- Compute a numeric risk score from signals (0–100)
- Block above a threshold; challenge (CAPTCHA/step-up) in mid-range; allow below threshold

## State Storage (Don’t Create a Quota Time Bomb)

If you store historical signals:
- Use a minimal schema (counts + timestamps), not raw event logs
- Define retention policy and a purge job from day one

If you must store per-session state:
- Prefer session privacy storage for small values

## Logging & Observability

- Log risk decisions with correlation IDs and *redacted* values
- Avoid writing PII into shared logs

See also: `sfcc-logging` and `sfcc-security`.

## When to Buy Instead of Build

Third-party fraud tools can be the correct choice when:
- You need global intelligence across merchants
- You need chargeback guarantees
- You are being hit by sophisticated bot abuse

Build custom logic when:
- You need business-specific heuristics
- You have clear signals + small scope
- You can commit to continuous tuning (false positives are costly)

## References
- Rhino Inquisitor: A Developer’s Guide to Combating Fraud on SFCC
  - https://www.rhino-inquisitor.com/a-dev-guide-to-combating-fraud-on-sfcc/
- Salesforce: Bot management guidance (high-level responsibility model)
  - https://developer.salesforce.com/docs/commerce/commerce-solutions/guide/bot-management.html

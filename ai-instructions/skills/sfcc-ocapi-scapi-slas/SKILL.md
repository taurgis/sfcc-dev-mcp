---
name: sfcc-ocapi-scapi-slas
description: Decision guide for OCAPI vs SCAPI, and practical SLAS token lifecycle guidance (guest tokens, refresh rotation, public vs private clients, and hybrid SFRA/headless auth). Use this when planning integrations or debugging auth/rate-limit issues.
---

# OCAPI vs SCAPI vs SLAS (Decision & Operations Skill)

This skill is for architecture decisions and recurring operational pitfalls:
- When to choose OCAPI vs SCAPI
- What SLAS rate limiting implies (429 + Retry-After)
- How to manage SLAS tokens correctly
- Hybrid auth implications in SFRA + headless setups

## Quick Checklist

```text
[ ] Identify the consumer: storefront server, backend system, or headless client
[ ] For shopper APIs, prefer SCAPI + SLAS when the endpoint exists
[ ] For admin APIs, use SCAPI Admin + Account Manager (AM), not SLAS
[ ] Expect 429 + Retry-After from SLAS; implement backoff + caching
[ ] Cache SLAS tokens within the correct scope (don't request a token per API call)
[ ] Refresh tokens rotate for public clients; private clients may be reusable
[ ] Avoid refresh-token race conditions (single-flight refresh per shopper)
[ ] Choose OAuth client type correctly: public vs private
[ ] Include channel_id in guest token requests when required
```

## OCAPI vs SCAPI: Practical Criteria

| Consideration | OCAPI | SCAPI |
|---|---:|---:|
| Shopper APIs | OCAPI endpoints can accept SLAS JWTs when the SLAS client is allowed | Shopper APIs are SLAS-first |
| Admin APIs | OCAPI uses OCAPI client configuration | Admin APIs use Account Manager (AM), not SLAS |
| Coverage | Often broader legacy coverage | Growing; may have gaps |
| Rate limiting | OCAPI client limits | SLAS and shopper endpoints return 429 + Retry-After |

Rule of thumb:
- If you're building a **headless storefront**, SCAPI + SLAS is typically the default.
- If you need an API that SCAPI doesn't provide, OCAPI may still be necessary.
- For admin operations, use SCAPI Admin APIs with AM tokens and avoid shopper SLAS tokens.

## SLAS: Token Lifecycle (The Most Common Failure)

### Token lifetimes are explicit
Access tokens are documented at roughly 30 minutes, while refresh token validity varies by shopper type and environment. Plan caching and refresh logic around these constraints, and confirm the current values for your org.

### Token caching is (practically) required
If you request a new guest/login token repeatedly, you'll burn SLAS limits and create intermittent auth failures.

Cache tokens at the right scope:
- **Browser/PWA**: per shopper session/device (never share tokens across shoppers)
- **BFF/server**: per shopper session, or per server session key you control

In other words: cache aggressively, but never "globally" in a way that can mix identities.

Also cache stable endpoints (JWT/JWKS/config) where possible and honor `Retry-After` when SLAS returns 429.

### Refresh token rotation
Refresh token rotation applies to public clients, while private clients may receive reusable refresh tokens:
- Public clients: exchanging a refresh token returns a **new** refresh token.
- You must persist and use the **new** refresh token for subsequent refreshes.
- Reusing the old refresh token typically fails (for example `400 Invalid Refresh Token`).

If a new refresh token is returned, always store it atomically before the next request.

Operational pitfall: parallel refreshes can invalidate each other. Ensure only one refresh happens at a time per shopper (single-flight / mutex) and that the stored refresh token is updated atomically.

### Public vs private clients
- **Public client**: secrets cannot be protected (browser SPA, mobile app)
- **Private client**: secret can be stored server-side (BFF)

Choose correctly; it affects your security posture and which OAuth flows you should use.
Practical default:
- Public clients: authorization code + PKCE (no client secret in the client)
- Private clients: server-side flows (client secret stays on the server)

### Grant type pitfalls (guest vs registered)
- Public guest shoppers: use `authorization_code_pkce` (not `client_credentials`).
- Private guest shoppers: use `client_credentials`.
- Registered shoppers: use `authorization_code_pkce` (public) or `authorization_code` / `authorization_code_pkce` (private).

### Service protection (409)
SLAS may return 409 responses when the same endpoint is called repeatedly with the same USID in a short time. This usually indicates token churn or retry storms. Reduce token issuance and serialize refresh requests.

## Hybrid SFRA + Headless

Older approach: cartridge-based bridging (e.g. `plugin_slas`) can introduce:
- multiple remote calls during login/registration/session refresh
- increased risk of hitting per-request API call budgets/quotas in storefront flows
- operational overhead (patching + regression)

Newer approach: platform-native hybrid authentication (B2C Commerce 25.3+) reduces that integration tax, but requires the `sfcc.session_bridge` scope and keeping the `dwsid` and SLAS JWT in sync. Review required headers/cookies for your architecture before rollout.

## References
- Salesforce: SLAS guide
  - https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/slas.html
- Salesforce: Authorization for Shopper APIs
  - https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/authorization-for-shopper-apis.html
- Salesforce: Commerce API authorization (Account Manager)
  - https://developer.salesforce.com/docs/commerce/commerce-api/guide/authorization.html
- Salesforce: Hybrid Auth (Commerce API)
  - https://developer.salesforce.com/docs/commerce/commerce-api/guide/hybrid-authentication.html
- Rhino Inquisitor: OCAPI versus SCAPI
  - https://www.rhino-inquisitor.com/in-the-ring-ocapi-versus-scapi/
- Rhino Inquisitor: SLAS in SFRA or SiteGenesis (Hybrid Auth + security mandates)
  - https://www.rhino-inquisitor.com/slas-in-sfra-or-sitegenesis/
- Salesforce: Hybrid Auth overview
  - https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/hybrid-auth.html

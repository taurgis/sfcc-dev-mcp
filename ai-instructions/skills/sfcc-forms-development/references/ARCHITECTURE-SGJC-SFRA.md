# Advanced SFCC Forms Architecture (SiteGenesis vs SFRA)

This reference is for architects and senior devs designing or migrating form flows (login, registration, checkout, account, complex configuration).

## 1) Architectural Foundations

The SFCC Forms Framework is not “just HTML forms.” It is a stateful, server-side framework that:
- instantiates a form object from XML definitions
- maintains state across requests (session-scoped)
- enforces server-side type/constrain validation
- supports complex multi-step flows

### XML Form Definition = Server-Side Contract

Form XML defines:
- structure (fields/groups/lists)
- parsing rules + constraints
- resource keys (labels + errors)
- action-level validation behavior

Treat it like a schema contract between templates and controllers.

## 2) Form Object Lifecycle

- Form instances are stored in session scope.
- State persists unless cleared.
- Locale changes can invalidate/clear session form values.

Operational rules:
- Clear before rendering a “fresh” form.
- Clear after successful submission to prevent resubmission and leakage.

## 3) Validation Strategy (Defense in Depth)

### Client-side validation

- Purpose: UX and immediate feedback.
- Security: none (can be bypassed).

### Server-side validation

- Authoritative gate.
- Runs against XML constraints automatically.

Per-field precedence (typical):
1. parsing/type/regexp
2. mandatory
3. range/length bounds
4. custom invalidation

## 4) Security Architecture

### CSRF

Use the platform’s synchronizer token pattern correctly:
- Generate token on form render.
- Require token on any state-changing POST.

SFRA:
- Use CSRF middleware (`generateToken` on GET; `validateRequest` / `validateAjaxRequest` on POST).

SiteGenesis:
- Use `dw.web.CSRFProtection` explicitly (validate early, before processing).

### XSS

Forms are major injection vectors.

Rule:
- Always output-encode user-provided values in ISML.

When rendering user data, prefer explicit encoding contexts (e.g., HTML content).

### DoS / Payload abuse

- Always set `max-length` on string fields.
- Avoid expensive regex patterns.
- Keep server-side validation and error generation efficient.

## 5) Persistence and Transaction Management

All writes to persistent objects must occur inside a transaction:
- Use `dw.system.Transaction.wrap`.

Guidelines:
- Keep transactions short.
- Do not do network calls inside transactions.
- Map values explicitly when persisting (avoid mass assignment).

### SFRA: route:BeforeComplete pattern

A robust pattern is:
- validate + decide outside the transaction
- register persistence in `route:BeforeComplete`
- write data inside `Transaction.wrap`

This keeps the request pipeline clean and reduces accidental double-writes.

## 6) SiteGenesis (SGJC) vs SFRA: Key Differences

| Concern | SiteGenesis (SGJC) | SFRA |
|---|---|---|
| Controller model | guard-driven actions (classic) | middleware chains (`server.get/post`) |
| Form access | `pdict.CurrentForms` / `app.getForm` | `server.forms.getForm()` |
| Template coupling | templates can touch live session form | templates should consume serialized form data |
| CSRF | often manual validation | middleware-driven |
| Persistence | mixed into controller callbacks | often isolated via `route:BeforeComplete` |
| Binding style | can be implicit/mass assignment | explicit assignment encouraged |

### SiteGenesis specifics

- Input names are generated and can vary (commonly `dwfrm_...`).
- Templates must use generated names (e.g., `field.htmlName`) rather than hardcoding.

## 7) Migration Checklist (SiteGenesis ➜ SFRA)

1. Copy XML form definitions into the SFRA cartridge.
2. Ensure labels/errors live in resource bundles (`templates/resources/*.properties`).
3. Replace guard controller logic with SFRA routes.
4. Enforce:
   - HTTPS
   - POST-only for state changes
   - CSRF middleware validation
5. Replace implicit binding with explicit mapping inside `Transaction.wrap`.
6. Update templates to:
   - use SFRA view model
   - inject CSRF using `pdict.csrf.*`
   - output-encode displayed values
7. Clear form state at appropriate times.

## 8) Secure Forms Checklist

```text
[ ] POST + HTTPS enforced
[ ] CSRF validate before touching form data
[ ] Server-side validation gates all writes
[ ] Transactions are short and isolated
[ ] Explicit mapping for writes
[ ] max-length on strings
[ ] Regex patterns are conservative
[ ] Output encoding for any user data
[ ] Clear session form state (pre-render and/or post-success)
```

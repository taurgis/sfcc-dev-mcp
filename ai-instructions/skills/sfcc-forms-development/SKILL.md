---
name: sfcc-forms-development
description: Guide for building, validating, securing, and persisting SFCC storefront forms (SFRA + SiteGenesis patterns). Use this when creating or troubleshooting form XML, controller handling, CSRF, and validation.
---

# SFCC Forms Development Skill

This skill guides you through implementing and troubleshooting the Salesforce B2C Commerce Forms Framework.

It covers:
- XML form definitions (schema, constraints, localization, reuse)
- Controller patterns (SFRA middleware, request handling, persistence)
- Secure validation (server-side first, CSRF/XSS protections)
- Migration guidance (SiteGenesis ➜ SFRA)

## When to Use

Use this skill when you need to:
- Create or modify a form definition in `cartridge/forms/**`.
- Render forms in ISML using the platform’s generated field metadata.
- Process POST submissions safely (CSRF, server-side validation, transactions).
- Add custom validation beyond XML constraints.
- Migrate legacy SiteGenesis form flows to SFRA.

## Quick Checklist (Production-Grade Forms)

```text
[ ] Form routes are POST-only and HTTPS-only
[ ] CSRF token is generated on GET and validated on POST
[ ] Server-side validation gate exists (do not trust client validation)
[ ] All string fields have max-length (DoS & storage safety)
[ ] Regex is conservative (avoid catastrophic backtracking)
[ ] Persistence happens inside Transaction.wrap
[ ] SFRA persistence is isolated in route:BeforeComplete where appropriate
[ ] Explicit mapping for writes (avoid mass assignment)
[ ] Form state cleared when appropriate (pre-render or after success)
[ ] User-provided values are output-encoded in ISML
```

## File Locations

### Form XML

Forms are defined per cartridge:

```
/my-cartridge
  /cartridge
    /forms
      /default
        profile.xml
        contact.xml
      /de_DE
        profile.xml
```

### Form Labels + Error Messages (Localization)

Resource bundles typically live in:

```
/my-cartridge
  /cartridge
    /templates
      /resources
        forms.properties
        forms_de_DE.properties
```

## Architecture Notes (Know the Moving Parts)

- Form XML is a strict server-side contract: it defines types, constraints, and errors.
- Form instances are stored in session scope (stateful across requests) and must be cleared deliberately.
- Client-side validation is UX; server-side validation is authoritative.

For deeper context and SFRA vs SiteGenesis architectural differences, see:
- [references/ARCHITECTURE-SGJC-SFRA.md](references/ARCHITECTURE-SGJC-SFRA.md)

## Form Definition (XML)

### Minimal Example

Keep examples small, but always include:
- strict types
- max-length for strings
- mandatory + missing-error where needed
- parse/range errors for format/constraint enforcement

```xml
<?xml version="1.0" encoding="UTF-8"?>
<form xmlns="http://www.demandware.com/xml/form/2008-04-19">
    <field formid="email" type="string"
           label="form.email.label"
           mandatory="true"
           max-length="254"
           regexp="^[^@\s]+@[^@\s]+\.[^@\s]+$"
           missing-error="form.email.required"
           parse-error="form.email.invalid"/>

    <action formid="submit" valid-form="true"/>
</form>
```

### Reuse and Modularity

Prefer `include` to avoid duplicating complex groups (e.g., an address group reused in checkout, profile, and gift registry).

See the cheat sheet:
- [references/FORM-XML-CHEATSHEET.md](references/FORM-XML-CHEATSHEET.md)

## Controller Patterns

### SFRA: Render Form (GET)

Goals:
- clear stale state when rendering an “empty” form
- generate a CSRF token

```javascript
'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('Show',
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var form = server.forms.getForm('contact');
        form.clear();

        res.render('forms/contact', {
            contactForm: form
        });
        next();
    }
);

module.exports = server.exports();
```

### SFRA: Handle Submission (POST)

Goals:
- validate CSRF first
- gate all business logic on `form.valid`
- isolate DB writes inside `Transaction.wrap`
- prefer `route:BeforeComplete` for persistence to keep transaction boundaries tight

```javascript
'use strict';

var server = require('server');
var Transaction = require('dw/system/Transaction');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.post('Submit',
    server.middleware.https,
    csrfProtection.validateRequest,
    function (req, res, next) {
        var form = server.forms.getForm('contact');

        if (!form.valid) {
            // SFRA base commonly provides a helper like */cartridge/scripts/formErrors.
            // Prefer using it when available.
            res.json({
                success: false,
                fieldErrors: getFormErrorsSafe(form)
            });
            return next();
        }

        var email = form.email.value;
        var message = form.message && form.message.value;

        this.on('route:BeforeComplete', function () {
            Transaction.wrap(function () {
                // Persist explicitly (no mass assignment)
                // e.g. save a Custom Object, update profile, create a case, etc.
                // Keep only assignments inside the transaction.
            });

            form.clear();
        });

        res.json({ success: true });
        next();
    }
);

function getFormErrorsSafe(form) {
    try {
        var formErrors = require('*/cartridge/scripts/formErrors');
        if (formErrors && typeof formErrors.getFormErrors === 'function') {
            return formErrors.getFormErrors(form);
        }
    } catch (e) {
        // Optional dependency; fall back if not present.
    }
    return {};
}

module.exports = server.exports();
```

Notes:
- Use `csrfProtection.validateAjaxRequest` if your route expects AJAX conventions.
- Keep transactions short: no remote API calls, no heavy computation inside `Transaction.wrap`.

### SiteGenesis (SGJC): Key Differences

- Form is typically accessed via `app.getForm('id')` and rendered via `pdict.CurrentForms`.
- Templates must use generated `htmlName` (SiteGenesis uses `dwfrm_` prefixes + session-specific IDs).
- CSRF is often handled manually via `dw.web.CSRFProtection`.

Use this for migration and pitfalls:
- [references/ARCHITECTURE-SGJC-SFRA.md](references/ARCHITECTURE-SGJC-SFRA.md)

## ISML Rendering Rules

### Always Use Generated Field Metadata

- Prefer `field.htmlName` over hardcoded names.
- Use server-provided `pdict.csrf.*` when using SFRA CSRF middleware.

Typical SFRA token:

```html
<input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.token}" />
```

### XSS Safety

When outputting user-provided values, ensure the context is encoded (default output encoding is usually safe, but be deliberate):

```html
<isprint value="${pdict.contactForm.email.value}" encoding="htmlcontent" />
```

## Custom Validation

Use custom validation for business rules that XML cannot express (uniqueness checks, cross-field constraints, etc.).

Patterns:
- Field-level: invalidate a specific field.
- Group-level: invalidate the group for cross-field rules.
- Form-level: invalidate the form for global errors.

Keep custom validation server-side. Client-side validation is optional and must never be the security gate.

## Related Skills

- `sfcc-security` (CSRF, XSS, input validation)
- `sfcc-sfra-controllers` (middleware patterns, response handling)
- `sfcc-isml-development` (safe output encoding, template constraints)
- `sfcc-localization` (resource bundles, locale fallback)

## References

- [references/FORM-XML-CHEATSHEET.md](references/FORM-XML-CHEATSHEET.md)
- [references/ARCHITECTURE-SGJC-SFRA.md](references/ARCHITECTURE-SGJC-SFRA.md)

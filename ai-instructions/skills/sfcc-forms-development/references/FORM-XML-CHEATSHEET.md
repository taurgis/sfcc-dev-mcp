# SFCC Form XML Cheat Sheet

This is a practical reference for the storefront Forms Framework XML definitions found under `cartridge/forms/**`.

## What the XML Controls

- Form structure (fields, groups, lists)
- Data types and parsing
- Built-in constraint validation
- Resource keys for labels/descriptions/errors
- Actions (which submissions trigger full validation)

## Minimum Recommended Constraints

| Field Type | Must Have | Why |
|---|---|---|
| `string` | `max-length` | Prevent overly large payloads; reduce DoS/storage risk |
| `string` + regexp | conservative `regexp` | Avoid ReDoS and ambiguous formats |
| `integer` / `number` | `min`/`max` (when applicable) | Prevent negative/invalid ranges |
| any mandatory | `missing-error` | Clear, localized feedback |

## Core Elements

### `<form>`

```xml
<form xmlns="http://www.demandware.com/xml/form/2008-04-19">
    <!-- fields / groups / lists / actions -->
</form>
```

### `<field>`

Common attributes (subset):

- `formid` (required): identifier
- `type` (required): `string`, `integer`, `number`, `boolean`, `date`
- `label`: resource key
- `mandatory`: `true|false`
- `max-length` / `min-length` (strings)
- `min` / `max` (numbers)
- `regexp` (strings)
- `format` (dates)
- error keys: `missing-error`, `parse-error`, `range-error`, `value-error`

Example:

```xml
<field formid="postalCode" type="string"
       label="form.address.postal"
       mandatory="true"
       max-length="20"
       regexp="^[A-Za-z0-9\-\s]{3,20}$"
       missing-error="form.address.postal.required"
       parse-error="form.address.postal.invalid"/>
```

### Error Key Semantics (Server-Side)

When a form is submitted, constraint checks are evaluated in a predictable “first failing rule wins” manner for each field:

1. Parse/type/regexp problems → `parse-error`
2. Mandatory empty → `missing-error`
3. Range / min/max / length bounds → `range-error`
4. Script-triggered invalidation → `value-error` (or custom key)

### `<group>`

Use groups to namespace complex objects like addresses.

```xml
<group formid="shippingAddress">
    <field formid="firstName" type="string" mandatory="true" max-length="50"/>
    <field formid="lastName" type="string" mandatory="true" max-length="50"/>
</group>
```

Controller access pattern:

```text
form.shippingAddress.firstName.value
```

### `<list>`

Use lists for repeated groups (saved addresses, payment instruments, etc.).

Guideline:
- Treat list items as independent sub-forms with their own validity.
- Avoid deeply nested lists; keep templates and controller logic readable.

### `<action>`

Actions decide whether “valid form” constraints run.

```xml
<action formid="submit" valid-form="true"/>
<action formid="cancel" valid-form="false"/>
```

## Reuse via `<include>`

Use includes to avoid repeating canonical definitions (address, phone, etc.).

Pattern:
- Create an address form definition once.
- Include it into checkout/profile forms.

This keeps validation consistent and reduces drift.

## Locale-Specific Definitions

If the structure truly differs by locale (not just labels), define locale-specific XML:

```
/forms/default/profile.xml
/forms/pt_BR/profile.xml
```

The platform loads the best match for the current request locale.

## Anti-Patterns

- No `max-length` on string fields.
- Aggressive, complex regex patterns (risk of catastrophic backtracking).
- Hardcoding labels/errors instead of resource keys.
- Depending on implicit binding/mass assignment to persist sensitive fields.

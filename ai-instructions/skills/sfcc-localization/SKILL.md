````skill
---
name: sfcc-localization
description: Guide for localizing templates, forms, and content in Salesforce B2C Commerce. Use this when asked to implement multi-language support, resource bundles, locale-specific content, or internationalization features.
---

# Localization Skill

This skill guides you through localizing B2C Commerce storefronts for multiple languages and regions.

## Quick Checklist
SFCC localization at a glance:

| Area | Approach |
|------|----------|
| Templates | Single template set + resource bundles |
| Forms | Shared XML + localized labels/errors |
| Static assets | Locale-specific folders when assets contain text |
| Product/content | Use localizable attributes and content assets |

## Locale Basics

- Format: `{language}_{country}` (e.g., `en_US`, `fr_CA`)
- Fallback chain example: `fr_CA` → `fr` → default bundle
- Property files **must** be UTF-8

## Core Principles

1) No hardcoded strings (templates, controllers, JS).  
2) Use parameters instead of concatenation for dynamic text.  
3) Keep bundles organized by feature (account, checkout, search).  
4) Drive dates/currency/numbers from locale settings.  
5) Keep locale switching consistent in URLs/navigation.

## Minimal Examples

```html
<!-- Template text -->
<h1>${Resource.msg('account.title', 'account', null)}</h1>
<p>${Resource.msgf('cart.itemCount', 'cart', null, pdict.cart.items)}</p>

<!-- Form label via resource key (in XML) -->
<field formid="email" label="form.email.label" ... />

<!-- Locale-aware static asset -->
<img src="${URLUtils.staticURL('/images/buttons/submit.png')}" alt="Submit"/>
```

## Common Pitfalls

- Hardcoded UI text in templates or client JS
- Concatenated strings instead of parameterized messages
- Missing UTF-8 encoding on `.properties`
- Locale switcher that drops query/path context
- Remote includes serving localized fragments without proper cache keys

## Where to Go Next (References)

- [Resource Bundles](references/RESOURCE-BUNDLES.md)
- [Static Files](references/STATIC-FILES.md)
- [Forms Localization](references/FORMS-LOCALIZATION.md)
- [Controllers](references/CONTROLLERS.md)
- [Locale Switching](references/LOCALE-SWITCHING.md)
- [Formatting](references/FORMATTING.md)
- [JavaScript Localization](references/JAVASCRIPT-LOCALIZATION.md)
- [Properties & Encoding](references/PROPERTIES-ENCODING.md)
- [Testing Localization](references/TESTING.md)
- [Localization Patterns](references/PATTERNS.md)

## MCP Documentation Tools

```javascript
search_sfcc_classes("Locale")
get_sfcc_class_info("dw.util.Locale")
get_sfcc_class_info("dw.web.Resource")
get_sfcc_class_info("dw.util.StringUtils")
```
// Get Locale class documentation
get_sfcc_class_info("dw.util.Locale")

// Get Resource bundle documentation  
get_sfcc_class_info("dw.web.Resource")

// Get StringUtils for formatting
get_sfcc_class_info("dw.util.StringUtils")
```

## Detailed Reference

- [Localization Patterns](references/PATTERNS.md) - Complete patterns and examples for resource bundles, templates, controllers, and JavaScript

````

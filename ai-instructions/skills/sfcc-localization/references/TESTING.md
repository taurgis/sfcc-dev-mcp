# Testing Localization

## Pseudo-Localization

Use a test bundle to surface hardcoded strings:

```properties
# pseudo.properties
button.submit=[Submit]
account.title=[My Account]
```

## Checklist

- All visible text comes from resource bundles
- Date/time formats use locale settings
- Currency and numbers render with locale separators
- Images with text have locale variants if needed
- Email templates send in the correct language
- JavaScript strings originate from bundles
- Fallback chain behaves as expected (e.g., fr_CA → fr → default)

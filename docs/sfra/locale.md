# SFRA Locale Model

## Overview

The Locale model represents current locale information and provides locale switching functionality for internationalized SFRA applications. It manages country codes, currency codes, language settings, and available locale options for site visitors.

## Constructor

```javascript
function Locale(currentLocale, allowedLocales, siteId)
```

Creates a Locale model instance with current locale information and available locale options.

### Parameters

- `currentLocale` (dw.util.Locale) - Current locale of the request
- `allowedLocales` (string) - List of allowed locales for the site
- `siteId` (string) - ID of the current site

## Properties

### locale
**Type:** Object

Object containing comprehensive locale information:

- `countryCode` (string) - Country code for the current locale
- `name` (string) - Display name of the country
- `currencyCode` (string) - Currency code for the locale
- `displayName` (string) - Full display name of the locale
- `language` (string) - Language code
- `displayLanguage` (string) - Display name of the language
- `localeLinks` (Array<Object>) - Available locale options for switching
- `localLinks` (Array<Object>) - **Deprecated** - Same as localeLinks (kept for backward compatibility)

### Locale Link Objects

Each object in `localeLinks` contains:
- `localID` (string) - Locale identifier
- `country` (string) - Country code
- `displayCountry` (string) - Country display name
- `currencyCode` (string) - Currency code for the locale
- `displayName` (string) - Full locale display name
- `language` (string) - Language code
- `displayLanguage` (string) - Language display name

## Helper Functions

### getLocaleLinks(allowedLocales, siteId, currentLocaleID)
Returns available locale options for site locale switching.

**Parameters:**
- `allowedLocales` (string) - List of allowed locales for the site
- `siteId` (string) - Current site ID
- `currentLocaleID` (string) - Current locale ID

**Returns:** Array<Object> - Array of available locale options (excluding current locale)

### isLocaleValid(currentLocale)
Validates that a locale object is properly formed.

**Parameters:**
- `currentLocale` (dw.util.Locale) - Locale to validate

**Returns:** boolean - True if locale has required ID property

## Usage Example

```javascript
var LocaleModel = require('*/cartridge/models/locale');
var Site = require('dw/system/Site');

var currentLocale = request.getLocale();
var allowedLocales = Site.getCurrent().getAllowedLocales();
var siteId = Site.getCurrent().getID();

var localeModel = new LocaleModel(currentLocale, allowedLocales, siteId);

// Access current locale information
console.log(localeModel.locale.countryCode);      // "US"
console.log(localeModel.locale.currencyCode);     // "USD"
console.log(localeModel.locale.displayLanguage);  // "English"

// Access available locale options
localeModel.locale.localeLinks.forEach(function(link) {
    console.log(link.displayName + ' (' + link.currencyCode + ')');
    // Output: "English (United Kingdom) (GBP)", "Français (France) (EUR)", etc.
});
```

## Backward Compatibility

The model includes both `localeLinks` and `localLinks` properties:
- **localeLinks** - Correct property name (use this)
- **localLinks** - Deprecated typo maintained for backward compatibility

**Note**: The SFRA team plans to remove the `localLinks` property in a future version.

## Fallback Handling

If the current locale is invalid or missing:
- Falls back to the first country in the countries configuration
- Ensures the model always has valid locale information
- Prevents errors in locale-dependent functionality

## Integration with Countries Configuration

The model relies on a countries configuration file (`*/cartridge/config/countries`) that defines:
- Available countries and locales
- Currency codes for each locale
- Locale-specific configurations

## Notes

- Excludes the current locale from the locale switching links
- Provides comprehensive locale information for internationalization
- Handles invalid locales gracefully with fallbacks
- Supports multi-currency and multi-language sites
- Integrates with SFCC's built-in locale system

## Related Models

- **Site Configuration** - Defines allowed locales
- **Currency Models** - May use currency information
- **Address Models** - May use country information for formatting

## Package: dw.system

# Class Site

## Inheritance Hierarchy

- Object
  - dw.system.Site

## Description

This class represents a site in Commerce Cloud Digital and provides access to several site-level configuration values which are managed from within the Business Manager. It is only possible to get a reference to the current site as determined by the current request. The static method getCurrent() returns a reference to the current site.

## Constants

## Properties

### allowedCurrencies

**Type:** List (Read Only)

The allowed currencies of the current site as a collection of
 currency codes.

### allowedLocales

**Type:** List (Read Only)

The allowed locales of the current site as a collection of
 locale ID's.

### allSites

**Type:** List (Read Only)

All sites.

### calendar

**Type:** Calendar (Read Only)

A new Calendar object in the time zone of the
 current site.

### currencyCode

**Type:** String (Read Only)

The default currency code for the current site.

### current

**Type:** Site (Read Only)

The current site.

### defaultCurrency

**Type:** String (Read Only)

The default currency code for the current site.

### defaultLocale

**Type:** String (Read Only)

Return default locale for the site.

### einsteinSiteID

**Type:** String (Read Only)

The Einstein site Id. Typically this is a concatenation of the realm, underscore character and the site id.
 It can be overwritten by support users to help with realm moves to continue using the Einstein data from the old realm.
 Used when making calls to the Einstein APIs.

### httpHostName

**Type:** String (Read Only)

The configured HTTP host name. If no host name
 is configured the method returns the instance hostname.

### httpsHostName

**Type:** String (Read Only)

The configured HTTPS host name. If no host name
 is configured the method returns the HTTP host name or the instance hostname, if
 that is not configured as well.

### ID

**Type:** String (Read Only)

The ID of the site.

### name

**Type:** String (Read Only)

A descriptive name for the site.

### OMSEnabled

**Type:** boolean (Read Only)

Whether oms is active in the current site. This depends on a general
 property which states whether oms is active for the server,
 and a site-dependent preference whether oms is available for the current site.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags, defined for this instance for which content can be generated.

 The meta tag content is generated based on the home page meta tag context and rules.
 The rules are obtained from the current repository domain.

### preferences

**Type:** SitePreferences (Read Only)

This method returns a container of all site preferences of this site.

### status

**Type:** Number (Read Only)

The status of this site.
 
 Possible values are SITE_STATUS_ONLINE, SITE_STATUS_MAINTENANCE, SITE_STATUS_PROTECTED

### timezone

**Type:** String (Read Only)

The code for the time zone in which the storefront is
 running.

### timezoneOffset

**Type:** Number (Read Only)

Returns time zone offset in which the storefront is running.

## Constructor Summary

## Method Summary

### getAllowedCurrencies

**Signature:** `getAllowedCurrencies() : List`

Returns the allowed currencies of the current site as a collection of currency codes.

### getAllowedLocales

**Signature:** `getAllowedLocales() : List`

Returns the allowed locales of the current site as a collection of locale ID's.

### getAllSites

**Signature:** `static getAllSites() : List`

Returns all sites.

### getCalendar

**Signature:** `static getCalendar() : Calendar`

Returns a new Calendar object in the time zone of the current site.

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Returns the default currency code for the current site.

### getCurrent

**Signature:** `static getCurrent() : Site`

Returns the current site.

### getCustomPreferenceValue

**Signature:** `getCustomPreferenceValue(name : String) : Object`

Returns a custom preference value.

### getDefaultCurrency

**Signature:** `getDefaultCurrency() : String`

Returns the default currency code for the current site.

### getDefaultLocale

**Signature:** `getDefaultLocale() : String`

Return default locale for the site.

### getEinsteinSiteID

**Signature:** `getEinsteinSiteID() : String`

Returns the Einstein site Id.

### getHttpHostName

**Signature:** `getHttpHostName() : String`

Returns the configured HTTP host name.

### getHttpsHostName

**Signature:** `getHttpsHostName() : String`

Returns the configured HTTPS host name.

### getID

**Signature:** `getID() : String`

Returns the ID of the site.

### getName

**Signature:** `getName() : String`

Returns a descriptive name for the site.

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

Returns the page meta tag for the specified id.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags, defined for this instance for which content can be generated.

### getPreferences

**Signature:** `getPreferences() : SitePreferences`

This method returns a container of all site preferences of this site.

### getStatus

**Signature:** `getStatus() : Number`

Returns the status of this site.

### getTimezone

**Signature:** `getTimezone() : String`

Returns the code for the time zone in which the storefront is running.

### getTimezoneOffset

**Signature:** `getTimezoneOffset() : Number`

Returns time zone offset in which the storefront is running.

### isOMSEnabled

**Signature:** `isOMSEnabled() : boolean`

Whether oms is active in the current site.

### setCustomPreferenceValue

**Signature:** `setCustomPreferenceValue(name : String, value : Object) : void`

The method sets a value for a custom preference.

## Method Detail

## Method Details

### getAllowedCurrencies

**Signature:** `getAllowedCurrencies() : List`

**Description:** Returns the allowed currencies of the current site as a collection of currency codes.

**Returns:**

Collection of allowed site currencies

---

### getAllowedLocales

**Signature:** `getAllowedLocales() : List`

**Description:** Returns the allowed locales of the current site as a collection of locale ID's.

**Returns:**

Collection if allowed site locales

---

### getAllSites

**Signature:** `static getAllSites() : List`

**Description:** Returns all sites.

**Returns:**

all sites for the current instance

---

### getCalendar

**Signature:** `static getCalendar() : Calendar`

**Description:** Returns a new Calendar object in the time zone of the current site.

**Returns:**

the Calendar object in the time zone of the current site.

---

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Returns the default currency code for the current site.

**Deprecated:**

Use getDefaultCurrency() method instead,

**Returns:**

the default currency code for the current site.

---

### getCurrent

**Signature:** `static getCurrent() : Site`

**Description:** Returns the current site.

**Returns:**

the current site.

---

### getCustomPreferenceValue

**Signature:** `getCustomPreferenceValue(name : String) : Object`

**Description:** Returns a custom preference value. If the preference does not exist the method returns null. This method is simply a shortcut method for accessing the value for a custom attribute defined on the SitePreferences object. // Method #1 var mySitePrefValue1 : String = dw.system.Site.getCurrent(). getCustomPreferenceValue("mySitePref"); // Method #2 var sitePrefs : SitePreferences = dw.system.Site.getCurrent().getPreferences(); var mySitePrefValue2 : String = sitePrefs.getCustom()["mySitePref"];

**Parameters:**

- `name`: preference name.

**Returns:**

the preference value, or null if there is no preference with the given name.

---

### getDefaultCurrency

**Signature:** `getDefaultCurrency() : String`

**Description:** Returns the default currency code for the current site.

**Returns:**

the default currency code for the current site.

---

### getDefaultLocale

**Signature:** `getDefaultLocale() : String`

**Description:** Return default locale for the site.

**Returns:**

default locale for the site.

---

### getEinsteinSiteID

**Signature:** `getEinsteinSiteID() : String`

**Description:** Returns the Einstein site Id. Typically this is a concatenation of the realm, underscore character and the site id. It can be overwritten by support users to help with realm moves to continue using the Einstein data from the old realm. Used when making calls to the Einstein APIs.

**Returns:**

the Einstein site Id

---

### getHttpHostName

**Signature:** `getHttpHostName() : String`

**Description:** Returns the configured HTTP host name. If no host name is configured the method returns the instance hostname.

**Returns:**

the configured HTTP host name or if it is not set the instance hostname.

---

### getHttpsHostName

**Signature:** `getHttpsHostName() : String`

**Description:** Returns the configured HTTPS host name. If no host name is configured the method returns the HTTP host name or the instance hostname, if that is not configured as well.

**Returns:**

the configured HTTPS host name or HTTP host name or the instance hostname.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the site.

**Returns:**

the ID of the site.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns a descriptive name for the site.

**Returns:**

a descriptive name for the site.

---

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

**Description:** Returns the page meta tag for the specified id. The meta tag content is generated based on the home page meta tag context and rule. The rule is obtained from the current repository domain. Null will be returned if the meta tag is undefined on the current instance, or if no rule can be found for the current context, or if the rule resolves to an empty string.

**Parameters:**

- `id`: the ID to get the page meta tag for

**Returns:**

page meta tag containing content generated based on rules

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags, defined for this instance for which content can be generated. The meta tag content is generated based on the home page meta tag context and rules. The rules are obtained from the current repository domain.

**Returns:**

page meta tags defined for this instance, containing content generated based on rules

---

### getPreferences

**Signature:** `getPreferences() : SitePreferences`

**Description:** This method returns a container of all site preferences of this site.

**Returns:**

a preferences object containing all system and custom site preferences of this site

---

### getStatus

**Signature:** `getStatus() : Number`

**Description:** Returns the status of this site. Possible values are SITE_STATUS_ONLINE, SITE_STATUS_MAINTENANCE, SITE_STATUS_PROTECTED

**Returns:**

Status of the this site.

---

### getTimezone

**Signature:** `getTimezone() : String`

**Description:** Returns the code for the time zone in which the storefront is running.

**Returns:**

time zone code in which the storefront is running.

---

### getTimezoneOffset

**Signature:** `getTimezoneOffset() : Number`

**Description:** Returns time zone offset in which the storefront is running.

**Returns:**

time zone offset in which the storefront is running.

---

### isOMSEnabled

**Signature:** `isOMSEnabled() : boolean`

**Description:** Whether oms is active in the current site. This depends on a general property which states whether oms is active for the server, and a site-dependent preference whether oms is available for the current site.

**Deprecated:**

This item is deprecated.

**Returns:**

whether oms is active in the site

---

### setCustomPreferenceValue

**Signature:** `setCustomPreferenceValue(name : String, value : Object) : void`

**Description:** The method sets a value for a custom preference. The type of the value must match with the declared type of the preference definition.

**Parameters:**

- `name`: name of the preference
- `value`: new value for the preference

---
## Package: dw.util

# Class Locale

## Inheritance Hierarchy

- Object
  - dw.util.Locale

## Description

Represents a Locale supported by the system.

## Properties

### country

**Type:** String (Read Only)

The uppercase ISO 3166 2-letter country/region code for this Locale.
 If no country has been specified for this Locale, this value is an empty string.

### displayCountry

**Type:** String (Read Only)

The display name of this Locale's country, in this Locale's language,
 not in the session locale's language.
 If no country has been specified for this Locale, this value is an empty string.

### displayLanguage

**Type:** String (Read Only)

The display name of this Locale's language, in this Locale's language,
 not in the session locale's language.
 If no country has been specified for this Locale, this value is an empty string.

### displayName

**Type:** String (Read Only)

The display name of this Locale, in this Locale's language,
 not in the session locale's language.
 If no display name has been specified for this Locale, this value is an empty string.

### ID

**Type:** String (Read Only)

The String representation of the localeID.
 
 Combines the language and the country key, concatenated with "_". 
 For example: "en_US". This attribute is the primary key of the class.

### ISO3Country

**Type:** String (Read Only)

The uppercase ISO 3166 3-letter country/region code for this Locale.
 If no country has been specified for this Locale, this value is an empty string.

### ISO3Language

**Type:** String (Read Only)

The 3-letter ISO 639 language code for this Locale.
 If no language has been specified for this Locale, this value is an empty string.

### language

**Type:** String (Read Only)

The lowercase ISO 639 language code for this Locale.
 If no language has been specified for this Locale, this value is an empty string.

## Constructor Summary

## Method Summary

### getCountry

**Signature:** `getCountry() : String`

Returns the uppercase ISO 3166 2-letter country/region code for this Locale.

### getDisplayCountry

**Signature:** `getDisplayCountry() : String`

Returns the display name of this Locale's country, in this Locale's language, not in the session locale's language.

### getDisplayLanguage

**Signature:** `getDisplayLanguage() : String`

Returns the display name of this Locale's language, in this Locale's language, not in the session locale's language.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of this Locale, in this Locale's language, not in the session locale's language.

### getID

**Signature:** `getID() : String`

Returns the String representation of the localeID.

### getISO3Country

**Signature:** `getISO3Country() : String`

Returns the uppercase ISO 3166 3-letter country/region code for this Locale.

### getISO3Language

**Signature:** `getISO3Language() : String`

Returns the 3-letter ISO 639 language code for this Locale.

### getLanguage

**Signature:** `getLanguage() : String`

Returns the lowercase ISO 639 language code for this Locale.

### getLocale

**Signature:** `static getLocale(localeId : String) : Locale`

Returns a Locale instance for the given localeId, or null if no such Locale could be found.

### toString

**Signature:** `toString() : String`

Returns the String representation of the localeID.

## Method Detail

## Method Details

### getCountry

**Signature:** `getCountry() : String`

**Description:** Returns the uppercase ISO 3166 2-letter country/region code for this Locale. If no country has been specified for this Locale, this value is an empty string.

**Returns:**

the uppercase ISO 3166 2-letter country/region code for this Locale. If no country has been specified for this Locale, this value is an empty string.

---

### getDisplayCountry

**Signature:** `getDisplayCountry() : String`

**Description:** Returns the display name of this Locale's country, in this Locale's language, not in the session locale's language. If no country has been specified for this Locale, this value is an empty string.

**Returns:**

the display name of this Locale's country, in this Locale's language. If no country has been specified for this Locale, this value is an empty string.

---

### getDisplayLanguage

**Signature:** `getDisplayLanguage() : String`

**Description:** Returns the display name of this Locale's language, in this Locale's language, not in the session locale's language. If no country has been specified for this Locale, this value is an empty string.

**Returns:**

the display name of this Locale's language, in this Locale's language. If no language has been specified for this Locale, this value is an empty string.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of this Locale, in this Locale's language, not in the session locale's language. If no display name has been specified for this Locale, this value is an empty string.

**Returns:**

the display name of this Locale, in this Locale's language. If no display name has been specified for this Locale, this value is an empty string.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the String representation of the localeID. Combines the language and the country key, concatenated with "_". For example: "en_US". This attribute is the primary key of the class.

**Returns:**

the String representation of the localeID.

---

### getISO3Country

**Signature:** `getISO3Country() : String`

**Description:** Returns the uppercase ISO 3166 3-letter country/region code for this Locale. If no country has been specified for this Locale, this value is an empty string.

**Returns:**

the uppercase ISO 3166 3-letter country/region code for this Locale. If no country has been specified for this Locale, this value is an empty string.

---

### getISO3Language

**Signature:** `getISO3Language() : String`

**Description:** Returns the 3-letter ISO 639 language code for this Locale. If no language has been specified for this Locale, this value is an empty string.

**Returns:**

the 3-letter ISO 639 language code for this Locale. If no language has been specified for this Locale, this value is an empty string.

---

### getLanguage

**Signature:** `getLanguage() : String`

**Description:** Returns the lowercase ISO 639 language code for this Locale. If no language has been specified for this Locale, this value is an empty string.

**Returns:**

the lowercase ISO 639 language code for this Locale. If no language has been specified for this Locale, this value is an empty string.

---

### getLocale

**Signature:** `static getLocale(localeId : String) : Locale`

**Description:** Returns a Locale instance for the given localeId, or null if no such Locale could be found.

**Parameters:**

- `localeId`: the localeID of the desired Locale

**Returns:**

the Locale instance for the given localeId, or null if no such Locale could be found.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns the String representation of the localeID. Combines the language and the country key, concatenated with "_". For example: "en_US". This attribute is the primary key of the class.

**Returns:**

the String representation of the localeID.

---
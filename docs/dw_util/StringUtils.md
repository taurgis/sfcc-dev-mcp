## Package: dw.util

# Class StringUtils

## Inheritance Hierarchy

- Object
  - dw.util.StringUtils

## Description

String utility class.

## Constants

## Properties

## Constructor Summary

## Method Summary

### decodeBase64

**Signature:** `static decodeBase64(base64 : String) : String`

Interprets a Base64 encoded string as byte stream of an UTF-8 encoded string.

### decodeBase64

**Signature:** `static decodeBase64(base64 : String, characterEncoding : String) : String`

Interprets a Base64 encoded string as the byte stream representation of a string.

### decodeString

**Signature:** `static decodeString(str : String, type : Number) : String`

Convert a given syntax-safe string to a string according to the selected character entity encoding type.

### encodeBase64

**Signature:** `static encodeBase64(str : String) : String`

Encodes the byte representation of the given string as Base64.

### encodeBase64

**Signature:** `static encodeBase64(str : String, characterEncoding : String) : String`

Encodes the byte representation of the given string as Base64.

### encodeString

**Signature:** `static encodeString(str : String, type : Number) : String`

Convert a given string to a syntax-safe string according to the selected character entity encoding type.

### format

**Signature:** `static format(format : String, args : Object...) : String`

Returns a formatted string using the specified format and arguments.

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar) : String`

Formats a Calendar object with Calendar.INPUT_DATE_TIME_PATTERN format of the current request locale, for example "MM/dd/yyyy h:mm a" for the locale en_US.

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar, format : String) : String`

Formats a Calendar object with the provided date format.

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar, locale : String, pattern : Number) : String`

Formats a Calendar object with the date format defined by the provided locale and Calendar pattern.

### formatDate

**Signature:** `static formatDate(date : Date) : String`

Formats a date with the default date format of the current site.

### formatDate

**Signature:** `static formatDate(date : Date, format : String) : String`

Formats a date with the provided date format.

### formatDate

**Signature:** `static formatDate(date : Date, format : String, locale : String) : String`

Formats a date with the provided date format in specified locale.

### formatInteger

**Signature:** `static formatInteger(number : Number) : String`

Returns a formatted integer number using the default integer format of the current site.

### formatMoney

**Signature:** `static formatMoney(money : Money) : String`

Formats a Money Object with the default money format of the current request locale.

### formatNumber

**Signature:** `static formatNumber(number : Number) : String`

Returns a formatted number using the default number format of the current site.

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String) : String`

Returns a formatted string using the specified number and format.

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String, locale : String) : String`

Returns a formatted number as a string using the specified number format in specified locale.

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String) : String`

Returns a formatted string using the specified number and format.

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String, locale : String) : String`

Returns a formatted number as a string using the specified number format in specified locale.

### garble

**Signature:** `static garble(str : String, replaceChar : String, suffixLength : Number) : String`

Return a string in which specified number of characters in the suffix is not changed and the rest of the characters replaced with specified character.

### ltrim

**Signature:** `static ltrim(str : String) : String`

Returns the string with leading white space removed.

### pad

**Signature:** `static pad(str : String, width : Number) : String`

This method provides cell padding functionality to the template.

### rtrim

**Signature:** `static rtrim(str : String) : String`

Returns the string with trailing white space removed.

### stringToHtml

**Signature:** `static stringToHtml(str : String) : String`

Convert a given string to an HTML-safe string.

### stringToWml

**Signature:** `static stringToWml(str : String) : String`

Converts a given string to a WML-safe string.

### stringToXml

**Signature:** `static stringToXml(str : String) : String`

Converts a given string to a XML-safe string.

### trim

**Signature:** `static trim(str : String) : String`

Returns the string with leading and trailing white space removed.

### truncate

**Signature:** `static truncate(str : String, maxLength : Number, mode : String, suffix : String) : String`

Truncate the string to the specified length using specified truncate mode.

## Method Detail

## Method Details

### decodeBase64

**Signature:** `static decodeBase64(base64 : String) : String`

**Description:** Interprets a Base64 encoded string as byte stream of an UTF-8 encoded string. The method throws an IllegalArgumentException in case the encoding failed because of a mismatch between the input string and the character encoding.

**Parameters:**

- `base64`: the Base64 encoded string - should not be empty or null.

**Returns:**

the decoded string.

---

### decodeBase64

**Signature:** `static decodeBase64(base64 : String, characterEncoding : String) : String`

**Description:** Interprets a Base64 encoded string as the byte stream representation of a string. The given character encoding is used for decoding the byte stream into the character representation. The method throws an IllegalArgumentException in case the encoding failed because of a mismatch between the input String and the character encoding.

**Parameters:**

- `base64`: the Base64 encoded string - should not be empty or null.
- `characterEncoding`: the character encoding to read the input string - should not be empty or null.

**Returns:**

the decoded string.

---

### decodeString

**Signature:** `static decodeString(str : String, type : Number) : String`

**Description:** Convert a given syntax-safe string to a string according to the selected character entity encoding type.

**Parameters:**

- `str`: String to be decoded
- `type`: decode type

**Returns:**

decoded string

---

### encodeBase64

**Signature:** `static encodeBase64(str : String) : String`

**Description:** Encodes the byte representation of the given string as Base64. The string is converted into the byte representation with UTF-8 encoding. The method throws an IllegalArgumentException in case the encoding failed because of a mismatch between the input string and the character encoding.

**Parameters:**

- `str`: the string to encode - should not be empty or null.

**Returns:**

the encoded string.

---

### encodeBase64

**Signature:** `static encodeBase64(str : String, characterEncoding : String) : String`

**Description:** Encodes the byte representation of the given string as Base64. The string is converted into the byte representation using the given character encoding. The method throws an IllegalArgumentException in case the encoding failed because of a mismatch between the input string and the character encoding.

**Parameters:**

- `str`: the string to encode - should not be empty or null.
- `characterEncoding`: the character encoding to read the input string - should not be empty or null.

**Returns:**

the encoded string.

---

### encodeString

**Signature:** `static encodeString(str : String, type : Number) : String`

**Description:** Convert a given string to a syntax-safe string according to the selected character entity encoding type.

**Parameters:**

- `str`: String to be encoded
- `type`: encode type

**Returns:**

encoded string

---

### format

**Signature:** `static format(format : String, args : Object...) : String`

**Description:** Returns a formatted string using the specified format and arguments. The formatting string is a Java MessageFormat expression, e.g. format( "Message: {0}, {1}", "test", 10 ) would result in "Message: test, 10". If a Collection is passed as the only argument, the elements of this collection are used as arguments for the formatting.

**Parameters:**

- `format`: Java like formatting string.
- `args`: optional list of arguments or a collection, which are included into the result string

**Returns:**

the formatted result string.

---

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar) : String`

**Description:** Formats a Calendar object with Calendar.INPUT_DATE_TIME_PATTERN format of the current request locale, for example "MM/dd/yyyy h:mm a" for the locale en_US. The used time zone is the time zone of the calendar object.

**Parameters:**

- `calendar`: the calendar object.

**Returns:**

a string representation of the formatted calendar object.

---

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar, format : String) : String`

**Description:** Formats a Calendar object with the provided date format. The format is a Java date format, like "yyy-MM-dd". The used time zone is the time zone of the calendar object.

**Parameters:**

- `calendar`: the calendar object to be printed
- `format`: the format to use.

**Returns:**

a string representation of the formatted calendar object.

---

### formatCalendar

**Signature:** `static formatCalendar(calendar : Calendar, locale : String, pattern : Number) : String`

**Description:** Formats a Calendar object with the date format defined by the provided locale and Calendar pattern. The locale can be for instance the request.getLocale(). The used time zone is the time zone of the calendar object.

**Parameters:**

- `calendar`: the calendar object to be printed
- `locale`: the locale, which defines the date format to be used
- `pattern`: the pattern is one of a calendar pattern e.g. SHORT_DATE_PATTERN as defined in the regional settings for the locale

**Returns:**

a string representation of the formatted calendar object.

---

### formatDate

**Signature:** `static formatDate(date : Date) : String`

**Description:** Formats a date with the default date format of the current site.

**Deprecated:**

Use formatCalendar(Calendar, String) instead.

**Parameters:**

- `date`: the date to format.

**Returns:**

a string representation of the formatted date.

---

### formatDate

**Signature:** `static formatDate(date : Date, format : String) : String`

**Description:** Formats a date with the provided date format. The format is the Java date format, like "yyyy-MM-DD". The locale of the calling context request is used in formatting.

**Deprecated:**

Use formatCalendar(Calendar, String) instead.

**Parameters:**

- `date`: the date to format.
- `format`: the format to use.

**Returns:**

a string representation of the formatted date.

---

### formatDate

**Signature:** `static formatDate(date : Date, format : String, locale : String) : String`

**Description:** Formats a date with the provided date format in specified locale. The format is Java date format, like "yyyy-MM-DD".

**Deprecated:**

Use formatCalendar(Calendar, String) instead.

**Parameters:**

- `date`: the date to format.
- `format`: the format to use.
- `locale`: the locale to use.

**Returns:**

a string representation of the formatted date.

---

### formatInteger

**Signature:** `static formatInteger(number : Number) : String`

**Description:** Returns a formatted integer number using the default integer format of the current site. The method can be also called to format a floating number as integer.

**Parameters:**

- `number`: the number to format.

**Returns:**

a formatted an integer number with the default integer format of the current site.

---

### formatMoney

**Signature:** `static formatMoney(money : Money) : String`

**Description:** Formats a Money Object with the default money format of the current request locale.

**Parameters:**

- `money`: The Money instance that should be formatted.

**Returns:**

The formatted String representation of the passed money. In case of an error the string 'N/A' is returned.

---

### formatNumber

**Signature:** `static formatNumber(number : Number) : String`

**Description:** Returns a formatted number using the default number format of the current site. Decimal and grouping separators are used as specified in the locales regional settings.

**Parameters:**

- `number`: the number to format.

**Returns:**

a formatted number using the default number format of the current site.

---

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String) : String`

**Description:** Returns a formatted string using the specified number and format. The format is Java number format, like "#,###.00". To format as an integer number provide "0" as format string. The locale of the calling context request is used in formatting.

**API Versioned:**

No longer available as of version 18.10.

**Parameters:**

- `number`: the number to format.
- `format`: the format to use.

**Returns:**

a formatted string using the specified number and format.

---

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String, locale : String) : String`

**Description:** Returns a formatted number as a string using the specified number format in specified locale. The format is Java number format, like "#,###.00". To format as an integer number provide "0" as format string.

**API Versioned:**

No longer available as of version 18.10.

**Parameters:**

- `number`: the number to format.
- `format`: the format to use.
- `locale`: the locale to use.

**Returns:**

a formatted number as a string using the specified number format in specified locale.

---

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String) : String`

**Description:** Returns a formatted string using the specified number and format. The format is Java number format, like "#,###.00". To format as an integer number provide "0" as format string. The locale of the calling context request is used in formatting. Decimal and grouping separators are used as specified in the locales regional settings (when configured, otherwise a fallback to the internal configuration is done).

**API Versioned:**

From version 18.10. In prior versions this method did fall back to Java formatting rules, instead of using the definitions in regional settings.

**Parameters:**

- `number`: the number to format.
- `format`: the format to use.

**Returns:**

a formatted string using the specified number and format.

---

### formatNumber

**Signature:** `static formatNumber(number : Number, format : String, locale : String) : String`

**Description:** Returns a formatted number as a string using the specified number format in specified locale. The format is Java number format, like "#,###.00". To format as an integer number provide "0" as format string. Decimal and grouping separators are used as specified in the locales regional settings (when configured, otherwise a fallback to the internal configuration is done).

**API Versioned:**

From version 18.10. In prior versions this method did fall back to Java formatting rules, instead of using the definitions in regional settings.

**Parameters:**

- `number`: the number to format.
- `format`: the format to use.
- `locale`: the locale to use.

**Returns:**

a formatted number as a string using the specified number format in specified locale.

---

### garble

**Signature:** `static garble(str : String, replaceChar : String, suffixLength : Number) : String`

**Description:** Return a string in which specified number of characters in the suffix is not changed and the rest of the characters replaced with specified character.

**Parameters:**

- `str`: String to garble
- `replaceChar`: character to use as a replacement
- `suffixLength`: length of the suffix

**Returns:**

the garbled string.

---

### ltrim

**Signature:** `static ltrim(str : String) : String`

**Description:** Returns the string with leading white space removed.

**Parameters:**

- `str`: the String to remove characters from.

**Returns:**

the string with leading white space removed.

---

### pad

**Signature:** `static pad(str : String, width : Number) : String`

**Description:** This method provides cell padding functionality to the template.

**Parameters:**

- `str`: the string to process
- `width`: The absolute value of this number defines the width of the cell. A possitive number forces left, a negative number right alignment. A '0' doesn't change the string.

**Returns:**

the processed string.

---

### rtrim

**Signature:** `static rtrim(str : String) : String`

**Description:** Returns the string with trailing white space removed.

**Parameters:**

- `str`: the String to remove characters from.

**Returns:**

the string with trailing white space removed.

---

### stringToHtml

**Signature:** `static stringToHtml(str : String) : String`

**Description:** Convert a given string to an HTML-safe string. This method substitutes characters that conflict with HTML syntax (<,>,&,") and characters that are beyond the ASCII chart (Unicode 160-255) to HTML 3.2 named character entities.

**Parameters:**

- `str`: String to be converted.

**Returns:**

converted string.

---

### stringToWml

**Signature:** `static stringToWml(str : String) : String`

**Description:** Converts a given string to a WML-safe string. This method substitutes characters that conflict with WML syntax (<,>,&,',"$) to WML named character entities.

**Deprecated:**

Don't use this method anymore

**Parameters:**

- `str`: String to be converted.

**Returns:**

the converted string.

---

### stringToXml

**Signature:** `static stringToXml(str : String) : String`

**Description:** Converts a given string to a XML-safe string. This method substitutes characters that conflict with XML syntax (<,>,&,',") to XML named character entities.

**Parameters:**

- `str`: String to be converted.

**Returns:**

the converted string.

---

### trim

**Signature:** `static trim(str : String) : String`

**Description:** Returns the string with leading and trailing white space removed.

**Parameters:**

- `str`: the string to trim.

**Returns:**

the string with leading and trailing white space removed.

---

### truncate

**Signature:** `static truncate(str : String, maxLength : Number, mode : String, suffix : String) : String`

**Description:** Truncate the string to the specified length using specified truncate mode. Optionally, append suffix to truncated string.

**Parameters:**

- `str`: string to truncate
- `maxLength`: maximum length of the truncated string, not including suffix
- `mode`: truncate mode (TRUNCATE_CHAR, TRUNCATE_WORD, TRUNCATE_SENTENCE), if null TRUNCATE_CHAR is assumed
- `suffix`: suffix append to the truncated string

**Returns:**

the truncated string.

---
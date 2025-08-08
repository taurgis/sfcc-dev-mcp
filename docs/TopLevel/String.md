## Package: TopLevel

# Class String

## Inheritance Hierarchy

- Object
  - String

## Description

The String object represents any sequence of zero or more characters that are to be treated strictly as text.

## Properties

### length

**Type:** Number

The length of the String object.

## Constructor Summary

String() Constructs the String.

String(num : Number) Constructs the String from the specified Number object.

String(str : String) Constructs a new String from the specified String object.

## Method Summary

### charAt

**Signature:** `charAt(index : Number) : String`

Returns a string containing the character at position index.

### charCodeAt

**Signature:** `charCodeAt(index : Number) : Number`

Returns the UTF-16 code unit at the given position index.

### codePointAt

**Signature:** `codePointAt(index : Number) : Number`

Returns the Unicode code point at the given position index.

### concat

**Signature:** `concat(strings : String...) : String`

Returns a new String created by concatenating the string arguments together.

### endsWith

**Signature:** `endsWith(searchString : String) : boolean`

Tests if this string ends with a given string.

### endsWith

**Signature:** `endsWith(searchString : String, length : Number) : boolean`

Tests if this string ends with a given string.

### equals

**Signature:** `equals(obj : Object) : boolean`

Returns true if this string is equal to the string representation of the passed objects.

### equalsIgnoreCase

**Signature:** `equalsIgnoreCase(obj : Object) : boolean`

Returns true if this string is equal to the string representation of the passed objects.

### fromCharCode

**Signature:** `static fromCharCode(c : Number...) : String`

Returns a new String from one or more UTF-16 code units.

### fromCodePoint

**Signature:** `static fromCodePoint(c : Number...) : String`

Returns a new String from one or more characters with Unicode code points.

### includes

**Signature:** `includes(substring : String) : boolean`

Returns if substring is contained in this String object.

### includes

**Signature:** `includes(substring : String, start : Number) : boolean`

Returns if substring is contained in this String object.

### indexOf

**Signature:** `indexOf(substring : String) : Number`

Returns the index of substring in this String object.

### indexOf

**Signature:** `indexOf(substring : String, start : Number) : Number`

Returns the index of substring in this String object using the specified start value as the location to begin searching.

### lastIndexOf

**Signature:** `lastIndexOf(substring : String) : Number`

Returns the last index of substring in this String object.

### lastIndexOf

**Signature:** `lastIndexOf(substring : String, start : Number) : Number`

Returns the last index of substring in this String object, using the specified start position as the location from which to begin the search.

### localeCompare

**Signature:** `localeCompare(other : String) : Number`

Returns a number indicating whether the current String sorts before, the same as, or after the parameter other, based on browser and system-dependent string localization.

### match

**Signature:** `match(regexp : RegExp) : String[]`

Returns an array of strings that match the regular expression regexp.

### normalize

**Signature:** `normalize() : String`

Returns the normalized form of this Unicode string.

### normalize

**Signature:** `normalize(form : String) : String`

Returns the normalized form of this Unicode string according to the standard as described in https://unicode.org/reports/tr15/.

### padEnd

**Signature:** `padEnd(targetLength : Number) : String`

Appends space characters to the current string to ensure the resulting string reaches the given target length.

### padEnd

**Signature:** `padEnd(targetLength : Number, fillString : String) : String`

Appends a string (possibly multiple times) to the current string to ensure the resulting string reaches the given target length.

### padStart

**Signature:** `padStart(targetLength : Number) : String`

Prepends space characters to the current string to ensure the resulting string reaches the given target length.

### padStart

**Signature:** `padStart(targetLength : Number, fillString : String) : String`

Prepends a string (possibly multiple times) to the current string to ensure the resulting string reaches the given target length.

### raw

**Signature:** `static raw(callSite : Object, substitutions : String...) : String`

The static String.raw() method is a tag function of template literals.

### repeat

**Signature:** `repeat(count : Number) : String`

Returns a new string repeating this string the given number of times.

### replace

**Signature:** `replace(regexp : RegExp, replacement : String) : String`

Returns a new String that results when matches of the regexp parameter are replaced by the replacement parameter.

### replace

**Signature:** `replace(regexp : RegExp, function : Function) : String`

Returns a new String that results when matches of the regexp parameter are replaced by using the specified function.

### replace

**Signature:** `replace(literal : String, replacement : String) : String`

Returns a new String that results when matches of the literal parameter are replaced by the replacement parameter.

### replace

**Signature:** `replace(literal : String, replacement : String, flags : String) : String`

Returns a new String that results when matches of the literal parameter are replaced by the replacement parameter.

### replace

**Signature:** `replace(literal : String, function : Function) : String`

Returns a new String that results when matches of the literal parameter are replaced by using the specified function.

### replace

**Signature:** `replace(literal : String, function : Function, flags : String) : String`

Returns a new String that results when matches of the literal parameter are replaced by using the specified function.

### search

**Signature:** `search(regexp : RegExp) : Number`

Searches for a match between the passed regular expression and this string and returns the zero-based index of the match, or -1 if no match is found.

### slice

**Signature:** `slice(start : Number, end : Number) : String`

Returns a substring of the current String where the specified start and end locations are used to delimit the String.

### split

**Signature:** `split(delimiter : String) : String[]`

Returns an array of String instances created by splitting the current String based on the delimiter.

### split

**Signature:** `split(regexp : RegExp) : String[]`

Returns an array of String instances created by splitting the current String based on the regular expression.

### split

**Signature:** `split(delimiter : String, limit : Number) : String[]`

Returns an array of String instances created by splitting the current String based on the delimiter and limited in size by the limit parameter.

### split

**Signature:** `split(regexp : RegExp, limit : Number) : String[]`

Returns an array of String instances created by splitting the current String based on the regular expression and limited in size by the limit parameter.

### startsWith

**Signature:** `startsWith(searchString : String) : boolean`

Tests if this string starts with a given string.

### startsWith

**Signature:** `startsWith(searchString : String, position : Number) : boolean`

Tests if this string starts with a given string.

### substr

**Signature:** `substr(start : Number) : String`

Creates and returns a new String by splitting the current string at the specified start location until the end of the String.

### substr

**Signature:** `substr(start : Number, length : Number) : String`

Creates and returns a new String by splitting the current string at the specified start location and limited by the length value.

### substring

**Signature:** `substring(from : Number) : String`

Creates and returns a new String by splitting the current string at the specified from location until the end of the String.

### substring

**Signature:** `substring(from : Number, to : Number) : String`

Creates and returns a new String by splitting the current string at the specified from location until the specified to location.

### toLocaleLowerCase

**Signature:** `toLocaleLowerCase() : String`

Returns a copy of the current string in all lower-case letters.

### toLocaleUpperCase

**Signature:** `toLocaleUpperCase() : String`

Returns a copy of the current string in all upper-case letters.

### toLowerCase

**Signature:** `toLowerCase() : String`

Returns a copy of the current string in all lower-case letters.

### toString

**Signature:** `toString() : String`

Returns a String value of this object.

### toUpperCase

**Signature:** `toUpperCase() : String`

Returns a copy of the current string in all upper-case letters.

### trim

**Signature:** `trim() : String`

Removes white space characters at the start and the end of the string.

### trimEnd

**Signature:** `trimEnd() : String`

Removes white space characters at the end of the string.

### trimLeft

**Signature:** `trimLeft() : String`

Removes white space characters at the start of the string.

### trimRight

**Signature:** `trimRight() : String`

Removes white space characters at the end of the string.

### trimStart

**Signature:** `trimStart() : String`

Removes white space characters at the start of the string.

### valueOf

**Signature:** `valueOf() : String`

Returns a String value of this object.

## Constructor Detail

## Method Detail

## Method Details

### charAt

**Signature:** `charAt(index : Number) : String`

**Description:** Returns a string containing the character at position index. You should use this method instead of substring when you need only a single character.

**Parameters:**

- `index`: the index at which the character string is located.

**Returns:**

a string containing the character at position index.

---

### charCodeAt

**Signature:** `charCodeAt(index : Number) : Number`

**Description:** Returns the UTF-16 code unit at the given position index. If the position is invalid NaN is returned.

**Parameters:**

- `index`: The index of the code unit within the string.

**Returns:**

a non-negative integer representing a UTF-16 code unit or NaN if the index is not valid.

---

### codePointAt

**Signature:** `codePointAt(index : Number) : Number`

**Description:** Returns the Unicode code point at the given position index. The index is a position within the string in UTF-16 encoding. If the index points to the begin of a surrogate pair the only the code unit at the position is returned. If the index is invalid undefined is returned.

**API Versioned:**

From version 21.2.

**Parameters:**

- `index`: The index of the starting code unit within the string.

**Returns:**

The Unicode code point, an UTF-16 code unit or undefined.

---

### concat

**Signature:** `concat(strings : String...) : String`

**Description:** Returns a new String created by concatenating the string arguments together.

**Parameters:**

- `strings`: zero, one, or more String arguments

**Returns:**

a new String created by concatenating the string arguments together.

---

### endsWith

**Signature:** `endsWith(searchString : String) : boolean`

**Description:** Tests if this string ends with a given string.

**API Versioned:**

From version 21.2.

**Parameters:**

- `searchString`: The characters to be searched for this string.

**Returns:**

true if the search string was found else false

---

### endsWith

**Signature:** `endsWith(searchString : String, length : Number) : boolean`

**Description:** Tests if this string ends with a given string.

**API Versioned:**

From version 21.2.

**Parameters:**

- `searchString`: The characters to be searched for this string.
- `length`: Assumes this string has only this given length.

**Returns:**

true if the search string was found else false

---

### equals

**Signature:** `equals(obj : Object) : boolean`

**Description:** Returns true if this string is equal to the string representation of the passed objects.

**Parameters:**

- `obj`: another object, typically another string

---

### equalsIgnoreCase

**Signature:** `equalsIgnoreCase(obj : Object) : boolean`

**Description:** Returns true if this string is equal to the string representation of the passed objects. The comparison is done case insensitive.

**Parameters:**

- `obj`: another object, typically another string

---

### fromCharCode

**Signature:** `static fromCharCode(c : Number...) : String`

**Description:** Returns a new String from one or more UTF-16 code units.

**Parameters:**

- `c`: zero, one, or more UTF-16 code units.

---

### fromCodePoint

**Signature:** `static fromCodePoint(c : Number...) : String`

**Description:** Returns a new String from one or more characters with Unicode code points.

**API Versioned:**

From version 21.2.

**Parameters:**

- `c`: zero, one, or more code points.

---

### includes

**Signature:** `includes(substring : String) : boolean`

**Description:** Returns if substring is contained in this String object.

**API Versioned:**

From version 21.2.

**Parameters:**

- `substring`: the String to search for in this String.

**Returns:**

true if substring occurs within the current string, else false.

---

### includes

**Signature:** `includes(substring : String, start : Number) : boolean`

**Description:** Returns if substring is contained in this String object.

**API Versioned:**

From version 21.2.

**Parameters:**

- `substring`: the String to search for in this String.
- `start`: the location in the String from which to begin the search.

**Returns:**

true if substring occurs within the current string, else false.

---

### indexOf

**Signature:** `indexOf(substring : String) : Number`

**Description:** Returns the index of substring in this String object. If there is no match, -1 is returned.

**Parameters:**

- `substring`: the String to search for in this String.

**Returns:**

the index of substring or -1.

---

### indexOf

**Signature:** `indexOf(substring : String, start : Number) : Number`

**Description:** Returns the index of substring in this String object using the specified start value as the location to begin searching. If there is no match, -1 is returned.

**Parameters:**

- `substring`: the String to search for in this String.
- `start`: the location in the String from which to begin the search.

**Returns:**

the index of substring or -1.

---

### lastIndexOf

**Signature:** `lastIndexOf(substring : String) : Number`

**Description:** Returns the last index of substring in this String object. If there is no match, -1 is returned.

**Parameters:**

- `substring`: the String to search for in this String.

**Returns:**

the last index of substring or -1.

---

### lastIndexOf

**Signature:** `lastIndexOf(substring : String, start : Number) : Number`

**Description:** Returns the last index of substring in this String object, using the specified start position as the location from which to begin the search. If there is no match, -1 is returned.

**Parameters:**

- `substring`: the String to search for in this String.
- `start`: the location from which to begin the search.

**Returns:**

the last index of substring or -1.

---

### localeCompare

**Signature:** `localeCompare(other : String) : Number`

**Description:** Returns a number indicating whether the current String sorts before, the same as, or after the parameter other, based on browser and system-dependent string localization.

**Parameters:**

- `other`: the String to compare against this String.

**Returns:**

a number indicating whether the current String sorts before, the same as, or after the parameter other.

---

### match

**Signature:** `match(regexp : RegExp) : String[]`

**Description:** Returns an array of strings that match the regular expression regexp.

**Parameters:**

- `regexp`: the regular expression to use.

**Returns:**

an array of strings that match the regular expression.

---

### normalize

**Signature:** `normalize() : String`

**Description:** Returns the normalized form of this Unicode string. Same as calling normalize(String) with parameter 'NFC'.

**API Versioned:**

From version 21.2.

**Returns:**

The normalized form of this Unicode string.

---

### normalize

**Signature:** `normalize(form : String) : String`

**Description:** Returns the normalized form of this Unicode string according to the standard as described in https://unicode.org/reports/tr15/. In a normalized string, identical text is replaced by identical sequences of code points.

**API Versioned:**

From version 21.2.

**Parameters:**

- `form`: The normalization variant to use. Must be one of 'NFC', 'NFD', 'NFKC', 'NFKD'.

**Returns:**

The normalized form of this Unicode string.

---

### padEnd

**Signature:** `padEnd(targetLength : Number) : String`

**Description:** Appends space characters to the current string to ensure the resulting string reaches the given target length.

**API Versioned:**

From version 21.2.

**Parameters:**

- `targetLength`: The length to be reached.

**Returns:**

This string if the string length is already greater than or equal to the target length. Else a new string with the targetLength ending with space characters.

---

### padEnd

**Signature:** `padEnd(targetLength : Number, fillString : String) : String`

**Description:** Appends a string (possibly multiple times) to the current string to ensure the resulting string reaches the given target length.

**API Versioned:**

From version 21.2.

**Parameters:**

- `targetLength`: The length to be reached.
- `fillString`: The string providing the characters to be used for filling.

**Returns:**

This string if the string length is already greater than or equal to the target length. Else a new string with the targetLength with the (possibly multiple times) added and truncated fillString.

---

### padStart

**Signature:** `padStart(targetLength : Number) : String`

**Description:** Prepends space characters to the current string to ensure the resulting string reaches the given target length.

**API Versioned:**

From version 21.2.

**Parameters:**

- `targetLength`: The length to be reached.

**Returns:**

This string if the string length is already greater than or equal to the target length. Else a new string with the targetLength starting with space characters.

---

### padStart

**Signature:** `padStart(targetLength : Number, fillString : String) : String`

**Description:** Prepends a string (possibly multiple times) to the current string to ensure the resulting string reaches the given target length.

**API Versioned:**

From version 21.2.

**Parameters:**

- `targetLength`: The length to be reached.
- `fillString`: The string providing the characters to be used for filling.

**Returns:**

This string if the string length is already greater than or equal to the target length. Else a new string with the targetLength with the (possibly multiple times) added and truncated fillString.

---

### raw

**Signature:** `static raw(callSite : Object, substitutions : String...) : String`

**Description:** The static String.raw() method is a tag function of template literals. It can be used in different ways: String.raw`Hello\n${40+2}!`; // returns: Hello\n42! // \ is here not an escape character like in string literals String.raw({ raw: ['a', 'b', 'c'] }, '-', '.' ); // returns: a-b.c

**API Versioned:**

From version 22.7.

**Parameters:**

- `callSite`: A well-formed template call site object, like { raw: ['a', 'b', 'c'] }.
- `substitutions`: The substitution values.

**Returns:**

A string constructed by the template with filled substitutions.

---

### repeat

**Signature:** `repeat(count : Number) : String`

**Description:** Returns a new string repeating this string the given number of times.

**API Versioned:**

From version 21.2.

**Parameters:**

- `count`: The number of times this string should be repeated. Must be non-negative.

**Returns:**

A new string repeating this string the given number of times.

---

### replace

**Signature:** `replace(regexp : RegExp, replacement : String) : String`

**Description:** Returns a new String that results when matches of the regexp parameter are replaced by the replacement parameter. The original String is not modified so you must capture the new String in a variable to preserve changes. If regexp has the global flag set, all occurrences are replaced, if the global flag is not set only the first occurrence is replaced.

**Parameters:**

- `regexp`: the regular expression to use.
- `replacement`: a String that is to take the place of all matches of regexp in the current String.

**Returns:**

a new String that results when matches of the regexp parameter are replaced by the replacement.

---

### replace

**Signature:** `replace(regexp : RegExp, function : Function) : String`

**Description:** Returns a new String that results when matches of the regexp parameter are replaced by using the specified function. The original String is not modified so you must capture the new String in a variable to preserve changes. When you specify a function as the second parameter, the function is invoked after the match has been performed.

**Parameters:**

- `regexp`: the regular expression to use.
- `function`: a Function that operates on matches of regexp in the current String.

**Returns:**

a new String that results when matches of the regexp parameter are replaced by the function.

---

### replace

**Signature:** `replace(literal : String, replacement : String) : String`

**Description:** Returns a new String that results when matches of the literal parameter are replaced by the replacement parameter. The original String is not modified so you must capture the new String in a variable to preserve changes. This method only replaces the first occurrence of the literal. To replace all occurrences see the polymorphic method with a regular expression as argument.

**Parameters:**

- `literal`: the literal string to locate.
- `replacement`: a String that is to take the place of all matches of regexp in the current String.

**Returns:**

a new String that results when the first match of the literal parameter is replaced by the replacement parameter.

---

### replace

**Signature:** `replace(literal : String, replacement : String, flags : String) : String`

**Description:** Returns a new String that results when matches of the literal parameter are replaced by the replacement parameter. The original String is not modified so you must capture the new String in a variable to preserve changes. This method only replaces the first occurrence of the literal. To replace all occurrences see the polymorphic method with a regular expression as argument. Note that if flags

**API Versioned:**

No longer available as of version 21.2.

**Deprecated:**

Use replace(RegExp, String) instead.

**Parameters:**

- `literal`: the literal string to locate.
- `replacement`: a String that is to take the place of all matches of regexp in the current String.
- `flags`: a String containing any combination of the Regular Expression flags of g - global match, i - ignore case, m - match over multiple lines.

**Returns:**

a new String that results when the first match of the literal parameter is replaced by the replacement parameter.

---

### replace

**Signature:** `replace(literal : String, function : Function) : String`

**Description:** Returns a new String that results when matches of the literal parameter are replaced by using the specified function. The original String is not modified so you must capture the new String in a variable to preserve changes. When you specify a function as the second parameter, the function is invoked after the match has been performed.

**Parameters:**

- `literal`: the literal string to locate.
- `function`: a Function that operates on the match of literal in the current String.

**Returns:**

a new String that results when the first match of the literal parameter is replaced by the specified function.

---

### replace

**Signature:** `replace(literal : String, function : Function, flags : String) : String`

**Description:** Returns a new String that results when matches of the literal parameter are replaced by using the specified function. The original String is not modified so you must capture the new String in a variable to preserve changes. When you specify a function as the second parameter, the function is invoked after the match has been performed.

**API Versioned:**

No longer available as of version 21.2.

**Deprecated:**

Use replace(RegExp, Function) instead.

**Parameters:**

- `literal`: the literal string to locate.
- `function`: a Function that operates on the match of literal in the current String.
- `flags`: a String containing any combination of the Regular Expression flags of g - global match, i - ignore case, m - match over multiple lines.

**Returns:**

a new String that results when the first match of the literal parameter is replaced by the specified function.

---

### search

**Signature:** `search(regexp : RegExp) : Number`

**Description:** Searches for a match between the passed regular expression and this string and returns the zero-based index of the match, or -1 if no match is found.

**Parameters:**

- `regexp`: the regular expression to use.

**Returns:**

the zero-based indexed value of the first character in the current string that matches the pattern of the regular expression regexp, or -1 if no match is found.

---

### slice

**Signature:** `slice(start : Number, end : Number) : String`

**Description:** Returns a substring of the current String where the specified start and end locations are used to delimit the String.

**Parameters:**

- `start`: the start position in the current String from which the slice will begin.
- `end`: the end position in the current String from which the slice will terminate.

**Returns:**

the String between the start and end positions.

---

### split

**Signature:** `split(delimiter : String) : String[]`

**Description:** Returns an array of String instances created by splitting the current String based on the delimiter.

**Parameters:**

- `delimiter`: the delimiter to use to split the string.

**Returns:**

an array of String instances created by splitting the current String based on the delimiter.

---

### split

**Signature:** `split(regexp : RegExp) : String[]`

**Description:** Returns an array of String instances created by splitting the current String based on the regular expression.

**Parameters:**

- `regexp`: the regular expression to use to split the string.

**Returns:**

an array of String instances created by splitting the current String based on the regular expression.

---

### split

**Signature:** `split(delimiter : String, limit : Number) : String[]`

**Description:** Returns an array of String instances created by splitting the current String based on the delimiter and limited in size by the limit parameter.

**Parameters:**

- `delimiter`: the delimiter to use to split the string.
- `limit`: controls the maximum number of items that will be returned.

**Returns:**

an array of String instances created by splitting the current String based on the delimiter and limited in size by the limit parameter.

---

### split

**Signature:** `split(regexp : RegExp, limit : Number) : String[]`

**Description:** Returns an array of String instances created by splitting the current String based on the regular expression and limited in size by the limit parameter.

**Parameters:**

- `regexp`: the regular expression to use to split the string.
- `limit`: controls the maximum number of items that will be returned.

**Returns:**

an array of String instances created by splitting the current String based on the regular expression and limited in size by the limit parameter.

---

### startsWith

**Signature:** `startsWith(searchString : String) : boolean`

**Description:** Tests if this string starts with a given string.

**API Versioned:**

From version 21.2.

**Parameters:**

- `searchString`: The characters to be searched for this string.

**Returns:**

true if the search string was found else false

---

### startsWith

**Signature:** `startsWith(searchString : String, position : Number) : boolean`

**Description:** Tests if this string starts with a given string.

**API Versioned:**

From version 21.2.

**Parameters:**

- `searchString`: The characters to be searched for this string.
- `position`: The position in this string at which to begin searching for searchString.

**Returns:**

true if the search string was found else false

---

### substr

**Signature:** `substr(start : Number) : String`

**Description:** Creates and returns a new String by splitting the current string at the specified start location until the end of the String.

**Parameters:**

- `start`: the start position in the current string from which the new string will be created.

**Returns:**

a new String created by splitting the current string starting at the specified start location until the end of the String.

---

### substr

**Signature:** `substr(start : Number, length : Number) : String`

**Description:** Creates and returns a new String by splitting the current string at the specified start location and limited by the length value.

**Parameters:**

- `start`: the start position in the current string from which the new string will be created.
- `length`: controls the length of the new string.

**Returns:**

a new String created by splitting the current string starting at the specified start location and limited by the length value.

---

### substring

**Signature:** `substring(from : Number) : String`

**Description:** Creates and returns a new String by splitting the current string at the specified from location until the end of the String.

**Parameters:**

- `from`: the start position in the current string from which the new string will be created.

**Returns:**

a new String created by splitting the current string starting at the specified from location until the end of the String.

---

### substring

**Signature:** `substring(from : Number, to : Number) : String`

**Description:** Creates and returns a new String by splitting the current string at the specified from location until the specified to location.

**Parameters:**

- `from`: the start position in the current string from which the new string will be created.
- `to`: the end position in the current string from which the new string will be created.

**Returns:**

a new String created by splitting the current string starting at the specified from location until the specified to location. value.

---

### toLocaleLowerCase

**Signature:** `toLocaleLowerCase() : String`

**Description:** Returns a copy of the current string in all lower-case letters.

**Returns:**

a copy of the current string in all lower-case letters.

---

### toLocaleUpperCase

**Signature:** `toLocaleUpperCase() : String`

**Description:** Returns a copy of the current string in all upper-case letters.

**Returns:**

a copy of the current string in all upper-case letters.

---

### toLowerCase

**Signature:** `toLowerCase() : String`

**Description:** Returns a copy of the current string in all lower-case letters.

**Returns:**

a copy of the current string in all lower-case letters.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a String value of this object.

**Returns:**

a String value of this object.

---

### toUpperCase

**Signature:** `toUpperCase() : String`

**Description:** Returns a copy of the current string in all upper-case letters.

**Returns:**

a copy of the current string in all upper-case letters.

---

### trim

**Signature:** `trim() : String`

**Description:** Removes white space characters at the start and the end of the string.

**Returns:**

A new string without leading and ending white space characters.

---

### trimEnd

**Signature:** `trimEnd() : String`

**Description:** Removes white space characters at the end of the string.

**API Versioned:**

From version 21.2.

**Returns:**

A new string without ending white space characters.

---

### trimLeft

**Signature:** `trimLeft() : String`

**Description:** Removes white space characters at the start of the string. trimStart() should be used instead of this.

**API Versioned:**

From version 21.2.

**Returns:**

A new string without leading white space characters.

---

### trimRight

**Signature:** `trimRight() : String`

**Description:** Removes white space characters at the end of the string. trimEnd() should be used instead of this.

**API Versioned:**

From version 21.2.

**Returns:**

A new string without ending white space characters.

---

### trimStart

**Signature:** `trimStart() : String`

**Description:** Removes white space characters at the start of the string.

**API Versioned:**

From version 21.2.

**Returns:**

A new string without leading white space characters.

---

### valueOf

**Signature:** `valueOf() : String`

**Description:** Returns a String value of this object.

**Returns:**

a String value of this object.

---
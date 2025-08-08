## Package: dw.web

# Class HttpParameter

## Inheritance Hierarchy

- Object
  - dw.web.HttpParameter

## Description

Represents an HTTP parameter.

## Properties

### booleanValue

**Type:** boolean (Read Only)

The value of the current HttpParameter attribute as a boolean. If
 there is more than one value defined, only the first one is returned. For an
 undefined attribute it returns null.

### dateValue

**Type:** Date (Read Only)

The value of the current HttpParameter attribute as a date. If
 there is more than one value defined, only the first one is returned. For
 an undefined attribute and if attribute is not a date it return null.

### doubleValue

**Type:** Number (Read Only)

The value of the current HttpParameter attribute as a number. If
 there is more than one value defined, only the first one is returned. For
 an undefined attribute it returns 0.0.

### empty

**Type:** boolean (Read Only)

Identifies if there is a value for the http parameter attribute
 and whether the value is empty.
 A value is treated as empty if it's not blank.

### intValue

**Type:** Number (Read Only)

The value of the current HttpParameter attribute as int. If there
 is more than one value defined, only the first one is returned. For an
 undefined attribute it returns null.

### rawValue

**Type:** String (Read Only)

The raw value for this HttpParameter instance.
 The raw value is the not trimmed String value of this HTTP parameter.
 If there is more than one value defined, only the first one is returned. For an
 undefined attribute the method returns a null.

### rawValues

**Type:** Collection (Read Only)

A Collection of all raw values for this HTTP parameter.
 The raw value is the not trimmed String value of this HTTP parameter.

### stringValue

**Type:** String (Read Only)

The value of the current HttpParameter attribute. If there is
 more than one value defined, only the first one is returned. For an
 undefined attribute the method returns a null.

### stringValues

**Type:** Collection (Read Only)

A Collection of all defined values for this HTTP parameter.

### submitted

**Type:** boolean (Read Only)

Identifies if the parameter was submitted. This is equivalent to the
 check, whether the parameter has a value.

### value

**Type:** String (Read Only)

The value of the current HttpParameter attribute. If there is
 more than one value defined, only the first one is returned. For an
 undefined attribute the method returns null.

### values

**Type:** Collection (Read Only)

A Collection of all defined values for this current HTTP parameter.

## Constructor Summary

## Method Summary

### containsStringValue

**Signature:** `containsStringValue(value : String) : boolean`

Identifies if the given value is part of the actual values.

### getBooleanValue

**Signature:** `getBooleanValue() : boolean`

Returns the value of the current HttpParameter attribute as a boolean.

### getBooleanValue

**Signature:** `getBooleanValue(defaultValue : boolean) : boolean`

Returns the value of the current HttpParameter attribute as a boolean.

### getDateValue

**Signature:** `getDateValue() : Date`

Returns the value of the current HttpParameter attribute as a date.

### getDateValue

**Signature:** `getDateValue(defaultValue : Date) : Date`

Returns the value of the current HttpParameter attribute as a date.

### getDoubleValue

**Signature:** `getDoubleValue() : Number`

Returns the value of the current HttpParameter attribute as a number.

### getDoubleValue

**Signature:** `getDoubleValue(defaultValue : Number) : Number`

Returns the value of the current HttpParameter attribute as a number.

### getIntValue

**Signature:** `getIntValue() : Number`

Returns the value of the current HttpParameter attribute as int.

### getIntValue

**Signature:** `getIntValue(defaultValue : Number) : Number`

Returns the value of the current HttpParameter attribute as an integer.

### getRawValue

**Signature:** `getRawValue() : String`

Returns the raw value for this HttpParameter instance.

### getRawValues

**Signature:** `getRawValues() : Collection`

Returns a Collection of all raw values for this HTTP parameter.

### getStringValue

**Signature:** `getStringValue() : String`

Returns the value of the current HttpParameter attribute.

### getStringValue

**Signature:** `getStringValue(defaultValue : String) : String`

Returns the value of the current HttpParameter attribute.

### getStringValues

**Signature:** `getStringValues() : Collection`

Returns a Collection of all defined values for this HTTP parameter.

### getValue

**Signature:** `getValue() : String`

Returns the value of the current HttpParameter attribute.

### getValues

**Signature:** `getValues() : Collection`

Returns a Collection of all defined values for this current HTTP parameter.

### isChecked

**Signature:** `isChecked(value : String) : boolean`

Identifies if the given String is an actual value of this http parameter.

### isEmpty

**Signature:** `isEmpty() : boolean`

Identifies if there is a value for the http parameter attribute and whether the value is empty.

### isSubmitted

**Signature:** `isSubmitted() : boolean`

Identifies if the parameter was submitted.

### toString

**Signature:** `toString() : String`

Returns the value of the current HttpParameter attribute.

## Method Detail

## Method Details

### containsStringValue

**Signature:** `containsStringValue(value : String) : boolean`

**Description:** Identifies if the given value is part of the actual values.

**Parameters:**

- `value`: the value to check.

**Returns:**

true if the value is among the actual values, false otherwise.

---

### getBooleanValue

**Signature:** `getBooleanValue() : boolean`

**Description:** Returns the value of the current HttpParameter attribute as a boolean. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns null.

**Returns:**

the actual value as a boolean or null of no value is available.

---

### getBooleanValue

**Signature:** `getBooleanValue(defaultValue : boolean) : boolean`

**Description:** Returns the value of the current HttpParameter attribute as a boolean. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns the given default value.

**Parameters:**

- `defaultValue`: the default value to use.

**Returns:**

the value of the parameter or the default value if empty.

---

### getDateValue

**Signature:** `getDateValue() : Date`

**Description:** Returns the value of the current HttpParameter attribute as a date. If there is more than one value defined, only the first one is returned. For an undefined attribute and if attribute is not a date it return null.

**Returns:**

the actual value as date or null if empty.

---

### getDateValue

**Signature:** `getDateValue(defaultValue : Date) : Date`

**Description:** Returns the value of the current HttpParameter attribute as a date. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns the given default value and if the attributes is not a date it returns null.

**Parameters:**

- `defaultValue`: the default value to use.

**Returns:**

the data value of the attribute or the default value if empty

---

### getDoubleValue

**Signature:** `getDoubleValue() : Number`

**Description:** Returns the value of the current HttpParameter attribute as a number. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns 0.0.

**Returns:**

the actual value as double or null if the parameter has no value.

---

### getDoubleValue

**Signature:** `getDoubleValue(defaultValue : Number) : Number`

**Description:** Returns the value of the current HttpParameter attribute as a number. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns the given default value.

**Parameters:**

- `defaultValue`: the default value to use.

**Returns:**

the actual value as double or the default value if empty.

---

### getIntValue

**Signature:** `getIntValue() : Number`

**Description:** Returns the value of the current HttpParameter attribute as int. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns null.

**Returns:**

the actual value as an integer or null of no value is available.

---

### getIntValue

**Signature:** `getIntValue(defaultValue : Number) : Number`

**Description:** Returns the value of the current HttpParameter attribute as an integer. If there is more than one value defined, only the first one is returned. For an undefined attribute it returns the given default value.

**Parameters:**

- `defaultValue`: the default value to use.

**Returns:**

the value of the parameter or the default value if empty.

---

### getRawValue

**Signature:** `getRawValue() : String`

**Description:** Returns the raw value for this HttpParameter instance. The raw value is the not trimmed String value of this HTTP parameter. If there is more than one value defined, only the first one is returned. For an undefined attribute the method returns a null.

**Returns:**

the actual value or null.

**See Also:**

getStringValue()

---

### getRawValues

**Signature:** `getRawValues() : Collection`

**Description:** Returns a Collection of all raw values for this HTTP parameter. The raw value is the not trimmed String value of this HTTP parameter.

**Returns:**

the raw values as a Collection of String, might be empty

**See Also:**

getStringValues()

---

### getStringValue

**Signature:** `getStringValue() : String`

**Description:** Returns the value of the current HttpParameter attribute. If there is more than one value defined, only the first one is returned. For an undefined attribute the method returns a null.

**Returns:**

the actual value or null.

---

### getStringValue

**Signature:** `getStringValue(defaultValue : String) : String`

**Description:** Returns the value of the current HttpParameter attribute. If there is more than one value defined, only the first one is returned. For an undefined attribute the method returns the given default value.

**Parameters:**

- `defaultValue`: the default value to use.

**Returns:**

the actual value or the default value.

---

### getStringValues

**Signature:** `getStringValues() : Collection`

**Description:** Returns a Collection of all defined values for this HTTP parameter.

**Returns:**

the actual values as Collection.

---

### getValue

**Signature:** `getValue() : String`

**Description:** Returns the value of the current HttpParameter attribute. If there is more than one value defined, only the first one is returned. For an undefined attribute the method returns null.

**Returns:**

the actual value or null.

---

### getValues

**Signature:** `getValues() : Collection`

**Description:** Returns a Collection of all defined values for this current HTTP parameter.

**Returns:**

the actual values as Collection.

**See Also:**

getStringValues()

---

### isChecked

**Signature:** `isChecked(value : String) : boolean`

**Description:** Identifies if the given String is an actual value of this http parameter.

**Parameters:**

- `value`: the value to check.

**Returns:**

true if the value is among the actual values, false otherwise.

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Identifies if there is a value for the http parameter attribute and whether the value is empty. A value is treated as empty if it's not blank.

**Returns:**

true if a value is empty, false otherwise.

---

### isSubmitted

**Signature:** `isSubmitted() : boolean`

**Description:** Identifies if the parameter was submitted. This is equivalent to the check, whether the parameter has a value.

**Returns:**

true if a value is there, false otherwise.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns the value of the current HttpParameter attribute. If there is more than one value defined, only the first one is returned. For an undefined attribute the method returns an empty string.

**Returns:**

the actual value or an empty String.

---
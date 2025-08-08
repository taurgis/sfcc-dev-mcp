## Package: dw.value

# Class EnumValue

## Inheritance Hierarchy

- Object
  - dw.value.EnumValue

## Description

The class represents a single value for an Enumeration type. Enumeration types can be configured through the business manager for custom attributes. Some system attributes, e.g. the order status, are also of Enumeration types. Each EnumValue has a base value and a display value. The type of the base value can be either String or Integer. Every EnumValue has a display value. If the value of an Enumeration type object attribute is null, when that attribute is accessed an EnumValue is returned that has a base value of null, rather than null itself. This means that empty(object.attribute) would be false, and empty(object.attribute.value) would be true.

## Properties

### displayValue

**Type:** String (Read Only)

The display value of the enumeration value. If no display value
 is configured the method return the string representation of the value.

### value

**Type:** Object (Read Only)

The value of the enumeration value. This is either an integer
 value or a string.

## Constructor Summary

## Method Summary

### getDisplayValue

**Signature:** `getDisplayValue() : String`

Returns the display value of the enumeration value.

### getValue

**Signature:** `getValue() : Object`

Returns the value of the enumeration value.

### toString

**Signature:** `toString() : String`

Same as getDisplayValue().

### valueOf

**Signature:** `valueOf() : Object`

According the ECMA specification, this method returns the "natural" primitive value of this object.

## Method Detail

## Method Details

### getDisplayValue

**Signature:** `getDisplayValue() : String`

**Description:** Returns the display value of the enumeration value. If no display value is configured the method return the string representation of the value.

---

### getValue

**Signature:** `getValue() : Object`

**Description:** Returns the value of the enumeration value. This is either an integer value or a string.

---

### toString

**Signature:** `toString() : String`

**Description:** Same as getDisplayValue().

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** According the ECMA specification, this method returns the "natural" primitive value of this object. Here it is equivalent to getValue().

---
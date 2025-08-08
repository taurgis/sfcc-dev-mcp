## Package: dw.object

# Class ObjectAttributeDefinition

## Inheritance Hierarchy

- Object
  - dw.object.ObjectAttributeDefinition

## Description

Represents the definition of an object's attribute.

## Constants

## Properties

### attributeGroups

**Type:** Collection (Read Only)

All attribute groups the attribute is assigned to.

### defaultValue

**Type:** ObjectAttributeValueDefinition (Read Only)

Return the default value for the attribute or null if none is defined.

### displayName

**Type:** String (Read Only)

The display name for the attribute, which can be used in the
 user interface.

### ID

**Type:** String (Read Only)

The ID of the attribute definition.

### key

**Type:** boolean (Read Only)

Identifies if the attribute represents the primary key of the object.

### mandatory

**Type:** boolean (Read Only)

Checks if this attribute is mandatory.

### multiValueType

**Type:** VALUE_TYPE_SET_OF_INT (Read Only)

Returns true if the attribute can have multiple values.
 Attributes of the following types are multi-value capable:
 
 VALUE_TYPE_SET_OF_INT
 VALUE_TYPE_SET_OF_NUMBER
 VALUE_TYPE_SET_OF_STRING
 
 Additionally, attributes of the following types can be multi-value
 enabled:
 
 VALUE_TYPE_ENUM_OF_INT
 VALUE_TYPE_ENUM_OF_STRING

### objectTypeDefinition

**Type:** ObjectTypeDefinition (Read Only)

The object type definition in which this attribute is defined.

### setValueType

**Type:** boolean (Read Only)

Returns true if the attribute is of type 'Set of'.

### system

**Type:** boolean (Read Only)

Indicates if the attribute is a pre-defined system attribute
 or a custom attribute.

### unit

**Type:** String (Read Only)

The attribute's unit representation such as
 inches for length or pounds for weight. The value returned by
 this method is based on the attribute itself.

### values

**Type:** Collection (Read Only)

The list of attribute values. In the user interface only the
 values specified in this list should be offered as valid input values.

 The collection contains instances of ObjectAttributeValueDefinition.

### valueTypeCode

**Type:** Number (Read Only)

A code for the data type stored in the attribute. See constants
 defined in this class.

## Constructor Summary

## Method Summary

### getAttributeGroups

**Signature:** `getAttributeGroups() : Collection`

Returns all attribute groups the attribute is assigned to.

### getDefaultValue

**Signature:** `getDefaultValue() : ObjectAttributeValueDefinition`

Return the default value for the attribute or null if none is defined.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name for the attribute, which can be used in the user interface.

### getID

**Signature:** `getID() : String`

Returns the ID of the attribute definition.

### getObjectTypeDefinition

**Signature:** `getObjectTypeDefinition() : ObjectTypeDefinition`

Returns the object type definition in which this attribute is defined.

### getUnit

**Signature:** `getUnit() : String`

Returns the attribute's unit representation such as inches for length or pounds for weight.

### getValues

**Signature:** `getValues() : Collection`

Returns the list of attribute values.

### getValueTypeCode

**Signature:** `getValueTypeCode() : Number`

Returns a code for the data type stored in the attribute.

### isKey

**Signature:** `isKey() : boolean`

Identifies if the attribute represents the primary key of the object.

### isMandatory

**Signature:** `isMandatory() : boolean`

Checks if this attribute is mandatory.

### isMultiValueType

**Signature:** `isMultiValueType() : boolean`

Returns true if the attribute can have multiple values.

### isSetValueType

**Signature:** `isSetValueType() : boolean`

Returns true if the attribute is of type 'Set of'.

### isSystem

**Signature:** `isSystem() : boolean`

Indicates if the attribute is a pre-defined system attribute or a custom attribute.

### requiresEncoding

**Signature:** `requiresEncoding() : boolean`

Returns a boolean flag indicating whether or not values of this attribute definition should be encoded using the encoding="off" flag in ISML templates.

## Method Detail

## Method Details

### getAttributeGroups

**Signature:** `getAttributeGroups() : Collection`

**Description:** Returns all attribute groups the attribute is assigned to.

**Returns:**

all attribute groups the attribute is assigned to.

---

### getDefaultValue

**Signature:** `getDefaultValue() : ObjectAttributeValueDefinition`

**Description:** Return the default value for the attribute or null if none is defined.

**Returns:**

the default value for the attribute or null if none is defined.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name for the attribute, which can be used in the user interface.

**Returns:**

the display name for the attribute, which can be used in the user interface.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the attribute definition.

**Returns:**

the ID of the attribute definition.

---

### getObjectTypeDefinition

**Signature:** `getObjectTypeDefinition() : ObjectTypeDefinition`

**Description:** Returns the object type definition in which this attribute is defined.

**Returns:**

the object type definition in which this attribute is defined.

---

### getUnit

**Signature:** `getUnit() : String`

**Description:** Returns the attribute's unit representation such as inches for length or pounds for weight. The value returned by this method is based on the attribute itself.

**Returns:**

the attribute's unit representation such as inches for length or pounds for weight.

---

### getValues

**Signature:** `getValues() : Collection`

**Description:** Returns the list of attribute values. In the user interface only the values specified in this list should be offered as valid input values. The collection contains instances of ObjectAttributeValueDefinition.

**Returns:**

a collection of ObjectAttributeValueDefinition instances representing the list of attribute values, or null if no values are specified.

---

### getValueTypeCode

**Signature:** `getValueTypeCode() : Number`

**Description:** Returns a code for the data type stored in the attribute. See constants defined in this class.

**Returns:**

a code for the data type stored in the attribute. See constants defined in this class.

---

### isKey

**Signature:** `isKey() : boolean`

**Description:** Identifies if the attribute represents the primary key of the object.

**Returns:**

true if the attribute represents the primary key, false otherwise.

---

### isMandatory

**Signature:** `isMandatory() : boolean`

**Description:** Checks if this attribute is mandatory.

**Returns:**

true, if this attribute is mandatory

---

### isMultiValueType

**Signature:** `isMultiValueType() : boolean`

**Description:** Returns true if the attribute can have multiple values. Attributes of the following types are multi-value capable: VALUE_TYPE_SET_OF_INT VALUE_TYPE_SET_OF_NUMBER VALUE_TYPE_SET_OF_STRING Additionally, attributes of the following types can be multi-value enabled: VALUE_TYPE_ENUM_OF_INT VALUE_TYPE_ENUM_OF_STRING

**Returns:**

true if attributes can have multiple values, otherwise false

---

### isSetValueType

**Signature:** `isSetValueType() : boolean`

**Description:** Returns true if the attribute is of type 'Set of'.

**Deprecated:**

Use isMultiValueType() instead.

---

### isSystem

**Signature:** `isSystem() : boolean`

**Description:** Indicates if the attribute is a pre-defined system attribute or a custom attribute.

**Returns:**

true if the the attribute is a pre-defined system attribute, false if it is a custom attribute.

---

### requiresEncoding

**Signature:** `requiresEncoding() : boolean`

**Description:** Returns a boolean flag indicating whether or not values of this attribute definition should be encoded using the encoding="off" flag in ISML templates.

**Returns:**

a boolean flag indicating whether or not values of this attribute definition should be encoded using the encoding="off" flag in ISML templates.

---
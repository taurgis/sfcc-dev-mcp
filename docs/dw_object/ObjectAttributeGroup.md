## Package: dw.object

# Class ObjectAttributeGroup

## Inheritance Hierarchy

- Object
  - dw.object.ObjectAttributeGroup

## Description

Represents a group of object attributes.

## Properties

### attributeDefinitions

**Type:** Collection (Read Only)

All attribute definitions for this group. The collection
 may contain both system attribute definition as well as custom
 attribute definitions.

### description

**Type:** String (Read Only)

The description of this group in the current locale.

### displayName

**Type:** String (Read Only)

The display name of this group.

### ID

**Type:** String (Read Only)

The ID of this group.

### objectTypeDefinition

**Type:** ObjectTypeDefinition (Read Only)

The object type definition to which this attribute group
 belongs.

### system

**Type:** boolean (Read Only)

Identifies if this is an sytem or a custom attribute group. A system
 attribute group is pre-defined and can not be deleted.

## Constructor Summary

## Method Summary

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

Returns all attribute definitions for this group.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of this group in the current locale.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of this group.

### getID

**Signature:** `getID() : String`

Returns the ID of this group.

### getObjectTypeDefinition

**Signature:** `getObjectTypeDefinition() : ObjectTypeDefinition`

Returns the object type definition to which this attribute group belongs.

### isSystem

**Signature:** `isSystem() : boolean`

Identifies if this is an sytem or a custom attribute group.

## Method Detail

## Method Details

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

**Description:** Returns all attribute definitions for this group. The collection may contain both system attribute definition as well as custom attribute definitions.

**Returns:**

all attribute definitions for this group.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of this group in the current locale.

**Returns:**

the display name of this group.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of this group.

**Returns:**

the display name of this group.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this group.

**Returns:**

the ID of this group.

---

### getObjectTypeDefinition

**Signature:** `getObjectTypeDefinition() : ObjectTypeDefinition`

**Description:** Returns the object type definition to which this attribute group belongs.

**Returns:**

the object type definition to which this attribute group belongs.

---

### isSystem

**Signature:** `isSystem() : boolean`

**Description:** Identifies if this is an sytem or a custom attribute group. A system attribute group is pre-defined and can not be deleted.

**Returns:**

true if this is a system attribute group, false otherwise.

---
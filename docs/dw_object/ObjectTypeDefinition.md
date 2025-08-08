## Package: dw.object

# Class ObjectTypeDefinition

## Inheritance Hierarchy

- Object
  - dw.object.ObjectTypeDefinition

## Description

The class provides access to the meta data of a system object or custom object. A short example should suffice to demonstrate how this metadata can be used in a script: var co : CustomObject = CustomObjectMgr.getCustomObject("sample", "MyCustomObject"); // get the object type definition var typeDef : ObjectTypeDefinition = co.describe(); // get the custom object attribute definition for name "enumIntValue" var attrDef : ObjectAttributeDefinition = typeDef.getCustomAttributeDefinition( "enumIntValue" ); // get the collection of object attribute value definitions var valueDefs : Collection = attrDef.getValues(); // return function if there are no object attribute value definitions if(valueDefs.isEmpty()) { return; } var displayValue : String; // loop over object attribute value definitions collection for each ( var valueDef : ObjectAttributeValueDefinition in valueDefs ) { if( valueDef.getValue() == co.custom.intValue ) { displayValue = valueDef.getDisplayValue(); break; } }

## Properties

### attributeDefinitions

**Type:** Collection (Read Only)

A collection of all declared attributes for the object.
 The collection contains both system and custom attributes. There might
 be system and custom attribute with identical names. So the name of the
 attribute is not a uniqueness criteria. Additional the isCustom() flag
 must be checked.

### attributeGroups

**Type:** Collection (Read Only)

A collection of all declared attribute groups. A attribute group
 is a collection of attribute, which are typically displayed together as
 a visual group.

### displayName

**Type:** String (Read Only)

The display name of the definition, which can be used in the
 user interface.

### ID

**Type:** String (Read Only)

The type id of the business objects.

### system

**Type:** boolean (Read Only)

Identifies if this object definition is for a system type or a custom
 type.

## Constructor Summary

## Method Summary

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

Returns a collection of all declared attributes for the object.

### getAttributeGroup

**Signature:** `getAttributeGroup(name : String) : ObjectAttributeGroup`

Returns the attribute group with the given name within this object type definition.

### getAttributeGroups

**Signature:** `getAttributeGroups() : Collection`

Returns a collection of all declared attribute groups.

### getCustomAttributeDefinition

**Signature:** `getCustomAttributeDefinition(name : String) : ObjectAttributeDefinition`

Returns the custom attribute definition with the given name.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of the definition, which can be used in the user interface.

### getID

**Signature:** `getID() : String`

Returns the type id of the business objects.

### getSystemAttributeDefinition

**Signature:** `getSystemAttributeDefinition(name : String) : ObjectAttributeDefinition`

Returns the system attribute definition with the given name.

### isSystem

**Signature:** `isSystem() : boolean`

Identifies if this object definition is for a system type or a custom type.

## Method Detail

## Method Details

### getAttributeDefinitions

**Signature:** `getAttributeDefinitions() : Collection`

**Description:** Returns a collection of all declared attributes for the object. The collection contains both system and custom attributes. There might be system and custom attribute with identical names. So the name of the attribute is not a uniqueness criteria. Additional the isCustom() flag must be checked.

**Returns:**

a collection of all declared attributes for the object.

---

### getAttributeGroup

**Signature:** `getAttributeGroup(name : String) : ObjectAttributeGroup`

**Description:** Returns the attribute group with the given name within this object type definition.

**Parameters:**

- `name`: The name of the attribute scope to return.

**Returns:**

The matching attribute scope or null if no such scope exists.

---

### getAttributeGroups

**Signature:** `getAttributeGroups() : Collection`

**Description:** Returns a collection of all declared attribute groups. A attribute group is a collection of attribute, which are typically displayed together as a visual group.

**Returns:**

a collection of all declared attribute groups.

---

### getCustomAttributeDefinition

**Signature:** `getCustomAttributeDefinition(name : String) : ObjectAttributeDefinition`

**Description:** Returns the custom attribute definition with the given name. The method returns null if no custom attribute is defined with that name.

**Parameters:**

- `name`: The unique name of the custom attribute definition within the object type.

**Returns:**

The matching attribute definition or null in case no such definition exists.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of the definition, which can be used in the user interface.

**Returns:**

the display name of the definition, which can be used in the user interface.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the type id of the business objects.

**Returns:**

the type id of the business objects.

---

### getSystemAttributeDefinition

**Signature:** `getSystemAttributeDefinition(name : String) : ObjectAttributeDefinition`

**Description:** Returns the system attribute definition with the given name. The method returns null if no system attribute is defined with that name. Only system objects have system attributes. A CustomObject has no system attributes and so the method will always return null for a CustomObject.

**Parameters:**

- `name`: The unique name of the custom attribute definition within the object type.

**Returns:**

The matching attribute definition or null in case no such definition exists.

---

### isSystem

**Signature:** `isSystem() : boolean`

**Description:** Identifies if this object definition is for a system type or a custom type.

**Returns:**

true if this object definition is for a system type, false otherwise.

---
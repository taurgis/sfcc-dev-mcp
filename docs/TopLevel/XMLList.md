## Package: TopLevel

# Class XMLList

## Inheritance Hierarchy

- Object
  - XMLList

## Description

An XMLList object is an ordered collection of properties. A XMLList object represents a XML document, an XML fragment, or an arbitrary collection of XML objects. An individual XML object is the same thing as an XMLList containing only that XML object. All operations available for the XML object are also available for an XMLList object that contains exactly one XML object.

## Constructor Summary

XMLList(value : Object) Creates a new XMLList object using the specified value.

## Method Summary

### attribute

**Signature:** `attribute(attributeName : String) : XMLList`

Returns the attribute associated with this XMLList object that is identified by the specified name.

### attributes

**Signature:** `attributes() : XMLList`

Returns an XMList of the attributes in this XMLList Object.

### child

**Signature:** `child(propertyName : Object) : XMLList`

Returns the children of the XMLList object based on the specified property name.

### children

**Signature:** `children() : XMLList`

Returns an XMLList containing the children of this XMLList object, maintaing the sequence in which they appear.

### comments

**Signature:** `comments() : XMLList`

Returns the properties of the XMLList object that contain comments.

### contains

**Signature:** `contains(value : XML) : boolean`

Returns true if this XMLList object contains the specified XML object, false otherwise.

### copy

**Signature:** `copy() : XMLList`

Returns a deep copy of the this XMLList object.

### descendants

**Signature:** `descendants() : XMLList`

Calls the descendants() method of each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

### descendants

**Signature:** `descendants(name : String) : XMLList`

Calls the descendants(name) method of each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

### elements

**Signature:** `elements() : XMLList`

Calls the elements() method in each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

### elements

**Signature:** `elements(name : Object) : XMLList`

Calls the elements(name) method in each of the XML objects in this XMLList object and returns an XMLList containing the results concatenated in order.

### hasComplexContent

**Signature:** `hasComplexContent() : boolean`

Returns a Boolean value indicating whether this XMLList object contains complex content.

### hasOwnProperty

**Signature:** `hasOwnProperty(prop : String) : boolean`

Returns a Boolean value indicating whether this object has the property specified by prop.

### hasSimpleContent

**Signature:** `hasSimpleContent() : boolean`

Returns a Boolean value indicating whether this XML object contains simple content.

### length

**Signature:** `length() : Number`

Returns the number of children in this XMLList object.

### normalize

**Signature:** `normalize() : XMLList`

Puts all text nodes in this XMLList, all the XML objects it contains and the descendents of all the XML objects it contains into a normal form by merging adjacent text nodes and eliminating empty text nodes.

### parent

**Signature:** `parent() : Object`

Returns the parent of the XMLList object or null if the XMLList object does not have a parent.

### processingInstructions

**Signature:** `processingInstructions() : XMLList`

Calls the processingInstructions() method of each XML object in this XMLList object and returns an XMList containing the results in order.

### processingInstructions

**Signature:** `processingInstructions(name : String) : XMLList`

Calls the processingInstructions(name) method of each XML object in this XMLList object and returns an XMList containing the results in order.

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(property : String) : boolean`

Returns a Boolean indicating whether the specified property will be included in the set of properties iterated over when this XML object is used in a for..in statement.

### text

**Signature:** `text() : XMLList`

Calls the text() method of each XML object contained in this XMLList object and returns an XMLList containing the results concatenated in order.

### toString

**Signature:** `toString() : String`

Returns the String representation of this XMLList object.

### toXMLString

**Signature:** `toXMLString() : String`

Returns an XML-encoded String representation of the XMLList object by calling the toXMLString method on each property contained within this XMLList object.

### valueOf

**Signature:** `valueOf() : XMLList`

Returns this XMLList object.

## Constructor Detail

## Method Detail

## Method Details

### attribute

**Signature:** `attribute(attributeName : String) : XMLList`

**Description:** Returns the attribute associated with this XMLList object that is identified by the specified name.

**Parameters:**

- `attributeName`: the name of the attribute.

**Returns:**

the value of the attribute as either an XMLList or an empty XMLList

---

### attributes

**Signature:** `attributes() : XMLList`

**Description:** Returns an XMList of the attributes in this XMLList Object.

**Returns:**

an XMList of the attributes in this XMLList Object.

---

### child

**Signature:** `child(propertyName : Object) : XMLList`

**Description:** Returns the children of the XMLList object based on the specified property name.

**Parameters:**

- `propertyName`: the property name representing the children of this XMLList object.

**Returns:**

an XMLList of children that match the property name parameter.

---

### children

**Signature:** `children() : XMLList`

**Description:** Returns an XMLList containing the children of this XMLList object, maintaing the sequence in which they appear.

**Returns:**

an XMLList containing the children of this XMLList object.

---

### comments

**Signature:** `comments() : XMLList`

**Description:** Returns the properties of the XMLList object that contain comments.

**Returns:**

properties of the XMLList object that contain comments.

---

### contains

**Signature:** `contains(value : XML) : boolean`

**Description:** Returns true if this XMLList object contains the specified XML object, false otherwise.

**Parameters:**

- `value`: the object to locate in this XMLList object.

**Returns:**

true if this XMLList object contains the specified XML object, false otherwise.

---

### copy

**Signature:** `copy() : XMLList`

**Description:** Returns a deep copy of the this XMLList object.

**Returns:**

the deep copy of the object.

---

### descendants

**Signature:** `descendants() : XMLList`

**Description:** Calls the descendants() method of each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

**Returns:**

a list of all descendents of the XML objects in this XMLList object.

---

### descendants

**Signature:** `descendants(name : String) : XMLList`

**Description:** Calls the descendants(name) method of each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

**Parameters:**

- `name`: the name of the element to match. To return all descendents, use * as the name parameter.

**Returns:**

a list of all descendents of the XML objects in this XMLList constrained by the name parameter.

---

### elements

**Signature:** `elements() : XMLList`

**Description:** Calls the elements() method in each XML object in this XMLList object and returns an XMLList containing the results concatenated in order.

---

### elements

**Signature:** `elements(name : Object) : XMLList`

**Description:** Calls the elements(name) method in each of the XML objects in this XMLList object and returns an XMLList containing the results concatenated in order. name can be a QName, String, or any other data type that will be converted to a string prior to performing the search for elements of that name. To list all objects use * for the value of name.

**Parameters:**

- `name`: the name of the elements to return.

**Returns:**

a list of all elements of the XML objects in this XMLList constrained by the name parameter.

---

### hasComplexContent

**Signature:** `hasComplexContent() : boolean`

**Description:** Returns a Boolean value indicating whether this XMLList object contains complex content. An XMLList object is considered to contain complex content if it is not empty, contains a single XML item with complex content or contains elements.

**Returns:**

a Boolean value indicating whether this XMLList object contains complex content.

---

### hasOwnProperty

**Signature:** `hasOwnProperty(prop : String) : boolean`

**Description:** Returns a Boolean value indicating whether this object has the property specified by prop.

**Parameters:**

- `prop`: the property to locate.

**Returns:**

true if the property exists, false otherwise.

---

### hasSimpleContent

**Signature:** `hasSimpleContent() : boolean`

**Description:** Returns a Boolean value indicating whether this XML object contains simple content. An XMLList object is considered to contain simple content if it is empty, contains a single XML item with simple content or contains no elements.

**Returns:**

a Boolean value indicating whether this XML object contains simple content.

---

### length

**Signature:** `length() : Number`

**Description:** Returns the number of children in this XMLList object.

**Returns:**

the number of children in this XMLList object.

---

### normalize

**Signature:** `normalize() : XMLList`

**Description:** Puts all text nodes in this XMLList, all the XML objects it contains and the descendents of all the XML objects it contains into a normal form by merging adjacent text nodes and eliminating empty text nodes.

**Returns:**

the XMLList object containing normailzed objects.

---

### parent

**Signature:** `parent() : Object`

**Description:** Returns the parent of the XMLList object or null if the XMLList object does not have a parent.

**Returns:**

the parent of the XMLList object or null if the XMLList object does not have a parent.

---

### processingInstructions

**Signature:** `processingInstructions() : XMLList`

**Description:** Calls the processingInstructions() method of each XML object in this XMLList object and returns an XMList containing the results in order.

**Returns:**

an XMLList contaiing the result of calling the processingInstructions() method of each XML object in this XMLList object.

---

### processingInstructions

**Signature:** `processingInstructions(name : String) : XMLList`

**Description:** Calls the processingInstructions(name) method of each XML object in this XMLList object and returns an XMList containing the results in order.

**Parameters:**

- `name`: the name representing the processing-instructions you want to retreive.

**Returns:**

an XMLList containing the result of calling the processingInstructions(name) method of each XML object in this XMLList object.

---

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(property : String) : boolean`

**Description:** Returns a Boolean indicating whether the specified property will be included in the set of properties iterated over when this XML object is used in a for..in statement.

**Parameters:**

- `property`: the property to test.

**Returns:**

true when the property can be iterated in a for..in statement, false otherwise.

---

### text

**Signature:** `text() : XMLList`

**Description:** Calls the text() method of each XML object contained in this XMLList object and returns an XMLList containing the results concatenated in order.

**Returns:**

the concatenated results of calling the text() method of every XML object contained in this XMLList.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns the String representation of this XMLList object.

**Returns:**

the String representation of this XMLList object.

---

### toXMLString

**Signature:** `toXMLString() : String`

**Description:** Returns an XML-encoded String representation of the XMLList object by calling the toXMLString method on each property contained within this XMLList object.

**Returns:**

an XML-encoded String representation of the XMLList object by calling the toXMLString method on each property contained within this XMLList object.

---

### valueOf

**Signature:** `valueOf() : XMLList`

**Description:** Returns this XMLList object.

**Returns:**

this XMLList object.

---
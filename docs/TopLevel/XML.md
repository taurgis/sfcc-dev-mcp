## Package: TopLevel

# Class XML

## Inheritance Hierarchy

- Object
  - XML

## Description

The XML object contains functions and properties for working with XML instances. The XML object implements the powerful XML-handling standards defined in the ECMA-357 specification (known as "E4X"). Use the toXMLString() method to return a string representation of the XML object regardless of whether the XML object has simple content or complex content. Do not create large XML objects in memory to avoid out-of-memory conditions. When dealing with XML streams use XMLStreamReader and XMLStreamWriter. The following example shows how: var id : String = "p42"; var pname : String = "a product"; // use E4X syntax var product : XML = <product id={id}> <name>{pname}</name> <shortdesc></shortdesc> </product>; product.shortdesc = "a fine product"; product.longdesc = "this is a fine product"; var xmlString = product.toXMLString(); fileWriter.write(xmlString); The code above will write the following to file: <product id="p42"> <name>a product</name> <shortdesc>a fine product</shortdesc> <longdesc>this is a fine product</longdesc> </product> Do not create large XML objects in memory to avoid out-of-memory conditions. When dealing with XML streams use XMLStreamReader and XMLStreamWriter.

## Properties

## Constructor Summary

XML() Creates a new XML object.

XML(value : Object) Creates a new XML object.

## Method Summary

### addNamespace

**Signature:** `addNamespace(ns : Object) : XML`

Adds a namespace to the set of in-scope namespaces for the XML object.

### appendChild

**Signature:** `appendChild(child : Object) : XML`

Appends the specified child to the end of the object's properties.

### attribute

**Signature:** `attribute(attributeName : String) : XMLList`

Returns the attribute associated with this XML object that is identified by the specified name.

### attributes

**Signature:** `attributes() : XMLList`

Returns an XMList of the attributes in this XML Object.

### child

**Signature:** `child(propertyName : Object) : XMLList`

Returns the children of the XML object based on the specified property name.

### childIndex

**Signature:** `childIndex() : Number`

Identifies the zero-based index of this XML object within the context of its parent, or -1 if this object has no parent.

### children

**Signature:** `children() : XMLList`

Returns an XMLList containing the children of this XML object, maintaing the sequence in which they appear.

### comments

**Signature:** `comments() : XMLList`

Returns the properties of the XML object that contain comments.

### contains

**Signature:** `contains(value : XML) : boolean`

Returns true if this XML object contains the specified XML object, false otherwise.

### copy

**Signature:** `copy() : XML`

Returns a copy of the this XML object including duplicate copies of the entire tree of nodes.

### defaultSettings

**Signature:** `static defaultSettings() : Object`

Returns a new Object with the following properties set to the default values: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyIndent, and prettyPrinting.

### descendants

**Signature:** `descendants() : XMLList`

Returns all descendents of the XML object.

### descendants

**Signature:** `descendants(name : String) : XMLList`

Returns all descendents of the XML object that have the specified name parameter.

### elements

**Signature:** `elements() : XMLList`

Returns a list of all of the elements of the XML object.

### elements

**Signature:** `elements(name : Object) : XMLList`

Returns a list of the elements of the XML object using the specified name to constrain the list.

### hasComplexContent

**Signature:** `hasComplexContent() : boolean`

Returns a Boolean value indicating whether this XML object contains complex content.

### hasOwnProperty

**Signature:** `hasOwnProperty(prop : String) : boolean`

Returns a Boolean value indicating whether this object has the property specified by prop.

### hasSimpleContent

**Signature:** `hasSimpleContent() : boolean`

Returns a Boolean value indicating whether this XML object contains simple content.

### inScopeNamespaces

**Signature:** `inScopeNamespaces() : Array`

Returns an Array of Namespace objects representing the namespaces in scope for this XML object in the context of its parent.

### insertChildAfter

**Signature:** `insertChildAfter(child1 : Object, child2 : Object) : XML`

Inserts the specified child2 after the specified child1 in this XML object and returns this XML object.

### insertChildBefore

**Signature:** `insertChildBefore(child1 : Object, child2 : Object) : XML`

Inserts the specified child2 before the specified child1 in this XML object and returns this XML object.

### length

**Signature:** `length() : Number`

Returns a value of 1 for XML objects.

### localName

**Signature:** `localName() : Object`

Returns the local name portion of the qualified name of the XML object.

### name

**Signature:** `name() : Object`

Returns the qualified name for the XML object.

### namespace

**Signature:** `namespace() : Object`

Returns the namespace associated with the qualified name of this XML object.

### namespace

**Signature:** `namespace(prefix : String) : Object`

Returns the namespace that matches the specified prefix and that is in scope for the XML object.

### namespaceDeclarations

**Signature:** `namespaceDeclarations() : Array`

Returns an Array of namespace declarations associated with the XML Obnject in the context of its parent.

### nodeKind

**Signature:** `nodeKind() : String`

Returns the type of the XML object, such as text, comment, processing-instruction, or attribute.

### normalize

**Signature:** `normalize() : XML`

Merges adjacent text nodes and eliminates and eliminates empty text nodes for this XML object and all its descendents.

### parent

**Signature:** `parent() : Object`

Returns the parent of the XML object or null if the XML object does not have a parent.

### prependChild

**Signature:** `prependChild(value : Object) : XML`

Inserts the specified child into this XML object prior to its existing XML properties and then returns this XML object.

### processingInstructions

**Signature:** `processingInstructions() : XMLList`

Returns an XMLList containing all the children of this XML object that are processing-instructions.

### processingInstructions

**Signature:** `processingInstructions(name : String) : XMLList`

Returns an XMLList containing all the children of this XML object that are processing-instructions with the specified name.

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(property : String) : boolean`

Returns a Boolean indicating whether the specified property will be included in the set of properties iterated over when this XML object is used in a for..in statement.

### removeNamespace

**Signature:** `removeNamespace(ns : Namespace) : XML`

Removes the specified namespace from the in scope namespaces of this object and all its descendents, then returns a copy of this XML object.

### replace

**Signature:** `replace(propertyName : String, value : Object) : XML`

Replaces the XML properties of this XML object specified by propertyName with value and returns this updated XML object.

### setChildren

**Signature:** `setChildren(value : Object) : XML`

Replaces the XML properties of this XML object with a new set of XML properties from value.

### setLocalName

**Signature:** `setLocalName(name : String) : void`

Replaces the local name of this XML object with a string constructed from the specified name.

### setName

**Signature:** `setName(name : String) : void`

Replaces the name of this XML object with a QName or AttributeName constructed from the specified name.

### setNamespace

**Signature:** `setNamespace(ns : Namespace) : void`

Replaces the namespace associated with the name of this XML object with the specified namespace.

### setSettings

**Signature:** `static setSettings() : void`

Restores the default settings for the following XML properties: XML.ignoreComments = true XML.ignoreProcessingInstructions = true XML.ignoreWhitespace = true XML.prettyIndent = 2 XML.prettyPrinting = true

### setSettings

**Signature:** `static setSettings(settings : Object) : void`

Updates the collection of global XML properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyPrinting, prettyIndent, and prettyPrinting.

### settings

**Signature:** `static settings() : Object`

Returns the collection of global XML properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyPrinting, prettyIndent, and prettyPrinting.

### text

**Signature:** `text() : XMLList`

Returns an XMLList containing all XML properties of this XML object that represent XML text nodes.

### toString

**Signature:** `toString() : String`

Returns the String representation of the XML object.

### toXMLString

**Signature:** `toXMLString() : String`

Returns a XML-encoded String representation of the XML object, including tag and attributed delimiters.

### valueOf

**Signature:** `valueOf() : XML`

Returns this XML object.

## Constructor Detail

## Method Detail

## Method Details

### addNamespace

**Signature:** `addNamespace(ns : Object) : XML`

**Description:** Adds a namespace to the set of in-scope namespaces for the XML object. If the namespace already exists in the in-scope namespaces for the XML object, then the prefix of the existing namespace is set to undefined. If ns is a Namespace instance, it is used directly. However, if ns is a QName instance, the input parameter's URI is used to create a new namespace. If ns is not a Namespace or QName instance, ns is converted to a String and a namespace is created from the String.

**Parameters:**

- `ns`: the namespace to add to the XML object.

**Returns:**

a new XML object, with the namespace added.

---

### appendChild

**Signature:** `appendChild(child : Object) : XML`

**Description:** Appends the specified child to the end of the object's properties. child should be a XML object, an XMLList object or any other data type that will then be converted to a String.

**Parameters:**

- `child`: the object to append to this XML object.

**Returns:**

the XML object with the child appended.

---

### attribute

**Signature:** `attribute(attributeName : String) : XMLList`

**Description:** Returns the attribute associated with this XML object that is identified by the specified name.

**Parameters:**

- `attributeName`: the name of the attribute.

**Returns:**

the value of the attribute as either an XMLList or an empty XMLList

---

### attributes

**Signature:** `attributes() : XMLList`

**Description:** Returns an XMList of the attributes in this XML Object.

**Returns:**

an XMList of the attributes in this XML Object.

---

### child

**Signature:** `child(propertyName : Object) : XMLList`

**Description:** Returns the children of the XML object based on the specified property name.

**Parameters:**

- `propertyName`: the property name representing the children of this XML object.

**Returns:**

an XMLList of children that match the property name parameter.

---

### childIndex

**Signature:** `childIndex() : Number`

**Description:** Identifies the zero-based index of this XML object within the context of its parent, or -1 if this object has no parent.

**Returns:**

the index of this XML object in the context of its parent, or -1 if this object has no parent.

---

### children

**Signature:** `children() : XMLList`

**Description:** Returns an XMLList containing the children of this XML object, maintaing the sequence in which they appear.

**Returns:**

an XMLList containing the children of this XML object.

---

### comments

**Signature:** `comments() : XMLList`

**Description:** Returns the properties of the XML object that contain comments.

**Returns:**

properties of the XML object that contain comments.

---

### contains

**Signature:** `contains(value : XML) : boolean`

**Description:** Returns true if this XML object contains the specified XML object, false otherwise.

**Parameters:**

- `value`: the object to locate in this XML object.

**Returns:**

true if this XML object contains the specified XML object, false otherwise.

---

### copy

**Signature:** `copy() : XML`

**Description:** Returns a copy of the this XML object including duplicate copies of the entire tree of nodes. The copied XML object has no parent.

**Returns:**

the copy of the object.

---

### defaultSettings

**Signature:** `static defaultSettings() : Object`

**Description:** Returns a new Object with the following properties set to the default values: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyIndent, and prettyPrinting. The default values are as follows: ignoreComments = true ignoreProcessingInstructions = true ignoreWhitespace = true prettyIndent = 2 prettyPrinting = true Be aware that this method does not apply the settings to an existing instance of an XML object. Instead, this method returns an Object containing the default settings.

**Returns:**

an Object with properties set to the default settings.

---

### descendants

**Signature:** `descendants() : XMLList`

**Description:** Returns all descendents of the XML object.

**Returns:**

a list of all descendents of the XML object.

---

### descendants

**Signature:** `descendants(name : String) : XMLList`

**Description:** Returns all descendents of the XML object that have the specified name parameter. To return all descendents, use * as the name parameter.

**Parameters:**

- `name`: the name of the element to match. To return all descendents, use * as the name parameter.

**Returns:**

a list of all descendents constrained by the name parameter.

---

### elements

**Signature:** `elements() : XMLList`

**Description:** Returns a list of all of the elements of the XML object.

---

### elements

**Signature:** `elements(name : Object) : XMLList`

**Description:** Returns a list of the elements of the XML object using the specified name to constrain the list. name can be a QName, String, or any other data type that will be converted to a string prior to performing the search for elements of that name. To list all objects use * for the value of name.

**Parameters:**

- `name`: the name of the elements to return or an * to return all elements.

**Returns:**

a list of the elements of the XML object using the specified name to constrain the list.

---

### hasComplexContent

**Signature:** `hasComplexContent() : boolean`

**Description:** Returns a Boolean value indicating whether this XML object contains complex content. An XML object is considered to contain complex content if it represents an XML element that has child elements. XML objects representing attributes, comments, processing instructions and text nodes do not have complex content. The existence of attributes, comments, processing instructions and text nodes within an XML object is not significant in determining if it has complex content.

**Returns:**

a Boolean value indicating whether this XML object contains complex content.

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

**Description:** Returns a Boolean value indicating whether this XML object contains simple content. An XML object is considered to contain simple content if it represents a text node, represents an attribute node or if it represents an XML element that has no child elements. XML objects representing comments and processing instructions do not have simple content. The existence of attributes, comments, processing instructions and text nodes within an XML object is not significant in determining if it has simple content.

**Returns:**

a Boolean value indicating whether this XML object contains simple content.

---

### inScopeNamespaces

**Signature:** `inScopeNamespaces() : Array`

**Description:** Returns an Array of Namespace objects representing the namespaces in scope for this XML object in the context of its parent. If the parent of this XML object is modified, the associated namespace declarations may change. The set of namespaces returned by this method may be a super set of the namespaces used by this value

**Returns:**

an Array of Namespace objects representing the namespaces in scope for this XML object in the context of its parent.

---

### insertChildAfter

**Signature:** `insertChildAfter(child1 : Object, child2 : Object) : XML`

**Description:** Inserts the specified child2 after the specified child1 in this XML object and returns this XML object. If child1 is null, inserts child2 before all children of this XML object. If child1 does not exist in this XML object, it returns without modifying this XML object.

**Parameters:**

- `child1`: the child after which child2 is inserted.
- `child2`: the child to insert into this XML object.

**Returns:**

the updated XML object.

---

### insertChildBefore

**Signature:** `insertChildBefore(child1 : Object, child2 : Object) : XML`

**Description:** Inserts the specified child2 before the specified child1 in this XML object and returns this XML object. If child1 is null, inserts child2 after all children of this XML object. If child1 does not exist in this XML object, it returns without modifying this XML object.

**Parameters:**

- `child1`: the child before which child2 is inserted.
- `child2`: the child to insert into this XML object.

**Returns:**

the updated XML object.

---

### length

**Signature:** `length() : Number`

**Description:** Returns a value of 1 for XML objects.

**Returns:**

the value of 1.

---

### localName

**Signature:** `localName() : Object`

**Description:** Returns the local name portion of the qualified name of the XML object.

**Returns:**

the local name as either a String or null.

---

### name

**Signature:** `name() : Object`

**Description:** Returns the qualified name for the XML object.

**Returns:**

the qualified name as either a QName or null.

---

### namespace

**Signature:** `namespace() : Object`

**Description:** Returns the namespace associated with the qualified name of this XML object.

**Returns:**

the namespace associated with the qualified name of this XML object.

---

### namespace

**Signature:** `namespace(prefix : String) : Object`

**Description:** Returns the namespace that matches the specified prefix and that is in scope for the XML object. if there is no such namespace, the method returns undefined.

**Parameters:**

- `prefix`: the prefix to use when attempting to locate a namespace.

**Returns:**

the namespace that matches the specified prefix and that is in scope for the XML object. If specified namespace does not exist, the method returns undefined.

---

### namespaceDeclarations

**Signature:** `namespaceDeclarations() : Array`

**Description:** Returns an Array of namespace declarations associated with the XML Obnject in the context of its parent.

**Returns:**

an Array of namespace declarations associated with the XML Obnject in the context of its parent.

---

### nodeKind

**Signature:** `nodeKind() : String`

**Description:** Returns the type of the XML object, such as text, comment, processing-instruction, or attribute.

**Returns:**

the type of the XML object.

---

### normalize

**Signature:** `normalize() : XML`

**Description:** Merges adjacent text nodes and eliminates and eliminates empty text nodes for this XML object and all its descendents.

**Returns:**

the normalized XML object.

---

### parent

**Signature:** `parent() : Object`

**Description:** Returns the parent of the XML object or null if the XML object does not have a parent.

**Returns:**

the parent of the XML object of null if the XML object does not have a parent.

---

### prependChild

**Signature:** `prependChild(value : Object) : XML`

**Description:** Inserts the specified child into this XML object prior to its existing XML properties and then returns this XML object.

**Parameters:**

- `value`: the child to prepend to this XML object.

**Returns:**

the XML object updated with the prepended child.

---

### processingInstructions

**Signature:** `processingInstructions() : XMLList`

**Description:** Returns an XMLList containing all the children of this XML object that are processing-instructions.

**Returns:**

an XMLList containing all the children of this XML object that are processing-instructions.

---

### processingInstructions

**Signature:** `processingInstructions(name : String) : XMLList`

**Description:** Returns an XMLList containing all the children of this XML object that are processing-instructions with the specified name. If you use * for the name, all processing-instructions are returned.

**Parameters:**

- `name`: the name representing the processing-instructions you want to retreive.

**Returns:**

an XMLList containing all the children of this XML object that are processing-instructions with the specified name.

---

### propertyIsEnumerable

**Signature:** `propertyIsEnumerable(property : String) : boolean`

**Description:** Returns a Boolean indicating whether the specified property will be included in the set of properties iterated over when this XML object is used in a for..in statement.

**Parameters:**

- `property`: the property to test.

**Returns:**

true when the property can be iterated in a for..in statement, false otherwise.

---

### removeNamespace

**Signature:** `removeNamespace(ns : Namespace) : XML`

**Description:** Removes the specified namespace from the in scope namespaces of this object and all its descendents, then returns a copy of this XML object. This method will not remove a namespace from an object when it is referenced by that object's QName or the ONames of that object's attributes.

**Parameters:**

- `ns`: the namespace to remove.

**Returns:**

a copy of this XML object with the namespace removed.

---

### replace

**Signature:** `replace(propertyName : String, value : Object) : XML`

**Description:** Replaces the XML properties of this XML object specified by propertyName with value and returns this updated XML object. If this XML object contains no properties that match propertyName, the replace method returns without modifying this XML object. The propertyName parameter may be a numeric property name, an unqualified name for a set of XML elements, a qualified name for a set of XML elements or the properties wildcard *. When the propertyName parameter is an unqualified name, it identifies XML elements in the default namespace. The value parameter may be an XML object, XMLList object or any value that may be converted to a String.

**Parameters:**

- `propertyName`: a numeric property name, an unqualified name for a set of XML elements, a qualified name for a set of XML elements or the properties wildcard *.
- `value`: an XML object, XMLList object or any value that may be converted to a String.

**Returns:**

the updated XML object.

---

### setChildren

**Signature:** `setChildren(value : Object) : XML`

**Description:** Replaces the XML properties of this XML object with a new set of XML properties from value.

**Parameters:**

- `value`: a single XML object or an XMLList.

**Returns:**

the updated XML object.

---

### setLocalName

**Signature:** `setLocalName(name : String) : void`

**Description:** Replaces the local name of this XML object with a string constructed from the specified name.

**Parameters:**

- `name`: the new local name.

---

### setName

**Signature:** `setName(name : String) : void`

**Description:** Replaces the name of this XML object with a QName or AttributeName constructed from the specified name.

**Parameters:**

- `name`: the new name of this XML object.

---

### setNamespace

**Signature:** `setNamespace(ns : Namespace) : void`

**Description:** Replaces the namespace associated with the name of this XML object with the specified namespace.

**Parameters:**

- `ns`: the namespace to associated with the name of thix XML object.

---

### setSettings

**Signature:** `static setSettings() : void`

**Description:** Restores the default settings for the following XML properties: XML.ignoreComments = true XML.ignoreProcessingInstructions = true XML.ignoreWhitespace = true XML.prettyIndent = 2 XML.prettyPrinting = true

---

### setSettings

**Signature:** `static setSettings(settings : Object) : void`

**Description:** Updates the collection of global XML properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyPrinting, prettyIndent, and prettyPrinting.

**Parameters:**

- `settings`: an object with each of the following properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyIndent, and prettyPrinting.

---

### settings

**Signature:** `static settings() : Object`

**Description:** Returns the collection of global XML properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyPrinting, prettyIndent, and prettyPrinting.

**Returns:**

an object with each of the following properties: ignoreComments, ignoreProcessingInstructions, ignoreWhitespace, prettyIndent, and prettyPrinting.

---

### text

**Signature:** `text() : XMLList`

**Description:** Returns an XMLList containing all XML properties of this XML object that represent XML text nodes.

**Returns:**

an XMLList containing all XML properties of this XML object that represent XML text nodes.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns the String representation of the XML object. If the object contains simple content, this method returns a String with tag, attributes, and namespace declarations removed. However, if the object contains complex content, this method returns an XML encoded String representing the entire XML object. If you want to return the entire XML object regardless of content complexity, use the toXMLString() method.

**Returns:**

the String representation of the XML object.

---

### toXMLString

**Signature:** `toXMLString() : String`

**Description:** Returns a XML-encoded String representation of the XML object, including tag and attributed delimiters.

**Returns:**

the string representation of the XML object.

---

### valueOf

**Signature:** `valueOf() : XML`

**Description:** Returns this XML object.

**Returns:**

this XML object.

---
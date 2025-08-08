## Package: TopLevel

# Class QName

## Inheritance Hierarchy

- Object
  - QName

## Description

QName objects are used to represent qualified names of XML elements and attributes. Each QName object has a local name of type string and a namespace URI of type string or null. When the namespace URI is null, this qualified name matches any namespace. If the QName of an XML element is specified without identifying a namespace (i.e., as an unqualified identifier), the uri property of the associated QName will be set to the in-scope default namespace. If the QName of an XML attribute is specified without identifying a namespace, the uri property of the associated QName will be the empty string representing no namespace.

## Properties

### localName

**Type:** String (Read Only)

The local name of the QName object.

### uri

**Type:** String (Read Only)

The Uniform Resource Identifier (URI) of the QName object.

## Constructor Summary

QName() Constructs a QName object where localName is set to an empty String.

QName(qname : QName) Constructs a QName object that is a copy of the specified qname.

QName(uri : Namespace, localName : QName) Creates a QName object with a uri from a Namespace object and a localName from a QName object.

## Method Summary

### getLocalName

**Signature:** `getLocalName() : String`

Returns the local name of the QName object.

### getUri

**Signature:** `getUri() : String`

Returns the Uniform Resource Identifier (URI) of the QName object.

### toString

**Signature:** `toString() : String`

Returns a string composed of the URI, and the local name for the QName object, separated by "::".

## Constructor Detail

## Method Detail

## Method Details

### getLocalName

**Signature:** `getLocalName() : String`

**Description:** Returns the local name of the QName object.

**Returns:**

the local name of the QName object.

---

### getUri

**Signature:** `getUri() : String`

**Description:** Returns the Uniform Resource Identifier (URI) of the QName object.

**Returns:**

the Uniform Resource Identifier (URI) of the QName object.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string composed of the URI, and the local name for the QName object, separated by "::". The format depends on the uri property of the QName object: If uri == "" toString returns localName else if uri == null toString returns *::localName else toString returns uri::localNam

**Returns:**

a string composed of the URI, and the local name for the QName object, separated by "::".

---
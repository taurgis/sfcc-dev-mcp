## Package: TopLevel

# Class Namespace

## Inheritance Hierarchy

- Object
  - Namespace

## Description

Namespace objects represent XML namespaces and provide an association between a namespace prefix and a Unique Resource Identifier (URI). The prefix is either the undefined value or a string value that may be used to reference the namespace within the lexical representation of an XML value. When an XML object containing a namespace with an undefined prefix is encoded as XML by the method toXMLString(), the implementation will automatically generate a prefix. The URI is a string value used to uniquely identify the namespace.

## Properties

### prefix

**Type:** String (Read Only)

The prefix of the Namespace object.

### uri

**Type:** String (Read Only)

The Uniform Resource Identifier (URI) of the Namespace object.

## Constructor Summary

Namespace() Constructs a simple namespace where the uri and prefix properties are set to an empty string.

Namespace(uriValue : Object) Constructs a Namespace object and assigns values to the uri and prefix properties based on the type of uriValue.

Namespace(prefixValue : Object, uriValue : Object) Constructs a Namespace object and assigns values to the uri and prefix properties.

## Method Summary

### getPrefix

**Signature:** `getPrefix() : String`

Returns the prefix of the Namespace object.

### getUri

**Signature:** `getUri() : String`

Returns the Uniform Resource Identifier (URI) of the Namespace object.

### toString

**Signature:** `toString() : String`

Returns a string representation of this Namespace object.

## Constructor Detail

## Method Detail

## Method Details

### getPrefix

**Signature:** `getPrefix() : String`

**Description:** Returns the prefix of the Namespace object.

**Returns:**

the prefix of the Namespace object.

---

### getUri

**Signature:** `getUri() : String`

**Description:** Returns the Uniform Resource Identifier (URI) of the Namespace object.

**Returns:**

the Uniform Resource Identifier (URI) of the Namespace object.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this Namespace object.

**Returns:**

a string representation of this Namespace object.

---
## Package: dw.io

# Class XMLIndentingStreamWriter

## Inheritance Hierarchy

- Object
  - dw.io.XMLStreamWriter
  - dw.io.XMLIndentingStreamWriter

## Description

A XMLIndentingStreamWriter writes the XML output formatted for good readability. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Properties

### indent

**Type:** String

The indent.

### newLine

**Type:** String

The string that is used for a new line character. The
 default is the normal new line character.

## Constructor Summary

XMLIndentingStreamWriter(writer : Writer) Constructs the writer for the specified writer.

## Method Summary

### getIndent

**Signature:** `getIndent() : String`

Returns the indent.

### getNewLine

**Signature:** `getNewLine() : String`

Returns the string that is used for a new line character.

### setIndent

**Signature:** `setIndent(indent : String) : void`

Specifies a string that will be used as identing characters.

### setNewLine

**Signature:** `setNewLine(newLine : String) : void`

Sets the string that is used for a new line character.

## Constructor Detail

## Method Detail

## Method Details

### getIndent

**Signature:** `getIndent() : String`

**Description:** Returns the indent.

**Returns:**

Returns the indent.

---

### getNewLine

**Signature:** `getNewLine() : String`

**Description:** Returns the string that is used for a new line character. The default is the normal new line character.

**Returns:**

the new line.

---

### setIndent

**Signature:** `setIndent(indent : String) : void`

**Description:** Specifies a string that will be used as identing characters. The default are two space characters.

**Parameters:**

- `indent`: The indent to set.

---

### setNewLine

**Signature:** `setNewLine(newLine : String) : void`

**Description:** Sets the string that is used for a new line character.

**Parameters:**

- `newLine`: The newLine to set.

---
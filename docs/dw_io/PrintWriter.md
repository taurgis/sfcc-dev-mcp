## Package: dw.io

# Class PrintWriter

## Inheritance Hierarchy

- Object
  - dw.io.Writer
  - dw.io.PrintWriter

## Description

Template output stream writer. Printwriter is available in the template scripting context and is used to write data into the template output stream. You cannot instantiate this class directly. Instead, the system assigns the object to variable named 'out' in the script context to be used by the template scripts. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Constructor Summary

## Method Summary

### print

**Signature:** `print(str : String) : void`

Prints the given string into the output stream.

### println

**Signature:** `println(str : String) : void`

Print the given string followed by a line break into the output stream.

### println

**Signature:** `println() : void`

Prints a line break into the output stream.

## Method Detail

## Method Details

### print

**Signature:** `print(str : String) : void`

**Description:** Prints the given string into the output stream.

**Parameters:**

- `str`: the String object

---

### println

**Signature:** `println(str : String) : void`

**Description:** Print the given string followed by a line break into the output stream.

**Parameters:**

- `str`: the String object

---

### println

**Signature:** `println() : void`

**Description:** Prints a line break into the output stream.

---
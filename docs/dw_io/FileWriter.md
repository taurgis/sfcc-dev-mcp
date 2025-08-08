## Package: dw.io

# Class FileWriter

## Inheritance Hierarchy

- Object
  - dw.io.Writer
  - dw.io.FileWriter

## Description

Convenience class for writing character files. Files are stored in a shared file system where multiple processes could access the same file. The client code is responsible for ensuring that no more than one process writes to a file at a given time. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Properties

### lineSeparator

**Type:** String

Get the current line separator (e.g. '\n' or '\r\n'), if no value is set the system default '\n' will be used.

## Constructor Summary

FileWriter(file : File) Constructs the writer for the specified file.

FileWriter(file : File, append : boolean) Constructs the writer for the specified file.

FileWriter(file : File, encoding : String) Constructs the writer for the specified file with the specified encoding.

FileWriter(file : File, encoding : String, append : boolean) Constructs the writer for the specified file with the specified encoding.

## Method Summary

### close

**Signature:** `close() : void`

Closes the writer.

### getLineSeparator

**Signature:** `getLineSeparator() : String`

Get the current line separator (e.g.

### setLineSeparator

**Signature:** `setLineSeparator(lineSeparator : String) : void`

Set the line separator (e.g.

### writeLine

**Signature:** `writeLine(str : String) : void`

Writes the specified line and appends the line separator.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the writer.

---

### getLineSeparator

**Signature:** `getLineSeparator() : String`

**Description:** Get the current line separator (e.g. '\n' or '\r\n'), if no value is set the system default '\n' will be used.

---

### setLineSeparator

**Signature:** `setLineSeparator(lineSeparator : String) : void`

**Description:** Set the line separator (e.g. '\n' or '\r\n'), if no value is set the system default '\n' will be used.

**Parameters:**

- `lineSeparator`: that will be written at the end of each line

---

### writeLine

**Signature:** `writeLine(str : String) : void`

**Description:** Writes the specified line and appends the line separator.

**Parameters:**

- `str`: the line to write to the file.

---
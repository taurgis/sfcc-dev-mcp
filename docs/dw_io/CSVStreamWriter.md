## Package: dw.io

# Class CSVStreamWriter

## Inheritance Hierarchy

- Object
  - dw.io.CSVStreamWriter

## Description

The class writes a CSV file. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Constructor Summary

CSVStreamWriter(writer : Writer) Create a new CSVStreamWriter with a ',' as separator and '"' as quote character.

CSVStreamWriter(writer : Writer, separator : String) Create a new CSVStreamWriter with the specified separator and '"' as quote character.

CSVStreamWriter(writer : Writer, separator : String, quote : String) Create a new CSVStreamWriter with the specified separator and the specified quote character.

## Method Summary

### close

**Signature:** `close() : void`

Closes the underlying writer.

### writeNext

**Signature:** `writeNext(line : String...) : void`

Write a single line to the CSV file.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the underlying writer.

---

### writeNext

**Signature:** `writeNext(line : String...) : void`

**Description:** Write a single line to the CSV file.

**Parameters:**

- `line`: an array of strings.

---
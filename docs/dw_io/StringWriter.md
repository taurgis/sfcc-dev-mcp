## Package: dw.io

# Class StringWriter

## Inheritance Hierarchy

- Object
  - dw.io.Writer
  - dw.io.StringWriter

## Description

A Writer that can be used to generate a String. In most cases it is not necessary to use StringWriter. If the final destination of the output is a file, use FileWriter directly. This will help to reduce memory usage. If you wish to transfer a feed to a remote FTP, SFTP or WebDAV server, first write the feed to the file system using FileWriter and optionally CSVStreamWriter or XMLStreamWriter, then upload the file with FTPClient.putBinary(String, File), SFTPClient.putBinary(String, File), or WebDAVClient.put(String, File). Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Constructor Summary

StringWriter() Creates a new StringWriter.

## Method Summary

### toString

**Signature:** `toString() : String`

Returns a string representation of this writer.

### write

**Signature:** `write(str : String) : void`

Write the given string to the stream.

### write

**Signature:** `write(str : String, off : Number, len : Number) : void`

Write the given string to the stream.

## Constructor Detail

## Method Detail

## Method Details

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this writer.

**Returns:**

a string representation of this writer.

---

### write

**Signature:** `write(str : String) : void`

**Description:** Write the given string to the stream.

**Parameters:**

- `str`: the string to write to the stream.

---

### write

**Signature:** `write(str : String, off : Number, len : Number) : void`

**Description:** Write the given string to the stream.

**Parameters:**

- `str`: the string to write to the stream.
- `off`: the offset from which to start writing characters to the stream.
- `len`: the number of characters to write from the stream.

---
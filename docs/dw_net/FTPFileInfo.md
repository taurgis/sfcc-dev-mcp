## Package: dw.net

# Class FTPFileInfo

## Inheritance Hierarchy

- Object
  - dw.net.FTPFileInfo

## Description

The class is used to store information about a remote file. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Properties

### directory

**Type:** boolean (Read Only)

Identifies if the file is a directory.

### name

**Type:** String (Read Only)

The name of the file.

### size

**Type:** Number (Read Only)

The size of the file.

### timestamp

**Type:** Date (Read Only)

The timestamp of the file.

## Constructor Summary

FTPFileInfo(name : String, size : Number, directory : boolean, timestamp : Date) Constructs the FTPFileInfo instance.

## Method Summary

### getDirectory

**Signature:** `getDirectory() : boolean`

Identifies if the file is a directory.

### getName

**Signature:** `getName() : String`

Returns the name of the file.

### getSize

**Signature:** `getSize() : Number`

Returns the size of the file.

### getTimestamp

**Signature:** `getTimestamp() : Date`

Returns the timestamp of the file.

## Constructor Detail

## Method Detail

## Method Details

### getDirectory

**Signature:** `getDirectory() : boolean`

**Description:** Identifies if the file is a directory.

**Returns:**

true if the file is a directory, false otherwise.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the file.

**Returns:**

the name of the file.

---

### getSize

**Signature:** `getSize() : Number`

**Description:** Returns the size of the file.

**Returns:**

the size of the file.

---

### getTimestamp

**Signature:** `getTimestamp() : Date`

**Description:** Returns the timestamp of the file.

**Returns:**

the timestamp of the file.

---
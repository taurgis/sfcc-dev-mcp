## Package: dw.net

# Class SFTPFileInfo

## Inheritance Hierarchy

- Object
  - dw.net.SFTPFileInfo

## Description

The class is used to store information about a remote file. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Properties

### directory

**Type:** boolean (Read Only)

Identifies if the file is a directory.

### modificationTime

**Type:** Date (Read Only)

The last modification time of the file/directory.

### name

**Type:** String (Read Only)

The name of the file/directory.

### size

**Type:** Number (Read Only)

The size of the file/directory.

## Constructor Summary

SFTPFileInfo(name : String, size : Number, directory : boolean, mtime : Number) Constructs the SFTPFileInfo instance.

## Method Summary

### getDirectory

**Signature:** `getDirectory() : boolean`

Identifies if the file is a directory.

### getModificationTime

**Signature:** `getModificationTime() : Date`

Returns the last modification time of the file/directory.

### getName

**Signature:** `getName() : String`

Returns the name of the file/directory.

### getSize

**Signature:** `getSize() : Number`

Returns the size of the file/directory.

## Constructor Detail

## Method Detail

## Method Details

### getDirectory

**Signature:** `getDirectory() : boolean`

**Description:** Identifies if the file is a directory.

**Returns:**

true if the file is a directory, false otherwise.

---

### getModificationTime

**Signature:** `getModificationTime() : Date`

**Description:** Returns the last modification time of the file/directory.

**Returns:**

the last modification time.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the file/directory.

**Returns:**

the name.

---

### getSize

**Signature:** `getSize() : Number`

**Description:** Returns the size of the file/directory.

**Returns:**

the size.

---
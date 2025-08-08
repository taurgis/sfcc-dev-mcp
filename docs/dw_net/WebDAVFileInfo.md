## Package: dw.net

# Class WebDAVFileInfo

## Inheritance Hierarchy

- Object
  - dw.net.WebDAVFileInfo

## Description

Simple class representing a file on a remote WebDAV location. The class possesses only read-only attributes of the file and does not permit any manipulation of the file itself. Instances of this class are returned by WebDAVClient.propfind(String) which is used to get a listing of files in a WebDAV directory. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk.

## Properties

### contentType

**Type:** String (Read Only)

The content type of the file.

### creationDate

**Type:** Date (Read Only)

The creationDate of the file.

### directory

**Type:** boolean (Read Only)

Identifies if the file is a directory.

### name

**Type:** String (Read Only)

The name of the file.

### path

**Type:** String (Read Only)

The path of the file.

### size

**Type:** Number (Read Only)

The size of the file.

## Constructor Summary

## Method Summary

### getContentType

**Signature:** `getContentType() : String`

Returns the content type of the file.

### getCreationDate

**Signature:** `getCreationDate() : Date`

Returns the creationDate of the file.

### getName

**Signature:** `getName() : String`

Returns the name of the file.

### getPath

**Signature:** `getPath() : String`

Returns the path of the file.

### getSize

**Signature:** `getSize() : Number`

Returns the size of the file.

### isDirectory

**Signature:** `isDirectory() : boolean`

Identifies if the file is a directory.

### lastModified

**Signature:** `lastModified() : Date`

Returns the lastModified date of the file.

## Method Detail

## Method Details

### getContentType

**Signature:** `getContentType() : String`

**Description:** Returns the content type of the file.

**Returns:**

the content type of the file.

---

### getCreationDate

**Signature:** `getCreationDate() : Date`

**Description:** Returns the creationDate of the file.

**Returns:**

the creationDate of the file.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the file.

**Returns:**

the name of the file.

---

### getPath

**Signature:** `getPath() : String`

**Description:** Returns the path of the file.

**Returns:**

the path of the file.

---

### getSize

**Signature:** `getSize() : Number`

**Description:** Returns the size of the file.

**Returns:**

the size of the file.

---

### isDirectory

**Signature:** `isDirectory() : boolean`

**Description:** Identifies if the file is a directory.

**Returns:**

true if the file is a directory, false otherwise.

---

### lastModified

**Signature:** `lastModified() : Date`

**Description:** Returns the lastModified date of the file.

**Returns:**

the lastModified date of the file.

---
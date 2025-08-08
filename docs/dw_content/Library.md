## Package: dw.content

# Class Library

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.content.Library

## Description

Class representing a collection of Content assets, and a Folder hierarchy organizing these content assets. Currently only one library is allowed per site. An instance of this library can be obtained by calling ContentMgr.getSiteLibrary().

## Properties

### CMSChannelID

**Type:** String (Read Only)

The CMS channel of the library.

### displayName

**Type:** String (Read Only)

The display name for the library as known in the current
 locale or null if it cannot be found.

### ID

**Type:** String (Read Only)

The ID of this library.

### root

**Type:** Folder (Read Only)

The root folder for this library.

## Constructor Summary

## Method Summary

### getCMSChannelID

**Signature:** `getCMSChannelID() : String`

Returns the CMS channel of the library.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name for the library as known in the current locale or null if it cannot be found.

### getID

**Signature:** `getID() : String`

Returns the ID of this library.

### getRoot

**Signature:** `getRoot() : Folder`

Returns the root folder for this library.

## Method Detail

## Method Details

### getCMSChannelID

**Signature:** `getCMSChannelID() : String`

**Description:** Returns the CMS channel of the library.

**Returns:**

the CMS channel of the library

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name for the library as known in the current locale or null if it cannot be found.

**Returns:**

the display name for the library as known in the current locale or null if it cannot be found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this library.

**Returns:**

the ID of this library.

---

### getRoot

**Signature:** `getRoot() : Folder`

**Description:** Returns the root folder for this library.

**Returns:**

the root Folder for this library.

---
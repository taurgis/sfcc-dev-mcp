## Package: dw.content

# Class ContentMgr

## Inheritance Hierarchy

- Object
  - dw.content.ContentMgr

## Description

Provides helper methods for getting content assets, library folders and the content library of the current site.

## Constants

## Properties

### siteLibrary

**Type:** Library (Read Only)

The content library of the current site.

## Constructor Summary

## Method Summary

### getContent

**Signature:** `static getContent(id : String) : Content`

Returns the content with the corresponding identifier within the current site's site library.

### getContent

**Signature:** `static getContent(library : Library, id : String) : Content`

Returns the content with the corresponding identifier within the specified library.

### getFolder

**Signature:** `static getFolder(id : String) : Folder`

Returns the folder identified by the specified id within the current site's site library.

### getFolder

**Signature:** `static getFolder(library : Library, id : String) : Folder`

Returns the folder identified by the specified id within the specified library.

### getLibrary

**Signature:** `static getLibrary(libraryId : String) : Library`

Returns the content library specified by the given id.

### getSiteLibrary

**Signature:** `static getSiteLibrary() : Library`

Returns the content library of the current site.

## Method Detail

## Method Details

### getContent

**Signature:** `static getContent(id : String) : Content`

**Description:** Returns the content with the corresponding identifier within the current site's site library.

**Parameters:**

- `id`: the ID of the content asset to find.

**Returns:**

the content if found, or null if not found.

---

### getContent

**Signature:** `static getContent(library : Library, id : String) : Content`

**Description:** Returns the content with the corresponding identifier within the specified library.

**Parameters:**

- `library`: the content library to look for the content in
- `id`: the ID of the content asset to find.

**Returns:**

the content if found, or null if not found.

---

### getFolder

**Signature:** `static getFolder(id : String) : Folder`

**Description:** Returns the folder identified by the specified id within the current site's site library.

**Parameters:**

- `id`: the ID of the folder to find.

**Returns:**

the folder, or null if not found.

---

### getFolder

**Signature:** `static getFolder(library : Library, id : String) : Folder`

**Description:** Returns the folder identified by the specified id within the specified library.

**Parameters:**

- `library`: the content library to look for the folder in
- `id`: the ID of the folder to find.

**Returns:**

the folder, or null if not found.

---

### getLibrary

**Signature:** `static getLibrary(libraryId : String) : Library`

**Description:** Returns the content library specified by the given id. If PRIVATE_LIBRARY is used, then the current site's private library will be returned.

**Parameters:**

- `libraryId`: the id of the library to return.

**Returns:**

the library for the passed id. Returns null if there is no content library with that id.

---

### getSiteLibrary

**Signature:** `static getSiteLibrary() : Library`

**Description:** Returns the content library of the current site.

**Returns:**

the content library of the current site, or null if there is not content library assigned to the current site.

---
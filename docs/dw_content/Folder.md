## Package: dw.content

# Class Folder

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.content.Folder

## Description

Class representing a folder for organizing content assets in Commerce Cloud Digital.

## Properties

### content

**Type:** Collection (Read Only)

The content objects for this folder, sorted by position.

### description

**Type:** String (Read Only)

The description for the folder as known in the current
 locale or null if it cannot be found.

### displayName

**Type:** String (Read Only)

The display name for the folder as known in the current
 locale or null if it cannot be found.

### ID

**Type:** String (Read Only)

The ID of the folder. The ID can be used to uniquely
 identify a folder within any given library. This folder ID provides
 an alternative lookup mechanism for folders frequently used in
 the storefront.

### online

**Type:** boolean (Read Only)

Indicates if the folder is set online or
 offline. Initially, all folders are set online.

### onlineContent

**Type:** Collection (Read Only)

The online content objects for this folder, sorted by position.

### onlineSubFolders

**Type:** Collection (Read Only)

The online subfolders of this folder, sorted by position.

### pageDescription

**Type:** String (Read Only)

The page description for this folder using the value in
 the current locale, or returns null if no value was found.

### pageKeywords

**Type:** String (Read Only)

The page keywords for this folder using the value in
 the current locale, or returns null if no value was found.

### pageTitle

**Type:** String (Read Only)

The page title for this folder using the value in
 the current locale, or returns null if no value was found.

### pageURL

**Type:** String (Read Only)

The page URL for this folder using the value in
 the current locale, or returns null if no value was found.

### parent

**Type:** Folder (Read Only)

The parent folder of this folder.

### root

**Type:** boolean (Read Only)

Indicates if this is the root folder.

### siteMapChangeFrequency

**Type:** String (Read Only)

The folder's sitemap change frequency.

### siteMapIncluded

**Type:** Number (Read Only)

The folder's sitemap inclusion.

### siteMapPriority

**Type:** Number (Read Only)

The folder's sitemap priority.

### subFolders

**Type:** Collection (Read Only)

The subfolders of this folder, sorted by position.

### template

**Type:** String (Read Only)

The name of the template used to render the folder
 in the store front.

## Constructor Summary

## Method Summary

### getContent

**Signature:** `getContent() : Collection`

Returns the content objects for this folder, sorted by position.

### getDescription

**Signature:** `getDescription() : String`

Returns the description for the folder as known in the current locale or null if it cannot be found.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name for the folder as known in the current locale or null if it cannot be found.

### getID

**Signature:** `getID() : String`

Returns the ID of the folder.

### getOnlineContent

**Signature:** `getOnlineContent() : Collection`

Returns the online content objects for this folder, sorted by position.

### getOnlineSubFolders

**Signature:** `getOnlineSubFolders() : Collection`

Returns the online subfolders of this folder, sorted by position.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns the page description for this folder using the value in the current locale, or returns null if no value was found.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the page keywords for this folder using the value in the current locale, or returns null if no value was found.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the page title for this folder using the value in the current locale, or returns null if no value was found.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the page URL for this folder using the value in the current locale, or returns null if no value was found.

### getParent

**Signature:** `getParent() : Folder`

Returns the parent folder of this folder.

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

Returns the folder's sitemap change frequency.

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

Returns the folder's sitemap inclusion.

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

Returns the folder's sitemap priority.

### getSubFolders

**Signature:** `getSubFolders() : Collection`

Returns the subfolders of this folder, sorted by position.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the name of the template used to render the folder in the store front.

### isOnline

**Signature:** `isOnline() : boolean`

Indicates if the folder is set online or offline.

### isRoot

**Signature:** `isRoot() : boolean`

Indicates if this is the root folder.

## Method Detail

## Method Details

### getContent

**Signature:** `getContent() : Collection`

**Description:** Returns the content objects for this folder, sorted by position.

**Returns:**

the content objects for this folder, sorted by position.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description for the folder as known in the current locale or null if it cannot be found.

**Returns:**

the description for the folder as known in the current locale or null if it cannot be found.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name for the folder as known in the current locale or null if it cannot be found.

**Returns:**

the display name for the folder as known in the current locale or null if it cannot be found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the folder. The ID can be used to uniquely identify a folder within any given library. This folder ID provides an alternative lookup mechanism for folders frequently used in the storefront.

**Returns:**

the ID of the folder.

---

### getOnlineContent

**Signature:** `getOnlineContent() : Collection`

**Description:** Returns the online content objects for this folder, sorted by position.

**Returns:**

the online content objects for this folder, sorted by position.

---

### getOnlineSubFolders

**Signature:** `getOnlineSubFolders() : Collection`

**Description:** Returns the online subfolders of this folder, sorted by position.

**Returns:**

the online subfolders of this folder, sorted by position.

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns the page description for this folder using the value in the current locale, or returns null if no value was found.

**Returns:**

the page description for this folder using the value in the current locale, or returns null if no value was found.

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the page keywords for this folder using the value in the current locale, or returns null if no value was found.

**Returns:**

the page keywords for this folder using the value in the current locale, or returns null if no value was found.

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the page title for this folder using the value in the current locale, or returns null if no value was found.

**Returns:**

the page title for this folder using the value in the current locale, or returns null if no value was found.

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the page URL for this folder using the value in the current locale, or returns null if no value was found.

**Returns:**

the page URL for this folder using the value in the current locale, or returns null if no value was found.

---

### getParent

**Signature:** `getParent() : Folder`

**Description:** Returns the parent folder of this folder.

**Returns:**

the parent folder of this folder.

---

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

**Description:** Returns the folder's sitemap change frequency.

**Returns:**

the value of the attribute 'siteMapChangeFrequency'.

---

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

**Description:** Returns the folder's sitemap inclusion.

**Returns:**

the value of the attribute 'siteMapIncluded'.

---

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

**Description:** Returns the folder's sitemap priority.

**Returns:**

the value of the attribute 'siteMapPriority'.

---

### getSubFolders

**Signature:** `getSubFolders() : Collection`

**Description:** Returns the subfolders of this folder, sorted by position.

**Returns:**

the subfolders of this folder, sorted by position.

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the name of the template used to render the folder in the store front.

**Returns:**

the name of the template used to render the folder.

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Indicates if the folder is set online or offline. Initially, all folders are set online.

**Returns:**

true if the folder is online, false otherwise.

---

### isRoot

**Signature:** `isRoot() : boolean`

**Description:** Indicates if this is the root folder.

**Returns:**

true if this is the root folder, false otherwise.

---
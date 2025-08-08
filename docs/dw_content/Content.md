## Package: dw.content

# Class Content

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.content.Content

## Description

Class representing a Content asset in Commerce Cloud Digital.

## Properties

### classificationFolder

**Type:** Folder (Read Only)

The Folder associated with this Content. The folder is
 used to determine the classification of the content.

### description

**Type:** String (Read Only)

The description in the current locale or null.

### folders

**Type:** Collection (Read Only)

All folders to which this content is assigned.

### ID

**Type:** String (Read Only)

The ID of the content asset.

### name

**Type:** String (Read Only)

The name of the content asset.

### online

**Type:** boolean (Read Only)

The online status of the content.

### onlineFlag

**Type:** boolean (Read Only)

The online status flag of the content.

### page

**Type:** Page (Read Only)

Returns if the content is a Page or not.

### pageDescription

**Type:** String (Read Only)

The page description for the content in the current locale
 or null if there is no page description.

### pageKeywords

**Type:** String (Read Only)

The page keywords for the content in the current locale
 or null if there is no page title.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags, defined for this instance for which content can be generated.

 The meta tag content is generated based on the content detail page meta tag context and rules.
 The rules are obtained from the current content or inherited from the default folder,
 up to the root folder.

### pageTitle

**Type:** String (Read Only)

The page title for the content in the current locale
 or null if there is no page title.

### pageURL

**Type:** String (Read Only)

The page URL for the content in the current locale
 or null if there is no page URL.

### searchable

**Type:** boolean (Read Only)

The search status of the content.

### searchableFlag

**Type:** boolean (Read Only)

The online status flag of the content.

### siteMapChangeFrequency

**Type:** String (Read Only)

The contents change frequency needed for the sitemap creation.

### siteMapIncluded

**Type:** Number (Read Only)

The status if the content is included into the sitemap.

### siteMapPriority

**Type:** Number (Read Only)

The contents priority needed for the sitemap creation.
 If no priority is defined, the method returns 0.0.

### template

**Type:** String (Read Only)

The value of attribute 'template'.

## Constructor Summary

## Method Summary

### getClassificationFolder

**Signature:** `getClassificationFolder() : Folder`

Returns the Folder associated with this Content.

### getDescription

**Signature:** `getDescription() : String`

Returns the description in the current locale or null.

### getFolders

**Signature:** `getFolders() : Collection`

Returns all folders to which this content is assigned.

### getID

**Signature:** `getID() : String`

Returns the ID of the content asset.

### getName

**Signature:** `getName() : String`

Returns the name of the content asset.

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

Returns the online status flag of the content.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns the page description for the content in the current locale or null if there is no page description.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the page keywords for the content in the current locale or null if there is no page title.

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

Returns the page meta tag for the specified id.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags, defined for this instance for which content can be generated.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the page title for the content in the current locale or null if there is no page title.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the page URL for the content in the current locale or null if there is no page URL.

### getSearchableFlag

**Signature:** `getSearchableFlag() : boolean`

Returns the online status flag of the content.

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

Returns the contents change frequency needed for the sitemap creation.

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

Returns the status if the content is included into the sitemap.

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

Returns the contents priority needed for the sitemap creation.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the value of attribute 'template'.

### isOnline

**Signature:** `isOnline() : boolean`

Returns the online status of the content.

### isPage

**Signature:** `isPage() : boolean`

Returns if the content is a Page or not.

### isSearchable

**Signature:** `isSearchable() : boolean`

Returns the search status of the content.

### toPage

**Signature:** `toPage() : Page`

Converts the content into the Page representation if isPage() yields true.

## Method Detail

## Method Details

### getClassificationFolder

**Signature:** `getClassificationFolder() : Folder`

**Description:** Returns the Folder associated with this Content. The folder is used to determine the classification of the content.

**Returns:**

the classification Folder.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description in the current locale or null.

**Returns:**

the description in the current locale or null.

---

### getFolders

**Signature:** `getFolders() : Collection`

**Description:** Returns all folders to which this content is assigned.

**Returns:**

Collection of Folder objects.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the content asset.

**Returns:**

the ID of the content asset.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the content asset.

**Returns:**

the name of the content asset.

---

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

**Description:** Returns the online status flag of the content.

**Returns:**

true if the content is online, false otherwise.

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns the page description for the content in the current locale or null if there is no page description.

**Returns:**

the page description for the content in the current locale or null if there is no page description.

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the page keywords for the content in the current locale or null if there is no page title.

**Returns:**

the page keywords for the content in the current locale or null if there is no page title.

---

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

**Description:** Returns the page meta tag for the specified id. The meta tag content is generated based on the content detail page meta tag context and rule. The rule is obtained from the current content or inherited from the default folder, up to the root folder. Null will be returned if the meta tag is undefined on the current instance, or if no rule can be found for the current context, or if the rule resolves to an empty string.

**Parameters:**

- `id`: the ID to get the page meta tag for

**Returns:**

page meta tag containing content generated based on rules

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags, defined for this instance for which content can be generated. The meta tag content is generated based on the content detail page meta tag context and rules. The rules are obtained from the current content or inherited from the default folder, up to the root folder.

**Returns:**

page meta tags defined for this instance, containing content generated based on rules

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the page title for the content in the current locale or null if there is no page title.

**Returns:**

the page title for the content in the current locale or null if there is no page title.

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the page URL for the content in the current locale or null if there is no page URL.

**Returns:**

the page URL for the content in the current locale or null if there is no page URL.

---

### getSearchableFlag

**Signature:** `getSearchableFlag() : boolean`

**Description:** Returns the online status flag of the content.

**Returns:**

true if the content is searchable, false otherwise.

---

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

**Description:** Returns the contents change frequency needed for the sitemap creation.

**Returns:**

The contents sitemap change frequency.

---

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

**Description:** Returns the status if the content is included into the sitemap.

**Returns:**

the value of the attribute 'siteMapIncluded'

---

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

**Description:** Returns the contents priority needed for the sitemap creation. If no priority is defined, the method returns 0.0.

**Returns:**

The contents sitemap priority.

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the value of attribute 'template'.

**Returns:**

the value of the attribute 'template'

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Returns the online status of the content.

**Returns:**

true if the content is online, false otherwise.

---

### isPage

**Signature:** `isPage() : boolean`

**Description:** Returns if the content is a Page or not.

**Returns:**

true if the content is a Page, false otherwise.

---

### isSearchable

**Signature:** `isSearchable() : boolean`

**Description:** Returns the search status of the content.

**Returns:**

true if the content is searchable, false otherwise.

---

### toPage

**Signature:** `toPage() : Page`

**Description:** Converts the content into the Page representation if isPage() yields true.

**Returns:**

the Page representation of the content if it is a page, null otherwise.

**See Also:**

PageMgr.getPage(String)

---
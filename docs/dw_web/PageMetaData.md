## Package: dw.web

# Class PageMetaData

## Inheritance Hierarchy

- Object
  - dw.web.PageMetaData

## Description

Contains meta data about the page. For each request an instance of this class will be placed in the pipeline dictionary under the key "CurrentPageMetaData". The information stored in CurrentPageMetaData can be referenced in templates and rendered in an HTML head section: for example: <head> <title>${pdict.CurrentPageMetaData.title}</title> <meta name="description" content="${pdict.CurrentPageMetaData.description}"/> . . . </head> To update the CurrentPageMetaData there is the pipelet UpdatePageMetaData provided.

## Properties

### description

**Type:** String

The page's description.

### keywords

**Type:** String

The page's key words.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags added to this container.

### title

**Type:** String

The page's title.

## Constructor Summary

## Method Summary

### addPageMetaTag

**Signature:** `addPageMetaTag(pageMetaTag : PageMetaTag) : void`

Adds a page meta tag to this container.

### addPageMetaTags

**Signature:** `addPageMetaTags(pageMetaTags : Array) : void`

Adds a page meta tags list to this container.

### getDescription

**Signature:** `getDescription() : String`

Returns the page's description.

### getKeywords

**Signature:** `getKeywords() : String`

Returns the page's key words.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags added to this container.

### getTitle

**Signature:** `getTitle() : String`

Returns the page's title.

### isPageMetaTagSet

**Signature:** `isPageMetaTagSet(id : String) : boolean`

Returns true if a page meta tag with the given ID is set, false otherwise.

### setDescription

**Signature:** `setDescription(description : String) : void`

Sets the page's description.

### setKeywords

**Signature:** `setKeywords(keywords : String) : void`

Sets the page's key words.

### setTitle

**Signature:** `setTitle(title : String) : void`

Sets the page's title.

## Method Detail

## Method Details

### addPageMetaTag

**Signature:** `addPageMetaTag(pageMetaTag : PageMetaTag) : void`

**Description:** Adds a page meta tag to this container.

**Parameters:**

- `pageMetaTag`: the page meta tag to be added

---

### addPageMetaTags

**Signature:** `addPageMetaTags(pageMetaTags : Array) : void`

**Description:** Adds a page meta tags list to this container.

**Parameters:**

- `pageMetaTags`: the page meta tags list to be added

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the page's description.

**Returns:**

the page's description.

---

### getKeywords

**Signature:** `getKeywords() : String`

**Description:** Returns the page's key words.

**Returns:**

the page's key words.

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags added to this container.

**Returns:**

page meta tags

---

### getTitle

**Signature:** `getTitle() : String`

**Description:** Returns the page's title.

**Returns:**

the page's title.

---

### isPageMetaTagSet

**Signature:** `isPageMetaTagSet(id : String) : boolean`

**Description:** Returns true if a page meta tag with the given ID is set, false otherwise.

**Parameters:**

- `id`: the ID to be check if a page meta tag is set

**Returns:**

true if a page meta tag with the given ID is set, false otherwise

---

### setDescription

**Signature:** `setDescription(description : String) : void`

**Description:** Sets the page's description.

**Parameters:**

- `description`: the page's description.

---

### setKeywords

**Signature:** `setKeywords(keywords : String) : void`

**Description:** Sets the page's key words.

**Parameters:**

- `keywords`: the page's key words.

---

### setTitle

**Signature:** `setTitle(title : String) : void`

**Description:** Sets the page's title.

**Parameters:**

- `title`: the page's title.

---
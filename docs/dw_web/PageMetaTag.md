## Package: dw.web

# Class PageMetaTag

## Inheritance Hierarchy

- Object
  - dw.web.PageMetaTag

## Description

Page meta tags are used in HTML documents to provide structured data about a web page. They are usually part of the head section. Common tags are for example robots, description or social tags like open graph (e.g. 'og:title'). Page meta tags can be obtained within: home page context Site detail page context Product Content listing page context ProductSearchModel ContentSearchModel and can be set at PageMetaData container object, which is always available in the pipeline dictionary and is used as transfer object to fill the head area with meaningful page meta tag elements.

## Properties

### content

**Type:** String (Read Only)

The page meta tag content.

### ID

**Type:** String (Read Only)

The page meta tag ID.

### name

**Type:** boolean (Read Only)

Returns true if the page meta tag type is name, false otherwise.

### property

**Type:** boolean (Read Only)

Returns true if the page meta tag type is property, false otherwise.

### title

**Type:** boolean (Read Only)

Returns true if the page meta tag type is title, false otherwise.

## Constructor Summary

## Method Summary

### getContent

**Signature:** `getContent() : String`

Returns the page meta tag content.

### getID

**Signature:** `getID() : String`

Returns the page meta tag ID.

### isName

**Signature:** `isName() : boolean`

Returns true if the page meta tag type is name, false otherwise.

### isProperty

**Signature:** `isProperty() : boolean`

Returns true if the page meta tag type is property, false otherwise.

### isTitle

**Signature:** `isTitle() : boolean`

Returns true if the page meta tag type is title, false otherwise.

## Method Detail

## Method Details

### getContent

**Signature:** `getContent() : String`

**Description:** Returns the page meta tag content.

**Returns:**

page meta tag content

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the page meta tag ID.

**Returns:**

page meta tag ID

---

### isName

**Signature:** `isName() : boolean`

**Description:** Returns true if the page meta tag type is name, false otherwise.

**Returns:**

true if the page meta tag type is name, false otherwise

---

### isProperty

**Signature:** `isProperty() : boolean`

**Description:** Returns true if the page meta tag type is property, false otherwise.

**Returns:**

true if the page meta tag type is property, false otherwise

---

### isTitle

**Signature:** `isTitle() : boolean`

**Description:** Returns true if the page meta tag type is title, false otherwise.

**Returns:**

true if the page meta tag type is title, false otherwise

---
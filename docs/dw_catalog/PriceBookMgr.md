## Package: dw.catalog

# Class PriceBookMgr

## Inheritance Hierarchy

- Object
  - dw.catalog.PriceBookMgr

## Description

Price book manager provides methods to access price books.

## Properties

### allPriceBooks

**Type:** Collection (Read Only)

All price books defined for the organization.

### applicablePriceBooks

**Type:** Collection

A collection of price books that are set in the user session.

### sitePriceBooks

**Type:** Collection (Read Only)

All price books assigned to the current site. 
 Please note that this doesn't include parent price books not assigned to the site, but considered by the price
 lookup.

## Constructor Summary

## Method Summary

### assignPriceBookToSite

**Signature:** `static assignPriceBookToSite(priceBook : PriceBook, siteId : String) : boolean`

Assign a price book to a site.

### getAllPriceBooks

**Signature:** `static getAllPriceBooks() : Collection`

Returns all price books defined for the organization.

### getApplicablePriceBooks

**Signature:** `static getApplicablePriceBooks() : Collection`

Returns a collection of price books that are set in the user session.

### getPriceBook

**Signature:** `static getPriceBook(priceBookID : String) : PriceBook`

Returns the price book of the current organization matching the specified ID.

### getSitePriceBooks

**Signature:** `static getSitePriceBooks() : Collection`

Returns all price books assigned to the current site.

### setApplicablePriceBooks

**Signature:** `static setApplicablePriceBooks(priceBooks : PriceBook...) : void`

Sets one or more price books to be considered by the product price lookup.

### unassignPriceBookFromAllSites

**Signature:** `static unassignPriceBookFromAllSites(priceBook : PriceBook) : boolean`

Unassign a price book from all sites.

### unassignPriceBookFromSite

**Signature:** `static unassignPriceBookFromSite(priceBook : PriceBook, siteId : String) : boolean`

Unassign a price book from a site.

## Method Detail

## Method Details

### assignPriceBookToSite

**Signature:** `static assignPriceBookToSite(priceBook : PriceBook, siteId : String) : boolean`

**Description:** Assign a price book to a site. This requires a transaction, see Transaction.wrap(Function)

**Parameters:**

- `priceBook`: price book to be assigned
- `siteId`: id of the site to be assigned to, such as 'SiteGenesis'. The site has to be a storefront site.

**Returns:**

true if price book is assigned to site. Throws an exception if price book doesn't exist or site doesn't exist or site is not a storefront site.

---

### getAllPriceBooks

**Signature:** `static getAllPriceBooks() : Collection`

**Description:** Returns all price books defined for the organization.

**Returns:**

All price books of the organization.

---

### getApplicablePriceBooks

**Signature:** `static getApplicablePriceBooks() : Collection`

**Description:** Returns a collection of price books that are set in the user session.

**Returns:**

Collection of applicable price books set in the session.

---

### getPriceBook

**Signature:** `static getPriceBook(priceBookID : String) : PriceBook`

**Description:** Returns the price book of the current organization matching the specified ID.

**Parameters:**

- `priceBookID`: The price book id.

**Returns:**

Price book or null of not found

---

### getSitePriceBooks

**Signature:** `static getSitePriceBooks() : Collection`

**Description:** Returns all price books assigned to the current site. Please note that this doesn't include parent price books not assigned to the site, but considered by the price lookup.

**Returns:**

All price books assigned to the current site.

---

### setApplicablePriceBooks

**Signature:** `static setApplicablePriceBooks(priceBooks : PriceBook...) : void`

**Description:** Sets one or more price books to be considered by the product price lookup. The information is stored in the user session. If no price book is set in the user session, all active and valid price books assigned to the site are used for the price lookup. If price books are set, only those price books are considered by the price lookup. Note that the system does not assure that a price book set by this API is assigned to the current site.

**Parameters:**

- `priceBooks`: The price books that are set in the session as applicable price books.

---

### unassignPriceBookFromAllSites

**Signature:** `static unassignPriceBookFromAllSites(priceBook : PriceBook) : boolean`

**Description:** Unassign a price book from all sites. This requires a transaction, see Transaction.wrap(Function)

**Parameters:**

- `priceBook`: price book to be unassigned

**Returns:**

true if price book is unassigned from all sites. Throws an exception if price book doesn't exist

---

### unassignPriceBookFromSite

**Signature:** `static unassignPriceBookFromSite(priceBook : PriceBook, siteId : String) : boolean`

**Description:** Unassign a price book from a site. This requires a transaction, see Transaction.wrap(Function)

**Parameters:**

- `priceBook`: price book to be unassigned
- `siteId`: id of the site to be unassigned from, such as 'SiteGenesis'. The site has to be a storefront site.

**Returns:**

true if price book is unassigned from site. Throws an exception if price book doesn't exist or site doesn't exist or site is not a storefront site.

---
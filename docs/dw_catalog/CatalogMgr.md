## Package: dw.catalog

# Class CatalogMgr

## Inheritance Hierarchy

- Object
  - dw.catalog.CatalogMgr

## Description

Provides helper methods for getting categories.

## Properties

### siteCatalog

**Type:** Catalog (Read Only)

The catalog of the current site or null if no catalog is assigned to the site.

### sortingOptions

**Type:** List (Read Only)

A list containing the sorting options configured for this site.

### sortingRules

**Type:** Collection (Read Only)

A collection containing all of the sorting rules for this site, including global sorting rules.

## Constructor Summary

## Method Summary

### getCatalog

**Signature:** `static getCatalog(id : String) : Catalog`

Returns the catalog identified by the specified catalog id.

### getCategory

**Signature:** `static getCategory(id : String) : Category`

Returns the category of the site catalog identified by the specified category id.

### getSiteCatalog

**Signature:** `static getSiteCatalog() : Catalog`

Returns the catalog of the current site or null if no catalog is assigned to the site.

### getSortingOption

**Signature:** `static getSortingOption(id : String) : SortingOption`

Returns the sorting option with the given ID for this site, or null if there is no such option.

### getSortingOptions

**Signature:** `static getSortingOptions() : List`

Returns a list containing the sorting options configured for this site.

### getSortingRule

**Signature:** `static getSortingRule(id : String) : SortingRule`

Returns the sorting rule with the given ID for this site, or null if there is no such rule.

### getSortingRules

**Signature:** `static getSortingRules() : Collection`

Returns a collection containing all of the sorting rules for this site, including global sorting rules.

## Method Detail

## Method Details

### getCatalog

**Signature:** `static getCatalog(id : String) : Catalog`

**Description:** Returns the catalog identified by the specified catalog id. Returns null if no catalog with the specified id exists in the current organization context.

**Parameters:**

- `id`: Catalog id

**Returns:**

the catalog or null.

---

### getCategory

**Signature:** `static getCategory(id : String) : Category`

**Description:** Returns the category of the site catalog identified by the specified category id. Returns null if no site catalog is defined, or no category with the specified id is found in the site catalog.

**Parameters:**

- `id`: the category identifier.

**Returns:**

the category of the site catalog identified by the specified category id or null if no site catalog is found.

---

### getSiteCatalog

**Signature:** `static getSiteCatalog() : Catalog`

**Description:** Returns the catalog of the current site or null if no catalog is assigned to the site.

**Returns:**

the catalog of the current site or null.

---

### getSortingOption

**Signature:** `static getSortingOption(id : String) : SortingOption`

**Description:** Returns the sorting option with the given ID for this site, or null if there is no such option.

**Parameters:**

- `id`: the ID of the sorting option

**Returns:**

a SortingOption or null.

---

### getSortingOptions

**Signature:** `static getSortingOptions() : List`

**Description:** Returns a list containing the sorting options configured for this site.

**Returns:**

a list of SortingOption objects

---

### getSortingRule

**Signature:** `static getSortingRule(id : String) : SortingRule`

**Description:** Returns the sorting rule with the given ID for this site, or null if there is no such rule.

**Parameters:**

- `id`: the ID of the sorting rule

**Returns:**

a SortingRule or null.

---

### getSortingRules

**Signature:** `static getSortingRules() : Collection`

**Description:** Returns a collection containing all of the sorting rules for this site, including global sorting rules.

**Returns:**

a collection of SortingRule objects

---
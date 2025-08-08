## Package: dw.catalog

# Class Catalog

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Catalog

## Description

Represents a Commerce Cloud Digital Catalog. Catalogs are containers of products and other product-related information and can be shared between sites. Every product in the system is contained in (or "owned by") exactly one catalog. Every site has a single "site catalog" which defines the products that are available to purchase on that site. The static method CatalogMgr.getSiteCatalog() returns the site catalog for the current site. Catalogs are organized into a tree of categories with a single top-level root category. Products are assigned to categories within catalogs. They can be assigned to categories in their owning catalog, or other catalogs. They can be assigned to multiple categories within the same catalog. Products that are not assigned to any categories are considered "uncategorized." A product has a single "classification category" in some catalog, and one "primary category" per catalog. The classification category defines the attribute set of the product. The primary category is used as standard presentation context within that catalog in the storefront. While Commerce Cloud Digital does not currently distinguish different catalog types, it is common practice to have two general types of catalog: "Product catalogs" typically contain detailed product information and are frequently generated from some backend PIM system. "Site Catalogs" define the category structure of the storefront and contain primarily the assignments of these categories to the products defined in the product catalogs. The site catalog is assigned to the site. In addition to products and categories, catalogs contain recommendations, shared variation attributes which can be used by multiple master products, and shared product options which can be used by multiple option products.

## Properties

### description

**Type:** String (Read Only)

The value of the localized extensible object attribute
 "shortDescription" for the current locale.

### displayName

**Type:** String (Read Only)

The value of the localized extensible object attribute
 "displayName" for the current locale.

### ID

**Type:** String (Read Only)

The value of attribute 'id'.

### root

**Type:** Category (Read Only)

The object for the relation 'root'.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns the value of the localized extensible object attribute "shortDescription" for the current locale.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the value of the localized extensible object attribute "displayName" for the current locale.

### getID

**Signature:** `getID() : String`

Returns the value of attribute 'id'.

### getRoot

**Signature:** `getRoot() : Category`

Returns the object for the relation 'root'.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the value of the localized extensible object attribute "shortDescription" for the current locale.

**Returns:**

The value of the attribute for the current locale, or null if it wasn't found.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the value of the localized extensible object attribute "displayName" for the current locale.

**Returns:**

The value of the attribute for the current locale, or null if it wasn't found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the value of attribute 'id'.

**Returns:**

the value of the attribute 'id'

---

### getRoot

**Signature:** `getRoot() : Category`

**Description:** Returns the object for the relation 'root'.

**Returns:**

the object for the relation 'root'.

---
## Package: dw.catalog

# Class ProductMgr

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductMgr

## Description

Provides helper methods for getting products based on Product ID or Catalog.

## Constructor Summary

## Method Summary

### getProduct

**Signature:** `static getProduct(productID : String) : Product`

Returns the product with the specified id.

### queryAllSiteProducts

**Signature:** `static queryAllSiteProducts() : SeekableIterator`

Returns all products assigned to the current site.

### queryAllSiteProductsSorted

**Signature:** `static queryAllSiteProductsSorted() : SeekableIterator`

Returns all products assigned to the current site.

### queryProductsInCatalog

**Signature:** `static queryProductsInCatalog(catalog : Catalog) : SeekableIterator`

Returns all products assigned to the the specified catalog, where assignment has the same meaning as it does for queryAllSiteProducts().

### queryProductsInCatalogSorted

**Signature:** `static queryProductsInCatalogSorted(catalog : Catalog) : SeekableIterator`

Returns all products assigned to the the specified catalog.

## Method Detail

## Method Details

### getProduct

**Signature:** `static getProduct(productID : String) : Product`

**Description:** Returns the product with the specified id.

**Parameters:**

- `productID`: the product identifier.

**Returns:**

Product for specified id or null

---

### queryAllSiteProducts

**Signature:** `static queryAllSiteProducts() : SeekableIterator`

**Description:** Returns all products assigned to the current site. A product is assigned to a site if it is assigned to at least one category of the site catalog or it is a variant and it's master product is assigned to the current site It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Returns:**

Iterator of all site products

**See Also:**

SeekableIterator.close()

---

### queryAllSiteProductsSorted

**Signature:** `static queryAllSiteProductsSorted() : SeekableIterator`

**Description:** Returns all products assigned to the current site. Works like queryAllSiteProducts(), but additionally sorts the result set by product ID. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Returns:**

Iterator of all site products sorted by product ID.

**See Also:**

SeekableIterator.close()

---

### queryProductsInCatalog

**Signature:** `static queryProductsInCatalog(catalog : Catalog) : SeekableIterator`

**Description:** Returns all products assigned to the the specified catalog, where assignment has the same meaning as it does for queryAllSiteProducts(). It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `catalog`: The catalog whose assigned products should be returned.

**Returns:**

Iterator of all products assigned to specified catalog.

**See Also:**

SeekableIterator.close()

---

### queryProductsInCatalogSorted

**Signature:** `static queryProductsInCatalogSorted(catalog : Catalog) : SeekableIterator`

**Description:** Returns all products assigned to the the specified catalog. Works like queryProductsInCatalog(), but additionally sorts the result set by product ID. It is strongly recommended to call close() on the returned SeekableIterator if not all of its elements are being retrieved. This will ensure the proper cleanup of system resources.

**Parameters:**

- `catalog`: The catalog whose assigned products should be returned.

**Returns:**

Iterator of all products assigned to specified catalog sorted by product ID.

**See Also:**

SeekableIterator.close()

---
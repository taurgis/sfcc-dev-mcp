## Package: dw.catalog

# Class ProductSearchHit

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductSearchHit

## Description

ProductSearchHit is the result of a executed search query and wraps the actual product found by the search. The method getRepresentedProducts() returns the actual products that is conforming the query and is represented by the search hit. Depending on the hit typ, getRepresentedProducts() returns: HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation product HIT_TYPE_PRODUCT_SET -> a product part of set HIT_TYPE_PRODUCT_BUNDLE -> a product part of a bundle HIT_TYPE_VARIATION_GROUP -> a variation product The ProductSearchHit type can be retrieved by method getHitType() and contains the following types: HIT_TYPE_SIMPLE HIT_TYPE_PRODUCT_MASTER HIT_TYPE_PRODUCT_SET HIT_TYPE_PRODUCT_BUNDLE HIT_TYPE_VARIATION_GROUP The method getProduct() returns the presentation product corresponding to the ProductSearchHit type. HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation master product HIT_TYPE_PRODUCT_SET -> a product set HIT_TYPE_PRODUCT_BUNDLE -> a product bundle HIT_TYPE_VARIATION_GROUP ->a variation group Example: Given a product master P1 called "Sweater" with attributes color and size that has the following variants: V1 - color: red, size: small V2 - color: red, size: large V3 - color: blue, size: small V4 - color: blue, size: large V5 - color: yellow, size: small V6 - color: yellow, size: large A search for "red sweater" should hit the first two variants, V1 and V2 that are both red. The ProductSearchHit for this result encompass the master and the red variants but not the other non-relevant variants. The variants hit by the query can be retrieved by getRepresentedProducts(), returning a list that contains the two red sweater variants. The master product "Sweater" is returned by getProduct(). Furthermore, to get the first or last of that list of variants hit by the query we can call getFirstRepresentedProduct() or getLastRepresentedProduct(). The product with the highest sort rank is returned first, and the product with the lowest sort rank is returned last. The product sort rank depends on the sorting conditions used for the search query.

## Constants

### HIT_TYPE_PRODUCT_BUNDLE

**Type:** String = "bundle"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with product bundles.

### HIT_TYPE_PRODUCT_MASTER

**Type:** String = "master"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with master products.

### HIT_TYPE_PRODUCT_SET

**Type:** String = "set"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with product sets.

### HIT_TYPE_SIMPLE

**Type:** String = "product"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with single, non-complex products, including product variants that are assigned to a category and are returned as the presentation product.

### HIT_TYPE_SLICING_GROUP

**Type:** String = "slicing_group"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with slicing groups.

### HIT_TYPE_VARIATION_GROUP

**Type:** String = "variation_group"

Constant representing a product search hit type based on the presentation product of a hit. This hit type is used with variation groups.

## Properties

### allPromotionIDs

**Type:** List (Read Only)

Return the IDs of all searchable promotions for which at least one of the represented products of this search hit
 relates to the promotion, either as qualifying, discount, or bonus product. This may be used as a better
 performing alternative to PromotionPlan.getProductPromotions(Product) in some special cases.
 However be warned: this method has no additional checks and currently returns all id's which are known at
 indexing time. Custom code should generally filter and sort the promotions returned by this method according to
 PromotionMgr.getActiveCustomerPromotions() before messaging the promotions on a product tile.

### bonusPromotionIDs

**Type:** List (Read Only)

Return the IDs of all searchable promotions for which at least one of the represented products of this search hit
 is a bonus product. This may be used as a better performing alternative to
 PromotionPlan.getProductPromotions(Product) in some special cases. However be warned: this
 method has no additional checks and currently returns all id's which are known at indexing time. Custom code
 should generally filter and sort the promotions returned by this method according to
 PromotionMgr.getActiveCustomerPromotions() before messaging the promotions on a product tile.

### discountedPromotionIDs

**Type:** List (Read Only)

Return the IDs of all searchable promotions for which at least one of the represented products of this search hit
 satisfy the discounted product rule. This may be used as a better performing alternative to
 PromotionPlan.getProductPromotionsForDiscountedProduct(Product) in some special cases.
 However be warned: this method has no additional checks and currently returns all id's which are known at
 indexing time. Custom code should generally filter and sort the promotions returned by this method according to
 PromotionMgr.getActiveCustomerPromotions() before messaging the promotions on a product tile.

### firstRepresentedProduct

**Type:** Product (Read Only)

The product that is actually hit by the search and has the highest
 sort rank according to the sorting conditions used for the search query.

### firstRepresentedProductID

**Type:** String (Read Only)

The ID of the product that is actually hit by the search and has the highest
 sort rank according to the sorting conditions used for the search query.

### hitType

**Type:** String (Read Only)

The type of the product wrapped by this search hit. The product type returned will be one of the hit types: 
 
  HIT_TYPE_SIMPLE
  HIT_TYPE_PRODUCT_MASTER
  HIT_TYPE_PRODUCT_BUNDLE
  HIT_TYPE_PRODUCT_SET
  HIT_TYPE_SLICING_GROUP
  HIT_TYPE_VARIATION_GROUP

### lastRepresentedProduct

**Type:** Product (Read Only)

The product that is actually hit by the search and has the lowest
 sort rank according to the sorting conditions used for the search query.

### lastRepresentedProductID

**Type:** String (Read Only)

The ID of the product that is actually hit by the search and has the lowest
 sort rank according to the sorting conditions used for the search query.

### maxPrice

**Type:** Money (Read Only)

The maximum price of all products represented by the
 product hit. See getRepresentedProducts() for details on
 the set of products used for finding the maximum. The method returns
 N/A in case no price information can be found.
 
 Note: The method uses price information of the search index and therefore
 might return different prices than the ProductPriceModel.

### maxPricePerUnit

**Type:** Money (Read Only)

The maximum price per unit of all products represented by the
 product hit. See getRepresentedProducts() for details on
 the set of products used for finding the maximum. The method returns
 N/A in case no price information can be found.
 
 Note: The method uses price information of the search index and therefore
 might return different prices than the ProductPriceModel.

### minPrice

**Type:** Money (Read Only)

The minimum price of all products represented by the
 product hit. See getRepresentedProducts() for details on
 the set of products used for finding the minimum. The method returns
 N/A in case no price information can be found.
 
 Note: the method uses price information of the search index and therefore
 might return different prices than the ProductPriceModel.

### minPricePerUnit

**Type:** Money (Read Only)

The minimum price per unit of all products represented by the
 product hit. See getRepresentedProducts() for details on
 the set of products used for finding the minimum. The method returns
 N/A in case no price information can be found.
 
 Note: the method uses price information of the search index and therefore
 might return different prices than the ProductPriceModel.

### priceRange

**Type:** getRepresentedProducts() (Read Only)

Convenience method to check whether this ProductSearchHit represents
 multiple products (see getRepresentedProducts()) that have
 different prices.

### product

**Type:** Product (Read Only)

The presentation product of this ProductSearchHit corresponding to the ProductSearchHit type.
 
      HIT_TYPE_SIMPLE -> a simple product 
      HIT_TYPE_PRODUCT_MASTER -> a variation master product
      HIT_TYPE_PRODUCT_SET -> a product set
      HIT_TYPE_PRODUCT_BUNDLE -> a product bundle
      HIT_TYPE_VARIATION_GROUP ->a variation group
 

 To retrieve the product(s) actually hit by the search use getRepresentedProducts().

### productID

**Type:** String (Read Only)

The ID of the presentation product of this ProductSearchHit corresponding to the ProductSearchHit type.
 
      HIT_TYPE_SIMPLE -> a simple product 
      HIT_TYPE_PRODUCT_MASTER -> a variation master product
      HIT_TYPE_PRODUCT_SET -> a product set
      HIT_TYPE_PRODUCT_BUNDLE -> a product bundle
      HIT_TYPE_VARIATION_GROUP ->a variation group
 

 To retrieve the ID of the product actually hit by the search use getFirstRepresentedProductID() or getLastRepresentedProductID().

### qualifyingPromotionIDs

**Type:** List (Read Only)

Return the IDs of all searchable promotions for which at least one of the represented products of this search hit
 satisfies the qualifying product rule. This may be used as a better performing alternative to
 PromotionPlan.getProductPromotionsForQualifyingProduct(Product) in some special cases.
 However be warned: this method has no additional checks and currently returns all id's which are known at
 indexing time. Custom code should generally filter and sort the promotions returned by this method according to
 PromotionMgr.getActiveCustomerPromotions() before messaging the promotions on a product tile.

### representedProductIDs

**Type:** List (Read Only)

The method returns the actual ID of the product that is conforming the query and is represented by the search hit.
 Depending on the hit typ, it returns the ID of:
  
      HIT_TYPE_SIMPLE -> a simple product 
      HIT_TYPE_PRODUCT_MASTER -> a variation product
      HIT_TYPE_PRODUCT_SET -> a product part of set
      HIT_TYPE_PRODUCT_BUNDLE -> a product part of a bundle
      HIT_TYPE_VARIATION_GROUP ->a variation product
 

 If the method returns multiple products, the product with the highest
 sort rank is returned first, and the product with the lowest sort rank is
 returned last. The product sort rank depends on the sorting conditions
 used for the search query.

### representedProducts

**Type:** List (Read Only)

The method returns the actual product that is conforming the query and is represented by the search hit.
 Depending on the hit typ, getRepresentedProducts() returns:
  
      HIT_TYPE_SIMPLE -> a simple product 
      HIT_TYPE_PRODUCT_MASTER -> a variation product
      HIT_TYPE_PRODUCT_SET -> a product part of set
      HIT_TYPE_PRODUCT_BUNDLE -> a product part of a bundle
      HIT_TYPE_VARIATION_GROUP ->a variation product
 

 If the method returns multiple products, the product with the highest
 sort rank is returned first, and the product with the lowest sort rank is
 returned last. The product sort rank depends on the sorting conditions
 used for the search query.

## Constructor Summary

## Method Summary

### getFirstRepresentedProduct

**Signature:** `getFirstRepresentedProduct() : Product`

Returns the product that is actually hit by the search and has the highest sort rank according to the sorting conditions used for the search query.

### getFirstRepresentedProductID

**Signature:** `getFirstRepresentedProductID() : String`

Returns the ID of the product that is actually hit by the search and has the highest sort rank according to the sorting conditions used for the search query.

### getHitType

**Signature:** `getHitType() : String`

Returns the type of the product wrapped by this search hit.

### getLastRepresentedProduct

**Signature:** `getLastRepresentedProduct() : Product`

Returns the product that is actually hit by the search and has the lowest sort rank according to the sorting conditions used for the search query.

### getLastRepresentedProductID

**Signature:** `getLastRepresentedProductID() : String`

Returns the ID of the product that is actually hit by the search and has the lowest sort rank according to the sorting conditions used for the search query.

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

Returns the maximum price of all products represented by the product hit.

### getMaxPricePerUnit

**Signature:** `getMaxPricePerUnit() : Money`

Returns the maximum price per unit of all products represented by the product hit.

### getMinPrice

**Signature:** `getMinPrice() : Money`

Returns the minimum price of all products represented by the product hit.

### getMinPricePerUnit

**Signature:** `getMinPricePerUnit() : Money`

Returns the minimum price per unit of all products represented by the product hit.

### getProduct

**Signature:** `getProduct() : Product`

Returns the presentation product of this ProductSearchHit corresponding to the ProductSearchHit type.

### getProductID

**Signature:** `getProductID() : String`

Returns the ID of the presentation product of this ProductSearchHit corresponding to the ProductSearchHit type.

### getRepresentedProductIDs

**Signature:** `getRepresentedProductIDs() : List`

The method returns the actual ID of the product that is conforming the query and is represented by the search hit.

### getRepresentedProducts

**Signature:** `getRepresentedProducts() : List`

The method returns the actual product that is conforming the query and is represented by the search hit.

### getRepresentedVariationValues

**Signature:** `getRepresentedVariationValues(va : Object) : List`

This method is only applicable if this ProductSearchHit represents a product variation (see getRepresentedProducts()).

### isPriceRange

**Signature:** `isPriceRange() : boolean`

Convenience method to check whether this ProductSearchHit represents multiple products (see getRepresentedProducts()) that have different prices.

## Method Detail

## Method Details

### getFirstRepresentedProduct

**Signature:** `getFirstRepresentedProduct() : Product`

**Description:** Returns the product that is actually hit by the search and has the highest sort rank according to the sorting conditions used for the search query.

**Returns:**

the first product that is actually hit by the search

**See Also:**

getRepresentedProducts()
getLastRepresentedProduct()

---

### getFirstRepresentedProductID

**Signature:** `getFirstRepresentedProductID() : String`

**Description:** Returns the ID of the product that is actually hit by the search and has the highest sort rank according to the sorting conditions used for the search query.

**Returns:**

the ID of the first product that is actually hit by the search

**See Also:**

getRepresentedProducts()
getLastRepresentedProduct()

---

### getHitType

**Signature:** `getHitType() : String`

**Description:** Returns the type of the product wrapped by this search hit. The product type returned will be one of the hit types: HIT_TYPE_SIMPLE HIT_TYPE_PRODUCT_MASTER HIT_TYPE_PRODUCT_BUNDLE HIT_TYPE_PRODUCT_SET HIT_TYPE_SLICING_GROUP HIT_TYPE_VARIATION_GROUP

**Returns:**

search hit type

---

### getLastRepresentedProduct

**Signature:** `getLastRepresentedProduct() : Product`

**Description:** Returns the product that is actually hit by the search and has the lowest sort rank according to the sorting conditions used for the search query.

**Returns:**

the last product that is actually hit by the search

**See Also:**

getRepresentedProducts()
getLastRepresentedProduct()

---

### getLastRepresentedProductID

**Signature:** `getLastRepresentedProductID() : String`

**Description:** Returns the ID of the product that is actually hit by the search and has the lowest sort rank according to the sorting conditions used for the search query.

**Returns:**

the ID of the last product that is actually hit by the search

**See Also:**

getRepresentedProducts()
getLastRepresentedProduct()

---

### getMaxPrice

**Signature:** `getMaxPrice() : Money`

**Description:** Returns the maximum price of all products represented by the product hit. See getRepresentedProducts() for details on the set of products used for finding the maximum. The method returns N/A in case no price information can be found. Note: The method uses price information of the search index and therefore might return different prices than the ProductPriceModel.

**Returns:**

the maximum price of all products represented by the product hit.

---

### getMaxPricePerUnit

**Signature:** `getMaxPricePerUnit() : Money`

**Description:** Returns the maximum price per unit of all products represented by the product hit. See getRepresentedProducts() for details on the set of products used for finding the maximum. The method returns N/A in case no price information can be found. Note: The method uses price information of the search index and therefore might return different prices than the ProductPriceModel.

**Returns:**

the maximum price per unit of all products represented by the product hit.

---

### getMinPrice

**Signature:** `getMinPrice() : Money`

**Description:** Returns the minimum price of all products represented by the product hit. See getRepresentedProducts() for details on the set of products used for finding the minimum. The method returns N/A in case no price information can be found. Note: the method uses price information of the search index and therefore might return different prices than the ProductPriceModel.

**Returns:**

the minimum price of all products represented by the product hit.

---

### getMinPricePerUnit

**Signature:** `getMinPricePerUnit() : Money`

**Description:** Returns the minimum price per unit of all products represented by the product hit. See getRepresentedProducts() for details on the set of products used for finding the minimum. The method returns N/A in case no price information can be found. Note: the method uses price information of the search index and therefore might return different prices than the ProductPriceModel.

**Returns:**

the minimum price per unit of all products represented by the product hit.

---

### getProduct

**Signature:** `getProduct() : Product`

**Description:** Returns the presentation product of this ProductSearchHit corresponding to the ProductSearchHit type. HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation master product HIT_TYPE_PRODUCT_SET -> a product set HIT_TYPE_PRODUCT_BUNDLE -> a product bundle HIT_TYPE_VARIATION_GROUP ->a variation group To retrieve the product(s) actually hit by the search use getRepresentedProducts().

**Returns:**

the presentation product of this ProductSearchHit, which is possibly a representative of other related products actually hit by the search.

**See Also:**

getRepresentedProducts()

---

### getProductID

**Signature:** `getProductID() : String`

**Description:** Returns the ID of the presentation product of this ProductSearchHit corresponding to the ProductSearchHit type. HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation master product HIT_TYPE_PRODUCT_SET -> a product set HIT_TYPE_PRODUCT_BUNDLE -> a product bundle HIT_TYPE_VARIATION_GROUP ->a variation group To retrieve the ID of the product actually hit by the search use getFirstRepresentedProductID() or getLastRepresentedProductID().

**Returns:**

the ID of the presentation product of this ProductSearchHit, that possibly represents a set of related products actually hit by the search.

**See Also:**

getRepresentedProducts()

---

### getRepresentedProductIDs

**Signature:** `getRepresentedProductIDs() : List`

**Description:** The method returns the actual ID of the product that is conforming the query and is represented by the search hit. Depending on the hit typ, it returns the ID of: HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation product HIT_TYPE_PRODUCT_SET -> a product part of set HIT_TYPE_PRODUCT_BUNDLE -> a product part of a bundle HIT_TYPE_VARIATION_GROUP ->a variation product If the method returns multiple products, the product with the highest sort rank is returned first, and the product with the lowest sort rank is returned last. The product sort rank depends on the sorting conditions used for the search query.

**Returns:**

a sorted list of products represented by the wrapped product.

**See Also:**

getFirstRepresentedProduct()
getLastRepresentedProduct()

---

### getRepresentedProducts

**Signature:** `getRepresentedProducts() : List`

**Description:** The method returns the actual product that is conforming the query and is represented by the search hit. Depending on the hit typ, getRepresentedProducts() returns: HIT_TYPE_SIMPLE -> a simple product HIT_TYPE_PRODUCT_MASTER -> a variation product HIT_TYPE_PRODUCT_SET -> a product part of set HIT_TYPE_PRODUCT_BUNDLE -> a product part of a bundle HIT_TYPE_VARIATION_GROUP ->a variation product If the method returns multiple products, the product with the highest sort rank is returned first, and the product with the lowest sort rank is returned last. The product sort rank depends on the sorting conditions used for the search query.

**Returns:**

a sorted list of products represented by the wrapped product.

**See Also:**

getFirstRepresentedProduct()
getLastRepresentedProduct()

---

### getRepresentedVariationValues

**Signature:** `getRepresentedVariationValues(va : Object) : List`

**Description:** This method is only applicable if this ProductSearchHit represents a product variation (see getRepresentedProducts()). It returns the distinct value set for the specified variation attribute for all variants represented by this ProductSearchHit. The values are returned in the same order as they are defined for the variation. This method will accept a ProductVariationAttribute parameter or a String which is the ID of a variation attribute. If any other object type is passed, or null is passed, an exception will be thrown. If this ProductSearchHit does not represent a product variation, or the passed variation attribute is not associated with this product, the method returns an empty list.

**Parameters:**

- `va`: the product variation attribute, specified as either a ProductVariationAttribute or a String which is the ID of a variation attribute associated with this product.

**Returns:**

a list containing all distinct ProductVariationAttributeValues.

---

### isPriceRange

**Signature:** `isPriceRange() : boolean`

**Description:** Convenience method to check whether this ProductSearchHit represents multiple products (see getRepresentedProducts()) that have different prices.

**Returns:**

true if the represented products form a price range false otherwise.

---
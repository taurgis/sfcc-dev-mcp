## Package: dw.catalog

# Class ProductSearchModel

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchModel
  - dw.catalog.ProductSearchModel

## Description

The class is the central interface to a product search result and a product search refinement. It also provides utility methods to generate a search URL.

## Constants

### CATEGORYID_PARAMETER

**Type:** String = "cgid"

URL Parameter for the category ID

### INVENTORY_LIST_IDS_PARAMETER

**Type:** String = "ilids"

URL Parameter for the inventory list IDs

### MAXIMUM_INVENTORY_LIST_IDS

**Type:** Number = 10

The maximum number of inventory list IDs that can be passed to setInventoryListIDs(List)

### MAXIMUM_PRODUCT_IDS

**Type:** Number = 30

The maximum number of product IDs that can be passed to setProductIDs(List)

### MAXIMUM_STORE_INVENTORY_FILTER_VALUES

**Type:** Number = 10

The maximum number of store inventory values for a store inventory filter that can be passed to setStoreInventoryFilter(StoreInventoryFilter)

### PRICE_MAX_PARAMETER

**Type:** String = "pmax"

URL Parameter for the maximum price

### PRICE_MIN_PARAMETER

**Type:** String = "pmin"

URL Parameter for the minimum price

### PRODUCTID_PARAMETER

**Type:** String = "pid"

URL Parameter for the product ID

### PROMOTION_PRODUCT_TYPE_ALL

**Type:** String = "all"

constant indicating that all related products should be returned for the next product search by promotion ID

### PROMOTION_PRODUCT_TYPE_BONUS

**Type:** String = "bonus"

constant indicating that only bonus products should be returned for the next product search by promotion ID. This constant should be set using setPromotionProductType(String) when using the search model to find the available list of bonus products for a Choice of Bonus Product (Rule) promotion, along with setPromotionID(String).

### PROMOTION_PRODUCT_TYPE_DISCOUNTED

**Type:** String = "discounted"

constant indicating that only discounted products should be returned for the next product search by promotion ID

### PROMOTION_PRODUCT_TYPE_PARAMETER

**Type:** String = "pmpt"

URL Parameter for the promotion product type

### PROMOTION_PRODUCT_TYPE_QUALIFYING

**Type:** String = "qualifying"

constant indicating that only qualifying products should be returned for the next product search by promotion ID

### PROMOTIONID_PARAMETER

**Type:** String = "pmid"

URL Parameter for the promotion ID

### REFINE_NAME_PARAMETER_PREFIX

**Type:** String = "prefn"

URL Parameter prefix for a refinement name

### REFINE_VALUE_PARAMETER_PREFIX

**Type:** String = "prefv"

URL Parameter prefix for a refinement value

### SORT_BY_PARAMETER_PREFIX

**Type:** String = "psortb"

URL Parameter prefix for a refinement value

### SORT_DIRECTION_PARAMETER_PREFIX

**Type:** String = "psortd"

URL Parameter prefix for a refinement value

### SORTING_OPTION_PARAMETER

**Type:** String = "sopt"

URL Parameter prefix for a sorting option

### SORTING_RULE_PARAMETER

**Type:** String = "srule"

URL Parameter prefix for a sorting rule

## Properties

### category

**Type:** Category (Read Only)

The category object for the category id specified in the query.
 If a category with that id doesn't exist or if the category is offline
 this method returns null.

### categoryID

**Type:** String

The category id that was specified in the search query.

### categorySearch

**Type:** boolean (Read Only)

The method returns true, if this is a pure search for a category. The
 method checks, that a category ID is specified and no search phrase is
 specified.

### deepestCommonCategory

**Type:** Category (Read Only)

The deepest common category of all products in the search result.
 In case of an empty search result the method returns the root category.

### effectiveSortingRule

**Type:** SortingRule (Read Only)

The sorting rule used to order the products in the results of this query,
 or null if no search has been executed yet.

 In contrast to getSortingRule(), this method respects explicit sorting rules and sorting options and rules determined implicitly
 based on the refinement category, keyword sorting rule assignment, etc.

### inventoryIDs

**Type:** List (Read Only)

Returns a list of inventory IDs that were specified in the search query or an empty list if no inventory ID set.

### orderableProductsOnly

**Type:** boolean

Get the flag indicating whether unorderable products should be excluded
 when the next call to getProducts() is made. If this value has not been
 previously set, then the value returned will be based on the value of the
 search preference.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags, defined for this instance for which content can be generated.

 The meta tag content is generated based on the product listing page meta tag context and rules.
 The rules are obtained from the current category context or inherited from the parent category,
 up to the root category.

### personalizedSort

**Type:** boolean (Read Only)

The method indicates if the search result is ordered by a personalized sorting rule.

### priceMax

**Type:** Number

The maximum price by which the search result is refined.

### priceMin

**Type:** Number

The minimum price by which the search result is refined.

### productID

**Type:** String

The product id that was specified in the search query.

### productIDs

**Type:** List

A list of product IDs that were specified in the search query or an empty list if no product ID set.

### products

**Type:** Iterator (Read Only)

All products in the search result. 
 Note that products that were removed or went offline since the last index
 update are not included in the returned set.

### productSearchHits

**Type:** Iterator (Read Only)

The product search hits in the search result. 
 Note that method does also return search hits representing products that
 were removed or went offline since the last index update, i.e. you must
 implement appropriate checks before accessing the product related to the
 search hit instance (see ProductSearchHit.getProduct())

### promotionID

**Type:** String

The promotion id that was specified in the search query or null if no promotion id set. If multiple
 promotion id's specified the method returns only the first id. See setPromotionIDs(List) and
 getPromotionIDs().

### promotionIDs

**Type:** List

A list of promotion id's that were specified in the search query or an empty list if no promotion id set.

### promotionProductType

**Type:** String

The promotion product type specified in the search query.

### recursiveCategorySearch

**Type:** boolean

Get the flag that determines if the category search will
 be recursive.

### refinedByCategory

**Type:** boolean (Read Only)

The method returns true, if the search is refined by a category.
 The method checks, that a category ID is specified.

### refinedByPrice

**Type:** boolean (Read Only)

Identifies if this search has been refined by price.

### refinedByPromotion

**Type:** boolean (Read Only)

Identifies if this search has been refined by promotion.

### refinedCategorySearch

**Type:** boolean (Read Only)

Identifies if this is a category search and is refined with further
 criteria, like a brand refinement or an attribute refinement.

### refinementCategory

**Type:** Category

The category used to determine possible refinements for the search.
 If an explicit category was set for this purpose using setRefinementCategory(Category), it is returned.
 Otherwise, the deepest common category of all search results will be returned.

### refinements

**Type:** ProductSearchRefinements (Read Only)

The ProductSearchRefinements associated with this search and filtered by session currency.
 If an explicit category was set for this purpose using setRefinementCategory(Category), it will be used to determine the refinements.
 Otherwise, the refinements are determined based on the deepest common category of all products in the search result.
 Hint: If you want to use the same refinements for all searches, consider defining them in one category (usually root) and using setRefinementCategory(Category) to avoid unnecessary calculation of the deepest common category.

### searchableImageUploadURL

**Type:** String (Read Only)

This method returns the URL of the endpoint where the merchants should upload their image for visual search.

### searchPhraseSuggestions

**Type:** SearchPhraseSuggestions (Read Only)

Returns search phrase suggestions for the current search phrase.
 Search phrase suggestions may contain alternative search phrases as well
 as lists of corrected and completed search terms.

### sortingRule

**Type:** SortingRule

The sorting rule explicitly set on this model to be used
 to order the products in the results of this query, or null
 if no rule has been explicitly set.

 This method does not return the sorting rule that will be used implicitly
 based on the context of the search, such as the refinement category.

### storeInventoryFilter

**Type:** StoreInventoryFilter

Returns the StoreInventoryFilter, which was specified for this search.

### suggestedSearchPhrase

**Type:** String (Read Only)

The suggested search phrase with the highest accuracy provided
 for the current search phrase.

### suggestedSearchPhrases

**Type:** List (Read Only)

A list with up to 5 suggested search phrases provided for the
 current search phrase. It is possible that less than 5 suggestions
 or even no suggestions are returned.

### trackingEmptySearchesEnabled

**Type:** boolean (Read Only)

The method indicates if no-hits search should be tracked for predictive intelligence use.

### visualSearch

**Type:** boolean (Read Only)

The method returns true, if this is a visual search. The
 method checks that a image UUID is specified.

## Constructor Summary

ProductSearchModel() Constructs a new ProductSearchModel.

## Method Summary

### addHitTypeRefinement

**Signature:** `addHitTypeRefinement(types : String...) : void`

Set the only search hit types to be included from the search.

### excludeHitType

**Signature:** `excludeHitType(types : String...) : void`

Set the search hit types to be excluded from the search.

### getCategory

**Signature:** `getCategory() : Category`

Returns the category object for the category id specified in the query.

### getCategoryID

**Signature:** `getCategoryID() : String`

Returns the category id that was specified in the search query.

### getDeepestCommonCategory

**Signature:** `getDeepestCommonCategory() : Category`

Returns the deepest common category of all products in the search result.

### getEffectiveSortingRule

**Signature:** `getEffectiveSortingRule() : SortingRule`

Returns the sorting rule used to order the products in the results of this query, or null if no search has been executed yet.

### getInventoryIDs

**Signature:** `getInventoryIDs() : List`

Returns a list of inventory IDs that were specified in the search query or an empty list if no inventory ID set.

### getOrderableProductsOnly

**Signature:** `getOrderableProductsOnly() : boolean`

Get the flag indicating whether unorderable products should be excluded when the next call to getProducts() is made.

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

Returns the page meta tag for the specified id.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags, defined for this instance for which content can be generated.

### getPriceMax

**Signature:** `getPriceMax() : Number`

Returns the maximum price by which the search result is refined.

### getPriceMin

**Signature:** `getPriceMin() : Number`

Returns the minimum price by which the search result is refined.

### getProductID

**Signature:** `getProductID() : String`

Returns the product id that was specified in the search query.

### getProductIDs

**Signature:** `getProductIDs() : List`

Returns a list of product IDs that were specified in the search query or an empty list if no product ID set.

### getProducts

**Signature:** `getProducts() : Iterator`

Returns all products in the search result.

### getProductSearchHit

**Signature:** `getProductSearchHit(product : Product) : ProductSearchHit`

Returns the underlying ProductSearchHit for a product, or null if no ProductSearchHit found for this product.

### getProductSearchHits

**Signature:** `getProductSearchHits() : Iterator`

Returns the product search hits in the search result.

### getPromotionID

**Signature:** `getPromotionID() : String`

Returns the promotion id that was specified in the search query or null if no promotion id set.

### getPromotionIDs

**Signature:** `getPromotionIDs() : List`

Returns a list of promotion id's that were specified in the search query or an empty list if no promotion id set.

### getPromotionProductType

**Signature:** `getPromotionProductType() : String`

Returns the promotion product type specified in the search query.

### getRefinementCategory

**Signature:** `getRefinementCategory() : Category`

Returns the category used to determine possible refinements for the search.

### getRefinements

**Signature:** `getRefinements() : ProductSearchRefinements`

Returns the ProductSearchRefinements associated with this search and filtered by session currency.

### getSearchableImageUploadURL

**Signature:** `getSearchableImageUploadURL() : String`

This method returns the URL of the endpoint where the merchants should upload their image for visual search.

### getSearchPhraseSuggestions

**Signature:** `getSearchPhraseSuggestions() : SearchPhraseSuggestions`

Returns search phrase suggestions for the current search phrase.

### getSortingRule

**Signature:** `getSortingRule() : SortingRule`

Returns the sorting rule explicitly set on this model to be used to order the products in the results of this query, or null if no rule has been explicitly set.

### getStoreInventoryFilter

**Signature:** `getStoreInventoryFilter() : StoreInventoryFilter`

Returns the StoreInventoryFilter, which was specified for this search.

### getSuggestedSearchPhrase

**Signature:** `getSuggestedSearchPhrase() : String`

Returns the suggested search phrase with the highest accuracy provided for the current search phrase.

### getSuggestedSearchPhrases

**Signature:** `getSuggestedSearchPhrases() : List`

Returns a list with up to 5 suggested search phrases provided for the current search phrase.

### isCategorySearch

**Signature:** `isCategorySearch() : boolean`

The method returns true, if this is a pure search for a category.

### isPersonalizedSort

**Signature:** `isPersonalizedSort() : boolean`

The method indicates if the search result is ordered by a personalized sorting rule.

### isRecursiveCategorySearch

**Signature:** `isRecursiveCategorySearch() : boolean`

Get the flag that determines if the category search will be recursive.

### isRefinedByCategory

**Signature:** `isRefinedByCategory() : boolean`

The method returns true, if the search is refined by a category.

### isRefinedByPrice

**Signature:** `isRefinedByPrice() : boolean`

Identifies if this search has been refined by price.

### isRefinedByPriceRange

**Signature:** `isRefinedByPriceRange(priceMin : Number, priceMax : Number) : boolean`

Identifies if this search has been refined by the given price range.

### isRefinedByPromotion

**Signature:** `isRefinedByPromotion() : boolean`

Identifies if this search has been refined by promotion.

### isRefinedByPromotion

**Signature:** `isRefinedByPromotion(promotionID : String) : boolean`

Identifies if this search has been refined by a given promotion.

### isRefinedCategorySearch

**Signature:** `isRefinedCategorySearch() : boolean`

Identifies if this is a category search and is refined with further criteria, like a brand refinement or an attribute refinement.

### isTrackingEmptySearchesEnabled

**Signature:** `isTrackingEmptySearchesEnabled() : boolean`

The method indicates if no-hits search should be tracked for predictive intelligence use.

### isVisualSearch

**Signature:** `isVisualSearch() : boolean`

The method returns true, if this is a visual search.

### search

**Signature:** `search() : SearchStatus`

Execute the search based on the configured search term, category and filter conditions (price, attribute, promotion, product type) and return the execution status.

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

Specifies the category id used for the search query.

### setEnableTrackingEmptySearches

**Signature:** `setEnableTrackingEmptySearches(trackingEmptySearches : boolean) : void`

Set a flag indicating whether no-hits search should be tracked for predictive intelligence use.

### setInventoryListIDs

**Signature:** `setInventoryListIDs(inventoryListIDs : List) : void`

Specifies multiple inventory list IDs used for the search query.

### setOrderableProductsOnly

**Signature:** `setOrderableProductsOnly(orderableOnly : boolean) : void`

Set a flag indicating whether unorderable products should be excluded when the next call to getProducts() is made.

### setPriceMax

**Signature:** `setPriceMax(priceMax : Number) : void`

Sets the maximum price by which the search result is to be refined.

### setPriceMin

**Signature:** `setPriceMin(priceMin : Number) : void`

Sets the minimum price by which the search result is to be refined.

### setProductID

**Signature:** `setProductID(productID : String) : void`

Specifies the product id used for the search query.

### setProductIDs

**Signature:** `setProductIDs(productIDs : List) : void`

Specifies multiple product IDs used for the search query.

### setPromotionID

**Signature:** `setPromotionID(promotionID : String) : void`

Specifies the promotion id used for the search query.

### setPromotionIDs

**Signature:** `setPromotionIDs(promotionIDs : List) : void`

Specifies multiple promotion id's used for the search query.

### setPromotionProductType

**Signature:** `setPromotionProductType(promotionProductType : String) : void`

Specifies the promotion product type used for the search query.

### setRecursiveCategorySearch

**Signature:** `setRecursiveCategorySearch(recurse : boolean) : void`

Set a flag to indicate if the search in category should be recursive.

### setRefinementCategory

**Signature:** `setRefinementCategory(refinementCategory : Category) : void`

Sets an explicit category to be used when determining refinements.

### setSearchableImageID

**Signature:** `setSearchableImageID(imageID : String) : void`

An image ID can be retrieved by uploading an image with a multipart/form-data POST request to 'https://api.cquotient.com/v3/image/search/upload/{siteID}'.

### setSortingCondition

**Signature:** `setSortingCondition(attributeID : String, direction : Number) : void`

Sets or removes a sorting condition for the specified attribute.

### setSortingOption

**Signature:** `setSortingOption(option : SortingOption) : void`

Sets the sorting option to be used to order the products in the results of this query.

### setSortingRule

**Signature:** `setSortingRule(rule : SortingRule) : void`

Sets the sorting rule to be used to order the products in the results of this query.

### setStoreInventoryFilter

**Signature:** `setStoreInventoryFilter(storeInventoryFilter : StoreInventoryFilter) : void`

Filters the search result by one or more inventory list IDs provided by the class StoreInventoryFilter which supports a semantic URL parameter like zip, city, store ...

### urlForCategory

**Signature:** `static urlForCategory(action : String, cgid : String) : URL`

Constructs a URL that you can use to execute a query for a specific Category.

### urlForCategory

**Signature:** `static urlForCategory(url : URL, cgid : String) : URL`

Constructs a URL that you can use to execute a query for a specific Category.

### urlForProduct

**Signature:** `static urlForProduct(action : String, cgid : String, pid : String) : URL`

Constructs a URL that you can use to execute a query for a specific Product.

### urlForProduct

**Signature:** `static urlForProduct(url : URL, cgid : String, pid : String) : URL`

Constructs a URL that you can use to execute a query for a specific Product.

### urlForRefine

**Signature:** `static urlForRefine(action : String, attributeID : String, value : String) : URL`

Constructs a URL that you can use to execute a query for a specific attribute name-value pair.

### urlForRefine

**Signature:** `static urlForRefine(url : URL, attributeID : String, value : String) : URL`

Constructs a URL that you can use to execute a query for a specific attribute name-value pair.

### urlRefineCategory

**Signature:** `urlRefineCategory(action : String, refineCategoryID : String) : URL`

Constructs a URL that you can use to re-execute the query with a category refinement.

### urlRefineCategory

**Signature:** `urlRefineCategory(url : URL, refineCategoryID : String) : URL`

Constructs a URL that you can use to re-execute the query with a category refinement.

### urlRefinePrice

**Signature:** `urlRefinePrice(action : String, min : Number, max : Number) : URL`

Constructs a URL that you can use to re-execute the query with an additional price filter.

### urlRefinePrice

**Signature:** `urlRefinePrice(url : URL, min : Number, max : Number) : URL`

Constructs a URL that you can use to re-execute the query with an additional price filter.

### urlRefinePromotion

**Signature:** `urlRefinePromotion(url : URL, refinePromotionID : String) : URL`

Constructs a URL that you can use to re-execute the query with a promotion refinement.

### urlRefinePromotion

**Signature:** `urlRefinePromotion(action : String, refinePromotionID : String) : URL`

Constructs a URL that you can use to re-execute the query with a promotion refinement.

### urlRelaxCategory

**Signature:** `urlRelaxCategory(action : String) : URL`

Constructs a URL that you can use to re-execute the query without any category refinement.

### urlRelaxCategory

**Signature:** `urlRelaxCategory(url : URL) : URL`

Constructs a URL that you can use to re-execute the query without any category refinement.

### urlRelaxPrice

**Signature:** `urlRelaxPrice(action : String) : URL`

Constructs a URL that you can use to re-execute the query with no price filter.

### urlRelaxPrice

**Signature:** `urlRelaxPrice(url : URL) : URL`

Constructs a URL that you can use to would re-execute the query with no price filter.

### urlRelaxPromotion

**Signature:** `urlRelaxPromotion(url : URL) : URL`

Constructs a URL that you can use to re-execute the query without any promotion refinement.

### urlRelaxPromotion

**Signature:** `urlRelaxPromotion(action : String) : URL`

Constructs a URL that you can use to re-execute the query without any promotion refinement.

### urlSortingOption

**Signature:** `urlSortingOption(action : String, option : SortingOption) : URL`

Constructs a URL that you can use to re-execute the query but sort the results by the given storefront sorting option.

### urlSortingOption

**Signature:** `urlSortingOption(url : URL, option : SortingOption) : URL`

Constructs a URL that you can use to re-execute the query but sort the results by the given storefront sorting option.

### urlSortingRule

**Signature:** `urlSortingRule(action : String, rule : SortingRule) : URL`

Constructs a URL that you can use to re-execute the query but sort the results by the given rule.

### urlSortingRule

**Signature:** `urlSortingRule(url : URL, rule : SortingRule) : URL`

Constructs a URL that you can use to re-execute the query but sort the results by the given rule.

## Constructor Detail

## Method Detail

## Method Details

### addHitTypeRefinement

**Signature:** `addHitTypeRefinement(types : String...) : void`

**Description:** Set the only search hit types to be included from the search. Values accepted are the 'hit type' constants exposed in the ProductSearchHit class. Overwrites any hit type refinements set from prior calls to addHitTypeRefinement(String...) or excludeHitType(String...).

**Parameters:**

- `types`: to be included.

---

### excludeHitType

**Signature:** `excludeHitType(types : String...) : void`

**Description:** Set the search hit types to be excluded from the search. Values accepted are the 'hit type' constants exposed in the ProductSearchHit class. Overwrites any hit type refinements set from prior calls to addHitTypeRefinement(String...) or excludeHitType(String...).

**Parameters:**

- `types`: to be excluded.

---

### getCategory

**Signature:** `getCategory() : Category`

**Description:** Returns the category object for the category id specified in the query. If a category with that id doesn't exist or if the category is offline this method returns null.

**Returns:**

the category object for the category id specified in the query.

---

### getCategoryID

**Signature:** `getCategoryID() : String`

**Description:** Returns the category id that was specified in the search query.

**Returns:**

the category id that was specified in the search query.

---

### getDeepestCommonCategory

**Signature:** `getDeepestCommonCategory() : Category`

**Description:** Returns the deepest common category of all products in the search result. In case of an empty search result the method returns the root category.

**Returns:**

the deepest common category of all products in the search result of this search model or root for an empty search result.

---

### getEffectiveSortingRule

**Signature:** `getEffectiveSortingRule() : SortingRule`

**Description:** Returns the sorting rule used to order the products in the results of this query, or null if no search has been executed yet. In contrast to getSortingRule(), this method respects explicit sorting rules and sorting options and rules determined implicitly based on the refinement category, keyword sorting rule assignment, etc.

**Returns:**

a SortingRule or null.

---

### getInventoryIDs

**Signature:** `getInventoryIDs() : List`

**Description:** Returns a list of inventory IDs that were specified in the search query or an empty list if no inventory ID set.

**Returns:**

the list of inventory IDs that were specified in the search query or an empty list if no inventory ID set.

---

### getOrderableProductsOnly

**Signature:** `getOrderableProductsOnly() : boolean`

**Description:** Get the flag indicating whether unorderable products should be excluded when the next call to getProducts() is made. If this value has not been previously set, then the value returned will be based on the value of the search preference.

**Returns:**

true if unorderable products should be excluded from product search results, false otherwise.

---

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

**Description:** Returns the page meta tag for the specified id. The meta tag content is generated based on the product listing page meta tag context and rule. The rule is obtained from the current category context or inherited from the parent category, up to the root category. Null will be returned if the meta tag is undefined on the current instance, or if no rule can be found for the current context, or if the rule resolves to an empty string.

**Parameters:**

- `id`: the ID to get the page meta tag for

**Returns:**

page meta tag containing content generated based on rules

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags, defined for this instance for which content can be generated. The meta tag content is generated based on the product listing page meta tag context and rules. The rules are obtained from the current category context or inherited from the parent category, up to the root category.

**Returns:**

page meta tags defined for this instance, containing content generated based on rules

---

### getPriceMax

**Signature:** `getPriceMax() : Number`

**Description:** Returns the maximum price by which the search result is refined.

**Returns:**

the maximum price by which the search result is refined.

---

### getPriceMin

**Signature:** `getPriceMin() : Number`

**Description:** Returns the minimum price by which the search result is refined.

**Returns:**

the minimum price by which the search result is refined.

---

### getProductID

**Signature:** `getProductID() : String`

**Description:** Returns the product id that was specified in the search query.

**Deprecated:**

Please use getProductIDs() instead

**Returns:**

the product id that was specified in the search.

---

### getProductIDs

**Signature:** `getProductIDs() : List`

**Description:** Returns a list of product IDs that were specified in the search query or an empty list if no product ID set.

**Returns:**

the list of product IDs that were specified in the search query or an empty list if no product ID set.

---

### getProducts

**Signature:** `getProducts() : Iterator`

**Description:** Returns all products in the search result. Note that products that were removed or went offline since the last index update are not included in the returned set.

**Deprecated:**

This method should not be used because loading Products for each result of a product search is extremely expensive performance-wise. Please use getProductSearchHits() to iterate ProductSearchHits instead.

**Returns:**

Products in search result

**See Also:**

getProductSearchHits()

---

### getProductSearchHit

**Signature:** `getProductSearchHit(product : Product) : ProductSearchHit`

**Description:** Returns the underlying ProductSearchHit for a product, or null if no ProductSearchHit found for this product.

**Parameters:**

- `product`: the product to find the underlying ProductSearchHit

**Returns:**

the underlying ProductSearchHit for a product, or null if no ProductSearchHit found for this product.

---

### getProductSearchHits

**Signature:** `getProductSearchHits() : Iterator`

**Description:** Returns the product search hits in the search result. Note that method does also return search hits representing products that were removed or went offline since the last index update, i.e. you must implement appropriate checks before accessing the product related to the search hit instance (see ProductSearchHit.getProduct())

**Returns:**

Products hits in search result

**See Also:**

getProducts()

---

### getPromotionID

**Signature:** `getPromotionID() : String`

**Description:** Returns the promotion id that was specified in the search query or null if no promotion id set. If multiple promotion id's specified the method returns only the first id. See setPromotionIDs(List) and getPromotionIDs().

**Returns:**

the promotion id that was specified in the search query or null if no promotion id set.

---

### getPromotionIDs

**Signature:** `getPromotionIDs() : List`

**Description:** Returns a list of promotion id's that were specified in the search query or an empty list if no promotion id set.

**Returns:**

the list of promotion id's that was specified in the search query or an empty list if no promotion id set.

---

### getPromotionProductType

**Signature:** `getPromotionProductType() : String`

**Description:** Returns the promotion product type specified in the search query.

**Returns:**

the promotion product type that was specified in the search query.

---

### getRefinementCategory

**Signature:** `getRefinementCategory() : Category`

**Description:** Returns the category used to determine possible refinements for the search. If an explicit category was set for this purpose using setRefinementCategory(Category), it is returned. Otherwise, the deepest common category of all search results will be returned.

**Returns:**

the category used to determine refinements.

---

### getRefinements

**Signature:** `getRefinements() : ProductSearchRefinements`

**Description:** Returns the ProductSearchRefinements associated with this search and filtered by session currency. If an explicit category was set for this purpose using setRefinementCategory(Category), it will be used to determine the refinements. Otherwise, the refinements are determined based on the deepest common category of all products in the search result. Hint: If you want to use the same refinements for all searches, consider defining them in one category (usually root) and using setRefinementCategory(Category) to avoid unnecessary calculation of the deepest common category.

**Returns:**

the ProductSearchRefinements associated with this search.

---

### getSearchableImageUploadURL

**Signature:** `getSearchableImageUploadURL() : String`

**Description:** This method returns the URL of the endpoint where the merchants should upload their image for visual search.

**Returns:**

returns the URL where the merchants should upload their image.

**Throws:**

- RuntimeException

---

### getSearchPhraseSuggestions

**Signature:** `getSearchPhraseSuggestions() : SearchPhraseSuggestions`

**Description:** Returns search phrase suggestions for the current search phrase. Search phrase suggestions may contain alternative search phrases as well as lists of corrected and completed search terms.

**Returns:**

search phrase suggestions for the current search phrase

---

### getSortingRule

**Signature:** `getSortingRule() : SortingRule`

**Description:** Returns the sorting rule explicitly set on this model to be used to order the products in the results of this query, or null if no rule has been explicitly set. This method does not return the sorting rule that will be used implicitly based on the context of the search, such as the refinement category.

**Returns:**

a SortingRule or null.

---

### getStoreInventoryFilter

**Signature:** `getStoreInventoryFilter() : StoreInventoryFilter`

**Description:** Returns the StoreInventoryFilter, which was specified for this search.

**Returns:**

the StoreInventoryFilter, which was specified for this search.

---

### getSuggestedSearchPhrase

**Signature:** `getSuggestedSearchPhrase() : String`

**Description:** Returns the suggested search phrase with the highest accuracy provided for the current search phrase.

**Deprecated:**

Please use getSearchPhraseSuggestions() instead

**Returns:**

the suggested search phrase.

---

### getSuggestedSearchPhrases

**Signature:** `getSuggestedSearchPhrases() : List`

**Description:** Returns a list with up to 5 suggested search phrases provided for the current search phrase. It is possible that less than 5 suggestions or even no suggestions are returned.

**Deprecated:**

Please use getSearchPhraseSuggestions() instead

**Returns:**

a list containing the suggested search phrases.

---

### isCategorySearch

**Signature:** `isCategorySearch() : boolean`

**Description:** The method returns true, if this is a pure search for a category. The method checks, that a category ID is specified and no search phrase is specified.

**Returns:**

True if this is a category search

---

### isPersonalizedSort

**Signature:** `isPersonalizedSort() : boolean`

**Description:** The method indicates if the search result is ordered by a personalized sorting rule.

**Returns:**

true if search result is ordered by a personalized sorting rule, otherwise false.

---

### isRecursiveCategorySearch

**Signature:** `isRecursiveCategorySearch() : boolean`

**Description:** Get the flag that determines if the category search will be recursive.

**Returns:**

true if the category search will be recursive, false otherwise

---

### isRefinedByCategory

**Signature:** `isRefinedByCategory() : boolean`

**Description:** The method returns true, if the search is refined by a category. The method checks, that a category ID is specified.

**Returns:**

true, if the search is refined by a category, false otherwise.

---

### isRefinedByPrice

**Signature:** `isRefinedByPrice() : boolean`

**Description:** Identifies if this search has been refined by price.

**Returns:**

True if the search is refined by price, false otherwise.

---

### isRefinedByPriceRange

**Signature:** `isRefinedByPriceRange(priceMin : Number, priceMax : Number) : boolean`

**Description:** Identifies if this search has been refined by the given price range. Either range parameters may be null to represent open ranges.

**Parameters:**

- `priceMin`: The lower bound of the price range.
- `priceMax`: The upper bound of the price range.

**Returns:**

True if the search is refinemd on the given price range, false otherwise.

---

### isRefinedByPromotion

**Signature:** `isRefinedByPromotion() : boolean`

**Description:** Identifies if this search has been refined by promotion.

**Returns:**

True if the search is refined by promotion, false otherwise.

---

### isRefinedByPromotion

**Signature:** `isRefinedByPromotion(promotionID : String) : boolean`

**Description:** Identifies if this search has been refined by a given promotion.

**Parameters:**

- `promotionID`: the ID of the promotion to check

**Returns:**

True if the search is refined by the given promotionID, false otherwise.

---

### isRefinedCategorySearch

**Signature:** `isRefinedCategorySearch() : boolean`

**Description:** Identifies if this is a category search and is refined with further criteria, like a brand refinement or an attribute refinement.

**Returns:**

true if this is a category search and is refined with further criteria, false otherwise.

---

### isTrackingEmptySearchesEnabled

**Signature:** `isTrackingEmptySearchesEnabled() : boolean`

**Description:** The method indicates if no-hits search should be tracked for predictive intelligence use.

**Returns:**

true, if no-hits search should be tracked, otherwise false.

---

### isVisualSearch

**Signature:** `isVisualSearch() : boolean`

**Description:** The method returns true, if this is a visual search. The method checks that a image UUID is specified.

**Returns:**

True if this is a visual search

---

### search

**Signature:** `search() : SearchStatus`

**Description:** Execute the search based on the configured search term, category and filter conditions (price, attribute, promotion, product type) and return the execution status. The execution of an empty ProductSearchModel without any search term or filter criteria will not be supported and the search status SearchStatus.EMPTY_QUERY will be returned. A usage of the internal category id 'root' as category filter is not recommended, could cause performance issues and will be potentially deprecated in a future release. A successful execution will be indicated by SearchStatus.SUCCESSFUL or SearchStatus.LIMITED. For other possible search statuses see SearchStatus. The sorted and grouped search result of a successful execution can be fetched via getProductSearchHits() and the refinement options based on the search result can be obtained via getRefinements() and SearchModel.getRefinementValues(String).

**Returns:**

the searchStatus object with search status code and description of search result.

---

### setCategoryID

**Signature:** `setCategoryID(categoryID : String) : void`

**Description:** Specifies the category id used for the search query.

**Parameters:**

- `categoryID`: the category id for the search query.

---

### setEnableTrackingEmptySearches

**Signature:** `setEnableTrackingEmptySearches(trackingEmptySearches : boolean) : void`

**Description:** Set a flag indicating whether no-hits search should be tracked for predictive intelligence use.

**Parameters:**

- `trackingEmptySearches`: true, no-hits search should be tracked, false, otherwise.

---

### setInventoryListIDs

**Signature:** `setInventoryListIDs(inventoryListIDs : List) : void`

**Description:** Specifies multiple inventory list IDs used for the search query. The method supports up to MAXIMUM_INVENTORY_LIST_IDS inventory IDs. If more than MAXIMUM_INVENTORY_LIST_IDS inventory IDs used the method throws an IllegalArgumentException.

**Parameters:**

- `inventoryListIDs`: the inventory IDs for the search query.

**Throws:**

IllegalArgumentException - if more than MAXIMUM_INVENTORY_LIST_IDS inventory IDs used

---

### setOrderableProductsOnly

**Signature:** `setOrderableProductsOnly(orderableOnly : boolean) : void`

**Description:** Set a flag indicating whether unorderable products should be excluded when the next call to getProducts() is made. This method overrides the default behavior which is controlled by the search preference.

**Parameters:**

- `orderableOnly`: true if unorderable products should be excluded from product search results, false otherwise.

---

### setPriceMax

**Signature:** `setPriceMax(priceMax : Number) : void`

**Description:** Sets the maximum price by which the search result is to be refined.

**Parameters:**

- `priceMax`: sets the maximum price by which the search result is to be refined.

---

### setPriceMin

**Signature:** `setPriceMin(priceMin : Number) : void`

**Description:** Sets the minimum price by which the search result is to be refined.

**Parameters:**

- `priceMin`: the minimum price by which the search result is to be refined.

---

### setProductID

**Signature:** `setProductID(productID : String) : void`

**Description:** Specifies the product id used for the search query.

**Deprecated:**

Please use setProductIDs(List) instead

**Parameters:**

- `productID`: the product id for the search query.

---

### setProductIDs

**Signature:** `setProductIDs(productIDs : List) : void`

**Description:** Specifies multiple product IDs used for the search query. The specified product IDs include, but not limited to, variant product IDs, product master IDs, variation group IDs, product set IDs, or product bundle IDs. For example, this API could be used in high-traffic pages where developers need to be able to filter quickly for only available child products of a specified master product, instead of looping through all variants of a set products and checking their availabilities. The method supports up to MAXIMUM_PRODUCT_IDS product IDs. If more than MAXIMUM_PRODUCT_IDS products IDs are passed, the method throws an IllegalArgumentException.

**Parameters:**

- `productIDs`: the product IDs for the search query.

**Throws:**

IllegalArgumentException - if more than MAXIMUM_PRODUCT_IDS product IDs used

---

### setPromotionID

**Signature:** `setPromotionID(promotionID : String) : void`

**Description:** Specifies the promotion id used for the search query.

**Parameters:**

- `promotionID`: the promotion id for the search query.

---

### setPromotionIDs

**Signature:** `setPromotionIDs(promotionIDs : List) : void`

**Description:** Specifies multiple promotion id's used for the search query. The method supports up to 30 promotion id's. If more than 30 promotion id's used the method throws an IllegalArgumentException.

**Parameters:**

- `promotionIDs`: the promotion ids for the search query.

**Throws:**

IllegalArgumentException - if more than 30 promotion id's used

---

### setPromotionProductType

**Signature:** `setPromotionProductType(promotionProductType : String) : void`

**Description:** Specifies the promotion product type used for the search query. This value is only relevant for searches by promotion ID.

**Parameters:**

- `promotionProductType`: The type of product to filter by when searching by promotion ID. Allowed values are PROMOTION_PRODUCT_TYPE_ALL, PROMOTION_PRODUCT_TYPE_BONUS, PROMOTION_PRODUCT_TYPE_QUALIFYING, and PROMOTION_PRODUCT_TYPE_DISCOUNTED. If null is passed, or an invalid value is passed, the search will use PROMOTION_PRODUCT_TYPE_ALL.

---

### setRecursiveCategorySearch

**Signature:** `setRecursiveCategorySearch(recurse : boolean) : void`

**Description:** Set a flag to indicate if the search in category should be recursive.

**Parameters:**

- `recurse`: recurse the category in the search

---

### setRefinementCategory

**Signature:** `setRefinementCategory(refinementCategory : Category) : void`

**Description:** Sets an explicit category to be used when determining refinements. If this is not done, they will be determined based on the deepest common category of all search results. The explicit category must be in the site's storefront catalog, otherwise the method fails with an IllegalArgumentException.

**Parameters:**

- `refinementCategory`: the category used to determine the applicable refinements.

**Throws:**

IllegalArgumentException - if the refinement category does not reside in the storefront catalog

---

### setSearchableImageID

**Signature:** `setSearchableImageID(imageID : String) : void`

**Description:** An image ID can be retrieved by uploading an image with a multipart/form-data POST request to 'https://api.cquotient.com/v3/image/search/upload/{siteID}'. This method sets product IDs retrieved from the image ID to the ProductSearchModel. If using setProductIDs(List) in addition to this method, the ProductSearchModel will take the intersection of these sets of product IDs. If the image ID provided is invalid or expired, product IDs will not be set onto the product search model.

**Parameters:**

- `imageID`: the image ID for the visual search query.

**Throws:**

RuntimeException - if product IDs for the provided image could not be set.

---

### setSortingCondition

**Signature:** `setSortingCondition(attributeID : String, direction : Number) : void`

**Description:** Sets or removes a sorting condition for the specified attribute. Specify either SORT_DIRECTION_ASCENDING or SORT_DIRECTION_DESCENDING to set a sorting condition. Specify SORT_DIRECTION_NONE to remove a sorting condition from the attribute.

**Deprecated:**

This method is subject to removal. Use setSortingRule(SortingRule) instead.

**Parameters:**

- `attributeID`: the attribute ID
- `direction`: SORT_DIRECTION_ASCENDING, SORT_DIRECTION_DESCENDING or SORT_DIRECTION_NONE

---

### setSortingOption

**Signature:** `setSortingOption(option : SortingOption) : void`

**Description:** Sets the sorting option to be used to order the products in the results of this query. If a sorting rule is also set, the sorting option is ignored.

**Parameters:**

- `option`: the SortingOption to use to sort the products

---

### setSortingRule

**Signature:** `setSortingRule(rule : SortingRule) : void`

**Description:** Sets the sorting rule to be used to order the products in the results of this query. Setting the rule in this way overrides the default behavior of choosing the sorting rule based on the context of the search, such as the refinement category.

**Parameters:**

- `rule`: the SortingRule to use to sort the products

---

### setStoreInventoryFilter

**Signature:** `setStoreInventoryFilter(storeInventoryFilter : StoreInventoryFilter) : void`

**Description:** Filters the search result by one or more inventory list IDs provided by the class StoreInventoryFilter which supports a semantic URL parameter like zip, city, store ... and a list of StoreInventoryFilterValue which maps the semantic inventory list id value like Burlington, Boston, ... to a real inventory list id like 'Burlington -> inventory1', 'Boston -> inventory2'. The search will filter the result by the real inventory list id(s) but will use the semantic URL parameter and semantic inventory list id values for URL generation via all URLRefine and URLRelax methods e.g. for urlRefineCategory(URL, String), urlRelaxPrice(URL), SearchModel.urlRefineAttribute(String, String, String). Example custom URL: city=Burlington|Boston var storeFilter = new dw.catalog.StoreInventoryFilter("city", new dw.util.ArrayList( new dw.catalog.StoreInventoryFilterValue("Burlington","inventory_store_store9"), new dw.catalog.StoreInventoryFilterValue("Boston","inventory_store_store8") )); searchModel.setStoreInventoryFilter(filter)

**Parameters:**

- `storeInventoryFilter`: The StoreInventoryFilter instance to filter the search result by one or more inventory IDs with semantic key and semantic value support.

**Throws:**

IllegalArgumentException - if more than MAXIMUM_STORE_INVENTORY_FILTER_VALUES filter values used

---

### urlForCategory

**Signature:** `static urlForCategory(action : String, cgid : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific Category. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: pipeline action, e.g. 'Search-Show'.
- `cgid`: the category ID.

**Returns:**

the new URL.

---

### urlForCategory

**Signature:** `static urlForCategory(url : URL, cgid : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific Category. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the URL to use to generate the new URL.
- `cgid`: the category ID.

**Returns:**

the new URL.

---

### urlForProduct

**Signature:** `static urlForProduct(action : String, cgid : String, pid : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific Product. The passed action is used to build an initial url. All search specific attributes are appended. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: pipeline action, e.g. 'Search-Show'.
- `cgid`: the category id or null if product is not in category context.
- `pid`: the product id.

**Returns:**

the new URL.

---

### urlForProduct

**Signature:** `static urlForProduct(url : URL, cgid : String, pid : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific Product. The passed url can be either a full url or just the name for a pipeline. In the later case a relative URL is created.

**Parameters:**

- `url`: the URL to use to generate the new URL.
- `cgid`: the category id or null if product is not in category context.
- `pid`: the product id.

**Returns:**

the new URL.

---

### urlForRefine

**Signature:** `static urlForRefine(action : String, attributeID : String, value : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific attribute name-value pair. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: pipeline action, e.g. 'Search-Show'.
- `attributeID`: the attribute ID for the refinement.
- `value`: the attribute value for the refinement.

**Returns:**

the new URL.

---

### urlForRefine

**Signature:** `static urlForRefine(url : URL, attributeID : String, value : String) : URL`

**Description:** Constructs a URL that you can use to execute a query for a specific attribute name-value pair. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the URL to use to generate the new URL.
- `attributeID`: the attribute ID for the refinement.
- `value`: the attribute value for the refinement.

**Returns:**

the new URL.

---

### urlRefineCategory

**Signature:** `urlRefineCategory(action : String, refineCategoryID : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with a category refinement. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'
- `refineCategoryID`: the ID of the category.

**Returns:**

the new URL.

---

### urlRefineCategory

**Signature:** `urlRefineCategory(url : URL, refineCategoryID : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with a category refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.
- `refineCategoryID`: the ID of the category.

**Returns:**

the new URL.

---

### urlRefinePrice

**Signature:** `urlRefinePrice(action : String, min : Number, max : Number) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with an additional price filter. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'.
- `min`: the minimum price.
- `max`: the maximum price.

**Returns:**

the new URL.

---

### urlRefinePrice

**Signature:** `urlRefinePrice(url : URL, min : Number, max : Number) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with an additional price filter. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the URL to use to generate the new URL.
- `min`: the minimum price.
- `max`: the maximum price.

**Returns:**

the new URL.

---

### urlRefinePromotion

**Signature:** `urlRefinePromotion(url : URL, refinePromotionID : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with a promotion refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.
- `refinePromotionID`: the ID of the promotion.

**Returns:**

the new URL.

---

### urlRefinePromotion

**Signature:** `urlRefinePromotion(action : String, refinePromotionID : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with a promotion refinement. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'
- `refinePromotionID`: the ID of the promotion.

**Returns:**

the new URL.

---

### urlRelaxCategory

**Signature:** `urlRelaxCategory(action : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query without any category refinement. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'.

**Returns:**

the new URL.

---

### urlRelaxCategory

**Signature:** `urlRelaxCategory(url : URL) : URL`

**Description:** Constructs a URL that you can use to re-execute the query without any category refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.

**Returns:**

the new URL.

---

### urlRelaxPrice

**Signature:** `urlRelaxPrice(action : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query with no price filter. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'

**Returns:**

the new URL.

---

### urlRelaxPrice

**Signature:** `urlRelaxPrice(url : URL) : URL`

**Description:** Constructs a URL that you can use to would re-execute the query with no price filter. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.

**Returns:**

the new URL.

---

### urlRelaxPromotion

**Signature:** `urlRelaxPromotion(url : URL) : URL`

**Description:** Constructs a URL that you can use to re-execute the query without any promotion refinement. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.

**Returns:**

the new URL.

---

### urlRelaxPromotion

**Signature:** `urlRelaxPromotion(action : String) : URL`

**Description:** Constructs a URL that you can use to re-execute the query without any promotion refinement. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'.

**Returns:**

the new URL.

---

### urlSortingOption

**Signature:** `urlSortingOption(action : String, option : SortingOption) : URL`

**Description:** Constructs a URL that you can use to re-execute the query but sort the results by the given storefront sorting option. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'.
- `option`: sorting option

**Returns:**

the new URL.

---

### urlSortingOption

**Signature:** `urlSortingOption(url : URL, option : SortingOption) : URL`

**Description:** Constructs a URL that you can use to re-execute the query but sort the results by the given storefront sorting option. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.
- `option`: sorting option

**Returns:**

the new URL.

---

### urlSortingRule

**Signature:** `urlSortingRule(action : String, rule : SortingRule) : URL`

**Description:** Constructs a URL that you can use to re-execute the query but sort the results by the given rule. The generated URL will be an absolute URL which uses the protocol of the current request.

**Parameters:**

- `action`: the pipeline action, e.g. 'Search-Show'.
- `rule`: sorting rule

**Returns:**

the new URL.

---

### urlSortingRule

**Signature:** `urlSortingRule(url : URL, rule : SortingRule) : URL`

**Description:** Constructs a URL that you can use to re-execute the query but sort the results by the given rule. The search specific parameters are appended to the provided URL. The URL is typically generated with one of the URLUtils methods.

**Parameters:**

- `url`: the existing URL to use to create the new URL.
- `rule`: sorting rule

**Returns:**

the new URL.

---
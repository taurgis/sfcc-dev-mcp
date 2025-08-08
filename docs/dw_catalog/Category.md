## Package: dw.catalog

# Class Category

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Category

## Description

Represents a category in a product catalog.

## Constants

## Properties

### allRecommendations

**Type:** Collection (Read Only)

All outgoing recommendations for this category.  The
 recommendations are sorted by their explicitly set order.

### categoryAssignments

**Type:** Collection (Read Only)

A collection of category assignments of the category.

### defaultSortingRule

**Type:** SortingRule (Read Only)

The default sorting rule configured for this category,
 or null if there is no default rule to be applied for it.

 This method returns the default rule for the parent category if this
 category inherits one.  The parent category may inherit its default
 rule from its parent, and so on, up to the root category.

 This method returns null if no ancestor category for this
 category has a default rule.

### description

**Type:** String (Read Only)

The description of the catalog category for the current locale.

### displayMode

**Type:** Number

The Variation Groups Display Mode of the category or null if no display mode is defined.

### displayName

**Type:** String (Read Only)

The display name of the of the catalog category for the current locale.

 This value is intended to be used as the
 external visible name of the catalog category.

### ID

**Type:** String (Read Only)

The id of the category.

### image

**Type:** MediaFile (Read Only)

The image reference of this catalog category.

### incomingCategoryLinks

**Type:** Collection (Read Only)

The collection of CategoryLink objects for which this category
 is the target.  If the source category of a link belongs to a different
 catalog than the catalog owning this category, it is not returned.

### online

**Type:** boolean (Read Only)

The value indicating whether the catalog category is "currently
 online".  A category is currently online if its online flag equals true
 and the current site date is within the date range defined by the
 onlineFrom and onlineTo attributes.

### onlineCategoryAssignments

**Type:** Collection (Read Only)

A collection of category assignments of the category where the
 referenced product is currently online. When checking the online status
 of the product, the online flag and the online from & to dates are taken
 into account. Online flag, online from & to dates set for the current site
 takes precedence over the default values.

### onlineFlag

**Type:** boolean (Read Only)

The online status flag of the category.

### onlineFrom

**Type:** Date (Read Only)

The date from which the category is online or valid.

### onlineIncomingCategoryLinks

**Type:** Collection (Read Only)

The collection of CategoryLink objects for
 which this category is the target. If the source category of a link
 belongs to a different catalog than the catalog owning this category, it
 is not returned. Additionally, this method will only return a link if the
 source category is currently online. A category is currently online if
 its online flag equals true and the current site date is within the date
 range defined by the onlineFrom and onlineTo attributes.

### onlineOutgoingCategoryLinks

**Type:** Collection (Read Only)

The collection of CategoryLink objects for
 which this category is the source. If the target category of a link
 belongs to a different catalog than the catalog owning this category, it
 is not returned. Additionally, this method will only return a link if the
 target category is currently online. A category is currently online if
 its online flag equals true and the current site date is within the date
 range defined by the onlineFrom and onlineTo attributes.

### onlineProducts

**Type:** Collection (Read Only)

Returns online products assigned to this category.
 Offline products are not included in the returned collection.
 When checking the online status of the product,
 the online flag and the online from & to dates are taken into account.
 Online flag, online from & to dates set for the current site takes precedence
 over the default values. 

 The order of products in the returned collection corresponds to the
 defined explicit sorting of products in this category.

### onlineSubCategories

**Type:** Collection (Read Only)

A sorted collection of currently online subcategories of this
 catalog category.
 
  
   A category is currently online if its online flag
   equals true and the current site date is within the date range defined by
   the onlineFrom and onlineTo attributes.
  
  
   The returned collection is sorted by position. Subcategories marked as
   "unsorted" always appear after those marked as "sorted" but are otherwise
   not in any guaranteed order.
  
  
    The returned collection contains direct subcategories only.

### onlineTo

**Type:** Date (Read Only)

The date until which the category is online or valid.

### orderableRecommendations

**Type:** Collection (Read Only)

A list of outgoing recommendations for this category. This method
 behaves similarly to getRecommendations() but additionally filters out
 recommendations for which the target product is unorderable according to
 its product availability model.

### outgoingCategoryLinks

**Type:** Collection (Read Only)

The collection of CategoryLink objects for which this category
 is the source.  If the target category of a link belongs to a different
 catalog than the catalog owning this category, it is not returned.
 The collection of links is sorted by the explicitly defined order
 for this category with unsorted links appearing at the end.

### pageDescription

**Type:** String (Read Only)

The page description of this category for the default locale or null if not defined.

### pageKeywords

**Type:** String (Read Only)

The page keywords of this category for the default locale or null if not defined.

### pageTitle

**Type:** String (Read Only)

The page title of this category for the default locale or null if not defined.

### pageURL

**Type:** String (Read Only)

The page URL property of this category or null if not defined.

### parent

**Type:** Category (Read Only)

The parent of this category.

### productAttributeModel

**Type:** ProductAttributeModel (Read Only)

Returns this category's ProductAttributeModel, which makes access to the
 category's attribute information convenient. The model is calculated
 based on the attribute definitions assigned to this category and the
 global attribute definitions for the object type 'Product'.

### products

**Type:** Collection (Read Only)

All products assigned to this category.
 The order of products in the returned collection corresponds to the
 defined explicit sorting of products in this category.

### recommendations

**Type:** Collection (Read Only)

The outgoing recommendations for this category.  If this category
 is not in the site catalog, or there is no site catalog, an empty
 collection is returned.  Only recommendations for which the target
 product exists and is assigned to the site catalog are returned.  The
 recommendations are sorted by their explicitly set order.

### root

**Type:** boolean (Read Only)

Identifies if the category is the root category of its catalog.

### searchPlacement

**Type:** Number

The search placement of the category or null of no search placement is defined.

### searchRank

**Type:** Number

The search rank of the category or null of no search rank is defined.

### siteMapChangeFrequency

**Type:** String (Read Only)

The category's sitemap change frequency.

### siteMapIncluded

**Type:** Number (Read Only)

The category's sitemap inclusion.

### siteMapPriority

**Type:** Number (Read Only)

The category's sitemap priority.

### subCategories

**Type:** Collection (Read Only)

A sorted collection of the subcategories of this catalog category,
 including both online and offline subcategories.
 
  
   The returned collection is sorted by position. Subcategories marked as
   "unsorted" always appear after those marked as "sorted" but are otherwise
   not in any guaranteed order.
  
  
   The returned collection contains direct subcategories only.

### template

**Type:** String (Read Only)

The template property value , which is the file name of the template
 used to display the catalog category.

### thumbnail

**Type:** MediaFile (Read Only)

The thumbnail image reference of this catalog category.

### topLevel

**Type:** boolean (Read Only)

Returns true if the category is a top level category, but not the root
 category.

## Constructor Summary

## Method Summary

### getAllRecommendations

**Signature:** `getAllRecommendations() : Collection`

Returns all outgoing recommendations for this category.

### getAllRecommendations

**Signature:** `getAllRecommendations(type : Number) : Collection`

Returns all outgoing recommendations for this category which are of the specified type.

### getCategoryAssignments

**Signature:** `getCategoryAssignments() : Collection`

Returns a collection of category assignments of the category.

### getDefaultSortingRule

**Signature:** `getDefaultSortingRule() : SortingRule`

Returns the default sorting rule configured for this category, or null if there is no default rule to be applied for it.

### getDescription

**Signature:** `getDescription() : String`

Returns the description of the catalog category for the current locale.

### getDisplayMode

**Signature:** `getDisplayMode() : Number`

Returns the Variation Groups Display Mode of the category or null if no display mode is defined.

### getDisplayName

**Signature:** `getDisplayName() : String`

Returns the display name of the of the catalog category for the current locale.

### getID

**Signature:** `getID() : String`

Returns the id of the category.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the image reference of this catalog category.

### getIncomingCategoryLinks

**Signature:** `getIncomingCategoryLinks() : Collection`

Returns the collection of CategoryLink objects for which this category is the target.

### getIncomingCategoryLinks

**Signature:** `getIncomingCategoryLinks(type : Number) : Collection`

Returns the collection of CategoryLink objects for which this category is the target and which are of the specified type.

### getOnlineCategoryAssignments

**Signature:** `getOnlineCategoryAssignments() : Collection`

Returns a collection of category assignments of the category where the referenced product is currently online.

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

Returns the online status flag of the category.

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the date from which the category is online or valid.

### getOnlineIncomingCategoryLinks

**Signature:** `getOnlineIncomingCategoryLinks() : Collection`

Returns the collection of CategoryLink objects for which this category is the target.

### getOnlineOutgoingCategoryLinks

**Signature:** `getOnlineOutgoingCategoryLinks() : Collection`

Returns the collection of CategoryLink objects for which this category is the source.

### getOnlineProducts

**Signature:** `getOnlineProducts() : Collection`

Returns online products assigned to this category.

### getOnlineSubCategories

**Signature:** `getOnlineSubCategories() : Collection`

Returns a sorted collection of currently online subcategories of this catalog category.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the date until which the category is online or valid.

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations() : Collection`

Returns a list of outgoing recommendations for this category.

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations(type : Number) : Collection`

Returns a list of outgoing recommendations for this category.

### getOutgoingCategoryLinks

**Signature:** `getOutgoingCategoryLinks() : Collection`

Returns the collection of CategoryLink objects for which this category is the source.

### getOutgoingCategoryLinks

**Signature:** `getOutgoingCategoryLinks(type : Number) : Collection`

Returns the collection of CategoryLink objects for which this category is the source and which are of the specified type.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns the page description of this category for the default locale or null if not defined.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the page keywords of this category for the default locale or null if not defined.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the page title of this category for the default locale or null if not defined.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the page URL property of this category or null if not defined.

### getParent

**Signature:** `getParent() : Category`

Returns the parent of this category.

### getProductAttributeModel

**Signature:** `getProductAttributeModel() : ProductAttributeModel`

Returns this category's ProductAttributeModel, which makes access to the category's attribute information convenient.

### getProducts

**Signature:** `getProducts() : Collection`

Returns all products assigned to this category.

### getRecommendations

**Signature:** `getRecommendations() : Collection`

Returns the outgoing recommendations for this category.

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

Returns the outgoing recommendations for this category which are of the specified type.

### getSearchPlacement

**Signature:** `getSearchPlacement() : Number`

Returns the search placement of the category or null of no search placement is defined.

### getSearchRank

**Signature:** `getSearchRank() : Number`

Returns the search rank of the category or null of no search rank is defined.

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

Returns the category's sitemap change frequency.

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

Returns the category's sitemap inclusion.

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

Returns the category's sitemap priority.

### getSubCategories

**Signature:** `getSubCategories() : Collection`

Returns a sorted collection of the subcategories of this catalog category, including both online and offline subcategories.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the template property value , which is the file name of the template used to display the catalog category.

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

Returns the thumbnail image reference of this catalog category.

### hasOnlineProducts

**Signature:** `hasOnlineProducts() : boolean`

Returns true if this catalog category has any online products assigned.

### hasOnlineSubCategories

**Signature:** `hasOnlineSubCategories() : boolean`

Returns true if this catalog category has any online subcategories.

### isDirectSubCategoryOf

**Signature:** `isDirectSubCategoryOf(parent : Category) : boolean`

Returns true if this category is a direct sub-category of the provided category.

### isOnline

**Signature:** `isOnline() : boolean`

Returns the value indicating whether the catalog category is "currently online".

### isRoot

**Signature:** `isRoot() : boolean`

Identifies if the category is the root category of its catalog.

### isSubCategoryOf

**Signature:** `isSubCategoryOf(ancestor : Category) : boolean`

Returns true if this category is a sub-category of the provided category.

### isTopLevel

**Signature:** `isTopLevel() : boolean`

Returns true if the category is a top level category, but not the root category.

### setDisplayMode

**Signature:** `setDisplayMode(displayMode : Number) : void`

Set the category's Variation Groups Display Mode.

### setSearchPlacement

**Signature:** `setSearchPlacement(placement : Number) : void`

Set the category's search placement.

### setSearchRank

**Signature:** `setSearchRank(rank : Number) : void`

Set the category's search rank.

## Method Detail

## Method Details

### getAllRecommendations

**Signature:** `getAllRecommendations() : Collection`

**Description:** Returns all outgoing recommendations for this category. The recommendations are sorted by their explicitly set order.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getAllRecommendations

**Signature:** `getAllRecommendations(type : Number) : Collection`

**Description:** Returns all outgoing recommendations for this category which are of the specified type. The recommendations are sorted by their explicitly set order.

**Parameters:**

- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getCategoryAssignments

**Signature:** `getCategoryAssignments() : Collection`

**Description:** Returns a collection of category assignments of the category.

**Returns:**

Collection of category assignments of the category.

---

### getDefaultSortingRule

**Signature:** `getDefaultSortingRule() : SortingRule`

**Description:** Returns the default sorting rule configured for this category, or null if there is no default rule to be applied for it. This method returns the default rule for the parent category if this category inherits one. The parent category may inherit its default rule from its parent, and so on, up to the root category. This method returns null if no ancestor category for this category has a default rule.

**Returns:**

the default SortingRule or null.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description of the catalog category for the current locale.

**Returns:**

The value of the property for the current locale, or null if it wasn't found.

---

### getDisplayMode

**Signature:** `getDisplayMode() : Number`

**Description:** Returns the Variation Groups Display Mode of the category or null if no display mode is defined.

**Returns:**

the value of the attribute 'displayMode' which is either DISPLAY_MODE_MERGED or DISPLAY_MODE_INDIVIDUAL or null if category is set to inherit the display mode.

---

### getDisplayName

**Signature:** `getDisplayName() : String`

**Description:** Returns the display name of the of the catalog category for the current locale. This value is intended to be used as the external visible name of the catalog category.

**Returns:**

The value of the property for the current locale, or null if it wasn't found.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the id of the category.

**Returns:**

the id of the category.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the image reference of this catalog category.

**Returns:**

the image reference for this category.

---

### getIncomingCategoryLinks

**Signature:** `getIncomingCategoryLinks() : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the target. If the source category of a link belongs to a different catalog than the catalog owning this category, it is not returned.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getIncomingCategoryLinks

**Signature:** `getIncomingCategoryLinks(type : Number) : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the target and which are of the specified type. If the source category of a link belongs to a different catalog than the catalog owning this category, it is not returned.

**Parameters:**

- `type`: the link type type.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getOnlineCategoryAssignments

**Signature:** `getOnlineCategoryAssignments() : Collection`

**Description:** Returns a collection of category assignments of the category where the referenced product is currently online. When checking the online status of the product, the online flag and the online from & to dates are taken into account. Online flag, online from & to dates set for the current site takes precedence over the default values.

**Returns:**

Collection of online category assignments of the category.

---

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

**Description:** Returns the online status flag of the category.

**Returns:**

the online status flag of the category.

---

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the date from which the category is online or valid.

**Returns:**

the date from which the category is online or valid.

---

### getOnlineIncomingCategoryLinks

**Signature:** `getOnlineIncomingCategoryLinks() : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the target. If the source category of a link belongs to a different catalog than the catalog owning this category, it is not returned. Additionally, this method will only return a link if the source category is currently online. A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getOnlineOutgoingCategoryLinks

**Signature:** `getOnlineOutgoingCategoryLinks() : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the source. If the target category of a link belongs to a different catalog than the catalog owning this category, it is not returned. Additionally, this method will only return a link if the target category is currently online. A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getOnlineProducts

**Signature:** `getOnlineProducts() : Collection`

**Description:** Returns online products assigned to this category. Offline products are not included in the returned collection. When checking the online status of the product, the online flag and the online from & to dates are taken into account. Online flag, online from & to dates set for the current site takes precedence over the default values. The order of products in the returned collection corresponds to the defined explicit sorting of products in this category.

**Returns:**

a sorted collection of online products of this category.

**See Also:**

hasOnlineProducts()

---

### getOnlineSubCategories

**Signature:** `getOnlineSubCategories() : Collection`

**Description:** Returns a sorted collection of currently online subcategories of this catalog category. A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes. The returned collection is sorted by position. Subcategories marked as "unsorted" always appear after those marked as "sorted" but are otherwise not in any guaranteed order. The returned collection contains direct subcategories only.

**Returns:**

a sorted collection of currently online subcategories.

**See Also:**

hasOnlineSubCategories()

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the date until which the category is online or valid.

**Returns:**

the date until which the category is online or valid.

---

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations() : Collection`

**Description:** Returns a list of outgoing recommendations for this category. This method behaves similarly to getRecommendations() but additionally filters out recommendations for which the target product is unorderable according to its product availability model.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

**See Also:**

ProductAvailabilityModel.isOrderable()

---

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations(type : Number) : Collection`

**Description:** Returns a list of outgoing recommendations for this category. This method behaves similarly to getRecommendations(Number) but additionally filters out recommendations for which the target product is unorderable according to its product availability model.

**Parameters:**

- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

**See Also:**

ProductAvailabilityModel.isOrderable()

---

### getOutgoingCategoryLinks

**Signature:** `getOutgoingCategoryLinks() : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the source. If the target category of a link belongs to a different catalog than the catalog owning this category, it is not returned. The collection of links is sorted by the explicitly defined order for this category with unsorted links appearing at the end.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getOutgoingCategoryLinks

**Signature:** `getOutgoingCategoryLinks(type : Number) : Collection`

**Description:** Returns the collection of CategoryLink objects for which this category is the source and which are of the specified type. If the target category of a link belongs to a different catalog than the catalog owning this category, it is not returned. The collection of links is sorted by the explicitly defined order for this category with unsorted links appearing at the end.

**Parameters:**

- `type`: the link type type.

**Returns:**

a collection of CategoryLink objects, possibly empty but not null.

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns the page description of this category for the default locale or null if not defined.

**Returns:**

the value of the attribute 'pageDescription'.

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the page keywords of this category for the default locale or null if not defined.

**Returns:**

the value of the attribute 'pageKeywords'.

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the page title of this category for the default locale or null if not defined.

**Returns:**

the value of the attribute 'pageTitle'.

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the page URL property of this category or null if not defined.

**Returns:**

the value of the attribute 'pageURL'.

---

### getParent

**Signature:** `getParent() : Category`

**Description:** Returns the parent of this category.

**Returns:**

a CatalogCategory instance representing the parent of this CatalogCategory or null.

---

### getProductAttributeModel

**Signature:** `getProductAttributeModel() : ProductAttributeModel`

**Description:** Returns this category's ProductAttributeModel, which makes access to the category's attribute information convenient. The model is calculated based on the attribute definitions assigned to this category and the global attribute definitions for the object type 'Product'.

**Returns:**

the ProductAttributeModel for this category.

---

### getProducts

**Signature:** `getProducts() : Collection`

**Description:** Returns all products assigned to this category. The order of products in the returned collection corresponds to the defined explicit sorting of products in this category.

**Returns:**

a sorted collection of all products of this category.

**See Also:**

getOnlineProducts()

---

### getRecommendations

**Signature:** `getRecommendations() : Collection`

**Description:** Returns the outgoing recommendations for this category. If this category is not in the site catalog, or there is no site catalog, an empty collection is returned. Only recommendations for which the target product exists and is assigned to the site catalog are returned. The recommendations are sorted by their explicitly set order.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

**Description:** Returns the outgoing recommendations for this category which are of the specified type. Behaves the same as getRecommendations() but additionally filters by recommendation type.

**Parameters:**

- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getSearchPlacement

**Signature:** `getSearchPlacement() : Number`

**Description:** Returns the search placement of the category or null of no search placement is defined.

**Returns:**

the value of the attribute 'searchPlacement'.

---

### getSearchRank

**Signature:** `getSearchRank() : Number`

**Description:** Returns the search rank of the category or null of no search rank is defined.

**Returns:**

the value of the attribute 'searchRank'.

---

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

**Description:** Returns the category's sitemap change frequency.

**Returns:**

the value of the attribute 'siteMapChangeFrequency'.

---

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

**Description:** Returns the category's sitemap inclusion.

**Returns:**

the value of the attribute 'siteMapIncluded'.

---

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

**Description:** Returns the category's sitemap priority.

**Returns:**

the value of the attribute 'siteMapPriority'.

---

### getSubCategories

**Signature:** `getSubCategories() : Collection`

**Description:** Returns a sorted collection of the subcategories of this catalog category, including both online and offline subcategories. The returned collection is sorted by position. Subcategories marked as "unsorted" always appear after those marked as "sorted" but are otherwise not in any guaranteed order. The returned collection contains direct subcategories only.

**Returns:**

a sorted collection of the subcategories.

**See Also:**

getOnlineSubCategories()

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the template property value , which is the file name of the template used to display the catalog category.

**Returns:**

the value of the property 'template'.

---

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

**Description:** Returns the thumbnail image reference of this catalog category.

**Returns:**

the thumbnail image reference for this category.

---

### hasOnlineProducts

**Signature:** `hasOnlineProducts() : boolean`

**Description:** Returns true if this catalog category has any online products assigned. When checking the online status of the product, the online flag and the online from & to dates are taken into account. Online flag, online from & to dates set for the current site takes precedence over the default values.

**Returns:**

true, if this category has at least one online product assigned, false otherwise.

**See Also:**

getOnlineProducts()

---

### hasOnlineSubCategories

**Signature:** `hasOnlineSubCategories() : boolean`

**Description:** Returns true if this catalog category has any online subcategories. A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes. Only direct subcategories are considered.

**Returns:**

true, if this category has at least one online subcategory, false otherwise.

**See Also:**

getOnlineSubCategories()

---

### isDirectSubCategoryOf

**Signature:** `isDirectSubCategoryOf(parent : Category) : boolean`

**Description:** Returns true if this category is a direct sub-category of the provided category.

**Parameters:**

- `parent`: The parent category, must not be null.

**Returns:**

True if this category is a direct sub-category of parent, false otherwise.

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Returns the value indicating whether the catalog category is "currently online". A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes.

**Returns:**

true if the category is currently online, false otherwise.

---

### isRoot

**Signature:** `isRoot() : boolean`

**Description:** Identifies if the category is the root category of its catalog.

**Returns:**

'true' if the category is the root category of its catalog, 'false' otherwise.

---

### isSubCategoryOf

**Signature:** `isSubCategoryOf(ancestor : Category) : boolean`

**Description:** Returns true if this category is a sub-category of the provided category. This can be either a direct or an indirect sub-category.

**Parameters:**

- `ancestor`: The ancestor category, must not be null.

**Returns:**

true if this category is a sub-category of ancestor, false otherwise.

---

### isTopLevel

**Signature:** `isTopLevel() : boolean`

**Description:** Returns true if the category is a top level category, but not the root category.

**Returns:**

True if the category is a direct sub-category of the root category, false otherwise.

---

### setDisplayMode

**Signature:** `setDisplayMode(displayMode : Number) : void`

**Description:** Set the category's Variation Groups Display Mode.

**Parameters:**

- `displayMode`: The category's variation groups display mode which is either DISPLAY_MODE_MERGED or DISPLAY_MODE_INDIVIDUAL or null if category is set to inherit the display mode.

---

### setSearchPlacement

**Signature:** `setSearchPlacement(placement : Number) : void`

**Description:** Set the category's search placement.

**Parameters:**

- `placement`: The category's search placement.

---

### setSearchRank

**Signature:** `setSearchRank(rank : Number) : void`

**Description:** Set the category's search rank.

**Parameters:**

- `rank`: The category's search rank.

---
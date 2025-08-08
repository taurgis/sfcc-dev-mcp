## Package: dw.catalog

# Class Product

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.catalog.Product

## Description

Represents a product in Commerce Cloud Digital. Products are identified by a unique product ID, sometimes called the SKU. There are several different types of product: Simple product Master products: This type of product defines a template for a set of related products which differ only by a set of defined "variation attributes", such as size or color. Master products are not orderable themselves. The variation information for a master product is available through its ProductVariationModel. Variant: Variants are the actual orderable products that are related to a master product. Each variant of a master product has a unique set of values for the defined variation attributes. Variants are said to be "mastered" by the corresponding master product. Option products: Option products define additional options, such as a warranty, which can be purchased for a defined price at the time the product is purchased. The option information for an option product is available through its ProductOptionModel. Product-sets: A product-set is a set of products which the merchant can sell as a collection in the storefront, for example an outfit of clothes. Product-sets are not orderable and therefore do not define prices. They exist only to group the products together in the storefront UI. Members of the set are called "product-set-products". Products bundles: A collection of products which can be ordered as a single unit and therefore can define its own price and inventory record. Product price and availability information are retrievable through getPriceModel() and getAvailabilityModel() respectively. Attribute information is retrievable through getAttributeModel(). Products may reference other products, either as recommendations or product links. This class provides the methods for retrieving these referenced products. Products belong to a catalog (the "owning" catalog) and are assigned to categories in other catalogs. Products assigned to categories in the site catalog are typically orderable on the site. Any API method which returns products will return an instance of a Variant for variant products. This subclass contains methods which are specific to this type of product.

## Properties

### activeData

**Type:** ProductActiveData (Read Only)

The active data for this product, for the current site.

### allCategories

**Type:** Collection (Read Only)

A collection of all categories to which this product is assigned.

### allCategoryAssignments

**Type:** Collection (Read Only)

All category assignments for this product in any catalog.

### allIncomingProductLinks

**Type:** Collection (Read Only)

All incoming ProductLinks.

### allProductLinks

**Type:** Collection (Read Only)

All outgoing ProductLinks.

### assignedToSiteCatalog

**Type:** boolean (Read Only)

Returns true if the product is assigned to the current site (via the site catalog), otherwise
 false is returned.
 
 In case of the product being a variant, the variant will be considered as assigned if its master, one of the
 variation groups it is in or itself is assigned to the site catalog. In case this is triggered for a variation
 group the variation group is considered as assigned if its master or itself is assigned.

### attributeModel

**Type:** ProductAttributeModel (Read Only)

Returns this product's ProductAttributeModel, which makes access to the
 product attribute information convenient. The model is calculated based
 on the product attributes assigned to this product's classification
 category (or any of it's ancestors) and the global attribute definitions
 for the system object type 'Product'. If this product has no
 classification category, the attribute model is calculated on the global
 attribute definitions only. If this product is a variant, then the
 attribute model is calculated based on the classification category of its
 corresponding master product.

### availabilityModel

**Type:** ProductAvailabilityModel (Read Only)

The availability model, which can be used to determine availability
 information for a product.

### available

**Type:** boolean (Read Only)

Identifies if the product is available.

### availableFlag

**Type:** boolean

Identifies if the product is available.

### brand

**Type:** String (Read Only)

The Brand of the product.

### bundle

**Type:** boolean (Read Only)

Identifies if this product instance is a product bundle.

### bundled

**Type:** boolean (Read Only)

Identifies if this product instance is bundled within at least one
 product bundle.

### bundledProducts

**Type:** Collection (Read Only)

A collection containing all products that participate in the
 product bundle.

### bundles

**Type:** Collection (Read Only)

A collection of all bundles in which this product is included.
 The method only returns bundles assigned to the current site.

### categories

**Type:** Collection (Read Only)

A collection of all categories to which this product is assigned
 and which are also available through the current site.

### categorized

**Type:** boolean (Read Only)

Identifies if this product is bound to at least one catalog category.

### categoryAssignments

**Type:** Collection (Read Only)

A collection of category assignments for this product in
 the current site catalog.

### classificationCategory

**Type:** Category (Read Only)

The classification category associated with this Product. A
 product has a single classification category which may or may not be in
 the site catalog. The classification category defines the attribute set
 of the product. See getAttributeModel() for
 how the classification category is used.

### EAN

**Type:** String (Read Only)

The European Article Number of the product.

### facebookEnabled

**Type:** boolean (Read Only)

Identifies if the product is Facebook enabled.

### ID

**Type:** String (Read Only)

The ID of the product.

### image

**Type:** MediaFile (Read Only)

The product's image.

### incomingProductLinks

**Type:** Collection (Read Only)

Returns incoming ProductLinks, where the source product is a site product.

### longDescription

**Type:** MarkupText (Read Only)

The product's long description in the current locale.

### manufacturerName

**Type:** String (Read Only)

The name of the product manufacturer.

### manufacturerSKU

**Type:** String (Read Only)

The value of the manufacturer's stock keeping unit.

### master

**Type:** boolean (Read Only)

Identifies if this product instance is a product master.

### minOrderQuantity

**Type:** Quantity (Read Only)

The minimum order quantity for this product.

### name

**Type:** String (Read Only)

The name of the product in the current locale.

### online

**Type:** boolean (Read Only)

The online status of the product. The online status
 is calculated from the online status flag and the onlineFrom
 onlineTo dates defined for the product.

### onlineCategories

**Type:** Collection (Read Only)

A collection of all currently online categories to which this
 product is assigned and which are also available through the current
 site. A category is currently online if its online flag equals true and
 the current site date is within the date range defined by the onlineFrom
 and onlineTo attributes.

### onlineFlag

**Type:** boolean (Read Only)

The online status flag of the product.

### onlineFrom

**Type:** Date (Read Only)

The date from which the product is online or valid.

### onlineTo

**Type:** Date (Read Only)

The date until which the product is online or valid.

### optionModel

**Type:** ProductOptionModel (Read Only)

The product's option model. The option values selections are
 initialized with the values defined for the product, or the default values
 defined for the option.

### optionProduct

**Type:** boolean (Read Only)

Identifies if the product has options.

### orderableRecommendations

**Type:** Collection (Read Only)

A list of outgoing recommendations for this product. This method
 behaves similarly to getRecommendations() but additionally filters out
 recommendations for which the target product is unorderable according to
 its product availability model.

### pageDescription

**Type:** String (Read Only)

Returns product's page description in the default locale.

### pageKeywords

**Type:** String (Read Only)

The product's page keywords in the default locale.

### pageMetaTags

**Type:** Array (Read Only)

All page meta tags, defined for this instance for which content can be generated.
 
 The meta tag content is generated based on the product detail page meta tag context and rules. The rules are
 obtained from the current product context or inherited from variation groups, master product, the primary
 category, up to the root category.

### pageTitle

**Type:** String (Read Only)

The product's page title in the default locale.

### pageURL

**Type:** String (Read Only)

The product's page URL in the default locale.

### pinterestEnabled

**Type:** boolean (Read Only)

Identifies if the product is Pinterest enabled.

### priceModel

**Type:** ProductPriceModel (Read Only)

The price model, which can be used to retrieve a price
 for this product.

### primaryCategory

**Type:** Category (Read Only)

The primary category of the product within the current site catalog.

### primaryCategoryAssignment

**Type:** CategoryAssignment (Read Only)

The category assignment to the primary category in the current site
 catalog or null if no primary category is defined within the current site
 catalog.

### product

**Type:** boolean (Read Only)

Returns 'true' if the instance represents a product. Returns 'false' if
 the instance represents a product set.

### productLinks

**Type:** Collection (Read Only)

All outgoing ProductLinks, where the target product is also
 available in the current site. The ProductLinks are unsorted.

### productSet

**Type:** boolean (Read Only)

Returns 'true' if the instance represents a product set, otherwise 'false'.

### productSetProduct

**Type:** boolean (Read Only)

Returns true if this product is part of any product set, otherwise false.

### productSetProducts

**Type:** Collection (Read Only)

A collection of all products which are assigned to this product
 and which are also available through the current site.  If this product
 does not represent a product set then an empty collection will be
 returned.

### productSets

**Type:** Collection (Read Only)

A collection of all product sets in which this product is included.
 The method only returns product sets assigned to the current site.

### recommendations

**Type:** Collection (Read Only)

The outgoing recommendations for this product which
 belong to the site catalog.  If this product is not assigned to the site
 catalog, or there is no site catalog, an empty collection is returned.
 Only recommendations for which the target product exists and is assigned
 to the site catalog are returned.  The recommendations are sorted by
 their explicitly set order.

### retailSet

**Type:** boolean (Read Only)

Identifies if this product instance is part of a retail set.

### searchable

**Type:** boolean (Read Only)

Identifies if the product is searchable.

### searchableFlag

**Type:** boolean (Read Only)

Returns, whether the product is currently searchable.

### searchableIfUnavailableFlag

**Type:** Product (Read Only)

The searchable status of the Product if unavailable.

 Besides true or false, the return value null indicates that the value is not set.

### searchPlacement

**Type:** Number (Read Only)

The product's search placement classification. The higher the
 numeric product placement value, the more relevant is the product when
 sorting search results. The range of numeric placement values is
 defined in the meta data of object type 'Product' and can therefore be
 customized.

### searchRank

**Type:** Number (Read Only)

The product's search rank. The higher the numeric product rank,
 the more relevant is the product when sorting search results. The range of
 numeric rank values is defined in the meta data of object type 'Product'
 and can therefore be customized.

### shortDescription

**Type:** MarkupText (Read Only)

The product's short description in the current locale.

### siteMapChangeFrequency

**Type:** String (Read Only)

The product's change frequency needed for the sitemap creation.

### siteMapIncluded

**Type:** Number (Read Only)

The status if the product is included into the sitemap.

### siteMapPriority

**Type:** Number (Read Only)

The product's priority needed for the sitemap creation.

### siteProduct

**Type:** boolean (Read Only)

Returns 'true' if the product is assigned to the current site (via the
 site catalog), otherwise 'false' is returned.

### stepQuantity

**Type:** Quantity (Read Only)

The steps in which the order amount of the product can be
 increased.

### storeReceiptName

**Type:** String (Read Only)

The store receipt name of the product in the current locale.

### storeTaxClass

**Type:** String (Read Only)

The store tax class ID.
 This is an optional override for in-store tax calculation.

### taxClassID

**Type:** String (Read Only)

The ID of the product's tax class, by resolving
 the Global Preference setting selected. If the Localized
 Tax Class setting under Global Preferences -> Products is
 selected, the localizedTaxClassID attribute value will be
 returned, else the legacy taxClassID attribute value will
 be returned.

### template

**Type:** String (Read Only)

The name of the product's rendering template.

### thumbnail

**Type:** MediaFile (Read Only)

The product's thumbnail image.

### unit

**Type:** String (Read Only)

The product's sales unit.

### unitQuantity

**Type:** Quantity (Read Only)

The product's unit quantity.

### UPC

**Type:** String (Read Only)

The Universal Product Code of the product.

### variant

**Type:** boolean (Read Only)

Identifies if this product instance is mastered by a product master.

### variants

**Type:** Collection (Read Only)

A collection of all variants assigned to this variation master
 or variation group product. All variants are returned regardless of whether
 they are online or offline.

 If this product does not represent a variation master or variation group
 product then an empty collection is returned.

### variationGroup

**Type:** boolean (Read Only)

Identifies if this product instance is a variation group product.

### variationGroups

**Type:** Collection (Read Only)

A collection of all variation groups assigned to this variation
 master product. All variation groups are returned regardless of whether
 they are online or offline.

 If this product does not represent a variation master product then an
 empty collection is returned.

### variationModel

**Type:** ProductVariationModel (Read Only)

The variation model of this product. If this product is a master
 product, then the returned model will encapsulate all the information
 about its variation attributes and variants. If this product is a variant
 product, then the returned model will encapsulate all the same
 information, but additionally pre-select all the variation attribute
 values of this variant. (See ProductVariationModel for
 details on what "selected" means.) If this product is neither a master
 product or a variation product, then a model will be returned but will be
 essentially empty and not useful for any particular purpose.

## Constructor Summary

## Method Summary

### assignedToCategory

**Signature:** `assignedToCategory(category : Category) : boolean`

Identifies if this product is bound to the specified catalog category.

### getActiveData

**Signature:** `getActiveData() : ProductActiveData`

Returns the active data for this product, for the current site.

### getAllCategories

**Signature:** `getAllCategories() : Collection`

Returns a collection of all categories to which this product is assigned.

### getAllCategoryAssignments

**Signature:** `getAllCategoryAssignments() : Collection`

Returns all category assignments for this product in any catalog.

### getAllIncomingProductLinks

**Signature:** `getAllIncomingProductLinks() : Collection`

Returns all incoming ProductLinks.

### getAllIncomingProductLinks

**Signature:** `getAllIncomingProductLinks(type : Number) : Collection`

Returns all incoming ProductLinks of a specific type.

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

Returns all outgoing ProductLinks.

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

Returns all outgoing ProductLinks of a specific type.

### getAllRecommendations

**Signature:** `getAllRecommendations(catalog : Catalog) : Collection`

Returns the outgoing recommendations for this product which belong to the specified catalog.

### getAllRecommendations

**Signature:** `getAllRecommendations(catalog : Catalog, type : Number) : Collection`

Returns the outgoing recommendations for this product which are of the specified type and which belong to the specified catalog.

### getAttributeModel

**Signature:** `getAttributeModel() : ProductAttributeModel`

Returns this product's ProductAttributeModel, which makes access to the product attribute information convenient.

### getAvailabilityModel

**Signature:** `getAvailabilityModel() : ProductAvailabilityModel`

Returns the availability model, which can be used to determine availability information for a product.

### getAvailabilityModel

**Signature:** `getAvailabilityModel(list : ProductInventoryList) : ProductAvailabilityModel`

Returns the availability model of the given inventory list, which can be used to determine availability information for a product.

### getAvailableFlag

**Signature:** `getAvailableFlag() : boolean`

Identifies if the product is available.

### getBrand

**Signature:** `getBrand() : String`

Returns the Brand of the product.

### getBundledProductQuantity

**Signature:** `getBundledProductQuantity(aProduct : Product) : Quantity`

Returns the quantity of the specified product within the bundle.

### getBundledProducts

**Signature:** `getBundledProducts() : Collection`

Returns a collection containing all products that participate in the product bundle.

### getBundles

**Signature:** `getBundles() : Collection`

Returns a collection of all bundles in which this product is included.

### getCategories

**Signature:** `getCategories() : Collection`

Returns a collection of all categories to which this product is assigned and which are also available through the current site.

### getCategoryAssignment

**Signature:** `getCategoryAssignment(category : Category) : CategoryAssignment`

Returns the category assignment for a specific category.

### getCategoryAssignments

**Signature:** `getCategoryAssignments() : Collection`

Returns a collection of category assignments for this product in the current site catalog.

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

Returns the classification category associated with this Product.

### getEAN

**Signature:** `getEAN() : String`

Returns the European Article Number of the product.

### getID

**Signature:** `getID() : String`

Returns the ID of the product.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the product's image.

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

The method calls getImages(String) and returns the image at the specific index.

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

The method calls getImages(String) and returns the first image.

### getImages

**Signature:** `getImages(viewtype : String) : List`

Returns all images assigned to this product for a specific view type, e.g.

### getIncomingProductLinks

**Signature:** `getIncomingProductLinks() : Collection`

Returns incoming ProductLinks, where the source product is a site product.

### getIncomingProductLinks

**Signature:** `getIncomingProductLinks(type : Number) : Collection`

Returns incoming ProductLinks, where the source product is a site product of a specific type.

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

Returns the product's long description in the current locale.

### getManufacturerName

**Signature:** `getManufacturerName() : String`

Returns the name of the product manufacturer.

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

Returns the value of the manufacturer's stock keeping unit.

### getMinOrderQuantity

**Signature:** `getMinOrderQuantity() : Quantity`

Returns the minimum order quantity for this product.

### getName

**Signature:** `getName() : String`

Returns the name of the product in the current locale.

### getOnlineCategories

**Signature:** `getOnlineCategories() : Collection`

Returns a collection of all currently online categories to which this product is assigned and which are also available through the current site.

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

Returns the online status flag of the product.

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the date from which the product is online or valid.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the date until which the product is online or valid.

### getOptionModel

**Signature:** `getOptionModel() : ProductOptionModel`

Returns the product's option model.

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations() : Collection`

Returns a list of outgoing recommendations for this product.

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations(type : Number) : Collection`

Returns a list of outgoing recommendations for this product.

### getPageDescription

**Signature:** `getPageDescription() : String`

Returns product's page description in the default locale.

### getPageKeywords

**Signature:** `getPageKeywords() : String`

Returns the product's page keywords in the default locale.

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

Returns the page meta tag for the specified id.

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

Returns all page meta tags, defined for this instance for which content can be generated.

### getPageTitle

**Signature:** `getPageTitle() : String`

Returns the product's page title in the default locale.

### getPageURL

**Signature:** `getPageURL() : String`

Returns the product's page URL in the default locale.

### getPriceModel

**Signature:** `getPriceModel() : ProductPriceModel`

Returns the price model, which can be used to retrieve a price for this product.

### getPriceModel

**Signature:** `getPriceModel(optionModel : ProductOptionModel) : ProductPriceModel`

Returns the price model based on the specified optionModel.

### getPrimaryCategory

**Signature:** `getPrimaryCategory() : Category`

Returns the primary category of the product within the current site catalog.

### getPrimaryCategoryAssignment

**Signature:** `getPrimaryCategoryAssignment() : CategoryAssignment`

Returns the category assignment to the primary category in the current site catalog or null if no primary category is defined within the current site catalog.

### getProductLinks

**Signature:** `getProductLinks() : Collection`

Returns all outgoing ProductLinks, where the target product is also available in the current site.

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

Returns all outgoing ProductLinks of a specific type, where the target product is also available in the current site.

### getProductSetProducts

**Signature:** `getProductSetProducts() : Collection`

Returns a collection of all products which are assigned to this product and which are also available through the current site.

### getProductSets

**Signature:** `getProductSets() : Collection`

Returns a collection of all product sets in which this product is included.

### getRecommendations

**Signature:** `getRecommendations() : Collection`

Returns the outgoing recommendations for this product which belong to the site catalog.

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

Returns the outgoing recommendations for this product which are of the specified type and which belong to the site catalog.

### getSearchableFlag

**Signature:** `getSearchableFlag() : boolean`

Returns, whether the product is currently searchable.

### getSearchableIfUnavailableFlag

**Signature:** `getSearchableIfUnavailableFlag() : boolean`

Returns the searchable status of the Product if unavailable.

### getSearchPlacement

**Signature:** `getSearchPlacement() : Number`

Returns the product's search placement classification.

### getSearchRank

**Signature:** `getSearchRank() : Number`

Returns the product's search rank.

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

Returns the product's short description in the current locale.

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

Returns the product's change frequency needed for the sitemap creation.

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

Returns the status if the product is included into the sitemap.

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

Returns the product's priority needed for the sitemap creation.

### getStepQuantity

**Signature:** `getStepQuantity() : Quantity`

Returns the steps in which the order amount of the product can be increased.

### getStoreReceiptName

**Signature:** `getStoreReceiptName() : String`

Returns the store receipt name of the product in the current locale.

### getStoreTaxClass

**Signature:** `getStoreTaxClass() : String`

Returns the store tax class ID.

### getTaxClassID

**Signature:** `getTaxClassID() : String`

Returns the ID of the product's tax class, by resolving the Global Preference setting selected.

### getTemplate

**Signature:** `getTemplate() : String`

Returns the name of the product's rendering template.

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

Returns the product's thumbnail image.

### getUnit

**Signature:** `getUnit() : String`

Returns the product's sales unit.

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

Returns the product's unit quantity.

### getUPC

**Signature:** `getUPC() : String`

Returns the Universal Product Code of the product.

### getVariants

**Signature:** `getVariants() : Collection`

Returns a collection of all variants assigned to this variation master or variation group product.

### getVariationGroups

**Signature:** `getVariationGroups() : Collection`

Returns a collection of all variation groups assigned to this variation master product.

### getVariationModel

**Signature:** `getVariationModel() : ProductVariationModel`

Returns the variation model of this product.

### includedInBundle

**Signature:** `includedInBundle(product : Product) : boolean`

Identifies if the specified product participates in this product bundle.

### isAssignedToCategory

**Signature:** `isAssignedToCategory(category : Category) : boolean`

Returns 'true' if item is assigned to the specified category.

### isAssignedToSiteCatalog

**Signature:** `isAssignedToSiteCatalog() : boolean`

Returns true if the product is assigned to the current site (via the site catalog), otherwise false is returned.

### isAvailable

**Signature:** `isAvailable() : boolean`

Identifies if the product is available.

### isBundle

**Signature:** `isBundle() : boolean`

Identifies if this product instance is a product bundle.

### isBundled

**Signature:** `isBundled() : boolean`

Identifies if this product instance is bundled within at least one product bundle.

### isCategorized

**Signature:** `isCategorized() : boolean`

Identifies if this product is bound to at least one catalog category.

### isFacebookEnabled

**Signature:** `isFacebookEnabled() : boolean`

Identifies if the product is Facebook enabled.

### isMaster

**Signature:** `isMaster() : boolean`

Identifies if this product instance is a product master.

### isOnline

**Signature:** `isOnline() : boolean`

Returns the online status of the product.

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

Identifies if the product has options.

### isPinterestEnabled

**Signature:** `isPinterestEnabled() : boolean`

Identifies if the product is Pinterest enabled.

### isProduct

**Signature:** `isProduct() : boolean`

Returns 'true' if the instance represents a product.

### isProductSet

**Signature:** `isProductSet() : boolean`

Returns 'true' if the instance represents a product set, otherwise 'false'.

### isProductSetProduct

**Signature:** `isProductSetProduct() : boolean`

Returns true if this product is part of any product set, otherwise false.

### isRetailSet

**Signature:** `isRetailSet() : boolean`

Identifies if this product instance is part of a retail set.

### isSearchable

**Signature:** `isSearchable() : boolean`

Identifies if the product is searchable.

### isSiteProduct

**Signature:** `isSiteProduct() : boolean`

Returns 'true' if the product is assigned to the current site (via the site catalog), otherwise 'false' is returned.

### isVariant

**Signature:** `isVariant() : boolean`

Identifies if this product instance is mastered by a product master.

### isVariationGroup

**Signature:** `isVariationGroup() : boolean`

Identifies if this product instance is a variation group product.

### setAvailableFlag

**Signature:** `setAvailableFlag(available : boolean) : void`

Set the availability status flag of the product.

### setOnlineFlag

**Signature:** `setOnlineFlag(online : boolean) : void`

Set the online status flag of the product for the current site.

### setSearchableFlag

**Signature:** `setSearchableFlag(searchable : boolean) : void`

Set the flag indicating whether the product is searchable or not in context of the current site.

### setSearchPlacement

**Signature:** `setSearchPlacement(placement : Number) : void`

Set the product's search placement classification in context of the current site.

### setSearchRank

**Signature:** `setSearchRank(rank : Number) : void`

Set the product's search rank in context of the current site.

## Method Detail

## Method Details

### assignedToCategory

**Signature:** `assignedToCategory(category : Category) : boolean`

**Description:** Identifies if this product is bound to the specified catalog category.

**Deprecated:**

Use isAssignedToCategory(Category)

**Parameters:**

- `category`: the CatalogCategory to check.

**Returns:**

true if the product is bound to the CatalogCategory, false otherwise.

---

### getActiveData

**Signature:** `getActiveData() : ProductActiveData`

**Description:** Returns the active data for this product, for the current site.

**Returns:**

the active data for this product for the current site.

---

### getAllCategories

**Signature:** `getAllCategories() : Collection`

**Description:** Returns a collection of all categories to which this product is assigned.

**Returns:**

Collection of categories.

---

### getAllCategoryAssignments

**Signature:** `getAllCategoryAssignments() : Collection`

**Description:** Returns all category assignments for this product in any catalog.

**Returns:**

Collection of category assignments of the product in any catalog.

---

### getAllIncomingProductLinks

**Signature:** `getAllIncomingProductLinks() : Collection`

**Description:** Returns all incoming ProductLinks.

**Returns:**

a collection of all incoming ProductLinks.

---

### getAllIncomingProductLinks

**Signature:** `getAllIncomingProductLinks(type : Number) : Collection`

**Description:** Returns all incoming ProductLinks of a specific type.

**Parameters:**

- `type`: the type of ProductLinks to use.

**Returns:**

a collection of all incoming ProductLinks of a specific type.

---

### getAllProductLinks

**Signature:** `getAllProductLinks() : Collection`

**Description:** Returns all outgoing ProductLinks.

**Returns:**

a collection of all outgoing ProductLinks.

---

### getAllProductLinks

**Signature:** `getAllProductLinks(type : Number) : Collection`

**Description:** Returns all outgoing ProductLinks of a specific type.

**Parameters:**

- `type`: the type of ProductLinks to fetch.

**Returns:**

a collection of all outgoing ProductLinks of a specific type.

---

### getAllRecommendations

**Signature:** `getAllRecommendations(catalog : Catalog) : Collection`

**Description:** Returns the outgoing recommendations for this product which belong to the specified catalog. The recommendations are sorted by their explicitly set order.

**Parameters:**

- `catalog`: the catalog containing the recommendations.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getAllRecommendations

**Signature:** `getAllRecommendations(catalog : Catalog, type : Number) : Collection`

**Description:** Returns the outgoing recommendations for this product which are of the specified type and which belong to the specified catalog. The recommendations are sorted by their explicitly set order.

**Parameters:**

- `catalog`: the catalog containing the recommendations.
- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getAttributeModel

**Signature:** `getAttributeModel() : ProductAttributeModel`

**Description:** Returns this product's ProductAttributeModel, which makes access to the product attribute information convenient. The model is calculated based on the product attributes assigned to this product's classification category (or any of it's ancestors) and the global attribute definitions for the system object type 'Product'. If this product has no classification category, the attribute model is calculated on the global attribute definitions only. If this product is a variant, then the attribute model is calculated based on the classification category of its corresponding master product.

**Returns:**

the ProductAttributeModel for this product.

---

### getAvailabilityModel

**Signature:** `getAvailabilityModel() : ProductAvailabilityModel`

**Description:** Returns the availability model, which can be used to determine availability information for a product.

**Returns:**

the availability model for a product.

---

### getAvailabilityModel

**Signature:** `getAvailabilityModel(list : ProductInventoryList) : ProductAvailabilityModel`

**Description:** Returns the availability model of the given inventory list, which can be used to determine availability information for a product.

**Parameters:**

- `list`: The inventory list to get the availability model for. Must not be null or an exception will be raised.

**Returns:**

the availability model of the given inventory list for a product.

---

### getAvailableFlag

**Signature:** `getAvailableFlag() : boolean`

**Description:** Identifies if the product is available.

**Deprecated:**

Use getAvailabilityModel() instead.

**Returns:**

the availability status flag of the product.

---

### getBrand

**Signature:** `getBrand() : String`

**Description:** Returns the Brand of the product.

**Returns:**

the Brand of the product.

---

### getBundledProductQuantity

**Signature:** `getBundledProductQuantity(aProduct : Product) : Quantity`

**Description:** Returns the quantity of the specified product within the bundle. If the specified product is not part of the bundle, a 0 quantity is returned.

**Parameters:**

- `aProduct`: The product to determine the quantity for.

**Returns:**

The quantity of the product within the bundle or 0 if the product is not part of the bundle.

---

### getBundledProducts

**Signature:** `getBundledProducts() : Collection`

**Description:** Returns a collection containing all products that participate in the product bundle.

**Returns:**

A collection containing all products of the product bundle.

---

### getBundles

**Signature:** `getBundles() : Collection`

**Description:** Returns a collection of all bundles in which this product is included. The method only returns bundles assigned to the current site.

**Returns:**

Collection of bundles in which this product is included, possibly empty.

---

### getCategories

**Signature:** `getCategories() : Collection`

**Description:** Returns a collection of all categories to which this product is assigned and which are also available through the current site.

**Returns:**

Collection of categories to which this product is assigned and which are also available through the current site.

---

### getCategoryAssignment

**Signature:** `getCategoryAssignment(category : Category) : CategoryAssignment`

**Description:** Returns the category assignment for a specific category.

**Parameters:**

- `category`: the category to use when fetching assignments.

**Returns:**

The category assignment for a specific category.

---

### getCategoryAssignments

**Signature:** `getCategoryAssignments() : Collection`

**Description:** Returns a collection of category assignments for this product in the current site catalog.

**Returns:**

Collection of category assignments.

---

### getClassificationCategory

**Signature:** `getClassificationCategory() : Category`

**Description:** Returns the classification category associated with this Product. A product has a single classification category which may or may not be in the site catalog. The classification category defines the attribute set of the product. See getAttributeModel() for how the classification category is used.

**Returns:**

the associated classification Category, or null if none is associated.

---

### getEAN

**Signature:** `getEAN() : String`

**Description:** Returns the European Article Number of the product.

**Returns:**

the European Article Number of the product.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of the product.

**Returns:**

ID of the product.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the product's image.

**Deprecated:**

Commerce Cloud Digital introduces a new more powerful product image management. It allows to group product images by self-defined view types (e.g. 'large', 'thumbnail', 'swatch') and variation values (e.g. for attribute color 'red', 'blue'). Images can be annotated with pattern based title and alt. Product images can be accessed from Digital locations or external storage locations. Please use the new product image management. Therefore you have to set up the common product image settings like view types, image location, default image alt and title for your catalogs first. After that you can group your product images by the previously defined view types in context of a product. Finally use getImages(String) and getImage(String, Number) to access your images.

**Returns:**

the product's image.

---

### getImage

**Signature:** `getImage(viewtype : String, index : Number) : MediaFile`

**Description:** The method calls getImages(String) and returns the image at the specific index. If no image for specified index is available the method returns null.

**Parameters:**

- `viewtype`: the view type annotated to image
- `index`: the index number of the image within image list

**Returns:**

the MediaFile or null

**Throws:**

NullArgumentException - if viewtype is null

---

### getImage

**Signature:** `getImage(viewtype : String) : MediaFile`

**Description:** The method calls getImages(String) and returns the first image. If no image is available the method returns null. When called for a variant with defined images for specified view type the method returns the first image. When called for a variant without defined images for specified view type the method returns the first master product image. If no master product images are defined, the method returns null.

**Parameters:**

- `viewtype`: the view type annotated to image

**Returns:**

the MediaFile or null

**Throws:**

NullArgumentException - if viewtype is null

---

### getImages

**Signature:** `getImages(viewtype : String) : List`

**Description:** Returns all images assigned to this product for a specific view type, e.g. all 'thumbnail' images. The images are returned in the order of their index number ascending. When called for a master the method returns the images specific to the master, which are typically the fall back images.

**Parameters:**

- `viewtype`: the view type annotated to images

**Returns:**

a list of MediaFile objects, possibly empty

**Throws:**

NullArgumentException - if viewtype is null

---

### getIncomingProductLinks

**Signature:** `getIncomingProductLinks() : Collection`

**Description:** Returns incoming ProductLinks, where the source product is a site product.

**Returns:**

a collection of incoming ProductLinks, where the source product is a site product.

---

### getIncomingProductLinks

**Signature:** `getIncomingProductLinks(type : Number) : Collection`

**Description:** Returns incoming ProductLinks, where the source product is a site product of a specific type.

**Parameters:**

- `type`: the type of ProductLinks to fetch.

**Returns:**

a collection of incoming ProductLinks, where the source product is a site product of a specific type.

---

### getLongDescription

**Signature:** `getLongDescription() : MarkupText`

**Description:** Returns the product's long description in the current locale.

**Returns:**

The product's long description in the current locale, or null if it wasn't found.

---

### getManufacturerName

**Signature:** `getManufacturerName() : String`

**Description:** Returns the name of the product manufacturer.

**Returns:**

the name of the product manufacturer.

---

### getManufacturerSKU

**Signature:** `getManufacturerSKU() : String`

**Description:** Returns the value of the manufacturer's stock keeping unit.

**Returns:**

the value of the manufacturer's stock keeping unit.

---

### getMinOrderQuantity

**Signature:** `getMinOrderQuantity() : Quantity`

**Description:** Returns the minimum order quantity for this product.

**Returns:**

the minimum order quantity of the product.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the product in the current locale.

**Returns:**

The name of the product for the current locale, or null if it wasn't found.

---

### getOnlineCategories

**Signature:** `getOnlineCategories() : Collection`

**Description:** Returns a collection of all currently online categories to which this product is assigned and which are also available through the current site. A category is currently online if its online flag equals true and the current site date is within the date range defined by the onlineFrom and onlineTo attributes.

**Returns:**

Collection of currently online categories to which this product is assigned and which are also available through the current site.

---

### getOnlineFlag

**Signature:** `getOnlineFlag() : boolean`

**Description:** Returns the online status flag of the product.

**Returns:**

the online status flag of the product.

---

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the date from which the product is online or valid.

**Returns:**

the date from which the product is online or valid.

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the date until which the product is online or valid.

**Returns:**

the date until which the product is online or valid.

---

### getOptionModel

**Signature:** `getOptionModel() : ProductOptionModel`

**Description:** Returns the product's option model. The option values selections are initialized with the values defined for the product, or the default values defined for the option.

**Returns:**

the products option model.

---

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations() : Collection`

**Description:** Returns a list of outgoing recommendations for this product. This method behaves similarly to getRecommendations() but additionally filters out recommendations for which the target product is unorderable according to its product availability model.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

**See Also:**

ProductAvailabilityModel.isOrderable()

---

### getOrderableRecommendations

**Signature:** `getOrderableRecommendations(type : Number) : Collection`

**Description:** Returns a list of outgoing recommendations for this product. This method behaves similarly to getRecommendations(Number) but additionally filters out recommendations for which the target product is unorderable according to its product availability model.

**Parameters:**

- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

**See Also:**

ProductAvailabilityModel.isOrderable()

---

### getPageDescription

**Signature:** `getPageDescription() : String`

**Description:** Returns product's page description in the default locale.

**Returns:**

The product's page description in the default locale, or null if it wasn't found.

---

### getPageKeywords

**Signature:** `getPageKeywords() : String`

**Description:** Returns the product's page keywords in the default locale.

**Returns:**

The product's page keywords in the default locale, or null if it wasn't found.

---

### getPageMetaTag

**Signature:** `getPageMetaTag(id : String) : PageMetaTag`

**Description:** Returns the page meta tag for the specified id. The meta tag content is generated based on the product detail page meta tag context and rule. The rule is obtained from the current product context or inherited from variation groups, master product, the primary category, up to the root category. Null will be returned if the meta tag is undefined on the current instance, or if no rule can be found for the current context, or if the rule resolves to an empty string.

**Parameters:**

- `id`: the ID to get the page meta tag for

**Returns:**

page meta tag containing content generated based on rules

---

### getPageMetaTags

**Signature:** `getPageMetaTags() : Array`

**Description:** Returns all page meta tags, defined for this instance for which content can be generated. The meta tag content is generated based on the product detail page meta tag context and rules. The rules are obtained from the current product context or inherited from variation groups, master product, the primary category, up to the root category.

**Returns:**

page meta tags defined for this instance, containing content generated based on rules

---

### getPageTitle

**Signature:** `getPageTitle() : String`

**Description:** Returns the product's page title in the default locale.

**Returns:**

The product's page title in the default locale, or null if it wasn't found.

---

### getPageURL

**Signature:** `getPageURL() : String`

**Description:** Returns the product's page URL in the default locale.

**Returns:**

The product's page URL in the default locale, or null if it wasn't found.

---

### getPriceModel

**Signature:** `getPriceModel() : ProductPriceModel`

**Description:** Returns the price model, which can be used to retrieve a price for this product.

**Returns:**

the price model, which can be used to retrieve a price for this product.

---

### getPriceModel

**Signature:** `getPriceModel(optionModel : ProductOptionModel) : ProductPriceModel`

**Description:** Returns the price model based on the specified optionModel. The price model can be used to retrieve a price for this product. Prices are calculated based on the option values selected in the specified option model.

**Parameters:**

- `optionModel`: the option model to use when fetching the price model.

**Returns:**

the price model based on the specified optionModel.

---

### getPrimaryCategory

**Signature:** `getPrimaryCategory() : Category`

**Description:** Returns the primary category of the product within the current site catalog.

**Returns:**

The product's primary category or null.

---

### getPrimaryCategoryAssignment

**Signature:** `getPrimaryCategoryAssignment() : CategoryAssignment`

**Description:** Returns the category assignment to the primary category in the current site catalog or null if no primary category is defined within the current site catalog.

**Returns:**

The category assignment to the primary category or null.

---

### getProductLinks

**Signature:** `getProductLinks() : Collection`

**Description:** Returns all outgoing ProductLinks, where the target product is also available in the current site. The ProductLinks are unsorted.

**Returns:**

a collection of outgoing ProductLinks where the target product is also available in the current site.

---

### getProductLinks

**Signature:** `getProductLinks(type : Number) : Collection`

**Description:** Returns all outgoing ProductLinks of a specific type, where the target product is also available in the current site. The ProductLinks are sorted.

**Parameters:**

- `type`: the type of ProductLinks to fetch.

**Returns:**

a collection of outgoing ProductLinks where the target product is also available in the current site.

---

### getProductSetProducts

**Signature:** `getProductSetProducts() : Collection`

**Description:** Returns a collection of all products which are assigned to this product and which are also available through the current site. If this product does not represent a product set then an empty collection will be returned.

**Returns:**

Collection of products which are assigned to this product and which are also available through the current site.

---

### getProductSets

**Signature:** `getProductSets() : Collection`

**Description:** Returns a collection of all product sets in which this product is included. The method only returns product sets assigned to the current site.

**Returns:**

Collection of product sets in which this product is included, possibly empty.

---

### getRecommendations

**Signature:** `getRecommendations() : Collection`

**Description:** Returns the outgoing recommendations for this product which belong to the site catalog. If this product is not assigned to the site catalog, or there is no site catalog, an empty collection is returned. Only recommendations for which the target product exists and is assigned to the site catalog are returned. The recommendations are sorted by their explicitly set order.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getRecommendations

**Signature:** `getRecommendations(type : Number) : Collection`

**Description:** Returns the outgoing recommendations for this product which are of the specified type and which belong to the site catalog. Behaves the same as getRecommendations() but additionally filters by recommendation type.

**Parameters:**

- `type`: the recommendation type.

**Returns:**

the sorted collection of recommendations, never null but possibly empty.

---

### getSearchableFlag

**Signature:** `getSearchableFlag() : boolean`

**Description:** Returns, whether the product is currently searchable.

**Returns:**

the searchable status flag of the product.

---

### getSearchableIfUnavailableFlag

**Signature:** `getSearchableIfUnavailableFlag() : boolean`

**Description:** Returns the searchable status of the Product if unavailable. Besides true or false, the return value null indicates that the value is not set.

**Returns:**

The searchable status of the product if unavailable or null if not set.

---

### getSearchPlacement

**Signature:** `getSearchPlacement() : Number`

**Description:** Returns the product's search placement classification. The higher the numeric product placement value, the more relevant is the product when sorting search results. The range of numeric placement values is defined in the meta data of object type 'Product' and can therefore be customized.

**Returns:**

The product's search placement classification.

---

### getSearchRank

**Signature:** `getSearchRank() : Number`

**Description:** Returns the product's search rank. The higher the numeric product rank, the more relevant is the product when sorting search results. The range of numeric rank values is defined in the meta data of object type 'Product' and can therefore be customized.

**Returns:**

The product's search rank.

---

### getShortDescription

**Signature:** `getShortDescription() : MarkupText`

**Description:** Returns the product's short description in the current locale.

**Returns:**

the product's short description in the current locale, or null if it wasn't found.

---

### getSiteMapChangeFrequency

**Signature:** `getSiteMapChangeFrequency() : String`

**Description:** Returns the product's change frequency needed for the sitemap creation.

**Returns:**

The product's sitemap change frequency.

---

### getSiteMapIncluded

**Signature:** `getSiteMapIncluded() : Number`

**Description:** Returns the status if the product is included into the sitemap.

**Returns:**

the value of the attribute 'siteMapIncluded'.

---

### getSiteMapPriority

**Signature:** `getSiteMapPriority() : Number`

**Description:** Returns the product's priority needed for the sitemap creation.

**Returns:**

The product's sitemap priority.

---

### getStepQuantity

**Signature:** `getStepQuantity() : Quantity`

**Description:** Returns the steps in which the order amount of the product can be increased.

**Returns:**

the order amount by which the product can be increased.

---

### getStoreReceiptName

**Signature:** `getStoreReceiptName() : String`

**Description:** Returns the store receipt name of the product in the current locale.

**Returns:**

The store receipt name of the product for the current locale, or null if it wasn't found.

---

### getStoreTaxClass

**Signature:** `getStoreTaxClass() : String`

**Description:** Returns the store tax class ID. This is an optional override for in-store tax calculation.

**Returns:**

the store tax class id.

---

### getTaxClassID

**Signature:** `getTaxClassID() : String`

**Description:** Returns the ID of the product's tax class, by resolving the Global Preference setting selected. If the Localized Tax Class setting under Global Preferences -> Products is selected, the localizedTaxClassID attribute value will be returned, else the legacy taxClassID attribute value will be returned.

**Returns:**

the ID of the product's tax class depending on the Global Preference setting selected for Products.

---

### getTemplate

**Signature:** `getTemplate() : String`

**Description:** Returns the name of the product's rendering template.

**Returns:**

the name of the product's rendering template.

---

### getThumbnail

**Signature:** `getThumbnail() : MediaFile`

**Description:** Returns the product's thumbnail image.

**Deprecated:**

Commerce Cloud Digital introduces a new more powerful product image management. It allows to group product images by self-defined view types (e.g. 'large', 'thumbnail', 'swatch') and variation values (e.g. for attribute color 'red', 'blue'). Images can be annotated with pattern based title and alt. Product images can be accessed from Digital locations or external storage locations. Please use the new product image management. Therefore you have to set up the common product image settings like view types, image location, default image alt and title for your catalogs first. After that you can group your product images by the previously defined view types in context of a product. Finally use getImages(String) and getImage(String, Number) to access your images.

**Returns:**

the product's thumbnail image.

---

### getUnit

**Signature:** `getUnit() : String`

**Description:** Returns the product's sales unit.

**Returns:**

the products sales unit.

---

### getUnitQuantity

**Signature:** `getUnitQuantity() : Quantity`

**Description:** Returns the product's unit quantity.

**Returns:**

the products unit quantity.

---

### getUPC

**Signature:** `getUPC() : String`

**Description:** Returns the Universal Product Code of the product.

**Returns:**

the Universal Product Code of the product.

---

### getVariants

**Signature:** `getVariants() : Collection`

**Description:** Returns a collection of all variants assigned to this variation master or variation group product. All variants are returned regardless of whether they are online or offline. If this product does not represent a variation master or variation group product then an empty collection is returned.

**Returns:**

Collection of variants associated with this variation master or variation group product.

---

### getVariationGroups

**Signature:** `getVariationGroups() : Collection`

**Description:** Returns a collection of all variation groups assigned to this variation master product. All variation groups are returned regardless of whether they are online or offline. If this product does not represent a variation master product then an empty collection is returned.

**Returns:**

Collection of variation groups associated with this variation master product.

---

### getVariationModel

**Signature:** `getVariationModel() : ProductVariationModel`

**Description:** Returns the variation model of this product. If this product is a master product, then the returned model will encapsulate all the information about its variation attributes and variants. If this product is a variant product, then the returned model will encapsulate all the same information, but additionally pre-select all the variation attribute values of this variant. (See ProductVariationModel for details on what "selected" means.) If this product is neither a master product or a variation product, then a model will be returned but will be essentially empty and not useful for any particular purpose.

**Returns:**

the variation model of the product.

---

### includedInBundle

**Signature:** `includedInBundle(product : Product) : boolean`

**Description:** Identifies if the specified product participates in this product bundle. If this product does not represent a bundle at all, then false will always be returned.

**Parameters:**

- `product`: the product to check for participation.

**Returns:**

true if the product participates in the bundle, false otherwise.

---

### isAssignedToCategory

**Signature:** `isAssignedToCategory(category : Category) : boolean`

**Description:** Returns 'true' if item is assigned to the specified category.

**Parameters:**

- `category`: the category to check.

**Returns:**

true if item is assigned to category.

---

### isAssignedToSiteCatalog

**Signature:** `isAssignedToSiteCatalog() : boolean`

**Description:** Returns true if the product is assigned to the current site (via the site catalog), otherwise false is returned. In case of the product being a variant, the variant will be considered as assigned if its master, one of the variation groups it is in or itself is assigned to the site catalog. In case this is triggered for a variation group the variation group is considered as assigned if its master or itself is assigned.

**Returns:**

'true' if product assigned to the site catalog

---

### isAvailable

**Signature:** `isAvailable() : boolean`

**Description:** Identifies if the product is available.

**Deprecated:**

Use getAvailabilityModel().isInStock() instead

**Returns:**

the value of the attribute 'available'.

---

### isBundle

**Signature:** `isBundle() : boolean`

**Description:** Identifies if this product instance is a product bundle.

**Returns:**

true if the product is a bundle, false otherwise.

---

### isBundled

**Signature:** `isBundled() : boolean`

**Description:** Identifies if this product instance is bundled within at least one product bundle.

**Returns:**

true if the product is bundled, false otherwise.

---

### isCategorized

**Signature:** `isCategorized() : boolean`

**Description:** Identifies if this product is bound to at least one catalog category.

**Returns:**

true if the product is bound to at least one catalog category, false otherwise.

---

### isFacebookEnabled

**Signature:** `isFacebookEnabled() : boolean`

**Description:** Identifies if the product is Facebook enabled.

**Returns:**

the value of the attribute 'facebookEnabled'.

---

### isMaster

**Signature:** `isMaster() : boolean`

**Description:** Identifies if this product instance is a product master.

**Returns:**

true if the product is a master, false otherwise.

---

### isOnline

**Signature:** `isOnline() : boolean`

**Description:** Returns the online status of the product. The online status is calculated from the online status flag and the onlineFrom onlineTo dates defined for the product.

**Returns:**

the online status of the product.

---

### isOptionProduct

**Signature:** `isOptionProduct() : boolean`

**Description:** Identifies if the product has options.

**Returns:**

true if product has options, false otherwise.

---

### isPinterestEnabled

**Signature:** `isPinterestEnabled() : boolean`

**Description:** Identifies if the product is Pinterest enabled.

**Returns:**

the value of the attribute 'pinterestEnabled'.

---

### isProduct

**Signature:** `isProduct() : boolean`

**Description:** Returns 'true' if the instance represents a product. Returns 'false' if the instance represents a product set.

**Returns:**

true if the instance is a product, false otherwise.

**See Also:**

isProductSet()

---

### isProductSet

**Signature:** `isProductSet() : boolean`

**Description:** Returns 'true' if the instance represents a product set, otherwise 'false'.

**Returns:**

true if the instance is a product set, false otherwise.

**See Also:**

isProduct()

---

### isProductSetProduct

**Signature:** `isProductSetProduct() : boolean`

**Description:** Returns true if this product is part of any product set, otherwise false.

**Returns:**

true if the product is part of any product set, false otherwise.

---

### isRetailSet

**Signature:** `isRetailSet() : boolean`

**Description:** Identifies if this product instance is part of a retail set.

**Deprecated:**

Use isProductSet() instead

**Returns:**

true if the product is part of a retail set, false otherwise.

---

### isSearchable

**Signature:** `isSearchable() : boolean`

**Description:** Identifies if the product is searchable.

**Returns:**

the value of the attribute 'searchable'.

---

### isSiteProduct

**Signature:** `isSiteProduct() : boolean`

**Description:** Returns 'true' if the product is assigned to the current site (via the site catalog), otherwise 'false' is returned.

**Deprecated:**

Use isAssignedToSiteCatalog() instead

**Returns:**

'true' if product assigned to site.

---

### isVariant

**Signature:** `isVariant() : boolean`

**Description:** Identifies if this product instance is mastered by a product master.

**Returns:**

true if the product is mastered, false otherwise.

---

### isVariationGroup

**Signature:** `isVariationGroup() : boolean`

**Description:** Identifies if this product instance is a variation group product.

**Returns:**

true if the product is a variation group, false otherwise.

---

### setAvailableFlag

**Signature:** `setAvailableFlag(available : boolean) : void`

**Description:** Set the availability status flag of the product.

**Deprecated:**

Don't use this method anymore.

**Parameters:**

- `available`: Availability status flag.

---

### setOnlineFlag

**Signature:** `setOnlineFlag(online : boolean) : void`

**Description:** Set the online status flag of the product for the current site. If current site is not available (i.e. in case this method is called by a job that runs on organization level) the online status flag is set global, which can affect all sites. In previous versions this method set the online status flag global, instead of site specific.

**API Versioned:**

From version 10.6. In prior versions this method set the online status flag global, instead of site specific.

**Parameters:**

- `online`: Online status flag.

---

### setSearchableFlag

**Signature:** `setSearchableFlag(searchable : boolean) : void`

**Description:** Set the flag indicating whether the product is searchable or not in context of the current site. If current site is not available (i.e. in case this method is called by a job that runs on organization level) the searchable flag is set global, which can affect all sites. In previous versions this method set the searchable flag global, instead of site specific.

**API Versioned:**

From version 10.6. In prior versions this method set the searchable flag global, instead of site specific.

**Parameters:**

- `searchable`: The value of the attribute 'searchable'.

---

### setSearchPlacement

**Signature:** `setSearchPlacement(placement : Number) : void`

**Description:** Set the product's search placement classification in context of the current site. If current site is not available (i.e. in case this method is called by a job that runs on organization level) the search placement is set global, which can affect all sites. In previous versions this method set the search placement classification global, instead of site specific.

**API Versioned:**

From version 10.6. In prior versions this method set the search placement classification global, instead of site specific.

**Parameters:**

- `placement`: The product's search placement classification.

---

### setSearchRank

**Signature:** `setSearchRank(rank : Number) : void`

**Description:** Set the product's search rank in context of the current site. If current site is not available (i.e. in case this method is called by a job that runs on organization level) the search rank is set global, which can affect all sites. In previous versions this method set the search rank global, instead of site specific.

**API Versioned:**

From version 10.6. In prior versions this method set the search rank global, instead of site specific.

**Parameters:**

- `rank`: The product's search rank.

---
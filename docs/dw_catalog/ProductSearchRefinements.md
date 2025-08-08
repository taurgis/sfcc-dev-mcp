## Package: dw.catalog

# Class ProductSearchRefinements

## Inheritance Hierarchy

- Object
  - dw.catalog.SearchRefinements
  - dw.catalog.ProductSearchRefinements

## Description

This class provides an interface to refinement options for the product search. In a typical usage, the client application UI displays the search refinements along with the search results and allows customers to "refine" the results (i.e. limit the results that are shown) by specifying additional product criteria, or "relax" (i.e. broaden) the results after previously refining. The four types of product search refinements are: Refine By Category: Limit the products to those assigned to specific child/ancestor categories of the search category. Refine By Attribute: Limit the products to those with specific values for a given attribute. Values may be grouped into "buckets" so that a given set of values are represented as a single refinement option. Refine By Price: Limit the products to those whose prices fall in a specific range. Refine By Promotion: Limit the products to those which are related to a specific promotion. Rendering a product search refinement UI typically begins with iterating the refinement definitions for the search result. Call SearchRefinements.getRefinementDefinitions() or SearchRefinements.getAllRefinementDefinitions() to retrieve the appropriate collection of refinement definitions. For each definition, display the available refinement values by calling getAllRefinementValues(ProductSearchRefinementDefinition). Depending on the type of the refinement definition, the application must use slightly different logic to display the refinement widgets. For all 4 types, methods in ProductSearchModel are used to generate URLs to render hyperlinks in the UI. When clicked, these links trigger a call to the Search pipelet which in turn applies the appropriate filters to the native search result.

## Properties

### categoryRefinementDefinition

**Type:** ProductSearchRefinementDefinition (Read Only)

The appropriate category refinement definition based on the search
 result. The category refinement definition returned will be the first that
 can be found traversing the category tree upward starting at the deepest
 common category of the search result.

### priceRefinementDefinition

**Type:** ProductSearchRefinementDefinition (Read Only)

The appropriate price refinement definition based on the search
 result. The price refinement definition returned will be the first that
 can be found traversing the category tree upward starting at the deepest
 common category of the search result.

### promotionRefinementDefinition

**Type:** ProductSearchRefinementDefinition (Read Only)

The appropriate promotion refinement definition based on the search
 result. The promotion refinement definition returned will be the first that
 can be found traversing the category tree upward starting at the deepest
 common category of the search result.

## Constructor Summary

## Method Summary

### getAllRefinementValues

**Signature:** `getAllRefinementValues(definition : ProductSearchRefinementDefinition) : Collection`

Returns a sorted collection of refinement values for the passed refinement definition.

### getCategoryRefinementDefinition

**Signature:** `getCategoryRefinementDefinition() : ProductSearchRefinementDefinition`

Returns the appropriate category refinement definition based on the search result.

### getNextLevelCategoryRefinementValues

**Signature:** `getNextLevelCategoryRefinementValues(category : Category) : Collection`

Returns category refinement values based on the current search result filtered such that only category refinements representing children of the given category are present.

### getPriceRefinementDefinition

**Signature:** `getPriceRefinementDefinition() : ProductSearchRefinementDefinition`

Returns the appropriate price refinement definition based on the search result.

### getPromotionRefinementDefinition

**Signature:** `getPromotionRefinementDefinition() : ProductSearchRefinementDefinition`

Returns the appropriate promotion refinement definition based on the search result.

### getRefinementValue

**Signature:** `getRefinementValue(definition : ProductSearchRefinementDefinition, value : String) : ProductSearchRefinementValue`

Returns the refinement value (incl.

### getRefinementValue

**Signature:** `getRefinementValue(name : String, value : String) : ProductSearchRefinementValue`

Returns the refinement value (incl.

### getRefinementValues

**Signature:** `getRefinementValues(definition : ProductSearchRefinementDefinition) : Collection`

Returns a collection of refinement values for the given refinement definition.

## Method Detail

## Method Details

### getAllRefinementValues

**Signature:** `getAllRefinementValues(definition : ProductSearchRefinementDefinition) : Collection`

**Description:** Returns a sorted collection of refinement values for the passed refinement definition. The returned collection includes all refinement values for which the hit count is greater than 0 within the search result when the passed refinement definition is excluded from filtering the search hits but all other refinement filters are still applied. This method is useful for rendering broadening options for definitions that the search is currently refined by. If the search is not currently restricted by the passed refinement definition, then this method will return the same result as getRefinementValues(ProductSearchRefinementDefinition). For attribute-based refinement definitions, the returned collection depends upon how the "value set" property is configured. (Category and price refinement definitions do not have such a property.) If this property is set to "search result values", the behavior is as described above. If this property is set to "all values of category", then the returned collection will also include all refinement values for products in the category subtree rooted at the search definition's category. This setting is useful for refinements whose visualization is supposed to remain constant for a certain subtree of a catalog (e.g. color pickers or size charts). These additional values are independent of the search result and do not contribute towards the value hit counts. If the search result is further refined by one of these values, it is possible to get an empty search result. Except for this one case this method does NOT return refinement values independent of the search result.

**Parameters:**

- `definition`: The refinement definition to return refinement values for. Must not be null.

**Returns:**

The collection of ProductSearchRefinementValue instances, sorted according to the settings of the refinement definition.

---

### getCategoryRefinementDefinition

**Signature:** `getCategoryRefinementDefinition() : ProductSearchRefinementDefinition`

**Description:** Returns the appropriate category refinement definition based on the search result. The category refinement definition returned will be the first that can be found traversing the category tree upward starting at the deepest common category of the search result.

**Returns:**

The category refinement definition or null if none can be found.

---

### getNextLevelCategoryRefinementValues

**Signature:** `getNextLevelCategoryRefinementValues(category : Category) : Collection`

**Description:** Returns category refinement values based on the current search result filtered such that only category refinements representing children of the given category are present. If no category is given, the method uses the catalog's root category. The refinement value product counts represent all hits contained in the catalog tree starting at the corresponding child category.

**Parameters:**

- `category`: The category to return child category refinement values for.

**Returns:**

The refinement values for all child categories of the given category.

---

### getPriceRefinementDefinition

**Signature:** `getPriceRefinementDefinition() : ProductSearchRefinementDefinition`

**Description:** Returns the appropriate price refinement definition based on the search result. The price refinement definition returned will be the first that can be found traversing the category tree upward starting at the deepest common category of the search result.

**Returns:**

The price refinement definition or null if none can be found.

---

### getPromotionRefinementDefinition

**Signature:** `getPromotionRefinementDefinition() : ProductSearchRefinementDefinition`

**Description:** Returns the appropriate promotion refinement definition based on the search result. The promotion refinement definition returned will be the first that can be found traversing the category tree upward starting at the deepest common category of the search result.

**Returns:**

The promotion refinement definition or null if none can be found.

---

### getRefinementValue

**Signature:** `getRefinementValue(definition : ProductSearchRefinementDefinition, value : String) : ProductSearchRefinementValue`

**Description:** Returns the refinement value (incl. product hit count) for the given refinement definition and the given (selected) value.

**Parameters:**

- `definition`: The definition to return the refinement for.
- `value`: The value to return the refinement for.

**Returns:**

The refinement value.

---

### getRefinementValue

**Signature:** `getRefinementValue(name : String, value : String) : ProductSearchRefinementValue`

**Description:** Returns the refinement value (incl. product hit count) for the given refinement attribute and the given (selected) value.

**Parameters:**

- `name`: The name of the refinement attribute.
- `value`: The value to return the refinement for.

**Returns:**

The refinement value.

---

### getRefinementValues

**Signature:** `getRefinementValues(definition : ProductSearchRefinementDefinition) : Collection`

**Description:** Returns a collection of refinement values for the given refinement definition. The returned refinement values only include those that are part of the actual search result (i.e. hit count will always be > 0).

**Parameters:**

- `definition`: The refinement definition to return refinement values for.

**Returns:**

The collection of refinement values sorted according to the settings of the definition.

---
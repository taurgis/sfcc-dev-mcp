# SFRA Product Search Model

## Overview

The Product Search model represents search functionality in SFRA applications, providing comprehensive search results, refinements, sorting options, and pagination for product discovery and catalog browsing.

## Constructor

```javascript
function ProductSearch(productSearch, httpParams, sortingRule, sortingOptions, rootCategory)
```

Creates a Product Search model instance with search results and related functionality.

### Parameters

- `productSearch` (dw.catalog.ProductSearchModel) - Product search object from the API
- `httpParams` (Object) - HTTP query parameters including search terms and refinements
- `sortingRule` (string) - Current sorting rule being applied
- `sortingOptions` (dw.util.ArrayList<dw.catalog.SortingOption>) - Options to sort search results
- `rootCategory` (dw.catalog.Category) - Search result's root category if applicable

## Properties

### searchKeywords
**Type:** string

The search keywords entered by the user.

### category
**Type:** Object | null

Current category information if this is a category-based search.

### productIds
**Type:** Array<Object>

Array of product information objects with `productID` and `productSearchHit` properties for search results.

### products
**Type:** Array<Object>

Array of product tile models for the search results. **Note:** This property is not directly set by the constructor but would be populated by calling code using the `productIds` array.

### pageNumber
**Type:** number

Current page number for pagination (1-based).

### pageSize
**Type:** number

Number of products displayed per page (from httpParams.sz or default).

### count
**Type:** number

Total number of products found matching the search criteria.

### isCategorySearch
**Type:** boolean

Indicates whether this is a category-based search.

### isRefinedCategorySearch
**Type:** boolean

Indicates whether this is a refined category search.

### resetLink
**Type:** string

URL to reset all search refinements (AJAX endpoint).

### resetLinkSeo
**Type:** string

SEO-friendly URL to reset all search refinements.

### refinements
**Type:** Array<Object> (computed property)

Array of available search refinements including:
- `displayName` - Human-readable refinement name
- `isCategoryRefinement` - Boolean flag for category refinements
- `isAttributeRefinement` - Boolean flag for attribute refinements
- `isPriceRefinement` - Boolean flag for price refinements
- `isPromotionRefinement` - Boolean flag for promotion refinements
- `values` - Array of refinement value objects

### selectedFilters
**Type:** Array<Object> (computed property)

Array of currently applied refinements extracted from the refinements.

### productSort
**Type:** ProductSortOptions

Available sorting options for the search results (ProductSortOptions model instance).

### bannerImageUrl
**Type:** string | null

URL for category banner image (null if not available).

### showMoreUrl
**Type:** string

URL to load more search results (for infinite scroll or "show more" functionality).

### permalink
**Type:** string

Permalink URL for the current search with filters and pagination preserved.

### isSearchSuggestionsAvailable
**Type:** boolean

Indicates whether search suggestions are available for the current search.

### suggestionPhrases
**Type:** Array<Object>

Array of suggested search phrases with `value` and `url` properties (only available when `isSearchSuggestionsAvailable` is true).

### category
**Type:** Object | null

Current category information if this is a category-based search, including:
- `name` - Category display name
- `id` - Category ID
- `pageTitle` - Category page title
- `pageDescription` - Category page description  
- `pageKeywords` - Category page keywords

### pageMetaTags
**Type:** Object

Page meta tags for SEO purposes.

## Helper Functions

### getResetLink(search, httpParams, actionEndpoint)
Generates URL to remove all refinements and reset search criteria.

**Parameters:**
- `search` (dw.catalog.ProductSearchModel) - Product search object
- `httpParams` (Object) - Query parameters
- `actionEndpoint` (string) - Action endpoint to use

**Returns:** string - URL to reset search refinements

### getRefinements(productSearch, refinements, refinementDefinitions)
Retrieves and formats search refinements for display.

**Parameters:**
- `productSearch` (dw.catalog.ProductSearchModel) - Product search object
- `refinements` (dw.catalog.ProductSearchRefinements) - Search refinements
- `refinementDefinitions` (ArrayList) - Refinement definitions

**Returns:** Array<Object> - Formatted refinement objects

## Usage Example

```javascript
var ProductSearch = require('*/cartridge/models/search/productSearch');

// From search controller
var productSearch = new ProductSearch(
    apiProductSearch,
    req.querystring,
    sortingRule,
    sortingOptions,
    rootCategory
);

// Access search results
console.log('Found ' + productSearch.count + ' products');
console.log('Search term: ' + productSearch.searchKeywords);

// Display product IDs (products would be populated separately)
productSearch.productIds.forEach(function(item) {
    console.log('Product ID: ' + item.productID);
});

// Handle refinements
productSearch.refinements.forEach(function(refinement) {
    console.log(refinement.displayName + ':');
    refinement.values.forEach(function(value) {
        console.log('  ' + value.displayValue + ' (' + value.hitCount + ')');
    });
});

// Pagination
console.log('Page ' + productSearch.pageNumber + ', showing ' + productSearch.pageSize + ' items');

// Check for search suggestions
if (productSearch.isSearchSuggestionsAvailable) {
    productSearch.suggestionPhrases.forEach(function(phrase) {
        console.log('Suggested: ' + phrase.value);
    });
}
```

## Search Types

### Keyword Search
- Based on search terms entered by users
- Full-text search across product attributes
- Includes search suggestions and spell correction

### Category Search  
- Browse products within specific categories
- Maintains category hierarchy navigation
- Category-specific refinements and sorting

### Refined Search
- Apply filters to narrow results
- Multiple refinement types (price, attributes, categories)
- Combinable refinements with removal options

## Refinement Types

The model supports various refinement types:
- **Category Refinements** - Filter by product categories
- **Attribute Refinements** - Filter by product attributes (color, size, brand)
- **Price Refinements** - Filter by price ranges
- **Promotion Refinements** - Filter by promotional offers

## Notes

- Provides comprehensive search functionality for SFRA storefronts
- Handles both keyword and category-based searches
- Includes pagination support with configurable page sizes
- Supports multiple refinement types with hit counts
- Integrates with product tile models for consistent display
- Includes sorting options and search result optimization
- Provides URLs for search refinement and reset functionality

## Related Models

- **ProductSortOptions** - Used for search result sorting
- **Product Tile Model** - Used for individual product display
- **Categories Model** - Used for category-based searches
- **Refinement Models** - Used for search filtering

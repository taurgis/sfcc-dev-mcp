# SFRA Product Search Model

## Overview

The Product Search model represents search functionality in SFRA applications, providing comprehensive search results, refinements, sorting options, and pagination for product discovery and catalog browsing.

## Constructor

```javascript
function ProductSearch(productSearch, httpParams, sortingRule, categoryTemplate, maxSlots)
```

Creates a Product Search model instance with search results and related functionality.

### Parameters

- `productSearch` (dw.catalog.ProductSearchModel) - Product search object from the API
- `httpParams` (Object) - HTTP query parameters including search terms and refinements
- `sortingRule` (string) - Current sorting rule being applied
- `categoryTemplate` (string) - Template to use for category-based searches
- `maxSlots` (number) - Maximum number of promotional slots to include

## Properties

### searchKeywords
**Type:** string

The search keywords entered by the user.

### category
**Type:** Object | null

Current category information if this is a category-based search.

### productIds
**Type:** Array<string>

Array of product IDs returned in the search results.

### products
**Type:** Array<Object>

Array of product tile models for the search results.

### count
**Type:** number

Total number of products found matching the search criteria.

### start
**Type:** number

Starting index for pagination (zero-based).

### pageSize
**Type:** number

Number of products displayed per page.

### resetLink
**Type:** string

URL to reset all search refinements and return to base search.

### refinements
**Type:** Array<Object>

Array of available search refinements including:
- `displayName` - Human-readable refinement name
- `isCategoryRefinement` - Boolean flag for category refinements
- `isAttributeRefinement` - Boolean flag for attribute refinements
- `isPriceRefinement` - Boolean flag for price refinements
- `isPromotionRefinement` - Boolean flag for promotion refinements
- `values` - Array of refinement value objects

### selectedRefinements
**Type:** Array<Object>

Array of currently applied refinements with removal URLs.

### sortingOptions
**Type:** ProductSortOptions

Available sorting options for the search results.

### isCategorySearch
**Type:** boolean

Indicates whether this is a category-based search.

### isRefinedSearch
**Type:** boolean

Indicates whether any refinements are currently applied.

### showMoreUrl
**Type:** string

URL to load more search results (for infinite scroll).

### bannerImageUrl
**Type:** string

URL for category or search result banner image.

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
var ProductSearchModel = require('*/cartridge/models/search/productSearch');

// From search controller
var productSearch = new ProductSearchModel(
    apiProductSearch,
    req.querystring,
    sortingRule,
    'search/searchResults',
    4
);

// Access search results
console.log('Found ' + productSearch.count + ' products');
console.log('Search term: ' + productSearch.searchKeywords);

// Display products
productSearch.products.forEach(function(product) {
    console.log(product.productName + ' - ' + product.price.sales.formatted);
});

// Handle refinements
productSearch.refinements.forEach(function(refinement) {
    console.log(refinement.displayName + ':');
    refinement.values.forEach(function(value) {
        console.log('  ' + value.displayValue + ' (' + value.hitCount + ')');
    });
});

// Pagination
if (productSearch.count > productSearch.pageSize) {
    console.log('Showing ' + productSearch.start + '-' + 
                (productSearch.start + productSearch.pageSize) + 
                ' of ' + productSearch.count);
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

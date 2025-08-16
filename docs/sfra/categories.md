# SFRA Categories Model

## Overview

The Categories model represents a hierarchical structure of categories for navigation menus and category displays in SFRA applications. It provides formatted category information with URLs, subcategories, and menu display logic.

## Constructor

```javascript
function categories(items)
```

Creates a Categories model instance from a collection of top-level categories.

### Parameters

- `items` (dw.util.ArrayList<dw.catalog.Category>) - Top level categories collection

## Properties

### categories
**Type:** Array<Object>

Array of formatted category objects that should be shown in menus. Each category contains:
- `name` (string) - Category display name
- `url` (string) - Category URL (custom alternative URL or search URL)
- `id` (string) - Category ID
- `subCategories` (Array<Object>) - Array of subcategory objects (if any)
- `complexSubCategories` (boolean) - True if any subcategories have their own subcategories

## Helper Functions

### getCategoryUrl(category)
Generates the appropriate URL for a category, preferring custom alternative URLs.

**Parameters:**
- `category` (dw.catalog.Category) - Category object

**Returns:** string - Category URL (custom alternative URL or search URL)

### categoryToObject(category)
Converts a catalog category to a plain object with menu-appropriate formatting.

**Parameters:**
- `category` (dw.catalog.Category) - Single category to convert

**Returns:** Object | null - Formatted category object or null if not shown in menu

## Category Structure

Each category object in the categories array contains:

### Basic Properties
- **name** - Category display name for menu labels
- **url** - Properly formatted URL for category navigation
- **id** - Category identifier for tracking and CSS classes

### Hierarchical Properties
- **subCategories** - Nested array of subcategory objects (same structure)
- **complexSubCategories** - Boolean flag indicating multi-level nesting

## Menu Display Logic

Categories are included in the menu only if:
1. Category has `custom.showInMenu` set to true
2. Category has online products OR online subcategories
3. Category meets the same criteria recursively for subcategories

## URL Handling

The model provides flexible URL generation:
- **Custom URLs**: Uses `category.custom.alternativeUrl` if available
- **Standard URLs**: Falls back to Search-Show with category ID parameter
- **URL Cleaning**: Removes HTML entities (&amp; becomes &)

## Usage Example

```javascript
var CategoriesModel = require('*/cartridge/models/categories');
var CatalogMgr = require('dw/catalog/CatalogMgr');

// Get site catalog and root categories
var siteCatalog = CatalogMgr.getSiteCatalog();
var topLevelCategories = siteCatalog.getRoot().getOnlineSubCategories();

var categoriesModel = new CategoriesModel(topLevelCategories);

// Access menu categories
categoriesModel.categories.forEach(function(category) {
    console.log(category.name + ' -> ' + category.url);
    
    if (category.subCategories) {
        category.subCategories.forEach(function(subcat) {
            console.log('  ' + subcat.name + ' -> ' + subcat.url);
        });
    }
    
    if (category.complexSubCategories) {
        console.log('Category has multi-level navigation');
    }
});
```

## Recursive Structure

The model handles deep category hierarchies:
- Subcategories are processed recursively with the same logic
- Each level maintains the same object structure
- The `complexSubCategories` flag helps with menu rendering decisions

## Notes

- Only processes categories marked for menu display (`showInMenu`)
- Filters out empty categories with no products or subcategories
- Maintains hierarchical relationships for multi-level navigation
- Provides clean URLs with proper entity handling
- Supports both custom and standard URL patterns
- Optimized for navigation menu rendering

## Related Models

- **Search Models** - Categories link to search results
- **Product Models** - Categories contain products
- **Content Models** - May reference category information

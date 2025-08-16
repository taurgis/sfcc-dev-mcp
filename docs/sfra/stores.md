# SFRA Stores Model

## Overview

The Stores model represents a collection of store locations in SFRA applications. It provides store locator functionality, map integration capabilities, and formatted store information for display in store finder interfaces.

## Constructor

```javascript
function stores(storesObject, radius, searchKey, googleMapsApi)
```

Creates a Stores model instance with store collection and search parameters.

### Parameters

- `storesObject` (dw.util.Set) - A set of dw.catalog.Store objects
- `radius` (number) - Search radius used to find stores
- `searchKey` (string) - Search term or location used for store search
- `googleMapsApi` (string) - Google Maps API key for map integration

## Properties

### stores
**Type:** Array<StoreModel>

Array of individual store models, each containing complete store information including location, contact details, and hours.

### searchKey
**Type:** string

The search term or location used to find the stores (e.g., ZIP code, address, city).

### radius
**Type:** number

The search radius in miles/kilometers used to limit store results.

### googleMapsApi
**Type:** string | null

URL for Google Maps API integration, or null if no API key is configured.

### locations
**Type:** Array<Object>

Array of location objects optimized for map display. Each location contains:
- `name` (string) - Store name
- `latitude` (number) - Geographic latitude
- `longitude` (number) - Geographic longitude  
- `infoWindowHtml` (string) - Rendered HTML for map info windows

## Helper Functions

### createStoresObject(storesObject)
Converts a set of store objects into an array of StoreModel instances.

**Parameters:**
- `storesObject` (dw.util.Set) - Set of dw.catalog.Store objects

**Returns:** Array<StoreModel> - Array of formatted store models

### createGeoLocationObject(storesObject)
Creates location objects with coordinates and rendered info window HTML for map display.

**Parameters:**
- `storesObject` (dw.util.Set) - Set of dw.catalog.Store objects

**Returns:** Array<Object> - Array of location objects with map data

### getGoogleMapsApi(apiKey)
Constructs Google Maps API URL if API key is available.

**Parameters:**
- `apiKey` (string) - Google Maps API key

**Returns:** string | null - Complete API URL or null if no key

## Usage Example

```javascript
var StoresModel = require('*/cartridge/models/stores');
var storeHelpers = require('*/cartridge/scripts/helpers/storeHelpers');

// Search for stores
var searchResults = storeHelpers.findStores('10001', 25);
var apiKey = Site.getCurrent().getCustomPreferenceValue('googleMapsApiKey');

var storesModel = new StoresModel(
    searchResults.stores, 
    25, 
    '10001', 
    apiKey
);

// Access store collection
console.log('Found ' + storesModel.stores.length + ' stores');
console.log('Search: ' + storesModel.searchKey + ' within ' + storesModel.radius + ' miles');

// Iterate through stores
storesModel.stores.forEach(function(store) {
    console.log(store.name + ' - ' + store.city);
});

// Use for map integration
if (storesModel.googleMapsApi) {
    // Load Google Maps with locations
    storesModel.locations.forEach(function(location) {
        // Add markers to map using latitude/longitude
        // Use infoWindowHtml for marker popups
    });
}
```

## Map Integration

The model provides comprehensive mapping support:

### Google Maps Integration
- **googleMapsApi** - Ready-to-use API URL
- **locations** - Array of coordinates with info windows
- **infoWindowHtml** - Pre-rendered HTML for map popups

### Location Data Structure
Each location object includes:
- Geographic coordinates for marker placement
- Store name for marker labels
- Rendered HTML content for info windows

## Search Context

The model preserves search context:
- **searchKey** - Original search term for reference
- **radius** - Search distance for display and refinement
- Enables search result pagination and refinement

## Template Integration

Info windows use the `storeLocator/storeInfoWindow` template:
- Consistent store information display
- Customizable popup content
- Integrated with SFRA template system

## Notes

- Converts SFCC store objects to structured models
- Provides map-ready coordinate data
- Includes pre-rendered HTML for info windows
- Supports Google Maps API integration
- Maintains search context for user reference
- Handles missing API keys gracefully
- Optimized for store locator interfaces

## Related Models

- **StoreModel** - Individual store representation
- **Search Models** - May include store search results
- **Address Models** - Similar location structure
- **Product Models** - May include store availability

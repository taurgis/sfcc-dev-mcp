# SFRA Stores Model

## Overview

The Stores model represents a collection of store locations in SFRA applications. It provides store locator functionality, map integration capabilities, and formatted store information for display in store finder interfaces.

## Constructor

```javascript
function stores(storesResultsObject, searchKey, searchRadius, actionUrl, apiKey)
```

Creates a Stores model instance with store collection and search parameters.

### Parameters

- `storesResultsObject` (dw.util.Set) - A set of dw.catalog.Store objects  
- `searchKey` (Object) - What the user searched by (location or postal code)
- `searchRadius` (number) - The radius used in the search  
- `actionUrl` (dw.web.URL) - A relative URL for the search action
- `apiKey` (string) - The Google Maps API key that is set in site preferences

## Properties

### stores
**Type:** Array<StoreModel>

Array of individual store models, each containing complete store information including location, contact details, and hours.

### searchKey
**Type:** Object

The search term or location used to find the stores (e.g., ZIP code, address, city).

### radius
**Type:** number

The search radius in miles/kilometers used to limit store results.

### actionUrl
**Type:** dw.web.URL

A relative URL for the search action.

### googleMapsApi
**Type:** string | null

URL for Google Maps API integration, or null if no API key is configured.

### radiusOptions
**Type:** Array<number>

Array of available radius options: [15, 30, 50, 100, 300].

### storesResultsHtml
**Type:** string | null

HTML-formatted string of store results for display, or null if no stores found.

### locations
**Type:** string

JSON stringified array of location objects optimized for map display. Each location contains:
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
var stores = require('*/cartridge/models/stores');
var storeHelpers = require('*/cartridge/scripts/helpers/storeHelpers');

// Search for stores
var searchResults = storeHelpers.findStores('10001', 25);
var apiKey = Site.getCurrent().getCustomPreferenceValue('googleMapsApiKey');
var actionUrl = URLUtils.url('Stores-FindStores');

var storesModel = new stores(
    searchResults.stores, 
    '10001',
    25, 
    actionUrl,
    apiKey
);

// Access store collection
console.log('Found ' + storesModel.stores.length + ' stores');
console.log('Search: ' + storesModel.searchKey + ' within ' + storesModel.radius + ' miles');

// Parse JSON locations for map
var locations = JSON.parse(storesModel.locations);

// Iterate through stores
storesModel.stores.forEach(function(store) {
    console.log(store.name + ' - ' + store.city);
});

// Use for map integration
if (storesModel.googleMapsApi) {
    // Load Google Maps with locations
    var locations = JSON.parse(storesModel.locations);
    locations.forEach(function(location) {
        // Add markers to map using latitude/longitude
        // Use infoWindowHtml for marker popups
    });
}

// Display pre-rendered HTML results
if (storesModel.storesResultsHtml) {
    // Use the pre-rendered HTML for store display
}
```

## Map Integration

The model provides comprehensive mapping support:

### Google Maps Integration
- **googleMapsApi** - Ready-to-use API URL
- **locations** - JSON string of coordinates with info windows (needs parsing)
- **infoWindowHtml** - Pre-rendered HTML for map popups

### Location Data Structure
Each location object (after JSON parsing) includes:
- Geographic coordinates for marker placement
- Store name for marker labels
- Rendered HTML content for info windows

## Search Context

The model preserves search context:
- **searchKey** - Original search term for reference
- **radius** - Search distance for display and refinement
- **actionUrl** - URL for additional search actions
- **radiusOptions** - Available radius choices for refinement
- Enables search result pagination and refinement

## Template Integration

Info windows use the `storeLocator/storeInfoWindow` template:
- Consistent store information display
- Customizable popup content
- Integrated with SFRA template system

## Notes

- Converts SFCC store objects to structured models
- Provides map-ready coordinate data as JSON string
- Includes pre-rendered HTML for info windows and store results
- Supports Google Maps API integration
- Maintains search context for user reference
- Includes predefined radius options for search refinement
- Handles missing API keys gracefully
- Optimized for store locator interfaces
- Uses storeHelpers.createStoresResultsHtml for consistent display

## Related Models

- **StoreModel** - Individual store representation
- **Search Models** - May include store search results
- **Address Models** - Similar location structure
- **Product Models** - May include store availability

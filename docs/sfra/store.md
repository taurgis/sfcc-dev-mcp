# SFRA Store Model

## Overview

The Store model represents a physical store location in SFRA applications. It provides store information including location details, contact information, and store hours for store locator functionality and in-store pickup features.

## Constructor

```javascript
function store(storeObject)
```

Creates a Store model instance from a store object.

### Parameters

- `storeObject` (dw.catalog.Store) - A Store object from the SFCC API

## Properties

### ID
**Type:** string

Unique identifier for the store.

### name
**Type:** string

Display name of the store.

### address1
**Type:** string

Primary address line of the store location.

### address2
**Type:** string

Secondary address line (suite, building, etc.).

### city
**Type:** string

City where the store is located.

### postalCode
**Type:** string

Postal/ZIP code for the store location.

### latitude
**Type:** number

Latitude coordinate for the store location (used for mapping and distance calculations).

### longitude
**Type:** number

Longitude coordinate for the store location (used for mapping and distance calculations).

### phone
**Type:** string (optional)

Store phone number for customer contact.

### stateCode
**Type:** string (optional)

State or province code for the store location.

### countryCode
**Type:** string (optional)

Country code for the store location (extracted from countryCode.value).

### storeHours
**Type:** string (optional)

Store hours information as markup/HTML content for display.

## Usage Example

```javascript
var store = require('*/cartridge/models/store');
var StoreMgr = require('dw/catalog/StoreMgr');

// Get a specific store
var storeObject = StoreMgr.getStore('store-001');
var storeModel = new store(storeObject);

// Access store properties
console.log(storeModel.name);          // "Downtown Location"
console.log(storeModel.address1);      // "123 Main St"
console.log(storeModel.city);          // "New York"
console.log(storeModel.phone);         // "555-123-4567"

// Use coordinates for mapping
if (storeModel.latitude && storeModel.longitude) {
    console.log('Location: ' + storeModel.latitude + ', ' + storeModel.longitude);
}

// Display store hours
if (storeModel.storeHours) {
    console.log(storeModel.storeHours); // HTML markup for hours display
}
```

## Coordinate System

The model provides geographic coordinates for:
- **Mapping Integration** - Display stores on maps
- **Distance Calculations** - Find nearest stores
- **Location Services** - GPS-based store finding

## Conditional Properties

Several properties are only included if they exist in the source store object:
- **phone** - Only included if store has a phone number
- **stateCode** - Only included for locations with state/province
- **countryCode** - Only included if country is specified
- **storeHours** - Only included if store hours are configured

## Store Hours Format

Store hours are provided as markup/HTML content, allowing for:
- Rich formatting of hours display
- Multiple day ranges and special hours
- Holiday hours and exceptions
- Custom styling and presentation

## Notes

- Handles missing store data gracefully
- Provides essential location information for store locators
- Includes geographic coordinates for mapping functionality
- Supports international stores with flexible address formats
- Store hours support rich HTML formatting
- Null-safe property access for optional fields

## Related Models

- **Stores Model** - Collection of store models
- **Product Models** - May include store availability
- **Cart Models** - May include store pickup options
- **Address Models** - Similar address structure

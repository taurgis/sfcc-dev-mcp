# SFRA Address Model

## Overview

The Address model represents an order address or customer address in SFRA applications. It provides a standardized way to handle address information across the application.

## Constructor

```javascript
function address(addressObject)
```

Creates an Address model instance from an address object.

### Parameters

- `addressObject` (dw.order.OrderAddress) - User's address object from the API

## Properties

### address
**Type:** Object | null

Contains the formatted address information with the following properties:

- `address1` (string) - Primary address line
- `address2` (string) - Secondary address line
- `city` (string) - City name
- `firstName` (string) - First name
- `lastName` (string) - Last name
- `ID` (string | null) - Address ID
- `addressId` (string | null) - Address identifier (same as ID)
- `phone` (string) - Phone number
- `postalCode` (string) - Postal/ZIP code
- `stateCode` (string) - State or province code
- `jobTitle` (string) - Job title
- `postBox` (string) - Post office box
- `salutation` (string) - Salutation (Mr., Mrs., etc.)
- `secondName` (string) - Second/middle name
- `companyName` (string) - Company name
- `suffix` (string) - Name suffix
- `suite` (string) - Suite number
- `title` (string) - Title
- `countryCode` (Object) - Country code object with:
  - `displayValue` (string) - Display name of country
  - `value` (string) - Country code in uppercase

## Helper Functions

### createAddressObject(addressObject)
Creates a plain object containing standardized address information.

**Parameters:**
- `addressObject` (dw.order.OrderAddress) - Address object from the API

**Returns:** Object | null - Formatted address object or null if no address provided

## Usage Example

```javascript
var AddressModel = require('*/cartridge/models/address');

// Create address model from API address object
var customerAddress = customer.addressBook.preferredAddress;
var addressModel = new AddressModel(customerAddress);

// Access address properties
console.log(addressModel.address.firstName);
console.log(addressModel.address.city);
console.log(addressModel.address.countryCode.value);
```

## Notes

- If `stateCode` is 'undefined', it will be converted to an empty string
- Country codes are automatically converted to uppercase
- The model handles both customer addresses and order addresses
- All address fields are optional and may be null or empty strings

## Related Models

- **Account Model** - Uses Address model for customer addresses
- **Checkout Models** - Use Address model for billing and shipping addresses
- **Order Models** - Use Address model for order address information

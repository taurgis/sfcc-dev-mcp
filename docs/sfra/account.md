# SFRA Account Model

## Overview

The Account model represents a customer's profile dashboard, containing profile information, addresses, payment instruments, and order history. It provides methods for handling customer account data in SFRA applications.

## Constructor

```javascript
function account(currentCustomer, addressModel, orderModel)
```

Creates an Account model instance that represents the current customer's profile dashboard.

### Parameters

- `currentCustomer` (Object) - Current customer object
- `addressModel` (Object) - The current customer's preferred address
- `orderModel` (Object) - The current customer's order history

## Properties

### profile
**Type:** Object | null

Contains the customer's profile information including:
- `firstName` (string) - Customer's first name
- `lastName` (string) - Customer's last name  
- `email` (string) - Customer's email address
- `phone` (string) - Customer's phone number
- `password` (string) - Masked password (always "********")

### addresses
**Type:** Array<Object>

Array of customer's address book addresses. Each address object contains standard address fields.

### preferredAddress
**Type:** Object | null

The customer's preferred/default address from their address book.

### orderHistory
**Type:** Object

The customer's order history information.

### payment
**Type:** Object | null

Primary payment instrument information including:
- `maskedCreditCardNumber` (string) - Masked card number
- `creditCardType` (string) - Type of credit card
- `creditCardExpirationMonth` (number) - Expiration month
- `creditCardExpirationYear` (number) - Expiration year

### registeredUser
**Type:** boolean

Indicates if the customer is both authenticated and registered.

### isExternallyAuthenticated
**Type:** boolean

Indicates if the customer is authenticated through an external provider.

### customerPaymentInstruments
**Type:** Array<Object> | null

Array of customer's saved payment instruments. Each payment instrument contains:
- `creditCardHolder` (string) - Name on the credit card
- `maskedCreditCardNumber` (string) - Masked card number
- `creditCardType` (string) - Type of credit card
- `creditCardExpirationMonth` (number) - Expiration month
- `creditCardExpirationYear` (number) - Expiration year
- `UUID` (string) - Unique identifier
- `cardTypeImage` (Object) - Image source and alt text for card type
  - `src` (string) - Image source URL
  - `alt` (string) - Alt text for the image

## Helper Functions

### getProfile(profile)
Creates a plain object containing profile information.

**Parameters:**
- `profile` (Object) - Customer's profile object

**Returns:** Object | null - Profile information or null if no profile

### getAddresses(addressBook)
Creates an array of address objects from the customer's address book.

**Parameters:**
- `addressBook` (Object) - Customer's address book

**Returns:** Array<Object> - Array of address objects

### getPreferredAddress(addressBook)
Gets the customer's preferred address.

**Parameters:**
- `addressBook` (Object) - Customer's address book

**Returns:** Object | null - Preferred address or null

### getPayment(wallet)
Gets the primary payment instrument information.

**Parameters:**
- `wallet` (Object) - Customer's wallet containing payment instruments

**Returns:** Object | null - Payment instrument information or null

### getCustomerPaymentInstruments(userPaymentInstruments)
Creates an array of payment instrument objects with card type images.

**Parameters:**
- `userPaymentInstruments` (Array) - Array of customer's payment instruments

**Returns:** Array<Object> - Array of formatted payment instruments

## Usage Example

```javascript
var AccountModel = require('*/cartridge/models/account');
var currentCustomer = customer;
var addressModel = null; // or specific address model
var orderModel = getOrderHistory();

var account = new AccountModel(currentCustomer, addressModel, orderModel);

// Access account properties
console.log(account.profile.email);
console.log(account.addresses.length);
console.log(account.registeredUser);
console.log(account.customerPaymentInstruments);
console.log(account.payment);
```

## Related Models

- **Address Model** - Used for address formatting
- **Order Model** - Used for order history
- **Payment Models** - Used for payment instrument handling

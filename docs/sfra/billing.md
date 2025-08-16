# SFRA Billing Model

## Overview

The Billing model represents billing information for the current basket or order in SFRA applications. It provides a simple structure for managing billing address, payment information, and address associations.

## Constructor

```javascript
function billing(addressModel, paymentModel, associatedAddressId)
```

Creates a Billing model instance with billing address, payment, and address association information.

### Parameters

- `addressModel` (Object) - The billing address of the current basket
- `paymentModel` (Object) - Payment information for the current basket
- `associatedAddressId` (string) - The matching ID of the shipping or customer address

## Properties

### billingAddress
**Type:** Object

The billing address model containing complete address information including:
- Address lines, city, state, postal code
- Customer name and contact information
- Country code and other address details

### payment
**Type:** Object

Payment model containing payment method information such as:
- Credit card details (masked)
- Payment processor information
- Payment method type
- Payment instrument details

### matchingAddressId
**Type:** string

The ID that matches this billing address to either:
- A shipping address (if billing and shipping are the same)
- A saved customer address
- null if it's a new address

## Usage Example

```javascript
var BillingModel = require('*/cartridge/models/billing');
var AddressModel = require('*/cartridge/models/address');
var PaymentModel = require('*/cartridge/models/payment');

// Create address and payment models
var billingAddress = new AddressModel(basket.billingAddress);
var paymentInfo = new PaymentModel(basket, customer);
var matchingId = getMatchingAddressId(basket.billingAddress);

// Create billing model
var billing = new BillingModel(billingAddress, paymentInfo, matchingId);

// Access billing properties
console.log(billing.billingAddress.firstName);
console.log(billing.payment.selectedPaymentInstruments);
console.log(billing.matchingAddressId);
```

## Address Matching

The `matchingAddressId` property helps determine:
- If the billing address matches a shipping address
- If the billing address matches a saved customer address
- Whether to show "same as shipping" options in the UI
- Address management and selection logic

## Notes

- Simple container model that aggregates billing-related information
- Used extensively in checkout and order processing
- Address matching enables UI optimizations like "same as shipping"
- Works with both new and saved addresses
- Integrates with payment processing workflows

## Related Models

- **AddressModel** - Used for billing address formatting
- **PaymentModel** - Used for payment information
- **OrderModel** - Uses billing model for order information
- **Cart Model** - May include billing information during checkout

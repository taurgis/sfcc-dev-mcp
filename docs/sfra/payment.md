# SFRA Payment Model

## Overview

The Payment model represents payment information for the current basket in SFRA applications. It provides comprehensive payment method options, applicable payment cards, and selected payment instruments for checkout processing.

## Constructor

```javascript
function Payment(currentBasket, currentCustomer, countryCode)
```

Creates a Payment model instance with applicable payment methods and current payment selections.

### Parameters

- `currentBasket` (dw.order.Basket) - The target Basket object
- `currentCustomer` (dw.customer.Customer) - The associated Customer object
- `countryCode` (string) - The associated Site country code

## Properties

### applicablePaymentMethods
**Type:** Array<Object> | null

Array of payment methods available for the current basket and customer. Each method object contains:
- `ID` (string) - Payment method ID
- `name` (string) - Display name of the payment method

### applicablePaymentCards
**Type:** Array<Object> | null

Array of credit card types available for the current customer and basket. Each card object contains:
- `cardType` (string) - Credit card type identifier
- `name` (string) - Display name of the card type

### selectedPaymentInstruments
**Type:** Array<Object> | null

Array of currently selected payment instruments for the basket. Each instrument object contains:
- `paymentMethod` (string) - Payment method type
- `amount` (number) - Payment amount value

#### Credit Card Instruments
For credit card payments, additional properties include:
- `lastFour` (string) - Last four digits of the card number
- `owner` (string) - Cardholder name
- `expirationYear` (number) - Card expiration year
- `type` (string) - Credit card type
- `maskedCreditCardNumber` (string) - Masked card number
- `expirationMonth` (number) - Card expiration month

#### Gift Certificate Instruments
For gift certificate payments, additional properties include:
- `giftCertificateCode` (string) - Full gift certificate code
- `maskedGiftCertificateCode` (string) - Masked gift certificate code

## Helper Functions

### applicablePaymentMethods(paymentMethods)
Creates an array of applicable payment method objects.

**Parameters:**
- `paymentMethods` (dw.util.ArrayList<dw.order.PaymentMethod>) - Available payment methods

**Returns:** Array<Object> - Formatted payment methods array

### applicablePaymentCards(paymentCards)
Creates an array of applicable credit card objects.

**Parameters:**
- `paymentCards` (dw.util.Collection<dw.order.PaymentCard>) - Available payment cards

**Returns:** Array<Object> - Formatted payment cards array

### getSelectedPaymentInstruments(selectedPaymentInstruments)
Creates an array of selected payment instrument objects with method-specific properties.

**Parameters:**
- `selectedPaymentInstruments` (dw.util.ArrayList<dw.order.PaymentInstrument>) - Selected payment instruments

**Returns:** Array<Object> - Formatted payment instruments array

## Usage Example

```javascript
var PaymentModel = require('*/cartridge/models/payment');
var BasketMgr = require('dw/order/BasketMgr');

var currentBasket = BasketMgr.getCurrentBasket();
var currentCustomer = req.currentCustomer.raw;
var countryCode = 'US';

var payment = new PaymentModel(currentBasket, currentCustomer, countryCode);

// Access payment methods
console.log(payment.applicablePaymentMethods);
// [{ ID: 'CREDIT_CARD', name: 'Credit Card' }, { ID: 'PayPal', name: 'PayPal' }]

// Access applicable cards
console.log(payment.applicablePaymentCards);
// [{ cardType: 'Visa', name: 'Visa' }, { cardType: 'MasterCard', name: 'MasterCard' }]

// Check selected instruments
if (payment.selectedPaymentInstruments) {
    payment.selectedPaymentInstruments.forEach(function(instrument) {
        console.log(instrument.paymentMethod + ': $' + instrument.amount);
    });
}
```

## Payment Method Support

The model supports various payment methods including:
- **Credit Cards** - With full card details and masking
- **Gift Certificates** - With code masking
- **Other Methods** - Basic method and amount information

## Notes

- Payment methods are filtered based on customer, country, and basket amount
- Credit card information is automatically masked for security
- Supports multiple payment instruments per basket
- All monetary amounts are in the basket's currency
- Payment method availability depends on site configuration and customer eligibility

## Related Models

- **BillingModel** - Uses payment model for billing information
- **OrderModel** - Includes payment information in order data
- **Cart Model** - May include payment selection during checkout

## Package: dw.order

# Class PaymentCard

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.PaymentCard

## Description

Represents payment cards and provides methods to access the payment card attributes and status. Note: this class handles sensitive financial and card holder data. Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

## Properties

### active

**Type:** boolean (Read Only)

Returns 'true' if payment card is active (enabled), otherwise 'false' is returned.

### cardType

**Type:** String (Read Only)

The unique card type of the payment card.

### description

**Type:** MarkupText (Read Only)

The description of the payment card.

### image

**Type:** MediaFile (Read Only)

The reference to the payment card image.

### name

**Type:** String (Read Only)

The name of the payment card.

## Constructor Summary

## Method Summary

### getCardType

**Signature:** `getCardType() : String`

Returns the unique card type of the payment card.

### getDescription

**Signature:** `getDescription() : MarkupText`

Returns the description of the payment card.

### getImage

**Signature:** `getImage() : MediaFile`

Returns the reference to the payment card image.

### getName

**Signature:** `getName() : String`

Returns the name of the payment card.

### isActive

**Signature:** `isActive() : boolean`

Returns 'true' if payment card is active (enabled), otherwise 'false' is returned.

### isApplicable

**Signature:** `isApplicable(customer : Customer, countryCode : String, paymentAmount : Number) : boolean`

Returns 'true' if this payment card is applicable for the specified customer, country and payment amount and the session currency.

### verify

**Signature:** `verify(expiresMonth : Number, expiresYear : Number, cardNumber : String) : Status`

Verify the card against the provided values.

### verify

**Signature:** `verify(expiresMonth : Number, expiresYear : Number, cardNumber : String, csc : String) : Status`

Verify the card against the provided values.

## Method Detail

## Method Details

### getCardType

**Signature:** `getCardType() : String`

**Description:** Returns the unique card type of the payment card.

**Returns:**

cardType of the payment card.

---

### getDescription

**Signature:** `getDescription() : MarkupText`

**Description:** Returns the description of the payment card.

**Returns:**

Description of the payment card.

---

### getImage

**Signature:** `getImage() : MediaFile`

**Description:** Returns the reference to the payment card image.

**Returns:**

Image of the payment card.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the payment card.

**Returns:**

Name of the payment card.

---

### isActive

**Signature:** `isActive() : boolean`

**Description:** Returns 'true' if payment card is active (enabled), otherwise 'false' is returned.

**Returns:**

true if payment card is active, otherwise false.

---

### isApplicable

**Signature:** `isApplicable(customer : Customer, countryCode : String, paymentAmount : Number) : boolean`

**Description:** Returns 'true' if this payment card is applicable for the specified customer, country and payment amount and the session currency. The payment card is applicable if the card is restricted by customer group, and at least one of the groups of the specified customer is assigned to the card the card is restricted by billing country, and the specified country code is assigned to the card the method is restricted by payment amount for the session currency, and the specified payment amount is within the limits of the min/max payment amount defined for the method and the session currency the method is restricted by session currency, and the session currency code is assigned to the method All parameters are optional, and if not specified, the respective restriction won't be validated. For example, if a card is restricted by billing country, but no country code is specified, this card will be returned, unless it is filtered out by customer group or payment amount.

**Parameters:**

- `customer`: Customer or null
- `countryCode`: Billing country code or null
- `paymentAmount`: Payment amount or null

**Returns:**

true if payment card is applicable, false otherwise

---

### verify

**Signature:** `verify(expiresMonth : Number, expiresYear : Number, cardNumber : String) : Status`

**Description:** Verify the card against the provided values. This method is equivalent to verify(Number, Number, String, String) but omits verification of the card security code. If the verification fails the resulting Status will hold up to 2 error items each with a code: PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE - the expiresMonth and expiresYear do not describe a month in the future, or describe an invalid month outside the range 1-12. PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER - the cardNumber does not verify against one or more configured checks, which may include the Luhn checksum, accepted number lengths, or accepted number prefixes.

**Parameters:**

- `expiresMonth`: expiration month as integer, 1 (January) to 12 (December)
- `expiresYear`: expiration year as integer, e.g. 2025
- `cardNumber`: card number, a string containing digital characters

**Returns:**

status indicating result

---

### verify

**Signature:** `verify(expiresMonth : Number, expiresYear : Number, cardNumber : String, csc : String) : Status`

**Description:** Verify the card against the provided values. If the verification fails the resulting Status will hold up to 3 error items with these codes: PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE - the expiresMonth and expiresYear do not describe a month in the future, or describe an invalid month outside the range 1-12. PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER - the cardNumber does not verify against one or more configured checks, which may include the Luhn checksum, accepted number lengths, or accepted number prefixes. PaymentStatusCodes.CREDITCARD_INVALID_SECURITY_CODE - the card security code does not verify against the configured accepted length.

**Parameters:**

- `expiresMonth`: expiration month as integer, 1 (January) to 12 (December)
- `expiresYear`: expiration year as integer, e.g. 2025
- `cardNumber`: card number, a string containing digital characters
- `csc`: card security code, a string containing digital characters

**Returns:**

status indicating result

---
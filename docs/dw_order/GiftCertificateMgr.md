## Package: dw.order

# Class GiftCertificateMgr

## Inheritance Hierarchy

- Object
  - dw.order.GiftCertificateMgr

## Description

The GiftCertificateMgr class contains a set of static methods for interacting with GiftCertificates.

## Constants

### GC_ERROR_DISABLED

**Type:** String = "GIFTCERTIFICATE-100"

Indicates that an error occurred because the Gift Certificate is currently disabled.

### GC_ERROR_INSUFFICIENT_BALANCE

**Type:** String = "GIFTCERTIFICATE-110"

Indicates that an error occurred because the Gift Certificate does not have a sufficient balance to perform the requested operation.

### GC_ERROR_INVALID_AMOUNT

**Type:** String = "GIFTCERTIFICATE-140"

Indicates that an error occurred because the Gift Certificate Amount was not valid.

### GC_ERROR_INVALID_CODE

**Type:** String = "GIFTCERTIFICATE-150"

Indicates that an error occurred because the Gift Certificate ID was not valid.

### GC_ERROR_PENDING

**Type:** String = "GIFTCERTIFICATE-130"

Indicates that an error occurred because the Gift Certificate has been fully redeemed.

### GC_ERROR_REDEEMED

**Type:** String = "GIFTCERTIFICATE-120"

Indicates that an error occurred because the Gift Certificate has been fully redeemed.

## Properties

## Constructor Summary

## Method Summary

### createGiftCertificate

**Signature:** `static createGiftCertificate(amount : Number, code : String) : GiftCertificate`

Creates a Gift Certificate.

### createGiftCertificate

**Signature:** `static createGiftCertificate(amount : Number) : GiftCertificate`

Creates a Gift Certificate.

### getGiftCertificate

**Signature:** `static getGiftCertificate(giftCertificateCode : String) : GiftCertificate`

Returns the Gift Certificate identified by the specified gift certificate code.

### getGiftCertificateByCode

**Signature:** `static getGiftCertificateByCode(giftCertificateCode : String) : GiftCertificate`

Returns the Gift Certificate identified by the specified gift certificate code.

### getGiftCertificateByMerchantID

**Signature:** `static getGiftCertificateByMerchantID(merchantID : String) : GiftCertificate`

Returns the Gift Certificate identified by the specified merchant ID.

### redeemGiftCertificate

**Signature:** `static redeemGiftCertificate(paymentInstrument : OrderPaymentInstrument) : Status`

Redeems an amount from a Gift Certificate.

## Method Detail

## Method Details

### createGiftCertificate

**Signature:** `static createGiftCertificate(amount : Number, code : String) : GiftCertificate`

**Description:** Creates a Gift Certificate. If a non-empty Gift Certificate code is specified, the code will be used to create the Gift Certificate. Be aware that this code must be unique for the current site. If it is not unique, the Gift Certificate will not be created.

**Parameters:**

- `amount`: the amount of the gift certificate. Must not be negative or zero.
- `code`: the code for the new gift certificate. If parameter is null or empty , the system will assign a code to the new gift certificate.

**Returns:**

the newly created Gift Certificate.

---

### createGiftCertificate

**Signature:** `static createGiftCertificate(amount : Number) : GiftCertificate`

**Description:** Creates a Gift Certificate. The system will assign a code to the new Gift Certificate.

**Parameters:**

- `amount`: the amount of the gift certificate. Must not be negative or zero.

**Returns:**

the newly created Gift Certificate.

---

### getGiftCertificate

**Signature:** `static getGiftCertificate(giftCertificateCode : String) : GiftCertificate`

**Description:** Returns the Gift Certificate identified by the specified gift certificate code.

**Deprecated:**

Use getGiftCertificateByCode(String)

**Parameters:**

- `giftCertificateCode`: to identify the Gift Certificate.

**Returns:**

the Gift Certificate identified by the specified code or null.

---

### getGiftCertificateByCode

**Signature:** `static getGiftCertificateByCode(giftCertificateCode : String) : GiftCertificate`

**Description:** Returns the Gift Certificate identified by the specified gift certificate code.

**Parameters:**

- `giftCertificateCode`: to identify the Gift Certificate.

**Returns:**

the Gift Certificate identified by the specified code or null.

---

### getGiftCertificateByMerchantID

**Signature:** `static getGiftCertificateByMerchantID(merchantID : String) : GiftCertificate`

**Description:** Returns the Gift Certificate identified by the specified merchant ID.

**Parameters:**

- `merchantID`: to identify the Gift Certificate.

**Returns:**

the Gift Certificate identified by the specified merchant ID or null.

---

### redeemGiftCertificate

**Signature:** `static redeemGiftCertificate(paymentInstrument : OrderPaymentInstrument) : Status`

**Description:** Redeems an amount from a Gift Certificate. The Gift Certificate ID is specified in the OrderPaymentInstrument and the amount specified in the PaymentTransaction associated with the OrderPaymentInstrument. If the PaymentTransaction.getTransactionID() is not null, the value returned by this method is used as the 'Order Number' for the redemption transaction. The 'Order Number' is visible via the Business Manager.

**Parameters:**

- `paymentInstrument`: the OrderPaymentInstrument containing the ID of the Gift Certificate to redeem, and the amount of the redemption.

**Returns:**

the status of the redemption operation.

---
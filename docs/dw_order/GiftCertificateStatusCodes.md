## Package: dw.order

# Class GiftCertificateStatusCodes

## Inheritance Hierarchy

- Object
  - dw.order.GiftCertificateStatusCodes

## Description

Helper class containing status codes for the various errors that can occur when redeeming a gift certificate. One of these codes is returned as part of a Status object when a unsuccessful call to the RedeemGiftCertificate pipelet is made.

## Constants

### GIFTCERTIFICATE_CURRENCY_MISMATCH

**Type:** String = "GIFTCERTIFICATE_CURRENCY_MISMATCH"

Indicates that an error occurred because the Gift Certificate was in a different currency than the Basket.

### GIFTCERTIFICATE_DISABLED

**Type:** String = "GIFTCERTIFICATE_DISABLED"

Indicates that an error occurred because the Gift Certificate is currently disabled.

### GIFTCERTIFICATE_INSUFFICIENT_BALANCE

**Type:** String = "GIFTCERTIFICATE_INSUFFICIENT_BALANCE"

Indicates that an error occurred because the Gift Certificate does not have a sufficient balance to perform the requested operation.

### GIFTCERTIFICATE_NOT_FOUND

**Type:** String = "GIFTCERTIFICATE_NOT_FOUND"

Indicates that an error occurred because the Gift Certificate was not found.

### GIFTCERTIFICATE_PENDING

**Type:** String = "GIFTCERTIFICATE_PENDING"

Indicates that an error occurred because the Gift Certificate is pending and is not available for use.

### GIFTCERTIFICATE_REDEEMED

**Type:** String = "GIFTCERTIFICATE_REDEEMED"

Indicates that an error occurred because the Gift Certificate has been fully redeemed.

## Properties

## Constructor Summary

GiftCertificateStatusCodes()

## Method Summary

## Constructor Detail
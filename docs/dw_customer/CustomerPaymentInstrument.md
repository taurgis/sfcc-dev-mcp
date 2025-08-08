## Package: dw.customer

# Class CustomerPaymentInstrument

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.EncryptedObject
      - dw.order.PaymentInstrument
      - dw.customer.CustomerPaymentInstrument

## Description

Represents any payment instrument stored in the customers profile, such as credit card or bank transfer. The object defines standard methods for credit card payment, and can be extended by attributes appropriate for other payment methods.

## Properties

### bankAccountDriversLicense

**Type:** String (Read Only)

The driver's license number of the bank account number
 if the calling context meets the following criteria: 
 
 
 If the method call happens in the context of a storefront request and
 the current customer is registered and authenticated, and the payment
 instrument is associated to the profile of the current customer, and
 the current protocol is HTTPS
 
 
 Otherwise, the method returns the masked driver's license number of the bank account.
 
 Note: this method handles sensitive financial and card holder data.
 Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

### bankAccountNumber

**Type:** String (Read Only)

The bank account number if the calling context meets
 the following criteria: 
 
 
 If the method call happens in the context of a storefront request,
 the current customer is registered and authenticated, the payment
 instrument is associated to the profile of the current customer, and
 the current protocol is HTTPS
 
 
 Otherwise, the method returns the masked bank account number.
 
 Note: this method handles sensitive financial and card holder data.
 Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

### creditCardNumber

**Type:** String (Read Only)

The decrypted credit card number if the calling context meets
 the following criteria: 
 
 
 If the method call happens in the context of a storefront request,
 the current customer is registered and authenticated, the payment
 instrument is associated to the profile of the current customer, and
 the current protocol is HTTPS.
 
 
 Otherwise, the method returns the masked credit card number.
 
 Note: this method handles sensitive financial and card holder data.
 Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

## Constructor Summary

## Method Summary

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

Returns the driver's license number of the bank account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS Otherwise, the method returns the masked driver's license number of the bank account.

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

Returns the bank account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request, the current customer is registered and authenticated, the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS Otherwise, the method returns the masked bank account number.

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

Returns the decrypted credit card number if the calling context meets the following criteria: If the method call happens in the context of a storefront request, the current customer is registered and authenticated, the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS.

## Method Detail

## Method Details

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

**Description:** Returns the driver's license number of the bank account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS Otherwise, the method returns the masked driver's license number of the bank account. Note: this method handles sensitive financial and card holder data. Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

---

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

**Description:** Returns the bank account number if the calling context meets the following criteria: If the method call happens in the context of a storefront request, the current customer is registered and authenticated, the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS Otherwise, the method returns the masked bank account number. Note: this method handles sensitive financial and card holder data. Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

---

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

**Description:** Returns the decrypted credit card number if the calling context meets the following criteria: If the method call happens in the context of a storefront request, the current customer is registered and authenticated, the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS. Otherwise, the method returns the masked credit card number. Note: this method handles sensitive financial and card holder data. Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

---
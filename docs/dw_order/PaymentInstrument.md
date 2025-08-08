## Package: dw.order

# Class PaymentInstrument

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.customer.EncryptedObject
      - dw.order.PaymentInstrument

## Description

Base class for payment instrument either stored in the customers profile or related to an order. A payment instrument can be credit card or bank transfer. The object defines standard methods for credit card payment, and can be extended by attributes appropriate for other payment methods. Note: this class handles sensitive financial and card holder data. Pay special attention to PCI DSS v3. requirements 1, 3, 7, and 9.

## Constants

## Properties

### bankAccountDriversLicense

**Type:** String

The driver's license number associated with the bank account if the
 calling context meets the following criteria: 
 
 
 If the instance is a CustomerPaymentInstrument, and
 we are in the context of a storefront request, and the current customer
 is registered and authenticated, and the payment instrument is associated
 to the profile of the current customer, and the current protocol is HTTPS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and we are in
 the context of a storefront request, and the current customer is identical
 to the customer related to the basket, and the current protocol is HTTPS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and we are in
 the context of a business manager request, and the current user has the
 permission MANAGE_ORDERS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and the account information
 has not been masked as a result of the data retention security policy
 for the site
 
 
 
 Otherwise, the method returns the masked driver's license number. If a basket is reopened with
 OrderMgr.failOrder(Order, Boolean), it always masks sensitive information
 because during order creation, basket payment information is permanently masked.

### bankAccountDriversLicenseLastDigits

**Type:** String (Read Only)

The last 4 characters of the decrypted driver's license number of
 the bank account associated with this PaymentInstrument.

 If the number is empty or null
 it will be returned without an exception.

### bankAccountDriversLicenseStateCode

**Type:** String

The driver's license state code associated with a bank account payment instrument.
 Returns null for other payment methods.

### bankAccountHolder

**Type:** String

The full name of the holder of a bank account payment instrument.
 Returns null for other payment methods.

### bankAccountNumber

**Type:** String

The bank account number if the calling context meets
 the following criteria: 
 
 
 If the instance is a CustomerPaymentInstrument, and
 we are in the context of a storefront request, and the current customer
 is registered and authenticated, and the payment instrument is associated
 to the profile of the current customer, and the current protocol is HTTPS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and we are in
 the context of a storefront request, and the current customer is identical
 to the customer related to the basket, and the current protocol is HTTPS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and we are in
 the context of a business manager request, and the current user has the
 permission MANAGE_ORDERS
 
 
 If the instance is a OrderPaymentInstrumentInfo, and the account information
 has not been masked as a result of the data retention security policy
 for the site
 
 
 
 Otherwise, the method returns the masked bank account number. If a basket is reopened with
 OrderMgr.failOrder(Order, Boolean), it always masks sensitive information
 because during order creation, basket payment information is permanently masked.

### bankAccountNumberLastDigits

**Type:** String (Read Only)

The last 4 characters of the decrypted bank account number.

 If the number is empty or null,
 it will be returned without an exception.

### bankRoutingNumber

**Type:** String

The bank routing number of a bank account payment instrument.
 Returns null for other payment methods.

 If account information has been masked due to the data retention security
 policy for the site, the return value is fully masked.

### creditCardExpirationMonth

**Type:** Number

The month of the year in which the credit card
 expires (1-12).

### creditCardExpirationYear

**Type:** Number

The year in which the credit card
 expires, such as '2004'.

### creditCardExpired

**Type:** boolean (Read Only)

Returns true if this payment instrument represents an expired credit
 card. This check is only logical if the credit card expiration month and
 year are set. If either of these attributes are not set, then this method
 always returns false.

### creditCardHolder

**Type:** String

The name of the credit card owner.

### creditCardIssueNumber

**Type:** String

The credit card issue number.  This attribute is only used by
 specific credit/debit card processors such as Solo and Switch in the UK.

### creditCardNumber

**Type:** String

The decrypted credit card number if the calling context meets
 the following criteria: 
 
 
 If the instance is a CustomerPaymentInstrument, and
 we are in the context of a storefront request, and the current customer
 is registered and authenticated, and the payment instrument is associated
 to the profile of the current customer, and the current protocol is HTTPS
 
 
 If the instance is a OrderPaymentInstrument in the context of a storefront request, and
 the current authenticated customer is referenced by the basket or order, and
 the current protocol is HTTPS.
 
 
 If the customer is anonymous, and the customer is referenced by the order, and the protocol is secure and
 the order status is CREATED.
 
 
 If the instance is a OrderPaymentInstrument, and we are in
 the context of a business manager request, and the current user has the
 permission MANAGE_ORDERS
 
 
 If the instance is a OrderPaymentInstrument, and the account information
 has not been masked as a result of the data retention security policy
 for the site
 
 
 
 Otherwise, the method returns the masked credit card number. If a basket is reopened with
 OrderMgr.failOrder(Order, Boolean), it always masks sensitive information
 because during order creation, basket payment information is permanently masked.

### creditCardNumberLastDigits

**Type:** String (Read Only)

The last 4 characters of the decrypted credit card number.

 If the number is empty or null
 it will be returned without an exception.

### creditCardToken

**Type:** String

Secure credit card data can be replaced by a token by utilizing a
 tokenization provider, which securely stores the credit card data using
 the token as a key. The stored data can later reused by including the
 token in a request. In this way credit card processes such as
 authorization and capture can be implemented without being responsible
 for persisting the credit card data.

### creditCardType

**Type:** String

The type of the credit card.

### creditCardValidFromMonth

**Type:** Number

The month of the year in which the credit card became
 valid (1-12).  This attribute is not used by all credit card types.

### creditCardValidFromYear

**Type:** Number

The year in which the credit card became valid, such as '2001'.
 This attribute is not used by all credit card types.

### giftCertificateCode

**Type:** String

The Gift Certificate code for this Payment Instrument.

### giftCertificateID

**Type:** String

The Gift Certificate ID for this Payment Instrument.

### maskedBankAccountDriversLicense

**Type:** String (Read Only)

The decrypted driver's license number of the bank account with
 all but the last 4 characters replaced with a '*' character.

 If the driver's license number is empty,
 it will be returned without an exception.

### maskedBankAccountNumber

**Type:** String (Read Only)

The decrypted bank account number with
 all but the last 4 characters replaced with a '*' character.

 If the number is empty (i.e. "" or null),
 it will be returned without an exception.

### maskedCreditCardNumber

**Type:** String (Read Only)

The decrypted credit card number with
 all but the last 4 characters replaced with a '*' character.

 If the number is empty,
 it will be returned without an exception.

### maskedGiftCertificateCode

**Type:** String (Read Only)

The masked gift certificate code with
 all but the last 4 characters replaced with a '*' character.

### paymentMethod

**Type:** String (Read Only)

The identifier of the payment method represented by this
 payment instrument.

### permanentlyMasked

**Type:** boolean (Read Only)

Returns true if the account information for this Payment Instrument
 has been permanently masked as a result of the data retention security policy
 for the site or a creditcard tokenization, and false otherwise.

 When account information is masked only the last 4 digits of the credit card
 or bank account number are recoverable.  The bank account driver's license number
 and bank routing number are completely masked.

## Constructor Summary

## Method Summary

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

Returns the driver's license number associated with the bank account if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a storefront request, and the current customer is identical to the customer related to the basket, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a business manager request, and the current user has the permission MANAGE_ORDERS If the instance is a OrderPaymentInstrumentInfo, and the account information has not been masked as a result of the data retention security policy for the site

### getBankAccountDriversLicenseLastDigits

**Signature:** `getBankAccountDriversLicenseLastDigits() : String`

Returns the last 4 characters of the decrypted driver's license number of the bank account associated with this PaymentInstrument.

### getBankAccountDriversLicenseLastDigits

**Signature:** `getBankAccountDriversLicenseLastDigits(count : Number) : String`

Returns the last specified number of characters of the decrypted driver's license number of the bank account associated with this PaymentInstrument.

### getBankAccountDriversLicenseStateCode

**Signature:** `getBankAccountDriversLicenseStateCode() : String`

Returns the driver's license state code associated with a bank account payment instrument.

### getBankAccountHolder

**Signature:** `getBankAccountHolder() : String`

Returns the full name of the holder of a bank account payment instrument.

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

Returns the bank account number if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a storefront request, and the current customer is identical to the customer related to the basket, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a business manager request, and the current user has the permission MANAGE_ORDERS If the instance is a OrderPaymentInstrumentInfo, and the account information has not been masked as a result of the data retention security policy for the site

### getBankAccountNumberLastDigits

**Signature:** `getBankAccountNumberLastDigits() : String`

Returns the last 4 characters of the decrypted bank account number.

### getBankAccountNumberLastDigits

**Signature:** `getBankAccountNumberLastDigits(count : Number) : String`

Returns the last specified number of characters of the decrypted bank account card number.

### getBankRoutingNumber

**Signature:** `getBankRoutingNumber() : String`

Returns the bank routing number of a bank account payment instrument.

### getCreditCardExpirationMonth

**Signature:** `getCreditCardExpirationMonth() : Number`

Returns the month of the year in which the credit card expires (1-12).

### getCreditCardExpirationYear

**Signature:** `getCreditCardExpirationYear() : Number`

Returns the year in which the credit card expires, such as '2004'.

### getCreditCardHolder

**Signature:** `getCreditCardHolder() : String`

Returns the name of the credit card owner.

### getCreditCardIssueNumber

**Signature:** `getCreditCardIssueNumber() : String`

Returns the credit card issue number.

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

Returns the decrypted credit card number if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrument in the context of a storefront request, and the current authenticated customer is referenced by the basket or order, and the current protocol is HTTPS.

### getCreditCardNumberLastDigits

**Signature:** `getCreditCardNumberLastDigits() : String`

Returns the last 4 characters of the decrypted credit card number.

### getCreditCardNumberLastDigits

**Signature:** `getCreditCardNumberLastDigits(count : Number) : String`

Returns the last specified number of characters of the decrypted credit card number.

### getCreditCardToken

**Signature:** `getCreditCardToken() : String`

Secure credit card data can be replaced by a token by utilizing a tokenization provider, which securely stores the credit card data using the token as a key.

### getCreditCardType

**Signature:** `getCreditCardType() : String`

Returns the type of the credit card.

### getCreditCardValidFromMonth

**Signature:** `getCreditCardValidFromMonth() : Number`

Returns the month of the year in which the credit card became valid (1-12).

### getCreditCardValidFromYear

**Signature:** `getCreditCardValidFromYear() : Number`

Returns the year in which the credit card became valid, such as '2001'.

### getEncryptedBankAccountDriversLicense

**Signature:** `getEncryptedBankAccountDriversLicense(algorithm : String, publicKey : String) : String`

Encrypts the driver's license number of the bank account of this object with the given algorithm and the given public key.

### getEncryptedBankAccountNumber

**Signature:** `getEncryptedBankAccountNumber(algorithm : String, publicKey : String) : String`

Encrypts the bank account number of this object with the given algorithm and the given public key.

### getEncryptedCreditCardNumber

**Signature:** `getEncryptedCreditCardNumber(algorithm : String, publicKey : String) : String`

Encrypts the credit card number of this object with the given algorithm and the given public key.

### getEncryptedCreditCardNumber

**Signature:** `getEncryptedCreditCardNumber(algorithm : String, certificateRef : CertificateRef) : String`

Encrypts the credit card number of this object with the given algorithm and the public key taken from a certificate in the keystore.

### getGiftCertificateCode

**Signature:** `getGiftCertificateCode() : String`

Returns the Gift Certificate code for this Payment Instrument.

### getGiftCertificateID

**Signature:** `getGiftCertificateID() : String`

Returns the Gift Certificate ID for this Payment Instrument.

### getMaskedBankAccountDriversLicense

**Signature:** `getMaskedBankAccountDriversLicense() : String`

Returns the decrypted driver's license number of the bank account with all but the last 4 characters replaced with a '*' character.

### getMaskedBankAccountDriversLicense

**Signature:** `getMaskedBankAccountDriversLicense(ignore : Number) : String`

Returns the decrypted driver's license number of the bank account with all but the specified number characters replaced with a '*' character.

### getMaskedBankAccountNumber

**Signature:** `getMaskedBankAccountNumber() : String`

Returns the decrypted bank account number with all but the last 4 characters replaced with a '*' character.

### getMaskedBankAccountNumber

**Signature:** `getMaskedBankAccountNumber(ignore : Number) : String`

Returns the decrypted bank account number with all but the specified number characters replaced with a '*' character.

### getMaskedCreditCardNumber

**Signature:** `getMaskedCreditCardNumber() : String`

Returns the decrypted credit card number with all but the last 4 characters replaced with a '*' character.

### getMaskedCreditCardNumber

**Signature:** `getMaskedCreditCardNumber(ignore : Number) : String`

Returns the decrypted credit card number with all but the specified number characters replaced with a '*' character.

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode() : String`

Returns the masked gift certificate code with all but the last 4 characters replaced with a '*' character.

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode(ignore : Number) : String`

Returns the masked gift certificate code with all but the specified number of characters replaced with a '*' character.

### getPaymentMethod

**Signature:** `getPaymentMethod() : String`

Returns the identifier of the payment method represented by this payment instrument.

### isCreditCardExpired

**Signature:** `isCreditCardExpired() : boolean`

Returns true if this payment instrument represents an expired credit card.

### isPermanentlyMasked

**Signature:** `isPermanentlyMasked() : boolean`

Returns true if the account information for this Payment Instrument has been permanently masked as a result of the data retention security policy for the site or a creditcard tokenization, and false otherwise.

### setBankAccountDriversLicense

**Signature:** `setBankAccountDriversLicense(license : String) : void`

Set the driver's license number associated with a bank account payment instrument.

### setBankAccountDriversLicenseStateCode

**Signature:** `setBankAccountDriversLicenseStateCode(stateCode : String) : void`

Set the driver's license state code associated with a bank account payment instrument.

### setBankAccountHolder

**Signature:** `setBankAccountHolder(holder : String) : void`

Set the full name of the holder of a bank account payment instrument.

### setBankAccountNumber

**Signature:** `setBankAccountNumber(accountNumber : String) : void`

Set the bank account number of a bank account payment instrument.

### setBankRoutingNumber

**Signature:** `setBankRoutingNumber(routingNumber : String) : void`

Set the bank routing number of a bank account payment instrument.

### setCreditCardExpirationMonth

**Signature:** `setCreditCardExpirationMonth(aValue : Number) : void`

Sets the month of the year in which the credit card expires.

### setCreditCardExpirationYear

**Signature:** `setCreditCardExpirationYear(aValue : Number) : void`

Sets the year in which the credit card expires, such as '2004'.

### setCreditCardHolder

**Signature:** `setCreditCardHolder(aValue : String) : void`

Sets the name of the credit card owner.

### setCreditCardIssueNumber

**Signature:** `setCreditCardIssueNumber(aValue : String) : void`

Set the credit card issue number.

### setCreditCardNumber

**Signature:** `setCreditCardNumber(aValue : String) : void`

Sets the credit card number for this payment.

### setCreditCardToken

**Signature:** `setCreditCardToken(token : String) : void`

Secure credit card data can be replaced by a token by utilizing a tokenization provider, which securely stores the credit card data using the token as a key.

### setCreditCardType

**Signature:** `setCreditCardType(aValue : String) : void`

Sets the type of the credit card.

### setCreditCardValidFromMonth

**Signature:** `setCreditCardValidFromMonth(aValue : Number) : void`

Sets the month of the year in which the credit card became valid (1-12).

### setCreditCardValidFromYear

**Signature:** `setCreditCardValidFromYear(aValue : Number) : void`

Sets the year in which the credit card became valid, such as '2001'.

### setGiftCertificateCode

**Signature:** `setGiftCertificateCode(giftCertificateCode : String) : void`

Sets the Gift Certificate code for this Payment Instrument.

### setGiftCertificateID

**Signature:** `setGiftCertificateID(giftCertificateID : String) : void`

Sets the Gift Certificate ID for this Payment Instrument.

## Method Detail

## Method Details

### getBankAccountDriversLicense

**Signature:** `getBankAccountDriversLicense() : String`

**Description:** Returns the driver's license number associated with the bank account if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a storefront request, and the current customer is identical to the customer related to the basket, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a business manager request, and the current user has the permission MANAGE_ORDERS If the instance is a OrderPaymentInstrumentInfo, and the account information has not been masked as a result of the data retention security policy for the site Otherwise, the method returns the masked driver's license number. If a basket is reopened with OrderMgr.failOrder(Order, Boolean), it always masks sensitive information because during order creation, basket payment information is permanently masked.

**Returns:**

the driver's license number if the calling context meets the necessary criteria.

**See Also:**

isPermanentlyMasked()

---

### getBankAccountDriversLicenseLastDigits

**Signature:** `getBankAccountDriversLicenseLastDigits() : String`

**Description:** Returns the last 4 characters of the decrypted driver's license number of the bank account associated with this PaymentInstrument. If the number is empty or null it will be returned without an exception.

**Returns:**

the last 4 characters of the de-crypted driver's license number.

---

### getBankAccountDriversLicenseLastDigits

**Signature:** `getBankAccountDriversLicenseLastDigits(count : Number) : String`

**Description:** Returns the last specified number of characters of the decrypted driver's license number of the bank account associated with this PaymentInstrument. If the number is empty (i.e. "" or null), it will be returned without an exception. Note that count is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `count`: number of characters to be returned.

**Returns:**

the last specified number of characters of the decrypted driver's license number.

**See Also:**

isPermanentlyMasked()

---

### getBankAccountDriversLicenseStateCode

**Signature:** `getBankAccountDriversLicenseStateCode() : String`

**Description:** Returns the driver's license state code associated with a bank account payment instrument. Returns null for other payment methods.

**Returns:**

the state in which the bank account driver's license was issued.

---

### getBankAccountHolder

**Signature:** `getBankAccountHolder() : String`

**Description:** Returns the full name of the holder of a bank account payment instrument. Returns null for other payment methods.

**Returns:**

the bank account holder's full name.

---

### getBankAccountNumber

**Signature:** `getBankAccountNumber() : String`

**Description:** Returns the bank account number if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a storefront request, and the current customer is identical to the customer related to the basket, and the current protocol is HTTPS If the instance is a OrderPaymentInstrumentInfo, and we are in the context of a business manager request, and the current user has the permission MANAGE_ORDERS If the instance is a OrderPaymentInstrumentInfo, and the account information has not been masked as a result of the data retention security policy for the site Otherwise, the method returns the masked bank account number. If a basket is reopened with OrderMgr.failOrder(Order, Boolean), it always masks sensitive information because during order creation, basket payment information is permanently masked.

**Returns:**

the bank account number if the calling context meets the necessary criteria.

**See Also:**

isPermanentlyMasked()

---

### getBankAccountNumberLastDigits

**Signature:** `getBankAccountNumberLastDigits() : String`

**Description:** Returns the last 4 characters of the decrypted bank account number. If the number is empty or null, it will be returned without an exception.

**Returns:**

the last 4 characters of the decrypted bank account number.

---

### getBankAccountNumberLastDigits

**Signature:** `getBankAccountNumberLastDigits(count : Number) : String`

**Description:** Returns the last specified number of characters of the decrypted bank account card number. If the number is empty (i.e. "" or null), it will be returned without an exception. Note that count is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `count`: number of characters to be returned.

**Returns:**

the last specified characters of the decrypted bank account number.

**See Also:**

isPermanentlyMasked()

---

### getBankRoutingNumber

**Signature:** `getBankRoutingNumber() : String`

**Description:** Returns the bank routing number of a bank account payment instrument. Returns null for other payment methods. If account information has been masked due to the data retention security policy for the site, the return value is fully masked.

**Returns:**

the bank account rounting number.

**See Also:**

isPermanentlyMasked()

---

### getCreditCardExpirationMonth

**Signature:** `getCreditCardExpirationMonth() : Number`

**Description:** Returns the month of the year in which the credit card expires (1-12).

**Returns:**

the month of the year in which the credit card expires (1-12).

---

### getCreditCardExpirationYear

**Signature:** `getCreditCardExpirationYear() : Number`

**Description:** Returns the year in which the credit card expires, such as '2004'.

**Returns:**

the year in which the credit card expires.

---

### getCreditCardHolder

**Signature:** `getCreditCardHolder() : String`

**Description:** Returns the name of the credit card owner.

**Returns:**

the name of the credit card owner.

---

### getCreditCardIssueNumber

**Signature:** `getCreditCardIssueNumber() : String`

**Description:** Returns the credit card issue number. This attribute is only used by specific credit/debit card processors such as Solo and Switch in the UK.

**Returns:**

the credit card issue number

---

### getCreditCardNumber

**Signature:** `getCreditCardNumber() : String`

**Description:** Returns the decrypted credit card number if the calling context meets the following criteria: If the instance is a CustomerPaymentInstrument, and we are in the context of a storefront request, and the current customer is registered and authenticated, and the payment instrument is associated to the profile of the current customer, and the current protocol is HTTPS If the instance is a OrderPaymentInstrument in the context of a storefront request, and the current authenticated customer is referenced by the basket or order, and the current protocol is HTTPS. If the customer is anonymous, and the customer is referenced by the order, and the protocol is secure and the order status is CREATED. If the instance is a OrderPaymentInstrument, and we are in the context of a business manager request, and the current user has the permission MANAGE_ORDERS If the instance is a OrderPaymentInstrument, and the account information has not been masked as a result of the data retention security policy for the site Otherwise, the method returns the masked credit card number. If a basket is reopened with OrderMgr.failOrder(Order, Boolean), it always masks sensitive information because during order creation, basket payment information is permanently masked.

**Returns:**

the decrypted credit card number if the calling context meets the necessary criteria.

**See Also:**

isPermanentlyMasked()

---

### getCreditCardNumberLastDigits

**Signature:** `getCreditCardNumberLastDigits() : String`

**Description:** Returns the last 4 characters of the decrypted credit card number. If the number is empty or null it will be returned without an exception.

**Returns:**

the last 4 characters of the de-crypted credit card number.

---

### getCreditCardNumberLastDigits

**Signature:** `getCreditCardNumberLastDigits(count : Number) : String`

**Description:** Returns the last specified number of characters of the decrypted credit card number. If the number is empty (i.e. "" or null), it will be returned without an exception. Note that count is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `count`: number of characters to be returned.

**Returns:**

the last specified number of characters of the decrypted credit card number.

**See Also:**

isPermanentlyMasked()

---

### getCreditCardToken

**Signature:** `getCreditCardToken() : String`

**Description:** Secure credit card data can be replaced by a token by utilizing a tokenization provider, which securely stores the credit card data using the token as a key. The stored data can later reused by including the token in a request. In this way credit card processes such as authorization and capture can be implemented without being responsible for persisting the credit card data.

**Returns:**

the token

---

### getCreditCardType

**Signature:** `getCreditCardType() : String`

**Description:** Returns the type of the credit card.

**Returns:**

the type of the credit card.

---

### getCreditCardValidFromMonth

**Signature:** `getCreditCardValidFromMonth() : Number`

**Description:** Returns the month of the year in which the credit card became valid (1-12). This attribute is not used by all credit card types.

**Returns:**

the month of the year in which the credit card became valid (1-12).

---

### getCreditCardValidFromYear

**Signature:** `getCreditCardValidFromYear() : Number`

**Description:** Returns the year in which the credit card became valid, such as '2001'. This attribute is not used by all credit card types.

**Returns:**

the year in which the credit card became valid

---

### getEncryptedBankAccountDriversLicense

**Signature:** `getEncryptedBankAccountDriversLicense(algorithm : String, publicKey : String) : String`

**Description:** Encrypts the driver's license number of the bank account of this object with the given algorithm and the given public key. Returned is the Base64 encoded representation of the result. See also Cipher.encrypt(String, String, String, String, Number) on how to generate RSA key pairs. If account information has been masked due to the data retention security policy for the site, the returned value is the Base64 encoded representation of the encrypted form of the masked number.

**Parameters:**

- `algorithm`: The algorithm to be used for the encryption of this credit card number. Must be a valid, non-null algorithm. Currently, only the following algorithms are supported: ENCRYPTION_ALGORITHM_RSA – outdated, please do not use anymore ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING – the current algorithm
- `publicKey`: A Base64 encoded form of the public key to be used to encrypt this bank account driver's license number. Must be a valid, non-blank key.

**Returns:**

the Base64 encoded representation of the bank account driver's license.

**Throws:**

IllegalArgumentException - If algorithm is not a valid known algorithm.
IllegalArgumentException - If publicKey is a null, empty or blank string.

---

### getEncryptedBankAccountNumber

**Signature:** `getEncryptedBankAccountNumber(algorithm : String, publicKey : String) : String`

**Description:** Encrypts the bank account number of this object with the given algorithm and the given public key. Returned is the Base64 encoded representation of the result. If account information has been masked due to the data retention security policy for the site, the returned value is the Base64 encoded representation of the encrypted form of the masked number.

**Parameters:**

- `algorithm`: The algorithm to be used for the encryption of this credit card number. Must be a valid, non-null algorithm. Currently, only the following algorithms are supported: ENCRYPTION_ALGORITHM_RSA – outdated, please do not use anymore ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING – the current algorithm
- `publicKey`: A Base64 encoded form of the public key to be used to encrypt this credit card number. Must be a valid, non-blank key.

**Returns:**

the Base64 encoded representation of the bank account number.

**See Also:**

isPermanentlyMasked()

**Throws:**

IllegalArgumentException - If algorithm is not a valid known algorithm.
IllegalArgumentException - If publicKey is a null, empty or blank string.

---

### getEncryptedCreditCardNumber

**Signature:** `getEncryptedCreditCardNumber(algorithm : String, publicKey : String) : String`

**Description:** Encrypts the credit card number of this object with the given algorithm and the given public key. Returned is the Base64 encoded representation of the result. See also Cipher.encrypt(String, String, String, String, Number) on how to generate RSA key pairs. If account information has been masked due to the data retention security policy for the site, the returned value is the Base64 encoded representation of the encrypted form of the masked number.

**Deprecated:**

Please use getEncryptedCreditCardNumber(String, CertificateRef) instead.

**Parameters:**

- `algorithm`: The algorithm to be used for the encryption of this credit card number. Must be a valid, non-null algorithm. Currently, only the following algorithms are supported: ENCRYPTION_ALGORITHM_RSA – outdated, please do not use anymore ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING – the current algorithm
- `publicKey`: A Base64 encoded form of the public key to be used to encrypt this credit card number. Must be a valid, non-blank key.

**Returns:**

the Base64 encoded representation of the credit card number.

**See Also:**

isPermanentlyMasked()

**Throws:**

IllegalArgumentException - If algorithm is not a valid known algorithm.
IllegalArgumentException - If publicKey is a null, empty or blank string.

---

### getEncryptedCreditCardNumber

**Signature:** `getEncryptedCreditCardNumber(algorithm : String, certificateRef : CertificateRef) : String`

**Description:** Encrypts the credit card number of this object with the given algorithm and the public key taken from a certificate in the keystore. Returned is the Base64 encoded representation of the result. See also Cipher.encrypt(String, CertificateRef, String, String, Number) on how to generate RSA key pairs. If account information has been masked due to the data retention security policy for the site, the returned value is the Base64 encoded representation of the encrypted form of the masked number.

**Parameters:**

- `algorithm`: The algorithm to be used for the encryption of this credit card number. Must be a valid, non-null algorithm. Currently, only the following algorithms are supported: ENCRYPTION_ALGORITHM_RSA – outdated, please do not use anymore ENCRYPTION_ALGORITHM_RSA_ECB_OAEPWITHSHA56ANDMGF1PADDING – the current algorithm
- `certificateRef`: A reference to a trusted certificate entry containing the public key in the keystore. Must be non-null.

**Returns:**

the Base64 encoded representation of the credit card number.

**See Also:**

isPermanentlyMasked()

**Throws:**

IllegalArgumentException - If algorithm is not a valid known algorithm.
IllegalArgumentException - If certificateRef is null or could not be found.

---

### getGiftCertificateCode

**Signature:** `getGiftCertificateCode() : String`

**Description:** Returns the Gift Certificate code for this Payment Instrument.

**Returns:**

the Gift Certificate code or null if not set.

---

### getGiftCertificateID

**Signature:** `getGiftCertificateID() : String`

**Description:** Returns the Gift Certificate ID for this Payment Instrument.

**Deprecated:**

Use getGiftCertificateCode()

**Returns:**

the Gift Certificate ID or null if not set.

---

### getMaskedBankAccountDriversLicense

**Signature:** `getMaskedBankAccountDriversLicense() : String`

**Description:** Returns the decrypted driver's license number of the bank account with all but the last 4 characters replaced with a '*' character. If the driver's license number is empty, it will be returned without an exception.

**Returns:**

the decrypted driver's license number with all but the last 4 characters replaced with a '*' character.

---

### getMaskedBankAccountDriversLicense

**Signature:** `getMaskedBankAccountDriversLicense(ignore : Number) : String`

**Description:** Returns the decrypted driver's license number of the bank account with all but the specified number characters replaced with a '*' character. If the driver's license number is empty (i.e. "" or null), it will be returned without an exception. Note that ignore is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `ignore`: the number of characters to leave unmasked.

**Returns:**

the decrypted driver's license number with all but the specified number characters replaced with a '*' character.

**See Also:**

isPermanentlyMasked()

---

### getMaskedBankAccountNumber

**Signature:** `getMaskedBankAccountNumber() : String`

**Description:** Returns the decrypted bank account number with all but the last 4 characters replaced with a '*' character. If the number is empty (i.e. "" or null), it will be returned without an exception.

**Returns:**

the decrypted bank account number with all but the last 4 characters replaced with a '*' character.

---

### getMaskedBankAccountNumber

**Signature:** `getMaskedBankAccountNumber(ignore : Number) : String`

**Description:** Returns the decrypted bank account number with all but the specified number characters replaced with a '*' character. If the card number is empty (i.e. "" or null), it will be returned without an exception. Note that ignore is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `ignore`: the number of characters to leave unmasked

**Returns:**

the decrypted bank account number with all but the specified number of characters replaced with a '*' character.

**See Also:**

isPermanentlyMasked()

---

### getMaskedCreditCardNumber

**Signature:** `getMaskedCreditCardNumber() : String`

**Description:** Returns the decrypted credit card number with all but the last 4 characters replaced with a '*' character. If the number is empty, it will be returned without an exception.

**Returns:**

the decrypted credit card number with all but the last 4 characters replaced with a '*' character.

---

### getMaskedCreditCardNumber

**Signature:** `getMaskedCreditCardNumber(ignore : Number) : String`

**Description:** Returns the decrypted credit card number with all but the specified number characters replaced with a '*' character. If the card number is empty (i.e. "" or null), it will be returned without an exception. Note that ignore is limited to 4 in an unsecure environment, and if account information for this payment instrument has been masked due to the data retention security policy for the site.

**Parameters:**

- `ignore`: the number of characters to leave unmasked.

**Returns:**

the decrypted credit card number with all but the specified number characters replaced with a '*' character.

**See Also:**

isPermanentlyMasked()

---

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode() : String`

**Description:** Returns the masked gift certificate code with all but the last 4 characters replaced with a '*' character.

**Returns:**

the masked gift certificate code.

---

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode(ignore : Number) : String`

**Description:** Returns the masked gift certificate code with all but the specified number of characters replaced with a '*' character.

**Parameters:**

- `ignore`: the number of characters to leave unmasked.

**Returns:**

the masked gift certificate code.

**Throws:**

IllegalArgumentException - if ignore is negative.

---

### getPaymentMethod

**Signature:** `getPaymentMethod() : String`

**Description:** Returns the identifier of the payment method represented by this payment instrument.

**Returns:**

the identifier of the payment method represented by this payment instrument.

---

### isCreditCardExpired

**Signature:** `isCreditCardExpired() : boolean`

**Description:** Returns true if this payment instrument represents an expired credit card. This check is only logical if the credit card expiration month and year are set. If either of these attributes are not set, then this method always returns false.

**Returns:**

true if this payment instrument represents an expired credit card, false otherwise

---

### isPermanentlyMasked

**Signature:** `isPermanentlyMasked() : boolean`

**Description:** Returns true if the account information for this Payment Instrument has been permanently masked as a result of the data retention security policy for the site or a creditcard tokenization, and false otherwise. When account information is masked only the last 4 digits of the credit card or bank account number are recoverable. The bank account driver's license number and bank routing number are completely masked.

**Returns:**

whether or not the account information has been masked

---

### setBankAccountDriversLicense

**Signature:** `setBankAccountDriversLicense(license : String) : void`

**Description:** Set the driver's license number associated with a bank account payment instrument.

**Parameters:**

- `license`: the bank account holder driver's license.

---

### setBankAccountDriversLicenseStateCode

**Signature:** `setBankAccountDriversLicenseStateCode(stateCode : String) : void`

**Description:** Set the driver's license state code associated with a bank account payment instrument.

**Parameters:**

- `stateCode`: the state in which the bank account driver's license was issued.

---

### setBankAccountHolder

**Signature:** `setBankAccountHolder(holder : String) : void`

**Description:** Set the full name of the holder of a bank account payment instrument.

**Parameters:**

- `holder`: the bank account holder's full name.

---

### setBankAccountNumber

**Signature:** `setBankAccountNumber(accountNumber : String) : void`

**Description:** Set the bank account number of a bank account payment instrument.

**Parameters:**

- `accountNumber`: the bank account number.

---

### setBankRoutingNumber

**Signature:** `setBankRoutingNumber(routingNumber : String) : void`

**Description:** Set the bank routing number of a bank account payment instrument.

**Parameters:**

- `routingNumber`: the bank account rounting number.

---

### setCreditCardExpirationMonth

**Signature:** `setCreditCardExpirationMonth(aValue : Number) : void`

**Description:** Sets the month of the year in which the credit card expires. Permissible values are from 1 to 12.

**Parameters:**

- `aValue`: the month of the year in which the credit card expires. Permissible values are from 1 to 12.

---

### setCreditCardExpirationYear

**Signature:** `setCreditCardExpirationYear(aValue : Number) : void`

**Description:** Sets the year in which the credit card expires, such as '2004'.

**Parameters:**

- `aValue`: the year in which the credit card expires.

---

### setCreditCardHolder

**Signature:** `setCreditCardHolder(aValue : String) : void`

**Description:** Sets the name of the credit card owner.

**Parameters:**

- `aValue`: the name of the credit card owner.

---

### setCreditCardIssueNumber

**Signature:** `setCreditCardIssueNumber(aValue : String) : void`

**Description:** Set the credit card issue number. This attribute is only used by specific credit/debit card processors such as Solo and Switch in the UK.

**Parameters:**

- `aValue`: the credit card issue number

---

### setCreditCardNumber

**Signature:** `setCreditCardNumber(aValue : String) : void`

**Description:** Sets the credit card number for this payment.

**Parameters:**

- `aValue`: the new value of the credit card number.

---

### setCreditCardToken

**Signature:** `setCreditCardToken(token : String) : void`

**Description:** Secure credit card data can be replaced by a token by utilizing a tokenization provider, which securely stores the credit card data using the token as a key. The stored data can later reused by including the token in a request. In this way credit card processes such as authorization and capture can be implemented without being responsible for persisting the credit card data. An Exception will be thrown when the token is null or blank. When setting a credit card token, the account information (including the creditcard number) is masked and all creditcard attributes are frozen and an attempt to change will be result in an exception.

**Parameters:**

- `token`: the token

**See Also:**

isPermanentlyMasked()

---

### setCreditCardType

**Signature:** `setCreditCardType(aValue : String) : void`

**Description:** Sets the type of the credit card.

**Parameters:**

- `aValue`: the type of the credit card.

---

### setCreditCardValidFromMonth

**Signature:** `setCreditCardValidFromMonth(aValue : Number) : void`

**Description:** Sets the month of the year in which the credit card became valid (1-12). This attribute is not used by all credit card types

**Parameters:**

- `aValue`: the month of the year in which the credit card became valid (1-12).

---

### setCreditCardValidFromYear

**Signature:** `setCreditCardValidFromYear(aValue : Number) : void`

**Description:** Sets the year in which the credit card became valid, such as '2001'. This attribute is not used by all credit card types.

**Parameters:**

- `aValue`: the year in which the credit card became valid

---

### setGiftCertificateCode

**Signature:** `setGiftCertificateCode(giftCertificateCode : String) : void`

**Description:** Sets the Gift Certificate code for this Payment Instrument.

**Parameters:**

- `giftCertificateCode`: the Gift Certificate code.

---

### setGiftCertificateID

**Signature:** `setGiftCertificateID(giftCertificateID : String) : void`

**Description:** Sets the Gift Certificate ID for this Payment Instrument.

**Deprecated:**

Use setGiftCertificateCode(String)

**Parameters:**

- `giftCertificateID`: the Gift Certificate ID.

---
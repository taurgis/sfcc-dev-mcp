## Package: dw.order

# Class GiftCertificate

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.GiftCertificate

## Description

Represents a Gift Certificate that can be used to purchase products.

## Constants

## Properties

### amount

**Type:** Money (Read Only)

The original amount on the gift certificate.

### balance

**Type:** Money (Read Only)

The balance on the gift certificate.

### description

**Type:** String

The description string.

### enabled

**Type:** boolean

Returns true if the Gift Certificate is enabled, false otherwise.

### giftCertificateCode

**Type:** String (Read Only)

The code of the gift certificate. This redemption code is send to
 gift certificate recipient.

### ID

**Type:** String (Read Only)

The code of the gift certificate. This redemption code is send to
 gift certificate recipient.

### maskedGiftCertificateCode

**Type:** String (Read Only)

The masked gift certificate code with
 all but the last 4 characters replaced with a '*' character.

### merchantID

**Type:** String (Read Only)

The merchant ID of the gift certificate.

### message

**Type:** String

The message to include in the email of the person receiving
 the gift certificate.

### orderNo

**Type:** String

The order number

### recipientEmail

**Type:** String

The email address of the person receiving
 the gift certificate.

### recipientName

**Type:** String

The name of the person receiving
 the gift certificate.

### senderName

**Type:** String

The name of the person or organization that
 sent the gift certificate or null if undefined.

### status

**Type:** Number

The status where the possible values are
 STATUS_PENDING, STATUS_ISSUED, STATUS_PARTIALLY_REDEEMED
 or STATUS_REDEEMED.

## Constructor Summary

## Method Summary

### getAmount

**Signature:** `getAmount() : Money`

Returns the original amount on the gift certificate.

### getBalance

**Signature:** `getBalance() : Money`

Returns the balance on the gift certificate.

### getDescription

**Signature:** `getDescription() : String`

Returns the description string.

### getGiftCertificateCode

**Signature:** `getGiftCertificateCode() : String`

Returns the code of the gift certificate.

### getID

**Signature:** `getID() : String`

Returns the code of the gift certificate.

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode() : String`

Returns the masked gift certificate code with all but the last 4 characters replaced with a '*' character.

### getMaskedGiftCertificateCode

**Signature:** `getMaskedGiftCertificateCode(ignore : Number) : String`

Returns the masked gift certificate code with all but the specified number of characters replaced with a '*' character.

### getMerchantID

**Signature:** `getMerchantID() : String`

Returns the merchant ID of the gift certificate.

### getMessage

**Signature:** `getMessage() : String`

Returns the message to include in the email of the person receiving the gift certificate.

### getOrderNo

**Signature:** `getOrderNo() : String`

Returns the order number

### getRecipientEmail

**Signature:** `getRecipientEmail() : String`

Returns the email address of the person receiving the gift certificate.

### getRecipientName

**Signature:** `getRecipientName() : String`

Returns the name of the person receiving the gift certificate.

### getSenderName

**Signature:** `getSenderName() : String`

Returns the name of the person or organization that sent the gift certificate or null if undefined.

### getStatus

**Signature:** `getStatus() : Number`

Returns the status where the possible values are STATUS_PENDING, STATUS_ISSUED, STATUS_PARTIALLY_REDEEMED or STATUS_REDEEMED.

### isEnabled

**Signature:** `isEnabled() : boolean`

Returns true if the Gift Certificate is enabled, false otherwise.

### setDescription

**Signature:** `setDescription(description : String) : void`

An optional description that you can use to categorize the gift certificate.

### setEnabled

**Signature:** `setEnabled(enabled : boolean) : void`

Controls if the Gift Certificate is enabled.

### setMessage

**Signature:** `setMessage(message : String) : void`

Sets the message to include in the email of the person receiving the gift certificate.

### setOrderNo

**Signature:** `setOrderNo(orderNo : String) : void`

Sets the order number

### setRecipientEmail

**Signature:** `setRecipientEmail(recipientEmail : String) : void`

Sets the email address of the person receiving the gift certificate.

### setRecipientName

**Signature:** `setRecipientName(recipient : String) : void`

Sets the name of the person receiving the gift certificate.

### setSenderName

**Signature:** `setSenderName(sender : String) : void`

Sets the name of the person or organization that sent the gift certificate.

### setStatus

**Signature:** `setStatus(status : Number) : void`

Sets the status of the gift certificate.

## Method Detail

## Method Details

### getAmount

**Signature:** `getAmount() : Money`

**Description:** Returns the original amount on the gift certificate.

**Returns:**

the original amount on the gift certificate.

---

### getBalance

**Signature:** `getBalance() : Money`

**Description:** Returns the balance on the gift certificate.

**Returns:**

the balance on the gift certificate.

---

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the description string.

**Returns:**

the description.

---

### getGiftCertificateCode

**Signature:** `getGiftCertificateCode() : String`

**Description:** Returns the code of the gift certificate. This redemption code is send to gift certificate recipient.

**Returns:**

the code of the gift certificate.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the code of the gift certificate. This redemption code is send to gift certificate recipient.

**Deprecated:**

Use getGiftCertificateCode()

**Returns:**

the code of the gift certificate.

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

### getMerchantID

**Signature:** `getMerchantID() : String`

**Description:** Returns the merchant ID of the gift certificate.

**Returns:**

the merchant ID of the gift certificate.

---

### getMessage

**Signature:** `getMessage() : String`

**Description:** Returns the message to include in the email of the person receiving the gift certificate.

**Returns:**

the message to include in the email of the person receiving the gift certificate.

---

### getOrderNo

**Signature:** `getOrderNo() : String`

**Description:** Returns the order number

**Returns:**

the order number

---

### getRecipientEmail

**Signature:** `getRecipientEmail() : String`

**Description:** Returns the email address of the person receiving the gift certificate.

**Returns:**

the email address of the person receiving the gift certificate.

---

### getRecipientName

**Signature:** `getRecipientName() : String`

**Description:** Returns the name of the person receiving the gift certificate.

**Returns:**

the name of the person receiving the gift certificate.

---

### getSenderName

**Signature:** `getSenderName() : String`

**Description:** Returns the name of the person or organization that sent the gift certificate or null if undefined.

**Returns:**

the name of the person or organization that sent the gift certificate or null if undefined.

---

### getStatus

**Signature:** `getStatus() : Number`

**Description:** Returns the status where the possible values are STATUS_PENDING, STATUS_ISSUED, STATUS_PARTIALLY_REDEEMED or STATUS_REDEEMED.

**Returns:**

the status.

---

### isEnabled

**Signature:** `isEnabled() : boolean`

**Description:** Returns true if the Gift Certificate is enabled, false otherwise.

**Returns:**

true if the Gift Certificate is enabled, false otherwise.

---

### setDescription

**Signature:** `setDescription(description : String) : void`

**Description:** An optional description that you can use to categorize the gift certificate.

**Parameters:**

- `description`: additional description.

---

### setEnabled

**Signature:** `setEnabled(enabled : boolean) : void`

**Description:** Controls if the Gift Certificate is enabled.

**Parameters:**

- `enabled`: if true, enables the Gift Certificate.

---

### setMessage

**Signature:** `setMessage(message : String) : void`

**Description:** Sets the message to include in the email of the person receiving the gift certificate.

**Parameters:**

- `message`: the message to include in the email of the person receiving the gift certificate.

---

### setOrderNo

**Signature:** `setOrderNo(orderNo : String) : void`

**Description:** Sets the order number

**Parameters:**

- `orderNo`: the order number to be set

---

### setRecipientEmail

**Signature:** `setRecipientEmail(recipientEmail : String) : void`

**Description:** Sets the email address of the person receiving the gift certificate.

**Parameters:**

- `recipientEmail`: the email address of the person receiving the gift certificate.

---

### setRecipientName

**Signature:** `setRecipientName(recipient : String) : void`

**Description:** Sets the name of the person receiving the gift certificate.

**Parameters:**

- `recipient`: the name of the person receiving the gift certificate.

---

### setSenderName

**Signature:** `setSenderName(sender : String) : void`

**Description:** Sets the name of the person or organization that sent the gift certificate.

**Parameters:**

- `sender`: the name of the person or organization that sent the gift certificate.

---

### setStatus

**Signature:** `setStatus(status : Number) : void`

**Description:** Sets the status of the gift certificate. Possible values are: STATUS_ISSUED, STATUS_PENDING, STATUS_PARTIALLY_REDEEMED and STATUS_REDEEMED.

**Parameters:**

- `status`: Gift certificate status

---
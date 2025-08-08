## Package: dw.order

# Class GiftCertificateLineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItem
      - dw.order.GiftCertificateLineItem

## Description

Represents a Gift Certificate line item in the cart. When an order is processed, a Gift Certificate is created based on the information in the Gift Certificate line item.

## Properties

### giftCertificateID

**Type:** String

The ID of the gift certificate that this line item
 was used to create. If this line item has not been used to create
 a Gift Certificate, this method returns null.

### message

**Type:** String

The message to include in the email of the person receiving
 the gift certificate line item.

### productListItem

**Type:** ProductListItem

The associated ProductListItem.

### recipientEmail

**Type:** String

The email address of the person receiving
 the gift certificate line item.

### recipientName

**Type:** String

The name of the person receiving the gift certificate line item.

### senderName

**Type:** String

The name of the person or organization that
 sent the gift certificate line item or null if undefined.

### shipment

**Type:** Shipment

The associated Shipment.

## Constructor Summary

## Method Summary

### getGiftCertificateID

**Signature:** `getGiftCertificateID() : String`

Returns the ID of the gift certificate that this line item was used to create.

### getMessage

**Signature:** `getMessage() : String`

Returns the message to include in the email of the person receiving the gift certificate line item.

### getProductListItem

**Signature:** `getProductListItem() : ProductListItem`

Returns the associated ProductListItem.

### getRecipientEmail

**Signature:** `getRecipientEmail() : String`

Returns the email address of the person receiving the gift certificate line item.

### getRecipientName

**Signature:** `getRecipientName() : String`

Returns the name of the person receiving the gift certificate line item.

### getSenderName

**Signature:** `getSenderName() : String`

Returns the name of the person or organization that sent the gift certificate line item or null if undefined.

### getShipment

**Signature:** `getShipment() : Shipment`

Returns the associated Shipment.

### setGiftCertificateID

**Signature:** `setGiftCertificateID(id : String) : void`

Sets the ID of the gift certificate associated with this line item.

### setMessage

**Signature:** `setMessage(message : String) : void`

Sets the message to include in the email of the person receiving the gift certificate line item.

### setProductListItem

**Signature:** `setProductListItem(productListItem : ProductListItem) : void`

Sets the associated ProductListItem.

### setRecipientEmail

**Signature:** `setRecipientEmail(recipientEmail : String) : void`

Sets the email address of the person receiving the gift certificate line item.

### setRecipientName

**Signature:** `setRecipientName(recipient : String) : void`

Sets the name of the person receiving the gift certificate line item.

### setSenderName

**Signature:** `setSenderName(sender : String) : void`

Sets the name of the person or organization that sent the gift certificate line item.

### setShipment

**Signature:** `setShipment(shipment : Shipment) : void`

Associates the gift certificate line item with the specified shipment.

## Method Detail

## Method Details

### getGiftCertificateID

**Signature:** `getGiftCertificateID() : String`

**Description:** Returns the ID of the gift certificate that this line item was used to create. If this line item has not been used to create a Gift Certificate, this method returns null.

**Returns:**

the ID of the gift certificate or null if undefined.

---

### getMessage

**Signature:** `getMessage() : String`

**Description:** Returns the message to include in the email of the person receiving the gift certificate line item.

**Returns:**

the message to include in the email of the person receiving the gift certificate line item.

---

### getProductListItem

**Signature:** `getProductListItem() : ProductListItem`

**Description:** Returns the associated ProductListItem.

**Returns:**

item or null.

---

### getRecipientEmail

**Signature:** `getRecipientEmail() : String`

**Description:** Returns the email address of the person receiving the gift certificate line item.

**Returns:**

the email address of the person receiving the gift certificate line item.

---

### getRecipientName

**Signature:** `getRecipientName() : String`

**Description:** Returns the name of the person receiving the gift certificate line item.

**Returns:**

the name of the person receiving the gift certificate line item.

---

### getSenderName

**Signature:** `getSenderName() : String`

**Description:** Returns the name of the person or organization that sent the gift certificate line item or null if undefined.

**Returns:**

the name of the person or organization that sent the gift certificate line item or null if undefined.

---

### getShipment

**Signature:** `getShipment() : Shipment`

**Description:** Returns the associated Shipment.

**Returns:**

The shipment of the gift certificate line item

---

### setGiftCertificateID

**Signature:** `setGiftCertificateID(id : String) : void`

**Description:** Sets the ID of the gift certificate associated with this line item.

**Parameters:**

- `id`: the ID of the gift certificate associated with this line item.

---

### setMessage

**Signature:** `setMessage(message : String) : void`

**Description:** Sets the message to include in the email of the person receiving the gift certificate line item.

**Parameters:**

- `message`: the message to include in the email of the person receiving the gift certificate line item.

---

### setProductListItem

**Signature:** `setProductListItem(productListItem : ProductListItem) : void`

**Description:** Sets the associated ProductListItem. The product list item to be set must be of type gift certificate otherwise an exception is thrown.

**Parameters:**

- `productListItem`: the product list item to be associated

---

### setRecipientEmail

**Signature:** `setRecipientEmail(recipientEmail : String) : void`

**Description:** Sets the email address of the person receiving the gift certificate line item.

**Parameters:**

- `recipientEmail`: the email address of the person receiving the gift certificate line item.

---

### setRecipientName

**Signature:** `setRecipientName(recipient : String) : void`

**Description:** Sets the name of the person receiving the gift certificate line item.

**Parameters:**

- `recipient`: the name of the person receiving the gift certificate line item.

---

### setSenderName

**Signature:** `setSenderName(sender : String) : void`

**Description:** Sets the name of the person or organization that sent the gift certificate line item.

**Parameters:**

- `sender`: the name of the person or organization that sent the gift certificate line item.

---

### setShipment

**Signature:** `setShipment(shipment : Shipment) : void`

**Description:** Associates the gift certificate line item with the specified shipment. Gift certificate line item and shipment must belong to the same line item ctnr.

**Parameters:**

- `shipment`: The new shipment of the gift certificate line item

---
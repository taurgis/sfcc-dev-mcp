## Package: dw.order

# Class ShippingLineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItem
      - dw.order.ShippingLineItem

## Description

Represents a specific line item in a shipment. The ShippingLineItem defines the general shipping costs of a shipment.

## Constants

### STANDARD_SHIPPING_ID

**Type:** String = "STANDARD_SHIPPING"

Constant used to get the standard shipping line item.

## Properties

### adjustedGrossPrice

**Type:** Money (Read Only)

The price of this shipping line item including tax after
 shipping adjustments have been applied.

### adjustedNetPrice

**Type:** Money (Read Only)

The price of this shipping line item, excluding tax after
 shipping adjustments have been applied.

### adjustedPrice

**Type:** Money (Read Only)

The adjusted price of this shipping line item. If the line item
 container is based on net pricing, the adjusted net price is returned. If
 the line item container is based on gross pricing, the adjusted gross
 price is returned.

### adjustedTax

**Type:** Money (Read Only)

The tax of this shipping line item after shipping adjustments
 have been applied.

### ID

**Type:** String (Read Only)

The ID of this ShippingLineItem.

### orderItem

**Type:** OrderItem (Read Only)

The order-item extension for this item, or null.
 An order-item extension will only exist for a ShippingLineItem which
 belongs to an Order.
 
 Order post-processing APIs (gillian) are now inactive by default and will throw
 an exception if accessed. Activation needs preliminary approval by Product Management.
 Please contact support in this case. Existing customers using these APIs are not
 affected by this change and can use the APIs until further notice.

### shippingPriceAdjustments

**Type:** Collection (Read Only)

The collection of shipping price adjustments that have been
 applied to this shipping line item.

## Constructor Summary

## Method Summary

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

Creates a shipping price adjustment to be applied to the shipping line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce. If there already exists a shipping price adjustment on this shipping line item referring to the specified promotion ID, an exception is thrown.

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

Creates a shipping price adjustment to be applied to the shipping line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce.

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

Returns the price of this shipping line item including tax after shipping adjustments have been applied.

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

Returns the price of this shipping line item, excluding tax after shipping adjustments have been applied.

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

Returns the adjusted price of this shipping line item.

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

Returns the tax of this shipping line item after shipping adjustments have been applied.

### getID

**Signature:** `getID() : String`

Returns the ID of this ShippingLineItem.

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

Returns the order-item extension for this item, or null.

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

Returns the collection of shipping price adjustments that have been applied to this shipping line item.

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

Removes the specified shipping price adjustment from this shipping line item.

## Method Detail

## Method Details

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String) : PriceAdjustment`

**Description:** Creates a shipping price adjustment to be applied to the shipping line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce. If there already exists a shipping price adjustment on this shipping line item referring to the specified promotion ID, an exception is thrown.

**Parameters:**

- `promotionID`: Promotion ID

**Returns:**

The new price adjustment line item.

---

### createShippingPriceAdjustment

**Signature:** `createShippingPriceAdjustment(promotionID : String, discount : Discount) : PriceAdjustment`

**Description:** Creates a shipping price adjustment to be applied to the shipping line item. The promotion ID is mandatory and must not be the ID of any actual promotion defined in B2C Commerce. If a shipping price adjustment on this shipping line item referring to the specified promotion ID already exists, an exception is thrown. The possible values for discount are PercentageDiscount, AmountDiscount, FixedPriceShippingDiscount. Examples: var myShippingItem : dw.order.ShippingLineItem; // assume known var paFixedShippingPrice12 : dw.order.PriceAdjustment = myShippingItem.createPriceAdjustment("myPromotionID1", new FixedPriceShippingDiscount(12)); var paTenPercent : dw.order.PriceAdjustment = myShippingItem.createPriceAdjustment("myPromotionID2", new PercentageDiscount(10)); var paReduceBy2 : dw.order.PriceAdjustment = myShippingItem.createPriceAdjustment("myPromotionID3", new AmountDiscount(2));

**Parameters:**

- `promotionID`: Promotion ID
- `discount`: The desired discount, not null

**Returns:**

The new price adjustment line item.

---

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

**Description:** Returns the price of this shipping line item including tax after shipping adjustments have been applied.

**Returns:**

the price of this shipping line item, including tax after shipping adjustments have been applied.

---

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

**Description:** Returns the price of this shipping line item, excluding tax after shipping adjustments have been applied.

**Returns:**

the price of this shipping line item, excluding tax after shipping adjustments have been applied.

---

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

**Description:** Returns the adjusted price of this shipping line item. If the line item container is based on net pricing, the adjusted net price is returned. If the line item container is based on gross pricing, the adjusted gross price is returned.

**Returns:**

either the adjusted net or gross price of this shipping line item.

---

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

**Description:** Returns the tax of this shipping line item after shipping adjustments have been applied.

**Returns:**

the tax of this shipping line item after shipping adjustments have been applied.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this ShippingLineItem.

**Returns:**

ID of this ShippingLineItem

---

### getOrderItem

**Signature:** `getOrderItem() : OrderItem`

**Description:** Returns the order-item extension for this item, or null. An order-item extension will only exist for a ShippingLineItem which belongs to an Order. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

**Returns:**

null or the order-item

---

### getShippingPriceAdjustments

**Signature:** `getShippingPriceAdjustments() : Collection`

**Description:** Returns the collection of shipping price adjustments that have been applied to this shipping line item.

**Returns:**

the collection of shipping price adjustments that have been applied to this shipping line item.

---

### removeShippingPriceAdjustment

**Signature:** `removeShippingPriceAdjustment(priceAdjustment : PriceAdjustment) : void`

**Description:** Removes the specified shipping price adjustment from this shipping line item.

**Parameters:**

- `priceAdjustment`: The price adjustment line item to remove

---
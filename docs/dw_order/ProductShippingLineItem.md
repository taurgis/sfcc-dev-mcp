## Package: dw.order

# Class ProductShippingLineItem

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.order.LineItem
      - dw.order.ProductShippingLineItem

## Description

Represents a specific line item in a shipment. A ProductShippingLineItem defines lineitem-specific shipping costs.

## Constants

### PRODUCT_SHIPPING_ID

**Type:** String = "PRODUCT_SHIPPING"

Reserved constant.

## Properties

### adjustedGrossPrice

**Type:** Money (Read Only)

The gross price of the product shipping line item after applying
 all product-shipping-level adjustments.

### adjustedNetPrice

**Type:** Money (Read Only)

The net price of the product shipping line item after applying
 all product-shipping-level adjustments.

### adjustedPrice

**Type:** Money (Read Only)

The price of the product shipping line item after applying all
 pproduct-shipping-level adjustments. For net pricing the adjusted net
 price is returned (see getAdjustedNetPrice()). For gross
 pricing, the adjusted gross price is returned (see
 getAdjustedGrossPrice()).

### adjustedTax

**Type:** Money (Read Only)

The tax of the unit after applying adjustments, in the purchase
 currency.

### priceAdjustments

**Type:** Collection (Read Only)

An iterator of price adjustments that have been applied to this
 product shipping line item.

### productLineItem

**Type:** ProductLineItem (Read Only)

The parent product line item this shipping line item belongs to.

### quantity

**Type:** Quantity

The quantity of the shipping cost.

### shipment

**Type:** Shipment (Read Only)

The shipment this shipping line item belongs to.

### surcharge

**Type:** boolean

The 'surcharge' flag.

## Constructor Summary

## Method Summary

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

Returns the gross price of the product shipping line item after applying all product-shipping-level adjustments.

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

Returns the net price of the product shipping line item after applying all product-shipping-level adjustments.

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

Returns the price of the product shipping line item after applying all pproduct-shipping-level adjustments.

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

Returns the tax of the unit after applying adjustments, in the purchase currency.

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

Returns an iterator of price adjustments that have been applied to this product shipping line item.

### getProductLineItem

**Signature:** `getProductLineItem() : ProductLineItem`

Returns the parent product line item this shipping line item belongs to.

### getQuantity

**Signature:** `getQuantity() : Quantity`

Returns the quantity of the shipping cost.

### getShipment

**Signature:** `getShipment() : Shipment`

Returns the shipment this shipping line item belongs to.

### isSurcharge

**Signature:** `isSurcharge() : boolean`

Returns the 'surcharge' flag.

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

Sets price attributes of the line item based on the purchase currency, taxation policy and line item quantity. The method sets the 'basePrice' attribute of the line item.

### setQuantity

**Signature:** `setQuantity(quantity : Quantity) : void`

Sets the quantity of the shipping cost.

### setSurcharge

**Signature:** `setSurcharge(flag : boolean) : void`

Sets the 'surcharge' flag.

## Method Detail

## Method Details

### getAdjustedGrossPrice

**Signature:** `getAdjustedGrossPrice() : Money`

**Description:** Returns the gross price of the product shipping line item after applying all product-shipping-level adjustments.

**Returns:**

gross price after applying product-shipping-level adjustments

**See Also:**

getAdjustedNetPrice()
getAdjustedPrice()

---

### getAdjustedNetPrice

**Signature:** `getAdjustedNetPrice() : Money`

**Description:** Returns the net price of the product shipping line item after applying all product-shipping-level adjustments.

**Returns:**

net price after applying product-shipping-level adjustments

**See Also:**

getAdjustedGrossPrice()
getAdjustedPrice()

---

### getAdjustedPrice

**Signature:** `getAdjustedPrice() : Money`

**Description:** Returns the price of the product shipping line item after applying all pproduct-shipping-level adjustments. For net pricing the adjusted net price is returned (see getAdjustedNetPrice()). For gross pricing, the adjusted gross price is returned (see getAdjustedGrossPrice()).

**Returns:**

Adjusted net or gross price

**See Also:**

getAdjustedGrossPrice()
getAdjustedNetPrice()

---

### getAdjustedTax

**Signature:** `getAdjustedTax() : Money`

**Description:** Returns the tax of the unit after applying adjustments, in the purchase currency.

**Returns:**

the tax of the unit after applying adjustments, in the purchase currency.

---

### getPriceAdjustments

**Signature:** `getPriceAdjustments() : Collection`

**Description:** Returns an iterator of price adjustments that have been applied to this product shipping line item.

**Returns:**

a collection of price adjustments that have been applied to this product shipping line item.

---

### getProductLineItem

**Signature:** `getProductLineItem() : ProductLineItem`

**Description:** Returns the parent product line item this shipping line item belongs to.

**Returns:**

the product line item

---

### getQuantity

**Signature:** `getQuantity() : Quantity`

**Description:** Returns the quantity of the shipping cost.

**Returns:**

the shipping quantity

---

### getShipment

**Signature:** `getShipment() : Shipment`

**Description:** Returns the shipment this shipping line item belongs to.

**Returns:**

the shipment

---

### isSurcharge

**Signature:** `isSurcharge() : boolean`

**Description:** Returns the 'surcharge' flag.

**Returns:**

true if this is a surcharge shipping cost, false if fixed shipping cost

---

### setPriceValue

**Signature:** `setPriceValue(value : Number) : void`

**Description:** Sets price attributes of the line item based on the purchase currency, taxation policy and line item quantity. The method sets the 'basePrice' attribute of the line item. Additionally, it sets the 'netPrice' attribute of the line item if the current taxation policy is 'net', and the 'grossPrice' attribute, if the current taxation policy is 'gross'. The 'netPrice'/'grossPrice' attributes are set by multiplying the specified price value with the line item quantity. If null is specified as value, the price attributes are reset to Money.NA.

**Parameters:**

- `value`: Price value or null

---

### setQuantity

**Signature:** `setQuantity(quantity : Quantity) : void`

**Description:** Sets the quantity of the shipping cost.

**Parameters:**

- `quantity`: the shipping quantity

---

### setSurcharge

**Signature:** `setSurcharge(flag : boolean) : void`

**Description:** Sets the 'surcharge' flag.

**Parameters:**

- `flag`: true if this is a surcharge shipping cost, false if this is a fixed shipping cost.

---
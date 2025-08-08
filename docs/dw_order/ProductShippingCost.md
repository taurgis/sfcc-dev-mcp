## Package: dw.order

# Class ProductShippingCost

## Inheritance Hierarchy

- Object
  - dw.order.ProductShippingCost

## Description

Instances of ProductShippingCost represent product specific shipping costs. Use ProductShippingModel.getShippingCost(ShippingMethod) to get the shipping cost for a specific product.

## Properties

### amount

**Type:** Money (Read Only)

The shipping amount.

### fixedPrice

**Type:** boolean (Read Only)

Returns true if shipping cost is a fixed-price shipping cost,
 and false if surcharge shipping cost.

### surcharge

**Type:** boolean (Read Only)

Returns true if shipping cost is a surcharge to the shipment
 shipping cost, and false if fixed-price shipping cost.

## Constructor Summary

## Method Summary

### getAmount

**Signature:** `getAmount() : Money`

Returns the shipping amount.

### isFixedPrice

**Signature:** `isFixedPrice() : boolean`

Returns true if shipping cost is a fixed-price shipping cost, and false if surcharge shipping cost.

### isSurcharge

**Signature:** `isSurcharge() : boolean`

Returns true if shipping cost is a surcharge to the shipment shipping cost, and false if fixed-price shipping cost.

## Method Detail

## Method Details

### getAmount

**Signature:** `getAmount() : Money`

**Description:** Returns the shipping amount.

**Returns:**

Shipping amount

---

### isFixedPrice

**Signature:** `isFixedPrice() : boolean`

**Description:** Returns true if shipping cost is a fixed-price shipping cost, and false if surcharge shipping cost.

**Returns:**

true of fixed-price shipping cost, else false

---

### isSurcharge

**Signature:** `isSurcharge() : boolean`

**Description:** Returns true if shipping cost is a surcharge to the shipment shipping cost, and false if fixed-price shipping cost.

**Returns:**

true of surcharge shipping cost, else false

---
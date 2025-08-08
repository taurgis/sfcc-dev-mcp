## Package: dw.catalog

# Class ProductPriceTable

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductPriceTable

## Description

A ProductPriceTable is a map of quantities to prices representing the potentially tiered prices of a product in Commerce Cloud Digital. The price of a product is the price associated with the largest quantity in the ProductPriceTable which does not exceed the purchase quantity.

## Properties

### quantities

**Type:** Collection (Read Only)

All quantities stored in the price table.

## Constructor Summary

## Method Summary

### getNextQuantity

**Signature:** `getNextQuantity(quantity : Quantity) : Quantity`

Returns the quantity following the passed quantity in the price table.

### getPercentage

**Signature:** `getPercentage(quantity : Quantity) : Number`

Returns the percentage off value of the price related to the passed quantity, calculated based on the price of the products minimum order quantity.

### getPrice

**Signature:** `getPrice(quantity : Quantity) : Money`

Returns the monetary price for the passed order quantity.

### getPriceBook

**Signature:** `getPriceBook(quantity : Quantity) : PriceBook`

Returns the price book which defined the monetary price for the passed order quantity.

### getQuantities

**Signature:** `getQuantities() : Collection`

Returns all quantities stored in the price table.

## Method Detail

## Method Details

### getNextQuantity

**Signature:** `getNextQuantity(quantity : Quantity) : Quantity`

**Description:** Returns the quantity following the passed quantity in the price table. If the passed quantity is the last entry in the price table, null is returned.

**Parameters:**

- `quantity`: the quantity to use to locate the next quantity in the price table.

**Returns:**

the next quantity or null.

---

### getPercentage

**Signature:** `getPercentage(quantity : Quantity) : Number`

**Description:** Returns the percentage off value of the price related to the passed quantity, calculated based on the price of the products minimum order quantity.

**Parameters:**

- `quantity`: the price quantity to compute the percentage off.

**Returns:**

the percentage off value of the price related to the passed quantity.

---

### getPrice

**Signature:** `getPrice(quantity : Quantity) : Money`

**Description:** Returns the monetary price for the passed order quantity. If no price is defined for the passed quantity, null is returned. This can happen if for example no price is defined for a single item.

**Parameters:**

- `quantity`: the quantity to use to determine price.

**Returns:**

price amount for the passed quantity

---

### getPriceBook

**Signature:** `getPriceBook(quantity : Quantity) : PriceBook`

**Description:** Returns the price book which defined the monetary price for the passed order quantity. If no price is defined for the passed quantity, null is returned. This can happen if for example no price is defined for a single item.

**Parameters:**

- `quantity`: the quantity to use to determine price.

**Returns:**

the price book defining this price, or null

---

### getQuantities

**Signature:** `getQuantities() : Collection`

**Description:** Returns all quantities stored in the price table.

**Returns:**

all price table quantities.

---
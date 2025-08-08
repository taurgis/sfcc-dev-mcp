## Package: dw.catalog

# Class ProductPriceInfo

## Inheritance Hierarchy

- Object
  - dw.catalog.ProductPriceInfo

## Description

Simple class representing a product price point. This class is useful because it provides additional information beyond just the price. Since the system calculates sales prices based on applicable price books, it is sometimes useful to know additional information such as which price book defined a price point, what percentage discount off the base price this value represents, and the date range for which this price point is active.

## Properties

### onlineFrom

**Type:** Date (Read Only)

The date from which the associated price point is valid. If such a date doesn't exist, e.g. as in the
 case of a continuous price point, null will be returned.

### onlineTo

**Type:** Date (Read Only)

The date until which the associated price point is valid. If such a date doesn't exist, e.g. as in the case
 of a continuous price point, null will be returned.

### percentage

**Type:** Number (Read Only)

The percentage off value of this price point related to the base
 price for the product's minimum order quantity.

### price

**Type:** Money (Read Only)

The monetary price for this price point.

### priceBook

**Type:** PriceBook (Read Only)

The price book which defined this price point.

### priceInfo

**Type:** String (Read Only)

The price info associated with this price point. This is an
 arbitrary string which a merchant can associate with a price entry. This
 can be used for example, to track which back-end system the price is
 derived from.

## Constructor Summary

## Method Summary

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

Returns the date from which the associated price point is valid.

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

Returns the date until which the associated price point is valid.

### getPercentage

**Signature:** `getPercentage() : Number`

Returns the percentage off value of this price point related to the base price for the product's minimum order quantity.

### getPrice

**Signature:** `getPrice() : Money`

Returns the monetary price for this price point.

### getPriceBook

**Signature:** `getPriceBook() : PriceBook`

Returns the price book which defined this price point.

### getPriceInfo

**Signature:** `getPriceInfo() : String`

Returns the price info associated with this price point.

## Method Detail

## Method Details

### getOnlineFrom

**Signature:** `getOnlineFrom() : Date`

**Description:** Returns the date from which the associated price point is valid. If such a date doesn't exist, e.g. as in the case of a continuous price point, null will be returned.

**Returns:**

the date from which the associated price point is valid

---

### getOnlineTo

**Signature:** `getOnlineTo() : Date`

**Description:** Returns the date until which the associated price point is valid. If such a date doesn't exist, e.g. as in the case of a continuous price point, null will be returned.

**Returns:**

the date to which the associated price point is valid

---

### getPercentage

**Signature:** `getPercentage() : Number`

**Description:** Returns the percentage off value of this price point related to the base price for the product's minimum order quantity.

**Returns:**

the percentage off value of this price point

---

### getPrice

**Signature:** `getPrice() : Money`

**Description:** Returns the monetary price for this price point.

**Returns:**

the price amount

---

### getPriceBook

**Signature:** `getPriceBook() : PriceBook`

**Description:** Returns the price book which defined this price point.

**Returns:**

the price book defining this price

---

### getPriceInfo

**Signature:** `getPriceInfo() : String`

**Description:** Returns the price info associated with this price point. This is an arbitrary string which a merchant can associate with a price entry. This can be used for example, to track which back-end system the price is derived from.

**Returns:**

the price info associated with this price point.

---
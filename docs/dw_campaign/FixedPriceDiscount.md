## Package: dw.campaign

# Class FixedPriceDiscount

## Inheritance Hierarchy

- Object
  - dw.campaign.Discount
  - dw.campaign.FixedPriceDiscount

## Description

Represents a fix price discount in the discount plan, for example "Shipping only 0.99 all orders $25 or more."

## Properties

### fixedPrice

**Type:** Number (Read Only)

The fixed price amount, for example 0.99 for a "Shipping only $0.99"
 discount.

## Constructor Summary

FixedPriceDiscount(amount : Number) Create a fixed-price-discount on the fly.

## Method Summary

### getFixedPrice

**Signature:** `getFixedPrice() : Number`

Returns the fixed price amount, for example 0.99 for a "Shipping only $0.99" discount.

## Constructor Detail

## Method Detail

## Method Details

### getFixedPrice

**Signature:** `getFixedPrice() : Number`

**Description:** Returns the fixed price amount, for example 0.99 for a "Shipping only $0.99" discount.

**Returns:**

Fixed price amount

---
## Package: dw.campaign

# Class Discount

## Inheritance Hierarchy

- Object
  - dw.campaign.Discount

## Description

Superclass of all specific discount classes.

## Constants

### TYPE_AMOUNT

**Type:** String = "AMOUNT"

Constant representing discounts of type amount.

### TYPE_BONUS

**Type:** String = "BONUS"

Constant representing discounts of type bonus.

### TYPE_BONUS_CHOICE

**Type:** String = "BONUS_CHOICE"

Constant representing discounts of type bonus choice.

### TYPE_FIXED_PRICE

**Type:** String = "FIXED_PRICE"

Constant representing discounts of type fixed-price.

### TYPE_FIXED_PRICE_SHIPPING

**Type:** String = "FIXED_PRICE_SHIPPING"

Constant representing discounts of type fixed price shipping.

### TYPE_FREE

**Type:** String = "FREE"

Constant representing discounts of type free.

### TYPE_FREE_SHIPPING

**Type:** String = "FREE_SHIPPING"

Constant representing discounts of type free shipping.

### TYPE_PERCENTAGE

**Type:** String = "PERCENTAGE"

Constant representing discounts of type percentage.

### TYPE_PERCENTAGE_OFF_OPTIONS

**Type:** String = "PERCENTAGE_OFF_OPTIONS"

Constant representing discounts of type percent off options.

### TYPE_PRICEBOOK_PRICE

**Type:** String = "PRICE_BOOK_PRICE"

Constant representing discounts of type price book price.

### TYPE_TOTAL_FIXED_PRICE

**Type:** String = "TOTAL_FIXED_PRICE"

Constant representing discounts of type total fixed price.

## Properties

### itemPromotionTiers

**Type:** Map (Read Only)

The tier index by quantity Id of Product promotion. ProductLineItems may have more than one quantity, but
 not all items of that SKU may have received the same tier of promotion. Each quantity of the ProductLineItem is
 indexed from 1 to n, where n is the quantity of the ProductLineItem, and this method returns a mapping from that
 quantity index to the index of tier of the promotion that item received. For more information about tier indexes,
 see getPromotionTier()  method.

### promotion

**Type:** Promotion (Read Only)

The promotion this discount is based on.

### promotionTier

**Type:** Number (Read Only)

The tier index for promotion at order level or bonus product.
 Promotion tiers are always evaluated in the order of the highest threshold (e.g. quantity, or amount)
 to the lowest threshold. The tier that is evaluated first (i.e. the highest quantity or amount) is indexed as 0,
 the next tier 1, etc. The lowest tier will have index n - 1, where n is the total number of tiers.

### quantity

**Type:** Number (Read Only)

The quantity of the discount. This quantity specifies how often
 this discount applies to its target object. For example, a 10% off
 discount with quantity 2 associated to a product line item with
 quantity 3 is applied to two items of the product line item. 
 Discounts of order and shipping promotions, and bonus discounts
 have a fix quantity of 1.

### type

**Type:** String (Read Only)

The type of the discount.

## Constructor Summary

## Method Summary

### getItemPromotionTiers

**Signature:** `getItemPromotionTiers() : Map`

Returns the tier index by quantity Id of Product promotion.

### getPromotion

**Signature:** `getPromotion() : Promotion`

Returns the promotion this discount is based on.

### getPromotionTier

**Signature:** `getPromotionTier() : Number`

Returns the tier index for promotion at order level or bonus product.

### getQuantity

**Signature:** `getQuantity() : Number`

Returns the quantity of the discount.

### getType

**Signature:** `getType() : String`

Returns the type of the discount.

## Method Detail

## Method Details

### getItemPromotionTiers

**Signature:** `getItemPromotionTiers() : Map`

**Description:** Returns the tier index by quantity Id of Product promotion. ProductLineItems may have more than one quantity, but not all items of that SKU may have received the same tier of promotion. Each quantity of the ProductLineItem is indexed from 1 to n, where n is the quantity of the ProductLineItem, and this method returns a mapping from that quantity index to the index of tier of the promotion that item received. For more information about tier indexes, see getPromotionTier() method.

**Returns:**

Map of Tier index by quantity Id or empty map

**See Also:**

getPromotionTier()

---

### getPromotion

**Signature:** `getPromotion() : Promotion`

**Description:** Returns the promotion this discount is based on.

**Returns:**

Promotion related to this discount

---

### getPromotionTier

**Signature:** `getPromotionTier() : Number`

**Description:** Returns the tier index for promotion at order level or bonus product. Promotion tiers are always evaluated in the order of the highest threshold (e.g. quantity, or amount) to the lowest threshold. The tier that is evaluated first (i.e. the highest quantity or amount) is indexed as 0, the next tier 1, etc. The lowest tier will have index n - 1, where n is the total number of tiers.

**Returns:**

Tier index or null

---

### getQuantity

**Signature:** `getQuantity() : Number`

**Description:** Returns the quantity of the discount. This quantity specifies how often this discount applies to its target object. For example, a 10% off discount with quantity 2 associated to a product line item with quantity 3 is applied to two items of the product line item. Discounts of order and shipping promotions, and bonus discounts have a fix quantity of 1.

**Returns:**

Discount quantity

---

### getType

**Signature:** `getType() : String`

**Description:** Returns the type of the discount.

**Returns:**

Discount type

---
## Package: dw.campaign

# Class ApproachingDiscount

## Inheritance Hierarchy

- Object
  - dw.campaign.ApproachingDiscount

## Description

Transient class representing a discount that a LineItemCtnr "almost" qualifies for based on the amount of merchandise in it. Storefronts can display information about approaching discounts to customers in order to entice them to buy more merchandise. Approaching discounts are calculated on the basis of a DiscountPlan instead of a LineItemCtnr itself. When one of PromotionMgr.getDiscounts(LineItemCtnr) or PromotionMgr.getDiscounts(LineItemCtnr, PromotionPlan) is called, the promotions engine calculates the discounts the LineItemCtnr receives based on the promotions in context, and also tries to determine the discounts the LineItemCtnr would receive if additional merchandise were added. DiscountPlan provides different methods to retrieve this approaching discount info. Merchants can use these fine-grained methods to display information about approaching order discounts on the cart page, and approaching shipping discounts on the shipping method page during checkout, for example. The merchant may include or exclude individual promotions from being included in this list, and define distance thresholds when configuring their promotions.

## Properties

### conditionThreshold

**Type:** Money (Read Only)

The amount of merchandise required in the cart in order to receive the
 discount. For an order promotion "Get 15% off orders of $100 or more",
 the condition threshold is $100.00.

### discount

**Type:** Discount (Read Only)

The discount that the customer will receive if he adds more merchandise
 to the cart. For an order promotion "Get 15% off orders of $100 or more",
 the discount is a PercentageDiscount object.

### distanceFromConditionThreshold

**Type:** Money (Read Only)

Convenience method that returns
 getConditionThreshold().subtract(getMerchandiseValue())

### merchandiseTotal

**Type:** Money (Read Only)

The amount of merchandise in the cart contributing towards the condition
 threshold. This will always be less than the condition threshold.

## Constructor Summary

## Method Summary

### getConditionThreshold

**Signature:** `getConditionThreshold() : Money`

The amount of merchandise required in the cart in order to receive the discount.

### getDiscount

**Signature:** `getDiscount() : Discount`

The discount that the customer will receive if he adds more merchandise to the cart.

### getDistanceFromConditionThreshold

**Signature:** `getDistanceFromConditionThreshold() : Money`

Convenience method that returns getConditionThreshold().subtract(getMerchandiseValue())

### getMerchandiseTotal

**Signature:** `getMerchandiseTotal() : Money`

The amount of merchandise in the cart contributing towards the condition threshold.

## Method Detail

## Method Details

### getConditionThreshold

**Signature:** `getConditionThreshold() : Money`

**Description:** The amount of merchandise required in the cart in order to receive the discount. For an order promotion "Get 15% off orders of $100 or more", the condition threshold is $100.00.

**Returns:**

The amount of merchandise required in the cart in order to receive the discount.

---

### getDiscount

**Signature:** `getDiscount() : Discount`

**Description:** The discount that the customer will receive if he adds more merchandise to the cart. For an order promotion "Get 15% off orders of $100 or more", the discount is a PercentageDiscount object.

**Returns:**

The discount that the customer will receive if he adds more merchandise to the cart.

---

### getDistanceFromConditionThreshold

**Signature:** `getDistanceFromConditionThreshold() : Money`

**Description:** Convenience method that returns getConditionThreshold().subtract(getMerchandiseValue())

**Returns:**

The amount of money needed to add to the order or shipment in order to receive the discount.

---

### getMerchandiseTotal

**Signature:** `getMerchandiseTotal() : Money`

**Description:** The amount of merchandise in the cart contributing towards the condition threshold. This will always be less than the condition threshold.

**Returns:**

The amount of merchandise in the cart contributing towards the condition threshold.

---
## Package: dw.campaign

# Class DiscountPlan

## Inheritance Hierarchy

- Object
  - dw.campaign.DiscountPlan

## Description

DiscountPlan represents a set of Discounts. Instances of the class are returned by the PromotionMgr when requesting applicable discounts for a specified set of promotions and a line item container (see PromotionMgr.getDiscounts(LineItemCtnr, PromotionPlan)). DiscountPlan provides methods to access the discounts contained in the plan, add additional discounts to the plan (future) or remove discounts from the plan.

## Properties

### approachingOrderDiscounts

**Type:** Collection (Read Only)

Get the collection of order discounts that the LineItemCtnr "almost"
 qualifies for based on the merchandise total in the cart. Nearness is
 controlled by thresholds configured at the promotion level.
 
 The collection of returned approaching discounts is ordered by the
 condition threshold of the promotion (e.g. "spend $100 and get 10% off"
 discount is returned before "spend $150 and get 15% off" discount.) A
 discount is not returned if it would be prevented from applying (because
 of compatibility rules) by an order discount already in the DiscountPlan
 or an approaching order discount with a lower condition threshold.

### bonusDiscounts

**Type:** Collection (Read Only)

All bonus discounts contained in the discount plan.

### lineItemCtnr

**Type:** LineItemCtnr (Read Only)

Returns line item container associated with discount plan. 
 A discount plan is created from and associated with a line item container.
 This method returns the line item container associated with this discount plan.

### orderDiscounts

**Type:** Collection (Read Only)

The percentage and amount order discounts contained in the
 discount plan.

## Constructor Summary

## Method Summary

### getApproachingOrderDiscounts

**Signature:** `getApproachingOrderDiscounts() : Collection`

Get the collection of order discounts that the LineItemCtnr "almost" qualifies for based on the merchandise total in the cart.

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment) : Collection`

Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment.

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment, shippingMethod : ShippingMethod) : Collection`

Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment.

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment, shippingMethods : Collection) : Collection`

Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment.

### getBonusDiscounts

**Signature:** `getBonusDiscounts() : Collection`

Returns all bonus discounts contained in the discount plan.

### getLineItemCtnr

**Signature:** `getLineItemCtnr() : LineItemCtnr`

Returns line item container associated with discount plan.

### getOrderDiscounts

**Signature:** `getOrderDiscounts() : Collection`

Returns the percentage and amount order discounts contained in the discount plan.

### getProductDiscounts

**Signature:** `getProductDiscounts(productLineItem : ProductLineItem) : Collection`

Returns the percentage, amount and fix price discounts associated with the specified product line item.

### getProductShippingDiscounts

**Signature:** `getProductShippingDiscounts(productLineItem : ProductLineItem) : Collection`

Returns the product-shipping discounts associated with the specified product line item.

### getShippingDiscounts

**Signature:** `getShippingDiscounts(shipment : Shipment) : Collection`

Returns the percentage, amount and fix price discounts associated with the specified shipment.

### removeDiscount

**Signature:** `removeDiscount(discount : Discount) : void`

Removes the specified discount from the discount plan.

## Method Detail

## Method Details

### getApproachingOrderDiscounts

**Signature:** `getApproachingOrderDiscounts() : Collection`

**Description:** Get the collection of order discounts that the LineItemCtnr "almost" qualifies for based on the merchandise total in the cart. Nearness is controlled by thresholds configured at the promotion level. The collection of returned approaching discounts is ordered by the condition threshold of the promotion (e.g. "spend $100 and get 10% off" discount is returned before "spend $150 and get 15% off" discount.) A discount is not returned if it would be prevented from applying (because of compatibility rules) by an order discount already in the DiscountPlan or an approaching order discount with a lower condition threshold.

**Returns:**

Collection of approaching order discounts ordered by the condition threshold of the promotion ascending.

---

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment) : Collection`

**Description:** Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment. Nearness is controlled by thresholds configured at the promotion level. The collection of returned approaching discounts is ordered by the condition threshold of the promotion (e.g. "spend $100 and get free standard shipping" discount is returned before "spend $150 and get free standard shipping" discount.) A discount is not returned if it would be prevented from applying (because of compatibility rules) by a shipping discount already in the DiscountPlan or an approaching shipping discount with a lower condition threshold.

**Parameters:**

- `shipment`: The shipment to calculate approaching discounts for.

**Returns:**

Collection of approaching shipping discounts ordered by the condition threshold of the promotion ascending.

---

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment, shippingMethod : ShippingMethod) : Collection`

**Description:** Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment. Here "almost" is controlled by thresholds configured at the promotion level. This method only returns discounts for shipping promotions which apply to the passed shipping method. The collection of returned approaching discounts is ordered by the condition threshold of the promotion (e.g. "spend $100 and get free standard shipping" discount is returned before "spend $150 and get free standard shipping" discount.) A discount is not returned if it would be prevented from applying (because of compatibility rules) by a shipping discount already in the DiscountPlan or an approaching shipping discount with a lower condition threshold.

**Parameters:**

- `shipment`: The shipment to calculate approaching discounts for.
- `shippingMethod`: The shipping method to filter by.

**Returns:**

Collection of approaching shipping discounts ordered by the condition threshold of the promotion, ascending.

---

### getApproachingShippingDiscounts

**Signature:** `getApproachingShippingDiscounts(shipment : Shipment, shippingMethods : Collection) : Collection`

**Description:** Get the collection of shipping discounts that the passed shipment "almost" qualifies for based on the merchandise total in the shipment. Here "almost" is controlled by thresholds configured at the promotion level. This method only returns discounts for shipping promotions which apply to one of the passed shipping methods. The collection of returned approaching discounts is ordered by the condition threshold of the promotion (e.g. "spend $100 and get free standard shipping" discount is returned before "spend $150 and get free standard shipping" discount.) A discount is not returned if it would be prevented from applying (because of compatibility rules) by a shipping discount already in the DiscountPlan or an approaching shipping discount with a lower condition threshold.

**Parameters:**

- `shipment`: The shipment to calculate approaching discounts for.
- `shippingMethods`: The shipping methods to filter by.

**Returns:**

Collection of approaching shipping discounts ordered by the condition threshold of the promotion ascending.

---

### getBonusDiscounts

**Signature:** `getBonusDiscounts() : Collection`

**Description:** Returns all bonus discounts contained in the discount plan.

**Returns:**

All bonus discounts contained in discount plan

---

### getLineItemCtnr

**Signature:** `getLineItemCtnr() : LineItemCtnr`

**Description:** Returns line item container associated with discount plan. A discount plan is created from and associated with a line item container. This method returns the line item container associated with this discount plan.

**Returns:**

Line item container associated with plan

---

### getOrderDiscounts

**Signature:** `getOrderDiscounts() : Collection`

**Description:** Returns the percentage and amount order discounts contained in the discount plan.

**Returns:**

Order discounts contained in the discount plan

---

### getProductDiscounts

**Signature:** `getProductDiscounts(productLineItem : ProductLineItem) : Collection`

**Description:** Returns the percentage, amount and fix price discounts associated with the specified product line item. If the specified product line item is not contained in the discount plan, an empty collection is returned.

**Parameters:**

- `productLineItem`: Product line item

**Returns:**

Discounts associated with specified product line item

---

### getProductShippingDiscounts

**Signature:** `getProductShippingDiscounts(productLineItem : ProductLineItem) : Collection`

**Description:** Returns the product-shipping discounts associated with the specified product line item. If the specified product line item is not contained in the discount plan, an empty collection is returned.

**Parameters:**

- `productLineItem`: Product line item

**Returns:**

Product-shipping discounts associated with specified product line item

---

### getShippingDiscounts

**Signature:** `getShippingDiscounts(shipment : Shipment) : Collection`

**Description:** Returns the percentage, amount and fix price discounts associated with the specified shipment. If the specified shipment is not contained in the discount plan, an empty collection is returned.

**Parameters:**

- `shipment`: the shipment for which to fetch discounts.

**Returns:**

Discounts associated with specified shipment

---

### removeDiscount

**Signature:** `removeDiscount(discount : Discount) : void`

**Description:** Removes the specified discount from the discount plan. This method should only be used for very simple discount scenarios. It is not recommended to use the method in case of stacked discounts (i.e. multiple order or product discounts), or complex discount types like Buy X Get Y or Total Fixed Price, since correct re-calculation of the discount plan based on the promotion rules is not guaranteed.

**Parameters:**

- `discount`: Discount to be removed

---
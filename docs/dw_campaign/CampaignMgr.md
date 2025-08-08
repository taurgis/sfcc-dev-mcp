## Package: dw.campaign

# Class CampaignMgr

## Inheritance Hierarchy

- Object
  - dw.campaign.CampaignMgr

## Description

CampaignMgr provides static methods for managing campaign-specific operations such as accessing promotions or updating promotion line items.

## Properties

### applicablePromotions

**Type:** Collection (Read Only)

The enabled promotions of active campaigns applicable for the
 current customer and source code.
 
 Note that this method does not return any coupon-based promotions.

## Constructor Summary

## Method Summary

### applyBonusPromotions

**Signature:** `static applyBonusPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

This method has been deprecated and should not be used anymore.

### applyOrderPromotions

**Signature:** `static applyOrderPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

Applies the applicable order promotions in the specified collection to the specified line item container.

### applyProductPromotions

**Signature:** `static applyProductPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

Applies all applicable product promotions in the specified collection to the specified line item container.

### applyShippingPromotions

**Signature:** `static applyShippingPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

Applies all applicable shipping promotions in the specified collection to the specified line item container.

### getApplicableConditionalPromotions

**Signature:** `static getApplicableConditionalPromotions(product : Product) : Collection`

Returns the enabled promotions of active campaigns applicable for the current customer and source code for which the specified product is a qualifiying product.

### getApplicablePromotions

**Signature:** `static getApplicablePromotions(product : Product) : Collection`

Returns the enabled promotions of active campaigns applicable for the current customer and source code for which the specified product is a discounted product.

### getApplicablePromotions

**Signature:** `static getApplicablePromotions(lineItemCtnr : LineItemCtnr) : Collection`

Returns the enabled promotions of active campaigns applicable for the current customer, source code and any coupon contained in the specified line item container.

### getApplicablePromotions

**Signature:** `static getApplicablePromotions() : Collection`

Returns the enabled promotions of active campaigns applicable for the current customer and source code.

### getCampaignByID

**Signature:** `static getCampaignByID(id : String) : Campaign`

Returns the campaign identified by the specified ID.

### getConditionalPromotions

**Signature:** `static getConditionalPromotions(product : Product) : Collection`

Returns the enabled promotions of active campaigns for which the specified product is a qualifiying product.

### getPromotion

**Signature:** `static getPromotion(couponCode : String) : Promotion`

Returns the promotion associated with the specified coupon code.

### getPromotionByCouponCode

**Signature:** `static getPromotionByCouponCode(couponCode : String) : Promotion`

Returns the promotion associated with the specified coupon code.

### getPromotionByID

**Signature:** `static getPromotionByID(id : String) : Promotion`

Returns the promotion identified by the specified ID.

### getPromotions

**Signature:** `static getPromotions(product : Product) : Collection`

Returns the enabled promotions of active campaigns for which the specified product is a discounted product.

## Method Detail

## Method Details

### applyBonusPromotions

**Signature:** `static applyBonusPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

**Description:** This method has been deprecated and should not be used anymore. Instead, use PromotionMgr to apply promotions to line item containers. The method does nothing, since bonus promotions are applied as product or order promotions using methods applyProductPromotions(LineItemCtnr, Collection) and applyOrderPromotions(LineItemCtnr, Collection). The method returns 'true' if any the line item container contains any bonus product line items, and otherwise false.

**Deprecated:**

Use PromotionMgr instead.

**Parameters:**

- `lineItemCtnr`: Basket or order
- `promotions`: Parameter not used, can be null

**Returns:**

True if line item container contains bonus product line items, else false

---

### applyOrderPromotions

**Signature:** `static applyOrderPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

**Description:** Applies the applicable order promotions in the specified collection to the specified line item container. This method has been deprecated and should not be used anymore. Instead, use PromotionMgr to apply promotions to line item containers. Note that the method does also apply any bonus discounts defined as order promotions (see also applyBonusPromotions(LineItemCtnr, Collection)).

**Deprecated:**

Use PromotionMgr

**Parameters:**

- `lineItemCtnr`: basket or order
- `promotions`: list of all promotions to be applied

**Returns:**

true if changes were made to the line item container, false otherwise.

---

### applyProductPromotions

**Signature:** `static applyProductPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

**Description:** Applies all applicable product promotions in the specified collection to the specified line item container. This method has been deprecated and should not be used anymore. Instead, use PromotionMgr to apply promotions to line item containers. Note that the method does also apply any bonus discounts defined as product promotions (see also applyBonusPromotions(LineItemCtnr, Collection)).

**Deprecated:**

Use PromotionMgr

**Parameters:**

- `lineItemCtnr`: basket or order
- `promotions`: list of all promotions to be applied

**Returns:**

true if changes were made to the line item container, false otherwise.

---

### applyShippingPromotions

**Signature:** `static applyShippingPromotions(lineItemCtnr : LineItemCtnr, promotions : Collection) : boolean`

**Description:** Applies all applicable shipping promotions in the specified collection to the specified line item container. This method has been deprecated and should not be used anymore. Instead, use PromotionMgr to apply promotions to line item containers.

**Deprecated:**

Use PromotionMgr

**Parameters:**

- `lineItemCtnr`: basket or order
- `promotions`: list of all promotions to be applied

**Returns:**

true if changes were made to the line item container, false otherwise.

---

### getApplicableConditionalPromotions

**Signature:** `static getApplicableConditionalPromotions(product : Product) : Collection`

**Description:** Returns the enabled promotions of active campaigns applicable for the current customer and source code for which the specified product is a qualifiying product. As a replacement of this deprecated method, use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product). Unlike getApplicableConditionalPromotions(Product), PromotionPlan.getProductPromotions(Product) returns all promotions related to the specified product, regardless of whether the product is qualifying, discounted, or both, and also returns promotions where the product is a bonus product.

**Deprecated:**

Use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product)

**Parameters:**

- `product`: Qualifying product

**Returns:**

List of active promotions

---

### getApplicablePromotions

**Signature:** `static getApplicablePromotions(product : Product) : Collection`

**Description:** Returns the enabled promotions of active campaigns applicable for the current customer and source code for which the specified product is a discounted product. Note that this method does not return any coupon-based promotions. As a replacement of this deprecated method, use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product). Unlike getApplicablePromotions(Product), PromotionPlan.getProductPromotions(Product) returns all promotions related to the specified product, regardless of whether the product is qualifying, discounted, or both, and also returns promotions where the product is a bonus product.

**Deprecated:**

Use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product)

**Parameters:**

- `product`: The product whose promotions are returned.

**Returns:**

A list of promotions

---

### getApplicablePromotions

**Signature:** `static getApplicablePromotions(lineItemCtnr : LineItemCtnr) : Collection`

**Description:** Returns the enabled promotions of active campaigns applicable for the current customer, source code and any coupon contained in the specified line item container. Note that although the method has been deprecated, no replacement method is provided.

**Deprecated:**

There is no replacement for this method.

**Parameters:**

- `lineItemCtnr`: the basket or order

**Returns:**

list of all applicable promotion for the given basket or order

---

### getApplicablePromotions

**Signature:** `static getApplicablePromotions() : Collection`

**Description:** Returns the enabled promotions of active campaigns applicable for the current customer and source code. Note that this method does not return any coupon-based promotions.

**Deprecated:**

Use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getPromotions()

**Returns:**

List of active promotions

---

### getCampaignByID

**Signature:** `static getCampaignByID(id : String) : Campaign`

**Description:** Returns the campaign identified by the specified ID.

**Deprecated:**

Use PromotionMgr.getCampaign(String)

**Parameters:**

- `id`: Campaign ID

**Returns:**

Campaign or null if not found

---

### getConditionalPromotions

**Signature:** `static getConditionalPromotions(product : Product) : Collection`

**Description:** Returns the enabled promotions of active campaigns for which the specified product is a qualifiying product. Note that the method also returns coupon-based promotions. As a replacement of this deprecated method, use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product). Unlike getConditionalPromotions(Product), PromotionPlan.getProductPromotions(Product) returns all promotions related to the specified product, regardless of whether the product is qualifying, discounted, or both, and also returns promotions where the product is a bonus product.

**Deprecated:**

Use PromotionMgr.getActivePromotions() and PromotionPlan.getProductPromotions(Product)

**Parameters:**

- `product`: The product whose conditional promotions are returned.

**Returns:**

A list of promotions

---

### getPromotion

**Signature:** `static getPromotion(couponCode : String) : Promotion`

**Description:** Returns the promotion associated with the specified coupon code.

**Deprecated:**

Coupons are now related to multiple promotions. Method returns the first promotion associated with the coupon code in case of multiple assigned promotions.

**Parameters:**

- `couponCode`: The coupon code used to lookup the promotion

**Returns:**

The resolved promotion object or null if none was found

---

### getPromotionByCouponCode

**Signature:** `static getPromotionByCouponCode(couponCode : String) : Promotion`

**Description:** Returns the promotion associated with the specified coupon code.

**Deprecated:**

Coupons are now related to multiple promotions. Method returns the first promotion associated with the coupon in case of multiple assigned promotions

**Parameters:**

- `couponCode`: Coupon code

**Returns:**

The associated promotion or null

---

### getPromotionByID

**Signature:** `static getPromotionByID(id : String) : Promotion`

**Description:** Returns the promotion identified by the specified ID.

**Deprecated:**

Use PromotionMgr.getPromotion(String)

**Parameters:**

- `id`: Promotion ID

**Returns:**

Promotion or null if not found

---

### getPromotions

**Signature:** `static getPromotions(product : Product) : Collection`

**Description:** Returns the enabled promotions of active campaigns for which the specified product is a discounted product. Note that method does only return promotions based on customer groups or source codes. As a replacement of this deprecated method, use PromotionMgr.getActiveCustomerPromotions() and PromotionPlan.getProductPromotions(Product). Unlike getPromotions(Product), PromotionPlan.getProductPromotions(Product) returns all promotions related to the specified product, regardless of whether the product is qualifying, discounted, or both, and also returns promotions where the product is a bonus product.

**Deprecated:**

Use PromotionMgr.getActivePromotions() and PromotionPlan.getProductPromotions(Product)

**Parameters:**

- `product`: Discounted product

**Returns:**

List of promotions

---
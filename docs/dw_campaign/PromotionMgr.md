## Package: dw.campaign

# Class PromotionMgr

## Inheritance Hierarchy

- Object
  - dw.campaign.PromotionMgr

## Description

PromotionMgr is used to access campaigns and promotion definitions, display active or upcoming promotions in a storefront, and to calculate and apply promotional discounts to line item containers. To access campaign and promotion definitions, use methods getCampaigns(), getCampaign(String), getPromotions() and getPromotion(String). To display active or upcoming promotions in the storefront, e.g. on product pages, various methods are provided. getActivePromotions() returns a PromotionPlan with all enabled promotions scheduled for now. getActiveCustomerPromotions() returns a PromotionPlan with all enabled promotions scheduled for now and applicable for the session currency, current customer and active source code. getUpcomingPromotions(Number) returns a PromotionPlan with all promotions that are enabled, not scheduled for now, but scheduled for any time between now and now + previewTime(hours). Applying promotions to line item containers is a 3-step process, and PromotionMgr provides methods supporting each of these steps. Convenience methods can be used that execute all three steps at once, or the steps can be executed individually if you need to customize the output of the steps due to specific business rules. Step 1 - calculate active customer promotions: Determine the active promotions for the session currency, current customer, source code and redeemed coupons. Step 2 - calculate applicable discounts: Based on the active promotions determined in step 1, applicable discounts are calculated. Step 3 - apply discounts: applicable discounts are applied to a line item container by creating price adjustment line items. The simpliest way to execute steps 1-3 is to use method applyDiscounts(LineItemCtnr). The method identifies all active customer promotions, calculates and applies applicable discounts. Due to specific business rules it might be necessary to manipulate the set of applicable discounts calculated by the promotion engine before applying them to the line item container. To implement such a scenario, you want to use method getDiscounts(LineItemCtnr), which identifies all active customer promotions, and calculates and returns applicable discounts in an instance of DiscountPlan. The discount plan contains a description for all applicable discounts for the specified line item container, and you can remove discounts from it if necessary. The customized discount plan can then be passed on for application by using method applyDiscounts(DiscountPlan). Due to specific business rules it might be necessary to manipulate the set of active customer promotions before calculating applicable discounts from it. For example, you might want to add promotions to the plan or remove promotions from it. You want to use method getActiveCustomerPromotions() and getActiveCustomerPromotions(Boolean), which identifies all active customer promotions and returns an instance of PromotionPlan. You can add promotions to the promotion plan or remove promotions from the plan. The customized promotion plan can then be passed on to calculate applicable discounts by using method getDiscounts(LineItemCtnr, PromotionPlan).

## Properties

### activeCustomerPromotions

**Type:** PromotionPlan (Read Only)

All promotions scheduled for now and applicable for the
 session currency, current customer, source code, or presented coupons.

 The active promotions are returned in an instance of
 PromotionPlan. The promotion plan contains all
 promotions assigned to any customer group of the current customer, the
 current source code, or coupons in the current session basket.

### activePromotions

**Type:** PromotionPlan (Read Only)

All promotions scheduled for now, and applicable for the
 session currency but regardless of current customer or source code.
 The active promotions are returned in an instance of PromotionPlan.

### campaigns

**Type:** Collection (Read Only)

All campaigns of the current site in no specific order.

### promotions

**Type:** Collection (Read Only)

All promotions of the current site in no specific order.

## Constructor Summary

## Method Summary

### applyDiscounts

**Signature:** `static applyDiscounts(lineItemCtnr : LineItemCtnr) : void`

Identifies active promotions, calculates the applicable discounts from these promotions and applies these discounts to the specified line item container.

### applyDiscounts

**Signature:** `static applyDiscounts(discountPlan : DiscountPlan) : void`

Applies the discounts contained in the specified discount plan to the line item container associated with the discount plan.

### getActiveCustomerPromotions

**Signature:** `static getActiveCustomerPromotions() : PromotionPlan`

Returns all promotions scheduled for now and applicable for the session currency, current customer, source code, or presented coupons. The active promotions are returned in an instance of PromotionPlan.

### getActiveCustomerPromotions

**Signature:** `static getActiveCustomerPromotions(ignoreCouponCondition : boolean) : PromotionPlan`

Returns all promotions scheduled for now and applicable for the session currency, current customer, source code, or presented coupons.

### getActiveCustomerPromotionsForCampaign

**Signature:** `static getActiveCustomerPromotionsForCampaign(campaign : Campaign, from : Date, to : Date) : PromotionPlan`

Returns all promotions assigned to the passed campaign, which are active at some point within the specified date range, and are applicable for the current customer, source code, or presented coupons.

### getActivePromotions

**Signature:** `static getActivePromotions() : PromotionPlan`

Returns all promotions scheduled for now, and applicable for the session currency but regardless of current customer or source code. The active promotions are returned in an instance of PromotionPlan.

### getActivePromotionsForCampaign

**Signature:** `static getActivePromotionsForCampaign(campaign : Campaign, from : Date, to : Date) : PromotionPlan`

Returns all promotions assigned to the passed campaign which are active at some point within the specified date range.

### getCampaign

**Signature:** `static getCampaign(id : String) : Campaign`

Returns the campaign identified by the specified ID.

### getCampaigns

**Signature:** `static getCampaigns() : Collection`

Returns all campaigns of the current site in no specific order.

### getDiscounts

**Signature:** `static getDiscounts(lineItemCtnr : LineItemCtnr) : DiscountPlan`

Returns the discounts applicable for the current customer, active source code and specified line item container.

### getDiscounts

**Signature:** `static getDiscounts(lineItemCtnr : LineItemCtnr, promotionPlan : PromotionPlan) : DiscountPlan`

Returns the discounts applicable for the current customer, active source code and specified line item container, based on the specified promotion plan.

### getPromotion

**Signature:** `static getPromotion(id : String) : Promotion`

Returns the promotion identified by the specified ID.

### getPromotions

**Signature:** `static getPromotions() : Collection`

Returns all promotions of the current site in no specific order.

### getUpcomingCustomerPromotions

**Signature:** `static getUpcomingCustomerPromotions(previewTime : Number) : PromotionPlan`

Returns all promotions currently inactive, but scheduled for any time between now and now + previewTime(hours), and which are applicable based on the current customer, source code, and coupons in the current basket. The parameter previewTime specifies for how many hours promotions should be previewed.

### getUpcomingPromotions

**Signature:** `static getUpcomingPromotions(previewTime : Number) : PromotionPlan`

Returns all promotions currently inactive, but scheduled for any time between now and now + previewTime(hours).

## Method Detail

## Method Details

### applyDiscounts

**Signature:** `static applyDiscounts(lineItemCtnr : LineItemCtnr) : void`

**Description:** Identifies active promotions, calculates the applicable discounts from these promotions and applies these discounts to the specified line item container. As a result of this method, the specified line item container contains price adjustments and/or bonus product line items for all applicable discounts. The method also removes price adjustment and/or bonus product line items from the line item container if the related to promotions/discounts are no longer applicable.

**Parameters:**

- `lineItemCtnr`: Line item ctnr to apply promotions on

---

### applyDiscounts

**Signature:** `static applyDiscounts(discountPlan : DiscountPlan) : void`

**Description:** Applies the discounts contained in the specified discount plan to the line item container associated with the discount plan. As a result of this method, the specified line item container contains price adjustments and/or bonus product line items for all discounts contained in the specified discount plan. The method also removes price adjustment and/or bonus product line items from the line item container if the specified discount plan does not contain the related discount. Note that the method does not evaluate if the discounts in the specified discount plan are applicable nor that the promotions related to these discounts are active.

**Parameters:**

- `discountPlan`: Discount plan to apply to associated line item container

**See Also:**

getDiscounts(LineItemCtnr)
applyDiscounts(LineItemCtnr)

---

### getActiveCustomerPromotions

**Signature:** `static getActiveCustomerPromotions() : PromotionPlan`

**Description:** Returns all promotions scheduled for now and applicable for the session currency, current customer, source code, or presented coupons. The active promotions are returned in an instance of PromotionPlan. The promotion plan contains all promotions assigned to any customer group of the current customer, the current source code, or coupons in the current session basket.

**Returns:**

PromotionPlan with active customer promotions

**See Also:**

getActivePromotions()

---

### getActiveCustomerPromotions

**Signature:** `static getActiveCustomerPromotions(ignoreCouponCondition : boolean) : PromotionPlan`

**Description:** Returns all promotions scheduled for now and applicable for the session currency, current customer, source code, or presented coupons. The active promotions are returned in an instance of PromotionPlan. The promotion plan contains all promotions assigned to any customer group of the current customer, the current source code, or coupons in the current session basket.

**Parameters:**

- `ignoreCouponCondition`: true if coupon condition will be ignored when get active promotions.

**Returns:**

PromotionPlan with active customer promotions

---

### getActiveCustomerPromotionsForCampaign

**Signature:** `static getActiveCustomerPromotionsForCampaign(campaign : Campaign, from : Date, to : Date) : PromotionPlan`

**Description:** Returns all promotions assigned to the passed campaign, which are active at some point within the specified date range, and are applicable for the current customer, source code, or presented coupons. A promotion must be active for an actual time period within the passed date range, and not just a single point. The passed campaign and dates must not be null or an exception is thrown. It is valid for the from and to dates to be in the past. If an invalid time range is specified (i.e. from is after to), the returned PromotionPlan will be empty.

**Parameters:**

- `campaign`: The campaign, must not be null or an exception is thrown.
- `from`: The start of the date range to consider. If null, this signifies an open ended time period.
- `to`: The end of the date range to consider. If null, this signifies an open ended time period.

**Returns:**

PromotionPlan with promotions matching all the criteria.

---

### getActivePromotions

**Signature:** `static getActivePromotions() : PromotionPlan`

**Description:** Returns all promotions scheduled for now, and applicable for the session currency but regardless of current customer or source code. The active promotions are returned in an instance of PromotionPlan.

**Returns:**

PromotionPlan with active promotions

**See Also:**

getActiveCustomerPromotions()

---

### getActivePromotionsForCampaign

**Signature:** `static getActivePromotionsForCampaign(campaign : Campaign, from : Date, to : Date) : PromotionPlan`

**Description:** Returns all promotions assigned to the passed campaign which are active at some point within the specified date range. A promotion must be active for an actual time period within the passed date range, and not just a single point. A promotion must be applicable for the session currency. This method considers only the enabled flags and time conditions of the promotion and campaign. It does not consider whether the current customer satisfies the qualifiers of the promotion (customer group, source code, or coupon). The passed campaign and dates must not be null or an exception is thrown. It is valid for the from and/or to dates to be in the past. If an invalid time range is specified (i.e. from is after to), the returned PromotionPlan will be empty.

**Parameters:**

- `campaign`: The campaign. Must not be null.
- `from`: The start of the date range to consider. Must not be null
- `to`: The end of the date range to consider. Must not be null.

**Returns:**

PromotionPlan with promotions matching all the criteria.

---

### getCampaign

**Signature:** `static getCampaign(id : String) : Campaign`

**Description:** Returns the campaign identified by the specified ID.

**Parameters:**

- `id`: Campaign ID

**Returns:**

Campaign or null if not found

---

### getCampaigns

**Signature:** `static getCampaigns() : Collection`

**Description:** Returns all campaigns of the current site in no specific order.

**Returns:**

All campaigns of current site

---

### getDiscounts

**Signature:** `static getDiscounts(lineItemCtnr : LineItemCtnr) : DiscountPlan`

**Description:** Returns the discounts applicable for the current customer, active source code and specified line item container. This method identifies all active promotions assigned to the customer groups of the current customer, the active source code and any coupon contained in the specified line item container, and calculates applicable discounts from these promotions. The applicable discounts are contained in the returned instance of DiscountPlan.

**Parameters:**

- `lineItemCtnr`: Line item container

**Returns:**

Discount plan with applicable discounts

---

### getDiscounts

**Signature:** `static getDiscounts(lineItemCtnr : LineItemCtnr, promotionPlan : PromotionPlan) : DiscountPlan`

**Description:** Returns the discounts applicable for the current customer, active source code and specified line item container, based on the specified promotion plan. This method calculates applicable discounts from the promotions in the specified promotion plan. Note that any promotion in the promotion plan that is inactive, or not applicable for the current customer or source code, is being ignored. The applicable discounts are contained in the returned instance of DiscountPlan.

**Parameters:**

- `lineItemCtnr`: Line item container
- `promotionPlan`: Promotion plan with active promotions

**Returns:**

Discount plan with applicable discounts

---

### getPromotion

**Signature:** `static getPromotion(id : String) : Promotion`

**Description:** Returns the promotion identified by the specified ID. The same logical promotion may be assigned to multiple campaigns or AB-tests. In this case, the system returns the instance of highest rank. Some attributes of the returned Promotion may vary based on exactly which instance is returned. This method returns null if there is no promotion in the system with the given ID, or if a promotion with the given ID exists but it is not assigned to any campaign or AB-test.

**Parameters:**

- `id`: Promotion ID

**Returns:**

Promotion or null if not found

---

### getPromotions

**Signature:** `static getPromotions() : Collection`

**Description:** Returns all promotions of the current site in no specific order.

**Returns:**

All promotions of current site

---

### getUpcomingCustomerPromotions

**Signature:** `static getUpcomingCustomerPromotions(previewTime : Number) : PromotionPlan`

**Description:** Returns all promotions currently inactive, but scheduled for any time between now and now + previewTime(hours), and which are applicable based on the current customer, source code, and coupons in the current basket. The parameter previewTime specifies for how many hours promotions should be previewed.

**Parameters:**

- `previewTime`: Preview time in hours

**Returns:**

PromotionPlan with active promotions

**See Also:**

getActivePromotions()

---

### getUpcomingPromotions

**Signature:** `static getUpcomingPromotions(previewTime : Number) : PromotionPlan`

**Description:** Returns all promotions currently inactive, but scheduled for any time between now and now + previewTime(hours). The upcoming promotions are returned in an instance of PromotionPlan and might not necessarily be applicable for the current customer or source code. The parameter previewTime specifies for how many hours promotions should be previewed.

**Parameters:**

- `previewTime`: Preview time in hours

**Returns:**

PromotionPlan with active promotions

**See Also:**

getActivePromotions()

---